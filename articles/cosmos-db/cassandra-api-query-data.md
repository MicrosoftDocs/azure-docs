---
title: 'Tutorial: Query data from a Cassandra API account in Azure Cosmos DB'
description: This tutorial shows how to query user data from an Azure Cosmos DB Cassandra API account by using a Java application.
ms.service: cosmos-db
author: kanshiG
ms.author: govindk
ms.reviewer: sngun
ms.subservice: cosmosdb-cassandra
ms.topic: tutorial
ms.date: 09/24/2018
Customer intent: As a developer, I want to build a Java application to query data stored in a Cassandra API account of Azure Cosmos DB so that customers can manage the key/value data and utilize the global distribution, elastic scaling, multi-master, and other capabilities offered by Azure Cosmos DB.
---

# Tutorial: Query data from a Cassandra API account in Azure Cosmos DB

As a developer, you might have applications that use key/value pairs. You can use a Cassandra API account in Azure Cosmos DB to store and query the key/value data. This tutorial shows how to query user data from a Cassandra API account in Azure Cosmos DB by using a Java application. The Java application uses the [Java driver](https://github.com/datastax/java-driver) and queries user data such as user ID, user name, and user city. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Query data from a Cassandra table
> * Run the app

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* This article belongs to a multi-part tutorial. Before you start, make sure to complete the previous steps to create the Cassandra API account, keyspace, table, and [load sample data into the table](cassandra-api-load-data.md). 

## Query data

Use the following steps to query data from your Cassandra API account:

1. Open the `UserRepository.java` file under the folder `src\main\java\com\azure\cosmosdb\cassandra`. Append the following code block. This code provides three methods: 

   * To query all users in the database
   * To query a specific user filtered by user ID
   * To delete a table

   ```java
   /**
   * Select all rows from user table
   */
   public void selectAllUsers() {

     final String query = "SELECT * FROM uprofile.user";
     List<Row> rows = session.execute(query).all();

     for (Row row : rows) {
        LOGGER.info("Obtained row: {} | {} | {} ", row.getInt("user_id"), row.getString("user_name"), row.getString("user_bcity"));
     }
   }

   /**
   * Select a row from user table
   *
   * @param id user_id
   */
   public void selectUser(int id) {
      final String query = "SELECT * FROM uprofile.user where user_id = 3";
      Row row = session.execute(query).one();

      LOGGER.info("Obtained row: {} | {} | {} ", row.getInt("user_id"), row.getString("user_name"), row.getString("user_bcity"));
   }

   /**
   * Delete user table.
   */
   public void deleteTable() {
     final String query = "DROP TABLE IF EXISTS uprofile.user";
     session.execute(query);
   }
   ```

2. Open the `UserProfile.java` file under the folder `src\main\java\com\azure\cosmosdb\cassandra`. This class contains the main method that calls the createKeyspace and createTable, insert data methods you defined earlier. Now append the following code that queries all users or a specific user:

   ```java
   LOGGER.info("Select all users");
   repository.selectAllUsers();

   LOGGER.info("Select a user by id (3)");
   repository.selectUser(3);

   LOGGER.info("Delete the users profile table");
   repository.deleteTable();
   ```

## Run the Java app
1. Open a command prompt or terminal window. Paste the following code block. 

   This code changes the directory (cd) to the folder path where you created the project. Then, it runs the `mvn clean install` command to generate the `cosmosdb-cassandra-examples.jar` file within the target folder. Finally, it runs the Java application.

   ```bash
   cd "cassandra-demo"
   
   mvn clean install
   
   java -cp target/cosmosdb-cassandra-examples.jar com.azure.cosmosdb.cassandra.examples.UserProfile
   ```

2. Now, in the Azure portal, open the **Data Explorer** and confirm that the user table is deleted.

## Clean up resources

When they're no longer needed, you can delete the resource group, Azure Cosmos account, and all the related resources. To do so, select the resource group for the virtual machine, select **Delete**, and then confirm the name of the resource group to delete.

## Next steps

In this tutorial, you've learned how to query data from a Cassandra API account in Azure Cosmos DB. You can now proceed to the next article:

> [!div class="nextstepaction"]
> [Migrate data to Cassandra API account](cassandra-import-data.md)


