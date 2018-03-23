---
title: "Create a .NET Core development environment with containers using Kubernetes in the cloud - Step 4 - Debug a container in Kubernetes  | Microsoft Docs"
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
 
Previous step: [Create an ASP.NET Core Web App](get-started-netcore-03.md)

[!INCLUDE[](includes/debug-intro.md)]

[!INCLUDE[](includes/init-debug-assets-vscode.md)]


## Select the VSCE debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **.NET Core Launch (VSCE)** as the active debug configuration.

![](media/debug-configuration.png)

> [!Note]
> If you don't see any Connected Environment commands in the Command Palette, ensure you have [installed the VS Code extension for Connected Environment](get-started-netcore-01.md#get-kubernetes-debugging-for-vs-code).


## Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes.

As with the `up` command, code is synced to the development environment, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

[!INCLUDE[](includes/tip-vscode-status-bar-url.md)]

Set a breakpoint in a server-side code file, for example within the `Index()` function in the `Controllers/HomeController.cs` source file. Refreshing the browser page causes the breakpoint to hit.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

## Edit code and refresh
With the debugger active, make a code edit. For example, modify the About page's message in `Controllers/HomeController.cs`. 

```csharp
public IActionResult About()
{
    ViewData["Message"] = "My custom message in the About page.";
    return View();
}
```

Save the file, and in the **Debug actions pane**, click the **Refresh** button. 

![](media/debug-action-refresh.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Connected Environment will incrementally recompile code within the existing container to provide a faster edit/debug loop.

Refresh the web app in the browser, and go to the About page. You should see your custom message appear in the UI.

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, we'll see how we can create and call a second container.

> [!div class="nextstepaction"]
> [Call a service running in a separate container](get-started-netcore-05.md)
