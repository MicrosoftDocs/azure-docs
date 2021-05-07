---
title: Configure containers - Translator
titleSuffix: Azure Cognitive Services
description: The Translator container runtime environment is configured using the `docker run` command arguments. There are both required and optional settings.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/05/2021
ms.author: lajanuar
recommendations: false
---

# Configure Translator Docker containers (Preview)

Cognitive Services provides each container with a common configuration framework.  You can easily configure your Translator containers and you to build Translator application architecture optimized for robust cloud capabilities and edge locality.

The **Translator** container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. The container-specific settings are the billing settings.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

 > [!IMPORTANT]
> The [**ApiKey**](#apikey-configuration-setting), [**Billing**](#billing-configuration-setting), and [**EULA**](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](translator-how-to-install-containers.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Translator_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Translator** resource management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Translator_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Translator_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Translator** Overview page, labeled `Endpoint`

| Required | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Yes | `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [gathering required parameters](translator-how-to-install-containers.md#required-elements). For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](../cognitive-services-custom-subdomains.md). |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared HTTP proxy settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

The Translator containers don't use input or output mounts to store training or service data.

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](translator-how-to-install-containers.md#host-computer)'s mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions.
<!-- markdownlint-disable MD033 -->
|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Not allowed| `Input` | String | Translator containers do not use this value.|
|Optional| `Output` | String | The target of the output mount. The default value is `/output`. Here is where you'll find the location of the logs, including container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Next Steps

> [!div class="nextstepaction"]
> [Learn more about Cognitive Services Containers](../../cognitive-services-container-support.md)