---
title: Spatial Analysis operations
titleSuffix: Azure AI services
description: The Spatial Analysis operations.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 02/02/2022
ms.author: pafarley
ms.custom: ignite-fall-2021
---

# Spatial Analysis operations

Spatial Analysis lets you analyze video streams from camera devices in real time. For each camera device you configure, the Spatial Analysis operations will generate an output stream of JSON messages sent to your instance of Azure IoT Hub. 

The Spatial Analysis container implements the following operations. You can configure these operations in the deployment manifest of your container.

| Operation Identifier| Description|
|---------|---------|
| cognitiveservices.vision.spatialanalysis-personcount | Counts people in a designated zone in the camera's field of view. The zone must be fully covered by a single camera in order for **PersonCount** to record an accurate total. <br> Emits an initial _personCountEvent_ event and then _personCountEvent_ events when the count changes.  |
| cognitiveservices.vision.spatialanalysis-personcrossingline | Tracks when a person crosses a designated line in the camera's field of view. <br>Emits a _personLineEvent_ event when the person crosses the line and provides directional info. 
| cognitiveservices.vision.spatialanalysis-personcrossingpolygon | Emits a _personZoneEnterExitEvent_ event when a person enters or exits the designated zone and provides directional info with the side of the zone that was crossed. Emits a _personZoneDwellTimeEvent_ when the person exits the zone and provides directional info as well as the number of milliseconds the person spent inside the zone. |
| cognitiveservices.vision.spatialanalysis-persondistance | Tracks when people violate a minimum-distance rule. <br> Emits a _personDistanceEvent_ periodically with the location of each distance violation. |
| cognitiveservices.vision.spatialanalysis | The generic operation, which can be used to run all scenarios mentioned above. This option is more useful when you want to run multiple scenarios on the same camera or use system resources (the GPU, for example) more efficiently. |

All of the above operations are also available in the `.debug` version of the service (for example, `cognitiveservices.vision.spatialanalysis-personcount.debug`). Debug has the capability to visualize video frames as they're being processed. You'll need to run `xhost +` on the host computer to enable the visualization of video frames and events.


> [!IMPORTANT]
> The Azure AI Vision AI models detect and locate human presence in video footage and output a bounding box around the human body. The AI models do not attempt to discover the identities or demographics of individuals.

## Operation parameters

The following are the parameters required by each of the Spatial Analysis operations.

| Operation parameters| Description|
|---------|---------|
| `Operation ID` | The Operation Identifier from table above.|
| `enabled` | Boolean: true or false|
| `VIDEO_URL`| The RTSP url for the camera device (Example: `rtsp://username:password@url`). Spatial Analysis supports H.264 encoded stream either through RTSP, http, or mp4. Video_URL can be provided as an obfuscated base64 string value using AES encryption, and if the video url is obfuscated then `KEY_ENV` and `IV_ENV` need to be provided as environment variables. Sample utility to generate keys and encryption can be found [here](/dotnet/api/system.security.cryptography.aesmanaged). |
| `VIDEO_SOURCE_ID` | A friendly name for the camera device or video stream. This will be returned with the event JSON output.|
| `VIDEO_IS_LIVE`| True for camera devices; false for recorded videos.|
| `VIDEO_DECODE_GPU_INDEX`| Which GPU to decode the video frame. By default it is 0. Should be the same as the `gpu_index` in other node config like `DETECTOR_NODE_CONFIG` and `CAMERACALIBRATOR_NODE_CONFIG`.|
| `INPUT_VIDEO_WIDTH` | Input video/stream's frame width (for example, 1920). This is an optional field and if provided, the frame will be scaled to this dimension while preserving the aspect ratio.|
| `DETECTOR_NODE_CONFIG` | JSON indicating which GPU to run the detector node on. It should be in the following format: `"{ \"gpu_index\": 0 }",`|
| `TRACKER_NODE_CONFIG` | JSON indicating whether to compute speed in the tracker node or not. It should be in the following format: `"{ \"enable_speed\": true }",`|
| `CAMERA_CONFIG` | JSON indicating the calibrated camera parameters for multiple cameras. If the skill you used requires calibration and you already have the camera parameter, you can use this config to provide them directly. Should be in the following format: `"{ \"cameras\": [{\"source_id\": \"endcomputer.0.persondistancegraph.detector+end_computer1\", \"camera_height\": 13.105561256408691, \"camera_focal_length\": 297.60003662109375, \"camera_tiltup_angle\": 0.9738943576812744}] }"`, the `source_id` is used to identify each camera. It can be gotten from the `source_info` of the event we published. It will only take effect when `do_calibration=false` in `DETECTOR_NODE_CONFIG`.|
| `CAMERACALIBRATOR_NODE_CONFIG` | JSON indicating which GPU to run the camera calibrator node on and whether to use calibration or not. It should be in the following format: `"{ \"gpu_index\": 0, \"do_calibration\": true, \"enable_orientation\": true}",`|
| `CALIBRATION_CONFIG` | JSON indicating parameters to control how the camera calibration works. It should be in the following format: `"{\"enable_recalibration\": true, \"quality_check_frequency_seconds\": 86400}",`|
| `SPACEANALYTICS_CONFIG` | JSON configuration for zone and line as outlined below.|
| `ENABLE_FACE_MASK_CLASSIFIER` | `True` to enable detecting people wearing face masks in the video stream, `False` to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 `"INPUT_VIDEO_WIDTH": 1920`. The face mask attribute won't be returned if detected people aren't facing the camera or are too far from it. For more information, see the [camera placement](spatial-analysis-camera-placement.md). |
| `STATIONARY_TARGET_REMOVER_CONFIG` | JSON indicating the parameters for stationary target removal, which adds the capability to learn and ignore long-term stationary false positive targets such as mannequins or people in pictures. Configuration should be in the following format: `"{\"enable\": true, \"bbox_dist_threshold-in_pixels\": 5, \"buffer_length_in_seconds\": 3600, \"filter_ratio\": 0.2 }"`|

### Detector node parameter settings

The following is an example of the `DETECTOR_NODE_CONFIG` parameters for all Spatial Analysis operations.

```json
{
"gpu_index": 0,
"enable_breakpad": false
}
```

| Name | Type| Description|
|---------|---------|---------|
| `gpu_index` | string| The GPU index on which this operation will run.|
| `enable_breakpad`| bool | Indicates whether to enable breakpad, which is used to generate a crash dump for debug use. It is `false` by default. If you set it to `true`, you also need to add `"CapAdd": ["SYS_PTRACE"]` in the `HostConfig` part of container `createOptions`. By default, the crash dump is uploaded to the [RealTimePersonTracking](https://appcenter.ms/orgs/Microsoft-Organization/apps/RealTimePersonTracking/crashes/errors?version=&appBuild=&period=last90Days&status=&errorType=all&sortCol=lastError&sortDir=desc) AppCenter app, if you want the crash dumps to be uploaded to your own AppCenter app, you can override the environment variable `RTPT_APPCENTER_APP_SECRET` with your app's app secret.|

### Camera calibration node parameter settings
The following is an example of the `CAMERACALIBRATOR_NODE_CONFIG` parameters for all spatial analysis operations.

```json
{
  "gpu_index": 0,
  "do_calibration": true,
  "enable_breakpad": false,
  "enable_orientation": true
}
```

| Name | Type | Description |
|---------|---------|---------|
| `do_calibration` | string | Indicates that calibration is turned on. `do_calibration` must be true for **cognitiveservices.vision.spatialanalysis-persondistance** to function properly. `do_calibration` is set by default to `True`. |
| `enable_breakpad`| bool | Indicates whether to enable breakpad, which is used to generate a crash dump for debug use. It is `false` by default. If you set it to `true`, you also need to add `"CapAdd": ["SYS_PTRACE"]` in the `HostConfig` part of container `createOptions`. By default, the crash dump is uploaded to the [RealTimePersonTracking](https://appcenter.ms/orgs/Microsoft-Organization/apps/RealTimePersonTracking/crashes/errors?version=&appBuild=&period=last90Days&status=&errorType=all&sortCol=lastError&sortDir=desc) AppCenter app, if you want the crash dumps to be uploaded to your own AppCenter app, you can override the environment variable `RTPT_APPCENTER_APP_SECRET` with your app's app secret.
| `enable_orientation` | bool | Indicates whether you want to compute the orientation for the detected people or not. `enable_orientation` is set by default to `True`. |

### Calibration config

This is an example of the `CALIBRATION_CONFIG` parameters for all spatial analysis operations.

```json
{
  "enable_recalibration": true,
  "calibration_quality_check_frequency_seconds": 86400,
  "calibration_quality_check_sample_collect_frequency_seconds": 300,
  "calibration_quality_check_one_round_sample_collect_num": 10,
  "calibration_quality_check_queue_max_size": 1000,
  "calibration_event_frequency_seconds": -1
}
```

| Name | Type| Description|
|---------|---------|---------|
| `enable_recalibration` | bool | Indicates whether automatic recalibration is turned on. Default is `true`.|
| `calibration_quality_check_frequency_seconds` | int | Minimum number of seconds between each quality check to determine whether or not recalibration is needed. Default is `86400` (24 hours). Only used when `enable_recalibration=True`.|
| `calibration_quality_check_sample_collect_frequency_seconds` | int | Minimum number of seconds between collecting new data samples for recalibration and quality checking. Default is `300` (5 minutes). Only used when `enable_recalibration=True`.|
| `calibration_quality_check_one_round_sample_collect_num` | int | Minimum number of new data samples to collect per round of sample collection. Default is `10`. Only used when `enable_recalibration=True`.|
| `calibration_quality_check_queue_max_size` | int | Maximum number of data samples to store when camera model is calibrated. Default is `1000`. Only used when `enable_recalibration=True`.|
| `calibration_event_frequency_seconds` | int | Output frequency (seconds) of camera calibration events. A value of `-1` indicates that the camera calibration shouldn't be sent unless the camera calibration info has been changed. Default is `-1`.|

### Camera calibration output

The following is an example of the output from camera calibration if enabled. Ellipses indicate more of the same type of objects in a list.

```json
{
  "type": "cameraCalibrationEvent",
  "sourceInfo": {
    "id": "camera1",
    "timestamp": "2021-04-20T21:15:59.100Z",
    "width": 512,
    "height": 288,
    "frameId": 531,
    "cameraCalibrationInfo": {
      "status": "Calibrated",
      "cameraHeight": 13.294151306152344,
      "focalLength": 372.0000305175781,
      "tiltupAngle": 0.9581864476203918,
      "lastCalibratedTime": "2021-04-20T21:15:59.058"
    }
  },
  "zonePlacementInfo": {
    "optimalZoneRegion": {
      "type": "POLYGON",
       "points": [
        {
          "x": 0.8403755868544601,
          "y": 0.5515320334261838
        },
        {
          "x": 0.15805946791862285,
          "y": 0.5487465181058496
        }
      ],
      "name": "optimal_zone_region"
    },
    "fairZoneRegion": {
      "type": "POLYGON",
      "points": [
        {
          "x": 0.7871674491392802,
          "y": 0.7437325905292479
        },
        {
          "x": 0.22065727699530516,
          "y": 0.7325905292479109
        }
      ],
      "name": "fair_zone_region"
    },
    "uniformlySpacedPersonBoundingBoxes": [
      {
        "type": "RECTANGLE",
        "points": [
          {
            "x": 0.0297339593114241,
            "y": 0.0807799442896936
          },
          {
            "x": 0.10015649452269171,
            "y": 0.2757660167130919
          }
        ]
      }
    ],
    "personBoundingBoxGroundPoints": [
      {
        "x": -22.944068908691406,
        "y": 31.487680435180664
      }
    ]
  }
}
```

See [Spatial analysis operation output](#spatial-analysis-operation-output) for details on `source_info`.

| ZonePlacementInfo Field Name | Type| Description|
|---------|---------|---------|
| `optimalZonePolygon` | object| A polygon in the camera image where lines or zones for your operations can be placed for optimal results. <br/> Each value pair represents the x,y for vertices of a polygon. The polygon represents the areas in which people are tracked or counted and polygon points are based on normalized coordinates (0-1), where the top left corner is (0.0, 0.0) and the bottom right corner is (1.0, 1.0).|
| `fairZonePolygon` | object| A polygon in the camera image where lines or zones for your operations can be placed for good, but possibly not optimal, results. <br/> See `optimalZonePolygon` above for an in-depth explanation of the contents. |
| `uniformlySpacedPersonBoundingBoxes` | list | A list of bounding boxes of people within the camera image distributed uniformly in real space. Values are based on normalized coordinates (0-1).|
| `personBoundingBoxGroundPoints` | list | A list of coordinates on the floor plane relative to the camera. Each coordinate corresponds to the bottom right of the bounding box in `uniformlySpacedPersonBoundingBoxes` with the same index. <br/> See the `centerGroundPointX/centerGroundPointY` fields under the [JSON format for cognitiveservices.vision.spatialanalysis-persondistance AI Insights](#json-format-for-cognitiveservicesvisionspatialanalysis-persondistance-ai-insights) section for more details on how coordinates on the floor plane are calculated. |

Example of the zone placement info output visualized on a video frame:
![Zone placement info visualization](./media/spatial-analysis/zone-placement-info-visualization.png)

The zone placement info provides suggestions for your configurations, but the guidelines in [Camera configuration](#camera-configuration) must still be followed for best results.

### Tracker node parameter settings
You can configure the speed computation through the tracker node parameter settings.
```
{
"enable_speed": true,
"remove_stationary_objects": true,
"stationary_objects_dist_threshold_in_pixels": 5,
"stationary_objects_buffer_length_in_seconds": 3600,
"stationary_objects_filter_ratio": 0.2
}
```
| Name | Type| Description|
|---------|---------|---------|
| `enable_speed` | bool | Indicates whether you want to compute the speed for the detected people or not. `enable_speed` is set by default to `True`. It is highly recommended that you enable both speed and orientation to have the best estimated values. |
| `remove_stationary_objects` | bool | Indicates whether you want to remove stationary objects. `remove_stationary_objects` is set by default to True. |
| `stationary_objects_dist_threshold_in_pixels` | int | The neighborhood distance threshold to decide whether two detection boxes can be treated as the same detection. `stationary_objects_dist_threshold_in_pixels` is set by default to 5. |
| `stationary_objects_buffer_length_in_seconds` | int | The minimum length of time in seconds that the system has to look back to decide whether a target is a stationary target or not. `stationary_objects_buffer_length_in_seconds` is set by default to 3600. |
| `stationary_objects_filter_ratio` | float | If a target is repeatedly detected at the same location (defined in `stationary_objects_dist_threshold_in_pixels`) for greater `stationary_objects_filter_ratio` (0.2 means 20%) of the `stationary_objects_buffer_length_in_seconds` time interval, it will be treated as a stationary target. `stationary_objects_filter_ratio` is set by default to 0.2. |

## Spatial Analysis operations configuration and output

### Zone configuration for cognitiveservices.vision.spatialanalysis-personcount

The following is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a zone. You may configure multiple zones for this operation.

```json
{
  "zones": [
    {
      "name": "lobbycamera",
      "polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
      "events": [
        {
          "type": "count",
          "config": {
            "trigger": "event",
            "focus": "footprint"
          }
        }
      ]
    }
  ]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones. |
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of a polygon. The polygon represents the areas in which people are tracked or counted. Polygon points are based on normalized coordinates (0-1), where the top left corner is (0.0, 0.0) and the bottom right corner is (1.0, 1.0).   
| `threshold` | float| Events are egressed when the person is greater than this number of pixels inside the zone. This is an optional field and value is in ratio (0-1). For example, value 0.0253 will be 13 pixels on a video with image width = 512 (0.0253 X 512 = ~13).|
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcount**, this should be `count`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `output_frequency` | int | The rate at which events are egressed. When `output_frequency` = X, every X event is egressed, ex. `output_frequency` = 2 means every other event is output. The `output_frequency` is applicable to both `event` and `interval`. |
| `focus` | string| The point location within person's bounding box used to calculate events. Focus's value can be `footprint` (the footprint of person), `bottom_center` (the bottom center of person's bounding box), `center` (the center of person's bounding box).|

### Line configuration for cognitiveservices.vision.spatialanalysis-personcrossingline

The following is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a line. You may configure multiple crossing lines for this operation.

```json
{
   "lines": [
       {
           "name": "doorcamera",
           "line": {
               "start": {
                   "x": 0,
                   "y": 0.5
               },
               "end": {
                   "x": 1,
                   "y": 0.5
               }
           },
           "events": [
               {
                   "type": "linecrossing",
                   "config": {
                       "trigger": "event",
                       "focus": "footprint"
                   }
               }
           ]
       }
   ]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `lines` | list| List of lines.|
| `name` | string| Friendly name for this line.|
| `line` | list| The definition of the line. This is a directional line allowing you to understand "entry" vs. "exit".|
| `start` | value pair| x, y coordinates for line's starting point. The float values represent the position of the vertex relative to the top left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `end` | value pair| x, y coordinates for line's ending point. The float values represent the position of the vertex relative to the top left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `threshold` | float| Events are egressed when the person is greater than this number of pixels inside the zone. This is an optional field and value is in ratio (0-1). For example, value 0.0253 will be 13 pixels on a video with image width = 512 (0.0253 X 512 = ~13).|
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcrossingline**, this should be `linecrossing`.|
|`trigger`|string|The type of trigger for sending an event.<br>Supported Values: "event": fire when someone crosses the line.|
| `focus` | string| The point location within person's bounding box used to calculate events. Focus's value can be `footprint` (the footprint of person), `bottom_center` (the bottom center of person's bounding box), `center` (the center of person's bounding box). The default value is footprint.|

### Zone configuration for cognitiveservices.vision.spatialanalysis-personcrossingpolygon

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a zone. You may configure multiple zones for this operation.

```json
{
"zones":[
   {
       "name": "queuecamera",
       "polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
       "events":[{
           "type": "zonecrossing",
           "config":{
               "trigger": "event",
               "focus": "footprint"
               }
           }]
   },
   {
       "name": "queuecamera1",
       "polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
       "events":[{
           "type": "zonedwelltime",
           "config":{
               "trigger": "event",
               "focus": "footprint"
               }
           }]
   }]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones. |
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `target_side` | int| Specifies a side of the zone defined by `polygon` to measure how long people face that side while in the zone. 'dwellTimeForTargetSide' will output that estimated time. Each side is a numbered edge between the two vertices of the polygon that represents your zone. For example, the edge between the first two vertices of the polygon represents the first side, 'side'=1. The value of `target_side` is between `[0,N-1]` where `N` is the number of sides of the `polygon`. This is an optional field.  |
| `threshold` | float| Events are egressed when the person is greater than this number of pixels inside the zone. This is an optional field and value is in ratio (0-1). For example, value 0.074 will be 38 pixels on a video with image width = 512 (0.074 X 512 = ~38).|
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcrossingpolygon** this should be `zonecrossing` or `zonedwelltime`.|
| `trigger`|string|The type of trigger for sending an event<br>Supported Values: "event": fire when someone enters or exits the zone.|
| `focus` | string| The point location within person's bounding box used to calculate events. Focus's value can be `footprint` (the footprint of person), `bottom_center` (the bottom center of person's bounding box), `center` (the center of person's bounding box). The default value is footprint.|

### Zone configuration for cognitiveservices.vision.spatialanalysis-persondistance

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a zone for **cognitiveservices.vision.spatialanalysis-persondistance**. You may configure multiple zones for this operation.

```json
{
"zones":[{
   "name": "lobbycamera",
   "polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
   "events":[{
       "type": "persondistance",
       "config":{
           "trigger": "event",
           "output_frequency":1,
           "minimum_distance_threshold":6.0,
           "maximum_distance_threshold":35.0,
           "aggregation_method": "average",
           "focus": "footprint"
          }
          }]
   }]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones. |
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are counted and the distance between people is measured. The float values represent the position of the vertex relative to the top left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the person is greater than this number of pixels inside the zone. This is an optional field and value is in ratio (0-1). For example, value 0.0253 will be 13 pixels on a video with image width = 512 (0.0253 X 512 = ~13).|
| `type` | string| For **cognitiveservices.vision.spatialanalysis-persondistance**, this should be `persondistance`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `output_frequency` | int | The rate at which events are egressed. When `output_frequency` = X, every X event is egressed, ex. `output_frequency` = 2 means every other event is output. The `output_frequency` is applicable to both `event` and `interval`.|
| `minimum_distance_threshold` | float| A distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximum_distance_threshold` | float| A distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.|
| `aggregation_method` | string| The method for aggregate `persondistance` result. The aggregation_method is applicable to both `mode` and `average`.|
| `focus` | string| The point location within person's bounding box used to calculate events. Focus's value can be `footprint` (the footprint of person), `bottom_center` (the bottom center of person's bounding box), `center` (the center of person's bounding box).|

### Configuration for cognitiveservices.vision.spatialanalysis
The following is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a line and zone for **cognitiveservices.vision.spatialanalysis**. You may configure multiple lines/zones for this operation and each line/zone can have different events.

```json
{
  "lines": [
    {
      "name": "doorcamera",
      "line": {
        "start": {
          "x": 0,
          "y": 0.5
        },
        "end": {
          "x": 1,
          "y": 0.5
        }
      },
      "events": [
        {
          "type": "linecrossing",
          "config": {
            "trigger": "event",
            "focus": "footprint"
          }
        }
      ]
    }
  ],
  "zones": [
    {
      "name": "lobbycamera",
      "polygon": [[0.3, 0.3],[0.3, 0.9],[0.6, 0.9],[0.6, 0.3],[0.3, 0.3]],
      "events": [
        {
          "type": "persondistance",
          "config": {
            "trigger": "event",
            "output_frequency": 1,
            "minimum_distance_threshold": 6.0,
            "maximum_distance_threshold": 35.0,
            "focus": "footprint"
          }
        },
        {
          "type": "count",
          "config": {
            "trigger": "event",
            "output_frequency": 1,
            "focus": "footprint"
          }
        },
        {
          "type": "zonecrossing",
          "config": {
            "focus": "footprint"
          }
        },
        {
          "type": "zonedwelltime",
          "config": {
            "focus": "footprint"
          }
        }
      ]
    }
  ]
}
```

## Camera configuration

See the [camera placement](spatial-analysis-camera-placement.md) guidelines to learn about more about how to configure zones and lines.

## Spatial Analysis operation output

The events from each operation are egressed to Azure IoT Hub on JSON format.

### JSON format for cognitiveservices.vision.spatialanalysis-personcount AI Insights

Sample JSON for an event output by this operation.

```json
{
    "events": [
        {
            "id": "b013c2059577418caa826844223bb50b",
            "type": "personCountEvent",
            "detectionIds": [
                "bc796b0fc2534bc59f13138af3dd7027",
                "60add228e5274158897c135905b5a019"
            ],
            "properties": {
                "personCount": 2
            },
            "zone": "lobbycamera",
            "trigger": "event"
        }
    ],
    "sourceInfo": {
        "id": "camera_id",
        "timestamp": "2020-08-24T06:06:57.224Z",
        "width": 608,
        "height": 342,
        "frameId": "1400",
        "cameraCalibrationInfo": {
            "status": "Calibrated",
            "cameraHeight": 10.306597709655762,
            "focalLength": 385.3199462890625,
            "tiltupAngle": 1.0969393253326416
        },
        "imagePath": ""
    },
    "detections": [
        {
            "type": "person",
            "id": "bc796b0fc2534bc59f13138af3dd7027",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.612683747944079,
                        "y": 0.25340268765276636
                    },
                    {
                        "x": 0.7185954043739721,
                        "y": 0.6425260577285499
                    }
                ]
            },
            "confidence": 0.9559211134910583,
            "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "0.0",
		"groundOrientationAngle": "1.3",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            },
           "attributes": [
                {
                    "label": "face_mask",
                    "confidence": 0.99,
                    "task": ""
                }
            ]
        },
        {
            "type": "person",
            "id": "60add228e5274158897c135905b5a019",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.22326200886776573,
                        "y": 0.17830915618361087
                    },
                    {
                        "x": 0.34922296122500773,
                        "y": 0.6297955429344847
                    }
                ]
            },
            "confidence": 0.9389744400978088,
             "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "18.635927200317383",
		"groundOrientationAngle": "1.3",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            },
           "attributes": [
                {
                    "label": "face_mask",
                    "confidence": 0.99,
                    "task": ""
                }
            ]
       }
    ],
    "schemaVersion": "2.0"
}
```

| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event ID|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `zone` | string | The "name" field of the polygon that represents the zone that was crossed|
| `trigger` | string| The trigger type is 'event' or 'interval' depending on the value of `trigger` in SPACEANALYTICS_CONFIG|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection ID|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|
| `attributes` | array| Array of attributes. Each attribute consists of label, task, and confidence |
| `label` | string| The attribute value (for example, `{label: face_mask}` indicates the detected person is wearing a face mask) |
| `confidence (attribute)` | float| The attribute confidence value with range of 0 to 1 (for example, `{confidence: 0.9, label: face_nomask}` indicates the detected person is *not* wearing a face mask) |
| `task` | string | The attribute classification task/class |


| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera ID|
| `timestamp` | date| UTC date when the JSON payload was emitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|
| `cameraCallibrationInfo` | collection | Collection of values|
| `status` | string | The status of the calibration in the format of `state[;progress description]`. The state can be `Calibrating`, `Recalibrating` (if recalibration is enabled), or `Calibrated`. The progress description part is only valid when it is in `Calibrating` and `Recalibrating` state, which is used to show the progress of current calibration process.|
| `cameraHeight` | float | The height of the camera above the ground in feet. This is inferred from autocalibration. |
| `focalLength` | float | The focal length of the camera in pixels. This is inferred from autocalibration. |
| `tiltUpAngle` | float | The camera tilt angle from vertical. This is inferred from autocalibration.|


### JSON format for cognitiveservices.vision.spatialanalysis-personcrossingline AI Insights

Sample JSON for detections output by this operation.

```json
{
    "events": [
        {
            "id": "3733eb36935e4d73800a9cf36185d5a2",
            "type": "personLineEvent",
            "detectionIds": [
                "90d55bfc64c54bfd98226697ad8445ca"
            ],
            "properties": {
                "trackingId": "90d55bfc64c54bfd98226697ad8445ca",
                "status": "CrossLeft"
            },
            "zone": "doorcamera"
        }
    ],
    "sourceInfo": {
        "id": "camera_id",
        "timestamp": "2020-08-24T06:06:53.261Z",
        "width": 608,
        "height": 342,
        "frameId": "1340",
        "imagePath": ""
    },
    "detections": [
        {
            "type": "person",
            "id": "90d55bfc64c54bfd98226697ad8445ca",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.491627341822574,
                        "y": 0.2385801348769874
                    },
                    {
                        "x": 0.588894994635331,
                        "y": 0.6395559924387793
                    }
                ]
            },
            "confidence": 0.9005028605461121,
            "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "18.635927200317383",
		"groundOrientationAngle": "1.3",
                "trackingId": "90d55bfc64c54bfd98226697ad8445ca",
                "speed": "1.2",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            },
           "attributes": [
                {
                    "label": "face_mask",
                    "confidence": 0.99,
                    "task": ""
                }
            ]
        }
    ],
    "schemaVersion": "2.0"
}
```
| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event ID|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `status` | string| Direction of line crossings, either 'CrossLeft' or 'CrossRight'. Direction is based on imagining standing at the "start" facing the "end" of the line. CrossRight is crossing from left to right. CrossLeft is crossing from right to left.|
| `orientationDirection` | string| The orientation direction of the detected person after crossing the line. The value can be 'Left', 'Right, or 'Straight'. This value is output if `enable_orientation` is set to `True` in `CAMERACALIBRATOR_NODE_CONFIG` |
| `zone` | string | The "name" field of the line that was crossed|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection ID|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `groundOrientationAngle` | float| The clockwise radian angle of the person's orientation on the inferred ground plane |
| `mappedImageOrientation` | float| The projected clockwise radian angle of the person's orientation on the 2D image space |
| `speed` | float| The estimated speed of the detected person. The unit is `foot per second (ft/s)`|
| `confidence` | float| Algorithm confidence|
| `attributes` | array| Array of attributes. Each attribute consists of label, task, and confidence |
| `label` | string| The attribute value (for example, `{label: face_mask}` indicates the detected person is wearing a face mask) |
| `confidence (attribute)` | float| The attribute confidence value with range of 0 to 1 (for example, `{confidence: 0.9, label: face_nomask}` indicates the detected person is *not* wearing a face mask) |
| `task` | string | The attribute classification task/class |

| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera ID|
| `timestamp` | date| UTC date when the JSON payload was emitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|


> [!IMPORTANT]
> The AI model detects a person irrespective of whether the person is facing towards or away from the camera. The AI model doesn't run face recognition and doesn't emit any biometric information. 

### JSON format for cognitiveservices.vision.spatialanalysis-personcrossingpolygon AI Insights

Sample JSON for detections output by this operation with `zonecrossing` type SPACEANALYTICS_CONFIG.

```json
{
    "events": [
        {
            "id": "f095d6fe8cfb4ffaa8c934882fb257a5",
            "type": "personZoneEnterExitEvent",
            "detectionIds": [
                "afcc2e2a32a6480288e24381f9c5d00e"
            ],
            "properties": {
                "trackingId": "afcc2e2a32a6480288e24381f9c5d00e",
                "status": "Enter",
                "side": "1"
            },
            "zone": "queuecamera"
        }
    ],
    "sourceInfo": {
        "id": "camera_id",
        "timestamp": "2020-08-24T06:15:09.680Z",
        "width": 608,
        "height": 342,
        "frameId": "428",
        "imagePath": ""
    },
    "detections": [
        {
            "type": "person",
            "id": "afcc2e2a32a6480288e24381f9c5d00e",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.8135572734631991,
                        "y": 0.6653949670624315
                    },
                    {
                        "x": 0.9937645761590255,
                        "y": 0.9925406829655519
                    }
                ]
            },
            "confidence": 0.6267998814582825,
            "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "18.635927200317383",
		"groundOrientationAngle": "1.3",
                "trackingId": "afcc2e2a32a6480288e24381f9c5d00e",
                "speed": "1.2",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            },
           "attributes": [
		{
		    "label": "face_mask",
		    "confidence": 0.99,
		    "task": ""
		}
            ]
	}
    ],
    "schemaVersion": "2.0"
}
```

Sample JSON for detections output by this operation with `zonedwelltime` type SPACEANALYTICS_CONFIG.

```json
{
    "events": [
        {
            "id": "f095d6fe8cfb4ffaa8c934882fb257a5",
            "type": "personZoneDwellTimeEvent",
            "detectionIds": [
                "afcc2e2a32a6480288e24381f9c5d00e"
            ],
            "properties": {
                "trackingId": "afcc2e2a32a6480288e24381f9c5d00e",
                "status": "Exit",
                "side": "1",
	        "dwellTime": 7132.0,
	        "dwellFrames": 20            
            },
            "zone": "queuecamera"
        }
    ],
    "sourceInfo": {
        "id": "camera_id",
        "timestamp": "2020-08-24T06:15:09.680Z",
        "width": 608,
        "height": 342,
        "frameId": "428",
        "imagePath": ""
    },
    "detections": [
        {
            "type": "person",
            "id": "afcc2e2a32a6480288e24381f9c5d00e",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.8135572734631991,
                        "y": 0.6653949670624315
                    },
                    {
                        "x": 0.9937645761590255,
                        "y": 0.9925406829655519
                    }
                ]
            },
            "confidence": 0.6267998814582825,
	    "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "18.635927200317383",
		"groundOrientationAngle": "1.2",
		"mappedImageOrientation": "0.3",
		"speed": "1.2",
		 "trackingId": "afcc2e2a32a6480288e24381f9c5d00e",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            }
        }
    ],
    "schemaVersion": "2.0"
}
```

| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event ID|
| `type` | string| Event type. The value can be either _personZoneDwellTimeEvent_ or _personZoneEnterExitEvent_|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `status` | string| Direction of polygon crossings, either 'Enter' or 'Exit'|
| `side` | int| The number of the side of the polygon that the person crossed. Each side is a numbered edge between the two vertices of the polygon that represents your zone. The edge between the first two vertices of the polygon represents first side. 'Side' is empty when the event isn't associated with a specific side due to occlusion. For example, an exit occurred when a person disappeared but wasn't seen crossing a side of the zone, or an enter occurred when a person appeared in the zone but wasn't seen crossing a side.|
| `dwellTime` | float | The number of milliseconds that represent the time the person spent in the zone. This field is provided when the event type is personZoneDwellTimeEvent|
| `dwellFrames` | int | The number of frames that the person spent in the zone. This field is provided when the event type is personZoneDwellTimeEvent|
| `dwellTimeForTargetSide` | float | The number of milliseconds that represent the time the person spent in the zone and were facing to the `target_side`. This field is provided when `enable_orientation` is `True` in `CAMERACALIBRATOR_NODE_CONFIG ` and the value of `target_side` is set in `SPACEANALYTICS_CONFIG`|
| `avgSpeed` | float| The average speed of the person in the zone. The unit is `foot per second (ft/s)`|
| `minSpeed` | float| The minimum speed of the person in the zone. The unit is `foot per second (ft/s)`|
| `zone` | string | The "name" field of the polygon that represents the zone that was crossed|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection ID|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `groundOrientationAngle` | float| The clockwise radian angle of the person's orientation on the inferred ground plane |
| `mappedImageOrientation` | float| The projected clockwise radian angle of the person's orientation on the 2D image space |
| `speed` | float| The estimated speed of the detected person. The unit is `foot per second (ft/s)`|
| `confidence` | float| Algorithm confidence|
| `attributes` | array| Array of attributes. Each attribute consists of label, task, and confidence |
| `label` | string| The attribute value (for example, `{label: face_mask}` indicates the detected person is wearing a face mask) |
| `confidence (attribute)` | float| The attribute confidence value with range of 0 to 1 (for example, `{confidence: 0.9, label: face_nomask}` indicates the detected person is *not* wearing a face mask) |
| `task` | string | The attribute classification task/class |

### JSON format for cognitiveservices.vision.spatialanalysis-persondistance AI Insights

Sample JSON for detections output by this operation.

```json
{
    "events": [
        {
            "id": "9c15619926ef417aa93c1faf00717d36",
            "type": "personDistanceEvent",
            "detectionIds": [
                "9037c65fa3b74070869ee5110fcd23ca",
                "7ad7f43fd1a64971ae1a30dbeeffc38a"
            ],
            "properties": {
                "personCount": 5,
                "averageDistance": 20.807043981552123,
                "minimumDistanceThreshold": 6.0,
                "maximumDistanceThreshold": "Infinity",
                "eventName": "TooClose",
                "distanceViolationPersonCount": 2
            },
            "zone": "lobbycamera",
            "trigger": "event"
        }
    ],
    "sourceInfo": {
        "id": "camera_id",
        "timestamp": "2020-08-24T06:17:25.309Z",
        "width": 608,
        "height": 342,
        "frameId": "1199",
        "cameraCalibrationInfo": {
            "status": "Calibrated",
            "cameraHeight": 12.9940824508667,
            "focalLength": 401.2800598144531,
            "tiltupAngle": 1.057669997215271
        },
        "imagePath": ""
    },
    "detections": [
        {
            "type": "person",
            "id": "9037c65fa3b74070869ee5110fcd23ca",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.39988183975219727,
                        "y": 0.2719132942065858
                    },
                    {
                        "x": 0.5051516984638414,
                        "y": 0.6488402517218339
                    }
                ]
            },
            "confidence": 0.948630690574646,
	    "metadata": {
                "centerGroundPointX": "-1.4638760089874268",
                "centerGroundPointY": "18.29732322692871",
		"groundOrientationAngle": "1.3",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            }
        },
        {
            "type": "person",
            "id": "7ad7f43fd1a64971ae1a30dbeeffc38a",
            "region": {
                "type": "RECTANGLE",
                "points": [
                    {
                        "x": 0.5200299714740954,
                        "y": 0.2875368218672903
                    },
                    {
                        "x": 0.6457497446160567,
                        "y": 0.6183311060855263
                    }
                ]
            },
            "confidence": 0.8235412240028381,
            "metadata": {
                "centerGroundPointX": "2.6310102939605713",
                "centerGroundPointY": "18.635927200317383",
		"groundOrientationAngle": "1.3",
                "footprintX": "0.7306610584259033",
                "footprintY": "0.8814966493381893"
            }
        }
    ],
    "schemaVersion": "2.0"
}
```

| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event ID|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `personCount` | int| Number of people detected when the event was emitted|
| `averageDistance` | float| The average distance between all detected people in feet|
| `minimumDistanceThreshold` | float| The distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximumDistanceThreshold` | float| The distance in feet that will trigger a "TooFar" event when people are greater than distance apart.|
| `eventName` | string| Event name is `TooClose` with the `minimumDistanceThreshold` is violated, `TooFar` when `maximumDistanceThreshold` is violated, or `unknown` when autocalibration hasn't completed|
| `distanceViolationPersonCount` | int| Number of people detected in violation of `minimumDistanceThreshold` or `maximumDistanceThreshold`|
| `zone` | string | The "name" field of the polygon that represents the zone that was monitored for distancing between people|
| `trigger` | string| The trigger type is 'event' or 'interval' depending on the value of `trigger` in SPACEANALYTICS_CONFIG|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection ID|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|
| `centerGroundPointX/centerGroundPointY` | 2 float values| `x`, `y` values with the coordinates of the person's inferred location on the ground in feet. `x` and `y` are coordinates on the floor plane, assuming the floor is level. The camera's location is the origin. |

In `centerGroundPoint`, `x` is the component of distance from the camera to the person that is perpendicular to the camera image plane. `y` is the component of distance that is parallel to the camera image plane. 

![Example center ground point](./media/spatial-analysis/x-y-chart.png) 

In this example, `centerGroundPoint` is `{centerGroundPointX: 4, centerGroundPointY: 5}`. This means there's a person four feet ahead of the camera and five feet to the right, looking at the room top-down.


| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera ID|
| `timestamp` | date| UTC date when the JSON payload was emitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|
| `cameraCallibrationInfo` | collection | Collection of values|
| `status` | string | The status of the calibration in the format of `state[;progress description]`. The state can be `Calibrating`, `Recalibrating` (if recalibration is enabled), or `Calibrated`. The progress description part is only valid when it is in `Calibrating` and `Recalibrating` state, which is used to show the progress of current calibration process.|
| `cameraHeight` | float | The height of the camera above the ground in feet. This is inferred from autocalibration. |
| `focalLength` | float | The focal length of the camera in pixels. This is inferred from autocalibration. |
| `tiltUpAngle` | float | The camera tilt angle from vertical. This is inferred from autocalibration.|

### JSON format for cognitiveservices.vision.spatialanalysis AI Insights

Output of this operation depends on configured `events`, for example if there's a `zonecrossing` event configured for this operation then output will be same as `cognitiveservices.vision.spatialanalysis-personcrossingpolygon`.

## Use the output generated by the container

You may want to integrate Spatial Analysis detection or events into your application. Here are a few approaches to consider: 

* Use the Azure Event Hubs SDK for your chosen programming language to connect to the Azure IoT Hub endpoint and receive the events. For more information, see [Read device-to-cloud messages from the built-in endpoint](../../iot-hub/iot-hub-devguide-messages-read-builtin.md). 
* Set up **Message Routing** on your Azure IoT Hub to send the events to other endpoints or save the events to your data storage. For more information, see [IoT Hub Message Routing](../../iot-hub/iot-hub-devguide-messages-d2c.md). 
* Set up an Azure Stream Analytics job to process the events in real-time as they arrive and create visualizations. 

## Deploy Spatial Analysis operations at scale (multiple cameras)

In order to get the best performance and utilization of the GPUs, you can deploy any Spatial Analysis operations on multiple cameras using graph instances. Below is a sample configuration for running the `cognitiveservices.vision.spatialanalysis-personcrossingline` operation on 15 cameras.

```json
  "properties.desired": {
      "globalSettings": {
          "PlatformTelemetryEnabled": false,
          "CustomerTelemetryEnabled": true
      },
      "graphs": {
        "personzonelinecrossing": {
        "operationId": "cognitiveservices.vision.spatialanalysis-personcrossingline",
        "version": 1,
        "enabled": true,
        "sharedNodes": {
            "shared_detector0": {
                "node": "PersonCrossingLineGraph.detector",
                "parameters": {
                    "DETECTOR_NODE_CONFIG": "{ \"gpu_index\": 0, \"batch_size\": 7, \"do_calibration\": true}",
                }
            },
            "shared_calibrator0": {
                "node": "PersonCrossingLineGraph/cameracalibrator",
                "parameters": {
                    "CAMERACALIBRATOR_NODE_CONFIG": "{ \"gpu_index\": 0, \"do_calibration\": true, \"enable_zone_placement\": true}",
                    "CALIBRATION_CONFIG": "{\"enable_recalibration\": true, \"quality_check_frequency_seconds\": 86400}",
                }
        },
        "parameters": {
            "VIDEO_DECODE_GPU_INDEX": 0,
            "VIDEO_IS_LIVE": true
        },
        "instances": {
            "1": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 1>",
                    "VIDEO_SOURCE_ID": "camera 1",
                    "SPACEANALYTICS_CONFIG": "{\"zones\":[{\"name\":\"queue\",\"polygon\":[[0,0],[1,0],[0,1],[1,1],[0,0]]}]}"
                }
            },
            "2": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 2>",
                    "VIDEO_SOURCE_ID": "camera 2",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "3": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 3>",
                    "VIDEO_SOURCE_ID": "camera 3",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "4": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 4>",
                    "VIDEO_SOURCE_ID": "camera 4",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "5": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 5>",
                    "VIDEO_SOURCE_ID": "camera 5",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "6": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 6>",
                    "VIDEO_SOURCE_ID": "camera 6",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "7": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 7>",
                    "VIDEO_SOURCE_ID": "camera 7",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "8": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 8>",
                    "VIDEO_SOURCE_ID": "camera 8",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "9": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 9>",
                    "VIDEO_SOURCE_ID": "camera 9",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "10": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 10>",
                    "VIDEO_SOURCE_ID": "camera 10",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "11": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 11>",
                    "VIDEO_SOURCE_ID": "camera 11",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "12": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 12>",
                    "VIDEO_SOURCE_ID": "camera 12",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "13": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 13>",
                    "VIDEO_SOURCE_ID": "camera 13",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "14": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 14>",
                    "VIDEO_SOURCE_ID": "camera 14",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            },
            "15": {
                "sharedNodeMap": {
                    "PersonCrossingLineGraph/detector": "shared_detector0",
		    "PersonCrossingLineGraph/cameracalibrator": "shared_calibrator0",
                },
                "parameters": {
                    "VIDEO_URL": "<Replace RTSP URL for camera 15>",
                    "VIDEO_SOURCE_ID": "camera 15",
                    "SPACEANALYTICS_CONFIG": "<Replace the zone config value, same format as above>"
                }
            }
          }
        },
      }
  }
  ```
| Name | Type| Description|
|---------|---------|---------|
| `batch_size` | int | If all of the cameras have the same resolution, set `batch_size` to the number of cameras that will be used in that operation, otherwise, set `batch_size` to 1 or leave it as default (1), which indicates no batch is supported. |

## Next steps

* [Deploy a People Counting web application](spatial-analysis-web-app.md)
* [Logging and troubleshooting](spatial-analysis-logging.md)
* [Camera placement guide](spatial-analysis-camera-placement.md)
* [Zone and line placement guide](spatial-analysis-zone-line-placement.md)
