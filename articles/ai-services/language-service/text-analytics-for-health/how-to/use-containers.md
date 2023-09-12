---
title: How to use Text Analytics for health containers
titleSuffix: Azure AI services
description: Learn how to extract and label medical information on premises using Text Analytics for health Docker container.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 01/18/2023
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Use Text Analytics for health containers

Containers enable you to host the Text Analytics for health API on your own infrastructure. If you have security or data governance requirements that can't be fulfilled by calling Text Analytics for health remotely, then containers might be a good option.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

You must meet the following prerequisites before using Text Analytics for health containers. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

[!INCLUDE [Gathering required parameters](../../../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../../../includes/cognitive-services-containers-host-computer.md)]

The following table describes the minimum and recommended specifications for the Text Analytics for health containers. Each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Second (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **1 document/request**   |  4 core, 12GB memory | 6 core, 12GB memory |15 | 30|
| **10 documents/request**   |  6 core, 16GB memory | 8 core, 20GB memory |15 | 30|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

The Text Analytics for health container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `healthcare`. The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare`

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/healthcare/tags).

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download this container image from the Microsoft public container registry. You can find the featured tags on the  [Microsoft Container Registry](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/healthcare/about)  

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:<tag-name>
```

[!INCLUDE [Tip for using docker list](../../../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Run the container with `docker run`

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
>   * The [responsible AI](/legal/cognitive-services/text-analytics/transparency-note-health)  (RAI) acknowledgment must also be present with a value of `accept`.
> * The sentiment analysis and language detection containers use v3 of the API, and are generally available. The key phrase extraction container uses v2 of the API, and is in preview.

There are multiple ways you can install and run the Text Analytics for health container. 

- Use the Azure portal to create a Language resource, and use Docker to get your container.
- Use an Azure VM with Docker to run the container. Refer to [Docker on Azure](../../../../docker/index.yml).
- Use the following PowerShell and Azure CLI scripts to automate resource deployment and container configuration.

When you use the Text Analytics for health container, the data contained in your API requests and responses is not visible to Microsoft, and is not used for training the model applied to your data. 

### Run the container locally

To run the container in your own environment after downloading the container image, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Language resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

```bash
docker run --rm -it -p 5000:5000 --cpus 6 --memory 12g \
mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:<tag-name> \
Eula=accept \
rai_terms=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} 
```

This command:

- Runs the Text Analytics for health container from the container image
- Allocates 6 CPU core and 12 gigabytes (GB) of memory
- Exposes TCP port 5000 and allocates a pseudo-TTY for the container
- Accepts the end user license agreement (EULA) and responsible AI (RAI) terms
- Automatically removes the container after it exits. The container image is still available on the host computer.

### Demo UI to visualize output

The container provides REST-based query prediction endpoint APIs.  We have also provided a visualization tool in the container that is accessible by appending `/demo` to the endpoint of the container. For example:

```
http://<serverURL>:5000/demo
```

Use the example cURL request below to submit a query to the container you have deployed replacing the `serverURL` variable with the appropriate value.

```bash
curl -X POST 'http://<serverURL>:5000/text/analytics/v3.1/entities/health' --header 'Content-Type: application/json' --header 'accept: application/json' --data-binary @example.json

```

### Install the container using Azure Web App for Containers

Azure [Web App for Containers](https://azure.microsoft.com/services/app-service/containers/) is an Azure resource dedicated to running containers in the cloud. It brings out-of-the-box capabilities such as autoscaling, support for docker containers and docker compose, HTTPS support and much more.

> [!NOTE]
> Using Azure Web App you will automatically get a domain in the form of `<appservice_name>.azurewebsites.net`

Run this PowerShell script using the Azure CLI to create a Web App for Containers, using your subscription and the container image over HTTPS. Wait for the script to complete (approximately 25-30 minutes) before submitting the first request.

```azurecli
$subscription_name = ""                    # THe name of the subscription you want you resource to be created on.
$resource_group_name = ""                  # The name of the resource group you want the AppServicePlan
                                           #    and AppSerivce to be attached to.
$resources_location = ""                   # This is the location you wish the AppServicePlan to be deployed to.
                                           #    You can use the "az account list-locations -o table" command to
                                           #    get the list of available locations and location code names.
$appservice_plan_name = ""                 # This is the AppServicePlan name you wish to have.
$appservice_name = ""                      # This is the AppService resource name you wish to have.
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Language resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Language resource.
$DOCKER_IMAGE_NAME = "mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latest"

az login
az account set -s $subscription_name
az appservice plan create -n $appservice_plan_name -g $resource_group_name --is-linux -l $resources_location --sku P3V2
az webapp create -g $resource_group_name -p $appservice_plan_name -n $appservice_name -i $DOCKER_IMAGE_NAME 
az webapp config appsettings set -g $resource_group_name -n $appservice_name --settings Eula=accept rai_terms=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

# Once deployment complete, the resource should be available at: https://<appservice_name>.azurewebsites.net
```

### Install the container using Azure Container Instance

You can also use an Azure Container Instance (ACI) to make deployment easier. ACI is a resource that allows you to run Docker containers on-demand in a managed, serverless Azure environment. 

See [How to use Azure Container Instances](../../../containers/azure-container-instance-recipe.md) for steps on deploying an ACI resource using the Azure portal. You can also use the below PowerShell script using Azure CLI, which will create an ACI on your subscription using the container image.  Wait for the script to complete (approximately 25-30 minutes) before submitting the first request.  Due to the limit on the maximum number of CPUs per ACI resource, do not select this option if you expect to submit more than 5 large documents (approximately 5000 characters each) per request.
See the [ACI regional support](../../../../container-instances/container-instances-region-availability.md) article for availability information. 

> [!NOTE] 
> Azure Container Instances don't include HTTPS support for the builtin domains. If you need HTTPS, you will need to manually configure it, including creating a certificate and registering a domain. You can find instructions to do this with NGINX below.

```azurecli
$subscription_name = ""                    # The name of the subscription you want you resource to be created on.
$resource_group_name = ""                  # The name of the resource group you want the AppServicePlan
                                           # and AppService to be attached to.
$resources_location = ""                   # This is the location you wish the web app to be deployed to.
                                           # You can use the "az account list-locations -o table" command to
                                           # Get the list of available locations and location code names.
$azure_container_instance_name = ""        # This is the AzureContainerInstance name you wish to have.
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Language resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Language resource.
$DNS_LABEL = ""                            # This is the DNS label name you wish your ACI will have
$DOCKER_IMAGE_NAME = "mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latest"

az login
az account set -s $subscription_name
az container create --resource-group $resource_group_name --name $azure_container_instance_name --image $DOCKER_IMAGE_NAME --cpu 4 --memory 12 --port 5000 --dns-name-label $DNS_LABEL --environment-variables Eula=accept rai_terms=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

# Once deployment complete, the resource should be available at: http://<unique_dns_label>.<resource_group_region>.azurecontainer.io:5000
```

### Secure ACI connectivity

By default there is no security provided when using ACI with container API. This is because typically containers will run as part of a pod which is protected from the outside by a network bridge. You can however modify a container with a front-facing component, keeping the container endpoint private. The following examples use [NGINX](https://www.nginx.com) as an ingress gateway to support HTTPS/SSL and client-certificate authentication.

> [!NOTE]
> NGINX is an open-source, high-performance HTTP server and proxy. An NGINX container can be used to terminate a TLS connection for a single container. More complex NGINX ingress-based TLS termination solutions are also possible.

#### Set up NGINX as an ingress gateway

NGINX uses [configuration files](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) to enable features at runtime. In order to enable TLS termination for another service, you must specify an SSL certificate to terminate the TLS connection and  `proxy_pass` to specify an address for the service. A sample is provided below.


> [!NOTE]
> `ssl_certificate` expects a path to be specified within the NGINX container's local filesystem. The address specified for `proxy_pass` must be available from within the NGINX container's network.

The NGINX container will load all of the files in the `_.conf_` that are mounted under `/etc/nginx/conf.d/` into the HTTP configuration path.

```nginx
server {
  listen              80;
  return 301 https://$host$request_uri;
}
server {
  listen              443 ssl;
  # replace with .crt and .key paths
  ssl_certificate     /cert/Local.crt;
  ssl_certificate_key /cert/Local.key;

  location / {
    proxy_pass http://cognitive-service:5000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP  $remote_addr;
  }
}
```

#### Example Docker compose file

The below example shows how a [docker compose](https://docs.docker.com/compose/reference/overview) file can be created to deploy NGINX and health containers:

```yaml
version: "3.7"
services:
  cognitive-service:
    image: {IMAGE_ID}
    ports:
      - 5000:5000
    environment:
      - eula=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
    volumes:
        # replace with path to logs folder
      - <path-to-logs-folder>:/output
  nginx:
    image: nginx
    ports:
      - 443:443
    volumes:
        # replace with paths for certs and conf folders
      - <path-to-certs-folder>:/cert
      - <path-to-conf-folder>:/etc/nginx/conf.d/
```

To initiate this Docker compose file, execute the following command from a console at the root level of the file:

```bash
docker-compose up
```

For more information, see NGINX's documentation on [NGINX SSL Termination](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/).

[!INCLUDE [Running multiple containers on the same host](../../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

[!INCLUDE [Container's API documentation](../../../../../includes/cognitive-services-containers-api-documentation.md)]


### Structure the API request for the container

You can use Postman or the example cURL request below to submit a query to the container you deployed, replacing the `serverURL` variable with the appropriate value.  Note the version of the API in the URL for the container is different than the hosted API.

[!INCLUDE [Use APIs in container](../includes/container-request.md)]


## Run the container with client library support

Starting with container version `3.0.017010001-onprem-amd64` (or if you use the `latest` container), you can run the Text Analytics for health container using the [client library](../quickstart.md). To do so, add the following parameter to the `docker run` command:

`enablelro=true`

Afterwards when you authenticate the client object, use the endpoint that your container is running on:

`http://localhost:5000`

For example, if you're using C# you would use the following code:

```csharp
var client = new TextAnalyticsClient("http://localhost:5000", "your-text-analytics-key");
```

## Stop the container

[!INCLUDE [How to stop the container](../../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](configure-containers.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../../../containers/includes/cognitive-services-faq-note.md)]

## Billing

Text Analytics for health containers send billing information to Azure, using a _Language_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics for health containers. In summary:

* Text Analytics for health provides a Linux container for Docker
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics for health containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* See [Configure containers](configure-containers.md) for configuration settings.
