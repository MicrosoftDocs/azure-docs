---
title: "Tutorial: Generate images using serverless GPUs in Azure Container Apps"
description: Learn to run to generate images powered by serverless GPUs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 03/17/2025
ms.author: cshoe
zone_pivot_groups: container-apps-portal-or-cli
---

# Tutorial: Generate images using serverless GPUs in Azure Container Apps

In this article, you learn how to create a container app that uses [serverless GPUs](gpu-serverless-overview.md) to power an AI application.

With serverless GPUs, you have direct access to GPU compute resources without having to do manual infrastructure configuration such as installing drivers. All you have to do is deploy your AI model's image.

In this tutorial you:

> [!div class="checklist"]
> * Create a new container app and environment 
> * Configure the environment to use serverless GPUs
> * Deploy your app to Azure Container Apps
> * Use the new serverless GPU enable application
> * Enable artifact streaming to reduce GPU cold start

## Prerequisites

::: zone pivot="azure-portal"

| Resource | Description |
|---|---|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Access to serverless GPUs | Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request). |

::: zone-end

::: zone pivot="azure-cli"

| Resource | Description |
|---|---|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Access to serverless GPUs | Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request). |
| [Azure CLI](/cli/azure/install-azure-cli) | Install the [Azure CLI](/cli/azure/install-azure-cli) or upgrade to the latest version. |

::: zone-end

::: zone pivot="azure-portal"

## Create your container app

1. Go to the Azure portal and search for and select **Container Apps**.
1. Select **Create** and then select **Container App**.
1. In the *Basics* window, enter the following values into each section.

    Under *Project details* enter the following values:

    | Setting | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-gpu-demo-group**. |
    | Container app name | Enter **my-gpu-demo-app**. |
    | Deployment source | Select **Container image**. |

    Under *Container Apps environment* enter the following values:

    | Setting | Value |
    |---|---|
    | Region | Select **Sweden Central**. <br><br>For more supported regions, refer to [Using serverless GPUs in Azure](gpu-serverless-overview.md#supported-regions). |
    | Container Apps environment | Select **Create new**. |

    In the *Create Container Apps environment* window, enter the following values:

    | Setting | Value |
    |---|---|
    | Environment name | Enter **my-gpu-demo-env**. |

    Select **Create**.

    Select **Next: Container >**.

1. In the *Container* window, enter the following values:

    | Setting | Value |
    |---|---|
    | Name | Enter **my-gpu-demo-container**. |
    | Image source | Select **Docker Hub or other registries**.  |
    | Image type | Select **public**. |
    | Registry login server | Enter **mcr.microsoft.com**. |
    | Image and tag | Enter **k8se/gpu-quickstart:latest**. |
    | Workload profile | Select **Consumption - Up to 4 vCPUs, 8 Gib memory**. |
    | GPU | Select the checkbox. |
    | GPU Type | Select **Consumption-GPU-NC8as-T4 - Up to 8 vCPUs, 56 GiB memory** and select the link to add the profile to your environment. |

    Select **Next: Ingress >**.

1. In the *Ingress* window, enter the following values:

    | Setting | Value |
    |---|---|
    | Ingress | Select the **Enabled** checkbox. |
    | Ingress traffic | Select the **Accepting traffic from anywhere** radio button. |
    | Target port | Enter **80**. |

1. Select **Review + create**.

1. Select **Create**.

1. Wait a few moments for the deployment to complete and then select **Go to resource**.

    This process can take up to five minutes to complete.

## Use your GPU app

From the *Overview* window, select the **Application Url** link to open the web app front end in your browser and use the GPU application.

> [!NOTE]
> - To achieve the best performance of your GPU apps, follow the steps to [improve cold start for your serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start).
> - When there are multiple containers in your application, the first container gets access to the GPU.

::: zone-end

::: zone pivot="azure-cli"

## Create environment variables

Define the following environment variables. Before running this command, replace the `<PLACEHOLDERS>` with your values.

```azurecli
RESOURCE_GROUP="<RESOURCE_GROUP>"
ENVIRONMENT_NAME="<ENVIRONMENT_NAME>"
LOCATION="swedencentral"
CONTAINER_APP_NAME="<CONTAINER_APP_NAME>"
CONTAINER_IMAGE="mcr.microsoft.com/k8se/gpu-quickstart:latest"
WORKLOAD_PROFILE_NAME="NC8as-T4"
WORKLOAD_PROFILE_TYPE="Consumption-GPU-NC8as-T4"
```

## Create your container app

1. Create the resource group to contain the resources you create in this tutorial. This command should output `Succeeded`.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

1. Create a Container Apps environment to host your container app. This command should output `Succeeded`.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location "$LOCATION" \
      --query "properties.provisioningState"
    ```

1. Add a workload profile to your environment.

    ```azurecli
    az containerapp env workload-profile add \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --workload-profile-name $WORKLOAD_PROFILE_NAME \
      --workload-profile-type $WORKLOAD_PROFILE_TYPE
    ```

1. Create your container app.

    ```azurecli
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT_NAME \
      --image $CONTAINER_IMAGE \
      --target-port 80 \
      --ingress external \
      --cpu 8.0 \
      --memory 56.0Gi \
      --workload-profile-name $WORKLOAD_PROFILE_NAME \
      --query properties.configuration.ingress.fqdn
    ```

    This command outputs the application URL for your container app.

## Use your GPU app

Open the application URL for your container app in your browser. Note it can take up to five minutes for the container app to start up.

The Azure Container Apps with Serverless GPUs application lets you enter a prompt to generate an image. You can also simply select `Generate Image` to use the default prompt. In the next step, you view the results of the GPU processing.

> [!NOTE]
> - To achieve the best performance of your GPU apps, follow the steps to [improve cold start for your serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start).
> - When there are multiple containers in your application, the first container gets access to the GPU.

::: zone-end

## Monitor your GPU

Once you generate an image, use the following steps to view the results of the GPU processing:

1. Open your container app in the Azure portal.

1. From the *Monitoring* section, select **Console**.

1. Select your replica.

1. Select your container.

1. Select **Reconnect**.

1. In the *Choose start up command* window, select **/bin/bash**, and select **Connect**.

1. Once the shell is set up, enter the command **nvidia-smi** to review the status and output of your GPU.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill.

If you aren't going to use these services long-term, use the steps to remove everything created in this tutorial.

::: zone pivot="azure-portal"

1. In the Azure portal, search for and select **Resource Groups**.

1. Select **my-gpu-demo-group**.

1. Select **Delete resource group**.

1. In the confirmation box, enter **my-gpu-demo-group**.

1. Select **Delete**.

::: zone-end

::: zone pivot="azure-cli"

Run the following command.

```azurecli
az group delete --name $RESOURCE_GROUP
```

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Improve cold start for your serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start)
