---
title: 'Tutorial: Register data assets in Azure Data Catalog'
description: This tutorial describes how to register data assets in your Azure Data Catalog. 
ms.service: data-catalog
ms.topic: tutorial
ms.date: 12/08/2022
# Customer intent: As an Azure Active Directory owner, I want to store my data in Azure Data Catalog so that I can search my data all from one centralized place.
---
# Tutorial: Register data assets in Azure Data Catalog

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

In this tutorial, you use the registration tool to register data assets from the database sample with the catalog. Registration is the process of extracting key structural metadata such as names, types, and locations from the data source and the assets it contains, and copying that metadata to the catalog. The data source and data assets remain where they are, but the metadata is used by the catalog to make them more easily discoverable and understandable.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Register data assets 
> * Search data assets
> * Annotate data assets
> * Connect to data assets
> * Manage data assets
> * Delete data assets

## Prerequisites

* A [Microsoft Azure](https://azure.microsoft.com/) subscription.
* You need to have your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).
* An [Azure Data Catalog](data-catalog-get-started.md)

To set up Data Catalog, you must be the owner or co-owner of an Azure subscription.

## Register data assets

### Register a data source

In this example, we'll register data assets (tables) from a [database sample](/azure/azure-sql/database/single-database-create-quickstart) for Azure SQL Database, but you can use any supported data source if you prefer to work with data that is familiar and relevant to your role. For a list of supported data sources, see: [Supported data sources](data-catalog-dsr.md).

The database name we're using in this tutorial is *RLSTest*.

You can now register data assets from the database sample by using Azure Data Catalog.

1. Go to the [Azure Data Catalog home page](http://azuredatacatalog.com) and select **Publish Data**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-publish-data.png" alt-text="The data catalog is open with the Publish Data button selected.":::

1. Select **Launch Application** to download, install, and run the registration tool on your computer.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-launch-application.png" alt-text="On the Publish Data page, the Launch Application button is selected.":::

1. On the **Welcome** page, select **Sign in** and enter your credentials.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-welcome-dialog.png" alt-text="On the Welcome page, the Sign In button is selected.":::

1. On the **Microsoft Azure Data Catalog** page, select **SQL Server** and **Next**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-data-sources.png" alt-text="On the Microsoft Azure Data Catalog page, the SQL Server button is selected. Then the next button is selected.":::

1. Enter the SQL Server connection properties for your database sample in Azure SQL Database and select **CONNECT**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-sql-server-connection.png" alt-text="On the S Q L Server connection properties page, the text boxes are highlighted for these attributes: Server Name, User Name, Password, and Database. Then the Connect button is selected.":::

1. Register the metadata of your data asset. In this example, you register **Product** objects from the sample namespace:

   1. In the **Server Hierarchy** tree, expand your database sample and select **SalesLT**.

   1. Select **Product**, **ProductCategory**, **ProductDescription**, and **ProductModel** by using Ctrl+select.

   1. Select the **move-selected arrow** (**>**). This action moves all selected objects into the **Objects to be registered** list.

      :::image type="content" source="media/register-data-assets-tutorial/data-catalog-server-hierarchy.png" alt-text="In the Server Hierarchy, Sales L T is selected. Then in the Available Objects list, the product, product category, product description, product model, and produce model produce description objects are all highlighted. Then the move-selected > is selected.":::

   1. Select **Include a Preview** to include a snapshot preview of the data. The snapshot includes up to 20 records from each table, and it's copied into the catalog.

   1. Select **Include Data Profile** to include a snapshot of the object statistics for the data profile (for example: minimum, maximum, and average values for a column, number of rows).

   1. In the **Add tags** field, enter **sales, product, azure sql**. This action adds search tags for these data assets. Tags are a great way to help users find a registered data source.

   1. Specify the name of an **expert** on this data (optional).

      :::image type="content" source="media/register-data-assets-tutorial/data-catalog-objects-register.png" alt-text="In the objects to be registered list, these names are shown: product, product category, product description, product model, and product model product description. Then the 'Include preview' and 'Include data profile' options are selected. Then three tags are added to the tag field: sales, product, and Azure SQL.":::

   1. Select **REGISTER**. Azure Data Catalog registers your selected objects. In this exercise, the selected objects from your database sample are registered. The registration tool extracts metadata from the data asset and copies that data into the Azure Data Catalog service. The data remains where it currently stays. Data remains under the control of the administrators and policies of the origin system.

      :::image type="content" source="media/register-data-assets-tutorial/data-catalog-registered-objects.png" alt-text="In the Microsoft Azure Data Catalog window, all the newly registered objects are shown in the Objects to be registered list. At the top of the window there's a notification stating that the process to register the selected objects is finished. Then the View Portal button is selected.":::

   1. To see your registered data source objects, select **View Portal**. In the Azure Data Catalog portal, confirm that you see all four tables and the database in the grid view (verify that the search bar is clear).

      :::image type="content" source="media/register-data-assets-tutorial/data-catalog-view-portal.png" alt-text="In the Microsoft Azure Data Catalog window, there are new tiles in the grid view for each of the registered objects.":::

In this exercise, you registered objects from the database sample for Azure SQL Database so that they can be easily discovered by users across your organization.

In the next exercise, you learn how to discover registered data assets.

## Discover data assets

Discovery in Azure Data Catalog uses two primary mechanisms: searching and filtering.

Searching is designed to be both intuitive and powerful. By default, search terms are matched against any property in the catalog, including user-provided annotations.

Filtering is designed to complement searching. You can select specific characteristics such as experts, data source type, object type, and tags to view matching data assets and to constrain search results to matching assets.

By using a combination of searching and filtering, you can quickly navigate the data sources that are registered with Azure Data Catalog.

In this exercise, you use the Azure Data Catalog portal to discover data assets you registered in the previous exercise. See [Data Catalog Search syntax reference](/rest/api/datacatalog/#search-syntax-reference) for details about search syntax.

Following are a few examples for discovering data assets in the catalog.  

### Discover data assets with basic search

Basic search helps you search a catalog by using one or more search terms. Results are any assets that match on any property with one or more of the terms specified.

1. Select **Home** in the Azure Data Catalog portal. If you've closed the web browser, go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com).

1. In the search box, enter `product` and press **ENTER**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-basic-text-search.png" alt-text="In the Azure Data Catalog Portal, the home button is selected. Then, in the search box 'product' has been entered.":::

1. Confirm that you see all four tables and the database in the results. You can switch between **grid view** and **list view** by selecting buttons on the toolbar, as shown in the following image. Notice that the search keyword is highlighted in the search results because the **Highlight** option is **ON**. You can also specify the number of **results per page** in search results.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-basic-text-search-results.png" alt-text="In the search bar, 'product' is still entered, and the list and grid view options are highlighted next to the search bar. The 'Results per page' option is set to 10, and the 'Highlight' option is set to 'on', so 10 results are shown on the page, with any references to 'product' highlighted.":::

   The **Searches** panel is on the left and the **Properties** panel is on the right. On the **Searches** panel, you can change search criteria and filter results. The **Properties** panel displays properties of a selected object in the grid or list.

1. Select **Product** in the search results. select the **Preview**, **Columns**, **Data Profile**, and **Documentation** tabs, or select the arrow to expand the bottom pane.  

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-data-asset-preview.png" alt-text="At the top of the search results, the 'Preview' button is selected.":::

   On the **Preview** tab, you see a preview of the data in the **Product** table.

1. Select the **Columns** tab to find details about columns (such as **name** and **data type**) in the data asset.

1. Select the **Data Profile** tab to see the profiling of data (for example: number of rows, size of data, or minimum value in a column) in the data asset.

### Discover data assets with property scoping

Property scoping helps you discover data assets where the search term is matched with the specified property.

1. Clear the **Table** filter under **Object Type** in **Filters**.  

1. In the search box, enter `tags:product` and press **ENTER**. See [Data Catalog Search syntax reference](/rest/api/datacatalog/#search-syntax-reference) for all the properties you can use for searching the data catalog.

1. Confirm that you see the tables and the database in the results.  

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-property-scoping-results.png" alt-text="'Tags : product' is entered in the search bar, and the Object Type filter shows 'Table' has been selected.":::

### Save the search

1. In the **Searches** pane in the **Current Search** section, enter a name for the search and select **Save**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-save-search.png" alt-text="In the searches pane, 'Product tag search' has been entered as a name for the search. Then the 'Save' button is selected.":::

2. Confirm that the saved search shows up under **Saved Searches**.

3. Select one of the actions you can take on the saved search (**Rename**, **Delete**, **Save As Default** search).

### Grouping with parentheses

By grouping with parentheses, you can group parts of the query to achieve logical isolation, especially along with Boolean operators.

1. In the search box, enter `name:product AND (tags:product AND objectType:table)` and press **ENTER**.

1. Confirm that you see only the **Product** table in the search results.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-save-search.png" alt-text="In the search bar `name : product AND ( tags : product AND object Type : table )` has been entered. The product table is the only search result returned.":::

### Comparison operators

With comparison operators, you can use comparisons other than equality for properties that have numeric and date data types.

1. In the search box, enter `lastRegisteredTime:>"06/09/2016"`.

1. Clear the **Table** filter under **Object Type**.

1. Press **ENTER**.

1. Confirm that you see the **Product**, **ProductCategory**, and **ProductDescription** tables and the SQL database you registered in search results.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-comparison-operator-results.png" alt-text="In the search bar last Registered Time : > 06/09/2016 has been entered. The tables Product, Product Category, Product Description have been returned. The S Q L database has also been returned.":::

See [How to discover data assets](data-catalog-how-to-discover.md) for detailed information about discovering data assets. For more information on search syntax, see [Data Catalog Search syntax reference](/rest/api/datacatalog/#search-syntax-reference).

## Annotate data assets

In this exercise, you use the Azure Data Catalog portal to annotate (add information such as descriptions, tags, or experts) existing data assets in the catalog. The annotations supplement the structural metadata extracted from the data source during registration. Annotation makes the data assets much easier to discover and understand.

In this exercise, you annotate a single data asset (ProductPhoto). You add a friendly name and description to the ProductPhoto data asset.  

1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com) and search with `tags:product` to find the data assets you've registered.

1. Select **ProductModel** in search results.  

1. Enter **Product images** for **Friendly Name** and **Product photos for marketing materials** for the **Description**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-productmodel-description.png" alt-text="In the Properties pane, the name, friendly name, and description of the selected resource are shown. The information is editable.":::

   The **Description** helps others discover and understand why and how to use the selected data asset. You can also add more tags and view columns. You can search and filter data sources by using the descriptive metadata you’ve added to the catalog.

You can also do the following steps on this page:

* Add experts for the data asset. select **Add** in the **Experts** area.

* Add tags at the dataset level. select **Add** in the **Tags** area. A tag can be a user tag or a glossary tag. The Standard Edition of Data Catalog includes a business glossary that helps catalog administrators define a central business taxonomy. Catalog users can then annotate data assets with glossary terms. For more information, see [How to set up the Business Glossary for Governed Tagging](data-catalog-how-to-business-glossary.md)

* Add tags at the column level. select **Add** under **Tags** for the column you want to annotate.

* Add description at the column level. Enter **Description** for a column. You can also view the description metadata extracted from the data source.

* Add **Request access** information that shows users how to request access to the data asset.
  
* Choose the **Documentation** tab and provide documentation for the data asset. With Azure Data Catalog documentation, you can use your data catalog as a content repository to create a complete narrative of your data assets.
  
You can also add an annotation to multiple data assets. For example, you can select all the data assets you registered and specify an expert for them.

:::image type="content" source="media/register-data-assets-tutorial/data-catalog-multi-select-annotate.png" alt-text="The checkbox in the title row of the results table is selected. All returned assets were selected when this checkbox in the title row was selected. Edits to the 'Properties' window will affect all selected assets.":::

Azure Data Catalog supports a crowd-sourcing approach to annotations. Any Data Catalog user can add tags (user or glossary), descriptions, and other metadata. By doing so, users add perspective on a data asset and its use, and share that perspective with other users.

See [How to annotate data assets](data-catalog-how-to-annotate.md) for detailed information about annotating data assets.

## Connect to data assets

In this exercise, you open data assets in an integrated client tool (Excel) and a non-integrated tool (SQL Server Management Studio) by using connection information.

> [!NOTE]
> It’s important to remember that Azure Data Catalog doesn’t give you access to the actual data source—it simply makes it easier for you to discover and understand it. When you connect to a data source, the client application you choose uses your Windows credentials or prompts you for credentials as necessary. If you have not previously been granted access to the data source, you need to be granted access before you can connect.

### Connect to a data asset from Excel

1. Select **Product** from search results. select **Open In** on the toolbar and select **Excel**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-connect1.png" alt-text="Product is selected from the table of returned results. The Open In button is selected, and Excel is selected from the dropdown menu.":::

1. Select **Open** in the download pop-up window. This experience may vary depending on the browser.

1. In the **Microsoft Excel Security Notice** window, select **Enable**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-excel-security-popup.png" alt-text="In the Microsoft Excel Security Notice pop-up, the Enable button is selected.":::

1. Keep the defaults in the **Import Data** dialog box and select **OK**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-excel-import-data.png" alt-text="In the Import Data dialog box, O K is selected.":::

1. View the data source in Excel.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-connect2.png" alt-text="All the data is shown in the Excel table.":::

### SQL Server Management Studio

In this exercise, you connected to data assets discovered by using Azure Data Catalog. With the Azure Data Catalog portal, you can connect directly by using the client applications integrated into the **Open in** menu. You can also connect with any application you choose by using the connection location information included in the asset metadata. For example, you can use SQL Server Management Studio to connect to Azure SQL Database to access the data in the data assets registered in this tutorial.

1. Open **SQL Server Management Studio**.

1. In the **Connect to Server** dialog box, enter the server name from the **Properties** pane in the Azure Data Catalog portal.

1. Use appropriate authentication and credentials to access the data asset. If you don't have access, use information in the **Request Access** field to get it.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-request-access.png" alt-text="In the Connection Info dialogue box, the Request Access field is highlighted.":::

Select **View Connection Strings** to view and copy ADO.NET, ODBC, and OLEDB connection strings to the clipboard for use in your application.

## Manage data assets

In this step, you see how to set up security for your data assets. Data Catalog doesn't give users access to the data itself. The owner of the data source controls data access.

You can use Data Catalog to discover data sources and to view the metadata related to the sources registered in the catalog. There may be situations, however, where data sources should only be visible to specific users or to members of specific groups. For these scenarios, you can use Data Catalog to take ownership of registered data assets, and control the visibility of the assets you own.

> [!NOTE]
> The management capabilities described in this exercise are available only in the Standard Edition of Azure Data Catalog, not in the Free Edition.
> In Azure Data Catalog, you can take ownership of data assets, add co-owners to data assets, and set the visibility of data assets.

### Take ownership of data assets and restrict visibility

1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com). In the **Search** text box, enter `tags:cycles` and press **ENTER**.

1. Select an item in the result list and select **Take Ownership** on the toolbar.

1. In the **Management** section of the **Properties** panel, select **Take Ownership**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-take-ownership.png" alt-text="The Product item is selected in the result list, and in the Properties tab, in the Management section, the Take Ownership button is highlighted.":::

1. To restrict visibility, choose **Owners & These Users** in the **Visibility** section and select **Add**. Enter user email addresses in the text box and press **ENTER**.

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-ownership.png" alt-text="In the Properties tab, in the Management section, the add button under Owners is selected. Then, under Visibility, the Owners & These Users button is selected. Then the Add button under Visibility is selected.":::

## Remove data assets

In this exercise, you use the Azure Data Catalog portal to remove preview data from registered data assets and delete data assets from the catalog.

In Azure Data Catalog, you can delete an individual asset or delete multiple assets.

1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com).

1. In the **Search** text box, enter `tags:cycles` and select **ENTER**.

1. Select an item in the result list and select **Delete** on the toolbar as shown in the following image:

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-delete-grid-item.png" alt-text="The Product tile is selected from a search result list, and the Delete button is selected in the upper toolbar.":::

   If you're using the list view, the check box is to the left of the item as shown in the following image:

   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-delete-list-item.png" alt-text="In list view, the selection box is to the left of the search result item. The Product asset is selected and the delete button is selected in the upper toolbar.":::

   You can also select multiple data assets and delete them as shown in the following image:

   ![Azure Data Catalog--delete multiple data assets](media/register-data-assets-tutorial/data-catalog-delete-assets.png)
   :::image type="content" source="media/register-data-assets-tutorial/data-catalog-delete-assets.png" alt-text="In list view, multiple assets have been selected, and the delete button is selected in the upper toolbar.":::

> [!NOTE]
> The default behavior of the catalog is to allow any user to register any data source, and to allow any user to delete any data asset that has been registered. The management capabilities included in the Standard Edition of Azure Data Catalog provide additional options for taking ownership of assets, restricting who can discover assets, and restricting who can delete assets.

## Clean up resources

Follow the [Remove data assets](#remove-data-assets) steps to clean up any assets you may have used while following this tutorial.

## Summary

In this tutorial, you explored essential capabilities of Azure Data Catalog, including registering, annotating, discovering, and managing enterprise data assets. Now that you’ve completed the tutorial, it’s time to get started. You can begin today by registering the data sources you and your team rely on, and by inviting colleagues to use the catalog.

## Next steps

> [!div class="nextstepaction"]
> [Supported data sources](data-catalog-dsr.md)
