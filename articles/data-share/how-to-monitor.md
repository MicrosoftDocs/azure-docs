---
title: Monitor Azure Data Share status and history
description: Learn how to monitor invitation status, share subscriptions, and snapshot history for Azure Data Share 
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: how-to
ms.date: 02/29/2024
---

# Monitor Azure Data Share status and history

This article explains how you can monitor your Azure Data Share status and history.

- As a data provider, you can monitor various aspects of your data sharing relationships. Details such as whether your data consumers have accepted your invitation to the data share, and whether they have created a share subscription and started to use your data, are all available to monitor.

- As a data consumer, you can monitor the snapshots that have been triggered into your Azure subscription.

You can also see Azure Monitor metrics, collect logs, analyze monitoring data, and create alerts for your Data Share shares. For information about all the monitoring options that are available for Data Share, see [Monitor Azure Data Share](monitor-data-share.md).

## Monitor invitation status

View the status of your data share invitations by navigating to Sent shares -> Invitations.

![Invitation status](./media/invitation-status.png "Invitation status")

There are three states that your invitation can be in:

* Pending - Data share recipient hasn't yet accepted the invitation.
* Accepted - Data share recipient has accepted the invitation.
* Rejected - Data share recipient has rejected the invitation.

> [!IMPORTANT]
> If you delete an invitation after it has already been accepted, it is not equivalent to revoking access. If you would like to stop future snapshots from being copied into your data consumers storage account, you must revoke access through the *Share subscriptions* tab.

## Monitor share subscriptions

View the status of your share subscriptions by navigating to Sent Shares -> Share Subscriptions. This will give you details about active subscriptions created by your data consumers after accepting your invitation. You can stop future updates to your data consumer by selecting the share subscription and selecting *Revoke*.

## Snapshot history

In the **History** tab of a share, you're able to view when data is copied from data provider to data consumer's data store. You're able to monitor the frequency, duration and status of each snapshot.

![Screenshot shows Sent Shares in the Azure portal.](./media/sent-shares.png "Snapshot history")

You can view more details about each snapshot run by selecting the run start date. Then select on the status for each dataset to view the amount of data transferred, number of files/records copied, duration of the snapshot, number of vCores used and error message if there's any.

Up to 30 days of snapshot history is displayed. If you need to save and see more than 30 days worth of history, you can use diagnostic setting.

## Next steps

- Learn more about [Azure Data Share terminology](terminology.md).
- See [Monitor Data Share](monitor-data-share.md) for more details about monitoring Data Share.

