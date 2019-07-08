---
title: Configure containers
titlesuffix: Face - Azure Cognitive Services
description: Configuration settings for containers.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: dapine
---

# Configure Face Docker containers

The **Face** container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the billing settings. 

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](face-how-to-install-containers.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Cognitive Services_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Cognitive Services** Resource Management, under **Keys**

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Cognitive Services_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Cognitive Services_ resource on Azure. The container reports usage about every 10 to 15 minutes.

This setting can be found in the following place:

* Azure portal: **Cognitive Services** Overview, labeled `Endpoint`

Remember to add the _Face_ routing to the endpoint URI as shown in the example. 

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westcentralus.api.cognitive.microsoft.com/face/v1.0` |

<!-- specific to face only -->

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
  The Face container uses Azure Storage and Azure Cosmos DB to distribute these four types of data across persistent storage. Blob and queue data is handled by Azure Storage. Metadata and cache data is handled by Azure Cosmos DB. If the Face container is stopped or removed, all of the data in storage for that container remains stored in Azure Storage and Azure Cosmos DB.  
  The resources used by the Azure storage scenario have the following additional requirements
  * The Azure Storage resource must use the StorageV2 account kind
  * The Azure Cosmos DB resource must use the Azure Cosmos DB's API for MongoDB

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

The Face containers don't use input or output mounts to store training or service data. 

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](face-how-to-install-containers.md#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the Docker service account and the host mount location permissions. 

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Not allowed| `Input` | String | Face containers do not use this.|
|Optional| `Output` | String | The target of the output mount. The default value is `/output`. This is the location of the logs. This includes container logs. <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Example docker run commands 

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](face-how-to-install-containers.md#stop-the-container) it.

* **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
* **Argument order**: Do not change the order of the arguments unless you are very familiar with Docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
|{BILLING_KEY} | The endpoint key of the Cognitive Services resource. |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{BILLING_ENDPOINT_URI} | The billing endpoint value including region and face routing.|`https://westcentralus.api.cognitive.microsoft.com/face/v1.0`|

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](face-how-to-install-containers.md#billing).
> The ApiKey value is the **Key** from the Azure `Cognitive Services` Resource keys page. 

## Face container Docker examples

The following Docker examples are for the face container. 

### Basic example 

  ```
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
  containerpreview.azurecr.io/microsoft/cognitive-services-face \
  Eula=accept \
  Billing={BILLING_ENDPOINT_URI} \
  ApiKey={BILLING_KEY} 
  ```

### Logging example 

  ```
  docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 containerpreview.azurecr.io/microsoft/cognitive-services-face \
  Eula=accept \
  Billing={BILLING_ENDPOINT_URI} ApiKey={BILLING_KEY} \
  Logging:Console:LogLevel:Default=Information
  ```

## Next steps

* Review [How to install and run containers](face-how-to-install-containers.md)
