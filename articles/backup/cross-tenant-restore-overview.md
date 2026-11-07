---
title: What is cross-tenant restore for Azure Backup? (Preview)
description: Learn how cross-tenant restore in Azure Backup lets you restore vaulted backup data from a source tenant to a target tenant by using a vault mapping. Learn about supported vaults, workloads, and regions.
ms.topic: overview
ms.date: 10/23/2026
ms.service: azure-backup
ms.custom: references_regions
author: akarshprabhu
ms.author: akak
#customer intent: As a security administrator, I want to understand how cross-tenant restore works in Azure Backup, so that I can decide whether to use it to recover protected data in a different tenant after a tenant lockout, ransomware attack, or tenant consolidation.
---

# What is cross-tenant restore for Azure Backup? (Preview)

Cross-tenant restore lets you restore vaulted backup data from one Microsoft Entra tenant (the *source tenant*) to a different tenant (the *target tenant*). You create a mapping between a source vault and a target vault, and then restore from the target tenant. Cross-tenant restore supports Recovery Services vaults and Backup vaults.

> [!IMPORTANT]
> Cross-tenant restore for Azure Backup is currently in preview. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

## Use cases

Use cross-tenant restore in scenarios such as:

- **Tenant lockout**: You lose access to the source tenant and need to recover your data in another tenant that you control.
- **Ransomware attack**: The source tenant is compromised, and you need to recover your data in a clean, isolated tenant.
- **Tenant consolidation**: You merge tenants and need to bring protected data into the consolidated tenant.
- **Cross-tenant disaster recovery**: You need to recover workloads in a different tenant as part of a disaster recovery operation.

## How cross-tenant restore works

Cross-tenant restore involves the following entities:

| Entity | Tenant | Description |
| --- | --- | --- |
| Source vault | Source tenant | The vault that the data source backs up to. |
| Data source | Source tenant | The protected resource, such as a virtual machine. |
| Backup data | Microsoft-managed tenant | Azure Backup stores backup data in storage accounts in a tenant that Microsoft manages. |
| Target vault | Target tenant | The vault that you restore from. A Resource Guard in the target tenant must protect it. |

To restore across tenants:

1. Create a vault mapping between the source vault and the target vault.
1. In the target vault, browse the protected items that the mapping surfaces from the source vault.
1. Select a recovery point, and restore the data to the target tenant.

Because the target vault must be associated with a [Resource Guard](multi-user-authorization-concept.md), multi-user authorization protects the mapping operation.

## Supported workloads and limitations

Cross-tenant restore supports alternate location restore only. It doesn't support original location restore. Only vaulted recovery points are eligible. Snapshot-only recovery points aren't eligible.

| Vault type | Workload | Limitations |
| --- | --- | --- |
| Recovery Services vault | Azure Virtual Machines | Confidential VMs, VMs encrypted with Azure Disk Encryption (ADE), and archive-tier recovery points aren't supported. |
| Recovery Services vault | Azure Files | None. |
| Recovery Services vault | SQL Server in Azure VM | SQL instance restore and archive-tier recovery points aren't supported. |
| Recovery Services vault | SAP HANA in Azure VM | HANA instance restore isn't supported. |
| Recovery Services vault | SAP ASE in Azure VM | None. |
| Backup vault | Azure Database for PostgreSQL - Flexible Server | None. |
| Backup vault | Azure Blobs | None. |
| Backup vault | Azure Cosmos DB | None. |
| Backup vault | Azure Data Lake Storage | None. |
| Backup vault | Azure Kubernetes Service (AKS) | None. |

## Region availability

| Vault type | Supported regions |
| --- | --- |
| Recovery Services vault | All Azure public regions |
| Backup vault | West Europe, North Europe, East US, UK South, Australia East, Australia Southeast, and Brazil South |

## Considerations

- The source vault and protected item must exist and must not be deleted when you restore. Only vaulted recovery points are eligible, as described in [Supported workloads and limitations](#supported-workloads-and-limitations).
- While a mapping exists, you can't delete the source vault, the target vault, or a protected item in the source vault. Delete the mapping first.
- Cross-tenant restore requires a Resource Guard in the target tenant and specific Azure roles. For details, see [Prerequisites](tutorial-cross-tenant-restore.md#prerequisites) and [Assign the required roles](tutorial-cross-tenant-restore.md#assign-the-required-roles) in the tutorial.

## Related content

- [Tutorial: Configure cross-tenant restore and restore data across tenants (preview)](tutorial-cross-tenant-restore.md)
- [Multi-user authorization using Resource Guard](multi-user-authorization-concept.md)
