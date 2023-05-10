---
title: What are endpoints?
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning endpoints to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: devplatv2, ignite-fall-2021, event-tier1-build-2022, ignite-2022
ms.date: 02/07/2023
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# What are Azure Machine Learning endpoints?

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]


Use Azure Machine Learning endpoints to streamline model deployments for both real-time and batch inference deployments. Endpoints provide a unified interface to invoke and manage model deployments across compute types.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn about:
> [!div class="checklist"]
> * Endpoints
> * Deployments
> * Managed online endpoints
> * Kubernetes online endpoints
> * Batch inference endpoints

## What are endpoints and deployments?

After you train a machine learning model, you need to deploy the model so that others can use it to do inferencing. In Azure Machine Learning, you can use **endpoints** and **deployments** to do so.

An **endpoint**, in this context, is an HTTPS path that provides an interface for clients to send requests (input data) and receive the inferencing (scoring) output of a trained model. An endpoint provides:
- Authentication using "key & token" based auth 
- SSL termination 
- A stable scoring URI (endpoint-name.region.inference.ml.azure.com)


A **deployment** is a set of resources required for hosting the model that does the actual inferencing. 

A single endpoint can contain multiple deployments. Endpoints and deployments are independent Azure Resource Manager resources that appear in the Azure portal.

Azure Machine Learning allows you to implement both [online endpoints](#what-are-online-endpoints) and [batch endpoints](#what-are-batch-endpoints).

### Multiple developer interfaces

Create and manage batch and online endpoints with multiple developer tools:
- The Azure CLI and the Python SDK
- Azure Resource Manager/REST API
- Azure Machine Learning studio web portal
- Azure portal (IT/Admin)
- Support for CI/CD MLOps pipelines using the Azure CLI interface & REST/ARM interfaces

## What are online endpoints?

**Online endpoints** are endpoints that are used for online (real-time) inferencing. Compared to **batch endpoints**, **online endpoints** contain **deployments** that are ready to receive data from clients and can send responses back in real time.

The following diagram shows an online endpoint that has two deployments, 'blue' and 'green'. The blue deployment uses VMs with a CPU SKU, and runs version 1 of a model. The green deployment uses VMs with a GPU SKU, and uses version 2 of the model. The endpoint is configured to route 90% of incoming traffic to the blue deployment, while green receives the remaining 10%.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

### Online deployments requirements

To create an online endpoint, you need to specify the following elements:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to do scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance & scale settings 

Learn how to deploy online endpoints from the [CLI/SDK](how-to-deploy-online-endpoints.md) and the [studio web portal](how-to-use-managed-online-endpoint-studio.md).

### Test and deploy locally for faster debugging

Deploy locally to test your endpoints without deploying to the cloud. Azure Machine Learning creates a local Docker image that mimics the Azure Machine Learning image. Azure Machine Learning will build and run deployments for you locally, and cache the image for rapid iterations.

### Native blue/green deployment 

Recall, that a single endpoint can have multiple deployments. The online endpoint can do load balancing to give any percentage of traffic to each deployment.

Traffic allocation can be used to do safe rollout blue/green deployments by balancing requests between different instances.

> [!TIP]
> A request can bypass the configured traffic load balancing by including an HTTP header of `azureml-model-deployment`. Set the header value to the name of the deployment you want the request to route to.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments.":::

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

Traffic to one deployment can also be mirrored (or copied) to another deployment. Mirroring traffic (also called shadowing) is useful when you want to test for things like response latency or error conditions without impacting live clients; for example, when implementing a blue/green deployment where 100% of the traffic is routed to blue and 10% is mirrored to the green deployment. With mirroring, the results of the traffic to the green deployment aren't returned to the clients but metrics and logs are collected. Testing the new deployment with traffic mirroring/shadowing is also known as [shadow testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/shadow-testing/), and the functionality is currently a __preview__ feature.

:::image type="content" source="media/concept-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing an endpoint mirroring traffic to a deployment.":::

Learn how to [safely rollout to online endpoints](how-to-safely-rollout-online-endpoints.md).

### Application Insights integration

All online endpoints integrate with Application Insights to monitor SLAs and diagnose issues. 

However [managed online endpoints](#managed-online-endpoints-vs-kubernetes-online-endpoints) also include out-of-box integration with Azure Logs and Azure Metrics.

### Security

- Authentication: Key and Azure Machine Learning Tokens
- Managed identity: User assigned and system assigned
- SSL by default for endpoint invocation

### Autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed endpoints support autoscaling through integration with the [Azure monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md) feature. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination.

:::image type="content" source="media/concept-endpoints/concept-autoscale.png" alt-text="Screenshot showing that autoscale flexibly provides between min and max instances, depending on rules.":::

### Visual Studio Code debugging

Visual Studio Code enables you to interactively debug endpoints.

:::image type="content" source="media/concept-endpoints/visual-studio-code-full.png" alt-text="Screenshot of endpoint debugging in VSCode." lightbox="media/concept-endpoints/visual-studio-code-full.png" :::

### Private endpoint support

Optionally, you can secure communication with a managed online endpoint by using private endpoints.

You can configure security for inbound scoring requests and outbound communications with the workspace and other services separately. Inbound communications use the private endpoint of the Azure Machine Learning workspace. Outbound communications use private endpoints created per deployment.

For more information, see [Secure online endpoints](how-to-secure-online-endpoint.md).

## Managed online endpoints vs Kubernetes online endpoints

There are two types of online endpoints: **managed online endpoints** and **Kubernetes online endpoints**. 

Managed online endpoints help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. The main example in this doc uses managed online endpoints for deployment. 

Kubernetes online endpoint allows you to deploy models and serve online endpoints at your fully configured and managed [Kubernetes cluster anywhere](./how-to-attach-kubernetes-anywhere.md),with CPUs or GPUs.

The following table highlights the key differences between managed online endpoints and Kubernetes online endpoints. 

|                               | Managed online endpoints                                                                                                          | Kubernetes online endpoints                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Recommended users**         | Users who want a managed model deployment and enhanced MLOps experience                                                           | Users who prefer Kubernetes and can self-manage infrastructure requirements                                             |
| **Node provisioning**         | Managed compute provisioning, update, removal                                                                                     | User responsibility                                                                                                     |
| **Node maintenance**          | Managed host OS image updates, and security hardening                                                                             | User responsibility                                                                                                     |
| **Cluster sizing (scaling)** | [Managed manual and autoscale](how-to-autoscale-endpoints.md), supporting additional nodes provisioning                                                             | [Manual and autoscale](how-to-kubernetes-inference-routing-azureml-fe.md#autoscaling), supporting scaling the number of replicas within fixed cluster boundaries                         |
| **Compute type**              | Managed by the service                                                                                                            | Customer-managed Kubernetes cluster (Kubernetes)                                                                        |
| **Managed identity**          | [Supported](how-to-access-resources-from-endpoints-managed-identities.md)                                                         | Supported                                                                                                               |
| **Virtual Network (VNET)**    | [Supported via managed network isolation](how-to-secure-online-endpoint.md)                                                       | User responsibility                                                                                                     |
| **Out-of-box monitoring & logging** | [Azure Monitor and Log Analytics powered](how-to-monitor-online-endpoints.md) (includes key metrics and log tables for endpoints and deployments) | User responsibility                                                                        |
| **Logging with Application Insights (legacy)** | Supported                                                                                                        | Supported                                                                                                               |
| **View costs**                | [Detailed to endpoint / deployment level](how-to-view-online-endpoints-costs.md)                                                  | Cluster level                                                                                                           |
| **Cost applied to**          | VMs assigned to the deployments                                                                                                   | VMs assigned to the cluster                                                                                             |
| **Mirrored traffic**          | [Supported](how-to-safely-rollout-online-endpoints.md#test-the-deployment-with-mirrored-traffic-preview) (preview)                | Unsupported                                                                                                             |
| **No-code deployment**        | Supported ([MLflow](how-to-deploy-mlflow-models-online-endpoints.md) and [Triton](how-to-deploy-with-triton.md) models)           | Supported ([MLflow](how-to-deploy-mlflow-models-online-endpoints.md) and [Triton](how-to-deploy-with-triton.md) models) |

### Managed online endpoints

Managed online endpoints can help streamline your deployment process. Managed online endpoints provide the following benefits over Kubernetes online endpoints:

- Managed infrastructure
    - Automatically provisions the compute and hosts the model (you just need to specify the VM type and scale settings) 
    - Automatically updates and patches the underlying host OS image
    - Automatic node recovery if there's a system failure

- Monitoring and logs
    - Monitor model availability, performance, and SLA using [native integration with Azure Monitor](how-to-monitor-online-endpoints.md).
    - Debug deployments using the logs and native integration with Azure Log Analytics.

    :::image type="content" source="media/concept-endpoints/log-analytics-and-azure-monitor.png" alt-text="Screenshot showing Azure Monitor graph of endpoint latency.":::

- View costs 
    - Managed online endpoints let you [monitor cost at the endpoint and deployment level](how-to-view-online-endpoints-costs.md)
    
    :::image type="content" source="media/concept-endpoints/endpoint-deployment-costs.png" alt-text="Screenshot cost chart of an endpoint and deployment.":::

    > [!NOTE]
    > Managed online endpoints are based on Azure Machine Learning compute. When using a managed online endpoint, you pay for the compute and networking charges. There is no additional surcharge.
    >
    > If you use a virtual network and secure outbound (egress) traffic from the managed online endpoint, there is an additional cost. For egress, three private endpoints are created _per deployment_ for the managed online endpoint. These are used to communicate with the default storage account, Azure Container Registry, and workspace. Additional networking charges may apply. For more information on pricing, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

For a step-by-step tutorial, see [How to deploy online endpoints](how-to-deploy-online-endpoints.md).

## What are batch endpoints?

**Batch endpoints** are endpoints that are used to do batch inferencing on large volumes of data over a period of time.  **Batch endpoints** receive pointers to data and run jobs asynchronously to process the data in parallel on compute clusters. Batch endpoints store outputs to a data store for further analysis.

:::image type="content" source="media/concept-endpoints/batch-endpoint.png" alt-text="Diagram showing that a single batch endpoint may route requests to multiple deployments, one of which is the default.":::

### Batch deployment requirements

To create a batch deployment, you need to specify the following elements:

- Model files (or specify a model registered in your workspace)
- Compute
- Scoring script - code needed to do the scoring/inferencing
- Environment - a Docker image with Conda dependencies

If you're deploying [MLFlow models in batch deployments](batch-inference/how-to-mlflow-batch.md), there's no need to provide a scoring script and execution environment, as both are autogenerated.

Learn more about how to [deploy and use batch endpoints](batch-inference/how-to-use-batch-endpoint.md).

### Managed cost with autoscaling compute

Invoking a batch endpoint triggers an asynchronous batch inference job. Compute resources are automatically provisioned when the job starts, and automatically de-allocated as the job completes. So you only pay for compute when you use it.

You can [override compute resource settings](batch-inference/how-to-use-batch-endpoint.md#overwrite-deployment-configuration-per-each-job) (like instance count) and advanced settings (like mini batch size, error threshold, and so on) for each individual batch inference job to speed up execution and reduce cost.

### Flexible data sources and storage

You can use the following options for input data when invoking a batch endpoint:

- Cloud data: Either a path on Azure Machine Learning registered datastore, a reference to Azure Machine Learning registered V2 data asset, or a public URI. For more information, see [Data in Azure Machine Learning](concept-data.md).
- Data stored locally: The data will be automatically uploaded to the Azure Machine Learning registered datastore and passed to the batch endpoint.

> [!NOTE]
> - If you're using existing V1 FileDatasets for batch endpoints, we recommend migrating them to V2 data assets. You can then refer to the V2 data assets directly when invoking batch endpoints. Currently, only data assets of type `uri_folder` or `uri_file` are supported. Batch endpoints created with GA CLIv2 (2.4.0 and newer) or GA REST API (2022-05-01 and newer) will not support V1 Datasets.
> - You can also extract the datastores' URI or path from V1 FileDatasets. For this, you'll use the `az ml dataset show` command with the `--query` parameter and use that information for invoke.
> - While batch endpoints created with earlier APIs will continue to support V1 FileDatasets, we'll be adding more support for V2 data assets in the latest API versions for better usability and flexibility. For more information on V2 data assets, see [Work with data using SDK v2](how-to-read-write-data-v2.md). For more information on the new V2 experience, see [What is v2](concept-v2.md).

For more information on supported input options, see [Accessing data from batch endpoints jobs](batch-inference/how-to-access-data-batch-endpoints-jobs.md).

Specify the storage output location to any datastore and path. By default, batch endpoints store their output to the workspace's default blob store, organized by the Job Name (a system-generated GUID).

### Security

- Authentication: Azure Active Directory Tokens
- SSL: enabled by default for endpoint invocation
- VNET support: Batch endpoints support ingress protection. A batch endpoint with ingress protection will accept scoring requests only from hosts inside a virtual network but not from the public internet. A batch endpoint that is created in a private-link enabled workspace will have ingress protection. To create a private-link enabled workspace, see [Create a secure workspace](tutorial-create-secure-workspace.md).

> [!NOTE]
> Creating batch endpoints in a private-link enabled workspace is only supported in the following versions.
> - CLI - version 2.15.1 or higher.
> - REST API - version 2022-05-01 or higher.
> - SDK V2 - version 0.1.0b3 or higher.

## Next steps

- [How to deploy online endpoints with the Azure CLI and Python SDK](how-to-deploy-online-endpoints.md)
- [How to deploy batch endpoints with the Azure CLI and Python SDK](batch-inference/how-to-use-batch-endpoint.md)
- [How to use online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view managed online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
