---
title: Install and run containers
titleSuffix: Text Analytics -  Azure Cognitive Services
description: How to download, install, and run containers for Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/02/2019
ms.author: diberry
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service is packaged as a container image. The configuration and dependencies for the application or service are included in the container image. The container image can then be deployed on a container host with little or no modification. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

Text Analytics provides the following set of Docker containers, each of which contains a subset of functionality:

| Container| Description |
|----------|-------------|
|Key Phrase Extraction | Extracts key phrases to identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff". |
|Language Detection | For up to 120 languages, detects and reports in which language the input text is written. The container reports a single language code for every document that's included in the request. The language code is paired with a score indicating the strength of the score. |
|Sentiment Analysis | Analyzes raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive. The analysis models are pre-trained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](../language-support.md), the API can analyze and score any raw text that you provide, directly returning results to the calling application. |

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Preparation

You must meet the following prerequisites before using Text Analytics containers:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](../../../aks/index.yml), [Azure Container Instances](../../../container-instances/index.yml), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](../../../azure-stack/index.yml). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](../../../azure-stack/user/azure-stack-solution-template-kubernetes-deploy.md).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores, at least 2.6 gigahertz (GHz) or faster, and memory, in gigabytes (GB), to allocate for each Text Analytics container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|Key Phrase Extraction | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Language Detection | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Sentiment Analysis | 1 core, 2 GB memory | 1 core, 4 GB memory |

## Download container images from Microsoft Container Registry

Container images for Text Analytics are available from Microsoft Container Registry. The following table lists the repositories available from Microsoft Container Registry for Text Analytics containers. Each repository contains a container image, which must be downloaded to run the container locally.

| Container | Repository |
|-----------|------------|
|Key Phrase Extraction | `mcr.microsoft.com/azure-cognitive-services/keyphrase` |
|Language Detection | `mcr.microsoft.com/azure-cognitive-services/language` |
|Sentiment Analysis | `mcr.microsoft.com/azure-cognitive-services/sentiment` |

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from a repository. For example, to download the latest Key Phrase Extraction container image from the repository, use the following command:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/keyphrase:latest
```

For a full description of available tags for the Text Analytics containers, see the following containers on the Docker Hub:

* [Key Phrase Extraction](https://go.microsoft.com/fwlink/?linkid=2018757)
* [Language Detection](https://go.microsoft.com/fwlink/?linkid=2018759)
* [Sentiment Analysis](https://go.microsoft.com/fwlink/?linkid=2018654)

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

## Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command:

* Instantiates a container from the Sentiment Analysis container image
* Allocates one CPU core and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits

```Docker
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789

```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` command-line options must be specified to instantiate the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Once instantiated, you can call operations from the container by using the container's host URI. For example, the following host URI represents the Sentiment Analysis container that was instantiated in the previous example:

```http
http://localhost:5000/
```

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Sentiment Analysis container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

You can either [call the REST API operations](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-call-api) available from your container, or use the [Azure Cognitive Services Text Analytics SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics) client library to call those operations.  
> [!IMPORTANT]
> You must have Azure Cognitive Services Text Analytics SDK version 2.1.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from a corresponding service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. For example, if you wanted to use a Text Analytics instance running in the West US Azure region, you would call the following REST API operation:

```http
POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases
```

If you wanted to use a Key Phrase Extraction container running on your local machine under its default configuration, you would call the following REST API operation:

```http
POST http://localhost:5000/text/analytics/v2.0/keyPhrases
```

### Billing

The Text Analytics containers send billing information to Azure, using a corresponding Text Analytics resource on your Azure account. The following command-line options are used by the Text Analytics containers for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Text Analytics resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned Text Analytics Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the Text Analytics resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned Text Analytics Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](../text-analytics-resource-container-config.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Text Analytics provides three Linux containers for Docker, encapsulating key phrase extraction, language detection, and sentiment analysis.
* Container images are downloaded from the Microsoft Container Registry (MCR) in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](../text-analytics-resource-container-config.md) for configuration settings
* Review [Text Analytics overview](../overview.md) to learn more about key phrase detection, language detection, and sentiment analysis  
* Refer to the [Text Analytics API](//westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to Computer Vision functionality.


# Install and run LUIS docker containers
 
The Language Understanding (LUIS) container loads your trained or published Language Understanding model, also know as a [LUIS app](https://www.luis.ai), into a docker container and provides access to the query predictions from the container's API endpoints. You can collect query logs from the container and upload these back to the Azure Language Understanding model to improve the app's prediction accuracy.

The following video demonstrates using this container.

[![Container demonstration for Cognitive Services](./media/luis-container-how-to/luis-containers-demo-video-still.png)](https://aka.ms/luis-container-demo)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

In order to run the LUIS container, you must have the following: 

|Required|Purpose|
|--|--|
|Docker Engine| To complete this preview, you need Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Language Understanding (LUIS) resource and associated app |In order to use the container, you must have:<br><br>* A [_Language Understanding_ Azure resource](luis-how-to-azure-subscription.md), along with the associated endpoint key and endpoint URI (used as the billing endpoint).<br>* A trained or published app packaged as a mounted input to the container with its associated App ID.<br>* The Authoring Key to download the app package, if you are doing this from the API.<br><br>These requirements are used to pass command-line arguments to the following variables:<br><br>**{AUTHORING_KEY}**: This key is used to get the packaged app from the LUIS service in the cloud and upload the query logs back to the cloud. The format is `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.<br><br>**{APPLICATION_ID}**: This ID is used to select the App. The format is `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.<br><br>**{ENDPOINT_KEY}**: This key is used to start the container. You can find the endpoint key in two places. The first is the Azure portal within the _Language Understanding_ resource's keys list. The endpoint key is also available in the LUIS portal on the Keys and Endpoint settings page. Do not use the starter key.<br><br>**{BILLING_ENDPOINT}**: The billing endpoint value is available on the Azure portal's Language Understanding Overview page. An example is: `https://westus.api.cognitive.microsoft.com/luis/v2.0`.<br><br>The [authoring key and endpoint key](luis-boundaries.md#key-limits) have different purposes. Do not use them interchangeably. |

### The host computer

The **host** is the computer that runs the docker container. It can be a computer on your premises or a docker hosting service in Azure including:

* [Azure Kubernetes Service](../../aks/index.yml)
* [Azure Container Instances](../../container-instances/index.yml)
* [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](../../azure-stack/index.yml). For more information, see [Deploy Kubernetes to Azure Stack](../../azure-stack/user/azure-stack-solution-template-kubernetes-deploy.md).

### Container requirements and recommendations

This container supports minimum and recommended values for the settings:

|Setting| Minimum | Recommended |
|-----------|---------|-------------|
|Cores<BR>`--cpus`|1 core<BR>at least 2.6 gigahertz (GHz) or faster|1 core|
|Memory<BR>`--memory`|2 GB|4 GB|
|Transactions per second<BR>(TPS)|20 TPS|40 TPS|

The `--cpus` and `--memory` settings are used as part of the `docker run` command.

## Get the container image with `docker pull`

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the `mcr.microsoft.com/azure-cognitive-services/luis` repository:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/luis:latest
```

For a full description of available tags, such as `latest` used in the preceding command, see [LUIS](https://hub.docker.com/r/microsoft/azure-cognitive-services-luis/) on Docker Hub.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID            REPOSITORY                                                                TAG
>  ebbee78a6baa        mcr.microsoft.com/azure-cognitive-services/luis                           latest
>  ``` 

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

![Process for using Language Understanding (LUIS) container](./media/luis-container-how-to/luis-flow-with-containers-diagram.jpg)

1. [Export package](#export-packaged-app-from-luis) for container from LUIS portal or LUIS APIs.
1. Move package file into the required **input** directory on the [host computer](#the-host-computer). Do not rename, alter, or decompress LUIS package file.
1. [Run the container](##run-the-container-with-docker-run), with the required _input mount_ and billing settings. More [examples](luis-container-configuration.md#example-docker-run-commands) of the `docker run` command are available. 
1. [Querying the container's prediction endpoint](#query-the-containers-prediction-endpoint). 
1. When you are done with the container, [import the endpoint logs](#import-the-endpoint-logs-for-active-learning) from the output mount in the LUIS portal and [stop](#stop-the-container) the container.
1. Use LUIS portal's [active learning](luis-how-to-review-endoint-utt.md) on the **Review endpoint utterances** page to improve the app.

The app running in the container can't be altered. In order the change the app in the container, you need to change the app in the LUIS service using the [LUIS](https://www.luis.ai) portal or use the LUIS [authoring APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f). Then train and/or publish, then download a new package and run the container again.

The LUIS app inside the container can't be exported back to the LUIS service. Only the query logs can be uploaded. 

## Export packaged app from LUIS

The LUIS container requires a trained or published LUIS app to answer prediction queries of user utterances. In order to get the LUIS app, use either the trained or published package API. 

The default location is the `input` subdirectory in relation to where you run the `docker run` command.  

Place the package file in a directory and reference this directory as the input mount when you run the docker container. 

### Package types

The input mount directory can contain the **Production**, **Staging**, and **Trained** versions of the app simultaneously. All the packages are mounted. 

|Package Type|Query Endpoint API|Query availability|Package filename format|
|--|--|--|--|
|Trained|Get, Post|Container only|`{APPLICATION_ID}_v{APPLICATION_VERSION}.gz`|
|Staging|Get, Post|Azure and container|`{APPLICATION_ID}_STAGING.gz`|
|Production|Get, Post|Azure and container|`{APPLICATION_ID}_PRODUCTION.gz`|

>**Important:** Do not rename, alter, or decompress the LUIS package files.

### Packaging prerequisites

Before packaging a LUIS application, you must have the following:

|Packaging Requirements|Details|
|--|--|
|Azure _Language Understanding_ resource instance|Supported regions include<br><br>West US (```westus```)<br>West Europe (```westeurope```)<br>Australia East (```australiaeast```)|
|Trained or published LUIS app|With no [unsupported dependencies](#unsupported-dependencies). |
|Access to the [host computer](#the-host-computer)'s file system |The host computer must allow an [input mount](luis-container-configuration.md#mount-settings).|
  
### Export app package from LUIS portal

The LUIS [portal](https://www.luis.ai) provides the ability to export the trained or published app's package. 

### Export published app's package from LUIS portal

The published app's package is available from the **My Apps** list page. 

1. Sign on to the LUIS [portal](https://www.luis.ai).
1. Select the checkbox to the left of the app name in the list. 
1. Select the **Export** item from the contextual toolbar above the list.
1. Select **Export for container (GZIP)**.
1. Select the environment of **Production slot** or **Staging slot**.
1. The package is downloaded from the browser.

![Export the published package for the container from the App page's Export menu](./media/luis-container-how-to/export-published-package-for-container.png)

### Export trained app's package from LUIS portal

The trained app's package is available from the **Versions** list page. 

1. Sign on to the LUIS [portal](https://www.luis.ai).
1. Select the app in the list. 
1. Select **Manage** in the app's navigation bar.
1. Select **Versions** in the left navigation bar.
1. Select the checkbox to the left of the version name in the list.
1. Select the **Export** item from the contextual toolbar above the list.
1. Select **Export for container (GZIP)**.
1. The package is downloaded from the browser.

![Export the trained package for the container from the Versions page's Export menu](./media/luis-container-how-to/export-trained-package-for-container.png)


### Export published app's package from API

Use the following REST API method, to package a LUIS app that you've already [published](luis-how-to-publish-app.md). Substituting your own appropriate values for the placeholders in the API call, using the table below the HTTP specification.

```http
GET /luis/api/v2.0/package/{APPLICATION_ID}/slot/{APPLICATION_ENVIRONMENT}/gzip HTTP/1.1
Host: {AZURE_REGION}.api.cognitive.microsoft.com
Ocp-Apim-Subscription-Key: {AUTHORING_KEY}
```

| Placeholder | Value |
|-------------|-------|
|{APPLICATION_ID} | The application ID of the published LUIS app. |
|{APPLICATION_ENVIRONMENT} | The environment of the published LUIS app. Use one of the following values:<br/>```PRODUCTION```<br/>```STAGING``` |
|{AUTHORING_KEY} | The authoring key of the LUIS account for the published LUIS app.<br/>You can get your authoring key from the **User Settings** page on the LUIS portal. |
|{AZURE_REGION} | The appropriate Azure region:<br/><br/>```westus``` - West US<br/>```westeurope``` - West Europe<br/>```australiaeast``` - Australia East |

Use the following CURL command to download the published package, substituting your own values:

```bash
curl -X GET \
https://{AZURE_REGION}.api.cognitive.microsoft.com/luis/api/v2.0/package/{APPLICATION_ID}/slot/{APPLICATION_ENVIRONMENT}/gzip  \
 -H "Ocp-Apim-Subscription-Key: {AUTHORING_KEY}" \
 -o {APPLICATION_ID}_{APPLICATION_ENVIRONMENT}.gz
```

If successful, the response is a LUIS package file. Save the file in the storage location specified for the input mount of the container. 

### Export trained app's package from API

Use the following REST API method, to package a LUIS application that you've already [trained](luis-how-to-train.md). Substituting your own appropriate values for the placeholders in the API call, using the table below the HTTP specification.

```http
GET /luis/api/v2.0/package/{APPLICATION_ID}/versions/{APPLICATION_VERSION}/gzip HTTP/1.1
Host: {AZURE_REGION}.api.cognitive.microsoft.com
Ocp-Apim-Subscription-Key: {AUTHORING_KEY}
```

| Placeholder | Value |
|-------------|-------|
|{APPLICATION_ID} | The application ID of the trained LUIS application. |
|{APPLICATION_VERSION} | The application version of the trained LUIS application. |
|{AUTHORING_KEY} | The authoring key of the LUIS account for the published LUIS app.<br/>You can get your authoring key from the **User Settings** page on the LUIS portal.  |
|{AZURE_REGION} | The appropriate Azure region:<br/><br/>```westus``` - West US<br/>```westeurope``` - West Europe<br/>```australiaeast``` - Australia East |

Use the following CURL command to download the trained package:

```bash
curl -X GET \
https://{AZURE_REGION}.api.cognitive.microsoft.com/luis/api/v2.0/package/{APPLICATION_ID}/versions/{APPLICATION_VERSION}/gzip  \
 -H "Ocp-Apim-Subscription-Key: {AUTHORING_KEY}" \
 -o {APPLICATION_ID}_v{APPLICATION_VERSION}.gz
```

If successful, the response is a LUIS package file. Save the file in the storage location specified for the input mount of the container. 

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{ENDPOINT_KEY} | This key is used to start the container. Do not use the starter key. |
|{BILLING_ENDPOINT} | The billing endpoint value is available on the Azure portal's Language Understanding Overview page.|

Replace these parameters with your own values in the following example `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={ENDPOINT_KEY}
```

> [!Note] 
> The preceding command uses the directory off the `c:` drive to avoid any permission conflicts on Windows. If you need to use a specific directory as the input directory, you may need to grant the docker service permission. 
> The preceding docker command uses the back slash, `\`, as a line continuation character. Replace or remove this based on your [host computer](#the-host-computer) operating system's requirements. Do not change the order of the arguments unless you are very familiar with docker containers.


This command:

* Runs a container from the LUIS container image
* Loads LUIS app from input mount at c:\input, located on container host
* Allocates two CPU cores and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Saves container and LUIS logs to output mount at c:\output, located on container host
* Automatically removes the container after it exits. The container image is still available on the host computer. 

More [examples](luis-container-configuration.md#example-docker-run-commands) of the `docker run` command are available. 

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> The ApiKey value is the **Key** from the Keys and Endpoints page in the LUIS portal and is also available on the Azure Language Understanding Resource keys page.  

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs. Endpoints for published (staging or production) apps have a _different_ route than endpoints for trained apps. 

Use the host, https://localhost:5000, for container APIs. 

|Package type|Method|Route|Query parameters|
|--|--|--|--|
|Published|[Get](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78), [Post](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee79)|/luis/v2.0/apps/{appId}?|q={q}<br>&staging<br>[&timezoneOffset]<br>[&verbose]<br>[&log]<br>|
|Trained|Get, Post|/luis/v2.0/apps/{appId}/versions/{versionId}?|q={q}<br>[&timezoneOffset]<br>[&verbose]<br>[&log]|

The query parameters configure how and what is returned in the query response:

|Query parameter|Type|Purpose|
|--|--|--|
|`q`|string|The user's utterance.|
|`timezoneOffset`|number|The timezoneOffset allows you to [change the timezone](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity) used by the prebuilt entity datetimeV2.|
|`verbose`|boolean|Returns all intents and their scores when set to true. Default is false, which returns only the top intent.|
|`staging`|boolean|Returns query from staging environment results if set to true. |
|`log`|boolean|Logs queries, which can be used later for [active learning](luis-how-to-review-endoint-utt.md). Default is true.|

### Query published app

An example CURL command for querying the container for a published app is:

```bash
curl -X GET \
"http://localhost:5000/luis/v2.0/apps/{APPLICATION_ID}?q=turn%20on%20the%20lights&staging=false&timezoneOffset=0&verbose=false&log=true" \
-H "accept: application/json"
```
To make queries to the **Staging** environment, change the **staging** query string parameter value to true: 

`staging=true`

### Query trained app

An example CURL command for querying the container for a trained app is: 

```bash
curl -X GET \
"http://localhost:5000/luis/v2.0/apps/{APPLICATION_ID}/versions/{APPLICATION_VERSION}?q=turn%20on%20the%20lights&timezoneOffset=0&verbose=false&log=true" \
-H "accept: application/json"
```
The version name has a maximum of 10 characters and contains only characters allowed in a URL. 

## Import the endpoint logs for active learning

If an output mount is specified for the LUIS container, app query log files are saved in the output directory, where {INSTANCE_ID} is the container ID. The app query log contains the query, response, and timestamps for each prediction query submitted to the LUIS container. 

The following location shows the nested directory structure for the container's log files.
`
/output/luis/{INSTANCE_ID}/
`
 
From the LUIS portal, select your app, then select **Import endpoint logs** to upload these logs. 

![Import container's log files for active learning](./media/luis-container-how-to/upload-endpoint-log-files.png)

After the log is uploaded, [review the endpoint](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-review-endpoint-utterances) utterances in the LUIS portal.

## Stop the container

To shut down the container, in the command-line environment where the container is running, press **Ctrl+C**.

## Troubleshooting

If you run the container with an output [mount](luis-container-configuration.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container. 

## Container's API documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

## Billing

The LUIS container sends billing information to Azure, using a _Language Understanding_ resource on your Azure account. 

Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (the utterance) to Microsoft. 

The `docker run` uses the following arguments for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the _Language Understanding_ resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned LUIS Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the _Language Understanding_ resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned LUIS Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](luis-container-configuration.md).

## Unsupported dependencies

You can use a LUIS application if it **doesn't include** any of the following dependencies:

Unsupported app configurations|Details|
|--|--|
|Unsupported container cultures| German (de-DE)<br>Dutch (nl-NL)<br>Japanese (ja-JP)<br>|
|Unsupported domains|Prebuilt domains, including prebuilt domain intents and entities|
|Unsupported entities for all cultures|[KeyPhrase](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-keyphrase) prebuilt entity for all cultures|
|Unsupported entities for English (en-US) culture|[GeographyV2](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-geographyv2) prebuilt entities|
|Speech priming|External dependencies are not supported in the container.|
|Sentiment analysis|External dependencies are not supported in the container.|
|Bing spell check|External dependencies are not supported in the container.|

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Language Understanding (LUIS) containers. In summary:

* Language Understanding (LUIS) provides one Linux containers for Docker providing endpoint query predictions of utterances.
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You can use REST API to query the container endpoints by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](luis-container-configuration.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](luis-resources-faq.md) to resolve issues related to LUIS functionality.