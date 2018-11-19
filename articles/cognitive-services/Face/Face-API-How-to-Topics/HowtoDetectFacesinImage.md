---
title: "Example: Detect faces in images - Face API"
titleSuffix: Azure Cognitive Services
description: Use the Face API to detect faces in images.
services: cognitive-services
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: sample
ms.date: 03/01/2018
ms.author: sbowles
---

# Example: How to Detect Faces in Image

This guide will demonstrate how to detect faces from an image, with face attributes like gender, age, or pose extracted. The samples are written in C# using the Face API client library. 

## Concepts

If you are not familiar with any of the following concepts in this guide, please refer to the definitions in our [Glossary](../Glossary.md) at any time: 

- Face detection
- Face landmarks
- Head pose
- Face attributes

## Preparation

In this sample, we will demonstrate the following features: 

- Detecting faces from an image, and marking them using rectangular framing
- Analyzing the locations of pupils, the nose or mouth, and then marking them in the image
- Analyzing the head pose, gender and age of the face

In order to execute these features, you will need to prepare an image with at least one clear face. 

## Step 1: Authorize the API call

Every call to the Face API requires a subscription key. This key needs to be either passed through a query string parameter, or specified in the request header. To pass the subscription key through query string, please refer to the request URL for the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) as an example:

```
https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes]
&subscription-key=<Subscription Key>
```

As an alternative, the subscription key can also be specified in the HTTP request header: **ocp-apim-subscription-key: &lt;Subscription Key&gt;**
When using a client library, the subscription key is passed in through the constructor of the FaceServiceClient class. For example:
```CSharp
faceServiceClient = new FaceServiceClient("<Subscription Key>");
```

## Step 2: Upload an image to the service and execute face detection

The most basic way to perform face detection is by uploading an image directly. This is done by sending a "POST" request with application/octet-stream content type, with the data read from a JPEG image. The maximum size of the image is 4 MB.

Using the client library, face detection by means of uploading is done by passing in a Stream object. See the example below:

```CSharp
using (Stream s = File.OpenRead(@"D:\MyPictures\image1.jpg"))
{
    var faces = await faceServiceClient.DetectAsync(s, true, true);
 
    foreach (var face in faces)
    {
        var rect = face.FaceRectangle;
        var landmarks = face.FaceLandmarks;
    }
}
```

Note that the DetectAsync method of FaceServiceClient is async. The calling method should be marked as async as well, in order to use the await clause.
If the image is already on the web and has a URL, face detection can be executed by also providing the URL. In this example, the request body will be a JSON string, which contains the URL.
Using the client library, face detection by means of a URL can be executed easily using another overload of the DetectAsync method.

```CSharp
string imageUrl = "http://news.microsoft.com/ceo/assets/photos/06_web.jpg";
var faces = await faceServiceClient.DetectAsync(imageUrl, true, true);
 
foreach (var face in faces)
{
    var rect = face.FaceRectangle;
    var landmarks = face.FaceLandmarks;
}
``` 

The FaceRectangle property that is returned with detected faces is essentially locations on the face in pixels. Usually, this rectangle contains the eyes, eyebrows, the nose, and the mouth –the top of head, ears, and the chin are not included. If you crop a complete head or mid-shot portrait (a photo ID type image), you may want to expand the area of the rectangular face frame because the area of the face may be too small for some applications. To locate a face more precisely, using face landmarks (locate face features or face direction mechanisms) described in the next section will prove to be useful.

## Step 3: Understanding and using face landmarks

Face landmarks are a series of detailed points on a face; typically points of face components like the pupils, canthus, or nose. Face landmarks are optional attributes that can be analyzed during face detection. You can either pass 'true' as a Boolean value to the returnFaceLandmarks query parameter when calling the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), or use the returnFaceLandmarks optional parameter for the FaceServiceClient class DetectAsync method in order to include the face landmarks in the detection results.

By default, there are 27 predefined landmark points. The following figure shows how all 27 points are defined:

![HowToDetectFace](../Images/landmarks.1.jpg)

The points returned are in units of pixels, just like the face rectangular frame. Therefore making it easier to mark specific points of interest in the image. The following code demonstrates retrieving the locations of the nose and pupils:

```CSharp
var faces = await faceServiceClient.DetectAsync(imageUrl, returnFaceLandmarks:true);
 
foreach (var face in faces)
{
    var rect = face.FaceRectangle;
    var landmarks = face.FaceLandmarks;
 
    double noseX = landmarks.NoseTip.X;
    double noseY = landmarks.NoseTip.Y;
 
    double leftPupilX = landmarks.PupilLeft.X;
    double leftPupilY = landmarks.PupilLeft.Y;
 
    double rightPupilX = landmarks.PupilRight.X;
    double rightPupilY = landmarks.PupilRight.Y;
}
``` 

In addition to marking face features in an image, face landmarks can also be used to accurately calculate the direction of the face. For example, we can define the direction of the face as a vector from the center of the mouth to the center of the eyes. The code below explains this in detail:

```CSharp
var landmarks = face.FaceLandmarks;
 
var upperLipBottom = landmarks.UpperLipBottom;
var underLipTop = landmarks.UnderLipTop;
 
var centerOfMouth = new Point(
    (upperLipBottom.X + underLipTop.X) / 2,
    (upperLipBottom.Y + underLipTop.Y) / 2);
 
var eyeLeftInner = landmarks.EyeLeftInner;
var eyeRightInner = landmarks.EyeRightInner;
 
var centerOfTwoEyes = new Point(
    (eyeLeftInner.X + eyeRightInner.X) / 2,
    (eyeLeftInner.Y + eyeRightInner.Y) / 2);
 
Vector faceDirection = new Vector(
    centerOfTwoEyes.X - centerOfMouth.X,
    centerOfTwoEyes.Y - centerOfMouth.Y);
``` 

By knowing the direction that the face is in, you can then rotate the rectangular face frame to align it with the face. It is clear that using face landmarks can provide more detail and utility.

## Step 4: Using other face attributes

Besides face landmarks, Face – Detect API can also analyze several other attributes on a face. These attributes include:

- Age
- Gender
- Smile intensity
- Facial hair
- A 3D head pose

These attributes are predicted by using statistical algorithms and may not always be 100% precise. However, they are still helpful when you want to classify faces by these attributes. For more information about each of the attributes, please refer to the [Glossary](../Glossary.md).

Below is a simple example of extracting face attributes during face detection:

```CSharp
var requiredFaceAttributes = new FaceAttributeType[] {
                FaceAttributeType.Age,
                FaceAttributeType.Gender,
                FaceAttributeType.Smile,
                FaceAttributeType.FacialHair,
                FaceAttributeType.HeadPose,
                FaceAttributeType.Glasses
            };
var faces = await faceServiceClient.DetectAsync(imageUrl,
    returnFaceLandmarks: true,
    returnFaceAttributes: requiredFaceAttributes);

foreach (var face in faces)
{
    var id = face.FaceId;
    var attributes = face.FaceAttributes;
    var age = attributes.Age;
    var gender = attributes.Gender;
    var smile = attributes.Smile;
    var facialHair = attributes.FacialHair;
    var headPose = attributes.HeadPose;
    var glasses = attributes.Glasses;
}
``` 

## Summary

In this guide you have learned the functionalities of [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API, how it can detect faces for local uploaded images or image URLs on the web; how it can detect faces by returning rectangular face frames; and how it can also analyze face landmarks, 3D head poses and other face attributes as well.

For more information about API details, please refer to the API reference guide for [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Related Topics

[How to Identify Faces in Image](HowtoIdentifyFacesinImage.md)
