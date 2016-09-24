<properties
pageTitle="Azure Active Directory v2.0 .NET Native App | Microsoft Azure"
description="How to build a .NET native app that signs users in with both personal Microsoft Account and work or school accounts."
services="active-directory"
documentationCenter=""
authors="dstrockis"
manager="mbaldwin"
editor=""/>

<tags
ms.service="active-directory"
ms.workload="identity"
ms.tgt_pltfrm="na"
ms.devlang="dotnet"
ms.topic="article"
ms.date="07/30/2016"
ms.author="dastrock; vittorib"/>

# Add sign-in to a Windows Desktop app

With the the v2.0 endpoint, you can quickly add authentication to your desktop apps with support for both personal Microsoft accounts and work or school accounts.  It also enables your app to securely communicate with a backend web api, as well as [the Microsoft Graph](https://graph.microsoft.io) and a few of the [Office 365 Unified APIs](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2).

> [AZURE.NOTE] Not all Azure Active Directory (AD) scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

For [.NET native apps that run on a device](active-directory-v2-flows.md#mobile-and-native-apps), Azure AD provides the Microsoft Identity Authentication Library, or MSAL.  MSAL's sole purpose in life is to make it easy for your app to get tokens for calling web services.  To demonstrate just how easy it is, here we'll build a .NET WPF To-Do List app that:

- Signs the user in & gets access tokens using the [OAuth 2.0 authentication protocol](active-directory-v2-protocols.md#oauth2-authorization-code-flow).
- Securely calls a backend To-Do List web service, which is also secured by OAuth 2.0.
- Signs the user out.

## Download sample code

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet/archive/skeleton.zip) or clone the skeleton:

    git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet.git

The completed app is provided at the end of this tutorial as well.

## Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Mobile** platform for your app.

## Install & Configure MSAL
Now that you have an app registered with Microsoft, you can install MSAL and write your identity-related code.  In order for MSAL to be able to communicate the v2.0 endpoint, you need to provide it with some information about your app registration.

-	Begin by adding MSAL to the TodoListClient project using the Package Manager Console.

```
PM> Install-Package Microsoft.Identity.Client -ProjectName TodoListClient -IncludePrerelease
```

-	In the TodoListClient project, open `app.config`.  Replace the values of the elements in the `<appSettings>` section to reflect the values you input into the app registration portal.  Your code will reference these values whenever it uses MSAL.
    -	The `ida:ClientId` is the **Application Id** of your app you copied from the portal.

- In the TodoList-Service project, open `web.config` in the root of the project.  
    - Replace the `ida:Audience` value with the same **Application Id** from the portal.

## Use MSAL to get tokens
The basic principle behind MSAL is that whenever your app needs an access token, you simply call `app.AcquireToken(...)`, and MSAL does the rest.  

-	In the `TodoListClient` project, open `MainWindow.xaml.cs` and locate the `OnInitialized(...)` method.  The first step is to initialize your app's `PublicClientApplication` - MSAL's primary class representing native applications.  This is where you pass MSAL the coordinates it needs to communicate with Azure AD and tell it how to cache tokens.

```C#
protected override async void OnInitialized(EventArgs e)
{
		base.OnInitialized(e);

		app = new PublicClientApplication(new FileCache());
		AuthenticationResult result = null;
		...
}
```

- When the app starts up, we want to check and see if the user is already signed into the app.  However, we don't want to invoke a sign-in UI just yet - we'll make the user click "Sign In" to do so.  Also in the `OnInitialized(...)` method:

```C#
// As the app starts, we want to check to see if the user is already signed in.
// You can do so by trying to get a token from MSAL, using the method
// AcquireTokenSilent.  This forces MSAL to throw an exception if it cannot
// get a token for the user without showing a UI.
try
{
    result = await app.AcquireTokenSilentAsync(new string[] { clientId });
    // If we got here, a valid token is in the cache - or MSAL was able to get a new oen via refresh token.
    // Proceed to fetch the user's tasks from the TodoListService via the GetTodoList() method.
    
    SignInButton.Content = "Clear Cache";
    GetTodoList();
}
catch (MsalException ex)
{
    if (ex.ErrorCode == "user_interaction_required")
    {
        // If user interaction is required, the app should take no action,
        // and simply show the user the sign in button.
    }
    else
    {
        // Here, we catch all other MsalExceptions
        string message = ex.Message;
        if (ex.InnerException != null)
        {
            message += "Inner Exception : " + ex.InnerException.Message;
        }
        MessageBox.Show(message);
    }
}

```

- If the user is not signed in and they click the "Sign In" button, we want to invoke a login UI and have the user enter their credentials.  Implement the Sign-In button handler:

```C#
private async void SignIn(object sender = null, RoutedEventArgs args = null)
{
		// TODO: Sign the user out if they clicked the "Clear Cache" button

// If the user clicked the 'Sign-In' button, force
// MSAL to prompt the user for credentials by using
// AcquireTokenAsync, a method that is guaranteed to show a prompt to the user.
// MSAL will get a token for the TodoListService and cache it for you.

AuthenticationResult result = null;
try
{
    result = await app.AcquireTokenAsync(new string[] { clientId });
    SignInButton.Content = "Clear Cache";
    GetTodoList();
}
catch (MsalException ex)
{
    // If MSAL cannot get a token, it will throw an exception.
    // If the user canceled the login, it will result in the
    // error code 'authentication_canceled'.

    if (ex.ErrorCode == "authentication_canceled")
    {
        MessageBox.Show("Sign in was canceled by the user");
    }
    else
    {
        // An unexpected error occurred.
        string message = ex.Message;
        if (ex.InnerException != null)
        {
            message += "Inner Exception : " + ex.InnerException.Message;
        }

        MessageBox.Show(message);
    }

    return;
}


}
```

- If the user successfully signs-in, MSAL will receive and cache a token for you, and you can proceed to call the `GetTodoList()` method with confidence.  All that's left to get a user's tasks is to implement the `GetTodoList()` method.

```C#
private async void GetTodoList()
{

AuthenticationResult result = null;
try
{
    // Here, we try to get an access token to call the TodoListService
    // without invoking any UI prompt.  AcquireTokenSilentAsync forces
    // MSAL to throw an exception if it cannot get a token silently.


    result = await app.AcquireTokenSilentAsync(new string[] { clientId });
}
catch (MsalException ex)
{
    // MSAL couldn't get a token silently, so show the user a message
    // and let them click the Sign-In button.

    if (ex.ErrorCode == "user_interaction_required")
    {
        MessageBox.Show("Please sign in first");
        SignInButton.Content = "Sign In";
    }
    else
    {
        // In any other case, an unexpected error occurred.

        string message = ex.Message;
        if (ex.InnerException != null)
        {
            message += "Inner Exception : " + ex.InnerException.Message;
        }
        MessageBox.Show(message);
    }

    return;
}

// Once the token has been returned by MSAL,
// add it to the http authorization header,
// before making the call to access the To Do list service.

httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);


		...
...


- When the user is done managing their To-Do List, they may finally sign out of the app by clicking the "Clear Cache" button.

```C#
private async void SignIn(object sender = null, RoutedEventArgs args = null)
{
		// If the user clicked the 'clear cache' button,
		// clear the MSAL token cache and show the user as signed out.
		// It's also necessary to clear the cookies from the browser
		// control so the next user has a chance to sign in.

		if (SignInButton.Content.ToString() == "Clear Cache")
		{
				TodoList.ItemsSource = string.Empty;
				app.UserTokenCache.Clear(app.ClientId);
				ClearCookies();
				SignInButton.Content = "Sign In";
				return;
		}

		...
```

## Run

Congratulations! You now have a working .NET WPF app that has the ability to authenticate users & securely call Web APIs using OAuth 2.0.  Run your both projects, and sign in with either a personal Microsoft account or a work or school account.  Add tasks to that user's To-Do list.  Sign out, and sign back in as another user to view their To-Do list.  Close the app, and re-run it.  Notice how the user's session remains intact - that is because the app caches tokens in a local file.

MSAL makes it easy to incorporate common identity features into your app, using both personal and work accounts.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.  All you really need to know is a single API call, `app.AcquireTokenAsync(...)`.

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet.git```

## Next steps

You can now move onto more advanced topics.  You may want to try:

- [Securing the TodoListService Web API with the v2.0 endpoint](active-directory-v2-devquickstarts-dotnet-api.md)

For additional resources, check out:  

- [The v2.0 developer guide >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "msal" tag >>](http://stackoverflow.com/questions/tagged/msal)

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.
