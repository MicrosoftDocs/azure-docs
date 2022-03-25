---
title: How to set up Windows Authentication for Azure Active Directory with the incoming trust-based flow (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to set up Windows authentication for Azure Active Directory with the incoming trust-based flow.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: how-to
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 03/01/2022
---

# How to set up Windows Authentication for Azure AD with the incoming trust-based flow (Preview)

This article describes how to implement the incoming trust-based authentication flow to allow Active Directory (AD) joined clients running Windows 10, Windows Server 2012, or higher versions of Windows to authenticate to an Azure SQL Managed Instance using Windows Authentication. This article also shares steps to rotate a Kerberos Key for your Azure Active Directory (Azure AD) service account and Trusted Domain Object, and steps to remove a Trusted Domain Object and all Kerberos settings, if desired.

Enabling the incoming trust-based authentication flow is one step in [setting up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md). The [modern interactive flow (Preview)](winauth-azuread-setup-modern-interactive-flow.md) is available for enlightened clients running Windows 10 20H1, Windows Server 2022, or a higher version of Windows.

## Permissions

To complete the steps outlined in this article, you will need:

- An on-premises Active Directory administrator username and password.
- Azure AD global administrator account username and password.

## Prerequisites

To implement the incoming trust-based authentication flow, first ensure that the following prerequisites have been met:

|Prerequisite  |Description  |
|---------|---------|
|Client must run Windows 10, Windows Server 2012, or a higher version of Windows. |         |
|Clients must be joined to AD. The domain must have a functional level of Windows Server 2012 or higher. |  You can determine if the client is joined to AD by running the [dsregcmd command](../../active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status`  |
|Azure AD Hybrid Authentication Management Module. | This PowerShell module provides management features for on-premises setup. |
|Azure tenant.  |         |
|Azure subscription under the same Azure AD tenant you plan to use for authentication.|         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |


## Create and configure the Azure AD Kerberos Trusted Domain Object

To create and configure the Azure AD Kerberos Trusted Domain Object, you will install the Azure AD Hybrid Authentication Management PowerShell module.

You will then use the Azure AD Hybrid Authentication Management PowerShell module to set up a Trusted Domain Object in the on-premises AD domain and register trust information with Azure AD. This creates an in-bound trust relationship into the on-premises AD, which enables on-premises AD to trust Azure AD.

### Set up the Trusted Domain Object

To set up the Trusted Domain Object, first install the Azure AD Hybrid Authentication Management PowerShell module.

#### Install the Azure AD Hybrid Authentication Management PowerShell module

1. Start a Windows PowerShell session with the **Run as administrator** option.

1. Install the Azure AD Hybrid Authentication Management PowerShell module using the following script. The script:

    - Enables TLS 1.2 for communication.
    - Installs the NuGet package provider.
    - Registers the PSGallery repository.
    - Installs the PowerShellGet module.
    - Installs the Azure AD Hybrid Authentication Management PowerShell module.
        - The Azure AD Hybrid Authentication Management PowerShell uses the AzureADPreview module, which provides advanced Azure AD management feature.
        - To protect against unnecessary installation conflicts with AzureAD PowerShell module, this command includes the –AllowClobber option flag.

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
    - Set the `$cloudUserName` parameter to the username of a Global Administrator privileged account for Azure AD cloud access.

    > [!NOTE] 
    > If you wish to use your current Windows login account for your on-premises Active Directory access, you can skip the step where credentials are assigned to the `$domainCred` parameter. If you take this approach, do not include the `-DomainCredential` parameter in the PowerShell commands following this step.


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

    If this is the first time calling any Azure AD Kerberos command, you will be prompted for Azure AD cloud access.
      - Enter the password for your Azure AD global administrator account.
      - If your organization uses other modern authentication methods such as MFA (Azure Multi-Factor Authentication) or Smart Card, follow the instructions as requested for sign in.

    If this is the first time you're configuring Azure AD Kerberos settings, the [Get-AzureAdKerberosServer cmdlet](/active-directory/authentication/howto-authentication-passwordless-security-key-on-premises#view-and-verify-the-azure-ad-kerberos-server) will display empty information, as in the following sample output:

    ```
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

    If your domain already supports FIDO authentication, the `Get-AzureAdKerberosServer` cmdlet will display Azure AD Service account information, as in the following sample output. Note that the `CloudTrustDisplay` field returns an empty value.

    ```
    ID                  : 25614
    UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=aadsqlmi, DC=net
    ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=aadsqlmi, DC=net
    DisplayName         : krbtgt_25614
    DomainDnsName       : aadsqlmi.net
    KeyVersion          : 53325
    KeyUpdatedOn        : 2/24/2022 9:03:15 AM
    KeyUpdatedFrom      : ds-aad-auth-dem.aadsqlmi.net
    CloudDisplayName    : krbtgt_25614
    CloudDomainDnsName  : aadsqlmi.net
    CloudId             : 25614
    CloudKeyVersion     : 53325
    CloudKeyUpdatedOn   : 2/24/2022 9:03:15 AM
    CloudTrustDisplay   : 
    ```

1. Add the Trusted Domain Object.

    Run the [Set-AzureAdKerberosServer PowerShell cmdlet](/active-directory/authentication/howto-authentication-passwordless-security-key-on-premises#create-a-kerberos-server-object) to add the Trusted Domain Object. Be sure to include `-SetupCloudTrust` parameter. If there is no Azure AD service account, this command will create a new Azure AD service account. If there is an Azure AD service account already, this command will only create the requested Trusted Domain object.

    ```powershell
    Set-AzureAdKerberosServer -Domain $domain ` 
       -DomainCredential $domainCred ` 
       -UserPrincipalName $cloudUserName ` 
       -SetupCloudTrust 
    ```

    After creating the Trusted Domain Object, you can check the updated Kerberos Settings using the `Get-AzureAdKerberosServer` PowerShell cmdlet, as shown in the previous step. If the `Set-AzureAdKerberosServer` cmdlet has been run successfully with the `-SetupCloudTrust` parameter, the `CloudTrustDisplay` field should now return `Microsoft.AzureAD.Kdc.Service.TrustDisplay`, as in the following sample output:

    ```
    ID                  : 25614
    UserAccount         : CN=krbtgt-AzureAD, CN=Users, DC=aadsqlmi, DC=net
    ComputerAccount     : CN=AzureADKerberos, OU=Domain Controllers, DC=aadsqlmi, DC=net
    DisplayName         : krbtgt_25614
    DomainDnsName       : aadsqlmi.net
    KeyVersion          : 53325
    KeyUpdatedOn        : 2/24/2022 9:03:15 AM
    KeyUpdatedFrom      : ds-aad-auth-dem.aadsqlmi.net
    CloudDisplayName    : krbtgt_25614
    CloudDomainDnsName  : aadsqlmi.net
    CloudId             : 25614
    CloudKeyVersion     : 53325
    CloudKeyUpdatedOn   : 2/24/2022 9:03:15 AM
    CloudTrustDisplay   : Microsoft.AzureAD.Kdc.Service.TrustDisplay
    ```

## Configure the Group Policy Object (GPO) 

1. Identify your [Azure AD tenant ID](../../active-directory/fundamentals/active-directory-how-to-find-tenant.md).

1. Deploy the following Group Policy setting to client machines using the incoming trust-based flow:

    1. Edit the **Administrative Templates\System\Kerberos\Specify KDC proxy servers for Kerberos clients** policy setting.
    1. Select **Enabled**.
    1. Under **Options**, select **Show...**. This opens the Show Contents dialog box.

        :::image type="content" source="media/winauth-azuread/configure-policy-kdc-proxy.png" alt-text="Screenshot of dialog box to enable 'Specify KDC proxy servers for Kerberos clients'. The 'Show Contents' dialog allows input of a value name and the related value."  lightbox="media/winauth-azuread/configure-policy-kdc-proxy.png":::
    
    1. Define the KDC proxy servers settings using mappings as follows. Substitute your Azure AD tenant ID for the `your_Azure_AD_tenant_id` placeholder. Note the space following `https` and the space prior to the closing `/` in the value mapping.

        |Value name  |Value  |
        |---------|---------|
        |KERBEROS.MICROSOFTONLINE.COM    | <https login.microsoftonline.com:443:`your_Azure_AD_tenant_id`/kerberos /> |
        
        :::image type="content" source="media/winauth-azuread/configure-policy-kdc-proxy-server-settings-detail.png" alt-text="Screenshot of the 'Define KDC proxy server settings' dialog box. A table allows input of multiple rows. Each row consists of a value name and a value.":::

    1. Select **OK** to close the 'Show Contents' dialog box.
    1. Select **Apply** on the 'Specify KDC proxy servers for Kerberos clients' dialog box.

## Rotate the Kerberos Key

You may periodically rotate the Kerberos Key for the created Azure AD Service account and Trusted Domain Object for management purposes.

```powershell
Set-AzureAdKerberosServer -Domain $domain ` 
   -DomainCredential $domainCred ` 
   -UserPrincipalName $cloudUserName -SetupCloudTrust ` 
   -RotateServerKey 
```

Once the key is rotated, it takes several hours to propagate the changed key between the Kerberos KDC servers. Due to this key distribution timing, you are limited to rotating key once within 24 hours. If you need to rotate the key again within 24 hours with any reason, for example, just after creating the Trusted Domain Object, you can add the `-Force` parameter:

```powershell
Set-AzureAdKerberosServer -Domain $domain ` 
   -DomainCredential $domainCred ` 
   -UserPrincipalName $cloudUserName -SetupCloudTrust ` 
   -RotateServerKey -Force 
```

## Remove the Trusted Domain Object

You can remove the added Trusted Domain Object using the following command: 

```powershell
Remove-AzureADKerberosTrustedDomainObject -Domain $domain ` 
   -DomainCredential $domainCred ` 
   -UserPrincipalName $cloudUserName 
```

This command will only remove the Trusted Domain Object. If your domain supports FIDO authentication, you can remove the Trusted Domain Object while maintaining the Azure AD Service account required for the FIDO authentication service.

## Remove all Kerberos Settings

You can remove both the Azure AD Service account and the Trusted Domain Object using the following command: 

```powershell
Remove-AzureAdKerberosServer -Domain $domain ` 
   -DomainCredential $domainCred ` 
   -UserPrincipalName $cloudUserName 
```

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory (Preview)](winauth-azuread-kerberos-managed-instance.md)
- [What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)](winauth-azuread-overview.md)
- [How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md)