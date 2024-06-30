---
title: Export or delete user data - Content Moderator
titleSuffix: Azure AI services
description: You have full control over your data. Learn how to view, export or delete your data in Content Moderator.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: how-to
ms.date: 01/18/2024
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
| Images for custom matching | Call the [Get image IDs API](/rest/api/cognitiveservices/contentmoderator/list-management-image/get-all-image-ids). Images are stored in a one-way proprietary hash format, and there is no way to extract the actual images. | Call the [Delete all Images API](/rest/api/cognitiveservices/contentmoderator/list-management-image/delete-all-images). Or delete the Content Moderator resource using the Azure portal. |
| Terms for custom matching	| Cal the [Get all terms API](/rest/api/cognitiveservices/contentmoderator/list-management-term/get-all-terms) | Call the [Delete all terms API](/rest/api/cognitiveservices/contentmoderator/list-management-term/delete-all-terms). Or delete the Content Moderator resource using the Azure portal. |
