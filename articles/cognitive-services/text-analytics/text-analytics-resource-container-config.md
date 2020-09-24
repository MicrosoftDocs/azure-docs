---
title: Configure containers - Text Analytics
titleSuffix: Azure Cognitive Services
description: Text Analytics provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Configure Text Analytics docker containers

Text Analytics provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers. Several [example docker run commands](how-tos/text-analytics-how-to-install-containers.md#run-the-container-with-docker-run) are also available.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](how-tos/text-analytics-how-to-install-containers.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Text Analytics_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Text Analytics** resource management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Text Analytics_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a __Text Analytics_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Text Analytics** Overview, labeled `Endpoint`

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [gathering required parameters](how-tos/text-analytics-how-to-install-containers.md#gathering-required-parameters). For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](../cognitive-services-custom-subdomains.md). |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## Http proxy credentials settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings
 
[!INCLUDE [Container shared configuration logging settings](../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

The Text Analytics containers don't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](how-tos/text-analytics-how-to-install-containers.md#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions. 

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Not allowed| `Input` | String | Text Analytics containers do not use this.|
|Optional| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Next steps

* Review [How to install and run containers](how-tos/text-analytics-how-to-install-containers.md)
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)
