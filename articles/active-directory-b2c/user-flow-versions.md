---
title: User flow versions in Azure Active Directory B2C  
description: Learn about the versions of user flows available in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 08/17/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# User flow versions in Azure Active Directory B2C

User flows in Azure Active Directory B2C (Azure AD B2C) help you to set up common [policies](user-flow-overview.md) that fully describe customer identity experiences. These experiences include sign-up, sign-in, password reset, or profile editing. The tables below describe the user flows that are available in Azure AD B2C.

> [!IMPORTANT]
> We've changed the way we reference user flow versions. Previously, we offered V1 (production-ready) versions, and V1.1 and V2 (preview) versions. Now, we've consolidated user flows into two versions:
>
>- **Recommended** user flows are the generally available, next-generation user flows with the latest features. They combine all the features of the legacy **V1**, **V1.1**, and **V2** versions. Going forward, **Recommended** user flows will be maintained and updated. Once you move to these new recommended user flows, you'll have access to new features as they're released.
>- **Standard (Legacy)** user flows, previously known as **V1**, are legacy user flows. Unless you have a specific business need, we don't recommend using these versions of user flows because they won't be maintained or updated.
>
>In the public cloud, all legacy preview user flows (V1.1 and V2) are deprecated. *These changes apply to the Azure public cloud only. Other environments will continue to use [legacy user flow versioning](user-flow-versions-legacy.md).*

## Recommended user flows

Recommended user flows are the generally available, next-generation user flows with the latest features. Going forward, Recommended user flows will be maintained and updated.

| User flow | Description |
| --------- | ----------- |
| Password reset | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Age gating](age-gating.md)</li><li>[password complexity requirements](password-complexity.md)</li></ul> |
| Profile editing | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](age-gating.md)</li><li>Sign-in page customization</li></ul> |
| Sign up | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Age gating](age-gating.md)</li><li>[Password complexity requirements](password-complexity.md)</li></ul> |
| Sign up and sign in | Enables a user to create an account or sign in their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Age gating](age-gating.md)</li><li>[Password complexity requirements](password-complexity.md)</li></ul> |

## Standard user flows

Standard user flows (previously referred to as V1) user flows, previously known as **V1**, are legacy user flows. Unless you have a specific business need, we don't recommend using these versions of user flows because they won't be updated going forward.

| User flow | Description |
| --------- | ----------- |
| Password reset | Enables a user to choose a new password after verifying their email. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>Token compatibility settings</li><li>[Password complexity requirements](password-complexity.md)</li></ul> |
| Profile editing | Enables a user to configure their user attributes. Using this user flow, you can configure: <ul><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li></ul> |
| Sign in | Enables a user to sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>Block sign-in</li><li>Force password reset</li><li>Keep Me Signed In (KMSI)</ul><br>You can't customize the user interface with this user flow. |
| Sign up | Enables a user to create an account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](password-complexity.md)</li></ul> |
| Sign up and sign in | Enables a user to create an account or sign in to their account. Using this user flow, you can configure: <ul><li>[Multi-factor authentication](multi-factor-authentication.md)</li><li>[Token lifetime](tokens-overview.md)</li><li>Token compatibility settings</li><li>Session behavior</li><li>[Password complexity requirements](password-complexity.md)</li></ul>|


## How to switch to a Recommended user flow

To switch from a legacy version of a user flow to the **Recommended** version, follow these steps:

1. Create a new user flow policy by following the steps in [Tutorial: Create user flows in Azure AD B2C](tutorial-create-user-flows.md). While creating the user flow, select the **Recommended** version.

3. Configure your new user flow with the same settings that were configured in the legacy policy.

4. Update your application sign-in URL to the newly created policy.

5. After you've tested the user flow and confirmed it's working, delete the legacy user flow by following these steps:
   1. In the Azure AD B2C tenant overview menu, select **User flows**.
   2. Find the user flow you want to delete.
   3. In the last column, select the context menu (**...**) and then select **Delete**.

## Frequently asked questions

### Can I still create legacy V2 and V1.1 user flows?

You won't be able to create new user flows based on the legacy V2 and V1.1 versions, but you can continue to read, update, and delete any legacy V2 and V1.1 user flow you're using currently.

### Is there any reason to continue using legacy V2 and V1.1 user flows?

Not really. The **Recommended** versions contain the same functionality as the legacy V2 and V1.1 versions. Nothing has been removed, and in fact they now include additional features.

### If I don’t switch from legacy V2 and V1.1 policies, how will it impact my application?

If you're using a legacy V2 or V1.1 user flow, your application won't be affected by this versioning change. But to get access to new features or policy changes going forward, you'll need to switch to the **Recommended** versions.

### Will Microsoft still support my legacy V2 or V1.1 user flow policy?

In the public cloud, all legacy preview user flows (V1.1 and V2) are deprecated. *These changes apply to the Azure public cloud only. Other environments will continue to use [legacy user flow versioning](user-flow-versions-legacy.md).*
