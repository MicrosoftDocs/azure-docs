---
title: Overview of remediating anonymous public read access for blob data
titleSuffix: Azure Storage
description: Learn how to remediate anonymous public read access to blob data for both Azure Resource Manager and classic storage accounts.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/09/2022
ms.author: akashdubey
ms.reviewer: nachakra
ms.custom: devx-track-arm-template
---

# Overview: Remediating anonymous public read access for blob data

Azure Storage supports optional anonymous public read access for containers and blobs. By default, anonymous access to your data is never permitted. Unless you explicitly enable anonymous access, all requests to a container and its blobs must be authorized. We recommend that you disable anonymous public access for all of your storage accounts.

This article provides an overview of how to remediate anonymous public access for your storage accounts.

> [!WARNING]
> Anonymous public access presents a security risk. We recommend that you take the actions described in the following section to remediate public access for all of your storage accounts, unless your scenario specifically requires anonymous access.

## Recommendations for remediating anonymous public access

To remediate anonymous public access, first determine whether your storage account uses the Azure Resource Manager deployment model or the classic deployment model. For more information, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

### Azure Resource Manager accounts

If your storage account is using the Azure Resource Manager deployment model, then you can remediate public access by setting the account's **AllowBlobPublicAccess** property to **False**. After you set the **AllowBlobPublicAccess** property to **False**, all requests for blob data to that storage account will require authorization, regardless of the public access setting for any individual container.

To learn more about how to remediate public access for Azure Resource Manager accounts, see [Remediate anonymous public read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md).

### Classic accounts

If your storage account is using the classic deployment model, then you can remediate public access by setting each container's public access property to **Private**. To learn more about how to remediate public access for classic storage accounts, see [Remediate anonymous public read access to blob data (classic deployments)](anonymous-read-access-prevent-classic.md).

### Scenarios requiring anonymous access

If your scenario requires that certain containers need to be available for public access, then you should move those containers and their blobs into separate storage accounts that are reserved only for public access. You can then disallow public access for any other storage accounts using the recommendations provided in [Recommendations for remediating anonymous public access](#recommendations-for-remediating-anonymous-public-access).

For information on how to configure containers for public access, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

## Next steps

- [Remediate anonymous public read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md)
- [Remediate anonymous public read access to blob data (classic deployments)](anonymous-read-access-prevent-classic.md)
