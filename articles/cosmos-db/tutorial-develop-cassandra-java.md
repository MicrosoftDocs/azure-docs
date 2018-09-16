---
title: 'Azure Cosmos DB: Develop with the Cassandra API in Java | Microsoft Docs'
description: Learn how to develop with Azure Cosmos DB's Cassandra API using Java
services: cosmos-db
author: SnehaGunda
manager: kfile
editor: ''
tags: ''

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.devlang: java
ms.topic: tutorial
ms.date: 11/15/2017
ms.author: sngun
ms.custom: mvc
---

# Azure CosmosDB: Develop with the Cassandra API in Java

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This tutorial demonstrates how to create an Azure Cosmos DB account using the Azure portal, and then create a Cassandra Table(sql-api-partition-data.md#partition-keys) using the [Cassandra API](cassandra-introduction.md). By defining a primary key when you create a Table, your application is prepared to scale effortlessly as your data grows. 

This tutorial covers the following tasks by using the Cassandra API:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account
> * Create a keyspace and table with a primary key
> * Insert data
> * Query data
> * Review SLAs

## Prerequisites

Access to the Azure Cosmos DB Cassandra API preview program. If you haven't applied for access yet, [sign up now](https://aka.ms/cosmosdb-cassandra-signup).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.

In addition: 

* [Java Development Kit (JDK) 1.7+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a [Maven](http://maven.apache.org/) binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a Cassandra app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app. 

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-java-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). These snippets are all taken from the src/main/java/com/azure/cosmosdb/cassandra/util/CassandraUtils.java.  

* Cassandra host, port, user name, password, and SSL options are set. The connection string information comes from the connection string page in the Azure portal.

   ```java
   cluster = Cluster.builder().addContactPoint(cassandraHost).withPort(cassandraPort).withCredentials(cassandraUsername, cassandraPassword).withSSL(sslOptions).build();
   ```

* The `cluster` connects to the Azure Cosmos DB Cassandra API and returns a session to access.

    ```java
    return cluster.connect();
    ```

The following snippets are from the src/main/java/com/azure/cosmosdb/cassandra/repository/UserRepository.java file.

* Create a new keyspace.

    ```java
    public void createKeyspace() {
        final String query = "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' } ";
        session.execute(query);
        LOGGER.info("Created keyspace 'uprofile'");
    }
    ```

* Create a new table.

   ```java
   public void createTable() {
        final String query = "CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text)";
        session.execute(query);
        LOGGER.info("Created table 'user'");
   }
   ```

* Insert user entities using a prepared statement object.

    ```java
    public PreparedStatement prepareInsertStatement() {
        final String insertStatement = "INSERT INTO  uprofile.user (user_id, user_name , user_bcity) VALUES (?,?,?)";
        return session.prepare(insertStatement);
    }

	public void insertUser(PreparedStatement statement, int id, String name, String city) {
        BoundStatement boundStatement = new BoundStatement(statement);
        session.execute(boundStatement.bind(id, name, city));
    }
    ```

* Query to get all user information.

    ```java
   public void selectAllUsers() {
        final String query = "SELECT * FROM uprofile.user";
        List<Row> rows = session.execute(query).all();

        for (Row row : rows) {
            LOGGER.info("Obtained row: {} | {} | {} ", row.getInt("user_id"), row.getString("user_name"), row.getString("user_bcity"));
        }
    }
    ```

* Query to get a single user's information.

    ```java
    public void selectUser(int id) {
        final String query = "SELECT * FROM uprofile.user where user_id = 3";
        Row row = session.execute(query).one();

        LOGGER.info("Obtained row: {} | {} | {} ", row.getInt("user_id"), row.getString("user_name"), row.getString("user_bcity"));
    }
    ```

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. This enables your app to communicate with your hosted database.

1. In the [Azure portal](http://portal.azure.com/), click **Connection String**. 

    ![View and copy a username from the Azure portal, Connection String page](./media/tutorial-develop-cassandra-java/keys.png)

2. Use the ![Copy button](./media/tutorial-develop-cassandra-java/copy.png) button on the right side of the screen to copy the CONTACT POINT value.

3. Open the `config.properties` file from C:\git-samples\azure-cosmosdb-cassandra-java-getting-started\java-examples\src\main\resources folder. 

3. Paste the CONTACT POINT value from the portal over `<Cassandra endpoint host>` on line 2.

    Line 2 of config.properties should now look similar to 

    `cassandra_host=cosmos-db-quickstarts.documents.azure.com`

3. Go back to portal and copy the USERNAME value. Past the USERNAME value from the portal over `<cassandra endpoint username>` on line 4.

    Line 4 of config.properties should now look similar to 

    `cassandra_username=cosmos-db-quickstart`

4. Go back to portal and copy the PASSWORD value. Paste the PASSWORD value from the portal over `<cassandra endpoint password>` on line 5.

    Line 5 of config.properties should now look similar to 

    `cassandra_password=2Ggkr662ifxz2Mg...==`

5. On line 6, if you want to use a specific SSL certificate, then replace `<SSL key store file location>` with the location of the SSL certificate. If a value is not provided, the JDK certificate installed at <JAVA_HOME>/jre/lib/security/cacerts is used. 

6. If you changed line 6 to use a specific SSL certificate, update line 7 to use the password for that certificate. 

7. Save the config.properties file.

## Run the app

1. In the git terminal window, `cd` to the azure-cosmosdb-cassandra-java-getting-started\java-examples folder.

    ```git
    cd "C:\git-samples\azure-cosmosdb-cassandra-java-getting-started\java-examples"
    ```

2. In the git terminal window, use the following command to generate the cosmosdb-cassandra-examples.jar file.

    ```git
    mvn clean install
    ```

3. In the git terminal window, run the following command to start the Java application.

    ```git
    java -cp target/cosmosdb-cassandra-examples.jar com.azure.cosmosdb.cassandra.examples.UserProfile
    ```

    The terminal window displays notifications that the keyspace and table are created. It then selects and returns all users in the table and displays the output, and then selects a row by id and displays the value.  
    
    You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to do the following:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account
> * Create a keyspace and table with a primary key
> * Insert data
> * Query data
> * Reivew SLAs

You can now import additional data into your Azure Cosmos DB container. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](cassandra-import-data.md)
