import './styles.css';
const csv2json = require('./csv2json.js');

const uploadButton = document.querySelector('#upload');
const fileUpload = document.querySelector('input');
const pageWrapper = document.querySelector('.page-wrapper');

console.log(uploadButton);

function upload() {
  let file = fileUpload.files[0];

  let reader = new FileReader();

  reader.readAsText(file);
  reader.onload = function () {
    const data = reader.result;
    const json = csv2json(data, { parseNumbers: true });

    for (let i = 0; i < json.length; i++) {
      // get rid of unneeded columns
      delete json[i].carrierCode;
      delete json[i].locationId;
      delete json[i].emailNotificationSentDatetime;
      delete json[i].packageFlow;
      delete json[i].packageId;
      delete json[i].packageStatus;
      delete json[i].physicalPackagingType;
      delete json[i].receivedDatetime;
      delete json[i].stagedAreaAbbr;
      delete json[i].stagedAreaArrowDirection;
      delete json[i].stagedAreaBarCodeString;
      delete json[i].stagedAreaFullName;
      delete json[i].stagedAreaId;
      delete json[i].updateDatetime;
      delete json[i].weightUnits;

      // change header names
      console.log(Object.keys(json[i]));

      // adds gig and room # columns
      json[i].signature = '';
      json[i]['room#'] = '';
    }
    // change header names
    let newJson = JSON.stringify(json);

    var mapObj = {
      carrierName: 'carrier',
      packageGroup: 'group',
      recipientPersonName: 'recipient',
      senderPersonName: 'sender',
      stagedAreaShelfNumber: 'loc.',
      trackingNumber: 'tracking',
      weightValue: 'LBs',
    };
    newJson = newJson.replace(
      /carrierName|packageGroup|recipientPersonName|senderPersonName|stagedAreaShelfNumber|trackingNumber|weightValue/gi,
      function (matched) {
        return mapObj[matched];
      }
    );

    const jsonReady = JSON.parse(newJson);
    console.log(jsonReady);

    var _table_ = document.createElement('table'),
      _tr_ = document.createElement('tr'),
      _th_ = document.createElement('th'),
      _td_ = document.createElement('td'),
      _thead_ = document.createElement('thead'),
      _tbody_ = document.createElement('tbody');

    // Builds the HTML Table out of myList json data from Ivy restful service.
    function buildHtmlTable(arr) {
      var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table),
        tbody = _tbody_.cloneNode(false);
      for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
          var td = _td_.cloneNode(false);

          td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
      }
      return table;
    }

    // Adds a header row to the table and returns the set of columns.
    // Need to do union of keys from all records as some records may not contain
    // all records
    function addAllColumnHeaders(arr, table) {
      var columnSet = [],
        tr = _tr_.cloneNode(false),
        thead = _thead_.cloneNode(false);
      for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
          if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
            columnSet.push(key);
            var th = _th_.cloneNode(false);
            th.appendChild(document.createTextNode(key));
            tr.appendChild(th);
            thead.appendChild(tr);
          }
        }
      }
      table.appendChild(thead);
      return columnSet;
    }
    pageWrapper.appendChild(buildHtmlTable(jsonReady));
    const newTable = document.querySelector('table');
    newTable.setAttribute('contenteditable', '');
    newTable.setAttribute('id', 'data-table');
    $(document).ready(function () {
      $('#data-table').DataTable({
        paging: false,
      });
    });
    uploadButton.setAttribute('disabled', '');
    fileUpload.setAttribute('disabled', '');
  };
}

if (uploadButton) {
    uploadButton.addEventListener('click', upload);
}