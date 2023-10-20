---
title: Known issues and troubleshooting for hybrid FIDO2 security keys
description: Learn about some known issues and ways to troubleshoot passwordless hybrid FIDO2 security key sign-in using Microsoft Entra ID 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshooting
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: aakapo

ms.collection: M365-identity-device-management
---
# Troubleshooting for hybrid deployments of FIDO2 security keys in Microsoft Entra ID 

This article covers frequently asked questions for Microsoft Entra hybrid joined devices and passwordless sign-in to on-prem resources. With this passwordless feature, you can enable Microsoft Entra authentication on Windows 10 devices for Microsoft Entra hybrid joined devices using FIDO2 security keys. Users can sign into Windows on their devices with modern credentials like FIDO2 keys and access traditional Active Directory Domain Services (AD DS) based resources with a seamless single sign-on (SSO) experience to their on-prem resources.

The following scenarios for users in a hybrid environment are supported:

* Sign in to Microsoft Entra hybrid joined devices using FIDO2 security keys and get SSO access to on-prem resources.
* Sign in to Microsoft Entra joined devices using FIDO2 security keys and get SSO access to on-prem resources.

To get started with FIDO2 security keys and hybrid access to on-premises resources, see the following articles:

* [Passwordless security keys](howto-authentication-passwordless-security-key.md)
* [Passwordless Windows 10](howto-authentication-passwordless-security-key-windows.md)
* [Passwordless on-premises](howto-authentication-passwordless-security-key-on-premises.md)

## Known issues

* [Users are unable to sign in using FIDO2 security keys as Windows Hello Face is too quick and is the default sign-in mechanism](#users-are-unable-to-sign-in-using-fido2-security-keys-as-windows-hello-face-is-too-quick-and-is-the-default-sign-in-mechanism)
* [Users aren't able to use FIDO2 security keys immediately after they create a Microsoft Entra hybrid joined machine](#users-arent-able-to-use-fido2-security-keys-immediately-after-they-create-a-hybrid-azure-ad-joined-machine)
* [Users are unable to get SSO to my NTLM network resource after signing in with a FIDO2 security key and receiving a credential prompt](#users-are-unable-to-get-sso-to-my-ntlm-network-resource-after-signing-in-with-a-fido2-security-key-and-receiving-a-credential-prompt)

### Users are unable to sign in using FIDO2 security keys as Windows Hello Face is too quick and is the default sign-in mechanism

Windows Hello Face is the intended best experience for a device where a user is enrolled. FIDO2 security keys are intended for use on shared devices or where Windows Hello for Business enrollment is a barrier.

If Windows Hello Face prevents the users from trying the FIDO2 security key sign-in scenario, users can turn off Hello Face sign in by removing Face Enrollment in **Settings > Sign-In Options**.

<a name='users-arent-able-to-use-fido2-security-keys-immediately-after-they-create-a-hybrid-azure-ad-joined-machine'></a>

### Users aren't able to use FIDO2 security keys immediately after they create a Microsoft Entra hybrid joined machine

After the domain-join and restart process on a clean install of a Microsoft Entra hybrid joined machine, you must sign in with a password and wait for policy to synchronize before you can use to use a FIDO2 security key to sign in.

This behavior is a known limitation for domain-joined devices, and isn't specific to FIDO2 security keys.

To check the current status, use the `dsregcmd /status` command. Check that both *AzureAdJoined* and *DomainJoined* show *YES*.

### Users are unable to get SSO to my NTLM network resource after signing in with a FIDO2 security key and receiving a credential prompt

Make sure that enough DCs are patched to respond in time to service your resource request. To check if you can see a server that is running the feature, review the output of `nltest /dsgetdc:<dc name> /keylist /kdc`

If you're able to see a DC with this feature, the user's password may have changed since they signed in, or there's another issue. Collect logs as detailed in the following section for the Microsoft support team to debug.

## Troubleshoot

There are two areas to troubleshoot - [Window client issues](#windows-client-issues), or [deployment issues](#deployment-issues).

### Windows Client Issues

To collect data that helps troubleshoot issues with signing in to Windows or accessing on-premises resources from Windows 10 devices, complete the following steps:

1. Open the **Feedback hub** app. Make sure that your name is on the bottom left of the app, then select **Create a new feedback item**.

    For the feedback item type, choose *Problem*.

1. Select the *Security and Privacy* category, then the *FIDO* subcategory.
1. Toggle the check box  for *Send attached files and diagnostics to Microsoft along with my feedback*.
1. Select *Recreate my problems*, then *Start capture*.
1. Lock and unlock the machine with FIDO2 security key. If the issue occurs, try to unlock with other credentials.
1. Return to **Feedback Hub**, select **Stop capture**, and submit your feedback.
1. Go to the *Feedback* page, then the *My Feedback* tab. Select your recently submitted feedback.
1. Select the *Share* button in the top-right corner to get a link to the feedback. Include this link when you open a support case, or reply to the engineer assigned to an existing support case.

The following events logs and registry key info is collected:

**Registry keys**

* *HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\FIDO [\*]*
* *HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\PasswordForWork\* [\*]*
* *HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Policies\PasswordForWork\* [\*]*

**Diagnostic information**

* Live kernel dump
* Collect AppX package information
* UIF context files

**Event logs**

* *%SystemRoot%\System32\winevt\Logs\Microsoft-Windows-AAD%40Operational.evtx*
* *%SystemRoot%\System32\winevt\Logs\Microsoft-Windows-WebAuthN%40Operational.evtx*
* *%SystemRoot%\System32\winevt\Logs\Microsoft-Windows-HelloForBusiness%40Operational.evtx*

### Deployment Issues

To troubleshoot issues with deploying the Microsoft Entra Kerberos server, use the logs for the new [AzureADHybridAuthenticationManagement](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement) PowerShell module.

#### Viewing the logs

The Microsoft Entra Kerberos server PowerShell cmdlets in the [AzureADHybridAuthenticationManagement](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement) module use the same logging as the standard Microsoft Entra Connect Wizard. To view information or error details from the cmdlets, complete the following steps:

1. On the machine where the [AzureADHybridAuthenticationManagement](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement) module was used, browse to `C:\ProgramData\AADConnect\`. This folder is hidden by default.
1. Open and view the most recent `trace-*.log` file located in the directory.

<a name='viewing-the-azure-ad-kerberos-server-objects'></a>

#### Viewing the Microsoft Entra Kerberos server Objects

To view the Microsoft Entra Kerberos server Objects and verify they are in good order, complete the following steps:

1. On the Microsoft Entra Connect Server or any other machine where the [AzureADHybridAuthenticationManagement](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement) module is installed, open PowerShell and navigate to `C:\Program Files\Microsoft Azure Active Directory Connect\AzureADKerberos\`
1. Run the following PowerShell commands to view the Microsoft Entra Kerberos server from both Microsoft Entra ID and on-premises AD DS.

    Replace *corp.contoso.com* with the name of your on-premises AD DS domain.

    ```powershell
    Import-Module ".\AzureAdKerberos.psd1"

    # Specify the on-premises AD DS domain.
    $domain = "corp.contoso.com"

    # Enter an Azure Active Directory Global Administrator username and password.
    $cloudCred = Get-Credential

    # Enter a Domain Admin username and password.
    $domainCred = Get-Credential

    # Get the Azure AD Kerberos Server Object
    Get-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential
    $domainCred
    ```

The command outputs the properties of the Microsoft Entra Kerberos server from both Microsoft Entra ID and on-premises AD DS. Review the properties to verify that everything is in good order. Use the table below to verify the properties.

The first set of properties is from the objects in the on-premises AD DS environment. The second half (the properties that begin with *Cloud**) are from the Kerberos Server object in Microsoft Entra ID:

| Property           | Description  |
|--------------------|--------------|
| Id                 | The unique *Id* of the AD DS domain controller object. |
| DomainDnsName      | The DNS domain name of the AD DS domain. |
| ComputerAccount    | The computer account object of the Microsoft Entra Kerberos server object (the DC). |
| UserAccount        | The disabled user account object that holds the Microsoft Entra Kerberos server TGT encryption key. The DN of this account is *CN=krbtgt_AzureAD,CN=Users,\<Domain-DN\>* |
| KeyVersion         | The key version of the Microsoft Entra Kerberos server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication meta-data and will likely be greater than one.<br /><br /> For example, the initial *KeyVersion* could be *192272*. The first time the key is rotated, the version could advance to *212621*.<br /><br /> The important thing to verify is that the *KeyVersion* for the on-premises object and the *CloudKeyVersion* for the cloud object are the same. |
| KeyUpdatedOn       | The date and time that the Microsoft Entra Kerberos server TGT encryption key was updated or created. |
| KeyUpdatedFrom     | The DC where the Microsoft Entra Kerberos server TGT encryption key was last updated. |
| CloudId            | The *Id* from the Microsoft Entra Object. Must match the *Id* above. |
| CloudDomainDnsName | The *DomainDnsName* from the Microsoft Entra Object. Must match the *DomainDnsName* above. |
| CloudKeyVersion    | The *KeyVersion* from the Microsoft Entra Object. Must match the *KeyVersion* above. |
| CloudKeyUpdatedOn  | The *KeyUpdatedOn* from the Microsoft Entra Object. Must match the *KeyUpdatedOn* above. |

## Next steps

To get started with FIDO2 security keys and hybrid access to on-premises resources, see the following articles:

* [Passwordless FIDO2 security keys](howto-authentication-passwordless-security-key.md)
* [Passwordless Windows 10](howto-authentication-passwordless-security-key-windows.md)
* [Passwordless on-premises](howto-authentication-passwordless-security-key-on-premises.md)
