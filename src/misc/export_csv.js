import csv from "csv"

var options = {
    delimiter: ",",
    quoted: true,
    rowDelimiter: "unix",
    quotedString: true,
    escape: true,
    quotedEmpty: true,
    header: true
}

const exportCsv = function (data) {
    return new Promise(function (resolve, reject) {
        options["columns"] = data.shift()
        csv.stringify(data, options, (err, data) => {
            if (err) {
                reject();
            }
            resolve(data)
        });
    })
}

export default exportCsv;
