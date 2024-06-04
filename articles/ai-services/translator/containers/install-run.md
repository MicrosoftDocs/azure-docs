---
title: Install and run Translator container using Docker API
titleSuffix: Azure AI services
description: Use the Translator container and API to translate text and documents.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: how-to
ms.date: 04/19/2024
ms.author: lajanuar
recommendations: false
keywords: on-premises, Docker, container, identify
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD051 -->

# Install and run Azure AI Translator container

Containers enable you to host the Azure AI Translator API on your own infrastructure. The container image includes all libraries, tools, and dependencies needed to run an application consistently in any private, public, or personal computing environment. If your security or data governance requirements can't be fulfilled by calling Azure AI Translator API remotely, containers are a good option.

In this article, learn how to install and run the Translator container online with Docker API. The Azure AI Translator container supports the following operations:

* **Text Translation**. Translate the contextual meaning of words or phrases from supported `source` to supported `target` language in real time. For more information, *see* [**Container: translate text**](translator-container-supported-parameters.md).

* **🆕 Text Transliteration**. Convert text from one language script or writing system to another language script or writing system in real time. For more information, *see* [Container: transliterate text](transliterate-text-parameters.md).

* **🆕 Document translation (preview)**. Synchronously translate documents while preserving structure and format in real time. For more information, *see* [Container:translate documents](translate-document-parameters.md).

## Prerequisites

To get started, you need the following resources, gated access approval, and tools:

##### Azure resources

* An active [**Azure subscription**](https://portal.azure.com/). If you don't have one, you can [**create a free 12-month account**](https://azure.microsoft.com/free/).

* An approved access request to either a [Translator connected container](https://aka.ms/csgate-translator) or [Translator disconnected container](https://aka.ms/csdisconnectedcontainers).

* An [**Azure AI Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Azure AI services resource) created under the approved subscription ID. You need the API key and endpoint URI associated with your resource. Both values are required to start the container and can be found on the resource overview page in the Azure portal.

  * For Translator **connected** containers, select the `S1` pricing tier.

    :::image type="content" source="media/connected-pricing-tier.png" alt-text="Screenshot of pricing tier selection for Translator connected container.":::

  * For Translator **disconnected** containers, select **`Commitment tier disconnected containers`** as your pricing tier. You only see the option to purchase a commitment tier if your disconnected container access request is approved.

      :::image type="content" source="media/disconnected-pricing-tier.png" alt-text="A screenshot showing resource creation on the Azure portal.":::

##### Docker tools

You should have a basic understanding of Docker concepts like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

  > [!TIP]
  >
  > Consider adding  **Docker Desktop** to your computing environment. Docker Desktop is a graphical user interface (GUI) that enables you to build, run, and share containerized applications directly from your desktop.
  >
  > DockerDesktop includes Docker Engine, Docker CLI client, Docker Compose and provides packages that configure Docker for your preferred operating system:
  >
  > * [macOS](https://docs.docker.com/docker-for-mac/),
  > * [Windows](https://docs.docker.com/docker-for-windows/)
  > * [Linux](https://docs.docker.com/engine/installation/#supported-platforms).

|Tool|Description|Condition|
|----|-----------|---------|
|[**Docker Engine**](https://docs.docker.com/engine/)|The **Docker Engine** is the core component of the Docker containerization platform. It must be installed on a [host computer](#host-computer-requirements) to enable you to build, run, and manage your containers.|***Required*** for all operations.|
|[**Docker Compose**](https://docs.docker.com/compose/)| The **Docker Compose** tool is used to define and run multi-container applications.|***Required*** for [supporting containers](#use-cases-for-supporting-containers).|
|[**Docker CLI**](https://docs.docker.com/engine/reference/commandline/cli/)|The Docker command-line interface enables you to interact with Docker Engine and manage  Docker containers directly from your local machine.|***Recommended***|

##### Host computer requirements

[!INCLUDE [Host Computer requirements](../includes/cognitive-services-containers-host-computer.md)]

##### Recommended CPU cores and memory

> [!NOTE]
> The minimum and recommended specifications are based on Docker limits, not host machine resources.

The following table describes the minimum and recommended specifications and the allowable Transactions Per Second (TPS) for each container.

  |Function | Minimum recommended |Notes|
  |-----------|---------|---------------|
  |Text translation| 4 Core, 4-GB memory ||
  |Text transliteration| 4 Core, 2-GB memory ||
   |Document translation | 4 Core, 6-GB memory|The number of documents that can be processed concurrently can be  calculated with the following formula: [minimum of (`n-2`), (`m-6)/4`)]. <br>&bullet; `n` is number of CPU cores.<br>&bullet; `m` is GB of memory.<br>&bullet;  **Example**: 8 Core, 32-GB memory can process six(6) concurrent documents [minimum of (`8-2`), `(36-6)/4)`].|

* Each core must be at least 2.6 gigahertz (GHz) or faster.

* For every language pair, 2 GB of memory is recommended.

* In addition to baseline requirements, 4 GB of memory for every concurrent document processing.

   > [!TIP]
   > You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
   >
   > ```docker
   >  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
   >
   >  IMAGE ID         REPOSITORY                TAG
   >  <image-id>       <repository-path/name>    <tag-name>
   > ```

## Required input

All Azure AI containers require the following input values:

* **EULA accept setting**. You must have an end-user license agreement (EULA) set with a value of `Eula=accept`.

* **API key** and **Endpoint URL**. The API key is used to start the container. You can retrieve the API key and Endpoint URL values by navigating to your Azure AI Translator resource **Keys and Endpoint** page and selecting the `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon.

* If you're translating documents, be sure to use the document translation endpoint.

> [!IMPORTANT]
>
> * Keys are used to access your Azure AI resource. Do not share your keys. Store them securely, for example, using Azure Key Vault.
>
> * We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Billing

* Queries to the container are billed at the pricing tier of the Azure resource used for the API `Key`.

* You're billed for each container instance used to process your documents and images.

* The [docker run](https://docs.docker.com/engine/reference/commandline/run/) command downloads an  image from Microsoft Artifact Registry and starts the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The key of the Azure AI services resource used to track billing information.<br/>The value of this option must be set to a key for the provisioned resource specified in `Billing`. |
| `Billing` | The endpoint of the Azure AI services resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |

### Connecting to Azure

* The container billing argument values allow the container to connect to the billing endpoint and run.

* The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run, but doesn't serve queries until the billing endpoint is restored.

* A connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. See the [Azure AI container FAQ](../../../ai-services/containers/container-faq.yml#how-does-billing-work) for an example of the information sent to Microsoft for billing.

## Container images and tags

The Azure AI services container images can be found in the [**Microsoft Artifact Registry**](https://mcr.microsoft.com/catalog?page=3) catalog. Azure AI Translator container resides within the azure-cognitive-services/translator repository and is named `text-translation`. The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest`.

To use the latest version of the container, use the latest tag. You can view the full list of [Azure AI services Text Translation](https://mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation/tags) version tags on MCR.

## Use containers

Select a tab to choose your Azure AI Translator container environment:

### [**Connected containers**](#tab/connected)

Azure AI Translator containers enable you to run the Azure AI Translator service `on-premise` in your own environment. Connected containers run locally and send usage information to the cloud for billing.

## Download and run container image

The [docker run](https://docs.docker.com/engine/reference/commandline/run/) command downloads an image from Microsoft Artifact Registry and starts the container.

> [!IMPORTANT]
>
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements.
> * The `EULA`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.
> * If you're translating documents, be sure to use the document translation endpoint.

```bash
docker run --rm -it -p 5000:5000 --memory 12g --cpus 4 \
-v /mnt/d/TranslatorContainer:/usr/local/models \
-e apikey={API_KEY} \
-e eula=accept \
-e billing={ENDPOINT_URI} \
-e Languages=en,fr,es,ar,ru  \
mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest
```

The above command:

* Creates a running Translator container from a downloaded container image.
* Allocates 12 gigabytes (GB) of memory and four CPU core.
* Exposes transmission control protocol (TCP) port 5000 and allocates a pseudo-TTY for the container. Now, the `localhost` address points to the container itself, not your host machine.
* Accepts the end-user agreement (EULA).
* Configures billing endpoint.
* Downloads translation models for languages English, French, Spanish, Arabic, and Russian.
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!TIP]
> Additional Docker command:
>
> * `docker ps` lists running containers.
> * `docker pause {your-container name}` pauses a running container.
> * `docker unpause {your-container-name}` unpauses a paused container.
> * `docker restart {your-container-name}` restarts a running container.
> * `docker exec` enables you to execute commands lto *detach* or *set environment variables* in a running container.
>
> For more information, *see* [docker CLI reference](https://docs.docker.com/engine/reference/commandline/docker/).

### Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Azure AI container running on the HOST together. You also can have multiple containers of the same Azure AI container running.

## Query the Translator container endpoint

The container provides a REST-based Translator endpoint API. Here's an example request with source language (`from=en`) specified:

 ```bash
   curl -X POST "http://localhost:5000/translate?api-version=3.0&from=en&to=zh-HANS" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
 ```

> [!NOTE]
>
> * Source language detection requires an additional container. For more information, *see* [Supporting containers](#use-cases-for-supporting-containers)
>
> * If the cURL POST request returns a `Service is temporarily unavailable` response the container isn't ready. Wait a few minutes, then try again.

### [**Disconnected (offline) containers**](#tab/disconnected)

Disconnected containers enable you to use the Azure AI Translator API by exporting the docker image to your machine with internet access and then using Docker offline. Disconnected containers are intended for scenarios where no connectivity with the cloud is needed for the containers to run.

## Disconnected container commitment plan

* Commitment plans for disconnected containers have a calendar year commitment period.

* When you purchase a plan, you're charged the full price immediately.

* During the commitment period, you can't change your commitment plan; however you can purchase more units at a pro-rated price for the remaining days in the year.

* You have until midnight (UTC) on the last day of your commitment, to end or change a commitment plan.

* You can choose a different commitment plan in the **Commitment tier pricing** settings of your resource under the **Resource Management** section.

## Create a new Translator resource and purchase a commitment plan

1. Create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

1. To create your resource, enter the applicable information. Be sure to select **Commitment tier disconnected containers** as your pricing tier. You only see the option to purchase a commitment tier if you're approved.

    :::image type="content" source="media/disconnected-pricing-tier.png" alt-text="A screenshot showing resource creation on the Azure portal.":::

1. Select **Review + Create** at the bottom of the page. Review the information, and select **Create**.

### End a commitment plan

* If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's autorenewal to **Do not auto-renew**. 

* Your commitment plan expires on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You're still able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. 

* You have until midnight (UTC) on the last day of the year to end a commitment plan for disconnected containers. If you do so, you avoid charges for the following year.

## Gather required parameters

There are three required parameters for all Azure AI services' containers:

* The end-user license agreement (EULA) must be present with a value of *accept*.

* The ***Containers*** endpoint URL for your resource from the Azure portal.

* The API key for your resource from the Azure portal.

Both the endpoint URL and API key are needed when you first run the container to implement the disconnected usage configuration. You can find the key and endpoint on the **Key and endpoint** page for your resource in the Azure portal:

  :::image type="content" source="media/keys-endpoint-container.png" alt-text="Screenshot of Azure portal keys and endpoint page.":::

> [!IMPORTANT]
> You will only use your key and endpoint to configure the container to run in a disconnected.
> If you're translating **documents**, be sure to use the document translation endpoint.
> environment. After you configure the container, you won't need the key and endpoint values to send API requests. Store them securely, for example, using Azure Key Vault. Only one key is necessary for this process.

## Pull and load the Translator container image

1. You should have [Docker tools](#docker-tools) installed in your local environment.

1. Download the Azure AI Translator container with `docker pull`.

    |Docker pull command | Value |Format|
    |----------|-------|------|
    |&bullet; **`docker pull [image]`**</br>&bullet; **`docker pull [image]:latest`**|The latest container image.|&bullet; mcr.microsoft.com/azure-cognitive-services/translator/text-translation</br>  </br>&bullet; mcr.microsoft.com/azure-cognitive-services/translator/text-translation: latest |
    ||||
    |&bullet; **`docker pull [image]:[version]`** | A specific container image |mcr.microsoft.com/azure-cognitive-services/translator/text-translation:1.0.019410001-amd64 |

      **Example Docker pull command:**

    ```docker
    docker pull mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest
    ```

1. Save the image to a `.tar` file.

1. Load the `.tar` file to your local Docker instance. For more information, *see* [Docker: load images from a file](https://docs.docker.com/reference/cli/docker/image/load/#input).

    ```bash
    $docker load --input {path-to-your-file}.tar

    ```

## Configure the container to run in a disconnected environment

Now that you downloaded your container, you can execute the `docker run` command with the following parameters:

* **`DownloadLicense=True`**. This parameter downloads a license file that enables your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file is invalid to run the container. You can only use the license file in corresponding approved container.
* **`Languages={language list}`**. You must include this parameter to download model files for the [languages](../language-support.md) you want to translate.

> [!IMPORTANT]
> The `docker run` command will generate a template that you can use to run the container. The template contains parameters you'll need for the downloaded models and configuration file. Make sure you save this template.

The following example shows the formatting for the `docker run` command with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format|
|:-------------|:-------|:---:|
| `[image]` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/translator/text-translation` |
| `{LICENSE_MOUNT}` | The path where the license is downloaded, and mounted.  | `/host/license:/path/to/license/directory` |
 | `{MODEL_MOUNT_PATH}`| The path where the machine translation models are downloaded, and mounted. Your directory structure must be formatted as **/usr/local/models** | `/host/translator/models:/usr/local/models`|
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, in the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Translation resource. You can find it on your resource's **Key and endpoint** page, in the Azure portal. |`{string}`|
| `{LANGUAGES_LIST}` | List of language codes separated by commas. It's mandatory to have English (en) language as part of the list.| `en`, `fr`, `it`, `zu`, `uk` |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |

  **Example `docker run` command**

```bash

docker run --rm -it -p 5000:5000 \

-v {MODEL_MOUNT_PATH} \

-v {LICENSE_MOUNT_PATH} \

-e Mounts:License={CONTAINER_LICENSE_DIRECTORY} \

-e DownloadLicense=true \

-e eula=accept \

-e billing={ENDPOINT_URI} \

-e apikey={API_KEY} \

-e Languages={LANGUAGES_LIST} \

[image]
```

### Translator translation models and container configuration

After you  [configured the container](#configure-the-container-to-run-in-a-disconnected-environment), the values for the downloaded translation models and container configuration will be generated and displayed in the container output:

```bash
    -e MODELS= usr/local/models/model1/, usr/local/models/model2/
    -e TRANSLATORSYSTEMCONFIG=/usr/local/models/Config/5a72fa7c-394b-45db-8c06-ecdfc98c0832
```

## Run the container in a disconnected environment

Once the license file is downloaded, you can run the container in a disconnected environment with your license, appropriate memory, and suitable CPU allocations. The following example shows the formatting of the `docker run` command with placeholder values. Replace these placeholders values with your own values.

Whenever the container runs, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. In addition, an output mount must be specified so that billing usage records can be written.

|Placeholder | Value | Format|
|-------------|-------|---|
| `[image]`| The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/translator/text-translation` |
|`{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `16g` |
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license is located and mounted.  | `/host/translator/license:/path/to/license/directory` |
|`{MODEL_MOUNT_PATH}`| The path where the machine translation models are downloaded, and mounted. Your directory structure must be formatted as **/usr/local/models** | `/host/translator/models:/usr/local/models`|
|`{MODELS_DIRECTORY_LIST}`|List of comma separated directories each having a machine translation model. | `/usr/local/models/enu_esn_generalnn_2022240501,/usr/local/models/esn_enu_generalnn_2022240501` |
| `{OUTPUT_PATH}` | The output path for logging [usage records](#usage-records). | `/host/output:/path/to/output/directory` |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |
| `{CONTAINER_OUTPUT_DIRECTORY}` | Location of the output folder on the container's local filesystem.  | `/path/to/output/directory` |
|`{TRANSLATOR_CONFIG_JSON}`| Translator system configuration file used by container internally.| `/usr/local/models/Config/5a72fa7c-394b-45db-8c06-ecdfc98c0832` |

  **Example `docker run` command**

```docker

docker run --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \

-v {MODEL_MOUNT_PATH} \

-v {LICENSE_MOUNT_PATH} \

-v {OUTPUT_MOUNT_PATH} \

-e Mounts:License={CONTAINER_LICENSE_DIRECTORY} \

-e Mounts:Output={CONTAINER_OUTPUT_DIRECTORY} \

-e MODELS={MODELS_DIRECTORY_LIST} \

-e TRANSLATORSYSTEMCONFIG={TRANSLATOR_CONFIG_JSON} \

-e eula=accept \

[image]
```

### Troubleshooting

Run the container with an output mount and logging enabled. These settings enable the container to generate log files that are helpful for troubleshooting issues that occur while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](../../containers/disconnected-container-faq.yml).

---

## Validate that a container is running

There are several ways to validate that the container is running:

* The container provides a homepage at `/` as a visual validation that the container is running.

* You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the following request URLs to validate the container is running. The example request URLs listed point to `http://localhost:5000`, but your specific container can vary. Keep in mind that you're navigating to your container's **External IP address** and exposed port.

| Request URL | Purpose |
|--|--|
| `http://localhost:5000/` | The container provides a home page. |
| `http://localhost:5000/ready` | Requested with GET. Provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/status` | Requested with GET. Verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/swagger` | The container provides a full set of documentation for the endpoints and a **Try it out** feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the required  HTTP headers and body format. |

:::image type="content" source="media/container-webpage.png" alt-text="Screenshot of the container home page.":::

[!INCLUDE [Diagnostic container](../includes/diagnostics-container.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../includes/cognitive-services-containers-stop.md)]

## Use cases for supporting containers

Some Translator queries require supporting containers to successfully complete operations. **If you are using Office documents and don't require source language detection, only the Translator container is required.** However if source language detection is required or you're using scanned PDF documents, supporting containers are required:

The following table lists the required supporting containers for your text and document translation operations. The Translator container sends billing information to Azure via the Azure AI Translator resource on your Azure account.

|Operation|Request query|Document type|Supporting containers|
|-----|-----|-----|-----|
|&bullet; Text translation<br>&bullet; Document Translation |`from` specified. |Office documents| None|
|&bullet; Text translation<br>&bullet; Document Translation|`from` not specified. Requires automatic language detection to determine the source language. |Office documents |✔️ [**Text analytics:language**](../../language-service/language-detection/how-to/use-containers.md) container|
|&bullet; Text translation<br>&bullet; Document Translation |`from` specified. |Scanned PDF documents| ✔️ [**Vision:read**](../../computer-vision/computer-vision-how-to-install-containers.md) container|
|&bullet; Text translation<br>&bullet; Document Translation|`from` not specified requiring automatic language detection to determine source language.|Scanned PDF documents| ✔️ [**Text analytics:language**](../../language-service/language-detection/how-to/use-containers.md) container<br><br>✔️ [**Vision:read**](../../computer-vision/computer-vision-how-to-install-containers.md) container|

## Operate supporting containers with `docker compose`

Docker compose is a tool that enables you to configure multi-container applications using a single YAML file typically named `compose.yaml`. Use the `docker compose up` command to start your container application and the `docker compose down` command to stop and remove your containers.

If you installed Docker Desktop CLI, it includes Docker compose and its prerequisites. If you don't have Docker Desktop, see the [Installing Docker Compose overview](https://docs.docker.com/compose/install/).

### Create your application

1. Using your preferred editor or IDE, create a new directory for your app named `container-environment` or a name of your choice.

1. Create a new YAML file named `compose.yaml`. Both the .yml or .yaml extensions can be used for the `compose` file.

1. Copy and paste the following YAML code sample into your `compose.yaml` file. Replace `{TRANSLATOR_KEY}` and `{TRANSLATOR_ENDPOINT_URI}` with the key and endpoint values from your Azure portal Translator instance. If you're translating documents, make sure to use the `document translation endpoint`.

1. The top-level name (`azure-ai-translator`, `azure-ai-language`, `azure-ai-read`) is parameter that you specify.

1. The `container_name` is an optional parameter that sets a name for the container when it runs, rather than letting `docker compose` generate a name.

    ```yml
    services:
      azure-ai-translator:
        container_name: azure-ai-translator
        image: mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation:latest
        environment:
            - EULA=accept
            - billing={TRANSLATOR_ENDPOINT_URI}
            - apiKey={TRANSLATOR_KEY}
            - AzureAiLanguageHost=http://azure-ai-language:5000
            - AzureAiReadHost=http://azure-ai-read:5000
        ports:
              - "5000:5000"
        azure-ai-language:
          container_name: azure-ai-language
          image:  mcr.microsoft.com/azure-cognitive-services/textanalytics/language:latest
          environment:
              - EULA=accept
              - billing={TRANSLATOR_ENDPOINT_URI}
              - apiKey={TRANSLATOR_KEY}
        azure-ai-read:
          container_name: azure-ai-read
          image:  mcr.microsoft.com/azure-cognitive-services/vision/read:latest
          environment:
              - EULA=accept
              - billing={TRANSLATOR_ENDPOINT_URI}
              - apiKey={TRANSLATOR_KEY}
    ```

1. Open a terminal navigate to the `container-environment` folder, and start the containers with the following `docker-compose` command:

   ```bash
   docker compose up
   ```

1. To stop the containers, use the following command:

   ```bash
   docker compose down
   ```

   > [!TIP]
   > Helpful Docker commands:
   >
   > * `docker compose pause` pauses running containers.
   > * `docker compose unpause {your-container-name}` unpauses paused containers.
   > * `docker compose restart` restarts all stopped and running container with all its previous changes intact. If you make changes to your `compose.yaml` configuration, these changes aren't updated with the `docker compose restart` command. You have to use the `docker compose up` command to reflect updates and changes in the `compose.yaml` file.
   > * `docker compose ps -a` lists all containers, including those that are stopped.
   > * `docker compose exec` enables you to execute commands to *detach* or *set environment variables* in a running container.
   >
   > For more information, *see* [docker CLI reference](https://docs.docker.com/engine/reference/commandline/docker/).

### Translator and supporting container images and tags

The Azure AI services container images can be found in the [**Microsoft Artifact Registry**](https://mcr.microsoft.com/catalog?page=3) catalog. The following table lists the fully qualified image location for text and document translation:

|Container|Image location|Notes|
|--------|-------------|---------------|
|Translator: Text and document translation| `mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest`| You can view the full list of [Azure AI services Text Translation](https://mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation/tags) version tags on MCR.|
|Text analytics: language|`mcr.microsoft.com/azure-cognitive-services/textanalytics/language:latest` |You can view the full list of [Azure AI services Text Analytics Language](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/language/tags) version tags on MCR.|
|Vision: read|`mcr.microsoft.com/azure-cognitive-services/vision/read:latest`|You can view the full list of [Azure AI services Computer Vision Read `OCR`](https://mcr.microsoft.com/product/azure-cognitive-services/vision/read/tags) version tags on MCR.|

## Other parameters and commands

Here are a few more parameters and commands you can use to run the container:

#### Usage records

When operating Docker containers in a disconnected environment, the container will write usage records to a volume where they're collected over time. You can also call a REST API endpoint to generate a report about service usage.

#### Arguments for storing logs

When run in a disconnected environment, an output mount must be available to the container to store usage logs. For example, you would include `-v /host/output:{OUTPUT_PATH}` and `Mounts:Output={OUTPUT_PATH}` in the following example, replacing `{OUTPUT_PATH}` with the path where the logs are stored:

  **Example `docker run` command**

```docker
docker run -v /host/output:{OUTPUT_PATH} ... <image> ... Mounts:Output={OUTPUT_PATH}
```

#### Environment variable names in Kubernetes deployments

* Some Azure AI Containers, for example Translator, require users to pass environmental variable names that include colons (`:`) when running the container.

* Kubernetes doesn't accept colons in environmental variable names.
To resolve, you can replace colons with two underscore characters (`__`) when deploying to Kubernetes. See the following example of an acceptable format for environmental variable names:

```Kubernetes
        env:
        - name: Mounts__License
          value: "/license"
        - name: Mounts__Output
          value: "/output"
```

This example replaces the default format for the `Mounts:License` and `Mounts:Output` environment variable names in the docker run command.

#### Get usage records using the container endpoints

The container provides two endpoints for returning records regarding its usage.

#### Get all records

The following endpoint provides a report summarizing all of the usage collected in the mounted billing record directory.

```HTTP
https://<service>/records/usage-logs/
```

***Example HTTPS endpoint to retrieve all records***

  `http://localhost:5000/records/usage-logs`

#### Get records for a specific month

The following endpoint provides a report summarizing usage over a specific month and year:

```HTTP
https://<service>/records/usage-logs/{MONTH}/{YEAR}
```

***Example HTTPS endpoint to retrieve records for a specific month and year***

  `http://localhost:5000/records/usage-logs/03/2024`

The usage-logs endpoints return a JSON response similar to the following example:

### [**Connected containers**](#tab/connected)

***Connected container***

Usage charges are calculated based upon the `quantity` value.

   ```json
   {
     "apiType": "string",
   "serviceName": "string",
   "meters": [
     {
       "name": "string",
       "quantity": 256345435
       }
     ]
   }
   ```

### [**Disconnected (offline) containers**](#tab/disconnected)

***Disconnected container***

   ```json
         {
       "type": "CommerceUsageResponse",
       "meters": [
         {
           "name": "CognitiveServices.TextTranslation.Container.OneDocumentTranslatedCharacters",
           "quantity": 1250000,
           "billedUnit": 1875000
         },
         {
           "name": "CognitiveServices.TextTranslation.Container.TranslatedCharacters",
           "quantity": 1250000,
           "billedUnit": 1250000
         }
       ],
       "apiType": "texttranslation",
       "serviceName": "texttranslation"
      }
   ```

The aggregated value of `billedUnit` for the following meters is counted  towards the characters you licensed for your disconnected container usage:

* `CognitiveServices.TextTranslation.Container.OneDocumentTranslatedCharacters`

* `CognitiveServices.TextTranslation.Container.TranslatedCharacters`

---

### Summary

In this article, you learned concepts and workflows for downloading, installing, and running an Azure AI Translator container:

* Azure AI Translator container supports text translation, synchronous document translation, and text transliteration.

* Container images are downloaded from the container registry and run in Docker.

* The billing information must be specified when you instantiate a container.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure AI container configuration](translator-container-configuration.md) [Learn more about container language support](../language-support.md#translation).

