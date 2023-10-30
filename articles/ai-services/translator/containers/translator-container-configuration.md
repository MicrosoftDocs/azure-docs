---
title: Configure containers - Translator
titleSuffix: Azure AI services
description: The Translator container runtime environment is configured using the `docker run` command arguments. There are both required and optional settings.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: how-to
ms.date: 10/10/2023
ms.author: lajanuar
recommendations: false
---

# Configure Translator Docker containers

Azure AI services provide each container with a common configuration framework.  You can easily configure your Translator containers to build Translator application architecture optimized for robust cloud capabilities and edge locality.

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

* Azure portal: **Translator** Overview page labeled `Endpoint`

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

Translator containers support the following logging providers:

|Provider|Purpose|
|--|--|
|[Console](/aspnet/core/fundamentals/logging/#console-provider)|The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Debug](/aspnet/core/fundamentals/logging/#debug-provider)|The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Disk](#disk-logging)|The JSON logging provider. This logging provider writes log data to the output mount.|

* The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application.

* The `Logging.LogLevel` specifies the minimum level to log. The severity of the `LogLevel` ranges from 0 to 6. When a `LogLevel` is specified, logging is enabled for messages at the specified level and higher: Trace = 0, Debug = 1, Information = 2, Warning = 3, Error = 4, Critical = 5, None = 6.

* Currently, Translator containers have the ability to restrict logs at the **Warning** LogLevel or higher.

The general command syntax for logging is as follows:

```bash
    -Logging:LogLevel:{Provider}={FilterSpecs}
```

The following command starts the Docker container with the `LogLevel` set to **Warning** and logging provider set to **Console**. This command prints anomalous or unexpected events during the application flow to the console:

```bash
docker run --rm -it -p 5000:5000
-v /mnt/d/TranslatorContainer:/usr/local/models \
-e apikey={API_KEY} \
-e eula=accept \
-e billing={ENDPOINT_URI} \
-e Languages=en,fr,es,ar,ru  \
-e Logging:LogLevel:Console="Warning"
mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest

```

### Disk logging

The `Disk` logging provider supports the following configuration settings:

| Name | Data type | Description |
|------|-----------|-------------|
| `Format` | String | The output format for log files.<br/> **Note:** This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
| `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, the logging provider starts a new log file. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

#### Disk provider example

```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
-e apikey={API_KEY} \
-e eula=accept \
-e billing={ENDPOINT_URI} \
-e Languages=en,fr,es,ar,ru  \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
Logging:Disk:Format=json \
Mounts:Output=/output
```

For more information about configuring ASP.NET Core logging support, see [Settings file configuration](/aspnet/core/fundamentals/logging/).

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure AI containers](../../cognitive-services-container-support.md)
