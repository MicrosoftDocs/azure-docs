---
title: "Troubleshoot Artifact Streaming"
description: "Troubleshoot Artifact Streaming in Azure Container Registry to diagnose and resolve with managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

---

# Troubleshoot Artifact Streaming

The troubleshooting steps in this article can help you resolve common issues that you might encounter when using Artifact Streaming in Azure Container Registry (ACR). These steps and recommendations can help diagnose and resolve issues related to artifact streaming as well as provide insights into the underlying processes and logs for debugging purposes.

This article is part four in a four-part tutorial series. In this tutorial, you learn how to:

>*  [Artifact Streaming(Preview)](tutorial-artifact-streaming.md)
> * [Artifact Streaming - Azure CLI](tutorial-artifact-streaming-cli.md)
> * [Artifact Streaming - Azure Portal](tutorial-artifact-streaming-portal.md)
> * [Troubleshoot Artifact Streaming](tutorial-artifact-streaming-troubleshoot.md)

## Symptoms

* Conversion operation failed due to an unknown error.
* Troubleshooting Failed AKS Pod Deployments.
* Pod conditions indicate "UpgradeIfStreamableDisabled."
* Using Digest Instead of Tag for Streaming Artifact

## Causes

* Issues with authentication, network latency, image retrieval, streaming operations, or other issues.
* Issues with image pull or streaming, streaming artifacts configurations, image sources, and resource constraints.
* Issues with ACR configurations or permissions.

## Conversion operation failed due to an unknown error

| Error Code                  | Error Message                                                                     | Troubleshooting Info                                                                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UNKNOWN_ERROR               | Conversion operation failed due to an unknown error.                              | Caused by an internal error. A retry may help but if unsucessful may need to contact support.                                                                                                                                                             |
| RESOURCE_NOT_FOUND          | Conversion operation failed because target resource was not found.                 | The target image was not found in the registry. This may be caused by a typo in the image digest, the image may have been deleted or otherwise missing in the target region (replication consistency is not immediate for example).                       |
| UNSUPPORTED_PLATFORM        | Conversion is not currently supported for image platform.                          | Only linux/amd64 images are initially supported.                                                                                                                                                                                                         |
| NO_SUPPORTED_PLATFORM_FOUND | Conversion is not currently supported for any of the image platforms in the index. | Only linux/amd64 images are initially supported. No image with this platform was found in the target index.                                                                                                                                               |
| UNSUPPORTED_MEDIATYPE       | Conversion is not supported for the image MediaType.                               | Conversion can only target images with mediatype: application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.v2+json or application/vnd.docker.distribution.manifest.list.v2+json |
| UNSUPPORTED_ARTIFACT_TYPE   | Conversion is not supported for the image ArtifactType.                            | Streaming Artifacts (Artifact type: application/vnd.azure.artifact.streaming.v1) cannot be converted again.                                                                                                                                              |
| IMAGE_NOT_RUNNABLE          | Conversion is not supported for non-runnable images.                               | Only linux/amd64 runnable images are initially supported.                                                                                                                                                                                                 |

If an artifact-streaming operation fails with the message "Conversion operation failed due to an unknown error," follow these steps to troubleshoot the issue:

1. Search Kusto logs by operation ID.
1. Access the Kusto logs at the provided URL 
1. Use a query to filter logs by the specified operation ID.

```kusto
KubernetesContainers
| where PreciseTimeStamp > ago(2h)
| where operationid == "f9bfc66a-1885-445c-b811-d9da8a946a2d"
| project-reorder PreciseTimeStamp, correlationid, trace_id, http_request_method, vars_name, vars_digest, ContainerName, RegionStamp, msg, duration, Node, PodName, Tenant, http_request_useragent, http_response_status, service, message, Host, level 
```

1. Check the conversion status

Check the status of the conversion operation using the operation ID provided in the output of the previous command. It will show the progress and status of the conversion.

For example, run the command [az acr artifact-streaming operation show] to check the status of the conversion operation for the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation show --repository jupyter/all-spark-notebook --id c015067a-7463-4a5a-9168-3b17dbe42ca3
```

## Troubleshooting Failed AKS Pod Deployments

If AKS pod deployment fails with an error related to image pulling, like the following example

```bash
Failed to pull image "mystreamingtest.azurecr.io/jupyter/all-spark-notebook:latest":
rpc error: code = Unknown desc = failed to pull and unpack image
"mystreamingtest.azurecr.io/latestobd/jupyter/all-spark-notebook:latest":
failed to resolve reference "mystreamingtest.azurecr.io/jupyter/all-spark-notebook:latest":
unexpected status from HEAD request to http://localhost:8578/v2/jupyter/all-spark-notebook/manifests/latest?ns=mystreamingtest.azurecr.io:503 Service Unavailable
```

To troubleshoot this issue, you should check the following:

1. Verify if the AKS have permissions to access the container registry `mystreamingtest.azurecr.io`
1. Ensure that the container registry `mystreamingtest.azurecr.io` is accessible and properly attached to AKS.

## Checking for "UpgradeIfStreamableDisabled" Pod Condition:

If the AKS pod condition shows "UpgradeIfStreamableDisabled," check if the image is from an Azure Container Registry.

## Using Digest Instead of Tag for Streaming Artifact:

If you deploy the streaming artifact using digest instead of tag (eg, mystreamingtest.azurecr.io/jupyter/all-spark-notebook@sha256:4ef83ea6b0f7763c230e696709d8d8c398e21f65542db36e82961908bcf58d18), AKS pod event and condition message will not include streaming related information. However, you may still see fast container startup as the underlying container engine will still stream the image to AKS if it detects the actual image content is streamable. 

## Next steps
