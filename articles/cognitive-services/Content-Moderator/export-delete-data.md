---
title: Export or delete your data - Content Moderator
titlesuffix: Azure Cognitive Services
description: Learn how to export or delete your data in Content Moderator.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: conceptual
ms.date: 05/25/2018
ms.author: pafarley
---

# Export or delete user data in Content Moderator

Content Moderator collects user data to operate the service, but customers have full control over viewing, exporting, and deleting their data, using the [Review UI](http://contentmoderator.cognitive.microsoft.com/) and the [APIs](https://docs.microsoft.com/azure/cognitive-services/content-moderator/api-reference).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

For more information on how to export and delete user data in Content Moderator, see the following table.

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Account Info (Subscription Keys) | N/A | Delete using the Azure portal (Azure Subscriptions). Or use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Images for custom matching | [Get image IDs](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f676). Images are stored in a one-way proprietary hash format, and there is no way to extract the actual images. | [Delete all images](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f686). Or delete the Content Moderator resource using the Azure portal. |
| Terms for custom matching	| [Get all terms](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67e) | [Delete all terms](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67d). Or delete the Content Moderator resource using the Azure portal. |
| Tags | N/A | Use the **Delete** icon available for each tag in the Review UI Tag settings page. Or use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Reviews | [Get review](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c2) | Use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page.
| Users | N/A | Use the **Delete** icon available for each user in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. Or use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |

