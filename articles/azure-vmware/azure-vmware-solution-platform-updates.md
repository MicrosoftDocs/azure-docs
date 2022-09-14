---
title: Platform updates for Azure VMware Solution
description: Learn about the platform updates to Azure VMware Solution.
ms.topic: reference
ms.custom: references_regions
ms.service: azure-vmware
ms.date: 08/26/2022
---

# Platform updates for Azure VMware Solution

Azure VMware Solution will apply important updates starting in March 2021. You'll receive a notification through Azure Service Health that includes the timeline of the maintenance. For more information, see [Host maintenance and lifecycle management](concepts-private-clouds-clusters.md#host-maintenance-and-lifecycle-management).

## July 8, 2022

HCX cloud manager in Azure VMware Solution can now be accessible over a public IP address. You can pair HCX sites and create a service mesh from on-premises to Azure VMware Solution private cloud using Public IP.

HCX with public IP is especially useful in cases where On-premises sites are not connected to Azure via Express Route or VPN. HCX service mesh appliances can be configured with public IPs to avoid lower tunnel MTUs due to double encapsulation if a VPN is used for on-premises to cloud connections.

For more information, please see [Enable HCX over the internet](./enable-hcx-access-over-internet.md)


## July 7, 2022

All new Azure VMware Solution private clouds are now deployed with VMware vCenter Server version 7.0 Update 3c and ESXi version 7.0 Update 3c.

Any existing private clouds will be upgraded to those versions. For more information, please see [VMware ESXi 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-70u3c-release-notes.html) and [VMware vCenter Server 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3c-release-notes.html).

You'll receive a notification through Azure Service Health that includes the timeline of the upgrade. You can reschedule an upgrade as needed. This notification also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services.

## June 7, 2022

All new Azure VMware Solution private clouds in regions (East US2, Canada Central, North Europe, and Japan East), are now deployed in with VMware vCenter Server version 7.0 Update 3c and ESXi version 7.0 Update 3c.

Any existing private clouds in the above mentioned regions will also be upgraded to these versions. For more information, please see [VMware ESXi 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-vcenter-server-70-release-notes.html) and [VMware vCenter Server 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3c-release-notes.html).

## May 23, 2022

All new Azure VMware Solution private clouds in regions (Germany West Central, Australia East, Central US and UK West), are now deployed with VMware vCenter Server version 7.0 Update 3c and ESXi version 7.0 Update 3c.

Any existing private clouds in the previously mentioned regions will be upgraded to those versions. For more information, please see [VMware ESXi 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-70u3c-release-notes.html) and [VMware vCenter Server 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3c-release-notes.html).

You'll receive a notification through Azure Service Health that includes the timeline of the upgrade. You can reschedule an upgrade as needed. This notification also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services.

## May 9, 2022

All new Azure VMware Solution private clouds in regions (France Central, Brazil South, Japan West, Australia Southeast, Canada East, East Asia, and Southeast Asia), are now deployed with VMware vCenter Server version 7.0 Update 3c and ESXi version 7.0 Update 3c.

Any existing private clouds in the previously mentioned regions will be upgraded to those versions. For more information, please see [VMware ESXi 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-70u3c-release-notes.html) and [VMware vCenter Server 7.0 Update 3c Release Notes](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3c-release-notes.html).

You'll receive a notification through Azure Service Health that includes the timeline of the upgrade. You can reschedule an upgrade as needed. This notification also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services.

## February 18, 2022

Per VMware security advisory [VMSA-2022-0004](https://www.vmware.com/security/advisories/VMSA-2022-0004.html), multiple vulnerabilities in VMware ESXi have been reported to VMware.

To address the vulnerabilities (CVE-2021-22040 and CVE-2021-22041) reported in this VMware security advisory, ESXi hosts have been patched in all Azure VMware Solution private clouds to ESXi 6.7, Patch Release ESXi670-202111001. All new Azure VMware Solution private clouds are deployed with the same version.

For more information on this ESXi version, see [VMware ESXi 6.7, Patch Release ESXi670-202111001](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202111001.html).

No further action is required.

## December 22, 2021

Azure VMware Solution (AVS) has completed maintenance activities to address critical vulnerabilities in Apache Log4j. 
The fixes documented in the VMware security advisory [VMSA-2021-0028.6](https://www.vmware.com/security/advisories/VMSA-2021-0028.html) to address CVE-2021-44228 and CVE-2021-45046 have been applied to these AVS managed VMware products: vCenter Server, NSX-T Data Center, SRM and HCX. 
We strongly encourage customers to apply the fixes to on-premises HCX connector appliances.
 
We also recommend customers to review the security advisory and apply the fixes for other affected VMware products or workloads.
 
If you need any assistance or have questions, please [contact us](https://portal.azure.com/#home).



## December 12, 2021

VMware has announced a security advisory [VMSA-2021-0028](https://www.vmware.com/security/advisories/VMSA-2021-0028.html), addressing a critical vulnerability in Apache Log4j identified by CVE-2021-44228.

Azure VMware Solution is actively monitoring this issue. We are addressing this issue by applying VMware recommended workarounds or patches for AVS managed VMware components as they become available.

Please note that you may experience intermittent connectivity to these components when we apply a fix.

We strongly recommend that you read the advisory and patch or apply the recommended workarounds for any additional VMware products that you may have deployed in Azure VMware Solution.

If you need any assistance or have questions, please [contact us](https://portal.azure.com).

## November 23, 2021

Per VMware security advisory [VMSA-2021-0027](https://www.vmware.com/security/advisories/VMSA-2021-0027.html), multiple vulnerabilities in VMware vCenter Server have been reported to VMware.

To address the vulnerabilities (CVE-2021-21980 and CVE-2021-22049) reported in VMware security advisory, vCenter Server has been updated to 6.7 Update 3p release in all Azure VMware Solution private clouds.

For more information, see [VMware vCenter Server 6.7 Update 3p Release Notes](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-vcenter-server-67u3p-release-notes.html)

No further action is required.


## September 21, 2021
Per VMware security advisory [VMSA-2021-0020](https://www.vmware.com/security/advisories/VMSA-2021-0020.html), multiple vulnerabilities in the VMware vCenter Server have been reported to VMware.
 
To address the vulnerabilities (CVE-2021-21991, CVE-2021-21992, CVE-2021-21993, CVE-2021-22005, CVE-2021-22006, CVE-2021-22007, CVE-2021-22008, CVE-2021-22009, CVE-2021-22010, CVE-2021-22011, CVE-2021-22012,CVE-2021-22013, CVE-2021-22014, CVE-2021-22015, CVE-2021-22016, CVE-2021-22017, CVE-2021-22018, CVE-2021-22019, CVE-2021-22020) reported in VMware security advisory [VMSA-2021-0020](https://www.vmware.com/security/advisories/VMSA-2021-0020.html), vCenter Server has been updated to 6.7 Update 3o in all Azure VMware Solution private clouds. All new Azure VMware Solution private clouds are deployed with vCenter Server version 6.7 Update 3o.
 
For more information, see [VMware vCenter Server 6.7 Update 3o Release Notes](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-vcenter-server-67u3o-release-notes.html)
 
No further action is required.

## September 10, 2021

All new Azure VMware Solution private clouds are now deployed with ESXi version ESXi670-202103001 (Build number: 17700523). 
ESXi hosts in existing private clouds have been patched to this version.

For more information on this ESXi version, see [VMware ESXi 6.7, Patch Release ESXi670-202103001](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202103001.html).




## July 23, 2021

All new Azure VMware Solution private clouds are now deployed with NSX-T Data Center version [!INCLUDE [nsxt-version](includes/nsxt-version.md)]. NSX-T Data Center version in existing private clouds will be upgraded through September, 2021 to NSX-T Data Center [!INCLUDE [nsxt-version](includes/nsxt-version.md)] release.
 
You'll receive an email with the planned maintenance date and time. You can reschedule an upgrade. The email also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services. 

For more information on this NSX-T Data Center version, see [VMware NSX-T Data Center [!INCLUDE [nsxt-version](includes/nsxt-version.md)] Release Notes](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/rn/VMware-NSX-T-Data-Center-312-Release-Notes.html).




## May 25, 2021
Per VMware security advisory [VMSA-2021-0010](https://www.vmware.com/security/advisories/VMSA-2021-0010.html), multiple vulnerabilities in VMware ESXi and vSphere Client (HTML5) have been reported to VMware. 

To address the vulnerabilities ([CVE-2021-21985](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-21985) and [CVE-2021-21986](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-21986)) reported in VMware security advisory [VMSA-2021-0010](https://www.vmware.com/security/advisories/VMSA-2021-0010.html), vCenter Server has been updated in all Azure VMware Solution private clouds.

No further action is required.

## May 21, 2021
 
Azure VMware Solution service will do maintenance work through May 23, 2021, to apply important updates to the vCenter Server in your private cloud.  You'll receive a notification through Azure Service Health that includes the timeline of the maintenance for your private cloud.
 
During this time, VMware vCenter Server will be unavailable and you won't be able to manage VMs (stop, start, create, or delete). It's recommended that, during this time, you don't plan any other activities like scaling up private cloud, creating new networks, and so on, in your private cloud.
 
There is no impact to workloads running in your private cloud.


## April 26, 2021
All new Azure VMware Solution private clouds are now deployed with VMware vCenter Server version 6.7U3l and NSX-T Data Center version 2.5.2. We're not using NSX-T Data Center 3.1.1 for new private clouds because of an identified issue in NSX-T Data Center 3.1.1 that impacts customer VM connectivity. 

The VMware recommended mitigation was applied to all existing private clouds currently running NSX-T Data Center 3.1.1 on Azure VMware Solution. The workaround has been confirmed that there's no impact to customer VM connectivity.

## March 24, 2021
All new Azure VMware Solution private clouds are deployed with VMware vCenter Server version 6.7U3l and NSX-T Data Center version 3.1.1. Any existing private clouds will be updated and upgraded **through June 2021** to the releases mentioned above.

You'll receive an email with the planned maintenance date and time. You can reschedule an upgrade. The email also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services.  An hour before the upgrade, you'll receive a notification and then again when it finishes.

## March 15, 2021 

- Azure VMware Solution service will do maintenance work **through March 19, 2021,** to update the vCenter Server in your private cloud to vCenter Server 6.7 Update 3l version.

- VMware vCenter Server will be unavailable during this time, so you can't manage your VMs (stop, start, create, delete) or private cloud scaling (adding/removing servers and clusters). However, VMware High Availability (HA) will continue to operate to protect existing VMs. 
 
For more information on this vCenter version, see [VMware vCenter Server 6.7 Update 3l Release Notes](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-vcenter-server-67u3l-release-notes.html).

## March 4, 2021

- Azure VMware Solution will apply the [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html) to existing privates **through March 15, 2021**.

- Documented workarounds for the vSphere stack, as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html), will also be applied **through March 15, 2021**.

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During maintenance, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter Server and clear automatically as the maintenance progresses.

## Post update
Once complete, newer versions of VMware components appear. If you notice any issues or have any questions, contact our support team by opening a support ticket.