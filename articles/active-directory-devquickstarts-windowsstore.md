<properties
	pageTitle="Azure AD Windows Store Getting Started | Microsoft Azure"
	description="How to build a Windows Store application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter="windows"
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-windows-store"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>


# Call a Web API from a Windows Phone App
If you're developing an app for the Windows Store, Azure AD makes it simple and straightforward for you to authenticate your users with their Active Directory accounts.  It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Windows Store desktop apps that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL’s sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we’ll build a "Directory Searcher" Windows Store app that:

-	Gets access tokens for calling the Azure AD Graph API using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Searches a directory for users with a given UPN.
-	Signs users out.

To build the complete working application, you’ll need to:

2. Register your application with Azure AD.
3. Install & Configure ADAL.
5. Use ADAL to get tokens from Azure AD.

To get started, [download a skeleton project](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/complete.zip).  Each is a Visual Studio 2013 solution.  You'll also need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## *1. Register the Directory Searcher Application*
To enable your app to get tokens, you’ll first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API:

-	Sign into the [Azure Management Portal](https://manage.windowsazure.com)
-	In the left hand nav, click on **Active Directory**
-	Select a tenant in which to register the application.
-	Click the **Applications** tab, and click **Add** in the bottom drawer.
-	Follow the prompts and create a new **Native Client Application**.
    -	The **Name** of the application will describe your application to end-users
    -	The **Redirect Uri** is a scheme and string combination that Azure AD will use to return token responses.  Enter a placeholder value for now, e.g. `http://DirectorySearcher`.  We'll replace this value later.
-	Once you’ve completed registration, AAD will assign your app a unique client identifier.  You’ll need this value in the next sections, so copy it from the **Configure** tab.
- Also in **Configure** tab, locate the "Permissions to Other Applications" section.  For the "Azure Active Directory" application, add the **Access Your Organization's Directory** permission under **Delegated Permissions**.  This will enable your application to query the Graph API for users.

## *2. Install & Configure ADAL*
Now that you have an application in Azure AD, you can install ADAL and write your identity-related code.  In order for ADAL to be able to communicate with Azure AD, you need to provide it with some information about your app registration.
-	Begin by adding ADAL to the DirectorySearcher project using the Package Manager Console.

```
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
```

-	In the DirectorySearcher project, open `MainPage.xaml.cs`.  Replace the values in the `Config Values` region to reflect the values you input into the Azure Portal.  Your code will reference these values whenever it uses ADAL.
    -	The `tenant` is the domain of your Azure AD tenant, e.g. contoso.onmicrosoft.com
    -	The `clientId` is the clientId of your application you copied from the portal.
-	You now need to discover the callback uri for your Windows Phone app.  Set a breakpoint on this line in the `MainPage` method:

```
redirectURI = Windows.Security.Authentication.Web.WebAuthenticationBroker.GetCurrentApplicationCallbackUri();
```
- Run the app, and copy aside the value of `redirectUri` when the breakpoint is hit.  It should look something like

```
ms-app://s-1-15-2-1352796503-54529114-405753024-3540103335-3203256200-511895534-1429095407/
```

- Back on the **Configure** tab of your application in the Azure Management Portal, replace the value of the **RedirectUri** with this value.  

## *3.	Use ADAL to Get Tokens from AAD*
The basic principle behind ADAL is that whenever your app needs an access token, it simply calls `authContext.AcquireToken(…)`, and ADAL does the rest.  

-	The first step is to initialize your app’s `AuthenticationContext` - ADAL’s primary class.  This is where you pass ADAL the coordinates it needs to communicate with Azure AD and tell it how to cache tokens.

```C#
public MainPage()
{
    ...

    // ADAL for Windows Phone 8.1 builds AuthenticationContext instances through a factory
    authContext = AuthenticationContext.CreateAsync(authority).GetResults();
}
```

- Now locate the `Search(...)` method, which will be invoked when the user cliks the "Search" button in the app's UI.  This method makes a GET request to the Azure AD Graph API to query for users whose UPN begins with the given search term.  But in order to query the Graph API, you need to include an access_token in the `Authorization` header of the request - this is where ADAL comes in.

```C#
private async void Search(object sender, RoutedEventArgs e)
{
    ...
    AuthenticationResult result = await authContext.AcquireTokenAsync(graphResourceId, clientId, redirectURI);
    if (result.Status != AuthenticationStatus.Success)
    {
        if (result.Error != "authentication_canceled")
        {
            MessageDialog dialog = new MessageDialog(string.Format("If the error continues, please contact your administrator.\n\nError: {0}\n\nError Description:\n\n{1}", result.Error, result.ErrorDescription), "Sorry, an error occurred while signing you in.");
            await dialog.ShowAsync();
        }
        return;
    }
    ...
}
```
- When your app requests a token by calling `AcquireTokenAsync(...)`, ADAL will attempt to return a token without asking the user for credentials.  If ADAL determines that the user needs to sign in to get a token, it will display a login dialog, collect the user's credentials, and return a token upon successful authentication.  If ADAL is unable to return a token for any reason, the `AuthenticationResult` status will be an error.

- Now it's time to use the the access_token you just acquired.  Also in the `Search(...)` method, attach the token to the Graph API GET request in the Authorization header:

```C#
// Add the access token to the Authorization Header of the call to the Graph API
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

```
- You can also use the `AuthenticationResult` object to display information about the user in your app, such as the user's id:

```C#
// Update the Page UI to represent the signed in user
ActiveUser.Text = result.UserInfo.DisplayableId;
```
- Finally, you can use ADAL to sign the user out of the application as well.  When the user clicks the "Sign Out" button, we want to ensure that the next call to `AcquireTokenAsync(...)` will show a sign in view.  With ADAL, this is as easy as clearing the token cache:

```C#
private void SignOut()
{
    // Clear session state from the token cache.
    authContext.TokenCache.Clear();

    ...
}
```

Congratulations! You now have a working Windows Store app that has the ability to authenticate users, securely call Web APIs using OAuth 2.0, and get basic information about the user.  If you haven’t already, now is the time to populate your tenant with some users.  Run your DirectorySearcher app, and sign in with one of those users.  Search for other users based on their UPN.  Close the app, and re-run it.  Notice how the user’s session remains intact.  Sign out (by right-clicking to show the bottom bar), and sign back in as another user.

ADAL makes it easy to incorporate all of these common identity features into your application.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.  All you really need to know is a single API call, `authContext.AcquireToken*(…)`.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/NativeClient-WindowsStore/archive/complete.zip).  You can now move on to additional identity scenarios.  You may want to try:

[Secure a .NET Web API with Azure AD >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
