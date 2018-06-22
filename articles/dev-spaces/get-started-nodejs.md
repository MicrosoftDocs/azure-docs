---
title: "Create a Kubernetes Node.js development environment in the cloud with VS Code | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "tutorial"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "douge"
---
# Get Started on Azure Dev Spaces with Node.js

[!INCLUDE[](includes/learning-objectives.md)]

[!INCLUDE[](includes/see-troubleshooting.md)]

You're now ready to create a Kubernetes-based development environment in Azure.

[!INCLUDE[](includes/portal-aks-cluster.md)]

## Install the Azure CLI
Azure Dev Spaces requires minimal local machine setup. Most of your development environment's configuration gets stored in the cloud, and is shareable with other users. Start by downloading and running the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).

> [!IMPORTANT]
> If you already have the Azure CLI installed, make sure you are using version 2.0.33 or higher.

[!INCLUDE[](includes/sign-into-azure.md)]

[!INCLUDE[](includes/use-dev-spaces.md)]

[!INCLUDE[](includes/install-vscode-extension.md)]

While you're waiting for the cluster to be create, you can start writing code.

## Create a Node.js container in Kubernetes

In this section, you'll create a Node.js web app and get it running in a container in Kubernetes.

### Create a Node.js Web App
Download code from GitHub by navigating to https://github.com/Azure/dev-spaces and select **Clone or Download** to download the GitHub repository to your local environment. The code for this guide is in `samples/nodejs/getting-started/webfrontend`.

[!INCLUDE[](includes/azds-prep.md)]

[!INCLUDE[](includes/build-run-k8s-cli.md)]

### Update a content file
Azure Dev Spaces isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. Locate the file `./public/index.html` and make an edit to the HTML. For example, change the page's background color to a shade of blue:

    ```html
    <body style="background-color: #95B9C7; margin-left:10px; margin-right:10px;">
    ```

2. Save the file. Moments later, in the Terminal window you'll see a message saying a file in the running container was updated.
1. Go to your browser and refresh the page. You should see your color update.

What happened? Edits to content files, like HTML and CSS, don't require the Node.js process to restart, so an active `azds up` command will automatically sync any modified content files directly into the running container in Azure, thereby providing a fast way to see your content edits.

### Test from a mobile device
If you open the web app on a mobile device, you will notice that the UI does not display properly on a small device.

To fix this, you'll add a `viewport` meta tag:
1. Open the file `./public/index.html`
1. Add a `viewport` meta tag in the existing `head` element:

    ```html
    <head>
        <!-- Add this line -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    ```

1. Save the file.
1. Refresh your device's browser. You should now see the web app rendered correctly. 

This is an example of how some problems just aren't found until you test on the devices where an app is meant to be used. With Azure Dev Spaces, you can rapidly iterate on your code and validate any changes on target devices.

### Update a code file
Updating server-side code files requires a little more work, because a Node.js app needs to restart.

1. In the terminal window, press `Ctrl+C` (to stop `azds up`).
1. Open the code file named `server.js`, and edit service's hello message: 

    ```javascript
    res.send('Hello from webfrontend running in Azure!');
    ```

3. Save the file.
1. Run  `azds up` in the terminal window. 

This rebuilds the container image and redeploys the Helm chart. Reload the browser page to see your code changes take effect.

But there is an even *faster method* for developing code, which you'll explore in the next section. 

## Debug a container in Kubernetes

[!INCLUDE[](includes/debug-intro.md)]

[!INCLUDE[](includes/init-debug-assets-vscode.md)]

### Select the AZDS debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **Launch Program (AZDS)** as the active debug configuration.

![](media/get-started-node/debug-configuration-nodejs.png)

> [!Note]
> If you don't see any Azure Dev Spaces commands in the Command Palette, ensure you have [installed the VS Code extension for Azure Dev Spaces](get-started-nodejs.md#get-kubernetes-debugging-for-vs-code).

### Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes!

Similar to the `up` command, code is synced to the development environment when you start debugging, and a container is built and deployed to Kubernetes. This time, the debugger is attached to the remote container.

[!INCLUDE[](includes/tip-vscode-status-bar-url.md)]

Set a breakpoint in a server-side code file, for example within the `app.get('/api'...` in  `server.js`. Refresh the browser page, or press the 'Say It Again' button, and you should hit the breakpoint and be able to step through code.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

### Edit code and refresh the debug session
With the debugger active, make a code edit; for example, modify the hello message again:

```javascript
app.get('/api', function (req, res) {
    res.send('**** Hello from webfrontend running in Azure! ****');
});
```

Save the file, and in the **Debug actions pane**, click the **Refresh** button. 

![](media/get-started-node/debug-action-refresh-nodejs.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Azure Dev Spaces will restart the Node.js process in between debug sessions to provide a faster edit/debug loop.

Refresh the web app in the browser, or press the *Say It Again* button. You should see your custom message appear in the UI.

### Use NodeMon to develop even faster
*Nodemon* is a popular tool that Node.js developers use for rapid development. Instead of manually restarting the Node process each time a server-side code edit is made, developers will often configure their Node project to have *nodemon* monitor file changes and automatically restart the server process. In this style of working, the developer just refreshes their browser after making a code edit.

With Azure Dev Spaces, you can use many of the same development workflows you use when developing locally. To illustrate this, the sample `webfrontend` project was configured to use *nodemon* (it is configured as a dev dependency in `package.json`).

Try the following steps:
1. Stop the VS Code debugger.
1. Click on the Debug icon in the **Activity Bar** on the side of VS Code. 
1. Select **Attach (AZDS)** as the active debug configuration.
1. Hit F5.

In this configuration, the container is configured to start *nodemon*. When server code edits are made, *nodemon* automatically restarts the Node process, just like it does when you develop locally. 
1. Edit the hello message again in `server.js`, and save the file.
1. Refresh the browser, or click the *Say It Again* button, to see your changes take effect!

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, you'll see how you can create and call a second container.

## Call a service running in a separate container

In this section you're going to create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. You'll then debug across both containers.

![](media/common/multi-container.png)

### Open sample code for *mywebapi*
You should already have the sample code for `mywebapi` for this guide under a folder named `samples` (if not, go to https://github.com/Azure/dev-spaces and select **Clone or Download** to download the GitHub repository.) The code for this section is in `samples/nodejs/getting-started/mywebapi`.

### Run *mywebapi*
1. Open the folder `mywebapi` in a *separate VS Code window*.
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when the VS Code debug bar appears.
1. Take note of the endpoint URL, it will look something like http://localhost:\<portnumber\>. **Tip: The VS Code status bar will display a clickable URL.** It may seem like the container is running locally, but actually it is running in your development environment in Azure. The reason for the localhost address is because `mywebapi` has not defined any public endpoints and can only be accessed from within the Kubernetes instance. For your convenience, and to facilitate interacting with the private service from your local machine, Azure Dev Spaces creates a temporary SSH tunnel to the container running in Azure.
1. When `mywebapi` is ready, open your browser to the localhost address. You should see a response from the `mywebapi` service ("Hello from mywebapi").


### Make a request from *webfrontend* to *mywebapi*
Let's now write code in `webfrontend` that makes a request to `mywebapi`.
1. Switch to the VS Code window for `webfrontend`.
1. Add these lines of code at the top of `server.js`:
    ```javascript
    var request = require('request');
    ```

3. *Replace* the code for the `/api` GET handler. When handling a request, it in turn makes a call to `mywebapi`, and then returns the results from both services.

    ```javascript
    app.get('/api', function (req, res) {
       request({
          uri: 'http://mywebapi',
          headers: {
             /* propagate the dev space routing header */
             'azds-route-as': req.headers['azds-route-as']
          }
       }, function (error, response, body) {
           res.send('Hello from webfrontend and ' + body);
       });
    });
    ```

The preceding code example forwards the `azds-route-as` header from the incoming request to the outgoing request. You'll see later how this helps teams with collaborative development.

### Debug across multiple services
1. At this point, `mywebapi` should still be running with the debugger attached. If it is not, hit F5 in the `mywebapi` project.
1. Set a breakpoint in the default GET `/` handler.
1. In the `webfrontend` project, set a breakpoint just before it sends a GET request to `http://mywebapi`.
1. Hit F5 in the `webfrontend` project.
1. Open the web app, and step through code in both services. The web app should display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi."

Well done! You now have a multi-container application where each container can be developed and deployed separately.

## Learn about team development

[!INCLUDE[](includes/team-development-1.md)]

Now see it in action:
1. Go to the VS Code window for `mywebapi` and make a code edit to the default GET `/` handler, for example:

    ```javascript
    app.get('/', function (req, res) {
        res.send('mywebapi now says something new');
    });
    ```

[!INCLUDE[](includes/team-development-2.md)]

[!INCLUDE[](includes/well-done.md)]

[!INCLUDE[](includes/clean-up.md)]




