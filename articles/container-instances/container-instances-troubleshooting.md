---
title: Troubleshoot common issues
description: Learn how to troubleshoot common issues when your deploy, run, or manage Azure Container Instances
ms.topic: article
ms.date: 06/25/2020
ms.custom: mvc, devx-track-azurecli
---

# Troubleshoot common issues in Azure Container Instances

This article shows how to troubleshoot common issues for managing or deploying containers to Azure Container Instances. See also [Frequently asked questions](container-instances-faq.md).

If you need additional support, see available **Help + support** options in the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Issues during container group deployment
### Naming conventions

When defining your container specification, certain parameters require adherence to naming restrictions. Below is a table with specific requirements for container group properties. For more information, see [Naming conventions][azure-name-restrictions] in the Azure Architecture Center and [Naming rules and restrictions for Azure resources][naming-rules].

| Scope | Length | Casing | Valid characters | Suggested pattern | Example |
| --- | --- | --- | --- | --- | --- |
| Container name<sup>1</sup> | 1-63 |Lowercase | Alphanumeric, and hyphen anywhere except the first or last character |`<name>-<role>-container<number>` |`web-batch-container1` |
| Container ports | Between 1 and 65535 |Integer |Integer between 1 and 65535 |`<port-number>` |`443` |
| DNS name label | 5-63 |Case insensitive |Alphanumeric, and hyphen anywhere except the first or last character |`<name>` |`frontend-site1` |
| Environment variable | 1-63 |Case insensitive |Alphanumeric, and underscore (_) anywhere except the first or last character |`<name>` |`MY_VARIABLE` |
| Volume name | 5-63 |Lowercase |Alphanumeric, and hyphens anywhere except the first or last character. Cannot contain two consecutive hyphens. |`<name>` |`batch-output-volume` |

<sup>1</sup>Restriction also for container group names when not specified independently of container instances, for example with `az container create` command deployments.

### OS version of image not supported

If you specify an image that Azure Container Instances doesn't support, an `OsVersionNotSupported` error is returned. The error is similar to following, where `{0}` is the name of the image you attempted to deploy:

```json
{
  "error": {
    "code": "OsVersionNotSupported",
    "message": "The OS version of image '{0}' is not supported."
  }
}
```

This error is most often encountered when deploying Windows images that are based on Semi-Annual Channel release 1709 or 1803, which are not supported. For supported Windows images in Azure Container Instances, see [Frequently asked questions](container-instances-faq.md#what-windows-base-os-images-are-supported).

### Unable to pull image

If Azure Container Instances is initially unable to pull your image, it retries for a period of time. If the image pull operation continues to fail, ACI eventually fails the deployment, and you may see a `Failed to pull image` error.

To resolve this issue, delete the container instance and retry your deployment. Ensure that the image exists in the registry, and that you've typed the image name correctly.

If the image can't be pulled, events like the following are shown in the output of [az container show][az-container-show]:

```bash
"events": [
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:19+00:00",
    "lastTimestamp": "2017-12-21T22:57:00+00:00",
    "message": "pulling image \"mcr.microsoft.com/azuredocs/aci-hellowrld\"",
    "name": "Pulling",
    "type": "Normal"
  },
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:19+00:00",
    "lastTimestamp": "2017-12-21T22:57:00+00:00",
    "message": "Failed to pull image \"mcr.microsoft.com/azuredocs/aci-hellowrld\": rpc error: code 2 desc Error: image t/aci-hellowrld:latest not found",
    "name": "Failed",
    "type": "Warning"
  },
  {
    "count": 3,
    "firstTimestamp": "2017-12-21T22:56:20+00:00",
    "lastTimestamp": "2017-12-21T22:57:16+00:00",
    "message": "Back-off pulling image \"mcr.microsoft.com/azuredocs/aci-hellowrld\"",
    "name": "BackOff",
    "type": "Normal"
  }
],
```
### Resource not available error

Due to varying regional resource load in Azure, you might receive the following error when attempting to deploy a container instance:

`The requested resource with 'x' CPU and 'y.z' GB memory is not available in the location 'example region' at this moment. Please retry with a different resource request or in another location.`

This error indicates that due to heavy load in the region in which you are attempting to deploy, the resources specified for your container can't be allocated at that time. Use one or more of the following mitigation steps to help resolve your issue.

* Verify your container deployment settings fall within the parameters defined in [Region availability for Azure Container Instances](container-instances-region-availability.md)
* Specify lower CPU and memory settings for the container
* Deploy to a different Azure region
* Deploy at a later time

## Issues during container group runtime
### Container continually exits and restarts (no long-running process)

Container groups default to a [restart policy](container-instances-restart-policy.md) of **Always**, so containers in the container group always restart after they run to completion. You may need to change this to **OnFailure** or **Never** if you intend to run task-based containers. If you specify **OnFailure** and still see continual restarts, there might be an issue with the application or script executed in your container.

When running container groups without long-running processes you may see repeated exits and restarts with images such as Ubuntu or Alpine. Connecting via [EXEC](container-instances-exec.md) will not work as the container has no process keeping it alive. To resolve this problem, include a start command like the following with your container group deployment to keep the container running.

```azurecli-interactive
## Deploying a Linux container
az container create -g MyResourceGroup --name myapp --image ubuntu --command-line "tail -f /dev/null"
```

```azurecli-interactive 
## Deploying a Windows container
az container create -g myResourceGroup --name mywindowsapp --os-type Windows --image mcr.microsoft.com/windows/servercore:ltsc2019
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

### Container takes a long time to start

The three primary factors that contribute to container startup time in Azure Container Instances are:

* [Image size](#image-size)
* [Image location](#image-location)
* [Cached images](#cached-images)

Windows images have [additional considerations](#cached-images).

#### Image size

If your container takes a long time to start, but eventually succeeds, start by looking at the size of your container image. Because Azure Container Instances pulls your container image on demand, the startup time you see is directly related to its size.

You can view the size of your container image by using the `docker images` command in the Docker CLI:

```console
$ docker images
REPOSITORY                                    TAG       IMAGE ID        CREATED          SIZE
mcr.microsoft.com/azuredocs/aci-helloworld    latest    7367f3256b41    15 months ago    67.6MB
```

The key to keeping image sizes small is ensuring that your final image does not contain anything that is not required at runtime. One way to do this is with [multi-stage builds][docker-multi-stage-builds]. Multi-stage builds make it easy to ensure that the final image contains only the artifacts you need for your application, and not any of the extra content that was required at build time.

#### Image location

Another way to reduce the impact of the image pull on your container's startup time is to host the container image in [Azure Container Registry](../container-registry/index.yml) in the same region where you intend to deploy container instances. This shortens the network path that the container image needs to travel, significantly shortening the download time.

#### Cached images

Azure Container Instances uses a caching mechanism to help speed container startup time for images built on common [Windows base images](container-instances-faq.md#what-windows-base-os-images-are-supported), including `nanoserver:1809`, `servercore:ltsc2019`, and `servercore:1809`. Commonly used Linux images such as `ubuntu:1604` and `alpine:3.6` are also cached. For both Windows and Linux images, avoid using the `latest` tag. Review Container Registry's [Image tag best practices](../container-registry/container-registry-image-tag-version.md) for guidance. For an up-to-date list of cached images and tags, use the [List Cached Images][list-cached-images] API.

> [!NOTE]
> Use of Windows Server 2019-based images in Azure Container Instances is in preview.

#### Windows containers slow network readiness

On initial creation, Windows containers may have no inbound or outbound connectivity for up to 30 seconds (or longer, in rare cases). If your container application needs an Internet connection, add delay and retry logic to allow 30 seconds to establish Internet connectivity. After initial setup, container networking should resume appropriately.

### Cannot connect to underlying Docker API or run privileged containers

Azure Container Instances does not expose direct access to the underlying infrastructure that hosts container groups. This includes access to the Docker API running on the container's host and running privileged containers. If you require Docker interaction, check the [REST reference documentation](/rest/api/container-instances/) to see what the ACI API supports. If there is something missing, submit a request on the [ACI feedback forums](https://aka.ms/aci/feedback).

### Container group IP address may not be accessible due to mismatched ports

Azure Container Instances doesn't yet support port mapping like with regular docker configuration. If you find a container group's IP address is not accessible when you believe it should be, ensure you have configured your container image to listen to the same ports you expose in your container group with the `ports` property.

If you want to confirm that Azure Container Instances can listen on the port you configured in your container image, test a deployment of the `aci-helloworld` image that exposes the port. Also run the `aci-helloworld` app so that it listens on the port. `aci-helloworld` accepts an optional environment variable `PORT` to override the default port 80 it listens on. For example, to test port 9000, set the [environment variable](container-instances-environment-variables.md) when you create the container group:

1. Set up the container group to expose port 9000, and pass the port number as the value of the environment variable. The example is formatted for the Bash shell. If you prefer another shell such as PowerShell or Command Prompt, you'll need to adjust variable assignment accordingly.
    ```azurecli
    az container create --resource-group myResourceGroup \
    --name mycontainer --image mcr.microsoft.com/azuredocs/aci-helloworld \
    --ip-address Public --ports 9000 \
    --environment-variables 'PORT'='9000'
    ```
1. Find the IP address of the container group in the command output of `az container create`. Look for the value of **ip**. 
1. After the container is provisioned successfully, browse to the IP address and port of the container app in your browser, for example: `192.0.2.0:9000`. 

    You should see the "Welcome to Azure Container Instances!" message displayed by the web app.
1. When you're done with the container, remove it using the `az container delete` command:

    ```azurecli
    az container delete --resource-group myResourceGroup --name mycontainer
    ```

## Next steps

Learn how to [retrieve container logs and events](container-instances-get-logs.md) to help debug your containers.

<!-- LINKS - External -->
[azure-name-restrictions]: /azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#naming-and-tagging-resources
[naming-rules]: ../azure-resource-manager/management/resource-name-rules.md
[windows-sac-overview]: /windows-server/get-started/semi-annual-channel-overview
[docker-multi-stage-builds]: https://docs.docker.com/engine/userguide/eng-image/multistage-build/
[docker-hub-windows-core]: https://hub.docker.com/_/microsoft-windows-servercore
[docker-hub-windows-nano]: https://hub.docker.com/_/microsoft-windows-nanoserver

<!-- LINKS - Internal -->
[az-container-show]: /cli/azure/container#az_container_show
[list-cached-images]: /rest/api/container-instances/location/listcachedimages
