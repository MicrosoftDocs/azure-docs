---
title: Connect to Azure Blob Storage using the SFTP protocol (preview) | Microsoft Docs
description: Learn how to connect to an Azure Storage account by using an SFTP client.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 09/07/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)

You can securely connect to an Azure Storage account by using an SFTP client, and then manage your objects by using file system semantics. This article provides step-by-step guidance that helps you use SFTP to interact with Azure Blob Storage. To learn more about SFTP protocol support in Azure Blob Storage, see [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md).

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: Central US, East US, Canada, West Europe, Australia, East Asia, and North Europe.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

## Prerequisites

- A standard general-purpose v2 or premium block blob storage account. For more information on these types of storage accounts, see [Storage account overview](../common/storage-account-overview.md).

- Account redundancy option of the storage account is set to either locally-redundant storage (LRS) or zone-redundant storage (ZRS).

- The hierarchical namespace feature of the account must be enabled.

- If you're connecting from an on-premises network, make sure that your client allows outgoing communication through port 22. The SFTP protocol uses that port.

## Register the SFTP feature

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your subscription, and in configuration page of your subscription, select **Preview features**.

3. In the **Preview features** page, select the **AllowSFTP** feature, and then select **Register**.

### [PowerShell](#tab/powershell)

1. Open a Windows PowerShell command window.

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Register the `AllowSFTP` feature by using the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) command.

   ```powershell
   Register-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowSFTP
   ```

   > [!NOTE]
   > The registration process might not complete immediately. Make sure to verify that the feature is registered before using it.

### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Register the `HnsOnMigration` feature by using the [az feature register](/cli/azure/feature#az_feature_register) command.

   ```azurecli
   az feature register --namespace Microsoft.Storage --name AllowSFTP
   ```

   > [!NOTE]
   > The registration process might not complete immediately. Make sure to verify that the feature is registered before using it.

---

## Verify that the feature is registered

### [Portal](#tab/azure-portal)

In the **Preview features** page of your subscription, locate the **AllowSFTP** feature, and then make sure that **Registered** appears in the **State** column.

### [PowerShell](#tab/powershell)

To verify that the registration is complete, use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName AllowSFTP
```

### [Azure CLI](#tab/azure-cli)

To verify that the registration is complete, use the [az feature](/cli/azure/feature#az_feature_show) command.

```azurecli
az feature show --namespace Microsoft.Storage --name AllowSFTP
```

---

## Enable SFTP support

### [Portal](#tab/azure-portal)

To enable SFTP support for your storage account by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.

2. Put steps here.

### [PowerShell](#tab/powershell)

To enable SFTP support with PowerShell, use the [Need command](/powershell/module/az.storage/enable-azstorageblobdeleteretentionpolicy) command.

The following example enables SFTP support. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
command-goes-here <parameter-goes-here>
```

### [Azure CLI](#tab/azure-cli)

To enable SFTP support with Azure CLI, use the [Need command](/powershell/module/az.storage/enable-azstorageblobdeleteretentionpolicy) command. 

The following example enables SFTP support. Remember to replace the placeholder values in brackets with your own values:

```azurecli
command-goes-here --parameter-name-goes-here <parameter-value-goes-here>
```

---

## Connect to Azure Blob Storage and transfer data

Put any guidance here - if appropriate.

---

## Resolve common errors

|Error | Cause / resolution|
|---|---|
|`Error`|Cause / resolution |


## See also

- [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
