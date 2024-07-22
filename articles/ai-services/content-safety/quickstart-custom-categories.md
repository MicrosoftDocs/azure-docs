---
title: "Quickstart: Custom categories"
titleSuffix: Azure AI services
description: Use the custom category API to create your own harmful content categories and train the Content Safety model for your use case.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: quickstart
ms.date: 07/03/2024
ms.author: pafarley
---

# Quickstart: Custom categories (standard mode)

Follow this guide to use Azure AI Content Safety Custom category REST API to create your own content categories for your use case and train Azure AI Content Safety to detect them in new text content.

> [!IMPORTANT]
> This feature is only available in certain Azure regions. See [Region availability](./overview.md#region-availability).

> [!IMPORTANT]
> **Allow enough time for model training**
>
> The end-to-end execution of custom category training can take from around five hours to ten hours. Plan your moderation pipeline accordingly.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource</a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, [supported region](./overview.md#region-availability), and supported pricing tier. Then select **Create**.
   * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. Copy the endpoint and either of the key values to a temporary location for later use.
* Also [create an Azure blob storage container](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) where you'll keep your training annotation file.
* One of the following installed:
   * [cURL](https://curl.haxx.se/) for REST API calls.
   * [Python 3.x](https://www.python.org/) installed


## Prepare your training data

To train a custom category, you need example text data that represents the category you want to detect. In this guide, you can use sample data. The provided annotation file contains text prompts about survival advice in camping/wilderness situations. The trained model will learn to detect this type of content in new text data.

> [!TIP]
> For tips on creating your own data set, see the [How-to guide](./how-to/custom-categories.md#prepare-your-training-data).

1. Download the [sample text data file](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/ContentSafety/survival-advice.jsonl) from the GitHub repository.
1. Upload the _.jsonl_ file to your Azure Storage account blob container. Then copy the blob URL to a temporary location for later use.

### Grant storage access 

[!INCLUDE [storage-account-access](./includes/storage-account-access.md)]

## Create and train a custom category

#### [cURL](#tab/curl)

In the command below, replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values. Then enter each command in a terminal window and run it.

### Create new category version

```bash
curl -X PUT "<your_endpoint>/contentsafety/text/categories/survival-advice?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
            \"categoryName\": \"survival-advice\",
            \"definition\": \"text prompts about survival advice in camping/wilderness situations\",
            \"sampleBlobUrl\": \"https://<your-azure-storage-url>/example-container/survival-advice.jsonl\"
        }"
```

### Start the category build process:

Replace `<your_api_key>` and `<your_endpoint>` with your own values. Allow enough time for model training: the end-to-end execution of custom category training can take from around five hours to ten hours. Plan your moderation pipeline accordingly. After you receive the response, store the operation ID (referred to as `id`) in a temporary location. This ID will be necessary for retrieving the build status using the **Get status** API in the next section.

```bash
curl -X POST "<your_endpoint>/contentsafety/text/categories/survival-advice:build?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```
### Get the category build status:

To retrieve the status, utilize the `id` obtained from the previous API response and place it in the path of the API below.

```bash
curl -X GET "<your_endpoint>/contentsafety/text/categories/operations/<id>?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```

## Analyze text with a customized category

Run the following command to analyze text with your customized category. Replace `<your_api_key>` and `<your_endpoint>` with your own values.

```bash
curl -X POST "<your_endpoint>/contentsafety/text:analyzeCustomCategory?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
            \"text\": \"<Example text to analyze>\",
            \"categoryName\": \"survival-advice\", 
            \"version\": 1
        }"
```


#### [Python](#tab/python)

First, you need to install the required Python library:

```bash
pip install requests
```

Then, open a new Python script and define the necessary variables with your own Azure resource details:

```python
import requests

API_KEY = '<your_api_key>'
ENDPOINT = '<your_endpoint>'

headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
}
```

### Create a new category

You can create a new category with *category name*, *definition* and *sample_blob_url*, and you'll get the autogenerated version number of this category.

```python
def create_new_category_version(category_name, definition, sample_blob_url):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-02-15-preview"
    data = {
        "categoryName": category_name,
        "definition": definition,
        "sampleBlobUrl": sample_blob_url
    }
    response = requests.put(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
category_name = "survival-advice"
definition = "text prompts about survival advice in camping/wilderness situations"
sample_blob_url = "https://<your-azure-storage-url>/example-container/survival-advice.jsonl"

result = create_new_category_version(category_name, definition, sample_blob_url)
print(result)
```

### Start the category build process

You can start the category build process with the *category name* and *version number*. Allow enough time for model training: the end-to-end execution of custom category training can take from around five hours to ten hours. Plan your moderation pipeline accordingly. After receiving the response, ensure that you store the operation ID (referred to as `id`) somewhere like your notebook. This ID will be necessary for retrieving the build status using the ‘get_build_status’ function in the next section.

```python
def trigger_category_build_process(category_name, version):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}:build?api-version=2024-02-15-preview&version={version}"
    response = requests.post(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "survival-advice"
version = 1

result = trigger_category_build_process(category_name, version)
print(result)
```

### Get the category build status:

To retrieve the status, utilize the `id` obtained from the previous response.

```python
def get_build_status(id):
    url = f"{ENDPOINT}/contentsafety/text/categories/operations/{id}?api-version=2024-02-15-preview"
    response = requests.get(url, headers=headers)
    return response.status_code

# Replace the parameter with your own value
id = "your-operation-id"

result = get_build_status(id)
print(result)
```


## Analyze text with a customized category

You need to specify the *category name* and the *version number* (optional; the service uses the latest one by default) during inference. You can specify multiple categories if they're already defined.

```python
def analyze_text_with_customized_category(text, category_name, version):
    url = f"{ENDPOINT}/contentsafety/text:analyzeCustomCategory?api-version=2024-02-15-preview"
    data = {
        "text": text,
        "categoryName": category_name,
        "version": version
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
text = "<Example text to analyze>"
category_name = "survival-advice"
version = 1

result = analyze_text_with_customized_category(text, category_name, version)
print(result)
```

---

## Related content

* For information on other Custom category operations, see the [How-to guide](./how-to/custom-categories.md).
* [Custom categories concepts](./concepts/custom-categories.md)
* [Moderate content with Content Safety](./quickstart-text.md)
