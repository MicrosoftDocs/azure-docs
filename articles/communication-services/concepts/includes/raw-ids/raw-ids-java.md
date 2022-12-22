---
title: include file
description: include file
services: azure-communication-services
author: ostoliarova-msft
manager: rajuanitha88

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/15/2022
ms.topic: include
ms.custom: include file
ms.author: ostoliarova
---

### Get Raw ID from CommunicationUserIdentifier

```java
CommunicationUserIdentifier user = new CommunicationUserIdentifier("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130");

String rawId = identifier.getRawId();
```

### Instantiate CommunicationUserIdentifier from a Raw ID

```java
String rawId = "8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130";
CommunicationUserIdentifier user =  CommunicationIdentifier.fromRawId(rawId);
```