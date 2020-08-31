---
title: include file
description: include file
services: Communication Services
author: dademath
manager: nimag
ms.service: Communication Services
ms.subservice: Communication Services
ms.date: 07/28/2020
ms.topic: include
ms.custom: include file
ms.author: dademath
---

## Send a SMS message and enable Delivery Reports

To enable Delivery Report on an SMS we will add send options, specifically `enableDeliveryReport` to it. For more information sending SMS, see [here](../send-sms.md)

1. Adding `send options` to our send method with `enableDeliveryReport` set to `true`
2. On success, the send method will return a `MessageId` which we can use to correlate with the `DeliveryReport` sent to `Event Grid`.

```java
// todo
```