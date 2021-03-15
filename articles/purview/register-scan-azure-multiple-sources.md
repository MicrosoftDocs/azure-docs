---
title: 'How to scan Azure multiple sources'
description: Learn how to scan an entire Azure subscription or resource group in your Azure Purview data catalog. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 2/26/2021
---

# Register and scan Azure multiple sources

This article outlines how to register an Azure Multiple Source  (Azure Subscriptions or Resource Groups) in Purview and set up a scan on it.

## Supported capabilities

Azure multiple Source supports scans to capture metadata and schema on most Azure resource types that Purview supports. It also classifies the data automatically based on system and custom classification rules.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be an Azure Purview Data Source Admin
- Setting up authentication as described in the sections below

### Setting up authentication for enumerating resources under a subscription or resource group

1. Navigate to the subscription or the resource group in the Azure portal.  
1. Select **Access Control (IAM)** from the left navigation menu 
1. You must be owner or user access administrator to add a role on the subscription or resource group. Select *+Add* button. 
1. Set the **Reader** Role and enter your Azure Purview account name (which represents its MSI) under Select input box. Click *Save* to finish the role assignment.

### Setting up authentication to scan resources under a subscription or resource group

There are two ways to set up authentication for Azure multiple source:

- Managed Identity
- Service Principal

> [!NOTE]
> You must set up authentication on each resource within your subscription or resource group, that you intend to register and scan. Azure storage resource types (Azure blob storage and Azure Data Lake Storage Gen2) make it easy by allowing you to add the MSI or Service Principal at the subscription/Resource group level as storage blob data reader.The permissions then trickle down to each storage account within that subscription or resource group. For all other resource types, you must apply the MSI or service principal on each resource, or device a script to do so. Here's how to add permissions on each resource type within a subscription or resource group.
    
- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#setting-up-authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md#setting-up-authentication-for-a-scan)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#setting-up-authentication-for-a-scan)
 
## Register an Azure multiple Source

To register a new Azure multiple Source in your data catalog, do the following:

1. Navigate to your Purview account
1. Select **Sources** on the left navigation
1. Select **Register**
1. On **Register sources**, select **Azure (multiple)**
1. Select **Continue**

   :::image type="content" source="media/register-scan-azure-multiple-sources/register-azure-multiple.png" alt-text="Register Azure multiple source":::

On the **Register sources (Azure multiple)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog 
1. Optionally choose a **management group** to filter down to
1. **Select a subscription or a specific resource group** under a given subscription in the dropdown. The registration scope will be set to the selected subscription or the resource group  
1. Select a **collection** or create a new one (Optional)
1. **Finish** to register the data source

   :::image type="content" source="media/register-scan-azure-multiple-sources/azure-multiple-source-setup.png" alt-text="Set up Azure multiple source":::

## Creating and running a scan

To create and run a new scan, do the following:

1. Navigate to the **Sources** section

1. Select the data source that you registered

1. Click on view details and Select **+ New scan** or use the scan quick action icon on the source tile

1. Fill in the *name* and select all the types of resource you want to scan within this source

    1. You can leave it as *All* (This includes future resource types that may not currently exist within that subscription or resource group)
    1. You can **specifically select resource types** you want to scan. If you choose this option future resource types that may be created within this subscription or resource group will not be included for scans, unless the scan is explicitly edited in the future
    
    :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-source-scan.png" alt-text="Azure multiple Source scan":::

1. Select the credential to connect to the resources within your data source. 
    1. You can select a **credential at the parent level** as MSI or a particular service principal type credential, which you can choose to use for all the resource types under the subscription or resource group
    1. You can also specifically **select the resource type and apply a different credential** for that resource type
    1. Each credential will be considered as the method of authentication for all the resources under a particular type
    1. You must set the chosen credential on the resources in order to successfully scan them as described in this [section](#setting-up-authentication-to-scan-resources-under-a-subscription-or-resource-group) above
1. Within each type you can select to either scan all the resources or a subset of them by name.
    1. If you leave the option as **all** then future resources of that type will also be scanned in future scan runs
    1. If you select specific storage accounts or SQL databases, then future resources created of that type within this subscription or resource group will not be included for scans, unless the scan is explicitly edited in the future
 
1.	Click **Continue** to proceed. We will test access to check if you have applied the Purview MSI as a reader on the subscription or resource group. If an error message is thrown, follow instructions [here](#setting-up-authentication-for-enumerating-resources-under-a-subscription-or-resource-group)

1.	Select **scan rule sets** for each resource type chosen in the previous step. You can also create scan rule sets inline.
  :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-scan-rule-set.png" alt-text="Azure multiple scan rule set selection":::

1. Choose your scan trigger. You can scheduled it to run **weekly/monthly** or **once**

1. Review your scan and select Save to complete set up   

## Viewing your scans and scan runs

1. View source details by clicking on **view details** on the tile under the sources section. 

      :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-source-detail.png" alt-text="Azure multiple Source details"::: 

1. View scan run details by navigating to the **scan details** page.
    1. The *status bar* is a brief summary on the running status of the children resources. It will be displayed on the subscription or resource group level
    1. Green means successful, while red means failed. Grey means that the scan is still in-progress
    1. You can click into each scan to view more fine grained details

      :::image type="content" source="media/register-scan-azure-multiple-sources/multiple-scan-full-details.png" alt-text="Azure multiple scan details":::

1. View a summary of recent failed scan runs at the bottom of the source details page. You can also click into view more granular details pertaining to these runs.

## Manage your scans - edit, delete, or cancel
To manage or delete a scan, do the following:

- Navigate to the management center. Select Data sources under the Sources and scanning section then select on the desired data source

- Select the scan you would like to manage. You can edit the scan by selecting Edit

- You can delete your scan by selecting Delete
- If a scan is running, you can cancel it as well

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)    
