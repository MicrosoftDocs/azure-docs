---
title: 'Register and scan Azure Data Lake Storage (ADLS) Gen1'
description: This article outlines the process to register an Azure Data Lake Storage Gen1 data source in Azure Purview including instructions to authenticate and interact with the Azure Data Lake Storage Gen 1 source
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to 
ms.date: 09/05/2021
ms.custom: template-how-to

---
# Connect to Azure Data Lake Gen1 in Azure Purview

This article outlines the process to register an Azure Data Lake Storage Gen1 data source in Azure Purview including instructions to authenticate and interact with the Azure Data Lake Storage Gen1 source.

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/services/storage/data-lake-storage/).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Share**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)| No | Yes | N/A |


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Purview resource](create-catalog-portal.md).

* You need to be an Azure Purview Data Source Admin

## Register

This section will enable you to register the ADLS Gen1 data source and set up an appropriate authentication mechanism to ensure successful scanning of the data source

### Prerequisites for registration

* Ensure that the hierarchy, aligning with the organization’s strategy (for example, geographical, business function, source of data, etc.) is created using Collections to define the data sources to be registered and scanned
* Ensure permissions are set up at the Collection level in order to manage access control appropriately
* Ensure that the Purview Account User has appropriate permissions defined in the root Collection [Catalog Permissions](./catalog-permissions.md#who-should-be-assigned-to-what-role)
* [Azure Purview private endpoint](./catalog-private-link.md) is enabled for connectivity to the Azure Purview Studio using a private network

### Steps to register

It is important to register the data source in Azure Purview prior to setting up a scan for the data source.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Purview accounts** page and click on your _Purview account_
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-purview-acct.png" alt-text="Screenshot that shows the Purview account used to register the data source":::

2. **Open Purview Studio** and navigate to the **Data Map --> Sources**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-open-purview-studio.png" alt-text="Screenshot that shows the link to open Purview Studio":::
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sources.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

3. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual sub-collections, as required
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-collection.png" alt-text="Screenshot that shows the collection menu to create collection hierarchy":::

4. Navigate to the appropriate collection under the **Sources** menu and click on the **Register** icon to register a new ADLS Gen1 data source
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-register.png" alt-text="Screenshot that shows the collection used to register the data source":::

5. Select the **Azure Data Lake Storage Gen1** data source and click **Continue**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-select-source.png" alt-text="Screenshot that allows selection of the data source":::

6. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, existing **Data Lake Store account name** and the **collection** and click on **Apply**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-source-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

7. The ADLS Gen1 storage account will be shown under the selected Collection
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-source-hierarchy.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Prerequisites for scan

In order to have access to scan the data source, an authentication method in the ADLS Gen1 Storage account needs to be configured.
The following options are supported:

> [!Note]
> If you have firewall enabled for the storage account, you must use Managed Identity authentication method when setting up a scan.

* **Managed Identity (Recommended)** - As soon as the Azure Purview Account is created, a system **Managed Identity** is created automatically in Azure AD tenant. Depending on the type of resource, specific RBAC role assignments are required for the Azure Purview MSI to perform the scans.

* **Service Principal** - In this method, you can create a new or use an existing service principal in your Azure Active Directory tenant.

### Authentication for a scan

#### Using Managed Identity for scanning

It is important to give your Purview account the permission to scan the ADLS Gen1 data source. You can add the Catalog's MSI at the Subscription, Resource Group, or Resource level, depending on what you want it to have scan permissions on.

> [!Note]
> You need to be an owner of the subscription to be able to add a managed identity on an Azure resource.

1. From the [Azure portal](https://portal.azure.com), find either the subscription, resource group, or resource (for example, an Azure Data Lake Storage Gen1 storage account) that you would like to allow the catalog to scan.
2. Click on **Overview** and then select **Data explorer**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-data-explorer.png" alt-text="Screenshot that shows the storage account":::

3. Click on **Access** in the top navigation
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-storage-access.png" alt-text="Screenshot that shows the Data explorer for the storage account":::

4. Click on **Select** and Add the _Purview Catalog_ in the **Select user or group** selection.
5. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children**, and **An access permission entry and a default permission entry** in the Add options as shown in the below screenshot. Click on **OK**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-assign-permissions.png" alt-text="Screenshot that shows the details to assign permissions for the Purview account":::

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

It is important to give your service principal the permission to scan the ADLS Gen2 data source. You can add the Catalog's MSI at the Subscription, Resource Group, or Resource level, depending on what you want it to have scan permissions on.

> [!Note]
> You need to be an owner of the subscription to be able to add a service principal on an Azure resource.

1. Provide the service principal access to the storage account by opening the storage account and clicking on **Overview** --> **Data Explorer**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-data-explorer.png" alt-text="Screenshot that shows the storage account":::

2. Click on **Access** in the top navigation
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-storage-access.png" alt-text="Screenshot that shows the Data explorer for the storage account":::

3. Click on **Select** and Add the _Service Principal_ in the **Select user or group** selection.
4. Select **Read** and **Execute** permissions. Make sure to choose **This folder and all children**, and **An access permission entry and a default permission entry** in the Add options. Click on **OK**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-permissions.png" alt-text="Screenshot that shows the details to assign permissions for the service principal":::

### Creating the scan

1. Open your **Purview account** and click on the **Open Purview Studio**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-purview-acct.png" alt-text="Screenshot that shows the Open Purview Studio":::

2. Navigate to the **Data map** --> **Sources** to view the collection hierarchy
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-open-purview-studio.png" alt-text="Screenshot that shows the collection hierarchy":::

3. Click on the **New Scan** icon under the **ADLS Gen1 data source** registered earlier
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-new-scan.png" alt-text="Screenshot that shows the data source with the new scan icon":::

#### If using Managed Identity

1. Provide a **Name** for the scan, select the **Purview MSI** under **Credential**, choose the appropriate collection for the scan and click on **Test connection**. On a successful connection, click **Continue**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-managed-identity.png" alt-text="Screenshot that shows the managed identity option to run the scan":::

#### If using Service Principal

1. Provide a **Name** for the scan, choose the appropriate collection for the scan and click on the **+ New** under **Credential**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp.png" alt-text="Screenshot that shows the service principal option":::

2. Select the appropriate **Key vault connection** and the **Secret name** that was used while creating the _Service Principal_. The **Service Principal ID** is the **Application (client) ID** copied as indicated earlier
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-key-vault.png" alt-text="Screenshot that shows the service principal key vault option":::

3. Click on **Test connection**. On a successful connection, click **Continue**
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-sp-test-connection.png" alt-text="Screenshot that shows the test connection for service principal":::

### Scoping and running the scan

1. You can scope your scan to specific folders and sub-folders by choosing the appropriate items in the list.
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scope-scan.png" alt-text="Scope your scan":::

2. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-rule-set.png" alt-text="Scan rule set":::

3. If creating a new _scan rule set_, select the **file types** to be included in the scan rule. 
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-file-types.png" alt-text="Scan rule set file types":::
   
4. You can select the **classification rules** to be included in the scan rule
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-classification-rules.png" alt-text="Scan rule set classification rules":::
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-select-scan-rule-set.png" alt-text="Scan rule set selection":::
 
5. Choose your scan trigger. You can set up a schedule or run the scan once.
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-trigger.png" alt-text="scan trigger":::
:::image type="content" source="media/register-scan-adls-gen1/register-register-adls-gen1-scan-trigger-selection.png" alt-text="scan trigger selection":::

6. Review your scan and select **Save and run**.
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-review-scan.png" alt-text="review scan":::

### Viewing Scan

1. Navigate to the _data source_ in the _Collection_ and click on **View Details** to check the status of the scan
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-details.png" alt-text="view scan detail":::

1. The **Last run status** will be updated to **In progress** and subsequently **Completed** once the entire scan has run successfully
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-in-progress.png" alt-text="view scan in progress":::
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-scan-completed.png" alt-text="view scan completed":::

### Managing Scan

Scans can be managed or run again on completion

1. Click on the **Scan name** to manage the scan
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan.png" alt-text="manage scan":::

2. You can _run the scan_ again, _edit the scan_, _delete the scan_  
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan-options.png" alt-text="manage scan options":::

3. You can _run an incremental scan_ or a _full scan_ again
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-full-inc-scan.png" alt-text="manage scan full or incremental":::
:::image type="content" source="media/register-scan-adls-gen1/register-adls-gen1-manage-scan-results.png" alt-text="manage scan results":::

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)