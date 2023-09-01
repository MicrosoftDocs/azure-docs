---
title: Azure AI Vision 3.2 GA Read OCR container
titleSuffix: Azure AI services
description: Use the Read 3.2 OCR containers from Azure AI Vision to extract text from images and documents, on-premises.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 03/02/2023
ms.author: pafarley
ms.custom: seodec18, cog-serv-seo-aug-2020
keywords: on-premises, OCR, Docker, container
---

# Install Azure AI Vision 3.2 GA Read OCR container

[!INCLUDE [container hosting on the Microsoft Container Registry](../containers/includes/gated-container-hosting.md)]

Containers enable you to run the Azure AI Vision APIs in your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run the Read (OCR) container.

The Read container allows you to extract printed and handwritten text from images and documents with support for JPEG, PNG, BMP, PDF, and TIFF file formats. For more information, see the [Read API how-to guide](how-to/call-read-api.md).

## What's new
The `3.2-model-2022-04-30` GA version of the Read container is available with support for [164 languages and other enhancements](./whats-new.md#may-2022). If you're an existing customer, follow the [download instructions](#get-the-container-image) to get started.

The Read 3.2 OCR container is the latest GA model and provides:
* New models for enhanced accuracy.
* Support for multiple languages within the same document.
* Support for a total of 164 languages. See the full list of [OCR-supported languages](./language-support.md#optical-character-recognition-ocr).
* A single operation for both documents and images.
* Support for larger documents and images.
* Confidence scores.
* Support for documents with both print and handwritten text.
* Ability to extract text from only selected page(s) in a document.
* Choose text line output order from default to a more natural reading order for Latin languages only.
* Text line classification as handwritten style or not for Latin languages only.

If you're using Read 2.0 containers today, see the [migration guide](read-container-migration-guide.md) to learn about changes in the new versions.

## Prerequisites

You must meet the following prerequisites before using the containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#host-computer-requirements). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/install/#server). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Computer Vision resource |In order to use the container, you must have:<br><br>A **Computer Vision** resource and the associated API key the endpoint URI. Both values are available on the Overview and Keys pages for the resource and are required to start the container.<br><br>**{API_KEY}**: One of the two available resource keys on the **Keys** page<br><br>**{ENDPOINT_URI}**: The endpoint as provided on the **Overview** page|

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Request approval to run the container

Fill out and submit the [request form](https://aka.ms/csgate) to request approval to run the container. 

[!INCLUDE [Request access to run the container](../../../includes/cognitive-services-containers-request-access.md)]

[!INCLUDE [Gathering required container parameters](../containers/includes/container-gathering-required-parameters.md)]

### Host computer requirements

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Advanced Vector Extension support

The **host** computer is the computer that runs the docker container. The host *must support* [Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX2) (AVX2). You can check for AVX2 support on Linux hosts with the following command:

```console
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```

> [!WARNING]
> The host computer is *required* to support AVX2. The container *will not* function correctly without AVX2 support.

### Container requirements and recommendations

[!INCLUDE [Container requirements and recommendations](includes/container-requirements-and-recommendations.md)]

## Get the container image

The Azure AI Vision Read OCR container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `read`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/vision/read`.

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/vision/read/tags).

The following container images for Read are available.

| Container | Container Registry / Repository / Image Name | Tags |
|-----------|------------|-----------------------------------------|
| Read 3.2 GA | `mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30` | 	latest, 3.2, 3.2-model-2022-04-30 |

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image.

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30
```

---

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

## How to use the container

Once the container is on the [host computer](#host-computer-requirements), use the following process to work with the container.

1. [Run the container](#run-the-container), with the required billing settings. More [examples](computer-vision-resource-container-config.md) of the `docker run` command are available. 
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint). 

## Run the container

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. Refer to [gather required parameters](#gather-required-parameters) for details on how to get the `{ENDPOINT_URI}` and `{API_KEY}` values.

[Examples](computer-vision-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available.

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30 \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

The above command:

* Runs the Read OCR latest GA container from the container image.
* Allocates 8 CPU core and 16 gigabytes (GB) of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

You can alternatively run the container using environment variables:

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
--env Eula=accept \
--env Billing={ENDPOINT_URI} \
--env ApiKey={API_KEY} \
mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30
```


More [examples](./computer-vision-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available. 

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

If you need higher throughput (for example, when processing multi-page files), consider deploying multiple containers [on a Kubernetes cluster](deploy-computer-vision-on-premises.md), using [Azure Storage](../../storage/common/storage-account-create.md) and [Azure Queue](../../storage/queues/storage-queues-introduction.md).

If you're using Azure Storage to store images for processing, you can create a [connection string](../../storage/common/storage-configure-connection-string.md) to use when calling the container.

To find your connection string:

1. Navigate to **Storage accounts** on the Azure portal, and find your account.
2. Select on **Access keys** in the left navigation list.
3. Your connection string will be located below **Connection string**

[!INCLUDE [Running multiple containers on the same host](../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

<!--  ## Validate container is running -->

[!INCLUDE [Container API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs. 

Use the host, `http://localhost:5000`, for container APIs. You can view the Swagger path at: `http://localhost:5000/swagger/`.

### Asynchronous Read

You can use the `POST /vision/v3.2/read/analyze` and `GET /vision/v3.2/read/operations/{operationId}` operations in concert to asynchronously read an image, similar to how the Azure AI Vision service uses those corresponding REST operations. The asynchronous POST method will return an `operationId` that is used as the identifier to the HTTP GET request.

From the swagger UI, select the `Analyze` to expand it in the browser. Then select **Try it out** > **Choose file**. In this example, we'll use the following image:

![tabs vs spaces](media/tabs-vs-spaces.png)

When the asynchronous POST has run successfully, it returns an **HTTP 202** status code. As part of the response, there is an `operation-location` header that holds the result endpoint for the request.

```http
 content-length: 0
 date: Fri, 04 Sep 2020 16:23:01 GMT
 operation-location: http://localhost:5000/vision/v3.2/read/operations/a527d445-8a74-4482-8cb3-c98a65ec7ef9
 server: Kestrel
```

The `operation-location` is the fully qualified URL and is accessed via an HTTP GET. Here is the JSON response from executing the `operation-location` URL from the preceding image:

```json
{
  "status": "succeeded",
  "createdDateTime": "2021-02-04T06:32:08.2752706+00:00",
  "lastUpdatedDateTime": "2021-02-04T06:32:08.7706172+00:00",
  "analyzeResult": {
    "version": "3.2.0",
    "readResults": [
      {
        "page": 1,
        "angle": 2.1243,
        "width": 502,
        "height": 252,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              58,
              42,
              314,
              59,
              311,
              123,
              56,
              121
            ],
            "text": "Tabs vs",
            "appearance": {
              "style": {
                "name": "handwriting",
                "confidence": 0.96
              }
            },
            "words": [
              {
                "boundingBox": [
                  68,
                  44,
                  225,
                  59,
                  224,
                  122,
                  66,
                  123
                ],
                "text": "Tabs",
                "confidence": 0.933
              },
              {
                "boundingBox": [
                  241,
                  61,
                  314,
                  72,
                  314,
                  123,
                  239,
                  122
                ],
                "text": "vs",
                "confidence": 0.977
              }
            ]
          },
          {
            "boundingBox": [
              286,
              171,
              415,
              165,
              417,
              197,
              287,
              201
            ],
            "text": "paces",
            "appearance": {
              "style": {
                "name": "handwriting",
                "confidence": 0.746
              }
            },
            "words": [
              {
                "boundingBox": [
                  286,
                  179,
                  404,
                  166,
                  405,
                  198,
                  290,
                  201
                ],
                "text": "paces",
                "confidence": 0.938
              }
            ]
          }
        ]
      }
    ]
  }
}
```


> [!IMPORTANT]
> If you deploy multiple Read OCR containers behind a load balancer, for example, under Docker Compose or Kubernetes, you must have an external cache. Because the processing container and the GET request container might not be the same, an external cache stores the results and shares them across containers. For details about cache settings, see [Configure Azure AI Vision Docker containers](./computer-vision-resource-container-config.md).

### Synchronous read

You can use the following operation to synchronously read an image. 

`POST /vision/v3.2/read/syncAnalyze` 

When the image is read in its entirety, then and only then does the API return a JSON response. The only exception to this behavior is if an error occurs. If an error occurs, the following JSON is returned:

```json
{
    "status": "Failed"
}
```

The JSON response object has the same object graph as the asynchronous version. If you're a JavaScript user and want type safety, consider using TypeScript to cast the JSON response.

For an example use-case, see the <a href="https://aka.ms/ts-read-api-types" target="_blank" rel="noopener noreferrer">TypeScript sandbox here </a> and select **Run** to visualize its ease-of-use.

## Run the container disconnected from the internet

[!INCLUDE [configure-disconnected-container](../containers/includes/configure-disconnected-container.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](./computer-vision-resource-container-config.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

[!INCLUDE [Diagnostic container](../containers/includes/diagnostics-container.md)]

## Billing

The Azure AI services containers send billing information to Azure, using the corresponding resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](./computer-vision-resource-container-config.md). 

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Azure AI Vision containers. In summary:

* Azure AI Vision provides a Linux container for Docker, encapsulating Read.
* The read container image requires an application to run it. 
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Read OCR containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](computer-vision-resource-container-config.md) for configuration settings
* Review the [OCR overview](overview-ocr.md) to learn more about recognizing printed and handwritten text
* Refer to the [Read API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](FAQ.yml) to resolve issues related to Azure AI Vision functionality.
* Use more [Azure AI services containers](../cognitive-services-container-support.md)
