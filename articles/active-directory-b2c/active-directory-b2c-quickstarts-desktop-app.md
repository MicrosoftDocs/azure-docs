---
title: Test drive an Azure AD B2C enabled desktop app
description: Quickstart to try a sample ASP.NET desktop app that uses Azure Active Directory B2C to provide user login.
services: active-directory-b2c
author: PatAltimore
manager: mtillman

ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: quickstart
ms.custom: mvc
ms.date: 2/13/2018
ms.author: patricka

---
# Quickstart: Test drive an Azure AD B2C enabled desktop app

Azure Active Directory (Azure AD) B2C provides cloud identity management to keep your application, business, and customers protected. Azure AD B2C enables your apps to authenticate to social accounts, and enterprise accounts using open standard protocols.

In this quickstart, you use an Azure AD B2C enabled sample Windows Presentation Foundation (WPF) desktop app to sign in using a social identity provider and call an Azure AD B2C protected web API.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload. 
* A social account from either Facebook, Google, Microsoft, or Twitter.

## Download the sample

[Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop/archive/master.zip) or clone the sample web app from GitHub.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop.git
```

## Run the app in Visual Studio

In the sample application project folder, open the `active-directory-b2c-wpf.sln` solution in Visual Studio.

Press **F5** to debug the application.

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

## Clean up resources

You can use your Azure AD B2C tenant if you plan to try other Azure AD B2C quickstarts or tutorials. When no longer needed, you can [delete your Azure AD B2C tenant](active-directory-b2c-faqs.md#how-do-i-delete-my-azure-ad-b2c-tenant).

## Next steps

The next step is to create your own Azure AD B2C tenant and configure the sample to run using your tenant. 

> [!div class="nextstepaction"]
> [Create an Azure Active Directory B2C tenant in the Azure portal](active-directory-b2c-get-started.md)
