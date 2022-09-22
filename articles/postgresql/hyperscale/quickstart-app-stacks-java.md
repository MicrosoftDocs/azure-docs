---
title: Java app to connect and query Hyperscale (Citus)
description: Learn building a simple app on Hyperscale (Citus) using Java
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: quickstart
recommendations: false
ms.date: 08/24/2022
---

# Java app to connect and query Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

In this document, you'll learn how to connect to a Hyperscale (Citus) server group using a Java application. You'll see how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you're familiar with developing using Java and [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity), and are new to working with Hyperscale (Citus).

> [!TIP]
>
> The process of creating a Java app with Hyperscale (Citus) is the same as working with ordinary PostgreSQL.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* A supported [Java Development Kit](/azure/developer/java/fundamentals/java-support-on-azure), version 8 (included in Azure Cloud Shell).
* The [Apache Maven](https://maven.apache.org/) build tool.

## Setup

### Get Database Connection Information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. Replace the password placeholder with the actual password. See below screenshot.

![Diagram showing Java connection string.](../media/howto-app-stacks/02-java-connection-string.png)

### Create a new Java project

Using your favorite IDE, create a new Java project with groupId **test** and artifactId **crud**. Add a `pom.xml` file in its root directory:

```XML
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>test</groupId>
  <artifactId>crud</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <name>crud</name>
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-engine</artifactId>
      <version>5.7.1</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.2.12</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/com.zaxxer/HikariCP -->
    <dependency>
      <groupId>com.zaxxer</groupId>
      <artifactId>HikariCP</artifactId>
      <version>5.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-params</artifactId>
      <version>5.7.1</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.0.0-M5</version>
      </plugin>
    </plugins>
  </build>
</project>
```

This file configures [Apache Maven](https://maven.apache.org/) to use:

* Java 18
* A recent PostgreSQL driver for Java

### Prepare a configuration file to connect to Hyperscale (Citus)

Create a `src/main/resources/application.properties` file, and add:

``` properties
driver.class.name=org.postgresql.Driver
db.url=jdbc:postgresql://<host>:5432/citus?ssl=true&sslmode=require
db.username=citus
db.password=<password>
```

Replace the  \<host\> using the Connection string that you gathered previously. Replace \<password\> with the password that you set for the database.

> [!NOTE]
>
> We append `?ssl=true&sslmode=require` to the configuration property url, to tell the JDBC driver to use TLS (Transport Layer Security) when connecting to the database. It's mandatory to use TLS with Hyperscale (Citus), and it is a good security practice.

## Create tables in Hyperscale (Citus)

### Create an SQL file to generate the database schema

We'll use a `src/main/resources/schema.sql` file in order to create a database schema. Create that file, with the following content:

``` SQL
DROP TABLE IF EXISTS public.pharmacy;
CREATE TABLE  public.pharmacy(pharmacy_id integer,pharmacy_name text ,city text ,state text ,zip_code integer);
CREATE INDEX idx_pharmacy_id ON public.pharmacy(pharmacy_id);
```

### Use the super power of distributed tables

Hyperscale (Citus) gives you [the super power of distributing tables](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using the Basic Tier of Hyperscale (Citus), which is a single-node server group.

Append the below command to the `schema.sql` file in the previous section if you wanted to distribute your table.

```SQL
select create_distributed_table('public.pharmacy','pharmacy_id');
```

### Connect to the database, and create schema

Next, add the Java code that will use JDBC to store and retrieve data from your Hyperscale (Citus) server group.

#### Connection Pooling Setup

Using the code below, create a `DButil.java` file, which contains the `DButil`
class. The `DBUtil` class sets up a connection pool to PostgreSQL using
[HikariCP](https://github.com/brettwooldridge/HikariCP). In the example
application, we'll be using this class to connect to PostgreSQL and start
querying.

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

```java
//DButil.java
package test.crud;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Properties;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

public class DButil {
    private static final String DB_USERNAME = "db.username";
    private static final String DB_PASSWORD = "db.password";
    private static final String DB_URL = "db.url";
    private static final String DB_DRIVER_CLASS = "driver.class.name";
    private static Properties properties =  null;
    private static HikariDataSource datasource;

    static {
        try {
            properties = new Properties();
            properties.load(new FileInputStream("src/main/java/application.properties"));

            datasource = new HikariDataSource();
            datasource.setDriverClassName(properties.getProperty(DB_DRIVER_CLASS ));
            datasource.setJdbcUrl(properties.getProperty(DB_URL));
            datasource.setUsername(properties.getProperty(DB_USERNAME));
            datasource.setPassword(properties.getProperty(DB_PASSWORD));
            datasource.setMinimumIdle(100);
            datasource.setMaximumPoolSize(1000000000);
            datasource.setAutoCommit(true);
            datasource.setLoginTimeout(3);
        } catch (IOException | SQLException  e) {
            e.printStackTrace();
        }
    }
    public static DataSource getDataSource() {
        return datasource;
    }
}
```

Create a `src/main/java/DemoApplication.java` file that contains:

``` java
package test.crud;
import java.io.IOException;
import java.sql.*;
import java.util.*;
import java.util.logging.Logger;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import org.postgresql.copy.CopyManager;
import org.postgresql.core.BaseConnection;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;

public class DemoApplication {

    private static final Logger log;

    static {
        System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
        log =Logger.getLogger(DemoApplication.class.getName());
    }
    public static void main(String[] args)throws Exception
    {
        log.info("Connecting to the database");
        Connection connection = DButil.getDataSource().getConnection();
        System.out.println("The Connection Object is of Class: " + connection.getClass());
        log.info("Database connection test: " + connection.getCatalog());
        log.info("Creating table");
        log.info("Creating index");
        log.info("distributing table");
        Scanner scanner = new Scanner(DemoApplication.class.getClassLoader().getResourceAsStream("schema.sql"));
        Statement statement = connection.createStatement();
        while (scanner.hasNextLine()) {
            statement.execute(scanner.nextLine());
        }
        log.info("Closing database connection");
        connection.close();
    }

}
```

The above code will use the **application.properties** and **schema.sql** files to connect to Hyperscale (Citus) and create the schema.

> [!NOTE]
>
> The database credentials are stored in the user and password properties of the application.properties file. Those credentials are used when executing `DriverManager.getConnection(properties.getProperty("url"), properties);`, as the properties file is passed as an argument.

You can now execute this main class with your favorite tool:

* Using your IDE, you should be able to right-click on the `DemoApplication` class and execute it.
* Using Maven, you can run the application by executing: `mvn exec:java -Dexec.mainClass="com.example.demo.DemoApplication"`.

The application should connect to the Hyperscale (Citus), create a database schema, and then close the connection, as you should see in the console logs:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Create database schema
[INFO   ] Closing database connection
```

## Create a domain class

Create a new `Pharmacy` Java class, next to the `DemoApplication` class, and add the following code:

``` Java
public class Pharmacy {
    private Integer pharmacy_id;
    private String pharmacy_name;
    private String city;
    private String state;
    private Integer zip_code;
    public Pharmacy() { }
    public Pharmacy(Integer pharmacy_id, String pharmacy_name, String city,String state,Integer zip_code)
    {
        this.pharmacy_id = pharmacy_id;
        this.pharmacy_name = pharmacy_name;
        this.city = city;
        this.state = state;
        this.zip_code = zip_code;
    }

    public Integer getpharmacy_id() {
        return pharmacy_id;
    }

    public void setpharmacy_id(Integer pharmacy_id) {
        this.pharmacy_id = pharmacy_id;
    }

    public String getpharmacy_name() {
        return pharmacy_name;
    }

    public void setpharmacy_name(String pharmacy_name) {
        this.pharmacy_name = pharmacy_name;
    }

    public String getcity() {
        return city;
    }

    public void setcity(String city) {
        this.city = city;
    }

    public String getstate() {
        return state;
    }

    public void setstate(String state) {
        this.state = state;
    }

    public Integer getzip_code() {
        return zip_code;
    }

    public void setzip_code(Integer zip_code) {
        this.zip_code = zip_code;
    }
    @Override
    public String toString() {
        return "TPharmacy{" +
               "pharmacy_id=" + pharmacy_id +
               ", pharmacy_name='" + pharmacy_name + '\'' +
               ", city='" + city + '\'' +
               ", state='" + state + '\'' +
               ", zip_code='" + zip_code + '\'' +
               '}';
    }
}
```

This class is a domain model mapped on the `Pharmacy` table that you created when executing the `schema.sql` script.

## Insert data into Hyperscale (Citus)

In the `src/main/java/DemoApplication.java` file, after the `main` method, add the following method to insert data into the database:

``` Java
private static void insertData(Pharmacy todo, Connection connection) throws SQLException {
    log.info("Insert data");
    PreparedStatement insertStatement = connection
        .prepareStatement("INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code)  VALUES (?, ?, ?, ?, ?);");

    insertStatement.setInt(1, todo.getpharmacy_id());
    insertStatement.setString(2, todo.getpharmacy_name());
    insertStatement.setString(3, todo.getcity());
    insertStatement.setString(4, todo.getstate());
    insertStatement.setInt(5, todo.getzip_code());

    insertStatement.executeUpdate();
}
```

You can now add the two following lines in the main method:

```java
Pharmacy todo = new Pharmacy(0,"Target","Sunnyvale","California",94001);
insertData(todo, connection);
```

Executing the main class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Closing database connection
```

## Reading data from Hyperscale (Citus)

Let's read the data previously inserted, to validate that our code works correctly.

In the `src/main/java/DemoApplication.java` file, after the `insertData` method, add the following method to read data from the database:

```  java
private static Pharmacy readData(Connection connection) throws SQLException {
    log.info("Read data");
    PreparedStatement readStatement = connection.prepareStatement("SELECT * FROM Pharmacy;");
    ResultSet resultSet = readStatement.executeQuery();
    if (!resultSet.next()) {
        log.info("There is no data in the database!");
        return null;
    }
    Pharmacy todo = new Pharmacy();
    todo.setpharmacy_id(resultSet.getInt("pharmacy_id"));
    todo.setpharmacy_name(resultSet.getString("pharmacy_name"));
    todo.setcity(resultSet.getString("city"));
    todo.setstate(resultSet.getString("state"));
    todo.setzip_code(resultSet.getInt("zip_code"));
    log.info("Data read from the database: " + todo.toString());
    return todo;
}
```

You can now add the following line in the main method:

```  java
todo = readData(connection);
```

Executing the main class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Sunnyvale', state='California', zip_code='94001'}
[INFO   ] Closing database connection
```

## Updating data in Hyperscale (Citus)

Let's update the data we previously inserted.

Still in the `src/main/java/DemoApplication.java` file, after the `readData` method, add the following method to update data inside the database:

``` java
private static void updateData(Pharmacy todo, Connection connection) throws SQLException {
    log.info("Update data");
    PreparedStatement updateStatement = connection
        .prepareStatement("UPDATE pharmacy SET city = ? WHERE pharmacy_id = ?;");

    updateStatement.setString(1, todo.getcity());

    updateStatement.setInt(2, todo.getpharmacy_id());
    updateStatement.executeUpdate();
    readData(connection);
}

```

You can now add the two following lines in the main method:

``` java
todo.setcity("Guntur");
updateData(todo, connection);
```

Executing the main class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Sunnyvale', state='California', zip_code='94001'}
[INFO   ] Update data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Guntur', state='California', zip_code='94001'}
[INFO   ] Closing database connection
```

## Deleting data in Hyperscale (Citus)

Finally, let's delete the data we previously inserted.

Still in the `src/main/java/DemoApplication.java` file, after the `updateData` method, add the following method to delete data inside the database:

``` java
private static void deleteData(Pharmacy todo, Connection connection) throws SQLException {
    log.info("Delete data");
    PreparedStatement deleteStatement = connection.prepareStatement("DELETE FROM pharmacy WHERE pharmacy_id = ?;");
    deleteStatement.setLong(1, todo.getpharmacy_id());
    deleteStatement.executeUpdate();
    readData(connection);
}
```

You can now add the following line in the main method:

``` java
deleteData(todo, connection);
```

Executing the main class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Sunnyvale', state='California', zip_code='94001'}
[INFO   ] Update data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Guntur', state='California', zip_code='94001'}
[INFO   ] Delete data
[INFO   ] Read data
[INFO   ] There is no data in the database!
[INFO   ] Closing database connection
```

## COPY command for super fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from a CSV file to a database table.

It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```java
public static long
copyFromFile(Connection connection, String filePath, String tableName)
throws SQLException, IOException {
    long count = 0;
    FileInputStream fileInputStream = null;

    try {
        Connection unwrap = connection.unwrap(Connection.class);
        BaseConnection  connSec = (BaseConnection) unwrap;

        CopyManager copyManager = new CopyManager((BaseConnection) connSec);
        fileInputStream = new FileInputStream(filePath);
        count = copyManager.copyIn("COPY " + tableName + " FROM STDIN delimiter ',' csv", fileInputStream);
    } finally {
        if (fileInputStream != null) {
            try {
                fileInputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    return count;
}
```

You can now add the following line in the main method:

``` java
int c = (int) copyFromFile(connection,"C:\\Users\\pharmacies.csv", "pharmacy");
log.info("Copied "+ c +" rows using COPY command");
```

Executing the `main` class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Sunnyvale', state='California', zip_code='94001'}
[INFO   ] Update data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Guntur', state='California', zip_code='94001'}
[INFO   ] Delete data
[INFO   ] Read data
[INFO   ] There is no data in the database!
[INFO ] Copied 5000 rows using COPY command
[INFO   ] Closing database connection
```

### COPY command to load data in-memory

The following code is an example for copying in-memory data to table.

```java
private static void inMemory(Connection connection) throws SQLException,IOException
    {
    log.info("Copying inmemory data into table");
            
    final List<String> rows = new ArrayList<>();
    rows.add("0,Target,Sunnyvale,California,94001");
    rows.add("1,Apollo,Guntur,Andhra,94003");
        
    final BaseConnection baseConnection = (BaseConnection) connection.unwrap(Connection.class);
    final CopyManager copyManager = new CopyManager(baseConnection);

    // COPY command can change based on the format of rows. This COPY command is for above rows.
    final String copyCommand = "COPY pharmacy FROM STDIN with csv";        
       
    try (final Reader reader = new StringReader(String.join("\n", rows))) {
        copyManager.copyIn(copyCommand, reader);
    }
}
```

You can now add the following line in the main method:

``` java
inMemory(connection);
```

Executing the main class should now produce the following output:

```
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Sunnyvale', state='California', zip_code='94001'}
[INFO   ] Update data
[INFO   ] Read data
[INFO   ] Data read from the database: Pharmacy{pharmacy_id=0, pharmacy_name='Target', city='Guntur', state='California', zip_code='94001'}
[INFO   ] Delete data
[INFO   ] Read data
[INFO   ] There is no data in the database!
5000
[INFO   ] Copying in-memory data into table
[INFO   ] Closing database connection
```

## App retry during database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

```java
package test.crud;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.logging.Logger;
import com.zaxxer.hikari.HikariDataSource;

public class DemoApplication
{
    private static final Logger log;

    static
    {
        System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
        log = Logger.getLogger(DemoApplication.class.getName());
    }
    private static final String DB_USERNAME = "citus";
    private static final String DB_PASSWORD = "<Your Password>";
    private static final String DB_URL = "jdbc:postgresql://<Server Name>:5432/citus?sslmode=require";
    private static final String DB_DRIVER_CLASS = "org.postgresql.Driver";
    private static HikariDataSource datasource;

    private static String executeRetry(String sql, int retryCount) throws InterruptedException
    {
        Connection con = null;
        PreparedStatement pst = null;
        ResultSet rs = null;
        for (int i = 1; i <= retryCount; i++)
        {
            try
            {
                datasource = new HikariDataSource();
                datasource.setDriverClassName(DB_DRIVER_CLASS);
                datasource.setJdbcUrl(DB_URL);
                datasource.setUsername(DB_USERNAME);
                datasource.setPassword(DB_PASSWORD);
                datasource.setMinimumIdle(10);
                datasource.setMaximumPoolSize(1000);
                datasource.setAutoCommit(true);
                datasource.setLoginTimeout(3);
                log.info("Connecting to the database");
                con = datasource.getConnection();
                log.info("Connection established");
                log.info("Read data");
                pst = con.prepareStatement(sql);
                rs = pst.executeQuery();
                StringBuilder builder = new StringBuilder();
                int columnCount = rs.getMetaData().getColumnCount();
                while (rs.next())
                {
                    for (int j = 0; j < columnCount;)
                    {
                        builder.append(rs.getString(j + 1));
                        if (++j < columnCount)
                            builder.append(",");
                    }
                    builder.append("\r\n");
                }
                return builder.toString();
            }
            catch (Exception e)
            {
                Thread.sleep(60000);
                System.out.println(e.getMessage());
            }
        }
        return null;
    }

    public static void main(String[] args) throws Exception
    {
        String result = executeRetry("select 1", 5);
        System.out.print(result);
    }
}
```

## Next steps

[!INCLUDE[app-stack-next-steps](includes/app-stack-next-steps.md)]
