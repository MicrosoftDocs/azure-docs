---
title: FAQ and troubleshooting for hybrid FIDO2 security keys - Azure Active Directory
description: Learn about some common questions and ways to troubleshoot passwordless hybrid FIDO2 security key sign-in using Azure Active Directory (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshoot
ms.date: 08/17/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: aakapo

ms.collection: M365-identity-device-management
---
# FAQ and troubleshooting passwordless for hybrid FIDO2 security key sign-in to on-premises resources with Azure Active Directory (preview)

This article covers frequently asked questions and known behaviors for hybrid Azure AD joined devices and passwordless sign-in to on-prem resources. This passwordless feature provides Azure AD authentication on Windows 10 devices for hybrid Azure AD joined devices using FIDO2 security keys. Users can sign into Windows on their devices with modern credentials like FIDO2 keys and access traditional Active Directory Domain Services (AD DS) based resources with a seamless single sign-on (SSO) experience to their on-prem resources.

With this passwordless preview,  users in a hybrid environment can perform the following actions:

* Sign in to hybrid Azure AD joined devices using FIDO2 security keys and get SSO access to on-prem resources.
* Sign in to Azure AD joined devices using FIDO2 security keys and get SSO access to on-prem resources.

To get started with FIDO2 security keys and hybrid access to on-premises resources, see the following articles:

1. [Passwordless Security keys](howto-authentication-passwordless-security-key.md)
1. [Passwordless Windows 10](howto-authentication-passwordless-security-key-windows.md)
1. [Passwordless On -premises](howto-authentication-passwordless-security-key-on-premises.md)

> [!NOTE]
> FIDO2 security keys are a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Frequently asked questions

### How is the data protected on the FIDO2 security key?

FIDO2 security keys have secure enclaves that protect the private keys. Security keys also have anti-hammering properties built into them, like in Windows Hello, where you can't extract the private key.

### How is Azure AD Kerberos linked to my on-premises Active Directory Domain Services environment?

There are two parts to this - the on-premises AD DS environment, and the Azure AD tenant.

**Active Directory Domain Services**

The Azure AD Kerberos server is represented in an on-premises AD DS environment as a Domain Controller (DC) object. This DC object is then made up of multiple objects:

* *CN=AzureADKerberos,OU=Domain Controllers,<\domain-DN>*
    
    A *Computer* object that represents a Read-Only Domain Controller (RODC) in AD DS. There's no actual computer associated with this object. Instead, it's a logical representation of a DC.

* *CN=krbtgt_AzureAD,CN=Users,<\domain-DN>*

    A *User* object that represents a RODC Kerberos Ticket Granting Ticket (TGT) encryption key.

* *CN=900274c4-b7d2-43c8-90ee-00a9f650e335,CN=AzureAD,CN=System,<\domain-DN>*

    A *ServiceConnectionPoint* object that stores metadata about the Azure AD Kerberos Server objects. The administrative tools use this object to identify and locate the Azure AD Kerberos Server objects.

**Azure Active Directory**

The Azure AD Kerberos Server is represented in Azure AD as a *KerberosDomain* object. Each on-premises AD DS environment is represented as a single *KerberosDomain* object in the Azure AD tenant.

For example, you may have an AD DS forest with two domains such as *contoso.com* and *fabrikam.com*. If you choose to allow Azure AD to issue Kerberos Ticket Granting Tickets (TGTs) for the entire forest, there are two *KerberosDomain* objects in Azure AD - one object for *contoso.com* and one for *fabrikam.com*.

If you have multiple AD DS forests, you have one *KerberosDomain* object for each domain in each forest.

### As an admin, where can I view these Kerberos server objects that are created in AD and published in Azure AD?

To view all objects, use the Azure AD Kerberos Server PowerShell cmdlets included with the latest version of Azure AD Connect.

For more information, including instructions on how to view the objects, see [create Kerberos server Objects](howto-authentication-passwordless-security-key-on-premises.md#create-kerberos-server-object)

### Does this feature work if there's no internet connectivity?

Internet connectivity is a pre-requisite for this feature. The first time a user signs in using FIDO2 security keys, they must have internet connectivity. For subsequent sign-in events, cached sign-in should work and let the user authenticate without internet connectivity.

For a consistent experience, make sure that devices have internet access and line of sight to DCs.

### What are the specific end points that are required to be open to Azure AD?

The following endpoints are needed for registration and authentication:

* **.microsoftonline.com*
* **.microsoftonline-p.com*
* **.msauth.net*
* **.msauthimages.net*
* **.msecnd.net*
* **.msftauth.net*
* **.msftauthimages.net*
* **.phonefactor.net*
* *enterpriseregistration.windows.net*
* *management.azure.com*
* *policykeyservice.dc.ad.msft.net*
* *secure.aadcdn.microsoftonline-p.com*

For a full list of endpoints needed to use Microsoft online products, see [Office 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges).

### How does the registering of FIDO2 security keys work?

For more information how to register and use FIDO2 security keys, see [Enable passwordless security key sign-in](howto-authentication-passwordless-security-key.md).

### Why can't we have the public key registered to on-premises AD DS so there is no dependency on the internet?

We received feedback around the complexity of deployment model for Windows Hello for Business, so wanted to simplify the deployment model without having to use certificates and PKI (FIDO2 doesn't use certificates). This current approach is the model for all modern credentials moving forward.

### How are the keys rotated on the Kerberos server object?

Like any other DC, the Azure AD Kerberos Server encryption *krbtgt* keys should be rotated on a regular basis. It's recommended tp follow the same schedule as you use to rotate all other AD DS *krbtgt* keys.

> [!NOTE]
> Although there are other tools to rotate the *krbtgt* keys, you must [use the PowerShell cmdlets to rotate the *krbtgt* keys](howto-authentication-passwordless-security-key-on-premises.md#rotating-the-azure-ad-kerberos-server-key) of your Azure AD Kerberos Server. This method makes sure that the keys are updated in both the on-premises AD DS environment and in Azure AD.

### Why do we need Azure AD Connect? Does it write any info back to AD DS from Azure AD?

Azure AD Connect doesn't write info back from Azure AD to AD DS. The utility includes the PowerShell module to create the Kerberos Server Object in AD DS and publish it in Azure AD.

### How do I identify the domain join type (Azure AD joined or hybrid Azure AD joined) for my Windows 10 device?

To check if the Windows 10 client device has the right domain join type, use the following command:

```console
Dsregcmd/status
```

The following sample output shows that the device is Azure AD joined as *AzureADJoined: YES* is set:

```console
+---------------------+
| Device State        |
+---------------------+

AzureADJoined: YES
EnterpriseJoined: NO
DomainedJoined: NO
```

The following sample output shows that the device is hybrid Azure AD joined as *DomainedJoined: YES* is also now set. The *DomainName* is also shown:

```console
+---------------------+
| Device State        |
+---------------------+

AzureADJoined: YES
EnterpriseJoined: NO
DomainedJoined: YES
DomainName: CONTOSO
```

On a Windows Server 2016 or 2019 domain controller, check that the Nov patch is applied. If needed, run Windows Update to install it.

From a client device, run the following command to verify connectivity to an appropriate domain controller:

```
nltest /dsgetdc:<domain> /keylist /kdc
```

### Is there a way for admins to provision the keys for the users directly?

No, not at this time.

### What's the recommendation on the number of DCs that should be patched?

We recommend patching a majority of your Windows Server 2016 or 2019 domain controllers with the patch to ensure they can handle the authentication request load of your organization.

### What does the HTTP request/response look like when requesting PRT+ partial TGT

The HTTP request is a standard Primary Refresh Token (PRT) request. This PRT request includes a claim indicating a Kerberos Ticket Granting Ticket (TGT) is needed.

| Claim | Value | Description                             |
|-------|-------|-----------------------------------------|
| tgt   | true  | Claim indicates the client needs a TGT. |

Azure AD combines the encrypted client key and message buffer into the PRT response as additional properties. The payload is encrypted using the Azure AD Device session key.

| Field              | Type   | Description  |
|--------------------|--------|--------------|
| tgt_client_key     | string | Base64 encoded client key (secret). This is the client secret used to protect the TGT. As this is a passwordless scenario, the client secret is generated by the server as part of each TGT request and then returned to the client in the response. |
| tgt_key_type       | int    | The on-premises AD DS key type used for both the client key and the Kerberos session key included in the KERB_MESSAGE_BUFFER. |
| tgt_message_buffer | string | Base64 encoded KERB_MESSAGE_BUFFER. |

### Is partial TGT renewed at same interval as PRT (every 4 hours) or is this TGT flushed when lock/unlock is done?

Yes, CloudAP will try to refresh it every 4 hours in most cases unless IT set some special policy etc. If refresh fails, it will fall back to the original TGT. AAD cloudap plugin has list of conditions that can trigger PRT refresh along with partial TGT.

### Can I deploy the FIDO2 credential provider on an on-premises only device?

No, this feature isn't supported for on-premise only device. The FIDO2 credential provider wouldn't show up.

### FIDO2 security key sign-in isn't working for my Domain Admin or other high privilege accounts. Why?

The default security policy doesn't grant Azure AD permission to sign high privilege accounts on to on-premises resources.

To unblock the accounts, use **Active Directory Users and Computers** to modify the *msDS-NeverRevealGroup* property of the *Azure AD Kerberos Computer object (CN=AzureADKerberos,OU=Domain Controllers,<domain-DN>)*.

## Known issues

### Users are unable to sign in using FIDO2 security keys as Windows Hello Face is too quick and is the default sign-in mechanism

Windows Hello Face is the intended best experience for a device where a user is enrolled. FIDO2 security keys are intended for use on shared devices or where Windows Hello for Business enrollment is a barrier.

If Windows Hello Face prevents the users from trying the FIDO2 security key sign-in scenario, users can turn off Hello Face sign in by removing Face Enrollment in **Settings > Sign-In Options**.

### Users aren't able to use FIDO2 security keys immediately after they create a hybrid Azure AD joined machine

On a clean install of a hybrid Azure AD joined machine, after the domain join and restart process, you must sign in with a password and wait for policy to synchronize before you can use to use a FIDO2 security key to sign in.

This is a known limitation for domain-joined devices, and isn't specific to FIDO2 security keys.

To check the current status, use the `dsregcmd /status` command. Check that both *AzureAdJoined* and *DomainJoined* show *YES*.

### Users are unable to get SSO to my NTLM network resource after signing in with a FIDO2 security key and receiving a credential prompt

Make sure that enough DCs are patched to respond in time to service your resource request. To check if you can see a server that is running the feature, review the output of `nltest /dsgetdc:<dc name> /keylist /kdc`

If you're able to see a DC with this feature, the user's password may have changed since they signed in or there's another issue. Collect logs as detailed in the following section for the Microsoft support team to debug.

## Troubleshooting tools

### Windows Client Issues

To collect data that helps troubleshoot issues with signing in to Windows or accessing on-premises resources from Windows 10 devices, complete the following steps:

1. Open the **Feedback hub** app. Make sure that your name is on the bottom left of the app, then select **Create a new feedback item**. For the feedback item type, choose *Problem*.
1. Select the *Security and Privacy* category, then the *FIDO* subcategory.
1. Toggle the check box  for *Send attached files and diagnostics to Microsoft along with my feedback*.
1. Select *Recreate my problems*, then *Start capture*.
1. Lock and unlock the machine with FIDO2 security key. If the issue occurs, try to unlock with other credentials.
1. Return to **Feedback Hub**, select **Stop capture**, and submit your feedback.
1. Go to the *Feedback* page, then the *My Feedback* tab. Select your recently submitted feedback.
1. Select the *Share* button in the top-right corner to get a link to the feedback. Include this link when you open a support case, or reply to the engineer assigned to an existing support case.

The **Feedback Hub** collects the following events logs and registry key info:

* HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\FIDO [*]
* HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\PasswordForWork\* [*]
* HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Policies\PasswordForWork\* [*]

* Live kernel dump
* Collect AppX package information

* UIF context files
* %SystemRoot%\System32\winevt\Logs\Microsoft-Windows-AAD%40Operational.evtx
* %SystemRoot%\System32\winevt\Logs\Microsoft-Windows-WebAuthN%40Operational.evtx
* %SystemRoot%\System32\winevt\Logs\Microsoft-Windows-HelloForBusiness%40Operational.evtx

### Deployment Issues

To troubleshoot issues with deploying the Azure AD Kerberos Server using the new PowerShell module included with Azure AD Connect, review the following steps.

#### Viewing the logs

The Azure AD Kerberos Server PowerShell cmdlets use the same logging as the standard Azure AD Connect Wizard. To view information or error details from the cmdlets, complete the following steps:

1. On the Azure AD Connect Server, browse to *C:\ProgramData\AADConnect\*. This folder is hidden by default.
1. Open and view the most recent *trace-*.log* file located in the directory.

#### Viewing the Azure AD Kerberos Server Objects

To view the Azure AD Kerberos Server Objects and verify they are in good order, complete the following steps:

1. On the Azure AD Connect Server, open PowerShell and navigate to *C:\Program Files\Microsoft Azure Active Directory Connect\AzureADKerberos\*
1. Run the following PowerShell commands to view the Azure AD Kerberos Server from both Azure AD and on-premises AD DS.

    Replace *contoso.corp.com* with the name of your on-premises AD DS domain.

    ```powershell
    Import-Module ".\AzureAdKerberos.psd1"

    # Specify the on-premises AD DS domain.
    $domain = "contoso.corp.com"

    # Enter an Azure Active Directory Global Admin username and password.
    $cloudCred = Get-Credential

    # Enter a Domain Admin username and password.
    $domainCred = Get-Credential

    # Get the Azure AD Kerberos Server Object
    Get-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential
    $domainCred
    ```

This command outputs the properties of the Azure AD Kerberos Server from both Azure AD and on-premises AD DS. Review the properties to verify that everything is in good order. Use the table below to verify the properties.

The first set of properties is from the objects in the on-premises AD DS environment. The second half (the properties that begin with *Cloud** are from the Kerberos Server object in Azure AD.

| Property           | Description  |
|--------------------|--------------|
| Id                 | The unique Id of the AD DS domain controller object. |
| DomainDnsName      | The DNS domain name of the AD DS domain. |
| ComputerAccount    | The computer account object of the Azure AD Kerberos Server object (the DC). |
| UserAccount        | The disabled user account object that holds the Azure AD Kerberos Server TGT encryption key. The DN of this account is *CN=krbtgt_AzureAD,CN=Users,<Domain-DN>* |
| KeyVersion         | The key version of the Azure AD Kerberos Server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication meta-data and will likely be greater than one. For example, the initial *KeyVersion* could be *192272*. The first time the key is rotated, the version could advance to *212621*. The important thing to verify is that the *KeyVersion* for the on-premises object and the *CloudKeyVersion* for the cloud object are the same. |
| KeyUpdatedOn       | The date and time that the Azure AD Kerberos Server TGT encryption key was updated or created. |
| KeyUpdatedFrom     | The DC where the Azure AD Kerberos Server TGT encryption key was last updated. |
| CloudId            | The *Id* from the Azure AD Object. Must match the *Id* above. |
| CloudDomainDnsName | The *DomainDnsName* from the Azure AD Object. Must match the *DomainDnsName* above. |
| CloudKeyVersion    | The *KeyVersion* from the Azure AD Object. Must match the *KeyVersion* above. |
| CloudKeyUpdatedOn  | The *KeyUpdatedOn* from the Azure AD Object. Must match the *KeyUpdatedOn* above. |

## Next steps
