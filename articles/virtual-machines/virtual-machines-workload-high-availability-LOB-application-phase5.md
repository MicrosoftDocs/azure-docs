<properties 
	pageTitle="Line of business application Phase 5 | Microsoft Azure" 
	description="Create an availability group and add your application databases to it in Phase 5 of the line of business application in Azure." 
	documentationCenter=""
	services="virtual-machines" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""
	tags="azure-resource-manager"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/11/2015" 
	ms.author="josephd"/>

# Line of Business Application Workload Phase 5: Create the availability group and add the application databases

In this final phase of deploying a high-availability line of business application in Azure infrastructure services, you create a new SQL Server AlwaysOn Availability Group and add the databases of the application.

See [Deploy a high-availability line of business application in Azure](virtual-machines-workload-high-availability-LOB-application-overview.md) for all of the phases.

## Create the Availability Group and add databases

For each database of the line of business application:

1.	Take a full backup and a transaction log backup of the database on the primary SQL Server virtual machine.
2.	Restore the full and log backups on the backup SQL Server virtual machine.

Once the databases have been both backed up and restored, they can be added to the availability group. SQL Server only allows databases that have been backed up (at least once), and restored on another machine, to be in the group.

### Share the backup folders

To enable backup and restore, the backup files (.bak) must be accessible from the secondary database server. Use the following procedure:

1.	Log on to the primary database server as **[domain]\sqladmin**. 
2.	Navigate to the F:\ disk. 
3.	Right-click the **Backup** folder and click **Share with** and click **specific people**.
4.	In the **File sharing** dialog, type **[domain]\sqlservice**, and then click **Add**.
5.	Click the **Permission Level** column for the **sqlservice** account name, and then click **Read/Write**. 
6.	Click **Share**, and then click **Done**.

Perform the above procedure on the secondary database server, except give the sqlservice account **Read** permission for the F:\Backup folder in step 5.

### Backing up and restoring a database

The following procedures must be repeated for every database that needs to be added to the availability group.

Use these steps to back up a database.

1.	From the Start screen of the primary database server, type **SQL Studio**, and then click **SQL Server Management Studio**.
2.	Click **Connect**.
3.	In the left pane, expand the **Databases** node.
4.	Right-click a database to back up, point to **Tasks**, and then click **Back up**.
5.	In the **Destination** section, click **Remove** to remove the default file path for the backup file.
6.	Click **Add**. In **File name**, type **\\[machineName]\backup\[databaseName].bak**, where **machineName** is the name of the primary SQL **server computer** and **databaseName** is the name of the database. Click **OK**, and then click **OK** again after the message about the successful backup.
7.	In the left pane, right-click **[databaseName]**, point to **Tasks**, and then click **Back Up**.
8.	In **Backup type**, select **Transaction Log**, and then click **OK** twice.
9.	Keep this remote desktop session open.

Use these steps to restore a database.

1.	Log on to the secondary database server as [domainName]\sp_farm_db.
2.	From the Start screen, type **SQL Studio**, and then click **SQL Server Management Studio**.
3.	Click **Connect**.
4.	In the left pane, right-click **Databases**, and then click **Restore Database**.
5.	In the **Source** section, select **Device**, and click the ellipses (…) button
6.	In **Select backup devices**, click **Add**.
7.	In **Backup file location**, type **\\[machineName]\backup**, press **Enter**, select **[databaseName].bak**, and then click **OK** twice. You should now see the full backup and the log backup in the **Backup sets to restore** section.
8.	Under **Select a page**, click **Options**. In the **Restore options** section, in **Recovery state**, select **RESTORE WITH NORECOVERY**, and then click **OK**. 
9.	Click **OK** when prompted.

### Create an Availability Group

After at least one database is prepared (using the backup and restore method), you create an Availability Group.

1.	Return to the remote desktop session for the primary database server.
2.	In **SQL Server Management Studio**, in the left pane, right-click **AlwaysOn High Availability**, and then click **New Availability Group Wizard**.
3.	On the **Introduction** page, click **Next**. 
4.	On the **Specify Availability Group Name** page, type the name of your availability group in **Availability group name** (example: AG1), and then click **Next**.
5.	On the **Select Databases** page, select the databases for the application that were backed up, and click **Next**. These databases meet the prerequisites for an availability group because you have taken at least one full backup on the intended primary replica.
6.	On the **Specify Replicas** page, click **Add Replica**.
7.	In **Connect to Server**, type the name of the secondary database server, and then click **Connect**. 
8.	On the **Specify Replicas** page, the secondary database server is listed in **Availability Replicas**. For both instances, set the following option values: 

Initial Role | Option | Value 
--- | --- | ---
Primary | Automatic Failover (Up to 2) | Selected
Secondary | Automatic Failover (Up to 2) | Selected
Primary | Synchronous Commit (Up to 3) | Selected
Secondary | Synchronous Commit (Up to 3) | Selected
Primary | Readable Secondary | Yes
Secondary | Readable Secondary | Yes
		
9.	Click **Next**.
10.	On the **Select Initial Data Synchronization** page, click **Join only**, and then click **Next**. Data synchronization is executed manually by taking the full and transaction backups on the primary server, and restoring it on the backup. You can instead choose to select **Full** to let the New Availability Group Wizard perform data synchronization for you. However, synchronization is not recommended for large databases that are found in some enterprises.
11.	On the **Validation** page, click **Next**. There is a warning for a missing listener configuration because an availability group listener is not configured. 
12.	On the **Summary** page, click **Finish**. Once the wizard is finished, inspect the **Results** page to verify that the availability group is successfully created. If so, click **Close** to exit the wizard. 
13.	From the Start screen, type **Failover**, and then click **Failover Cluster Manager**. In the left pane, open the name of your cluster, and then click **Roles**. A new role with the name of your availability group should be present.

You have successfully configured a SQL Server AlwaysOn Availability Group for your application databases.

![](./media/virtual-machines-workload-high-availability-LOB-application-phase5/workload-lobapp-phase4.png)

You are now ready to begin rolling out this new application to your intranet users.

## Configure a listener for the AlwaysOn Availability Group

You can optionally create a listener configuration for the AlwaysOn Availability Group. For the steps, see [Tutorial: Listener Configuration for AlwaysOn Availability Groups](https://msdn.microsoft.com/library/dn425027.aspx). These instructions step you through  creating only a single listener (recommended) and to use a static IP address of an internal load balancing instance.

Once the listener is configured, you need to configure all the web server virtual machines to use the listener, instead of the name of the first SQL server in the cluster. Rather than using a new DNS name and record that maps to the virtual IP address of the internal load balancing instance, configure the web server virtual machines to use a SQL Alias. For details and steps, see [SQL Alias for SharePoint](http://blogs.msdn.com/b/priyo/archive/2013/09/13/sql-alias-for-sharepoint.aspx).

## Additional resources

[Deploy a high-availability line of business application in Azure](virtual-machines-workload-high-availability-LOB-application-overview.md)

[Line of Business Applications architecture blueprint](http://msdn.microsoft.com/dn630664)

[Set up a web-based LOB application in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-lobapp-hybrid-cloud-testing.md)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: SharePoint Server 2013 farm](virtual-machines-workload-intranet-sharepoint-farm.md)
