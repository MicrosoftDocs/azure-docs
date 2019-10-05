---
title: Plan a passwordless authentication deployment with Azure Active Directory
description: Azure Active Directory passwordless authentication increases security and reduces user pain

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/26/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: baselden, librown

ms.collection: M365-identity-device-management
---
# Plan a passwordless authentication method deployment

Eighty-one percent of successful cyberattacks begin with a compromised username and password. Many organizations try to counter this threat by requiring frequently changed, complex passwords that are difficult to manage and remember. Microsoft’s [research shows](https://aka.ms/passwordguidance) that these efforts annoy users, drive up support costs, and don’t increase security. For more information, see [Your Pa$$word doesn’t matter](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984).

Multi-factor authentication (MFA) is a great way to secure your organization, but users get frustrated with using MFA and having to remember the passwords.

Passwordless authentication methods are more convenient. The password is replaced with something you have plus something you are or something you know. For example, in Windows Hello for Business a biometric recognition plus a device-specific PIN that isn't transmitted over a network.

This article covers phone and security key sign in. We recommend that every organization that uses Windows 10 devices use [Windows Hello for Business](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-identity-verification). Then, add either phone authentication (with the Microsoft Authenticator app) or use security keys for additional scenarios.

## Benefits of passwordless authentication

Deploying passwordless authentication provides the following benefits:

* Increased security. Reduce the risk of phishing and password spray attacks by removing passwords as an attack surface.
* Better user experience. Give users a convenient way to access data from anywhere, and provide easy access to Outlook, OneDrive, office, and more while mobile.
* Robust insights. Gain insights into users passwordless activity with robust logging and auditing.

## Learn about passwordless authentication

Microsoft offers several passwordless authentication options.

### Types of passwordless authentication

The passwordless methods, Azure AD offers, cover many scenarios. These methods aren't competing; they can be used in tandem.
Before moving on with your implementation of passwordless authentication, review the article [A world without passwords with Azure Active Directory](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless).

* Phone sign in with the [Microsoft Authenticator application](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless) is useful for providing a passwordless option to users with mobile devices.
* Security key sign in with [FIDO2 Security keys](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless) is especially useful for users who sign in to kiosks, situations where use of phones is restricted, and for privileged identities.
* [Windows Hello for Business](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless) is best for users on their dedicated Windows laptops or desktop computers.

See [Deciding a passwordless method](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless) for a comparison of technologies and the applicable business scenarios.

For more details, watch [Microsoft’s Guide for going passwordless](https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/BRK2078).

### Compare passwordless authentication methods

Microsoft’s passwordless authentication methods enable different scenarios. Consider your organizational needs, prerequisites, and the capabilities of each authentication method to select your passwordless authentication strategy. We recommend that every organization that uses Windows 10 devices use Windows Hello for Business. Then, add either phone authentication (with the Microsoft Authenticator app) or use security keys for additional scenarios.

#### Passwordless authentication scenarios

| Requirements and Scenarios | Phone Authentication | Security keys | Windows Hello for Business |
| --- | --- | --- | --- |
| **Computer sign in**: <br> From assigned Windows 10 device | **No** | **Yes** <br> With biometric, PIN | **Yes**<br>with biometric recognition and or PIN |
| **Computer sign in**: <br> From shared Windows 10 device | **No** | **Yes** | **No** |
| **Computer sign in**: <br> Non-Windows computer | **No** | **No** | **No** |
| **Web app sign in**: <br>‎ from a user-dedicated computer | **Yes** | **Yes** <br> Provided single sign-on to apps is enabled by computer sign in | **Yes**<br> Provided single sign-on to apps is enabled by computer sign in |
| **Web app sign in**: <br> from a mobile or non-windows device | **Yes** | **No** | **No** |

[Deciding a passwordless method](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless) has a further comparison of business scenarios.

### Prerequisites for deploying passwordless phone and security key sign in

Meet these prerequisites before beginning a deployment for these methods.

| Prerequisite | Authenticator App | FIDO2 Security Keys |
| --- | --- | --- |
| [Combined registration for MFA and Self-Service Password Reset (SSPR)](https://docs.microsoft.com/azure/active-directory/authentication/howto-registration-mfa-sspr-combined) is enabled (preview feature) | √ | √ |
| [Users are enabled for MFA](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted) | √ | √ |
| [Users have registered for combined security registration](https://docs.microsoft.com/azure/active-directory/authentication/howto-registration-mfa-sspr-combined) | √ | √ |
| [Users have registered their mobile devices to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/devices/overview) | √ |   |
| Windows 10 version 1809 or higher using a supported browser like Microsoft Edge or Mozilla Firefox <br> (version 67 or higher). <br>*Microsoft recommends version 1903 or higher for native support*. |   | √ |
| Compatible FIDO2 security keys. Ensure that you’re using a [Microsoft-tested and verified](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable) FIDO2 security device, or other compatible FIDO2 security device. |   | √ |

#### Prerequisites for Windows Hello for Business

The prerequisites for Windows Hello are highly dependent on whether you’re deploying in an on-premises, hybrid, or cloud-only configuration. See the [full listing of prerequisites](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-identity-verification) by network type.

#### Azure MFA must be enabled for passwordless authentication

Users register their strong authentication method as a part of the MFA flow. MFA can be used as a fallback in case they can't use their phone or security key.

### Licensing for passwordless authentication

There's no additional cost for passwordless authentication, although some prerequisites may require a premium subscription. See detailed feature and licensing information in the [Azure Active Directory licensing page](https://azure.microsoft.com/pricing/details/active-directory/).

## Plan the passwordless authentication project

Consider your business needs and the use cases for each authentication method. Then select the method that best fits your needs.

### Use cases

The following table outlines the use cases to be implemented during this project.

| Area | Description |
| --- | --- |
| **Access** | * Passwordless sign in is available from a corporate or personal device within or outside the corporate network. |
| **Auditing** | * Usage data is available to administrators to audit in near real time. <br> * Usage data is downloaded into corporate systems at least every 29 days, or Azure Monitor is used. |
| **Governance** | * Lifecycle of user assignments to appropriate Authentication Method and associated groups is defined and monitored. |
| **Security** | * Access to appropriate Authentication Method is controlled via user and group assignments. <br> * Only authorized users can use passwordless sign in. |
| **Performance** | * Access assignment propagation timelines are documented and monitored. <br> * Sign in times is measured for ease of use. |
| **User Experience** | * Users are aware of mobile compatibility. <br> * Users can configure the Authenticator App passwordless sign in. |
| **Support** | * Users are aware of how to find support for passwordless sign in issues. |

### Engage the right stakeholders

When technology projects fail, it's typically because of mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, [ensure that you’re engaging the right stakeholders](https://aka.ms/deploymentplans) and that stakeholder roles in the project are well understood.

### Plan communications

Communication is critical to the success of any new service. Proactively communicate how users' experience will change, when it will change, and how to gain support if they experience issues.

Your communications to end users will need to include:

* [Enabling the combined security registration experience](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone)
* [Downloading the Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-download-install)
* [Registering in the Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone)
* [Signing in with your phone](https://docs.microsoft.com/azure/active-directory/user-help/microsoft-authenticator-app-phone-signin-faq)

Microsoft provides MFA [communication templates](https://aka.ms/mfatemplates), Self-Service Password Reset (SSPR) [communication templates](https://www.microsoft.com/download/details.aspx?id=56768), and [end-user documentation](https://docs.microsoft.com/azure/active-directory/user-help/security-info-setup-signin) to help draft your communications. 
You can send users to [https://myprofile.microsoft.com](https://myprofile.microsoft.com/) to register directly by selecting the Security Info links on that page.

## Plan a Pilot

When you deploy passwordless authentication, you should first enable one or more pilot groups. You can [create groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal) specifically for this purpose. Add the users who will participate in the pilot to the groups. Then, [enable new passwordless authentication methods](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable?branch=master) for the selected groups.

Groups can be synced from an on-premises directory, or from Azure AD. Once you’re happy with the results of your pilot, you can [switch the passwordless authentication to all users](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable?branch=master).

See [Best practices for a pilot](https://aka.ms/deploymentplans) on the deployment plans page.

## Plan passwordless phone auth with the Microsoft Authenticator app

Before starting, be sure to meet the prerequisites.

You might be using the Microsoft Authenticator App as a convenient MFA option. It’s now available as a passwordless option. The Microsoft Authenticator app is a free download from Google Play or the Apple App Store. [Learn more about downloading the Microsoft Authenticator app](https://www.microsoft.com/account/authenticator?cmp=h66ftb_42hbak).

It turns any iOS or Android phone into a strong, passwordless credential by allowing users to sign into any platform or browser. Users sign in by getting a notification to their phone, matching a number displayed on the screen to the one on their phone and then using their biometric data or PIN to confirm. [See details on how the Microsoft Authenticator app works](https://docs.microsoft.com/azure/security/fundamentals/ad-passwordless).

![passwordless sign in screen](media/howto-authentication-passwordless-deployment/passwordless-dp-sign-in.png)

Users must download the Microsoft Authenticator app. and follow the directions to enable phone sign in.

### Technical considerations for the Microsoft Authenticator app

**AD FS Integration**. When a user enables the Microsoft Authenticator passwordless credential, authentication for that user defaults to sending a notification for approval. Users in a hybrid tenant are prevented from being directed to ADFS for sign in unless they select “Use your password instead.” This process also bypasses any on-premises Conditional Access policies, and Pass-through authentication flows. However, if a login_hint is specified, the user will be forwarded to ADFS and bypass the option to use the passwordless credential.

**Azure MFA server**. End users enabled for MFA through an organization’s on-premises Azure MFA server can still create and use a single passwordless phone sign in credential. If the user attempts to upgrade multiple installations (5+) of the Microsoft Authenticator with the credential, this change may result in an error.

**Device Registration**. To use the Authenticator App for passwordless authentication, the device must be registered in the Azure AD tenant and can't be a shared device. A device can only be registered in a single tenant. This limit means that only one work or school account is supported for phone sign in in the Authenticator app.

## Plan passwordless auth with FIDO2 security keys

There are two types of deployments available with security keys:

* Passwordless sign in to **Azure Active Directory web apps on a supported browser**
* Passwordless sign in to **Azure Active Directory Joined Windows 10 devices**

Enable the following prerequisites specific to the using security keys app:

* Windows 10 version 1809 or higher using a supported browser like Microsoft Edge or Mozilla Firefox (version 67 or higher).
   * Microsoft recommends 1903 or higher for native support.
* Compatible FIDO2 security keys. Microsoft announced [key partnerships with FIDO2 key vendors](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Microsoft-passwordless-partnership-leads-to-innovation-and-great/ba-p/566493).

Windows 10 version 1809 does support FIDO2 sign in and may require software from the FIDO2 key manufacturer to be deployed. We recommend you use version 1903 or later.

### Plan the life cycle of security keys

Security keys enable access to your resources, and you should plan the management of those physical devices.

1. Key distribution: Plan how you’ll provision keys to your organization. You may have a centralized provisioning process or allow end users to purchase FIDO 2.0-compatible keys.
1. Key activation: End users must self-activate the security key. End users register their security keys at [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo) and enable the second factor (PIN or biometric) at first use 
1. Disabling a key: While security key functionality is in the preview stage, there's no way for an administrator to remove a key from a user account. The user must remove it. If a key is lost or stolen:
   1. remove the user from any group enabled for passwordless authentication
   1. verify they've removed the key as an authentication method
   1. issue a new key
1. Key replacement: Users can enable two security keys at the same time. When replacing a security key, ensure the user has also removed the key being replaced

### Plan enablement of security keys for Windows sign in

Enabling Windows 10 sign in using FIDO2 security keys requires enabling the credential provider functionality in Windows 10. Enable it in one of two ways:

- [Enable credential provider via targeted Intune deployment](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-security-key)
- [Enable credential provider via provisioning package](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable?branch=master)

Intune deployment is the recommended option for Azure Active Directory Domain Joined machines. If Intune deployment isn't possible, you must deploy a package on each machine to enable credential provider functionality. The package installation can be carried out by:

* a domain admin via group policy or System Center Configuration Manager (SCCM)
* can be installed by a local admin account on a Windows 10 machine.

### Register Security Keys for Windows 10 Devices

Users must register their security key on each of their Azure Active Directory Joined Windows 10 machines.

For more information, see [User registration and management of FIDO2 security keys](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-security-key).

## Plan Operations and Security for passwordless authentication

Planning for auditing that meets your organizational and compliance frameworks is an essential part of your deployment.

### Plan auditing

Azure AD has reports that provide technical and business insights. Have your business and technical application owners assume ownership of and consume these reports based on your organization’s requirements.

The Authentication methods section within the Azure Active Directory portal is where administrators can enable and manage settings for passwordless credentials.

Azure AD adds entries to the audit logs when:

* an admin makes changes in the Authentication methods section.
* a user makes any kind of change to their credentials within Azure Active Directory.

The table below provides some examples of typical reporting scenarios.

|   | Manage Risk | Increase productivity | Governance and compliance |
| --- | --- | --- | --- |
| **Report types** | Authentication methods- users registered for combined security registration | Authentication methods – users registered for app notification | Sign-ins: review who is accessing the tenant and how |
| **Potential actions** | Target users not yet registered | Drive adoption of Microsoft Authenticator app or security keys | Revoke access or enforce additional security policies for admins |

**Azure AD retains most auditing data for 30 days** and makes the data available via Azure Admin Portal or API for you to download into your analysis systems. If your organization requires longer retention, the logs need to be exported and consumed into a SIEM tool such as Splunk or Sumo Logic. [Learn more about viewing your access and usage reports](https://azure.microsoft.com/documentation/articles/active-directory-view-access-usage-reports/)

Azure Monitor logs allow you to query data to find particular events, analyze trends, and perform correlation across various data sources. With the integration of Azure AD activity logs in Azure Monitor logs, you can now perform tasks like:

* Compare your Azure AD sign in logs against security logs published by Azure Security Center
* Troubleshoot performance bottlenecks on your application’s sign in page by correlating application performance data from Azure Application Insights.

[Learn more about integrating Azure AD logs with Azure Monitor logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

Users can register and manage their credentials by navigating to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). This link directs users to the end-user credential management experience that was enabled via the combined SSPR/MFA registration experience. Any registration of FIDO2 security devices or changes to authentication methods by a user are logged in the Azure Active Directory audit logs.

### Plan security

As part of this rollout plan, Microsoft recommends that passwordless authentication be enabled for all privileged admin accounts.

When users enable or disable the account on a security key, or reset the second factor for the security key on their Windows 10 machines, an entry is added to security log and are under the following event IDs: 4670, 5382.

## Plan testing for passwordless authentication

At each stage of your deployment, ensure that you’re testing that results are as expected.

### Plan testing for the Microsoft Authenticator app

The following are sample test cases for passwordless authentication with the Microsoft Authenticator app

| Scenario| Expected results |
| --- | --- |
| User can register Microsoft Authenticator app | User can register app from aka.ms/mysecurityinfo |
| User can enable phone sign in | Phone sign in configured for work account |
| User can access an app with phone sign in | User goes through phone sign in flow and reaches designated application. |
| Test rolling back phone sign in registration by turning off Microsoft Authenticator passwordless sign in within the Authentication Methods screen in the Azure Active Directory portal | Previously enabled users unable to use passwordless sign in from Microsoft Authenticator. |
| Removing phone sign in from Microsoft Authenticator app | Work account no longer available on Microsoft Authenticator |

### Plan testing for security keys

The following are sample test cases for passwordless authentication with security keys.

**Passwordless FIDO sign in to Azure Active Directory Joined Windows 10 devices**

| Scenario | Expected results |
| --- | --- |
| The user can register FIDO2 device (1809) | User can register FIDO2 device using at Settings > Accounts > sign in options > Security Key |
| The user can reset FIDO2 device (1809) | User can reset FIDO2 device using manufacturer software |
| The user can sign in with FIDO2 device (1809) | User can select Security Key from sign in window, and successfully sign in. |
| The user can register FIDO2 device (1903) | User can register FIDO2 device at Settings > Accounts > sign in options > Security Key |
| The user can reset FIDO2 device (1903) | User can reset FIDO2 device at Settings > Accounts > sign in options > Security Key |
| The user can sign in with FIDO2 device (1809) | User can select Security Key from sign in window, and successfully sign in. |

**Passwordless FIDO sign in to Azure AD web apps**

| Scenario | Expected results |
| --- | --- |
| The user can register FIDO2 device at aka.ms/mysecurityinfo using Edge | Registration should succeed |
| The user can register FIDO2 device at aka.ms/mysecurityinfo using Firefox | Registration should succeed |
| The user can sign in to OneDrive online using FIDO2 device using Edge | Sign in should succeed |
| The user can sign in to OneDrive online using FIDO2 device using Firefox | Sign in should succeed |
| Test rolling back FIDO2 device registration by turning off FIDO2 Security Keys within the Authentication methods blade in the Azure Active Directory portal | Users will be prompted to sign in using their security key, it will successfully log them in and an error will be displayed: “Your company policy requires that you use a different method to sign in”. Users should then be able to select a different method and successfully sign in. Close the window and sign in again to verify they do not see the same error message. |

### Plan rollback

Though passwordless authentication is a lightweight feature with minimal impact on end users, it may be necessary to roll back.

Rolling back requires the administrator to sign in to the Azure Active Directory portal, select authentication methods, and change the enable option to ‘No’. This will turn off the passwordless functionality for all users.

Users that have already registered FIDO2 security devices will be prompted to use the security device at their next sign in, and will then see the following error:

![choose a different way to sign in](media/howto-authentication-passwordless-deployment/passwordless-choose-sign-in.png)

## Deploy passwordless authentication

Follow the steps aligned to your chosen method below.

### Required administrative roles

| Azure AD Role | Description |
| --- | --- |
| Global Administrator | Least privileged role able to implement combined registration experience |
| Authentication Administrator | Least privileged role able to implement authentication methods |
| User | Least privileged role to configure Authenticator app on device, or to enroll security key device for web or Windows 10 sign in. |

### Deploy Phone sign in with the Microsoft Authenticator app

1. Ensure all prerequisites are met
1. [Enable passwordless authentication methods](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone)
1. [User registration and management of Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone)

### Deploy FIDO2 security key sign in

1. [Prepare devices for preview](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
1. [Enable security keys for Windows sign in](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
1. [Obtain FIDO2 security keys](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
1. [Enable passwordless authentication methods](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
1. [User registration and management of FIDO2 security keys](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
1. [Sign in with passwordless credentials](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable)
 
## Manage passwordless authentication

Now that you’ve deployed, you need to manage your solution. 

### Required administrative roles

| Business role | Azure AD Role |
| --- | --- |
| Admin in charge of deployment | Global Administrator |
| User support personnel | Authentication Administrator |

### Troubleshoot phone sign in

| Scenario | Solution |
| --- | --- |
| User cannot perform combined registration | Ensure [combined registration](https://docs.microsoft.com/azure/active-directory/authentication/concept-registration-mfa-sspr-combined) is enabled. |
| User cannot enable phone sign in authenticator app | Ensure user is in scope for deployment |
| User is NOT in scope for passwordless authentication, but is presented with passwordless sign in option, which they cannot complete. | This scenario occurs when the user has enabled phone sign in n the application prior to the policy being created. <br> To enable sign in: Add the user to the scope of users enabled for passwordless sign in. <br> To block sign in: have the user remove their credential form that application. |

### Troubleshoot security key sign in

| Scenario | Solution |
| --- | --- |
| User cannot perform combined registration | Ensure [combined registration](https://docs.microsoft.com/azure/active-directory/authentication/concept-registration-mfa-sspr-combined) is enabled. |
| User cannot add a security key in their [security settings](https://aka.ms/mysecurityinfo) | Ensure that [passwordless authentication methods](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable) are enabled. |
| User cannot add security key in Windows 10 sign in options | [Ensure that security keys for Windows sign in](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-enable) |
| **Error message**: We detected that this browser or OS does not support FIDO2 security keys. | Passwordless FIDO2 security devices can only be registered in supported browsers (Microsoft Edge, Firefox version 67) on Windows 10 version 1809 or higher. |
| **Error message**: Your company policy requires that you use a different method to sign in. | Unsure security keys are enabled in the tenant. |
| User unable to manage my security key on Windows 10 version 1809 | Version 1809 requires that you use the security key management software provided by the FIDO2 key vendor. Contact the vendor for support. |
| I think my FIDO2 security key may be defective—how can I test it | Navigate to [https://webauthntest.azurewebsites.net/](https://webauthntest.azurewebsites.net/), enter credentials for a test account, plug in the suspect security key, click the “+” button at the top right of the screen, click create, and go through the creation process. If this scenario fails, your device may be defective. |

## Next steps

- [Enable passwordless security keys for sign in for Azure AD](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-security-key)
- [Enable passwordless sign-in with the Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone)
- [Learn more about Authentication methods usage & insights](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-methods-usage-insights)
