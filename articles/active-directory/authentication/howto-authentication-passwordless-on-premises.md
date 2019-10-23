---
title: Passwordless security key sign in to on-premises resources (preview) - Azure Active Directory
description: Enable passwordless security key sign in to on-premises resources (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/05/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown, aakapo

ms.collection: M365-identity-device-management
---
# Enable passwordless security key sign in to on-premises resources (preview)

This document focuses on enabling passwordless authentication to on-premises resources for environments with both **Azure AD joined** and **hybrid Azure AD joined** Windows 10 devices. This functionality provides seamless single sign-on to on-premises resources using Microsoft-compatible security keys.

For enterprises that use passwords today and have a shared PC environment, security keys provide a seamless way for workers to authenticate without entering a username or password.

## SSO to on-premises resources using FIDO2 keys

Azure Active Directory can issue Kerberos Ticket Granting Tickets (TGTs) for one or more of your Active Directory domains. This functionality allows users to sign into Windows with modern credentials like FIDO2 security keys and access traditional Active Directory based resources. Kerberos Service Tickets and authorization will continue to be controlled by your on-premises Active Directory Domain Controllers.

An Azure AD Kerberos Server object will be created in your on-premises Active Directory and then be securely published to Azure Active Directory. The object is not associated with any physical servers. It is simply a resource that can be used by Azure Active Directory to generate Kerberos Ticket Granting Tickets (TGTs) for your Active Directory Domain.

## Requirements

Organizations must complete the steps in the article [Enable passwordless security key sign to Windows 10 devices (preview)](howto-authentication-passwordless-security-key.md) before completing the steps in this article.

Organizations must meet the following software requirements.

- Have at least one Domain Controller running the Windows Server Insider skip ahead build **or** have fully patched Windows Server 2016/2019 Domain Controllers.
- Azure AD joined devices must be running Windows 10 version 1809 or higher
- Hybrid Azure AD joined devices must be running Windows 10 Insider Build 18945 or newer
- Upgrade to the latest version of [Azure AD Connect](../hybrid/how-to-connect-install-roadmap.md#install-azure-ad-connect)

## Known limitations

- The scenario supports single sign-on (SSO) to both:
   - Cloud resources like Office 365 and other SAML enabled applications.
   - On-premises resources, and Windows-Integrated authentication to web sites, including web sites and SharePoint sites that require IIS Authentication, and/or resources that use NTLM authentication.

The following scenarios are not supported:

- Windows Server Active Directory Domain Services (AD DS) domain joined (on-premises only devices) deployment **not supported**.
- RDP, VDI, and Citrix scenarios are **not supported** using security key.
- S/MIME is **not supported** using security key.
- “Run as“ is **not supported** using security key.
- Log in to a server using security key is **not supported**.

## Create Kerberos server object

Administrators will use PowerShell tools from their Azure AD Connect server to create an Azure AD Kerberos Server object in their on-premises directory.

1. Upgrade to the latest version of Azure AD Connect. The instructions assume you have already configured Azure AD Connect to support your hybrid environment.
1.	On the Azure AD Connect Server, open an elevated PowerShell prompt, and navigate to C:\Program Files\Microsoft Azure Active Directory Connect\AzureADKerberos\
1. Run the following PowerShell commands to create a new Azure AD Kerberos server object in both your on-premises Active Directory domain and Azure Active Directory tenant.

> [!NOTE]
> Replace "contoso.corp.com" in the following example with your on-premises Active Directory domain name.

```PowerShell
Import-Module ".\AzureAdKerberos.psd1"

# Specify the on-premises Active Directory domain. A new Azure AD
# Kerberos Server object will be created in this Active Directory domain.
$domain = "contoso.corp.com"

# Enter an Azure Active Directory global administrator username and password.
$cloudCred = Get-Credential

# Enter a domain administrator username and password.
$domainCred = Get-Credential

# Create the new Azure AD Kerberos Server object in Active Directory
# and then publish it to Azure Active Directory.
Set-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
```

### Viewing and verifying the Azure AD Kerberos Server

You can view and verify the newly created Azure AD Kerberos Server using the following command. 

```PowerShell
Get-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
```

This command will output the properties of the Azure AD Kerberos Server. You can review the properties to verify that everything is in good order.

| Property | Description |
| --- | --- |
| ID | The unique ID of the AD Domain Controller object. This ID is sometimes referred to as it’s “slot” or it’s “branch ID”. |
| DomainDnsName | The DNS domain name of the Active Directory Domain. |
| ComputerAccount | The computer account object of the Azure AD Kerberos Server object (The DC). |
| UserAccount | The disabled user account object that holds the Azure AD Kerberos Server TGT encryption key. The DN of this account will be: <br> CN=krbtgt_AzureAD,CN=Users,<Domain-DN> |
| KeyVersion | The key version of the Azure AD Kerberos Server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication meta-data and will likely be greater than one. For example, the initial KeyVersion could be 192272. The first time the key is rotated, the version could advance to 212621. The important thing to verify is that the KeyVersion for the on-premises object and the CloudKeyVersion for the cloud object are the same. |
| KeyUpdatedOn | The date and time that the Azure AD Kerberos Server TGT encryption key was updated/created. |
| KeyUpdatedFrom | The Domain Controller where the Azure AD Kerberos Server TGT encryption key was last updated. |
| CloudId | The ID from the Azure AD Object. Must match the ID above. |
| CloudDomainDnsName | The DomainDnsName from the Azure AD Object. Must match the DomainDnsName above. |
| CloudKeyVersion | The KeyVersion from the Azure AD Object. Must match the KeyVersion above. |
| CloudKeyUpdatedOn | The KeyUpdatedOn from the Azure AD Object. Must match the KeyUpdatedOn above. |

### Rotating the Azure AD Kerberos Server key

The Azure AD Kerberos Server encryption krbtgt keys should be rotated on a regular basis. It’s recommended you follow the same schedule you use to rotate all other Active Directory Domain Controller krbtgt keys.

> [!WARNING]
> There are other tools that could rotate the krbtgt keys, however, you must use the tools mentioned in this document to rotate the krbtgt keys of your Azure AD Kerberos Server. This ensures the keys are updated in both on-premises AD and Azure AD.

```PowerShell
Set-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred -RotateServerKey
```

### Removing the Azure AD Kerberos Server

If you would like to revert the scenario and remove the Azure AD Kerberos Server from both on-premises Active Directory and Azure Active Directory, run the following command.  

```PowerShell
Remove-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential $domainCred
```

### Multi-forest and multi-domain scenarios

The Azure AD Kerberos server object is represented in Azure AD as a KerberosDomain object. Each on-premises Active Directory domain is represented as a single KerberosDomain object in Azure AD.

For example, your organization has an Active Directory forest with two domains, contoso.com and fabrikam.com. If you choose to allow Azure AD to issue Kerberos Ticket Granting Tickets (TGT) for the entire forest, there will be two KerberosDomain objects in Azure AD. One KerberosDomain object for contoso.com and one for fabrikam.com. If you have multiple Active Directory forests, you will have one KerberosDomain object for each domain in each forest.

You will need to run the steps in [Create Kerberos server object](#create-kerberos-server-object) in each domain and forest in your organization.

## Known issues

Logon with FIDO will be blocked if your password has expired. expectation for user to reset password over lock screen before being able to log in using FIDO

## Frequently asked questions

### Does this work in my on-premises environment?

This feature does NOT work for a pure on-premises environment.

### My organization requires two factor authentication to access resources, what can I do to support this requirement?

Security keys come in a variety of form factors. Please contact the device manufacturer of interest to discuss how their devices can be enabled with a PIN or biometric as a second factor.

### Can admins set up security keys?

We are working on this capability for GA of this feature.

### Where can I go to find compliant Security Keys?

The following vendors provide security keys that work with our services. Please work with these vendors to get the correct set of keys for validation.

- Yubico
- Feitian
- HID
- Ensurity
- eWBM

Check out this page to get a list of vendors that provide compatible keys

### Can I use a phone as a Windows Hello security key?

We are investigating support for phones for future releases.

### What do I do if I lose my Security Key?

You can remove keys from the Azure portal, by navigating to the security info page and removing the security key 

### What do I do if Windows Hello Face is too quick and preventing me from trying FIDO?

Windows Hello Face is the intended best experience for a device where a user has it enrolled. But you can turn off Hello Face sign in by removing your Face Enrollment in Settings Sign-In Options if it's preventing you from trying the FIDO logon scenario.

### I’m not able to use FIDO immediately after I create a hybrid Azure AD joined machine

If clean installing a hybrid Azure AD joined machine, post domain join and restart you must sign in with a password and wait for policy to sync before being able to use FIDO to sign in

- Check your current status by typing dsregcmd /status into a command window and check that both AzureAdJoined and DomainJoined are showing YES.
- This delay is a known limitation for domain joined devices and not FIDO specific.

### I’m unable to get SSO to my NTLM network resource after signing in with FIDO and get a credential prompt

There are known limitations based on how many servers have the new build and which will respond in time to service your resource request. To check if you can see a server that is running the feature, check the output of `nltest /dsgetdc:contoso /keylist /kdc`

## Next steps

[Learn more about passwordless](concept-authentication-passwordless.md)
