---
title: Azure AD secure email recommended policies | Microsoft Docs
description: Describes the policies for Microsoft recommendations about how to apply email policies and configurations.
author: jeffgilb
ms.service: guidance
ms.topic: article
ms.date: 05/24/2017
ms.author: pnp

pnp.series.title: Best Practices

---

# Recommended policies
 
This article describes recommended policies to help our customers secure organizational email and email clients support Modern Authentication and Conditional Access. Also discussed are the default platform client configurations we recommend to provide the best SSO experience to your users, as well as the technical pre-requisites for conditional access.

## Prerequisites

Before implementing the policies described in the remainder of this document, there are several prerequisites that your organization must meet:
* [Configure named networks](https://docs.microsoft.com/azure/active-directory/active-directory-known-networks-azure-portal). Azure AD Identity Protection collects and analyzes all available session data to generate a risk score. We recommend that you specify your organization's public IP ranges for your network in the Azure AD named networks configuration. Traffic coming from these ranges is given a reduced risk score, so traffic from outside the corporate environment is treated as higher risk score.
* [Register all users with multi-factor authentication (MFA)](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-manage-users-and-devices). Azure AD Identity Protection makes use of Azure MFA to perform additional security verification. We recommend that you require all users to register for Azure MFA ahead of time.
* [Enable automatic device registration of domain joined Windows computers](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-automatic-device-registration-setup). Conditional access can ensure the device connecting to the service is a domain joined or compliant device. To support this on Windows computers, the device must be registered with Azure AD.  This article discusses how to configure automatic device registration.  Note that AD FS is a requirement.
* **Prepare your support team**. Have a plan in place for users that cannot complete MFA. This can be adding them to a policy exclusion group, or registering new MFA info for them. Before making either of these security sensitive changes, you need to ensure the actual user is making the request. Requiring users' managers to help with the approval is an effective step.
* [Configure password writeback to on-premises AD](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started). Password Writeback allows Azure AD to require that users change their on-premises passwords when there has been a high risk of account compromise detected. You can enable this feature using Azure AD Connect in one of two ways. You can either enable Password Writeback in the optional features screen of the Azure AD Connect setup wizard, or you can enable it via Windows PowerShell.  
* [Enable modern authentication](https://support.office.com/en-us/article/Enable-Exchange-Online-for-modern-authentication-58018196-f918-49cd-8238-56f57f38d662) and [protect legacy endpoints](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-supported-apps).  Conditional access works both with mobile and desktop applications that use modern authentication. If the application uses legacy authentication protocols, it may gain access despite the conditions being applied. It is important to know which applications can use conditional access rules and the steps that you need to take to secure other application entry points.
* [Enable Azure Information Protection](https://docs.microsoft.com/en-us/information-protection/get-started/infoprotect-tutorial-step1) by activating Rights Management. Use Azure Information Protection with email to start with classification of emails. Follow the quick start tutorial to customize and publish policy.  

### Recommended email clients
The following email clients support Modern Authentication and Conditional Access. Azure Information Protection is not yet available for all clients.

|Platform|Client|Version/Notes|Azure Information Protection|
|:-------|:-----|:------------|:--------------------|
|**Windows**|Outlook|2016, 2013 ([Enable Modern Auth]((https://support.office.com/en-us/article/Enable-Modern-Authentication-for-Office-2013-on-Windows-devices-7dc1c01a-090f-4971-9677-f1b192d6c910))|Yes|
|**iOS**|Outlook|[Latest](https://itunes.apple.com/us/app/microsoft-outlook-email-and-calendar/id951937596?mt=8)|No|
|**Android**|Outlook|[Latest](https://play.google.com/store/apps/details?id=com.microsoft.office.outlook&hl=en)|No|
|**macOS**|Support coming soon||No|
|**Linux**|Not supported||No|

#### Additional client software
To access Azure Information Protection protected documents, additional software may be required. Be sure that you are using [supported software and document formats](https://docs.microsoft.com/information-protection/get-started/requirements-applications) to create and view protected documents with Azure Information Protection.

## Recommended client configuration for SSO and conditional access
This section describes the default platform client configurations we recommend to provide the best SSO experience to your users, as well as the technical pre-requisites for conditional access.

### Windows devices
We recommend the Windows 10 (version 1703 or later), as Azure is designed to provide the smoothest SSO experience possible for both on-premises and Azure AD. Work or school issued devices should be configured to join Azure AD directly or if the organization uses on-premises AD domain join, those devices should be [configured to automatically and silently register with Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-automatic-device-registration-setup). 

For BYOD Windows devices, users can use "Add work or school account". For BYOD Windows devices, users can use "Add work or school account". Note that Chrome browser users on Windows 10 need to [install an extension](https://chrome.google.com/webstore/detail/windows-10-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji?utm_source=chrome-app-launcher-info-dialog) so those users can get the same smooth sign-in experience as Edge/IE. Also, if your organization has domain joined Windows 7 devices, you can install Microsoft Workplace Join for non-Windows 10 computers [package to register](https://www.microsoft.com/en-us/download/details.aspx?id=53554) the devices with Azure AD.

### iOS devices

We recommend installing the [Microsoft Authenticator app](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/end-user/microsoft-authenticator-app-how-to) on user devices before deploying conditional access or MFA policies. At a minimum, the app should be installed when users are [asked to register their device](https://docs.microsoft.com/azure/multi-factor-authentication/end-user/multi-factor-authentication-end-user-first-time) with Azure AD by adding a work or school account or when they install the Intune company portal app to enroll their device into management. This depends on the configured conditional access policy.

### Android devices

We recommend users install the [Intune Company Portal app](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal&hl=en
) and [Microsoft Authenticator app](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/end-user/microsoft-authenticator-app-how-to) before conditional access policies are deployed or when required during certain authentication attempts. After app installation, users may be asked to register with Azure AD or enroll their device with Intune. This depends on the configured conditional access policy. 

We also recommend that corporate-owned devices (COD) are standardized on OEMs and versions that support Android for Work or Samsung Knox to allow mail accounts to be managed and protected by Intune MDM policy.

## Tiers of security and protection

Most organizations have specific requirements regarding security and data protection. These requirements vary by industry segment and by job functions within organizations. For example, your legal department and Office 365 administrators might require additional security and information protection controls around their email correspondence that are not required for other business unit users. 

Each industry also has their own set of specialized regulations. Rather than providing a list of all possible security options or a recommendation per industry segment or job function, this article provides recommendations for 3 different tiers of security and protection for your email that can be applied based on the granularity of your needs: [baseline, sensitive, and highly regulated](https://go.microsoft.com/fwlink/p/?linkid=841656).  

**Baseline**. We recommend that you establish a minimum standard for protecting data, as well as the identities and devices that access your data. Baseline recommendations can be followed to provide strong default protection that meets the needs of many organizations. 

**Sensitive**. Some customers have a subset of data that must be protected at higher levels or require all data to be protected at these higher levels. You can apply increased protection to all or specific data sets in your Office 365 environment. We recommend protecting identities and devices that access sensitive data with comparable levels of security. 

**Highly regulated**. Some organizations may have a very small amount of data that is highly classified, trade secret, or regulated data. Microsoft provides capabilities to help organizations meet these requirements, including added protection for identities and devices. 

### Default protection mechanism recommendations


The following table contains default protection mechanism recommendations for each of the previously defined security and protection tiers:

|Protection mechanism|Baseline|Sensitive|Highly regulated|
|:-------------------|:-------|:--------|:---------------|
|**Enforce MFA**|On medium or above sign-in risk|On low or above sign-in risk|On all new sessions|
|**Enforce Password Change**|For high risk users|For high risk users|For high risk users|
|**Enforce Intune Application Protection**|Yes|Yes|Yes|
|**Enforce Intune Enrollment (COD)**|Require a compliant or domain joined device|Require a compliant or domain joined device|Require a compliant or domain joined device|

### Device ownership
The above table reflects the trend for many organizations to support a mix of corporate-owned devices (COD) as well as personal or bring-your-own devices (BYOD) to enable mobile productivity across their workforces. Intune App Protection Policies ensure that email is protected from exfiltrating out of the Outlook mobile app and other Office mobile apps, on both COD and BYOD.  

Corporate-owned devices are required to be managed by Intune or domain-joined to apply additional protections and control.  Depending on data sensitivity, your organization may choose to not allow BYOD for specific user populations or specific apps.

## Baseline 
This section describes the secure email recommendations for the baseline tier of data, identity, and device protection. These recommendations should meet the default protection needs of many organizations.
>[!NOTE]
>The policies below are additive and build upon each other. Each section describes only the additions applied to each tier.
>

### Conditional access policy settings

#### Identity protection 
You can give users single sign-on (SSO) experience as described in earlier sections. You only need to intervene when necessary based on [risk events](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-risk-events).  

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

You can give users single sign-on (SSO) experience as described in earlier sections. You only need to intervene when necessary based on [risk events](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-risk-events).   

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
 [Deploy recommended policies](secure-email-deploy-recommended-policies.md)
