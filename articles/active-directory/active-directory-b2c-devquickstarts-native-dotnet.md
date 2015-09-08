<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build a desktop application with Sign-In, Sign-Up, and Profile Managment using Azure AD B2C."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="09/04/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Build a Windows Desktop App

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-native-switcher](../../includes/active-directory-b2c-devquickstarts-native-switcher.md)]-->

With Azure AD B2C, you can add powerful self-service identity managment features to your desktop app in a few short steps.  This article will show you how
to create a .NET WPF app that includes user sign-up, sign-in, and profile management.  It will include support for sign-up & sign-in with social accounts
such as Facebook & Google, as well as local accounts with a username and password.  If you're new to Azure AD B2C, this is a good place to
start.

> [AZURE.NOTE]
	This information applies to the Azure AD B2C preview.  For information on how to integrate with the generally available Azure AD service, 
	please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

A typical consumer facing app might have several identity managment flows - sign-up, sign-in, profile/preference managment, de-activation, and so on.
In Azure AD B2C, each of these user flows is represented as a **policy**.  A policy is basically a group of settings that describes how a user
flow should be executed.  For instance, your app might use a sign-up policy that requires the user to provide their first name, last name,
and email address during registration.  Policies can be used to control a several different behaviors, like: 

- which flow should be executed (sign-up, sign-in, etc).
- flow-specific information, like the data that should be collected from the user on sign up.
- which types of accounts can be used (username & password, Facebook, Google, LinkedIn).
- whether or not the user should complete multi-factor authentication.
- the information that your app should receive when the flow completes.

Every time your app wants to execute a policy, your app simply sends an HTTP authentication request to Azure AD, passing a policy identifier in the request.
You can either craft these authentication requests yourself using our [OpenID Connect or OAuth 2.0 protocol reference](), or use our [open source libraries]()
to do the job for you.  After a policy has been successfully completed, your app will receive back a security token from Azure AD, which can be used to sign the user
into the app, modify UI, update application data, etc.  Every flow in Azure AD B2C is, in fact, an authentication request.  It's just that the steps the user must
take to complete the request vary from policy to policy.  To learn more about policies in Azure AD B2C, check 
out [the policy reference article](active-directory-b2c-reference-policies.md).

For Windows desktop applications, you can use the Active Directory Authentication Library (ADAL) to implement OAuth 2.0 authentication and execute policies.
In this article, we'll use ADAL to build a WPF "To-Do List" app that:

- Implements a sign-up, sign-in, and edit profile flow using policies.
- Displays some information about the user.
- Gets access tokens for calling a "Task Service" web api that stores a user's to-do list.
- Signs the user out of the app.

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet).  To follow along, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git```

The completed app is also [available as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip) or on the
`complete` branch of the same repo.

## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Copy down the **Reply URL** `urn:ietf:wg:oauth:2.0:oob` - the default URL for this code sample.
- Copy down the **Application ID** that is assigned to your app.  You will need it shortly.

## 3. Set up your IDPs

When you create your policies, you can choose which types of accounts you want to support - each type of account corresponds to an **identity provider**, or IDP.
For each IDP you want to support, you will need to register an application in their system and obtain a client ID.  For the purposes of the tutorial, we recommend 
that you choose one or two social IDPs to support in addition to local accounts:

- [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
- [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
- [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
- [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md) 

While configuring your IDPs, be sure to choose "Email" or "Username" for your tenant's local accounts, depending on your preference. 

## 4. Create your policies

This tutorial contains three user flows - sign-up, sign-in, and edit profile.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose whichever IDPs you want to use in your app.
- Choose a few sign-up attributes to collect from a user during registration.
- Choose the **Display Name** claim as an application claim in each policy.  You can choose any other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 
- For now, you can ignore the Multifactor authentication and Page UI customization sections.

Once you have your three policies successfully created, you're ready to build your app.  Open up the solution in Visual Studio to get started.

## 5. Configure the Task Service

In this sample app, the user's tasks are stored on a web api called the `TaskService`. When the Task Service receieves requests from the Task Client,
it checks for a valid access token to authenticate the request.  In order to validate the access token, you need to provide the Task Service with some
information about your app:

In the `TaskService` project, open up the `web.config` file in the root of the project.  In the `<appSettings>`, enter the following values:

- **ida:Tenant** - the name of your B2C tenant - it usually looks like constoso.onmicrosoft.com
- **ida:ClientId** - the Application ID assigned to your app by the Azure Portal
- **ida:PolicyId** - the name of one of the policies you created, like `b2c_1_my_sign_in_policy`

If you want to learn how a web API securely authenticates requests using Azure AD B2C, check out our
[Web API Getting Started article](active-directory-b2c-devquickstarts-api-dotnet.md).

## 6. Use ADAL to execute policies

### Install ADAL
Begin by adding ADAL to the TaskClient project using the Visual Studio Package Manager Console.

```
PM> Install-Package Microsoft.Experimental.IdentityModel.Clients.ActiveDirectory -ProjectName TaskClient -IncludePrerelease
```

### Create an AuthenticationContext
ADAL's primary class is the `AuthenticationContext` - it represents your app's connection with your B2C directory.  When the app starts,
create an instance of the `AuthenticationContext` in the `MainWindow.xaml.cs`, which can be used throughout the app.

```C#
public partial class MainWindow : Window
{
	private HttpClient httpClient = new HttpClient();
	private AuthenticationContext authContext = null;
	private string taskServiceUrl = "https://localhost:44332";

	protected async override void OnInitialized(EventArgs e)
	{
		base.OnInitialized(e);

		// The authority parameter can be constructed by appending the name of your tenant to 'https://login.microsoftonline.com/'.
		// ADAL implements an in-memory cache by default.  Since we want tokens to persist when the user closes the app, 
		// we've extended the ADAL TokenCache and created a simple FileCache in this app.
		authContext = new AuthenticationContext("https://login.microsoftonline.com/contoso.onmicrosoft.com", new FileCache());
		...
	...
```

### Initiate a sign-up flow
When the user clicks the sign-up button, we want to initiate a sign-up flow using the sign-up policy you created.  With ADAL, you just need to call 
`authContext.AcquireTokenAsync(...)`.  The parameters you pass to `AcquireTokenAsync(...)` will determine what token you receive, the policy used in 
the authentication request, and so on.

```C#
private async void SignUp(object sender, RoutedEventArgs e)
{
	AuthenticationResult result = null;
	try
	{
		// The clientId parameter is the Application ID assigned to your app by the Azure portal
		// Use the app's clientId here as the scope parameter, indicating that we want a token to the our own backend API
		// Replace the policy parameter b2c_1_sign_up with your own sign-up policy name
		// Use the PromptBehavior.Always flag to indicate to ADAL that it should show a sign-up UI no matter what.

		result = await authContext.AcquireTokenAsync(new string[] { "89b1bf7c-2693-40e4-953b-751bd2ef8f57" },
			null, "89b1bf7c-2693-40e4-953b-751bd2ef8f57", new Uri("urn:ietf:oaauth:2.0:oob"),
			new PlatformParameters(PromptBehavior.Always, null), "b2c_1_my_sign_up_policy");

		// Indicate in the app that the user is signed in.
		SignInButton.Visibility = Visibility.Collapsed;
		SignUpButton.Visibility = Visibility.Collapsed;
		EditProfileButton.Visibility = Visibility.Visible;
		SignOutButton.Visibility = Visibility.Visible;
		
		// When the request completes successfully, you can get user information form the AuthenticationResult
		UsernameLabel.Content = result.UserInfo.Name;

		// After the sign up successfully completes, display the user's To-Do List
		GetTodoList();
	}
	
	// Handle any exeptions that occurred during execution of the policy.
	catch (AdalException ex)
	{
		if (ex.ErrorCode == "authentication_canceled")
		{
			MessageBox.Show("Sign up was canceled by the user");
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

### Initiate a sign-in flow
A sign-in flow can be initiated the same way as the sign-up flow.  When the user clicks the sign-in button, make the same call to ADAL, this time using your sign-policy:

```C#
private async void SignIn(object sender = null, RoutedEventArgs args = null)
{
	AuthenticationResult result = null;
	try
	{
		result = await authContext.AcquireTokenAsync(new string[] { "89b1bf7c-2693-40e4-953b-751bd2ef8f57" },
			null, "89b1bf7c-2693-40e4-953b-751bd2ef8f57", "urn:ietf:oauth:2.0:oob",
			new PlatformParameters(PromptBehavior.Always, null), "b2c_1_my_sign_in_policy");
		...			
```

### Initiate a profile edit flow
Again, you can execute your edit profile policy in the same fashion:

```C#
private async void EditProfile(object sender, RoutedEventArgs e)
{
	AuthenticationResult result = null;
	try
	{
		result = await authContext.AcquireTokenAsync(new string[] { "89b1bf7c-2693-40e4-953b-751bd2ef8f57" },
			null, "89b1bf7c-2693-40e4-953b-751bd2ef8f57", "urn:ietf:oaauth:2.0:oob",
			new PlatformParameters(PromptBehavior.Always, null), "b2c_1_my_edit_profile_policy");
```

In all of these cases, ADAL will either return a token in its `AuthenticationResult` or throw an exception.  Each time you get a token from ADAL, 
you can use the `result.UserInfo` object to update the user data in the app, such as the UI.  ADAL will also cache the token for later, for use 
in other parts of the application.

## 7. Use ADAL to get access tokens for APIs
We've already used ADAL to execute policies and get tokens.  In many cases, however, you will want to check for an existing, cached token without executing any policy.
One such case is when the app tries to fetch the user's to-do list from the Task Service.  You can use the same `authContext.AcquireToken(...)` method to do so, once
again using the `clientId` as the scope parameter, but this time using `PromptBehavior.Never`:

```C#
private async void GetTodoList()
{
	AuthenticationResult result = null;
	try
	{
		// Here we want to check for a cached token, independent of whatever policy was used to acquire it.
		TokenCacheItem tci = authContext.TokenCache.ReadItems().Where(i => i.Scope.Contains("89b1bf7c-2693-40e4-953b-751bd2ef8f57") && !string.IsNullOrEmpty(i.Policy)).FirstOrDefault();
		string existingPolicy = tci == null ? null : tci.Policy;

		// We use the PromptBehavior.Never flag to indicate that ADAL should throw an exception if a token 
		// could not be acquired from the cache, rather than automatically prompting the user to sign in. 
		result = await authContext.AcquireTokenAsync(new string[] { "89b1bf7c-2693-40e4-953b-751bd2ef8f57" },
			null, "89b1bf7c-2693-40e4-953b-751bd2ef8f57", new Uri("urn:ietf:oaauth:2.0:oob"),
			new PlatformParameters(PromptBehavior.Never, null), existingPolicy);
	}

	// If a token could not be acquired silently, we'll catch the exception and show the user a message.
	catch (AdalException ex)
	{
		// There is no access token in the cache, so prompt the user to sign-in.
		if (ex.ErrorCode == "user_interaction_required")
		{
			MessageBox.Show("Please sign up or sign in first");
			SignInButton.Visibility = Visibility.Visible;
			SignUpButton.Visibility = Visibility.Visible;
			EditProfileButton.Visibility = Visibility.Collapsed;
			SignOutButton.Visibility = Visibility.Collapsed;
			UsernameLabel.Content = string.Empty;

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
	...
```

When the call to `AcquireTokenAsync(...)` succeeds and a token is found in the cache, you can add the token to the `Authorization` header of the HTTP request so that the Task Service can authenticate
the request to read the user's to-do list: 

```C#
	...
	// Once the token has been returned by ADAL, add it to the http authorization header, before making the call to access the To Do list service.
	httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);

	// Call the To Do list service.
	HttpResponseMessage response = await httpClient.GetAsync(taskServiceUrl + "/api/tasks");
	...
``` 

You can use this same pattern any time you want to check the token cache for tokens without prompting the user to sign in.  For instance - when the app starts up,
we want to check the `FileCache` for any existing tokens, so that the user's sign-in session is maintained each time the app runs.  You can see the same
code in the `MainWindow`'s `OnInitialized` event, which handles this first-run case.

## 8. Use ADAL to sign the user out
Finally, you can use ADAL to end the user's session with the app when the user clicks the "Sign Out" button.  With ADAL, it is as simple as clearing all tokens from
the token cache:

```C#
private void SignOut(object sender, RoutedEventArgs e)
{
	// Clear any remnants of the user's session.
	authContext.TokenCache.Clear();

	// This is a helper method that clears browser cookies in the browser control that ADAL uses, it is not part of ADAL.
	ClearCookies();

	// Update the UI to show the user as signed out.
	TaskList.ItemsSource = string.Empty;
	SignInButton.Visibility = Visibility.Visible;
	SignUpButton.Visibility = Visibility.Visible;
	EditProfileButton.Visibility = Visibility.Collapsed;
	SignOutButton.Visibility = Visibility.Collapsed;
	return;
}
```

It's now time to build and run your completed app!  Before you do, replace all the placeholder parameters in `MainWindow.xaml.cs` with your own configuration values.
Each location in which you must do so has been marked with a `// TODO:` comment.


Run both the `TaskClient` and the `Task Service`.   Sign up using one of the IDPs you configured.
Sign out, and sign back in as the same user.  Edit that user's profile.  Sign out, and sign up using a different IDP.
If you look in the Azure Management portal, you can see each user being created in your B2C directory upon sign up.  This will allow the users to get single sign on
into any other applications you've created in your B2C directory.  Experiment with the different settings you can configure for a given policy - add/remove IDPs,
manipulate the application claims, change the sign up attributes.  You can do so without changing any of your app's code.  Experiment until you begin to understand how policies,
authentication requests, and ADAL all tie together.

For reference, the completed sample [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip),
or you can clone it from GitHub.  You will have to replace several placeholder parameters with your own values before running the completed app.  They have all been
marked with a `// TODO:` comment.

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git```

## Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a Web API from a Web App >>]()

[Customizing the your B2C App's UX >>]()
