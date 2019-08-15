---
title: "Team development with Azure Dev Spaces using .NET Core and VS Code"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: 07/09/2018
ms.topic: tutorial
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s "
---

[!INCLUDE [](../../includes/devspaces-team-development-1.md)]

### Make a code change
Go to the VS Code window for `mywebapi` and make a code edit to the `string Get(int id)` method in `Controllers/ValuesController.cs`, for example:

```csharp
[HttpGet("{id}")]
public string Get(int id)
{
    return "mywebapi now says something new";
}
```

[!INCLUDE [](../../includes/devspaces-team-development-2.md)]
