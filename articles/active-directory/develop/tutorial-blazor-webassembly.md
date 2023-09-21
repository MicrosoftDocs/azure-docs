---
title: Tutorial - Sign in users and call a protected API from a Blazor WebAssembly app
description: In this tutorial, sign in users and call a protected API using the Microsoft identity platform in a Blazor WebAssembly (WASM) app.
author: henrymbuguakiarie
ms.author: henrymbugua
ms.service: active-directory
ms.subservice: develop
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 02/09/2023
ms.reviewer: janicericketts
#Customer intent: As a developer, I want to add authentication and authorization to a Blazor WebAssembly app and call Microsoft Graph.
---

# Tutorial: Sign in users and call a protected API from a Blazor WebAssembly app

In this tutorial, you build a Blazor WebAssembly app that signs in users and gets data from Microsoft Graph by using the Microsoft identity platform and registering your app in Microsoft Entra ID.

In this tutorial:

> [!div class="checklist"]
>
> - Create a new Blazor WebAssembly app configured to use Microsoft Entra ID for [authentication and authorization](authentication-vs-authorization.md)
> - Retrieve data from a protected web API, in this case [Microsoft Graph](/graph/overview)

This tutorial uses .NET Core 7.0.

We also have a [tutorial for Blazor Server](tutorial-blazor-server.md).

## Prerequisites

- [.NET Core 7.0 SDK](https://dotnet.microsoft.com/download/dotnet-core/7.0)
- A Microsoft Entra tenant where you can register an app. If you don't have access to a Microsoft Entra tenant, you can get one by registering with the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) or by creating an [Azure free account](https://azure.microsoft.com/free).

## Register the app

Every app that uses Microsoft Entra ID for authentication must be registered with Microsoft Entra ID. Follow the instructions in [Register an application](quickstart-register-app.md) with these specifications:

- For **Supported account types**, select **Accounts in this organizational directory only**.
- Set the **Redirect URI** drop down to **Single-page application (SPA)** and enter `https://localhost:5001/authentication/login-callback`. The default port for an app running on Kestrel is 5001. If the app is available on a different port, specify that port number instead of `5001`.

## Create the app using the .NET Core CLI

To create the application, run the following command. Replace the placeholders in the command with the proper information from your app's overview page and execute the command in a command shell. The output location specified with the `-o|--output` option creates a project folder if it doesn't exist and becomes part of the app's name.

```dotnetcli
dotnet new blazorwasm --auth SingleOrg --calls-graph -o {APP NAME} --client-id "{CLIENT ID}" --tenant-id "{TENANT ID}" -f net7.0
```

| Placeholder | Name | Example |
| ----------- | ---- |-------- |
| `{APP NAME}`  | &mdash; | `BlazorWASMSample` |
| `{CLIENT ID}` | Application (client) ID | `41451fa7-0000-0000-0000-69eff5a761fd` |
| `{TENANT ID}` | Directory (tenant) ID | `e86c78e2-0000-0000-0000-918e0565a45e` |

## Test the app

You can now build and run the app. In your terminal, run the following command:

```dotnetcli
dotnet run
```

In your browser, navigate to `https://localhost:<port number>`, and log in using a Microsoft Entra user account to see the app running and logging users in with the Microsoft identity platform.

The components of this template that enable logins with Microsoft Entra ID using the Microsoft identity platform are explained in the [ASP.NET doc on this article](/aspnet/core/blazor/security/webassembly/standalone-with-azure-active-directory#authentication-package).

## Retrieving data from a protected API (Microsoft Graph)

[Microsoft Graph](/graph/overview) contains APIs that provide access to Microsoft 365 data for your users, and it supports the tokens issued by the Microsoft identity platform, which makes it a good protected API to use as an example. In this section, you add code to call Microsoft Graph and display the user's emails on the application's "Fetch data" page.

This section is written using a common approach to calling a protected API using a named client. The same method can be used for other protected APIs you want to call. However, if you do plan to call Microsoft Graph from your application you can use the Graph SDK to reduce boilerplate. The .NET docs contain instructions on [how to use the Graph SDK](/aspnet/core/blazor/security/webassembly/graph-api?view=aspnetcore-5.0&preserve-view=true).

Before you start, log out of your app since you'll be making changes to the required permissions, and your current token won't work. If you haven't already, run your app again and select **Log out** before updating the code in your app.

Now you'll update your app's registration and code to pull a user's emails and display the messages within the app.

First, add the `Mail.Read` API permission to the app's registration so that Microsoft Entra ID is aware that the app will request to access its users' email.

1. In the Microsoft Entra admin center, select your app in **App registrations**.
1. Under **Manage**, select **API permissions**.
1. Select **Add a permission** > **Microsoft Graph**.
1. Select **Delegated Permissions**, then search for and select the **Mail.Read** permission.
1. Select **Add permissions**.

Next, add the following to your project's _.csproj_ file in the **ItemGroup**. This will allow you to create the custom HttpClient in the next step.

```xml
<PackageReference Include="Microsoft.Extensions.Http" Version="7.0.0" />
```

Then modify the code as specified in the next few steps. These changes will add [access tokens](access-tokens.md) to the outgoing requests sent to the Microsoft Graph API. This pattern is discussed in more detail in [ASP.NET Core Blazor WebAssembly additional security scenarios](/aspnet/core/blazor/security/webassembly/additional-scenarios).

First, create a new file named _GraphAPIAuthorizationMessageHandler.cs_ with the following code. This handler will be user to add an access token for the `User.Read` and `Mail.Read` scopes to outgoing requests to the Microsoft Graph API.

```csharp
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;

public class GraphAPIAuthorizationMessageHandler : AuthorizationMessageHandler
{
    public GraphAPIAuthorizationMessageHandler(IAccessTokenProvider provider,
        NavigationManager navigationManager)
        : base(provider, navigationManager)
    {
        ConfigureHandler(
            authorizedUrls: new[] { "https://graph.microsoft.com" },
            scopes: new[] { "https://graph.microsoft.com/User.Read", "https://graph.microsoft.com/Mail.Read" });
    }
}
```

Then, replace the contents from the line that start with `var` to the end of the file in _Program.cs_ with the following code. This code makes use of the new `GraphAPIAuthorizationMessageHandler` and adds `User.Read` and `Mail.Read` as default scopes the app will request when the user first signs in.

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped<GraphAPIAuthorizationMessageHandler>();

builder.Services.AddHttpClient("GraphAPI",
        client => client.BaseAddress = new Uri("https://graph.microsoft.com"))
    .AddHttpMessageHandler<GraphAPIAuthorizationMessageHandler>();

builder.Services.AddMsalAuthentication(options =>
{
    builder.Configuration.Bind("AzureAd", options.ProviderOptions.Authentication);
    options.ProviderOptions.DefaultAccessTokenScopes.Add("User.Read");
    options.ProviderOptions.DefaultAccessTokenScopes.Add("Mail.Read");
});

await builder.Build().RunAsync();
```

Finally,in the _Pages_ folder, replace the contents of the _FetchData.razor_ page with the following code. This code fetches user email data from the Microsoft Graph API and displays them as a list. In `OnInitializedAsync`, the new `HttpClient` that uses the proper access token is created and used to make the request to the Microsoft Graph API.

```c#
@page "/fetchdata"
@using System.ComponentModel.DataAnnotations
@using System.Text.Json.Serialization
@using Microsoft.AspNetCore.Components.WebAssembly.Authentication
@using Microsoft.Extensions.Logging
@inject IAccessTokenProvider TokenProvider
@inject IHttpClientFactory ClientFactory
@inject IHttpClientFactory HttpClientFactory

<p>This component demonstrates fetching data from a service.</p>

@if (messages == null)
{
    <p><em>Loading...</em></p>
}
else
{
    <h1>Hello @userDisplayName !!!!</h1>
    <table class="table">
        <thead>
            <tr>
                <th>Subject</th>
                <th>Sender</th>
                <th>Received Time</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var mail in messages)
            {
                <tr>
                    <td>@mail.Subject</td>
                    <td>@mail.Sender</td>
                    <td>@mail.ReceivedTime</td>
                </tr>
            }
        </tbody>
    </table>
}

@code {

    private string userDisplayName;
    private List<MailMessage> messages = new List<MailMessage>();

    private HttpClient _httpClient;

    protected override async Task OnInitializedAsync()
    {
        _httpClient = HttpClientFactory.CreateClient("GraphAPI");
        try {
            var dataRequest = await _httpClient.GetAsync("https://graph.microsoft.com/beta/me");

            if (dataRequest.IsSuccessStatusCode)
            {
                var userData = System.Text.Json.JsonDocument.Parse(await dataRequest.Content.ReadAsStreamAsync());
                userDisplayName = userData.RootElement.GetProperty("displayName").GetString();
            }

            var mailRequest = await _httpClient.GetAsync("https://graph.microsoft.com/beta/me/messages?$select=subject,receivedDateTime,sender&$top=10");

            if (mailRequest.IsSuccessStatusCode)
            {
                var mailData = System.Text.Json.JsonDocument.Parse(await mailRequest.Content.ReadAsStreamAsync());
                var messagesArray = mailData.RootElement.GetProperty("value").EnumerateArray();

                foreach (var m in messagesArray)
                {
                    var message = new MailMessage();
                    message.Subject = m.GetProperty("subject").GetString();
                    message.Sender = m.GetProperty("sender").GetProperty("emailAddress").GetProperty("address").GetString();
                    message.ReceivedTime = m.GetProperty("receivedDateTime").GetDateTime();
                    messages.Add(message);
                }
            }
        }
        catch (AccessTokenNotAvailableException ex)
        {
            // Tokens are not valid - redirect the user to log in again
            ex.Redirect();
        }
    }

    public class MailMessage
    {
        public string Subject;
        public string Sender;
        public DateTime ReceivedTime;
    }
}
```

Now launch the app again. You'll notice that you're prompted to give the app access to read your mail. This is expected when an app requests the `Mail.Read` scope.

After granting consent, navigate to the "Fetch data" page to read some email.

:::image type="content" source="./media/tutorial-blazor-webassembly/final-app.png" alt-text="Screenshot of the final app. It has a heading that says Hello Nicholas and it shows a list of emails belonging to Nicholas.":::

## Next steps

> [!div class="nextstepaction"] 
> [Microsoft identity platform best practices and recommendations](./identity-platform-integration-checklist.md)
