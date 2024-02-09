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
* You have successfully made a `curl.exe` call to the service (or used an alternative tool). You modify the `curl.exe` call based on the examples here.

## Authenticate against the service

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](/azure/ai-services/security-features) article for more authentication options like [Azure Key Vault](/azure/ai-services/use-key-vault). 

The SDK example assumes that you defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.


Authentication is done by adding the HTTP request header **Ocp-Apim-Subscription-Key** and setting it to your vision key. The call is made to the URL `https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01`, where `<endpoint>` is your unique computer vision endpoint URL. You add query strings based on your analysis options.


## Select the image to analyze

The code in this guide uses remote images referenced by URL. You may want to try different images on your own to see the full capability of the Image Analysis features.


When analyzing a remote image, you specify the image's URL by formatting the request body like this: `{"url":"https://learn.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"}`. The **Content-Type** should be `application/json`.

To analyze a local image, you'd put the binary image data in the HTTP request body. The **Content-Type** should be `application/octet-stream` or `multipart/form-data`.


## Select analysis options

### Select visual features when using the standard model

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

Visual features 'Captions' and 'DenseCaptions' are only supported in the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

> [!NOTE]
> The REST API uses the terms **Smart Crops** and **Smart Crops Aspect Ratios**. The SDK uses the terms **Crop Suggestions** and **Cropping Aspect Ratios**. They both refer to the same service operation. Similarly, the REST API uses the term **Read** for detecting text in the image using Optical Character Recognition (OCR), whereas the SDK uses the term **Text** for the same operation.


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

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01&features=tags,read,caption,denseCaptions,smartCrops,objects,people`


### Set model name when using a custom model

You can also do image analysis with a custom trained model. To create and train a model, see [Create a custom Image Analysis model](/azure/ai-services/computer-vision/how-to/model-customization). Once your model is trained, all you need is the model's name. You do not need to specify visual features if you use a custom model.


To use a custom model, don't use the features query parameter. Instead, set the `model-name` parameter to the name of your model as shown here. Replace `MyCustomModelName` with your custom model name.

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01&model-name=MyCustomModelName`


### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

Language option only applies when you're using the standard model.


The following URL query parameter specifies the language. The default value is `en`.

|URL parameter | Value | Description|
|---|---|--|
|`language`|`en` | English|
|`language`|`es` | Spanish|
|`language`|`ja` | Japanese|
|`language`|`pt` | Portuguese|
|`language`|`zh` | Simplified Chinese|

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01&features=caption&language=en`


### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

Gender neutral caption option only applies when you're using the standard model.


Add the optional query string `gender-neutral-caption` with values `true` or `false` (the default).

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01&features=caption&gender-neutral-caption=true`


### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smartCrop** option (REST API) or **CropSuggestions** (SDK) was selected as part the visual feature list. If you select smartCrop/CropSuggestions but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

Smart cropping aspect rations only applies when you're using the standard model.


Add the optional query string `smartcrops-aspect-ratios`, with one or more aspect ratios separated by a comma.

A populated URL might look like this:

`https://<endpoint>/computervision/imageanalysis:analyze?api-version=2023-10-01&features=smartCrops&smartcrops-aspect-ratios=0.8,1.2`


## Get results from the service

### Get results using the standard model

This section shows you how to make an analysis call to the service using the standard model, and get the results.


The service returns a `200` HTTP response, and the body contains the returned data in the form of a JSON string. The following text is an example of a JSON response.

```json
{
    "modelVersion": "string",
    "captionResult": {
      "text": "string",
      "confidence": 0.0
    },
    "denseCaptionsResult": {
      "values": [
        {
          "text": "string",
          "confidence": 0.0,
          "boundingBox": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          }
        }
      ]
    },
    "metadata": {
      "width": 0,
      "height": 0
    },
    "tagsResult": {
      "values": [
        {
          "name": "string",
          "confidence": 0.0
        }
      ]
    },
    "objectsResult": {
      "values": [
        {
          "id": "string",
          "boundingBox": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "tags": [
            {
              "name": "string",
              "confidence": 0.0
            }
          ]
        }
      ]
    },
    "readResult": {
      "blocks": [
        {
          "lines": [
            {
              "text": "string",
              "boundingPolygon": [
                {
                  "x": 0,
                  "y": 0
                },
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 0,
                    "y": 0
                }
              ],
              "words": [
                {
                  "text": "string",
                  "boundingPolygon": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 0
                    }
                  ],
                  "confidence": 0.0
                }
              ]
            }
          ]
        }
      ]
    },
    "smartCropsResult": {
      "values": [
        {
          "aspectRatio": 0.0,
          "boundingBox": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          }
        }
      ]
    },
    "peopleResult": {
      "values": [
        {
          "boundingBox": {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0
          },
          "confidence": 0.0
        }
      ]
    }
  }
```

## Error codes

On error, the Image Analysis service response contains a JSON payload that includes an error code and error message. It may also include other details in the form of and inner error code and message. For example:

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
  * `InvalidRequest - The feature 'Caption' is not supported in this region`. The feature is only supported in specific Azure regions. See [Quickstart prerequisites](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40#prerequisites) for the list of supported Azure regions.
  * `InvalidRequest - The provided image content type ... is not supported`. The HTTP header **Content-Type** in the request isn't an allowed type:
    * For an image URL, **Content-Type** should be `application/json`
    * For a binary image data, **Content-Type** should be `application/octet-stream` or `multipart/form-data`
  * `InvalidRequest - Either 'features' or 'model-name' needs to be specified in the query parameter`. 
  * `InvalidRequest - Image format is not valid`
    * `InvalidImageFormat - Image format is not valid`. See the [Image requirements](/azure/ai-services/computer-vision/overview-image-analysis?tabs=4-0#image-requirements) section for supported image formats.
  * `InvalidRequest - Analyze query is invalid`
    * `NotSupportedVisualFeature - Specified feature type is not valid`. Make sure the **features** query string has a valid value.
    * `NotSupportedLanguage - The input language is not supported`. Make sure the **language** query string has a valid value for the selected visual feature, based on the [following table](https://aka.ms/cv-languages).
    * `BadArgument - 'smartcrops-aspect-ratios' aspect ratio is not in allowed range [0.75 to 1.8]`
* `401 PermissionDenied`
  * `401 - Access denied due to invalid subscription key or wrong API endpoint. Make sure to provide a valid key for an active subscription and use a correct regional API endpoint for your resource`.
* `404 Resource Not Found`
  * `404 - Resource not found`. The service couldn't find the custom model based on the name provided by the `model-name` query string.

<!-- Add any of those if/when you have a working example:
    * `NotSupportedImage` - Unsupported image, for example child pornography.
    * `InvalidDetails` - Unsupported `detail` parameter value.
    * `BadArgument` - More details are provided in the error message.
* `500`
    * `FailedToProcess`
    * `Timeout` - Image processing timed out.
    * `InternalServerError`
-->
