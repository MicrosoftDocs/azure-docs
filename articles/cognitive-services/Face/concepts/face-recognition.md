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
ms.date: 04/10/2019
ms.author: pafarley
---

# Face recognition concepts

This article explains the concepts of the various face recognition operations (verification, find similar, grouping, identification) and the data structures involved. See the [Overview](../Overview.md) for a description of each operation.

## Face API data structures

### FaceLists

A FaceList is a collection of [PersistedFace](#persistedface) objects and is the unit of [Find Similar](#find-similar). A FaceList comes with a [FaceList ID](#facelist-id), as well as other attributes such as Name and User Data.

The ID must be unique within the subscription.

#### Person

Person is a data structure managed in Face API. Person comes with a [Person ID](#person-id), as well as other attributes such as Name, a collection of [PersistedFace](#persistedface), and User Data.
Person ID is generated when a [Person](#person) is created successfully. A string is created to represent this person in [Face API](#face-api).
Name is a user-friendly descriptive string for [Person](#person). Unlike the [Person ID](#person-id), the name of people can be duplicated within a group

#### PersonGroup

PersonGroup is a collection of [Persons](#person) and is the unit of [Identification](#identification). A PersonGroup comes with a [PersonGroup ID](#persongroup-id), as well as other attributes such as Name and User Data.

## identification
Identification is to identify one or more faces from a LargePersonGroup/PersonGroup.
A [PersonGroup](#persongroup)/[LargePersonGroup](#largepersongroup) is a collection of [Persons](#person).
Faces and the LargePersonGroup/PersonGroup are represented by [face IDs](#face-id) and
[LargePersonGroup IDs](#largepersongroup-id)/[PersonGroup IDs](#persongroup-id) respectively in the request.
Identified results are [candidates](#candidate), represented by [Persons](#person) with confidence.
Multiple faces in the input are considered separately, and each face will have its own identified result.

> [!NOTE]
> The LargePersonGroup/PersonGroup should be trained successfully before identification. If the LargePersonGroup/PersonGroup is not trained, or the training [status](#status-train) is not shown as 'succeeded' (i.e. 'running', 'failed', or 'timeout'), the request response is 400.

#### UserData/User Data

User data is extra information associated with [Person](#person) and [PersonGroup](#persongroup)/[LargePersonGroup](#largepersongroup). User data is set by users to make data easier to use, understand and remember.

## training
This API is used to pre-process the [LargeFaceList](#largefacelist)/[LargePersonGroup](#largepersongroup)/[PersonGroup](#persongroup) to ensure the [Find Similar](#find-similar)/[Identification](#identification) performance. If the training is not operated, or the [Training Status](#status-train) is not shown as succeeded, the identification for this PersonGroup will result in failure

#### Status (Train)

Status is a string used to describe the procedure for Training LargeFaceList/LargePersonGroups/PersonGroups, including 'notstarted', 'running', 'succeeded', 'failed'.

## Groups 

#### Grouping

Face grouping is the grouping of a collection of faces according to facial similarities. Face collections are indicated by the face ID collections in the request. As a result of grouping, similar faces are grouped together as [groups](#groups), and faces that are not similar to any other face are merged together as a messy group. There is at the most, one [messy group](#messy-group) in the grouping result.

For more information, see the reference documentation:
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

#### Groups

Groups are derived from the [grouping](#grouping) results. Each group contains a collection of similar faces, where faces are indicated by [face IDs](#face-id).

#### Messy group

Messy group is derived from the [grouping](#grouping) results; which contains faces not similar to any other face. Each face in a messy group is indicated by the [face ID](#face-id).

## Verification

This API is used to verify whether two faces are the same or not. Both faces are represented as face IDs in the request. Verified results contain a Boolean field (isIdentical) indicating same if true and a number field ([confidence](#confidence)) indicating the level of confidence.

## Comparisons

#### Candidate

Candidates are essentially [identification](#identification) results (e.g. identified persons and level of confidence in detections). A candidate is represented by the [PersonID](#person-id) and [confidence](#confidence), indicating that the person is identified with a high level of confidence.

For more information, see the reference documentation:
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

#### Confidence

Confidence is a measurement revealing the similarity between [faces](#face) or [Person](#person) in numerical values –which is used in [identification](#identification), and [verification](#verification) to indicate the similarities of searched, identified and verified results.


**Question**: What factors can reduce Face API's accuracy for Recognition, Verification, or Find Similar?

**Answer**: Generally it is the same cases where humans have difficulty identifying someone including:
* Obstructions blocking one or both eyes
* Harsh lighting (for example, severe backlighting)
* Changes to hair style or facial hair
* Changes due to age
* Extreme facial expressions (for example, screaming)

Face API is often successful in challenging cases like the above, but accuracy can be reduced. To make recognition more robust and address these challenges, train your Persons with photos that include a diversity of angles and lighting.

## Links
For more information, see the reference documentation:
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acfc83a7b9412a4d53f3f),
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup Person - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ade043a7b9412a4d53f41),
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524a),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup Person - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395242).