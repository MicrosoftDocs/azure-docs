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

Currently this API is only available in English. While users can try guidelines in other languages, we don't commit the output (like the languages of reasoning). We output the reasoning in the language of provided guidelines by default.

### Response sub-category in output

We only support outputting a single sub-category but not multiple sub-categories. If you want to define the final sub-category out of multiple, please note in the emphases, like "If the text hits multiple sub-categories, output the maximum sub-category".

## Concepts

### Community guideline

Community guidelines refer to a set of rules or standards that are established by an online community or social media platform to govern the behavior of its users. These guidelines are designed to ensure that all users are treated with respect, and that harmful or offensive content is not posted or shared. They may include rules around hate speech, harassment, nudity, violence, or other types of content that may be deemed inappropriate. Users who violate community guidelines may face consequences such as having their account suspended or banned.

### Category

A category refers to a specific type of prohibited content or behavior that is outlined in the guidelines. Categories may include things like hate speech, harassment, threats, nudity or sexually explicit content, violence, spam, or other forms of prohibited content. These categories are typically defined in broad terms to encompass a range of different behaviors and types of content that are considered to be problematic. By outlining specific categories of prohibited content, community guidelines provide users with a clear understanding of what is and is not allowed on the platform and help to create a safer and more positive online community.

## QuickStart

Before you can begin to test, you need to [create an Azure AI Content Safety resource]((https://aka.ms/acs-create)) and get the subscription keys to access the resource.


### Allowlist your subscription ID

1. Submit this form by filling in your subscription ID to allow this feature: [Microsoft Forms](https://forms.office.com/r/38GYZwLC0u).
2. Approval will take up to 48 hours. Once you receive a notification from Microsoft, you can go to the next step.

### Create an Azure AI Content Safety resource

1. Sign in to the [Azure Portal](https://portal.azure.com/).
1. [Create Content Safety Resource](https://aka.ms/acs-create). Enter a unique name for your resource, select the **whitelisted subscription**, resource group, and your preferred region in one of the **East US, West Europe** and pricing tier. Select **Create**.
1. **The resource will take a few minutes to deploy.** After it does, go to the new resource. To access your Content Safety resource, you'll need a subscription key; In the left pane, under **Resource Management**, select **API Keys and Endpoints**. Copy one of the subscription key values and endpoint for later use.

### Bring your own Azure OpenAI resource

You need to bring your own Azure OpenAI resource to perform the adaptive annotation task. Please make sure your deployment is built on GPT-4. For other model versions, the annotation quality is not guaranteed.

#### Grant your Azure Content Safety resource access to your Azure OpenAI resource

tbd use an include here.

1. Go to your Azure OpenAI resource and open 'Access control'. Click 'Add role assignment'.
![Role assignment](images/role-assignment.png)

1. Search for role 'Cognitive Services User', click, and select 'Next'. 
![Congnitive Services User](images/cognitive-services-user.png)

1. Choose 'Managed Identity' for 'assign access to' option, and choose the Azure Content Safety resource that you've created in 'Members'.
![Select identity](images/select-identity.png)

1. Finally select 'Review + assign'. After it is completed, your Azure Content Safety resource has been assigned permission to use your Azure OpenAI resource for annotation. 

#### Get your Azure OpenAI resource endpoint

Go to your Azure OpenAI resource and open 'Keys and endpoint' to copy the key and endpoint. 

#### Get your GPT-4 deployment name

Go to your Azure OpenAI resource and open **Model deployments**. Select **Manage Deployments**, and get the deployment name of GPT-4 that you'd like to use for annotation task.

#### Modify the content filtering setting to enable annotation mode

The adaptive annotation API needs to leverage the extended language understanding capability of GPT-4 for the content annotation task. To complete the task without filtering the input/output, the content filtering configuration in your GPT-4 deployment needs to be updated to 'annotation' mode. 

You need to apply for modified content filtering by filling out [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu). After the application is approved, you can update the content filtering configuration in your GPT-4 deployment to 'annotation' mode by unchecking the boxes at each harmful category. 
![Modify content filtering](images/modify-content-filtering.png)


### Test with sample request

Now that you have a resource available in Azure for Content Safety and you have a subscription key for that resource, let's run some tests by using the Adaptive Annotation API.

#### Create a customized category according to specific community guideline

The initial step is to convert your customized community guideline/content policy to one or multiple customized categories in Azure AI Content Safety. Then get it ready to be used for the following annotation task.

| Name       | Description   | Type    |
| :------------ | :--------- | ------- |
| **CategoryName** | (Required) Category name should start with "Customized_", valid character set is "0-9A-Za-z._~-" | String  |
| **SubCategories** | (Required) To define the sub-categories within each category as the minimum annotation granularity. The max sub-categories count is 10, minimum sub-categories count is 2. Within each sub-category, you need to specify an ID (integer), a name (string) and a list of statements (list) to better describe the scope of the sub-category. When you annotate, if your input does not belong to any defined sub-categories, the model will output a predefined sub-category with id=-1 and name="Undefined". | List  |
| **ExampleBlobUrl**   | (Optional) The file should  be ".jsonl" format, where each line is an example in json format, the maximum file size is 1MB. | String    |

##### Request payload reference

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

##### Format requirement for examples

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

##### Sample Code

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

#### Perform annotation on input text

After the customized category is created successfully, you can provide the text to be annotated according to the guideline of the newly created category. The input is very simple of 'text' and 'category'.

| Name        | Description     | Type    |
| :----------- | :---------- | ------- |
| **Category** | (Required) Name of the newly created category. | String  |
| **Text** | (Required) String of the text to be annotated. The maximum length is 1000 Unicode characters. | String |

##### Request payload reference

```
{
    "text": "xxxx", //String of the text to be annotated.
    "category": "yyyy" //The newly defined category name.
}

```

##### Sample Code

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

#### Sample Code

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

#### Sample Code

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

#### Sample Code


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
