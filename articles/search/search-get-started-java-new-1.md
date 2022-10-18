---
title: 'Quickstart: Create a search index in Java'
titleSuffix: Azure Cognitive Search
description: In this Java quickstart, learn how to create an index, load data, and run queries using the Azure Cognitive Search client library for Java.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.devlang: java
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 10/17/2022

---

# Quickstart: Create an Azure Cognitive Search index in Java

In this quickstart, you'll learn how to use the [Azure.Search.Documents (version 11) client library](/java/api/overview/azure/search-documents-readme) to create a console application in Java that creates, loads, and queries a search index.

You can [download the source code](https://github.com/Azure-Samples/azure-search-java-samples) to start with a finished project or follow the steps in this article to create your own.

## Prerequisites

Azure subscription - Create one for free
Azure Cognitive Search
Visual Studio Code with the Java Extension Pack
[Apache Maven](https://maven.apache.org/install.html)

## Get a key and URL

Calls to the service require a URL endpoint and an access key on every request. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Get the service name and admin and query keys" border="false":::

Every request sent to your service requires an API key. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Set up the environment

TBD

1. Confirm Java and Maven installations. At a command prompt, enter `java -version` followed by `mvn -version`. If you don't see version and location, check the prerequisites.

1. Start Visual Studio Code and create a new folder to store your project files.

1. Create a new `pom.xml` file in the root of your project, and copy the following into it:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
    
      <parent>
        <groupId>com.azure</groupId>
        <artifactId>azure-client-sdk-parent</artifactId>
        <version>1.7.0</version><!-- {x-version-update;com.azure:azure-client-sdk-parent;current} -->
        <relativePath>../../parents/azure-client-sdk-parent</relativePath>
      </parent>
    
      <name>Microsoft Azure Cognitive Search client for Java</name>
      <description>This package contains client functionality for Microsoft Azure Cognitive Search</description>
    
      <groupId>com.azure</groupId>
      <artifactId>azure-search-documents</artifactId>
      <version>11.5.1</version> <!-- {x-version-update;com.azure:azure-search-documents;current} -->
      <packaging>jar</packaging>
    
      <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <jacoco.min.linecoverage>0.70</jacoco.min.linecoverage>
        <jacoco.min.branchcoverage>0.60</jacoco.min.branchcoverage>
        <!-- Configures the Java 9+ run to perform the required module exports, opens, and reads that are necessary for testing but shouldn't be part of the module-info. -->
        <javaModulesSurefireArgLine>
          --add-exports com.azure.core/com.azure.core.implementation.http=ALL-UNNAMED
          --add-exports com.azure.core/com.azure.core.implementation.jackson=ALL-UNNAMED
          --add-opens com.azure.core/com.azure.core.util=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents.indexes=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents.models=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents.implementation=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents.implementation.models=ALL-UNNAMED
          --add-opens com.azure.search.documents/com.azure.search.documents.test.environment.models=com.fasterxml.jackson.databind
          --add-opens com.azure.search.documents/com.azure.search.documents.test.environment.models=ALL-UNNAMED
          --add-reads com.azure.search.documents=com.azure.core.serializer.json.jackson
          --add-reads com.azure.core=ALL-UNNAMED
          --add-reads com.azure.core.test=ALL-UNNAMED
          --add-reads com.azure.core.http.netty=ALL-UNNAMED
        </javaModulesSurefireArgLine>
      </properties>
    
      <dependencies>
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-core</artifactId>
          <version>1.33.0</version> <!-- {x-version-update;com.azure:azure-core;dependency} -->
        </dependency>
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-core-http-netty</artifactId>
          <version>1.12.6</version> <!-- {x-version-update;com.azure:azure-core-http-netty;dependency} -->
        </dependency>
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-core-serializer-json-jackson</artifactId>
          <version>1.2.22</version> <!-- {x-version-update;com.azure:azure-core-serializer-json-jackson;dependency} -->
        </dependency>
    
        <!-- Added this dependency to include necessary annotations used by reactor core.
        Without this dependency, javadoc throws a warning as it cannot find enum When.MAYBE
        which is used in @Nullable annotation in reactor core classes -->
        <dependency>
          <groupId>com.google.code.findbugs</groupId>
          <artifactId>jsr305</artifactId>
          <version>3.0.2</version> <!-- {x-version-update;com.google.code.findbugs:jsr305;external_dependency} -->
          <scope>provided</scope>
        </dependency>
      </dependencies>
    </project>
    ```

1. Install the Azure.Search.Documents package and dependencies.

    ```console
    mvn clean dependency:copy-dependencies
    ```

### Set environment variables

Your client code must be authenticated to access Azure Cognitive Search. 

For this quickstart, you'll copy in an API key and search endpoint from Azure portal. For production, use a secure way of storing and accessing your credentials. For example, you could use Azure Active Directory roles or encrypt an API key in Azure Key Vault.

> [!NOTE]
> Don't include the key directly in your code, and never post it publicly.

Open a console window and run the following commands, substituting valid values for the placeholders.

First, set the API key:

```bash
set AZURE_COGNITIVE_SEARCH_API_KEY <your-search-admin-api-key>
```

Next, provide a URL to your search service:

```bash
set AZURE_COGNITIVE_SEARCH_ENDPOINT <fully-qualified-url>
```

## Create a search index

Follow these steps to create a new console application that creates, loads, and queries an index.

1. Create a new file named `CreateIndex.java` in the same project root directory.
1. Copy the following code into `CreateIndex.java`:

    ```java
    package com.azure.search.documents.indexes;
    
    import com.azure.core.credential.AzureKeyCredential;
    import com.azure.core.util.Configuration;
    import com.azure.search.documents.indexes.models.LexicalAnalyzerName;
    import com.azure.search.documents.indexes.models.SearchField;
    import com.azure.search.documents.indexes.models.SearchFieldDataType;
    import com.azure.search.documents.indexes.models.SearchIndex;
    
    import java.util.Arrays;
    
    public class CreateIndexExample {
        /**
         * From the Azure portal, get your Azure Cognitive Search service name and API key and populate ADMIN_KEY and
         * SEARCH_SERVICE_NAME.
         */
        private static final String ENDPOINT = Configuration.getGlobalConfiguration().get("AZURE_COGNITIVE_SEARCH_ENDPOINT");
        private static final String ADMIN_KEY = Configuration.getGlobalConfiguration().get("AZURE_COGNITIVE_SEARCH_API_KEY");
    
        public static void main(String[] args) {
            // Create the SearchIndex client.
            SearchIndexClient client = new SearchIndexClientBuilder()
                .endpoint(ENDPOINT)
                .credential(new AzureKeyCredential(ADMIN_KEY))
                .buildClient();
    
            // Configure the index using SearchFields
            String indexName = "hotels";
            SearchIndex newIndex = new SearchIndex(indexName, Arrays.asList(
                new SearchField("hotelId", SearchFieldDataType.STRING)
                    .setKey(true)
                    .setFilterable(true)
                    .setSortable(true),
                new SearchField("hotelName", SearchFieldDataType.STRING)
                    .setSearchable(true)
                    .setFilterable(true)
                    .setSortable(true),
                new SearchField("description", SearchFieldDataType.STRING)
                    .setSearchable(true)
                    .setAnalyzerName(LexicalAnalyzerName.EN_LUCENE),
                new SearchField("descriptionFr", SearchFieldDataType.STRING)
                    .setSearchable(true)
                    .setAnalyzerName(LexicalAnalyzerName.FR_LUCENE),
                new SearchField("tags", SearchFieldDataType.collection(SearchFieldDataType.STRING))
                    .setSearchable(true)
                    .setFilterable(true)
                    .setFacetable(true),
                new SearchField("address", SearchFieldDataType.COMPLEX)
                    .setFields(
                        new SearchField("streetAddress", SearchFieldDataType.STRING)
                            .setSearchable(true),
                        new SearchField("city", SearchFieldDataType.STRING)
                            .setFilterable(true)
                            .setSortable(true)
                            .setFacetable(true),
                        new SearchField("stateProvince", SearchFieldDataType.STRING)
                            .setSearchable(true)
                            .setFilterable(true)
                            .setSortable(true)
                            .setFacetable(true),
                        new SearchField("country", SearchFieldDataType.STRING)
                            .setSearchable(true)
                            .setSynonymMapNames("synonymMapName")
                            .setFilterable(true)
                            .setSortable(true)
                            .setFacetable(true),
                        new SearchField("postalCode", SearchFieldDataType.STRING)
                            .setSearchable(true)
                            .setFilterable(true)
                            .setSortable(true)
                            .setFacetable(true))
            ));
    
            // Create index.
            client.createIndex(newIndex);
    
            // Cleanup index resource.
            client.deleteIndex(indexName);
        }
    }
    ```

Run your new console application to start speech synthesis to the default speaker.

```console
javac CreateIndex.java -cp ".;target\dependency\*"
java -cp ".;target\dependency\*" CreateIndex
```

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

In this Java quickstart, you worked through a series of tasks to create an index, load it with documents, and run queries. If you are comfortable with the basic concepts, we recommend the following article that lists indexer operations in REST.

> [!div class="nextstepaction"]
> [Indexer operations](/rest/api/searchservice/indexer-operations)