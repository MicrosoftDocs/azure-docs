---
title: Detect when objects cross a virtual line or zone in an Azure Video Analyzer video
description: This tutorial shows you how to use the Azure Video Analyzer zone drawer widget to detect when objects cross a zone or line from Video Analyzer video.
ms.topic: tutorial
ms.date: 06/01/2021
---

# Using the Azure Video Analyzer Zone Drawer widget

In this tutorial, you will learn how to use Azure Video Analyzer Zone Drawer widget within your application.  This code is an easy-to-embed widget that will allow your end users to play video and navigate through the portions of a segmented video file.  To do this, you'll be generating a static HTML page with the widget embedded, and all the pieces to make it work.You will see how to create overlay zones and lines on a Video Analyzer video and detect when an object crosses the created zones and lines.  

The zone drawer widget is designed as an overlay on top of the player widget to provide additional functionality. It is designed for two scenarios. When you are designing zones for various types of detection or wanting to draw lines to detect crossing it can be used as a tool to help draw those and get the coordinates you need. When you later want to play back resulting video, it can provide those same lines / zones as overlays to help visualize what is going on.

## Suggested pre-reading

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [TypeScript](https://www.typescriptlang.org)
- [Using the Azure Video Analyzer player widget](./player-widget.md)

## Prerequisites

Prerequisites for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Visual Studio Code](https://code.visualstudio.com/) or another editor for the HTML file.
* Either [Continuous video recording and playback](./use-continuous-video-recording.md) or [Detect motion and record video on edge devices](./detect-motion-record-video-clips-cloud.md)
