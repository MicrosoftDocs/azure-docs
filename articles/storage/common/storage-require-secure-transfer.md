---
title: Require secure transfer in Azure Storage | Microsoft Docs
description: Learn about the "Secure transfer required" feature for Azure Storage, and how to enable it.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/20/2017
ms.author: tamram
ms.reviewer: fryu
ms.subservice: common
---

# Require secure transfer in Azure Storage

The "Secure transfer required" option enhances the security of your storage account by only allowing requests to the account from secure connections. For example, when you're calling REST APIs to access your storage account, you must connect by using HTTPS. "Secure transfer required" rejects requests that use HTTP.

When you use the Azure Files service, any connection without encryption fails when "Secure transfer required" is enabled. This includes scenarios that use SMB 2.1, SMB 3.0 without encryption, and some versions of the Linux SMB client. 

By default, the "Secure transfer required" option is disabled when you create a storage account with SDK. And it's enabled by default when you create a storage account in Azure Portal.

> [!NOTE]
> Because Azure Storage doesn't support HTTPS for custom domain names, this option is not applied when you're using a custom domain name. And classic storage accounts are not supported.

## Enable "Secure transfer required" in the Azure portal

You can turn on the "Secure transfer required" setting when you create a storage account in the [Azure portal](https://portal.azure.com). You can also enable it for existing storage accounts.

### Require secure transfer for a new storage account

1. Open the **Create storage account** pane in the Azure portal.
1. Under **Secure transfer required**, select **Enabled**.

   ![Create storage account blade](./media/storage-require-secure-transfer/secure_transfer_field_in_portal_en_1.png)

### Require secure transfer for an existing storage account

1. Select an existing storage account in the Azure portal.
1. In the storage account menu pane, under **SETTINGS**, select **Configuration**.
1. Under **Secure transfer required**, select **Enabled**.

   ![Storage account menu pane](./media/storage-require-secure-transfer/secure_transfer_field_in_portal_en_2.png)

## Enable "Secure transfer required" programmatically

To require secure transfer programmatically, use the setting _supportsHttpsTrafficOnly_ in storage account properties with REST API, tools, or libraries:

* [REST API](https://docs.microsoft.com/rest/api/storagerp/storageaccounts) (version: 2016-12-01)
* [PowerShell](https://docs.microsoft.com/powershell/module/az.storage/set-azstorageaccount) (version: 0.7)
* [CLI](https://pypi.python.org/pypi/azure-cli-storage/2.0.11) (version: 2.0.11)
* [NodeJS](https://www.npmjs.com/package/azure-arm-storage/) (version: 1.1.0)
* [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/6.3.0-preview) (version: 6.3.0)
* [Python SDK](https://pypi.python.org/pypi/azure-mgmt-storage/1.1.0) (version: 1.1.0)
* [Ruby SDK](https://rubygems.org/gems/azure_mgmt_storage) (version: 0.11.0)

### Enable "Secure transfer required" setting with PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This sample requires the Azure PowerShell module Az version 0.7 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

Run `Connect-AzAccount` to create a connection with Azure.

 Use the following command line to check the setting:

```powershell
> Get-AzStorageAccount -Name "{StorageAccountName}" -ResourceGroupName "{ResourceGroupName}"
StorageAccountName     : {StorageAccountName}
Kind                   : Storage
EnableHttpsTrafficOnly : False
...

```

Use the following command line to enable the setting:

```powershell
> Set-AzStorageAccount -Name "{StorageAccountName}" -ResourceGroupName "{ResourceGroupName}" -EnableHttpsTrafficOnly $True
StorageAccountName     : {StorageAccountName}
Kind                   : Storage
EnableHttpsTrafficOnly : True
...

```

### Enable "Secure transfer required" setting with CLI

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 Use the following command line to check the setting:

```azurecli-interactive
> az storage account show -g {ResourceGroupName} -n {StorageAccountName}
{
  "name": "{StorageAccountName}",
  "enableHttpsTrafficOnly": false,
  "type": "Microsoft.Storage/storageAccounts"
  ...
}

```

Use the following command line to enable the setting:

```azurecli-interactive
> az storage account update -g {ResourceGroupName} -n {StorageAccountName} --https-only true
{
  "name": "{StorageAccountName}",
  "enableHttpsTrafficOnly": true,
  "type": "Microsoft.Storage/storageAccounts"
  ...
}

```

## Next steps
Azure Storage provides a comprehensive set of security capabilities, which together enable developers to build secure applications. For more details, go to the [Storage Security Guide](storage-security-guide.md).
