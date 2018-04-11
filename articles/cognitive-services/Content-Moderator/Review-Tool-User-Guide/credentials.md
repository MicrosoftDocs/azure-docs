---
title: Verify credentials in Azure Content Moderator | Microsoft Docs
description: Verifyg Content Moderator credentials to use with APIs.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# Verify API credentials

You can verify credentials that you use with Azure Content Moderator APIs in two locations:
- In the Azure portal.
- In the Content Moderator Review tool.

## In the Azure portal

If you are accessing the APIs from the Azure portal, on the Dashboard, select the account. Under **Resource Management**, select **Keys**. To copy the key, select the icon to the right of the key.

![Content Moderator credentials in the Azure portal](images/credentials-1-azure.png)

## In the Review tool

On the Review tool Dashboard, on the **Settings** tab, select **Credentials**.

![Content Moderator credentials in the Review tool - Select Credentials](images/credentials3.PNG)

## Connector keys

When you build workflows in the Review tool, you likely will need a key for a connector. On the Dashboard, on the **Settings** tab, select **Connectors**. Select the **Edit** symbol next to the connector for which you want credentials.

![Content Moderator credentials in the Review tool - Select the Edit icon](images/credentials-3-connectors.png)

## Next steps

* Learn how to use API credentials to [define custom workflows](workflows.md).
