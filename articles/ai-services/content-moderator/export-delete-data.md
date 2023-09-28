---
title: Export or delete user data - Content Moderator
titleSuffix: Azure AI services
description: You have full control over your data. Learn how to view, export or delete your data in Content Moderator.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: how-to
ms.date: 02/07/2019
ms.author: pafarley
---

# Export or delete user data in Content Moderator

[!INCLUDE [deprecation notice](includes/tool-deprecation.md)]

Content Moderator collects user data to operate the service, but customers have full control to view, export, and delete their data using the [Moderation APIs](./api-reference.md).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

For more information on how to export and delete user data in Content Moderator, see the following table.

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Account Info (Subscription Keys) | N/A | Delete using the Azure portal (Azure Subscriptions). |
| Images for custom matching | Call the [Get image IDs API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f676). Images are stored in a one-way proprietary hash format, and there is no way to extract the actual images. | Call the [Delete all Images API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f686). Or delete the Content Moderator resource using the Azure portal. |
| Terms for custom matching	| Cal the [Get all terms API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67e) | Call the [Delete all terms API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67d). Or delete the Content Moderator resource using the Azure portal. |
