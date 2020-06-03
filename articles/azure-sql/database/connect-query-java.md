---
title: Use Java to query a database
description: Shows you how to use Java to create a program that connects to a database in Azure SQL Database or Azure SQL Managed Instance and query it using T-SQL statements.
titleSuffix: Azure SQL Database & SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.devlang: java
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: v-masebo
ms.date: 05/29/2020
ms.custom: seo-java-july2019. seo-java-august2019, sqldbrb=2 
---
# Quickstart: Use Java to query a database in Azure SQL Database or Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

In this quickstart, you use Java to connect to a database in Azure SQL Database or Azure SQL Managed Instance, and use T-SQL statements to query data.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

  || SQL Database | SQL Managed Instance | SQL Server on Azure VM |
  |:--- |:--- |:---|:---|
  | Create| [Portal](single-database-create-quickstart.md) | [Portal](../managed-instance/instance-create-quickstart.md) | [Portal](../virtual-machines/windows/sql-vm-create-portal-quickstart.md)
  || [CLI](scripts/create-and-configure-database-cli.md) | [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) |
  || [PowerShell](scripts/create-and-configure-database-powershell.md) | [PowerShell](../managed-instance/scripts/create-configure-managed-instance-powershell.md) | [PowerShell](../virtual-machines/windows/sql-vm-create-powershell-quickstart.md)
  | Configure | [Server-level IP firewall rule](firewall-create-server-level-portal-quickstart.md)| [Connectivity from a VM](../managed-instance/connect-vm-instance-configure.md)|
  |||[Connectivity from on-premises](../managed-instance/point-to-site-p2s-configure.md) | [Connect to a SQL Server instance](../virtual-machines/windows/sql-vm-create-portal-quickstart.md)
  |Load data|Adventure Works loaded per quickstart|[Restore Wide World Importers](../managed-instance/restore-sample-database-quickstart.md) | [Restore Wide World Importers](../managed-instance/restore-sample-database-quickstart.md) |
  |||Restore or import Adventure Works from a [BACPAC](database-import.md) file from [GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)| Restore or import Adventure Works from a [BACPAC](database-import.md) file from [GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)|
  |||

- [Java](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server)-related software

  # [macOS](#tab/macos)

  Install Homebrew and Java, and then install Maven using steps **1.2** and **1.3** in [Create Java apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/java/mac/).

  # [Ubuntu](#tab/ubuntu)

  Install Java, install the Java Development Kit, and then install Maven using steps **1.2**, **1.3**, and **1.4** in [Create Java apps using SQL Server on Ubuntu](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu/).

  # [Windows](#tab/windows)

  Install Java, and then install Maven using steps **1.2** and **1.3** in [Create Java apps using SQL Server on Windows](https://www.microsoft.com/sql-server/developer-get-started/java/windows/).

  ---

> [!IMPORTANT]
> The scripts in this article are written to use the **Adventure Works** database.

> [!NOTE]
> You can optionally choose to use an Azure SQL Managed Instance.
>
> To create and configure, use the [Azure portal](../managed-instance/instance-create-quickstart.md), [PowerShell](../managed-instance/scripts/create-configure-managed-instance-powershell.md), or [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44), and then set up [on-premises](../managed-instance/point-to-site-p2s-configure.md) or [VM](../managed-instance/connect-vm-instance-configure.md) connectivity.
>
> To load data, see [restore with BACPAC](database-import.md) with the [Adventure Works](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works) file, or see [restore the Wide World Importers database](../managed-instance/restore-sample-database-quickstart.md).

## Get server connection information

Get the connection information you need to connect to the database in Azure SQL Database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **SQL databases** or open the **SQL Managed Instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a database in Azure SQL Database or the fully qualified server name (or IP address) next to **Host** for an Azure SQL Managed Instance or SQL Server on Azure VM. To copy the server name or host name, hover over it and select the **Copy** icon.

> [!NOTE]
> For connection information for SQL Server on Azure VM, see [Connect to SQL Server](../virtual-machines/windows/sql-vm-create-portal-quickstart.md#connect-to-sql-server).

## Create the project

1. From the command prompt, create a new Maven project called *sqltest*.

    ```bash
    mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=sqltest" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0" --batch-mode
    ```

1. Change the folder to *sqltest* and open *pom.xml* with your favorite text editor. Add the **Microsoft JDBC Driver for SQL Server** to your project's dependencies using the following code.

    ```xml
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>7.0.0.jre8</version>
    </dependency>
    ```

1. Also in *pom.xml*, add the following properties to your project. If you don't have a properties section, you can add it after the dependencies.

   ```xml
   <properties>
       <maven.compiler.source>1.8</maven.compiler.source>
       <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

1. Save and close *pom.xml*.

## Add code to query the database

1. You should already have a file called *App.java* in your Maven project located at:

   *..\sqltest\src\main\java\com\sqldbsamples\App.java*

1. Open the file and replace its contents with the following code. Then add the appropriate values for your server, database, user, and password.

    ```java
    package com.sqldbsamples;

    import java.sql.Connection;
    import java.sql.Statement;
    import java.sql.PreparedStatement;
    import java.sql.ResultSet;
    import java.sql.DriverManager;

    public class App {

        public static void main(String[] args) {

            // Connect to database
            String hostName = "your_server.database.windows.net"; // update me
            String dbName = "your_database"; // update me
            String user = "your_username"; // update me
            String password = "your_password"; // update me
            String url = String.format("jdbc:sqlserver://%s:1433;database=%s;user=%s;password=%s;encrypt=true;"
                + "hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
            Connection connection = null;

            try {
                connection = DriverManager.getConnection(url);
                String schema = connection.getSchema();
                System.out.println("Successful connection - Schema: " + schema);

                System.out.println("Query data example:");
                System.out.println("=========================================");

                // Create and execute a SELECT SQL statement.
                String selectSql = "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName "
                    + "FROM [SalesLT].[ProductCategory] pc "  
                    + "JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid";

                try (Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(selectSql)) {

                    // Print results from select statement
                    System.out.println("Top 20 categories:");
                    while (resultSet.next())
                    {
                        System.out.println(resultSet.getString(1) + " "
                            + resultSet.getString(2));
                    }
                    connection.close();
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    ```

   > [!NOTE]
   > The code example uses the **AdventureWorksLT** sample database in Azure SQL Database.

## Run the code

1. At the command prompt, run the app.

    ```bash
    mvn package -DskipTests
    mvn -q exec:java "-Dexec.mainClass=com.sqldbsamples.App"
    ```

1. Verify that the top 20 rows are returned and close the app window.

## Next steps

- [Design your first database in Azure SQL Database](design-first-database-tutorial.md)  
- [Microsoft JDBC Driver for SQL Server](https://github.com/microsoft/mssql-jdbc)  
- [Report issues/ask questions](https://github.com/microsoft/mssql-jdbc/issues)  
