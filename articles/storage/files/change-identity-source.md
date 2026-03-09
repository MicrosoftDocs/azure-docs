---
title: Change the Identity Source for Azure Files
description: Learn how to switch between identity sources for Azure Files identity-based authentication for SMB file shares by disabling your current identity source and enabling a new one.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/06/2026
ms.author: kendownie
# Customer intent: As a storage administrator, I want to change the identity source configured on my storage account, so that I can switch to a different authentication method for Azure file shares.
---

# Change the identity source for Azure file shares

**Applies to:** :heavy_check_mark: SMB Azure file shares

Azure Files supports only one identity source per storage account for identity-based authentication over SMB. If you want to switch from one identity source to another, you must first disable the current identity source and then enable the new one.

For guidance on choosing the right identity source for your environment, see [Overview of Azure Files identity-based authentication for SMB access](storage-files-active-directory-overview.md).

> [!IMPORTANT]
> Disabling the current identity source removes identity-based access for all file shares in the storage account immediately. Users can't access shares using identity-based authentication until you enable and configure a new identity source.

## Step 1: Verify the current identity source

First, verify the identity source that's currently enabled on your storage account. Supported identity sources for SMB Azure file shares are Active Directory Domain Services (AD DS), Microsoft Entra Domain Services, and Microsoft Entra Kerberos.

# [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and select the storage account.

1. From the service menu, under **Data storage**, select **File shares**.

1. Next to **Identity-based access**, check the configuration status. If it shows **Configured**, proceed to the next step. If it shows **Not configured**, then no identity source is enabled on the storage account and you can proceed to [Enable a new identity source](#step-3-enable-a-new-identity-source).

   :::image type="content" source="media/change-identity-source/configure-identity-based-access.png" alt-text="Screenshot of the file shares pane in your storage account, identity-based access configuration status is highlighted." lightbox="media/change-identity-source/configure-identity-based-access.png":::

1. Select **Configured**.

1. The portal shows the identity source that's enabled on the storage account and its configuration status. Other identity sources are grayed out. In this example, Microsoft Entra Kerberos is enabled as the identity source for the storage account.

   :::image type="content" source="media/change-identity-source/identity-source-status.png" alt-text="Screenshot showing which identity source is enabled on the storage account." lightbox="media/change-identity-source/identity-source-status.png":::

# [Azure PowerShell](#tab/powershell)

Check the identity source that's enabled on your storage account by running the following cmdlet. Replace `<resource-group-name>` and `<storage-account-name>` with your values.

If the cmdlet returns **None**, then no identity source is enabled on the storage account and you can proceed to [Enable a new identity source](#step-3-enable-a-new-identity-source).

```azurepowershell
# Get the target storage account
$storageaccount = Get-AzStorageAccount `
        -ResourceGroupName "<resource-group-name>" `
        -Name "<storage-account-name>"

# List the identity source for the selected storage account
$storageAccount.AzureFilesIdentityBasedAuth.DirectoryServiceOptions
```

# [Azure CLI](#tab/cli)

Check the identity source that's enabled on your storage account by running the following command. Replace `<resource-group-name>` and `<storage-account-name>` with your values.

If the command returns **None**, then no identity source is enabled on the storage account and you can proceed to [Enable a new identity source](#step-3-enable-a-new-identity-source).

```azurecli
az storage account show --name <storage-account-name> --resource-group <resource-group-name> --query "azureFilesIdentityBasedAuthentication.directoryServiceOptions" --output tsv
```

---

## Step 2: Disable the current identity source

Disable your current identity source by using the Azure portal, Azure PowerShell, or Azure CLI.

### Active Directory Domain Services (AD DS)

# [Portal](#tab/portal)

To disable AD DS on the storage account, follow these steps.

1. Under **Active Directory Domain Services (AD DS)**, select **Configure**.
1. Select the **Disable Active Directory for this storage account** checkbox.
1. Select **Save**.

> [!IMPORTANT]
> After disabling AD DS authentication, consider deleting the AD DS computer account or service logon account that you created to represent the storage account in your on-premises AD. If you leave the identity in AD DS, it remains as an orphaned object.

# [Azure PowerShell](#tab/powershell)

To disable AD DS on the storage account, run the following cmdlet. Replace the placeholder values with your own.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableActiveDirectoryDomainServicesForFile $false
```

# [Azure CLI](#tab/cli)

To disable AD DS on the storage account, run the following command. Replace the placeholder values with your own.

```azurecli
az storage account update --name <storage-account-name> --resource-group <resource-group-name> --enable-files-adds false
```

---

### Microsoft Entra Domain Services

# [Portal](#tab/portal)

To disable Microsoft Entra Domain Services on the storage account, follow these steps.

1. Under **Microsoft Entra Domain Services**, select **Configure**.
1. Uncheck the **Enable Microsoft Entra Domain Services** checkbox.
1. Select **Save**.

# [Azure PowerShell](#tab/powershell)

To disable Microsoft Entra Domain Services on the storage account, run the following cmdlet. Replace the placeholder values with your own.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryDomainServicesForFile $false
```

# [Azure CLI](#tab/cli)

To disable Microsoft Entra Domain Services on the storage account, run the following command. Replace the placeholder values with your own.

```azurecli
az storage account update --name <storage-account-name> --resource-group <resource-group-name> --enable-files-aadds false
```

---

### Microsoft Entra Kerberos

# [Portal](#tab/portal)

To disable Microsoft Entra Kerberos on the storage account, follow these steps.

1. Under **Microsoft Entra Kerberos**, select **Configure**.
1. Uncheck the **Microsoft Entra Kerberos** checkbox.
1. Select **Save**.

# [Azure PowerShell](#tab/powershell)

To disable Microsoft Entra Kerberos on the storage account, run the following cmdlet. Replace the placeholder values with your own.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $false
```

# [Azure CLI](#tab/cli)

To disable Microsoft Entra Kerberos on the storage account, run the following command. Replace the placeholder values with your own.

```azurecli
az storage account update --name <storage-account-name> --resource-group <resource-group-name> --enable-files-aadkerb false
```

---

## Step 3: Enable a new identity source

After disabling the current identity source, follow the instructions for the new identity source you want to enable:

- **Active Directory Domain Services (AD DS)**: See [Enable AD DS authentication](storage-files-identity-ad-ds-enable.md).
- **Microsoft Entra Domain Services**: See [Enable Microsoft Entra Domain Services authentication](storage-files-identity-auth-domain-services-enable.md).
- **Microsoft Entra Kerberos**: See [Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities](storage-files-identity-auth-hybrid-identities-enable.md).
