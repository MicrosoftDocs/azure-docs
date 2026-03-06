---
title: Enable AD DS Authentication for Azure Files
description: Learn how to enable Active Directory Domain Services authentication over SMB for Azure file shares. Your domain-joined Windows virtual machines can then access Azure file shares by using AD DS credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/06/2026
ms.author: kendownie 
ms.custom: devx-track-azurepowershell
# Customer intent: As an IT administrator, I want to enable Active Directory Domain Services authentication for Azure file shares, so that our domain-joined Windows virtual machines can securely access and manage file shares using existing AD credentials.
---

# Enable Active Directory Domain Services authentication for Azure file shares

**Applies to:** :heavy_check_mark: SMB Azure file shares

This article explains how to enable Active Directory Domain Services (AD DS) authentication on your storage account so you can use on-premises Active Directory (AD) credentials to authenticate to Azure file shares.

> [!IMPORTANT]
> Before you enable AD DS authentication, read the [AD DS overview article](storage-files-identity-ad-ds-overview.md) and complete the necessary [prerequisites](storage-files-identity-ad-ds-overview.md#prerequisites). If your Active Directory environment spans multiple forests, see [Use Azure Files with multiple Active Directory forests](storage-files-identity-multiple-forests.md).

To enable AD DS authentication over SMB for Azure file shares, register your Azure storage account with your on-premises AD DS and then set the required domain properties on the storage account. To register your storage account with AD DS, create a computer account (or service logon account) representing it in your AD DS. This process is similar to creating an account representing an on-premises Windows file server in your AD DS. When you enable the feature on the storage account, it applies to all new and existing file shares in the account.

## Option one (recommended): Use AzFilesHybrid PowerShell module

The AzFilesHybrid PowerShell module provides cmdlets for domain joining storage accounts to your on-premises AD DS and configuring your DNS servers. The cmdlets make the necessary modifications and enable the feature. Because some parts of the cmdlets interact with your on-premises AD DS, review the explanation of what the cmdlets do. You can then determine if the changes align with your compliance and security policies, and ensure you have the proper permissions to execute the cmdlets. If you're unable to use the AzFilesHybrid module, you can enable the feature using [manual steps](#option-two-manually-perform-the-enablement-actions).

> [!IMPORTANT]
> The AzFilesHybrid module only supports AES-256 Kerberos encryption. If you previously enabled the feature by using an older AzFilesHybrid version (below v0.2.2) that used RC4 as the default encryption method, update to AES-256 immediately. For more information, see [Troubleshoot Azure Files SMB authentication](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#azure-files-on-premises-ad-ds-authentication-support-for-aes-256-kerberos-encryption).

### Prerequisites

- Install [.NET Framework 4.7.2 or higher](https://dotnet.microsoft.com/download/dotnet-framework/) if it's not already installed. The AzFilesHybrid module requires it.
- Make sure you have the latest versions of [Azure PowerShell](/powershell/azure/install-azure-powershell) (Az module) and [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage/) installed. You must have Az.Storage 8.1.0 or higher to use AzFilesHybrid.
- Install the [Active Directory PowerShell](/powershell/module/activedirectory/) module.

### Download AzFilesHybrid module

Download and unzip the latest version of the [AzFilesHybrid module](https://www.powershellgallery.com/packages/AzFilesHybrid/).

### Run Join-AzStorageAccount

The `Join-AzStorageAccount` cmdlet performs the equivalent of an offline domain join for the specified storage account. The following script uses this cmdlet to create a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) in your AD domain. If you can't use a computer account, you can change the script to create a [service logon account](/windows/win32/ad/about-service-logon-accounts) instead. Using AES-256 encryption with service logon accounts is supported starting with AzFilesHybrid version 0.2.5.

> [!IMPORTANT]
> The account that the `Join-AzStorageAccount` creates represents the storage account in your AD DS. Whether you register it as a computer account or service logon account, check the password expiration policy on the AD domain or organizational unit (OU). Service logon account passwords can expire based on a default expiration age, while computer account password changes are driven by the client machine (by default every 30 days) and don't expire in AD. For either account type, you must [update the password](storage-files-identity-ad-ds-update-password.md) before the maximum password age to avoid authentication failures when accessing Azure file shares. Consider [creating a new AD OU](/powershell/module/activedirectory/new-adorganizationalunit) and disabling password expiration on [computer accounts](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj852252(v=ws.11)) or service logon accounts accordingly. For more information, see [FAQ](./storage-files-faq.md#security-authentication-and-access-control).

**Run the following script in PowerShell 5.1 on a device that's domain joined to your on-premises AD DS. Use on-premises AD DS credentials that have permissions to create a computer account or service logon account in the target AD (such as domain admin).** To follow the [Least privilege principle](../../role-based-access-control/best-practices.md), the on-premises AD DS credential must have the following Azure roles:

- **Reader** on the resource group where the target storage account is located.
- **Contributor** on the storage account to be joined to AD DS.

If the account used to join the storage account in AD DS is an **Owner** or **Contributor** in the Azure subscription where the target resources are located, the account is already enabled to perform the join and doesn't need further assignments.

Replace the placeholder values with your own before running the script.

```PowerShell
# Change the execution policy to unblock importing AzFilesHybrid.psm1 module
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser

# Navigate to where AzFilesHybrid is unzipped and stored and run to copy the files into your path
.\CopyToPSPath.ps1 

# Import AzFilesHybrid module
Import-Module -Name AzFilesHybrid

# Login to Azure using a credential that has either storage account owner or contributor Azure role 
# assignment. If you are logging into an Azure environment other than Public (ex. AzureUSGovernment) 
# you will need to specify that.
# See https://learn.microsoft.com/azure/azure-government/documentation-government-get-started-connect-with-ps
# for more information.
Connect-AzAccount

# Define parameters
# $StorageAccountName is the name of an existing storage account that you want to join to AD
# $SamAccountName is the name of the to-be-created AD object, which is used by AD as the logon name 
# for the object. It must be 20 characters or less and has certain character restrictions.
# Certain NETBIOS restrictions might require a $SamAccountName of 15 characters or less.
# Make sure that you provide the SamAccountName without the trailing '$' sign.
# See https://learn.microsoft.com/windows/win32/adschema/a-samaccountname for more information.
$SubscriptionId = "<your-subscription-id-here>"
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"
$SamAccountName = "<sam-account-name-here>"
$DomainAccountType = "<ComputerAccount|ServiceLogonAccount>" # Default is set as ComputerAccount
# If you don't provide the OU name as an input parameter, the AD identity that represents the 
# storage account is created under the root directory.
$OuDistinguishedName = "<ou-distinguishedname-here>"
# Encryption method is AES-256 Kerberos.

# Select the target subscription for the current session
Select-AzSubscription -SubscriptionId $SubscriptionId 

# Register the target storage account with your Active Directory environment under the target OU 
# (for example: specify the OU with Name as "UserAccounts" or DistinguishedName as 
# "OU=UserAccounts,DC=CONTOSO,DC=COM"). You can use this PowerShell cmdlet: Get-ADOrganizationalUnit 
# to find the Name and DistinguishedName of your target OU. If you are using the OU Name, specify it 
# with -OrganizationalUnitName as shown here. If you are using the OU DistinguishedName, you can set it 
# with -OrganizationalUnitDistinguishedName. You can choose to provide one of the two names to specify 
# the target OU. You can choose to create the identity that represents the storage account as either a 
# Service Logon Account or Computer Account (default parameter value), depending on your AD permissions 
# and preference. Run Get-Help Join-AzStorageAccountForAuth for more details on this cmdlet.

Join-AzStorageAccount `
        -ResourceGroupName $ResourceGroupName `
        -StorageAccountName $StorageAccountName `
        -SamAccountName $SamAccountName `
        -DomainAccountType $DomainAccountType `
        -OrganizationalUnitDistinguishedName $OuDistinguishedName

# You can run the Debug-AzStorageAccountAuth cmdlet to conduct a set of basic checks on your AD configuration 
# with the logged on AD user. This cmdlet is supported on AzFilesHybrid v0.1.2+ version. For more details on 
# the checks performed in this cmdlet, see:
# https://learn.microsoft.com/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication#unable-to-mount-azure-file-shares-with-ad-credentials
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

## Option two: Manually perform the enablement actions

If you're unable to use the AzFilesHybrid PowerShell module, you can execute the steps manually by using Active Directory PowerShell.

> [!IMPORTANT]
> If you already successfully ran the `Join-AzStorageAccount` script, go to the [Confirm the feature is enabled](#confirm-the-feature-is-enabled) section. You don't need to perform the following manual steps.

### Check the environment

First, check the state of your environment.

- [Active Directory PowerShell](/powershell/module/activedirectory/) must be installed, and the shell must be running with administrator privileges.
- The latest version of the [Az.Storage module](https://www.powershellgallery.com/packages/Az.Storage/) must be installed.
- Check your AD DS to see if there's either a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or [service logon account](/windows/win32/ad/about-service-logon-accounts) that you created with SPN/UPN such as "cifs/your-storage-account-name-here.file.core.windows.net". If the account doesn't exist, create one as described in the following section.

> [!IMPORTANT]
> You must run the Windows Server Active Directory PowerShell cmdlets in this section in PowerShell 5.1. PowerShell 7.x and Azure Cloud Shell don't work in this scenario.

### Create an identity representing the storage account in your AD manually

First, create a new Kerberos key for your storage account and get the access key by using the following PowerShell cmdlets. Use this key only during setup. You can't use it for any control or data plane operations against the storage account.

```PowerShell
# Create the Kerberos key on the storage account and get the Kerb1 key as the password for the AD identity 
# to represent the storage account
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName kerb1
Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -ListKerbKey | where-object{$_.Keyname -contains "kerb1"}
```

The cmdlets return the key value. Once you have the kerb1 key, create either a [computer account](/powershell/module/activedirectory/new-adcomputer) or [service account](/powershell/module/activedirectory/new-adserviceaccount) in AD under your OU, and use the key as the password for the AD identity.

1. Set the SPN to **cifs/your-storage-account-name-here.file.core.windows.net** either in the Active Directory GUI or by running the `Setspn` command from the Windows command line as administrator. Replace the example text with your storage account name and `<ADAccountName>` with your AD account name.

   ```shell
   Setspn -S cifs/your-storage-account-name-here.file.core.windows.net <ADAccountName>
   ```

1. If you have a user account, modify the UPN to match the SPN for the AD object. You must have AD PowerShell cmdlets installed and execute the cmdlets in PowerShell 5.1 with elevated privileges.

   ```powershell
   Set-ADUser -Identity $UserSamAccountName -UserPrincipalName cifs/<StorageAccountName>.file.core.windows.net@<DNSRoot>
   ```

   > [!IMPORTANT]
   > **Don't sync users with invalid userPrincipalName (UPN) values**. UPNs must not contain special characters such as `/`, spaces, or other unsupported symbols.
   > Attempting to sync users with invalid UPNs (such as using `/` in the username) results in Microsoft Entra Connect errors.
   > If such identities exist in your on-premises directory, do one of the following:
   > - Update the UPN to a valid format (for example, `user@domain.com`).
   > - Exclude the user from synchronization by using filtering rules in Microsoft Entra Connect.

1. Set the AD account password to the value of the kerb1 key.

   ```powershell
   Set-ADAccountPassword -Identity servername$ -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "kerb1_key_value_here" -Force)
   ```

If your OU enforces password expiration, you must update the password before the maximum password age to prevent authentication failures when accessing Azure file shares. For more information, see [Update the password of your storage account identity in AD](storage-files-identity-ad-ds-update-password.md).

Keep the SID of the newly created identity. You need it for the next step. The AD identity you created that represents the storage account doesn't need to be synced to Microsoft Entra ID.

### Enable the feature on your storage account

Modify the following command to include configuration details for the domain properties, then run it to enable the feature. The storage account SID required in the following command is the SID of the identity you created in your AD DS in [the previous section](#create-an-identity-representing-the-storage-account-in-your-ad-manually). Make sure that you provide the `ActiveDirectorySamAccountName` property without the trailing '$' sign.

```PowerShell
# Set the feature flag on the target storage account and provide the required AD domain information
Set-AzStorageAccount `
        -ResourceGroupName "<your-resource-group-name>" `
        -Name "<your-storage-account-name>" `
        -EnableActiveDirectoryDomainServicesForFile $true `
        -ActiveDirectoryDomainName "<your-domain-dns-root>" `
        -ActiveDirectoryNetBiosDomainName "<your-domain-dns-root>" `
        -ActiveDirectoryForestName "<your-forest-name>" `
        -ActiveDirectoryDomainGuid "<your-guid>" `
        -ActiveDirectoryDomainSid "<your-domain-sid>" `
        -ActiveDirectoryAzureStorageSid "<your-storage-account-sid>" `
        -ActiveDirectorySamAccountName "<your-domain-object-sam-account-name>" `
        -ActiveDirectoryAccountType "<your-domain-object-account-type, the value could be 'Computer' or 'User'>"
```

#### Enable AES-256 encryption (recommended)

To enable AES-256 encryption, follow these steps.

> [!IMPORTANT]
> To enable AES-256 encryption, the domain object that represents your storage account must be a computer account (default) or service logon account in the Active Directory domain. If your domain object doesn't meet this requirement, delete it and create a new domain object that does. Also, you must have write access to the `msDS-SupportedEncryptionTypes` attribute of the object.

The cmdlet you run to configure AES-256 support depends on whether the domain object that represents your storage account is a computer account or service logon account (user account). Either way, you must have AD PowerShell cmdlets installed and execute the cmdlet in PowerShell 5.1 with elevated privileges.

To enable AES-256 encryption on a **computer account**, run the following command. Replace `<domain-object-identity>` and `<domain-name>` with your values.

```powershell
Set-ADComputer -Identity <domain-object-identity> -Server <domain-name> -KerberosEncryptionType "AES256"
```

To enable AES-256 encryption on a **service logon account**, run the following command. Replace `<domain-object-identity>` and `<domain-name>` with your values.

```powershell
Set-ADUser -Identity <domain-object-identity> -Server <domain-name> -KerberosEncryptionType "AES256"
```

After you run the preceding cmdlet, replace `<domain-object-identity>` in the following script with your value, then run the script to refresh your domain object password:

```powershell
$KeyName = "kerb1" # Could be either the first or second kerberos key, this script assumes we're refreshing the first
$KerbKeys = New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName $KeyName
$KerbKey = $KerbKeys.keys | Where-Object {$_.KeyName -eq $KeyName} | Select-Object -ExpandProperty Value
$NewPassword = ConvertTo-SecureString -String $KerbKey -AsPlainText -Force

Set-ADAccountPassword -Identity <domain-object-identity> -Reset -NewPassword $NewPassword
```

> [!IMPORTANT]
> If you previously used RC4 encryption and updated the storage account to use AES-256 (recommended), run `klist purge` on the client and then remount the file share to get new Kerberos tickets with AES-256.

### Debugging

If needed, run the `Debug-AzStorageAccountAuth` cmdlet to check your AD configuration by using the signed in AD user. This cmdlet is supported on AzFilesHybrid v0.1.2+ version and higher. This cmdlet works for AD DS and Microsoft Entra Kerberos authentication. It doesn't work for Microsoft Entra Domain Services enabled storage accounts. For more information, see [Unable to mount Azure file shares with AD credentials](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication#unable-to-mount-azure-file-shares-with-ad-credentials?toc=/azure/storage/files/toc.json).

```PowerShell
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

## Confirm the feature is enabled

Check if AD DS is enabled as the identity source on your storage account by using the following script. Replace `<resource-group-name>` and `<storage-account-name>` with your values.

```PowerShell
# Get the target storage account
$storageaccount = Get-AzStorageAccount `
        -ResourceGroupName "<resource-group-name>" `
        -Name "<storage-account-name>"

# List the identity source for the selected storage account
$storageAccount.AzureFilesIdentityBasedAuth.DirectoryServiceOptions

# List the directory domain information if the storage account has enabled AD DS authentication for file shares
$storageAccount.AzureFilesIdentityBasedAuth.ActiveDirectoryProperties
```

If successful, the output looks like this:

```output
DomainName:<yourDomainHere>
NetBiosDomainName:<yourNetBiosDomainNameHere>
ForestName:<yourForestNameHere>
DomainGuid:<yourGUIDHere>
DomainSid:<yourSIDHere>
AzureStorageID:<yourStorageSIDHere>
```

> [!IMPORTANT]
> Before you can authenticate users, you must [assign share-level permissions](storage-files-identity-assign-share-level-permissions.md).

## Disable AD DS authentication on your storage account

If you want to use another authentication method, disable AD DS authentication on your storage account by using the Azure portal, PowerShell, or Azure CLI.

If you disable this feature, the file shares in your storage account won't have identity-based access until you enable and configure one of the other identity sources.

> [!IMPORTANT]
> After disabling AD DS authentication on the storage account, consider deleting the AD DS identity (computer account or service logon account) that you created to represent the storage account in your on-premises AD. If you leave the identity in AD DS, it remains as an orphaned object. Removing it isn't automatic.

# [Portal](#tab/azure-portal)

To disable AD DS authentication on your storage account by using the Azure portal, follow these steps.

1. Sign in to the Azure portal and select the storage account you want to disable AD DS authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Identity-based access**, select the configuration status, which should be **Configured**.
1. Under **Active Directory Domain Services (AD DS)**, select **Configure**.
1. Check the **Disable Active Directory for this storage account** checkbox.
1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To disable AD DS authentication on your storage account by using PowerShell, run the following command. Replace placeholder values, including brackets, with your values.

```powershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableActiveDirectoryDomainServicesForFile $false
```

# [Azure CLI](#tab/azure-cli)

To disable AD DS authentication on your storage account by using Azure CLI, run the following command. Replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storage-account-name> --resource-group <resource-group-name> --enable-files-adds false
```

---


## Next step

- [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md)
