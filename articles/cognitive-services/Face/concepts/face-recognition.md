---
title: "Face recognition concepts"
titleSuffix: Azure Cognitive Services
description: Learn concepts about face recognition.
services: cognitive-services
author: PatrickFarley
manager: nitime

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/18/2019
ms.author: pafarley
---

# Face recognition concepts

This article explains the concepts of the various face recognition operations (verification, find similar, grouping, identification) and the underlying data structures. Broadly, recognition describes the work of comparing two different faces to determine if they are similar or belong to the same person.

## Recognition-related data structures

The ID must be unique within the subscription. name can be duplicated

**Face**
denoted by ID. Deleted after 24 hours

**PersistedFace**
Like DetectedFace, but they become permanent once they're added to a group.

**FaceList**/**LargeFaceList**
an assorted list of PersistedFace objects.
ID, name, userdata
must be trained first to optimize performance

**Person**
denoted by ID. name, userdata
a list of PersistedFace objects that belong to the same person

**PersonGroup**/**LargePersonGroup**
a list of person objects. PersonID cannot be duplicated, but name can.
ID, Name, userdata
must be trained before other operations

**Candidate**
Candidates are essentially [identification](#identification) results (e.g. identified persons and level of confidence in detections). A candidate is represented by the [PersonID](#person-id) and [confidence](#confidence), indicating that the person is identified with a high level of confidence.

Not real data types: just lists of IDs
group
messygroup

## Recognition operations

This section details what the four recognition operations do with the above data structures. See the [Overview](../Overview.md) for a description of each recognition operation.

### Verification

### Find similar

### Grouping

### Identification

## Input data

Use the following tips to ensure your input images give the most accurate recognition results:

* The supported input image formats are JPEG, PNG, GIF(the first frame), BMP.
* Image file size should be no larger than 4 MB.
* You should train your **Person**s with photos that feature a variety of angles and lighting.
* Some faces may not be recognized because of technical challenges:
  * Images with extreme lighting (for example, severe backlighting).
  * Obstructions blocking one or both eyes.
  * Differences in hair style or facial hair.
  * Changes in face appearance due to age.
  * Extreme facial expressions.

## Next steps

Now that you are familiar with face recognition concepts, learn how to write a simple script that identifies faces against a trained **PersonGroup**.

* [How to identify faces in images](../Face-API-How-to-Topics/HowtoIdentifyFacesinImage.md)