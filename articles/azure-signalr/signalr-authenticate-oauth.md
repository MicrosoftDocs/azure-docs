---
title: Tutorial for authenticating Azure SignalR Service clients with OAuth | Microsoft Docs
description: Learn how to authenticate Azure SignalR Service clients with OAuth
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 
ms.service: signalr
ms.workload: tbd
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/17/2018
ms.author: wesmc
#Customer intent: As an ASP.NET Core developer, I want to provide real authentication for my clients before allowing them to push content updates.
---
# Tutorial: Azure SignalR Service authentication with OAuth

This tutorial builds on the chat room application introduced in the quickstart. If you have not completed [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md), complete that first. 

In this tutorial you'll learn how to implement your own authentication and integrate it with the Azure SignalR Service. 

The authentication used in the quickstart's chat room application is too simple for real-world scenarios. In the application, you claim who you are, and the authentication API on the server simply accepts that, and gives you a token with that name. This is not very useful in real-world applications where a rogue user would impersonate other users to access sensitive data. 

[GitHub](https://github.com/) provides authentication APIs based on a popular industry-standard protocol called [OAuth](https://oauth.net/). These APIs allow third-party applications to authenticate GitHub accounts. In this tutorial you will use these APIs to require true authentication through a Guthub account before allowing client logins to the chat room application. 

For more information on the OAuth authentication APIs provided through GitHub, see [Basics of Authentication](https://developer.github.com/v3/guides/basics-of-authentication/).

The code for this tutorial is available in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/GitHubChat).


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register a new OAuth app with your GitHub account
> * Update your authentication controller to support OAuth authentication


## Prerequisites

To complete this tutorial, you must have the following prerequisites:

* An account created on [GitHub](https://github.com/). 

* This tutorial continues to update the *ContosoTeamStats* ASP.NET web app created in the [ASP.NET quickstart for Azure Redis Cache](cache-web-app-howto.md). If you have not completed those steps to set up your cache and Azure App service, complete that first.
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
    * ASP.NET and web development
    * Azure Development
    * .NET desktop development with SQL Server Express LocalDB or [SQL Server 2017 Express edition](https://www.microsoft.com/sql-server/sql-server-editions-express).
* You need an Azure account to complete the quickstart. You can [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.

## Create an OAuth app

1. Open a web browser and navigate to `https://github.com` and sign into your account.

2. For your account, navigate to **Settings** > **Developer settings** and click **Register a new application**, or **New OAuth App** under *OAuth Apps*.

3. Use the following settings for the new OAuth App, then click **Register application**:

    | Setting Name | Suggested Value | Description |
    | ------------ | --------------- | ----------- |
    | Application name | *Azure SignalR Chat* | The github user should be able to recognize and trust the app that he is authenticating with.   |
    | Homepage URL | *http://localhost:5000/home* | |
    | Application description | *A chat room sample using the Azure SignalR Service with Github authentication* | A useful decription of the application that will help your application users understand the context of the authentication being used. |
    | Authorization callback URL | *http://localhost:5000/api/auth/callback* | This is the most important setting for your OAuth application. It's the callback URL that GitHub returns the user to after successful authentication. |

4. Once the new OAuth app registration is complete, copy the *Client ID* and *Client Secret*, you'll use these later when implementing the OAuth flow.

## Implement the OAuth flow

### Prompt the user for GitHub authentication

The first step of OAuth flow is to prompt the user to login with a GitHub account. This can be done by redirecting the user to the GitHub login page.

1. Open *wwwroot\index.html* and remove the JavaScript code that prompts for the username.

    Remove the following code from *index.html*:

    ```javascript
    // Get the user name and store it to prepend to messages.
    var username = generateRandomName();
    var promptMessage = 'Enter your name:';
    do {
        username = prompt(promptMessage, username);
        if (!username || username.startsWith('_') || username.indexOf('<') > -1 || username.indexOf('>') > -1) {
            username = '';
            promptMessage = 'Invalid input. Enter your name:';
        }
    } while(!username)
    ```

2. Near the bottom of *index.html*, replace the JavaScript call to `getAccessToken()` with the following code. 

    Before:

    ```javascript
    getAccessToken(`/api/auth/chat?uid=${username}`)
        .then(function(endpoint) {
            accessToken = endpoint.accessToken;
            return startConnection(endpoint.serviceUrl, bindConnectionMessage);
        })
        .then(onConnected)
        .catch(onConnectionError);
    ```    

    After:

    ```javascript
    var accessToken = getCookie('githubchat_access_token'), serviceUrl = getCookie('githubchat_service_url'), username = getCookie('githubchat_username');
    if (!accessToken) {
        appendMessage('_BROADCAST_', 'You\'re not logged in. Click <a href="/api/auth/login">here</a> to login with GitHub.');
    } else {
        startConnection(serviceUrl, bindConnectionMessage)
            .then(onConnected)
            .catch(() => appendMessage('_BROADCAST_', 'You\'re not logged in. Click <a href="/api/auth/login">here</a> to login with GitHub.'));
    }
    ```

    This new code looks for stored cookies representing the: *accessToken*, *serviceURL*, and *username*. If they are not present, the user is provided a link to login through our *AuthController* in the web app.

### Handle OAuth in the controller

In this section, you will update the *AuthController* class to support OAuth authentication for the chat room application.

1. Open *Controllers\AuthController.cs* and add the following method to the *AuthController* class to handle the login request. This method redirects the client login to GitHub's OAuth API. Notice the *Client ID* from the OAuth app you registered is passed in to the GitHub OAuth API:

    ```csharp
    [HttpGet("login")]
    public IActionResult Login()
    {
        return Redirect($"https://github.com/login/oauth/authorize?scope=user:email&client_id={_clientId}");
    }
    ```

2. Add the following code to the *AuthController* class. This code supports the settings for the OAuth app you registered on GitHub.

    Add references to these namespaces:

    ```csharp
    using System.Net.Http;
    using System.Net.Http.Headers;
    ```

    Add these members to the *AuthController* class:

    ```csharp
    private readonly HttpClient _httpClient;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public AuthController(IConfiguration config)
    {
        var connStr = config[Constants.AzureSignalRConnectionStringKey];
        _endpointProvider = CloudSignalR.CreateEndpointProviderFromConnectionString(connStr);
        _tokenProvider = CloudSignalR.CreateTokenProviderFromConnectionString(connStr);
        _clientId = config[Constants.GitHubClientIdKey];
        _clientSecret = config[Constants.GitHubClientSecretKey];
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "GitHubChat");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
    ```

3. If authentication is successful with the GitHub OAuth API, then GitHub will return a code to the *Authorization callback URL* you configured for the OAuth app. Add the following code to the *AuthController* class to handle this callback:

    Add references to these namespaces:

    ```csharp
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.Text;
    ```

    Add these members to the *AuthController* class:

    ```csharp
    class UserInfo
    {
        public string Name { get; set; }
        public string Company { get; set; }
    }
    
    private async Task<string> GetToken(string code)
    {
        var body = JsonConvert.SerializeObject(new Dictionary<string, string> {
            { "client_id", _clientId },
            { "client_secret", _clientSecret },
            { "code", code },
            { "accept", "json" }
        });
        var response = await _httpClient.PostAsync("https://github.com/login/oauth/access_token", new StringContent(body, Encoding.UTF8, "application/json"));
        var tokenString = await response.Content.ReadAsStringAsync();
        var tokenObject = JsonConvert.DeserializeObject<Dictionary<string, string>>(tokenString);
        return tokenObject["access_token"];
    }

    private async Task<UserInfo> GetUser(string token)
    {
        var userString = await _httpClient.GetStringAsync($"https://api.github.com/user?access_token={token}");
        var userObject = JsonConvert.DeserializeObject<Dictionary<string, string>>(userString);
        return new UserInfo
        {
            Name = userObject["login"],
            Company = userObject["company"]
        };
    }
    
    [HttpGet("callback")]
    public async Task<IActionResult> Callback(string code)
    {
        var hubName = "chat";
        var githubToken = await GetToken(code);
        var user = await GetUser(githubToken);
        var serviceUrl = _endpointProvider.GetClientEndpoint(hubName);
        var accessToken = _tokenProvider.GenerateClientAccessToken(hubName, new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Name),
            new Claim("Company", user.Company ?? "")
        });
        Response.Cookies.Append("githubchat_access_token", accessToken);
        Response.Cookies.Append("githubchat_service_url", serviceUrl);
        Response.Cookies.Append("githubchat_username", user.Name);
        return Redirect("/");
    }
    ```

    After successful authentication, this code update uses the temporary authentication code returned from the GitHub OAuth API to send HTTP POST requests back to GitHub. These HTTP POST requests allow the *AuthController* class to get the following information about the GutHub user account being authenticated:

    * username
    * company
    * accessToken
    
    *AuthController* adds cookies to the client response to allow client-side code to use this information, along with the *serviceURL*, when pushing content updates with Azure SignalR Service.



## Next steps

In this tutorial, you added authentication with OAuth to provide a better approach to authentication with Azure SignalR Service. To learn more about using Azure SignalR Server, continue to the next tutorial that demonstrates integration with Azure Functions.

> [!div class="nextstepaction"]
> [Integrate Azure Functions with Azure SignalR Service](./signalr-integrate-functions.md)


