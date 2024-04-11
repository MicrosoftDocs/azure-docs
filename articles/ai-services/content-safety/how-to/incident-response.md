---
title: "Use the incident response API"
titleSuffix: Azure AI services
description: Learn how to use the incident response API to mitigate harmful content incidents quickly.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: how-to
ms.date: 04/11/2024
ms.author: pafarley
---


# Use the incident response API

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

tbd


For text and image incident response, you can easily define an incident with a few examples in a specific topic, and the API will start detecting similar content. 


> [!IMPORTANT]
> This new feature is only available in **East US** and **Sweden Central**. 

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Get access: The incident response API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](tbd). The request will take up to 48 hours to approve. Once you receive an approval notification from Microsoft, you can go to the next step.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US or Sweden Central), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed

tbd env vars?

## Test the text incident response API

Follow these steps to define an incident with a few examples of text content and then analyze new text content to see if it matches the incident.

1. Create an incident

#### [cURL](#tab/curl)

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "text-incident-name",
  "description": "string"
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentName": "text-incident-name",
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

1. Add samples to the incident

#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name:addIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "incidentSamples": [
    { "text":      "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK"},
    { "text":"@: nobody cares about the Fucking Shit like you, fucking bitch........................ 5.9.97.199"},
    { "text":      "FUCK \nYou little bitch the cowboys have no testes"},
    { "text":"And your a dick sucker dabomb you want a big juicy jizzBOMB in your mouth."},
    { "text":"Whatever, dumbass. \n\nGo eat Jimbo'\''s pussy."},
    { "text":"you are a senile old homosexual==\n\nyou need to go to Oz to get a fucking brain \n\n=="},
    { "text":"STANDAHL ARE YOU A MAN OR A MOUSESTACHE?\n\nWHY DON'\''T YOU RESPOND.\n\nARE YOU SCARED OF THE APPROPRIATE FEDERAL AGENCIES WHO ARE ACTIVELY WATCHING YOUR ACTS?"},
    { "text":", I hope you'\''re on the next plane just so we can erase all record of what they did to you the way you are trying to revise this history.  Asshole."},
    { "text":"I very much doubt that you can describe an undoubted POV vandal such as User:Vintagekits as '\''editing in good faith'\''. Just ignore these stupid Admins"},
    { "text":"Hey, Halcy.Seems like you get mad alot. Want me to call the WAAAAAMBULANCE for you? Want some dick (extra small) with that too, bitch? U mad? butthurt? I bet you'\''re having an orgy with MeetTheMedic and MeepTheSheep, aren'\''t you? You three would make a good threesome. You'\''re all reject 4-Chan trolls that became admins on another website to have Unwarranted Self Importance while you spam faggot and dick all day. Seems like you enjoy that kind of stuff. I had no idea, really.\n \nTL;DR: U mad?"},
    { "text":"Better late then ever. \n\nGood riddance, militant freak."}
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name:addIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSamples": [
    {
      "text": "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK"
    },
    {
      "text": "@: nobody cares about the Fucking Shit like you, fucking bitch........................ 5.9.97.199"
    },
    {
      "text": "FUCK \nYou little bitch the cowboys have no testes"
    },
    {
      "text": "And your a dick sucker dabomb you want a big juicy jizzBOMB in your mouth."
    },
    {
      "text": "Whatever, dumbass. \n\nGo eat Jimbo's pussy."
    },
    {
      "text": "you are a senile old homosexual==\n\nyou need to go to Oz to get a fucking brain \n\n=="
    },
    {
      "text": "STANDAHL ARE YOU A MAN OR A MOUSESTACHE?\n\nWHY DON'T YOU RESPOND.\n\nARE YOU SCARED OF THE APPROPRIATE FEDERAL AGENCIES WHO ARE ACTIVELY WATCHING YOUR ACTS?"
    },
    {
      "text": ", I hope you're on the next plane just so we can erase all record of what they did to you the way you are trying to revise this history.  Asshole."
    },
    {
      "text": "I very much doubt that you can describe an undoubted POV vandal such as User:Vintagekits as 'editing in good faith'. Just ignore these stupid Admins"
    },
    {
      "text": "Hey, Halcy.Seems like you get mad alot. Want me to call the WAAAAAMBULANCE for you? Want some dick (extra small) with that too, bitch? U mad? butthurt? I bet you're having an orgy with MeetTheMedic and MeepTheSheep, aren't you? You three would make a good threesome. You're all reject 4-Chan trolls that became admins on another website to have Unwarranted Self Importance while you spam faggot and dick all day. Seems like you enjoy that kind of stuff. I had no idea, really.\n \nTL;DR: U mad?"
    },
    {
      "text": "Better late then ever. \n\nGood riddance, militant freak."
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

1. Analyze text with incident response
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text:analyze?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "text":  "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK",
  "incidents": {
    "incidentNames": [
      "text-incident-name"
    ],
    "haltOnIncidentHit": true
  }
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text:analyze?api-version=2023-10-30-preview"

payload = json.dumps({
  "text": "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK",
  "incidents": {
    "incidentNames": [
      "text-incident-name"
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

1. Create an incident
#### [cURL](#tab/curl)

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "image-incident-name",
  "description": "string"
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentName": "image-incident-name",
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

1. Add samples to the incident
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name:addIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
      }
    }
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name:addIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
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

1. Analyze image with incident response
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/image:analyze?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
    "image":
        {
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
        },
    "categories": [
        "SelfHarm",
        "Sexual"
    ],
   "outputType": "FourSeverityLevels",
   "incidents": {
       "incidentNames": [
          "image-incident-name"
        ],
        "haltOnIncidentHit": true
  }
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image:analyze?api-version=2023-10-30-preview"

payload = json.dumps({
  "image": {
    "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
  },
  "categories": [
    "SelfHarm",
    "Sexual"
  ],
  "outputType": "FourSeverityLevels",
  "incidents": {
    "incidentNames": [
      "image-incident-name"
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

### Text

#### Get the incidents list
#### [cURL](#tab/curl)

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)
```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

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
curl --location --request DELETE 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name:removeIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name:removeIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
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
curl --location 'https://<endpoint>/contentsafety/image/incidents?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

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
curl --location --request DELETE 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview"

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
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name:removeIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name:removeIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
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

