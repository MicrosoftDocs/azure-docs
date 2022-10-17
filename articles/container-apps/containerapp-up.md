---
title: Quickly deploy Azure Container Apps with the "az containerapp up" command
description: How to quickly deploy a container app with the "az containerapp up" command
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 10/25/2022
ms.author: v-bcatherine
---

# Quickly deploy Azure Container Apps with the "az containerapp up" command

The `az containerapp up` command is the fastest way to deploy an Azure Container App from an existing image, local source code or a GitHub repo.  You can have your container app up and running in minutes by running this single command.

The `az containerapp up` command is an easy, streamlined way to deploy container apps that use the default container app settings.  To customize your container app's resource or scaling settings, you can use the `az containerapp up` command and then the `az containerapp update` command to change these settings.  For customizations such as Dapr configuration, secrets, and transport protocols, you'll need to use the `az containerapp create` command to create a container app from scratch.

The command will create the necessary resources, build the container image, and deploy the app.  When you're working from a GitHub repro, it will make a GitHub Action that automatically builds and pushes a new container image when you commit changes to your GitHub repo.

With the `az containerapp up` command you can:

- Build or use an existing image.
- Create or use an existing Azure resource group.
- Create or use an existing Azure Container Registry.
- Push the image to the registry.
- Create or use an existing Log Analytics workspace.
- Create or use an existing Container Apps environment.
- Create and deploy a container app.
- Create a GitHub Actions workflow to build and deploy changes to the container app.

If you don't provide an existing Container Apps environment, the command will look for one in your resource group and, if found, will use it.  If not found, `az containerapp up` will create an environment and Log Analytics workspace for you.

If you need to customize the Container App environment, use the `az containerapp environment create` command to create your environment.

For more information about the `az containerapp up` command, see [az containerapp up](/cli/azure/containerapp#az_containerapp_up).

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | If you use a GitHub repo, sign up for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Docker Desktop | If you're using local source code with a Dockerfile, you'll need to install Docker Desktop.  Docker provides installers that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). From your command prompt, type `docker` to ensure Docker is running. |
|Local source code | You need to have a local source code directory if you use local source code. |
| Existing Image | If you use an existing image, you'll need your registry server, image name, and tag. If you're using a private registry, you'll need your credentials. |

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

You can use the `az containerapp up` command to redeploy a container app that uses an existing image.  In this example, the `az containerapp up` command will use existing resources to redeploy a container app.

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<iMAGE_NAME>:<TAG> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --environment <ENVIRONMENT_NAME> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

## Deploy from local source code

When you use the `az containerapp up` command to deploy from a local source, it will build the container image, push it to a registry, and deploy the container app.  It will also create a registry if you don't provide one.  You can also use the command to redeploy your container app with a new image.

The `az containerapp up` command can build the image with or without a Dockerfile.  If building without a Dockerfile, there are two requirements:
TODO:  What are the requirements?

The following example shows how to deploy a container app from local source code.  

In the example, the `az containerapp up` command will:

1. Create a resource group.
1. Create an environment and Log Analytics workspace.
1. Create a registry.
1. Build the container image (using the Dockerfile if it exists). 
1. Pushes the image to the registry.
1. Create and deploy a container app.

Follow these steps to deploy a container app from local source code:

1. Change to the directory containing your source code and, optionally, your Dockerfile, for the container image.
1. Run the following command:

    ```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <./directory>

If the Dockerfile includes the EXPOSE instruction, the `az containerapp up` command will configure the container app's ingress and target port using the information in the Dockerfile.

The output of the command will include the URL for the container app.

If there's a failure, you can run the command again with the `--debug` option to get more information about the failure.

TODO:  What do we  want to say if there's a failure?

To use the `az containerapp up` command to redeploy your container app with an updated image, include the `--resource-group` and `--environment` arguments.  The following example shows how to redeploy a container app from local source code.

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

When you use the `az containerapp up` command to deploy from a GitHub repository, it will create a GitHub Actions workflow to build and deploy the container app.  It will also create a registry for you if you don't have one.    

If your repository contains a Dockerfile, the `az containerapp up` command will build the image using the Dockerfile.  If the Dockerfile includes the EXPOSE instruction, the `az containerapp up` command will configure the container app's ingress and target port using the information in the Dockerfile.

The following example shows how to deploy a container app from a GitHub repository.  

In the example, the `az containerapp up` command will:

1. Create a resource group.
1. Create an environment and Log Analytics workspace.
1. Create a registry.
1. Build the container image (using the Dockerfile if it exists). 
1. Pushes the image to the registry.
1. Create and deploy a container app.

To deploy an app from a GitHub repository, run the following command:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --repo <GitHub repository URL>
```

Because the `az containerapp up` creates a GitHub Actions workflow, rerunning it to deploy changes to your app's image will have the unwanted effect of creating multiple workflows.  Instead, push changes to GitHub, and the workflow will automatically build and redeploy the app.  To change the workflow, edit the workflow file in GitHub.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md)