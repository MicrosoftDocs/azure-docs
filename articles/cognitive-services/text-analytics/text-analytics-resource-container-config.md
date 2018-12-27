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
# Configure Text Analytics docker containers

Text Analytics provides each container with a common configuration framework, so that you can easily configure and manage storage, logging and telemetry, and security settings for your containers.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-setting), [`Billing`](#billing-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](how-to/text-analytics-how-to-install-containers.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Text Analytics_ resource specified for the [`Billing`](#billing-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Text Analytics's** Resource Management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Text Analytics_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a __Text Analytics_ resource on Azure.

This setting can be found in the following place:

* Azure portal: **Text Analytics's** Overview, labeled `Endpoint`

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westus.api.cognitive.microsoft.com/text/analytics/v2.0` |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings


[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## Logging settings
 
[!INCLUDE [Container shared configuration logging settings](../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Mount settings

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

## Hierarchical settings

[!INCLUDE [Container shared configuration hierarchical settings](../../../includes/cognitive-services-containers-configuration-shared-hierarchical-settings.md)]

## Example docker run commands for keyphrase extraction

### Basic example

### ApplicationInsights example

### Logging example with command-line arguments

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/keyphrase Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789 Logging:Console:LogLevel=Information
  ```

### Logging example with environment variable

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/keyphrase  Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789
  ```

## Example docker run commands for language detection

### Basic example

### ApplicationInsights example

### Logging example with command-line arguments

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/language Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789 Logging:Console:LogLevel=Information
  ```

### Logging example with environment variable

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/language  Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789
  ```
 
## Example docker run commands for sentiment analysis

### Basic example

### ApplicationInsights example

### Logging example with command-line arguments

  ```Docker
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789 Logging:Console:LogLevel=Information
  ```

### Logging example with environment variable

  ```Docker
  SET Logging:Console:LogLevel=Information
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789
  ```

## Next steps

* Review [How to install and run containers](how-tos/text-analytics-how-to-install-containers.md)