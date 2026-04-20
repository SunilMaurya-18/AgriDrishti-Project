const express = require('express');
const router = express.Router();
const multer = require('multer');
const DiseaseResult = require('../models/DiseaseResult');
const { protect } = require('../middleware/auth');
const { diagnoseDisease } = require('../services/aiClient');

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// ─── POST /api/disease-detection ────────────────────────
router.post('/disease-detection', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    // Send image to external AI API (OpenAI Vision)
    const aiResponse = await diagnoseDisease(req.file.buffer, req.file.mimetype);

    if (!aiResponse.success) {
      return res.status(503).json({
        error: aiResponse.error || 'AI service temporarily unavailable. Please try again in a moment.',
      });
    }

    const aiResult = aiResponse.data;

    // Save result to database
    const result = await DiseaseResult.create({
      user: req.user._id,
      original_filename: req.file.originalname,
      disease_name:       aiResult.disease,
      confidence:         aiResult.confidence,
      severity:           aiResult.severity || 'moderate',
      treatment:          aiResult.treatment,
      affected_area_percent: aiResult.affected_area_percent,
      crop_type:          req.body.crop_type || aiResult.crop_type || 'unknown',
      ai_model_version:   aiResult.model_version || 'openai-gpt4o-mini',
    });

    // Broadcast alert if disease detected
    if (aiResult.disease !== 'Healthy' && aiResult.disease !== 'No Disease Detected') {
      req.app.locals.broadcast('disease_alert', {
        disease: aiResult.disease,
        confidence: aiResult.confidence,
        severity: aiResult.severity,
      });
    }

    res.json({
      id:           result._id,
      disease:      aiResult.disease,
      confidence:   aiResult.confidence,
      severity:     aiResult.severity,
      treatment:    aiResult.treatment,
      affected_area_percent: aiResult.affected_area_percent,
      timestamp:    result.timestamp,
    });
  } catch (err) {
    console.error('[DISEASE DETECTION ERROR]', err);
    res.status(500).json({ error: 'Disease detection failed. Please try again.' });
  }
});

// ─── GET /api/disease-history ────────────────────────────
router.get('/disease-history', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const maxLimit = Math.min(parseInt(limit), 100);

    const [results, totalCount] = await Promise.all([
      DiseaseResult
        .find({ user: req.user._id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(maxLimit)
        .lean(),
      DiseaseResult.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      results,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: maxLimit,
        totalPages: Math.ceil(totalCount / maxLimit),
        hasNextPage: skip + results.length < totalCount,
      }
    });
  } catch (err) {
    const logger = require('../utils/logger');
    logger.error('[DISEASE HISTORY ERROR]', err);
    res.status(500).json({ error: 'Failed to fetch disease history' });
  }
});

module.exports = router;
