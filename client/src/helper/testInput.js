//provide basic error handling if submission fail
//inputs are description, date, duration, reps, multiplier, formActivityType
export const testInput = (type, inputs) => {
    var errors = "Error:\n";
    if (type === "code" || type === "study") {
        //test empty
        if (inputs[0] === "") {
            errors += "Description field is empty\n";
        }
        if (inputs[1] === "") {
            errors += "Date field is empty\n";
        }
        if (inputs[2] === "" || inputs[2] === "0") {
            errors += "Duration field is empty\n";
        }
        if (inputs[5] === "") {
            if (type === "code") {
                errors += "Project field is empty\n";
            } else {
                errors += "Subject field is empty\n";
            }
        }
        if (inputs[2] % 1 !== 0) {
            errors += "Duration needs to be an integer\n"
        }
    } else if (type === "exercise") {
        if (inputs[0] === "") {
            errors += "Description field is empty\n";
        }
        if (inputs[1] === "") {
            errors += "Date field is empty\n";
        }
        if (inputs[3] === "" || inputs[3] === "0") {
            errors += "Reps field is empty\n";
        }
        // if (inputs[3] % 1 !== 0) {
        //     errors += "Reps needs to be an integer\n"
        // }
    } else if (type === "exercisetype") {
        if (inputs[0] === "") {
            errors += "Description field is empty\n";
        }
        if (inputs[4] === "" || inputs[4] === "0") {
            errors += "Multiplier field is empty\n";
        }
        if (inputs[4].includes(".")) {
            if (inputs[4].split(".")[1].length > 2) {
                errors += "Multiplier field needs to be at most 2dp\n";
            }
        }
    }
    if (errors !== "Error:\n") {
        alert(errors)
        return false
    }
    return true
}
