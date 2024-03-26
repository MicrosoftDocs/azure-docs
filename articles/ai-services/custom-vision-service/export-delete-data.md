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

Custom Vision collects user data to operate the service, but customers have full control to viewing and delete their data using the Custom Vision [Training APIs](https://go.microsoft.com/fwlink/?linkid=865446).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

To learn how to view or delete different kinds of user data in Custom Vision, see the following table:

| Data | View operation | Delete operation |
| ---- | ---------------- | ---------------- |
| Account info (Keys) | [GetAccountInfo](https://go.microsoft.com/fwlink/?linkid=865446) | Delete using Azure portal (for Azure Subscriptions). Or use **Delete Your Account** button in [CustomVision.ai](https://customvision.ai) settings page (for Microsoft Account Subscriptions) | 
| Iteration details | [GetIteration](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) |
| Iteration performance details | [GetIterationPerformance](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) | 
| List of iterations | [GetIterations](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) |
| Projects and project details | [GetProject](https://go.microsoft.com/fwlink/?linkid=865446) and [GetProjects](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteProject](https://go.microsoft.com/fwlink/?linkid=865446) | 
| Image tags | [GetTag](https://go.microsoft.com/fwlink/?linkid=865446) and [GetTags](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteTag](https://go.microsoft.com/fwlink/?linkid=865446) | 
| Images | [GetTaggedImages](https://go.microsoft.com/fwlink/?linkid=865446) (provides uri for image download) and [GetUntaggedImages](https://go.microsoft.com/fwlink/?linkid=865446) (provides uri for image download) | [DeleteImages](https://go.microsoft.com/fwlink/?linkid=865446) | 
| Exported iterations | [GetExports](https://go.microsoft.com/fwlink/?linkid=865446) | Deleted upon account deletion |
