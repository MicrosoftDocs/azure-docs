---
title: Microsoft Purview DevOps policies concepts
description: Understand Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 10/07/2022
---

# Concepts for Microsoft Purview DevOps policies

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article discusses concepts related to managing access to data sources in your data estate from within the Microsoft Purview governance portal. In particular, it focuses on DevOps policies.

> [!Note]
> This capability is different from access control for Microsoft Purview itself, which is described in [Access control in Microsoft Purview](./catalog-permissions.md).

## Overview
Access to system metadata is crucial for database administrators and other DevOps users to perform their job. That access can be granted and revoked efficiently and at-scale through Microsoft Purview DevOps policies.

### Microsoft Purview access policies vs. DevOps policies
Microsoft Purview access policies enable customers to manage access to different data systems across their entire data estate, all from a central location in the cloud. These policies are access grants that can be created through Microsoft Purview Studio, avoiding the need for code. They dictate whether a set of Azure AD principals (users, groups, etc.) should be allowed or denied a specific type of access to a data source or asset within it. These policies get communicated to the data sources where they get natively enforced.

DevOps policies are a special type of Microsoft Purview access policies. They grant access to database system metadata instead of user data. They simplify access provisioning for IT operations and security auditing functions. DevOps policies only grant access, that is, they don't deny access.

## Elements of a DevOps policy
A DevOps policy is defined by three elements: The *data resource path*, the *role* and the *subject*. In essence, the DevOps policy assigns the *subject* to the *role* for the scope of the *data resource path*.
    
#### The subject
Is a set of Azure AD users, groups or service principals.

#### The role
The role maps to a set of actions that the policy permits on the data resource. DevOps policies support a couple of roles: *SQL Performance Monitor* and *SQL Security Auditor*. The DevOps policy how-to docs detail the role definition for each data source, that is, the mapping between the role in Microsoft Purview and the actions that get permitted in the data source. For example, the role definition for SQL Performance Monitor and SQL Security Auditor includes Connect actions at server and database level on the data source side.

#### The data resource
Microsoft Purview DevOps policies currently support SQL-type data sources and can be configured on individual data sources, resource groups and subscriptions. DevOps policies can only be created if the data source is first registered in Microsoft Purview with the option *Data use management enabled*. The data resource path is the composition of subscription > resource group > data source.

#### Hierarchical enforcement of policies
A DevOps policy on a data resource is enforced on the data resource itself and all children contained by it. For example, a DevOps policy on an Azure subscription applies to all resource groups, to all policy-enabled data sources within each resource group, and to all databases contained within each data source.

## A sample scenario to demonstrate the concept and the benefits
Bob and Alice are DevOps users at their company. Given their role, they need to log in to dozens of Azure SQL logical servers to monitor their performance so that critical DevOps processes don’t break. Their manager, Mateo, creates an Azure AD group and includes Alice and Bob. He then uses Microsoft Purview DevOps policies (Policy 1 in the diagram below) to grant this Azure AD group access at resource group level, to Resource Group 1, which hosts the Azure SQL servers.

![Diagram shows an example of DevOps policy on resource group.](./media/concept-policies-devops/devops-policy-on-resource-group.png).

#### These are the benefits:
- Mateo doesn't have to create local logins in each logical server
- The policies from Microsoft Purview improve security by helping limit local privileged access. This is what we call PoLP (Principle of Least Privilege). In the scenario, Mateo only grants the minimum access necessary that Bob and Alice need to perform the task of monitoring performance.
- When new Azure SQL servers are added to the Resource Group, Mateo doesn't need to update the policies in Microsoft Purview for them to be effective on the new logical servers.
- If Alice or Bob leave their job and get backfilled, Mateo just updates the Azure AD group, without having to make any changes to the servers or to the policies he created in Microsoft Purview.
- At any point in time, Mateo or the company’s auditor can see what access has been granted directly in Microsoft Purview Studio.

## More info
- DevOps policies can be created, updated and deleted by any user holding *Policy Author* role at root collection level in Microsoft Purview.
- Once saved, DevOps policies get automatically published.

## Next steps
To get started with DevOps policies, consult the following guides:
* Document: [Microsoft Purview DevOps policies on Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Document: [Microsoft Purview DevOps policies on Azure SQL DB](./how-to-policies-devops-azure-sql-db.md)
* Blog: [New granular permissions for SQL Server 2022 and Azure SQL to help PoLP](https://techcommunity.microsoft.com/t5/sql-server-blog/new-granular-permissions-for-sql-server-2022-and-azure-sql-to/ba-p/3607507)
