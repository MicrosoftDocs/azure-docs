---
title: "Team development with Azure Dev Spaces using Java and VS Code"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: stepro
ms.author: stephpr
ms.date: 08/01/2018
ms.topic: tutorial
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s "
manager: gwallace
---

[!INCLUDE [](../../includes/devspaces-team-development-1.md)]

### Make a code change
Go to the VS Code window for `mywebapi` and make a code edit to the `String index()` method in `src/main/java/com/ms/sample/mywebapi/Application.java`, for example:

```java
@RequestMapping(value = "/", produces = "text/plain")
public String index() {
    return "Hello from mywebapi says something new";
}
```

[!INCLUDE [](../../includes/devspaces-team-development-2.md)]
