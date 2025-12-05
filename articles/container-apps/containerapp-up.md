---
title: Deploy Azure Container Apps with the az containerapp up Command
description: Find out how to use the Azure CLI az containerapp up command to quickly deploy an Azure container app from an image, local code, or a GitHub repository.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: how-to
ms.date: 11/20/2025
ms.author: cshoe
# customer intent: As a developer, I want to find out how to use the Azure CLI az containerapp up command so that I can deploy a basic Azure container app from an image, local code, or a GitHub repository within minutes.
---

# Deploy Azure Container Apps with the az containerapp up command

The `az containerapp up` (or `up`) command is the fastest way to deploy an app in Azure Container Apps from an existing image, local source code, or a GitHub repository. When you use this single command, you can have your container app up and running in minutes. 

The command can build and push a container image to Azure Container Registry when you provide local source code or a GitHub repository. When you work from a GitHub repository, the command creates a GitHub Actions workflow that automatically builds and pushes a new container image when you commit changes to your GitHub repository.

This article shows you how to use the command to deploy a container app from an existing image, local source code, and a GitHub repository.

## Prerequisites

| Requirement | Instructions |
|--|--|
| An Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). Your Azure subscription needs to have the *Contributor* or *Owner* role. For detailed information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=current). |
| The Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| A GitHub account | If you want to use an image in a GitHub repository, [sign up for a free GitHub account](https://github.com/join). |
| Local source code | If you want to create an image from local source code, put your code in a local directory. |
| An existing image | If you want to use an existing image, note your registry server, image name, and tag. If you use a private registry, also note your credentials. |

## Use existing resources

The `up` command can create resources, or it can use existing ones, including:

- A resource group.
- Container Registry.
- A Container Apps environment and Log Analytics workspace.
- Your container app.

If you need to customize the Container Apps environment, first use the `az containerapp env create` command to create and customize your environment. When you then run the `up` command, use the `--environment` option to specify the customized environment.

If you don't specify an existing environment, the `up` command looks for one in your resource group. If the command finds an environment, it uses that environment. If the command doesn't find an environment, it creates one that includes a Log Analytics workspace.

For more information about the `az containerapp up` command and its options, see [`az containerapp up`](/cli/azure/containerapp#az-containerapp-up).

## Set up your Azure CLI environment

1. Use the Azure CLI to sign in to Azure. 

    ```azurecli
    az login
    ```
1. Install the Container Apps extension for the Azure CLI.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Register the `Microsoft.App` namespace.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

1. Register the `Microsoft.OperationalInsights` provider for the Log Analytics workspace.

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Deploy from an existing image

You can deploy a container app that uses an existing image in a public or private container registry. If you deploy from a private registry, you need to provide your credentials by using the `--registry-server`, `--registry-username`, and `--registry-password` options. 

You can use the following example code to deploy a container app from an existing image. Before you run the command, replace the placeholders, which are enclosed in angle brackets, with your values. 

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --image <REGISTRY_SERVER>/<IMAGE_NAME>:<TAG> \
  --ingress external \
  --target-port <PORT_NUMBER> 
```

This command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates and deploys a container app that pulls the image from a public registry.
1. Sets the container app's `ingress` value to `external` with a target port set to the specified value.

You can also use the `up` command to redeploy a container app. If you want to redeploy with a new image, use the `--image` option to specify a new image. Ensure that the `--resource-group` and `--environment` options are set to the values from the original deployment. 

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

When you use the `up` command to deploy from a local source, it builds the container image, pushes it to a registry, and deploys the container app. If you don't specify a registry, the command creates one in Container Registry. 

The command can build the image with or without a Dockerfile. In builds that don't use a Dockerfile, the following languages are supported:

- .NET
- Node.js
- PHP
- Python

You can use the following example code to deploy a container app from local source code:

```azurecli
    az containerapp up \
      --name <CONTAINER_APP_NAME> \
      --source <SOURCE_DIRECTORY>\
      --ingress external 
```

This command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates a registry in Container Registry.
1. Builds the container image (by using the Dockerfile if it exists). 
1. Pushes the image to the registry.
1. Creates and deploys the container app.

When the Dockerfile includes the `EXPOSE` instruction, the `up` command configures the container app's ingress and target port by using the information in the Dockerfile. If you configure ingress through your Dockerfile or your app doesn't require ingress, you can omit the `--ingress` option.

The output of the command includes the URL for the container app.

If the command reports that it's waiting for the Cloud Build agent but then stops responding, a GitHub transient error might be the source of the problem. To resolve the situation, run the command again.

If there's a failure, you can run the command again with the `--debug` option to get more information. If the build fails without a Dockerfile, you can try adding a Dockerfile and running the command again.

To use the `az containerapp up` command to redeploy your container app with an updated image, include the `--resource-group` and `--environment` options. To redeploy a container app from local source code, take the following steps:

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

When you use the `az containerapp up` command to deploy from a GitHub repository, it generates a GitHub Actions workflow that builds the container image, pushes it to a registry, and deploys the container app. If you don't specify a registry, the command creates one in Container Registry.

A Dockerfile is required to build the image. When the Dockerfile includes the `EXPOSE` instruction, the command configures the container app's ingress and target port by using the information in the Dockerfile.

You can use the following example code to deploy a container app from a GitHub repository:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --repo <GITHUB_REPOSITORY_URL> \
  --ingress external 
```

This command performs the following actions:

1. Creates a resource group.
1. Creates an environment and Log Analytics workspace.
1. Creates a registry in Container Registry.
1. Builds the container image by using the Dockerfile.
1. Pushes the image to the registry.
1. Creates and deploys the container app.
1. Creates a GitHub Actions workflow to build the container image and deploy the container app when future changes are pushed to the GitHub repository.

If the command fails because a service principal can't be created, you can manually create a service principal in Azure. Then you can pass information about it to the command:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --repo <GITHUB_REPOSITORY_URL> \
  --service-principal-client-id "$SERVICE_PRINCIPAL_CLIENT_ID" \
  --service-principal-client-secret "$SERVICE_PRINCIPAL_CLIENT_SECRET" \
  --service-principal-tenant-id "$AZURE_TENANT_ID"
  --ingress external 
```

If you configure ingress through your Dockerfile or your app doesn't require ingress, you can omit the `--ingress` option.

The `up` command creates a GitHub Actions workflow. As a result, rerunning the command has the unwanted effect of creating multiple workflows. If you want to deploy changes to your app's image, push changes to your GitHub repository instead of rerunning the command. The GitHub workflow automatically detects the changes in your repository and then builds and deploys your app. To change the workflow, edit the workflow file in GitHub.

## Configure container app settings

The `az containerapp up` command provides a streamlined way to create and deploy container apps that primarily use default settings. However, after you use the `up` command, you need to run other Azure CLI commands such as the following ones if you want to configure more advanced settings:

- Distributed Application Runtime (Dapr): [`az containerapp dapr enable`](/cli/azure/containerapp/dapr#az-containerapp-dapr-enable)
- Secrets: [`az containerapp secret set`](/cli/azure/containerapp/secret#az-containerapp-secret-set)
- Transport protocols: [`az containerapp ingress update`](/cli/azure/containerapp/ingress#az-containerapp-ingress-update)

If you want to customize other settings for your container app, such as resource or scaling settings, first use the `up` command to deploy your container app. Then use the `az containerapp update` command to change these settings. The `az containerapp up` command isn't an abbreviation for the `az containerapp update` command. 

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md)
