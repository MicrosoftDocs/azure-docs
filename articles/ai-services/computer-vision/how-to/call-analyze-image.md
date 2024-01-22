---
title: Call the Image Analysis API
titleSuffix: Azure AI services
description: Learn how to call the Image Analysis API and configure its behavior.
#services: cognitive-services
manager: nitinme
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 12/27/2022
ms.custom: "seodec18"
---

# Call the Image Analysis API

This article demonstrates how to call the Image Analysis API to return information about an image's visual features. It also shows you how to parse the returned information using the client SDKs or REST API.

This guide assumes you've already <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Vision resource"  target="_blank">created a Vision resource </a> and obtained a key and endpoint URL. If you're using a client SDK, you'll also need to authenticate a client object. If you haven't done these steps, follow the [quickstart](../quickstarts-sdk/image-analysis-client-library.md) to get started.
  
## Submit data to the service

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

#### [REST](#tab/rest)

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"http://example.com/images/test.jpg"}`.

To analyze a local image, you'd put the binary image data in the HTTP request body.

#### [C#](#tab/csharp)

In your main class, save a reference to the URL of the image you want to analyze.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ImageAnalysisQuickstart.cs?name=snippet_analyze_url)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) methods, such as **AnalyzeImageInStreamAsync**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ImageAnalysisQuickstart.cs) for scenarios involving local images.

#### [Java](#tab/java)

In your main class, save a reference to the URL of the image you want to analyze.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_urlimage)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVision](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.computervision) methods, such as **AnalyzeImage**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java) for scenarios involving local images.

#### [JavaScript](#tab/javascript)

In your main function, save a reference to the URL of the image you want to analyze.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ImageAnalysisQuickstart.js?name=snippet_describe_image)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](/javascript/api/@azure/cognitiveservices-computervision/computervisionclient) methods, such as **describeImageInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ImageAnalysisQuickstart.js) for scenarios involving local images.

#### [Python](#tab/python)

Save a reference to the URL of the image you want to analyze.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_remoteimage)]

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin) methods, such as **analyze_image_in_stream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ImageAnalysisQuickstart.py) for scenarios involving local images.

---


## Determine how to process the data

### Select visual features

The Analyze API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](../overview.md) for a description of each feature. The examples in the sections below add all of the available visual features, but for practical usage you'll likely only need one or two.

#### [REST](#tab/rest)

You can specify which features you want to use by setting the URL query parameters of the [Analyze API](https://aka.ms/vision-4-0-ref). A parameter can have multiple values, separated by commas. Each feature you specify will require more computation time, so only specify what you need.

|URL parameter | Value | Description|
|---|---|--|
|`features`|`Read` | reads the visible text in the image and outputs it as structured JSON data.|
|`features`|`Description` | describes the image content with a complete sentence in supported languages.|
|`features`|`SmartCrops` | finds the rectangle coordinates that would crop the image to a desired aspect ratio while preserving the area of interest.|
|`features`|`Objects` | detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
|`features`|`Tags` | tags the image with a detailed list of words related to the image content.|

A populated URL might look like this:

`https://<endpoint>/vision/v3.2/analyze?visualFeatures=Tags`

#### [C#](#tab/csharp)

Define your new method for image analysis. Add the code below, which specifies visual features you'd like to extract in your analysis. See the **[VisualFeatureTypes](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.models.visualfeaturetypes)** enum for a complete list.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ImageAnalysisQuickstart.cs?name=snippet_visualfeatures)]


#### [Java](#tab/java)

Specify which visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.models.visualfeaturetypes) enum for a complete list.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_features_remote)]

#### [JavaScript](#tab/javascript)

Specify which visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](/javascript/api/@azure/cognitiveservices-computervision/computervisionmodels.visualfeaturetypes) enum for a complete list.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ImageAnalysisQuickstart.js?name=snippet_features_remote)]

#### [Python](#tab/python)

Specify which visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.visualfeaturetypes?view=azure-python&preserve-view=true) enum for a complete list.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_features_remote)]


---


### Specify languages

You can also specify the language of the returned data. 

#### [REST](#tab/rest)

The following URL query parameter specifies the language. The default value is `en`.

|URL parameter | Value | Description|
|---|---|--|
|`language`|`en` | English|
|`language`|`es` | Spanish|
|`language`|`ja` | Japanese|
|`language`|`pt` | Portuguese|
|`language`|`zh` | Simplified Chinese|

A populated URL might look like this:

`https://<endpoint>/vision/v3.2/analyze?visualFeatures=Tags&language=en`

#### [C#](#tab/csharp)

Use the *language* parameter of [AnalyzeImageAsync](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclientextensions.analyzeimageasync?view=azure-dotnet#microsoft-azure-cognitiveservices-vision-computervision-computervisionclientextensions-analyzeimageasync(microsoft-azure-cognitiveservices-vision-computervision-icomputervisionclient-system-string-system-collections-generic-ilist((system-nullable((microsoft-azure-cognitiveservices-vision-computervision-models-visualfeaturetypes))))-system-collections-generic-ilist((system-nullable((microsoft-azure-cognitiveservices-vision-computervision-models-details))))-system-string-system-collections-generic-ilist((system-nullable((microsoft-azure-cognitiveservices-vision-computervision-models-descriptionexclude))))-system-string-system-threading-cancellationtoken&preserve-view=true)) call to specify a language. A method call that specifies a language might look like the following.

```csharp
ImageAnalysis results = await client.AnalyzeImageAsync(imageUrl, visualFeatures: features, language: "en");
```

#### [Java](#tab/java)

Use the [AnalyzeImageOptionalParameter](/java/api/com.microsoft.azure.cognitiveservices.vision.computervision.models.analyzeimageoptionalparameter) input in your Analyze call to specify a language. A method call that specifies a language might look like the following.


```java
ImageAnalysis analysis = compVisClient.computerVision().analyzeImage().withUrl(pathToRemoteImage)
    .withVisualFeatures(featuresToExtractFromLocalImage)
    .language("en")
    .execute();
```

#### [JavaScript](#tab/javascript)

Use the **language** property of the [ComputerVisionClientAnalyzeImageOptionalParams](/javascript/api/@azure/cognitiveservices-computervision/computervisionmodels.computervisionclientanalyzeimageoptionalparams) input in your Analyze call to specify a language. A method call that specifies a language might look like the following.

```javascript
const result = (await computerVisionClient.analyzeImage(imageURL,{visualFeatures: features, language: 'en'}));
```

#### [Python](#tab/python)

Use the *language* parameter of your [analyze_image](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin?view=azure-python#azure-cognitiveservices-vision-computervision-operations-computervisionclientoperationsmixin-analyze-image&preserve-view=true) call to specify a language. A method call that specifies a language might look like the following.

```python
results_remote = computervision_client.analyze_image(remote_image_url , remote_image_features, remote_image_details, 'en')
```

---


## Get results from the service

This section shows you how to parse the results of the API call. It includes the API call itself.

> [!NOTE]
> **Scoped API calls**
>
> Some of the features in Image Analysis can be called directly as well as through the Analyze API call. For example, you can do a scoped analysis of only image tags by making a request to `https://<endpoint>/vision/v3.2/tag` (or to the corresponding method in the SDK). See the [reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) for other features that can be called separately.

#### [REST](#tab/rest)

The service returns a `200` HTTP response, and the body contains the returned data in the form of a JSON string. The following text is an example of a JSON response.

```json
{
    "metadata":
    {
        "width": 300,
        "height": 200
    },
    "tagsResult":
    {
        "values":
        [
            {
                "name": "grass",
                "confidence": 0.9960499405860901
            },
            {
                "name": "outdoor",
                "confidence": 0.9956876635551453
            },
            {
                "name": "building",
                "confidence": 0.9893627166748047
            },
            {
                "name": "property",
                "confidence": 0.9853052496910095
            },
            {
                "name": "plant",
                "confidence": 0.9791355729103088
            }
        ]
    }
}
```

### Error codes

See the following list of possible errors and their causes:

* 400
    * `InvalidImageUrl` - Image URL is badly formatted or not accessible.
    * `InvalidImageFormat` - Input data is not a valid image.
    * `InvalidImageSize` - Input image is too large.
    * `NotSupportedVisualFeature` - Specified feature type isn't valid.
    * `NotSupportedImage` - Unsupported image, for example child pornography.
    * `InvalidDetails` - Unsupported `detail` parameter value.
    * `NotSupportedLanguage` - The requested operation isn't supported in the language specified.
    * `BadArgument` - More details are provided in the error message.
* 415 - Unsupported media type error. The Content-Type isn't in the allowed types:
    * For an image URL, Content-Type should be `application/json`
    * For a binary image data, Content-Type should be `application/octet-stream` or `multipart/form-data`
* 500
    * `FailedToProcess`
    * `Timeout` - Image processing timed out.
    * `InternalServerError`


#### [C#](#tab/csharp)

The following code calls the Image Analysis API and prints the results to the console.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ImageAnalysisQuickstart.cs?name=snippet_analyze)]

#### [Java](#tab/java)

The following code calls the Image Analysis API and prints the results to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/src/main/java/ImageAnalysisQuickstart.java?name=snippet_analyze)]

#### [JavaScript](#tab/javascript)

The following code calls the Image Analysis API and prints the results to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/ImageAnalysisQuickstart.js?name=snippet_analyze)]

#### [Python](#tab/python)

The following code calls the Image Analysis API and prints the results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart.py?name=snippet_analyze)]


---

> [!TIP]
> While working with Azure AI Vision, you might encounter transient failures caused by [rate limits](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern](/azure/architecture/patterns/retry) in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker).


## Next steps

* Explore the [concept articles](../concept-object-detection.md) to learn more about each feature.
* See the [API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.
