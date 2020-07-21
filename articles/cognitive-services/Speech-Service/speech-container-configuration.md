---
title: Configure Speech containers
titleSuffix: Azure Cognitive Services
description: Speech service provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Configure Speech service containers

Speech containers enable customers to build one speech application architecture that is optimized to take advantage of both robust cloud capabilities and edge locality. The four speech containers we support now are, **speech-to-text**, **custom-speech-to-text**, **text-to-speech**, and **custom-text-to-speech**.

The **Speech** container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the billing settings.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](speech-container-howto.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Speech_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

- Azure portal: **Speech's** Resource Management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Speech_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Speech_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

- Azure portal: **Speech's** Overview, labeled `Endpoint`

| Required | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Yes | `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [gathering required parameters](speech-container-howto.md#gathering-required-parameters). For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](../cognitive-services-custom-subdomains.md). |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared HTTP proxy settings](../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

The Standard Speech containers don't use input or output mounts to store training or service data. However, custom speech containers rely on volume mounts.

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](speech-container-howto.md#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions.

| Optional | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Not allowed | `Input` | String | Standard Speech containers do not use this. Custom speech containers use [volume mounts](#volume-mount-settings).                                                                                    |
| Optional | `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output` |

## Volume mount settings

The custom speech containers use [volume mounts](https://docs.docker.com/storage/volumes/) to persist custom models. You can specify a volume mount by adding the `-v` (or `--volume`) option to the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

Custom models are downloaded the first time that a new model is ingested as part of the custom speech container docker run command. Sequential runs of the same `ModelId` for a custom speech container will use the previously downloaded model. If the volume mount is not provided, custom models cannot be persisted.

The volume mount setting consists of three color `:` separated fields:

1. The first field is the name of the volume on the host machine, for example _C:\input_.
2. The second field is the directory in the container, for example _/usr/local/models_.
3. The third field (optional) is a comma-separated list of options, for more information see [use volumes](https://docs.docker.com/storage/volumes/).

### Volume mount example

```bash
-v C:\input:/usr/local/models
```

This command mounts the host machine _C:\input_ directory to the containers _/usr/local/models_ directory.

> [!IMPORTANT]
> The volume mount settings are only applicable to **Custom Speech-to-text** and **Custom Text-to-speech** containers. The standard **Speech-to-text** and **Text-to-speech** containers do not use volume mounts.

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands. Once running, the container continues to run until you [stop](speech-container-howto.md#stop-the-container) it.

- **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements.
- **Argument order**: Do not change the order of the arguments unless you are familiar with Docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
| ----------- | ----- | ----------------- |
| **{API_KEY}** | The endpoint key of the `Speech` resource on the Azure `Speech` Keys page.   | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                  |
| **{ENDPOINT_URI}** | The billing endpoint value is available on the Azure `Speech` Overview page. | See [gathering required parameters](speech-container-howto.md#gathering-required-parameters) for explicit examples. |

[!INCLUDE [subdomains-note](../../../includes/cognitive-services-custom-subdomains-note.md)]

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start. For more information, see [Billing](#billing-configuration-setting).
> The ApiKey value is the **Key** from the Azure Speech Resource keys page.

## Speech container Docker examples

The following Docker examples are for the Speech container.

## [Speech-to-text](#tab/stt)

### Basic example for Speech-to-text

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

### Logging example for Speech-to-text

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Console:LogLevel:Default=Information
```

## [Custom Speech-to-text](#tab/cstt)

### Basic example for Custom Speech-to-text

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
-v {VOLUME_MOUNT}:/usr/local/models \
containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

### Logging example for Custom Speech-to-text

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
-v {VOLUME_MOUNT}:/usr/local/models \
containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Console:LogLevel:Default=Information
```

## [Text-to-speech](#tab/tss)

### Basic example for Text-to-speech

```Docker
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

### Logging example for Text-to-speech

```Docker
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Console:LogLevel:Default=Information
```

## [Custom Text-to-speech](#tab/ctts)

### Basic example for Custom Text-to-speech

```Docker
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
-v {VOLUME_MOUNT}:/usr/local/models \
containerpreview.azurecr.io/microsoft/cognitive-services-custom-text-to-speech \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

### Logging example for Custom Text-to-speech

```Docker
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
-v {VOLUME_MOUNT}:/usr/local/models \
containerpreview.azurecr.io/microsoft/cognitive-services-custom-text-to-speech \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
Logging:Console:LogLevel:Default=Information
```

---

## Next steps

- Review [How to install and run containers](speech-container-howto.md)
