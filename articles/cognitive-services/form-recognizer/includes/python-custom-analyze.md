---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 11/14/2019
ms.author: pafarley
---

## Analyze forms for key-value pairs and tables

Next, you'll use your newly trained model to analyze a document and extract key-value pairs and tables from it. Call the **[Analyze Form](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm)** API by running the following code in a new Python script. Before you run the script, make these changes:

1. Replace `<file path>` with the file path of your form (for example, C:\temp\file.pdf). This can also be the URL of a remote file. For this quickstart, you can use the files under the **Test** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
1. Replace `<model_id>` with the model ID you received in the previous section.
1. Replace `<endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<file type>` with the file type. Supported types: `application/pdf`, `image/jpeg`, `image/png`, `image/tiff`.
1. Replace `<subscription key>` with your subscription key.

    ```python
    ########### Python Form Recognizer Async Analyze #############
    import json
    import time
    from requests import get, post
    
    # Endpoint URL
    endpoint = r"<endpoint>"
    apim_key = "<subsription key>"
    model_id = "<model_id>"
    post_url = endpoint + "/formrecognizer/v2.0-preview/custom/models/%s/analyze" % model_id
    source = r"<file path>"
    params = {
        "includeTextDetails": True
    }
    
    headers = {
        # Request headers
        'Content-Type': '<file type>',
        'Ocp-Apim-Subscription-Key': apim_key,
    }
    with open(source, "rb") as f:
        data_bytes = f.read()
    
    try:
        resp = post(url = post_url, data = data_bytes, headers = headers, params = params)
        if resp.status_code != 202:
            print("POST analyze failed:\n%s" % json.dumps(resp.json()))
            quit()
        print("POST analyze succeeded:\n%s" % resp.headers)
        get_url = resp.headers["operation-location"]
    except Exception as e:
        print("POST analyze failed:\n%s" % str(e))
        quit() 
    ```

1. Save the code in a file with a .py extension. For example, *form-recognizer-analyze.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognizer-analyze.py`.

When you call the **Analyze Form** API, you'll receive a `201 (Success)` response with an **Operation-Location** header. The value of this header is an ID you'll use to track the results of the Analyze operation. The script above prints the value of this header to the console.

## Get the Analyze results

Add the following code to the bottom of your Python script. This uses the ID value from the previous call in a new API call to retrieve the analysis results. The **Analyze Form** operation is asynchronous, so this script calls the API at regular intervals until the results are available. We recommend an interval of one second or more.

```python 
n_tries = 15
n_try = 0
wait_sec = 5
max_wait_sec = 60
while n_try < n_tries:
    try:
        resp = get(url = get_url, headers = {"Ocp-Apim-Subscription-Key": apim_key})
        resp_json = resp.json()
        if resp.status_code != 200:
            print("GET analyze results failed:\n%s" % json.dumps(resp_json))
            quit()
        status = resp_json["status"]
        if status == "succeeded":
            print("Analysis succeeded:\n%s" % json.dumps(resp_json))
            quit()
        if status == "failed":
            print("Analysis failed:\n%s" % json.dumps(resp_json))
            quit()
        # Analysis still running. Wait and retry.
        time.sleep(wait_sec)
        n_try += 1
        wait_sec = min(2*wait_sec, max_wait_sec)     
    except Exception as e:
        msg = "GET analyze results failed:\n%s" % str(e)
        print(msg)
        quit()
print("Analyze operation did not complete within the allocated time.")
```
