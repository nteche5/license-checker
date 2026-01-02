export default function handler(request, response) {
    // 1. Setup Headers (Allow MQL access)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'text/plain');

    // 2. Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(200).send("failed"); 
    }

    // 3. Get Account Number
    const account_no = request.body.account_no;

    if (!account_no) {
        return response.status(200).send("failed");
    }

    // 4. CLIENT DATABASE
    // "start" is set to 2020 to ensure it covers past dates if you backtest historically.
    // "end" is set to 9999 (Non-Expiry).
    const clients = {
        "51302912": { start: "2024-01-01", end: "2030-12-31" },
        "918908":   { start: "2023-01-01", end: "9999-12-31" }, // Your previous account
        
        // NEW PEPPERSTONE ACCOUNT FROM SCREENSHOT
        "61443571": { start: "2020-01-01", end: "9999-12-31" } 
    };

    // 5. Logic Check
    // Note: This checks the SERVER'S real date. 
    // Since the server date is likely 2024/2025 and the end date is 9999, it returns success.
    const today = new Date().toISOString().split('T')[0]; 

    if (clients[account_no]) {
        const user = clients[account_no];

        if (today >= user.start && today <= user.end) {
            return response.status(200).send("success");
        } 
        else if (today > user.end) {
            return response.status(200).send("expired");
        } 
        else {
            return response.status(200).send("not_started");
        }
    }

    // Account not found
    return response.status(200).send("failed");
}
