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


Start by creating a [VisionServiceOptions](/dotnet/api/azure.ai.vision.common.visionserviceoptions) object using one of the constructors. For example:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=vision_service_options)]


## Select the image to analyze

You can select an image by providing a publicly accessible image URL, a local image file name, or by copying the image into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

Create a new **VisionSource** object from the URL of the image you want to analyze, using the static constructor [VisionSource.FromUrl](/dotnet/api/azure.ai.vision.common.visionsource.fromurl). **VisionSource** implements **IDisposable**, therefore create the object with a **using** statement or explicitly call **Dispose** method after analysis completes.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=vision_source)]

### Image file

Create a new **VisionSource** object from the local image file you want to analyze, using the static constructor [VisionSource.FromFile](/dotnet/api/azure.ai.vision.common.visionsource.fromfile). **VisionSource** implements **IDisposable**, therefore create the object with a **using** statement or explicitly call **Dispose** method after analysis completes.

```csharp
using var imageSource = VisionSource.FromFile("sample.jpg");
```

### Image buffer

Create a new **VisionSource** object from a memory buffer containing the image data, by using the static constructor [VisionSource.FromImageSourceBuffer](/dotnet/api/azure.ai.vision.common.visionsource.fromimagesourcebuffer).

Start by creating a new [ImageSourceBuffer](/dotnet/api/azure.ai.vision.common.imagesourcebuffer), then get access to its [ImageWriter](/dotnet/api/azure.ai.vision.common.imagewriter) object and write the image data into it. In the following code example, `imageBuffer` is a variable of type `Memory<byte>` containing the image data.

```csharp
using var imageSourceBuffer = new ImageSourceBuffer();
imageSourceBuffer.GetWriter().Write(imageBuffer);
using var imageSource = VisionSource.FromImageSourceBuffer(imageSourceBuffer);
```

Both **VisionSource** and **ImageSourceBuffer** implement **IDisposable**, therefore create the objects with a **using** statement or explicitly call their **Dispose** method after analysis completes.

## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API users the term **Read** for detecting text in the image, whereas the SDK uses the term **Text** for the same operation.


Create a new [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and specify the visual features you'd like to extract, by setting the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property. [ImageAnalysisFeature](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisfeature) enum defines the supported values.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=visual_features)]


### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name. You don't need to specify visual features if you use a custom model.


To use a custom model, create the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and set the [ModelName](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.modelname#azure-ai-vision-imageanalysis-imageanalysisoptions-modelname) property. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to set the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property, as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/custom-model/program.cs?name=model_name)]


### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.


Use the [Language](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.language) property of your **ImageAnalysisOptions** object to specify a language.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=language)]


### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.


Set the [GenderNeutralCaption](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.genderneutralcaption) property of your **ImageAnalysisOptions** object to true to enable gender neutral captions.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=gender_neutral_caption)]


### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you select smartCrop/CropSuggestions but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.


Set the [CroppingAspectRatios](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.croppingaspectratios) property of your **ImageAnalysisOptions** to a list of aspect ratios. For example, to set aspect ratios of 0.9 and 1.33:

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=cropping_aspect_ratios)]


## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.


1. Using the **VisionServiceOptions**, **VisionSource** and **ImageAnalysisOptions** objects, construct a new [ImageAnalyzer](/dotnet/api/azure.ai.vision.imageanalysis.imageanalyzer) object. **ImageAnalyzer** implements **IDisposable**, therefore create the object with a **using** statement, or explicitly call **Dispose** method after analysis completes.

1. Call the **Analyze** method on the **ImageAnalyzer** object, as shown here. The call is synchronous, and will block until the service returns the results or an error occurred. Alternatively, you can call the nonblocking **AnalyzeAsync** method.

1. Check the **Reason** property on the [ImageAnalysisResult](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresult) object, to determine if analysis succeeded or failed.

1. If succeeded, proceed to access the relevant result properties based on your selected visual features, as shown here. Additional information (not commonly needed) can be obtained by constructing the [ImageAnalysisResultDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresultdetails) object.

1. If failed, you can construct the [ImageAnalysisErrorDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresultdetails) object to get information on the failure.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/how-to/program.cs?name=analyze)]


### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available on the **CustomTags** and/or **CustomObjects** properties of the [ImageAnalysisResult](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresult) object.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/custom-model/program.cs?name=analyze)]


## Error codes

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrorreason).
* Error code and error message. Click on the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new one.
