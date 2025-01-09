---
title: "Tutorial: Generate images using serverless GPUs in Azure Container Apps (preview)"
description: Learn to run to generate images powered by serverless GPUs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/06/2024
ms.author: cshoe
---

# Tutorial: Generate images using serverless GPUs in Azure Container Apps (preview)

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

| Resource | Description |
|---|---|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure Container Registry instance | You need an existing Azure Container Registry instance or the permissions to create one. |
| Access to serverless GPUs | Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request). |

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
    | Region | Select **West US 3**. <br><br>For more supported regions, refer to [Using serverless GPUs in Azure](gpu-serverless-overview.md#supported-regions). |
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
    | Workload profile | Select the option that begins with **Consumption - Up to 4**... |
    | GPU | Select the checkbox. |
    | GPU Type | Select the **T4** option and select the link to add the profile to your environment. |

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

## Monitor your GPU

Once you generate an image, use the following steps to view results of the GPU processing:

1. Open your container app in the Azure portal.

1. From the *Monitoring* section, select **Console**.

1. Select your replica.

1. Select your container.

1. Select **Reconnect*.

1. In the *Choose start up command* window, select **/bin/bash**, and select **Connect**.

1. Once the shell is set up, enter the command **nvidia-smi** to review the status and output of your GPU.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill.

If you aren't going to use these services long-term, use the steps to remove everything created in this tutorial.

1. In the Azure portal, search for and select **Resource Groups**.

1. Select **my-gpu-demo-group**.

1. Select **Delete resource group**.

1. In the confirmation box, enter **my-gpu-demo-group**.

1. Select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Improve cold start for your serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start)
