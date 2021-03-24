---
title: Live Video Analytics on IoT Edge quotas and limitations - Azure  
description: This article describes Live Video Analytics on IoT Edge quotas and limitations.
ms.topic: conceptual
ms.date: 05/22/2020 
 
---
# Quotas and limitations

This article enumerates the quotas and limitations of the Live Video Analytics on IoT Edge module.

## Maximum period of disconnected use

The edge module can sustain temporary loss of internet connectivity. If the module remains disconnected for more than 36 hours, it will deactivate any graph instances that were running. All further direct method calls will be blocked.

To resume the edge module to an operational state, you will have to restore the internet connectivity so that the module is able to successfully communicate with the Azure Media Service account.

## Maximum number of graph instances

At most 1000 graph instances per module (created via GraphInstanceSet) are supported.

## Maximum number of graph topologies

At most 50 graph topologies per module (created via GraphTopologySet) are supported.

## Limitations on graph topologies at preview

With the preview release, there are limitations on different nodes can be connected together in a media graph topology.

* RTSP source
   * Only one RTSP source is allowed per graph topology.
* Motion detection processor
   * Must be immediately downstream from RTSP source.
   * Cannot be used downstream of an HTTP or a gRPC extension processor.
* Signal gate processor
   * Must be immediately downstream from RTSP source.
* Asset sink 
   * Must be immediately downstream from RTSP source or signal gate processor.
* File sink
   * Must be immediately downstream from signal gate processor.
   * Cannot be immediately downstream of an HTTP or a gRPC extension processor or motion detection processor
* IoT Hub Sink
   * Cannot be immediately downstream of an IoT Hub Source.

## Limitations on Media Service operations at preview

At the time of the preview release, the Live Video Analytics on IoT Edge does not support the following:

* The ability to migrate the Media Service account from one subscription to another without an interruption.
* The ability to use more than one Storage account with the Media Service account.
* The ability to change the service principal information in the desired properties of the module dynamically, without a restart.

You can only use IP Cameras that support RTSP protocol. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products) page. Look for devices that conform with profiles G, S, or T.

Further, you should configure these cameras to use H.264 video and AAC audio. Other codecs are currently not supported. 

## Next steps

[Overview](overview.md)
