---
title: "Face recognition data structures - Face"
titleSuffix: Azure AI services
description: Learn about the Face recognition data structures, which hold data on faces and persons.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: conceptual
ms.date: 11/04/2023
ms.author: pafarley
---

# Face recognition data structures

This article explains tbd

You can try out the capabilities of face recognition quickly and easily using Vision Studio.
> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

[!INCLUDE [Gate notice](./includes/identity-gate-notice.md)]

TBD review all this:
## Data structure work with Identify API 

Face Identify API need a container data structure which holds face recognition data to work with. Face API involved three versions of such data structure. This document explains the details of them. Overall, we recommend user always use the latest one. 

### Person Group 

**PersonGroup** is the first container data structure to support identify operation. Several features to call out: 
- A recognition model needs to be specified at person group creation time. All faces added to the person group will use the model to process. This model must match the model version with Face Id from detect API. 
- Train API need to be called to make any data update reflect to identify API result. Which includes add/remove faces, add/remove persons. Train API optimize the data underneath to improve identify accuracy. 
- For free tier subscription, it can have up to 1000 entities. For S0 paid subscription, it can have up to 10,000 entities.  

**PersonGroupPerson**: represents a person to be identified.  It can hold up to 248 faces.    

### Large Person Group 

**LargePersonGroup** is the second data structure introduced to support up to 1 million entities for S0 tier subscription. It has been optimized to support large scale data. It shares most of person group features: Train API need to be called before use, recognition model needed at creation time.  

### Person Directory 

**PersonDirectory** is a newer data structure to support identify operation with large scale, and higher accuracy. Person directory Each face API resource has a default Person directory data structure. It is a flat list of Person Directory Person object. A person directory can hold up to 75 million entities. 

**PersonDirectoryPerson**: it represents a person to be identified. An update from Large Person Group and Person Group is that Person Directory Person allowing persistent face from different recognition model added to same person. However, Identify API will only match persistent face with same recognition model as the Face Id from detect API. 

**DynamicPersonGroup**: works directly with identify API to match detected face. It is a lightweight data structure allowing dynamically reference of person group person. Compared to large person group, it doesn’t require explicitly call Train operation, once the update operation is finished, it is available to be used in identify call.   

**In-place person ID list**: Moreover, Identify API supports an in-place person Id list up to 30 IDs, which make it easier to specify a dynamic group. 

Examples: identify against large amount candidates will yield lower accuracy and performance. Applications could use other information to scope down the candidate list to improve accuracy, here are several examples: 
- In an access control system, person directory represents all employees of a company, dynamic person group represents employees having access to a single floor. 
- In a flight on-boarding system, person directory represents all passengers of the airline company, dynamic person group represents passengers for a flight. In-place person Id list could represent the passengers who made last minute change.  

For more details, please refer to “how to use person directory.” TBD

## Data structure work with Find Similar API 

Compare to Identify API, Find Similar API is designed to use in applications where the enrollment step for a “person” concept is hard to setup. For example, face images captured from video analysis, or photo album analysis. 

### FaceList 

FaceList represent a flat list of persisted faces, each can hold up 1,000 faces.  

### LargeFaceList 

Very similar to FaceList, LargeFaceList can hold up to 1,000,000 faces. 

## Next steps

Now that you're familiar with face recognition concepts, Write a script that identifies faces against a trained PersonGroup.

* [Face quickstart](./quickstarts-sdk/identity-client-library.md)
