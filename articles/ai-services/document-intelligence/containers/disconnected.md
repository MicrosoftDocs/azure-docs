---
title: Use Document Intelligence (formerly Form Recognizer) containers in disconnected environments
titleSuffix: Azure AI services
description: Learn how to run Cognitive Services Docker containers disconnected from the internet.
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
author: laujan
manager: nitinme
ms.topic: reference
ms.date: 12/13/2023
ms.author: lajanuar
---


# Containers in disconnected (offline) environments

:::moniker range="doc-intel-2.1.0 || doc-intel-3.1.0||doc-intel-4.0.0"

Support for containers is currently available with Document Intelligence version `2022-08-31 (GA)`:

* [REST API `2022-08-31 (GA)`](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
* [SDKs targeting `REST API 2022-08-31 (GA)`](../sdk-overview-v3-0.md)

✔️ See [**Document Intelligence v3.0 containers in disconnected environments**](?view=doc-intel-3.0.0&preserve-view=true) for supported container documentation.

:::moniker-end

:::moniker range="doc-intel-3.0.0"

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.0 (GA)**

## What are disconnected containers?

[Azure AI containers](../../cognitive-services-container-support.md) gives you the flexibility to run some Document Intelligence services locally in containers. Connected containers run locally in your environment and send usage information to the cloud for billing. Disconnected containers are intended for scenarios where no connectivity with the cloud is needed for the containers to run.

Azure AI Document Intelligence containers allow you to use Document Intelligence APIs with the benefits of containerization. Disconnected containers are offered through commitment tier pricing offered at a discounted rate compared to pay-as-you-go pricing. With commitment tier pricing, you can commit to using Document Intelligence features for a fixed fee, at a predictable total cost, based on the needs of your workload.

## Get started

Before attempting to run a Docker container in an offline environment, make sure you're familiar with the following requirements to successfully download and use the container:

* Host computer requirements and recommendations.
* The Docker `pull` command to download the container.
* How to validate that a container is running.
* How to send queries to the container's endpoint, once it's running.

## Request access to use containers in disconnected environments

Before you can use Document Intelligence containers in disconnected environments, you must first fill out and [submit a request form](../../../ai-services/containers/disconnected-containers.md#request-access-to-use-containers-in-disconnected-environments) and [purchase a commitment plan](../../../ai-services/containers/disconnected-containers.md#purchase-a-commitment-plan-to-use-containers-in-disconnected-environments).

## Create a new resource in the Azure portal

Start by provisioning a new resource in the portal.

* Ensure you select the `Commitment tier disconnected containers DC0` option for Pricing tier
* Select the appropriate pricing tier from at least one of custom, read or prebuilt commitment tiers

  :::image type="content" source="../media/containers/disconnected.png" alt-text="Screenshot of disconnected tier configuration in the Azure portal.":::

| Container | Minimum | Recommended | Commitment plan |
|-----------|---------|-------------|-------------|
| `Read` | `8` cores, 10-GB memory | `8` cores, 24-GB memory| OCR (Read) |
| `Layout` | `8` cores, 16-GB memory | `8` cores, 24-GB memory | Prebuilt |
| `Business Card` | `8` cores, 16-GB memory | `8` cores, 24-GB memory | Prebuilt |
| `General Document` | `8` cores, 12-GB memory | `8` cores, 24-GB memory| Prebuilt |
| `ID Document` | `8` cores, 8-GB memory | `8` cores, 24-GB memory | Prebuilt |
| `Invoice` | `8` cores, 16-GB memory | `8` cores, 24-GB memory| Prebuilt |
| `Receipt` | `8` cores, 11-GB memory | `8` cores, 24-GB memory | Prebuilt |
| `Custom Template` | `8` cores, 16-GB memory | `8` cores, 24-GB memory| Custom API |

## Gather required parameters

There are three required parameters for all Azure AI services' containers:

* The end-user license agreement (EULA) must be present with a value of *accept*.
* The endpoint URL for your resource from the Azure portal.
* The API key for your resource from the Azure portal.

Both the endpoint URL and API key are needed when you first run the container to configure it for disconnected usage. You can find the key and endpoint on the **Key and endpoint** page for your resource in the Azure portal:

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot of Azure portal keys and endpoint page.":::

> [!IMPORTANT]
> You will only use your key and endpoint to configure the container to run in a disconnected environment. After you configure the container, you won't need the key and endpoint values to send API requests. Store them securely, for example, using Azure Key Vault. Only one key is necessary for this process.

## Download a Docker container with `docker pull`

Download the Docker container that is approved to run in a disconnected environment. For example:

|Docker pull command | Value |Format|
|----------|-------|------|
|&#9679; **`docker pull [image]`**</br></br> &#9679; **`docker pull [image]latest`**|The latest container image.|&#9679; `mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0:latest`</br>  </br>&#9679; `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice-3.0:latest` |

**Example Docker pull command**

```docker
docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice:latest
```

## Configure the container to be run in a disconnected environment

Disconnected container images are the same as connected containers. The key difference being that the disconnected containers require a license file. This license file is downloaded by starting the container in a connected mode with the downloadLicense parameter set to true.

Now that your container is downloaded, you need to execute the `docker run` command with the following parameter:

* **`DownloadLicense=True`**. This parameter downloads a license file that enables your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file is invalid to run the container. You can only use the license file in corresponding approved container.

> [!IMPORTANT]
>The `docker run` command will generate a template that you can use to run the container. The template contains parameters you'll need for the downloaded models and configuration file. Make sure you save this template.

The following example shows the formatting for the `docker run` command to use with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
| `{LICENSE_MOUNT}` | The path where the license is downloaded, and mounted.  | `/host/license:/path/to/license/directory` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Document Intelligence resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`{string}`|
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |

  **Example `docker run` command**

```docker

docker run --rm -it -p 5000:5050 \

-v {LICENSE_MOUNT} \

{IMAGE} \

eula=accept \

billing={ENDPOINT_URI} \

apikey={API_KEY} \

DownloadLicense=True \

Mounts:License={CONTAINER_LICENSE_DIRECTORY}
```

In the following command, replace the placeholders for the folder path, billing endpoint, and API key to download a license file for the layout container.

```docker run -v {folder path}:/license --env Mounts:License=/license --env DownloadLicense=True --env Eula=accept --env Billing={billing endpoint} --env ApiKey={api key} mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0:latest```

After the container is configured, use the next section to run the container in your environment with the license, and appropriate memory and CPU allocations.

## Document Intelligence container models and configuration

After you [configured the container](#configure-the-container-to-be-run-in-a-disconnected-environment), the values for the downloaded Document Intelligence models and container configuration will be generated and displayed in the container output.

## Run the container in a disconnected environment

Once you download the license file, you can run the container in a disconnected environment with your license, appropriate memory, and suitable CPU allocations. The following example shows the formatting of the `docker run` command with placeholder values. Replace these placeholders values with your own values.

Whenever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. In addition, an output mount must be specified so that billing usage records can be written.

Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
 `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `4g` |
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license is located and mounted.  | `/host/license:/path/to/license/directory` |
| `{OUTPUT_PATH}` | The output path for logging [usage records](#usage-records). | `/host/output:/path/to/output/directory` |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |
| `{CONTAINER_OUTPUT_DIRECTORY}` | Location of the output folder on the container's local filesystem.  | `/path/to/output/directory` |

  **Example `docker run` command**

```docker
docker run --rm -it -p 5000:5050 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \

-v {LICENSE_MOUNT} \

-v {OUTPUT_PATH} \

{IMAGE} \

eula=accept \

Mounts:License={CONTAINER_LICENSE_DIRECTORY}

Mounts:Output={CONTAINER_OUTPUT_DIRECTORY}
```

Starting a disconnected container is similar to [starting a connected container](install-run.md). Disconnected containers require an added license parameter. Here's a sample docker-compose.yml file for starting a custom container in disconnected mode. Add the CUSTOM_LICENSE_MOUNT_PATH environment variable with a value set to the folder containing the downloaded license file, and the `OUTPUT_MOUNT_PATH` environment variable with a value set to the folder that holds the usage logs.

```yml
version: '3.3'
services:
 nginx:
  image: nginx:alpine
  container_name: reverseproxy
  volumes:
    - ${NGINX_CONF_FILE}:/etc/nginx/nginx.conf
  ports:
    - "5000:5050"
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
    Mounts:License: /license
  volumes:
    - type: bind
      source: ${SHARED_MOUNT_PATH}
      target: /shared
    - type: bind
      source: ${OUTPUT_MOUNT_PATH}
      target: /logs
    - type: bind
      source: ${LAYOUT_LICENSE_MOUNT_PATH}
      target: /license
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
    Mounts:License: /license
  volumes:
    - type: bind
      source: ${SHARED_MOUNT_PATH}
      target: /shared
    - type: bind
      source: ${OUTPUT_MOUNT_PATH}
      target: /logs
    - type: bind
      source: ${CUSTOM_LICENSE_MOUNT_PATH}
      target: /license
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

## Other parameters and commands

Here are a few more parameters and commands you need to run the container.

#### Usage records

When operating Docker containers in a disconnected environment, the container will write usage records to a volume where they're collected over time. You can also call a REST API endpoint to generate a report about service usage.

#### Arguments for storing logs

When run in a disconnected environment, an output mount must be available to the container to store usage logs. For example, you would include `-v /host/output:{OUTPUT_PATH}` and `Mounts:Output={OUTPUT_PATH}` in the following example, replacing `{OUTPUT_PATH}` with the path where the logs are stored:

```Docker
docker run -v /host/output:{OUTPUT_PATH} ... <image> ... Mounts:Output={OUTPUT_PATH}
```

#### Get records using the container endpoints

The container provides two endpoints for returning records about its usage.

#### Get all records

The following endpoint provides a report summarizing all of the usage collected in the mounted billing record directory.

```http
https://<service>/records/usage-logs/
```

  **Example HTTPS endpoint**

  `http://localhost:5000/records/usage-logs`

The usage-log endpoint returns a JSON response similar to the following example:

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

#### Get records for a specific month

The following endpoint provides a report summarizing usage over a specific month and year.

```HTTP
https://<service>/records/usage-logs/{MONTH}/{YEAR}
```

This usage-logs endpoint returns a JSON response similar to the following example:

```json
{
  "apiType": "string",
  "serviceName": "string",
  "meters": [
    {
      "name": "string",
      "quantity": 56097
    }
  ]
}
```

## Troubleshooting

Run the container with an output mount and logging enabled. These settings enable the container generates log files that are helpful for troubleshooting issues that occur while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](../../../ai-services/containers/disconnected-container-faq.yml).

## Next steps

* [Deploy the Sample Labeling tool to an Azure Container Instance (ACI)](../deploy-label-tool.md#deploy-with-azure-container-instances-aci)
* [Change or end a commitment plan](../../../ai-services/containers/disconnected-containers.md#purchase-a-commitment-plan-to-use-containers-in-disconnected-environments)

:::moniker-end
