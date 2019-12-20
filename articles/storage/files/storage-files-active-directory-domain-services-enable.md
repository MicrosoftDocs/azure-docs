---
title: Enable Azure Active Directory authentication over SMB for Azure Files - Azure Storage
description: Learn how to enable identity-based authentication over Server Message Block (SMB) for Azure Files through Azure Active Directory Domain Services. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using Azure AD credentials. 
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: rogarana
---

# Enable Azure Active Directory over SMB

Azure Files supports identity-based authentication over Server Message Block (SMB) through two types of Domain Services: Azure Active Directory Domain Services (Azure AD DS) (GA) and Active Directory (AD) (preview). This article focuses on the newly introduced preview support of leveraging Active Directory Domain Service for authentication to Azure Files. If you are interested in enabling Azure Active Directory Domain Service (Azure AD DS) authentication for Azure Files, please see [Enable Azure Active Directory Domain Services authentication over SMB for Azure Files](storage-files-active-directory-enable.md). 

> [!NOTE]
> Azure Files only supports authentication against one domain service, either Azure Active Directory Domain Service (Azure AD DS) or Active Directory Domain Service (AD DS). 
>
> AD identities used for Azure Files authentication must be synced to Azure AD. Password hash synchronization (PSH) is optional. 
> 
> AD DS authentication does not support authentication against Computer accounts created in AD DS. 
> 
> AD DS authentication can only be supported against one AD forest where the storage account is registered to. Hence, you can only access Azure file share with the AD credentials from the single AD forest.  
> 
> AD DS authentication for SMB access and NTFS DACL persistence is not supported for Azure file shares managed by Azure File Sync.

When you enable AD for Azure Files over SMB access, your AD domain joined machines from on-premise or Azure can mount Azure Files using your existing AD credentials. You can enable this capability with an AD environment hosted in on-prem machines or in Azure. AD identities used to access Azure Files must be synced to Azure AD to enforce share level file permissions through the standard role-based access control (RBAC) model. NTFS DACLs on files/directories carried over from existing file servers will be preserved and enforced. This offers seamless integration with your enterprise AD domain infrastructure. As you replace on-prem file servers with Azure file shares, existing users can access Azure file shares from their current clients with a single sign-on experience, without any change to the credentials in use.  
 
## Prerequisites 

Before you enable AD Authentication for Azure Files, make sure you have completed the following prerequisites: 

- Select or create your AD environment and sync it to Azure AD. 

    You can enable the feature on a new or existing AD environment. Identities used for access must be synced to Azure AD. The Azure AD tenant and the file share that you want to access must be associated with the same subscription. 

    To setup an AD domain environment, you can refer to Active Directory Domain Services Overview. If you have not synced your AD to Azure AD, follow the guidance in What is hybrid identity with Azure Active Directory? to determine your preferred authentication method and Azure AD Connect setup option. 

- Domain-join an on-premises machine or Azure VM with AD DS. 

    To access a file share by using AD credentials from a machine or VM, your device must be domain-joined to AD DS. For more information about how to domain-join to AD, see Join a Computer to a Domain. 

- Select or create an Azure file share. 

    Select a new or existing file share that's associated with the same subscription as your Azure AD tenant. Make sure that the storage account you plan to deploy share to is not already configured for Azure AD DS Authentication. If Azure Files Azure AD DS Authentication is enabled on the storage account, it needs to be disabled before changing to use AD DS. This implies that existing ACLs configured in Azure AD DS environment will need to be reconfigured for proper permission enforcement. For information about creating a new file share, see Create a file share in Azure Files. For optimal performance, we recommend that your file share be in the same region as the VM from which you plan to access the share. 

- Verify Azure Files connectivity by mounting Azure file shares using your storage account key. 

    To verify that your device and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md). 

 

## Workflow overview

Before you enable AD DS Authentication over SMB for Azure Files, we recommend that you walk through the prerequisites to make sure you've completed all the required steps. This will validate that your AD, Azure AD and Azure Storage environments are properly configured. 

Next, grant access to Azure Files resources with AD credentials by following these steps: 

- Enable Azure Files AD DS authentication on your storage account.  

- Assign access permissions for a share to the Azure AD identity (a user, group, or service principal) that is in sync with the target AD identity. 

- Configure NTFS permissions over SMB for directories and files. 

- Mount an Azure file share from an AD domain joined VM. 

The following diagram illustrates the end-to-end workflow for enabling Azure AD DS authentication over SMB for Azure Files. 

https://microsoft.sharepoint.com/teams/AzureStorage/Private%20Test/2016/Azure%20Files/Planning/AccessControl&AAD/ADDSAuthentication-Feature-Enablement.vsdx 

> [!NOTE]
> AD DS authentication over SMB for Azure Files is supported only on machines or VMs running on OS versions above Windows 7 or Windows Server 2008 R2. 



<START HERE, ROY>


## Enable AD DS authentication for your account 

To enable AD authentication over SMB for Azure Files, you need to first register your storage account with AD and then set the required domain properties on the storage account. When the feature is enabled on the storage account, it applies to all new and existing file shares in the account. Use `join-AzStorageAccountForAuth` to enable the feature. You can find the detailed description of the end to end workflow in the section below. 

> [!IMPORTANT]
> The join-AzStorageAccountForAuth cmdlet will make modifications to your AD environment. Read the following explanation to better understand what it is doing to ensure you have the proper permissions to execute the command and that the applied changes align with the compliance and security policies. 

The `join-AzStorageAccountForAuth` cmdlet will perform the equivalent of an offline domain join on behalf of the indicated storage account. It will create an account in your AD domain, either a service logon account (recommended) or a computer account. The created AD account represents the storage account in the AD domain. If the AD account is created under an AD Organizational Unit (OU) that enforces password expiration, you must update the password before the maximum password age. Failing to update the password of the AD account will result in authentication failures in accessing Azure file shares. To learn how to update the password, go to Update AD Account Password

You can either use the following script to perform the registration and enable the feature. Alternatively. you can perform the operations that ths script would, manually. Those operations are described in the section following the script. You do not need to do both.

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

> [!IMPORTANT]
> AzureFilesActiveDirectoryUtilities.psm1 module must be installed and executed in a device that is domain joined to AD using an AD credential with permission to create a service logon account or computer account in the target AD.

Unlike other Azure PowerShell command, this command must be executed in a device that is domain joined to AD using an AD credential with necessary permissions to create user or computer accounts in the target AD. You should run Azure PowerShell with an Azure AD credential with storage account Owner or Contributor role assignment. Here is a detailed workflow of the actions that is performed in the command. 

PS: 

## Login with an Azure AD credential with storage account Owner or Contributor role assignment 

Connect-AzAccount 

join-AzStorageAccountForAuth -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" additional flags? 

> [!NOTE]
> You can either run the Join-AzStorageAccountForAuth command to perform the registration and feature enablement or perform the operations manually described in the workflow below. You DO NOT need to do both.  

Join-AzStorageAccountForAuth 

There is a total of four steps executed in join-AzStorageAccountForAuth commend listed as below: 

 

Perform a setup check against the environment that the command is being executed 

Here is a list of checks that are performed against the environment. If you failed on the first two checks below, rerun the command in the required environment.  

The command must be executed on a Windows client that is domain joined to AD Domain. 

The command must be executed under an AD domain user/admin instead of a local user. 

The command checks whether the AD domain is composed of multiple forests. If yes, it will provide a warning message on the feature limitation against multi-forest AD environment. User acknowledgement required to proceed forward. 

 

Create a new Organizational Unit (OU) with maximum password age set as never expire – Optional  

The command will create a new OU under the provided path with maximum password age explicitly set as never expire. This OU will be used in the next step to contain the AD account that represents the storage account. Creating a new OU allow you to separate the Azure resource identities from your existing identities and enforce a different password management policy that doesn’t enforce password expiration. This is an optional step which will prompt for user confirm before proceeding.  

 

> [!IMPORTANT]
> Please consult your AD administrator for advice on not enforcing password expiration on an OU and only execute this step if this is approved. If you register the AD account under an OU that enforces password expiration, you must rotate the password before the maximum password age. If the password gets expired, all authentication requests to the file share will be denied by AD DS, which may result in availability impact to your services. 

 

For your reference, Microsoft has dropped the password-expiration policies that require periodic password changes in May 2019 Security baseline for Windows 10 v1903 and Windows Server v1903. Periodic password expiration is an ancient and obsolete mitigation of very low value, and we don’t believe it’s worthwhile for our baseline to enforce any specific value. By removing it from our baseline rather than recommending a particular value or no expiration, organizations can choose whatever best suits their perceived needs without contradicting our guidance. At the same time, we must reiterate that we strongly recommend additional protections even though they cannot be expressed in our baselines 

 

Create an identity in AD to represent the storage account 

In the traditional workflow of setting up a Windows file server on-premises, you need to create a computer account in AD and domain join the file server. Similarly, we need to create an identity in AD to represent the storage account as if it is a file server. The name and password of the identity are defined and generated by the platform. You can choose to create either a service logon account (recommended) or a computer account as the representative identity. These operations will be executed in sequence in this step: 

Check if there is a service logon account or computer account already created with the SPN/UPN as “<StorageAccountName>.file.core.windows.net". If not, proceed with the next step. Else, refer to password rotation workflow.  

Create an account in AD to represent the storage account 

User will be prompted for the account type to be used to represent the storage account between service logon account (default) or computer account 

Then retrieve the autogenerated Kerberos key (kerb1) of the storage account with PSH command: Get-AzStorageAccountKey -ListKerbKey and use it as the password. The Kerberos key is only used for AD DS Authentication setup and cannot be used for any control or data plane operations against the storage account. 

Create an account in AD with the type specific in #i above with the specification as below: 

UPN/SPN: “<StorageAccountName>.file.core.windows.net" 

Password: Kerberos key (kerb1) of the storage account 

Get the SID of the newly created account that will be used as one of the required input properties of the next step. 

 

Enable the feature on the storage account and provide the required properties 

The last step update the configuration on the storage account to enable the feature and set the required properties on the domain information. The sample below is an extract from the storage account ARM template on the required properties for AD DS Authentication feature enablement.  

 

JSON Sample:  

"azureFilesIdentityBasedAuthentication":  

{ 

"directoryServiceOptions": "AD",  

"activedirectoryproperties":{ 

"domainname": "string", 

"netbiosdomainname": "string", 

"forestname"": "string", 

"domainguid": "string", 

"domainsid": "string", 

"azurestoragesid": "string" 

} 

} 

This step calls into the PSH command below to apply the required configuration on the storage account: 

PowerShell 

Set-AzStorageAccount -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" -EnableActiveDirectoryDomainServicesForFile $true 

 

Now you have successfully enabled the AD DS Authentication for SMB access to Azure Files.  

 

Password Rotation Workflow 

If you register the AD account that represent the storage account under an OU that enforces password expiration, you must rotate the password before the maximum password age. Failing to update the password of the AD account will result in authentication failures to access Azure file shares.  

To trigger password rotation, you can run the PowerShell command Update-AzStorageAccountADCredential. The workflow is similar to storage account key rotation where you get the secondary Kerberos key of the storage account and use it to update the password of the registered account in AD. When completely, it will regenerate the primary Kerberos key on the storage account.  

PS: 

Update-AzStorageAccountADCredential -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" 

 

Azure portal 

To enable AD DS authentication with the Azure portal, follow these steps: 

In the Azure portal, go to your existing storage account. 

In the Settings section, select Configuration. 

To be updated 

It will guide you to execute the PowerShell command: join-AzStorageAccountForAuth to perform feature enablement steps. To read more about join-AzStorageAccountForAuth, refer to the PowerShell section above.  

The following image shows the Portal experience to enable Azure Files AD DS authentication for your storage account. 

 

Include these sections from https://docs.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-enable and make sure that the instructions are generic for AAD DS Authentication and AD DS Authentication. 

Assign access permissions to an identity 

Configure NTFS permissions over SMB 

Mount a file share from a domain-joined VM 

## Next steps 
