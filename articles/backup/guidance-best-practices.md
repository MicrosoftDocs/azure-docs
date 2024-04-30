---
title: Guidance and best practices
description: Discover the best practices and guidance for backing up cloud and on-premises workload to the cloud
ms.topic: conceptual
ms.date: 03/12/2024
ms.reviewer: dapatil
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Backup cloud and on-premises workloads to cloud

Azure Backup comprehensively protects your data assets in Azure through a simple, secure, and cost-effective solution that requires zero-infrastructure. It's Azure's built-in data protection solution for a wide range of workloads. It helps protect your mission critical workloads running in the cloud, and ensures your backups are always available and managed at scale across your entire backup estate.

### Intended audience

The primary target audience for this article is the IT and application administrators, and implementers of large and mid-sized organizations, who want to learn about the capabilities of Azure’s built-in data protection technology, Azure Backup, and to implement solutions to protect your deployments efficiently. The article assumes you're familiar with core Azure technologies, data protection concepts and have experience working with a backup solution. The guidance covered in this article can make it easier to design your backup solution on Azure using established patterns and avoid known pitfalls.

### How this article is organized

While it’s easy to start protecting infrastructure and applications on Azure, when you ensure that the underlying Azure resources are set up correctly and being used optimally you can accelerate your time to value. This article covers a brief overview of design considerations and guidance for optimally configuring your Azure Backup deployment. It examines the core components (for example, Recovery Services vault, Backup Policy) and concepts (for example, governance) and how to think of them and their capabilities with links to detailed product documentation.

## Get started

### Subscription design strategy

Apart from having a clear roadmap to navigate through the Cloud Adoption Journey, you must plan your cloud deployment's subscription design and account structure to match your organization's ownership, billing, and management capabilities. As the vault is scoped to a subscription, your Subscription design will highly influence your Vault design. 
[Learn more](/azure/cloud-adoption-framework/decision-guides/subscriptions/) about different Subscription Design Strategies and guidance on when to use them.

### Document your Backup requirements

To get started with Azure Backup, plan your backup needs. Following are some of the questions you should ask yourself while formulating a perfect backup strategy. 

###### What workload type do you wish to protect?

To design your vaults, ensure if you require a centralized/ decentralized mode of operation. 

###### What’s the required backup granularity	?

Determine if it should be application consistent, crash consistent, or log backup.

###### Do you’ve any compliance requirements?

Ensure if you need to enforce security standards and separate access boundaries.

###### What’s the required RPO, RTO?

Determine the backup frequency and the speed of restore.

###### Do you’ve any Data Residency constraints?

Determine the storage redundancy for the required Data Durability.

###### How long do you want to retain the backup data?

Decide on the duration the backed-up data be retained in the storage.

## Architecture

:::image type="content" source="./media/guidance-best-practices/azure-backup-architecture.png" alt-text="Diagram showing Azure Backup architecture.":::

### Workloads

Azure Backup enables data protection for various workloads (on-premises and cloud). It's a secure and reliable built-in data protection mechanism in Azure. It can seamlessly scale its protection across multiple workloads without any management overhead for you. There are multiple automation channels as well to enable this (via PowerShell, CLI, Azure Resource Manager templates, and REST APIs.)

* **Scalable, durable, and secure storage**: Azure Backup uses reliable Blob storage with in-built security and high availability features. You can choose LRS, GRS, or RA-GRS storages for your backup data.  

* **Native workload integration**: Azure Backup provides native integration with Azure Workloads (VMs, SAP HANA, SQL in Azure VMs and even Azure Files) without requiring you to manage automation or infrastructure to deploy agents, write new scripts or provision storage. 

 [Learn more](./backup-overview.md#what-can-i-back-up) about supported workloads.

### Data plane

- **Automated storage management**: Azure Backup automates provisioning and managing storage accounts for the backup data to ensure it scales as the backup data grows.

- **Malicious delete protection**: Protect against any accidental and malicious attempts for deleting your backups via soft delete of backups. The deleted backup data is stored for 14 days free of charge and allows it to be recovered from this state.

- **Secure encrypted backups**: Azure Backup ensures your backup data is stored in a secure manner, leveraging built-in security capabilities of the Azure platform, such as Azure role-based access control (Azure RBAC) and Encryption.

- **Backup data lifecycle management**: Azure Backup automatically cleans up older backup data to comply with the retention policies. You can also tier your data from operational storage to vault storage.

- **Protected critical operations**: Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults.

### Management plane

* **Access control**: Vaults (Recovery Services and Backup vaults) provide the management capabilities and are accessible via the Azure portal, Backup Center, Vault dashboards, SDK, CLI, and even REST APIs. It's also an Azure role-based access control (Azure RBAC) boundary, providing you with the option to restrict access to backups only to authorized Backup Admins.

* **Policy management**: Azure Backup Policies within each vault define when the backups should be triggered and the duration they need to be retained. You can also manage these policies and apply them across multiple items.

* **Monitoring and Reporting**: Azure Backup integrates with Log Analytics and provides the ability to see reports via Workbooks as well.

* **Snapshot management**: Azure Backup takes snapshots for some Azure native workloads (VMs and Azure Files), manages these snapshots and allows fast restores from them. This option drastically reduces the time to recover your data to the original storage.

## Vault considerations

Azure Backup uses  vaults (Recovery Services and Backup vaults) to orchestrate, manage backups, and store backed-up data. Effective vault design helps organizations establish a structure to organize and manage the backup assets in Azure to support your business priorities. Consider the following guidelines when creating a vault.

### Single or multiple vaults

To use a single vault or multiple vaults to organize and manage your backup, see the following guidelines:

- **Protect resources across multiple regions globally**: If your organization has global operations across North America, Europe, and Asia, and your resources are deployed in East-US, UK West, and East Asia. One of the requirements of Azure Backup is that the vaults are required to be present in the same region as the resource to be backed-up. Therefore, you should create three separate vaults for each region to protect your resources.

- **Protect resources across various Business Units and Departments**: Consider that your business operations are divided into three separate Business Units (BU), and each business unit has its own set of departments (five departments - Finance, Sales, HR, R & D, and Marketing). Your business needs may require each department to manage and access their own backups and restores; also, enable them to track their individual usage and cost expense. For such scenarios, we recommend you to create one vault for each department in a BU. This way, you’ll have 15 Vaults across your organization.

- **Protect different workloads**: If you plan to protect different types of workloads (such as 150 VMs, 40 SQL databases, and 70 PostgreSQL databases), then we recommend you create separate vaults for each type of workload (for this example, you need to create three vaults for each workload - VMs, SQL databases, and PostgreSQL databases). This helps you to separate access boundaries for the users by allowing you to grant access (using Azure role-based access control – Azure RBAC) to the relevant stakeholders.

- **Protect resources running in multiple environments**: If your operations require you to work on multiple environments, such as production, non-production, and developer, then we recommend you create separate vaults for each.

- **Protect large number (1000+) of Azure VMs**: Consider that you have 1500 VMs to back up. Azure Backup allows only 1000 Azure VMs to be backed-up in one vault. For this scenario, you can create two different vaults and distribute the resources as 1000 and 500 VMs to respective vaults or in any combination considering the upper limit.

- **Protect large number (2000+) of diverse workloads**: While managing your backups at scale, you’ll protect the Azure VMs, along with other workloads, such as SQL and SAP HANA database running on those Azure VMs. For example, you’ve 1300 Azure VMs and 2500 SQL databases to protect. The vault limits allow you to back up 2000 workloads (with a restriction of 1000 VMs) in each vault. Therefore, mathematically you can back up 2000 workloads in one vault (1000 VMs + 1000 SQL databases) and rest 1800 workloads in a separate vault (300 VMs + 1500 SQL databases).

  However, this type of segregation isn’t recommended as you won’t be able to define access boundaries and the workloads won’t be isolated from each other. So, to distribute the workloads correctly, create four vaults. Two vaults to back up the VMs (1000 VMs + 300 VMs) and the other two vaults to back up the SQL databases (2000 databases + 500 databases).

- You can manage them with:

  - Backup center allows you to have a single pane to manage all Backup tasks. [Learn more here]().
  - If you need consistent policy across vaults, then you can use Azure Policy to propagate backup policy across multiple vaults. You can write a custom [Azure Policy definition](../governance/policy/concepts/definition-structure.md) that uses the [‘deployifnotexists’](../governance/policy/concepts/effects.md#deployifnotexists) effect to propagate a backup policy across multiple vaults. You can also [assign](../governance/policy/assign-policy-portal.md) this Azure Policy definition to a particular scope (subscription or RG), so that it deploys a 'backup policy' resource to all Recovery Services vaults in the scope of the Azure Policy assignment. The settings of the backup policy (such as backup frequency, retention, and so on) should be specified by the user as parameters in the Azure Policy assignment.

* As your organizational footprint grows, you might want to move workloads across subscriptions for the following reasons: align by backup policy, consolidate vaults, trade-off on lower redundancy to save on cost (move from GRS to LRS).  Azure Backup supports moving a Recovery Services vault across Azure subscriptions, or to another resource group within the same subscription. [Learn more here](backup-azure-move-recovery-services-vault.md).

### Review default settings

Review the default settings for Storage Replication type and Security settings to meet your requirements before configuring backups in the vault.

* *Storage Replication type* by default is set to Geo-redundant (GRS). Once you configure the backup, the option to modify is disabled. Follow [these](backup-create-rs-vault.md#set-storage-redundancy) steps to review and modify the settings.

  * Non-critical workloads like non-prod and dev are suitable for LRS storage replication.

  * Zone redundant storage (ZRS) is a good storage option for a high Data Durability along with Data Residency.

  * Geo-Redundant Storage (GRS) is recommended for mission-critical workloads, such as the ones running in production environment, to prevent permanent data loss, and protect it in case of complete regional outage or a disaster in which the primary region isn’t recoverable.

* *Soft delete* by default is Enabled on newly created vaults to protect backup data from accidental or malicious deletes. Follow [these](backup-azure-security-feature-cloud.md#enable-and-disable-soft-delete) steps to review and modify the settings.

* *Cross Region Restore* allows you to restore Azure VMs in a secondary region, which is an Azure paired region. This option allows you to conduct drills to meet audit or compliance requirements, and to restore the VM or its disk if there's a disaster in the primary region. CRR is an opt-in feature for any GRS vault. [Learn more here](backup-create-rs-vault.md#set-cross-region-restore).

* Before finalizing your vault design, review the [vault support matrixes](backup-support-matrix.md#vault-support) to understand the factors that might influence or limit your design choices.

## Backup Policy considerations

Azure Backup Policy has two components: *Schedule* (when to take backup) and *Retention* (how long to retain backup). You can define the policy based on the type of data that's being backed up, RTO/RPO requirements, operational or regulatory compliance needs and workload type (for example, VM, database, files). [Learn more](backup-architecture.md#backup-policy-essentials)

Consider the following guidelines when creating Backup Policy:

### Schedule considerations

While scheduling your backup policy, consider the following points:

- For mission-critical resources, try scheduling the most frequently available automated backups per day to have a smaller RPO. [Learn more](./backup-support-matrix.md#retention-limits)

  If you need to take multiple backups per day for Azure VM via the extension, see the workarounds in the [next section](#retention-considerations).

- For a resource that requires the same schedule start time, frequency, and retention settings, you need to group them under a single backup policy. 

- We recommend you to keep the backup scheduled start time during non-peak production application time. For example, it’s better to schedule the daily automated backup during night, around 2-3 AM, rather than scheduling it in the day time when the usage of the resources high. 

- To distribute the backup traffic, we recommend you back up different VMs at different times of the day. For example, to back up 500 VMs with the same retention settings, we recommend you to create 5 different policies associating them with 100 VMs each and scheduling them few hours apart.

### Retention considerations

* Short-term retention can be "daily". Retention for "Weekly", "monthly" or "yearly" backup points is referred to as Long-term retention.

* Long-term retention:

  * Planned (compliance requirements) - if you know in advance that data is required years from the current time, then use Long-term retention. Azure Backup supports back up of Long-Term Retention points in the archive tier, along with Snapshots and the Standard tier. [Learn more](./archive-tier-support.md) about supported workloads for Archive tier and retention configuration.
  * Unplanned (on-demand requirement) - if you don't know in advance, then use you can use on-demand with specific custom retention settings (these custom retention settings aren't impacted by policy settings).

* On-demand backup with custom retention - if you need to take a backup not scheduled via backup policy, then you can use an on-demand backup. This can be useful for taking backups that don’t fit your scheduled backup or for taking granular backup (for example, multiple IaaS VM backups per day since scheduled backup permits only one backup per day). It's important to note that the retention policy defined in scheduled policy doesn't apply to on-demand backups.

### Optimize Backup Policy

* As your business requirements change, you might need to extend or reduce retention duration. When you do so, you can expect the following:  
  * If retention is extended, existing recovery points are marked and kept in accordance with the new policy.
  * If retention is reduced, recovery points are marked for pruning in the next clean-up job, and subsequently deleted.
  * The latest retention rules apply for all retention points (excluding on-demand retention points). So if the retention period is extended (for example to 100 days), then when the backup is taken, followed by retention reduction (for example from 100 days to seven days), all backup data will be retained according to  the last specified retention period (that is, 7 days).

* Azure Backup provides you with the flexibility to *stop protecting and manage your backups*:
  * *Stop protection and retain backup data*. If you're retiring or decommissioning your data source (VM, application), but need to retain data for audit or compliance purposes, then you can use this option to stop all future backup jobs from protecting your data source and retain the recovery points that have been backed up. You can then restore or resume VM protection.
  * *Stop protection and delete backup data*. This option will stop all future backup jobs from protecting your VM and delete all the recovery points. You won't be able to restore the VM nor use Resume backup option.

  * If you resume protection (of a data source that has been stopped with retain data), then the retention rules will apply. Any expired recovery points will be removed (at the scheduled time).

* Before completing your policy design, it's important to be aware of the following factors that might influence your design choices.
  * A backup policy is scoped to a vault.
  * There's a limit on the number of items per policy (for example, 100 VMs). To scale, you can create duplicate policies with the same or different schedules.
  * You can't selectively delete specific recovery points.
  * You can't completely disable the scheduled backup and keep the data source in a protected state. The least frequent backup you can configure with the policy is to have one weekly scheduled backup. An alternative would be to stop protection with retain data and enable protection each time you want to take a backup, take an on-demand backup, and then turn off protection but retain the backup data. [Learn more here](backup-azure-manage-vms.md#stop-protecting-a-vm).

## Security considerations

To help you protect your backup data and meet the security needs of your business, Azure Backup provides confidentiality, integrity, and availability assurances against deliberate attacks and abuse of your valuable data and systems. Consider the following security guidelines for your Azure Backup solution:

### Authentication and authorization using Azure role-based access control (Azure RBAC)

- Azure role-based access control (Azure RBAC) enables fine-grained access management, segregation of  duties within your team and granting only the amount of access to users necessary to perform their jobs. [Learn more here](backup-rbac-rs-vault.md).

- If you’ve multiple workloads to back up (such as Azure VMs, SQL databases, and PostgreSQL databases) and you've multiple stakeholders to manage those backups, it is important to segregate their responsibilities so that user has access to only those resources they’re responsible for. Azure role-based access control (Azure RBAC) enables granular access management, segregation of duties within your team, and granting only the types of access to users necessary to perform their jobs. [Learn more](./backup-rbac-rs-vault.md)

- You can also segregate the duties by providing minimum required access to perform a particular task. For example, a person responsible for monitoring the workloads shouldn't have access to modify the backup policy or delete the backup items. Azure Backup provides three built-in roles to control backup management operations: Backup contributors, operators, and readers. Learn more here. For information about the minimum Azure role required for each backup operation for Azure VMs, SQL/SAP HANA databases, and Azure File Share, see [this guide](./backup-rbac-rs-vault.md).

- [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) also provides the flexibility to build [Custom Roles](../role-based-access-control/custom-roles.md) based on your individual requirements. If you’re unsure about the types of roles recommended for specific operation, you can utilize the built-in roles provided by Azure role-based access control (Azure RBAC) and get started. 

  The following diagram explains about how different Azure built-in roles work:

  :::image type="content" source="./media/guidance-best-practices/different-azure-built-in-roles-actions.png" alt-text="Diagram explains about how different Azure built-in roles work.":::

  - In the above diagram, _User2_ and _User3_ are Backup Readers. Therefore, they have the permission to only monitor the backups and view the backup services.

  - In terms of the scope of the access,

    - _User2_ can access only the Resources of Subscription1, and User3 can access only the Resources of Subscription2. 
    - _User4_ is a Backup Operator. It has the permission to enable backup, trigger on-demand backup, trigger restores, along with the capabilities of a Backup Reader. However, in this scenario, its scope is limited only to Subscription2. 
    - _User1_ is a Backup Contributor. It has the permission to create vaults, create/modify/delete backup policies, and stop backups, along with the capabilities of a Backup Operator. However, in this scenario, its scope is limited only to _Subscription1_.

- Storage accounts used by Recovery Services vaults are isolated and can't be accessed by users for any malicious purposes. The access is only allowed through Azure Backup management operations, such as restore.

### Encryption of data in transit and at rest

Encryption protects your data and helps you to meet your organizational security and compliance commitments.

* Within Azure, data in transit between Azure storage and the vault is protected by HTTPS. This data remains within the Azure network.

* Backup data is automatically encrypted using Microsoft-managed keys. Alternatively, you can use your own keys, also known as [customer managed keys](encryption-at-rest-with-cmk.md). Also, using CMK encryption for backup doesn't incur additional costs. However, the use of Azure Key Vault, where your key is stored, incur costs, which are a reasonable expense in return for the higher data security.

* Azure Backup supports backup and restore of Azure VMs that have their OS/data disks encrypted with Azure Disk Encryption (ADE). [Learn more](backup-azure-vms-encryption.md)

### Protection of backup data from unintentional deletes  with soft-delete

You may encounter scenarios where you’ve mission-critical backup data in a vault, and it gets deleted accidentally or erroneously. Also,  a malicious actor may delete your production backup items. It’s often costly and time-intensive to rebuild those resources and can even cause crucial data loss. Azure Backup provides safeguard against accidental and malicious deletion with the [Soft-Delete](./backup-azure-security-feature-cloud.md) feature by allowing you to recover those resources after they are deleted.

With soft-delete, if a user deletes the backup (of a VM, SQL Server database, Azure file share, SAP HANA database), the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days retention of backup data in the soft delete state doesn't incur any cost. [Learn more](./backup-azure-security-feature-cloud.md)

### Multi-User Authorization (MUA)

**How would you protect your data if your administrator goes rogue and compromises your system?**

Any administrator that has the privileged access to your backup data has the potential to cause irreparable damage to the system. A rogue admin can delete all your business-critical data or even turn off all the security measures that may leave your system vulnerable to cyber-attacks.

Azure Backup provides you with the [Multi-User Authorization (MUA)](./multi-user-authorization.md) feature to protect you from such rogue administrator attacks. Multi-user authorization helps protect against a rogue administrator performing destructive operations (that is, disabling soft-delete), by ensuring that every privileged/destructive operation is done only after getting approval from a security administrator. 

### Ransomware Protection

- Direct access to Azure Backup data to encrypt by malicious actor is ruled out, as all operations on backup data can only be performed through Recovery-Services vault or Backup Vault, which can be secured by Azure role-based access control (Azure RBAC) and MUA.

- By enabling soft-delete on backup data (which is enabled by default) will hold deleted data for 14 days (at free of cost). Disabling soft-delete can be protected using MUA. 

- Use longer retention (weeks, months, years) to ensure clean backups (not encrypted by ransomware) don’t expire prematurely, and there’re strategies in place for early detection and mitigation of such attacks on source data.

### Monitoring and alerts of suspicious activity

You may encounter scenarios where someone tries to breach into your system and maliciously turn off the security mechanisms, such as disabling Soft Delete or attempts to perform destructive operations, such as deleting the backup resources. 

Azure Backup provides security against such incidents by sending you critical alerts over your preferred notification channel (email, ITSM, Webhook, runbook, and sp pn) by creating an [Action Rule](../azure-monitor/alerts/alerts-action-rules.md) on top of the alert. [Learn more](./security-overview.md#monitoring-and-alerts-of-suspicious-activity)

### Security features to help protect hybrid backups

Azure Backup service uses the Microsoft Azure Recovery Services (MARS) agent to back up and restore files, folders, and the volume or system state from an on-premises computer to Azure. MARS now provides security features: a passphrase to encrypt before upload and decrypt after download from Azure Backup, deleted backup data is retained for an additional 14 days from the date of deletion, and critical operation (ex. changing a passphrase) can be performed only by users who have valid Azure credentials. [Learn more here](backup-azure-security-feature.md).

## Network considerations

Azure Backup requires movement of data from your workload to the Recovery Services vault. Azure Backup provides several capabilities to protect backup data from being exposed inadvertently (such as a man-in-the-middle attack on the network). Consider the following guidelines:

### Internet connectivity

* **Azure VM backup**: All the required communication and data transfer between storage and Azure Backup service happens within the Azure network without needing to access your virtual network. So backup of Azure VMs placed inside secured networks don't require you to allow access to any IPs or FQDNs.

* **SAP HANA databases on Azure VM, SQL Server databases on Azure VM**: Requires connectivity to the Azure Backup service, Azure Storage, and Microsoft Entra ID. This can be achieved by using private endpoints or by allowing access to the required public IP addresses or FQDNs. Not allowing proper connectivity to the required Azure services may lead to failure in operations like database discovery, configuring backup, performing backups, and restoring data. For complete network guidance while using NSG tags, Azure firewall, and HTTP Proxy, refer to these [SQL](backup-sql-server-database-azure-vms.md#establish-network-connectivity) and [SAP HANA](./backup-azure-sap-hana-database.md#establish-network-connectivity) articles.

* **Hybrid**: The MARS (Microsoft Azure Recovery Services) agent requires network access for all critical operations - install, configure, backup, and restore. The MARS agent can connect to the Azure Backup service over [Azure ExpressRoute](install-mars-agent.md#azure-expressroute-support) by using public peering (available for old circuits) and Microsoft peering, using [private endpoints](install-mars-agent.md#private-endpoint-support) or via [proxy/firewall with appropriate access controls](install-mars-agent.md#verify-internet-access).

### Private Endpoints for secure access

While protecting your critical data with Azure Backup, you wouldn’t want your resources to be accessible from the public internet. Especially, if you’re a bank or a financial institution, you would have stringent compliance and security requirements to protect your High Business Impact (HBI) data. Even in the healthcare industry, there are strict compliance rules.  

To fulfill all these needs, use [Azure Private Endpoint](../private-link/private-endpoint-overview.md), which is a network interface that connects you privately and securely to a service powered by Azure Private Link. We recommend you to use private endpoints for secure backup and restore without the need to add to an allowlist of any IPs/FQDNs for Azure Backup or Azure Storage from your virtual networks.

[Learn more](./private-endpoints.md#get-started-with-creating-private-endpoints-for-backup) about how to create and use private endpoints for Azure Backup inside your virtual networks.

* When you enable private endpoints for the vault, they're only used for backup and restore of SQL and SAP HANA workloads in an Azure VM, MARS agent, DPM/MABS backups. You can use the vault for the backup of other workloads as well (they won’t require private endpoints though). In addition to the backup of SQL and SAP HANA workloads, backup using the MARS agent and DPM/MABS Server, private endpoints are also used to perform file recovery in the case of Azure VM backup. [Learn more here](private-endpoints-overview.md#recommended-and-supported-scenarios).

* Microsoft Entra ID doesn't currently support private endpoints. So, IPs and FQDNs required for Microsoft Entra ID will need to be allowed outbound access from the secured network when performing backup of databases in Azure VMs and backup using the MARS agent. You can also use NSG tags and Azure Firewall tags for allowing access to Microsoft Entra ID, as applicable. Learn more about the [prerequisites here](./private-endpoints.md#before-you-start).

## Governance considerations

Governance in Azure is primarily implemented with [Azure Policy](../governance/policy/overview.md) and [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md). [Azure Policy](../governance/policy/overview.md) allows you to create, assign, and manage policy definitions to enforce rules for your resources. This feature keeps those resources in compliance with your corporate standards. [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) allows you to track cloud usage and expenditures for your Azure resources and other cloud providers. Also, the following tools such as [Azure Price Calculator](https://azure.microsoft.com/pricing/calculator/) and [Azure Advisor](../advisor/advisor-overview.md)  play an important role in the cost management process.

### Auto-configure newly provisioned backup infrastructure with Azure Policy at Scale

- Whenever new infrastructure is provisioned and new VMs are created, as a backup admin,  you need to ensure their protection. You can easily configure backups for one or two VMs. But it becomes complex when you need to configure hundreds or even thousands of VMs at scale. To simplify the process of configuring backups, Azure Backup provides you with a set of built-in Azure Policies to govern your backup estate.  

- **Auto-enable backup on VMs using Policy (Central backup team model)**: If your organization has a central backup team that manages backups across application teams, you can use this policy to configure backup to an existing central Recovery Services vault in the same subscription and location as that of the VMs. You can choose to include/exclude VMs that contain a certain tag from the policy scope. [Learn more](backup-azure-auto-enable-backup.md#policy-1---configure-backup-on-vms-without-a-given-tag-to-an-existing-recovery-services-vault-in-the-same-location).

- **Auto-enable backup on VMs using Policy (where backup owned by application teams)**: If you organize applications in dedicated resource groups and want to have them backed-up by the same vault, use this policy to automatically manage this action. You can choose to include/exclude VMs that contain a certain tag from the policy scope. [Learn more](backup-azure-auto-enable-backup.md#policy-3---configure-backup-on-vms-without-a-given-tag-to-a-new-recovery-services-vault-with-a-default-policy).

- **Monitoring Policy**: To generate the Backup Reports for your resources,  enable the diagnostic settings when you create a new vault. Often, adding a diagnostic setting manually per vault can be a cumbersome task. So, you can utilize an Azure built-in policy that configures the diagnostics settings at scale to all vaults in each subscription or resource group, with Log Analytics as the destination. 

- **Audit-only Policy**: Azure Backup also provides you with an Audit-only policy that identifies the VMs with no backup configuration. 

### Azure Backup cost considerations

The Azure Backup service offers the flexibility to effectively manage your costs; also, meet your BCDR (business continuity and disaster recovery) business requirement. Consider the following guidelines:

* Use the pricing calculator to evaluate and optimize cost by adjusting various levers. [Learn more](azure-backup-pricing.md)

* Optimize backup policy,

  * Optimize schedule and retention settings based on workload archetypes (such as mission-critical, non-critical).
  * Optimize retention settings for Instant Restore.
  * Choose the right backup type to meet requirements, while taking supported backup types (full, incremental, log, differential) by the workload in Azure Backup.

* **Reduce the backup storage cost with Selectively backup disks**: Exclude disk feature provides an efficient and cost-effective choice to selectively backup critical data. For example, you can back up only one disk when you don't want to back up all disks attached to a VM. This is also useful when you have multiple backup solutions. For example, to back up your databases or data with a workload backup solution (SQL Server database in Azure VM backup), use Azure VM level backup for selected disks.

- **Speed up your Restores and minimize RTO using the Instant Restore feature**: Azure Backup takes snapshots of Azure VMs and stores them along with the disks to boost recovery point creation and to speed up restore operations. This is called Instant Restore. This feature allows a restore operation from these snapshots by cutting down the restore times. It reduces the time needed to transform and copy data back from the vault. Therefore,  it’ll incur storage costs for the snapshots taken during this period. Learn more about [Azure Backup Instant Recovery capability](./backup-instant-restore-capability.md).

- **Choose correct replication type**: Azure Backup vault's Storage Replication type is set to Geo-redundant (GRS), by default. This option can't be changed after you start protecting items. Geo-redundant storage (GRS) provides a higher level of data durability than Locally redundant storage (LRS), allows an opt-in to use Cross Region Restore, and costs more. Review the trade-offs between lower costs and higher data durability and  choose the best option for your scenario. [Learn more](./backup-create-rs-vault.md#set-storage-redundancy)

- **Use Archive Tier for Long-Term Retention (LTR) and save costs**: Consider the scenario where you’ve older backup data that you rarely access, but is required to be stored for a long period  (for example, 99 years) for compliance reasons. Storing such huge data in a Standard Tier is costly and isn’t economical. To help you optimize your storage costs, Azure Backup provides you with [Archive Tier](./archive-tier-support.md), which is an access tier especially designed for Long-Term Retention (LTR) of the backup data.


- If you're protecting both the workload running inside a VM and the VM itself, ensure if this dual protection is needed.

## Monitoring and Alerting considerations

As a backup user or administrator, you should be able to monitor all backup solutions and get notified on important scenarios. This section details the monitoring and notification capabilities provided by the Azure Backup service.

### Monitor

* Azure Backup provides **built-in job monitoring** for operations such as configuring backup, back up, restore, delete backup, and so on. This is scoped to the vault, and ideal for monitoring a single vault. [Learn more here](backup-azure-monitoring-built-in-monitor.md#backup-jobs-in-backup-center).

* If you need to monitor operational activities at scale, then **Backup Explorer** provides an aggregated view of your entire backup estate, enabling detailed drill-down analysis and troubleshooting. It's a built-in Azure Monitor workbook that gives a single, central location to help you monitor operational activities across the entire backup estate on Azure, spanning tenants, locations, subscriptions, resource groups, and vaults. [Learn more here](monitor-azure-backup-with-backup-explorer.md).
  * Use it to identify resources that aren't configured for backup, and ensure that you don't ever miss protecting critical data in your growing estate.
  * The dashboard provides operational activities for the last seven days (maximum). If you need to retain this data, then you can export as an Excel file and retain them.
  * If you're an Azure Lighthouse user, you can view information across multiple tenants, enabling boundary-less monitoring.

* If you need to retain and view the operational activities for long-term, then use **Reports**. A common requirement for backup admins is to obtain insights on backups based on data that spans an extended period of time. Use cases for such a solution include:
  * Allocating and forecasting of cloud storage consumed.
  * Auditing of backups and restores.
  * Identifying key trends at different levels of granularity.

* In addition,
  * You can send data (for example, jobs, policies, and so on) to the **Log Analytics** workspace. This will enable the features of Azure Monitor Logs to enable correlation of data with other monitoring data collected by Azure Monitor, consolidate log entries from multiple Azure subscriptions and tenants into one location for analysis together, use log queries to perform complex analysis and gain deep insights on Log entries. [Learn more here](../azure-monitor/essentials/activity-log.md#send-to-log-analytics-workspace).
  * You can send data to an Azure event hub to send entries outside of Azure, for example to a third-party SIEM (Security Information and Event Management) or other log analytics solution. [Learn more here](../azure-monitor/essentials/activity-log.md#send-to-azure-event-hubs).
  * You can send data to an Azure Storage account if you want to retain your log data longer than 90 days for audit, static analysis, or back up. If you only need to retain your events for 90 days or less, you don't need to set up archives to a storage account, since Activity Log events are kept in the Azure platform for 90 days. [Learn more](../azure-monitor/essentials/activity-log.md#send-to-azure-storage).

### Alerts

In a scenario where your backup/restore job failed due to some unknown issue. To assign an engineer to debug it, you would want to be notified about the failure as soon as possible. There could also be a scenario where someone maliciously performs a destructive operation, such as deleting backup items or turning off soft-delete, and you would require an alert message for such incident. 

You can configure such critical alerts and route them to any preferred notification channel (email, ITSM, webhook, runbook, and so on). Azure Backup integrates with multiple Azure services to meet different alerting and notification requirements: 

- **Azure Monitor Logs (Log Analytics)**: You can configure your [vaults to send data to a Log Analytics workspace](./backup-azure-monitoring-use-azuremonitor.md#create-alerts-by-using-log-analytics), write custom queries on the workspace, and configure alerts to be generated based on the query output. You can view the query results  in tables and charts; also, export them to Power BI or Grafana. (Log Analytics is also a key component of the reporting/auditing capability described in the later sections). 
 
-	Azure Monitor Alerts: For certain default scenarios, such as backup failure, restore failure, backup data deletion, and so on, Azure Backup sends alerts by default that are surfaced using Azure Monitor, without the need for a user to set up a Log Analytics workspace. 

- Azure Backup provides an **in-built alert** notification mechanism via e-mail for failures, warnings, and critical operations. You can specify individual email addresses or distribution lists to be notified when an alert is generated. You can also choose whether to get notified for each individual alert or to group them in an hourly digest and then get notified.
  - These alerts are defined by the service and provide support for limited scenarios - backup/restore failures, Stop protection with retain data/Stop protection with delete data, and so on. [Learn more here](backup-azure-monitoring-built-in-monitor.md#alert-scenarios).
  - If a destructive operation such as stop protection with delete data is performed, an alert is raised and an email is sent to subscription owners, admins, and co-admins even if notifications are **not** configured for the Recovery Services vault.
  - Certain workloads can generate high frequency of failures (for example, SQL Server every 15 minutes). To prevent getting overwhelmed with alerts raised for each failure occurrence, the alerts are consolidated. [Learn more here](backup-azure-monitoring-built-in-monitor.md#consolidated-alerts).
  - The in-built alerts can't be customized and are restricted to emails defined in the Azure portal.

- If you need to **create custom alerts** (for example, alerts of successful jobs) then use Log Analytics. In Azure Monitor, you can create your own alerts in a Log Analytics workspace. Hybrid workloads (DPM/MABS) can also send data to LA and use LA to provide common alerts across workloads supported by Azure Backup.

- You can also get notifications through built-in Recovery Services vault **activity logs**. However, it supports limited scenarios and isn't suitable for operations such as scheduled backup, which aligns better with resource logs than with activity logs. To learn more about these limitations and how you can use Log Analytics workspace for monitoring and alerting at scale for all your workloads that are protected by Azure Backup, refer to this [article](backup-azure-monitoring-use-azuremonitor.md#using-log-analytics-to-monitor-at-scale).

#### Automatic Retry of Failed Backup Jobs

Many of the failure errors or the outage scenarios are transient in nature, and you can remediate by setting up the right Azure role-based access control (Azure RBAC) permissions or re-trigger the backup/restore job. As the solution to such failures is  simple, that you don’t need to invest time waiting for an engineer to manually trigger the job or to assign the relevant permission. Therefore, the smarter way to handle this scenario is to automate the retry of the failed jobs. This will highly minimize the time taken to recover from failures. 
You can achieve this by retrieving relevant backup data via Azure Resource Graph (ARG) and combine it with corrective [PowerShell/CLI procedure](/azure/architecture/framework/resiliency/auto-retry). 

Watch the following video to learn how to re-trigger backup for all failed jobs (across vaults, subscriptions, tenants) using ARG and PowerShell.

> [!VIDEO https://www.youtube.com/embed/8dioCgHNb5w]

#### Route Alerts to your preferred notification channel

While transient errors can be corrected, some persistent errors might require in-depth analysis, and retriggering the jobs may not be the viable solution. You may have your own monitoring/ticketing mechanisms to ensure such failures are properly tracked and fixed. To handle such scenarios, you can choose to route the alerts to your preferred notification channel (email, ITSM, Webhook, runbook, and so on) by creating an Action Rule on the alert. 

Watch the following video to learn how to leverage Azure Monitor to configure various notification mechanisms for critical alerts.

> [!VIDEO https://www.youtube.com/embed/oYuIJKEPOYY]

## Next steps

Read the following articles as starting points for using Azure Backup:

* [Azure Backup overview](backup-overview.md)
* [Frequently Asked Questions](backup-azure-backup-faq.yml)
