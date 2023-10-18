---
title: Configure the MFA registration policy - Microsoft Entra ID Protection
description: Learn how to configure the Microsoft Entra ID Protection multifactor authentication registration policy.

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 01/03/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# How To: Configure the Microsoft Entra multifactor authentication registration policy

Microsoft Entra ID Protection helps you manage the roll-out of Microsoft Entra multifactor authentication registration by configuring a Conditional Access policy to require MFA registration no matter what modern authentication app you're signing in to.

<a name='what-is-the-azure-ad-multifactor-authentication-registration-policy'></a>

## What is the Microsoft Entra multifactor authentication registration policy?

Microsoft Entra multifactor authentication provides a means to verify who you are using more than just a username and password. It provides a second layer of security to user sign-ins. In order for users to be able to respond to MFA prompts, they must first register for Microsoft Entra multifactor authentication.

We recommend that you require Microsoft Entra multifactor authentication for user sign-ins because it:

- Delivers strong authentication through a range of verification options.
- Plays a key role in preparing your organization to self-remediate from risk detections in Identity Protection.

For more information on Microsoft Entra multifactor authentication, see [What is Microsoft Entra multifactor authentication?](../authentication/howto-mfa-getstarted.md)

## Policy configuration

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security Administrator](../roles/permissions-reference.md#security-administrator)
1. Browse to **Protection** > **Identity Protection** > **MFA registration policy**.
   1. Under **Assignments** > **Users**
      1. Under **Include**, select **All users** or **Select individuals and groups** if limiting your rollout.
      1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. **Enforce Policy** - **On**
1. **Save**

## User experience

Microsoft Entra ID Protection will prompt your users to register the next time they sign in interactively and they'll have 14 days to complete registration. During this 14-day period, they can bypass registration if MFA isn't required as a condition, but at the end of the period they'll be required to register before they can complete the sign-in process.

For an overview of the related user experience, see:

- [Sign-in experiences with Microsoft Entra ID Protection](concept-identity-protection-user-experience.md).  

## Next steps

- [Enable sign-in and user risk policies](howto-identity-protection-configure-risk-policies.md)
- [Enable Microsoft Entra self-service password reset](../authentication/howto-sspr-deployment.md)
- [Enable Microsoft Entra multifactor authentication](../authentication/howto-mfa-getstarted.md)
