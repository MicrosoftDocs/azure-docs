---
title: Learn how to manage database accounts in Azure Cosmos DB
description: Learn how to manage Azure Cosmos DB resources by using the Azure portal, PowerShell, CLI, and Azure Resource Manager templates
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/13/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Manage an Azure Cosmos DB account using the Azure portal

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article describes how to manage various tasks on an Azure Cosmos DB account using the Azure portal.

> [!TIP]
> Azure Cosmos DB can also be managed with other Azure management clients including [Azure PowerShell](manage-with-powershell.md), [Azure CLI](sql/manage-with-cli.md), [Azure Resource Manager templates](./manage-with-templates.md), and [Bicep](sql/manage-with-bicep.md).

## Create an account

[!INCLUDE [cosmos-db-create-dbaccount](includes/cosmos-db-create-dbaccount.md)]

## Add/remove regions from your database account

> [!TIP]
> When a new region is added, all data must be fully replicated and committed into the new region before the region is marked as available. The amount of time this operation takes will depend upon how much data is stored within the account. If an [asynchronous throughput scaling operation](scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused and will resume automatically when the add/remove region operation is complete.

1. Sign in to [Azure portal](https://portal.azure.com).

1. Go to your Azure Cosmos DB account, and select **Replicate data globally** in the resource menu.

1. To add regions, select the hexagons on the map with the **+** label that corresponds to your desired region(s). Alternatively, to add a region, select the **+ Add region** option and choose a region from the drop-down menu.

1. To remove regions, clear one or more regions from the map by selecting the blue hexagons with check marks. Or select the "wastebasket" (🗑) icon next to the region on the right side.

1. To save your changes, select **OK**.

   :::image type="content" source="./media/how-to-manage-database-account/add-region.png" alt-text="Add or remove regions menu":::

In a single-region write mode, you can't remove the write region. You must fail over to a different region before you can delete the current write region.

In a multi-region write mode, you can add or remove any region, if you have at least one region.

## <a id="configure-multiple-write-regions"></a>Configure multiple write-regions

Open the **Replicate Data Globally** tab and select **Enable** to enable multi-region writes. After you enable multi-region writes, all the read regions that you currently have on the account will become read and write regions.

:::image type="content" source="./media/how-to-manage-database-account/single-to-multi-master.png" alt-text="Azure Cosmos DB account configures multi-region writes screenshot":::

## <a id="automatic-failover"></a>Enable service-managed failover for your Azure Cosmos DB account

The Service-Managed failover option allows Azure Cosmos DB to fail over to the region with the highest failover priority with no user action should a region become unavailable. When service-managed failover is enabled, region priority can be modified. Account must have two or more regions to enable service-managed failover.

1. From your Azure Cosmos DB account, open the **Replicate data globally** pane.

2. At the top of the pane, select **Automatic Failover**.

   :::image type="content" source="./media/how-to-manage-database-account/replicate-data-globally.png" alt-text="Replicate data globally menu":::

3. On the **Automatic Failover** pane, make sure that **Enable Automatic Failover** is set to **ON**.

4. Select **Save**.

   :::image type="content" source="./media/how-to-manage-database-account/automatic-failover.png" alt-text="Automatic failover portal menu":::

## Set failover priorities for your Azure Cosmos DB account

After an Azure Cosmos DB account is configured for automatic failover, the failover priority for regions can be changed.

> [!IMPORTANT]
> You cannot modify the write region (failover priority of zero) when the account is configured for service-managed failover. To change the write region, you must disable service-managed failover and do a manual failover.

1. From your Azure Cosmos DB account, open the **Replicate data globally** pane.

2. At the top of the pane, select **Automatic Failover**.

   :::image type="content" source="./media/how-to-manage-database-account/replicate-data-globally.png" alt-text="Replicate data globally menu":::

3. On the **Automatic Failover** pane, make sure that **Enable Automatic Failover** is set to **ON**.

4. To modify the failover priority, drag the read regions via the three dots on the left side of the row that appear when you hover over them.

5. Select **Save**.

   :::image type="content" source="./media/how-to-manage-database-account/automatic-failover.png" alt-text="Automatic failover portal menu":::

## <a id="manual-failover"></a>Perform manual failover on an Azure Cosmos DB account

> [!IMPORTANT]
> The Azure Cosmos DB account must be configured for manual failover for this operation to succeed.

> [!NOTE]
> If you perform a manual failover operation while an [asynchronous throughput scaling operation](scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused. It will resume automatically when the failover operation is complete.

1. Go to your Azure Cosmos DB account, and open the **Replicate data globally** menu.

2. At the top of the menu, select **Manual Failover**.

   :::image type="content" source="./media/how-to-manage-database-account/replicate-data-globally.png" alt-text="Replicate data globally menu":::

3. On the **Manual Failover** menu, select your new write region. Select the check box to indicate that you understand this option changes your write region.

4. To trigger the failover, select **OK**.

   :::image type="content" source="./media/how-to-manage-database-account/manual-failover.png" alt-text="Manual failover portal menu":::

## Next steps

For more information and examples on how to manage the Azure Cosmos DB account as well as database and containers, read the following articles:

* [Manage Azure Cosmos DB using Azure PowerShell](manage-with-powershell.md)
* [Manage Azure Cosmos DB using Azure CLI](sql/manage-with-cli.md)
* [Manage Azure Cosmos DB using Azure Resource Management templates](./manage-with-templates.md)
* [Manage Azure Cosmos DB using Bicep](sql/manage-with-bicep.md)
