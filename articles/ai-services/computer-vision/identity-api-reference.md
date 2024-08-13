---
title: API Reference - Face
titleSuffix: Azure AI services
description: API reference provides information about the Person, LargePersonGroup/PersonGroup, LargeFaceList/FaceList, and Face Algorithms APIs.
#services: cognitive-services
author: nitinme
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: reference
ms.date: 02/17/2021
ms.author: nitinme
---

# Face API reference list

Azure AI Face is a cloud-based service that provides algorithms for face detection and recognition. The Face APIs comprise the following categories:

- Face Algorithm APIs: Cover core functions such as [Detection](/rest/api/face/face-detection-operations/detect), [Find Similar](/rest/api/face/face-recognition-operations/find-similar-from-large-face-list), [Verification](/rest/api/face/face-recognition-operations/verify-face-to-face), [Identification](/rest/api/face/face-recognition-operations/identify-from-large-person-group), and [Group](/rest/api/face/face-recognition-operations/group).
- [DetectLiveness session APIs](/rest/api/face/liveness-session-operations): Used to create and manage a Liveness Detection session. See the [Liveness Detection](/azure/ai-services/computer-vision/tutorials/liveness) tutorial.
- [FaceList APIs](/rest/api/face/face-list-operations): Used to manage a FaceList for [Find Similar From Face List](/rest/api/face/face-recognition-operations/find-similar-from-face-list).
- [LargeFaceList APIs](/rest/api/face/face-list-operations): Used to manage a LargeFaceList for [Find Similar From Large Face List](/rest/api/face/face-recognition-operations/find-similar-from-large-face-list).
- [PersonGroup APIs](/rest/api/face/person-group-operations): Used to manage a PersonGroup dataset for [Identification From Person Group](/rest/api/face/face-recognition-operations/identify-from-person-group).
- [LargePersonGroup APIs](/rest/api/face/person-group-operations): Used to manage a LargePersonGroup dataset for [Identification From Large Person Group](/rest/api/face/face-recognition-operations/identify-from-large-person-group).
- [PersonDirectory APIs](/rest/api/face/person-directory-operations): Used to manage a PersonDirectory dataset for [Identification From Person Directory](/rest/api/face/face-recognition-operations/identify-from-person-directory) or [Identification From Dynamic Person Group](/rest/api/face/face-recognition-operations/identify-from-dynamic-person-group).
- [Face API error codes](./reference-face-error-codes.md): A list of all error codes returned by the Face API operations.
