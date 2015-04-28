<properties 
	pageTitle="Create and preconfigure a Windows virtual machine with Resource Manager and Azure PowerShell" 
	description="Use the Resource Manager mode of PowerShell to quicly create a new Windows virtual machine preconfigured with extra disks and other options." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="josephd"/>

# Create and preconfigure a Windows virtual machine with Resource Manager and Azure PowerShell

These steps show you how to construct and customize a set of Resource Manager Azure PowerShell commands that create and pre-configure a Windows-based Azure virtual machine by using a building block approach. You can use this process to quickly create a command set for a new Windows-based virtual machine and expand an existing deployment or to create multiple command sets that quickly build out a custom dev/test or IT pro environment.

These steps follow a fill-in-the-blanks approach for creating Azure PowerShell command sets. This approach can be useful if you are new to PowerShell or you just want to know what values to specify for successful configuration. Advanced PowerShell users can take the commands and substitute their own values for the variables (the lines beginning with "$").

## Step 1: Install Azure PowerShell

If you haven't done so already, use the instructions in [How to install and configure Azure PowerShell](install-configure-powershell.md) to install Azure PowerShell on your local computer. Then, open an Azure PowerShell command prompt.

## Step 2: Set your subscription and storage account

Set your Azure subscription and storage account by running theses commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	$staccount="<storage account name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr -CurrentStorageAccountName $staccount

You can get the correct subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command. You can get the correct storage account name from the Label property of the output of the **Get-AzureStorageAccount** command after you issue the **Select-AzureSubscription** command. You can also store these commands in a text file for future use.

Next, switch Azure PowerShell into Resource Manager mode.

	Switch-AzureMode AzureResourceManager 

## Step 3: Build your command set

If needed, create a new resource group for the new virtual machine.

	$rgName="<resource group name>"
	$locName="<location name, such as West US>"
	New-AzureResourceGroup -Name $rgName -Location $locName

If needed, create a new storage account for the new virtual machine.

	$saName="<storage account name>"
	New-AzureStorageAccount -Name $saName -ResourceGroupName $rgName -Type Standard_LRS -Location $locName

If needed, create a new availability set for the new virtual machine.

	$avName="<availability set name>"
	$rgName="<resource group name>"
	$locName="<location name, such as West US>"
	New-AzureAvailabilitySet –Name $avName –ResourceGroupName $rgName -Location $locName

You must specify the name of a virtual network and the index number of a subnet in the virtual network on which to place the new virtual machine. If needed, create a virtual network and subnets for the new virtual machine. Here is an example for a new virtual network with two subnets named frontendSubnet and backendSubnet.

	$vnetName=TestNet
	$frontendSubnet=New-AzureVirtualNetworkSubnetConfig -Name frontendSubnet -AddressPrefix 10.0.1.0/24
	$backendSubnet=New-AzureVirtualNetworkSubnetConfig -Name backendSubnet -AddressPrefix 10.0.2.0/24
	New-AzurevirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $frontendSubnet,$backendSubnet

Open a fresh instance of the text editor of your choice (or an instance of the PowerShell Integrated Scripting Environment [ISE]), specify the name of the resource group and storage account for this new virtual machine and copy the following to start your command set. Replace everything within the quotes, including the < and > characters, with the correct names.

	Switch-AzureMode AzureResourceManager
	$rgName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$saName="<storage account name>"

Specify a virtual network and subnet using the subnet index for the virtual machine (copy to your command set).

	$vnetName="<name of your existing virtual network>"
	$subnetIndex=<index of the subnet on which to create the virtual machine>

Optionally, create a public IP address to be used with an additional NIC for the virtual machine (copy to your command set).

	$pubipName="<name for the public IP>"
	$domainLabel="<label>"
	$pubip=New-AzurePublicIPAddress -ResourceGroupName $rgName -Name $pubipName -Location $locName -AllocationMethod Dynamic -DomainNameLabel $domainLabel 

Optionally, create a NIC inside a subnet in the virtual network and associate the previously created public IP address with the NIC (copy to your command set).

	$nicName="<name of new NIC>"
	$vnet=Get-AzureVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	New-AzureNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic -Subnet $vnet.Subnets[$subnetIndex] -PublicIpAddress $pubip

Next, create a local VM object and optionally add it to an availability set. Copy one of the two following options to your command set.

Option 1: Specify a virtual machine name and size.

	$vmName="<VM name>"
	$vmSize="<Specify one: Standard_A0, Standard_A1, Standard_A2, Standard_A3, Standard_A4, Standard_A5>"
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize

Option 2: Specify a virtual machine name and size and add it to an availability set.

	$vmName="<VM name>"
	$vmSize="<Specify one: Standard_A0, Standard_A1, Standard_A2, Standard_A3, Standard_A4, Standard_A5>"
	$avName="<availability set name>"
	$avSet=Get-AzureAvailabilitySet –Name $avName –ResourceGroupName $rgName
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id


> [AZURE.NOTE] With Resource Manager, you can only add a virtual machine to an availability set during its creation.

Optionally, add a public IP address to the network interface (copy to your command set).

	$nic=Get-AzureNetworkInterface -Name $nicName -ResourceGroupName $rgName
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id 

Optionally, add an additional data disk to the VM (copy to your command set). 

	$diskSize=<size of the disk in GB>
	$diskLabel="<the label on the disk>"
	$vhdName="<storage name>"
	$vhdURI="http://" + $vhdName + ".blob.core.windows.net/" + $vmName + "/disk1.vhd"
	Add-AzureVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI 

Next, copy these commands to your command set.

	$imageName="<image name>"
	$contName="<container name>"
	$cred=Get-Credential -Message "Type the name and password of the local administrator account." 
	Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent
	$destContainer = "http://" + $contName + ".blob.core.windows.net/" + $vmName + "/"
	Set-AzureVMSourceImage -VM $vm -Name $imageName -DestinationVhdsContainer $destContainer 

If you already know the image name, such as "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd", replace <image name> in your command set. Otherwise, to obtain the image name for the virtual machine that you want to create, use these commands at the Azure PowerShell command prompt to see a list of image family names.

	Switch-AzureMode AzureServiceManagement
	Get-AzureVMImage | select ImageFamily –Unique

Here are some examples of ImageFamily values for Windows-based computers:

- Windows Server 2012 R2 Datacenter 
- Windows Server 2008 R2 SP1 
- Windows Server Technical Preview 
- SQL Server 2012 SP1 Enterprise on Windows Server 2012 

Replace your chosen <ImageFamily value> in these commands and run them.

	$family="<ImageFamily value>"
	$imagename=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	Write-Host $imagename

Copy the display of the **Write-Host** command to the clipboard. 

Next, switch Azure PowerShell back to the Resource Manager module. 

	Switch-AzureMode AzureResourceManager

Copy the contents of the clipboard to replace **<image name>** in your command set.

If you would like to set the username and password through a script, use this as an example.

	$secPasswd=Get-Content d:\temp\password.txt | ConvertTo-SecureString 
	$credential=New-Object System.Management.Automation.PSCredential ("johndoe", $secPasswd)

Next, create the new virtual machine (copy to your command set).

	New-AzureVM -VM $vm  -ResourceGroupName $rgName -Location $locName
 
## Step 4: Run your command set

Review the Azure PowerShell command set you built in your text editor consisting of multiple blocks of commands from step 3. Ensure that you have specified all the needed variables and that they have the correct values. Also make sure that you have removed all the < and > characters.

Copy the command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands and create your Azure virtual machine.

If you will be creating this virtual machine again or a similar one, you can save this command set as a text file or as a PowerShell script file (*.ps1).

## Example
I need a PowerShell command set to create a virtual machine for a web-based line-of-business server that:

- Uses the Windows Server 2012 R2 Datacenter image (image name a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd)
- Has the name LOB07 and is in the existing WEB_AS availability set
- Has an additional data disk of 200 GB for logging
- Has a NIC with a public IP address in the FrontEnd subnet (subnet index 0) of the AZDatacenter virtual network
- Is in the LOBServers resource group

Here is the corresponding Azure PowerShell command set to create this virtual machine.

	Switch-AzureMode AzureResourceManager 
	
	$rgName="rgLOBServers"
	$locName="West US"
	$saName="saLOBServers"
	
	$vnetName="AZDatacenter"
	$subnetIndex=0
	
	$pubipName="WEB07_IP"
	$domainLabel="LOBServersContoso"
	$pubip=New-AzurePublicIPAddress -ResourceGroupName $rgName -Name $pubipName  -Location $locName -AllocationMethod Dynamic -DomainNameLabel $domainLabel
	
	$nicName="InternetNIC"
	$vnet=Get-AzureVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	New-AzureNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic -Subnet $vnet.Subnets[$subnetIndex] -PublicIpAddress $pubip
	
	$vmName="WEB07"
	$vmSize="Standard_A3"
	$avName="WEB_AS"
	$avSet=Get-AzureAvailabilitySet –Name $avName –ResourceGroupName $rgName
	$vm=New-AzureVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	
	$nic=Get-AzureNetworkInterface -Name $nicName -ResourceGroupName $rgName
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id 
	
	$diskSize=200
	$diskLabel="LogInfo"
	$vhdName="WEBServers"
	$vhdURI="http://" + $vhdName + ".blob.core.windows.net/" + $vmName + "/disk1.vhd"
	Add-AzureVMDataDisk -VM $vm -Name $diskLabel -DiskSizeInGB $diskSize -VhdUri $vhdURI
	
	$imageName="a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd"
	$contName="WEBServers"
	$cred=Get-Credential -Message "Type the name and password of the local administrator account." 
	Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent
	$destContainer="http://" + $contName + ".blob.core.windows.net/" + $vmName + "/"
	Set-AzureVMSourceImage -VM $vm -Name $imageName -DestinationVhdsContainer $destContainer 
	
	New-AzureVM -VM $vm -ResourceGroupName $rgName -Location $locName


## Additional Resources

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](install-configure-powershell.md)

[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)

