---
title: Add an API to Azure Static Web Apps with Azure Functions
description: Get started with Azure Static Web Apps by adding a Serverless API to your static web app using Azure Functions.
services: static-web-apps
author: manekinekko
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 05/29/2020
ms.author: wachegha
---

# Add an API to Azure Static Web Apps Preview with Azure Functions

You can add serverless APIs to Azure Static Web Apps via integration with Azure Functions. This article demonstrates how to add and deploy an API to an Azure Static Web Apps site.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have an account, you can [create one for free](https://azure.microsoft.com/free).
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code
- [Live Server Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
- [Node.js](https://nodejs.org/download/) to run the API app locally

## Create a git repository

The following steps demonstrate how to create a new repository and clone the files to your computer.

1. Make sure you are logged in to GitHub and, navigate to https://github.com/staticwebdev/vanilla-basic/generate to create a new repository.
1. In the _Repository name_ box, enter **my-vanilla-api**.
1. Click **Create repository from template**.

   :::image type="content" source="media/add-api/create-repository.png" alt-text="Create a new repository from vanilla-basic":::

Once your project is created, copy the URL in your browser for the new repository. You use this URL in Visual Studio Code to clone the Git repository.

1. Press **F1** to open command in the Command Palette.
1. Paste the URL into the _Git: Clone_ prompt, and press **Enter**.

   :::image type="content" source="media/add-api/vscode-git-0.png" alt-text="Clone a GitHub project using Visual Studio Code":::

    Follow the prompts to select a repository location to clone the project.

## Create the API

Next, you create an Azure Functions project as the application's API. 

1. Inside the _my-vanilla-api_ project, create a sub-folder named **api**.
1. Press **F1** to open the Command Palette
1. Type **Azure Functions: Create New Project...**
1. Press **Enter**
1. Choose **Browse**
1. Select the **api** folder as the directory for your project workspace
1. Choose **Select**

   :::image type="content" source="media/add-api/create-azure-functions-vscode-1.png" alt-text="Create a new Azure Functions using Visual Studio Code":::

1. Provide the following information at the prompts:

    - _Select a language_: Choose **JavaScript**
    - _Select a template for your project's first function_: Choose **HTTP trigger**
    - _Provide a function name_: Enter **GetMessage**
    - _Authorization level_: Choose **Anonymous**, which enables anyone to call your function endpoint.
        - To learn about authorization levels, see [Authorization keys](../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys).

Visual Studio Code generates an Azure Functions project with an HTTP triggered function.

Your app now has a project structure similar to the following example.

    ```files
    ├── api
    │   ├── GetMessage
    │   │   ├── function.json
    │   │   ├── index.js
    │   │   └── sample.dat
    │   ├── host.json
    │   ├── local.settings.json
    │   ├── package.json
    │   └── proxies.json
    ├── index.html
    ├── readme.md
    └── styles.css
    ```

Next, you'll change the `GetMessage` function to return a message to the front-end.

1. Update the `GetMessage` function under _api/GetMessage/index.js_ with the following code.

    ```javascript
    module.exports = async function (context, req) {
      context.res = {
        body: {
          text: "Hello from the API"
        }
      };
    };
    ```

1. Update the `GetMessage` configuration under `api/GetMessage/function.json` with the following settings.

    ```json
    {
      "bindings": [
        {
          "authLevel": "anonymous",
          "type": "httpTrigger",
          "direction": "in",
          "name": "req",
          "methods": [
            "get"
          ],
          "route": "message"
        },
        {
          "type": "http",
          "direction": "out",
          "name": "res"
        }
      ]
    }
    ```

With the above settings, the API endpoint is:

- Triggered when an HTTP request is made to the function
- Available to all requests regardless of authentication status
- Exposed via the _/api/message_ route

## Run the API locally

Visual Studio Code integrates with [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local) to let you run this project on your local development computer before you publish to Azure.

> [!TIP]
> Make sure you have all the resources listed in the [prerequisites](#prerequisites) section installed before proceeding.

1. Run the function by pressing **F5** to start the Functions app.

1. If Azure Functions Core Tools isn't already installed, select **Install** at the prompt.

    The Core Tools shows output from the running application in the _Terminal_ panel. As a part of the output, you can see the URL endpoint of your HTTP-triggered function running locally.

    :::image type="content" source="media/add-api/create-azure-functions-vscode-2.png" alt-text="Create a new Azure Functions using Visual Studio Code":::

1. With Core Tools running, navigate to the following URL to verify the API is running correctly: <http://localhost:7071/api/message>.

   The response in the browser should look similar to the following example:

   :::image type="content" source="media/add-api/create-azure-functions-vscode-3.png" alt-text="Create a new Azure Functions using Visual Studio Code":::

1. Press **Shift + F5** to stop the debugging session.

### Call the API from the application

When deployed to Azure, requests to the API are automatically routed to the Functions app for requests sent to the `api` route. Working locally, you have you configure the application settings to proxy requests to the local API.

[!INCLUDE [static-web-apps-local-proxy](../../includes/static-web-apps-local-proxy.md)]

#### Update HTML files to access the API

1. Next, update the content of the _index.html_ file with the following code to fetch the text from the API function and display it on the screen:

   ```html
   <!DOCTYPE html>
   <html lang="en">

   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="stylesheet" href="styles.css">
     <title>Vanilla JavaScript App</title>
   </head>

   <body>
     <main>
       <h1>Vanilla JavaScript App</h1>
       <p>Loading message from the API: <b id="name">...</b></p>
     </main>

     <script>
       (async function() {
         let { text } = await( await fetch(`/api/message`)).json();
         document.querySelector('#name').textContent = text;
       }())
     </script>
   </body>

   </html>
   ```

1. Press **F5** to start the API project.

1. Press **F1** and choose **Live Server: Open with Live Server**.

    You should now see the API message in the web page.

   :::image type="content" source="media/add-api/create-azure-functions-vscode-4.png" alt-text="Create a new Azure Functions using Visual Studio Code":::

   > [!NOTE]
   > You can use other HTTP servers or proxies to serve the `index.html` file. Accessing the `index.html` from `file:///` will not work.

1. Press **Shift + F5** to stop the API project.

### Commit and push your changes to GitHub

Using Visual Studio Code, commit and push your changes to the remote git repository.

1. Press **F1** to open the Command Palette
1. Type **Git: Commit All**
1. Add a commit message and press **Enter**
1. Press **F1**
1. Type in **Git: push** and press **Enter**

## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com)
1. Click **Create a Resource**
1. Search for **Static Web App**
1. Click **Static Web App (Preview)**
1. Click **Create**

Next, add the app-specific settings.

1. Select your _Azure subscription_
1. Select or create a new _Resource Group_
1. Name the app **my-vanilla-api**.
1. Select _Region_ closest to you
1. Select the **Free** _SKU_
1. Click the **Sign-in with GitHub** button and authenticate with GitHub
1. Select your preferred _Organization_
1. Select **my-vanilla-api** from the _Repository_ drop-down
1. Select **master** from the _Branch_ drop-down
1. Click the **Next: Build >** button to edit the build configuration

Next, add the following the build details.

1. Enter **/** for the _App location_.
1. Enter **api** in the _Api location_ box.
1. Clear the default value out of the _App artifact location_, leaving the box empty.
1. Click **Review + create**.
1. Click the **Create** button

    Once you click the _Create_ button, Azure does two things. First, the underlying cloud services are created to support the app. Next, a background process begins to build and deploy the application.

1. Click the **Go to Resource** button to take you to the web app's _Overview_ page.

    As the app is being built in the background, you can click on the banner which contains a link to view the build status.

    :::image type="content" source="media/add-api/github-action-flag.png" alt-text="GitHub Workflow":::

1. Once the deployment is complete, ou can navigate to the web app, by clicking on the _URL_ link shown on the _Overview_ page.

    :::image type="content" source="media/add-api/static-app-url-from-portal.png" alt-text="Access static app URL from the Azure portal":::

## Clean up resources

If you don't want to keep this application for further use, you can use the following steps to delete the Azure Static Web App and its related resources.

1. Navigate to the [Azure portal](https://portal.azure.com)
1. In the top search bar, type **Resource groups**
1. Click **Resource groups**
1. Select **myResourceGroup**
1. On the _myResourceGroup_ page, make sure that the listed resources are the ones you want to delete.
1. Select **Delete**
1. Type **myResourceGroup** in the text box
1. Select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](./application-settings.md)
