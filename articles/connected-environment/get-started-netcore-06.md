---
title: "Create a .NET Core development environment with containers using Kubernetes in the cloud - Step 6 - Learn about team development | Microsoft Docs"
author: "johnsta"
ms.author: "johnsta"
ms.date: "02/20/2018"
ms.topic: "get-started-article"
ms.technology: "vsce-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "ghogen"
---
# Get Started on Connected Environment with .NET Core

Previous step: [Call another container](get-started-netcore-05.md)

[!INCLUDE[](includes/team-development-1.md)]

Let's see it in action:
1. Go to the VS Code window for `mywebapi` and make a code edit to the `string Get(int id)` method, for example:

```csharp
[HttpGet("{id}")]
public string Get(int id)
{
    return "mywebapi now says something new";
}
```

[!INCLUDE[](includes/team-development-2.md)]

> [!div class="nextstepaction"]
> [Next](get-started-netcore-07.md)
