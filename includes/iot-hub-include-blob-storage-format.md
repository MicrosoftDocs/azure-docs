---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 03/15/2019
ms.author: robinsh
ms.custom: include file
---
<!-- This is the note explaining about the avro and json formats when routing to blob storage. -->
> [!NOTE]
> The data can be written to blob storage in either the [Apache Avro](https://avro.apache.org/) format, which is the default, or JSON (preview). 
>    
> The capability to encode JSON format is in preview in all regions in which IoT Hub is available, except East US, West US and West Europe. The encoding format can be only set at the time the blob storage endpoint is configured. The format cannot be changed for an endpoint that has already been set up. When using JSON encoding, you must set the contentType to JSON and the contentEncoding to UTF-8 in the message system properties. 
>
> For more detailed information about using a blob storage endpoint, please see [guidance on routing to storage](../articles/iot-hub/iot-hub-devguide-messages-d2c.md#azure-storage).
>