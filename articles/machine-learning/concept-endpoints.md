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

Azure Machine Learning endpoints help streamline model deployments by providing a unified interface to invoke and manage model deployments.

In this article, you learn about:
> [!div class="checklist"]
> * Endpoints
> * Deployments
> * Managed online endpoints
> * AKS online endpoints
> * Batch inference endpoints

## What are endpoints and deployments?

After you train a machine learning model, you need to deploy the model so that others can use it to perform inferencing. In Azure Machine Learning, you can use **Endpoints** and **Deployments** to do so.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments":::

An **Endpoint** is an HTTPS endpoint that clients can invoke to receive the inferencing output of trained models. It provides: 
- Authentication using 'key & token' based auth 
- SSL termination 
- Traffic allocation between deployments 
- A stable scoring URI (endpoint-name.region.inference.ml.azure.com for online endpoints, and an ARM URI for batch)


A **Deployment** is a set of compute resources hosting the model that performs the actual inferencing. It contains: 
- Model details (code, model, environment) 
- Compute resource and scale settings 
- Advanced settings (like request and probe settings)

A single endpoint can contain multiple deployments. Endpoints and deployments are independent ARM resources that will appear in the Azure portal.

Azure Machine Learning uses the concept of endpoints and deployments to implement different types of endpoints: **online endpoints** and **batch endpoints**.

## What are online endpoints?

**Online endpoints** are endpoints that are used for online (real-time) inferencing. Compared to **batch endpoints**, **online endpoints** contain **deployments** that are ready to receive data from clients and can send responses back in real-time.

### Online endpoints requirements

To create an online endpoint, you need to specify the following:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance & scale settings 

Learn how to deploy online endpoints from the CLI, ARM/REST, and the studio web portal.

### Monitoring and cost management

All online endpoints have native integration with Application Insights to monitor SLAs and diagnose issues. [Managed online endpoints](#managed-online-endpoints-vs-AKS-online-endpoints) also include native integration with Azure Logs and Azure Metrics.

You can also use the Azure portal to easily view cost at the endpoint level.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/view-endpoint-costs.png" alt-text="Screenshot showing the costs for a single endpoint":::

### Local endpoint for debugging

Deploy and test in a local Docker environment. Debugging in a local docker environment using local endpoints.

### Security

Authentication: Key and Azure ML Token
Managed identity: User assigned and system assigned
SSL by default for endpoint invocation

### Multiple developer interfaces

CLI
ARM/REST API
Azure Machine Learning studio web portal
Azure Portal (IT/Admin)

Support for CI/CD MLOps pipelines using the CLI interface & REST/ARM interfaces

### Native blue/green deployment

Recall, that a single endpoint can have multiple deployments. Although client applications can specify a deployment using request parameters to a single endpoint, the online endpoint can also perform load balancing to allocate any percentage of traffic to each deployment.

Traffic allocation can be used to perform safe rollout blue/green deployments by balancing requests between different instances.

### Benefits of online endpoints

Online endpoints let you deploy machine learning models and provide the following benefits:
- Safe rollout with native support for blue/green deployment 
- Debugging in a local docker environment using local endpoints
- Integration with Application Insights to monitor and diagnose issues  
- Support for CI/CD MLOps pipelines using the CLI interface & REST/ARM interfaces

## Managed online endpoints vs AKS online endpoints

There are two types of online endpoints: **managed online endpoints** and **AKS online endpoints**. The following table highlights some of their key differences.

|  | Managed online endpoints | AKS online endpoints |
|-|-|-|
| **Recommended users** | Users who want a managed model deployment and enhanced MLOps experience | Users who prefer Azure Kubernetes Service (AKS) and can manage infrastructure requirements |
| **Infrastructure management** | Managed compute provisioning, scaling, host OS image updates, and security hardening | Manual configuration |
| **Compute type** | Managed (AmlCompute) | AKS |
| **Logs and monitoring** | [Azure Logs](how-to-deploy-managed-online-endpoints.md#optional-integrate-with-log-analytics), [Azure Monitoring](how-to-monitor-online-endpoints.md), & AppInsights integration | AppInsights integration, manual setup for other monitoring and logging |
| **Managed identity** | [Supported](tutorial-deploy-managed-endpoints-using-system-managed-identity.md) | Not supported |
| **Virtual Network (VNET)** | Not supported (public preview) | Manually configure at cluster level |
| **View costs** | [Endpoint level](how-to-view-online-endpoints-costs.md) | Cluster level? |

### Managed online endpoints

Managed online endpoints can help streamline your deployment process compared to AKS online endpoints:

- Managed infrastructure
    - Automatically provisioning the compute and hosting the model (you just need to specify the VM type and scale settings) 
    - Automatically perform updates and patches to the underlying host OS image
    - Automatic node recovery incase of system failure.

- Monitoring and logs
    - Monitor model availability, performance and SLA using native integration with Azure Monitor. [link] 
    - Debug deployments using the logs and native integration with Azure Log Analytics.
    - View costs at endpoint/deployment level [link] 

- Managed identity
    -  Use managed identities to access secured resources from scoring script [link] 

## Batch endpoint

**Batch endpoints** are endpoints that are used to perform inferencing on large volumes of data over a period of time. Compared to **online endpoints**, **batch endpoints** run jobs asynchronously and store their output to a data store. The input data is also referenced to a storage location, rather than sent as a payload with the request.

### Batch endpoints requirements

For batch endpoints, you need to specify the following:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute target

However, if you are deploying an MLFlow model, some requirements are automatically fulfilled. Deploying an MLFlow model requires the following:
- Model files (or specify a registered model in your workspace)
- Compute target

### Invoking a batch endpoint

#### Data sources
To invoke a batch endpoint, you need to provide a location to the input data. Batch endpoints support the following data sources:
- Azure Machine Learning registered dataset
- Data in the cloud, with a public URI or datastore path
- Locally stored data

> [!NOTE]
> Currently, only FileDatasets are supported.


### Traffic allocation

Recall, that a single endpoint can have multiple deployments. **Batch endpoints** unlike **online endpoints** cannot split traffic across multiple deployments. **Batch endpoints** can only have a single active deployment, marked as `(Default)`.




## Next steps

tk