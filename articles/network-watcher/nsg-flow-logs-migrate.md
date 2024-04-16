---
title: Migrate to VNet flow logs
titleSuffix: Azure Network Watcher
description: Learn how to migrate your Azure Network Watcher NSG flow logs to VNet flow logs using the Azure portal and PowerShell.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/16/2024

#CustomerIntent: As an Azure administrator, I want to learn how to migrate my NSG flow logs to the new VNet flow logs so that I can use VNet flow logs to log my virtual network IP traffic.
---

# Migrate from NSG flow logs to VNet flow logs

In this article, you learn how to migrate your existing NSG flow logs to VNet flow logs. VNet flow logs overcome some of the limitations of NSG flow logs. For more information, see [VNet flow logs](vnet-flow-logs-overview.md).

> [!IMPORTANT]
> The VNet flow logs feature is currently in preview. This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- PowerShell 7. For more information, see [Install PowerShell on Windows, Linux, and macOS](/powershell/scripting/install/installing-powershell). This article requires the Az PowerShell module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell). To find the installed version, run `Get-Module -ListAvailable Az`. 

- Necessary RBAC permissions for subscriptions of the flow logs and Log Analytics workspaces if traffic analytics is enabled for any of the NSG flow logs. For more information, see [Network Watcher RBAC permissions](required-rbac-permissions.md).

- NSG flow logs in a region or more. For more information, see [Create NSG flow logs](nsg-flow-logs-portal.md#create-a-flow-log).

## Generate migration script

In this section, you learn how to generate and download the migration files for the NSG flow logs that you want to migrate. 

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

    :::image type="content" source="./media/nsg-flow-logs-migrate/portal-search.png" alt-text="Screenshot that shows how to search for Network Watcher in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/portal-search.png":::

1. Under **Logs**, select **Migrate flow logs**.

    :::image type="content" source="./media/nsg-flow-logs-migrate/migrate-flow-logs.png" alt-text="Screenshot that shows the NSG flow logs migration page in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/migrate-flow-logs.png":::

1. Select the subscriptions that contain the NSG flow logs that you want to migrate.

1. For each subscription, select the regions that contain the flow logs that you want to migrate. **Total NSG flow logs** shows the total number of flow logs that are in the selected subscriptions. **Selected NSG flow logs** shows the number of flow logs in the selected regions.

1. After you chose the subscriptions and regions, select **Download script and JSON file** to download the migration files as a zip file.

    :::image type="content" source="./media/nsg-flow-logs-migrate/download-migration-files.png" alt-text="Screenshot that shows how to generate a migration script in the Azure portal." lightbox="./media/nsg-flow-logs-migrate/download-migration-files.png":::

1. Extract `MigrateFlowLogs.zip` file on your local machine. The zip file contains these two files:
    - a script file: `MigrationFromNsgToAzureFlowLogging.ps1`
    - a JSON file: `RegionSubscriptionConfig.json`.

## Run migration script

In this section, you learn how to use the script file that you downloaded in the previous section to migrate your NSG flow logs.

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

    After the analysis is complete, you'll see the analysis report on screen and in an html file in the same directory of the migration files. The report lists the number of NSG flow logs that will be disabled and the number of VNet flow logs that are created to replace them. The number of VNet flow logs that will be created depends on the type of migration that you choose. For example, if the network security group that you're migrating its flow log is associated with three network interfaces in the same virtual network, then you can choose *migration with aggregation* to have a single VNet flow log resource applied to the virtual network. You can also choose *migration without aggregation* to have three VNet flow logs (one VNet flow log resource per network interface).

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

1. After the migration is completed successfully, you can cancel the migration and revert changes. To accept the migration enter **n**, otherwise enter **y**. Once you accept the changes you can't revert them.

    ```
    Do you want to rollback? You won't get the option to revert the actions done now again (y/n): n
    ```

> [!NOTE]
> Keep the script and analysis report files for reference in case you have any issues with the migration.

## Related content

- [NSG flow logs](nsg-flow-logs-overview.md)
- [VNet flow logs](vnet-flow-logs-overview.md)
