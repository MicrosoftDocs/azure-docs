---
title: Troubleshooting Azure Container Instances
description: Learn how to troubleshoot issues with Azure Container Instances
services: container-instances
author: seanmck
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 07/19/2018
ms.author: seanmck
ms.custom: mvc
---

# Troubleshoot common issues in Azure Container Instances

This article shows how to troubleshoot common issues for managing or deploying containers to Azure Container Instances.

## Naming conventions

When defining your container specification, certain parameters require adherence to naming restrictions. Below is a table with specific requirements for container group properties. For more information on Azure naming conventions, see [Naming conventions][azure-name-restrictions] in the Azure Architecture Center.

| Scope | Length | Casing | Valid characters | Suggested pattern | Example |
| --- | --- | --- | --- | --- | --- | --- |
| Container group name | 1-64 |Case insensitive |Alphanumeric, and hyphen anywhere except the first or last character |`<name>-<role>-CG<number>` |`web-batch-CG1` |
| Container name | 1-64 |Case insensitive |Alphanumeric, and hyphen anywhere except the first or last character |`<name>-<role>-CG<number>` |`web-batch-CG1` |
| Container ports | Between 1 and 65535 |Integer |Integer between 1 and 65535 |`<port-number>` |`443` |
| DNS name label | 5-63 |Case insensitive |Alphanumeric, and hyphen anywhere except the first or last character |`<name>` |`frontend-site1` |
| Environment variable | 1-63 |Case insensitive |Alphanumeric, and underscore (_) anywhere except the first or last character |`<name>` |`MY_VARIABLE` |
| Volume name | 5-63 |Case insensitive |Lowercase letters and numbers, and hyphens anywhere except the first or last character. Cannot contain two consecutive hyphens. |`<name>` |`batch-output-volume` |

## OS version of image not supported

If you specify an image that Azure Container Instances doesn't support, an `OsVersionNotSupported` error is returned. The error is similar to following, where `{0}` is the name of the image you attempted to deploy:

```json
{
  "error": {
    "code": "OsVersionNotSupported",
    "message": "The OS version of image '{0}' is not supported."
  }
}
```

This error is most often encountered when deploying Windows images that are based on a Semi-Annual Channel (SAC) release. For example, Windows versions 1709 and 1803 are SAC releases, and generate this error upon deployment.

Azure Container Instances supports Windows images based only on Long-Term Servicing Channel (LTSC) versions. To mitigate this issue when deploying Windows containers, always deploy LTSC-based images.

For details about the LTSC and SAC versions of Windows, see [Windows Server Semi-Annual Channel overview][windows-sac-overview].

## Unable to pull image

If Azure Container Instances is initially unable to pull your image, it retries for a period of time. If the image pull operation continues to fail, ACI eventually fails the deployment, and you may see a `Failed to pull image` error.

To resolve this issue, delete the container instance and retry your deployment. Ensure that the image exists in the registry, and that you've typed the image name correctly.

If the image can't be pulled, events like the following are shown in the output of [az container show][az-container-show]:

```bash
"events": [
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:19+00:00",
    "lastTimestamp": "2017-12-21T22:57:00+00:00",
    "message": "pulling image \"microsoft/aci-hellowrld\"",
    "name": "Pulling",
    "type": "Normal"
  },
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:19+00:00",
    "lastTimestamp": "2017-12-21T22:57:00+00:00",
    "message": "Failed to pull image \"microsoft/aci-hellowrld\": rpc error: code 2 desc Error: image t/aci-hellowrld:latest not found",
    "name": "Failed",
    "type": "Warning"
  },
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:20+00:00",
    "lastTimestamp": "2017-12-21T22:57:16+00:00",
    "message": "Back-off pulling image \"microsoft/aci-hellowrld\"",
    "name": "BackOff",
    "type": "Normal"
  }
],
```

## Container continually exits and restarts (no long-running process)

Container groups default to a [restart policy](container-instances-restart-policy.md) of **Always**, so containers in the container group always restart after they run to completion. You may need to change this to **OnFailure** or **Never** if you intend to run task-based containers. If you specify **OnFailure** and still see continual restarts, there might be an issue with the application or script executed in your container.

When running container groups without long-running processes you may see repeated exits and restarts with images such as Ubuntu or Alpine. Connecting via [EXEC](container-instances-exec.md) will not work as the container has no process keeping it alive. To resolve this include a start command like the following with your container group deployment to keep the container running.

```azurecli-interactive
## Deploying a Linux container
az container create -g MyResourceGroup --name myapp --image ubuntu --command-line "tail -f /dev/null"
```

```azurecli-interactive 
## Deploying a Windows container
az container create -g myResourceGroup --name mywindowsapp --os-type Windows --image windowsservercore:ltsc2016
 --command-line "ping -t localhost"
```

The Container Instances API and Azure portal includes a `restartCount` property. To check the number of restarts for a container, you can use the [az container show][az-container-show] command in the Azure CLI. In the following example output (which has been truncated for brevity), you can see the `restartCount` property at the end of the output.

```json
...
 "events": [
   {
     "count": 1,
     "firstTimestamp": "2017-11-13T21:20:06+00:00",
     "lastTimestamp": "2017-11-13T21:20:06+00:00",
     "message": "Pulling: pulling image \"myregistry.azurecr.io/aci-tutorial-app:v1\"",
     "type": "Normal"
   },
   {
     "count": 1,
     "firstTimestamp": "2017-11-13T21:20:14+00:00",
     "lastTimestamp": "2017-11-13T21:20:14+00:00",
     "message": "Pulled: Successfully pulled image \"myregistry.azurecr.io/aci-tutorial-app:v1\"",
     "type": "Normal"
   },
   {
     "count": 1,
     "firstTimestamp": "2017-11-13T21:20:14+00:00",
     "lastTimestamp": "2017-11-13T21:20:14+00:00",
     "message": "Created: Created container with id bf25a6ac73a925687cafcec792c9e3723b0776f683d8d1402b20cc9fb5f66a10",
     "type": "Normal"
   },
   {
     "count": 1,
     "firstTimestamp": "2017-11-13T21:20:14+00:00",
     "lastTimestamp": "2017-11-13T21:20:14+00:00",
     "message": "Started: Started container with id bf25a6ac73a925687cafcec792c9e3723b0776f683d8d1402b20cc9fb5f66a10",
     "type": "Normal"
   }
 ],
 "previousState": null,
 "restartCount": 0
...
}
```

> [!NOTE]
> Most container images for Linux distributions set a shell, such as bash, as the default command. Since a shell on its own is not a long-running service, these containers immediately exit and fall into a restart loop when configured with the default **Always** restart policy.

## Container takes a long time to start

The two primary factors that contribute to container startup time in Azure Container Instances are:

* [Image size](#image-size)
* [Image location](#image-location)

Windows images have [additional considerations](#cached-windows-images).

### Image size

If your container takes a long time to start, but eventually succeeds, start by looking at the size of your container image. Because Azure Container Instances pulls your container image on demand, the startup time you see is directly related to its size.

You can view the size of your container image by using the `docker images` command in the Docker CLI:

```console
$ docker images
REPOSITORY                  TAG       IMAGE ID        CREATED        SIZE
microsoft/aci-helloworld    latest    7f78509b568e    13 days ago    68.1MB
```

The key to keeping image sizes small is ensuring that your final image does not contain anything that is not required at runtime. One way to do this is with [multi-stage builds][docker-multi-stage-builds]. Multi-stage builds make it easy to ensure that the final image contains only the artifacts you need for your application, and not any of the extra content that was required at build time.

### Image location

Another way to reduce the impact of the image pull on your container's startup time is to host the container image in [Azure Container Registry](/azure/container-registry/) in the same region where you intend to deploy container instances. This shortens the network path that the container image needs to travel, significantly shortening the download time.

### Cached Windows images

Azure Container Instances uses a caching mechanism to help speed container startup time for images based on certain Windows images.

To ensure the fastest Windows container startup time, use one of the **three most recent** versions of the following **two images** as the base image:

* [Windows Server 2016][docker-hub-windows-core] (LTS only)
* [Windows Server 2016 Nano Server][docker-hub-windows-nano]

### Windows containers slow network readiness

Windows containers may incur no inbound or outbound connectivity for up to 5 seconds on initial creation. After initial setup, container networking should resume appropriately.

## Resource not available error

Due to varying regional resource load in Azure, you might receive the following error when attempting to deploy a container instance:

`The requested resource with 'x' CPU and 'y.z' GB memory is not available in the location 'example region' at this moment. Please retry with a different resource request or in another location.`

This error indicates that due to heavy load in the region in which you are attempting to deploy, the resources specified for your container can't be allocated at that time. Use one or more of the following mitigation steps to help resolve your issue.

* Verify your container deployment settings fall within the parameters defined in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md#region-availability)
* Specify lower CPU and memory settings for the container
* Deploy to a different Azure region
* Deploy at a later time

## Cannot connect to underlying Docker API or run privileged containers

Azure Container Instances does not expose direct access to the underlying infrastructure that hosts container groups. This includes access to the Docker API running on the container's host and running privileged containers. If you require Docker interaction, check the [REST reference documentation](https://aka.ms/aci/rest) to see what the ACI API supports. If there is something missing, submit a request on the [ACI feedback forums](https://aka.ms/aci/feedback).

## Next steps
Learn how to [retrieve container logs & events](container-instances-get-logs.md) to help debug your containers.

<!-- LINKS - External -->
[azure-name-restrictions]: https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions#naming-rules-and-restrictions
[windows-sac-overview]: https://docs.microsoft.com/windows-server/get-started/semi-annual-channel-overview
[docker-multi-stage-builds]: https://docs.docker.com/engine/userguide/eng-image/multistage-build/
[docker-hub-windows-core]: https://hub.docker.com/r/microsoft/windowsservercore/
[docker-hub-windows-nano]: https://hub.docker.com/r/microsoft/nanoserver/

<!-- LINKS - Internal -->
[az-container-show]: /cli/azure/container#az-container-show
