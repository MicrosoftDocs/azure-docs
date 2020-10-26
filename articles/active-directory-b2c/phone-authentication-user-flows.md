---
title: Set up the local account identity provider
titleSuffix: Azure AD B2C
description: Define the identity types you can use (email, username, phone number) for local account authentication when you set up user flows in your Azure Active Directory B2C tenant.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/29/2020
ms.author: mimart
ms.subservice: B2C
---

# Set up phone authentication for user flows (preview)

> [!NOTE]
> The phone authentication feature is in public preview.

In addition to email and username, you can enable phone number as a sign-up option tenant-wide by adding phone authentication to your local account identity provider. After you enable phone authentication for local accounts, you can add phone sign-up to your user flows.

Multi-factor authentication (MFA) is disabled by default when you configure a user flow with phone sign-up. You can enable MFA in user flows with phone sign-up, but because a phone number is used as the primary identifier, email one-time passcode is the only option available for the second authentication factor.

## Configure the local account identity provider

A consumer account is the local account created in your Azure AD B2C directory when someone signs up for your application using an email, username, or phone number (preview). You can define which of these identity types your local account will support tenant-wide. Then you can specify one of these supported types when you set up an individual user flow. When a user completes the user flow, your Azure AD B2C **Local account** identity provider authenticates their information.

Email sign-up is enabled by default in your local account identity provider settings. You can change the identity types you'll support in your tenant by selecting or deselecting email sign-up, username, or phone number.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.

3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

4. Under **Manage**, select **Identity providers**.

5. In the identity provider list, select **Local account**.

   ![Identity providers select Local account](media/identity-provider-local-account/identity-provider-local-account.png)

1. In the **Configure local IDP** page, select the allowable identity types consumers can use to create their local accounts in your Azure AD B2C tenant:
   
   - **Phone** (Preview): Users will be prompted for a phone number, which will be verified at sign-up and become their user id.
   - **Email**: Users will be prompted for an email address, which will be verified at sign-up and become their user id.
   - **Username**: Users may create their own unique user id. An email address will be collected from the user and verified.

   ![Select the allowed identity types](media/identity-provider-local-account/configure-local-idp.png)

1. Select **Save**.

## Example: Select phone sign-up in a user flow

After you've added phone sign-up as an identity option for local accounts, you can add it to user flows as long as they're the latest **Recommended** user flow versions. The following is an example showing how to add phone sign-up to new user flows. But you can also add phone sign-up to existing Recommended-version user flows (select **User Flows** > *user flow name* > **Identity providers** > **Local Account Phone signup**). 

Here's an example showing how to add phone sign-up to a new user flow.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

    ![B2C tenant, Directory and Subscription pane, Azure portal](./media/identity-provider-local-account/directory-subscription-pane.png)

3. In the Azure portal, search for and select **Azure AD B2C**.
4. Under **Policies**, select **User flows**, and then select **New user flow**.

    ![User flows page in portal with New user flow button highlighted](./media/identity-provider-local-account/signup-signin-user-flow.png)

5. On the **Create a user flow** page, select the **Sign up and sign in** user flow.

    ![Select a user flow page with Sign up and sign in flow highlighted](./media/identity-provider-local-account/select-user-flow-type.png)

6. Under **Select a version**, select **Recommended**, and then select **Create**. ([Learn more](user-flow-versions.md) about user flow versions.)

    ![Create user flow page in Azure portal with properties highlighted](./media/identity-provider-local-account/select-version.png)

7. Enter a **Name** for the user flow. For example, *signupsignin1*.
8. In the **Identity providers** section, under **Local accounts**, select **Phone signup**.

   ![User flow phone signup option selected](media/identity-provider-local-account/user-flow-phone-signup.png)

9. Under **Social identity providers**, select any other identity providers you want to allow for this user flow.

   > [!NOTE]
   > Multi-factor authentication (MFA) is disabled by default. You can enable MFA for a phone sign-up user flow, but because a phone number is used as the primary identifier, email one-time passcode is the only option available for the second authentication factor.

1. In the **User attributes and token claims** section, choose the claims and attributes that you want to collect and send from the user during sign-up. For example, select **Show more**, and then choose attributes and claims for **Country/Region**, **Display Name**, and **Postal Code**. Click **OK**.

1. Click **Create** to add the user flow. A prefix of *B2C_1* is automatically prepended to the name.

## Enable recovery email prompt for phone sign up and sign in (Preview)

Recovery email enables you to show or hide recovery email prompt when your users signs up or signs in. This feature helps enable scenarios such as when you want to have a back-up email available for your users in the event that they don’t have their phone during sign up or sign in.

### Prerequisites

You will need to have enabled phone sign up as outlined above.

Set recovery email prompt

In the user flow Properties, you can enable recovery email prompt.

Select “on” to show the recovery email prompt during both sign up and sign in, and “off” to hide the recovery email prompt during both sign up and sign in.
You can use Run user flow to verify the experience. Confirm that:
-	When recovery email is “on,” the user who is signing up for the first time is asked to verify a back up email, or a user who has not provided a recovery email before is now asked to verify a back up email during next sign in.
-	When recovery email is “off,” the user who is signing up or signing in is not shown the recovery email prompt.
 Please note that the email used for recovery cannot be used for signing in and will only be used for recovery purposes.


## Next steps

- [Add external identity providers](tutorial-add-identity-providers.md)
- [Create a user flow](tutorial-create-user-flows.md)