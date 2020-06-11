---
title: itsme OpenID Connect with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with itsme OIDC using client_secret user flow policy. Itsme is a digital ID app. It allows you to log in securely without card-readers, passwords, two-factor authentication, and multiple PIN codes.
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

# Tutorial for configuring itsme OpenID Connect with Azure Active Directory B2C

In this tutorial, learn how to integrate Azure AD B2C authentication with itsme OIDC using client_secret user flow policy. Itsme is a digital ID app. It allows you to log in securely without card-readers, passwords, two-factor authentication, and multiple PIN codes. Itsme provides a strong customer authentication with a verified identity.

## Prerequisites 

To get started, you need the following items: 

- An Azure B2C tenant 

- Your itsme provided ClientID aka PartnerCode 

- Your itsme provided ServiceCode 

- Your client secret for your itsme account 

## Onboard with itsme

1. To create an account with itsme, visit Itsme at Azure Marketplace.

2. Get your itsme account activated via onboarding@itsme.be

3. Step 2 will provide you a **Partner code** and **Service code** that will be needed in your B2C setup.

4. After activation of your itsme partner account you will receive an email with a onetime link to the client_secret.

5. Follow instructions available at [itsme](https://business.itsme.be/en) to complete the configuration.

## Integrate itsme OIDC with Azure AD B2C

### Set up a new Identity Provider in Azure AD B2C

1. Open the B2C tenant and under Manage select **Identity providers**.

2. Select **New OpenId Connect Provider**.

3. Fill in the form with the following information

|Property | Value |
|:------------ |:------- |
| Name | itsme |
| Metadata URL | https://oidc.{environment}.itsme.services/clientsecret-oidc/csapi/v0.1/.well-known/openid-configuration whereby {Environment} is either “e2e” (test environment) or “prd” (production)  |
| ClientID     | *Your ClientId aka PartnerCode*  |
| Client Secret | *Your Client Secret* |
| Scope  | openid service:YOURSERVICECODE profile email [phone] [address]  |
|Response Type | code |
|Response MOde | query |
|Domain Hint | *You can leave this empty* |
|UserID | sub |
|Display Name | name |
|Given name | given_name |
|Surname | family_name |
|Email | email|

4. Select **Save**.

### Configure a User Flow

1. Open the B2C tenant and select under Policies **User flows**. 

2. Select **New user flow**. 

3. Choose **sign up and sign in**. 

4. Choose a **name**, in the identity providers section select **itsme** > **Create**. 

5. Open the newly created flow by selecting the **name** > **Properties**. 
Adjust the following values:

   a. Access & ID token lifetimes (minutes): **5** 

   b. Refresh token sliding window lifetime: **No expiry**

### Register an application

1. Open the B2C tenant and under Manage select **App registrations** > **New registration**.

3. Provide a name for the application and enter your redirect URL. For testing purposes, use https://jwt.ms 

4. Make sure multifactor authentication is **Disabled**. 

5. Select **Register**.

   a. For testing purposes, select **Authentication**, and under Implicit Grant, select **Access Tokens** > **ID Tokens**.  

   b. Select **Save**.

## Test the user flow 

1. Open the B2C tenant and under Policies select **User flows**. 

2. Select your previously created User flow. 

3. Select **Run user flow** 

   a. Application: *select the registered app* 

   b. Reply URL: *select the redirect URL*

4. The itsme **Identify yourself** page will appear.  

5. Enter your mobile phone number and select **send**.

6. Confirm the action in the itsme app.

## Next steps

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)