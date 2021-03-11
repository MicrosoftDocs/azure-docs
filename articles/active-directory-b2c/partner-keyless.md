---
title: Tutorial for configuring Keyless with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Tutorial for configuring Keyless with Azure Active Directory B2C for passwordless authentication 
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 1/17/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Keyless with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to configure Azure Active Directory (AD) B2C with [Keyless](https://keyless.io/). With Azure AD B2C as an Identity provider, you can integrate Keyless with any of your customer applications to provide true passwordless authentication to your users.

Keyless's solution **Keyless Zero-Knowledge Biometric (ZKB™)** provides passwordless multifactor authentication that eliminates fraud, phishing, and credential reuse – all while enhancing customer experience and protecting their privacy.

## Pre-requisites

To get started, you'll need:

- An Azure subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md). Tenant must be linked to your Azure subscription.

- A Keyless cloud tenant, get a free [trial account](https://keyless.io/go).

- The Keyless Authenticator app installed on your user’s device.

## Scenario description

The Keyless integration includes the following components:

- Azure AD B2C – The authorization server, responsible for verifying the user’s credentials, also known as the identity provider.

- Web and mobile applications – Your mobile or web applications that you choose to protect with Keyless and Azure AD B2C.

- The Keyless mobile app – The Keyless mobile app will be used for authentication to the Azure AD B2C enabled applications.

The following architecture diagram shows the implementation.

![Image shows Keyless architecture diagram](./media/partner-keyless/keyless-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. Users select sign-in/sign-up and enters the username
| 2. | The application sends the user attributes to Azure AD B2C for identity verification.
| 3. | Azure AD B2C collects the user attributes and sends the attributes to Keyless to authenticate the user through the Keyless mobile app.
| 4. | Keyless sends a push notification to the registered user's mobile device for a privacy-preserving authentication in the form of a facial biometric scan.
| 5. | After the user responds to the push notification, the user is either granted or denied access to the customer application based on the verification results.

## Integrate with Azure AD B2C

### Add a new Identity provider

To add a new Identity provider, follow these steps:

1. Sign in to the **[Azure portal](https://portal.azure.com/#home)** as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter on the top menu and choosing the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.

4. Navigate to **Dashboard** > **Azure Active Directory B2C** >  **Identity providers**

5. Select **Identity providers**.

6. Select **Add**.

### Configure an Identity provider

To configure an identity provider, follow these steps:

1. Select **Identity provider type** > **OpenID Connect (Preview)**
2. Fill out the form to set up the Identity provider:

   |Property | Value |
   |:-----| :-----------|
   | Name   | Keyless |
   | Metadata URL | Insert the URI of the hosted Keyless Authentication app, followed by the specific path such as 'https://keyless.auth/.well-known/openid-configuration' |
   | Client Secret | The secret associated with the Keyless Authentication instance - not same as the one configured before. Insert a complex string of your choice. This secret will be used later in the Keyless Container configuration.|
   | Client ID | The ID of the client. This ID will be used later in the Keyless Container configuration.|
   | Scope | openid |
   | Response type | id_token |
   | Response mode | form_post|

3. Select **OK**.

4. Select **Map this identity provider’s claims**.

5. Fill out the form to map the Identity provider:

   |Property | Value |
   |:-----| :-----------|
   | UserID    | From subscription |
   | Display name | From subscription |
   | Response mode | From subscription |

6. Select **Save** to complete the setup for your new Open ID Connect (OIDC) Identity provider.

### Create a user flow policy

You should now see Keyless as a new OIDC Identity provider listed within your B2C identity providers.

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.

2. Select **New** user flow.

3. Select **Sign up and sign in**, select a **version**, and then select **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created Keyless Identity Provider.

6. Set up the parameters of your User flow. Insert a name and select the Identity provider you’ve created. You can also add email address. In this case, Azure won’t redirect the login procedure directly to Keyless instead it will show a screen where the user can choose the option they would like to use.

7. Leave the **Multi-factor Authentication** field as is.

8. Select **Enforce conditional access policies**

9. Under **User attributes and token claims**, select **Email Address** in the Collect attribute option. You can add all the attributes that Azure Active Directory can collect about the user alongside the claims that Azure AD B2C can return to the client application.

10. Select **Create**.

11. After a successful creation, select your new **User flow**.

12. On the left panel, select **Application Claims**. Under options, tick the **email** checkbox and select **Save**.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select Identity Experience Framework.

2. Select your previously created SignUpSignIn.

3. Select Run user flow and select the settings:

   a. Application: select the registered app (sample is JWT)

   b. Reply URL: select the redirect URL

   c. Select Run user flow.

4. Go through sign-up flow and create an account

5. Keyless will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](./custom-policy-get-started.md?tabs=applications)