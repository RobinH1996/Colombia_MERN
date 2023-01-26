/************** SESSION MANAGE *************/
var sessions = {};

const manageSession = (email, started, next, res) => {
    if(!started){
        sessions[email] = setTimeout(() => destroySession(email), 1200000, 0);
        console.log("****** " + email +" : SESSION STARTED **********");
        res.send({result: "OK"});
    } else {
        if(sessions[email]){
            clearTimeout(sessions[email]);
            sessions[email] = setTimeout(() => destroySession(email), 1200000, 0);
            console.log("****** " + email +" : SESSION RESTARTED **********");
            next();
        } else {
            console.log("Not Passed");
            res.send({ result: "SESSION_ENDED" });
        }
    }
}

function destroySession(email){
    clearTimeout(sessions[email]);
    sessions[email] = false;
    console.log("****** " + email +" : SESSION DESTROYED **********");
}

module.exports = manageSession;