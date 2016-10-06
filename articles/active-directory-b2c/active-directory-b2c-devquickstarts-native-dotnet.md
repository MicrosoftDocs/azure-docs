<properties
	pageTitle="Azure Active Directory B2C | Microsoft Azure"
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
	ms.date="07/22/2016"
	ms.author="dastrock"/>

# Azure AD B2C: Build a Windows desktop app

By using Azure Active Directory (Azure AD) B2C, you can add powerful self-service identity management features to your desktop app in a few short steps. This article will show you how to create a .NET Windows Presentation Foundation (WPF) "to-do list" app that includes user sign-up, sign-in, and profile management. The app will include support for sign-up and sign-in by using a user name or email. It will also include support for sign-up and sign-in by using social accounts such as Facebook and Google.

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

After you download the sample code, open the Visual Studio .sln file to get started. The `TaskClient` project is the WPF desktop application that the user interacts with. For the purposes of this tutorial, it calls a back-end task web API, hosted in Azure, that stores each user's to-do list.  You do not need to build the web API, we already have it running for you.

To learn how a web API securely authenticates requests by using Azure AD B2C, check out the
[web API getting started article](active-directory-b2c-devquickstarts-api-dotnet.md).

## Execute policies
Your app communicates with Azure AD B2C by sending authentication messages that specify the policy they want to execute as part of the HTTP request. For .NET desktop applications, you can use the preview Microsoft Authentication Library (MSAL) to send OAuth 2.0 authentication messages, execute policies, and get tokens that call web APIs.

### Install MSAL
Add MSAL to the `TaskClient` project by using the Visual Studio Package Manager Console.

```
PM> Install-Package Microsoft.Identity.Client -IncludePrerelease
```

### Enter your B2C details
Open the file `Globals.cs` and replace each of the property values with your own. This class is used throughout `TaskClient` to reference commonly used values.

```C#
public static class Globals
{
    ...

    // TODO: Replace these five default with your own configuration values
    public static string tenant = "fabrikamb2c.onmicrosoft.com";
    public static string clientId = "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6";
    public static string signInPolicy = "b2c_1_sign_in";
    public static string signUpPolicy = "b2c_1_sign_up";
    public static string editProfilePolicy = "b2c_1_edit_profile";

    ...
}
```

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]


### Create the PublicClientApplication
The primary class of MSAL is `PublicClientApplication`. This class represents your application in the Azure AD B2C system. When the app initalizes, create an instance of `PublicClientApplication` in `MainWindow.xaml.cs`. This can be used throughout the window.

```C#
protected async override void OnInitialized(EventArgs e)
{
    base.OnInitialized(e);

    pca = new PublicClientApplication(Globals.clientId)
    {
        // MSAL implements an in-memory cache by default.  Since we want tokens to persist when the user closes the app, 
        // we've extended the MSAL TokenCache and created a simple FileCache in this app.
        UserTokenCache = new FileCache(),
    };
    
    ...
```

### Initiate a sign-up flow
When a user opts to signs up, you want to initiate a sign-up flow that uses the sign-up policy you created. By using MSAL, you just call `pca.AcquireTokenAsync(...)`. The parameters you pass to `AcquireTokenAsync(...)` determine which token you receive, the policy used in the authentication request, and more.

```C#
private async void SignUp(object sender, RoutedEventArgs e)
{
    AuthenticationResult result = null;
    try
    {
        // Use the app's clientId here as the scope parameter, indicating that
        // you want a token to the your app's backend web API (represented by
        // the cloud hosted task API).  Use the UiOptions.ForceLogin flag to
        // indicate to MSAL that it should show a sign-up UI no matter what.
        result = await pca.AcquireTokenAsync(new string[] { Globals.clientId },
                string.Empty, UiOptions.ForceLogin, null, null, Globals.authority,
                Globals.signUpPolicy);

        // Upon success, indicate in the app that the user is signed in.
        SignInButton.Visibility = Visibility.Collapsed;
        SignUpButton.Visibility = Visibility.Collapsed;
        EditProfileButton.Visibility = Visibility.Visible;
        SignOutButton.Visibility = Visibility.Visible;

        // When the request completes successfully, you can get user 
        // information from the AuthenticationResult
        UsernameLabel.Content = result.User.Name;

        // After the sign up successfully completes, display the user's To-Do List
        GetTodoList();
    }

    // Handle any exeptions that occurred during execution of the policy.
    catch (MsalException ex)
    {
        if (ex.ErrorCode != "authentication_canceled")
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
You can initiate a sign-in flow in the same way that you initiate a sign-up flow. When a user signs in, make the same call to MSAL, this time by using your sign-in policy:

```C#
private async void SignIn(object sender = null, RoutedEventArgs args = null)
{
	AuthenticationResult result = null;
	try
	{
		result = await pca.AcquireTokenAsync(new string[] { Globals.clientId },
                    string.Empty, UiOptions.ForceLogin, null, null, Globals.authority,
                    Globals.signInPolicy);
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
		result = await pca.AcquireTokenAsync(new string[] { Globals.clientId },
                    string.Empty, UiOptions.ForceLogin, null, null, Globals.authority,
                    Globals.editProfilePolicy);
```

In all of these cases, MSAL either returns a token in `AuthenticationResult` or throws an exception. Each time you get a token from MSAL, you can use the `AuthenticationResult.User` object to update the user data in the app, such as the UI. ADAL also caches the token for use in other parts of the application.


### Check for tokens on app start
You can also use MSAL to keep track of the user's sign-in state.  In this app, we want the user to remain signed in even after they close the app & re-open it.  Back inside the `OnInitialized` override, use MSAL's `AcquireTokenSilent` method to check for cached tokens:

```C#
AuthenticationResult result = null;
try
{
    // If the user has has a token cached with any policy, we'll display them as signed-in.
    TokenCacheItem tci = pca.UserTokenCache.ReadItems(Globals.clientId).Where(i => i.Scope.Contains(Globals.clientId) && !string.IsNullOrEmpty(i.Policy)).FirstOrDefault();
    string existingPolicy = tci == null ? null : tci.Policy;
    result = await pca.AcquireTokenSilentAsync(new string[] { Globals.clientId }, string.Empty, Globals.authority, existingPolicy, false);

    SignInButton.Visibility = Visibility.Collapsed;
    SignUpButton.Visibility = Visibility.Collapsed;
    EditProfileButton.Visibility = Visibility.Visible;
    SignOutButton.Visibility = Visibility.Visible;
    UsernameLabel.Content = result.User.Name;
    GetTodoList();
}
catch (MsalException ex)
{
    if (ex.ErrorCode == "failed_to_acquire_token_silently")
    {
        // There are no tokens in the cache.  Proceed without calling the To Do list service.
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
```

## Call the task API
You have now used MSAL to execute policies and get tokens.  When you want to use one these tokens to call the task API, you can again use MSAL's `AcquireTokenSilent` method to check for cached tokens:

```C#
private async void GetTodoList()
{
    AuthenticationResult result = null;
    try
    {
        // Here we want to check for a cached token, independent of whatever policy was used to acquire it.
        TokenCacheItem tci = pca.UserTokenCache.ReadItems(Globals.clientId).Where(i => i.Scope.Contains(Globals.clientId) && !string.IsNullOrEmpty(i.Policy)).FirstOrDefault();
        string existingPolicy = tci == null ? null : tci.Policy;

        // Use AcquireTokenSilent to indicate that MSAL should throw an exception if a token cannot be acquired
        result = await pca.AcquireTokenSilentAsync(new string[] { Globals.clientId }, string.Empty, Globals.authority, existingPolicy, false);

    }
    // If a token could not be acquired silently, we'll catch the exception and show the user a message.
    catch (MsalException ex)
    {
        // There is no access token in the cache, so prompt the user to sign-in.
        if (ex.ErrorCode == "failed_to_acquire_token_silently")
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

When the call to `AcquireTokenSilentAsync(...)` succeeds and a token is found in the cache, you can add the token to the `Authorization` header of the HTTP request. The task web API will use this header to authenticate the request to read the user's to-do list:

```C#
	...
	// Once the token has been returned by MSAL, add it to the http authorization header, before making the call to access the To Do list service.
    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);

    // Call the To Do list service.
    HttpResponseMessage response = await httpClient.GetAsync(Globals.taskServiceUrl + "/api/tasks");
	...
```

## Sign the user out
Finally, you can use MSAL to end a user's session with the app when the user selects **Sign out**.  When using MSAL, this is accomplished by clearing all of the tokens from the token cache:

```C#
private void SignOut(object sender, RoutedEventArgs e)
{
    // Clear any remnants of the user's session.
    pca.UserTokenCache.Clear(Globals.clientId);

    // This is a helper method that clears browser cookies in the browser control that MSAL uses, it is not part of MSAL.
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

Finally, build and run the sample.  Sign up for the app by using an email address or user name. Sign out and sign back in as the same user. Edit that user's profile. Sign out and sign up by using a different user.

## Add social IDPs

Currently, the app supports only user sign-up and sign-in that use **local accounts**. These are accounts stored in your B2C directory that use a user name and password. By using Azure AD B2C, you can add support for other identity providers (IDPs) without changing any of your code.

To add social IDPs to your app, begin by following the detailed instructions in these articles. For each IDP you want to support, you need to register an application in that system and obtain a client ID.

- [Set up Facebook as an IDP](active-directory-b2c-setup-fb-app.md)
- [Set up Google as an IDP](active-directory-b2c-setup-goog-app.md)
- [Set up Amazon as an IDP](active-directory-b2c-setup-amzn-app.md)
- [Set up LinkedIn as an IDP](active-directory-b2c-setup-li-app.md)

After you add the identity providers to your B2C directory, you need to edit each of your three policies to include the new IDPs, as described in the [policy reference article](active-directory-b2c-reference-policies.md). After you save your policies, run the app again. You should see the new IDPs added as sign-in and sign-up options in each of your identity experiences.

You can experiment with your policies and observe the effects on your sample app. Add or remove IDPs, manipulate application claims, or change sign-up attributes. Experiment until you can see how policies, authentication requests, and MSAL tie together.

For reference, the completed sample [is provided as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet/archive/complete.zip). You can also clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-DotNet.git```
