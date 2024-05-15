---
title: Quickstart - Configure vaulted backup for Azure Blobs using Azure PowerShell
description: In this Quickstart, learn how to configure vaulted backup for Azure Blobs using Azure PowerShell.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 05/15/2024
ms.custom: mvc, devx-track-azurepowershell, mode-api
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure vaulted backup for Azure Blobs using Azure PowerShell

This quickstart describes how to configure vaulted backup for Azure Blobs using Azure PowerShell.

## Prerequisites

- Support for Azure Blobs is available from Az 5.9.0 version.
- Ensure you review the [support matrix](../backup/blob-backup-support-matrix.md) to learn about the Azure Blob region availability, supported scenarios, and limitations.
- You need to have a Backup vault to configure Azure Blob backup. If the Backup vault isn’t present, [create one](../backup/backup-blobs-storage-account-ps.md#create-a-backup-vault).

## Create a Backup policy

[!INCLUDE [blob-vaulted-backup-create-policy-ps.md](../../includes/blob-vaulted-backup-create-policy-ps.md)]


## Configure backup

[!INCLUDE [blob-vaulted-backup-configure-policy-ps.md](../../includes/blob-vaulted-backup-configure-policy-ps.md)]

## Prepare the request

[!INCLUDE [blob-vaulted-backup-prepare-request-ps.md](../../includes/blob-vaulted-backup-prepare-request-ps.md)]

## Next step

[Restore Azure blobs using Azure PowerShell](/azure/backup/restore-blobs-storage-account-ps).