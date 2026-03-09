---
title: Configure Cloud Trust between AD DS and Entra ID
description: Learn how to enable Microsoft Entra Kerberos authentication over SMB for Azure Files and establish a cloud trust between on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID. Your users can then access Azure file shares by using their on-premises credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/04/2026
ms.author: kendownie
ms.custom: sfi-ga-nochange
# Customer intent: As an IT administrator, I want to configure a cloud trust between on-premises Active Directory and Microsoft Entra ID, so that users can access SMB Azure file shares using their existing credentials in a hybrid environment.
---

# Configure a cloud trust between on-premises AD DS and Microsoft Entra ID for accessing Azure Files

**Applies to:** :heavy_check_mark: SMB Azure file shares

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that span both on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)), but don't meet the necessary [operating system or domain prerequisites](storage-files-identity-auth-hybrid-identities-enable.md#operating-system-and-domain-prerequisites).

In such scenarios, you can enable Microsoft Entra Kerberos authentication for hybrid user identities and then establish a cloud trust between your on-premises AD DS and Entra ID to access SMB file shares by using your on-premises credentials. This article explains how a cloud trust works, and provides instructions for setup and validation. It also includes steps to rotate a Kerberos key for your service account in Entra ID and Trusted Domain Object, and steps to remove a Trusted Domain Object and all Kerberos settings, if desired.

This article focuses on authenticating [hybrid user identities](/entra/identity/hybrid/whatis-hybrid-identity), which are on-premises AD DS identities that are synced to Microsoft Entra ID by using either [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync).

## Scenarios

The following examples describe scenarios in which you might want to configure a cloud trust:

- You have a traditional on-premises AD DS, but you can't use it for authentication because you don't have unimpeded network connectivity to the domain controllers.

- You started migrating to the cloud but currently have applications that are still running on traditional on-premises AD DS.

- Some or all of your client machines don't meet the [operating system requirements](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites) for Microsoft Entra Kerberos authentication.

## Permissions

To complete the steps in this article, you need the following:

- An on-premises Active Directory administrator username and password. This account must either be a member of the Domain Admins group for the domain or a member of the Enterprise Admins group for the domain's forest. 
- A Microsoft Entra Global Administrator account username and password.

## Prerequisites

Before implementing the incoming trust-based authentication flow, make sure that you meet the following prerequisites:

| **Prerequisite** | **Description** |
| --- | --- |
| Client must run Windows 10, Windows Server 2012, or a higher version of Windows. | |
| Clients must be joined to Active Directory (AD). The domain must have a functional level of Windows Server 2012 or higher. | You can determine if the client is joined to Active Directory by running the [dsregcmd command](/entra/identity/devices/troubleshoot-device-dsregcmd): `dsregcmd.exe /status` |
| A Microsoft Entra tenant. | A Microsoft Entra Tenant is an identity security boundary that's under the control of your organization's IT department. It's an instance of Microsoft Entra ID in which information about a single organization resides. |
| An Azure subscription under the same Entra tenant you plan to use for authentication. | |
| An Azure storage account in the Azure subscription. | An Azure storage account is a resource that acts as a container for grouping all the data services from Azure Storage, including files. |
| [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync) must be installed. | These solutions are used in [hybrid environments](/entra/identity/hybrid/whatis-hybrid-identity) where identities exist both in Microsoft Entra ID and on-premises AD DS. |

## Enable Microsoft Entra Kerberos authentication

If you already enabled Microsoft Entra Kerberos authentication on your storage account, you can skip this step and proceed to [Create and configure the Microsoft Entra Kerberos Trusted Domain Object](#create-and-configure-the-microsoft-entra-kerberos-trusted-domain-object).

You can enable Microsoft Entra Kerberos authentication on Azure Files for hybrid user accounts by using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable Microsoft Entra Kerberos authentication by using the [Azure portal](https://portal.azure.com), follow these steps.

1. Sign in to the Azure portal and select the storage account you want to enable Microsoft Entra Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Identity-based access**, select the configuration status, such as **Not configured**.
 
   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" alt-text="Screenshot of the Azure portal showing file share settings for a storage account." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" border="true":::

1. Under **Microsoft Entra Kerberos**, select **Set up**.
1. Select the **Microsoft Entra Kerberos** checkbox.

   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" alt-text="Screenshot of the Azure portal showing identity-based access configuration settings for a storage account. Microsoft Entra Kerberos is selected." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" border="true":::

1. **Optional:** To configure directory and file-level permissions through Windows File Explorer, specify the domain name and domain GUID for your on-premises Active Directory. You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlet from an Active Directory-joined client: `Get-ADDomain`. Your domain name appears in the output under `DNSRoot` and your domain GUID appears under `ObjectGUID`. If you prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs unimpeded network connectivity to the on-premises Active Directory.

1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To enable Microsoft Entra Kerberos by using Azure PowerShell, run the following command. Replace the placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true
```

**Optional:** If you want to configure directory and file-level permissions through Windows File Explorer, you also need to specify the domain name and domain GUID for your Active Directory. If you'd prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs line-of-sight to the on-premises Active Directory.

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises Active Directory-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises AD, run the following Azure PowerShell command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true -ActiveDirectoryDomainName $domainName -ActiveDirectoryDomainGuid $domainGuid
```

# [Azure CLI](#tab/azure-cli)
  
To enable Microsoft Entra Kerberos by using Azure CLI, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb true
```

**Optional:** If you want to configure directory and file-level permissions through Windows File Explorer, you also need to specify the domain name and domain GUID for your Active Directory. If you'd prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs line-of-sight to the Active Directory.

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises Active Directory-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises Active Directory, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageAccountName> --resource-group <resourceGroupName> --enable-files-aadkerb true --domain-name <domainName> --domain-guid <domainGuid>
```

---

> [!WARNING]
> If you previously enabled Microsoft Entra Kerberos authentication through manual limited preview steps to store FSLogix profiles on Azure Files for Entra-joined VMs, the password for the storage account's service principal expires every six months. Once the password expires, users can't get Kerberos tickets to the file share. To mitigate this, see "Error - Service principal password has expired in Microsoft Entra ID" under [Potential errors when enabling Microsoft Entra Kerberos authentication for hybrid users](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users).

### Grant admin consent to the new service principal

After enabling Microsoft Entra Kerberos authentication, grant admin consent to the new Entra application registered in your Entra tenant. The process auto-generates this service principal. It's not used for authorization to the file share, so don't make any edits to the service principal other than those documented here. If you do, you might get an error.

You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps:

1. Open **Microsoft Entra ID**.
1. In the service menu, under **Manage**, select **App registrations**.
1. Select **All Applications**.
1. Select the application with the name matching **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**.
1. In the service menu, under **Manage**, select **API permissions**.
1. Select **Grant admin consent for [Directory Name]** to grant consent for the three requested API permissions (openid, profile, and User.Read) for all accounts in the directory.
1. Select **Yes** to confirm.

> [!IMPORTANT]
> If you're connecting to a storage account through a private endpoint or private link by using Microsoft Entra Kerberos authentication, add the private link FQDN to the storage account's Entra application. For instructions, see the entry in the [troubleshooting guide](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#error-1326---the-username-or-password-is-incorrect-when-using-private-link).

### Disable multifactor authentication on the storage account

Microsoft Entra Kerberos doesn't support using MFA to access Azure file shares configured with Microsoft Entra Kerberos. You must exclude the Microsoft Entra app representing your storage account from your MFA conditional access policies if they apply to all apps.

The storage account app should have the same name as the storage account in the conditional access exclusion list. When searching for the storage account app in the conditional access exclusion list, search for: **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**

Remember to replace `<your-storage-account-name>` with the proper value.

> [!IMPORTANT]
> If you don't exclude MFA policies from the storage account app, you can't access the file share. Trying to map the file share by using `net use` results in an error message that says "System error 1327: Account restrictions are preventing this user from signing in. For example: blank passwords aren't allowed, sign-in times are limited, or a policy restriction has been enforced."

For guidance on disabling MFA, see the following articles:

- [Add exclusions for service principals of Azure resources](/entra/identity/conditional-access/policy-all-users-mfa-strength#user-exclusions)
- [Create a conditional access policy](/entra/identity/conditional-access/policy-all-users-mfa-strength#create-a-conditional-access-policy)

### Assign share-level permissions

When you enable identity-based access, for each share you must assign which users and groups have access to that particular share. Once a user or group is allowed access to a share, Windows ACLs (also called NTFS permissions) on individual files and directories take over. This permission system allows for fine-grained control over permissions, similar to an SMB share on a Windows Server.

To set share-level permissions, follow the instructions in [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md).

### Configure directory and file-level permissions

Once share-level permissions are in place, you can assign directory and file-level permissions to the user or group. **This step requires using a device with unimpeded network connectivity to an on-premises Active Directory**.

To configure directory and file-level permissions, follow the instructions in [Configure directory and file-level permissions over SMB](storage-files-identity-configure-file-level-permissions.md).

## Create and configure the Microsoft Entra Kerberos Trusted Domain Object

To create and configure the Entra Kerberos Trusted Domain Object, use the [Azure AD Hybrid Authentication Management](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement/) PowerShell module. By using this module, hybrid identity organizations can use modern credentials for their applications and Entra ID becomes the trusted source for both cloud and on-premises authentication.

### Set up the Trusted Domain Object

Use the Azure AD Hybrid Authentication Management PowerShell module to set up a Trusted Domain Object in the Active Directory domain and register trust information with Entra ID. This action creates an inbound trust relationship, which enables Entra ID to trust the on-premises Active Directory.

You only need to set up the Trusted Domain Object once per domain. If you already set up this object for your domain, you can skip this section and proceed to [Configure the clients to retrieve Kerberos tickets](#configure-the-clients-to-retrieve-kerberos-tickets).

#### Install the Azure AD Hybrid Authentication Management PowerShell module

1. Start a Windows PowerShell session by using the **Run as administrator** option.

1. Install the Azure AD Hybrid Authentication Management PowerShell module by using the following script. The script:

    - Enables TLS 1.2 for communication.
    - Installs the NuGet package provider.
    - Registers the PSGallery repository.
    - Installs the PowerShellGet module.
    - Installs the Azure AD Hybrid Authentication Management PowerShell module.
        - The Azure AD Hybrid Authentication Management PowerShell uses the AzureADPreview module, which provides advanced Entra management features.
        - To protect against unnecessary installation conflicts with the Azure AD PowerShell module, this command includes the `-AllowClobber` option flag.

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Install-PackageProvider -Name NuGet -Force

if (@(Get-PSRepository | ? {$_.Name -eq "PSGallery"}).Count -eq 0){
    Register-PSRepository -DefaultSet-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
}

Install-Module -Name PowerShellGet -Force

Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber
```

#### Create the Trusted Domain Object

1. Start a Windows PowerShell session by using the **Run as administrator** option.

1. Set the common parameters. Customize the script before running it.

   - Set the `$domain` parameter to your on-premises Active Directory domain name.
   - When prompted by `Get-Credential`, enter an on-premises Active Directory administrator username and password. This account must either be a member of the Domain Admins group for the domain or a member of the Enterprise Admins group for the domain's forest.
   - Set the `$cloudUserName` parameter to the username of a Global Administrator privileged account for Entra ID cloud access.

   > [!NOTE]  
   > If you want to use your current Windows sign-in account for your on-premises Active Directory access, you can skip the step where you assign credentials to the `$domainCred` parameter. If you take this approach, don't include the `-DomainCredential` parameter in the PowerShell commands following this step.

   ```powershell
   $domain = "your on-premises domain name, for example contoso.com" 
   $domainCred = Get-Credential
   $cloudUserName = "Microsoft Entra ID user principal name, for example admin@contoso.onmicrosoft.com"
   ```

1. Check the current Kerberos Domain Settings.

   Run the following command to check your domain's current Kerberos settings:

   ```powershell
   Get-AzureADKerberosServer -Domain $domain `
    -DomainCredential $domainCred `
    -UserPrincipalName $cloudUserName
   ```

   If this is the first time calling any Microsoft Entra Kerberos command, you're prompted for Entra ID cloud access.

   - Enter the password for your Entra ID Global Administrator account.
   - If your organization uses other modern authentication methods such as Entra multifactor authentication or Smart Card, follow the instructions as requested for sign in.

   If this is the first time you're configuring Microsoft Entra Kerberos settings, the [Get-AzureADKerberosServer cmdlet](/entra/identity/authentication/howto-authentication-passwordless-security-key-on-premises#view-and-verify-the-azure-ad-kerberos-server) displays empty information, as in the following sample output:

   ```output
   ID                  :
   UserAccount         :
   ComputerAccount     :
   DisplayName         :
   DomainDnsName       :
   KeyVersion          :
   KeyUpdatedOn        :
   KeyUpdatedFrom      :
   CloudDisplayName    :
   CloudDomainDnsName  :
   CloudId             :
   CloudKeyVersion     :
   CloudKeyUpdatedOn   :
   CloudTrustDisplay   :
   ```

   If your domain already supports FIDO authentication, the `Get-AzureADKerberosServer` cmdlet displays Entra service account information, as in the following sample output. The `CloudTrustDisplay` field returns an empty value.

   ```output
   ID                  : XXXXX
   UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=contoso, DC=com
   ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=contoso, DC=com
   DisplayName         : XXXXXX_XXXXX
   DomainDnsName       : contoso.com
   KeyVersion          : 53325
   KeyUpdatedOn        : 2/24/2024 9:03:15 AM
   KeyUpdatedFrom      : ds-aad-auth-dem.contoso.com
   CloudDisplayName    : XXXXXX_XXXXX
   CloudDomainDnsName  : contoso.com
   CloudId             : XXXXX
   CloudKeyVersion     : 53325
   CloudKeyUpdatedOn   : 2/24/2024 9:03:15 AM
   CloudTrustDisplay   :
   ```

1. Add the Trusted Domain Object.

   Run the [Set-AzureADKerberosServer](/entra/identity/authentication/howto-authentication-passwordless-security-key-on-premises#create-a-kerberos-server-object) PowerShell cmdlet to add the Trusted Domain Object. Be sure to include `-SetupCloudTrust` parameter. If there's no Entra service account, this command creates a new Entra service account. This command only creates the requested Trusted Domain object if there's an Entra service account.

   ```powershell
   Set-AzureADKerberosServer -Domain $domain -UserPrincipalName $cloudUserName -DomainCredential $domainCred -SetupCloudTrust
   ```

   > [!NOTE]  
   > In a multiple domain forest, to avoid the error *LsaCreateTrustedDomainEx 0x549* when running the command on a child domain:
   >
   > 1. Run the command on root domain (include `-SetupCloudTrust` parameter).
   > 1. Run the same command on the child domain without the `-SetupCloudTrust` parameter.

   After creating the Trusted Domain Object, you can check the updated Kerberos Settings by using the `Get-AzureADKerberosServer` PowerShell cmdlet, as shown in the previous step. If the `Set-AzureADKerberosServer` cmdlet runs successfully with the `-SetupCloudTrust` parameter, the `CloudTrustDisplay` field returns `Microsoft.AzureAD.Kdc.Service.TrustDisplay`, as shown in the following sample output:

   ```output
   ID                  : XXXXX
   UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=contoso, DC=com
   ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=contoso, DC=com
   DisplayName         : XXXXXX_XXXXX
   DomainDnsName       : contoso.com
   KeyVersion          : 53325
   KeyUpdatedOn        : 2/24/2024 9:03:15 AM
   KeyUpdatedFrom      : ds-aad-auth-dem.contoso.com
   CloudDisplayName    : XXXXXX_XXXXX
   CloudDomainDnsName  : contoso.com
   CloudId             : XXXXX
   CloudKeyVersion     : 53325
   CloudKeyUpdatedOn   : 2/24/2024 9:03:15 AM
   CloudTrustDisplay   : Microsoft.AzureAD.Kdc.Service.TrustDisplay
   ```

   > [!NOTE]  
   > Azure sovereign clouds require setting the `TopLevelNames` property, which is set to `windows.net` by default. Azure sovereign cloud deployments of Azure SQL Managed Instance use a different top-level domain name, such as `usgovcloudapi.net` for Azure US Government. Set your Trusted Domain Object to that top-level domain name by using the following PowerShell command: `Set-AzureADKerberosServer -Domain $domain -DomainCredential $domainCred -CloudCredential $cloudCred -SetupCloudTrust -TopLevelNames "usgovcloudapi.net,windows.net"`. You can verify the setting by using the following PowerShell command: `Get-AzureADKerberosServer -Domain $domain -DomainCredential $domainCred -UserPrincipalName $cloudUserName | Select-Object -ExpandProperty CloudTrustDisplay`.

## Configure the clients to retrieve Kerberos tickets

Identify your [Microsoft Entra tenant ID](/entra/fundamentals/how-to-find-tenant) and use Group Policy to configure the client machines you want to mount or use Azure file shares from. You must do this on every client where you use Azure Files.

Set this Group Policy on the clients to "Enabled": `Administrative Templates\System\Kerberos\Specify KDC proxy servers for Kerberos clients`

Deploy the Group Policy setting to client machines by using the incoming trust-based flow:

1. Edit the **Administrative Templates\System\Kerberos\Specify KDC proxy servers for Kerberos clients** policy setting.
1. Select **Enabled**.
1. Under **Options**, select **Show...**. This selection opens the Show Contents dialog box.

   :::image type="content" source="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy.png" alt-text="Screenshot of dialog box to enable 'Specify KDC proxy servers for Kerberos clients'. The 'Show Contents' dialog allows input of a value name and the related value."  lightbox="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy.png":::

1. Define the KDC proxy servers settings using mappings as follows. Substitute your Entra tenant ID for the `your_Entra_ID_tenant_id` placeholder. Note the space following `https` and before the closing `/` in the value mapping.

   | Value name | Value |
   | --- | --- |
   | KERBEROS.MICROSOFTONLINE.COM | <https login.microsoftonline.com:443:`your_Entra_ID_tenant_id`/kerberos /> |

   :::image type="content" source="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy-server-settings-detail.png" alt-text="Screenshot of the 'Define KDC proxy server settings' dialog box. A table allows input of multiple rows. Each row consists of a value name and a value." lightbox="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy-server-settings-detail.png":::

1. Select **OK** to close the 'Show Contents' dialog box.
1. Select **Apply** on the 'Specify KDC proxy servers for Kerberos clients' dialog box.

## Rotate the Kerberos key

For management purposes, rotate the Kerberos key periodically for the created Entra service account and Trusted Domain Object.

```powershell
Set-AzureADKerberosServer -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName -SetupCloudTrust `
   -RotateServerKey
```

After you rotate the key, it takes several hours to propagate the changed key between the Kerberos KDC servers. Due to this key distribution timing, you can rotate the key once within 24 hours. If you need to rotate the key again within 24 hours for any reason, such as just after creating the Trusted Domain Object, add the `-Force` parameter:

```powershell
Set-AzureADKerberosServer -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName -SetupCloudTrust `
   -RotateServerKey -Force
```

## Remove the Trusted Domain Object

You can remove the added Trusted Domain Object using the following command:

```powershell
Remove-AzureADKerberosServerTrustedDomainObject -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName
```

This command removes only the Trusted Domain Object. If your domain supports FIDO authentication, you can remove the Trusted Domain Object while maintaining the Entra service account required for the FIDO authentication service.

## Remove all Kerberos settings

You can remove both the Entra service account and the Trusted Domain Object by using the following command:

```powershell
Remove-AzureADKerberosServer -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName
```

## Next step

- [Mount an SMB Azure file share](storage-files-identity-mount-file-share.md)
