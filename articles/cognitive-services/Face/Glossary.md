---
title: Glossary - Face API Service
titleSuffix: Azure Cognitive Services
description: The glossary explains terms that you might encounter as you work with the Face API Service.
services: cognitive-services
author: SteveMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 03/01/2018
ms.author: sbowles
---

# Glossary

## A

#### Attributes

Attributes are optional face features that can be detected, such as [age](#age-attribute), [gender](#gender-attribute), [head pose](#head-pose-attribute), [facial hair](#facial-hair-attribute), and [smile](#smile-attribute). They can be obtained from the detection API by specifying the _returnFaceAttributes_ query parameter.

For a full list of face attributes, refer to the reference documentation:
[Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### Age (Attribute)

Age is one of the [attributes](#attributes) that describes the age of a particular face. The age attribute is optional in the detection results, and can be controlled with a detection request by specifying the returnFaceAttributes parameter.

For more information, see the reference documentation:
[Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## C

#### Candidate

Candidates are essentially [identification](#identification) results (e.g. identified persons and level of confidence in detections). A candidate is represented by the [PersonID](#person-id) and [confidence](#confidence), indicating that the person is identified with a high level of confidence.

For more information, see the reference documentation:
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

#### Confidence

Confidence is a measurement revealing the similarity between [faces](#face) or [Person](#person) in numerical values –which is used in [identification](#identification), and [verification](#verification) to indicate the similarities of searched, identified and verified results.

For more information, see the reference documentation:
[Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237),
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239),
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

## D



## F


#### Face API

Face API is a cloud-based API that provides the most advanced algorithms for face detection and recognition. The main functionality of Face API can be divided into two categories: face detection with attributes, and face [recognition](#recognition).

For more information, see the reference documentation:
[Face API Overview](./Overview.md),
[Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236),
[Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237),
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238),
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239),
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).




#### FaceList

FaceList is a collection of [PersistedFace](#persistedface) and is the unit of [Find Similar](#find-similar). A FaceList comes with a [FaceList ID](#facelist-id), as well as other attributes such as Name and User Data.

For more information, see the reference documentation:
[FaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b),
[FaceList - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c).

#### FaceList ID

FaceList ID is a user provided string used as an identifier of a [FaceList](#facelist). The FaceList ID must be unique within the subscription.

For more information, see the reference documentation:
[FaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b),
[FaceList - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c).

#### Find Similar

This API is used to search/query similar faces based on a collection of faces. Query faces and face collections are represented as [face IDs](#face-id) or [FceList ID](#facelist-id)/[LargeFaceList ID](#largefacelist-id) in the request. Returned results are searched similar faces, represented by [face IDs](#face-id) or PersistedFace IDs.

For more information, see the reference documentation:
[Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237),
[LargeFaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc),
[FaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b).

## G



#### Grouping

Face grouping is the grouping of a collection of faces according to facial similarities. Face collections are indicated by the face ID collections in the request. As a result of grouping, similar faces are grouped together as [groups](#groups), and faces that are not similar to any other face are merged together as a messy group. There is at the most, one [messy group](#messy-group) in the grouping result.

For more information, see the reference documentation:
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

#### Groups

Groups are derived from the [grouping](#grouping) results. Each group contains a collection of similar faces, where faces are indicated by [face IDs](#face-id).

For more information, see the reference documentation:
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

## H



## I

#### Identification

Identification is to identify one or more faces from a LargePersonGroup/PersonGroup.
A [PersonGroup](#persongroup)/[LargePersonGroup](#largepersongroup) is a collection of [Persons](#person).
Faces and the LargePersonGroup/PersonGroup are represented by [face IDs](#face-id) and
[LargePersonGroup IDs](#largepersongroup-id)/[PersonGroup IDs](#persongroup-id) respectively in the request.
Identified results are [candidates](#candidate), represented by [Persons](#person) with confidence.
Multiple faces in the input are considered separately, and each face will have its own identified result.

> [!NOTE]
> The LargePersonGroup/PersonGroup should be trained successfully before identification. If the LargePersonGroup/PersonGroup is not trained, or the training [status](#status-train) is not shown as 'succeeded' (i.e. 'running', 'failed', or 'timeout'), the request response is 400.
> 

For more information, see the reference documentation:
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239),
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae2d16ac60f11b48b5aa4),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249).

#### IsIdentical

IsIdentical is a Boolean field of [verification](#verification) results indicating whether two faces belong to the same person.

For more information, see the reference documentation:
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).


#### LargeFaceList

LargeFaceList is a collection of [PersistedFace](#persistedface) and is the unit of [Find Similar](#find-similar). A LargeFaceList comes with a [LargeFaceList ID](#largefacelist-id), as well as other attributes such as Name and User Data.

For more information, see the reference documentation:
[LargeFaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc),
[LargeFaceList - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a15827cd2de3616c086f2ce),
[LargeFaceList - List Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158db4d2de3616c086f2d6).

#### LargeFaceList ID

LargeFaceList ID is a user provided string used as an identifier of a [LargeFaceList](#largefacelist). The LargeFaceList ID must be unique within the subscription.

For more information, see the reference documentation:
[LargeFaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc),
[LargeFaceList - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a15827cd2de3616c086f2ce).

#### LargePersonGroup

LargePersonGroup is a collection of [Persons](#person) and is the unit of [Identification](#identification). A LargePersonGroup comes with a [LargePersonGroup ID](#largepersongroup-id), as well as other attributes such as Name and User Data.

For more information, see the reference documentation:
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acebb6ac60f11b48b5a9e),
[LargePersonGroup Person - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adda06ac60f11b48b5aa1).

#### LargePersonGroup ID

LargePersonGroup ID is a user provided string used as an identifier of a [LargePersonGroup](#largepersongroup). The LargePersonGroup ID must be unique within the subscription.

For more information, see the reference documentation:
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acebb6ac60f11b48b5a9e).

## M

#### Messy group

Messy group is derived from the [grouping](#grouping) results; which contains faces not similar to any other face. Each face in a messy group is indicated by the [face ID](#face-id).

For more information, see the reference documentation:
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

## N

#### Name (Person)

Name is a user-friendly descriptive string for [Person](#person). Unlike the [Person ID](#person-id), the name of people can be duplicated within a group.

For more information, see the reference documentation:
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599add376ac60f11b48b5aa0),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f).

#### Name (LargePersonGroup/PersonGroup)

Name is also a user-friendly descriptive string for [LargePersonGroup](#largepersongroup)/[PersonGroup](#persongroup). Unlike the [LargePersonGroup ID](#largepersongroup-id)/[PersonGroup ID](#persongroup-id), the name of LargePersonGroups/PersonGroups can be duplicated within a subscription.

For more information, see the reference documentation:
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acebb6ac60f11b48b5a9e),
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246).

## P

#### PersistedFace

PersistedFace is a data structure in Face API. PersistedFace comes with a [PersistedFace ID](#persisted-face-id), as well as other attributes such as Name, and User Data.

For more information, see the reference documentation:
[LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3),
[FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250),
[LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42),
[PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).

#### Persisted Face ID

Persisted Face ID is generated when a [PersistedFace](#persistedface) is created successfully. A string is created to represent this Face in [Face API](#face-api).

For more information, see the reference documentation:
[LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3),
[FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250),
[LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42),
[PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).

#### Person

Person is a data structure managed in Face API. Person comes with a [Person ID](#person-id), as well as other attributes such as Name, a collection of [PersistedFace](#persistedface), and User Data.

For more information, see the reference documentation:
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599add376ac60f11b48b5aa0),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f).

#### Person ID

Person ID is generated when a [Person](#person) is created successfully. A string is created to represent this person in [Face API](#face-api).

For more information, see the reference documentation:
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599add376ac60f11b48b5aa0),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup Person - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f).

#### PersonGroup

PersonGroup is a collection of [Persons](#person) and is the unit of [Identification](#identification). A PersonGroup comes with a [PersonGroup ID](#persongroup-id), as well as other attributes such as Name and User Data.

For more information, see the reference documentation:
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246),
[PersonGroup Person - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395241).

#### PersonGroup ID

PersonGroup ID is a user provided string used as an identifier of a [PersonGroup](#persongroup). The group ID must be unique within the subscription.

For more information, see the reference documentation:
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Get](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246).


## R

#### Recognition

Recognition is a popular application area for face technologies, such as [Find Similar](#find-similar), [Grouping](#grouping), [Identify](#identification),[verifying two faces same or not](#verification).

For more information, see the reference documentation:
[Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237),
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238),
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239),
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).




#### Snapshot

A snapshot is a temporary remote storage for certain Face data types. It functions as a kind of clipboard to copy data from one subscription to another. First the user "takes" a snapshot of the data in the source subscription, and then they "apply" it to a new data object in the target subscription. 

For more details, see [Face migration guide](./face-api-how-to-topics/how-to-migrate-face-data.md) as well as the [Snapshot - Take](/rest/api/cognitiveservices/face/snapshot/take) and [Snapshot - Apply](/rest/api/cognitiveservices/face/snapshot/apply) reference documentation (REST).

#### Status (Train)

Status is a string used to describe the procedure for Training LargeFaceList/LargePersonGroups/PersonGroups, including 'notstarted', 'running', 'succeeded', 'failed'.

For more information, see the reference documentation:
[LargeFaceList - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158422d2de3616c086f2d1),
[LargePersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae2d16ac60f11b48b5aa4),
[PersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249).

#### Subscription key

Subscription key is a string that you need to specify as a query string parameter in order to invoke any Face API. The subscription key can be found in My Subscriptions page after you sign in to Microsoft Cognitive Services portal. There will be two keys associated with each subscription: one primary key and one secondary key. Both can be used to invoke API identically. You need to keep the subscription keys secure, and you can regenerate subscription keys at any time from My Subscriptions page as well.

## T

#### Train (LargeFaceList/LargePersonGroup/PersonGroup)

This API is used to pre-process the [LargeFaceList](#largefacelist)/[LargePersonGroup](#largepersongroup)/[PersonGroup](#persongroup) to ensure the [Find Similar](#find-similar)/[Identification](#identification) performance. If the training is not operated, or the [Training Status](#status-train) is not shown as succeeded, the identification for this PersonGroup will result in failure.

For more information, see the reference documentation:
[LargeFaceList - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158422d2de3616c086f2d1),
[LargePersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae2d16ac60f11b48b5aa4),
[PersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249),
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

## U

#### UserData/User Data

User data is extra information associated with [Person](#person) and [PersonGroup](#persongroup)/[LargePersonGroup](#largepersongroup). User data is set by users to make data easier to use, understand and remember.

For more information, see the reference documentation:
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d),
[LargePersonGroup - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acfc83a7b9412a4d53f3f),
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40),
[LargePersonGroup Person - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ade043a7b9412a4d53f41),
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244),
[PersonGroup - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524a),
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c),
[PersonGroup Person - Update](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395242).

## V

#### Verification

This API is used to verify whether two faces are the same or not. Both faces are represented as face IDs in the request. Verified results contain a Boolean field (isIdentical) indicating same if true and a number field ([confidence](#confidence)) indicating the level of confidence.

For more information, see the reference documentation:
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).
