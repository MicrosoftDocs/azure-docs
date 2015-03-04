<properties 
	pageTitle="How to use Azure Search in .NET" 
	description="Walkthrough showing how to use the Azure Search .NET client libraries in a C# applications" 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="02/11/2015" 
	ms.author="heidist"/>
# How to use Azure Search in .NET #

This article is a walkthrough of the Azure Search .NET SDK that shows you how to code the major objects and operations used in a custom application utilizing Azure Search for a rich search experience.

##What's in the Azure Search SDK##

The SDK consists of client libraries that define objects like indexes, indexers, and data sources, as well as operations like querying the index. It provides the following namespaces:

- [Microsoft.Azure.Search]()
- [Microsoft.Azure.Search.Models]()

The current version is 0.9x. This first version is a preview of the SDK. If you would like to provide feedback for the generally available version, please visit our [feedback page](http://feedback.azure.com/forums/263029-azure-search).

To obtain the SDK, you can download just the [NuGet package](http://go.microsoft.com/fwlink/p/?LinkId=528087) if you already have the Azure .NET SDK. Otherwise, consider installing the latest version of the larger [Azure .NET SDK](http://azure.microsoft.com/downloads/) to get client libraries and resources for a wide range of services.

The .NET libraries are at the functional level of `api-version=2015-02-28`, documented on [MSDN](). New features that are *not* part of this version, such as support for Microsoft's natural language processors or the **MorelLikeThis** search parameters, are in [preview]() and not yet available in the SDK. You can check back on [Search service versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) or [Latest updates to Azure Search](./search-latest-updates/) for status updates on either feature.

##Requirements ##

1. Provision a Search service, getting the service URL and an admin key. [Getting started with Azure Search](./search-get-started/) will help you through these steps.

2. Download the Azure Search .NET SDK from either one of the following links:

	- Download the latest version of the larger [Azure .NET SDK](http://azure.microsoft.com/downloads/)
	- Download just the [NuGet package](http://go.microsoft.com/fwlink/p/?LinkId=528087)

3. Download a Visual Studio solution, named *AzureSearchDotNetSDKSample* (written in C#) to walk through the steps in this article. You can get the solution on [Codeplex](http://go.microsoft.com/fwlink/p/?LinkId=528106). The sample application is a console application that creates an index called *stores*, loads documents based on the Adventure Works dataset, searches on the term *bike*, and filters on the term *Italian*.

You can use any version and edition of Visual Studio and the .NET framework that is supported by the Azure .NET SDK.

##Update app configuration and build the solution##

Before stepping through the code, update the configuration to provide your service URL and admin key, and then run the application to verify there are no build error. 

Both values are available to you in service blade for Azure Search in the [Azure management portal](https://portal.azure.com).

> [AZURE.NOTE]: If you already have an index named *stores*, this exercise will overwrite the existing index on your service.

1. Open **AzureSearch.NETSDKSample.sln**.
2. In Solution Explorer, right-click the solution and select **Manage NuGet Packages**.
3. Update all of the packages used in this solution.
4. Open App.config.
5. Enter the name of your service URL. Only the name, not the full URL path, is required. For example, if the URL is https://my-app.search.windows.net, then the name you should enter is *my-app*. 
6. Enter the admin key 
7. Check existing indexes to avoid accidentally deleting an existing index of the same name (stores). Additionally, if you are using the shared service, you can only have a maximum of three indexes. You might delete one of them to make room for the index created in this sample.
   - Go to the [Azure management portal](https://portal.azure.com).
   - Click the tile that has the name of your Search service.
   - Review the list of indexes currently deployed to your service. If an index named *stores* already exists, check with the owner before running the sample and overwriting that index.
   - If necessary, delete an unused index to free up space for the *stores* index. The shared service allows up to three indexes.
8. When ready, press **F5** to run the application.

You should get a console window that prints out status messages for these operations: deleting an index, creating an index, uploading documents, searching documents, and filtering.

If there are no build errors, place a breakpoint on `Main` and press **F5** to rerun the application.

 ![][1]

##Step through Create Index##

The **CreateCatalogIndex()** method accepts an index name and a JSON schema that specifies the field composition of a document. For each field, the index specifies attributes that you can use to allow or constrain search behaviors at the field level. In addition to fields, f you wanted to add scoring profiles or suggesters, those constructs would be specified in the index as well.

        private static void CreateCatalogIndex()
        {
            // Create the Azure Search index based on the included schema
            try
            {
                var definition = new Index()
                {
                    Name = "stores",
                    Fields = new[] 
                { 
                    new Field("StoreId",        DataType.String)         { IsKey = true,  IsSearchable = false, IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                    new Field("StoreName",      DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
                    new Field("AddressLine1",   DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                    new Field("AddressLine2",   DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                    new Field("City",           DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                    new Field("StateProvince",  DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                    new Field("PostalCode",     DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                    new Field("Country",        DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                }
                };




##Step through Load Documents##

In Azure Search, populating an index with documents is a distinct operation. This design means that can add, update, or delete documents as a separate step.

Using the .NET library, we've created an **UploadDocuments()** method that loads documents from a CSV data file included in the sample.

        private static void UploadDocuments()
        {
            //Load a CSV file and upload it as a batch of documents
            string FileName = @"store_locations.csv";

            System.Data.DataTable dt = LoadCSV(FileName);

            List<IndexAction> indexOperations = new List<IndexAction>();
            int colCounter = 0, rowCounter = 0;

            // Skip the first header row
            for (int i = 1; i < dt.Rows.Count; i++)
            {
                DataRow dtRow = dt.Rows[i];
                IndexAction ia = new IndexAction();
                Document doc = new Document();
                colCounter = 0;
                foreach (DataColumn dc in dt.Columns)
                {
                    doc.Add(dt.Columns[colCounter].ToString(), dtRow[dc].ToString()); 
                    colCounter++;
                }

                indexOperations.Add(new IndexAction(IndexActionType.Upload, doc));
                rowCounter++;
                if (rowCounter > 999)
                {
                    IndexBatch(indexOperations);
                    rowCounter = 0;
                }
            }
            if (rowCounter > 0)
            {
                IndexBatch(indexOperations);
            }

        }

        private static System.Data.DataTable LoadCSV(string csvFileName)
        {
            // Open a CSV file and load it in to a DataTable
            try
            {
                if (!File.Exists(csvFileName))
                {
                    Console.WriteLine("File does not exist:\r\n" + csvFileName);
                    return null;
                }

                string conString = "Driver={Microsoft Text Driver (*.txt; *.csv)};Extensions=asc,csv,tab,txt;";
                System.Data.Odbc.OdbcConnection con = new System.Data.Odbc.OdbcConnection(conString);
                string commText = "SELECT * FROM [" + csvFileName + "]";
                System.Data.Odbc.OdbcDataAdapter da = new System.Data.Odbc.OdbcDataAdapter(commText, con);
                System.Data.DataTable dt = new System.Data.DataTable();
                da.Fill(dt);
                con.Close();
                con.Dispose();
                return dt;
            }
            catch (Exception ex)
            {
                Console.WriteLine("There was an error loading the CSV file:\r\n" + ex.Message);
                return null;
            }
        }

        private static void IndexBatch(List<IndexAction> changes)
        {
            // Receive a batch of documents and upload to Azure Search
            try
            {
                _indexClient.Documents.Index(new IndexBatch(changes));
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error uploading batch: {0}\r\n", ex.Message.ToString());
            }
        }


##Step through Query Documents##

Once documents are uploaded, you can send search requests. The **SearchDocuments** method accepts query parameters that provide the terms. You can also specify filters as a reduction measure.


        private static void SearchDocuments(string q, string filter)
        {
            // Execute search based on query string (q) and filter 
            try
            {
                SearchParameters sp = new SearchParameters();
                if (filter != string.Empty)
                    sp.Filter = filter;
                DocumentSearchResponse response = _indexClient.Documents.Search(q, sp);
                foreach (SearchResult doc in response)
                {
                    string StoreName = doc.Document["StoreName"].ToString();
                    string Address =  (doc.Document["AddressLine1"].ToString() + " " + doc.Document["AddressLine2"].ToString()).Trim();
                    string City = doc.Document["City"].ToString();
                    string Country = doc.Document["Country"].ToString();
                    Console.WriteLine("Store: {0}, Address: {1}, {2}, {3}", StoreName, Address, City, Country);
 
This step completes the tutorial, but don't stop here. **Next steps** provides additional resources for learning more about Azure Search.

##Next steps##


- Deepen your knowledge through [videos and other samples and tutorials]](https://msdn.microsoft.com/library/azure/dn818681.aspx).
- Read about features and capabilities in this version of the Azure Search SDK: [Azure Search Overview](https://msdn.microsoft.com/library/azure/dn798933.aspx)
- Review [naming conventions](https://msdn.microsoft.com/library/azure/dn857353.aspx) to learn the rules for naming various objects.
- Review [supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) in Azure Search.
- If you are using an Azure Search indexer, review the data type map for indexers as well. See [Mapping data types for indexers](http://go.microsoft.com/fwlink/p/?LinkId=528105) for details.


<!--Image references-->
[1]:./media/search-howto-dotnet-sdk/breakpointonmain.png