---
title: Implement a geo-distributed Azure SQL Database solution| Microsoft Docs
description: Learn to configure your Azure SQL Database and application for failover to a replicated database, and test failover.
services: sql-database
documentationcenter: ''
author: anosov1960
manager: jstrauss
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial-failover
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/18/2017
ms.author: sashan

---

# Implement a geo-distributed database

In this tutorial, you configure an Azure SQL database and application for failover to a remote region, and then test your failover plan. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

To complete this tutorial, make sure you have:

- The newest version of [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms). Installing SQL Server Management Studio also installs the newest version of SQLPackage, a command-line utility that can be used to automate a range of database development tasks. 
- An Azure SQL database. This tutorial uses the AdventureWorksLT sample database with a name of **mySampleDatabase** from one of these quick starts:

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)

## Create users with permissions for your database

Use SQL Server Management Studio to connect to your database and create user accounts. These user accounts will replicate automatically to your secondary server. You may need to configure a firewall rule if you are connecting from a client at an IP address for which you have not yet configured a firewall. For steps, see [Create SQL DB using the Azure portal](sql-database-get-started-portal.md).

1. Open SQL Server Management Studio.
2. Change the **Authentication** mode to **Active Directory Password Authentication**.
3. Connect to your server using the newly designed Azure Active Directory server admin account. 
4. In Object Explorer, expand **System Databases**, right-click **mySampleDatabase** and then click **New Query**.
5. In the query window, execute the following query to create an user accounts in your database, granting **db_owner** permissions to the two administrative accounts. Replace the placeholder for the domain name with your domain.

   ```sql
   CREATE USER app_admin WITH PASSWORD = 'ChangeYourAdminPassword1';
   --Add SQL user to db_owner role
   ALTER ROLE db_owner ADD MEMBER app_admin; 
   --Create additional SQL user
   CREATE USER app_user WITH PASSWORD = 'ChangeYourAdminPassword1';
   --grant permission to SalesLT schema
   GRANT UPDATE ON SalesLT.Product TO app_user;  
   ```

## Create database-level firewall

Use SQL Server Management Studio to create a database-level firewall rule for your SQL database. This database-level firewall rule will replicate automatically to your secondary server. For testing purposes, you can create a firewall rule for all IP addresses (0.0.0.0 and 255.255.255.255), can create a firewall rule for the single IP address with which you created the server-firewall rule, or you can configure one or more firewall rules for the IP addresses of the computers that you wish to use for testing of this tutorial.  

- In your open query window, replace the previous query with the following query, replacing the IP addresses with the appropriate IP addresses for your environment. 

   ```sql
   -- Create database-level firewall setting for your public IP address
   EXECUTE sp_set_database_firewall_rule N'myGeoReplicationRule','0.0.0.1','0.0.0.1';
   ```  

## Create a failover group 

Choose a failover region, create an empty server in that region, and then create a failover group between your existing server and the new empty server.

1. Populate variables.

   ```powershell
   $secpasswd = ConvertTo-SecureString "MyStrongPassword1" -AsPlainText -Force
   $mycreds = New-Object System.Management.Automation.PSCredential (“ServerAdmin”, $secpasswd)
   $myresourcegroup = "<your resource group>"
   $mylocation = "<resource group location>"
   $myserver = "<your existing server>"
   $mydatabase = "<your existing database>"
   $mydrlocation = "<your disaster recovery location>"
   $mydrserver = "<your disaster recovery server>"
   $myfailovergroup = "<your failover group>"
   ```

2. Create an empty backup server in your failover region.

   ```powershell
   $mydrserver = New-AzureRmSqlServer -ResourceGroupName $myresourcegroup -Location $mydrlocation -ServerName $mydrserver -ServerVersion "12.0" -SqlAdministratorCredentials $mycreds
   ```

3. Create a failover group.

   ```powershell
   $myfailovergroup = New-AzureRMSqlDatabaseFailoverGroup –ResourceGroupName $myresourcegroup -ServerName "$myserver" -PartnerServerName $mydrserver  –FailoverGroupName $myfailovergroupname –FailoverPolicy "Automatic" -GracePeriodWithDataLossHours 2
   ```

4. Add your database to the failover group.

   ```powershell
   $mydrserver | Add-AzureRMSqlDatabaseToFailoverGroup –FailoverGroupName $myfailovergroup  -Database $mydatabase
   ```

## Create and run Java application and connect to database

See [Connect with Java](sql-database-connect-query-java.md). If you are new to developing with Java, go the [Build an app using SQL Server](https://www.microsoft.com/sql-server/developer-get-started/) and select Java and then select your operating system for guidance on developing a Java solution.

1. Install java 8.
2. Install maven.
3. Create maven project.
4. Add this dependency, language level, and build option to support manifest files in jars to the pom.xml file: 

   ```xml
      <dependency>
         <groupId>com.microsoft.sqlserver</groupId>
         <artifactId>mssql-jdbc</artifactId>
         <version>6.1.0.jre8</version>
       </dependency>
     
      <properties>
         <maven.compiler.source>1.8</maven.compiler.source>
         <maven.compiler.target>1.8</maven.compiler.target>
      </properties>
      
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
5. Add the following into the App.java file:

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

      private static final String FAILOVER_GROUP_NAME = "your_failover_group_name";
  
      private static final String DB_NAME = "mySampleDatabase";
      private static final String USER = "app_user";
      private static final String PASSWORD = "ChangeYourAdminPassword1";

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
                //  loop will run for about 1h
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
6. Save the file.

## Compile and run

1. Go to command console and execute.

   ```java
   mvn package
   ```
2. When finished, execute to run the application (it will run for about 1h unless it is stop manually):

   ```Output
   mvn -q -e exec:java "-Dexec.mainClass=com.sqldbsamples.App"
   
   #######################################
   ## GEO DISTRIBUTED DATABASE TUTORIAL ##
   #######################################

   1. insert on primary successful, read from secondary successful
   2. insert on primary successful, read from secondary successful
   3. insert on primary successful, read from secondary successful
   ```

## Perform disaster recovery drill

1. Call manual failover of failover group using forced failover. If data loss during the drill is unacceptable you should remove -AllowDataLoss

   ```powershell
   $fg | Switch-AzureRMSqlDatabaseFailoverGroup -AllowDataLoss
   ```

2. Observe the application results during failover. You will see some insert to fail until the DNS cache refreshes. 	 

## Troubleshoot failover 

Find out which role your disaster recovery server is performing.

   ```powershell
   $fg = Get-AzureRMSqlDatabaseFailoverGroup -ResourceGroupName "<your failover group>" -ServerName "<your disaster recovery server>" 
   print $fg.role
   ```

## Next steps 

- For more information, see [Active geo-replication and failover groups](sql-database-geo-replication-overview.md).