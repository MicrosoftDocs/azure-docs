---
title: Upgrade HCX on Azure VMware Solution 
description: This article explains how to upgrade HCX on Azure VMware Solution. 
ms.topic: how-to
ms.date: 11/09/2022
---

# Upgrade HCX on Azure VMware Solution

In this article, you'll learn how to upgrade Azure VMware Solution for **WHAT? WHY WOULD SOMEONE UPGRADE their HCX?**

HCX service updates may include new features, software fixes, or security patches. You can update HCX Connector and HCX Cloud systems during separate maintenance windows, but for optimal compatibility, it's recommended you update both systems together. Apply service updates during a maintenance window where no new HCX operations are queued up. 

## Prerequisites 

For systems requirements, compatibility, and upgrade prerequisites, see the [VMware HCX release notes](https://docs.vmware.com/en/VMware-HCX/index.html).  

For more information about the upgrade path, see the [Product Interoperability Matrix](https://interopmatrix.vmware.com/Upgrade?productId=660) . 

>[!IMPORTANT]
>Starting with HCX 4.4.0, HCX appliances install the VMware Photon Operating System. When upgrading to HCX 4.4.x from an HCX version prior to version 4.4.0, you must also upgrade all Service Mesh appliances. 

## Upgrade HCX 
The upgrade process is in two steps: 
1. Upgrade HCX Manager
1. Upgrade HCX Service Mesh appliances 

### Upgrade HCX manager
The VMware Solution backs up the HCX cloud manager configuration daily. 
HCX manager snapshots during upgrades to HCX 4.5, are taken automatically. HCX retains automatic snapshots for 24 hours before deleting them. For any manual snapshot or help with reverting from a snapshot, create a [support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview). 

To follow the HCX Manager upgrade process, see [Upgrading the HCX Manager](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-02DB88E1-EC81-434B-9AE9-D100E427B31C.html) 

### Upgrade HCX Service Mesh appliances 

Service Mesh appliances are upgraded independently of the managers. These appliances are flagged for new available updates anytime the HCX Manager has newer software available. 

To follow the Service Mesh appliances upgrade process, see [Upgrading the HCX Service Mesh Appliances](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-EF89A098-D09B-4270-9F10-AEFA37CE5C93.html)   

## FAQ 

**Q1**. What is the impact of an HCX upgrade? 

**Answer**: Apply service updates during a maintenance window where no new HCX operations are queued up. The upgrade window accounts for a brief disruption to the Network Extension service, while the appliances are redeployed with the updated code. For individual HCX component upgrade impact, see [Planning for HCX Updates](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-61F5CED2-C347-4A31-8ACB-A4553BFC62E3.html). 

**Q2**: Do I need to upgrade the service mesh appliances? 

**Answer**: The HCX Service Mesh can be upgraded once all paired HCX Manager systems are updated, and all services have returned to a fully converged state. Check HCX release notes for upgrade requirements. Starting with HCX 4.4.0, HCX appliances installed the VMware Photon Operating System. When upgrading to HCX 4.4.x from an HCX version prior to 4.4.0 version, you must upgrade all Service Mesh appliances. 

**Q3**: How do I roll back HCX upgrade using a snapshot? 

**Answer**: See [Rolling Back an Upgrade Using Snapshots](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-B34728B9-B187-48E5-AE7B-74E92D09B98B.html).  On the cloud side, open a [support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to roll back the upgrade. 

## Next steps 
[HCX Service Update Procedures](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-77111C61-EC4C-4C8C-8340-5828CC4D489D.html)   

[Updating VMware HCX](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-508A94B2-19F6-47C7-9C0D-2C89A00316B9.html) 