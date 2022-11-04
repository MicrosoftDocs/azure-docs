---
title: 'Govern Azure Data Lake Storage (ADLS) Gen1'
description: This article outlines the process to register an Azure Data Lake Storage Gen1 data source in Microsoft Purview including instructions to authenticate and interact with the Azure Data Lake Storage Gen 1 source
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to
ms.date: 09/14/2022
ms.custom: template-how-to, ignite-fall-2021
---
# Connect to Azure Data Lake Gen1 in Microsoft Purview

This article outlines the process to register an Azure Data Lake Storage Gen1 data source in Microsoft Purview including instructions to authenticate and interact with the Azure Data Lake Storage Gen1 source.

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/services/storage/data-lake-storage/).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)| No |Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section will enable you to register the ADLS Gen1 data source and set up an appropriate authentication mechanism to ensure successful scanning of the data source.

### Steps to register

It is important to register the data source in Microsoft Purview prior to setting up a scan for the data source.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Microsoft Purview accounts** page and select your _Purview account_

1. **Open Microsoft Purview governance portal** and navigate to the **Data Map --> Sources**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-open-purview-studio.png" alt-text="Screenshot that shows the link to open Microsoft Purview governance portal":::

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sources.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

1. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual subcollections, as required

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-collection.png" alt-text="Screenshot that shows the collection menu to create collection hierarchy":::

1. Navigate to the appropriate collection under the **Sources** menu and select the **Register** icon to register a new ADLS Gen1 data source

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-register.png" alt-text="Screenshot that shows the collection used to register the data source":::

1. Select the **Azure Data Lake Storage Gen1** data source and select **Continue**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-select-source.png" alt-text="Screenshot that allows selection of the data source":::

1. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, existing **Data Lake Store account name** and the **collection** and select **Apply**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-source-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

1. The ADLS Gen1 storage account will be shown under the selected Collection

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-source-hierarchy.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Prerequisites for scan

In order to have access to scan the data source, an authentication method in the ADLS Gen1 Storage account needs to be configured.
The following options are supported:

> [!Note]
> If you have firewall enabled for the storage account, you must use managed identity authentication method when setting up a scan.

* **System-assigned managed identity (Recommended)** - As soon as the Microsoft Purview Account is created, a system **Managed Identity** is created automatically in Azure AD tenant. Depending on the type of resource, specific RBAC role assignments are required for the Microsoft Purview SAMI to perform the scans.

* **User-assigned managed identity** (preview) - Similar to a system-managed identity, a user-assigned managed identity is a credential resource that can be used to allow Microsoft Purview to authenticate against Azure Active Directory. For more information, you can see our [user-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity).

* **Service Principal** - In this method, you can create a new or use an existing service principal in your Azure Active Directory tenant.

### Authentication for a scan

#### Using system or user-assigned managed identity for scanning

It is important to give your Microsoft Purview account the permission to scan the ADLS Gen1 data source. You can add the system managed identity, or user-assigned managed identity at the Subscription, Resource Group, or Resource level, depending on what you want it to have scan permissions on.

> [!Note]
> You need to be an owner of the subscription to be able to add a managed identity on an Azure resource.

1. From the [Azure portal](https://portal.azure.com), find either the subscription, resource group, or resource (for example, an Azure Data Lake Storage Gen1 storage account) that you would like to allow the catalog to scan.
1. Select **Overview** and then select **Data explorer**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-data-explorer.png" alt-text="Screenshot that shows the storage account":::

1. Select **Access** in the top navigation

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-storage-access.png" alt-text="Screenshot that shows the Data explorer for the storage account":::

1. Choose **Select** and add the _Microsoft Purview Name_ (which is the system managed identity) or the _[user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity)_(preview), that has already been registered in Microsoft Purview, in the **Select user or group** menu.
1. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children**, and **An access permission entry and a default permission entry** in the Add options as shown in the below screenshot. Select **OK**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-assign-permissions.png" alt-text="Screenshot that shows the details to assign permissions for the Microsoft Purview account":::

> [!Tip]
> An **access permission entry** is a permission entry on _current_ files and folders. A **default permission entry** is a permission entry that will be _inherited_ by new files and folders.
To grant permission only to currently existing files, **choose an access permission entry**.
To grant permission to scan files and folders that will be added in future, **include a default permission entry**.

#### Using Service Principal for scanning

##### Creating a new service principal

If you need to [Create a new service principal](./create-service-principal-azure.md), it is required to register an application in your Azure AD tenant and provide access to Service Principal in your data sources. Your Azure AD Global Administrator or other roles such as Application Administrator can perform this operation.

##### Getting the Service Principal's application ID

1. Copy the **Application (client) ID** present in the **Overview** of the [_Service Principal_](./create-service-principal-azure.md) already created

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-appl-id.png" alt-text="Screenshot that shows the Application (client) ID for the Service Principal":::

##### Granting the Service Principal access to your ADLS Gen1 account

It is important to give your service principal the permission to scan the ADLS Gen2 data source. You can add access for the service principal at the Subscription, Resource Group, or Resource level, depending on what permissions it needs.

> [!Note]
> You need to be an owner of the subscription to be able to add a service principal on an Azure resource.

1. Provide the service principal access to the storage account by opening the storage account and selecting **Overview** --> **Data Explorer**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-data-explorer.png" alt-text="Screenshot that shows the storage account":::

1. Select **Access** in the top navigation

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-storage-access.png" alt-text="Screenshot that shows the Data explorer for the storage account":::

1. Select **Select** and Add the _Service Principal_ in the **Select user or group** selection.
1. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children**, and **An access permission entry and a default permission entry** in the Add options. Select **OK**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-permissions.png" alt-text="Screenshot that shows the details to assign permissions for the service principal":::

### Creating the scan

1. Open your **Microsoft Purview account** and select the **Open Microsoft Purview governance portal**

1. Navigate to the **Data map** --> **Sources** to view the collection hierarchy

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-open-purview-studio.png" alt-text="Screenshot that shows the collection hierarchy":::

1. Select the **New Scan** icon under the **ADLS Gen1 data source** registered earlier

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-new-scan.png" alt-text="Screenshot that shows the data source with the new scan icon":::

#### If using system or user-assigned managed identity

Provide a **Name** for the scan, select the system or user-assigned managed identity under **Credential**, choose the appropriate collection for the scan, and select **Test connection**. On a successful connection, select **Continue**.

:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-managed-identity.png" alt-text="Screenshot that shows the managed identity option to run the scan":::

#### If using Service Principal

1. Provide a **Name** for the scan, choose the appropriate collection for the scan, and select the **+ New** under **Credential**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp.png" alt-text="Screenshot that shows the service principal option":::

1. Select the appropriate **Key vault connection** and the **Secret name** that was used while creating the _Service Principal_. The **Service Principal ID** is the **Application (client) ID** copied as indicated earlier

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-key-vault.png" alt-text="Screenshot that shows the service principal key vault option":::

1. Select **Test connection**. On a successful connection, select **Continue**

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-test-connection.png" alt-text="Screenshot that shows the test connection for service principal":::

### Scoping and running the scan

1. You can scope your scan to specific folders and subfolders by choosing the appropriate items in the list.

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-rule-set.png" alt-text="Scan rule set":::

1. If creating a new _scan rule set_, select the **file types** to be included in the scan rule. 

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-file-types.png" alt-text="Scan rule set file types":::

1. You can select the **classification rules** to be included in the scan rule

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-classification-rules.png" alt-text="Scan rule set classification rules":::

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-select-scan-rule-set.png" alt-text="Scan rule set selection":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-trigger.png" alt-text="scan trigger":::

    :::image type="content" source="media/register-scan-adls-gen1/register-register-adls-gen1-scan-trigger-selection.png" alt-text="scan trigger selection":::

1. Review your scan and select **Save and run**.

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-review-scan.png" alt-text="review scan":::

### Viewing Scan

1. Navigate to the _data source_ in the _Collection_ and select **View Details** to check the status of the scan

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-details.png" alt-text="view scan detail":::

1. The **Last run status** will be updated to **In progress** and then **Completed** once the entire scan has run successfully

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-in-progress.png" alt-text="view scan in progress":::

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-completed.png" alt-text="view scan completed":::

### Managing Scan

Scans can be managed or run again on completion.

1. Select the **Scan name** to manage the scan

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan.png" alt-text="manage scan":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_  

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan-options.png" alt-text="manage scan options":::

    > [!NOTE]
    > * Deleting your scan does not delete catalog assets created from previous scans.
    > * The asset will no longer be updated with schema changes if your source table has changed and you re-scan the source table after editing the description in the schema tab of Microsoft Purview.

1. You can _run an incremental scan_ or a _full scan_ again.

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-full-inc-scan.png" alt-text="manage scan full or incremental":::

    :::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan-results.png" alt-text="manage scan results":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
