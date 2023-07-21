---
title: Options for securing a managed disk
description: Options for securing a managed disk
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 06/07/2023
ms.author: rogarana
ms.custom: references_regions
---

# Options for securing a managed disk

There are a few options for securing Azure managed disks.

## Custom role

To limit the amount of people who can export or import a managed disk, you can create a [custom RBAC role](../role-based-access-control/custom-roles-powershell.md) that doesn't have the following permissions:

- Microsoft.Compute/disks/download/action
- Microsoft.Compute/disks/upload/action
- Microsoft.Compute/snapshots/download/action
- Microsoft.Compute/snapshots/upload/action

Any custom role without those permissions can't export or import managed disks.

## Azure policy

Setting NetworkAccessPolicy to DenyAll for all the disks and snapshots in a subscription via an Azure policy

## Azure AD authentication

If you're using Azure Active Directory (Azure AD) to control resource access, you can also use it to restrict uploading of Azure managed disks. When a user attempts to upload a disk, Azure validates the identity of the requesting user in Azure AD, and confirms that user has the required permissions. To learn more, see either the [PowerShell](windows/disks-upload-vhd-to-managed-disk-powershell.md#secure-uploads-with-azure-ad) or [CLI](linux/disks-upload-vhd-to-managed-disk-cli.md#secure-uploads-with-azure-ad) articles.

## Private links

You can use private endpoints to restrict the export and import of managed disks and more securely access data over a private link from clients on your Azure virtual network. The private endpoint uses an IP address from the virtual network address space for your managed disks. Network traffic between clients on their virtual network and managed disks only traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. To learn more, see either the [portal](disks-enable-private-links-for-import-export-portal.md) or [CLI](linux/disks-export-import-private-links-cli.md) articles.