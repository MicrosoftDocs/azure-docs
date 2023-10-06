---
title: Passwordless security key sign-in to on-premises resources
description: Learn how to enable passwordless security key sign-in to on-premises resources by using Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: librown, aakapo

ms.collection: M365-identity-device-management
---
# Enable passwordless security key sign-in to on-premises resources by using Microsoft Entra ID 

This document discusses how to enable passwordless authentication to on-premises resources for environments with both *Microsoft Entra joined* and *Microsoft Entra hybrid joined* Windows 10 devices. This passwordless authentication functionality provides seamless single sign-on (SSO) to on-premises resources when you use Microsoft-compatible security keys, or with [Windows Hello for Business Cloud trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cloud-trust)

## Use SSO to sign in to on-premises resources by using FIDO2 keys

Microsoft Entra ID can issue Kerberos ticket-granting tickets (TGTs) for one or more of your Active Directory domains. With this functionality, users can sign in to Windows with modern credentials, such as FIDO2 security keys, and then access traditional Active Directory-based resources. Kerberos Service Tickets and authorization continue to be controlled by your on-premises Active Directory domain controllers (DCs).

A Microsoft Entra Kerberos server object is created in your on-premises Active Directory instance and then securely published to Microsoft Entra ID. The object isn't associated with any physical servers. It's simply a resource that can be used by Microsoft Entra ID to generate Kerberos TGTs for your Active Directory domain.

:::image type="Image" source="./media/howto-authentication-passwordless-on-premises/fido2-ticket-granting-ticket-exchange-process.png" alt-text="Diagram showing how to get a TGT from Microsoft Entra ID and Active Directory Domain Services." lightbox="./media/howto-authentication-passwordless-on-premises/fido2-ticket-granting-ticket-exchange-process.png":::

1. A user signs in to a Windows 10 device with an FIDO2 security key and authenticates to Microsoft Entra ID.
1. Microsoft Entra ID checks the directory for a Kerberos Server key that matches the user's on-premises Active Directory domain.

   Microsoft Entra ID generates a Kerberos TGT for the user's on-premises Active Directory domain. The TGT includes the user's SID only, and no authorization data.

1. The TGT is returned to the client along with the user's Microsoft Entra Primary Refresh Token (PRT).
1. The client machine contacts an on-premises Active Directory Domain Controller and trades the partial TGT for a fully formed TGT.
1. The client machine now has a Microsoft Entra PRT and a full Active Directory TGT and can access both cloud and on-premises resources.

## Prerequisites

Before you begin the procedures in this article, your organization must complete the instructions in [Enable passwordless security key sign-in to Windows 10 devices](howto-authentication-passwordless-security-key.md).

You must also meet the following system requirements:

- Devices must be running Windows 10 version 2004 or later.

- Your Windows Server domain controllers must run Windows Server 2016 or later and have patches installed for the following servers:
    - [Windows Server 2016](https://support.microsoft.com/help/4534307/windows-10-update-kb4534307)
    - [Windows Server 2019](https://support.microsoft.com/help/4534321/windows-10-update-kb4534321)

- AES256_HMAC_SHA1 must be enabled when **Network security: Configure encryption types allowed for Kerberos** policy is [configured](/windows/security/threat-protection/security-policy-settings/network-security-configure-encryption-types-allowed-for-kerberos) on domain controllers.

- Have the credentials required to complete the steps in the scenario:
    - An Active Directory user who is a member of the Domain Admins group for a domain and a member of the Enterprise Admins group for a forest. Referred to as **$domainCred**.
    - A Microsoft Entra user who is a member of the Global Administrators role. Referred to as **$cloudCred**.
 
### Supported scenarios

The scenario in this article supports SSO in both of the following instances:

- Cloud resources such as Microsoft 365 and other Security Assertion Markup Language (SAML)-enabled applications.
- On-premises resources, and Windows-integrated authentication to websites. The resources can include websites and SharePoint sites that require IIS authentication and/or resources that use NTLM authentication.

### Unsupported scenarios

The following scenarios aren't supported:

- Windows Server Active Directory Domain Services (AD DS)-joined (on-premises only devices) deployment.
- Remote Desktop Protocol (RDP), virtual desktop infrastructure (VDI), and Citrix scenarios by using a security key.
- S/MIME by using a security key.
- *Run as* by using a security key.
- Log in to a server by using a security key.

<a name='install-the-azure-ad-kerberos-powershell-module'></a>

## Install the `AzureADHybridAuthenticationManagement` module

The [`AzureADHybridAuthenticationManagement` module](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement) provides FIDO2 management features for administrators.

1. Open a PowerShell prompt using the Run as administrator option.
1. Install the `AzureADHybridAuthenticationManagement` module:

   ```powershell
   # First, ensure TLS 1.2 for PowerShell gallery access.
   [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

   # Install the AzureADHybridAuthenticationManagement PowerShell module.
   Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber
   ```

> [!NOTE]
> - The `AzureADHybridAuthenticationManagement` module uses the [AzureADPreview PowerShell module](https://www.powershellgallery.com/packages/AzureADPreview) to provide advanced Microsoft Entra management features. If the [Azure Active Directory PowerShell module](https://www.powershellgallery.com/packages/AzureAD) is already installed on your local computer, the installation described here might fail because of conflict. To prevent any conflicts during installation, be sure to include the "-AllowClobber" option flag.
> - You can install the `AzureADHybridAuthenticationManagement` module on any computer from which you can access your on-premises Active Directory Domain Controller, without dependency on the Microsoft Entra Connect solution.
> - The `AzureADHybridAuthenticationManagement` module is distributed through the [PowerShell Gallery](https://www.powershellgallery.com/). The PowerShell Gallery is the central repository for PowerShell content. In it, you can find useful PowerShell modules that contain PowerShell commands and Desired State Configuration (DSC) resources.

## Create a Kerberos Server object

Administrators use the `AzureADHybridAuthenticationManagement` module to create a Microsoft Entra Kerberos server object in their on-premises directory.

Run the following steps in each domain and forest in your organization that contain Microsoft Entra users:

1. Open a PowerShell prompt using the Run as administrator option.
1. Run the following PowerShell commands to create a new Microsoft Entra Kerberos server object both in your on-premises Active Directory domain and in your Microsoft Entra tenant.

### Example 1 prompt for all credentials

   ```powershell
   # Specify the on-premises Active Directory domain. A new Azure AD
   # Kerberos Server object will be created in this Active Directory domain.
   $domain = $env:USERDNSDOMAIN

   # Enter an Azure Active Directory global administrator username and password.
   $cloudCred = Get-Credential -Message 'An Active Directory user who is a member of the Global Administrators group for Azure AD.'

   # Enter a domain administrator username and password.
   $domainCred = Get-Credential -Message 'An Active Directory user who is a member of the Domain Admins group.'

   # Create the new Azure AD Kerberos Server object in Active Directory
   # and then publish it to Azure Active Directory.
   Set-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
   ```

### Example 2 prompt for cloud credential
   > [!NOTE]
   > If you're working on a domain-joined machine with an account that has domain administrator privileges, you can skip the "-DomainCredential" parameter. If the "-DomainCredential" parameter isn't provided, the current Windows login credential is used to access your on-premises Active Directory Domain Controller.

   ```powershell
   # Specify the on-premises Active Directory domain. A new Azure AD
   # Kerberos Server object will be created in this Active Directory domain.
   $domain = $env:USERDNSDOMAIN

   # Enter an Azure Active Directory global administrator username and password.
   $cloudCred = Get-Credential

   # Create the new Azure AD Kerberos Server object in Active Directory
   # and then publish it to Azure Active Directory.
   # Use the current windows login credential to access the on-prem AD.
   Set-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred
   ```

### Example 3 prompt for all credentials using modern authentication
   > [!NOTE]
   > If your organization protects password-based sign-in and enforces modern authentication methods such as multifactor authentication, FIDO2, or smart card technology, you must use the `-UserPrincipalName` parameter with the User Principal Name (UPN) of a global administrator.
   > - Replace `contoso.corp.com` in the following example with your on-premises Active Directory domain name.
   > - Replace `administrator@contoso.onmicrosoft.com` in the following example with the UPN of a global administrator.

   ```powershell
   # Specify the on-premises Active Directory domain. A new Azure AD
   # Kerberos Server object will be created in this Active Directory domain.
   $domain = $env:USERDNSDOMAIN

   # Enter a UPN of an Azure Active Directory global administrator
   $userPrincipalName = "administrator@contoso.onmicrosoft.com"

   # Enter a domain administrator username and password.
   $domainCred = Get-Credential

   # Create the new Azure AD Kerberos Server object in Active Directory
   # and then publish it to Azure Active Directory.
   # Open an interactive sign-in prompt with given username to access the Azure AD.
   Set-AzureADKerberosServer -Domain $domain -UserPrincipalName $userPrincipalName -DomainCredential $domainCred
   ```

### Example 4 prompt for cloud credentials using modern authentication
   > [!NOTE]
   > If you are working on a domain-joined machine with an account that has domain administrator privileges and your organization protects password-based sign-in and enforces modern authentication methods such as multifactor authentication, FIDO2, or smart card technology, you must use the `-UserPrincipalName` parameter with the User Principal Name (UPN) of a global administrator. And you can skip the "-DomainCredential" parameter.
      > - Replace `administrator@contoso.onmicrosoft.com` in the following example with the UPN of a global administrator.

   ```powershell
   # Specify the on-premises Active Directory domain. A new Azure AD
   # Kerberos Server object will be created in this Active Directory domain.
   $domain = $env:USERDNSDOMAIN

   # Enter a UPN of an Azure Active Directory global administrator
   $userPrincipalName = "administrator@contoso.onmicrosoft.com"

   # Create the new Azure AD Kerberos Server object in Active Directory
   # and then publish it to Azure Active Directory.
   # Open an interactive sign-in prompt with given username to access the Azure AD.
   Set-AzureADKerberosServer -Domain $domain -UserPrincipalName $userPrincipalName
   ```

<a name='view-and-verify-the-azure-ad-kerberos-server'></a>

### View and verify the Microsoft Entra Kerberos server

You can view and verify the newly created Microsoft Entra Kerberos server by using the following command:

```powershell
Get-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
```

This command outputs the properties of the Microsoft Entra Kerberos server. You can review the properties to verify that everything is in good order.

> [!NOTE]
> Running against another domain by supplying the credential will connect over NTLM, and then it fails. If the users are in the Protected Users security group in Active Directory, complete these steps to resolve the issue: Sign in as another domain user in **ADConnect** and don’t supply "-domainCredential". The Kerberos ticket of the user that's currently signed in is used. You can confirm by executing `whoami /groups` to validate whether the user has the required permissions in Active Directory to execute the preceding command.
 
| Property | Description |
| --- | --- |
| ID | The unique ID of the AD DS DC object. This ID is sometimes referred to as its *slot* or its *branch ID*. |
| DomainDnsName | The DNS domain name of the Active Directory domain. |
| ComputerAccount | The computer account object of the Microsoft Entra Kerberos server object (the DC). |
| UserAccount | The disabled user account object that holds the Microsoft Entra Kerberos server TGT encryption key. The domain name of this account is `CN=krbtgt_AzureAD,CN=Users,<Domain-DN>`. |
| KeyVersion | The key version of the Microsoft Entra Kerberos server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication metadata and likely greater than one. For example, the initial *KeyVersion* could be *192272*. The first time the key is rotated, the version could advance to *212621*. The important thing to verify is that the *KeyVersion* for the on-premises object and the *CloudKeyVersion* for the cloud object are the same. |
| KeyUpdatedOn | The date and time that the Microsoft Entra Kerberos server TGT encryption key was updated or created. |
| KeyUpdatedFrom | The DC where the Microsoft Entra Kerberos server TGT encryption key was last updated. |
| CloudId | The ID from the Microsoft Entra object. Must match the ID from the first line of the table. |
| CloudDomainDnsName | The *DomainDnsName* from the Microsoft Entra object. Must match the *DomainDnsName* from the second line of the table. |
| CloudKeyVersion | The *KeyVersion* from the Microsoft Entra object. Must match the *KeyVersion* from the fifth line of the table. |
| CloudKeyUpdatedOn | The *KeyUpdatedOn* from the Microsoft Entra object. Must match the *KeyUpdatedOn* from the sixth line of the table. |
| | |

<a name='rotate-the-azure-ad-kerberos-server-key'></a>

### Rotate the Microsoft Entra Kerberos server key

The Microsoft Entra Kerberos server encryption *krbtgt* keys should be rotated on a regular basis. We recommend that you follow the same schedule you use to rotate all other Active Directory DC *krbtgt* keys.

> [!WARNING]
> There are other tools that could rotate the *krbtgt* keys. However, you must use the tools mentioned in this document to rotate the *krbtgt* keys of your Microsoft Entra Kerberos server. This ensures that the keys are updated in both on-premises Active Directory and Microsoft Entra ID.

```powershell
Set-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred -RotateServerKey
```

<a name='remove-the-azure-ad-kerberos-server'></a>

### Remove the Microsoft Entra Kerberos server

If you want to revert the scenario and remove the Microsoft Entra Kerberos server from both the on-premises Active Directory and Microsoft Entra ID, run the following command:

```powershell
Remove-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
```

### Multiforest and multidomain scenarios

The Microsoft Entra Kerberos server object is represented in Microsoft Entra ID as a *KerberosDomain* object. Each on-premises Active Directory domain is represented as a single *KerberosDomain* object in Microsoft Entra ID.

For example, let's say that your organization has an Active Directory forest with two domains, `contoso.com` and `fabrikam.com`. If you choose to allow Microsoft Entra ID to issue Kerberos TGTs for the entire forest, there are two *KerberosDomain* objects in Microsoft Entra ID, one *KerberosDomain* object for `contoso.com` and the other for `fabrikam.com`. If you have multiple Active Directory forests, there is one *KerberosDomain* object for each domain in each forest.

Follow the instructions in [Create a Kerberos Server object](#create-a-kerberos-server-object) in each domain and forest in your organization that contains Microsoft Entra users.

## Known behavior

If your password has expired, signing in with FIDO is blocked. The expectation is that users reset their passwords before they can log in by using FIDO.

## Troubleshooting and feedback

If you encounter issues or want to share feedback about this passwordless security key sign-in feature, share via the Windows Feedback Hub app by doing the following:

1. Open **Feedback Hub**, and make sure that you're signed in.
1. Submit feedback by selecting the following categories:
   - Category: Security and Privacy
   - Subcategory: FIDO
1. To capture logs, use the **Recreate my Problem** option.

## Passwordless security key sign-in FAQ

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Here are some answers to commonly asked questions about passwordless sign-in:

### Does passwordless security key sign-in work in my on-premises environment?

The feature doesn't work in a pure on-premises AD DS environment.

### My organization requires two-factor authentication to access resources. What can I do to support this requirement?

Security keys come in a variety of form factors. Contact the device manufacturer of record to discuss how their devices can be enabled with a PIN or biometric as a second factor.

### Can administrators set up security keys?

We are working on this capability for the general availability (GA) release of this feature.

### Where can I go to find compliant security keys?

For information about compliant security keys, see [FIDO2 security keys](concept-authentication-passwordless.md#fido2-security-keys).

### What can I do if I lose my security key?

To delete an enrolled security key, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com), and then go to the **Security info** page.

<a name='what-can-i-do-if-im-unable-to-use-the-fido-security-key-immediately-after-i-create-a-hybrid-azure-ad-joined-machine'></a>

### What can I do if I'm unable to use the FIDO security key immediately after I create a Microsoft Entra hybrid joined machine?

If you're clean-installing a Microsoft Entra hybrid joined machine, after the domain join and restart process, you must sign in with a password and wait for the policy to sync before you can use the FIDO security key to sign in.

- Check your current status by running `dsregcmd /status` in a Command Prompt window, and check to ensure that both the **AzureAdJoined** and **DomainJoined** statuses are showing as *YES*.
- This delay in syncing is a known limitation of domain-joined devices and isn't FIDO-specific.

### What if I'm unable to get single sign-on to my NTLM network resource after I sign in with FIDO and get a credential prompt?

Make sure that enough DCs are patched to respond in time to service your resource request. To see whether a DC is running the feature, run `nltest /dsgetdc:contoso /keylist /kdc`, and then review the output.

> [!NOTE]
> The `/keylist` switch in the `nltest` command is available in client Windows 10 v2004 and later.

### Do FIDO2 security keys work in a Windows login with RODC present in the hybrid environment?

An FIDO2 Windows login looks for a writable DC to exchange the user TGT. As long as you have at least one writable DC per site, the login works fine. 

## Next steps

[Learn more about passwordless authentication](concept-authentication-passwordless.md)
