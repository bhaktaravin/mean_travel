const { Router } = require('express'); 
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const Entry = require('./model/Entry');

    const {
        API_KEY,
        MONGO_URI,
      } = process.env;
      
      const router = Router();
      
      const rateLimitDelay = 10 * 1000; // 10 second delay

      const limiter = RateLimit({
        store: new MongoStore({
          uri: MONGO_URI,
          expireTimeMs: rateLimitDelay
        }),
        max: 1,
        windowMs: rateLimitDelay
      });
      
      router.get('/', async (req, res, next) => {
        try {
          const entries = await Entry.find();
          res.json(entries);
        } catch (error) {
          next(error);
        }
      });
      
      router.post('/', limiter, async (req, res, next) => {
        try {
          if (req.get('X-API-KEY') !== API_KEY) {
            res.status(401);
            throw new Error('UnAuthorized');
          }
          const logEntry = new Entry(req.body);
          const createdEntry = await logEntry.save();
          res.json(createdEntry);
        } catch (error) {
          if (error.name === 'ValidationError') {
            res.status(422);
          }
          next(error);
        }
      });
      
      module.exports = router;