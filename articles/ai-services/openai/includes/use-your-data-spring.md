---
services: cognitive-services
manager: nitinme
author: gm2552
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/27/2023
---

[!INCLUDE [Set up required variables](./use-your-data-spring-common-variables.md)]

## Create a new Spring application

Spring AI doesn't currently support the *AzureCognitiveSearchChatExtensionConfiguration* options that allow an Azure AI query to encapsulate the [Retrieval Augmented Generation](../../../search/retrieval-augmented-generation-overview.md) (RAG) method and hide the details from the user. As an alternative, you can still invoke the RAG method directly in your application to query data in your Azure AI Search index and use retrieved documents to augment your query.

Spring AI supports a VectorStore abstraction, and you can wrap Azure AI Search can be wrapped in a Spring AI VectorStore implementation for querying your custom data. The following project implements a custom VectorStore backed by Azure AI Search and directly executes RAG operations.

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir ai-completion-demo && cd ai-completion-demo
```

Run the `spring init` command from your working directory. This command creates a standard directory structure for your Spring project including the main Java class source file and the *pom.xml*
file used for managing Maven based projects.

```console
spring init -a ai-custom-data-demo -n AICustomData --force --build maven -x
```

The generated files and folders resemble the following structure:

```
ai-custom-data-demo/
|-- pom.xml
|-- mvn
|-- mvn.cmd
|-- HELP.md
|-- src/
    |-- main/
    |   |-- resources/
    |   |   |-- application.properties
    |   |-- java/
    |       |-- com/
    |           |-- example/
    |               |-- aicustomdatademo/
    |                   |-- AiCustomDataApplication.java
    |-- test/
        |-- java/
            |-- com/
                |-- example/
                    |-- aicustomdatademo/
                        |-- AiCustomDataApplicationTests.java
```

## Edit Spring application

1. Edit pom.xml file.

   From the root of the project directory, open the *pom.xml* file in your preferred editor or IDE and overwrite the file with following content:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <parent>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-parent</artifactId>
           <version>3.2.0</version>
           <relativePath/> <!-- lookup parent from repository -->
       </parent>
       <groupId>com.example</groupId>
       <artifactId>ai-custom-data-demo</artifactId>
       <version>0.0.1-SNAPSHOT</version>
       <name>AICustomData</name>
       <description>Demo project for Spring Boot</description>
       <properties>
           <java.version>17</java.version>
       </properties>
       <dependencies>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter</artifactId>
           </dependency>
           <dependency>
               <groupId>org.springframework.experimental.ai</groupId>
               <artifactId>spring-ai-azure-openai-spring-boot-starter</artifactId>
               <version>0.7.0-SNAPSHOT</version>
           </dependency>
           <dependency>
               <groupId>com.azure</groupId>
               <artifactId>azure-search-documents</artifactId>
               <version>11.6.0-beta.10</version>
               <exclusions>
                   <!-- exclude this to avoid changing the default serializer and the null-value behavior -->
                   <exclusion>
                       <groupId>com.azure</groupId>
                       <artifactId>azure-core-serializer-json-jackson</artifactId>
                   </exclusion>
               </exclusions>
           </dependency>
           <dependency>
               <groupId>org.projectlombok</groupId>
               <artifactId>lombok</artifactId>
               <optional>true</optional>
           </dependency>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-test</artifactId>
               <scope>test</scope>
           </dependency>
       </dependencies>

       <build>
           <plugins>
               <plugin>
                   <groupId>org.springframework.boot</groupId>
                   <artifactId>spring-boot-maven-plugin</artifactId>
               </plugin>
           </plugins>
       </build>
       <repositories>
           <repository>
               <id>spring-snapshots</id>
               <name>Spring Snapshots</name>
               <url>https://repo.spring.io/snapshot</url>
               <releases>
                   <enabled>false</enabled>
               </releases>
           </repository>
       </repositories>
   </project>
   ```

1. From the *src/main/java/com/example/aicustomdatademo* folder, open *AiCustomDataApplication.java* in your preferred editor or IDE and paste in the following code.

   ```java
   package com.example.aicustomdatademo;

   import java.util.Collections;
   import java.util.List;
   import java.util.Map;
   import java.util.Optional;
   import java.util.stream.Collectors;

   import org.springframework.ai.client.AiClient;
   import org.springframework.ai.document.Document;
   import org.springframework.ai.embedding.EmbeddingClient;
   import org.springframework.ai.prompt.Prompt;
   import org.springframework.ai.prompt.SystemPromptTemplate;
   import org.springframework.ai.prompt.messages.MessageType;
   import org.springframework.ai.prompt.messages.UserMessage;
   import org.springframework.ai.vectorstore.VectorStore;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.Bean;

   import com.azure.core.credential.AzureKeyCredential;
   import com.azure.core.util.Context;
   import com.azure.search.documents.SearchClient;
   import com.azure.search.documents.SearchClientBuilder;
   import com.azure.search.documents.models.IndexingResult;
   import com.azure.search.documents.models.SearchOptions;
   import com.azure.search.documents.models.RawVectorQuery;

   import lombok.AllArgsConstructor;
   import lombok.NoArgsConstructor;
   import lombok.Builder;
   import lombok.Data;
   import lombok.extern.jackson.Jacksonized;

   @SpringBootApplication
   public class AiCustomDataApplication implements CommandLineRunner
   {
       private static final String ROLE_INFO_KEY = "role";

       private static final String template = """
               You are a helpful assistant. Use the information from the DOCUMENTS section to augment answers.

               DOCUMENTS:
               {documents}
               """;

       @Value("${spring.ai.azure.cognitive-search.endpoint}")
       private String acsEndpoint;

       @Value("${spring.ai.azure.cognitive-search.api-key}")
       private String acsApiKey;

       @Value("${spring.ai.azure.cognitive-search.index}")
       private String acsIndexName;

       @Autowired
       private AiClient aiClient;

       @Autowired
       private EmbeddingClient embeddingClient;

       public static void main(String[] args) {
           SpringApplication.run(AiCustomDataApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception
       {
           System.out.println(String.format("Sending custom data prompt to AI service. One moment please...\r\n"));

           final var store = vectorStore(embeddingClient);

           final String question = "What are the differences between Azure Machine Learning and Azure AI services?";

           final var candidateDocs = store.similaritySearch(question);

           final var userMessage = new UserMessage(question);

           final String docPrompts =
                   candidateDocs.stream().map(entry -> entry.getContent()).collect(Collectors.joining("\n"));

           final SystemPromptTemplate promptTemplate = new SystemPromptTemplate(template);
           final var systemMessage = promptTemplate.createMessage(Map.of("documents", docPrompts));

           final var prompt = new Prompt(List.of(systemMessage, userMessage));

           final var resps = aiClient.generate(prompt);

           System.out.println(String.format("Prompt created %d generated response(s).", resps.getGenerations().size()));

           resps.getGenerations().stream()
             .forEach(gen -> {
                 final var role = gen.getInfo().getOrDefault(ROLE_INFO_KEY, MessageType.ASSISTANT.getValue());

                 System.out.println(String.format("Generated respose from \"%s\": %s", role, gen.getText()));
             });

       }

       @Bean
       public VectorStore vectorStore(EmbeddingClient embeddingClient)
       {
           final SearchClient searchClient = new SearchClientBuilder()
                   .endpoint(acsEndpoint)
                   .credential(new AzureKeyCredential(acsApiKey))
                   .indexName(acsIndexName)
                   .buildClient();
           return new AzureCognitiveSearchVectorStore(searchClient, embeddingClient);
       }

       public static class AzureCognitiveSearchVectorStore implements VectorStore
       {
           private static final int DEFAULT_TOP_K = 4;

           private static final Double DEFAULT_SIMILARITY_THRESHOLD = 0.0;

           private SearchClient searchClient;

           private final EmbeddingClient embeddingClient;

           public AzureCognitiveSearchVectorStore(SearchClient searchClient, EmbeddingClient embeddingClient)
           {
               this.searchClient = searchClient;
               this.embeddingClient = embeddingClient;
           }

           @Override
           public void add(List<Document> documents)
           {
               final var docs = documents.stream().map(document -> {

                   final var embeddings = embeddingClient.embed(document);

                   return new DocEntry(document.getId(), "", document.getContent(), embeddings);

               }).toList();

               searchClient.uploadDocuments(docs);
           }

           @Override
           public Optional<Boolean> delete(List<String> idList)
           {
               final List<DocEntry> docIds = idList.stream().map(id -> DocEntry.builder().id(id).build())
                   .toList();

               var results = searchClient.deleteDocuments(docIds);

               boolean resSuccess = true;

               for (IndexingResult result : results.getResults())
                   if (!result.isSucceeded()) {
                       resSuccess = false;
                       break;
                   }

               return Optional.of(resSuccess);
           }

           @Override
           public List<Document> similaritySearch(String query)
           {
               return similaritySearch(query, DEFAULT_TOP_K);
           }

           @Override
           public List<Document> similaritySearch(String query, int k)
           {
               return similaritySearch(query, k, DEFAULT_SIMILARITY_THRESHOLD);
           }

           @Override
           public List<Document> similaritySearch(String query, int k, double threshold)
           {
               final var searchQueryVector = new RawVectorQuery()
                       .setVector(toFloatList(embeddingClient.embed(query)))
                       .setKNearestNeighborsCount(k)
                       .setFields("contentVector");

               final var searchResults = searchClient.search(null,
                       new SearchOptions().setVectorQueries(searchQueryVector), Context.NONE);

               return searchResults.stream()
                       .filter(r -> r.getScore() >= threshold)
                       .map(r -> {

                           final DocEntry entry = r.getDocument(DocEntry.class);

                           final Document doc = new Document(entry.getId(), entry.getContent(), Collections.emptyMap());
                           doc.setEmbedding(entry.getContentVector());

                           return doc;
                       })
                       .collect(Collectors.toList());
           }

           private List<Float> toFloatList(List<Double> doubleList)
           {
               return doubleList.stream().map(Double::floatValue).toList();
           }

       }

       @Data
       @Builder
       @Jacksonized
       @AllArgsConstructor
       @NoArgsConstructor
       static class DocEntry
       {
           private String id;

           private String hash;

           private String content;

           private List<Double> contentVector;
       }

   }
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Navigate back to the project root folder, and run the app with:

   ```bash
   ./mvnw spring-boot:run
   ```

## Output

```output
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

2023-11-07T14:40:45.250-06:00  INFO 18557 --- [           main] c.e.a.AiCustomDataApplication            : No active profile set, falling back to 1 default profile: "default"
2023-11-07T14:40:46.035-06:00  INFO 18557 --- [           main] c.e.a.AiCustomDataApplication            : Started AiCustomDataApplication in 1.095 seconds (process running for 1.397)
Sending custom data prompt to AI service. One moment please...

Prompt created 1 generated response(s).
Generated response from "assistant": Azure Machine Learning is a cloud-based service that allows users to build, deploy, and manage machine learning models. It provides a range of tools and capabilities for data scientists and developers to train models, automate the machine learning workflow, and deploy models as web services.

On the other hand, Azure AI services is a broader category that includes various services and technologies for artificial intelligence. It encompasses not only machine learning but also other AI capabilities such as natural language processing, computer vision, speech recognition, and more. Azure AI services provide pre-built AI models and APIs that developers can easily integrate into their applications.

In summary, Azure Machine Learning is specifically focused on machine learning model development and deployment, while Azure AI services offer a wider range of AI capabilities beyond just machine learning.

```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-spring-application)
