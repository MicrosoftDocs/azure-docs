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

This guide assumes you've followed the steps in the [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) page. This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL.
* You have the appropriate SDK package installed and you have a running [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) application. You can modify this quickstart application based on code examples here.

## Create and authenticate the client

To authenticate with the Image Analysis service, you need a Computer Vision key and endpoint URL. This guide assumes that you've defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](/azure/ai-services/security-features) article for more authentication options like [Azure Key Vault](/azure/ai-services/use-key-vault). 

Start by creating a **ImageAnalysisClient** object. For example:

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_client)]


## Select the image to analyze

You can select an image by providing a publicly accessible image URL, or by reading image data into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

Create a **URL** object for the image you want to analyze.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_url)]


### Image buffer

Alternatively, you can pass in the image as a data array using a **BinaryData** object. For example, read from a local image file you want to analyze.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_file)]

## Select visual features

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer.


> [!IMPORTANT]
> The visual features `Captions` and `DenseCaptions` are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.



[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_features)]

<!--
### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name.

To use a custom model, create the [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object and call the [setModelName](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setmodelname(java-lang-string)) method. You don't need to set any other properties on **ImageAnalysisOptions**. There's no need to call [setFeatures](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions#com-azure-ai-vision-imageanalysis-imageanalysisoptions-setfeatures(java-util-enumset(com-azure-ai-vision-imageanalysis-imageanalysisfeature))), as you do with the standard model, since your custom model already implies the visual features the service extracts.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/custom-model/ImageAnalysis.java?name=model_name)]
-->


## Select analysis options

Use an **ImageAnalysisOptions** object to specify various options for the Analyze API call. 

- **Language**: You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language. 
- **Gender neutral captions**: If you're extracting captions or dense captions (using **VisualFeatures.caption** or **VisualFeatures.denseCaptions**), you can ask for gender neutral captions. Gender neutral captions are optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 
- **Crop aspect ratio**: An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when **VisualFeatures.smartCrops** was selected as part the visual feature list. If you select **VisualFeatures.smartCrops** but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_options)]




## Call the Analyze API

This section shows you how to make an analysis call to the service. 

Call the **analyze** method on the **ImageAnalysisClient** object, as shown here. The call is synchronous, and will block until the service returns the results or an error occurred. Alternatively, you can use a **ImageAnalysisAsyncClient** object instead, and call its **analyze** method which is non-blocking. 

Use the input objects created in the above sections. To analyze from an image buffer instead of URL, replace `imageURL` in the method call with `imageBuffer`.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_call)]

<!--
### Get results using custom model

This section shows you how to make an analysis call to the service, when using a custom model. 


The code is similar to the standard model case. The only difference is that results from the custom model are available by calling **getCustomTags** and/or **getCustomObjects** methods on the [ImageAnalysisResult](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisresult) object.

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/custom-model/ImageAnalysis.java?name=analyze)]
-->

## Get results from the service

The following code shows you how to parse the results of the various Analyze operations.

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysisHowTo.java?name=snippet_results)]

## Troubleshooting

### Exceptions

The `analyze` methods throw [HttpResponseException](/java/api/com.azure.core.exception) when the service responds with a non-success HTTP status code. The exception's `getResponse().getStatusCode()` holds the HTTP response status code. The exception's `getMessage()` contains a detailed message that allows you to diagnose the issue:

```java
try {
    ImageAnalysisResult result = client.analyze(...)
} catch (HttpResponseException e) {
    System.out.println("Exception: " + e.getClass().getSimpleName());
    System.out.println("Status code: " + e.getResponse().getStatusCode());
    System.out.println("Message: " + e.getMessage());
} catch (Exception e) {
    System.out.println("Message: " + e.getMessage());
}
```

For example, when you provide a wrong authentication key:

```
Exception: ClientAuthenticationException
Status code: 401
Message: Status code 401, "{"error":{"code":"401","message":"Access denied due to invalid subscription key or wrong API endpoint. Make sure to provide a valid key for an active subscription and use a correct regional API endpoint for your resource."}}"
```

Or when you provide an image in a format that isn't recognized:

```
Exception: HttpResponseException
Status code: 400
Message: Status code 400, "{"error":{"code":"InvalidRequest","message":"Image format is not valid.","innererror":{"code":"InvalidImageFormat","message":"Input data is not a valid image."}}}"
```

### Enable HTTP request/response logging

Reviewing the HTTP request sent or response received over the wire to the Image Analysis service can be useful in troubleshooting. The Image Analysis client library supports a built-in console logging framework for temporary debugging purposes. It also supports more advanced logging using the [SLF4J](https://www.slf4j.org/) interface. For detailed information, see [Use logging in the Azure SDK for Java](/azure/developer/java/sdk/troubleshooting-overview#use-logging-in-the-azure-sdk-for-java).

The sections below discusses enabling console logging using the built-in framework.

#### By setting environment variables

You can enable console logging of HTTP request and response for your entire application by setting the following two environment variables. This change affects every Azure client that supports logging HTTP request and response.

* Set environment variable `AZURE_LOG_LEVEL` to `debug`
* Set environment variable `AZURE_HTTP_LOG_DETAIL_LEVEL` to one of the following values:

| Value             | Logging level                                                        |
|-------------------|----------------------------------------------------------------------|
| `none`            | HTTP request/response logging is disabled                            |
| `basic`           | Logs only URLs, HTTP methods, and time to finish the request.        |
| `headers`         | Logs everything in BASIC, plus all the request and response headers. |
| `body`            | Logs everything in BASIC, plus all the request and response body.    |
| `body_and_headers`| Logs everything in HEADERS and BODY.                                 |

#### By setting httpLogOptions

 To enable console logging of HTTP request and response for a single client

* Set environment variable `AZURE_LOG_LEVEL` to `debug`
* Add a call to `httpLogOptions` when building the `ImageAnalysisClient`:

```java
ImageAnalysisClient client = new ImageAnalysisClientBuilder()
    .endpoint(endpoint)
    .credential(new KeyCredential(key))
    .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS))
    .buildClient();
```

The enum [HttpLogDetailLevel](/java/api/com.azure.core.http.policy.httplogdetaillevel) defines the supported logging levels.

By default, when logging, certain HTTP header and query parameter values are redacted. It is possible to override this default by specifying which headers and query parameters are safe to log:

```java
ImageAnalysisClient client = new ImageAnalysisClientBuilder()
    .endpoint(endpoint)
    .credential(new KeyCredential(key))
    .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS)
        .addAllowedHeaderName("safe-to-log-header-name")
        .addAllowedQueryParamName("safe-to-log-query-parameter-name"))
    .buildClient();
```

For example, to get a complete un-redacted log of the HTTP request, apply the following:

```java
    .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS)
        .addAllowedHeaderName("Ocp-Apim-Subscription-Key")
        .addAllowedQueryParamName("features")
        .addAllowedQueryParamName("language")
        .addAllowedQueryParamName("gender-neutral-caption")
        .addAllowedQueryParamName("smartcrops-aspect-ratios")
        .addAllowedQueryParamName("model-version"))
```

Add more to the above to get an un-redacted HTTP response. When you share an un-redacted log, make sure it doesn't contain secrets such as your subscription key.
