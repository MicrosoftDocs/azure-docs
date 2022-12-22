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

```javascript
import { createIdentifierFromRawId } from '@azure/communication-common';

// CommunicationIdentifier type
var user;
var rawId = getIdentifierRawId(user);
```

### Instantiate CommunicationUserIdentifier from a Raw ID

```javascript
import { getIdentifierRawId } from '@azure/communication-common';

var rawId = "8:orgid:45ab2481-1c1c-4005-be24-0ffb879b1130";
var user = getIdentifierRawId(rawId);
```