---
title: "Develop with .NET Core on Kubernetes using Azure Dev Spaces (Visual Studio Code)"
titleSuffix: Azure Dev Spaces
author: zr-msft
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.author: zarhoads
ms.date: 07/08/2019
ms.topic: quickstart
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
manager: gwallace
---
# Quickstart: Develop with .NET Core on Kubernetes using Azure Dev Spaces (Visual Studio Code)

In this guide, you will learn how to:

- Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
- Iteratively develop code in containers using Visual Studio Code.
- Debug the code in your dev space from Visual Studio Code.

## Prerequisites

- An Azure subscription. If you don't have one, you can create a [free account](https://azure.microsoft.com/free).
- [Visual Studio Code installed](https://code.visualstudio.com/download).
- The [Azure Dev Spaces](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds) and [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) extensions for Visual Studio Code installed.
- [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create an Azure Kubernetes Service cluster

You need to create an AKS cluster in a [supported region][supported-regions]. The below commands create a resource group called *MyResourceGroup* and an AKS cluster called *MyAKS*.

```cmd
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --node-vm-size Standard_DS2_v2 --node-count 1 --disable-rbac --generate-ssh-keys
```

## Enable Azure Dev Spaces on your AKS cluster

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a *default* dev space.

```cmd
$ az aks use-dev-spaces -g MyResourceGroup -n MyAKS

'An Azure Dev Spaces Controller' will be created that targets resource 'MyAKS' in resource group 'MyResourceGroup'. Continue? (y/N): y

Creating and selecting Azure Dev Spaces Controller 'MyAKS' in resource group 'MyResourceGroup' that targets resource 'MyAKS' in resource group 'MyResourceGroup'...2m 24s

Select a dev space or Kubernetes namespace to use as a dev space.
 [1] default
Type a number or a new name: 1

Kubernetes namespace 'default' will be configured as a dev space. This will enable Azure Dev Spaces instrumentation for new workloads in the namespace. Continue? (Y/n): Y

Configuring and selecting dev space 'default'...3s

Managed Kubernetes cluster 'MyAKS' in resource group 'MyResourceGroup' is ready for development in dev space 'default'. Type `azds prep` to prepare a source directory for use with Azure Dev Spaces and `azds up` to run.
```

## Get sample application code

In this article, you use the [Azure Dev Spaces sample application](https://github.com/Azure/dev-spaces) to demonstrate using Azure Dev Spaces.

Clone the application from GitHub.

```cmd
git clone https://github.com/Azure/dev-spaces
```

## Prepare the sample application in Visual Studio Code

Open Visual Studio Code, click *File* then *Open...*, navigate to the *dev-spaces/samples/dotnetcore/getting-started/webfrontend* directory, and click *Open*.

You now have the *webfrontend* project open in Visual Studio Code. To run the application in your dev space, generate the Docker and Helm chart assets using the Azure Dev Spaces extension in the Command Pallette.

To open the Command Palette in Visual Studio Code, click *View* then *Command Palette*. Begin typing `Azure Dev Spaces` and click on `Azure Dev Spaces: Prepare configuration files for Azure Dev Spaces`.

![Prepare configuration files for Azure Dev Spaces](./media/common/command-palette.png)

When Visual Studio Code also prompts you to configure your public endpoint, choose `Yes` to enable a public endpoint.

![Select public endpoint](media/common/select-public-endpoint.png)

This command prepares your project to run in Azure Dev Spaces by generating a Dockerfile and Helm chart. It also generates a *.vscode* directory with debugging configuration at the root of your project.

## Build and run code in Kubernetes from Visual Studio

Click on the *Debug* icon on the left and click *.NET Core Launch (AZDS)* at the top.

![](media/get-started-netcore/debug-configuration.png)

This command builds and runs your service in Azure Dev Spaces in debugging mode. The *Terminal* window at the bottom shows the build output and URLs for your service running Azure Dev Spaces. The *Debug Console* shows the log output.

> [!Note]
> If you don't see any Azure Dev Spaces commands in the *Command Palette*, make sure you have installed the [Visual Studio Code extension for Azure Dev Spaces](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds). Also verify you opened the *dev-spaces/samples/dotnetcore/getting-started/webfrontend* directory in Visual Studio Code.

You can see the service running by opening the public URL.

Click *Debug* then *Stop Debugging* to stop the debugger.

## Update code

To deploy an updated version of your service, you can update any file in your project and rerun *.NET Core Launch (AZDS)*. For example:

1. If your application is still running, click *Debug* then *Stop Debugging* to stop it.
1. Update [line 22 in `Controllers/HomeController.cs`](https://github.com/Azure/dev-spaces/blob/master/samples/dotnetcore/getting-started/webfrontend/Controllers/HomeController.cs#L22) to:
    
    ```csharp
    ViewData["Message"] = "Your application description page in Azure.";
    ```

1. Save your changes.
1. Rerun *.NET Core Launch (AZDS)*.
1. Navigate to your running service and click *About*.
1. Observe your changes.
1. Click *Debug* then *Stop Debugging* to stop your application.

## Setting and using breakpoints for debugging

Start your service in debugging mode using *.NET Core Launch (AZDS)*.

Navigate back to the *Explorer* view by clicking *View* then *Explorer*. Open `Controllers/HomeController.cs` and click somewhere on line 22 to put your cursor there. To set a breakpoint hit *F9* or click *Debug* then *Toggle Breakpoint*.

Open your service in a browser and notice no message is displayed. Return to Visual Studio Code and observe line 20 is highlighted. The breakpoint you set has paused the service at line 20. To resume the service, hit *F5* or click *Debug* then *Continue*. Return to your browser and notice the message is now displayed.

While running your service in Kubernetes with a debugger attached, you have full access to debug information such as the call stack, local variables, and exception information.

Remove the breakpoint by putting your cursor on line 22 in `Controllers/HomeController.cs` and hitting *F9*.

## Update code from Visual Studio Code

While the service is running in debugging mode, update line 22 in `Controllers/HomeController.cs`. For example:

```csharp
ViewData["Message"] = "Your application description page in Azure while debugging!";
```

Save the file. Click *Debug* then *Restart Debugging* or in the *Debug toolbar*, click the *Restart Debugging* button.

![](media/common/debug-action-refresh.png)

Open your service in a browser and notice your updated message is displayed.

Instead of rebuilding and redeploying a new container image each time code edits are made, Azure Dev Spaces incrementally recompiles code within the existing container to provide a faster edit/debug loop.

## Clean up your Azure resources

```cmd
az group delete --name MyResourceGroup --yes --no-wait
```

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces. 

> [!div class="nextstepaction"]
> [Working with multiple containers and team development](multi-service-netcore.md)


[supported-regions]: about.md#supported-regions-and-configurations