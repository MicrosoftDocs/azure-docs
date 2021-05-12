---
title: What are endpoints
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning endpoints to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sethur
author: rsethur
ms.reviewer: laobri
ms.date: 05/25/2021
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# Azure Machine Learning endpoints

Azure Machine Learning endpoints help streamline model deployments by providing a unified interface to invoke and manage model deployments.

In this article, you learn about:
> [!div class="checklist"]
> * Endpoints
> * Deployments
>
> And the different types of endpoints:
> * Managed online endpoints
> * AKS online endpoints
> * Batch inference endpoints

## What are endpoints and deployments

After you train a machine learning model, you need to deploy the model so that others can use it to perform inferencing. In Azure Machine Learning, you can use **Endpoints** and **Deployments** to do so.

:::image type="content" source="media/concept-managed-endpoints/endpoint-concept1.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments":::

An **Endpoint** is an HTTPS endpoint that clients can send data to and receive the inferencing output of trained models. It provides: 
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

## Online endpoints

**Online endpoints** are endpoints that are used for online (real-time) inferencing. They contain **deployments** that are ready to receive data from clients and can send responses back in real-time.

For an online endpoint, you need to specify the following:
- Model files (or specify a registered model in your workspace) 
- Scoring script - code needed to perform scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance SKU & scale settings 

Learn how to deploy online endpoints from the CLI, ARM/REST, and the studio web portal.

### Benefits of online endpoints

Azure Machine Learning online endpoints provide the following benefits:
- Safe rollout with native support for blue/green deployment 
- Debugging in a local docker environment using local endpoints
- Integration with Application Insights to monitor and diagnose issues  
- Support for CI/CD MLOps pipelines using the CLI interface & REST/ARM interfaces

### Traffic allocation

Recall, that a single online endpoint can have multiple deployments. Although client applications can specify a deployment using request parameters to the same endpoint, the endpoint can also perform load balancing to allocate any percentage of traffic to each deployment.

Traffic allocation can be used to perform blue/green deployment by balancing requests between different instances of a deployment.

## Managed online endpoints vs AKS online endpoints

There are two types of online endpoints: **managed online endpoints** and **AKS online endpoints**. The following table highlights some of their key differences.

| | Recommended users | Infrastructure management | Compute type | Logs and monitoring | Managed identity| Virtual Network (VNET) |
|-|-|-|-|-|-|-|
| **Managed online endpoints** | Users who want a managed model deployment and MLOps experience | Managed compute provisioning, scaling, updates, and security hardening |  AmlCompute | Azure Logs & Azure Monitoring integration| Supported | Not supported |
| **AKS online endpoints** | Users who prefer Azure Kubernetes Service (AKS) and can manage infrastructure requirements | Manual configuration |  AKS  | Manual setup | Not supported | Manually configure at cluster level|

### Managed online endpoints

Managed online endpoints can help streamline your deployment process:

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

**Batch endpoints** are endpoints that are used to perform inferencing on large volumes of data over a period of time. Compared to **online endpoints**, **batch endpoints** run asynchronously and store their output to a data store.
 


## Next steps

tk