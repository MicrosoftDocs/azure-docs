---
title: 'Scan multiple sources in Azure Purview'
description: Learn how to scan an entire Azure subscription or resource group in your Azure Purview data catalog. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/08/2021
---

# Register and scan multiple sources in Azure Purview

This article outlines how to register multiple sources (Azure subscriptions or resource groups) in Azure Purview and set up a scan on them.

## Supported capabilities

You can scan multiple sources to capture metadata and schema on most Azure resource types that Azure Purview supports. Azure Purview classifies the data automatically based on system and custom classification rules.

## Prerequisites

- Before you register data sources, create an Azure Purview account. For more information, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- Make sure you're an Azure Purview Data Source Administrator. You must also be an owner or user access administrator to add a role on a subscription or resource group.
- Set up authentication as described in the following sections.

### Set up authentication for enumerating resources under a subscription or resource group

1. Go to the subscription or the resource group in the Azure portal.  
1. Select **Access Control (IAM)** from the left menu. 
1. Select **+Add**. 
1. In the **Select input** box, select the **Reader** role and enter your Azure Purview account name (which represents its MSI file name). 
1. Select **Save** to finish the role assignment.

### Set up authentication to scan resources under a subscription or resource group

There are two ways to set up authentication for multiple sources in Azure:

- Managed identity
- Service principal

You must set up authentication on each resource within your subscription or resource group that you want to register and scan. Azure Storage resource types (Azure Blob Storage and Azure Data Lake Storage Gen2) make it easy by allowing you to add the MSI file or service principal at the subscription or resource group level as a storage blob data reader. The permissions then trickle down to each storage account within that subscription or resource group. For all other resource types, you must apply the MSI file or service principal on each resource, or create a script to do so. 

To learn how to add permissions on each resource type within a subscription or resource group, see the following resources:
    
- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#setting-up-authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Managed Instance](register-scan-azure-sql-database-managed-instance.md#setting-up-authentication-for-a-scan)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#setting-up-authentication-for-a-scan)
 
## Register multiple sources

To register new multiple sources in your data catalog, do the following:

1. Go to your Azure Purview account.
1. Select **Data Map** on the left menu.
1. Select **Register**.
1. On **Register sources**, select **Azure (multiple)**.

   :::image type="content" source="media/register-scan-azure-multiple-sources/register-azure-multiple.png" alt-text="Screenshot that shows the tile for Azure Multiple on the screen for registering multiple sources.":::
1. Select **Continue**.
1. On the **Register sources (Azure)** screen, do the following:

   1. In the **Name** box, enter a name that the data source will be listed with in the catalog. 
   1. In the **Management group** box, optionally choose a management group to filter down to.
   1. In the **Subscription** and **Resource group** dropdown list boxes, select a subscription or a specific resource group, respectively. The registration scope will be set to the selected subscription or resource group.  

      :::image type="content" source="media/register-scan-azure-multiple-sources/azure-multiple-source-setup.png" alt-text="Screenshot that shows the boxes for selecting a subscription and resource group.":::
   1. In the **Select a collection** box, select a collection or create a new one (optional).
   1. Select **Register** to register the data sources.


## Create and run a scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.
1. Select the data source that you registered.
1. Select **View details** > **+ New scan**, or use the **Scan** quick-action icon on the source tile.
1. For **Name**, fill in the name.
1. For **Type**, select the types of resources that you want to scan within this source. Choose one of these options:

    - Leave it as **All**. This selection includes future resource types that might not currently exist within that subscription or resource group.
    - Use the boxes to specifically select resource types that you want to scan. If you choose this option, future resource types that might be created within this subscription or resource group won't be included for scans, unless the scan is explicitly edited in the future.
    
    :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-source-scan.png" alt-text="Screenshot that shows options for scanning multiple sources.":::

1. Select the credential to connect to the resources within your data source: 
    - You can select a credential at the parent level as an MSI file, or you can select a credential for a particular service principal type. You can then use that credential for all the resource types under the subscription or resource group.
    - You can specifically select the resource type and apply a different credential for that resource type.
    
    Each credential will be considered as the method of authentication for all the resources under a particular type. You must set the chosen credential on the resources in order to successfully scan them, as described [earlier in this article](#set-up-authentication-to-scan-resources-under-a-subscription-or-resource-group).
1. Within each type, you can select to either scan all the resources or scan a subset of them by name:
    - If you leave the option as **All**, then future resources of that type will also be scanned in future scan runs.
    - If you select specific storage accounts or SQL databases, then future resources of that type created within this subscription or resource group will not be included for scans, unless the scan is explicitly edited in the future.
 
1. Select **Continue** to proceed. Azure Purview tests access to check if you've applied the Azure Purview MSI file as a reader on the subscription or resource group. If you get an error message, follow [these instructions](#set-up-authentication-for-enumerating-resources-under-a-subscription-or-resource-group) to resolve it.

1. Select scan rule sets for each resource type that you chose in the previous step. You can also create scan rule sets inline.
  
   :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-scan-rule-set.png" alt-text="Screenshot that shows scan rules for each resource type.":::

1. Choose your scan trigger. You can schedule it to run weekly, monthly, or once.

1. Review your scan and select **Save** to complete setup. 

## View your scans and scan runs

1. View source details by selecting **View details** on the tile under the **Data Map** section. 

    :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-source-detail.png" alt-text="Screenshot that shows source details."::: 

1. View scan run details by going to the **Scan details** page.
   
    The *status bar* is a brief summary of the running status of the child resources. It's displayed on the subscription level or resource group level. The colors have the following meanings:
    
    - Green: The scan was successful.
    - Red: The scan failed. 
    - Gray: The scan is still in progress.
   
    You can select each scan to view finer details.

    :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-scan-full-details.png" alt-text="Screenshot that shows scan details.":::

1. View a summary of recent failed scan runs at the bottom of the source details. You can also view more granular details about these runs.

## Manage your scans: edit, delete, or cancel
To manage a scan, do the following:

1. Go to the management center.
1. Select **Data sources** under the **Sources and scanning** section, and then select the desired data source.
1. Select the scan that you want to manage. Then: 

   - You can edit the scan by selecting **Edit**.
   - You can delete the scan by selecting **Delete**.
   - If the scan is running, you can cancel it by selecting **Cancel**.

## Next steps

- [Browse the Azure Purview data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview data catalog](how-to-search-catalog.md)    
