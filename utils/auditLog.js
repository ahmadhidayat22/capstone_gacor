
 const AuditLog = (req,res, next) => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
    });
    console.log(`${req.method} ${req.path} FROM ${req.headers['x-real-ip'] ||req.headers['x-forwarded-for']?.split(',')[0] || req.ip}  TIME: ${formattedDate} - SOURCE: ${req.get('user-agent')}`);
    next();
}

export default AuditLog 