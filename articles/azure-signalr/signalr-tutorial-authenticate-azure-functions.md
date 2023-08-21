---
title: "Tutorial: Authentication with Azure Functions - Azure SignalR"
description: In this tutorial, you learn how to authenticate Azure SignalR Service clients for Azure Functions binding
author: Y-Sindo
ms.service: signalr
ms.topic: tutorial
ms.date: 02/16/2023
ms.author: zityang
ms.devlang: javascript
ms.custom:
---

# Tutorial: Azure SignalR Service authentication with Azure Functions

A step by step tutorial to build a chat room with authentication and private messaging using Azure Functions, App Service Authentication, and SignalR Service.

## Introduction

### Technologies used

- [Azure Functions](https://azure.microsoft.com/services/functions/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Backend API for authenticating users and sending chat messages
- [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Broadcast new messages to connected chat clients
- [Azure Storage](https://azure.microsoft.com/services/storage/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Required by Azure Functions

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you can [create one for free](https://azure.microsoft.com/free/).
- [Node.js](https://nodejs.org/en/download/) (Version 18.x)
- [Azure Functions Core Tools](../azure-functions/functions-run-local.md?#install-the-azure-functions-core-tools) (Version 4)

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Create essential resources on Azure

### Create an Azure SignalR service resource

Your application will access a SignalR Service instance. Use the following steps to create a SignalR Service instance using the Azure portal.

1. Select on the **Create a resource** (**+**) button for creating a new Azure resource.

1. Search for **SignalR Service** and select it.
1. Select **Create**.

1. Enter the following information.

   | Name               | Value                                          |
   | ------------------ | ---------------------------------------------- |
   | **Resource group** | Create a new resource group with a unique name |
   | **Resource name**  | A unique name for the SignalR Service instance |
   | **Region**         | Select a region close to you                   |
   | **Pricing Tier**   | Free                                           |
   | **Service mode**   | Serverless                                     |

1. Select **Review + Create**.
1. Select **Create**.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create an Azure Function App and an Azure Storage account

1. From the home page in the Azure portal, select on the **Create a resource** (**+**).

1. Search for **Function App** and select it.
1. Select **Create**.

1. Enter the following information.

   | Name                  | Value                                                          |
   | --------------------- | -------------------------------------------------------------- |
   | **Resource group**    | Use the same resource group with your SignalR Service instance |
   | **Function App name** | A unique name for the Function app instance                    |
   | **Runtime stack**     | Node.js                                                        |
   | **Region**            | Select a region close to you                                   |

1. By default, a new Azure Storage account will also be created in the same resource group together with your function app. If you want to use another storage account in the function app, switch to **Hosting** tab to choose an account.

1. Select **Review + Create**, then select **Create**.

## Create an Azure Functions project locally

### Initialize a function app

1. From a command line, create a root folder for your project and change to the folder.

1. Execute the following command in your terminal to create a new JavaScript Functions project.

```bash
func init --worker-runtime node --language javascript --name my-app
```

By default, the generated project includes a _host.json_ file containing the extension bundles which include the SignalR extension. For more information about extension bundles, see [Register Azure Functions binding extensions](../azure-functions/functions-bindings-register.md#extension-bundles).

### Configure application settings

When running and debugging the Azure Functions runtime locally, application settings are read by the function app from _local.settings.json_. Update this file with the connection strings of the SignalR Service instance and the storage account that you created earlier.

1. Replace the content of _local.settings.json_ with the following code:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "<your-storage-account-connection-string>",
       "AzureSignalRConnectionString": "<your-Azure-SignalR-connection-string>"
     }
   }
   ```

   - Enter the Azure SignalR Service connection string into the `AzureSignalRConnectionString` setting.

     Navigate to your SignalR Service in the Azure portal. In the **Settings** section, locate the **Keys** setting. Select the **Copy** button to the right of the connection string to copy it to your clipboard. You can use either the primary or secondary connection string.

   - Enter the storage account connection string into the `AzureWebJobsStorage` setting.

     Navigate to your storage account in the Azure portal. In the **Security + networking** section, locate the **Access keys** setting. Select the **Copy** button to the right of the connection string to copy it to your clipboard. You can use either the primary or secondary connection string.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create a function to authenticate users to SignalR Service

When the chat app first opens in the browser, it requires valid connection credentials to connect to Azure SignalR Service. You'll create an HTTP triggered function named `negotiate` in your function app to return this connection information.

> [!NOTE]
> This function must be named `negotiate` as the SignalR client requires an endpoint that ends in `/negotiate`.

1. From the root project folder, create the `negotiate` function from a built-in template with the following command.

   ```bash
   func new --template "SignalR negotiate HTTP trigger" --name negotiate
   ```

1. Open _negotiate/function.json_ to view the function binding configuration.

   The function contains an HTTP trigger binding to receive requests from SignalR clients and a SignalR input binding to generate valid credentials for a client to connect to an Azure SignalR Service hub named `default`.

   ```json
   {
     "disabled": false,
     "bindings": [
       {
         "authLevel": "anonymous",
         "type": "httpTrigger",
         "direction": "in",
         "methods": ["post"],
         "name": "req",
         "route": "negotiate"
       },
       {
         "type": "http",
         "direction": "out",
         "name": "res"
       },
       {
         "type": "signalRConnectionInfo",
         "name": "connectionInfo",
         "hubName": "default",
         "connectionStringSetting": "AzureSignalRConnectionString",
         "direction": "in"
       }
     ]
   }
   ```

   There's no `userId` property in the `signalRConnectionInfo` binding for local development, but you'll add it later to set the user name of a SignalR connection when you deploy the function app to Azure.

1. Close the _negotiate/function.json_ file.

1. Open _negotiate/index.js_ to view the body of the function.

   ```javascript
   module.exports = async function (context, req, connectionInfo) {
     context.res.body = connectionInfo;
   };
   ```

   This function takes the SignalR connection information from the input binding and returns it to the client in the HTTP response body. The SignalR client uses this information to connect to the SignalR Service instance.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create a function to send chat messages

The web app also requires an HTTP API to send chat messages. You'll create an HTTP triggered function named `sendMessage` that sends messages to all connected clients using SignalR Service.

1. From the root project folder, create an HTTP trigger function named `sendMessage` from the template with the command:

   ```bash
   func new --name sendMessage --template "Http trigger"
   ```

1. To configure bindings for the function, replace the content of _sendMessage/function.json_ with the following code:

   ```json
   {
     "disabled": false,
     "bindings": [
       {
         "authLevel": "anonymous",
         "type": "httpTrigger",
         "direction": "in",
         "name": "req",
         "route": "messages",
         "methods": ["post"]
       },
       {
         "type": "http",
         "direction": "out",
         "name": "res"
       },
       {
         "type": "signalR",
         "name": "$return",
         "hubName": "default",
         "direction": "out"
       }
     ]
   }
   ```

   Two changes are made to the original file:

   - Changes the route to `messages` and restricts the HTTP trigger to the `POST` HTTP method.
   - Adds a SignalR Service output binding that sends a message returned by the function to all clients connected to a SignalR Service hub named `default`.

1. Replace the content of _sendMessage/index.js_ with the following code:

   ```javascript
   module.exports = async function (context, req) {
     const message = req.body;
     message.sender =
       (req.headers && req.headers["x-ms-client-principal-name"]) || "";

     let recipientUserId = "";
     if (message.recipient) {
       recipientUserId = message.recipient;
       message.isPrivate = true;
     }

     return {
       userId: recipientUserId,
       target: "newMessage",
       arguments: [message],
     };
   };
   ```

   This function takes the body from the HTTP request and sends it to clients connected to SignalR Service, invoking a function named `newMessage` on each client.

   The function can read the sender's identity and can accept a `recipient` value in the message body to allow you to send a message privately to a single user. You'll use these functionalities later in the tutorial.

1. Save the file.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Host the chat client web user interface

The chat application's UI is a simple single-page application (SPA) created with the Vue JavaScript framework using [ASP.NET Core SignalR JavaScript client](/aspnet/core/signalr/javascript-client). For simplicity, the function app hosts the web page. In a production environment, you can use [Static Web Apps](https://azure.microsoft.com/products/app-service/static) to host the web page.

1. Create a new folder named _content_ in the root directory of your function project.
1. In the _content_ folder, create a new file named _index.html_.

1. Copy and paste the content of [index.html](https://github.com/aspnet/AzureSignalR-samples/blob/da0aca70f490f3d8f4c220d0c88466b6048ebf65/samples/ServerlessChatWithAuth/content/index.html) to your file. Save the file.

1. From the root project folder, create an HTTP trigger function named `index` from the template with the command:

   ```bash
   func new --name index --template "Http trigger"
   ```

1. Modify the content of `index/index.js` to the following:

   ```js
   const fs = require("fs");

   module.exports = async function (context, req) {
     const fileContent = fs.readFileSync("content/index.html", "utf8");

     context.res = {
       // status: 200, /* Defaults to 200 */
       body: fileContent,
       headers: {
         "Content-Type": "text/html",
       },
     };
   };
   ```

   The function reads the static web page and returns it to the user.

1. Open _index/function.json_, change the `authLevel` of the bindings to `anonymous`. Now the whole file looks like this:

   ```json
   {
     "bindings": [
       {
         "authLevel": "anonymous",
         "type": "httpTrigger",
         "direction": "in",
         "name": "req",
         "methods": ["get", "post"]
       },
       {
         "type": "http",
         "direction": "out",
         "name": "res"
       }
     ]
   }
   ```

1. Now you can test your app locally. Start the function app with the command:

   ```bash
   func start
   ```

1. Open **http://localhost:7071/api/index** in your web browser. You should be able to see a web page as follows:

   :::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/local-chat-client-ui.png" alt-text="Screenshot of local chat client web user interface.":::

1. Enter a message in the chat box and press enter.

   The message is displayed on the web page. Because the user name of the SignalR client isn't set, we send all messages as "anonymous".

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Deploy to Azure and enable authentication

You have been running the function app and chat application locally. You'll now deploy them to Azure and enable authentication and private messaging in the application.

### Configure function app for authentication

So far, the chat app works anonymously. In Azure, you'll use [App Service Authentication](../app-service/overview-authentication-authorization.md) to authenticate the user. The user ID or username of the authenticated user is passed to the `SignalRConnectionInfo` binding to generate connection information authenticated as the user.

1. Open _negotiate/function.json_.

1. Insert a `userId` property to the `SignalRConnectionInfo` binding with value `{headers.x-ms-client-principal-name}`. This value is a [binding expression](../azure-functions/functions-triggers-bindings.md) that sets the user name of the SignalR client to the name of the authenticated user. The binding should now look like this.

   ```json
   {
     "type": "signalRConnectionInfo",
     "name": "connectionInfo",
     "userId": "{headers.x-ms-client-principal-name}",
     "hubName": "default",
     "direction": "in"
   }
   ```

1. Save the file.

### Deploy function app to Azure

Deploy the function app to Azure with the following command:

```bash
func azure functionapp publish <your-function-app-name> --publish-local-settings
```

The `--publish-local-settings` option publishes your local settings from the _local.settings.json_ file to Azure, so you don't need to configure them in Azure again.

### Enable App Service Authentication

Azure Functions supports authentication with Microsoft Entra ID, Facebook, Twitter, Microsoft account, and Google. You will use **Microsoft** as the identity provider for this tutorial.

1. Go to the resource page of your function app on Azure portal.
1. Select **Settings** -> **Authentication**.
1. Select **Add identity provider**.
   :::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/function-app-authentication.png" alt-text="Screenshot of the Function App Authentication page.":::

1. Select **Microsoft** from the **Identity provider** list.
   :::image type="content" source="media/signalr-tutorial-authenticate-azure-functions/function-app-select-identity-provider.png" alt-text="Screenshot of 'Add an identity provider' page.":::

   Azure Functions supports authentication with Microsoft Entra ID, Facebook, Twitter, Microsoft account, and Google. For more information about the supported identity providers, see the following articles:

   - [Microsoft Entra ID](../app-service/configure-authentication-provider-aad.md)
   - [Facebook](../app-service/configure-authentication-provider-facebook.md)
   - [Twitter](../app-service/configure-authentication-provider-twitter.md)
   - [Microsoft account](../app-service/configure-authentication-provider-microsoft.md)
   - [Google](../app-service/configure-authentication-provider-google.md)

1. Select **Add** to complete the settings. An app registration will be created, which associates your identity provider with your function app.

### Try the application

1. Open **https://\<YOUR-FUNCTION-APP-NAME\>.azurewebsites.net/api/index**

1. Select **Login** to authenticate with your chosen authentication provider.

1. Send public messages by entering them into the main chat box.

1. Send private messages by clicking on a username in the chat history. Only the selected recipient will receive these messages.

:::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/online-chat-client-ui.png" alt-text="Screenshot of the authenticated online client chat app using Azure SignalR Service and Azure Functions.":::

Congratulations! You've deployed a real-time, serverless chat app!

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group using the Azure portal.

> [!CAUTION]
> Deleting the resource group deletes all resources contained within it. If the resource group contains resources outside the scope of this tutorial, they will also be deleted.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Next steps

In this tutorial, you learned how to use Azure Functions with Azure SignalR Service. Read more about building real-time serverless applications with SignalR Service bindings for Azure Functions.

> [!div class="nextstepaction"] 
> [Real-time apps with Azure SignalR Service and Azure Functions](signalr-concept-azure-functions.md)

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)
