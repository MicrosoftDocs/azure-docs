---
title: "Create a .NET Core development environment with containers using Kubernetes in the cloud - Step 3 - Create an ASP.NET Core web app | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/23/2018"
ms.topic: "tutorial"

description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Get Started on Connected Environment with .NET Core

Previous step: [Create a Kubernetes development environment in Azure](get-started-netcore-02.md)

## Create an ASP.NET Core Web App
If you have [.NET Core](https://www.microsoft.com/net) installed, you can quickly create an ASP.NET Core Web App in a folder named `webfrontend`.
```cmd
dotnet new mvc --name webfrontend
```

Or, **download sample code from GitHub** by navigating to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository to your local environment. The code for this guide is in `vsce/samples/dotnetcore/getting-started/webfrontend`.

[!INCLUDE[](includes/vsce-init.md)]

[!INCLUDE[](includes/ensure-env-created.md)]

[!INCLUDE[](includes/build-and-run-in-k8s-cli.md)]

## Update a content file
Connected Environment isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. Locate the file `./Views/Home/Index.cshtml` and make an edit to the HTML. For example, change line 70 that reads `<h2>Application uses</h2>` to something like: `<h2>Hello k8s in Azure!</h2>`
1. Save the file. Moments later, in the Terminal window you'll see a message saying a file in the running container was updated.
1. Go to your browser and refresh the page. You should see the web page display the updated HTML.

What happened? Edits to content files, like HTML and CSS, don't require recompilation in a .NET Core web app, so an active `vsce up` command automatically syncs any modified content files into the running container in Azure, so you can see your content edits right away.

## Update a code file
Updating code files requires a little more work, because a .NET Core app needs to rebuild and produce updated application binaries.

1. In the terminal window, press `Ctrl+C` (to stop `vsce up`).
1. Open the code file named `Controllers/HomeController.cs`, and edit the message that the About page will display: `ViewData["Message"] = "Your application description page.";`
1. Save the file.
1. Run  `vsce up` in the terminal window. 

This command rebuilds the container image and redeploys the Helm chart. To see your code changes take effect in the running application, go to the About menu in the web app.


But there is an even *faster method* for developing code, which you'll explore in the next section. 
> [!div class="nextstepaction"]
> [Debug a container in Kubernetes](get-started-netcore-04.md)

