---
title: 'Register and scan Azure Data Lake Storage (ADLS) Gen2'
description: This tutorial describes how to scan Azure Data Lake Storage Gen2. 
author: shsandeep123
ms.author: sandeepshah
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/08/2021
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data from Azure Data Lake Storage Gen2 into the catalog.
---
# Register and scan Azure Data Lake Storage Gen2

This article outlines how to register Azure Data Lake Storage Gen2 as data source in Azure Purview and set up a scan.

## Supported capabilities

The Azure Data Lake Storage Gen2 data source supports the following functionality:

- **Full and incremental scans** to capture metadata and classification in Azure Data Lake Storage Gen2

- **Lineage** between data assets for ADF copy/dataflow activities

For file types such as csv, tsv, psv, ssv, the schema is extracted when the following logics are in place:

1. First row values are non-empty
2. First row values are unique
3. First row values are neither a date and nor a number

## Prerequisites

Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).

### Setting up authentication for a scan

The following authentication methods are supported for Azure Data Lake Storage Gen2:

- Managed Identity
- Service principal
- Account Key

#### Managed Identity (Recommended)

When you choose **Managed Identity**, to set up the connection, you must first give your Purview account the permission to scan the data source:

1. Navigate to your ADLS Gen2 storage account.
1. Select **Access Control (IAM)** from the left navigation menu. 
1. Select **+ Add**.
1. Set the **Role** to **Storage Blob Data Reader** and enter your Azure Purview account name under **Select** input box. Then, select **Save** to give this role assignment to your Purview account.

> [!Note]
> For more details, please see steps in [Authorize access to blobs and queues using Azure Active Directory](../storage/common/storage-auth-aad.md)

#### Account Key

When authentication method selected is **Account Key**, you need to get your access key and store in the key vault:

1. Navigate to your ADLS Gne2 storage account
1. Select **Security + networking > Access keys**
1. Copy your *key* and save it somewhere for the next steps
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *key* from your storage account
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to setup your scan

#### Service principal

To use a service principal, you can use an existing one or create a new one. 

> [!Note]
> If you have to create a new Service Principal, please follow these steps:
> 1. Navigate to the [Azure portal](https://portal.azure.com).
> 1. Select **Azure Active Directory** from the left-hand side menu.
> 1. Select **App registrations**.
> 1. Select **+ New application registration**.
> 1. Enter a name for the **application** (the service principal name).
> 1. Select **Accounts in this organizational directory only**.
> 1. For Redirect URI select **Web** and enter any URL you want; it doesn't have to be real or work.
> 1. Then select **Register**.

It is required to get the Service Principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan

##### Granting the Service Principal access to your ADLS gen2 account

1. Navigate to your storage account.
1. Select **Access Control (IAM)** from the left navigation menu. 
1. Select **+ Add**.
1. Set the **Role** to **Storage Blob Data Reader** and enter your service principal name or object ID under **Select** input box. Then, select **Save** to give this role assignment to your service principal.
### Firewall settings

> [!NOTE]
> If you have firewall enabled for the storage account, you must use **Managed Identity** authentication method when setting up a scan.

1. Go into your ADLS Gen2 storage account in [Azure portal](https://portal.azure.com)
1. Navigate to **Settings > Networking** and
1. Choose **Selected Networks** under **Allow access from**
1. In the **Exceptions** section, select **Allow trusted Microsoft services to access this storage account** and hit **Save**

:::image type="content" source="./media/register-scan-adls-gen2/firewall-setting.png" alt-text="Screenshot showing firewall setting":::

## Register Azure Data Lake Storage Gen2 data source

To register a new ADLS Gen2 account in your data catalog, do the following:

1. Navigate to your Purview account
2. Select **Data Map** on the left navigation.
3. Select **Register**
4. On **Register sources**, select **Azure Data Lake Storage Gen2**
5. Select **Continue**

On the **Register sources (Azure Data Lake Storage Gen2)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your subscription to filter down storage accounts.
3. Select a storage account.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-adls-gen2/register-sources.png" alt-text="register sources options" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

1. Select the Azure Data Lake Storage Gen2 source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-adls-gen2/set-up-scan-adls-gen2.png" alt-text="Set up scan":::

1. You can scope your scan to specific folders or subfolders by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-adls-gen2/gen2-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-adls-gen2/gen2-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-adls-gen2/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
