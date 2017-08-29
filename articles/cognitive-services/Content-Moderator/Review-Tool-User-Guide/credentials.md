---
title: Verifying Credentials in Azure Content Moderator | Microsoft Docs
description: Verifying Content Moderator credentials for use with APIs.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# Verifying Credentials #

## From the Azure portal ##

If you are accessing the API from the Microsoft Azure portal, click on the desired account in the Dashboard. Click Keys under Resource Management. Click the icon to the right of the key to copy it to the clipboard.

![Content Moderation Credentials in Azure](images/credentials-1-azure.png)

## From the Review Tool ##

From the Review Tool Dashboard, click on Credentials from the Settings tab.

![Content Moderator credentials in the review tool](images/credentials-2-reviewtool.png)

## Connector Keys ##

While building workflows in the Review Tool, you will likely need a key for a connector. From the Dashboard, click Connectors from the Settings tab, then click the Edit symbol next to the connector for which you want credentials.

![Content Moderation Credentials in the review tool](images/credentials-3-connectors.png)

## Next steps ##

To learn how to use API credentials to define custom workflows, see the [workflows](workflows.md) article.
