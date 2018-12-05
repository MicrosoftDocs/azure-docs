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

Content Moderator collects user data to operate the service, but customers have full control over viewing, exporting, and deleting their data, using the Custom Vision Service [Training API](https://go.microsoft.com/fwlink/?linkid=865446).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

For more information on how to export and delete user data in Custom Vision, see the following table.

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Account Info (Subscription Keys) | [GetAccountInfo](https://go.microsoft.com/fwlink/?linkid=865446) | Delete using Azure portal (Azure Subscriptions). Or using “Delete Your Account” button in CustomVision.ai settings page (Microsoft Account Subscriptions) |
| Iteration Details | [GetIteration](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) |
| Iteration Performance Details | [GetIterationPerformance](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) |
| List of iterations | [GetIterations](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteIteration](https://go.microsoft.com/fwlink/?linkid=865446) |
| Projects and project details | [GetProject](https://go.microsoft.com/fwlink/?linkid=865446) and [GetProjects](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteProject](https://go.microsoft.com/fwlink/?linkid=865446) |
| Image tags | [GetTag](https://go.microsoft.com/fwlink/?linkid=865446) and [GetTags](https://go.microsoft.com/fwlink/?linkid=865446) | [DeleteTag](https://go.microsoft.com/fwlink/?linkid=865446) |
| Images | [GetTaggedImages](https://go.microsoft.com/fwlink/?linkid=865446) (provides uri for image download) and [GetUntaggedImages](https://go.microsoft.com/fwlink/?linkid=865446) (provides uri for image download) | [DeleteImages](https://go.microsoft.com/fwlink/?linkid=865446) |
| Exported Models | [GetExports](https://go.microsoft.com/fwlink/?linkid=865446) | Deleted upon account deletion |
