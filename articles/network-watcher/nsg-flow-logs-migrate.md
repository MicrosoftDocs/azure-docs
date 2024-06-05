---
title: Migrate to virtual network flow logs
titleSuffix: Azure Network Watcher
description: Learn how to migrate your Azure Network Watcher network security group flow logs to virtual network flow logs using the Azure portal and a PowerShell script.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/10/2024
ms.custom: devx-track-azurepowershell

#CustomerIntent: As an Azure administrator, I want to migrate my network security group flow logs to the new virtual network flow logs so that I can use all the benefits of virtual network flow logs, which overcome some of the network security group flow logs limitations.
---

# Migrate from network security group flow logs to virtual network flow logs

In this article, you learn how to migrate your existing network security group flow logs to virtual network flow logs using a migration script. Virtual network flow logs overcome some of the limitations of network security group flow logs. For more information, see [Virtual network flow logs](vnet-flow-logs-overview.md).

> [!NOTE]
> Use the migration script:
> - when you don't have flow logging enabled on all network interfaces or subnets in a virtual network and you don't want to enable virtual network flow logging on all of them, or
> - when your network security group flow logs in a virtual network have different configurations, and you want to create virtual network flow logs with those different configurations as the network security group flow logs.
> 
> Use Azure Policy:
> - when you have the same network security group applied to all network interfaces or subnets in a virtual network,
> - when you have the same network security group flow log configurations for all network interfaces or subnets in a virtual network, or
> - when you want to enable virtual network flow logging on the virtual network level.
> 
> For more information, see [Deploy and configure virtual network flow logs using a built-in policy](vnet-flow-logs-policy.md#deploy-and-configure-virtual-network-flow-logs-using-a-built-in-policy).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- PowerShell installed on your machine. For more information, see [Install PowerShell on Windows, Linux, and macOS](/powershell/scripting/install/installing-powershell). This article requires the Az PowerShell module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell). To find the installed version, run `Get-Module -ListAvailable Az`. 

- Necessary RBAC permissions for the subscriptions of the flow logs and Log Analytics workspaces (if traffic analytics is enabled for any of the network security group flow logs). For more information, see [Network Watcher permissions](required-rbac-permissions.md).

- Network security group flow logs in a region or more. For more information, see [Create network security group flow logs](nsg-flow-logs-portal.md#create-a-flow-log).

## Generate migration script

In this section, you learn how to generate and download the migration files for the network security group flow logs that you want to migrate. 

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

    :::image type="content" source="./media/nsg-flow-logs-migrate/portal-search.png" alt-text="Screenshot that shows how to search for Network Watcher in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/portal-search.png":::

1. Under **Logs**, select **Migrate flow logs**.

    :::image type="content" source="./media/nsg-flow-logs-migrate/migrate-flow-logs.png" alt-text="Screenshot that shows the network security group flow logs migration page in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/migrate-flow-logs.png":::

1. Select the subscriptions that contain the network security group flow logs that you want to migrate.

1. For each subscription, select the regions that contain the flow logs that you want to migrate. **Total NSG flow logs** shows the total number of flow logs that are in the selected subscriptions. **Selected NSG flow logs** shows the number of flow logs in the selected regions.

1. After you chose the subscriptions and regions, select **Download script and JSON file** to download the migration files as a zip file.

    :::image type="content" source="./media/nsg-flow-logs-migrate/download-migration-files.png" alt-text="Screenshot that shows how to generate a migration script in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/download-migration-files.png":::

1. Extract `MigrateFlowLogs.zip` file on your local machine. The zip file contains these two files:
    - a script file: `MigrationFromNsgToAzureFlowLogging.ps1`
    - a JSON file: `RegionSubscriptionConfig.json`.

## Run migration script

In this section, you learn how to use the script file that you downloaded in the previous section to migrate your network security group flow logs.

> [!IMPORTANT]
> Once you start running the script, you shouldn't make any changes to the topology in the regions and subscriptions of the flow logs that you're migrating. 

1. Run the script file `MigrationFromNsgToAzureFlowLogging.ps1`.

1. Enter **1** for **Run analysis** option.

    ```
    .\MigrationFromNsgToAzureFlowLogging.ps1
    
    Select one of the following options for flowlog migration:
    1. Run analysis
    2. Delete NSG flowlogs
    3. Quit
    ```

1. Enter the JSON file name.

    ```
    Please enter the path to scope selecting config file: .\RegionSubscriptionConfig.json
    ```

1. Enter the number of threads or leave blank to use the default value of 16.

    ```
    Please enter the number of threads you would like to use, press enter for using default value of 16:    
    ```

    After the analysis is complete, you'll see the analysis report on screen and in an html file in the same directory of the migration files. The report lists the number of network security group flow logs that will be disabled and the number of virtual network flow logs that are created to replace them. The number of virtual network flow logs that are created depends on the type of migration that you choose. For example, if the network security group that you're migrating its flow log is associated with three network interfaces in the same virtual network, then you can choose *migration with aggregation* to have a single virtual network flow log resource applied to the virtual network. You can also choose *migration without aggregation* to have three virtual network flow logs (one virtual network flow log resource per network interface).

    > [!NOTE]
    > See `AnalysisReport-<subscriptionId>-<region>-<time>.html` file for a full report of the analysis that you performed. The file is available in the same directory of the script.

1. Enter **2** or **3** to choose the type of migration that you want to perform.

    ```
    Select one of the following options for flowlog migration:
    1. Re-Run analysis
    2. Proceed with migration with aggregation
    3. Proceed with migration without aggregation
    4. Quit
    ```

1. After you see the summary of migration on screen, you can cancel the migration and revert changes. To accept and proceed with the migration enter **n**, otherwise enter **y**. Once you accept the changes, you can't revert them.

    ```
    Do you want to rollback? You won't get the option to revert the actions done now again (y/n): n
    ```

    > [!NOTE]
    > Keep the script and analysis report files for reference in case you have any issues with the migration.
    
1. Check the Azure portal to confirm that the status of network security group flow logs that you migrated became disabled. Check also the newly created virtual network flow logs as a result of the migration process.
 
    :::image type="content" source="./media/nsg-flow-logs-migrate/list-flow-logs.png" alt-text="Screenshot that shows the newly created virtual network flow log as a result of migrating from network security group flow log." lightbox="./media/nsg-flow-logs-migrate/list-flow-logs.png":::

1. Add a filter to only list network security group flow logs from the subscriptions and regions that you choose. You can skip this step if you migrated only a few network security group flow logs. 

    :::image type="content" source="./media/nsg-flow-logs-migrate/filter-flow-logs.png" alt-text="Screenshot that shows how to use a filter to only list network security group flow logs." lightbox="./media/nsg-flow-logs-migrate/filter-flow-logs.png":::

1. Select the flow logs that you want to delete, and then select **Delete**

    :::image type="content" source="./media/nsg-flow-logs-migrate/select-flow-logs.png" alt-text="Screenshot that shows how to select and delete the migrated network security group flow logs." lightbox="./media/nsg-flow-logs-migrate/select-flow-logs.png":::

1. Enter *delete* and then select **Delete** to confirm the deletion.

    :::image type="content" source="./media/nsg-flow-logs-migrate/delete-flow-logs-confirmation.png" alt-text="Screenshot that shows how to confirm the deletion of migrated flow logs." lightbox="./media/nsg-flow-logs-migrate/delete-flow-logs-confirmation.png":::

## Considerations

- **Scale set with a load balancer**: The migration script enables virtual network flow logging on the subnet that has the scale set virtual machines.

    > [!NOTE]
    > If network security group flow logging is not enabled on all network interfaces of the scale set, or the network interfaces don't share the same network security group flow log, then a virtual network flow log is created on the subnet with the same configurations as one of the network interfaces of the scale set.

- **PaaS**: The migration script doesn't support environments with PaaS solutions that have network security group flow logs in a user's subscription but target resources are in different subscriptions. For such environments, you should manually enable virtual network flow logging on the virtual network or subnet of the PaaS solution.

## Related content

- [Network security group flow logs](nsg-flow-logs-overview.md)
- [Virtual network flow logs](vnet-flow-logs-overview.md)
- [Manage virtual network flow logs using Azure Policy](vnet-flow-logs-policy.md)
