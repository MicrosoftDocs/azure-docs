<properties
	pageTitle="Use Azure PowerShell to create and preconfigure Linux-based virtual machines"
	description="Learn how to use Azure PowerShell to create and preconfigure Linux-based virtual machines in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/09/2015"
	ms.author="kathydav"/>

# Use Azure PowerShell to create and preconfigure Linux-based virtual machines

> [AZURE.SELECTOR]
- [Azure CLI](virtual-machines-linux-tutorial.md)
- [PowerShell](virtual-machines-ps-create-preconfigure-linux-vms.md)

These steps show you how to customize a set of Azure PowerShell commands that create and preconfigure a Linux-based Azure virtual machine in Service Management by using a building block approach. You can use this process to quickly create a command set for a new Linux-based virtual machine and expand an existing deployment or to create multiple command sets that quickly build out a custom dev/test or IT pro environment.

These steps follow a fill-in-the-blanks approach for creating Azure PowerShell command sets. This approach can be useful if you are new to Azure PowerShell or you just want to know what values to specify for successful configuration. Advanced Azure PowerShell users can take the commands and substitute their own values for the variables (the lines beginning with "$").

For the companion topic to configure Windows-based virtual machines, see [Use Azure PowerShell to create and preconfigure Windows-based virtual machines](virtual-machines-ps-create-preconfigure-windows-vms.md).

## Step 1: Install Azure PowerShell

If you haven't done so already, use the instructions in [How to install and configure Azure PowerShell](../install-configure-powershell.md) to install Azure PowerShell on your local computer. Then, open an Azure PowerShell command prompt.

## Step 2: Set your subscription and storage account

Set your Azure subscription and storage account by running the following commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	$staccount="<storage account name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr -CurrentStorageAccountName $staccount

You can get the correct subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command. You can get the correct storage account name from the **Label** property of the output of the **Get-AzureStorageAccount** command after you issue the **Select-AzureSubscription** command. You can also store these commands in a text file for future use.

## Step 3: Determine the ImageFamily

Next, you need to determine the ImageFamily value for the specific image corresponding to the Azure virtual machine you want to create. You can get the list of available ImageFamily values with the following command.

	Get-AzureVMImage | select ImageFamily -Unique

Here are some examples of ImageFamily values for Linux-based computers:

- Ubuntu Server 12.10
- CoreOS Alpha
- SUSE Linux Enterprise Server 12

Open a fresh instance of the text editor of your choice or an instance of the PowerShell Integrated Scripting Environment (ISE). Copy the following into the new text file or the PowerShell ISE, substituting the ImageFamily value.

	$family="<ImageFamily value>"
	$image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

## Step 4: Build your command set

Build the rest of your command set by copying one of the following sets of command blocks into your new text file or the PowerShell ISE and then filling in the variable values and removing the < and > characters. See the two [examples](#examples) at the end of this article for an idea of the final result.

Start your command set by choosing one of these two command blocks (required).

Option 1: Specify a virtual machine name and a size.

	$vmname="<machine name>"
	$vmsize="<Specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

Option 2: Specify a name, size, and availability set name.

	$vmname="<machine name>"
	$vmsize="<Specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$availset="<set name>"
	$vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image -AvailabilitySetName $availset

For the InstanceSize values for D-, DS-, or G-series virtual machines, see [Virtual Machine and Cloud Service Sizes for Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx).

Use the following commands to specify the initial Linux user name and password (required). Choose a strong password. To check its strength, see [Password Checker: Using Strong Passwords](https://www.microsoft.com/security/pc-security/password-checker.aspx).

	$cred=Get-Credential -Message "Type the name and password of the initial Linux account."
	$vm1 | Add-AzureProvisioningConfig -Linux -LinuxUser $cred.GetNetworkCredential().Username -Password $cred.GetNetworkCredential().Password

Optionally, specify a set of SSH key pairs that are already deployed in the subscription.

	$vm1 | Add-AzureProvisioningConfig -Linux -SSHKeyPairs "<SSH key pairs>"

For more information, see [How to use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).

Optionally, specify a list of SSH public keys that are already deployed in the subscription.

	$vm1 | Add-AzureProvisioningConfig -Linux - SSHPublicKeys "<SSH public keys>"

For additional preconfiguration options for Linux-based virtual machines, see the syntax for the **Linux** parameter set in [Add-AzureProvisioningConfig](https://msdn.microsoft.com/library/azure/dn495299.aspx).

Optionally, assign the virtual machine a specific IP address, known as a static DIP.

	$vm1 | Set-AzureStaticVNetIP -IPAddress <IP address>

You can verify that a specific IP address is available with the following command.

	Test-AzureStaticVNetIP –VNetName <VNet name> –IPAddress <IP address>

Optionally, assign the virtual machine to a specific subnet in an Azure virtual network.

	$vm1 | Set-AzureSubnet -SubnetNames "<name of the subnet>"

Optionally, add a single data disk to the virtual machine.

	$disksize=<size of the disk in GB>
	$disklabel="<the label on the disk>"
	$lun=<Logical Unit Number (LUN) of the disk>
	$hcaching="<Specify one: ReadOnly, ReadWrite, None>"
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB $disksize -DiskLabel $disklabel -LUN $lun -HostCaching $hcaching

Optionally, add the virtual machine to an existing load-balanced set for external traffic.

	$prot="<Specify one: tcp, udp>"
	$localport=<port number of the internal port>
	$pubport=<port number of the external port>
	$endpointname="<name of the endpoint>"
	$lbsetname="<name of the existing load-balanced set>"
	$probeprotocol="<Specify one: tcp, udp>"
	$probeport=<TCP or UDP port number of probe traffic>
	$probepath="<URL path for probe traffic>"
	$vm1 | Add-AzureEndpoint -Name $endpointname -Protocol $prot -LocalPort $localport -PublicPort $pubport -LBSetName $lbsetname -ProbeProtocol $probeprotocol -ProbePort $probeport -ProbePath $probepath

Finally, start the virtual machine creation process by choosing one of the following command blocks (required).

Option 1: Create the virtual machine in an existing cloud service.

	New-AzureVM –ServiceName "<short name of the cloud service>" -VMs $vm1

The short name of the cloud service is the name that appears in the list of Azure Cloud Services in the Azure portal or in the list of resource groups in the Azure preview portal.

Option 2: Create the virtual machine in an existing cloud service and virtual network.

	$svcname="<short name of the cloud service>"
	$vnetname="<name of the virtual network>"
	New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname

## Step 5: Run your command set

Review the Azure PowerShell command set you built in your text editor or the PowerShell ISE consisting of multiple blocks of commands from step 4. Ensure that you have specified all the needed variables and that they have the correct values. Also make sure that you have removed all the < and > characters.

If you are using a text editor, copy the command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands and create your Azure virtual machine. Alternately, run your command set in the PowerShell ISE.

If you create the virtual machine in the wrong subscription, storage account, cloud service, availability set, virtual network, or subnet, delete the virtual machine, correct the command block syntax, and then run the corrected command set.

After the virtual machine is created, see [How to log on to a virtual machine running Linux](virtual-machines-linux-how-to-log-on.md).

If you will be creating this virtual machine again or a similar one, you can:

- Save this command set as a PowerShell script file (*.ps1)
- Save this command set as an Azure automation runbook in the **Automation** section of the Azure portal

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

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](../install-configure-powershell.md)

[How to log on to a virtual machine running Linux](virtual-machines-linux-how-to-log-on.md)

[Use Azure PowerShell to create and preconfigure Windows-based virtual machines](virtual-machines-ps-create-preconfigure-windows-vms.md)
