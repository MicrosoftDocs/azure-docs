---
title: Azure AD Xamarin getting started | Microsoft Docs
description: Build Xamarin applications that integrate with Azure AD for sign-in and call Azure AD-protected APIs using OAuth.
services: active-directory
documentationcenter: xamarin
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 198cd2c3-f7c8-4ec2-b59d-dfdea9fe7d95
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: article
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: jmprieur
ms.custom: aaddev
---

# Quickstart: Build a Xamarin app that integrates Microsoft sign-in

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

With Xamarin, you can write mobile apps in C# that can run on iOS, Android, and Windows (mobile devices and PCs). If you're building an app using Xamarin, Azure Active Directory (Azure AD) makes it simple to authenticate users with their Azure AD accounts. The app can also securely consume any web API that's protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Xamarin apps that need to access protected resources, Azure AD provides the Active Directory Authentication Library (ADAL). The sole purpose of ADAL is to make it easy for apps to get access tokens. To demonstrate how easy it is, this article shows how to build DirectorySearcher apps that:

* Run on iOS, Android, Windows Desktop, Windows Phone, and Windows Store.
* Use a single portable class library (PCL) to authenticate users and get tokens for the Azure AD Graph API.
* Search a directory for users with a given UPN.

## Prerequisites

* Download the [skeleton project](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/skeleton.zip), or download the [completed sample](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/complete.zip). Each download is a Visual Studio 2013 solution.
* You also need an Azure AD tenant in which to create users and register the app. If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).

When you are ready, follow the procedures in the next four sections.

## Step 1: Set up your Xamarin development environment

Because this tutorial includes projects for iOS, Android, and Windows, you need both Visual Studio and Xamarin. To create the necessary environment, complete the process in [Set up and install Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) on MSDN. The instructions include material that you can review to learn more about Xamarin while you're waiting for the installations to be completed.

After you've completed the setup, open the solution in Visual Studio. There, you will find six projects: five platform-specific projects and one PCL, DirectorySearcher.cs, which will be shared across all platforms.

## Step 2: Register the DirectorySearcher app

To enable the app to get tokens, you first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API. Here's how:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account. Then, under the **Directory** list, select the Active Directory tenant where you want to register the app.
3. Click **All services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. To create a new **Native Client Application**, follow the prompts.
  * **Name** describes the app to users.
  * **Redirect URI** is a scheme and string combination that Azure AD uses to return token responses. Enter a value (for example, http://DirectorySearcher).
6. After you’ve completed registration, Azure AD assigns the app a unique application ID. Copy the value from the **Application** tab, because you'll need it later.
7. On the **Settings** page, select **Required Permissions**, and then select **Add**.
8. Select **Microsoft Graph** as the API. Under **Delegated Permissions**, add the **Read Directory Data** permission. 
This action enables the app to query the Graph API for users.

## Step 3: Install and configure ADAL

Now that you have an app in Azure AD, you can install ADAL and write your identity-related code. To enable ADAL to communicate with Azure AD, give it some information about the app registration.

1. Add ADAL to the DirectorySearcher project by using the Package Manager Console.

    `
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirectorySearcherLib
    `

    `
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Android
    `

    `
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Desktop
    `

    `
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-iOS
    `

    `
    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Universal
    `

    Note that two library references are added to each project: the PCL portion of ADAL and a platform-specific portion.
2. In the DirectorySearcherLib project, open DirectorySearcher.cs.
3. Replace the class member values with the values that you entered in the Azure portal. Your code refers to these values whenever it uses ADAL.

  * The *tenant* is the domain of your Azure AD tenant (for example, contoso.onmicrosoft.com).
  * The *clientId* is the client ID of the app, which you copied from the portal.
  * The *returnUri* is the redirect URI that you entered in the portal (for example, http://DirectorySearcher).

## Step 4: Use ADAL to get tokens from Azure AD

Almost all of the app's authentication logic lies in `DirectorySearcher.SearchByAlias(...)`. All that's necessary in the platform-specific projects is to pass a contextual parameter to the `DirectorySearcher` PCL.

1. Open DirectorySearcher.cs, and then add a new parameter to the `SearchByAlias(...)` method. `IPlatformParameters` is the contextual parameter that encapsulates the platform-specific objects that ADAL needs to perform the authentication.

    ```csharp
    public static async Task<List<User>> SearchByAlias(string alias, IPlatformParameters parent)
    {
    ```

2. Initialize `AuthenticationContext`, which is the primary class of ADAL. 
This action passes ADAL the coordinates it needs to communicate with Azure AD.
3. Call `AcquireTokenAsync(...)`, which accepts the `IPlatformParameters` object and invokes the authentication flow that's necessary to return a token to the app.

    ```csharp
    ...
        AuthenticationResult authResult = null;
        try
        {
            AuthenticationContext authContext = new AuthenticationContext(authority);
            authResult = await authContext.AcquireTokenAsync(graphResourceUri, clientId, returnUri, parent);
        }
        catch (Exception ee)
        {
            results.Add(new User { error = ee.Message });
            return results;
        }
    ...
    ```

    `AcquireTokenAsync(...)` first attempts to return a token for the requested resource (the Graph API in this case) without prompting users to enter their credentials (via caching or refreshing old tokens). As necessary, it shows users the Azure AD sign-in page before acquiring the requested token.
4. Attach the access token to the Graph API request in the **Authorization** header:

    ```csharp
    ...
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
    ...
    ```

That's all for the `DirectorySearcher` PCL and the app's identity-related code. All that remains is to call the `SearchByAlias(...)` method in each platform's views and, where necessary, to add code for correctly handling the UI lifecycle.

### Android
1. In MainActivity.cs, add a call to `SearchByAlias(...)` in the button click handler:

    ```csharp
    List<User> results = await DirectorySearcher.SearchByAlias(searchTermText.Text, new PlatformParameters(this));
    ```
2. Override the `OnActivityResult` lifecycle method to forward any authentication redirects back to the appropriate method. ADAL provides a helper method for this in Android:

    ```csharp
    ...
    protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
    {
        base.OnActivityResult(requestCode, resultCode, data);
        AuthenticationAgentContinuationHelper.SetAuthenticationAgentContinuationEventArgs(requestCode, resultCode, data);
    }
    ...
    ```

### Windows Desktop

In MainWindow.xaml.cs, make a call to `SearchByAlias(...)` by passing a `WindowInteropHelper` in the desktop's `PlatformParameters` object:

```csharp
List<User> results = await DirectorySearcher.SearchByAlias(
  SearchTermText.Text,
  new PlatformParameters(PromptBehavior.Auto, this.Handle));
```

#### iOS
In DirSearchClient_iOSViewController.cs, the iOS `PlatformParameters` object takes a reference to the View Controller:

```csharp
List<User> results = await DirectorySearcher.SearchByAlias(
  SearchTermText.Text,
  new PlatformParameters(PromptBehavior.Auto, this.Handle));
```

### Windows Universal
In Windows Universal, open MainPage.xaml.cs, and then implement the `Search` method. This method uses a helper method in a shared project to update UI as necessary.

```csharp
...
List<User> results = await DirectorySearcherLib.DirectorySearcher.SearchByAlias(SearchTermText.Text, new PlatformParameters(PromptBehavior.Auto, false));
...
```

You now have a working Xamarin app that can authenticate users and securely call web APIs by using OAuth 2.0 across five different platforms.

## Step 5: Populate your tenant 

If you haven’t already populated your tenant with users, now is the time to do so.

1. Run your DirectorySearcher app, and then sign in with one of the users.
2. Search for other users based on their UPN.

## Next steps

ADAL makes it easy to incorporate common identity features into the app. It takes care of all the dirty work for you, such as cache management, OAuth protocol support, presenting the user with a login UI, and refreshing expired tokens. You need to know only a single API call, `authContext.AcquireToken*(…)`.

* Download the [completed sample](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/complete.zip) (without your configuration values).
* Learn how to [Secure a .NET Web API with Azure AD](quickstart-v1-dotnet-webapi.md).
