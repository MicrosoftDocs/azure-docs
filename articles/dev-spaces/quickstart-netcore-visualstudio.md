---
title: "Debug and iterate on Kubernetes: Visual Studio & .NET Core"
services: azure-dev-spaces
ms.date: 11/13/2019
ms.topic: quickstart
description: "This quickstart shows you how to use Azure Dev Spaces and Visual Studio to debug and rapidly iterate a .NET Core application on Azure Kubernetes Service"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
manager: gwallace
ms.custom: vs-azure
ms.workload: azure-vs
---
# Quickstart: Debug and iterate on Kubernetes: Visual Studio & .NET Core - Azure Dev Spaces

In this guide, you will learn how to:

- Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
- Iteratively develop code in containers using Visual Studio.
- Debug code running in your cluster using Visual Studio.

Azure Dev Spaces also allows you debug and iterate using:
- [Java and Visual Studio Code](quickstart-java.md)
- [Node.js and Visual Studio Code](quickstart-nodejs.md)
- [.NET Core and Visual Studio Code](quickstart-netcore.md)

## Prerequisites

- An Azure subscription. If you don't have one, you can create a [free account](https://azure.microsoft.com/free).
- Visual Studio 2019 on Windows with the Azure Development workload installed. If you don't have Visual Studio installed, download it [here](https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs).
- [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create an Azure Kubernetes Service cluster

You need to create an AKS cluster in a [supported region][supported-regions]. The below commands create a resource group called *MyResourceGroup* and an AKS cluster called *MyAKS*.

```azurecli
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --generate-ssh-keys
```

## Enable Azure Dev Spaces on your AKS cluster

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a *default* dev space.

> [!NOTE]
> The `use-dev-spaces` command will also install the Azure Dev Spaces CLI if its not already installed. You cannot install the Azure Dev Spaces CLI in the Azure Cloud Shell.

```azurecli
az aks use-dev-spaces -g MyResourceGroup -n MyAKS
```

```output
'An Azure Dev Spaces Controller' will be created that targets resource 'MyAKS' in resource group 'MyResourceGroup'. Continue? (y/N): y

Creating and selecting Azure Dev Spaces Controller 'MyAKS' in resource group 'MyResourceGroup' that targets resource 'MyAKS' in resource group 'MyResourceGroup'...2m 24s

Select a dev space or Kubernetes namespace to use as a dev space.
 [1] default
Type a number or a new name: 1

Kubernetes namespace 'default' will be configured as a dev space. This will enable Azure Dev Spaces instrumentation for new workloads in the namespace. Continue? (Y/n): Y

Configuring and selecting dev space 'default'...3s

Managed Kubernetes cluster 'MyAKS' in resource group 'MyResourceGroup' is ready for development in dev space 'default'. Type `azds prep` to prepare a source directory for use with Azure Dev Spaces and `azds up` to run.
```

## Create a new ASP.NET web app

1. Open Visual Studio.
1. Create a new project.
1. Choose *ASP.NET Core Web Application* and click *Next*.
1. Name your project *webfrontend* and click *Create*.
1. When prompted, choose *Web Application (Model-View-Controller)* for the template.
1. Select *.NET Core* and *ASP.NET Core 2.1* at the top.
1. Click *Create*.

## Connect your project to your dev space

In your project, select **Azure Dev Spaces** from the launch settings dropdown as shown below.

![](media/get-started-netcore-visualstudio/LaunchSettings.png)

In the Azure Dev Spaces dialog, select your *Subscription* and *Azure Kubernetes Cluster*. Leave *Space* set to *default* and enable the *Publicly Accessible* checkbox. Click *OK*.

![](media/get-started-netcore-visualstudio/Azure-Dev-Spaces-Dialog.png)

This process deploys your service to the *default* dev space with a publicly accessible URL. If you choose a cluster that hasn't been configured to work with Azure Dev Spaces, you'll see a message asking if you want to configure it. Click *OK*.

![](media/get-started-netcore-visualstudio/Add-Azure-Dev-Spaces-Resource.png)

The public URL for the service running in the *default* dev space is displayed in the *Output* window:

```cmd
Starting warmup for project 'webfrontend'.
Waiting for namespace to be provisioned.
Using dev space 'default' with target 'MyAKS'
...
Successfully built 1234567890ab
Successfully tagged webfrontend:devspaces-11122233344455566
Built container image in 39s
Waiting for container...
36s

Service 'webfrontend' port 'http' is available at `http://default.webfrontend.1234567890abcdef1234.eus.azds.io/`
Service 'webfrontend' port 80 (http) is available at http://localhost:62266
Completed warmup for project 'webfrontend' in 125 seconds.
```

In the above example, the public URL is `http://default.webfrontend.1234567890abcdef1234.eus.azds.io/`. 

Select **Debug** then **Start Debugging**. After a few seconds, your service will start and Visual Studio will open a browser with the public URL of the service. If a browser does not automatically open, navigate to your service's public URL in a browser and interact with the service running in your dev space.

This process may have disabled public access to your service. To enable public access, you can update the [ingress value in the *values.yaml*][ingress-update].

## Update code

If Visual Studio is still connected to your dev space, click the stop button. Change line 20 in `Controllers/HomeController.cs` to:
    
```csharp
ViewData["Message"] = "Your application description page in Azure.";
```

Save your changes and select **Debug** then **Start Debugging**. After a few seconds, your service will start and Visual Studio will open a browser with the public URL of the service. If a browser does not automatically open, navigate the public URL of your service in a browser and click *About*. Observe that your updated message appears.

Instead of rebuilding and redeploying a new container image each time code edits are made, Azure Dev Spaces incrementally recompiles code within the existing container to provide a faster edit/debug loop.

## Setting and using breakpoints for debugging

If Visual Studio is still connected to your dev space, click the stop button. Open `Controllers/HomeController.cs` and click somewhere on line 20 to put your cursor there. To set a breakpoint hit *F9* or click *Debug* then *Toggle Breakpoint*. To start your service in debugging mode in your dev space, hit *F5* or click *Debug* then *Start Debugging*.

Open your service in a browser and notice no message is displayed. Return to Visual Studio and observe line 20 is highlighted. The breakpoint you set has paused the service at line 20. To resume the service, hit *F5* or click *Debug* then *Continue*. Return to your browser and notice the message is now displayed.

While running your service in Kubernetes with a debugger attached, you have full access to debug information such as the call stack, local variables, and exception information.

Remove the breakpoint by putting your cursor on line 20 in `Controllers/HomeController.cs` and hitting *F9*.

## Clean up your Azure resources

Navigate to your resource group in the Azure portal and click *Delete resource group*. Alternatively, you can use the [az aks delete](/cli/azure/aks#az-aks-delete) command:

```azurecli
az group delete --name MyResourceGroup --yes --no-wait
```

## Next steps

> [!div class="nextstepaction"]
> [Working with multiple containers and team development](multi-service-netcore-visualstudio.md)

[ingress-update]: how-dev-spaces-works-up.md#how-running-your-code-is-configured
[supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
