---
title: Live Video Analytics on IoT Edge quotas - Azure  
description: This article describes Live Video Analytics on IoT Edge quotas and limitations.
ms.topic: conceptual
ms.date: 05/22/2020 
 
---
# Quotas and limitations

This article enumerates the quotas and limitations of the Live Video Analytics on IoT Edge module.

## Maximum period of disconnected use

The edge module can sustain temporary loss of network connectivity. If the module remains disconnected for more than 36 hours, it will deactivate any graph instances that were running, and further direct method calls will be blocked.

To resume the edge module to an operational state, you will have to restore network connectivity, and the module needs to be able to successfully communicate with the Azure Media Service account.

## Maximum number of graph instances

You can have at most 1000 graph instances per module (created via GraphInstanceSet).

## Maximum number of graph topologies

You can have at most 50 graph topologies per module (created via GraphTopologySet).

## Limitations on graph topologies at preview

With the preview release, there are limitations on different nodes can be connected together in a media graph topology.

* RTSP source
   * Only one RTSP source is allowed per graph topology.
* Frame rate filter processor
   * Must be immediately downstream from RTSP source or motion detection processor.
   * Cannot be used downstream of a HTTP extension processor.
   * Cannot be upstream from a motion detection processor.
* HTTP extension processor
   * There can be at most one such processor per graph topology.
* Motion detection processor
   * Must be immediately downstream from RTSP source.
   * There can be at most one such processor per graph topology.
   * Cannot be used downstream of a HTTP extension processor.
* Signal gate processor
   * Must be immediately downstream from RTSP source.
* Asset sink 
   * There can be at most one such node per graph topology.
      * If an asset sink is used, then a file sink cannot be present, or vice versa.
   * Must be immediately downstream from RTSP source or signal gate processor.
* File sink
   * There can be at most one such node per graph topology (see above note regarding asset sink).
   * Must be immediately downstream from signal gate processor.
   * Cannot be immediately downstream of HTTP extension processor, or motion detection processor
* IoT Hub Sink
   * Cannot be immediately downstream of an IoT Hub Source.

If both motion detection and filter rate processor nodes are used, they should be in the same chain of nodes leading to the RTSP source node.

## Limitations on Media Service operations at preview

At the time of the preview release, the Live Video Analytics on IoT Edge does not support the following:

* The ability to migrate the Media Service account from one subscription to another without an interruption.
* The ability to use more than one Storage account with the Media Service account.
* The ability to change the service principal information in the desired properties of the module dynamically, without a restart.

## Next steps

[Overview](overview.md)
