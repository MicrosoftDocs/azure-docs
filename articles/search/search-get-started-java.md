---
title: Get started with Azure Search in Java | Microsoft Docs
description: How to build a hosted cloud search application on Azure using Java as your programming language.
services: search
author: jj09
manager: jlembicz
ms.service: search
ms.topic: conceptual
ms.date: 08/26/2018
ms.author: jjed

---
# Get started with Azure Search in Java
> [!div class="op_single_selector"]
> * [Portal](search-get-started-portal.md)
> * [.NET](search-howto-dotnet-sdk.md)
> 
> 

Learn how to build a custom Java search application that uses Azure Search for its search experience. This tutorial uses the [Azure Search Service REST API](https://msdn.microsoft.com/library/dn798935.aspx) to construct the objects and operations used in this exercise.

To run this sample, you must have an Azure Search service, which you can sign up for in the [Azure Portal](https://portal.azure.com). See [Create an Azure Search service in the portal](search-create-service-portal.md) for step-by-step instructions.

We used the following software to build and test this sample:

* [Eclipse IDE for Java EE Developers](https://www.eclipse.org/downloads/packages/release/photon/r/eclipse-ide-java-ee-developers). Be sure to download the EE version. One of the verification steps requires a feature that is found only in this edition.
* [JDK 8u181](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Apache Tomcat 8.5.33](https://tomcat.apache.org/download-80.cgi#8.5.33)

## About the data
This sample application uses data from the [United States Geological Services (USGS)](http://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Rhode Island to reduce the dataset size. We'll use this data to build a search application that returns landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

In this application, the **SearchServlet.java** program builds and loads the index using an [Indexer](https://msdn.microsoft.com/library/azure/dn798918.aspx) construct, retrieving the filtered USGS dataset from a public Azure SQL Database. Predefined credentials and connection  information to the online data source are provided in the program code. In terms of data access, no further configuration is necessary.

> [!NOTE]
> We applied a filter on this dataset to stay under the 10,000 document limit of the free pricing tier. If you use the standard tier, this limit does not apply, and you can modify this code to use a bigger dataset. For details about capacity for each pricing tier, see [Limits and constraints](search-limits-quotas-capacity.md).
> 
> 

## About the program files
The following list describes the files that are relevant to this sample.

* Search.jsp: Provides the user interface
* SearchServlet.java: Provides methods (similar to a controller in MVC)
* SearchServiceClient.java: Handles HTTP requests
* SearchServiceHelper.java: A helper class that provides static methods
* Document.java: Provides the data model
* config.properties: Sets the Search service URL and api-key
* pom.xml: A Maven dependency

<a id="sub-2"></a>

## Find the service name and api-key of your Azure Search service
All REST API calls into Azure Search require that you provide the service URL and an api-key. 

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. In the jump bar, click **Search service** to list all of the Azure Search services provisioned for your subscription.
3. Select the service you want to use.
4. On the service dashboard, you'll see tiles for essential information as well as the key icon for accessing the admin keys.
   
      ![][3]
5. Copy the service URL and an admin key. You will need them later, when you add them to the **config.properties** file.

## Download the sample files
1. Go to [search-java-indexer-demo](https://github.com/Azure-Samples/search-java-indexer-demo) on GitHub.
2. Click **Download ZIP**, save the .zip file to disk, and then extract all the files it contains. Consider extracting the files into your Java workspace to make it easier to find the project later.
3. The sample files are read-only. Right-click folder properties and clear the read-only attribute.

All subsequent file modifications and run statements will be made against files in this folder.  

## Import project
1. In Eclipse, choose **File** > **Import** > **General** > **Existing Projects into Workspace**.
   
    ![][4]
2. In **Select root directory**, browse to the folder containing sample files. Select the folder that contains the .project folder. The project should appear in the **Projects** list as a selected item.
   
    ![][12]
3. Click **Finish**.
4. Use **Project Explorer** to view and edit the files. If it's not already open, click **Window** > **Show View** > **Project Explorer** or use the shortcut to open it.

## Configure the service URL and api-key
1. In **Project Explorer**, double-click **config.properties** to edit the configuration settings containing the server name and api-key.
2. Refer to the steps earlier in this article, where you found the service URL and api-key in the [Azure Portal](https://portal.azure.com), to get the values you will now enter into **config.properties**.
3. In **config.properties**, replace "Api Key" with the api-key for your service. Next, service name (the first component of the URL http://servicename.search.windows.net) replaces "service name" in the same file.
   
    ![][5]

## Configure the project, build and runtime environments
1. In Eclipse, in Project Explorer, right-click the project > **Properties** > **Project Facets**.
2. Select **Dynamic Web Module**, **Java**, and **JavaScript**.
   
    ![][6]
3. Click **Apply**.
4. Select **Window** > **Preferences** > **Server** > **Runtime Environments** > **Add..**.
5. Expand Apache and select the version of the Apache Tomcat server you previously installed. On our system, we installed version 8.
   
    ![][7]
6. On the next page, specify the Tomcat installation directory. On a Windows computer, this will most likely be C:\Program Files\Apache Software Foundation\Tomcat *version*.
7. Click **Finish**.
8. Select **Window** > **Preferences** > **Java** > **Installed JREs** > **Add**.
9. In **Add JRE**, select **Standard VM**.
10. Click **Next**.
11. In JRE Definition, in JRE home, click **Directory**.
12. Navigate to **Program Files** > **Java** and select the JDK you previously installed. It's important to select the JDK as the JRE.
13. In Installed JREs, choose the **JDK**. Your settings should look similar to the following screenshot.
    
    ![][9]
14. Optionally, select **Window** > **Web Browser** > **Internet Explorer** to open the application in an external browser window. Using an external browser gives you a better Web application experience.
    
    ![][8]

You have now completed the configuration tasks. Next, you'll build and run the project.

## Build the project
1. In Project Explorer, right-click the project name and choose **Run As** > **Maven build...** to configure the project.
   
    ![][10]
2. In Edit Configuration, in Goals, type "clean install", and then click **Run**.

Status messages are output to the console window. You should see BUILD SUCCESS indicating the project built without errors.

## Run the app
In this last step, you will run the application in a local server runtime environment.

If you haven't yet specified a server runtime environment in Eclipse, you'll need to do that first.

1. In Project Explorer, expand **WebContent**.
2. Right-click **Search.jsp** > **Run As** > **Run on Server**. Select the Apache Tomcat server, and then click **Run**.

> [!TIP]
> If you used a non-default workspace to store your project, you'll need to modify **Run Configuration** to point to the project location to avoid a server start-up error. In Project Explorer, right-click **Search.jsp** > **Run As** > **Run Configurations**. Select the Apache Tomcat server. Click **Arguments**. Click **Workspace** or **File System** to set the folder containing the project.
> 
> 

When you run the application, you should see a browser window, providing a search box for entering terms.

Wait about one minute before clicking **Search** to give the service time to create and load the index. If you get an HTTP 404 error, you just need to wait a little bit longer before trying again.

## Search on USGS data
The USGS data set includes records that are relevant to the state of Rhode Island. If you click **Search** on an empty search box, you will get the top 50 entries, which is the default.

Entering a search term will give the search engine something to go on. Try entering a regional name. "Roger Williams" was the first governor of Rhode Island. Numerous parks, buildings, and schools are named after him.

![][11]

You could also try any of these terms:

* Pawtucket
* Pembroke
* goose +cape

## Next steps
This is the first Azure Search tutorial based on Java and the USGS dataset. Over time, we'll extend this tutorial to demonstrate additional search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for further experimentation, perhaps augmenting the [search page](search-pagination-page-layout.md), or implementing [faceted navigation](search-faceted-navigation.md). You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](https://azure.microsoft.com/documentation/services/search/) to find more resources. 

<!--Image references-->
[1]: ./media/search-get-started-java/create-search-portal-1.PNG
[2]: ./media/search-get-started-java/create-search-portal-21.PNG
[3]: ./media/search-get-started-java/create-search-portal-31.PNG
[4]: ./media/search-get-started-java/AzSearch-Java-Import1.PNG
[5]: ./media/search-get-started-java/AzSearch-Java-config1.PNG
[6]: ./media/search-get-started-java/AzSearch-Java-ProjectFacets1.PNG
[7]: ./media/search-get-started-java/AzSearch-Java-runtime1.PNG
[8]: ./media/search-get-started-java/AzSearch-Java-Browser1.PNG
[9]: ./media/search-get-started-java/AzSearch-Java-JREPref1.PNG
[10]: ./media/search-get-started-java/AzSearch-Java-BuildProject1.PNG
[11]: ./media/search-get-started-java/rogerwilliamsschool1.PNG
[12]: ./media/search-get-started-java/AzSearch-Java-SelectProject.png
