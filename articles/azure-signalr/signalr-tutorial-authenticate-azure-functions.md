---
title: "Tutorial: Authentication with Azure Functions - Azure SignalR Service"
description: In this tutorial, you learn how to authenticate Azure SignalR Service clients for Azure Functions binding.
author: Y-Sindo
ms.service: signalr
ms.topic: tutorial
ms.date: 02/16/2023
ms.author: zityang
ms.devlang: javascript
ms.custom:
---

# Tutorial: Azure SignalR Service authentication with Azure Functions

In this step-by-step tutorial, you build a chat room with authentication and private messaging by using these technologies:

- [Azure Functions](https://azure.microsoft.com/services/functions/?WT.mc_id=serverlesschatlab-tutorial-antchu): Back-end API for authenticating users and sending chat messages.
- [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/?WT.mc_id=serverlesschatlab-tutorial-antchu): Service for broadcasting new messages to connected chat clients.
- [Azure Storage](https://azure.microsoft.com/services/storage/?WT.mc_id=serverlesschatlab-tutorial-antchu): Storage service that Azure Functions requires.
- [Azure App Service](https://azure.microsoft.com/products/app-service/): Service that provides user authentication.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/).
- [Node.js](https://nodejs.org/en/download/) (version 18.x).
- [Azure Functions Core Tools](../azure-functions/functions-run-local.md?#install-the-azure-functions-core-tools) (version 4).

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Create essential resources on Azure

### Create an Azure SignalR Service resource

Your application will access an Azure SignalR Service instance. Use the following steps to create an Azure SignalR Service instance by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), select the **Create a resource** (**+**) button.
1. Search for **SignalR Service** and select it.
1. Select **Create**.
1. Enter the following information.

   | Name               | Value                                          |
   | ------------------ | ---------------------------------------------- |
   | **Resource group** | Create a new resource group with a unique name. |
   | **Resource name**  | Enter a unique name for the Azure SignalR Service instance. |
   | **Region**         | Select a region close to you.                  |
   | **Pricing Tier**   | Select **Free**.                                           |
   | **Service mode**   | Select **Serverless**.                                     |

1. Select **Review + Create**.
1. Select **Create**.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create an Azure function app and an Azure storage account

1. From the home page in the Azure portal, select **Create a resource** (**+**).
1. Search for **Function App** and select it.
1. Select **Create**.
1. Enter the following information.

   | Name                  | Value                                                          |
   | --------------------- | -------------------------------------------------------------- |
   | **Resource group**    | Use the same resource group with your Azure SignalR Service instance. |
   | **Function App name** | Enter a unique name for the function app.                    |
   | **Runtime stack**     | Select **Node.js**.                                                        |
   | **Region**            | Select a region close to you.                                   |

1. By default, a new Azure storage account is created in the same resource group together with your function app. If you want to use another storage account in the function app, switch to the **Hosting** tab to choose an account.
1. Select **Review + Create**, and then select **Create**.

## Create an Azure Functions project locally

### Initialize a function app

1. From a command line, create a root folder for your project and change to the folder.
1. Run the following command in your terminal to create a new JavaScript Functions project:

   ```bash
   func init --worker-runtime node --language javascript --name my-app
   ```

By default, the generated project includes a _host.json_ file that contains the extension bundles that include the SignalR extension. For more information about extension bundles, see [Register Azure Functions binding extensions](../azure-functions/functions-bindings-register.md#extension-bundles).

### Configure application settings

When you run and debug the Azure Functions runtime locally, the function app reads application settings from _local.settings.json_. Update this file with the connection strings of the Azure SignalR Service instance and the storage account that you created earlier.

Replace the content of _local.settings.json_ with the following code:

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

In the preceding code:

- Enter the Azure SignalR Service connection string into the `AzureSignalRConnectionString` setting.

  To get the string, go to your Azure SignalR Service instance in the Azure portal. In the **Settings** section, locate the **Keys** setting. Select the **Copy** button to the right of the connection string to copy it to your clipboard. You can use either the primary or secondary connection string.

- Enter the storage account connection string into the `AzureWebJobsStorage` setting.

  To get the string, go to your storage account in the Azure portal. In the **Security + networking** section, locate the **Access keys** setting. Select the **Copy** button to the right of the connection string to copy it to your clipboard. You can use either the primary or secondary connection string.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create a function to authenticate users to Azure SignalR Service

When the chat app first opens in the browser, it requires valid connection credentials to connect to Azure SignalR Service. Create an HTTP trigger function named `negotiate` in your function app to return this connection information.

> [!NOTE]
> This function must be named `negotiate` because the SignalR client requires an endpoint that ends in `/negotiate`.

1. From the root project folder, create the `negotiate` function from a built-in template by using the following command:

   ```bash
   func new --template "SignalR negotiate HTTP trigger" --name negotiate
   ```

1. Open _negotiate/function.json_ to view the function binding configuration.

   The function contains an HTTP trigger binding to receive requests from SignalR clients. The function also contains a SignalR input binding to generate valid credentials for a client to connect to an Azure SignalR Service hub named `default`.

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

   There's no `userId` property in the `signalRConnectionInfo` binding for local development. You'll add it later to set the username of a SignalR connection when you deploy the function app to Azure.

1. Close the _negotiate/function.json_ file.

1. Open _negotiate/index.js_ to view the body of the function:

   ```javascript
   module.exports = async function (context, req, connectionInfo) {
     context.res.body = connectionInfo;
   };
   ```

   This function takes the SignalR connection information from the input binding and returns it to the client in the HTTP response body. The SignalR client uses this information to connect to the Azure SignalR Service instance.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Create a function to send chat messages

The web app also requires an HTTP API to send chat messages. Create an HTTP trigger function that sends messages to all connected clients that use Azure SignalR Service:

1. From the root project folder, create an HTTP trigger function named `sendMessage` from the template by using the following command:

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

   The preceding code makes two changes to the original file:

   - It changes the route to `messages` and restricts the HTTP trigger to the `POST` HTTP method.
   - It adds an Azure SignalR Service output binding that sends a message returned by the function to all clients connected to an Azure SignalR Service hub named `default`.

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

   This function takes the body from the HTTP request and sends it to clients connected to Azure SignalR Service. It invokes a function named `newMessage` on each client.

   The function can read the sender's identity and can accept a `recipient` value in the message body to allow you to send a message privately to a single user. You'll use these functionalities later in the tutorial.

1. Save the file.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

### Host the chat client's web user interface

The chat application's UI is a simple single-page application (SPA) created with the Vue JavaScript framework by using the [ASP.NET Core SignalR JavaScript client](/aspnet/core/signalr/javascript-client). For simplicity, the function app hosts the webpage. In a production environment, you can use [Static Web Apps](https://azure.microsoft.com/products/app-service/static) to host the webpage.

1. Create a folder named _content_ in the root directory of your function project.
1. In the _content_ folder, create a file named _index.html_.
1. Copy and paste the content of [index.html](https://github.com/aspnet/AzureSignalR-samples/blob/da0aca70f490f3d8f4c220d0c88466b6048ebf65/samples/ServerlessChatWithAuth/content/index.html) to your file. Save the file.
1. From the root project folder, create an HTTP trigger function named `index` from the template by using this command:

   ```bash
   func new --name index --template "Http trigger"
   ```

1. Modify the content of `index/index.js` to the following code:

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

   The function reads the static webpage and returns it to the user.

1. Open _index/function.json_, and change the `authLevel` value of the bindings to `anonymous`. Now the whole file looks like this example:

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

1. Test your app locally. Start the function app by using this command:

   ```bash
   func start
   ```

1. Open `http://localhost:7071/api/index` in your web browser. A chat webpage should appear.

   :::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/local-chat-client-ui.png" alt-text="Screenshot of a web user interface for a local chat client.":::

1. Enter a message in the chat box.

   After you select the Enter key, the message appears on the webpage. Because the username of the SignalR client isn't set, you're sending all messages anonymously.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Deploy to Azure and enable authentication

You've been running the function app and chat app locally. Now, deploy them to Azure and enable authentication and private messaging.

### Configure the function app for authentication

So far, the chat app works anonymously. In Azure, you'll use [App Service authentication](../app-service/overview-authentication-authorization.md) to authenticate the user. The user ID or username of the authenticated user is passed to the `SignalRConnectionInfo` binding to generate connection information authenticated as the user.

1. Open _negotiate/function.json_.
1. Insert a `userId` property into the `SignalRConnectionInfo` binding with the value `{headers.x-ms-client-principal-name}`. This value is a [binding expression](../azure-functions/functions-triggers-bindings.md) that sets the username of the SignalR client to the name of the authenticated user. The binding should now look like this example:

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

### Deploy the function app to Azure

Deploy the function app to Azure by using the following command:

```bash
func azure functionapp publish <your-function-app-name> --publish-local-settings
```

The `--publish-local-settings` option publishes your local settings from the _local.settings.json_ file to Azure, so you don't need to configure them in Azure again.

### Enable App Service authentication

Azure Functions supports authentication with Microsoft Entra ID, Facebook, Twitter, Microsoft account, and Google. You'll use Microsoft as the identity provider for this tutorial.

1. In the Azure portal, go to the resource page of your function app.
1. Select **Settings** > **Authentication**.
1. Select **Add identity provider**.

   :::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/function-app-authentication.png" alt-text="Screenshot of the function app Authentication page and the button for adding an identity provider.":::

1. In the **Identity provider** list, select **Microsoft**. Then select **Add**.

   :::image type="content" source="media/signalr-tutorial-authenticate-azure-functions/function-app-select-identity-provider.png" alt-text="Screenshot of the page for adding an identity provider.":::

The completed settings create an app registration that associates your identity provider with your function app.

For more information about the supported identity providers, see the following articles:

- [Microsoft Entra ID](../app-service/configure-authentication-provider-aad.md)
- [Facebook](../app-service/configure-authentication-provider-facebook.md)
- [Twitter](../app-service/configure-authentication-provider-twitter.md)
- [Microsoft account](../app-service/configure-authentication-provider-microsoft.md)
- [Google](../app-service/configure-authentication-provider-google.md)

### Try the application

1. Open `https://<YOUR-FUNCTION-APP-NAME>.azurewebsites.net/api/index`.
1. Select **Login** to authenticate with your chosen authentication provider.
1. Send public messages by entering them in the main chat box.
1. Send private messages by selecting a username in the chat history. Only the selected recipient receives these messages.

:::image type="content" source="./media/signalr-tutorial-authenticate-azure-functions/online-chat-client-ui.png" alt-text="Screenshot of an authenticated online client chat app.":::

Congratulations! You deployed a real-time, serverless chat app.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Clean up resources

To clean up the resources that you created in this tutorial, delete the resource group by using the Azure portal.

> [!CAUTION]
> Deleting the resource group deletes all the resources that it contains. If the resource group contains resources outside the scope of this tutorial, they're also deleted.

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)

## Next steps

In this tutorial, you learned how to use Azure Functions with Azure SignalR Service. Read more about building real-time serverless applications with Azure SignalR Service bindings for Azure Functions:

> [!div class="nextstepaction"] 
> [Real-time apps with Azure SignalR Service and Azure Functions](signalr-concept-azure-functions.md)

[Having issues? Let us know.](https://aka.ms/asrs/qsauth)
