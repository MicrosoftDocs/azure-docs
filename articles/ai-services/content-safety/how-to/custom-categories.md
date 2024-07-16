---
title: "Use the custom category API"
titleSuffix: Azure AI services
description: Learn how to use the custom category API to create your own harmful content categories and train the Content Safety model for your use case.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: how-to
ms.date: 04/11/2024
ms.author: pafarley
---

# Use the custom categories (standard) API


The custom categories (standard) API lets you create your own content categories for your use case and train Azure AI Content Safety to detect them in new content.

> [!IMPORTANT]
> This feature is only available in certain Azure regions. See [Region availability](../overview.md#region-availability).

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource</a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, [supported region](../overview.md#region-availability), and supported pricing tier. Then select **Create**.
   * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. Copy the endpoint and either of the key values to a temporary location for later use.
* Also [create an Azure blob storage container](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) where you'll keep your training annotation file.
* One of the following installed:
   * [cURL](https://curl.haxx.se/) for REST API calls.
   * [Python 3.x](https://www.python.org/) installed


## Prepare your training data

To train a custom category, you need example text data that represents the category you want to detect. Follow these steps to prepare your sample data:

1. Collect or write your sample data:
    - The quality of your sample data is important for training an effective model. Aim to collect at least 50 positive samples that accurately represent the content you want to identify. These samples should be clear, varied, and directly related to the category definition.
    - Negative samples aren't required, but they can improve the model's ability to distinguish relevant content from irrelevant content. 
        To improve performance, aim for 50 samples that aren't related to the positive case definition. These should be varied but still within the context of the content your model will encounter. Choose negative samples carefully to ensure they don't inadvertently overlap with the positive category. 
    - Strive for a balance between the number of positive and negative samples. An uneven dataset can bias the model, causing it to favor one type of classification over another, which may lead to a higher rate of false positives or negatives.

1. Use a text editor to format your data in a *.jsonl* file. Below is an example of the appropriate format. Category examples should set `isPositive` to `true`. Negative examples are optional but can improve performance:
    ```json
    {"text": "This is the 1st sample.", "isPositive": true}
    {"text": "This is the 2nd sample.", "isPositive": true}
    {"text": "This is the 3rd sample (negative).", "isPositive": false}
    ```

1. Upload the _.jsonl_ file to an Azure Storage account blob container. Copy the blob URL to a temporary location for later use.

### Grant storage access 

[!INCLUDE [storage-account-access](../includes/storage-account-access.md)]

## Create and train a custom category

> [!IMPORTANT]
> **Allow enough time for model training**
>
> The end-to-end execution of custom category training can take from around five hours to ten hours. Plan your moderation pipeline accordingly and allocate time for:
> * Collecting and preparing your sample data
> * The training process
> * Model evaluation and adjustments

#### [cURL](#tab/curl)

In the commands below, replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values. Then enter each command in a terminal window and run it.

### Create new category version

```bash
curl -X PUT "<your_endpoint>/contentsafety/text/categories/<your_category_name>?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
        \"categoryName\": \"<your_category_name>\",
        \"definition\": \"<your_category_definition>\",
        \"sampleBlobUrl\": \"https://example.blob.core.windows.net/example-container/sample.jsonl\"
     }"
```

### Start the category build process:

After you receive the response, store the operation ID (referred to as `id`) in a temporary. You need this ID to retrieve the build status using the **Get status** API.

```bash
curl -X POST "<your_endpoint>/contentsafety/text/categories/<your_category_name>:build?api-version=2024-02-15-preview&version={version}" \
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

Run the following command to analyze text with your customized category. Replace `<your_category_name>` with your own value:

```bash
curl -X POST "<your_endpoint>/contentsafety/text:analyzeCustomCategory?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
        \"text\": \"Example text to analyze\",
        \"categoryName\": \"<your_category_name>\", 
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

### Create a new category version

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
category_name = "DrugAbuse"
definition = "This category is related to Drug Abuse."
sample_blob_url = "https://<your-azure-storage-url>/example-container/drugsample.jsonl"

result = create_new_category_version(category_name, definition, sample_blob_url)
print(result)
```

### Start the category build process

You can start the category build process with the *category name* and *version number*.

```python
def trigger_category_build_process(category_name, version):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}:build?api-version=2024-02-15-preview&version={version}"
    response = requests.post(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "<your_category_name>"
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
text = "Example text to analyze"
category_name = "<your_category_name>"
version = 1

result = analyze_text_with_customized_category(text, category_name, version)
print(result)
```

---

## Other custom category operations

Remember to replace the placeholders below with your actual values for the API key, endpoint, and specific content (category name, definition, and so on). These examples help you to manage the customized categories in your account.

#### [cURL](#tab/curl)

### Get a customized category or a specific version of it

Replace the placeholders with your own values and run the following command in a terminal window:

```bash
curl -X GET "<endpoint>/contentsafety/text/categories/<your_category_name>?api-version=2024-02-15-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```

### List categories of their latest versions

Replace the placeholders with your own values and run the following command in a terminal window:

```bash
curl -X GET "<endpoint>/contentsafety/text/categories?api-version=2024-02-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```

### Delete a customized category or a specific version of it

Replace the placeholders with your own values and run the following command in a terminal window:

```bash
curl -X DELETE "<endpoint>/contentsafety/text/categories/<your_category_name>?api-version=2024-02-15-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```

#### [Python](#tab/python)

First, make sure you've installed the required Python library:

```bash
pip install requests
```

Then, set up the necessary configurations with your own AI resource details:

```python
import requests

API_KEY = '<your_api_key>'
ENDPOINT = '<your_endpoint>'

headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
}
```

### Get a customized category or a specific version of it

Replace the placeholders with your own values and run the following code in your Python script:

```python
def get_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-02-15-preview"
    if version:
        url += f"&version={version}"
    
    response = requests.get(url, headers=headers)
    return response.json()

# Replace the parameters with your own values
category_name = "DrugAbuse"
version = 1

result = get_customized_category(category_name, version)
print(result)
```

### List categories of their latest versions

```python
def list_categories_latest_versions():
    url = f"{ENDPOINT}/contentsafety/text/categories?api-version=2024-02-15-preview"
    response = requests.get(url, headers=headers)
    return response.json()

result = list_categories_latest_versions()
print(result)
```

### Delete a customized category or a specific version of it

Replace the placeholders with your own values and run the following code in your Python script:

```python
def delete_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-02-15-preview"
    if version:
        url += f"&version={version}"
    
    response = requests.delete(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "<your_category_name>"
version = 1

result = delete_customized_category(category_name, version)
print(result)
```
---


## Related content

* [Custom categories concepts](../concepts/custom-categories.md)
* [Moderate content with Content Safety](../quickstart-text.md)
