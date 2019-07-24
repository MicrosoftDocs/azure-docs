---
title: Azure VMware Solution by Virtustream tutorial - Use vMotion
description: In this Azure VMware Solution (AVS) by Virtustream tutorial, you learn how to enable and perform vMotion with a private cloud.
services:
author: v-konak

ms.service: vmware-virtustream
ms.topic: tutorial
ms.date: MM/DD/YYYY
ms.author: v-konak
ms.custom: 


#Customer intent: As a VMware administrator or user of an AVS by Virtustream private cloud, I want to vMotion VMs to and from a private cloud.

---

# Tutorial: vMotion from on-premises to an Azure VMware Solution (AVS) by Virtustream private cloud.

In this tutorial, we will walk you through on how to utilize the cross-vcenter workload migration utility to move your on-prem VM(s) into your newly deployed and connected AVSV private cloud.  You learn how to:

> [!div class="checklist"]
> * Launch the cross-vcenter workload migration tool
> * Cross-vCenter vMotion a VM from on-prem to AVSV private cloud

Once completed, your VM will be running your AVSV private cloud.

## Before you Begin 
This tutorial assumes the below [requirements](#requirements) have been met and that the environment is ready to perform a vMotion from your on-prem environment to your AVSV private cloud.

## Requirements
- On-Prem version [vSphere 6.0U3 or greater Enterprise Plus](https://kb.vmware.com/s/article/2106952)
- **[ExpressRoute into Azure](tutorials-access-private-cloud.md)** <-Needs actual link->
- [L3-Enabled vMotion vmKernel stack.](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vcenterhost.doc/GUID-5211FD4B-256B-4D9F-B5A2-F697A814BF64.html#GUID-5211FD4B-256B-4D9F-B5A2-F697A814BF64)
- System that can connect to both on-prem vCenter and SDDC vCenter.
- [System must be able to run java jvm for cross vcenter vmotion utility.](https://labs.vmware.com/flings/cross-vcenter-workload-migration-utility)
    - RAW API call for cross-vcenter vmotion is optional, not defined in this tutorial.

### Optional
- [L2VPN for VM network – Optional](concepts-networking.md)
- Setup Azure VM to run migration utility

## Steps
1. Download Cross-vCenter workload migration utility.
1. Launch Cross-vCenter workload migration utility.
1. Access Cross-vCenter workload migration utility web interface.
1. Register On-Prem vCenter
1. Register AVSV vCenter
1. Insert Parameters for vMotion
1. Execute vMotion

## Next steps <this is always called Next steps and a short statement and the following div puts it into a blue box that is an active link that can be selected>

> [!div class="nextstepaction"]
> [link description][relative link]

<!-- LINKS - external-->

<!-- LINKS - internal -->
