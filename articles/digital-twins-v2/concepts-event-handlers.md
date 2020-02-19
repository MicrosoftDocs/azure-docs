---
# Mandatory fields.
title: Handling events
description: Understand what you can do with event handlers in Azure Digital Twins.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Handling events in Azure Digital Twins

*Event handlers are not available in the initial private preview. The following information is for preview information and early feedback only.*

A common use case in an ADT solution is to modify a property of a twin in response to an event fired by another twin or a device. As an example, think of updating a computed property on a room in response to a device telemetry event. 
In the hospital example in the introduction, for example, an **event handler** is used to update the handwash-ratio of a patient room in response to telemetry events from soap dispensers and motion detectors. The code of the event handler needs to take the time delta between events from both sensors into account in order to assess if the hand washing event is correlated with the entrance into a room. 
In the same scenario, a different event handler is used to update the hand wash ratio of a hospital ward when any of the associated patient rooms update their handwash ratio property. This event handler will use relationship access to find all the other patient rooms connected to a ward, and then compute an aggregate. The same event handler is also used to roll up the handwash ratio from wards to the entire hospital.
Event handlers are created as part of the graph topology, in a manner similar to relationships. They are also managed in a similar way – if the graph topology changes, so do the relationships and event handler subscriptions. 
Because event handler subscriptions are created with context information of the graph, the associated event handler has direct access to this context, making it easier and more performant to write event handler functions. In particular, the event handler can directly access the desired target twin without the need of searching for it in the graph. 
