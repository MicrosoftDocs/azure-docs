---
title: Quickstart - Configure vaulted backup for Azure Blobs using Azure CLI
description: In this Quickstart, learn how to configure vaulted backup for Azure Blobs using Azure CLI.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 07/02/2025
ms.custom: mvc, devx-track-azurepowershell, mode-api
author: jyothisuri
ms.author: jsuri
# Customer intent: As a cloud administrator, I want to configure vaulted backup for Azure Blobs using CLI, so that I can automate the backup process and ensure data protection for my cloud resources.
---

# Quickstart: Configure vaulted backup for Azure Blobs using Azure Backup via Azure CLI

This quickstart describes how to configure vaulted backup for Azure Blobs using Azure CLI. You can also [configure backup using REST API](backup-azure-dataprotection-use-rest-api-backup-blobs.md).

[!INCLUDE [blob-vaulted-backup-introduction.md](../../includes/blob-vaulted-backup-introduction.md)]

## Prerequisites

Before you configure blob vaulted backup, ensure that:

- You review the [support matrix](../backup/blob-backup-support-matrix.md) to learn about the Azure Blob region availability, supported scenarios, and limitations.
- You have a Backup vault to configure Azure Blob backup. If you haven't created the Backup vault, [create one](../backup/backup-blobs-storage-account-ps.md#create-a-backup-vault).

## Create a backup policy

[!INCLUDE [blob-backup-create-policy-cli.md](../../includes/blob-backup-create-policy-cli.md)]

## Configure backup

[!INCLUDE [blob-backup-configure-policy-cli.md](../../includes/blob-backup-configure-policy-cli.md)]

## Prepare the request to configure blob backup

[!INCLUDE [blob-backup-prepare-request-cli.md](../../includes/blob-backup-prepare-request-cli.md)]

## Next step

Restore Azure Blobs by Azure Backup using [Azure portal](blob-restore.md), [Azure PowerShell](restore-blobs-storage-account-ps.md), [Azure CLI](restore-blobs-storage-account-cli.md), [REST API](backup-azure-dataprotection-use-rest-api-restore-blobs.md).


