---
title: Face API Java quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Face API with Java in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 05/23/2017
ms.author: anroth
---

# Face API Java Quick Starts
This article provides information and code samples to help you quickly get started using the Face API with Java to accomplish the following tasks: 
* [Detect Faces in Images](#Detect) 
* [Create a Person Group](#Create)

## Prerequisites
* Get the Microsoft Face API Android SDK [here](https://github.com/Microsoft/Cognitive-face-android)
* Learn more about obtaining free subscription keys [here](../../Computer-vision/Vision-API-How-to-Topics/HowToSubscribe.md)

## Detect Faces in Images with Face API Using Java <a name="Detect"> </a>
Use the [Face - Detect method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) 
to detect faces in an image and return face attributes including:
* Face ID: Unique ID used in a number of Face API scenarios. 
* Face Rectangle: The left, top, width, and height indicating the location of the face in the image.
* Landmarks: An array of 27-point face landmarks pointing to the important positions of face components.
* Facial attributes including age, gender, smile intensity, head pose, and facial hair. 

#### Face Detect Java Example Request

Change the REST URL to use the location where you obtained your subscription keys, change the request body `url` to the location of an image, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key.

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

public class Main
{
    public static void main(String[] args)
    {
        HttpClient httpClient = new DefaultHttpClient();

        try
        {
            // NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            URIBuilder uriBuilder = new URIBuilder("https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect");

            uriBuilder.setParameter("returnFaceId", "true");
            uriBuilder.setParameter("returnFaceLandmarks", "false");
            uriBuilder.setParameter("returnFaceAttributes", "age");

            URI uri = uriBuilder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers. Replace the example key below with your valid subscription key.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Request body. Replace the example URL below with the URL of the image you want to analyze.
            StringEntity reqEntity = new StringEntity("{\"url\":\"http://example.com/1.jpg\"}");
            request.setEntity(reqEntity);

            HttpResponse response = httpClient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null)
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```

#### Face - Detect Response
A successful response will be returned in JSON. The following is an example of a successful response: 

```json
[
    {
        "faceId": "c5c24a82-6845-4031-9d5d-978df9175426",
        "faceRectangle": {
            "width": 78,
            "height": 78,
            "left": 394,
            "top": 54
        },
        "faceLandmarks": {
            "pupilLeft": {
                "x": 412.7,
                "y": 78.4 
            },
            "pupilRight": {
                "x": 446.8,
                "y": 74.2 
            },
            "noseTip": {
                "x": 437.7,
                "y": 92.4 
            },
            "mouthLeft": {
                "x": 417.8,
                "y": 114.4 
            },
            "mouthRight": {
                "x": 451.3,
                "y": 109.3 
            },
            "eyebrowLeftOuter": {
                "x": 397.9,
                "y": 78.5 
            },
            "eyebrowLeftInner": {
                "x": 425.4,
                "y": 70.5 
            },
            "eyeLeftOuter": {
                "x": 406.7,
                "y": 80.6 
            },
            "eyeLeftTop": {
                "x": 412.2,
                "y": 76.2 
            },
            "eyeLeftBottom": {
                "x": 413.0,
                "y": 80.1 
            },
            "eyeLeftInner": {
                "x": 418.9,
                "y": 78.0 
            },
            "eyebrowRightInner": {
                "x": 4.8,
                "y": 69.7 
            },
            "eyebrowRightOuter": {
                "x": 5.5,
                "y": 68.5 
            },
            "eyeRightInner": {
                "x": 441.5,
                "y": 75.0 
            },
            "eyeRightTop": {
                "x": 446.4,
                "y": 71.7 
            },
            "eyeRightBottom": {
                "x": 447.0,
                "y": 75.3 
            },
            "eyeRightOuter": {
                "x": 451.7,
                "y": 73.4 
            },
            "noseRootLeft": {
                "x": 428.0,
                "y": 77.1 
            },
            "noseRootRight": {
                "x": 435.8,
                "y": 75.6 
            },
            "noseLeftAlarTop": {
                "x": 428.3,
                "y": 89.7 
            },
            "noseRightAlarTop": {
                "x": 442.2,
                "y": 87.0 
            },
            "noseLeftAlarOutTip": {
                "x": 424.3,
                "y": 96.4 
            },
            "noseRightAlarOutTip": {
                "x": 446.6,
                "y": 92.5 
            },
            "upperLipTop": {
                "x": 437.6,
                "y": 105.9 
            },
            "upperLipBottom": {
                "x": 437.6,
                "y": 108.2 
            },
            "underLipTop": {
                "x": 436.8,
                "y": 111.4 
            },
            "underLipBottom": {
                "x": 437.3,
                "y": 114.5 
            }
        },
        "faceAttributes": {
            "age": 71.0,
            "gender": "male",
            "smile": 0.88,
            "facialHair": {
                "mustache": 0.8,
                "beard": 0.1,
                "sideburns": 0.02
            },
            "glasses": "sunglasses",
            "headPose": {
                "roll": 2.1,
                "yaw": 3,
                "pitch": 0
            }
        }
    }
]
```
## Create a Person Group with Face API Using Java <a name="Create"> </a>
Use the [Person Group - Create a Person Group method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) 
to create a new person group with specified personGroupId, name, and user-provided userData. A person group is one of the most important parameters for the Face - Identify API. The Identify API searches for persons' faces in a specified person group.

#### Person Group - Create a Person Group Example

Change the REST URL to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key.

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

public class Main
{
    public static void main(String[] args)
    {
        HttpClient httpClient = new DefaultHttpClient();

        try
        {
            // The valid characters for the ID below include numbers, English letters in lower case, '-', and '_'.
            // The maximum length of the personGroupId is 64.
            String personGroupId = "example-group-00";

            // NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            URIBuilder builder = new URIBuilder("https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/" +
                                                personGroupId);

            URI uri = builder.build();
            HttpPut request = new HttpPut(uri);

            // Request headers. Replace the example key with your valid subscription key.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Request body. The name field is the display name you want for the group (must be under 128 characters).
            // The size limit for what you want to include in the userData field is 16KB.
            String body = "{ \"name\":\"My Group\",\"userData\":\"User-provided data attached to the person group.\" }";

            StringEntity reqEntity = new StringEntity(body);
            request.setEntity(reqEntity);

            HttpResponse response = httpClient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null)
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```
