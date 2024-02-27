---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/27/2024
ms.author: danlep
---
## Verify migration

* To verify that the migration was successful, when the status changes to **Online**, check the [platform version](../articles/api-management/compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2` or `stv2.1`. 
* Additionally, check the Network status to ensure connectivity of the instance to its dependencies. In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network** > **Network status**.
