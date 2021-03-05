---
title: 'Register and scan Azure Data Lake Storage (ADLS) Gen1'
description: This tutorial describes how to scan data from Azure Data Lake Storage Gen1 into Azure Purview. 
author: shsandeep123
ms.author: sandeepshah
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/30/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data from Azure Data Lake Storage Gen1 into the catalog.
---
# Register and scan Azure Data Lake Storage Gen1

This article outlines how to register Azure Data Lake Storage Gen1 as data source in Azure Purview and set up a scan on it.

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/services/storage/data-lake-storage/).

## Supported capabilities

The Azure Data Lake Storage Gen1 data source supports the following functionality:

- **Full and incremental scans** to capture metadata and classification in Azure Data Lake Storage Gen1

- **Lineage** between data assets for ADF copy/dataflow activities

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be an Azure Purview Data Source Admin

## Setting up authentication for a scan

The following authentication methods are supported for Azure Data Lake Storage Gen1:

- Managed Identity
- Service principal

### Managed Identity (Recommended)

For ease and security, you may want to use Purview MSI to authenticate with your data store.

To set up a scan using the Data Catalog's MSI, you must first give your Purview account the permission to scan the data source. This step must be done *before* you set up your scan or your scan will fail.

#### Adding the Data Catalog MSI to an Azure Data Lake Storage Gen1 account

You can add the Catalog's MSI at the Subscription, Resource Group, or Resource level, depending on what you want it to have scan permissions
on.

> [!Note]
> You need to be an owner of the subscription to be able to add a managed identity on an Azure resource.

1. From the [Azure portal](https://portal.azure.com), find either the subscription, resource group, or resource (for example, an Azure Data Lake Storage Gen1 storage account) that you would like to allow the catalog to scan.

2. Click on **Overview** and then select **Data explorer**

   :::image type="content" source="./media/register-scan-adls-gen1/access-control.png" alt-text="Choose access control":::

3. Click on **Access** on the top navigation

   :::image type="content" source="./media/register-scan-adls-gen1/access.png" alt-text="Click on Access":::

4. Click on **Add**. Add the **Purview Catalog** in the Select user or group selection. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children** in the Add to option as shown in the below screenshot and click on **OK**
   :::image type="content" source="./media/register-scan-adls-gen1/managed-instance-authentication.png" alt-text="MSI authentication details":::

5. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account).

6. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan
> [!Note]
> Once you have added the catalog's MSI on the data source, wait up to 15 minutes for the permissions to propagate before setting up a scan.

After about 15 minutes, the catalog should have the appropriate permissions to be able to scan the resource(s).

### Service principal

To use a service principal, you must first create one following these steps:

1. Navigate to the [Azure portal](https://portal.azure.com).

2. Select **Azure Active Directory** from the left-hand side menu.

3. Select **App registrations**.

4. Select **+ New application registration**.

5. Enter a name for the **application** (the service principal name).

6. Select **Accounts in this organizational directory only**.

7. For **Redirect URI** select **Web** and enter any URL you want; it doesn't have to be real or work.

8. Then select **Register**.

9. Copy the values from both the display name and the application ID.

#### Adding the Data Catalog service principal to an Azure Data Lake Storage Gen1 account
1. From the [Azure portal](https://portal.azure.com), find either the subscription, resource group, or resource (for example, an Azure Data Lake Storage Gen1 storage account) that you would like to allow the catalog to scan.

2. Click on **Overview** and then select **Data explorer**

   :::image type="content" source="./media/register-scan-adls-gen1/access-control.png" alt-text="Choose access control":::

3. Click on **Access** on the top navigation

   :::image type="content" source="./media/register-scan-adls-gen1/access.png" alt-text="Click on Access":::

4. Click on **Add**. Add the **Service principal application** in the Select user or group selection. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children** in the Add to option as shown in the below screenshot and click on **OK**
   :::image type="content" source="./media/register-scan-adls-gen1/service-principal-authentication.png" alt-text="service principal authentication details":::

5. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account).

6. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan.

## Register Azure Data Lake Storage Gen1 data source

To register a new ADLS Gen1 account in your data catalog, do the following:

1. Navigate to your Purview Data Catalog.
2. Select **Sources** on the left navigation.
3. Select **Register**
4. On **Register sources**, select **Azure Data Lake Storage Gen1**. 
5. Select **Continue**.

On the Register sources (Azure Data Lake Storage Gen1) screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your subscription to filter down storage accounts
3. Select a storage account
4. Select a collection or create a new one (Optional)
5. Finish to register the data source.

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
