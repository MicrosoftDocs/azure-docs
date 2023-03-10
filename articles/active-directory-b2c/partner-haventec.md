---
title: Configure Haventec Authenticate with Azure Active Directory B2C for single-step multi-factor passwordless authentication
titleSuffix: Azure AD B2C
description: Learn to integrate Azure AD B2C with Haventec Authenticate for multifactor passwordless authentication
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/10/2023
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Haventec Authenticate with Azure Active Directory B2C for single-step, multi-factor passwordless authentication

Learn to integrate Azure Active Directory B2C (Azure AD B2C) with Haventec Authenicate, a passwordless technology that eliminates passwords, shared secrets, and friction.

To learn more, go to haventec.com: [Haventec](https://www.haventec.com/)

## Scenario description

The Authenticate integration includes the following components:

* **Azure AD B2C** - authorization server that verifies user credentials
  * Also known as the identity provider (IdP)
* **Web and mobile applications** - Open ID Connect (OIDC) mobile or web applications protected by Authenticate and Azure AD B2C
* Haventec Authenticate service - external IdP for the Azure AD B2C tenant

The following diagram illustrates sign-up and sign-in user flows in the Haventec Authenticate integration.

   ![Diagram of sign-up and sign-in user flows in the Haventec Authenticate integration.](media/partner-haventec/partner-haventec-architecture-diagram.png)

1. User selects sign-in or sign-up and enters a username.
2. The application sends user attributes to Azure AD B2C for identity verification.
3. Azure AD B2C collects user attributes and sends them to Haventec Authenticate.
4. For new users, Authenticate sends push notification to the user mobile device. It can send email with a one-time password (OTP) for device registration.
5. User responds and is granted or denied access. New cryptographic keys are pushed to the user device for a future session.

## Get started with Authenticate

Go to the haventec.com [Get a demo of Haventec Authenticate](https://www.haventec.com/products/get-started) page. In the personalized demo request form, indicate your intereste in Azure AD B2C integration. An email arrives when the demo environment is ready.  

## Integrate Authenticate with Azure AD B2C

Use the following instructions to prepare for and integrate Azure AD B2C with Authenicate. 

### Prerequisites

To get started, you need:

* An Azure AD subscription
  * If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* An Azure AD B2C tenant linked to the Azure subscription
  * see, [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md)
* A Haventec Authenticate demo environment
  * See, [Get a demo of Haventec Authenticate](https://www.haventec.com/products/get-started)

### Create an application registration in Haventec

If you haven't already done so, [register](tutorial-register-applications.md) a web application.

### Part - 2 Add a new Identity provider in Azure AD B2C

1. Sign in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.

4. Navigate to **Dashboard** > **Azure Active Directory B2C** > **Identity providers**.

5. Select **New OpenID Connect Provider**.

6. Select **Add**.

### Part - 3 Configure an Identity provider

To configure an identity provider, follow these steps:

1. Select **Identity provider type** > **OpenID Connect**

2. Fill out the form to set up the Identity provider:

   | Property | Value|
   |:--------------|:---------------|
   |Name  |Enter Haventec or a name of your choice|
   |Metadata URL| `https://iam.demo.haventec.com/auth/realms/*your\_realm\_name*/.well-known/openid-configuration`|
   |Client ID | The application ID from the Haventec admin UI captured in Part - 1 |
   |Client Secret | The application Secret from the Haventec admin UI captured in Part - 1 |
   |Scope | OpenID email profile|
   |Response type | Code |
   |Response mode | forms_post |
   |Domain hint | Blank |

3. Select **OK**.

4. Select **Map this identity provider's claims**.

5. Fill out the form to map the Identity provider:

   | Property | Value|
   |:--------------|:---------------|
   | User ID | From subscription |
   | Display name | From subscription |
   | Given name | given_name |
   | Surname | family_name |
   | Email | Email |

6. Select **Save** to complete the setup for your new OIDC Identity provider.

## Create a user flow policy

You should now see Haventec as a new OIDC Identity provider listed within your B2C identity providers.

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.

2. Select **New user flow**.

3. Select **Sign up and sign in** > **version** > **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created Haventec Identity provider.

6. Select **None** for Local Accounts to disable email and password-based authentication.

7. Select **Run user flow**

8. In the form, enter the Replying URL, for example, `https://jwt.ms`

9. The browser will be redirected to the Haventec login page

10. User will be asked to register if new or enter a PIN for an existing user.

11. Once the authentication challenge is accepted, the browser will redirect the user to the replying URL.

## Test the user flow

Open the Azure AD B2C tenant and under Policies select **User flows**.

1. Select your previously created **User Flow**.

2. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the redirect URL

   c. Select **Run user flow**.

3. Go through sign-up flow and create an account

4. Haventec Authenticate will be called during the flow.

## Additional resources

For additional information, review the following articles:

- [Haventec](https://docs.haventec.com/) documentation

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](custom-policy-get-started.md?tabs=applications)
