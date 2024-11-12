---
title: Target capacity
description: Learn about specifying target capcity for your Compute Fleet.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

# Target capacity 

Compute Fleet allows you to set individual target capacity for Spot and pay-as-you-go VM types. This capacity could be managed individually based on your workloads or application requirement.  

You can specify target capacity using VM instances. 

Compute Fleet allows you to modify the target capacity for Spot and pay-as-you-go VMs based on your Compute Fleet configuration. For more information, see [Modify your Compute Fleet](#modify-your-compute-fleet) for details related to modifying target capacity. 


## Minimum starting capacity 

You can set your Compute Fleet to deploy Spot VMs, pay-as-you-go VMs, or a combination of both only if the Compute Fleet can deploy the minimum starting capacity requested against the actual target capacity. The deployment fails if capacity becomes unavailable to fulfill the minimum starting capacity. 

If your requested target capacity is 100 VM instances and minimum starting capacity is set to 20 VM instances, the deployment succeeds only if Compute Fleet can fulfill the starting capacity ask of 20 VM instances. Otherwise, the request fails. 

You may not be able to set the minimum starting capacity if you choose to configure the Compute Fleet with capacity preference type as *Maintain capacity*. 
