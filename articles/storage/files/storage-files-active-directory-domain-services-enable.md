---
title: Enable Active Directory authentication over SMB for Azure Files
description: Learn how to enable identity-based authentication over SMB for Azure file shares through Azure Active Directory Domain Services. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using Azure AD credentials. 
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 01/30/2020
ms.author: rogarana
---

# Enable active directory over SMB for Azure file shares

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) through two types of Domain Services: Azure Active Directory Domain Services (Azure AD DS) (GA) and Active Directory (AD) (preview). This article focuses on the newly introduced (preview) support of leveraging Active Directory Domain Service for authentication to Azure file shares. If you are interested in enabling Azure AD DS (GA) authentication for Azure file shares see [Enable Azure Active Directory Domain Services authentication over SMB for Azure Files](storage-files-active-directory-enable.md). 

> [!NOTE]
> Azure file shares only support authentication against one domain service, either Azure Active Directory Domain Service (Azure AD DS) or Active Directory (AD). 
>
> AD identities used for Azure file share authentication must be synced to Azure AD. Password hash synchronization is optional. 
> 
> AD authentication does not support authentication against Computer accounts created in Azure AD DS. 
> 
> AD authentication can only be supported against one AD forest where the storage account is registered to. You can only access Azure file shares with the AD credentials from the single AD forest.  
> 
> AD authentication for SMB access and NTFS DACL persistence is not supported for Azure file shares managed by Azure File Sync.

When you enable AD for Azure file shares over SMB, your AD domain joined machines can mount Azure file shares using your existing AD credentials. This capability can be enabled with an AD environment hosted either in on-prem machines or hosted in Azure.

AD identities used to access Azure file shares must be synced to Azure AD to enforce share level file permissions through the standard [role-based access control (RBAC)](../../role-based-access-control/overview.md) model. [NTFS DACLs](https://docs.microsoft.com/previous-versions/technet-magazine/cc161041(v=msdn.10)?redirectedfrom=MSDN) on files/directories carried over from existing file servers will be preserved and enforced. This offers seamless integration with your enterprise AD domain infrastructure. As you replace on-prem file servers with Azure file shares, existing users can access Azure file shares from their current clients with a single sign-on experience, without any change to the credentials in use.  
 
## Prerequisites 

Before you enable AD authentication for Azure file shares, make sure you have completed the following prerequisites: 

- Select or create your AD environment and sync it to Azure AD. 

    You can enable the feature on a new or existing AD environment. Identities used for access must be synced to Azure AD. The Azure AD tenant and the file share that you are accessing must be associated with the same subscription. 

    To setup an AD domain environment, refer to [Active Directory Domain Services Overview](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview). If you have not synced your AD to your Azure AD, follow the guidance in [What is hybrid identity with Azure Active Directory?](../../active-directory/hybrid/whatis-hybrid-identity.md) in order to determine your preferred authentication method and Azure AD Connect setup option. 

- Domain-join an on-premises machine or an Azure VM using AD DS. 

    To access a file share by using AD credentials from a machine or VM, your device must be domain-joined to AD DS. For more information about how to domain-join to AD, refer to [Join a Computer to a Domain](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain). 

- Select or create an Azure storage account in the France Central region. 

    The France Central region is the only available region for this preview feature, so your storage account must be in that region to use the feature. Also, make sure your storage account is associated with the same subscription as your Azure AD tenant.

    Make sure that the storage account containing your file shares is not already configured for Azure AD DS Authentication. If Azure Files Azure AD DS Authentication is enabled on the storage account, it needs to be disabled before changing to use AD. This implies that existing ACLs configured in Azure AD DS environment will need to be reconfigured for proper permission enforcement.
    
    For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md).
    
    For optimal performance, we recommend that your storage account be in the same region as the VM from which you plan to access the share. 

- Verify connectivity by mounting Azure file shares using your storage account key. 

    To verify that your device and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md). 

## Workflow overview

Before you enable AD Authentication over SMB for Azure file shares, we recommend that you walk through the [prerequisites](#prerequisites) and make sure you've completed all the steps. The prerequisites validate that your AD, Azure AD, and Azure Storage environments are properly configured. 

Next, grant access to Azure Files resources with AD credentials: 

- Enable Azure Files AD authentication on your storage account.  

- Assign access permissions for a share to the Azure AD identity (a user, group, or service principal) that is in sync with the target AD identity. 

- Configure NTFS permissions over SMB for directories and files. 

- Mount an Azure file share from an AD domain joined VM. 

The following diagram illustrates the end-to-end workflow for enabling Azure AD authentication over SMB for Azure file shares. 

![Files AD workflow diagram](media/storage-files-active-directory-domain-services-enable/diagram-files-ad.png)

> [!NOTE]
> AD authentication over SMB for Azure file shares is only supported on machines or VMs running on OS versions newer than Windows 7 or Windows Server 2008 R2. 

## Enable AD authentication for your account 

To enable AD authentication over SMB for Azure file shares, you need to first register your storage account with AD and then set the required domain properties on the storage account. When the feature is enabled on the storage account, it applies to all new and existing file shares in the account. Use `join-AzStorageAccountForAuth` to enable the feature. You can find the detailed description of the end-to-end workflow in the section below. 

> [!IMPORTANT]
> The `join-AzStorageAccountForAuth` cmdlet will make modifications to your AD environment. Read the following explanation to better understand what it is doing to ensure you have the proper permissions to execute the command and that the applied changes align with the compliance and security policies. 

The `join-AzStorageAccountForAuth` cmdlet will perform the equivalent of an offline domain join on behalf of the indicated storage account. It will create an account in your AD domain, either a [service logon account](https://docs.microsoft.com/windows/win32/ad/about-service-logon-accounts) (recommended) or a [computer account](https://docs.microsoft.com/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory). The created AD account represents the storage account in the AD domain. If the AD account is created under an AD Organizational Unit (OU) that enforces password expiration, you must update the password before the maximum password age. Failing to update AD account password will result in authentication failures when accessing Azure file shares. To learn how to update the password, see [Update AD account password](#update-ad-account-password)

You can use the following script to perform the registration and enable the feature or, alternatively, you can manually perform the operations that the script would. Those operations are described in the section following the script. You do not need to do both.

### Script prerequisites

- Download the AzureFilesActiveDirectoryUtilities.psm1 module
- Install and execute the module in a device that is domain joined to AD with AD credentials that have permissions to create a service logon account or a computer account in the target AD.
- Run the script with an Azure AD credential that has either storage account owner or contributor RBAC roles.
- Make sure your storage account is in the France Central region.
- Make sure your storage account is LRS.

```PowerShell 
#Import the latest Azure module
Install-Module -Name Az -AllowClobber -Scope CurrentUser

#Change the execution policy to unblock importing AzureFilesActiveDirectoryUtilities.psm1 module
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Currentuser

#Import AzureFilesActiveDirectoryUtilities module, it includes Az.Storage 1.8.2-preview version
Import-module -name .\AzureFilesActiveDirectoryUtilities.psm1 -ArgumentList Verbose

#Login with an Azure AD credential that has either storage account owner or contributer RBAC assignment
connect-AzAccount

#Select the target subscription for the current session
Select-AzureSubscription -SubscriptionId <yourSubscriptionIdHere>

#Register the target storage account with your active directory environment under the target OU
join-AzStorageAccountForAuth -ResourceGroupName "<resource-group-name-here>" -Name "<storage-account-name-here>" -DomainAccountType <ServiceLogonAccount|ComputerAccount> -OrganizationUnitName "<ou-name-here>"
```

The following is a description of the actions performed when the `join-AzStorageAccountForAuth` command is used. You may perform these steps manually, if you prefer not to use the command:

### Checking environment

First, it checks your environment. Specifically it checks if the [Active Directory PowerShell](https://docs.microsoft.com/powershell/module/addsadministration/?view=win10-ps) is installed and if the shell is being executed with administrator privileges. If those checks pass, then it will check your AD to see if there is either a [service logon account](https://docs.microsoft.com/windows/win32/ad/about-service-logon-accounts) (recommended) or [computer account](https://docs.microsoft.com/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) that has already been created with SPN/UPN as "cifs/your-storage-account-name-here.file.core.windows.net" and create one if it doesn't exist.

### Creating an identity representing the storage account in your AD manually

To create this account manually, create a new kerberos key for your storage account using `New-AzStorageAccountKey`. Then, use that kerberos key as the password for your account. This key is only used during setup and cannot be used for any control or data plane operations against the storage account.

Once you have that key, create either a service (recommended) or computer account under your OU. Use the following specification:
SPN: "cifs/your-storage-account-name-here.file.core.windows.net"
Password: Kerberos key for your storage account.

If your OU enforces password expiration, you must update the password before the maximum password age to prevent authentication failures when accessing Azure file shares. See [Update AD account password](#update-ad-account-password) for details.

Keep the SID of the newly account, you'll need it for the next step.

### Enable the feature on your storage account

The script would then enable the feature on your storage account. To do this manually provide some configuration details for the domain properties. The storage account SID required in the following script is the SID of the identity you created in AD.

```PowerShell
#Set the feature flag on the target storage account and provide the required AD domain information

Set-AzStorageAccount -ResourceGroupName "<your-resource-group-name-here>" -Name "<your-storage-account-name-here>" -EnableActiveDirectoryDomainServiesForFile $true -ActiveDirectoryDomainName "<your-domain-name-here>" -ActiveDirectoryNetBiosDomainName "<your-netbios-domain-name-here>" -ActiveDirectoryForestName "<your-forest-name-here>" -ActiveDirectoryDomainGuid "<your-guid-here>" -ActiveDirectoryDomainsid "your-domain-sid-here" -ActiveDirectoryAzureStirageSid "your-storage-account-sid"
```


### Check if the feature is enabled

If you want to check whether the feature is enabled on your storage account, you can use the following script:

```PowerShell
#Get the target storage account
$storageaccount = Get-AzStorageAccount -ResourceGroupName "your-resource-group-name-here" -Name "your-storage-account-name-here"

#List the directory service of the selected service account
$storageAccount.AzureFilesIdentityBasedAuth.DirectoryServiceOptions

#List the directory domain information if the storage account has enabled AD authentication for file shares
$storageAccount.AzureFilesIdentityBasedAuth.ActiveDirectoryProperties
```

You've now successfully enabled the feature on your storage account. Even though the feature is enabled, you still need to complete additional actions to be able to use the feature properly.

[!INCLUDE [storage-files-aad-permissions-and-mounting](../../../includes/storage-files-aad-permissions-and-mounting.md)]

## Update AD account password

If you register the AD account that represents the storage account under an OU that enforces password expiration, you must rotate the password before the maximum password age. Failing to update the password of the AD account will result in authentication failures to access Azure file shares.  

To trigger password rotation, you can run the `Update-AzStorageAccountADObjectPassword` command from the AzureFilesActiveDirectoryUtilities.psm1. The cmdlet performs actions similar to storage account key rotation. It gets the second kerberos key of the storage account and uses it to update the password of the registered account in AD. Then it regenerates the primary kerberos key on the storage account.

```PowerShell
#Update the password of the AD account registered for the storage account
Update-AzStorageAccountADObjectPassword -RotateToKerbKey kerb2 -ResourceGroupName "your-resource-group-name-here" -StorageAccountName "your-storage-account-name-here"
```