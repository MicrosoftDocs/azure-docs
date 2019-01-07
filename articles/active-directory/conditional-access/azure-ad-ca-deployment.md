---
title: Plan conditional access policies in Azure Active Directory | Microsoft Docs
description: In this article, you learn how to plan conditional access policies for Azure Active Directory.
services: active-directory
author: MarkusVi
manager: mtillman
tags: azuread
ms.service: active-directory
ms.component: conditional-access
ms.topic: conceptual
ms.workload: identity
ms.date: 12/13/2018
ms.author: markvi
ms.reviewer: martincoetzer
---

# Conditional access deployment plan

## Plan

### How to draft conditional access policies

Use the following documentation to familiarize yourself with how Conditional Access (CA) works:

* 10,000 foot overview of CA: [Conditional Access in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal).

* Conditional Access capabilities: [Access controls in Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-controls).

* Real-world use cases: [Conditions in Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-conditions).

This document helps customers plan and deploy typical conditional access policies to protect apps and resources using multi-factor authentication (MFA) and other risk factors.

Conditional access policies use the following pattern:

|When *this* happens:|Then do *this*:|
|-|-|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Block access to the application|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Grant access with (AND):<br>- Requirement 1 (for example, MFA)<br>- Requirement 2 (for example, Device compliance)|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Grant access with (OR):<br>- Requirement 1 (for example, MFA)<br>- Requirement 2 (for example, Device compliance)|

*To a cloud app* can be:

* A single cloud app
* A list of cloud apps
* A wildcard (all cloud apps)
* A descriptive label (all HR apps)

*By users and groups* can be:

* A single user or group
* A list of users and groups
* A list of roles
* A wildcard (all users and groups)
* A descriptive label (all admins)

### Types of policies

With Conditional Access, you can control how authorized users can access your resources. A few key options you have are:

1. What if a legitimate user tries to access a cloud app from a network location you don’t trust?

With location-based policies, you can define whether and how your users can access your resources from inside and outside your organization’s network. For example, you can require that they always MFA from outside your corporate network.

2. What if a legitimate user tries to access a cloud app with a device that isn't managed by your organization?

Using device-based Conditional Access, you can tie requirements to the device that is used by a user to access your resources.

3. What if a user with compromised credentials tries to sign in?

Use Identity Protection’s capability to analyze the risk of the user and restrict access.

### Recommended Policies

If you have Azure AD Premium P1 Licenses:

|When *this* happens: |Then do *this*: |
|-|-|
|An access attempt is made:<br>- To all cloud apps<br>- By Global Admins|[Require MFA (for admin)](https://docs.microsoft.com/azure/active-directory/conditional-access/baseline-protection#require-mfa-for-admins)|
|An access attempt is made:<br>- To a specific app<br>- By All Users and Groups|[Require MFA when not at work](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks)|
|An access attempt is made:<br>- To a specific app<br>- By All Users and Groups|[Require a compliant device or an approved app](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices)|

If you have Azure AD Premium P2 Licenses, consider adding the following policies:

|When this happens:|Then do this:|
|-|-|
|An access attempt is made:<br>- To all cloud apps<br>- By all users and groups<br>- Condition: Sign in Risk is Medium or High|[MFA for risky sign-ins](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-sign-in-risk-policy)|
|An access attempt is made:<br>- To all cloud apps<br>- By All Users and Groups<br>- Condition: High sign-in risk due to leaked credentials|[Require MFA + Password change if credentials are leaked](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-user-risk-policy)|

## Design

This section outlines the design considerations and information you need to roll out each Conditional Access policy. Each subsection focuses on designing one of the recommended CA policies mentioned above.

### MFA when not at work

Azure AD enables single sign-on to devices, apps, and services from anywhere on the internet. Using a location-based Conditional Access policy, you can control access to your cloud apps based on the network location (either a named location such as a country or a specific IP range) of a user. You can [require MFA](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks) when a user is outside the corporate network by defining the Internet facing IP ranges for your trusted corporate network. Use the table below to identify the trusted locations for your corporate network.

Considerations:

* When defining named locations, make sure that IP ranges you trust are marked as trusted.
* Trusted IP ranges can be split into multiple named locations so that it is easy to manage (for example, office locations).
* These locations represent the public IP ranges for the corporate network.

For more information, see [Location conditions in Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-locations).

### MFA for admins

Admins are frequently the target of attacks as their privileged accounts can perform actions in the Azure portal that others cannot. Requiring MFA for admins is a simple policy that helps to secure these high privilege accounts. When rolling out [MFA for admins](https://docs.microsoft.com/azure/active-directory/conditional-access/baseline-protection#require-mfa-for-admins), make sure at least one admin is excluded from the policy until there is another admin that has successfully registered for MFA and signed in. You don't want to lock all admins out of the Azure portal.

>[!TIP]
> Microsoft recommends requiring MFA for global admins (at a minimum), for all cloud applications

### MFA for risky sign-ins

Azure AD Identity Protection (IP) *sign-in risk* indicates the likelihood (high, medium, or low) that a sign-in attempt wasn't performed by the legitimate owner of a user account. IP calculates the sign-in risk level in real time, as users try to access their applications. You can use the calculated [sign-in risk level as a condition in a Conditional Access policy](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-sign-in-risk-policy).

Learn More about [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection).

> [!TIP]
> Microsoft recommends applying this CA policy to all your cloud applications

### Require a compliant device or an approved app

Enterprise Mobility + Security offers a comprehensive set of technologies that can help address the challenges and concerns of bring your own device (BYOD) scenarios. The technologies we will cover here include:

* Microsoft Intune for mobile device management (MDM) and Intune App Protection
* Azure Active Directory (Azure AD) for identity management

One of the first decisions you need to make for bring your own devices (BYOD) scenarios, is whether you need to manage the entire device or just the data on it.

Managing the entire device means that it is under the control of Intune or a third-party mobile device management (MDM) solution. Intune allows for both Mobile Device Management (MDM) and Intune App Protection. It offers extensive protection to the device and the applications running on the device. Some enterprises require their employees to enroll their devices with MDM, but with Intune, this device management is optional, depending on your organization's security and user experience requirements. Employees are often hesitant to enroll a personal device because they fear that IT groups can *control* or *see and delete* personal information when, with Intune, this concern isn't an issue.

The table below outlines some common considerations about BYOD and key features of Intune. It list each feature that addresses the requirement, to help you decide whether to manage BYOD devices with MDM, Intune App Protection, or both. You can learn more in the device management [Planning Guide](https://docs.microsoft.com/intune/planning-guide).

|Consideration |MDM |Intune App Protection |
|-|-|-|
|User onboarding experience|User generally needs to **accept that device will be remotely managed by IT** (varies by OS).|User gets **FYI about data protections** upon first launch of a protected app.|
|Access pin|Admins can create and enforce PINs to sign into the **device**.|Admins can create and enforce PINs to get corporate data in mobile **apps**.|
|Data encryption|Admins can create and enforce policies for **full device encryption**.|Admins can create and enforce policies for **application data encryption**.|
|Hardware setup |Admins can create and enforce policies around various hardware components such as camera, cellular radios, Wi-Fi, radios, and so on.|N/A|
|Wi-Fi, VPN, email, and certificate profiles|Admins can deploy profiles to devices that configure Wi-Fi, VPN, email, and certificates to meet company requirements. Admins can also create and deploy custom profiles.|N/A|
|App provisioning|Intune can distribute Store apps and line-of-business apps directly to the device. You can tag the apps as *available* (the user must install the app) or as *required* (the app will be installed automatically).|Apps aren't distributed to devices by Intune. The admin creates an app policy to target a set of apps. After the end user downloads the app and logs on with their corporate credentials, the app policy is immediately applied to the app.|
|App inventory|Can inventory all apps on device.|Cannot inventory apps on device.|
|Data removal|Remove corporate data and settings with *selective wipe*. Run a complete factory reset if necessary. <br>Learn more about [selective wipe](https://docs.microsoft.com/intune/devices-wipe) and [factory reset](https://docs.microsoft.com/intune/device-factory-reset) for MDM.|Remove corporate data from Intune-managed app with *selective wipe*. [Learn more about selective wipe for app protection.](https://docs.microsoft.com/intune/apps-selective-wipe)|
|MDM conflict|N/A|Can coexist with any Microsoft or non-Microsoft MDM solution.|

Learn more about [device management and app management lifecycles](https://docs.microsoft.com/intune/introduction-device-app-lifecycles).

Learn more about which apps are protected by [Intune App Management](https://www.microsoft.com/cloud-platform/microsoft-intune-apps)

#### Ways to make sure corporate data isn't leaked

As a complimentary solution to enforcing Conditional Access on devices and applications, you can add additional security controls by creating app protection policies to control which applications can be used to access corporate data.

|Concern|Device Management Mitigations|Intune App Management Mitigations|
|-|-|-|
|Lost or stolen device|Remove all device data<br>Require Device PIN|Remove all app data|
|Compromised device or app|Device encryption|App data encryption|
|Accidental data sharing or saving to unsecured locations|Restrict device data backups<br>Restrict save-as<br>Disable printing|Restrict cut/copy/paste<br>Restrict save-as|

For both, corporate and personal devices, you should decide whether your users should be able to access your resources from within and outside your organization’s network. You should also decide whether a trusted device is required for an access attempt.

> [!NOTE]
> To grant access, require devices to be marked compliant or an approved application.

Now that you have seen how you can use Intune and Azure AD to protect corporate data on employee-owned devices, decide if you are going to use Intune as a device management solution with app management, or if you are going to focus solely on app management. With either option, you can use the identity and security features available with Azure AD. Use the Intune [Planning Guide](https://docs.microsoft.com/intune/planning-guide) to map out your Intune specific plan.

### Password change for risky users

Making sure users’ credentials aren't stolen is a top priority. You will need a plan when credentials are compromised. Azure AD identity protection scans the Internet to detect when users’ credentials are leaked. Combining identity protection with Conditional Access enables you to require that all users with compromised credentials have to change their password or aren't allowed to access the application. Forcing the user to change their password, makes sure the leaked password is no longer valid.

|Option 1 – Password Change |Option 2 – Block Access |
|-|-|
|When a user attempts to sign into an application with compromised credentials, require that the user MFA into the app and update his or her password|When a user attempts to sign into an application with compromised credentials, block the user from getting access|

> [!NOTE]
> Enabling this policy requires that you have setup password writeback.
> [!TIP]
> Microsoft recommends requiring password change to make sure the password is changed. This policy should be applied across all applications or users and groups in a tenant.

Learn More in the user risk security [policy section](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection#users-flagged-for-risk).

## Implement your solution

The foundation of proper planning is the basis upon which you can deploy an application successfully with Azure Active Directory. It provides intelligent security and integration that simplifies onboarding while reducing the time for successful deployments. This combination makes sure your application is integrated with ease while mitigating down time for your end users.

Use the following phases to plan for and deploy your solution in your organization:

* Phase 1: Configuring your solution
* Phase 2: Testing
* Phase 3: Rollback Steps
* Phase 4: Moving to Production

### Phase 1: Implementation steps

Use this section to help with your implementation. Based on the policies that you selected in the design section, identify the users, groups, conditions, and controls that apply to each policy.

#### Identify a set of users and groups to validate the implementation

>[!TIP]
> Microsoft recommends starting with a set of pilot users and groups before rolling out a Conditional Access policy to the entire set of users and groups that the policy covers. Define a test users group you can use for the pilot.

#### Configure your policy

Once you’re ready to create your policy:

1. Go to portal.azure.com
2. Navigate to Azure Active Directory
3. Click on Conditional Access on the left navigation
4. Click on New Policy
5. Configure the Users, Apps, Conditions, and Controls
6. Set Enable Policy to on

![Picture 26](Media/azure-ad-ca-deployment-image1.png)

### Phase 2: Test

Use the following table to identify test cases that you would like to verify before rolling out your application to the rest of the organization. We’ve created a set of default use cases for you to get started with. Add and remove test cases based on the policies that you would like to implement. Use the [What-if](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-whatif) tool to verify the scenarios below.

>[!NOTE]
> Make sure to open a new browser session for all tests
>[!TIP]
> Microsoft recommends using the Whatif tool to verify that policies are working as expected

The following table outlines example test cases. Adjust the scenarios and expected results based on how your CA policies are configured.

|Policy |Scenario |Expected Results |
|-|-|-|
|[Require MFA when not at work](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks)|Authorized user signs into *App* while on a trusted location / work|User isn't prompted to MFA|
|[Require MFA when not at work](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks)|Authorized user signs into *App* while not on a trusted location / work|User is prompted to MFA and can sign in successfully|
|[Require MFA (for admin)](https://docs.microsoft.com/azure/active-directory/conditional-access/baseline-protection#require-mfa-for-admins)|Global Admin signs into *App*|Admin is prompted to MFA|
|[Risky Sign-Ins](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-sign-in-risk-policy)|User signs into *App* using a [Tor browser](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-playbook)|Admin is prompted to MFA|
|[Device Management](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices)|Authorized user attempts to sign in from an authorized device|Access Granted|
|[Device Management](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices)|Authorized user attempts to sign in from an unauthorized device|Access blocked|
|[Password Change for risky users](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-user-risk-policy)|Authorized user attempts to sign in with compromised credentials (high risk sign in)|User is prompted to change password or access is blocked based on your policy|

### Phase 3: Move to production

1. Provide Internal Change Communication to end users.
2. Apply a policy to a small set of users and verify it behaves as expected.
3. When you expand a policy to include more users, continue to exclude one admin from the policy. Excluding one admin will make sure admin account still have access and can update a policy if a change is required.

>[!TIP]
>Follow the production deployment [best practices](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-best-practices).

## Phase 4: Rollback steps

Use the following options to roll back a Conditional Access policy

1. **Disable the policy** - Disabling a policy makes sure it doesn't apply when a user tries to sign in. You can always come back and enable the policy when you’d like to use it.

![Picture 27](Media/Cazure-ad-ca-deployment-image2.png)

2. **Exclude a user / group from a policy** - If a user is unable to access the app, you can choose to exclude the user from the policy

>[!NOTE]
> This option should be used sparingly, only in situations where the user is trusted. The user should be added back into the policy or group as soon as possible.

![Picture 30](Media/azure-ad-ca-deployment-image3.png)

3. **Delete the policy** - If the policy is no longer required, delete it.

## Next steps

* Conditional access [technical reference](https://docs.microsoft.com/azure/active-directory/conditional-access/technical-reference)
