---
author: PatrickFarley
manager: nitinme
ms.service: ai-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

## Prerequisites

This guide assumes you have successfully followed the steps mentioned in the [quickstart](/azure/cognitive-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL.
* You have the appropriate SDK package installed and you have a running [quickstart](/azure/cognitive-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) application. You can modify this quickstart application based on code examples here.

## Authenticate against the service

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Cognitive Services [security](/azure/cognitive-services/security-features) article for more authentication options like [Azure Key Vault](/azure/cognitive-services/use-key-vault). 

The SDK example assumes that you defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.


Start by creating a [VisionServiceOptions](TBD) object using one of the constructors. For example:

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=vision_service_options)]

**VisionServiceOptions** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

## Select the image to analyze

You can select an image by providing a publicly accessible URL, a local image file name, or by copying the image into an input buffer. See [Image requirements](../../overview-image-analysis?tabs=4-0#image-requirements) for supported image formats.

### Image URL

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.fromUrl](TBD). **VisionSource** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

The code in this guide uses an example image URL. You may want to try different images on your own to see the full capability of the Image Analysis service.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=vision_source)]

### Image file

Create a new **VisionSource** object from the local image file you want to analyze, using the static constructor [VisionSource.fromFile](TBD). **VisionSource** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=vision_source)]

### Image buffer

Create a new **VisionSource** object from a memory buffer containing the image data, using the static constructor [VisionSource.fromImageSourceBuffer](TBD).

This is done by first creating a new [ImageSourceBuffer](TBD), getting access to its [ImageWriter](TBD) object and writing the image data into it.

**VisionSource** and **ImageSourceBuffer** implement **AutoCloseable**, therefore declare them in a try-with-resource statement, or explicitly call their **close** method after analysis completes.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=vision_source)]


## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/cognitive-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API users the term **Read** for detecting text in the image, whereas the SDK uses the term **Text** for the same operation.


Create a new [ImageAnalysisOptions](TBD) object and specify the visual features you'd like to extract, by calling the [setFeatures](TBD) method. [ImageAnalysisFeature](TBD) enum defines the supported values.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/main.java?name=visual_features)]

**ImageAnalysisOptions** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/cognitive-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name. You do not need to specify visual features if you use a custom model.


To use a custom model, create the [ImageAnalysisOptions](TBD) object and call the [setModelName](TBD) method. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to call [setFeatures](TBD), as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=model_name)]


### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.


Call the [setLanguage](TBD) method on your **ImageAnalysisOptions** object to specify a language.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=language)]


### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.


Call the [setGenderNeutralCaption](TBD) method on your **ImageAnalysisOptions** object to true to enable gender neutral captions.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=gender_neutral_caption)]


### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CROP_SUGGESTIONS** (SDK) was selected as part the visual feature list. If you select smartCrop/CROP_SUGGESTIONS but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.

Call the [setCroppingAspectRatios](TBD) property of your **ImageAnalysisOptions** to a list of aspect ratios. For example, to set aspect ratios of 0.9 and 1.33:

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=cropping_aspect_ratios)]


## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.


1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](TBD) object. **ImageAnalyzer** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

1. Call the **analyze** method on the **ImageAnalyzer** object, as shown here. This is a blocking (synchronous) call until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **analyzeAsync** method.

1. Call **getReason** method on the [ImageAnalysisResult](TBD) object, to determine if analysis succeeded or failed.

Note that **ImageAnalysisResult** implements **AutoCloseable**, therefore declare it in a try-with-resource statement, or explicitly call the **close** method after analysis completes.

1. If succeeded, proceed to get the relevant results based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](TBD) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](TBD) object to get information on the failure.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=analyze)]


### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available by calling **getCustomTags** and/or **getCustomObjects** methods of the [ImageAnalysisResult](TBD) object.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/main.java?name=analyze)]


## Error codes

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](TBD) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](TBD).
* Error code and error message. Click on the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](TBD) object is set correctly to fix these errors.

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new one.