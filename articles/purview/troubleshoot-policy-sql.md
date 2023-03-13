---
title: Troubleshoot Microsoft Purview policies for SQL data sources
description: Check how to see if SQL data sources are receiving policies from Microsoft Purview.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 03/10/2023
---

# Tutorial: Troubleshoot Microsoft Purview policies for SQL data sources

In this tutorial, you learn how issue SQL commands to inspect the Microsoft Purview policies that have been communicated to the SQL instance, where they will be enforced. You will also learn how to force a download of the policies to the SQL instance. These commands are only used for troubleshooting and are not required during the normal operation of Microsoft Purview policies. These commands require a higher level of privileges in the SQL instance.

For more information about Microsoft Purview policies, see the concept guides listed in the [Next steps](#next-steps) section.

## Prerequisites

* An Azure subscription. If you don't already have one, [create a free subscription](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A Microsoft Purview account. If you don't have one, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).
* Register a data source, enable *Data use management*, and create a policy. To do so, use one of the Microsoft Purview policy guides. To follow along with the examples in this tutorial, you can [create a DevOps policy for Azure SQL Database](how-to-policies-devops-azure-sql-db.md).

## Test the policy
Once you create a policy, the Azure AD principals referenced in the Subject of the policy should be able to connect to any database in the server to which the policies are published.

### Force policy download
It is possible to force an immediate download of the latest published policies to the current SQL database by running the following command. The minimal permission required to run it is membership in ##MS_ServerStateManager##-server role.

```sql
-- Force immediate download of latest published policies
exec sp_external_policy_refresh reload
```  

### Analyze downloaded policy state from SQL
The following DMVs can be used to analyze which policies have been downloaded and are currently assigned to Azure AD principals. The minimal permission required to run them is VIEW DATABASE SECURITY STATE - or assigned Action Group *SQL Security Auditor*.

```sql

-- Lists generally supported actions
SELECT * FROM sys.dm_server_external_policy_actions

-- Lists the roles that are part of a policy published to this server
SELECT * FROM sys.dm_server_external_policy_roles

-- Lists the links between the roles and actions, could be used to join the two
SELECT * FROM sys.dm_server_external_policy_role_actions

-- Lists all Azure AD principals that were given connect permissions  
SELECT * FROM sys.dm_server_external_policy_principals

-- Lists Azure AD principals assigned to a given role on a given resource scope
SELECT * FROM sys.dm_server_external_policy_role_members

-- Lists Azure AD principals, joined with roles, joined with their data actions
SELECT * FROM sys.dm_server_external_policy_principal_assigned_actions
```

## Next steps

Concept guides for Microsoft Purview access policies:
- [DevOps policies](concept-policies-devops.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
- [Data owner policies](concept-policies-data-owner.md)
