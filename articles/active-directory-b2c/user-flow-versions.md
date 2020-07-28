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

User flows in Azure Active Directory B2C (Azure AD B2C) help you to set up common [policies](user-flow-overview.md) that fully describe customer identity experiences. These experiences include sign-up, sign-in, password reset, or profile editing. In Azure AD B2C, you can select from a collection of both recommended user flows and preview user flows.

New user flows are added as new versions. As user flows become stable, they'll be recommended for use. User flows are marked as **Recommended** if they've been thoroughly tested. User flows will be considered in preview until marked as recommended. Use a recommended user flow for any production application, but choose from other versions to test new functionality as it becomes available. You shouldn't use older versions of recommended user flows.

>[!IMPORTANT]
> Unless a user flow is identified as **Recommended**, it is considered to be in *preview*. You should use only recommended user flows for your production applications.

## V1

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset | Yes | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in using ROPC | No | Enables a user with a local account to sign in directly in native applications (no browser required). Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li></ul> |
| Sign in | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>Block sign-in</li><li>Force password reset</li><li>Keep Me Signed In (KMSI)</ul><br>You can't customize the user interface with this user flow. |
| Sign up | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in | Yes | Enables a user to create an account or sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul>|

## V1.1

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset v1.1 | No | Allows a user to choose a new password after verifying their email (new page layout available). Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |

## V2

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset v2 | No | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Age gating](basic-age-gating.md)</li><li>[password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing v2 | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in v2 | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>Sign-in page customization</li></ul> |
| Sign up v2 | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in v2 | No | Enables a user to create an account or sign in their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
