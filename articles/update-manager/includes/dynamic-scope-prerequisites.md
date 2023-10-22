---
author: SnehaSudhir
ms.author: sudhirsneha
ms.topic: include
ms.date: 08/02/2023
---


## Prerequisites

#### [Azure VMs](#tab/avms)

- Patch Orchestration must be set to Customer Managed Schedules. This sets patch mode to AutomaticByPlatform and the **BypassPlatformSafetyChecksOnUserSchedule** = *True*.
- Associate a Schedule with the VM.
             
#### [Arc-enabled VMs](#tab/arcvms)

There are no prerequisites for patch orchestration. However, you must associate a schedule with the VM for Schedule patching. For more information, see [Configure schedule patching on Azure VMs to ensure business continuity](../prerequsite-for-schedule-patching.md).

---
