---
title: Java app to connect and run SQL commands on Azure Cosmos DB for PostgreSQL
description: See how to create a Java app that connects and runs SQL statements on Azure Cosmos DB for PostgreSQL.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022, devx-track-extended-java
ms.topic: quickstart
recommendations: false
ms.date: 06/05/2023
---

# Java app to connect and run SQL commands on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[!INCLUDE [App stack selector](includes/quickstart-selector.md)]

This quickstart shows you how to use Java code to connect to a cluster, and use SQL statements to create a table. You'll then insert, query, update, and delete data in the database.  The steps in this article assume that you're familiar with Java development and [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity), and are new to working with Azure Cosmos DB for PostgreSQL.

## Set up the Java project and connection

Create a new Java project and a configuration file to connect to Azure Cosmos DB for PostgreSQL.

### Create a new Java project

Using your favorite integrated development environment (IDE), create a new Java project with groupId `test` and artifactId `crud`. In the project's root directory, add a *pom.xml* file with the following contents. This file configures [Apache Maven](https://maven.apache.org) to use Java 8 and a recent PostgreSQL driver for Java.

```xml
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

### Configure the database connection

In *src/main/resources/*, create an *application.properties* file with the following contents. Replace \<cluster> with your cluster name, and replace \<password> with your administrative password.

```properties
driver.class.name=org.postgresql.Driver
db.url=jdbc:postgresql://c-<cluster>.<uniqueID>.postgres.cosmos.azure.com:5432/citus?ssl=true&sslmode=require
db.username=citus
db.password=<password>
```

The `?ssl=true&sslmode=require` string in the `db.url` property tells the JDBC driver to use Transport Layer Security (TLS) when connecting to the database. It's mandatory to use TLS with Azure Cosmos DB for PostgreSQL, and is a good security practice.

## Create tables

Configure a database schema that has distributed tables. Connect to the database to create the schema and tables.

### Generate the database schema

In *src/main/resources/*, create a *schema.sql* file with the following contents:

```sql
DROP TABLE IF EXISTS public.pharmacy;
CREATE TABLE  public.pharmacy(pharmacy_id integer,pharmacy_name text ,city text ,state text ,zip_code integer);
CREATE INDEX idx_pharmacy_id ON public.pharmacy(pharmacy_id);
```

### Distribute tables

Azure Cosmos DB for PostgreSQL gives you [the super power of distributing tables](introduction.md) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!NOTE]
> Distributing tables lets them grow across any worker nodes added to the cluster.

To distribute tables, append the following line to the *schema.sql* file you created in the previous section.

```SQL
select create_distributed_table('public.pharmacy','pharmacy_id');
```

### Connect to the database and create the schema

Next, add the Java code that uses JDBC to store and retrieve data from your cluster. The code uses the *application.properties* and *schema.sql* files to connect to the cluster and create the schema.


1. Create a *DButil.java* file with the following code, which contains the `DButil` class. The `DBUtil` class sets up a connection pool to PostgreSQL using [HikariCP](https://github.com/brettwooldridge/HikariCP). You use this class to connect to PostgreSQL and start querying.

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

1. In *src/main/java/*, create a *DemoApplication.java* file that contains the following code:

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
   
   > [!NOTE]
   > The database `user` and `password` credentials are used when executing `DriverManager.getConnection(properties.getProperty("url"), properties);`. The credentials are stored in the *application.properties* file, which is passed as an argument.

1. You can now execute this main class with your favorite tool:

   - Using your IDE, you should be able to right-click on the `DemoApplication` class and execute it.
   - Using Maven, you can run the application by executing:<br>`mvn exec:java -Dexec.mainClass="com.example.demo.DemoApplication"`.

The application should connect to the Azure Cosmos DB for PostgreSQL, create a database schema, and then close the connection, as you should see in the console logs:

```output
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Create database schema
[INFO   ] Closing database connection
```

## Create a domain class

Create a new `Pharmacy` Java class, next to the `DemoApplication` class, and add the following code:

``` java
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

This class is a domain model mapped on the `Pharmacy` table that you created when executing the *schema.sql* script.

## Insert data

In the *DemoApplication.java* file, after the `main` method, add the following method that uses the INSERT INTO SQL statement to insert data into the database:

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

Add the two following lines in the main method:

```java
Pharmacy todo = new Pharmacy(0,"Target","Sunnyvale","California",94001);
insertData(todo, connection);
```

Executing the main class should now produce the following output:

```output
[INFO   ] Loading application properties
[INFO   ] Connecting to the database
[INFO   ] Database connection test: citus
[INFO   ] Creating table
[INFO   ] Creating index
[INFO   ] distributing table
[INFO   ] Insert data
[INFO   ] Closing database connection
```

## Read data

Read the data you previously inserted to validate that your code works correctly.

In the *DemoApplication.java* file, after the `insertData` method, add the following method that uses the SELECT SQL statement to read data from the database:

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

Add the following line in the main method:

```  java
todo = readData(connection);
```

Executing the main class should now produce the following output:

```output
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

## Update data

Update the data you previously inserted.

Still in the *DemoApplication.java* file, after the `readData` method, add the following method to update data inside the database by using the UPDATE SQL statement:

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

Add the two following lines in the main method:

``` java
todo.setcity("Guntur");
updateData(todo, connection);
```

Executing the main class should now produce the following output:

```output
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

## Delete data

Finally, delete the data you previously inserted. Still in the *DemoApplication.java* file, after the `updateData` method, add the following method to delete data inside the database by using the DELETE SQL statement:

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

```output
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

## COPY command for fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Azure Cosmos DB for PostgreSQL. The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code copies data from a CSV file to a database table. The code sample requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

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

```output
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

### COPY command to load in-memory data

The following code copies in-memory data to a table.

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

```output
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

## App retry for database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

In this code, replace \<cluster> with your cluster name and \<password> with your administrator password.

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
    private static final String DB_PASSWORD = "<password>";
    private static final String DB_URL = "jdbc:postgresql://c-<cluster>.<uniqueID>.postgres.cosmos.azure.com:5432/citus?sslmode=require";
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
