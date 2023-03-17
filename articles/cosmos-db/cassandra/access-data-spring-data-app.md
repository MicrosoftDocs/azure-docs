---
title: How to use Spring Data API for Apache Cassandra with Azure Cosmos DB for Apache Cassandra
description: Learn how to use Spring Data API for Apache Cassandra with Azure Cosmos DB for Apache Cassandra.
ms.service: cosmos-db
author: TheovanKraay
ms.author: thvankra
ms.subservice: apache-cassandra
ms.devlang: java
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/17/2021
---

# How to use Spring Data API for Apache Cassandra with Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information using the [Azure Cosmos DB for Apache Cassandra](/azure/cosmos-db/cassandra-introduction).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* [Curl](https://curl.haxx.se/) or similar HTTP utility to test functionality.
* A [Git](https://git-scm.com/downloads) client.

> [!NOTE]
> The samples mentioned below implement custom extensions for a better experience when using Azure Cosmos DB for Apache Cassandra. They include custom retry and load balancing policies, as well as implementing recommended connection settings. For a more extensive exploration of how the custom policies are used, see Java samples for [version 3](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample) and [version 4](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4). 

## Create an Azure Cosmos DB for Apache Cassandra account

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Configure the sample application

The following procedure configures the test application.

1. Open a command shell and clone either of the following examples:

   For Java [version 3 driver](https://github.com/datastax/java-driver/tree/3.x) and corresponding Spring version:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v3.git
   ```
   
   For Java [version 4 driver](https://github.com/datastax/java-driver/tree/4.x) and corresponding Spring version:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v4.git
   ```     

    > [!NOTE]    
    > Although the usage described below is identical for both Java version 3 and version 4 samples above, the way in which they have been implemented in order to include custom retry and load balancing policies is different. We recommend reviewing the code to understand how to implement custom policies if you are making changes to an existing Spring Java application.  

1. Locate the *application.properties* file in the *resources* directory of the sample project, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add or configure the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.data.cassandra.contact-points=<Account Name>.cassandra.cosmos.azure.com
   spring.data.cassandra.port=10350
   spring.data.cassandra.username=<Account Name>
   spring.data.cassandra.password=********
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `spring.data.cassandra.contact-points` | Specifies the **Contact Point** from earlier in this article. |
   | `spring.data.cassandra.port` | Specifies the **Port** from earlier in this article. |
   | `spring.data.cassandra.username` | Specifies your **Username** from earlier in this article. |
   | `spring.data.cassandra.password` | Specifies your **Primary Password** from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

Browse to the directory that contains the .pom file to build and test the application.

1. Build the sample application with Maven; for example:

   ```shell
   mvn clean package
   ```

1. Start the sample application; for example:

   ```shell
   java -jar target/spring-data-cassandra-on-azure-0.1.0-SNAPSHOT.jar
   ```

1. Create new records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s -d "{\"name\":\"dog\",\"species\":\"canine\"}" -H "Content-Type: application/json" -X POST http://localhost:8080/pets

   curl -s -d "{\"name\":\"cat\",\"species\":\"feline\"}" -H "Content-Type: application/json" -X POST http://localhost:8080/pets
   ```

   Your application should return values like the following:

   ```shell
   Added Pet{id=60fa8cb0-0423-11e9-9a70-39311962166b, name='dog', species='canine'}.

   Added Pet{id=72c1c9e0-0423-11e9-9a70-39311962166b, name='cat', species='feline'}.
   ```

1. Retrieve all of the existing records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s http://localhost:8080/pets
   ```

   Your application should return values like the following:

   ```json
   [{"id":"60fa8cb0-0423-11e9-9a70-39311962166b","name":"dog","species":"canine"},{"id":"72c1c9e0-0423-11e9-9a70-39311962166b","name":"cat","species":"feline"}]
   ```

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](../../index.yml)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Data]: https://spring.io/projects/spring-data
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[COSMOSDB01]: media/access-data-spring-data-app/create-cosmos-db-01.png
[COSMOSDB02]: media/access-data-spring-data-app/create-cosmos-db-02.png
[COSMOSDB03]: media/access-data-spring-data-app/create-cosmos-db-03.png
[COSMOSDB04]: media/access-data-spring-data-app/create-cosmos-db-04.png
[COSMOSDB05]: media/access-data-spring-data-app/create-cosmos-db-05.png
[COSMOSDB05-1]: media/access-data-spring-data-app/create-cosmos-db-05-1.png
[COSMOSDB06]: media/access-data-spring-data-app/create-cosmos-db-06.png
