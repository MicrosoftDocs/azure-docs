---
title: Export or delete your data - Custom Vision Service
titlesuffix: Azure Cognitive Services
description: Learn how to export or delete your data in the Custom Vision Service.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: conceptual
ms.date: 05/25/2018
ms.author: pafarley
---

# Export or delete user data in Custom Vision

Content Moderator collects user data to operate the service, but customers have full control over viewing, exporting, and deleting their data, using the Custom Vision Service [Training API](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/rest-api-tutorial).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

For more information on how to export and delete user data in Custom Vision, see the following table.

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Iteration Details | [GetIteration](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getiteration/getiteration) | [DeleteIteration](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/deleteiteration/deleteiteration) |
| Iteration Performance Details | [GetIterationPerformance](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getiterationperformance/getiterationperformance) | [DeleteIteration](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/deleteiteration/deleteiteration) |
| List of iterations | [GetIterations](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getiterations/getiterations) | [DeleteIteration](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/deleteiteration/deleteiteration) |
| Projects and project details | [GetProject](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/customvisiontraining/getproject/getproject) and [GetProjects](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getprojects/getprojects) | [DeleteProject](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/deleteproject/deleteproject) |
| Image tags | [GetTag](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/gettag/gettag
) and [GetTags](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/gettags/gettags) | [DeleteTag](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/deletetag/deletetag) |
| Images | [GetTaggedImages](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/gettaggedimages/gettaggedimages) (provides uri for image download) and [GetUntaggedImages](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getuntaggedimages/getuntaggedimages) (provides uri for image download) | [DeleteImages](https://go.microsoft.com/fwlink/?linkid=865446) |
| Exported Models | [GetExports](https://docs.microsoft.com/rest/api/cognitiveservices/customvisiontraining/getexports/getexports) | Deleted upon account deletion |
