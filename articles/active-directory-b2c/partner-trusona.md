---
title: Trusona and Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how to add Trusona as an Identity Provider on Azure AD B2C to enable passwordless authentication.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/08/2020
ms.author: mimart
ms.subservice: B2C
---

# Tutorial for integrating Trusona and Azure Active Directory B2C

Trusona is an ISV provider. It allows you to log in securely and enables passwordless authentication, multi-factor authentication, and digital license scanning. In this tutorial, you'll learn how to add Trusona as an Identity Provider on Azure AD B2C to enable passwordless authentication.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A [trial account](https://www.twilio.com/try-twilio) at Twilio

## Scenario description

There are multiple components, which create the solution. 

- Azure AD B2C combined sign in and sign up policy 

- Adding Trusona as an identity provider.  

- Trusona App downloaded 

    ![Trusona architecture diagram](media/partner-trusona/trusona-architecture-diagram.png)

1. User requests to sign in to or sign up with the application. The user is authenticated via the Azure AD B2C sign up and sign in policy. At sign up the user's previously verified email address from the Trusona App is used.

2. Azure B2C redirects the user to the Trusona OIDC ID provider using the implicit flow. 

3. For Desktop PC based logins, Trusona displays a unique, stateless, animated, and dynamic QR code for scanning with the Trusona app. For mobile based logins, Trusona uses a "deep link" to open the Trusona app. These two methods are used for device and ultimately user discovery, to answer the question "who is knocking on the door?" 

4. The user scans the displayed QR code with the Trusona app.

5. The user's account is found in the Trusona cloud service and the authentication is prepared. 

6. The Trusona cloud service issues an authentication challenge to the user via a push notification sent to the Trusona app. 

   a. The user is prompted with the authentication challenge.

   b. The user chooses to accept or reject the challenge.

   c. The user is asked to use OS security (for example, biometric, passcode, PIN, or pattern) to confirm and sign the challenge with a private key in the Secure Enclave/Trusted Execution environment.

   d. The Trusona app generates a dynamic anti-replay payload based on the parameters of the authentication, in real-time.

   e. The entire response is signed (for a second time) by a private key in the Secure Enclave/Trusted Execution environment and returned to the Trusona cloud service for verification.

7. The Trusona cloud service redirects the user back to the initiating application with an id_token. Azure AD B2C verifies the id_token using Trusona's published OpenID configuration as configured during identity provider setup.

## Onboarding with Trusona

1. Fill-out the [form](https://www.trusona.com/aadb2c) to create a Trusona account and get started. 

2. Download the Trusona mobile app from the app store. Install the app and register your email.

3. Verify your email through the secure magic link sent by the software.  

4. Go to [Trusona Developer’s dashboard](dashboard.trusona.com) for self-service.

5. Select **I’m Ready** and authenticate yourself with your Trusona app.

6. From the left navigation panel, choose **OIDC Integrations**.

7. Select **Create OpenID Connect Integration**.

8. Provide a **Name** of your choice and use the domain information previously provided (for example, Contoso) in the **Client Redirect Host field**.  

> [!NOTE]
> Azure Active Directory’s initial domain name is used as the Client Redirect host.

9. Follow the instructions mentioned in the [Trusona integration guide](https://docs.trusona.com/integrations/aad-b2c-integration/). Use the initial domain name (for example, Contoso) referred in the previous section when prompted.  

## Integrating Trusona with Azure AD B2C

### Creating an Azure Active Directory B2C tenant

> [!NOTE]
> If you already have a B2C tenant set-up, skip these steps.  

1. Select **Dashboard** from the sidebar.

2. In the search bar, enter **Azure Active Directory B2C**.  

3. Select **Create a new Azure Active Directory B2C Tenant** from the dropdown.  

4. Enter **Organization name** and **Initial Domain Name**.

5. Select the **Create** button.

> [!NOTE]
> It may take a few minutes for the tenant to be created.

### Adding a new Identity provider

1. Navigate to **Dashboard** > **Azure Active Directory B2C** > **Identity providers**

2. Select **Identity providers**

3. Select **Add**

### Configuring an Identity provider  

1. Select **Identity provider type** > **OpenID Connect (Preview)**

2. Fill-out the form below to set up the identity provider  

| Property | Value  |
| :--- | :--- |
| Metadata URL | `https://gateway.trusona.net/oidc/.well-known/openid-configuration`|
| Client ID | Will be emailed to you from Trusona |
| Scope | OpenID profile email |
| Response type | Id_token |
| Response mode  | Form_post |

3. Select **Ok**.  

4. Select **Map this identity provider’s claims**.  

5. Fill-out the form below to map the identity provider  

| Property | Value  |
| :--- | :--- |
| UserID | Sub  |
| Display name | nickname |
| Given name | given_name |
| Surname | Family_name |
| Response mode | email |

6. Select **Ok** to complete the setup for your new OIDC Identity Provider.

### Creating a user flow policy

1. You should now see Trusona as a **new OpenID Connect Identity Provider** listed within your B2C Identity Providers.

2. Select **User flows (policies)** from the left navigation panel.

3. Select **Add** > **New user flow** > **Sign up and sign in**

### Configuring the Policy

1. Name your policy

2. Select your newly created **Trusona Identity Provider**.

3. As Trusona is inherently multi-factor, it's best to leave multi-factor authentication disabled.

4. Select **Create**.

5. Under **User Attributes and Claims**, choose **Show more**. In the form, select at least one attribute that you specified during the setup of your Identity Provider in earlier section.

6. Select **OK**.  

### Testing the Policy

1. Select your newly created policy

2. Select **Run user flow**

3. In the form, enter the Replying URL

4. Then select **Run user flow** button and you should be redirected to the Trusona OIDC gateway. On the Trusona gateway, scan the displayed Secure QR code with the Trusona app or with a custom app using the Trusona mobile SDK.

5. After scanning the Secure QR code, you should be redirected to the Reply URL you defined in step 3.

## Additional resources  

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
