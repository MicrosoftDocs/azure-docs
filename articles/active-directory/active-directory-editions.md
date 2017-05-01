---
title: Azure Active Directory editions | Microsoft Docs
description: This article explains choices for free and paid editions of Azure Active Directory. Azure Active Directory Basic, Azure Active Directory Premium P1, and Azure Active Directory Premium P2 are the paid editions.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: dcaf8939-7633-40a8-bd76-27dedbb6083a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/13/2017
ms.author: curtand

---
# Azure Active Directory editions
All Microsoft Online business services rely on Azure Active Directory (Azure AD) for sign-in and other identity needs. If you subscribe to any of Microsoft Online business services (for example, Office 365 or Microsoft Azure), you get Azure AD with access to all of the Free features, described below.  

Azure Active Directory is a comprehensive, highly available identity and access management cloud solution that combines core directory services, advanced identity governance, and application access management. Azure Active Directory also offers a rich, standards-based platform that enables developers to deliver access control to their applications, based on centralized policy and rules. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. To learn more about Azure Active Directory, read [What is Azure AD?](active-directory-whatis.md)

To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic, Premium P1, and Premium P2 editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

Office 365 subscriptions include additional Azure Active Directory features described in the comparison table below.

> [!NOTE]
> For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). Azure Active Directory Premium P1, Premium P2, and Azure Active Directory Basic are not currently supported in China. Please contact us at the Azure Active Directory Forum for more information.
>
>

* **Azure Active Directory Basic** - Designed for task workers with cloud-first needs, this edition provides cloud centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory), all backed by an enterprise-level SLA of 99.9 percent uptime.
* **Azure Active Directory Premium P1** - Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity and access management (IAM), identity protection and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users.
* **Azure Active Directory Premium P2** - Designed with advanced protection for all your users and administrators, this new offering includes all the capabilities in Azure AD Premium P1 as well as our new Identity Protection and Privileged Identity Management. Azure Active Directory Identity Protection leverages billions of signals to provide risk-based conditional access to your applications and critical company data. We also help you manage and protect privileged accounts with Azure Active Directory Privileged Identity Management so you can discover, restrict and monitor administrators and their access to resources and provide just-in-time access when needed.  

To sign up and start using Active Directory Premium today, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).

> [!NOTE]
> A number of Azure Active Directory capabilities are available through "pay as you go" editions:
>
> * Active Directory B2C is the identity and access management solution for your consumer-facing applications. For more details, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)
> * Azure Multi-Factor Authentication can be used through per user or per authentication providers. For more details, see [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)
>
>

## Comparing generally available features
> [!NOTE]
> For a different view of this data, see the [Azure Active Directory Capabilities](https://www.microsoft.com/en/server-cloud/products/azure-active-directory/features.aspx).
>
>

**Common Features**

* [Directory Objects](#directory-objects)
* [User/Group Management (add/update/delete)/ User-based provisioning, Device  registration](#usergroup-management-addupdatedelete-user-based-provisioning-device-registration)
* [Single Sign-On (SSO)](#single-sign-on-sso)
* [Self-Service Password Change for cloud users](#self-service-password-change-for-cloud-users)
* [Connect  (Sync engine that extends on-premises directories to Azure Active Directory)](#connect-sync-engine-that-extends-on-premises-directories-to-azure-active-directory)
* [Security / Usage Reports](#securityusage-reports)

**Basic Features**

* [Group-based access management / provisioning](#group-based-access-managementprovisioning)
* [Self-Service Password Reset for cloud users](#self-service-password-reset-for-cloud-users)
* [Company Branding (Logon Pages/Access Panel customization)](#company-branding-logon-pagesaccess-panel-customization)
* [Application Proxy](#application-proxy)
* [SLA 99.9%](#sla-999)

**Premium P1 Features**

* [Self-Service Group and app Management/Self-Service application additions/Dynamic Groups](#self-service-group)
* [Self-Service Password Reset/Change/Unlock  with on-premises write-back](#self-service-password-resetchangeunlock-with-on-premises-write-back)
* [Multi-Factor Authentication (Cloud and On-premises (MFA Server))](#multi-factor-authentication-cloud-and-on-premises-mfa-server)
* [MIM CAL + MIM Server](#mim-cal-mim-server)
* [Cloud App Discovery](#cloud-app-discovery)
* [Connect Health](#connect-health)
* [Automatic password rollover for group accounts](#automatic-password-rollover-for-group-accounts)

**Premium P2 Features**

* [Identity Protection](active-directory-identityprotection.md)
* [Privileged Identity Management](active-directory-privileged-identity-management-configure.md)

**Azure Active Directory Join – Windows 10 only related features**

* [Join a device to Azure AD, Desktop SSO, Microsoft Passport for Azure AD, Administrator Bitlocker recovery](#join-a-device-to-azure-ad-desktop-sso-microsoft-passport-for-azure-ad-administrator-bitlocker-recovery)
* [MDM auto-enrollment, Self-Service Bitlocker recovery, Additional local administrators to Windows 10 devices via Azure AD Join](#mdm-auto-enrollment)

## Common Features
#### Directory Objects
**Type:** Common Features

The default usage quota is 150,000 objects. An object is an entry in the directory service, represented by its unique distinguished name. An example of an object is a user entry used for authentication purposes. If you need to exceed this default quota, please contact support. The 500K object limit does not apply for Office 365, Microsoft Intune or any other Microsoft paid online service that relies on Azure Active Directory for directory services.

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| Up to 500,000 objects |No object limit |No object limit |No object limit for Office 365 user accounts |

#### User/Group Management (add/update/delete), User-based provisioning, Device registration
**Type:** Common Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| ![Check][12] |![Check][12] |![Check][12] |![Check][12] |

**More details:**

* [Administer your Azure AD directory](active-directory-administer.md)
* [Azure Active Directory Device Registration overview](active-directory-conditional-access-device-registration-overview.md)

#### Single Sign-On (SSO)
**Type:** Common Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| 10 apps per user (1) |10 apps per user (1) |No Limit (2) |10 apps per user (1) |

1. With Azure AD Free and Azure AD Basic, end-users are entitled to get single sign-on access for up to 10 applications.
2. Self-service integration of any application supporting SAML, SCIM, or forms-based authentication by using templates provided in the application gallery menu. For more details, see [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md).

**More details:**

* [Managing Applications with Azure Active Directory (AD)](active-directory-enable-sso-scenario.md)

#### Self-Service Password Change for cloud users
**Type:** Common Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| ![Check][12] |![Check][12] |![Check][12] |![Check][12] |

**More details:**

* [How to update your own password](active-directory-passwords-update-your-own-password.md#reset-or-unlock-my-password-for-a-work-or-school-account)

#### Connect  (Sync engine that extends on-premises directories to Azure Active Directory)
**Type:** Common Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| ![Check][12] |![Check][12] |![Check][12] |![Check][12] |

**More details:**

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

#### Security/Usage Reports
**Type:** Common Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| 3 Basic reports |3 Basic reports |Advanced reports |3 Basic reports |

**More details:**

* [View your access and usage reports](active-directory-view-access-usage-reports.md)

## Premium and Basic Features
#### Group-based access management/provisioning
**Type:** Basic Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; |![Check][12] | ![Check][12] | &nbsp; |

**More details:**

* [Using a group to manage access to SaaS applications](active-directory-accessmanagement-group-saasapps.md)

#### Self-Service Password Reset for cloud users
**Type:** Basic Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; |![Check][12] |![Check][12] | ![Check][12] |

**More details:**

* [Azure AD Password Reset for Users and Admins](active-directory-passwords.md)

#### Company Branding (Logon Pages/Access Panel customization)
**Type:** Basic Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; |![Check][12] |![Check][12] | ![Check][12] |

**More details:**

* [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)

#### Application Proxy
**Type:** Basic Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; |![Check][12] | ![Check][12] | &nbsp; |

**More details:**

* [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md)

#### SLA 99.9%
**Type:** Basic Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; |![Check][12] |![Check][12] | ![Check][12] |

**More details:**

* [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)

## Premium Features


#### <a name="self-service-group"></a>Self-Service Group and app Management/Self-Service application additions/Dynamic Groups
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12]| &nbsp; |

#### Self-Service Password Reset/Change/Unlock with on-premises write-back
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

#### Multi-Factor Authentication (Cloud and On-premises (MFA Server))
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; |![Check][12] |Limited to cloud only for Office 365 Apps |

**More details:**

* [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)


#### <a name="mim-cal-mim-server"></a>MIM CAL + MIM Server
Microsoft Identity Manager Server software rights are granted with Windows Server licenses (any edition). Because Microsoft Identity Manager runs on the Windows Server operating system, as long as the server is running a valid, licensed copy of Windows Server, then Microsoft Identity Manager can be installed and used on that server. No other separate license is required for Microsoft Identity Manager Server.

**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; |![Check][12] | &nbsp; |

#### Cloud App Discovery
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

**More details:**

* [Finding unmanaged cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)

#### Azure AD Connect Health
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

**More details:**

* [Monitor your on-premises identity infrastructure and synchronization services in the cloud](active-directory-aadconnect-health.md)

#### Automatic password rollover for group accounts
**Type:** Premium Features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

#### Identity Protection
**Type:** Premium Features

| Free Edition | Basic Edition | Premium P2 Edition | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

#### Privileged Identity Management
**Type:** Premium Features

| Free Edition | Basic Edition | Premium P2 Edition | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

## Azure Active Directory Join – Windows 10 only  related features
#### Join a device to Azure AD, Desktop SSO, Microsoft Passport for Azure AD, Administrator Bitlocker recovery
**Type:** Azure Active Directory Join – Windows 10 only  related features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| ![Check][12] |![Check][12] |![Check][12] |![Check][12] |


#### <a name="mdm-auto-enrollment"></a>MDM auto-enrollment, Self-Service Bitlocker recovery, Additional local administrators to Windows 10 devices via Azure AD Join
**Type:** Azure Active Directory Join – Windows 10 only  related features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

#### Enterprise State Roaming
**Type:** Azure Active Directory Join – Windows 10 only  related features

**Availability:**

| Free Edition | Basic Edition | Premium (P1 and P2) Editions | Office 365 Apps Only |
|:---:|:---:|:---:|:---:|
| &nbsp; | &nbsp; | ![Check][12] | &nbsp; |

**More details:**

* [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)

## Azure AD preview features
In addition to the generally available features of the Free, Basic, and Premium (P1 and P2) editions, Azure AD also provides you with a collection of preview features. You can use the preview features to get an impression of what is coming in the near future and to determine whether these features can help improving your environment.

**Available preview features:**

* [B2B collaboration](active-directory-b2b-collaboration-overview.md)
* [Administrative Units](active-directory-administrative-units-management.md)
* [HR application Integration](active-directory-saas-workday-inbound-tutorial.md)
* [Certificate-based authentication on iOS](active-directory-certificate-based-authentication-ios.md)
* [Certificate-based authentication on Android](active-directory-certificate-based-authentication-android.md)

## Next steps
* [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
* [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
* [View your access and usage reports](active-directory-view-access-usage-reports.md)

<!--Image references-->
[12]: ./media/active-directory-editions/ic195031.png
