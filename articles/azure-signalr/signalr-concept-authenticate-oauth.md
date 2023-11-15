---
title: Guide for authenticating Azure SignalR Service clients
description: Learn how to implement your own authentication and integrate it with Azure SignalR Service by following the end-to-end example.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 11/13/2023
ms.author: lianwei
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Azure SignalR Service authentication

This tutorial continues on the chat room application introduced in [Create a chat room with SignalR Service](signalr-quickstart-dotnet-core.md). Complete that quickstart first to set up your chat room.

In this tutorial, you can discover the process of creating your own authentication method and integrate it with the Microsoft Azure SignalR Service.

The authentication initially used in the quickstart's chat room application is too simple for real-world scenarios. The application allows each client to claim who they are, and the server simply accepts that. This approach lacks effectiveness in real-world, as it fails to prevent malicious users who might assume false identities from gaining access to sensitive data.

[GitHub](https://github.com/) provides authentication APIs based on a popular industry-standard protocol called [OAuth](https://oauth.net/). These APIs allow third-party applications to authenticate GitHub accounts. In this tutorial, you can use these APIs to implement authentication through a GitHub account before allowing client logins to the chat room application. After authenticating a GitHub account, the account information will be added as a cookie to be used by the web client to authenticate.

For more information on the OAuth authentication APIs provided through GitHub, see [Basics of Authentication](https://developer.github.com/v3/guides/basics-of-authentication/).

You can use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

The code for this tutorial is available for download in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/GitHubChat).

![OAuth Complete hosted in Azure](media/signalr-concept-authenticate-oauth/signalr-oauth-complete-azure.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a new OAuth app with your GitHub account
> - Add an authentication controller to support GitHub authentication
> - Deploy your ASP.NET Core web app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you must have the following prerequisites:

- An account created on [GitHub](https://github.com/)
- [Git](https://git-scm.com/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)
- [Azure Cloud Shell](../cloud-shell/quickstart.md) configured for the bash environment.
- Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) GitHub repository.

## Create an OAuth app

1. Open a web browser and navigate to `https://github.com` and sign into your account.

2. For your account, navigate to **Settings** > **Developer settings** > **OAuth Apps**, and select **New OAuth App** under _OAuth Apps_.

3. Use the following settings for the new OAuth App, then select **Register application**:

   | Setting Name               | Suggested Value                                                                 | Description                                                                                                                                                                                                                                                                             |
   | -------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Application name           | _Azure SignalR Chat_                                                            | The GitHub user should be able to recognize and trust the app they're authenticating with.                                                                                                                                                                                              |
   | Homepage URL               | `https://localhost:5001`                                                         |                                                                                                                                                                                                                                                                                         |
   | Application description    | _A chat room sample using the Azure SignalR Service with GitHub authentication_ | A useful description of the application that helps your application users understand the context of the authentication being used.                                                                                                                                                  |
   | Authorization callback URL | `https://localhost:5001/signin-github`                                           | This setting is the most important setting for your OAuth application. It's the callback URL that GitHub returns the user to after successful authentication. In this tutorial, you must use the default callback URL for the _AspNet.Security.OAuth.GitHub_ package, _/signin-github_. |

4. Once the new OAuth app registration is complete, add the _Client ID_ and _Client Secret_ to Secret Manager using the following commands. Replace _Your_GitHub_Client_Id_ and _Your_GitHub_Client_Secret_ with the values for your OAuth app.

   ```dotnetcli
   dotnet user-secrets set GitHubClientId Your_GitHub_Client_Id
   dotnet user-secrets set GitHubClientSecret Your_GitHub_Client_Secret
   ```

## Implement the OAuth flow

Let's reuse the chat app created in tutorial [Create a chat room with SignalR Service](signalr-quickstart-dotnet-core.md).

### Update `Program.cs` to support GitHub authentication

1. Add a reference to the latest _Microsoft.AspNetCore.Authentication.Cookies_ and _AspNet.Security.OAuth.GitHub_ packages and restore all packages.

   ```dotnetcli
   dotnet add package Microsoft.AspNetCore.Authentication.Cookies
   dotnet add package AspNet.Security.OAuth.GitHub
   ```

1. Open _Program.cs_, and update the code to the following code snippet:

    ```csharp
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authentication.OAuth;

    using System.Net.Http.Headers;
    using System.Security.Claims;

    var builder = WebApplication.CreateBuilder(args);

    builder.Services
        .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie()
        .AddGitHub(options =>
        {
            options.ClientId = builder.Configuration["GitHubClientId"] ?? "";
            options.ClientSecret = builder.Configuration["GitHubClientSecret"] ?? "";
            options.Scope.Add("user:email");
            options.Events = new OAuthEvents
            {
                OnCreatingTicket = GetUserCompanyInfoAsync
            };
        });

    builder.Services.AddControllers();
    builder.Services.AddSignalR().AddAzureSignalR();

    var app = builder.Build();

    app.UseHttpsRedirection();
    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthorization();

    app.MapControllers();
    app.MapHub<ChatSampleHub>("/chat");

    app.Run();

    static async Task GetUserCompanyInfoAsync(OAuthCreatingTicketContext context)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

        var response = await context.Backchannel.SendAsync(request,
            HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
        var user = await response.Content.ReadFromJsonAsync<GitHubUser>();
        if (user?.company != null)
        {
            context.Principal?.AddIdentity(new ClaimsIdentity(new[]
            {
                new Claim("Company", user.company)
            }));
        }
    }

    class GitHubUser
    {
        public string? company { get; set; }
    }
    ```

    Inside the code, `AddAuthentication` and `UseAuthentication` are used to add authentication support with the GitHub OAuth app, and `GetUserCompanyInfoAsync` helper method is sample code showing how to load the company info from GitHub OAuth and save into user identity. You might also notice that `UseHttpsRedirection()` is used since GitHub OAuth set `secure` cookie that only passes through to secured `https` scheme. Also don't forget to update the local `Properties/lauchSettings.json` to add https endpoint:

    ```json
    {
      "profiles": {
        "GitHubChat" : {
          "commandName": "Project",
          "launchBrowser": true,
          "environmentVariables": {
            "ASPNETCORE_ENVIRONMENT": "Development"
          },
          "applicationUrl": "http://0.0.0.0:5000/;https://0.0.0.0:5001/;"
        }
      }
    }
    ```

### Add an authentication Controller

In this section, you implement a `Login` API that authenticates clients using the GitHub OAuth app. Once authenticated, the API adds a cookie to the web client response before redirecting the client back to the chat app. That cookie is then used to identify the client.

1. Add a new controller code file to the _GitHubChat\Controllers_ directory. Name the file _AuthController.cs_.

2. Add the following code for the authentication controller. Make sure to update the namespace, if your project directory wasn't _GitHubChat_:

    ```csharp
    using AspNet.Security.OAuth.GitHub;

    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Mvc;

    namespace GitHubChat.Controllers
    {
        [Route("/")]
        public class AuthController : Controller
        {
            [HttpGet("login")]
            public IActionResult Login()
            {
                if (User.Identity == null || !User.Identity.IsAuthenticated)
                {
                    return Challenge(GitHubAuthenticationDefaults.AuthenticationScheme);
                }

                HttpContext.Response.Cookies.Append("githubchat_username", User.Identity.Name ?? "");
                HttpContext.SignInAsync(User);
                return Redirect("/");
            }
        }
    }
    ```

3. Save your changes.

### Update the Hub class

By default when a web client attempts to connect to SignalR Service, the connection is granted based on an access token that is provided internally. This access token isn't associated with an authenticated identity.
Basically, it's anonymous access.

In this section, you turn on real authentication by adding the `Authorize` attribute to the hub class, and updating the hub methods to read the username from the authenticated user's claim.

1. Open _Hub\ChatSampleHub.cs_ and update the code to the below code snippet. The code adds the `Authorize` attribute to the `ChatSampleHub` class, and uses the user's authenticated identity in the hub methods. Also, the `OnConnectedAsync` method is added, which logs a system message to the chat room each time a new client connects.

    ```csharp
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.SignalR;

    [Authorize]
    public class ChatSampleHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return Clients.All.SendAsync("broadcastMessage", "_SYSTEM_", $"{Context.User?.Identity?.Name} JOINED");
        }

        // Uncomment this line to only allow user in Microsoft to send message
        //[Authorize(Policy = "Microsoft_Only")]
        public Task BroadcastMessage(string message)
        {
            return Clients.All.SendAsync("broadcastMessage", Context.User?.Identity?.Name, message);
        }

        public Task Echo(string message)
        {
            var echoMessage = $"{message} (echo from server)";
            return Clients.Client(Context.ConnectionId).SendAsync("echo", Context.User?.Identity?.Name, echoMessage);
        }
    }
    ```

1. Save your changes.

### Update the web client code

1. Open _wwwroot\index.html_ and replace the code that prompts for the username with code to use the cookie returned by the authentication controller.

    Update the code inside function `getUserName` in _index.html_ to the following to use cookies:

    ```javascript
    function getUserName() {
      // Get the user name cookie.
      function getCookie(key) {
        var cookies = document.cookie.split(";").map((c) => c.trim());
        for (var i = 0; i < cookies.length; i++) {
          if (cookies[i].startsWith(key + "="))
            return unescape(cookies[i].slice(key.length + 1));
        }
        return "";
      }
      return getCookie("githubchat_username");
    }
    ```

1. Update `onConnected` function to remove the `username` parameter when invoking hub method `broadcastMessage` and `echo`:

    ```javascript
    function onConnected(connection) {
      console.log("connection started");
      connection.send("broadcastMessage", "_SYSTEM_", username + " JOINED");
      document.getElementById("sendmessage").addEventListener("click", function (event) {
        // Call the broadcastMessage method on the hub.
        if (messageInput.value) {
          connection.invoke("broadcastMessage", messageInput.value)
            .catch((e) => appendMessage("_BROADCAST_", e.message));
        }

        // Clear text box and reset focus for next comment.
        messageInput.value = "";
        messageInput.focus();
        event.preventDefault();
      });
      document.getElementById("message").addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("sendmessage").click();
          return false;
        }
      });
      document.getElementById("echo").addEventListener("click", function (event) {
        // Call the echo method on the hub.
        connection.send("echo", messageInput.value);

        // Clear text box and reset focus for next comment.
        messageInput.value = "";
        messageInput.focus();
        event.preventDefault();
      });
    }
    ```

1. At the bottom of _index.html_, update the error handler for `connection.start()` as shown below to prompt the user to sign in.

    ```javascript
    connection.start()
      .then(function () {
        onConnected(connection);
      })
      .catch(function (error) {
        console.error(error.message);
        if (error.statusCode && error.statusCode === 401) {
          appendMessage(
            "_BROADCAST_",
            "You\"re not logged in. Click <a href="/login">here</a> to login with GitHub."
          );
        }
      });
    ```

1. Save your changes.

## Build and Run the app locally

1. Save changes to all files.

1. Execute the following command to run the web app locally:

    ```dotnetcli
    dotnet run
    ```

    The app is hosted locally on port 5000 by default:

    ```output
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: http://0.0.0.0:5000
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: https://0.0.0.0:5001
    info: Microsoft.Hosting.Lifetime[0]
          Application started. Press Ctrl+C to shut down.
    info: Microsoft.Hosting.Lifetime[0]
          Hosting environment: Development
    ```

4. Launch a browser window and navigate to `https://localhost:5001`. Select the **here** link at the top to sign in with GitHub.

   ![OAuth Complete hosted in Azure](media/signalr-concept-authenticate-oauth/signalr-oauth-complete-azure.png)

   You're prompted to authorize the chat app's access to your GitHub account. Select the **Authorize** button.

   ![Authorize OAuth App](media/signalr-concept-authenticate-oauth/signalr-authorize-oauth-app.png)

   You're redirected back to the chat application and logged in with your GitHub account name. The web application determined your account name by authenticating you using the new authentication you added.

   ![Account identified](media/signalr-concept-authenticate-oauth/signalr-oauth-account-identified.png)

   With the chat app now performs authentication with GitHub and stores the authentication information as cookies, the next step involves deploying it to Azure.
   This approach enables other users to authenticate using their respective accounts and communicate from various workstations.

## Deploy the app to Azure

Prepare your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

In this section, you use the Azure CLI to create a new web app in [Azure App Service](../app-service/index.yml) to host your ASP.NET application in Azure. The web app is configured to use local Git deployment. The web app is also configured with your SignalR connection string, GitHub OAuth app secrets, and a deployment user.

When creating the following resources, make sure to use the same resource group that your SignalR Service resource resides in. This approach makes cleanup a lot easier later when you want to remove all the resources. The examples given assume you used the group name recommended in previous tutorials, _SignalRTestResources_.

### Create the web app and plan

Copy the text for the commands below and update the parameters. Paste the updated script into the Azure Cloud Shell, and press **Enter** to create a new App Service plan and web app.

```azurecli-interactive
#========================================================================
#=== Update these variable for your resource group name.              ===
#========================================================================
ResourceGroupName=SignalRTestResources

#========================================================================
#=== Update these variable for your web app.                          ===
#========================================================================
WebAppName=myWebAppName
WebAppPlan=myAppServicePlanName

# Create an App Service plan.
az appservice plan create --name $WebAppPlan --resource-group $ResourceGroupName \
    --sku FREE

# Create the new Web App
az webapp create --name $WebAppName --resource-group $ResourceGroupName \
    --plan $WebAppPlan
```

| Parameter         | Description                                                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ResourceGroupName | This resource group name was suggested in previous tutorials. It's a good idea to keep all tutorial resources grouped together. Use the same resource group you used in the previous tutorials. |
| WebAppPlan        | Enter a new, unique, App Service Plan name.                                                                                                                                                     |
| WebAppName        | This parameter is the name of the new web app and part of the URL. Make it unique. For example, signalrtestwebapp22665120.                                                                      |

### Add app settings to the web app

In this section, you add app settings for the following components:

- SignalR Service resource connection string
- GitHub OAuth app client ID
- GitHub OAuth app client secret

Copy the text for the commands below and update the parameters. Paste the updated script into the Azure Cloud Shell, and press **Enter** to add the app settings:

```azurecli-interactive
#========================================================================
#=== Update these variables for your GitHub OAuth App.                ===
#========================================================================
GitHubClientId=1234567890
GitHubClientSecret=1234567890

#========================================================================
#=== Update these variables for your resources.                       ===
#========================================================================
ResourceGroupName=SignalRTestResources
SignalRServiceResource=mySignalRresourcename
WebAppName=myWebAppName

# Get the SignalR primary connection string
primaryConnectionString=$(az signalr key list --name $SignalRServiceResource \
  --resource-group $ResourceGroupName --query primaryConnectionString -o tsv)

#Add an app setting to the web app for the SignalR connection
az webapp config appsettings set --name $WebAppName \
    --resource-group $ResourceGroupName \
    --settings "Azure__SignalR__ConnectionString=$primaryConnectionString"

#Add the app settings to use with GitHub authentication
az webapp config appsettings set --name $WebAppName \
    --resource-group $ResourceGroupName \
    --settings "GitHubClientId=$GitHubClientId"
az webapp config appsettings set --name $WebAppName \
    --resource-group $ResourceGroupName \
    --settings "GitHubClientSecret=$GitHubClientSecret"
```

| Parameter              | Description                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GitHubClientId         | Assign this variable the secret Client ID for your GitHub OAuth App.                                                                   |
| GitHubClientSecret     | Assign this variable the secret password for your GitHub OAuth App.                                                                    |
| ResourceGroupName      | Update this variable to be the same resource group name you used in the previous section.                                              |
| SignalRServiceResource | Update this variable with the name of the SignalR Service resource you created in the quickstart. For example, signalrtestsvc48778624. |
| WebAppName             | Update this variable with the name of the new web app you created in the previous section.                                             |

### Configure the web app for local Git deployment

In the Azure Cloud Shell, paste the following script. This script creates a new deployment user name and password that you use when deploying your code to the web app with Git. The script also configures the web app for deployment with a local Git repository, and returns the Git deployment URL.

```azurecli-interactive
#========================================================================
#=== Update these variables for your resources.                       ===
#========================================================================
ResourceGroupName=SignalRTestResources
WebAppName=myWebAppName

#========================================================================
#=== Update these variables for your deployment user.                 ===
#========================================================================
DeploymentUserName=myUserName
DeploymentUserPassword=myPassword

# Add the desired deployment user name and password
az webapp deployment user set --user-name $DeploymentUserName \
    --password $DeploymentUserPassword

# Configure Git deployment and note the deployment URL in the output
az webapp deployment source config-local-git --name $WebAppName \
    --resource-group $ResourceGroupName \
    --query [url] -o tsv
```

| Parameter              | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| DeploymentUserName     | Choose a new deployment user name.                                         |
| DeploymentUserPassword | Choose a password for the new deployment user.                             |
| ResourceGroupName      | Use the same resource group name you used in the previous section.         |
| WebAppName             | This parameter is the name of the new web app you created previously. |

Make a note the Git deployment URL returned from this command. You use this URL later.

### Deploy your code to the Azure web app

To deploy your code, execute the following commands in a Git shell.

1. Navigate to the root of your project directory. If you don't have the project initialized with a Git repository, execute following command:

   ```bash
   git init
   ```

2. Add a remote for the Git deployment URL you noted earlier:

   ```bash
   git remote add Azure <your git deployment url>
   ```

3. Stage all files in the initialized repository and add a commit.

   ```bash
   git add -A
   git commit -m "init commit"
   ```

4. Deploy your code to the web app in Azure.

   ```bash
   git push Azure main
   ```

   You're prompted to authenticate in order to deploy the code to Azure. Enter the user name and password of the deployment user you created above.

### Update the GitHub OAuth app

The last thing you need to do is update the **Homepage URL** and **Authorization callback URL** of the GitHub OAuth app to point to the new hosted app.

1. Open [https://github.com](https://github.com) in a browser and navigate to your account's **Settings** > **Developer settings** > **Oauth Apps**.

2. Select on your authentication app and update the **Homepage URL** and **Authorization callback URL** as shown below:

   | Setting                    | Example                                                             |
   | -------------------------- | ------------------------------------------------------------------- |
   | Homepage URL               | `https://signalrtestwebapp22665120.azurewebsites.net`               |
   | Authorization callback URL | `https://signalrtestwebapp22665120.azurewebsites.net/signin-github` |

3. Navigate to your web app URL and test the application.

   ![OAuth Complete hosted in Azure](media/signalr-concept-authenticate-oauth/signalr-oauth-complete-azure.png)

## Clean up resources

If you'll be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them with the next tutorial.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.

Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named _SignalRTestResources_. On your resource group in the result list, click **...** then **Delete resource group**.

![Delete](./media/signalr-concept-authenticate-oauth/signalr-delete-resource-group.png)

You're asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

In this tutorial, you added authentication with OAuth to provide a better approach to authentication with Azure SignalR Service. To learn more about using Azure SignalR Server, continue to the Azure CLI samples for SignalR Service.

> [!div class="nextstepaction"] 
> [Azure SignalR CLI Samples](./signalr-reference-cli.md)
