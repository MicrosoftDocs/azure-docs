---
title: Azure AD v2 UWP Getting Started | Microsoft Docs
description: How Universal Windows Platform (XAML) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/03/2017
ms.author: andret

---
<!--start-intro-->
# Call the Microsoft Graph API from a Universal Windows Platform (UWP) application

This guide demonstrates how a native Universal Windows Platform (XAML) application can get an access token and call Microsoft Graph API or other APIs that require access tokens from Azure Active Directory v2 endpoint.

At the end of this guide, your application will be able to call a protected API using personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has Azure Active Directory.  

> This guide requires Visual Studio 2015 Update 3 or Visual Studio 2017 with Universal Windows Platform development installed. Check this [article](https://docs.microsoft.com/windows/uwp/get-started/get-set-up "Set up Visual Studio for UWP") for instructions on how to download and configure Visual Studio to develop Universal Windows Platform Apps.

### How this guide works

![How this guide works](media/active-directory-mobileanddesktopapp-windowsuniversalplatform-introduction/uwp-intro.png)

The sample application created by this guide enables a Universal Windows Platform Application to query Microsoft Graph API or a Web API that accepts tokens from Azure Active Directory v2 endpoint. For this scenario, a token is added to HTTP requests via the Authorization header. Token acquisition and renewal are handled by the Microsoft Authentication Library (MSAL).

### NuGet Packages

This guide uses the following NuGet packages:

|Library|Description|
|---|---|
|[Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)|Microsoft Authentication Library (MSAL)|

<!--end-intro-->

<!--start-setup-->

## Set up your project

This section provides step-by-step instructions for how to create a new project to demonstrate how to integrate a Windows Desktop .NET application (XAML) with *Sign-In with Microsoft* so it can query Web APIs that require a token.

The application created by this guide exposes a button to graph and show results on screen and a sign-out button.

> Prefer to download this sample's Visual Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-dotnet-native-uwp-v2/archive/master.zip) and skip to the [Configuration](#register-your-application "Configuration Step") step to configure the code sample before executing.


### Create your application
1. In Visual Studio: `File` > `New` > `Project`<br/>
2. Under *Templates*, select `Visual C#`
3. Select `Blank App (Universal Windows)`
4. Give it a name and click 'Ok'.
5. If prompted, fell free to select any version for *Target* and *Minimum* version and click 'Ok':<br/><br/>![Minimum and Target versions](media/active-directory-uwp-v2.md/vs-minimum-target.png)

## Add the Microsoft Authentication Library (MSAL) to your project
1. In Visual Studio: `Tools` > `Nuget Package Manager` > `Package Manager Console`
2. Copy/paste the following command in the Package Manager Console window:

```powershell
Install-Package Microsoft.Identity.Client -Pre
```

> The package above installs the Microsoft Authentication Library (MSAL). MSAL handles acquiring, caching, and refreshing user tokens used to access APIs protected by Azure Active Directory v2.

## Add the code to initialize MSAL
This step helps you create a class to handle interaction with MSAL Library, such as handling of tokens.

1. Open the `App.xaml.cs` file and add the reference for MSAL library to the class:

```csharp
using Microsoft.Identity.Client;
```
<!-- Workaround for Docs conversion bug -->
<ol start="2">
<li>
Add the following two lines to the App's class (inside <code>sealed partial class App : Application</code> block):
</li>
</ol>

```csharp
//Below is the clientId of your app registration. 
//You have to replace the below with the Application Id for your app registration
private static string ClientId = "your_client_id_here";

public static PublicClientApplication PublicClientApp = new PublicClientApplication(ClientId);
```

## Create your application’s UI
The following section shows how an application can query a protected backend server like Microsoft Graph. 
A `MainPage.xaml` file should automatically be created as a part of your project template. Open this file and then follow the instructions below:

1.	Replace your application’s `<Grid>` with the following:

```xml
<Grid>
    <StackPanel Background="Azure">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="CallGraphButton" Content="Call Microsoft Graph API" HorizontalAlignment="Right" Padding="5" Click="CallGraphButton_Click" Margin="5" FontFamily="Segoe Ui"/>
            <Button x:Name="SignOutButton" Content="Sign-Out" HorizontalAlignment="Right" Padding="5" Click="SignOutButton_Click" Margin="5" Visibility="Collapsed" FontFamily="Segoe Ui"/>
        </StackPanel>
        <TextBlock Text="API Call Results" Margin="2,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="ResultText" TextWrapping="Wrap" MinHeight="120" Margin="5" FontFamily="Segoe Ui"/>
        <TextBlock Text="Token Info" Margin="2,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="TokenInfoText" TextWrapping="Wrap" MinHeight="70" Margin="5" FontFamily="Segoe Ui"/>
    </StackPanel>
</Grid>
```
<!--end-setup-->

<!--start-use-->

## Use the Microsoft Authentication Library (MSAL) to get a token for the Microsoft Graph API

This section shows how to use MSAL to get a token for the Microsoft Graph API.

1.	In `MainPage.xaml.cs`, add the reference for MSAL library to the class:

```csharp
using Microsoft.Identity.Client;
```
<!-- Workaround for Docs conversion bug -->
<ol start="2">
<li>
Replace <code>MainPage : Page</code> class code with:
</li>
</ol>

```csharp
public sealed partial class MainPage : Page
{
    //Set the API Endpoint to Graph 'me' endpoint
    string graphAPIEndpoint = "https://graph.microsoft.com/v1.0/me";

    //Set the scope for API call to user.read
    string[] scopes = new string[] { "user.read" };


    public MainPage()
    {
        this.InitializeComponent();
    }

    /// <summary>
    /// Call AcquireTokenAsync - to acquire a token requiring user to sign-in
    /// </summary>
    private async void CallGraphButton_Click(object sender, RoutedEventArgs e)
    {
        AuthenticationResult authResult = null;
        ResultText.Text = string.Empty;
        TokenInfoText.Text = string.Empty;

        try
        {
            authResult = await App.PublicClientApp.AcquireTokenSilentAsync(scopes, App.PublicClientApp.Users.FirstOrDefault());
        }
        catch (MsalUiRequiredException ex)
        {
            // A MsalUiRequiredException happened on AcquireTokenSilentAsync. This indicates you need to call AcquireTokenAsync to acquire a token
            System.Diagnostics.Debug.WriteLine($"MsalUiRequiredException: {ex.Message}");

            try
            {
                authResult = await App.PublicClientApp.AcquireTokenAsync(scopes);
            }
            catch (MsalException msalex)
            {
                ResultText.Text = $"Error Acquiring Token:{System.Environment.NewLine}{msalex}";
            }
        }
        catch (Exception ex)
        {
            ResultText.Text = $"Error Acquiring Token Silently:{System.Environment.NewLine}{ex}";
            return;
        }

        if (authResult != null)
        {
            ResultText.Text = await GetHttpContentWithToken(graphAPIEndpoint, authResult.AccessToken);
            DisplayBasicTokenInfo(authResult);
            this.SignOutButton.Visibility = Visibility.Visible;
        }
    }
}
```

<!--start-collapse-->
### More Information
#### Getting a user token interactive
Calling the `AcquireTokenAsync` method results in a window prompting the user to sign in. Applications usually require a user to sign in interactively the first time they need to access a protected resource, or when a silent operation to acquire a token fails (for example, the user’s password expired).

#### Getting a user token silently
`AcquireTokenSilentAsync` handles token acquisitions and renewal without any user interaction. After `AcquireTokenAsync` is executed for the first time, `AcquireTokenSilentAsync` is the usual method used to obtain tokens used to access protected resources for subsequent calls - as calls to request or renew tokens are made silently.
Eventually `AcquireTokenSilentAsync` will fail - for example, the user has changed their password on another device. When MSAL detects that the issue can be resolved by requiring an interactive action, it fires an `MsalUiRequiredException`. Your application can handle this exception in two ways:

1.	Make a call against `AcquireTokenAsync` immediately, which results in prompting the user to sign in. This pattern is commonly used in online applications where there is no offline content in the application available for the user. The sample generated by this guided setup uses this pattern: you can see it in action the first time you execute the sample: because no user ever used the application, `App.PublicClientApp.Users.FirstOrDefault()` contains a null value, and an `MsalUiRequiredException` exception is thrown. The code in the sample then handles the exception by calling `AcquireTokenAsync` resulting in prompting the user to sign in.

2.	Applications can also make a visual indication to the user that an interactive sign-in is required, so the user can select the right time to sign in, or the application can retry `AcquireTokenSilentAsync` at a later time. This is commonly used when the user can use other functionality of the application without being disrupted - for example, there is offline content available in the application. In this case, the user can decide when they want to sign in to access the protected resource, or to refresh the outdated information.
<!--end-collapse-->

## Call the Microsoft Graph API using the token you just obtained

1. Add the following new method to your `MainPage.xaml.cs`. The method is used to make a `GET` request against Graph API using an Authorize header:

```csharp
/// <summary>
/// Perform an HTTP GET request to a URL using an HTTP Authorization header
/// </summary>
/// <param name="url">The URL</param>
/// <param name="token">The token</param>
/// <returns>String containing the results of the GET operation</returns>
public async Task<string> GetHttpContentWithToken(string url, string token)
{
    var httpClient = new System.Net.Http.HttpClient();
    System.Net.Http.HttpResponseMessage response;
    try
    {
        var request = new System.Net.Http.HttpRequestMessage(System.Net.Http.HttpMethod.Get, url);
        //Add the token in Authorization header
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        response = await httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        return content;
    }
    catch (Exception ex)
    {
        return ex.ToString();
    }
}
```
<!--start-collapse-->
### More information on making a REST call against a protected API

In this sample application, the `GetHttpContentWithToken` method is used to make an HTTP `GET` request against a protected resource that requires a token and then return the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. For this sample, the resource is the Microsoft Graph API *me* endpoint – which displays the user's profile information.
<!--end-collapse-->

## Add a method to sign out the user

1. Add the following method to `MainPage.xaml.cs` to sign out the user:

```csharp
/// <summary>
/// Sign out the current user
/// </summary>
private void SignOutButton_Click(object sender, RoutedEventArgs e)
{
    if (App.PublicClientApp.Users.Any())
    {
        try
        {
            App.PublicClientApp.Remove(App.PublicClientApp.Users.FirstOrDefault());
            this.ResultText.Text = "User has signed-out";
            this.CallGraphButton.Visibility = Visibility.Visible;
            this.SignOutButton.Visibility = Visibility.Collapsed;
        }
        catch (MsalException ex)
        {
            ResultText.Text = $"Error signing-out user: {ex.Message}";
        }
    }
}
```
<!--start-collapse-->
### More info on Sign-Out

`SignOutButton_Click` removes the user from MSAL user cache – this effectively tells MSAL to forget the current user so a future request to acquire a token can only succeed if it is made to be interactive.
Although the application in this sample supports a single user, MSAL supports scenarios where multiple accounts can be signed-in at the same time – an example is an email application where a user has multiple accounts.
<!--end-collapse-->

## Display Basic Token Information

1. Add the following method to your `MainPage.xaml.cs` to display basic information about the token:

```csharp
/// <summary>
/// Display basic information contained in the token
/// </summary>
private void DisplayBasicTokenInfo(AuthenticationResult authResult)
{
    TokenInfoText.Text = "";
    if (authResult != null)
    {
        TokenInfoText.Text += $"Name: {authResult.User.Name}" + Environment.NewLine;
        TokenInfoText.Text += $"Username: {authResult.User.DisplayableId}" + Environment.NewLine;
        TokenInfoText.Text += $"Token Expires: {authResult.ExpiresOn.ToLocalTime()}" + Environment.NewLine;
        TokenInfoText.Text += $"Access Token: {authResult.AccessToken}" + Environment.NewLine;
    }
}
```
<!--start-collapse-->
### More Information

Tokens acquired via *OpenID Connect* also contain a small subset of information pertinent to the user. `DisplayBasicTokenInfo` displays basic information contained in the token: for example, the user's display name and ID, as well as the token expiration date and the string representing the access token itself. This information is displayed for you to see. You can hit the *Call Microsoft Graph API* button multiple times and see that the same token was reused for subsequent requests. You can also see the expiration date being extended when MSAL decides it is time to renew the token.
<!--end-collapse-->

<!--end-use-->

<!--start-configure-->
## Register your application

Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3. Make sure the option for Guided Setup is unchecked
4. Click `Add Platforms`, then select `Native Application` and hit Save
5. Copy the GUID in Application ID, go back to Visual Studio, open `App.xaml.cs` and replace `your_client_id_here` with the Application ID you just registered:

```csharp
private static string ClientId = "your_application_id_here";
```
<!--end-configure-->

<!--start-configure-arp-->
<!--

## Add the application’s registration information to your app
In this step, you need to add the Application Id to your project.

1.	Open `App.xaml.cs` and replace the line containing the `ClientId` with:

```csharp
private static string ClientId = "[Enter the application Id here]";
```
-->
<!--end-configure-arp-->
<!--start-test-->
## Test your code

In order to test your application, press `F5` to run your project in Visual Studio. Your Main Window should appear:

![Application's user interface](media/active-directory-uwp-v2.md/testapp-ui.png)

When you're ready to test, click *Call Microsoft Graph API* and use a Microsoft Azure Active Directory (organizational account) or a Microsoft Account (live.com, outlook.com) account to sign in. If it is the first time, you will see a window asking user to sign in:

![Sign-in page](media/active-directory-uwp-v2.md/sign-in-page.png)

### Consent
The first time you sign in to your application, you are be presented with a consent screen similar to the following, where you need to explicitly accept:

![Consent Screen](media/active-directory-uwp-v2.md/consentscreen.png)
### Expected results
You should see user profile information returned by the Microsoft Graph API call on the API Call Results screen:

![Results Screen](media/active-directory-uwp-v2.md/uwp-results-screen.PNG)

You  should also see basic information about the token acquired via `AcquireTokenAsync` or `AcquireTokenSilentAsync` in the Token Info box:

|Property  |Format  |Description |
|---------|---------|---------|
|Name | {User Full name} |The user’s first and last name|
|Username |<span>user@domain.com</span> |The username used to identify the user|
|Token Expires |{DateTime}         |The time on which the token expires. MSAL extends the expiration date for you by renewing the token when necessary|
|Access token |{String}         |The token string sent that is sent to HTTP requests that require an authorization header|

### Decoding the user's tokens (optional)

When requesting access to a resource, MSAL requires two tokens: the *ID Token* - which is obtained during sign-in, contains basic information about the user, such as the user display name and other basic attributes, and the *Access Token* - which contains information used to access a resource, in this case, *https://graph.microsoft.com*.

You can decode these tokens to help you understand its contents: for the *access token*, just copy the string in the *Access token* field in the results screen and then paste it in [https://jwt.ms](https://jwt.ms/). To decode the *ID token*, set a breakpoint under *DisplayBasicTokenInfo*, run the application then click *Call Graph API* button. After breakpoint hits, obtain the results of the `authResult.IdToken` and paste it in [https://jwt.ms](https://jwt.ms/).

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the `user.read` scope to read the user's profile. This scope is added by default in every application registered on our registration portal. Some other APIs for Microsoft Graph as well as custom APIs for your backend server may require additional scopes. For example, for Microsoft Graph, the scope `Calendars.Read` is required to list the user’s calendars. In order to access the user’s calendar in a context of an application, you need to add the `Calendars.Read` delegated permission to the application registration’s information and then add the `Calendars.Read` scope to the `AcquireTokenAsync` call. The user may be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->

<!--end-test-->