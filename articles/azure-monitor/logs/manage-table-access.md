---
title: Manage read access to tables in a Log Analytics workspace
description: This article explains how you to manage read access to specific tables in a Log Analytics workspace.
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.date: 07/22/2024
ms.custom: devx-track-azurepowershell

---

# Manage table-level read access in a Log Analytics workspace

Table-level access settings let you grant specific users or groups read-only permission to data in a table. Users with table-level read access can read data from the specified table in both the workspace and the resource context. 

This article describes two ways to manage table-level read access.

> [!NOTE]
> We recommend using the first method described here, which is currently in **preview**. During preview, the recommended method described here does not apply to Microsoft Sentinel Detection Rules, which might have access to more tables than intended. 
Alternatively, you can use the [legacy method of setting table-level read access](#legacy-method-of-setting-table-level-read-access), which has some limitations related to custom log tables. Before using either method, see [Table-level access considerations and limitations](#table-level-access-considerations-and-limitations).

## Set table-level read access (preview)

Granting table-level read access involves assigning a user two roles:

- At the workspace level - a custom role that provides limited permissions to read workspace details and run a query in the workspace, but not to read data from any tables.        
- At the table level - a **Reader** role, scoped to the specific table. 

**To grant a user or group limited permissions to the Log Analytics workspace:**

1. Create a [custom role](../../role-based-access-control/custom-roles.md) at the workspace level to let users read workspace details and run a query in the workspace, without providing read access to data in any tables:

    1. Navigate to your workspace and select **Access control (IAM)** > **Roles**.

    1. Right-click the **Reader** role and select **Clone**.

       :::image type="content" source="media/manage-access/access-control-clone-role.png" alt-text="Screenshot that shows the Roles tab of the Access control screen with the clone button highlighted for the Reader role." lightbox="media/manage-access/access-control-clone-role.png":::        

       This opens the **Create a custom role** screen.

    1. On the **Basics** tab of the screen: 
        1. Enter a **Custom role name** value and, optionally, provide a description.
        1. Set **Baseline permissions** to **Start from scratch**. 

        :::image type="content" source="media/manage-access/manage-access-create-custom-role.png" alt-text="Screenshot that shows the Basics tab of the Create a custom role screen with the Custom role name and Description fields highlighted." lightbox="media/manage-access/manage-access-create-custom-role.png":::

    1. Select the **JSON** tab > **Edit**:

        1. In the `"actions"` section, add these actions:

            ```json
            "Microsoft.OperationalInsights/workspaces/read",
            "Microsoft.OperationalInsights/workspaces/query/read" 
            ```

        1. In the `"not actions"` section, add: 
        
            ```json
            "Microsoft.OperationalInsights/workspaces/sharedKeys/read"
            ```

        :::image type="content" source="media/manage-access/manage-access-create-custom-role-json.png" alt-text="Screenshot that shows the JSON tab of the Create a custom role screen with the actions section of the JSON file highlighted." lightbox="media/manage-access/manage-access-create-custom-role-json.png":::    

    1. Select **Save** > **Review + Create** at the bottom of the screen, and then **Create** on the next page.   

1. Assign your custom role to the relevant user:
    1. Select **Access control (AIM)** > **Add** > **Add role assignment**.

       :::image type="content" source="media/manage-access/manage-access-add-role-assignment-button.png" alt-text="Screenshot that shows the Access control screen with the Add role assignment button highlighted." lightbox="media/manage-access/manage-access-add-role-assignment-button.png":::

    1. Select the custom role you created and select **Next**.

       :::image type="content" source="media/manage-access/manage-access-add-role-assignment-screen.png" alt-text="Screenshot that shows the Add role assignment screen with a custom role and the Next button highlighted." lightbox="media/manage-access/manage-access-add-role-assignment-screen.png":::


       This opens the **Members** tab of the **Add custom role assignment** screen.   

    1. Click **+ Select members** to open the **Select members** screen.

        :::image type="content" source="media/manage-access/manage-access-add-role-assignment-select-members.png" alt-text="Screenshot that shows the Select members screen." lightbox="media/manage-access/manage-access-add-role-assignment-select-members.png":::

    1. Search for and select a user and click **Select**.
    1. Select **Review and assign**.
 
The user can now read workspace details and run a query, but can't read data from any tables. 

**To grant the user read access to a specific table:**

1. From the **Log Analytics workspaces** menu, select **Tables**.  
1. Select the ellipsis ( **...** ) to the right of your table and select **Access control (IAM)**.
    
   :::image type="content" source="media/manage-access/table-level-access-control.png" alt-text="Screenshot that shows the Log Analytics workspace table management screen with the table-level access control button highlighted." lightbox="media/manage-access/manage-access-create-custom-role-json.png":::      

1. On the **Access control (IAM)** screen, select **Add** > **Add role assignment**. 
1. Select the **Reader** role and select **Next**.    
1. Click **+ Select members** to open the **Select members** screen.
1. Search for and select the user and click **Select**.
1. Select **Review and assign**.

The user can now read data from this specific table. Grant the user read access to other tables in the workspace, as needed. 
    
## Legacy method of setting table-level read access

The legacy method of table-level also uses [Azure custom roles](../../role-based-access-control/custom-roles.md) to let you grant specific users or groups access to specific tables in the workspace. Azure custom roles apply to workspaces with either workspace-context or resource-context [access control modes](manage-access.md#access-control-mode) regardless of the user's [access mode](manage-access.md#access-mode).

To define access to a particular table, create a [custom role](../../role-based-access-control/custom-roles.md):

* Set the user permissions in the **Actions** section of the role definition. 
* Use `Microsoft.OperationalInsights/workspaces/query/*` to grant access to all tables.
* To exclude access to specific tables when you use a wildcard in **Actions**, list the tables excluded tables in the **NotActions** section of the role definition.

Here are examples of custom role actions to grant and deny access to specific tables.

Grant access to the _Heartbeat_ and _AzureActivity_ tables:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/Heartbeat/read",
    "Microsoft.OperationalInsights/workspaces/query/AzureActivity/read"
  ],
```

Grant access to only the _SecurityBaseline_ table:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read"
],
```


Grant access to all tables except the _SecurityAlert_ table:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/*/read"
],
"notActions":  [
    "Microsoft.OperationalInsights/workspaces/query/SecurityAlert/read"
],
```

### Limitations of the legacy method related to custom tables

Custom tables store data you collect from data sources such as [text logs](../agents/data-sources-custom-logs.md) and the [HTTP Data Collector API](data-collector-api.md). To identify the table type, [view table information in Log Analytics](./log-analytics-tutorial.md#view-table-information).

Using the legacy method of table-level access, you can't grant access to individual custom log tables at the table level, but you can grant access to all custom log tables. To create a role with access to all custom log tables, create a custom role by using the following actions:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read"
],
```

## Table-level access considerations and limitations

- In the Log Analytics UI, users with table-level can see the list of all tables in the workspace, but can only retrieve data from tables to which they have access.
- The standard Reader or Contributor roles, which include the _\*/read_ action, override table-level access control and give users access to all log data.
- A user with table-level access but no workspace-level permissions can access log data from the API but not from the Azure portal. 
- Administrators and owners of the subscription have access to all data types regardless of any other permission settings.
- Workspace owners are treated like any other user for per-table access control.
- Assign roles to security groups instead of individual users to reduce the number of assignments. This practice will also help you use existing group management tools to configure and verify access.

## Next steps

* Learn more about [managing access to Log Analytics workspaces](manage-access.md).
