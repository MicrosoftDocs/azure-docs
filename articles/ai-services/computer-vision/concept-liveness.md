---
title: Face liveness detection - Azure AI Vision
titleSuffix: Azure AI services
description: Learn concepts related to the tbd
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 10/11/2023
ms.author: pafarley
ms.custom: 
---

# Face liveness detection

Azure AI Vision supports liveness detection in Switch/Obj-C for iOS development and Java/Kotlin for Android development. It combines edge computation with the Face cloud service enabling:

- **Best-in-class end user experience**: The SDK enables devices to perform low-latency, high-accuracy recognition, recognizing a face as soon as the user looks at the camera.
- **Faster and easier video integration**: The customer can feed video directly to SDK without having to write frame sampling logic or logic for detecting faces that appear in the video.
- **Security with liveness anti-spoofing**: Biometric data is in secure Azure storage, so the developer does not have to worry about building secure storage or preventing data breaches. No images are saved. We're also introducing passive liveness detection in the Vision SDK to help developers distinguish between real people and spoofs, to prevent counterfeiters who use masks, photos, and videos from getting around identity verification. A liveness score is returned as an attribute of a face that is identified, so the developer can easily write logic to both check for face liveness and verify the face's identity.
- **Responsible AI**: To prevent face matching without the user's awareness, the SDK has a technical control to make sure the person is looking at the camera before any image is sent to the service for recognition.

## Examples

The following example demonstrates the JSON response returned by tbd


```json
tbd
```


## Use the API

The face detection feature is part of the [Analyze Image 3.2](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Faces` in the **visualFeatures** query parameter. Then, when you get the full JSON response, simply parse the string for the contents of the `"faces"` section.

* [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
