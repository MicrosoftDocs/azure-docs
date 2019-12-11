---
title: Azure multi-factor authentication data privacy
description: Learn what personal information Azure multi-factor authentication (MFA) stores about you and your users and what data remains within the country of origin.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 12/11/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sasubram
ms.collection: M365-identity-device-management
---
# Data privacy and sovereignty for Azure multi-factor authentication

Identity data is stored by Azure AD in a geographical location based on the address provided by your organization when subscribing for a Microsoft Online service such as Office 365 and Azure. For information on where your identity data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

Cloud-based Azure multi-factor authentication (MFA) and Azure MFA Server process and store some amount of personally identifiable information (PII) and organizational identifiable information (OII). This article outlines what and where data is stored.

Some key considerations of the MFA data flows include the following areas:

* Two-factor authentication using phone calls originate from US datacenters and are also routed by global providers. SMS providers are located in the US, but authentication requests in Europe, for example, don't route through US datacenters.
* Push notifications using the Microsoft Authenticator app originate from US datacenters. In addition, device vendor-specific services may also come into play from different regions.
* OATH codes are currently validated in the U.S except for OATH token methods that originate in and are then validated in Europe.

## Personally identifiable information (PII) stored

Personally identifiable information (PII) is user-level data that contains personal information like a user principal name (UPN) or phone number. Azure MFA doesn't log PII such as username, phone number, or IP address, but there is a *UserObjectId* that identifies MFA attempts to users. The following events would generate a stored log event:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* Authentications
* Mobile App activations

This information is retained for 90 days.

### Azure MFA

For Azure public clouds, the following PII is stored:

* OATH Token
    * In MFA logs
* One-Way SMS
    * In MFA logs
* Voice Call
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
* Mobile App Notification
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
    * Change requests when mobile app device token changes

> [!NOTE]
> The MFA activity report database is stored in the North America geography for all public clouds, regardless of the region that processes the authentication request. Microsoft Azure Germany and Microsoft Azure Operated by 21Vianet are always stored in their respective cloud. Microsoft Government Cloud log data is always stored in North America.

For Microsoft Azure Government, Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following PII is stored:

* OATH Token
    * In MFA logs
    * MFA activity report database
* One-Way SMS
    * In MFA logs
    * MFA activity report database
* Voice Call
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
* Mobile App Notification
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
    * Change requests when mobile app device token changes

### MFA Server

If you deploy and run Azure MFA Server, the following PII is stored:

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure Multi-Factor Authentication. Existing customers who have activated MFA Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

* OATH Token
    * In MFA logs
    * MFA activity report database
* One-Way SMS
    * In MFA logs
    * MFA activity report database
* Voice Call
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
* Mobile App Notification
    * In MFA logs
    * MFA activity report database
    * Blocked users if fraud reported
    * Change requests when mobile app device token changes

## Organizationally identifiable information (OII) stored

Organizationally identifiable information (OII) is tenant-level data that contains information that could expose configuration or environment setup. Tenant settings from the following Azure portal MFA pages may store OII such as lockout thresholds or caller ID information for incoming phone authentication requests:

* Account lockout
* Fraud alert
* Notifications
* Phone call settings

And for Azure MFA Server, the following Azure portal pages may contain OII:

* Server settings
* One-time bypass
* Caching rules
* MFA Server status

## Log data location

Where log information is stored depends on which region they are processed in. Most geographies have native Azure MFA capabilities, so log data is stored in the same region that processes the MFA request. In geographies without native Azure MFA support, they're serviced by either North America or Europe geographies and log data is stored in the same region that processes the MFA request.

Some core authentication log data is only stored in the North America geography. Microsoft Azure Germany and Microsoft Azure Operated by 21Vianet are always stored in their respective cloud. Microsoft Government Cloud log data is always stored in North America.

## Next steps

For more information about what user information is collected by cloud-based Azure MFA and Azure MFA Server, see [Azure Multi-Factor Authentication user data collection](howto-mfa-reporting-datacollection.md).
