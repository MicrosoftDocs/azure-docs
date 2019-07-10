---
title: How to install and run container for Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer container to parse form and table data.
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: dapine
---
# Install and run Form Recognizer containers

Azure Form Recognizer applies machine learning technology to identify and extract key-value pairs and tables from forms. It associates values and table entries with the key-value pairs and then outputs structured data that includes the relationships in the original file. 

To reduce complexity and easily integrate a custom Form Recognizer model into your workflow automation process or other application, you can call the model by using a simple REST API. Only five form documents (or one empty form and two filled-in forms) are needed, so you can get results quickly, accurately, and tailored to your specific content. No heavy manual intervention or extensive data science expertise is necessary. And it doesn't require data labeling or data annotation.

|Function|Features|
|-|-|
|Form Recognizer| <li>Processes PDF, PNG, and JPG files<li>Trains custom models with a minimum of 5 forms of the same layout <li>Extracts key-value pairs and table information <li>Uses the Azure Cognitive Services Computer Vision API Recognize Text feature to detect and extract printed text from images inside forms<li>Doesn't require annotation or labeling|

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Before you use Form Recognizer containers, you must meet the following prerequisites:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> On Windows, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, such as registries, repositories, containers, and container images, and knowledge of basic `docker` commands.|
|The Azure CLI| Install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) on your host.|
|Computer Vision API resource| To process scanned documents and images, you need a Computer Vision resource. You can access the Recognize Text feature as either an Azure resource (the REST API or SDK) or a *cognitive-services-recognize-text* [container](../Computer-vision/computer-vision-how-to-install-containers.md##get-the-container-image-with-docker-pull). The usual billing fees apply. <br><br>Pass in both the key and billing endpoints for your Computer Vision resource (Azure cloud or Cognitive Services container). Use this key and the billing endpoint as {COMPUTER_VISION_API_KEY} and {COMPUTER_VISION_BILLING_ENDPOINT_URI}.<br><br> If you use the *cognitive-services-recognize-text* container, make sure that:<br><br>Your Computer Vision key for the Form Recognizer container is the key specified in the Computer Vision `docker run` command for the *cognitive-services-recognize-text* container.<br>Your billing endpoint is the container's endpoint (for example, `https://localhost:5000`). If you use both the Computer Vision container and Form Recognizer container together on the same host, they can't both be started with the default port of *5000*.  |  
|Form Recognizer resource |To use these containers, you must have:<br><br>A _Form Recognizer_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal **Form Recognizer Overview** and **Form Recognizer Overview Keys** pages, and both values are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is `https://westus.api.cognitive.microsoft.com/forms/v1.0`| 

## Request access to the container registry

You must first complete and submit the [Cognitive Services Form Recognizer Containers access request form](https://aka.ms/FormRecognizerRequestAccess) to request access to the container. Doing so also signs you up for Computer Vision. You don't need to sign up for the Computer Vision request form separately. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The minimum and recommended CPU cores and memory to allocate for each Form Recognizer container are described in the following table:

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|cognitive-services-form-recognizer | 2 core, 4 GB memory | 4 core, 8 GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second
* Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!Note]
> The minimum and recommended values are based on Docker limits and *not* the host machine resources.

## Get the container image with the docker pull command

Container images for Form Recognizer are available in the following repository:

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

To get the Form Recognizer container, use the following command:

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer:latest
```

## How to use the container

After the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-by-using-the-docker-run-command), with the required but not used billing settings. More [examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container by using the docker run command

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container. It's available on the Azure portal **Form Recognizer Keys** page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal **Form Recognizer Overview** page.|
|{COMPUTER_VISION_API_KEY}| The key is available on the Azure portal **Computer Vision API Keys** page.|
|{COMPUTER_VISION_ENDPOINT_URI}|The billing endpoint. If you're using a cloud-based Computer Vision resource, the URI value is available on the Azure portal **Computer Vision API Overview** page. If you're using a  `cognitive-services-recognize-text` container, use the billing endpoint URL that's passed to the container in the `docker run` command.|

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

* Runs a Form Recognizer container from the container image.
* Allocates 2 CPU cores and 8 gigabytes (GB) of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.
* Mounts an /input and an /output volume to the container.

[!INCLUDE [Running multiple containers on the same host H2](../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

### Run separate containers as separate docker run commands

For the Form Recognizer and Text Recognizer combination that's hosted locally on the same host, use the following two example Docker CLI commands:

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

For the Form Recognizer and Text Recognizer combination that's hosted locally on the same host, see the following example Docker Compose YAML file. The Text Recognizer `{COMPUTER_VISION_API_KEY}` must be the same for both the `formrecognizer` and `ocr` containers. The `{COMPUTER_VISION_ENDPOINT_URI}` is used only in the `ocr` container, because the `formrecognizer` container uses the `ocr` name and port. 

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
> The `Eula`, `Billing`, and `ApiKey`, as well as the `FormRecognizer:ComputerVisionApiKey` and `FormRecognizer:ComputerVisionEndpointUri` options, must be specified to run the container; otherwise, the container won't start. For more information, see [Billing](#billing).

## Query the container's prediction endpoint

|Container|Endpoint|
|--|--|
|form-recognizer|http://localhost:5000


### Form Recognizer

The container provides websocket-based query endpoint APIs, which you access through [Form Recognizer services SDK documentation](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/).

By default, the Form Recognizer SDK uses the online services. To use the container, you need to change the initialization method. See the examples below.

#### For C#

Change from using this Azure-cloud initialization call:

```C#
var config = FormRecognizerConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

to this call, which uses the container endpoint:

```C#
var config = FormRecognizerConfig.FromEndpoint("ws://localhost:5000/formrecognizer/v1.0-preview/custom", "YourSubscriptionKey");
```

#### For Python

Change from using this Azure-cloud initialization call:

```python
formrecognizer_config = formrecognizersdk.FormRecognizerConfig(subscription=formrecognizer_key, region=service_region)
```

to this call, which uses the container endpoint:

```python
formrecognizer_config = formrecognizersdk.FormRecognizerConfig(subscription=formrecognizer_key, endpoint="ws://localhost:5000/formrecognizer/v1.0-preview/custom"
```

### Form Recognizer

The container provides REST endpoint APIs, which you can find on the [Form Recognizer API](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/AnalyzeWithCustomModel) page.


[!INCLUDE [Validate container is running - Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

When you run the container, the container uses **stdout** and **stderr** to output information that's helpful for troubleshooting issues that arise when you start or run the container.

## Billing

The Form Recognizer containers send billing information to Azure by using a _Form Recognizer_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

<!--blogs/samples/video courses -->

[!INCLUDE [Discoverability of more container information](../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Form Recognizer containers. In summary:

* Form Recognizer provides one Linux container for Docker.
* Container images are downloaded from the private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or the REST SDK to call operations in Form Recognizer container by specifying the host URI of the container.
* You must specify the billing information when you instantiate a container.

> [!IMPORTANT]
>  Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](form-recognizer-container-configuration.md) for configuration settings.
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md).
