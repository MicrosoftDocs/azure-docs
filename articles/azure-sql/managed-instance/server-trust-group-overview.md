---
title: Server Trust Group
titleSuffix: Azure SQL Managed Instance 
description: Learn about Server Trust Group and how to manage trust between Azure SQL Managed Instances.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma
ms.date: 10/08/2020
---
# Use Server Trust Groups to set up and manage trust between SQL Managed Instances
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Server trust group (also refered as SQL trust group) is a concept used for managing trust between Azure SQL Managed Instances. By creating a group, a certificate-based trust is established between its members. This trust can be used for different cross-instance scenarios. Removing servers from the group or deleting the group removes the trust between the servers. To create or delete Server Trust Group user needs to have write permissions on Managed Instance.
[Server Trust Group](/azure/templates/microsoft.sql/allversions) is an Azure Resource Manager object which has been labeled as **SQL trust group** in Azure portal.


## Server Trust Group setup

Server Trust Group can be setup via [Azure PowerShell](/powershell/module/az.sql/new-azsqlservertrustgroup) or [Azure CLI](/cli/azure/sql/stg). 
The following section describes setup of Server Trust Group using Azure portal.

1. Go to the [Azure portal](https://portal.azure.com/).

2. Navigate to Azure SQL Managed Instance that you plan to add to a newly created Server trust group.

3. On the **Security** settings, select the **SQL trust groups** tab.

   :::image type="content" source="./media/server-trust-group-overview/security-sql-trust-groups.png" alt-text="Server trust groups":::

4. In the Server Trust Group configuration page, select the **New Group** icon.

   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-create-new-group.png" alt-text="New Group":::

5. On the **SQL trust group** create blade set the **Group name**. It needs to be unique in group's subscription, resource group and region. **Trust scope** defines type of cross-instance scenario that is enabled with the Server trust group. Trust scope is fixed, and all available functionalities are preselected and this cannot be changed. Select **subscription** and **Resource group** to choose Azure SQL Managed Instances that will be members of the group.

   :::image type="content" source="./media/server-trust-group-overview/_new-sql-trust-group.png" alt-text="SQL trust group create blade":::

6. After all required fields are populated, click **Save**.

## Server Trust Group maintenance and deletion

Following steps describe Server trust group edit process.
1. Go to Azure portal.
2. Navigate to a Managed Instance that belongs to the trust group.
3. On the **Security** settings select the **SQL trust groups** tab.
4. Select the trust group you want to edit.
5. Click **Configure group**.
   :::image type="content" source="./media/server-trust-group-overview/_configure-sql-trust-group.png" alt-text="Configure SQL trust group":::
6. Add or remove Managed Instances from the group.
7. Click **Save** to confirm choice or **Cancel** to abandone changes.

Following section describes Server trust group deletion process. 
1. Go to the Azure portal.
2. Navigate to a Managed Instance that belongs to the trust group.
3. On the **Security** settings select the **SQL trust groups** tab.
4. Select the trust group you want to delete.
   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-manage-select.png" alt-text="Select SQL trust group":::
5. Click **Delete group**.
   :::image type="content" source="./media/server-trust-group-overview/_delete-sql-trust-group.png" alt-text="Delete SQL trust group":::
6. Type in the SQL trust group name to confirm deletion and click **Delete**.
   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-manage-delete-confirm.png" alt-text="Confirm SQL trust group deletion":::

> [!NOTE]
> Deleting the SQL Trust Group might not immediately remove the trust between the two Managed Instances. Trust removal can be enforced by invoking a [failover](/powershell/module/az.sql/Invoke-AzSqlInstanceFailover) of Managed Instances. Check the [Known issues](../database/doc-changes-updates-release-notes.md?tabs=managed-instance#known-issues) for the latest updates on this.

## Limitations

Following limitations apply to Server Trust Groups.
 * Group can contain only Azure SQL Managed Instances.
 * Trust scope cannot be changed when group is created or modified.
 * Name of the Server Trust Group must be unique for its subscription, resource group and region.

## Next steps

* For more information about distributed transactions in Azure SQL Managed Instance, see [Distributed transactions](../database/elastic-transactions-overview.md).
* For release updates and known issues state, see [What's new?](doc-changes-updates-release-notes-whats-new.md).
* If you have feature requests, add them to the [Managed Instance forum](https://feedback.azure.com/forums/915676-sql-managed-instance).
