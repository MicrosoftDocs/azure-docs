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
ms.date: 05/25/2021
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# What are Azure Machine Learning endpoints (preview)?

Use Azure Machine Learning endpoints to streamline model deployments for both real-time and batch inference deployments. Endpoints provide a unified interface to invoke and manage model deployments across compute types.

In this article, you learn about:
> [!div class="checklist"]
> * Endpoints
> * Deployments
> * Managed online endpoints
> * AKS online endpoints
> * Batch inference endpoints

## What are endpoints and deployments (preview)?

After you train a machine learning model, you need to deploy the model so that others can use it to perform inferencing. In Azure Machine Learning, you can use **Endpoints** and **Deployments** to do so.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments":::

An **Endpoint** is an HTTPS endpoint that clients can call to receive the inferencing (scoring) output of a trained model. It provides: 
- Authentication using 'key & token' based auth 
- SSL termination 
- Traffic allocation between deployments 
- A stable scoring URI (endpoint-name.region.inference.ml.azure.com)


A **Deployment** is a set of compute resources hosting the model that performs the actual inferencing. It contains: 
- Model details (code, model, environment) 
- Compute resource and scale settings 
- Advanced settings (like request and probe settings)

A single endpoint can contain multiple deployments. Endpoints and deployments are independent ARM resources that will appear in the Azure portal.

Azure Machine Learning uses the concept of endpoints and deployments to implement different types of endpoints: [**online endpoints**](#what-are-online-endpoints-preview) and [**batch endpoints**](#what-are-batch-endpoints-preview).

## What are online endpoints (preview)?

**Online endpoints** are endpoints that are used for online (real-time) inferencing. Compared to **batch endpoints**, **online endpoints** contain **deployments** that are ready to receive data from clients and can send responses back in real time.

### Online endpoints requirements

To create an online endpoint, you need to specify the following:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance & scale settings 

Learn how to deploy online endpoints from the CLI, ARM/REST, and the studio web portal.

### Monitoring and cost management

:::image type="content" source="media/concept-endpoints/online-endpoint-monitoring.png" alt-text="Screenshot showing the costs for a single endpoint":::

All online endpoints have native integration with Application Insights to monitor SLAs and diagnose issues. [Managed online endpoints](#managed-online-endpoints-vs-aks-online-endpoints-preview) also include native integration with Azure Logs and Azure Metrics.

You can also use the Azure portal to easily view cost at the endpoint level.

### Security

- Authentication: Key and Azure ML Tokens
- Managed identity: User assigned and system assigned
- SSL by default for endpoint invocation

### Multiple developer interfaces

Create and manage your online endpoints with multiple developer tools:
- CLI
- ARM/REST API
- Azure Machine Learning studio web portal
- Azure portal (IT/Admin)
- Support for CI/CD MLOps pipelines using the CLI interface & REST/ARM interfaces

Deploy and test your model in a local Docker environment using local endpoints for faster debugging.

### Native blue/green deployment

Recall, that a single endpoint can have multiple deployments. The online endpoint can perform load balancing to allocate any percentage of traffic to each deployment.

Traffic allocation can be used to perform safe rollout blue/green deployments by balancing requests between different instances.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments":::


## Managed online endpoints vs AKS online endpoints (preview)

There are two types of online endpoints: **managed online endpoints** and **AKS online endpoints**. The following table highlights some of their key differences.

|  | Managed online endpoints | AKS online endpoints |
|-|-|-|
| **Recommended users** | Users who want a managed model deployment and enhanced MLOps experience | Users who prefer Azure Kubernetes Service (AKS) and can manage infrastructure requirements |
| **Infrastructure management** | Managed compute provisioning, scaling, host OS image updates, and security hardening | Manual configuration |
| **Compute type** | Managed (AmlCompute) | AKS |
| **Logs and monitoring** | [Azure Logs](how-to-deploy-managed-online-endpoints.md#optional-integrate-with-log-analytics), [Azure Monitoring](how-to-monitor-online-endpoints.md), & AppInsights integration | AppInsights integration, manual setup for other monitoring and logging |
| **Managed identity** | [Supported](tutorial-deploy-managed-endpoints-using-system-managed-identity.md) | Not supported |
| **Virtual Network (VNET)** | Not supported (public preview) | Manually configure at cluster level |
| **View costs** | [Endpoint and deployment level](how-to-view-online-endpoints-costs.md) | Cluster level |

### Managed online endpoints

Managed online endpoints can help streamline your deployment process. Managed online endpoints provide the following benefits:

- Managed infrastructure
    - Automatically provisioning the compute and hosting the model (you just need to specify the VM type and scale settings) 
    - Automatically perform updates and patches to the underlying host OS image
    - Automatic node recovery in case of system failure.

- Monitoring and logs
    - Monitor model availability, performance, and SLA using [native integration with Azure Monitor](how-to-monitor-online-endpoints.md).
    - Debug deployments using the logs and [native integration with Azure Log Analytics](how-to-deploy-managed-online-endpoints.md#optional-integrate-with-log-analytics).
    - [View costs at the endpoint and deployment level](how-to-view-online-endpoints-costs.md)

- Managed identity
    -  Use managed identities to access secured resources from scoring script

## What are batch endpoints (preview)?

**Batch endpoints** are endpoints that are used to perform inferencing on large volumes of data over a period of time. **Batch endpoints** run jobs asynchronously and store their output to a data store.

### No-code MLFlow deployments

Use [MLFlow tracking](how-to-use-mlflow.md) to dramatically streamline deployment to batch endpoints with the no-code deployment experience.  

For batch endpoints using MLFlow models, you need to specify the following:
- Model files (or specify a registered model in your workspace)
- Compute target

However, if you are **not** deploying an MLFlow model, you need to provide additional requirements:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute target

### Compute autoprovisioning and job-based scaling

Batch endpoints handle requests using an asynchronous job-based system. As a result, Azure Machine Learning can automatically provision and teardown compute resources whenever a job is submitted, so you only pay for compute when you're using it.

The job-based structure also lets you scale instance count, mini batch size, and other scaling settings for each individual batch scoring job.

### Flexible data sources and storage

Use the following data locations when submitting a batch job:

- Azure Machine Learning registered datasets - for more information, see [Create Azure Machine Learning datasets]()
- Cloud data -  Either a public data URI or data path in datastore. For more information, see [Connect to data with the Azure Machine Learning studio](how-to-connect-data-ui.md)
- Data stored locally

> [!NOTE]
> For registered datasets, only FileDatasets are supported in preview.

Specify the storage output location to any datastore and path. By default, batch endpoints store their output to the workspace's default blob store, organized by the Job Name (a system-generated GUID).

### Multiple developer interfaces

Create and manage your batch endpoints with multiple developer tools:
- CLI
- ARM/REST API
- Azure Machine Learning studio web portal
- Azure portal (IT/Admin)
- Support for CI/CD MLOps pipelines using the CLI interface & REST/ARM interfaces

### Security

- Authentication: Azure Active Directory Tokens
- Managed identity: System assigned
- SSL by default for endpoint invocation

## Next steps

- [How to deploy managed online endpoints with the Azure CLI]()
- [How to deploy batch endpoints with the Azure CLI]()
- [How to use managed online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view online endpoint costs](how-to-view-online-endpoints-costs.md)
