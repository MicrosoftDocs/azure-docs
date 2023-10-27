---
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: include
ms.date: 06/09/2023
---

Build a Java console application using the [**Azure.Search.Documents**](/java/api/overview/azure/search) library to create, load, and query a search index. Alternatively, you can [download the source code](https://github.com/Azure-Samples/azure-search-java-samples/tree/main/quickstart) to start with a finished project or follow these steps to create your own.

#### Set up your environment

We used the following tools to create this quickstart.

+ [Visual Studio Code with the Java extension](https://code.visualstudio.com/docs/java/extensions)

+ [Java 11 SDK](/java/azure/jdk/)

#### Create the project

1. Start Visual Studio Code.

1. Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) **Ctrl+Shift+P**. Search for **Create Java Project**.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-create-project.png" alt-text="Screenshot of a Java project." border="true":::

1. Select **Maven**.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-select-maven.png" alt-text="Screenshot of a maven project." border="true":::

1. Select **maven-archetype-quickstart**.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-select-maven-project-type.png" alt-text="Screenshot of a maven quickstart project." border="true":::

1. Select the latest version, currently **1.4**.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-group-id.png" alt-text="Screenshot of the group ID location." border="true":::

1. Enter **azure.search.sample** as the group ID.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-group-id.png" alt-text="Screenshot of the group ID for search." border="true":::

1. Enter **azuresearchquickstart** as the artifact ID.

   :::image type="content" source="../../media/search-get-started-java/java-quickstart-artifact-id.png" alt-text="Screenshot of an artifact ID." border="true":::

1. Select the folder to create the project in.

1. Finish project creation in the [integrated terminal](https://code.visualstudio.com/docs/terminal/basics). Press enter to accept the default for "1.0-SNAPSHOT" and then type "y" to confirm the properties for your project.

    :::image type="content" source="../../media/search-get-started-java/java-quickstart-finish-setup-terminal.png" alt-text="Screenshot of the finished project definition." border="true":::

1. Open the folder you created the project in.

#### Specify Maven dependencies

1. Open the pom.xml file and add the following dependencies

    ```xml
    <dependencies>
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-search-documents</artifactId>
          <version>11.5.2</version>
        </dependency>
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-core</artifactId>
          <version>1.34.0</version>
        </dependency>
        <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.11</version>
          <scope>test</scope>
        </dependency>
      </dependencies>
    ```

1. Change the compiler Java version to 11

    ```xml
    <maven.compiler.source>1.11</maven.compiler.source>
    <maven.compiler.target>1.11</maven.compiler.target>
    ```

#### Create a search client

1. Open the `App` class under **src**, **main**, **java**, **azure**, **search**, **sample**. Add the following import directives

    ```java
    import java.util.Arrays;
    import java.util.ArrayList;
    import java.time.OffsetDateTime;
    import java.time.ZoneOffset;
    import java.time.LocalDateTime;
    import java.time.LocalDate;
    import java.time.LocalTime;
    
    import com.azure.core.credential.AzureKeyCredential;
    import com.azure.core.util.Context;
    import com.azure.search.documents.SearchClient;
    import com.azure.search.documents.SearchClientBuilder;
    import com.azure.search.documents.models.SearchOptions;
    import com.azure.search.documents.indexes.SearchIndexClient;
    import com.azure.search.documents.indexes.SearchIndexClientBuilder;
    import com.azure.search.documents.indexes.models.IndexDocumentsBatch;
    import com.azure.search.documents.indexes.models.SearchIndex;
    import com.azure.search.documents.indexes.models.SearchSuggester;
    import com.azure.search.documents.util.AutocompletePagedIterable;
    import com.azure.search.documents.util.SearchPagedIterable;
    ```

1. The following example includes placeholders for a search service name, admin API key that grants create and delete permissions, and index name. Substitute valid values for all three placeholders. Create two clients: [SearchIndexClient](/java/api/com.azure.search.documents.indexes.searchindexclient) creates the index, and [SearchClient](/java/api/com.azure.search.documents.searchclient) loads and queries an existing index. Both need the service endpoint and an admin API key for authentication with create and delete rights.


    ```java
    public static void main(String[] args) {
        var searchServiceEndpoint = "<YOUR-SEARCH-SERVICE-URL>";
        var adminKey = new AzureKeyCredential("<YOUR-SEARCH-SERVICE-ADMIN-KEY>");
        String indexName = "<YOUR-SEARCH-INDEX-NAME>";

        SearchIndexClient searchIndexClient = new SearchIndexClientBuilder()
            .endpoint(searchServiceEndpoint)
            .credential(adminKey)
            .buildClient();

        SearchClient searchClient = new SearchClientBuilder()
            .endpoint(searchServiceEndpoint)
            .credential(adminKey)
            .indexName(indexName)
            .buildClient();
    }
    ```

#### Create an index

This quickstart builds a Hotels index that you'll load with hotel data and execute queries against. In this step, define the fields in the index. Each field definition includes a name, data type, and attributes that determine how the field is used.

In this example, synchronous methods of the azure-search-documents library are used for simplicity and readability. However, for production scenarios, you should use asynchronous methods to keep your app scalable and responsive. For example, you would use [SearchAsyncClient](/java/api/com.azure.search.documents.searchasyncclient) instead of SearchClient.

1. Add an empty class definition to your project: **Hotel.java**

1. Copy the following code into **Hotel.java** to define the structure of a hotel document. Attributes on the field determine how it's used in an application. For example, the IsFilterable annotation must be assigned to every field that supports a filter expression

    ```java
    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    
    package azure.search.sample;
    
    import com.azure.search.documents.indexes.SearchableField;
    import com.azure.search.documents.indexes.SimpleField;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import com.fasterxml.jackson.core.JsonProcessingException;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.annotation.JsonInclude.Include;
    
    import java.time.OffsetDateTime;
    
    /**
     * Model class representing a hotel.
     */
    @JsonInclude(Include.NON_NULL)
    public class Hotel {
        /**
         * Hotel ID
         */
        @JsonProperty("HotelId")
        @SimpleField(isKey = true)
        public String hotelId;
    
        /**
         * Hotel name
         */
        @JsonProperty("HotelName")
        @SearchableField(isSortable = true)
        public String hotelName;
    
        /**
         * Description
         */
        @JsonProperty("Description")
        @SearchableField(analyzerName = "en.microsoft")
        public String description;
    
        /**
         * French description
         */
        @JsonProperty("DescriptionFr")
        @SearchableField(analyzerName = "fr.lucene")
        public String descriptionFr;
    
        /**
         * Category
         */
        @JsonProperty("Category")
        @SearchableField(isFilterable = true, isSortable = true, isFacetable = true)
        public String category;
    
        /**
         * Tags
         */
        @JsonProperty("Tags")
        @SearchableField(isFilterable = true, isFacetable = true)
        public String[] tags;
    
        /**
         * Whether parking is included
         */
        @JsonProperty("ParkingIncluded")
        @SimpleField(isFilterable = true, isSortable = true, isFacetable = true)
        public Boolean parkingIncluded;
    
        /**
         * Last renovation time
         */
        @JsonProperty("LastRenovationDate")
        @SimpleField(isFilterable = true, isSortable = true, isFacetable = true)
        public OffsetDateTime lastRenovationDate;
    
        /**
         * Rating
         */
        @JsonProperty("Rating")
        @SimpleField(isFilterable = true, isSortable = true, isFacetable = true)
        public Double rating;
    
        /**
         * Address
         */
        @JsonProperty("Address")
        public Address address;
    
        @Override
        public String toString()
        {
            try
            {
                return new ObjectMapper().writeValueAsString(this);
            }
            catch (JsonProcessingException e)
            {
                e.printStackTrace();
                return "";
            }
        }
    }
    ```

In the Azure.Search.Documents client library, you can use [SearchableField](/java/api/com.azure.search.documents.indexes.searchablefield) and [SimpleField](/java/api/com.azure.search.documents.indexes.simplefield) to streamline field definitions.

   * `SimpleField` can be any data type, is always non-searchable (it's ignored for full text search queries), and is retrievable (it's not hidden). Other attributes are off by default, but can be enabled. You might use a SimpleField for document IDs or fields used only in filters, facets, or scoring profiles. If so, be sure to apply any attributes that are necessary for the scenario, such as IsKey = true for a document ID.
   * `SearchableField` must be a string, and is always searchable and retrievable. Other attributes are off by default, but can be enabled. Because this field type is searchable, it supports synonyms and the full complement of analyzer properties.

Whether you use the basic `SearchField` API or either one of the helper models, you must explicitly enable filter, facet, and sort attributes. For example, `isFilterable`, `isSortable`, and `isFacetable` must be explicitly attributed, as shown in the sample above.

1. Add a second empty class definition to your project: **Address.cs**. Copy the following code into the class.

    ```java
    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    
    package azure.search.sample;
    
    import com.azure.search.documents.indexes.SearchableField;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import com.fasterxml.jackson.annotation.JsonInclude.Include;
    
    /**
     * Model class representing an address.
     */
    @JsonInclude(Include.NON_NULL)
    public class Address {
        /**
         * Street address
         */
        @JsonProperty("StreetAddress")
        @SearchableField
        public String streetAddress;
    
        /**
         * City
         */
        @JsonProperty("City")
        @SearchableField(isFilterable = true, isSortable = true, isFacetable = true)
        public String city;
    
        /**
         * State or province
         */
        @JsonProperty("StateProvince")
        @SearchableField(isFilterable = true, isSortable = true, isFacetable = true)
        public String stateProvince;
    
        /**
         * Postal code
         */
        @JsonProperty("PostalCode")
        @SearchableField(isFilterable = true, isSortable = true, isFacetable = true)
        public String postalCode;
    
        /**
         * Country
         */
        @JsonProperty("Country")
        @SearchableField(isFilterable = true, isSortable = true, isFacetable = true)
        public String country;
    }
    ```

1. In **App.java**, create a `SearchIndex` object in the **main** method, and then call the `createOrUpdateIndex` method to create the index in your search service. The index also includes a `SearchSuggester` to enable autocomplete on the specified fields.

    ```java
    // Create Search Index for Hotel model
    searchIndexClient.createOrUpdateIndex(
        new SearchIndex(indexName, SearchIndexClient.buildSearchFields(Hotel.class, null))
        .setSuggesters(new SearchSuggester("sg", Arrays.asList("HotelName"))));
    ```

#### Load Documents

Azure AI Search searches over content stored in the service. In this step, you'll load JSON documents that conform to the hotel index you just created.

In Azure AI Search, search documents are data structures that are both inputs to indexing and outputs from queries. As obtained from an external data source, document inputs might be rows in a database, blobs in Blob storage, or JSON documents on disk. In this example, we're taking a shortcut and embedding JSON documents for four hotels in the code itself.

When uploading documents, you must use an [IndexDocumentsBatch](/java/api/com.azure.search.documents.indexes.models.indexdocumentsbatch) object. An `IndexDocumentsBatch` object contains a collection of [IndexActions](/java/api/com.azure.search.documents.models.indexaction), each of which contains a document and a property telling Azure AI Search what action to perform (upload, merge, delete, and mergeOrUpload).

1. In **App.java**, create documents and index actions, and then pass them to `IndexDocumentsBatch`. The documents below conform to the hotels-quickstart index, as defined by the hotel class.

    ```java
    // Upload documents in a single Upload request.
    private static void uploadDocuments(SearchClient searchClient)
    {
        var hotelList = new ArrayList<Hotel>();

        var hotel = new Hotel();
        hotel.hotelId = "1";
        hotel.hotelName = "Secret Point Motel";
        hotel.description = "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.";
        hotel.descriptionFr = "L'hôtel est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.";
        hotel.category = "Boutique";
        hotel.tags = new String[] { "pool", "air conditioning", "concierge" };
        hotel.parkingIncluded = false;
        hotel.lastRenovationDate = OffsetDateTime.of(LocalDateTime.of(LocalDate.of(1970, 1, 18), LocalTime.of(0, 0)), ZoneOffset.UTC);
        hotel.rating = 3.6;
        hotel.address = new Address();
        hotel.address.streetAddress = "677 5th Ave";
        hotel.address.city = "New York";
        hotel.address.stateProvince = "NY";
        hotel.address.postalCode = "10022";
        hotel.address.country = "USA";
        hotelList.add(hotel);

        hotel = new Hotel();
        hotel.hotelId = "2";
        hotel.hotelName = "Twin Dome Motel";
        hotel.description = "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.";
        hotel.descriptionFr = "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.";
        hotel.category = "Boutique";
        hotel.tags = new String[] { "pool", "free wifi", "concierge" };
        hotel.parkingIncluded = false;
        hotel.lastRenovationDate = OffsetDateTime.of(LocalDateTime.of(LocalDate.of(1979, 2, 18), LocalTime.of(0, 0)), ZoneOffset.UTC);
        hotel.rating = 3.60;
        hotel.address = new Address();
        hotel.address.streetAddress = "140 University Town Center Dr";
        hotel.address.city = "Sarasota";
        hotel.address.stateProvince = "FL";
        hotel.address.postalCode = "34243";
        hotel.address.country = "USA";
        hotelList.add(hotel);

        hotel = new Hotel();
        hotel.hotelId = "3";
        hotel.hotelName = "Triple Landscape Hotel";
        hotel.description = "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.";
        hotel.descriptionFr = "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.";
        hotel.category = "Resort and Spa";
        hotel.tags = new String[] { "air conditioning", "bar", "continental breakfast" };
        hotel.parkingIncluded = true;
        hotel.lastRenovationDate = OffsetDateTime.of(LocalDateTime.of(LocalDate.of(2015, 9, 20), LocalTime.of(0, 0)), ZoneOffset.UTC);
        hotel.rating = 4.80;
        hotel.address = new Address();
        hotel.address.streetAddress = "3393 Peachtree Rd";
        hotel.address.city = "Atlanta";
        hotel.address.stateProvince = "GA";
        hotel.address.postalCode = "30326";
        hotel.address.country = "USA";
        hotelList.add(hotel);

        hotel = new Hotel();
        hotel.hotelId = "4";
        hotel.hotelName = "Sublime Cliff Hotel";
        hotel.description = "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.";
        hotel.descriptionFr = "Le sublime Cliff Hotel est situé au coeur du centre historique de sublime dans un quartier extrêmement animé et vivant, à courte distance de marche des sites et monuments de la ville et est entouré par l'extraordinaire beauté des églises, des bâtiments, des commerces et Monuments. Sublime Cliff fait partie d'un Palace 1800 restauré avec amour.";
        hotel.category = "Boutique";
        hotel.tags = new String[] { "concierge", "view", "24-hour front desk service" };
        hotel.parkingIncluded = true;
        hotel.lastRenovationDate = OffsetDateTime.of(LocalDateTime.of(LocalDate.of(1960, 2, 06), LocalTime.of(0, 0)), ZoneOffset.UTC);
        hotel.rating = 4.60;
        hotel.address = new Address();
        hotel.address.streetAddress = "7400 San Pedro Ave";
        hotel.address.city = "San Antonio";
        hotel.address.stateProvince = "TX";
        hotel.address.postalCode = "78216";
        hotel.address.country = "USA";
        hotelList.add(hotel);

        var batch = new IndexDocumentsBatch<Hotel>();
        batch.addMergeOrUploadActions(hotelList);
        try
        {
            searchClient.indexDocuments(batch);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            // If for some reason any documents are dropped during indexing, you can compensate by delaying and
            // retrying. This simple demo just logs failure and continues
            System.err.println("Failed to index some of the documents");
        }
    }
    ```

Once you initialize the `IndexDocumentsBatch` object, you can send it to the index by calling [indexDocuments](/java/api/com.azure.search.documents.searchclient#com-azure-search-documents-searchclient-indexdocuments(com-azure-search-documents-indexes-models-indexdocumentsbatch(-))) on your `SearchClient` object.

1. Add the following lines to `Main()`. Loading documents is done using `SearchClient`.

    ```java
    // Upload sample hotel documents to the Search Index
    uploadDocuments(searchClient);
    ```

1. Because this is a console app that runs all commands sequentially, add a 2-second wait time between indexing and queries.

    ```java
    // Wait 2 seconds for indexing to complete before starting queries (for demo and console-app purposes only)
    System.out.println("Waiting for indexing...\n");
    try
    {
        Thread.sleep(2000);
    }
    catch (InterruptedException e)
    {
    }
    ```

The 2-second delay compensates for indexing, which is asynchronous, so that all documents can be indexed before the queries are executed. Coding in a delay is typically only necessary in demos, tests, and sample applications.

#### Search an index

You can get query results as soon as the first document is indexed, but actual testing of your index should wait until all documents are indexed.

This section adds two pieces of functionality: query logic, and results. For queries, use the Search method. This method takes search text (the query string) and other options.

1. In **App.java**, create a WriteDocuments method that prints search results to the console.

    ```java
    // Write search results to console
    private static void WriteSearchResults(SearchPagedIterable searchResults)
    {
        searchResults.iterator().forEachRemaining(result ->
        {
            Hotel hotel = result.getDocument(Hotel.class);
            System.out.println(hotel);
        });

        System.out.println();
    }

    // Write autocomplete results to console
    private static void WriteAutocompleteResults(AutocompletePagedIterable autocompleteResults)
    {
        autocompleteResults.iterator().forEachRemaining(result ->
        {
            String text = result.getText();
            System.out.println(text);
        });

        System.out.println();
    }
    ```

1. Create a `RunQueries` method to execute queries and return results. Results are `Hotel` objects. This sample shows the method signature and the first query. This query demonstrates the `Select` parameter that lets you compose the result using selected fields from the document.

    ```java
    // Run queries, use WriteDocuments to print output
    private static void RunQueries(SearchClient searchClient)
    {
        // Query 1
        System.out.println("Query #1: Search on empty term '*' to return all documents, showing a subset of fields...\n");

        SearchOptions options = new SearchOptions();
        options.setIncludeTotalCount(true);
        options.setFilter("");
        options.setOrderBy("");
        options.setSelect("HotelId", "HotelName", "Address/City");

        WriteSearchResults(searchClient.search("*", options, Context.NONE));
    }
    ```

1. In the second query, search on a term, add a filter that selects documents where Rating is greater than 4, and then sort by Rating in descending order. Filter is a boolean expression that is evaluated over `isFilterable` fields in an index. Filter queries either include or exclude values. As such, there's no relevance score associated with a filter query.

    ```java
    // Query 2
    System.out.println("Query #2: Search on 'hotels', filter on 'Rating gt 4', sort by Rating in descending order...\n");

    options = new SearchOptions();
    options.setFilter("Rating gt 4");
    options.setOrderBy("Rating desc");
    options.setSelect("HotelId", "HotelName", "Rating");

    WriteSearchResults(searchClient.search("hotels", options, Context.NONE));
    ```

1. The third query demonstrates `searchFields`, used to scope a full text search operation to specific fields.

    ```java
    // Query 3
    System.out.println("Query #3: Limit search to specific fields (pool in Tags field)...\n");

    options = new SearchOptions();
    options.setSearchFields("Tags");

    options.setSelect("HotelId", "HotelName", "Tags");

    WriteSearchResults(searchClient.search("pool", options, Context.NONE));
    ```

1. The fourth query demonstrates facets, which can be used to structure a faceted navigation structure.

    ```java
    // Query 4
    System.out.println("Query #4: Facet on 'Category'...\n");

    options = new SearchOptions();
    options.setFilter("");
    options.setFacets("Category");
    options.setSelect("HotelId", "HotelName", "Category");

    WriteSearchResults(searchClient.search("*", options, Context.NONE));
    ```

1. In the fifth query, return a specific document.

    ```java
    // Query 5
    System.out.println("Query #5: Look up a specific document...\n");

    Hotel lookupResponse = searchClient.getDocument("3", Hotel.class);
    System.out.println(lookupResponse.hotelId);
    System.out.println();
    ```

1. The last query shows the syntax for autocomplete, simulating a partial user input of "s" that resolves to two possible matches in the `sourceFields` associated with the suggester you defined in the index.

    ```java
    // Query 6
    System.out.println("Query #6: Call Autocomplete on HotelName that starts with 's'...\n");

    WriteAutocompleteResults(searchClient.autocomplete("s", "sg"));
    ```

1. Add RunQueries to Main().

    ```java
    // Call the RunQueries method to invoke a series of queries
    System.out.println("Starting queries...\n");
    RunQueries(searchClient);

    // End the program
    System.out.println("Complete.\n");
    ```

The previous queries show multiple ways of matching terms in a query: full-text search, filters, and autocomplete.

Full text search and filters are performed using the [SearchClient.search](/java/api/com.azure.search.documents.searchclient#com-azure-search-documents-searchclient-search(java-lang-string)) method. A search query can be passed in the `searchText` string, while a filter expression can be passed in the `filter` property of the [SearchOptions](/java/api/com.azure.search.documents.models.searchoptions) class. To filter without searching, just pass "*" for the `searchText` parameter of the `search` method. To search without filtering, leave the `filter` property unset, or don't pass in a `SearchOptions` instance at all.

### Run the program

Press F5 to rebuild the app and run the program in its entirety.

Output includes messages from System.out.println, with the addition of query information and results.
