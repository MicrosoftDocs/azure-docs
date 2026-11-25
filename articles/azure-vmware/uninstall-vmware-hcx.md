---
title: Uninstall VMware HCX in Azure VMware Solution
description: Uninstall VMware HCX in Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/02/2026
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: "As a cloud administrator, I want to uninstall VMware HCX from Azure VMware Solution, so that I can clean up resources and ensure proper network functionality after migration tasks are completed."
---


# Uninstall VMware HCX in Azure VMware Solution
In this article, you learn how to uninstall HCX in Azure VMware Solution. You can uninstall HCX from the cloud side through the portal, which removes the HCX Cloud Manager and software. Generally, you need to perform cleanup from the HCX on-premises side first before uninstalling the Azure VMware Solution HCX Add-Ons. 

Generally, the workflow cleans up from the HCX on-premises side first, then clean up on the HCX Cloud side afterwards. 

> [!NOTE]
> To uninstall the HCX in your Azure VMware Solution private cloud, you must have an Azure role-based access control (RBAC) role that includes the **Microsoft.AVS/privateClouds/addOns/delete** permission at the private-cloud scope. 

## Prerequisites

> [!IMPORTANT]
> Move workloads to standalone, non-HCX segments and verify their connectivity before removing MON default gateways or network extensions. Reversing this order can break workload connectivity. This condition includes Gen2 and Fleet workloads that depend on HCX network-extension segments or MON-dependent HCX Tier-1 (T1) routing. 
> Don't manually delete HCX Manager, Interconnect, Network Extension, or Mobility Agent appliances from vCenter as the normal removal path. If any cleanup task fails, an appliance remains unexpectedly, or manual deletion appears necessary, stop and open a Microsoft support request. Don't proceed to the Azure portal to uninstall until the failed cleanup is resolved. 

Complete the following steps from each affected on-premises HCX Connector before uninstalling VMware HCX from your Azure VMware Solution private cloud.
1. Complete or cancel HCX migrations and verify that the count of active HCX migrations is 0. Confirm that no HCX migrations are in progress. 
1. Remove any HCX Disaster Recovery protections and verify that the count of Disaster Recovery protections is 0. 
1. Identify and move any HCX dependent workloads. In vCenter, check the network each workload VM uses. In NSX, check the NSX segment and Tier-1 gateway that network connects to. Identify every VM attached to an HCX network-extension segment or dependent on MON routing, including Gen2 and Fleet workloads. Move these VMs to standalone, non-HCX segments with routing that doesn't depend on HCX. Verify workload connectivity and confirm that the count of attached workload VMs is 0 before continuing. 
1. Remove HCX MON default gateways in HCX. After verifying that no workloads depend on them, remove the HCX MON default gateways by disabling MON in the Network Extension tab. Locate each extended network segment with MON enabled and disable MON using the toggle. You must perform this step for each extended network segment with MON enabled.
1. Unextend networks in HCX. In **Network Extension**, unextend all remaining L2 network extensions. Verify that the count of stretched networks is 0.
1. Delete all service meshes and verify appliance cleanup. Under **Infrastructure** > **Interconnect** > **Service Mesh**, select each mesh in turn. Select delete for every service mesh, including when more than one exists, and wait for each deletion to complete successfully. Verify that the count of service meshes is 0. Check the cloud appliance inventory in vCenter to confirm that the associated Interconnect and Network Extension appliances and Mobility Agent hosts are removed. The HCX Cloud Manager remains until the Azure portal uninstall. If cleanup is incomplete, stop and contact Microsoft Support rather than deleting appliances manually.
1. Delete HCX site pairs. Under **Infrastructure** > **Site Pairs**, select **Delete Site Pair** for each remaining pairing. Verify that the count of site pairs is 0. 

## Uninstall HCX in Azure VMware Solution private cloud
 
1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**. 
1. Select **Migration Using VMware HCX**, and then select **Uninstall**. 
1. Enter **yes** to confirm the uninstall.
 
    :::image type="content" source="media/hcx/uninstall-vmware-hcx.png" alt-text="Screenshot displays how to uninstall VMware hcx" lightbox="media/hcx/uninstall-vmware-hcx.png"::: 
 
After you uninstall HCX, it no longer has the vCenter Server plugin. If necessary, you can reinstall HCX in your Azure VMware Solution by using the Azure portal or Azure CLI.   

>[!div class="nextstepaction"] 

>[Configure VMware HCX in Azure VMware Solution](configure-vmware-hcx.md) 

>[VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html)

> [Install and activate VMware HCX in Azure VMware Solution](install-vmware-hcx.md)
