---
title: Use Azure AD Domain Services to authorize access to file data over SMB
description: Learn how to enable identity-based authentication over Server Message Block (SMB) for Azure Files through Azure Active Directory Domain Services. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using Azure AD credentials.
author: roygara

ms.service: storage
ms.topic: how-to
ms.date: 04/21/2020
ms.author: rogarana
ms.subservice: files
---

# Enable Azure Active Directory Domain Services authentication on Azure Files

[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

For an overview of Azure AD authentication over SMB for Azure file shares, see [Overview of Azure Active Directory authentication over SMB for Azure Files](storage-files-active-directory-overview.md). This article is focused on how to enable authentication with Azure Active Directory Domain Services (Azure AD DS) on Azure Files.

> [!NOTE]
> Azure Files supports Kerberos authentication with Azure AD DS with RC4-HMAC encryption. AES Kerberos encryption is not yet supported.
> Azure Files supports authentication for Azure AD DS with full synchronization with Azure AD. If you have enabled scoped synchronization in Azure AD DS which only sync a limited set of identities from Azure AD, authentication and authorization is not supported.

## Prerequisites

Before you enable Azure AD over SMB for Azure file shares, make sure you have completed the following prerequisites:

1.  **Select or create an Azure AD tenant.**

    You can use a new or existing tenant for Azure AD authentication over SMB. The tenant and the file share that you want to access must be associated with the same subscription.

    To create a new Azure AD tenant, you can [Add an Azure AD tenant and an Azure AD subscription](https://docs.microsoft.com/windows/client-management/mdm/add-an-azure-ad-tenant-and-azure-ad-subscription). If you have an existing Azure AD tenant but want to create a new tenant for use with Azure file shares, see [Create an Azure Active Directory tenant](https://docs.microsoft.com/rest/api/datacatalog/create-an-azure-active-directory-tenant).

1.  **Enable Azure AD Domain Services on the Azure AD tenant.**

    To support authentication with Azure AD credentials, you must enable Azure AD Domain Services for your Azure AD tenant. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/tutorial-create-instance.md).

    It typically takes about 15 minutes for an Azure AD DS deployment to complete. Verify that the health status of Azure AD DS shows **Running**, with password hash synchronization enabled, before proceeding to the next step.

1.  **Domain-join an Azure VM with Azure AD DS.**

    To access a file share by using Azure AD credentials from a VM, your VM must be domain-joined to Azure AD DS. For more information about how to domain-join a VM, see [Join a Windows Server virtual machine to a managed domain](../../active-directory-domain-services/join-windows-vm.md).

    > [!NOTE]
    > Azure AD DS authentication over SMB with Azure file shares is supported only on Azure VMs running on OS versions above Windows 7 or Windows Server 2008 R2.

1.  **Select or create an Azure file share.**

    Select a new or existing file share that's associated with the same subscription as your Azure AD tenant. For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md).
    For optimal performance, we recommend that your file share be in the same region as the VM from which you plan to access the share.

1.  **Verify Azure Files connectivity by mounting Azure file shares using your storage account key.**

    To verify that your VM and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

## Regional availability

Azure Files authentication with Azure AD DS is available in [all Azure Public regions](https://azure.microsoft.com/global-infrastructure/locations/).

## Overview of the workflow

Before you enable Azure AD DS Authentication over SMB for Azure file shares, verify that your Azure AD and Azure Storage environments are properly configured. We recommend that you walk through the [prerequisites](#prerequisites) to make sure you've completed all the required steps.

Next, do the following things to grant access to Azure Files resources with Azure AD credentials:

1. Enable Azure AD DS authentication over SMB for your storage account to register the storage account with the associated Azure AD DS deployment.
2. Assign access permissions for a share to an Azure AD identity (a user, group, or service principal).
3. Configure NTFS permissions over SMB for directories and files.
4. Mount an Azure file share from a domain-joined VM.

The following diagram illustrates the end-to-end workflow for enabling Azure AD DS authentication over SMB for Azure Files.

![Diagram showing Azure AD over SMB for Azure Files workflow](media/storage-files-active-directory-enable/azure-active-directory-over-smb-workflow.png)

## 1. Enable Azure AD DS authentication for your account

To enable Azure AD DS authentication over SMB for Azure Files, you can set a property on storage accounts by using the Azure portal, Azure PowerShell, or Azure CLI. Setting this property implicitly "domain joins" the storage account with the associated Azure AD DS deployment. Azure AD DS authentication over SMB is then enabled for all new and existing file shares in the storage account.

Keep in mind that you can enable Azure AD DS authentication over SMB only after you have successfully deployed Azure AD DS to your Azure AD tenant. For more information, see the [prerequisites](#prerequisites).

### Azure portal

To enable Azure AD DS authentication over SMB with the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your existing storage account, or [create a storage account](../common/storage-account-create.md).
1. In the **Settings** section, select **Configuration**.
1. Under **Identity-based access for file shares** switch the toggle for **Azure Active Directory Domain Service (AAD DS)** to **Enabled**.
1. Select **Save**.

The following image shows how to enable Azure AD DS authentication over SMB for your storage account.

![Enable Azure AD DS authentication over SMB in the Azure portal](media/storage-files-active-directory-enable/portal-enable-active-directory-over-smb.png)

### PowerShell  

To enable Azure AD DS authentication over SMB with Azure PowerShell, install the latest Az module (2.4 or newer) or the Az.Storage module (1.5 or newer). For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-Az-ps).

To create a new storage account, call [New-AzStorageAccount](https://docs.microsoft.com/powershell/module/az.storage/New-azStorageAccount?view=azps-2.5.0), and then set the **EnableAzureActiveDirectoryDomainServicesForFile** parameter to **true**. In the following example, remember to replace the placeholder values with your own values. (If you were using the previous preview module, the parameter for feature enablement is **EnableAzureFilesAadIntegrationForSMB**.)

```powershell
# Create a new storage account
New-AzStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -Location "<azure-region>" `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -EnableAzureActiveDirectoryDomainServicesForFile $true
```

To enable this feature on existing storage accounts, use the following command:

```powershell
# Update a storage account
Set-AzStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -EnableAzureActiveDirectoryDomainServicesForFile $true
```


### Azure CLI

To enable Azure AD authentication over SMB with Azure CLI, install the latest CLI version (Version 2.0.70 or newer). For more information about installing Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

To create a new storage account, call [az storage account create](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create), and set the `--enable-files-aadds` property to **true**. In the following example, remember to replace the placeholder values with your own values. (If you were using the previous preview module, the parameter for feature enablement is **file-aad**.)

```azurecli-interactive
# Create a new storage account
az storage account create -n <storage-account-name> -g <resource-group-name> --enable-files-aadds $true
```

To enable this feature on existing storage accounts, use the following command:

```azurecli-interactive
# Update a new storage account
az storage account update -n <storage-account-name> -g <resource-group-name> --enable-files-aadds $true
```

[!INCLUDE [storage-files-aad-permissions-and-mounting](../../../includes/storage-files-aad-permissions-and-mounting.md)]

You have now successfully enabled Azure AD DS authentication over SMB and assigned a custom role that provides access to an Azure file share with an Azure AD identity. To grant additional users access to your file share, follow the instructions in the [Assign access permissions](#2-assign-access-permissions-to-an-identity) to use an identity and [Configure NTFS permissions over SMB sections](#3-configure-ntfs-permissions-over-smb).

## Next steps

For more information about Azure Files and how to use Azure AD over SMB, see these resources:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)
