---
title: Supported Spatial Analysis operations
description: This reference article details the different properties of the Spatial Analysis operations supported by Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: reference
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Supported Spatial Analysis operations

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Spatial Analysis enables the analysis of real-time streaming video from camera devices. For each camera device you configure, the operations will generate an output stream of JSON messages sent to Azure Video Analyzer. 

Video Analyzer implements the following Spatial Analysis operations: 

| Operation Identifier| Description|
|---------|---------|
| Microsoft.VideoAnalyzer.SpatialAnalysisPersonZoneCrossingOperation | Emits a _personZoneEnterExitEvent_ event when a person enters or exits the zone and provides directional info with the numbered side of the zone that was crossed. Emits a _personZoneDwellTimeEvent_ when the person exits the zone and provides directional info and the number of milliseconds the person spent inside the zone. |
| Microsoft.VideoAnalyzer.SpatialAnalysisPersonLineCrossingOperation | Tracks when a person crosses a designated line in the camera's field of view.  |
| Microsoft.VideoAnalyzer.SpatialAnalysisPersonDistanceOperation | Tracks when people violate a distance rule.  |
| Microsoft.VideoAnalyzer.SpatialAnalysisPersonCountOperation | Counts people in a designated zone in the camera's field of view. The zone must be fully covered by a single camera in order for PersonCount to record an accurate total.  |
| Microsoft.VideoAnalyzer.SpatialAnalysisCustomOperation | Generic operation that can be used to run all scenarios mentioned above. This option is more useful when you want to run multiple scenarios on the same camera or use system resources (for example, GPU) more efficiently. |



## Person Zone Crossing

**Operation Identifier**: `Microsoft.VideoAnalyzer.SpatialAnalysisPersonZoneCrossingOperation`

See an example of [Person Zone Crossing Operation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-zone-crossing-operation-topology.json) from our GitHub sample.

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zones`                     | list    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `name`                     | string  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `polygon`                   | string  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size. `threshold` float events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is `zonecrossing` and 16 when time is `DwellTime`. The specifies values are recommended in order to achieve maximum accuracy. |
| `eventType`                 | string  | For cognitiveservices.vision.spatialanalysis-personcrossingpolygon this should be `zonecrossing` or `zonedwelltime`.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `trigger`                   | string  | The type of trigger for sending an event. Supported Values: "event": fire when someone enters or exits the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `focus`                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| `threshold`                 | float   | Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 16. This is the recommended value to achieve maximum accuracy.                                                                                                |
| `enableFaceMaskClassifier`  | boolean | **true** to enable detecting people wearing face masks in the video stream, **false** to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| `detectorNodeConfiguration` | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `trackerNodeConfiguration` | string  | The TRACKER_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Orientation parameter settings

You can configure the orientation computation through DETECTOR_NODE_CONFIG parameter settings
```json
{
    "enable_orientation": true,
}

```
| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable_orientation`                     | bool    | Indicates whether you want to compute the orientation for the detected people or not. `enable_orientation` is set by default to True.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
### Speed parameter settings

You can configure the speed computation through TRACKER_NODE_CONFIG parameter settings
```json
{
    "enable_speed": true,
}

```
| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable_speed`                     | bool    | Indicates whether you want to compute the speed for the detected people or not. `enable_speed` is set by default to True. It is highly recommended that we enable both speed and orientation to have the best estimated values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### Output:

```json
{
  "body": {
    "timestamp": 147026846756730,
    "inferences": [
      {
        "type": "entity",
        "inferenceId": "8e8269c1a9584b3a8f16a3cd7a2cd45a",
        "entity": {
          "tag": {
            "value": "person",
            "confidence": 0.9511422
          },
          "box": {
            "l": 0.59845686,
            "t": 0.35958588,
            "w": 0.11951797,
            "h": 0.50172085
          }
        },
        "extensions": {
          "centerGroundPointY": "0.0",
          "footprintY": "inf",
          "centerGroundPointX": "0.0",
          "mappedImageOrientation": "inf",
          "groundOrientationAngle": "inf",
          "footprintX": "inf",
          "trackingId": "f54d4c8fb4f345a9afb944303b0f3b40",
          "speed": "0.0"
        }
      },
      {
        "type": "entity",
        "inferenceId": "c54c9f92dd0d442b8d1840756715a5c7",
        "entity": {
          "tag": {
            "value": "person",
            "confidence": 0.92762595
          },
          "box": {
            "l": 0.8098704,
            "t": 0.47707137,
            "w": 0.18019487,
            "h": 0.48659682
          }
        },
        "extensions": {
          "footprintY": "inf",
          "groundOrientationAngle": "inf",
          "trackingId": "a226eda9226e4ec9b39ebceb7c8c1f61",
          "mappedImageOrientation": "inf",
          "speed": "0.0",
          "centerGroundPointX": "0.0",
          "centerGroundPointY": "0.0",
          "footprintX": "inf"
        }
      },
      {
        "type": "event",
        "inferenceId": "aad2778756a94afd9055fdbb3a370d62",
        "relatedInferences": [
          "8e8269c1a9584b3a8f16a3cd7a2cd45a"
        ],
        "event": {
          "name": "personZoneEnterExitEvent",
          "properties": {
            "trackingId": "f54d4c8fb4f345a9afb944303b0f3b40",
            "zone": "retailstore",
            "status": "Enter"
          }
        }
      },
      {
        "type": "event",
        "inferenceId": "e30103d3af28485688d7c77bbe10b5b5",
        "relatedInferences": [
          "c54c9f92dd0d442b8d1840756715a5c7"
        ],
        "event": {
          "name": "personZoneEnterExitEvent",
          "properties": {
            "trackingId": "a226eda9226e4ec9b39ebceb7c8c1f61",
            "status": "Enter",
            "zone": "retailstore"
          }
        }
      }
    ]
  }
```

## Person Line Crossing

**Operation Identifier**: `Microsoft.VideoAnalyzer.SpatialAnalysisPersonLineCrossingOperation`

See an example of [Person Line Crossing Operation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-line-crossing-operation-topology.json) from our GitHub sample.

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                   |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lines`                     | list    | List of lines.                                                                                                                                                                                                                                                                |
| `name`                      | string  | Friendly name for this line.                                                                                                                                                                                                                                                  |
| `line`                      | string  | Each value pair represents the starting and ending point of the line. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size.                            |
| `start`                      | value pair  | x, y coordinates for line's starting point. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size.                            |
| `end`                      | value pair  | x, y coordinates for line's ending point. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size.                            |
| `type`                     | string  | This should be `linecrossing`. |
| `trigger`                     | string  | The type of trigger for sending an event. Supported Values: "event": fire when someone crosses the line.|
| `outputFrequency`           | int     | The rate at which events are egressed. When outputFrequency = X, every X event is egressed, ex. outputFrequency = 2 means every other event is output. The outputFrequency is applicable to both event and interval.                                                       |
| `focus`                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint. |
| `threshold`                 | float   | Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 16. This is the recommended value to achieve maximum accuracy.                                                                                                |
| `enableFaceMaskClassifier`  | boolean | **true** to enable detecting people wearing face masks in the video stream, **false** to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.          |
| `detectorNodeConfiguration` | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                      |
| `trackerNodeConfiguration` | string  | The TRACKER_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
#### Output:

```json
{
  "timestamp": 145666620394490,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "2d3c7c7d6c0f4af7916eb50944523bdf",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.38330078
        },
        "box": {
          "l": 0.5316645,
          "t": 0.28169397,
          "w": 0.045862257,
          "h": 0.1594377
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "trackingId": "ac4a79a29a67402ba447b7da95907453",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "2206088c80eb4990801f62c7050d142f",
      "relatedInferences": ["2d3c7c7d6c0f4af7916eb50944523bdf"],
      "event": {
        "name": "personLineEvent",
        "properties": {
          "trackingId": "ac4a79a29a67402ba447b7da95907453",
          "status": "CrossLeft",
          "zone": "door"
        }
      }
    }
  ]
}
```

## Person Distance

**Operation Identifier**: `Microsoft.VideoAnalyzer.SpatialAnalysisPersonDistanceOperation`

See an example of [Person Distance Operation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-distance-operation-topology.json) from our GitHub sample.

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zones`                     | list    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `name`                      | string  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `polygon`                   | string  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size. `threshold` float events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is `zonecrossing` and 16 when time is `DwellTime`. The specifies values are recommended in order to achieve maximum accuracy. |
| `trigger`           | string     | The type of trigger for sending an event. Supported values are event for sending events when the count changes or interval for sending events periodically, irrespective of whether the count has changed or not.                                                                                                                                                                                                                                                                                                                                                     |
| `focus`                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| `threshold`                | float   | Events are egressed when the person is greater than this number of pixels inside the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `outputFrequency`           | int     | The rate at which events are egressed. When outputFrequency = X, every X event is egressed, ex. outputFrequency = 2 means every other event is output. The outputFrequency is applicable to both event and interval.                                                                                                                                                                                                                                                                                                                                                     |
| `minimumDistanceThreshold`  | float   | A distance in feet that will trigger a "TooClose" event when people are less than that distance apart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `maximumDistanceThreshold`  | float   | A distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `aggregationMethod`         | string  | The method for aggregate `persondistance` result. The aggregationMethod is applicable to both mode and average.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `enableFaceMaskClassifier`  | boolean | **true** to enable detecting people wearing face masks in the video stream, **false** to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| `detectorNodeConfiguration` | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `trackerNodeConfiguration` | string  | The TRACKER_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
#### Output:

```json
{
  "timestamp": 145666613610297,
  "inferences": [
    {
      "type": "event",
      "inferenceId": "85a5fc4936294a3bac90b9c43876741a",
      "event": {
        "name": "personDistanceEvent",
        "properties": {
          "maximumDistanceThreshold": "14.5",
          "personCount": "0.0",
          "eventName": "Unknown",
          "zone": "door",
          "averageDistance": "0.0",
          "minimumDistanceThreshold": "1.5",
          "distanceViolationPersonCount": "0.0"
        }
      }
    }
  ]
}
```

## Person Count

**Operation Identifier**: `Microsoft.VideoAnalyzer.SpatialAnalysisPersonCountOperation`

See an example of [Person Count Operation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-count-operation-topology.json) from our GitHub sample.

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zones`                     | **list**    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `name`                      | **string**  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `polygon`                   | **string**  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top-left corner. To calculate the absolute x, y values, you multiply these values with the frame size. `threshold` float events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is `zonecrossing` and 16 when time is `DwellTime`. The specifies values are recommended in order to achieve maximum accuracy. |
| `outputFrequency`           | **int**     | The rate at which events are egressed. When outputFrequency = X, every X event is egressed, ex. outputFrequency = 2 means every other event is output. The outputFrequency is applicable to both event and interval.                                                                                                                                                                                                                                                                                                                                                     |
| `trigger`                   | **string**  | The type of trigger for sending an event. Supported values are event for sending events when the count changes or interval for sending events periodically, irrespective of whether the count has changed or not.                                                                                                                                                                                                                                                                                                                                                           |
| `focus`                     | **string**  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| `threshold`                 | **float**   | Events are egressed when the person is greater than this number of pixels inside the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `enableFaceMaskClassifier`  | **boolean** | **true** to enable detecting people wearing face masks in the video stream, **false** to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| `detectorNodeConfiguration` | **string**  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `trackerNodeConfiguration` | **string**  | The TRACKER_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
#### Output:

```json
{
  "timestamp": 145666599533564,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "5b8076753b8c47bba8c72a7e0f7c5cc0",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9458008
        },
        "box": {
          "l": 0.474487,
          "t": 0.26522297,
          "w": 0.066929355,
          "h": 0.2828749
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "fb309c9285f94f268378540b5fbbf5ad",
      "relatedInferences": ["5b8076753b8c47bba8c72a7e0f7c5cc0"],
      "event": {
        "name": "personCountEvent",
        "properties": {
          "personCount": "1.0",
          "zone": "demo"
        }
      }
    }
  ]
}
```

## Custom Operation

**Operation Identifier**: `Microsoft.VideoAnalyzer.SpatialAnalysisCustomOperation`

See an example of [Custom Operation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/custom-operation-topology.json) from our GitHub sample.

#### Parameters:

| Name                   | Type   | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| extensionConfiguration | string | JSON representation of the operation. |

#### Output:

```json
{
  "timestamp": 145666599533564,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "5b8076753b8c47bba8c72a7e0f7c5cc0",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9458008
        },
        "box": {
          "l": 0.474487,
          "t": 0.26522297,
          "w": 0.066929355,
          "h": 0.2828749
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "fb309c9285f94f268378540b5fbbf5ad",
      "relatedInferences": ["5b8076753b8c47bba8c72a7e0f7c5cc0"],
      "event": {
        "name": "personCountEvent",
        "properties": {
          "personCount": "1.0",
          "zone": "demo"
        }
      }
    }
  ]
}
```
