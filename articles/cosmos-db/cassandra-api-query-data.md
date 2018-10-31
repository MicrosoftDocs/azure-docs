---
title: Query data from an Azure Cosmos DB Cassandra API account
description: This article shows how to query user data from Azure Cosmos DB Cassandra API account by using a Java application.
services: cosmos-db
ms.service: cosmos-db
author: kanshiG
ms.author: govindk
ms.reviewer: sngun
ms.component: cosmosdb-cassandra
ms.topic: tutorial
ms.date: 09/24/2018
---

# Query data from an Azure Cosmos DB Cassandra API account

This tutorial shows how to query user data from Azure Cosmos DB Cassandra API account by using a Java application. The Java application uses the [Java driver](https://github.com/datastax/java-driver) and queries user data such as user ID, user name, user city. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Query data from Cassandra table
> * Run the app

## Prerequisites

* This article belongs to a multi-part tutorial. Before you start, make sure to complete the previous steps to [create the Cassandra API account, keyspace, table](create-cassandra-api-account-java.md) and [load sample data into the table](cassandra-api-load-data.md). 

## Query data

Open the `UserRepository.java` file under the folder `src\main\java\com\azure\cosmosdb\cassandra`. Append the following code block. This code provides three functions: to query all users in the database, to query a specific user filtered by user ID, and to delete a table. 

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

Open the `UserProfile.java` file under the folder `src\main\java\com\azure\cosmosdb\cassandra`. This class contains the main method that calls the createKeyspace and createTable, insert data methods you defined earlier. Now append the following code that queries all users or a specific user:

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

   This code changes directory (cd) to the folder path where you created the project. Then, it runs the `mvn clean install` command to generate the `cosmosdb-cassandra-examples.jar` file within the target folder. Finally, it runs the Java application.

   ```bash
   cd "cassandra-demo"
   
   mvn clean install
   
   java -cp target/cosmosdb-cassandra-examples.jar com.azure.cosmosdb.cassandra.examples.UserProfile
   ```

2. Now, in the Azure portal, open the **Data Explorer** and confirm that the user table is deleted.

## Next steps

* In this tutorial, you've learned how to query data from Azure Cosmos DB Cassandra API account. You can now proceed to the next article:

> [!div class="nextstepaction"]
> [Migrate data to Cassandra API account](cassandra-import-data.md)


