---
title: "Troubleshoot artifact streaming"
description: "Troubleshoot Artifact Streaming in Azure Container Registry to diagnose and resolve with managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

---

# Troubleshoot artifact streaming

The troubleshooting steps in this article can help you resolve common issues that you might encounter when using artifact streaming in Azure Container Registry (ACR). These steps and recommendations can help diagnose and resolve issues related to artifact streaming as well as provide insights into the underlying processes and logs for debugging purposes.

This article is part four in a four-part tutorial series. In this tutorial, you learn how to:

*  [Artifact Streaming(Preview)](tutorial-artifact-streaming.md)
* [Artifact Streaming - Azure CLI](tutorial-artifact-streaming-cli.md)
* [Artifact Streaming - Azure portal](tutorial-artifact-streaming-portal.md)
* [Troubleshoot Artifact Streaming](tutorial-artifact-streaming-troubleshoot.md)

## Symptoms

* Conversion operation failed due to an unknown error
* Troubleshooting failed AKS pod deployments
* Pod conditions indicate UpgradeIfStreamableDisabled
* Using digest instead of tag for streaming artifact

## Causes

* Issues with authentication, network latency, image retrieval, streaming operations, or other issues.
* Issues with image pull or streaming, streaming artifacts configurations, image sources, and resource constraints.
* Issues with ACR configurations or permissions.

## Conversion operation failed

| Error Code                  | Error Message                                                                     | Troubleshooting Info                                                                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UNKNOWN_ERROR               | Conversion operation failed due to an unknown error.                              | Caused by an internal error. A retry helps here. If retry is unsuccessful contact support.                                                                                                                                                             |
| RESOURCE_NOT_FOUND          | Conversion operation failed because target resource isn't found.                 | If the target image isn't found in the registry. Verify typos in the image digest, if the image is deleted, or missing in the target region (replication consistency is not immediate for example)                      |
| UNSUPPORTED_PLATFORM        | Conversion is not currently supported for image platform.                          | Only linux/amd64 images are initially supported.                                                                                                                                                                                                         |
| NO_SUPPORTED_PLATFORM_FOUND | Conversion is not currently supported for any of the image platforms in the index. | Only linux/amd64 images are initially supported. No image with this platform is found in the target index.                                                                                                                                               |
| UNSUPPORTED_MEDIATYPE       | Conversion is not supported for the image MediaType.                               | Conversion can only target images with media type: application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.v2+json or application/vnd.docker.distribution.manifest.list.v2+json |
| UNSUPPORTED_ARTIFACT_TYPE   | Conversion isn't supported for the image ArtifactType.                            | Streaming Artifacts (Artifact type: application/vnd.azure.artifact.streaming.v1) can't be converted again.                                                                                                                                              |
| IMAGE_NOT_RUNNABLE          | Conversion isn't supported for nonrunnable images.                               | Only linux/amd64 runnable images are initially supported.                                                                                                                                                                                                 |

## Troubleshoot failed AKS pod deployments

If AKS pod deployment fails with an error related to image pulling, like the following example

```bash
Failed to pull image "mystreamingtest.azurecr.io/jupyter/all-spark-notebook:latest":
rpc error: code = Unknown desc = failed to pull and unpack image
"mystreamingtest.azurecr.io/latestobd/jupyter/all-spark-notebook:latest":
failed to resolve reference "mystreamingtest.azurecr.io/jupyter/all-spark-notebook:latest":
unexpected status from HEAD request to http://localhost:8578/v2/jupyter/all-spark-notebook/manifests/latest?ns=mystreamingtest.azurecr.io:503 Service Unavailable
```

To troubleshoot this issue, you should check the following:

1. Verify if the AKS has permissions to access the container registry `mystreamingtest.azurecr.io`
1. Ensure that the container registry `mystreamingtest.azurecr.io` is accessible and properly attached to AKS.

## Check for UpgradeIfStreamableDisabled pod condition:

If the AKS pod condition shows "UpgradeIfStreamableDisabled," check if the image is from an Azure Container Registry.

## Use digest instead of tag for streaming artifact:

If you deploy the streaming artifact using digest instead of tag (for example, mystreamingtest.azurecr.io/jupyter/all-spark-notebook@sha256:4ef83ea6b0f7763c230e696709d8d8c398e21f65542db36e82961908bcf58d18), AKS pod event and condition message won't include streaming related information. However, you see fast container startup as the underlying container engine. This engine stream the image to AKS if it detects the actual image content is streamable. 

## Next steps

> [Artifact Streaming - Overview](tutorial-artifact-streaming.md)
> [Enable Artifact Streaming - Azure portal](tutorial-artifact-streaming-portal.md) 
> [Enable Artifact Streaming - Azure CLI](tutorial-artifact-streaming-cli.md)
> [Troubleshoot](tutorial-artifact-streaming-troubleshoot.md)
