---
title: Azure Communication Services - known issues Call Automation
description: Learn more about Azure Communication Services Call automation known issues
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 02/24/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Known issues in Azure Communication Services calling Call Automation API


- The only authentication currently supported for server applications is to use a connection string.

- Make calls only between entities of the same Communication Services resource. Cross-resource communication is blocked.

- Calls between tenant users of Microsoft Teams and Communication Services users or server application entities aren't allowed.

- If an application dials out to two or more PSTN identities and then quits the call, the call between the other PSTN entities drops.
