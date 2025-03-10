---
title: include file
description: include file
author: SoniaLopezBravo
ms.service: azure-iot-hub
services: iot-hub
ms.topic: include
ms.date: 02/23/2024
ms.author: sonialopez
ms.custom: include file
---
> [!NOTE]
> The data can be written to blob storage in either the [Apache Avro](https://avro.apache.org/) format, which is the default, or JSON. 
>    
> The encoding format can be only set at the time the blob storage endpoint is configured. The format cannot be changed for an endpoint that has already been set up. When using JSON encoding, you must set the contentType to JSON and the contentEncoding to UTF-8 in the message system properties. 
>
> For more detailed information about using a blob storage endpoint, please see [guidance on routing to storage](../articles/iot-hub/iot-hub-devguide-endpoints.md#azure-storage-as-a-routing-endpoint).
>