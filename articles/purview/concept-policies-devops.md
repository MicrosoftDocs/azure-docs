---
title: Microsoft Purview DevOps policies concepts
description: Understand Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 03/03/2023
---

# What can I accomplish with Microsoft Purview DevOps policies?

This article discusses concepts related to managing access to data sources in your data estate using the Microsoft Purview governance portal. In particular, it focuses on DevOps policies.

> [!Note]
> This capability is different from the internal access control for Microsoft Purview itself, which is described in [Access control in Microsoft Purview](./catalog-permissions.md).

## Overview
Access to system metadata is crucial for IT/DevOps personnel to ensure that critical database systems are healthy, are performing to expectations and are secure. That access can be granted and revoked efficiently and at-scale through Microsoft Purview DevOps policies.

### Microsoft Purview access policies vs. DevOps policies
Microsoft Purview access policies enable customers to manage access to different data systems across their entire data estate, all from a central location in the cloud. You can think about these policies as access grants that can be created through Microsoft Purview Studio, avoiding the need for code. They dictate whether a list of Azure AD principals (users, groups, etc.) should be allowed or denied a specific type of access to a data source or asset within it. These policies get communicated by Microsoft Purview to the data sources, where they get natively enforced.

DevOps policies are a special type of Microsoft Purview access policies. They grant access to database system metadata instead of user data. They simplify access provisioning for IT operations and security auditing personnel. DevOps policies only grant access, that is, they don't deny access.

## Elements of a DevOps policy
A DevOps policy is defined by three elements: The *data resource path*, the *role* and the *subject*. In essence, the DevOps policy assigns the *subject* to the *role* for the scope of the *data resource path*.
    
#### The subject
This is a list of Azure AD users, groups or service principals.

#### The role
The role maps to a set of actions that the policy permits on the data resource. DevOps policies support a couple of roles: *SQL Performance Monitor* and *SQL Security Auditor*. Both these roles provide access to SQL's system metadata, and more specifically to Dynamic Management Views (DMFs) and Dynamic Management Functions (DMFs). But the set of DMVs/DMFs granted by these roles is different. We provide some examples at the end of this document. Also, the DevOps policies how-to docs detail the role definition for each data source type, that is, the mapping between the role in Microsoft Purview and the actions that get permitted in that type of data source. For example, the role definition for SQL Performance Monitor and SQL Security Auditor includes Connect actions at server and database level on the data source side.

#### The data resource
Microsoft Purview DevOps policies currently support SQL-type data sources and can be configured on individual data sources, resource groups and subscriptions. The data resource path is the composition of subscription > resource group > data source. DevOps policies can only be created after the data resource is registered in Microsoft Purview with the option *Data use management* enabled. 

#### Hierarchical enforcement of policies
A DevOps policy on a data resource is enforced on the data resource itself and all children contained by it. For example, a DevOps policy on an Azure subscription applies to all resource groups, to all policy-enabled data sources within each resource group, and to all databases contained within each data source.

## A sample scenario to demonstrate the concept and the benefits
Bob and Alice are involved with the DevOps process at their company. Given their role, they need to log in to dozens of Azure SQL logical servers to monitor their performance so that critical DevOps processes don’t break. Their manager, Mateo, creates an Azure AD group and includes Alice and Bob. He then uses Microsoft Purview DevOps policies (Policy 1 in the diagram below) to grant this Azure AD group access to Resource Group 1, which hosts the Azure SQL servers.

![Diagram shows an example of DevOps policy on resource group.](./media/concept-policies-devops/devops-policy-on-resource-group.png).

#### These are the benefits:
- Mateo doesn't have to create local logins in each logical server
- The policies from Microsoft Purview improve security by helping limit local privileged access. This is what we call PoLP (Principle of Least Privilege). In the scenario, Mateo only grants the minimum access necessary that Bob and Alice need to perform the task of monitoring system health and performance.
- When new Azure SQL servers are added to the resource group, Mateo doesn't need to update the policy in Microsoft Purview for it to be enforced on the new logical servers.
- If Alice or Bob leave their job and get backfilled, Mateo just updates the Azure AD group, without having to make any changes to the servers or to the policies he created in Microsoft Purview.
- At any point in time, Mateo or the company’s auditor can see what access has been granted directly in Microsoft Purview Studio.

## Examples of popular DMVs/DMFs
Dynamic metadata includes a list of more than 700 DMVs/DMFs. We list here as an illustration some of the most popular ones, mapped to their role definition in Microsoft Purview DevOps policies and linked to the URL with their description.

| **DevOps role definition** | **DMV/DMF examples**     |
|-------------------------------------|--------------------------------------|
|                                     |                                      |
| *SQL Performance Monitor* | dm_exec_requests |
|| [sys.dm_os_wait_stats](https://learn.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql?view=sql-server-ver16)|
|| dm_exec_query_stats|
|| dm_exec_sessions|
|| dm_os_waiting_tasks|
|| dm_exec_procedure_stats|
|||               
| *SQL Security Auditor* ||
|||
|||
|||
|||
|||
|||


## More info
- DevOps policies can be created, updated and deleted by any user holding *Policy Author* role at root collection level in Microsoft Purview.
- Once saved, DevOps policies get automatically published.

## Next steps
To get started with DevOps policies, consult the following blogs, videos and guides:
* Blog: [Microsoft Purview DevOps policies enter General Availability](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-enter-ga-simplify-access/ba-p/3674057)
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Video: [DevOps policies quick overview](https://aka.ms/Microsoft-Purview-DevOps-Policies-Video)
* Video: [DevOps policies deep dive](https://youtu.be/UvClpdIb-6g)
* Doc: [Microsoft Purview DevOps policies on Azure Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Doc: [Microsoft Purview DevOps policies on Azure SQL DB](./how-to-policies-devops-azure-sql-db.md)
* Doc: [Microsoft Purview DevOps policies on resource groups and subscriptions](./how-to-policies-devops-resource-group.md)
* Blog: [New granular permissions for SQL Server 2022 and Azure SQL to help PoLP](https://techcommunity.microsoft.com/t5/sql-server-blog/new-granular-permissions-for-sql-server-2022-and-azure-sql-to/ba-p/3607507)
