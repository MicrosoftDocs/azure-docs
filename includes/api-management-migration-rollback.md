---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 03/01/2024
ms.author: danlep
---
## Video


## Roll back to stv1 platform


If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. If the migration completes successfully (the platform version of the instance shows as `stv2` or `stv2.1` and the status as **Online**), a rollback is not possible.

By default, the old and the new managed gateways created during migration coexist for approximately 15 mins, which is a small window of time to validate the deployment. For VNet-injected instance **only**, this window can be extended to 48 hours by contacting Azure support in advance. During this window, the old and new gateways are both online and serving traffic. You are not billed during this time. After the window, the old gateway is decommissioned and the new gateway is the only one serving traffic. 

If you need full control of rollback and the time when old and new gateways coexist, the recommendation is to do a side-by-side deployment. Deploy a new `stv2` instance and then migrate your APIs and configuration settings to the new instance. You decide when to decommission the original instance. This approach increases the costs because of an additional instance, but gives you full control over the migration process.

