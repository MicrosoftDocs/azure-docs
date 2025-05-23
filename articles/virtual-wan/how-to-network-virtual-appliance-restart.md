---
title: 'Azure Virtual WAN: Restart a Network Virtual Appliance (NVA) in the hub'
description: Learn how to restart a Network Virtual Appliance in the Virtual WAN hub.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 04/08/2024
ms.author: wellee
# Customer intent: As someone who has deployed a Network Virtual Appliance (NVA) in Virtual WAN, I want to restart the NVAs running in Virtual WAN.
---

# How to restart a Network Virtual Appliance in an Azure Virtual WAN hub

The following article shows you how to restart Network Virtual Appliances (NVAs) deployed in the Virtual WAN hub. 

> [!Important]
> This document applies to Integrated Network Virtual Appliances deployed in the Virtual WAN hub and does **not** apply to software-as-a-service (SaaS) solutions. See [third-party integrations](third-party-integrations.md) for more information on the differences between Integrated Network Virtual Appliances and SaaS solutions. Reference your SaaS provider's documentation for information related to infrastructure operations available for SaaS solutions.



## Prerequisites

Verify that your deployment meets the following prerequisites before attempting to restart the NVA instances:
* A Network Virtual Appliance is deployed in a Virtual WAN hub. For more information on NVAs deployed in the Virtual WAN hub, see [Integrated NVA documentation](../../articles/virtual-wan/about-nva-hub.md).
* The Network Virtual Appliance's provisioning state is "Succeeded."

## Considerations
* Only one instance of a Virtual WAN NVA can be restarted at a time from Azure portal. If you need to restart multiple NVA instances, wait for an NVA instance to finish restarting before proceeding to the next instance. 
* You can only restart an NVA if the provisioning state of the NVA is succeeded. Wait for any ongoing operations to finish before restarting an NVA instance.  

## Restart the NVA

1. Navigate to your Virtual WAN hub and select **Network Virtual Appliances** under Third-party providers.
2. Select **Manage configurations** for the NVA you want to restart.
3. Select **Instances** under Settings.
4. Select the instance of the NVA you want to restart.
5. Select **Restart**.
6. Confirm the restart by selecting **Yes**.
## Troubleshooting

The following section describes common issues associated with restarting an NVA instance.

* **NVA provisioning state needs to be successful**: If the NVA is in an "Updating" or "Failed" state, you can't execute restart operations on the NVA. Wait for any existing operation on the NVA to finish before trying to restart again.
* **Restart already in progress**: Multiple concurrent restart operations aren't supported. If there's a restart operation running on the NVA resource already, wait for the operation to finish before attempting to restart a different instance.
* **Operations on the NVA are not allowed at this time. Please try again later**: Try the restart-operation again in 15-30 minutes.
* **The NVA operation failed due to an intermittent error**: Try the restart operation again.