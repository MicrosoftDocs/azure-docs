---
title: Troubleshooting online endpoints deployment
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot some common deployment and scoring errors with online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: petrodeg
ms.author:  petrodeg
ms.reviewer: larryfr
ms.date: 04/12/2022
ms.topic: troubleshooting
ms.custom: devplatv2, devx-track-azurecli, cliv2, event-tier1-build-2022, sdkv2
#Customer intent: As a data scientist, I want to figure out why my online endpoint deployment failed so that I can fix it.
---

# Troubleshooting online endpoints deployment and scoring

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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
* For Azure Machine Learning Python SDK v2, see [Install the Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ml/installv2).

## Deploy locally

Local deployment is deploying a model to a local Docker environment. Local deployment is useful for testing and debugging before deployment to the cloud.

> [!TIP]
> Use Visual Studio Code to test and debug your endpoints locally. For more information, see [debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

Local deployment supports creation, update, and deletion of a local endpoint. It also allows you to invoke and get logs from the endpoint. 

# [Azure CLI](#tab/cli)

To use local deployment, add `--local` to the appropriate CLI command:

```azurecli
az ml online-deployment create --endpoint-name <endpoint-name> -n <deployment-name> -f <spec_file.yaml> --local
```

# [Python SDK](#tab/python)

To use local deployment, add  `local=True` parameter in the command:

```python
ml_client.begin_create_or_update(online_deployment, local=True)
```

* `ml_client` and `online_deployment` are instances for `MLClient` class and `ManagedOnlineDeployment` class, respectively.

---

As a part of local deployment the following steps take place:

- Docker either builds a new container image or pulls an existing image from the local Docker cache. An existing image is used if there's one that matches the environment part of the specification file.
- Docker starts a new container with mounted local artifacts such as model and code files.

For more, see [Deploy locally in Deploy and score a machine learning model with a managed online endpoint](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints).

## Conda installation
 
Generally, issues with mlflow deployment stem from issues with the installation of the user environment specified in the `conda.yaml` file. 

To debug conda installation problems, try the following:

1. Check the logs for conda installation. If the container crashed or taking too long to start up, it is likely that conda environment update has failed to resolve correctly.

1. Install the mlflow conda file locally with the command `conda env create -n userenv -f <CONDA_ENV_FILENAME>`. 

1. If there are errors locally, try resolving the conda environment and creating a functional one before redeploying. 

1. If the container crashes even if it resolves locally, the SKU size used for deployment may be too small. 
    1. Conda package installation occurs at runtime, so if the SKU size is too small to accommodate all of the packages detailed in the `conda.yaml` environment file, then the container may crash. 
    1. A Standard_F4s_v2 VM is a good starting SKU size, but larger ones may be needed depending on which dependencies are specified in the conda file.

## Get container logs

You can't get direct access to the VM where the model is deployed. However, you can get logs from some of the containers that are running on the VM. The amount of information depends on the provisioning status of the deployment. If the specified container is up and running you'll see its console output, otherwise you'll get a message to try again later.

# [Azure CLI](#tab/cli)

To see log output from container, use the following CLI command:

```azurecli
az ml online-deployment get-logs -e <endpoint-name> -n <deployment-name> -l 100
```

or

```azurecli
az ml online-deployment get-logs --endpoint-name <endpoint-name> --name <deployment-name> --lines 100
```

Add `--resource-group` and `--workspace-name` to the commands above if you have not already set these parameters via `az configure`.

To see information about how to set these parameters, and if current values are already set, run:

```azurecli
az ml online-deployment get-logs -h
```

By default the logs are pulled from the inference server. Logs include the console log from the inference server, which contains print/log statements from your `score.py' code.

> [!NOTE]
> If you use Python logging, ensure you use the correct logging level order for the messages to be published to logs. For example, INFO.


You can also get logs from the storage initializer container by passing `–-container storage-initializer`. These logs contain information on whether code and model data were successfully downloaded to the container.

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

By default the logs are pulled from the inference server. Logs include the console log from the inference server, which contains print/log statements from your `score.py' code.

> [!NOTE]
> If you use Python logging, ensure you use the correct logging level order for the messages to be published to logs. For example, INFO.

You can also get logs from the storage initializer container by adding `container_type="storage-initializer"` option. These logs contain information on whether code and model data were successfully downloaded to the container.

```python
ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100, container_type="storage-initializer"
)
```

---

## Request tracing

There are three supported tracing headers:

- `x-request-id` is reserved for server tracing. We override this header to ensure it's a valid GUID.

   > [!Note]
   > When you create a support ticket for a failed request, attach the failed request ID to expedite investigation.
   
- `x-ms-client-request-id` is available for client tracing scenarios. We sanitize this header to remove non-alphanumeric symbols. This header is truncated to 72 characters.

## Common deployment errors

Below is a list of common deployment errors that are reported as part of the deployment operation status.

* [ImageBuildFailure](#error-imagebuildfailure)
* [OutOfQuota](#error-outofquota)
* [OutOfCapacity](#error-outofcapacity)
* [BadArgument](#error-badargument)
* [ResourceNotReady](#error-resourcenotready)
* [ResourceNotFound](#error-resourcenotfound)
* [OperationCanceled](#error-operationcanceled)
* [InternalServerError](#error-internalservererror)

### ERROR: ImageBuildFailure

This error is returned when the environment (docker image) is being built. You can check the build log for more information on the failure(s). The build log is located in the default storage for your Azure Machine Learning workspace. The exact location is returned as part of the error. For example, 'The build log is available in the workspace blob store "storage-account-name" under the path "/azureml/ImageLogs/your-image-id/build.log"'. In this case, "azureml" is the name of the blob container in the storage account.

If no obvious error is found in the build log, and the last line is `Installing pip dependencies: ...working...`, then the error may be caused by a dependency. Pinning version dependencies in your conda file could fix this problem.

We also recommend using a [local deployment](#deploy-locally) to test and debug your models locally before deploying in the cloud.

### ERROR: OutOfQuota

Below is a list of common resources that might run out of quota when using Azure services:

* [CPU](#cpu-quota)
* [Disk](#disk-quota)
* [Memory](#memory-quota)
* [Role assignments](#role-assignment-quota)
* [Endpoints](#endpoint-quota)
* [Kubernetes](#kubernetes-quota)
* [Other](#other-quota)

#### CPU Quota

Before deploying a model, you need to have enough compute quota. This quota defines how much virtual cores are available per subscription, per workspace, per SKU, and per region. Each deployment subtracts from available quota and adds it back after deletion, based on type of the SKU.

A possible mitigation is to check if there are unused deployments that can be deleted. Or you can submit a [request for a quota increase](how-to-manage-quotas.md#request-quota-increases).

#### Disk quota

This issue happens when the size of the model is larger than the available disk space and the model is not able to be downloaded. Try a SKU with more disk space.
* Try a [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md) with more disk space
* Try reducing image and model size

#### Memory quota
This issue happens when the memory footprint of the model is larger than the available memory. Try a [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md) with more memory.<br>

#### Role assignment quota

Try to delete some unused role assignments in this subscription. You can check all role assignments in the Azure portal in the Access Control menu.

#### Endpoint quota

Try to delete some unused endpoints in this subscription.

#### Kubernetes quota

The requested CPU or memory couldn't be satisfied. Adjust your request or the cluster.

#### Other quota

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container.

If your container could not start, this means scoring could not happen. It might be that the container is requesting more resources than what `instance_type` can support. If so, consider updating the `instance_type` of the online deployment.

To get the exact reason for an error, run: 

# [Azure CLI](#tab/cli)

```azurecli
az ml online-deployment get-logs -e <endpoint-name> -n <deployment-name> -l 100
```

# [Python SDK](#tab/python)

```python
ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100
)
```

---

### ERROR: OutOfCapacity

The specified VM Size failed to provision due to a lack of Azure Machine Learning capacity. Retry later or try deploying to a different region.

### ERROR: BadArgument

Below is a list of reasons you might run into this error:

* [Resource request was greater than limits](#resource-requests-greater-than-limits)
* [Startup task failed due to authorization error](#authorization-error)
* [Startup task failed due to incorrect role assignments on resource](#authorization-error)
* [Unable to download user container image](#unable-to-download-user-container-image)
* [Unable to download user model](#unable-to-download-user-model)
* [azureml-fe for kubernetes online endpoint is not ready](#azureml-fe-not-ready)

#### Resource requests greater than limits

Requests for resources must be less than or equal to limits. If you don't set limits, we set default values when you attach your compute to an Azure Machine Learning workspace. You can check limits in the Azure portal or by using the `az ml compute show` command.

#### Authorization error

After you provisioned the compute resource, during deployment creation, Azure tries to pull the user container image from the workspace private Azure Container Registry (ACR) and mount the user model and code artifacts into the user container from the workspace storage account.

First, check if there's a permissions issue accessing ACR.

To pull blobs, Azure uses [managed identities](../active-directory/managed-identities-azure-resources/overview.md) to access the storage account.

  - If you created the associated endpoint with SystemAssigned, Azure role-based access control (RBAC) permission is automatically granted, and no further permissions are needed.

  - If you created the associated endpoint with UserAssigned, the user's managed identity must have Storage blob data reader permission on the workspace storage account.

#### Unable to download user container image

It's possible that the user container couldn't be found. Check [container logs](#get-container-logs) to get more details.

Make sure container image is available in workspace ACR.

For example, if image is `testacr.azurecr.io/azureml/azureml_92a029f831ce58d2ed011c3c42d35acb:latest` check the repository with
`az acr repository show-tags -n testacr --repository azureml/azureml_92a029f831ce58d2ed011c3c42d35acb --orderby time_desc --output table`.

#### Unable to download user model

It is possible that the user model can't be found. Check [container logs](#get-container-logs) to get more details.

Make sure the model is registered to the same workspace as the deployment. Use the `show` command or equivalent Python method to show details for a model in a workspace. 

- For example: 
  
  # [Azure CLI](#tab/cli)

  ```azurecli
  az ml model show --name <model-name> --version <version>
  ```
 
  # [Python SDK](#tab/python)

  ```python
  ml_client.models.get(name="<model-name>", version=<version>)
  ```
  ---

  > [!WARNING]
  > You must specify either version or label to get the model information.

You can also check if the blobs are present in the workspace storage account.

- For example, if the blob is `https://foobar.blob.core.windows.net/210212154504-1517266419/WebUpload/210212154504-1517266419/GaussianNB.pkl`, you can use this command to check if it exists:
   
  ```azurecli
  az storage blob exists --account-name foobar --container-name 210212154504-1517266419 --name WebUpload/210212154504-1517266419/GaussianNB.pkl --subscription <sub-name>`
  ```
  
- If the blob is present, you can use this command to obtain the logs from the storage initializer:

  # [Azure CLI](#tab/cli)

  ```azurecli
  az ml online-deployment get-logs --endpoint-name <endpoint-name> --name <deployment-name> –-container storage-initializer`
  ```

  # [Python SDK](#tab/python)

  ```python
  ml_client.online_deployments.get_logs(
    name="<deployment-name>", endpoint_name="<endpoint-name>", lines=100, container_type="storage-initializer"
  )
  ```

  ---

#### azureml-fe not ready
The front-end component (azureml-fe) that routes incoming inference requests to deployed services automatically scales as needed. It's installed during your k8s-extension installation.

This component should be healthy on cluster, at least one healthy replica. You will get this error message if it's not available when you trigger kubernetes online endpoint and deployment creation/update request.

Please check the pod status and logs to fix this issue, you can also try to update the k8s-extension installed on the cluster.


### ERROR: ResourceNotReady

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container. The error in this scenario is that this container is crashing when running, which means scoring can't happen. This error happens when:

- There's an error in `score.py`. Use `get-logs` to help diagnose common problems:
    - A package that was imported but isn't in the conda environment.
    - A syntax error.
    - A failure in the `init()` method.
- If `get-logs` isn't producing any logs, it usually means that the container has failed to start. To debug this issue, try [deploying locally](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/machine-learning/how-to-troubleshoot-online-endpoints.md#deploy-locally) instead.
- Readiness or liveness probes aren't set up correctly.
- There's an error in the environment setup of the container, such as a missing dependency.
- When you face `TypeError: register() takes 3 positional arguments but 4 were given` error, the error may be caused by the dependency between flask v2 and `azureml-inference-server-http`. See [FAQs for inference HTTP server](how-to-inference-server-http.md#1-i-encountered-the-following-error-during-server-startup) for more details.

### ERROR: ResourceNotFound

Below is a list of reasons you might run into this error:

* [Azure Resource Manager cannot find a required resource](#resource-manager-cannot-find-a-resource)
* [Azure Container Registry is private or otherwise inaccessible](#container-registry-authorization-error)

#### Resource Manager cannot find a resource

This error occurs when Azure Resource Manager can't find a required resource. For example, you'll receive this error if a storage account was referred to but can't be found at the path on which it was specified. Be sure to double check resources that might have been supplied by exact path or the spelling of their names.

For more information, see [Resolve Resource Not Found Errors](../azure-resource-manager/troubleshooting/error-not-found.md).

#### Container registry authorization error

This error occurs when an image belonging to a private or otherwise inaccessible container registry was supplied for deployment. 
At this time, our APIs cannot accept private registry credentials. 

To mitigate this error, either ensure that the container registry is **not private** or follow the following steps:
1. Grant your private registry's `acrPull` role to the system identity of your online endpoint.
1. In your environment definition, specify the address of your private image as well as the additional instruction to not modify (build) the image.

If the mitigation is successful, the image will not require any building and the final image address will simply be the given image address.
At deployment time, your online endpoint's system identity will pull the image from the private registry.

For more diagnostic information, see [How To Use the Workspace Diagnostic API](../machine-learning/how-to-workspace-diagnostic-api.md).

### ERROR: OperationCanceled

Below is a list of reasons you might run into this error:

* [Operation was canceled by another operation that has a higher priority](#operation-canceled-by-another-higher-priority-operation)
* [Operation was canceled due to a previous operation waiting for lock confirmation](#operation-canceled-waiting-for-lock-confirmation)

#### Operation canceled by another higher priority operation

Azure operations have a certain priority level and are executed from highest to lowest. This error happens when your operation happened to be overridden by another operation that has a higher priority.

Retrying the operation might allow it to be performed without cancellation.

#### Operation canceled waiting for lock confirmation

Azure operations have a brief waiting period after being submitted during which they retrieve a lock to ensure that we don't run into race conditions. This error happens when the operation you submitted is the same as another operation that is currently still waiting for confirmation that it has received the lock to proceed. It may indicate that you've submitted a very similar request too soon after the initial request.

Retrying the operation after waiting a few seconds up to a minute may allow it to be performed without cancellation.

### ERROR: InternalServerError

Although we do our best to provide a stable and reliable service, sometimes things don't go according to plan. If you get this error, it means that something isn't right on our side, and we need to fix it. Submit a [customer support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) with all related information and we'll address the issue. 

## Autoscaling issues

If you're having trouble with autoscaling, see [Troubleshooting Azure autoscale](../azure-monitor/autoscale/autoscale-troubleshoot.md).

## Bandwidth limit issues

Managed online endpoints have bandwidth limits for each endpoint. You find the limit configuration in [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints) here. If your bandwidth usage exceeds the limit, your request will be delayed. To monitor the bandwidth delay:

- Use metric “Network bytes” to understand the current bandwidth usage. For more information, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).
- There are two response trailers will be returned if the bandwidth limit enforced: 
    - `ms-azureml-bandwidth-request-delay-ms`: delay time in milliseconds it took for the request stream transfer.
    - `ms-azureml-bandwidth-response-delay-ms`: delay time in milliseconds it took for the response stream transfer.

## HTTP status codes

When you access online endpoints with REST requests, the returned status codes adhere to the standards for [HTTP status codes](https://aka.ms/http-status-codes). Below are details about how endpoint invocation and prediction errors map to HTTP status codes.

| Status code| Reason phrase |	Why this code might get returned |
| --- | --- | --- |
| 200 | OK | Your model executed successfully, within your latency bound. |
| 401 | Unauthorized | You don't have permission to do the requested action, such as score, or your token is expired. |
| 404 | Not found | Your URL isn't correct. |
| 408 | Request timeout | The model execution took longer than the timeout supplied in `request_timeout_ms` under `request_settings` of your model deployment config.|
| 424 | Model Error | If your model container returns a non-200 response, Azure returns a 424. Check the `Model Status Code` dimension under the `Requests Per Minute` metric on your endpoint's [Azure Monitor Metric Explorer](../azure-monitor/essentials/metrics-getting-started.md). Or check response headers `ms-azureml-model-error-statuscode` and `ms-azureml-model-error-reason` for more information. |
| 429 | Rate-limiting | The number of requests per second reached the [limit](./how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints) of managed online endpoints.|
| 429 | Too many pending requests | Your model is getting more requests than it can handle. We allow 2 * `max_concurrent_requests_per_instance` * `instance_count` requests in parallel at any time. Additional requests are rejected. You can confirm these settings in your model deployment config under `request_settings` and `scale_settings`. If you're using auto-scaling, your model is getting requests faster than the system can scale up. With auto-scaling, you can try to resend requests with [exponential backoff](https://aka.ms/exponential-backoff). Doing so can give the system time to adjust. |
| 500 | Internal server error | Azure ML-provisioned infrastructure is failing. |

## Common network isolation issues

[!INCLUDE [network isolation issues](../../includes/machine-learning-online-endpoint-troubleshooting.md)]

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint](how-to-deploy-managed-online-endpoints.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
- [Online endpoint YAML reference](reference-yaml-endpoint-online.md)
