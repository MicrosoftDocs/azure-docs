---
title: Configure containers - Translator
titleSuffix: Azure AI services
description: The Translator container runtime environment is configured using the `docker run` command arguments. There are both required and optional settings.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

# Configure Translator Docker containers

Azure AI services provides each container with a common configuration framework.  You can easily configure your Translator containers to build Translator application architecture optimized for robust cloud capabilities and edge locality.

The **Translator** container runtime environment is configured using the `docker run` command arguments. This container has both required and optional settings. The required container-specific settings are the billing settings.

## Configuration settings

The container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Tracks billing information.|
|No|[ApplicationInsights](#applicationinsights-setting)|Enables adding [Azure Application Insights](/azure/application-insights) telemetric support to your container.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.|
|Yes|[EULA](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Writes log and, optionally, metric data to a Fluentd server.|
|No|HTTP Proxy|Configures an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |
|Yes|[Mounts](#mount-settings)|Reads and writes data from the host computer to the container and from the container back to the host computer.|

 > [!IMPORTANT]
> The [**ApiKey**](#apikey-configuration-setting), [**Billing**](#billing-configuration-setting), and [**EULA**](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container.

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Translator_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Translator** resource management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Translator_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Translator_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Translator** Overview page, labeled `Endpoint`

| Required | Name | Data type | Description |
| -------- | ---- | --------- | ----------- |
| Yes | `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [gathering required parameters](translator-how-to-install-container.md#required-elements). For more information and a complete list of regional endpoints, see [Custom subdomain names for Azure AI services](../../cognitive-services-custom-subdomains.md). |

## EULA setting

[!INCLUDE [Container shared configuration eula settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared HTTP proxy settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure AI containers](../../cognitive-services-container-support.md)
