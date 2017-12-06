---
title: Test drive an Azure AD B2C desktop application | Microsoft Docs
description: Test drive sign in, sign up, edit profile, and reset password user journeys using a test Azure AD B2C environment
services: active-directory-b2c
documentationcenter: .net
author: saraford
manager: krassk
editor: PatAltimore

ms.assetid: 86293627-26fb-4e96-a76b-f263f9a945bd
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 10/31/2017
ms.author: saraford

---
# Test drive a desktop application configured with Azure AD B2C

Azure Active Directory B2C provides cloud identity management to keep your application, business, and customers protected.  This quickstart uses a sample Windows Presentation Foundation (WPF) desktop app to demonstrate:

* Using the **Sign Up or Sign In** policy to create or sign in with a social identity provider or a local account using an email address. 
* **Calling an API** to retrieve your display name from an Azure AD B2C secured resource.

## Prerequisites

* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
    - **.NET desktop development**

* A social account from either Facebook, Google, Microsoft, or Twitter. If you don't have a social account, a valid email address is required.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

[Download or clone the sample application](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop) from GitHub.

## Run the app in Visual Studio

In the sample application project folder, open the `active-directory-b2c-wpf.sln` solution in Visual Studio. 

Select **Debug > Start Debugging** to build and run the application. 

## Create an account

Click **Sign in** to start the **Sign Up or Sign In** workflow. When creating an account, you can use an existing social identity provider account or an email account.

![Sample application](media/active-directory-b2c-quickstarts-desktop-app/wpf-sample-application.png)

### Sign up using a social identity provider

To sign up using a social identity provider, click the button of the identity provider you want to use. If you prefer to use an email address, jump to the [Sign up using an email address](#sign-up-using-an-email-address) section.

![Sign In or Sign Up provider](media/active-directory-b2c-quickstarts-desktop-app/sign-in-or-sign-up-wpf.png)

You need to authenticate (sign-in) using your social account credentials and authorize the application to read information from your social account. By granting access, the application can retrieve profile information from the social account such as your name and city. 

![Authenticate and authorize using a social account](media/active-directory-b2c-quickstarts-desktop-app/twitter-authenticate-authorize-wpf.png)

Your new account profile details are pre-populated with information from your social account. Modify the details if you wish and click **Continue**.

![New account sign-up profile details](media/active-directory-b2c-quickstarts-desktop-app/new-account-sign-up-profile-details-wpf.png)

You have successfully created a new Azure AD B2C user account that uses an identity provider. After sign-in, the access token is shown in the *Token info* text box. The access token is used when accessing the API resource.

![Authorization token](media/active-directory-b2c-quickstarts-desktop-app/twitter-auth-token.png)

Next step: [Jump to Edit your profile](#edit-your-profile) section.

### Sign up using an email address

If you choose to not use a social account to provide authentication, you can create an Azure AD B2C user account using a valid email address. An Azure AD B2C local user account uses Azure Active Directory as the identity provider. To use your email address, click the **Don't have an account? Sign up now** link.

![Sign In or Sign Up using email](media/active-directory-b2c-quickstarts-desktop-app/sign-in-or-sign-up-email-wpf.png)

Enter a valid email address and click **Send verification code**. A valid email address is required to receive the verification code from Azure AD B2C.

Enter the verification code you receive in email and click **Verify code**.

Add your profile information and click **Create**.

![Sign up with new account using email](media/active-directory-b2c-quickstarts-desktop-app/sign-up-new-account-profile-email-wpf.png)

You have successfully created a new Azure AD B2C local user account. After sign-in, the access token is shown in the *Token info* text box. The access token is used when accessing the API resource.

![Authorization token](media/active-directory-b2c-quickstarts-desktop-app/twitter-auth-token.png)

## Edit your profile

Azure Active Directory B2C provides functionality to allow users to update their profiles. Click **Edit profile** to edit the profile you created.

![Edit profile](media/active-directory-b2c-quickstarts-desktop-app/edit-profile-wpf.png)

Choose the identity provider associated with the account you created. For example, if you used Twitter as the identity provider when you created your account, choose Twitter to modify the associated profile details.

![Choose provider associated with profile to edit](media/active-directory-b2c-quickstarts-desktop-app/edit-account-choose-provider-wpf.png)

Change your **Display name** or **City**. 

![Update profile](media/active-directory-b2c-quickstarts-desktop-app/update-profile-wpf.png)

A new access token is displayed in the *Token info* text box. If you want to verify the changes to your profile, copy and paste the access token into the token decoder https://jwt.ms.

![Authorization token](media/active-directory-b2c-quickstarts-desktop-app/twitter-auth-token.png)

## Access a resource

Click **Call API** to make a request to the Azure AD B2C secured resource https://fabrikamb2chello.azurewebsites.net/hello. 

![Call API](media/active-directory-b2c-quickstarts-desktop-app/call-api-wpf.png)

The application includes the access token displayed in the *Token info* text box in the request. The API sends back the display name contained in the access token.

## Next steps

The next step is to create your own Azure AD B2C tenant and configure the sample to run using your tenant. 

> [!div class="nextstepaction"]
> [Create an Azure Active Directory B2C tenant in the Azure portal](active-directory-b2c-get-started.md)
