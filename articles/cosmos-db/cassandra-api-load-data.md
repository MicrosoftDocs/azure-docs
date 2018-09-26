---
title: Load sample data into an Azure Cosmos DB Cassandra API table by using a Java application | Microsoft Docs
description: This article shows how to load sample user data to a table in Azure Cosmos DB Cassandra API account by using a java application.
services: cosmos-db
author: kanshiG

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.topic: tutorial
ms.date: 09/24/2018
ms.author: govindk
ms.reviewer: sngun
 
---

# Load sample data into an Azure Cosmos DB Cassandra API table

This tutorial shows how to load sample user data to a table in Azure Cosmos DB Cassandra API account by using a Java application. The Java application uses the [Java driver](https://github.com/datastax/java-driver) and loads user data such as user ID, user name, user city. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Load data into Cassandra table
> * Run the app

## Prerequisites

* This article belongs to a multi-part tutorial. Before you start with this doc, make sure to [create the Cassandra API account, keyspace and table](create-cassandra-api-account-java.md).   

## Load data into the table

Open the “UserRepository.java” file under “src\main\java\com\azure\cosmosdb\cassandra” folder and append the code to insert the user_id, user_name and user_bcity fields into the table:

```java
/**
* Insert a row into user table
*
* @param id   user_id
* @param name user_name
* @param city user_bcity
*/
public void insertUser(PreparedStatement statement, int id, String name, String city) {
        BoundStatement boundStatement = new BoundStatement(statement);
        session.execute(boundStatement.bind(id, name, city));
}

/**
* Create a PrepareStatement to insert a row to user table
*
* @return PreparedStatement
*/
public PreparedStatement prepareInsertStatement() {
    final String insertStatement = "INSERT INTO  uprofile.user (user_id, user_name , user_bcity) VALUES (?,?,?)";
    return session.prepare(insertStatement);
}
```
 
Open the “UserProfile.java” file under “src\main\java\com\azure\cosmosdb\cassandra” folder. This class contains the main method that calls the createKeyspace and createTable methods you defined earlier. Now append the following code to insert some sample data into the Cassandra API table.

```java
//Insert rows into user table
PreparedStatement preparedStatement = repository.prepareInsertStatement();
    repository.insertUser(preparedStatement, 1, "JohnH", "Seattle");
    repository.insertUser(preparedStatement, 2, "EricK", "Spokane");
    repository.insertUser(preparedStatement, 3, "MatthewP", "Tacoma");
    repository.insertUser(preparedStatement, 4, "DavidA", "Renton");
    repository.insertUser(preparedStatement, 5, "PeterS", "Everett");
```

## Run the app

Open command prompt or terminal window and change the folder path to where you have created the project. Run “mvn clean install” command to generate the cosmosdb-cassandra-examples.jar file within the target folder and run the application. 

```bash
cd "cassandra-demo"

mvn clean install

java -cp target/cosmosdb-cassandra-examples.jar com.azure.cosmosdb.cassandra.examples.UserProfile
```

You can now open Data Explorer in the Azure portal to confirm that the user information is added to the table.
	
## Next steps

In this tutorial, you've learned how to load sample data to Azure Cosmos DB Cassandra API account. You can now proceed to the next article:

> [!div class="nextstepaction"]
> [Query data from the Cassandra API account](cassandra-api-query-data.md)
