---
title: What are online endpoints?
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning uses online endpoints to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.custom: devplatv2
ms.date: 04/01/2023
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# Online endpoints

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

After you train a machine learning model, you need to deploy it so that others can consume its predictions. Such execution mode of a model is called *inference*. Azure Machine Learning uses the concept of [endpoints and deployments](concept-endpoints.md) for machine learning models inference.

**Online endpoints** are endpoints that are used for online (real-time) inferencing. They deploy models under a web server that can return predictions under the HTTP protocol.

The following diagram shows an online endpoint that has two deployments, 'blue' and 'green'. The blue deployment uses VMs with a CPU SKU, and runs version 1 of a model. The green deployment uses VMs with a GPU SKU, and uses version 2 of the model. The endpoint is configured to route 90% of incoming traffic to the blue deployment, while green receives the remaining 10%.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

## Online deployments requirements

To create an online endpoint, you need to specify the following elements:

- Model to deploy
- Scoring script - code needed to do scoring/inferencing
- Environment - a Docker image with Conda dependencies, or a dockerfile 
- Compute instance & scale settings 

Learn how to deploy online endpoints from the [CLI/SDK](how-to-deploy-online-endpoints.md) and the [studio web portal](how-to-use-managed-online-endpoint-studio.md).

## Test and deploy locally for faster debugging

Deploy locally to test your endpoints without deploying to the cloud. Azure Machine Learning creates a local Docker image that mimics the Azure Machine Learning image. Azure Machine Learning will build and run deployments for you locally, and cache the image for rapid iterations.

## Native blue/green deployment 

Recall, that a single endpoint can have multiple deployments. The online endpoint can do load balancing to give any percentage of traffic to each deployment.

Traffic allocation can be used to do safe rollout blue/green deployments by balancing requests between different instances.

> [!TIP]
> A request can bypass the configured traffic load balancing by including an HTTP header of `azureml-model-deployment`. Set the header value to the name of the deployment you want the request to route to.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments.":::

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

Traffic to one deployment can also be mirrored (or copied) to another deployment. Mirroring traffic (also called shadowing) is useful when you want to test for things like response latency or error conditions without impacting live clients; for example, when implementing a blue/green deployment where 100% of the traffic is routed to blue and 10% is mirrored to the green deployment. With mirroring, the results of the traffic to the green deployment aren't returned to the clients but metrics and logs are collected. Testing the new deployment with traffic mirroring/shadowing is also known as [shadow testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/shadow-testing/), and the functionality is currently a __preview__ feature.

:::image type="content" source="media/concept-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing an endpoint mirroring traffic to a deployment.":::

Learn how to [safely rollout to online endpoints](how-to-safely-rollout-online-endpoints.md).

## Application Insights integration

All online endpoints integrate with Application Insights to monitor SLAs and diagnose issues. 

However [managed online endpoints](#managed-online-endpoints-vs-kubernetes-online-endpoints) also include out-of-box integration with Azure Logs and Azure Metrics.

## Security

- Authentication: Key and Azure Machine Learning Tokens
- Managed identity: User assigned and system assigned
- SSL by default for endpoint invocation

## Autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed endpoints support autoscaling through integration with the [Azure monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md) feature. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination.

:::image type="content" source="media/concept-endpoints/concept-autoscale.png" alt-text="Screenshot showing that autoscale flexibly provides between min and max instances, depending on rules.":::

## Visual Studio Code debugging

Visual Studio Code enables you to interactively debug endpoints.

:::image type="content" source="media/concept-endpoints/visual-studio-code-full.png" alt-text="Screenshot of endpoint debugging in VS Code." lightbox="media/concept-endpoints/visual-studio-code-full.png" :::

## Private endpoint support

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
| **Mirrored traffic**          | [Supported](how-to-safely-rollout-online-endpoints.md#test-the-deployment-with-mirrored-traffic)                                 | Unsupported                                                                                                             |
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

## Next steps

- [How to deploy online endpoints with the Azure CLI and Python SDK](how-to-deploy-online-endpoints.md)
- [How to deploy batch endpoints with the Azure CLI and Python SDK](batch-inference/how-to-use-batch-endpoint.md)
- [How to use online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view managed online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
