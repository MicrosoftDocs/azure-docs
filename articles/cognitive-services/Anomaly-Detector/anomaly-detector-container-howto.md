---
title: What is the Anomaly Detector API? | Microsoft Docs
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API's advanced algorithms to identify anomalies in your time series data.
services: cognitive-services
author: aahill
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: article
ms.date: 05/07/2019
ms.author: aahi
---

# Install and run containers

The Anomaly Detector has the following container: 

|Function|Features|
|-|-|
|anomaly-detector| <li> Detects anomalies as they occur in real-time. <li> Detects anomalies throughout your data set as a batch. <li> Infers the expected normal range of your data. <li> Supports anomaly detection sensitivity adjustment to better fit your data. |

For detailed information about the APIs, please see:
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)
* [Anomaly Detector documentation](https://go.microsoft.com/fwlink/?linkid=2080919&clcid=0x409)


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must meet the following prerequisites before using Anomaly Detector containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Anomaly Detector resource |In order to use these containers, you must have:<br><br>An _Anomaly Detector_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's Anomaly Detector Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus2.api.cognitive.microsoft.com`|


## Request access to the private container registry


You must first complete and submit the [Anomaly Detector Containers private preview Request form](https://aka.ms/adcontainer) to request access to the container. The form requests information about you, your company, and the user scenario for which you'll use the container. Once submitted, the Anomaly Detector team reviews the form to ensure that you meet the criteria for access to the private container registry.

If your request is approved, you then receive an email with instructions describing how to obtain your credentials and access the private container registry.

## Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services Containers, but the recommended method from the command line is by using the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/). You should receive this information from the Azure Cognitive Services team in a secured email.
Use the `az login` command, as shown in the following example, to log into **containerpreview.azurecr.io**, the private container registry for Cognitive Services Containers. 

```bash
az login
az acr login -n containerpreview
```


### The host computer

The **host** is the computer that runs the docker container. It can be a computer on your premises or a docker hosting service in Azure including:

* [Azure Kubernetes Service](https://docs.microsoft.com/en-us/aks/index.yml)
* [Azure Container Instances](https://docs.microsoft.com/en-us/container-instances/index.yml)
* [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](https://docs.microsoft.com/en-us/azure-stack/index.yml). For more information, see [Deploy Kubernetes to Azure Stack](https://docs.microsoft.com/en-us/azure-stack/user/azure-stack-solution-template-kubernetes-deploy.md).
* [Azure IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/). For instructions of deploying Anomaly Detector module in IoT Edge, see [How to deploy Anomaly Detector module in IoT Edge](how-to-deploy-anomaly-detector-module-in-iot-edge.md).

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for Anomaly Detector container.

| QPS(Queries per second) | Minimum | Recommended |
|-----------|---------|-------------|
| 10 QPS | 4 core, 1GB memory | 8 core 2GB memory |
| 20 QPS | 8 core, 2GB memory | 16 core 4GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Available container image for Anomaly Detector: 

| Container | Repository |
|-----------|------------|
| anomaly-detector | `containerpreview.azurecr.io/microsoft/cognitive-services-anomaly:latest` |



> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID            REPOSITORY                                                                TAG
>  c2ccdb017881        containerpreview.azurecr.io/microsoft/cognitive-services-anomaly:latest                 latest
>  ``` 

### Docker pull for the Anomaly Detector container

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-anomaly:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](#example-docker-run-commands) of the `docker run` command are available. 
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint). 

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Anomaly Detector Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Anomaly Detector Overview page.|

Replace these parameters with your own values in the following example `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-anomaly\
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

This command:

* Runs a Anomaly Detector container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer. 

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

### Running multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different port. For example, run the first container on port 5000 and the second container on port 5001.

Replace the `<container-registry>` and `<container-name>` with the values of the containers you use. These do not have to be the same container. You can have the Face container and the LUIS container running on the HOST together or you can have multiple Face containers running. 

Run the first container on port 5000. 

```bash 
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
<container-registry>/microsoft/<container-name> \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

Run the second container on port 5001.


```bash 
docker run --rm -it -p 5000:5001 --memory 4g --cpus 1 \
<container-registry>/microsoft/<container-name> \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

Each subsequent container should be on a different port. 

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs. 

Use the host, https://localhost:5000, for container APIs.

## Stop the container

To shut down the container, in the command-line environment where the container is running, press **Ctrl+C**.

## Troubleshooting

If you run the container with an output [mount](mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container. 

## Container's API documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

## Billing

The Anomaly Detector containers send billing information to Azure, using a _Anomaly Detector_ resource on your Azure account. 

Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data to Microsoft. 

The `docker run` command uses the following arguments for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the _Anomaly Detector_ resource used to track billing information. |
| `Billing` | The endpoint of the _Anomaly Detector_ resource used to track billing information.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](#configure-containers).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Anomaly Detector containers. In summary:

* Anomaly Detector provides one Linux container for Docker, encapsulating anomaly detection with batch vs streaming, expected range inference, and sensitity tuning.
* Container images are downloaded from a private Azure Container Registry dedicated for containers preview.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Anomaly Detector containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the time series data that is being analyzed) to Microsoft.