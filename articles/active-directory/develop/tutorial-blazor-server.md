---
title: Tutorial - Create a Blazor Server app that uses the Microsoft identity platform for authentication | Azure
description: In this tutorial, you set up authentication using the Microsoft identity platform in a Blazor Server app.
author: knicholasa

ms.author: nichola
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 09/14/2020
#Customer intent: As a developer, I want to add authentication to a Blazor app.
---

# Tutorial: Create a Blazor Server app that uses the Microsoft identity platform for authentication

Blazor Server provides support for hosting Razor components on the server in an ASP.NET Core app. In this tutorial, you learn how to implement authentication and retrieve data from Microsoft Graph in a Blazor Server app with the Microsoft identity platform.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a new Blazor Server app configured to use Azure Active Directory (Azure AD) for authentication
> * Handle both authentication and authorization using Microsoft.Identity.Web
> * Retrieve data from Microsoft Graph

## Prerequisites

- [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1)
- An Azure AD tenant where you can register an app. If you don’t have access to an Azure AD tenant, you can get one by registering with the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) or by creating an [Azure free account](https://azure.microsoft.com/free).
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) or [Visual Studio Code](https://code.visualstudio.com/)

## Option 1: Create the app using the .NET CLI and register it in the Azure portal

Every app that uses Azure Active Directory (Azure AD) for authentication must be registered with Azure AD. You can create a new registration and then use the [.NET CLI](/dotnet/core/tools/) to create a new Blazor app using the following instructions. If you're using Visual Studio 2019, you can skip this step and complete step 2.

First, follow the instructions in [Register an application](quickstart-register-app.md) with the following settings:

- For **Supported account types**, select **Accounts in this organizational directory only**.
- Leave the **Redirect URI** drop down set to **Web** and enter `https://localhost:5001/signin-oidc`. The default port for an app running on Kestrel is 5001. If the app is available on a different port, specify that port number instead of `5001`.
- Disable the **Permissions** > **Grant admin consent to openid and offline_access permissions** check box.

Once the app is registered, record the following GUID values for use in a later step:

* **Application (client) ID**
* **Directory (tenant) ID**

In **Authentication** > **Platform configurations** > **Web**:

1. Confirm the **Redirect URI** of `https://localhost:{PORT}/signin-oidc` is present.
1. For **Implicit grant**, select the check boxes for **Access tokens** and **ID tokens**.
1. Leave the other settings at their default values and select the **Save** button.

Create the app in an empty folder. Replace the placeholders in the following command with the information recorded earlier and execute the command in a command shell:

```dotnetcli
dotnet new blazorserver -au SingleOrg --client-id "{CLIENT ID}" -o {APP NAME} --tenant-id "{TENANT ID}"
```

| Placeholder   | Azure portal name       | Example                                |
| ------------- | ----------------------- | -------------------------------------- |
| `{APP NAME}`  | &mdash;                 | `BlazorSample`                         |
| `{CLIENT ID}` | Application (client) ID | `41451fa7-0000-0000-0000-69eff5a761fd` |
| `{TENANT ID}` | Directory (tenant) ID   | `e86c78e2-0000-0000-0000-918e0565a45e` |

The output location specified with the `-o|--output` option creates a project folder if it doesn't exist and becomes part of the app's name.

> [!NOTE]
> If the port wasn't configured earlier with the app's known port, return to the app's registration in the Azure portal and update the redirect URI with the correct port.

You can now run the app and log in using an Azure AD user account. You can skip option two and move on to simplifying the code with Microsoft.Identity.Web.

## Option 2: Register and create the app using Visual Studio 2019

You can use Visual Studio's built in templates to create a Blazor server app. Skip this step if you have already completed option 1. To do so:

1. Create a new project. Search for a Blazor template, and select the Blazor Server options from the results. Select **Next**.
2. Give your project a name and confirm the save location. Select **Create**.
2. Choose **Blazor Server App** and select **Change** under **Authentication** type from **No authentication** to **Work or School Accounts**.
3. Select **Create**.

You now have a working app sample that will sign users in using the Microsoft identity platform.

Try running the app. The first time it runs, you should see a screen that prompts you to provide consent for this app to access your directory information. This is part of the Microsoft identity platform's [permissions and consent](./v2-permissions-and-consent.md) process. Granting consent is necessary for the app to have permission to retrieve data from the directory on behalf of the user.

![Picture of dialog box asking the user for permission for the app to sign the user in and read their profile](./media/tutorial-blazor-server/consent-dialog-1.png)

The Visual Studio creation tool automatically registered this application in your tenant. Applications that authenticate users always need to be registered with the identity provider they use. You can verify that this registration happened successfully by going to the Azure portal, navigating to Azure Active Directory, and viewing your registered apps. The TenantID and ClientID found there will match the settings defined in your *appsettings.json* file.

![Screenshot of the completed app. The webpage says "Hello, world! Welcome to your new app." There is a menu bar on the side with buttons for "home", "counter", and "fetch data".](./media/tutorial-blazor-server/final-app-1.png)

## Simplify the code by using Microsoft.Identity.Web

The apps created in the steps above use [ASP.NET Identity](/aspnet/identity/overview/getting-started/introduction-to-aspnet-identity) for authentication. You will need to add more code that uses the [Microsoft Authentication Library (MSAL)](./msal-overview.md) to get authorization for your users to access protected APIs. In other words, **authentication** and **authorization** are done separately, and require more code.

However, you can instead use the [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web) authentication and token management library to handle both. **Microsoft.Identity.Web** is meant to abstract away the complexities and allow you to quickly implement authentication and authorization, as shown here. You can use the following instructions to update your code and make use of Microsoft.Identity.Web.

> [!NOTE]
> Microsoft.Identity.Web is currently in preview.

First, download the following NuGet packages to have access to the libraries:
-	Microsoft.Identity.Web (0.2.2 preview)
-	Microsoft.Identity.Web.UI (0.2.2 preview)

If using .NET CLI, you can find instructions for downloading the packages on [https://www.nuget.org/packages/Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web).

Or you can use Visual Studio:

![Screenshot of Visual Studio's package browser, with the Microsoft.Identity.Web package highlighted.](./media/tutorial-blazor-server/nuget-package-1.png)

![Screenshot of Visual Studio's package browser, with the Microsoft.Identity.Web.UI package highlighted.](./media/tutorial-blazor-server/nuget-package-2.png)

Next, perform a couple small code changes to swap out the old authentication code and plug-in the new code.

Open *Startup.cs* and replace this code:

```csharp
services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
    .AddAzureAD(options => Configuration.Bind("AzureAd", options));

services.AddControllersWithViews(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});
```

With this code:

```csharp
services.AddMicrosoftWebAppAuthentication(Configuration);
services.AddControllersWithViews(options =>
{
   var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
        options.Filters.Add(new AuthorizeFilter(policy));
        }).AddMicrosoftIdentityUI();
```

Then, configure your app to use the Microsoft identity platform endpoints for sign-in and sign-out. Open the *LoginDisplay.razor* file and update as follows:

```html
<AuthorizeView>
    <Authorized>
        Hello, @context.User.Identity.Name!
        <a href="MicrosoftIdentity/Account/SignOut">Log out</a>
    </Authorized>
    <NotAuthorized>
        <a href="MicrosoftIdentity/Account/SignIn">Log in</a>
    </NotAuthorized>
</AuthorizeView>
```

You might notice no dedicated pages for sign-in and sign-out. Instead, they're built into the Microsoft.Identity.Web library. So as long as you update the Area to be "MicrosoftIdentity", no other change is needed.

As you can see, with a couple of lines of code, you're able to leverage the Microsoft.Identity.Web library to authenticate against Azure AD and take advantage of easy authentication and authorization with MSAL.

## Retrieving data from Microsoft Graph

[Microsoft Graph](/graph/overview) offers a wide range of APIs for building rich and immersive apps with your users' Microsoft 365 data. Using the Microsoft identity platform as the identity provider for your app enables easier access to this information as Microsoft Graph directly supports the tokens issues by the Microsoft identity platform. In this section, you learn how to add access to Microsoft Graph data to your app.

Before you start, log out of your app since be making changes to the required permissions, and your current token won't work.

In the following steps, you pull a user's emails and display them within the app. To achieve this, first extend the app registration permissions in Azure AD to enable access to the email data. Then, add code to the Blazor app to retrieve and display this data in one of the pages:

1. In the Azure portal search for and select **Azure Active Directory**.
2. Under **Manage**, select **App registrations** and select your new app.
3. Go to **API Permissions**.
4. Select Add New Permission and then select **Microsoft Graph**.
5. Select **Delegated Permissions** and select the "Mail.Read" permission.

Now create client secret since the app needs a way to validate the token and retrieve the data without any user interaction:

1. Within the same app registration, open the **Certificates & secrets** tab.
2. Create a new secret that never expires
3. Copy the **Value** to your clipboard. You can’t access it again once you navigate away from this pane. However, you can recreate it as needed.

Navigate back to your Blazor app in your editor and add the client secret to the *appsettings.json* file. Inside the `AzureAD` config section, add the following line:

```yaml
"ClientSecret": "<your secret>"
```

In the *Startup.cs* file, update your code so it fetches the appropriate token with the right permissions, storing it in a cache for later use when you make the call to Microsoft Graph. You add an **HttpClient** to the services pipeline to efficiently make HTTP calls to Microsoft Graph in a later step.

Add the following to the end of the **ConfigureServices** method:

 ```csharp
services.AddMicrosoftWebAppAuthentication(Configuration)
    .AddMicrosoftWebAppCallsWebApi(Configuration, new string[] { "User.Read", "Mail.Read" })
    .AddInMemoryTokenCaches();

services.AddHttpClient();
```

Next, update the code in the *FetchData.razor* file to retrieve email data instead of the default (random) weather details. Replace the code in that file with the following:

```csharp
@page "/fetchdata"

@inject IHttpClientFactory HttpClientFactory
@inject Microsoft.Identity.Web.ITokenAcquisition TokenAcquisitionService

<h1>Weather forecast</h1>

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
        _httpClient = HttpClientFactory.CreateClient();


        // get a token
        var token = await TokenAcquisitionService.GetAccessTokenForUserAsync(new string[] { "User.Read", "Mail.Read" });

        // make API call
        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
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

    public class MailMessage
    {
        public string Subject;
        public string Sender;
        public DateTime ReceivedTime;
    }
}

```

> [!NOTE]
> If you stop the app while using an in-memory token cache, the token cache will be cleared but the application cookie may persist. To avoid this, you can use a persistent token cache, or clear you cookies from the browser session to avoid an abnormal app state.

Launch the app and ensure that you're logged out since the current token won’t have the right permissions and you’ve changed quite a few things in the code. You’ll notice that the next time you log in, you're prompted for the newly added permissions, indicating that everything is working as expected. Now, beyond basic user profile data, the app is requesting access to email data.

![Image of a dialog box asking the user permission for the Blazor app to maintain access to data you have given it access to, sign you in and read your profile, and read your mail.](./media/tutorial-blazor-server/consent-dialog-2.png)

After granting consent, navigate to the "Fetch Data" page to read some email.

![Screenshot of the final app. The webpage is titled "Weather forecast". It has a heading that says "Hello Christos Matskas" and it shows a list of emails belonging to Christos.](./media/tutorial-blazor-server/final-app-2.png)

## Additional considerations

- Unlike normal web apps that can support dynamic or incremental consent, in Blazor you need to request all the scopes necessary for your application up front. Failing to do so will cause an error as the TokenAcquisition method will be unable to validate the token against the new permissions. This part of the Blazor mechanics is something to keep in mind when creating your apps.

- In general, you should leverage the Microsoft Graph SDK, which simplifies the interaction with Microsoft Graph and provides all the data objects you’ll need to serialize and deserialize from, rather than creating custom HTTP requests.

## Next steps

- [Microsoft identity platform best practices and recommendations](./identity-platform-integration-checklist.md)
