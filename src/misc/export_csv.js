import {stringify} from "csv"

var options = {
    delimiter: ",",
    quoted: true,
    rowDelimiter: "unix",
    quotedString: true,
    quotedEmpty: true,
    header: true,
    bom: true
}

const exportCsv = function (data) {
    return new Promise(function (resolve, reject) {
        options["columns"] = data.shift()
        stringify(data, options, (err, data) => {
            if (err) {
                reject();
            }
            resolve(data)
        });
    })
}

export default exportCsv;
