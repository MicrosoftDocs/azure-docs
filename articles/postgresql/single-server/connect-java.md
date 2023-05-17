---
title: 'Quickstart: Use Java and JDBC with Azure Database for PostgreSQL'
description: In this quickstart, you learn how to use Java and JDBC with an Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: judubois
author: jdubois
ms.devlang: java
ms.custom: mvc, devcenter, devx-track-azurecli, mode-api, passwordless-java
ms.date: 09/27/2022
---

# Quickstart: Use Java and JDBC with Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article demonstrates how to create a sample application that uses Java and [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) to store and retrieve information in [Azure Database for PostgreSQL](./index.yml).

JDBC is the standard Java API to connect to traditional relational databases.

In this article, we'll include two authentication methods: Azure Active Directory (Azure AD) authentication and PostgreSQL authentication. The **Passwordless** tab shows the Azure AD authentication and the **Password** tab shows the PostgreSQL authentication.

Azure AD authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

PostgreSQL authentication uses accounts stored in PostgreSQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in PostgreSQL, you'll need to manage the rotation of the passwords by yourself.

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- [Azure Cloud Shell](../../cloud-shell/quickstart.md) or [Azure CLI](/cli/azure/install-azure-cli) 2.37.0 or above required. We recommend Azure Cloud Shell so you'll be logged in automatically and have access to all the tools you'll need.
- A supported [Java Development Kit](/azure/developer/java/fundamentals/java-support-on-azure), version 8 (included in Azure Cloud Shell).
- The [Apache Maven](https://maven.apache.org/) build tool.

## Prepare the working environment

First, set up some environment variables. In [Azure Cloud Shell](https://shell.azure.com/), run the following commands:

### [Passwordless (Recommended)](#tab/passwordless)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_SERVER_NAME=<YOUR_DATABASE_SERVER_NAME>
export AZ_DATABASE_NAME=demo
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME=<YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName -o tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id -o tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_SERVER_NAME>`: The name of your PostgreSQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by entering `az account list-locations`.
- `<YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>`: The username of your PostgreSQL database server. Make ensure the username is a valid user in your Azure AD tenant.
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

> [!IMPORTANT]
> When setting <YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>, the username must already exist in your Azure AD tenant or you will be unable to create an Azure AD user in your database.

### [Password](#tab/password)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_SERVER_NAME=<YOUR_DATABASE_SERVER_NAME>
export AZ_DATABASE_NAME=demo
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_POSTGRESQL_ADMIN_USERNAME=demo
export AZ_POSTGRESQL_ADMIN_PASSWORD=<YOUR_POSTGRESQL_ADMIN_PASSWORD>
export AZ_POSTGRESQL_NON_ADMIN_USERNAME=demo_non_admin
export AZ_POSTGRESQL_NON_ADMIN_PASSWORD=<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_SERVER_NAME>`: The name of your PostgreSQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can have the full list of available regions by entering `az account list-locations`.
- `<YOUR_POSTGRESQL_ADMIN_PASSWORD>` and `<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>`: The password of your PostgreSQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Java application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

---

Next, create a resource group by using the following command:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for PostgreSQL instance

The following sections describe how to create and configure your database instance.

### Create a PostgreSQL server and set up admin user

The first thing you'll create is a managed PostgreSQL server with an admin user.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL servers in [Create an Azure Database for PostgreSQL server by using the Azure portal](./quickstart-create-server-database-portal.md).

#### [Passwordless (Recommended)](#tab/passwordless)

If you're using Azure CLI, run the following command to make sure it has sufficient permission:

```azurecli
az login --scope https://graph.microsoft.com/.default
```

Then run following command to create the server:

```azurecli
az postgres server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME \
    --location $AZ_LOCATION \
    --sku-name B_Gen5_1 \
    --storage-size 5120 \
    --output tsv
```

Now run the following command to set the Azure AD admin user:

```azurecli
az postgres server ad-admin create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_SERVER_NAME \
    --display-name $CURRENT_USERNAME \
    --object-id $CURRENT_USER_OBJECTID
```

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for PostgreSQL server with full administrator permissions. Only one Azure AD admin can be created per PostgreSQL server and selection of another one will overwrite the existing Azure AD admin configured for the server.

This command creates a small PostgreSQL server and sets the Active Directory admin to the signed-in user.

#### [Password](#tab/password)

```azurecli
az postgres server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME \
    --location $AZ_LOCATION \
    --sku-name B_Gen5_1 \
    --storage-size 5120 \
    --admin-user $AZ_POSTGRESQL_ADMIN_USERNAME \
    --admin-password $AZ_POSTGRESQL_ADMIN_PASSWORD \
    --output tsv
```

This command creates a small PostgreSQL server.

---

### Configure a firewall rule for your PostgreSQL server

Azure Database for PostgreSQL instances are secured by default. They have a firewall that doesn't allow any incoming connection. To be able to use your database, you need to add a firewall rule that will allow the local IP address to access the database server.

Because you configured your local IP address at the beginning of this article, you can open the server's firewall by running the following command:

```azurecli
az postgres server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME-database-allow-local-ip \
    --server $AZ_DATABASE_SERVER_NAME \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    --output tsv
```

If you're connecting to your PostgreSQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you'll need to add the WSL host ID to your firewall.

Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az postgres server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME-database-allow-local-ip \
    --server $AZ_DATABASE_SERVER_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --output tsv
```

### Configure a PostgreSQL database

The PostgreSQL server that you created earlier is empty. Use the following command to create a new database.

```azurecli
az postgres db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --server-name $AZ_DATABASE_SERVER_NAME \
    --output tsv
```

### Create a PostgreSQL non-admin user and grant permission

Next, create a non-admin user and grant all permissions to the database.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL users in [Create users in Azure Database for PostgreSQL](./how-to-create-users.md).

#### [Passwordless (Recommended)](#tab/passwordless)

Create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_ad_user.sql
SET aad_validate_oids_in_tenant = off;
CREATE ROLE "$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME" WITH LOGIN IN ROLE azure_ad_user;
GRANT ALL PRIVILEGES ON DATABASE $AZ_DATABASE_NAME TO "$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME";
EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$CURRENT_USERNAME@$AZ_DATABASE_SERVER_NAME dbname=$AZ_DATABASE_NAME port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

#### [Password](#tab/password)

Create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE ROLE "$AZ_POSTGRESQL_NON_ADMIN_USERNAME" WITH LOGIN PASSWORD '$AZ_POSTGRESQL_NON_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $AZ_DATABASE_NAME TO "$AZ_POSTGRESQL_NON_ADMIN_USERNAME";
EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$AZ_POSTGRESQL_ADMIN_USERNAME@$AZ_DATABASE_SERVER_NAME dbname=$AZ_DATABASE_NAME port=5432 password=$AZ_POSTGRESQL_ADMIN_PASSWORD sslmode=require" < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

---

### Create a new Java project

Using your favorite IDE, create a new Java project using Java 8 or above, and add a *pom.xml* file in its root directory with the following contents:

#### [Passwordless (Recommended)](#tab/passwordless)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>

    <properties>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
      <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.3.6</version>
      </dependency>
      <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity-extensions</artifactId>
        <version>1.0.0</version>
      </dependency>
    </dependencies>
</project>
```

#### [Password](#tab/password)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>

    <properties>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
      <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.3.6</version>
      </dependency>
    </dependencies>
</project>
```

---

This file is an [Apache Maven](https://maven.apache.org/) file that configures your project to use Java 8 and a recent PostgreSQL driver for Java.

### Prepare a configuration file to connect to Azure Database for PostgreSQL

Create a *src/main/resources/application.properties* file, then add the following contents:

#### [Passwordless (Recommended)](#tab/passwordless)

```bash
cat << EOF > src/main/resources/application.properties
url=jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require&authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin
user=${AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME}@${AZ_DATABASE_SERVER_NAME}
EOF
```

#### [Password](#tab/password)

```bash
cat << EOF > src/main/resources/application.properties
url=jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
user=${AZ_POSTGRESQL_NON_ADMIN_USERNAME}@${AZ_DATABASE_SERVER_NAME}
password=${AZ_POSTGRESQL_NON_ADMIN_PASSWORD}
EOF
```

---

> [!NOTE]
> The configuration property `url` has `?sslmode=require` appended to tell the JDBC driver to use TLS ([Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security)) when connecting to the database. Using TLS is mandatory with Azure Database for PostgreSQL, and it's a good security practice.

### Create an SQL file to generate the database schema

You'll use a *src/main/resources/schema.sql* file to create a database schema. Create that file, then add the following contents:

```bash
cat << EOF > src/main/resources/schema.sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
EOF
```

## Code the application

### Connect to the database

Next, add the Java code that will use JDBC to store and retrieve data from your PostgreSQL server.

Create a *src/main/java/DemoApplication.java* file, then add the following contents:

```java
package com.example.demo;

import java.sql.*;
import java.util.*;
import java.util.logging.Logger;

public class DemoApplication {

    private static final Logger log;

    static {
        System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
        log =Logger.getLogger(DemoApplication.class.getName());
    }

    public static void main(String[] args) throws Exception {
        log.info("Loading application properties");
        Properties properties = new Properties();
        properties.load(DemoApplication.class.getClassLoader().getResourceAsStream("application.properties"));

        log.info("Connecting to the database");
        Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties);
        log.info("Database connection test: " + connection.getCatalog());

        log.info("Create database schema");
        Scanner scanner = new Scanner(DemoApplication.class.getClassLoader().getResourceAsStream("schema.sql"));
        Statement statement = connection.createStatement();
        while (scanner.hasNextLine()) {
            statement.execute(scanner.nextLine());
        }

        /* Prepare for data processing in the PostgreSQL server.
        Todo todo = new Todo(1L, "configuration", "congratulations, you have set up JDBC correctly!", true);
        insertData(todo, connection);
        todo = readData(connection);
        todo.setDetails("congratulations, you have updated data!");
        updateData(todo, connection);
        deleteData(todo, connection);
        */

        log.info("Closing database connection");
        connection.close();
    }
}
```

This Java code will use the *application.properties* and the *schema.sql* files that you created earlier in order to connect to the PostgreSQL server and create a schema that will store your data.

In this file, you can see that we commented methods to insert, read, update and delete data. You'll code those methods in the rest of this article, and you'll be able to uncomment them one after another.

> [!NOTE]
> The database credentials are stored in the `user` and `password` properties of the *application.properties* file. Those credentials are used when executing `DriverManager.getConnection(properties.getProperty("url"), properties);`, as the properties file is passed as an argument.

You can now execute this main class with your favorite tool:

- Using your IDE, you should be able to right-click on the *DemoApplication* class and execute it.
- Using Maven, you can run the application by using the following command: `mvn exec:java -Dexec.mainClass="com.example.demo.DemoApplication"`.

The application should connect to the Azure Database for PostgreSQL, create a database schema, and then close the connection, as you should see in the console logs:

```output
[INFO   ] Loading application properties 
[INFO   ] Connecting to the database 
[INFO   ] Database connection test: demo 
[INFO   ] Create database schema 
[INFO   ] Closing database connection 
```

### Create a domain class

Create a new `Todo` Java class, next to the `DemoApplication` class, and add the following code:

```java
package com.example.demo;

public class Todo {

    private Long id;
    private String description;
    private String details;
    private boolean done;

    public Todo() {
    }

    public Todo(Long id, String description, String details, boolean done) {
        this.id = id;
        this.description = description;
        this.details = details;
        this.done = done;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", details='" + details + '\'' +
                ", done=" + done +
                '}';
    }
}
```

This class is a domain model mapped on the `todo` table that you created when executing the *schema.sql* script.

### Insert data into Azure Database for PostgreSQL

In the *src/main/java/DemoApplication.java* file, after the main method, add the following method to insert data into the database:

```java
private static void insertData(Todo todo, Connection connection) throws SQLException {
    log.info("Insert data");
    PreparedStatement insertStatement = connection
            .prepareStatement("INSERT INTO todo (id, description, details, done) VALUES (?, ?, ?, ?);");

    insertStatement.setLong(1, todo.getId());
    insertStatement.setString(2, todo.getDescription());
    insertStatement.setString(3, todo.getDetails());
    insertStatement.setBoolean(4, todo.isDone());
    insertStatement.executeUpdate();
}
```

You can now uncomment the two following lines in the `main` method:

```java
Todo todo = new Todo(1L, "configuration", "congratulations, you have set up JDBC correctly!", true);
insertData(todo, connection);
```

Executing the main class should now produce the following output:

```output
[INFO   ] Loading application properties 
[INFO   ] Connecting to the database 
[INFO   ] Database connection test: demo 
[INFO   ] Create database schema 
[INFO   ] Insert data 
[INFO   ] Closing database connection
```

### Reading data from Azure Database for PostgreSQL

To validate that your code works correctly, read the data that you previously inserted.

In the *src/main/java/DemoApplication.java* file, after the `insertData` method, add the following method to read data from the database:

```java
private static Todo readData(Connection connection) throws SQLException {
    log.info("Read data");
    PreparedStatement readStatement = connection.prepareStatement("SELECT * FROM todo;");
    ResultSet resultSet = readStatement.executeQuery();
    if (!resultSet.next()) {
        log.info("There is no data in the database!");
        return null;
    }
    Todo todo = new Todo();
    todo.setId(resultSet.getLong("id"));
    todo.setDescription(resultSet.getString("description"));
    todo.setDetails(resultSet.getString("details"));
    todo.setDone(resultSet.getBoolean("done"));
    log.info("Data read from the database: " + todo.toString());
    return todo;
}
```

You can now uncomment the following line in the `main` method:

```java
todo = readData(connection);
```

Executing the main class should now produce the following output:

```output
[INFO   ] Loading application properties 
[INFO   ] Connecting to the database 
[INFO   ] Database connection test: demo 
[INFO   ] Create database schema 
[INFO   ] Insert data 
[INFO   ] Read data 
[INFO   ] Data read from the database: Todo{id=1, description='configuration', details='congratulations, you have set up JDBC correctly!', done=true} 
[INFO   ] Closing database connection 
```

### Updating data in Azure Database for PostgreSQL

Next, update the data you previously inserted.

Still in the *src/main/java/DemoApplication.java* file, after the `readData` method, add the following method to update data inside the database:

```java
private static void updateData(Todo todo, Connection connection) throws SQLException {
    log.info("Update data");
    PreparedStatement updateStatement = connection
            .prepareStatement("UPDATE todo SET description = ?, details = ?, done = ? WHERE id = ?;");

    updateStatement.setString(1, todo.getDescription());
    updateStatement.setString(2, todo.getDetails());
    updateStatement.setBoolean(3, todo.isDone());
    updateStatement.setLong(4, todo.getId());
    updateStatement.executeUpdate();
    readData(connection);
}
```

You can now uncomment the two following lines in the `main` method:

```java
todo.setDetails("congratulations, you have updated data!");
updateData(todo, connection);
```

Executing the main class should now produce the following output:

```output
[INFO   ] Loading application properties 
[INFO   ] Connecting to the database 
[INFO   ] Database connection test: demo 
[INFO   ] Create database schema 
[INFO   ] Insert data 
[INFO   ] Read data 
[INFO   ] Data read from the database: Todo{id=1, description='configuration', details='congratulations, you have set up JDBC correctly!', done=true} 
[INFO   ] Update data 
[INFO   ] Read data 
[INFO   ] Data read from the database: Todo{id=1, description='configuration', details='congratulations, you have updated data!', done=true} 
[INFO   ] Closing database connection 
```

### Deleting data in Azure Database for PostgreSQL

Finally, delete the data you previously inserted.

Still in the *src/main/java/DemoApplication.java* file, after the `updateData` method, add the following method to delete data inside the database:

```java
private static void deleteData(Todo todo, Connection connection) throws SQLException {
    log.info("Delete data");
    PreparedStatement deleteStatement = connection.prepareStatement("DELETE FROM todo WHERE id = ?;");
    deleteStatement.setLong(1, todo.getId());
    deleteStatement.executeUpdate();
    readData(connection);
}
```

You can now uncomment the following line in the `main` method:

```java
deleteData(todo, connection);
```

Executing the main class should now produce the following output:

```output
[INFO   ] Loading application properties 
[INFO   ] Connecting to the database 
[INFO   ] Database connection test: demo 
[INFO   ] Create database schema 
[INFO   ] Insert data 
[INFO   ] Read data 
[INFO   ] Data read from the database: Todo{id=1, description='configuration', details='congratulations, you have set up JDBC correctly!', done=true} 
[INFO   ] Update data 
[INFO   ] Read data 
[INFO   ] Data read from the database: Todo{id=1, description='configuration', details='congratulations, you have updated data!', done=true} 
[INFO   ] Delete data 
[INFO   ] Read data 
[INFO   ] There is no data in the database! 
[INFO   ] Closing database connection 
```

## Clean up resources

Congratulations! You've created a Java application that uses JDBC to store and retrieve data from Azure Database for PostgreSQL.

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./how-to-migrate-using-export-and-import.md)