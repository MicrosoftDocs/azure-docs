---
title: Azure Managed HSM logging
description: Use this tutorial to help you get started with Managed HSM logging.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 03/16/2023
ms.author: mbaldwin
#Customer intent: As a Managed HSM administrator, I want to enable logging so I can monitor how my HSM is accessed.
---

# Managed HSM logging 

After you create one or more Managed HSMs, you'll likely want to monitor how and when your HSMs are accessed, and by who. You can do this by enabling logging, which saves information in an Azure storage account that you provide. A new container named **insights-logs-auditevent** is automatically created for your specified storage account. You can use this same storage account for collecting logs for multiple Managed HSMs.

You can access your logging information 10 minutes (at most) after the Managed HSM operation. In most cases, it will be quicker than this.  It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.

Use this tutorial to help you get started with Managed HSM logging. You'll create a storage account, enable logging, and interpret the collected log information.  

> [!NOTE]
> This tutorial does not include instructions for how to create Managed HSMs or keys. This article provides Azure CLI instructions for updating diagnostic logging.

## Prerequisites

To complete the steps in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* The Azure CLI version 2.25.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).
* A managed HSM in your subscription. See [Quickstart: Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) to provision and activate a managed HSM.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Connect to your Azure subscription

The first step in setting up key logging is to point Azure CLI to the Managed HSM that you want to log.

```azurecli-interactive
az login
```

For more information on login options via the CLI take a look at [sign in with Azure CLI](/cli/azure/authenticate-azure-cli)

You might have to specify the subscription that you used to create your Managed HSM. Enter the following command to see the subscriptions for your account:

## Identify the managed HSM and storage account

```azurecli-interactive
hsmresource=$(az keyvault show --hsm-name ContosoMHSM --query id -o tsv)
storageresource=$(az storage account show --name ContosoMHSMLogs --query id -o tsv)
```

## Enable logging

To enable logging for Managed HSM, use the **az monitor diagnostic-settings create** command, together with the variables that we created for the new storage account and the Managed HSM. We'll also set the **-Enabled** flag to **$true** and set the category to **AuditEvent** (the only category for Managed HSM logging):

This output confirms that logging is now enabled for your Managed HSM, and it will save information to your storage account.

Optionally, you can set a retention policy for your logs such that older logs are automatically deleted. For example, set retention policy by setting the **-RetentionEnabled** flag to **$true**, and set the **-RetentionInDays** parameter to **90** so that logs older than 90 days are automatically deleted.

```azurecli-interactive
az monitor diagnostic-settings create --name ContosoMHSM-Diagnostics --resource $hsmresource --logs '[{"category": "AuditEvent","enabled": true}]' --storage-account $storageresource
```

What's logged:

* All authenticated REST API requests, including failed requests as a result of access permissions, system errors, firewall blocks, or bad requests.
* Managed plane operations on the Managed HSM resource itself, including creation, deletion, and updating attributes such as tags.
* Security Domain related operations such as initialize & download, initialize recovery, upload
* Full HSM backup, restore and selective restore operations
* Role management operations such as create/view/delete role assignments and create/view/delete custom role definitions
* Operations on keys, including:
  * Creating, modifying, or deleting the keys.
  * Signing, verifying, encrypting, decrypting, wrapping and unwrapping keys, listing keys.
  * Key backup, restore, purge
* Invalid paths that result in a 404 response. 

## Access your logs

Managed HSM logs are stored in the **insights-logs-auditevent** container in the storage account that you provided. To view the logs, you have to download blobs. For information on Azure Storage, see [Create, download, and list blobs with Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md).

Individual blobs are stored as text, formatted as a JSON. Let's look at an example log entry. The example below shows the log entry when a request to create a full backup is sent to the managed HSM.

```json
[
  {
    "TenantId": "766eaf62-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "time": "2020-08-31T19:52:39.763Z",
    "resourceId": "/SUBSCRIPTIONS/A1BA9AAA-xxxx-xxxx-xxxx-xxxxxxxxxxxx/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/MANAGEDHSMS/CONTOSOMHSM",
    "operationName": "BackupCreate",
    "operationVersion": "7.0",
    "category": "AuditEvent",
    "resultType": "Success",
    "properties": {
        "PoolType": "M-HSM",
        "sku_Family": "B",
        "sku_Name": "Standard_B1"
    },
    "durationMs": 488,
    "callerIpAddress": "X.X.X.X",
    "identity": "{\"claim\":{\"appid\":\"04b07795-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"http_schemas_microsoft_com_identity\":{\"claims\":{\"objectidentifier\":\"b1c52bf0-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"}},\"http_schemas_xmlsoap_org_ws_2005_05_identity\":{\"claims\":{\"upn\":\"admin@contoso.com\"}}}}",
    "clientInfo": "azsdk-python-core/1.7.0 Python/3.8.2 (Linux-4.19.84-microsoft-standard-x86_64-with-glibc2.29) azsdk-python-azure-keyvault/7.2",
    "correlationId": "8806614c-ebc3-11ea-9e9b-00155db778ad",
    "subnetId": "(unknown)",
    "httpStatusCode": 202,
    "PoolName": "mhsmdemo",
    "requestUri": "https://ContosoMHSM.managedhsm.azure.net/backup",
    "resourceGroup": "ContosoResourceGroup",
    "resourceProvider": "MICROSOFT.KEYVAULT",
    "resource": "ContosoMHSM",
    "resourceType": "managedHSMs"
  }
]
```



## Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Managed HSM **AuditEvent** logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need.

For more information, including how to set this up, see [Azure Key Vault in Azure Monitor](../key-vault-insights-overview.md).

## Next steps

- Learn about [best practices](best-practices.md) to provision and use a managed HSM
- Learn about [how to Backup and Restore](backup-restore.md) a Managed HSM
