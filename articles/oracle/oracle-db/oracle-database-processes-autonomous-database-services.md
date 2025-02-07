---
title: Database ops processes for Oracle Database@Azure
description: Learn about database operations processes for Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Database operations processes for Oracle Database@Azure

Some Oracle processes are accessible from Azure, but you use the Oracle Cloud Infrastructure (OCI) console to set them up and maintain them.

## Oracle Database Autonomous Recovery Service@Azure

Oracle Database Autonomous Recovery Service@Azure is the preferred backup solution to use for Oracle Database@Azure resources. Here are some of the key benefits of using Oracle Database Autonomous Recovery Service@Azure:

* You can use Microsoft Azure Consumption Commitment (MACC) to pay for your backup storage.
* You can choose your backup storage locations to meet requirements for corporate data residency and compliance.
* It gives you zero data loss with real-time database protection and recovery in less than a second after an outage or ransomware attack.
* It provides backup immutability by using a policy-based backup retention lock. The lock prevents any user in the tenancy from deleting or altering backup data.
* Data theft is prevented through mandatory, automatic encryption for backup data throughout the entire lifecycle.
* It contributes to higher operational efficiency by eliminating weekly full backups to reduce CPU, memory, and I/O overhead and lower overall cloud costs.
* It shortens the backup window via an incremental-forever paradigm that moves smaller amounts of backup data between the database and Oracle Database Autonomous Recovery Service@Azure.
* Recoverability is improved through automated zero-impact recovery validation for database backups.
* It uses optimized backups to eliminate the need to recover multiple incremental backups and speed recovery to regions.
* Database protection insights are centralized in a granular recovery health dashboard.

### High-level steps to enable Oracle Database Autonomous Recovery Service@Azure

1. Go to the OCI console for the database you want to enable for Oracle Database Autonomous Recovery Service@Azure. Learn how to [access the OCI console](oracle-database-manage-autonomous-database-resources.md).
1. Configure or create an Oracle Database Autonomous Recovery Service@Azure protection policy with storage backups in the same cloud provider as the database.
1. Use the protection policy to configure automated backups.
1. When the backup completes, check for subscription and backup location details in the database in OCI.

## Related content

* [Support for multicloud Oracle database backup](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/azure-multicloud-recoveryservice.html)
* [Backup automation and storage in Oracle Cloud](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/backup-automation.html)
* [Enable automatic backups to the recovery service](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/enable-automatic-backup.html#GUID-B8A2D342-3331-42C9-8FDD-D0DB0E25F4CE)
* [Create a protection policy](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/create-protection-policy.html#GUID-C73E254E-2019-4EDA-88E0-F0BA68082A65)
* [Configure protection policies](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/overview-protection-policy.html#GUID-8C097EAF-E2B0-4231-8027-0067A2E81A00)
* [View protection policy details](https://docs.oracle.com/en/cloud/paas/recovery-service/dbrsu/view-protection-policy.html#GUID-5101A7ED-8891-4A6B-B1C4-F13F55A68FF0)
