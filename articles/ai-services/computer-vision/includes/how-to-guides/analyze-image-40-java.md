---
author: PatrickFarley
manager: nitinme
ms.service: ai-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
ms.custom: references_regions
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


Start by creating a [VisionServiceOptions](/java/api/com.azure.ai.vision.common.visionserviceoptions) object using one of the constructors. For example:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=vision_service_options)]


## Select the image to analyze

You can select an image by providing a publicly accessible image URL, a local image file name, or by copying the image into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.fromUrl](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromurl(java-net-url)).

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=vision_source)]

**VisionSource** implements **AutoCloseable**, therefore create the object in a try-with-resources block, or explicitly call the **close** method on this object when you're done analyzing the image.

### Image file

Create a new **VisionSource** object from the local image file you want to analyze, using the static constructor [VisionSource.fromFile](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromfile(java-lang-string)). 

```java
VisionSource imageSource = VisionSource.fromFile("sample.jpg");
```

**VisionSource** implements **AutoCloseable**, therefore create the object in a try-with-resources block, or explicitly call the **close** method on this object when you're done analyzing the image.

### Image buffer

Create a new **VisionSource** object from a memory buffer containing the image data, by using the static constructor [VisionSource.fromImageSourceBuffer](/java/api/com.azure.ai.vision.common.visionsource#com-azure-ai-vision-common-visionsource-fromimagesourcebuffer(com-azure-ai-vision-common-imagesourcebuffer)).

Start by creating a new [ImageSourceBuffer](/java/api/com.azure.ai.vision.common.imagesourcebuffer), then get access to its [ImageWriter](/java/api/com.azure.ai.vision.common.imagewriter) object and write the image data into it. In the following code example, `imageBuffer` is a variable of type `ByteBuffer` containing the image data.

```java
ImageSourceBuffer imageSourceBuffer = new ImageSourceBuffer();
ImageWriter imageWriter = imageSourceBuffer.getWriter();
imageWriter.write(imageBuffer);
VisionSource imageSource = VisionSource.fromImageSourceBuffer(imageSourceBuffer);
```

Both **VisionSource** and **ImageSourceBuffer** implements **AutoCloseable**, therefore create the objects in a try-with-resources block, or explicitly call the **close** method on these objects when you're done analyzing the image.

## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API users the term **Read** for detecting text in the image, whereas the SDK uses the term **Text** for the same operation.

Create a new [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object and specify the visual features you'd like to extract, by calling the [setFeatures](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setfeatures(java-util-enumset(com-azure-ai-vision-imageanalysis-imageanalysisfeature))) method. [ImageAnalysisFeature](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisfeature) enum defines the supported values.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=visual_features)]


### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name.

To use a custom model, create the [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object and call the [setModelName](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setmodelname(java-lang-string)) method. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to call [setFeatures](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setfeatures(java-util-enumset(com-azure-ai-vision-imageanalysis-imageanalysisfeature))), as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/custom-model/ImageAnalysis.java?name=model_name)]


### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.

Call the [setLanguage](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setlanguage(java-lang-string)) method on your **ImageAnalysisOptions** object to specify a language.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=language)]


### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.

To enable gender neutral captions, call the [setGenderNeutralCaption](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setgenderneutralcaption(java-lang-boolean)) method on your **ImageAnalysisOptions** object with `true` as the argument.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=gender_neutral_caption)]

### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you select smartCrop/CropSuggestions but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.

Call the [setCroppingAspectRatios](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setcroppingaspectratios(java-util-list(java-lang-double))) method on your **ImageAnalysisOptions** with a list of aspect ratios. For example, to set aspect ratios of 0.9 and 1.33:

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=cropping_aspect_ratios)]


## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.

1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/java/api/com.azure.ai.vision.imageanalysis.imageanalyzer) object. **ImageAnalyzer** implements **AutoCloseable**, therefore create the object in a try-with-resources block, or explicitly call the **close** method on this object when you're done analyzing the image.

1. Call the **analyze** method on the **ImageAnalyzer** object, as shown here. The call is synchronous, and will block until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **analyzeAsync** method.

1. Call the **getReason** method on the [ImageAnalysisResult](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to call the relevant result methods based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/java/api/com.azure.ai.vision.imageanalysis.imageanalysiserrordetails) object to get information on the failure.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/how-to/ImageAnalysis.java?name=analyze)]


### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available by calling **getCustomTags** and/or **getCustomObjects** methods on the [ImageAnalysisResult](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisresult) object.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/custom-model/ImageAnalysis.java?name=analyze)]


## Error codes

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/java/api/com.azure.ai.vision.imageanalysis.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/java/api/com.azure.ai.vision.imageanalysis.imageanalysiserrorreason).
* Error code and error message. Click on the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new one.
