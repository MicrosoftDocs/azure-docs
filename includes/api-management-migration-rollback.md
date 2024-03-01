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

By default, the old and the new managed gateways coexist for approximately 15 mins, which is a small window of time to validate the deployment. During this window, the old and new gateways are both online and serving traffic. This is a free period, and you are not billed during this time. 



Rollbacks will happen automatically if migration fails
Rollback from a successful migration(success is refered to the stv2 instance working correctly, doesnt refer to apps succesfully connecting to APIM) is not possible, but a window of time(not indefinite) is available where both compute instance can live in parallel and serve traffic(for free for a period of time). This is meant to be used for customers to test the success of their applications.
Please lets highlight the side by side migration, In case customer needs full control of rollbacks, maintenance window,  the recommendation is to do a side by side deployment, deploy a new stv2 apim instance, it will double the cost but give them full control.

