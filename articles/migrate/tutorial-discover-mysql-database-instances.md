---
title: Tutorial - Discover MySQL Database Instances in Your Datacenter (preview) Using Azure Migrate
description: Learn how to discover MySQL database instances running in your datacenter using the Azure Migrate Discovery and Assessment tool. This tutorial provides step-by-step instructions for setting up a Kubernetes-based appliance, configuring the appliance, and reviewing the discovered MySQL databases.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.reviewer: v-uhabiba
ms.date: 03/03/2025
ms.custom: mvc, subject-rbac-steps, engagement-fy25, references_regions
monikerRange:
# Customer intent: As a database administrator, I want to discover MySQL database instances in my datacenter using an agentless solution, so that I can assess and manage my databases efficiently before migrating to the cloud.
---

# Discover MySQL database instances running in your datacenter (preview)


This article describes how to discover MySQL database instances running on servers in your datacenter, using **Azure Migrate appliance**. The discovery process is agentless; no agents are installed on the target servers. 

## Supported regions

The following table lists the regions that support MySQL Discovery and Assessment in preview:

|**Geography** | **Region** |
| ---- | ---- |
| Asia Pacific | Southeast Asia |
| Australia | Australia East | 
| Canada   | Canada Central | 
| Europe    | North Europe </br> West Europe |
| France | France Central |
| Japan | Japan East | 
| Korea | Korea Central | 
| United Kingdom | UK South |
| United States  | Central US </br> West US 2 | 

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/free-trial/).
- Before you begin to discover MySQL database instances, use the below links to create an Azure Migrate project and deploy an appliance as per your requirements in one of the [supported regions](#supported-regions):

   - [Discover servers running in a VMware environment](tutorial-discover-vmware.md)
   - [Discover servers running in Hyper-V environment](tutorial-discover-hyper-v.md)
   - [Discover physical servers](tutorial-discover-physical.md)
   - [Discover AWS instances](tutorial-discover-aws.md)
   - [Discover GCP instances](tutorial-discover-gcp.md)
   
- After you create a project, ensure you've completed the server discovery using the Azure Migrate appliance.
- Ensure that you perform the [discovery of software inventory](how-to-discover-applications.md) by providing the server credentials to the appliance configuration manager.

> [!NOTE]
> Only Azure Migrate projects created with public endpoint connectivity are supported. Private endpoint projects aren't supported in the preview.

## Provide MySQL credentials

1. Open the appliance configuration manager, complete the prerequisite checks and registration of the appliance.
2. Navigate to the Manage credentials and discovery sources panel.
3. In Step 3: Select **MySQL authentication** credential type, provide a friendly name, input the MySQL username, and password and select **Save**.

   > [!NOTE]
   > - Ensure that the user corresponding to the added MySQL credentials have the following privileges: 
   >    - Select permission on information_schema tables.
   >    - Select permission on mysql.users table.
   > - For MySQL discovery, ensure the appliance's IP or domain is allowed by configuring the necessary firewall rules and MySQL user privileges. The bind-address in my.cnf should also be set to allow external connections if needed.
   
   > - Use the following commands to grant the necessary privileges to the MySQL user
   > ```
   >  GRANT USAGE ON *.* TO 'username'@'ip';
   >  GRANT PROCESS ON *.* TO 'username'@'ip';
   >  GRANT SELECT (User, Host, Super_priv, File_priv, Create_tablespace_priv, Shutdown_priv) ON mysql.user TO 'username'@'ip';
   >  GRANT SELECT ON information_schema.* TO 'username'@'ip';
   >  GRANT SELECT ON performance_schema.* TO 'username'@'ip';  

To enable Discovery and Assessment in Azure Migrate, you can create a custom MySQL user account with the minimum required permissions. Use the following script to create the account and grant access from the appliance machine. 
- CREATE USER privilege → to create the new user.
- GRANT OPTION privilege → to grant privileges to the new user.
- SELECT on mysql.user → required for the existence check.
- PROCESS privilege → if you want to verify process-related grants after creation.

```

-- MySQL Script to Create a Least-Privilege User for Azure Migrate
-- Replace @username, @password, and @ip with actual values before execution.

SET @username = 'your_username';
SET @password = 'your_password';
SET @ip = 'your_appliance_ip';

-- Check if the user already exists
SELECT CASE
    WHEN EXISTS (SELECT 1 FROM mysql.user WHERE user = @username AND host = @ip)
        THEN CONCAT('User ', @username, '@', @ip, ' already exists, skipping creation')
    ELSE
        CONCAT('User ', @username, '@', @ip, ' does not exist, proceeding with creation')
END AS user_check;

-- Create the user if not exists
CREATE USER IF NOT EXISTS @username@'@ip' IDENTIFIED BY @password;

-- Grant minimal required privileges
GRANT USAGE ON *.* TO @username@'@ip';
GRANT PROCESS ON *.* TO @username@'@ip';

-- Grant SELECT on specific columns in mysql.user
GRANT SELECT (User, Host, Super_priv, File_priv, Create_tablespace_priv, Shutdown_priv)
ON mysql.user TO @username@'@ip';

-- Grant SELECT on information_schema and performance_schema
GRANT SELECT ON information_schema.* TO @username@'@ip';
GRANT SELECT ON performance_schema.* TO @username@'@ip';

-- Apply changes
FLUSH PRIVILEGES;

-- Log success
SELECT CONCAT('Azure Migrate user ', @username, '@', @ip, ' created successfully with least privileges.') AS result;
```
Execute the script using the following command through your MySQL client.
```
mysql -u root -p -e "SET @username='myuser'; SET @password='mypassword'; SET @ip='appliance_ip'; SOURCE CreateUser.sql;"
```

You can review the discovered MySQL databases after around 24 hours of discovery initiation, through the **Discovered servers** view. To expedite the discovery of your MySQL instances follow the steps:

- After adding the MySQL credentials on the appliance configuration manager restart the discovery services on appliance.
- In your Azure Migrate project navigate to Servers, databases and Web apps blade. On this tab locate Appliances in the right side of Assessment tools section.
- Select the number projected against total. This will take you to the Appliances blade. Select the appliance where the credentials were added.
- Select the Refresh services link available at the bottom of the appliance screen. This will restart all the services and MySQL instances will start appearing in the inventory after the refresh. 

1. On the **Azure Migrate: Discovery and assessment** tile on the Hub page, select the number below the **Discovered servers**.

   :::image type="content" source="./media/tutorial-discover-mysql-database-instances/mysql-discovered-servers.png" alt-text="Screenshot shows the discovered servers." lightbox="./media/tutorial-discover-mysql-database-instances/mysql-discovered-servers.png":::

1. Select the filters **Workload == Databases** and **Database type == MySQL** to view the list of all servers that are running MySQL database instances in your environment. 
1. To view basic information of the MySQL database instances in each of the discovered servers, select the **number** in the **Database instances** column for the corresponding server.  

   :::image type="content" source="./media/tutorial-discover-mysql-database-instances/mysql-discovered-database-instances.png" alt-text="Screenshot shows the database instances." lightbox="./media/tutorial-discover-mysql-database-instances/mysql-discovered-database-instances.png":::

1. Review the following information on the **DB instance** page: 
   - MySQL server and instance name 
   - MySQL edition, version, and version support status 
   - Number of user databases in the instance 
   - Azure Migrate connection status, DB engine status, first discovered time, and last updated time 

   > [!TIP]
   > Select **Columns** to filter the data.

   :::image type="content" source="./media/tutorial-discover-mysql-database-instances/mysql-database-discovery-overview.png" alt-text="Screenshot shows an overview of database instances." lightbox="./media/tutorial-discover-mysql-database-instances/mysql-database-discovery-overview.png":::


## Next steps
- Learn how to [create and run a MySQL assessment](create-mysql-assessment.md).
- Learn more about [how MySQL assessments are calculated](assessments-overview-migrate-to-azure-db-mysql.md).
