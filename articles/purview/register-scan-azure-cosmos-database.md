---
title: 'Register and scan Azure Cosmos DB Database (SQL API)'
description: This article outlines the process to register an Azure Cosmos DB instance in Microsoft Purview including instructions to authenticate and interact with the Azure Cosmos DB database
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to
ms.date: 09/14/2022
ms.custom: template-how-to, ignite-fall-2021, ignite-2022
---
# Connect to Azure Cosmos DB for NoSQL in Microsoft Purview

This article outlines the process to register an Azure Cosmos DB for NoSQL instance in Microsoft Purview, including instructions to authenticate and interact with the Azure Cosmos DB database source

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[No](#scan) | [Yes](#scan)|[Yes](#scan)|No|No** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section will enable you to register the Azure Cosmos DB for NoSQL instance and set up an appropriate authentication mechanism to ensure successful scanning of the data source.

### Steps to register

It is important to register the data source in Microsoft Purview prior to setting up a scan for the data source.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Microsoft Purview accounts** page and select your _Purview account_

1. **Open Microsoft Purview governance portal** and navigate to the **Data Map --> Collections**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-open-purview-studio.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

1. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual subcollections, as required

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-collections.png" alt-text="Screenshot that shows the collection menu to create collection hierarchy":::

1. Navigate to the appropriate collection under the **Sources** menu and select the **Register** icon to register a new Azure Cosmos DB database

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-register-data-source.png" alt-text="Screenshot that shows the collection used to register the data source":::

1. Select the **Azure Cosmos DB for NoSQL** data source and select **Continue**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-select-data-source.png" alt-text="Screenshot that allows selection of the data source":::

1. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, **Cosmos DB account name** and the **collection** and select **Apply**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-data-source-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

1. The _Azure Cosmos DB database_ storage account will be shown under the selected Collection

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-collection-mapping.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Authentication for a scan

In order to have access to scan the data source, an authentication method in the Azure Cosmos DB database Storage account needs to be configured.

There is only one way to set up authentication for Azure Cosmos DB Database:

**Account Key** - Secrets can be created inside an Azure Key Vault to store credentials in order to enable access for Microsoft Purview to scan data sources securely using the secrets. A secret can be a storage account key, SQL login password or a password.

> [!Note]
> You need to deploy an _Azure key vault_ resource in your subscription and assign _Microsoft Purview account’s_ MSI with required access permission to secrets inside _Azure key vault_.

#### Using Account Key for scanning

You need to get your access key and store in the key vault:

1. Navigate to your Azure Cosmos DB database storage account
1. Select **Settings > Keys**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-access-keys.png" alt-text="Screenshot that shows the access keys in the storage account":::

1. Copy your *key* and save it separately for the next steps

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-key.png" alt-text="Screenshot that shows the access keys to be copied":::

1. Navigate to your key vault

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-key-vault.png" alt-text="Screenshot that shows the key vault":::

1. Select **Settings > Secrets** and select **+ Generate/Import**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-generate-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret":::

1. Enter the **Name** and **Value** as the *key* from your storage account and Select **Create** to complete

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-key-vault-options.png" alt-text="Screenshot that shows the key vault option to enter the secret values":::

1. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to set up your scan.

### Creating the scan

1. Open your **Microsoft Purview account** and select the **Open Microsoft Purview governance portal**
1. Navigate to the **Data map** --> **Sources** to view the collection hierarchy
1. Select the **New Scan** icon under the **Azure Cosmos database** registered earlier

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-create-scan.png" alt-text="Screenshot that shows the screen to create a new scan":::

1. Provide a **Name** for the scan, choose the appropriate collection for the scan and select **+ New** under **Credential**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-acct-key-option.png" alt-text="Screenshot that shows the Account Key option for scanning":::

1. Select the appropriate **Key vault connection** and the **Secret name** that was used while creating the _Account Key_. Choose **Authentication method** as _Account Key_

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-acct-key-details.png" alt-text="Screenshot that shows the account key options":::

1. Select **Test connection**. On a successful connection, select **Continue**

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-test-connection.png" alt-text="Screenshot that shows Test Connection success":::

### Scoping and running the scan

1. You can scope your scan to specific folders and subfolders by choosing the appropriate items in the list.

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-scan-rule-set.png" alt-text="Scan rule set":::

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-new-scan-rule-set.png" alt-text="New Scan rule":::

1. You can select the **classification rules** to be included in the scan rule

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-classification.png" alt-text="Scan rule set classification rules":::

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-select-scan-rule-set.png" alt-text="Scan rule set selection":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-scan-trigger.png" alt-text="scan trigger":::

1. Review your scan and select **Save and run**.

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-review-scan.png" alt-text="review scan":::

### Viewing Scan

1. Navigate to the _data source_ in the _Collection_ and select **View Details** to check the status of the scan

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-last-run-status.png" alt-text="view scan details":::

1. The **Last run status** will be updated to **In progress** and then **Completed** once the entire scan has run successfully

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-scan-in-progress.png" alt-text="view scan in progress":::

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-scan-completed.png" alt-text="view scan completed":::

### Managing Scan

Scans can be managed or run again on completion.

1. Select the **Scan name** to manage the scan

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-manage-scan.png" alt-text="manage scan":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_  

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-manage-scan-options.png" alt-text="manage scan options":::

1. You can run a _Full Scan_ again

    :::image type="content" source="media/register-scan-azure-cosmos-database/register-cosmos-db-full-scan.png" alt-text="full scan":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
