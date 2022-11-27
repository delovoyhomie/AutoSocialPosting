const PythonShell = require('python-shell').PythonShell;

let options = {
    args: ["Sosi", "None", "None"]
};                      
PythonShell.run('script.py', options, function (err) {})