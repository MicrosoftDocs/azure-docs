---
title: Azure VMware Solution known issues
description: This article provides details about the known issues of Azure VMware Solution.
ms.topic: reference
ms.custom: "engagement-fy23"
ms.service: azure-vmware
ms.date: 3/19/2024
---

# Known issues: Azure VMware Solution

This article describes the currently known issues with Azure VMware Solution.

Refer to the table to find details about resolution dates or possible workarounds. For more information about the different feature enhancements and bug fixes in Azure VMware Solution, see [What's New](azure-vmware-solution-platform-updates.md).

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
| [VMSA-2021-002 ESXiArgs](https://www.vmware.com/security/advisories/VMSA-2021-0002.html) OpenSLP vulnerability publicized in February 2023  | 2021  | [Disable OpenSLP service](https://kb.vmware.com/s/article/76372)  | February 2021 - Resolved in [ESXi 7.0 U3c](concepts-private-clouds-clusters.md#vmware-software-versions) |
| After my private cloud NSX-T Data Center upgrade to version [3.2.2](https://docs.vmware.com/en/VMware-NSX/3.2.2/rn/vmware-nsxt-data-center-322-release-notes/index.html), the NSX-T Manager **DNS - Forwarder Upstream Server Timeout** alarm is raised | February 2023  | [Enable private cloud internet Access](concepts-design-public-internet-access.md), alarm is raised because NSX-T Manager can't access the configured CloudFlare DNS server. Otherwise, [change the default DNS zone to point to a valid and reachable DNS server.](configure-dns-azure-vmware-solution.md) | February 2023 |
| When first logging in to the vSphere Client, the **Cluster-n: vSAN health alarms are suppressed** alert is active in the vSphere Client | 2021  | The alert should be considered an informational message, since Microsoft manages the service. Select the **Reset to Green** link to clear it. | 2021 |
| When adding a cluster to my private cloud, the **Cluster-n: vSAN physical disk alarm 'Operation'** and **Cluster-n: vSAN cluster alarm 'vSAN Cluster Configuration Consistency'** alerts are active in the vSphere Client | 2021  | This alert should be considered an informational message, since Microsoft manages the service. Select the **Reset to Green** link to clear it. | 2021 |
| After my private cloud NSX-T Data Center upgrade to version [3.2.2](https://docs.vmware.com/en/VMware-NSX/3.2.2/rn/vmware-nsxt-data-center-322-release-notes/index.html), the NSX-T Manager **Capacity - Maximum Capacity Threshold** alarm is raised | 2023  | Alarm raised because there are more than four clusters in the private cloud with the medium form factor for the NSX-T Data Center Unified Appliance. The form factor needs to be scaled up to large. This issue should get detected through Microsoft, however you can also open a support request. | 2023 |
| When I build a VMware HCX Service Mesh with the Enterprise license, the Replication Assisted vMotion Migration option isn't available. | 2023  | The default VMware HCX Compute Profile doesn't have the Replication Assisted vMotion Migration option enabled. From the Azure VMware Solution vSphere Client, select the VMware HCX option and edit the default Compute Profile to enable Replication Assisted vMotion Migration. | 2023 |
| [VMSA-2023-023](https://www.vmware.com/security/advisories/VMSA-2023-0023.html) VMware vCenter Server Out-of-Bounds Write Vulnerability (CVE-2023-34048) publicized in October 2023 | October 2023  | A risk assessment of CVE-2023-03048 was conducted and it was determined that sufficient controls are in place within Azure VMware Solution to reduce the risk of CVE-2023-03048 from a CVSS Base Score of 9.8 to an adjusted Environmental Score of [6.8](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/MAC:L/MPR:H/MUI:R) or lower. Adjustments from the base score were possible due to the network isolation of the Azure VMware Solution vCenter Server (ports 2012, 2014, and 2020 are not exposed via any interactive network path) and multiple levels of authentication and authorization necessary to gain interactive access to the vCenter Server network segment. AVS is currently rolling out [7.0U3o](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3o-release-notes/index.html) to address this issue. | March 2024 - Resolved in [ESXi 7.0U3o](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3o-release-notes/index.html) |
| The AV64 SKU currently supports RAID-1 FTT1, RAID-5 FTT1, and RAID-1 FTT2 vSAN storage policies. For more information, see [AV64 supported RAID configuration](introduction.md#av64-supported-raid-configuration) | Nov 2023 | Use AV36, AV36P, or AV52 SKUs when RAID-6 FTT2 or RAID-1 FTT3 storage policies are needed. | N/A |
| VMware HCX version 4.8.0 Network Extension (NE) Appliance VMs running in High Availability (HA) mode may experience intermittent Standby to Active failover. For more information, see [HCX - NE appliances in HA mode experience intermittent failover (96352)](https://kb.vmware.com/s/article/96352) | Jan 2024 | Avoid upgrading to VMware HCX 4.8.0 if you are using NE appliances in a HA configuration. | Feb 2024 - Resolved in [VMware HCX 4.8.2](https://docs.vmware.com/en/VMware-HCX/4.8.2/rn/vmware-hcx-482-release-notes/index.html) |
| [VMSA-2024-0006](https://www.vmware.com/security/advisories/VMSA-2024-0006.html) ESXi Use-after-free and Out-of-bounds write vulnerability | March 2024 | Microsoft has confirmed the applicability of the vulnerabilities and is rolling out the provided VMware updates. | March 2024 - Resolved in [vCenter Server 7.0 U3o](concepts-private-clouds-clusters.md#vmware-software-versions) |

In this article, you learned about the current known issues with the Azure VMware Solution.

For more information, see [About Azure VMware Solution](introduction.md).
