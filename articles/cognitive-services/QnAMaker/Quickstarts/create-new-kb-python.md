---
title:  "Quickstart: Create knowledge base - REST, Python - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 10/05/2018
ms.author: diberry
---

# Quickstart: Create a QnA Maker knowledge base in Python

This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [Python 3.x](https://www.python.org/downloads/)
* You must have a QnA Maker service. To retrieve your key, select Keys under Resource Management in your dashboard.

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-python-repo-note.md)]

## Create a knowledge base Python file

Create a file named `create-new-knowledge-base.py`.

## Add the required dependencies

At the top of `create-new-knowledge-base.py`, add the following lines to add necessary dependencies to the project:

```python
import http.client, urllib.parse, json, time
```

## Add the required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

```python
# Represents the various elements used to create HTTP request path
# for QnA Maker operations.
host = 'westus.api.cognitive.microsoft.com'
service = '/qnamaker/v4.0'
method = '/knowledgebases/create'

# Builds the path URL.
path = service + method

# Replace this with a valid subscription key.
subscriptionKey = 'YOUR SUBSCRIPTION KEY HERE'
```

## Add the KB model definition

After the constants, add the following KB model definition. The model is converting into a string after the definition.

```python
kb_model = {
  "name": "QnA Maker FAQ",
  "qnaList": [
    {
      "id": 0,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa",
      "source": "Custom Editorial",
      "questions": [
        "How do I programmatically update my Knowledge Base?"
      ],
      "metadata": [
        {
          "name": "category",
          "value": "api"
        }
      ]
    }
  ],
  "urls": [
    "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
  ],
  "files": []
}

# Convert the request to a string.
content = json.dumps(kb_model)
```

## Add supporting functions

Add the following function to print out JSON in a readable format:

```python
def pretty_print(content):
  # Note: We convert content to and from an object so we can pretty-print it.
  return json.dumps(json.loads(content), indent=4)
```

## Add function to create KB

Add the following function to make an HTTP POST request to create the knowledge base. 
This API call returns a JSON response that includes the operation ID in the header field **Location**. Use the operation ID to determine if the KB is successfully created. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

```python
def create_kb(path, content):
  print('Calling ' + host + path + '.')
  headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-Type': 'application/json',
    'Content-Length': len (content)
  }
  conn = http.client.HTTPSConnection(host)
  conn.request ("POST", path, content, headers)
  response = conn.getresponse ()

  return response.getheader('Location'), response.read ()

# Call create_kb
operation, result = create_kb(path, content)
```

This API call returns a JSON response that includes the operation ID in the header field **Location**. Use the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add function to check creation status

The following function checks the creation status sending in the operation ID at the end of the URL route. The call to `check_status` is inside the main _while_ loop.

```python
def check_status(path):
  print('Calling ' + host + path + '.')
  headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
  conn = http.client.HTTPSConnection(host)
  conn.request("GET", path, None, headers)
  response = conn.getresponse ()
  return response.getheader('Retry-After'), response.read ()
```

This API call returns a JSON response that includes the operation status: 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:22:53Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add loop to poll for operation status
The following loop polls for the creation operation status periodically until the operation is complete. 

```python
# Set done to false
done = False

# Add operation ID to URL route
path = service + operation

# Continue until done
while False == done:

  # Gets the status of the operation.
  wait, status = check_status(path)

  # Print status checks in JSON with presentable formatting
  print(pretty_print(status))

  # Convert the JSON response into an object and get the value of the operationState field.
  state = json.loads(status)['operationState']

  # If the operation isn't finished, wait and query again.
  if state == 'Running' or state == 'NotStarted':
    print('Waiting ' + wait + ' seconds...')
    time.sleep(int(wait))
  else:
    done = True # request has been processed, if successful, knowledge base is created
```

## Build and run the program

1. Install dependencies:

    ```python
    pip install xxx
    ```

2. Run the script:

    ```python
    python create-new-knowledge-base.py
    ```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. Select your knowledge base name, for example QnA Maker FAQ, to view.

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)