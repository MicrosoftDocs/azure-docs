---
title: Revoke a share subscription
description: Revoke a share subscription
author: madams0013

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: t-maadam
---
# How to revoke a consumer's share subscription

This article explains how to revoke a share subscription from one or more of your consumers using Azure Data Share Preview. This prevents a consumer from triggering any more snapshots. If the consumer has not yet triggered a snapshot, they will never receive the data once the share subscription is revoked. If they have previously triggered a snapshot, the latest data that they have will stay in their account.

## Navigate to a sent data share

In the Azure Data Share service, navigate to your sent share and select the **Share Subscriptions** tab.

![Revoke Share Subscription](./media/how-to/how-to-revoke-share-subscription/revoke-share-subscription.png) 

Check the boxes next to the recipients whose share subscriptions you would like to delete and then click **Revoke**. The consumer will no longer get updates to their data.

## Next steps
To learn about how to delete an invitation, continue to the next how-to guide.

> [!div class="nextstepaction"]
> [Delete an invitation to an existing data share](how-to-delete-invitation.md)