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

This tutorial builds on the chat room application introduced in the quickstart. If you have not completed [Quickstart: Create a chat room with SignalR Service](signalr-quickstart-dotnet-core.md), complete that first. 

In this tutorial you'll learn how to implement your own authentication and integrate it with the Azure SignalR Service. 

The authentication used in the quickstart's chat room application is too simple for real-world scenarios. In the application, you claim who you are, and the authentication API on the server simply accepts that, and gives you a token with that name. This is not very useful in real-world applications where a rogue user would impersonate others to access sensitive data. 

[GitHub](https://github.com/) provides authentication APIs based on a popular industry-standard protocol called [OAuth](https://oauth.net/). These APIs allow third-party applications to authenticate GitHub accounts. In this tutorial you will use these APIs to require true authentication through a Guthub account before allowing client logins to the chat room application. 

For more information on the OAuth authentication APIs provided through GitHub, see [Basics of Authentication](https://developer.github.com/v3/guides/basics-of-authentication/).

The code for this tutorial is available for download in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/GitHubChat).


![OAuth Complete hosted in Azure](media/signalr-authenticate-oauth/signalr-oauth-complete-azure.png)


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register a new OAuth app with your GitHub account
> * Update your authentication controller to support OAuth authentication
> * Deploy your ASP.NET Core web app to Azure


## Prerequisites

To complete this tutorial, you must have the following prerequisites:

* An account created on [GitHub](https://github.com/)
* [Git](https://git-scm.com/)
* [.NET Core SDK](https://www.microsoft.com/net/download/windows) 
* [Azure Cloud Shell configured](https://docs.microsoft.com/azure/cloud-shell/quickstart)
* Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) github repository.


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
    function getCookie(key) {
        var cookies = document.cookie.split(';').map(c => c.trim());
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].startsWith(key + '=')) return unescape(cookies[i].slice(key.length + 1));
        }
        return '';
    }

    function appendMessage(encodedName, encodedMsg) {
        var messageEntry = createMessageEntry(encodedName, encodedMsg);
        var messageBox = document.getElementById('messages');
        messageBox.appendChild(messageEntry);
        messageBox.scrollTop = messageBox.scrollHeight;
    }

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

    After successful authentication, this code uses the temporary authentication code returned from the GitHub OAuth API to send HTTP POST requests back to GitHub. These HTTP POST requests allow the *AuthController* class to get the following information about the GutHub user account being authenticated:

    * username
    * company
    * accessToken
    
    *AuthController* adds cookies to the client response for this information, along with the *serviceURL*. Client-side code will use the cookies when connecting and pushing content updates with Azure SignalR Service.


### Add the OAuth app secrets as constants

1. Open *Constants.cs* and add the following members to the *Constants* class:

    ```csharp
    public const string GitHubClientIdKey = "GitHubClientId";
    public const string GitHubClientSecretKey = "GitHubClientSecret";
    ```

2. In the command shell, add environment variables for the values of both of these constant string:

    set GitHubClientId=<Enter your Client ID here>
    set GitHubClientSecret=<Enter your Client Secret here>

    Replace the placeholder values, including the brackets (<>), using the Client ID, and Client Secret values of the new OAuth app you registered.


### Update the Hub class to support claims

The hub class needs to be updated to use the user's claim for identification. In the previous tutorial, the `broadcastMessage()` method used the name parameter to let caller claim their own identity. This was not secure. In this section, you will remove that name parameter and read the username from the authenticated user's claim.

1. Open *Hub\Chat.cs* and add the following updates for the *Chat* hub class:

    Add references to these namespaces:

    ```csharp
    using System.Linq;
    using System.Security.Claims;    
    using System.Threading.Tasks;
    ```

    Add and update these members of the *Chat* hub class:

    ```csharp
    public override Task OnConnectedAsync()
    {
        var username = Context.Connection.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
        return Clients.All.SendAsync("broadcastMessage", "_SYSTEM_", $"{username} JOINED");
    }

    // Uncomment this line to only allow user in Microsoft to send message
    // [Authorize(Policy = "Microsoft_Only")]
    public void broadcastMessage(string message)
    {
        var username = Context.Connection.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
        Clients.All.SendAsync("broadcastMessage", username, message);
    }

    public void echo(string message)
    {
        var username = Context.Connection.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
        Clients.Client(Context.ConnectionId).SendAsync("echo", username, message + " (echo from server)");
    }
    ```

2. Open *wwwroot\Index.html* and update the *onConnected** function to use the new signatures for calling *broadcastMessage*, and *echo*.

    ```javascript
    function onConnected(connection) {
        console.log('connection started');
        connection.send('broadcastMessage', '_SYSTEM_', username + ' JOINED');
        document.getElementById('sendmessage').addEventListener('click', function (event) {
            // Call the broadcastMessage method on the hub supporting claims.            
            if (messageInput.value) {
                connection.send('broadcastMessage', messageInput.value);
            }

            // Clear text box and reset focus for next comment.
            messageInput.value = '';
            messageInput.focus();
            event.preventDefault();
        });
        document.getElementById('message').addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('sendmessage').click();
                return false;
            }
        });
        document.getElementById('echo').addEventListener('click', function (event) {
            // Call the echo method on the hub supporting claims.
            connection.send('echo', messageInput.value);

            // Clear text box and reset focus for next comment.
            messageInput.value = '';
            messageInput.focus();
            event.preventDefault();
        });
    }
    ```


## Build and Run the app locally

1. Save changes to all files. 

2. Build the app using the .NET Core CLI, execute the following command in the command shell:

        dotnet build

3. Once the build successfully completes, execute the following command to run the web app locally:

        dotnet run

    By default, the app will be hosted locally on port 5000:

        E:\Testing\chattest>dotnet run
        Hosting environment: Production
        Content root path: E:\Testing\chattest
        Now listening on: http://localhost:5000
        Application started. Press Ctrl+C to shut down.    

4. Launch a browser window and navigate to `http://localhost:5000`. Click the **here** link atthe top to login with GitHub. 

    ![OAuth Complete hosted in Azure](media/signalr-authenticate-oauth/signalr-oauth-complete-azure.png)

    You will be prompted to authorize the chat app's access to your GitHub account. Click the **Authorize** button. You should be logged in with your GitHub account name. The web application determined you account name by authenticating you using the new authentication you added.

    Now that the chat app performs authentication with GitHub and stores the authentication information as cookies, we should deploy it to Azure so other users can authenticate with their accounts and communicate from other workstations. 


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Deploy the app to Azure

In this section, you will use the Azure command-line interface (CLI) from the Azure Cloud Shell to create a new [Azure Web App](https://docs.microsoft.com/azure/app-service/) to host your ASP.NET application in Azure. The web app will be configured to use local Git deployment. The web app will also be configured with your SignalR connection string, GitHub OAuth app secrets, and a deployment user.

When creating these resources make sure to use the same resource group that your SignalR Service resource resides in. This will make clean up alot easier later when you want to remove all the resources. The examples given assume you used the recommended group name, *SignalRTestResources*.

Update the values for the variables shown below. These variables will be reused for other operations. In the Azure Cloud Shell, execute the following commands to create the variables:

```azurecli-interactive
#========================================================================
#=== Update this with the actual name of your SignalR Service         ===
#=== resource. For example, signalrtestsvc48778624.                   ===
#========================================================================
ResourceName=mySignalRresourcename

#========================================================================
#=== Update this group name if you did not use the recommended group  ===
#=== name, SignalRTestResources.                                      ===
#========================================================================
ResourceGroupName=SignalRTestResources

#========================================================================
#=== Update these values based on your desired deployment username    ===
#=== and password.                                                    ===
#========================================================================
deploymentUser=myUserName
deploymentUserPassword=myPassword

#========================================================================
#=== Update these values based on your GitHub OAuth App registration. ===
#========================================================================
GitHubClientId=1234567890
GitHubClientSecret=1234567890

let randomNum=$RANDOM*$RANDOM
WebAppName=SignalRTestWebApp$randomNum
WebAppPlanName=$myWebAppName"Plan"
```


### Create the web app and plan

In the Azure Cloud Shell, execute the following command to create a new app plan for your web app.

```azurecli-interactive
# Create an App Service plan.
az appservice plan create --name $WebAppPlanName --resource-group $ResourceGroupName --sku FREE
```

Execute the followng command to create the web app:

```azurecli-interactive
# Create the new Web App
az webapp create --name $WebAppName --resource-group $ResourceGroupName --plan $WebAppPlanName
```

### Add app settings to the web app

In this section, you will add app settings for the following:

* SignalR Service resource connection string
* GitHub OAuth app client ID
* GitHub OAuth app client secret

Execute the following commands:

```azurecli-interactive
# Get the SignalR Service resource
signalRresource=$(az signalr show --name $ResourceName --resource-group $ResourceGroupName)

# Get the SignalR primary key 
signalRkeys=$(az signalr key list --name $ResourceName --resource-group $ResourceGroupName)
signalRprimarykey=$(echo "$signalRkeys" | grep -Po '(?<="primaryKey": ")[^"]*')

# Form the connection string for use in your application
signalRhostname=$(echo "$signalRresource" | grep -Po '(?<="hostName": ")[^"]*')
connstring="Endpoint=https://$signalRhostname;AccessKey=$signalRprimarykey;"

#Add an app setting to the web app for the SignalR connection
az webapp config appsettings set --name $WebAppName --resource-group $ResourceGroupName \
  --settings "AzureSignalRConnectionString=$connstring" 

#Add app settings to use with GitHub authentication
az webapp config appsettings set --name $WebAppName --resource-group $ResourceGroupName \
  --settings "GitHubClientId=$GitHubClientId" 
az webapp config appsettings set --name $WebAppName --resource-group $ResourceGroupName \
  --settings "GitHubClientSecret=$GitHubClientSecret" 
```


### Configure the web app for local git deployment

Execute the command below to create a new deployment user name and password that you will use when deploying your code to the web app with Git. 

```azurecli-interactive
# Add the desired deployment user name and password
az webapp deployment user set --user-name $deploymentUser --password $deploymentUserPassword

# Configure Git deployment and note the deployment URL in the output
az webapp deployment source config-local-git --name $WebAppName --resource-group $ResourceGroupName \
--query [url] -o tsv
```

Make a note the git deployment URL returned from this command. You will use this for deployment with Git.


### Deploy your code to the Azure web app

To deploy your code execute the following commands in a Git shell.

1. Navigate to the root of your project directory. If you don't have the project initialized with a Git repository, execute following command:

        git init

2. Add a remote for the git deployment URL you noted earlier:

        git remote add Azure <your git deployment url>

3. Stage all files in the initialized repository.

        git add -A

4. Commit the staged files:

        git commit -m "init commit"

5. Deploy your code to the web app        

        git push Azure master


### Update the GitHub OAuth app 

The last thing you need to do is update the **Homepage URL** and **Authroization callback URL** of the GitHub OAuth app to point to the new hosted app.

1. Open [http://github.com](http://github.com) in a browser and navigate to your account's **Settings** > **Developer settings** > **Oauth Apps**.

2. Click on your authentication app and update the **Homepage URL** and **Authroization callback URL** as shown below:

    | Setting | Example |
    | ------- | ------- |
    | Homepage URL | https://signalrtestwebapp22XX5120.azurewebsites.net/home |
    | Authroization callback URL | https://signalrtestwebapp22XX5120.azurewebsites.net/api/auth/callback |


3. Navigate to your web app URL and test the application.



## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them with the next tutorial.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
> 
> 

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this topic used a resource group named *SignalRTestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

   
![Delete](./media/signalr-authenticate-oauth/signalr-delete-resource-group.png)


You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.
   
After a few moments the resource group and all of its contained resources are deleted.

## Next steps

In this tutorial, you added authentication with OAuth to provide a better approach to authentication with Azure SignalR Service. To learn more about using Azure SignalR Server, continue to the next tutorial that demonstrates integration with Azure Functions.

> [!div class="nextstepaction"]
> [Integrate Azure Functions with Azure SignalR Service](./signalr-integrate-functions.md)


