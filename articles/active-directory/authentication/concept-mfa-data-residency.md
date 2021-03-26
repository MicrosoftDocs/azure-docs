---
title: Azure AD multifactor authentication data residency
description: Learn what personal and organizational data Azure AD multifactor authentication stores about you and your users and what data remains within the country/region of origin.

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
# Data residency and customer data for Azure AD multifactor authentication

Azure Active Directory (Azure AD) stores customer data in a geographical location based on the address an organization provides when subscribing to a Microsoft online service such as Microsoft 365 or Azure. For information on where your customer data is stored, see [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) in the Microsoft Trust Center.

Cloud-based Azure AD multifactor authentication and Azure Multifactor Authentication Server process and store personal data and organizational data. This article outlines what and where data is stored.

The Azure AD multifactor authentication service has datacenters in the United States, Europe, and Asia Pacific. The following activities originate from the regional datacenters except where noted:

* Multifactor authentication phone calls originate from United States datacenters and are routed by global providers.
* General purpose user authentication requests from other regions are currently processed based on the user's location.
* Push notifications that use the Microsoft Authenticator app are currently processed in regional datacenters based on the user's location. Vendor-specific device services, such as Apple Push Notification Service, might be outside the user's location.

## Personal data stored by Azure AD multifactor authentication

Personal data is user-level information that's associated with a specific person. The following data stores contain personal information:

* Blocked users
* Bypassed users
* Microsoft Authenticator device token change requests
* Multifactor authentication activity reports
* Microsoft Authenticator activations

This information is retained for 90 days.

Azure AD multifactor authentication doesn't log personal data such as usernames, phone numbers, or IP addresses. However, *UserObjectId* identifies authentication attempts to users. Log data is stored for 30 days.

### Data stored by Azure AD multifactor authentication

For Azure public clouds, excluding Azure AD B2C authentication, the NPS Extension, and the Windows Server 2016 or 2019 Active Directory Federation Services (AD FS) adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | Multifactor authentication logs     |
| One-way SMS                          | Multifactor authentication logs     |
| Voice call                           | Multifactor authentication logs<br/>Multifactor authentication activity report data store<br/>Blocked users (if fraud was reported) |
| Microsoft Authenticator notification | Multifactor authentication logs<br/>Multifactor authentication activity report data store<br/>Blocked users (if fraud was reported)<br/>Change requests when the Microsoft Authenticator device token changes |

For Microsoft Azure Government, Microsoft Azure Germany, Microsoft Azure operated by 21Vianet, Azure AD B2C authentication, the NPS extension, and the Windows Server 2016 or 2019 AD FS adapter, the following personal data is stored:

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | Multifactor authentication logs<br/>Multifactor authentication activity report data store |
| One-way SMS                          | Multifactor authentication logs<br/>Multifactor authentication activity report data store |
| Voice call                           | Multifactor authentication logs<br/>Multifactor authentication activity report data store<br/>Blocked users (if fraud was reported) |
| Microsoft Authenticator notification | Multifactor authentication logs<br/>Multifactor authentication activity report data store<br/>Blocked users (if fraud was reported)<br/>Change requests when the Microsoft Authenticator device token changes |

### Data stored by Azure Multifactor Authentication Server

If you use Azure Multifactor Authentication Server, the following personal data is stored.

> [!IMPORTANT]
> As of July 1, 2019, Microsoft no longer offers Multifactor Authentication Server for new deployments. New customers who want to require multifactor authentication from their users should use cloud-based Azure AD multifactor authentication. Existing customers who activated Multifactor Authentication Server before July 1, 2019, can download the latest version and updates, and generate activation credentials as usual.

| Event type                           | Data store type |
|--------------------------------------|-----------------|
| OATH token                           | Multifactor authentication logs<br />Multifactor authentication activity report data store |
| One-way SMS                          | Multifactor authentication logs<br />Multifactor authentication activity report data store |
| Voice call                           | Multifactor authentication logs<br />Multifactor authentication activity report data store<br />Blocked users (if fraud was reported) |
| Microsoft Authenticator notification | Multifactor authentication logs<br />Multifactor authentication activity report data store<br />Blocked users (if fraud was reported)<br />Change requests when Microsoft Authenticator device token changes |

## Organizational data stored by Azure AD multifactor authentication

Organizational data is tenant-level information that can expose configuration or environment setup. Tenant settings from the following Azure portal multifactor authentication pages might store organizational data such as lockout thresholds or caller ID information for incoming phone authentication requests:

* Account lockout
* Fraud alert
* Notifications
* Phone call settings

For Azure Multifactor Authentication Server, the following Azure portal pages might contain organizational data:

* Server settings
* One-time bypass
* Caching rules
* Multifactor Authentication Server status

## Multifactor authentication logs location

The following table shows the location for service logs for public clouds.

| Public cloud| Sign-in logs | Multifactor authentication activity report        | Multifactor authentication service logs       |
|-------------|--------------|----------------------------------------|------------------------|
| United States          | United States           | United States                                     | United States                     |
| Europe      | Europe       | United States                                     | Europe <sup>2</sup>    |
| Australia   | Australia    | United States<sup>1</sup>                         | Australia <sup>2</sup> |

<sup>1</sup>OATH Code logs are stored in Australia.

<sup>2</sup>Voice calls multifactor authentication service logs are stored in the United States.

The following table shows the location for service logs for sovereign clouds.

| Sovereign cloud                      | Sign-in logs                         | Multifactor authentication activity report (includes personal data)| Multifactor authentication service logs |
|--------------------------------------|--------------------------------------|-------------------------------|------------------|
| Microsoft Azure Germany              | Germany                              | United States                            | United States               |
| Azure China 21Vianet                 | China                                | United States                            | United States               |
| Microsoft Government Cloud           | United States                                   | United States                            | United States               |

The multifactor authentication activity reports contain personal data such as User Principal Name (UPN) and complete phone number.

The multifactor authentication service logs are used to operate the service.

## Next steps

For more information about what user information is collected by cloud-based Azure AD multifactor authentication and Azure Multifactor Authentication Server, see [Azure AD multifactor authentication user data collection](howto-mfa-reporting-datacollection.md).
