---
title: What is Image Analysis?
titleSuffix: Azure AI services
description: The Image Analysis service uses pretrained AI models to extract many different visual features from images. 
services: cognitive-services 
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services 
ms.subservice: computer-vision 
ms.custom: ignite-2022, references_regions, build-2023, build-2023-dataai
ms.topic: overview
ms.date: 07/04/2023
ms.author: pafarley
keywords: Azure AI Vision, Azure AI Vision applications, Azure AI Vision service
---

# What is Image Analysis?

The Azure AI Vision Image Analysis service can extract a wide variety of visual features from your images. For example, it can determine whether an image contains adult content, find specific brands or objects, or find human faces.

The latest version of Image Analysis, 4.0, which is now in public preview, has new features like synchronous OCR and people detection. We recommend you use this version going forward.

You can use Image Analysis through a client library SDK or by calling the [REST API](https://aka.ms/vision-4-0-ref) directly. Follow the [quickstart](quickstarts-sdk/image-analysis-client-library-40.md) to get started.

> [!div class="nextstepaction"]
> [Quickstart](quickstarts-sdk/image-analysis-client-library-40.md)

Or, you can try out the capabilities of Image Analysis quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/image-analysis-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-to/call-analyze-image.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](concept-tagging-images.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/storage-lab-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.

For a more structured approach, follow a Training module for Image Analysis.
* [Analyze images with the Azure AI Vision service](/training/modules/analyze-images-computer-vision/)

[!INCLUDE [image analysis versions](./includes/image-analysis-versions.md)]

## Analyze Image

You can analyze images to provide insights about their visual features and characteristics. All of the features in this list are provided by the Analyze Image API. Follow a [quickstart](./quickstarts-sdk/image-analysis-client-library-40.md) to get started.

| Name | Description | Concept page |
|---|---|---|
|**Model customization** (v4.0 preview only)|You can create and train custom models to do image classification or object detection. Bring your own images, label them with custom tags, and Image Analysis trains a model customized for your use case.|[Model customization](./concept-model-customization.md)|
|**Read text from images** (v4.0 preview only)| Version 4.0 preview of Image Analysis offers the ability to extract readable text from images. Compared with the async Computer Vision 3.2 Read API, the new version offers the familiar Read OCR engine in a unified performance-enhanced synchronous API that makes it easy to get OCR along with other insights in a single API call. |[OCR for images](concept-ocr.md)|
|**Detect people in images** (v4.0 preview only)|Version 4.0 preview of Image Analysis offers the ability to detect people appearing in images. The bounding box coordinates of each detected person are returned, along with a confidence score. |[People detection](concept-people-detection.md)|
|**Generate image captions** | Generate a caption of an image in human-readable language, using complete sentences. Computer Vision's algorithms generate captions based on the objects identified in the image. <br/><br/>The version 4.0 image captioning model is a more advanced implementation and works with a wider range of input images. It's only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. <br/><br/>Version 4.0 also lets you use dense captioning, which generates detailed captions for individual objects that are found in the image. The API returns the bounding box coordinates (in pixels) of each object found in the image, plus a caption. You can use this functionality to generate descriptions of separate parts of an image.<br/><br/>:::image type="content" source="Images/description.png" alt-text="Photo of cows with a simple description on the right.":::| [Generate image captions (v3.2)](concept-describing-images.md)<br/>[(v4.0 preview)](concept-describe-images-40.md)|
|**Detect objects** |Object detection is similar to tagging, but the API returns the bounding box coordinates for each tag applied. For example, if an image contains a dog, cat and person, the Detect operation lists those objects together with their coordinates in the image. You can use this functionality to process further relationships between the objects in an image. It also lets you know when there are multiple instances of the same tag in an image. <br/><br/>:::image type="content" source="Images/detect-objects.png" alt-text="Photo of an office with a rectangle drawn around a laptop.":::| [Detect objects (v3.2)](concept-object-detection.md)<br/>[(v4.0 preview)](concept-object-detection-40.md)
|**Tag visual features**| Identify and tag visual features in an image, from a set of thousands of recognizable objects, living things, scenery, and actions. When the tags are ambiguous or not common knowledge, the API response provides hints to clarify the context of the tag. Tagging isn't limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on.<br/><br/>:::image type="content" source="Images/tagging.png" alt-text="Photo of a skateboarder with tags listed on the right.":::|[Tag visual features (v3.2)](concept-tagging-images.md)<br/>[(v4.0 preview)](concept-tag-images-40.md)|
|**Get the area of interest / smart crop** |Analyze the contents of an image to return the coordinates of the *area of interest* that matches a specified aspect ratio. Computer Vision returns the bounding box coordinates of the region, so the calling application can modify the original image as desired. <br/><br/>The version 4.0 smart cropping model is a more advanced implementation and works with a wider range of input images. It's only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. | [Generate a thumbnail (v3.2)](concept-generating-thumbnails.md)<br/>[(v4.0 preview)](concept-generate-thumbnails-40.md)|
|**Detect brands** (v3.2 only) | Identify commercial brands in images or videos from a database of thousands of global logos. You can use this feature, for example, to discover which brands are most popular on social media or most prevalent in media product placement. |[Detect brands](concept-brand-detection.md)|
|**Categorize an image** (v3.2 only)|Identify and categorize an entire image, using a [category taxonomy](Category-Taxonomy.md) with parent/child hereditary hierarchies. Categories can be used alone, or with our new tagging models.<br/><br/>Currently, English is the only supported language for tagging and categorizing images. |[Categorize an image](concept-categorizing-images.md)|
| **Detect faces** (v3.2 only) |Detect faces in an image and provide information about each detected face. Azure AI Vision returns the coordinates, rectangle, gender, and age for each detected face.<br/><br/>You can also use the dedicated [Face API](./overview-identity.md) for these purposes. It provides more detailed analysis, such as facial identification and pose detection.|[Detect faces](concept-detecting-faces.md)|
|**Detect image types** (v3.2 only)|Detect characteristics about an image, such as whether an image is a line drawing or the likelihood of whether an image is clip art.| [Detect image types](concept-detecting-image-types.md)|
| **Detect domain-specific content** (v3.2 only)|Use domain models to detect and identify domain-specific content in an image, such as celebrities and landmarks. For example, if an image contains people, Azure AI Vision can use a domain model for celebrities to determine if the people detected in the image are known celebrities.| [Detect domain-specific content](concept-detecting-domain-content.md)|
|**Detect the color scheme** (v3.2 only) |Analyze color usage within an image. Azure AI Vision can determine whether an image is black & white or color and, for color images, identify the dominant and accent colors.| [Detect the color scheme](concept-detecting-color-schemes.md)|
|**Moderate content in images** (v3.2 only) |You can use Azure AI Vision to detect adult content in an image and return confidence scores for different classifications. The threshold for flagging content can be set on a sliding scale to accommodate your preferences.|[Detect adult content](concept-detecting-adult-content.md)|


## Product Recognition (v4.0 preview only)

The Product Recognition APIs let you analyze photos of shelves in a retail store. You can detect the presence or absence of products and get their bounding box coordinates. Use it in combination with model customization to train a model to identify your specific products. You can also compare Product Recognition results to your store's planogram document.

[Product Recognition](./concept-shelf-analysis.md)

## Multi-modal embeddings (v4.0 preview only)

The multi-modal embeddings APIs enable the _vectorization_ of images and text queries. They convert images to coordinates in a multi-dimensional vector space. Then, incoming text queries can also be converted to vectors, and images can be matched to the text based on semantic closeness. This allows the user to search a set of images using text, without needing to use image tags or other metadata. Semantic closeness often produces better results in search.

These APIs are only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

[Multi-modal embeddings](./concept-image-retrieval.md)

## Background removal (v4.0 preview only)

Image Analysis 4.0 (preview) offers the ability to remove the background of an image. This feature can either output an image of the detected foreground object with a transparent background, or a grayscale alpha matte image showing the opacity of the detected foreground object. [Background removal](./concept-background-removal.md)

|Original image  |With background removed  |Alpha matte  |
|:---------:|:---------:|:---------:|
|   :::image type="content" source="media/background-removal/person-5.png" alt-text="Photo of a group of people using a tablet.":::  |    :::image type="content" source="media/background-removal/person-5-result.png" alt-text="Photo of a group of people using a tablet; background is transparent.":::     |   :::image type="content" source="media/background-removal/person-5-matte.png" alt-text="Alpha matte of a group of people.":::      |

## Image requirements

#### [Version 4.0](#tab/4-0)

Image Analysis works on images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, BMP, WEBP, ICO, TIFF, or MPO format
- The file size of the image must be less than 20 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels and less than 16,000 x 16,000 pixels


#### [Version 3.2](#tab/3-2)

Image Analysis works on images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels and less than 16,000 x 16,000 pixels

---

## Data privacy and security

As with all of the Azure AI services, developers using the Azure AI Vision service should be aware of Microsoft's policies on customer data. See the [Azure AI services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Get started with Image Analysis by following the quickstart guide in your preferred development language:

- [Quickstart (v4.0 preview): Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md)
- [Quickstart (v3.2): Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md)
