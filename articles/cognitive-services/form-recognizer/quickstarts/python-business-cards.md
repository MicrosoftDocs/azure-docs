---
title: "Quickstart: Extract business card data using Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with Python to extract data from images of business cards in English.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 08/17/2020
ms.author: pafarley
ms.custom: devx-track-python
#Customer intent: As a developer or data scientist familiar with Python, I want to learn how to use a prebuilt Form Recognizer model to extract my business card data.
---

# Quickstart: Extract business card data using the Form Recognizer REST API with Python

In this quickstart, you'll use the Azure Form Recognizer REST API with Python to extract and identify relevant information on business cards.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart, you must have:
- [Python](https://www.python.org/downloads/) installed (if you want to run the sample locally).
- A URL for an image of a business card. You can use a [sample image](../media/business-card-english.jpg) for this quickstart.

> [!NOTE]
> This quickstart uses a remote business card image accessed by URL. To use local files instead, see the [reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeReceiptAsync).

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Analyze a business card

To start analyzing a business card, you call the **[Analyze Business Card](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeReceiptAsync)** API using the Python script below. Before you run the script, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `<your business card URL>` with the URL address of a business card image.
1. Replace `<subscription key>` with the subscription key you copied from the previous step.

    ```python
    ########### Python Form Recognizer Async Business cards #############

    import json
    import time
    from requests import get, post
    
    # Endpoint URL
    endpoint = r"<Endpoint>"
    apim_key = "<subscription key>"
    post_url = endpoint + "/formrecognizer/v2.1-preview.1/prebuilt/businessCard/analyzeresults"
    source = r"<path to your business card>"
    
    headers = {
        # Request headers
        'Content-Type': '<file type>',
        'Ocp-Apim-Subscription-Key': apim_key,
    }
    
    params = {
        "includeTextDetails": True
    }
    
    with open(source, "rb") as f:
        data_bytes = f.read()
    
    try:
        resp = post(url = post_url, data = data_bytes, headers = headers, params = params)
        if resp.status_code != 202:
            print("POST analyze failed:\n%s" % resp.text)
            quit()
        print("POST analyze succeeded:\n%s" % resp.headers)
        get_url = resp.headers["operation-location"]
    except Exception as e:
        print("POST analyze failed:\n%s" % str(e))
        quit()
    ```

1. Save the code in a file with a .py extension. For example, *form-recognizer-businesscards.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognizer-businesscards.py`.

You'll receive a `202 (Success)` response that includes an **Operation-Location** header, which the script will print to the console. This header contains an operation ID that you can use to query the status of the asynchronous operation and get the results. In the following example value, the string after `operations/` is the operation ID.

```console
https://cognitiveservice/formrecognizer/v2.1-preview.1/prebuilt/businessCard/analyzeresults{operationID}
```

## Get the business card results

After you've called the **Analyze Business Card** API, you call the **[Get Analyze Business Card Result](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/GetAnalyzeReceiptResult)** API to get the status of the operation and the extracted data. Add the following code to the bottom of your Python script. This uses the operation ID value in a new API call. This script calls the API at regular intervals until the results are available. We recommend an interval of one second or more.

```python
n_tries = 10
n_try = 0
wait_sec = 6
while n_try < n_tries:
    try:
        resp = get(url = get_url, headers = {"Ocp-Apim-Subscription-Key": apim_key})
        resp_json = json.loads(resp.text)
        if resp.status_code != 200:
            print("GET Business card results failed:\n%s" % resp_json)
            quit()
        status = resp_json["status"]
        if status == "succeeded":
            print("Business card Analysis succeeded:\n%s" % resp_json)
            quit()
        if status == "failed":
            print("Analysis failed:\n%s" % resp_json)
            quit()
        # Analysis still running. Wait and retry.
        time.sleep(wait_sec)
        n_try += 1     
    except Exception as e:
        msg = "GET analyze results failed:\n%s" % str(e)
        print(msg)
        quit()
```

1. Save the script.
1. Again use the `python` command to run the sample. For example, `python form-recognizer-businesscards.py`.

### Examine the response

The script will print responses to the console until the **Analyze Business Card** operation completes. Then, it will print the extracted text data in JSON format. The `"recognitionResults"` field contains every line of text that was extracted from the business card, and the `"understandingResults"` field contains key/value information for the most relevant parts of the business card.

See the following business card image and its corresponding JSON output. The output has been shortened for readability.

![A business card from Contoso company](../media/business-card-english.jpg)

The `"recognitionResults"` node contains all of the recognized text. Text is organized by page, then by line, then by individual words. The `"understandingResults"` node contains the business-card-specific values that the model discovered. This is where you'll find useful key/value pairs like the tax, total, merchant address, and so on.

TBD JSON

## Next steps

In this quickstart, you used the Form Recognizer REST API with Python to extract the content of a business card. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeReceiptAsync)
