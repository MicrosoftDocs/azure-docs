---
title: "Create a Node.js development environment with containers using Kubernetes in the cloud - Step 6 - Learn about team development | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/23/2018"
ms.topic: "tutorial"

description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Get Started on Connected Environment with Node.js

Previous step: [Call a service running in a separate container](get-started-nodejs-05.md)

[!INCLUDE[](includes/team-development-1.md)]

Now see it in action:
1. Go to the VS Code window for `mywebapi` and make a code edit to the default GET `/` handler, for example:

```javascript
app.get('/', function (req, res) {
    res.send('mywebapi now says something new');
});
```

[!INCLUDE[](includes/team-development-2.md)]

> [!div class="nextstepaction"]
> [Next](get-started-nodejs-07.md)

