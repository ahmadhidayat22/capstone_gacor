import rateLimit from 'express-rate-limit';


export const softLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
    handler: (req,res) => {
        // bannedIps.add(req.ip);
        console.log(`Permintaan dari IP: ${req.headers['x-real-ip'] ||req.headers['x-forwarded-for']?.split(',')[0] || req.ip} melebihi batas`);
        res.status(429).json({
            error: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti'
        })
    }
  
  })

export const hardLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 5 minutes
    max: 3, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
    handler: (req,res) => {
        // bannedIps.add(req.ip);
        console.log(`Permintaan dari IP: ${req.headers['x-real-ip'] ||req.headers['x-forwarded-for']?.split(',')[0] || req.ip} melebihi batas`);
        res.status(429).json({
            error: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti'
        })
    }
  
})