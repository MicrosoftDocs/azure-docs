---
title: Enable Active Directory authentication over SMB for Azure Files
description: Learn how to enable identity-based authentication over SMB for Azure file shares through Active Directory. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using AD credentials. 
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: rogarana
---

# Enable Active Directory authentication over SMB for Azure file shares

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) through two types of Domain Services: Azure Active Directory Domain Services (Azure AD DS) (GA) and Active Directory (AD) (preview). This article focuses on the newly introduced (preview) support of leveraging Active Directory Domain Service for authentication to Azure file shares. If you are interested in enabling Azure AD DS (GA) authentication for Azure file shares, refer to [our article on the subject](storage-files-identity-auth-active-directory-domain-service-enable.md).

> [!NOTE]
> Azure file shares only support authentication against one domain service, either Azure Active Directory Domain Service (Azure AD DS) or Active Directory (AD). 
>
> AD identities used for Azure file share authentication must be synced to Azure AD. Password hash synchronization is optional. 
> 
> AD authentication does not support authentication against Computer accounts created in AD. 
> 
> AD authentication can only be supported against one AD forest where the storage account is registered to. You can only access Azure file shares with the AD credentials from a single AD forest by default. If you need to access your Azure file share from a different forest, make sure that you have the proper forest trust configured, see [FAQ](https://docs.microsoft.com/azure/storage/files/storage-files-faq#security-authentication-and-access-control) for details.  
> 
> AD authentication for SMB access and ACL persistence is supported for Azure file shares managed by Azure File Sync.
>
> Azure Files supports Kerberos authentication with AD with RC4-HMAC encryption. AES Kerberos encryption is not yet supported.

When you enable AD for Azure file shares over SMB, your AD domain joined machines can mount Azure file shares using your existing AD credentials. This capability can be enabled with an AD environment hosted either in on-prem machines or hosted in Azure.

AD identities used to access Azure file shares must be synced to Azure AD to enforce share level file permissions through the standard [role-based access control (RBAC)](../../role-based-access-control/overview.md) model. [Windows-style DACLs](https://docs.microsoft.com/previous-versions/technet-magazine/cc161041(v=msdn.10)?redirectedfrom=MSDN) on files/directories carried over from existing file servers will be preserved and enforced. This feature offers seamless integration with your enterprise AD domain infrastructure. As you replace on-prem file servers with Azure file shares, existing users can access Azure file shares from their current clients with a single sign-on experience, without any change to the credentials in use.  

> [!NOTE]
> To help you setup Azure Files AD authentication for the common use cases, we published [two videos](https://docs.microsoft.com/azure/storage/files/storage-files-introduction#videos) with the step by step guidance on replacing on-premises file servers with Azure Files and using Azure Files as the profile container for Windows Virtual Desktop.
 
## Prerequisites 

Before you enable AD authentication for Azure file shares, make sure you have completed the following prerequisites: 

- Select or create your AD environment and sync it to Azure AD. 

    You can enable the feature on a new or existing AD environment. Identities used for access must be synced to Azure AD. The Azure AD tenant and the file share that you are accessing must be associated with the same subscription. 

    To setup an AD domain environment, refer to [Active Directory Domain Services Overview](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview). If you have not synced your AD to your Azure AD, follow the guidance in [What is hybrid identity with Azure Active Directory?](../../active-directory/hybrid/whatis-hybrid-identity.md) in order to determine your preferred authentication method and Azure AD Connect setup option. 

- Domain-join an on-premises machine or an Azure VM to AD (also referred as AD DS). 

    To access a file share by using AD credentials from a machine or VM, your device must be domain-joined to AD. For information about how to domain-join to AD, refer to [Join a Computer to a Domain](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain). 

- Select or create an Azure storage account in [a supported region](#regional-availability). 

    Make sure that the storage account containing your file shares is not already configured for Azure AD DS Authentication. If Azure Files Azure AD DS Authentication is enabled on the storage account, it needs to be disabled before changing to use AD. This implies that existing ACLs configured in Azure AD DS environment will need to be reconfigured for proper permission enforcement.
    
    For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md).
    
    For optimal performance, we recommend that you deploy the storage account in the same region as the VM from which you plan to access the share. 

- Verify connectivity by mounting Azure file shares using your storage account key. 

    To verify that your device and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

## Regional availability

Azure Files AD authentication (preview) is available in [all regions in Public Cloud](https://azure.microsoft.com/global-infrastructure/regions/).

## Workflow overview

Before you enable AD Authentication over SMB for Azure file shares, we recommend that you walk through the [prerequisites](#prerequisites) and make sure you've completed all the steps. The prerequisites validate that your AD, Azure AD, and Azure Storage environments are properly configured. 

Next, follow the steps below to setup Azure Files for AD Authentication: 

1. Enable Azure Files AD authentication on your storage account. 

2. Assign access permissions for a share to the Azure AD identity (a user, group, or service principal) that is in sync with the target AD identity. 

3. Configure ACLs over SMB for directories and files. 

4. Mount an Azure file share from an AD domain joined VM. 

5. Rotate AD account password (Optional)

The following diagram illustrates the end-to-end workflow for enabling Azure AD authentication over SMB for Azure file shares. 

![Files AD workflow diagram](media/storage-files-active-directory-domain-services-enable/diagram-files-ad.png)

> [!NOTE]
> AD authentication over SMB for Azure file shares is only supported on machines or VMs running on OS versions newer than Windows 7 or Windows Server 2008 R2. 

## 1. Enable AD authentication for your account 

To enable AD authentication over SMB for Azure file shares, you need to first register your storage account with AD and then set the required domain properties on the storage account. When the feature is enabled on the storage account, it applies to all new and existing file shares in the account. Use `join-AzStorageAccountForAuth` to enable the feature. You can find the detailed description of the end-to-end workflow in the section below. 

> [!IMPORTANT]
> The `Join-AzStorageAccountForAuth` cmdlet will make modifications to your AD environment. Read the following explanation to better understand what it is doing to ensure you have the proper permissions to execute the command and that the applied changes align with the compliance and security policies. 

The `Join-AzStorageAccountForAuth` cmdlet will perform the equivalent of an offline domain join on behalf of the indicated storage account. It will create an account in your AD domain, either a [computer account](https://docs.microsoft.com/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or a [service logon account](https://docs.microsoft.com/windows/win32/ad/about-service-logon-accounts). The created AD account represents the storage account in the AD domain. If the AD account is created under an AD Organizational Unit (OU) that enforces password expiration, you must update the password before the maximum password age. Failing to update AD account password will result in authentication failures when accessing Azure file shares. To learn how to update the password, see [Update AD account password](#5-update-ad-account-password).

You can use the following script to perform the registration and enable the feature or, alternatively, you can manually perform the operations that the script would. Those operations are described in the section following the script. You do not need to do both.

### 1.1 Check prerequisites
- [Download and unzip the AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases)
- Install and execute the module in a device that is domain joined to AD with AD credentials that have permissions to create a service logon account or a computer account in the target AD.
-  Run the script using an AD credential that is synced to your Azure AD. The AD credential must have either the storage account owner or the contributor RBAC role permissions.
- Make sure your storage account is in a [supported region](#regional-availability).

### 1.2 Domain join your storage account
Remember to replace the placeholder values with your own in the parameters below before executing it in PowerShell.
> [!IMPORTANT]
> The domain join cmdlet below will create an AD account to represent the storage account (file share ) in AD. We recommend you to check if there is a default max password age set at the AD domain you plan to register the storage account (file share) to. You can run this [Get-ADDefaultDomainPasswordPolicy](https://docs.microsoft.com/powershell/module/addsadministration/get-addefaultdomainpasswordpolicy?view=win10-ps) cmdlet to get the MaxPasswordAge. If the MaxPasswordAge is configured, you must update the password of the AD account that will be created below to re before the maximum password age. Failing to update AD account password will result in authentication failures when accessing Azure file shares. To learn how to update the password, see [Update AD account password](#5-update-ad-account-password).


```PowerShell
#Change the execution policy to unblock importing AzFilesHybrid.psm1 module
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser

# Navigate to where AzFilesHybrid is unzipped and stored and run to copy the files into your path
.\CopyToPSPath.ps1 

#Import AzFilesHybrid module
Import-Module -Name AzFilesHybrid

#Login with an Azure AD credential that has either storage account owner or contributer RBAC assignment
Connect-AzAccount

#Select the target subscription for the current session
Select-AzSubscription -SubscriptionId "<your-subscription-id-here>"

# Register the target storage account with your active directory environment under the target OU (for example: specify the OU with Name as "UserAccounts" or DistinguishedName as "OU=UserAccounts,DC=CONTOSO,DC=COM"). 
# You can use to this PowerShell cmdlet: Get-ADOrganizationalUnit to find the Name and DistinguishedName of your target OU. If you are using the OU Name, specify it with -OrganizationalUnitName as shown below. If you are using the OU DistinguishedName, you can set it with -OrganizationalUnitDistinguishedName. You can choose to provide one of the two names to specify the target OU.
# You can choose to create the identity that represents the storage account as either a Service Logon Account or Computer Account, depends on the AD permission you have and preference. 
Join-AzStorageAccountForAuth `
        -ResourceGroupName "<resource-group-name-here>" `
        -Name "<storage-account-name-here>" `
        -DomainAccountType "ComputerAccount" `
        -OrganizationalUnitName "<ou-name-here>" or -OrganizationalUnitDistinguishedName "<ou-distinguishedname-here>"

#If you don't provide the OU name as an input parameter, the AD identity that represents the storage account will be created under the root directory.

#

```

The following description summarizes all actions performed when the `Join-AzStorageAccountForAuth` cmdlet gets executed. You may perform these steps manually, if you prefer not to use the command:

> [!NOTE]
> If you have already executed the `Join-AzStorageAccountForAuth` script above successfully, go to the next section "1.3 Confirm that the feature is enabled". You do not need to perform the operations below again.

#### a. Checking environment

First, it checks your environment. Specifically it checks if the [Active Directory PowerShell](https://docs.microsoft.com/powershell/module/addsadministration/?view=win10-ps) is installed and if the shell is being executed with administrator privileges. Then it checks to see if the [Az.Storage 1.11.1-preview module](https://www.powershellgallery.com/packages/Az.Storage/1.11.1-preview) is installed, and installs it if it isn't. If those checks pass, then it will check your AD to see if there is either a [computer account](https://docs.microsoft.com/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or [service logon account](https://docs.microsoft.com/windows/win32/ad/about-service-logon-accounts) that has already been created with SPN/UPN as "cifs/your-storage-account-name-here.file.core.windows.net". If the account doesn't exist, it will create one as described in section b below.

#### b. Creating an identity representing the storage account in your AD manually

To create this account manually, create a new kerberos key for your storage account using `New-AzStorageAccountKey -KeyName kerb1`. Then, use that kerberos key as the password for your account. This key is only used during set up and cannot be used for any control or data plane operations against the storage account.

Once you have that key, create either a service or computer account under your OU. Use the following specification:
SPN: "cifs/your-storage-account-name-here.file.core.windows.net"
Password: Kerberos key for your storage account.

If your OU enforces password expiration, you must update the password before the maximum password age to prevent authentication failures when accessing Azure file shares. See [Update AD account password](#5-update-ad-account-password) for details.

Keep the SID of the newly created account, you'll need it for the next step. The AD identity you have just created that represent the storage account does not need to be synced to Azure AD.

##### c. Enable the feature on your storage account

The script would then enable the feature on your storage account. To perform this setup manually, provide some configuration details for the domain properties in the following command, then run it. The storage account SID required in the following command is the SID of the identity you created in AD (section b above).

```PowerShell
# Set the feature flag on the target storage account and provide the required AD domain information
Set-AzStorageAccount `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -Name "<your-storage-account-name-here>" `
        -EnableActiveDirectoryDomainServicesForFile $true `
        -ActiveDirectoryDomainName "<your-domain-name-here>" `
        -ActiveDirectoryNetBiosDomainName "<your-netbios-domain-name-here>" `
        -ActiveDirectoryForestName "<your-forest-name-here>" `
        -ActiveDirectoryDomainGuid "<your-guid-here>" `
        -ActiveDirectoryDomainsid "<your-domain-sid-here>" `
        -ActiveDirectoryAzureStorageSid "<your-storage-account-sid>"
```


### 1.3 Confirm that the feature is enabled

You can check to confirm whether the feature is enabled on your storage account, you can use the following script:

```PowerShell
# Get the target storage account
$storageaccount = Get-AzStorageAccount `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -Name "<your-storage-account-name-here>"

# List the directory service of the selected service account
$storageAccount.AzureFilesIdentityBasedAuth.DirectoryServiceOptions

# List the directory domain information if the storage account has enabled AD authentication for file shares
$storageAccount.AzureFilesIdentityBasedAuth.ActiveDirectoryProperties
```

You've now successfully enabled the feature on your storage account. Even though the feature is enabled, you still need to complete additional actions to be able to use the feature properly.

[!INCLUDE [storage-files-aad-permissions-and-mounting](../../../includes/storage-files-aad-permissions-and-mounting.md)]

You have now successfully enabled AD authentication over SMB and assigned a custom role that provides access to an Azure file share with an AD identity. To grant additional users access to your file share, follow the instructions in the [Assign access permissions](#2-assign-access-permissions-to-an-identity) to use an identity and [Configure NTFS permissions over SMB](#3-configure-ntfs-permissions-over-smb) sections.

## 5. Update AD account password

If you registered the AD identity/account representing your storage account under an OU that enforces password expiration time, you must rotate the password before the maximum password age. Failing to update the password of the AD account will result in authentication failures to access Azure file shares.  

To trigger password rotation, you can run the `Update-AzStorageAccountADObjectPassword` command from the AzFilesHybrid module. The cmdlet performs actions similar to storage account key rotation. It gets the second Kerberos key of the storage account and uses it to update the password of the registered account in AD. Then it regenerates the target Kerberos key of the storage account and updates the password of the registered account in AD. You must run this cmdlet in an AD domain joined environment.

```PowerShell
#Update the password of the AD account registered for the storage account
Update-AzStorageAccountADObjectPassword `
        -RotateToKerbKey kerb2 `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -StorageAccountName "<your-storage-account-name-here>"
```

## Next steps

For more information about Azure Files and how to use AD over SMB, see these resources:

- [ Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)
