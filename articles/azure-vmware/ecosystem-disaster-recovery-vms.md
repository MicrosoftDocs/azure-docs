---
title: Disaster recovery solutions for Azure VMware Solution virtual machines
description: Learn about leading disaster recovery solutions for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# 



# 3rd Party Backup & Disaster Recovery Solutions for Azure VMware: Limitations, Compatibility, and Known Issues

Azure VMware Solution (AVS) is a great place for partners to offer and run their solutions enabling customers to continue to leverage their existing or new investments in disaster recovery, ransomware and backup protection solutions. As each 3P solution has unique requirements, AVS makes use of dynamic "run commmand" modules which require both Microsoft and Partner input to run effectively.  The purpose of this page is to inform customers before making a vendor decision or as the platform evolves, inform customers of potential known issues stemming from vSphere upgrades, AVS and Microsoft security enhancements or other technical, important to know issues.

AVS currently only offers [VMware Live Site Recovery](disaster-recovery-using-vmware-site-recovery-manager.md) as well as several 3P partner solutions.

You can find more information about their solutions in the following links:
- [VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)
- [Zerto](https://help.zerto.com/category/AVS)
- [JetStream](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)

> [!IMPORTANT]
> **Please review the Support Guidance for DR products**
> For any issues related to 3P Backup & Disaster recovery (DR) solutions, customers must contact the respective partner's support team directly. Microsoft doesn't provide direct support for partner products, instead, if advanced troubleshooting is required, the partner's support team engages directly with Microsoft AVS technical support as needed. Customers who open support requests directly with Microsoft for partner solution-related issues can expect delays as the cases will land in triage for extended time.

## Compatibility Overview

| Supported Version in AVS Gen 1 | Supported Version in AVS Gen 2 | Links                                                                 | Support                                                                                                                                     |
|-------------------------------------------|-------------------------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| VMware Live Site Recovery 9.0.2.1 Preview*      | VMware Live Site Recovery 9.0.2.1 Preview*                           | [Deploy VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)                | AVS owns only install, Uninstall & Upgrade of Live Site Recovery. Customers should create Broadcom support tickets for all other areas.     |
| Zerto 10.0 U7 GA| Zerto VAIO Timeline - TBD | [Deploying Zerto on Azure VMware Solution](https://help.zerto.com/category/AVS)         | All Zerto related issues and RunCommand errors Customers are requested to reach [Zerto Support](https://www.zerto.com/myzerto/support/create-case/).                       |
| JetStream version: 5.0 GA | JetStream VAIO Timeline - TBD | [Deploy JetStream on AVS](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)                         | All support—including install, uninstall, upgrade, configuration, replication—is handled by the JetStream support team. Contact [JetStream Support](https://jetstreamsoft.com/about/contact/). |
|Please refer to Backup Recovery Partner Compatibility Guidance |Please refer to Backup Recovery Partner Compatibility Guidance                     | [Backup solutions for Azure VMware Solution VMs](https://learn.microsoft.com/en-us/azure/azure-vmware/ecosystem-back-up-vms) | Kindly reach out to the Backup and Recovery Product team for all support cases.                                                             |

Note: The preview designation indicates that the product is in preview mode due to known issues, limited functionality, or specific restrictions. For assistance reach out to the third-party vendor or solution provider directly.

Note that customers aren't permitted to open Microsoft support tickets for partner product-related issues, including error messages or run commands


## Disaster Recovery Limitations, Unsupported, and Known Issues

| Solution            | Limitations / Unsupported Features                                                                                          |
|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| **VMware Live Site Recovery** | Array-based replication and storage policy protection groups <br> VMware vVOLs Protection Groups<br> VMware SRM IP customization using SRM command-line tools <br> Shared Site Recovery (One-to-Many and Many-to-One topologies) <br> Custom VMware SRM plug-in identifier or extension ID <br> Encrypted VMs unsupported <br> Enhanced replication supported in Gen2 only |
| **Zerto on AVS**  | Zerto supports version Zerto 10.0 U7 onwards <br> DNS and network configuration changes for Zerto Virtual Machine aren't supported after installation.<br> Azure resource group modifications aren't supported after Zerto installation.<br> SSH or web console access for ZVML VM is restricted.<br> Service account credentials are not shared with customers<br> A minimum of four hosts per cluster is required.<br> Backup and Snapshot features are unavailable for ZVML VM. <br> Customers are advised to coordinate directly with Zerto for timelines any fixes|
| **JetStream on AVS**| Requires a minimum of four hosts per cluster                                                                                  |
| **Backup and Recovery Partners**|[AVS 3rd Party BCDR](https://learn.microsoft.com/en-us/azure/azure-vmware/ecosystem-back-up-vms) has been tested with the cloudadmin role. AVS cannot provide more than [Cloudadmin Privilege](https://learn.microsoft.com/en-us/azure/azure-vmware/architecture-identity#view-the-vcenter-server-privileges). For further support, please contact the respective BCDR partners directly|




Last Updated: May 2025
*This article will be updated monthly to provide the most current information. For exact timelines and further details, please visit the Partner onboarding sites. Partners are responsible for updating their respective products.*

