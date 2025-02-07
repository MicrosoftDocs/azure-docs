---
title: Operation processes for Exadata services
description: Learn about operation processes for Exadata services.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Operations processes for Exadata services

There are Oracle processes that are accessible from Microsoft Azure, but are set up and maintained from the Oracle Cloud Infrastructure (OCI) console.

## Oracle Database Autonomous Recovery Service@Azure

Oracle Database Autonomous Recovery Service@Azure (RCV) is the preferred backup solution for OracleDB@Azure resources. The key customer benefits are as follows:

* Allows use of Microsoft Azure Consumption Commitment (MACC) to pay for your backup storage.
* Allows choice of backup storage locations to meet corporate data residency and compliance requirements.
* Provides zero data loss with real-time database protection, enabling recovery to less than a second after an outage or ransomware attack.
* Provides backup immutability using a policy-based backup retention lock preventing backup deletion or alteration by any user in the tenancy.
* Improves data theft prevention with mandatory and automatic encryption for backup data throughout the entire lifecycle.
* Provides higher operational efficiency by eliminating weekly full backups that reduces the CPU, memory, and I/O overhead when running backups lowering overall cloud costs.
* Shortens the backup window with an incremental forever paradigm that moves smaller amounts of backup data between the database and RCV.
* Improves recoverability with automated zero-impact recovery validation for database backups.
* Speeds recovery to regions with optimized backups eliminating the need to recover multiple incremental backups.
* Centralizes database protection insights with a granular recovery health dashboard.

## High-level Steps to Enable Autonomous Recovery Service@Azure

1. Access the OCI console for the database you want to enable for Autonomous Recovery Service@Azure. For details on this, see Access the OCI console in [Managing Exadata Resources](exadata-manage-resources.md).
1. Configure or create an Autonomous Recovery Service@Azure protection policy with Store backups in the same cloud provider as the database set.
1. Use the protection policy to Configure automated backups.
1. When the backup completes, subscription and backup location details appear in the database within OCI.

For more information for Autonomous Recovery Service@Azure, see the following documents:
* [Multicloud Oracle Database Backup Support](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/azure-multicloud-recoveryservice.html)
* [Backup Automation and Storage in Oracle Cloud](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/backup-automation.html)
* [Enable Automatic Backups to Recovery Service](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/enable-automatic-backup.html#GUID-B8A2D342-3331-42C9-8FDD-D0DB0E25F4CE)
* [About Configuring Protection Policies](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/overview-protection-policy.html#GUID-8C097EAF-E2B0-4231-8027-0067A2E81A00)
* [Creating a Protection Policy](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/create-protection-policy.html#GUID-C73E254E-2019-4EDA-88E0-F0BA68082A65)
* [Viewing Protection Policy Details](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/view-protection-policy.html#GUID-5101A7ED-8891-4A6B-B1C4-F13F55A68FF0)