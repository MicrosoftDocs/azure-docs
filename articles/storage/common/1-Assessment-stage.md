---
author: bapic
ms.date: 08/11/2025
title: Assessment
---

# Assessment

During this phase, data assets, dependencies, and the volume and usage of data—both in its current state and after migration—are systematically inventoried. Each dataset is profiled according to factors such as performance, resiliency, security, cost, and usage requirements. These attributes will help with appropriate assessment and target service selection.

Below is list of items that are inventoried and catalogued commonly.

## Discover and assess your source data

### Inventory Data Assets

1. Catalog all *data sources* to migrate (such as user data, departmental shares, file shares, application data, content management systems, databases, back-up-archive data, VM disks, stored on any SAN, NAS, DFS, tape archives etc.)
2. In this catalogue, for each source of data, estimate the *data size* (in GB/TB/PB), include approx. *number of files & objects*.
3. Capture the *hierarchy, depth of the directory* structure.
4. Note the special properties such as *reserved file names*, *directory/file length (long path)* or *alternate data streams* involved.
5. *Authentication methods* involved for the current and future data services

### Identify Data type & Access Patterns

1. For each source, record the *data type* and how it's *accessed*, *frequency of access*
2. Identify *access methods & protocols* file-level (accessible via SMB/NFS), object-level (via S3/REST APIs), or block-level (raw disks or LUNs attached to servers, iSCSI etc.)
3. Note *application(s) dependencies* on this data for pre and post migration access, which protocols once migrated to Azure.
4. Capture specific permission levels *(ACLs) retention requirements* of the permissions, any specific feature support for the file such as *access-based enumeration, alternate data streams*.
5. Also note the *access patterns*- sequential vs random; read/write ratio
6. Mention if you are considering *consolidation or reorganization* of the data, as you migrate to Azure storage.

### Understand Performance Needs

1. Assess network *bandwidth and latency* between the source and Azure
2. Also note source read/write performance or *IOPS limits, throughput requirements*
3. Seasonal or *burst patterns*
4. What are the *external and internal integration* requirements for the source data discovered

### Assess replication, change rate, resiliency & downtime tolerance

1. Determine data *change rates* (how frequently data changes) and the acceptable *downtime* for cutover. If data is static (does not change), one-time copy is fine. If actively changing, plan for incremental syncs and a final cutover window. 
2. Agree on any read-only period for final migration to avoid missed updates.
3. Capture the SLA, RPO, RTO needs (depending on application's availability, resiliency needs)
4. Existing data protection, recovery and monitoring needs
5. Any replication policies (Ex: synchronous or asynchronous high availability or disaster recovery needs) and snapshot policies if applicable (frequency and retention period)

At this point, consider, if the data changes are too high, how the current network bandwidth will support the delta changes post initial offline seeding. Are there additional parameters to consider for such systems and the data?  

### Factor in Security & Compliance Requirements

1. Document any *permissions* (*ACLs*) on the data. Ensure the migration method can preserve them or plan to *reapply* them in Azure.
2. If data must not transit public internet, plan to use *ExpressRoute or Private Link* for in-flight data.
3. *Regulatory compliance* may also dictate target Azure region (data residency). Categorize the data based on such *security and compliance needs* such as which one needs additional *auditing, chain of custody etc.* If any in case, you are considering offline migration, review and document such specific needs.
4. Outline key *technical design decisions* that must be reviewed and established to move forward with target selections


At the end of the Assessment phase, you should have a document that clearly outlines the requirements for each source of data, the present and future needs and its specific sets of requirements once it is migrated to a target system/service. You also need to consider if any system is reaching end of life and will be deprecated and no migration is required or whether its data needs to be stored for a certain period. Such a document will clearly define the capabilities that must be present in the target systems to successfully host the data.

### See also

- [Azure Migrate documentation | Microsoft Learn](/azure/migrate/)
- [3P Assessment Tools](/azure/storage/solution-integration/validated-partners/data-management/azure-file-migration-program-solutions)
- [Offline Data Transfers using Azure Data Box](/azure/databox/data-box-overview)