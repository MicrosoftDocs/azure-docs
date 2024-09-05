---
title: Quickstart - Configure vaulted backup for Azure Blobs using Azure PowerShell
description: In this Quickstart, learn how to configure vaulted backup for Azure Blobs using Azure PowerShell.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 07/24/2024
ms.custom: mvc, devx-track-azurepowershell, mode-api
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure vaulted backup for Azure Blobs using Azure Backup via Azure PowerShell

This quickstart describes how to configure vaulted backup for Azure Blobs using Azure PowerShell.

[!INCLUDE [blob-vaulted-backup-introduction.md](../../includes/blob-vaulted-backup-introduction.md)]

## Prerequisites

Before you configure blob vaulted backup, ensure that:

- You install the Azure PowerShell version **Az 5.9.0**.
- You review the [support matrix](../backup/blob-backup-support-matrix.md) to learn about the Azure Blob region availability, supported scenarios, and limitations.
- You have a Backup vault to configure Azure Blob backup. If you haven't created the Backup vault, [create one](../backup/backup-blobs-storage-account-ps.md#create-a-backup-vault).

## Create a backup policy

[!INCLUDE [blob-vaulted-backup-create-policy-ps.md](../../includes/blob-vaulted-backup-create-policy-ps.md)]


## Configure backup

[!INCLUDE [blob-vaulted-backup-configure-policy-ps.md](../../includes/blob-vaulted-backup-configure-policy-ps.md)]

## Prepare the request to configure blob backup

[!INCLUDE [blob-vaulted-backup-prepare-request-ps.md](../../includes/blob-vaulted-backup-prepare-request-ps.md)]

## Next step

[Restore Azure blobs using Azure PowerShell](/azure/backup/restore-blobs-storage-account-ps).