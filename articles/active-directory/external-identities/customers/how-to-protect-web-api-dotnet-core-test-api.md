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
ms.date: 04/17/2023
ms.custom: developer

#Customer intent: As a dev, I want to learn how to test my protected web API.
---

# Test your protected API

In this article, we create a .NET daemon app that helps us test a protected web API.

## Prerequisites

Before going through this article, ensure you have a [protected web API](how-to-protect-web-api-dotnet-core-protect-endpoints.md) to use for testing purposes.

## Register the daemon app 

1. Register a new daemon app in your CIAM tenant via the Azure portal.
1. Note down the app's Application (Client) ID and Directory (tenant) ID.
1. Create a [secret](/azure/active-directory/develop/quickstart-register-app#add-a-client-secret) for the app and note it down.

## Preauthorize the daemon app

1. Navigate to the app registration of your protected API in the Azure portal.
1. In the app registration window of your API, select *Expose an API* in the *Manage* section.
1. Under *Authorized client applications*, select *Add a client application*.
1. In the Client ID box, paste the Application ID of the daemon app.
1. In the *Authorized scopes8 section, select the scope that allows you to at least read user data. In our case, we select the `api://<ApplicationID>/ToDoList.ReadWrite` and  `api://<ApplicationID>/ToDoList.Read` scopes.
1. Select *Add application*.

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
1. Open the *Program.cs* file and replace the "Hello world" code with the following code. This code sends a request without an access token. You should see the string *Your response is: Unauthorized* printed in your console.

    ```csharp
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;

    HttpClient client = new HttpClient();

    var response = await client.GetAsync("https://localhost:<your-api-port>/api/todolist");
    Console.WriteLine("Your response is: " + response.StatusCode);
    ```

1. Remove the code in step 4 and replace with the following to test your API by sending a request with a valid access token. You should see the string *Your response is: OK* printed in your console.


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
