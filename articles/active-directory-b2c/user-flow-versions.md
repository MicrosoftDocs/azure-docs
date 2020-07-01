---
title: User flow versions in Azure Active Directory B2C | Microsoft Docs
description: Learn about the versions of user flows available in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/25/2019
ms.author: mimart
ms.subservice: B2C
---

# User flow versions in Azure Active Directory B2C

User flows in Azure Active Directory B2C (Azure AD B2C) help you to set up common [policies](user-flow-overview.md) that fully describe customer identity experiences. These experiences include sign-up, sign-in, password reset, or profile editing. 

> [!IMPORTANT]
> We've changed the way we reference user flow versions. Previously, we maintained three versions: V1 (recommended user flows), and V2 and V1.1 (preview user flows). Now you can choose a user flow, and select from either the **Recommended** version or the **Preview** version of that user flow.

The tables below describe the user flows that are available in Azure AD B2C. Each user flow is available either of the following versions:

- 
- **Preview** user flows are stable, preview-quality versions that let you try out new features. These user flows replace the previous V2 and V1.1 versions.

You can read, update, and delete these user flows, but creating user flows isn't supported.

## Recommended user flows

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset | Yes | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>Block sign-in</li><li>Force password reset</li><li>Keep Me Signed In (KMSI)</ul><br>You can't customize the user interface with this user flow. |
| Sign up | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in | Yes | Enables a user to create an account or sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul>|

## Preview user flows

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset (preview) | No | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Age gating](basic-age-gating.md)</li><li>[password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing (preview) | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in (preview) | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>Sign-in page customization</li></ul> |
| Sign up (preview) | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in (preview) | No | Enables a user to create an account or sign in their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |

## Frequently asked questions

### What happened to the V1 versions?

We've changed the way we reference user flow versions. Previously, we maintained three versions: V1 (recommended user flows), and V2 and V1.1 (preview user flows). Now you can choose a user flow, and select from either the **Recommended** version or the **Preview** version of that user flow. **Recommended** user flows, previously referred to as V1, are the thoroughly tested and production-ready versions of user flows.

### What happened to the V2 and V1.1 versions?

To simplify version selection, we now offer two versions of user flows: **Recommended** (production-ready and generally available) and **Preview** (so you can try out new features). The V2 and V1.1 versions have been removed and replaced with more stable preview versions that combine the features of V2 and V1.1. By offering a consolidated preview version, we can add new features to a user flow as they become available instead of creating new versions.

### Can I create new user flows?

You can continue to read, update, and delete existing V2 and V1.1 user flows, but creating user flow is no longer supported.  

### Is there any reason to continue using V2 user flows?

Not really. The new preview versions contain the same functionality as the V2 versions. Nothing has been removed. In fact, they now include additional features.

### What if I don’t move from V2 policies; will it impact my application?

Your application won't be affected by this change in user flow versioning. But note that the only way for you to get access to new features or policy changes is through the new **Preview** versions.

### Will Microsoft still support my user flow V2 policy?

The V2 versions of user flows are fully supported by Azure AD B2C.

### How do I switch from V2 to the new Preview policies?

1. Create a new user flow Preview policy by following the steps in [Tutorial: Create user flows in Azure Active Directory](tutorial-create-user-flows.md).
2. Replicate the configuration from the older policy to the newly created Preview policy.
3. Update your application sign-in URL to the newly created policy
4. Once confirmed it is working OK, delete existing v2 or V1.1 user flow
