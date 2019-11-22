---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 11/14/2019
ms.author: pafarley
---

## Analyze forms for key-value pairs and tables

Next, you'll use your newly trained model to analyze a document and extract key-value pairs and tables from it. Call the **Analyze Form** API by running the following code in a new Python script. Before you run the script, make these changes:

1. Replace `<path to your form>` with the file path of your form (for example, C:\temp\file.pdf). For this quickstart, you can use the files under the **Test** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
1. Replace `<modelID>` with the model ID you received in the previous section.
1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<file type>` with the file type. Supported types: `application/pdf`, `image/jpeg`, `image/png`.
1. Replace `<subscription key>` with your subscription key.

    ```python
    ########### Python Form Recognizer Analyze #############
    import http.client, urllib.request, urllib.parse, urllib.error, base64
    
    # Endpoint URL
    file_path = r"<path to your form>"
    model_id = "<modelID>"
    headers = {
        # Request headers
        'Content-Type': '<file type>',
        'Ocp-Apim-Subscription-Key': '<subscription key>',
    }

    try:
        with open(file_path, "rb") as f:
            data_bytes = f.read()  
        body = data_bytes
        conn = http.client.HTTPSConnection('<Endpoint>')
        conn.request("POST", "/formrecognizer/v2.0-preview/custom/models/" + model_id + "/analyze", body, headers)
        response = conn.getresponse()
        data = response.read()
        operationURL = "" + response.getheader("Location")
        print ("Location header: " + operationURL)
        conn.close()
    except Exception as e:
        print(str(e))
    ```

1. Save the code in a file with a .py extension. For example, *form-recognizer-analyze.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognizer-analyze.py`.

When you call the **Analyze Form** API, you'll receive a `201 (Success)` response with a **Location** header. The value of this header is an ID you'll use to track the results of the Analyze operation. The script above prints the value of this header to the console.

## Get the Analyze results

Add the following code to the bottom of your Python script. This extracts the ID value from the previous call and passes it to a new API call to retrieve the analysis results. The **Analyze Form** operation is asynchronous, so this script calls the API at regular intervals until the results are available. We recommend an interval of one second or more.

```python 
operationId = operationURL.split("operations/")[1]

conn = http.client.HTTPSConnection('<Endpoint>')
while True:
    try:
        conn.request("GET", "/formrecognizer/v2.0-preview/custom/models/" + model_id + "/analyzeResults/" + operationId, "", headers)
        responseString = conn.getresponse().read().decode('utf-8')
        responseDict = json.loads(responseString)
        conn.close()
        print(responseString)
        if 'status' in responseDict and responseDict['status'] not in ['notStarted','running']:
            break
        time.sleep(1)
    except Exception as e:
        print(e)
        exit()
```
