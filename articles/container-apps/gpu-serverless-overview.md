---
title: Using serverless GPUs in Azure Container Apps
description: Learn to how to use GPUs with apps and jobs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
  - build-2025
ms.topic: how-to
ms.date: 06/02/2025
ms.author: cshoe
---

# Using serverless GPUs in Azure Container Apps

Azure Container Apps provides access to GPUs on-demand without you having to manage the underlying infrastructure. As a serverless feature, you only pay for GPUs in use. When enabled, the number of GPUs used for your app rises and falls to meet the load demands of your application. Serverless GPUs enable you to seamlessly run your workloads with automatic scaling, optimized cold start, per-second billing with scale down to zero when not in use, and reduced operational overhead. 

Serverless GPUs are only supported for Consumption workload profiles. The feature isn't supported for Consumption-only environments.

> [!NOTE]
> Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](./quota-requests.md#manual-requests).

## Benefits

Serverless GPUs accelerate AI development by allowing you to focus on your core AI code and less on managing infrastructure when using GPUs. This feature provides a middle layer option between the [Azure AI model catalog](/azure/machine-learning/concept-model-catalog)'s serverless APIs and hosting models on managed compute.

The Container Apps serverless GPU support provides full data governance as your data never leaves the boundaries of your container while still providing a managed, serverless platform from which to build your applications.

When you use serverless GPUs in Container Apps, your apps get:

- **Scale-to zero GPUs**: Support for automatic serverless scaling of NVIDIA A100 and NVIDIA T4 GPUs.

- **Per-second billing**: Pay only for the GPU compute you use.

- **Built-in data governance**: Your data never leaves the container boundary.

- **Flexible compute options**: You can choose between the NVIDIA A100 or T4 GPU types.

- **Middle-layer for AI development**: Bring your own model on a managed, serverless compute platform.

## Common scenarios

The following scenarios, while not comprehensive, describe common use cases for serverless GPUs.

- **Real-time and batch inferencing**: Using custom open-source models with fast startup times, automatic scaling, and a per-second billing model. Serverless GPUs are ideal for dynamic applications. You pay only for the compute you use, and your apps automatically scale in and out to meet demand.

- **Machine learning scenarios**: Significantly speed up applications that implement fine-tuned custom generative AI models, deep learning, neural networks, or large-scale data analysis.

- **High-Performance Computing (HPC)**: Applications that require complex calculations and simulations, such as scientific computing, financial modeling, or weather forecasting use GPUs as resources for high computational demands.

- **Rendering and Visualization**: Applications that involve 3D rendering, image processing, or video transcoding often use GPUs to accelerate rendering process and enable real-time visualization.

- **Big Data Analytics**: GPUs can accelerate data processing and analysis among massive datasets.

## Considerations

Keep in mind the following items as you use serverless GPUs:

- **CUDA version**: Serverless GPUs support the latest CUDA version

- **Support limitations**:
  - Only one container in an app can use the GPU at a time. If you have multiple containers in an app, the first container gets access to the GPU.
  - Multiple apps can share the same GPU workload profile but each requires their own replica.
  - Multi and fractional GPU replicas aren't supported.
  - The first container in your application gets access to the GPU.

- **IP addresses**: Consumption GPUs use one IP address per replica when you set up integration with your own virtual network.

## Supported regions

Serverless GPUs are available in the following regions:

| Region | A100 | T4 |
|--|--|--|
| West US 3 | Yes | Yes |
| West US | Yes | No |
| Australia East | Yes | Yes |
| Sweden Central | Yes | Yes |
| West Europe<sup>1</sup> | No | Yes |

<sup>1</sup> To add a T4 serverless GPU workload profile in West Europe, you must create a new workload profile environment in the region.

## Use serverless GPUs

When you create a container app through the Azure portal, you can set up your container to use GPU resources.

In the *Container* tab of the create process, set the following settings:

1. Under the *Container resource allocation* section, check the **GPU** checkbox.

1. For the **GPU Type**, select either the NVIDIA A100 or NVIDIA T4 option.

## Manage serverless GPU workload profile

Serverless GPUs are run on consumption GPU workload profiles. You manage a consumption GPU workload profile in the same manner as any other workload profile. You can manage your workload profile using the [CLI](workload-profiles-manage-cli.md) or the [Azure portal](workload-profiles-manage-portal.md).

## Request serverless GPU quota

> [!NOTE]
> Customers with enterprise agreements and pay-as-you-go customers have A100 and T4 quota enabled by default.

Access to this feature is only available after you have serverless GPU quota. You can submit your GPU quota request via a [customer support case](./quota-requests.md#manual-requests). When opening a support case for a GPU quota request, please select the following:

1. Open [New support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV4Blade/callerName/Quota/summary/Quota%20request) form in the Azure portal.

1. Enter the following values into the form:

    | Property | Value |
    |---|---|
    | Issue type | Select **Service and subscription limits (quotas)** |
    | Subscription | Select your subscription.  |
    | Quota type | Select **Container Apps**. |

1. Select **Next**.

1. In the *Additional details* window, select **Enter details** to open the request details window.

    :::image type="content" source="media/quotas/azure-container-apps-qms-support-details.png" alt-text="Screenshot of Azure Quota Management System details window.":::

1. For **Quota type**, select either **Managed Environment Consumption NCA100 Gpus** or **Managed Environment Consumption T4 Gpus**. Enter your additional values.

1. Select **Save and continue**.

1. Fill out the rest the relevant details in the *Additional details* window.

1. Select **Next**.

1. Select **Create**.

## Improve GPU cold start

You can significantly improve cold start times by enabling artifact streaming and locating large files, like large language models, in a storage mount.

- [Artifact streaming](/azure/container-registry/container-registry-artifact-streaming): Azure Container Registry offers image streaming which can significantly speed up image startup times. To use artifact streaming, your container images must be hosted in a premium Azure Container Registry.

- [Storage mounts](cold-start.md#manage-large-downloads): Reduce the effects of network latency by storing large files in an Azure storage account associated with your container app.

<a name="deploy-foundry-models"></a>

## Deploy Foundry models to serverless GPUs (preview)

Azure Container Apps serverless GPUs now support Azure AI Foundry models in public preview. Azure AI Foundry Models have two deployment options:

- [**Serverless APIs**](/azure/ai-foundry/how-to/deploy-models-serverless?tabs=azure-ai-studio) which provide pay-as-you-go billing for some of the most popular models.

- [**Managed compute**](/azure/ai-foundry/how-to/create-manage-compute) that allow you to deploy the full selection of Foundry models with pay-per-GPU pricing.

Azure Container Apps serverless GPU offers a balanced deployment option between serverless APIs and managed compute for you to deploy Foundry models. This option is on-demand with serverless scaling that scales in to zero when not in use and complies with your data residency needs. With serverless GPUs, using Foundry models give you flexibility to run any supported model with automatic scaling, pay-per-second-pricing, full data governance, out of the box enterprise networking and security support.

Language models of the type `MLFLOW` are supported. To see a list of `MLFLOW` models, go to the list of models available in the [azureml registry](https://aka.ms/azureml-registry). To locate the models, add a filter for `MLFLOW` models using the following steps:

1. Select **Filter**.

1. Select **Add Filter**.

1. For the filter rule, enter **Type = MLFLOW**.

For models listed here in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps/tree/main/templates/azml-app), you can deploy them directly to serverless GPUs without needing to build your own image by using the following CLI command:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --location <LOCATION> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --model-registry <MODEL_REGISTRY_NAME> \
  --model-name <MODEL_NAME> \
  --model-version <MODEL_VERSION>
```

For any model not in this list, you need to:

1. Download the github template for the model image from the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps/tree/main/templates/azml-app).

1. Modify the score.py file to match your model type. The scoring script (named *score.py*) defines how you interact with the model. The following example shows [how to use a custom score.py file](/azure/machine-learning/how-to-deploy-online-endpoints).

1. Build the image and deploy it to a container registry.

1. Use the previous CLI command to deploy the model to serverless GPUs, but specify the `--image`. By using the `--model-registry`, `--model-name`, and `--model-version` parameters, the key environment variables are set for you to optimize cold start for your app.

## Submit feedback

Submit issue to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Generate images using serverless GPUs](gpu-image-generation.md)
