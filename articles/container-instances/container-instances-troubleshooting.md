---
title: Troubleshooting Azure Container Instances
description: Learn how to troubleshoot issues with Azure Container Instances
services: container-instances
author: seanmck
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 03/14/2018
ms.author: seanmck
ms.custom: mvc
---

# Troubleshoot container and deployment issues in Azure Container Instances

This article shows how to troubleshoot issues when deploying containers to Azure Container Instances. It also describes some of the common issues you might run into.

## View logs and stream output

When you have a misbehaving container, start by viewing its logs with [az container logs][az-container-logs], and streaming its standard out and standard error with [az container attach][az-container-attach].

### View logs

To view logs from your application code within a container, you can use the [az container logs][az-container-logs] command.

The following is log output from the example task-based container in [Run a containerized task in ACI](container-instances-restart-policy.md), after having fed it an invalid URL to process:

```console
$ az container logs --resource-group myResourceGroup --name mycontainer
Traceback (most recent call last):
  File "wordcount.py", line 11, in <module>
    urllib.request.urlretrieve (sys.argv[1], "foo.txt")
  File "/usr/local/lib/python3.6/urllib/request.py", line 248, in urlretrieve
    with contextlib.closing(urlopen(url, data)) as fp:
  File "/usr/local/lib/python3.6/urllib/request.py", line 223, in urlopen
    return opener.open(url, data, timeout)
  File "/usr/local/lib/python3.6/urllib/request.py", line 532, in open
    response = meth(req, response)
  File "/usr/local/lib/python3.6/urllib/request.py", line 642, in http_response
    'http', request, response, code, msg, hdrs)
  File "/usr/local/lib/python3.6/urllib/request.py", line 570, in error
    return self._call_chain(*args)
  File "/usr/local/lib/python3.6/urllib/request.py", line 504, in _call_chain
    result = func(*args)
  File "/usr/local/lib/python3.6/urllib/request.py", line 650, in http_error_default
    raise HTTPError(req.full_url, code, msg, hdrs, fp)
urllib.error.HTTPError: HTTP Error 404: Not Found
```

### Attach output streams

The [az container attach][az-container-attach] command provides diagnostic information during container startup. Once the container has started, it streams STDOUT and STDERR to your local console.

For example, here is output from the task-based container in [Run a containerized task in ACI](container-instances-restart-policy.md), after having supplied a valid URL of a large text file to process:

```console
$ az container attach --resource-group myResourceGroup --name mycontainer
Container 'mycontainer' is in state 'Unknown'...
Container 'mycontainer' is in state 'Waiting'...
Container 'mycontainer' is in state 'Running'...
(count: 1) (last timestamp: 2018-03-09 23:21:33+00:00) pulling image "microsoft/aci-wordcount:latest"
(count: 1) (last timestamp: 2018-03-09 23:21:49+00:00) Successfully pulled image "microsoft/aci-wordcount:latest"
(count: 1) (last timestamp: 2018-03-09 23:21:49+00:00) Created container with id e495ad3e411f0570e1fd37c1e73b0e0962f185aa8a7c982ebd410ad63d238618
(count: 1) (last timestamp: 2018-03-09 23:21:49+00:00) Started container with id e495ad3e411f0570e1fd37c1e73b0e0962f185aa8a7c982ebd410ad63d238618

Start streaming logs:
[('the', 22979),
 ('I', 20003),
 ('and', 18373),
 ('to', 15651),
 ('of', 15558),
 ('a', 12500),
 ('you', 11818),
 ('my', 10651),
 ('in', 9707),
 ('is', 8195)]
```

## Get diagnostic events

If your container fails to deploy successfully, you need to review the diagnostic information provided by the Azure Container Instances resource provider. To view the events for your container, run the [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer
```

The output includes the core properties of your container, along with deployment events (shown here truncated):

```JSON
{
  "containers": [
    {
      "command": null,
      "environmentVariables": [],
      "image": "microsoft/aci-helloworld",
      ...
        "events": [
          {
            "count": 1,
            "firstTimestamp": "2017-12-21T22:50:49+00:00",
            "lastTimestamp": "2017-12-21T22:50:49+00:00",
            "message": "pulling image \"microsoft/aci-helloworld\"",
            "name": "Pulling",
            "type": "Normal"
          },
          {
            "count": 1,
            "firstTimestamp": "2017-12-21T22:50:59+00:00",
            "lastTimestamp": "2017-12-21T22:50:59+00:00",
            "message": "Successfully pulled image \"microsoft/aci-helloworld\"",
            "name": "Pulled",
            "type": "Normal"
          },
          {
            "count": 1,
            "firstTimestamp": "2017-12-21T22:50:59+00:00",
            "lastTimestamp": "2017-12-21T22:50:59+00:00",
            "message": "Created container with id 2677c7fd54478e5adf6f07e48fb71357d9d18bccebd4a91486113da7b863f91f",
            "name": "Created",
            "type": "Normal"
          },
          {
            "count": 1,
            "firstTimestamp": "2017-12-21T22:50:59+00:00",
            "lastTimestamp": "2017-12-21T22:50:59+00:00",
            "message": "Started container with id 2677c7fd54478e5adf6f07e48fb71357d9d18bccebd4a91486113da7b863f91f",
            "name": "Started",
            "type": "Normal"
          }
        ],
        "previousState": null,
        "restartCount": 0
      },
      "name": "mycontainer",
      "ports": [
        {
          "port": 80,
          "protocol": null
        }
      ],
      ...
    }
  ],
  ...
}
```

## Common deployment issues

The following sections describe common issues that account for most errors in container deployment:

* [Image version not supported](#image-version-not-supported)
* [Unable to pull image](#unable-to-pull-image)
* [Container continually exits and restarts](#container-continually-exits-and-restarts)
* [Container takes a long time to start](#container-takes-a-long-time-to-start)
* ["Resource not available" error](#resource-not-available-error)

## Image version not supported

If you specify an image that Azure Container Instances cannot support, an `ImageVersionNotSupported` error is returned. The value of the error is `The version of image '{0}' is not supported.`, and currently applies to Windows 1709 images. To mitigate this issue, use an LTS Windows image. Support for Windows 1709 images is underway.

## Unable to pull image

If Azure Container Instances is unable to pull your image initially, it retries for some period before eventually failing. If the image cannot be pulled, events like the following are shown in the output of [az container show][az-container-show]:

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

To resolve, delete the container and retry your deployment, paying close attention that you have typed the image name correctly.

## Container continually exits and restarts

If your container runs to completion and automatically restarts, you might need to set a [restart policy](container-instances-restart-policy.md) of **OnFailure** or **Never**. If you specify **OnFailure** and still see continual restarts, there might be an issue with the application or script executed in your container.

The Container Instances API includes a `restartCount` property. To check the number of restarts for a container, you can use the [az container show][az-container-show] command in the Azure CLI 2.0. In following example output (which has been truncated for brevity), you can see the `restartCount` property at the end of the output.

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

Windows images have [additional considerations](#use-recent-windows-images).

### Image size

If your container takes a long time to start, but eventually succeeds, start by looking at the size of your container image. Because Azure Container Instances pulls your container image on demand, the startup time you experience is directly related to its size.

You can view the size of your container image by using the `docker images` command in the Docker CLI:

```console
$ docker images
REPOSITORY                  TAG       IMAGE ID        CREATED        SIZE
microsoft/aci-helloworld    latest    7f78509b568e    13 days ago    68.1MB
```

The key to keeping image sizes small is ensuring that your final image does not contain anything that is not required at runtime. One way to do this is with [multi-stage builds][docker-multi-stage-builds]. Multi-stage builds make it easy to ensure that the final image contains only the artifacts you need for your application, and not any of the extra content that was required at build time.

### Image location

Another way to reduce the impact of the image pull on your container's startup time is to host the container image in [Azure Container Registry](/azure/container-registry/) in the same region where you intend to deploy container instances. This shortens the network path that the container image needs to travel, significantly shortening the download time.

### Use recent Windows images

Azure Container Instances uses a caching mechanism to help speed container startup time for images based on certain Windows images.

To ensure the fastest Windows container startup time, use one of the **three most recent** versions of the following **two images** as the base image:

* [Windows Server 2016][docker-hub-windows-core] (LTS only)
* [Windows Server 2016 Nano Server][docker-hub-windows-nano]

## Resource not available error

Due to varying regional resource load in Azure, you might receive the following error when attempting to deploy a container instance:

`The requested resource with 'x' CPU and 'y.z' GB memory is not available in the location 'example region' at this moment. Please retry with a different resource request or in another location.`

This error indicates that due to heavy load in the region in which you are attempting to deploy, the resources specified for your container can't be allocated at that time. Use one or more of the following mitigation steps to help resolve your issue.

* Verify your container deployment settings fall within the parameters defined in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md#region-availability)
* Specify lower CPU and memory settings for the container
* Deploy to a different Azure region
* Deploy at a later time

<!-- LINKS - External -->
[docker-multi-stage-builds]: https://docs.docker.com/engine/userguide/eng-image/multistage-build/
[docker-hub-windows-core]: https://hub.docker.com/r/microsoft/windowsservercore/
[docker-hub-windows-nano]: https://hub.docker.com/r/microsoft/nanoserver/

<!-- LINKS - Internal -->
[az-container-attach]: /cli/azure/container#az_container_attach
[az-container-logs]: /cli/azure/container#az_container_logs
[az-container-show]: /cli/azure/container#az_container_show