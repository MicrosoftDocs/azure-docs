---
title: Uninstall VMware HCX in Azure VMware Solution
description: Uninstall VMware HCX in Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy23
ms.date: 12/05/2022
---


# Uninstall VMware HCX in Azure VMware Solution
In this article, you'll learn how to uninstall HCX in Azure VMware solution. You can uninstall HCX from the cloud side through the portal, which removes the existing pairing and software. Removing HCX returns the resources to your private cloud occupied by the HCX virtual appliances. 

Generally, the workflow is to clean-up from the HCX on-premises side first, then clean-up on the HCX Cloud side afterwards. 

## Prerequisites
- Make sure you don't have any active migrations in progress. 
- Ensure that L2 extensions are no longer needed or the networks have been `unstretched` to the destination.  
- For workloads using MON, ensure that you’ve removed the default gateways. Otherwise, it may result in workloads not being able to communicate or function. 
- [Uninstall HCX deployment from Connector on-premises](https://kb.vmware.com/s/article/74869).  
 
## Uninstall HCX
 
1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**. 
1. Select **Get started** for **HCX Workload Mobility**, then select **Uninstall**. 
1. Enter **yes** to confirm the uninstall.
 
    :::image type="content" source="media/hcx/uninstall-vmware-hcx.png" alt-text="Screenshot displaying how to uninstall VMware hcx" lightbox="media/hcx/uninstall-vmware-hcx.png"::: 

After uninstalling HCX, it no longer has the vCenter Server plugin. If necessary, you can reinstall it. 

>[!div class="nextstepaction"] 

>[Configure VMware HCX in Azure VMware Solution](configure-vmware-hcx.md) 

>[VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html)

> [Install and activate VMware HCX in Azure VMware Solution](install-vmware-hcx.md)