---
title: How to install and run containers
titlesuffix: Computer Vision - Cognitive Services - Azure
description: How to download, install, and run containers for Computer Vision in this walkthrough tutorial.
services: cognitive-services
author: deken
manager: nolachar
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 08/28/2018
ms.author: v-deken
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service, including its dependencies & configuration, is packaged together as a container image. With little or no modification, a container image can then be deployed on a container host. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

The Recognize Text portion of Computer Vision is also available as a Docker container. It allows you to detect and extract printed text from images of various objects with different surfaces and backgrounds, such as receipts, posters, and business cards.  
> [!IMPORTANT]
> The Recognize Text container currently works only with English.

## Preparation

You must satisfy the following prerequisites before using the Recognize Text container:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/), [Azure Container Instances](/azure/container-instances/), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure/azure-stack/). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

* For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

### Server Requirements and Recommendations

The Recognize Text container requires a minimum of 1 CPU core, at least 2.6 gigahertz (GHz) or faster, and 8 gigabytes (GB) of allocated memory, but we recommend at least 2 CPU cores and 8 GB of allocated memory.

## Installation

The Recognize Text container image is available from a private Docker container registry, named `containerpreview.azurecr.io`, in Azure Container Registry. To install and instantiate a container provided by Cognitive Services Containers, you must perform the following steps:

1. [Request access to the private container registry](#request-access-to-the-private-container-registry)
2. [Log in to the private container registry](#log-in-to-the-private-container-registry)
3. [Download container images from the private container registry](#download-container-images-from-the-private-container-registry)
4. [Instantiate a container from a downloaded container image](#instantiate-a-container-from-a-downloaded-container-image)

### Request access to the private container registry

You must first complete and submit the [Cognitive Services Vision Containers Request form](https://aka.ms/VisionContainersPreview) to request access to the Recognize Text container. The form requests information about you, your company, and the user scenario for which you'll use the container. Once submitted, the Azure Cognitive Services team reviews the form to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> You must specify an email address associated with either a Microsoft Account (MSA) or Azure Active Directory (AAD) account in the form.

If your request is approved, you then receive an email with instructions describing how to obtain your credentials and access the private container registry.

### Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services Containers, but the recommended method from the command line is by using the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).

Use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, as shown in the following example, to log into `containerpreview.azurecr.io`, the private container registry for Cognitive Services Containers. Replace *\<username\>* with the user name and *\<password\>* with the password provided in the credentials you received from the Azure Cognitive Services team.

  ```docker
  docker login containerpreview.azurecr.io -u <username> -p <password>
  ```

If you have secured your credentials in a text file, you can concatenate the contents of that text file, using the `cat` command, to the `docker login` command as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file containing the password and *\<username\>* with the user name provided in your credentials.

  ```docker
  cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
  ```

## Download container images from Microsoft Container Registry

The container image for the Recognize Text container is available from a private Docker container registry, named `containerpreview.azurecr.io`, in Azure Container Registry. The container image for the Recognize Text container must be downloaded from the repository to run the container locally.

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the repository. For example, to download the latest Recognize Text container image from the repository, use the following command:

  ```Docker
  docker pull containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text:latest
  ```

For a full description of available tags for the Recognize Text container, see [Recognize Text](https://go.microsoft.com/fwlink/?linkid=2018655) on Docker Hub.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

### Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command instantiates a container from the Face container image, allocating 1 CPU and 4 gigabytes (GB) of memory, exposing TCP port 5000 and allocating a pseudo-TTY for the container, and automatically removing the container after it exits.

  ```docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 containerpreview.azurecr.io/microsoft/cognitive-services-face
  ```

Once instantiated, you can perform operations with the container by using the container's host URI. For example, the following host URI represents the Face container that was instantiated in the previous example:

  ```http
  http://localhost:5000/
  ```

> **Important:** You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Face container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```





## Download container images from Microsoft Container Registry

The container image for the Recognize Text container is available from Microsoft Container Registry, in the `mcr.microsoft.com/azure-cognitive-services/recognize-text` repository. The container image for the Recognize Text container must be downloaded from the repository to run the container locally.

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the repository. For example, to download the latest Recognize Text container image from the repository, use the following command:

  ```Docker
  docker pull mcr.microsoft.com/azure-cognitive-services/recognize-text:latest
  ```

For a full description of available tags for the Recognize Text container, see [Recognize Text](https://go.microsoft.com/fwlink/?linkid=2018655) on Docker Hub.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

## Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command instantiates a container from the Recognize Text container image, allocating 1 CPU and 4 gigabytes (GB) of memory, exposing TCP port 5000 and allocating a pseudo-TTY for the container, and automatically removing the container after it exits.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/recognize-text Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/vision/v1.0 ApiKey=0123456789
  ```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` command line options must be specified to instantiate the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Once instantiated, you can perform operations with the container by using the container's host URI. For example, the following host URI represents the Recognize Text container that was instantiated in the previous example:

  ```http
  http://localhost:5000/
  ```

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Recognize Text container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

You can either [call the REST API operations](https://docs.microsoft.com/azure/cognitive-services/computer-vision/vision-api-how-to-topics/howtocallvisionapi) available from your container for asynchronously or synchronously recognizing text, or use the [Azure Cognitive Services Computer Vision SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision) client library to invoke those operations.  
> [!IMPORTANT]
> You must have Azure Cognitive Services Computer Vision SDK version 3.2.0 or later if you want to use the client library with your container.

### Asynchronously recognizing text

You can use the `POST /vision/v2.0/recognizeText` and `GET /vision/v2.0/textOperations/*{id}*` operations in concert to asynchronously recognize printed text in an image, similar to how the Computer Vision service uses those corresponding REST operations. The Recognize Text container only recognizes printed text, not handwritten text, at this time, so the `mode` parameter normally specified for the Computer Vision service operation is ignored by the Recognize Text container.

### Synchronously recognizing text

You can use the `POST /vision/v2.0/recognizeTextDirect` operation to synchronously recognize printed text in an image. Because this operation is synchronous, the request body for this operation is the same as that for the `POST /vision/v2.0/recognizeText` operation, but the response body for this operation is the same as that returned by the `GET /vision/v2.0/textOperations/*{id}*` operation.

### Billing

The Recognize Text container sends billing information to Azure, using a corresponding Computer Vision resource on your Azure account. The following options are used by the Recognize Text container for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Computer Vision resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned Computer Vision Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the Computer Vision resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned Computer Vision Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](computer-vision-resource-container-config.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Computer Vision containers. In summary:

* Computer Vision provides one Linux containers for Docker, to detect and extract printed text.
* Container images are downloaded from a private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to invoke operations in Computer Vision containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

## See also

[Computer Vision overview](Home.md)  
[Computer Vision API](//westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa)
[Frequently asked questions (FAQ)](FAQ.md)</br>

## Next steps

> [!div class="nextstepaction"]
> [Configuring Computer Vision containers](computer-vision-resource-container-config.md)