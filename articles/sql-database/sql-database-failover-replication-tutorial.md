---
title: Replicate and failover your Azure SQL Database solution | Microsoft Docs
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

# Replicate and failover an Azure SQL Database solution

In this tutorial, you configure an Azure SQL database and application for failover to a remote region, and then test your failover plan. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

To complete this tutorial, make sure you have:

- The newest version of [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) (SSMS). Installing SSMS also installs the newest version of SQLPackage, a command-line utility that can be used to automate a range of database development tasks. 
- An Azure database to migrate. This tutorial uses the AdventureWorksLT sample database with a name of **mySampleDatabase from one of these quick starts:

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)

## Create Azure Active Directory users (optional)

In this step, you create or identify Azure Active Directory users to add as users to your Azure SQL Database logical server and sample database.
- If your subscription is part of an Azure Active Directory corporate environment with existing user accounts, identify 3 user accounts to use as the Active Directory administrative user, the application administrative, and the application user for this tutorial and continue to Step 3: Create SQL Database logins and users. 
- If your subscription is not part of an Azure Active Directory corporate environment or is part of an Azure Active Directory corporate environment with no existing user accounts (and you have permission to create new Azure Active Directory user accounts.

1. Log in to the [Azure portal](http://portal.azure.com).
2. Click **More services** in the left hand menu.
3. In the filter text box, type **Azure** and then select **Azure Active Directory**.
4. In the **Quick tasks** pane on the **Azure Active Directory** page, click **Add a user**.
5. On the **User** form, create the following user.
   - Name: **ad-admin**
   - User name: **ad-admin@yourdomain** (Yopu4708)
6. Select the **Show Password** checkbox and record the password for this user account for later use .
7. Click **Create**.
8. Repeat the previous 3 steps to create the following 2 new users.
   - Name: **app-admin**
   - User name: **app-admin@yourdomain** (Buju4319)
   - Name: **app-user**
   - User name: **app-user@yourdomain**  (Nonu4001).

9. Open a new browser window and log in to the Azure portal using the newly created **ad-admin** account.
10. On the **Update your password** page, enter the system-generated password in the **Current password** box. 
11. In the **New password** and **Confirm password** boxes, enter a password of your choice.
12. Click **Update password and sign in**.

## Configure SQL Database integration with Azure Active Directory

1. Click **More services** in the left hand menu., type **sql** in the filter text box, and then select **SQL servers**.
2. On the **SQL servers** page, click your SQL Database server.
3. In the Essentials pane of the **Overview** page for your server, click **Not configured** under **Active Directory admin**.
4. On the **Active Directory admin** page, click **Set admin**.
5. Select the **ad-admin** Azure Active Directory account (or other pre-existing account, such as your own account) to be the server admin for your Azure SQL Database server.
6. Click **Select**.
7. Click **Save**.

## Create users with permissions for your database

<TO DO: need to change script to grant app-user sufficient permissions to perform operation in java app>

Use SQL Server Management Studio to connect to your database and create user accounts. These user accounts will replicate automatically to your secondary server. You may need to configure a firewall rule if you are connecting from a client at an IP address for which you have not yet configured a firewall. For steps, see [Create SQL DB using the Azure portal](sql-database-get-started-portal.md).

1. Open SQL Server Management Studio.
2. Change the **Authentication** mode to **Active Directory Password Authentication**.
3. Connect to your server using the newly designed Azure Active Directory server admin account. 
4. In Object Explorer, expand **System Databases**, right-click **mySampleDatabase** and then click **New Query**.
5. In the query window, execute the following query to create an user accounts in your database, granting **db_owner** permissions to the two administrative accounts. Replace the placeholder for the domain name with your domain.

   ```tsql
   --Create Azure AD user account
   CREATE USER [app-admin@<yourdomain>] FROM EXTERNAL PROVIDER;
   --Add Azure AD user to db_owner role
   ALTER ROLE db_owner ADD MEMBER [app-admin@<yourdomain>]; 
   --Create additional Azure AD user account
   CREATE USER [app-user@<yourdomain>] FROM EXTERNAL PROVIDER;
   --Create SQL user account
   CREATE USER app_admin WITH PASSWORD = 'MyStrongPassword1';
   --Add SQL user to db_owner role
   ALTER ROLE db_owner ADD MEMBER app_admin; 
   --Create additional SQL user
   CREATE USER app_user WITH PASSWORD = 'MyStrongPassword1';
   ```

## Create database-level firewall

Use SQL Server Management Studio to create a database-level firewall rule for your database. This database-level firewall rule will replicate automatically to your secondary server. For testing purposes, you can create a firewall rule for all IP addresses (0.0.0.0 and 255.255.255.255), can create a firewall rule for the single IP address with which you created the server-firewall rule, or you can configure one or more firewall rules for the IP addresses of the computers that you wish to use for testing of this tutorial.  

- In your open query window, replace the previous query with the following query, replacing the IP addresses with the appropriate IP addresses for your environment. 

   ```tsql
   -- Create database-level firewall setting for your publich IP address
   EXECUTE sp_set_database_firewall_rule N'mySampleDatabase','0.0.0.1','0.0.0.1';
   ```  

## Create a failover group 

Choose a failover region, create an empty server in that region, and then create a failover group between your existing server and the new empty server.

1. Populate variables.

   ```powershell
   $secpasswd = ConvertTo-SecureString "yourstrongpassword" -AsPlainText -Force
   $mycreds = New-Object System.Management.Automation.PSCredential (“ServerAdmin”, $secpasswd)
   $myresourcegroup = "<your resource group>"
   $mylocation = "<resource group location>"
   $myserver = "<your existing server>"
   $mydatabase = "<your existing database>"
   $mydrlocation = "<your disaster recovery location>"
   $mydrserver = "<your disaster recovery server>"
   $myfailovergroup = "<your failover group"
   ```

2. Create an empty backup server in your failover region.

   ```powershell
   $mydrserver = New-AzureRmSqlServer -ResourceGroupName $myresourcegroup -Location $mydrlocation -ServerName $mydrserver -ServerVersion "12.0" -SqlAdministratorCredentials $mycreds
   ```

3. Create a failover group.

   ```powershell
   $myfailovergroup = New-AzureRMSqlDatabaseFailoverGroup –ResourceGroupName $myresourcegroup -ServerName "$myserver" -PartnerServerName $mydrserver  –FailoverGroupName $myfailovergroupname –FailoverPolicy "Automatic" -GracePeriodWithDataLossHours 2
   ```

4. Add your database to the failover group

   ```powershell
   $mydrserver | Add-AzureRMSqlDatabaseToFailoverGroup –FailoverGroupName $myfailovergroup  -Database $mydatabase
   ```

## Add empty backup server to domain

1. In the Azure portal, click **More services** in the left hand menu., type **sql** in the filter text box, and then select **SQL servers**.
2. On the **SQL servers** page, click your new SQL Database disaster recovery server.
3. In the Essentials pane of the **Overview** page for your server, click **Not configured** under **Active Directory admin**.
4. On the **Active Directory admin** page, click **Set admin**.
5. Select the **ad-admin** Azure Active Directory account (or other pre-existing account, such as your own account) to be the server admin for your new Azure SQL Database disaster recovery server.
6. Click **Select**.
7. Click **Save**.

## Prepare client tier

1. Create TM profile with failover profile AWProfile.
2. Configure monitoring

   ```powershell
   $profile = New-AzureRmTrafficManagerProfile -Name AWProfile -ResourceGroupName MYRG -TrafficRoutingMethod Failover -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
   $webapp1 = Get-AzureRMWebApp -Name WebappUSWest
   Add-AzureRmTrafficManagerEndpointConfig -EndpointName webapp1ep -TrafficManagerProfile $profile -Type AzureEndpoints -TargetResourceId $webapp1.Id -EndpointStatus Enabled
   $webapp2 = Get-AzureRMWebApp -Name WebappUSEast
   Add-AzureRmTrafficManagerEndpointConfig -EndpointName webapp2ep -TrafficManagerProfile $profile -Type AzureEndpoints -TargetResourceId $webapp2.Id -EndpointStatus Enabled
   Set-AzureRmTrafficManagerProfile -TrafficManagerProfile $profile
   ```

## Deploy Java application and connect to database

<In progress> See [Connect with Java](sql-database-connect-query-java.md).

<TO DO: change user to app-user>

1. Install java 8.
2. Install maven.
3. Create maven project.
4. Add the following to pom.xml 

   - Dependency

      ```java
      <dependency>
         <groupId>com.microsoft.sqlserver</groupId>
         <artifactId>mssql-jdbc</artifactId>
         <version>6.1.0.jre8</version>
       </dependency>
      ```
   - Language level

      ```java
      <properties>
         <maven.compiler.source>1.8</maven.compiler.source>
         <maven.compiler.target>1.8</maven.compiler.target>
      </properties>
      ```

   - Build option to support manifest files in jars

      ```java
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

      private static final String PRIMARY_HOST_HAME = "your_primary_server_name";
      private static final String SECONDARY_HOST_NAME = "your_secondary_server_name";
      private static final String PRIMARY_HOST_HAME = "janengsampleserver";
      private static final String SECONDARY_HOST_NAME = PRIMARY_HOST_HAME;
    
      private static final String DB_NAME = "mySampleDatabase";
      private static final String USER = "ServerAdmin";
      private static final String PASSWORD = "ChangeYourAdminPassword1";

      private static final String PRIMARY_URL = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", PRIMARY_HOST_HAME, DB_NAME, USER, PASSWORD);
      private static final String SECONDARY_URL = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", SECONDARY_HOST_NAME, DB_NAME, USER, PASSWORD);

      public static void main(String[] args) {
         System.out.println("#######################################");
         System.out.println("## GEO DISTRIBUTED DATABASE TUTORIAL ##");
         System.out.println("#######################################");
         System.out.println(""); 

         // todo: get the max id from the table and initialize INSERT COUNTER with it so that the code will always run (avoid duplicate keys)  
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

      try (Connection connection = DriverManager.getConnection(PRIMARY_URL); 
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

      try (Connection connection = DriverManager.getConnection(SECONDARY_URL); 
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
        
      try (Connection connection = DriverManager.getConnection(SECONDARY_URL); 
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

1. Go to console and execute

   ```java
   mvn package
   ```
2. When finished, execute to run the application (it will run for about 1h unless it is stop manually):

   ```
   mvn -q -e exec:java "-Dexec.mainClass=com.sqldbsamples.App"
   ```

   The output will look like this if it runs successful:

   #######################################
   ## GEO DISTRIBUTED DATABASE TUTORIAL ##
   #######################################

   1. insert on primary successful, read from secondary successful
   2. insert on primary successful, read from secondary successful
   3. insert on primary successful, read from secondary successful

## Perform DR drill

1. Call manual failover of FG using forced failover. If data loss during the drill is unacceptable you should remove -AllowDataLoss

   ```powershell
   $fg | Switch-AzureRMSqlDatabaseFailoverGroup -AllowDataLoss
   ```

2.	Disable the primary endpoint in TM profile (to trigger endpoint failover) 

   ```powershell
   Disable-AzureRmTrafficManagerEndpoint -Name webapp1ep -Type AzureEndpoints -ProfileName $profile.Name -ResourceGroupName MYRG -Force
   ```

3.	Rerun the application.


## Relocate application to primary region

1.	Call manual friendly failover of FG. Do not specify -AllowDataLoss

   ```powershell
   $fg | Switch-AzureRMSqlDatabaseFailoverGroup 
   ```

2.	Disable the secondary endpoint (webapp2ep) in TM profile (to trigger endpoint failover) 

   ```powershell
   Disable-AzureRmTrafficManagerEndpoint -Name webapp2ep -Type AzureEndpoints -ProfileName $profile.Name -ResourceGroupName MYRG -Force
   ```

3.	Rerun the application.

## Troubleshoot failover 

Find out which region is now primary to ensure the failover happened. Role would show if it is primary secondary.

   ```powershell
   $fg = Get-AzureRMSqlDatabaseFailoverGroup -ResourceGroupName "myrg" -ServerName "AWserver" 
   print $fg.role
   ```

## Next steps 

- coming to a theatre near you soon