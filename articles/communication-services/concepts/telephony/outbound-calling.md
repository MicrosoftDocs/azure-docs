---
title: Outbound calling with Toll-Free numbers - Azure Communication Services
description: Information about outbound calling limitations with Toll-Free numbers
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Toll-Free telephone numbers and outbound calling
Outbound calling capability with Toll-Free telephone numbers is available in many countries where Azure Communication Services are available. However, there can be some limitaions when trying to place outbound calls with toll-free telephone numbers.

## Why outbound calls from Toll-Free numbers may not work?
Microsoft provides Toll-Free telephone numbers that have outbound calling capabilities, but it's important to note that this feature is only provided on a "best-effort" basis. In some countries and regions, toll-free numbers are considered as an "inbound only" service from regulatory perspective. This means, that in some countries or regions, the receiving carrier may not allow incoming calls from toll-free telephone numbers. Since Microsoft and their carrier-partners do not have control over other carrier networks, we cannot guarantee that outbound calling from toll-free numbers will work in all possible destinations.
