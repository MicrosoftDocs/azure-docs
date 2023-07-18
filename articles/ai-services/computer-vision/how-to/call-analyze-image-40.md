---
title: Call the Image Analysis 4.0 Analyze API
titleSuffix: Azure AI services
description: Learn how to call the Image Analysis 4.0 API and configure its behavior.
services: cognitive-services
manager: nitinme
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 01/24/2023
ms.custom: "seodec18"
---

# Call the Image Analysis 4.0 Analyze API (preview)

This article demonstrates how to call the Image Analysis 4.0 API to return information about an image's visual features. It also shows you how to parse the returned information.

## Prerequisites

This guide assumes you have successfully followed the steps mentioned in the [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Vision resource"  target="_blank">created a Vision resource</a> and obtained a key and endpoint URL.
* If you're using the client SDK, you have the appropriate SDK package installed and you have a running [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) application. You can modify this quickstart application based on code examples here.
* If you're using 4.0 REST API calls directly, you have successfully made a `curl.exe` call to the service (or used an alternative tool). You modify the `curl.exe` call based on the examples here.

## Authenticate against the service

To authenticate against the Image Analysis service, you need an Azure AI Vision key and endpoint URL.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md). 

The SDK example assumes that you defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.

#### [C#](#tab/csharp)

Start by creating a [VisionServiceOptions](/dotnet/api/azure.ai.vision.core.options.visionserviceoptions) object using one of the constructors. For example:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=vision_service_options)]

#### [Python](#tab/python)

Start by creating a [VisionServiceOptions](/python/api/azure-ai-vision/azure.ai.vision.visionserviceoptions) object using one of the constructors. For example:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=vision_service_options)]

#### [C++](#tab/cpp)

At the start of your code, use one of the static constructor methods [VisionServiceOptions::FromEndpoint](/cpp/cognitive-services/vision/service-visionserviceoptions#fromendpoint-1) to create a *VisionServiceOptions* object. For example:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=vision_service_options)]

Where we used this helper function to read the value of an environment variable:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=get_env_var)]

#### [REST API](#tab/rest)

Authentication is done by adding the HTTP request header **Ocp-Apim-Subscription-Key** and setting it to your vision key. The call is made to the URL `https://<endpoint>/computervision/imageanalysis:analyze&api-version=2023-02-01-preview`, where `<endpoint>` is your unique Azure AI Vision endpoint URL. You add query strings based on your analysis options.

---

## Select the image to analyze

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

#### [C#](#tab/csharp)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.FromUrl](/dotnet/api/azure.ai.vision.core.input.visionsource.fromurl).

**VisionSource** implements **IDisposable**, therefore create the object with a **using** statement or explicitly call **Dispose** method after analysis completes.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name. See [VisionSource.FromFile](/dotnet/api/azure.ai.vision.core.input.visionsource.fromfile).

#### [Python](#tab/python)

In your script, create a new [VisionSource](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from the URL of the image you want to analyze.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name to the **VisionSource** constructor instead of the image URL.

#### [C++](#tab/cpp)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource::FromUrl](/cpp/cognitive-services/vision/input-visionsource#fromurl).

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name. See [VisionSource::FromFile](/cpp/cognitive-services/vision/input-visionsource#fromfile).

#### [REST API](#tab/rest)

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"https://learn.microsoft.com/azure/ai-services/computer-vision/images/windows-kitchen.jpg"}`. The **Content-Type** should be `application/json`.

To analyze a local image, you'd put the binary image data in the HTTP request body. The **Content-Type** should be `application/octet-stream` or `multipart/form-data`.

---

## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](../overview.md) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API users the term **Read** for detecting text in the image, whereas the SDK uses the term **Text** for the same operation.

#### [C#](#tab/csharp)

Create a new [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property. [ImageAnalysisFeature](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisfeature) enum defines the supported values.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=visual_features)]

#### [Python](#tab/python)

Create a new [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-features) property. [ImageAnalysisFeature](/python/api/azure-ai-vision/azure.ai.vision.enums.imageanalysisfeature) enum defines the supported values.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=visual_features)]

#### [C++](#tab/cpp)

Create a new [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object. Then specify an `std::vector` of visual features you'd like to extract, by calling the [SetFeatures](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setfeatures) method. [ImageAnalysisFeature](/cpp/cognitive-services/vision/azure-ai-vision-imageanalysis-namespace#enum-imageanalysisfeature) enum defines the supported values.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=visual_features)]

#### [REST API](#tab/rest)

You can specify which features you want to use by setting the URL query parameters of the [Analysis 4.0 API](https://aka.ms/vision-4-0-ref). A parameter can have multiple values, separated by commas.

|URL parameter | Value | Description|
|---|---|--|
|`features`|`read` | Reads the visible text in the image and outputs it as structured JSON data.|
|`features`|`caption` | Describes the image content with a complete sentence in supported languages.|
|`features`|`denseCaptions` | Generates detailed captions for up to 10 prominent image regions. |
|`features`|`smartCrops` | Finds the rectangle coordinates that would crop the image to a desired aspect ratio while preserving the area of interest.|
|`features`|`objects` | Detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
|`features`|`tags` | Tags the image with a detailed list of words related to the image content.|
|`features`|`people` | Detects people appearing in images, including the approximate locations. |

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,read,caption,denseCaptions,smartCrops,objects,people`

---

### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](./model-customization.md). Once your model is trained, all you need is the model's name. You do not need to specify visual features if you use a custom model.

### [C#](#tab/csharp)

To use a custom model, create the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and set the [ModelName](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.modelname#azure-ai-vision-imageanalysis-imageanalysisoptions-modelname) property. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to set the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property, as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/3/Program.cs?name=model_name)]

### [Python](#tab/python)

To use a custom model, create the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and set the [model_name](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-model-name) property. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to set the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-features) property, as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/3/main.py?name=model_name)]

### [C++](#tab/cpp)

To use a custom model, create the [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object and call the [SetModelName](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setmodelname) method.  You don't need to call any other methods on **ImageAnalysisOptions**. There's no need to call [SetFeatures](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setfeatures) as you do with standard model, since your custom model already implies the visual features the service extracts.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/3/3.cpp?name=model_name)]

### [REST API](#tab/rest)

To use a custom model, don't use the features query parameter. Instead, set the `model-name` parameter to the name of your model as shown here. Replace `MyCustomModelName` with your custom model name.

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&model-name=MyCustomModelName`

---

### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.

#### [C#](#tab/csharp)

Use the [Language](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=language)]

#### [Python](#tab/python)

Use the [language](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=language)]

#### [C++](#tab/cpp)

Call the [SetLanguage](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setlanguage) method on your **ImageAnalysisOptions** object to specify a language.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=language)]

#### [REST API](#tab/rest)

The following URL query parameter specifies the language. The default value is `en`.

|URL parameter | Value | Description|
|---|---|--|
|`language`|`en` | English|
|`language`|`es` | Spanish|
|`language`|`ja` | Japanese|
|`language`|`pt` | Portuguese|
|`language`|`zh` | Simplified Chinese|

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption&language=en`

---

### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.

#### [C#](#tab/csharp)

Set the [GenderNeutralCaption](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.genderneutralcaption) property of your **ImageAnalysisOptions** object to true to enable gender neutral captions.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=gender_neutral_caption)]

#### [Python](#tab/python)

Set the [gender_neutral_caption](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-gender-neutral-caption) property of your **ImageAnalysisOptions** object to true to enable gender neutral captions.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=gender_neutral_caption)]

#### [C++](#tab/cpp)

Call the [SetGenderNeutralCaption](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setgenderneutralcaption) method of your **ImageAnalysisOptions** object with **true** as the argument, to enable gender neutral captions.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=gender_neutral_caption)]

#### [REST API](#tab/rest)

Add the optional query string `gender-neutral-caption` with values `true` or `false` (the default).

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption&gender-neutral-caption=true`

---

### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you select smartCrop/CropSuggestions but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.

#### [C#](#tab/csharp)

Set the [CroppingAspectRatios](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.croppingaspectratios) property of your **ImageAnalysisOptions** to a list of aspect ratios. For example, to set aspect ratios of 0.9 and 1.33:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=cropping_aspect_rations)]

#### [Python](#tab/python)

Set the [cropping_aspect_ratios](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-cropping-aspect-ratios) property of your **ImageAnalysisOptions** to a list of aspect ratios. For example, to set aspect ration of 0.9 and 1.33:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=cropping_aspect_rations)]

#### [C++](#tab/cpp)

Call the [SetCroppingAspectRatios](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setcroppingaspectratios) method of your **ImageAnalysisOptions** with an `std::vector` of aspect ratios. For example, to set aspect ratios of 0.9 and 1.33:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=cropping_aspect_rations)]

#### [REST API](#tab/rest)

Add the optional query string `smartcrops-aspect-ratios`, with one or more aspect ratios separated by a comma.

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=smartCrops&smartcrops-aspect-ratios=0.8,1.2`

---

## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.

#### [C#](#tab/csharp)

1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/dotnet/api/azure.ai.vision.imageanalysis.imageanalyzer) object. **ImageAnalyzer** implements **IDisposable**, therefore create the object with a **using** statement, or explicitly call **Dispose** method after analysis completes.

1. Call the **Analyze** method on the **ImageAnalyzer** object, as shown here. This is a blocking (synchronous) call until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **AnalyzeAsync** method.

1. Check the **Reason** property on the [ImageAnalysisResult](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to access the relevant result properties based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresultdetails) object to get information on the failure.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=analyze)]

#### [Python](#tab/python)

1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/python/api/azure-ai-vision/azure.ai.vision.imageanalyzer) object.

1. Call the **analyze** method on the **ImageAnalyzer** object, as shown here. This is a blocking (synchronous) call until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **analyze_async** method.

1. Check the **reason** property on the [ImageAnalysisResult](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to access the relevant result properties based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysiserrordetails) object to get information on the failure.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=analyze)]

#### [C++](#tab/cpp)

1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/cpp/cognitive-services/vision/imageanalysis-imageanalyzer) object.

1. Call the **Analyze** method on the **ImageAnalyzer** object, as shown here. This is a blocking (synchronous) call until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **AnalyzeAsync** method.

1. Call **GetReason** method on the [ImageAnalysisResult](/cpp/cognitive-services/vision/imageanalysis-imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to call the relevant **Get** methods on the result based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/cpp/cognitive-services/vision/imageanalysis-imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/cpp/cognitive-services/vision/imageanalysis-imageanalysiserrordetails) object to get information on the failure.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=analyze)]

The code uses the following helper method to display the coordinates of a bounding polygon:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=polygon_to_string)]

#### [REST API](#tab/rest)

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

---

### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 

#### [C#](#tab/csharp)

The code is similar to the standard model case. The only difference is that results from the custom model are available on the **CustomTags** and/or **CustomObjects** properties of the [ImageAnalysisResult](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresult) object.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/3/Program.cs?name=analyze)]

#### [Python](#tab/python)

The code is similar to the standard model case. The only difference is that results from the custom model are available on the **custom_tags** and/or **custom_objects** properties of the [ImageAnalysisResult](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresult) object.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/3/main.py?name=analyze)]

#### [C++](#tab/cpp)

The code is similar to the standard model case. The only difference is that results from the custom model are available by calling the **GetCustomTags** and/or **GetCustomObjects** methods of the [ImageAnalysisResult](/cpp/cognitive-services/vision/imageanalysis-imageanalysisresult) object.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/3/3.cpp?name=analyze)]

#### [REST API](#tab/rest)

---

## Error codes

[!INCLUDE [Image Analysis Error Codes](../includes/image-analysis-error-codes-40.md)]

## Next steps

* Explore the [concept articles](../concept-describe-images-40.md) to learn more about each feature.
* Explore the [SDK code samples on GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk).
* See the [REST API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.
