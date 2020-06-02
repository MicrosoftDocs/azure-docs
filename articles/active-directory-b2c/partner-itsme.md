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

## Onboarding with itsme

1. To create an account with itsme, visit: Itsme at Azure Marketplace.

2. Get your itsme account activated via onboarding@itsme.be

3. Step 2 will provide you a **Partner code** and **Service code** that will be needed in your B2C setup.

4. After activation of your itsme partner account you’ll receive an email with a onetime link to the client_secret.

5. Follow instructions available at [itsme](https://business.itsme.be/en) to complete the configuration.

## Configuring itsme OIDC with Azure AD  

### Configuring custom IDP

1. Open the B2C tenant, search for Azure AD B2C and select **Identity providers**.

2. Select **New OpenID Connect provider**

3. Fill in the form with the following information. The {environment} is typically e2e (test environment) or prd (production).

| Property | Value  |
| :--- | :--- |
| Name | Itsme|
| Metadata URI | `https://oidc.{Environment}.itsme.services/clientsecret-oidc/csapi/v0.1/.well-known/openid-configuration`|
|Client ID  | The ClientId also known as PartnerCode |
| Client Secret | The generated secret in the onboarding |
| Scope | Openid service: YOURSERVICECODE email profile phone address |
| Response Type | code |
| Response Mode | query |
| Domain Hint | _You can leave this empty_|
| User ID | sub |
| Display Name | name |
| Given Name | given_name |
| Surname | family_name |
| Email | email |

### Configure a User Policy

1. Open the B2C tenant and choose **User flow (policies)** on the left navigation panel.

2. Select **Create a user flow**  

3. Choose **Sign up and sign in**

4. Give a name, select the identity provider itsme, and enable the attributes and claims you want to use.

5. Select **Create**

6. **Disable** multi-factor authentication option

7. Select **Off** for JavaScript enforcing page layout (preview)

8. Open the newly created flow, go to **Properties**, and change following values:

|Property | Value |
|:--- |:--- |
| Access & ID toke lifetimes (minutes) | 5 |
| Refresh token sliding window lifetime | No expiry |
| Claim representing user flow | acr |
| Webapp session timeout | Rolling |
| Single sign-on configuration  | Tenant |
|Require ID token in logout requests | No |

### Register an application

1. Open the B2C tenant and choose **App registrations (Preview)** on the left navigation panel.  

2. Select **New registration**

3. Provide a name for the application and a redirect URI  

4. Select **Register**

## Additional Resources

1. [Custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

2. [Get started with custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
