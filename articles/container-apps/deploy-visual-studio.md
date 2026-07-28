---
title: 'Deploy to Azure Container Apps using Visual Studio'
description: Learn how to deploy your containerized .NET applications to Azure Container Apps using Visual Studio.
services: container-apps
author: alexwolfmsft
ms.author: alexwolf
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 06/15/2026
ms.custom: mode-ui, devx-track-dotnet
#customer intent: As an application developer, I need to understand how to deploy my containerized apps using my Visual Studio environment.
---

# Tutorial: Deploy to Azure Container Apps using Visual Studio

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this tutorial, you deploy a containerized ASP.NET Core 10.0 application to Azure Container Apps using Visual Studio. The steps here also apply to earlier versions of ASP.NET Core.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Visual Studio 2026 or Visual Studio 2022 version 17.2 or later, available as a [free download](https://visualstudio.microsoft.com).

## Create the project

Create the containerized ASP.NET Core application.

1. In Visual Studio, select **File** and then choose **New** > **Project/Solution**.

1. In the dialog, search for *ASP.NET*, and then choose **ASP.NET Core Web App** and select **Next**.

1. In the **Project Name** field, name the application *MyContainerApp* and then select **Next**.

1. On the **Additional Information** screen, select **Enable container support**. Make sure **Linux** is selected for the **Container OS** setting.

   :::image type="content" source="media/visual-studio/container-apps-enable-docker.png" alt-text="A screenshot showing the option to select to enable docker.":::

   For this tutorial, use Linux containers. This selection ensures the project template supports containerization by default. While enabled, the project uses a container when it runs or builds.

1. For **Container build type**, select **Dockerfile**.

1. Select **Create** and Visual Studio creates and loads the project.

## Deploy to Azure Container Apps

The application includes a Dockerfile because the project template had the *Enable Docker* setting selected. Visual Studio uses the Dockerfile to build the container image that runs in Azure Container Apps.

To learn more about the specifics of this process, see [Customize containers in Visual Studio](/visualstudio/containers/container-build).

You're now ready to deploy to the application to Azure Containers Apps.

### Create the resources

The **Publish** windows in Visual Studio help you choose existing Azure resources, or allow you to create new ones for deployment. This process also builds the container image, pushes the image to Azure Container Registry, and deploys the new container app image.

1. Right-click the **MyContainerApp** project node and select **Publish**.

1. In the dialog, choose **Azure** from the list of publishing options, and then select **Next**.

   :::image type="content" source="media/visual-studio/container-apps-deploy-azure.png" alt-text="A screenshot showing to publish to Azure.":::

1. On the **Specific target** screen, choose **Azure Container Apps (Linux)**, and then select **Next**.

   :::image type="content" source="media/visual-studio/container-apps-publish-azure.png" alt-text="A screenshot showing Container Apps selected.":::

1. Create an Azure Container App to host the project. Select **Create new** next to the green **+** icon. In the **Create new** dialog, enter the following values:

   - **Container App name**: Enter a name of `msdocscontainerapp`.
   - **Subscription name**: Choose the subscription to host your app.
   - **Resource group**: A resource group acts as a logical container to organize related resources in Azure. You can select an existing resource group, or select **New** to create one with a name you select, such as `msdocscontainerapps`.
   - **Container Apps Environment**: Every container app must be part of a container app environment. An environment provides an isolated network for one or more container apps, making it possible for them to easily invoke each other. Select **New** to open the dialog for your container app environment. Leave the default values and select **OK** to close the environment dialog.
   - **Container Name**: This value is the friendly name of the container that runs for this container app. Use the name `msdocscontainer1` for this quickstart. A container app typically runs a single container, but there are times when having more than one container is needed. One such example is when a sidecar container is required to perform an activity such as specialized logging or communications.

     :::image type="content" source="media/visual-studio/container-apps-create-new.png" alt-text="A screenshot showing how to create new Container Apps.":::

1. Select **Create** to finalize the creation of your container app. Visual Studio and Azure create the needed resources on your behalf. This process might take a couple minutes. Let it run before you continue.

1. After the resources are created, choose **Next**.

    :::image type="content" source="media/visual-studio/container-apps-select-resource.png" alt-text="A screenshot showing how to select the created resource.":::

1. On the **Registry** screen, you can either select an existing Registry if you have one, or create a new one. To create a new one, select **Create new** next to the green **+** icon. On the **Create new** screen, fill in the following values:

    - **DNS prefix**: Enter a value of `msdocscontainerregistry` or a name of your choosing.
    - **Subscription Name**: Select the subscription you want to use. You might only have one to choose from.
    - **Resource Group**: Choose the msdocs resource group you created previously.
    - **Sku**: Select **Standard**.
    - **Registry Location**: Select a region that is geographically close to you.

    :::image type="content" source="media/visual-studio/container-apps-registry.png" alt-text="A screenshot showing how to create the container registry.":::

1. After you populate these values, select **Create**. Visual Studio and Azure take a moment to create the registry.

1. After the container registry is created, make sure it's selected, and then choose **Finish**. Visual Studio takes a moment to create the publish profile. This publish profile is where Visual Studio stores the publish options and resources you chose so you can quickly publish again whenever you want. You can close the dialog after it finishes.

   :::image type="content" source="media/visual-studio/container-apps-choose-registry.png" alt-text="A screenshot showing how to select the created registry.":::

### Publish the app using Visual Studio

While the resources and publishing profile are created, you still need to publish and deploy the app to Azure.

Choose **Publish** in the upper right of the publishing profile screen to deploy to the container app you created in Azure. This process might take a moment, so wait for it to complete.

:::image type="content" source="media/visual-studio/container-apps-publish.png" alt-text="A screenshot showing how to publish the app.":::

When the app finishes deploying, Visual Studio opens a browser to the URL of your deployed site. This page might initially display an error if all of the proper resources aren't provisioned. Refresh the browser periodically to check if the deployment fully completes.

:::image type="content" source="media/visual-studio/container-apps-site.png" alt-text="A screenshot showing the published site.":::

### Publish the app using GitHub Actions

You can also deploy Container Apps using CI/CD through [GitHub Actions](https://docs.github.com/en/actions). GitHub Actions is a powerful tool for automating, customizing, and executing development workflows directly through the GitHub repository of your project.

If Visual Studio detects the project you're publishing is hosted in GitHub, the publish flow presents another **Deployment type** step. This stage allows developers to choose whether to publish directly through Visual Studio using the steps shown earlier in the quickstart, or through a GitHub Actions workflow.

:::image type="content" source="media/visual-studio/container-apps-deployment-type.png" alt-text="A screenshot showing the deployment type.":::

If you select the GitHub Actions workflow, Visual Studio creates a *.github* folder to the root directory of the project, including a generated YAML file. The YAML file contains GitHub Actions configurations to build and deploy your app to Azure every time you push your code.

After you make a change and push your code, you can see the progress of the build and deploy process in GitHub under the **Actions** tab. This page provides detailed logs and indicators regarding the progress and health of the workflow.

:::image type="content" source="media/visual-studio/container-apps-github-actions.png" alt-text="A screenshot showing GitHub actions.":::

The workflow is complete when you see a green checkmark next to the build and deploy jobs. When you browse to your Container Apps site, you should see the latest changes applied. You can always find the URL for your container app using the Azure portal page.

## Clean up resources

If you don't plan to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

To remove the resources you created, follow these steps in the Azure portal:

1. Select the **msdocscontainerapps** resource group from the **Overview** section.
1. Select the **Delete resource group** button at the top of the resource group **Overview**.
1. Enter the resource group name **msdocscontainerapps** to confirm deletion.
1. Select **Delete**.

   The process to delete the resource group might take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next step

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
