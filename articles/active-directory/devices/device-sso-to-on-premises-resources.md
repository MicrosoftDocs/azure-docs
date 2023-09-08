---
title: How SSO to on-premises resources works on Azure AD joined devices
description: Extend the SSO experience by configuring hybrid Azure Active Directory joined devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 02/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: ravenn

ms.collection: M365-identity-device-management
---
# How SSO to on-premises resources works on Azure AD joined devices

Azure Active Directory (Azure AD) joined devices give users a single sign-on (SSO) experience to your tenant's cloud apps. If your environment has on-premises Active Directory Domain Services (AD DS), users can also SSO to resources and applications that rely on on-premises Active Directory Domain Services. 

This article explains how this works.

## Prerequisites

- An [Azure AD joined device](concept-directory-join.md).
- On-premises SSO requires line-of-sight communication with your on-premises AD DS domain controllers. If Azure AD joined devices aren't connected to your organization's network, a VPN or other network infrastructure is required. 
- Azure AD Connect or Azure AD Connect cloud sync: To synchronize default user attributes like SAM Account Name, Domain Name, and UPN. For more information, see the article [Attributes synchronized by Azure AD Connect](../hybrid/reference-connect-sync-attributes-synchronized.md#windows-10).

## How it works 

With an Azure AD joined device, your users already have an SSO experience to the cloud apps in your environment. If your environment has Azure AD and on-premises AD DS, you may want to expand the scope of your SSO experience to your on-premises Line Of Business (LOB) apps, file shares, and printers.

Azure AD joined devices have no knowledge about your on-premises AD DS environment because they aren't joined to it. However, you can provide additional information about your on-premises AD to these devices with Azure AD Connect.

Azure AD Connect or Azure AD Connect cloud sync synchronize your on-premises identity information to the cloud. As part of the synchronization process, on-premises user and domain information is synchronized to Azure AD. When a user signs in to an Azure AD joined device in a hybrid environment:

1. Azure AD sends the details of the user's on-premises domain back to the device, along with the [Primary Refresh Token](concept-primary-refresh-token.md)
1. The local security authority (LSA) service enables Kerberos and NTLM authentication on the device.

> [!NOTE]
> Additional configuration is required when passwordless authentication to Azure AD joined devices is used.
>
> For FIDO2 security key based passwordless authentication and Windows Hello for Business Hybrid Cloud Trust, see [Enable passwordless security key sign-in to on-premises resources with Azure Active Directory](../authentication/howto-authentication-passwordless-security-key-on-premises.md).
>
> For Windows Hello for Business Cloud Kerberos Trust, see [Configure and provision Windows Hello for Business - cloud Kerberos trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cloud-kerberos-trust-provision).
> 
> For Windows Hello for Business Hybrid Key Trust, see [Configure Azure AD joined devices for On-premises Single-Sign On using Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-hybrid-aadj-sso-base).
> 
> For Windows Hello for Business Hybrid Certificate Trust, see [Using Certificates for AADJ On-premises Single-sign On](/windows/security/identity-protection/hello-for-business/hello-hybrid-aadj-sso-cert). 

During an access attempt to an on-premises resource requesting Kerberos or NTLM, the device:

1. Sends the on-premises domain information and user credentials to the located DC to get the user authenticated.
1. Receives a Kerberos [Ticket-Granting Ticket (TGT)](/windows/desktop/secauthn/ticket-granting-tickets) or NTLM token based on the protocol the on-premises resource or application supports. If the attempt to get the Kerberos TGT or NTLM token for the domain fails, Credential Manager entries are tried, or the user may receive an authentication pop-up requesting credentials for the target resource. This failure can be related to a delay caused by a DCLocator timeout.

All apps that are configured for **Windows-Integrated authentication** seamlessly get SSO when a user tries to access them.

## What you get

With SSO, on an Azure AD joined device you can: 

- Access a UNC path on an AD member server
- Access an AD DS member web server configured for Windows-integrated security 

If you want to manage your on-premises AD from a Windows device, install the [Remote Server Administration Tools](https://www.microsoft.com/download/details.aspx?id=45520).

You can use:

- The Active Directory Users and Computers (ADUC) snap-in to administer all AD objects. However, you have to  specify the domain that you want to connect to manually.
- The DHCP snap-in to administer an AD-joined DHCP server. However, you may need to specify the DHCP server name or address.
 
## What you should know

- You may have to adjust your [domain-based filtering](../hybrid/how-to-connect-sync-configure-filtering.md#domain-based-filtering) in Azure AD Connect to ensure that the data about the required domains is synchronized if you have multiple domains.
- Apps and resources that depend on Active Directory machine authentication don't work because Azure AD joined devices don't have a computer object in AD DS. 
- You can't share files with other users on an Azure AD-joined device.
- Applications running on your Azure AD joined device may authenticate users. They must use the implicit UPN or the NT4 type syntax with the domain FQDN name as the domain part, for example: user@contoso.corp.com or contoso.corp.com\user.
   - If applications use the NETBIOS or legacy name like contoso\user, the errors the application gets would be either, NT error STATUS_BAD_VALIDATION_CLASS - 0xc00000a7, or Windows error ERROR_BAD_VALIDATION_CLASS - 1348 “The validation information class requested was invalid.” This error happens even if you can resolve the legacy domain name.

## Next steps

For more information, see [What is device management in Azure Active Directory?](overview.md)
