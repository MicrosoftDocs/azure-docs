---
title: Face liveness detection - Azure AI Vision
titleSuffix: Azure AI services
description: Learn concepts related to the Face liveness detection feature in Azure AI Vision.
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

[!INCLUDE [liveness-sdk-gate](../includes/liveness-sdk-gate.md)]

Azure AI Vision supports liveness detection in Switch/Obj-C for iOS development and Java/Kotlin for Android development. It combines edge computation with the Face cloud service enabling:

- **Best-in-class end user experience**: The SDK enables devices to perform low-latency, high-accuracy recognition, recognizing a face as soon as the user looks at the camera.
- **Faster and easier video integration**: The customer can feed video directly to SDK without having to write frame sampling logic or logic for detecting faces that appear in the video.
- **Security with liveness anti-spoofing**: Biometric data is in secure Azure storage, so the developer does not have to worry about building secure storage or preventing data breaches. No images are saved. We're also introducing passive liveness detection in the Vision SDK to help developers distinguish between real people and spoofs, to prevent counterfeiters who use masks, photos, and videos from getting around the verification process. A liveness score is returned as an attribute of a face that is identified, so the developer can easily write logic to both check for face liveness and verify the user.
- **Responsible AI**: To prevent face matching without the user's awareness, the SDK has a technical control to make sure the person is looking at the camera before any image is sent to the service for recognition.

## Passive liveness detection

Passive liveness detection is suitable for most scenarios with no additional action needed from the user. The model analyzes the background/periphery of the input image to check that it is not fixed. Also, the SDK can change the color of the user's device screen and analyze how the lighting changes are reflected on their face.

Passive liveness detection requires normal indoor lighting and high screen brightness for optimal performance.​

## Accessibility

tbd

## Abuse monitoring

See the [Abuse monitoring guide](./concept-identity-abuse-monitoring.md) for information on how the Face service detects and responds to liveness spoofing.


## Next steps

Follow the tutorial to set up a working software solution that combines server-side and client-side logic to do face liveness detection on users.

* [Tutorial: Detect face liveness](./Tutorials/liveness.md)