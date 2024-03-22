---
title: Overview of remediating anonymous read access for blob data
titleSuffix: Azure Storage
description: Learn how to remediate anonymous read access to blob data for both Azure Resource Manager and classic storage accounts.
author: akashdubey-ms
ms.author: akashdubey
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/12/2023

ms.reviewer: nachakra
ms.custom: devx-track-arm-template
---

# Overview: Remediating anonymous read access for blob data

Azure Storage supports optional anonymous read access for containers and blobs. By default, anonymous access to your data is never permitted. Unless you explicitly enable anonymous access, all requests to a container and its blobs must be authorized. We recommend that you disable anonymous access for all of your storage accounts.

This article provides an overview of how to remediate anonymous access for your storage accounts.

> [!WARNING]
> Anonymous access presents a security risk. We recommend that you take the actions described in the following section to remediate anonymous access for all of your storage accounts, unless your scenario specifically requires anonymous access.

## Recommendations for remediating anonymous access

To remediate anonymous access, first determine whether your storage account uses the Azure Resource Manager deployment model or the classic deployment model. For more information, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

### Azure Resource Manager accounts

If your storage account is using the Azure Resource Manager deployment model, then you can remediate anonymous access for an account at any time by setting the account's **AllowBlobPublicAccess** property to **False**. After you set the **AllowBlobPublicAccess** property to **False**, all requests for blob data to that storage account will require authorization, regardless of the anonymous access setting for any individual container.

If your storage account is using the Azure Resource Manager deployment model, then you can remediate anonymous access for an account at any time by setting the account's **AllowBlobAnonymousAccess** property to **False**. After you set the **AllowBlobAnonymousAccess** property to **False**, all requests for blob data to that storage account will require authorization, regardless of the anonymous access setting for any individual container.

To learn more about how to remediate anonymous access for Azure Resource Manager accounts, see [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md).

### Classic accounts

If your storage account is using the classic deployment model, then you can remediate anonymous access by setting each container's access property to **Private**. To learn more about how to remediate anonymous access for classic storage accounts, see [Remediate anonymous read access to blob data (classic deployments)](anonymous-read-access-prevent-classic.md).

### Scenarios requiring anonymous access

If your scenario requires that certain containers need to be available for anonymous access, then you should move those containers and their blobs into separate storage accounts that are reserved only for anonymous access. You can then disallow anonymous access for any other storage accounts using the recommendations provided in [Recommendations for remediating anonymous access](#recommendations-for-remediating-anonymous-access).

For information on how to configure containers for anonymous access, see [Configure anonymous read access for containers and blobs](anonymous-read-access-configure.md).

## Next steps

- [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md)
- [Remediate anonymous read access to blob data (classic deployments)](anonymous-read-access-prevent-classic.md)
