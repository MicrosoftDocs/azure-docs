---
title: 'Deploy to Azure Container Apps using Visual Studio Code'
description: Deploy containerized .NET applications to Azure Container Apps using Visual Studio Code
services: container-apps
author: alexwolfmsft
ms.author: alexwolf
ms.service: container-apps
ms.topic: tutorial
ms.date: 4/05/2022
ms.custom: mode-ui
---

# Tutorial: Deploy to Azure Container Apps using Visual Studio Code

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this tutorial, you'll deploy a containerized application to Azure Container Apps using Visual Studio Code.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Visual Studio Code, available as a [free download](https://code.visualstudio.com/).
- The following Visual Studio Code extensions installed:
    - The [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)
    - The [Azure Container Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps)
    - The [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) 

## Clone the project

To follow along with this tutorial, [Download the Sample Project](https://github.com/azure-samples/containerapps-albumapi-javascript/archive/refs/heads/master.zip) from [the repository](https://github.com/azure-samples/containerapps-albumapi-javascript) or clone it using the Git command below:

```bash
git clone https://github.com/Azure-Samples/containerapps-albumapi-javascript.git
cd containerapps-albumapi-javascript
```

This tutorial uses a JavaScript project, but the steps are language agnostic. To open the project after cloning on Windows, navigate to the project's folder, and right click and choose **Open in VS Code**. For Mac or Linux, you can also use the Visual Studio Code user interface to open the sample project. Select **File -> Open Folder** and then navigate to the folder of the cloned project.

## Sign in to Azure

To work with Container Apps and complete this tutorial, you'll need to be signed into Azure.  Once you have the Azure Account extension installed, you can sign in using the command palette by typing **Ctrl + shift + p** on Windows and searching for the Azure Sign In command.

:::image type="content" source="media/visual-studio-code/visual-studio-code-sign-in.png"  alt-text="A screenshot showing how to sign in to Azure.":::

Select **Azure: Sign in**, and Visual Studio Code will launch a browser for you to sign into Azure. Login with the account you'd like to use to work with Container Apps, and then switch back to Visual Studio Code.

## Create the container registry and Docker image

The sample project includes a Dockerfile that is used to build a container image for the application. Docker images contain all of the source code and dependencies necessary to run an application. You can build and publish the image for your app directly in Azure; a local Docker installation is not required. An image is required to create and run a container app.

Container images are stored inside of container registries. You can easily create a container registry and upload an image of your app to it in a single workflow using Visual Studio Code.

1) First, right click on the Dockerfile in the explorer, and select **Build Image in Azure**. You can also begin this workflow from the command palette by entering **Ctrl + Shift + P** on Windows or **Cmd + Shift + P** on a Mac. When the command palette opens, search for *Build Image in Azure* and select **Enter** on the matching suggestion.

     :::image type="content" source="media/visual-studio-code/visual-studio-code-build-in-azure-small.png" lightbox="media/visual-studio-code/visual-studio-code-build-in-azure.png" alt-text="A screenshot showing how to build the image in Azure.":::

2) As the command palette opens, you are prompted to enter a tag for the container. Accept the default, which uses the project name with the `{{.Run.ID}}` replacement token as a suffix. Select **Enter** to continue.

     :::image type="content" source="media/visual-studio-code/visual-studio-code-container-tag.png" alt-text="A screenshot showing Container Apps tagging.":::

3) Choose the subscription you would like to use to create your container registry and build your image, and then press enter to continue.

4) Select **+ Create new registry**, or if you already have a registry you'd like to use, select that item and skip to step 7.  

5) Enter a unique name for the new registry such as *msdocscapps123*, where 123 are unique numbers of your own choosing, and then press enter. Container registry names must be globally unique across all over Azure. 

6) Select **Basic** as the SKU.

7) Choose **+ Create new resource group**, or select an existing resource group you'd like to use. For a new resource group, enter a name such as `msdocscontainerapps`, and press enter.

8) Finally, select the location that is nearest to you. Select **Enter** to finalize the workflow, and Azure begins creating the container registry and building the image.  This may take a few moments to complete.

Once the registry is created and the image is built successfully, you are ready to create the container app to host the published image.

## Create and deploy to the container app

The Azure Container Apps extension for Visual Studio Code enables you to choose existing Container Apps resources, or create new ones to deploy your applications to. In this scenario you create a new Container App environment and container app to host your application. After installing the Container Apps extension, you can access its features under the Azure control panel in Visual Studio Code. 

### Create the Container Apps environment 

Every container app must be part of a Container Apps environment. An environment provides an isolated network for one or more container apps, making it possible for them to easily invoke each other.  You will need to create an environment before you can create the container app itself.

1) In the Container Apps extension panel, right click on the subscription you would like to use and select **Create Container App Environment**. 

     :::image type="content" source="media/visual-studio-code/visual-studio-code-create-app-environment.png" alt-text="A screenshot showing how to create a Container Apps environment.":::

2) A command palette workflow will open at the top of the screen. Enter a name for the new Container Apps environment, such as `msdocsappenvironment`, and select **Enter**.

     :::image type="content" source="media/visual-studio-code/visual-studio-code-container-app-environment.png" alt-text="A screenshot showing the container app environment.":::

3) Select the desired location for the container app from the list of options.

     :::image type="content" source="media/visual-studio-code/visual-studio-code-container-env-location.png" alt-text="A screenshot showing the app environment location.":::

Visual Studio Code and Azure will create the environment for you.  This process may take a few moments to complete. Creating a container app environment also creates a log analytics workspace for you in Azure.

### Create the container app and deploy the Docker image

Now that you have a container app environment in Azure you can create a container app inside of it. You can also publish the Docker image you created earlier as part of this workflow.

1) In the Container Apps extension panel, right click on the container environment you created previously and select **Create Container App**

     :::image type="content" source="media/visual-studio-code/visual-studio-code-create-container-app.png" alt-text="A screenshot showing how to create the container app.":::

2) A new command palette workflow will open at the top of the screen. Enter a name for the new container app, such as `msdocscontainerapp`, and then select **Enter**.

     :::image type="content" source="media/visual-studio-code/visual-studio-code-container-name.png" alt-text="A screenshot showing the container app name.":::

3) Next, you're prompted to choose a container registry hosting solution to pull a Docker image from.  For this scenario, select **Azure Container Registries**, though Docker Hub is also supported.

4) Select the container registry you created previously when publishing the Docker image.

5) Select the container registry repository you published the Docker image to. Repositories allow you to store and organize your containers in logical groupings.

6) Select the tag of the image you published earlier.

7) When prompted for environment variables, choose **Skip for now**. This application does not require any environment variables.

8) Select **Enable** on the ingress settings prompt to enable an HTTP endpoint for your application.

9) Choose **External** to configure the HTTP traffic that the endpoint will accept.

10) Enter a value of 3500 for the port, and then select **Enter** to complete the workflow. This value should be set to the port number that your container uses, which in the case of the sample app is 3500.

During this process, Visual Studio Code and Azure create the container app for you.  The published Docker image you created earlier is also be deployed to the app.  Once this process finishes, Visual Studio Code displays a notification with a link to browse to the site.  Click this link, and to view your app in the browser. 

:::image type="content" source="media/visual-studio-code/visual-studio-code-app-deploy.png" alt-text="A screenshot showing the deployed app.":::

You can also append the `/albums` path at the end of the app URL to view data from a sample API request. 

Congratulations! You successfully created and deployed your first container app using Visual Studio code.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services at once by removing the resource group.

Follow these steps in the Azure portal to remove the resources you created:

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
