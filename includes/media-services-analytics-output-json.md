---
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 11/09/2018	
ms.author: juliako
---
The job produces a JSON output file that contains metadata about detected and tracked faces. The metadata includes coordinates indicating the location of faces, as well as a face ID number indicating the tracking of that individual. Face ID numbers are prone to reset under circumstances when the frontal face is lost or overlapped in the frame, resulting in some individuals getting assigned multiple IDs.

The output JSON includes the following elements:

### Root JSON elements

| Element | Description |
| --- | --- |
| version |This refers to the version of the Video API. |
| timescale |"Ticks" per second of the video. |
| offset |This is the time offset for timestamps. In version 1.0 of Video APIs, this will always be 0. In future scenarios we support, this value may change. |
| width, hight |The width and hight of the output video frame, in pixels.|
| framerate |Frames per second of the video. |
| [fragments](#fragments-json-elements) |The metadata is chunked up into different segments called fragments. Each fragment contains a start, duration, interval number, and event(s). |

### Fragments JSON elements

|Element|Description|
|---|---|
| start |The start time of the first event in "ticks." |
| duration |The length of the fragment, in “ticks.” |
| index | (Applies to Azure Media Redactor only) defines the frame index of the current event. |
| interval |The interval of each event entry within the fragment, in “ticks.” |
| events |Each event contains the faces detected and tracked within that time duration. It is an array of events. The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time. An empty bracket [] means no faces were detected. |
| id |The ID of the face that is being tracked. This number may inadvertently change if a face becomes undetected. A given individual should have the same ID throughout the overall video, but this cannot be guaranteed due to limitations in the detection algorithm (occlusion, etc.). |
| x, y |The upper left X and Y coordinates of the face bounding box in a normalized scale of 0.0 to 1.0. <br/>-X and Y coordinates are relative to landscape always, so if you have a portrait video (or upside-down, in the case of iOS), you'll have to transpose the coordinates accordingly. |
| width, height |The width and height of the face bounding box in a normalized scale of 0.0 to 1.0. |
| facesDetected |This is found at the end of the JSON results and summarizes the number of faces that the algorithm detected during the video. Because the IDs can be reset inadvertently if a face becomes undetected (e.g., the face goes off screen, looks away), this number may not always equal the true number of faces in the video. |
