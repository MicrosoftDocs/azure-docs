---
title: Capture A Local Video Stream
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

> [!WARNING]
> This document is under construction.


## Instantiate Your Calling Client

In this quickstart, you'll learn how to instantiate your Azure Communication Services calling client.


### Prerequisites

- An active Azure Communication Services resource. [This quickstart](./get-started.md) shows you how to create and manage your first resource.
- A camera-equipped device with the latest version of Chrome or Edge installed.
- The ACS client-side JS SDK.
- A user token to instantiate the calling sdk. Learn how to generate user access tokens from [User Access Tokens](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/user-access-tokens?branch=pr-en-us-104477).


### Instantiate Your Calling Client

```javascript
    var spool = require('@skype/spool-sdk');
    var common = require('@azure/communication-common')
    
    //You will need to generate an access token
    
    const tokenCredential = new CommunicationUserCredential(token);
    const callClient = await CallingFactory.create(tokenCredential);
    
```

### Next Steps

- Capture your local media stream
- Place a call
- Send an SMS message

