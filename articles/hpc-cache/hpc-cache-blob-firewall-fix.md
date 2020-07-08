---
title: Work around storage firewall settings
description: A storage account network firewall setting can cause failure when creating an Azure Blob storage target in Azure HPC Cache. This article gives a workaround for the limitation until a software fix is in place.
author: ekpgh
ms.service: hpc-cache
ms.topic: troubleshooting
ms.date: 11/7/2019
ms.author: rohogue
---

# Work around Blob storage account firewall settings

A particular setting used in storage account firewalls can cause your Blob storage target creation to fail. The Azure HPC Cache team is working on a software fix for this problem, but you can work around it by following the instructions in this article.

The firewall setting that allows access only from "selected networks" can prevent the cache from creating a Blob storage target. This configuration is in the storage account's **Firewalls and virtual networks** settings page.

The issue is that the cache service uses a hidden service virtual network that is separate from customer environments. It isn't possible to explicitly authorize this network to access your storage account.

When you create a Blob storage target, the cache service uses this network to check whether or not the container is empty. If the firewall does not allow access from the hidden network, the check fails, and the storage target creation fails.

To work around the problem, temporarily change your firewall settings while creating the storage target:

1. Go to the storage account **Firewalls and virtual networks** page and change the setting "Allow access from" to **All networks**.
1. Create the Blob storage target in your Azure HPC Cache.
1. After the storage target has been created successfully, change the account's firewall setting back to **Selected networks**.

Azure HPC Cache does not use the service virtual network to access the finished storage target.

For help with this workaround, [contact Microsoft Service and Support](hpc-cache-support-ticket.md).
