---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets
titleSuffix: Azure Media Services
description:  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/10/2020
ms.author: juliako

---

# Reference

The configuration of a media graph includes a combination of sources, processors, and sinks.

For a media graph running in the cloud, the configuration can be set using the HTTP REST API or using an Azure Resource Manager template.
In both cases, the configuration is provided as part of the `properties` object. Here's an example using a template. <!--[using a template](../src/examples/media-graph-deploy.json) - where is this file?-->

```json
{
    "sources": [],
    "processors": [],
    "sinks": []
}
```

For a media graph running on the edge, the configuration is embedded in the [module manifest](https://docs.microsoft.com/azure/iot-edge/module-composition) as an escaped JSON string.

```json
   "properties.desired": {
    "mediaGraph": "{ \"sources\": [], \"processors\": [], \"sinks\": [] }"
   }
```

## Sources

### `Microsoft.Media.MediaGraphRtspSource`

The `MediaGraphRtspSource` source allows a media graph to ingest an RTSP stream.
This source is supported on both the cloud and the edge.

```json
{
    "$type": "Microsoft.Media.MediaGraphRtspSource",
    "name": "<reference for the source to be used the config>",
    "url": "<url for camera>",
    "credentials": {
        "username": "<username for authenticating the camera>",
        "password": "<password for authenticating the camera>"
    }
}
```

| Property      | Type             | Description
|:------------- |:---------------- |:-----------
| `name`        | string           | The name of the source, used for referencing within the configuration.
| `url`         | url              | The URL for the RTSP stream.
| `credentials` | object           | The username and password for authenticating the RTSP stream.

## Processors

### `Microsoft.Media.MediaGraphMotionDetector`

The `MediaGraphMotionDetector` processor detects motion in the video stream and emits events with data about the motion detection activity.
_This processor is only available on the edge._

```json
{
    "$type": "Microsoft.Media.MediaGraphMotionDetector",
    "name": "<reference for the processor to be used the config>",
    "inputs": [
        "<reference to a source or processor identified in the config>"
    ],
    "sensitivity": "<Low|Medium|High>"
}
```

| Property      | Type             | Description
|:------------- |:---------------- |:-----------
| `name`        | string           | The name of the processor, used for referencing within the configuration.
| `inputs`      | array of strings | The array contains the `name` values of configured sources.
| `sensitivity` | enumeration      | This can be `Low`, `Medium`, or `High`. This determines how amount of motion required to trigger an event.

The `MediaGraphMotionDetector` processor emits events the associated IoT Hub with the following schema.

```json
//TODO
{
    "metadataVersion": "",
    "id": "guid",
    "eventType": "",
    "eventTime": "",
    "data": {
        "timestamp": "",
        "regions": [
            {
                "L": 0.0,
                "T": 0.0,
                "W": 0.0,
                "H": 0.0
            }
        ],
        "dataVersion": ""
    },
    "dataVersion": ""
}
```

## Sinks

### `Microsoft.Media.MediaGraphIoTHubSink`

This sink captures events emitted by the media graph and routes them to the IoT Hub associated with the IoT Edge host device.
_This sink is only available on the edge._

```json
{
    "$type": "Microsoft.Media.MediaGraphIoTHubSink",
    "name": "<reference for the sink to be used the config>",
    "inputs": [
        "<reference to event-generating components identified in the config>"
    ],
    "queueName": "output"
}
```

| Property      | Type             | Description
|:------------- |:---------------- |:-----------
| `name`        | string           | The name of the sink, used for referencing within the configuration.
| `queueName`   | ?                | ??? - Is this an identifer for a specific queue configured in the IoT Edge device

### `Microsoft.Media.MediaGraphDynamicArchiver`

This sink will write a clip to storage using a URL with a stored access signature (SAS).

```json
{
    "$type": "Microsoft.Media.MediaGraphDynamicArchiver",
    "name": "<reference for the sink to be used the config>",
    "inputs": [
        "<reference to a source identified in the config>"
    ],
    "primarySasUrl": "",
    "secondarySasUrl": "",
    "expirationTime": "",
    "archiveStartTime": "",
},
```

| Property           | Type             | Description
|:------------------ |:---------------- |:-----------
| `name`             | string           | The name of the sink, used for referencing within the configuration.
| `inputs`           | array of strings | The array contains the `name` values of configured sources.
| `primarySasUrl`    | url              | 
| `secondarySasUrl`  | url              | 
| `expirationTime`   | time             | When the SAS URL will expire.
| `archiveStartTime` | time             | When the SAS URL will expire.

### `Microsoft.Media.MediaGraphAssetSink`

| Property      | Type             | Description
|:------------- |:---------------- |:-----------
| `name`        | string           | The name of the sink, used for referencing within the configuration.
