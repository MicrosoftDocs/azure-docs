---
title: Azure Multi-Factor Authentication data residency
description: Learn what personal and organizational data Azure Multi-Factor Authentication stores about you and your users and what data remains within the country/region of origin.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 04/13/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sasubram
ms.collection: M365-identity-device-management
---
# Data residency and customer data for Azure Multi-Factor Authentication

Customer data is stored by Azure AD in a geographical location based on the address provided by your organization when subscribing for a Microsoft Online service such as Office 365 and Azure. For information on where your customer data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

Cloud-based Azure Multi-Factor Authentication and Azure Multi-Factor Authentication Server process and store some amount of personal data and organizational data. This article outlines what and where data is stored.

The following Multi-Factor Authentication activities currently originate out of US datacenters except where noted:

* Two-factor authentication using phone calls or SMS typically originate from US datacenters and are routed by global providers.
    * General purpose user authentication requests from other regions such as Europe or Australia are currently processed by datacenters in that region. Other events such as self-service password resets, Azure B2C events, or hybrid scenarios using NPS Extension or AD FS adapter, are all currently processed by US datacenters.
* Push notifications using the Microsoft Authenticator app originate from US datacenters. In addition, device vendor-specific services may also come into play from different regions.
* OATH codes are typically currently validated in the U.S.
    * Again, general purpose user authentication events that originate in other regions, like Europe or Australia, are processed by datacenters in that region. Additional events are currently processed by US datacenters.

## Personal data stored by Azure Multi-Factor Authentication

Personal data is user-level information associated with a specific person. The following data stores contain personal information:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* Multi-Factor Authentication activity reports
* Microsoft Authenticator activations

This information is retained for 90 days.

Azure Multi-Factor Authentication doesn't log personal data such as username, phone number, or IP address, but there is a *UserObjectId* that identifies Multi-Factor Authentication attempts to users. Log data is stored for 30 days.

### Azure Multi-Factor Authentication

For Azure public clouds, excluding Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multi-Factor Authentication logs     |
| One-way SMS                          | In Multi-Factor Authentication logs     |
| Voice call                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

> [!NOTE]
> The Multi-Factor Authentication activity report data store is stored in the United States for all clouds, regardless of the region that processes the authentication request. Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, and Microsoft Government Cloud have their own independent data stores separate from public cloud region data stores, however this data is always stored in the United States.

For Microsoft Azure Government, Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| One-way SMS                          | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| Voice call                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

### Multi-Factor Authentication Server

If you deploy and run Azure Multi-Factor Authentication Server, the following personal data is stored:

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer Multi-Factor Authentication Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure Multi-Factor Authentication. Existing customers who have activated Multi-Factor Authentication Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| One-way SMS                          | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| Voice call                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

## Organizational data stored by Azure Multi-Factor Authentication

Organizational data is tenant-level information that could expose configuration or environment setup. Tenant settings from the following Azure portal Multi-Factor Authentication pages may store organizational data such as lockout thresholds or caller ID information for incoming phone authentication requests:

* Account lockout
* Fraud alert
* Notifications
* Phone call settings

And for Azure Multi-Factor Authentication Server, the following Azure portal pages may contain organizational data:

* Server settings
* One-time bypass
* Caching rules
* Multi-Factor Authentication Server status

## Log data location

Where log information is stored depends on which region they're processed in. Most geographies have native Azure Multi-Factor Authentication capabilities, so log data is stored in the same region that processes the Multi-Factor Authentication request. In geographies without native Azure Multi-Factor Authentication support, they're serviced by either the United States or Europe geographies and log data is stored in the same region that processes the Multi-Factor Authentication request.

Some core authentication log data is only stored in the United States. Microsoft Azure Germany and Microsoft Azure Operated by 21Vianet are always stored in their respective cloud. Microsoft Government Cloud log data is always stored in the United States.

## Next steps

For more information about what user information is collected by cloud-based Azure Multi-Factor Authentication and Azure Multi-Factor Authentication Server, see [Azure Multi-Factor Authentication user data collection](howto-mfa-reporting-datacollection.md).
