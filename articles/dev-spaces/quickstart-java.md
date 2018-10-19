---
title: "Create a Kubernetes dev space in the cloud | Microsoft Docs"
titleSuffix: Azure Dev Spaces
author: "stepro"
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
ms.author: "stephpr"
ms.date: "09/26/2018"
ms.topic: "quickstart"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "mmontwil"
---
# Quickstart: Create a Kubernetes dev space with Azure Dev Spaces (Java and VS Code)

In this guide, you will learn how to:

- Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
- Iteratively develop code in containers using VS Code and the command line.
- Debug the code in your dev space from VS Code.

> [!Note]
> **If you get stuck** at any time, see the [Troubleshooting](troubleshooting.md) section, or post a comment on this page. You can also try the more detailed [tutorial](get-started-netcore.md).

## Prerequisites

- An Azure subscription. If you don't have one, you can create a [free account](https://azure.microsoft.com/free).
- [Visual Studio Code](https://code.visualstudio.com/download).
- [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.43 or higher.
- A Kubernetes cluster running Kubernetes 1.10.3 or later, in the EastUS, CentralUS, WestUS2, WestEurope, CanadaCentral, or CanadaEast region, with **Http Application Routing** enabled.

    ```cmd
    az group create --name MyResourceGroup --location <region>
    az aks create -g MyResourceGroup -n myAKS --location <region> --kubernetes-version 1.11.2 --enable-addons http_application_routing --generate-ssh-keys
    ```

## Set up Azure Dev Spaces

1. Set up Dev Spaces on your AKS cluster: `az aks use-dev-spaces -g MyResourceGroup -n MyAKS`
1. Download the [Azure Dev Spaces extension](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds) for VS Code. Click Install once on the extension's Marketplace page, and again in VS Code.
1. Download the [Java Debugger for Azure Dev Spaces](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debugger-azds) extension for VS Code. Click Install once on the extension's Marketplace page, and again in VS Code.

## Build and run code in Kubernetes

1. Download sample code from GitHub: [https://github.com/Azure/dev-spaces](https://github.com/Azure/dev-spaces) 
1. Change directory to the webfrontend folder: `cd dev-spaces/samples/java/getting-started/webfrontend`
1. Generate Docker and Helm chart assets: `azds prep --public`
1. Build and run your code in AKS. In the terminal window from the **webfrontend folder**, run this command: `azds up`
1. Scan the console output for information about the URL that was created by the `up` command. It will be in the form:

   ```output
    (pending registration) Service 'webfrontend' port 'http' will be available at <url>
    Service 'webfrontend' port 80 (TCP) is available at http://localhost:<port>
   ```

   Open this URL in a browser window, and you should see the web app load.

   > [!Note]
   > On first run, it can take several minutes for public DNS to be ready. If the public URL does not resolve, you can use the alternative http://localhost:<portnumber> URL that is displayed in the console output. If you use the localhost URL, it may seem like the container is running locally, but actually it is running in AKS. For your convenience, and to facilitate interacting with the service from your local machine, Azure Dev Spaces creates a temporary SSH tunnel to the container running in Azure. You can come back and try the public URL later when the DNS record is ready.

### Update a code file

1. In the terminal window, press `Ctrl+C` (to stop `azds up`).
1. Open the code file named `src/main/java/com/ms/sample/webfrontend/Application.java` and edit the greeting message: `return "Hello from webfrontend in Azure!";`
1. Save the file.
1. Run  `azds up` in the terminal window.

This command rebuilds the container image and redeploys the Helm chart. To see your code changes take effect in the running application, simply refresh the browser.

But there is an even *faster method* for developing code, which you'll explore in the next section.

## Debug a container in Kubernetes

In this section, you'll use VS Code to directly debug your container running in Azure. You'll also learn how to get a faster edit-run-test loop.

![](./media/common/edit-refresh-see.png)

### Initialize debug assets with the VS Code extension
You first need to configure your code project so VS Code will communicate with the dev space in Azure. The VS Code extension for Azure Dev Spaces provides a helper command to set up debug configuration.

Open the **Command Palette** (using the **View | Command Palette** menu), and use auto-complete to type and select this command: `Azure Dev Spaces: Prepare configuration files for Azure Dev Spaces`.

This adds debug configuration for Azure Dev Spaces under the `.vscode` folder.

![](./media/common/command-palette.png)

### Select the AZDS debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **Launch Java Program (AZDS)** as the active debug configuration.

![](media/get-started-java/debug-configuration.png)

> [!Note]
> If you don't see any Azure Dev Spaces commands in the Command Palette, ensure you have installed the VS Code extension for Azure Dev Spaces. Be sure the workspace you opened in VS Code is the folder that contains azds.yaml.

### Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes.

As with the `up` command, code is synced to the dev space, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

> [!Tip]
> The VS Code status bar will display a clickable URL.

Set a breakpoint in a server-side code file, for example within the `greeting()` function in the `src/main/java/com/ms/sample/webfrontend/Application.java` source file. Refreshing the browser page causes the breakpoint to be hit.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

### Edit code and refresh
With the debugger active, make a code edit. For example, modify the greeting in `src/main/java/com/ms/sample/webfrontend/Application.java`. 

```java
public String greeting()
{
    return "I'm debugging Java code in Azure!";
}
```

Save the file, and in the **Debug actions pane**, click the **Refresh** button. 

![](media/get-started-java/debug-action-refresh.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Azure Dev Spaces will incrementally recompile code within the existing container to provide a faster edit/debug loop.

Refresh the web app in the browser. You should see your custom message appear in the UI.

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!**

## Next steps

Learn how Azure Dev Spaces helps you develop more complex apps across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Working with multiple containers and team development](team-development-java.md)
