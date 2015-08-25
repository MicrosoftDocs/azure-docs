<properties
	pageTitle="SharePoint Server 2013 farm Phase 5 | Microsoft Azure"
	description="Create an availability group and add your SharePoint databases to it in Phase 5 of the SharePoint Server 2013 farm in Azure."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/21/2015"
	ms.author="josephd"/>

# SharePoint Intranet Farm Workload Phase 5: Create the availability group and add the SharePoint databases

In this final phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you create a new AlwaysOn availability group and add the databases of the SharePoint farm.

See [Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md) for all of the phases.

## Create the availability group and add databases

SharePoint creates several databases as part of the initial configuration. Those databases must be prepared with these steps:

1.	Take a full backup and a transaction log backup of the database on the primary machine.
2.	Restore the full and log backups on the backup machine.

Once the databases have been both backed up and restored, they can be added to the availability group. SQL Server allows only databases that have been backed up (at least once), and restored on another machine, to be in the group.

### Share the backup folders

To enable backup and restore, make sure that the backup files (.bak) are accessible from the secondary SQL Server VM. Use the following procedure:

1.	Log on to the primary SQL Server host as **[domain]\sp_farm_db**.
2.	Navigate to the F:\ disk.
3.	Right-click the **Backup** folder, click **Share with**, and then click **specific people**.
4.	In the **File sharing** dialog, type **[domain]\sqlservice**, and then click **Add**.
5.	Click the **Permission Level** column for the **sqlservice** account name, and then click **Read/Write**.
6.	Click **Share**, and then click **Done**.

Perform the above procedure on the secondary SQL Server host, except give the sqlservice account **Read** permission for the F:\Backup folder in step 5.

### Back up and restore a database

The following procedures must be repeated for every database that needs to be added to the availability group. Some SharePoint 2013 databases do not support SQL Server AlwaysOn Availability Groups. For more information, see [Supported high availability and disaster recovery options for SharePoint databases](http://technet.microsoft.com/library/jj841106.aspx).

Use these steps to back up a database:

1.	From the Start screen of the primary SQL Server computer, type **SQL Studio**, and then click **SQL Server Management Studio**.
2.	Click **Connect**.
3.	In the left pane, expand the **Databases** node.
4.	Right-click a database to back up, point to **Tasks**, and then click **Back up**.
5.	In the **Destination** section, click **Remove** to remove the default file path for the backup file.
6.	Click **Add**. In **File name**, type **\\[machineName]\backup\[databaseName].bak**, where machineName is the name of the primary SQL Server computer and databaseName is the name of the database. Click **OK**, and then click **OK** again after the message about the successful backup.
7.	In the left pane, right-click **[databaseName]**, point to **Tasks**, and then click **Back Up**.
8.	In **Backup type**, select **Transaction Log**, and then click **OK** twice.
9.	Keep this Remote Desktop session open.

Use these steps to restore a database:

1.	Log on to the secondary SQL Server computer as **[domainName]\sp_farm_db**.
2.	From the Start screen, type **SQL Studio**, and then click **SQL Server Management Studio**.
3.	Click **Connect**.
4.	In the left pane, right-click **Databases**, and then click **Restore Database**.
5.	In the **Source** section, select **Device**, and then click the ellipsis (…) button.
6.	In **Select backup devices**, click **Add**.
7.	In **Backup file location**, type **\\[machineName]\backup**, press Enter, select **[databaseName].bak**, and then click **OK** twice. You should now see the full backup and the log backup in the **Backup sets to restore** section.
8.	Under **Select a page**, click **Options**. In the **Restore options** section, in **Recovery state**, select **RESTORE WITH NORECOVERY**, and then click **OK**.
9.	Click **OK** when prompted.

### Create an availability group

After at least one database is prepared (using the backup and restore method), you create an availability group.

1.	Return to the Remote Desktop session for the primary SQL Server computer.
2.	In **SQL Server Management Studio**, in the left pane, right-click **AlwaysOn High Availability**, and then click **New Availability Group Wizard**.
3.	On the **Introduction** page, click **Next**.
4.	On the **Specify Availability Group Name** page, type the name of your availability group in **Availability group name** (example: AG1), and then click **Next**.
5.	On the **Select Databases** page, select the databases for the SharePoint farm that were backed up, and then click **Next**. These databases meet the prerequisites for an availability group because you have taken at least one full backup on the intended primary replica.
6.	On the **Specify Replicas** page, click **Add Replica**.
7.	In **Connect to Server**, type the name of the secondary SQL Server computer, and then click **Connect**.
8.	On the **Specify Replicas** page, the secondary SQL Server host is listed in **Availability Replicas**. For both instances, set the following option values:

Initial role | Option | Value
--- | --- | ---
Primary | Automatic Failover (Up to 2) | Selected
Secondary | Automatic Failover (Up to 2) | Selected
Primary | Synchronous Commit (Up to 3) | Selected
Secondary | Synchronous Commit (Up to 3) | Selected
Primary | Readable Secondary | Yes
Secondary | Readable Secondary | Yes

9.	Click **Next**.  
10.	On the **Select Initial Data Synchronization** page, click **Join only**, and then click **Next**. Data synchronization is executed manually by taking the full and transaction backups on the primary server, and restoring it on the backup. You can instead choose to select **Full** to let the New Availability Group Wizard perform data synchronization for you. However, we don't recommend synchronization for large databases that are found in some enterprises.  
11.	On the **Validation** page, click **Next**. There is a warning for a missing listener configuration because an availability group listener is not configured.
12.	On the **Summary** page, click **Finish**. Once the wizard is finished, inspect the **Results** page to verify that the availability group is successfully created. If so, click **Close** to exit the wizard.
13.	From the Start screen, type **Failover**, and then click **Failover Cluster Manager**. In the left pane, open the name of your cluster, and then click **Roles**. A new role with the name of your availability group should be present.  

You have successfully configured a SQL Server AlwaysOn availability group for your SharePoint databases.

## Configure a listener for the AlwaysOn availability group

You can optionally create a listener configuration for the AlwaysOn availability group. For the steps, see [Tutorial: Listener configuration for AlwaysOn Availability Groups](https://msdn.microsoft.com/library/dn425027.aspx). You should create only a single listener and configure it to use a virtual IP address of an internal load-balancing instance.

Once the listener is created, you need to configure all the SharePoint virtual machines to use the listener, instead of the name of the first SQL Server computer in the cluster. Rather than using names, configure the SharePoint virtual machines to use a SQL alias. For details and steps, see [SQL alias for SharePoint](http://blogs.msdn.com/b/priyo/archive/2013/09/13/sql-alias-for-sharepoint.aspx).

For additional information about SharePoint with SQL Server AlwaysOn Availability Groups, see [Configure SQL Server 2012 AlwaysOn Availability Groups for SharePoint 2013](https://technet.microsoft.com/library/jj715261.aspx).


## Additional resources

[Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md)

[SharePoint farms hosted in Azure infrastructure services](virtual-machines-sharepoint-infrastructure-services.md)

[SharePoint with SQL Server AlwaysOn infographic](http://go.microsoft.com/fwlink/?LinkId=394788)

[Microsoft Azure architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: High-availability line of business application](virtual-machines-workload-high-availability-lob-application.md)
