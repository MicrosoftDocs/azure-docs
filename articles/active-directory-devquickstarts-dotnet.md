<properties
	pageTitle="Azure AD .NET Getting Started | Microsoft Azure"
	description="How to build a .NET Windows Desktop application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>


# Integrate Azure AD into a Windows Desktop WPF App
If you're developing a desktop application, Azure AD makes it simple and straightforward for you to authenticate your users with their Active Directory accounts.  It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For .NET native clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL's sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we'll build a .NET WPF To-Do List application that:

-	Gets access tokens for calling the Azure AD Graph API using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Searches a directory for users with a given alias.
-	Signs users out.

To build the complete working application, you'll need to:

2. Register your application with Azure AD.
3. Install & Configure ADAL.
5. Use ADAL to get tokens from Azure AD.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/complete.zip).  You'll also need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## *1. Register the DirectorySearcher Application*
To enable your app to get tokens, you'll first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API:

-	Sign into the Azure Management Portal
-	In the left hand nav, click on **Active Directory**
-	Select a tenant in which to register the application.
-	Click the **Applications** tab, and click **Add** in the bottom drawer.
-	Follow the prompts and create a new **Native Client Application**.
    -	The **Name** of the application will describe your application to end-users
    -	The **Redirect Uri** is a scheme and string combination that Azure AD will use to return token responses.  Enter a value specific to your application, e.g. `http://DirectorySearcher`.
-	Once you've completed registration, AAD will assign your app a unique client identifier.  You'll need this value in the next sections, so copy it from the **Configure** tab.
- Also in **Configure** tab, locate the "Permissions to Other Applications" section.  For the "Azure Active Directory" application, add the **Access Your Organization's Directory** permission under **Delegated Permissions**.  This will enable your application to query the Graph API for users.

## *2. Install & Configure ADAL*
Now that you have an application in Azure AD, you can install ADAL and write your identity-related code.  In order for ADAL to be able to communicate with Azure AD, you need to provide it with some information about your app registration.
-	Begin by adding ADAL to the DirectorySearcher project using the Package Manager Console.

```
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
```

-	In the DirectorySearcher project, open `app.config`.  Replace the values of the elements in the `<appSettings>` section to reflect the values you input into the Azure Portal.  Your code will reference these values whenever it uses ADAL.
    -	The `ida:Tenant` is the domain of your Azure AD tenant, e.g. contoso.onmicrosoft.com
    -	The `ida:ClientId` is the clientId of your application you copied from the portal.
    -	The `ida:RedirectUri` is the redirect url you registered in the portal.

## *3.	Use ADAL to Get Tokens from AAD*
The basic principle behind ADAL is that whenever your app needs an access token, it simply calls `authContext.AcquireToken(...)`, and ADAL does the rest.  

-	In the `DirectorySearcher` project, open `MainWindow.xaml.cs` and locate the `MainWindow()` method.  The first step is to initialize your app's `AuthenticationContext` - ADAL's primary class.  This is where you pass ADAL the coordinates it needs to communicate with Azure AD and tell it how to cache tokens.

```C#
public MainWindow()
{
    InitializeComponent();

    authContext = new AuthenticationContext(authority, new FileCache());
    ...
}
```

- Now locate the `Search(...)` method, which will be invoked when the user cliks the "Search" button in the app's UI.  This method makes a GET request to the Azure AD Graph API to query for users whose UPN begins with the given search term.  But in order to query the Graph API, you need to include an access_token in the `Authorization` header of the request - this is where ADAL comes in.

```C#
private void Search(object sender, RoutedEventArgs e)
{
    ...

    // Get an Access Token for the Graph API
    AuthenticationResult result = null;
    try
    {
        result = authContext.AcquireToken(graphResourceId, clientId, redirectUri);
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
- When your app requests a token by calling `AcquireToken(...)`, ADAL will attempt to return a token without asking the user for credentials.  If ADAL determines that the user needs to sign in to get a token, it will display a login dialog, collect the user's credentials, and return a token upon successful authentication.  If ADAL is unable to return a token for any reason, it will throw an `AdalException`.
- Notice that the `AuthenticationResult` object contains a `UserInfo` object that can be used to collect information your app may need.  In the DirectorySearcher, `UserInfo` is used to customize the app's UI with the user's id.

- When the user clicks the "Sign Out" button, we want to ensure that the next call to `AcquireToken(...)` will ask the user to sign in.  With ADAL, this is as easy as clearing the token cache:

```C#
private void SignOut(object sender = null, RoutedEventArgs args = null)
{
    // Clear the token cache
    authContext.TokenCache.Clear();

    ...
}
```

- However, if the user does not click the "Sign Out" button, you will want to maintain the user's session for the next time they run the DirectorySearcher.  When the app launches, you can check ADAL's token cache for an existing token and update the UI accordingly.  Back in `MainWindow()`, make another call to `AcquireToken(...)`, this time passing in the `PromptBehavior.Never` parameter.  `PromptBehavior.Never` will tell ADAL that the user should not be prompted for sign in, and ADAL should instead throw an exception if it is unable to return a token.

```C#
public MainWindow()
{
    InitializeComponent();

    authContext = new AuthenticationContext(authority, new FileCache());

    // As the application starts, try to get an access token without prompting the user.  If one exists, show the user as signed in.
    AuthenticationResult result = null;
    try
    {
        result = authContext.AcquireToken(graphResourceId, clientId, redirectUri, PromptBehavior.Never);
    }
    catch (AdalException ex)
    {
        if (ex.ErrorCode != "user_interaction_required")
        {
            // An unexpected error occurred.
            MessageBox.Show(ex.Message);
        }

        // If user interaction is required, proceed to main page without singing the user in.
        return;
    }

    // A valid token is in the cache
    SignOutButton.Visibility = Visibility.Visible;
    UserNameLabel.Content = result.UserInfo.DisplayableId;
}
```

Congratulations! You now have a working .NET WPF application that has the ability to authenticate users, securely call Web APIs using OAuth 2.0, and get basic information about the user.  If you haven't already, now is the time to populate your tenant with some users.  Run your DirectorySearcher app, and sign in with one of those users.  Search for other users based on their UPN.  Close the app, and re-run it.  Notice how the user's session remains intact.  Sign out, and sign back in as another user.

ADAL makes it easy to incorporate all of these common identity features into your application.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.  All you really need to know is a single API call, `authContext.AcquireToken(...)`.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/NativeClient-DotNet/archive/complete.zip).  You can now move on to additional scenarios.  You may want to try:

[Secure a .NET Web API with Azure AD >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
