---
title: Configure containers
titlesuffix: Text Analytics - Azure Cognitive Services
description: Text Analytics provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: conceptual
ms.date: 01/02/2019
ms.author: diberry
---
# Configure containers

Text Analytics provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.

## Configuration settings

Configuration settings in Text Analytics containers are hierarchical, and all containers use a shared hierarchy, based on the following top-level structure:

* [ApiKey](#apikey-configuration-setting)
* [ApplicationInsights](#applicationinsights-configuration-settings)
* [Authentication](#authentication-configuration-settings)
* [Billing](#billing-configuration-setting)
* [Eula](#eula-configuration-setting)
* [Fluentd](#fluentd-configuration-settings)
* [Logging](#logging-configuration-settings)
* [Mounts](#mounts-configuration-settings)

You can use either [environment variables](#configuration-settings-as-environment-variables) or [command-line arguments](#configuration-settings-as-command-line-arguments) to specify configuration settings when instantiating a container from Text Analytics containers.

Environment variable values override command-line argument values, which in turn override the default values for the container image. In other words, if you specify different values in an environment variable and a command-line argument for the same configuration setting, such as `Logging:Disk:LogLevel`, then instantiate a container, the value in the environment variable is used by the instantiated container.

### Configuration settings as environment variables

You can use the [ASP.NET Core environment variable syntax](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#configuration-by-environment) to specify configuration settings.

The container reads user environment variables when the container is instantiated. If an environment variable exists, the value of the environment variable overrides the default value for the specified configuration setting. The benefit of using environment variables is that multiple configuration settings can be set before instantiating containers, and multiple containers can automatically use the same set of configuration settings.

For example, the following commands use an environment variable to configure the console logging level to [LogLevel.Information](https://msdn.microsoft.com), then instantiates a container from the Sentiment Analysis container image. The value of the environment variable overrides the default configuration setting.

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789
  ```

### Configuration settings as command-line arguments

You can use the [ASP.NET Core command-line argument syntax](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#arguments) to specify configuration settings.

You can specify configuration settings in the optional `ARGS` parameter of the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command used to instantiate a container from a downloaded container image. The benefit of using command-line arguments is that each container can use a different, custom set of configuration settings.

For example, the following command instantiates a container from the Sentiment Analysis container image and configures the console logging level to LogLevel.Information, overriding the default configuration setting.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789 Logging:Console:LogLevel=Information
  ```

## ApiKey configuration setting

The `ApiKey` configuration setting specifies the configuration key of the Text Analytics resource on Azure used to track billing information for the container. You must specify a value for this configuration setting, and the value must be a valid configuration key for the Text Analytics resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](how-tos/text-analytics-how-to-install-containers.md#billing).

## ApplicationInsights configuration settings

The configuration settings in the `ApplicationInsights` section allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container. Application Insights provides in-depth monitoring of your container down to the code level. You can easily monitor your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container without waiting for a user to report them.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). |

## Authentication configuration settings

The `Authentication` configuration settings provide Azure security options for your container. Although the configuration settings in this section are available to all containers in Text Analytics containers, the manner in which the configuration setting values are used is specific to each container, and containers may not use this section at all.

The following table describes the configuration settings supported under the `Authentication` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `ApiKey` | String or array | The Azure subscription keys used by the container to access other Azure resources, if needed by the container.<br/> If more than one subscription key is used by the container, then this value is specified as an array of strings; otherwise, a string value is used to specify a single subscription key used by the container. |

## Billing configuration setting

The `Billing` configuration setting specifies the endpoint URI of the Text Analytics resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a Text Analytics resource on Azure.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](how-tos/text-analytics-how-to-install-containers.md#billing).

## Eula configuration setting

The `Eula` configuration setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](how-tos/text-analytics-how-to-install-containers.md#billing).

Cognitive Services containers are licensed under [your agreement](https://go.microsoft.com/fwlink/?linkid=2018657) governing your use of Azure. If you do not have an existing agreement governing your use of Azure, you agree that your agreement governing use of Azure is the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?linkid=2018755) (which incorporates the [Online Services Terms](https://go.microsoft.com/fwlink/?linkid=2018760)). For previews, you also agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://go.microsoft.com/fwlink/?linkid=2018815). By using the container you agree to these terms.

## Fluentd configuration settings

The `Fluentd` section manages configuration settings for [Fluentd](https://www.fluentd.org), an open source data collector for unified logging. Text Analytics containers includes a Fluentd logging provider which allows your container to write log and, optionally, metric data to a Fluentd server.

The following table describes the configuration settings supported under the `Fluentd` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `Host` | String | The IP address or DNS host name of the Fluentd server. |
| `Port` | Integer | The port of the Fluentd server.<br/> The default value is 24224. |
| `HeartbeatMs` | Integer | The heartbeat interval, in milliseconds. If no event traffic has been sent before this interval expires, a heartbeat is sent to the Fluentd server. The default value is 60000 milliseconds (1 minute). |
| `SendBufferSize` | Integer | The network buffer space, in bytes, allocated for send operations. The default value is 32768 bytes (32 kilobytes). |
| `TlsConnectionEstablishmentTimeoutMs` | Integer | The timeout, in milliseconds, to establish a SSL/TLS connection with the Fluentd server. The default value is 10000 milliseconds (10 seconds).<br/> If `UseTLS` is set to false, this value is ignored. |
| `UseTLS` | Boolean | Indicates whether the container should use SSL/TLS for communicating with the Fluentd server. The default value is false. |

## Logging configuration settings

The `Logging` configuration settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you can for an ASP.NET Core application. The following logging providers are supported by Text Analytics containers:

* [Console](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#console-provider)  
  The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.
* [Debug](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#debug-provider)  
  The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.
* Disk  
  The JSON logging provider. This logging provider writes log data to the output mount.  
  The `Disk` logging provider supports the following configuration settings:  

  | Name | Data type | Description |
  |------|-----------|-------------|
  | `Format` | String | The output format for log files.<br/> **Note:** This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
  | `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, a new log file is started by the logging provider. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

For more information about configuring ASP.NET Core logging support, see [Settings file configuration](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#settings-file-configuration).

## Mounts configuration settings

The Docker containers provided by Text Analytics containers are designed to be both stateless and immutable. In other words, files created inside a container are stored in a writable container layer, which persists only while the container is running and cannot be easily accessed. If that container is stopped or removed, the files created inside that container with it are destroyed.

However, because they're Docker containers, you can use Docker storage options, such as volumes and bind mounts, to read and write persisted data outside of the container, if the container supports it. For more information about how to specify and manage Docker storage options, see [Manage data in Docker](https://docs.docker.com/storage/).

> [!NOTE]
> You typically won't need to change the values for these configuration settings. Instead, you'll use the values specified in these configuration settings as destinations when specifying input and output mounts for your container. For more information about specifying input and output mounts, see [Input and output mounts](#input-and-output-mounts).

The following table describes the configuration settings supported under the `Mounts` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `Input` | String | The target of the input mount. The default value is `/input`. |
| `Output` | String | The target of the output mount. The default value is `/output`. |

### Input and output mounts

By default, each container can support an *input mount*, from which the container can read data, and an *output mount*, to which the container can write data. Containers are not required to support input or output mounts, however, and each container can use both input and output mounts for container-specific purposes in addition to the logging options supported by Text Analytics containers. The following table lists input and output mount support for each container in Text Analytics containers.

| Container | Input Mount | Output Mount |
|-----------|-------------|--------------|
|[Key Phrase Extraction](#working-with-key-phrase-extraction) | Not supported | Optional |
|[Language Detection](#working-with-language-detection) | Not supported | Optional |
|[Sentiment Analysis](#working-with-sentiment-analysis) | Not supported | Optional |

You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command used to instantiate a container from a downloaded container image. By default, the input mount uses `/input` as its destination, and the output mount uses `/output` as its destination. Any Docker storage option available to the Docker container host can be specified in the `--mount` option.

For example, the following command defines a Docker bind mount to the `D:\Output` folder on the host machine as the output mount, then instantiates a container from the Sentiment Analysis container image, saving log files in JSON format to the output mount.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 --mount type=bind,source=D:\Output,destination=/output mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789 Logging:Disk:Format=json
  ```





# Configure Language Understanding docker containers 

The Language Understanding (LUIS) container runtime environment is configured using the `docker run` command arguments. LUIS has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the input [mount settings](#mount-settings) and the billing settings. 

Container settings are [hierarchical](#hierarchical-settings) and can be set with [environment variables](#environment-variable-settings) or docker [command-line arguments](#command-line-argument-settings).

## Configuration settings

This container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-setting)|Used to track billing information.|
|No|[ApplicationInsights](#applicationinsights-setting)|Allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#billing-setting)|Specifies the endpoint URI of the _Language Understanding_ resource on Azure.|
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Write log and, optionally, metric data to a Fluentd server.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |
|Yes|[Mounts](#mount-settings)|Read and write data from [host computer](luis-container-howto.md#the-host-computer) to container and from container back to host computer.|

> [!IMPORTANT]
> The [`ApiKey`](#apikey-setting), [`Billing`](#billing-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](luis-container-howto.md#billing).

## ApiKey setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Language Understanding_ resource specified for the [`Billing`](#billing-setting) configuration setting.

This setting can be found in two places:

* Azure portal: **Language Understanding's** Resource Management, under **Keys**
* LUIS portal: **Keys and Endpoint settings** page. 

Do not use the starter key or the authoring key. 

## ApplicationInsights setting

The `ApplicationInsights` setting allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container. Application Insights provides in-depth monitoring of your container. You can easily monitor your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|No| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). <br><br>Example:<br>`InstrumentationKey=123456789`|


## Billing setting

The `Billing` setting specifies the endpoint URI of the _Language Understanding_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Language Understanding_ resource on Azure.

This setting can be found in two places:

* Azure portal: **Language Understanding's** Overview, labeled `Endpoint`
* LUIS portal: **Keys and Endpoint settings** page, as part of the endpoint URI.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westus.api.cognitive.microsoft.com/luis/v2.0` |

## Eula setting

The `Eula` setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Eula` | String | License acceptance<br><br>Example:<br>`Eula=accept` |

Cognitive Services containers are licensed under [your agreement](https://go.microsoft.com/fwlink/?linkid=2018657) governing your use of Azure. If you do not have an existing agreement governing your use of Azure, you agree that your agreement governing use of Azure is the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?linkid=2018755), which incorporates the [Online Services Terms](https://go.microsoft.com/fwlink/?linkid=2018760). For previews, you also agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://go.microsoft.com/fwlink/?linkid=2018815). By using the container you agree to these terms.

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

The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application. 

The following logging providers are supported by the LUIS container:

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

## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command. 

The LUIS container doesn't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](luis-container-howto.md#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the docker service account and the host mount location permissions. 

The following table describes the settings supported.

|Required| Name | Data type | Description |
|-------|------|-----------|-------------|
|Yes| `Input` | String | The target of the input mount. The default value is `/input`. This is the location of the LUIS package files. <br><br>Example:<br>`--mount type=bind,src=c:\input,target=/input`|
|No| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes LUIS query logs and container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Hierarchical settings

Settings for the LUIS container are hierarchical, and all containers on the [host computer](luis-container-howto.md#the-host-computer) use a shared hierarchy.

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

### Command-line argument settings

The benefit of using command-line arguments is that each container can use different settings.

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](luis-container-howto.md#stop-the-container) it.


* **Line-continuation character**: The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
* **Argument order**: Do not change the order of the arguments unless you are very familiar with docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
|{ENDPOINT_KEY} | The endpoint key of the trained LUIS application. |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{BILLING_ENDPOINT} | The billing endpoint value is available on the Azure portal's Language Understanding Overview page.|https://westus.api.cognitive.microsoft.com/luis/v2.0|

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](luis-container-howto.md#billing).
> The ApiKey value is the **Key** from the Keys and Endpoints page in the LUIS portal and is also available on the Azure Language Understanding Resource keys page. 

### Basic example

The following example has the fewest arguments possible to run the container:

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={ENDPOINT_KEY}
```

> [!Note] 
> The preceding command uses the directory off the `c:` drive to avoid any permission conflicts on Windows. If you need to use a specific directory as the input directory, you may need to grant the docker service permission. 
> The preceding docker command uses the back slash, `\`, as a line continuation character. Replace or remove this based on your [host computer](luis-container-howto.md#the-host-computer) operating system's requirements. Do not change the order of the arguments unless you are very familiar with docker containers.


### ApplicationInsights example

The following example sets the ApplicationInsights argument to send telemetry to Application Insights while the container is running:

```bash
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={ENDPOINT_KEY}
InstrumentationKey={INSTRUMENTATION_KEY}
```

### Logging example with command-line arguments

The following command sets the logging level, `Logging:Console:LogLevel`, to configure the logging level to [`Information`](https://msdn.microsoft.com). 

```bash
docker run --rm -it -p 5000:5000 --memory 6g --cpus 2 \
--mount type=bind,src=c:\input,target=/input \
--mount type=bind,src=c:\output,target=/output \
mcr.microsoft.com/azure-cognitive-services/luis:latest \
Eula=accept \
Billing={BILLING_ENDPOINT} \
ApiKey={ENDPOINT_KEY} \
Logging:Console:LogLevel=Information
```

### Logging example with environment variable

The following commands use an environment variable, named `Logging:Console:LogLevel` to configure the logging level to [`Information`](https://msdn.microsoft.com). 

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

* Review [How to install and run containers](luis-container-howto.md)
* Refer to [Frequently asked questions (FAQ)](luis-resources-faq.md) to resolve issues related to LUIS functionality.