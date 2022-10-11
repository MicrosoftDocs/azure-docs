---
title: Provision access to Arc-enabled SQL Server for DevOps actions (preview)
description: Step-by-step guide on provisioning access to Arc-enabled SQL Server through Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 10/11/2022
ms.custom: references_regions
---
# Provision access to Arc-enabled SQL Server for DevOps actions (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This how-to guide shows how to provision access via Microsoft Purview to Arc-enabled SQL Server system metadata (DMVs and DMFs) via *SQL Performance Monitoring* or *SQL Security Auditing* actions. Microsoft Purview access policies apply to Azure AD Accounts only.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]
- Get SQL server version 2022 RC 1 or later running on Windows and install it. [Follow this link](https://www.microsoft.com/sql-server/sql-server-2022).
- Complete process to onboard that SQL server with Azure Arc [Follow this link](https://learn.microsoft.com/sql/sql-server/azure-arc/connect).
- Enable Azure AD Authentication in that SQL server. [Follow this guide to learn how](https://learn.microsoft.com/sql/relational-databases/security/authentication-access/azure-ad-authentication-sql-server-setup-tutorial). For a simpler setup [follow this link](https://learn.microsoft.com/sql/relational-databases/security/authentication-access/azure-ad-authentication-sql-server-automation-setup-tutorial#setting-up-azure-ad-admin-using-the-azure-portal).

**Enforcement of policies for this data source is currently available in the following regions for Microsoft Purview**
- East US
- East US2
- South Central US
- West US3
- Canada Central
- Brazil South
- North Europe
- West Europe
- France Central
- UK South
- Japan East
- Australia East

## Security considerations for SQL Server
- The Server admin can turn off the Microsoft Purview policy enforcement.
- Arc Admin/Server admin permissions empower the Arc admin or Server admin with the ability to change the ARM path of the given server. Given that mappings in Microsoft Purview use ARM paths, this can lead to wrong policy enforcements. 
- SQL Admin (DBA) can gain the power of Server admin and can tamper with the cached policies from Microsoft Purview.
- The recommended configuration is to create a separate App Registration per SQL server instance. This prevents SQL server2 from reading the policies meant for SQL server1, in case a rogue admin in SQL server2 tampers with the ARM path.

## Configuration

### Configuration for Arc-enabled SQL server
This section describes the steps to configure the SQL Server on Azure Arc to use Microsoft Purview.

1. Sign in to Azure portal this this [link](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/sqlServers) which lists SQL Servers on Azure Arc.

1. Select the SQL Server you want to configure

1. Navigate to **Azure Active Directory** feature on the left pane

1. Verify that Azure Active Directory Authentication is configured. This means that all these have been entered: an admin login, a SQL Server service certificate, and a SQL Server app registration.
![Screenshot shows how to configure Microsoft Purview endpoint in Azure AD section.](./media/how-to-policies-data-owner-sql/setup-sql-on-arc-for-purview.png)

1. Scroll down to set **External Policy Based Authorization** to enabled

1. Enter **Microsoft Purview Endpoint** in the format *https://\<purview-account-name\>.purview.azure.com*. You can see the names of Microsoft Purview accounts in your tenant through [this link](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Purview%2FAccounts). Optionally, you can confirm the endpoint by navigating to the Microsoft Purview account, then  to the Properties section on the left menu and scrolling down until you see "Scan endpoint". The full endpoint path will be the one listed without the "/Scan" at the end.

1. Make a note of the **App registration ID**, as you will need it when you register and enable this data source for *Data use Management* in Microsoft Purview.
   
1. Select the **Save** button to save the configuration.

### Register data sources in Microsoft Purview
The Arc-enabled SQL Server data source needs to be registered first with Microsoft Purview, before policies can be created.

1. Sign in to Microsoft Purview Studio.

1. Navigate to the **Data map** feature on the left pane, select **Sources**, then select **Register**. Type "Azure Arc" in the search box and select **SQL Server on Azure Arc**. Then select **Continue**
![Screenshot shows how to select a source for registration.](./media/how-to-policies-data-owner-sql/select-arc-sql-server-for-registration.png)

1. Enter a **Name** for this registration. It is best practice to make the name of the registration the same as the server name in the next step.

1. select an **Azure subscription**, **Server name** and **Server endpoint**.

1. **Select a collection** to put this registration in. 

1. Enable Data Use Management. Data Use Management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md)

1. Upon enabling Data Use Management, Microsoft Purview will automatically capture the **Application ID** of the App Registration related to this Arc-enabled SQL server. Come back to this screen and hit the refresh button on the side of it to refresh, in case the association between the Arc-enabled SQL server and the App Registration changes in the future.

1. Select **Register** or **Apply** at the bottom

Once your data source has the **Data Use Management** toggle *Enabled*, it will look like this picture. 
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-arc-sql.png)

> [!Important]
> You can assign the data source side permission (i.e., *IAM Owner*) **only** by entering Azure portal through this [special link](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_HybridData_Platform=sqlrbacmain#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/sqlServers). Alternatively, you can configure this permission at the parent resource group level so that it gets inherited by the "SQL Server - Azure Arc" data source.

> [!Note]
> If you want to create a policy on a resource group or subscription and have it enforced in Arc-enabled SQL servers, you will need to also register those servers independently for *Data use management* to provide their App ID.

## Create a new DevOps policy
Follow this link for the steps to [create a new DevOps policy in Microsoft Purview](how-to-policies-devops-authoring-generic.md#create-a-new-devops-policy).

## List DevOps policies
Follow this link for the steps to [list DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#list-devops-policies).

## Update a DevOps policy
Follow this link for the steps to [update a DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#update-a-devops-policy).

## Delete a DevOps policy
Follow this link for the steps to [delete a DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#delete-a-devops-policy).

>[!Important]
> DevOps policies are auto-published and changes can take up to **5 minutes** to be enforced by the data source.

### Test the policy

The Azure AD Accounts referenced in the access policies should now be able to connect to any database in the server to which the policies are published.

#### Force policy download
It is possible to force an immediate download of the latest published policies to the current SQL database by running the following command. The minimal permission required to run it is membership in ##MS_ServerStateManager##-server role.

```sql
-- Force immediate download of latest published policies
exec sp_external_policy_refresh reload
```  

#### Analyze downloaded policy state from SQL
The following DMVs can be used to analyze which policies have been downloaded and are currently assigned to Azure AD accounts. The minimal permission required to run them is VIEW DATABASE SECURITY STATE - or assigned Action Group *SQL Security Auditor*.

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

## Additional information
N/A

### Policy action mapping

This section contains a reference of how actions in Microsoft Purview data policies map to specific actions in SQL Server on Azure Arc-enabled servers.

| **Microsoft Purview policy action** | **Data source specific actions**     |
|-------------------------------------|--------------------------------------|
|                                     |                                      |
| *SQL Performance Monitor* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabasePerformanceState/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/ServerPerformanceState/rows/select |
|||               
| *SQL Security Auditor* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select |
|||

## Next steps
Check the blog and related docs
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Video: [Pre-requisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Video: [Microsoft Purview DevOps policies on data sources and resource groups](https://youtu.be/YCDJagrgEAI)
* Video: [Reduce the effort with Microsoft Purview DevOps policies on resource groups](https://youtu.be/yMMXCeIFCZ8)
* Doc: [Microsoft Purview DevOps policies on Azure SQL DB](./how-to-policies-devops-azure-sql-db.md)
* Blog: [Deep dive on SQL Performance Monitor and SQL Security Auditor permissions](https://techcommunity.microsoft.com/t5/sql-server-blog/new-granular-permissions-for-sql-server-2022-and-azure-sql-to/ba-p/3607507)
