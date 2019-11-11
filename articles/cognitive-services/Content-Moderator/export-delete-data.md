---
title: Export or delete user data - Content Moderator
titleSuffix: Azure Cognitive Services
description: You have full control over your data. Learn how to view, export or delete your data in Content Moderator.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: pafarley
---

# Export or delete user data in Content Moderator

Content Moderator collects user data to operate the service, but customers have full control to view, export, and delete their data using the [Review tool](https://contentmoderator.cognitive.microsoft.com/) and the [Moderation and Review APIs](https://docs.microsoft.com/azure/cognitive-services/content-moderator/api-reference).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

For more information on how to export and delete user data in Content Moderator, see the following table.

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Account Info (Subscription Keys) | N/A | Delete using the Azure portal (Azure Subscriptions). Or use the **Delete Team** button in the [Review UI](https://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Images for custom matching | Call the [Get image IDs API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f676). Images are stored in a one-way proprietary hash format, and there is no way to extract the actual images. | Call the [Delete all Images API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f686). Or delete the Content Moderator resource using the Azure portal. |
| Terms for custom matching	| Cal the [Get all terms API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67e) | Call the [Delete all terms API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67d). Or delete the Content Moderator resource using the Azure portal. |
| Tags | N/A | Use the **Delete** icon available for each tag in the Review UI Tag settings page. Or use the **Delete Team** button in the [Review UI](https://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Reviews | Call the [Get review API](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c2) | Use the **Delete Team** button in the [Review UI](https://contentmoderator.cognitive.microsoft.com/) Team settings page.
| Users | N/A | Use the **Delete** icon available for each user in the [Review UI](https://contentmoderator.cognitive.microsoft.com/) Team settings page. Or use the **Delete Team** button in the [Review UI](https://contentmoderator.cognitive.microsoft.com/) Team settings page. |

