---
title: tbd
description: tbd
titleSuffix: Azure AI services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: conceptual
ms.date: 04/09/2024
ms.author: pafarley
---

# Use the adaptive annotation API

With the extensive capabilities of natural language understanding, it's been proven that GPT-4 reaches human parity in understanding the harmful content policy/community guideline and performing harmful content annotation task that is adaptive to each customer's use case.  

Alongside the practice of enforcing content safety techniques in products/communities in various industries, it's been found the "definition of harmful content" varies by use cases. Thus, there's usually an additional human review process after the content gets flagged by the Azure AI Content Safety API to get the results adapted. The adaptive annotation API helps to fill this gap and streamline the content moderation process in an adaptive and automatic way.

tbd limited access alert.




> [!CAUTION]
> The sample code could have offensive content, user discretion is advised.


## How it works

### Type of analysis

| API      | Functionality   |
| :--------- | :------------ |
| Customized Categories | Create, get, and delete a customized category or list all customized categories for further annotation task |
| Adaptive Annotate | Annotate input text with specified customized category |

### Language availability

Currently this API is only available in English. While users can try guidelines in other languages, we don't guarantee the output. We output the reasoning in the language of provided guidelines by default.

### Response sub-category in output

We support outputting a single sub-category but not multiple sub-categories. If you want to define the final sub-category out of multiple, please note in the emphases, like "If the text hits multiple sub-categories, output the maximum sub-category".

## Concepts

### Community guideline

Community guidelines refer to a set of rules or standards that are established by an online community or social media platform to govern the behavior of its users. These guidelines are designed to ensure that all users are treated with respect, and that harmful or offensive content is not posted or shared. They may include rules around hate speech, harassment, nudity, violence, or other types of content that may be deemed inappropriate. Users who violate community guidelines may face consequences such as having their account suspended or banned.

### Category

A category refers to a specific type of prohibited content or behavior that is outlined in the guidelines. Categories may include things like hate speech, harassment, threats, nudity or sexually explicit content, violence, spam, or other forms of prohibited content. These categories are typically defined in broad terms to encompass a range of different behaviors and types of content that are considered to be problematic. By outlining specific categories of prohibited content, community guidelines provide users with a clear understanding of what is and is not allowed on the platform and help to create a safer and more positive online community.

## QuickStart


## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Get access: The adaptive annotation API is a gated feature. Apply for access by submitting this form with your Azure subscription ID: [Microsoft Forms](https://aka.ms/content-safety-gate). The request will take up to 48 hours to approve. Once you receive an approval notification from Microsoft, you can go to the next step.
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US or Sweden Central), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed


## Bring your own Azure OpenAI resource

You need to bring your own Azure OpenAI resource to perform the adaptive annotation task. 

Go to your Azure OpenAI resource and open **Keys and endpoint** page. Copy the key and endpoint to a temporary location.

Please make sure your deployment is built on GPT-4. For other model versions, the annotation quality is not guaranteed.

### Grant your Azure Content Safety resource access to your Azure OpenAI resource

[!INCLUDE [openai-account-access](../includes/openai-account-access.md)]

### Get your GPT-4 deployment name

Go to your Azure OpenAI resource and open **Model deployments**. Select **Manage Deployments**, and get the name of the GPT-4 deployment that you'd like to use for the annotation task.

## Modify the content filtering setting to enable annotation mode

The adaptive annotation API needs to leverage the extended language understanding capability of GPT-4 for the content annotation task. To complete the task without filtering the input/output, the content filtering configuration in your GPT-4 deployment needs to be updated to 'annotation' mode. 

You need to apply for modified content filtering by filling out [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu). After the application is approved, you can update the content filtering configuration in your GPT-4 deployment to 'annotation' mode by unchecking the boxes at each harmful category. 
![Modify content filtering](images/modify-content-filtering.png)


## Test with sample request

Now that you have a resource available in Azure for Content Safety and you have a subscription key for that resource, let's run some tests by using the Adaptive Annotation API.

### Create a customized category according to specific community guideline

The initial step is to convert your customized community guideline/content policy to one or multiple customized categories in Azure AI Content Safety. Then get it ready to be used for the following annotation task.

| Name       | Description   | Type    |
| :------------ | :--------- | ------- |
| **CategoryName** | (Required) Category name should start with "Customized_", valid character set is "0-9A-Za-z._~-" | String  |
| **SubCategories** | (Required) To define the sub-categories within each category as the minimum annotation granularity. The max sub-categories count is 10, minimum sub-categories count is 2. Within each sub-category, you need to specify an ID (integer), a name (string) and a list of statements (list) to better describe the scope of the sub-category. When you annotate, if your input does not belong to any defined sub-categories, the model will output a predefined sub-category with id=-1 and name="Undefined". | List  |
| **ExampleBlobUrl**   | (Optional) The file should  be ".jsonl" format, where each line is an example in json format, the maximum file size is 1MB. | String    |

#### Request payload reference

```json
{
  "categoryName": "Customized_<your-category-name>",//required, Category name should start with "Customized_", valid character set is "0-9A-Za-z._~-". The maximum length is 64 Unicode characters.
  "subCategories": [//required, the max sub-category is 10, min sub-category count is 2. 
    {

      "id": 0, //required, sub-category id
      "name": "name_0" //required, sub-category name
      "statements": [//required, to enumerate the detailed definitions per sub-category here. Max statements per sub-category is 10.
        "string"
      ]
    },
    {
      "id": 1, //required, sub-category id
      "name": "name_1" //required, sub-category name
      "statements": [//required, to enumerate the detailed definitions per sub-category here. Max statements per sub-category is 10.
        "string"
      ]
    }
  ],

  "exampleBlobUrl": "string",//optional, the file should  be ".jsonl" format, where each line is an example in json format, the maximum file size is 1MB.
}
```

#### Format requirement for examples

The examples that are provided for each sub-category in the Blob URL need to follow below format requirements:

```
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

#### Sample Code

create a custom category

```bash
curl --location --request PUT '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2024-04-15tbd' \
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


```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2023-10-30-preview"

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

### Perform annotation on input text

After the customized category is created successfully, you can provide the text to be annotated according to the guideline of the newly created category. The input is very simple of 'text' and 'category'.

| Name        | Description     | Type    |
| :----------- | :---------- | ------- |
| **Category** | (Required) Name of the newly created category. | String  |
| **Text** | (Required) String of the text to be annotated. The maximum length is 1000 Unicode characters. | String |

#### Request payload reference

```
{
    "text": "xxxx", //String of the text to be annotated.
    "category": "yyyy" //The newly defined category name.
}

```

#### Sample Code

```bash
curl --location '<endpoint>/contentsafety/text:adaptiveAnnotate?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "text": "I want to kill a cat",
  "category": "Customized_Test"
}'
```

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text:adaptiveAnnotate?api-version=2023-10-30-preview"

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

## Other Categories APIs

### Get Category

```bash
curl --location '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2023-10-30-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```

### List Categories

```bash
curl --location '<endpoint>/contentsafety/text/categories?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```


```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories?api-version=2023-10-30-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```

### Delete Category


```bash
curl --location --request DELETE '<endpoint>/contentsafety/text/categories/Customized_Test?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests
import json

endpoint = "<endpoint>"
url = endpoint+"/contentsafety/text/categories/Customized_Test?api-version=2023-10-30-preview"

headers = {
  "Ocp-Apim-Subscription-Key": '<api_key>',
  "Content-Type": "application/json"
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.status_code)
print(response.text)
```
