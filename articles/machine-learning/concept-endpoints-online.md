---
title: What are online endpoints?
titleSuffix: Azure Machine Learning
description: Learn about online endpoints for real-time inference in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: devplatv2
ms.date: 04/01/2023
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# Online endpoints and deployments for real-time inference

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to perform real-time inferencing on data by using models that are deployed to _online endpoints_. Inferencing is the process of applying new input data to the machine learning model to generate outputs. While these outputs are typically referred to as "predictions," inferencing can be used to generate outputs for other machine learning tasks, such as classification and clustering.

## Online endpoints

**Online endpoints** deploy models to a web server that can return predictions under the HTTP protocol. Use online endpoints to operationalize models for real-time inference in synchronous low-latency requests. We recommend using them when:

> [!div class="checklist"]
> * You have low-latency requirements.
> * Your model can answer the request in a relatively short amount of time.
> * Your model's inputs fit on the HTTP payload of the request.
> * You need to scale up in terms of number of requests.

To define an endpoint, you need to specify:

- **Endpoint name**: This name must be unique in the Azure region. For more information on the naming rules, see [managed online endpoint limits](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).
- **Authentication mode**: You can choose between key-based authentication mode and Azure Machine Learning token-based authentication mode for the endpoint. A key doesn't expire, but a token does expire. For more information on authenticating, see [Authenticate to an online endpoint](how-to-authenticate-online-endpoint.md).

## Online deployments

A **deployment** is a set of resources and computes required for hosting the model that does the actual inferencing. A single endpoint can contain multiple deployments with different configurations. This setup helps to _decouple the interface_ presented by the endpoint from _the implementation details_ present in the deployment. An online endpoint has a routing mechanism that can direct requests to specific deployments in the endpoint.

The following diagram shows an online endpoint that has two deployments, _blue_ and _green_. The blue deployment uses VMs with a CPU SKU, and runs version 1 of a model. The green deployment uses VMs with a GPU SKU, and runs version 2 of the model. The endpoint is configured to route 90% of incoming traffic to the blue deployment, while the green deployment receives the remaining 10%.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

The following table describes the key attributes of a deployment:

| Attribute      | Description                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name           | The name of the deployment.                                                                                                                                                                                                                                                                                                                                                                    |
| Endpoint name  | The name of the endpoint to create the deployment under.                                                                                                                                                                                                                                                                                                                                       |
| Model          | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.                                                                                                                                                                                                                                    |
| Code path      | The path to the directory on the local development environment that contains all the Python source code for scoring the model. You can use nested directories and packages.                                                                                                                                                                                                                    |
| Scoring script | The relative path to the scoring file in the source code directory. This Python code must have an `init()` function and a `run()` function. The `init()` function will be called after the model is created or updated (you can use it to cache the model in memory, for example). The `run()` function is called at every invocation of the endpoint to do the actual scoring and prediction. |
| Environment    | The environment to host the model and code. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification.                                                                                                                                                                                                                 |
| Instance type  | The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).                                                                                                                                                                                                                            |
| Instance count | The number of instances to use for the deployment. Base the value on the workload you expect. For high availability, we recommend that you set the value to at least `3`. We reserve an extra 20% for performing upgrades. For more information, see [managed online endpoint quotas](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).                                |

To learn how to deploy online endpoints using the CLI, SDK, studio, and ARM template, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md).

## Code and no-code options for model deployment

Azure Machine Learning supports model deployment to online endpoints for coders and noncoders alike, by providing options for _no-code deployment_, _low-code deployment_, and _Bring Your Own Container (BYOC) deployment_.

**No-code model deployment** provides out-of-box inferencing for common frameworks (for example, scikit-learn, TensorFlow, PyTorch, and ONNX) via MLflow and Triton. For no-code deployment, Azure Machine Learning requires that you provide:
- A model folder or the name and version of the model, if it's already registered in your workspace. This model folder should contain:
    - ML model file connecting assets/schema for MLflow
    - model files
    - `conda.yaml` file that specifies the code environment
- Settings to specify the instance type and scaling capacity

In turn, Azure Machine Learning ​does the following:
- Dynamically installs Python packages provided in the `conda.yaml` file during container runtime.
- Provides an MLflow base image/curated environment that includes a scoring script to use for inferencing.

To learn more about no-code deployment for MLflow models, see [Deploy MLflow models to online endpoints](/azure/machine-learning/how-to-deploy-mlflow-models-online-endpoints).

### Low-code model deployment

**Low-code model deployment** allows you to provide minimal code along with your ML model for deployment. For low-code deployment, Azure Machine Learning requires that you provide:
- Model assets or the name and version of registered assets in your workspace. These assets should include:
    - model files
    - an Azure Machine Learning environment in which the model runs: either a Docker image with conda dependencies, or a dockerfile​
    - scoring script to use for inferencing​, that is, code that executes the model on a given input request. The scoring script receives data submitted to a deployed web service and passes it to the model. The script then executes the model and returns its response to the client. The scoring script is specific to your model and must understand the data that the model expects as input and returns as output.
- Settings to specify the instance type and scaling capacity

In turn, Azure Machine Learning uses the model assets you specified to create the container that runs in our managed infrastructure, providing all platform features of a managed online endpoint.​ ​To learn more about low-code deployment for ML models, see [Deploy an ML model with an online endpoint](/azure/machine-learning/how-to-deploy-online-endpoints).

**Bring Your Own Container (BYOC) deployment** lets you virtually bring any containers to run your online endpoint. You can use all the Azure Machine Learning platform features such as autoscaling, GitOps, debugging, and safe rollout to manage your MLOps pipelines​. For BYOC deployment, Azure Machine Learning requires that you provide:
- an accessible container image location (for example, docker.io, Azure Container Registry (ACR), or Microsoft Container Registry (MCR)) or a Dockerfile that you can build/push with ACR​ for your container
- Port and route path info for:​
    - liveness (to check if server is running)​
    - readiness (to check if model is loaded)​
    - scoring (send scoring data here)

In turn, Azure Machine Learning provides all the platform features for communicating with your container. To learn how to deploy with custom containers, see [Use a custom container to deploy a model to an online endpoint](/azure/machine-learning/how-to-deploy-custom-container).

The following table summarizes key points about deployment options to online endpoints:

|         |Summary  |Custom code  |Custom dependencies  |Custom base image    |
|---------|---------|---------|---------|---------|
|No-code  | Uses out-of-box inferencing for popular frameworks such as scikit-learn, TensorFlow, PyTorch, and ONNX via MLflow and Triton. | No | No | No |
|Low-code | Uses secure, publicly published [curated images](/azure/machine-learning/resource-curated-environments) for popular frameworks. You provide scoring script and/or Python dependencies.        |  Yes, bring your scoring script.     |   Yes, bring an Azure Machine Learning environment in which the model runs: either a Docker image with conda dependencies, or a dockerfile​.      |    No     |
|BYOC     | You provide your complete stack via Azure Machine Learning's support for [custom images](/azure/machine-learning/how-to-deploy-custom-container?view=azureml-api-2&tabs=cli).       |  Yes, bring your scoring script.       |    Yes     |    Yes, bring an accessible container image location (for example, docker.io, Azure Container Registry (ACR), or Microsoft Container Registry (MCR)) or a Dockerfile that you can build/push with ACR​ for your container.    |

> [!NOTE]
> AutoML runs create a scoring script and dependencies automatically for users, so you can deploy any AutoML model without authoring additional code (for no-code deployment) or you can modify auto-generated scripts to your business needs (for low-code deployment).​ To learn how to deploy with AutoML models, see [Deploy an AutoML model with an online endpoint](/azure/machine-learning/how-to-deploy-automl-endpoint).

## Local deployment and Visual Studio Code debugging

You can deploy an endpoint locally to test it without having to deploy to the cloud. Azure Machine Learning creates a local Docker image that mimics the Azure Machine Learning image. Azure Machine Learning will build and run deployments for you locally and cache the image for rapid iterations.

Azure Machine Learning local endpoints use Docker and VS Code development containers (dev containers) to build and configure a local debugging environment. With dev containers, you can take advantage of VS Code features, such as interactive debugging, from inside a Docker container.

:::image type="content" source="media/concept-endpoints/visual-studio-code-full.png" alt-text="Screenshot of endpoint debugging in VS Code." lightbox="media/concept-endpoints/visual-studio-code-full.png" :::

To interactively debug online endpoints in VS Code, see [Debug online endpoints locally in Visual Studio Code](/azure/machine-learning/how-to-debug-managed-online-endpoints-visual-studio-code).

## Traffic routing and mirroring to online deployments

Recall that a single online endpoint can have multiple deployments. As the endpoint receives incoming traffic (or requests), it can route percentages of traffic to each deployment, as used in the native blue/green deployment strategy. It can also mirror (or copy) traffic from one deployment to another, also called traffic mirroring or shadowing.

### Traffic routing for blue/green deployment

Blue/green deployment is a deployment strategy that allows you to roll out a new deployment (the green deployment) to a small subset of users or requests before rolling it out completely. The endpoint can implement load balancing to allocate certain percentages of the traffic to each deployment, with the total allocation across all deployments adding up to 100%.

> [!TIP]
> A request can bypass the configured traffic load balancing by including an HTTP header of `azureml-model-deployment`. Set the header value to the name of the deployment you want the request to route to.

The following image shows settings in Azure Machine Learning studio for allocating traffic between a blue and green deployment.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments.":::

This traffic allocation routes traffic as shown in the following image, with 10% of traffic going to the green deployment, and 90% of traffic going to the blue deployment.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments.":::

### Traffic mirroring to online deployments

The endpoint can also mirror (or copy) traffic from one deployment to another deployment. Traffic mirroring (also called [shadow testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/shadow-testing/)) is useful when you want to test a new deployment with production traffic without impacting the results that customers are receiving from existing deployments. For example, when implementing a blue/green deployment where 100% of the traffic is routed to blue and 10% is _mirrored_ to the green deployment, the results of the mirrored traffic to the green deployment aren't returned to the clients, but the metrics and logs are recorded.

:::image type="content" source="media/concept-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing an endpoint mirroring traffic to a deployment.":::

To learn how to use traffic mirroring, see [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md).

## Managed online endpoints vs Kubernetes online endpoints

There are two types of online endpoints: _managed online endpoints_ and _Kubernetes online endpoints_. 

**Managed online endpoints** help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure.

**Kubernetes online endpoints** allow you to deploy models and serve online endpoints at your fully configured and managed [Kubernetes cluster anywhere](./how-to-attach-kubernetes-anywhere.md), with CPUs or GPUs.

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
    - Automatically performs node recovery if there's a system failure

- Monitoring and logs
    - Monitor model availability, performance, and SLA using [native integration with Azure Monitor](how-to-monitor-online-endpoints.md).
    - Debug deployments using the logs and native integration with [Azure Log Analytics](/azure/azure-monitor/logs/log-analytics-overview).

    :::image type="content" source="media/concept-endpoints/log-analytics-and-azure-monitor.png" alt-text="Screenshot showing Azure Monitor graph of endpoint latency.":::

- View costs 
    - Managed online endpoints let you [monitor cost at the endpoint and deployment level](how-to-view-online-endpoints-costs.md)
    
    :::image type="content" source="media/concept-endpoints/endpoint-deployment-costs.png" alt-text="Screenshot cost chart of an endpoint and deployment.":::

    > [!NOTE]
    > Managed online endpoints are based on Azure Machine Learning compute. When using a managed online endpoint, you pay for the compute and networking charges. There is no additional surcharge.
    >
    > If you use a virtual network and secure outbound (egress) traffic from the managed online endpoint, there is an additional cost. For egress, three private endpoints are created _per deployment_ for the managed online endpoint. These are used to communicate with the default storage account, Azure Container Registry, and workspace. Additional networking charges may apply. For more information on pricing, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

To learn how to deploy to a managed online endpoint, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md).

## More capabilities of online endpoints in Azure Machine Learning

### Application Insights integration

All online endpoints integrate with Application Insights to monitor SLAs and diagnose issues. 

However [managed online endpoints](#managed-online-endpoints) also include out-of-box integration with Azure Logs and Azure Metrics.

### Security

- Authentication: Key and Azure Machine Learning Tokens
- Managed identity: User assigned and system assigned
- SSL by default for endpoint invocation

### Autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed endpoints support autoscaling through integration with the [Azure monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md) feature. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination.

:::image type="content" source="media/concept-endpoints/concept-autoscale.png" alt-text="Screenshot showing that autoscale flexibly provides between min and max instances, depending on rules.":::

To learn how to configure autoscaling, see [How to autoscale online endpoints](how-to-autoscale-endpoints.md).

### Private endpoint support

Optionally, you can secure communication with a managed online endpoint by using private endpoints.

You can configure security for inbound scoring requests and outbound communications with the workspace and other services separately. Inbound communications use the private endpoint of the Azure Machine Learning workspace. Outbound communications use private endpoints created per deployment.

For more information, see [Secure online endpoints](how-to-secure-online-endpoint.md).

### Managed network isolation

### Monitoring online endpoints and deployments

## Next steps

- [How to deploy online endpoints with the Azure CLI and Python SDK](how-to-deploy-online-endpoints.md)
- [How to deploy batch endpoints with the Azure CLI and Python SDK](batch-inference/how-to-use-batch-endpoint.md)
- [How to use online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view managed online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
