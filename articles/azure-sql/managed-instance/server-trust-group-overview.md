---
title: Server Trust Group
titleSuffix: Azure SQL Managed Instance 
description: Learn about Server Trust Group and how to manage trust between Azure SQL Managed Instances.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: sasapopo
ms.author: sasapopo
ms.reviewer: sstein, bonova
ms.date: 10/08/2020
---
# Use Server Trust Groups to set up and manage trust between SQL Managed Instances
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Server Trust Group is a concept used for managing trust between Azure SQL Managed Instances. By creating a group, a certificate-based trust is established between its members. This trust can be used for different cross-instance scenarios. Removing servers from the group or deleting the group removes the trust between the servers. To create or delete Server Trust Group user needs to have write permissions on Managed Instance.
[Server Trust Group](https://aka.ms/mi-server-trust-group-arm) is an Azure Resource Manager object which has been labeled as **SQL trust group** in Azure portal.

> [!NOTE]
> Server Trust Group is introduced in public preview of Distributed transactions between Azure SQL Managed Instances and currently has some limitations that will be described later in this article.

## Server Trust Group setup

The following section describes setup of Server Trust Group.

1. Go to the [Azure portal](https://portal.azure.com/).

2. Navigate to Azure SQL Managed Instance that you plan to add to a newly created Server trust group.

3. On the **Security** settings, select the **SQL trust groups** tab.

   :::image type="content" source="./media/server-trust-group-overview/security-sql-trust-groups.png" alt-text="Server trust groups":::

4. In the Server Trust Group configuration page, select the **New Group** icon.

   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-create-new-group.png" alt-text="New Group":::

5. On the **SQL trust group** create blade set the **Group name**. It needs to be unique in all regions where the group members reside. **Trust scope** defines type of cross-instance scenario that is enabled with the Server trust group. In preview the only applicable trust scope is **Distributed transactions**, so it's preselected and cannot be changed. All **Group members** must belong to the same **subscription** but can be under different resource groups. Select the **Resource group** and **SQL Server / instance** to choose the Azure SQL Managed Instance that will be member of the group.

   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-create-blade.png" alt-text="Server trust group create blade":::

6. After all required fields are populated, click **Save**.

## Server Trust Group maintenance and deletion

Server Trust Group can't be edited. To remove a Managed Instance from a group, you need to delete the group and create a new one.

Following section describes Server trust group deletion process. 
1. Go to the Azure portal.
2. Navigate to a Managed Instance that belongs to the trust group.
3. On the **Security** settings select the **SQL trust groups** tab.
4. Select the trust group you want to delete.
   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-manage-select.png" alt-text="Select Server trust group":::
5. Click **Delete Group**.
   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-manage-delete.png" alt-text="Delete Server trust group":::
6. Type in the Server Trust Group name to confirm deletion and click **Delete**.
   :::image type="content" source="./media/server-trust-group-overview/server-trust-group-manage-delete-confirm.png" alt-text="Confirm Server trust group deletion":::

> [!NOTE]
> Deleting the Server Trust Group might not immediately remove the trust between the two Managed Instances. Trust removal can be enforced by invoking a [failover](https://docs.microsoft.com/powershell/module/az.sql/Invoke-AzSqlInstanceFailover) of Managed Instances. Check the [Known issues](https://docs.microsoft.com/azure/azure-sql/database/doc-changes-updates-release-notes?tabs=managed-instance#known-issues) for the latest updates on this.

## Limitations

During public  preview the following limitations apply to Server Trust Groups.
 * Name of the Server Trust Group must be unique in all regions where its members are.
 * Group can contain only Azure SQL Managed Instances and they must be under the same Azure Subscription.
 * In preview, group can have exactly two Managed Instances. To execute distributed transactions across more than two Managed Instances you will need to create Server Trust Group for each pair of the Managed Instances.
 * Distributed transactions are the only applicable scope for the Server Trust Groups.
 * Server Trust Group can only be managed from Azure portal. PowerShell and CLI support will come later.
 * Server Trust Group cannot be edited on the Azure portal. It can only be created or dropped.
 * Additional limitations of distributed transactions may be related to your scenario. Most notable one is that there must be connectivity between Managed Instances over private endpoints, via VNET or VNET peering. Make sure that you're aware of the current [distributed transactions limitations for Managed Instance](https://docs.microsoft.com/azure/azure-sql/database/elastic-transactions-overview#limitations).

## Next steps

* For more information about distributed transactions in Azure SQL Managed Instance, see [Distributed transactions](../database/elastic-transactions-overview.md).
* For release updates and known issues state, see [Managed Instance release notes](../database/doc-changes-updates-release-notes.md).
* If you have feature requests, add them to the [Managed Instance forum](https://feedback.azure.com/forums/915676-sql-managed-instance).