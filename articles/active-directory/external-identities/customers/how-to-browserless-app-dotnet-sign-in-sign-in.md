---
title: Sign in users in an ASP.NET browserless app using Device Code flow - Add sign-in
description: Learn about how to add sign-in to your ASP.NET browserless app using Device Code flow.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in an ASP.NET browserless app using Device Code flow - Add sign-in

In this article, you add sign-in code and run the app to go through the sign-in flow.

## Prerequisites

Completion of the prerequisites and steps in [Prepare your app](./how-to-browserless-app-dotnet-sign-in-prepare-app.md).

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

1. Open your browser, then navigate to the URL printed in your terminal, `https://microsoft.com/devicelogin`. You should see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-enter-code.png" alt-text="Screenshot of the enter code prompt in a node browserless application using the device code flow.":::

1. Copy the device code from the message in the terminal and paste it in the **Enter Code** prompt to authenticate. After entering the code, you'll be redirected to the sign in page as follows:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-sign-in-page.png" alt-text="Screenshot showing the sign in page in a node browserless application.":::

1. At this point, you most likely don't have an account. If so, select **No account? Create one**, which starts the sign-up flow. Follow through this flow to create a new account. If you already have an account, enter your credentials and sign in.

1. After completing the sign up flow and signing in, you see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-dotnet-sign-in-sign-in/browserless-app-dotnet-signed-in-user.png" alt-text="Screenshot showing a signed-in user in a node browserless application.":::

1. Move back to the terminal and see your authentication information including the ID token claims.

You can view the full code for this sample in the [code repo](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/tree/main/1-Authentication/4-sign-in-device-code).
