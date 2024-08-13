---
title: View or delete your data - Custom Vision Service
titleSuffix: Azure AI services
description: You maintain full control over your data. This article explains how you can view, export or delete your data in the Custom Vision Service.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-custom-vision
ms.topic: how-to
ms.date: 02/27/2024
ms.author: pafarley
ms.custom: cogserv-non-critical-vision
---

# View or delete user data in Custom Vision

Custom Vision collects user data to operate the service, but customers have full control to viewing and delete their data using the Custom Vision [Training APIs](/rest/api/customvision/train-project).

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

To learn how to view or delete different kinds of user data in Custom Vision, see the following table:

| Data | View operation | Delete operation |
| ---- | ---------------- | ---------------- |
| Account info (Keys) | [GetAccountInfo](/rest/api/aiservices/accountmanagement/accounts/get) | Delete using Azure portal (for Azure Subscriptions). Or use **Delete Your Account** button in [CustomVision.ai](https://customvision.ai) settings page (for Microsoft Account Subscriptions) | 
| Iteration details | [GetIteration](/rest/api/customvision/get-iteration) | [DeleteIteration](/rest/api/customvision/delete-iteration) |
| Iteration performance details | [GetIterationPerformance](/rest/api/customvision/get-iteration-performance) | [DeleteIteration](/rest/api/customvision/delete-iteration) | 
| List of iterations | [GetIterations](/rest/api/customvision/get-iterations) | [DeleteIteration](/rest/api/customvision/delete-iteration) |
| Projects and project details | [GetProject](/rest/api/customvision/get-project) and [GetProjects](/rest/api/customvision/get-projects) | [DeleteProject](/rest/api/customvision/delete-project) | 
| Image tags | [GetTag](/rest/api/customvision/get-tag) and [GetTags](/rest/api/customvision/get-tags) | [DeleteTag](/rest/api/customvision/delete-tag) | 
| Images | [GetTaggedImages](/rest/api/customvision/get-tagged-images) (provides uri for image download) and [GetUntaggedImages](/rest/api/customvision/get-untagged-images) (provides uri for image download) | [DeleteImages](/rest/api/customvision/delete-images) | 
| Exported iterations | [GetExports](/rest/api/customvision/get-exports) | Deleted upon account deletion |
