---
title: "Quickstart: Extract handwritten text - REST, Java"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you extract handwritten text from an image using the Computer Vision API with Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley
ms.custom: seodec18
---
# Quickstart: Extract handwritten text using the Computer Vision REST API and Java

In this quickstart, you extract handwritten text from an image by using Computer Vision's REST API. With the [Batch Read](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/2afb498089f74080d7ef85eb) API and the [Read Operation Result](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/5be108e7498a4f9ed20bf96d) API, you can detect handwritten text in an image, then extract recognized characters into a machine-usable character stream.

> [!IMPORTANT]
> Unlike the [OCR](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) method, the [Batch Read](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/2afb498089f74080d7ef85eb) method runs asynchronously. This method does not return any information in the body of a successful response. Instead, the Batch Read method returns a URI in the value of the `Operation-Content` response header field. You can then call this URI, which represents the [Read Operation Result](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/5be108e7498a4f9ed20bf96d) method, in order to check the status and return the results of the Batch Read method call.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

## Prerequisites

- You must have [Java&trade; Platform, Standard Edition Development Kit 7 or 8](https://aka.ms/azure-jdks) (JDK 7 or 8) installed.
- You must have a subscription key for Computer Vision. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.

## Create and run the sample application

To create and run the sample, do the following steps:

1. Create a new Java project in your favorite IDE or editor. If the option is available, create the Java project from a command line application template.
1. Import the following libraries into your Java project. If you're using Maven, the Maven coordinates are provided for each library.
   - [Apache HTTP client](https://hc.apache.org/downloads.cgi) (org.apache.httpcomponents:httpclient:4.5.5)
   - [Apache HTTP core](https://hc.apache.org/downloads.cgi) (org.apache.httpcomponents:httpcore:4.4.9)
   - [JSON library](https://github.com/stleary/JSON-java) (org.json:json:20180130)
1. Add the following `import` statements to the file that contains the `Main` public class for your project.  

   ```java
   import java.net.URI;
   import org.apache.http.HttpEntity;
   import org.apache.http.HttpResponse;
   import org.apache.http.client.methods.HttpGet;
   import org.apache.http.client.methods.HttpPost;
   import org.apache.http.client.utils.URIBuilder;
   import org.apache.http.entity.StringEntity;
   import org.apache.http.impl.client.CloseableHttpClient;
   import org.apache.http.impl.client.HttpClientBuilder;
   import org.apache.http.util.EntityUtils;
   import org.apache.http.Header;
   import org.json.JSONObject;
   ```

1. Replace the `Main` public class with the following code, then make the following changes in code where needed:
   1. Replace the value of `subscriptionKey` with your subscription key.
   1. Replace the value of `uriBase` with the endpoint URL for the [Batch Read](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/2afb498089f74080d7ef85eb) method from the Azure region where you obtained your subscription keys, if necessary.
   1. Optionally, replace the value of `imageToAnalyze` with the URL of a different image from which you want to extract handwritten text.
1. Save, then build the Java project.
1. If you're using an IDE, run `Main`. Otherwise, open a command prompt window and then use the `java` command to run the compiled class. For example, `java Main`.

```java
public class Main {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace <Subscription Key> with your valid subscription key.
    private static final String subscriptionKey = "<Subscription Key>";

    // You must use the same Azure region in your REST API method as you used to
    // get your subscription keys. For example, if you got your subscription keys
    // from the West US region, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the "westcentralus" region.
    // If you use a free trial subscription key, you shouldn't need to change
    // this region.
    private static final String uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze";

    private static final String imageToAnalyze =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/" +
        "Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg";

    public static void main(String[] args) {
        CloseableHttpClient httpTextClient = HttpClientBuilder.create().build();
        CloseableHttpClient httpResultClient = HttpClientBuilder.create().build();;

        try {
            // This operation requires two REST API calls. One to submit the image
            // for processing, the other to retrieve the text found in the image.

            URIBuilder builder = new URIBuilder(uriBase);

            // Prepare the URI for the REST API method.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

            // Request body.
            StringEntity requestEntity =
                    new StringEntity("{\"url\":\"" + imageToAnalyze + "\"}");
            request.setEntity(requestEntity);

            // Two REST API methods are required to extract handwritten text.
            // One method to submit the image for processing, the other method
            // to retrieve the text found in the image.

            // Call the first REST API method to detect the text.
            HttpResponse response = httpTextClient.execute(request);

            // Check for success.
            if (response.getStatusLine().getStatusCode() != 202) {
                // Format and display the JSON error message.
                HttpEntity entity = response.getEntity();
                String jsonString = EntityUtils.toString(entity);
                JSONObject json = new JSONObject(jsonString);
                System.out.println("Error:\n");
                System.out.println(json.toString(2));
                return;
            }

            // Store the URI of the second REST API method.
            // This URI is where you can get the results of the first REST API method.
            String operationLocation = null;

            // The 'Operation-Location' response header value contains the URI for
            // the second REST API method.
            Header[] responseHeaders = response.getAllHeaders();
            for (Header header : responseHeaders) {
                if (header.getName().equals("Operation-Location")) {
                    operationLocation = header.getValue();
                    break;
                }
            }

            if (operationLocation == null) {
                System.out.println("\nError retrieving Operation-Location.\nExiting.");
                System.exit(1);
            }

            // If the first REST API method completes successfully, the second
            // REST API method retrieves the text written in the image.
            //
            // Note: The response may not be immediately available. Handwriting
            // recognition is an asynchronous operation that can take a variable
            // amount of time depending on the length of the handwritten text.
            // You may need to wait or retry this operation.

            System.out.println("\nHandwritten text submitted.\n" +
                    "Waiting 10 seconds to retrieve the recognized text.\n");
            Thread.sleep(10000);

            // Call the second REST API method and get the response.
            HttpGet resultRequest = new HttpGet(operationLocation);
            resultRequest.setHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

            HttpResponse resultResponse = httpResultClient.execute(resultRequest);
            HttpEntity responseEntity = resultResponse.getEntity();

            if (responseEntity != null) {
                // Format and display the JSON response.
                String jsonString = EntityUtils.toString(responseEntity);
                JSONObject json = new JSONObject(jsonString);
                System.out.println("Text recognition result response: \n");
                System.out.println(json.toString(2));
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```

## Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the console window, similar to the following example:

```json
Handwritten text submitted. Waiting 10 seconds to retrieve the recognized text.

Text recognition result response:

{
  "status": "Succeeded",
  "recognitionResults": [
    {
      "page": 1,
      "clockwiseOrientation": 349.59,
      "width": 3200,
      "height": 3200,
      "unit": "pixel",
      "lines": [
        {
          "boundingBox": [202,618,2047,643,2046,840,200,813],
          "text": "Our greatest glory is not",
          "words": [
            {
              "boundingBox": [204,627,481,628,481,830,204,829],
              "text": "Our"
            },
            {
              "boundingBox": [519,628,1057,630,1057,832,518,830],
              "text": "greatest"
            },
            {
              "boundingBox": [1114,630,1549,631,1548,833,1114,832],
              "text": "glory"
            },
            {
              "boundingBox": [1586,631,1785,632,1784,834,1586,833],
              "text": "is"
            },
            {
              "boundingBox": [1822,632,2115,633,2115,835,1822,834],
              "text": "not"
            }
          ]
        },
        {
          "boundingBox": [420,1273,2954,1250,2958,1488,422,1511],
          "text": "but in rising every time we fall",
          "words": [
            {
              "boundingBox": [423,1269,634,1268,635,1507,424,1508],
              "text": "but"
            },
            {
              "boundingBox": [667,1268,808,1268,809,1506,668,1507],
              "text": "in"
            },
            {
              "boundingBox": [874,1267,1289,1265,1290,1504,875,1506],
              "text": "rising"
            },
            {
              "boundingBox": [1331,1265,1771,1263,1772,1502,1332,1504],
              "text": "every"
            },
            {
              "boundingBox": [1812, 1263, 2178, 1261, 2179, 1500, 1813, 1502],
              "text": "time"
            },
            {
              "boundingBox": [2219, 1261, 2510, 1260, 2511, 1498, 2220, 1500],
              "text": "we"
            },
            {
              "boundingBox": [2551, 1260, 3016, 1258, 3017, 1496, 2552, 1498],
              "text": "fall"
            }
          ]
        },
        {
          "boundingBox": [1612, 903, 2744, 935, 2738, 1139, 1607, 1107],
          "text": "in never failing ,",
          "words": [
            {
              "boundingBox": [1611, 934, 1707, 933, 1708, 1147, 1613, 1147],
              "text": "in"
            },
            {
              "boundingBox": [1753, 933, 2132, 930, 2133, 1144, 1754, 1146],
              "text": "never"
            },
            {
              "boundingBox": [2162, 930, 2673, 927, 2674, 1140, 2164, 1144],
              "text": "failing"
            },
            {
              "boundingBox": [2703, 926, 2788, 926, 2790, 1139, 2705, 1140],
              "text": ",",
              "confidence": "Low"
            }
          ]
        }
      ]
    }
  ]
}
```

## Clean up resources

When no longer needed, delete the Java project, including the compiled class and imported libraries.

## Next steps

Explore a Java Swing application that uses Computer Vision to perform optical character recognition (OCR); create smart-cropped thumbnails; plus detect, categorize, tag, and describe visual features, including faces, in an image. To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Computer Vision API Java Tutorial](../Tutorials/java-tutorial.md)
