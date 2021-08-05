---
title: Tutorial to configure Azure Active Directory B2C with Nok Nok
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with Nok Nok S3 to provide FIDO certified multifactor authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/04/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Nok Nok S3 authentication suite with Azure Active Directory B2C

In this sample tutorial, learn how to integrate the Nok Nok S3 authentication suite into your Azure Active Directory (AD) B2C tenant. [Nok Nok](https://noknok.com/) enables FIDO certified multifactor authentication such as FIDO UAF, FIDO U2F, WebAuthn, and FIDO2 for mobile and web applications. Using Nok Nok customers can improve their security posture while balancing user experience.

## Prerequisites

To get started, you'll need:

- An Azure subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- Get a free Nok Nok [trial tenant](https://noknok.com/products/strong-authentication-service/).

## Scenario description

To enable passwordless FIDO authentication to your users, enable Nok Nok as an Identity provider to your Azure AD B2C tenant. The Nok Nok integration includes the following components:

- **Azure AD B2C** – The authorization server, responsible for verifying the user’s credentials.

- **Web and mobile applications** – Your mobile or web applications that you choose to protect with Nok Nok and Azure AD B2C.

- **The Nok Nok app SDK or Nok Nok Passport app** – Applications used to authenticate Azure AD B2C enabled applications. These applications are available on [Apple app store](https://apps.apple.com/us/app/nok-nok-passport/id1050437340) and [Google play store](https://play.google.com/store/apps/details?id=com.noknok.android.passport2&hl=en&gl=US).

The following architecture diagram shows the implementation. Nok Nok is acting as an Identity provider for Azure AD B2C using Open ID Connect (OIDC) to enable passwordless authentication.

![image shows the architecture diagram of nok nok and azure ad b2c](./media/partner-noknok/nok-nok-architecture-diagram.png)

| Step | Description |
|:------|:-----------|
| 1. | User arrives at a login page. Users select sign-in/sign-up and enter the username |
| 2. | Azure AD B2C redirects the user to the Nok Nok OIDC authentication provider. |
| 3a. | For mobile based authentications, Nok Nok either displays a QR code or sends a push notification request to the end user’s mobile device. |
| 3b. | For Desktop/PC based login, Nok Nok redirects the end user to the web application login page to initiate a passwordless authentication prompt. |
|4a. | The user scan’s the displayed QR code in their smartphone using Nok Nok app SDK or Nok Nok Passport app.|
| 4b. | User provides username as an input on the login page of the web application and selects next. |
| 5a. | User is prompted for authentication on smartphone. <BR> User does passwordless authentication by using the user’s preferred method, such as biometrics, device PIN, or any roaming authenticator.|
| 5b. | User is prompted for authentication on web application. <BR> User does passwordless authentication by using the user’s preferred method, such as biometrics, device PIN, or any roaming authenticator. |
| 6. | Nok Nok server validates FIDO assertion and upon validation, sends OIDC authentication response to Azure AD B2C.|
| 7. | Based on the response user is granted or denied access. |

## Onboard with Nok Nok

Fill out the [Nok Nok cloud form](support@noknok.com) to create your own Nok Nok tenant. Once you submit the form, you'll receive an email explaining how to access your tenant. The email will also include access to Nok Nok guides. Follow the instructions provided in the Nok Nok integration guide to complete the OIDC configuration of your Nok Nok cloud tenant.

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

To configure an Identity provider, follow these steps:

1. Select **Identity provider type** > **OpenID Connect (Preview)**
2. Fill out the form to set up the Identity provider:

   |Property | Value |
   |:-----| :-----------|
   | Name   | Nok Nok Authentication Provider |
   | Metadata URL | Insert the URI of the hosted Nok Nok Authentication app, followed by the specific path such as 'https://demo.noknok.com/mytenant/oidc/.well-known/openid-configuration' |
   | Client Secret | Use the client Secret provided by the Nok Nok platform.|
   | Client ID | Use the client ID provided by the Nok Nok platform.|
   | Scope | OpenID profile email |
   | Response type | code |
   | Response mode | form_post|

3. Select **OK**.

4. Select **Map this identity provider’s claims**.

5. Fill out the form to map the Identity provider:

   |Property | Value |
   |:-----| :-----------|
   | UserID    | From subscription |
   | Display name | From subscription |
   | Response mode | From subscription |

6. Select **Save** to complete the setup for your new OIDC Identity provider.

### Create a user flow policy

You should now see Nok Nok as a new OIDC Identity provider listed within your B2C identity providers.

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.

2. Select **New** user flow.

3. Select **Sign up and sign in**, select a **version**, and then select **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created Nok Nok Identity provider.

6. Set up the parameters of your User flow. Insert a name and select the Identity provider you’ve created. You can also add email address. In this case, Azure won’t redirect the login procedure directly to Nok Nok instead it will show a screen where the user can choose the option they would like to use.

7. Leave the **Multi-factor Authentication** field as is.

8. Select **Enforce conditional access policies**

9. Under **User attributes and token claims**, select **Email Address** in the Collect attribute option. You can add all the attributes that Azure AD can collect about the user alongside the claims that Azure AD B2C can return to the client application.

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

5. Nok Nok will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
