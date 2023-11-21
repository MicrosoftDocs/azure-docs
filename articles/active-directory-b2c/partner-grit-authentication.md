---
title: Configure Grit's biometric authentication with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how Grit's biometric authentication with Azure AD B2C secures your account

author: gargi-sinha
manager: martinco
ms.service: active-directory

ms.topic: how-to
ms.date: 1/25/2023
ms.author: gasinh
ms.reviewer: kengaderdus
ms.subservice: B2C 
---

# Configure Grit's biometric authentication with Azure Active Directory B2C

In this sample tutorial, learn how to integrate [Grit's](https://www.gritiam.com) Biometric authentication with Azure Active Directory B2C (Azure AD B2C). Biometric authentication provides  users the option to sign in using finger print, face ID or [Windows Hello](https://support.microsoft.com/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0). It works both on desktop and mobile applications, provided the device is capable of doing biometric authentication.

Biometric authentication has the following benefits:

1. For users who sign in infrequently or forget passwords often resulting in frequent password resets, biometric authentication reduces friction.

2. Compared to Multi-factor authentication (MFA), biometric authentication is cheaper and more secure.

3. Improved security prevents phishing attack for high valued customers.

4. Adds an additional layer of authentication before the user performs a high value operation like credit card transaction.

## Prerequisites

To get started, you'll need:

- License to [Grit's Visual IEF builder](https://www.gritiefedit.com/). Contact [Grit support](mailto:info@gritsoftwaresystems.com) for licensing details. For this tutorial you don't need a license.

- An Azure subscription. If you don't have one, get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

## Scenario description

In this tutorial, we'll cover the following scenario:

The end user creates an account with username and password (and MFA if needed). If their device supports biometric, they're enrolled in biometrics, and their account is linked to the biometric authentication of the device. Any future logins in that device, unless the user chooses not to, will happen through biometrics.

The user can link multiple devices to the same account. User will have to sign in through their email/password (and MFA if needed), they'll then be presented with an option to link a new device.

For example, user has an account with Contoso. User accesses the account from the computer at work that supports Windows Hello. User also accesses the account from the home computer that doesn't support Windows Hello and an Android phone.

1. After logging in with the work computer, user will be presented with an option to enroll in Windows Hello. If user chooses to do so, any future logins will happen through Windows Hello.

1. After logging in with the home computer, user won't be prompted to enroll in biometrics as the device doesn't support biometrics.

1. After logging in with the Android phone, user will be asked to enroll in biometrics. Any future logins will happen through biometrics.

Using Grit's visual flow chart multiple other scenarios can be implemented. Contact [Grit support](mailto:info@gritsoftwaresystems.com) to discuss your scenarios.

## Onboard with Grit's biometric authentication

Contact [Grit support](mailto:info@gritsoftwaresystems.com) for details to get onboarded.

### Configure Grit's biometric authentication with Azure AD B2C

1. Navigate to <https://www.gritiefedit.com> and enter your email if you're asked for it.

1. Press cancel in the quick start wizard.

1. In the pop-up, select **Customize User Journey**. Under Bio Metric, select the checkbox for **Enable Biometric**.

1. Scroll down and select **Generate template**, a flow chart appears.

1. From the left menu, select **Run Flowcharts** > **Deploy flow charts**.

1. If your device supports Windows Hello or biometric authenticator,
    select **Test Authentication Journey Builder** link, otherwise send
    the link to a device that supports biometric authentication.

1. A web page will open on a new tab. Under **Sign in with your social account**, select **createNewAccount**.

1. Go through the steps to create an account. When asked for **Setup Biometric Device sign in**, select **yes**.

1. Steps to perform the biometric depends on the device you are in.

1. A page appears that displays the token. Open the provided link.

1. This time the sign-in will happen through biometrics.

Repeat the same steps for another device. No need to sign up again, use the credentials created to sign in.

## Additional resources

- [Grit documentation](https://app.archbee.com/public/PREVIEW-ddjwV0RI2eVfcBOylxFGI/PREVIEW-bjH2arQd1Kn4le6z_zH84)

- [Configure the Grit IAM B2B2C solution with Azure AD B2C](partner-grit-iam.md)

- [Edit Azure AD B2C Identity Experience Framework (IEF) XML with Grit Visual IEF Editor](partner-grit-editor.md)

- [Migrate legacy apps to Azure AD B2C with Grit's app proxy](partner-grit-app-proxy.md)
