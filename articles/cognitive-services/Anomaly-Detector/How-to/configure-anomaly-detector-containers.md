---
title: Configure an Anomaly Detector API container
description: Configure a Linux Docker Container for the Anomaly Detector API. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# Configure an Anomaly Detector API container

The Anomaly Detector's container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the billing settings. 

Container settings are [hierarchical](#hierarchical-settings) and can be set with [environment variables](#environment-variable-settings) or docker [command-line arguments](#command-line-argument-settings).

## Configuration settings

This container has the following configuration settings:

> [!IMPORTANT]
> The [`ApiKey`](#apikey-setting), [`Billing`](#billing-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](#billing).

|Required|Setting|Notes|
|--|--|--|
|Yes|`ApiKey`|Specifies the Azure resource key used to track billing information. The key must be valid for the Anomaly Detector resource specified in the `Billing` setting. You can [access your key](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#access-your-resource) from your Anomaly Detector API resource in the azure portal. |
|No|[ApplicationInsights](#applicationinsights)|Lets you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#billing-setting)|Specifies the endpoint URI of the service resource on Azure. |
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Write log and optional metric data to a Fluentd server.|
|No|[Http Proxy](#http-proxy-credentials-settings)|Configure an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |
|No|[Mounts](#mount-settings)|Read and write data from host computer to container, and from container back to host computer.|

### ApplicationInsights 

The `ApplicationInsights` setting lets you add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container. Application Insights provides in-depth monitoring of your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

#### Supported values

|Required| Name | Data type | Description | Example |
|--|------|-----------|-------------|-----|
|No| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). |`InstrumentationKey=123456789`|

### Billing

The `Billing` setting specifies the endpoint URI of the Anomaly Detector resource used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a Anomaly Finder resource on Azure.

This setting can be found in the following place:

* Azure portal: **Anomaly Finder's** Overview, labeled `Endpoint`

#### Supported values

|Required| Name | Data type | Description | Example |
|--|------|-----------|-------------|-----|
|Yes| `Billing` | String | The billing endpoint URI for your Anomaly Detector account.| `Billing=https://westus.api.cognitive.microsoft.com/sts/v1.0` |

### Eula 

> [!IMPORTANT]
> Cognitive Services containers are licensed under [your agreement](https://go.microsoft.com/fwlink/?linkid=2018657) governing your use of Azure. If you do not have an existing agreement governing your use of Azure, you agree that your agreement governing use of Azure is the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?linkid=2018755), which incorporates the [Online Services Terms](https://go.microsoft.com/fwlink/?linkid=2018760). For previews, you also agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://go.microsoft.com/fwlink/?linkid=2018815). By using the container you agree to these terms.

The `Eula` setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

#### Supported values

|Required| Name | Data type | Description | Example |
|--|------|-----------|-------------|-----|
|Yes| `Eula` | String | License acceptance |  `Eula=accept` |

## Fluentd settings

[Fluentd](https://www.fluentd.org) is an open-source data collector for unified logging. The `Fluentd` settings manage the container's connection to a Fluentd server. The container includes a Fluentd logging provider, which enables your container to write logs and, optional metric data to a Fluentd server.

#### Supported values

| Name | Data type | Description |
|------|-----------|-------------|
| `Host` | String | The IP address or DNS host name of the Fluentd server. |
| `Port` | Integer | The port of the Fluentd server.<br/> The default value is 24224. |
| `HeartbeatMs` | Integer | The heartbeat interval, in milliseconds. If no event traffic has been sent before this interval expires, a heartbeat is sent to the Fluentd server. The default value is 60000 milliseconds (1 minute). |
| `SendBufferSize` | Integer | The network buffer space, in bytes, allocated for send operations. The default value is 32768 bytes (32 kilobytes). |
| `TlsConnectionEstablishmentTimeoutMs` | Integer | The timeout, in milliseconds, to establish a SSL/TLS connection with the Fluentd server. The default value is 10000 milliseconds (10 seconds).<br/> If `UseTLS` is set to false, this value is ignored. |
| `UseTLS` | Boolean | Indicates whether the container should use SSL/TLS for communicating with the Fluentd server. The default value is false. |

## Http proxy credentials settings

If you need to configure an HTTP proxy for making outbound requests, use these two arguments in the `docker run` command:

| Name | Data type | Description | example |
|--|--|--|--|
|HTTP_PROXY|string|the proxy to use. | `http://proxy:8888`|
|HTTP_PROXY_CREDS|string|any credentials needed to authenticate against the proxy| `username:password`|

```bash
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<billing-endpoint> \
ApiKey=<api-key> \
HTTP_PROXY=http://190.169.1.6:3128 \
HTTP_PROXY_CREDS=jerry:123456 \
Logging:Disk:LogLevel=Debug Logging:Disk:Format=json
```

## Logging settings
 
The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application. 

The following logging providers are supported by the container:

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

The Anomaly Finder containers don't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the Docker service account and the host mount location permissions. 

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Not allowed| `Input` | String | Anomaly Finder containers do not use this.|
|Optional| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Hierarchical settings

Settings for the container are hierarchical, and all containers on the host computer use a shared hierarchy.

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

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](#stop-the-container) it.

* **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character for a bash shell. Replace or remove this based on your host operating system's requirements. For example, the line continuation character for windows is a carot, `^`. Replace the back slash with the carot. 
* **Argument order**: Do not change the order of the arguments unless you are very familiar with Docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
|{BILLING_KEY} | The endpoint key of the Anomaly Finder resource. |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{BILLING_ENDPOINT_URI} | The billing endpoint value including region.|`https://westus.api.cognitive.microsoft.com/sts/v1.0`|

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> The ApiKey value is the **Key** from the Azure Anomaly Finder Resource keys page. 

## Anomaly Finder container Docker examples

The following Docker examples are for the Anomaly Finder container. 

### Basic example 

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
  mcr.microsoft.com/azure-cognitive-services/anomaly-finder \
  Eula=accept \
  Billing={BILLING_ENDPOINT_URI} \
  ApiKey={BILLING_KEY} 
  ```

### Logging example with command-line arguments

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
  mcr.microsoft.com/azure-cognitive-services/anomaly-finder \
  Eula=accept \
  Billing={BILLING_ENDPOINT_URI} ApiKey={BILLING_KEY} \
  Logging:Console:LogLevel=Information
  ```

### Logging example with environment variable

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
  mcr.microsoft.com/azure-cognitive-services/anomaly-finder \
  Eula=accept \
  Billing={BILLING_ENDPOINT_URI} \
  ApiKey={BILLING_KEY}
  ```

