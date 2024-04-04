---
title: Upgrade HCX on Azure VMware Solution 
description: This article explains how to upgrade HCX on Azure VMware Solution. 
ms.topic: how-to
ms.date: 12/20/2023
ms.custom: engagement-fy23
---

# Upgrade HCX on Azure VMware Solution

In this article, you learn how to upgrade Azure VMware Solution for HCX service updates, which can include new features, software fixes, or security patches. 

You can update HCX Connector and HCX Cloud systems during separate maintenance windows, but for optimal compatibility, we recommend you update both systems together. Apply service updates during a maintenance window where no new HCX operations are queued up. 

>[!IMPORTANT]
>Starting with HCX 4.4.0, HCX appliances install the VMware Photon Operating System. When upgrading to HCX 4.4.x or later from an HCX version prior to version 4.4.0, you must also upgrade all Service Mesh appliances. 

## System requirements 

- For systems requirements, compatibility, and upgrade prerequisites, see the [VMware HCX release notes](https://docs.vmware.com/en/VMware-HCX/index.html).  

- For more information about the upgrade path, see the [Product Interoperability Matrix](https://interopmatrix.vmware.com/Upgrade?productId=660). 
- For information regarding VMware product compatibility by version, see the [Compatibility Matrix](https://interopmatrix.vmware.com/Interoperability?col=660,&row=0,).
- Review VMware Software Versioning, Skew and Legacy Support Policies [here](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-skew-policy/GUID-787FB2A1-52AF-483C-B595-CF382E728674.html).

- Ensure HCX manager and site pair configurations are healthy.  

- As part of HCX update planning, and to ensure that HCX components are updated successfully, review the service update considerations and requirements. For planning HCX upgrade, see [Planning for HCX Updates](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-61F5CED2-C347-4A31-8ACB-A4553BFC62E3.html). 

- Ensure that you have a backup and snapshot of HCX connector in the on-premises environment, if applicable.
- For more information, see the [HCX support policy for legacy vSphere environment](https://kb.vmware.com/s/article/82702).
- Check that you are using the [latest VMware HCX version validated with Azure VMware Solution](introduction.md#vmware-software-versions).

### Backup HCX 
- Azure VMware Solution backs up HCX Cloud Manager configuration daily.


- Use the appliance management interface to create backup of HCX in on-premises, see [Backing Up HCX Manager](https://docs.vmware.com/en/VMware-HCX/4.4/hcx-user-guide/GUID-6A9D1451-3EF3-4E49-B23E-A9A781E5214A.html). You can use the configuration backup to restore the appliance to its state before the backup. The contents of the backup file supersede configuration changes made before restoring the appliance. 
 
- HCX cloud manager snapshots are taken automatically during upgrades to HCX 4.4 or later. HCX retains automatic snapshots for 24 hours before deleting them. To take a manual snapshot on HCX Cloud Manager or help with reverting from a snapshot, [create a support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview). 

## Upgrade HCX 
The upgrade process is in two steps: 
1. Upgrade HCX Manager  
      1. HCX cloud manager  
      1. HCX connector (You can update site-paired HCX Managers simultaneously) 
1. Upgrade HCX Service Mesh appliances 

### Upgrade HCX manager
The HCX update is first applied to the HCX Manager systems.
 
**What to expect**
- HCX manager is rebooted as part of the upgrade process.  
- HCX vCenter Plugins are updated.  
- There's no data-plane outage during this procedure.

**Prerequisites**
- Verify the HCX Manager system reports healthy connections to the connected (vCenter Server, NSX Manager (if applicable). 
- Verify the HCX Manager system reports healthy connections to the HCX Interconnect service components. (Ensure HCX isn't in an out of sync state)
- Verify that Site Pair configurations are healthy. 
- No VM migrations should be in progress during this upgrade.

**Procedure**

To follow the HCX Manager upgrade process, see [Upgrading the HCX Manager](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-02DB88E1-EC81-434B-9AE9-D100E427B31C.html) 

### Upgrade HCX Service Mesh appliances 

While Service Mesh appliances are upgraded independently to the HCX Manager, they must be upgraded. These appliances are flagged for new available updates anytime the HCX Manager has newer software available.

**What to expect**

- Service VMs are rebooted as part of the upgrade.
- There's a small data plane outage during this procedure.
- In-service upgrade of Network-extension can be considered to reduce downtime during HCX Network extension upgrades. 

**Prerequisites**
- All paired HCX Managers on both the source and the target site are updated and all services are returned to a fully converged state. 
- Service Mesh appliances must be initiated using the HCX plug-in of vCenter or the 443 console at the source site 
- No VM migrations should be in progress during this upgrade. 

**Procedure**
 
To follow the Service Mesh appliances upgrade process, see [Upgrading the HCX Service Mesh Appliances](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-EF89A098-D09B-4270-9F10-AEFA37CE5C93.html)   

## FAQ 

### What is the impact of an HCX upgrade? 

Apply service updates during a maintenance window where no new HCX operations and migration are queued up. The upgrade window accounts for a brief disruption to the Network Extension service, while the appliances are redeployed with the updated code.  
For individual HCX component upgrade impact, see [Planning for HCX Updates](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-61F5CED2-C347-4A31-8ACB-A4553BFC62E3.html). 

### Do I need to upgrade the service mesh appliances? 

The HCX Service Mesh can be upgraded once all paired HCX Manager systems are updated, and all services are returned to a fully converged state. Check HCX release notes for upgrade requirements. Starting with HCX 4.4.0, HCX appliances installed the VMware Photon Operating System. When upgrading to HCX 4.4.x or later from an HCX version prior to 4.4.0 version, you must upgrade all Service Mesh appliances. 

### How do I roll back HCX upgrade using a snapshot? 

See [Rolling Back an Upgrade Using Snapshots](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-B34728B9-B187-48E5-AE7B-74E92D09B98B.html).  On the cloud side, open a [support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to roll back the upgrade. 

## Next steps 
[Software Versioning, Skew and Legacy Support Policies](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-skew-policy/GUID-787FB2A1-52AF-483C-B595-CF382E728674.html)  

[Updating VMware HCX](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-508A94B2-19F6-47C7-9C0D-2C89A00316B9.html) 
