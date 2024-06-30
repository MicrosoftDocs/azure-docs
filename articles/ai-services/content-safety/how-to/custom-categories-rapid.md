---
title: "Use the custom categories (rapid) API"
titleSuffix: Azure AI services
description: Learn how to use the custom categories (rapid) API to mitigate harmful content incidents quickly.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: how-to
ms.date: 04/11/2024
ms.author: pafarley
---


# Use the custom categories (rapid) API

The custom categories (rapid) API lets you quickly respond to emerging harmful content incidents. You can define an incident with a few examples in a specific topic, and the service will start detecting similar content.

Follow these steps to define an incident with a few examples of text content and then analyze new text content to see if it matches the incident.

> [!IMPORTANT]
> This new feature is only available in select Azure regions. See [Region availability](/azure/ai-services/content-safety/overview#region-availability).

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (see [Region availability](/azure/ai-services/content-safety/overview#region-availability)), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* Also [create a blob storage container](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) if you want to upload your images there. You can alternatively encode your images as Base64 strings and use them directly in the API calls.
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed

<!--tbd env vars-->

## Test the text custom categories (rapid) API

Use the sample code in this section to create a text incident, add samples to the incident, deploy the incident, and then detect text incidents.

### Create an incident object

#### [cURL](#tab/curl)

In the commands below, replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values.

The following command creates an incident with a name and definition.

```bash
curl --location --request PATCH 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "<text-incident-name>",
  "incidentDefinition": "string"
}'
```

#### [Python](#tab/python)

First, you need to install the required Python library:

```bash
pip install requests
```

Then, define the necessary variables with your own Azure resource details:

```python
import requests

API_KEY = '<your_api_key>'
ENDPOINT = '<your_endpoint>'

headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
}
```

The following command creates an incident with a name and definition.


```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview "

payload = json.dumps({
  "incidentName": "<text-incident-name>",
  "incidentDefinition": "string"
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

Use the following command to add text examples to the incident.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:addIncidentSamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "IncidentSamples": [
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

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:addIncidentSamples?api-version=2024-02-15-preview "

payload = json.dumps({
  "IncidentSamples": [
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

### Deploy the incident


Use the following command to deploy the incident, making it available for the analysis of new content.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:deploy?api-version=2024-02-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' 
```

#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:deploy?api-version=2024-02-15-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
---

### Detect text incidents

Run the following command to analyze sample text content for the incident you just deployed.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/text:detectIncidents?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "text":  "<test-text>",
  "incidentNames": [
    "<text-incident-name>"
  ]
}'
```

#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text:detectIncidents?api-version=2024-02-15-preview "

payload = json.dumps({
  "text": "<test-text>",
  "incidentNames": [
    "<text-incident-name>"
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

## Test the image custom categories (rapid) API

Use the sample code in this section to create an image incident, add samples to the incident, deploy the incident, and then detect image incidents.

### Create an incident

#### [cURL](#tab/curl)

In the commands below, replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values.

The following command creates an image incident:


```bash
curl --location --request PATCH 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "<image-incident-name>"
}'
```

#### [Python](#tab/python)

Make sure you've installed required Python libraries:

```bash
pip install requests
```

Define the necessary variables with your own Azure resource details:

```python
import requests

API_KEY = '<your_api_key>'
ENDPOINT = '<your_endpoint>'

headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
}
```

The following command creates an image incident:

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview "

payload = json.dumps({
  "incidentName": "<image-incident-name>"
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

Use the following command to add examples images to your incident. The image samples can be URLs pointing to images in an Azure blob storage container, or they can be Base64 strings.


#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:addIncidentSamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "IncidentSamples": [
    {
      "image": {
        "content": "<base64-data>",
        "bloburl": "<your-blob-storage-url>.png"
      }
    }
  ]
}'
```

#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:addIncidentSamples?api-version=2024-02-15-preview "

payload = json.dumps({
  "IncidentSamples": [
    {
      "image": {
        "content": "<base64-data>",
        "bloburl": "<your-blob-storage-url>/image.png"
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

### Deploy the incident

Use the following command to deploy the incident, making it available for the analysis of new content.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:deploy?api-version=2024-02-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' 
```

#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:deploy?api-version=2024-02-15-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
---

### Detect image incidents

Use the following command to upload a sample image and test it against the incident you deployed. You can either use a URL pointing to the image in an Azure blob storage container, or you can add the image data as a Base64 string.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/image:detectIncidents?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
    "image": {
      "url": "<your-blob-storage-url>/image.png",
      "content": "<base64-data>"
    },
    "incidentNames": [
      "<image-incident-name>"
    ]
  }
}'
```

#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image:detectIncidents?api-version=2024-02-15-preview "

payload = json.dumps({
  "image": {
    "url": "<your-blob-storage-url>/image.png",
    "content": "<base64-data>"
  },
  "incidentNames": [
    "<image-incident-name>"
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

## Other incident operations

The following operations are useful for managing incidents and incident samples.

### Text incidents API

#### List all incidents

#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/text/incidents?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```

#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents?api-version=2024-02-15-preview "

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

```bash
curl --location GET 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```

#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview "

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

```bash
curl --location --request DELETE 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```

#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```
---

#### List all samples under an incident

This command retrieves the unique IDs of all the samples associated with a given incident object.

#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentsamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentsamples?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get an incident sample's details

Use an incident sample ID to look up details about the sample.

#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentsamples/<your-incident-sample-id>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>/incidentsamples/<your-incident-sample-id>?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete an incident sample

Use an incident sample ID to retrieve and delete that sample.

#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:removeIncidentSamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "IncidentSampleIds": [
    "<your-incident-sample-id>"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/<text-incident-name>:removeIncidentSamples?api-version=2024-02-15-preview "

payload = json.dumps({
  "IncidentSampleIds": [
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

### Image incidents API

#### Get the incidents list

#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/image/incidents?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```

#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents?api-version=2024-02-15-preview "

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

```bash
curl --location GET 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview "

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

```bash
curl --location --request DELETE 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```

#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```
---

#### List all samples under an incident

This command retrieves the unique IDs of all the samples associated with a given incident object.


#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentsamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentsamples?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Get the incident sample details

Use an incident sample ID to look up details about the sample.


#### [cURL](#tab/curl)

```bash
curl --location GET 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentsamples/<your-incident-sample-id>?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>'
```
#### [Python](#tab/python)

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>/incidentsamples/<your-incident-sample-id>?api-version=2024-02-15-preview "

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<your-content-safety-key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
---

#### Delete the incident sample

Use an incident sample ID to retrieve and delete that sample.


#### [cURL](#tab/curl)

```bash
curl --location 'https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:removeIncidentSamples?api-version=2024-02-15-preview ' \
--header 'Ocp-Apim-Subscription-Key: <your-content-safety-key>' \
--header 'Content-Type: application/json' \
--data '{
  "IncidentSampleIds": [
    "<your-incident-sample-id>"
  ]
}'
```
#### [Python](#tab/python)

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/<image-incident-name>:removeIncidentSamples?api-version=2024-02-15-preview "

payload = json.dumps({
  "IncidentSampleIds": [
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

## Related content

- [Custom categories (rapid) concepts](../concepts/custom-categories-rapid.md)
- [What is Azure AI Content Safety?](../overview.md)
