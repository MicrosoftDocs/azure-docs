---
title: How to use the Spring Boot Starter with an Azure Cosmos DB DocumentDB API
description: Learn how to configure an application created with the Spring Boot Initializer with the Azure Cosmos DB DocumentDB API.
services: cosmos-db
documentationcenter: java
author: rmcmurray
manager: cfowler
editor: ''
keywords: Spring, Spring Boot Starter, Cosmos DB

ms.assetid:
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 08/08/2017
ms.author: robmcm;yungez;kevinzha
---

# How to use the Spring Boot Starter with Azure Cosmos DB DocumentDB API

## Overview

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

Azure Cosmos DB is a globally-distributed database service that allows developers to work with data using a variety of standard APIs, such as DocumentDB, MongoDB, Graph, and Table APIs. Microsoft's Spring Boot Starter enables developers to use Spring Boot applications that easily integrate with Azure Cosmos DB by using DocumentDB APIs.

This article demonstrates creating an Azure Cosmos DB using the Azure portal, then using the **Spring Initializr** to create a custom java application, and then add the Spring Boot Starter functionality to your custom application to store data in and retrieve data from your Azure Cosmos DB by using the DocumentDB API.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].

* A [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/), version 1.7 or later.

* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an Azure Cosmos DB by using the Azure portal

1. Browse to the Azure portal at <https://portal.azure.com/> and click **+New**.

   ![Azure portal][AZ01]

1. Click **Databases**, and then click **Azure Cosmos DB**.

   ![Azure portal][AZ02]

1. On the **Azure Cosmos DB** page, enter the following information:

   * Enter a unique **ID**, which you will use as the URI for your database. For example: *wingtiptoysdata.documents.azure.com*.
   * Choose **SQL (Document DB)** for the API.
   * Choose the **Subscription** you want to use for your database.
   * Specify whether to create a new **Resource group** for your database, or choose an existing resource group.
   * Specify the **Location** for your database.
   
   When you have specified these options, click **Create** to create your database.

   ![Azure portal][AZ03]

1. When your database has been created, it is listed on your Azure **Dashboard**, as well as under the **All Resources** and **Azure Cosmos DB** pages. You can click on your database on any of those locations to open the properties page for your cache.

   ![Azure portal][AZ04]

1. When the properties page for your database is displayed, click **Access keys** and copy your URI and access keys for your database; you will use these values in your Spring Boot application.

   ![Azure portal][AZ05]

## Create a simple Spring Boot application with the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application, and then click the button to **Generate Project**.

   ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   >
   > The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.example.wintiptoys*.
   >

1. When prompted, download the project to a path on your local computer.

   ![Download custom Spring Boot project][SI02]

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready for editing.

   ![Custom Spring Boot project files][SI03]

## Configure your Spring Boot app to use the Azure Spring Boot Starter

1. Locate the *pom.xml* file in the directory of your app; for example:

   `C:\SpringBoot\wingtiptoys\pom.xml`

   -or-

   `/users/example/home/wingtiptoys/pom.xml`

   ![Locate the pom.xml file][PM01]

1. Open the *pom.xml* file in a text editor, and add the following lines to list of `<dependencies>`:

   ```xml
   <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-documentdb-spring-boot-starter</artifactId>
      <version>0.1.4</version>
   </dependency>
   ```

   ![Editing the pom.xml file][PM02]

1. Save and close the *pom.xml* file.

## Configure your Spring Boot app to use your Azure Cosmos DB

1. Locate the *application.properties* file in the *resources* directory of your app; for example:

   `C:\SpringBoot\wingtiptoys\src\main\resources\application.properties`

   -or-

   `/users/example/home/wingtiptoys/src/main/resources/application.properties`

   ![Locate the application.properties file][RE01]

1. Open the *application.properties* file in a text editor, and add the following lines to the file, and replace the sample values with the appropriate properties for your database:

   ```yaml
   # Specify the DNS URI of your Azure Cosmos DB.
   azure.documentdb.uri=https://wingtiptoys.documents.azure.com:443/

   # Specify the access key for your database.
   azure.documentdb.key=57686f6120447564652c20426f6220526f636b73==

   # Specify the name of your database.
   azure.documentdb.database=wingtiptoysdata
   ```

   ![Editing the application.properties file][RE02]

1. Save and close the *application.properties* file.

## Add sample code to implement basic database functionality

In this section you create two Java classes for storing user data, and then you modify your main application class to create an instance of the user class and save it to your database.

### Define a basic class for storing user data

1. Create a new file named *User.java* in the same directory as your main application Java file.

1. Open the *User.java* file in a text editor, and add the following lines to the file to define a generic user class that stores and retrieve values in your database:

   ```java
   package com.example.wingtiptoys;

   public class User {
      private String id;
      private String firstName;
      private String lastName;
 
      public User(String id, String firstName, String lastName) {
         this.id = id;
         this.firstName = firstName;
         this.lastName = lastName;
      }
   
      public String getId() {
         return this.id;
      }

      public void setId(String id) {
         this.id = id;
      }

      public String getFirstName() {
         return firstName;
      }

      public void setFirstName(String firstName) {
         this.firstName = firstName;
      }

      public String getLastName() {
         return lastName;
      }

      public void setLastName(String lastName) {
         this.lastName = lastName;
      }

      @Override
      public String toString() {
         return String.format("User: %s %s", firstName, lastName);
      }
   }
   ```

1. Save and close the *User.java* file.

### Define a data repository interface

1. Create a new file named *UserRepository.java* in the same directory as your main application Java file.

1. Open the *UserRepository.java* file in a text editor, and add the following lines to the file to define a user repository interface that extends the default DocumentDB repository interface:

   ```java
   package com.example.wingtiptoys;

   import com.microsoft.azure.spring.data.documentdb.repository.DocumentDbRepository;
   import org.springframework.stereotype.Repository;

   @Repository
   public interface UserRepository extends DocumentDbRepository<User, String> {}   
   ```

1. Save and close the *UserRepository.java* file.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

   `C:\SpringBoot\wingtiptoys\src\main\java\com\example\wingtiptoys\WingtiptoysApplication.java`

   -or-

   `/users/example/home/wingtiptoys/src/main/java/com/example/wingtiptoys/WingtiptoysApplication.java`

   ![Locate the application Java file][JV01]

1. Open the main application Java file in a text editor, and add the following lines to the file:

   ```java
   package com.example.wingtiptoys;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;

   @SpringBootApplication
   public class WingtiptoysApplication implements CommandLineRunner {

      @Autowired
      private UserRepository repository;
    
      public static void main(String[] args) {
         SpringApplication.run(WingtiptoysApplication.class, args);
      }

      public void run(String... var1) throws Exception {
         final User testUser = new User("testId", "testFirstName", "testLastName");

         repository.deleteAll();
         repository.save(testUser);

         final User result = repository.findOne(testUser.getId());

         System.out.printf("\n\n%s\n\n",result.toString());
      }
   }
   ```

1. Save and close the main application Java file.

## Build and test your app

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

   `cd C:\SpringBoot\wingtiptoys`

   -or-

   `cd /users/example/home/wingtiptoys`

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn package
   java -jar target/wingtiptoys-0.0.1-SNAPSHOT.jar
   ```

1. Your application will display several runtime messages, and you should see the message `User: testFirstName testLastName` displayed to indicate that values have been successfully stored and retrieved from your database.

   ![Successful output from the application][JV02]

1. OPTIONAL: You can use the Azure portal to view the contents of your Azure Cosmos DB from the properties page for your database by clicking  **Document Explorer**, and then selecting and item from the displayed list to view the contents.

   ![Using the Document Explorer to view your data][JV03]

## Next steps

For more information about using Azure Cosmos DB and Java, see the following articles:

* [Azure Cosmos DB Documentation].

* [Azure Cosmos DB: Build a DocumentDB API app with Java and the Azure portal][Build a DocumentDB API app with Java]

For more information about using Spring Boot applications on Azure, see the following articles:

* [Spring Boot DocumenDB Starter for Azure](https://github.com/Microsoft/azure-spring-boot-starters/tree/master/azure-documentdb-spring-boot-starter-sample)

* [Deploy a Spring Boot Application to the Azure App Service](../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

<!-- URL List -->

[Azure Cosmos DB Documentation]: /azure/cosmos-db/
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Build a DocumentDB API app with Java]: https://docs.microsoft.com/azure/cosmos-db/create-documentdb-java
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[AZ01]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/AZ01.png
[AZ02]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/AZ02.png
[AZ03]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/AZ03.png
[AZ04]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/AZ04.png
[AZ05]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/AZ05.png

[SI01]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/SI01.png
[SI02]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/SI02.png
[SI03]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/SI03.png

[RE01]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/RE01.png
[RE02]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/RE02.png

[PM01]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/PM01.png
[PM02]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/PM02.png

[JV01]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/JV01.png
[JV02]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/JV02.png
[JV03]: ./media/documentdb-java-spring-boot-starter-with-cosmos-db/JV03.png
