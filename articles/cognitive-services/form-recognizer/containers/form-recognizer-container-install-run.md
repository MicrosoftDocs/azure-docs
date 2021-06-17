---
title: Install and run Docker containers for Form Recognizer v2.1
titleSuffix: Azure Applied AI Services
description: Use the Docker containers for Form Recognizer on-premises to identify and extract key-value pairs, selection marks, tables, and structure from forms and documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/16/2021
ms.author: lajanuar
keywords: on-premises, Docker, container, identify
---

# Install and run Form Recognizer v2.1-preview containers

> [!IMPORTANT]
>
> * Form Recognizer containers are in gated preview and to use them you must submit an online request, and have it approved. See [**Request approval to run container**](#request-approval-to-run-container) below for more information.

Containers enable you to run the Form Recognizer service in your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run Form Recognizer containers.

Form Recognizer features are supported by eight containers—**Read**, **Layout**, **Business Card**,**ID Document**,  **Receipt**, **Invoice**, **Custom Front End (FE)**, and **Custom Back End (FE)**. The *Read* OCR container allows you to extract printed and handwritten text from images and documents with support for JPEG, PNG, BMP, PDF, and TIFF file formats. For more information, see the [Read API how-to guide](Vision-API-How-to-Topics/call-read-api.md).


## Prerequisites

To get started, you'll need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You'll also need the following to use Form Recognizer containers:

| Required | Purpose |
|----------|---------|
| **Familiarity with Docker** | <ul><li>You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology).</li></ul> |
| **Docker Engine installed** | <ul><li>You need the Docker Engine installed on a [host computer](#host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul>  | 
|**Form Recognizer resource** | <ul><li>An Azure **Form Recognizer** resource and the associated API key and endpoint URI. Both values are available on the Azure portal **Form Recognizer** Keys and Endpoint page and are required to start the container.</li></ul> |
|||

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: Azure portal keys and endpoint page":::

|Optional|Purpose|
|---------|----------|
|**Azure CLI (command-line interface)** |<ul><li> The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It is available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell.</li></ul> |
|||

## Required environmental variables

Replace the values with the Endpoint URI and the API Key that you created earlier. Ensure that the EULA value is set to "accept".

```json
"EULA": { 
    "value": "accept"
},
"ENDPOINT":{ 
    "value": "<Use a key from your Computer Vision resource>"
},
"APIKEY":{
    "value": "<Use the endpoint from your Computer Vision resource>"
}
```

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Request approval to run the container

Complete and submit the [Application for Gated Services form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNlpBU1lFSjJUMFhKNzVHUUVLN1NIOEZETiQlQCN0PWcu)  to request approval to run the container.

The form requests information about you, your company, and the user scenario for which you'll use the container. After you submit the form, the Azure Cognitive Services team will review it and email you with a decision.

On the form, you must use an email address associated with an Azure subscription ID. The Azure resource you use to run the container must have been created with the approved Azure subscription ID. Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft. After you're approved, you will be able to run the container after downloading it from the Microsoft Container Registry (MCR), described later in the article.

## Host computer requirements

The host is a x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../../../aks/index.yml).
* [Azure Container Instances](../../../container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

The following table lists the required containers for each Form Recognizer feature:

| Feature| Required Containers|
|---------|-----------|
|Layout 2.1-preview | **Layout** container |
| Business Card (pre-built) | **Business Card** and **Read** containers |
| ID Document (pre-built)  | **ID** and **Read** containers |
| Invoice (pre-built)  | **Invoice** and **Layout** containers |
| Receipt (pre-built)  | **Receipt** and **Read** containers |
| Custom | **Custom FE**, **Custom BE**, and **Layout** containers |

You will be billed for each container instance used to process your documents and images. Below is the current pricing for each feature:

| Container instance | Price |
|----------------------|-------|
|Read | $1.50 per 1,000 pages|
|Layout, Business Card, ID document, Receipt | $10 per 1,000 pages |
| Custom, Invoice| $50 per 1,000 pages |

The minimum and recommended CPU cores and memory to allocate for each Form Recognizer container are outlined in the following table:

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Read 3.1-preview | 8 cores, 16-GB memory | 8 cores, 24-GB memory|
| Layout 2.1-preview | 8 cores, 16-GB memory | 4 core, 8-GB memory |
| BusinessCard 2.1-preview | 2 cores, 4-GB memory | 4 cores, 4-GB memory |
| ID Document 2.1-preview | 1 core, 2-GB memory |2 cores, 2-GB memory |
|Invoice 2.1-preview | 4 cores, 8-GB memory | 8 cores, 8-GB memory |
| Receipt 2.1-preview |  4 cores, 8-GB memory | 8 cores, 8-GB memory  |

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!Note]
> The minimum and recommended values are based on Docker limits and *not* the host machine resources.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID         REPOSITORY                TAG
>  <image-id>       <repository-path/name>    <tag-name>
>  ```

## How to use the container

After the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-by-using-the-docker-run-command), with the required billing settings.


1.  More [examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container by using the docker run command

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. Refer to [gathering required parameters](#gathering-required-parameters) for details on how to get the `{COMPUTER_VISION_ENDPOINT_URI}`, `{COMPUTER_VISION_API_KEY}`, `{FORM_RECOGNIZER_ENDPOINT_URI}` and `{FORM_RECOGNIZER_API_KEY}` values.

[Examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.

### Form Recognizer

> [!NOTE]
> The directories use for `--mount` in these examples are Windows directory paths. If you're using Linux or macOS, change the parameter for your environment. 

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 2 \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer \
Eula=accept \
Billing={FORM_RECOGNIZER_ENDPOINT_URI} \
ApiKey={FORM_RECOGNIZER_API_KEY} \
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
Billing={FORM_RECOGNIZER_ENDPOINT_URI} \
ApiKey={FORM_RECOGNIZER_API_KEY}
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
      apikey: "{COMPUTER_VISION_API_KEY}"

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
      billing: "{FORM_RECOGNIZER_ENDPOINT_URI}"
      apikey: "{FORM_RECOGNIZER_API_KEY}"
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

The container provides websocket-based query endpoint APIs, which you access through [Form Recognizer services SDK documentation](./index.yml).

By default, the Form Recognizer SDK uses the online services. To use the container, you need to change the initialization method. See the examples below.

#### For C#

Change from using this Azure-cloud initialization call:

```csharp
var config =
    FormRecognizerConfig.FromSubscription(
        "YourSubscriptionKey",
        "YourServiceRegion");
```
to this call, which uses the container endpoint:

```csharp
var config =
    FormRecognizerConfig.FromEndpoint(
        "ws://localhost:5000/formrecognizer/v1.0-preview/custom",
        "YourSubscriptionKey");
```

#### For Python

Change from using this Azure-cloud initialization call:

```python
formrecognizer_config =
    formrecognizersdk.FormRecognizerConfig(
        subscription=formrecognizer_key, region=service_region)
```

to this call, which uses the container endpoint:

```python
formrecognizer_config = 
    formrecognizersdk.FormRecognizerConfig(
        subscription=formrecognizer_key,
        endpoint="ws://localhost:5000/formrecognizer/v1.0-preview/custom"
```

### Form Recognizer

The container provides REST endpoint APIs, which you can find on the [Form Recognizer API]https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) reference page.


[!INCLUDE [Validate container is running - Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](form-recognizer-container-configuration.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

## Billing

The Form Recognizer containers send billing information to Azure by using a _Form Recognizer_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

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