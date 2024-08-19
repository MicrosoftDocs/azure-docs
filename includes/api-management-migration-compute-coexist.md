---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/13/2024
ms.author: danlep
---

## Confirm settings before old gateway is purged

For scenarios in which the old gateway is temporarily retained after migration, the old and the new compute created during migration coexist for a short period of time, usually 1 hour or less, that you can use to validate the deployment and that your applications work as expected. When migrating using the **Platform migration** blade in the portal for certain scenarios, you can optionally extend the retention period to 48 hours. 

* During this window, the old and new gateways are both online and serving traffic. You are not billed during this time. 
* Use this window to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address and subnet address space.
* Additionally, check the updated instance's network status to ensure connectivity of the instance to its dependencies. In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network** > **Network status**. If needed, update settings such as UDRs and NSG rules.
* After the window, the old gateway is decommissioned and the new gateway is the only one serving traffic. 
