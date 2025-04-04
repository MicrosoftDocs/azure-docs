---
title: include file
description: Include file that describes how to use a blob storage endpoint.
author: SoniaLopezBravo
ms.service: azure-iot-hub
services: iot-hub
ms.topic: include
ms.date: 03/31/2025
ms.author: sonialopez
ms.custom: include file
---
> [!NOTE]
> The data can be written to blob storage in either the [Apache Avro](https://avro.apache.org/) format, which is the default, or JSON. 
>    
> The encoding format can be only set at the time the blob storage endpoint is configured. The format can't be changed for a previously configured endpoint. When using JSON encoding, you must set the contentType to JSON and the contentEncoding to UTF-8 in the message system properties. 
>
> For more detailed information about using a blob storage endpoint, see [Azure Storage as a routing endpoint](../articles/iot-hub/iot-hub-devguide-endpoints.md#azure-storage-as-a-routing-endpoint).
>