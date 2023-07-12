---
title: "Quickstart: Analyze text content"
description: In this quickstart, get started using Content Safety to analyze text content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.custom: build-2023
ms.topic: include
ms.date: 04/11/2023
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
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
curl --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "text": "I hate you",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ]
}'
```

The below fields must be included in the url:

| Name      |Required  |  Description | Type   |
| :------- |-------- |:--------------- | ------ |
| **API Version** |Required |This is the API version to be checked. Current version is: api-version=2023-04-30-preview. Example: `<endpoint>/contentsafety/text:analyze?api-version=2023-04-30-preview` | String |

The parameters in the request body are defined in this table:

| Name        | Required     | Description  | Type    |
| :---------- | ----------- | :------------ | ------- |
| **text**    | Required | This is the raw text to be checked. Other non-ascii characters can be included. | String  |
| **categories** | Optional | This is assumed to be an array of category names. See the [Harm categories guide](../../concepts/harm-categories.md) for a list of available category names. If no categories are specified, all four categories are used. We will use multiple categories to get scores in a single request. | String  |
| **blocklistNames**    | Optional | Text blocklist Name. Only support following characters:  `0-9 A-Z a-z - . _ ~`. You could attach multiple lists name here. | Array   |
| **breakByBlocklists** | Optional | When set to `true`, further analyses of harmful content will not be performed in cases where blocklists are hit. When set to `false`, all analyses of harmful content will be performed, whether or not blocklists are hit. | Boolean |


See the following sample request body:

```json
{
  "text": "I hate you",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ],
  "blocklistNames": [
    "array"
  ],
  "breakByBlocklists": false
}
```

Open a command prompt window and run the cURL command.


### Interpret the API response

You should see the text moderation results displayed as JSON data in the console output. For example:

```json
{
    "blocklistsMatchResults": [],
    "hateResult": {
        "category": "Hate",
        "severity": 0
    },
    "selfHarmResult": {
        "category": "SelfHarm",
        "severity": 0
    },
    "sexualResult": {
        "category": "Sexual",
        "severity": 0
    },
    "violenceResult": {
        "category": "Violence",
        "severity": 0
    }
}
```

The JSON fields in the output are defined here:

| Name     | Description   | Type   |
| :------------- | :--------------- | ------ |
| **Category**   | Each output class that the API predicts. Classification can be multi-labeled. For example, when a text sample is run through the text moderation model, it could be classified as both sexual content and violence. [Harm categories](../../concepts/harm-categories.md)| String |
| **Severity** | The higher the severity of input content, the larger this value is. The values can be: 0,2,4,6.	  | Integer |
