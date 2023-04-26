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

## Prerequisites

This guide assumes you have successfully followed the steps mentioned in the [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL. 
* If you are using the client SDK, you have the appropriate SDK package installed and you have a running quickstart application. You will modify this quickstart application based on code examples below.
* If you are using 4.0 REST API calls directly, you have successfully made a `curl.exe` call to the service (or used an alternative tool). You will modify the `curl.exe` call based on the examples belows.

## Authenticate against the service

To authenticate against the Image Analysis service, you will need a Computer Vision key and endpoint URL. Alternatively, you can use a short-duration token instead of a key.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Cognitive Services [security](/azure/cognitive-services/security-features) article for more authentication options like [Azure Key Vault](/azure/cognitive-services/use-key-vault). 


The SDK examples below all assume that you defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.

#### [C#](#tab/csharp)

At the start of your code, use one of the [VisionServiceOptions](/api/azure.ai.vision.core.options.visionserviceoptions) constructors. For example:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=vision_service_options)]

#### [Python](#tab/python)

At the start of your code, use one of the [VisionServiceOptions](/python/api/azure-ai-vision/azure.ai.vision.visionserviceoptions) constructors. For example:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/Program.cs?name=vision_service_options)]

#### [C++](#tab/cpp)

At the start of your code, use one of the static constructor method [VisionServiceOptions::FromEndpoint](/cpp/cognitive-services/vision/service-visionserviceoptions) to create a *VisionServiceOptions* object. For example:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=vision_service_options)]

Where we used this helper function to read the value of an environment variable:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=get-env-var)]

#### [REST](#tab/rest)

The HTTP request header **Ocp-Apim-Subscription-Key** should be set to your vision key.

---

## Submit data to the service

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.

#### [C#](#tab/csharp)

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.FromUrl](/dotnet/api/azure.ai.vision.core.input.visionsource.fromurl).

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=vision_source)]

> [!TIP]
> You can also analyze a local image. See [VisionSource::FromFile](/dotnet/api/azure.ai.vision.core.input.visionsource.fromfile).

#### [Python](#tab/python)

In your script, create a new [VisionSource](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from the URL of the image you want to analyze.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/Program.cs?name=vision_source)]

> [!TIP]
> You can also analyze a local image by passing in the full-path image file name to the **VisionSource** constructor instead of the image URL.

#### [C++](#tab/cpp)

Create a new [VisionSource](/cpp/cognitive-services/vision/input-visionsource) object from the URL of the image you want to analyze, using the static constructor **VisionSource::FromUrl**.**

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=vision_source)]

> [!TIP]
> You can also analyze a local image. See [VisionSource::FromFile](/cpp/cognitive-services/vision/input-visionsource#fromfile).

#### [REST](#tab/rest)

When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"}`. The **Content-Type** should be `application/json`.

To analyze a local image, you'd put the binary image data in the HTTP request body. The **Content-Type** should be `application/octet-stream` or `multipart/form-data`.

---

## Determine how to process the data using the standard model

### Select visual features

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](../overview.md) for a description of each feature. The examples in the sections below add all of the available visual features, but for practical usage you'll likely only need one or two. Note that 'Captions' and 'DenseCaptions' are only supported in Azure GPU regions (East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US).

#### [C#](#tab/csharp)

Create a new [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=visual_features)]

#### [Python](#tab/python)

Create a new [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions?view=azure-python-preview#azure-ai-vision-imageanalysisoptions-features) property.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=visual_features)]

#### [C++](#tab/cpp)

Create a new [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object and specify the visual features you'd like to extract, by calling the [SetFeatures](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setfeatures) method.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=visual_features)]

#### [REST](#tab/rest)

You can specify which features you want to use by setting the URL query parameters of the [Analysis 4.0 API](https://aka.ms/vision-4-0-ref). A parameter can have multiple values, separated by commas. Each feature you specify will require more computation time, so only specify what you need.

|URL parameter | Value | Description|
|---|---|--|
<<<<<<< HEAD
|`features`|`Read` | reads the visible text in the image and outputs it as structured JSON data.|
|`features`|`Caption` | describes the image content with a complete sentence in supported languages.|
|`features`|`DenseCaption` | generates detailed captions for up to 10 prominent image regions. |
|`features`|`SmartCrops` | finds the rectangle coordinates that would crop the image to a desired aspect ratio while preserving the area of interest.|
|`features`|`Objects` | detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
|`features`|`Tags` | tags the image with a detailed list of words related to the image content.|
=======
|`features`|`read` | Reads the visible text in the image and outputs it as structured JSON data.|
|`features`|`caption` | Describes the image content with a complete sentence in supported languages.|
|`features`|`denseCaption` | Generates detailed captions for individual regions in the image. |
|`features`|`smartCrops` | Finds the rectangle coordinates that would crop the image to a desired aspect ratio while preserving the area of interest.|
|`features`|`objects` | Detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
|`features`|`tags` | Tags the image with a detailed list of words related to the image content.|
|`features`|`people` | Detects people appearing in images, including the approximate locations. |
>>>>>>> 3f19b1f50ad3 (More)

A populated URL might look like this:

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,read,caption,denseCaption,smartCrops,objects,people`

---

### Specify languages

You can specify the language of the returned data. This is optional, and the default language is English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

#### [C#](#tab/csharp)

Use the [Language](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=language)]

#### [Python](#tab/python)

Use the [language](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=language)]

#### [C++](#tab/cpp)

Use the [SetLanguage](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setlanguage) method of your **ImageAnalysisOptions** object to specify a language.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=language)]

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

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption&language=en`

---

### Select Gender Neutral Captions

If you're extraction captions or dense captions, you can ask for gender neutral captions. This is an optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** will be replaced with **person**, and **boy** or **girl** will be replaced with **child**. 

#### [C#](#tab/csharp)

Use the [GenderNeutralCaption](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.genderneutralcaption) property of your **ImageAnalysisOptions** object and set it to true to enable gender neutral captions.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=gender_neutral_caption)]

#### [Python](#tab/python)

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=gender_neutral_caption)]

#### [C++](#tab/cpp)

Call the [SetGenderNeutralCaption](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setgenderneutralcaption) method of your **ImageAnalysisOptions** object with **true** as the argument, to enable gender neutral captions.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=gender_neutral_caption)]

#### [REST](#tab/rest)

Add the optional query string `gender-neutral-caption` with values `true` or `false` (the default).

A populated URL might look like this:

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption&gender-neutral-caption=true`

---

### Select Smart Cropping Aspect Ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you do not set aspect rations, and you did select smartCrop/CropSuggestions, the service will return one crop suggestion with an aspect ratio it sees fit between 0.5 and 2.0 (inclusive).

#### [C#](#tab/csharp)

Use the [CroppingAspectRatios](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.croppingaspectratios) property of your **ImageAnalysisOptions** to set the list of aspect rations. For example, to set aspect rations of 0.9 and 1.33:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=cropping_aspect_rations)]

#### [Python](#tab/python)

Use the [cropping_aspect_ratios](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-cropping-aspect-ratios) property of your **ImageAnalysisOptions** to set the list of aspect rations. For example, to set aspect rations of 0.9 and 1.33:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=cropping_aspect_rations)]

#### [C++](#tab/cpp)

Call the [SetCroppingAspectRatios](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setcroppingaspectratios) method of your **ImageAnalysisOptions** to set the list of aspect rations. For example, to set aspect rations of 0.9 and 1.33:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=cropping_aspect_rations)]

#### [REST](#tab/rest)

Add the optional query string `smartcrops-aspect-ratios`, with one or more aspect ratios separated by a comma.

A populated URL might look like this:

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=smartCrops&smartcrops-aspect-ratios=0.8,1.2`

---

## Get results from the service using standard model

This section shows you how to make the API call and parse the results.

#### [C#](#tab/csharp)

The following code calls the Image Analysis API and prints the results for all visual features using the standard model.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/1/Program.cs?name=analyze)]

#### [Python](#tab/python)

The following code calls the Image Analysis API and prints the results for all visual features using the standard model.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/1/main.py?name=analyze)]

#### [C++](#tab/cpp)

The following code calls the Image Analysis API and prints the results for all visual features using the standard model.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=analyze)]

The above code uses the following helper method to display the coordinates of a bounding polygon:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/1/1.cpp?name=polygon-to-string)]

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

--

## Determine how to process the data using a custom model

### Set the name of the custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](./model-customization.md). Once your model is trained, all you need is the model's name value.

#### [C#](#tab/csharp)

To use a custom model, create the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and set the [ModelName](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.modelname#azure-ai-vision-imageanalysis-imageanalysisoptions-modelname) property. Do not set the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property as you do with standard model, as the model name already implies the visual features the service will extract. In fact, **ModelName** is the only property you should set.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/3/Program.cs?name=model_name)]

#### [Python](#tab/python)

To use a custom model, create the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and set the [model_name](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-model-name) property. Do not set the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-features) property as you do with standard model, as the model name already implies the visual features the service will extract.  In fact, **model_name** is the only property you should set.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/3/main.py?name=model_name)]

#### [C++](#tab/cpp)

To use a custom model, create the [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object and call the [SetModelName](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setmodelname) method. Do not call [SetFeatures](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions#setfeatures) as you do with standard model, as the model name already implies the visual features the service will extract. In fact, **SetModelName** is the only method you should call.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/3/3.cpp?name=model_name)]

#### [REST](#tab/rest)

To use a custom model, do not use the features query parameter. Set the model-name parameter to the name of your model.

`https://{endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&model-name=MyCustomModelName`

---

## Get results from the service using custom model

This section shows you how to make the API call and parse the results.

#### [C#](#tab/csharp)

The following code calls the Image Analysis API and prints the results for the visual features defined by your custom model.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/3/Program.cs?name=analyze)]

#### [Python](#tab/python)

The following code calls the Image Analysis API and prints the results for the visual features defined by your custom model.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/3/main.py?name=analyze)]

#### [C++](#tab/cpp)

The following code calls the Image Analysis API and prints the results for the visual features defined by your custom model.

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/3/3.cpp?name=analyze)]

#### [REST](#tab/rest)


---

## Troubleshooting

#### [C#](#tab/csharp)

The sample code above for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrordetails) object that contains the error information. This includes:

* Error reason. See enum [ImageAnalysisErrorReason](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrorreason).
* Error code and error message. Click on the REST tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few additional error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object is set correctly to fix the above. 

In general, if you run into an issue, please first have a look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository. Find the closest sample to your scenario and run it.

#### [Python](#tab/python)

The sample code above for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysiserrordetails) object that contains the error information. This includes:

* Error reason. See enum [ImageAnalysisErrorReason](/python/api/azure-ai-vision/azure.ai.vision.enums.imageanalysiserrorreason).
* Error code and error message. Click on the REST tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few additional error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object is set correctly to fix the above. 

In general, if you run into an issue, please first have a look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository. Find the closest sample to your scenario and run it.

#### [C++](#tab/cpp)

The sample code above for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/cpp/cognitive-services/vision/imageanalysis-imageanalysiserrordetails) object that contains the error information. This includes:

* Error reason. See enum [ImageAnalysisErrorReason](/cpp/cognitive-services/vision/azure-ai-vision-imageanalysis-namespace#enum-imageanalysiserrorreason).
* Error code and error message. Click on the REST tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few additional error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object is set correctly to fix the above. 

In general, if you run into an issue, please first have a look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository. Find the closest sample to your scenario and run it.

#### [REST](#tab/rest)

On error the Image Analysis service response will contain a JSON payload that includes an error code and error message. It may also include additional details in the form of and inner error code and message. For example:

```json
{
    "error":
    {
        "code": "InvalidRequest",
        "message": "Analyze query is invalid.",
        "innererror":
        {
            "code": "NotSupportedVisualFeature",
            "message": "Specified feature type is not valid"
        }
    }
}
```

Following is a list of common errors and their causes. List items are presented in the following format: 

* HTTP response code
  * Error code and message in the JSON response
    * [Optional] Inner error code and message in the JSON response

List of common errors:

* `400 Bad Request`
  * `InvalidRequest - Image URL is badly formatted or not accessible`. Make sure the image URL is valid and publicly accessible.
  * `InvalidRequest - The image size is not allowed to be zero or larger than 20971520 bytes`. Reduce the size of the image by compressing it and/or resizing, and resubmit your request.
  * `InvalidRequest - The feature 'Caption' is not supported in this region`. The feature is only support in specific Azure regions. See [Quickstart prerequisites](../quickstarts-sdk/image-analysis-client-library-40) sections for the list of supported Azure regions.
  * `InvalidRequest - The provided image content type ... is not supported`. The HTTP header **Content-Type** in the request is not an allowed type:
    * For an image URL, **Content-Type** should be `application/json`
    * For a binary image data, **Content-Type** should be `application/octet-stream` or `multipart/form-data`
  * `InvalidRequest - Either 'features' or 'model-name' needs to be specified in the query parameter`. 
  * `InvalidRequest - Image format is not valid`
    * `InvalidImageFormat - Image format is not valid`. See the [Image requirements](..\overview-image-analysis?tabs=4-0#image-requirements) section for supported image formats.
  * `InvalidRequest - Analyze query is invalid`
    * `NotSupportedVisualFeature - Specified feature type is not valid`. Make sure the **features** query string has a valid value.
    * `NotSupportedLanguage - The input language is not supported`. Make sure the **language** query string has a valid value for the selected visual feature, based on the [following table](https://aka.ms/cv-languages).
    * `BadArgument - 'smartcrops-aspect-ratios' aspect ratio is not in allowed range [0.75 to 1.8]`
* `401 PermissionDenied`
  * `401 - Access denied due to invalid subscription key or wrong API endpoint. Make sure to provide a valid key for an active subscription and use a correct regional API endpoint for your resource`.
* `404 Resource Not Found`
  * `404 - Resource not found`. The service could not find the custom model based on the name provided by the 'model-name' query string.

<!-- Add any of those if/when you have a working example:
    * `NotSupportedImage` - Unsupported image, for example child pornography.
    * `InvalidDetails` - Unsupported `detail` parameter value.
    * `BadArgument` - More details are provided in the error message.
* `500`
    * `FailedToProcess`
    * `Timeout` - Image processing timed out.
    * `InternalServerError`
-->

> [!TIP]
> While working with Computer Vision, you might encounter transient failures caused by [rate limits](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern](/azure/architecture/patterns/retry) in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker).

## Next steps

* Explore the [concept articles](../concept-describe-images-40.md) to learn more about each feature.
<<<<<<< HEAD
* Explore the [code samples on GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/blob/main/samples/).
* See the [API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.
=======
* Explore the [SDK code samples on GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk).
* See the [REST API reference](https://aka.ms/vision-4-0-ref) to learn more about the API functionality.
>>>>>>> 73e4e55c8542 (Save results)
