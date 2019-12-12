---
title: Azure multi-factor authentication data privacy
description: Learn what personal information Azure multi-factor authentication (MFA) stores about you and your users and what data remains within the country of origin.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 12/12/2019

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

* Two-factor authentication using phone calls or SMS typically originate from US datacenters and are routed by global providers. General purpose user authentication requests from other regions such as Europe or Australia are currently processed by datacenters in that region. Other events such as self-service password resets, Azure B2C events, or hybrid scenarios using NPS Extension or AD FS adapter, are all currently processed by US datacenters.
* Push notifications using the Microsoft Authenticator app originate from US datacenters. In addition, device vendor-specific services may also come into play from different regions.
* OATH codes are typically currently validated in the U.S. Again, general purpose user authentication events that originate in other regions, like Europe or Australia, are processed by datacenters in that region. Additional events are currently processed by US datacenters.

## Personally identifiable information (PII) stored

Personally identifiable information (PII) is user-level data that contains personal information. The following data stores contain PII:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* MFA activity reports
* Microsoft Authenticator activations

This information is retained for 90 days.

Azure MFA doesn't log PII such as username, phone number, or IP address, but there is a *UserObjectId* that identifies MFA attempts to users. Log data is stored for 30 days.

### Azure MFA

For Azure public clouds, excluding Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following PII is stored:

* OATH token
    * In MFA logs
* One-way SMS
    * In MFA logs
* Voice call
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
* Microsoft Authenticator notification
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
    * Change requests when Microsoft Authenticator device token changes

> [!NOTE]
> The MFA activity report data store is stored in the North America geography for all clouds, regardless of the region that processes the authentication request. Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, and Microsoft Government Cloud have their own independent data stores separate from public cloud region data stores, however this data is always stored in North America.

For Microsoft Azure Government, Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following PII is stored:

* OATH token
    * In MFA logs
    * MFA activity report data store
* One-way SMS
    * In MFA logs
    * MFA activity report data store
* Voice call
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
* Microsoft Authenticator notification
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
    * Change requests when Microsoft Authenticator device token changes

### MFA Server

If you deploy and run Azure MFA Server, the following PII is stored:

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure Multi-Factor Authentication. Existing customers who have activated MFA Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

* OATH token
    * In MFA logs
    * MFA activity report data store
* One-way SMS
    * In MFA logs
    * MFA activity report data store
* Voice call
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
* Microsoft Authenticator notification
    * In MFA logs
    * MFA activity report data store
    * Blocked users if fraud reported
    * Change requests when Microsoft Authenticator device token changes

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
