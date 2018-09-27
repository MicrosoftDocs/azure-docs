---
title: Get started with Azure Data Catalog
description: End-to-end tutorial presenting the scenarios and capabilities of Azure Data Catalog.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: 03332872-8d84-44a0-8a78-04fd30e14b18
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018

---
# Get started with Azure Data Catalog
Azure Data Catalog is a fully managed cloud service that serves as a system of registration and system of discovery for enterprise data assets. For a detailed overview, see [What is Azure Data Catalog](data-catalog-what-is-data-catalog.md).

This tutorial helps you get started with Azure Data Catalog. You perform the following procedures in this tutorial:

| Procedure | Description |
|:--- |:--- |
| [Provision data catalog](#provision-data-catalog) |In this procedure, you provision or set up Azure Data Catalog. You do this step only if the catalog has not been set up before. You can have only one data catalog per organization (Microsoft Azure Active Directory domain) even though there are multiple subscriptions associated with your Azure account. |
| [Register data assets](#register-data-assets) |In this procedure, you register data assets from the AdventureWorks2014 sample database with the data catalog. Registration is the process of extracting key structural metadata such as names, types, and locations from the data source and copying that metadata to the catalog. The data source and data assets remain where they are, but the metadata is used by the catalog to make them more easily discoverable and understandable. |
| [Discover data assets](#discover-data-assets) |In this procedure, you use the Azure Data Catalog portal to discover data assets that were registered in the previous step. After a data source has been registered with Azure Data Catalog, its metadata is indexed by the service so that users can easily search for the data they need. |
| [Annotate data assets](#annotate-data-assets) |In this procedure, you provide annotations (information such as descriptions, tags, documentation, or experts) for the data assets. This information supplements the metadata extracted from the data source, and to make the data source more understandable to more people. |
| [Connect to data assets](#connect-to-data-assets) |In this procedure, you open data assets in integrated client tools (such as Excel and SQL Server Data Tools) and a non-integrated tool (SQL Server Management Studio). |
| [Manage data assets](#manage-data-assets) |In this procedure, you set up security for your data assets. Data Catalog does not give users access to the data itself. The owner of the data source controls data access. <br/><br/> With Data Catalog, you can discover data sources and view the **metadata** related to the sources registered in the catalog. There may be situations, however, where data sources should be visible only to specific users or to members of specific groups. For these scenarios, you can use Data Catalog to take ownership of registered data assets within the catalog and control the visibility of the assets you own. |
| [Remove data assets](#remove-data-assets) |In this procedure, you learn how to remove data assets from the data catalog. |

## Tutorial prerequisites
### Azure subscription
To set up Azure Data Catalog, you must be the owner or co-owner of an Azure subscription.

Azure subscriptions help you organize access to cloud service resources like Azure Data Catalog. They also help you control how resource usage is reported, billed, and paid for. Each subscription can have a different billing and payment setup, so you can have different subscriptions and different plans by department, project, regional office, and so on. Every cloud service belongs to a subscription, and you need to have a subscription before setting up Azure Data Catalog. To learn more, see [Manage accounts, subscriptions, and administrative roles](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

If you don't have a subscription, you can create a free trial account in just a couple of minutes. See [Free Trial](https://azure.microsoft.com/pricing/free-trial/) for details.

### Azure Active Directory
To set up Azure Data Catalog, you must be signed in with an Azure Active Directory (Azure AD) user account. You must be the owner or co-owner of an Azure subscription.  

Azure AD provides an easy way for your business to manage identity and access, both in the cloud and on-premises. You can use a single work or school account to sign in to any cloud or on-premises web application. Azure Data Catalog uses Azure AD to authenticate sign-in. To learn more, see [What is Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md).

### Azure Active Directory policy configuration
You may encounter a situation where you can sign in to the Azure Data Catalog portal, but when you attempt to sign in to the data source registration tool, you encounter an error message that prevents you from signing in. This error may occur when you are on the company network or when you are connecting from outside the company network.

The registration tool uses *forms authentication* to validate user sign-ins against Azure Active Directory. For successful sign-in, an Azure Active Directory administrator must enable forms authentication in the *global authentication policy*.

With the global authentication policy, you can enable authentication separately for intranet and extranet connections, as shown in the following image. Sign-in errors may occur if forms authentication is not enabled for the network from which you're connecting.

 ![Azure Active Directory global authentication policy](./media/data-catalog-prerequisites/global-auth-policy.png)

For more information, see [Configuring authentication policies](https://technet.microsoft.com/library/dn486781.aspx).

## Provision data catalog
You can provision only one data catalog per organization (Azure Active Directory domain). Therefore, if the owner or co-owner of an Azure subscription who belongs to this Azure Active Directory domain has already created a catalog, you will not be able to create a catalog again even if you have multiple Azure subscriptions. To test whether a data catalog has been created by a user in your Azure Active Directory domain, go to the [Azure Data Catalog home page](http://azuredatacatalog.com) and verify whether you see the catalog. If a catalog has already been created for you, skip the following procedure and go to the next section.    

1. Go to the [Data Catalog service page](https://azure.microsoft.com/services/data-catalog) and click **Get started**.
   
    ![Azure Data Catalog--marketing landing page](media/data-catalog-get-started/data-catalog-marketing-landing-page.png)
2. Sign in with a user account that is the owner or co-owner of an Azure subscription. You see the following page after signing in.
   
    ![Azure Data Catalog--provision data catalog](media/data-catalog-get-started/data-catalog-create-azure-data-catalog.png)
3. Specify a **name** for the data catalog, the **subscription** you want to use, and the **location** for the catalog.
4. Expand **Pricing** and select an Azure Data Catalog **edition** (Free or Standard).
    ![Azure Data Catalog--select edition](media/data-catalog-get-started/data-catalog-create-catalog-select-edition.png)
5. Expand **Catalog Users** and click **Add** to add users for the data catalog. You are automatically added to this group.
    ![Azure Data Catalog--users](media/data-catalog-get-started/data-catalog-add-catalog-user.png)
6. Expand **Catalog Administrators** and click **Add** to add additional administrators for the data catalog. You are automatically added to this group.
    ![Azure Data Catalog--administrators](media/data-catalog-get-started/data-catalog-add-catalog-admins.png)
7. Click **Create Catalog** to create the data catalog for your organization. You see the home page for the data catalog after it is created.
    ![Azure Data Catalog--created](media/data-catalog-get-started/data-catalog-created.png)    

### Find a data catalog in the Azure portal
1. On a separate tab in the web browser or in a separate web browser window, go to the [Azure portal](https://portal.azure.com) and sign in with the same account that you used to create the data catalog in the previous step.
2. Select **Browse** and then click **Data Catalog**.
   
    ![Azure Data Catalog--browse Azure](media/data-catalog-get-started/data-catalog-browse-azure-portal.png)
   You see the data catalog you created.
   
    ![Azure Data Catalog--view catalog in list](media/data-catalog-get-started/data-catalog-azure-portal-show-catalog.png)
3. Click the catalog that you created. You see the **Data Catalog** blade in the portal.
   
   ![Azure Data Catalog--blade in portal ](media/data-catalog-get-started/data-catalog-blade-azure-portal.png)
4. You can view properties of the data catalog and update them. For example, click **Pricing tier** and change the edition.
   
    ![Azure Data Catalog--pricing tier](media/data-catalog-get-started/data-catalog-change-pricing-tier.png)

### Adventure Works sample database
In this tutorial, you register data assets (tables) from the AdventureWorks2014 sample database for the SQL Server Database Engine, but you can use any supported data source if you would prefer to work with data that is familiar and relevant to your role. For a list of supported data sources, see [Supported data sources](data-catalog-dsr.md).

### Install the Adventure Works 2014 OLTP database
The Adventure Works database supports standard online transaction-processing scenarios for a fictitious bicycle manufacturer (Adventure Works Cycles), which includes products, sales, and purchasing. In this tutorial, you register information about products into Azure Data Catalog.

To install the Adventure Works sample database:

1. Download [Adventure Works 2014 Full Database Backup.zip](https://msftdbprodsamples.codeplex.com/downloads/get/880661) on CodePlex.
2. To restore the database on your machine, follow the instructions in [Restore a Database Backup by using SQL Server Management Studio](http://msdn.microsoft.com/library/ms177429.aspx), or by following these steps:
   1. Open SQL Server Management Studio and connect to the SQL Server Database Engine.
   2. Right-click **Databases** and click **Restore Database**.
   3. Under **Restore Database**, click the **Device** option for **Source** and click **Browse**.
   4. Under **Select backup devices**, click **Add**.
   5. Go to the folder where you have the **AdventureWorks2014.bak** file, select the file, and click **OK** to close the **Locate Backup File** dialog box.
   6. Click **OK** to close the **Select backup devices** dialog box.    
   7. Click **OK** to close the **Restore Database** dialog box.

You can now register data assets from the Adventure Works sample database by using Azure Data Catalog.

## Register data assets
In this exercise, you use the registration tool to register data assets from the Adventure Works database with the catalog. Registration is the process of extracting key structural metadata such as names, types, and locations from the data source and the assets it contains, and copying that metadata to the catalog. The data source and data assets remain where they are, but the metadata is used by the catalog to make them more easily discoverable and understandable.

### Register a data source
1. Go to the [Azure Data Catalog home page](http://azuredatacatalog.com) and click **Publish Data**.
   
   ![Azure Data Catalog--Publish Data button](media/data-catalog-get-started/data-catalog-publish-data.png)
2. Click **Launch Application** to download, install, and run the registration tool on your computer.
   
   ![Azure Data Catalog--Launch button](media/data-catalog-get-started/data-catalog-launch-application.png)
3. On the **Welcome** page, click **Sign in** and enter your credentials.     
   
    ![Azure Data Catalog--Welcome page](media/data-catalog-get-started/data-catalog-welcome-dialog.png)
4. On the **Microsoft Azure Data Catalog** page, click **SQL Server** and **Next**.
   
    ![Azure Data Catalog--data sources](media/data-catalog-get-started/data-catalog-data-sources.png)
5. Enter the SQL Server connection properties for **AdventureWorks2014** (see the following example) and click **CONNECT**.
   
   ![Azure Data Catalog--SQL Server connection settings](media/data-catalog-get-started/data-catalog-sql-server-connection.png)
6. Register the metadata of your data asset. In this example, you register **Production/Product** objects from the AdventureWorks Production namespace:
   
   1. In the **Server Hierarchy** tree, expand **AdventureWorks2014** and click **Production**.
   2. Select **Product**, **ProductCategory**, **ProductDescription**, and **ProductPhoto** by using Ctrl+click.
   3. Click the **move selected arrow** (**>**). This action moves all selected objects into the **Objects to be registered** list.
      
      ![Azure Data Catalog tutorial--browse and select objects](media/data-catalog-get-started/data-catalog-server-hierarchy.png)
   4. Select **Include a Preview** to include a snapshot preview of the data. The snapshot includes up to 20 records from each table, and it is copied into the catalog.
   5. Select **Include Data Profile** to include a snapshot of the object statistics for the data profile (for example: minimum, maximum, and average values for a column, number of rows).
   6. In the **Add tags** field, enter **adventure works, cycles**. This action adds search tags for these data assets. Tags are a great way to help users find a registered data source.
   7. Specify the name of an **expert** on this data (optional).
      
      ![Azure Data Catalog tutorial--objects to be registered](media/data-catalog-get-started/data-catalog-objects-register.png)
   8. Click **REGISTER**. Azure Data Catalog registers your selected objects. In this exercise, the selected objects from Adventure Works are registered. The registration tool extracts metadata from the data asset and copies that data into the Azure Data Catalog service. The data remains where it currently resides, and it remains under the control of the administrators and policies of the current system.
      
      ![Azure Data Catalog--registered objects](media/data-catalog-get-started/data-catalog-registered-objects.png)
   9. To see your registered data source objects, click **View Portal**. In the Azure Data Catalog portal, confirm that you see all four tables and the database in the grid view.
      
      ![Objects in the Azure Data Catalog portal ](media/data-catalog-get-started/data-catalog-view-portal.png)

In this exercise, you registered objects from the Adventure Works sample database so that they can be easily discovered by users across your organization. In the next exercise, you learn how to discover registered data assets.

## Discover data assets
Discovery in Azure Data Catalog uses two primary mechanisms: searching and filtering.

Searching is designed to be both intuitive and powerful. By default, search terms are matched against any property in the catalog, including user-provided annotations.

Filtering is designed to complement searching. You can select specific characteristics such as experts, data source type, object type, and tags to view matching data assets and to constrain search results to matching assets.

By using a combination of searching and filtering, you can quickly navigate the data sources that have been registered with Azure Data Catalog to discover the data assets you need.

In this exercise, you use the Azure Data Catalog portal to discover data assets you registered in the previous exercise. See [Data Catalog Search syntax reference](https://msdn.microsoft.com/library/azure/mt267594.aspx) for details about search syntax.

Following are a few examples for discovering data assets in the catalog.  

### Discover data assets with basic search
Basic search helps you search a catalog by using one or more search terms. Results are any assets that match on any property with one or more of the terms specified.

1. Click **Home** in the Azure Data Catalog portal. If you have closed the web browser, go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com).
2. In the search box, enter `cycles` and press **ENTER**.
   
    ![Azure Data Catalog--basic text search](media/data-catalog-get-started/data-catalog-basic-text-search.png)
3. Confirm that you see all four tables and the database (AdventureWorks2014) in the results. You can switch between **grid view** and **list view** by clicking buttons on the toolbar as shown in the following image. Notice that the search keyword is highlighted in the search results because the **Highlight** option is **ON**. You can also specify the number of **results per page** in search results.
   
    ![Azure Data Catalog--basic text search results](media/data-catalog-get-started/data-catalog-basic-text-search-results.png)
   
    The **Searches** panel is on the left and the **Properties** panel is on the right. On the **Searches** panel, you can change search criteria and filter results. The **Properties** panel displays properties of a selected object in the grid or list.
4. Click **Product** in the search results. Click the **Preview**, **Columns**, **Data Profile**, and **Documentation** tabs, or click the arrow to expand the bottom pane.  
   
    ![Azure Data Catalog--bottom pane](media/data-catalog-get-started/data-catalog-data-asset-preview.png)
   
    On the **Preview** tab, you see a preview of the data in the **Product** table.  
5. Click the **Columns** tab to find details about columns (such as **name** and **data type**) in the data asset.
6. Click the **Data Profile** tab to see the profiling of data (for example: number of rows, size of data, or minimum value in a column) in the data asset.
7. Filter the results by using **Filters** on the left. For example, click **Table** for **Object Type**, and you see only the four tables, not the database.
   
    ![Azure Data Catalog--filter search results](media/data-catalog-get-started/data-catalog-filter-search-results.png)

### Discover data assets with property scoping
Property scoping helps you discover data assets where the search term is matched with the specified property.

1. Clear the **Table** filter under **Object Type** in **Filters**.  
2. In the search box, enter `tags:cycles` and press **ENTER**. See [Data Catalog Search syntax reference](https://msdn.microsoft.com/library/azure/mt267594.aspx) for all the properties you can use for searching the data catalog.
3. Confirm that you see all four tables and the database (AdventureWorks2014) in the results.  
   
    ![Data Catalog--property scoping search results](media/data-catalog-get-started/data-catalog-property-scoping-results.png)

### Save the search
1. In the **Searches** pane in the **Current Search** section, enter a name for the search and click **Save**.
   
    ![Azure Data Catalog--save search](media/data-catalog-get-started/data-catalog-save-search.png)
2. Confirm that the saved search shows up under **Saved Searches**.
   
    ![Azure Data Catalog--saved searches](media/data-catalog-get-started/data-catalog-saved-search.png)
3. Select one of the actions you can take on the saved search (**Rename**, **Delete**, **Save As Default** search).
   
    ![Azure Data Catalog--saved search options](media/data-catalog-get-started/data-catalog-saved-search-options.png)

### Boolean operators
You can broaden or narrow your search with Boolean operators.

1. In the search box, enter `tags:cycles AND objectType:table`, and press **ENTER**.
2. Confirm that you see only tables (not the database) in the results.  
   
    ![Azure Data Catalog--Boolean operator in search](media/data-catalog-get-started/data-catalog-search-boolean-operator.png)

### Grouping with parentheses
By grouping with parentheses, you can group parts of the query to achieve logical isolation, especially along with Boolean operators.

1. In the search box, enter `name:product AND (tags:cycles AND objectType:table)` and press **ENTER**.
2. Confirm that you see only the **Product** table in the search results.
   
    ![Azure Data Catalog--grouping search](media/data-catalog-get-started/data-catalog-grouping-search.png)   

### Comparison operators
With comparison operators, you can use comparisons other than equality for properties that have numeric and date data types.

1. In the search box, enter `lastRegisteredTime:>"06/09/2016"`.
2. Clear the **Table** filter under **Object Type**.
3. Press **ENTER**.
4. Confirm that you see the **Product**, **ProductCategory**, **ProductDescription**, and **ProductPhoto** tables and the AdventureWorks2014 database you registered in search results.
   
    ![Azure Data Catalog--comparison search results](media/data-catalog-get-started/data-catalog-comparison-operator-results.png)

See [How to discover data assets](data-catalog-how-to-discover.md) for detailed information about discovering data assets and [Data Catalog Search syntax reference](https://msdn.microsoft.com/library/azure/mt267594.aspx) for search syntax.

## Annotate data assets
In this exercise, you use the Azure Data Catalog portal to annotate (add information such as descriptions, tags, or experts) data assets you have previously registered in the catalog. The annotations supplement and enhance the structural metadata extracted from the data source during registration and makes the data assets much easier to discover and understand.

In this exercise, you annotate a single data asset (ProductPhoto). You add a friendly name and description to the ProductPhoto data asset.  

1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com) and search with `tags:cycles` to find the data assets you have registered.  
2. Click **ProductPhoto** in search results.  
3. Enter **Product images** for **Friendly Name** and **Product photos for marketing materials** for the **Description**.
   
    ![Azure Data Catalog--ProductPhoto description](media/data-catalog-get-started/data-catalog-productphoto-description.png)
   
    The **Description** helps others discover and understand why and how to use the selected data asset. You can also add more tags and view columns. Now you can try searching and filtering to discover data assets by using the descriptive metadata you’ve added to the catalog.

You can also do the following on this page:

* Add experts for the data asset. Click **Add** in the **Experts** area.
* Add tags at the dataset level. Click **Add** in the **Tags** area. A tag can be a user tag or a glossary tag. The Standard Edition of Data Catalog includes a business glossary that helps catalog administrators define a central business taxonomy. Catalog users can then annotate data assets with glossary terms. For more information, see [How to set up the Business Glossary for Governed Tagging](data-catalog-how-to-business-glossary.md)
* Add tags at the column level. Click **Add** under **Tags** for the column you want to annotate.
* Add description at the column level. Enter **Description** for a column. You can also view the description metadata extracted from the data source.
* Add **Request access** information that shows users how to request access to the data asset.
  
    ![Azure Data Catalog--add tags, descriptions](media/data-catalog-get-started/data-catalog-add-tags-experts-descriptions.png)
* Choose the **Documentation** tab and provide documentation for the data asset. With Azure Data Catalog documentation, you can use your data catalog as a content repository to create a complete narrative of your data assets.
  
    ![Azure Data Catalog--Documentation tab](media/data-catalog-get-started/data-catalog-documentation.png)

You can also add an annotation to multiple data assets. For example, you can select all the data assets you registered and specify an expert for them.

![Azure Data Catalog--annotate multiple data assets](media/data-catalog-get-started/data-catalog-multi-select-annotate.png)

Azure Data Catalog supports a crowd-sourcing approach to annotations. Any Data Catalog user can add tags (user or glossary), descriptions, and other metadata, so that any user with a perspective on a data asset and its use can have that perspective captured and available to other users.

See [How to annotate data assets](data-catalog-how-to-annotate.md) for detailed information about annotating data assets.

## Connect to data assets
In this exercise, you open data assets in an integrated client tool (Excel) and a non-integrated tool (SQL Server Management Studio) by using connection information.

> [!NOTE]
> It’s important to remember that Azure Data Catalog doesn’t give you access to the actual data source—it simply makes it easier for you to discover and understand it. When you connect to a data source, the client application you choose uses your Windows credentials or prompts you for credentials as necessary. If you have not previously been granted access to the data source, you need to be granted access before you can connect.
> 
> 

### Connect to a data asset from Excel
1. Select **Product** from search results. Click **Open In** on the toolbar and click **Excel**.
   
    ![Azure Data Catalog--connect to data asset](media/data-catalog-get-started/data-catalog-connect1.png)
2. Click **Open** in the download pop-up window. This experience may vary depending on the browser.
   
    ![Azure Data Catalog--downloaded Excel connection file](media/data-catalog-get-started/data-catalog-download-open.png)
3. In the **Microsoft Excel Security Notice** window, click **Enable**.
   
    ![Azure Data Catalog--Excel security popup](media/data-catalog-get-started/data-catalog-excel-security-popup.png)
4. Keep the defaults in the **Import Data** dialog box and click **OK**.
   
    ![Azure Data Catalog--Excel import data](media/data-catalog-get-started/data-catalog-excel-import-data.png)
5. View the data source in Excel.
   
    ![Azure Data Catalog--product table in Excel](media/data-catalog-get-started/data-catalog-connect2.png)

In this exercise, you connected to data assets discovered by using Azure Data Catalog. With the Azure Data Catalog portal, you can connect directly by using the client applications integrated into the **Open in** menu. You can also connect with any application you choose by using the connection location information included in the asset metadata. For example, you can use SQL Server Management Studio to connect to the AdventureWorks2014 database to access the data in the data assets registered in this tutorial.

1. Open **SQL Server Management Studio**.
2. In the **Connect to Server** dialog box, enter the server name from the **Properties** pane in the Azure Data Catalog portal.
3. Use appropriate authentication and credentials to access the data asset. If you don't have access, use information in the **Request Access** field to get it.
   
    ![Azure Data Catalog--request access](media/data-catalog-get-started/data-catalog-request-access.png)

Click **View Connection Strings** to view and copy ADF.NET, ODBC, and OLEDB connection strings to the clipboard for use in your application.

## Manage data assets
In this step, you see how to set up security for your data assets. Data Catalog does not give users access to the data itself. The owner of the data source controls data access.

You can use Data Catalog to discover data sources and to view the metadata related to the sources registered in the catalog. There may be situations, however, where data sources should only be visible to specific users or to members of specific groups. For these scenarios, you can use Data Catalog to take ownership of registered data assets within the catalog, and to then control the visibility of the assets you own.

> [!NOTE]
> The management capabilities described in this exercise are available only in the Standard Edition of Azure Data Catalog, not in the Free Edition.
> In Azure Data Catalog, you can take ownership of data assets, add co-owners to data assets, and set the visibility of data assets.
> 
> 

### Take ownership of data assets and restrict visibility
1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com). In the **Search** text box, enter `tags:cycles` and press **ENTER**.
2. Click an item in the result list and click **Take Ownership** on the toolbar.
3. In the **Management** section of the **Properties** panel, click **Take Ownership**.
   
    ![Azure Data Catalog--take ownership](media/data-catalog-get-started/data-catalog-take-ownership.png)
4. To restrict visibility, choose **Owners & These Users** in the **Visibility** section and click **Add**. Enter user email addresses in the text box and press **ENTER**.
   
    ![Azure Data Catalog--restrict access](media/data-catalog-get-started/data-catalog-ownership.png)

## Remove data assets
In this exercise, you use the Azure Data Catalog portal to remove preview data from registered data assets and delete data assets from the catalog.

In Azure Data Catalog, you can delete an individual asset or delete multiple assets.

1. Go to the [Azure Data Catalog home page](https://www.azuredatacatalog.com).
2. In the **Search** text box, enter `tags:cycles` and click **ENTER**.
3. Select an item in the result list and click **Delete** on the toolbar as shown in the following image:
   
    ![Azure Data Catalog--delete grid item](media/data-catalog-get-started/data-catalog-delete-grid-item.png)
   
    If you are using the list view, the check box is to the left of the item as shown in the following image:
   
    ![Azure Data Catalog--delete list item](media/data-catalog-get-started/data-catalog-delete-list-item.png)
   
    You can also select multiple data assets and delete them as shown in the following image:
   
    ![Azure Data Catalog--delete multiple data assets](media/data-catalog-get-started/data-catalog-delete-assets.png)

> [!NOTE]
> The default behavior of the catalog is to allow any user to register any data source, and to allow any user to delete any data asset that has been registered. The management capabilities included in the Standard Edition of Azure Data Catalog provide additional options for taking ownership of assets, restricting who can discover assets, and restricting who can delete assets.
> 
> 

## Summary
In this tutorial, you explored essential capabilities of Azure Data Catalog, including registering, annotating, discovering, and managing enterprise data assets. Now that you’ve completed the tutorial, it’s time to get started. You can begin today by registering the data sources you and your team rely on, and by inviting colleagues to use the catalog.

## References
* [How to register data assets](data-catalog-how-to-register.md)
* [How to discover data assets](data-catalog-how-to-discover.md)
* [How to annotate data assets](data-catalog-how-to-annotate.md)
* [How to document data assets](data-catalog-how-to-documentation.md)
* [How to connect to data assets](data-catalog-how-to-connect.md)
* [How to manage data assets](data-catalog-how-to-manage.md)

