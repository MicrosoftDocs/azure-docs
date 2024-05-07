---
title: "Use the incident response API"
titleSuffix: Azure AI services
description: Learn how to use the incident response API to mitigate harmful content incidents quickly.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: how-to
ms.date: 04/11/2024
ms.author: pafarley
---


# Use the incident response API

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

The incident response API lets you quickly respond to emerging harmful content incidents. You can easily define an incident with a few examples in a specific topic, and the API will start detecting similar content. 


> [!IMPORTANT]
> This new feature is only available in the **East US** and **Sweden Central** Azure regions. 

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Get access: The incident response API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](https://aka.ms/content-safety-gate). The request will take up to three business days to approve. Once you receive an approval notification from Microsoft, you can go to the next step.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US or Sweden Central), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed

tbd env vars?

## Test the text incident response API

Follow these steps to define an incident with a few examples of text content and then analyze new text content to see if it matches the incident.

### Create an incident

#### [cURL](#tab/curl)

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "<text-incident-name>",
  "description": "string"
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentName": "<text-incident-name>",
  "description": "string"
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)

print(response.text)
```
---

### Add samples to the incident

#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:addIncidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "incidentSamples": [
    { "text":    "<text-example-1>"},
    { "text":    "<text-example-2>"},
    ...
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:addIncidentSamples?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentSamples": [
    {
      "text": "<text-example-1>"
    },
    {
      "text": "<text-example-1>"
    },
    ...
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```
---

### Analyze text with incident response

#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text:analyze?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "text":  "<test-text>",
  "incidents": {
    "incidentNames": [
      "<text-incident-name>"
    ],
    "haltOnIncidentHit": true
  }
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text:analyze?api-version=2024-04-15-preview "

payload = json.dumps({
  "text": "<test-text>",
  "incidents": {
    "incidentNames": [
      "<text-incident-name>"
    ],
    "haltOnIncidentHit": True
  }
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```
---

## Test the image incident response API

### Create an incident

#### [cURL](#tab/curl)

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "<image-incident-name>",
  "description": "string"
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentName": "<image-incident-name>",
  "description": "string"
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)

print(response.text)

```
---

### Add samples to the incident
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:addIncidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "<your-blob-storage-url>/image.png"
      }
    }
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:addIncidentSamples?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "<your-blob-storage-url>/image.png"
      }
    }
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
---

### Analyze image with incident response

#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image:analyze?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
    "image":
        {
        "blobUrl": "<your-blob-storage-url>/image.png"
        },
    "categories": [
        "SelfHarm",
        "Sexual"
    ],
   "outputType": "FourSeverityLevels",
   "incidents": {
       "incidentNames": [
          "<image-incident-name>"
        ],
        "haltOnIncidentHit": true
  }
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image:analyze?api-version=2024-04-15-preview "

payload = json.dumps({
  "image": {
    "blobUrl": "<your-blob-storage-url>/image.png"
  },
  "categories": [
    "SelfHarm",
    "Sexual"
  ],
  "outputType": "FourSeverityLevels",
  "incidents": {
    "incidentNames": [
      "<image-incident-name>"
    ],
    "haltOnIncidentHit": True
  }
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
---

## Other incident operations

### Text incident API

#### Get the incidents list
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)
```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident details
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete the incident
#### [cURL](#tab/curl)

```shell
curl --location --request DELETE 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```
---

#### Retrieve the incident sample list
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentSamples?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident sample's details
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentSamples/<your-incident-sample-id>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentSamples/<your-incident-sample-id>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete an incident sample
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:removeIncidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "<your-incident-sample-id>"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:removeIncidentSamples?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentSampleIds": [
    "<your-incident-sample-id>"
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```
---

### Image incident API

#### Get the incidents list
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident details
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete the incident
#### [cURL](#tab/curl)

```shell
curl --location --request DELETE 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident sample list
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentSamples?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident sample details
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentSamples/<your-incident-sample-id>?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentSamples/<your-incident-sample-id>?api-version=2024-04-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete the incident sample
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:removeIncidentSamples?api-version=2024-04-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "<your-incident-sample-id>"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:removeIncidentSamples?api-version=2024-04-15-preview "

payload = json.dumps({
  "incidentSampleIds": [
    "<your-incident-sample-id>"
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```
---

