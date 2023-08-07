---
title: "Tutorial: Authenticate users to your WPF desktop application"
description: Learn how to sign in and sign out user to your WPF desktop app. 
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 07/26/2023
---

# Tutorial: Authenticate users to your WPF desktop application

In this tutorial, you build your Windows Presentation Form (WPF) desktop app and sign in and sign out a user using Azure Active Directory (Azure AD) for customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure a WPF desktop app to use it's app registration details.
> - Build a desktop app that signs in a user and acquires a token on behalf of the user.

## Prerequisites

- Registration details for the WPF desktop app you created in the [prepare tenant tutorial](./tutorial-desktop-wpf-dotnet-sign-in-prepare-tenant.md). You need the following details:
  - The Application (client) ID of the WPF desktop app that you registered.
  - The Directory (tenant) subdomain where you registered your WPF desktop app.
- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later.
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor. 

## Create a WPF desktop application

1. Open your terminal and navigate to the folder where you want your project to live.
1. Initialize a WPF desktop app and navigate to its root folder.

    ```dotnetcli
    dotnet new wpf --language "C#" --name sign-in-dotnet-wpf
    cd sign-in-dotnet-wpf
    ```

## Install packages

Install configuration providers that help our app to read configuration data from key-value pairs in our app settings file. These configuration abstractions provide the ability to bind configuration values to instances of .NET objects.

```dotnetcli
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Microsoft.Extensions.Configuration.Binder
```

Install the Microsoft Authentication Library (MSAL) that contains all the key components that you need to acquire a token. You also install the MSAL broker library that handles interactions with desktop authentication brokers.

```dotnetcli
dotnet add package Microsoft.Identity.Client
dotnet add package Microsoft.Identity.Client.Broker
```

## Create appsettings.json file and add registration configs

1. Create *appsettings.json* file in the root folder of the app.
1. Add app registration details to the *appsettings.json* file.

    ```json
    {
        "AzureAd": {
            "Authority": "https://<Enter_the_Tenant_Subdomain_Here>.ciamlogin.com/",
            "ClientId": "<Enter_the_Application_Id_Here>"
        }
    }
    ```

    - Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain. 
    - Replace `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.

1. After creating the app settings file, we'll create another file called *AzureAdConfig.cs* that will help you read the configs from the app settings file. Create the *AzureAdConfig.cs* file in the root folder of the app.
1. In the *AzureAdConfig.js* file, define the getters and setters for the `ClientId` and `Authority` properties. Add the following code:

    ```csharp
    namespace sign_in_dotnet_wpf
    {
        public class AzureAdConfig
        {
            public string Authority { get; set; }
            public string ClientId { get; set; }
        }
    }
    ```

## Modify the project file

1. Navigate to the *sign-in-dotnet-wpf.csproj* file in the root folder of the app.
1. In this file, take the following two steps:
    
    1. Modify the *sign-in-dotnet-wpf.csproj* file to instruct your app to copy the *appsettings.json* file to the output directory when the project is compiled. Add the following piece of code to the *sign-in-dotnet-wpf.csproj* file:
    1. Set the target framework to target *windows10.0.19041.0* build to help with reading cached token from the token cache as you'll see in the token cache helper class.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk">

        ...

        <!-- Set target framework to target windows10.0.19041.0 build -->
        <PropertyGroup>
            <OutputType>WinExe</OutputType>
            <TargetFramework>net7.0-windows10.0.19041.0</TargetFramework> <!-- target framework -->
            <RootNamespace>sign_in_dotnet_wpf</RootNamespace>
            <Nullable>enable</Nullable>
            <UseWPF>true</UseWPF>
        </PropertyGroup>

        <!-- Copy appsettings.json file to output folder. -->
        <ItemGroup>
            <None Remove="appsettings.json" />
        </ItemGroup>
    
        <ItemGroup>
            <EmbeddedResource Include="appsettings.json">
                <CopyToOutputDirectory>Always</CopyToOutputDirectory>
            </EmbeddedResource>
        </ItemGroup>
    </Project>
    ```

## Create a token cache helper class

Create a token cache helper class that initializes a token cache. The application attempts to read the token from the cache before it attempts to acquire a new token. If the token isn't found in the cache, the application acquires a new token. Upon signing-out, the cache is cleared of all accounts and all corresponding access tokens.

1. Create a *TokenCacheHelper.cs* file in the root folder of the app.
1. Open the *TokenCacheHelper.cs* file. Add the packages and namespaces to the file. In the following steps, you populate this file with the code logic by adding the relevant logic to the `TokenCacheHelper` class.

    ```csharp
    using System.IO;
    using System.Security.Cryptography;
    using Microsoft.Identity.Client;

    namespace sign_in_dotnet_wpf
    {
        static class TokenCacheHelper{}
    }
    ```

1. Add constructor to the `TokenCacheHelper` class that defines the cache file path. For packaged desktop apps (MSIX packages, also called desktop bridge) the executing assembly folder is read-only. In that case we need to use `Windows.Storage.ApplicationData.Current.LocalCacheFolder.Path + "\msalcache.bin"` that is a per-app read/write folder for packaged apps.

    ```csharp
    namespace sign_in_dotnet_wpf
    {
        static class TokenCacheHelper
        {
            static TokenCacheHelper()
            {
                try
                {
                    CacheFilePath = Path.Combine(Windows.Storage.ApplicationData.Current.LocalCacheFolder.Path, ".msalcache.bin3");
                }
                catch (System.InvalidOperationException)
                {
                    CacheFilePath = System.Reflection.Assembly.GetExecutingAssembly().Location + ".msalcache.bin3";
                }
            }
            public static string CacheFilePath { get; private set; }
            private static readonly object FileLock = new object();
        }
    }
    
    ```

1. Add code to handle token cache serialization. The `ITokenCache` interface implements the public access to cache operations. `ITokenCache` interface contains the methods to subscribe to the cache serialization events, while the interface `ITokenCacheSerializer` exposes the methods that you need to use in the cache serialization events, in order to serialize/deserialize the cache. `TokenCacheNotificationArgs` contains parameters used by`Microsoft.Identity.Client` (MSAL) call accessing the cache. `ITokenCacheSerializer` interface is available in `TokenCacheNotificationArgs` callback.

    Add the following code to the `TokenCacheHelper` class:

    ```csharp
        static class TokenCacheHelper
        {
            static TokenCacheHelper()
            {...}
            public static string CacheFilePath { get; private set; }
            private static readonly object FileLock = new object();

            public static void BeforeAccessNotification(TokenCacheNotificationArgs args)
            {
                lock (FileLock)
                {
                    args.TokenCache.DeserializeMsalV3(File.Exists(CacheFilePath)
                            ? ProtectedData.Unprotect(File.ReadAllBytes(CacheFilePath),
                                                     null,
                                                     DataProtectionScope.CurrentUser)
                            : null);
                }
            }

            public static void AfterAccessNotification(TokenCacheNotificationArgs args)
            {
                if (args.HasStateChanged)
                {
                    lock (FileLock)
                    {
                        File.WriteAllBytes(CacheFilePath,
                                           ProtectedData.Protect(args.TokenCache.SerializeMsalV3(),
                                                                 null,
                                                                 DataProtectionScope.CurrentUser)
                                          );
                    }
                }
            }
        }

        internal static void EnableSerialization(ITokenCache tokenCache)
        {
            tokenCache.SetBeforeAccess(BeforeAccessNotification);
            tokenCache.SetAfterAccess(AfterAccessNotification);
        }
    ```
    
    In the `BeforeAccessNotification` method, you read the cache from the file system, and if the cache isn't empty, you deserialize it and load it. The `AfterAccessNotification` method is called after `Microsoft.Identity.Client` (MSAL) accesses the cache. If the cache has changed, you serialize it and persist the changes to the cache.

    The `EnableSerialization` contains the `ITokenCache.SetBeforeAccess()` and `ITokenCache.SetAfterAccess()` methods: 
    
      - `ITokenCache.SetBeforeAccess()` sets a delegate to be notified before any library method accesses the cache. This gives an option to the delegate to deserialize a cache entry for the application and accounts specified in the `TokenCacheNotificationArgs`. 
      - `ITokenCache.SetAfterAccess()` sets a delegate to be notified after any library method accesses the cache. This gives an option to the delegate to serialize a cache entry for the application and accounts specified in the `TokenCacheNotificationArgs`.

## Create the WPF desktop app UI

Modify the *MainWindow.xaml* file to add the UI elements for the app. Open the *MainWindow.xaml* file in the root folder of the app and add the following piece of code with the `<Grid></Grid>` control section.

```xaml
    <StackPanel Background="Azure">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="SignInButton" Content="Sign-In" HorizontalAlignment="Right" Padding="5" Click="SignInButton_Click" Margin="5" FontFamily="Segoe Ui"/>
            <Button x:Name="SignOutButton" Content="Sign-Out" HorizontalAlignment="Right" Padding="5" Click="SignOutButton_Click" Margin="5" Visibility="Collapsed" FontFamily="Segoe Ui"/>
        </StackPanel>
        <Label Content="Authentication Result" Margin="0,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="ResultText" TextWrapping="Wrap" MinHeight="120" Margin="5" FontFamily="Segoe Ui"/>
        <Label Content="Token Info" Margin="0,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="TokenInfoText" TextWrapping="Wrap" MinHeight="70" Margin="5" FontFamily="Segoe Ui"/>
    </StackPanel>
```

This code adds key UI elements. The methods and objects that handle the functionality of the UI elements are defined in the *MainWindow.xaml.cs* file that we create in the next step.

- A button that signs in the user. `SignInButton_Click` method is called when the user selects this button. 
- A button that signs out the user. `SignOutButton_Click`  method is called when the user selects this button. 
- A text box that displays the authentication result details after the user attempts to sign in. Information displayed here's returned by the `ResultText` object.
- A text box that displays the token details after the user successfully signs in. Information displayed here's returned by the `TokenInfoText` object. 

## Add code to the MainWindow.xaml.cs file

The *MainWindow.xaml.cs* file contains the code that provides th runtime logic for the behavior of the UI elements in the *MainWindow.xaml* file. 

1. Open the *MainWindow.xaml.cs* file in the root folder of the app.
1. Add the following code in the file to import the packages, and define placeholders for the methods we create.

    ```csharp
    using Microsoft.Identity.Client;
    using System;
    using System.Linq;
    using System.Windows;
    using System.Windows.Interop;
    
    namespace sign_in_dotnet_wpf
    {
        public partial class MainWindow : Window
        {
            string[] scopes = new string[] { };
    
            public MainWindow()
            {
                InitializeComponent();
            }

            private async void SignInButton_Click(object sender, RoutedEventArgs e){...}

            private async void SignOutButton_Click(object sender, RoutedEventArgs e){...}

            private void DisplayBasicTokenInfo(AuthenticationResult authResult){...}
        }
    }
    ```

1. Add the following code to the `SignInButton_Click` method. This method is called when the user selects the **Sign-In** button.

    ```csharp
    private async void SignInButton_Click(object sender, RoutedEventArgs e)
    {
        AuthenticationResult authResult = null;
        var app = App.PublicClientApp;

        ResultText.Text = string.Empty;
        TokenInfoText.Text = string.Empty;

        IAccount firstAccount;
            
        var accounts = await app.GetAccountsAsync();
        firstAccount = accounts.FirstOrDefault();

        try
        {
            authResult = await app.AcquireTokenSilent(scopes, firstAccount)
                    .ExecuteAsync();
        }
        catch (MsalUiRequiredException ex)
        {
            try
            {
                authResult = await app.AcquireTokenInteractive(scopes)
                    .WithAccount(firstAccount)
                    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle) 
                    .WithPrompt(Prompt.SelectAccount)
                    .ExecuteAsync();
            }
            catch (MsalException msalex)
            {
                ResultText.Text = $"Error Acquiring Token:{System.Environment.NewLine}{msalex}";
            }
            catch (Exception ex)
            {
                ResultText.Text = $"Error Acquiring Token Silently:{System.Environment.NewLine}{ex}";
                return;
            }

            if (authResult != null)
            {
                ResultText.Text = "Sign in was successful.";
                DisplayBasicTokenInfo(authResult);
                this.SignInButton.Visibility = Visibility.Collapsed;
                this.SignOutButton.Visibility = Visibility.Visible;
            }
        }
    }
    ```

    `GetAccountsAsync()` returns all the available accounts in the user token cache for the app. The `IAccount` interface represents information about a single account.

    To acquire tokens, the app attempts to acquire the token silently using the `AcquireTokenSilent` method to verify if an acceptable token is in the cache. The `AcquireTokenSilent` method may fail, for example,  because the user signed out. When MSAL detects that the issue can be resolved by requiring an interactive action, it throws an `MsalUiRequiredException` exception. This exception causes the app to acquire a token interactively.

    Calling the `AcquireTokenInteractive` method results in a window that prompts users to sign in. Apps usually require users to sign in interactively the first time they need to authenticate. They might also need to sign in when a silent operation to acquire a token. After `AcquireTokenInteractive` is executed for the first time, `AcquireTokenSilent` becomes the usual method to use to obtain tokens 
    
1. Add the following code to the `SignOutButton_Click` method. This method is called when the user selects the **Sign-Out** button.

    ```csharp
    private async void SignOutButton_Click(object sender, RoutedEventArgs e)
    {
        var accounts = await App.PublicClientApp.GetAccountsAsync();
        if (accounts.Any())
        {
            try
            {
                await App.PublicClientApp.RemoveAsync(accounts.FirstOrDefault());
                this.ResultText.Text = "User has signed-out";
                this.TokenInfoText.Text = string.Empty;
                this.SignInButton.Visibility = Visibility.Visible;
                this.SignOutButton.Visibility = Visibility.Collapsed;
            }
            catch (MsalException ex)
            {
                ResultText.Text = $"Error signing-out user: {ex.Message}";
            }
        }
    }
    ```
     
    The `SignOutButton_Click` method clears the cache of all accounts and all corresponding access tokens. The next time the user attempts to sign in, they'll have to do so interactively.

1. Add the following code to the `DisplayBasicTokenInfo` method. This method displays basic information about the token.

    ```csharp
    private void DisplayBasicTokenInfo(AuthenticationResult authResult)
    {
        TokenInfoText.Text = "";
        if (authResult != null)
        {
            TokenInfoText.Text += $"Username: {authResult.Account.Username}" + Environment.NewLine;
            TokenInfoText.Text += $"{authResult.Account.HomeAccountId}" + Environment.NewLine;
        }
    }
    ```

## Add code to the App.xaml.cs file

*App.xaml* is where you declare resources that are used across the app. It's the entry point for your app. *App.xaml.cs* is the code behind file for *App.xaml*. *App.xaml.cs* also defines the start window for your application. 

Open the *App.xaml.cs* file in the root folder of the app, then add the following code into it.

```csharp
using System.Windows;
using System.Reflection;
using Microsoft.Identity.Client;
using Microsoft.Identity.Client.Broker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace sign_in_dotnet_wpf
{
    public partial class App : Application
    {
        static App()
        {
            CreateApplication();
        }

        public static void CreateApplication()
        {
            var assembly = Assembly.GetExecutingAssembly();
            using var stream = assembly.GetManifestResourceStream("sign_in_dotnet_wpf.appsettings.json");
            AppConfiguration = new ConfigurationBuilder()
                .AddJsonStream(stream)
                .Build();

            AzureAdConfig azureADConfig = AppConfiguration.GetSection("AzureAd").Get<AzureAdConfig>();

            var builder = PublicClientApplicationBuilder.Create(azureADConfig.ClientId)
                .WithAuthority(azureADConfig.Authority)
                .WithDefaultRedirectUri();

            _clientApp = builder.Build();
            TokenCacheHelper.EnableSerialization(_clientApp.UserTokenCache);
        }
        
        private static IPublicClientApplication _clientApp;
        private static IConfiguration AppConfiguration;
        public static IPublicClientApplication PublicClientApp { get { return _clientApp; } }
    }
}
```

In this step, you load the *appsettings.json* file. The configuration builder helps you read the app configs defined in the *appsettings.json* file. You also define the WPF app as a public client app since it's a desktop app. The `TokenCacheHelper.EnableSerialization` method enables the token cache serialization.

## Run the app

Run your app and sign in to test the application

1. In your terminal, navigate to the root folder of your WPF app and run the app by running the command `dotnet run` in your terminal.
1. After you launch the sample, you should see a window with a **Sign-In** button. Select the **Sign-In** button.

    :::image type="content" source="./media/tutorial-desktop-wpf-dotnet-sign-in-build-app/wpf-sign-in-screen.png" alt-text="Screenshot of sign-in screen for a WPF desktop application.":::

1. On the sign-in page, enter your account email address. If you don't have an account, select **No account? Create one**, which starts the sign-up flow. Follow through this flow to create a new account and sign in.
1. Once you sign in, you see a screen displaying successful sign-in and basic information about your user account stored in the retrieved token.

    :::image type="content" source="./media/tutorial-desktop-wpf-dotnet-sign-in-build-app/wpf-successful-sign-in.png" alt-text="Screenshot of successful sign-in for desktop WPF app.":::

## See also

- [Sign in users in a sample Electron desktop application by using Azure AD for customers](./how-to-desktop-app-electron-sample-sign-in.md)
- [Sign in users in a sample .NET MAUI desktop application by using Azure AD for customers](./how-to-desktop-app-maui-sample-sign-in.md)
- [Customize branding for your sign-in experience](./how-to-customize-branding-customers.md)
