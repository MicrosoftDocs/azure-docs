<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build a Windows desktop application with Sign-In, Sign-Up, and Profile Managment using Azure AD B2C."
	services="active-directory-b2c"
	documentationCenter=".net"
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Build a Windows desktop app

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-native-switcher](../../includes/active-directory-b2c-devquickstarts-native-switcher.md)]-->

With Azure AD B2C, you can add powerful self-service identity managment features to your desktop app in a few short steps.  This article will show you how
to create a .NET WPF "To-Do List" app that includes user sign-up, sign-in, and profile management.  It will include support for sign-up & sign-in with a username
or email, as well as social accounts such as Facebook & Google.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Include a **native client** in the application
- Copy down the **Redirect Uri** `urn:ietf:wg:oauth:2.0:oob` - it is the default URL for this code sample.
- Copy down the **Application ID** that is assigned to your app.  You will need it shortly.

    > [AZURE.IMPORTANT]
    You cannot use applications registered in the **Applications** tab on the [Azure Portal](https://manage.windowsazure.com/) for this.

## 3. Create your policies

In Azure AD B2C, every user experience is defined by a [**policy**](active-directory-b2c-reference-policies.md).  This code sample contains three 
identity experiences - sign-up, sign-in, and edit profile.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose **User ID signup** or **Email signup** in the identity providers blade.
- Choose the **Display Name** and a few other sign-up attributes in your sign-up policy.
- Choose the **Display Name** and **Object ID** claims as an application claim in every policy.  You can choose other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 

Once you have your three policies successfully created, you're ready to build your app.

## 4. Download the code

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet).  To build the sample as you go, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git
```

The completed app is also [available as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip) or on the
`complete` branch of the same repo.

Once you've downloaded the sample code, open the Visual Studio `.sln` file to get started.  You'll notice that there are two projects in the solution: a `TaskClient` project and a `TaskService` project.  The `TaskClient` is the WPF 
desktop application that the user interacts with.  The `TaskService` is the app's backend web API that stores each user's to-do list.  Both the `TaskClient` and the `TaskService` will be represented by a single **Application ID**
in this case, since they both comprise one logical application. 

## 5. Configure the task service

When the `TaskService` receieves requests from the `TaskClient`, it checks for a valid access token to authenticate the request.  In order to validate the access token, 
you need to provide the `TaskService` with some information about your app.  In the `TaskService` project, open up the `web.config` file in the root 
of the project and replace the values in the `<appSettings>` section:

```
<appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:AadInstance" value="https://login.microsoftonline.com/{0}/{1}/{2}?p={3}" />
    <add key="ida:Tenant" value="{Enter the name of your B2C tenant - it usually looks like constoso.onmicrosoft.com}" />
    <add key="ida:ClientId" value="{Enter the Application ID assigned to your app by the Azure Portal}" />
    <add key="ida:PolicyId" value="{Enter the name of one of the policies you created, like `b2c_1_my_sign_in_policy`}" />
  </appSettings>
  ```

If you want to learn how a web API securely authenticates requests using Azure AD B2C, check out our
[Web API Getting Started article](active-directory-b2c-devquickstarts-api-dotnet.md).

## 6. Execute policies
Now that the `TaskService` is ready to authenticate requests, we can implement the `TaskClient`.  Your app communicates with Azure AD B2C by sending HTTP authentication requests,
specifying the policy it wishes to execute as part of the request.  For .NET desktop applications, you can use the **Active Directory Authentication Library (ADAL)**
to send OAuth 2.0 authentication messages, execute policies, and get tokens for calling web APIs.

#### Install ADAL
Begin by adding ADAL to the TaskClient project using the Visual Studio Package Manager Console.

```
PM> Install-Package Microsoft.Experimental.IdentityModel.Clients.ActiveDirectory -ProjectName TaskClient -IncludePrerelease
```

#### Enter your B2C details
Open up the file `Globals.cs` and replace each of the property values with your own.  This class is used throughout the `TaskClient` to reference commonly used values.

```C#
public static class Globals
{
	public static string tenant = "{Enter the name of your B2C tenant - it usually looks like constoso.onmicrosoft.com}";
	public static string clientId = "{Enter the Application ID assigned to your app by the Azure Portal}";
	public static string signInPolicy = "{Enter the name of your sign in policy, e.g. b2c_1_sign_in}";
	public static string signUpPolicy = "{Enter the name of your sign up policy, e.g. b2c_1_sign_up}";
	public static string editProfilePolicy = "{Enter the name of your edit profile policy, e.g. b2c_1_edit_profile}";

	public static string taskServiceUrl = "https://localhost:44332";
	public static string aadInstance = "https://login.microsoftonline.com/";
	public static string redirectUri = "urn:ietf:wg:oauth:2.0:oob";

}
``` 


#### Create an AuthenticationContext
ADAL's primary class is the `AuthenticationContext` - it represents your app's connection with your B2C directory.  When the app starts,
create an instance of the `AuthenticationContext` in the `MainWindow.xaml.cs`, which can be used throughout the window.

```C#
public partial class MainWindow : Window
{
	private HttpClient httpClient = new HttpClient();
	private AuthenticationContext authContext = null;

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

#### Initiate a sign-up flow
When the user clicks the sign-up button, we want to initiate a sign-up flow using the sign-up policy you created.  With ADAL, you just need to call 
`authContext.AcquireTokenAsync(...)`.  The parameters you pass to `AcquireTokenAsync(...)` will determine what token you receive, the policy used in 
the authentication request, and so on.

```C#
private async void SignUp(object sender, RoutedEventArgs e)
{
	AuthenticationResult result = null;
	try
	{
		// Use the app's clientId here as the scope parameter, indicating that we want a token to the our own backend API
		// Use the PromptBehavior.Always flag to indicate to ADAL that it should show a sign-up UI no matter what.
		// Pass in the name of your sign-up policy to execute the sign-up experience.
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
			null, Globals.clientId, new Uri(Globals.redirectUri),
			new PlatformParameters(PromptBehavior.Always, null), Globals.signUpPolicy);

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

#### Initiate a sign-in flow
A sign-in flow can be initiated the same way as the sign-up flow.  When the user clicks the sign-in button, make the same call to ADAL, this time using your sign-in policy:

```C#
private async void SignIn(object sender = null, RoutedEventArgs args = null)
{
	AuthenticationResult result = null;
	try
	{
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
                    null, Globals.clientId, new Uri(Globals.redirectUri),
                    new PlatformParameters(PromptBehavior.Always, null), Globals.signInPolicy);
		...			
```

#### Initiate a profile edit flow
Again, you can execute your edit profile policy in the same fashion:

```C#
private async void EditProfile(object sender, RoutedEventArgs e)
{
	AuthenticationResult result = null;
	try
	{
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
                    null, Globals.clientId, new Uri(Globals.redirectUri),
                    new PlatformParameters(PromptBehavior.Always, null), Globals.editProfilePolicy);
```

In all of these cases, ADAL will either return a token in its `AuthenticationResult` or throw an exception.  Each time you get a token from ADAL, 
you can use the `AuthenticationResult.UserInfo` object to update the user data in the app, such as the UI.  ADAL will also cache the token, for use 
in other parts of the application.

## 7. Call APIs
We've already used ADAL to execute policies and get tokens.  In many cases, however, you will want to check for an existing, cached token without executing any policy.
One such case is when the app tries to fetch the user's to-do list from the `TaskService`.  You can use the same `authContext.AcquireTokenAsync(...)` method to do so, once
again using the `clientId` as the scope parameter, but this time using `PromptBehavior.Never`:

```C#
private async void GetTodoList()
{
	AuthenticationResult result = null;
	try
	{
		// Here we want to check for a cached token, independent of whatever policy was used to acquire it.
		TokenCacheItem tci = authContext.TokenCache.ReadItems().Where(i => i.Scope.Contains(Globals.clientId) && !string.IsNullOrEmpty(i.Policy)).FirstOrDefault();
		string existingPolicy = tci == null ? null : tci.Policy;

		// We use the PromptBehavior.Never flag to indicate that ADAL should throw an exception if a token 
		// could not be acquired from the cache, rather than automatically prompting the user to sign in. 
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
			null, Globals.clientId, new Uri(Globals.redirectUri),
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

When the call to `AcquireTokenAsync(...)` succeeds and a token is found in the cache, you can add the token to the `Authorization` header of the HTTP request so that the `TaskService` can authenticate
the request to read the user's to-do list: 

```C#
	...
	// Once the token has been returned by ADAL, add it to the http authorization header, before making the call to the TaskService.
	httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);

	// Call the To Do list service.
	HttpResponseMessage response = await httpClient.GetAsync(taskServiceUrl + "/api/tasks");
	...
``` 

You can use this same pattern any time you want to check the token cache for tokens without prompting the user to sign in.  For instance - when the app starts up,
we want to check the `FileCache` for any existing tokens, so that the user's sign-in session is maintained each time the app runs.  You can see the same
code in the `MainWindow`'s `OnInitialized` event, which handles this first-run case.

## 8. Sign the user out
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

## 9. Run the sample app

Finally, build and run both the `TaskClient` and the `TaskService`.  Sign up for the app with an email address or username.  Sign out, and sign back in as the same user.  Edit that user's profile.  Sign out, and sign up
using a different user.

## 10. Add social IDPs

Currently, the app only supports user sign-up & sign-in with what are called **local accounts** - accounts stored in your B2C directory with a username & password.  With Azure AD B2C,
you can add support for other **identity providers**, or IDPs, without changing any of your code.

To add social IDPs to your app, begin by following the detailed instructions in one or two of these articles.  For each IDP you want to support, you will need to register an application
in their system and obtain a client ID.

- [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
- [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
- [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
- [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md) 

When you've added the identity providers to your B2C directory, you'll need to go back and edit each of your three policies to include the new IDPs,
as described in the [policy reference article](active-directory-b2c-reference-policies.md).  After you've saved your policies, just run the app again.  You should see
the new IDPs added as a sign-in & sign-up option in each of your identity experiences.

You can experiment with your policies freely, and observe the effect on your sample app - add/remove IDPs, manipulate the application claims, change the sign up attributes.
Experiment until you begin to understand how policies, authentication requests, and ADAL all tie together.

For reference, the completed sample [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip),
or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git```

<!--

## Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a Web API from a Web App >>]()

[Customizing the your B2C App's UX >>]()

-->
