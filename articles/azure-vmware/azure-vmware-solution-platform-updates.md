---
title: Platform updates for Azure VMware Solution
description: Learn about the platform updates to Azure VMware Solution.
ms.topic: reference
ms.date: 07/23/2021
---

# Platform updates for Azure VMware Solution

Azure VMware Solution will apply important updates starting in March 2021. You'll receive a notification through Azure Service Health that includes the timeline of the maintenance. For more information, see [Host maintenance and lifecycle management](concepts-private-clouds-clusters.md#host-maintenance-and-lifecycle-management).

## July 23, 2021

All new Azure VMware Solution private clouds are now deployed with NSX-T version [!INCLUDE [nsxt-version](nsxt-version.md)]. NSX-T version in existing private clouds will be upgraded through September, 2021 to NSX-T [!INCLUDE [nsxt-version](nsxt-version.md)] release.
 
You'll receive an email with the planned maintenance date and time. You can reschedule an upgrade. The email also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services. 

For more information on this NSX-T  version, see [VMware NSX-T Data Center [!INCLUDE [nsxt-version](nsxt-version.md)] Release Notes](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/rn/VMware-NSX-T-Data-Center-312-Release-Notes.html).


## May 25, 2021
Per VMware security advisory [VMSA-2021-0010](https://www.vmware.com/security/advisories/VMSA-2021-0010.html), multiple vulnerabilities in VMware ESXi and vSphere Client (HTML5) have been reported to VMware. 

To address the vulnerabilities ([CVE-2021-21985](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-21985) and [CVE-2021-21986](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-21986)) reported in VMware security advisory [VMSA-2021-0010](https://www.vmware.com/security/advisories/VMSA-2021-0010.html), vCenter Server has been updated in all Azure VMware Solution private clouds.

No further action is required.

## May 21, 2021
 
Azure VMware Solution service will do maintenance work through May 23, 2021, to apply important updates to the vCenter server in your private cloud.  You'll receive a notification through Azure Service Health that includes the timeline of the maintenance for your private cloud.
 
During this time, VMware vCenter will be unavailable and you won't be able to manage VMs (stop, start, create, or delete). It's recommended that, during this time, you don't plan any other activities like scaling up private cloud, creating new networks, and so on, in your private cloud.
 
There is no impact to workloads running in your private cloud.


## April 26, 2021
All new Azure VMware Solution private clouds are now deployed with VMware vCenter version 6.7U3l and NSX-T version 2.5.2. We're not using NSX-T 3.1.1 for new private clouds because of an identified issue in NSX-T 3.1.1 that impacts customer VM connectivity. 

The VMware recommended mitigation was applied to all existing private clouds currently running NSX-T 3.1.1 on Azure VMware Solution. The workaround has been confirmed that there's no impact to customer VM connectivity.

## March 24, 2021
All new Azure VMware Solution private clouds are deployed with VMware vCenter version 6.7U3l and NSX-T version 3.1.1. Any existing private clouds will be updated and upgraded **through June 2021** to the releases mentioned above.

You'll receive an email with the planned maintenance date and time. You can reschedule an upgrade. The email also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services.  An hour before the upgrade, you'll receive a notification and then again when it finishes.

## March 15, 2021 

- Azure VMware Solution service will do maintenance work **through March 19, 2021,** to update the vCenter server in your private cloud to vCenter Server 6.7 Update 3l version.

- VMware vCenter will be unavailable during this time, so you can't manage your VMs (stop, start, create, delete) or private cloud scaling (adding/removing servers and clusters). However, VMware High Availability (HA) will continue to operate to protect existing VMs. 
 
For more information on this vCenter version, see [VMware vCenter Server 6.7 Update 3l Release Notes](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-vcenter-server-67u3l-release-notes.html).

## March 4, 2021

- Azure VMware Solution will apply the [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html) to existing privates **through March 15, 2021**.

- Documented workarounds for the vSphere stack, as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html), will also be applied **through March 15, 2021**.

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During maintenance, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter and clear automatically as the maintenance progresses.

## Post update
Once complete, newer versions of VMware components appear. If you notice any issues or have any questions, contact our support team by opening a support ticket.
