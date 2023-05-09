---
title: "Quickstart: Analyze image content"
description: In this quickstart, get started using Content Safety to analyze image content for objectionable material.
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



## Analyze image content

The following section walks through a sample image moderation request with cURL. 

### Prepare a sample image

Choose a sample image to analyze, and download it to your device. 

We support JPEG, PNG, GIF, and BMP image formats. The maximum size for image submissions is 4 MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels.

You can input your image by one of two methods: **local filestream** or **blob storage URL**.
- **Local filestream** (recommended): Encode your image to base64. You can use a website like [codebeautify](https://codebeautify.org/image-to-base64-converter) to do the encoding. Then save the encoded string to a temporary location. 
- **Blob storage URL**: Upload your image to an Azure Blob Storage account. Follow the [blob storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) to learn how to do this. Then open Azure Storage Explorer and get the URL to your image. Save it to a temporary location. 

   Next, you need to give your Content Safety resource access to read from the Azure Storage resource. Enable system-assigned Managed identity for the Azure Content Safety instance and assign the role of **Storage Blob Data Contributor/Owner/Reader** to the identity:
   
   1. Enable managed identity for the Azure Content Safety instance. 

      :::image type="content" source="../../media/role-assignment.png" alt-text="Screenshot of Azure portal enabling managed identity.":::

   1. Assign the role of **Storage Blob Data Contributor/Owner/Reader** to the Managed identity. Any roles highlighted below should work.

      :::image type="content" source="../../media/add-role-assignment.png" alt-text="Screenshot of the Add role assignment screen in Azure portal.":::

      :::image type="content" source="../../media/assigned-roles.png" alt-text="Screenshot of assigned roles in the Azure portal.":::

      :::image type="content" source="../../media/managed-identity-role.png" alt-text="Screenshot of the managed identity role.":::

### Analyze image content

Paste the command below into a text editor, and make the following changes.

1. Substitute the `<endpoint>` with your resource endpoint URL.
1. Replace `<your_subscription_key>` with your key.
1. Populate the `"image"` field in the body with either a `"content"` field or a `"BlobURL"` field. For example: `{"image": {"content": "<base_64_string>"}` or `{"image": {"BlobURL": "<your_storage_url>"}`.

```shell
curl --location --request POST '<endpoint>/contentsafety/image:analyze?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "image": {
    "content": "<base_64_string>"
  }
}'
```

> [!NOTE]
> If you're using a blob storage URL, the request body will look like this:
>
> ```
> {
>  "image": {
>    "BlobURL": "<your_storage_url>"
>  }
> }
> ```

Open a command prompt window and run the cURL command.

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
