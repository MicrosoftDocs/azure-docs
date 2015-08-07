<properties
   pageTitle="Azure Data Catalog get started with data catalog"
   description="End-to-end tutorial of the scenarios and capabilities of Azure Data Catalog"
   documentationCenter=""
   services="data-catalog"
   authors="dvana"
   manager="mblythe"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="07/13/2015"
   ms.author="derrickv"/>

# Get started with Azure Data Catalog

This article is an end-to-end tutorial of the scenarios and capabilities of Azure Data Catalog public preview. Once you sign up for the preview, you can follow these steps to create a Data Catalog, and register, annotate, and discover data sources.

## Tutorial prerequisites

Before you begin this tutorial you must have the following:

-	**An Azure subscription** -  If you don't have a subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial](http://azure.microsoft.com/pricing/free-trial/) article for details.
-	**Azure Active Directory** -  Azure Data Catalog uses [Azure Active Directory](http://azure.microsoft.com/services/active-directory/) for identity and access management.
-	**Data sources** - Azure Data Catalog provides capabilities for data source discovery, and to proceed with the tutorial you must have access to one or more data sources. The tutorial is written using the Adventure Works sample databases, but you can use any supported data source if you would prefer to work with data that is familiar and relevant to your role.

## Exercise 1: Install Adventure Works sample database

In this exercise, you install the Adventure Works sample for SQL Server Database Engine, and SQL Server Analysis Services Multidimensional. These samples are used in the exercises that follow.

> [AZURE.NOTE] This exercise is optional. The remaining exercises in the tutorial are written to reference the Adventure Works sample databases, but you can also choose to skip this exercise and work with your own data sources instead. 
Here are the steps to install the Adventure Works.

### Install the Adventure Works 2014 OLTP and Data Warehouse databases

The Adventure Works OLTP database supports standard online transaction processing scenarios for a fictitious bicycle manufacturer (Adventure Works Cycles) including Manufacturing, Sales, and Purchasing. The Adventure Works DW database demonstrates how to build a data warehouse.

The databases are located at http://msftdbprodsamples.codeplex.com/ and can be installed by following the steps in [How to install the Adventure Works 2014 Sample Databases].

In this exercise you installed the Adventure Works sample databases that are used in the remaining exercises. If you chose to skip this exercise and to use your own enterprise data sources, please be prepared to remember names, tags, and other metadata.

## Exercise 2: Registering data sources

In this exercise you will use the Azure Data Catalog registration tool to register your data sources with the catalog. Registration is the process of extracting key structural metadata – such as names, types, and locations – from the data source and the assets it contains, and copying that metadata to the catalog. The data sources and their data remain where they are, but the metadata is used by the catalog to make them more easily discoverable and understandable. 

### Here’s how to register a data source

1.	Log into the Azure Data Catalog portal.

    ![register1][1]

2.	Scroll down, and click **Publish data**.

    ![register2][2]
3.	Click **Launch Application**.
4.	In the **Welcome** page, click **Sign in**, and enter your credentials.
5.	In the **Microsoft Azure Data Catalog** page, click **SQL Server**.

    ![register3][3]
6.	Enter your **Server Name**, and click **CONNECT**.
7.	The next page is where you register the metadata of your data source. In this example, you register **Product** objects from the AdventureWorks Production namespace. Here’s how to do it:
    
    a. In the Hierarchy tree, click **Production**.

    b. Ctrl+click Product, ProductCategory, ProductDescription, and ProductPhoto.

    ![register4][4]

    c. Click the move selected arrow (**>**). This will move all Product objects into the **To be registered** list.

    ![register5][5] 

    d. **Optional**: You can **Include a Preview**, and **Add a data source expert**.

    e. In the **Add tags**, enter description, photo. This will add search tags for these data assets. Tags are a great way to help users find a registered data source.
 
    f. Click **REGISTER**. Azure Data Catalog registers your selected objects. In this exercise, the selected objects from Adventure Works are registered.

    ![register6][6]

    g. To see your registered data source objects, click **View Portal**. In the Azure Data Catalog portal, you can view data source objects in **Tiles** or a **List**.

    ![register7][7]

In this exercise you registered objects from the Adventure Works sample database so that they can easily discovered by users across your organization.
In the next exercise you learn how to discover registered data assets.

## Exercise 3: Discovering Registered Data Assets

In this exercise you will use the Azure Data Catalog portal to discover registered data assets and view their metadata. Azure Data Catalog provides multiple tools for discovering data assets, including simple keyword search, interactive filters, and an advanced search syntax for “power” users.

### Here’s how you discover registered data assets

**Azure Data Catalog** has a simple but powerful search syntax that enables you to easily build queries that return the data the users need. For details about **Azure Data Catalog**, see Search syntax reference. 

**Azure Data Catalog** has the following search options:

- Keyword search
- Filter
- Advanced search

You can also refine what data assets to view. **Azure Data Catalog** has the following view options:

- View properties
- View columns
- View preview

For this example, you will use a keyword search. **Azure Data Catalog** search has several query techniques. This example will use a **Grouping** search query.

**Query Techniques**
<table><tr><td><b>Technique</b></td><td><b>Use</b></td><td><b>Example</b></td></tr><tr><td>Property Scoping</td><td>Only return data sources where the search term is matched in the specified property</td><td>name:product</td></tr><tr><td>Logical Operators</td><td>Broaden or narrow a search using Boolean operations, as described in the Boolean Operators section on this page</td><td>finance NOT corporate</td></tr><tr><td>Grouping with Parenthesis</td><td>Use parentheses to group parts of the query to achieve logical isolation, especially in conjunction with Boolean operators</td><td>name:product AND (tags:illustration OR tags:photo)</td></tr><tr><td>Comparison Operators</td><td>Use comparisons other than equality for properties that have numeric and date data types</td><td>creationTime:&gt;11/05/14</td></tr></table>

In this example, you do a **Grouping** search for data assets where name equals product and tags equal illustration or tags equal photo.

1.	Log into the **Azure Data Catalog** portal.
2.	Click **Discover**.
3.	In **Search** box, enter a **Grouping** query: (tags:description OR tags:photo). 
4.	Click the search icon, or press Enter. **Azure Data Catalog** will display data assets for this search query.
    
    ![search][8]

In this exercise you used the **Azure Data Catalog** portal to discover and view data assets registered with the catalog.

## Exercise 4: Annotating registered data sources

In this exercise you will use the **Azure Data Catalog** portal to annotate data assets that have been previously registered in the catalog. The annotations you provide will supplement and enhance the structural metadata extracted from the data source during registration and will make the data assets even easier to discover and understand. Because each **Data Catalog** user can provide his own annotations, it’s easy for every user with a perspective on the data to share it.

### Here’s how you annotate data assets

1.	Log into the **Azure Data Catalog** portal.
2.	Click **Discover**.
3.	Choose one or more **Data Assets**. In this example, choose **ProductPhoto**, and enter “Product photos for marketing materials.”
4.	Enter a **Description** that will help other discover and understand why and how to use the selected data asset. For example, enter “Product images”. You can also add more tags, and view columns.
5.	Now you can try searching and filtering to discover data assets using the descriptive metadata you’ve added to the catalog.

    ![annotate][9]

In this exercise you added descriptive information to registered data assets so that catalog users can discover data source using terms they understand.

## Exercise 5: Crowdsourcing metadata

In this exercise you will work with another user to add metadata to data assets in the catalog. Azure Data Catalog’s crowdsourced approach to annotations allows any user to add tags, descriptions, and other metadata, so that any user with a perspective on a data asset and its use can have that perspective captured and available to other users.

> [AZURE.NOTE] If you don’t have another user to work with on this tutorial, don’t worry! Any user who accesses the data catalog can add his own perspective when he chooses to do so. This crowdsourcing approach to metadata allows the contents of the catalog and the richness of the catalog’s metadata to grow over time.

### Here’s how you can Crowdsource metadata about data assets

Ask a colleague to repeat the **Annotating Registered Data Sources** exercise above. After your colleague adds a description to a data asset, such as ProductPhoto, you will see multiple annotations.

In this exercise you explored Azure Data Catalog’s capabilities for crowdsourced metadata, where any catalog user can annotate the data assets he discovers.
Exercise: Connecting to Data Sources
In this exercise you will use the **Azure Data Catalog** portal to connect to data sources using Microsoft Excel.

> [AZURE.NOTE] It’s important to remember that **Azure Data Catalog** doesn’t give users access to the actual data source – it simply makes it easier for users to discover and understand them. When users connect to a data source, the client application they choose will use their Windows credentials or will prompt them for credentials as necessary. If the user has not previously been granted access to the data source, he will need to be granted access before he can connect.

### Here’s how to connect to a data source from Excel

1.	Log into the **Azure Data Catalog** portal.
2.	Click **Discover**.
3.	Choose a data asset. In this example, choose ProductCategory.
4.	Choose **Open In** > **Excel**.

    ![connect1][10]
5.	In the **Microsoft Excel Security Notice** window, click **Enable**.
6.	Open the **ProductCategory.odc** file.
7.	The data source is opened in Excel.

    ![connect2][11]

In this exercise you connected to data sources discovered using Azure Data Catalog. The **Azure Data Catalog** portal allows users to connect directly using the client applications integrated into its **Open in…** menu, and allows users to connect using any application they choose using the connection location information included in the asset metadata.

## Exercise 6: Removing data source metadata

In this exercise you will use the **Azure Data Catalog** portal to remove preview data from registered data assets, and to delete data assets from the catalog.

> [AZURE.NOTE] The default behavior of the catalog is to allow any user to register any data source, and to allow any user to delete any data asset that has been registered. The management capabilities included in the **Standard Edition of Azure Data Catalog** provide additional options for taking ownership of assets, restricting who can discover assets, and restricting who can delete assets.

In **Azure Data Catalog**, you can remove preview from delete individual asset or delete multiple assets.

### Here’s how to delete multiple data assets

1.	Log into the **Azure Data Catalog** portal.
2.	Click **Discover**.
3.	Choose one or more data assets.
4.	Click **Delete**.

In this exercise you removed registered data assets from the catalog.

## Exercise 7: Managing registered data sources

In this exercise you will use the management capabilities of the **Azure Data Catalog** to take ownership of data assets and to control what users can discover and manage those assets.

Note: The management capabilities described in this exercise are available only in the Standard Edition of Azure Data Catalog, and not in the Free Edition.
In **Azure Data Catalog**, you can take ownership of data assets, add co-owners to data assets, and set the visibility of data assets.

### Here’s how to take ownership of data assets and restrict visibility

1.	Log into the **Azure Data Catalog** portal.
2.	Click **Discover**.
3.	Choose one or more data assets.
4.	In the **Properties** panel, **Management** section, click **Take Ownership**.
5.	To restrict visibility, click **Owners & These Users**.

    ![ownership][12]

In this exercise you explored the management capabilities of the catalog, and restricted visibility on selected data assets.

## Summary

In this tutorial you explored essential capabilities of the **Azure Data Catalog** preview, including registering, annotating, discovering, and managing enterprise data sources. Now that you’ve completed the tutorial, it’s time to get started. You can begin today by registering the data sources you and your team rely on, and by inviting colleagues to use the catalog. 


<!--Image references-->
[1]: ./media/data-catalog-get-started/register1.png
[2]: ./media/data-catalog-get-started/register2.png
[3]: ./media/data-catalog-get-started/register3.png 
[4]: ./media/data-catalog-get-started/register4.png
[5]: ./media/data-catalog-get-started/register5.png 
[6]: ./media/data-catalog-get-started/register6.png
[7]: ./media/data-catalog-get-started/register7.png
[8]: ./media/data-catalog-get-started/search.png
[9]: ./media/data-catalog-get-started/annotate.png
[10]: ./media/data-catalog-get-started/connect1.png 
[11]: ./media/data-catalog-get-started/connect2.png
[12]: ./media/data-catalog-get-started/ownership.png
