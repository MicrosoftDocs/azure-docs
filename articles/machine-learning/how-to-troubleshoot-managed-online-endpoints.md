---
title: Troubleshooting managed online endpoints deployment (preview)
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot some common deployment and scoring errors with Managed Online Endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: petrodeg
ms.author:  petrodeg
ms.reviewer: laobri
ms.date: 05/13/2021
ms.topic: troubleshooting
ms.custom: devplatv2
#Customer intent: As a data scientist, I want to figure out why my managed online endpoint deployment failed so that I can fix it.
---

# Troubleshooting managed online endpoints deployment and scoring (preview)

Learn how to resolve common issues in the deployment and scoring of Azure Machine Learning managed online endpoints (preview).

This document is structured in the way you should approach troubleshooting:

1. Use [local deployment](#deploy-locally) to test and debug your models locally before deploying in the cloud.
1. Use [container logs](#get-container-logs) to help debug issues.
1. Understand [common deployment errors](#common-deployment-errors) that might arise and how to fix them.

The section [HTTP status codes](#http-status-codes) explains how invocation and prediction errors map to HTTP status codes when scoring endpoints with REST requests.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* The [Azure CLI](/cli/azure/install-azure-cli).
* The [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md).

## Deploy locally

Local deployment is deploying a model to a local Docker environment. Local deployment is useful for testing and debugging before to deployment to the cloud.

Local deployment supports creation, update, and deletion of a local endpoint. It also allows you to invoke and get logs from the endpoint. To use local deployment, add `--local` to the appropriate CLI command:

```azurecli
az ml endpoint create -n <endpoint-name> -f <spec_file.yaml> --local
```
As a part of local deployment the following steps take place:

- Docker either builds a new container image or pulls an existing image from the local Docker cache. An existing image is used if there's one that matches the environment part of the specification file.
- Docker starts a new container with mounted local artifacts such as model and code files.

For more, see [Deploy locally in Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints).

## Get container logs

You can't get direct access to the VM where the model is deployed. However, you can get logs from some of the containers that are running on the VM. The amount of information depends on the provisioning status of the deployment. If the specified container is up and running you'll see its console output, otherwise you'll get a message to try again later.

To see log output from container, use the following CLI command:

```azurecli
az ml endpoint get-logs -n <endpoint-name> -d <deployment-name> -l 100
```

or

```azurecli
    az ml endpoint get-logs --name <endpoint-name> --deployment <deployment-name> --lines 100
```

Add `--resource-group` and `--workspace-name` to the commands above if you have not already set these parameters via `az configure`.

To see information about how to set these parameters, and if current values are already set, run:

```azurecli
az ml endpoint get-logs -h
```

By default the logs are pulled from the inference server. Logs include the console log from the inference server, which contains print/log statements from your `score.py' code.

> [!NOTE]
> If you use Python logging, ensure you use the correct logging level order for the messages to be published to logs. For example, INFO.


You can also get logs from the storage initializer container by passing `–-container storage-initializer`. These logs contain information on whether code and model data were successfully downloaded to the container.

Add `--help` and/or `--debug` to commands to see more information. Include the `x-ms-client-request-id` header to help with troubleshooting.

## Common deployment errors

Below is a list of common deployment errors that are reported as part of the deployment operation status.

### ERR_1100: Not enough quota

Before deploying a model, you need to have enough compute quota. This quota defines how much virtual cores are available per subscription, per workspace, per SKU, and per region. Each deployment subtracts from available quota and adds it back after deletion, based on type of the SKU.

A possible mitigation is to check if there are unused deployments that can be deleted. Or you can submit a [request for a quota increase](./how-to-manage-quotas.md).

### ERR_1101: Out of capacity

The specified VM Size failed to provision due to a lack of Azure Machine Learning capacity. Retry later or try deploying to a different region.

### ERR_1200: Unable to download user container image

During deployment creation after the compute provisioning, Azure tries to pull the user container image from the workspace private Azure Container Registry (ACR). There could be two possible issues.

- The user container image isn't found.

  Make sure container image is available in workspace ACR.
For example, if image is `testacr.azurecr.io/azureml/azureml_92a029f831ce58d2ed011c3c42d35acb:latest` check the repository with
`az acr repository show-tags -n testacr --repository azureml/azureml_92a029f831ce58d2ed011c3c42d35acb --orderby time_desc --output table`.

- There's a permission issue accessing ACR.

  To pull the image, Azure uses [managed identities](../active-directory/managed-identities-azure-resources/overview.md) to access ACR. 

  - If you created the associated endpoint with SystemAssigned, then Azure role-based access control (RBAC) permission is automatically granted, and no further permissions are needed.
  - If you created the associated endpoint with UserAssigned, then the user's managed identity must have AcrPull permission for the workspace ACR.

To get more details about this error, run:

```azurecli
az ml endpoint get-logs -n <endpoint-name> --deployment <deployment-name> --tail 100
```

### ERR_1300: Unable to download user model\code artifacts

After provisioning the compute resource, during deployment creation, Azure tries to mount the user model and code artifacts into the user container from the workspace storage account.

- User model\code artifacts not found.

  - Make sure model and code artifacts are registered to the same workspace as the deployment. Use the `show` command to show details for a model or code artifact in a workspace. For example: 
  
    ```azurecli
    az ml model show --name <model-name>
    az ml code show --name <code-name> --version <version>
    ```

  - You can also check if the blobs are present in the workspace storage account.

    For example, if the blob is `https://foobar.blob.core.windows.net/210212154504-1517266419/WebUpload/210212154504-1517266419/GaussianNB.pkl` you can use this command to check if it exists: `az storage blob exists --account-name foobar --container-name 210212154504-1517266419 --name WebUpload/210212154504-1517266419/GaussianNB.pkl --subscription <sub-name>`

- Permission issue accessing ACR.

  To pull blobs, Azure uses [managed identities](../active-directory/managed-identities-azure-resources/overview.md) to access the storage account.

  - If you created the associated endpoint with SystemAssigned, Azure role-based access control (RBAC) permission is automatically granted, and no further permissions are needed.

  - If you created the associated endpoint with UserAssigned, the user's managed identity must have Storage blob data reader permission on the workspace storage account.

To get more details about this error, run:

```azurecli
az ml endpoint get-logs -n <endpoint-name> --deployment <deployment-name> --lines 100
```

### ERR_1350: Unable to download user model, not enough space on the disk

This issue happens when the size of the model is bigger than the available disk space. Try an SKU with more disk space.

### ERR_2100: Unable to start user container

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container.

This error means that this container couldn't start, which means scoring could not happen. It could be that the container is requesting more resources than what `instance_type` could support. If so, consider updating the `instance_type` of the online deployment.

To get the exact reason for an error, run: 

```azurecli
az ml endpoint get-logs
```

### ERR_2200: User container has crashed\terminated

To run the `score.py` provided as part of the deployment, Azure creates a container that includes all the resources that the `score.py` needs, and runs the scoring script on that container.  The error in this scenario is that this container is crashing when running, which means scoring couldn't happen. This error happens when:

- There's an error in `score.py`. Use `get--logs` to help diagnose common problems:
    - A package that was  imported but is not in the conda environment
    - A syntax error
    - A failure in the `init()` method
- Readiness or liveness probes are not set up correctly.
- There's an error in the environment setup of the container, such as a missing dependency.

### ERR_5000: Internal error

While we do our best to provide a stable and reliable service, sometimes things don't go according to plan. If you get this error, it means something isn't right on our side and we need to fix it. Submit a [customer support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) with all related information and we'll address the issue.  

## HTTP status codes

When you access managed online endpoints with REST requests, the returned status codes adhere to the standards for [HTTP status codes](https://aka.ms/http-status-codes). Below are details about how managed endpoint invocation and prediction errors map to HTTP status codes.

| Status code| Reason phrase |	Why this code might get returned |
| --- | --- | --- |
| 200 | OK | Your model executed successfully, within your latency bound. |
| 401 | Unauthorized | You don't have permission to do the requested action, such as score, or your token is expired. |
| 404 | Not found | Your URL isn't correct. |
| 408 | Request timeout | The model execution took longer than the timeout supplied in `request_timeout_ms` under `request_settings` of your model deployment config.|
| 413 | Payload too large | Your request payload is larger than 1.5 megabytes. |
| 424 | Model Error; original-code=`<original code>` | If your model container returns a non-200 response, Azure returns a 424. |
| 424 | Response payload too large | If your container returns a payload larger than 1.5 megabytes, Azure returns a 424. |
| 429 | Rate-limiting | You attempted to send more than 100 requests per second to your endpoint. |
| 429 | Too many pending requests | Your model is getting more requests than it can handle. We allow 2*`max_concurrent_requests_per_instance`*`instance_count` requests at any time. Additional requests are rejected. You can confirm these settings in your model deployment config under `request_settings` and `scale_settings`. If you are using auto-scaling, your model is getting requests faster than the system can scale up. With auto-scaling, you can try to resend requests with [exponential backoff](https://aka.ms/exponential-backoff). Doing so can give the system time to adjust. |
| 500 | Internal server error | Azure ML-provisioned infrastructure is failing. |

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)
- [Managed online endpoints (preview) YAML reference](reference-yaml-endpoint-managed-online.md)

