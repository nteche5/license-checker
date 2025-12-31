export default function handler(request, response) {
    // 1. Setup Headers (Allow MQL access)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'text/plain');

    // 2. Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(200).send("failed"); // Fail silently for browsers
    }

    // 3. Get Account Number
    // Vercel automatically parses the data sent by MQL
    const account_no = request.body.account_no;

    if (!account_no) {
        return response.status(200).send("failed");
    }

    // 4. CLIENT DATABASE
    // Add your clients here. Format: 'AccountID': { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
    const clients = {
        "51302912": { start: "2024-01-01", end: "2030-12-31" },
        "23234324": { start: "2023-01-01", end: "2023-02-01" }, // Expired Example
        "88888888": { start: "2025-01-01", end: "2025-12-31" }  // Future Example
    };

    // 5. Logic Check
    const today = new Date().toISOString().split('T')[0]; // Get Today's Date

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
