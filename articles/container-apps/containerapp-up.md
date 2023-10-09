---
title: Deploy Azure Container Apps with the az containerapp up command
description: How to deploy a container app with the az containerapp up command
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/08/2022
ms.author: cshoe
---

# Deploy Azure Container Apps with the az containerapp up command

The `az containerapp up` (or `up`) command is the fastest way to deploy an app in Azure Container Apps from an existing image, local source code or a GitHub repo.  With this single command, you can have your container app up and running in minutes.  

The `az containerapp up` command is a streamlined way to create and deploy container apps that primarily use default settings. However, you'll need to run other CLI commands to configure more advanced settings:

- Dapr: [`az containerapp dapr enable`](/cli/azure/containerapp/dapr#az-containerapp-dapr-enable)
- Secrets: [`az containerapp secret set`](/cli/azure/containerapp/secret#az-containerapp-secret-set)
- Transport protocols: [`az containerapp ingress update`](/cli/azure/containerapp/ingress#az-containerapp-ingress-update)

To customize your container app's resource or scaling settings, you can use the `up` command and then the `az containerapp update` command to change these settings.  Note that the `az containerapp up` command isn't an abbreviation of the `az containerapp update` command.  

The `up` command can create or use existing resources including:

- Resource group
- Azure Container Registry
- Container Apps environment and Log Analytics workspace
- Your container app

The command can build and push a container image to an Azure Container Registry (ACR) when you provide local source code or a GitHub repo.  When you're working from a GitHub repo, it creates a GitHub Actions workflow that automatically builds and pushes a new container image when you commit changes to your GitHub repo.

If you need to customize the Container Apps environment, first create the environment using the `az containerapp env create` command.  If you don't provide an existing environment, the `up` command looks for one in your resource group and, if found, uses that environment.  If not found, it creates an environment with a Log Analytics workspace.

To learn more about the `az containerapp up` command and its options, see [`az containerapp up`](/cli/azure/containerapp#az-containerapp-up).

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | If you use a GitHub repo, sign up for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
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

1. Register the `Microsoft.OperationalInsights` provider for the Azure Monitor Log Analytics workspace.

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Deploy from an existing image

You can deploy a container app that uses an existing image in a public or private container registry.  If you are deploying from a private registry, you'll need to provide your credentials using the `--registry-server`, `--registry-username`, and `--registry-password` options.  

In this example, the `az containerapp up` command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates and deploys a container app that pulls the image from a public registry.
1. Sets the container app's ingress to external with a target port set to the specified value.

Run the following command to deploy a container app from an existing image.  Replace the \<Placeholders\> with your values. 

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<IMAGE_NAME>:<TAG> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

You can use the `up` command to redeploy a container app. If you want to redeploy with a new image, use the `--image` option to specify a new image.  Ensure that the `--resource-group` and `environment` options are set to the same values as the original deployment.  

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<IMAGE_NAME>:<TAG> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --environment <ENVIRONMENT_NAME> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

## Deploy from local source code

When you use the `up` command to deploy from a local source, it builds the container image, pushes it to a registry, and deploys the container app.  It creates the registry in Azure Container Registry if you don't provide one.  

The command can build the image with or without a Dockerfile.  If building without a Dockerfile the following languages are supported:

- .NET
- Node.js
- PHP
- Python
- Ruby
- Go

The following example shows how to deploy a container app from local source code.  

In the example, the `az containerapp up` command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates a registry in Azure Container Registry.
1. Builds the container image (using the Dockerfile if it exists). 
1. Pushes the image to the registry.
1. Creates and deploys the container app.

Run the following command to deploy a container app from local source code:

```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <SOURCE_DIRECTORY>\
      --ingress external 
```

When the Dockerfile includes the EXPOSE instruction, the `up` command configures the container app's ingress and target port using the information in the Dockerfile.  

If you've configured ingress through your Dockerfile or your app doesn't require ingress, you can omit the `ingress` option.

The output of the command includes the URL for the container app.

If there's a failure, you can run the command again with the `--debug` option to get more information about the failure. If the build fails without a Dockerfile, you can try adding a Dockerfile and running the command again.

To use the `az containerapp up` command to redeploy your container app with an updated image, include the `--resource-group` and `--environment` arguments.  The following example shows how to redeploy a container app from local source code.

1. Make changes to the source code.
1. Run the following command:

    ```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <SOURCE_DIRECTORY> \
      --resource-group <RESOURCE_GROUP_NAME> \
      --environment <ENVIRONMENT_NAME>
    ```

## Deploy from a GitHub repository

When you use the `az containerapp up` command to deploy from a GitHub repository, it generates a GitHub Actions workflow that builds the container image, pushes it to a registry, and deploys the container app.  The command creates the registry in Azure Container Registry if you don't provide one.  

A Dockerfile is required to build the image.  When the Dockerfile includes the EXPOSE instruction, the command configures the container app's ingress and target port using the information in the Dockerfile.

The following example shows how to deploy a container app from a GitHub repository.  

In the example, the `az containerapp up` command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates a registry in Azure Container Registry.
1. Builds the container image using the Dockerfile.
1. Pushes the image to the registry.
1. Creates and deploys the container app.
1. Creates a GitHub Actions workflow to build the container image and deploy the container app when future changes are pushed to the GitHub repository.

To deploy an app from a GitHub repository, run the following command:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --repo <GitHub repository URL> \
  --ingress external 
```

If you've configured ingress through your Dockerfile or your app doesn't require ingress, you can omit the `ingress` option.

Because the `up` command creates a GitHub Actions workflow, rerunning it to deploy changes to your app's image will have the unwanted effect of creating multiple workflows.  Instead, push changes to your GitHub repository, and the GitHub workflow will automatically build and deploy your app.  To change the workflow, edit the workflow file in GitHub.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md)
