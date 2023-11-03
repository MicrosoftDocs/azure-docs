---
title: Backup and restore an Azure Managed CCF resource
description: Learn to back up and restore an Azure Managed CCF resource
services: managed-ccf
author: pallabpaul
ms.service: confidential-ledger
ms.topic: how-to
ms.date: 09/07/2023
ms.author: pallabpaul
#Customer intent: As a developer, I want to know how to perform a backup and restore of my Managed CCF app so that I can can access backups of my app files and restore my app in another region in the case of a disaster recovery.
---

# Perform a backup and restore

In this article, you'll learn to perform backup of an Azure Managed CCF (Managed CCF) resource and restore it to create a copy of the original Managed CCF resource. Here are some of the use cases that warrant this capability:  

- A Managed CCF resource is an append only ledger at the core. It is impossible to delete few erroneous transactions without impacting the integrity of the ledger. To keep the data clean, a business could decide to recreate the resource sans the erroneous transactions.  
- A developer could add reference data into a Managed CCF resource and create a back of it. The developer can use the copy later to create a fresh Managed CCF resource and save time.

This article uses the commands found at the [Managed CCF's REST API Docs](/rest/api/confidentialledger/managed-ccf).

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli).
- An Azure Storage Account.

## Setup

### Generate an access token

An access token is required to use the Managed CCF REST API. Execute the following command to generate an access token.

> [!NOTE]
> An access token has a finite lifetime after which it is unusable. Generate a new token if the API request fails due to a HTTP 401 Unauthorized error.

```bash
az account get-access-token –subscription <subscription_id>
```

### Generate a Shared Access Signature token

The backup is stored in an Azure Storage Fileshare that is owned and controlled by you. The backup and restore API requests require a [Shared Access Signature](../storage/common/storage-sas-overview.md) token to grant temporary read and write access to the Fileshare. Follow these steps:

> [!NOTE]
> A Shared Access Signature(SAS) token has a finite lifetime after which it is unusable. We recommend using short lived tokens to avoid tokens being leaked into the public and misused.

1. Navigate to the Azure Storage Account where the backups will be stored.
2. Navigate to the `Security + networking` -> `Shared access signature` blade.
3. Generate a SAS token with the following configuration:

    :::image type="content" source="./media/how-to/cedr-sas-uri.png" lightbox="./media/how-to/cedr-sas-uri.png" alt-text="Screenshot of the Azure portal in a web browser, showing the required SAS Generation configuration.":::
4. Save the `File service SAS URL`.

## Backup

### Create a backup

Creating a backup of the Managed CCF resource creates a Fileshare in the storage account. This backup can be used to restore the Managed CCF resource at a later time.

Follow these steps to perform a backup.

1. [Generate and save a bearer token](#generate-an-access-token) generated for the subscription that your Managed CCF resource is located in.
1. [Generate a SAS token](#generate-a-shared-access-signature-token) for the Storage Account to store the backup.
1. Execute the following command to trigger a backup. You must supply a few parameters:
   - **subscription_id**: The subscription where the Managed CCF resource is deployed.
   - **resource_group**: The resource group name of the Managed CCF resource.
   - **app_name**: The name of the Managed CCF resource.
   - **sas_token**: The Shared Access Signature token.
   - **restore_region**: An optional parameter to indicate a region where the backup would be restored. It can be ignored if you expect to restore the backup in the same region as the Managed CCF resource.
    ```bash
    curl --request POST 'https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ConfidentialLedger/ManagedCCFs/<app_name>/backup?api-version=2023-06-28-preview' \
    --header 'Authorization: Bearer <bearer_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "uri": "<sas_token>",
      "restoreRegion": "<restore_region>"
    }'
    ```
1. A Fileshare is created in the Azure Storage Account with the name `<mccf_app_name>-<timestamp>`.

### Explore the backup files

After the backup completes, you can view the files stored in your Azure Storage Fileshare.

:::image type="content" source="./media/how-to/cedr-backup-file-share.png" lightbox="./media/how-to/cedr-backup-file-share.png" alt-text="Screenshot of the Azure portal in a web browser, showing a sample Fileshare folder structure.":::

Refer to the following articles to explore the backup files.

- [Understanding your Ledger and Snapshot Files](https://microsoft.github.io/CCF/main/operations/ledger_snapshot.html)
- [Viewing your Ledger and Snapshot Files](https://microsoft.github.io/CCF/main/audit/python_library.html)

## Restore

### Create a Managed CCF resource using the backup files

This restores the Managed CCF resource using a copy of the files in the backup Fileshare. The resource will be restored to the same state and transaction ID at the time of the backup.

> [!IMPORTANT]
> The restore will fail if the backup files are older than 90 days.

> [!NOTE]
> The original Managed CCF resource must be deleted before a restore is initiated. The restore command will fail if the original instance exists. [Delete your original Managed CCF resource](/cli/azure/confidentialledger/managedccfs?#az-confidentialledger-managedccfs-delete).
>
> The **app_name** should be the same as the original Managed CCF resource.

Follow these steps to perform a restore.

1. [Generate a Bearer token](#generate-an-access-token) for the subscription that the Managed CCF resource is located in.
2. [Generate a SAS token](#generate-a-shared-access-signature-token) for the storage account that has the backup files.
3. Execute the following command to trigger a restore. You must supply a few parameters.
    - **subscription_id**: The subscription where the Managed CCF resource is deployed.
    - **resource_group**: The resource group name of the Managed CCF resource.
    - **app_name**: The name of the Managed CCF resource.
    - **sas_token**: The Shared Access Signature token.
    - **restore_region**: An optional parameter to indicate a region where the backup would be restored. It can be ignored if you expect to restore the backup in the same region as the Managed CCF resource.
    - **fileshare_name**: The name of the Fileshare where the backup files are located.

    ```bash
    curl --request POST 'https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ConfidentialLedger/ManagedCCFs/<app_name>/restore?api-version=2023-06-28-preview' \
    --header 'Authorization: Bearer <bearer_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "uri": "<sas_token>",
      "restoreRegion": "<restore_region>",
      "fileShareName": "<fileshare_name>"
    }'
    ```
1. At the end of the command, the Managed CCF resource is restored.

## Next steps

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Azure CLI](quickstart-python.md)
