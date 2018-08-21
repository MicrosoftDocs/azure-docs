---
title: Tutorial- Deploy a Service Fabric Mesh application to Service Fabric Mesh | Microsoft Docs
description: Learn how to publish an Azure Service Fabric Mesh application consisting of an ASP.NET Core website that communicates with a back-end web service.
services: service-fabric-mesh
documentationcenter: .net
author: TylerMSFT
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/26/2018
ms.author: twhitney
ms.custom: mvc, devcenter 
#Customer intent: As a developer, I want learn how to publish a Service Fabric Mesh app to Azure.
---

# Tutorial: Deploy a Service Fabric Mesh web application

This tutorial is part three of a series and shows you how to publish an Azure Service Fabric Mesh web application directly from Visual Studio.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Publish the app to Azure.
> * Check application deployment status
> * See all applications currently deployed to your subscription
> * See the application logs
> * Clean up the resources used by the app.

In this tutorial series, you learn how to:
> [!div class="checklist"]
> * [Build a Service Fabric Mesh web application](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * [Debug the app locally](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)
> * Publish the app to Azure

You'll learn how to create an Azure Service Fabric Mesh app that has an ASP.NET web front end and an ASP.NET Core Web API back-end service. Then you'll debug the app on your local development cluster and publish the app to Azure. When you're finished, you'll have a simple to-do app that demonstrates how to make a service-to-service call in a Service Fabric Mesh web application.

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Make sure that you've [set up your development environment](service-fabric-mesh-howto-setup-developer-environment-sdk.md) which includes installing the Service Fabric runtime, SDK, Docker, and Visual Studio 2017.

## Download the to-do sample application

If you did not build the to-do sample application in [part two of this tutorial series](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/azure-samples/service-fabric-mesh
```

The application is under the `src\todolistapp` directory.

## Publish to Azure

To publish your Service Fabric Mesh project to Azure, right-click on **ServiceFabricMeshApp** in Visual Studio and select **Publish...**

Next, you'll see a **Publish Service Fabric Application** dialog.

![Visual studio Service Fabric Mesh publish dialog](./media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-dialog.png)

Select your Azure account and subscription. Choose a **Location**. This article uses **East US**.

Under **Resource group**, select **\<Create New Resource Group...>**. A dialog appears where you will create a new resource group. This article uses the **East US** location and names the group **sfmeshTutorial1RG** (if your organization has multiple people using the same subscription, choose a unique group name).  Press **Create** to create the resource group and return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](./media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-resource-group-dialog.png)

Back in the **Publish Service Fabric Application** dialog, under **Azure Container Registry**, select **\<Create New Container Registry...>**. In the **Create Container Registry** dialog, use a unique name for the **Container registry name**. Specify a **Location** (this tutorial uses **East US**). Select the **Resource group** that you created in the previous step in the drop-down, for example, **sfmeshTutorial1RG**. Set the **SKU** to **Basic** and then press **Create** to return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](./media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-container-registry-dialog.png)

If you get an error that a resource provider has not been registered for your subscription, you can register it. First see if the resource provider is available for your subscription:

```Powershell
Get-AzureRmResourceProvider -ListAvailable
```

If the container registry provider (`Microsoft.ContainerRegistry`) is available, register it from Powershell:

```Powershell
Connect-AzureRmAccount
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ContainerRegistry
```

In the publish dialog, press the **Publish** button to deploy your Service Fabric application to Azure.

When you publish to Azure for the first time, the docker image is pushed to the Azure Container Registry (ACR) which takes time depending on the size of the image. Subsequent publishes of the same project will be faster. You can monitor the progress of the deployment by selecting the **Service Fabric Tools** pane in the Visual Studio **Output** window. Once the deployment has finished, the **Service Fabric Tools** output will display the IP address and port of your application in the form of a URL.

```json
Packaging Application...
Building Images...
Web1 -> C:\Code\ServiceFabricMeshApp\ToDoService\bin\Any CPU\Release\netcoreapp2.0\ToDoService.dll
Uploading the images to Azure Container Registy...
Deploying application to remote endpoint...
The application was deployed successfully and it can be accessed at http://10.000.38.000:20000.
```

Open a web browser and navigate to the URL to see the website running in Azure.

## Set up Service Fabric Mesh CLI 
You can use the Azure Cloud Shell or a local installation of the Azure CLI for the remaining steps. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).


## Check application deployment status

At this point, your application has been deployed. You can check to see its status by using the `app show` command. 

The application name for the tutorial app is `ServiceMeshApp`. Gather the details on the application with the following command:

```azurecli-interactive
az mesh app show --resource-group $rg --name ServiceMeshApp
```

## See all applications currently deployed to your subscription

You can use the "app list" command to get a list of applications you have deployed to your subscription.

```cli
az mesh app list --output table
```

## See the application logs

Examine the logs for the deployed application:

```azurecli-interactive
az mesh code-package-log get --resource-group $rg --application-name ServiceMeshApp --service-name todoservice --replica-name 0 --code-package-name ServiceMeshApp
```

## Clean up resources

When no longer needed, delete all of the resources you created. Since you created a new resource group to host both the ACR and Service Fabric Mesh service resources, you can safely delete this resource group, which will delete all of the associated resources.

```azurecli
az group delete --resource-group sfmeshTutorial1RG
```

```powershell
Remove-AzureRmResourceGroup -Name sfmeshTutorial1RG
```

Alternatively, you can delete the resource group [from the portal](../azure-resource-manager/resource-group-portal.md#delete-resource-group-or-resources). 

## Next steps

In this part of the tutorial, you learned:
> [!div class="checklist"]
> * Publish the app to Azure.
> * Check application deployment status
> * See all the application you have currently deployed to your subscription
> * See the application logs
> * Clean up the resources used by the app.

Now that you have completed publishing a Service Fabric Mesh application to Azure, try the following:

* Explore the [Voting app sample](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/votingapp) to see another example of service-to-service communication.
* Read [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)
* Read about the [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview)

[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest