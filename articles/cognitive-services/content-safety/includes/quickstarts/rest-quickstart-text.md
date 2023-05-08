---
title: "Quickstart: Analyze text content"
description: In this quickstart, get started using Content Safety to analyze text content for objectionable material.
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
| **Category**   | Each output class that the API predicts. Classification can be multi-labeled. For example, when a text sample is run through the text moderation model, it could be classified as both sexual content and violence. [Content flags](../../concepts/content-flags.md)| String |
| **Severity Level** | The higher the severity of input content, the larger this value is. The values can be: 0,2,4,6.	  | Integer |


## Response codes

The content APIs may return the following HTTP response codes:

| Response code | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| `200`           | OK - Standard response for successful HTTP requests.         |
| `201`           | Created - The request has been fulfilled, resulting in the creation of a new resource. |
| `204`           | No content - The server successfully processed the request, and isn't returning any content. Usually this is returned for the DELETE operation. |
| `400`           | Bad request – The server can't process the request due to a client error (for example, malformed request syntax, size too large, invalid request message framing, or deceptive request routing). |
| `401`           | Unauthorized – Authentication is required and has failed.    |
| `403`           | Forbidden – User not having the necessary permissions for a resource. |
| `404`           | Not found - The requested resource couldn't be found.       |
| `429`           | Too many requests – The user has sent too many requests in a given amount of time. Refer to "Quota Limit" section for limitations. |
| `500`           | Internal server error – An unexpected condition was encountered on the server side. |
| `503`           | Service unavailable – The server can't handle the request temporarily. Try again at a later time. |
| `504`           | Gateway time out – The server didn't receive a timely response from the upstream service. Try again at a later time. |
