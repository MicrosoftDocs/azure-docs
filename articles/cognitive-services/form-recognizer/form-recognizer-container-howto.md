---
title: Install and run container - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer container to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: pafarley
---
# Install and run containers

Form Recognizer is a cognitive service that uses machine learning technology to identify and extract key-value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. 

The Form Recognizer has the following container(s):

|Function|Features|
|-|-|
|form-recognizer|Form Recognizer learns the structure of your forms in order to intelligently extract key value pairs and tables.|

## Prerequisites

You must meet the following prerequisites before using Form Recognizer containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.|
|Azure CLI| You need to install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) on your host.|
|Computer Vision API resource| In order to process scanned documents and images, OCR is required. Please note that usual fees apply. Use this key and the billing endpoint as {COMPUTER_VISION_API_KEY} and {COMPUTER_VISION_BILLING_ENDPOINT_URI} in the following.|  
|Form Recognizer resource |In order to use these containers, you must have:<br><br>A _Form Recognizer_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's **Form Recognizer** Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus.api.cognitive.microsoft.com/forms/v1.0`| 

### Create Form Recognizer resource

1. Click on this link [Azure portal - Forms](https://aka.ms/form-recognizer-resource) to log in to Azure portal with your user account and open the create page of Form Recognizer  

1. In the create page, enter the following information then select **Create**:

    * Resource name
    * Location
    * Pricing tier
    * Resource group

1. Once the **Form Recognizer** resource is created, go the **Overview** page and copy the **Endpoint** URI for the {BILLING_ENDPOINT_URI} setting used in the [`Docker run`](#run-the-container-with-docker-run) command.

1. On the **Keys** page, copy a key for the {BILLING_KEY} setting used in the [`Docker run`](#run-the-container-with-docker-run) command. 

1. If you don't have one, provision [Cognitive Services Computer Vision API](https://azure.microsoft.com/services/cognitive-services/computer-vision/),  which is required to provide the OCR scanning functionality for the documents and images. Please note that usual fees for this service apply. Use this as `{COMPUTER_VISION_API_KEY}` and `{COMPUTER_VISION_API_ENDPOINT_URI}` in the following.

### The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

If you plan to use Azure Blob as a data storage, then the **host** has to be **Ubuntu Linux**.

> [!TIP]
> If the host computer is a virtual machine, for example Azure VM, then every docker command has to be run as ```sudo``` in case you face permission issues.

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Form Recognizer container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|cognitive-services-form-recognizer| 2 core, 4 GB memory | 4 core, 8 GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Container images for Form Recognizer are available.

| Container | Repository |
|-----------|------------|
| form-recognizer| `containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer:latest` |


> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>

>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID            REPOSITORY                                                                   TAG
>  ebbee78a6baa        containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer     latest
>  ```


### Docker pull for the Form Recognizer container

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](form-recognizer-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
2. [Query the container's prediction endpoint](#query-the-form-recognizer-container-endpoint).

## Data storage options and configurations

There are multiple options on how the forms can be provided to the service. The data can be in local or on cloud storage.  

* local volumes
* [Azure Files](https://azure.microsoft.com/services/storage/files)
* [Azure Blob](https://azure.microsoft.com/en-ca/services/storage/blobs) using [Blobfuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux)


### Local volumes
Please refer to the [mount section](form-recognizer-container-configuration.md#mount-settings)

### Azure files

Follow the instructions below to mount an Azure Files to two shares: `/input` and `/output` (for example on Windows, `c:\input` and `c:\output`). Follow the instructions and be sure to create the two shares:

* [Windows](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows)  
* [Linux](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-linux)  
* [macOS](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-mac)

### Azure blob
This is only supported with **Ubuntu Linux host** and requires installation of [Blobfuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux). Blobfuse is a virtual file system driver for Azure Blob storage. Blobfuse allows you to access your existing block blob data in your storage account through the Linux file system.

You need to create a single blob object for `/input` and `/output` instead of two separate blob objects.

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Form Recognizer Keys page.|
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Form Recognizer Overview page.|
|{COMPUTER_VISION_API_KEY} | The endpoint key of the Computer Vision API resource.|
|{COMPUTER_VISION_API_ENDPOINT_URI} | The billing endpoint value including region for the Computer Vision API.|

Replace these parameters with your own values in the following example `docker run` command.


```bash
 docker run --rm -it -p 5000:5000 --memory 4g --cpus 1
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
 containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer
  eula=accept apikey={BILLING_KEY}
  billing={BILLING_ENDPOINT_URI} forms:computervisionapikey={COMPUTER_VISION_API_KEY}
  forms:computervisionendpointuri={COMPUTER_VISION_ENDPOINT_URI}
```

This command:

* Runs a Form Recognizer container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

### Running multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different port. For example, run the first container on port 5000 and the second container on port 5001.

Replace the `<container-registry>` and `<container-name>` with the values of the containers you use. These do not have to be the same container. 

Run the first container on port 5000.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer
eula=accept apikey={BILLING_KEY}
billing={BILLING_ENDPOINT_URI} computervisionapikey={COMPUTER_VISION_API_KEY}
computervisionendpointuri={COMPUTER_VISION_API_BILLING_ENDPOINT_URI}
```

Run the second container on port 5001.

```bash
docker run --rm -it -p 5000:5001 --memory 4g --cpus 2
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer
eula=accept apikey={BILLING_KEY}
billing={BILLING_ENDPOINT_URI} computervisionapikey={COMPUTER_VISION_API_KEY}
computervisionendpointuri={COMPUTER_VISION_API_BILLING_ENDPOINT_URI}
```

Each subsequent container should be on a different port.

## Run the container in Azure Kubernetes Service

1. Create an Azure Kubernetes Cluster {YOUR_KUBERNETES_CLUSTER} in Azure portal under the whitelisted subscription using same resource group and region as the Form Recognizer resource.

1. Attach a data storage. Currently we support **Azure Files** only for kubernetes deployment.
To mount a previously created Azure file to kubernetes, get the `YOUR_STORAGEACCOUNTNAME` and `YOUR_STORAGEACCOUNTKEY`.

    ```kubectl
    kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=YOUR_STORAGEACCOUNTNAME --from-literal=azurestorageaccountkey=YOUR_STORAGEACCOUNTKEY
    ```
    
    Note: `YOUR_STORAGEACCOUNTNAME` AFS should contain two shares: `input`, `output`.

1. Configure the Kubernetes manifest file

    a. Download this [aks.forms_understanding.pp.yaml](https://aka.ms/form-recognizer-kubernetes-pp-yaml) file to the folder "kubectl/form-recognizer" on your **host** locally.

    b. Inside the local folder, open the file `aks.forms_understanding.pp.yaml`. You will need to fill in the following values, with keys specific to your Azure subscription.

    Note, if you used different names for `input` and `output` shares, you will need to modify them in this file as well.
    
    ```yaml
    env:
      - name: eula
        value: "accept"
      - name: apikey
        value: "{BILLING_KEY}"
      - name: billing
        value: "{BILLING_ENDPOINT_URI}"
      - name: forms:computervisionapikey
        value: "{COMPUTER_VISION_API_KEY}"
      - name:  forms:computervisionendpointuri
        value: "{COMPUTER_VISION_API_ENDPOINT_URI}"
    ```

1. Create a secret key with your docker password. Note: you must supply `--docker-email` and an email address. If you don't,  you will get a failure.

    ```kubectl
    kubectl create secret docker-registry acr-auth --docker-server {{ACR_TODO}}.azurecr.io --docker-username {YOUR_DOCKER_USERNAME} --docker-password {YOUR_DOCKER_PASSWORD} --docker-email {YOUR_EMAIL_ADDRESS}
    ```

1. Verify you have installed the AKS cluster with the following AZ CLI command: 

    ```az
    az aks get-credentials -g {YOUR_AKS_RESOURCE_GROUP_NAME} -n {YOUR_AKS_CLUSTER_NAME}
    ```

1. Install the form-recognizer yaml file from the local folder in step 3a above. Run the following command to install the file and start the service: 

    ```kubectl
    kubectl apply -f aks.forms_understanding.pp.yaml
    ```

1. Wait for the service to come online. Once the service is fully online, the `EXTERNAL-IP` field is populated with a publicly accessible IPv4 address: 

    ```kubectl
    kubectl get service form-recognizer-1 --watch
    ```

1. Configure Port forwarding. To configure `localhost` port forwarding, run following command to get list of pods. From this list look for pod name with format `form-recognizer-1-{xxxx-xxxx}`:
  
    ```kubectl
    kubectl get pods --namespace default
    ```

    Use the pod name found in previous command to configure port forwarding:
    
    ```kubectl
    kubectl port-forward form-recognizer-1-{xxxx-xxxx} 5000:5000
    ```

    Get the name:

    ```kubectl
    kubectl get pods --namespace default -l "app.kubernetes.io/name=form-recognizer,app.kubernetes.io/instance=form-recognizer-1" -o jsonpath="{.items[0].metadata.name}"
    ```

    Use the name in the port forward command:
    
    ```kubectl
    kubectl port-forward form-recognizer-1-{XXXXXXX-XXXXX} 5000:5000
    ```

## Query the Form Recognizer container endpoint

The container provides REST-based endpoint APIs.

Use the host, https://localhost:5000, for container APIs.

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

You will find the log files when logging into your container under `/app/forms/log`.

Run `docker ps` to get the {CONTAINER_ID}.

Run `docker exec {DOCKER_ID}` to log into the container. 

## Container's API documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required.

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

## Billing

The _Form Recognizer_ containers send billing information to Azure, using a _Form Recognizer_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Form Recognizer containers. In summary:

* Form Recognizer provides 1 Linux container for Docker, encapsulating Form Recognizer.
* Container images are downloaded from the private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Form Recognizer containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* [Configure Docker container](form-recognizer-container-configuration.md) for your `Docker run` command.
