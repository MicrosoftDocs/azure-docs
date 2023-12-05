---
title: Configure Speech containers
titleSuffix: Azure AI services
description: Speech service provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 04/18/2023
ms.author: eur
---

# Configure Speech service containers

Speech containers enable customers to build one speech application architecture that is optimized to take advantage of both robust cloud capabilities and edge locality. 

The Speech container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. The container-specific settings are the billing settings.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](speech-container-overview.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Speech_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

- Azure portal: **Speech** Resource Management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Speech_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Speech_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

- Azure portal: **Speech** Overview, labeled `Endpoint`

| Required | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Yes | `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [billing](speech-container-overview.md#billing). For more information and a complete list of regional endpoints, see [Custom subdomain names for Azure AI services](../cognitive-services-custom-subdomains.md). |

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

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](speech-container-howto.md#host-computer-requirements-and-recommendations)'s mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions.

| Optional | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Not allowed | `Input` | String | Standard Speech containers do not use this. Custom speech containers use [volume mounts](#volume-mount-settings).                                                                                    |
| Optional | `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output` |

## Volume mount settings

The custom speech containers use [volume mounts](https://docs.docker.com/storage/volumes/) to persist custom models. You can specify a volume mount by adding the `-v` (or `--volume`) option to the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

> [!NOTE]
> The volume mount settings are only applicable for [Custom Speech to text](speech-container-cstt.md) containers. 

Custom models are downloaded the first time that a new model is ingested as part of the custom speech container docker run command. Sequential runs of the same `ModelId` for a custom speech container will use the previously downloaded model. If the volume mount is not provided, custom models cannot be persisted.

The volume mount setting consists of three color `:` separated fields:

1. The first field is the name of the volume on the host machine, for example _C:\input_.
2. The second field is the directory in the container, for example _/usr/local/models_.
3. The third field (optional) is a comma-separated list of options, for more information see [use volumes](https://docs.docker.com/storage/volumes/).

Here's a volume mount example that mounts the host machine _C:\input_ directory to the containers _/usr/local/models_ directory.

```bash
-v C:\input:/usr/local/models
```


## Next steps

- Review [How to install and run containers](speech-container-howto.md)


