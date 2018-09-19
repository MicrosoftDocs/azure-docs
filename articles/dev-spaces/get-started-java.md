---
title: "Create a Kubernetes dev space in the cloud using Java and VS Code| Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "stepro"
ms.author: "stephpr"
ms.date: "08/01/2018"
ms.topic: "tutorial"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "mmontwil"
---
# Get Started on Azure Dev Spaces with Java

[!INCLUDE[](includes/learning-objectives.md)]

[!INCLUDE[](includes/see-troubleshooting.md)]

You're now ready to create a Kubernetes-based dev space in Azure.

[!INCLUDE[](includes/portal-aks-cluster.md)]

## Install the Azure CLI
Azure Dev Spaces requires minimal local machine setup. Most of your dev space's configuration gets stored in the cloud, and is shareable with other users. Start by downloading and running the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).

> [!IMPORTANT]
> If you already have the Azure CLI installed, make sure you are using version 2.0.43 or higher.

[!INCLUDE[](includes/sign-into-azure.md)]

[!INCLUDE[](includes/use-dev-spaces.md)]

[!INCLUDE[](includes/install-vscode-extension.md)]

In order to debug Java applications with Azure Dev Spaces, download and install the [Java Debugger for Azure Dev Spaces](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debugger-azds) extension for VS Code. Click Install once on the extension's Marketplace page, and again in VS Code.

While you're waiting for the cluster to be created, you can start developing code.

## Create a web app running in a container

In this section, you'll create a Java web application and get it running in a container in Kubernetes.

### Create a Java web app
Download code from GitHub by navigating to https://github.com/Azure/dev-spaces and select **Clone or Download** to download the GitHub repository to your local environment. The code for this guide is in `samples/java/getting-started/webfrontend`.

[!INCLUDE[](includes/azds-prep.md)]

[!INCLUDE[](includes/build-run-k8s-cli.md)]

### Update a content file
Azure Dev Spaces isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. In the terminal window, press `Ctrl+C` (to stop `azds up`).
1. Open the code file named `src/main/java/com/ms/sample/webfrontend/Application.java`, and edit the greeting message: `return "Hello from webfrontend in Azure!";`
1. Save the file.
1. Run  `azds up` in the terminal window.

This command rebuilds the container image and redeploys the Helm chart. To see your code changes take effect in the running application, simply refresh the browser.

But there is an even *faster method* for developing code, which you'll explore in the next section. 

## Debug a container in Kubernetes

[!INCLUDE[](includes/debug-intro.md)]

[!INCLUDE[](includes/init-debug-assets-vscode.md)]

### Select the AZDS debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **Launch Java Program (AZDS)** as the active debug configuration.

![](media/get-started-java/debug-configuration.png)

> [!Note]
> If you don't see any Azure Dev Spaces commands in the Command Palette, ensure you have installed the VS Code extension for Azure Dev Spaces. Be sure the workspace you opened in VS Code is the folder that contains azds.yaml.

### Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes.

As with the `up` command, code is synced to the dev space, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

[!INCLUDE[](includes/tip-vscode-status-bar-url.md)]

Set a breakpoint in a server-side code file, for example within the `greeting()` function in the `src/main/java/com/ms/sample/webfrontend/Application.java` source file. Refreshing the browser page causes the breakpoint to hit.

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

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, you'll see how you can create and call a second container.

## Next steps

> [!div class="nextstepaction"]
> [Learn about team development](team-development-java.md)