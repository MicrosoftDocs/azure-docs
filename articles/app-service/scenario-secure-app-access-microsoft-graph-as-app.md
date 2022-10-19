---
title: Tutorial - .NET Web app accesses Microsoft Graph as the app| Azure
description: In this tutorial, you learn how to access data in Microsoft Graph from a .NET web app by using managed identities.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 08/19/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp
ms.custom: azureday1, devx-track-azurepowershell
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph by using managed identities.
---

# Tutorial: Access Microsoft Graph from a secured .NET app as the app

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-microsoft-graph-as-app/introduction.md)]

## Call Microsoft Graph

The [ChainedTokenCredential](/dotnet/api/azure.identity.chainedtokencredential), [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential), and [EnvironmentCredential](/dotnet/api/azure.identity.environmentcredential) classes are used to get a token credential for your code to authorize requests to Microsoft Graph. Create an instance of the [ChainedTokenCredential](/dotnet/api/azure.identity.chainedtokencredential) class, which uses the managed identity in the App Service environment or the development environment variables to fetch tokens and attach them to the service client. The following code example gets the authenticated token credential and uses it to create a service client object, which gets the users in the group.

To see this code as part of a sample application, see the:
* [Sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-dotnet-storage-graphapi/tree/main/3-WebApp-graphapi-managed-identity).

### Install the Microsoft.Identity.Web.MicrosoftGraph client library package

Install the [Microsoft.Identity.Web.MicrosoftGraph NuGet package](https://www.nuget.org/packages/Microsoft.Identity.Web.MicrosoftGraph) in your project by using the .NET Core command-line interface or the Package Manager Console in Visual Studio.

#### .NET Core command-line

Open a command line, and switch to the directory that contains your project file.

Run the install commands.

```dotnetcli
dotnet add package Microsoft.Identity.Web.MicrosoftGraph
```

#### Package Manager Console

Open the project/solution in Visual Studio, and open the console by using the **Tools** > **NuGet Package Manager** > **Package Manager Console** command.

Run the install commands.
```powershell
Install-Package Microsoft.Identity.Web.MicrosoftGraph
```

### .NET Example

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Azure.Identity;​
using Microsoft.Graph.Core;​​
using System.Net.Http.Headers;

...

public IList<MSGraphUser> Users { get; set; }

public async Task OnGetAsync()
{
    // Create the Graph service client with a ChainedTokenCredential which gets an access
    // token using the available Managed Identity or environment variables if running
    // in development.
    var credential = new ChainedTokenCredential(
        new ManagedIdentityCredential(),
        new EnvironmentCredential());
    var token = credential.GetToken(
        new Azure.Core.TokenRequestContext(
            new[] { "https://graph.microsoft.com/.default" }));

    var accessToken = token.Token;
    var graphServiceClient = new GraphServiceClient(
        new DelegateAuthenticationProvider((requestMessage) =>
        {
            requestMessage
            .Headers
            .Authorization = new AuthenticationHeaderValue("bearer", accessToken);

            return Task.CompletedTask;
        }));

    // MSGraphUser is a DTO class being used to hold User information from the graph service client call
    List<MSGraphUser> msGraphUsers = new List<MSGraphUser>();
    try
    {
        var users =await graphServiceClient.Users.Request().GetAsync();
        foreach(var u in users)
        {
            MSGraphUser user = new MSGraphUser();
            user.userPrincipalName = u.UserPrincipalName;
            user.displayName = u.DisplayName;
            user.mail = u.Mail;
            user.jobTitle = u.JobTitle;

            msGraphUsers.Add(user);
        }
    }
    catch(Exception ex)
    {
        string msg = ex.Message;
    }

    Users = msGraphUsers;
}
```

[!INCLUDE [tutorial-clean-up-steps](./includes/tutorial-cleanup.md)]

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-microsoft-graph-as-app/cleanup.md)]
