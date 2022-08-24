---
title: include file
description: include file
services: azure-communication-services
author: domessin
manager: rejooyan

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/24/2022
ms.topic: include
ms.custom: include file
ms.author: domessin
---

### Communication User identifier

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../quickstarts/access-tokens.md). It is the only identifier used if your  application doesn't use Microsoft Teams interop or PSTN features.


#### Basic usage
```csharp
// at some point you will have created a new user identity in the service
CommunicationUserIdentifier newUser = await identityClient.CreateUser();

// you can create another identifier that represents the same user
var sameUser = new CommunicationUserIdentifier(newUser.Id);

// print the user Id
Console.WriteLine(sameUser.Id);
```

#### API reference

You can read the full reference documentation here: [CommunicationUserIdentifier](https://docs.microsoft.com/en-us/dotnet/api/azure.communication.communicationuseridentifier?view=azure-dotnet)

https://docs.microsoft.com/en-us/dotnet/api/azure.communication.communicationuseridentifier?view=azure-dotnet
https://docs.microsoft.com/en-us/javascript/api/@azure/communication-common/communicationuseridentifier?view=azure-node-latest
https://docs.microsoft.com/en-us/python/api/azure-communication-chat/azure.communication.chat.communicationuseridentifier?view=azure-python
https://docs.microsoft.com/en-us/java/api/com.azure.communication.common.communicationuseridentifier?view=azure-java-stable