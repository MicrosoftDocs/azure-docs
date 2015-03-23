<properties 
   pageTitle="How to use Azure Search from a .NET Application" 
   description="How to use Azure Search from a .NET Application" 
   services="search"
   documentationCenter=""
   authors="brjohnstmsft" 
   manager="pablocas" 
   editor=""/>

<tags
   ms.service="search"
   ms.devlang="dotnet"
   ms.workload="search"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="03/18/2015"
   ms.author="brjohnst"/>

# How to use Azure Search from a .NET Application #

This article is a walkthrough to get you up and running with the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn946890.aspx). You can use the .NET SDK to implement a rich search experience in your application using Azure Search.

## What's in the Azure Search SDK ##

The SDK consists of a client library, `Microsoft.Azure.Search`. It enables you to manage your indexes, upload and manage documents, and execute queries, all without having to deal with the details of HTTP and JSON.

The client library defines classes like `Index`, `Field`, and `Document`, as well as operations like `Indexes.Create` and `Documents.Search` on the `SearchServiceClient` and `SearchIndexClient` classes. These classes are organized into the following namespaces:

- [Microsoft.Azure.Search](https://msdn.microsoft.com/library/azure/microsoft.azure.search.aspx)
- [Microsoft.Azure.Search.Models](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.aspx)

The current version of the Azure Search .NET SDK is `0.9.6-preview`. This is a pre-release version of the SDK. If you would like to provide feedback for us to incorporate in the first stable version, please visit our [feedback page](http://feedback.azure.com/forums/263029-azure-search).

The .NET SDK supports a subset of version `2015-02-28` of the Azure Search REST API, documented on [MSDN](https://msdn.microsoft.com/library/azure/dn798935.aspx). New features that are *not* part of this version, such as support for Microsoft's natural language processors or the `moreLikeThis` search parameter, are in [preview](search-api-2015-02-28-preview.md) and not yet available in the SDK. You can check back on [Search service versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) or [Latest updates to Azure Search](search-latest-updates.md) for status updates on either feature.

Other features not supported in this SDK include:

  - [Indexers](https://msdn.microsoft.com/library/azure/dn946891.aspx). Support for indexers will be available in the first stable version of the SDK.
  - [Management Operations](https://msdn.microsoft.com/library/azure/dn832684.aspx). Management operations include provisioning Azure Search services and managing API keys. These will be supported in a separate Azure Search .NET Management SDK in the future.

## Requirements for the SDK ##

1. Visual Studio 2013 or a newer version.

2. Your own Azure Search service. In order to use the SDK, you will need the name of your service and one or more API keys. [Getting started with Azure Search](search-get-started.md) will help you through these steps.

3. Download the Azure Search .NET SDK [NuGet package](http://www.nuget.org/packages/Microsoft.Azure.Search) by using "Manage NuGet Packages" in Visual Studio. Just search for the package name `Microsoft.Azure.Search` on NuGet.org. Make sure to select "Include Prerelease" to ensure that the pre-release SDK will appear in the search results.

The Azure Search .NET SDK supports applications targeting the .NET Framework 4.0 or higher, as well as Windows Store apps targeting Windows 8.1 and Windows Phone 8.1. Silverlight is not supported.

## Core Scenarios ##

There are several things you'll need to do in your search application. In this tutorial, we'll cover these core scenarios:

- Creating an index
- Populating the index with documents
- Searching for documents using full-text search and filters

The sample code that follows illustrates each of these. Feel free to use the code snippets in your own application. 

### Overview ###

The sample application we'll be exploring creates a new index named "stores", populates it with a few documents, then executes some search queries. Here is the main program, showing the overall flow:

    // This sample shows how to delete, create, upload documents and query an index
    static void Main(string[] args)
    {
        // Put your search service name here. This is the hostname portion of your service URL.
        // For example, if your service URL is https://myservice.search.windows.net, then your
        // service name is myservice.
        string searchServiceName = "myservice"; 
        
        string apiKey = "Put your API admin key here."

        SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));

        Console.WriteLine("{0}", "Deleting index...\n");
        DeleteStoresIndexIfExists(serviceClient);

        Console.WriteLine("{0}", "Creating index...\n");
        CreateStoresIndex(serviceClient);

        SearchIndexClient indexClient = serviceClient.Indexes.GetClient("stores");
        
        Console.WriteLine("{0}", "Uploading documents...\n");
        UploadDocuments(indexClient);
        
        Console.WriteLine("{0}", "Searching documents 'bike store'...\n");
        SearchDocuments(indexClient, searchText: "bike store");

        Console.WriteLine("\n{0}", "Filter documents located in Italy...\n");
        SearchDocuments(indexClient, searchText: "*", filter: "country eq 'Italy'");

        Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
        Console.ReadKey();
    }

We'll walk through this step by step. First we need to create a new `SearchServiceClient`. This object allows you to manage indexes. In order to construct one, you need to provide your Azure Search service name as well as an admin API key.

        // Put your search service name here. This is the hostname portion of your service URL.
        // For example, if your service URL is https://myservice.search.windows.net, then your
        // service name is myservice.
        string searchServiceName = "myservice"; 
        
        string apiKey = "Put your API admin key here."

        SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));

> [AZURE.NOTE] If you provide an incorrect key (for example, a query key where an admin key was required), the `SearchServiceClient` will throw a `CloudException` with the error message "Forbidden" the first time you call an operation method on it, such as `Indexes.Create`. If this happens to you, double-check our API key.

The next few lines call methods to create an index named "stores", deleting it first if it already exists. We will walk through these methods a little later.

        Console.WriteLine("{0}", "Deleting index...\n");
        DeleteStoresIndexIfExists(serviceClient);

        Console.WriteLine("{0}", "Creating index...\n");
        CreateStoresIndex(serviceClient);

Next, the index needs to be populated. To do this, we will need a `SearchIndexClient`. There are two ways to obtain one: by constructing it, or by calling `Indexes.GetClient` on the `SearchServiceClient`. We use the latter for convenience.

        SearchIndexClient indexClient = serviceClient.Indexes.GetClient("stores");

> [AZURE.NOTE] In a typical search application, index management and population is handled by a separate component from search queries. `Indexes.GetClient` is convenient for populating an index because it saves you the trouble of providing another `SearchCredentials`. It does this by passing the admin key that you used to create the `SearchServiceClient` to the new `SearchIndexClient`. However, in the part of your application that executes queries, it is better to create the `SearchIndexClient` directly so that you can pass in a query key instead of an admin key. This is consistent with the principle of least privilege and will help to make your application more secure. You can find out more about admin keys and query keys [here](https://msdn.microsoft.com/library/azure/dn798935.aspx).

Now that we have a `SearchIndexClient`, we can populate the index. This is done by another method that we will walk through later.

        Console.WriteLine("{0}", "Uploading documents...\n");
        UploadDocuments(indexClient);

Finally, we execute a few search queries and display the results, again using the `SearchIndexClient`:

        Console.WriteLine("{0}", "Searching documents 'bike store'...\n");
        SearchDocuments(indexClient, searchText: "bike store");

        Console.WriteLine("\n{0}", "Filter documents located in Italy...\n");
        SearchDocuments(indexClient, searchText: "*", filter: "country eq 'Italy'");

        Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
        Console.ReadKey();

If you run this application with a valid service name and API key, the output should look like this:

    Deleting index...

    Creating index...

    Uploading documents...

    Searching documents 'bike store'...

    Store: Fitness Discount Store, Address: Altrottstraße  31 , Walldorf, Germany
    Store: Primary Bike Distributors, Address: Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI) , Milan, Italy

    Filter documents located in Italy...

    Store: Primary Bike Distributors, Address: Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI) , Milan, Italy
    Store: Finer Sales and Service, Address: Corso Orbassano 336 , Turin, Italy
    Complete.  Press any key to end application...

The full source code of the application is provided at the end of this article.

Next, we will take a closer look at each of the methods called by `Main`.

### Creating an Index ###

After creating a `SearchServiceClient`, the next thing `Main` does is delete the "stores" index if it already exists. That is done by the following method:

    private static void DeleteStoresIndexIfExists(SearchServiceClient serviceClient)
    {
        if (serviceClient.Indexes.Exists("stores"))
        {
            serviceClient.Indexes.Delete("stores");
        }
    }

This method uses the given `SearchServiceClient` to check if the index exists, and if so, delete it.

> [AZURE.NOTE] The example code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the method above you could use `ExistsAsync` and `DeleteAsync` instead of `Exists` and `Delete`.

Next, `Main` creates a new "stores" index by calling this method: 

    private static void CreateStoresIndex(SearchServiceClient serviceClient)
    {
        var definition = new Index()
        {
            Name = "stores",
            Fields = new[] 
            { 
                new Field("storeId",        DataType.String) { IsKey = true,  IsSearchable = false, IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                new Field("storeName",      DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
                new Field("addressLine1",   DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                new Field("addressLine2",   DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                new Field("city",           DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                new Field("stateProvince",  DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                new Field("postalCode",     DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                new Field("country",        DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
            }
        };

        serviceClient.Indexes.Create(definition);
    }

This method creates a new `Index` object with a list of `Field` objects that defines the schema of the new index. Each field has a name, data type, and several attributes that define its search behavior. In addition to fields, you can also add scoring profiles, suggesters, or CORS options to the Index (these are omitted from the sample for brevity). You can find more information about the Index object and its constituent parts in the SDK reference on [MSDN](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.index_members.aspx), as well as in the [Azure Search REST API reference](https://msdn.microsoft.com/library/azure/dn798935.aspx).

### Populating the Index ###

The next step in `Main` is to populate the newly-created index. This is done in the following method:

    private static void UploadDocuments(SearchIndexClient indexClient)
    {
        var documents =
            new Store[]
            {
                new Store() { StoreId = "1058-441", StoreName = "Mass Market Bikes", AddressLine1 = "110 9th Avenue SW", AddressLine2 = "8th Floor", City = "Calgary", StateProvince = "AB", PostalCode = "T2P 0T1", Country = "Canada" },
                new Store() { StoreId = "666-437", StoreName = "Fitness Discount Store", AddressLine1 = "Altrottstraße  31", City = "Walldorf", PostalCode = "69190", Country = "Germany" },
                new Store() { StoreId = "970-501", StoreName = "Primary Bike Distributors", AddressLine1 = "Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI)", City = "Milan", Country = "Italy" },
                new Store() { StoreId = "956-532", StoreName = "Finer Sales and Service", AddressLine1 = "Corso Orbassano 336", City = "Turin", PostalCode = "10137", Country = "Italy" },
                new Store() { StoreId = "566-518", StoreName = "Courteous Bicycle Specialists", AddressLine1 = "1 Microsoft Way", City = "Redmond", StateProvince = "WA", PostalCode = "98052", Country = "United States" }
            };

        try
        {
            indexClient.Documents.Index(IndexBatch.Create(documents.Select(doc => IndexAction.Create(doc))));
        }
        catch (IndexBatchException e)
        {
            // Sometimes when your Search service is under load, indexing will fail for some of the documents in
            // the batch. Depending on your application, you can take compensating actions like delaying and
            // retrying. For this simple demo, we just log the failed document keys and continue.
            Console.WriteLine(
                "Failed to index some of the documents: {0}",
                String.Join(", ", e.IndexResponse.Results.Where(r => !r.Succeeded).Select(r => r.Key)));
        }

        // Wait a while for indexing to complete.
        Thread.Sleep(2000);
    }

This method has four parts. The first creates an array of `Store` objects that will serve as our input data to upload to the index. This data is hard-coded for simplicity. In your own application, your data will likely come from an external data source such as a SQL database.

The second part creates an `IndexAction` for each `Store`, then groups those together in a new `IndexBatch`. The batch is then uploaded to the Azure Search index by the `Documents.Index` method.

> [AZURE.NOTE] In this example, we are just uploading documents. If you wanted to merge changes into an existing document or a delete a document, you could create an `IndexAction` with the corresponding `IndexActionType`. We don't need to specify `IndexActionType` in this example because the default is `Upload`.

The third part of this method is a catch block that handles an important error case for indexing. If your Azure Search service fails to index some of the documents in the batch, an `IndexBatchException` is thrown by `Documents.Index`. This can happen if you are indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements.

Finally, the method delays for two seconds. Indexing happens asynchronously in your Azure Search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

#### How the .NET SDK Handles Documents ####

You may be wondering how the Azure Search .NET SDK is able to upload instances of a user-defined class like `Store` to the index. To help answer that question, let's look at the `Store` class:

    [SerializePropertyNamesAsCamelCase]
    public class Store
    {
        public string StoreId { get; set; }

        public string StoreName { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string City { get; set; }

        public string StateProvince { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }

        public override string ToString()
        {
            return String.Format(
                "Store: {0}, Address: {1} {2}, {3}, {4}", StoreName, AddressLine1, AddressLine2, City, Country);
        }
    }

The first thing to notice is that each public property of `Store` corresponds to a field in the index definition, but with one crucial difference: The name of each field starts with a lower-case letter ("camel case"), while the name of each public property of `Store` starts with an upper-case letter ("Pascal case"). This is a common scenario in .NET applications that perform data-binding where the target schema is outside the control of the application developer. Rather than having to violate the .NET naming guidelines by making property names camel-case, you can tell the SDK to map the property names to camel-case automatically with the `[SerializePropertyNamesAsCamelCase]` attribute.

The second important thing about the `Store` class are the data types of the public properties. These properties are all of type `string` since the index definition defines all its fields to be of type `Edm.String`. There are similar type mappings between `bool?` and `Edm.Boolean`, `DateTimeOffset?` and `Edm.DateTimeOffset`, etc. The specific rules for the type mapping are documented with the `Documents.Get` method on [MSDN](https://msdn.microsoft.com/library/azure/dn931291.aspx).

This ability to use your own classes as documents works in both directions; You can also retrieve search results and have the SDK automatically deserialize them to a type of your choice, as we will see in the next section.

> [AZURE.NOTE] The Azure Search .NET SDK also supports dynamically-typed documents using the `Document` class, which is a key/value mapping of field names to field values. This is useful in scenarios where you don't know the index schema at design-time, or where it would be inconvenient to bind to specific model classes. All the methods in the SDK that deal with documents have overloads that work with the `Document` class, as well as strongly-typed overloads that take a generic type parameter. Only the latter are used in the sample code in this tutorial. You can find out more about the `Document` class [here](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.document.aspx).

### Searching for Documents in the Index ###

The last step in the sample application is to search for some documents in the index. The following method does this:

    private static void SearchDocuments(SearchIndexClient indexClient, string searchText, string filter = null)
    {
        // Execute search based on search text and optional filter 
        var sp = new SearchParameters();
    
        if (!String.IsNullOrEmpty(filter))
        {
            sp.Filter = filter;
        }

        DocumentSearchResponse<Store> response = indexClient.Documents.Search<Store>(searchText, sp);
        foreach (SearchResult<Store> result in response)
        {
            Console.WriteLine(result.Document);
        }
    }

First, this method creates a new `SearchParameters` object. This is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this example, we're only setting the `Filter` property.

The next step is to actually execute the search query. This is done using the `Documents.Search` method. In this case, we pass the search text to use as a string, plus the search parameters created earlier. We also specify `Store` as the type parameter for `Documents.Search`, which tells the SDK to deserialize documents in the search results into objects of type `Store`.

Finally, this method iterates through all the matches in the search results, printing each document to the console.

Let's take a closer look at how this method is called:

    SearchDocuments(indexClient, searchText: "bike store");

    SearchDocuments(indexClient, searchText: "*", filter: "country eq 'Italy'");

In the first call, we're looking for all documents containing the query terms "bike" or "store". In the second call, the search text is set to "*", which means "find everything". You can find more information about the search query expression syntax [here](https://msdn.microsoft.com/library/azure/dn798920.aspx).

The second call uses an OData `$filter` expression, `country eq 'Italy'`. This constrains the search to only return documents where the `country` field exactly matches the string "Italy". You can find out more about the OData syntax that Azure Search supports [here](https://msdn.microsoft.com/library/azure/dn798921.aspx).

Now that you know what these two calls do, it should be easier to see why their output looks like this:

    Searching documents 'bike store'...

    Store: Fitness Discount Store, Address: Altrottstraße  31 , Walldorf, Germany
    Store: Primary Bike Distributors, Address: Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI) , Milan, Italy

    Filter documents located in Italy...

    Store: Primary Bike Distributors, Address: Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI) , Milan, Italy
    Store: Finer Sales and Service, Address: Corso Orbassano 336 , Turin, Italy

The first search returns two documents. The first has "store" in the name, while the second has "bike" in the name. The second search returns two documents, which happen to be the only documents in the index that have the `country` field set to "Italy".

This step completes the tutorial, but don't stop here. **Next steps** provides additional resources for learning more about Azure Search.

## Next Steps ##

- Deepen your knowledge through [videos and other samples and tutorials](https://msdn.microsoft.com/library/azure/dn818681.aspx).
- Read about features and capabilities in this version of the Azure Search SDK: [Azure Search Overview](https://msdn.microsoft.com/library/azure/dn798933.aspx)
- Review [naming conventions](https://msdn.microsoft.com/library/azure/dn857353.aspx) to learn the rules for naming various objects.
- Review [supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) in Azure Search.


## Sample Application Source Code ##

Here is the full source code of the sample application used in this walk through. Note that you will need to replace the service name and API key placeholders in Program.cs with your own values if you want to build and run the sample.

Program.cs:

    using System;
    using System.Configuration;
    using System.Linq;
    using System.Threading;
    using Microsoft.Azure.Search;
    using Microsoft.Azure.Search.Models;

    namespace AzureSearch.NETSDKSample
    {
        class Program
        {
            // This sample shows how to delete, create, upload documents and query an index
            static void Main(string[] args)
            {
                // Put your search service name here. This is the hostname portion of your service URL.
                // For example, if your service URL is https://myservice.search.windows.net, then your
                // service name is myservice.
                string searchServiceName = "myservice"; 
        
                string apiKey = "Put your API admin key here."

                SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));

                Console.WriteLine("{0}", "Deleting index...\n");
                DeleteStoresIndexIfExists(serviceClient);

                Console.WriteLine("{0}", "Creating index...\n");
                CreateStoresIndex(serviceClient);

                SearchIndexClient indexClient = serviceClient.Indexes.GetClient("stores");
            
                Console.WriteLine("{0}", "Uploading documents...\n");
                UploadDocuments(indexClient);
            
                Console.WriteLine("{0}", "Searching documents 'bike store'...\n");
                SearchDocuments(indexClient, searchText: "bike store");

                Console.WriteLine("\n{0}", "Filter documents located in Italy...\n");
                SearchDocuments(indexClient, searchText: "*", filter: "country eq 'Italy'");

                Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
                Console.ReadKey();
            }

            private static void DeleteStoresIndexIfExists(SearchServiceClient serviceClient)
            {
                if (serviceClient.Indexes.Exists("stores"))
                {
                    serviceClient.Indexes.Delete("stores");
                }
            }

            private static void CreateStoresIndex(SearchServiceClient serviceClient)
            {
                var definition = new Index()
                {
                    Name = "stores",
                    Fields = new[] 
                    { 
                        new Field("storeId",        DataType.String) { IsKey = true,  IsSearchable = false, IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                        new Field("storeName",      DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
                        new Field("addressLine1",   DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                        new Field("addressLine2",   DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
                        new Field("city",           DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                        new Field("stateProvince",  DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                        new Field("postalCode",     DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                        new Field("country",        DataType.String) { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
                    }
                };

                serviceClient.Indexes.Create(definition);
            }

            private static void UploadDocuments(SearchIndexClient indexClient)
            {
                var documents =
                    new Store[]
                    {
                        new Store() { StoreId = "1058-441", StoreName = "Mass Market Bikes", AddressLine1 = "110 9th Avenue SW", AddressLine2 = "8th Floor", City = "Calgary", StateProvince = "AB", PostalCode = "T2P 0T1", Country = "Canada" },
                        new Store() { StoreId = "666-437", StoreName = "Fitness Discount Store", AddressLine1 = "Altrottstraße  31", City = "Walldorf", PostalCode = "69190", Country = "Germany" },
                        new Store() { StoreId = "970-501", StoreName = "Primary Bike Distributors", AddressLine1 = "Management center San Felice; Via Rivoltana 13 to 20090 Segrate (MI)", City = "Milan", Country = "Italy" },
                        new Store() { StoreId = "956-532", StoreName = "Finer Sales and Service", AddressLine1 = "Corso Orbassano 336", City = "Turin", PostalCode = "10137", Country = "Italy" },
                        new Store() { StoreId = "566-518", StoreName = "Courteous Bicycle Specialists", AddressLine1 = "1 Microsoft Way", City = "Redmond", StateProvince = "WA", PostalCode = "98052", Country = "United States" }
                    };

                try
                {
                    indexClient.Documents.Index(IndexBatch.Create(documents.Select(doc => IndexAction.Create(doc))));
                }
                catch (IndexBatchException e)
                {
                    // Sometimes when your Search service is under load, indexing will fail for some of the documents in
                    // the batch. Depending on your application, you can take compensating actions like delaying and
                    // retrying. For this simple demo, we just log the failed document keys and continue.
                    Console.WriteLine(
                        "Failed to index some of the documents: {0}",
                        String.Join(", ", e.IndexResponse.Results.Where(r => !r.Succeeded).Select(r => r.Key)));
                }

                // Wait a while for indexing to complete.
                Thread.Sleep(2000);
            }

            private static void SearchDocuments(SearchIndexClient indexClient, string searchText, string filter = null)
            {
                // Execute search based on search text and optional filter 
                var sp = new SearchParameters();
            
                if (!String.IsNullOrEmpty(filter))
                {
                    sp.Filter = filter;
                }

                DocumentSearchResponse<Store> response = indexClient.Documents.Search<Store>(searchText, sp);
                foreach (SearchResult<Store> result in response)
                {
                    Console.WriteLine(result.Document);
                }
            }
        }
    }

Store.cs:

    using System;
    using Microsoft.Azure.Search.Models;

    namespace AzureSearch.NETSDKSample
    {
        [SerializePropertyNamesAsCamelCase]
        public class Store
        {
            public string StoreId { get; set; }

            public string StoreName { get; set; }

            public string AddressLine1 { get; set; }

            public string AddressLine2 { get; set; }

            public string City { get; set; }

            public string StateProvince { get; set; }

            public string PostalCode { get; set; }

            public string Country { get; set; }

            public override string ToString()
            {
                return String.Format(
                    "Store: {0}, Address: {1} {2}, {3}, {4}", StoreName, AddressLine1, AddressLine2, City, Country);
            }
        }
    }
