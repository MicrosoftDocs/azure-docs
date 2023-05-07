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

Now, let's imagine that one data scientists, Alice, is working on its implementation. Alice is  well versed on TensorFlow so she decided to implement the model using a Keras sequential classifier with a RestNet architecture she consumed from TensorFlow Hub. She tested the model and she is happy with the results. She decides to use that model to solve the car prediction problem. Her model is big in size, it would require 8GB of memory with 4 cores to run it. This thing we have just described is __a deployment__.

Finally, let's imagine that after running for a couple of months, the organization discovers that the application performs poorly on images with no ideal illumination conditions. Bob, another data scientist, knows a lot about data argumentation techniques that can be used to help the model build robustness on that factor. However, he feels more comfortable using Torch rather than TensorFlow. He trained another model then using those techniques and he is happy with the results. He would like to try this model on production gradually until the organization is ready to retire the old one. His model shows better performance when deployed to GPU, so he need one to the deployment. We have just described __another deployment under the same endpoint__.

## Endpoints and deployments

An **endpoint**, is a stable and durable URL that can be used to request or invoke the model, provide the required inputs, and get the outputs back. An endpoint provides:

- a stable and durable URL (like endpoint-name.region.inference.ml.azure.com).
- An authentication and authentication mechanism.

A **deployment** is a set of resources required for hosting the model or component that does the actual inferencing. A single endpoint can contain multiple deployments which can host independent assets and consume different resources based on what the actual assets require. Endpoints have a routing mechanism that can route the request generated for the clients to specific deployments under the endpoint.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

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
> * Your model's inputs are stored in an Storage Account or in an Azure Machine learning data asset.
> * You can take advantage of parallelization.

### Comparison

Both of online and batch endpoints use the same constructs, which help you transition easily from one to the other. However, there are some differences that are important to take into account. Some of these differences are due to the nature of the work:

#### Endpoints

| Feature                          | Online endpoints                 | Batch endpoints                |
|----------------------------------|----------------------------------|--------------------------------|
| Stable invocation URL            | Yes                              | Yes                            |
| Multiple deployments support     | Yes                              | Yes                            |
| Deployment's routing             | Traffic split                    | Switch to default              |
| Mirror traffic to all deployment | Yes                              | No                             |
| Swagger support                  | Yes                              | No                             |
| Authentication                   | Key and token                    | Azure AD                       |
| Private network support          | Yes                              | Yes                            |
| Network egress control           | Yes                              | No                             |
| Customer-managed keys            | Yes                              | No                             |

#### Deployments

| Feature                   | Online endpoints                 | Batch endpoints                          |
|---------------------------|----------------------------------|------------------------------------------|
| Deployment's types        | Models                           | Models and Pipeline components (preview) |
| MLflow model's deployment | Yes (requires public networking) | Yes                                      |
| Custom model's deployment | Yes, with scoring script         | Yes, with scoring script                 |
| Inference server          | - AzureML Inferencing Server<br /> - Triton<br /> - Custom (using BYOC)  | AzureML Batch   |
| Compute resource consumed | Instances or granular resources  | Cluster instances                        |
| Compute type              | AzureML and Kubernetes           | AzureML and Kubernetes                   |
| Scale compute to zero     | No                               | Yes                                      |
| Low-priority compute      | No                               | Yes                                      |
| Autoscale                 | Yes                              | No                                       |
| Test deployments locally  | Yes                              | No                                       |


## Developer interfaces

Endpoints are designed to help organization operationalize production level workloads in Azure Machine Learning. They are robust, and scalable resources and they provide the best of the capabilities to implement MLOps workflows. 

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
