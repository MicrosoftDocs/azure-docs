---
title: Tutorial - Discover MySQL Database Instances in Your Datacenter (preview) Using Azure Migrate
description: Learn how to discover MySQL database instances running in your datacenter using the Azure Migrate Discovery and Assessment tool. This tutorial provides step-by-step instructions for setting up a Kubernetes-based appliance, configuring the appliance, and reviewing the discovered MySQL databases.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 03/03/2025
ms.custom: mvc, subject-rbac-steps, engagement-fy25, references_regions
monikerRange: migrate-classic
# Customer intent: As a database administrator, I want to discover MySQL database instances in my datacenter using an agentless solution, so that I can assess and manage my databases efficiently before migrating to the cloud.
---

# Tutorial: Discover MySQL database instances running in your datacenter (preview)


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
1. In Step 3: Select **MySQL authentication** credential type, provide a friendly name, input the MySQL username, and password and select **Save**.

   > [!NOTE]
   > - Ensure that the user corresponding to the added MySQL credentials have the following privileges: 
   >    - Select permission on information_schema tables.
   >    - Select permission on mysql.users table.
   
   > - Use the following commands to grant the necessary privileges to the MySQL user
   > ```
   >  GRANT USAGE ON *.* TO 'newuser'@'localhost';
   >  GRANT PROCESS ON *.* TO 'newuser'@'localhost';
   >  GRANT SELECT (User, Host, Super_priv, File_priv, Create_tablespace_priv, Shutdown_priv) ON mysql.user TO 'newuser'@'localhost';
   >  FLUSH PRIVILEGES; 


You can review the discovered MySQL databases after around 24 hours of discovery initiation, through the **Discovered servers** view.

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
