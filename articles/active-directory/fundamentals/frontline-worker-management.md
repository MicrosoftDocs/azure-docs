---
title: Frontline worker management - Azure Active Directory
description: Learn about frontline worker management capabilities that are provided through the My Staff portal.

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 03/16/2021

ms.author: cchiedo
author: Chrispine-Chiedo
manager: CelesteDG
ms.reviewer: stevebal

#Customer intent: As a manager of frontline workers, I want an intuitive portal so that I can easily onboard new workers and provision shared devices.
---
# Frontline worker management

Frontline workers account for over 80 percent of the global workforce. Yet because of high scale, rapid turnover, and fragmented processes, frontline workers often lack the tools to make their demanding jobs a little easier. Frontline worker management brings digital transformation to the entire frontline workforce. The workforce may include managers, frontline workers, operations, and IT.

Frontline worker management empowers the frontline workforce by making the following activities easier to accomplish:
- Streamlining common IT tasks with My Staff
- Easy onboarding of frontline workers through simplified authentication
- Seamless provisioning of shared devices and offboarding of frontline workers
- Easy setup of Managed Home Screen on dedicated devices in multi-app kiosk mode

## Delegated user management through My Staff

Azure Active Directory (Azure AD) provides the ability to delegate user management to frontline managers through the [My Staff portal](../roles/my-staff-configure.md), helping save valuable time and reduce risks. By enabling simplified password resets and phone management directly from the store or factory floor, managers can grant access to employees without routing the request through the help-desk, IT, or operations.

![Delegated user management in the My Staff portal](media/concept-fundamentals-flw/delegated-user-manage.png)

## Accelerated onboarding with simplified authentication

My Staff also enables frontline managers to register their team members' phone numbers for [SMS sign-in](../authentication/howto-authentication-sms-signin.md). In many verticals, frontline workers maintain a local username and password combination, a solution that is often cumbersome, expensive, and error-prone. When IT enables authentication using SMS sign-in, frontline workers can log in with [single sign-on (SSO)](../manage-apps/what-is-single-sign-on.md) for Microsoft Teams and other apps using just their phone number and a one-time passcode (OTP) sent via SMS. This makes signing in for frontline workers simple and secure, delivering quick access to the apps they need most.

![SMS sign-in](media/concept-fundamentals-flw/sms-signin.png)

## Secure offboarding of frontline workers from shared devices

Many companies use shared devices so frontline workers can do inventory management and point-of-sale transactions, without the IT burden of provisioning and tracking individual devices. With shared device sign-out, it's easy for a frontline worker to securely sign out of all apps on any shared device before handing it back to a hub or passing it off to a teammate on the next shift. Microsoft Teams, that is currently supported on shared devices, allows workers to view tasks that are assigned to them, and even have secure voice communication through the walkie-talkie capability in Teams. Once a worker signs out of a shared device, Intune and Azure AD clear all of the company data so the device can safely be handed off to the next associate. You can choose to integrate this capability into all your line-of-business [iOS](../develop/msal-ios-shared-devices.md) and [Android](../develop/msal-android-shared-devices.md) apps using the [Microsoft Authentication Library](../develop/msal-overview.md).

![Shared device sign-out](media/concept-fundamentals-flw/shared-device-signout.png)

## Easy setup of Managed Home Screen on dedicated devices

Microsoft Endpoint Manager (MEM) customers using [Microsoft Intune](https://play.google.com/store/apps/details?id=com.microsoft.intune) can enroll their Android devices as Android Enterprise (AE) dedicated devices. These are corporate-owned devices that aren't associated with any particular user and are often used to complete specific tasks. The dedicated devices are enrolled with [Azure AD shared device mode](../develop/msal-shared-devices.md).

Managed Home Screen (MHS) is an Android application available for use through [Managed Google Play](/mem/intune/enrollment/connect-intune-android-enterprise). Companies use MHS when they want their end users to have access to a specific set of applications on their Intune-enrolled dedicated devices. When configured in multi-app kiosk mode in the MEM console, MHS is automatically launched as the default home screen on the device and appears to the end user as the only home screen. This configuration prevents devices from being misused and allows you to completely customize the home screen experience. Regardless of what is already installed on the device, you can pick which apps and system settings you want your users to access from MHS to ensure the content they access is relevant to their tasks. 

![Managed Home Screen](media/concept-fundamentals-flw/managed-home-screen.png)

Learn more on how to [configure the Microsoft Managed Home Screen app for Android Enterprise](/mem/intune/apps/app-configuration-managed-home-screen-app).
For detailed information, see [How to setup Microsoft Managed Home Screen on Dedicated devices in multi-app kiosk mode](https://techcommunity.microsoft.com/t5/intune-customer-success/how-to-setup-microsoft-managed-home-screen-on-dedicated-devices/ba-p/1388060).

## Next steps

- For more information on delegated user management, see [My Staff user documentation](../user-help/my-staff-team-manager.md).
- For inbound user provisioning from SAP SuccessFactors, see the tutorial on [configuring SAP SuccessFactors to Active Directory user provisioning](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md).
- For inbound user provisioning from Workday, see the tutorial on [configuring Workday for automatic user provisioning](../saas-apps/workday-inbound-tutorial.md).
