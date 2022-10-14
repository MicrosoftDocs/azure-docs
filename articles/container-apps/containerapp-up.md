---
title: Rapidly deploy Azure Container Apps with the "az containerapp up" command
description: How to rapidly deploy a container app with the "az containerapp up" command
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 10/25/2022
ms.author: v-bcatherine
---

# Rapidly deploy Azure Container Apps with the "az containerapp up" command

The `az containerapp up` command is the fastest way to deploy an Azure Container App from an existing image, local source code or a GitHub repo.  You can have your container app up and running in minutes by running this single command.

The complex process of creating resources, building and pushing an image to a registry, and deploying your container app can be handled by the `az containerapp up` command.  When working from a GitHub repo, the command will also create a GitHub Actions workflow to deploy your app when you push changes to your GitHub repo.

The `az containerapp up` command is an easy, streamlined way to deploy container apps that use the default container app settings.  If you need to customize your container app's resource or scaling configuration, you can use the `az containerapp up` command, and then use the `az containerapp update` command to further customize your container app.  For further customizations such as Dapr configuration, and secrets,  and transport protocols, you can also use the `az containerapp create` command to create a container app from scratch.

With the `az containerapp up` command you can:

- Build or use an existing image.
- Create or use an existing Azure resource group.
- Create or use an existing Azure Container Registry.
- Push the image to the registry.
- Create or use an existing Log Analytics workspace.
- Create or use an existing Container Apps environment.
- Create and deploy a container app.
- Create a GitHub Actions workflow to build and deploy changes to the container app.

If you don't provide the existing Container Apps environment, the command will look for an existing environment in your resource group, and if found will use that.  If not found, an environment and Log Analytics workspace will be created for you.

If you need to customize the features in your Container App environment, you should use the `az containerapp environment create` command to create your environment.

For more information about the `az containerapp up` command, see [az containerapp up](/cli/azure/containerapp#az_containerapp_up).

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | If you're going to use a GitHub repo you.  Sign up for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Docker Desktop | If you're using local source with a Dockerfile, you'll need to install Docker Desktop.  Docker provides installers that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). From your command prompt, type `docker` to ensure Docker is running. |
|local source code | If you're going to use local source code, you need to have a local source code directory. |
| Existing Image | If you're going to use an existing image you'll need your registry server and image name and tag. If you're using a private registry, you'll need your credentials. |

## Set up

1. Log in to Azure with the Azure CLI. 
    
    ```azurecli
    az login
    ```
1. Next, install the Azure Container Apps extension for the CLI.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Now that the current extension or module is installed, register the `Microsoft.App` namespace.

    
    ```azurecli
    az provider register --namespace Microsoft.App
    ```

1. Register the `Microsoft.OperationalInsights` provider for the Azure Monitor Log Analytics workspace if you haven't used it before.

    
    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Deploy from an existing image

You can deploy a container app from an existing image in Azure Container Registry.  The image can be in public or private registry.  

In this example, the `az containerapp up` command will:

1. Create a resource group.
1. Create an environment and Log Analytics workspace.
1. Create and deploy a container app pulling the image from registry.
1. Set ingress to external with a target port to the specified value.

Run the following command to deploy a container app from an existing image.  Replace the \<Placeholders\> with your values.  If you aren't using a private registry, you won't need to include the `--registry-username` and `registry-password` arguments.

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<iMAGE_NAME>:<TAG> \
  --registry-server <REGISTRY_SERVER> \
  --registry-username <REGISTRY_USERNAME> \
  --registry-password <REGISTRY_PASSWORD> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

You can also use the `az containerapp up` command to redeploy a container app from an existing image.  In this example, the `az containerapp up` command will use the existing resources to redeploy the container app.

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<iMAGE_NAME>:<TAG> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --environment <ENVIRONMENT_NAME> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

## Deploy from a local source

When you use the `az containerapp up` command to deploy from a local source, the command will build the container image, push it to a registry, and deploy the container app.  The command will also create a registry for you if you don't provide one.  You can also use the command to redeploy your container app with a new image.

Your image can be built image using a Dockerfile, in which case the image is built using the `az acr build` command.  

The `az containerapp up` command can build the image without a Dockerfile.  There are two requirements:
TODO:  What are the requirements?

The following example shows how to deploy a container app from local source code.  

In the example, the `az containerapp up` command will:

1. Create a resource group.
1. Create an environment and Log Analytics workspace.
1. Create a registry.
1. Build the image using the Dockerfile if it exists and pushes it to the registry.
1. Create and deploy a container app.

Follow these steps to deploy a container app from local source code:

1. Change to the directory containing the Dockerfile or your source code for the container app.
1. Run the following command:

    ```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <./directory>

If the Dockerfile includes the EXPOSE instruction, the `az containerapp up` command will configure the container app's ingress and target port using the information in the Dockerfile.

The output of the command will include the URL for the container app.

If there's a failure, you can run the command again with the `--debug` option to get more information about the failure.

TODO:  What do we really want to say if there's a failure?

To use the `az containerapp up` command to redeploy your container app with a new image, you use the resource group and environment name that were created when you deployed the container app.  The following example shows how to redeploy a container app from local source code.

1. Make changes to the source code.
1. Run the following command:

    ```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <./directory> \
      --resource-group <RESOURCE_GROUP_NAME> \
      --environment <ENVIRONMENT_NAME>
    ```

## Deploy from a GitHub repository

When you use the `az containerapp up` command to deploy from a GitHub repository, the command will create a GitHub Actions workflow to build and deploy the container app.  The command will also create a registry for you if you don't have one.  

If your repo contains a Dockerfile, the `az containerapp up` command will build the image using the Dockerfile.  If the Dockerfile includes the EXPOSE instruction, the `az containerapp up` command will configure the container app's ingress and target port using the information in the Dockerfile.

To deploy an app from a GitHub repository, run the following command:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --repo <GitHub repository URL>
```

Because the command creates a GitHub Actions workflow, running the command multiple times will have the unwanted effect of creating multiple workflows.  When you want to make changes to your app, push the changes to GitHub, and the workflow will automatically build and deploy the app.  If you want to make changes to the workflow, edit the workflow file in GitHub.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md)