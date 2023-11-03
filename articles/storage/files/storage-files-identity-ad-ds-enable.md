---
title: Enable AD DS authentication for Azure file shares
description: Learn how to enable Active Directory Domain Services authentication over SMB for Azure file shares. Your domain-joined Windows virtual machines can then access Azure file shares by using AD DS credentials. 
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 09/27/2023
ms.author: kendownie 
ms.custom: engagement-fy23, devx-track-azurepowershell
recommendations: false
---

# Enable AD DS authentication for Azure file shares

This article describes the process for enabling Active Directory Domain Services (AD DS) authentication on your storage account in order to use on-premises Active Directory (AD) credentials for authenticating to Azure file shares.

> [!IMPORTANT]
> Before you enable AD DS authentication, make sure you understand the supported scenarios and requirements in the [overview article](storage-files-identity-auth-active-directory-enable.md) and complete the necessary [prerequisites](storage-files-identity-auth-active-directory-enable.md#prerequisites). If your Active Directory environment spans multiple forests, see [Use Azure Files with multiple Active Directory forests](storage-files-identity-multiple-forests.md).

To enable AD DS authentication over SMB for Azure file shares, you need to register your Azure storage account with your on-premises AD DS and then set the required domain properties on the storage account. To register your storage account with AD DS, you create a computer account (or service logon account) representing it in your AD DS. Think of this process as if it were like creating an account representing an on-premises Windows file server in your AD DS. When the feature is enabled on the storage account, it applies to all new and existing file shares in the account.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Option one (recommended): Use AzFilesHybrid PowerShell module

The AzFilesHybrid PowerShell module provides cmdlets for deploying and configuring Azure Files. It includes cmdlets for domain joining storage accounts to your on-premises Active Directory and configuring your DNS servers. The cmdlets make the necessary modifications and enable the feature for you. Because some parts of the cmdlets interact with your on-premises AD DS, we explain what the cmdlets do, so you can determine if the changes align with your compliance and security policies, and ensure you have the proper permissions to execute the cmdlets. Although we recommend using AzFilesHybrid module, if you're unable to do so, we provide [manual steps](#option-two-manually-perform-the-enablement-actions).

### Prerequisites

- If you don't have [.NET Framework 4.7.2 or higher](https://dotnet.microsoft.com/download/dotnet-framework/) installed, install it now. It's required for the AzFilesHybrid module to import successfully.
- Make sure you have [Azure PowerShell](/powershell/azure/install-azure-powershell) (Az module) and [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage/) installed. You must have at least Az.PowerShell 2.8.0+ and Az.Storage 4.3.0+ to use AzFilesHybrid.
- Install the [Active Directory PowerShell](/powershell/module/activedirectory/) module.

### Download AzFilesHybrid module

[Download and unzip the latest version of the AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). Note that AES-256 Kerberos encryption is supported on v0.2.2 or above, and is the default encryption method beginning in v0.2.5. If you've enabled the feature with an AzFilesHybrid version below v0.2.2 and want to update to support AES-256 Kerberos encryption, see [troubleshoot Azure Files SMB authentication](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#azure-files-on-premises-ad-ds-authentication-support-for-aes-256-kerberos-encryption).

### Run Join-AzStorageAccount

The `Join-AzStorageAccount` cmdlet performs the equivalent of an offline domain join on behalf of the specified storage account. The script below uses this cmdlet to create a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) in your AD domain. If for whatever reason you can't use a computer account, you can alter the script to create a [service logon account](/windows/win32/ad/about-service-logon-accounts) instead. Using AES-256 encryption with service logon accounts is supported beginning with AzFilesHybrid version 0.2.5.

The AD DS account created by the cmdlet represents the storage account. If the AD DS account is created under an organizational unit (OU) that enforces password expiration, you must update the password before the maximum password age. Failing to update the account password before that date results in authentication failures when accessing Azure file shares. To learn how to update the password, see [Update AD DS account password](storage-files-identity-ad-ds-update-password.md).

> [!IMPORTANT]
> The `Join-AzStorageAccount` cmdlet will create an AD account to represent the storage account (file share) in AD. You can choose to register as a computer account or service logon account, see [FAQ](./storage-files-faq.md#security-authentication-and-access-control) for details. Service logon account passwords can expire in AD if they have a default password expiration age set on the AD domain or OU. Because computer account password changes are driven by the client machine and not AD, they don't expire in AD, although client computers change their passwords by default every 30 days.
> For both account types, we recommend you check the password expiration age configured and plan to [update the password of your storage account identity](storage-files-identity-ad-ds-update-password.md) of the AD account before the maximum password age. You can consider [creating a new AD Organizational Unit in AD](/powershell/module/activedirectory/new-adorganizationalunit) and disabling password expiration policy on [computer accounts](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj852252(v=ws.11)) or service logon accounts accordingly.

**You must run the script below in PowerShell 5.1 on a device that's domain joined to your on-premises AD DS, using on-premises AD DS credentials that have permissions to create a computer account or service logon account in the target AD (such as domain admin).** To follow the [Least privilege principle](../../role-based-access-control/best-practices.md), the on-premises AD DS credential must have the following Azure roles:

- **Reader** on the resource group where the target storage account is located.
- **Contributor** on the storage account to be joined to AD DS.

If the account used to join the storage account in AD DS is an **Owner** or **Contributor** in the Azure subscription where the target resources are located, then that account is already enabled to perform the join and no further assignments are required.

The AD DS credential must also have permissions to create a computer account or service logon account in the target AD. Replace the placeholder values with your own before executing the script.

```PowerShell
# Change the execution policy to unblock importing AzFilesHybrid.psm1 module
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser

# Navigate to where AzFilesHybrid is unzipped and stored and run to copy the files into your path
.\CopyToPSPath.ps1 

# Import AzFilesHybrid module
Import-Module -Name AzFilesHybrid

# Login with an Azure AD credential that has either storage account owner or contributor Azure role 
# assignment. If you are logging into an Azure environment other than Public (ex. AzureUSGovernment) 
# you will need to specify that.
# See https://learn.microsoft.com/azure/azure-government/documentation-government-get-started-connect-with-ps
# for more information.
Connect-AzAccount

# Define parameters
# $StorageAccountName is the name of an existing storage account that you want to join to AD
# $SamAccountName is the name of the to-be-created AD object, which is used by AD as the logon name 
# for the object. It must be 20 characters or less and has certain character restrictions.
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
# Specify the encryption algorithm used for Kerberos authentication. Using AES256 is recommended.
$EncryptionType = "<AES256|RC4|AES256,RC4>"

# Select the target subscription for the current session
Select-AzSubscription -SubscriptionId $SubscriptionId 

# Register the target storage account with your active directory environment under the target OU 
# (for example: specify the OU with Name as "UserAccounts" or DistinguishedName as 
# "OU=UserAccounts,DC=CONTOSO,DC=COM"). You can use this PowerShell cmdlet: Get-ADOrganizationalUnit 
# to find the Name and DistinguishedName of your target OU. If you are using the OU Name, specify it 
# with -OrganizationalUnitName as shown below. If you are using the OU DistinguishedName, you can set it 
# with -OrganizationalUnitDistinguishedName. You can choose to provide one of the two names to specify 
# the target OU. You can choose to create the identity that represents the storage account as either a 
# Service Logon Account or Computer Account (default parameter value), depending on your AD permissions 
# and preference. Run Get-Help Join-AzStorageAccountForAuth for more details on this cmdlet.

Join-AzStorageAccount `
        -ResourceGroupName $ResourceGroupName `
        -StorageAccountName $StorageAccountName `
        -SamAccountName $SamAccountName `
        -DomainAccountType $DomainAccountType `
        -OrganizationalUnitDistinguishedName $OuDistinguishedName `
        -EncryptionType $EncryptionType

# You can run the Debug-AzStorageAccountAuth cmdlet to conduct a set of basic checks on your AD configuration 
# with the logged on AD user. This cmdlet is supported on AzFilesHybrid v0.1.2+ version. For more details on 
# the checks performed in this cmdlet, see Azure Files Windows troubleshooting guide.
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

## Option two: Manually perform the enablement actions

Most customers should choose [Option one](#option-one-recommended-use-azfileshybrid-powershell-module) above and use the AzFilesHybrid PowerShell module to enable AD DS authentication with Azure Files. However, if you prefer to execute the steps manually using Active Directory PowerShell, the steps are outlined here.

> [!IMPORTANT]
> If you've already executed the `Join-AzStorageAccount` script above successfully, go directly to the [Confirm the feature is enabled](#confirm-the-feature-is-enabled) section. You don't need to perform the following manual steps.

### Check the environment

First, check the state of your environment.

- Check if [Active Directory PowerShell](/powershell/module/activedirectory/) is installed, and if the shell is being executed with administrator privileges.
- Make sure the [Az.Storage module](https://www.powershellgallery.com/packages/Az.Storage/) is installed, and install it if it isn't. You'll need at least version 2.0. 
- After completing those checks, check your AD DS to see if there's either a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or [service logon account](/windows/win32/ad/about-service-logon-accounts) that has already been created with SPN/UPN such as "cifs/your-storage-account-name-here.file.core.windows.net". If the account doesn't exist, create one as described in the following section.

> [!IMPORTANT]
> The Windows Server Active Directory PowerShell cmdlets in this section must be run in Windows PowerShell 5.1. PowerShell 7.x and Azure Cloud Shell won't work in this scenario.

### Create an identity representing the storage account in your AD manually

To create this account manually, first create a new Kerberos key for your storage account and get the access key using the PowerShell cmdlets below. This key is only used during setup. It can't be used for any control or data plane operations against the storage account.

```PowerShell
# Create the Kerberos key on the storage account and get the Kerb1 key as the password for the AD identity 
# to represent the storage account
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName kerb1
Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -ListKerbKey | where-object{$_.Keyname -contains "kerb1"}
```

The cmdlets should return the key value. Once you have the kerb1 key, create either a [computer account](/powershell/module/activedirectory/new-adcomputer) or [service account](/powershell/module/activedirectory/new-adserviceaccount) in AD under your OU, and use the key as the password for the AD identity.

1. Set the SPN to **cifs/your-storage-account-name-here.file.core.windows.net** either in the AD GUI or by running the `Setspn` command from the Windows command line as administrator (remember to replace the example text with your storage account name and `<ADAccountName>` with your AD account name).

   ```shell
   Setspn -S cifs/your-storage-account-name-here.file.core.windows.net <ADAccountName>
   ```

2. If you have a user account, modify the UPN to match the SPN for the AD object (you must have AD PowerShell cmdlets installed and execute the cmdlets in PowerShell 5.1 with elevated privileges).

   ```powershell
   Set-ADUser -Identity $UserSamAccountName -UserPrincipalName cifs/<StorageAccountName>.file.core.windows.net@<DNSRoot>
   ```

3. Set the AD account password to the value of the kerb1 key.

   ```powershell
   Set-ADAccountPassword -Identity servername$ -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "kerb1_key_value_here" -Force)
   ```

If your OU enforces password expiration, you must update the password before the maximum password age to prevent authentication failures when accessing Azure file shares. See [Update the password of your storage account identity in AD](storage-files-identity-ad-ds-update-password.md) for details.

Keep the SID of the newly created identity, you'll need it for the next step. The identity you've created that represents the storage account doesn't need to be synced to Microsoft Entra ID.

### Enable the feature on your storage account

Modify the following command to include configuration details for the domain properties in the following command, then run it to enable the feature. The storage account SID required in the following command is the SID of the identity you created in your AD DS in [the previous section](#create-an-identity-representing-the-storage-account-in-your-ad-manually). Make sure that you provide the **ActiveDirectorySamAccountName** property without the trailing '$' sign.

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
        -ActiveDirectoryDomainsid "<your-domain-sid>" `
        -ActiveDirectoryAzureStorageSid "<your-storage-account-sid>" `
        -ActiveDirectorySamAccountName "<your-domain-object-sam-account-name>" `
        -ActiveDirectoryAccountType "<your-domain-object-account-type, the value could be 'Computer' or 'User'>"
```

#### Enable AES-256 encryption (recommended)

To enable AES-256 encryption, follow the steps in this section. If you plan to use RC4 encryption, skip this section.

> [!IMPORTANT]
> In order to enable AES-256 encryption, the domain object that represents your storage account must be a computer account (default) or service logon account in the on-premises AD domain. If your domain object doesn't meet this requirement, delete it and create a new domain object that does. Also, you must have write access to the `msDS-SupportedEncryptionTypes` attribute of the object.

The cmdlet you'll run to configure AES-256 support depends on whether the domain object that represents your storage account is a computer account or service logon account (user account). Either way, you must have AD PowerShell cmdlets installed and execute the cmdlet in PowerShell 5.1 with elevated privileges.

To enable AES-256 encryption on a **computer account**, run the following command. Replace `<domain-object-identity>` and `<domain-name>` with your values.

```powershell
Set-ADComputer -Identity <domain-object-identity> -Server <domain-name> -KerberosEncryptionType "AES256"
```

To enable AES-256 encryption on a **service logon account**, run the following command. Replace `<domain-object-identity>` and `<domain-name>` with your values.

```powershell
Set-ADUser -Identity <domain-object-identity> -Server <domain-name> -KerberosEncryptionType "AES256"
```

After you've run the above cmdlet, replace `<domain-object-identity>` in the following script with your value, then run the script to refresh your domain object password:

```powershell
$KeyName = "kerb1" # Could be either the first or second kerberos key, this script assumes we're refreshing the first
$KerbKeys = New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName $KeyName
$KerbKey = $KerbKeys.keys | Where-Object {$_.KeyName -eq $KeyName} | Select-Object -ExpandProperty Value
$NewPassword = ConvertTo-SecureString -String $KerbKey -AsPlainText -Force

Set-ADAccountPassword -Identity <domain-object-identity> -Reset -NewPassword $NewPassword
```

> [!IMPORTANT]
> If you were previously using RC4 encryption and update the storage account to use AES-256, you should run `klist purge` on the client and then remount the file share to get new Kerberos tickets with AES-256.

### Debugging

If needed, you can run the `Debug-AzStorageAccountAuth` cmdlet to conduct a set of basic checks on your AD configuration with the logged on AD user. This cmdlet is supported on AzFilesHybrid v0.1.2+ version and higher. For more information on the checks performed in this cmdlet, see [Unable to mount Azure file shares with AD credentials](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication#unable-to-mount-azure-file-shares-with-ad-credentials?toc=/azure/storage/files/toc.json).

```PowerShell
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

## Confirm the feature is enabled

You can check to confirm whether Active Directory is enabled on your storage account with the following script:

```PowerShell
# Get the target storage account
$storageaccount = Get-AzStorageAccount `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -Name "<your-storage-account-name-here>"

# List the directory service of the selected service account
$storageAccount.AzureFilesIdentityBasedAuth.DirectoryServiceOptions

# List the directory domain information if the storage account has enabled AD DS authentication for file shares
$storageAccount.AzureFilesIdentityBasedAuth.ActiveDirectoryProperties
```

If successful, the output should look like this:

```PowerShell
DomainName:<yourDomainHere>
NetBiosDomainName:<yourNetBiosDomainNameHere>
ForestName:<yourForestNameHere>
DomainGuid:<yourGUIDHere>
DomainSid:<yourSIDHere>
AzureStorageID:<yourStorageSIDHere>
```

## Next steps

You've now successfully enabled AD DS on your storage account. To use the feature, you must [assign share-level permissions](storage-files-identity-ad-ds-assign-permissions.md).
