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

This document focuses on enabling passwordless authentication to on-premises resources for environments with both **Azure AD joined** and **hybrid Azure AD joined** Windows 10 devices. This functionality provides seamless single sign-on (SSO) to on-premises resources using Microsoft-compatible security keys.

> [!NOTE]
> FIDO2 security keys are a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Frequently asked questions

###  How is the data protected on the FIDO key?

FIDO keys have secure enclaves that protect the private keys. They also have antihammering properties built into them, like Windows Hello, where you cannot extract the
private key.

### How is Azure AD Kerberos linked to my on-premises Active Directory?

#### Active Directory

The Azure AD Kerberos Server is represented in on-premises Active Directory as a Domain Controller object, which itself is made up of multiple objects:

* CN=AzureADKerberos,OU=Domain Controllers,<domain-DN>
    
    A Computer object representing a Read-Only Domain Controller in Active Directory. There is no actual physical computer/server associated with this object. It is a logical representation of a Domain Controller.

* CN=krbtgt_AzureAD,CN=Users,<domain-DN>

    A User object representing a Read-Only Domain Controller Kerberos Ticket Granting Ticket encryption key.

* CN=900274c4-b7d2-43c8-90ee-00a9f650e335,CN=AzureAD,CN=System ,<domain-DN>

    A ServiceConnectionPoint object used to store meta-data about the Azure AD Kerberos Server objects. The administrative tools make use of this object to identify and locate the Azure AD Kerberos Server objects.

#### Azure Active Directory

The Azure AD Kerberos Server is represented in Azure AD as a KerberosDomain object. Each onpremises Active Directory Domain is represented as a single KerberosDomain object in the Azure AD tenant.

For example, say you have an Active Directory Forest with two domains, contoso.com and fabrikam.com. If you choose to allow Azure AD to issue Kerberos Ticket Granting Tickets for the entire Forest, there will be two KerberosDomain objects in Azure AD. One for contoso.com and one for fabrikam.com. If you have multiple Active Directory Forests, you will have one KerberosDomain object for each Domain in each Forest, etc.

### As an admin, where can I view these Kerberos server object that are created in AD and published in AAD?

The easiest way to view all objects is by using the new Azure AD Kerberos Server PowerShell Cmdlets included with the latest version of Azure AD Connect. For more information, including instructions on how to view the objects, please refer to the docs to [create Kerberos server Objects](howto-authentication-passwordless-security-key-on-premises#create-kerberos-server-object.md)

### Would this work if there is no internet connectivity?

Internet connectivity is a pre-requisite for this feature. First time sign in using FIDO keys requires internet connectivity. For subsequent sign in, cached login would work and let the user authenticate to sign in.

Customers should ensure they have internet access and line of sight to DC’s to make sure they have a consistent experience

### What are the specific end points that talks to Azure AD that are required to be open?

The following endpoints are needed for registration and authentication:

*.microsoftonline.com
*.microsoftonline-p.com
*.msauth.net
*.msauthimages.net
*.msecnd.net
*.msftauth.net
*.msftauthimages.net
*.phonefactor.net
* enterpriseregistration.windows.net
* management.azure.com
* policykeyservice.dc.ad.msft.net
* secure.aadcdn.microsoftonline-p.com

For the full list of the endpoints needed to use Microsoft online products, see Office 365 URLs and IP address ranges

###  How does the registering of FIDO keys work? What are the endpoints that are needed for this?

https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-authenticationpasswordless-security-key

Endpoints are listed above.

### Why can’t we have the public key registered to on prem AD so there is no dependency on internet?

This would then be similar to the WHFB deployment model which we are trying to improve upon. We’ve had a bunch of feedback around the complexity of deployment model Windows Hello for Business has today. We wanted to simplify the deployment model without having to use certificates and PKI (FIDO does not use certs). The idea is to have the this as a model for all modern credentials and eventually moving Windows Hello to this model as well.

### How are the keys rotated on the Kerberos server object?

Just like any other Domain Controller, the Azure AD Kerberos Server encryption krbtgt keys should be rotated on a regular basis. It’s recommended you follow the same schedule you use to rotate all other Active Directory Domain Controller krbtgt keys.

NOTE There are other tools that could rotate the krbtgt keys, however, you must use the tools mentioned in this document to rotate the krbtgt keys of your Azure AD Kerberos Server. This ensures the keys are updated in both on-premises AD and Azure AD. Instructions on how to manage and rotate the Kerberos Server keys are also available here.

### Why do we need AAD connect? Does it write any info back to AD from AAD?

This does not write info back from AAD to AD but the AAD connect tool includes the power shell module to create the Kerberos Server Object in AD and publish it in Azure AD.

### In a hybrid AADJ device log in scenario, is CloudAP responsible to authenticate with AAD first? If yes what is the timeout value if the client does not have internet access and fall back to username and password prompt.

For FIDO logon on hybrid AADJ device, CloudAP is responsible for auth first. If there is delay or timeout, CloudAP doesn’t have an event, but AAD client event logs will have the timeout error. There is cache logon support if the machine is offline, but machine must be online for the first FIDO logon and it must be online periodically to get the token refreshed.

### How to identify the domain join type (AADJ or Hybrid AADJ) for my windows 10 device ?

1. Identify if the Windows 10 Client device has the right domain join type (AADJ vs Hybrid AADJ):

    `Dsregcmd/status`

    AADJ

    Hybrid AADJ

1. 2016/2019 Domain Controller is patched with the Nov patch:

    `nltest /dsgetdc:<domain> /keylist /kdc`

    Note: Run this command from a client to verify connectivity to an appropriate domain controller.

### Is there a way for admins to provision the keys for the users directly?

Not available today. We’ve heard this from several customers and are working to prioritize/plan this.

### What is our recommendation on number of DCs that should be patched?

We recommend patching a majority of your 2016/2019 domain controllers with the patch to ensure they can handle the authentication request load of your organization

### What does the HTTP request/response look like when requesting PRT+ partial TGT

The HTTP request is a standard Primary Refresh Token request. It Includes a claim indicating a Kerberos Ticket Granting Ticket is needed.

| Claim | Value | Description                             |
|-------|-------|-----------------------------------------|
| tgt   | true  | Claim indicates the client needs a TGT. |

Azure AD packages the encrypted client key and message buffer into the PRT response as additional properties. The payload is encrypted using the Azure AD Device session key.

| Field              | Type   | Description  |
|--------------------|--------|--------------|
| tgt_client_key     | string | Base64 encoded client key (secret). This is the client secret used to protect the TGT. Because this is a passwordless scenario, the client secret is generated by the server as part of each TGT request and then returned to the client in the response. |
| tgt_key_type       | int    | The on-premises AD key type used for both the client key and the Kerberos session key included in the KERB_MESSAGE_BUFFER. |
| tgt_message_buffer | string | Base64 encoded KERB_MESSAGE_BUFFER. |

### Is partial TGT renewed at same interval as PRT (every 4 hours) or is this TGT flushed when lock/unlock is done?

Yes, CloudAP will try to refresh it every 4 hours in most cases unless IT set some special policy etc. If refresh fails, it will fall back to the original TGT. AAD cloudap plugin has list of conditions which can trigger PRT refresh along with partial TGT.

### Can I deploy the FIDO cred prov on an on-premises only device?

No, this feature is not supported for on-prem only device and the FIDO cred prov would not show up.

### FIDO key sign in is not working for my Domain Admin or other high privilege accounts. Why?

The default security policy does not grant Azure AD permission to sign high privilege accounts on to on-premises resources. To unblock the accounts, use Active Directory Users and Computers to modify the msDS-NeverRevealGroup property of the Azure AD Kerberos Computer object (CN=AzureADKerberos,OU=Domain Controllers,<domain-DN>).

## Known issues

### Users are unable to sign in using FIDO keys as Windows Hello Face is too quick and is the default sign-in mechanism

Windows Hello Face is the intended best experience for a device where a user has it enrolled. FIDO2 security keys are intended for use on shared devices or where Windows Hello for Business enrollment is a barrier. Users can turn off Hello Face sign in by removing Face Enrollment in **Settings > Sign-In Options** if it's preventing the users from trying the FIDO logon scenario.

### Users are not able to use FIDO immediately after they create a hybrid AADJ machine

If clean installing a Hybrid AADJ machine, after the domain join and restart, you must sign in with a password and wait for policy to synchronize before you can use to use FIDO to sign in.

* To check the current status, type `dsregcmd /status` into a command window. Check that both *AzureAdJoined* and *DomainJoined* show *YES*.
* This is a known limitation for domain-joined devices and isn't FIDO specific.

### Users are unable to get SSO to my NTLM network resource after signing in with FIDO and get a credential prompt

Make sure that enough DCs are patched to respond in time to service your resource request. To check if you can see a server that is running the feature, review the output of `nltest /dsgetdc:<dc name> /keylist /kdc`

If you're able to see a DC with this feature, this might indicate the user's password changed since they logged in or there's another issue. Collect logs as described below for the Microsoft support team to debug.

## Troubleshooting tools

### Windows Client Issues

Troubleshoot issues with signing into Windows or accessing on-premises resources from Windows. Scripts for telemetry

1. Open feedback hub app, make sure your name is on the left bottom of the app, > Create a new feedback item and make it as “Problem”
1. Select the "Security and Privacy" category, and then the “FIDO” subcategory.
1. Toggle the check box “Send attached files and diagnostics to Microsoft along with my feedback”
1. Click “Recreate my problems” and then click "Start capture"
1. Lock and unlock the machine with FIDO key. If the issue occurs, try to unlock with other cred type.
1. Return to Feedback Hub, click "Stop capture", and submit your feedback.
1. Go to the Feedback page, then the My Feedback tab. Click/tap on your recently submitted feedback.
1. Click the "Share" button in the top right corner to get a link to the feedback. Send us the link.

The Feedback Hub collects the following events logs and registry key info:

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

Troubleshoot issues with deploying the Azure AD Kerberos Server using the new PowerShell module included with Azure AD Connect.

#### Viewing the logs

The Azure AD Kerberos Server PowerShell Cmdlets use the same logging asthe standard Azure AD Connect Wizard. To view information or error details from the Cmdlets, do the following:

1. On the Azure AD Connect Server, navigate to C:\ProgramData\AADConnect\. NOTE this folder is hidden by default.
1. Open and view the most recent trace-*.log file located in the directory.

#### Viewing the Azure AD Kerberos Server Objects

You can view the Azure AD Kerberos Server Objects and verify they are in good order.

1. On the Azure AD Connect Server, open PowerShell and navigate to C:\Program Files\Microsoft Azure Active Directory Connect\AzureADKerberos\
1. Run the following PowerShell commands to view the Azure AD Kerberos Server from both Azure AD and on-premises AD.

    NOTE Replace "contoso.corp.com" with the name of your on-premises Active Directory domain.

    ```powershell
    Import-Module ".\AzureAdKerberos.psd1"
    # Specify the on-premises Active Directory domain.
    $domain = "contoso.corp.com"

    # Enter an Azure Active Directory Global Admin username and password.
    $cloudCred = Get-Credential

    # Enter a Domain Admin username and password.
    $domainCred = Get-Credential

    # Get the Azure AD Kerberos Server Object
    Get-AzureADKerberosServer -Domain $domain -CloudCredential $cloudCred -DomainCredential
    $domainCred
    ```

This command will output the properties of the Azure AD Kerberos Server from both Azure AD and onpremises AD. You can review the properties to verify that everything is in good order. Use the table below to verify the properties.

The first set of properties are from the objects in the on-premises Active Directory. The second half (the properties (beginning with Cloud*) are from the Kerberos Server object in Azure AD.

| Property           | Description  |
|--------------------|--------------|
| Id                 | The unique Id of the AD Domain Controller object. This is sometimes referred to as it’s “slot” or it’s “branch Id”. |
| DomainDnsName      | The DNS domain name of the Active Directory Domain. |
| ComputerAccount    | The computer account object of the Azure AD Kerberos Server object (The DC). |
| UserAccount        | The disabled user account object that holds the Azure AD Kerberos Server TGT encryption key. The DN of this account will be: CN=krbtgt_AzureAD,CN=Users,<Domain-DN> |
| KeyVersion         | The key version of the Azure AD Kerberos Server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication meta-data and will likely be greater than one. For example, the initial KeyVersion could be 192272. The first time the key is rotated, the version could advance to 212621. The important thing to verify is that the KeyVersion for the on-premises object and the CloudKeyVersion for the cloud object are the same. |
| KeyUpdatedOn       | The date and time that the Azure AD Kerberos Server TGT encryption key was updated/created. |
| KeyUpdatedFrom     | The Domain Controller where the Azure AD Kerberos Server TGT encryption key was last updated. |
| CloudId            | The Id from the Azure AD Object. Must match the Id above. |
| CloudDomainDnsName | The DomainDnsName from the Azure AD Object. Must match the DomainDnsName above. |
| CloudKeyVersion    | The KeyVersion from the Azure AD Object. Must match the KeyVersion above. |
| CloudKeyUpdatedOn  | The KeyUpdatedOn from the Azure AD Object. Must match the KeyUpdatedOn above. |

## Next steps
