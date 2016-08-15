<properties
	pageTitle="Create a Linux VM using Azure Powershell | Microsoft Azure"
	description="Learn how to create and preconfigure a Linux VM using Azure PowerShell."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/11/2015"
	ms.author="cynthn"/>

# Create and preconfigure a Linux virtual machine using Azure Powershell


[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.
 
These steps show you how to create a Linux virtual machine using a fill-in-the-blanks approach for creating Azure PowerShell command sets. This approach can be useful if you are new to Azure PowerShell or you just want to know what values to specify for successful configuration. 

You'll build your command set by copying the sets of command blocks into a text file or the PowerShell ISE and then filling in the variable values and removing the < and > characters. See the two [examples](#examples) at the end of this article for an idea of the final result.

For the companion topic for Windows-based virtual machines, see [Use Azure PowerShell to create Windows-based virtual machines](virtual-machines-windows-classic-create-powershell.md).

## Install Azure PowerShell

If you haven't done so already, [install and configure Azure PowerShell](../powershell-install-configure.md). Then, open an Azure PowerShell command prompt.

## Set your subscription and storage account

Set your Azure subscription and storage account by running the following commands at the Azure PowerShell command prompt. 

You can get the correct subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command. 

You can get the correct storage account name from the **Label** property of the output of the **Get-AzureStorageAccount** command after you issue the Select-AzureSubscription command. 

Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	$staccount="<storage account name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr -CurrentStorageAccountName $staccount


## Find the image you want to use

Next, you need to determine the ImageFamily value for the image you wnat to use. You can get the list of available ImageFamily values with the following command.

	Get-AzureVMImage | select ImageFamily -Unique

Here are some examples of ImageFamily values for Linux-based computers:

- Ubuntu Server 12.10
- CoreOS Alpha
- SUSE Linux Enterprise Server 12

Open a fresh instance of the text editor of your choice or an instance of the PowerShell Integrated Scripting Environment (ISE). Copy the following into the new text file or the PowerShell ISE, substituting the ImageFamily value.

	$family="<ImageFamily value>"
	$image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

## Specify the name, size and optionally, the availability set

Start your command set by choosing one of these two command blocks (required).

**Option 1**: Specify a virtual machine name and a size.

	$vmname="<machine name>"
	$vmsize="<Specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

**Option 2**: Specify a name, size, and availability set name.

	$vmname="<machine name>"
	$vmsize="<Specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$availset="<set name>"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image -AvailabilitySetName $availset

For the InstanceSize values for D-, DS-, or G-series virtual machines, see [Virtual Machine and Cloud Service Sizes for Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx).


## Setup user access security options

**Option 1**: Specify the initial Linux user name and password (required). Choose a strong password. To check its strength, see [Password Checker: Using Strong Passwords](https://www.microsoft.com/security/pc-security/password-checker.aspx).

	$cred=Get-Credential -Message "Type the name and password of the initial Linux account."
	$vm1 | Add-AzureProvisioningConfig -Linux -LinuxUser $cred.GetNetworkCredential().Username -Password $cred.GetNetworkCredential().Password

**Option 2**: Specify a set of SSH key pairs that are already deployed in the subscription.

	$vm1 | Add-AzureProvisioningConfig -Linux -SSHKeyPairs "<SSH key pairs>"

For more information, see [How to use SSH with Linux on Azure](virtual-machines-linux-ssh-from-linux.md).

**Option 3**: Specify a list of SSH public keys that are already deployed in the subscription.

	$vm1 | Add-AzureProvisioningConfig -Linux - SSHPublicKeys "<SSH public keys>"

For additional preconfiguration options for Linux-based virtual machines, see the syntax for the **Linux** parameter set in [Add-AzureProvisioningConfig](https://msdn.microsoft.com/library/azure/dn495299.aspx).


## Optional: Assign a static DIP

Optionally, assign the virtual machine a specific IP address, known as a static DIP.

	$vm1 | Set-AzureStaticVNetIP -IPAddress <IP address>

You can verify that a specific IP address is available with the following command.

	Test-AzureStaticVNetIP –VNetName <VNet name> –IPAddress <IP address>

## Optional: Assign the virtual machine to a specific subnet 

Assign the virtual machine to a specific subnet in an Azure virtual network.

	$vm1 | Set-AzureSubnet -SubnetNames "<name of the subnet>"

	
## Optional: Add a data disk
	
Add the following to your command set to add a data disk to the virtual machine.

	$disksize=<size of the disk in GB>
	$disklabel="<the label on the disk>"
	$lun=<Logical Unit Number (LUN) of the disk>
	$hcaching="<Specify one: ReadOnly, ReadWrite, None>"
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB $disksize -DiskLabel $disklabel -LUN $lun -HostCaching $hcaching

## Optional: Add the virtual machine to an existing load-balanced 

Add the following to your command set to add the virtual machine to an existing load-balanced set for external traffic.

	$prot="<Specify one: tcp, udp>"
	$localport=<port number of the internal port>
	$pubport=<port number of the external port>
	$endpointname="<name of the endpoint>"
	$lbsetname="<name of the existing load-balanced set>"
	$probeprotocol="<Specify one: tcp, http>"
	$probeport=<TCP or HTTP port number of probe traffic>
	$probepath="<URL path for probe traffic>"
	$vm1 | Add-AzureEndpoint -Name $endpointname -Protocol $prot -LocalPort $localport -PublicPort $pubport -LBSetName $lbsetname -ProbeProtocol $probeprotocol -ProbePort $probeport -ProbePath $probepath

## Decide how to start the virtual machine creation process 

Add a block to your command set to start the virtual machine creation process by choosing one of the following command blocks.

**Option 1**: Create the virtual machine in an existing cloud service.

	New-AzureVM –ServiceName "<short name of the cloud service>" -VMs $vm1

The short name of the cloud service is the name that appears in the list of Azure Cloud Services in the Azure classic portal or in the list of resource groups in the Azure portal.

**Option 2**: Create the virtual machine in an existing cloud service and virtual network.

	$svcname="<short name of the cloud service>"
	$vnetname="<name of the virtual network>"
	New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname

## Run your command set

Review the Azure PowerShell command set you built in your text editor or the PowerShell ISE and ensure that you have specified all the variables and that they have the correct values. Also, make sure that you have removed all the < and > characters.

Copy the command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands and create your Azure virtual machine. 

After the virtual machine is created, see [How to log on to a virtual machine running Linux](virtual-machines-linux-classic-log-on.md).

If you want to reuse the command set, you can:

- Save this command set as a PowerShell script file (*.ps1)
- Save this command set as an Azure automation runbook in the **Automation** section of the Azure classic portal

## <a id="examples"></a>Examples

Here are two examples of using the earlier steps to build Azure PowerShell command sets that create Linux-based virtual machines in Azure.

### Example 1

I need a PowerShell command set to create the initial Linux virtual machine for a MySQL server that:

- Uses the Ubuntu Server 12.10 image.
- Has the name AZMYSQL1.
- Has an additional data disk of 500 GB.
- Has the static IP address of 192.168.244.4.
- Is in the BackEnd subnet of the AZDatacenter virtual network.
- Is in the Azure-TailspinToys cloud service.

Here is the corresponding Azure PowerShell command set to create this virtual machine, with blank lines between each block for readability.

	$family="Ubuntu Server 12.10"
	$image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

	$vmname="AZMYSQL1"
	$vmsize="Large"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

	$cred=Get-Credential -Message "Type the name and password of the initial Linux account."
	$vm1 | Add-AzureProvisioningConfig -Linux -LinuxUser $cred.GetNetworkCredential().Username -Password $cred.GetNetworkCredential().Password

	$vm1 | Set-AzureSubnet -SubnetNames "BackEnd"

	$vm1 | Set-AzureStaticVNetIP -IPAddress 192.168.244.4

	$disksize=500
	$disklabel="MySQLData"
	$lun=0
	$hcaching="None"
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB $disksize -DiskLabel $disklabel -LUN $lun -HostCaching $hcaching

	$svcname="Azure-TailspinToys"
	$vnetname="AZDatacenter"
	New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname

### Example 2

I need a PowerShell command set to create a Linux virtual machine for an Apache server that:

- Uses the SUSE Linux Enterprise Server 12 image.
- Has the name LOB1.
- Has an additional data disk of 50 GB.
- Is a member of the LOBServers load balancer set for standard web traffic.
- Is in the FrontEnd subnet of the AZDatacenter virtual network.
- Is in the Azure-TailspinToys cloud service.

Here is the corresponding Azure PowerShell command set to create this virtual machine.

	$family="SUSE Linux Enterprise Server 12"
	$image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

	$vmname="LOB1"
	$vmsize="Medium"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

	$cred=Get-Credential -Message "Type the name and password of the initial Linux account."
	$vm1 | Add-AzureProvisioningConfig -Linux -LinuxUser $cred.GetNetworkCredential().Username -Password $cred.GetNetworkCredential().Password

	$vm1 | Set-AzureSubnet -SubnetNames "FrontEnd"

	$disksize=50
	$disklabel="LOBApp"
	$lun=0
	$hcaching="ReadWrite"
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB $disksize -DiskLabel $disklabel -LUN $lun -HostCaching $hcaching

	$prot="tcp"
	$localport=80
	$pubport=80
	$endpointname="LOB1"
	$lbsetname="LOBServers"
	$probeprotocol="tcp"
	$probeport=80
	$probepath="/"
	$vm1 | Add-AzureEndpoint -Name $endpointname -Protocol $prot -LocalPort $localport -PublicPort $pubport -LBSetName $lbsetname -ProbeProtocol $probeprotocol -ProbePort $probeport -ProbePath $probepath

	$svcname="Azure-TailspinToys"
	$vnetname="AZDatacenter"
	New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname

## Additional resources

[Virtual machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](../powershell-install-configure.md)

[How to log on to a virtual machine running Linux](virtual-machines-linux-classic-log-on.md)

[Use Azure PowerShell to create and preconfigure Windows-based virtual machines](virtual-machines-windows-classic-create-powershell.md)
