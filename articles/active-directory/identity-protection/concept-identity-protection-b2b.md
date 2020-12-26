---
title: Identity Protection and B2B users - Azure Active Directory
description: Using Identity Protection with B2B users how it works and known limitations

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 10/18/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Identity Protection and B2B users

With Azure AD B2B collaboration, organizations can enforce risk-based policies for B2B users using Identity Protection. These policies be configured in two ways:

- Administrators can configure the built-in Identity Protection risk-based policies, that apply to all apps, that include guest users.
- Administrators can configure their Conditional Access policies, using sign-in risk as a condition, that includes guest users.

## How is risk evaluated for B2B collaboration users

The user risk for B2B collaboration users is evaluated at their home directory. The real-time sign-in risk for these users is evaluated at the resource directory when they try to access the resource.

## Limitations of Identity Protection for B2B collaboration users

There are limitations in the implementation of Identity Protection for B2B collaboration users in a resource directory due to their identity existing in their home directory. The main limitations are as follows:

- If a guest user triggers the Identity Protection user risk policy to force password reset, **they will be blocked**. This block is due to the inability to reset passwords in the resource directory.
- **Guest users do not appear in the risky users report**. This loss of visibility is due to the risk evaluation occurring in the B2B user's home directory.
- Administrators **cannot dismiss or remediate a risky B2B collaboration user** in their resource directory. This loss of functionality is due to administrators in the resource directory not having access to the B2B user's home directory.

### Why can't I remediate risky B2B collaboration users in my directory?

The risk evaluation and remediation for B2B users occurs in their home directory. Due to this fact, the guest users do not appear in the risky users report in the resource directory and admins in the resource directory cannot force a secure password reset for these users.

### What do I do if a B2B collaboration user was blocked due to a risk-based policy in my organization?

If a risky B2B user in your directory is blocked by your risk-based policy, the user will need to remediate that risk in their home directory. Users can remediate their risk by performing a secure password reset in their home directory. If they do not have self-service password reset enabled in their home directory, they will need to contact their own organization's IT Staff to have an administrator manually dismiss their risk or reset their password.

### How do I prevent B2B collaboration users from being impacted by risk-based policies?

Excluding B2B users from your organization's risk-based Conditional Access policies will prevent B2B users from being impacted or blocked by their risk evaluation. To exclude these B2B users, create a group in Azure AD that contains all of your organization's guest users. Then, add this group as an exclusion for your built-in Identity Protection user risk and sign-in risk policies, as well as any Conditional Access policies that use sign-in risk as a condition.

## Next steps

See the following articles on Azure AD B2B collaboration:

- [What is Azure AD B2B collaboration?](../external-identities/what-is-b2b.md)