---
title: Implement a geo-distributed Azure SQL database solution| Microsoft Docs
description: Learn to configure your Azure SQL database and application for failover to a replicated database, and test failover.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
manager: craigg
ms.date: 01/03/2018
---
# Tutorial: Implement a geo-distributed database

Configure an Azure SQL database application for failover to a remote region and test a failover plan. You learn how to:

> [!div class="checklist"]
> - Manage database users and grant permissions
> - Set up a database-level firewall rule
> - Create a [failover group](sql-database-auto-failover-group.md)
> - Run a Java application to query an Azure SQL database
> - Perform a disaster recovery drill

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete the tutorial, make sure the following is installed:

- [Azure PowerShell](/powershell/azureps-cmdlets-docs)
- An Azure SQL database. To create one use,
  - [Portal](sql-database-get-started-portal.md)
  - [CLI](sql-database-cli-samples.md)
  - [PowerShell](sql-database-powershell-samples.md)

  > [!NOTE]
  > The tutorial uses the *AdventureWorksLT* sample database with the name *mySampleDatabase*.

- A method to execute SQL on the database with any of the following query tools:
  - [Azure portal](https://portal.azure.com) query editor, see [Connect and query using Query Editor](sql-database-get-started-portal.md#query-the-sql-database)
  - [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms), an integrated environment for managing SQL Server
  - [Visual Studio Code](https://code.visualstudio.com/docs), a graphical code editor for Linux, macOS, and Windows that supports extensions

    > [!NOTE]
    > VS Code includes the [mssql extension](https://aka.ms/mssql-marketplace) for querying SQL Server and Azure SQL database and data warehouse. For more information, see [Connect and query with VS Code](sql-database-connect-query-vscode.md).

## Manage users and permissions

To connect to your database and create user accounts, use one of the following query tools:

- Query editor in the Azure portal
- SQL Server Management Studio (SSMS)
- Visual Studio Code (VS Code)

User accounts replicate automatically to the secondary server (to stay in sync). To use SSMS or VS Code, you may need to configure a firewall rule if you're connecting from a client at an IP address for which you have not yet configured a firewall. For detailed steps, see [Create a server-level firewall rule](sql-database-get-started-portal-firewall.md).

In a query window, execute the following script to create user accounts in the database:

   ```sql
   CREATE USER app_admin WITH PASSWORD = 'ChangeYourPassword1';
   --Add SQL user to db_owner role
   ALTER ROLE db_owner ADD MEMBER app_admin;
   --Create additional SQL user
   CREATE USER app_user WITH PASSWORD = 'ChangeYourPassword1';
   --grant permission to SalesLT schema
   GRANT SELECT, INSERT, DELETE, UPDATE ON SalesLT.Product TO app_user;
   ```

This grants *db_owner* permissions to the *app_admin* account and `SELECT`, `UPDATE` permissions to the *app_user* account.

## Create a database-level firewall

Create a [database-level firewall rule](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database) for your SQL database.

In the query window, run the following script after replacing the IP addresses with the IP addresses for your environment:

   ```sql
   -- Create database-level firewall setting for your public IP address
   EXECUTE sp_set_database_firewall_rule @name = N'myGeoReplicationFirewallRule',@start_ip_address = '0.0.0.0', @end_ip_address = '0.0.0.0';
   ```

Database-level firewall rules replicate automatically to the secondary server. For this tutorial, use the public IP address of the computer on which you're performing the steps in this tutorial. To determine the IP address used for the server-level firewall rule for your computer, see [Create a server-level firewall](sql-database-get-started-portal-firewall.md).  

## Create a failover group

Using Azure PowerShell, create an [failover groups](sql-database-auto-failover-group.md) between your existing Azure SQL server and the new empty Azure SQL server in an Azure region, and then add your sample database to the failover group.

> [!IMPORTANT]
> The cmdlets here require Azure PowerShell 4.0. [!INCLUDE [sample-powershell-install](../../includes/sample-powershell-install-no-ssh.md)]

1. Set variables for your server and database:

   ```powershell
   $adminlogin = "ServerAdmin"
   $password = "ChangeYourAdminPassword1"
   $myresourcegroupname = "<your resource group name>"
   $mylocation = "<your resource group location>"
   $myservername = "<your existing server name>"
   $mydatabasename = "mySampleDatabase"
   $mydrlocation = "<your disaster recovery location>"
   $mydrservername = "<your disaster recovery server name>"
   $myfailovergroupname = "<your globally unique failover group name>"
   ```

1. Create a backup server in the failover region:

   ```powershell
   $mydrserver = New-AzureRmSqlServer -ResourceGroupName $myresourcegroupname `
      -ServerName $mydrservername `
      -Location $mydrlocation `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
         -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
   $mydrserver
   ```

1. Create a failover group between the two servers:

   ```powershell
   $myfailovergroup = New-AzureRMSqlDatabaseFailoverGroup `
      –ResourceGroupName $myresourcegroupname `
      -ServerName $myservername `
      -PartnerServerName $mydrservername  `
      –FailoverGroupName $myfailovergroupname `
      –FailoverPolicy Automatic `
      -GracePeriodWithDataLossHours 2
   $myfailovergroup
   ```

1. Add the database to the failover group:

   ```powershell
   $myfailovergroup = Get-AzureRmSqlDatabase `
      -ResourceGroupName $myresourcegroupname `
      -ServerName $myservername `
      -DatabaseName $mydatabasename | `
    Add-AzureRmSqlDatabaseToFailoverGroup `
      -ResourceGroupName $myresourcegroupname ` `
      -ServerName $myservername `
      -FailoverGroupName $myfailovergroupname
   $myfailovergroup
   ```

## Install Java software

The steps here assume that you're familiar with Java development and are new to working with Azure SQL database. Use Maven to help manage dependencies, build, test, and run your Java project. 

### Mac OS

Open your terminal and navigate to a directory where you plan to create your Java project. Install **brew** and **Maven** with the following commands:

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install maven
```

For guidance on installing the Java and Maven environment, see [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/), select **Java** > **MacOS**, and follow step 1.2 and 1.3 to configure Java and Maven.

### Linux (Ubuntu)

Open the terminal and navigate to a directory where you plan to create the Java project. Install **Maven** with the following command:

```bash
sudo apt-get install maven
```

To install the Java and Maven environment, see [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/), select **Java** > **Ubuntu**, and follow step 1.2, 1.3, and 1.4 to configure Java and Maven.

### Windows

Install [Maven](https://maven.apache.org/download.cgi) using the installer. For detailed guidance on installing and configuring Java and Maven environment, go the [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/), select **Java** > **Windows** and follow step 1.2 and 1.3 to configure Java and Maven.

## Create SqlDbSample project

1. In the console, create a Maven project with the following command:

   ```bash
   mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=SqlDbSample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"
   ```

1. Type **Y** and press **Enter**.

1. Change directories to the new project.

   ```bash
   cd SqlDbSamples
   ```

1. Using your favorite editor, open the *pom.xml* file in your project folder.

1. Add the Microsoft JDBC Driver for SQL Server dependency by adding the following `dependency` section to the *pom.xml* file. The JDBC dependency must be pasted within the larger `dependencies` section.

   ```xml
   <dependency>
     <groupId>com.microsoft.sqlserver</groupId>
     <artifactId>mssql-jdbc</artifactId>
    <version>6.1.0.jre8</version>
   </dependency>
   ```

1. Specify the Java version by adding the following `properties` section to the *pom.xml* file after the `dependencies` section:

   ```xml
   <properties>
     <maven.compiler.source>1.8</maven.compiler.source>
     <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

1. Support manifest files by adding the following `build` section to the pom.xml file after the `properties` section:

   ```xml
   <build>
     <plugins>
       <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-jar-plugin</artifactId>
         <version>3.0.0</version>
         <configuration>
           <archive>
             <manifest>
               <mainClass>com.sqldbsamples.App</mainClass>
             </manifest>
           </archive>
        </configuration>
       </plugin>
     </plugins>
   </build>
   ```

1. Save and close the *pom.xml* file.

1. Open the *App.java* file located in C:\apache-maven-3.5.0\SqlDbSample\src\main\java\com\sqldbsamples and replace the contents with the following:

   ```java
   package com.sqldbsamples;

   import java.sql.Connection;
   import java.sql.Statement;
   import java.sql.PreparedStatement;
   import java.sql.ResultSet;
   import java.sql.Timestamp;
   import java.sql.DriverManager;
   import java.util.Date;
   import java.util.concurrent.TimeUnit;

   public class App {

      private static final String FAILOVER_GROUP_NAME = "myfailovergroupname";  // add failover group name
  
      private static final String DB_NAME = "mySampleDatabase";  // add database name
      private static final String USER = "app_user";  // add database user
      private static final String PASSWORD = "ChangeYourPassword1";  // add database password

      private static final String READ_WRITE_URL = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", FAILOVER_GROUP_NAME, DB_NAME, USER, PASSWORD);
      private static final String READ_ONLY_URL = String.format("jdbc:sqlserver://%s.secondary.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", FAILOVER_GROUP_NAME, DB_NAME, USER, PASSWORD);

      public static void main(String[] args) {
         System.out.println("#######################################");
         System.out.println("## GEO DISTRIBUTED DATABASE TUTORIAL ##");
         System.out.println("#######################################");
         System.out.println("");

         int highWaterMark = getHighWaterMarkId();

         try {
            for(int i = 1; i < 1000; i++) {
                //  loop will run for about 1 hour
                System.out.print(i + ": insert on primary " + (insertData((highWaterMark + i))?"successful":"failed"));
                TimeUnit.SECONDS.sleep(1);
                System.out.print(", read from secondary " + (selectData((highWaterMark + i))?"successful":"failed") + "\n");
                TimeUnit.SECONDS.sleep(3);
            }
         } catch(Exception e) {
            e.printStackTrace();
      }
   }

   private static boolean insertData(int id) {
      // Insert data into the product table with a unique product name that we can use to find the product again later
      String sql = "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) VALUES (?,?,?,?,?,?);";

      try (Connection connection = DriverManager.getConnection(READ_WRITE_URL);
              PreparedStatement pstmt = connection.prepareStatement(sql)) {
         pstmt.setString(1, "BrandNewProduct" + id);
         pstmt.setInt(2, 200989 + id + 10000);
         pstmt.setString(3, "Blue");
         pstmt.setDouble(4, 75.00);
         pstmt.setDouble(5, 89.99);
         pstmt.setTimestamp(6, new Timestamp(new Date().getTime()));
         return (1 == pstmt.executeUpdate());
      } catch (Exception e) {
         return false;
      }
   }

   private static boolean selectData(int id) {
      // Query the data that was previously inserted into the primary database from the geo replicated database
      String sql = "SELECT Name, Color, ListPrice FROM SalesLT.Product WHERE Name = ?";

      try (Connection connection = DriverManager.getConnection(READ_ONLY_URL);
              PreparedStatement pstmt = connection.prepareStatement(sql)) {
         pstmt.setString(1, "BrandNewProduct" + id);
         try (ResultSet resultSet = pstmt.executeQuery()) {
            return resultSet.next();
         }
      } catch (Exception e) {
         return false;
      }
   }

   private static int getHighWaterMarkId() {
      // Query the high water mark id that is stored in the table to be able to make unique inserts
      String sql = "SELECT MAX(ProductId) FROM SalesLT.Product";
      int result = 1;
      try (Connection connection = DriverManager.getConnection(READ_WRITE_URL);
              Statement stmt = connection.createStatement();
              ResultSet resultSet = stmt.executeQuery(sql)) {
         if (resultSet.next()) {
             result =  resultSet.getInt(1);
            }
         } catch (Exception e) {
          e.printStackTrace();
         }
         return result;
      }
   }
   ```

1. Save and close the *App.java* file.

## Run the project

1. In the command console, execute to following command:

   ```bash
   mvn package
   ```

1. Run the following command to start the application. This can take about 1 hour unless you stop it manually.

   ```bash
   mvn -q -e exec:java "-Dexec.mainClass=com.sqldbsamples.App"

   #######################################
   ## GEO DISTRIBUTED DATABASE TUTORIAL ##
   #######################################

   1. insert on primary successful, read from secondary successful
   2. insert on primary successful, read from secondary successful
   3. insert on primary successful, read from secondary successful
   ```

## Perform disaster recovery drill

1. Call manual failover of failover group:

   ```powershell
   Switch-AzureRMSqlDatabaseFailoverGroup `
   -ResourceGroupName $myresourcegroupname  `
   -ServerName $mydrservername `
   -FailoverGroupName $myfailovergroupname
   ```

1. Observe the application results during failover. Some inserts fail while the DNS cache refreshes.

1. Find out which role your disaster recovery server is performing.

   ```powershell
   $mydrserver.ReplicationRole
   ```

1. Failback.

   ```powershell
   Switch-AzureRMSqlDatabaseFailoverGroup `
   -ResourceGroupName $myresourcegroupname  `
   -ServerName $myservername `
   -FailoverGroupName $myfailovergroupname
   ```

1. Observe the application results during failback. Some inserts fail while the DNS cache refreshes.

1. Find out which role your disaster recovery server is performing.

   ```powershell
   $fileovergroup = Get-AzureRMSqlDatabaseFailoverGroup `
      -FailoverGroupName $myfailovergroupname `
      -ResourceGroupName $myresourcegroupname `
      -ServerName $mydrservername
   $fileovergroup.ReplicationRole
   ```

## Next steps

In this tutorial, you configured an Azure SQL database and application for failover to a remote region and tested your failover plan. You learned how to:

> [!div class="checklist"]
> - Create database users and grant permissions
> - Set up a database-level firewall rule
> - Create a geo-replication failover group
> - Create and compile a Java application to query an Azure SQL database
> - Perform a disaster recovery drill

Advance to the next tutorial on how to migrate SQL Server to Azure SQL database managed instance using DMS.

> [!div class="nextstepaction"]
> [Migrate SQL Server to Azure SQL database managed instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md)
