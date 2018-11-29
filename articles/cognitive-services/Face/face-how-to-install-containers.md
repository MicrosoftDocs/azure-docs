---
title: How to install and run containers
titlesuffix: Face - Cognitive Services - Azure
description: How to download, install, and run containers for Face in this walkthrough tutorial.
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

Face provides a standardized Linux container for Docker, named Face, which detects human faces in images, and identifies attributes, including face landmarks (such as noses and eyes), gender, age, and other machine-predicted facial features. In addition to detection, Face can check if two faces in the same image or different images are the same by using a confidence score, or compare faces against a database to see if a similar-looking or identical face already exists. It can also organize similar faces into groups, using shared visual traits.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Preparation

You must meet the following prerequisites before using the Face container:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/), [Azure Container Instances](/azure/container-instances/), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure/azure-stack/). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

### Server requirements and recommendations

The Face container requires a minimum of 1 CPU core, at least 2.6 gigahertz (GHz) or faster, and 4 gigabytes (GB) of allocated memory, but we recommend at least 2 CPU cores and 6 GB of allocated memory.

## Request access to the private container registry

You must first complete and submit the [Cognitive Services Vision Containers Request form](https://aka.ms/VisionContainersPreview) to request access to the Face container. The form requests information about you, your company, and the user scenario for which you'll use the container. Once submitted, the Azure Cognitive Services team reviews the form to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> You must use an email address associated with either a Microsoft Account (MSA) or Azure Active Directory (Azure AD) account in the form.

If your request is approved, you then receive an email with instructions describing how to obtain your credentials and access the private container registry.

## Create a Face resource on Azure

You must create a Face resource on Azure if you want to use the Face container. After you create the resource, you then use the subscription key and endpoint URL from the resource to instantiate the container. For more information about instantiating a container, see [Instantiate a container from a downloaded container image](#instantiate-a-container-from-a-downloaded-container-image).

Perform the following steps to create and retrieve information from an Face resource:

1. Create an Face resource in the Azure portal.  
   If you want to use the Face container, you must first create a corresponding Face resource in the Azure portal. For more information, see [Quickstart: Create a Cognitive Services account in the Azure portal](../cognitive-services-apis-create-account.md).

1. Get the endpoint URL and subscription key for the Azure resource.  
   Once the Azure resource is created, you must use the endpoint URL and subscription key from that resource to instantiate the corresponding Face container. You can copy the endpoint URL and subscription key from, respectively, the Quick Start and Keys pages of the Face resource on the Azure portal.

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

The container image for the Face container is available from a private Docker container registry, named `containerpreview.azurecr.io`, in Azure Container Registry. The container image for the Face container must be downloaded from the repository to run the container locally.

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the repository. For example, to download the latest Face container image from the repository, use the following command:

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-face:latest
```

For a full description of available tags for the Face container, see [Recognize Text](https://go.microsoft.com/fwlink/?linkid=2018655) on Docker Hub.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

## Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command:

* Instantiates a container from the Face container image
* Allocates two CPU cores and 6 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits

```Docker
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789
```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to instantiate the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Once instantiated, you can call operations from the container by using the container's host URI. For example, the following host URI represents the Face container that was instantiated in the previous example:

```http
http://localhost:5000/
```

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Face container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

You can either [call the REST API operations](https://docs.microsoft.com/azure/cognitive-services/face/face-api-how-to-topics/howtodetectfacesinimage) available from your container, or use the [Azure Cognitive Services Face Client Library](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/) client library to call those operations.  
> [!IMPORTANT]
> You must have Azure Cognitive Services Face Client Library version 2.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from a corresponding service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. For example, if you wanted to use a Face instance running in the West US Azure region to detect faces, you would call the following REST API operation:

```http
POST https://westus.api.cognitive.microsoft.com/face/v1.0/detect
```

If you wanted to use a Face container running on your local machine under its default configuration to detect faces, you would call the following REST API operation:

```http
POST http://localhost:5000/face/v1.0/detect
```

### Billing

The Face container sends billing information to Azure, using a corresponding Face resource on your Azure account. The following command-line options are used by the Face container for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Face resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned Face Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the Face resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned Face Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](face-resource-container-config.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Face containers. In summary:

* Face provides one Linux container for Docker, named Face, to detect faces or identify faces using a people database.
* Container images are downloaded from a private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Face containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](face-resource-container-config.md) for configuration settings
* Review [Face overview](Overview.md) to learn more about detecting and identifying faces  
* Refer to the [Face API](//westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](FAQ.md) to resolve issues related to Face functionality.
