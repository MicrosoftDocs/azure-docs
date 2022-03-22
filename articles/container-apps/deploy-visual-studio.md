---
title: 'Deploy to Azure Container Apps using Visual Studio'
description: Deploy your containerized .NET applications to Azure Container Apps using Visual Studio
services: container-apps
author: alexwolfmsft
ms.author: alexwolf
ms.service: container-apps
ms.topic: tutorial
ms.date: 3/04/2022
ms.custom: mode-ui
---

# Tutorial: Deploy to Azure Container Apps using Visual Studio

Azure Container Apps Preview enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this tutorial, you'll deploy a containerized ASP.NET Core 6.0 application to Azure Container Apps using Visual Studio.  The steps below also apply to earlier versions of ASP.NET Core, as well as other web technologies.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- You will also need Visual Studio 2022, which you can [download for free](https://visualstudio.com).  
- Finally, you'll need to [install Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows) for Windows. Visual Studio utilizes Docker Desktop for various containerization features.

## Create the Project

Let's begin by creating the containerized ASP.NET Core application that we'll deploy to Azure.

Inside Visual Studio, select **File** and then choose **New => Project**.

In the dialog window, search for *ASP.NET*, and then choose **ASP.NET Core Web App** and select **Next**.

In the Project Name field, name the application *MyContainerApp* and then select **Next**.

On the **Additional Information** screen, make sure to select **Enable Docker**.  This will ensure our project template supports containerization by default. With this setting enabled, when we build and run our project, it will run using a container. 

    Click **Create** and Visual Studio will create and load the project.

:::image type="content" source="media/visual-studio/container-apps-enable-docker.png" alt-text="A screenshot showing to enable docker.":::


### Docker Installation

If this is your first time creating a project using Docker, you may get a prompt instructing you to install Docker Desktop.  This installation is required for working with containerized apps, as mentioned in the prerequisites, so click yes.  You can also  download and [install Docker Desktop for Windows from the official Docker site](https://hub.docker.com/editions/community/docker-ce-desktop-windows).

Visual Studio will launch the Docker Desktop for Windows page.  You can follow the installation instructions on this page to setup Docker, which will require a system reboot.

## Deploy to Azure Container Apps

The application we created includes a Dockerfile because we checked the **Enable Docker** setting for the project template.  Visual Studio uses the Dockerfile to build the image for our app that will be run by Azure Container Apps.

You can [read more about how Visual Studio builds containerized apps](https://aka.ms/containerfastmode) if you'd like to learn more about the specifics of this process.

Your are now ready to deploy to Azure Containers apps.

### Create the resources

Visual Studio can create all of the necessary Azure Resources to deploy and run Azure Container Apps for us through the publishing workflow. 

Begin by right clicking on the **MyContainerApp** project node and selecting **Publish**.

In the dialog, choose **Azure** from the list of publishing options, and then select **Next**.

:::image type="content" source="media/visual-studio/container-apps-deploy-azure.png" alt-text="A screenshot showing to publish to Azure.":::

On the **Specific target** screen, choose **Azure Container Apps Preview (Linux)**, and then select **Next** again.

:::image type="content" source="media/visual-studio/container-apps-publish-azure.png" alt-text="A screenshot showing to publish to Azure.":::

We need to create an Azure Container App to host our project.  Select the the green plus icon on the right to open the create dialog. In the **Create new** dialog, enter the following values:

- **Container App name**: Enter a name of `msdocscontainerapp`.
- **Subscription name**: Choose the subscription where you would like to host your app.
- **Resource group**: A Resource group acts as a logical container to organize related resources in Azure.  You can either select an existing Resource Group, or select **New** to create one with a name of your choosing, such as `msdocscontainerapps`.
- **Container Apps Environment**:  Every Container App requires a Container App Environment. Environments help to orchestrate Container Apps and allow multiple apps to be hosted alongside one another. Click **New** to open the **Create new** dialog for your Container App environment. Enter the following values:
    - **Environment name**: Leave the default name.  
    - **Location**: Choose a location that's close to you.
    - **Azure Log Analytics workspace**: Every Container app also requires an Azure Log Analytics workspace to be able to view logs. Select **New** to open the **Create new** Azure Log Analytics Workspace dialog.  Enter a name of `msdocscontainerappworkspace` or something similar, and then choose a **Location** that is close to you.  Select **OK** to close the Azure Log Analytics workspace dialog.
- Select **OK** to close the **Crew new** environment dialog.
- **Container Name**: Enter a value of **msdocscontainer1**. We are able to run multiple containers in a single app, but for now we only have one.

:::image type="content" source="media/visual-studio/container-apps-create-new.png" alt-text="A screenshot showing how to create new Container Apps.":::

Select **Create** to finalize the creation or your Container App. Visual Studio and Azure will create the resources you requested.  This process may take a couple minutes, so allow it to run to completion before moving on.

Once the resources are created, choose **Next**.

On the **Container Name** dialog, ensure the Container name you created is selected, and then choose **Next** again.

:::image type="content" source="media/visual-studio/container-apps-container-name.png" alt-text="A screenshot showing how to select the right container.":::

On the **Registry** screen, you can either select an existing Registry if you have one, or create a new one.  To create a new one, click the green **+** icon on the right. On the **Create new** registry screen, fill in the following values:

- **DNS prefix**: Enter a value of `msdocscontainerregistry` or a name of your choosing.
- **Subscription Name**: Select the subscription you want to use - you may only have one to choose from.
- **Resource Group**: Choose the msdocs resource group you created previously.
- **Sku**: Select **Standard**.
- **Registry Location**: Select a region that is geographically close to you.

:::image type="content" source="media/visual-studio/container-apps-registry.png" alt-text="A screenshot showing how to select the container registry.":::

After you have populated these values, select **Create**. Visual Studio and Azure will take a moment to create the registry.

Once the Container registry is created, make sure it is selected, and then choose **Finish**.  Visual Studio will take a moment to create the publish profile.  You can close the dialog once it finishes.

:::image type="content" source="media/visual-studio/container-apps-choose-registry.png" alt-text="A screenshot showing how to select the container registry.":::

### Publish the app

Although our resources and publishing profile were created, we still need to actually publish and deploy our app to Azure. 

Choose **Publish** in the upper right of the publishing profile screen to deploy to the Container App you created in Azure.  This process may take a moment, so wait for it to complete.

:::image type="content" source="media/visual-studio/container-apps-publish.png" alt-text="A screenshot showing how to select the container registry.":::

When the app finishes deploying, Visual Studio will open a browser to the the URL of your deployed site. This page may initially display an error if all of the proper resources have not finished provisioning.  You can continue to refresh the browser periodically to check if the deployment has fully completed.


:::image type="content" source="media/visual-studio/container-apps-site.png" alt-text="A screenshot showing the published site.":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

1. Select the **msdocscontainerapps** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **msdocscontainerapps** in the *Are you sure you want to delete "my-container-apps"* confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group may take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
