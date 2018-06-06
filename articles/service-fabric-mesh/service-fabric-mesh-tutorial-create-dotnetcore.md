---
title: Test and deploy a .NET Core app for Azure Service Fabric Mesh
description: In this tutorial you create an ASP.NET Core website and deploy it to the local Service Fabric test cluster. After that, you will deploy to Azure.
services: service-fabric-mesh
documentationcenter: .net
author: TylerMSFT
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/5/2018
ms.author: twhitney
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want to use visual studio to locally run a .net core application on Service Fabric Mesh so that I can see it run and then I will deploy it to Azure.
---

# Tutorial: Create an ASP.NET Core website for Service Fabric Mesh

In this tutorial you will create a new Service Fabric Mesh application which is made up of an ASP.NET Core website, and run it locally in the Service Fabric cluster. After that, you will publish the project to Azure.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Create a new Service Fabric Mesh project.
> * Debug the service locally.
> * Publish the service to Azure.

If you don’t have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you get started, make sure that you've [set up your development environment](service-fabric-mesh-setup-developer-environment-sdk.md). This process includes installing the Service Fabric runtime, SDK, Docker, and Visual Studio 2017. 

## Create a Service Fabric Mesh project

Open Run Visual Studio and select **File** > **New** > **Project...**

In the **New Project** dialog, type **mesh** into the **Search** box at the top. Select the **Service Fabric Mesh Application** template.

In the **Name** box, type **ServiceFabricMesh1** and in the **Location** box, set the folder path of where the files for the project will be stored.

Make sure that **Create directory for solution** is checked, and press **OK** to create the Service Fabric Mesh project.

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-project.png)

### Create a service

After you create a Service Fabric Application project, a new dialog is displayed, **New Service Fabric Service**. Select the **ASP.NET Core** project type, make sure **Container OS** is set to **Windows**.

You must set the **Service Name** to something unique. Why? Because the name of the service is used as the repository name of the Docker image. If you have an existing Docker image with the same repository name, it will be overwritten by Visual Studio. Open a terminal and use the Docker command `docker images` to verify your project name is unique.

Press **OK** to create the ASP.NET Core project. 

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-service-fabric-service.png)

A new dialog is displayed, **New ASP.NET Core Web Application** dialog. Select **Web Application** and then press **OK**.

![Visual studio new ASP.NET core application](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-aspnetcore-app.png)

Visual Studio will create both the Service Fabric Application project and the ASP.NET Core project.

## Build and deploy

A Docker image will automatically be built and deployed to your local cluster as soon as your project loads. This process may take some time and you can monitor the progress of the Service Fabric tools in the **Output** pane if you want. Select the **Service Fabric Tools** item in the pane. You are not prevented from running your project.

After the project has been created, press **F5** to compile and run your service locally. Whenever the project is run and debugged locally, Visual Studio will: 

1. Make sure that Docker for Windows is running and set to use Windows as the container operating system.
2. Download any missing Docker base images. This part may take some time
3. Build (or rebuild) the Docker image used to host your code project.
4. Deploys and runs the container on the local Service Fabric development cluster.
6. Run your services and hits any breakpoints you have set.

After the local deployment is finished, and Visual Studio is running your projects, a browser window will open and automatically navigate to the sample webpage.

When you are done browsing the deployed service you can stop debugging your project by pressing **Shift+F5** in Visual Studio.

## Publish to Azure

To publish your Service Fabric Mesh project to Azure, right-click on the **Service Fabric Mesh project** in Visual studio and select **Publish...**

![Visual studio right-click Service Fabric Mesh project](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-right-click-publish.png)

You will see a **Publish Service Fabric Application** dialog.

![Visual studio Service Fabric Mesh publish dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-dialog.png)

Select your Azure account and subscription. Choose a **Location**. This article uses **East US**.

Under **Resource group**, select **\<Create New Resource Group...>**. This will show you a dialog where you will create a new resource group. Choose the **East US** location and name the group **sfmeshTutorial1RG**. Press **Create** to create the resource group and return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-resource-group-dialog.png)

Back in the **Publish Service Fabric Application** dialog, under **Azure Container Registry**, select **\<Create New Container Registry...>**. In the **Create Container Registry** dialog, use a unique name for the **Container registry name**. For **Location**, pick **East US**. Select the **sfmeshTutorial1RG** resource group. Set the **SKU** to **Basic** and then press **Create** to return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-container-registry-dialog.png)

In the publish dialog, press the **Publish** button to deploy your Service Fabric application to Azure.

When you publish to Azure for the first time, it can take up to 10 or more minutes. Subsequent publishes of the same project generally take around five minutes. Obviously, these estimates will vary based on your internet connection speed and other factors. You can monitor the progress of the deployment by selecting the **Service Fabric Tools** pane in the Visual Studio **Output** window. Once the deployment has finished, the **Service Fabric Tools** output will display the IP address and port of your application in the form of a URL.

```json
Packaging Application...
Building Images...
Web1 -> C:\Code\ServiceFabricMesh1\Web1\bin\Any CPU\Release\netcoreapp2.0\Web1.dll
Uploading the images to Azure Container Registy...
Deploying application to remote endpoint...
The application was deployed successfully and it can be accessed at http://10.000.38.000:20000.
```

Open a web browser and navigate to the URL to see the website running in Azure.

## Clean up resources

When no longer needed, delete all of the resources you created. Since you created a new resource group to host both the ACR and Service Fabric Mesh service resources, you can safely delete this resource group.

```azurecli
az group delete --resource-group sfmeshTutorial1RG
```

```powershell
Remove-AzureRmResourceGroup -Name sfmeshTutorial1RG
```

Alternatively, you can delete the resource group [from the portal](../azure-resource-manager/resource-group-portal.md#delete-resource-group-or-resources).

## Next steps

Explore the [samples](https://github.com/Azure/seabreeze-preview-pr/tree/master/samples) for Service Fabric Mesh.