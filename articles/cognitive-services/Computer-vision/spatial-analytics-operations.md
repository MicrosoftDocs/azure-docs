---
title: Spatial Analytics operations
titleSuffix: Azure Cognitive Services
description: The Spatial Analytics operations.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: aahi
---

# Spatial Analysis Operations

Project Archon enables the analysis of real-time streaming video from camera devices. For each camera device you configure, the NEW-START operations for spatial analysis will NEW-END generate an output stream of JSON messages that are being egressed to your instance of Azure IoT Hub. 

The Project Archon container implements the following NEW_START operations NEW-END for Spatial Analysis:

NEW START
| Operation Identifier| Description|
|---------|---------|
| cognitiveservices.vision.spatialanalysis-personcount | Counts people in a designated zone in the camera's field of view. <br> Emits an initial _personCountEvent_ event and then _personCountEvent_ events when the count changes.  |
| cognitiveservices.vision.spatialanalysis-personcrossingline | Tracks when a person crosses a designated line in the camera's field of view. <br>Emits a _personLineEvent_ event when the person crosssed the line and provides directional info. 
| cognitiveservices.vision.spatialanalysis-personcrossingpolygon | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when the person crosssed the zone and provides directional info. |
| cognitiveservices.vision.spatialanalysis-persondistance | Tracks when people violate a distance rule. <br> Emits a _personDistanceEvent_ periodically with the location of each distance violation. |
cognitiveservices.vision.spatialanalysis-videorecorder | This operation enables recording of video streams as being processed into an Azure Blob Storage instance you can deploy on the edge or in the cloud. You are in control of where the data is being stored. The data is not transmitted to Microsoft. |



All above the operations except `cognitiveservices.vision.spatialanalysis-videorecorder` are also available in .debug flavour which has the apability to visualize the video frames as being processed. You will need to run "xhost +" on the  **host computer** to enable the visualization of the video frames and events

| Operation Identifier| Description|
|---------|---------|
| cognitiveservices.vision.spatialanalysis-personcount.debug | Counts people in a designated zone in the camera's field of view. <br> Emits an initial _personCountEvent_ event and then _personCountEvent_ events when the count changes.  |
| cognitiveservices.vision.spatialanalysis-personcrossingline.debug | Tracks when a person crosses a designated line in the camera's field of view. <br>Emits a _personLineEvent_ event when the person crosssed the line and provides directional info. 
| cognitiveservices.vision.spatialanalysis-personcrossingpolygon.debug | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when the person crosssed the zone and provides directional info. |
| cognitiveservices.vision.spatialanalysis-persondistance.debug | Tracks when people violate a distance rule. <br> Emits a _personDistanceEvent_ periodically with the location of each distance violation. |

Project Archon can also be run with [Live Video Analytics](https://azure.microsoft.com/en-us/services/media-services/live-video-analytics/) as their Video AI module, more details on the setup can be found in the [Project Archon LVA Setup page](Project-Archon-LVA-Setup.md). Below is the list of the operations supported with Live Video Analytics

| Operation Identifier| Description|
|---------|---------|
| cognitiveservices.vision.spatialanalysis-personcount.livevideoanalytics | Counts people in a designated zone in the camera's field of view. <br> Emits an initial _personCountEvent_ event and then _personCountEvent_ events when the count changes.  |
| cognitiveservices.vision.spatialanalysis-personcrossingline.livevideoanalytics | Tracks when a person crosses a designated line in the camera's field of view. <br>Emits a _personLineEvent_ event when the person crosssed the line and provides directional info. 
| cognitiveservices.vision.spatialanalysis-personcrossingpolygon.livevideoanalytics | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when the person crosssed the zone and provides directional info. |
| cognitiveservices.vision.spatialanalysis-persondistance.livevideoanalytics | Tracks when people violate a distance rule. <br> Emits a _personDistanceEvent_ periodically with the location of each distance violation. |

<br>Live Video Analytics skills are also available in .debug flavour (e.g. cognitiveservices.vision.spatialanalysis-personcount.livevideoanalytics.debug) which has the apability to visualize the video frames as being processed. You will need to run "xhost +" on the host computer to enable the visualization of the video frames and events



<br>**IMPORTANT NOTE:**  The computer vision AI models detect and locate human presence in video footage and output by using a bounding box around a human body. The AI models do not attempt to detect faces or discover the identities or demographics of individuals.<br> 

These are the parameters required by each of these Spatial Analysis operations.
| Operation parameters| Description|
|---------|---------|
| Operation ID | The Operation Identifier from table above.|
| enabled | Boolean: true or false|
| VIDEO_URL| The rtsp url for the camera device(Example: rtsp://username:password@url). Archon supports H.264 encoded stream either through rtsp or http and in case of file format(container format) should be mp4
| VIDEO_SOURCE_ID | A friendly name for the camera device or video stream. This will be returned with the event JSON output.|
| VIDEO_IS_LIVE| True for camera devices; false for recorded videos.|
| VIDEO_DECODE_GPU_INDEX| Which GPU to decode the video frame. By default it is 0. Should be the same as the `gpu_index` in other node config like `VICA_NODE_CONFIG`, `DETECTOR_NODE_CONFIG`.|
| VICA_NODE_CONFIG | JSON indicating from which GPU to move data to CPU. Should be in the following format: `"{ \"gpu_index\": 0 }",`|
| DETECTOR_NODE_CONFIG | JSON indicating which GPU to run the detector node on. Should be in the following format: `"{ \"gpu_index\": 0 }",`|
| TRACKER_NODE_CONFIG | JSON configuration for the tracker. Should be in the following format: `"{ \"gpu_index\": 0 }",`|
| SPACEANALYTICS_CONFIG | JSON configuration for zone and line as outlined below.|


 ### Zone configuration for cognitiveservices.vision.spatialanalysis-personcount
 This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a zone. You may configure multiple zone for this operation.

 NEW-END

```
NEW-START
{
"zones":[{
	"name": "lobbycamera"
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 50.00,
	"events":[{
		"type": "count",
		"config":{
			"trigger": "event",
			"output_frequency": 1
      }
	}]
}
NEW_END
```
| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of a polygon. The polygon represents the areas in which people are tracked or counted and polygon points are based on normalized coordinates (0-1), where the top left corner is (0.0, 0.0) and the bottom right corner is (1.0, 1.0).   
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcount** this should be `count`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `interval` | string| A time in seconds that the person count will be aggregated before an event is fired. The operation will continue to analyze the scene at a constant rate and returns the most common count over that interval. The aggregation interval is applicable to both `event` and `interval`.|

 ### Line configuration for cognitiveservices.vision.spatialanalysis-personcrossingline
 This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a line. You may configure multiple crossing lines for this operation.

 ```
 NEW-START
{
"lines":[{
	"name": "doorcamera" 
	"line": {
        "start": {"x": 0, "y": 0.5},
        "end": {"x": 1, "y": 0.5}
            },
	"threshold": 50.00,
	"events":[{
		"type": "linecrossing",
		"config":{
			"trigger": "event"
            }
        }]
	}]
}
NEW_END_END
```

| Name | Type| Description|
|---------|---------|---------|
| `lines` | list| List of lines.|
| `name` | string| Friendly name for this line.|
| `line` | list| The definition of the line. This is a directional line allowing you to understand "entry" vs. "exit".|
| `start` | value pair| x, y coordinates for line's starting point. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `end` | value pair| x, y coordinates for line's ending point. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcrossingline** this should be `linecrossing`.|
|`trigger`|string|The type of trigger for sending an event.<br>Supported Values: "event": fire when someone crosses the line.|

 ### Zone configuration for cognitiveservices.vision.spatialanalysis-personcrossingpolygon
This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a zone. You may configure multiple zones for this operation.

 ```
 NEW-START
{
"zones":[{
	"name": "queuecamera"
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 50.00,
	"events":[{
		"type": "zone_crossing",
		"config":{
			"trigger": "event"
            }
		}]
	}]
}
NEW-END
```
| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| For **cognitiveservices.vision.spatialanalysis-personcrossingpolygon** this should be `enter` or `exit`.|
| `trigger`|string|The type of trigger for sending an event<br>Supported Values: "event": fire when someone enters or exits the zone.|

 ### Zone configuration for cognitiveservices.vision.spatialanalysis-persondistance
This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a zone for **cognitiveservices.vision.spatialanalysis-persondistance**. You may configure multiple zones for this operation.

 ```
{
"zones":[{
	"name": "lobbycamera",
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 35.00,
	"events":[{
		"type": "persondistance",
		"config":{
			"trigger": "event",
			"output_frequency":1,
			"minimum_distance_threshold":6.0,
			"maximum_distance_threshold":35.0
      		}
		}]
	}]
}
```
| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are counted and the distance between people is measured. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| For **cognitiveservices.vision.spatialanalysis-persondistance** this should be `people_distance`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `interval` | string | A time in seconds that the violations will be aggregated before an event is fired. The aggregation interval is applicable to both `event` and `interval`.|
| `output_frequency` | int | The rate at which events are egressed. When `output_frequency` = X, every X event is egressed, ex. `output_frequency` = 2 means every other event is output. The output_frequency is applicable to both `event` and `interval`.|
| `minimum_distance_threshold` | float| A distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximum_distance_threshold` | float| A distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.|

This is an example of a JSON input for the DETECTOR_NODE_CONFIG parameter that configures a **cognitiveservices.vision.spatialanalysis-persondistance** zone.

{ 
"gpu_index": 0, 
"do_calibration": true
}

| Name | Type| Description|
|---------|---------|---------|
| `gpu_index` | string| The GPU index on which this operation will run.|
| `do_calibration` | string | Indicates that calibration is turned on. `do_calibration` must be true for **cognitiveservices.vision.spatialanalysis-persondistance** to function properly.|

## Camera configuration
Visit this [Companion Tool page](Project-Archon-Camera-Setup.md) to learn how to create zone and line configurations using a visual tool provided with Project Archon.

## Spatial Analysis Operation Output
The events from each operation are egressed to Azure IoT Hub on JSON format.

### JSON format for cognitiveservices.vision.spatialanalysis-personcount AI Insights
Sample JSON for an event output by this operation.
```
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
                "@type": "type.googleapis.com/microsoft.rtcv.insights.PeopleCountEventMetadata",
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
            "status": "Complete",
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
            "centerGroundPoint": {
                "x": 0.0,
                "y": 0.0
            },
            "metadataType": ""
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
            "centerGroundPoint": {
                "x": 0.0,
                "y": 0.0
            },
            "metadataType": ""
        }
    ],
    "schemaVersion": "1.0"
}
```
| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event id|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `status` | string| 'Enter' or 'Exit'|
| `side` | int| The number of the side of the polygon that the person crossed|
| `zone` | string | The "name" field of the polygon that represents the zone that was crossed|
| `trigger` | string| The trigger type is 'event' or 'interval' depending on the value of `trigger` in SPACEANALYTICS_CONFIG|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection id|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|

| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera id|
| `timestamp` | date| UTC date when the JSON paylod was emmitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|
| `cameraCallibrationInfo` | collection | Collection of values|
| `status` | string | Indicates if camera calibration to ground plane is "Complete"|
| `cameraHeight` | float | The height of the camera above the ground in feet. This is inferred from auto-calibration. |
| `focalLength` | float | The focal length of the camera in pixels. This is inferred from auto-calibration. |
| `tiltUpAngle` | float | The camera tilt angle from vertical. This is inferred from auto-calibration.|

| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera id|
| `timestamp` | date| UTC date when the JSON paylod was emmitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|


### JSON format for cognitiveservices.vision.spatialanalysis-personcrossingline AI Insights
Sample JSON for detections output by this operation.
```
{
    "events": [
        {
            "id": "3733eb36935e4d73800a9cf36185d5a2",
            "type": "personLineEvent",
            "detectionIds": [
                "90d55bfc64c54bfd98226697ad8445ca"
            ],
            "properties": {
                "@type": "type.googleapis.com/microsoft.rtcv.insights.LineEventMetadata",
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
            "metadataType": ""
        }
    ],
    "schemaVersion": "1.0"
}
```
| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event id|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `status` | string| Direction of line crossings, either 'CrossLeft' or 'CrossRight'|
| `zone` | string | The "name" field of the line that was crossed|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection id|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|

| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera id|
| `timestamp` | date| UTC date when the JSON paylod was emmitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|


**IMPORTANT NOTE:**  The AI model detects a person irrespective whether the person is facing towards or away from the camera. The AI model doesn't run face detection or recognition and doesn't emit any biometric information. 

### JSON format for cognitiveservices.vision.spatialanalysis-personcrossingpolygon AI Insights
Sample JSON for detections output by this operation.
```
{
    "events": [
        {
            "id": "f095d6fe8cfb4ffaa8c934882fb257a5",
            "type": "personZoneEvent",
            "detectionIds": [
                "afcc2e2a32a6480288e24381f9c5d00e"
            ],
            "properties": {
                "@type": "type.googleapis.com/microsoft.rtcv.insights.ZoneEventMetadata",
                "trackingId": "afcc2e2a32a6480288e24381f9c5d00e",
                "status": "Enter",
                "side": ""
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
            "metadataType": ""
        }
    ],
    "schemaVersion": "1.0"
}
```

| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event id|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `trackinId` | string| Unique identifier of the person detected|
| `status` | string| Direction of polygon crossings, either 'Enter' or 'Exit'|
| `zone` | string | The "name" field of the polygon that represents the zone that was crossed|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection id|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|

### JSON format for cognitiveservices.vision.spatialanalysis-persondistance AI Insights
Sample JSON for detections output by this operation.
```
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
                "@type": "type.googleapis.com/microsoft.rtcv.insights.PeopleDistanceEventMetadata",
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
            "status": "Complete",
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
            "centerGroundPoint": {
                "x": -1.4638760089874268,
                "y": 18.29732322692871
            },
            "metadataType": ""
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
            "centerGroundPoint": {
                "x": 2.6310102939605713,
                "y": 18.635927200317383
            },
            "metadataType": ""
        }
    ],
    "schemaVersion": "1.0"
}
```

| Event Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event id|
| `type` | string| Event type|
| `detectionsId` | array| Array of size 1 of unique identifier of the person detection that triggered this event|
| `properties` | collection| Collection of values|
| `personCount` | int| Number of people detected when the event was emitted|
| `averageDistance` | float| The average distance between all detected people in feet|
| `minimumDistanceThreshold` | float| The distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximumDistanceThreshold` | float| The distance in feet that will trigger a "TooFar" event when people are greater than distance apart.|
| `eventName` | string| Event name is `TooClose` with the `minimumDistanceThreshold` is violated, `TooFar` when `maximumDistanceThreshold` is violated, or `unknown` when auto-calibration hasn't completed|
| `distanceViolationPersonCount` | int| Number of people detected in violation of `minimumDistanceThreshold` or `maximumDistanceThreshold`|
| `zone` | string | The "name" field of the polygon that represents the zone that was monitored for distancing between people|
| `trigger` | string| The trigger type is 'event' or 'interval' depending on the value of `trigger` in SPACEANALYTICS_CONFIG|

| Detections Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Detection id|
| `type` | string| Detection type|
| `region` | collection| Collection of values|
| `type` | string| Type of region|
| `points` | collection| Top left and bottom right points when the region type is RECTANGLE |
| `confidence` | float| Algorithm confidence|
| `centerGroundPoint` | 2 float values| `x`, `y` values with the coordinates of the person's inferred location on the ground in feet. `x` is distance from the camera perpendicular to the camera image plane projected on the ground in feet. `y` is distance from the camera parallel to the image plane projected on the ground in feet.|

| SourceInfo Field Name | Type| Description|
|---------|---------|---------|
| `id` | string| Camera id|
| `timestamp` | date| UTC date when the JSON paylod was emmitted|
| `width` | int | Video frame width|
| `height` | int | Video frame height|
| `frameId` | int | Frame identifier|
| `cameraCallibrationInfo` | collection | Collection of values|
| `status` | string | Indicates if camera calibration to ground plane is "Complete"|
| `cameraHeight` | float | The height of the camera above the ground in feet. This is inferred from auto-calibration. |
| `focalLength` | float | The focal length of the camera in pixels. This is inferred from auto-calibration. |
| `tiltUpAngle` | float | The camera tilt angle from vertical. This is inferred from auto-calibration.|

## Enable Video Recording with the cognitiveservices.vision.spatialanalysis-videorecorder
The cognitiveservices.vision.spatialanalysis-videorecorder was created to enable the recording of the video as it is being processed by the container. The deployment manifest file at [DeploymentManifest.json](./DeploymentManifest.json) has the configuration needed for the cognitiveservices.vision.spatialanalysis-videorecorder operation. The video recording is saved in an Azure Blob Storage that you need to configure. 
<br><br>**The video recording is not sent to Microsoft. Remove this operation if you are not interested in recoding the video.** <br> 

For more details on how to enable video recording please visit this [page](Project-Archon-Record-Video.md).


## How to consume output generated by Project Archon container

You may want to consume the detections or events generated by the Project Archon container by integrating these into your application or solution. Here are a few approaches you can investigate to get started: 
1.	Use the Azure Event Hub SDK for your chosen programming language to connect to the Azure IoT Hub endpoint and receive the events. See [Read device-to-cloud messages from the built-in endpoint](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-read-builtin) for more information. 
2.	Set up **Message Routing** on your Azure IoT Hub to send the events to other endpoints or save the events to Azure Blob Storage, etc. See [IoT Hub Message Routing](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-d2c) for more information. 
3.	Setup an **Azure Stream Analytics** job to process the events in real-time as they arrive and create visualizations. See the sample at [Azure Stream Analytics sample Job](Project-Archon-Stream-Analytics-Sample.md)
