---
title: Configure containers
titlesuffix: Face - Cognitive Services - Azure
description: Configuration settings for containers.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: diberry
---

# Configure containers

The Face container uses a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.

## Configuration settings

Configuration settings in the Face container are hierarchical, and all containers use a shared hierarchy, based on the following top-level structure:

* [ApiKey](#apikey-configuration-setting)
* [ApplicationInsights](#applicationinsights-configuration-settings)
* [Authentication](#authentication-configuration-settings)
* [Billing](#billing-configuration-setting)
* [CloudAI](#cloudai-configuration-settings)
* [Eula](#eula-configuration-setting)
* [Fluentd](#fluentd-configuration-settings)
* [Logging](#logging-configuration-settings)
* [Mounts](#mounts-configuration-settings)

You can use either [environment variables](#configuration-settings-as-environment-variables) or [command-line arguments](#configuration-settings-as-command-line-arguments) to specify configuration settings when instantiating a Face container.

Environment variable values override command-line argument values, which in turn override the default values for the container image. In other words, if you specify different values in an environment variable and a command-line argument for the same configuration setting, such as `Logging:Disk:LogLevel`, then instantiate a container, the value in the environment variable is used by the instantiated container.

### Configuration settings as environment variables

You can use the [ASP.NET Core environment variable syntax](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#configuration-by-environment) to specify configuration settings.

The container reads user environment variables when the container is instantiated. If an environment variable exists, the value of the environment variable overrides the default value for the specified configuration setting. The benefit of using environment variables is that multiple configuration settings can be set before instantiating containers, and multiple containers can automatically use the same set of configuration settings.

For example, the following commands use an environment variable to configure the console logging level to [LogLevel.Information](https://msdn.microsoft.com), then instantiates a container from the Face container image. The value of the environment variable overrides the default configuration setting.

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789
  ```

### Configuration settings as command-line arguments

You can use the [ASP.NET Core command-line argument syntax](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#arguments) to specify configuration settings.

You can specify configuration settings in the optional `ARGS` parameter of the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command used to instantiate a container from a downloaded container image. The benefit of using command-line arguments is that each container can use a different, custom set of configuration settings.

For example, the following command instantiates a container from the Face container image and configures the console logging level to LogLevel.Information, overriding the default configuration setting.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789 Logging:Console:LogLevel=Information
  ```

## ApiKey configuration setting

The `ApiKey` configuration setting specifies the configuration key of the Face resource on Azure used to track billing information for the container. You must specify a value for this configuration setting, and the value must be a valid configuration key for the Face resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](face-how-to-install-containers.md#billing).

## ApplicationInsights configuration settings

The configuration settings in the `ApplicationInsights` section allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container. Application Insights provides in-depth monitoring of your container down to the code level. You can easily monitor your container for availability, performance, and usage. You can also quickly identify and diagnose errors in your container without waiting for a user to report them.

The following table describes the configuration settings supported under the `ApplicationInsights` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `InstrumentationKey` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). |

## Authentication configuration settings

The `Authentication` configuration settings provide Azure security options for your container. Although the configuration settings in this section are available, the Face container does not use this section.

| Name | Data type | Description |
|------|-----------|-------------|
| `Storage` | String | The instrumentation key of the Application Insights instance to which telemetry data for the container is sent. For more information, see [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net-core). |

## Billing configuration setting

The `Billing` configuration setting specifies the endpoint URI of the Face resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a Face resource on Azure.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](face-how-to-install-containers.md#billing).

## CloudAI configuration settings

The configuration settings in the `CloudAI` section provide container-specific options unique to your container. The following settings and objects are supported for the Face container in the `CloudAI` section

| Name | Data type | Description |
|------|-----------|-------------|
| `Storage` | Object | The storage scenario used by the Face container. For more information about storage scenarios and associated settings for the `Storage` object, see [Storage scenario settings](#storage-scenario-settings) |

### Storage scenario settings

The Face container stores blob, cache, metadata, and queue data, depending on what's being stored. For example, training indexes and results for a large person group are stored as blob data. The Face container provides two different storage scenarios when interacting with and storing these types of data:

* Memory  
  All four types of data are stored in memory. They're not distributed, nor are they persistent. If the Face container is stopped or removed, all of the data in storage for that container is destroyed.  
  This is the default storage scenario for the Face container.
* Azure  
  The Face container uses Azure Storage and Azure Cosmos DB to distribute these four types of data across persistent storage. Blob and queue data is handled by Azure Storage. Metadata and cache data is handled by Azure Cosmos DB, using the MongoDB API. If the Face container is stopped or removed, all of the data in storage for that container remains stored in Azure Storage and Azure Cosmos DB.  
  The resources used by the Azure storage scenario have the following additional requirements
  * The Azure Storage resource must use the StorageV2 account kind
  * The Azure Cosmos DB resource must use the MongoDB API

The storage scenarios and associated configuration settings are managed by the `Storage` object, under the `CloudAI` configuration section. The following configuration settings are available in the `Storage` object:

| Name | Data type | Description |
|------|-----------|-------------|
| `StorageScenario` | String | The storage scenario supported by the container. The following values are available<br/>`Memory` - Default value. Container uses non-persistent, non-distributed and in-memory storage, for single-node, temporary usage. If the container is stopped or removed, the storage for that container is destroyed.<br/>`Azure` - Container uses Azure resources for storage. If the container is stopped or removed, the storage for that container is persisted.|
| `ConnectionStringOfAzureStorage` | String | The connection string for the Azure Storage resource used by the container.<br/>This setting applies only if `Azure` is specified for the `StorageScenario` configuration setting. |
| `ConnectionStringOfCosmosMongo` | String | The MongoDB connection string for the Azure Cosmos DB resource used by the container.<br/>This setting applies only if `Azure` is specified for the `StorageScenario` configuration setting. |

For example, the following command specifies the Azure storage scenario and provides sample connection strings for the Azure Storage and Cosmos DB resources used to store data for the Face container.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789 CloudAI:Storage:StorageScenario=Azure CloudAI:Storage:ConnectionStringOfCosmosMongo="mongodb://samplecosmosdb:0123456789@samplecosmosdb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb" CloudAI:Storage:ConnectionStringOfAzureStorage="DefaultEndpointsProtocol=https;AccountName=sampleazurestorage;AccountKey=0123456789;EndpointSuffix=core.windows.net"
  ```

The storage scenario is handled separately from input mounts and output mounts. You can specify a combination of those features for a single container. For example, the following command defines a Docker bind mount to the `D:\Output` folder on the host machine as the output mount, then instantiates a container from the Face container image, saving log files in JSON format to the output mount. The command also specifies the Azure storage scenario and provides sample connection strings for the Azure Storage and Cosmos DB resources used to store data for the Face container.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 --mount type=bind,source=D:\Output,destination=/output containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789 Logging:Disk:Format=json CloudAI:Storage:StorageScenario=Azure CloudAI:Storage:ConnectionStringOfCosmosMongo="mongodb://samplecosmosdb:0123456789@samplecosmosdb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb" CloudAI:Storage:ConnectionStringOfAzureStorage="DefaultEndpointsProtocol=https;AccountName=sampleazurestorage;AccountKey=0123456789;EndpointSuffix=core.windows.net"
  ```

## Eula configuration setting

The `Eula` configuration setting indicates that you've accepted the license for the container. You must specify a value for this configuration setting, and the value must be set to `accept`.

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-configuration-setting) configuration settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](face-how-to-install-containers.md#billing).

Cognitive Services containers are licensed under [your agreement](https://go.microsoft.com/fwlink/?linkid=2018657) governing your use of Azure. If you do not have an existing agreement governing your use of Azure, you agree that your agreement governing use of Azure is the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?linkid=2018755) (which incorporates the [Online Services Terms](https://go.microsoft.com/fwlink/?linkid=2018760)). For previews, you also agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://go.microsoft.com/fwlink/?linkid=2018815). By using the container you agree to these terms.

## Fluentd configuration settings

The `Fluentd` section manages configuration settings for [Fluentd](https://www.fluentd.org), an open source data collector for unified logging. the Face container includes a Fluentd logging provider which allows your container to write log and, optionally, metric data to a Fluentd server.

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

The `Logging` configuration settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you can for an ASP.NET Core application. The following logging providers are supported by the Face container:

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

The Docker containers provided by Face are designed to be both stateless and immutable. In other words, files created inside a container are stored in a writable container layer, which persists only while the container is running and cannot be easily accessed. If that container is stopped or removed, the files created inside that container with it are destroyed.

However, because they're Docker containers, you can use Docker storage options, such as volumes and bind mounts, to read and write persisted data outside of the container, if the container supports it. For more information about how to specify and manage Docker storage options, see [Manage data in Docker](https://docs.docker.com/storage/).

> [!NOTE]
> You typically won't need to change the values for these configuration settings. Instead, you'll use the values specified in these configuration settings as destinations when specifying input and output mounts for your container. For more information about specifying input and output mounts, see [Input and output mounts](#input-and-output-mounts).

The following table describes the configuration settings supported under the `Mounts` section.

| Name | Data type | Description |
|------|-----------|-------------|
| `Input` | String | The target of the input mount. The default value is `/input`. |
| `Output` | String | The target of the output mount. The default value is `/output`. |

### Input and output mounts

By default, each container can support an *input mount*, from which the container can read data, and an *output mount*, to which the container can write data. Containers are not required to support input or output mounts, however, and each container can use both input and output mounts for container-specific purposes in addition to the logging options supported by the Face container.

The Face container does not support input mounts, and optionally supports output mounts.

You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command used to instantiate a container from a downloaded container image. By default, the input mount uses `/input` as its destination, and the output mount uses `/output` as its destination. Any Docker storage option available to the Docker container host can be specified in the `--mount` option.

For example, the following command defines a Docker bind mount to the `D:\Output` folder on the host machine as the output mount, then instantiates a container from the Face container image, saving log files in JSON format to the output mount.

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 --mount type=bind,source=D:\Output,destination=/output containerpreview.azurecr.io/microsoft/cognitive-services-face Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0 ApiKey=0123456789 Logging:Disk:Format=json
  ```

The Face container doesn't use input or output mounts to store training or database data. Instead, the Face container provides storage scenarios for managing training and database data. For more information about using storage scenarios, see [Storage scenario settings](#storage-scenario-settings).
