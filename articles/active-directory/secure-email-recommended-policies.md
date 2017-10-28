---
title: Secure email recommended policies | Microsoft Docs
description: Describes the policies for Microsoft recommendations about how to apply email policies and configurations.
author: jeffgilb
manager: femila
editor: jsnow
ms.service: guidance
ms.topic: article
ms.date: 07/12/2017
ms.author: jeffgilb
ms.reviewer: jsnow
ms.custom: it-pro
pnp.series.title: Best Practices
---

# Recommended policies
 
This article describes recommended policies to help our customers secure organizational email and email clients support Modern Authentication and Conditional Access. Also discussed are the default platform client configurations we recommend to provide the best SSO experience to your users, as well as the technical pre-requisites for conditional access.

## Prerequisites

Before implementing the policies described in the remainder of this document, there are several prerequisites that your organization must meet:
* [Configure named networks](https://docs.microsoft.com/azure/active-directory/active-directory-known-networks-azure-portal). Azure AD Identity Protection collects and analyzes all available session data to generate a risk score. We recommend that you specify your organization's public IP ranges for your network in the Azure AD named networks configuration. Traffic coming from these ranges is given a reduced risk score, so traffic from outside the corporate environment is treated as higher risk score.
* [Register all users with multi-factor authentication (MFA)](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-manage-users-and-devices). Azure AD Identity Protection makes use of Azure MFA to perform additional security verification. We recommend that you require all users to register for Azure MFA ahead of time.
* [Enable automatic device registration of domain joined Windows computers](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-automatic-device-registration-setup). Conditional access can ensure the device connecting to the service is a domain joined or compliant device. To support this on Windows computers, the device must be registered with Azure AD.  This article discusses how to configure automatic device registration.  Note that AD FS is a requirement.
* **Prepare your support team**. Have a plan in place for users that cannot complete MFA. This can be adding them to a policy exclusion group, or registering new MFA info for them. Before making either of these security sensitive changes, you need to ensure the actual user is making the request. Requiring users' managers to help with the approval is an effective step.
* [Configure password writeback to on-premises AD](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started). Password Writeback allows Azure AD to require that users change their on-premises passwords when there has been a high risk of account compromise detected. You can enable this feature using Azure AD Connect in one of two ways. You can either enable Password Writeback in the optional features screen of the Azure AD Connect setup wizard, or you can enable it via Windows PowerShell.  
* [Enable modern authentication](https://support.office.com/article/Enable-Exchange-Online-for-modern-authentication-58018196-f918-49cd-8238-56f57f38d662) and [protect legacy endpoints](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-supported-apps).  Conditional access works both with mobile and desktop applications that use modern authentication. If the application uses legacy authentication protocols, it may gain access despite the conditions being applied. It is important to know which applications can use conditional access rules and the steps that you need to take to secure other application entry points.
* [Enable Azure Information Protection](https://docs.microsoft.com/information-protection/get-started/infoprotect-tutorial-step1) by activating Rights Management. Use Azure Information Protection with email to start with classification of emails. Follow the quick start tutorial to customize and publish policy.  

> [!NOTE]
> The following recommendations are based on three different tiers of security and protection for your email that can be applied based on the granularity of your needs: [baseline, sensitive, and highly regulated](https://docs.microsoft.com/azure/active-directory/secure-email-introduction). You can learn more by downloading this [Identity and Device Protection for Office 365 infographic](https://go.microsoft.com/fwlink/p/?linkid=841656).  


## Baseline 
This section describes the secure email recommendations for the baseline tier of data, identity, and device protection. These recommendations should meet the default protection needs of many organizations.
>[!NOTE]
>The policies below are additive and build upon each other. Each section describes only the additions applied to each tier.
>

### Conditional access policy settings

#### Identity protection 
You can give users single sign-on (SSO) experience as described in earlier sections. You only need to intervene when necessary based on [risk events](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-risk-events).  

* Require MFA based on medium or above sign-in risk
* Require secure password change for high risk users

>[!IMPORTANT]
>[Password synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-synchronization) and [self-service password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords) are required for this policy recommendation.
>

#### Data loss prevention 
The goal for your device and app management policies is to protect data loss in the event of a lost or stolen device. You can do this by ensuring that access to data is protected by a PIN, that the data is encrypted on the device, and that the device is not compromised.

|Policy recommendation|Description|
|:--------------------|:----------|
|**Require user PC management**|Require users to join their PCs to an Active Directory Domain or enroll their PCs into management with Intune or Configuration Manager|
|**Apply security settings via group policy objects (GPO) or Configuration Manager policies for domain joined PCs**|Deploy policies that configure managed PCs to enable BitLocker, enable anti-virus, and enable firewall|
|**Require user mobile device management**|Require that user devices used to access email are managed by Intune or company email is accessed only through mobile email apps protected by Intune App Protection policies such as Outlook Mobile|
|**Apply an Intune Device Compliance Policy on managed devices**|Apply an Intune Device Compliance Policy for managed corporate mobile devices and Intune-managed PCs that requires: a PIN with minimum length 6, device encryption, a healthy device (is not jailbroken, rooted; passes health attestation), and if available, require devices that are Low risk as determined by a third-party MTP like Lookout or SkyCure|
|**Apply an Intune App Protection Policy for managed apps running on unmanaged devices**|Apply an Intune App Protection Policy for managed apps running on unmanaged, personal mobile devices to require: a PIN with minimum length 6, device encryption, and that the device is healthy (is not jailbroken, rooted; passes health attestation)|

### User impact

For most organizations, it is important to be able to set user expectations around when and for which conditions they will be expected to sign into Office 365 to access their email.  

Users typically benefit from single sign-on (SSO) except during the following situations: 
* When requesting authentication tokens for Exchange Online:
  * Users may be asked to MFA whenever a medium or above sign-in risk is detected and users has not yet performed MFA in their current sessions.  
  * Users will be required to either use email apps that support the Intune App Protection SDK or access emails from Intune compliant or AD domain-joined devices. 
* When users at risk sign-in, and successfully complete MFA, they will be asked to change their password.

## Sensitive

This section describes the secure email recommendations for the sensitive tier of data, identity, and device protection. These recommendations are for customers who have a subset of data that must be protected at higher levels or require all data to be protected at these higher levels. 

You can apply increased protection to all or specific data sets in your Office 365 environment. For example, you can apply policies to ensure sensitive data is only shared between protected apps to prevent data loss. We recommend protecting identities and devices that access sensitive data with comparable levels of security. 

### Conditional access policy settings
#### Identity protection 

You can give users single sign-on (SSO) experience as described in earlier sections. You only need to intervene when necessary based on [risk events](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-risk-events).   

* Require MFA on low or above risk sessions
 * Require secure password change for high risk users

>[!IMPORTANT]
>[Password synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-synchronization) and [self-service password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords) are required for this policy recommendation.
>

#### Data loss prevention 

The goal for these device and app management policies is to protect data loss in the event of a lost or stolen device. You can do this by ensuring that access to data is protected by a PIN, that the data is encrypted on the device, and that the device is not compromised.

|Policy recommendation|Description|
|:--------------------|:----------|
|**Require user PC management**|Require users to join their PCs to an Active Directory Domain or enroll their PCs into management with Intune or Configuration Manager and ensure those devices are compliant with policies before allowing email access|
|**Apply security settings via group policy objects (GPO) or Configuration Manager policies for domain joined PCs**|Deploy policies that configure managed PCs to enable BitLocker, enable anti-virus, and enable firewall|
|**Require user mobile device management**|Require that user devices used to access email are managed by Intune or company email is accessed only through mobile email apps protected by Intune App Protection policies such as Outlook Mobile|
|**Apply an Intune Device Compliance Policy on managed devices**|Apply an Intune Device Compliance Policy for managed corporate mobile devices and Intune-managed PCs that requires: a PIN with minimum length 6, device encryption, a healthy device (is not jailbroken, rooted; passes health attestation), and if available, require devices that are Low risk as determined by a third-party MTP like Lookout or SkyCure|
|**Apply an Intune App Protection Policy for managed apps running on unmanaged devices**|Apply an Intune App Protection Policy for managed apps running on unmanaged, personal mobile devices to require: a PIN with minimum length 6, device encryption, and that the device is healthy (is not jailbroken, rooted; passes health attestation)|

### User impact

For most organizations, it is important to be able to set expectations for users specific to when and under what conditions they will be expected to sign into Office 365 email. 

Users typically benefit from single sign-on (SSO) except under the following situations: 
* When requesting authentication tokens for Exchange Online:
  * Users will be asked to MFA whenever a low or above sign-in risk is detected and users has not yet performed MFA in their current sessions.  
  * Users will be required to either use email apps that support the Intune App Protection SDK or access emails from Intune compliant or AD domain-joined devices. 
* When users at risk sign-in, and successfully complete MFA, they will be asked to change their password.

## Highly regulated
This section describes the secure email recommendations for the highly regulated tier of data, identity, and device protection. These recommendations are for customers who may have a very small amount of data that is highly classified, trade secret, or regulated data. Microsoft provides capabilities to help organizations meet these requirements, including added protection for identities and devices. 

### Conditional access policy settings
#### Identity protection 

For highly regulated tier Microsoft recommends enforcing MFA for all new sessions.
* Require MFA for all new sessions
* Require secure password change for high risk users

>[!IMPORTANT]
>[Password synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-synchronization) and [self-service password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords) are required for this policy recommendation.
>

#### Data Loss Prevention
The goal for these device and app management policies is to protect data loss in the event of a lost or stolen device. This is done by ensuring that access to data is protected by a PIN, that the data is encrypted on the device, and that the device is not compromised.

For the highly regulated tier, we recommend requiring apps that support Intune App Protection policy running only on Intune compliant or domain-joined devices.

|Policy recommendation|Description|
|:--------------------|:----------|
|**Require user PC management**|Require users to join their PCs to an Active Directory Domain, or enroll their PCs into management with Intune or Configuration Manager and ensure those devices are compliant with policies before allowing email access|
|**Apply security settings via group policy objects (GPO) or Configuration Manager policies for domain joined PCs**|Deploy policies that configure managed PCs to enable BitLocker, enable anti-virus, and enable firewall|
|**Require user mobile device management**|Require that user devices used to access email are managed by Intune or company email is accessed only through mobile email apps protected by Intune App Protection policies such as Outlook Mobile|
|**Apply an Intune Device Compliance Policy on managed devices**|Apply an Intune Device Compliance Policy for managed corporate mobile devices and Intune-managed PCs that requires: a PIN with minimum length 6, device encryption, a healthy device (is not jailbroken, rooted; passes health attestation), and, if available, require devices that are Low risk as determined by a third-party MTP like Lookout or SkyCure|

### User impact
For most organizations, it is important to be able to set expectations for users specific to when and under what conditions they will be expected to sign into Office 365 email. 

* Maximum lifetime of a single sign-on session is 1 day. Users will be required to re-authenticate with MFA after the sessions expire.
* When users at risk sign-in, after complete MFA, will be asked to change their password.
* When requesting authentication tokens for Exchange Online:
  * Users will be asked to perform MFA whenever they begin a new session.  
  * Users will be required to use email apps that support the Intune App Protection SDK
  * Users will be required to access emails from Intune compliant or AD domain-joined devices. 
 
 ## Next steps
 [Deploy recommended secure email policies](secure-email-deploy-recommended-policies.md)
