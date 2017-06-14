---
title: Manage database roles and users in Azure Analysis Services | Microsoft Docs
description: Learn how to manage database roles and users on an Analysis Services server in Azure.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 06/14/2016
ms.author: owend

---
# Manage database roles and users

At the model database level, all users must belong to a role. Roles define a group of users with particular permissions for the model database. Any user or group added to a role must have an account in an Azure AD tenant in the same subscription as the server. How you define roles is different depending on the tool you use, but the effect is the same.

Role permissions include:
*  **Administrator** - Users have full permissions for the database. This is different from server administrators.
*  **Process** - Users can connect to and perform process operations on the database, and analyze model database data.
*  **Read** -  Users can use a client application to connect to and analyze model database data.

When creating a tabular model project, you create roles and add users or groups to those roles by using Role Manager in SSDT. When deployed to a server, you use SSMS, [Analysis Services PowerShell cmdlets](https://msdn.microsoft.com/library/hh758425.aspx) or [Tabular Model Scripting Language](https://msdn.microsoft.com/library/mt614797.aspx) (TMSL) to add or remove roles and user members.

## To add or manage roles and users in SSDT  
  
1.  In SSDT > **Tabular Model Explorer**, right-click **Roles**.  
  
2.  In **Role Manager**, click **New**.  
  
3.  Type a name for the role.  
  
     By default, the name of the default role will be incrementally numbered for each new role. It is recommended you type a name that clearly identifies the member type, for example, Finance Managers or Human Resources Specialists.  
  
4.  In the **Permissions** field, select one of the following:  
  
    |Permission|Description|  
    |----------------|-----------------|  
    |**None**|Members cannot make any modifications to the model schema and cannot query data.|  
    |**Read**|Members are allowed to query data (based on row filters) but cannot make any changes to the model schema.|  
    |**Read and Process**|Members are allowed to query data (based on row-level filters) and run Process and Process All operations, but cannot make any changes to the model schema.|  
    |**Process**|Members can run Process and Process All operations. Cannot modify the model schema and cannot query data.|  
    |**Administrator**|Members can make modifications to the model schema and can query all data.|   
  
5.  If the role you are creating has Read or Read and Process permission, you can add row filters by using a DAX formula. Click the **Row Filters** tab, then select a table, then click the **DAX Filter** field, and then type a DAX formula. To learn more, see [Row filters](analysis-services-manage-users.md#bkmk_rowfliters). 
  
6.  Click **Members** > **Add External**.  
  
8.  In **Add External Member**, enter users or groups in your tenant Azure AD by email address. After you click OK and close Role Manager, roles and role members appear in Tabular Model Explorer. 
 
     ![Roles and users in Tabular Model Explorer](./media/analysis-services-database-users/aas-roles-tmexplorer.png)

9. Deploy to your Azure Analysis Services server.


## To add or manage roles and users in SSMS
In order to add roles and users to a deployed model database, you must be connected to the server as a Server administrator or already in a database role with administrator permissions.

1. In Object Exporer, right-click **Roles** > **New Role**.

2. In **Create Role**, enter a role name and description.

3. Select a permission.
   |Permission|Description|  
   |----------------|-----------------|  
   |**Full control (Administrator)**|Members can make modifications to the model schema, process, and can query all data.| 
   |**Process database**|Members can run Process and Process All operations. Cannot modify the model schema and cannot query data.|  
   |**Read**|Members are allowed to query data (based on row filters) but cannot make any changes to the model schema.|  
  
4. Click **Membership**, then enter a user or group in your tenant Azure AD by email address.

     ![Add user](./media/analysis-services-database-users/aas-roles-adduser-ssms.png)

5. If the role you are creating has Read permission, you can add row filters by using a DAX formula. Click **Row Filters**, select a table, and then type a DAX formula in the **DAX Filter** field. To learn more, see [Row filters](analysis-services-manage-users.md#bkmk_rowfliters). 

## To add roles and users by using a TMSL script
You can run a TMSL script in the XMLA window in SSMS or by using PowerShell. Use the [CreateOrReplace](https://docs.microsoft.com/sql/analysis-services/tabular-models-scripting-language-commands/createorreplace-command-tmsl) command and the [Roles](https://docs.microsoft.com/sql/analysis-services/tabular-models-scripting-language-objects/roles-object-tmsl) object.

**Sample TMSL script**

In this sample, a B2B external user and a group are added to the Analyst role with Read permissions for the SalesBI database. Both the external user and group must be in same tenant Azure AD.

```
{
  "createOrReplace": {
    "object": {
      "database": "SalesBI",
      "role": "Analyst"
    },
    "role": {
      "name": "Users",
      "description": "All allowed users to query the model",
      "modelPermission": "read",
      "members": [
        {
          "memberName": "user1@contoso.com",
          "identityProvider": "AzureAD"
        },
        {
          "memberName": "group1@adventureworks.com",
          "identityProvider": "AzureAD"
        }
      ]
    }
  }
}
```

## To add roles and users by using PowerShell
The [SQLASCMDLETS](https://msdn.microsoft.com/library/hh758425.aspx) module provides task-specific database management cmdlets as well as the general purpose Invoke-ASCmd cmdlet that accepts a Tabular Model Scripting Language (TMSL) query or script. The following cmdlets in the SQLASCMDLETS module are used for managing database roles and users.
  
|Cmdlet|Description|
|------------|-----------------| 
|[Add-RoleMember](https://msdn.microsoft.com/library/hh510167.aspx)|Add a member to a database role.| 
|[Remove-RoleMember](https://msdn.microsoft.com/library/hh510173.aspx)|Remove a member from a database role.|   
|[Invoke-ASCmd](https://msdn.microsoft.com/library/hh479579.aspx)|Execute a TMSL script.|


## Next steps
  [Manage server administrators](analysis-servies-server-admins.md)   
  [Manage Azure Analysis Services with PowerShell](analysis-services-powershell.md)  
  [Tabular Model Scripting Language (TMSL) Reference](https://docs.microsoft.com/sql/analysis-services/tabular-model-scripting-language-tmsl-reference)

