---
title: Remove the background in images
titleSuffix: Azure AI services
description: Learn how to call the Segment API to isolate and remove the background from images.
#services: cognitive-services
manager: nitinme
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 03/03/2023
ms.custom: references_regions
---

# Remove the background from images

This article demonstrates how to call the Image Analysis 4.0 API to segment an image. It also shows you how to parse the returned information.

> [!IMPORTANT]
> Background removal is only available through direct REST API calls. It is not available through the SDKs.

## Prerequisites

This guide assumes you have successfully followed the steps mentioned in the [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Vision resource"  target="_blank">created a Vision resource </a> and obtained a key and endpoint URL.
* You have successfully made a `curl.exe` call to the service (or used an alternative tool). You modify the `curl.exe` call based on the examples here.

The quickstart shows you how to extract visual features from an image, however, the concepts are similar to background removal. Therefore you benefit from starting from the quickstart and making modifications.

> [!IMPORTANT]
> Background removal is only available in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

## Authenticate against the service

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md). 

<!--
#### [C#](#tab/csharp)

Start by creating a [VisionServiceOptions](/dotnet/api/azure.ai.vision.common.visionserviceoptions) object using one of the constructors. For example:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=vision_service_options)]

#### [Python](#tab/python)

Start by creating a [VisionServiceOptions](/python/api/azure-ai-vision/azure.ai.vision.visionserviceoptions) object using one of the constructors. For example:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=vision_service_options)]

#### [Java](#tab/java)

Start by creating a [VisionServiceOptions](/java/api/com.azure.ai.vision.common.visionserviceoptions) object using one of the constructors. For example:

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=vision_service_options)]

#### [C++](#tab/cpp)

At the start of your code, use one of the static constructor methods [VisionServiceOptions::FromEndpoint](/cpp/cognitive-services/vision/service-visionserviceoptions#fromendpoint-1) to create a *VisionServiceOptions* object. For example:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/how-to/how-to.cpp?name=vision_service_options)]

Where we used this helper function to read the value of an environment variable:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/how-to/how-to.cpp?name=get_env_var)]

#### [REST API](#tab/rest)
-->

Authentication is done by adding the HTTP request header **Ocp-Apim-Subscription-Key** and setting it to your vision key. The call is made to the URL `https://<endpoint>/computervision/imageanalysis:segment?api-version=2023-02-01-preview`, where `<endpoint>` is your unique Computer Vision endpoint URL. See [Select a mode ](./background-removal.md#select-a-mode) section for another query string you add to this URL.


## Select the image to analyze

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

<!--
#### [C#](#tab/csharp)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.FromUrl](/dotnet/api/azure.ai.vision.common.visionsource.fromurl).

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=vision_source)]

**VisionSource** implements **IDisposable**, therefore create the object with a **using** statement or explicitly call **Dispose** method after analysis completes.

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name (see [VisionSource.FromFile](/dotnet/api/azure.ai.vision.common.visionsource.fromfile)), or by copying the image into the SDK's input buffer (see [VisionSource.FromImageSourceBuffer](/dotnet/api/azure.ai.vision.common.visionsource.fromimagesourcebuffer)). For more details, see [Call the Analyze API](./call-analyze-image-40.md?pivots=programming-language-csharp#select-the-image-to-analyze).

#### [Python](#tab/python)

In your script, create a new [VisionSource](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from the URL of the image you want to analyze.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name to the **VisionSource** constructor instead of the image URL (see argument name **filename**). Alternatively, you can analyze an image in a memory buffer by constructing **VisionSource** using the argument **image_source_buffer**. For more details, see [Call the Analyze API](./call-analyze-image-40.md?pivots=programming-language-python#select-the-image-to-analyze).

#### [Java](#tab/java)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.fromUrl](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromurl(java-net-url)).

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=vision_source)]

**VisionSource** implements **AutoCloseable**, therefore create the object in a try-with-resources block, or explicitly call the **close** method on this object when you're done analyzing the image.

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name (see [VisionSource.fromFile](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromfile(java-lang-string)), or by copying the image into the SDK's input buffer (see [VisionSource.fromImageSourceBuffer](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromimagesourcebuffer(com-azure-ai-vision-common-imagesourcebuffer))). For more details, see [Call the Analyze API](./call-analyze-image-40.md?pivots=programming-language-java#select-the-image-to-analyze).

#### [C++](#tab/cpp)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource::FromUrl](/cpp/cognitive-services/vision/input-visionsource#fromurl).

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/how-to/how-to.cpp?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name (see [VisionSource::FromFile](/cpp/cognitive-services/vision/input-visionsource#fromfile)), or by copying the image into the SDK's input buffer (see  [VisionSource::FromImageSourceBuffer](/cpp/cognitive-services/vision/input-visionsource#fromimagesourcebuffer)). For more details, see [Call the Analyze API](./call-analyze-image-40.md?pivots=programming-language-cpp#select-the-image-to-analyze).

#### [REST API](#tab/rest)
-->

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"https://learn.microsoft.com/azure/ai-services/computer-vision/images/windows-kitchen.jpg"}`. The **Content-Type** should be `application/json`.

To analyze a local image, you'd put the binary image data in the HTTP request body. The **Content-Type** should be `application/octet-stream` or `multipart/form-data`.



## Select a mode

<!--
### [C#](#tab/csharp)

Create a new [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and set the property [SegmentationMode](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.segmentationmode#azure-ai-vision-imageanalysis-imageanalysisoptions-segmentationmode). This property must be set if you want to do segmentation. See [ImageSegmentationMode](/dotnet/api/azure.ai.vision.imageanalysis.imagesegmentationmode) for supported values.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/segmentation/Program.cs?name=segmentation_mode)]

### [Python](#tab/python)

Create a new [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and set the property [segmentation_mode](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-segmentation-mode). This property must be set if you want to do segmentation. See [ImageSegmentationMode](/python/api/azure-ai-vision/azure.ai.vision.enums.imagesegmentationmode) for supported values.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/segmentation/main.py?name=segmentation_mode)]

### [Java](#tab/java)

Create a new [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object and call the [setSegmentationMode](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setsegmentationmode()) method. You must call this method if you want to do segmentation. See [ImageSegmentationMode](/java/api/com.azure.ai.vision.imageanalysis.imagesegmentationmode) for supported values.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/segmentation/ImageAnalysis.java?name=segmentation_mode)]

### [C++](#tab/cpp)

Create a new [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object and call the [SetSegmentationMode](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setsegmentationmode) method. You must call this method if you want to do segmentation. See [ImageSegmentationMode](/cpp/cognitive-services/vision/azure-ai-vision-imageanalysis-namespace#enum-imagesegmentationmode) for supported values.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/segmentation/segmentation.cpp?name=segmentation_mode)]

### [REST](#tab/rest)
-->

Set the query string *mode** to one of these two values. This query string is mandatory if you want to do image segmentation.

|URL parameter | Value               |Description  |
|--------------|---------------------|-------------|
| `mode`       | `backgroundRemoval` | Outputs an image of the detected foreground object with a transparent background. |
| `mode`       | `foregroundMatting` | Outputs a gray-scale alpha matte image showing the opacity of the detected foreground object. |

A populated URL for backgroundRemoval would look like this: `https://<endpoint>/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`


## Get results from the service

This section shows you how to make the API call and parse the results.

<!--
#### [C#](#tab/csharp)

The following code calls the Image Analysis API and saves the resulting segmented image to a file named **output.png**. It also displays some metadata about the segmented image.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/segmentation/Program.cs?name=segment)]

**SegmentationResult** implements **IDisposable**, therefore  create the object with a **using** statement or explicitly call **Dispose** method after analysis completes.

#### [Python](#tab/python)

The following code calls the Image Analysis API and saves the resulting segmented image to a file named **output.png**. It also displays some metadata about the segmented image.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/segmentation/main.py?name=segment)]

#### [Java](#tab/java)

The following code calls the Image Analysis API and saves the resulting segmented image to a file named **output.png**. It also displays some metadata about the segmented image.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/segmentation/ImageAnalysis.java?name=segment)]

**SegmentationResult** implements **AutoCloseable**, therefore create the object in a try-with-resources block, or explicitly call the **close** method on this object when you're done analyzing the image.

#### [C++](#tab/cpp)

The following code calls the Image Analysis API and saves the resulting segmented image to a file named **output.png**. It also displays some metadata about the segmented image.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/segmentation/segmentation.cpp?name=segment)]

#### [REST](#tab/rest)
-->

The service returns a `200` HTTP response on success with `Content-Type: image/png`, and the body contains the returned PNG image in the form of a binary stream.


As an example, assume background removal is run on the following image:

:::image type="content" source="../media/background-removal/building-1.png" alt-text="Photo of a city near water.":::

On a successful background removal call, The following four-channel PNG image is the response for the `backgroundRemoval` mode:

:::image type="content" source="../media/background-removal/building-1-result.png" alt-text="Photo of a city near water; sky is transparent.":::

The following one-channel PNG image is the response for the `foregroundMatting` mode:

:::image type="content" source="../media/background-removal/building-1-matte.png" alt-text="Alpha matte of a city skyline.":::

The API returns an image the same size as the original for the `foregroundMatting` mode, but at most 16 megapixels (preserving image aspect ratio) for the `backgroundRemoval` mode.

## Error codes

[!INCLUDE [image-analysis-error-codes-40](../includes/image-analysis-error-codes-40.md)]

---

## Next steps

[Background removal concepts](../concept-background-removal.md)


