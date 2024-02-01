---
title: Install and run Docker containers for Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use the Docker containers for Document Intelligence on-premises to identify and extract key-value pairs, selection marks, tables, and structure from forms and documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 12/13/2023
ms.author: lajanuar
---


# Install and run containers

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD051 -->

:::moniker range="doc-intel-2.1.0 || doc-intel-3.1.0||doc-intel-4.0.0"

Support for containers is currently available with Document Intelligence version `2022-08-31 (GA)` only:

* [REST API `2022-08-31 (GA)`](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
* [SDKs targeting `REST API 2022-08-31 (GA)`](../sdk-overview-v3-0.md)

✔️ See [**Install and run Document Intelligence v3.0 containers**](?view=doc-intel-3.0.0&preserve-view=true) for supported container documentation.

:::moniker-end

:::moniker range="doc-intel-3.0.0"

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.0 (GA)**

Azure AI Document Intelligence is an Azure AI service that lets you build automated data processing software using machine-learning technology. Document Intelligence enables you to identify and extract text, key/value pairs, selection marks, table data, and more from your documents. The results are delivered as structured data that ../includes the relationships in the original file.

In this article you learn how to download, install, and run Document Intelligence containers. Containers enable you to run the Document Intelligence service in your own environment. Containers are great for specific security and data governance requirements.

* **Read**, **Layout**, **General Document**, **ID Document**,  **Receipt**, **Invoice**, **Business Card**, and **Custom** models are supported by Document Intelligence v3.0 containers.

* **Business Card** model is currently only supported in the [v2.1 containers](install-run.md?view=doc-intel-2.1.0&preserve-view=true).

## Prerequisites

To get started, you need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You also need the following to use Document Intelligence containers:

| Required | Purpose |
|----------|---------|
| **Familiarity with Docker** | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology). |
| **Docker Engine installed** | <ul><li>You need the Docker Engine installed on a [host computer](#host-computer-requirements). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul>  |
|**Document Intelligence resource** | A [**single-service Azure AI Document Intelligence**](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**multi-service**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. To use the containers, you must have the associated key and endpoint URI. Both values are available on the Azure portal Document Intelligence **Keys and Endpoint** page: <ul><li>**{FORM_RECOGNIZER_KEY}**: one of the two available resource keys.<li>**{FORM_RECOGNIZER_ENDPOINT_URI}**: the endpoint for the resource used to track billing information.</li></li></ul>|

|Optional|Purpose|
|---------|----------|
|**Azure CLI (command-line interface)** | The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It's available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell. |

## Host computer requirements

The host is a x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../../../aks/index.yml).
* [Azure Container Instances](../../../container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

#### Required supporting containers

The following table lists the supporting container(s) for each Document Intelligence container you download. For more information, see the [Billing](#billing) section.

Feature container | Supporting container(s) |
|---------|-----------|
| **Read** | Not required |
| **Layout** | Not required|
| **Business Card** | **Read**|
| **General Document** | **Layout** |
| **Invoice** | **Layout**|
| **Receipt** | **Read** or **Layout** |
| **ID Document** | **Read**|
| **Custom Template** | **Layout** |

#### Recommended CPU cores and memory

> [!NOTE]
>
> The minimum and recommended values are based on Docker limits and *not* the host machine resources.

##### Document Intelligence containers

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| `Read` | `8` cores, 10-GB memory | `8` cores, 24-GB memory|
| `Layout` | `8` cores, 16-GB memory | `8` cores, 24-GB memory |
| `Business Card` | `8` cores, 16-GB memory | `8` cores, 24-GB memory |
| `General Document` | `8` cores, 12-GB memory | `8` cores, 24-GB memory|
| `ID Document` | `8` cores, 8-GB memory | `8` cores, 24-GB memory |
| `Invoice` | `8` cores, 16-GB memory | `8` cores, 24-GB memory|
| `Receipt` | `8` cores, 11-GB memory | `8` cores, 24-GB memory |
| `Custom Template` | `8` cores, 16-GB memory | `8` cores, 24-GB memory|

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker compose` or `docker run`  command.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID         REPOSITORY                TAG
>  <image-id>       <repository-path/name>    <tag-name>
>  ```

## Run the container with the **docker-compose up** command

* Replace the {ENDPOINT_URI} and {API_KEY} values with your resource Endpoint URI and the key from the Azure resource page.

   :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot of Azure portal keys and endpoint page.":::

* Ensure that the EULA value is set to *accept*.

* The `EULA`, `Billing`, and `ApiKey`  values must be specified; otherwise the container can't start.

> [!IMPORTANT]
> The keys are used to access your Document Intelligence resource. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

### [Read](#tab/read)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence Layout container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with the `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Layout container instance.

```yml
version: "3.9"
services:
  azure-form-recognizer-read:
    container_name: azure-form-recognizer-read
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/read-3.0
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
    ports:
      - "5000:5000"
    networks:
      - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

### [General Document](#tab/general-document)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence General Document container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your General Document and Layout container instances.

```yml
version: "3.9"
services:
  azure-cognitive-service-document:
    container_name: azure-cognitive-service-document
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/document-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
        - AzureCognitiveServiceLayoutHost=http://azure-cognitive-service-layout:5000
    ports:
      - "5000:5050"
  azure-cognitive-service-layout:
     container_name: azure-cognitive-service-layout
     image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0
     environment:
         - EULA=accept
         - billing={FORM_RECOGNIZER_ENDPOINT_URI}
         - apiKey={FORM_RECOGNIZER_KEY}
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

Given the resources on the machine, the General Document container might take some time to start up.

### [Layout](#tab/layout)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence Layout container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Layout container instance.

```yml
version: "3.9"
services:
  azure-form-recognizer-layout:
    container_name: azure-form-recognizer-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
    ports:
      - "5000:5000"
    networks:
      - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

### [Invoice](#tab/invoice)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence Invoice container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Invoice and Layout container instances.

```yml
version: "3.9"
services:
  azure-cognitive-service-invoice:
    container_name: azure-cognitive-service-invoice
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
        - AzureCognitiveServiceLayoutHost=http://azure-cognitive-service-layout:5000
    ports:
      - "5000:5050"
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

### [Receipt](#tab/receipt)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence General Document container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Receipt and Read container instances.

```yml
version: "3.9"
services:
  azure-cognitive-service-receipt:
    container_name: azure-cognitive-service-receipt
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
        - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
          - "5000:5050"
    azure-cognitive-service-read:
      container_name: azure-cognitive-service-read
      image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/read-3.0
      environment:
          - EULA=accept
          - billing={FORM_RECOGNIZER_ENDPOINT_URI}
          - apiKey={FORM_RECOGNIZER_KEY}
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

### [ID Document](#tab/id-document)

The following code sample is a self-contained `docker compose`  example to run the Document Intelligence General Document container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your ID and Read container instances.

```yml
version: "3.9"
services:
  azure-cognitive-service-id-document:
      container_name: azure-cognitive-service-id-document
      image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document-3.0
      environment:
          - EULA=accept
          - billing={FORM_RECOGNIZER_ENDPOINT_URI}
          - apiKey={FORM_RECOGNIZER_KEY}
          - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
      ports:
          - "5000:5050"
  azure-cognitive-service-read:
      container_name: azure-cognitive-service-read
      image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/read-3.0
      environment:
          - EULA=accept
          - billing={FORM_RECOGNIZER_ENDPOINT_URI}
          - apiKey={FORM_RECOGNIZER_KEY}
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```bash
docker-compose up
```

### [Business Card](#tab/business-card)

```yml
version: "3.9"
services:
  azure-cognitive-service-invoice:
    container_name: azure-cognitive-service-businesscard
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
        - AzureCognitiveServiceLayoutHost=http://azure-cognitive-service-layout:5000
    ports:
      - "5000:5050"
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0
    environment:
        - EULA=accept
        - billing={FORM_RECOGNIZER_ENDPOINT_URI}
        - apiKey={FORM_RECOGNIZER_KEY}
```

### [Custom](#tab/custom)

In addition to the [prerequisites](#prerequisites), you need to do the following to process a custom document:

#### Create a folder to store the following files

* [**.env**](#create-an-environment-file)
* [**nginx.conf**](#create-an-nginx-file)
* [**docker-compose.yml**](#create-a-docker-compose-file)

#### Create a folder to store your input data

* Name this folder **files**.
* We reference the file path for this folder as  **{FILE_MOUNT_PATH}**.
* Copy the file path in a convenient location, you need to add it to your **.env** file. As an example if the folder is called files, located in the same folder as the `docker-compose` file, the .env file entry is `FILE_MOUNT_PATH="./files"`

#### Create a folder to store the logs  written by the Document Intelligence service on your local machine

* Name this folder **output**.
* We reference the file path for this folder as **{OUTPUT_MOUNT_PATH}**.
* Copy the file path in a convenient location, you need to add it to your **.env** file. As an example if the folder is called output, located in the same folder as the `docker-compose` file, the .env file entry is `OUTPUT_MOUNT_PATH="./output"`

#### Create a folder for storing internal processing shared between the containers

* Name this folder **shared**.
* We reference the file path for this folder as  **{SHARED_MOUNT_PATH}**.
* Copy the file path in a convenient location, you need to add it to your **.env** file. As an example if the folder is called shared, located in the same folder as the `docker-compose` file, the .env file entry is `SHARED_MOUNT_PATH="./shared"`

#### Create a folder for the Studio to store project related information

* Name this folder **db**.
* We reference the file path for this folder as  **{DB_MOUNT_PATH}**.
* Copy the file path in a convenient location, you need to add it to your **.env** file. As an example if the folder is called db, located in the same folder as the `docker-compose` file, the .env file entry is `DB_MOUNT_PATH="./db"`

#### Create an environment file

  1. Name this file **.env**.

  1. Declare the following environment variables:

  ```text
SHARED_MOUNT_PATH="./shared"
OUTPUT_MOUNT_PATH="./output"
FILE_MOUNT_PATH="./files"
DB_MOUNT_PATH="./db"
FORM_RECOGNIZER_ENDPOINT_URI="YourFormRecognizerEndpoint"
FORM_RECOGNIZER_KEY="YourFormRecognizerKey"
NGINX_CONF_FILE="./nginx.conf"
  ```

#### Create an **nginx** file

  1. Name this file **nginx.conf**.

  1. Enter the following configuration:

```text
worker_processes 1;

events { worker_connections 1024; }

http {

    sendfile on;
    client_max_body_size 90M;
    upstream docker-custom {
        server azure-cognitive-service-custom-template:5000;
    }

    upstream docker-layout {
        server  azure-cognitive-service-layout:5000;
    }

    server {
        listen 5000;

        location = / {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;
            proxy_pass http://docker-custom/;
        }

        location /status {
            proxy_pass http://docker-custom/status;
        }

        location /test {
            return 200 $scheme://$host:$server_port;
        }

        location /ready {
            proxy_pass http://docker-custom/ready;
        }

        location /swagger {
            proxy_pass http://docker-custom/swagger;
        }

        location /formrecognizer/documentModels/prebuilt-layout {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;

            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Headers' 'cache-control,content-type,ocp-apim-subscription-key,x-ms-useragent' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Expose-Headers' '*' always;

            if ($request_method = 'OPTIONS') {
                return 200;
            }

            proxy_pass http://docker-layout/formrecognizer/documentModels/prebuilt-layout;
        }

        location /formrecognizer/documentModels {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;

            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Headers' 'cache-control,content-type,ocp-apim-subscription-key,x-ms-useragent' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE' always;
            add_header 'Access-Control-Expose-Headers' '*' always;

            if ($request_method = 'OPTIONS') {
                return 200;
            }

            proxy_pass http://docker-custom/formrecognizer/documentModels;
        }

        location /formrecognizer/operations {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Headers' 'cache-control,content-type,ocp-apim-subscription-key,x-ms-useragent' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
            add_header 'Access-Control-Expose-Headers' '*' always;

            if ($request_method = OPTIONS ) {
                return 200;
            }

            proxy_pass http://docker-custom/formrecognizer/operations;
        }
    }
}

```

#### Create a **docker compose** file

1. Name this file **docker-compose.yml**

2. The following code sample is a self-contained `docker compose` example to run Document Intelligence Layout, Studio and Custom template containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration.

```yml
version: '3.3'
services:
  nginx:
    image: nginx:alpine
    container_name: reverseproxy
    volumes:
      - ${NGINX_CONF_FILE}:/etc/nginx/nginx.conf
    ports:
      - "5000:5000"
  layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0:latest
    environment:
      eula: accept
      apikey: ${FORM_RECOGNIZER_KEY}
      billing: ${FORM_RECOGNIZER_ENDPOINT_URI}
      Logging:Console:LogLevel:Default: Information
      SharedRootFolder: /shared
      Mounts:Shared: /shared
      Mounts:Output: /logs
    volumes:
      - type: bind
        source: ${SHARED_MOUNT_PATH}
        target: /shared
      - type: bind
        source: ${OUTPUT_MOUNT_PATH}
        target: /logs
    expose:
      - "5000"

  custom-template:
    container_name: azure-cognitive-service-custom-template
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-template-3.0:latest
    restart: always
    depends_on:
      - layout
    environment:
      AzureCognitiveServiceLayoutHost: http://azure-cognitive-service-layout:5000
      eula: accept
      apikey: ${FORM_RECOGNIZER_KEY}
      billing: ${FORM_RECOGNIZER_ENDPOINT_URI}
      Logging:Console:LogLevel:Default: Information
      SharedRootFolder: /shared
      Mounts:Shared: /shared
      Mounts:Output: /logs
    volumes:
      - type: bind
        source: ${SHARED_MOUNT_PATH}
        target: /shared
      - type: bind
        source: ${OUTPUT_MOUNT_PATH}
        target: /logs
    expose:
      - "5000"

  studio:
    container_name: form-recognizer-studio
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/studio:3.0
    environment:
      ONPREM_LOCALFILE_BASEPATH: /onprem_folder
      STORAGE_DATABASE_CONNECTION_STRING: /onprem_db/Application.db
    volumes:
      - type: bind
        source: ${FILE_MOUNT_PATH} # path to your local folder
        target: /onprem_folder
      - type: bind
        source: ${DB_MOUNT_PATH} # path to your local folder
        target: /onprem_db
    ports:
      - "5001:5001"
    user: "1000:1000" # echo $(id -u):$(id -g)

 ```

The custom template container can use Azure Storage queues or in memory queues. The `Storage:ObjectStore:AzureBlob:ConnectionString` and `queue:azure:connectionstring` environment variables only need to be set if you're using Azure Storage queues. When running locally, delete these variables.

### Ensure the service is running

To ensure that the service is up and running. Run these commands in an Ubuntu shell.

```bash
$cd <folder containing the docker-compose file>

$source .env

$docker-compose up
```

Custom template containers require a few different configurations and support other optional configurations

| Setting | Required | Description |
|-----------|---------|-------------|
|EULA | Yes    | License acceptance Example: Eula=accept|
|Billing    | Yes |    Billing endpoint URI of the FR resource |
|ApiKey    | Yes    | The endpoint key of the FR resource |
| Queue:Azure:ConnectionString    | No| Azure Queue connection string |
|Storage:ObjectStore:AzureBlob:ConnectionString    | No| Azure Blob connection string |
| HealthCheck:MemoryUpperboundInMB    | No |    Memory threshold for reporting unhealthy to liveness. Default: Same as recommended memory |
| StorageTimeToLiveInMinutes    | No| TTL duration to remove all intermediate and final files. Default: Two days, TTL can set between five minutes to seven days |
| Task:MaxRunningTimeSpanInMinutes |    No| Maximum running time for treating request as timeout. Default: 60 minutes |
| HTTP_PROXY_BYPASS_URLS | No |    Specify URLs for bypassing proxy Example: HTTP_PROXY_BYPASS_URLS = abc.com, xyz.com |
| AzureCognitiveServiceReadHost (Receipt, IdDocument Containers Only)| Yes    | Specify Read container uri Example:AzureCognitiveServiceReadHost=http://onprem-frread:5000 |
| AzureCognitiveServiceLayoutHost (Document, Invoice Containers Only) |    Yes    | Specify Layout container uri Example:AzureCognitiveServiceLayoutHost=http://onprem-frlayout:5000 |

#### Use the Document Intelligence Studio to train a model

* Gather a set of at least five forms of the same type. You use this data to train the model and test a form. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract _sample_data.zip_).

* Once you can confirm that the containers are running, open a browser and navigate to the endpoint where you have the containers deployed. If this deployment is your local machine, the endpoint is `[http://localhost:5000](http://localhost:5000)`.
* Select the custom extraction model tile.
* Select the `Create project` option.
* Provide a project name and optionally a description
* On the "configure your resource" step, provide the endpoint to your custom template model. If you deployed the containers on your local machine, use this URL `[http://localhost:5000](http://localhost:5000)`.
* Provide a subfolder for where your training data is located within the files folder.
* Finally, create the project

You should now have a project created, ready for labeling. Upload your training data and get started labeling. If you're new to labeling, see [build and train a custom model](../how-to-guides/build-a-custom-model.md)

#### Using the API to train

If you plan to call the APIs directly to train a model, the custom template model train API requires a base64 encoded zip file that is the contents of your labeling project. You can omit the PDF or image files and submit only the JSON files.

Once you have your dataset labeled and *.ocr.json, *.labels.json and fields.json files added to a zip, use the PowerShell commands to generate the base64 encoded string.

```powershell
$bytes = [System.IO.File]::ReadAllBytes("<your_zip_file>.zip")
$b64String = [System.Convert]::ToBase64String($bytes, [System.Base64FormattingOptions]::None)

```

Use the build model API to post the request.

```http
POST http://localhost:5000/formrecognizer/documentModels:build?api-version=2023-07-31

{
    "modelId": "mymodel",
    "description": "test model",
    "buildMode": "template",

    "base64Source": "<Your base64 encoded string>",
    "tags": {
       "additionalProp1": "string",
       "additionalProp2": "string",
       "additionalProp3": "string"
     }
}
```

---

## Validate that the service is running

There are several ways to validate that the container is running:

* The container provides a homepage at `\` as a visual validation that the container is running.

* You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the listed request URLs to validate the container is running. The listed example request URLs are `http://localhost:5000`, but your specific container can vary. Keep in mind that you're  navigating to your container's **External IP address** and exposed port.

  Request URL    | Purpose
  ----------- | --------
  |**http://<span></span>localhost:5000/** | The container provides a home page.
  |**http://<span></span>localhost:5000/ready**     | Requested with GET, this request provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/status** | Requested with GET, this request verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/swagger** | The container provides a full set of documentation for the endpoints and a Try it out feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the required HTTP headers and body format.
  |

:::image type="content" source="../media/containers/container-webpage.png" alt-text="Screenshot of Azure containers welcome page.":::

## Stop the containers

To stop the containers, use the following command:

```console
docker-compose down
```

## Billing

The Document Intelligence containers send billing information to Azure by using a Document Intelligence resource on your Azure account.

Queries to the container are billed at the pricing tier of the Azure resource used for the API `Key`. You're billed for each container instance used to process your documents and images.

> [!NOTE]
> Currently, Document Intelligence v3 containers only support pay as you go pricing. Support for commitment tiers and disconnected mode will be added in March 2023.
Azure AI containers aren't licensed to run without being connected to the metering / billing endpoint. Containers must be enabled to always communicate billing information with the billing endpoint. Azure AI containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.

### Connect to Azure

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run, but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. See the [Azure AI container FAQ](../../../ai-services/containers/container-faq.yml#how-does-billing-work) for an example of the information sent to Microsoft for billing.

### Billing arguments

The [**docker-compose up**](https://docs.docker.com/engine/reference/commandline/compose_up/) command starts the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The key of the Azure AI services resource used to track billing information.<br/>The value of this option must be set to a key for the provisioned resource specified in `Billing`. |
| `Billing` | The endpoint of the Azure AI services resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

For more information about these options, see [Configure containers](configuration.md).

## Summary

That's it! In this article, you learned concepts and workflows for downloading, installing, and running Document Intelligence containers. In summary:

* Document Intelligence provides seven Linux containers for Docker.
* Container images are downloaded from mcr.
* Container images run in Docker.
* The billing information must be specified when you instantiate a container.

> [!IMPORTANT]
> Azure AI containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* [Document Intelligence container configuration settings](configuration.md)

* [Azure container instance recipe](../../../ai-services/containers/azure-container-instance-recipe.md)
::: moniker-end
