---
title: "Tutorial: Add an Azure SQL Database single database to a failover group | Microsoft Docs"
description: Add an Azure SQL Database single database to a failover group using the Azure Portal, PowerShell, or Azure CLI.  
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
ms.date: 03/12/2019
---
# Tutorial: Add an Azure SQL Database single database to a failover group

Configure a failover group for an Azure SQL Database single database and test failover.  In this tutorial, you will learn how to:

> [!div class="checklist"]
> - Create a [failover group](sql-database-auto-failover-group.md) for a single database
> - Test failover

Choose your method:

<!-- 
The following section is for the Azure Portal
-->

## Prerequisites
- An Azure subscription. [Create a free account](https://azure.microsoft.com/free/) if you don't already have one.


## 1 - Create a single database
In this step, you will create your Azure SQL Database single database. 

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Type `sql database` into the search box, and press enter. 
1. Select the **SQL Database** option published by Microsoft. 
1. Select **Create** to create your Azure SQL Database. 
1. On the **Basics** tab, under **Project Details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type `myResourceGroup` for the name.  

   ![Project details for a new SQL DB](media/sql-database-single-db-create-fail-over-group-tutorial/sqldb-project-details.png)

1. Under **Database Details**, type or select the following values: 
   - Database name: Enter `mySampleDatabase`
   - Server: Select **Create new** and enter the following values, and then select **Select**. 
       - **Server name**: Choose a unique server name for your logical server, such as `failover-sqlserver`. 
       - **Server admin login**: Type `AzureAdmin`
       - **Password**: Type a complex password that meets password requirements.
       - **Location**: Choose a location from the drop-down, such as West US 2.

   ![SQL Database database details](media/sql-database-single-db-create-fail-over-group-tutorial/sqldb-database-details.png)


  > [!IMPORTANT]
  Remember to record the server admin login and password so you can log in to the server and databases for this and other quickstarts. If you forget your login or password, you can get the login name or reset the password on the SQL server page. To open the SQL server page, select the server name on the database Overview page after database creation.

   - **Want to use SQL elastic pool**: Select the **No** option. 
   - **Compute + storage**: Select **Configure database**. 
       - Select **Looking for basic, standard, premium?**. 
       - Select **Standard** and select **Apply**. 

    ![Configure SQL DB compute](media/sql-database-single-db-create-fail-over-group-tutorial/sqldb-configuredb.png)

1. Select the **Additional settings** tab. 
1. In the **Data source** section, under **Use existing data**, select `Sample`. 
1. Leave the rest of the values as default and select **Review + Create** at the bottom of the form. 
1. Review the final settings and select **Create**. 
1. On the **SQL Database** form, select **Create** to deploy and provision the resource group, server, and database. 

        ![Add sample data to the SQL DB](media/sql-database-get-started-portal/create-sql-database-additional-settings.png)

## 2 - Create the failover group

1. Select **All Services** on the upper-left hand corner of the [Azure portal](https://portal.azure.com). 
1. Type `sql servers` in the search box. 
1. (Optional) Select the star icon next to SQL Servers to favorite **SQL servers** and add it to your left-hand navigation pane. 
    
    ![Locate SQL Servers](media/sql-database-single-db-create-fail-over-group-tutorial/all-services-sql-servers.png)

1. Select **SQL servers** and choose the server you created in section 1.
1. Select **Failover groups** under the **Settings** pane, and then select **Add group** to create a new failover group. 

    ![Add new failover group](media/sql-database-single-db-create-fail-over-group-tutorial/sqldb-add-new-failover-group.png)

1. On the **Failover Group** page, enter or select the following values, and then select **Create**:
    - **Failover group name**: Type in a unique failover group name, such as `failovergrouptutorial`. 
    - **Secondary server**: Select the option to *configure required settings* and then choose to **Create a new server**. Alternatively, you can choose an already-existing server as the secondary server. After entering the following values, select **Select**. 
        - **Server name**: Type in a unique name for the secondary server, such as `secondary-failover`. 
        - **Server admin login**: Type `AzureAdmin`
        - **Password**: Type a complex password that meets password requirements.
        - **Location**: Choose a location from the drop-down, such as East US 2. Per best practices, it is recommended to create the secondary server in a different geographic location than the primary server so that you can failover to a different location in the event of a disaster that affects the primary servers location. 
    
       ![Create a secondary server for the failover group](media/sql-database-single-db-create-fail-over-group-tutorial/create-secondary-failover-server.png)

   - **Databases within the group**: Once a secondary server is selected, this option becomes available. Select it to **Select databases to add** and then choose the database you created in section 1. 
        
    ![Add SQL DB to failover group](media/sql-database-single-db-create-fail-over-group-tutorial/add-sqldb-to-failover-group.png)
        

### 3 - Test failover

1. Navigate to your **SQL servers** server within the [Azure portal](https://portal.azure.com). 
1. Select **Failover groups** under the **Settings**  pane and then choose the failover group you created in section 2. 
  
  ![Select the failover group from the portal](media/sql-database-single-db-create-fail-over-group-tutorial/select-failover-group.png)

1. Select **Failover** from the task pane to failover your failover group containing your sample single database. 
1. Select **Yes** on the warning that notifies you that TDS sessions will be disconnected. 

  ![Failover your failover group containing your SQL database](media/sql-database-single-db-create-fail-over-group-tutorial/failover-sql-db.png)


<!-- 
The following section is for the Powershell
-->


## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

To complete the tutorial, make sure you've installed the following items:

- [Azure PowerShell](/powershell/azureps-cmdlets-docs)
- An Azure SQL database. To create one use,
  - [Portal](sql-database-single-database-get-started.md)
  - [CLI](sql-database-cli-samples.md)
  - [PowerShell](sql-database-powershell-samples.md)

  > [!NOTE]
  > The tutorial uses the *AdventureWorksLT* sample database.

- Java and Maven, see [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/), highlight **Java** and select your environment, then follow the steps.

> [!IMPORTANT]
> Be sure to set up firewall rules to use the public IP address of the computer on which you're performing the steps in this tutorial. Database-level firewall rules will replicate automatically to the secondary server.
>
> For information see [Create a database-level firewall rule](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database) or to determine the IP address used for the server-level firewall rule for your computer see [Create a server-level firewall](sql-database-server-level-firewall-rule.md).  

## Create a failover group

Using Azure PowerShell, create [failover groups](sql-database-auto-failover-group.md) between an existing Azure SQL server and a new Azure SQL server in another region. Then add the sample database to the failover group.

> [!IMPORTANT]
> [!INCLUDE [sample-powershell-install](../../includes/sample-powershell-install-no-ssh.md)]

To create a failover group, run the following script:

   ```powershell
    # Set variables for your server and database
    $adminlogin = "<your admin>"
    $password = "<your password>"
    $myresourcegroupname = "<your resource group name>"
    $mylocation = "<your resource group location>"
    $myservername = "<your existing server name>"
    $mydatabasename = "<your database name>"
    $mydrlocation = "<your disaster recovery location>"
    $mydrservername = "<your disaster recovery server name>"
    $myfailovergroupname = "<your globally unique failover group name>"

    # Create a backup server in the failover region
    New-AzSqlServer -ResourceGroupName $myresourcegroupname `
       -ServerName $mydrservername `
       -Location $mydrlocation `
       -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
          -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))

    # Create a failover group between the servers
    New-AzSqlDatabaseFailoverGroup `
       –ResourceGroupName $myresourcegroupname `
       -ServerName $myservername `
       -PartnerServerName $mydrservername  `
       –FailoverGroupName $myfailovergroupname `
       –FailoverPolicy Automatic `
       -GracePeriodWithDataLossHours 2

    # Add the database to the failover group
    Get-AzSqlDatabase `
       -ResourceGroupName $myresourcegroupname `
       -ServerName $myservername `
       -DatabaseName $mydatabasename | `
     Add-AzSqlDatabaseToFailoverGroup `
       -ResourceGroupName $myresourcegroupname `
       -ServerName $myservername `
       -FailoverGroupName $myfailovergroupname
   ```

Geo-replication settings can also be changed in the Azure portal, by selecting your database, then **Settings** > **Geo-Replication**.

![Geo-replication settings](./media/sql-database-implement-geo-distributed-database/geo-replication.png)

## Run the sample project

1. In the console, create a Maven project with the following command:

   ```bash
   mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=SqlDbSample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"
   ```

1. Type **Y** and press **Enter**.

1. Change directories to the new project.

   ```bash
   cd SqlDbSample
   ```

1. Using your favorite editor, open the *pom.xml* file in your project folder.

1. Add the Microsoft JDBC Driver for SQL Server dependency by adding the following `dependency` section. The dependency must be pasted within the larger `dependencies` section.

   ```xml
   <dependency>
     <groupId>com.microsoft.sqlserver</groupId>
     <artifactId>mssql-jdbc</artifactId>
    <version>6.1.0.jre8</version>
   </dependency>
   ```

1. Specify the Java version by adding the `properties` section after the `dependencies` section:

   ```xml
   <properties>
     <maven.compiler.source>1.8</maven.compiler.source>
     <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

1. Support manifest files by adding the `build` section after the `properties` section:

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

1. Open the *App.java* file located in ..\SqlDbSample\src\main\java\com\sqldbsamples and replace the contents with the following code:

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

      private static final String FAILOVER_GROUP_NAME = "<your failover group name>";  // add failover group name
  
      private static final String DB_NAME = "<your database>";  // add database name
      private static final String USER = "<your admin>";  // add database user
      private static final String PASSWORD = "<your password>";  // add database password

      private static final String READ_WRITE_URL = String.format("jdbc:" +
         "sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;" +
         "hostNameInCertificate=*.database.windows.net;loginTimeout=30;", +
         FAILOVER_GROUP_NAME, DB_NAME, USER, PASSWORD);
      private static final String READ_ONLY_URL = String.format("jdbc:" +
         "sqlserver://%s.secondary.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;" +
         "hostNameInCertificate=*.database.windows.net;loginTimeout=30;", +
         FAILOVER_GROUP_NAME, DB_NAME, USER, PASSWORD);

      public static void main(String[] args) {
         System.out.println("#######################################");
         System.out.println("## GEO DISTRIBUTED DATABASE TUTORIAL ##");
         System.out.println("#######################################");
         System.out.println("");

         int highWaterMark = getHighWaterMarkId();

         try {
            for(int i = 1; i < 1000; i++) {
                //  loop will run for about 1 hour
                System.out.print(i + ": insert on primary " +
                   (insertData((highWaterMark + i))?"successful":"failed"));
                TimeUnit.SECONDS.sleep(1);
                System.out.print(", read from secondary " +
                   (selectData((highWaterMark + i))?"successful":"failed") + "\n");
                TimeUnit.SECONDS.sleep(3);
            }
         } catch(Exception e) {
            e.printStackTrace();
      }
   }

   private static boolean insertData(int id) {
      // Insert data into the product table with a unique product name so we can find the product again
      String sql = "INSERT INTO SalesLT.Product " +
         "(Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) VALUES (?,?,?,?,?,?);";

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
      // Query the data previously inserted into the primary database from the geo replicated database
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
      // Query the high water mark id stored in the table to be able to make unique inserts
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

1. In the command console, run the following command:

   ```bash
   mvn package
   ```

1. Start the application that will run for about 1 hour until stopped manually, allowing you time to run the failover test.

   ```bash
   mvn -q -e exec:java "-Dexec.mainClass=com.sqldbsamples.App"
   ```

   ```output
   #######################################
   ## GEO DISTRIBUTED DATABASE TUTORIAL ##
   #######################################

   1. insert on primary successful, read from secondary successful
   2. insert on primary successful, read from secondary successful
   3. insert on primary successful, read from secondary successful
   ...
   ```

## Test failover

Run the following scripts to simulate a failover and observe the application results. Notice how some inserts and selects will fail during the database migration.

You can also check the role of the disaster recovery server during the test with the following command:

   ```powershell
   (Get-AzSqlDatabaseFailoverGroup `
      -FailoverGroupName $myfailovergroupname `
      -ResourceGroupName $myresourcegroupname `
      -ServerName $mydrservername).ReplicationRole
   ```

To test a failover:

1. Start a manual failover of the failover group:

   ```powershell
   Switch-AzSqlDatabaseFailoverGroup `
      -ResourceGroupName $myresourcegroupname `
      -ServerName $mydrservername `
      -FailoverGroupName $myfailovergroupname
   ```

1. Revert failover group back to the primary server:

   ```powershell
   Switch-AzSqlDatabaseFailoverGroup `
      -ResourceGroupName $myresourcegroupname `
      -ServerName $myservername `
      -FailoverGroupName $myfailovergroupname
   ```

## Next steps

In this tutorial, you configured an Azure SQL database and application for failover to a remote region and tested a failover plan. You learned how to:

> [!div class="checklist"]
> - Create a geo-replication failover group
> - Run a Java application to query an Azure SQL database
> - Test failover

Advance to the next tutorial on how to migrate using DMS.

> [!div class="nextstepaction"]
> [Migrate SQL Server to Azure SQL database managed instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md)
