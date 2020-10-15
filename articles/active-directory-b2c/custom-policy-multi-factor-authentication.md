---
title: Multi-Factor Authentication in Azure Active Directory B2C | Microsoft Docs
description: How to enable Multi-Factor Authentication in consumer-facing applications secured by Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/15/2020
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
---

# Enable multi-factor authentication in Azure Active Directory B2C

Azure Active Directory B2C (Azure AD B2C) integrates directly with [Azure Multi-Factor Authentication](../active-directory/authentication/multi-factor-authentication.md) so that you can add a second layer of security to sign-up and sign-in experiences in your applications. You enable multi-factor authentication without writing a single line of code. If you already created sign up and sign-in user flows, you can still enable multi-factor authentication.

This feature helps applications handle scenarios such as the following:

- You don't require multi-factor authentication to access one application, but you do require it to access another. For example, the customer can sign into an auto insurance application with a social or local account, but must verify the phone number before accessing the home insurance application registered in the same directory.
- You don't require multi-factor authentication to access an application in general, but you do require it to access the sensitive portions within it. For example, the customer can sign in to a banking application with a social or local account and check the account balance, but must verify the phone number before attempting a wire transfer.

## Set multi-factor authentication

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Use the **Directory + subscription** filter in the top menu to select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to enable MFA. For example, *B2C_1_signinsignup*.
1. Select **Properties**.
1. In the **Multifactor authentication** section, select the desired **MFA method**, and then under **MFA enforcement** select **Always on**, or **[Conditional](conditional-access-user-flow.md) (Recommended)**. For Conditional, create a [Conditional Access policy](conditional-access-identity-protection-setup.md) policy, and specify the apps you want the policy to apply to. 
1. Select Save. MFA is now enabled for this user flow.

You can use **Run user flow** to verify the experience. Confirm the following scenario:

A customer account is created in your tenant before the multi-factor authentication step occurs. During the step, the customer is asked to provide a phone number and verify it. If verification is successful, the phone number is attached to the account for later use. Even if the customer cancels or drops out, the customer can be asked to verify a phone number again during the next sign-in with multi-factor authentication enabled.



