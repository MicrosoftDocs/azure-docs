---
title: How to install and run containers
titlesuffix: LUIS - Cognitive Services - Azure
description: How to download, install, and run containers for LUIS in this walkthrough tutorial.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 12/04/2018
ms.author: diberry
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service is packaged, including configuration and dependencies, as a single container image. The container is deployed on a container host with little or no modification. Using a Cognitive Service container has [several features and benefits](cognitive-services-container-support.md#features-and-benefits). Additionally, the LUIS container allows you to extend beyond current transactions per second (TPS) limits.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Features

Features of the LUIS container included:

* Use an existing LUIS app's trained or published model. 
* Get prediction queries from the container's endpoint.
* Optionally, capture query logs and upload to [LUIS.ai](https://www.luis.ai) to [improve prediction accuracy](luis-concept-review-endpoint-utterances.md) through active learning.  

## Prerequisites

You must satisfy the following prerequisites before using Cognitive Services Containers:

|Prerequisite|Notes|
|--|--|
|Azure CLI| You must have Azure CLI version 2.0.29 or later installed on your local computer. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).<br><br>Because Azure Cloud Shell does not include the Docker daemon, you *must* install both the Azure CLI and Docker Engine on your *local computer*. You cannot use the Azure Cloud Shell.|
|Docker Engine | To complete this preview, you need Docker Engine installed on a host computer. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send usage data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.|
|Familiarity with Azure Container Registry and Docker | You should have a basic understanding of both Azure Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `az acr` and `docker` commands.<br><br>For Azure Container Registry basics, see the [Azure Container Registry overview](https://docs.microsoft.com/azure/container-registry/container-registry-intro).| 
|LUIS app|In order to use the container, you must have a trained or published app packaged as a mounted input to the container. You need the Authoring Key, the App ID and the Endpoint Key.<br><br>**Authoring key**: This key is used to get the packaged app from the LUIS service in the cloud and upload the query logs back to the cloud.<br><br>**App ID**: This ID is used to select the App, either on the container or in the cloud.<br><br>**Endpoint key**: This key is used to start the container. You can find the endpoint key in two places. The first is the Azure portal within the LUIS resource's keys list. The endpoint key is also available in the LUIS portal on the Keys and Endpoint settings page. [TBD???] Do not use the starter key.<br><br>**Billing endpoint**: The billing endpoint value is available on the Azure portal's Language Understanding Overview page. An example is: `https://westus.api.cognitive.microsoft.com/luis/v2.0`<br><br>The LUIS resource associated with this app must use the **F0 pricing tier**. |



### Server requirements and recommendations

This container supports minimum and recommended values for the following:

|Setting| Minimum | Recommended |
|-----------|---------|-------------|
|Cores|1 core<BR>at least 2.6 gigahertz (GHz) or faster|1 core|
|Memory|2 GB|4 GB|
|Transactions per second<BR>(TPS)|20 TPS|40 TPS|

## Download container image from the container registry

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the `mcr.microsoft.com/azure-cognitive-services/luis` repository:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/luis/microsoft/cognitive-services-luis:latest
```

For a full description of available tags, such as `latest` used in the preceding command, see [LUIS]() on Docker Hub. [TBD: what is the link?]

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ``` 

## Architectural flow between LUIS service and container

Once the container is on the host computer, use the architectural flow to work with the container.

1. [Request LUIS app package](#request-luis-app-package) from an existing [trained](#request-trained-models-package) or [published](#request-published-models-package) app.
1. Save package file to local file system as *.gz file. 
1. Move package file into the required input directory on the host. Do not open or uncompress the file.

    The host is the computer that runs the docker container. It can be the local computer or any docker hosting service including Azure Kubernetes, Azure Container instances, Kubernetes cluster, and Azure stack.

1. [Run the container](#run-the-container) with required input mount of the app package and optional output mount for query logs.
1. Use container, querying the container's prediction endpoint. 
1. When you are done with the container, upload the query log to the LUIS portal. 
1. Use LUIS portal's active learning on the **Review endpoint utterances** page to improve the app.

![Conceptual architecture of LUIS service, container, and portal](./media/luis-container-how-to/luis-container-architecture.png)

## Request LUIS app package

The LUIS container requires a trained or published LUIS app model to answer prediction queries of user utterances. In order to get the LUIS app model, use either the [published](get-a-published-models-package.md) or [trained](get-a-trained-models-package.md) download API. 

The resulting gzip file needs to be in the input location you specify in the `docker run` command. The default location is the `input` subdirectory in relation to where you run the `docker run` command.  

Place the package file in a directory and reference this directory as the input mount when you run the docker container. 

The input mount directory can contain the **Production**, **Staging**, and **Trained** versions of the app simultaneously. All the packages are mounted. The production and staging endpoints are available through the same GET/POST APIs as the Azure LUIS service provides. The trained version has its own GET/POST APIs which are only available on the container. There is no corresponding API on the Azure LUIS service. 

|Version|API|Availability|
|--|--|--|
|Trained|Get, Post|Container only|
|Staging|Get, Post|Azure and container|
|Production|Get, Post|Azure and container|

For information on how to query the container, see [Performing LUIS operations](#performing-luis-operations).

>**Important:** Do not rename, alter, or decompress LUIS package files.

### Packaging prerequisites

Before packaging a LUIS application, you must have the following:

|Packaging Requirements|Details|
|--|--|
|Azure LUIS resource instance|Supported regions include<br>West US (```westus```)<br>West Europe (```westeurope```)<br>Australia East (```australiaeast```)|
|Trained or published LUIS app ID|With no [unsupported dependencies](#unsupported-dependencies). You can get the application ID from the **Manage** section's **Application Information** page for the LUIS application on the LUIS portal.|
|Access to storage for host computer mounts|For more information about using an input mount with your LUIS container, see [Using mounts with LUIS](#using-mounts-with-luis)|
  

### Request published model's package

Use the following REST API method, to package a LUIS application that you've already published on Azure. Substituting your own appropriate values for the placeholders in the API call, using the table below the HTTP specification.

```http
GET /luis/webapi/v2.0/package/{APPLICATION_ID}/slot/{APPLICATION_ENVIRONMENT}/gzip HTTP/1.1
Host: {AZURE_REGION}.api.cognitive.microsoft.com
Ocp-Apim-Subscription-Key: {AUTHORING_KEY}
```

| Placeholder | Value |
|-------------|-------|
|{APPLICATION_ID} | The application ID of the published LUIS application. |
|{APPLICATION_ENVIRONMENT} | The environment of the published LUIS application. Use one of the following values:<br/>```PRODUCTION```<br/>```STAGING``` |
|{AUTHORING_KEY} | The authoring key of the LUIS account for the published LUIS application.<br/>You can get your authoring key from the **User Settings** page for your LUIS account on the LUIS portal. |
|{AZURE_REGION} | One of the following values for the appropriate Azure region:<br/>```westus``` - West US<br/>```westeurope``` - West Europe<br/>```australiaeast``` - Australia East |

Use the following CURL command to download the published package, substituting your:

```bash
curl -X GET \
https://{AZURE_REGION}.api.cognitive.microsoft.com/luis/webapi/v2.0/package/{APPLICATION_ID}/slot/{APPLICATION_ENVIRONMENT}/gzip  \
 -H "Ocp-Apim-Subscription-Key: {AUTHORING_KEY}" \
 -o {APPLICATION_ID}_{APPLICATION_ENVIRONMENT}.gz
```

If successful, the response is a LUIS package file, sent as an attachment in an octet stream. You must save the file in the storage location specified for the input mount of the LUIS container. The LUIS package file uses the following naming convention, in which ```{APPLICATION_ID}``` represents the application ID and ```{APPLICATION_ENVIRONMENT}``` represents the environment of the packaged LUIS application:

`{APPLICATION_ID}_{APPLICATION_ENVIRONMENT}.gz`

Remember to save or move the file to the `input` location.

### Request trained model's package

Use the following REST API method, to package a LUIS application that you've already published on Azure. Substituting your own appropriate values for the placeholders in the API call, using the table below the HTTP specification.

```http
GET /luis/webapi/v2.0/package/{APPLICATION_ID}/versions/{APPLICATION_VERSION}/gzip HTTP/1.1
Host: {AZURE_REGION}.api.cognitive.microsoft.com
Ocp-Apim-Subscription-Key: {AUTHORING_KEY}
```

| Placeholder | Value |
|-------------|-------|
|{APPLICATION_ID} | The application ID of the trained LUIS application. |
|{APPLICATION_VERSION} | The application version of the trained LUIS application. |
|{AUTHORING_KEY} | The authoring key of the LUIS account for the trained LUIS application.<br/>You can get your authoring key from the **User Settings** page for your LUIS account on the LUIS portal. |
|{AZURE_REGION} | One of the following values for the appropriate Azure region:<br/>```westus``` - West US<br/>```westeurope``` - West Europe<br/>```australiaeast``` - Australia East |

Use the following CURL command to download the trained package:

```bash
curl -X GET \
https://{AZURE_REGION}.api.cognitive.microsoft.com/luis/webapi/v2.0/package/{APPLICATION_ID}/versions/{APPLICATION_VERSION}/gzip  \
 -H "Ocp-Apim-Subscription-Key: {AUTHORING_KEY}" \
 -o {APPLICATION_ID}_v{APPLICATION_VERSION}.gz
```
The letter `v` precedes the `{APPLICATION_VERSION}` in the -o argument value. 

If successful, the response is a LUIS package file, sent as an attachment in an octet stream. You must save the package file in the storage location specified for the input mount of the LUIS container. The LUIS package file uses the following naming convention, in which ```{APPLICATION_ID}``` represents the application ID and ```{APPLICATION_VERSION}``` represents the application version of the packaged LUIS application:

`{APPLICATION_ID}_v{APPLICATION_VERSION}.gz`

Remember to save or move the file to the `input` location.

## Run the container 

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to start and run the container. This command:

* Runs a container from the LUIS container image
* Allocates two CPU cores and 6 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits

```Docker
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 mcr.microsoft.com/azure-cognitive-services/luis/microsoft/cognitive-services-luis Eula=accept Billing=https://westus.api.cognitive.microsoft.com/luis/v1.0 ApiKey={APPLICATION_ID}
```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> The ApiKey value is the **Key** from the Keys and Endpoints page in the LUIS portal and is also available on the Azure Language Understanding Resource keys page.  

Once running, you can make HTTP requests to the container by using the container's host URI. For example, the following URI can be used to make a GET request with the user utterance `turn on the lights`:

```http
http://localhost:5000/luis/v2.0/apps/{APPLICATION_ID}?q=turn%20on%20the%20lights&staging=false&timezoneOffset=0&verbose=false&log=true
```

In the preceding URI, replace the `{APPLICATION_ID}` with your own LUIS app's ID. Because this container was started with the ApiKey value of your Azure resource key for LUIS, you do not need to add it to every HTTP request to the container. 

## Query the container

When the container is running, the container receives and responds to HTTP REST-based requests for LUIS predictions. The format of the REST-based request is almost exactly the same as a REST-based request to the Azure LUIS service.  

|Location|Host URI|
|--|--|
|Azure region| GET https://**westus.api.cognitive.microsoft.com**/luis/v2.0/apps/ddd7dcdb-c37d-46af-88e1-8b97951ca1c2?staging=false&q=turn on the bedroom light|
|Container|  GET http://**localhost:5000**/luis/v2.0/apps/ddd7dcdb-c37d-46af-88e1-8b97951ca1c2?staging=false&q=turn on the bedroom light|

An example CURL command for querying the container is:

```bash
curl -X GET \
"http://localhost:5000/luis/v2.0/apps/8c985349-ffef-4a45-9d9f-dcfe5e1af7ee?q=turn%20on%20the%20lights&staging=false&timezoneOffset=0&verbose=false&log=true" \
-H "accept: application/json"
```

### Container APIs

The container provides REST-based API endpoints. Endpoints for published (staging or production) apps have a _different_ route than endpoints for trained apps. 

Use the host, https://localhost:5000, for container APIs. 

|Package type|Method|Route|Query parameters|
|--|--|--|--|
|Published|[Get](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78), [Post](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee79)|/luis/v2.0/apps/{appId}?|q={q}<br>[&timezoneOffset][&verbose]<br>[&staging]<br>[&log]|
|Trained|Get, Post|/luis/v2.0/apps/{appId}/versions/{versionId}?|q={q}<br>[&timezoneOffset]<br>[&verbose]<br>[&log]|

To make queries to the **Staging** environment, change the **staging** query string parameter value to true: 

`staging=true`

### Query container from an SDK
Query operations from an SDK are available for published staging or production slot packaged apps only. 

You can either [call the Prediction REST API operations](https://aka.ms/LUIS-endpoint-APIs) available from your container, or use the [Azure Cognitive Services LUIS Client Library](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) to call those operations.  

> [!IMPORTANT]
> You must have Azure Cognitive Services LUIS Client Library version 2.0.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from the service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. 

## Active learning with LUIS

If an output mount is specified for the LUIS container, application query log files, along with container logs for debugging, are captured in the following folder at that storage location, replacing {INSTANCE_ID} with the container ID. 

`
/luis/{INSTANCE_ID}/
`

The application query log file contains the query, response, and timestamp for each prediction query submitted to the LUIS container for a given LUIS application. 

You can upload the application query log files to the Language Understanding (LUIS) service by using the following REST API method, substituting the appropriate values for the placeholders in the following table:

| Placeholder | Value |
|-------------|-------|
|{APPLICATION_ID} | The application ID of the trained or published LUIS application. |
|{AUTHORING_KEY} | The authoring key of the LUIS account for the trained or published LUIS application.<br/>You can get your authoring key from the **User Settings** page for your LUIS account on the LUIS portal. |
|{AZURE_REGION} | One of the following values for the appropriate Azure region:<br/>```westus``` - West US<br/>```westeurope``` - West Europe<br/>```australiaeast``` - Australia East |
|{QUERY_LOG_FILE} | The full path and file name of the application query log file. |

```http
POST /webapi/v2.0/apps/{APPLICATION_ID}/unlabeled HTTP/1.1
Host: {AZURE_REGION}.api.cognitive.microsoft.com
APIM-SUBSCRIPTION-ID: {AUTHORING_KEY}
Content-Type: multipart/form-data

Content-Disposition: form-data; name=""; filename="{QUERY_LOG_FILE}"
```

An example CURL command for uploading the query log is:

```bash
curl -X POST \
"http://westus.api.cognive.microsoft.com/luis/webapi/v2.0/apps/{APPLICATION_ID}/unlabeled" \
-H "APIM-SUBSCRIPTION-ID: {AUTHORING_KEY}" \
-H "Content-Type: multipart/form-data"
```

If successful, the method responds with an HTTP 200 status code. After the log is uploaded, review the endpoint utterances in the LUIS portal. Perform the actions needed to identify unlabeled entities, align utterances with intents, delete utterances, as you typically would for a LUIS application. For more information about reviewing endpoint utterances, see [Enable active learning by reviewing endpoint utterances](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-review-endpoint-utterances).


### LUIS documentation on the container

The container provides a full set of documentation for the endpoints as well as the `Try it now` feature. This feature allows you to enter your settings and information into an web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a run container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the container:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

### Billing

The LUIS container sends billing information to Azure, using a LUIS resource on your Azure account. The following command-line options configured and used with the `docker run` command are used for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the LUIS resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned LUIS Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the LUIS resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned LUIS Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](luis-container-configuration.md).

## Unsupported dependencies

You can use a LUIS application if it **doesn't include** any of the following:

|Do not use<br>in trained app|Do not use<br>in published app|Unsupported app configurations|Details|
|--|--|--|--|
|X|X|Unsupported container cultures| German (de-DE)<br>Dutch (nl-NL)<br>Japanese (ja-JP)<br>|
|X|X|Unsupported domains|Prebuilt domains, including prebuilt domain intents and entities|
|X|X|Unsupported entities for all cultures|[KeyPhrase](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-keyphrase) prebuilt entity for all cultures|
|X|X|Unsupported entities for English (en-US) culture|[GeographyV2](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-geographyv2) and [PersonName](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-person) prebuilt entities|
|X|X|Unsupported entities for Chinese (zh-CN) culture|[PersonName](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-prebuilt-person) prebuilt entity for Chinese| 
||X|Speech priming|External dependencies are not supported in the container.|
||X|Sentiment analysis|External dependencies are not supported in the container.|
||X|Bing spell check|External dependencies are not supported in the container.|


## Summary

In this article, you learned concepts and workflow for downloading, installing, and running LUIS containers. In summary:

* LUIS provides one Linux container for Docker, named LUIS, to detect TBD.
* Container images are downloaded from a private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in LUIS containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.
* ** Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.  

## Next steps

* Review [Configure containers](luis-container-configuration.md) for configuration settings
* Review [LUIS overview](what-is-luis.md) to learn more about TBD
* Refer to the [LUIS API](TBD) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](luis-resources-faq.md) to resolve issues related to LUIS functionality.