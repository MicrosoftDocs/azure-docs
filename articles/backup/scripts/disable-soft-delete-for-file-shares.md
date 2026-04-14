---
title: Script Sample - Disable Soft delete for File Share using ARM API
description: Learn how to use a script to disable soft delete for file shares in a storage account.
ms.topic: sample
ms.date: 10/13/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to disable soft delete for file shares in a storage account using a script, so that I can manage storage costs and configuration based on my organization's data retention policies."
---

# Disable soft delete for file shares in a storage account using ARM API

This article describes how to disable soft delete for file shares in a storage account using Azure Resource Manager (ARM) API. You can also [disable soft delete for file shares using the Azure portal, PowerShell, and Azure CLI](/azure/storage/files/storage-files-prevent-file-share-deletion?tabs=azure-portal#disable-soft-delete).

## Disable soft delete for file shares using the ARM client

To disable soft delete for file shares using the ARM client, follow these steps:

1. Install armclient. To learn how to install it, visit [this link](https://github.com/projectkudu/ARMClient).

2. Save the following two request body files to a folder on your machine.

    ```json
    rqbody-enableSoftDelete.json

    {
    "properties": {
        "shareDeleteRetentionPolicy": {
        "enabled":true,
        "days": 14
        }
    },
    "cors": {
        "corsRules": []
    }
    }

    rqbody-disableSoftDelete.json

    {
    "properties": {
        "shareDeleteRetentionPolicy": {
        "enabled":false,
        "days": 0
        }
    },
    "cors": {
        "corsRules": []
    }
    }
    ```

3. Keep your storage account Azure Resource Manager (ARM) ID handy. For example: `/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/afsshare/providers/Microsoft.Storage/storageAccounts/inquirytest`

4. Sign in using your credentials by running **armclient login**.

5. Get the current soft delete properties of file shares in storage account.

    The following GET operation fetches the soft delete properties for file shares in the `inquirytest` account:

    ```cmd
    armclient get /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/afsshare /providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/default?api-version=2019-04-01
    ```

    ```output
    {
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/Bugbash/providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/de
    fault",
    "name": "default",
    "type": "Microsoft.Storage/storageAccounts/fileServices",
    "properties": {
        "cors": {
        "corsRules": []
        },
        "shareDeleteRetentionPolicy": {
        "enabled": true,
        "days": 14
        }
    }
    }
    ```

6. Disable Soft Delete for File shares in storage account.

    The following PUT operation disables the soft delete properties for file shares in the `inquirytest` account:

    ```cmd
    armclient put /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/afsshare /providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/default?api-version=2019-04-01 .\rqbody-disableSoftDelete.json
    ```

    ```Output
    {
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/Bugbash/providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/de
    fault",
    "name": "default",
    "type": "Microsoft.Storage/storageAccounts/fileServices",
    "properties": {
        "shareDeleteRetentionPolicy": {
        "enabled": false,
        "days": 0
        }
    }
    }
    ```

7. If you want to reenable soft delete, use the following sample.

    The following PUT operation enables the soft delete properties for file shares in `inquirytest` `account.

    ```cmd
    armclient put /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/afsshare /providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/default?api-version=2019-04-01 .\rqbody-EnableSoftDelete.json
    ```

    ```Output
    {
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/Bugbash/providers/Microsoft.Storage/storageAccounts/inquirytest/fileServices/default",
    "name": "default",
    "type": "Microsoft.Storage/storageAccounts/fileServices",
    "properties": {
        "shareDeleteRetentionPolicy": {
        "enabled": true,
        "days": 14
        }
    }
    }
    ```

## Related content

[Frequently asked questions for Azure Backup Soft Delete for Azure Files](../soft-delete-azure-file-share.md#frequently-asked-questions-azure-backup-soft-delete-for-azure-files)