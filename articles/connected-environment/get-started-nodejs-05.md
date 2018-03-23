---
title: "Create a Node.js development environment with containers using Kubernetes in the cloud - Step 5 - Call another container | Microsoft Docs"
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

Previous step: [Debug a container in Kubernetes](get-started-nodejs-04.md)

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

> [!div class="nextstepaction"]
> [Learn about team development](get-started-nodejs-06.md)
