---
title: Disaster recovery solutions for Azure VMware Solution virtual machines
description: Learn about leading disaster recovery solutions for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# 



# 3P Backup & Disaster Recovery: Limitations, Compatibility, and Known Issues

Azure VMware Solution (AVS) is a great place for partners to bring their solutions to enable VMware customers to keep their existing tools and processes while onboarding new cloud capabilities. With moving to the cloud, third party vendors and their customers have to be informed about the solution and its capabilities in development as AVS continues to evolve.  

We currently offer customers the possibility to implement their disaster recovery plans using state-of-the-art VMware solution like [SRM](disaster-recovery-using-vmware-site-recovery-manager.md) or [HCX](deploy-disaster-recovery-using-vmware-hcx.md).

You can find more information about their solutions in the following links:
- [VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)
- [Zerto](https://help.zerto.com/category/AVS)
- [JetStream](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)

> [!IMPORTANT] 
>**Please review the Support Guidance for DR products**
>For any issues related to 3P Backup & Disaster recovery (DR) solutions, customers must contact the respective partner's support team directly. Microsoft does not provide direct support for partner products. If advanced troubleshooting is required, the partner's support team will engage Microsoft as needed. Customers should not open support requests with Microsoft for partner solution-related issues.

## Compatibility Overview

| Supported Version in AVS Gen 1 | Supported Version in AVS Gen 2 | Links                                                                 | Support                                                                                                                                     |
|-------------------------------------------|-------------------------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| VMware Live Site Recovery 9.0.2.1 Preview*      | VMware Live Site Recovery 9.0.2.1 Preview*                           | [Deploy VMware Live Site Recovery](https://learn.microsoft.com/en-us/azure/azure-vmware/disaster-recovery-using-vmware-site-recovery-manager)                | AVS owns only install, Uninstall & Upgrade of Live Site Recovery. Customers should create Broadcom support tickets for all other areas.     |
| Zerto 10.0 U6 or later preview* | Zerto VAIO Timeline - TBD | [Deploying Zerto on Azure VMware Solution](https://help.zerto.com/category/AVS)         | All Zerto related issues and RunCommand errors Customers are requested to reach [Zerto Support](https://www.zerto.com/myzerto/support/create-case/).                       |
| JetStream version: 5.0 GA | JetStream VAIO Timeline - TBD | [Deploy JetStream on AVS](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)                         | All support—including install, uninstall, upgrade, configuration, replication—is handled by the JetStream support team. Contact [JetStream Support](https://jetstreamsoft.com/about/contact/). |
|Please refer to Backup Recovery Partner Compatibility Guidance |Please refer to Backup Recovery Partner Compatibility Guidance                     | [Backup solutions for Azure VMware Solution VMs](https://learn.microsoft.com/en-us/azure/azure-vmware/ecosystem-back-up-vms) | Kindly reach out to the Backup and Recovery Product team for all support cases.                                                             |

Note: The preview designation indicates that the product is in preview mode due to known issues, limited functionality, or specific restrictions. For assistance, please reach out to the third-party vendor or solution provider directly.

Please note that customers are not permitted to open Microsoft support tickets for partner product-related issues, including error messages or run commands

## Disaster Recovery Limitations, Unsupported, and Known Issues

| Solution            | Limitations / Unsupported Features                                                                                          |
|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| **VMware Live Site Recovery** | Array-based replication and storage policy protection groups <br> VMware vVOLs Protection Groups<br> VMware SRM IP customization using SRM command-line tools <br> Shared Site Recovery (One-to-Many and Many-to-One topologies) <br> Custom VMware SRM plug-in identifier or extension ID <br> Encrypted VMs unsupported <br> Enhanced replication unsupported <br> Only legacy replication using vSphere replication server is supported |
| **Zerto on AVS**  | Requires a minimum of 4 hosts per cluster  <br> Backup and Snapshot is unavailable for ZVML VM <br> ZVML VM SSH or web console access is restricted  <br> Service account credentials will not be shared with customers  <br> VM replications may be disrupted during AVS upgrade maintenance and host replacement maintenance  <br> Customers are advised to coordinate directly with Zerto for timelines any fixes *<br>|
| **JetStream on AVS**| Requires a minimum of 4 hosts per cluster                                                                                  |
| **Backup and Recovery Partners**| Kindly reach out to Backup and Recovery team for limitation and known issues






