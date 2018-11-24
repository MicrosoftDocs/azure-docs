---
title: Docker container settings for Language Understanding (LUIS)
titlesuffix: Azure Cognitive Services
description: The LUIS container runtime environment is configured using the `docker run` command arguments. LUIS has several required settings, along with a few optional settings.   
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: conceptual
ms.date: 12/04/2018
ms.author: diberry
---

# Configure containers

The LUIS container runtime environment is configured using the `docker run` command arguments. LUIS has several required settings, along with a few optional settings. 

The primary settings are the input and output [mount settings](#mount-settings) on the host where the LUIS app package is located, and the billing settings. 

Container settings are [hierarchical](#settings-are-hierarchical) and can be set with [environment variables](#environment-variable-settings) or docker [command-line arguments](command-line-argument-settings).

## Configuration settings

This container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Used to track billing information.|
|No|[ApplicationInsights](#applicationinsights-configuration-settings)|Allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the _Language Understanding_ resource on Azure.|
|Yes|[Eula](#eula-configuration-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-configuration-settings)|Write log and, optionally, metric data to a Fluentd server.|
|No|[Logging](#logging-configuration-settings)|Provides ASP.NET Core logging support for your container. |
|Yes|[Mounts](#mounts-configuration-settings)|Read and write data from host to container and from container back to host.|

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](luis-container-howto.md#billing).

## ApiKey setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Language Understanding_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in two places:

* Azure portal: **Language Understanding's** Resource Management, under **Keys**
* LUIS portal: **Keys and Endpoint settings** page. 

Do not use the starter key or the authoring key. 

## ApplicationInsights setting

The `ApplicationInsights` setting allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container. Application Insights provides in-depth monitoring of your container. You can easily monitor your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). |


## Billing setting

The `Billing` setting specifies the endpoint URI of the _Language Understanding_ resource on Azure used to track billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Language Understanding_ resource on Azure.

This setting can be found in two places:

* Azure portal: **Language Understanding's** Overview, labeled `Endpoint`
* LUIS portal: **Keys and Endpoint settings** page, as part of the endpoint URI.

An example of an endpoint URI for the `westus` region is: 

`https://westus.api.cognitive.microsoft.com/luis/v2.0`

## Eula setting

The `Eula` setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

## Fluentd settings

Fluentd is an open-source data collector for unified logging. The `Fluentd` settings manage the container's connection to a [Fluentd](https://www.fluentd.org) server. The LUIS container includes a Fluentd logging provider, which allows your container to write logs and, optionally, metric data to a Fluentd server.

The following table describes the configuration settings supported under the `Fluentd` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `Host` | String | The IP address or DNS host name of the Fluentd server. |
| `Port` | Integer | The port of the Fluentd server.<br/> The default value is 24224. |
| `HeartbeatMs` | Integer | The heartbeat interval, in milliseconds. If no event traffic has been sent before this interval expires, a heartbeat is sent to the Fluentd server. The default value is 60000 milliseconds (1 minute). |
| `SendBufferSize` | Integer | The network buffer space, in bytes, allocated for send operations. The default value is 32768 bytes (32 kilobytes). |
| `TlsConnectionEstablishmentTimeoutMs` | Integer | The timeout, in milliseconds, to establish a SSL/TLS connection with the Fluentd server. The default value is 10000 milliseconds (10 seconds).<br/> If `UseTLS` is set to false, this value is ignored. |
| `UseTLS` | Boolean | Indicates whether the container should use SSL/TLS for communicating with the Fluentd server. The default value is false. |

## Logging settings

The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application. The following logging providers are supported by the LUIS container:

|Provider|Purpose|
|--|--|
|[Console](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#console-provider)|The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Debug](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#debug-provider)|The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Disk](#disk-logging)|The JSON logging provider. This logging provider writes log data to the output mount.|

### Disk logging
  
The `Disk` logging provider supports the following configuration settings:  

| Name | Data type | Description |
|------|-----------|-------------|
| `Format` | String | The output format for log files.<br/> **Note:** This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
| `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, a new log file is started by the logging provider. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

For more information about configuring ASP.NET Core logging support, see [Settings file configuration](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#settings-file-configuration).

## Mounts settings

The LUIS containers are both stateless and immutable. Files created inside a container are stored in a writable container layer, which persists only while the container is running and are not accessible. If that container is stopped or removed, the files created inside that container are destroyed.

Use bind mounts to read and write data to and from the container. For more information about how to specify and manage these options, see [Manage data in Docker](https://docs.docker.com/storage/).

The following table describes the settings supported.

|Required| Name | Data type | Description |
|-------|------|-----------|-------------|
|Yes| `Input` | String | The target of the input mount. The default value is `/input`. This is the location of the LUIS package files. |
|No| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes LUIS query logs and container logs. |

### Input and output mounts

You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command. By default, the input mount uses `/input` as its destination, and the output mount uses `/output` as its destination. Any Docker storage option available to the Docker container host can be specified in the `--mount` option.

Example mount values are:

|Location|Value|
|--|--|
|Input|`--mount type=bind,src=c:\input,target=/input`|
|Output|`--mount type=bind,src=c:\output,target=/output`|

The LUIS container doesn't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the host's mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions. 

## Hierarchical settings

Settings for the LUIS container are hierarchical, and all containers on the host computer use a shared hierarchy.

You can use either of the following to specify settings:

* [Environment variables](#environment-variable-settings)
* [Command-line arguments](#command-line-argument-settings)

Environment variable values override command-line argument values, which in turn override the default values for the container image. If you specify different values in an environment variable and a command-line argument for the same configuration setting, the value in the environment variable is used by the instantiated container.

|Precedence|Setting location|
|--|--|
|1|Environment variable| 
|2|Command-line|
|3|Container image default value|

### Environment variable settings

The benefits of using environment variables are:

* Multiple settings can be configured.
* Multiple containers can use the same settings.

The preceding docker command uses the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. Do not change the order of the arguments unless you are very familiar with docker containers.

### Command-line argument settings

The benefit of using command-line arguments is that each container can use different settings.

For example, the following command instantiates a container from the LUIS container image and configures the console logging level to `Information`, overriding the default configuration setting.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/lui Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/luis/v2.0 ApiKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Logging:Console:LogLevel=Information
  ```

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](luis-container-howto.md#stop-the-container) it.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
|{ENDPOINT_KEY} | The application ID of the trained LUIS application. |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{BILLING_ENDPOINT} | The billing endpoint value is available on the Azure portal's Language Understanding Overview page.|https://westus.api.cognitive.microsoft.com/luis/v2.0|

The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. Do not change the order of the arguments unless you are very familiar with docker containers.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> The ApiKey value is the **Key** from the Keys and Endpoints page in the LUIS portal and is also available on the Azure Language Understanding Resource keys page. 

### Basic example

The following example has the fewest arguments possible to run the container:

```bash
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={ENDPOINT_KEY}
```

### ApplicationInsights example

### Fluentd example

### Logging example

The following command sets the logging level, `Logging:Console:LogLevel`, to configure the logging level to `[Information](https://msdn.microsoft.com)`. 

```bash
SET Logging:Console:LogLevel=Information
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={APPLICATION_ID} \
Logging:Console:LogLevel=Information
```

### Environment variable example 

The following commands use an environment variable, named `Logging:Console:LogLevel` to configure the logging level to `[Information](https://msdn.microsoft.com)`. 

```bash
SET Logging:Console:LogLevel=Information
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={APPLICATION_ID} \
```

## Next steps

* Review [Configure containers](luis-container-configuration.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](luis-resources-faq.md) to resolve issues related to LUIS functionality.