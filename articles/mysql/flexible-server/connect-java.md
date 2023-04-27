---
title: 'Quickstart: Use Java and JDBC with Azure Database for MySQL - Flexible Server'
description: Learn how to use Java and JDBC with an Azure Database for MySQL - Flexible Server database.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.subservice: flexible-server
ms.custom: mvc, devcenter, devx-track-azurecli, mode-api
ms.topic: quickstart
ms.devlang: java
ms.date: 10/20/2022
---

# Use Java and JDBC with Azure Database for MySQL - Flexible Server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This topic demonstrates creating a sample application that uses Java and [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) to store and retrieve information in [Azure Database for MySQL - Flexible Server](../index.yml).

JDBC is the standard Java API to connect to traditional relational databases.

In this article, we'll include two authentication methods: Azure Active Directory (Azure AD) authentication and MySQL authentication. The **Passwordless** tab shows the Azure AD authentication and the **Password** tab shows the MySQL authentication.

Azure AD authentication is a mechanism for connecting to Azure Database for MySQL using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

MySQL authentication uses accounts stored in MySQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in MySQL, you'll need to manage the rotation of the passwords by yourself.

## Prerequisites

- An Azure account with an active subscription.
  [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
- [Azure Cloud Shell](../../cloud-shell/quickstart.md) or [Azure CLI](/cli/azure/install-azure-cli). We recommend Azure Cloud Shell so you'll be logged in automatically and have access to all the tools you'll need.
- A supported [Java Development Kit](/azure/developer/java/fundamentals/java-support-on-azure), version 8 (included in Azure Cloud Shell).
- The [Apache Maven](https://maven.apache.org/) build tool.

## Prepare the working environment

First, use the following command to set up some environment variables.

### [Passwordless (Recommended)](#tab/passwordless)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_AD_NON_ADMIN_USERNAME=demo-non-admin
export AZ_USER_IDENTITY_NAME=<YOUR_USER_ASSIGNED_MANAGED_IDENTITY_NAME>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName -o tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id -o tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by entering `az account list-locations`.
- `<YOUR_USER_ASSIGNED_MANAGED_IDENTITY_NAME>`: The name of your user assigned managed identity server, which should be unique across Azure.

### [Password](#tab/password)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_ADMIN_USERNAME=demo
export AZ_MYSQL_ADMIN_PASSWORD=<YOUR_MYSQL_ADMIN_PASSWORD>
export AZ_MYSQL_NON_ADMIN_USERNAME=demo-non-admin
export AZ_MYSQL_NON_ADMIN_PASSWORD=<YOUR_MYSQL_NON_ADMIN_PASSWORD>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by entering `az account list-locations`.
- `<YOUR_MYSQL_ADMIN_PASSWORD>` and `<YOUR_MYSQL_NON_ADMIN_PASSWORD>`: The password of your MySQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).

---

Next, create a resource group:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for MySQL instance

### Create a MySQL server and set up admin user

The first thing you'll create is a managed MySQL server.

> [!NOTE]
> You can read more detailed information about creating MySQL servers in [Create an Azure Database for MySQL server by using the Azure portal](./quickstart-create-server-portal.md).

#### [Passwordless connection (Recommended)](#tab/passwordless)

If you're using Azure CLI, run the following command to make sure it has sufficient permission:

```bash
az login --scope https://graph.microsoft.com/.default
```

Run the following command to create the server:

```azurecli
az mysql flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --yes \
    --output tsv
```

Run the following command to create a user-assigned identity for assigning:

```azurecli
az identity create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_USER_IDENTITY_NAME
```

> [!IMPORTANT]
> After creating the user-assigned identity, ask your *Global Administrator* or *Privileged Role Administrator* to grant the following permissions for this identity: `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.ALL`. For more information, see the [Permissions](./concepts-azure-ad-authentication.md#permissions) section of [Active Directory authentication](./concepts-azure-ad-authentication.md).

Run the following command to assign the identity to MySQL server for creating Azure AD admin:

```azurecli
az mysql flexible-server identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME \
    --identity $AZ_USER_IDENTITY_NAME
```

Run the following command to set the Azure AD admin user:

```azurecli
az mysql flexible-server ad-admin create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME \
    --display-name $CURRENT_USERNAME \
    --object-id $CURRENT_USER_OBJECTID \
    --identity $AZ_USER_IDENTITY_NAME
```

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for MySQL server with full administrator permissions. Only one Azure AD admin can be created per MySQL server and selection of another one will overwrite the existing Azure AD admin configured for the server.

This command creates a small MySQL server and sets the Active Directory admin to the signed-in user.

#### [Password](#tab/password)

```azurecli
az mysql flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_MYSQL_ADMIN_USERNAME \
    --admin-password $AZ_MYSQL_ADMIN_PASSWORD \
    --yes \
    --output tsv
```

This command creates a small MySQL server.

---

The MySQL server that you created has an empty database called `flexibleserverdb`.

[Having any issues? Let us know.](https://github.com/MicrosoftDocs/azure-docs/issues)

### Configure a firewall rule for your MySQL server

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

You can skip this step if you're using Bash because the `flexible-server create` command already detected your local IP address and set it on MySQL server.

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you'll need to add the WSL host ID to your firewall. Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az mysql flexible-server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --rule-name allowiprange \
    --output tsv
```

### Configure a MySQL database

Create a new database called `demo` by using the following command:

```azurecli
az mysql flexible-server db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --database-name demo \
    --server-name $AZ_DATABASE_NAME \
    --output tsv
```

### Create a MySQL non-admin user and grant permission

Next, create a non-admin user and grant all permissions on the `demo` database to it.

> [!NOTE]
> You can read more detailed information about creating MySQL users in [Create users in Azure Database for MySQL](../single-server/how-to-create-users.md).

#### [Passwordless connection (Recommended)](#tab/passwordless)

Create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_MYSQL_AD_NON_ADMIN_USERID=$CURRENT_USER_OBJECTID

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;

CREATE AADUSER '$AZ_MYSQL_AD_NON_ADMIN_USERNAME' IDENTIFIED BY '$AZ_MYSQL_AD_NON_ADMIN_USERID';

GRANT ALL PRIVILEGES ON demo.* TO '$AZ_MYSQL_AD_NON_ADMIN_USERNAME'@'%';

FLUSH privileges;

EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
mysql -h $AZ_DATABASE_NAME.mysql.database.azure.com --user $CURRENT_USERNAME --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

#### [Password](#tab/password)

Create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql

CREATE USER '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%' IDENTIFIED BY '$AZ_MYSQL_NON_ADMIN_PASSWORD';

GRANT ALL PRIVILEGES ON demo.* TO '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%';

FLUSH PRIVILEGES;

EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
mysql -h $AZ_DATABASE_NAME.mysql.database.azure.com --user $AZ_MYSQL_ADMIN_USERNAME --enable-cleartext-plugin --password=$AZ_MYSQL_ADMIN_PASSWORD < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

---

### Create a new Java project

Using your favorite IDE, create a new Java project, and add a *pom.xml* file in its root directory:

#### [Passwordless connection (Recommended)](#tab/passwordless)

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
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.30</version>
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
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.30</version>
        </dependency>
    </dependencies>
</project>
```

---

This file is an [Apache Maven](https://maven.apache.org/) file that configures your project to use:

- Java 8
- A recent MySQL driver for Java

### Prepare a configuration file to connect to Azure Database for MySQL

Run the following script in the project root directory to create a *src/main/resources/database.properties* file and add configuration details:

#### [Passwordless connection (Recommended)](#tab/passwordless)

```bash
mkdir -p src/main/resources && touch src/main/resources/database.properties

cat << EOF > src/main/resources/database.properties
url=jdbc:mysql://${AZ_DATABASE_NAME}.mysql.database.azure.com:3306/demo?sslMode=REQUIRED&serverTimezone=UTC&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin
user=${AZ_MYSQL_AD_NON_ADMIN_USERNAME}
EOF
```

> [!NOTE]
> If you are using MysqlConnectionPoolDataSource class as the datasource in your application, please remove "defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin" in the url.

```bash
mkdir -p src/main/resources && touch src/main/resources/database.properties

cat << EOF > src/main/resources/database.properties
url=jdbc:mysql://${AZ_DATABASE_NAME}.mysql.database.azure.com:3306/demo?sslMode=REQUIRED&serverTimezone=UTC&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin
user=${AZ_MYSQL_AD_NON_ADMIN_USERNAME}
EOF
```

#### [Password](#tab/password)

```bash
mkdir -p src/main/resources && touch src/main/resources/database.properties

cat << EOF > src/main/resources/database.properties
url=jdbc:mysql://${AZ_DATABASE_NAME}.mysql.database.azure.com:3306/demo?useSSL=true&sslMode=REQUIRED&serverTimezone=UTC
user=${AZ_MYSQL_NON_ADMIN_USERNAME}
password=${AZ_MYSQL_NON_ADMIN_PASSWORD}
EOF
```

---

> [!NOTE]
> The configuration property `url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Otherwise, your Java server would not use the same date format as the database, which would result in an error.

### Create an SQL file to generate the database schema

You'll use a *src/main/resources/schema.sql* file in order to create a database schema. Create that file, with the following content:

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

## Code the application

### Connect to the database

Next, add the Java code that will use JDBC to store and retrieve data from your MySQL server.

Create a *src/main/java/DemoApplication.java* file and add the following contents:

```java
package com.example.demo;

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

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
        properties.load(DemoApplication.class.getClassLoader().getResourceAsStream("database.properties"));

        log.info("Connecting to the database");
        Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties);
        log.info("Database connection test: " + connection.getCatalog());

        log.info("Create database schema");
        Scanner scanner = new Scanner(DemoApplication.class.getClassLoader().getResourceAsStream("schema.sql"));
        Statement statement = connection.createStatement();
        while (scanner.hasNextLine()) {
            statement.execute(scanner.nextLine());
        }

        /*
        Todo todo = new Todo(1L, "configuration", "congratulations, you have set up JDBC correctly!", true);
        insertData(todo, connection);
        todo = readData(connection);
        todo.setDetails("congratulations, you have updated data!");
        updateData(todo, connection);
        deleteData(todo, connection);
        */

        log.info("Closing database connection");
        connection.close();
        AbandonedConnectionCleanupThread.uncheckedShutdown();
    }
}
```

[Having any issues? Let us know.](https://github.com/MicrosoftDocs/azure-docs/issues)

This Java code will use the *database.properties* and the *schema.sql* files that you created earlier, in order to connect to the MySQL server and create a schema that will store your data.

In this file, you can see that we commented methods to insert, read, update and delete data: you'll code those methods in the rest of this article, and you'll be able to uncomment them one after each other.

> [!NOTE]
> The database credentials are stored in the *user* and *password* properties of the *database.properties* file. Those credentials are used when executing `DriverManager.getConnection(properties.getProperty("url"), properties);`, as the properties file is passed as an argument.

> [!NOTE]
> The `AbandonedConnectionCleanupThread.uncheckedShutdown();` line at the end is a MySQL driver specific command to destroy an internal thread when shutting down the application.
> It can be safely ignored.

You can now execute this main class with your favorite tool:

- Using your IDE, you should be able to right-click on the *DemoApplication* class and execute it.
- Using Maven, you can run the application by executing: `mvn exec:java -Dexec.mainClass="com.example.demo.DemoApplication"`.

The application should connect to the Azure Database for MySQL, create a database schema, and then close the connection, as you should see in the console logs:

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

### Insert data into Azure Database for MySQL

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

### Reading data from Azure Database for MySQL

Next, read the data previously inserted to validate that your code works correctly.

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

[Having any issues? Let us know.](https://github.com/MicrosoftDocs/azure-docs/issues)

### Updating data in Azure Database for MySQL

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

### Deleting data in Azure Database for MySQL

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

Congratulations! You've created a Java application that uses JDBC to store and retrieve data from Azure Database for MySQL.

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

> [!div class="nextstepaction"]
> [Migrate your MySQL database to Azure Database for MySQL using dump and restore](../concepts-migrate-dump-restore.md)
