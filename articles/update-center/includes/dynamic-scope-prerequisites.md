---
author: SnehaSudhir
ms.author: sudhirsneha
ms.topic: include
ms.date: 08/02/2023
---

 Ensure to register the preview feature in your Azure subscription by following these steps:

  1. Sign in to the [Azure portal](https://portal.azure.com).
  1. In search, enter and select **Subscriptions**.
  1. In **Subscriptions** home page, select your subscription from the list.
  1. In the **Subscription | Preview features** page, under **Settings**, select **Preview features**.
  1. Search for **Dynamic scoping**. 
  1. Select **Register** and then select **OK** to get started with Dynamic scope (preview).

#### [Azure VMs](#tab/avms)

- Patch Orchestration must be set to Customer Managed Schedules (Preview). This sets patch mode to AutomaticByPlatform and the **BypassPlatformSafetyChecksOnUserSchedule** = *True*.
- Associate a Schedule with the VM.
             
#### [Arc-enabled VMs](#tab/arcvms)

There are no pre-requisities for patch orchestration. However, you must associate a schedule with the VM for Schedule patching. For more information, see [Configure schedule patching on Azure VMs to ensure business continuity](../prerequsite-for-schedule-patching.md).

---