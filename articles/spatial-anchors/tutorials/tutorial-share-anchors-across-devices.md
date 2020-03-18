---
title: 'Tutorial: Share anchors across sessions and devices'
description: In this tutorial, you learn how to share Azure Spatial Anchor identifiers between Android/iOS devices in Unity with a back-end service.
author: ramonarguelles
manager: vriveras
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 02/24/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Share Azure Spatial Anchors across sessions and devices

In this tutorial, you'll learn how to use [Azure Spatial Anchors](../overview.md) to create anchors during one session and then locate them, on the same device or on a different one. These same anchors could also be located by multiple devices in the same place and at the same time.

![Persistence](./media/persistence.gif)

Azure Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences using objects that persist their location across devices over time. When you're finished, you'll have an app that can be deployed to two or more devices. Azure Spatial Anchors created by one instance can be shared to the others.

You'll learn how to:

> [!div class="checklist"]
> * Deploy an ASP.NET Core Web App in Azure that can be used to share anchors, storing them in memory for a duration of time.
> * Configure the AzureSpatialAnchorsLocalSharedDemo scene within the Unity Sample from our Quickstarts to take advantage of the Sharing Anchors Web App.
> * Deploy and run to one or more devices.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-share-sample-prereqs.md)]

It's worth noticing that, although you'll be using Unity and an ASP.NET Core Web App in this Tutorial, it is only to show an example on how to share Azure Spatial Anchor identifiers across other devices. You can use other languages and back-end technologies to achieve the same goal. Also, the ASP.NET Core Web App used in this Tutorial has a dependency on .NET Core 2.2 SDK. It runs fine on regular Azure Web Apps (for Windows), but will currently not work on Azure Web Apps for Linux.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

## Deploy your Sharing Anchors Service

## [Visual Studio](#tab/VS)

Open Visual Studio, and open the project at the `Sharing\SharingServiceSample` folder.

[!INCLUDE [Publish Azure](../../../includes/spatial-anchors-publish-azure.md)]

## [Visual Studio Code](#tab/VSC)

You will need to create a resource group and an App Service Plan before you deploy the service in VS Code.

### Sign-in to Azure

Navigate to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a> and sign-in to your Azure subscription.

### Create a resource group

[!INCLUDE [resource group intro text](../../../includes/resource-group.md)]

Next to **Resource Group**, select **New**.

Name the resource group **myResourceGroup** and select **OK**.

### Create an App Service plan

[!INCLUDE [app-service-plan](../../../includes/app-service-plan.md)]

Next to **Hosting Plan**, select **New**.

In the **Configure Hosting Plan** dialog box, use these settings:

| Setting | Suggested value | Description |
|-|-|-|
|App Service Plan| MySharingServicePlan | Name of the App Service plan. |
| Location | West US | The datacenter where the web app is hosted. |
| Size | Free | The [pricing tier](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) that determines hosting features. |

Select **OK**.

Open Visual Studio Code, and open the project at the `Sharing\SharingServiceSample` folder. Follow <a href="https://docs.microsoft.com/aspnet/core/tutorials/publish-to-azure-webapp-using-vscode?view=aspnetcore-2.2#open-it-with-visual-studio-code" target="_blank">this tutorial</a> to deploy the sharing service through Visual Studio Code. You can follow the steps starting from the 'Open it with Visual Studio Code' section. Do not create another mvc project as explained in the step above as you already have the project that needs to be deployed and published- the SharingServiceSample.

---

## Deploy the sample app

[!INCLUDE [Run Share Anchors Sample](../../../includes/spatial-anchors-run-share-sample.md)]

## Troubleshooting

### Unity 2019.3

Due to breaking changes, Unity 2019.3 is not currently supported. Please use Unity 2019.1 or 2019.2.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you've deployed an ASP.NET Core Web App in Azure, and then configured and deployed a Unity App. You created Spatial Anchors with the app, and shared them with other devices by using your ASP.NET Core Web App.

You can improve your ASP.NET Core Web App so that it uses Azure Cosmos DB to persist the storage of your shared Spatial Anchor identifiers. Adding Azure Cosmos DB support will allow your ASP.NET Core Web App to create an anchor today, and come back days later to be able to locate it again, by using the anchor identifier stored in your web app.

> [!div class="nextstepaction"]
> [Use Azure Cosmo DB to Store Anchors](./tutorial-use-cosmos-db-to-store-anchors.md)

