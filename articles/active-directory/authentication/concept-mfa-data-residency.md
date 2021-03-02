---
title: Azure AD Multifactor Authentication data residency
description: Learn what personal and organizational data Azure AD Multifactor Authentication stores about you and your users and what data remains within the country/region of origin.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/14/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: inbarc

ms.collection: M365-identity-device-management
---
# Data residency and customer data for Azure AD Multifactor Authentication

Customer data is stored by Azure AD in a geographical location based on the address provided by your organization when subscribing for a Microsoft Online service such as Microsoft 365 and Azure. For information on where your customer data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

Cloud-based Azure AD Multifactor Authentication and Azure AD Multifactor Authentication Server process and store some amount of personal data and organizational data. This article outlines what and where data is stored.

The Azure AD Multifactor Authentication service has datacenters in the US, Europe, and Asia Pacific. The following activities originate out of the regional datacenters except where noted:

* Multifactor authentication using phone calls originate from US datacenters and are routed by global providers.
* General purpose user authentication requests from other regions such as Europe or Australia are currently processed based on the user's location.
* Push notifications using the Microsoft Authenticator app are currently processed in the regional datacenters based on the user's location.
    * Device vendor-specific services, such as Apple Push Notifications, may be outside the user's location.

## Personal data stored by Azure AD Multifactor Authentication

Personal data is user-level information associated with a specific person. The following data stores contain personal information:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* Multifactor Authentication activity reports
* Microsoft Authenticator activations

This information is retained for 90 days.

Azure AD Multifactor Authentication doesn't log personal data such as username, phone number, or IP address, but there is a *UserObjectId* that identifies Multifactor Authentication attempts to users. Log data is stored for 30 days.

### Azure AD Multifactor Authentication

For Azure public clouds, excluding Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multifactor Authentication logs     |
| One-way SMS                          | In Multifactor Authentication logs     |
| Voice call                           | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

For Microsoft Azure Government, Microsoft Azure Germany, Microsoft Azure Operated by 21Vianet, Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store |
| One-way SMS                          | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store |
| Voice call                           | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

### Multifactor Authentication Server

If you deploy and run Azure AD Multifactor Authentication Server, the following personal data is stored:

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer Multifactor Authentication Server for new deployments. New customers who would like to require multifactor authentication from their users should use cloud-based Azure AD Multifactor Authentication. Existing customers who have activated Multifactor Authentication Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store |
| One-way SMS                          | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store |
| Voice call                           | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multifactor Authentication logs<br />Multifactor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

## Organizational data stored by Azure AD Multifactor Authentication

Organizational data is tenant-level information that could expose configuration or environment setup. Tenant settings from the following Azure portal Multifactor Authentication pages may store organizational data such as lockout thresholds or caller ID information for incoming phone authentication requests:

* Account lockout
* Fraud alert
* Notifications
* Phone call settings

And for Azure AD Multifactor Authentication Server, the following Azure portal pages may contain organizational data:

* Server settings
* One-time bypass
* Caching rules
* Multifactor Authentication Server status

## Multifactor authentication logs location

The following table shows the location for service logs for public clouds.

| Public cloud| Sign-in logs | Multifactor Authentication activity report        | Multifactor Authentication service logs       |
|-------------|--------------|----------------------------------------|------------------------|
| US          | US           | US                                     | US                     |
| Europe      | Europe       | US                                     | Europe <sup>2</sup>    |
| Australia   | Australia    | US<sup>1</sup>                         | Australia <sup>2</sup> |

<sup>1</sup>OATH Code logs are stored in Australia

<sup>2</sup>Voice calls multifactor authentication service logs are stored in the US

The following table shows the location for service logs for sovereign clouds.

| Sovereign cloud                      | Sign-in logs                         | Multifactor authentication activity report (includes personal data)| Multifactor authentication service logs |
|--------------------------------------|--------------------------------------|-------------------------------|------------------|
| Microsoft Azure Germany              | Germany                              | US                            | US               |
| Microsoft Azure Operated by 21Vianet | China                                | US                            | US               |
| Microsoft Government Cloud           | US                                   | US                            | US               |

The Multifactor Authentication activity report data contain personal data such as user principal name (UPN) and complete phone number.

The Multifactor Authentication service logs are used to operate the service.

## Next steps

For more information about what user information is collected by cloud-based Azure AD Multifactor Authentication and Azure AD Multifactor Authentication Server, see [Azure AD Multifactor Authentication user data collection](howto-mfa-reporting-datacollection.md).
