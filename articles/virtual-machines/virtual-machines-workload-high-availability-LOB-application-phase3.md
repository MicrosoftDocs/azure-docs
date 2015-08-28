<properties 
	pageTitle="Line of business application Phase 3 | Microsoft Azure" 
	description="Create the computers and the SQL Server cluster and enable Availability Groups in Phase 3 of the line of business application in Azure." 
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

# Line of Business Application Workload Phase 3: Configure SQL Server infrastructure

In this phase of deploying a a high-availability line of business application in Azure infrastructure services, you configure the two computers running SQL Server and the cluster majority node computer, and then combine them into a Windows Server cluster. 

You must complete this phase before moving on to [Phase 4](virtual-machines-workload-high-availability-LOB-application-phase4.md). See [Deploy a High-Availability Line of Business Application in Azure](virtual-machines-workload-high-availability-LOB-application-overview.md) for all of the phases.

> [AZURE.NOTE] These instructions use a SQL Server image in the Azure image gallery and are charged ongoing costs for the use of the SQL Server license. It is also possible to create virtual machines in Azure and install your own SQL Server licenses, but those instructions are not included here.

## Create the SQL Server cluster virtual machines in Azure

There are two virtual machines running SQL Server. One virtual machine contains the primary database replica of an Availability Group and the second virtual machine contains the secondary (backup) replica. The backup exists to support high-availability. An additional virtual machine is for the cluster majority node.

Use the following block of PowerShell commands to create the virtual machines for the three servers. Specify the values for the variables, removing the < and > characters. Note that this PowerShell command set uses values from the following tables:

- Table M, for your virtual machines
- Table V, for your virtual network settings
- Table S, for your subnet
- Table ST, for your storage accounts
- Table A, for your availability sets

Recall that you defined Table M in [Phase 2](virtual-machines-workload-high-availability-LOB-application-phase2.md) and Tables V, S, ST, and A in [Phase 1](virtual-machines-workload-high-availability-LOB-application-phase1.md).

When you have supplied all the proper values, run the resulting block at the Azure PowerShell prompt.

	# Set up subscription and key variables
	$subscr="<name of the Azure subscription>"
	Set-AzureSubscription -SubscriptionName $subscr
	Switch-AzureMode AzureResourceManager
	$rgName="<your resource group name>"
	$locName="<Azure location of your resource group>"
	# Change to the premium storage account
	$saName="<Table ST – Item 1 – Storage account name column>"
	$vnetName="<Table V – Item 1 – Value column>"
	$avName="<Table A – Item 2 – Availability set name column>"
	
	# Create the first SQL server
	$vmName="<Table M – Item 3 - Virtual machine name column>"
	$vmSize="<Table M – Item 3 - Minimum size column>"
	$vnet=Get-AzurevirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$nic=New-AzureNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$avSet=Get-AzureAvailabilitySet –Name $avName –ResourceGroupName $rgName 
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for SQL data in GB>
	$diskLabel="<the label on the disk>"
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-SQLDataDisk.vhd"
	Add-AzureVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the first SQL Server computer." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftSQLServer -Offer SQL2014-WS2012R2 -Skus Enterprise -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Create the second SQL Server virtual machine
	$vmName="<Table M – Item 4 - Virtual machine name column>"
	$vmSize="<Table M – Item 4 - Minimum size column>"
	$nic=New-AzureNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for SQL data in GB>
	$diskLabel="<the label on the disk>"
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-ADDSDisk.vhd"
	Add-AzureVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the second SQL Server computer." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftSQLServer -Offer SQL2014-WS2012R2 -Skus Enterprise -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Change to the standard storage account
	$saName="<Table ST – Item 2 – Storage account name column>"
	
	# Create the cluster majority node server
	$vmName="<Table M – Item 5 - Virtual machine name column>"
	$vmSize="<Table M – Item 5 - Minimum size column>"
	$nic=New-AzureNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the cluster majority node server." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm

## Configure the computers running SQL Server

For each virtual machine running SQL Server, use the remote desktop client of your choice and create a remote desktop connection to the first domain controller virtual machine. Use its intranet DNS or computer name and the credentials of the local administrator account.

For each virtual machine running SQL Server, join them to the appropriate AD DS domain with these commands at the Windows PowerShell prompt.

	$domName="<AD DS domain name to join, such as corp.contoso.com>"
	Add-Computer -DomainName $domName
	Restart-Computer

Note that you must supply domain account credentials after entering the Add-Computer command.

After they restart, reconnect to them using an account that has local administrator privileges.


Use the following procedure twice, once for each virtual machine running SQL Server, to add the extra data disk and create folders on the new volume.

### To initialize an empty disk and add folders

1. In the left pane of Server Manager, click **File and Storage Services**, and then click **Disks**.
2. In the contents pane, in the **Disks** group, click disk **2** (with the **Partition** set to **Unknown**).
3. Click **Tasks**, and then click **New Volume**.
4. On the Before you begin page of the New Volume Wizard, click **Next**.
5. On the Select the server and disk page, click **Disk 2**, and then click **Next**. When prompted, click **OK**.
6. On the Specify the size of the volume page, click **Next**.
7. On the Assign to a drive letter or folder page, click **Next**.
8. On the Select file system settings page, click **Next**.
9. On the Confirm selections page, click **Create**.
10. When complete, click **Close**.
11. Run the following commands from a Windows PowerShell prompt:
	- md f:\Data
	- md f:\Log
	- md f:\Backup

Use the following procedure twice, once for each virtual machine running SQL Server, to configure them to use the F: drive for new databases and for accounts and permissions.

1. On the Start screen, type **SQL Studio**, and then click **SQL Server 2014 Management Studio**.
2. In **Connect to Server**, click **Connect**.
3. In the left pane, right-click the top node—the default instance named after the machine—and then click **Properties**.
4.	In **Server Properties**, click **Database Settings**.
5.	In **Database default locations**, set the following values: 
	- For **Data**, set the path to **f:\Data**.
	- For **Log**, set the path to **f:\Log**.
	- For **Backup**, set the path to **f:\Backup**.
	- Only new databases use these locations.
6.	Click **OK** to close the window.
7.	In the left pane, expand the **Security folder**.
8.	Right-click **Logins**, and then click **New login**.
9.	In **Login name**, type *domain*\sqladmin in (in which *domain* is the name of the domain in which the sqladmin account was created in [Phase 2](virtual-machines-workload-high-availability-LOB-application-phase2.md)). 
10.	Under **Select a page**, click **Server Roles**, click **sysadmin**, and then click **OK**.
11.	Close SQL Server 2014 Management Studio.

Use the following procedure twice, once for each SQL server, to allow remote desktop connections using the sqladmin account.

1.	On the Start screen, right-click **This PC**, and then click **Properties**.
2.	In the **System** window, click **Remote Settings**.
3.	In the **Remote Desktop** section, click **Select Users**, and then click **Add**.
4.	In **Enter the object names to select**, type [domain]**\sqladmin**, and then click **OK** three times.

The SQL Server service requires a port that clients use to access the database server. It also needs ports to connect with the SQL Server Management Studio and to manage the high-availability group. Next, run the following command at an administrator-level Windows PowerShell prompt twice, once for each SQL Server virtual machine, to add a firewall rule that allows this type of inbound traffic.

	New-NetFirewallRule -DisplayName "SQL Server ports 1433, 4234, and 5022" -Direction Inbound –Protocol TCP –LocalPort 1433,1434,5022 -Action Allow

For each of the SQL Server virtual machines, sign out as the local administrator. 

For information about optimizing SQL Server performance in Azure, see [Performance Best Practices for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-performance-best-practices.md). You can also disable Geo Redundant Storage (GRS) for the line of business application storage account and use storage spaces to optimize IOPs.

## Configure the cluster majority node server

Use the remote desktop client of your choice and create a remote desktop connection to the cluster majority node server virtual machine. Use its intranet DNS or computer name and the credentials of the local administrator account.

Join the cluster majority node server to the appropriate AD DS domain with these commands at the Windows PowerShell prompt.

	$domName="<AD DS domain name to join, such as corp.contoso.com>"
	Add-Computer -DomainName $domName
	Restart-Computer

Note that you must supply domain account credentials when running the **Add-Computer** command.

After it restarts, reconnect with an account that has local administrator privileges.

## Create the Windows Server Failover Clustering cluster

SQL Server AlwaysOn Availability Groups rely on the Windows Server Failover Clustering (WSFC) feature of Windows Server. The feature allows several machines to participate as a group in a cluster. When one machine fails, a second machine is ready to take its place. Therefore the first task is to enable the Failover Clustering feature on all of the participating machines, which include:

- The primary virtual machine running SQL Server
- The secondary virtual machine running SQL Server
- The cluster majority node

The failover cluster requires at least three virtual machines. Two machines host SQL Server, in which the secondary virtual machine is a synchronous secondary replica, ensuring zero data loss if the primary machine fails. The third virtual machine does not need to host SQL Server. The cluster majority node functions as a quorum witness in the WSFC. Because the WSFC cluster relies on a quorum to monitor health, there must always be a majority to ensure that the WSFC cluster is online. If only two machines are in a cluster, and one fails, there can be no majority when only one out of two fails. For more information, see [WSFC Quorum Modes and Voting Configuration (SQL Server)](http://msdn.microsoft.com/library/hh270280.aspx).

For both SQL Server virtual machines and for the cluster majority node, run the following command at an administrator-level Windows PowerShell prompt:

	Install-WindowsFeature Failover-Clustering -IncludeManagementTools

Due to current non-RFC-compliant behavior by DHCP in Azure, creation of a Windows Server Failover Cluster (WSFC) cluster can fail. For details, search for "WSFC cluster behavior in Azure networking" in High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines. However, there is a workaround. Use the following steps to create the cluster.

1.	Log on to the primary SQL Server virtual machine with the sqladmin account created in [Phase 2](virtual-machines-workload-high-availability-LOB-application-phase2.md).
2.	From the Start screen, type **Failover**, and then click **Failover Cluster Manager**.
3.	In the left pane, right-click **Failover Cluster Manager**, and then click **Create Cluster**.
4.	On the **Before You Begin** page, click **Next**.
5.	On the **Select Servers** page, type the name of the primary SQL Server machine, click **Add**, and then click **Next**.
6.	On the **Validation Warning** page, click **No, I do not require support from Microsoft for this cluster, and therefore do not want to run the validation tests. When I click Next, continue creating the cluster.**, and then click **Next**.
7.	On the **Access Point for Administering the Cluster** page, in the **Cluster Nam**e text box, type the name for your cluster, and then click **Next**.
8.	In the **Confirmation** page, click **Next** to begin cluster creation. 
9.	On the **Summary** page, click **Finish**.
10.	In the left pane, click your new cluster. In the **Cluster Core Resources** section of the contents pane, open your server cluster name. The **IP Address** resource appears in the **Failed** state. The IP address resource cannot be brought online because the cluster is assigned the same IP address as that of the machine itself. The result is a duplicate address. 
11.	Right-click the failed **IP Address** resource, and then click **Properties**.
12.	In the **IP Address Properties** dialog box, click **Static IP Address**.
13.	Type an unused IP in the address range corresponding to the subnet on which the SQL server is located, and then click **OK**.
14.	Right-click the failed IP Address resource, and then click **Bring Online**. Wait until both resources are online. When the cluster name resource comes online, it updates the domain controller with a new Active Directory (AD) computer account. This AD account is later used to run the availability group clustered service.
15.	Now that the AD account is created, bring the cluster name offline. Right-click the cluster name in **Cluster Core Resources**, and then click **Take Offline**.
16.	To remove the cluster IP address, right-click **IP Address**, click **Remove**, and then click **Yes** when prompted. The cluster resource can no longer come online because it depends on the IP address resource. However, an availability group does not depend on the cluster name or IP address in order to work properly. So the cluster name can be left offline.
17.	To add the remaining nodes to the cluster, right-click your cluster name in the left pane, and then click **Add Node**.
18.	On the **Before You Begin** page, click **Next**. 
19.	On the **Select Servers** page, type the name and then click **Add** to add both the secondary SQL server and cluster majority node to the cluster. After adding the two computers, click **Next**.
If a machine cannot be added, and the error message is "the Remote Registry is not running," do the following. Log on to the machine, open the Services snap-in (services.msc), and enable the Remote Registry. For more information, see [Unable to connect to Remote Registry service](http://technet.microsoft.com/library/bb266998.aspx). 
20.	On the **Validation Warning** page, click **No, I do not require support from Microsoft for this cluster, and therefore do not want to run the validation tests. When I click Next, continue creating the cluster.**, and then click **Next**. 
21.	On the **Confirmation** page, click **Next**.
22.	On the **Summary** page, click **Finish**.
23.	In the left pane, click **Nodes**. You should see all three computers listed.

## Enable AlwaysOn Availability Groups

The next step is to enable AlwaysOn Availability Groups using the SQL Server Configuration Manager. Note that an availability group in SQL Server differs from an Azure availability set. An availability group contains databases that are highly-available and recoverable. An Azure availability set allocates virtual machines to different fault domains. For more information about fault domains, see [Manage the Availability of Virtual Machines](virtual-machines-manage-availability.md). 

Use these steps to enable AlwaysOn Availability Groups on SQL Server.

1.	Log on to the primary SQL Server virtual machine with the sqladmin account created in [Phase 2](virtual-machines-workload-high-availability-LOB-application-phase2.md).
2.	On the Start screen, type **SQL Server Configuration**, and then click **SQL Server Configuration Manager**.
3.	In the left pane, click **SQL Server Services**.
4.	In the contents pane, double-click **SQL Server (MSSQLSERVER)**.
5.	In **SQL Server (MSSQLSERVER) Properties**, click the **AlwaysOn High Availability** tab, select **Enable AlwaysOn Availability Group**s, click **Apply**, and then click **OK** when prompted. Do not close the properties window yet. 
6.	Click the virtual-machines-manage-availability tab, then type [Domain]**\sqlservice** in **Account Name**. Type the sqlservice account password in **Password** and **Confirm password**, and then click **OK**.
7.	In the message window, click **Yes** to restart the SQL Server service.
8.	Log on to the secondary SQL Server virtual machine with the sqladmin account and repeat steps 2 through 7. 

This diagram shows the configuration resulting from the successful completion of this phase, with placeholder computer names.

![](./media/virtual-machines-workload-high-availability-LOB-application-phase3/workload-lobapp-phase3.png)

## Next step

To continue with the configuration of this workload, go to [Phase 4: Configure Web Servers](virtual-machines-workload-high-availability-LOB-application-phase4.md).

## Additional resources

[Deploy a high-availability line of business application in Azure](virtual-machines-workload-high-availability-LOB-application-overview.md)

[Line of Business Applications architecture blueprint](http://msdn.microsoft.com/dn630664)

[Set up a web-based LOB application in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-lobapp-hybrid-cloud-testing.md)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: SharePoint Server 2013 farm](virtual-machines-workload-intranet-sharepoint-farm.md)

