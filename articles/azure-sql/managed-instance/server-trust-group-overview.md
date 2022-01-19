---
title: Server trust group
titleSuffix: Azure SQL Managed Instance
description: Learn how to manage trust between instances by using a server trust group in Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.devlang: 
ms.topic: conceptual
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---
# Set up trust between instances with server trust group (Azure SQL Managed Instance)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Server trust group (also known as SQL trust group) is a concept used for managing trust between instances in Azure SQL Managed Instance. By creating a group, a certificate-based trust is established between its members. This trust can be used for different cross-instance scenarios. Removing servers from the group or deleting the group removes the trust between the servers. To create or delete a server trust group, the user needs to have write permissions on the managed instance.
[Server trust group](/azure/templates/microsoft.sql/allversions) is an Azure Resource Manager object which has been labeled as **SQL trust group** in Azure portal.


## Set up group

Server trust group can be setup via [Azure PowerShell](/powershell/module/az.sql/new-azsqlservertrustgroup) or [Azure CLI](/cli/azure/sql/stg). 

To create a server trust group by using the Azure portal, follow these steps: 

1. Go to the [Azure portal](https://portal.azure.com/).

2. Navigate to Azure SQL Managed Instance that you plan to add to a server trust group.

3. On the **Security** settings, select the **SQL trust groups** tab.

   :::image type="content" source="./media/server-trust-group-overview/sql-trust-groups.png" alt-text="SQL trust groups":::

4. On the **SQL trust groups** configuration page, select the **New Group** icon.

   :::image type="content" source="./media/server-trust-group-overview/new-sql-trust-group-button.png" alt-text="New Group":::

5. On the **SQL trust group** create blade set the **Group name**. It needs to be unique in the group's subscription, resource group and region. **Trust scope** defines the type of cross-instance scenario that is enabled with the server trust group. Trust scope is fixed - all available functionalities are preselected and this cannot be changed. Select **Subscription** and **Resource group** to choose the managed instances that will be members of the group.

   :::image type="content" source="./media/server-trust-group-overview/new-sql-trust-group.png" alt-text="SQL trust group create blade":::

6. After all required fields are populated, select **Save**.

## Edit group 

To edit a server trust group, follow these steps: 

1. Go to Azure portal.
1. Navigate to a managed instance that belongs to the trust group.
1. On the **Security** settings select the **SQL trust groups** tab.
1. Select the trust group you want to edit.
1. Click **Configure group**.

   :::image type="content" source="./media/server-trust-group-overview/configure-sql-trust-group.png" alt-text="Configure SQL trust group":::

1. Add or remove managed instances from the group.
1. Click **Save** to confirm choice or **Cancel** to abandon changes.

## Delete group

To delete a server trust group, follow these steps: 

1. Go to the Azure portal.
1. Navigate to a managed instance that belongs to the SQL trust group.
1. On the **Security** settings select the **SQL trust groups** tab.
1. Select the trust group you want to delete.

   :::image type="content" source="./media/server-trust-group-overview/select-delete-sql-trust-group.png" alt-text="Select SQL trust group":::

1. Select **Delete group**.

   :::image type="content" source="./media/server-trust-group-overview/delete-sql-trust-group.png" alt-text="Delete SQL trust group"::: 

1. Type in the SQL trust group name to confirm deletion and select **Delete**.

   :::image type="content" source="./media/server-trust-group-overview/confirm-delete-sql-trust-group-2.png" alt-text="Confirm SQL trust group deletion":::

> [!NOTE]
> Deleting the SQL trust group might not immediately remove the trust between the two managed instances. Trust removal can be enforced by invoking a [failover](/powershell/module/az.sql/Invoke-AzSqlInstanceFailover) of managed instances. Check the [Known issues](../managed-instance/doc-changes-updates-known-issues.md) for the latest updates on this.

## Limitations

Following limitations apply to Server Trust Groups: 

 * Group can contain only instances of Azure SQL Managed Instance.
 * Trust scope cannot be changed when a group is created or modified.
 * The name of the server trust group must be unique for its subscription, resource group and region.

## Next steps

* For more information about distributed transactions in Azure SQL Managed Instance, see [Distributed transactions](../database/elastic-transactions-overview.md).
* For release updates and known issues state, see [What's new?](doc-changes-updates-release-notes-whats-new.md).
* If you have feature requests, add them to the [Managed Instance forum](https://feedback.azure.com/d365community/forum/a99f7006-3425-ec11-b6e6-000d3a4f0f84).
