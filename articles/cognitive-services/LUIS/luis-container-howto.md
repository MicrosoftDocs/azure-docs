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
ms.date: 11/14/2018
ms.author: diberry
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service is packaged, including configuration and dependencies, as a single container image. The container is deployed on a container host with little or no modification. 

The LUIS container allows you to extend beyond current Azure LUIS service transactions per second (TPS) quota.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Features of the LUIS container

Features of the LUIS container included:

* Load an existing LUIS app's trained or published model 
* Get prediction queries from the container's endpoint
* Capture query logs and upload to [LUIS.ai](https://www.luis.ai) to [improve prediction accuracy](luis-concept-review-endpoint-utterances.md) through active learning. 

When using the container, all user utterances sent to the container, stay on the container. Optionally, you can upload the utterance query logs from the container back to the LUIS service for active learning. 

## The container replaces the prediction runtime endpoint

The LUIS container allows you to replace calls to the Azure LUIS runtime service with calls to the container. The API URL is formatted exactly the same, except for the URL host and port.  

|Location|Host URI|
|--|--|
|Azure region| GET https://**westus.api.cognitive.microsoft.com**/luis/v2.0/apps/ddd7dcdb-c37d-46af-88e1-8b97951ca1c2?staging=false&q=turn on the bedroom light|
|Container|  GET http://**localhost:5000**/luis/v2.0/apps/ddd7dcdb-c37d-46af-88e1-8b97951ca1c2?staging=false&q=turn on the bedroom light|


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

## Using the container's APIs

When the container is running, the container receives and responds to HTTP REST-based requests for LUIS predictions. The format of the REST-based request is almost exactly the same as a REST-based request to the Azure LUIS service. The only difference is the host URL and port used to make the request. 

### LUIS rest-based APIs on the container

The container provides two REST-based API endpoints.

|REST-based API|Purpose|
|--|--|
|LUIS prediction endpoint|Send an user's utterance and receive the prediction for intent, entities, and any other configured settings.|
|LUIS query log extraction|Upload container's query logs to Azure LUIS service to continuing improving model with [Active Learning](luis-concept-review-endpoint-utterances)|.

### Calling container from an SDK

You can either [call the Prediction REST API operations](https://aka.ms/LUIS-endpoint-APIs) available from your container, or use the [Azure Cognitive Services LUIS Client Library](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) to call those operations.  

> [!IMPORTANT]
> You must have Azure Cognitive Services LUIS Client Library version 2.0.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from the service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. 

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