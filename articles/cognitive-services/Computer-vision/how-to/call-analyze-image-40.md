---
title: Call the Image Analysis 4.0 API
titleSuffix: Azure Cognitive Services
description: Learn how to call the Image Analysis 4.0 API and configure its behavior.
services: cognitive-services
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 01/24/2023
ms.custom: "seodec18"
---

# Call the Image Analysis 4.0 API

This article demonstrates how to call the Image Analysis 4.0 API to return information about an image's visual features. It also shows you how to parse the returned information.

This guide assumes you've already <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL. If you're using a client SDK, you'll also need to authenticate a client object. If you haven't done these steps, follow the [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) to get started.
  
## Submit data to the service

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

#### [REST](#tab/rest)

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"http://example.com/images/test.jpg"}`.

To analyze a local image, you'd put the binary image data in the HTTP request body.

#### [C#](#tab/csharp)

In your main class, save a reference to the URL of the image you want to analyze.

```csharp
var imageSource = VisionSource.FromUrl(new Uri("https://docs.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"));
```

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](tbd) methods, such as **AnalyzeImageInStreamAsync**. Or, see the sample code on [GitHub](tbd) for scenarios involving local images.


#### [Python](#tab/python)

Save a reference to the URL of the image you want to analyze.

```python
image_url = 'https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg'
vision_source = visionsdk.VisionSource(url=image_url)
```

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClientOperationsMixin](tbd) methods, such as **analyze_image_in_stream**. Or, see the sample code on [GitHub](tbd) for scenarios involving local images.

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

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2022-10-12-preview&features=Tags`

#### [C#](#tab/csharp)

Define your new method for image analysis. Define an **ImageAnalysisOptions** object, which specifies visual features you'd like to extract in your analysis. See the **[VisualFeatureTypes](tbd)** enum for a complete list.

```csharp
var analysisOptions = new ImageAnalysisOptions()
{
    // Mandatory. You must set one or more features to analyze. Here we use the full set of features.
    // Note that 'Captions' is only supported in Azure GPU regions (East US, France Central, Korea Central,
    // North Europe, Southeast Asia, West Europe, West US)
    Features =
            ImageAnalysisFeature.CropSuggestions
        | ImageAnalysisFeature.Captions
        | ImageAnalysisFeature.Objects
        | ImageAnalysisFeature.People
        | ImageAnalysisFeature.Text
        | ImageAnalysisFeature.Tags
};
```

#### [Python](#tab/python)

Specify which visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](/tbd) enum for a complete list.

```python
# Set the language and one or more visual features as analysis options
image_analysis_options = visionsdk.ImageAnalysisOptions()

# Mandatory. You must set one or more features to analyze. Here we use the full set of features.
# Note that 'Captions' is only supported in Azure GPU regions (East US, France Central, Korea Central,
# North Europe, Southeast Asia, West Europe, West US)
image_analysis_options.features = (
    visionsdk.ImageAnalysisFeature.CROP_SUGGESTIONS |
    visionsdk.ImageAnalysisFeature.CAPTIONS |
    visionsdk.ImageAnalysisFeature.OBJECTS |
    visionsdk.ImageAnalysisFeature.PEOPLE |
    visionsdk.ImageAnalysisFeature.TEXT |
    visionsdk.ImageAnalysisFeature.TAGS
)
```

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

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2022-10-12-preview&features=Tags&language=en`

#### [C#](#tab/csharp)

Use the *language* property of **ImageAnalysisOptions** to specify a language.

```csharp
var analysisOptions = new ImageAnalysisOptions()
{
    // Mandatory. You must set one or more features to analyze. Here we use the full set of features.
    // Note that 'Captions' is only supported in Azure GPU regions (East US, France Central, Korea Central,
    // North Europe, Southeast Asia, West Europe, West US)

    Features =
        ImageAnalysisFeature.CropSuggestions
        | ImageAnalysisFeature.Captions
        | ImageAnalysisFeature.Objects
        | ImageAnalysisFeature.People
        | ImageAnalysisFeature.Text
        | ImageAnalysisFeature.Tags,

    // Optional. Default is "en" for English. See https://aka.ms/cv-languages for a list of supported
    // language codes and which visual features are supported for each language.
    Language = "en",
};
```


#### [Python](#tab/python)

Use the *language* property of your [ImageAnalysisOptions](tbd) object to specify a language.

```python
# Optional. Default is "en" for English. See https://aka.ms/cv-languages for a list of supported
# language codes and which visual features are supported for each language.
image_analysis_options.language = 'en'
```

---


## Get results from the service

This section shows you how to parse the results of the API call. It includes the API call itself.

> [!NOTE]
> **Scoped API calls**
>
> Some of the features in Image Analysis can be called directly as well as through the Analyze API call. For example, you can do a scoped analysis of only image tags by making a request to `https://{endpoint}/vision/v3.2/tag` (or to the corresponding method in the SDK). See the [reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) for other features that can be called separately.

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

```csharp
var analyzer = new ImageAnalyzer(serviceOptions, imageSource, analysisOptions);
var result = analyzer.Analyze();

if (result.Reason == ImageAnalysisResultReason.Analyzed)
{
    Console.WriteLine($" Image height = {result.ImageHeight}");
    Console.WriteLine($" Image width = {result.ImageWidth}");
    Console.WriteLine($" Model version = {result.ModelVersion}");

    if (result.Captions != null)
    {
        Console.WriteLine(" Captions:");
        foreach (var caption in result.Captions)
        {
            Console.WriteLine($"   \"{caption.Content}\", Confidence {caption.Confidence:0.0000}");
        };
    }

    if (result.Objects != null)
    {
        Console.WriteLine(" Objects:");
        foreach (var detectedObject in result.Objects)
        {
            Console.WriteLine($"   \"{detectedObject.Name}\", Bounding box {detectedObject.BoundingBox}, Confidence {detectedObject.Confidence:0.0000}");
        }
    }

    if (result.Tags != null)
    {
        Console.WriteLine($" Tags:");
        foreach (var tag in result.Tags)
        {
            Console.WriteLine($"   \"{tag.Name}\", Confidence {tag.Confidence:0.0000}");
        }
    }

    if (result.People != null)
    {
        Console.WriteLine($" People:");
        foreach (var person in result.People)
        {
            Console.WriteLine($"   Bounding box {person.BoundingBox}, Confidence {person.Confidence:0.0000}");
        }
    }

    if (result.CropSuggestions != null)
    {
        Console.WriteLine($" Crop Suggestions:");
        foreach (var cropSuggestion in result.CropSuggestions)
        {
            Console.WriteLine($"   Aspect ratio {cropSuggestion.AspectRatio}: "
                + $"Crop suggestion {cropSuggestion.BoundingBox}");
        };
    }

    if (result.Text != null)
    {
        Console.WriteLine($" Text:");
        foreach (var line in result.Text.Lines)
        {
            string pointsToString = "{" + string.Join(',', line.BoundingPolygon.Select(pointsToString => pointsToString.ToString())) + "}";
            Console.WriteLine($"   Line: '{line.Content}', Bounding polygon {pointsToString}");

            foreach (var word in line.Words)
            {
                pointsToString = "{" + string.Join(',', word.BoundingPolygon.Select(pointsToString => pointsToString.ToString())) + "}";
                Console.WriteLine($"     Word: '{word.Content}', Bounding polygon {pointsToString}, Confidence {word.Confidence:0.0000}");
            }
        }
    }

    var detailedResult = ImageAnalysisResultDetails.FromResult(result);
    Console.WriteLine($" Detailed result:");
    Console.WriteLine($"   Image ID = {detailedResult.ImageId}");
    Console.WriteLine($"   Result ID = {detailedResult.ResultId}");
    Console.WriteLine($"   JSON = {detailedResult.JsonResult}");
}
else if (result.Reason == ImageAnalysisResultReason.Error)
{
    var errorDetails = ImageAnalysisErrorDetails.FromResult(result);
    Console.WriteLine(" Analysis failed.");
    Console.WriteLine($"   Error reason : {errorDetails.Reason}");
    Console.WriteLine($"   Error code : {errorDetails.ErrorCode}");
    Console.WriteLine($"   Error message: {errorDetails.Message}");
}
```


#### [Python](#tab/python)

The following code calls the Image Analysis API and prints the results to the console.

```python
image_analyzer = visionsdk.ImageAnalyzer(service_options=service_options,
    vision_source=vision_source,
    image_analysis_options=image_analysis_options)

    result = image_analyzer.analyze()

    # Checks result.
    if result.reason == visionsdk.ImageAnalysisResultReason.ANALYZED:

        if result.captions is not None:
            print(' Captions:')
            for caption in result.captions:
                print('   \'{}\', Confidence {:.4f}'.format(caption.content, caption.confidence))

        if result.objects is not None:
            print(' Objects:')
            for object in result.objects:
                print('   \'{}\', {} Confidence: {:.4f}'.format(object.name, object.bounding_box, object.confidence))

        if result.tags is not None:
            print(' Tags:')
            for tag in result.tags:
                print('   \'{}\', Confidence {:.4f}'.format(tag.name, tag.confidence))

        if result.people is not None:
            print(' People:')
            for person in result.people:
                print('   {}, Confidence {:.4f}'.format(person.bounding_box, person.confidence))

        if result.crop_suggestions is not None:
            print(' Crop Suggestions:')
            for crop_suggestion in result.crop_suggestions:
                print('   Aspect ratio {}: Crop suggestion {}'.format(crop_suggestion.aspect_ratio, crop_suggestion.bounding_box))

        if result.text is not None:
            print(' Text:')
            for line in result.text.lines:
                points_string = '{' + ', '.join([str(int(point)) for point in line.bounding_polygon]) + '}'
                print('   Line: \'{}\', Bounding polygon {}'.format(line.content, points_string))
                for word in line.words:
                    points_string = '{' + ', '.join([str(int(point)) for point in word.bounding_polygon]) + '}'
                    print('     Word: \'{}\', Bounding polygon {}, Confidence {:.4f}'.format(word.content, points_string, word.confidence))

        print(' Image Height: {}'.format(result.image_height))
        print(' Image Width: {}'.format(result.image_width))
        print(' Image ID: {}'.format(result.image_id))
        print(' Result ID: {}'.format(result.result_id))
        print(' Model Version: {}'.format(result.model_version))
        print(' JSON Result: {}'.format(result.json_result))

    elif result.reason == visionsdk.ImageAnalysisResultReason.ERROR:

        error_details = visionsdk.ImageAnalysisErrorDetails.from_result(result)
        print(" Analysis failed.")
        print("   Error reason: {}".format(error_details.reason))
        print("   Error code: {}".format(error_details.error_code))
        print("   Error message: {}".format(error_details.message))
        print(" Did you set the computer vision endpoint and key?")
```

---

> [!TIP]
> While working with Computer Vision, you might encounter transient failures caused by [rate limits](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern](/azure/architecture/patterns/retry) in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker).


## Next steps

* Explore the [concept articles](../concept-object-detection-40.md) to learn more about each feature.
* See the [API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.