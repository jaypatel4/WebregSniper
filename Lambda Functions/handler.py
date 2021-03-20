import json
import time
import requests

def updateClasses(event, context):

    classCodes=["001","010","011","013","014","015","016","020","035","047","050","067","070","074",
    "080","081","082","090","098","115","117","119","122","125","126","136","140","146","155","158",
    "160","165","175","180","185","189","190","192","193","195","198","202","203","206","207","211",
    "216","220","300","332","351","354","356","355","358","359","360","364","370","373","374","375",
    "377","381","382","390","400","420","440","447","450","460","470","489","490","501","505","506",
    "508","510","512","522","533","540","547","550","554","556","557","558","560","563","565","567",
    "574","575","580","590","595","607","615","620","624","628","630","635","640","650","652","660",
    "667","670","680","685","690","691","692","694","700","701","705","709","713","715","718","720",
    "721","723","725","730A,"745","750","762","776","775","787","790","799","810","830","832","833",
    "840","843","851","860","880","888","902","904","910","920","940","955","959","960","965","966",
    "971","973","974","975","988","991"]

    startUrl = 'http://sis.rutgers.edu/oldsoc/courses.json?subject='
    endUrl = '&semester=12021&campus=NB&level=UG'

    endStartIndices = {}

    for codes in classCodes:
        attempts = 3
        min = 1000000
        max = -1
        url = startUrl + codes + endUrl

        while attempts > 0:
            try:
                response = requests.get(url)
                data = response.json()
                for classes in range(len(data)):
                    for section in range(len(data[classes]['sections'])):
                        currentIndex =  int(data[classes]['sections'][section]['index'].encode('utf-8'))
                        if currentIndex < min:
                            min = currentIndex
                        if currentIndex > max:
                            max = currentIndex
                endStartIndices[codes] = [min, max]
                attempts = 0
            except requests.ConnectionError as error:
                attempts -= 1
                time.sleep(2)
        time.sleep(2)

     response = {
        "statusCode": 200,
        "body": json.dumps(endStartIndices, indent = 4)
    }

    return response
