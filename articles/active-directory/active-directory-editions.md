<properties
	pageTitle="Azure Active Directory editions | Microsoft Azure"
	description="A topic that explains choices for free and paid editions of Azure Active Directory.Azure Active Directory Basic is the free edition and Azure Active Directory Premium is the paid edition."
	services="active-directory"
	documentationCenter=""
	authors="MarkusVi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="markvi"/>

# Azure Active Directory editions

All Microsoft Online business services rely on Azure Active Directory for sign-on and other identity needs. If you subscribe to any of Microsoft Online business services (e.g. Office 365, Microsoft Azure, etc), you get Azure Active Directory (Azure AD) with access to all of the Free features, described below.  


Azure Active Directory is a service that provides comprehensive identity and access management capabilities in the cloud for your employees, partners and customers. It combines directory services, advanced identity governance, a rich standards-based platform for developers, and application access management for your own or any of thousands of pre-integrated applications. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. To learn more about Azure Active Directory, read [What is Azure AD](active-directory-whatis.md).



To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic and Premium editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

Office 365 subscriptions include additional Azure Active Directory features described in the comparison table below. 


> [AZURE.NOTE] For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). Azure Active Directory Premium and Azure Active Directory Basic are not currently supported in China. Please contact us at the Azure Active Directory Forum for more information


- **Azure Active Directory Basic** - Designed for task workers with cloud-first needs, this edition provides cloud centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory), all backed by an enterprise-level SLA of 99.9 percent uptime.
 
- **Azure Active Directory Premium** - Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity and access management (IAM), identity protection and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users. 

To sign up and start using Active Directory Premium today, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).


> [AZURE.NOTE] 
>A number of Azure Active Directory capabilities are available through "pay as you go" editions:
>
>- Active Directory B2C is the identity and access management solution for your consumer-facing applications. For more details, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)
 
>-	Azure Multi-Factor Authentication can be used through per user or per authentication providers. For more details, see [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md) 


##Comparing generally available features

> [AZURE.NOTE] For a different view of this data, see the [Azure Active Directory Capabilities](https://www.microsoft.com/en/server-cloud/products/azure-active-directory/features.aspx).




**Common Features**

- [Directory Objects](#directory-objects) 

- [User/Group Management (add/update/delete)/ User-based provisioning, Device  registration](#usergroup-management-addupdatedelete-user-based-provisioning-device-registration)

- [Single Sign-On (SSO)](#single-sign-on-sso)

- [Self-Service Password Change for cloud users](#self-service-password-change-for-cloud-users)

- [Connect  (Sync engine that extends on-premises directories to Azure Active Directory)](#connect-sync-engine-that-extends-on-premises-directories-to-azure-active-directory) 

- [Security / Usage Reports](#securityusage-reports)



**Basic Features**

- [Group-based access management / provisioning](#group-based-access-managementprovisioning)

- [Self-Service Password Reset for cloud users](#self-service-password-reset-for-cloud-users)

- [Company Branding (Logon Pages/Access Panel customization)](#company-branding-logon-pagesaccess-panel-customization)

- [Application Proxy](#application-proxy)

- [SLA 99.9%](#sla-999)


**Premium Features**

- [Self-Service Group and app Management/Self-Service application additions/ Dynamic Groups](#self-service-group-and-app-managementself-service-application-additions-dynamic-groups)

- [Self-Service Password Reset/Change/Unlock  with on-premises write-back](#self-service-password-resetchangeunlock-with-on-premises-write-back)

- [Multi-Factor Authentication (Cloud and On-premises (MFA Server))](#multi-factor-authentication-cloud-and-on-premises-mfa-server)

- [MIM CAL + MIM Server](#mim-cal-mim-server) 

- [Cloud App Discovery](#cloud-app-discovery) 

- [Connect Health](#connect-health)

- [Automatic password rollover for group accounts](#automatic-password-rollover-for-group-accounts)


**Azure Active Directory Join – Windows 10 only  related features**

- [Join a device to Azure AD, Desktop SSO, Microsoft Passport for Azure AD, Administrator Bitlocker recovery](#join-a-device-to-azure-ad-desktop-sso-microsoft-passport-for-azure-ad-administrator-bitlocker-recovery)

- [MDM auto-enrolment,  Self-Service Bitlocker recovery, Additional  local administrators to Windows 10 devices via Azure AD Join](#mdm-auto-enrolment-self-service-bitlocker-recovery-additional-local-administrators-to-windows-10-devices-via-azure-ad-join)






## Common Features
#### Directory Objects 

**Type:** Common Features

The default usage quota is 150,000 objects. An object is an entry in the directory service, represented by its unique distinguished name. An example of an object is a user entry used for authentication purposes. If you need to exceed this default quota, please contact support. The 500K object limit does not apply for Office 365, Microsoft Intune or any other Microsoft paid online service that relies on Azure Active Directory for directory services.


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| Up to 500,000 objects| No object limit| No object limit| No object limit for Office 365 user accounts|



#### User/Group Management (add/update/delete)/ User-based provisioning, Device  registration

**Type:** Common Features

**Availability:**


| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [Administer your Azure AD directory](active-directory-administer.md)
- [Azure Active Directory Device Registration overview](active-directory-conditional-access-device-registration-overview.md)




#### Single Sign-On (SSO)

**Type:** Common Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| 10 apps per user (1) | 10 apps per user (1) | No Limit (2) | 10 apps per user (1)|

1. With Azure AD Free and Azure AD Basic, end users who have been assigned access to SaaS apps, can see up to 10 apps in their Access Panel and get SSO access to them. Admins can configure SSO and assign user access to as many SaaS apps as they want with Free and Basic however end users will only see 10 apps in their Access Panel at a time.

2. Self-service integration of any application supporting SAML, SCIM, or forms-based authentication by using templates provided in the application gallery menu. For more details, see [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md).

**More details:**

- [Managing Applications with Azure Active Directory (AD)](active-directory-enable-sso-scenario.md)



#### Self-Service Password Change for cloud users

**Type:** Common Features

**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [How to update your own password](active-directory-passwords-update-your-own-password.md)




#### Connect  (Sync engine that extends on-premises directories to Azure Active Directory) 

**Type:** Common Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)



#### Security/Usage Reports

**Type:** Common Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| 3 Basic reports| 3 Basic reports| Advanced reports| 3 Basic reports|

**More details:**

- [View your access and usage reports](active-directory-view-access-usage-reports.md)




## Premium and Basic Features
#### Group-based access management/provisioning

**Type:** Basic Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  | ![Check][12]| ![Check][12]|  |

**More details:**

- [Using a group to manage access to SaaS applications](active-directory-accessmanagement-group-saasapps.md)



#### Self-Service Password Reset for cloud users

**Type:** Basic Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  | ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [Azure AD Password Reset for Users and Admins](active-directory-passwords.md)



#### Company Branding (Logon Pages/Access Panel customization)

**Type:** Basic Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  | ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)



#### Application Proxy

**Type:** Basic Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  | ![Check][12]| ![Check][12]|  |

**More details:**

- [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md)



#### SLA 99.9%

**Type:** Basic Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  | ![Check][12]| ![Check][12]| ![Check][12]|

**More details:**

- [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)




## Premium Features
#### Self-Service Group and app Management/Self-Service application additions/ Dynamic Groups

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |




         
#### Self-Service Password Reset/Change/Unlock  with on-premises write-back

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |





#### Multi-Factor Authentication (Cloud and On-premises (MFA Server))

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]| Limited to cloud only for Office 365 Apps|

**More details:**

- [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)



#### MIM CAL + MIM Server 

Microsoft Identity Manager Server software rights are granted with Windows Server licenses (any edition). Since Microsoft Identity Manager runs on Windows Server OS, as long as the server is running a valid, licensed copy of Windows Server, then Microsoft Identity Manager can be installed and used on that server. No other separate license is required for Microsoft Identity Manager Server.

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |





#### Cloud App Discovery 

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |

**More details:**

- [Finding unmanaged cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)



#### Connect Health

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |

**More details:**

- [Monitor your on-premises identity infrastructure and synchronization services in the cloud](active-directory-aadconnect-health.md)



#### Automatic password rollover for group accounts

**Type:** Premium Features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |




## Azure Active Directory Join – Windows 10 only  related features
#### Join a device to Azure AD, Desktop SSO, Microsoft Passport for Azure AD, Administrator Bitlocker recovery

**Type:** Azure Active Directory Join – Windows 10 only  related features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|




#### MDM auto-enrolment,  Self-Service Bitlocker recovery, Additional  local administrators to Windows 10 devices via Azure AD Join

**Type:** Azure Active Directory Join – Windows 10 only  related features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
|  |  | ![Check][12]|  |


#### Enterprise State Roaming

**Type:** Azure Active Directory Join – Windows 10 only  related features


**Availability:**

| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| :-: | :-: | :-: | :-: |
| | | ![Check][12]| |

**More details:**

- [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)


## Azure AD preview features
In addition to the generally available features of the Free, Basic, and Premium editions, Azure AD also provides you with a collection of preview features. You can use the preview features to get an impression of what is coming in the near future and to determine whether these features can help improving your environment.

**Available preview features:**

- [B2B collaboration](active-directory-b2b-collaboration-overview.md)
- [Administrative Units](active-directory-administrative-units-management.md)
- Privileged Identity Management
- [HR application Integration](active-directory-saas-workday-inbound-tutorial.md)
- [Azure Active Directory Identity Protection](active-directory-identityprotection.md)
- [Certificate based authentication on iOS](active-directory-certificate-based-authentication-ios.md)
- [Certificate based authentication on Android](active-directory-certificate-based-authentication-android.md)
 





## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)

<!--Image references-->
[12]: ./media/active-directory-editions/ic195031.png

