---
title: Quickstart to learn how to use SignalR with Azure | Microsoft Docs
description: Use SignalR to create a chat room.
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: 

ms.assetid: 
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.tgt_pltfrm: ASP.NET
ms.workload: tbd
ms.date: 04/17/2018
ms.author: wesmc

---
# Quickstart: Create a chat room with Azure SignalR

Azure SignalR Service is an Azure managed service that helps developers easily build web applications with real-time features. This service is based on [SignalR for ASP.NET Core 2.0](https://blogs.msdn.microsoft.com/webdev/2017/09/14/announcing-signalr-for-asp-net-core-2-0/).

This topic shows you how to get started with the Azure SignalR Service. In this quickstart you will create a chat application using an ASP.NET Core MVC Web App web app with an Azure SignalR Service. 

The code for this article can be downloaded from the AzureSignalR-samples repository, [here](https://github.com/aspnet/AzureSignalR-samples/blob/master/tutorials/chat-room-service.md).

![Quickstart Complete local](media/signalr-quickstart-dotnet-core/signalr-quickstart-complete-local.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

* Install the [.NET Core SDK](https://www.microsoft.com/net/download/windows)
* Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) github repository.

## Create a new Azure SignalR Service resource

[!INCLUDE [azure-signalr-create](../../includes/signalr-create.md)]

## Create a new ASP.NET Core web app

In this section you use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/?tabs=netcore2x) to create a new ASP.NET Core MVC Web App project.

1. Open a command prompt and create a new folder for your project. In this article the *E:\Testing\chattest* folder is created and used.

        E:\Testing>md chattest
        E:\Testing>cd chattest
        E:\Testing\chattest>

2. Execute the following command to create a new ASP.NET Core MVC Web App project:

        dotnet new mvc



## Update the app to use Azure SignalR Service


1. Add a reference to the *Microsoft.Azure.SignalR* NuGet package by executing the following command:

        dotnet add package Microsoft.Azure.SignalR -v 1.0.0-preview-10001


2. Add a new environment variable named *AzureSignalRConnectionStringKey*. This variable will contain the connection string to access your Azure Signalr Service resource. Based on the example command below, paste in your connection string for the value:

        set AzureSignalRConnectionStringKey=Endpoint=<your hostname>;AccessKey=<Your access key>;

    This environment variable is only used for testing the web app while it is hosted locally. Once the web app is deployed to Azure, you will add an application setting in place of the environment variable.

3. In your project directory, add a new code file named *Constants.cs*. This file will contain the constant name of the connection string used to access your Azure SignalR Service resource. Add the following code:


    ```cscharp
    namespace Microsoft.Azure.SignalR.Samples.ChatRoom
    {
        internal static class Constants
        {
            public const string AzureSignalRConnectionStringKey = "AzureSignalRConnectionString";
        }
    }
    ```

4. Open *Startup.cs* and update the `ConfigureServices` method to make the web app a singleton and use Azure SignalR by calling the `services.AddAzureSignalR()` method:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc();
        services.AddSingleton(typeof(IConfiguration), Configuration);
        services.AddAzureSignalR();
    }
    ```

5. Also in *Startup.cs*, update the `Configure` method by removing the call to `app.UseStaticFiles()` and adding the following code in its place:

    ```csharp
        app.UseFileServer();
        app.UseAzureSignalR(Configuration[Constants.AzureSignalRConnectionStringKey],
            builder => 
            { 
                builder.UseHub<Chat>(); 
            });
    ```            

## Add a hub class

In SignalR, a hub is a core concept that exposes a set of methods that can be called from client. In this section you define a hub class with two methods: 

* `Broadcast()`: This method broadcasts a message to all clients.
* `Echo()`: This method sends a message back to the caller.

Both methods use the `Clients` interface provided by the SignalR Core SDK. This interface gives you access to all connected clients enabling you to push content to your clients.

1. Add a new file named *Chat.cs* in a new folder named *Hub*.

2. Add the following code to *Chat.cs* to define you hub class:

    ```csharp
    namespace chattest
    {
        using Microsoft.AspNetCore.SignalR;

        public class Chat : Hub
        {
            public void broadcastMessage(string name, string message)
            {
                Clients.All.SendAsync("broadcastMessage", name, message);
            }

            public void echo(string name, string message)
            {
                Clients.Client(Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
            }
        }
    }
    ```
3. Save *Chat.cs*.

## Add an authentication controller

The connection string contains sensitive access data and should only be used by server-side code to connect to the Azure SignalR Service resources. You would not normally want to allow client-side code direct access to the service using the connection string. Code running as a client of the web app should authenticate with the web app in order to authorize access to SignalR functionality. 

Azure SignalR Service gives you the flexibility to implement your own authentication. In this section you will implement an API that authenticates your clients and issues a token to the client. Code running client-side can then use this token to connect to the service to push content updates.

In this article, you aren't going to include real authentication. Instead you will directly issue the token when requested. You will implement real authentication in a later tutorial.

1. Add a new controller code file to the *chattest\Controllers* directory. Name the file *AuthController.cs*.

2. Add the following code to the authentication controller:

    ```csharp
    namespace chattest
    {
        using System.Security.Claims;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.Azure.SignalR;
        using Microsoft.Extensions.Configuration;

        [Route("api/auth")]
        public class AuthController : Controller
        {
            private readonly EndpointProvider _endpointProvider;
            private readonly TokenProvider _tokenProvider;

            public AuthController(IConfiguration config)
            {
                var connStr = config[Constants.AzureSignalRConnectionStringKey];
                _endpointProvider = CloudSignalR.CreateEndpointProviderFromConnectionString(connStr);
                _tokenProvider = CloudSignalR.CreateTokenProviderFromConnectionString(connStr);
            }

            [HttpGet("{hubName}")]
            public IActionResult GenerateJwtBearer(string hubName, [FromQuery] string uid)
            {
                var serviceUrl = _endpointProvider.GetClientEndpoint(hubName);
                var accessToken =_tokenProvider.GenerateClientAccessToken(hubName, new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, uid)
                });

                return new OkObjectResult(new
                {
                    ServiceUrl = serviceUrl,
                    AccessToken = accessToken
                });
            }
        }
    }
    ```

    The Azure SignalR SDK defines the `GenerateClientAccessToken()` method. This method is used to help issue the token based on the connection string, once you authenticate a client.

    Along with a valid token, this API also returns the *serviceURL* in the response body. This token and *serviceURL* are used by the client to authenticate the connection used to push content updates to all clients.    


## Add the client interface to the web app

The user interface for this chat room app will be composed of HTML and JavaScript in a file name *index.html* in the *wwwroot* directory.

1. Copy the *css* and *scripts* folders from the [sample repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/ChatRoomLocal/wwwroot) into your *wwwroot* folder.

2. Add a new file named *Index.html* to the *wwwroot* directory of your project.

3. Add the following code to *Index.html*:

    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <link href="css/bootstrap.css" rel="stylesheet" />
        <link href="css/site.css" rel="stylesheet" />
        <title>Azure SignalR Group Chat</title>
    </head>
    <body>
        <h2 class="text-center" style="margin-top: 0; padding-top: 30px; padding-bottom: 30px;">Azure SignalR Group Chat</h2>
        <div class="container" style="height: calc(100% - 110px);">
            <div id="messages" style="background-color: whitesmoke; "></div>
            <div style="width: 100%; border-left-style: ridge; border-right-style: ridge;">
                <textarea id="message"
                            style="width: 100%; padding: 5px 10px; border-style: hidden;" 
                            placeholder="Type message and press Enter to send..."></textarea>
            </div>
            <div style="overflow: auto; border-style: ridge; border-top-style: hidden;">
                <button class="btn-warning pull-right" id="echo">Echo</button>
                <button class="btn-success pull-right" id="sendmessage">Send</button>
            </div>
        </div>
        <div class="modal alert alert-danger fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>Connection Error...</div>
                        <div><strong style="font-size: 1.5em;">Hit Refresh/F5</strong> to rejoin. ;)</div>
                    </div>
                </div>
            </div>
        </div>
        <!--Script references. -->
        <script type="text/javascript" src="scripts/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="scripts/bootstrap.js"></script>

        <!--Reference the SignalR library. -->
        <script type="text/javascript" src="scripts/signalr.js"></script>

        <!--Add script to update the page and send messages.-->
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function () {

                function generateRandomName() {
                    return Math.random().toString(36).substring(2, 10);
                }

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

                // Set initial focus to message input box.
                var messageInput = document.getElementById('message');
                messageInput.focus();

                var accessToken = '';

                function getAccessToken(url) {
                    return new Promise((resolve, reject) => {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.send();
                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(JSON.parse(xhr.response || xhr.responseText));
                            }
                            else {
                                reject(new Error(xhr.statusText));
                            }
                        };

                        xhr.onerror = () => {
                            reject(new Error(xhr.statusText));
                        }
                    });
                }

                function createMessageEntry(encodedName, encodedMsg) {
                    var entry = document.createElement('div');
                    entry.classList.add("message-entry");
                    if (encodedName === "_SYSTEM_") {
                        entry.innerHTML = encodedMsg;
                        entry.classList.add("text-center");
                        entry.classList.add("system-message");
                    } else if (encodedName === "_BROADCAST_") {
                        entry.classList.add("text-center");
                        entry.innerHTML = `<div class="text-center broadcast-message">${encodedMsg}</div>`;
                    } else if (encodedName === username) {
                        entry.innerHTML = `<div class="message-avatar pull-right">${encodedName}</div>` +
                            `<div class="message-content pull-right">${encodedMsg}<div>`;
                    } else {
                        entry.innerHTML = `<div class="message-avatar pull-left">${encodedName}</div>` +
                            `<div class="message-content pull-left">${encodedMsg}<div>`;
                    }
                    return entry;
                }

                function bindConnectionMessage(connection) {
                    var messageCallback = function(name, message) {
                        if (!message) return;
                        // Html encode display name and message.
                        var encodedName = name;
                        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var messageEntry = createMessageEntry(encodedName, encodedMsg);
                                    
                        var messageBox = document.getElementById('messages');
                        messageBox.appendChild(messageEntry);
                        messageBox.scrollTop = messageBox.scrollHeight;
                    };
                    // Create a function that the hub can call to broadcast messages.
                    connection.on('broadcastMessage', messageCallback);
                    connection.on('echo', messageCallback);
                    connection.onclose(onConnectionError);
                }

                function onConnected(connection) {
                    console.log('connection started');
                    connection.send('broadcastMessage', '_SYSTEM_', username + ' JOINED');
                    document.getElementById('sendmessage').addEventListener('click', function (event) {
                        // Call the broadcastMessage method on the hub.
                        if (messageInput.value) {
                            connection.send('broadcastMessage', username, messageInput.value);
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
                        // Call the echo method on the hub.
                        connection.send('echo', username, messageInput.value);

                        // Clear text box and reset focus for next comment.
                        messageInput.value = '';
                        messageInput.focus();
                        event.preventDefault();
                    });
                }

                function onConnectionError(error) {
                    if (error && error.message) {
                        console.error(error.message);
                    }
                    var modal = document.getElementById('myModal');
                    modal.classList.add('in');
                    modal.style = 'display: block;';
                }

                // Starts a connection with transport fallback - if the connection cannot be started using
                // the webSockets transport the function will fallback to the serverSentEvents transport and
                // if this does not work it will try longPolling. If the connection cannot be started using
                // any of the available transports the function will return a rejected Promise.
                function startConnection(url, configureConnection) {
                    return function start(transport) {
                        console.log(`Starting connection using ${signalR.TransportType[transport]} transport`);
                        var connection = new signalR.HubConnection(url, { transport: transport, uid: username, accessTokenFactory: () => accessToken });
                        if (configureConnection && typeof configureConnection === 'function') {
                            configureConnection(connection);
                        }

                        return connection.start()
                            .then(function() {
                                return connection;
                            })
                            .catch(function(error) {
                                console.log(`Cannot start the connection use ${signalR.TransportType[transport]} transport. ${error.message}`);
                                if (transport !== signalR.TransportType.LongPolling) {
                                    return start(transport + 1);
                                }

                                return Promise.reject(error);
                            });
                    }(signalR.TransportType.WebSockets);
                }

                getAccessToken(`/api/auth/chat?uid=${username}`)
                    .then(function(endpoint) {
                        accessToken = endpoint.accessToken;
                        return startConnection(endpoint.serviceUrl, bindConnectionMessage);
                    })
                    .then(onConnected)
                    .catch(onConnectionError);
            });
        </script>
    </body>
    </html>
    ```

    In this code, the `getAccessToken` JavaScript function calls into  *AuthController* on the server-side in order to authenticate and receive an access token for the client. If successul, this token is returned in the body of the response along with the *serviceURL*. The token and *serviceURL* will be used by the `startConnection` JavaScript client function to authenticate a connection to the Azure SignalR resource.
    
    If the connection is successful authenticated, that connection is passed to the `onConnected` JavaScript function, which adds the button event handlers. These handlers use the connection to push content updates to all connected clients.


## Build and Run the app locally

1. To build the app using the .NET Core CLI, execute the following command in the command shell:

        dotnet build

2. Once the build successfully completes, execute the following command to run the web app locally:

        dotnet run

    By default, the app will be hosted locally on port 5000:

        E:\Testing\chattest>dotnet run
        Hosting environment: Production
        Content root path: E:\Testing\chattest
        Now listening on: http://localhost:5000
        Application started. Press Ctrl+C to shut down.    



3. Launch two browser windows and navigate each browser to `http://localhost:5000`. You will be prompted to enter your name. Enter a client name for both clients and test pushing message content between both clients using the **Send** button.

    ![Quickstart Complete local](media/signalr-quickstart-dotnet-core/signalr-quickstart-complete-local.png)



## Next steps

In this quickstart, you've created a new Azure SignalR Service resource and used to in an ASP.NET Core Web app to push content updates in real-time to multiple connected clients. To learn more about using Azure SignalR Server, continue to the next tutorial that demonstrates authentication with OAuth.

> [!div class="nextstepaction"]
> [Azure SignalR Service authentication with OAuth](./signalr-authenticate-oauth.md)


