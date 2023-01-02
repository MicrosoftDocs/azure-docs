---
title: 'Quickstart: Create a search index in Python'
titleSuffix: Azure Cognitive Search
description: Learn how to create a search index, load data, and run queries using Python, Jupyter Notebook, and the Azure.Documents.Search client library for Python.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.devlang: python
ms.topic: quickstart
ms.date: 08/31/2022
ms.custom: devx-track-python, mode-api
---

# Quickstart: Create an Azure Cognitive Search index in Python using Jupyter Notebook

> [!div class="op_single_selector"]
> * [Python](search-get-started-python.md)
> * [PowerShell (REST)](search-get-started-powershell.md)
> * [C#](search-get-started-dotnet.md)
> * [REST](search-get-started-rest.md)
> * [Portal](search-get-started-portal.md)
>

In this exercise, build a Jupyter Notebook that creates, loads, and queries an Azure Cognitive Search index using Python and the [azure-search-documents library](/python/api/overview/azure/search-documents-readme) in the Azure SDK for Python. This article explains how to build a notebook step by step. Alternatively, you can [download and run a finished Jupyter Python notebook](https://github.com/Azure-Samples/azure-search-python-samples).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following services and tools are used in this quickstart.

* Visual Studio Code with the Python extension (or equivalent tool), with Python 3.7 or later

* [azure-search-documents package](https://pypi.org/project/azure-search-documents/) from the Azure SDK for Python

* [Create a search service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use the Free tier for this quickstart. 

## Copy a key and URL

To connect to your search service, provide the endpoint and an access key. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   ![Get an HTTP endpoint and access key](media/search-get-started-rest/get-url-key.png "Get an HTTP endpoint and access key")

You'll provide these values in the next section when you set up the connection.

## Connect to Azure Cognitive Search

In this task, create the notebook, load the libraries, and set up your clients.

1. Create a new Python3 notebook in Visual Studio Code:

    1. Press F1 and search for "Python Select Interpreter" and choose a version of Python 3.7 or later.
    1. Press F1 again and search for "Create: New Jupyter Notebook". You should have an empty, untitled `.ipynb` file open in the editor ready for the first entry.

1. In the first cell, load the libraries from the Azure SDK for Python, including [azure-search-documents](/python/api/azure-search-documents).

    ```python
    %pip install azure-search-documents --pre
    %pip show azure-search-documents
    
    import os
    from azure.core.credentials import AzureKeyCredential
    from azure.search.documents.indexes import SearchIndexClient 
    from azure.search.documents import SearchClient
    from azure.search.documents.indexes.models import (
        ComplexField,
        CorsOptions,
        SearchIndex,
        ScoringProfile,
        SearchFieldDataType,
        SimpleField,
        SearchableField
    )
    ```

1. Add a second cell and paste in the connection information. This cell also sets up the clients you'll use for specific operations: [SearchIndexClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient) to create an index, and [SearchClient](/python/api/azure-search-documents/azure.search.documents.searchclient) to query an index.

    ```python
    service_name = "YOUR-SEARCH-SERVICE-NAME"
    admin_key = "YOUR-SEARCH-SERVICE-ADMIN-API-KEY"
    
    index_name = "hotels-quickstart"
    
    # Create an SDK client
    endpoint = "https://{}.search.windows.net/".format(service_name)
    admin_client = SearchIndexClient(endpoint=endpoint,
                          index_name=index_name,
                          credential=AzureKeyCredential(admin_key))
    
    search_client = SearchClient(endpoint=endpoint,
                          index_name=index_name,
                          credential=AzureKeyCredential(admin_key))
    ```

1. In the third cell, run a delete_index operation to clear your service of any existing *hotels-quickstart* indexes. Deleting the index allows you to create another *hotels-quickstart* index of the same name.

    ```python
    try:
        result = admin_client.delete_index(index_name)
        print ('Index', index_name, 'Deleted')
    except Exception as ex:
        print (ex)
    ```

1. Run each step.

## 1 - Create an index

Required index elements include a name, a fields collection, and a document key that uniquely identifies each search document. The fields collection defines the structure of a logical *search document*, used for both loading data and returning results. 

Within the fields collection, each field has a name, type, and attributes that determine how the field is used (for example, whether it's full-text searchable, filterable, or retrievable in search results). Within an index, one of the fields of type `Edm.String` must be designated as the *key* for document identity.

This index is named "hotels-quickstart" and has the field definitions you see below. It's a subset of a larger [Hotels index](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/hotels/Hotels_IndexDefinition.JSON) used in other walkthroughs. We trimmed it in this quickstart for brevity.

1. In the next cell, paste the following example into a cell to provide the schema.

    ```python
    # Specify the index schema
    name = index_name
    fields = [
            SimpleField(name="HotelId", type=SearchFieldDataType.String, key=True),
            SearchableField(name="HotelName", type=SearchFieldDataType.String, sortable=True),
            SearchableField(name="Description", type=SearchFieldDataType.String, analyzer_name="en.lucene"),
            SearchableField(name="Description_fr", type=SearchFieldDataType.String, analyzer_name="fr.lucene"),
            SearchableField(name="Category", type=SearchFieldDataType.String, facetable=True, filterable=True, sortable=True),
        
            SearchableField(name="Tags", collection=True, type=SearchFieldDataType.String, facetable=True, filterable=True),
    
            SimpleField(name="ParkingIncluded", type=SearchFieldDataType.Boolean, facetable=True, filterable=True, sortable=True),
            SimpleField(name="LastRenovationDate", type=SearchFieldDataType.DateTimeOffset, facetable=True, filterable=True, sortable=True),
            SimpleField(name="Rating", type=SearchFieldDataType.Double, facetable=True, filterable=True, sortable=True),
    
            ComplexField(name="Address", fields=[
                SearchableField(name="StreetAddress", type=SearchFieldDataType.String),
                SearchableField(name="City", type=SearchFieldDataType.String, facetable=True, filterable=True, sortable=True),
                SearchableField(name="StateProvince", type=SearchFieldDataType.String, facetable=True, filterable=True, sortable=True),
                SearchableField(name="PostalCode", type=SearchFieldDataType.String, facetable=True, filterable=True, sortable=True),
                SearchableField(name="Country", type=SearchFieldDataType.String, facetable=True, filterable=True, sortable=True),
            ])
        ]
    cors_options = CorsOptions(allowed_origins=["*"], max_age_in_seconds=60)
    scoring_profiles = []
    suggester = [{'name': 'sg', 'source_fields': ['Tags', 'Address/City', 'Address/Country']}]
    ```

1. In another cell, formulate the request. This create_index request targets the indexes collection of your search service and creates a [SearchIndex](/python/api/azure-search-documents/azure.search.documents.indexes.models.searchindex) based on the index schema you provided in the previous cell.

    ```python
    index = SearchIndex(
        name=name,
        fields=fields,
        scoring_profiles=scoring_profiles,
        suggesters = suggester,
        cors_options=cors_options)
    
    try:
        result = admin_client.create_index(index)
        print ('Index', result.name, 'created')
    except Exception as ex:
        print (ex)
    ```

1. Run each step.

<a name="load-documents"></a>

## 2 - Load documents

To load documents, create a documents collection, using an [index action](/python/api/azure-search-documents/azure.search.documents.models.indexaction) for the operation type (upload, merge-and-upload, and so forth). Documents originate from [HotelsData](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/hotels/HotelsData_toAzureSearch.JSON) on GitHub.

1. In a new cell, provide four documents that conform to the index schema. Specify an upload action for each document.

    ```python
    documents = [
        {
        "@search.action": "upload",
        "HotelId": "1",
        "HotelName": "Secret Point Motel",
        "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
        "Description_fr": "L'hôtel est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.",
        "Category": "Boutique",
        "Tags": [ "pool", "air conditioning", "concierge" ],
        "ParkingIncluded": "false",
        "LastRenovationDate": "1970-01-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
            "StreetAddress": "677 5th Ave",
            "City": "New York",
            "StateProvince": "NY",
            "PostalCode": "10022",
            "Country": "USA"
            }
        },
        {
        "@search.action": "upload",
        "HotelId": "2",
        "HotelName": "Twin Dome Motel",
        "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
        "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
        "Category": "Boutique",
        "Tags": [ "pool", "free wifi", "concierge" ],
        "ParkingIncluded": "false",
        "LastRenovationDate": "1979-02-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
            "StreetAddress": "140 University Town Center Dr",
            "City": "Sarasota",
            "StateProvince": "FL",
            "PostalCode": "34243",
            "Country": "USA"
            }
        },
        {
        "@search.action": "upload",
        "HotelId": "3",
        "HotelName": "Triple Landscape Hotel",
        "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel's restaurant services.",
        "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
        "Category": "Resort and Spa",
        "Tags": [ "air conditioning", "bar", "continental breakfast" ],
        "ParkingIncluded": "true",
        "LastRenovationDate": "2015-09-20T00:00:00Z",
        "Rating": 4.80,
        "Address": {
            "StreetAddress": "3393 Peachtree Rd",
            "City": "Atlanta",
            "StateProvince": "GA",
            "PostalCode": "30326",
            "Country": "USA"
            }
        },
        {
        "@search.action": "upload",
        "HotelId": "4",
        "HotelName": "Sublime Cliff Hotel",
        "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
        "Description_fr": "Le sublime Cliff Hotel est situé au coeur du centre historique de sublime dans un quartier extrêmement animé et vivant, à courte distance de marche des sites et monuments de la ville et est entouré par l'extraordinaire beauté des églises, des bâtiments, des commerces et Monuments. Sublime Cliff fait partie d'un Palace 1800 restauré avec amour.",
        "Category": "Boutique",
        "Tags": [ "concierge", "view", "24-hour front desk service" ],
        "ParkingIncluded": "true",
        "LastRenovationDate": "1960-02-06T00:00:00Z",
        "Rating": 4.60,
        "Address": {
            "StreetAddress": "7400 San Pedro Ave",
            "City": "San Antonio",
            "StateProvince": "TX",
            "PostalCode": "78216",
            "Country": "USA"
            }
        }
    ]
    ```  

1. In another cell, formulate the request. This upload_documents request targets the docs collection of the hotels-quickstart index and pushes the documents provided in the previous step into the Cognitive Search index.

    ```python
    try:
        result = search_client.upload_documents(documents=documents)
        print("Upload of new document succeeded: {}".format(result[0].succeeded))
    except Exception as ex:
        print (ex.message)
    ```

1. Run each step to push the documents to an index in your search service.

## 3 - Search an index

This step shows you how to query an index using the **search** method of the [search.client class](/python/api/azure-search-documents/azure.search.documents.searchclient).

1. The following step executes an empty search (`search=*`), returning an unranked list (search score = 1.0) of arbitrary documents. Because there are no criteria, all documents are included in results. This query prints just two of the fields in each document. It also adds `include_total_count=True` to get a count of all documents (4) in the results.

    ```python
    results =  search_client.search(search_text="*", include_total_count=True)
    
    print ('Total Documents Matching Query:', results.get_count())
    for result in results:
        print("{}: {}".format(result["HotelId"], result["HotelName"]))
    ```

1. The next query adds whole terms to the search expression ("wifi"). This query specifies that results contain only those fields in the `select` statement. Limiting the fields that come back minimizes the amount of data sent back over the wire and reduces search latency.

    ```python
    results =  search_client.search(search_text="wifi", include_total_count=True, select='HotelId,HotelName,Tags')
    
    print ('Total Documents Matching Query:', results.get_count())
    for result in results:
        print("{}: {}: {}".format(result["HotelId"], result["HotelName"], result["Tags"]))
    ```

1. Next, apply a filter expression, returning only those hotels with a rating greater than 4, sorted in descending order.

    ```python
    results =  search_client.search(search_text="hotels", select='HotelId,HotelName,Rating', filter='Rating gt 4', order_by='Rating desc')
    
    for result in results:
        print("{}: {} - {} rating".format(result["HotelId"], result["HotelName"], result["Rating"]))
    ```

1. Add `search_fields` to scope query matching to a single field.

    ```python
    results =  search_client.search(search_text="sublime", search_fields='HotelName', select='HotelId,HotelName')
    
    for result in results:
        print("{}: {}".format(result["HotelId"], result["HotelName"]))
    ```

1. Facets are labels that can be used to compose facet navigation structure. This query returns facets and counts for Category.

    ```python
    results =  search_client.search(search_text="*", facets=["Category"])
    
    facets = results.get_facets()
    
    for facet in facets["Category"]:
        print("    {}".format(facet))
    ```

1. In this example, look up a specific document based on its key. You would typically want to return a document when a user selects a document in a search result.

    ```python
    result = search_client.get_document(key="3")
    
    print("Details for hotel '3' are:")
    print("Name: {}".format(result["HotelName"]))
    print("Rating: {}".format(result["Rating"]))
    print("Category: {}".format(result["Category"]))
    ```

1. In the last example, we'll use the autocomplete function. Autocomplete is typically used in a search box to provide potential matches as the user types into the search box.

   When the index was created, a suggester named `sg` was also created as part of the request. A suggester definition specifies which fields can be used to find potential matches to suggester requests. In this example, those fields are 'Tags', 'Address/City', 'Address/Country'. To simulate auto-complete, pass in the letters "sa" as a partial string. The autocomplete method of [SearchClient](/python/api/azure-search-documents/azure.search.documents.searchclient) sends back potential term matches.

    ```python
    search_suggestion = 'sa'
    results = search_client.autocomplete(search_text=search_suggestion, suggester_name="sg", mode='twoTerms')
    
    print("Autocomplete for:", search_suggestion)
    for result in results:
        print (result['text'])
    ```

## Clean up

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that you're limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

In this Python quickstart, you worked through the fundamental workflow using the azure.search.documents library from the Python SDK. You performed tasks that created an index, loaded it with documents, and ran queries. To continue learning, try the following tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Add search to web apps](tutorial-python-overview.md)
