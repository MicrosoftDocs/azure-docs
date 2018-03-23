---
title: "Create a Node.js development environment with containers using Kubernetes in the cloud - Step 3 - Create an ASP.NET web app | Microsoft Docs"
author: "johnsta"
ms.author: "johnsta"
ms.date: "02/20/2018"
ms.topic: "get-started-article"
ms.technology: "vsce-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "ghogen"
---
# Get Started on Connected Environment with Node.js

Previous step: [Create a Kubernetes development environment in Azure](get-started-nodejs-02.md)

## Create a Node.js Web App
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
> [!div class="nextstepaction"]
> [Debug a container in Kubernetes](get-started-nodejs-04.md)
