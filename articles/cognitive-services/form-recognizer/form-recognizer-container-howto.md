---
title: Install and run container - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer container to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: pafarley
---
# Install and run containers
Form Recognizer applies machine learning technology to identify and extract key-value pairs and tables from forms. It associates values and table entries to them and then outputs structured data that includes the relationships in the original file. You can call your custom Form Recognizer model using a simple REST API in order to reduce complexity and easily integrate it in your workflow automation process or other application. Only five documents (or an empty form) are needed, so you can get results quickly, accurately and tailored to your specific content, without heavy manual intervention or extensive data science expertise. It does not require data labeling or data annotation.

|Function|Features|
|-|-|
|Form Recognizer| <li>Processes files of type PDF, PNG and JPG.<li>Trains custom models with minimum 5 forms of the same layout. <li>Extracts key-value pairs and table information. <li>Uses Cognitive Service Computer Vision API RecognizeText to detect and extract printed text from images inside forms.<li>Does not require annotation or labeling.|

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must meet the following prerequisites before using Form Recognizer containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.|
|FormRecognizer resource |In order to use these containers, you must have:<br><br>A _FormRecognizer_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's **FormRecognizer** Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus2.api.cognitive.microsoft.com/`|
|Computer Vision API - Recognize Text| The Form Recognizer requires Recognize Text from the Computer Vision API to detect and extract printed text from images.  Recognize Text can either be configured as hosted service [Cognitive Services Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) or as well as a container [Install and run Recognize Text Container](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/computer-vision-how-to-install-containers).

## Request access to the container registry

You must first complete and submit the [Cognitive Services Form Recognizer Containers Request form](https://aka.ms/FormRecognizerRequestAccess) to request access to the container.

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Advanced Vector Extension support

The **host** is the computer that runs the docker container. The host must support [Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX2) (AVX2). You can check this support on Linux hosts with the following command:

```console
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Form Recognizer container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|cognitive-services-formrecognizer | 2 core, 4 GB memory | 4 core, 8 GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

**Note**; The minimum and recommended are based off of Docker limits, *not* the host machine resources.

## Get the container image with `docker pull`

Container images for Form Recognizer are available.

| Container | Repository |
|-----------|------------|
| cognitive-services-formrecognizer | `containerpreview.azurecr.io/microsoft/cognitive-services-formrecognizer:latest` |

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]


### Docker pull for the Form Recognizer container

#### Form Recognizer

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-formrecognizer:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required but not used billing settings. More [examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

**During the private preview**, the billing settings must be valid to start the container but you are not billed for usage.

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Form Recognizer Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Form Recognizer Overview page.|
|{COMPUTER_VISION_API_KEY}| The key is available on the Azure portal's Computer Vision API Keys page.|
|{COMPUTER_VISION_API_ENDPOINT_URI}|The billing endpoint URI value is available on the Azure portal's Computer Vision API  Overview page.|

Replace these parameters with your own values in the following example `docker run` command.

### Form Recognizer

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 2 \
containerpreview.azurecr.io/microsoft/cognitive-services-formrecognizer \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY} \
formrecognizer:computervisionapikey={COMPUTER_VISION_API_KEY} \
formrecognizer:computervisionapiendpointuri={COMPUTER_VISION_API_ENDPOINT_URI}
```

This command:

* Runs a FormRecognizer container from the container image
* Allocates 2 CPU cores and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.
* Mounts an /input and an /output volume to the container

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` as well as `formrecognizer:computervisionapikey` and `formrecognizer:computervisionapiendpointuri` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

## Query the container's prediction endpoint

|Container|Endpoint|
|--|--|
|formrecognizer|http://localhost:5000


### Form Recognizer

The container provides websocket-based query endpoint APIs, that are accessed through [Form Recognizer services SDK documentation](https://docs.microsoft.com/azure/cognitive-services/formrecognizer/).

By default, the Form Recognizer SDK uses the online services. To use the container, you need to change the initialization method. See the examples below.

#### For C#

Change from using this Azure-cloud initialization call:

```C#
var config = FormRecognizerConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

to this call using the container endpoint:

```C#
var config = FormRecognizerConfig.FromEndpoint("ws://localhost:5000/formrecognizer/v1.0-preview/custom", "YourSubscriptionKey");
```

#### For Python

Change from using this Azure-cloud initialization call

```python
formrecognizer_config = formrecognizersdk.FormRecognizerConfig(subscription=formrecognizer_key, region=service_region)
```

to this call using the container endpoint:

```python
formrecognizer_config = formrecognizersdk.FormRecognizerConfig(subscription=formrecognizer_key, endpoint="ws://localhost:5000/formrecognizer/v1.0-preview/custom"
```

### Form Recognizer

The container provides REST endpoint APIs, which can be found [here](https://docs.microsoft.com/azure/cognitive-services/formrecognizer-service/rest-apis#formrecognier-api) and samples can be found [here](https://azure.microsoft.com/resources/samples/cognitive-formrecognizer).


[!INCLUDE [Validate container is running - Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

When you run the container, the container uses **stdout** and **stderr** to output information that is helpful to troubleshoot issues that happen while starting or running the container.

## Billing

The Form Recognizer containers send billing information to Azure, using a _FormRecognizer_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Form Recognizer containers. In summary:

* Form Recognizer provides one Linux container for Docker.
* Container images are downloaded from the private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Form Recognizer container by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
>  Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](form-recognizer-container-configuration.md) for configuration settings
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)