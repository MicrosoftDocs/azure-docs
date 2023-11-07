---
title: Azure VMware Solution known issues
description: This article provides details about the known issues of Azure VMware Solution.
ms.topic: reference
ms.custom: "engagement-fy23"
ms.service: azure-vmware
ms.date: 10/27/2023
---

# Known issues: Azure VMware Solution

This article describes the currently known issues with Azure VMware Solution.

Refer to the table to find details about resolution dates or possible workarounds. For more information about the different feature enhancements and bug fixes in Azure VMware Solution, see [What's New](azure-vmware-solution-platform-updates.md).

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
| The AV64 SKU currently supports RAID-1 FTT1, RAID-5 FTT1, and RAID-1 FTT2 vSAN storage policies. For more information, see [AV64 supported RAID configuration](introduction.md#av64-supported-raid-configuration) |Nov 2023 |N/A|N/A| 
| [VMSA-2021-002 ESXiArgs](https://www.vmware.com/security/advisories/VMSA-2021-0002.html) OpenSLP vulnerability publicized in February 2023  | 2021  | [Disable OpenSLP service](https://kb.vmware.com/s/article/76372)  | February 2021 - Resolved in [ESXi 7.0 U3c](concepts-private-clouds-clusters.md#vmware-software-versions) |
| After my private cloud NSX-T Data Center upgrade to version [3.2.2](https://docs.vmware.com/en/VMware-NSX/3.2.2/rn/vmware-nsxt-data-center-322-release-notes/index.html), the NSX-T Manager **DNS - Forwarder Upstream Server Timeout** alarm is raised | February 2023  | [Enable private cloud internet Access](concepts-design-public-internet-access.md), alarm is raised because NSX-T Manager cannot access the configured CloudFlare DNS server. Otherwise, [change the default DNS zone to point to a valid and reachable DNS server.](configure-dns-azure-vmware-solution.md) | February 2023 |
| When first logging into the vSphere Client, the **Cluster-n: vSAN health alarms are suppressed** alert is active in the vSphere Client | 2021  | This alert should be considered an informational message, since Microsoft manages the service. Select the **Reset to Green** link to clear it. | 2021 |
| When adding a cluster to my private cloud, the **Cluster-n: vSAN physical disk alarm 'Operation'** and **Cluster-n: vSAN cluster alarm 'vSAN Cluster Configuration Consistency'** alerts are active in the vSphere Client | 2021  | This should be considered an informational message, since Microsoft manages the service. Select the **Reset to Green** link to clear it. | 2021 |
| After my private cloud NSX-T Data Center upgrade to version [3.2.2](https://docs.vmware.com/en/VMware-NSX/3.2.2/rn/vmware-nsxt-data-center-322-release-notes/index.html), the NSX-T Manager **Capacity - Maximum Capacity Threshold** alarm is raised | 2023  | Alarm raised because there are more than 4 clusters in the private cloud with the medium form factor for the NSX-T Data Center Unified Appliance. The form factor needs to be scaled up to large. This issue will be detected and completed by Microsoft, however you can also open a support request. | 2023 |
| When I build a VMware HCX Service Mesh with the Enterprise license, the Replication Assisted vMotion Migration option is not available. | 2023  | The default VMware HCX Compute Profile does not have the Replication Assisted vMotion Migration option enabled. From the Azure VMware Solution vSphere Client, select the VMware HCX option and edit the default Compute Profile to enable Replication Assisted vMotion Migration. | 2023 |
| [VMSA-2023-023](https://www.vmware.com/security/advisories/VMSA-2023-0023.html) VMware vCenter Server Out-of-Bounds Write Vulnerability (CVE-2023-34048) publicized in October 2023 | October 2023  | Microsoft is currently working with its security teams and partners to evaluate the risk to Azure VMware Solution and its customers. Initial investigations have shown that controls in place within Azure VMware Solution reduce the risk of CVE-2023-03048. However Microsoft is working on a plan to rollout security fixes in the near future to completely remediate the security vulnerability. | October 2023 |

In this article, you learned about the current known issues with the Azure VMware Solution.

For more information, see [About Azure VMware Solution](introduction.md).


