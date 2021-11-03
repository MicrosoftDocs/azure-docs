---
title: Manage Azure Media Services v3 accounts 
description: To start managing, encrypting, encoding, analyzing, and streaming media content in Azure, you need to create a Media Services account. This article explains how to manage Azure Media Services v3 accounts. 
services: media-services
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 03/29/2021
ms.author: inhenkel
---

# Manage Azure Media Services v3 accounts

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

To start managing, encrypting, encoding, analyzing, and streaming media content in Azure, you need to create a Media Services account. When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. The Media Services account and all associated storage accounts must be in the same Azure subscription. For more information, see [Storage accounts](storage-account-concept.md).

[!INCLUDE [account creation note](./includes/note-2020-05-01-account-creation.md)]

## Media Services account names

Media Services account names must be all lowercase letters or numbers with no spaces, and between 3 to 24 characters in length. Media Services account names must be unique within an Azure location.

When a Media Services account is deleted, the account name is reserved for one year. For a year after the account is deleted, account name may only be reused in the same Azure location by the
subscription that contained the original account.

Media Services account names are used in DNS names, including for Key Delivery, Live Events and Streaming Endpoint names. If you have configured firewalls or proxies to allow Media Services
DNS names, ensure these configurations are removed within a year of deleting a Media Services account.

## Moving a Media Services account between subscriptions

If you need to move a Media Services account to a new subscription, you need to first move the entire resource group that contains the Media Services account to the new subscription. You must move all attached resources: Azure Storage accounts, Azure CDN profiles, etc. For more information, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). As with any resources in Azure, resource group moves can take some time to complete.

### Considerations

* Create backups of all data in your account before migrating to a different subscription.
* You need to stop all the Streaming Endpoints and live streaming resources. Your users will not be able to access your content for the duration of the resource group move. 

> [!IMPORTANT]
> Do not start the Streaming Endpoint until the move completes successfully.

### Troubleshoot

If a Media Services account or an associated Azure Storage account become "disconnected" following the resource group move, try rotating the Storage Account keys. If rotating the Storage Account keys does not resolve the "disconnected" status of the Media Services account, file a new support request from the "Support + troubleshooting" menu in the Media Services account.  

## Next steps

[Create an account](./account-create-how-to.md)
