---
title: Quickstart - Configure vaulted backup for Azure Blobs using Azure CLI
description: In this Quickstart, learn how to configure vaulted backup for Azure Blobs using Azure CLI.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 05/30/2024
ms.custom: mvc, devx-track-azurepowershell, mode-api
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure vaulted backup for Azure Blobs using Azure CLI

This quickstart describes how to configure vaulted backup for Azure Blobs using Azure PowerShell.

## Prerequisites

- Ensure you review the [support matrix](../backup/blob-backup-support-matrix.md) to learn about the Azure Blob region availability, supported scenarios, and limitations.
- You need to have a Backup vault to configure Azure Blob backup. If the Backup vault isn't present, [create one](../backup/backup-blobs-storage-account-ps.md#create-a-backup-vault).

## Create a backup policy

[!INCLUDE [blob-backup-create-policy-cli.md](../../includes/blob-backup-create-policy-cli.md)]

## Configure backup

[!INCLUDE [blob-backup-configure-policy-cli.md](../../includes/blob-backup-configure-policy-cli.md)]

## Prepare the request

[!INCLUDE [blob-backup-prepare-request-cli.md](../../includes/blob-backup-prepare-request-cli.md)]

## Next step

[Restore Azure Blobs using Azure CLI](/azure/backup/restore-blobs-storage-account-cli).



