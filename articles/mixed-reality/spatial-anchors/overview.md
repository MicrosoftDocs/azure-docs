---
title: Spatial Anchors overview - Azure | Microsoft Docs
description: Learn how Azure Spatial Anchors helps you develop cross-platform mixed reality experiences.
author: craigktreasure
manager: aliemami
services: spatial-anchors

ms.assetid: 3a2124b6-eabe-4e38-b9b0-5e8f7fb2a932
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: overview
ms.service: spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
---
# Spatial Anchors overview

Welcome to Azure Spatial Anchors. Spatial Anchors empowers developers with essential capabilities for building spatially-aware
Mixed Reality applications for Microsoft HoloLens, iOS-based devices supporting ARKit, and Android-based devices supporting
ARCore. Azure Spatial Anchors empowers developers to work with cameras and mixed reality platforms to perceive spaces,
designate precise points of interest in those spaces (ex. the middle of this table), and to recall those points of interest
from supported device on an on-going basis. These precise points of interest in the real-world are referred to as Spatial
Anchors. Some example use cases enabled by Spatial Anchors include:

1. Persisting virtual content in the real-world. An app can let a user place a virtual calendar on a conference room wall,
    such that people that later enter the room can see the virtual calendar through a camera feed in a phone app or directly
    in the environment through a HoloLens device. In an industrial setting, an app can present contextual information about
    machines to users by simply asking them to point their mobile device camera at the machine, or by simply looking at
    the machine through a HoloLens.

2. Multi-user experiences. Spatial Anchors makes it easy for people in the same place to participate in multi-user mixed
   reality applications. For example, two people can start a game of mixed reality chess by first agreeing to place a
   virtual chess board on the table in front of them and then pointing their phone cameras at the table or looking at the
   table through a HoloLens device.

3. Connected Places: In addition to allowing developers to declare and recall Spatial Anchors, developers can also connect
   multiple Spatial Anchors together and create relationships between them. For example, if an experience has two or more
   points of interest the user must visit to complete a task, someone can first visit those places and create the Anchors
   in a connected fashion. Later when the user is completing the multi-step task, the app can ask for Anchors that are nearby
   (within a certain distance) of the current one and direct the user towards the next step in the task.

Azure Spatial Anchors is comprised of a managed service as well as client SDKs for supported device platforms. The following
sections provide information about getting started with building apps using Azure Spatial Anchors.

## Next steps

Create your first app with Spatial Anchors.

> [!div class="nextstepaction"]
> [Android](quickstarts/get-started-android.md)

> [!div class="nextstepaction"]
> [HoloLens](quickstarts/get-started-hololens.md)

> [!div class="nextstepaction"]
> [iOS](quickstarts/get-started-ios.md)

> [!div class="nextstepaction"]
> [Unity Android](quickstarts/get-started-unity-android.md)

> [!div class="nextstepaction"]
> [Unity HoloLens](quickstarts/get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity iOS](quickstarts/get-started-unity-ios.md)