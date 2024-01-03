---
title: Troubleshooting online endpoints deployment
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot some common deployment and scoring errors with online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 10/24/2023
ms.topic: troubleshooting
ms.custom: devplatv2, devx-track-azurecli, cliv2, event-tier1-build-2022, sdkv2, ignite-2022
#Customer intent: As a data scientist, I want to figure out why my online endpoint deployment failed so that I can fix it.
---

# Troubleshooting online endpoints deployment and scoring

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


Learn how to resolve common issues in the deployment and scoring of Azure Machine Learning online endpoints.

This document is structured in the way you should approach troubleshooting:

1. Use [local deployment](#deploy-locally) to test and debug your models locally before deploying in the cloud.
1. Use [container logs](#get-container-logs) to help debug issues.
1. Understand [common deployment errors](#common-deployment-errors) that might arise and how to fix them.

The section [HTTP status codes](#http-status-codes) explains how invocation and prediction errors map to HTTP status codes when scoring endpoints with REST requests.

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* The [Azure CLI](/cli/azure/install-azure-cli).
* For Azure Machine Learning CLI v2, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).
* For Azure Machine Learning Python SDK v2, see [Install the Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ai-ml-readme).

## Deploy locally

Local deployment is deploying a model to a local Docker environment. Local deployment is useful for testing and debugging before deployment to the cloud.

> [!TIP]
> You can also use [Azure Machine Learning inference HTTP server Python package](how-to-inference-server-http.md) to debug your scoring script locally. Debugging with the inference server helps you to debug the scoring script before deploying to local endpoints so that you can debug without being affected by the deployment container configurations.


Local deployment supports creation, update, and deletion of a local endpoint. It also allows you to invoke and get logs from the endpoint. 

## [Azure CLI](#tab/cli)

To use local deployment, add `--local` to the appropriate CLI command:

```azurecli
az ml online-deployment create --endpoint-name <endpoint-name> -n <deployment-name> -f <spec_file.yaml> --local
```

## [Python SDK](#tab/python)

To use local deployment, add  `local=True` parameter in the command:

```python
ml_client.begin_create_or_update(online_deployment, local=True)
```

* `ml_client` is the instance for `MLCLient` class, and `online_deployment` is the instance for either `ManagedOnlineDeployment` class or `KubernetesOnlineDeployment` class.

## [Studio](#tab/studio)

The studio doesn't support local endpoints/deployments. See the Azure CLI or Python tabs for steps to perform deployment locally.

---

As a part of local deployment the following steps take place:

- Docker either builds a new container image or pulls an existing image from the local Docker cache. An existing image is used if there's one that matches the environment part of the specification file.
- Docker starts a new container with mounted local artifacts such as model and code files.

For more, see [Deploy locally in Deploy and score a machine learning model](how-to-deploy-managed-online-endpoint-sdk-v2.md#create-local-endpoint-and-deployment).

> [!TIP]
> Use Visual Studio Code to test and debug your endpoints locally. For more information, see [debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

## Conda installation
 
Generally, issues with MLflow deployment stem from issues with the installation of the user environment specified in the `conda.yaml` file. 

To debug conda installation problems, try the following steps:

1. Check the logs for conda installation. If the container crashed or taking too long to start up, it's likely that conda environment update failed to resolve correctly.

1. Install the mlflow conda file locally with the command `conda env create -n userenv -f <CONDA_ENV_FILENAME>`. 

1. If there are errors locally, try resolving the conda environment and creating a functional one before redeploying. 

1. If the container crashes even if it resolves locally, the SKU size used for deployment might be too small. 
    1. Conda package installation occurs at runtime, so if the SKU size is too small to accommodate all of the packages detailed in the `conda.yaml` environment file, then the container might crash. 
    1. A Standard_F4s_v2 VM is a good starting SKU size, but larger ones might be needed depending on which dependencies are specified in the conda file.
    1. For Kubernetes online endpoint, the Kubernetes cluster must have minimum of 4 vCPU cores and 8-GB memory.

## Get container logs

You can't get direct access to the VM where the model is deployed. However, you can get logs from some of the containers that are running on the VM. The amount of information you get depends on the provisioning status of the deployment. If the specified container is up and running, you see its console output; otherwise, you get a message to try again later.

There are two types of containers that you can get the logs from:
- Inference server: Logs include the console log (from [the inference server](how-to-inference-server-http.md)) which contains the output of print/logging functions from your scoring script (`score.py` code). 
- Storage initializer: Logs contain information on whether code and model data were successfully downloaded to the container. The container runs before the inference server container starts to run.

# [Azure CLI](#tab/cli)

To see log output from a container, use the following CLI command:

```azurecli
az ml online-deployment get-logs -e <endpoint-name> -n <deployment-name> -l 100
```

or

```azurecli
az ml online-deployment get-logs --endpoint-name <endpoint-name> --name <deployment-name> --lines 100
```

Add `--resource-group` and `--workspace-name` to these commands if you have not already set these parameters via `az configure`.

To see information about how to set these parameters, and if you currently have set values, run:

```azurecli
az ml online-deployment get-logs -h
```

By default the logs are pulled from the inference server. 

> [!NOTE]
> If you use Python logging, ensure you use the correct logging level order for the messages to be published to logs. For example, INFO.

You can also get logs from the storage initializer container by passing `–-container storage-initializer`. 

Add `--help` and/or `--debug` to commands to see more information. 

# [Python SDK](#tab/python)

To see log output from container, use the `get_logs` method as follows:

```python
ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100
)
```

To see information about how to set these parameters, see
[reference for get-logs](/python/api/azure-ai-ml/azure.ai.ml.operations.onlinedeploymentoperations#azure-ai-ml-operations-onlinedeploymentoperations-get-logs)

By default the logs are pulled from the inference server.

> [!NOTE]
> If you use Python logging, ensure you use the correct logging level order for the messages to be published to logs. For example, INFO.

You can also get logs from the storage initializer container by adding `container_type="storage-initializer"` option. 

```python
ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100, container_type="storage-initializer"
)
```

# [Studio](#tab/studio)

To see log output from a container, use the **Endpoints** in the studio:

1. In the left navigation bar, select Endpoints.
1. (Optional) Create a filter on compute type to show only managed compute types.
1. Select an endpoint's name to view the endpoint's details page.
1. Select the **Deployment logs** tab in the endpoint's details page.
1. Use the dropdown to select the deployment whose log you want to see.

:::image type="content" source="media/how-to-troubleshoot-online-endpoints/deployment-logs.png" lightbox="media/how-to-troubleshoot-online-endpoints/deployment-logs.png" alt-text="A screenshot of observing deployment logs in the studio.":::

The logs are pulled from the inference server. 

To get logs from the storage initializer container, use the Azure CLI or Python SDK (see each tab for details). 

---

For Kubernetes online endpoint, the administrators are able to directly access the cluster where you deploy the model, which is more flexible for them to check the log in Kubernetes. For example:

```bash
kubectl -n <compute-namespace> logs <container-name>
```

## Request tracing

There are two supported tracing headers:

- `x-request-id` is reserved for server tracing. We override this header to ensure it's a valid GUID.

   > [!Note]
   > When you create a support ticket for a failed request, attach the failed request ID to expedite the investigation.
   
- `x-ms-client-request-id` is available for client tracing scenarios. This header is sanitized to only accept alphanumeric characters, hyphens and underscores, and is truncated to a maximum of 40 characters.

## Common deployment errors

The following list is of common deployment errors that are reported as part of the deployment operation status:

* [ImageBuildFailure](#error-imagebuildfailure)
* [OutOfQuota](#error-outofquota)
* [BadArgument](#error-badargument)
* [ResourceNotReady](#error-resourcenotready)
* [ResourceNotFound](#error-resourcenotfound)
* [OperationCanceled](#error-operationcanceled)

If you're creating or updating a Kubernetes online deployment, you can see [Common errors specific to Kubernetes deployments](#common-errors-specific-to-kubernetes-deployments).


### ERROR: ImageBuildFailure

This error is returned when the environment (docker image) is being built. You can check the build log for more information on the failure(s). The build log is located in the default storage for your Azure Machine Learning workspace. The exact location might be returned as part of the error. For example, `"the build log under the storage account '[storage-account-name]' in the container '[container-name]' at the path '[path-to-the-log]'"`.

The following list contains common image build failure scenarios:

* [Azure Container Registry (ACR) authorization failure](#container-registry-authorization-failure)
* [Image build compute not set in a private workspace with VNet](#image-build-compute-not-set-in-a-private-workspace-with-vnet)
* [Generic or unknown failure](#generic-image-build-failure)

We also recommend reviewing the default [probe settings](reference-yaml-deployment-managed-online.md#probesettings) if you have ImageBuild timeouts. 

#### Container registry authorization failure

If the error message mentions `"container registry authorization failure"` that means you can't access the container registry with the current credentials.
The desynchronization of a workspace resource's keys can cause this error and it takes some time to automatically synchronize.
However, you can [manually call for a synchronization of keys](/cli/azure/ml/workspace#az-ml-workspace-sync-keys), which might resolve the authorization failure.

Container registries that are behind a virtual network may also encounter this error if set up incorrectly. You must verify that the virtual network is set up properly.

#### Image build compute not set in a private workspace with VNet

If the error message mentions `"failed to communicate with the workspace's container registry"` and you're using virtual networks and the workspace's Azure Container Registry is private and configured with a private endpoint, you need to [enable Azure Container Registry](how-to-managed-network.md#configure-image-builds) to allow building images in the virtual network. 

#### Generic image build failure

As stated previously, you can check the build log for more information on the failure.
If no obvious error is found in the build log and the last line is `Installing pip dependencies: ...working...`, then a dependency might cause the error. Pinning version dependencies in your conda file can fix this problem.

We also recommend [deploying locally](#deploy-locally) to test and debug your models locally before deploying to the cloud.

### ERROR: OutOfQuota

The following list is of common resources that might run out of quota when using Azure services:

* [CPU](#cpu-quota)
* [Cluster](#cluster-quota)
* [Disk](#disk-quota)
* [Memory](#memory-quota)
* [Role assignments](#role-assignment-quota)
* [Endpoints](#endpoint-quota)
* [Region-wide VM capacity](#region-wide-vm-capacity)
* [Other](#other-quota)

Additionally, the following list is of common resources that might run out of quota only for Kubernetes online endpoint: 
* [Kubernetes](#kubernetes-quota)


#### CPU Quota

Before deploying a model, you need to have enough compute quota. This quota defines how much virtual cores are available per subscription, per workspace, per SKU, and per region. Each deployment subtracts from available quota and adds it back after deletion, based on type of the SKU.

A possible mitigation is to check if there are unused deployments that you can delete. Or you can submit a [request for a quota increase](how-to-manage-quotas.md#request-quota-and-limit-increases).

#### Cluster quota

This issue occurs when you don't have enough Azure Machine Learning Compute cluster quota. This quota defines the total number of clusters that might be in use at one time per subscription to deploy CPU or GPU nodes in Azure Cloud.

A possible mitigation is to check if there are unused deployments that you can delete. Or you can submit a [request for a quota increase](how-to-manage-quotas.md#request-quota-and-limit-increases). Make sure to select `Machine Learning Service: Cluster Quota` as the quota type for this quota increase request.

#### Disk quota

This issue happens when the size of the model is larger than the available disk space and the model isn't able to be downloaded. Try a [SKU](reference-managed-online-endpoints-vm-sku-list.md) with more disk space or reducing the image and model size.

#### Memory quota
This issue happens when the memory footprint of the model is larger than the available memory. Try a [SKU](reference-managed-online-endpoints-vm-sku-list.md) with more memory.

#### Role assignment quota

When you're creating a managed online endpoint, role assignment is required for the [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to access workspace resources. If the [role assignment limit](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits) is hit, try to delete some unused role assignments in this subscription. You can check all role assignments in the Azure portal by navigating to the Access Control menu.

#### Endpoint quota

Try to delete some unused endpoints in this subscription. If all of your endpoints are actively in use, you can try [requesting an endpoint limit increase](how-to-manage-quotas.md#endpoint-limit-increases). To learn more about the endpoint limit, see [Endpoint quota with Azure Machine Learning online endpoints and batch endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

#### Kubernetes quota

This issue happens when the requested CPU or memory is not able to be provided due to nodes being unschedulable for this deployment. For example, nodes may be cordoned or otherwise unavailable.

The error message typically indicates the resource insufficient in cluster, for example, `OutOfQuota: Kubernetes unschedulable. Details:0/1 nodes are available: 1 Too many pods...`, which means that there are too many pods in the cluster and not enough resources to deploy the new model based on your request.

You can try the following mitigation to address this issue:
* For IT ops who maintain the Kubernetes cluster, you can try to add more nodes or clear some unused pods in the cluster to release some resources.
* For machine learning engineers who deploy models, you can try to reduce the resource request of your deployment:
    * If you directly define the resource request in the deployment configuration via resource section, you can try to reduce the resource request.
    * If you use `instance type` to define resource for model deployment, you can contact the IT ops to adjust the instance type resource configuration, more detail you can refer to [How to manage Kubernetes instance type](how-to-manage-kubernetes-instance-types.md).


#### Region-wide VM capacity

Due to a lack of Azure Machine Learning capacity in the region, the service failed to provision the specified VM size. Retry later or try deploying to a different region.

#### Other quota

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container.

If your container couldn't start, it means scoring couldn't happen. It might be that the container is requesting more resources than what `instance_type` can support. If so, consider updating the `instance_type` of the online deployment.

To get the exact reason for an error, run: 

#### [Azure CLI](#tab/cli)

```azurecli
az ml online-deployment get-logs -e <endpoint-name> -n <deployment-name> -l 100
```

#### [Python SDK](#tab/python)

```python
ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100
)
```

#### [Studio](#tab/studio)

Use the **Endpoints** in the studio:

1. In the left navigation bar, select **Endpoints**.
1. (Optional) Create a filter on compute type to show only managed compute types.
1. Select an endpoint name to view the endpoint's details page.
1. Select the **Deployment logs** tab in the endpoint's details page.
1. Use the dropdown to select the deployment whose log you want to see.

----

### ERROR: BadArgument

The following list is of reasons you might run into this error when using either managed online endpoint or Kubernetes online endpoint:

* [Subscription doesn't exist](#subscription-does-not-exist)
* [Startup task failed due to authorization error](#authorization-error)
* [Startup task failed due to incorrect role assignments on resource](#authorization-error)
* [Invalid template function specification](#invalid-template-function-specification)
* [Unable to download user container image](#unable-to-download-user-container-image)
* [Unable to download user model](#unable-to-download-user-model)
* [MLFlow model format with private network is unsupported](#mlflow-model-format-with-private-network-is-unsupported)


The following list is of reasons you might run into this error only when using Kubernetes online endpoint:

* [Resource request was greater than limits](#resource-requests-greater-than-limits)
* [azureml-fe for kubernetes online endpoint isn't ready](#azureml-fe-not-ready)


#### Subscription does not exist

The Azure subscription that is entered must be existing. This error occurs when we can't find the Azure subscription that was referenced. This error is likely due to a typo in the subscription ID. Double-check that the subscription ID was correctly typed and that it's currently active.

For more information about Azure subscriptions, you can see the [prerequisites section](#prerequisites).

#### Authorization error

After you've provisioned the compute resource (while creating a deployment), Azure tries to pull the user container image from the workspace Azure Container Registry (ACR). It tries to mount the user model and code artifacts into the user container from the workspace storage account.

To perform these actions, Azure uses [managed identities](../active-directory/managed-identities-azure-resources/overview.md) to access the storage account and the container registry.

- If you created the associated endpoint with System Assigned Identity, Azure role-based access control (RBAC) permission is automatically granted, and no further permissions are needed.

- If you created the associated endpoint with User Assigned Identity, the user's managed identity must have Storage blob data reader permission on the storage account for the workspace, and AcrPull permission on the Azure Container Registry (ACR) for the workspace. Make sure your User Assigned Identity has the right permission.

For more information, please see [Container Registry Authorization Error](#container-registry-authorization-error).

#### Invalid template function specification

This error occurs when a template function was specified incorrectly. Either fix the policy or remove the policy assignment to unblock. The error message may include the policy assignment name and the policy definition to help you debug this error, and the [Azure policy definition structure article](https://aka.ms/policy-avoiding-template-failures), which discusses tips to avoid template failures.

#### Unable to download user container image

It's possible that the user container couldn't be found. Check [container logs](#get-container-logs) to get more details.

Make sure container image is available in workspace ACR.

For example, if image is `testacr.azurecr.io/azureml/azureml_92a029f831ce58d2ed011c3c42d35acb:latest` check the repository with
`az acr repository show-tags -n testacr --repository azureml/azureml_92a029f831ce58d2ed011c3c42d35acb --orderby time_desc --output table`.

#### Unable to download user model

It's possible that the user's model can't be found. Check [container logs](#get-container-logs) to get more details.

Make sure whether you have registered the model to the same workspace as the deployment. To show details for a model in a workspace: 
  
#### [Azure CLI](#tab/cli)

```azurecli
az ml model show --name <model-name> --version <version>
```

#### [Python SDK](#tab/python)

```python
ml_client.models.get(name="<model-name>", version=<version>)
```

#### [Studio](#tab/studio)

See the **Models** page in the studio:

1. In the left navigation bar, select Models.
1. Select a model's name to view the model's details page.

---

> [!WARNING]
> You must specify either version or label to get the model's information.

You can also check if the blobs are present in the workspace storage account.

- For example, if the blob is `https://foobar.blob.core.windows.net/210212154504-1517266419/WebUpload/210212154504-1517266419/GaussianNB.pkl`, you can use this command to check if it exists:
   
  ```azurecli
  az storage blob exists --account-name foobar --container-name 210212154504-1517266419 --name WebUpload/210212154504-1517266419/GaussianNB.pkl --subscription <sub-name>`
  ```
  
- If the blob is present, you can use this command to obtain the logs from the storage initializer:

  #### [Azure CLI](#tab/cli)

  ```azurecli
  az ml online-deployment get-logs --endpoint-name <endpoint-name> --name <deployment-name> –-container storage-initializer`
  ```

  #### [Python SDK](#tab/python)

  ```python
  ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100, container_type="storage-initializer"
  )
  ```

  #### [Studio](#tab/studio)

  You can't see logs from the storage initializer in the studio. Use the Azure CLI or Python SDK (see each tab for details). 

  ---

#### MLFlow model format with private network is unsupported

This error happens when you try to deploy an MLflow model with a no-code deployment approach in conjunction with the [legacy network isolation method for managed online endpoints](concept-secure-online-endpoint.md#secure-outbound-access-with-legacy-network-isolation-method). This private network feature cannot be used in conjunction with an MLFlow model format if you are using the **legacy** network isolation method. If you need to deploy an MLflow model with the no-code deployment approach, try using [workspace managed VNet](concept-secure-online-endpoint.md#secure-outbound-access-with-workspace-managed-virtual-network).

#### Resource requests greater than limits

Requests for resources must be less than or equal to limits. If you don't set limits, we set default values when you attach your compute to an Azure Machine Learning workspace. You can check limits in the Azure portal or by using the `az ml compute show` command.

#### azureml-fe not ready
The front-end component (azureml-fe) that routes incoming inference requests to deployed services automatically scales as needed. It's installed during your k8s-extension installation.

This component should be healthy on cluster, at least one healthy replica. You receive this error message if it's not available when you trigger kubernetes online endpoint and deployment creation/update request.

Check the pod status and logs to fix this issue, you can also try to update the k8s-extension installed on the cluster.


### ERROR: ResourceNotReady

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container. The error in this scenario is that this container is crashing when running, which means scoring can't happen. This error happens when:

- There's an error in `score.py`. Use `get-logs` to diagnose common problems:
    - A package that `score.py` tries to import isn't included in the conda environment.
    - A syntax error.
    - A failure in the `init()` method.
- If `get-logs` isn't producing any logs, it usually means that the container has failed to start. To debug this issue, try [deploying locally](#deploy-locally) instead.
- Readiness or liveness probes aren't set up correctly.
- Container initialization is taking too long so that readiness or liveness probe fails beyond failure threshold. In this case, adjust [probe settings](reference-yaml-deployment-managed-online.md#probesettings) to allow longer time to initialize the container. Or try a bigger VM SKU among [supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md), which accelerates the initialization.
- There's an error in the environment set up of the container, such as a missing dependency.
- When you receive the `TypeError: register() takes 3 positional arguments but 4 were given` error, check the dependency between flask v2 and `azureml-inference-server-http`. For more information, see [FAQs for inference HTTP server](how-to-inference-server-http.md#1-i-encountered-the-following-error-during-server-startup).

### ERROR: ResourceNotFound

The following list is of reasons you might run into this error only when using either managed online endpoint or Kubernetes online endpoint:

* [Azure Resource Manager can't find a required resource](#resource-manager-cannot-find-a-resource)
* [Azure Container Registry is private or otherwise inaccessible](#container-registry-authorization-error)

#### Resource Manager cannot find a resource

This error occurs when Azure Resource Manager can't find a required resource. For example, you can receive this error if a storage account was referred to but can't be found at the path on which it was specified. Be sure to double check resources that might have been supplied by exact path or the spelling of their names.

For more information, see [Resolve Resource Not Found Errors](../azure-resource-manager/troubleshooting/error-not-found.md).

#### Container registry authorization error

This error occurs when an image belonging to a private or otherwise inaccessible container registry was supplied for deployment. 
At this time, our APIs can't accept private registry credentials. 

To mitigate this error, either ensure that the container registry is **not private** or follow the following steps:
1. Grant your private registry's `acrPull` role to the system identity of your online endpoint.
1. In your environment definition, specify the address of your private image and the instruction to not modify (build) the image.

If the mitigation is successful, the image doesn't require building, and the final image address is the given image address.
At deployment time, your online endpoint's system identity pulls the image from the private registry.

For more diagnostic information, see [How To Use the Workspace Diagnostic API](../machine-learning/how-to-workspace-diagnostic-api.md).

### ERROR: OperationCanceled

The following list is of reasons you might run into this error when using either managed online endpoint or Kubernetes online endpoint:

* [Operation was canceled by another operation that has a higher priority](#operation-canceled-by-another-higher-priority-operation)
* [Operation was canceled due to a previous operation waiting for lock confirmation](#operation-canceled-waiting-for-lock-confirmation)

#### Operation canceled by another higher priority operation

Azure operations have a certain priority level and are executed from highest to lowest. This error happens when your operation was overridden by another operation that has a higher priority.

Retrying the operation might allow it to be performed without cancellation.

#### Operation canceled waiting for lock confirmation

Azure operations have a brief waiting period after being submitted during which they retrieve a lock to ensure that we don't run into race conditions. This error happens when the operation you submitted is the same as another operation. The other operation is currently waiting for confirmation that it has received the lock to proceed. It may indicate that you've submitted a similar request too soon after the initial request.

Retrying the operation after waiting several seconds up to a minute might allow it to be performed without cancellation.

### ERROR: InternalServerError

Although we do our best to provide a stable and reliable service, sometimes things don't go according to plan. If you get this error, it means that something isn't right on our side, and we need to fix it. Submit a [customer support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) with all related information and we can address the issue. 

## Common errors specific to Kubernetes deployments

Errors regarding to identity and authentication:
* [ACRSecretError](#error-acrsecreterror)
* [TokenRefreshFailed](#error-tokenrefreshfailed)
* [GetAADTokenFailed](#error-getaadtokenfailed)
* [ACRAuthenticationChallengeFailed](#error-acrauthenticationchallengefailed)
* [ACRTokenExchangeFailed](#error-acrtokenexchangefailed)
* [KubernetesUnaccessible](#error-kubernetesunaccessible)

Errors regarding to crashloopbackoff:
* [ImagePullLoopBackOff](#error-imagepullloopbackoff)
* [DeploymentCrashLoopBackOff](#error-deploymentcrashloopbackoff)
* [KubernetesCrashLoopBackOff](#error-kubernetescrashloopbackoff)

Errors regarding to scoring script:
* [UserScriptInitFailed](#error-userscriptinitfailed)
* [UserScriptImportError](#error-userscriptimporterror)
* [UserScriptFunctionNotFound](#error-userscriptfunctionnotfound)

Others:
* [NamespaceNotFound](#error-namespacenotfound)
* [EndpointAlreadyExists](#error-endpointalreadyexists)
* [ScoringFeUnhealthy](#error-scoringfeunhealthy)
* [ValidateScoringFailed](#error-validatescoringfailed)
* [InvalidDeploymentSpec](#error-invaliddeploymentspec)
* [PodUnschedulable](#error-podunschedulable)
* [PodOutOfMemory](#error-podoutofmemory)
* [InferencingClientCallFailed](#error-inferencingclientcallfailed)


### ERROR: ACRSecretError 

The following list is of reasons you might run into this error when creating/updating the Kubernetes online deployments:

* Role assignment has not been completed. In this case, wait for a few seconds and try again later. 
* The Azure ARC (For Azure Arc Kubernetes cluster) or Azure Machine Learning extension (For AKS) isn't properly installed or configured. Try to check the Azure ARC or Azure Machine Learning extension configuration and status. 
* The Kubernetes cluster has improper network configuration, check the proxy, network policy or certificate.
  * If you're using a private AKS cluster, it's necessary to set up private endpoints for ACR, storage account, workspace in the AKS vnet. 
* Make sure your Azure Machine Learning extension version is greater than v1.1.25.

### ERROR: TokenRefreshFailed

 This error is because extension can't get principal credential from Azure because the Kubernetes cluster identity isn't set properly. Reinstall the [Azure Machine Learning extension](../machine-learning/how-to-deploy-kubernetes-extension.md) and try again. 


### ERROR: GetAADTokenFailed

This error is because the Kubernetes cluster request Azure AD token failed or timed out, check your network accessibility then try again. 

* You can follow the [Configure required network traffic](../machine-learning/how-to-access-azureml-behind-firewall.md#scenario-use-kubernetes-compute) to check the outbound proxy, make sure the cluster can connect to workspace. 
* The workspace endpoint url can be found in online endpoint CRD in cluster. 

If your workspace is a private workspace, which disabled public network access, the Kubernetes cluster should only communicate with that private workspace through the private link. 

* You can check if the workspace access allows public access, no matter if an AKS cluster itself is public or private, it can't access the private workspace. 
* More information you can refer to [Secure Azure Kubernetes Service inferencing environment](../machine-learning/how-to-secure-kubernetes-inferencing-environment.md#what-is-a-secure-aks-inferencing-environment)

### ERROR: ACRAuthenticationChallengeFailed

This error is because the Kubernetes cluster can't reach ACR service of the workspace to do authentication challenge. Check your network, especially the ACR public network access, then try again. 

You can follow the troubleshooting steps in [GetAADTokenFailed](#error-getaadtokenfailed) to check the network.

### ERROR: ACRTokenExchangeFailed

This error is because the Kubernetes cluster exchange ACR token failed because Azure AD token is not yet authorized. Since the role assignment takes some time, so you can wait a moment then try again.

This failure might also be due to too many requests to the ACR service at that time, it should be a transient error, you can try again later.

### ERROR: KubernetesUnaccessible

You might get the following error during the Kubernetes model deployments:

```
{"code":"BadRequest","statusCode":400,"message":"The request is invalid.","details":[{"code":"KubernetesUnaccessible","message":"Kubernetes error: AuthenticationException. Reason: InvalidCertificate"}],...}
```

To mitigate this error, you can:

* Rotate AKS certificate for the cluster. For more information, see [Certificate Rotation in Azure Kubernetes Service (AKS)](../aks/certificate-rotation.md).
* The new certificate should be updated to after 5 hours, so you can wait for 5 hours and redeploy it.


### ERROR: ImagePullLoopBackOff

The reason you might run into this error when creating/updating Kubernetes online deployments is because you can't download the images from the container registry, resulting in the images pull failure. 

In this case, you can check the cluster network policy and the workspace container registry if cluster can pull image from the container registry.

### ERROR: DeploymentCrashLoopBackOff 

The reason you might run into this error when creating/updating Kubernetes online deployments is the user container crashed initializing. There are two possible reasons for this error:
* User script `score.py` has syntax error or import error then raise exceptions in initializing.
* Or the deployment pod needs more memory than its limit.

To mitigate this error, first you can check the deployment logs for any exceptions in user scripts. If error persists, try to extend resources/instance type memory limit.  
 

### ERROR: KubernetesCrashLoopBackOff

The following list is of reasons you might run into this error when creating/updating the Kubernetes online endpoints/deployments:
* One or more pod(s) stuck in CrashLoopBackoff status, you can check if the deployment log exists, and check if there are error messages in the log.
* There's an error in `score.py` and the container crashed when init your score code, you can follow [ERROR: ResourceNotReady](#error-resourcenotready) part. 
* Your scoring process needs more memory that your deployment config limit is insufficient, you can try to update the deployment with a larger memory limit. 

### ERROR: NamespaceNotFound

The reason you might run into this error when creating/updating the Kubernetes online endpoints is because the namespace your Kubernetes compute used is unavailable in your cluster. 

You can check the Kubernetes compute in your workspace portal and check the namespace in your Kubernetes cluster. If the namespace isn't available, you can detach the legacy compute and reattach to create a new one, specifying a namespace that already exists in your cluster. 

### ERROR: UserScriptInitFailed 

The reason you might run into this error when creating/updating the Kubernetes online deployments is because the init function in your uploaded `score.py` file raised exception.

You can check the deployment logs to see the exception message in detail and fix the exception. 

### ERROR: UserScriptImportError

The reason you might run into this error when creating/updating the Kubernetes online deployments is because the `score.py` file you uploaded has imported unavailable packages.

You can check the deployment logs to see the exception message in detail and fix the exception. 

### ERROR: UserScriptFunctionNotFound 

The reason you might run into this error when creating/updating the Kubernetes online deployments is because the `score.py` file you uploaded doesn't have a function named `init()` or `run()`. You can check your code and add the function.


### ERROR: EndpointNotFound

The reason you might run into this error when creating/updating Kubernetes online deployments is because the system can't find the endpoint resource for the deployment in the cluster. You should create the deployment in an exist endpoint or create this endpoint first in your cluster.

### ERROR: EndpointAlreadyExists

The reason you might run into this error when creating a Kubernetes online endpoint is because the creating endpoint already exists in your cluster.

The endpoint name should be unique per workspace and per cluster, so in this case, you should create endpoint with another name. 

### ERROR: ScoringFeUnhealthy

The reason you might run into this error when creating/updating a Kubernetes online endpoint/deployment is because the [Azureml-fe](how-to-kubernetes-inference-routing-azureml-fe.md) that is the system service running in the cluster isn't found or unhealthy.

To trouble shoot this issue, you can reinstall or update the Azure Machine Learning extension in your cluster.

### ERROR: ValidateScoringFailed

The reason you might run into this error when creating/updating Kubernetes online deployments is because the scoring request URL validation failed when processing the model deploying. 

In this case, you can first check the endpoint URL and then try to redeploy the deployment.

### ERROR: InvalidDeploymentSpec

The reason you might run into this error when creating/updating Kubernetes online deployments is because the deployment spec is invalid.

In this case, you can check the error message.
* Make sure the `instance count` is valid.
* If you enabled auto-scaling, make sure the `minimum instance count` and `maximum instance count` are both valid.

### ERROR: PodUnschedulable

The following list is of reasons you might run into this error when creating/updating the Kubernetes online endpoints/deployments:

* Unable to schedule pod to nodes, due to insufficient resources in your cluster.
* No node match node affinity/selector.

To mitigate this error, you can follow these steps: 
* Check the `node selector` definition of the `instance type` you used, and `node label` configuration of your cluster nodes. 
* Check `instance type` and the node SKU size for AKS cluster or the node resource for Arc-Kubernetes cluster.
  * If the cluster is under-resourced, you can reduce the instance type resource requirement or use another instance type with smaller resource required. 
* If the cluster has no more resource to meet the requirement of the deployment, delete some deployment to release resources.

### ERROR: PodOutOfMemory 

The reason you might run into this error when you creating/updating online deployment is the memory limit you give for deployment is insufficient. You can set the memory limit to a larger value or use a bigger instance type to mitigate this error.

### ERROR: InferencingClientCallFailed 

The reason you might run into this error when creating/updating Kubernetes online endpoints/deployments is because the k8s-extension of the Kubernetes cluster isn't connectable.

In this case, you can detach and then **re-attach** your compute. 

> [!NOTE]
>
> To troubleshoot errors by reattaching, please guarantee to reattach with the exact same configuration as previously detached compute, such as the same compute name and namespace, otherwise you may encounter other errors.

If it's still not working, you can ask the administrator who can access the cluster to use `kubectl get po -n azureml` to check whether the *relay server* pods are running.


## Autoscaling issues

If you're having trouble with autoscaling, see [Troubleshooting Azure autoscale](../azure-monitor/autoscale/autoscale-troubleshoot.md).

For Kubernetes online endpoint, there's **Azure Machine Learning inference router** which is a front-end component to handle autoscaling for all model deployments on the Kubernetes cluster, you can find more information in [Autoscaling of Kubernetes inference routing](how-to-kubernetes-inference-routing-azureml-fe.md#autoscaling)

## Common model consumption errors

The following list is of common model consumption errors resulting from the endpoint `invoke` operation status.

* [Bandwidth limit issues](#bandwidth-limit-issues)
* [HTTP status codes](#http-status-codes)
* [Blocked by CORS policy](#blocked-by-cors-policy)

### Bandwidth limit issues

Managed online endpoints have bandwidth limits for each endpoint. You find the limit configuration in [limits for online endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints). If your bandwidth usage exceeds the limit, your request is delayed. To monitor the bandwidth delay:

- Use metric "Network bytes" to understand the current bandwidth usage. For more information, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).
- There are two response trailers returned if the bandwidth limit enforced: 
    - `ms-azureml-bandwidth-request-delay-ms`: delay time in milliseconds it took for the request stream transfer.
    - `ms-azureml-bandwidth-response-delay-ms`: delay time in milliseconds it took for the response stream transfer.

### HTTP status codes

When you access online endpoints with REST requests, the returned status codes adhere to the standards for [HTTP status codes](https://aka.ms/http-status-codes). These are details about how endpoint invocation and prediction errors map to HTTP status codes.

#### Common error codes for managed online endpoints

The following table contains common error codes when consuming managed online endpoints with REST requests:

| Status code | Reason phrase             | Why this code might get returned                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200         | OK                        | Your model executed successfully, within your latency bound.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 401         | Unauthorized              | You don't have permission to do the requested action, such as score, or your token is expired.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 404         | Not found                 | The endpoint doesn't have any valid deployment with positive weight.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 408         | Request timeout           | The model execution took longer than the timeout supplied in `request_timeout_ms` under `request_settings` of your model deployment config.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 424         | Model Error               | If your model container returns a non-200 response, Azure returns a 424. Check the `Model Status Code` dimension under the `Requests Per Minute` metric on your endpoint's [Azure Monitor Metric Explorer](../azure-monitor/essentials/metrics-getting-started.md). Or check response headers `ms-azureml-model-error-statuscode` and `ms-azureml-model-error-reason` for more information. If 424 comes with liveness or readiness probe failing, consider adjusting [probe settings](reference-yaml-deployment-managed-online.md#probesettings) to allow longer time to probe liveness or readiness of the container. |
| 429         | Too many pending requests | Your model is currently getting more requests than it can handle. Azure Machine Learning has implemented a system that permits a maximum of `2 * max_concurrent_requests_per_instance * instance_count requests` to be processed in parallel at any given moment to guarantee smooth operation. Other requests that exceed this maximum are rejected. You can review your model deployment configuration under the request_settings and scale_settings sections to verify and adjust these settings. Additionally, as outlined in the [YAML definition for RequestSettings](reference-yaml-deployment-managed-online.md#requestsettings), it's important to ensure that the environment variable `WORKER_COUNT` is correctly passed. <br><br> If you're using autoscaling and get this error, it means your model is getting requests quicker than the system can scale up. In this situation, consider resending requests with an [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) to give the system the time it needs to adjust. You could also increase the number of instances by using [code to calculate instance count](#how-to-calculate-instance-count). These steps, combined with setting autoscaling, help ensure that your model is ready to handle the influx of requests. |
| 429         | Rate-limiting             | The number of requests per second reached the [limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints) of managed online endpoints.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 500         | Internal server error     | Azure Machine Learning-provisioned infrastructure is failing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

#### Common error codes for kubernetes online endpoints

The following table contains common error codes when consuming Kubernetes online endpoints with REST requests:

| Status code | Reason phrase                                                                 | Why this code might get returned                                                                                                                                                                                                                                                                                                                                                                       |
| ----------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 409         | Conflict error                                                                | When an operation is already in progress, any new operation on that same online endpoint responds with 409 conflict error. For example, If create or update online endpoint operation is in progress and if you trigger a new Delete operation it throws an error.                                                                                                                             |
| 502         | Has thrown an exception or crashed in the `run()` method of the score.py file | When there's an error in `score.py`, for example an imported package doesn't exist in the conda environment, a syntax error, or a failure in the `init()` method. You can follow [here](#error-resourcenotready) to debug the file.                                                                                                                                                                   |
| 503         | Receive large spikes in requests per second                                   | The autoscaler is designed to handle gradual changes in load. If you receive large spikes in requests per second, clients might receive an HTTP status code 503. Even though the autoscaler reacts quickly, it takes AKS a significant amount of time to create more containers. You can follow [here](#how-to-prevent-503-status-codes) to prevent 503 status codes.                                    |
| 504         | Request has timed out                                                         | A 504 status code indicates that the request has timed out. The default timeout setting is 5 seconds. You can increase the timeout or try to speed up the endpoint by modifying the score.py to remove unnecessary calls. If these actions don't correct the problem, you can follow [here](#error-resourcenotready) to debug the score.py file. The code might be in a nonresponsive state or an infinite loop. |
| 500         | Internal server error                                                         | Azure Machine Learning-provisioned infrastructure is failing.                                                                                                                                                                                                                                                                                                                                                        |


### How to prevent 503 status codes
Kubernetes online deployments support autoscaling, which allows replicas to be added to support extra load, more information you can find in [Azure Machine Learning inference router](how-to-kubernetes-inference-routing-azureml-fe.md). Decisions to scale up/down is based off of utilization of the current container replicas.

There are two things that can help prevent 503 status codes:
> [!TIP]
> These two approaches can be used individually or in combination.

* Change the utilization level at which autoscaling creates new replicas. You can adjust the utilization target by setting the `autoscale_target_utilization` to a lower value.

    > [!IMPORTANT]
    > This change does not cause replicas to be created *faster*. Instead, they are created at a lower utilization threshold. Instead of waiting until the service is 70% utilized, changing the value to 30% causes replicas to be created when 30% utilization occurs.
    
    If the Kubernetes online endpoint is already using the current max replicas and you're still seeing 503 status codes, increase the `autoscale_max_replicas` value to increase the maximum number of replicas.

* Change the minimum number of replicas. Increasing the minimum replicas provides a larger pool to handle the incoming spikes.

    To increase the number of instances, you could calculate the required replicas following these codes.

    ```python
    from math import ceil
    # target requests per second
    target_rps = 20
    # time to process the request (in seconds, choose appropriate percentile)
    request_process_time = 10
    # Maximum concurrent requests per instance
    max_concurrent_requests_per_instance = 1
    # The target CPU usage of the model container. 70% in this example
    target_utilization = .7
    
    concurrent_requests = target_rps * request_process_time / target_utilization
    
    # Number of instance count
    instance_count = ceil(concurrent_requests / max_concurrent_requests_per_instance)
    ```

    > [!NOTE]
    > If you receive request spikes larger than the new minimum replicas can handle, you may receive 503 again. For example, as traffic to your endpoint increases, you may need to increase the minimum replicas.

#### How to calculate instance count
To increase the number of instances, you can calculate the required replicas by using the following code:
```python
from math import ceil
# target requests per second
target_rps = 20
# time to process the request (in seconds, choose appropriate percentile)
request_process_time = 10
# Maximum concurrent requests per instance
max_concurrent_requests_per_instance = 1
# The target CPU usage of the model container. 70% in this example
target_utilization = .7

concurrent_requests = target_rps * request_process_time / target_utilization

# Number of instance count
instance_count = ceil(concurrent_requests / max_concurrent_requests_per_instance)
```

### Blocked by CORS policy

Online endpoints (v2) currently don't support [Cross-Origin Resource Sharing](https://developer.mozilla.org/docs/Web/HTTP/CORS) (CORS) natively. If your web application tries to invoke the endpoint without proper handling of the CORS preflight requests, you can see the following error message: 

```
Access to fetch at 'https://{your-endpoint-name}.{your-region}.inference.ml.azure.com/score' from origin http://{your-url} has been blocked by CORS policy: Response to preflight request doesn't pass access control check. No 'Access-control-allow-origin' header is present on the request resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with the CORS disabled.
```
We recommend that you use Azure Functions, Azure Application Gateway, or any service as an interim layer to handle CORS preflight requests.

## Common network isolation issues

[!INCLUDE [network isolation issues](includes/machine-learning-online-endpoint-troubleshooting.md)]

## Troubleshoot inference server
In this section, we provide basic troubleshooting tips for [Azure Machine Learning inference HTTP server](how-to-inference-server-http.md). 

[!INCLUDE [inference server TSGs](includes/machine-learning-inference-server-troubleshooting.md)]

## Next steps

- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [Online endpoint YAML reference](reference-yaml-endpoint-online.md)
- [Troubleshoot kubernetes compute ](how-to-troubleshoot-kubernetes-compute.md)
