---
title: GDPR Compliance and Content Moderator, Azure Cognitive Services | Microsoft Docs
description: Learn how Content Moderator complies with the GDPR.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: content-moderator
ms.topic: article
ms.date: 05/23/2018
ms.author: v-jaswel
---

# Overview

In May 2018, a European privacy law, the [General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform/index_en.htm), is due to take effect. The GDPR imposes new rules on companies, government agencies, non-profits, and other organizations that offer goods and services to people in the European Union (EU), or that collect and analyze data tied to EU residents. The GDPR applies no matter where you are located.

Microsoft products and services are available today to help you meet the GDPR requirements. Read more about Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

Content Moderator keeps customer content to operate the service but customers have full control over viewing, exporting, and deleting their data either through the [Review UI](http://contentmoderator.cognitive.microsoft.com/) and [APIs](https://docs.microsoft.com/en-us/azure/cognitive-services/content-moderator/api-reference).

### Data controls

The Content Moderator [List APIs](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675) allow you to delete or export your data per GDPR guidelines. Please see the table below for more details on data subject to DSR processing.

| First Header | Second Header | 

| Data | Export Operation | Delete Operation |
| ---- | ---------------- | ---------------- |
| Account Info (Subscription Keys) | N/A | Delete using the Azure Portal (Azure Subscriptions). Or use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Images for custom matching | [Get image IDs](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f676) (images are stored in a one-way proprietary hash format and there is not a way to extract the actual image) | [Delete all images](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f686). Or delete the Content Moderator resource using the Azure Portal. |
| Terms for custom matching	| [Get all terms](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67e) | [Delete all terms](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67d). Or delete the Content Moderator resource via the Azure Portal. |
| Tags | N/A | Delete icon available for each tag in the Review UI Tag settings page. Or use the “Delete Team” button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |
| Reviews | [Get Review](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c2) | Use the “Delete Team” button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page.
| Users | N/A | Use the **Delete** icon available for each user in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. Or use the **Delete Team** button in the [Review UI](http://contentmoderator.cognitive.microsoft.com/) Team settings page. |

