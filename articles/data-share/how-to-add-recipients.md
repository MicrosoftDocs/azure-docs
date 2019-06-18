---
title: How to add recipients to my data share
description: How to add recipients to my data share
author: joannapea

ms.service: azure-data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---
# Adding recipients to my Azure Data Share
Deleting a recipient or consumer of a data share can happen at a couple different stages. 
(Click here to understand the difference between recipient and consumer.) 
 
Delete the invitation to a recipient before they accept it 
This will prevent the recipient from creating a share subscription, and they will never receive the shared data. 
If you delete the invitation to a consumer (already created a share subscription) it will not do anything. 
Navigate to your data share -> Sent Shares -> Invitations 
Select the checkbox next to the email(s) of the recipient(s) whose invitation you would like to delete. 
Click delete. 
 
Delete the share subscription of a consumer 
This will prevent the recipient from triggering any more snapshots after their share subscription is deleted. If the consumer has not yet triggered a snapshot, they will never receive the data, but if they have previously triggered a snapshot, the latest data that they have will remain in their account. 
Navigate to your data share -> Sent Shares -> Share Subscriptions 
Select the checkbox next to the email(s) of the recipient(s) whose Share Subscriptions you would like to delete. 