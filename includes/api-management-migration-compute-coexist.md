---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/13/2024
ms.author: danlep
---

## Confirm settings before old gateway is purged

After successful migration of a VNet-injected API Management instance, the old and the new compute created during migration coexist for a short period of time, approximately 15 mins, which is a small window of time you can use to validate the deployment and that your applications work as expected. (*This window can be extended to 48 hours by contacting Azure support in advance.*) 

* During this window, the old and new gateways are both online and serving traffic. You are not billed during this time. 
* Use this window to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address and subnet address space.
* Additionally, check the updated instance's network status to ensure connectivity of the instance to its dependencies. In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network** > **Network status**. If needed, update settings such as UDRs and NSG rules.
* After the window, the old gateway is decommissioned and the new gateway is the only one serving traffic. 
