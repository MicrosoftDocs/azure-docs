---
title: Offline containers for Cognitive Services
titleSuffix: Azure Cognitive Services
description: Use Azure Cognitive Services in 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 05/24/2021
ms.author: aahi
---

# Use Docker containers in disconnected environments


Containers enable you to run Cognitive Services APIs in your own environment, and are great for your specific security and data governance requirements. Offline containers enable you to use these APIs completely disconnected from the internet. 

You must meet the following prerequisites before using offline containers.

* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of Docker concepts 
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
* A <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a TBD resource"  target="_blank">TBD resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).
    * You will need the key and endpoint from the resource to use the container.

[!INCLUDE [Gathering required parameters](includes/container-gathering-required-parameters.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The following table describes the minimum and recommended specifications for the available offline containers. At least 2 gigabytes (GB) of memory are required, and each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Section (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **TBD**   | TBD core, TBD GB memory | TBD core, TBD memory |TBD | TBD|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Request access to the offline container

Fill out and submit the [Cognitive Services request form](https://aka.ms/csgate) to request access to offline containers.

The form requests information about you, your company, and the user scenario for which you'll use the container. After you've submitted the form, the Azure Cognitive Services team reviews it to ensure that you meet the criteria for access to the private container registry.


## Get the container image with the Docker pull command

> [!IMPORTANT]
> * On the form, you must use an email address associated with an Azure subscription ID.
> * The Azure resource (billing endpoint and apikey) you use to run the container must have been created with the approved Azure subscription ID. 
> * Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the Microsoft Container Registry.

<!-- the following docker pull command is for Text Analytics, update it to the correct container image location for your service -->
```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/keyphrase:latest
```

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Run the container with the Docker run command

Once the container is on the host computer](#the-host-computer), use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).


To run the <service> container, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your <service> resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the <service> API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a <service> container from the container image
* Allocates one CPU core and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

[!INCLUDE [Running multiple containers on the same host](../../../includes/cognitive-services-containers-run-multiple-same-host.md)


## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

[!INCLUDE [Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

<!-- link to the offline containers configuration article-->
If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

## Billing

The <service> containers send billing information to Azure, using a <service> resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running <service> containers. In summary:

* There are TBD offline Linux containers for Docker, encapsulating various capabilities:
   * Container 1
   * Container 2. 
   * ...

* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in <service> containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* link 1
* link 2
