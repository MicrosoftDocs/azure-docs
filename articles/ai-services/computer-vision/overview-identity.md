---
title: What is the Azure AI Face service?
titleSuffix: Azure AI services
description: The Azure AI Face service provides AI algorithms that you use to detect, recognize, and analyze human faces in images.
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: overview
ms.date: 07/04/2023
ms.author: pafarley
ms.custom: cog-serv-seo-aug-2020
keywords: facial recognition, facial recognition software, facial analysis, face matching, face recognition app, face search by image, facial recognition search
#Customer intent: As the developer of an app that deals with images of humans, I want to learn what the Face service does so I can determine if I should use its features.
---

# What is the Azure AI Face service?

> [!WARNING]
> On June 11, 2020, Microsoft announced that it will not sell facial recognition technology to police departments in the United States until strong regulation, grounded in human rights, has been enacted. As such, customers may not use facial recognition features or functionality included in Azure Services, such as Face or Video Indexer, if a customer is, or is allowing use of such services by or for, a police department in the United States. When you create a new Face resource, you must acknowledge and agree in the Azure Portal that you will not use the service by or for a police department in the United States and that you have reviewed the Responsible AI documentation and will use this service in accordance with it.

[!INCLUDE [GDPR-related guidance](./includes/identity-data-notice.md)]
[!INCLUDE [Gate notice](./includes/identity-gate-notice.md)]

The Azure AI Face service provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as identification, touchless access control, and face blurring for privacy.

You can use the Face service through a client library SDK or by calling the REST API directly. Follow the quickstart to get started.

> [!div class="nextstepaction"]
> [Quickstart](quickstarts-sdk/identity-client-library.md)

Or, you can try out the capabilities of Face service quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio for Face](https://portal.vision.cognitive.azure.com/gallery/face)

This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/identity-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-to/identity-detect-faces.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](./concept-face-detection.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./enrollment-overview.md) are longer guides that show you how to use this service as a component in broader business solutions.

For a more structured approach, follow a Training module for Face.
* [Detect and analyze faces with the Face service](/training/modules/detect-analyze-faces/)

## Example use cases

**Verify user identity**: Verify a person against a trusted face image. This verification could be used to grant access to digital or physical properties, such as a bank account, access to a building, and so on. In most cases, the trusted face image could come from a government-issued ID such as a passport or driver’s license, or it could come from an enrollment photo taken in person. During verification, liveness detection can play a critical role in verifying that the image comes from a real person, not a printed photo or mask. For more details on verification with liveness, see the [liveness tutorial](./Tutorials/liveness.md). For identity verification without liveness, follow the [quickstart](./quickstarts-sdk/identity-client-library.md).

**Liveness detection**: Liveness detection is an anti-spoofing feature that checks whether a user is physically present in front of the camera. It's used to prevent spoofing attacks using a printed photo, video, or a 3D mask of the user's face. [Verify with liveness](use-case-verify-with-liveness.md)

**Touchless access control**: Compared to today’s methods like cards or tickets, opt-in face identification enables an enhanced access control experience while reducing the hygiene and security risks from card sharing, loss, or theft. Facial recognition assists the check-in process with a human in the loop for check-ins in airports, stadiums, theme parks, buildings, reception kiosks at offices, hospitals, gyms, clubs, or schools.

**Face redaction**: Redact or blur detected faces of people recorded in a video to protect their privacy.


## Face detection and analysis

Face detection is required as a first step in all the other scenarios. The Detect API detects human faces in an image and returns the rectangle coordinates of their locations. It also returns a unique ID that represents the stored face data. This is used in later operations to identify or verify faces.

Optionally, face detection can extract a set of face-related attributes, such as head pose, age, emotion, facial hair, and glasses. These attributes are general predictions, not actual classifications. Some attributes are useful to ensure that your application is getting high-quality face data when users add themselves to a Face service. For example, your application could advise users to take off their sunglasses if they're wearing sunglasses.

[!INCLUDE [Sensitive attributes notice](./includes/identity-sensitive-attributes.md)]

For more information on face detection and analysis, see the [Face detection](concept-face-detection.md) concepts article. Also see the [Detect API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) reference documentation.

You can try out Face detection quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio for Face](https://portal.vision.cognitive.azure.com/gallery/face)

## Liveness detection

[!INCLUDE [liveness-sdk-gate](./includes/liveness-sdk-gate.md)]

Face Liveness detection can be used to determine if a face in an input video stream is real (live) or fake (spoof). This is a crucial building block in a biometric authentication system to prevent spoofing attacks from imposters trying to gain access to the system using a photograph, video, mask, or other means to impersonate another person.

The goal of liveness detection is to ensure that the system is interacting with a physically present live person at the time of authentication. Such systems have become increasingly important with the rise of digital finance, remote access control, and online identity verification processes.

The liveness detection solution successfully defends against a variety of spoof types ranging from paper printouts, 2d/3d masks, and spoof presentations on phones and laptops. Liveness detection is an active area of research, with continuous improvements being made to counteract increasingly sophisticated spoofing attacks over time. Continuous improvements will be rolled out to the client and the service components over time as the overall solution gets more robust to new types of attacks.

Our liveness detection solution meets iBeta Level 1 and 2 ISO/IEC 30107-3 compliance.

Tutorial
- [Face liveness Tutorial](Tutorials/liveness.md)
Concepts
- [Abuse monitoring](concept-liveness-abuse-monitoring.md)

Face liveness SDK reference docs:
- (Java (Android))[https://aka.ms/liveness-sdk-java]
- (Swift (iOS))[https://aka.ms/liveness-sdk-ios]

## Face recognition

Modern enterprises and apps can use the Face recognition technologies, including Face verification ("one-to-one" matching) and Face identification ("one-to-many" matching) to confirm that a user is who they claim to be.

### Identification

Face identification can address "one-to-many" matching of one face in an image to a set of faces in a secure repository. Match candidates are returned based on how closely their face data matches the query face. This scenario is used in granting building or airport access to a certain group of people or verifying the user of a device.

The following image shows an example of a database named `"myfriends"`. Each group can contain up to 1 million different person objects. Each person object can have up to 248 faces registered.

![A grid with three columns for different people, each with three rows of face images](./media/person.group.clare.jpg)

After you create and train a group, you can do identification against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

### Verification

The verification operation answers the question, "Do these two faces belong to the same person?". 

Verification is also a "one-to-one" matching of a face in an image to a single face from a secure repository or photo to verify that they're the same individual. Verification can be used for access control, such as a banking app that enables users to open a credit account remotely by taking a new picture of themselves and sending it with a picture of their photo ID. It can also be used as a final check on the results of an Identification API call.

For more information about Face recognition, see the [Facial recognition](concept-face-recognition.md) concepts guide or the [Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) and [Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) API reference documentation.


## Find similar faces

The Find Similar operation does face matching between a target face and a set of candidate faces, finding a smaller set of faces that look similar to the target face. This is useful for doing a face search by image. 

The service supports two working modes, **matchPerson** and **matchFace**. The **matchPerson** mode returns similar faces after filtering for the same person by using the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a). The **matchFace** mode ignores the same-person filter. It returns a list of similar candidate faces that may or may not belong to the same person.

The following example shows the target face:

![A woman smiling](./media/FaceFindSimilar.QueryFace.jpg)

And these images are the candidate faces:

![Five images of people smiling. Images A and B show the same person.](./media/FaceFindSimilar.Candidates.jpg)

To find four similar faces, the **matchPerson** mode returns A and B, which show the same person as the target face. The **matchFace** mode returns A, B, C, and D, which is exactly four candidates, even if some aren't the same person as the target or have low similarity. For more information, see the [Facial recognition](concept-face-recognition.md) concepts guide or the [Find Similar API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) reference documentation.

## Group faces

The Group operation divides a set of unknown faces into several smaller groups based on similarity. Each group is a disjoint proper subset of the original set of faces. It also returns a single "messyGroup" array that contains the face IDs for which no similarities were found.

All of the faces in a returned group are likely to belong to the same person, but there can be several different groups for a single person. Those groups are differentiated by another factor, such as expression, for example. For more information, see the [Facial recognition](concept-face-recognition.md) concepts guide or the [Group API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238) reference documentation.

## Input requirements

General image input requirements:
[!INCLUDE [identity-input-technical](includes/identity-input-technical.md)]

Input requirements for face detection:
[!INCLUDE [identity-input-detection](includes/identity-input-detection.md)]

Input requirements for face recognition:
[!INCLUDE [identity-input-composition](includes/identity-input-composition.md)]


## Data privacy and security

As with all of the Azure AI services resources, developers who use the Face service must be aware of Microsoft's policies on customer data. For more information, see the [Azure AI services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center.

## Next steps

Follow a quickstart to code the basic components of a face recognition app in the language of your choice.

- [Face quickstart](quickstarts-sdk/identity-client-library.md)
