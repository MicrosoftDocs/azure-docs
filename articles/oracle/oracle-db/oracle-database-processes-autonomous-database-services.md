---
title: Database operations processes
description: Learn about database operations processes for Oracle Database Autonomous Recovery Service@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Database operations processes for Exadata services

Some Oracle processes are accessible from Azure, but they're set up and maintained in the Oracle Cloud Infrastructure (OCI) console.

## Oracle Database Autonomous Recovery Service@Azure

Oracle Database Autonomous Recovery Service@Azure is the preferred backup solution for Oracle Database@Azure resources. Here are some of the key customer benefits:

* You can use Microsoft Azure Consumption Commitment (MACC) to pay for your backup storage.
* You can choose your backup storage locations to meet corporate data residency and compliance requirements.
* It gives you zero data loss with real-time database protection, enabling recovery to less than a second after an outage or ransomware attack.
* It provides backup immutability by using a policy-based backup retention lock. The lock prevents backup deletion or alteration by any user in the tenancy.
* Data theft is prevented through mandatory and automatic encryption for backup data throughout the entire lifecycle.
* It provides higher operational efficiency by eliminating weekly full backups that reduces the CPU, memory, and I/O overhead when running backups to lower overall cloud costs.
* It shortens the backup window via an incremental-forever paradigm that moves smaller amounts of backup data between the database and Oracle Database Autonomous Recovery Service@Azure.
* Recoverability is improved through automated zero-impact recovery validation for database backups.
* It speeds recovery to regions with optimized backups eliminating the need to recover multiple incremental backups.
* Database protection insights are centralized in a granular recovery health dashboard.

### High-level steps to enable Oracle Database Autonomous Recovery Service@Azure

1. Access the OCI console for the database you want to enable for Oracle Database Autonomous Recovery Service@Azure. Learn how to [access the OCI console](oracle-database-manage-autonomous-database-resources.md).
1. Configure or create an Oracle Database Autonomous Recovery Service@Azure protection policy with store backups in the same cloud provider as the database set.
1. Use the protection policy to configure automated backups.
1. When the backup completes, subscription and backup location details appear in the database in OCI.

## Related content

* [Multicloud Oracle Database backup support](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/azure-multicloud-recoveryservice.html)
* [Backup automation and storage in Oracle Cloud](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/backup-automation.html)
* [Enable automatic backups to the recovery service](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/enable-automatic-backup.html#GUID-B8A2D342-3331-42C9-8FDD-D0DB0E25F4CE)
* [Configure protection policies](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/overview-protection-policy.html#GUID-8C097EAF-E2B0-4231-8027-0067A2E81A00)
* [Create a protection policy](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/create-protection-policy.html#GUID-C73E254E-2019-4EDA-88E0-F0BA68082A65)
* [View protection policy details](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/view-protection-policy.html#GUID-5101A7ED-8891-4A6B-B1C4-F13F55A68FF0)
