---
title: Troubleshooting Azure AD authentication strength
description: Learn how to resolve errors when using Azure AD authentication strength.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/26/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Troubleshooting Azure AD authentication strength

This topic covers errors you might see when you use Azure Active Directory (Azure AD) authentication strength and how to resolve them.  

## A user is prompted to use a different authentication method, but they don’t see how to register the method

To evaluate if a method can be used, we consider which authentication methods the user has registered and enabled. For more information, see [How Conditional Access Authentication strengths policies are used in combination with Authentication methods policy](concept-authentication-strengths.md#how-conditional-access-authentication-strengths-policies-are-used-in-combination-with-authentication-methods-policy).

To verify if a method can be used:

1. Check which authentication strength is required. Click **Security** > **Authentication methods** > **Authentication strengths**. 
1. Check if the user is enabled for a required method:
   1. If you use the new Authentication methods policy, check if the user is enabled for any method required for the authentication strength. Click **Security** > **Authentication methods** > **Policies**.
   1. If you use the legacy Authentication methods policy, check if the tenant is enabled for any method required for the authentication strength. Click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**. 
1. Check which authentication methods are registered for the user in the Authentication methods policy. Click **Users and groups** > _username_ > **Authentication methods**. 

If the user is registered for the method and the method is enabled, they might need to use an authentication method that isn't available post primary authentication, such as Windows Hello for Business or certificate-based authentication. For more information, see [How each authentication method works](concept-authentication-methods.md#how-each-authentication-method-works). The user will need to restart the session and choose **Sign-in options** and select a method required by the authentication strength.

## How to check which authentication strength was enforced during sign-in

Use the sign-in logs to find additional information about the sign-in: 
-	Under the “Authentication details” tab, requirement column will indicate the name of the authentication strengths policy.
:::image type="content" source="media/concept-authentication-strengths/Sign-in%20Logs%20-%20authentication%20details.png" alt-text="Screenshot showing the phishing-resistant MFA strength policy definition.":::
-	Under the “Conditional Access” tab you can see which Conditional Access policy applied. Clicking on the name of the policy, under grant control you will find the name of the authentication strengths policy that was enforced. 


 
## User sign in error when using a restricted FIDO2 security key
An admin can restrict access to specific security keys. When a user tries to sign in by using a key they are not allowed to use, a **You can't get there from here** error appears:

:::image type="content" border="true" source="./media/troubleshoot-authentication-strengths/restricted-security-key.png" alt-text="Screenshot of a sign-in error when using a restricted FIDO2 security key.":::

In this case, the user need to restart the session and sign-in with a different FIDO2 secuirty key.


## Next steps

- [Azure AD Authentication Strengths overview](concept-authentication-strengths.md)
