---
title: Recover deleted Cognitive Services resource
titleSuffix: Azure Cognitive Services
description: This article provides instructions on how to recover an already-deleted Cognitive Services resource.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 06/01/2021
ms.author: nitinme
---

# Recover deleted Cognitive Services resources

This articles provides instructions on how to recover a Cognitive Services resource that is already deleted. The article also provides instructions on how to purge a deleted resource.

> [!NOTE]
> The instructions in this article are applicable to both multi-service resource and a single-service resource. A multi-service resource enables access to multiple cognitive services using a single key and endpoint. On the other hand, a single-service resource enables access to just that specific cognitive service for which the resource was created.

## Prerequisites

* The resource to be recovered should have been deleted within the past 48 hours.
* The resource to be recovered should not have been purged already. A purged resource cannot be recovered.
* Before you attempt to recover a deleted resource, make sure that the resource group for that account exists. If the resource group was deleted, you must recreate it. Recovering a resource group is not possible. For more information, see [Manage resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md).
* If the deleted resource used customer-managed keys with Azure Key Vault and the key vault has also been deleted, then you must restore the key vault before you restore the Cognitive Services resource. For more information, see [Azure Key Vault recovery management](../key-vault/general/key-vault-recovery.md).
* If the deleted resource used a customer-managed storage and storage account has also been deleted, you must restore the storage account before you restore the Cognitive Services resource. For instructions, see [Recover a deleted storage account](../storage/common/storage-account-recover.md)

## Recover a deleted resource using REST API

## Recover a deleted resource using PowerShell

## Purge a deleted resource using REST API

## Purge a deleted resource using PowerShell