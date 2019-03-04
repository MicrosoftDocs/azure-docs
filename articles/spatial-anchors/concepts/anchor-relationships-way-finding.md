---
title: Anchor relationships and way-finding in Azure Spatial Anchors | Microsoft Docs
description: Describe the conceptual model behind anchor relationships. Describe the process of connecting anchors within a space, and the process of using the Nearby API to fulfill a way-finding scenario. After explaining the conceptual model, point developers to our sample apps that do nearby so they can get started implementing this scenario in their own apps.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: ramonarguelles
ms.date: 02/24/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Anchor relationships and way-finding in Azure Spatial Anchors

Anchor relationships allow you to create connected anchors in a space and then ask questions about them like:

* Are there anchors nearby?
* How far away are they?

## Examples

Some example use-cases you can enable with connected anchors include:

1. A worker needs to carry out a procedure that involves visiting various locations in an industrial factory. The factory has placed spatial anchors at each site involved in the procedure. A HoloLens or mobile app helps guide the worker from one location to the next. It would first ask for the spatial anchors that are nearby, and then guide the worker to the next location. The app displays visual indicators about the general direction and distance to the next location to complete the task.

2. A museum creates spatial anchors at public displays that together create a specific tour through the museum such as "A one-hour tour of essential public displays". When visitors are at one public display, they can open the museum's mixed reality app on their mobile device. Then, they would point their phone around the space and through a camera feed, and see the general direction and distance to the other public displays on the tour. As the user starts to walk towards one of the public displays, the app progressively updates the general direction and distance to help guide users there.

## Way-finding

Imagine the app is using "line-of-sight" direction and distance between anchors to provide guidance hints to users. We refer to this overall scenario as way-finding. It's important to note way-finding is different from turn-by-turn navigation. In turn-by-turn navigation, the users are guided around walls, through doors, and between floors. With way-finding, the user is provided hints about the general direction of the destination. But the user's inference or knowledge of the space also helps to navigate through the structure to the destination.

Building a way-finding experience involves preparing a space for the experience and developing an app that end users will interact with. The conceptual steps involved include:

1. Planning the space: Determine the locations within the space that participate in the way-finding experience. In the earlier examples, this activity might be completed by the factory supervisor or the museum tour coordinator.
2. Connecting anchors: Someone visits the chosen locations and creates spatial anchors there. This task can be done with an admin mode of the end-user app or a different app entirely. Through this process, each anchor is connected or related to the others. These relationships are maintained in the service.
3. Starting the end-user experience: The first step for end users is to locate one of the anchors using the app, which can be in any one of the chosen locations. Determining the locations where end users can enter the experience is part of designing the overall experience.
4. Finding nearby anchors: Once the user has located one anchor, the app can request nearby anchors. This procedure returns a pose between the device and these anchors.
5. Guiding the user: The app can take advantage of the pose to each of these anchors to render useful guidance hints about their general direction and distance. For instance, there might be an icon and arrow on a camera feed in a mobile app representing each potential destination as in the image below.
6. Refining the guidance: As the user walks, the app can periodically calculate a new pose between the device and the destination anchor. The app continues to refine the guidance hints that help the user arrive at the destination.

![Meeting Spot](./media/meeting-spot.png)

## Connecting Anchors

To build a way-finding experience, you need to place connected anchors in the chosen locations. Below we'll assume this work is done by an admin of the app.

### Connecting Anchors in a single session

The steps involved in connecting anchors are:

1. The admin walks to the first location and creates Anchor A using a CloudSpatialAnchorSession.
2. The admin walks to the second location while the underlying MR/AR platform continues to track the user.
3. The admin creates Anchor B with the same CloudSpatialAnchorSession. Anchors A and B are now connected, and this relationship is maintained by the Azure Spatial Anchors service.
4. Continue the procedure for all anchors that you want to connect.

### Multiple sessions

You can also connect spatial anchors over multiple sessions. This method allows you to create and connect some anchors at one time, and later create and connect more anchors. To connect anchors with multiple sessions:

1. The app creates some anchors in one CloudSpatialAnchorSession.
2. Later, for instance on a different day, the app locates one of these anchors with a new CloudSpatialAnchorSession (for example Anchor A).
3. The user walks to a new location, while the underlying MR/AR platform continues to track the user.
4. Using same CloudSpatialAnchorSession, the user creates anchor C. Anchors A, B, and C are now connected and this relationship is maintained by Azure Spatial Anchors.
5. You can continue this procedure for more anchors and more sessions over time.

### Verifying Anchor Connections

The app can verify that two anchors are connected by issuing a query for nearby anchors. When the result of the query contains the desired target anchor, then the app has confirmation that the anchors are connected. If they aren't connected, the app can retry the connection procedure again. Here are some reasons why anchors might fail to connect:

1. The underlying MR/AR tracker lost tracking during the process of connecting anchors.
2. There was a network error communicating with the Azure Spatial Anchors service and the anchor connection couldn't be persisted.

### Sample code

You can see sample code that shows you how to connect anchors and do nearby queries. Refer to the [Azure Spatial Anchors sample apps](https://github.com/Azure/azure-spatial-anchors-samples) on GitHub.
