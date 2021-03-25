---
title: Run container example of docker run command
titleSuffix: Azure Cognitive Services
description: Docker run command for health container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 11/12/2020
ms.author: aahi
---

## Install the container

There are multiple ways you can install and run the Text Analytics for health container. 

- Use the [Azure portal](../how-tos/text-analytics-how-to-install-containers.md?tabs=healthcare) to create a Text Analytics resource, and use Docker to get your container.
- Use the following PowerShell and Azure CLI scripts to automate resource deployment and container configuration.

### Run the container locally

To run the container in your own environment after downloading the container image, find its image ID:
 
```bash
docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
```

Execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the Text Analytics API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| **{IMAGE_ID}** | The image ID for your container. | `1.1.011300001-amd64-preview` |
| **{INPUT_DIR}** | The input directory for the container. | Windows: `C:\healthcareMount` <br> Linux/MacOS: `/home/username/input` |

```bash
docker run --rm -it -p 5000:5000 --cpus 6 --memory 12g \
--mount type=bind,src={INPUT_DIR},target=/output {IMAGE_ID} \
Eula=accept \
RAI=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Disk:Format=json
```

This command:

- Assumes that the input directory exists on the host machine
- Runs a Text Analytics for Health container from the container image
- Allocates 6 CPU core and 12 gigabytes (GB) of memory
- Exposes TCP port 5000 and allocates a pseudo-TTY for the container
- Accepts the end user license agreement (Eula) and responsible AI (RAI) acknowledgement
- Automatically removes the container after it exits. The container image is still available on the host computer.

### Demo UI to visualize output

> [!NOTE]
> The demo is only available with the Text Analytics for health container.

The container provides REST-based query prediction endpoint APIs.  We have also provided a visualization tool in the container that is accessible by appending `/demo` to the endpoint of the container. For example:

```
http://<serverURL>:5000/demo
```

Use the example cURL request below to submit a query to the container you have deployed replacing the `serverURL` variable with the appropriate value.

```bash
curl -X POST 'http://<serverURL>:5000/text/analytics/v3.1-preview.4/entities/health' --header 'Content-Type: application/json' --header 'accept: application/json' --data-binary @example.json

```

### Install the container using Azure Web App for Containers

Azure [Web App for Containers](https://azure.microsoft.com/services/app-service/containers/) is an Azure resource dedicated to running containers in the cloud. It brings out-of-the-box capabilities such as autoscaling, support of docker containers and docker compose, HTTPS support and much more.

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
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Text Analytics resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Text Analytics resource.
$DOCKER_IMAGE_NAME = "mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latest"

az login
az account set -s $subscription_name
az appservice plan create -n $appservice_plan_name -g $resource_group_name --is-linux -l $resources_location --sku P3V2
az webapp create -g $resource_group_name -p $appservice_plan_name -n $appservice_name -i $DOCKER_IMAGE_NAME 
az webapp config appsettings set -g $resource_group_name -n $appservice_name --settings Eula=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

# Once deployment complete, the resource should be available at: https://<appservice_name>.azurewebsites.net
```

### Install the container using Azure Container Instance

You can also use an Azure Container Instance (ACI) to make deployment easier. ACI is a resource that allows you to run Docker containers on-demand in a managed, serverless Azure environment. 

See [How to use Azure Container Instances](../../containers/azure-container-instance-recipe.md) for steps on deploying an ACI resource using the Azure portal. You can also use the below PowerShell script using Azure CLI, which will create a ACI on your subscription using the container image.  Wait for the script to complete (approximately 25-30 minutes) before submitting the first request.  Due to the limit on the maximum number of CPUs per ACI resource, do not select this option if you expect to submit more than 5 large documents (approximately 5000 characters each) per request.
See the [ACI regional support](../../../container-instances/container-instances-region-availability.md) article for availability information. 

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
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Text Analytics resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Text Analytics resource.
$DNS_LABEL = ""                            # This is the DNS label name you wish your ACI will have
$DOCKER_IMAGE_NAME = "mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latest"

az login
az account set -s $subscription_name
az container create --resource-group $resource_group_name --name $azure_container_instance_name --image $DOCKER_IMAGE_NAME --cpu 4 --memory 12 --port 5000 --dns-name-label $DNS_LABEL --environment-variables Eula=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

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

The below example shows how a [docker compose](https://docs.docker.com/compose/reference/overview) file can be created to deploy the NGINX and Text Analytics for health containers:

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
      - Logging:Disk:Format=json
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
