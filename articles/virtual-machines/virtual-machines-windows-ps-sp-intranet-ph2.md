<properties
	pageTitle="SharePoint Server 2013 farm Phase 2 | Microsoft Azure"
	description="Create and configure the two Active Directory replica domain controllers in Phase 2 of the SharePoint Server 2013 farm in Azure."
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
	ms.date="04/01/2016"
	ms.author="josephd"/>

# SharePoint Intranet Farm Workload Phase 2: Configure domain controllers

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

In this phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you configure two domain controllers in the Azure virtual network. Client web requests for SharePoint farm resources can then be authenticated in the Azure virtual network, rather than sending that authentication traffic across the site-to-site VPN or Azure ExpressRoute connection to your on-premises network.

You must complete this phase before moving on to [Phase 3](virtual-machines-windows-ps-sp-intranet-ph3.md). See [Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-windows-sp-intranet-overview.md) for all of the phases.

## Create the domain controller virtual machines in Azure

First, you need to fill out the **Virtual machine name** column of Table M and modify virtual machine sizes as needed in the **Minimum size** column.  

Item | Virtual machine name | Gallery image | Minimum size
--- | --- | --- | ---
1. | ______________ (first domain controller, example DC1) | Windows Server 2012 R2 Datacenter | Standard_A2
2. | ______________ (second domain controller, example DC2) | Windows Server 2012 R2 Datacenter | Standard_A2
3. | ______________ (first SQL Server computer, example SQL1) | Microsoft SQL Server 2014 Enterprise – Windows Server 2012 R2 | Standard_A5
4. | ______________ (second SQL Server computer, example SQL2) | Microsoft SQL Server 2014 Enterprise – Windows Server 2012 R2 | Standard_A5
5. | ______________ (majority node for the cluster, example MN1) | Windows Server 2012 R2 Datacenter | Standard_A1
6. | ______________ (first SharePoint application server, example APP1) | Microsoft SharePoint Server 2013 Trial – Windows Server 2012 R2 | Standard_A4
7. | ______________ (second SharePoint application server, example APP2) | Microsoft SharePoint Server 2013 Trial – Windows Server 2012 R2 | Standard_A4
8. | ______________ (first SharePoint web server, example WEB1) | Microsoft SharePoint Server 2013 Trial – Windows Server 2012 R2 | Standard_A4
9. | ______________ (second SharePoint web server, example WEB2) | Microsoft SharePoint Server 2013 Trial – Windows Server 2012 R2 | Standard_A4

**Table M – Virtual machines for the SharePoint 2013 intranet farm in Azure**

For the complete list of virtual machine sizes, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

Use the following block of Azure PowerShell commands to create the virtual machines for the two domain controllers. Specify the values for the variables, removing the < and > characters. Note that this Azure PowerShell command set uses values from the following:

- Table M, for your virtual machines
- Table V, for your virtual network settings
- Table S, for your subnet
- Table ST, for your storage accounts
- Table A, for your availability sets

Recall that you defined Tables V, S, ST, and A in [Phase 1: Configure Azure](virtual-machines-windows-ps-sp-intranet-ph1.md).

> [AZURE.NOTE] The following command sets use Azure PowerShell 1.0 and later. For more information, see [Azure PowerShell 1.0](https://azure.microsoft.com/blog/azps-1-0/).

When you have supplied all the proper values, run the resulting block at the Azure PowerShell prompt.

	# Set up key variables
	$rgName="<resource group name>"
	$locName="<Azure location of your resource group>"
	$saName="<Table ST – Item 1 – Storage account name column>"
	$vnetName="<Table V – Item 1 – Value column>"
	$avName="<Table A – Item 1 – Availability set name column>"
	
	# Create the first domain controller
	$vmName="<Table M – Item 1 - Virtual machine name column>"
	$vmSize="<Table M – Item 1 - Minimum size column>"
	$staticIP="<Table V – Item 6 - Value column>"
	$vnet=Get-AzureRMVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$nic=New-AzureRMNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id -PrivateIpAddress $staticIP
	$avSet=Get-AzureRMAvailabilitySet –Name $avName –ResourceGroupName $rgName 
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for AD DS data in GB>
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-ADDSDisk.vhd"
	Add-AzureRMVMDataDisk -VM $vm -Name "ADDSData" -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the first domain controller." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Create the second domain controller
	$vmName="<Table M – Item 2 - Virtual machine name column>"
	$vmSize="<Table M – Item 2 - Minimum size column>"
	$staticIP="<Table V – Item 7 - Value column>"
	$vnet=Get-AzureRMVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$nic=New-AzureRMNetworkInterface -Name ($vmName +"-NIC") -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[1].Id -PrivateIpAddress $staticIP
	$avSet=Get-AzureRMAvailabilitySet –Name $avName –ResourceGroupName $rgName 
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$diskSize=<size of the extra disk for AD DS data in GB>
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-ADDSDisk.vhd"
	Add-AzureRMVMDataDisk -VM $vm -Name "ADDSData" -DiskSizeInGB $diskSize -VhdUri $vhdURI  -CreateOption empty
	
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the second domain controller." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm

> [AZURE.NOTE] Because these virtual machines are for an intranet application, they are not assigned a public IP address or a DNS domain name label and exposed to the Internet. However, this also means that you cannot connect to them from the Azure portal. The **Connect** button will be unavailable when you view the properties of the virtual machine. Use the Remote Desktop Connection accessory or another Remote Desktop tool to connect to the virtual machine using its private IP address or intranet DNS name.

## Configure the first domain controller

Use the remote desktop client of your choice and create a remote desktop connection to the first domain controller virtual machine. Use its intranet DNS or computer name and the credentials of the local administrator account.

Next, you need to add the extra data disk to the first domain controller.

### <a id="datadisk"></a>To initialize an empty disk

1.	In the left pane of Server Manager, click **File and Storage Services**, and then click **Disks**.
2.	In the contents pane, in the **Disks** group, click disk **2** (with the **Partition** set to **Unknown**).
3.	Click **Tasks**, and then click **New Volume**.
4.	On the Before you begin page of the New Volume Wizard, click **Next**.
5.	On the Select the server and disk page, click **Disk 2**, and then click **Next**. When prompted, click OK.
6.	On the Specify the size of the volume page, click **Next**.
7.	On the Assign to a drive letter or folder page, click **Next**.
8.	On the Select file system settings page, click **Next**.
9.	On the Confirm selections page, click **Create**.
10.	When complete, click **Close**.

Next, test the first domain controller's connectivity to locations on your organization network.

### <a id="testconn"></a>To test connectivity

1.	From the desktop, open a Windows PowerShell prompt.
2.	Use the **ping** command to ping names and IP addresses of resources on your organization network.

This procedure ensures that DNS name resolution is working correctly (that the virtual machine is correctly configured with on-premises DNS servers) and that packets can be sent to and from the cross-premises virtual network. If this basic test fails, contact your IT department to troubleshoot the DNS name resolution and packet delivery issues.

Next, from the Windows PowerShell command prompt on the first domain controller, run the following commands:

	$domname="<DNS domain name of the domain for which this computer will be a domain controller>"
	Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
	Install-ADDSDomainController -InstallDns –DomainName $domname  -DatabasePath "F:\NTDS" -SysvolPath "F:\SYSVOL" -LogPath "F:\Logs"

You will be prompted to supply the credentials of a domain administrator account. The computer will restart.

## Configure the second domain controller

Use the remote desktop client of your choice and create a remote desktop connection to the second domain controller virtual machine. Use its intranet DNS or computer name and the credentials of the local administrator account.

Next, you need to add the extra data disk to the second domain controller. See the [To initialize an empty disk procedure](#datadisk).

Next, from the Windows PowerShell prompt on the second domain controller, run the following commands:

	$domname="<DNS domain name of the domain for which this computer will be a domain controller>"
	Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
	Install-ADDSDomainController -InstallDns –DomainName $domname  -DatabasePath "F:\NTDS" -SysvolPath "F:\SYSVOL" -LogPath "F:\Logs"

You will be prompted to supply the credentials of a domain administrator account. The computer will restart.

Next, you need to update the DNS servers for your virtual network so that Azure assigns virtual machines the IP addresses of the two new domain controllers to use as their DNS servers. Note that this procedure uses values from Table V (for your virtual network settings) and Table M (for your virtual machines).

1.	In the left pane of the Azure portal, click **Virtual networks**, and then click the name of your virtual network (Table V – Item 1 – Value column).
2.	On the **Settings** pane, click **DNS servers**.
3.	On the **DNS servers** pane, type the following:
	- For **Primary DNS server**: Table V – Item 6 – Value column
	- For **Secondary DNS server**: Table V – Item 7 – Value column
4.	In the left pane of the Azure portal, click **Virtual machines**.
5.	In the **Virtual machines pane**, click the name of your first domain controller (Table M – Item 1 - Virtual machine name column).
6.	On the pane for the virtual machine, click **Restart**.
7.	When the first domain controller is started, click the name of your second domain controller on the **Virtual machines** pane (Table M – Item 2 - Virtual machine name column).
8.	On the pane for the virtual machine, click **Restart**. Wait until the second domain controller is started.

Note that we restart the two domain controllers so that they are not configured with the on-premises DNS servers as DNS servers. Because they are both DNS servers themselves, they were automatically configured with the on-premises DNS servers as DNS forwarders when they were promoted to domain controllers.

Next, we need to create an Active Directory replication site to ensure that servers in the Azure virtual network use the local domain controllers. Log on to the primary domain controller with a domain administrator account and run the following commands from an administrator-level Windows PowerShell prompt:

	$vnet="<Table V – Item 1 – Value column>"
	$vnetSpace="<Table V – Item 5 – Value column>"
	New-ADReplicationSite -Name $vnet 
	New-ADReplicationSubnet –Name $vnetSpace –Site $vnet

## Configure SharePoint farm accounts and permissions

The SharePoint farm will need the following user accounts:

- sp_farm: A user account for managing SharePoint farms.
- sp_farm_db: A user account that has sysadmin rights on SQL Server instances.
- sp_install: A user account that has domain administration rights needed for installing roles and features.
- sqlservice: A user account that SQL Server instances can run as.

Next, log on to any computer with a domain administrator account for the domain for which the domain controllers are members, open an administrator-level Windows PowerShell command prompt, and run these commands *one at a time*:

	New-ADUser -SamAccountName sp_farm -AccountPassword (read-host "Set user password" -assecurestring) -name "sp_farm" -enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false

	New-ADUser -SamAccountName sp_farm_db -AccountPassword (read-host "Set user password" -assecurestring) -name "sp_farm_db" -enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false

	New-ADUser -SamAccountName sp_install -AccountPassword (read-host "Set user password" -assecurestring) -name "sp_install" -enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false

	New-ADUser -SamAccountName sqlservice -AccountPassword (read-host "Set user password" -assecurestring) -name "sqlservice" -enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false

For each command, you will be prompted to enter a password. Record these account names and passwords and store them in a secure location.

Next, perform the following steps to add more account properties to the new user accounts.

1.	From the Start screen, type **Active Directory Users**, and then click **Active Directory Users and Computers**.
2.	In the tree pane, open your domain, and then click **Users**.
3.	In the contents pane, right-click **sp_install**, and then click **Add to a group**.
4.	In the **Select Groups** dialog, type **domain admins**, and then click **OK** twice.
5.	In the dialog, click **View and click Advanced Features**. The option lets you see all hidden containers and hidden tabs in the property windows for Active Directory objects.
6.	Right-click your domain name and click **Properties**.
7.	In the **Properties** dialog, click the **Security** tab, and then click the **Advanced** button.
8.	In the **Advanced Security settings for <YourDomain>** window, click **Add**.
9.	In the **Permission Entry for <YourDomain>** window, click **Select a principal**.
10.	In the text box, type **<YourDomain>\sp_install**, and then click **OK**.
11.	Select **Allow** for **Create computer objects**, and then click **OK** three times.

This shows the configuration resulting from the successful completion of this phase, with placeholder computer names.

![](./media/virtual-machines-windows-ps-sp-intranet-ph2/workload-spsqlao_02.png)

## Next step

- Use [Phase 3](virtual-machines-windows-ps-sp-intranet-ph3.md) to continue with the configuration of this workload.
