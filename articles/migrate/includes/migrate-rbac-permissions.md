---
author: molish
ms.author: molir 
ms.topic: include
ms.date: 11/6/2025
# Customer intent: As a cloud admin I can use Azure Migrate built in roles to distribute access to Migration teams.
---
## Prepare Azure accounts
Assign the following built-in roles to prepare Azure accounts. To create an Azure Migrate project, the user **must have the Azure Migrate Owner role** or a higher privileged role.

| S.no. | Built-in role | Description | ID | Scope |
|-------|---------------|-------------|-----|-------|
| 1 | Azure Migrate Owner | Grants **full access** to **create** and manage **Azure Migrate projects**, including appliance-based or import-based discovery, business case & assessment creation, and migration execution; also grants permission to assign Azure Migrate-specific roles in Azure Role-Based Access Control (RBAC).. | fd8ea4d5-6509-4db0-bada-356ab233b4fa | Scope is resource group or subscription where **Azure Migrate project is created**. |
| 2 | Azure Migrate Decide and Plan Expert | Grants **restricted access on an Azure Migrate project** to only **perform planning operations** including discovery using an appliance or import, updating and managing inventory, identifying server dependencies, defining applications, and creating business cases and assessments. | 7859c0b0-0bb9-4994-bd12-cd529af7d646 | Scope is resource group or subscription where **Azure Migrate project is created**. |
| 3 | Azure Migrate Execute Expert | Grants **restricted access on an Azure Migrate project** to only perform **migration related operations**,  including replication, executing test migrations, tracking and monitoring migration progress, and performing agentless and agent-based migrations. | 1cfa4eac-9a23-481c-a793-bfb6958e836b | Source resource group or subscription where **Azure Migrate project is created**; **Target resource group or subscription** where servers and workloads are migrated to. |

To register an Azure Migrate appliance or an Azure Site Recovery replication appliance, users must have additional Application Developer role at Microsoft Entra ID level. 
Refer [this article](../prepare-azure-accounts.md) to prepare Azure accounts.

