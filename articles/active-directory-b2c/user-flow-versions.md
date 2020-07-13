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

User flows in Azure Active Directory B2C (Azure AD B2C) help you to set up common [policies](user-flow-overview.md) that fully describe customer identity experiences. These experiences include sign-up, sign-in, password reset, or profile editing. The tables below describe the user flows that are available in Azure AD B2C.

> [!IMPORTANT]
> We've changed the way we reference user flow versions. Previously, we offered V1 (production-ready) versions, and V1.1 and V2 (preview) versions. Now, we've consolidated user flows into two versions:
>
>- **Recommended** user flows are the new preview versions of user flows. They're thoroughly tested and combine all the features of the **V2** and **V1.1** versions. Going forward, these versions will be maintained and updated. Once you move to these new recommended user flows, you'll have access to new features as they're released.
>- **Standard** user flows, previously known as **V1**, are generally available, production-ready user flows. If your user flows are mission-critical and depend on highly stable versions, you can continue to use standard user flows, realizing that these versions won't be maintained and updated.
>
>All legacy preview user flows (V1.1 and V2) are on a path to deprecation by **August 1, 2021**. Wherever possible, we highly recommend that you [switch](#how-do-i-switch-from-v2-to-the-new-preview-policies) to the new **Recommended** versions as soon as possible so you can always take advantage of the latest features and updates.

## Recommended user flows

These are thoroughly-tested, preview user flows that include new features.

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset (preview) | No | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Age gating](basic-age-gating.md)</li><li>[password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing (preview) | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in (preview) | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>Sign-in page customization</li></ul> |
| Sign up (preview) | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in (preview) | No | Enables a user to create an account or sign in their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Age gating](basic-age-gating.md)</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |

## Standard user flows

These user flows (previously referred to as V1) are stable and production-ready.

| User flow | Recommended | Description |
| --------- | ----------- | ----------- |
| Password reset | Yes | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Profile editing | Yes | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in | No | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>Block sign-in</li><li>Force password reset</li><li>Keep Me Signed In (KMSI)</ul><br>You can't customize the user interface with this user flow. |
| Sign up | No | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul> |
| Sign up and sign in | Yes | Enables a user to create an account or sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](custom-policy-multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](user-flow-password-complexity.md)</li></ul>|

## Frequently asked questions

### What happened to the V1, V1.1, and V2 versions?

To simplify version selection, we now offer two versions of user flows. The V1 versions are now referred to as **Standard** user flows. The V1.1 and V2 user flows have been combined and updated, and are now referred to as **Recommended** user flows. By offering a consolidated, recommended preview version of a user flow, we can add new features as they become available instead of creating a new version.

### Can I create new user flows?

Creating new preview user flows will no longer supported. But you can continue to read, update, and delete any V2 and V1.1 user flow you're currently using.

### Is there any reason to continue using V2 user flows?

Not really. The new **Recommended** preview versions contain the same functionality as the V2 versions. Nothing has been removed, and in fact they now include additional features.

### If I don’t switch from V2 policies, how will it impact my application?

If you're using a V2 user flow, your application won't be affected by this versioning change. But to get access to new features or policy changes going forward, you'll need to switch to the new **Recommended** versions.

### Will Microsoft still support my user flow V2 policy?

The V2 versions of user flows will continue to be fully supported.

### How do I switch from V2 to the new Preview policies?

Switch to the new **Recommended** preview version of a user flow with these steps:

1. Create a new user flow policy by following the steps in [Tutorial: Create user flows in Azure Active Directory](tutorial-create-user-flows.md) and
2. Select the **Recommended** version.
3. Use the same settings that were configured in the older policy
5. Update your application sign-in URL to the newly created policy.
6. Once you've testing the user flow and confirmed it's working, delete the existing v2 or V1.1 user flow.
