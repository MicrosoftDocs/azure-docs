---
title: Azure Communication Services Call Recording overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Recording feature and APIs.
author: joseys
manager: anvalent
services: azure-communication-services

ms.author: joseys
ms.date: 04/13/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Calling Recording overview

Call Recording provides a set of server APIs to start, stop, pause and resume recording, which can be triggered from server-side business logic or events received from user actions. Recorded media output is in MP4 Audio+Video format (same as Teams recordings). Notifications that a recording media and meta-data files are ready for retrieval are provided via Event Grid. Recordings are stored for 48 hours on built-in temporary storage, for retrieval and movement to a long-term storage solution of choice. 
