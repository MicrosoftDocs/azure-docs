<properties
	pageTitle="Azure AD Xamarin Getting Started | Microsoft Azure"
	description="How to build a Xamarin application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter="xamarin"
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-xamarin"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>


# Integrate Azure AD into a Xamarin App
Xamarin allows you to write applications in C# that can run on several different platforms, including mobile devices and pc's alike.  If you're building an app using Xamarin, Azure AD makes it simple and straightforward for you to authenticate your users with their Active Directory accounts.  It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Xamarin apps that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL’s sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we’ll build a "Directory Searcher" app that:

-	Runs on iOS, Android, Windows Desktop, Windows Phone, and Windows Store.
- Uses a single portable class library (PCL) to authenticate users and get tokens for the Azure AD Graph API
-	Searches a directory for users with a given UPN.

To build the complete working application, you’ll need to:

2. Set up your Xamarin development environment
2. Register your application with Azure AD.
3. Install & Configure ADAL.
5. Use ADAL to get tokens from Azure AD.

To get started, [download a skeleton project](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/complete.zip).  Each is a Visual Studio 2013 solution.  You'll also need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## *0. Set up your Xamarin Development Environment*
There are several different ways you might want to set up Xamarin, depending on the specific platforms you wish to target.  Since this tutorial includes projects for iOS, Android, and Windows, we'll elect to use Visual Studio 2013 and the [Xamarin.iOS Build Host](http://developer.xamarin.com/guides/ios/getting_started/installation/windows/), which will require:
- A windows machine to run Visual Studio & the Windows apps
- An OSX machine (if you want to be able to run the iOS app)
- A Xamarin Business subscription (a [free trial](http://developer.xamarin.com/guides/cross-platform/getting_started/beginning_a_xamarin_trial/) is sufficient)
- [Xamarin for Windows](https://xamarin.com/download), which includes Xamarin.iOS, Xamarin.Android, and the Visual Studio Integration (recommended for this sample).
- [Xamarin for OS X](https://xamarin.com/download), which includes Xamarin.iOS (and the Xamarin.iOS Build Host), Xamarin.Android, Xamarin.Mac, and Xamarin Studio.

We recommend you begin with the [Xamarin Download Page](https://xamarin.com/download), installing Xamarin on both your Mac and PC.  If you don't have both machines available, you can still run the sample, but certain projects will have to be omitted.  Follow the [detailed installation guides](http://developer.xamarin.com/guides/cross-platform/getting_started/installation/) for iOS and Android, and if you would like to understand more about the options available to you for development, have a look at the [Building Cross Platform Applications](http://developer.xamarin.com/guides/cross-platform/application_fundamentals/building_cross_platform_applications/part_1_-_understanding_the_xamarin_mobile_platform/) guide.  You do not need to setup a device for development at this time, nor do you need a Apple Developer Program subscription (unless, of course, you want to run the iOS app on a device).

Once you've completed the necessary setup, open the solution in Visual Studio to get started.  You will find six projects: five platform-specific projects and one portable class library that will be shared across all platforms, `DirectorySearcher.cs`


## *1. Register the Directory Searcher Application*
To enable your app to get tokens, you’ll first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API:

-	Sign into the [Azure Management Portal](https://manage.windowsazure.com)
-	In the left hand nav, click on **Active Directory**
-	Select a tenant in which to register the application.
-	Click the **Applications** tab, and click **Add** in the bottom drawer.
-	Follow the prompts and create a new **Native Client Application**.
    -	The **Name** of the application will describe your application to end-users
    -	The **Redirect Uri** is a scheme and string combination that Azure AD will use to return token responses.  Enter a value, e.g. `http://DirectorySearcher`.
-	Once you’ve completed registration, AAD will assign your app a unique client identifier.  You’ll need this value in the next sections, so copy it from the **Configure** tab.
- Also in **Configure** tab, locate the "Permissions to Other Applications" section.  For the "Azure Active Directory" application, add the **Access Your Organization's Directory** permission under **Delegated Permissions**.  This will enable your application to query the Graph API for users.

## *2. Install & Configure ADAL*
Now that you have an application in Azure AD, you can install ADAL and write your identity-related code.  In order for ADAL to be able to communicate with Azure AD, you need to provide it with some information about your app registration.
-	Begin by adding ADAL to each of the projects in the solution using the Package Manager Console.

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirectorySearcherLib -IncludePrerelease
`

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Android -IncludePrerelease
`

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Desktop -IncludePrerelease
`

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-iOS -IncludePrerelease
`

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Universal.Windows -IncludePrerelease
`

`
PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -ProjectName DirSearchClient-Universal.WindowsPhone -IncludePrerelease
`

- You should notice that two library references are added to each project - the PCL portion of ADAL and a platform-specific portion.

-	In the DirectorySearcherLib project, open `DirectorySearcher.cs`.  Change the class member values to reflect the values you input into the Azure Portal.  Your code will reference these values whenever it uses ADAL.
    -	The `tenant` is the domain of your Azure AD tenant, e.g. contoso.onmicrosoft.com
    -	The `clientId` is the clientId of your application you copied from the portal.
    - The `returnUri` is the redirectUri you entered in the portal, e.g. `http://DirectorySearcher`.

## *3.	Use ADAL to Get Tokens from AAD*
*Almost* all of the app's authentication logic lies in `DirectorySearcher.SearchByAlias(...)`.  All that is necessary in the platform-specific projects is to pass a contextual parameter to the `DirectorySearcher` PCL.

- First, open `DirectorySearcher.cs` and add a new parameter to the `SearchByAlias(...)` method.  `IPlatformParameters` is the contextual parameter that encapsulates the platform-specific objects that ADAL needs to perform authentication.

```C#
public static async Task<List<User>> SearchByAlias(string alias, IPlatformParameters parent)
{
```

-	Next, initialize the `AuthenticationContext` - ADAL’s primary class.  This is where you pass ADAL the coordinates it needs to communicate with Azure AD.  Then call `AcquireTokenAsync(...)`, which accepts the `IPlatformParameters` object and will invoke the authentication flow necessary to return a token to the app.

```C#
...
AuthenticationResult authResult = null;

try
{
    AuthenticationContext authContext = new AuthenticationContext(authority);
    authResult = await authContext.AcquireTokenAsync(graphResourceUri, clientId, returnUri, parent);
}
...
```
- `AcquireTokenAsync(...)` will first attempt to return a token for the requested resource (the Graph API in this case) without prompting the user to enter their credentials (via caching or refreshing old tokens).  Only if necessary, it will show the user the Azure AD sign in page before acquiring the requested token.


- You can then attach the access token to the Graph API request in the Authorization header:

```C#
...
request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
...
```

That's all for the `DirectorySearcher` PCL and your app's identity-related code.  All that remains is to call the `SearchByAlias(...)` method in each platform's views, and where necessary add code for correctly handling the UI lifecycle.

####Android:
- In `MainActivity.cs`, add a call to `SearchByAlias(...)` in the button click handler:

```C#
List<User> results = await DirectorySearcher.SearchByAlias(searchTermText.Text, new PlatformParameters(this));
```
- You also need to override the `OnActivityResult` lifecycle method to forward any authentication redirects back to the appropriate method.  ADAL provides a helper method for this in Android:

```C#
...
protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
{
    base.OnActivityResult(requestCode, resultCode, data);
    AuthenticationAgentContinuationHelper.SetAuthenticationAgentContinuationEventArgs(requestCode, resultCode, data);
}
...
```

####Windows Desktop:
- In `MainWindow.xaml.cs`, simply make a call to `SearchByAlias(...)` passing a `WindowInteropHelper` in the desktop's `PlatformParameters` object:

```C#
List<User> results = await DirectorySearcher.SearchByAlias(
  SearchTermText.Text,
  new PlatformParameters(PromptBehavior.Auto, this.Handle));
```

####iOS:
- In `DirSearchClient_iOSViewController.cs`, the iOS `PlatformParameters` object simply takes a reference to the View Controller:

```C#
List<User> results = await DirectorySearcher.SearchByAlias(
  SearchTermText.Text,
  new PlatformParameters(PromptBehavior.Auto, this.Handle));
```

####Windows Store
- In Windows Store, open `MainPage.xaml.cs` and implement the `Search` method, which uses a helper method in a shared project to update UI as necessary.

```C#
await UnivDirectoryHelper.Search(
  sender, e,
  SearchResults,
  SearchTermText,
  StatusResult,
  new PlatformParameters(PromptBehavior.Auto, false));
```

####Windows Phone
- In Windows Phone, open `MainPage.xaml.cs` and implement the `Search` method, which uses the same helper method in a shared project to update UI.

```C#
await UnivDirectoryHelper.Search(
  sender, e,
  SearchResults,
  SearchTermText,
  StatusResult,
  new PlatformParameters());
```

Congratulations! You now have a working Xamarin app that has the ability to authenticate users and securely call Web APIs using OAuth 2.0 across five different platforms.  If you haven’t already, now is the time to populate your tenant with some users.  Run your DirectorySearcher app, and sign in with one of those users.  Search for other users based on their UPN.  

ADAL makes it easy to incorporate common identity features into your application.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.  All you really need to know is a single API call, `authContext.AcquireToken*(…)`.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-DotNet/archive/complete.zip).  You can now move on to additional identity scenarios.  You may want to try:

[Secure a .NET Web API with Azure AD >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
