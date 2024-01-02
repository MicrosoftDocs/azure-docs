---
title: How to use Azure AI Health Insights containers
titleSuffix: Azure AI Health Insights
description: Learn how to use Project Health Insight models on premises using Docker containers.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: how-to
ms.date: 03/14/2023
ms.author: behoorne
---

# Use Azure AI Health Insights containers

These services enable you to host Azure AI Health Insights API on your own infrastructure. If you have security or data governance requirements that can't be fulfilled by calling Azure AI Health Insights remotely, then on-premises Azure AI Health Insights services might be a good solution.

## Prerequisites

You must meet the following prerequisites before using Azure AI Health Insights containers.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure.
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/).
* A [Health Insights resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesHealthInsights)

## Host computer requirements and recommendations

The host that runs the Docker container on your premises, should be an x64-based computer. It can also be a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../../articles/aks/index.yml).
* [Azure Container Instances](../../articles/container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

The following table describes the minimum and recommended specifications for the different Health Insights containers.


| Model | Minimum cpu | Maximum cpu | Minimum memory | Maximum memory|
|----------|--|--|--|--|
| Trial Matcher | 4000m |4000m |5G | 7G | 
| OncoPhenotype | 4000m |8000m |2G | 12G |

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container images with `docker pull`

Azure AI Health Insights container images can be found on the `mcr.microsoft.com` container registry syndicate. They reside within the `azure-cognitive-services/health-insights/` repository and can be found by their model name.

- Clinical Trial Matcher: The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/health-insights/clinical-matching`
- Onco-Phenotype: The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/health-insights/cancer-profiling`

To use the latest version of the container, you can use the `latest` tag. You can  find a full list of tags on the MCR via `https://mcr.microsoft.com/v2/azure-cognitive-services/health-insights/clinical-matching/tags/list` and `https://mcr.microsoft.com/v2/azure-cognitive-services/health-insights/cancer-profiling/tags/list`.

- Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download this container image from the Microsoft public container registry. You can find the featured tags on the [docker hub clinical matching page](https://hub.docker.com/_/microsoft-azure-cognitive-services-health-insights-clinical-matching) and [docker hub cancer profiling page](https://hub.docker.com/_/microsoft-azure-cognitive-services-health-insights-cancer-profiling)  

```
docker pull mcr.microsoft.com/azure-cognitive-services/health-insights/<model-name>:<tag-name>
```

- For Clinical Trial Matcher, use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download textanalytics healthcare container image from the Microsoft public container registry. You can find the featured tags on the [docker hub](https://hub.docker.com/_/microsoft-azure-cognitive-services-textanalytics-healthcare)

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:<tag-name>
```

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID         REPOSITORY                TAG
>  <image-id>       <repository-path/name>    <tag-name>
>  ```

## Run the container with `docker run`

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container continues to run until you stop it.
container-
> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements.
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
>   * The responsible AI '`RAI_Terms` acknowledgment must also be present with a value of `accept`.

There are multiple ways you can install and run Azure AI Health Insights containers. 

- Use the Azure portal to create an Azure AI Health Insights resource, and use Docker to get your container.
- Use an Azure VM with Docker to run the container. 
- Use PowerShell and Azure CLI scripts to automate resource deployment and container configuration.

When you use Azure AI Health Insights container, the data contained in your API requests and responses isn't visible to Microsoft, and is not used for training the model applied to your data. 

### Run the container locally 

> [!IMPORTANT]
> The docker run command can only be used of the cancer-profiling model, to use the clinical-matching model, you should use the docker compose command. see Example Docker compose file.

To run the container in your own environment after downloading the container image, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Health Insights resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

```bash
docker run --rm -it -p 5000:5000 --cpus 6 --memory 12g \
mcr.microsoft.com/azure-cognitive-services/health-insights/<model-name>:<tag-name> \
Eula=accept \
rai_terms=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} 
```

For Clinical Trials, add this value:
TrialMatcher__TA4HConfiguration__Host =   `https://<text-analytics-container-endpoint>:5000` 

This command:

- Runs Azure AI Health Insights container from the container image
- Allocates 6 CPU core and 12 gigabytes (GB) of memory
- Exposes TCP port 5000 and allocates a pseudo-TTY for the container
- Accepts the end user license agreement (EULA) and responsible AI (RAI) terms
- Automatically removes the container after it exits. The container image is still available on the host computer.

### Submit a query to the container

Use the example cURL request as a reference how to submit a query to the container you have deployed replacing the `serverURL` variable with the appropriate value.

```bash
curl -X POST 'http://<serverURL>:5000/health-insights/<model>/jobs?api-version=<version>/' --header 'Content-Type: application/json' --header 'accept: application/json' --data-binary @example.json
```

#### Example docker compose file

The below example shows how a [docker compose](https://docs.docker.com/compose/reference/overview) file can be created to deploy the health-insights containers. 

```yaml
version: "3"
services:
 azure-cognitive-service-health-insights-clinical-matching:
    container_name: azure-cognitive-service-health-insights-clinical-matching
    image: {TRIAL_MATCHER_IMAGE_ID}
    environment:
      - EULA=accept
      - RAI_TERMS=accept
      - billing={AHI_ENDPOINT_URI}
      - ApiKey={AHI_API_KEY}
      - TrialMatcher__TA4HConfiguration__Host={http://<text-analytics container endpoint>:5000}
    ports:
      - 5000:5000/tcp
    networks:
      - hivnet
 azure-cognitive-service-ta4h:
    container_name: azure-cognitive-service-ta4h
    image: {TA4H_IMAGE_ID}
    environment:
      - EULA=accept
      - RAI_TERMS=accept
      - billing={TA4H_ENDPOINT_URI}
      - ApiKey={TA4H_API_KEY}
    networks:
      - hivnet
networks:
 ds4hvnet:
    driver: bridge

```

To initiate this Docker compose file, execute the following command from a console at the root level of the file:

```bash
docker-compose up
```

### Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Azure AI Health Insights container running on the HOST together. You also can have multiple containers of the same Azure AI Health Insights container running.

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

### Validate that a container is running

There are several ways to validate that the container is running. Locate the *External IP* address and exposed port of the container in question, and open your favorite web browser. Use the various request URLs that follow to validate the container is running. The example request URLs listed here are `http://localhost:5000`, but your specific container might vary. Make sure to rely on your container's *External IP* address and exposed port.

| Request URL | Purpose |
|--|--|
| `http://localhost:5000/` | The container provides a home page. |
| `http://localhost:5000/ready` | Requested with GET, this URL provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/status` | Also requested with GET, this URL verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |


## Stop the container

To shut down the container, in the command-line environment where the container is running, select `Ctrl+C`.


## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files. The log files are helpful to troubleshoot issues that happen while starting or running the container.

## Billing

Azure AI Health Insights containers send billing information to Azure, using a *Language* resource on your Azure account. 

Queries to the container are billed at the pricing tier of the Azure resource that's used for the `ApiKey` parameter.

Azure AI Health Insights containers aren't licensed to run without being connected to the metering or billing endpoint. You must enable the containers to communicate billing information with the billing endpoint always. Azure AI Health Insights containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.

### Connect to Azure

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every **10 to 15 minutes**. If the container doesn't connect to Azure within the allowed time window, the container continues to run but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. 

### Billing arguments

The [docker run](https://docs.docker.com/engine/reference/commandline/run/) command starts the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of Azure AI Health Insights resource that's used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource that's specified in `Billing`. |
| `Billing` | The endpoint of Azure AI Health Insights resource that's used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Azure AI Health Insights containers. In summary:

* Azure AI Health Insights service provides a Linux container for Docker
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Azure AI Health Insights containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI Health Insights containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI Health Insights containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps
>[!div class="nextstepaction"]
* See [Configure containers](configure-containers.md) for configuration settings.
