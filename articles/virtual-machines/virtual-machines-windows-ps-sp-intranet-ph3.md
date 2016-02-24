<properties
	pageTitle="SharePoint Server 2013 farm Phase 3 | Microsoft Azure"
	description="Create the computers and the SQL Server cluster and enable Availability Groups in Phase 3 of the SharePoint Server 2013 farm in Azure."
	documentationCenter=""
	services="virtual-machines-windows"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="Windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/11/2015"
	ms.author="josephd"/>

# SharePoint Intranet Farm Workload Phase 3: Configure SQL Server Infrastructure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

In this phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you create and configure the two SQL Server computers and the cluster majority node computer, and then combine them into a Windows Server cluster.

You must complete this phase before moving on to [Phase 4](virtual-machines-windows-ps-sp-intranet-ph4.md). See [Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-windows-sp-intranet-overview.md) for all of the phases.
virtual-machines-windows-sp-intranet-overview.md> [AZURE.NOTE] These instructions use a SQL Server image in the Azure image gallery and you are charged ongoing costs for the use of the SQL Server license. It is also possible to create virtual machines in Azure and install your own SQL Server licenses, but you must have Software Assurance and License Mobility to use your SQL Server license on a virtual machine, including an Azure virtual machine. For more information about installing SQL Server on a virtual machine, see [Installation for SQL Server](https://msdn.microsoft.com/library/bb500469.aspx).

## Create the SQL Server cluster virtual machines in Azure

There are two SQL server virtual machines. One SQL server contains the primary database replica of an availability group. The second SQL server contains the secondary backup replica. The backup is provided to ensure high availability. An additional virtual machine is for the cluster majority node.

Use the following block of PowerShell commands to create the virtual machines for the three servers. Specify the values for the variables, removing the < and > characters. Note that this PowerShell command set uses values from the following tables:

- Table M, for your virtual machines
- Table V, for your virtual network settings
- Table S, for your subnet
- Table ST, for your storage accounts
- Table A, for your availability sets

Recall that you defined Table M in [Phase 2: Configure Domain Controllers](virtual-machines-windows-ps-sp-intranet-ph2.md) and Tables V, S, ST, and A in [Phase 1: Configure Azure](virtual-machines-windows-ps-sp-intranet-ph1.md).

> [AZURE.NOTE] The following command sets use Azure PowerShell 1.0 and later. For more information, see [Azure PowerShell 1.0](https://azure.microsoft.com/blog/azps-1-0/).

When you have supplied all the proper values, run the resulting block at the Azure PowerShell command prompt.


	# Set up key variables
	$rgName="<your resource group name>"
	$locName="<Azure location of your resource group>"
	$saName="<Table ST – Item 1 – Storage account name column>"
	$vnetName="<Table V – Item 1 – Value column>"
	$avName="<Table A – Item 2 – Availability set name column>"
	
	# Create the first SQL Server virtual machine
	$vmName="<Table M – Item 3 - Virtual machine name column>"
	$vmSize="<Table M – Item 3 - Minimum size column>"
	$vnet=Get-AzureRMVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$nic=New-AzureRMNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$avSet=Get-AzureRMAvailabilitySet –Name $avName –ResourceGroupName $rgName 
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for SQL data in GB>
	$diskLabel="<the label on the disk>"
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-SQLDataDisk.vhd"
	Add-AzureRMVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the first SQL Server computer." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftSQLServer -Offer SQL2014-WS2012R2 -Skus Enterprise -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Create the second SQL Server virtual machine
	$vmName="<Table M – Item 4 - Virtual machine name column>"
	$vmSize="<Table M – Item 4 - Minimum size column>"
	$nic=New-AzureRMNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for SQL data in GB>
	$diskLabel="<the label on the disk>"
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-ADDSDisk.vhd"
	Add-AzureRMVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the second SQL Server computer." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftSQLServer -Offer SQL2014-WS2012R2 -Skus Enterprise -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Create the cluster majority node server
	$vmName="<Table M – Item 5 - Virtual machine name column>"
	$vmSize="<Table M – Item 5 - Minimum size column>"
	$nic=New-AzureRMNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the cluster majority node server." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm

> [AZURE.NOTE] Because these virtual machines are for an intranet application, they are not assigned a public IP address or a DNS domain name label and exposed to the Internet. However, this also means that you cannot connect to them from the Azure portal. The **Connect** button will be unavailable when you view the properties of the virtual machine. Use the Remote Desktop Connection accessory or another Remote Desktop tool to connect to the virtual machine using its private IP address or intranet DNS name.

## Configure the SQL Server computers

For each virtual machine running SQL Server, use the remote desktop client of your choice and create a remote desktop connection. Use its intranet DNS or computer name and the credentials of the local administrator account.

For each virtual machine running SQL Server, join them to the appropriate AD DS domain with these commands at the Windows PowerShell prompt.

	$domName="<AD DS domain name to join, such as corp.contoso.com>"
	Add-Computer -DomainName $domName
	Restart-Computer

Note that you must supply domain account credentials after entering the Add-Computer command.

After they restart, reconnect to them using an account that has local administrator privileges.

For each SQL server, do the following:

1. Use the [Logging on to a virtual machine with a Remote Desktop connection procedure](virtual-machines-windows-ps-sp-intranet-ph2.md#logon) to log on using the credentials of the local administrator account.

2. Use the [To initialize an empty disk procedure](virtual-machines-windows-ps-sp-intranet-ph2.md#datadisk) twice, once for each SQL server, to add the extra data disk.

3. Run the following commands from a Windows PowerShell command prompt.

		md f:\Data
		md f:\Log
		md f:\Backup

4. Use the [To test connectivity procedure](virtual-machines-windows-ps-sp-intranet-ph2.md#testconn) to test connectivity to locations on your organization network. This procedure ensures that DNS name resolution is working correctly (that the virtual machine is correctly configured with DNS servers in the virtual network) and that packets can be sent to and from the cross-premises virtual network.

Use the following procedure twice, once for each SQL server, to configure the SQL server to use the F: drive for new databases and for accounts and permissions.

1.	On the Start screen, type **SQL Studio**, and then click **SQL Server 2014 Management Studio**.
2.	In **Connect to Server**, click **Connect**.
3.	In the left pane, right-click the top node—the default instance named after the machine—and then click **Properties**.
4.	In **Server Properties**, click **Database Settings**.
5.	In **Database default locations**, set the following values:
- For **Data**, set the path to **f:\Data**.
- For **Log**, set the path to **f:\Log**.
- For **Backup**, set the path to **f:\Backup**.
- Only new databases use these locations.
6.	Click **OK** to close the window.
7.	In the left pane, expand the **Security folder**.
8.	Right-click **Logins**, and then click **New login**.
9.	In **Login name**, type *domain*\sp_farm_db in (in which *domain* is the name of the domain in which the sp_farm_db account was created).
10.	Under **Select a page**, click **Server Roles**, click **sysadmin**, and then click **OK**.
11.	Close SQL Server 2014 Management Studio.

Use the following procedure twice, once for each SQL server, to allow remote desktop connections using the sp_farm_db account.

1.	On the Start screen, right-click **This PC**, and then click **Properties**.
2.	In the **System** window, click **Remote Settings**.
3.	In the **Remote Desktop** section, click **Select Users**, and then click **Add**.
4.	In **Enter the object names to select**, type [domain]**\sp_farm_db**, and then click **OK** three times.

SQL Server requires a port that clients use to access the database server. It also needs ports to connect with the SQL Server Management Studio and to manage the high-availability group. Next, run the following command at an administrator-level Windows PowerShell command prompt twice, once for each SQL server, to add a firewall rule that allows inbound traffic to the SQL server.

	New-NetFirewallRule -DisplayName "SQL Server ports 1433, 1434, and 5022" -Direction Inbound –Protocol TCP –LocalPort 1433,1434,5022 -Action Allow

For each of the SQL server virtual machines, sign out as the local administrator.

For information about optimizing SQL Server performance in Azure, see [Performance Best Practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-classic-sql-perf.md). You can also disable Geo Redundant Storage (GRS) for the SharePoint farm storage account and use storage spaces to optimize IOPs.

## Configure the cluster majority node server

Use the [Logging on to a virtual machine with a Remote Desktop connection procedure](virtual-machines-windows-ps-sp-intranet-ph2.md#logon) for the cluster majority node to log on using the credentials of a domain account.

On the cluster majority node, use the [To test connectivity procedure](virtual-machines-windows-ps-sp-intranet-ph2.md#testconn) to test connectivity to locations on your organization network.

## Create the Windows server cluster

SQL Server AlwaysOn Availability Groups rely on the Windows Server Failover Clustering (WSFC) feature of Windows Server. The feature allows several machines to participate as a group in a cluster. When one machine fails, a second machine is ready to take its place. Therefore the first task is to enable the Failover Clustering feature on all of the participating machines, which include:

- The primary SQL server
- The secondary SQL server
- The cluster majority node

The failover cluster requires at least three VMs. Two machines host SQL Server. The second SQL Server VM is a synchronous secondary replica, ensuring zero data loss if the primary machine fails. The third machine does not need to host SQL Server. The cluster majority node provides a quorum in the WSFC. Because the WSFC cluster relies on a quorum to monitor health, there must always be a majority to ensure that the WSFC cluster is online. If only two machines are in a cluster, and one fails, there can be no majority when only one out of two fails. For more information, see [WSFC Quorum Modes and Voting Configuration (SQL Server)](http://msdn.microsoft.com/library/hh270280.aspx).

For both SQL server computers and for the cluster majority node, run the following command at an administrator-level Windows PowerShell command prompt.

	Install-WindowsFeature Failover-Clustering -IncludeManagementTools

Due to current non-RFC-compliant behavior by DHCP in Azure, creation of a Windows Server Failover Cluster (WSFC) cluster can fail. For details, search for "WSFC cluster behavior in Azure networking" in High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines. However, there is a workaround. Use the following steps to create the cluster.

1.	Log on to the primary SQL Server virtual machine with the **sp_install** account.
2.	From the Start screen, type **Failover**, and then click **Failover Cluster Manager**.
3.	In the left pane, right-click **Failover Cluster Manager**, and then click **Create Cluster**.
4.	On the Before You Begin page, click **Next**.
5.	On the Select Servers page, type the name of the primary SQL Server machine, click **Add**, and then click **Next**.
6.	On the Validation Warning page, click **No, I do not require support from Microsoft for this cluster, and therefore do not want to run the validation tests. When I click Next, continue creating the cluster**, and then click **Next**.
7.	On the Access Point for Administering the Cluster page, in the **Cluster Name** text box, type the name for your cluster, and then click **Next**.
8.	In the Confirmation page, click **Next** to begin cluster creation.
9.	On the Summary page, click **Finish**.
10.	In the left pane, click your new cluster. In the **Cluster Core Resources** section of the contents pane, open your server cluster name. The **IP Address** resource appears in the **Failed** state. The IP address resource cannot be brought online because the cluster is assigned the same IP address as that of the machine itself. The result is a duplicate address.
11.	Right-click the failed **IP Address** resource, and then click **Properties**.
12.	In the **IP Address Properties** dialog box, click **Static IP Address**.
13.	Type an unused IP in the address range corresponding to the subnet on which the SQL server is located, and then click **OK**.
14.	Right-click the failed IP Address resource, and then click **Bring Online**. Wait until both resources are online. When the cluster name resource comes online, it updates the domain controller with a new Active Directory (AD) computer account. This AD account is later used to run the availability group clustered service.
15.	Now that the AD account is created, bring the cluster name offline. Right-click the cluster name in **Cluster Core Resources**, and then click **Take Offline**.
16.	To remove the cluster IP address, right-click **IP Address**, click **Remove**, and then click **Yes** when prompted. The cluster resource can no longer come online because it depends on the IP address resource. However, an availability group does not depend on the cluster name or IP address in order to work properly. So the cluster name can be left offline.
17.	To add the remaining nodes to the cluster, right-click your cluster name in the left pane, and then click **Add Node**.
18.	On the Before You Begin page, click **Next**.
19.	On the Select Servers page, type the name and then click **Add** to add both the secondary SQL server and cluster majority node to the cluster. After adding the two computers, click **Next**.
If a machine cannot be added, and the error message is "the Remote Registry is not running," do the following. Log on to the machine, open the Services snap-in (services.msc), and enable the Remote Registry. For more information, see [Unable to connect to Remote Registry service](http://technet.microsoft.com/library/bb266998.aspx).
20.	On the Validation Warning page, click **No, I do not require support from Microsoft for this cluster, and therefore do not want to run the validation tests. When I click Next, continue creating the cluster**, and then click **Next**.
21.	On the Confirmation page, click **Next**.
22.	On the Summary page, click **Finish**.
23.	In the left pane, click **Nodes**. You should see all three computers listed.

## Enable AlwaysOn Availability Groups

The next step is to enable AlwaysOn Availability Groups using the SQL Server Configuration Manager. Note that an availability group in SQL Server differs from an Azure availability set. An availability group contains databases that are highly-available and recoverable. An Azure availability set allocates virtual machines to different fault domains. For more information about fault domains, see [Manage the Availability of Virtual Machines](virtual-machines-windows-manage-availability.md).

Use these steps to enable AlwaysOn Availability Groups on SQL Server.

1.	Log on to the primary SQL server using the **sp_farm_db** account, or some other account that has sysadmin server role on the SQL server.
2.	On the Start screen, type **SQL Server Configuration**, and then click **SQL Server Configuration Manager**.
3.	In the left pane, click **SQL Server Services**.
4.	In the contents pane, double-click **SQL Server (MSSQLSERVER)**.
5.	In **SQL Server (MSSQLSERVER) Properties**, click the **AlwaysOn High Availability** tab, select **Enable AlwaysOn Availability Groups**, click **Apply**, and then click **OK** when prompted. Do not close the properties window yet.
6.	Click the virtual-machines-manage-availability tab, then type [Domain]**\sqlservice** in **Account Name**. Type the sqlservice account password in **Password** and **Confirm password**, and then click **OK**.
7.	In the message window, click **Yes** to restart the SQL Server service.
8.	Log on to the secondary SQL server and repeat this process.

The next diagram shows the configuration resulting from the successful completion of this phase, with placeholder computer names.

![](./media/virtual-machines-windows-ps-sp-intranet-ph3/workload-spsqlao_03.png)

## Next step

- Use [Phase 4](virtual-machines-windows-ps-sp-intranet-ph4.md) to continue with the configuration of this workload.
