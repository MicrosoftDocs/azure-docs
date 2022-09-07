---
title: Troubleshooting Azure AD Authentication Strengths
description: Learn how to resolve errors when using Azure AD Authentication Strengths.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/26/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Troubleshooting Azure AD Authentication Strengths

This topic covers errors you might see when you use Azure Active Directory (Azure AD) Authentication Strengths and how to resolve them.  

### My user is getting prompted to use a different authentication method, but they don’t see the methods I expect

When evaluating which method a user can use, we consider the authentication methods users are enabled and registered for. Please refer to [How Conditional Access Authentication strengths policies are used in combination with Authentication methods policy](/articles/active-directory/authentication/concept-authentication-strengths.md#how-conditional-access-authentication-strengths-policies-are-used-in-combination-with-authentication-methods-policy) for more information.

To verify what methods the user is registered and enabled please do the following:
1.	Check which authentication methods are enabled by the Authentication strengths policy (Security > Authentication methods > Authentication strengths).
2.	Check which methods are enabled for the user:
a.	New authentication method policy (Security > Authentication methods > Policies): for each method in the Authentication strengths policy, check if the user is enabled as part of configured users.
b.	Legacy authentication methods policy (Under Security > Multifactor Authentication > Additional cloud-based multifactor authentication settings): Check if the method is enabled in the tenant.
3.	Check which methods the user has registered (Users and groups > Locate the user > authentication methods).

If the user is registered and enabled for the method, it is possible they need to use an authentication method that is not available post primary authentication, such as Windows Hello for Business or Certificate-based authentication. Please refer to [How each authentication method works](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-authentication-methods#how-each-authentication-method-works).

### I want to know which authentication strengths was enforced during sign-in

Use the sign-in logs to find additional information about the sign-in: 
-	Under the “Authentication details” tab, requirement column will indicate the name of the authentication strengths policy.
-	Under the “Conditional Access” tab you can see which Conditional Access policy applied. Clicking on the name of the policy, under grant control you will find the name of the authentication strengths policy that was enforced. 
 
### User sign in error when using a restricted FIDO2 security key
An admin can restrict access to specific security keys. When a user tries to sign in by using a key they are not allowed to use, a **You can't get there from here** error appears:

:::image type="content" border="true" source="./media/troubleshoot-authentication-strengths/restricted-security-key.png" alt-text="Screenshot of a sign-in error when using a restricted FIDO2 security key.":::

In this case, the user need to restart the session and sign-in with a different FIDO2 secuirty key.


## Next steps

- [Azure AD Authentication Strengths overview](concept-authentication-strengths.md)
