---
title: Troubleshoot Azure AD authentication strength
description: Learn how to resolve errors when using Azure AD authentication strength.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/26/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Troubleshoot Azure AD authentication strength

This topic covers errors you might see when you use Azure Active Directory (Azure AD) authentication strength and how to resolve them.  

## A user is getting prompted for additional authentication methods, but they don't see the methods I expect

To evaluate if a method can be used, we consider which authentication methods the user has registered and enabled for by the Authentication method policy. For more information, see [How Conditional Access Authentication strengths policies are used in combination with Authentication methods policy](concept-authentication-strengths.md#how-conditional-access-authentication-strengths-policies-are-used-in-combination-with-authentication-methods-policy).

To verify if a method can be used:

1. Check which authentication strength is required. Click **Security** > **Authentication methods** > **Authentication strengths**. 
1. Check if the user is enabled for a required method:
   1. First, check the unified Authentication methods policy. See if the user is enabled for any method required by authentication strength. Click **Security** > **Authentication methods** > **Policies**.
   1. If you use the legacy Authentication methods policy, check if the tenant is enabled for any method required for the authentication strength. Click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**. 
1. Check which authentication methods are registered for the user in the Authentication methods policy. Click **Users and groups** > _username_ > **Authentication methods**. 

If the user is registered for an enabled method that meets the authentication strength, they might need to use another method that isn't available after primary authentication, such as Windows Hello for Business or certificate-based authentication. For more information, see [How each authentication method works](concept-authentication-methods.md#how-each-authentication-method-works). The user will need to restart the session and choose **Sign-in options** and select a method required by the authentication strength.

## A user is blocked from accessing a resource

If authentication strength requires a method a user can’t use (for example, they are not enabled for the method in the unified authentication method policy), the user is blocked from sign-in.

Follow the steps outlined in the [previous question](/troubleshoot-authentication-strengths.md#a-user-is-prompted-to-use-a-different-authentication-method-but-they-dont-see-how-to-register-that-method) to identify which method the user is required to use by authentication strengths, and which method the user is enabled for by the unified authentication method policy. 


## How to check which authentication strength was enforced during sign-in
Use the **Sign-ins** log to find additional information about the sign-in: 

- Under the **Authentication details** tab, check the **Requirement** column will indicate the name of the authentication strengths policy.

  :::image type="content" source="media/troubleshoot-authentication-strengths/sign-in-logs-authentication-details.png" alt-text="Screenshot showing the authentication strength in the Sign-ins log.":::

- Under the **Conditional Access** tab, you can see which Conditional Access policy was applied. Click the name of the policy, and look under **Grant control** for the authentication strength that was enforced. 

  :::image type="content" source="media/troubleshoot-authentication-strengths/AuthStrengthsCASignInLogs.png" alt-text="Screenshot showing the authentication strength under "Conditional Access Policy details" in the Sign-ins log.":::

## My users can't use their FIDO2 key to sign in
An admin can restrict access to specific security keys. When a user tries to sign in by using a key they can't use, this **You can't get there from here** message appears. The user has to restart the session, and sign-in with a different FIDO2 security key.

:::image type="content" border="true" source="./media/troubleshoot-authentication-strengths/restricted-security-key.png" alt-text="Screenshot of a sign-in error when using a restricted FIDO2 security key.":::

## During sign-in, a user is asked to register a new authentication method. When the user is in the combined registration – they are unable to register the method.

Some methods cannot be registered during sign-in or require additional configuration outside of the combined registration. For more information see [Registering authentication methods](concept-authentication-strengths.md#registering-authentication-methods]
 
:::image type="content" border="true" source="./media/troubleshoot-authentication-strengths/MySecInfo-RegisterFIDO2.png" alt-text="Screenshot of a sign-in error when they are unable to register the method."::: 

## Next steps

- [Azure AD Authentication Strengths overview](concept-authentication-strengths.md)
