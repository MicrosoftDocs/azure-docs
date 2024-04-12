<!--# [C#](#tab/csharp)

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysiserrorreason).
* Error code and error message. Select the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/dotnet/api/azure.ai.vision.imageanalysis.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new.

# [Python](#tab/python)

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/python/api/azure-ai-vision/azure.ai.vision.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/python/api/azure-ai-vision/azure.ai.vision.enums.imageanalysiserrorreason).
* Error code and error message. Select the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/python/api/azure-ai-vision/azure.ai.vision.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new.

# [Java](#tab/java)

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/java/api/com.azure.ai.vision.imageanalysis.imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/java/api/com.azure.ai.vision.imageanalysis.imageanalysiserrorreason).
* Error code and error message. Select the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/java/api/com.azure.ai.vision.imageanalysis.imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new.

# [C++](#tab/cpp)

The sample code for getting analysis results shows how to handle errors and get the [ImageAnalysisErrorDetails](/cpp/cognitive-services/vision/imageanalysis-imageanalysiserrordetails) object that contains the error information. The error information includes:

* Error reason. See enum [ImageAnalysisErrorReason](/cpp/cognitive-services/vision/azure-ai-vision-imageanalysis-namespace#enum-imageanalysiserrorreason).
* Error code and error message. Select the **REST API** tab to see a list of some common error codes and messages.

In addition to those errors, the SDK has a few other error messages, including:
  * `Missing Image Analysis options: You must set at least one visual feature (or model name) for the 'analyze' operation. Or set segmentation mode for the 'segment' operation`
  * `Invalid combination of Image Analysis options: You cannot set both visual features (or model name), and segmentation mode`

Make sure the [ImageAnalysisOptions](/cpp/cognitive-services/vision/imageanalysis-imageanalysisoptions) object is set correctly to fix these errors. 

To help resolve issues, look at the [Image Analysis Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository and run the closest sample to your scenario. Search the [GitHub issues](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues) to see if your issue was already address. If not, create a new.

# [REST API](#tab/rest)
-->

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
  * `InvalidRequest - The feature 'Caption' is not supported in this region`. The feature is only supported in specific Azure regions. See [Quickstart prerequisites](../quickstarts-sdk/image-analysis-client-library-40.md#prerequisites) for the list of supported Azure regions.
  * `InvalidRequest - The provided image content type ... is not supported`. The HTTP header **Content-Type** in the request isn't an allowed type:
    * For an image URL, **Content-Type** should be `application/json`
    * For a binary image data, **Content-Type** should be `application/octet-stream` or `multipart/form-data`
  * `InvalidRequest - Either 'features' or 'model-name' needs to be specified in the query parameter`. 
  * `InvalidRequest - Image format is not valid`
    * `InvalidImageFormat - Image format is not valid`. See the [Image requirements](../overview-image-analysis.md?tabs=4-0#image-requirements) section for supported image formats.
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



> [!TIP]
> While working with Azure AI Vision, you might encounter transient failures caused by [rate limits](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern](/azure/architecture/patterns/retry) in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker).

