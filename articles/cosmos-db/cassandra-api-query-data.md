---
title: Query data from an Azure Cosmos DB Cassandra API account | Microsoft Docs
description: This article shows how to query user data from Azure Cosmos DB Cassandra API account by using a java application.
services: cosmos-db
author: kanshiG

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.topic: tutorial
ms.date: 09/18/2018
ms.author: govindk
ms.reviewer: sngun
 
---

# Query data from an Azure Cosmos DB Cassandra API account

This article shows how to query user data from Azure Cosmos DB Cassandra API account by using a java application. The java application uses the [Datastax Java driver](https://github.com/datastax/java-driver) and queries user data such as user ID, user name, user city. 

## Prerequisites

* This article belongs to a multi-part tutorial. Before you start with this doc, make sure to [create the Cassandra API account, keyspace, table](create-cassandra-api-account-java.md), and [load sample data into the table](cassandra-api-load-data.md). 

## Query data

Open the “UserRepository.java” file under “src\main\java\com\azure\cosmosdb\cassandra” folder and append the code to query all users in the database or a specific user filtered by user ID and to delete a table. 

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

Open the “UserProfile.java” file under “src\main\java\com\azure\cosmosdb\cassandra” folder. This class contains the main method that calls the createKeyspace and createTable, insert data methods you defined earlier. Now append the following code that queries all users or a specific user:

```java
LOGGER.info("Select all users");
repository.selectAllUsers();

LOGGER.info("Select a user by id (3)");
repository.selectUser(3);

LOGGER.info("Delete the users profile table");
repository.deleteTable();
```

## Run the app
Open command prompt or terminal window and change the folder path to where you have created the project. Run “mvn clean install” command to generate the cosmosdb-cassandra-examples.jar file within the target folder and run the application. 

```bash
cd "cassandra-demo"

mvn clean install

java -cp target/cosmosdb-cassandra-examples.jar com.azure.cosmosdb.cassandra.examples.UserProfile
```

You can now open Data Explorer in the Azure portal to confirm that the user table is deleted.

## Next steps

* To learn about Apache Cassandra features supported by Azure Cosmos DB Cassandra API, see [Cassandra support](cassandra-support.md) article.

