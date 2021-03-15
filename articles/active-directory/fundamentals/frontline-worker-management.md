---
title: Frontline Worker management - Azure Active Directory
description: Learn about Frontline Worker management capabilities that are provided via the My Staff portal.

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
# Frontline Worker management

Frontline workers account for over 80 percent of the global workforce. Yet because of high scale, rapid turnover, and fragmented processes, frontline workers often lack the tools to make their demanding jobs a little easier. Frontline Worker management brings digital transformation to the entire frontline workforce including managers, frontline workers, operations, and IT.

Frontline Worker management applies technology to enable the following three important aspects for the frontline workforce:
- Simple authentication mechanisms
- Seamless onboarding and off-boarding of frontline workers
- Easy provisioning of shared devices

## Delegated user management via My Staff

Azure Active Directory provides the ability to delegate user management to frontline managers through the [My Staff portal](../roles/my-staff-configure.md), helping save valuable time and reduce risks. By enabling simplified password resets and phone management directly from the store or factory floor, managers can grant access to employees without routing the request through the help-desk, IT, or operations.

![Delegated user management in the My Staff portal](media/concept-fundamentals-flw/delegated-user-manage.png)

## Accelerated onboarding with simplified authentication

My Staff also enables frontline managers to register their team members' phone numbers for SMS sign-in(link). In many verticals, frontline workers maintain a local username and password combination, a solution that is often cumbersome, expensive, and error-prone. When IT enables authentication using SMS sign-in, frontline workers can log in with single sign-on (SSO)(link) for Microsoft Teams and other apps using just their phone number and a one-time passcode (OTP) sent via SMS. This makes signing in for frontline workers simple and secure, delivering quick access to the apps they need most.

![SMS sign-in](media/concept-fundamentals-flw/sms-signin.png)

## Improved security for shared devices

Many companies used shared devices so frontline workers can do inventory management and point-of-sale transactions, without the IT burden of provisioning and tracking individual devices. With **shared device sign out**, it's easy for a frontline worker to securely sign out of all apps and web browsers on any shared device before handing it back to a hub or passing it off to a teammate on the next shift. You can choose to integrate this capability into all your line-of-business iOS(link) and Android(link) apps using the Microsoft Authentication Library(link).

![Shared device sign-out](media/concept-fundamentals-flw/shared-device-signout.png)

## Next steps

To get started, see the tutorial to [secure user sign-in events with Azure AD Multi-Factor Authentication](../authentication/tutorial-enable-azure-mfa.md).

For more information on licensing, see [Features and licenses for Azure AD Multi-Factor Authentication](../authentication/concept-mfa-licensing.md).
