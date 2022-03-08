---
title: Work around storage firewall settings
description: A storage account network firewall setting can cause failure when creating an Azure Blob storage target in Azure HPC Cache. This article gives a workaround for the limitation until a software fix is in place.
author: femila
ms.service: hpc-cache
ms.topic: troubleshooting
ms.date: 03/18/2021
ms.author: femila
---

# Work around Blob storage account firewall settings

A particular setting used in storage account firewalls can cause your Blob storage target creation to fail. The Azure HPC Cache team is working on a software fix for this problem, but you can work around it by following the instructions in this article.

The firewall setting that allows access only from "selected networks" can prevent the cache from creating or modifying a Blob storage target. This configuration is in the storage account's **Firewalls and virtual networks** settings page. (This issue does not apply to ADLS-NFS storage targets.)

The issue is that the cache service uses a hidden service virtual network that is separate from customer environments. It isn't possible to explicitly authorize this network to access your storage account.

When you create a Blob storage target, the cache service uses this network to check whether or not the container is empty. If the firewall does not allow access from the hidden network, the check fails, and the storage target creation fails.

The firewall also can block changes to Blob storage target namespace paths.

To work around the problem, temporarily change your firewall settings while creating the storage target:

1. Go to the storage account **Firewalls and virtual networks** page and change the setting "Allow access from" to **All networks**.
1. Create the Blob storage target in your Azure HPC Cache.
1. Create the storage target's namespace path.
1. After the storage target and path have been created successfully, change the account's firewall setting back to **Selected networks**.

Azure HPC Cache does not use the service virtual network to access the finished storage target.

For help with this workaround, [contact Microsoft Service and Support](hpc-cache-support-ticket.md).
