---
title: Test a protected web API
description: Learn how to test a protected web API registered in the CIAM tenant
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, I want to learn how to test my protected web API.
---

# Test your protected API

In this article, we create a .NET daemon app that helps us test a protected web API.

## Prerequisites

Before going through this article, ensure you have a [protected web API](how-to-protect-web-api-dotnet-core-protect-endpoints.md) to use for testing purposes.

## Register the daemon app 

[!INCLUDE [Register daemon app](./includes/register-app/register-daemon-app.md)]

[!INCLUDE [Add app client secret](./includes/register-app/add-app-client-secret.md)]

## Assign app role to your daemon app

Apps authenticating by themselves require app permissions.

[!INCLUDE [Add app client secret](./includes/register-app/grant-api-permissions-app-permissions.md)]

## Write code

1. Initialize a .NET console app and navigate to its root folder

    ```dotnetcli
    dotnet new console -o MyTestApp
    cd MyTestApp
    ```
1. Install MSAL to help you with handling authentication by running the following command:
  
    ```dotnetcli
    dotnet add package Microsoft.Identity.Client
    ```
1. Run your API project and note the port on which it's running.
1. Open the *Program.cs* file and replace the "Hello world" code with the following code. 

    ```csharp
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;

    HttpClient client = new HttpClient();

    var response = await client.GetAsync("https://localhost:<your-api-port>/api/todolist");
    Console.WriteLine("Your response is: " + response.StatusCode);
    ```

    Navigate to the daemon app root directory and run app using the command `dotnet run`. This code sends a request without an access token. You should see the string: *Your response is: Unauthorized* printed in your console.
1. Remove the code in step 4 and replace with the following to test your API by sending a request with a valid access token.

    ```csharp
    using Microsoft.Identity.Client;
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;

    HttpClient client = new HttpClient();

    var clientId = "<your-daemon-app-client-id>";
    var clientSecret = "<your-daemon-app-secret>";
    var scopes = new[] {"api://<your-web-api-application-id>/.default"};
    var tenantName= "<your-tenant-name>";
    var authority = $"https://{tenantName}.ciamlogin.com/";

    var app = ConfidentialClientApplicationBuilder
        .Create(clientId)
        .WithAuthority(authority)
        .WithClientSecret(clientSecret)
        .Build();

    var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
    var response = await client.GetAsync("https://localhost:44351/api/todolist");
    Console.WriteLine("Your response is: " + response.StatusCode);
    ```

    Navigate to the daemon app root directory and run app using the command `dotnet run`. This code sends a request with a valid access token. You should see the string: *Your response is: OK* printed in your console.
