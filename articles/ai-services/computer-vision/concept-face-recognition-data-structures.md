---
title: "Face recognition data structures - Face"
titleSuffix: Azure AI services
description: Learn about the Face recognition data structures, which hold data on faces and persons.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/04/2023
ms.author: pafarley
---

# Face recognition data structures

This article explains the data structures used in the Face service for face recognition operations. These data structures hold data on faces and persons.

You can try out the capabilities of face recognition quickly and easily using Vision Studio.
> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

[!INCLUDE [Gate notice](./includes/identity-gate-notice.md)]

## Data structures used with Identify 

The Face Identify API uses container data structures to the hold face recognition data in the form of **Person** objects. There are three types of containers for this, listed from oldest to newest. We recommend you always use the newest one. 

### PersonGroup 

**PersonGroup** is the smallest container data structure.
- You need to specify a recognition model when you create a **PersonGroup**. When any faces are added to that **PersonGroup**, it uses that model to process them. This model must match the model version with Face ID from detect API.
- You must call the Train API to make any new face data reflect in the Identify API results. This includes adding/removing faces and adding/removing persons.
- For the free tier subscription, it can hold up to 1000 Persons. For S0 paid subscription, it can have up to 10,000 Persons.  

 **PersonGroupPerson** represents a person to be identified. It can hold up to 248 faces.

### Large Person Group 

**LargePersonGroup** is a later data structure introduced to support up to 1 million entities (for S0 tier subscription). It is optimized to support large-scale data. It shares most of **PersonGroup** features: A recognition model needs to be specified at creation time, and the Train API must be called before use.



### Person Directory 

**PersonDirectory** is the newest data structure of this kind. It supports a larger scale and higher accuracy. Each Azure Face resource has a single default **PersonDirectory** data structure. It's a flat list of **PersonDirectoryPerson** objects - it can hold up to 75 million.

**PersonDirectoryPerson** represents a person to be identified. Updated from the **PersonGroupPerson** model, it allows you to add faces from different recognition models to the same person. However, the Identify operation can only match faces obtained with the same recognition model. 

**DynamicPersonGroup** is a lightweight data structure that allows you to dynamically reference a **PersonGroupPerson**. It doesn't require the Train operation: once the data is updated, it's ready to be used with the Identify API.

You can also use an **in-place person ID list** for the Identify operation. This lets you specify a more narrow group to identify from. You can do this manually to improve identification performance in large groups. 

The above data structures can be used together. For example: 
- In an access control system, The **PersonDirectory** might represent all employees of a company, but a smaller **DynamicPersonGroup** could represent just the employees that have access to a single floor of the building.
- In a flight onboarding system, the **PersonDirectory** could represent all customers of the airline company, but the **DynamicPersonGroup** represents just the passengers on a particular flight. An **in-place person ID list** could represent the passengers who made a last-minute change.

For more details, please refer to the [PersonDirectory how-to guide](./how-to/use-persondirectory.md).

## Data structures used with Find Similar 

Unlike the Identify API, the Find Similar API is designed to be used in applications where the enrollment of **Person** is hard to set up (for example, face images captured from video analysis, or from a photo album analysis).

### FaceList 

**FaceList** represent a flat list of persisted faces. It can hold up 1,000 faces.

### LargeFaceList 

**LargeFaceList** is a later version which can hold up to 1,000,000 faces.

## Next steps

Now that you're familiar with the face data structures, write a script that uses them in the Identify operation.

* [Face quickstart](./quickstarts-sdk/identity-client-library.md)
