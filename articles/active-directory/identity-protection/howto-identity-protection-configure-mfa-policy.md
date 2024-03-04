---
title: Configure the MFA registration policy - Azure Active Directory Identity Protection
description: Learn how to configure the Azure AD Identity Protection multifactor authentication registration policy.

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
# How To: Configure the Azure AD multifactor authentication registration policy

Azure Active Directory (Azure AD) Identity Protection helps you manage the roll-out of Azure AD multifactor authentication (MFA) registration by configuring a Conditional Access policy to require MFA registration no matter what modern authentication app you're signing in to.

## What is the Azure AD multifactor authentication registration policy?

Azure AD multifactor authentication provides a means to verify who you are using more than just a username and password. It provides a second layer of security to user sign-ins. In order for users to be able to respond to MFA prompts, they must first register for Azure AD multifactor authentication.

We recommend that you require Azure AD multifactor authentication for user sign-ins because it:

- Delivers strong authentication through a range of verification options.
- Plays a key role in preparing your organization to self-remediate from risk detections in Identity Protection.

For more information on Azure AD multifactor authentication, see [What is Azure AD multifactor authentication?](../authentication/howto-mfa-getstarted.md)

## Policy configuration

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** > **Security** > **Identity Protection** > **MFA registration policy**.
   1. Under **Assignments** > **Users**
      1. Under **Include**, select **All users** or **Select individuals and groups** if limiting your rollout.
      1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. **Enforce Policy** - **On**
1. **Save**

## User experience

Azure AD Identity Protection will prompt your users to register the next time they sign in interactively and they'll have 14 days to complete registration. During this 14-day period, they can bypass registration if MFA isn't required as a condition, but at the end of the period they'll be required to register before they can complete the sign-in process.

For an overview of the related user experience, see:

- [Sign-in experiences with Azure AD Identity Protection](concept-identity-protection-user-experience.md).  

## Next steps

- [Enable sign-in and user risk policies](howto-identity-protection-configure-risk-policies.md)
- [Enable Azure AD self-service password reset](../authentication/howto-sspr-deployment.md)
- [Enable Azure AD multifactor authentication](../authentication/howto-mfa-getstarted.md)
