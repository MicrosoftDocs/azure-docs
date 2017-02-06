---
title: Azure AD Windows Store getting started | Microsoft Docs
description: Build a Windows Store app that integrates with Azure AD for sign-in and calls Azure AD protected APIs using OAuth.
services: active-directory
documentationcenter: windows
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: 3b96a6d1-270b-4ac1-b9b5-58070c896a68
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: mobile-windows-store
ms.devlang: dotnet
ms.topic: article
ms.date: 09/16/2016
ms.author: dastrock

---
# Integrate Azure AD with a Windows Store app
[!INCLUDE [active-directory-devquickstarts-switcher](../../../includes/active-directory-devquickstarts-switcher.md)]

[!INCLUDE [active-directory-devguide](../../../includes/active-directory-devguide.md)]

If you're developing an app for the Windows Store, Azure Active Directory (AD) makes it simple and straightforward for you to authenticate your users with their Active Directory accounts. By integrating with Azure AD, the app can securely consume any web API that's protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Windows Store desktop apps that need to access protected resources, Azure AD provides the Active Directory Authentication Library (ADAL). The sole purpose of ADAL is to make it easy for the app to get access tokens. To demonstrate just how easy it is, this article shows how to build a DirectorySearcher Windows Store app that:

* Gets access tokens for calling the Azure AD Graph API by using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
* Searches a directory for users with a given user principal name (UPN).
* Signs users out.

To build the complete working app, follow the instructions in the next sections.

## Before you get started
* Download [a skeleton project](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/skeleton.zip), or download [the completed sample](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/complete.zip). Each download is a Visual Studio 2015 solution.
* You also need an Azure AD tenant in which to create users and register the app. If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## Step 1: Register the DirectorySearcher app
To enable the app to get tokens, you first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API. Here's how:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account and then, under the **Directory** list, select the Active Directory tenant where you want to register the app.
3. Click **More Services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Follow the prompts to create a new **Native Client Application**.
  * The **Name** describes the app to users
  * The **Redirect URI** is a scheme and string combination that Azure AD uses to return token responses. Enter a placeholder value for now (for example, **http://DirectorySearcher**). You'll replace this value in a later step.
6. After you’ve completed the registration, Azure AD assigns the app a unique Application ID. Copy the value on the **Application** tab, because you need it in the next sections.
7. On the **Settings** page, select **Required Permissions**, and then select **Add**.
8. For the **Azure Active Directory** app, select **Microsoft Graph** as the API.
9. Under **Delegated Permissions**, add the **Access the directory as the signed-in user** permission. Doing so enables the app to query the Graph API for users.

## Step 2: Install and configure ADAL
Now that you have an app in Azure AD, you can install ADAL and write your identity-related code. To enable ADAL to communicate with Azure AD, give it some information about the app registration.

1. Add ADAL to the DirectorySearcher project by using the Package Manager Console.

    ```
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```

2. In the DirectorySearcher project, open MainPage.xaml.cs.
3. Replace the values in the **Config Values** region to reflect the values that you entered in the Azure Portal. Your code refers to these values whenever it uses ADAL.
  * The *tenant* is the domain of your Azure AD tenant (for example, contoso.onmicrosoft.com).
  * The *clientId* is the client ID of the app, which you copied from the portal.
4. You now need to discover the callback URI for your Windows Store app. Set a breakpoint on this line in the `MainPage` method:
    ```
    redirectURI = Windows.Security.Authentication.Web.WebAuthenticationBroker.GetCurrentApplicationCallbackUri();
    ```
5. Build the solution, making sure that all package references are restored. If packages are missing, open the NuGet Package Manager and restore them.
6. Run the app, and copy the value of `redirectUri` when the breakpoint is hit. The value should look something like the following:

    ```
    ms-app://s-1-15-2-1352796503-54529114-405753024-3540103335-3203256200-511895534-1429095407/
    ```

7. Back on the **Settings** tab of the app in the Azure Portal, add a **RedirectUri** with this value.  

## Step 3: Use ADAL to get tokens from Azure AD
The basic principle behind ADAL is that whenever the app needs an access token, it simply calls `authContext.AcquireToken(…)`, and ADAL does the rest.  

1. Initialize the app’s `AuthenticationContext`, which is the primary class of ADAL. This action passes ADAL the coordinates it needs to communicate with Azure AD and tell it how to cache tokens.

    ```C#
    public MainPage()
    {
        ...

        authContext = new AuthenticationContext(authority);
    }
    ```

2. Locate the `Search(...)` method, which is invoked when users click the **Search** button on the app's UI. This method makes a get request to the Azure AD Graph API to query for users whose UPN begins with the given search term. To query the Graph API, you need to include an access_token in the request's **Authorization** header. This is where ADAL comes in.

    ```C#
    private async void Search(object sender, RoutedEventArgs e)
    {
        ...
        AuthenticationResult result = null;
        try
        {
            result = await authContext.AcquireTokenAsync(graphResourceId, clientId, redirectURI, new PlatformParameters(PromptBehavior.Auto, false));
        }
        catch (AdalException ex)
        {
            if (ex.ErrorCode != "authentication_canceled")
            {
                ShowAuthError(string.Format("If the error continues, please contact your administrator.\n\nError: {0}\n\nError Description:\n\n{1}", ex.ErrorCode, ex.Message));
            }
            return;
        }
        ...
    }
    ```
    When the app requests a token by calling `AcquireTokenAsync(...)`, ADAL will attempt to return a token without asking the user for credentials. If ADAL determines that the user needs to sign in to get a token, it displays a sign-in dialog, collects the user's credentials, and returns a token upon successful authentication. If ADAL is unable to return a token for any reason, the *AuthenticationResult* status will be an error.
3. Now it's time to use the access_token you just acquired. Also in the `Search(...)` method, attach the token to the Graph API get request in the **Authorization** header:

    ```C#
    // Add the access token to the Authorization Header of the call to the Graph API, and call the Graph API.
    httpClient.DefaultRequestHeaders.Authorization = new HttpCredentialsHeaderValue("Bearer", result.AccessToken);

    ```
4. You can use the `AuthenticationResult` object to display information about the user in the app, such as the user's ID:

    ```C#
    // Update the Page UI to represent the signed in user
    ActiveUser.Text = result.UserInfo.DisplayableId;
    ```
5. You can also use ADAL to sign users out of the app. When users click the **Sign Out** button, ensure that the next call to `AcquireTokenAsync(...)` shows a sign-in view. With ADAL, this action is as easy as clearing the token cache:

    ```C#
    private void SignOut()
    {
        // Clear session state from the token cache.
        authContext.TokenCache.Clear();

        ...
    }
    ```

## What's next
You now have a working Windows Store app that can authenticate users, securely call web APIs using OAuth 2.0, and get basic information about the user.

If you haven’t already populated your tenant with users, now is the time to do so.
1. Run your DirectorySearcher app, and then sign in with one of the users.
2. Search for other users based on their UPN.
3. Close the app, and re-run it. Notice how the user’s session remains intact.
4. Sign out by right-clicking to display the bottom bar, and then sign back in as another user.

ADAL makes it easy to incorporate all of these common identity features into the app. It takes care of all the dirty work for you, such as cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens. All you really need to know is a single API call, `authContext.AcquireToken*(…)`.

For reference, see [the completed sample](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/complete.zip) (without your configuration values).

You can now move on to additional identity scenarios. For example, try [Secure a .NET Web API with Azure AD](active-directory-devquickstarts-webapi-dotnet.md).

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]
 
