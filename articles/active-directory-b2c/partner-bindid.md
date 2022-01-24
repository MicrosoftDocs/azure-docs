---
title: Tutorial to configure Azure Active Directory B2C with BindID
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with BindID for true passwordless strong customer authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/24/2022
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure BindID with Azure Active Directory B2C

In this sample tutorial, learn how to integrate Azure AD B2C authentication with [BindID](https://www.transmitsecurity.com/bindid). BindID is a passwordless authentication service that uses strong FIDO2 biometric authentication for a reliable omni-channel authentication experience. The easy-to-integrate solution ensures a smooth login experience for all customers across every device and channel eliminating fraud, phishing, and credential reuse.

## Prerequisites

To get started, you will need:

- A BindID tenant. You can [sign up for free](https://www.transmitsecurity.com/developer?utm_signup=dev_hub#try)

- An Azure AD subscription. If you do not have one, get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) linked to your [Azure subscription](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant)

- If you have not already done so, [register a web application](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications).

- [Signing and encryption keys for your Identity Experience Framework](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#add-signing-and-encryption-keys-for-identity-experience-framework-applications)

- [Registered Identity Experience Framework applications](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started#register-identity-experience-framework-applications)

## Scenario description

The following architecture diagram shows the implementation.

![Screenshot for bindid-architecture-diagram](media/partner-bindid/partner-bindid-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. Users select sign-in/sign-up and enter username into the page.
| 2. | The application sends the user attributes to Azure AD B2C for identify verification.
| 3. | Azure AD B2C collects the user attributes and sends the attributes to BindID to authenticate the user through the BindID mobile app.
| 4. | BindID sends a push notification to the registered user mobile device for a Fast Identity Online (FIDO2) certified authentication. It can be a user finger print, biometric or decentralized pin.  
| 5. | After user acknowledges the push notification, user is either granted or denied access to the customer application based on the verification results.

## Onboard with BindID

To integrate BindID with your Azure AD B2C instance, you will need to configure an application in the [BindID Admin
Portal](https://admin.bindid-sandbox.io/console/). For more information, see [Getting started guide](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal). You can either create a new application or use one that you already created.

## Integrate BindID with Azure AD B2C

1. Go to the [Azure AD B2C BindID policy](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration/tree/main/custom-policies) in the Policy folder.

2. Follow [this document](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#custom-policy-starter-pack) to download [LocalAccounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts)

3. Configure the policy for the Azure AD B2C tenant.

>[!NOTE]
>Update the provided policies to relate to your specific tenant.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. BindID will be called during the flow, after user attribute is created. If the flow is incomplete, check that user is not saved in the directory.

## Additional resources

- [BindID Developer Hub](https://developer.bindid.io/)

- [Custom policies in Azure AD B2C
    B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C
    B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
