const command = document.getElementById("command");
const password = document.getElementById("password");

const output = document.getElementById("output");

const run = () => {
    if(!command.value) return console.log("The command field is empty, returning...");
    if(!password.value) return console.log("The password field is empty, returning...");

    fetch("http://localhost:3640/api/execute", {
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

        console.log(data)

        if(data.code === "COMMAND_SUCCESS" || data.code === "COMMAND_FAILURE") {
            output.innerHTML = data.output;
        }
    })
}

document.getElementById("execute").onclick = run;