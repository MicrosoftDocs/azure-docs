---
title: Azure migration guidance storage assessment
description: The Azure storage migration assessment guide describes basic guidance for the Assessment phase of any migration strategy.
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

<!--
65 (670/25)
93 (751/5 false-positives)
-->

# Storage migration assessment

During the assessment phase, data assets, dependencies, and the volume and usage of data are systematically inventoried. This inventory takes into account data in both its pre- and post-migration state. Each dataset is profiled according to factors such as performance, resiliency, security, cost, and usage requirements. These attributes help with appropriate assessment and target service selection.

The following list contains commonly inventoried and cataloged items in order to discover and assess your source data.

## Inventory data assets

1. Catalog all *data sources* being migrated. These sources include user data, departmental shares, file shares, application data, content management systems, and databases. They also include back-up-archive data, virtual machine disks, or data stored on any SAN, NAS, DFS, or tape archives.
2. Estimate the *data size* in GB/TB/PB for each data source within your catalog. Include the approximate *number of files and objects*.
3. Capture the *hierarchy* and *depth of the directory structures*.
4. Line down any special properties such as *reserved file names*, *directory or file length*, *long paths*, or *alternate data streams* involved.
5. Record the *Authentication methods* involved for the current and future data services.

## Identify data type & access patterns

1. Record the *data type* and *access method* for each source, and the *frequency of access*.
2. Identify *access methods and protocols* at the file-level, object-level, or block-level. For example, file-level protocols might include SMB or NFS. Object-level protocols might include S3 or REST APIs, and block-level protocols might include iSCSI, or raw disks or LUNs attached to servers.
3. Record *application dependencies* on this data for pre- and post-migration access, which protocols once migrated to Azure.
4. Capture specific permission levels and ACLs, retention requirements for permissions, and any specific feature support for the file such as *access-based enumeration* or *alternate data streams*.
5. Also note the *access patterns*- sequential vs random; read/write ratio
6. Mention if you're considering *consolidation or reorganization* of the data, as you migrate to Azure storage.

## Understand performance needs

1. Assess network *bandwidth and latency* between the source and Azure
2. Record source read/write performance or *IOPS limits, throughput requirements*
3. Seasonal or *burst patterns*
4. What are the *external and internal integration* requirements for the source data discovered

## Assess replication, change rate, resiliency & downtime tolerance

1. Determine data *change rates* to understand how frequently data changes, and the acceptable *downtime* for cutover. If your data is static and doesn't change, a one-time copy is acceptable. However, actively changing, dynamic data requires you to plan for incremental syncs and a final cutover window.
2. Agree on any read-only period for final migration to avoid missed updates.
3. Capture the SLA, RPO, RTO requirements based on an application's availability and resiliency needs.
4. Document existing data protection, recovery, and monitoring needs.
5. Capture any replication policies, such as synchronous or asynchronous high-availability or disaster recovery requirements. Also note any snapshot policies if applicable, such as frequency and retention period.

At this point, consider whether the data changes are excessively frequent, and whether the current network bandwidth can support the delta changes after initial offline seeding. Are there other parameters to consider for such systems and the data?

## Factor in security and compliance requirements

1. Document any *permissions* and *ACLs* on the data. Ensure the migration method can preserve them, or create a plan to *reapply* them in Azure.
2. Plan to use *ExpressRoute* or *Private Link* for any in-flight data that must not transit the public internet.
3. Consider that *regulatory compliance* might dictate specific target Azure regions to comply with data residency requirements. Categorize the data based on *security and compliance needs*, such as *auditing* or *chain of custody*. If you're considering offline migration, review and document any such specific needs.
4. Outline key *technical design decisions* that must be reviewed and established to move forward with target selections.
5. Consider whether any system is nearing end of life. Although deprecated systems might not be migrated, it's possible that system data needs to be stored for a certain period to meet regulatory compliance. 

At the end of the Assessment phase, you should have a document that clearly outlines the requirements for each source of data. These requirements include its present and future needs, and its specific sets of requirements after migrating to a target system or service. The Assessment document clearly defines the capabilities that must be present in the target systems to successfully host the data.

## See also

- [Azure Migrate documentation](../../migrate/migrate-services-overview.md)
- [Partner Assessment Tools](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md)
- [Offline Data Transfers using Azure Data Box](../../databox/data-box-overview.md)
