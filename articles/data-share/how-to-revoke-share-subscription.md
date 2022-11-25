---
title: Revoke a share subscription in Azure Data Share 
description: Learn how to revoke a share subscription from a recipient using Azure Data Share.
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: how-to
ms.date: 10/31/2022
---
# How to revoke a consumer's share subscription in Azure Data Share

This article explains how to revoke a share subscription from one or more of your consumers using Azure Data Share. This prevents a consumer from triggering any more snapshots. If the consumer has not yet triggered a snapshot, they will never receive the data once the share subscription is revoked. If they have previously triggered a snapshot, the latest data that they have will stay in their account.

## Navigate to a sent data share

In Azure Data Share, navigate to your sent share and select the **Share Subscriptions** tab.

![Revoke Share Subscription](./media/how-to/how-to-revoke-share-subscription/revoke-share-subscription.png) 

Check the boxes next to the recipients whose share subscriptions you would like to delete and then click **Revoke**. The consumer will no longer get updates to their data.

## Next steps
Learn more about how to [monitor your data shares](how-to-monitor.md).
