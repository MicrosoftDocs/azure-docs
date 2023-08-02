---
title: Install and run Speech containers with Docker - Speech service
titleSuffix: Azure AI services
description: Use the Speech containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/18/2023
ms.author: eur
keywords: on-premises, Docker, container
---

# Install and run Speech containers with Docker

By using containers, you can use a subset of the Speech service features in your own environment. In this article, you'll learn how to download, install, and run a Speech container.

> [!NOTE]
> Disconnected container pricing and commitment tiers vary from standard containers. For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Prerequisites

You must meet the following prerequisites before you use Speech service containers. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin. You need:

* You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container.
* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure.
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech service resource"  target="_blank">Speech service resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

### Billing arguments

Speech containers aren't licensed to run without being connected to Azure for metering. You must configure your container to communicate billing information with the metering service at all times. 

Three primary parameters for all Azure AI containers are required. The Microsoft Software License Terms must be present with a value of **accept**. An Endpoint URI and API key are also needed.

Queries to the container are billed at the pricing tier of the Azure resource that's used for the `ApiKey` parameter.

The <a href="https://docs.docker.com/engine/reference/commandline/run/" target="_blank">`docker run` <span class="docon docon-navigate-external x-hidden-focus"></span></a> command will start the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Speech resource that's used to track billing information.<br/>The `ApiKey` value is used to start the container and is available on the Azure portal's **Keys** page of the corresponding Speech resource. Go to the **Keys** page, and select the **Copy to clipboard** <span class="docon docon-edit-copy x-hidden-focus"></span> icon.|
| `Billing` | The endpoint of the Speech resource that's used to track billing information.<br/>The endpoint is available on the Azure portal **Overview** page of the corresponding Speech resource. Go to the **Overview** page, hover over the endpoint, and a **Copy to clipboard** <span class="docon docon-edit-copy x-hidden-focus"></span> icon appears. Copy and use the endpoint where needed.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

> [!IMPORTANT]
> These subscription keys are used to access your Azure AI services API. Don't share your keys. Store them securely. For example, use Azure Key Vault. We also recommend that you regenerate these keys regularly. Only one key is necessary to make an API call. When you regenerate the first key, you can use the second key for continued access to the service.

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. For an example of the information sent to Microsoft for billing, see the [Azure AI container FAQ](../containers/container-faq.yml#how-does-billing-work) in the Azure AI services documentation.

For more information about these options, see [Configure containers](speech-container-configuration.md).

### Container requirements and recommendations

The following table describes the minimum and recommended allocation of resources for each Speech container:

| Container | Minimum | Recommended |Speech Model|
|-----------|---------|-------------| -------- |
| Speech to text | 4 core, 4-GB memory | 8 core, 8-GB memory |+4 to 8 GB memory|
| Custom speech to text | 4 core, 4-GB memory | 8 core, 8-GB memory |+4 to 8 GB memory|
| Speech language identification | 1 core, 1-GB memory | 1 core, 1-GB memory |n/a|
| Neural text to speech | 6 core, 12-GB memory | 8 core, 16-GB memory |n/a|

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!NOTE]
> The minimum and recommended allocations are based on Docker limits, *not* the host machine resources.
> For example, speech to text containers memory map portions of a large language model. We recommend that the entire file should fit in memory. You need to add an additional 4 to 8 GB to load the speech models (see above table).
> Also, the first run of either container might take longer because models are being paged into memory.

## Host computer requirements and recommendations

The host is an x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](~/articles/aks/index.yml).
* [Azure Container Instances](~/articles/container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).


> [!NOTE]
> Containers support compressed audio input to the Speech SDK by using GStreamer.
> To install GStreamer in a container, follow Linux instructions for GStreamer in [Use codec compressed audio input with the Speech SDK](how-to-use-codec-compressed-audio-input-streams.md).

### Advanced Vector Extension support

The *host* is the computer that runs the Docker container. The host *must support* [Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX2) (AVX2). You can check for AVX2 support on Linux hosts with the following command:

```console
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```
> [!WARNING]
> The host computer is *required* to support AVX2. The container *will not* function correctly without AVX2 support.

## Run the container

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. Once running, the container continues to run until you [stop the container](#stop-the-container).

Take note the following best practices with the `docker run` command:

- **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements.
- **Argument order**: Do not change the order of the arguments unless you are familiar with Docker containers.

You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. The following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:

```bash
docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
```

Here's an example result:
```
IMAGE ID         REPOSITORY                TAG
<image-id>       <repository-path/name>    <tag-name>
```

## Validate that a container is running

There are several ways to validate that the container is running. Locate the *External IP* address and exposed port of the container in question, and open your favorite web browser. Use the various request URLs that follow to validate the container is running. 

The example request URLs listed here are `http://localhost:5000`, but your specific container might vary. Make sure to rely on your container's *External IP* address and exposed port.

| Request URL | Purpose |
|--|--|
| `http://localhost:5000/` | The container provides a home page. |
| `http://localhost:5000/ready` | Requested with GET, this URL provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/status` | Also requested with GET, this URL verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/swagger` | The container provides a full set of documentation for the endpoints and a **Try it out** feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |

## Stop the container

To shut down the container, in the command-line environment where the container is running, select <kbd>Ctrl+C</kbd>.

## Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Azure AI container running on the HOST together. You also can have multiple containers of the same Azure AI container running.

## Host URLs

> [!NOTE]
> Use a unique port number if you're running multiple containers.

| Protocol | Host URL | Containers |
|--|--|--|
| WS | `ws://localhost:5000` | [Speech to text](speech-container-stt.md#use-the-container)<br/><br/>[Custom speech to text](speech-container-cstt.md#use-the-container)  |
| HTTP | `http://localhost:5000` | [Neural text to speech](speech-container-ntts.md#use-the-container)<br/><br/>[Speech language identification](speech-container-lid.md#use-the-container) |

For more information on using WSS and HTTPS protocols, see [Container security](../cognitive-services-container-support.md#azure-ai-services-container-security) in the Azure AI services documentation.

## Troubleshooting

When you start or run the container, you might experience issues. Use an output [mount](speech-container-configuration.md#mount-settings) and enable logging. Doing so allows the container to generate log files that are helpful when you troubleshoot issues.

> [!TIP]
> For more troubleshooting information and guidance, see [Azure AI containers frequently asked questions (FAQ)](../containers/container-faq.yml) in the Azure AI services documentation.


### Logging settings

Speech containers come with ASP.NET Core logging support. Here's an example of the `neural-text-to-speech container` started with default logging to the console:

```bash
docker run --rm -it -p 5000:5000 --memory 12g --cpus 6 \
mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Console:LogLevel:Default=Information
```

For more information about logging, see [Configure Speech containers](speech-container-configuration.md#logging-settings) and [usage records](../containers/disconnected-containers.md#usage-records) in the Azure AI services documentation.

## Microsoft diagnostics container

If you're having trouble running an Azure AI container, you can try using the Microsoft diagnostics container. Use this container to diagnose common errors in your deployment environment that might prevent Azure AI containers from functioning as expected.

To get the container, use the following `docker pull` command:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/diagnostic
```

Then run the container. Replace `{ENDPOINT_URI}` with your endpoint, and replace `{API_KEY}` with your key to your resource:

```bash
docker run --rm mcr.microsoft.com/azure-cognitive-services/diagnostic \
eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

The container will test for network connectivity to the billing endpoint.

## Run disconnected containers

To run disconnected containers (not connected to the internet), you must submit [this request form](https://aka.ms/csdisconnectedcontainers) and wait for approval. For more information about applying and purchasing a commitment plan to use containers in disconnected environments, see [Use containers in disconnected environments](../containers/disconnected-containers.md) in the Azure AI services documentation.

## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Deploy and run containers on [Azure Container Instance](../containers/azure-container-instance-recipe.md)
* Use more [Azure AI services containers](../cognitive-services-container-support.md).


