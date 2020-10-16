---
title: Tutorial - Sign in users and call a protected API from a Blazor WebAssembly app 
titleSuffix: Microsoft identity platform
description: In this tutorial, sign in users and call a protected API using the Microsoft identity platform in a Blazor WebAssembly app.
author: knicholasa

ms.author: nichola
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 10/16/2020
#Customer intent: As a developer, I want to add authentication and authorization to a Blazor WebAssembly app and call Microsoft Graph.
---

# Tutorial: Sign in users and call a protected API from a Blazor WebAssembly app

[Blazor WebAssembly](aspnet/core/blazor#blazor-webassembly) is a single-page app framework for building interactive client-side web apps with .NET. In this tutorial, you create an app that signs in users and retrieves data from a protected API from a Blazor WebAssembly (Blazor WASM) app with the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/).

In this tutorial, you will:

> [!div class="checklist"]
>
> * Create a new Blazor WebAssembly app configured to use Azure Active Directory (Azure AD) for [authentication and authorization](authentication-vs-authorization.md) using the Microsoft identity platform
> * Retrieve data from a protected web API, in this case [Microsoft Graph](https://docs.microsoft.com/graph/overview)

## Prerequisites

* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1)
* An Azure AD tenant where you can register an app. If you don't have access to an Azure AD tenant, you can get one by registering with the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) or by creating an [Azure free account](https://azure.microsoft.com/free).

## Register the app in the Azure portal

Every app that uses Azure Active Directory (Azure AD) for authentication must be registered with Azure AD. Follow the instructions in [Register an application](quickstart-register-app.md) with these specifications:

- For **Supported account types**, select **Accounts in this organizational directory only**.
- Leave the **Redirect URI** drop down set to **Web** and enter `https://localhost:5001/authentication/login-callback`. The default port for an app running on Kestrel is 5001. If the app is available on a different port, specify that port number instead of `5001`.

Once registered, in **Authentication** > **Implicit grant**, select the check boxes for **Access tokens** and **ID tokens**, and then select the **Save** button.

## Create the app using the .NET Core CLI

To create the app you need the latest Blazor templates. You can install them for the .NET Core CLI with the following command:

```dotnetcli
dotnet new --install Microsoft.AspNetCore.Components.WebAssembly.Templates::3.2.1
```

Then run the following command to create the application. Replace the placeholders in the command with the proper information from your app's overview page and execute the command in a command shell. The output location specified with the `-o|--output` option creates a project folder if it doesn't exist and becomes part of the app's name.

```dotnetcli
dotnet new blazorwasm2 --auth SingleOrg --calls-graph -o {APP NAME} --client-id "{CLIENT ID}" --tenant-id "{TENANT ID}"
```

| Placeholder   | Azure portal name       | Example                                |
| ------------- | ----------------------- | -------------------------------------- |
| `{APP NAME}`  | &mdash;                 | `BlazorWASMSample`                         |
| `{CLIENT ID}` | Application (client) ID | `41451fa7-0000-0000-0000-69eff5a761fd` |
| `{TENANT ID}` | Directory (tenant) ID   | `e86c78e2-0000-0000-0000-918e0565a45e` |

## Test the app

You can now build and run the app. When you run this template app, you must specify the framework to run using --framework. This tutorial uses the .NET Standard 2.1, but the template supports other frameworks as well.

```dotnetcli
dotnet run --framework netstandard2.1
```

In your browser, navigate to `https://localhost:5001`, and log in using an Azure AD user account to see the app running and logging users it with the Microsoft identity platform.

The individual components of this template that enable logins with Azure AD using the Microsoft identity platform are explained in the [ASP.NET doc on this topic](aspnet/core/blazor/security/webassembly/standalone-with-azure-active-directory#authentication-package).

## Retrieving data from Microsoft Graph

[Microsoft Graph](/graph/overview) offers a range of APIs that provide access to Microsoft 365 data of users in your tenant. By using the Microsoft identity platform as the identity provider for your app, you have easier access to this information since Microsoft Graph directly supports the tokens issued by the Microsoft identity platform. In this section, you add code can display the signed in user's emails on the application's "Fetch data" page.

Before you start, log out of your app since you'll be making changes to the required permissions, and your current token won't work. If you haven't already, run your app again and select **Log out** before updating the code below.

Now you will update your app's registration and code to pull a user's emails and display the messages within the app.

First add the Mail.Read API permission to the app's registration so that Azure AD is aware that the app will request to access its users' email.

1. In the Azure portal, select your app in **App registrations**.
1. Under **Manage**, select **API permissions**.
1. Select **Add a permission** > **Microsoft Graph**.
1. Select **Delegated Permissions**, then search for and select the **Mail.Read** permission.
1. Select **Add permissions**.

Next, add the following to your project's *.csproj* file in the netstandard2.1 **ItemGroup**. This will allow you to create the custom HttpClient in the next step.

```xml
<PackageReference Include="Microsoft.Extensions.Http" Version="3.1.7" />
```

Then modify the code as specified in the next few steps. These changes will add [access tokens](access-tokens.md) to the outgoing requests sent to the Microsoft Graph API. This pattern is discussed in more detail in [ASP.NET Core Blazor WebAssembly additional security scenarios](aspnet/core/blazor/security/webassembly/additional-scenarios).

First, create a new file named *GraphAuthorizationMessageHandler.cs* with the following code. This handler will be user to add an access token for the `User.Read` and `Mail.Read` scopes to outgoing requests to the Microsoft Graph API.

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

Then, replace the `Main` method in *Program.cs* with the following code. This code makes use of the new `GraphAPIAuthorizationMessageHandler` and adds `User.Read` and `Mail.Read` as default scopes the app will request when the user first signs in.

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("app");

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

Finally, replace the *FetchData.razor* page with the following code. This code fetches user email data from the Microsoft Graph API and displays them as a list. In `OnInitializedAsync`, the new `HttpClient` that uses the proper access token is created and used to make the request to the Microsoft Graph API.

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

Now launch the app again. You'll notice that you're prompted to give the app access to read your mail. This is expected when an app requests the Mail.Read scope.

After granting consent, navigate to the "Fetch data" page to read some email.

:::image type="content" source="./media/tutorial-blazor-webassembly/final-app.png" alt-text="Screenshot of the final app. It has a heading that says Hello Nicholas and it shows a list of emails belonging to Nicholas.":::

## Next steps

- [Microsoft identity platform best practices and recommendations](./identity-platform-integration-checklist.md)
- [Introduction to ASP.NET Core Blazor](aspnet/core/blazor)
