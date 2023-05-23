---
title: Use endpoints for inference
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning endpoints to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: devplatv2
ms.date: 02/07/2023
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# Use endpoints for inference

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

After you train a machine learning model or a machine learning pipeline, you need to deploy them so others can consume their predictions. Such execution mode is called *inference*. Azure Machine Learning uses the concept of __endpoints and deployments__ for machine learning inference.

Endpoints and deployments are two constructs that allow you to decouple the interface of your production workload from the implementation that serves it. 

## Intuition

Let's imagine you are working on an application that needs to predict the type and color of a car given its photo. The application only needs to know that they make an HTTP request to a URL using some sort of credentials, provide a picture of a car, and they get the type and color of the car back as string values. This thing we have just described is __an endpoint__.

:::image type="content" source="media/concept-endpoints/concept-endpoint.png" alt-text="A diagram showing the concept of an endpoint.":::

Now, let's imagine that one data scientist, Alice, is working on its implementation. Alice is  well versed on TensorFlow so she decided to implement the model using a Keras sequential classifier with a RestNet architecture she consumed from TensorFlow Hub. She tested the model and she is happy with the results. She decides to use that model to solve the car prediction problem. Her model is large in size, it would require 8GB of memory with 4 cores to run it. This thing we have just described is __a deployment__.

:::image type="content" source="media/concept-endpoints/concept-deployment.png" alt-text="A diagram showing the concept of a deployment.":::

Finally, let's imagine that after running for a couple of months, the organization discovers that the application performs poorly on images with no ideal illumination conditions. Bob, another data scientist, knows a lot about data argumentation techniques that can be used to help the model build robustness on that factor. However, he feels more comfortable using Torch rather than TensorFlow. He trained another model then using those techniques and he's happy with the results. He would like to try this model on production gradually until the organization is ready to retire the old one. His model shows better performance when deployed to GPU, so he needs one to the deployment. We have just described __another deployment under the same endpoint__.

:::image type="content" source="media/concept-endpoints/concept-deployment-routing.png" alt-text="A diagram showing the concept of an endpoint with multiple deployments.":::

## Endpoints and deployments

An **endpoint**, is a stable and durable URL that can be used to request or invoke the model, provide the required inputs, and get the outputs back. An endpoint provides:

- a stable and durable URL (like endpoint-name.region.inference.ml.azure.com).
- An authentication and authentication mechanism.

A **deployment** is a set of resources required for hosting the model or component that does the actual inferencing. A single endpoint can contain multiple deployments which can host independent assets and consume different resources based on what the actual assets require. Endpoints have a routing mechanism that can route the request generated for the clients to specific deployments under the endpoint.

To function properly, __each endpoint needs to have at least one deployment__. Endpoints and deployments are independent Azure Resource Manager resources that appear in the Azure portal.

## Online and batch endpoints

Azure Machine Learning allows you to implement [online endpoints](concept-endpoints-online.md) and [batch endpoints](concept-endpoints-batch.md). Online endpoints are designed for real-time inference so the results are returned in the response of the invocation. Batch endpoints, on the other hand, are designed for long-running batch inference so each time you invoke the endpoint you generate a batch job that performs the actual work.

### When to use what

Use [online endpoints](concept-endpoints-online.md) to operationalize models for real-time inference in synchronous low-latency requests. We recommend using them when:

> [!div class="checklist"]
> * You have low-latency requirements.
> * Your model can answer the request in a relatively short amount of time.
> * Your model's inputs fit on the HTTP payload of the request.
> * You need to scale up in term of number of request.

Use [batch endpoints](concept-endpoints-batch.md) to operationalize models or pipelines (preview) for long-running asynchronous inference. We recommend using them when:

> [!div class="checklist"]
> * You have expensive models or pipelines that require a longer time to run.
> * You want to operationalize machine learning pipelines and reuse components.
> * You need to perform inference over large amounts of data, distributed in multiple files.
> * You don't have low latency requirements.
> * Your model's inputs are stored in a Storage Account or in an Azure Machine Learning data asset.
> * You can take advantage of parallelization.

### Comparison

Both online and batch endpoints are based on the idea of endpoints and deployments, which help you transition easily from one to the other. However, when moving from one to another, there are some differences that are important to take into account. Some of these differences are due to the nature of the work:

#### Endpoints

The following table shows a summary of the different features in Online and Batch endpoints.

| Feature                               | [Online Endpoints](concept-endpoints-online.md) | [Batch endpoints](concept-endpoints-batch.md) |
|---------------------------------------|-------------------------------------------------|-----------------------------------------------|
| Stable invocation URL                 | Yes                                             | Yes                                           |
| Multiple deployments support          | Yes                                             | Yes                                           |
| Deployment's routing                  | Traffic split                                   | Switch to default                             |
| Mirror traffic to all deployment      | Yes                                             | No                                            |
| Swagger support                       | Yes                                             | No                                            |
| Authentication                        | Key and token                                   | Azure AD                                      |
| Private network support               | Yes                                             | Yes                                           |
| Managed network isolation<sup>1</sup> | Yes                                             | No                                            |
| Customer-managed keys                 | Yes                                             | No                                            |

<sup>1</sup> [*Managed network isolation*](how-to-secure-online-endpoint.md) allows managing the networking configuration of the endpoint independently from the Azure Machine Learning workspace configuration.

#### Deployments

The following table shows a summary of the different features in Online and Batch endpoints at the deployment level. These concepts apply per each deployment under the endpoint.

| Feature                       | [Online Endpoints](concept-endpoints-online.md) | [Batch endpoints](concept-endpoints-batch.md) |
|-------------------------------|-------------------------------------------------|-----------------------------------------------|
| Deployment's types            | Models                                          | Models and Pipeline components (preview)      |
| MLflow model's deployment     | Yes (requires public networking)                | Yes                                           |
| Custom model's deployment     | Yes, with scoring script                        | Yes, with scoring script                      |
| Inference server <sup>1</sup> | - Azure Machine Learning Inferencing Server<br /> - Triton<br /> - Custom (using BYOC)  | Batch Inference        |
| Compute resource consumed     | Instances or granular resources                 | Cluster instances                             |
| Compute type                  | Managed compute and Kubernetes                  | Managed compute and Kubernetes                |
| Low-priority compute          | No                                              | Yes                                           |
| Scales compute to zero        | No                                              | Yes                                           |
| Autoscale compute<sup>2</sup> | Yes, based on resources' load                   | Yes, based on jobs count                      |
| Overcapacity management       | Throttling                                      | Queuing                                       |
| Test deployments locally      | Yes                                             | No                                            |

<sup>1</sup> *Inference server* makes reference to the serving technology that takes request, process them, and creates a response. The inference server also dictates the format of the input and the expected outputs.

<sup>2</sup> *Autoscale* makes reference to the ability of dynamically scaling up or down the deployment's allocated resources based on its load. Online and Batch Deployments use different strategies. While online deployments scale up and down based on the resource utilization (like CPU, memory, requests, etc.), batch endpoints scale up or down based on the number of jobs created.

## Developer interfaces

Endpoints are designed to help organization operationalize production level workloads in Azure Machine Learning. They're robust, and scalable resources and they provide the best of the capabilities to implement MLOps workflows. 

Create and manage batch and online endpoints with multiple developer tools:

- The Azure CLI and the Python SDK
- Azure Resource Manager/REST API
- Azure Machine Learning studio web portal
- Azure portal (IT/Admin)
- Support for CI/CD MLOps pipelines using the Azure CLI interface & REST/ARM interfaces


## Next steps

- [How to deploy online endpoints with the Azure CLI and Python SDK](how-to-deploy-online-endpoints.md)
- [How to deploy models with batch endpoints](how-to-use-batch-model-deployments.md)
- [How to deploy pipelines with batch endpoints (preview)](how-to-use-batch-pipeline-deployments.md)
- [How to use online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
