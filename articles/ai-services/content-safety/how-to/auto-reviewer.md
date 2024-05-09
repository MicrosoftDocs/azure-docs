---
title: Use the Adaptive annotation API in Azure AI Content Safety
description: Use the Adaptive annotation API to have your GPT-4 resource annotate text according to your customized categories.
titleSuffix: Azure AI services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: conceptual
ms.date: 04/09/2024
ms.author: pafarley
---

# Use the adaptive annotation API

Businesses and communities often have their own unique guidelines for what constitutes harmful content. The definition of "harmful content" varies by use case and industry. Therefore, there's usually an additional human review process after the content gets flagged by an automated tool like the Azure AI Content Safety moderation APIs. 

However, with their extensive capabilities of natural language understanding, GPT-4 models have reached human parity in understanding harmful content policies/community guidelines and performing harmful content annotation tasks that are adapted to each customer's use case. The adaptive annotation API in Azure AI Content Safety allows you to create customized categories based on your community guidelines and then annotate text according to those categories.


> [!IMPORTANT]
> The adaptive annotation API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](https://aka.ms/content-safety-gate).

> [!CAUTION]
> The sample code in this guide could contain offensive content, user discretion is advised.




## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Get access: The adaptive annotation API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](https://aka.ms/content-safety-gate). The request will take up to 48 hours to approve. Once you receive an approval notification from Microsoft, you can go to the next step.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US or Sweden Central), and supported pricing tier. Then select **Create**.
   * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* Also create an Azure OpenAI service resource. 
   * Create a deployment with a GPT-4 model.
   * Apply for modified content filtering by filling out [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu).  
* One of the following installed:
   * [cURL](https://curl.haxx.se/) for REST API calls.
   * [Python 3.x](https://www.python.org/) installed


tbd env vars?


## Use your own Azure OpenAI resource

You need to use your own Azure OpenAI resource to perform the adaptive annotation task. 

Go to your Azure OpenAI resource and open **Keys and endpoint** page. Copy the key and endpoint to a temporary location.

Please make sure your deployment uses a GPT-4 model. For other model versions, the annotation quality is not guaranteed.

### Get your GPT-4 deployment name

Go to your Azure OpenAI resource page in the Azure portal and open the **Model deployments** tab. Select **Manage Deployments**, and get the name of the GPT-4 deployment that you'd like to use for the annotation task.

### Give your Azure Content Safety resource access to Azure OpenAI

[!INCLUDE [openai-account-access](../includes/openai-account-access.md)]


## Modify the content filtering settings to enable annotation mode

To complete the content annotation task without filtering (blocking) the inputs and outputs, you need to set the content filtering configuration in your GPT-4 deployment to **annotation** mode.

Apply for modified content filtering by filling out [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu). After you application is approved, you can update the content filtering configuration in your GPT-4 deployment to **annotation** mode by unchecking the boxes at each harmful category in Azure OpenAI Studio.
 
![Modify content filtering](images/modify-content-filtering.png)


## Create a customized category according to specific community guidelines

Now that you have an Azure AI Content Safety resource available and you have a subscription key for that resource, run some tests with the Adaptive Annotation API.

The first step is to convert your own community guideline/content policy into one or multiple content categories in Azure AI Content Safety.

The following sample code creates a customized category with two sub-categories: "Others" and "AnimalAbuse".

#### [cURL](#tab/curl)
```bash
curl --location --request PUT '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "categoryName": "Customized_Test",
  "subCategories": [
    {
      "id": 0,
      "name": "Others",
      "statements": [
        "all cases that do not fall into sub-category 1"
      ]
    },
    {
      "id": 1,
      "name": "AnimalAbuse",
      "statements": [
        "Animal abuse"
      ]
    }
  ],
  "exampleBlobUrl": ""
}'
```

#### [Python](#tab/python)

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}
payload = json.dumps({
  "categoryName": "Customized_Test",
  "subCategories": [
    {
      "id": 0,
      "name": "Others",
      "statements": [
        "all cases that do not fall into sub-category 1"
      ]
    },
    {
      "id": 1,
      "name": "AnimalAbuse",
      "statements": [
        "Animal abuse"
      ]
    }
  ],
  "exampleBlobUrl": ""
})

response = requests.request("PUT", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
---

The JSON objects are defined here:

| Name       | Description   | Type    |
| :------------ | :--------- | ------- |
| **CategoryName** | (Required) Category name should start with "Customized_", valid character set is "0-9A-Za-z._~-" | String  |
| **SubCategories** | (Required) To define the sub-categories within each category as the minimum annotation granularity. The max sub-categories count is 10, minimum sub-categories count is 2. Within each sub-category, you need to specify an ID (integer), a name (string) and a list of statements (list) to better describe the scope of the sub-category. When you annotate, if your input does not belong to any defined sub-categories, the model will output a predefined sub-category with id=-1 and name="Undefined". | List  |
| **ExampleBlobUrl**   | (Optional) The file should  be _.jsonl_ format, where each line is an example in json format, the maximum file size is 1MB. | String    |

If you use an example blob URL, the _.jsonl_ file should contain examples in the following format:

```json
{
  "text": "The text of the example 1", //required, 
  "id": 0, //required, the sub-category id that the example describes,
  "reasoning": "The reason for the annotation" //optional
}
{
  "text": "The text of the example 2", //required, 
  "id": 1, //required, the sub-category id that the example describes
  "reasoning": "The reason for the annotation" //optional
}
```

### Response sub-category in output

We support outputting a single sub-category but not multiple sub-categories. If you want to define the final sub-category out of multiple, please note in the emphases, like "If the text hits multiple sub-categories, output the maximum sub-category".

## Perform annotation on input text

After you create the custom category, you can provide input text to be annotated according to it. 

The following sample code annotates the input text `"I want to kill a cat"` with the "Customized_Test" category.

#### [cURL](#tab/curl)
```bash
curl --location '<endpoint>/contentsafety/text:adaptiveAnnotate?api-version=2024-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "text": "I want to kill a cat",
  "category": "Customized_Test"
}'
```

#### [Python](#tab/python)

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text:adaptiveAnnotate?api-version=2024-04-15-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}
payload = json.dumps({
  "text": "I want to kill a cat",
  "category": "Customized_Test"
})

response = requests.request("POST", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
---


The JSON objects are defined here:

| Name        | Description     | Type    |
| :----------- | :---------- | ------- |
| **Category** | (Required) Name of the newly created category. | String  |
| **Text** | (Required) String of the text to be annotated. The maximum length is 1000 Unicode characters. | String |

Format the request body in the following schema:

```json
{
    "text": "xxxx", //String of the text to be annotated.
    "category": "yyyy" //The newly defined category name.
}
```

## Use other Categories APIs

### Get category

#### [cURL](#tab/curl)
```bash
curl --location '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

#### [Python](#tab/python)

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
---

### List categories

#### [cURL](#tab/curl)

```bash
curl --location '<endpoint>/contentsafety/text/categories?api-version=2024-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

#### [Python](#tab/python)

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories?api-version=2024-04-15-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
---

### Delete category

#### [cURL](#tab/curl)
```bash
curl --location --request DELETE '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

#### [Python](#tab/python)
```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2024-04-15-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
---

## Next steps

Learn more about the custom categorization options in Azure AI Content Safety.

- [Custom categories](../concepts/custom-categories.md)