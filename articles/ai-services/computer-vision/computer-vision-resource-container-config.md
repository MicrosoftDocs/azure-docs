---
title: Configure Read OCR containers - Azure AI Vision
titleSuffix: Azure AI services
description: This article shows you how to configure both required and optional settings for Read OCR containers in Azure AI Vision.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 04/09/2021
ms.author: aahi
ms.custom: seodec18
---

# Configure Read OCR Docker containers

You configure the Azure AI Vision Read OCR container's runtime environment by using the `docker run` command arguments. This container has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the billing settings. 

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](computer-vision-how-to-install-containers.md).

The container also has the following container-specific configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|No|ReadEngineConfig:ResultExpirationPeriod| v2.0 containers only. Result expiration period in hours. The default is 48 hours. The setting specifies when the system should clear recognition results. For example, if `resultExpirationPeriod=1`, the system clears the recognition result 1 hour after the process. If `resultExpirationPeriod=0`, the system clears the recognition result after the result is retrieved.|
|No|Cache:Redis| v2.0 containers only. Enables Redis storage for storing results. A cache is *required* if multiple read OCR containers are placed behind a load balancer.|
|No|Queue:RabbitMQ|v2.0 containers only. Enables RabbitMQ for dispatching tasks. The setting is useful when multiple read OCR containers are placed behind a load balancer.|
|No|Queue:Azure:QueueVisibilityTimeoutInMilliseconds | v3.x containers only. The time for a message to be invisible when another worker is processing it. |
|No|Storage::DocumentStore::MongoDB|v2.0 containers only. Enables MongoDB for permanent result storage. |
|No|Storage:ObjectStore:AzureBlob:ConnectionString| v3.x containers only. Azure blob storage connection string. |
|No|Storage:TimeToLiveInDays| v3.x containers only. Result expiration period in days. The setting specifies when the system should clear recognition results. The default is 2 days, which means any result live for longer than that period is not guaranteed to be successfully retrieved. The value is integer and it must be between 1 day to 7 days.|
|No|StorageTimeToLiveInMinutes| v3.2-model-2021-09-30-preview and new containers. Result expiration period in minutes. The setting specifies when the system should clear recognition results. The default is 2 days (2880 minutes), which means any result live for longer than that period is not guaranteed to be successfully retrieved. The value is integer and it must be between 60 minutes to 7 days (10080 minutes).|
|No|Task:MaxRunningTimeSpanInMinutes| v3.x containers only. Maximum running time for a single request. The default is 60 minutes. |
|No|EnableSyncNTPServer| v3.x containers only, except for v3.2-model-2021-09-30-preview and newer containers. Enables the NTP server synchronization mechanism, which ensures synchronization between the system time and expected task runtime. Note that this requires external network traffic. The default is `true`. |
|No|NTPServerAddress| v3.x containers only, except for v3.2-model-2021-09-30-preview and newer containers. NTP server for the time sync-up. The default is `time.windows.com`. |
|No|Mounts:Shared| v3.x containers only. Local folder for storing recognition result. The default is `/share`. For running container without using Azure blob storage, we recommend mounting a volume to this folder to ensure you have enough space for the recognition results. |

## ApiKey configuration setting

The `ApiKey` setting specifies the Vision resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the Vision resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Azure AI services** Resource Management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Azure AI services_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for an _Azure AI services_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Azure AI services** Overview, labeled `Endpoint`

Remember to add the `vision/<version>` routing to the endpoint URI as shown in the following table. 

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westcentralus.api.cognitive.microsoft.com/vision/v3.2` |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared configuration HTTP proxy settings](../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings
 
[!INCLUDE [Container shared configuration logging settings](../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

The Azure AI Vision containers don't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](computer-vision-how-to-install-containers.md#host-computer-requirements)'s mount location may not be accessible due to a conflict between permissions used by the Docker service account and the host mount location permissions. 

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Not allowed| `Input` | String | Azure AI Vision containers do not use this.|
|Optional| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](computer-vision-how-to-install-containers.md#stop-the-container) it.

* **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
* **Argument order**: Do not change the order of the arguments unless you are very familiar with Docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The endpoint key of the Vision resource on the resource keys page. | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| **{ENDPOINT_URI}** | The billing endpoint value is available on the resource overview page.| See [gather required parameters](computer-vision-how-to-install-containers.md#gather-required-parameters) for explicit examples. |

[!INCLUDE [subdomains-note](../../../includes/cognitive-services-custom-subdomains-note.md)]

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](computer-vision-how-to-install-containers.md#billing).
> The ApiKey value is the **Key** from the Vision resource keys page.

## Container Docker examples

The following Docker examples are for the Read OCR container.


# [Version 3.2](#tab/version-3-2)

### Basic example

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30 \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}

```

### Logging example 

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
mcr.microsoft.com/azure-cognitive-services/vision/read:3.2-model-2022-04-30 \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
Logging:Console:LogLevel:Default=Information
```

# [Version 2.0-preview](#tab/version-2)

### Basic example

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
mcr.microsoft.com/azure-cognitive-services/vision/read:2.0-preview \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}

```

### Logging example 

```bash
docker run --rm -it -p 5000:5000 --memory 16g --cpus 8 \
mcr.microsoft.com/azure-cognitive-services/vision/read:2.0-preview \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
Logging:Console:LogLevel:Default=Information
```

---

## Next steps

* Review [How to install and run containers](computer-vision-how-to-install-containers.md).
