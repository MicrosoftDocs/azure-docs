---
title: Tutorial to configure Azure Active Directory B2C with BlokSec
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with BlokSec for Passwordless authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 5/15/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Azure Active Directory B2C with BlokSec for Passwordless authentication

In this sample tutorial, learn how to integrate Azure Active Directory (AD) B2C authentication with BlokSec. BlokSec is a decentralized identity platform that provides organizations with true passwordless authentication, tokenless multi-factor authentication, and real-time consent-based services. BlokSec’s Decentralized-Identity-as-a-Service (DIaaS)™ platform provides a frictionless and secure solution to protect websites and mobile apps, web-based business applications, and remote services. In addition, it eliminates the need of passwords, and simplifies the end-user login process. BlokSec  protects customers against identity-centric cyber-attacks such as password stuffing, phishing, and man-in-the-middle attacks.  

With Azure AD B2C as an identity provider, you can integrate BlokSec with any of your customer applications to provide true passwordless authentication and real-time consent-based authorization to your users.  

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that's linked to your Azure subscription.

- A BlokSec [trial account](https://bloksec.com/).

## Scenario description

BlokSec integration includes the following components:

- **Azure AD B2C** – Configured as the authorization server/identity provider for any B2C application  

- **BlokSec Decentralized Identity Router** – Acts as a gateway for services that wish to apply BlokSec’s DIaaS™ to route authentication/authorization requests to end users’ Personal Identity Provider (PIdP) applications; configured as an OpenID Connect (OIDC) identity provider in Azure AD B2C 

- **BlokSec SDK-based mobile app** – Acts as the users’ PIdP in the decentralized authentication scenario. The freely downloadable BlokSec yuID application can be used if your organization prefers not to develop your own mobile applications using the BlokSec SDKs.

The following architecture diagram shows the implementation.

![Image show the architecture of an Azure AD B2C integration with BlokSec](./media/partner-bloksec/partner-bloksec-architecture-diagram.png)

| Steps | Description |
|:-------|:---------------|
| 1. | User attempts to log in to an Azure AD B2C application and is forwarded to Azure AD B2C’s combined sign-in and sign-up policy.|
| 2. | Azure AD B2C redirects the user to the BlokSec decentralized identity router using the OIDC authorization code flow.|
| 3. | The BlokSec decentralized router sends a push notification to the user’s mobile app including all context details of the authentication and authorization request.|
| 4. | The user reviews the authentication challenge; if accepted the user is prompted for biometry such as fingerprint or facial scan as available on their device, proving the user’s identity.|
| 5. | The response is digitally signed with the user’s unique digital key. Final authentication response provides proof of possession, presence, and consent. The respond is returned to the BlokSec decentralized identity router.|
| 6. | The BlokSec decentralized identity router verifies the digital signature against the user’s immutable unique public key stored in a distributed ledger, then replies to Azure AD B2C with the authentication result.|
| 7 | Based on the authentication result user is granted/denied access|

## Onboard to BlokSec

1. Request a demo tenant with BlokSec by filling out [the form](https://bloksec.com/request-a-demo/); in the message field indicates that you would like to onboard with Azure AD B2C.  

2. Download and install the free BlokSec yuID mobile app from the app store.

3. Once your demo tenant has been prepared, you will receive an email. On your mobile device where the BlokSec application is installed, select the link to register your admin account with your yuID app.

## Integrate with Azure AD B2C

### Part - 1 Create an application registration in BlokSec

1. Sign in to the BlokSec admin portal; a link will be included as part of your account registration email received when you onboard to BlokSec.

2. On the main dashboard, select **Add Application** > **Create Custom**

3. Complete the application details as follows and submit:

   | Property | Value |
   |:----------------|:--------------------|
   | Name |  Azure AD B2C/your desired application name|
   | SSO Type | OpenID Connect (OIDC) |
   | Logo URI |  https://bloksec.io/assets/AzureB2C.png/ a link to the image of your choice |
   | Redirect URIs | Leave this field blank |
   |Post log out redirect URIs | Leave this field blank |

4. Once saved, select the newly created Azure AD B2C application to open the application configuration

5. Select **Generate App Secret**

>[!NOTE]
>Application ID and Application Secret will be needed later to configure the Identity provider in Azure AD B2C.

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
   |Name  |Enter BlokSec yuID – Passwordless/a name of your choice|
   |Metadata URL| https://api.bloksec.io/oidc/.well-known/openid-configuration|
   |Client ID | The application ID from the BlokSec admin UI captured in Part - 1 |
   |Client Secret | The application Secret from the BlokSec admin UI captured in Part - 1 |
   |Scope | OpenID email profile|
   |Response type | Code |
   |Domain hint | yuID |

3. Select **OK**.

4. Select **Map this identity provider’s claims**.

5. Fill out the form to map the Identity provider:

   | Property | Value|
   |:--------------|:---------------|
   | User ID | From subscription |
   | Display name | From subscription |
   | Given name | given_name |
   | Surname | family_name |
   | Email | email |

6. Select **Save** to complete the setup for your new OIDC Identity provider.

## User registration

1. Sign in to BlokSec Admin console with the credential provided earlier

2. Navigate to Azure AD B2C application that was created above, select the gear icon at the top-right, and then select **Create Account**

3. Enter the user’s information in the Create Account form, making note of the Account Name, and select **Submit**

4. The user will receive an **account registration email** at the provided email address

5. Have the user follow the registration link on the mobile device where the BlokSec yuID app is installed

## Create a user flow policy

You should now see BlokSec as a new OIDC Identity provider listed within your B2C identity providers.

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.

2. Select **New user flow**.

3. Select **Sign up and sign in** > **version** > **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created BlokSec Identity provider.

6. Select **None** for Local Accounts to disable email and password-based authentication.

7. Select **Run user flow**

8. In the form, enter the Replying URL, for example, https://jwt.ms 

9. The browser will be redirected to the BlokSec login page

10. Enter the account name registered during User registration

11. The user will receive a push notification to their mobile device where the BlokSec yuID application is installed; upon opening the notification, the user will be presented with an authentication challenge

12. Once the authentication challenge is accepted, the browser will redirect the user to the replying URL.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
