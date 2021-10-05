---
title: 'Register and scan Azure Cosmos Database (SQL API)'
description: This article outlines the process to register an Azure Cosmos data source (SQL API) in Azure Purview including instructions to authenticate and interact with the Azure Cosmos database 
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to 
ms.date: 09/20/2021
ms.custom: template-how-to

---
# Connect to Azure Cosmos database (SQL API) in Azure Purview

[This article outlines the process to register an Azure Cosmos database (SQL API) in Azure Purview including instructions to authenticate and interact with the Azure Cosmos database source]

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Share**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)|No| Yes |No|

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Purview resource](create-catalog-portal.md).

* You need to be an Azure Purview Data Source Admin

## Register

This section will enable you to register the Azure Cosmos database (SQL API) and set up an appropriate authentication mechanism to ensure successful scanning of the data source

### Prerequisites for registration

1. Ensure that the hierarchy, aligning with the organization’s strategy (for example, geographical, business function, source of data, etc.) is created using Collections to define the data sources to be registered and scanned
2. Ensure permissions are set up at the Collection level in order to manage access control appropriately
3. Ensure that the Purview Account User has appropriate permissions defined in the root Collection [Catalog Permissions](./catalog-permissions.md#who-should-be-assigned-to-what-role)
4. [Azure Purview private endpoint](./catalog-private-link.md) is enabled for connectivity to the Azure Purview Studio using a private network


### Steps to register

It is important to register the data source in Azure Purview prior to setting up a scan for the data source.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Purview accounts** page and click on your _Purview account_
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-purview-acct.png" alt-text="Screenshot that shows the Purview account used to register the data source":::

2. **Open Purview Studio** and navigate to the **Data Map --> Collections**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-open-purview-studio.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

3. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual sub-collections, as required
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-collections.png" alt-text="Screenshot that shows the collection menu to create collection hierarchy":::

4. Navigate to the appropriate collection under the **Sources** menu and click on the **Register** icon to register a new Azure Cosmos database
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-register-data-source.png" alt-text="Screenshot that shows the collection used to register the data source":::

5. Select the **Azure Cosmos DB (SQL API)** data source and click **Continue**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-select-data-source.png" alt-text="Screenshot that allows selection of the data source":::

6. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, **Cosmos DB account name** and the **collection** and click on **Apply**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-data-source-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

7. The _Azure Cosmos database_ storage account will be shown under the selected Collection
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-collection-mapping.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Prerequisites for scan

In order to have access to scan the data source, an authentication method in the Azure Cosmos database Storage account needs to be configured.

There is only one way to set up authentication for Azure Cosmos Database:

**Account Key** - Secrets can be created inside an Azure Key Vault to store credentials in order to enable access for Azure Purview to scan data sources securely using the secrets. A secret can be a storage account key, SQL login password or a password.

> [!Note]
> You need to deploy an _Azure key vault_ resource in your subscription and assign _Azure Purview account’s_ MSI with required access permission to secrets inside _Azure key vault_.

### Authentication for a scan

#### Using Account Key for scanning

You need to get your access key and store in the key vault:

1. Navigate to your Azure Cosmos database storage account
1. Select **Settings > Keys**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-access-keys.png" alt-text="Screenshot that shows the access keys in the storage account":::

1. Copy your *key* and save it separately for the next steps
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-key.png" alt-text="Screenshot that shows the access keys to be copied":::

1. Navigate to your key vault
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-key-vault.png" alt-text="Screenshot that shows the key vault":::

1. Select **Settings > Secrets** and click on **+ Generate/Import**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-generate-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret":::

1. Enter the **Name** and **Value** as the *key* from your storage account and Select **Create** to complete
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-key-vault-options.png" alt-text="Screenshot that shows the key vault option to enter the secret values":::

1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to setup your scan

### Creating the scan

1. Open your **Purview account** and click on the **Open Purview Studio**
1. Navigate to the **Data map** --> **Sources** to view the collection hierarchy
1. Click on the **New Scan** icon under the **Azure Cosmos database** registered earlier
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-create-scan.png" alt-text="Screenshot that shows the screen to create a new scan":::

1. Provide a **Name** for the scan, choose the appropriate collection for the scan and select **+ New** under **Credential**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-acct-key-option.png" alt-text="Screenshot that shows the Account Key option for scanning":::

1. Select the appropriate **Key vault connection** and the **Secret name** that was used while creating the _Account Key_. Choose **Authentication method** as _Account Key_
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-acct-key-details.png" alt-text="Screenshot that shows the account key options":::

1. Click on **Test connection**. On a successful connection, click **Continue**
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-test-connection.png" alt-text="Screenshot that shows Test Connection success":::

### Scoping and running the scan

1. You can scope your scan to specific folders and sub-folders by choosing the appropriate items in the list.
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-scope-scan.png" alt-text="Scope your scan":::

2. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-scan-rule-set.png" alt-text="Scan rule set":::
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-new-scan-rule-set.png" alt-text="New Scan rule":::

3. You can select the **classification rules** to be included in the scan rule
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-classification.png" alt-text="Scan rule set classification rules":::
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-select-scan-rule-set.png" alt-text="Scan rule set selection":::

4. Choose your scan trigger. You can set up a schedule or run the scan once.
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-scan-trigger.png" alt-text="scan trigger":::

5. Review your scan and select **Save and run**.
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-review-scan.png" alt-text="review scan":::

### Viewing Scan

1. Navigate to the _data source_ in the _Collection_ and click on **View Details** to check the status of the scan
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-last-run-status.png" alt-text="view scan details":::

1. The **Last run status** will be updated to **In progress** and subsequently **Completed** once the entire scan has run successfully
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-scan-in-progress.png" alt-text="view scan in progress":::
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-scan-completed.png" alt-text="view scan completed":::

### Managing Scan

Scans can be managed or run again on completion

1. Click on the **Scan name** to manage the scan
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-manage-scan.png" alt-text="manage scan":::

2. You can _run the scan_ again, _edit the scan_, _delete the scan_  
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-manage-scan-options.png" alt-text="manage scan options":::

3. You can run a _Full Scan_ again
:::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmosdb-full-scan.png" alt-text="full scan":::

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
