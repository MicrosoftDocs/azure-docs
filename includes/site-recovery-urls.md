---
title: include file
description: include file
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: include
ms.date: 09/12/2018
ms.author: raynew

---
Name | Commercial URL | Government URL | Description
--- | --- | --- | ---
Azure Active Directory | ``login.microsoftonline.com`` | ``login.microsoftonline.us`` | Used for access control and identity management by using Azure Active Directory. 
Backup | ``*.backup.windowsazure.com`` | ``*.backup.windowsazure.us`` | Used for replication data transfer and coordination.
Replication | ``*.hypervrecoverymanager.windowsazure.com`` | ``*.hypervrecoverymanager.windowsazure.us``  | Used for replication management operations and coordination.
Storage | ``*.blob.core.windows.net`` | ``*.blob.core.usgovcloudapi.net``  | Used for access to the storage account that stores replicated data.
Telemetry (optional) | ``dc.services.visualstudio.com`` | ``dc.services.visualstudio.com`` | Used for telemetry.
Time synchronization | ``time.windows.com`` | ``time.nist.gov`` | Used to check time synchronization between system and global time in all deployments.


