---
title: Install and run Docker containers for Form Recognizer v2.1
titleSuffix: Azure Applied AI Services
description: Use the Docker containers for Form Recognizer on-premises to identify and extract key-value pairs, selection marks, tables, and structure from forms and documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/16/2021
ms.author: lajanuar
keywords: on-premises, Docker, container, identify
---

# Install and run Form Recognizer v2.1-preview containers

> [!IMPORTANT]
>
> * Form Recognizer containers are in gated preview and to use them you must submit an online request, and have it approved. See [**Request approval to run container**](#request-approval-to-run-container) below for more information.

Containers enable you to run the Form Recognizer service in your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run Form Recognizer containers.

Form Recognizer features are supported by seven Form Recognizer feature containers—**Layout**, **Business Card**,**ID Document**,  **Receipt**, **Invoice**, **Custom Front End (FE)**, and **Custom Back End (FE)**— and the **Read** OCR container. The **Read** container allows you to extract printed and handwritten text from images and documents with support for JPEG, PNG, BMP, PDF, and TIFF file formats. For more information, see the [Read API how-to guide](Vision-API-How-to-Topics/call-read-api.md).

## Prerequisites

To get started, you'll need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You'll also need the following to use Form Recognizer containers:

| Required | Purpose |
|----------|---------|
| **Familiarity with Docker** | <ul><li>You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology).</li></ul> |
| **Docker Engine installed** | <ul><li>You need the Docker Engine installed on a [host computer](#host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul>  |
|**Form Recognizer resource** | <ul><li>An Azure **Form Recognizer** resource and the associated API key and endpoint URI. Both values are available on the Azure portal **Form Recognizer** Keys and Endpoint page and are required to start the container.</li></ul> |
|||

|Optional|Purpose|
|---------|----------|
|**Azure CLI (command-line interface)** |<ul><li> The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It is available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell.</li></ul> |
|||

## Request approval to run the container

Complete and submit the [Application for Gated Services form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNlpBU1lFSjJUMFhKNzVHUUVLN1NIOEZETiQlQCN0PWcu)  to request approval to run the container.

The form requests information about you, your company, and the user scenario for which you'll use the container. After you submit the form, the Azure Cognitive Services team will review it and email you with a decision.

On the form, you must use an email address associated with an Azure subscription ID. The Azure resource you use to run the container must have been created with the approved Azure subscription ID. Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft. After you're approved, you will be able to run the container after downloading it from the Microsoft Container Registry (MCR), described later in the article.

## Host computer requirements

The host is a x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../../../aks/index.yml).
* [Azure Container Instances](../../../container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

#### Required containers

The following table lists the required containers for each Form Recognizer feature:

| Feature| Required Containers|
|---------|-----------|
|Layout 2.1-preview | **Layout** container |
| Business Card 2.1-preview | **Business Card** and **Read** containers |
| ID Document 2.1-preview  | **ID Document** and **Read** containers |
| Invoice 2.1-preview  | **Invoice** and **Layout** containers |
| Receipt 2.1-preview  | **Receipt** and **Read** containers |
| Custom | **Custom FE**, **Custom BE**, **Label Tool**, and **Layout** containers |

#### Recommended CPU cores and memory

The minimum and recommended CPU cores and memory to allocate for each Form Recognizer container are outlined in the following table:

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Read 3.2 | 8 cores, 16-GB memory | 8 cores, 24-GB memory|
| Layout 2.1-preview | 8 cores, 16-GB memory | 4 core, 8-GB memory |
| Business Card 2.1-preview | 2 cores, 4-GB memory | 4 cores, 4-GB memory |
| ID Document 2.1-preview | 1 core, 2-GB memory |2 cores, 2-GB memory |
| Invoice 2.1-preview | 4 cores, 8-GB memory | 8 cores, 8-GB memory |
| Receipt 2.1-preview |  4 cores, 8-GB memory | 8 cores, 8-GB memory  |
| Label Tool 2.1 | 2 core, 4-GB memory | 4 core, 8-GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker compose` or `docker run`  command.

> [!Note]
> The minimum and recommended values are based on Docker limits and *not* the host machine resources.

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID         REPOSITORY                TAG
>  <image-id>       <repository-path/name>    <tag-name>
>  ```

## Run the container with the **docker compose up** command

* Replace the {ENDPOINT_URI} and {API_KEY} values with your Form Recognizer Endpoint URI and the API Key from the Azure resource page.
   :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: Azure portal keys and endpoint page":::

* Ensure that the EULA value is set to "accept".

* The `EULA`, `Billing`, and `ApiKey`  values must be specified ; otherwise the container won't start.

> [!IMPORTANT]
> The subscription keys are used to access your Form Recognizer resource. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

### [Layout](#tab/layout)

Below is a self-contained `docker compose`  example to run the Form Recognizer Layout container.  With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance.

```yml
version: "3.9"
services:
azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    environment:
      - EULA=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
    ports:
      - "5000"
    networks:
      - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```yml
docker-compose up
```

### [Business Card](#tab/business-card)

Below is a self-contained `docker compose` example to run Form Recognizer Business Card and Read containers together. With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration.Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance. The API_Key must be the same for both the Business Card and Read containers.

```yml
version: "3.9"
services:
  azure-cognitive-service-businesscard:
    container_name: azure-cognitive-service-businesscard
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```yml
docker-compose up
```

### [ID Document](#tab/id-document)

Below is a self-contained `docker compose` example to run Form Recognizer ID Document and Read containers together. With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance. The API_Key must be the same for both the ID Document and Read containers.

```yml
version: "3.9"
services:
  azure-cognitive-service-id:
    container_name: azure-cognitive-service-id
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```yml
docker-compose up
```

### [Invoice](#tab/invoice)

Below is a self-contained `docker compose` example to run Form Recognizer Invoice and Layout containers together. With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance. The API_Key must be the same for both the Invoice and Layout containers.

```yml
version: "3.9"
services:
  azure-cognitive-service-invoice:
    container_name: azure-cognitive-service-invoice
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
      - AzureCognitiveServiceLayoutHost=http://azure-cognitive-service-layout:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    user: root
    environment:
      - EULA=accept
      - billing= # Billing endpoint
      - apikey= # Subscription key
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```yml
docker-compose up
```

### [Receipt](#tab/receipt)

Below is a self-contained `docker compose` example to run Form Recognizer Receipt and Read containers together. With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance. The API_Key must be the same for both the Receipt and Read containers.

```yml
version: "3.9"
services:
  azure-cognitive-service-receipt:
    container_name: azure-cognitive-service-receipt
    image: cognitiveservicespreview.azurecr.io/microsoft/cognitive-services-form-recognizer-receipt:2.1
    environment:
      - EULA=accept 
      - billing= # Billing endpoint
      - apikey= # Subscription key
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2
    environment:
      - EULA=accept 
      - billing= # Billing endpoint
      - apikey= # Subscription key
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

Now, you can start the service with the [**docker compose**](https://docs.docker.com/compose/) command:

```yml
docker-compose up
```

### [Custom](#tab/custom)

In addition to the [prerequisites](#prerequisites) mentioned above, you will need to do the following to process a custom document:

* Create a **shared folder** ({SHARED_MOUNT_PATH}) to store your input data and an **output folder**  ({OUTPUT_MOUNT_PATH}) to store the logs  written by the Form Recognizer service on your local machine.

* Gather a set of at least six forms of the same type. You'll use this data to train the model and test a form. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*) for this quickstart. Download the training files to shared folder your created in the above step

* Create a .env file in the same folder where you place your **docker-compose** file. The .env file should contain the following environment variables:

  * SHARED_MOUNT_PATH={SHARED_MOUNT_PATH}
  * OUTPUT_MOUNT_PATH={OUTPUT_MOUNT_PATH }

#### Create your **docker compose** file

Below is a self-contained `docker compose` example to run Form Recognizer Layout, Label Tool, Custom Backend, and Custom Frontend containers together. With `docker compose`, you use a YAML file to configure your application’s services. Then, with `docker-compose up` command, you create and start all the services from your configuration. Please fill in {ENDPOINT_URI} and {API_KEY} with values for your Form Recognizer instance. The API_Key must be the same for all containers.

```yml
version: '3'
services:
 azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: cognitiveservicespreview.azurecr.io/microsoft/cognitive-services-layout:2.1
    environment:
      - EULA=accept
      - billing={COGNITIVE_SERVICES_ENDPOINT_URI}
      - apikey={COGNITIVE_SERVICE_API_KEY}
    volumes:
    - type: bind
      source: ${SHARED_MOUNT_PATH}
      target: /share
    - type: bind
      source: ${OUTPUT_MOUNT_PATH}
      target: /logs
   ports:
         - "7000:5000"
networks:
      - ocrvnet
 azure-cognitive-service-frontend:
  image: TODO
  environment:
      - EULA=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
    networks:
      - ocrvnet

 azure-cognitive-service-backendphase1:
    image: TODO
    environment:
      - EULA=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
    networks:
        - ocrvnet
 azure-cognitive-service-backendphase2:
   image: TODO
   environment:
        - EULA=accept
       - billing={ENDPOINT_URI}
       - apikey={API_KEY}
   networks:
        - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

### Start the Form Labeling tool with Docker

Once the Layout and Custom containers are set up, you can begin training using the OCR Form Labeling tool.

* Start the  Form Labeling Tool container with the [**docker run**](https://docs.docker.com/engine/reference/commandline/run/) command:

    ```console
    docker run -it -p 3000:80 mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool eula=accept
    ```

* The Form Labeling Tool will be available to you through a web browser by navigating to **http://<span></span>localhost:3000**.

* For the Form Recognizer service URI use **http://<span></span>localhost:5000**

### Create a new connection

* On the left pane of the tool, select the connections tab.
* Select to create a new project and give it a name and description.
* For the provider, choose the local file system option. For the local folder, make sure you enter the path to the folder where you stored the sample data files.
* Navigate back to the home tab and select the “Use custom to train a model with labels and key value pairs option”.
* Select the train button on the left pane to train the labelled model.
* Save this connection and use it to label your requests.
* You can choose to analyze the file of your choice against the trained model.

---

## Validate that the service is running

There are several ways to validate that the container is running:

* The container provides a homepage at `\` as a visual validation that the container is running.

* You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the various request URLs below to validate the container is running. The example request URLs listed below are `http://localhost:5000`, but your specific container may vary. Keep in mind that you're  navigating to your container's **External IP address** and exposed port.

  Request URL    | Purpose
  ----------- | --------
  |**http://<span></span>localhost:5000/** | The container provides a home page.
  |**http://<span></span>localhost:5000/ready**     | Requested with GET, this provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/status** | Requested with GET, this verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes liveness and readiness probes.
  |**http://<span></span>localhost:5000/swagger** | The container provides a full set of documentation for the endpoints and a Try it out feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required.
  |

:::image type="content" source="../media/containers/container-webpage.png" alt-text="Screenshot: Azure container welcome page":::

## Stop the containers

To stop the containers, use the following command:

```console
docker-compose down
```

## Billing

The Form Recognizer containers send billing information to Azure by using a Form Recognizer resource on your Azure account.

Queries to the container are billed at the pricing tier of the Azure resource that's used for the `ApiKey`. You will be billed for each container instance used to process your documents and images. Thus, If you use the business card feature, you will be billed for the `BusinessCard` and `Read` container instances. For the invoice feature, you will be billed for the `Invoice` and `Layout` container instances. *See*, [Form Recognizer](https://azure.microsoft.com/pricing/details/form-recognizer/) and Computer Vision [Read feature](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) container pricing.

Azure Cognitive Services containers aren't licensed to run without being connected to the metering / billing endpoint. You must enable the containers to communicate billing information with the billing endpoint at all times. Cognitive Services containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.

### Connect to Azure

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. See the [Cognitive Services container FAQ](../../containers/container-faq.yml#how-does-billing-work) for an example of the information sent to Microsoft for billing.

### Billing arguments

The [**docker compose up**](https://docs.docker.com/engine/reference/commandline/compose_up/) command will start the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Cognitive Services resource that's used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource that's specified in `Billing`. |
| `Billing` | The endpoint of the Cognitive Services resource that's used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

For more information about these options, see [Configure containers](form-recognizer-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Form Recognizer containers. In summary:

* Form Recognizer provides one Linux container for Docker.
* Container images are downloaded from the private container registry in Azure.
* Container images run in Docker.
* You must specify the billing information when you instantiate a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](form-recognizer-container-configuration.md) for configuration settings.
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md).