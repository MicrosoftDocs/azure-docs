<properties 
	pageTitle="Create an Azure Search index in the portal" 
	description="Add an index to Azure Search service by filling in field definitions in the management portal" 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""
    tags="azure-portal"/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="04/27/2015" 
	ms.author="heidist"/>

# Create an Azure Search index in the portal

You can quickly prototype an index in Azure Search by creating one in the Azure management portal. Using the portal is great for proof-of-concept testing, but you can also use it to view schema definitions and resource usage for any index deployed to your service.

To complete this task, make sure you have an Azure Search service that's ready to go. See [Create an Azure Search service in the portal](search-create-service-portal.md) if you need help setting it up.

1. Sign in to [Azure portal](https://portal.azure.com).

2. Open the service dashboard of your Azure Search service. Here are a few ways to find the dashboard.
	- In the Jumpbar, click **Home**. The home page has tiles for every service in your subscription. Click on the tile to open the service dashboard.
	- In the Jumpbar, click **Browse** | **Filter by** | **Search services** to find your Search service in the list. 

3. In the service dashboard, you will see a command bar at the top, including one for **Add Index**. 
	
	Check the pricing tier. If you have the free version, you can have up to 3 indexes. You might need to delete one to free up space.

     ![][1]

4. To delete an index, click one to slide open a blade. Click **Delete**.

     ![][2]

5. To create a new index in the portal, click **Add Index** and give it name, such as *hotels*. 

	It can take a minute to create the index, but when it's ready for you to work with, it will appear in the Indexes list.

6. Click *hotels* to open the index definition blade. 

	When you create an index in the portal, a required field (id) is created for you. This is the key field, used to uniquely identify each document. There is only one field per key (no composite keys), and it is always a string.

	If you want to rename the key field, it's important to do this step now, during index creation. You won't be able to rename the field after the index is created.

	![][3]

7. To edit the field name, click the right arrow in the fields list. 

8. Replace *id* with *hotelId*.

9. Click **OK** on each blade (fields and index) to create the index.

##Add fields

In Azure Search, index attributes such as searchable, facetable, and filterable are enabled by default. Typically, when you set these attributes, its usually to turn off search behaviors that don't make sense (for example, sorting or faceting on a description).

The portal is different. In the portal, search behaviors are off by default so that you can select all of the behaviors that apply, on a field by field basis.

1. Click **Add/Edit fields** to add more fields. In this exercise, we'll recreate the *hotels* index mentioned in the article [How to use Fiddler with Azure Search](search-fiddler.md). 

	![][4]

2. Add and configure fields to complete the schema.

	![][5]

	See [Naming rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) and [Supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) for reference information on field names and types.

3. Click **Save** at the top of the page.

  	![][6]

##Next steps

Although the index is defined, it won't be ready to use until you load documents. To do this easily, continue on with [How to use Fiddler with Azure Search](search-fiddler.md), at **Load Documents**. You can then follow the remaining steps in that article to run some queries.

Once you are comfortable with the basic index, consider adding a language analyzer or suggester to add multilanguage support or type-ahead suggestions. Both features are specified in the index schema. See [Language Support](https://msdn.microsoft.com/elibrary/azure/dn879793.aspx) and [Create Index](https://msdn.microsoft.com/library/azure/dn798941.aspx) for more information.

<!--Image references-->
[1]: ./media/search-create-index-portal/AzureSearch-PortalIndex-1.PNG
[2]: ./media/search-create-index-portal/AzureSearch-PortalIndex-2.PNG
[3]: ./media/search-create-index-portal/AzureSearch-PortalIndex-3.PNG
[4]: ./media/search-create-index-portal/AzureSearch-PortalIndex-4.PNG
[5]: ./media/search-create-index-portal/AzureSearch-PortalIndex-5.PNG
[6]: ./media/search-create-index-portal/AzureSearch-PortalIndex-6.PNG