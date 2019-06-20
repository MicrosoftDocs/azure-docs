---
title: Sign in users and call the Microsoft Graph API from a .NET Desktop (WPF) app | Microsoft Docs
description: Learn how to build a .NET Windows Desktop application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth 2.0.
services: active-directory
documentationcenter: .net
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: ed33574f-6fa3-402c-b030-fae76fba84e1
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/21/2019
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to sign in users and call the Microsoft Graph API from a .NET Desktop (WPF) app.
ms.collection: M365-identity-device-management
---

# Quickstart: Sign in users and call the Microsoft Graph API from a .NET Desktop (WPF) app

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

For .NET native clients that need to access protected resources, Azure Active Directory (Azure AD) provides the Active Directory Authentication Library (ADAL). ADAL makes it easy for your app to get access tokens. 

In this quickstart, you'll learn how to build a .NET WPF To-Do List application that:

* Gets access tokens for calling the Azure AD Graph API using the OAuth 2.0 authentication protocol.
* Searches a directory for users with a given alias.
* Signs users out.

To build the complete, working application, you'll need to:

1. Register your application with Azure AD.
2. Install and configure ADAL.
3. Use ADAL to get tokens from Azure AD.

## Prerequisites

To get started, complete these prerequisites:

* [Download the app skeleton](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/complete.zip)
* Have an Azure AD tenant where you can create users and register an application. If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).

## Step 1: Register the DirectorySearcher application

To enable your app to get tokens, register your app in your Azure AD tenant and grant it permission to access the Azure AD Graph API:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, select your account and under the **Directory** list, choose the Active Directory tenant where you wish to register your application.
3. Select on **All services** in the left-hand nav, and choose **Azure Active Directory**.
4. On **App registrations**, choose **New registration**.
5. Follow the prompts to create a new client application.
    * **Name** is the application name and describes your application to end users.
    * Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
    * **Redirect URI** is a scheme and string combination that Azure AD uses to return token responses. Enter a value that is specific to your application (for example, `http://DirectorySearcher`) and is based on the previous redirect URI information. Also select **Public client (mobile and desktop)** from the dropdown. 

6. Once you've completed registration, AAD will assign your app a unique Application ID. You'll need this value in the next sections, so copy it from the application page.
7. From the **API permissions** page, select **Add a permission**. Inside **Select an API** select ***Microsoft Graph***.
8. Under **Delegated permissions**, select the permission **User.Read**, then hit **Add** to save. This permission sets up your application to query the Azure AD Graph API for users.

## Step 2: Install and configure ADAL

Now that you have an application in Azure AD, you can install ADAL and write your identity-related code. For ADAL to communicate with Azure AD, you need to provide it with some information about your app registration.

1. Begin by adding ADAL to the `DirectorySearcher` project using the Package Manager Console.

    ```
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```

1. In the `DirectorySearcher` project, open `app.config`.
1. Replace the values of the elements in the `<appSettings>` section to reflect the values you input into the Azure portal. Your code will reference these values whenever it uses ADAL.
   * The `ida:Tenant` is the domain of your Azure AD tenant, for example, contoso.onmicrosoft.com
   * The `ida:ClientId` is the client ID of your application you copied from the portal.
   * The `ida:RedirectUri` is the redirect URL you registered in the portal.

## Step 3: Use ADAL to get tokens from Azure AD

The basic principle behind ADAL is that whenever your app needs an access token, your app simply calls `authContext.AcquireTokenAsync(...)`, and ADAL does the rest.

1. In the `DirectorySearcher` project, open `MainWindow.xaml.cs`.
1. Locate the `MainWindow()` method. 
1. Initialize your app's `AuthenticationContext` - ADAL's primary class. `AuthenticationContext` is where you pass ADAL the coordinates it needs to communicate with Azure AD and tell it how to cache tokens.

    ```csharp
    public MainWindow()
    {
        InitializeComponent();

        authContext = new AuthenticationContext(authority, new FileCache());

        CheckForCachedToken();
    }
    ```

1. Locate the `Search(...)` method, which will be called when the user selects the **Search** button in the app's UI. This method makes a GET request to the Azure AD Graph API to query for users whose UPN begins with the given search term.
1. To query the Graph API, include an access_token in the `Authorization` header of the request, which is  where ADAL comes in.

    ```csharp
    private async void Search(object sender, RoutedEventArgs e)
    {
        // Validate the Input String
        if (string.IsNullOrEmpty(SearchText.Text))
        {
            MessageBox.Show("Please enter a value for the To Do item name");
            return;
        }

        // Get an Access Token for the Graph API
        AuthenticationResult result = null;
        try
        {
            result = await authContext.AcquireTokenAsync(graphResourceId, clientId, redirectUri, new PlatformParameters(PromptBehavior.Auto));
            UserNameLabel.Content = result.UserInfo.DisplayableId;
            SignOutButton.Visibility = Visibility.Visible;
        }
        catch (AdalException ex)
        {
            // An unexpected error occurred, or user canceled the sign in.
            if (ex.ErrorCode != "access_denied")
                MessageBox.Show(ex.Message);

            return;
        }

        ...
    }
    ```

    When your app requests a token by calling `AcquireTokenAsync(...)`, ADAL will attempt to return a token without asking the user for credentials.
    * If ADAL determines that the user needs to sign in to get a token, it will display a login dialog, collect the user's credentials, and return a token upon successful authentication. 
    * If ADAL is unable to return a token for any reason, it will throw an `AdalException`.

1. Notice that the `AuthenticationResult` object contains a `UserInfo` object that can be used to collect information your app may need. In the DirectorySearcher, `UserInfo` is used to customize the app's UI with the user's ID.
1. When the user selects the **Sign out** button, make sure that the next call to `AcquireTokenAsync(...)` will ask the user to sign in. You can easily do this with ADAL by clearing the token cache:

    ```csharp
    private void SignOut(object sender = null, RoutedEventArgs args = null)
    {
        // Clear the token cache
        authContext.TokenCache.Clear();

        ...
    }
    ```

    If the user does not click the **Sign out** button, you need to maintain the user's session for the next time they run the DirectorySearcher. When the app launches, you can check ADAL's token cache for an existing token and update the UI accordingly.

1. In the `CheckForCachedToken()` method, make another call to `AcquireTokenAsync(...)`, this time passing in the `PromptBehavior.Never` parameter. `PromptBehavior.Never` will tell ADAL that the user should not be prompted for sign in, and ADAL should instead throw an exception if it is unable to return a token.

    ```csharp
    public async void CheckForCachedToken() 
    {
        // As the application starts, try to get an access token without prompting the user. If one exists, show the user as signed in.
        AuthenticationResult result = null;
        try
        {
            result = await authContext.AcquireTokenAsync(graphResourceId, clientId, redirectUri, new PlatformParameters(PromptBehavior.Never));
        }
        catch (AdalException ex)
        {
            if (ex.ErrorCode != "user_interaction_required")
            {
                // An unexpected error occurred.
                MessageBox.Show(ex.Message);
            }

            // If user interaction is required, proceed to main page without signing the user in.
            return;
        }

        // A valid token is in the cache
        SignOutButton.Visibility = Visibility.Visible;
        UserNameLabel.Content = result.UserInfo.DisplayableId;
    }
    ```

Congratulations! You now have a working .NET WPF application that can authenticate users, securely call Web APIs using OAuth 2.0, and get basic information about the user. If you haven't already, now is the time to populate your tenant with some users. Run your DirectorySearcher app, and sign in with one of those users. Search for other users based on their UPN. Close the app, and rerun it. Notice how the user's session stays intact. Sign out, and sign back in as another user.

ADAL makes it easy to incorporate these common identity features into your application. It takes care of the dirty work for you, including cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more. All you really need to know is a single API call, `authContext.AcquireTokenAsync(...)`.

For reference, see the completed sample (without your configuration values) [on GitHub](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/complete.zip).

## Next steps

Learn how to protect a web API by using OAuth 2.0 bearer access tokens.
> [!div class="nextstepaction"]
> [Secure a .NET Web API with Azure AD >>](quickstart-v1-dotnet-webapi.md)
