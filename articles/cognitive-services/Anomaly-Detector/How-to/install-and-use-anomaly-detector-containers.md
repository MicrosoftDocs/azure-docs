---
title: How to install and use an Anomaly Detector container 
description: Learn how to detect anomalies in your data with a Anomaly Detector docker container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-finder
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# How to: Install and run an Anomaly Detector container 

Use this article to start using Docker containers for the Anomaly Detector API. The API provides [number of containers for service] Linux containers, letting you [service features of containers]. These containers can be downloaded from the Microsoft Container Registry (MCR) in Azure, and run on your host machine. 

|Container|Description|
|-|-|
|anomaly-finder|tbd|

## Prerequisites

You must meet the following prerequisites before using Anomaly Detector containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a host computer. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For an introduction to Docker and containers, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **Windows**: Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Anomaly Detector resource | An Anomaly Detector Azure resource. You will need the associated billing key and billing endpoint URI. Both values are available on the Azure portal's Anomaly Finder Overview and Keys pages and are required to start the container. Your billing endpoint URI will look like this: `https://westus.api.cognitive.microsoft.com/sts/v1.0`|

### The host computer

The **host** is the computer that runs the docker container. It can be a computer on your premises, or a docker hosting service in Azure, including:
* [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/index)
* [Azure Container Instances](https://docs.microsoft.com/azure/container-instances/index)
* [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](https://docs.microsoft.com/azure/azure-stack/index). For more information, see [Deploy Kubernetes to Azure Stack](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Anomaly Finder container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|anomaly-finder | X core, X GB memory | X core, X GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Request access to the private container registry

[Editor's note]: if this section doesn't apply, delete it

You must first complete and submit the [Cognitive Services Vision Containers Request form](https://aka.ms/VisionContainersPreview) to request access to the container. The form requests information about you, your company, and the user scenario for which you'll use the container. Once submitted, the Azure Cognitive Services team reviews the form to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> You must use an email address associated with either a Microsoft Account (MSA) or Azure Active Directory (Azure AD) account.

If your request is approved, you will receive an email with instructions on how to obtain your credentials and access the private container registry.

## Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services Containers, but we recommend using the [Docker command line](https://docs.docker.com/engine/reference/commandline/cli/).

Use the following [docker login](https://docs.docker.com/engine/reference/commandline/login/) command to log into `containerpreview.azurecr.io`, the private container registry for Cognitive Services Containers. Replace *\<username\>* with the user name and *\<password\>* with the password provided in the credentials you received from the Azure Cognitive Services team.

```docker
docker login containerpreview.azurecr.io -u <username> -p <password>
```

If you have secured your credentials in a text file, you can concatenate the contents of that text file, using the `cat` command, to the `docker login` command as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file containing the password and *\<username\>* with the user name provided in your credentials.

```docker
cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
```

## Get the container image 

Use the `docker pull` command to get an Anomaly Detector container. The following container images for Anomaly Finder are available: 

| Container | Repository |
|-----------|------------|
| anomaly-finder | `mcr.microsoft.com/azure-cognitive-services/anomaly-finder:latest` |

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. The following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID            REPOSITORY                                                                TAG
>  ebbee78a6baa        mcr.microsoft.com/azure-cognitive-services/anomaly-finder                 latest
>  ``` 

## How to use the container

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run it. The `docker run` command uses the following arguments for billing purposes, which must be specified to run the container.

| Argument | Description |
|--------|-------------|
| `ApiKey` | The API key of the _Anomaly Finder_ resource used to track billing information. |
| `Billing` | The endpoint of the _Anomaly Finder_ resource used to track billing information.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

In the following `docker run command`, replace the following placeholder parameters with your information. This command performs the following actions:

* Runs an Anomaly Detector container from the container image.
* Allocates one CPU core and 4 gigabytes (GB) of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer. 

| Placeholder parameter | Description |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Anomaly Finder Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Anomaly Finder Overview page.|

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/anomaly-finder\
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

The container's endpoints can be accessed at `https://localhost:5000`.

### Stop the container

To shut down the container, in the command-line environment where the container is running, press **Ctrl+C**.

### Billing

The Anomaly Detector containers send billing information to Azure using an Anomaly Detector resource on your Azure account. 

Cognitive Services containers are not licensed to run without being connected to Azure for metering. When using a container,  you will need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data to Microsoft.

For more information about these options, see [Configure containers](#configure-containers).

## Running multiple containers on the same host

If you want to run multiple docker containers with exposed ports on the same host, make sure to run each container with a different port. The following example runs the first container on port 5000 and the second container on port 5001. Replace the `<container-registry>` and `<container-name>` with the values of the containers you are using.

1. Run the first container on port 5000. 

    ```bash 
    docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
    <container-registry>/microsoft/<container-name> \
    Eula=accept \
    Billing={BILLING_ENDPOINT_URI} \
    ApiKey={BILLING_KEY}
    ```

2. Run the second container on port 5001.

    ```bash 
    docker run --rm -it -p 5000:5001 --memory 4g --cpus 1 \
    <container-registry>/microsoft/<container-name> \
    Eula=accept \
    Billing={BILLING_ENDPOINT_URI} \
    ApiKey={BILLING_KEY}
    ```

Each subsequent container should be assigned a different port.

## Troubleshooting and container documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

If you run the container with an output [mount](mount-settings) and logging enabled, the container will generate log files to troubleshoot issues that happen while starting or running the container. 

## Next steps

* [What is the Anomaly Detector API](../overview.md)