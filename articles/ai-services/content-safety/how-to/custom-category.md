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

# Use the custom category API

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

The custom category API lets you create your own harmful content categories for your use case and train Azure AI Content Safety to detect them in new content.

> [!IMPORTANT]
> This new feature is only available in the **East US** Azure region. 

## Prerequisites
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Get access: The custom categories API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](https://aka.ms/content-safety-gate). The request will take up to three business days to approve. Once you receive an approval notification from Microsoft, you can go to the next step.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US), and supported pricing tier. Then select **Create**.
   * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* One of the following installed:
   * [cURL](https://curl.haxx.se/) for REST API calls.
   * [Python 3.x](https://www.python.org/) installed

tbd env vars?

## Prepare your training data

To train a custom category, you need example text data that represents the category you want to detect.

1. Collect or write sample data
    - The quality of your sample data is important for training an effective model. Aim to collect at least 50 positive samples that accurately represent the content you want to identify. These samples should be clear, varied, and directly related to the category definition.
    - Negative samples are not required, but they can significantly improve the model's ability to distinguish relevant content from irrelevant content. 
        To improve performance, aim for 50 samples that are not related to the positive case definition. These should be varied but still within the context of the content your model will encounter. Choose negative samples carefully to ensure they don't inadvertently overlap with the positive category. 
    - Strive for a balance between the number of positive and negative samples. An uneven dataset can bias the model, causing it to favor one type of classification over another, which may lead to a higher rate of false positives or negatives.

1. Use a text editor to format your data in a *.jsonl* file. Here is an example of _.jsonl_ file content. Category examples should set `isPositive` to `true`. Negative examples are optional but can improve performance:
    ```jsonl
    {"text": "This is the 1st sample.", "isPositive": true}
    {"text": "This is the 2nd sample.", "isPositive": true}
    {"text": "This is the 3rd sample.", "isPositive": false}
    ```

1. Upload the .jsonl file to an Azure Storage account blob. You can create a new [Azure Storage Account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) if you don't have one. Copy the blob URL to a temporary location for later use.

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

Replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values.

### Create new category version

```bash
curl -X PUT "<your_endpoint>/contentsafety/text/categories/<your_category_name>?api-version=2024-05-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
        \"categoryName\": \"<your_category_name>\",
        \"definition\": \"Example Definition\",
        \"sampleBlobUrl\": \"https://example.blob.core.windows.net/example-container/sample.jsonl\",
        \"blobDelimiter\" : \"/\"
     }"
```


### Trigger the category build process:

```bash
curl -X POST "<your_api_key>/contentsafety/text/categories/<your_category_name>:build?api-version=2024-05-15-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```


### Analyze text with a customized category:

```bash
curl -X POST "<your_api_key>/contentsafety/text:analyze?api-version=2024-05-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json" \
     -d "{
        \"text\": \"Example text to analyze\",
        \"customizedCategories\": [{\"categoryName\": \"<your_category_name>\", \"version\": 1}]
     }"
```



#### [Python](#tab/python)

First, you need to install the required Python library:

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

### Create a new category version:
You can create a new category with *category name*, *definition* and *sample_blob_url*, and you will get the auto-generated version number of this category.
```python
def create_new_category_version(category_name, definition, sample_blob_url):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-05-15-preview"
    data = {
        "categoryName": category_name,
        "definition": definition,
        "sampleBlobUrl": sample_blob_url,
        "blobDelimiter" : "/"
    }
    response = requests.put(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
category_name = "DrugAbuse"
definition = "This category is related to Drug Abuse."
sample_blob_url = "https://example.blob.core.windows.net/example-container/drugsample.jsonl"

result = create_new_category_version(category_name, definition, sample_blob_url)
print(result)
```


### Trigger the category build process:

```python
def trigger_category_build_process(category_name, version):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}:build?api-version=2024-05-15-preview&version={version}"
    response = requests.post(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "<your_category_name>"
version = 1

result = trigger_category_build_process(category_name, version)
print(result)
```


### 6. Analyze text with a customized category:
You need to specify the *category name* and the *version number* (optional, will use the latest one by default) during inference. You can specify multiple categories if you have them ready.
```python
def analyze_text_with_customized_category(text, customized_categories):
    url = f"{ENDPOINT}/contentsafety/text:analyze?api-version=2024-05-15-preview"
    data = {
        "text": text,
        "customizedCategories": customized_categories
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
text = "Example text to analyze"
customized_categories = [{"categoryName": "<your_category_name>", "version": 1}]

result = analyze_text_with_customized_category(text, customized_categories)
print(result)
```

---

## Other custom category operations

#### [cURL](#tab/curl)

### Get a customized category or a specific version of it:

```bash
curl -X GET "<your_api_key>/contentsafety/text/categories/<your_category_name>?api-version=2024-05-15-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```

### List categories of their latest versions:

```bash
curl -X GET "<your_api_key>/contentsafety/text/categories?api-version=2024-05-15-preview" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```


### Delete a customized category or a specific version of it:

```bash
curl -X DELETE "<your_api_key>/contentsafety/text/categories/<your_category_name>?api-version=2024-05-15-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: <your_api_key>" \
     -H "Content-Type: application/json"
```


#### [Python](#tab/python)


First, you need to install the required Python library:

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

### Get a customized category or a specific version of it:

```python
def get_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-05-15-preview"
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

### List categories of their latest versions:

```python
def list_categories_latest_versions():
    url = f"{ENDPOINT}/contentsafety/text/categories?api-version=2024-05-15-preview"
    response = requests.get(url, headers=headers)
    return response.json()

result = list_categories_latest_versions()
print(result)
```

### Delete a customized category or a specific version of it:

```python
def delete_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-05-15-preview"
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

Remember to replace the placeholders with your actual values for the API key, endpoint, and specific content (category name, definition .etc). These examples should help you get started with using the Azure AI Content Safety API to analyze your text and work with customized categories.

