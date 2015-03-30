<properties 
	pageTitle="Get started with Azure Search in Java" 
	description="Walk through building a custom Azure Search application using Java as your programming language." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="na" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="03/30/2015" 
	ms.author="heidist"/>

#Get started with Azure Search in Java#

Learn how to build a custom Java search application that uses Azure Search for its search experience. The tutorial utilizes the [Azure Search Service REST API](https://msdn.microsoft.com/library/dn798935.aspx) to construct the objects and operations used in this exercise.

We used the following software to build and test this sample:

- [Eclipse IDE for Java EE Developers](https://eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/lunar). Be sure to download the EE version.

- [JDK 8u40](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

- [Apache Tomcat 8.0](http://tomcat.apache.org/download-80.cgi)

To run this sample, you must also have an Azure Search service, which you can sign up for in the [Azure management portal](https://portal.azure.com). 

> [AZURE.TIP] Download the source code for this tutorial at [Azure Search Java demo](http://go.microsoft.com/fwlink/p/?LinkId=530197). 

##About the data##

This sample application uses data from the [United States Geological Services (USGS)](http://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Rhode Island to reduce the dataset size. We'll use this data to build a search application that returns landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

In this application, the **SearchServlet.java** program builds and loads the index using an [Indexer](https://msdn.microsoft.com/library/azure/dn798918.aspx) construct, retrieving the filtered USGS dataset from a public Azure SQL Database. Credentials and connection  information to the online data source is provided in the program code. No further configuration is necessary.

> [AZURE.NOTE] We applied a filter on this dataset to stay under the 10,000 document limit of the free pricing tier. If you use the standard tier, this limit does not apply. For details about capacity for each pricing tier, see [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx).

##Create the service##

1. Sign in to [Azure management portal](https://portal.azure.com).

2. In the Jumpbar, click **New** | **Data + storage** | **Search**.
 
     ![][1]

3. Configure the service name, pricing tier, resource group, subscription and location. These settings are required and cannot be changed once the service is provisioned.

     ![][2]

	- **Service name** must be unique, lower-case, under 15 characters, with no spaces. This name becomes part of the endpoint of your Azure Search service. See [Naming Rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) for more information about naming conventions. 
	
	- **Pricing Tier** determines capacity and billing. Both tiers provide the same features, but at different resource levels. 
	
		- **Free**  runs on clusters that are shared with other subscribers. It offers enough capacity to try out tutorials and write proof-of-concept code, but is not intended for production applications. Deploying a free service typically only takes a few minutes.
		- **Standard** runs on dedicated resources and is highly scalable. Initially, a standard service is provisioned with one replica and one partition, but you can adjust capacity once the service is created. Deploying a standard service takes longer, usually about fifteen minutes.
	
	- **Resource Groups** are containers for services and resources used for a common purpose. For example, if you're building a custom search application based on Azure Search, Azure Websites, Azure BLOB storage, you could create a resource group that keeps these services together in the portal management pages.
	
	- **Subscription** allows you to choose among multiple subscriptions, if you have more than one subscription.
	
	- **Location** is the data center region. Currently, all resources must run in the same data center. Distributing resources across multiple data centers is not supported.

4. Click **Create** to provision the service. 

Watch for notifications in the Jumpbar. A notice will appear when the service is ready to use.

<a id="sub-2"></a>
##Find the service name and api-key of your Azure Search service

After the service is created, you can return to the portal to get the URL or `api-key`. Connections to your Search service requires that you have both the URL and an `api-key` to authenticate the call. 

1. In the Jumpbar, click **Home** and then click the Search service to open the service dashboard. 

2. On the service dashboard, you'll see tiles for essential information, as well as the key icon for accessing the admin keys.

  	![][3]

3. Copy the service URL and an admin key. You will need them later, when you add them to the web.xml file.

##Download the sample files

1. Go to [AzureSearchJavaDemo](http://go.microsoft.com/fwlink/p/?LinkId=530197) on Github.
2. Click **Download ZIP**, save the .zip file, and then extract all the files it contains.

The sample files are read-only by default. Right-click the folder open the properties page and clear the read-only attribute.

All subsequent file modifications and run statements will be made against files in this folder.  

##Import and build the project

1. In Eclipse, choose **File** | **Import** | **General** | **Existing Projects into Workspace**.

    ![][4]

2. In **Select root directory**, browse to the folder containing sample files. Select the folder that contains the .project folder. The project should appear in the **Projects** list as a selected item.

3. Click **Finish**.

4. Open **Project Explorer**. Click **Window** | **Show View** | **Project Explorer** or use the shortcut.

5. Double-click **config.properties** to edit the configuration settings containing the server name and api-key. The admin api-key replaces "SearchServiceApiKey". Service name (the first component of the URL http://<servicename>.search.windows.net) replaces "SearchServiceName". Both values can be obtained from the [Azure management portal](https://portal.azure.com).

    ![][5]

6. In Project Explorer, right-click the project name and choose **Run As** | **Maven clean** to build the project.

    ![][6]

Status messages are output to the console window. You should see BUILD SUCCESS indicating the project built without errors.

##Run the app

In this last step, you will run the application in a local server runtime environment. If you haven't yet specified a server runtime environment in Eclipse, you'll need to do that first.

1. In Eclipse, click **Window** | **Preferences** | **Server** | **Runtime Environments** | **Add**.

2. You should see **Apache** in the list of runtime environments. Expand **Apache** and choose **Apache Tomcat v7.0**. 

3. Click **Finish**. You should see Apache Tomcat in the server runtime environments list.

	![][7]

4. In Project Explorer, expand **WebContent**.

5. Right-click **Search.jsp** | **Run As** | **Run on Server**. Select the Apache Tomcat server, and then click **Run**.

##Search on USGS data

The USGS data set includes records that are relevant to the state of Rhode Island. If you click **Search** on an empty search box, you will get the top 50 entries, which is the default. 

Entering a search term will give the search engine something to go on. Try entering a regional name. "Roger Williams" was the first governor of Rhode Island. Numerous parks, buildings, and schools are named after him.

![][9]

You could also try any of these terms:

- Pawtucket
- Pembroke
- goose +cape

##Next steps

This is the first Azure Search tutorial based on Java and the USGS dataset. Over time, we'll be extending this tutorial to demonstrate additional search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](http://azure.microsoft.com/documentation/services/search/) to find more resources. You can also view the links in our [Video and Tutorial list](https://msdn.microsoft.com/library/azure/dn798933.aspx) to access more information.

<!--Image references-->
[1]: ./media/search-get-started-java/create-search-portal-1.PNG
[2]: ./media/search-get-started-java/create-search-portal-2.PNG
[3]: ./media/search-get-started-java/create-search-portal-3.PNG
[4]: ./media/search-get-started-java/AzSearch-Java-Import.png
[5]: ./media/search-get-started-java/AzSearch-Java-config.png
[6]: ./media/search-get-started-java/AzSearch-Java-build.png
[7]: ./media/search-get-started-java/AzSearch-Java-runtime.png
[9]: ./media/search-get-started-dotnet/rogerwilliamsschool.png
