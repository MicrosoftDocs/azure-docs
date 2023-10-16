---
title: FAQs for hybrid FIDO2 security key deployment
description: Learn about some frequently asked questions for passwordless hybrid FIDO2 security key sign-in using Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshooting
ms.date: 09/15/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: aakapo

ms.collection: M365-identity-device-management
---
# Deployment frequently asked questions (FAQs) for hybrid FIDO2 security keys in Microsoft Entra ID

This article covers deployment frequently asked questions (FAQs) for Microsoft Entra hybrid joined devices and passwordless sign-in to on-prem resources. With this passwordless feature, you can enable Microsoft Entra authentication on Windows 10 devices for Microsoft Entra hybrid joined devices using FIDO2 security keys. Users can sign into Windows on their devices with modern credentials like FIDO2 keys and access traditional Active Directory Domain Services (AD DS) based resources with a seamless single sign-on (SSO) experience to their on-prem resources.

The following scenarios for users in a hybrid environment are supported:

* Sign in to Microsoft Entra hybrid joined devices using FIDO2 security keys and get SSO access to on-prem resources.
* Sign in to Microsoft Entra joined devices using FIDO2 security keys and get SSO access to on-prem resources.

To get started with FIDO2 security keys and hybrid access to on-premises resources, see the following articles:

* [Passwordless FIDO2 security keys](howto-authentication-passwordless-security-key.md)
* [Passwordless Windows 10](howto-authentication-passwordless-security-key-windows.md)
* [Passwordless on-premises](howto-authentication-passwordless-security-key-on-premises.md)

## Security keys

* [My organization requires two factor authentication to access resources. What can I do to support this requirement?](#my-organization-requires-multi-factor-authentication-to-access-resources-what-can-i-do-to-support-this-requirement)
* [Where can I find compliant FIDO2 security keys?](#where-can-i-find-compliant-fido2-security-keys)
* [What do I do if I lose my security key?](#what-if-i-lose-my-security-key)
* [How is the data protected on the FIDO2 security key?](#how-is-the-data-protected-on-the-fido2-security-key)
* [How does the registering of FIDO2 security keys work?](#how-does-the-registering-of-fido2-security-keys-work)
* [Is there a way for admins to provision the keys for the users directly?](#is-there-a-way-for-admins-to-provision-the-keys-for-the-users-directly)

### My organization requires multi-factor authentication to access resources. What can I do to support this requirement?

FIDO2 Security keys come in a variety of form factors. Contact the device manufacturer of interest to discuss how their devices can be enabled with a PIN or biometric as a second factor. For a list of supported providers, see [FIDO2 security keys providers](concept-authentication-passwordless.md#fido2-security-key-providers).

### Where can I find compliant FIDO2 security keys?

For a list of supported providers, see [FIDO2 security keys providers](concept-authentication-passwordless.md#fido2-security-key-providers).

### What if I lose my security key?

You can remove keys by navigating to the **Security info** page and removing the FIDO2 security key.

### How is the data protected on the FIDO2 security key?

FIDO2 security keys have secure enclaves that protect the private keys stored on them. A FIDO2 security key also has anti-hammering properties built into it, like in Windows Hello, where you can't extract the private key.

### How does the registering of FIDO2 security keys work?

For more information how to register and use FIDO2 security keys, see [Enable passwordless security key sign-in](howto-authentication-passwordless-security-key.md).

### Is there a way for admins to provision the keys for the users directly?

No, not at this time.

### Why I am getting "NotAllowedError" in the browser, when registering FIDO2 keys?

You will receive "NotAllowedError" from fido2 key registration page. This typically happens when user is in private (Incognito) window or using remote desktop where FIDO2 Private key access is not possible.

## Prerequisites

* [Does this feature work if there's no internet connectivity?](#does-this-feature-work-if-theres-no-internet-connectivity)
* [What are the specific end points that are required to be open to Microsoft Entra ID?](#what-are-the-specific-end-points-that-are-required-to-be-open-to-azure-ad)
* [How do I identify the domain join type (Microsoft Entra joined or Microsoft Entra hybrid joined) for my Windows 10 device?](#how-do-i-identify-the-domain-join-type-azure-ad-joined-or-hybrid-azure-ad-joined-for-my-windows-10-device)
* [What's the recommendation on the number of DCs that should be patched?](#whats-the-recommendation-on-the-number-of-dcs-that-should-be-patched)
* [Can I deploy the FIDO2 credential provider on an on-premises only device?](#can-i-deploy-the-fido2-credential-provider-on-an-on-premises-only-device)
* [FIDO2 security key sign-in isn't working for my Domain Admin or other high privilege accounts. Why?](#fido2-security-key-sign-in-isnt-working-for-my-domain-admin-or-other-high-privilege-accounts-why)

### Does this feature work if there's no internet connectivity?

Internet connectivity is a pre-requisite to enable this feature. The first time a user signs in using FIDO2 security keys, they must have internet connectivity. For subsequent sign-in events, cached sign-in should work and let the user authenticate without internet connectivity.

For a consistent experience, make sure that devices have internet access and line of sight to DCs.

<a name='what-are-the-specific-end-points-that-are-required-to-be-open-to-azure-ad'></a>

### What are the specific end points that are required to be open to Microsoft Entra ID?

The following endpoints are needed for registration and authentication:

* `*.microsoftonline.com`
* `*.microsoftonline-p.com`
* `*.msauth.net`
* `*.msauthimages.net`
* `*.msecnd.net`
* `*.msftauth.net`
* `*.msftauthimages.net`
* `*.phonefactor.net`
* `enterpriseregistration.windows.net`
* `management.azure.com`
* `policykeyservice.dc.ad.msft.net`
* `secure.aadcdn.microsoftonline-p.com`

For a full list of endpoints needed to use Microsoft online products, see [Office 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges).

<a name='how-do-i-identify-the-domain-join-type-azure-ad-joined-or-hybrid-azure-ad-joined-for-my-windows-10-device'></a>

### How do I identify the domain join type (Microsoft Entra joined or Microsoft Entra hybrid joined) for my Windows 10 device?

To check if the Windows 10 client device has the right domain join type, use the following command:

```console
Dsregcmd /status
```

The following sample output shows that the device is Microsoft Entra joined as *AzureADJoined* is set to *YES*:

```output
+---------------------+
| Device State        |
+---------------------+

AzureADJoined: YES
EnterpriseJoined: NO
DomainedJoined: NO
```

The following sample output shows that the device is Microsoft Entra hybrid joined as *DomainedJoined* is also set to *YES*. The *DomainName* is also shown:

```output
+---------------------+
| Device State        |
+---------------------+

AzureADJoined: YES
EnterpriseJoined: NO
DomainedJoined: YES
DomainName: CONTOSO
```

On a Windows Server 2016 or 2019 domain controller, check that the following patches are applied. If needed, run Windows Update to install them:

* Windows Server 2016 - [KB4534307](https://support.microsoft.com/help/4534307/windows-10-update-kb4534307)
* Windows Server 2019 - [KB4534321](https://support.microsoft.com/help/4534321/windows-10-update-kb4534321)

From a client device, run the following command to verify connectivity to an appropriate domain controller with the patches installed:

```console
nltest /dsgetdc:<domain> /keylist /kdc
```

### What's the recommendation on the number of DCs that should be patched?

We recommend patching a majority of your Windows Server 2016 or 2019 domain controllers with the patch to ensure they can handle the authentication request load of your organization.

On a Windows Server 2016 or 2019 domain controller, check that the following patches are applied. If needed, run Windows Update to install them:

* Windows Server 2016 - [KB4534307](https://support.microsoft.com/help/4534307/windows-10-update-kb4534307)
* Windows Server 2019 - [KB4534321](https://support.microsoft.com/help/4534321/windows-10-update-kb4534321)

### Can I deploy the FIDO2 credential provider on an on-premises only device?

No, this feature isn't supported for on-premises only device. The FIDO2 credential provider wouldn't show up.

### FIDO2 security key sign-in isn't working for my Domain Admin or other high privilege accounts. Why?

The default security policy doesn't grant Microsoft Entra permission to sign high privilege accounts on to on-premises resources.

To unblock the accounts, use **Active Directory Users and Computers** to modify the *msDS-NeverRevealGroup* property of the *Microsoft Entra Kerberos Computer object (CN=AzureADKerberos,OU=Domain Controllers,\<domain-DN>)*.

## Under the hood

* [How is Microsoft Entra Kerberos linked to my on-premises Active Directory Domain Services environment?](#how-is-azure-ad-kerberos-linked-to-my-on-premises-active-directory-domain-services-environment)
* [Where can I view these Kerberos server objects that are created in AD and published in Microsoft Entra ID?](#where-can-i-view-these-kerberos-server-objects-that-are-created-in-ad-ds-and-published-in-azure-ad)
* [Why can't we have the public key registered to on-premises AD DS so there is no dependency on the internet?](#why-cant-we-have-the-public-key-registered-to-on-premises-ad-ds-so-there-is-no-dependency-on-the-internet)
* [How are the keys rotated on the Kerberos server object?](#how-are-the-keys-rotated-on-the-kerberos-server-object)
* [Why do we need Microsoft Entra Connect? Does it write any info back to AD DS from Microsoft Entra ID?](#why-do-we-need-azure-ad-connect-does-it-write-any-info-back-to-ad-ds-from-azure-ad)
* [What does the HTTP request/response look like when requesting PRT+ partial TGT?](#what-does-the-http-requestresponse-look-like-when-requesting-prt-partial-tgt)

<a name='how-is-azure-ad-kerberos-linked-to-my-on-premises-active-directory-domain-services-environment'></a>

### How is Microsoft Entra Kerberos linked to my on-premises Active Directory Domain Services environment?

There are two parts: the on-premises AD DS environment and the Microsoft Entra tenant.

**Active Directory Domain Services (AD DS)**

The Microsoft Entra Kerberos server is represented in an on-premises AD DS environment as a domain controller (DC) object. This DC object is made up of multiple objects:

* `CN=AzureADKerberos,OU=Domain Controllers,<domain-DN>`

    A *Computer* object that represents a Read-Only Domain Controller (RODC) in AD DS. There's no computer associated with this object. Instead, it's a logical representation of a DC.

* `CN=krbtgt_AzureAD,CN=Users,<domain-DN>`

    A *User* object that represents a RODC Kerberos Ticket Granting Ticket (TGT) encryption key.

* `CN=900274c4-b7d2-43c8-90ee-00a9f650e335,CN=AzureAD,CN=System,<domain-DN>`

    A *ServiceConnectionPoint* object that stores metadata about the Microsoft Entra Kerberos server objects. The administrative tools use this object to identify and locate the Microsoft Entra Kerberos server objects.

**Microsoft Entra ID**

The Microsoft Entra Kerberos server is represented in Microsoft Entra ID as a *KerberosDomain* object. Each on-premises AD DS environment is represented as a single *KerberosDomain* object in the Microsoft Entra tenant.

For example, you may have an AD DS forest with two domains such as `contoso.com` and `fabrikam.com`. If you allow Microsoft Entra ID to issue Kerberos Ticket Granting Tickets (TGTs) for the entire forest, there are two `KerberosDomain` objects in Microsoft Entra ID - one object for `contoso.com` and one for `fabrikam.com`.

If you have multiple AD DS forests, you have one `KerberosDomain` object for each domain in each forest.

<a name='where-can-i-view-these-kerberos-server-objects-that-are-created-in-ad-ds-and-published-in-azure-ad'></a>

### Where can I view these Kerberos server objects that are created in AD DS and published in Microsoft Entra ID?

To view all objects, use the Microsoft Entra Kerberos server PowerShell cmdlets included with the latest version of Microsoft Entra Connect.

For more information, including instructions on how to view the objects, see [create a Kerberos Server object](howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object).

### Why can't we have the public key registered to on-premises AD DS so there is no dependency on the internet?

We received feedback around the complexity of deployment model for Windows Hello for Business, so wanted to simplify the deployment model without having to use certificates and PKI (FIDO2 doesn't use certificates).

### How are the keys rotated on the Kerberos server object?

Like any other DC, the Microsoft Entra Kerberos server encryption *krbtgt* keys should be rotated on a regular basis. It's recommended to follow the same schedule as you use to rotate all other AD DS *krbtgt* keys.

> [!NOTE]
> Although there are other tools to rotate the *krbtgt* keys, you must [use the PowerShell cmdlets to rotate the *krbtgt* keys](howto-authentication-passwordless-security-key-on-premises.md#rotate-the-azure-ad-kerberos-server-key) of your Microsoft Entra Kerberos server. This method makes sure that the keys are updated in both the on-premises AD DS environment and in Microsoft Entra ID.

<a name='why-do-we-need-azure-ad-connect-does-it-write-any-info-back-to-ad-ds-from-azure-ad'></a>

### Why do we need Microsoft Entra Connect? Does it write any info back to AD DS from Microsoft Entra ID?

Microsoft Entra Connect doesn't write info back from Microsoft Entra ID to Active Directory DS. The utility includes the PowerShell module to create the Kerberos Server Object in AD DS and publish it in Microsoft Entra ID.

### What does the HTTP request/response look like when requesting PRT+ partial TGT?

The HTTP request is a standard Primary Refresh Token (PRT) request. This PRT request includes a claim indicating a Kerberos Ticket Granting Ticket (TGT) is needed.

| Claim | Value | Description                             |
|-------|-------|-----------------------------------------|
| tgt   | true  | Claim indicates the client needs a TGT. |

Microsoft Entra ID combines the encrypted client key and message buffer into the PRT response as additional properties. The payload is encrypted using the Microsoft Entra Device session key.

| Field              | Type   | Description  |
|--------------------|--------|--------------|
| tgt_client_key     | string | Base64 encoded client key (secret). This key is the client secret used to protect the TGT. In this passwordless scenario, the client secret is generated by the server as part of each TGT request and then returned to the client in the response. |
| tgt_key_type       | int    | The on-premises AD DS key type used for both the client key and the Kerberos session key included in the KERB_MESSAGE_BUFFER. |
| tgt_message_buffer | string | Base64 encoded KERB_MESSAGE_BUFFER. |

### Do users need to be a member of the Domain Users Active Directory group?
Yes. A user must be in the Domain Users group to be able to sign-in using Microsoft Entra Kerberos.

## Next steps

To get started with FIDO2 security keys and hybrid access to on-premises resources, see the following articles:

* [Passwordless FIDO2 security keys](howto-authentication-passwordless-security-key.md)
* [Passwordless Windows 10](howto-authentication-passwordless-security-key-windows.md)
* [Passwordless on-premises](howto-authentication-passwordless-security-key-on-premises.md)
