---
title: Disaster recovery solutions for Azure VMware Solution virtual machines
description: Learn about leading disaster recovery solutions for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# Third party backup & disaster recovery solutions for Azure VMware: Limitations, compatibility, and known issues

One of the most important aspects of any Azure VMware Solution deployment is disaster recovery. You can create disaster recovery plans between different Azure VMware Solution regions or between Azure and an on-premises vSphere environment. Azure VMware Solution makes use of dynamic "run command" modules which require both Microsoft and Partner input to run effectively.  

In this article, you'll discover critical known issues related to vSphere upgrades, Azure VMware Solution, Microsoft security enhancements, and other key technical considerations. This information is essential for you to evaluate before selecting a vendor and as the platform continues to evolve.

Azure VMware Solution currently offers [VMware Live Site Recovery](disaster-recovery-using-vmware-site-recovery-manager.md) and several 3P partner solutions.

You can find more information about their solutions in the following links:
- [VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)
- [Zerto](https://help.zerto.com/category/AVS)
- [JetStream](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)

> [!IMPORTANT]
> You **must** contact your partner's technical team directly. Microsoft does **not** provide direct support for partner products. Do not create support tickets with Microsoft.


## Compatibility Overview

| Supported Version in AVS Gen 1 | Supported Version in AVS Gen 2 | Links                                                                 | Support                                                                                                                                     |
|-------------------------------------------|-------------------------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| VMware Live Site Recovery 9.0.2.1 Preview*      | VMware Live Site Recovery 9.0.2.1 Preview*                           | [Deploy VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)                | AVS owns only install, Uninstall & Upgrade of Live Site Recovery. Customers should create Broadcom support tickets for all other areas.     |
| Zerto 10.0 U7 GA| Zerto vSphere APIs for IO (VAIO) Timeline - TBD | [Deploying Zerto on Azure VMware Solution](https://help.zerto.com/category/AVS)         | All Zerto related issues and RunCommand errors Customers are requested to reach [Zerto Support](https://www.zerto.com/myzerto/support/create-case/).                       |
| JetStream version: 5.0 GA | JetStream vSphere APIs for IO (VAIO) Timeline - TBD | [Deploy JetStream on AVS](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)                         | All support—including install, uninstall, upgrade, configuration, replication—is handled by the JetStream support team. Contact [JetStream Support](https://jetstreamsoft.com/about/contact/). |
|Refer to Backup Recovery Partner Compatibility Guidance |Refer to Backup Recovery Partner Compatibility Guidance                     | [Backup solutions for Azure VMware Solution VMs](https://learn.microsoft.com/en-us/azure/azure-vmware/ecosystem-back-up-vms) | Kindly reach out to the Backup and Recovery Product team for all support cases.                                                             |

Note: The preview designation indicates that the product is in preview mode due to known issues, limited functionality, or specific restrictions. For assistance, reach out to the third party partners directly.

Customers aren't permitted to open Microsoft support tickets for partner product-related issues, including error messages or run commands


## Disaster recovery limitations, unsupported, and Known Issues

| Solution            | Limitations / Unsupported Features                                                                                          |
|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| **VMware Live Site Recovery** | Array-based replication and storage policy protection groups <br> VMware vVOLs Protection Groups<br> VMware SRM IP customization using SRM command-line tools <br> Shared Site Recovery (One-to-Many and Many-to-One topologies) <br> Custom VMware SRM plug-in identifier or extension ID <br> Encrypted VMs unsupported <br> Enhanced replication supported in Gen2 only |
| **Zerto on AVS**  | Zerto supports version Zerto 10.0 U7 onwards <br> DNS and network configuration changes for Zerto Virtual Machine aren't supported after installation.<br> Azure resource group modifications aren't supported after Zerto installation.<br> SSH or web console access for ZVML Virtual machine is restricted.<br> Service account credentials aren't shared with customers<br> A minimum of four hosts per cluster is required.<br> Backup and Snapshot features are unavailable for ZVML VM. <br> Customers are advised to coordinate directly with Zerto for timelines any fixes|
| **JetStream on AVS**| Requires a minimum of four hosts per cluster                                                                                  |
| **Backup and Recovery Partners**|[AVS third Party BCDR](https://learn.microsoft.com/en-us/azure/azure-vmware/ecosystem-back-up-vms) has been tested with the cloudadmin role. Azure VMware Solution (AVS) can't provide more than [Cloudadmin Privilege](https://learn.microsoft.com/en-us/azure/azure-vmware/architecture-identity#view-the-vcenter-server-privileges). For further support, Contact the respective BCDR partners directly|




**Last Updated: May 2025** – Updated monthly with the latest information. Visit Partner onboarding sites for timelines and details. Partners keep their products up to date.
