---
title: Deploy ML models to Kubernetes Service
titleSuffix: Azure Machine Learning
description: 'Learn how to deploy your Azure Machine Learning models as a web service using Azure Kubernetes Service.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to, contperf-fy21q1, deploy
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 09/01/2020
---

# Deploy a model to an Azure Kubernetes Service cluster

Learn how to use Azure Machine Learning to deploy a model as a web service on Azure Kubernetes Service (AKS). Azure Kubernetes Service is good for high-scale production deployments. Use Azure Kubernetes service if you need one or more of the following capabilities:

- __Fast response time__
- __Autoscaling__ of the deployed service
- __Logging__
- __Model data collection__
- __Authentication__
- __TLS termination__
- __Hardware acceleration__ options such as GPU and field-programmable gate arrays (FPGA)

When deploying to Azure Kubernetes Service, you deploy to an AKS cluster that is __connected to your workspace__. For information on connecting an AKS cluster to your workspace, see [Create and attach an Azure Kubernetes Service cluster](how-to-create-attach-kubernetes.md).

> [!IMPORTANT]
> We recommend that you debug locally before deploying to the web service. For more information, see [Debug Locally](./how-to-troubleshoot-deployment-local.md)
>
> You can also refer to Azure Machine Learning - [Deploy to Local Notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/deploy-to-local)

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

- A machine learning model registered in your workspace. If you don't have a registered model, see [How and where to deploy models](how-to-deploy-and-where.md).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md).

- The __Python__ code snippets in this article assume that the following variables are set:

    * `ws` - Set to your workspace.
    * `model` - Set to your registered model.
    * `inference_config` - Set to the inference configuration for the model.

    For more information on setting these variables, see [How and where to deploy models](how-to-deploy-and-where.md).

- The __CLI__ snippets in this article assume that you've created an `inferenceconfig.json` document. For more information on creating this document, see [How and where to deploy models](how-to-deploy-and-where.md).

- An Azure Kubernetes Service cluster connected to your workspace. For more information, see [Create and attach an Azure Kubernetes Service cluster](how-to-create-attach-kubernetes.md).

    - If you want to deploy models to GPU nodes or FPGA nodes (or any specific SKU), then you must create a cluster with the specific SKU. There is no support for creating a secondary node pool in an existing cluster and deploying models in the secondary node pool.

## Understand the deployment processes

The word "deployment" is used in both Kubernetes and Azure Machine Learning. "Deployment" has different meanings in these two contexts. In Kubernetes, a `Deployment` is a concrete entity, specified with a declarative YAML file. A Kubernetes `Deployment` has a defined lifecycle and concrete relationships to other Kubernetes entities such as `Pods` and `ReplicaSets`. You can learn about Kubernetes from docs and videos at [What is Kubernetes?](https://aka.ms/k8slearning).

In Azure Machine Learning, "deployment" is used in the more general sense of making available and cleaning up your project resources. The steps that Azure Machine Learning considers part of deployment are:

1. Zipping the files in your project folder, ignoring those specified in .amlignore or .gitignore
1. Scaling up your compute cluster (Relates to Kubernetes)
1. Building or downloading the dockerfile to the compute node (Relates to Kubernetes)
    1. The system calculates a hash of: 
        - The base image 
        - Custom docker steps (see [Deploy a model using a custom Docker base image](./how-to-deploy-custom-docker-image.md))
        - The conda definition YAML (see [Create & use software environments in Azure Machine Learning](./how-to-use-environments.md))
    1. The system uses this hash as the key in a lookup of the workspace Azure Container Registry (ACR)
    1. If it is not found, it looks for a match in the global ACR
    1. If it is not found, the system builds a new image (which will be cached and pushed to the workspace ACR)
1. Downloading your zipped project file to temporary storage on the compute node
1. Unzipping the project file
1. The compute node executing `python <entry script> <arguments>`
1. Saving logs, model files, and other files written to `./outputs` to the storage account associated with the workspace
1. Scaling down compute, including removing temporary storage (Relates to Kubernetes)

### Azure ML router

The front-end component (azureml-fe) that routes incoming inference requests to deployed services automatically scales as needed. Scaling of azureml-fe is based on the AKS cluster purpose and size (number of nodes). The cluster purpose and nodes are configured when you [create or attach an AKS cluster](how-to-create-attach-kubernetes.md). There is one azureml-fe service per cluster, which may be running on multiple pods.

> [!IMPORTANT]
> When using a cluster configured as __dev-test__, the self-scaler is **disabled**.

Azureml-fe scales both up (vertically) to use more cores, and out (horizontally) to use more pods. When making the decision to scale up, the time that it takes to route incoming inference requests is used. If this time exceeds the threshold, a scale-up occurs. If the time to route incoming requests continues to exceed the threshold, a scale-out occurs.

When scaling down and in, CPU usage is used. If the CPU usage threshold is met, the front end will first be scaled down. If the CPU usage drops to the scale-in threshold, a scale-in operation happens. Scaling up and out will only occur if there are enough cluster resources available.

## Understand connectivity requirements for AKS inferencing cluster

When Azure Machine Learning creates or attaches an AKS cluster, AKS cluster is deployed with one of the following two network models:
* Kubenet networking - The network resources are typically created and configured as the AKS cluster is deployed.
* Azure Container Networking Interface (CNI) networking - The AKS cluster is connected to existing virtual network resources and configurations.

For the first network mode, networking is created and configured properly for Azure Machine Learning service. For the second networking mode, since the cluster is connected to existing virtual network, especially when custom DNS is used for existing virtual network, customer needs to pay extra attention to connectivity requirements for AKS inferencing cluster and ensure DNS resolution and outbound connectivity for AKS inferencing.

Following diagram captures all connectivity requirements for AKS inferencing. Black arrows represent actual communication, and blue arrows represent the domain names, that customer-controlled DNS should resolve.

 ![Connectivity Requirements for AKS Inferencing](./media/how-to-deploy-aks/aks-network.png)

### Overall DNS resolution requirements
DNS resolution within existing VNET is under customer's control. The following DNS entries should be resolvable:
* AKS API server in the form of \<cluster\>.hcp.\<region\>.azmk8s.io
* Microsoft Container Registry (MCR): mcr.microsoft.com
* Customer's Azure Container Registry (ARC) in the form of \<ACR name\>.azurecr.io
* Azure Storage Account in the form of \<account\>.table.core.windows.net and \<account\>.blob.core.windows.net
* (Optional) For AAD authentication: api.azureml.ms
* Scoring endpoint domain name, either auto-generated by Azure ML or custom domain name. The auto-generated domain name would look like: \<leaf-domain-label \+ auto-generated suffix\>.\<region\>.cloudapp.azure.com

### Connectivity requirements in chronological order: from cluster creation to model deployment

In the process of AKS create or attach, Azure ML router (azureml-fe) is deployed into the AKS cluster. In order to deploy Azure ML router, AKS node should be able to:
* Resolve DNS for AKS API server
* Resolve DNS for MCR in order to download docker images for Azure ML router
* Download images from MCR, where outbound connectivity is required

Right after azureml-fe is deployed, it will attempt to start and this requires to:
* Resolve DNS for AKS API server
* Query AKS API server to discover other instances of itself (it is a multi-pod service)
* Connect to other instances of itself

Once azureml-fe is started, it requires additional connectivity to function properly:
* Connect to Azure Storage to download dynamic configuration
* Resolve DNS for AAD authentication server api.azureml.ms and communicate with it when the deployed service uses AAD authentication.
* Query AKS API server to discover deployed models
* Communicate to deployed model PODs

At model deployment time, for a successful model deployment AKS node should be able to: 
* Resolve DNS for customer's ACR
* Download images from customer's ACR
* Resolve DNS for Azure BLOBs where model is stored
* Download models from Azure BLOBs

After the model is deployed and service starts, azureml-fe will automatically discover it using AKS API and will be ready to route request to it. It must be able to communicate to model PODs.
>[!Note]
>If the deployed model requires any connectivity (e.g. querying external database or other REST service, downloading a BLOB etc), then both DNS resolution and outbound communication for these services should be enabled.

## Deploy to AKS

To deploy a model to Azure Kubernetes Service, create a __deployment configuration__ that describes the compute resources needed. For example, number of cores and memory. You also need an __inference configuration__, which describes the environment needed to host the model and web service. For more information on creating the inference configuration, see [How and where to deploy models](how-to-deploy-and-where.md).

> [!NOTE]
> The number of models to be deployed is limited to 1,000 models per deployment (per container).

<a id="using-the-cli"></a>

# [Python](#tab/python)

```python
from azureml.core.webservice import AksWebservice, Webservice
from azureml.core.model import Model

aks_target = AksCompute(ws,"myaks")
# If deploying to a cluster configured for dev/test, ensure that it was created with enough
# cores and memory to handle this deployment configuration. Note that memory is also used by
# things such as dependencies and AML components.
deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config, aks_target)
service.wait_for_deployment(show_output = True)
print(service.state)
print(service.get_logs())
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute](/python/api/azureml-core/azureml.core.compute.aks.akscompute)
* [AksWebservice.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration)
* [Model.deploy](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-)
* [Webservice.wait_for_deployment](/python/api/azureml-core/azureml.core.webservice%28class%29#wait-for-deployment-show-output-false-)

# [Azure CLI](#tab/azure-cli)

To deploy using the CLI, use the following command. Replace `myaks` with the name of the AKS compute target. Replace `mymodel:1` with the name and version of the registered model. Replace `myservice` with the name to give this service:

```azurecli-interactive
az ml model deploy --ct myaks -m mymodel:1 -n myservice --ic inferenceconfig.json --dc deploymentconfig.json
```

[!INCLUDE [deploymentconfig](../../includes/machine-learning-service-aks-deploy-config.md)]

For more information, see the [az ml model deploy](/cli/azure/ml/model#az_ml_model_deploy) reference.

# [Visual Studio Code](#tab/visual-studio-code)

For information on using VS Code, see [deploy to AKS via the VS Code extension](tutorial-train-deploy-image-classification-model-vscode.md#deploy-the-model).

> [!IMPORTANT]
> Deploying through VS Code requires the AKS cluster to be created or attached to your workspace in advance.

---

### Autoscaling

The component that handles autoscaling for Azure ML model deployments is azureml-fe, which is a smart request router. Since all inference requests go through it, it has the necessary data to automatically scale the deployed model(s).

> [!IMPORTANT]
> * **Do not enable Kubernetes Horizontal Pod Autoscaler (HPA) for model deployments**. Doing so would cause the two auto-scaling components to compete with each other. Azureml-fe is designed to auto-scale models deployed by Azure ML, where HPA would have to guess or approximate model utilization from a generic metric like CPU usage or a custom metric configuration.
> 
> * **Azureml-fe does not scale the number of nodes in an AKS cluster**, because this could lead to unexpected cost increases. Instead, **it scales the number of replicas for the model** within the physical cluster boundaries. If you need to scale the number of nodes within the cluster, you can manually scale the cluster or [configure the AKS cluster autoscaler](../aks/cluster-autoscaler.md).

Autoscaling can be controlled by setting `autoscale_target_utilization`, `autoscale_min_replicas`, and `autoscale_max_replicas` for the AKS web service. The following example demonstrates how to enable autoscaling:

```python
aks_config = AksWebservice.deploy_configuration(autoscale_enabled=True, 
                                                autoscale_target_utilization=30,
                                                autoscale_min_replicas=1,
                                                autoscale_max_replicas=4)
```

Decisions to scale up/down is based off of utilization of the current container replicas. The number of replicas that are busy (processing a request) divided by the total number of current replicas is the current utilization. If this number exceeds `autoscale_target_utilization`, then more replicas are created. If it is lower, then replicas are reduced. By default, the target utilization is 70%.

Decisions to add replicas are eager and fast (around 1 second). Decisions to remove replicas are conservative (around 1 minute).

You can calculate the required replicas by using the following code:

```python
from math import ceil
# target requests per second
targetRps = 20
# time to process the request (in seconds)
reqTime = 10
# Maximum requests per container
maxReqPerContainer = 1
# target_utilization. 70% in this example
targetUtilization = .7

concurrentRequests = targetRps * reqTime / targetUtilization

# Number of container replicas
replicas = ceil(concurrentRequests / maxReqPerContainer)
```

For more information on setting `autoscale_target_utilization`, `autoscale_max_replicas`, and `autoscale_min_replicas`, see the [AksWebservice](/python/api/azureml-core/azureml.core.webservice.akswebservice) module reference.

## Deploy models to AKS using controlled rollout (preview)

Analyze and promote model versions in a controlled fashion using endpoints. You can deploy up to six versions behind a single endpoint. Endpoints provide the following capabilities:

* Configure the __percentage of scoring traffic sent to each endpoint__. For example, route 20% of the traffic to endpoint 'test' and 80% to 'production'.

    > [!NOTE]
    > If you do not account for 100% of the traffic, any remaining percentage is routed to the __default__ endpoint version. For example, if you configure endpoint version 'test' to get 10% of the traffic, and 'prod' for 30%, the remaining 60% is sent to the default endpoint version.
    >
    > The first endpoint version created is automatically configured as the default. You can change this by setting `is_default=True` when creating or updating an endpoint version.
     
* Tag an endpoint version as either __control__ or __treatment__. For example, the current production endpoint version might be the control, while potential new models are deployed as treatment versions. After evaluating performance of the treatment versions, if one outperforms the current control, it might be promoted to the new production/control.

    > [!NOTE]
    > You can only have __one__ control. You can have multiple treatments.

You can enable app insights to view operational metrics of endpoints and deployed versions.

### Create an endpoint
Once you are ready to deploy your models, create a scoring endpoint and deploy your first version. The following example shows how to deploy and create the endpoint using the SDK. The first deployment will be defined as the default version, which means that unspecified traffic percentile across all versions will go to the default version.  

> [!TIP]
> In the following example, the configuration sets the initial endpoint version to handle 20% of the traffic. Since this is the first endpoint, it's also the default version. And since we don't have any other versions for the other 80% of traffic, it is routed to the default as well. Until other versions that take a percentage of traffic are deployed, this one effectively receives 100% of the traffic.

```python
import azureml.core,
from azureml.core.webservice import AksEndpoint
from azureml.core.compute import AksCompute
from azureml.core.compute import ComputeTarget
# select a created compute
compute = ComputeTarget(ws, 'myaks')

# define the endpoint and version name
endpoint_name = "mynewendpoint"
version_name= "versiona"
# create the deployment config and define the scoring traffic percentile for the first deployment
endpoint_deployment_config = AksEndpoint.deploy_configuration(cpu_cores = 0.1, memory_gb = 0.2,
                                                              enable_app_insights = True,
                                                              tags = {'sckitlearn':'demo'},
                                                              description = "testing versions",
                                                              version_name = version_name,
                                                              traffic_percentile = 20)
 # deploy the model and endpoint
 endpoint = Model.deploy(ws, endpoint_name, [model], inference_config, endpoint_deployment_config, compute)
 # Wait for he process to complete
 endpoint.wait_for_deployment(True)
 ```

### Update and add versions to an endpoint

Add another version to your endpoint and configure the scoring traffic percentile going to the version. There are two types of versions, a control and a treatment version. There can be multiple treatment versions to help compare against a single control version.

> [!TIP]
> The second version, created by the following code snippet, accepts 10% of traffic. The first version is configured for 20%, so only 30% of the traffic is configured for specific versions. The remaining 70% is sent to the first endpoint version, because it is also the default version.

 ```python
from azureml.core.webservice import AksEndpoint

# add another model deployment to the same endpoint as above
version_name_add = "versionb"
endpoint.create_version(version_name = version_name_add,
                        inference_config=inference_config,
                        models=[model],
                        tags = {'modelVersion':'b'},
                        description = "my second version",
                        traffic_percentile = 10)
endpoint.wait_for_deployment(True)
```

Update existing versions or delete them in an endpoint. You can change the version's default type, control type, and the traffic percentile. In the following example, the second version increases its traffic to 40% and is now the default.

> [!TIP]
> After the following code snippet, the second version is now default. It is now configured for 40%, while the original version is still configured for 20%. This means that 40% of traffic is not accounted for by version configurations. The leftover traffic will be routed to the second version, because it is now default. It effectively receives 80% of the traffic.

 ```python
from azureml.core.webservice import AksEndpoint

# update the version's scoring traffic percentage and if it is a default or control type
endpoint.update_version(version_name=endpoint.versions["versionb"].name,
                        description="my second version update",
                        traffic_percentile=40,
                        is_default=True,
                        is_control_version_type=True)
# Wait for the process to complete before deleting
endpoint.wait_for_deployment(true)
# delete a version in an endpoint
endpoint.delete_version(version_name="versionb")

```

## Web service authentication

When deploying to Azure Kubernetes Service, __key-based__ authentication is enabled by default. You can also enable __token-based__ authentication. Token-based authentication requires clients to use an Azure Active Directory account to request an authentication token, which is used to make requests to the deployed service.

To __disable__ authentication, set the `auth_enabled=False` parameter when creating the deployment configuration. The following example disables authentication using the SDK:

```python
deployment_config = AksWebservice.deploy_configuration(cpu_cores=1, memory_gb=1, auth_enabled=False)
```

For information on authenticating from a client application, see the [Consume an Azure Machine Learning model deployed as a web service](how-to-consume-web-service.md).

### Authentication with keys

If key authentication is enabled, you can use the `get_keys` method to retrieve a primary and secondary authentication key:

```python
primary, secondary = service.get_keys()
print(primary)
```

> [!IMPORTANT]
> If you need to regenerate a key, use [`service.regen_key`](/python/api/azureml-core/azureml.core.webservice%28class%29)

### Authentication with tokens

To enable token authentication, set the `token_auth_enabled=True` parameter when you are creating or updating a deployment. The following example enables token authentication using the SDK:

```python
deployment_config = AksWebservice.deploy_configuration(cpu_cores=1, memory_gb=1, token_auth_enabled=True)
```

If token authentication is enabled, you can use the `get_token` method to retrieve a JWT token and that token's expiration time:

```python
token, refresh_by = service.get_token()
print(token)
```

> [!IMPORTANT]
> You will need to request a new token after the token's `refresh_by` time.
>
> Microsoft strongly recommends that you create your Azure Machine Learning workspace in the same region as your Azure Kubernetes Service cluster. To authenticate with a token, the web service will make a call to the region in which your Azure Machine Learning workspace is created. If your workspace's region is unavailable, then you will not be able to fetch a token for your web service even, if your cluster is in a different region than your workspace. This effectively results in Token-based Authentication being unavailable until your workspace's region is available again. In addition, the greater the distance between your cluster's region and your workspace's region, the longer it will take to fetch a token.
>
> To retrieve a token, you must use the Azure Machine Learning SDK or the [az ml service get-access-token](/cli/azure/ml/service#az_ml_service_get_access_token) command.


### Vulnerability scanning

Azure Security Center provides unified security management and advanced threat protection across hybrid cloud workloads. You should allow Azure Security Center to scan your resources and follow its recommendations. For more, see [Azure Kubernetes Services integration with Security Center](../security-center/defender-for-kubernetes-introduction.md).

## Next steps

* [Use Azure RBAC for Kubernetes authorization](../aks/manage-azure-rbac.md)
* [Secure inferencing environment with Azure Virtual Network](how-to-secure-inferencing-vnet.md)
* [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md)
* [Deployment troubleshooting](how-to-troubleshoot-deployment.md)
* [Update web service](how-to-deploy-update-web-service.md)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
