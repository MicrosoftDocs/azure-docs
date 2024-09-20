---
title: Configure cloud trust between AD DS and Microsoft Entra ID
description: Learn how to enable identity-based Kerberos authentication for hybrid user identities over Server Message Block (SMB) for Azure Files by establishing a cloud trust between on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID. Your users can then access Azure file shares by using their on-premises credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 09/20/2024
ms.author: kendownie
recommendations: false
---

# Configure a cloud trust between on premises AD DS and Microsoft Entra ID for accessing Azure Files

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that span both on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)), but don't meet the necessary [prerequisites to use Microsoft Entra Kerberos](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites).

In such scenarios, customers can establish a cloud trust between their on-premises AD DS and Microsoft Entra ID to access SMB file shares using their on-premises credentials. This article explains how a cloud trust works, and provides instructions for setup and validation. It also includes steps to rotate a Kerberos key for your service account in Microsoft Entra ID and Trusted Domain Object, and steps to remove a Trusted Domain Object and all Kerberos settings, if desired.

This article focuses on authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which are on-premises AD DS identities that are synced to Microsoft Entra ID. **Cloud-only identities aren't currently supported for Azure Files**.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Scenarios

The following are examples of scenarios in which you might want to configure a cloud trust:

- You have a traditional on premises AD DS, but you're not able to use it for authentication because you don't have unimpeded network connectivity to the domain controllers.

- You've started migrating to the cloud but currently have applications still running on traditional on-premises AD DS.

- Some or all of your client machines don't meet the [operating system requirements](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites) for Microsoft Entra Kerberos authentication.

## Permissions

To complete the steps outlined in this article, you'll need:

- An on-premises Active Directory administrator username and password
- Microsoft Entra Global Administrator account username and password

## Prerequisites

Before implementing the incoming trust-based authentication flow, ensure that the following prerequisites are met:

| **Prerequisite** | **Description** |
| --- | --- |
| Client must run Windows 10, Windows Server 2012, or a higher version of Windows. | |
| Clients must be joined to Active Directory (AD). The domain must have a functional level of Windows Server 2012 or higher. | You can determine if the client is joined to AD by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd): `dsregcmd.exe /status` |
| A Microsoft Entra tenant. | A Microsoft Entra Tenant is an identity security boundary that's under the control of your organization’s IT department. It's an instance of Microsoft Entra ID in which information about a single organization resides. |
| An Azure subscription under the same Microsoft Entra tenant you plan to use for authentication. | |
| An Azure storage account. | An Azure storage account is a resource that acts as a container for grouping all the data services from Azure Storage, including files. |
| [Microsoft Entra Connect](/azure/active-directory/hybrid/whatis-azure-ad-connect) must be installed. | Microsoft Entra Connect is used in [hybrid environments](../../active-directory/hybrid/whatis-hybrid-identity.md) where identities exist both in Microsoft Entra ID and on-premises AD DS. |
| [Enable Microsoft Entra Kerberos authentication](storage-files-identity-auth-hybrid-identities-enable.md) on the storage account | This will enable any client machines that meet the Microsoft Entra Kerberos prerequisites to mount the file share. |

## Create and configure the Microsoft Entra Kerberos Trusted Domain Object

To create and configure the Microsoft Entra Kerberos Trusted Domain Object, you'll use the [Azure AD Hybrid Authentication Management](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement/) PowerShell module. This module enables hybrid identity organizations to use modern credentials for their applications and enables Microsoft Entra ID to become the trusted source for both cloud and on-premises authentication.

### Set up the Trusted Domain Object

You'll use the Azure AD Hybrid Authentication Management PowerShell module to set up a Trusted Domain Object in the on-premises AD domain and register trust information with Microsoft Entra ID. This creates an in-bound trust relationship into the on-premises AD, which enables Microsoft Entra ID to trust on-premises AD.

#### Install the Azure AD Hybrid Authentication Management PowerShell module

1. Start a Windows PowerShell session with the **Run as administrator** option.

1. Install the Azure AD Hybrid Authentication Management PowerShell module using the following script. The script:

    - Enables TLS 1.2 for communication.
    - Installs the NuGet package provider.
    - Registers the PSGallery repository.
    - Installs the PowerShellGet module.
    - Installs the Azure AD Hybrid Authentication Management PowerShell module.
        - The Azure AD Hybrid Authentication Management PowerShell uses the AzureADPreview module, which provides advanced Microsoft Entra management feature.
        - To protect against unnecessary installation conflicts with the Azure AD PowerShell module, this command includes the –AllowClobber option flag.

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

1. Start a Windows PowerShell session with the **Run as administrator** option.

1. Set the common parameters. Customize the script below prior to running it.

    - Set the `$domain` parameter to your on-premises Active Directory domain name.
    - When prompted by `Get-Credential`, enter an on-premises Active Directory administrator username and password.
    - Set the `$cloudUserName` parameter to the username of a Global Administrator privileged account for Microsoft Entra cloud access.

    > [!NOTE]  
    > If you wish to use your current Windows login account for your on-premises Active Directory access, you can skip the step where credentials are assigned to the `$domainCred` parameter. If you take this approach, don't include the `-DomainCredential` parameter in the PowerShell commands following this step.

    ```powershell
    $domain = "your on-premesis domain name, for example contoso.com"
    
    $domainCred = Get-Credential
    
    $cloudUserName = "Azure AD user principal name, for example admin@contoso.onmicrosoft.com"
    ```

1. Check the current Kerberos Domain Settings.

    Run the following command to check your domain's current Kerberos settings:

    ```powershell
    Get-AzureAdKerberosServer -Domain $domain `
        -DomainCredential $domainCred `
        -UserPrincipalName $cloudUserName
    ```

    If this is the first time calling any Microsoft Entra Kerberos command, you're prompted for Microsoft Entra cloud access.
      - Enter the password for your Microsoft Entra Global Administrator account.
      - If your organization uses other modern authentication methods such as Microsoft Entra multifactor authentication or Smart Card, follow the instructions as requested for sign in.

    If this is the first time you're configuring Microsoft Entra Kerberos settings, the [Get-AzureAdKerberosServer cmdlet](/azure/active-directory/authentication/howto-authentication-passwordless-security-key-on-premises#view-and-verify-the-azure-ad-kerberos-server) displays empty information, as in the following sample output:

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

    If your domain already supports FIDO authentication, the `Get-AzureAdKerberosServer` cmdlet displays Microsoft Entra service account information, as in the following sample output. The `CloudTrustDisplay` field returns an empty value.

    ```output
    ID                  : XXXXX
    UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=aadsqlmi, DC=net
    ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=aadsqlmi, DC=net
    DisplayName         : XXXXXX_XXXXX
    DomainDnsName       : aadsqlmi.net
    KeyVersion          : 53325
    KeyUpdatedOn        : 2/24/2022 9:03:15 AM
    KeyUpdatedFrom      : ds-aad-auth-dem.aadsqlmi.net
    CloudDisplayName    : XXXXXX_XXXXX
    CloudDomainDnsName  : aadsqlmi.net
    CloudId             : XXXXX
    CloudKeyVersion     : 53325
    CloudKeyUpdatedOn   : 2/24/2022 9:03:15 AM
    CloudTrustDisplay   :
    ```

1. Add the Trusted Domain Object.

    Run the [Set-AzureAdKerberosServer PowerShell cmdlet](/azure/active-directory/authentication/howto-authentication-passwordless-security-key-on-premises#create-a-kerberos-server-object) to add the Trusted Domain Object. Be sure to include `-SetupCloudTrust` parameter. If there's no Microsoft Entra service account, this command creates a new Microsoft Entra service account. This command will only create the requested Trusted Domain object if there's a Microsoft Entra service account.

    ```powershell
    Set-AzureADKerberosServer -Domain $domain -UserPrincipalName $cloudUserName -DomainCredential $domainCred -SetupCloudTrust
    ```

    > [!NOTE]  
    > On a multiple domain forest, to avoid the error *LsaCreateTrustedDomainEx 0x549* when running the command on a child domain:
    >
    > 1. Run the command on root domain (include `-SetupCloudTrust` parameter).
    > 1. Run the same command on the child domain without the `-SetupCloudTrust` parameter.

    After creating the Trusted Domain Object, you can check the updated Kerberos Settings using the `Get-AzureAdKerberosServer` PowerShell cmdlet, as shown in the previous step. If the `Set-AzureAdKerberosServer` cmdlet has been run successfully with the `-SetupCloudTrust` parameter, the `CloudTrustDisplay` field should now return `Microsoft.AzureAD.Kdc.Service.TrustDisplay`, as in the following sample output:

    ```output
    ID                  : XXXXX
    UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=aadsqlmi, DC=net
    ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=aadsqlmi, DC=net
    DisplayName         : XXXXXX_XXXXX
    DomainDnsName       : aadsqlmi.net
    KeyVersion          : 53325
    KeyUpdatedOn        : 2/24/2022 9:03:15 AM
    KeyUpdatedFrom      : ds-aad-auth-dem.aadsqlmi.net
    CloudDisplayName    : XXXXXX_XXXXX
    CloudDomainDnsName  : aadsqlmi.net
    CloudId             : XXXXX
    CloudKeyVersion     : 53325
    CloudKeyUpdatedOn   : 2/24/2022 9:03:15 AM
    CloudTrustDisplay   : Microsoft.AzureAD.Kdc.Service.TrustDisplay
    ```

    > [!NOTE]  
    > Azure sovereign clouds require setting the `TopLevelNames` property, which is set to `windows.net` by default. Azure sovereign cloud deployments of SQL Managed Instance use a different top-level domain name, such as `usgovcloudapi.net` for Azure US Government. Set your Trusted Domain Object to that top-level domain name using the following PowerShell command: `Set-AzureADKerberosServer -Domain $domain -DomainCredential $domainCred -CloudCredential $cloudCred -SetupCloudTrust -TopLevelNames "usgovcloudapi.net,windows.net"`. You can verify the setting with the following PowerShell command: `Get-AzureAdKerberosServer -Domain $domain -DomainCredential $domainCred -UserPrincipalName $cloudUserName | Select-Object -ExpandProperty CloudTrustDisplay`.

## Configure the Group Policy Object (GPO)

1. Identify your [Microsoft Entra tenant ID](/azure/active-directory/fundamentals/how-to-find-tenant).

1. Deploy the following Group Policy setting to client machines using the incoming trust-based flow:

    1. Edit the **Administrative Templates\System\Kerberos\Specify KDC proxy servers for Kerberos clients** policy setting.
    1. Select **Enabled**.
    1. Under **Options**, select **Show...**. This opens the Show Contents dialog box.

        :::image type="content" source="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy.png" alt-text="Screenshot of dialog box to enable 'Specify KDC proxy servers for Kerberos clients'. The 'Show Contents' dialog allows input of a value name and the related value."  lightbox="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy.png":::

    1. Define the KDC proxy servers settings using mappings as follows. Substitute your Microsoft Entra tenant ID for the `your_Azure_AD_tenant_id` placeholder. Note the space following `https` and before the closing `/` in the value mapping.

        | Value name | Value |
        | --- | --- |
        | KERBEROS.MICROSOFTONLINE.COM | <https login.microsoftonline.com:443:`your_Azure_AD_tenant_id`/kerberos /> |

        :::image type="content" source="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy-server-settings-detail.png" alt-text="Screenshot of the 'Define KDC proxy server settings' dialog box. A table allows input of multiple rows. Each row consists of a value name and a value." lightbox="media/storage-files-identity-auth-hybrid-cloud-trust/configure-policy-kdc-proxy-server-settings-detail.png":::

    1. Select **OK** to close the 'Show Contents' dialog box.
    1. Select **Apply** on the 'Specify KDC proxy servers for Kerberos clients' dialog box.

## Rotate the Kerberos Key

You may periodically rotate the Kerberos Key for the created Microsoft Entra service account and Trusted Domain Object for management purposes.

```powershell
Set-AzureAdKerberosServer -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName -SetupCloudTrust `
   -RotateServerKey
```

Once the key is rotated, it takes several hours to propagate the changed key between the Kerberos KDC servers. Due to this key distribution timing, you can rotate the key once within 24 hours. If you need to rotate the key again within 24 hours for any reason, for example, just after creating the Trusted Domain Object, you can add the `-Force` parameter:

```powershell
Set-AzureAdKerberosServer -Domain $domain `
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

This command will only remove the Trusted Domain Object. If your domain supports FIDO authentication, you can remove the Trusted Domain Object while maintaining the Microsoft Entra service account required for the FIDO authentication service.

## Remove all Kerberos Settings

You can remove both the Microsoft Entra service account and the Trusted Domain Object using the following command:

```powershell
Remove-AzureAdKerberosServer -Domain $domain `
   -DomainCredential $domainCred `
   -UserPrincipalName $cloudUserName
```

## Next step

For more information, see:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
