---
title: What are endpoints (preview)
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning endpoints (preview) to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: seramasu
author: rsethur
ms.reviewer: laobri
ms.custom: devplatv2
ms.date: 06/17/2021
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# What are Azure Machine Learning endpoints (preview)? 

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Use Azure Machine Learning endpoints (preview) to streamline model deployments for both real-time and batch inference deployments. Endpoints provide a unified interface to invoke and manage model deployments across compute types.

In this article, you learn about:
> [!div class="checklist"]
> * Endpoints
> * Deployments
> * Managed online endpoints
> * Azure Kubernetes Service (AKS) online endpoints
> * Batch inference endpoints

## What are endpoints and deployments (preview)?

After you train a machine learning model, you need to deploy the model so that others can use it to perform inferencing. In Azure Machine Learning, you can use **endpoints** (preview) and **deployments** (preview) to do so.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments":::

An **endpoint** is an HTTPS endpoint that clients can call to receive the inferencing (scoring) output of a trained model. It provides: 
- Authentication using 'key & token' based auth 
- SSL termination 
- Traffic allocation between deployments 
- A stable scoring URI (endpoint-name.region.inference.ml.azure.com)


A **deployment** is a set of compute resources hosting the model that performs the actual inferencing. It contains: 
- Model details (code, model, environment) 
- Compute resource and scale settings 
- Advanced settings (like request and probe settings)

A single endpoint can contain multiple deployments. Endpoints and deployments are independent ARM resources that will appear in the Azure portal.

Azure Machine Learning uses the concept of endpoints and deployments to implement different types of endpoints: [**online endpoints**](#what-are-online-endpoints-preview) and [**batch endpoints**](#what-are-batch-endpoints-preview).

### Multiple developer interfaces

Create and manage batch and online endpoints with multiple developer tools:
- the Azure CLI
- ARM/REST API
- Azure Machine Learning studio web portal
- Azure portal (IT/Admin)
- Support for CI/CD MLOps pipelines using the Azure CLI interface & REST/ARM interfaces

## What are online endpoints (preview)?

**Online endpoints** (preview) are endpoints that are used for online (real-time) inferencing. Compared to **batch endpoints**, **online endpoints** contain **deployments** that are ready to receive data from clients and can send responses back in real time.

### Online endpoints requirements

To create an online endpoint, you need to specify the following:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance & scale settings 

Learn how to deploy online endpoints from the [CLI](how-to-deploy-managed-online-endpoints.md) and the [studio web portal](how-to-use-managed-online-endpoint-studio.md).

### Test and deploy locally for faster debugging

Deploy locally to test your endpoints without deploying to the cloud. Azure Machine Learning creates a local Docker image that mimics the Azure ML image. Azure Machine Learning will build and run deployments for you locally, and cache the image for rapid iterations.

### Native blue/green deployment 

Recall, that a single endpoint can have multiple deployments. The online endpoint can perform load balancing to allocate any percentage of traffic to each deployment.

Traffic allocation can be used to perform safe rollout blue/green deployments by balancing requests between different instances.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments":::

Learn how to [safely rollout to online endpoints](how-to-safely-rollout-managed-endpoints.md).

### Application Insights integration

All online endpoints integrate with Application Insights to monitor SLAs and diagnose issues. 

However [managed online endpoints](#managed-online-endpoints-vs-aks-online-endpoints-preview) also include out-of-box integration with Azure Logs and Azure Metrics.

### Security

- Authentication: Key and Azure ML Tokens
- Managed identity: User assigned and system assigned (managed online endpoint only)
- SSL by default for endpoint invocation


## Managed online endpoints vs AKS online endpoints (preview)

There are two types of online endpoints: **managed online endpoints** (preview) and **AKS online endpoints** (preview). The following table highlights some of their key differences.

|  | Managed online endpoints | AKS online endpoints |
|-|-|-|
| **Recommended users** | Users who want a managed model deployment and enhanced MLOps experience | Users who prefer Azure Kubernetes Service (AKS) and can self-manage infrastructure requirements |
| **Infrastructure management** | Managed compute provisioning, scaling, host OS image updates, and security hardening | User responsibility |
| **Compute type** | Managed (AmlCompute) | AKS |
| **Out-of-box monitoring** | [Azure Monitoring](how-to-monitor-online-endpoints.md) <br> (includes key metrics like latency and throughput) | Unsupported |
| **Out-of-box logging** | [Azure Logs and Log Analytics at endpoint level](how-to-deploy-managed-online-endpoints.md#optional-integrate-with-log-analytics) | Manual setup at the cluster level |
| **Application Insights** | Supported | Supported |
| **Managed identity** | [Supported](tutorial-deploy-managed-endpoints-using-system-managed-identity.md) | Not supported |
| **Virtual Network (VNET)** | Not supported (public preview) | Manually configure at cluster level |
| **View costs** | [Endpoint and deployment level](how-to-view-online-endpoints-costs.md) | Cluster level |

### Managed online endpoints

Managed online endpoints can help streamline your deployment process. Managed online endpoints provide the following benefits over AKS online endpoints:

- Managed infrastructure
    - Automatically provisions the compute and hosts the model (you just need to specify the VM type and scale settings) 
    - Automatically performs updates and patches to the underlying host OS image
    - Automatic node recovery in case of system failure

:::image type="content" source="media/concept-endpoints/log-analytics-and-azure-monitor.png" alt-text="Screenshot showing Azure Monitor graph of endpoint latency":::

- Monitoring and logs
    - Monitor model availability, performance, and SLA using [native integration with Azure Monitor](how-to-monitor-online-endpoints.md).
    - Debug deployments using the logs and native integration with Azure Log Analytics.

- Managed identity
    -  Use [managed identities to access secured resources from scoring script](tutorial-deploy-managed-endpoints-using-system-managed-identity.md)

:::image type="content" source="media/concept-endpoints/endpoint-deployment-costs.png" alt-text="Screenshot cost chart of an endpoint and deployment":::

- View costs 
    - Managed online endpoints let you [monitor cost at the endpoint and deployment level](how-to-view-online-endpoints-costs.md)

For a step-by-step tutorial, see [How to deploy managed online endpoints](how-to-deploy-managed-online-endpoints.md).

## What are batch endpoints (preview)?

**Batch endpoints** (preview) are endpoints that are used to perform batch inferencing on large volumes of data over a period of time.  **Batch endpoints** receive pointers to data and run jobs asynchronously to process the data in parallel on compute clusters. Batch endpoints store outputs to a data store for further analysis.

Learn how to [deploy and use batch endpoints with the Azure CLI](how-to-use-batch-endpoint.md).

### No-code MLflow model deployments

Use the no-code batch endpoint creation experience for [MLflow models](how-to-use-mlflow.md) to automatically create scoring scripts and execution environments.  

For batch endpoints using MLflow models, you need to specify the following:
- Model files (or specify a registered model in your workspace)
- Compute target

However, if you are **not** deploying an MLflow model, you need to provide additional requirements:
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies


### Managed cost with autoscaling compute

Invoking a batch endpoint triggers an asynchronous batch inference job. Compute resources are automatically provisioned when the job starts, and automatically de-allocated as the job completes. So you only pay for compute when you use it.

You can [override compute resource settings](how-to-use-batch-endpoint.md#overwrite-settings) (like instance count) and advanced settings (like mini batch size, error threshold, and so on) for each individual batch inference job to speed up execution as well as reduce cost.

### Flexible data sources and storage

You can use the following options for input data when invoking a batch endpoint:

- Azure Machine Learning registered datasets - for more information, see [Create Azure Machine Learning datasets](how-to-train-with-datasets.md)
- Cloud data - Either a public data URI or data path in datastore. For more information, see [Connect to data with the Azure Machine Learning studio](how-to-connect-data-ui.md)
- Data stored locally

Specify the storage output location to any datastore and path. By default, batch endpoints store their output to the workspace's default blob store, organized by the Job Name (a system-generated GUID).

### Security

- Authentication: Azure Active Directory Tokens
- SSL by default for endpoint invocation

## Next steps

- [How to deploy managed online endpoints with the Azure CLI](how-to-deploy-managed-online-endpoints.md)
- [How to deploy batch endpoints with the Azure CLI](how-to-use-batch-endpoint.md)
- [How to use managed online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview)
