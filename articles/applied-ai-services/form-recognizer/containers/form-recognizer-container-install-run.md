---
title: Install and run Docker containers for Form Recognizer
titleSuffix: Azure Applied AI Services
description: Use the Docker containers for Form Recognizer on-premises to identify and extract key-value pairs, selection marks, tables, and structure from forms and documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 03/20/2023
ms.author: lajanuar
recommendations: false
---

# Install and run Form Recognizer containers

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](../includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v2-1.md)]
::: moniker-end

Azure Form Recognizer is an Azure Applied AI Service that lets you build automated data processing software using machine-learning technology. Form Recognizer enables you to identify and extract text, key/value pairs, selection marks, table data, and more from your form documents. The results are delivered as structured data that includes the relationships in the original file.

::: moniker range="form-recog-3.0.0"
In this article you learn how to download, install, and run Form Recognizer containers. Containers enable you to run the Form Recognizer service in your own environment. Containers are great for specific security and data governance requirements.

* **Read** and **Layout** models are supported by Form Recognizer v3.0 containers.

* **Business Card**,**ID Document**,  **Receipt**, **Invoice**, and **Custom** models are currently only supported in the [v2.1 containers](form-recognizer-container-install-run.md?view=form-recog-2.1.0&preserve-view=true).

::: moniker-end

::: moniker range="form-recog-2.1.0"
In this article you learn how to download, install, and run Form Recognizer containers. Containers enable you to run the Form Recognizer service in your own environment. Containers are great for specific security and data governance requirements.

* **Layout**, **Business Card**,**ID Document**,  **Receipt**, **Invoice**, and **Custom** models are supported by six Form Recognizer feature containers.

* For Receipt, Business Card and ID Document containers you also need the **Read** OCR container.

::: moniker-end

> [!IMPORTANT]
>
> * To use Form Recognizer containers, you must submit an online request, and have it approved. For more information, _see_ [Request approval to run container](#request-approval-to-run-container).

## Prerequisites

To get started, you need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You also need the following to use Form Recognizer containers:

| Required | Purpose |
|----------|---------|
| **Familiarity with Docker** | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology). |
| **Docker Engine installed** | <ul><li>You need the Docker Engine installed on a [host computer](#host-computer-requirements). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul>  |
|**Form Recognizer resource** | A [**single-service Azure Form Recognizer**](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**multi-service Cognitive Services**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. To use the containers, you must have the associated key and endpoint URI. Both values are available on the Azure portal Form Recognizer **Keys and Endpoint** page: <ul><li>**{FORM_RECOGNIZER_KEY}**: one of the two available resource keys.<li>**{FORM_RECOGNIZER_ENDPOINT_URI}**: the endpoint for the resource used to track billing information.</li></li></ul>|

|Optional|Purpose|
|---------|----------|
|**Azure CLI (command-line interface)** | The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It's available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell. |

:::moniker range="form-recog-2.1.0"
You also need a **Computer Vision API resource to process business cards, ID documents, or Receipts**.

* You can access the Recognize Text feature as either an Azure resource (the REST API or SDK) or a **cognitive-services-recognize-text** [container](../../../cognitive-services/Computer-vision/computer-vision-how-to-install-containers.md#get-the-container-image).

* The usual [billing](#billing) fees apply.

* If you use the **cognitive-services-recognize-text** container, make sure that your Computer Vision key for the Form Recognizer container is the key specified in the Computer Vision `docker run`  or `docker compose` command for the **cognitive-services-recognize-text** container and  your billing endpoint is the container's endpoint (for example, `http://localhost:5000`).

* If you use both the Computer Vision container and Form Recognizer container together on the same host, they can't both be started with the default port of **5000**.

* Pass in both the key and endpoints for your Computer Vision Azure cloud or Cognitive Services container:

  * **{COMPUTER_VISION_KEY}**: one of the two available resource keys.
  * **{COMPUTER_VISION_ENDPOINT_URI}**: the endpoint for the resource used to track billing information.
:::moniker-end

## Request approval to run container

Complete and submit the [**Azure Cognitive Services Application for Gated Services**](https://aka.ms/csgate) to request access to the container.

[!INCLUDE [Request access to public preview](../../../../includes/cognitive-services-containers-request-access.md)]

## Host computer requirements

The host is a x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../../../aks/index.yml).
* [Azure Container Instances](../../../container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

#### Required supporting containers

The following table lists the supporting container(s) for each Form Recognizer container you download. For more information, see the [Billing](#billing) section.
:::moniker range="form-recog-2.1.0"

| Feature container | Supporting container(s) |
|---------|-----------|
| **Layout** | None |
| **Business Card** | **Computer Vision Read**|
| **ID Document** | **Computer Vision Read** |
| **Invoice**   | **Layout** |
| **Receipt** |**Computer Vision Read** |
| **Custom** | **Custom API**, **Custom Supervised**, **Layout**|
:::moniker-end

:::moniker range="form-recog-3.0.0"
Feature container | Supporting container(s) |
|---------|-----------|
| **Read** | None |
| **Layout** | None|
:::moniker-end

#### Recommended CPU cores and memory

> [!NOTE]
>
> The minimum and recommended values are based on Docker limits and *not* the host machine resources.

:::moniker range="form-recog-3.0.0"

##### Read and Layout containers

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| `Read` | `8` cores, 16-GB memory | `8` cores, 24-GB memory|
| `Layout` | `8` cores, 16-GB memory | `8` cores, 24-GB memory |
:::moniker-end

:::moniker range="form-recog-2.1.0"

##### Read, Layout, and prebuilt containers

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| `Read 3.2` | `8` cores, 16-GB memory | `8` cores, 24-GB memory|
| `Layout 2.1` | `8` cores, 16-GB memory | `8` cores, 24-GB memory |
| `Business Card 2.1` | `2` cores, 4-GB memory | `4` cores, 4-GB memory |
| `ID Document 2.1` | `1` core, 2-GB memory |`2` cores, 2-GB memory |
| `Invoice 2.1` | `4` cores, 8-GB memory | `8` cores, 8-GB memory |
| `Receipt 2.1` |  `4` cores, 8-GB memory | `8` cores, 8-GB memory  |

##### Custom containers

The following host machine requirements are applicable to **train and analyze** requests:

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Custom API| 0.5 cores, 0.5-GB memory| `1` core, 1-GB memory |
|Custom Supervised | `4` cores, 2-GB memory | `8` cores, 4-GB memory|
:::moniker-end

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

   :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

* Ensure that the EULA value is set to "accept".

* The `EULA`, `Billing`, and `ApiKey`  values must be specified; otherwise the container can't start.

> [!IMPORTANT]
> The keys are used to access your Form Recognizer resource. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

:::moniker range="form-recog-3.0.0"

### Read

The following code sample is a self-contained `docker compose`  example to run the Form Recognizer Layout container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with the `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {{FORM_RECOGNIZER_KEY} values for your Layout container instance.

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

### Layout

The following code sample is a self-contained `docker compose`  example to run the Form Recognizer Layout container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {{FORM_RECOGNIZER_KEY} values for your Layout container instance.

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

---
:::moniker-end

:::moniker range="form-recog-2.1.0"

### [Layout](#tab/layout)

The following code sample is a self-contained `docker compose`  example to run the Form Recognizer Layout container.  With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {{FORM_RECOGNIZER_KEY} values for your Layout container instance.

```yml
version: "3.9"
services:
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
    ports:
      - "5000"
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

### [Business Card](#tab/business-card)

The following code sample is a self-contained `docker compose` example to run Form Recognizer Business Card and Read containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Business Card container instance. Enter {COMPUTER_VISION_ENDPOINT_URI} and {COMPUTER_VISION_KEY} for your Computer Vision Read container.

```yml
version: "3.9"
services:
  azure-cognitive-service-businesscard:
    container_name: azure-cognitive-service-businesscard
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2021-04-12
    environment:
      - EULA=accept
      - billing={COMPUTER_VISION_ENDPOINT_URI}
      - apiKey={COMPUTER_VISION_KEY}
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

### [ID Document](#tab/id-document)

The following code sample is a self-contained `docker compose` example to run Form Recognizer ID Document and Read containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your ID document container. Enter {COMPUTER_VISION_ENDPOINT_URI} and {COMPUTER_VISION_KEY} values for your Computer Vision Read container.

```yml
version: "3.9"
services:
  azure-cognitive-service-id:
    container_name: azure-cognitive-service-id
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2021-04-12
    environment:
      - EULA=accept
      - billing={COMPUTER_VISION_ENDPOINT_URI}
      - apiKey={COMPUTER_VISION_KEY}
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

The following code sample is a self-contained `docker compose` example to run Form Recognizer Invoice and Layout containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration.  Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Invoice and Layout containers.

```yml
version: "3.9"
services:
  azure-cognitive-service-invoice:
    container_name: azure-cognitive-service-invoice
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
      - AzureCognitiveServiceLayoutHost=http://azure-cognitive-service-layout:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
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

### [Receipt](#tab/receipt)
The following code sample is a self-contained `docker compose` example to run Form Recognizer Receipt and Read containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Receipt container. Enter {COMPUTER_VISION_ENDPOINT_URI} and {COMPUTER_VISION_KEY} values for your Computer Vision Read container.

```yml
version: "3.9"
services:
  azure-cognitive-service-receipt:
    container_name: azure-cognitive-service-receipt
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - apiKey={FORM_RECOGNIZER_KEY}
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2021-04-12
    environment:
      - EULA=accept
      - billing={COMPUTER_VISION_ENDPOINT_URI}
      - apiKey={COMPUTER_VISION_KEY}
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

### [Custom](#tab/custom)

In addition to the [prerequisites](#prerequisites), you need to do the following to process a custom document:

#### &bullet; Create a folder to store the following files

  1. [**.env**](#-create-an-environment-file)
  1. [**nginx.conf**](#-create-an-nginx-file)
  1. [**docker-compose.yml**](#-create-a-docker-compose-file)

#### &bullet; Create a folder to store your input data

  1. Name this folder **shared**.
  1. We reference the file path for this folder as  **{SHARED_MOUNT_PATH}**.
  1. Copy the file path in a convenient location, such as *Microsoft Notepad*. You need to add it to your **.env** file.

#### &bullet; Create a folder to store the logs  written by the Form Recognizer service on your local machine.

  1. Name this folder **output**.
  1. We reference the file path for this folder as **{OUTPUT_MOUNT_PATH}**.
  1. Copy the file path in a convenient location, such as *Microsoft Notepad*. You need to add it to your **.env** file.

#### &bullet; Create an environment file

  1. Name this file **.env**.

  1. Declare the following environment variables:

  ```text
  SHARED_MOUNT_PATH="<file-path-to-shared-folder>"
  OUTPUT_MOUNT_PATH="<file -path-to-output-folder>"
  FORM_RECOGNIZER_ENDPOINT_URI="<your-form-recognizer-endpoint>"
  FORM_RECOGNIZER_KEY="<your-form-recognizer-key>"
  RABBITMQ_HOSTNAME="rabbitmq"
  RABBITMQ_PORT=5672
  NGINX_CONF_FILE="<file-path>"
  ```

#### &bullet; Create an **nginx** file

  1. Name this file **nginx.conf**.

  1. Enter the following configuration:

```text
worker_processes 1;

events { worker_connections 1024; }

http {

    sendfile on;
    client_max_body_size 90M;
    upstream docker-api {
        server azure-cognitive-service-custom-api:5000;
    }

    upstream docker-layout {
        server  azure-cognitive-service-layout:5000;
    }

    server {
        listen 5000;

        location = / {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;
            proxy_pass http://docker-api/;

        }

        location /status {
            proxy_pass http://docker-api/status;

        }

        location /ready {
            proxy_pass http://docker-api/ready;

        }

        location /swagger {
            proxy_pass http://docker-api/swagger;

        }

        location /formrecognizer/v2.1/custom/ {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;
            proxy_pass http://docker-api/formrecognizer/v2.1/custom/;

        }

        location /formrecognizer/v2.1/layout/ {
            proxy_set_header Host $host:$server_port;
            proxy_set_header Referer $scheme://$host:$server_port;
            proxy_pass http://docker-layout/formrecognizer/v2.1/layout/;

        }
    }
}
```

* Gather a set of at least six forms of the same type. You use this data to train the model and test a form. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*). Download the training files to the **shared** folder you created.

* If you want to label your data, download the [Form Recognizer Sample Labeling tool for Windows](https://github.com/microsoft/OCR-Form-Tools/releases). The download imports the labeling tool .exe file that you use to label the data present on your local file system. You can ignore any warnings that occur during the download process.

#### Create a new Sample Labeling tool project

* Open the labeling tool by double-clicking on the Sample Labeling tool .exe file.
* On the left pane of the tool, select the connections tab.
* Select to create a new project and give it a name and description.
* For the provider, choose the local file system option. For the local folder, make sure you enter the path to the folder where you stored the sample data files.
* Navigate back to the home tab and select the "Use custom to train a model with labels and key-value pairs option".
* Select the train button on the left pane to train the labeled model.
* Save this connection and use it to label your requests.
* You can choose to analyze the file of your choice against the trained model.

#### &bullet; Create a **docker compose** file

1. Name this file **docker-compose.yml**

2. The following code sample is a self-contained `docker compose` example to run Form Recognizer Layout, Label Tool, Custom API, and Custom Supervised containers together. With `docker compose`, you use a YAML file to configure your application's services. Then, with `docker-compose up` command, you create and start all the services from your configuration.

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
 rabbitmq:
  container_name: ${RABBITMQ_HOSTNAME}
  image: rabbitmq:3
  expose:
    - "5672"
 layout:
  container_name: azure-cognitive-service-layout
  image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
  depends_on:
    - rabbitmq
  environment:
    eula: accept
    apikey: ${FORM_RECOGNIZER_KEY}
    billing: ${FORM_RECOGNIZER_ENDPOINT_URI}
    Queue:RabbitMQ:HostName: ${RABBITMQ_HOSTNAME}
    Queue:RabbitMQ:Port: ${RABBITMQ_PORT}
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

 custom-api:
  container_name: azure-cognitive-service-custom-api
  image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-api
  restart: always
  depends_on:
    - rabbitmq
  environment:
    eula: accept
    apikey: ${FORM_RECOGNIZER_KEY}
    billing: ${FORM_RECOGNIZER_ENDPOINT_URI}
    Logging:Console:LogLevel:Default: Information
    Queue:RabbitMQ:HostName: ${RABBITMQ_HOSTNAME}
    Queue:RabbitMQ:Port: ${RABBITMQ_PORT}
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

 custom-supervised:
  container_name: azure-cognitive-service-custom-supervised
  image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-supervised
  restart: always
  depends_on:
    - rabbitmq
  environment:
    eula: accept
    apikey: ${FORM_RECOGNIZER_KEY}
    billing: ${FORM_RECOGNIZER_ENDPOINT_URI}
    CustomFormRecognizer:ContainerPhase: All
    CustomFormRecognizer:LayoutAnalyzeUri: http://azure-cognitive-service-layout:5000/formrecognizer/v2.1/layout/analyze
    Logging:Console:LogLevel:Default: Information
    Queue:RabbitMQ:HostName: ${RABBITMQ_HOSTNAME}
    Queue:RabbitMQ:Port: ${RABBITMQ_PORT}
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
 ```

### Ensure the service is running

To ensure that the service is up and running. Run these commands in an Ubuntu shell.

```bash
$cd <folder containing the docker-compose file>

$source .env

$docker-compose up
```

### Create a new connection

* On the left pane of the tool, select the **connections** tab.
* Select **create a new project** and give it a name and description.
* For the provider, choose the **local file system** option. For the local folder, make sure you enter the path to the folder where you stored the **sample data** files.
* Navigate back to the home tab and select **Use custom to train a model with labels and key-value pairs**.
* Select the **train button** on the left pane to train the labeled model.
* **Save** this connection and use it to label your requests.
* You can choose to analyze the file of your choice against the trained model.

---

## The Sample Labeling tool and Azure Container Instances (ACI)

To learn how to use the Sample Labeling tool with an Azure Container Instance, *see*, [Deploy the Sample Labeling tool](../deploy-label-tool.md#deploy-with-azure-container-instances-aci).

:::moniker-end

## Validate that the service is running

There are several ways to validate that the container is running:

* The container provides a homepage at `\` as a visual validation that the container is running.

* You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the listed request URLs to validate the container is running. The listed example request URLs are `http://localhost:5000`, but your specific container may vary. Keep in mind that you're  navigating to your container's **External IP address** and exposed port.

  Request URL    | Purpose
  ----------- | --------
  |**http://<span></span>localhost:5000/** | The container provides a home page.
  |**http://<span></span>localhost:5000/ready**     | Requested with GET, this request provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/status** | Requested with GET, this request verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/swagger** | The container provides a full set of documentation for the endpoints and a Try it out feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required.
  |

:::image type="content" source="../media/containers/container-webpage.png" alt-text="Screenshot: Azure container welcome page.":::

## Stop the containers

To stop the containers, use the following command:

```console
docker-compose down
```

## Billing

The Form Recognizer containers send billing information to Azure by using a Form Recognizer resource on your Azure account.

:::moniker range="form-recog-3.0.0"
Queries to the container are billed at the pricing tier of the Azure resource that's used for the `Key`. You're billed for each container instance used to process your documents and images.

> [!NOTE]
> Currently, Form Recognizer v3 containers only support pay as you go pricing. Support for commitment tiers and disconnected mode will be added in March 2023.
Azure Cognitive Services containers aren't licensed to run without being connected to the metering / billing endpoint. Containers must be enabled to always communicate billing information with the billing endpoint. Cognitive Services containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.
:::moniker-end

:::moniker range="form-recog-2.1.0"
Queries to the container are billed at the pricing tier of the Azure resource that's used for the `Key`. You're billed for each container instance used to process your documents and images. Thus, If you use the business card feature, you're billed for the Form Recognizer `BusinessCard` and `Computer Vision Read` container instances. For the invoice feature, you're billed for the Form Recognizer `Invoice` and `Layout` container instances. *See*, [Form Recognizer](https://azure.microsoft.com/pricing/details/form-recognizer/) and Computer Vision [Read feature](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) container pricing.

Azure Cognitive Services containers aren't licensed to run without being connected to the metering / billing endpoint. Containers must be enabled to always communicate billing information with the billing endpoint. Cognitive Services containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.
:::moniker-end

### Connect to Azure

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run, but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. See the [Cognitive Services container FAQ](../../../cognitive-services/containers/container-faq.yml#how-does-billing-work) for an example of the information sent to Microsoft for billing.

### Billing arguments

The [**docker-compose up**](https://docs.docker.com/engine/reference/commandline/compose_up/) command starts the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The key of the Cognitive Services resource that's used to track billing information.<br/>The value of this option must be set to a key for the provisioned resource that's specified in `Billing`. |
| `Billing` | The endpoint of the Cognitive Services resource that's used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

## Summary

That's it! In this article, you learned concepts and workflows for downloading, installing, and running Form Recognizer containers. In summary:

* Form Recognizer provides seven Linux containers for Docker.
* Container images are downloaded from mcr.
* Container images run in Docker.
* The billing information must be specified when you instantiate a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* [Form Recognizer container configuration settings](form-recognizer-container-configuration.md)

* [Azure container instance recipe](../../../cognitive-services/containers/azure-container-instance-recipe.md)
