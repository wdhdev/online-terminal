const command = document.getElementById("command");
const password = document.getElementById("password");

const output = document.getElementById("output");

const run = () => {
    if(!command.value) return;
    if(!password.value) return;

    fetch("/api/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            command: command.value,
            password: password.value
        })
    }).then(res => res.json()).then(data => {
        alert(data.message);

        if(data.code === "COMMAND_SUCCESS" || data.code === "COMMAND_FAILURE") {
            output.innerHTML = data.output;
        }
    })
}

document.getElementById("execute").onclick = run;
