<properties
	pageTitle="Azure Active Directory B2C Preview | Microsoft Azure"
	description="How to build a Windows desktop application that includes sign-in, sign-up, and profile management by using Azure Active Directory B2C."
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
	ms.date="05/16/2016"
	ms.author="dastrock"/>

# Azure AD B2C preview: Build a Windows desktop app


<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-native-switcher](../../includes/active-directory-b2c-devquickstarts-native-switcher.md)]-->

By using Azure Active Directory (Azure AD) B2C, you can add powerful self-service identity management features to your desktop app in a few short steps. This article will show you how to create a .NET Windows Presentation Foundation (WPF) "to-do list" app that includes user sign-up, sign-in, and profile management. The app will include support for sign-up and sign-in by using a user name or email. It will also include support for sign-up and sign-in by using social accounts such as Facebook and Google.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue in this guide.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to securely communicate with your app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to:

- Include a **native client** in the application.
- Copy the **Redirect URI** `urn:ietf:wg:oauth:2.0:oob`. It is the default URL for this code sample.
- Copy the **Application ID** that is assigned to your app. You will need it later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This code sample contains three identity experiences: sign up, sign in, and edit profile. You need to create a policy for each type, as described in the
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create the three policies, be sure to:

- Choose either **User ID sign-up** or **Email sign-up** in the identity providers blade.
- Choose **Display name** and other sign-up attributes in your sign-up policy.
- Choose **Display name** and **Object ID** claims as application claims for every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need these policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have successfully created the three policies, you're ready to build your app.

## Download the code

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet). To build the sample as you go, you can [download a skeleton project as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/skeleton.zip). You can also clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git
```

The completed app is also [available as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip) or on the `complete` branch of the same repository.

After you download the sample code, open the Visual Studio .sln file to get started. There are two projects in the solution: a `TaskClient` project and a `TaskService` project.  `TaskClient` is the WPF desktop application that the user interacts with. `TaskService` is the app's back-end web API that stores each user's to-do list.  In this case, both `TaskClient` and `TaskService` are represented by a single Application ID, because they comprise one logical application.

## Configure the task service

When `TaskService` receives a request from `TaskClient`, it checks for a valid access token to authenticate the request. To validate the access token, you need to provide `TaskService` with information about your app. In the `TaskService` project, open the `web.config` file in the root of the project and replace the values in the `<appSettings>` section:

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

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

To learn how a web API securely authenticates requests by using Azure AD B2C, check out the
[web API getting started article](active-directory-b2c-devquickstarts-api-dotnet.md).

## Execute policies
When `TaskService` is ready to authenticate requests, you can implement `TaskClient`. Your app communicates with Azure AD B2C by sending HTTP authentication requests. These specify the policy they want to execute as part of the request. For .NET desktop applications, you can use the Active Directory Authentication Library (ADAL) to send OAuth 2.0 authentication messages, execute policies, and get tokens that call web APIs.

### Install ADAL
Add ADAL to the `TaskClient` project by using the Visual Studio Package Manager Console.

```
PM> Install-Package Microsoft.Experimental.IdentityModel.Clients.ActiveDirectory -ProjectName TaskClient -IncludePrerelease
```

### Enter your B2C details
Open the file `Globals.cs` and replace each of the property values with your own. This class is used throughout `TaskClient` to reference commonly used values.

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

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]


### Create AuthenticationContext
The primary class of ADAL is `AuthenticationContext`. This represents your app's connection to your B2C directory. When the app starts, create an instance of `AuthenticationContext` in `MainWindow.xaml.cs`. This can be used throughout the window.

```C#
public partial class MainWindow : Window
{
	private HttpClient httpClient = new HttpClient();
	private AuthenticationContext authContext = null;

	protected async override void OnInitialized(EventArgs e)
	{
		base.OnInitialized(e);

		// The authority parameter can be constructed by appending the name of your tenant to 'https://login.microsoftonline.com/'.
		// ADAL implements an in-memory cache by default. Because we want tokens to persist when the user closes the app,
		// we've extended the ADAL TokenCache and created a simple FileCache in this app.
		authContext = new AuthenticationContext("https://login.microsoftonline.com/contoso.onmicrosoft.com", new FileCache());
		...
	...
```

### Initiate a sign-up flow
When a user opts to signs up, you want to initiate a sign-up flow that uses the sign-up policy you created. By using ADAL, you just call `authContext.AcquireTokenAsync(...)`. The parameters you pass to `AcquireTokenAsync(...)` determine which token you receive, the policy used in the authentication request, and more.

```C#
private async void SignUp(object sender, RoutedEventArgs e)
{
	AuthenticationResult result = null;
	try
	{
		// Use the app's clientId here as the scope parameter, indicating that you want a token to our own back-end API.
		// Use the PromptBehavior. Always flag to indicate to ADAL that it should show a sign-up UI, no matter what.
		// Pass in the name of your sign-up policy to execute the sign-up experience.
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
			null, Globals.clientId, new Uri(Globals.redirectUri),
			new PlatformParameters(PromptBehavior.Always, null), Globals.signUpPolicy);

		// Indicate in the app that the user is signed in.
		SignInButton.Visibility = Visibility.Collapsed;
		SignUpButton.Visibility = Visibility.Collapsed;
		EditProfileButton.Visibility = Visibility.Visible;
		SignOutButton.Visibility = Visibility.Visible;

		// When the request completes successfully, you can get user information from AuthenticationResult
		UsernameLabel.Content = result.UserInfo.Name;

		// After the sign-up successfully completes, display the user's to-do list
		GetTodoList();
	}

	// Handle any exemptions that occurred during execution of the policy.
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
You can initiate a sign-in flow in the same way that you initiate a sign-up flow. When a user signs in, make the same call to ADAL, this time by using your sign-in policy:

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

### Initiate an edit-profile flow
Again, you can execute an edit-profile policy in the same fashion:

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

In all of these cases, ADAL either returns a token in `AuthenticationResult` or throws an exception. Each time you get a token from ADAL, you can use the `AuthenticationResult.UserInfo` object to update the user data in the app, such as the UI. ADAL also caches the token for use in other parts of the application.

## Call APIs
You have now used ADAL to execute policies and get tokens. In many cases, however, you want to check for an existing cached token without executing a policy. One such case is when the app tries to fetch a user's to-do list from `TaskService`. You can use the same `authContext.AcquireTokenAsync(...)` method to do this, again by using `clientId` as the scope parameter, but this time by also using `PromptBehavior.Never`:

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
		// could not be acquired from the cache, rather than automatically prompt the user to sign in.
		result = await authContext.AcquireTokenAsync(new string[] { Globals.clientId },
			null, Globals.clientId, new Uri(Globals.redirectUri),
			new PlatformParameters(PromptBehavior.Never, null), existingPolicy);

	}

	// If a token could not be acquired silently, we'll catch the exception and show the user a message.
	catch (AdalException ex)
	{
		// There is no access token in the cache, so prompt the user to sign in.
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

When the call to `AcquireTokenAsync(...)` succeeds and a token is found in the cache, you can add the token to the `Authorization` header of the HTTP request. This way, `TaskService` can authenticate the request to read the user's to-do list:

```C#
	...
	// After the token has been returned by ADAL, add it to the HTTP authorization header before the call is made to TaskService.
	httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);

	// Call the to-do-list service.
	HttpResponseMessage response = await httpClient.GetAsync(taskServiceUrl + "/api/tasks");
	...
```

You can use this pattern any time you want to check the token cache for tokens without prompting a user to sign in. For instance, when the app starts up, you may want to check `FileCache` for any existing tokens. This way, the user's sign-in session is maintained each time the app runs. You can see the same code in the `OnInitialized` event of `MainWindow`. `OnInitialized` handles this first-run case.

## Sign out the user
You can use ADAL to end a user's session with the app when the user selects **Sign out**.  By using ADAL, this is accomplished by clearing all of the tokens from the token cache:

```C#
private void SignOut(object sender, RoutedEventArgs e)
{
	// Clear any remnants of the user's session.
	authContext.TokenCache.Clear();

	// This is a helper method that clears browser cookies in the browser control that ADAL uses. It is not part of ADAL.
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

## Run the sample app

Finally, build and run both `TaskClient` and `TaskService`.  Sign up for the app by using an email address or user name. Sign out and sign back in as the same user. Edit that user's profile. Sign out and sign up by using a different user.

## Add social IDPs

Currently, the app supports only user sign-up and sign-in that use **local accounts**. These are accounts stored in your B2C directory that use a user name and password. By using Azure AD B2C, you can add support for other identity providers (IDPs) without changing any of your code.

To add social IDPs to your app, begin by following the detailed instructions in these articles. For each IDP you want to support, you need to register an application in that system and obtain a client ID.

- [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
- [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
- [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
- [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md)

After you add the identity providers to your B2C directory, you need to edit each of your three policies to include the new IDPs, as described in the [policy reference article](active-directory-b2c-reference-policies.md). After you save your policies, run the app again. You should see the new IDPs added as sign-in and sign-up options in each of your identity experiences.

You can experiment with your policies and observe the effects on your sample app. Add or remove IDPs, manipulate application claims, or change sign-up attributes. Experiment until you can see how policies, authentication requests, and ADAL tie together.

For reference, the completed sample [is provided as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip). You can also clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git```

<!--

## Next steps

You can now move on to more advanced B2C topics. You may try:

[Call a web API from a web app]()

[Customize the UX of your B2C app]()

-->
