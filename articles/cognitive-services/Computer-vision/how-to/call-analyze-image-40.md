---
title: Call the Image Analysis 4.0 Analyze API
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

# Call the Image Analysis 4.0 Analyze API (preview)

This article demonstrates how to call the Image Analysis 4.0 API to return information about an image's visual features. It also shows you how to parse the returned information.

This guide assumes you've already <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL. If you're using a client SDK, you'll also need to authenticate a client object. If you haven't done these steps, follow the [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) to get started.
  
## Submit data to the service

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

#### [C#](#tab/csharp)

In your main class, save a reference to the URL of the image you want to analyze.

```csharp
var imageSource = VisionSource.FromUrl(new Uri("https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"));
```

> [!TIP]
> You can also analyze a local image. See the [reference documentation](/dotnet/api/azure.ai.vision.imageanalysis) for alternative **Analyze** methods. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk) for scenarios involving local images.


#### [Python](#tab/python)

Save a reference to the URL of the image you want to analyze.

```python
image_url = 'https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg'
vision_source = visionsdk.VisionSource(url=image_url)
```

> [!TIP]
> You can also analyze a local image. See the [reference documentation](/python/api/azure-ai-vision) for alternative **Analyze** methods. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk) for scenarios involving local images.

#### [C++](#tab/cpp)

Save a reference to the URL of the image you want to analyze.

```cpp
auto imageSource = VisionSource::FromUrl("https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg");
```

> [!TIP]
> You can also analyze a local image. See the [reference documentation]() for alternative **Analyze** methods. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk) for scenarios involving local images.

#### [REST](#tab/rest)

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"}`.

To analyze a local image, you'd put the binary image data in the HTTP request body.

---


## Determine how to process the data

### Select visual features

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](../overview.md) for a description of each feature. The examples in the sections below add all of the available visual features, but for practical usage you'll likely only need one or two.


#### [C#](#tab/csharp)

Define an **ImageAnalysisOptions** object, which specifies visual features you'd like to extract in your analysis.

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

Specify which visual features you'd like to extract in your analysis.

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
#### [C++](#tab/cpp)

Define an **ImageAnalysisOptions** object, which specifies visual features you'd like to extract in your analysis.

```cpp
auto analysisOptions = ImageAnalysisOptions::Create();

analysisOptions->SetFeatures(
    {
        ImageAnalysisFeature::CropSuggestions,
        ImageAnalysisFeature::Caption,
        ImageAnalysisFeature::Objects,
        ImageAnalysisFeature::People,
        ImageAnalysisFeature::Text,
        ImageAnalysisFeature::Tags
    });
```

#### [REST](#tab/rest)

You can specify which features you want to use by setting the URL query parameters of the [Analysis 4.0 API](https://aka.ms/vision-4-0-ref). A parameter can have multiple values, separated by commas. Each feature you specify will require more computation time, so only specify what you need.

|URL parameter | Value | Description|
|---|---|--|
|`features`|`Read` | reads the visible text in the image and outputs it as structured JSON data.|
|`features`|`Caption` | describes the image content with a complete sentence in supported languages.|
|`features`|`DenseCaption` | generates detailed captions for individual regions in the image. |
|`features`|`SmartCrops` | finds the rectangle coordinates that would crop the image to a desired aspect ratio while preserving the area of interest.|
|`features`|`Objects` | detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
|`features`|`Tags` | tags the image with a detailed list of words related to the image content.|

A populated URL might look like this:

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,read,caption,denseCaption,smartCrops,objects,people`


---

### Use a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](./model-customization.md). Once your model is trained, all you need is the model's name value.

#### [C#](#tab/csharp)

To use a custom model, create the ImageAnalysisOptions with no features, and set the name of your model.

```csharp
var analysisOptions = new ImageAnalysisOptions()
{
    ModelName = "MyCustomModelName"
};
```

#### [Python](#tab/python)

To use a custom model, create an **ImageAnalysisOptions** object with no features set, and set the name of your model.


```python
analysis_options = sdk.ImageAnalysisOptions()

analysis_options.model_name = "MyCustomModelName"
```

#### [C++](#tab/cpp)

To use a custom model, create an **ImageAnalysisOptions** object with no features set, and set the name of your model.

```cpp
auto analysisOptions = ImageAnalysisOptions::Create();

analysisOptions->SetModelName("MyCustomModelName");
```


#### [REST](#tab/rest)

To use a custom model, do not use the features query parameter. Set the model-name parameter to the name of your model.

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&model-name=MyCustomModelName`

---

### Specify languages

You can also specify the language of the returned data. This is optional, and the default language is English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.


#### [C#](#tab/csharp)

Use the *language* property of your **ImageAnalysisOptions** object to specify a language.

```csharp
var analysisOptions = new ImageAnalysisOptions()
{

    // Optional. Default is "en" for English. See https://aka.ms/cv-languages for a list of supported
    // language codes and which visual features are supported for each language.
    Language = "en",
};
```


#### [Python](#tab/python)

Use the *language* property of your **ImageAnalysisOptions** object to specify a language.

```python
# Optional. Default is "en" for English. See https://aka.ms/cv-languages for a list of supported
# language codes and which visual features are supported for each language.
image_analysis_options.language = 'en'
```

#### [C++](#tab/cpp)

Use the *language* property of your **ImageAnalysisOptions** object to specify a language.

```cpp
// Optional. Default is "en" for English. See https://aka.ms/cv-languages for a list of supported
// language codes and which visual features are supported for each language.
analysisOptions->SetLanguage("en");
```

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

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,read,caption,denseCaption,smartCrops,objects,people&language=en`


---


## Get results from the service

This section shows you how to parse the results of the API call. It includes the API call itself.


#### [C#](#tab/csharp)

### With visual features

The following code calls the Image Analysis API and prints the results for all standard visual features.

```csharp
using var analyzer = new ImageAnalyzer(serviceOptions, imageSource, analysisOptions);

var result = analyzer.Analyze();

if (result.Reason == ImageAnalysisResultReason.Analyzed)
{
    Console.WriteLine($" Image height = {result.ImageHeight}");
    Console.WriteLine($" Image width = {result.ImageWidth}");
    Console.WriteLine($" Model version = {result.ModelVersion}");

    if (result.Caption != null)
    {
        Console.WriteLine(" Caption:");
        Console.WriteLine($"   \"{result.Caption.Content}\", Confidence {result.Caption.Confidence:0.0000}");
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

    var resultDetails = ImageAnalysisResultDetails.FromResult(result);
    Console.WriteLine($" Result details:");
    Console.WriteLine($"   Image ID = {resultDetails.ImageId}");
    Console.WriteLine($"   Result ID = {resultDetails.ResultId}");
    Console.WriteLine($"   Connection URL = {resultDetails.ConnectionUrl}");
    Console.WriteLine($"   JSON result = {resultDetails.JsonResult}");
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

### With custom model

The following code calls the Image Analysis API and prints the results for custom model analysis.

```csharp
using var analyzer = new ImageAnalyzer(serviceOptions, imageSource, analysisOptions);

var result = analyzer.Analyze();

if (result.Reason == ImageAnalysisResultReason.Analyzed)
{
    if (result.CustomObjects != null)
    {
        Console.WriteLine(" Custom Objects:");
        foreach (var detectedObject in result.CustomObjects)
        {
            Console.WriteLine($"   \"{detectedObject.Name}\", Bounding box {detectedObject.BoundingBox}, Confidence {detectedObject.Confidence:0.0000}");
        }
    }

    if (result.CustomTags != null)
    {
        Console.WriteLine($" Custom Tags:");
        foreach (var tag in result.CustomTags)
        {
            Console.WriteLine($"   \"{tag.Name}\", Confidence {tag.Confidence:0.0000}");
        }
    }
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

### With visual features

The following code calls the Image Analysis API and prints the results for all standard visual features.

```python
image_analyzer = sdk.ImageAnalyzer(service_options, vision_source, analysis_options)

result = image_analyzer.analyze()

if result.reason == sdk.ImageAnalysisResultReason.ANALYZED:

    print(" Image height: {}".format(result.image_height))
    print(" Image width: {}".format(result.image_width))
    print(" Model version: {}".format(result.model_version))

    if result.caption is not None:
        print(" Caption:")
        print("   '{}', Confidence {:.4f}".format(result.caption.content, result.caption.confidence))

    if result.objects is not None:
        print(" Objects:")
        for object in result.objects:
            print("   '{}', {} Confidence: {:.4f}".format(object.name, object.bounding_box, object.confidence))

    if result.tags is not None:
        print(" Tags:")
        for tag in result.tags:
            print("   '{}', Confidence {:.4f}".format(tag.name, tag.confidence))

    if result.people is not None:
        print(" People:")
        for person in result.people:
            print("   {}, Confidence {:.4f}".format(person.bounding_box, person.confidence))

    if result.crop_suggestions is not None:
        print(" Crop Suggestions:")
        for crop_suggestion in result.crop_suggestions:
            print("   Aspect ratio {}: Crop suggestion {}"
                    .format(crop_suggestion.aspect_ratio, crop_suggestion.bounding_box))

    if result.text is not None:
        print(" Text:")
        for line in result.text.lines:
            points_string = "{" + ", ".join([str(int(point)) for point in line.bounding_polygon]) + "}"
            print("   Line: '{}', Bounding polygon {}".format(line.content, points_string))
            for word in line.words:
                points_string = "{" + ", ".join([str(int(point)) for point in word.bounding_polygon]) + "}"
                print("     Word: '{}', Bounding polygon {}, Confidence {:.4f}"
                        .format(word.content, points_string, word.confidence))

    result_details = sdk.ImageAnalysisResultDetails.from_result(result)
    print(" Result details:")
    print("   Image ID: {}".format(result_details.image_id))
    print("   Result ID: {}".format(result_details.result_id))
    print("   Connection URL: {}".format(result_details.connection_url))
    print("   JSON result: {}".format(result_details.json_result))

elif result.reason == sdk.ImageAnalysisResultReason.ERROR:

    error_details = sdk.ImageAnalysisErrorDetails.from_result(result)
    print(" Analysis failed.")
    print("   Error reason: {}".format(error_details.reason))
    print("   Error code: {}".format(error_details.error_code))
    print("   Error message: {}".format(error_details.message))
```

### With custom model

The following code calls the Image Analysis API and prints the results for custom model analysis.

```python
image_analyzer = sdk.ImageAnalyzer(service_options, vision_source, analysis_options)

result = image_analyzer.analyze()

if result.reason == sdk.ImageAnalysisResultReason.ANALYZED:

    if result.custom_objects is not None:
        print(" Custom Objects:")
        for object in result.custom_objects:
            print("   '{}', {} Confidence: {:.4f}".format(object.name, object.bounding_box, object.confidence))

    if result.custom_tags is not None:
        print(" Custom Tags:")
        for tag in result.custom_tags:
            print("   '{}', Confidence {:.4f}".format(tag.name, tag.confidence))

elif result.reason == sdk.ImageAnalysisResultReason.ERROR:

    error_details = sdk.ImageAnalysisErrorDetails.from_result(result)
    print(" Analysis failed.")
    print("   Error reason: {}".format(error_details.reason))
    print("   Error code: {}".format(error_details.error_code))
    print("   Error message: {}".format(error_details.message))
```
#### [C++](#tab/cpp)

### With visual features

The following code calls the Image Analysis API and prints the results for all standard visual features.

```cpp
auto analyzer = ImageAnalyzer::Create(serviceOptions, imageSource, analysisOptions);

auto result = analyzer->Analyze();

if (result->GetReason() == ImageAnalysisResultReason::Analyzed)
{
    std::cout << " Image height = " << result->GetImageHeight().Value() << std::endl;
    std::cout << " Image width = " << result->GetImageWidth().Value() << std::endl;
    std::cout << " Model version = " << result->GetModelVersion().Value() << std::endl;

    const auto caption = result->GetCaption();
    if (caption.HasValue())
    {
        std::cout << " Caption:" << std::endl;
        std::cout << "   \"" << caption.Value().Content << "\", Confidence " << caption.Value().Confidence << std::endl;
    }

    const auto objects = result->GetObjects();
    if (objects.HasValue())
    {
        std::cout << " Objects:" << std::endl;
        for (const auto object : objects.Value())
        {
            std::cout << "   \"" << object.Name << "\", ";
            std::cout << "Bounding box " << object.BoundingBox.ToString();
            std::cout << ", Confidence " << object.Confidence << std::endl;
        }
    }

    const auto tags = result->GetTags();
    if (tags.HasValue())
    {
        std::cout << " Tags:" << std::endl;
        for (const auto tag : tags.Value())
        {
            std::cout << "   \"" << tag.Name << "\"";
            std::cout << ", Confidence " << tag.Confidence << std::endl;
        }
    }

    const auto people = result->GetPeople();
    if (people.HasValue())
    {
        std::cout << " People:" << std::endl;
        for (const auto person : people.Value())
        {
            std::cout << "   Bounding box " << person.BoundingBox.ToString();
            std::cout << ", Confidence " << person.Confidence << std::endl;
        }
    }

    const auto cropSuggestions = result->GetCropSuggestions();
    if (cropSuggestions.HasValue())
    {
        std::cout << " Crop Suggestions:" << std::endl;
        for (const auto cropSuggestion : cropSuggestions.Value())
        {
            std::cout << "   Aspect ratio " << cropSuggestion.AspectRatio;
            std::cout << ": Crop suggestion " << cropSuggestion.BoundingBox.ToString() << std::endl;
        }
    }

    const auto detectedText = result->GetText();
    if (detectedText.HasValue())
    {
        std::cout << " Text:\n";
        for (const auto line : detectedText.Value().Lines)
        {
            std::cout << "   Line: \"" << line.Content << "\"";
            std::cout << ", Bounding polygon " << PolygonToString(line.BoundingPolygon) << std::endl;

            for (const auto word : line.Words)
            {
                std::cout << "     Word: \"" << word.Content << "\"";
                std::cout << ", Bounding polygon " << PolygonToString(word.BoundingPolygon);
                std::cout << ", Confidence " << word.Confidence << std::endl;
            }
        }
    }

    auto resultDetails = ImageAnalysisResultDetails::FromResult(result);
    std::cout << " Result details:\n";;
    std::cout << "   Image ID = " << resultDetails->GetImageId() << std::endl;
    std::cout << "   Result ID = " << resultDetails->GetResultId() << std::endl;
    std::cout << "   Connection URL = " << resultDetails->GetConnectionUrl() << std::endl;
    std::cout << "   JSON result = " << resultDetails->GetJsonResult() << std::endl;
}
else if (result->GetReason() == ImageAnalysisResultReason::Error)
{
    auto errorDetails = ImageAnalysisErrorDetails::FromResult(result);
    std::cout << " Analysis failed." << std::endl;
    std::cout << "   Error reason = " << (int)errorDetails->GetReason() << std::endl;
    std::cout << "   Error code = " << errorDetails->GetErrorCode() << std::endl;
    std::cout << "   Error message = " << errorDetails->GetMessage() << std::endl;
}
```

Use the following helper method to display rectangle coordinates:

```cpp
std::string PolygonToString(std::vector<int32_t> boundingPolygon)
{
    std::string out = "{";
    for (int i = 0; i < boundingPolygon.size(); i += 2)
    {
        out += ((i == 0) ? "{" : ",{") +
            std::to_string(boundingPolygon[i]) + "," +
            std::to_string(boundingPolygon[i + 1]) + "}";
    }
    out += "}";
    return out;
}
```

### With custom model

The following code calls the Image Analysis API and prints the results for custom model analysis.

```cpp
auto analyzer = ImageAnalyzer::Create(serviceOptions, imageSource, analysisOptions);

auto result = analyzer->Analyze();

if (result->GetReason() == ImageAnalysisResultReason::Analyzed)
{
    const auto objects = result->GetCustomObjects();
    if (objects.HasValue())
    {
        std::cout << " Custom objects:" << std::endl;
        for (const auto object : objects.Value())
        {
            std::cout << "   \"" << object.Name << "\", ";
            std::cout << "Bounding box " << object.BoundingBox.ToString();
            std::cout << ", Confidence " << object.Confidence << std::endl;
        }
    }

    const auto tags = result->GetCustomTags();
    if (tags.HasValue())
    {
        std::cout << " Custom tags:" << std::endl;
        for (const auto tag : tags.Value())
        {
            std::cout << "   \"" << tag.Name << "\"";
            std::cout << ", Confidence " << tag.Confidence << std::endl;
        }
    }
}
else if (result->GetReason() == ImageAnalysisResultReason::Error)
{
    auto errorDetails = ImageAnalysisErrorDetails::FromResult(result);
    std::cout << " Analysis failed." << std::endl;
    std::cout << "   Error reason = " << (int)errorDetails->GetReason() << std::endl;
    std::cout << "   Error code = " << errorDetails->GetErrorCode() << std::endl;
    std::cout << "   Error message = " << errorDetails->GetMessage() << std::endl;
}
```

#### [REST](#tab/rest)

The service returns a `200` HTTP response, and the body contains the returned data in the form of a JSON string. The following text is an example of a JSON response.

```json
{
    "captionResult":
    {
        "text": "a person using a laptop",
        "confidence": 0.55291348695755
    },
    "objectsResult":
    {
        "values":
        [
            {"boundingBox":{"x":730,"y":66,"w":135,"h":85},"tags":[{"name":"kitchen appliance","confidence":0.501}]},
            {"boundingBox":{"x":523,"y":377,"w":185,"h":46},"tags":[{"name":"computer keyboard","confidence":0.51}]},
            {"boundingBox":{"x":471,"y":218,"w":289,"h":226},"tags":[{"name":"Laptop","confidence":0.85}]},
            {"boundingBox":{"x":654,"y":0,"w":584,"h":473},"tags":[{"name":"person","confidence":0.855}]}
        ]
    },
    "modelVersion": "2023-02-01-preview",
    "metadata":
    {
        "width": 1260,
        "height": 473
    },
    "tagsResult":
    {
        "values":
        [
            {"name":"computer","confidence":0.9865934252738953},
            {"name":"clothing","confidence":0.9695653915405273},
            {"name":"laptop","confidence":0.9658201932907104},
            {"name":"person","confidence":0.9536289572715759},
            {"name":"indoor","confidence":0.9420197010040283},
            {"name":"wall","confidence":0.8871886730194092},
            {"name":"woman","confidence":0.8632704019546509},
            {"name":"using","confidence":0.5603535771369934}
        ]
    },
    "readResult":
    {
        "stringIndexType": "TextElements",
        "content": "",
        "pages":
        [
            {"height":473,"width":1260,"angle":0,"pageNumber":1,"words":[],"spans":[{"offset":0,"length":0}],"lines":[]}
        ],
        "styles": [],
        "modelVersion": "2022-04-30"
    },
    "smartCropsResult":
    {
        "values":
        [
            {"aspectRatio":1.94,"boundingBox":{"x":158,"y":20,"w":840,"h":433}}
        ]
    },
    "peopleResult":
    {
        "values":
        [
            {"boundingBox":{"x":660,"y":0,"w":584,"h":471},"confidence":0.9698998332023621},
            {"boundingBox":{"x":566,"y":276,"w":24,"h":30},"confidence":0.022009700536727905},
            {"boundingBox":{"x":587,"y":273,"w":20,"h":28},"confidence":0.01859394833445549},
            {"boundingBox":{"x":609,"y":271,"w":19,"h":30},"confidence":0.003902678843587637},
            {"boundingBox":{"x":563,"y":279,"w":15,"h":28},"confidence":0.0034854013938456774},
            {"boundingBox":{"x":566,"y":299,"w":22,"h":41},"confidence":0.0031260766554623842},
            {"boundingBox":{"x":570,"y":311,"w":29,"h":38},"confidence":0.0026493810582906008},
            {"boundingBox":{"x":588,"y":275,"w":24,"h":54},"confidence":0.001754675293341279},
            {"boundingBox":{"x":574,"y":274,"w":53,"h":64},"confidence":0.0012078586732968688},
            {"boundingBox":{"x":608,"y":270,"w":32,"h":59},"confidence":0.0011869356967508793},
            {"boundingBox":{"x":591,"y":305,"w":29,"h":42},"confidence":0.0010676260571926832}
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


---

> [!TIP]
> While working with Computer Vision, you might encounter transient failures caused by [rate limits](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern](/azure/architecture/patterns/retry) in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker).


## Next steps

* Explore the [concept articles](../concept-describe-images-40.md) to learn more about each feature.
* Explore the [code samples on GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/blob/main/samples/).
* See the [API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.