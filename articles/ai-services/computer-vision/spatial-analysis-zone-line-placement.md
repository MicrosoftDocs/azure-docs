---
title: Spatial Analysis zone and line placement
titleSuffix: Azure AI services
description: Learn how to set up zones and lines with Spatial Analysis
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 06/08/2021
ms.author: pafarley
---


# Zone and Line Placement Guide

This article provides guidelines for how to define zones and lines for Spatial Analysis operations to achieve accurate analysis of peoples movements in a space. This applies to all operations. 

Zones and lines are defined using the JSON SPACEANALYSIS_CONFIG parameter. See the [Spatial Analysis operations](spatial-analysis-operations.md) article for more information.

## Guidelines for drawing zones

Remember that every space is different; you'll need to update the position or size depending on your needs.

If you want to see a specific section of your camera view, create the largest zone that you can, covering the specific floor area that you're interested in but not including other areas that you're not interested in. This increases the accuracy of the data collected and prevents false positives from areas you don't want to track. Be careful when placing the corners of your polygon and make sure they're not outside the area you want to track.  

### Example of a well-shaped zone

The zone should be big enough to accommodate three people standing along each edge and focused on the area of interest. Spatial Analysis will identify people whose feet are placed in the zone, so when drawing zones on the 2D image, imagine the zone as a carpet laying on the floor.

![Well-shaped zone](./media/spatial-analysis/zone-good-example.png)

### Examples of zones that aren't well-shaped

The following examples show poorly shaped zones. In these examples, the area of interest is the space in front of the *It's Game Time* display.

**Zone is not on the floor.**

![Poorly shaped zone](./media/spatial-analysis/zone-not-on-floor.png) 

**Zone is too small.**

![zone is too small](./media/spatial-analysis/zone-too-small.png)

**Zone doesn't fully capture the area around the display.**

![zone doesn't fully capture the area around end cap](./media/spatial-analysis/zone-bad-capture.png)

**Zone is too close to the edge of the camera image and doesn't capture the right display.**

![zone is too close to the edge of the camera image and doesn't capture the right display](./media/spatial-analysis/zone-edge.png)

**Zone is partially blocked by the shelf, so people and floor aren't fully visible.**

![zone is partially blocked, so people aren't fully visible](./media/spatial-analysis/zone-partially-blocked.png)

### Example of a well-shaped line

The line should be long enough to accommodate the entire entrance. Spatial Analysis will identify people whose feet cross the line, so when drawing lines on the 2D image imagine you're drawing them as if they lie on the floor. 

If possible, extend the line wider than the actual entrance. If this will not result in extra crossings (as in the image below when the line is against a wall) then extend it.

![Well-shaped line](./media/spatial-analysis/zone-line-good-example.png)

### Examples of lines that aren't well-shaped

The following examples show poorly defined lines.

**Line doesn't cover the entire entry way on the floor.**

![Line doesn't cover the entire entry way on the floor](./media/spatial-analysis/zone-line-bad-coverage.png)

**Line is too high and doesn't cover the entirety of the door.**

![Line is too high and doesn't cover the entirety of the door](./media/spatial-analysis/zone-line-too-high.png)

## Next steps

* [Deploy a People Counting web application](spatial-analysis-web-app.md)
* [Configure Spatial Analysis operations](./spatial-analysis-operations.md)
* [Logging and troubleshooting](spatial-analysis-logging.md)
* [Camera placement guide](spatial-analysis-camera-placement.md)
