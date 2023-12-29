---
title: Configure Azure AI Health Insights containers
titleSuffix: Azure AI Health Insights
description: Azure AI Health Insights containers use a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: how-to
ms.date: 03/14/2023
ms.author: behoorne
---

# Configure Azure AI Health Insights docker containers

Azure AI Health Insights service provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers. Several [example docker run commands](use-containers.md#run-the-container-with-docker-run) are also available.

## Configuration settings

The container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Tracks billing information.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.|
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[ApplicationInsights__InstrumentationKey ](#applicationinsights-setting)|Enables adding [Azure Application Insights](/azure/application-insights) telemetry support to your container.|
|Yes|[RAI_Terms](#rai-terms-setting)| Indicates acceptance of Responsible AI terms.|

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](use-containers.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Health Insights_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Health Insights** resource management, under **Keys and endpoint**

## ApplicationInsights setting

The `ApplicationInsights` setting allows you to add [Azure Application Insights](/azure/application-insights) telemetry support to your container. Application Insights service provides in-depth monitoring of your container. You can easily monitor your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|No| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent.

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Health Insights** Overview, labeled `Endpoint`

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI. For more information on obtaining the billing URI, see [gather required parameters](use-containers.md).

## Eula setting

The `Eula` setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Eula` | String | License acceptance **Example:** `Eula=accept` |

Azure AI Health Insights containers are licensed under [your agreement](https://go.microsoft.com/fwlink/?linkid=2018657) governing your use of Azure. If you don't have an existing agreement governing your use of Azure, you agree that your agreement use of Azure is the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?linkid=2018755), which incorporates the [Online Services Terms](https://go.microsoft.com/fwlink/?linkid=2018760). For previews, you also agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://go.microsoft.com/fwlink/?linkid=2018815). By using the container, you agree to these terms.

## RAI-Terms setting

The `RAI_Terms` setting indicates acceptance of Responsible AI terms. You must specify a value for this configuration setting, and this value must be set to 'accept'.


|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `RAI_Terms` | String | Responsible AI terms acceptance **Example:** `RAI_Terms=accept` |


## Logging settings
 
The `Logging` settings manage logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core applications. 

The following logging providers are supported by the container:

|Provider|Purpose|
|--|--|
|[Console](/aspnet/core/fundamentals/logging/#console-provider)|The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Debug](/aspnet/core/fundamentals/logging/#debug-provider)|The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Disk](#disk-logging)|The JSON logging provider. This logging provider writes log data to the output mount.|

This container command stores logging information in the JSON format to the output mount:

```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
Logging:Disk:Format=json \
Mounts:Output=/output
```

This container command shows debugging information, prefixed with `debug`, while the container is running:

```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
Logging:Console:LogLevel:Default=Debug
```

### Disk logging

The `Disk` logging provider supports the following configuration settings:


| Name | Data type | Description |
|------|-----------|-------------|
|`Format` | String | The output format for log files. Note: This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
| `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, a new log file is started by the logging provider. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

