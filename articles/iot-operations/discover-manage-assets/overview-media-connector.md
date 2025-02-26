---
title: What is the media connector (preview)?
description: The media connector (preview) in Azure IoT Operations makes media from media sources such as IP cameras available to other Azure IoT Operations components.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 11/12/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to understand what the media connector is so that I can determine whether I can use it in my industrial IoT solution.
---

# What is the Azure IoT Operations media connector (preview)?

This article introduces the media connector (preview) in Azure IoT Operations. The media connector makes images and video from media sources such as IP cameras available to other Azure IoT Operations components. The media connector is secure and performant.

## Media source types

The media connector can connect to various sources, including:

| Media source | Example URLs | Notes |
|--------------| ---------------|-------|
| Edge attached camera | `file://host/dev/video0`<br/>`file://host/dev/usb0` | No authentication required. The URL refers to the device file. Connects to a node using USB, FireWire, MIPI, or proprietary interface. |
| IP camera | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. An IP camera might also expose a standard ONVIF control interface. |
| Media server | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. A media server can also serve images and videos using URLs such as `ftp://host/path` or `smb://host/path` |
| Media file | `http://camera1/snapshot/profile1`<br/>`nfs://server/path/file.extension`<br/>` file://localhost/media/path/file.mkv`  | Any media file with a URL accessible from the cluster. |
| Media folder | `file://host/path/to/folder/`<br/>`ftp://server/path/to/folder/` | A folder, accessible from the cluster, that contains media files such as snapshots or clips. |

## Example uses

Example uses of the media connector include:

- Capture snapshots from a video stream or from an image URL and publish them to an MQTT topic. A subscriber to the MQTT topic can use the captured images for further processing or analysis.

- Save video streams to a local file system on your cluster. Use the [What is Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) to provide a reliable and fault-tolerant solution for uploading the captured video to the cloud for storage or processing.

- Proxy a live video stream from a camera to an endpoint that an operator can access. For security and performance reasons, only the media connector should have direct access to an edge camera. The media connector uses a separate media server component to stream video to an operator's endpoint. This media server can transcode to various protocols such as RTSP, RTCP, SRT, and HLS. You need to deploy your own media server to provide these capabilities.

## How does it relate to Azure IoT Operations?

The media connector is part of Azure IoT Operations. The connector deploys to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations elements, such as:

- _Asset endpoints_ that are custom resources in your Kubernetes cluster define connections to assets such as cameras. An asset endpoint configuration includes the URL of the media source, the type of media source, and any credentials needed to access the media source. The media connector uses an asset endpoint to access the media source.

- _Assets_, in Azure IoT Operations are logical entities that you create to represent real assets such as cameras. An Azure IoT Operations camera asset can have properties, tags, and video streams.

- The MQTT broker that you can use to publish messages from the connectors to other local or cloud-based components in your solution.

- The Azure Device Registry that stores information about local assets in the cloud.

## Next step

> [!div class="nextstepaction"]
> [How to use the media connector](howto-use-media-connector.md)
