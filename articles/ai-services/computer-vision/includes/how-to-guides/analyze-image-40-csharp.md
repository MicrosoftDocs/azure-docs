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

This guide assumes you've followed the steps mentioned in the [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL.
* You have the appropriate SDK package installed and you have a running [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) application. You can modify this quickstart application based on code examples here.

## Create and authenticate the client

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL. This guide assumes that you've defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](/azure/ai-services/security-features) article for more authentication options like [Azure Key Vault](/azure/ai-services/use-key-vault). 

Start by creating a **ImageAnalysisClient** object. For example:

[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_client)]


## Select the image to analyze

You can select an image by providing a publicly accessible image URL, or by reading image data into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

Create a **Uri** object for the image you want to analyze.

[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_url)]


### Image buffer

Alternatively, you can read the data to the input buffer through a **BinaryData** object. For example, read from a local image file you want to analyze.

[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_file)]


## Select analysis options

Use an **ImageAnalysisOptions** object to specify various options for the Analyze API call. 

- **Language**: You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language. 
- **Gender neutral captions**: If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 
- **Crop aspect ratio**: An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **VisualFeatures.SmartCrops** (SDK) was selected as part the visual feature list. If you select smartCrop/VisualFeatures.SmartCrops but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).


[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_options)]


## Select visual features

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer.

> [!IMPORTANT]
> The visual features `Captions` and `DenseCaptions` are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.



[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_features)]

<!--
### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name. You don't need to specify visual features if you use a custom model.


To use a custom model, create the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object and set the [ModelName](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.modelname#azure-ai-vision-imageanalysis-imageanalysisoptions-modelname) property. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to set the [Features](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions.features#azure-ai-vision-imageanalysis-imageanalysisoptions-features) property, as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/custom-model/program.cs?name=model_name)]
-->

## Call the Analyze API

This section shows you how to make an analysis call to the service. The call is synchronous, and will block until the service returns the results or an error occurred. Alternatively, you can call the non-blocking **AnalyzeAsync** method.

Call the **analyze** method on the **ImageAnalysisClient** object, as shown here. Use the input objects created in the above sections.

[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_call)]


## Get results from the service

The following code shows you how to parse the results of the various Analyze operations.

[!code-dotnet[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/4-0/image-analysis-quickstart/HowTo.cs?name=snippet_results)]

<!--
### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available on the **CustomTags** and/or **CustomObjects** properties of the [ImageAnalysisResult](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisresult) object.

[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/custom-model/program.cs?name=analyze)]
-->


## Troubleshooting

### Common errors

When you interact with Image Analysis using the .NET SDK, errors returned by the service correspond to the same HTTP status codes returned for REST API requests. For example, if you try to analyze an image that is not accessible due to a broken URL, a `400` status is returned, indicating a bad request.


### Handling exceptions

In the following snippet, the error is handled gracefully by catching the exception and displaying additional information about the error.

```C# Snippet:ImageAnalysisException
var imageUrl = new Uri("https://some-host-name.com/non-existing-image.jpg");

try
{
    var result = client.Analyze(imageUrl, VisualFeatures.Caption);
}
catch (RequestFailedException e)
{
    if (e.Status != 200)
    {
        Console.WriteLine("Error analyzing image.");
        Console.WriteLine($"HTTP status code {e.Status}: {e.Message}");
    }
    else
    {
        throw;
    }
}
```
You can learn more about how to enable SDK logging [here](/dotnet/azure/sdk/logging).


