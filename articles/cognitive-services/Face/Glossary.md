---
title: Glossary for the Face API Service | Microsoft Docs
description: The glossary explains terms that you might encounter as you work with the Face API Service.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 01/18/2017
ms.author: anroth
---

# Glossary

## A

#### <a name="Attributes"></a>Attributes

Attributes are optional in the [detection](#Detection-Face-Detection) results, such as [age](#Age-Attribute), [gender](#Gender-Attribute), [head pose](#Head-Pose-Attribute), [facial hair](#Facial-Hair-Attribute), [smiling](#Smile-Attribute).
They can be obtained from the [detection](#Detection-Face-Detection) API by specifying the query parameters: returnFaceAttributes. Attributes give extra information regarding selected [faces](#Face); in addition to the [face ID](#Face-ID) and the [rectangle](#Face-Rectangle).

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Age-Attribute"></a>Age (Attribute)

Age is one of the [attributes](#Attributes) that describes the age of a particular face. The age attribute is optional in the [detection](#Detection-Face-Detection) results, and can be controlled with a [detection](#Detection-Face-Detection) request by specifying the returnFaceAttributes parameter.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## B

## C

#### <a name="Candidate"></a>Candidate

Candidates are essentially [identification](#Identification) results (e.g. identified persons and level of confidence in detections). A candidate is represented by the [personID](#Person-ID) and [confidence](#Confidence), indicating that the person is identified with a high level of confidence.

For more details, please refer to the guide [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

#### <a name="Confidence"></a>Confidence

Confidence is a measurement revealing the similarity between [faces](#Face) or [people](#Person) in numerical values –which is used in [identification](#Identification), and [verification](#Verification) to indicate the similarities of searched, identified and verified results.

For more details, please refer to the following guides: [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237), [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a)

## D

#### <a name="Detection-Face-Detection"></a>Detection/Face Detection

Face detection is the action of locating faces in images. Users can upload an image or specify an image URL in the request. The detected faces are returned with [face IDs](#Face-ID)	indicating a unique identity in Face API. The rectangles indicate the face locations in the image in pixels, as well as the optional [attributes](#Attributes) for each face such as [age](#Age-Attribute), [gender](#Gender-Attribute), [head pose](#Head-Pose-Attribute), [facial hair](#Facial-Hair-Attribute) and [smiling](#Smile-Attribute).

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## E

## F

#### <a name="Face"></a>Face

Face is a unified term for the results derived from Face API related with detected faces. Ultimately, face is represented by a unified identity ([Face ID](#Face-ID)), a specified region in images ([Face Rectangle](#Face-Rectangle)), and extra face related [attributes](#Face-Attributes-Facial-Attributes), such as [age](#Age-Attribute), [gender](#Gender-Attribute), [landmarks](#Face-Landmarks-Facial-Landmarks) and [head pose](#Head-Pose-Attribute). Additionally, faces can be returned from [detection](#Detection-Face-Detection).

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Face-API"></a>Face API

Face API is a cloud-based API that provides the most advanced algorithms for face detection and recognition. The main functionality of Face API can be divided into two categories: face [detection](#Detection-Face-Detection) with [attributes](#Face-Attributes-Facial-Attributes), and face [recognition](#Recognition).

For more details, please refer to the following guides: [Face API Overview](./Overview.md), [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [Face - Find Similar Faces](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237), [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238), [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a)

#### <a name="Face-Attributes-Facial-Attributes"></a>Face Attributes/Facial Attributes

Please see [Attributes](#Attributes).

#### <a name="Face-ID"></a>Face ID

Face ID is derived from the [detection](#Detection-Face-Detection) results, in which a string represents a [face](#Face) in [Face API](#Face-API).

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Face-Landmarks-Facial-Landmarks"></a>Face Landmarks/Facial Landmarks

Landmarks are optional in the [detection](#Detection-Face-Detection) results; which are semantic facial points, such as the eyes, nose and mouth (illustrated in following figure). Landmarks can be controlled with a [detection](#Detection-Face-Detection) request by the Boolean number returnFaceLandmarks. If returnFaceLandmarks is set as true, the returned faces will have landmark attributes.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

![HowToDetectFace](./Images/landmarks.1.jpg)

#### <a name="Face-Rectangle"></a>Face Rectangle

Face rectangle is derived from the [detection](#Detection-Face-Detection) results, which is an upright rectangle (left, top, width, height) in images in pixels. The top-left corner of a [face](#Face) (left, top), besides the width and height, indicates face sizes in x and y axes respectively.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Facial-Hair-Attribute"></a>Facial Hair (Attribute)

Facial hair is one of the [attributes](#Attributes) used to describe the facial hair length of the available faces. The facial hair attribute is optional in the [detection](#Detection-Face-Detection) results, and can be controlled with a [detection](#Detection-Face-Detection) request by returnFaceAttributes. If returnfaceAttributes contains 'facialHair', the returned faces will have facial hair attributes.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Find-Similar-Faces"></a>Find Similar Faces

This API is used to search/query similar faces based on a collection of faces. Query faces and face collections are represented as [face IDs](#Face-ID) in the request. Returned results are searched similar faces, represented by [face IDs](#Face-ID).

For more details, please refer to the guide [Face - Find Similar Faces](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237).

## G

#### <a name="Gender-Attribute"></a>Gender (Attribute)

Gender is one of the [attributes](#Attributes) used to describe the genders of the available faces. The gender attribute is optional in the [detection](#Detection-Face-Detection) results, and can be controlled with a [detection](#Detection-Face-Detection) request by returnFaceAttributes. If returnfaceAttributes contains 'gender', the returned faces will have gender attributes.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### <a name="Grouping"></a>Grouping

Face grouping is the grouping of a collection of faces according to facial similarities. Face collections are indicated by the face ID collections in the request. As a result of grouping, similar faces are grouped together as [groups](#Groups), and faces that are not similar to any other face are merged together as a messy group. There is at the most, one [messy group](#Messy-Group) in the grouping result.

For more details, please refer to the guide [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

#### <a name="Groups"></a>Groups

Groups are derived from the [grouping](#Grouping) results. Each group contains a collection of similar faces, where faces are indicated by [face IDs](#Face-ID).

For more details, please refer to the guide [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

## H

#### <a name="Head-Pose-Attribute"></a>Head Pose (Attribute)

Head pose is one of the [attributes](#Attributes) that represents face orientation in 3D space according to roll, pitch and yaw angles, as shown in following figure. The value ranges of roll and yaw are [-180, 180] and [-90, 90] in degrees. In the current version, the pitch value returned from detection is always 0. The head pose attribute is optional in the [detection](#Detection-Face-Detection) results, and can be controlled with a [detection](#Detection-Face-Detection) request by the returnFaceAttributes parameter. If returnFaceAttributes parameter contains 'headPose', the returned faces will have head pose attributes.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

![GlossaryHeadPose](./Images/headpose.1.jpg)

## I

#### <a name="Identification"></a>Identification

Identification is to identify one or more faces from a person group. A [person group](#Person-Group) is a collection of [persons](#Person). Faces and the person group are represented by [face IDs](#Face-ID) and [person group IDs](#Person-Group-ID) respectively in the request. Identified results are [candidates](#Candidate), represented by [persons](#Person) with confidence. Multiple faces in the input are considered separately, and each face will have its own identified result.

**Please Note:** the person group should be trained successfully before identification. If the person group is not trained, or the training [status](#Status-Train) is not shown as 'succeeded' (i.e. 'running', 'failed', or 'timeout'), the request response is 400.

For more details, please refer to the following guides:  
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person Group - Create a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[Person Group - Train Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249)  

#### <a name="Is-Identical"></a>IsIdentical

IsIdentical is a Boolean field of [verification](#Verification) results indicating whether two faces belong to the same person.

For more details, please refer to the guide [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

## J

## K

## L

#### Landmarks

Please see [face landmarks](#Face-Landmarks-Facial-Landmarks).

## M

#### <a name="Messy-Group"></a>Messy group

Messy group is derived from the [grouping](#Grouping) results; which contains faces not similar to any other face. Each face in a messy group is indicated by the [face ID](#Face-ID).

For more details, please refer to the guide [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

## N

#### Name (Person)

Name is a user friendly descriptive string for [Person](#Person). Unlike the [Person ID](#Person-ID), the name of people can be duplicated within a group.

For more details, please refer to the following guides:  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person - Get a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f)

#### <a name="Name-Person-Group"></a>Name (Person Group)

Name is also a user friendly descriptive string for [Person Group](#Person-Group). Unlike the [Person Group ID](#Person-Group-ID), the name of person groups can be duplicated within a subscription.

For more details, please refer to the following guides:  
[Person Group - Create a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[Person Group - Get a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246)

## O

## P

#### <a name="Person"></a>Person

Person is a data structure managed in Face API. Person comes with a [Person ID](#Person-ID), as well as other attributes such as [Name](#Name-Person-Group), a collection of [Face IDs](#Face-ID), and [User Data](#UserData-User-Data).

For more details, please refer to the following guides:  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person - Get a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f)

#### <a name="Person-ID"></a>Person ID

Person ID is generated when a [person](#Person) is created successfully. A string is created to represent this person in [Face API](#Face-API).

For more details, please refer to the following guides:  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person - Get a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523f)

#### <a name="Person-Group"></a>Person Group

Person group is a collection of [Persons](#Person) and is the unit of [Identification](#Identification). A person group comes with a [Person Group ID](#Person-Group-ID), as well as other attributes such as [Name](#Name-Person-Group) and [User Data](#UserData-User-Data).

For more details, please refer to the following guides:  
[Person Group - Create a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[Person Group - Get a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246)  
[Person - List Persons in a PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395241)  

#### <a name="Person-Group-ID">Person Group ID

Person group ID is a user provided string used as an identifier of a [person group](#Person-Group). The group ID must be unique within the subscription.

For more details, please refer to the following guides:  
[PersonGroup - Create a PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[PersonGroup - Get a PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246)

#### Pose (Attribute)

Please see [Head Pose](#Head-Pose-Attribute).

## Q

## R

#### <a name="Recognition"></a>Recognition

Recognition is a popular application area for face technologies, such as [Find Similar Faces](#Find-Similar-Faces), [Grouping](#Grouping), [Identify](#Identification),[verifying two faces same or not](#Verification).

For more details, please refer to the following guides:  
[Face - Find Similar Faces](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237)  
[Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238)  
[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)  
[Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a)

#### Rectangle (Face)

Please see [face rectangle](#Face-Rectangle).

## S

#### <a name="Smile-Attribute"></a>Smile (Attribute)

Smile is one of the [attributes](#Attributes) used to describe the smile expression of the available faces. The smile attribute is optional in the [detection](#Detection-Face-Detection) results, and can be controlled with a [detection](#Detection-Face-Detection) request by returnFaceAttributes. If returnfaceAttributes contains 'smile', the returned faces will have smile attributes.

For more details, please refer to the guide [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### Similar Face Searching

Please see [Find Similar Faces](#Find-Similar-Faces).

#### <a name="Status-Train"></a>Status (Train)

Status is a string used to describe the procedure for [Training Person Groups](#Train-Person-Group), including 'notstarted', 'running', 'succeeded', 'failed'.

For more details, please refer to the guide [Person Group - Train Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249).

#### Subscription key

Subscription key is a string that you need to specify as a query string parameter in order to invoke any Face API. The subscription key can be found in My Subscriptions page after you sign in to Microsoft Cognitive Services portal. There will be two keys associated with each subscription: one primary key and one secondary key. Both can be used to invoke API identically. You need to keep the subscription keys secure, and you can regenerate subscription keys at any time from My Subscriptions page as well.

## T

#### <a name="Train-Person-Group"></a>Train (Person Group)

This API is used to train a particular model for a specified [person group](#Person-Group) to facilitate identification. If the training is not operated, or the [Training Status](#Status-Train) is not shown as succeeded, the identification for this person group will result in failure.

For more details, please refer to the following guides: [Person Group - Train Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249), [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)

## U

#### <a name="UserData-User-Data"></a>UserData/User Data

User data is extra information associated with [person](#Person) and [person group](#Person-Group). User data is set by users to make data easier to use, understand and remember.

For more details, please refer to the following guides:  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person Group - Create a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[Person - Update a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395242)  
[Person Group - Update a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524a)

## V

#### <a name="Verification"></a>Verification

This API is used to verify whether two faces are the same or not. Both faces are represented as face IDs in the request. Verified results contain a Boolean field ([isIdentical](#Is-Identical)) indicating same if true and a number field ([confidence](#Confidence)) indicating the level of confidence.

For more details, please refer to the guide [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

## W

## X

## Y

## Z
