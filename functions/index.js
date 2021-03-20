const functions = require("firebase-functions");
const admin = require('firebase-admin');

/*
Initialize firebase and firestore
*/
admin.initializeApp();
const database = admin.firestore();

/*
http requests are required to request data from oldsoc
*/
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

/*
List of all max and min indices in each subject, we can avoid checking certain subject codes by checking min and max
*/
var minMax = {'098': [7625, 20273], '216': [7338, 19976], '211': [11932, 20979], '090': [7243, 21378], '660': [10245, 10245], '010': [18847, 20814], 
'011': [18890, 20061], '013': [7137, 20724], '014': [7213, 7258], '015': [13324, 21379], '016': [7259, 7260], '490': [9646, 9648], '692': [11286, 19794], 
'690': [11245, 19852], '691': [11262, 11285], '775': [13209, 13237], '694': [9482, 10271], '667': [9292, 10246], '540': [14327, 14344], '650': [14373, 20088], 
'547': [11430, 21344], '400': [13738, 20872], '810': [7272, 10707], '991': [11227, 21449], '718': [17925, 18725], '715': [18686, 18696], '670': [9609, 13869], 
'122': [7808, 7808], '020': [13338, 13347], '126': [13501, 21029], '574': [9852, 9875], '701': [12073, 12581], '533': [19301, 20310], '920': [9561, 21319], 
'370': [13603, 21263], '373': [13636, 13658], '375': [13694, 13737], '374': [13659, 21058], '377': [9330, 21382], '136': [18914, 21178], '590': [9881, 21414], 
'988': [7222, 21061], '595': [7229, 21413], '198': [8372, 21433], '195': [7166, 20648], '705': [19587, 21074], '700': [11964, 20276], '190': [8316, 8334], 
'193': [13520, 13520], '192': [11350, 20823], '115': [13467, 20880], '117': [13492, 19845], '390': [19002, 21355], '119': [7636, 7807], '035': [13349, 21367], 
'832': [13101, 13305], '833': [13127, 13308], '830': [10708, 19858], '140': [18982, 18984], '762': [13126, 13208], '790': [9327, 20777], '799': [18902, 19183], 
'713': [10272, 10276], '522': [19069, 20011], '420': [7344, 21043], '364': [13598, 13600], '910': [13062, 13093], '360': [9326, 9328], '580': [9876, 20843], 
'300': [11610, 21194], '440': [14270, 14326], '447': [9476, 9543], '381': [9439, 9441], '382': [18985, 19000], '776': [13921, 21423], '047': [20298, 20299], 
'615': [8302, 9934], '902': [13943, 13945], '787': [10584, 10585], '843': [13128, 13309], '904': [10921, 21445], '840': [9685, 20688], '640': [9935, 21323], 
'510': [7407, 20388], '512': [9731, 21459], '620': [19080, 19125], '624': [19333, 19485], '450': [9544, 20855], '628': [9590, 21424], '607': [13817, 21390], 
'575': [11204, 21265], '332': [14147, 21055], '175': [7276, 8286], '050': [7220, 21418], '709': [13897, 21329], '554': [13787, 13804], '975': [13162, 13323], 
'974': [7161, 7185], '973': [7159, 7183], '851': [18656, 19185], '971': [13145, 13322], '745': [10350, 10355], '730': [8290, 21429], '180': [14117, 14146], 
'652': [10328, 10328], '508': [8319, 20971], '185': [8287, 21191], '506': [7414, 20993], '189': [11301, 11349], '501': [13094, 13143], '630': [19126, 21404], 
'750': [10356, 21421], '635': [14345, 14372], '067': [13357, 13457], '560': [8283, 21369], '563': [7148, 20272], '460': [9574, 20770], '567': [11208, 21116], 
'165': [8253, 8274], '160': [7855, 21450], '220': [8659, 19940], '965': [12582, 21083], '966': [12619, 20323], '505': [7152, 7177], '960': [8450, 21270], 
'860': [8369, 20063], '725': [18753, 21088], '723': [7157, 7206], '720': [18726, 18728], '721': [18729, 18752], '074': [7138, 7198], '880': [10917, 10919], 
'155': [14036, 14116], '558': [9785, 9785], '070': [7308, 20966], '158': [18663, 18684], '557': [11961, 11963], '556': [9751, 20106], '550': [13762, 20876], 
'959': [11082, 11115], '955': [11059, 21104], '355': [8812, 20960], '146': [7810, 20282], '203': [11867, 19800], '202': [8628, 20067], '207': [11930, 11931], 
'206': [11884, 19802], '082': [7265, 21174], '081': [11789, 20727], '080': [11744, 20346], '565': [9826, 9851], '001': [7107, 19586], '489': [9637, 9645], 
'125': [13956, 14035], '888': [10920, 10920], '940': [8280, 20009], '356': [9236, 20717], '470': [8351, 9636], '354': [8361, 8811], '351': [8739, 19992], 
'685': [7163, 21410], '680': [7346, 20515], '359': [9297, 20311], '358': [7297, 19920]}

/*
Instead of the above an http request can be made to the Lambda function or GCP function with the source code from 'handler.py' under /Lambda Functions/ to 
get an updated list of indices
*/


/*
Searches for a certain index in the schedule of classes
*/
function searchIndex(index, target) {
  var xmlhttp = new XMLHttpRequest();
  var myArr;

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        for(let i = 0; i < Object.keys(myArr).length; i++) {
          for(let j = 0; j < Object.keys(myArr[i]['sections']).length; j++)
          {
            currentIndex = myArr[i]['sections'][j]['index']
            if(currentIndex = target) {
              if(myArr[i]['sections'][j]['openStatus'] == "true") {
                return true;
              }
              return false;
            }
          }
        }
    }
  };

  // Add leading 0s to the index (webreg url requires leading 0s for index search)
  subjectCode;
  if(index < 10) {
    subjectCode = "00".concat(index.toString());
  }
  else if (index < 100)  {
    subjectCode = "0".concat(index.toString());
  }
  else {
    subjectCode = index.toString();
  }

  // Creating and opening the unique key url on the oldsoc accesspoint
  url = "http://sis.rutgers.edu/oldsoc/courses.json?subject=".concat(subjectCode).concat("&semester=12021&campus=NB&level=UG");
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

/*
Lists all indices in a given key class
*/
exports.listClasses = functions.https.onRequest((request,response) => {
  var xmlhttp = new XMLHttpRequest();
  var myArr;

  // Search the specific key
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Check the statuses of all classes in a given key
        myArr = JSON.parse(this.responseText);
        var statuses = [];
        for(let i = 0; i < Object.keys(myArr).length; i++) {
          for(let j = 0; j < Object.keys(myArr[i]['sections']).length; j++)
          {
            statuses.push(myArr[i]['sections'][j]['index']);
            statuses.push(myArr[i]['sections'][j]['openStatus']);
          }
        }
        response.status(200).send(JSON.stringify(statuses));
        return;
      }
  };

  // Creates the unique key url on the oldsoc accesspoint
  var url = "http://sis.rutgers.edu/oldsoc/courses.json?subject=" + request.data.key + "&semester=12021&campus=NB&level=UG"
  xmlhttp.open("GET", url , true);
  xmlhttp.send();
})

/*
Update all classes listed in the db as actively being monitored
*/
exports.checkClasses = functions.https.onRequest((request, response) => {

  // Pull list of all classes needed
  var docRef = database.collection("accounts").doc("activeSnipes");
  docRef.get().then((doc) => {
    if (doc.exists) {
      data = doc.data()
        // Each key is a specific index we are searching for
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            for (var index in minMax) {
              // To ensure easier searching use min and max of current key to see what range the indices being searched are in
              start = minMax[index][0]
              end = minMax[index][1]
              if((key < end) & (key > start)) {
                // If the current key is within range of the target, search the status of the current index
                if(searchIndex(index, key)) {
                  var data = {
                    "+index+" : true
                  }
                  // Update database to mark the class as open
                  database.collection("classes").doc(key).set(data);
                }
              } 
            }
          }
        }
    } else {
        console.log("Class was never registered for monitoring!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  // Respond to the request marking as complete
  response.status(200).send("All classes updated");
  return;
});

