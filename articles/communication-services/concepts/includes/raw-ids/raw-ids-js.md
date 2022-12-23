---
title: include file
description: include file
services: azure-communication-services
author: ostoliarova-msft
manager: rajuanitha88

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/23/2022
ms.topic: include
ms.custom: include file
ms.author: ostoliarova
---

### Creating CommunicationIdentifier and retrieving Raw ID
*CommunicationIdentifier* can be created from a Raw ID and a Raw ID can be retrieved from a certain type of *CommunicationIdentifier*. It removes the need of any custom serialization methods that might use or omit certain object properties. For example, the `MicrosoftTeamsUserIdentifier` has multiple properties such as `IsAnonymous` or `Cloud` or methods to retrieve these values (depending on a platform). Using methods provided by Identity SDK guarantees that the way of serializing identifiers will stay canonical and consistent even if more properties will be added.

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