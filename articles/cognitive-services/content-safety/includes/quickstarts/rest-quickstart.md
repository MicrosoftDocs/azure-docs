---
title: "Quickstart: Analyze image and text content"
description: In this quickstart, get started using Content Safety to analyze image and text content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: include
ms.date: 04/11/2023
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="TBD"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* [cURL](https://curl.haxx.se/) installed

## Analyze text content

The following section walks through a sample request with cURL. Paste the command below into a text editor, and make the following changes.

1. Replace `<endpoint>` with the endpoint URL associated with your resource.
1. Replace `<your_subscription_key>` with one of the keys that come with your resource.
1. Optionally, replace the `"text"` field in the body with your own text you'd like to analyze.
    > [!TIP]
    > Text size and granularity
    >
    > The default maximum length for text submissions is 1000 characters. If you need to analyze longer blocks of text, you can split the input text (for example, using punctuation or spacing) across multiple related submissions. 

```shell
curl.exe --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "text": "you are an idiot",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ]
}'
```

Open a command prompt window and run the cURL command.

The below fields must be included in the url:

| Name            | Description      | Type   |
| :------------ | :-------------- | ------ |
| **API Version** | (Required) This is the API version to be checked. Current version is: `api-version=2022-12-30-preview`. Example: `<Endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview` | String |



The JSON fields that can be included in the request body are defined in this table:

| Name        | Description         | Type    |
| :---------- | :----------------- | ------- |
| **Text**              | (Required) This is the raw text to be checked. Other non-ASCII characters can be included. | String  |
| **Categories**        | (Optional) This is assumed to be an array of category names. See the **Concepts** section for a list of available category names. If no categories are specified, all four categories are used. We use multiple categories to get scores in a single request. | String  |
| **BlocklistNames**    | Text blocklist Name. Only support following characters: `0-9 A-Z a-z - . _ ~`. You could attach multiple lists name here. | Array   |
| **BreakByBlocklists** | If set this field to `true`, once a blocklist is matched, the analysis returns immediately without model output. Default is `false`. | Boolean |

See the following sample request body:

```json
{
  "text": "you are an idiot",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ],
  "blocklistNames": [
    "array"
  ],
  "breakByBlocklists": false
}
```


### Interpret the API response

You should see the text moderation results displayed as JSON data in the console output. For example:

```json
{
    "blocklistMatchResults": [],
    "hateResult": {
        "category": "Hate",
        "riskLevel": 2
    },
    "selfHarmResult": {
        "category": "SelfHarm",
        "riskLevel": 0
    },
    "sexualResult": {
        "category": "Sexual",
        "riskLevel": 0
    },
    "violenceResult": {
        "category": "Violence",
        "riskLevel": 0
    }
}
```

The JSON fields in the output are defined here:

| Name     | Description   | Type   |
| :------------- | :--------------- | ------ |
| **Category**   | Each output class that the API predicts. Classification can be multi-labeled. For example, when a text sample is run through the text moderation model, it could be classified as both sexual content and violence. | String |
| **Risk Level** | Severity of the consequences of showing the content in question.  | Number |


## Analyze image content

The following section walks through a sample request with cURL. 

### Prepare a sample image

Choose a sample image to analyze. We support JPEG, PNG, GIF, and BMP image formats.

You can upload your image by one of two methods:**Base64 or by Blob url**. .
- First method (recommended): Encode your image to base64. You can use a website like [codebeautify](https://codebeautify.org/image-to-base64-converter) to do the encoding easily. Save the encoded image to your device, and copy the local file path to use in the next step. 
- Second method: [Upload the image to an Azure Blob Storage Account](https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html). Put your Blob URL into the _url_ parameter below. Currently we only support system assigned Managed Identity to access blob storage, so you must enable system assigned Managed identity for the Azure Content Safety instance and assign the role of "Storage Blob Data Contributor/Owner/Reader" to the identity:
    - Enable managed identity for Azure Content Safety instance. 

      ![Screenshot of Azure portal enabling managed identity.](https://user-images.githubusercontent.com/36343326/213126427-2c789737-f8ec-416b-9e96-d96bf25de58e.png)

    - Assign the role of "Storage Blob Data Contributor/Owner/Reader" to the Managed identity. Any roles highlighted below should work.

      ![assign-role-2](https://user-images.githubusercontent.com/36343326/213126492-938bd351-7e53-45a7-97df-b9d8be94ad80.png)

      ![assign-role-3](https://user-images.githubusercontent.com/36343326/213126536-31efac53-1741-4ff6-97a0-324b9a7e67a9.png)

      ![assign-role-4](https://user-images.githubusercontent.com/36343326/213126616-03af2bc9-2328-42f6-abeb-766eff28cd8a.png)

Paste the command below into a text editor, and make the following changes.


1. Substitute the `<endpoint>` with your resource endpoint URL.
1. Replace `<your_subscription_key>` tbd



Here is a sample request with cURL. You must have [cURL](https://curl.se/download.html) installed to run it.

```shell
curl.exe --location --request POST '<endpoint>/contentsafety/image:analyze?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "image": {
    "content": "<base_64_string>"
  }
}'
```


### Interpret the API response

You should see the image moderation results displayed as JSON data in the console. For example:

```json
{
    "hateResult": {
        "category": "Hate",
        "riskLevel": 0
    },
    "selfHarmResult": {
        "category": "SelfHarm",
        "riskLevel": 0
    },
    "sexualResult": {
        "category": "Sexual",
        "riskLevel": 0
    },
    "violenceResult": {
        "category": "Violence",
        "riskLevel": 2
    }
}
```

## Next steps

tbd