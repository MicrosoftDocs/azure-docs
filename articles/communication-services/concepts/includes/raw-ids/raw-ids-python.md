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

```python
user = MicrosoftTeamsUserIdentifier(user_id='45ab2481-1c1c-4005-be24-0ffb879b1130', cloud='PUBLIC', is_anonymous=False)
raw_id = user.raw_id
```

### Instantiate CommunicationUserIdentifier from a Raw ID

```python

raw_id = "8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130"
user = identifier_from_raw_id(raw_id)
```
