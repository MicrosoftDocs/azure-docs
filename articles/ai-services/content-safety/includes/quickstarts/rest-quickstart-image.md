---
title: "Quickstart: Analyze image content"
description: In this quickstart, get started using Azure AI Content Safety to analyze image content for objectionable material.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: include
ms.date: 03/11/2024
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (see [Region availability](/azure/ai-services/content-safety/overview#region-availability)), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* [cURL](https://curl.haxx.se/) installed


## Analyze image content

The following section walks through a sample image moderation request with cURL. 

### Prepare a sample image

Choose a sample image to analyze, and download it to your device. 

We support JPEG, PNG, GIF, BMP, TIFF, or WEBP image formats. The maximum size for image submissions is 4 MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. If your format is animated, we'll extract the first frame to do the detection.

You can input your image by one of two methods: **local filestream** or **blob storage URL**.
- **Local filestream** (recommended): Encode your image to base64. You can use a website like [codebeautify](https://codebeautify.org/image-to-base64-converter) to do the encoding. Then save the encoded string to a temporary location. 
- **Blob storage URL**: Upload your image to an Azure Blob Storage account. Follow the [blob storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) to learn how to do this. Then open Azure Storage Explorer and get the URL to your image. Save it to a temporary location. 

   [!INCLUDE [storage-account-access](../storage-account-access.md)]

### Analyze image content

Paste the command below into a text editor, and make the following changes.

1. Substitute the `<endpoint>` with your resource endpoint URL.
1. Replace `<your_subscription_key>` with your key.
1. Populate the `"image"` field in the body with either a `"content"` field or a `"blobUrl"` field. For example: `{"image": {"content": "<base_64_string>"}` or `{"image": {"blobUrl": "<your_storage_url>"}`.

```shell
curl --location --request POST '<endpoint>/contentsafety/image:analyze?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "image": {
    "content": "<base_64_string>"
  },
  "categories": [
    "Hate", "SelfHarm", "Sexual", "Violence"
  ],
  "outputType": "FourSeverityLevels"
}'
```

> [!NOTE]
> If you're using a blob storage URL, the request body will look like this:
>
> ```
> {
>  "image": {
>    "blobUrl": "<your_storage_url>"
>  }
> }
> ```

Open a command prompt window and run the cURL command.

The below fields must be included in the URL:

| Name      |Required?  |  Description | Type   |
| :------- |-------- |:--------------- | ------ |
| **API Version** |Required |This is the API version to be checked. Current version is: `api-version=2023-10-01`. Example: `<endpoint>/contentsafety/image:analyze?api-version=2023-10-01` | String |

The parameters in the request body are defined in this table:

| Name        | Required?     | Description  | Type    |
| :---------- | ----------- | :------------ | ------- |
| **content**    | Required | 	The content or blob URL of the image. I can be either base64-encoded bytes or a blob URL. If both are given, the request is refused. The maximum allowed size of the image is 2048 pixels x 2048 pixels, and the maximum file size is 4 MB. The minimum size of the image is 50 pixels x 50 pixels. | String  |
| **categories** | Optional | This is assumed to be an array of category names. See the [Harm categories guide](../../concepts/harm-categories.md) for a list of available category names. If no categories are specified, all four categories are used. We use multiple categories to get scores in a single request. | String  |
| **outputType** | Optional | Image moderation API only supports `"FourSeverityLevels"`. Output severities in four levels. The value can be `0,2,4,6` | String|

### Output

You should see the image moderation results displayed as JSON data in the console. For example:

```json
{
    "categoriesAnalysis": [
        {
            "category": "Hate",
            "severity": 2
        },
        {
            "category": "SelfHarm",
            "severity": 0
        },
        {
            "category": "Sexual",
            "severity": 0
        },
        {
            "category": "Violence",
            "severity": 0
        }
    ]
}
```

The JSON fields in the output are defined here:

| Name     | Description   | Type   |
| :------------- | :--------------- | ------ |
| **categoriesAnalysis**   | Each output class that the API predicts. Classification can be multi-labeled. For example, when an image is uploaded to the image moderation model, it could be classified as both sexual content and violence. [Harm categories](../../concepts/harm-categories.md)| String |
| **Severity** | The severity level of the flag in each harm category. [Harm categories](../../concepts/harm-categories.md)  | Integer |
