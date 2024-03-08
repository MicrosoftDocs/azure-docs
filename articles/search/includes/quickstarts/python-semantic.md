---
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 11/05/2023
---

Build a Jupyter Notebook using the [**azure-search-documents**](/python/api/overview/azure/search-documents-readme) library to add semantic ranking to an existing search index. 

Alternatively, you can [download and run a finished Jupyter Python notebook](https://github.com/Azure-Samples/azure-search-python-samples/tree/main/Quickstart-Semantic-Search) or follow these steps to create your own.

#### Set up your environment

We used the following tools to create this quickstart.

* [Visual Studio Code with the Python extension](https://code.visualstudio.com/docs/languages/python) (or an equivalent IDE), with Python 3.7 or later

* [azure-search-documents package](https://pypi.org/project/azure-search-documents) from the Azure SDK for Python

#### Connect to Azure AI Search

In this task, create the notebook, load the libraries, and set up your clients.

1. Create a new Python3 notebook in Visual Studio Code:

    1. Press F1 and search for "Python Select Interpreter" and choose a version of Python 3.7 or later.
    1. Press F1 again and search for "Create: New Jupyter Notebook". You should have an empty, untitled `.ipynb` file open in the editor ready for the first entry.

1. In the first cell, load the libraries from the Azure SDK for Python, including [azure-search-documents](/python/api/azure-search-documents). This code imports "SemanticConfiguration", "PrioritizedFields", "SemanticField", and "SemanticSettings".

    ```python
    %pip install azure-search-documents --pre
    %pip show azure-search-documents
    %pip install python-dotenv
    
    import os
    from azure.core.credentials import AzureKeyCredential
    from azure.search.documents.indexes import SearchIndexClient 
    from azure.search.documents import SearchClient
    from azure.search.documents.indexes.models import (  
        SearchIndex,  
        SearchField,  
        SearchFieldDataType,  
        SimpleField,  
        SearchableField,
        ComplexField,
        SearchIndex,  
        SemanticConfiguration,  
        PrioritizedFields,  
        SemanticField,  
        SemanticSettings,  
    )
    ```

1. Set the service endpoint and API key from the environment. Because the code builds out the URI for you, specify just the search service name in the service name property.

    ```python
    service_name = "<YOUR-SEARCH-SERVICE-NAME>"
    admin_key = "<YOUR-SEARCH-SERVICE-ADMIN-KEY>"
    
    index_name = "hotels-quickstart"
    
    endpoint = "https://{}.search.windows.net/".format(service_name)
    admin_client = SearchIndexClient(endpoint=endpoint,
                          index_name=index_name,
                          credential=AzureKeyCredential(admin_key))
    
    search_client = SearchClient(endpoint=endpoint,
                          index_name=index_name,
                          credential=AzureKeyCredential(admin_key))
    ```

1. Delete the index if it exists. This step allows your code to create a new version of the index.

    ```python
    try:
        result = admin_client.delete_index(index_name)
        print ('Index', index_name, 'Deleted')
    except Exception as ex:
        print (ex)
    ```

#### Create or update an index

1. Create or update an index schema to include `SemanticConfiguration` and `SemanticSettings`. If you're updating an existing index, this modification doesn't require a reindexing because the structure of your documents is unchanged.

    ```python
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
    semantic_config = SemanticConfiguration(
        name="my-semantic-config",
        prioritized_fields=PrioritizedFields(
            title_field=SemanticField(field_name="HotelName"),
            prioritized_keywords_fields=[SemanticField(field_name="Category")],
            prioritized_content_fields=[SemanticField(field_name="Description")]
        )
    )
    
    semantic_settings = SemanticSettings(configurations=[semantic_config])
    scoring_profiles = []
    suggester = [{'name': 'sg', 'source_fields': ['Tags', 'Address/City', 'Address/Country']}]
    ```

1. Send the request. Notice that `SearchIndex()` takes a `semantic_settings` parameter.

    ```python
    index = SearchIndex(
        name=name,
        fields=fields,
        semantic_settings=semantic_settings,
        scoring_profiles=scoring_profiles,
        suggesters = suggester)
    
    try:
        result = admin_client.create_index(index)
        print ('Index', result.name, 'created')
    except Exception as ex:
        print (ex)
    ```

1. If you're creating a new index, upload some documents to be indexed. This document payload is identical to the one used in the full text search quickstart. 

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

1. Send the request.

    ```python
    try:
        result = search_client.upload_documents(documents=documents)
        print("Upload of new document succeeded: {}".format(result[0].succeeded))
    except Exception as ex:
        print (ex.message)
    ```

#### Run queries

1. Start with an empty query as a verification step, proving that the index is operational. You should get an unordered list of hotel names and descriptions, with a count of 4 indicating that there are four documents in the index.

    ```python
    results =  search_client.search(query_type='simple',
        search_text="*" ,
        select='HotelName,Description',
        include_total_count=True)
    
    print ('Total Documents Matching Query:', results.get_count())
    for result in results:
        print(result["@search.score"])
        print(result["HotelName"])
        print(f"Description: {result['Description']}")
    ```

1. For comparison purposes, execute a basic query that invokes full text search and BM25 relevance scoring. Full text search is invoked when you provide a query string. The response consists of ranked results, where higher scores are awarded to documents having more instances of matching terms, or more important terms.

   In this query for "what hotel has a good restaurant on site", Sublime Cliff Hotel comes out on top because its description includes "site". Terms that occur infrequently raise the search score of the document. 
    
    ```python
    results =  search_client.search(query_type='simple',
        search_text="what hotel has a good restaurant on site" ,
        select='HotelName,HotelId,Description')
    
    for result in results:
        print(result["@search.score"])
        print(result["HotelName"])
        print(f"Description: {result['Description']}")
    ```

1. Now add semantic ranking. New parameters include `query_type` and `semantic_configuration_name`.

   It's the same query, but notice that the semantic ranker correctly identifies Triple Landscape Hotel as a more relevant result given the initial query. This query also returns captions generated by the models. The inputs are too minimal in this sample to create interesting captions, but the example succeeds in demonstrating the syntax.

    ```python
    results =  search_client.search(query_type='semantic', semantic_configuration_name='my-semantic-config',
        search_text="what hotel has a good restaurant on site", 
        select='HotelName,Description,Category', query_caption='extractive')
    
    for result in results:
        print(result["@search.reranker_score"])
        print(result["HotelName"])
        print(f"Description: {result['Description']}")
        
        captions = result["@search.captions"]
        if captions:
            caption = captions[0]
            if caption.highlights:
                print(f"Caption: {caption.highlights}\n")
            else:
                print(f"Caption: {caption.text}\n")
    ```

1. In this final query, return semantic answers.

   Semantic ranking can generate answers to a query string that has the characteristics of a question. The generated answer is extracted verbatim from your content. To get a semantic answer, the question and answer must be closely aligned, and the model must find content that clearly answers the question. If potential answers fail to meet a confidence threshold, the model won't return an answer. For demonstration purposes, the question in this example is designed to get a response so that you can see the syntax.

   ```python
   results =  search_client.search(query_type='semantic', semantic_configuration_name='my-semantic-config',
    search_text="what hotel stands out for its gastronomic excellence", 
    select='HotelName,Description,Category', query_caption='extractive', query_answer="extractive",)

   semantic_answers = results.get_answers()
   for answer in semantic_answers:
       if answer.highlights:
           print(f"Semantic Answer: {answer.highlights}")
       else:
           print(f"Semantic Answer: {answer.text}")
       print(f"Semantic Answer Score: {answer.score}\n")
    
   for result in results:
       print(result["@search.reranker_score"])
       print(result["HotelName"])
       print(f"Description: {result['Description']}")
       
       captions = result["@search.captions"]
       if captions:
           caption = captions[0]
           if caption.highlights:
               print(f"Caption: {caption.highlights}\n")
           else:
               print(f"Caption: {caption.text}\n")
   ```
