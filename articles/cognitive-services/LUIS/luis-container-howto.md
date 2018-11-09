---
title: How to install and run containers
titlesuffix: LUIS - Cognitive Services - Azure
description: How to download, install, and run containers for LUIS in this walkthrough tutorial.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 11/14/2018
ms.author: diberry
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service is packaged as a container image. The configuration and dependencies for the application or service are included in the container image. The container image can then be deployed on a container host with little or no modification. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

LUIS allows you to get prediction queries to identify the intent and entities of conversational, natural language text, using LUIS applications that you create and export from the Language Understanding service. You can also capture and import application query logs to the Language Understanding service for review, to improve prediction accuracy through active learning.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Preparation

You must meet the following prerequisites before using the LUIS container:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/), [Azure Container Instances](/azure/container-instances/), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure/azure-stack/). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

### Server requirements and recommendations

This container supports minimum and recommended values for the following:

* CPU cores, at least 2.6 gigahertz (GHz) or faster
* Memory, in gigabytes (GB)
* Maximum transactions per second (TPS)

The following table lists the minimum and recommended values for each container.

|Setting| Minimum | Recommended |
|-----------|---------|-------------|
||||
||||
||||
|[LUIS](#working-with-luis) |1 core, 2 GB memory, 20 TPS |1 cores, 4 GB memory, 40 TPS|
|[Recognize Text](#working-with-recognize-text) | 1 core, 8 GB memory, 0.5 TPS | 2 cores, 8 GB memory, 1 TPS |
|[Sentiment Analysis](#working-with-sentiment-analysis) | 1 core, 8 GB memory, 15 TPS | 1 core, 8 GB memory, 30 TPS |

## Create a LUIS resource on Azure

You must create a LUIS resource on Azure if you want to use the LUIS container. After you create the resource, you then use the subscription key and endpoint URL from the resource to instantiate the container. For more information about instantiating a container, see [Instantiate a container from a downloaded container image](#instantiate-a-container-from-a-downloaded-container-image).

Perform the following steps to create and retrieve information from an LUIS
   > [!IMPORTANT]
   > The LUIS resource must use the F0 pricing tier.

1. Get the endpoint URL and subscription key for the Azure resource.  
   Once the Azure resource is created, you must use the endpoint URL and subscription key from that resource to instantiate the corresponding LUIS container. You can copy the endpoint URL and subscription key from, respectively, the Quick Start and Keys pages of the LUIS resource on the Azure portal.

## Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services Containers, but the recommended method from the command line is by using the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).

Use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, as shown in the following example, to log into `containerpreview.azurecr.io`, the private container registry for Cognitive Services Containers. Replace *\<username\>* with the user name and *\<password\>* with the password provided in the credentials you received from the Azure Cognitive Services team.

```docker
docker login containerpreview.azurecr.io -u <username> -p <password>
```

If you have secured your credentials in a text file, you can concatenate the contents of that text file, using the `cat` command, to the `docker login` command as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file containing the password and *\<username\>* with the user name provided in your credentials.

```docker
cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
```

## Download container images from the private container registry

The container image for the LUIS container is available from a private Docker container registry, named `containerpreview.azurecr.io`, in Azure Container Registry. The container image for the LUIS container must be downloaded from the repository to run the container locally.

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the repository. For example, to download the latest LUIS container image from the repository, use the following command:

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-luiss:latest
```

For a full description of available tags for the LUIS container, see [Recognize Text](https://go.microsoft.com/fwlink/?linkid=2018655) on Docker Hub.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

## Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command:

* Instantiates a container from the LUIS container image
* Allocates two CPU cores and X gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits

```Docker
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 containerpreview.azurecr.io/microsoft/cognitive-services-luis Eula=accept Billing=https://westus.api.cognitive.microsoft.com/luis/v1.0 ApiKey=0123456789
```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to instantiate the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Once instantiated, you can call operations from the container by using the container's host URI. For example, the following host URI represents the LUIS container that was instantiated in the previous example:

```http
http://localhost:5000/
```

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the LUIS container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

You can either [call the REST API operations](https://docs.microsoft.com/azure/cognitive-services/LUIS/XXX) available from your container, or use the [Azure Cognitive Services LUIS Client Library](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.LUIS/) client library to call those operations.  
> [!IMPORTANT]
> You must have Azure Cognitive Services LUIS Client Library version X.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from a corresponding service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. For example, if you wanted to use a LUIS instance running in the West US Azure region to detect XXX, you would call the following REST API operation:

```http
POST https://westus.api.cognitive.microsoft.com/ TBD
```

If you wanted to use a LUIS container running on your local machine under its default configuration to detect XXX, you would call the following REST API operation:

```http
POST http://localhost:5000/ TBD
```

### Billing

The LUIS container sends billing information to Azure, using a corresponding LUIS resource on your Azure account. The following command-line options are used by the LUIS container for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the LUIS resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned LUIS Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the LUIS resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned LUIS Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](luis-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running LUIS containers. In summary:

* LUIS provides one Linux container for Docker, named LUIS, to detect TBD.
* Container images are downloaded from a private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in LUIS containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

## Next steps

* Review [Configure containers](luis-container-configuration.md) for configuration settings
* Review [LUIS overview](what-is-luis.md) to learn more about TBD
* Refer to the [LUIS API](TBD) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](luis-resources-faq.md) to resolve issues related to LUIS functionality.