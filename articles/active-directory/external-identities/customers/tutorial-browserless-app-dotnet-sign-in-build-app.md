---
title: "Tutorial: Sign in users in your .NET browserless app"
description: Learn about how to build a .NET browserless app that signs in users by using Device Code flow.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.custom: devx-track-dotnet
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/27/2023
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my .NET browserless app with Microsoft Entra ID for customers tenant
---

# Tutorial: Sign in users to your .NET browserless application

In this tutorial, you build your own .NET browserless app and authenticate a user using Microsoft Entra ID for customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure a .NET browserless app to use it's app registration details.
> - Build a .NET browserless app that signs in a user and acquires a token on behalf of the user.

## Prerequisites

- Registration details for the browserless app you created in the [prepare tenant tutorial](./tutorial-browserless-app-dotnet-sign-in-prepare-tenant.md). You need the following details:
  - The Application (client) ID of the .NET browserless app that you registered.
  - The Directory (tenant) subdomain where you registered your .NET browserless app.
- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later.
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

## Create an ASP.NET browserless app

1. Open your terminal and navigate to the folder where you want your project to live.
1. Initialize a .NET console app and navigate to its root folder

    ```dotnetcli
    dotnet new console -o MsIdBrowserlessApp
    cd MsIdBrowserlessApp
    ```

## Install packages

Install configuration providers that help our app to read configuration data from key-value pairs in our app settings file. These configuration abstractions provide the ability to bind configuration values to instances of .NET objects.

```dotnetcli
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Microsoft.Extensions.Configuration.Binder
```

Install Microsoft Identity Web library that simplifies adding authentication and authorization support to apps that integrate with the Microsoft identity platform.

```dotnetcli
dotnet add package Microsoft.Identity.Web
```

## Create appsettings.json file and add registration configs

1. In your code editor, create an *appsettings.json* file in the root folder of the app.
1. Add the following code to the *appsettings.json* file.
    
    ```json
    {
        "AzureAd": {
            "Authority": "https://<Enter_the_Tenant_Subdomain_Here>.ciamlogin.com/",
            "ClientId": "<Enter_the_Application_Id_Here>"
        }
    }
    ```

    - Replace `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.
    - Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain.

1. Add the following code to the *MsIdBrowserlessApp.csproj* file to instruct your app to copy the *appsettings.json* file to the output directory when the project is compiled.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk">
        ...

        <ItemGroup>
            <None Update="appsettings.json">
                <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
            </None>
        <ItemGroup>
    </Project>
    ```

## Add sign-in code

1. In your code editor, open the *Program.cs* file.
1. Clear the contents of the *Program.cs* file then add the packages and set up your configuration to read configs from the *appsettings.json* file.

    ```csharp
    // Import packages
    using Microsoft.Extensions.Configuration;
    using Microsoft.Identity.Client;

    // Setup your configuration to read configs from appsettings.json
    var configuration =  new ConfigurationBuilder()
        .AddJsonFile($"appsettings.json");
            
    var config = configuration.Build();
    var publicClientOptions = config.GetSection("AzureAd");

    // Placeholders for the rest of the code

    var app = PublicClientApplicationBuilder.Create(...)
    var scopes = new string[] { };
    var result = await app.AcquireTokenWithDeviceCode(...)

    Console.WriteLine(...)
    ```

1. The browserless app is a public client application. Create an instance of the `PublicClientApplication` class and pass in the `ClientId` and `Authority` values from the *appsettings.json* file.

    ```csharp
    var app = PublicClientApplicationBuilder.Create(publicClientOptions.GetValue<string>("ClientId"))
        .WithAuthority(publicClientOptions.GetValue<string>("Authority"))
        .Build();
    ```

1. Add the code that helps the app acquire tokens using the device code flow. Pass in the scopes you want to request for and a callback function that is called when the device code is available. By default, MSAL attaches OIDC scopes to every token request.

    ```csharp

    var scopes = new string[] { }; // by default, MSAL attaches OIDC scopes to every token request
    var result = await app.AcquireTokenWithDeviceCode(scopes, async deviceCode => {
        Console.WriteLine($"In a broswer, navigate to the URL '{deviceCode.VerificationUrl}' and enter the code '{deviceCode.UserCode}'");
        await Task.FromResult(0);
    }).ExecuteAsync();

    Console.WriteLine($"You signed in as {result.Account.Username}");
    Console.WriteLine($"{result.Account.HomeAccountId}");
    Console.WriteLine("\nRetrieved ID token:");
    result.ClaimsPrincipal.Claims.ToList()
        .ForEach(c => Console.WriteLine(c));
    ```
 
    The callback function displays the device code and the verification URL to the user. The user then navigates to the verification URL and enters the device code to complete the authentication process. The method then proceeds to poll for the ID token which is granted upon successful login by the user based on the device code information.

## Sign in to your app

1. In your terminal, navigate to the root folder of your browserless app and run the app by running the command `dotnet run` in your terminal.
1. Open your browser, then navigate to `https://<Enter_the_Tenant_Subdomain_Here>.ciamlogin.com/common/oauth2/deviceauth`. Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain. You should see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-enter-code.png" alt-text="Screenshot of the enter code prompt in a node browserless application using the device code flow.":::

1. Copy the device code from the message in the terminal and paste it in the **Enter Code** prompt to authenticate. After entering the code, you'll be redirected to the sign in page as follows:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-sign-in-page.png" alt-text="Screenshot showing the sign in page in a node browserless application.":::

1. At this point, you most likely don't have an account. If so, select **No account? Create one**, which starts the sign-up flow. Follow through this flow to create a new account. If you already have an account, enter your credentials and sign in.
1. After completing the sign up flow and signing in, you see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-signed-in-user.png" alt-text="Screenshot showing a signed-in user in a node browserless application.":::

1. Move back to the terminal and see your authentication information including the ID token claims.

You can view the full code for this sample in the [code repo](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/tree/main/1-Authentication/4-sign-in-device-code).

## See also

- [Authenticate users in a sample Node.js browserless application.](./sample-browserless-app-node-sign-in.md)
- [Customize branding for your sign-in experience](./how-to-customize-branding-customers.md)
