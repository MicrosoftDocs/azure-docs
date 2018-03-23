---
title: "Quickstart: Create a Kubernetes development environment in Azure - Node.js | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/22/2018"
ms.topic: "quickstart"
ms.technology: "vsce-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Quickstart: Create a connected environment - Node.js

In this quickstart, you will learn how to:

1. Create a Kubernetes-based environment in Azure that is optimized for development.
1. Iteratively develop code in containers using VS Code and the command line.

[!INCLUDE[](includes/see-troubleshooting.md)]

[!INCLUDE[](includes/install-cli-and-vscode.md)]

We're now ready to create a Kubernetes-based development environment in Azure.

[!INCLUDE[](includes/sign-into-azure.md)]

[!INCLUDE[](includes/create-env-cli.md)]

While we're waiting for the environment to be create, let's start developing code!

# Create a Node.js Web App
Download code from GitHub by navigating to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository to your local environment. The code for this guide is in `vsce/samples/nodejs/getting-started/webfrontend`.

[!INCLUDE[](includes/vsce-init.md)]

[!INCLUDE[](includes/ensure-env-created.md)]

[!INCLUDE[](includes/build-and-run-in-k8s-cli.md)]

## Update a content file
Connected Environment isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. Locate the file `./public/index.html` and make an edit to the HTML. For example, change the page's background color to a shade of blue:

```html
<body style="background-color: #95B9C7; margin-left:10px; margin-right:10px;">
```

2. Save the file. Moments later, in the Terminal window you'll see a message saying a file in the running container was updated.
1. Go to your browser and refresh the page. You should see your color update.

What happened? Edits to content files, like HTML and CSS, don't require the Node.js process to restart, so an active `vsce up` command will automatically sync any modified content files directly into the running container in Azure, thereby providing a fast way to see your content edits.

### Test from a mobile device
If you open the web app on a mobile device, you will notice that the UI does not display properly on a small device.

To fix this, we'll add a `viewport` meta tag:
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

This is an example of how some problems just aren't found until you test on the devices an app is meant to be used. With VS Connected Environment you can rapidly iterate on your code and validate any changes on target devices.

## Update a code file
Updating server-side code files requires a little more work, because a Node.js app needs to restart.

1. In the terminal window, press `Ctrl+C` (to stop `vsce up`).
1. Open the code file named `server.js`, and edit service's hello message: 

```javascript
res.send('Hello from webfrontend running in Azure!');
```

3. Save the file.
1. Run  `vsce up` in the terminal window. 

This rebuilds the container image and redeploys the Helm chart. Reload the browser page to see your code changes take effect.


But there is an even *faster method* for developing code, which we'll explore in the next section. 

[!INCLUDE[](includes/debug-intro.md)]

[!INCLUDE[](includes/init-debug-assets-vscode.md)]


## Select the VSCE debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **Launch Program (VSCE)** as the active debug configuration.

![](media/debug-configuration-nodejs.png)

> [!Note]
> If you don't see any Connected Environment commands in the Command Palette, ensure you have [installed the VS Code extension for Connected Environment](get-started-nodejs-01.md#get-kubernetes-debugging-for-vs-code).

## Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes!

Similar to the `up` command, code is synced to the development environment when you start debugging, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

[!INCLUDE[](includes/tip-vscode-status-bar-url.md)]

Set a breakpoint in a server-side code file, for example within the `app.get('/api'...` in  `server.js`. Refresh the browser page, or press the 'Say It Again' button, and you should hit the breakpoint and be able to step through code.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

## Edit code and refresh the debug session
With the debugger active, make a code edit; for example, modify the hello message again:

```javascript
app.get('/api', function (req, res) {
    res.send('**** Hello from webfrontend running in Azure! ****');
});
```

Save the file, and in the **Debug actions pane**, click the **Refresh** button. 

![](media/debug-action-refresh-nodejs.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Connected Environment will restart the Node.js process in between debug sessions to provide a faster edit/debug loop.

Refresh the web app in the browser, or press the *Say It Again* button. You should see your custom message appear in the UI.


## Use NodeMon to develop even faster
*Nodemon* is a popular tool that Node.js developers use for rapid development. Instead of manually restarting the Node process each time a server-side code edit is made, developers will often configure their Node project to have *nodemon* monitor file changes and automatically restart the server process. In this style of working, the developer just refreshes their browser after making a code edit.

Connected Environment's intent is for you to be able to use the same, productive development workflows you employ when developing locally. To illustrate this, the sample `webfrontend` project was configured to use *nodemon* (it is configured as a dev dependency in `package.json`).

Try the following:
1. Stop the VS Code debugger.
1. Click on the Debug icon in the **Activity Bar** on the side of VS Code. 
1. Select **Attach (VSCE)** as the active debug configuration.
1. Hit F5.

In this configuration, the container is configured to start *nodemon*. When server code edits are made, *nodemon* automatically restarts the Node process, just like it does when you develop locally. 
1. Edit the hello message again in `server.js`, and save the file.
1. Refresh the browser, or click the *Say It Again* button, to see your changes take effect!

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, we'll see how we can create and call a second container.

## Call another container

In this section we're going to create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. We'll then debug across both containers.

![](media/multi-container.png)

## Open sample code for *mywebapi*
You should already have the sample code for `mywebapi` for this guide under a folder named `vsce/samples` (if not, go to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository.) The code for this section is in `vsce/samples/nodejs/getting-started/mywebapi`.

## Run *mywebapi*
1. Open the folder `mywebapi` in a *separate VS Code window*.
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when the VS Code debug bar appears.
1. Take note of the endpoint URL, it will look something like http://localhost:\<portnumber\>. **Tip: The VS Code status bar will display a clickable URL.** It may seem like the container is running locally, but actually it is running in our development environment in Azure. The reason for the localhost address is because `mywebapi` has not defined any public endpoints and can only be accessed from within the Kubernetes instance. For your convenience, and to facilitate interacting with the private service from your local machine, Connected Environment creates a temporary SSH tunnel to the container running in Azure.
1. When `mywebapi` is ready, open your browser to the localhost address. You should see a response from the `mywebapi` service ("Hello from mywebapi").


## Make a request from *webfrontend* to *mywebapi*
Let's now write code in `webfrontend` that makes a request to `mywebapi`.
1. Switch to the VS Code window for `webfrontend`.
1. Add these lines of code at the top of `server.js`:
```javascript
var request = require('request');
var propagateHeaders = require('./propagateHeaders');
```

3. *Replace* the code for the `/api` GET handler. When handling a request, it in turn makes a call to `mywebapi`, and then returns the results from both services.

```javascript
app.get('/api', function (req, res) {
    request({
        uri: 'http://mywebapi',
        headers: propagateHeaders.from(req) // propagate headers to outgoing requests
    }, function (error, response, body) {
        res.send('Hello from webfrontend and ' + body);
    });
});
```

Note how Kubernetes' DNS service discovery is employed to refer to the service as `http://mywebapi`. **Code in our development environment is running the same way it will run in production**.

The code example above utilizes a helper module named `propagateHeaders`. This helper was added to your code folder at the time you ran `vsce init`. The `propagateHeaders.from()` function propagates specific headers from an existing http.IncomingMessage object into a headers object for an outgoing request. We'll see later how this facilitates a more productive development experience in team scenarios.


## Debug across multiple services
1. At this point, `mywebapi` should still be running with the debugger attached. If it is not, hit F5 in the `mywebapi` project.
1. Set a breakpoint in the default GET `/` handler.
1. In the `webfrontend` project, set a breakpoint just before it sends a GET request to `http://mywebapi`.
1. Hit F5 in the `webfrontend` project.
1. Open the web app, and step through code in both services. The web app should display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi".


Well done! You now have a multi-container application where each container can be developed and deployed separately.

## Team development

[!INCLUDE[](includes/team-development-1.md)]

Let's see it in action:
1. Go to the VS Code window for `mywebapi` and make a code edit to the default GET `/` handler, for example:

```javascript
app.get('/', function (req, res) {
    res.send('mywebapi now says something new');
});
```

[!INCLUDE[](includes/team-development-2.md)]

## Summary

[!INCLUDE[](includes/well-done.md)]

[!INCLUDE[](includes/take-survey.md)]

[!INCLUDE[](includes/clean-up.md)]

## Next Steps

TBD
