---
title: Calling with toll-free numbers - Azure Communication Services
description: Information about inbound and outbound calling limitations with toll-free numbers
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Outbound and inbound calling with toll-free numbers
Azure Communication Services supports inbound and outbound calling capability with toll-free numbers in many countries or regions. However, there are some common limitations that you should be aware of. 

**Outbound calling with toll-free numbers**

Microsoft provides toll-free telephone numbers that have outbound calling capabilities, but it's important to note that this feature is only provided on a "best-effort" basis. In some countries/regions, toll-free numbers are considered as an "inbound only" service from regulatory perspective. This means, that in some scenarios, the receiving carrier may not allow incoming calls from toll-free telephone numbers. Since Microsoft and our carrier-partners don't have control over other carrier networks, we can't guarantee that outbound calls reach all possible destinations.


**Inbound calls to Toll-Free numbers**

All of our toll-free numbers have inbound calling capability, but do note that inbound calls to your toll-free numbers are only guaranteed to work if both the Toll-Free number and the caller's phone number are from the same country/region. If a call to your toll-free number originates outside the toll-free number country/region, we can't guarantee the delivery of the call. In most cases, international reachability on our toll-free numbers is supported, but there can be certain international carrier and country/region combinations where we can't guarantee that the call reaches to your Toll-Free number.
