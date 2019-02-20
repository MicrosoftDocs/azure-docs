---
title: Anchor relationships and way-finding in Azure Spatial Anchors | Microsoft Docs
description: Describe the conceptual model behind Anchor Relationships. Describe the process of connecting Anchors within a space, and the process of using the Nearby API to fulfill a way-finding scenario. After explaining the conceptual model, point developers to our sample apps that do nearby so they can get started implementing this in their own apps.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: ramonarguelles
ms.date: 02/19/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Anchor relationships and way-finding in Azure Spatial Anchors

Anchor relationships allow you to create connected anchors in a space and then ask questions about them like:

* Are there anchors nearby?
* How far away are they?

## Examples

Some example use-cases you can enable with connected anchors include:

1. A worker needs to carry out a procedure that involves visiting various locations in an industrial factory. The factory has placed spatial anchors at each site involved in the procedure. A HoloLens or mobile app helps guide the worker from one location to the next by first asking for the spatial anchors that are nearby and then guiding the worker to the next location. The app displays visual indicators about the general direction and distance to the next location to complete the task.

2. A museum creates spatial anchors at exhibits that together form a specific tour through the museum such as "A one-hour tour of essential exhibits". When visitors are at one exhibit, they can open the museum's mixed reality app on their mobile device, point their phone around the space and through a camera feed, see the general direction and distance to the other exhibits on the tour. As the user starts to walk towards one of the exhibits, the app progressively updates the general direction and distance to help guide users there.

## Wayfinding

In these scenarios, the app is using "line-of-sight" direction and distance between anchors to provide guidance hints to users. We refer to this overall scenario as wayfinding. It's important to note that wayfinding is different from turn-by-turn navigation in which users are guided around walls, through doors, and between floors. With wayfinding, the user is provided hints about the general direction of the destination, but the user's inference or knowledge of the space helps her navigate through the structure to the destination.

Building a wayfinding experience involves preparing a space for the experience and developing an app that end-users will interact with. The conceptual steps involved include:

1. Planning the space: Determine the locations within the space that participate in the wayfinding experience. In the earlier examples, this might be done by the factory foreman or the museum tour coordinator.
2. Connecting anchors: Someone visits the designated locations and creates spatial anchors there. This can be done with an admin mode of the end-user app or a different app entirely. Through this process, each anchor is connected or related to the others. These relationships are maintained in the service.
3. Starting the end-user experience: The first step for end-users is to locate one of the anchors using the app. This can be in any one of the designated locations. Determining the locations where end-users can enter the experience is part of designing the overall experience.
4. Finding nearby anchors: Once the user has located one anchor, the app can request nearby anchors. This returns a pose between the device and these anchors.
5. Guiding the user: The app can leverage the pose to each of these anchors to render useful guidance hints about their general direction and distance. For instance, there might be an icon and arrow on a camera feed in a mobile app representing each potential destination as in the image below.
6. Refining the guidance: As the user walks, the app can periodically calculate a new pose between the device and the destination anchor. The app continues to refine the guidance hints that help the user arrive at the destination.

## Connecting Anchors

To build a wayfinding experience, you need to place connected anchors in the designated locations for the experience. We'll assume below this is done by an admin of the app.

### Connecting Anchors in a single session

The steps involved in connecting anchors are:

1. The admin walks to the first location and creates Anchor A using a CloudSpatialAnchorSession.
2. The admin walks to the second location while the underlying MR/AR platform continues to track the user.
3. The admin creates Anchor B with the same CloudSpatialAnchorSession. Anchors A and B are now connected, and this relationship is maintained by the Azure Spatial Anchors service.
4. Continue the procedure for all anchors that you want to connect.

### Multiple sessions

You can also connect spatial anchors over multiple sessions. This allows you to create and connect some anchors at one time, and later create and connect more anchors. To connect anchors with multiple sessions:

1. The app creates some anchors in one CloudSpatialAnchorSession.
2. Later, for instance on a different day, the app locates one of these anchors with a new CloudSpatialAnchorSession (for example Anchor A).
3. The user walks to a new location, while the underlying MR/AR platform continues to track the user.
4. Using same CloudSpatialAnchorSession, the user creates anchor C. Anchors A, B, and C are now connected and this relationship is maintained by Azure Spatial Anchors.
5. You can continue this procedure for more anchors and more sessions over time.

### Verifying Anchor Connections

The app can verify that two anchors are connected by issuing a query for nearby anchors. If the result of the query contains the desired target anchor, then the app has confirmation that the anchors are connected. If they are not connected, the app can retry the connection procedure again. Some reasons why anchors might fail to connect include:

1. The underlying MR/AR tracker lost tracking during the process of connecting anchors.
2. There was a network error communicating with the Azure Spatial Anchors service and the anchor connection couldn't be persisted.

### Sample code

To see sample code that shows you how to connect anchors and do nearby queries you can refer to the Azure Spatial Anchors sample apps on GitHub.
