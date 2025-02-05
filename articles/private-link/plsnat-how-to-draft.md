---
title: Enable SNAT Bypass for Private Endpoint Traffic through NVA
description: Learn how to enable SNAT bypass for private endpoint traffic passing through a network virtual appliance (NVA) in Azure.
author: abell
ms.author: abell
ms.service: azure-private-link
ms.topic: how-to #Don't change
ms.date: 02/05/2025

#customer intent: As a network administrator, I want to enable SNAT bypass for private endpoint traffic through NVA so that I can ensure symmetric routing and comply with internal logging standards.

---

# How to Guide: Enable SNAT Bypass for Private Endpoint Traffic through NVA

Source network address translation (SNAT) is no longer required for private endpoint destined traffic passing through a network virtual appliance (NVA). You can now configure a tag on your NVA VMs to notify the Microsoft platform that you wish to opt into this feature. This means SNATing will no longer be necessary for private endpoint destined traffic traversing through your NVA.

Enabling this feature provides a more streamlined experience for guaranteeing symmetric routing without impacting non-private endpoint traffic. It also allows you to follow internal compliance standards where the source of traffic origination needs to be available during logging. This feature is available in all regions.


> [!NOTE]
> Enabling SNAT bypass for private endpoint traffic through a Network Virtual Appliance (NVA) will cause a one-time reset of all long-running private endpoint connections established through the NVA. To minimize disruption, it is recommended to enable this feature during a maintenance window. This update will only impact traffic passing through your NVA; private endpoint traffic that bypasses the NVA will not be affected.


## Prerequisites

* An active Azure account with a subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A configured private endpoint in your subscription. For more information on how to create a private endpoint, see [Create a private endpoint](https://docs.microsoft.com/azure/private-link/create-private-endpoint).
* A network virtual appliance (NVA) deployed in your subscription. For the example in this article, a virtual machine (VM) is used as the NVA. For more information on how to deploy a VM, see [Create a Windows virtual machine in the Azure portal](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal).


### Enable SNAT Bypass for Private Endpoint Traffic through NVA

1. **Confirm the type of NVA you are using (VM or VMSS based).**

1. **Add Tag to your relevant resource:**
   - **VM Based:** Add the Resource Tag with a key of `disableSnatOnPL` and a value of `true` to the VM NIC.
   - **VMSS Based:** Add the Resource Tag with a key of `disableSnatOnPL` and a value of `true` to the VM instance.

1. **Validate Scenario.**

## Next Step

> [!div class="nextstepaction"]
> [Create a private endpoint](https://docs.microsoft.com/azure/private-link/create-private-endpoint)




