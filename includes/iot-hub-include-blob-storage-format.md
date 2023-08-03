---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 03/15/2019
ms.author: kgremban
ms.custom: include file
---
> [!NOTE]
> The data can be written to blob storage in either the [Apache Avro](https://avro.apache.org/) format, which is the default, or JSON. 
>    
> The encoding format can be only set at the time the blob storage endpoint is configured. The format cannot be changed for an endpoint that has already been set up. When using JSON encoding, you must set the contentType to JSON and the contentEncoding to UTF-8 in the message system properties. 
>
> For more detailed information about using a blob storage endpoint, please see [guidance on routing to storage](../articles/iot-hub/iot-hub-devguide-messages-d2c.md#azure-storage-as-a-routing-endpoint).
>