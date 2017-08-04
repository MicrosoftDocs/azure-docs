---
title: How to test drive Jobs in Azure Content Moderator | Microsoft Docs
description: Test drive Review API's Job operation
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/03/2017
ms.author: sajagtap
---

# Test Drive the Job Operation #

## About the Job Operation ##
Use the Review API's [Job operation](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5) to initiate end-to-end scan-and-review moderation jobs with image or text content. The moderation job scans your content by using the image or text moderation APIs. It then uses the default and custom workflows (defined within the Review Tool) to generate reviews within the Review Tool. Once your human moderators have reviewed the auto-assigned tags and prediction data and submitted their final decision, the Review API submits all information to your API endpoint.

## Try with the API console ##
Before you can test-drive the API from the online console, you will need a few values.

- teamName: The team name you created when you set up your review tool account. 
- ContentId: A string, this is passed to the API and returned through the callback, and is useful for associating internal identifiers or metadata with the results of a moderation job.
- Workflowname: The name of the workflow you have created. For a quick test, you can use “Default”.
- Ocp-Apim-Subscription-Key: This is found under the Settings tab, as shown below.

![Content Moderator credentials in the review tool](Review-Tool-User-Guide/images/credentials-2-reviewtool.png)


## Next steps ##

To learn how to use connectors to define custom workflows, see the [workflows](workflows.md) article.
