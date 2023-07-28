---
title: 'Tutorial: Share anchors across sessions and devices'
description: In this tutorial, you learn how to share Azure Spatial Anchor identifiers between Android/iOS devices in Unity with a back-end service.
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors
ms.author: pamistel
ms.date: 11/20/2020
ms.topic: tutorial
ms.service: azure-spatial-anchors
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Tutorial: Share spatial anchors across sessions and devices

Azure Spatial Anchors is a cross-platform developer service with which you can create mixed-reality experiences by using objects that persist their location across devices over time. 

In this tutorial, you use [Azure Spatial Anchors](../overview.md) to create anchors during one session and then locate them on the same device or a different one. The same anchors can also be located by multiple devices in the same place and at the same time.

![Animation showing spatial anchors that are created with a mobile device and used with a different device over the course of days.](./media/persistence.gif)


In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core web app in Azure that you can use to share anchors, and store the anchors in memory for a specified period of time.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene within the Unity sample from our quickstarts to take advantage of the Sharing Anchors web app.
> * Deploy and run the anchors to one or more devices.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

> [!NOTE]
> You'll be using Unity and an ASP.NET Core web app in this tutorial, but the approach here is only to provide an example of how to share Azure Spatial Anchors identifiers across other devices. You can use other languages and back-end technologies to achieve the same goal.

## Create a Spatial Anchors resource

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download the sample project + import SDK

### Clone Samples Repo

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

### Import ASA SDK

Follow the instructions [here](../how-tos/setup-unity-project.md#download-asa-packages) to download and import the ASA SDK packages required for the HoloLens platform.

## Deploy the Sharing Anchors service
> [!NOTE]
> In this tutorial we will be using the free tier of the Azure App Service. The free tier will time out after [20 min](/azure/architecture/framework/services/compute/azure-app-service/reliability#configuration-recommendations) of inactivity and reset the memory cache.

## [Visual Studio](#tab/VS)

Open Visual Studio, and then open the project in the *Sharing\SharingServiceSample* folder.

[!INCLUDE [Publish Azure](../../../includes/spatial-anchors-publish-azure.md)]

## [Visual Studio Code](#tab/VSC)

You need to create a resource group and an App Service plan before you deploy the service in Visual Studio Code.

### Sign in to Azure

Go to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>, and then sign in to your Azure subscription.

### Create a resource group

[!INCLUDE [resource group intro text](../../../includes/resource-group.md)]

Next to **Resource Group**, select **New**.

Name the resource group **myResourceGroup**, and then select **OK**.

### Create an App Service plan

[!INCLUDE [app-service-plan](../../../includes/app-service-plan.md)]

Next to **Hosting Plan**, select **New**.

On the **Configure Hosting Plan** pane, use these settings:

| Setting | Suggested value | Description |
|-|-|-|
|App Service plan| MySharingServicePlan | Name of the App Service plan |
| Location | West US | The datacenter where the web app is hosted |
| Size | Free | The [pricing tier](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) that determines hosting features |

Select **OK**.

Open Visual Studio Code, and then open the project in the *Sharing\SharingServiceSample* folder. 

To deploy the sharing service through Visual Studio Code, follow the instructions in <a href="/aspnet/core/tutorials/publish-to-azure-webapp-using-vscode?view=aspnetcore-2.2&preserve-view=true#open-it-with-visual-studio-code" target="_blank">Publish an ASP.NET Core app to Azure with Visual Studio Code</a>. Start at the "Open it with Visual Studio Code" section. Do not create another ASP.NET project as explained in the preceding step, because you already have a project to be deployed and published: SharingServiceSample.

---

## Configure + deploy the sample app

[!INCLUDE [Run Share Anchors Sample](../../../includes/spatial-anchors-run-share-sample.md)]

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you deployed an ASP.NET Core web app in Azure, and you configured and deployed a Unity app. You created spatial anchors with the app, and you shared them with other devices by using your ASP.NET Core web app.

You can improve your ASP.NET Core web app so that it uses Azure Cosmos DB to persist the storage of your shared spatial anchors identifiers. By adding Azure Cosmos DB support, you can have your ASP.NET Core web app create an anchor today. Then, by using the anchor identifier that's stored in your web app, you can have the app return days later to locate the anchor again.

> [!div class="nextstepaction"]
> [Use Azure Cosmos DB to store anchors](./tutorial-use-cosmos-db-to-store-anchors.md)
