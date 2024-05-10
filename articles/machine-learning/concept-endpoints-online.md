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
ms.date: 10/24/2023

#Customer intent: As an ML pro, I want to understand what an online endpoint is and why I need it.
---

# Online endpoints and deployments for real-time inference

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to perform real-time inferencing on data by using models that are deployed to _online endpoints_. Inferencing is the process of applying new input data to a machine learning model to generate outputs. While these outputs are typically referred to as "predictions," inferencing can be used to generate outputs for other machine learning tasks, such as classification and clustering.

## Online endpoints

**Online endpoints** deploy models to a web server that can return predictions under the HTTP protocol. Use online endpoints to operationalize models for real-time inference in synchronous low-latency requests. We recommend using them when:

> [!div class="checklist"]
> * You have low-latency requirements
> * Your model can answer the request in a relatively short amount of time
> * Your model's inputs fit on the HTTP payload of the request
> * You need to scale up in terms of number of requests

To define an endpoint, you need to specify:

- **Endpoint name**: This name must be unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).
- **Authentication mode**: You can choose from key-based authentication mode, Azure Machine Learning token-based authentication mode, or Microsoft Entra token-based authentication (preview) for the endpoint. For more information on authenticating, see [Authenticate to an online endpoint](how-to-authenticate-online-endpoint.md).

Azure Machine Learning provides the convenience of using **managed online endpoints** for deploying your machine learning models in a turnkey manner. This is the _recommended_ way to use online endpoints in Azure Machine Learning. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. These endpoints also take care of serving, scaling, securing, and monitoring your models, to free you from the overhead of setting up and managing the underlying infrastructure. 
To learn how to define a managed online endpoint, see [Define the endpoint](how-to-deploy-online-endpoints.md#define-the-endpoint).

### Why choose managed online endpoints over ACI or AKS(v1)?

Use of managed online endpoints is the _recommended_ way to use online endpoints in Azure Machine Learning. The following table highlights the key attributes of managed online endpoints compared to Azure Machine Learning SDK/CLI v1 solutions (ACI and AKS(v1)).

|Attributes  |Managed online endpoints (v2)  |ACI or AKS(v1)  |
|---------|---------|---------|
|Network security/isolation |Easy inbound/outbound control with quick toggle |Virtual network not supported or requires complex manual configuration |
|Managed service |- Fully managed compute provisioning/scaling​<br> - Network configuration for data exfiltration prevention​<br> - Host OS upgrade, controlled rollout of in-place updates |- Scaling is limited in v1<br> - Network configuration or upgrade needs to be managed by user |
|Endpoint/deployment concept |Distinction between endpoint and deployment enables complex scenarios such as safe rollout of models |No concept of endpoint |
|Diagnostics and Monitoring |- Local endpoint debugging possible with Docker and Visual Studio Code<br>​ - Advanced metrics and logs analysis with chart/query to compare between deployments​<br> - Cost breakdown down to deployment level |No easy local debugging |
|Scalability |Limitless, elastic, and automatic scaling |- ACI is non-scalable​ <br> - AKS (v1) supports in-cluster scale only and requires scalability configuration |
|Enterprise readiness |Private link, customer managed keys, Microsoft Entra ID, quota management, billing integration, SLA |Not supported |
|Advanced ML features |- Model data collection<br> - Model monitoring​<br> - Champion-challenger model, safe rollout, traffic mirroring<br> - Responsible AI extensibility |Not supported |

Alternatively, if you prefer to use Kubernetes to deploy your models and serve endpoints, and you're comfortable with managing infrastructure requirements, you can use _Kubernetes online endpoints_. These endpoints allow you to deploy models and serve online endpoints at your fully configured and managed [Kubernetes cluster anywhere](./how-to-attach-kubernetes-anywhere.md), with CPUs or GPUs.

### Why choose managed online endpoints over AKS(v2)?

Managed online endpoints can help streamline your deployment process and provide the following benefits over Kubernetes online endpoints:
- Managed infrastructure
    - Automatically provisions the compute and hosts the model (you just need to specify the VM type and scale settings) 
    - Automatically updates and patches the underlying host OS image
    - Automatically performs node recovery if there's a system failure

- Monitoring and logs
    - Monitor model availability, performance, and SLA using [native integration with Azure Monitor](how-to-monitor-online-endpoints.md).
    - Debug deployments using the logs and native integration with [Azure Log Analytics](../azure-monitor/logs/log-analytics-overview.md).

    :::image type="content" source="media/concept-endpoints/log-analytics-and-azure-monitor.png" alt-text="Screenshot showing Azure Monitor graph of endpoint latency." lightbox="media/concept-endpoints/log-analytics-and-azure-monitor.png":::

- View costs 
    - Managed online endpoints let you [monitor cost at the endpoint and deployment level](how-to-view-online-endpoints-costs.md)
    
    :::image type="content" source="media/concept-endpoints/endpoint-deployment-costs.png" alt-text="Screenshot cost chart of an endpoint and deployment." lightbox="media/concept-endpoints/endpoint-deployment-costs.png":::
    > [!NOTE]
    > Managed online endpoints are based on Azure Machine Learning compute. When using a managed online endpoint, you pay for the compute and networking charges. There is no additional surcharge. For more information on pricing, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
    >
    > If you use an Azure Machine Learning virtual network to secure outbound traffic from the managed online endpoint, you're charged for the Azure private link and FQDN outbound rules that are used by the managed virtual network. For more information, see [Pricing for managed virtual network](how-to-managed-network.md#pricing).

#### Managed online endpoints vs kubernetes online endpoints

The following table highlights the key differences between managed online endpoints and Kubernetes online endpoints.

|                               | Managed online endpoints                                                                                                          | Kubernetes online endpoints (AKS(v2))                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Recommended users**         | Users who want a managed model deployment and enhanced MLOps experience                                                           | Users who prefer Kubernetes and can self-manage infrastructure requirements                                             |
| **Node provisioning**         | Managed compute provisioning, update, removal                                                                                     | User responsibility                                                                                                     |
| **Node maintenance**          | Managed host OS image updates, and security hardening                                                                             | User responsibility                                                                                                     |
| **Cluster sizing (scaling)** | [Managed manual and autoscale](how-to-autoscale-endpoints.md), supporting additional nodes provisioning                                                             | [Manual and autoscale](how-to-kubernetes-inference-routing-azureml-fe.md#autoscaling), supporting scaling the number of replicas within fixed cluster boundaries                         |
| **Compute type**              | Managed by the service                                                                                                            | Customer-managed Kubernetes cluster (Kubernetes)                                                                        |
| **Managed identity**          | [Supported](how-to-access-resources-from-endpoints-managed-identities.md)                                                         | Supported                                                                                                               |
| **Virtual Network (VNET)**    | [Supported via managed network isolation](concept-secure-online-endpoint.md)                                                       | User responsibility                                                                                                     |
| **Out-of-box monitoring & logging** | [Azure Monitor and Log Analytics powered](how-to-monitor-online-endpoints.md) (includes key metrics and log tables for endpoints and deployments) | User responsibility                                                                        |
| **Logging with Application Insights (legacy)** | Supported                                                                                                        | Supported                                                                                                               |
| **View costs**                | [Detailed to endpoint / deployment level](how-to-view-online-endpoints-costs.md)                                                  | Cluster level                                                                                                           |
| **Cost applied to**          | VMs assigned to the deployments                                                                                                   | VMs assigned to the cluster                                                                                             |
| **Mirrored traffic**          | [Supported](how-to-safely-rollout-online-endpoints.md#test-the-deployment-with-mirrored-traffic)                                 | Unsupported                                                                                                             |
| **No-code deployment**        | Supported ([MLflow](how-to-deploy-mlflow-models-online-endpoints.md) and [Triton](how-to-deploy-with-triton.md) models)           | Supported ([MLflow](how-to-deploy-mlflow-models-online-endpoints.md) and [Triton](how-to-deploy-with-triton.md) models) |

## Online deployments

A **deployment** is a set of resources and computes required for hosting the model that does the actual inferencing. A single endpoint can contain multiple deployments with different configurations. This setup helps to _decouple the interface_ presented by the endpoint from _the implementation details_ present in the deployment. An online endpoint has a routing mechanism that can direct requests to specific deployments in the endpoint.

The following diagram shows an online endpoint that has two deployments, _blue_ and _green_. The blue deployment uses VMs with a CPU SKU, and runs version 1 of a model. The green deployment uses VMs with a GPU SKU, and runs version 2 of the model. The endpoint is configured to route 90% of incoming traffic to the blue deployment, while the green deployment receives the remaining 10%.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments." lightbox="media/concept-endpoints/endpoint-concept.png":::

To deploy a model, you must have:

- __Model files__ (or the name and version of a model that's already registered in your workspace).
- A __scoring script__, that is, code that executes the model on a given input request. The scoring script receives data submitted to a deployed web service and passes it to the model. The script then executes the model and returns its response to the client. The scoring script is specific to your model and must understand the data that the model expects as input and returns as output.
- An __environment__ in which your model runs. The environment can be a Docker image with Conda dependencies or a Dockerfile.
- Settings to specify the __instance type__ and __scaling capacity__.

### Key attributes of a deployment

The following table describes the key attributes of a deployment:

| Attribute      | Description                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name           | The name of the deployment.                                                                                                                                                                                                                                                                                                                                                                    |
| Endpoint name  | The name of the endpoint to create the deployment under.                                                                                                                                                                                                                                                                                                                                       |
| Model<sup>1</sup>   | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. For more information on how to track and specify the path to your model, see [Identify model path with respect to `AZUREML_MODEL_DIR`](#identify-model-path-with-respect-to-azureml_model_dir).                                                                                                                                                                                                                                    |
| Code path      | The path to the directory on the local development environment that contains all the Python source code for scoring the model. You can use nested directories and packages.                                                                                                                                                                                                                    |
| Scoring script | The relative path to the scoring file in the source code directory. This Python code must have an `init()` function and a `run()` function. The `init()` function will be called after the model is created or updated (you can use it to cache the model in memory, for example). The `run()` function is called at every invocation of the endpoint to do the actual scoring and prediction. |
| Environment<sup>1</sup>    | The environment to host the model and code. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. __Note:__ Microsoft regularly patches the base images for known security vulnerabilities. You'll need to redeploy your endpoint to use the patched image. If you provide your own image, you're responsible for updating it. For more information, see [Image patching](concept-environments.md#image-patching).                                                                                                                                                                                                            |
| Instance type  | The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).                                                                                                                                                                                                                            |
| Instance count | The number of instances to use for the deployment. Base the value on the workload you expect. For high availability, we recommend that you set the value to at least `3`. We reserve an extra 20% for performing upgrades. For more information, see [virtual machine quota allocation for deployments](#virtual-machine-quota-allocation-for-deployment).                                |

<sup>1</sup> Some things to note about the model and environment:

> - The model and container image (as defined in Environment) can be referenced again at any time by the deployment when the instances behind the deployment go through security patches and/or other recovery operations. If you use a registered model or container image in Azure Container Registry for deployment and remove the model or the container image, the deployments relying on these assets can fail when re-imaging happens. If you remove the model or the container image, ensure that the dependent deployments are re-created or updated with an alternative model or container image.
> - The container registry that the environment refers to can be private only if the endpoint identity has the permission to access it via Microsoft Entra authentication and Azure RBAC. For the same reason, private Docker registries other than Azure Container Registry are not supported.

To learn how to deploy online endpoints using the CLI, SDK, studio, and ARM template, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md).

### Identify model path with respect to `AZUREML_MODEL_DIR`

When deploying your model to Azure Machine Learning, you need to specify the location of the model you wish to deploy as part of your deployment configuration. In Azure Machine Learning, the path to your model is tracked with the `AZUREML_MODEL_DIR` environment variable. By identifying the model path with respect to `AZUREML_MODEL_DIR`, you can deploy one or more models that are stored locally on your machine or deploy a model that is registered in your Azure Machine Learning workspace.

For illustration, we reference the following local folder structure for the first two cases where you deploy a single model or deploy multiple models that are stored locally:

:::image type="content" source="media/how-to-deploy-online-endpoints/multi-models-1.png" alt-text="A screenshot showing a folder structure containing multiple models." lightbox="media/how-to-deploy-online-endpoints/multi-models-1.png":::

#### Use a single local model in a deployment

To use a single model that you have on your local machine in a deployment, specify the `path` to the `model` in your deployment YAML. Here's an example of the deployment YAML with the path `/Downloads/multi-models-sample/models/model_1/v1/sample_m1.pkl`:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: 
  path: /Downloads/multi-models-sample/models/model_1/v1/sample_m1.pkl 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

After you create your deployment, the environment variable `AZUREML_MODEL_DIR` will point to the storage location within Azure where your model is stored. For example, `/var/azureml-app/azureml-models/81b3c48bbf62360c7edbbe9b280b9025/1` will contain the model `sample_m1.pkl`. 

Within your scoring script (`score.py`), you can load your model (in this example, `sample_m1.pkl`) in the `init()` function:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR")), "sample_m1.pkl") 
    model = joblib.load(model_path) 
```

#### Use multiple local models in a deployment

Although the Azure CLI, Python SDK, and other client tools allow you to specify only one model per deployment in the deployment definition, you can still use multiple models in a deployment by registering a model folder that contains all the models as files or subdirectories.

In the previous example folder structure, you notice that there are multiple models in the `models` folder. In your deployment YAML, you can specify the path to the `models` folder as follows:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: 
  path: /Downloads/multi-models-sample/models/ 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

After you create your deployment, the environment variable `AZUREML_MODEL_DIR` will point to the storage location within Azure where your models are stored. For example, `/var/azureml-app/azureml-models/81b3c48bbf62360c7edbbe9b280b9025/1` will contain the models and the file structure. 

For this example, the contents of the `AZUREML_MODEL_DIR` folder will look like this:

:::image type="content" source="media/how-to-deploy-online-endpoints/multi-models-2.png" alt-text="A screenshot of the folder structure of the storage location for multiple models." lightbox="media/how-to-deploy-online-endpoints/multi-models-2.png":::

Within your scoring script (`score.py`), you can load your models in the `init()` function. The following code loads the `sample_m1.pkl` model:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR")), "models","model_1","v1", "sample_m1.pkl ") 
    model = joblib.load(model_path) 
```

For an example of how to deploy multiple models to one deployment, see [Deploy multiple models to one deployment (CLI example)](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/minimal/multimodel) and [Deploy multiple models to one deployment (SDK example)](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/custom-container/online-endpoints-custom-container-multimodel.ipynb).

> [!TIP]
> If you have more than 1500 files to register, consider compressing the files or subdirectories as .tar.gz when registering the models. To consume the models, you can uncompress the files or subdirectories in the `init()` function from the scoring script. Alternatively, when you register the models, set the `azureml.unpack` property to `True`, to automatically uncompress the files or subdirectories. In either case, uncompression happens once in the initialization stage.

#### Use models registered in your Azure Machine Learning workspace in a deployment

To use one or more models, which are registered in your Azure Machine Learning workspace, in your deployment, specify the name of the registered model(s) in your deployment YAML. For example, the following deployment YAML configuration specifies the registered `model` name as `azureml:local-multimodel:3`:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: azureml:local-multimodel:3 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

For this example, consider that `local-multimodel:3` contains the following model artifacts, which can be viewed from the **Models** tab in the Azure Machine Learning studio:

:::image type="content" source="media/how-to-deploy-online-endpoints/multi-models-3.png" alt-text="A screenshot of the folder structure showing the model artifacts of the registered model." lightbox="media/how-to-deploy-online-endpoints/multi-models-3.png":::

After you create your deployment, the environment variable `AZUREML_MODEL_DIR` will point to the storage location within Azure where your models are stored. For example, `/var/azureml-app/azureml-models/local-multimodel/3` will contain the models and the file structure. `AZUREML_MODEL_DIR` will point to the folder containing the root of the model artifacts. 
Based on this example, the contents of the `AZUREML_MODEL_DIR` folder will look like this:

:::image type="content" source="media/how-to-deploy-online-endpoints/multi-models-4.png" alt-text="A screenshot of the folder structure showing multiple models." lightbox="media/how-to-deploy-online-endpoints/multi-models-4.png":::

Within your scoring script (`score.py`), you can load your models in the `init()` function. For example, load the `diabetes.sav` model:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR"), "models", "diabetes", "1", "diabetes.sav") 
    model = joblib.load(model_path) 
```


### Virtual machine quota allocation for deployment

[!INCLUDE [quota-allocation-online-deployment](includes/quota-allocation-online-deployment.md)]

Azure Machine Learning provides a [shared quota](how-to-manage-quotas.md#azure-machine-learning-shared-quota) pool from which all users can access quota to perform testing for a limited time. When you use the studio to deploy Llama models (from the model catalog) to a managed online endpoint, Azure Machine Learning allows you to access this shared quota for a short time. 

To deploy a _Llama-2-70b_ or _Llama-2-70b-chat_ model, however, you must have an [Enterprise Agreement subscription](../cost-management-billing/manage/create-enterprise-subscription.md) before you can deploy using the shared quota. For more information on how to use the shared quota for online endpoint deployment, see [How to deploy foundation models using the studio](how-to-use-foundation-models.md#deploying-using-the-studio).

For more information on quotas and limits for resources in Azure Machine Learning, see [Manage and increase quotas and limits for resources with Azure Machine Learning](how-to-manage-quotas.md).

## Deployment for coders and non-coders

Azure Machine Learning supports model deployment to online endpoints for coders and non-coders alike, by providing options for _no-code deployment_, _low-code deployment_, and _Bring Your Own Container (BYOC) deployment_.

- **No-code deployment** provides out-of-box inferencing for common frameworks (for example, scikit-learn, TensorFlow, PyTorch, and ONNX) via MLflow and Triton.
- **Low-code deployment** allows you to provide minimal code along with your machine learning model for deployment.
- **BYOC deployment** lets you virtually bring any containers to run your online endpoint. You can use all the Azure Machine Learning platform features such as autoscaling, GitOps, debugging, and safe rollout to manage your MLOps pipelines​.

The following table highlights key aspects about the online deployment options:

|  | No-code | Low-code | BYOC |
|--|--|--|--|
| **Summary** | Uses out-of-box inferencing for popular frameworks such as scikit-learn, TensorFlow, PyTorch, and ONNX, via MLflow and Triton. For more information, see [Deploy MLflow models to online endpoints](how-to-deploy-mlflow-models-online-endpoints.md). | Uses secure, publicly published [curated images](resource-curated-environments.md) for popular frameworks, with updates every two weeks to address vulnerabilities. You provide scoring script and/or Python dependencies. For more information, see [Azure Machine Learning Curated Environments](resource-curated-environments.md). | You provide your complete stack via Azure Machine Learning's support for custom images. For more information, see [Use a custom container to deploy a model to an online endpoint](how-to-deploy-custom-container.md). |
| **Custom base image** | No, curated environment will provide this for easy deployment. | Yes and No, you can either use curated image or your customized image. | Yes, bring an accessible container image location (for example, docker.io, Azure Container Registry (ACR), or Microsoft Container Registry (MCR)) or a Dockerfile that you can build/push with ACR​ for your container. |
| **Custom dependencies** | No, curated environment will provide this for easy deployment. | Yes, bring the Azure Machine Learning environment in which the model runs; either a Docker image with Conda dependencies, or a dockerfile​. | Yes, this will be included in the container image. |
| **Custom code** | No, scoring script will be autogenerated for easy deployment. | Yes, bring your scoring script. | Yes, this will be included in the container image. |

> [!NOTE]
> AutoML runs create a scoring script and dependencies automatically for users, so you can deploy any AutoML model without authoring additional code (for no-code deployment) or you can modify auto-generated scripts to your business needs (for low-code deployment).​ To learn how to deploy with AutoML models, see [Deploy an AutoML model with an online endpoint](how-to-deploy-automl-endpoint.md).

## Online endpoint debugging

We *highly recommend* that you test-run your endpoint locally to validate and debug your code and configuration before you deploy to Azure. Azure CLI and Python SDK support local endpoints and deployments, while Azure Machine Learning studio and ARM template don't.

Azure Machine Learning provides various ways to debug online endpoints locally and by using container logs.

- [Local debugging with Azure Machine Learning inference HTTP server](#local-debugging-with-azure-machine-learning-inference-http-server)
- [Local debugging with local endpoint](#local-debugging-with-local-endpoint)
- [Local debugging with local endpoint and Visual Studio Code](#local-debugging-with-local-endpoint-and-visual-studio-code-preview)
- [Debugging with container logs](#debugging-with-container-logs)

#### Local debugging with Azure Machine Learning inference HTTP server

You can debug your scoring script locally by using the Azure Machine Learning inference HTTP server. The HTTP server is a Python package that exposes your scoring function as an HTTP endpoint and wraps the Flask server code and dependencies into a singular package. It's included in the [prebuilt Docker images for inference](concept-prebuilt-docker-images-inference.md) that are used when deploying a model with Azure Machine Learning. Using the package alone, you can deploy the model locally for production, and you can also easily validate your scoring (entry) script in a local development environment. If there's a problem with the scoring script, the server will return an error and the location where the error occurred.
You can also use Visual Studio Code to debug with the Azure Machine Learning inference HTTP server.

> [!TIP]
> You can use the Azure Machine Learning inference HTTP server Python package to debug your scoring script locally **without Docker Engine**. Debugging with the inference server helps you to debug the scoring script before deploying to local endpoints so that you can debug without being affected by the deployment container configurations.

To learn more about debugging with the HTTP server, see [Debugging scoring script with Azure Machine Learning inference HTTP server](how-to-inference-server-http.md).

#### Local debugging with local endpoint

For **local debugging**, you need a local deployment; that is, a model that is deployed to a local Docker environment. You can use this local deployment for testing and debugging before deployment to the cloud. To deploy locally, you'll need to have the [Docker Engine](https://docs.docker.com/engine/install/) installed and running. Azure Machine Learning then creates a local Docker image that mimics the Azure Machine Learning image. Azure Machine Learning will build and run deployments for you locally and cache the image for rapid iterations.

> [!TIP]
> Docker Engine typically starts when the computer starts. If it doesn't, you can [troubleshoot Docker Engine](https://docs.docker.com/config/daemon/#start-the-daemon-manually).
> You can use client-side tools such as [Docker Desktop](https://www.docker.com/blog/getting-started-with-docker-desktop/) to debug what happens in the container.

The steps for local debugging typically include:

- Checking that the local deployment succeeded
- Invoking the local endpoint for inferencing
- Reviewing the logs for output of the invoke operation

> [!NOTE]
> Local endpoints have the following limitations:
> - They do *not* support traffic rules, authentication, or probe settings.
> - They support only one deployment per endpoint.
> - They support local model files and environment with local conda file only. If you want to test registered models, first download them using [CLI](/cli/azure/ml/model#az-ml-model-download) or [SDK](/python/api/azure-ai-ml/azure.ai.ml.operations.modeloperations#azure-ai-ml-operations-modeloperations-download), then use `path` in the deployment definition to refer to the parent folder. If you want to test registered environments, check the context of the environment in Azure Machine Learning studio and prepare a local conda file to use. 

To learn more about local debugging, see [Deploy and debug locally by using a local endpoint](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-a-local-endpoint).

#### Local debugging with local endpoint and Visual Studio Code (preview)

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

As with local debugging, you first need to have the [Docker Engine](https://docs.docker.com/engine/install/) installed and running and then deploy a model to the local Docker environment. Once you have a local deployment, Azure Machine Learning local endpoints use Docker and Visual Studio Code development containers (dev containers) to build and configure a local debugging environment. With dev containers, you can take advantage of Visual Studio Code features, such as interactive debugging, from inside a Docker container.

To learn more about interactively debugging online endpoints in VS Code, see [Debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

#### Debugging with container logs

For a deployment, you can't get direct access to the VM where the model is deployed. However, you can get logs from some of the containers that are running on the VM.
There are two types of containers that you can get the logs from:
- Inference server: Logs include the console log (from [the inference server](how-to-inference-server-http.md)) which contains the output of print/logging functions from your scoring script (`score.py` code). 
- Storage initializer: Logs contain information on whether code and model data were successfully downloaded to the container. The container runs before the inference server container starts to run.

To learn more about debugging with container logs, see [Get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs).

## Traffic routing and mirroring to online deployments

Recall that a single online endpoint can have multiple deployments. As the endpoint receives incoming traffic (or requests), it can route percentages of traffic to each deployment, as used in the native blue/green deployment strategy. It can also mirror (or copy) traffic from one deployment to another, also called traffic mirroring or shadowing.

### Traffic routing for blue/green deployment

Blue/green deployment is a deployment strategy that allows you to roll out a new deployment (the green deployment) to a small subset of users or requests before rolling it out completely. The endpoint can implement load balancing to allocate certain percentages of the traffic to each deployment, with the total allocation across all deployments adding up to 100%.

> [!TIP]
> A request can bypass the configured traffic load balancing by including an HTTP header of `azureml-model-deployment`. Set the header value to the name of the deployment you want the request to route to.

The following image shows settings in Azure Machine Learning studio for allocating traffic between a blue and green deployment.

:::image type="content" source="media/concept-endpoints/traffic-allocation.png" alt-text="Screenshot showing slider interface to set traffic allocation between deployments." lightbox="media/concept-endpoints/traffic-allocation.png":::

This traffic allocation routes traffic as shown in the following image, with 10% of traffic going to the green deployment, and 90% of traffic going to the blue deployment.

:::image type="content" source="media/concept-endpoints/endpoint-concept.png" alt-text="Diagram showing an endpoint splitting traffic to two deployments." lightbox="media/concept-endpoints/endpoint-concept.png":::

### Traffic mirroring to online deployments

The endpoint can also mirror (or copy) traffic from one deployment to another deployment. Traffic mirroring (also called [shadow testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/shadow-testing/)) is useful when you want to test a new deployment with production traffic without impacting the results that customers are receiving from existing deployments. For example, when implementing a blue/green deployment where 100% of the traffic is routed to blue and 10% is _mirrored_ to the green deployment, the results of the mirrored traffic to the green deployment aren't returned to the clients, but the metrics and logs are recorded.

:::image type="content" source="media/concept-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing an endpoint mirroring traffic to a deployment." lightbox="media/concept-endpoints/endpoint-concept-mirror.png":::

To learn how to use traffic mirroring, see [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md).

## More capabilities of online endpoints in Azure Machine Learning

### Authentication and encryption

- Authentication: Key and Azure Machine Learning Tokens
- Managed identity: User assigned and system assigned
- SSL by default for endpoint invocation

### Autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed endpoints support autoscaling through integration with the [Azure monitor autoscale](../azure-monitor/autoscale/autoscale-overview.md) feature. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination.

:::image type="content" source="media/concept-endpoints/concept-autoscale.png" alt-text="Screenshot showing that autoscale flexibly provides between min and max instances, depending on rules.":::

To learn how to configure autoscaling, see [How to autoscale online endpoints](how-to-autoscale-endpoints.md).

### Managed network isolation

When deploying a machine learning model to a managed online endpoint, you can secure communication with the online endpoint by using [private endpoints](../private-link/private-endpoint-overview.md).

You can configure security for inbound scoring requests and outbound communications with the workspace and other services separately. Inbound communications use the private endpoint of the Azure Machine Learning workspace. Outbound communications use private endpoints created for the workspace's managed virtual network.

For more information, see [Network isolation with managed online endpoints](concept-secure-online-endpoint.md).

### Monitoring online endpoints and deployments

Monitoring for Azure Machine Learning endpoints is possible via integration with [Azure Monitor](monitor-azure-machine-learning.md#what-is-azure-monitor). This integration allows you to view metrics in charts, configure alerts, query from log tables, use Application Insights to analyze events from user containers, and so on.

* **Metrics**: Use Azure Monitor to track various endpoint metrics, such as request latency, and drill down to deployment or status level. You can also track deployment-level metrics, such as CPU/GPU utilization and drill down to instance level. Azure Monitor allows you to track these metrics in charts and set up dashboards and alerts for further analysis.

* **Logs**: Send metrics to the Log Analytics Workspace where you can query logs using the Kusto query syntax. You can also send metrics to Storage Account and/or Event Hubs for further processing. In addition, you can use dedicated Log tables for online endpoint related events, traffic, and container logs. Kusto query allows complex analysis joining multiple tables.

* **Application insights**: Curated environments include the integration with Application Insights, and you can enable/disable it when you create an online deployment. Built-in metrics and logs are sent to Application insights, and you can use its built-in features such as Live metrics, Transaction search, Failures, and Performance for further analysis.

For more information on monitoring, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

### Secret injection in online deployments (preview)

Secret injection in the context of an online deployment is a process of retrieving secrets (such as API keys) from secret stores, and injecting them into your user container that runs inside an online deployment. Secrets will eventually be accessible via environment variables, thereby providing a secure way for them to be consumed by the inference server that runs your scoring script or by the inferencing stack that you bring with a BYOC (bring your own container) deployment approach.

There are two ways to inject secrets. You can inject secrets yourself, using managed identities, or you can use the secret injection feature. To learn more about the ways to inject secrets, see [Secret injection in online endpoints (preview)](concept-secret-injection.md).


## Next steps

- [How to deploy online endpoints with the Azure CLI and Python SDK](how-to-deploy-online-endpoints.md)
- [How to deploy batch endpoints with the Azure CLI and Python SDK](batch-inference/how-to-use-batch-endpoint.md)
- [Use network isolation with managed online endpoints](how-to-secure-online-endpoint.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [How to view managed online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints)
