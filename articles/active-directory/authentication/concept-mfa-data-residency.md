---
title: Azure AD Multi-Factor Authentication data residency
description: Learn what personal and organizational data Azure AD Multi-Factor Authentication stores about you and your users and what data remains within the country/region of origin.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/11/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: inbarc

ms.collection: M365-identity-device-management
---
# Data residency and customer data for Azure AD Multi-Factor Authentication

Customer data is stored by Azure AD in a geographical location based on the address provided by your organization when subscribing for a Microsoft Online service such as Microsoft 365 and Azure. For information on where your customer data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

Cloud-based Azure AD Multi-Factor Authentication and Azure Multi-Factor Authentication Server process and store some amount of personal data and organizational data. This article outlines what and where data is stored.

The Azure AD Multi-Factor Authentication service has datacenters in the US, Europe, and Asia Pacific. The following activities originate out of the regional datacenters except where noted:

* Multi-factor authentication using phone calls originate from US datacenters and are routed by global providers.
* General purpose user authentication requests from other regions such as Europe or Australia are currently processed based on the user's location.
* Push notifications using the Microsoft Authenticator app are currently processed in the regional datacenters based on the user's location.
    * Device vendor-specific services, such as Apple Push Notifications, may be outside the user's location.

## Personal data stored by Azure AD Multi-Factor Authentication

Personal data is user-level information associated with a specific person. The following data stores contain personal information:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* Multi-Factor Authentication activity reports
* Microsoft Authenticator activations

This information is retained for 90 days.

Azure AD Multi-Factor Authentication doesn't log personal data such as username, phone number, or IP address, but there is a *UserObjectId* that identifies Multi-Factor Authentication attempts to users. Log data is stored for 30 days.

### Azure AD Multi-Factor Authentication

For Azure public clouds, excluding Azure B2C authentication, NPS Extension, and Windows Server 2016 or 2019 AD FS Adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multi-Factor Authentication logs     |
| One-way SMS                          | In Multi-Factor Authentication logs     |
| Voice call                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

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
> As of July 1, 2019, Microsoft will no longer offer Multi-Factor Authentication Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure AD Multi-Factor Authentication. Existing customers who have activated Multi-Factor Authentication Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| One-way SMS                          | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store |
| Voice call                           | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported |
| Microsoft Authenticator notification | In Multi-Factor Authentication logs<br />Multi-Factor Authentication activity report data store<br />Blocked users if fraud reported<br />Change requests when Microsoft Authenticator device token changes |

## Organizational data stored by Azure AD Multi-Factor Authentication

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

## MFA logs location

The following table shows the location for service logs for public clouds.

| Public cloud| Sign-in logs | Multi-Factor Authentication activity report        | Multi-Factor Authentication service logs       |
|-------------|--------------|----------------------------------------|------------------------|
| US          | US           | US                                     | US                     |
| Europe      | Europe       | US                                     | Europe <sup>2</sup>    |
| Australia   | Australia    | US<sup>1</sup>                         | Australia <sup>2</sup> |

<sup>1</sup>OATH Code logs are stored in Australia

<sup>2</sup>Voice calls MFA service logs are stored in the US

The following table shows the location for service logs for sovereign clouds.

| Sovereign cloud                      | Sign-in logs                         | Activity report (Includes PII)| MFA Service logs |
|--------------------------------------|--------------------------------------|-------------------------------|------------------|
| Microsoft Azure Germany              | Germany                              | US                            | US               |
| Microsoft Azure Operated by 21Vianet | China                                | US                            | US               |
| Microsoft Government Cloud           | US                                   | US                            | US               |

The Multi-Factor Authentication activity report data contain personally identifiable information (PII) such as user principal name (UPN) and complete phone number.

The Multi-Factor Authentication service logs are used to operate the service.

## Next steps

For more information about what user information is collected by cloud-based Azure AD Multi-Factor Authentication and Azure Multi-Factor Authentication Server, see [Azure AD Multi-Factor Authentication user data collection](howto-mfa-reporting-datacollection.md).
