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

This guide assumes you have successfully followed the steps mentioned in the [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL.
* You have the appropriate SDK package installed and you have a running [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) application. You can modify this quickstart application based on code examples here.

## Authenticate against the service

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](/azure/ai-services/security-features) article for more authentication options like [Azure Key Vault](/azure/ai-services/use-key-vault). 

The SDK example assumes that you defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.


Start by creating a [VisionServiceOptions](/python/api/azure-ai-vision/azure.ai.vision.visionserviceoptions) object using one of the constructors. For example:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=vision_service_options)]


## Select the image to analyze

You can select an image by providing a publicly accessible image URL, a local image file name, or by copying the image into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

In your script, create a new [VisionSource](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from the URL of the image you want to analyze.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=vision_source)]

### Image file

In your script, create a new [VisionSource](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from the local image file you want to analyze.

```python
vision_source = sdk.VisionSource(filename="sample.jpg")
```

### Image buffer

In your script, first create an **image_source_buffer**. Get its **image_writer** and call the **write** method to copy the image data into the writer. Then create a new [vision_source](/python/api/azure-ai-vision/azure.ai.vision.visionsource) object from your **image_source_buffer**. In the following code example, `image_buffer` is a variable of type `bytes` containing the image data.

```python
image_source_buffer = sdk.ImageSourceBuffer()
image_source_buffer.image_writer.write(image_buffer)
vision_source = sdk.VisionSource(image_source_buffer=image_source_buffer)
```

## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API users the term **Read** for detecting text in the image, whereas the SDK uses the term **Text** for the same operation.

Create a new [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-features) property. [ImageAnalysisFeature](/python/api/azure-ai-vision/azure.ai.vision.enums.imageanalysisfeature) enum defines the supported values.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=visual_features)]


### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name. You don't need to specify visual features if you use a custom model.

To use a custom model, create the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object and set the [model_name](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-model-name) property. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to set the [features](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-features) property, as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/custom-model/main.py?name=model_name)]


### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.

Use the [language](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=language)]


### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.


Set the [gender_neutral_caption](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-gender-neutral-caption) property of your **ImageAnalysisOptions** object to true to enable gender neutral captions.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=gender_neutral_caption)]


### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you select smartCrop/CropSuggestions but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.


Set the [cropping_aspect_ratios](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions#azure-ai-vision-imageanalysisoptions-cropping-aspect-ratios) property of your **ImageAnalysisOptions** to a list of aspect ratios. For example, to set aspect ration of 0.9 and 1.33:

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=cropping_aspect_ratios)]


## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.


1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/python/api/azure-ai-vision/azure.ai.vision.imageanalyzer) object.

1. Call the **analyze** method on the **ImageAnalyzer** object, as shown here. This call is synchronous, and will block until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **analyze_async** method.

1. Check the **reason** property on the [ImageAnalysisResult](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to access the relevant result properties based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysiserrordetails) object to get information on the failure.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/how-to/main.py?name=analyze)]


### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available on the **custom_tags** and/or **custom_objects** properties of the [ImageAnalysisResult](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisresult) object.

[!code-python[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/python/image-analysis/custom-model/main.py?name=analyze)]


## Error codes


The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/python/api/azure-ai-vision/azure.ai.vision.enums.imageanalysiserrorreason).
* Error code and error message. Click on the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new one.
