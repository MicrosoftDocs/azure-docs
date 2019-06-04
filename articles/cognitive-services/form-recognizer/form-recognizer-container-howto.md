---
title: Install and run container - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer container to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 05/31/2019
ms.author: pafarley
---
# Install and run Form Recognizer containers
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
|Azure CLI| You need to install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) on your host.|
|Computer Vision API resource| In order to process scanned documents and images, a **Computer Vision resource** is required. You can access the **Recognize Text** feature as either an Azure resource (REST API or SDK) or as a `cognitive-services-recognize-text` [container](../Computer-vision/computer-vision-how-to-install-containers.md##get-the-container-image-with-docker-pull). The usual billing fees apply. <br><br>You must pass in both the key and billing endpoint for your specific Computer Vision resource (Azure cloud or Cognitive Services container). Use this key and the billing endpoint as {COMPUTER_VISION_API_KEY} and {COMPUTER_VISION_BILLING_ENDPOINT_URI}.<br><br> If you use the **`cognitive-services-recognize-text` container**, make sure:<br><br>* Your Computer Vision key for the Form Recognizer container is the key specified in the Computer Vision `docker run` command for the  `cognitive-services-recognize-text` container.<br>*Your billing endpoint is the container's endpoint, such as `https://localhost:5000`. If you use both the Computer Vision and Form Recognizer containers together on the same host, they can't both be started with the default port of `5000`.  |  
|Form Recognizer resource |In order to use these containers, you must have:<br><br>A _Form Recognizer_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's **Form Recognizer** Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus.api.cognitive.microsoft.com/forms/v1.0`| 

## Request access to the container registry

You must first complete and submit the [Cognitive Services Form Recognizer Containers Request form](https://aka.ms/FormRecognizerRequestAccess) to request access to the container. This will also sign you up for Computer Vision. You do not need to sign up for the Computer Vision request form separately. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Form Recognizer container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|cognitive-services-form-recognizer | 2 core, 4 GB memory | 4 core, 8 GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!Note]
> The minimum and recommended values are based off of Docker limits and *not* the host machine resources.

## Get the container image with docker pull command

Container images for Form Recognizer are available.

| Container | Repository |
|-----------|------------|
| cognitive-services-form-recognizer | `containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer:latest` |

If you intend to use the `cognitive-services-recognize-text` [container](../Computer-vision/computer-vision-how-to-install-containers.md##get-the-container-image-with-docker-pull), instead of the Form Recognizer service, make sure you use the `docker pull` command with the correct container name: 

```
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text:latest
```

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]


### Docker pull for the Form Recognizer container

#### Form Recognizer

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required but not used billing settings. More [examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Form Recognizer Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Form Recognizer Overview page.|
|{COMPUTER_VISION_API_KEY}| The key is available on the Azure portal's Computer Vision API Keys page.|
|{COMPUTER_VISION_ENDPOINT_URI}|The billing endpoint. If you are using a cloud-based Computer Vision resource, the URI value is available on the Azure portal's Computer Vision API  Overview page. If you are using a  `cognitive-services-recognize-text` container, use the billing endpoint URL passed to the container in the `docker run` command.|

Replace these parameters with your own values in the following example `docker run` command.

### Form Recognizer

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 2 \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY} \
FormRecognizer:ComputerVisionApiKey={COMPUTER_VISION_API_KEY} \
FormRecognizer:ComputerVisionEndpointUri={COMPUTER_VISION_ENDPOINT_URI}
```

This command:

* Runs a Form Recognizer container from the container image
* Allocates 2 CPU cores and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.
* Mounts an /input and an /output volume to the container

[!INCLUDE [Running multiple containers on the same host H2](../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

### Run separate containers as separate docker run commands

For the Form Recognizer and Text Recognizer combination hosted locally on the same host, two example Docker CLI commands follow.

Run the first container on port 5000. 

```bash 
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
FormRecognizer:ComputerVisionApiKey={COMPUTER_VISION_API_KEY} \
FormRecognizer:ComputerVisionEndpointUri={COMPUTER_VISION_ENDPOINT_URI}
```

Run the second container on port 5001.


```bash 
docker run --rm -it -p 5001:5000 --memory 4g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text \
Eula=accept \
Billing={COMPUTER_VISION_ENDPOINT_URI} \
ApiKey={COMPUTER_VISION_API_KEY}
```
Each subsequent container should be on a different port. 

### Run separate containers with Docker Compose

For the Form Recognizer and Text Recognizer combination hosted locally on the same host, an example Docker Compose YAML file follows. The Text Recognizer `{COMPUTER_VISION_API_KEY}` must be the same for both the `formrecognizer` and `ocr` containers. The `{COMPUTER_VISION_ENDPOINT_URI}` is only used in the `ocr` container because the `formrecognizer` container uses the `ocr` name and port. 

```docker
version: '3.3'
services:   
  ocr:
    image: "containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text"
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 8g
        reservations:
          cpus: '1'
          memory: 4g
    environment:
      eula: accept
      billing: "{COMPUTER_VISION_ENDPOINT_URI}"
      apikey: {COMPUTER_VISION_API_KEY}  

  formrecognizer:
    image: "containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer"
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 8g
        reservations:
          cpus: '1'
          memory: 4g
    environment:
      eula: accept
      billing: "{BILLING_ENDPOINT_URI}"
      apikey: {BILLING_KEY}
      FormRecognizer__ComputerVisionApiKey: {COMPUTER_VISION_API_KEY}
      FormRecognizer__ComputerVisionEndpointUri: "http://ocr:5000"
      FormRecognizer__SyncProcessTaskCancelLimitInSecs: 75
    links:
      - ocr
    volumes:
      - type: bind
        source: c:\output
        target: /output
      - type: bind
        source: c:\input
        target: /input
    ports:
      - "5000:5000"  
```


> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` as well as `FormRecognizer:ComputerVisionApiKey` and `FormRecognizer:ComputerVisionEndpointUri` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

## Query the container's prediction endpoint

|Container|Endpoint|
|--|--|
|form-recognizer|http://localhost:5000


### Form Recognizer

The container provides websocket-based query endpoint APIs, that are accessed through [Form Recognizer services SDK documentation](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/).

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

The container provides REST endpoint APIs, which can be found [here](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/AnalyzeWithCustomModel).


[!INCLUDE [Validate container is running - Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

When you run the container, the container uses **stdout** and **stderr** to output information that is helpful to troubleshoot issues that happen while starting or running the container.

## Billing

The Form Recognizer containers send billing information to Azure, using a _Form Recognizer_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

<!--blogs/samples/video coures -->

[!INCLUDE [Discoverability of more container information](../../../includes/cognitive-services-containers-discoverability.md)]

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
