---
title: Azure Data Share retirement
description: Understand the November 12, 2029 Azure Data Share retirement, evaluate transition options, and plan provider and consumer workload changes.
author: sidontha
ms.author: sidontha
ms.service: azure-data-share
ms.topic: concept-article
ms.date: 10/28/2026
ms.custom: msecd-doc-authoring-1030
ai-usage: ai-generated
#customer intent: As an Azure Data Share provider or consumer, I want to understand retirement timelines and transition options so that I can maintain data sharing before the service retires.
---

# Azure Data Share retirement

Azure Data Share retires on **November 12, 2029**. Before that date, transition your data sharing workloads to Microsoft Fabric or data source-specific sharing capabilities. This article explains the affected workloads, transition options, and differences to evaluate with your data providers and consumers.

[!INCLUDE [Azure Data Share retirement notice](includes/data-share-retirement.md)]

## Who is affected

Retirement affects the people and systems that provide, consume, or administer Azure Data Share relationships:

- Data providers that publish resources, datasets, invitations, snapshot schedules, or terms of use.
- Data consumers that accept invitations, maintain share subscriptions, map datasets to destinations, or run snapshots.
- Data engineers and application owners that automate sharing through ARM, REST, SDKs, Azure CLI, PowerShell, or scheduled processes.
- Storage, database, analytics, security, and network administrators responsible for permissions, identities, private endpoints, diagnostics, or cost controls.
- Regulated and regional-cloud customers with geography, sovereignty, audit, retention, or support requirements.

## Transition options by scenario

Choose a transition path for each sharing relationship. Fabric sharing capabilities and Data Factory pipelines aren't one-to-one replacements for Azure Data Share. Evaluate the differences in data delivery, identities, permissions, lifecycle management, and operations before cutover.

| Azure Data Share scenario | Recommended alternative | Difference / no-parity warning |
| --- | --- | --- |
| **Full snapshot sharing from Azure Blob Storage, ADLS Gen1, or ADLS Gen2 (blobs, containers, files, folders, or file systems)** | First import the data or create  Shortcuts to a Fabric Lakehouse. For eligible Blob Storage patterns, assess [Azure Storage object replication](../storage/blobs/object-replication-overview.md). You can then choose between three options<br><br>[External Data Share](/fabric/governance/external-data-sharing-overview) – allows a data producer to share a set of tables to data consumers across tenants without creating an identity for the consumer<br><br>[Cross Tenant Delegated Shortcuts](/fabric/onelake/shortcuts/create-cross-tenant-onelake-shortcut) allows you to create a cross-tenant Shortcut in the data consumer tenant. You need to have an identity in the data producer tenant<br><br>IQ Share – allows data producer to share entire Item  like Lakehouse, Data Warehouse, Mirrored Items to multiple data consumers without creating an identity<br><br>Alternatively, where consumers need read-only SQL access rather than a delivered snapshot, evaluate Azure SQL Database data virtualization. Use external tables or OPENROWSET to query CSV or Parquet files directly in Azure Blob Storage or ADLS Gen2, without first loading the files into database tables. | Users need to import the storage account as a Lakehouse asset into Fabric. Terms of use, recipient acceptance, dataset mapping, provider revocation, monitoring, and sharing history are already built.<br><br>The Azure SQL Database option queries files in place; it does not deliver independent snapshots or provide Azure Data Share lifecycle management. Storage access and database permissions require separate configuration. ADLS Gen1 is not a supported source for this option. |
| **Incremental and scheduled snapshot sharing from Azure Blob Storage, ADLS Gen1, or ADLS Gen2** | Users will now be able to access in-place live sharing for storage accounts using Fabric.<br><br>Where scheduled copies are not required, Azure SQL Database data virtualization is another option for read-only querying of CSV or Parquet files in Azure Blob Storage or ADLS Gen2. | Azure Data Share hourly/daily snapshot schedules, while Fabric offers live in-place sharing.<br><br>Azure SQL Database data virtualization also queries files in place. It does not provide incremental-copy orchestration, snapshot schedules, or retained point-in-time copies. |
| **Full snapshot sharing of Azure SQL Database or Azure Synapse Analytics tables and views** | Use Azure Data Factory or Fabric Data Factory pipelines to copy tables or query results into the recipient's SQL, storage, or analytics destination. | There is no equivalent Azure Data Share contract. Schema creation, overwrite behavior, view handling, output format, credentials, scheduling, and failure recovery must be explicitly designed and tested. |
| **Consumer mapping of shared data into Blob Storage, ADLS Gen2, Azure SQL Database, or Azure Synapse Analytics, including CSV or Parquet output** | For SQL server, users should follow the Fabric Migration Assistant. Once completed, users will be able to utilize Fabric’s external data sharing capability. | Migration of SQL Server data into Fabric is required, users will then be able to use the native Fabric external data sharing capabilities. |
| **In-place sharing of Azure Data Explorer databases, clusters, or selected tables without copying data** | Same tenant sharing:<br><br>Use native Azure Data Explorer for [follower-database APIs](/azure/data-explorer/follower?tabs=csharp).<br><br>Same or cross-tenant sharing:<br><br>Create a [database shortcut in Fabric Eventhouse](/fabric/real-time-intelligence/database-shortcut?tabs=link) to follow Azure Data Explorer Clusters.<br><br>For Azure SQL Database consumers that do not require a local copy, evaluate data virtualization. Use external tables or OPENROWSET to query CSV or Parquet files in Azure Blob Storage or ADLS Gen2 and join the results with locally stored relational data. This option does not require migrating the files into Fabric. | Native ADX following and Fabric Eventhouse options use different cross-tenant onboarding, permissions, administration, monitoring, and revocation semantics.<br><br>For the Azure SQL Database data virtualization option, migration into Fabric is not required. This is a read-only file-querying capability not an automatic migration of consumer mappings or a CSV/Parquet export capability. File schemas, authentication, network access, and permissions must be configured and tested. |
| **Provider and consumer lifecycle management: invitations, terms of use, subscriptions, update access, revocation, REST APIs, and monitoring** | Fabric’s external data sharing capability offers establishing a share, tracking shares and revocation with the necessary RBAC. | Fabric’s external data sharing capability offers establishing a share, tracking shares and revocation with the necessary RBAC. |

[AzCopy](../storage/common/storage-use-azcopy-v10.md) and the [Azure Blob Storage connector for Data Factory](../data-factory/connector-azure-blob-storage.md) provide additional information for evaluating customer-controlled copy options.

## Fabric sharing models

External data sharing, cross-tenant delegated shortcuts, and IQ Share provide different access models. They aren't interchangeable replacements or automatic migration paths.

### External data sharing

By using [Fabric external data sharing](/fabric/governance/external-data-sharing-overview), a producer can select tables or folders and invite a recipient. When the recipient accepts the invitation, it creates read-only shortcuts in the recipient's Lakehouse. The consumer doesn't need an account or identity in the producer's tenant.

Use this model to share selected data with external partners or customers. The shared data must be available in Fabric. Prepare the required storage or SQL Server assets for the selected Fabric sharing model.

### Cross-tenant delegated shortcuts

By using [cross-tenant delegated shortcuts](/fabric/onelake/shortcuts/create-cross-tenant-onelake-shortcut), the consumer creates a shortcut by using a connection authenticated with an organizational account or service principal in the producer's tenant.

Use this model when a source-tenant identity is available, such as sharing between an organization's test and production tenants.

### IQ Share

IQ Share (public preview) shares whole supported Lakehouse or Warehouse items. When the recipient accepts the invitation, it creates a Share Subscription and read-only Mirrored OneLake items in the consumer's workspace. The consumer doesn't need an identity in the producer's tenant.

## Azure SQL Database data virtualization

For read-only SQL access to files, consider Azure SQL Database data virtualization. Use external tables or `OPENROWSET` to query CSV or Parquet files directly in Blob Storage or ADLS Gen2 without first loading the files into database tables.

This option:

- Queries files in place instead of delivering independent snapshots.
- Doesn't provide Azure Data Share lifecycle management, incremental-copy orchestration, snapshot schedules, or retained point-in-time copies.
- Doesn't require migrating the files into Fabric.
- Doesn't automatically migrate consumer mappings or provide CSV or Parquet export.
- Doesn't support ADLS Gen1 as a source.

Configure and test file schemas, storage authentication, database permissions, and network access separately.

## Transition planning considerations

Begin with non-disruptive discovery and testing while supported production shares remain running.

- **Inventory the relationship.** Record every account, share, dataset, invitation, subscription, mapping, schedule, snapshot run, API integration, identity, private endpoint, diagnostic setting, owner, and downstream consumer.
- **Assess criticality and requirements.** Classify relationships by delivery model, source and destination, tenant, geography, frequency, volume, business criticality, and compliance requirements.
- **Evaluate a replacement per scenario.** Test the relevant Fabric sharing model, Fabric Data Factory, Azure Data Factory, or data source-specific option. Don't assume one-to-one parity.
- **Coordinate provider and consumer cutover.** Validate identities, networks, schemas, completeness, freshness, revocation, monitoring, costs, and recovery.
- **Preserve evidence and data.** Retain approved configuration, audit information, run history, and reconciliation evidence. Complete final snapshots or customer-controlled copies where required.
- **Protect production workloads.** Don't delete or disable production Azure Data Share resources before replacement testing is complete.

## Frequently asked questions

### Is Fabric External Data Sharing a one-to-one replacement?

No. It can be a recommended path for supported live, read-only, no-copy sharing of OneLake-resident Fabric data. Fabric offers a more robust solution to sharing, ensuring live in-place read-only access. However, customers need to import their storage account and SQL Server assets into Fabric as a prerequisite to using [Fabric external data sharing](/fabric/governance/external-data-sharing-overview). More details can be found here.

<a id="what-is-the-difference-between-external-data-share-iq-sharepreview-and-cross-tenant-shortcuts"></a>

### What is the difference between External Data Share, IQ Share (Preview), and Cross-Tenant Shortcuts?

All three provide access across Fabric tenants without creating a sharing copy, but they differ in setup and scope:

External Data Sharing: Allows data producer to share subset of tables. Data producer can select a set of tables in Lakehouse or Warehouse and invites a recipient or data consumer to access selected tables or folders. The data consumer accepts the invite which creates read-only shortcuts in the recipient’s Lakehouse; Consumer doesn't need an account or an identity in the producer tenant. This is best suited for sharing selected data with external partners or customers.

Cross-Tenant Delegated Shortcuts: A consumer creates shortcuts using a connection authenticated with an organizational account or service principal in the producer’s tenant. Best when a source-tenant identity is available, such as an organization’s test and production tenants.

IQ Share (Public Preview): A producer shares whole supported Lakehouse or Warehouse items. Long term, IQ Share will enable sharing other items that enable sharing context and IQ. Acceptance creates a Share Subscription and read-only Mirrored OneLake items in the consumer’s workspace. Best for distributing whole data items through a managed Share experience.

These are different access models, not interchangeable replacements or automatic migration paths.

### Is Azure Data Factory or Fabric Data Factory a one-to-one replacement?

No. Data Factory can copy or synchronize data for supported sources and destinations, but it's orchestration rather than an Azure Data Share provider or consumer contract. Use Fabric for the best business outcome. For more information, see [Fabric Data Factory](/fabric/data-factory/data-factory-overview).

### Will shares, subscriptions, or data move automatically?

No automatic migration is established. Customers must inventory each relationship, choose and configure a transition path, move or expose data as required, and test the replacement end to end with each data provider and recipient—including access, permissions, data availability, refresh behavior, and operational ownership—before retiring the existing Azure Data Share relationship.

### What happens to data already copied through Azure Data Share?

Retirement does not by itself delete copies already stored in a customer-controlled destination. The destination owner remains responsible for access, retention and deletion. Customers should reconcile final snapshots and obligations.

### What should customers preserve before cutover?

Retain resource and dataset definitions, invitations and subscriptions, mappings, schedules, snapshot and run history, logs, owners, permissions, terms, and final record counts.

### How are private endpoints, managed identities, and regional requirements handled?

Replacement paths have different identity and network models. Revalidate workload identities, private connectivity, firewall rules, tenant settings, geography, and sovereignty.

### What should customers do now?

Begin non-disruptive discovery and testing. Keep supported production shares running, identify critical relationships, contact both providers and consumers, and look to use Fabric-based data sharing or other options listed.

## Support and escalation

Until **November 12, 2029**, continue to use existing Azure support channels for supported Azure Data Share incidents.

For transition planning, engage your Microsoft account team where necessary. Provide the subscription, Azure Data Share resource, provider and consumer relationship, region, scenario, and business impact.

## Related content

- [Azure Data Share overview](overview.md)
- [Fabric external data sharing overview](/fabric/governance/external-data-sharing-overview)
- [Microsoft Purview Data Sharing public preview retirement announcement](https://azure.microsoft.com/updates?id=microsoft-purview-data-sharing-in-public-preview-is-retiring)
