---
title: "Detect faces in an image - Face API"
titleSuffix: Azure Cognitive Services
description: Learn how to use the various data returned by the face detection feature.
services: cognitive-services
author: SteveMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: sbowles
---

# Get face detection data

This guide will demonstrate how to use face detection to extract attributes like gender, age, or pose from a given image. The code snippets in this guide are written in C# using the Face API client library.

This guide will show you how to:

- Get the locations and dimensions of faces in an image.
- Get the locations of various face landmarks (pupils, nose, mouth, and so on) in an image.
- Analyze the head pose of a detected face.
- Guess the gender, age, and emotion of a detected face.

## next

This guide assumes you have already constructed a **[FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet)** object, `faceClient`, with a Face subscription key and endpoint URL. From there, you can use the face detection feature by calling either **[DetectWithUrlAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithurlasync?view=azure-dotnet)** or **[DetectWithStreamAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithstreamasync?view=azure-dotnet)**. See the [Detect Faces quickstart for C#](../quickstarts/csharp-detect-sdk.md) for instructions on how to set this up. This guide will focus on the specifics of that method call&mdash;which arguments you can pass and what you can do with the returned data.


TBD 
## Upload image to the service and execute face detection

```csharp
var faces = await faceClient.Face.DetectWithStreamAsync(imageFileStream, true, false, faceAttributes);

foreach (var face in faces)
{
    var rect = face.FaceRectangle;
    var landmarks = face.FaceLandmarks;
}
```

Note that the DetectAsync method of FaceServiceClient is async. The calling method should be marked as async as well, in order to use the await clause.
If the image is already on the web and has a URL, face detection can be executed by also providing the URL. In this example, the request body will be a JSON string, which contains the URL.
Using the client library, face detection by means of a URL can be executed easily using another overload of the DetectAsync method.

```CSharp
var faces = await faceServiceClient.DetectWithUrlAsync(imageUrl, true, true);
 
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
- Glasses
- A 3D head pose
- Emotion

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
