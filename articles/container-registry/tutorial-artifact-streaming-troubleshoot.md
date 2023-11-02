---
title: "Troubleshoot Artifact Streaming"
description: "Artifact Streaming is a feature in Azure Container Registry to enhance and supercharge managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli-web
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

---

# Troubleshoot Artifact Streaming

The troubleshooting steps in this article can help you resolve common issues that you might encounter when using Artifact Streaming in Azure Container Registry (ACR). These steps and recommendations can help diagnose and resolve issues related to artifact streaming and AKS pod deployments, as well as provide insights into the underlying processes and logs for debugging purposes.

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
* Issues with image pull or streaming,streaming artifacts configurations,image sources, and resource constraints.
* Issues with ACR configurations or permissions.
* Issues with ACR Mirror and Overlaybd driver logs.

## Conversion operation failed due to an unknown error

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

If the AKS pod condition shows "UpgradeIfStreamableDisabled," check if the image is from an Azure Container Registry (azurecr.io).

## Using Digest Instead of Tag for Streaming Artifact:

If you deploy the streaming artifact using digest instead of tag (eg, mystreamingtest.azurecr.io/jupyter/all-spark-notebook@sha256:4ef83ea6b0f7763c230e696709d8d8c398e21f65542db36e82961908bcf58d18), AKS pod event and condition message will not include streaming related information. However, you may still see fast container startup as the underlying container engine will still stream the image to AKS if it detects the actual image content is streamable. 

To investigate issues further, you can run commands to inspect ACR Mirror and Overlaybd driver logs from a specific node in the AKS cluster. 

```bash
# Inspect acr_mirror and overlaybd driver logs from the node
kubectl debug nodes/<the node name> -it --image ubuntu

# Enter the host environment
chroot /host

# Access the logs
journalctl -u acr-mirror  # View acr_mirror logs
journalctl -u acr-nodemon  # View acr-nodemon logs
more /var/log/overlaybd.log  # View overlaybd driver logs
```

## Next steps
