<properties
	pageTitle="Base Configuration Test Environment with Azure Resource Manager"
	description="Learn how to create a simple dev/test environment that simulates a simplified intranet in Microsoft Azure using Resource Manager."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/23/2015"
	ms.author="josephd"/>

# Base Configuration test environment with Azure Resource Manager

This article provides you with step-by-step instructions to create the Base Configuration test environment in a Microsoft Azure Virtual Network, using virtual machines created in Resource Manager. 

You can use the resulting test environment:

- For application development and testing.
- As the initial configuration of an extended test environment of your own design that includes additional virtual machines and Azure services.

The Base Configuration test environment consists of the Corpnet subnet in a cloud-only virtual network named TestLab that simulates a simplified, private intranet connected to the Internet.

![](./media/virtual-machines-base-configuration-test-environment-resource-manager/BC_TLG04.png)

It contains:

- An Azure virtual machine running Windows Server 2012 R2 named DC1 that is configured as an intranet domain controller and Domain Name System (DNS) server.
- An Azure virtual machine running Windows Server 2012 R2 named APP1 that is configured as a general application and web server.
- An Azure virtual machine running Windows Server 2012 R2 named CLIENT1 that acts as an intranet client.

This configuration allows DC1, APP1, CLIENT1, and additional Corpnet subnet computers to be:  

- Connected to the Internet to install updates, access Internet resources in real time, and participate in public cloud technologies such as Microsoft Office 365 and other Azure services.
- Remotely managed using Remote Desktop Connections from your computer that is connected to the Internet or your organization network.

There are four phases to setting up the Corpnet subnet of the Windows Server 2012 R2 Base Configuration test environment in Azure.

1.	Create the virtual network.
2.	Configure DC1.
3.	Configure APP1.
4.	Configure CLIENT1.

If you do not already have an Azure account, you can sign up for a free trial at [Try Azure](http://azure.microsoft.com/pricing/free-trial/). If you have an MSDN Subscription, see [Azure benefit for MSDN subscribers](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).

> [AZURE.NOTE] Virtual machines in Azure incur an ongoing monetary cost when they are running. This cost is billed against your free trial, MSDN subscription, or paid subscription. For more information about the costs of running Azure virtual machines, see [Virtual Machines Pricing Details](http://azure.microsoft.com/pricing/details/virtual-machines/) and [Azure Pricing Calculator](http://azure.microsoft.com/pricing/calculator/). To keep costs down, see [Minimizing the costs of test environment virtual machines in Azure](#costs).

[AZURE.INCLUDE [resource-manager-pointer-to-service-management](../../includes/resource-manager-pointer-to-service-management.md)]

- [Base Configuration test environment](virtual-machines-base-configuration-test-environment.md)


## Phase 1: Create the virtual network

First, if needed, use the instructions in [How to install and configure Azure PowerShell](../install-configure-powershell.md) to install Azure PowerShell on your local computer. Open an Azure PowerShell prompt.

Next, select the correct Azure subscription with these commands. Replace everything within the quotes, including the < and > characters, with the correct name.

	$subscr="<Subscription name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current

You can get the subscription name from the SubscriptionName property of the display of the **Get-AzureSubscription** command.

Next, switch Azure PowerShell into Resource Manager mode.

	Switch-AzureMode AzureResourceManager 

Next, create a new resource group for your Base Configuration test lab. To determine a unique resource group name, use this command to list your existing resource groups.

	Get-AzureResourceGroup | Sort ResourceGroupName | Select ResourceGroupName

To list the Azure locations where you can create Resource Manager-based virtual machines, use these commands.

	$loc=Get-AzureLocation | where { $_.Name –eq "Microsoft.Compute/virtualMachines" }
	$loc.Locations

Create your new resource group with these commands. Replace everything within the quotes, including the < and > characters, with the correct names.

	$rgName="<resource group name>"
	$locName="<location name, such as West US>"
	New-AzureResourceGroup -Name $rgName -Location $locName

Resource Manager-based virtual machines require a Resource Manager-based storage account. You must pick a globally unique name for your storage account that contains only lowercase letters and numbers. You can use this command to list the existing storage accounts.

	Get-AzureStorageAccount | Sort Name | Select Name

To test whether a chosen storage account name is globally unique, you need to run the **Test-AzureName** command in the Azure Service Management mode of PowerShell. Use these commands.

	Switch-AzureMode AzureServiceManagement
	Test-AzureName -Storage <Proposed storage account name>

If the Test-AzureName command displays **False**, your proposed name is unique. When you have determined a unique name, switch Azure PowerShell back to Resource Manager mode with this command.

	Switch-AzureMode AzureResourceManager 

Create a new storage account for your new test environment with these commands.

	$rgName="<your new resource group name>"
	$locName="<the location of your new resource group>"
	$saName="<storage account name>"
	New-AzureStorageAccount -Name $saName -ResourceGroupName $rgName –Type Standard_LRS -Location $locName

Next, you create the TestLab Azure Virtual Network that will host the Corpnet subnet of the base configuration.

	$rgName="<name of your new resource group>"
	$locName="<Azure location name, such as West US>"
	$corpnetSubnet=New-AzureVirtualNetworkSubnetConfig -Name Corpnet -AddressPrefix 10.0.0.0/24
	New-AzurevirtualNetwork -Name TestLab -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/8 -Subnet $corpnetSubnet –DNSServer 10.0.0.4

This is your current configuration.

![](./media/virtual-machines-base-configuration-test-environment-resource-manager/BC_TLG01.png)

## Phase 2: Configure DC1

DC1 is a domain controller for the corp.contoso.com Active Directory Domain Services (AD DS) domain and a DNS server for the virtual machines of the TestLab virtual network.

First, fill in the name of your resource group, Azure location, and storage account name and run these commands at the Azure PowerShell command prompt on your local computer to create an Azure Virtual Machine for DC1.

	$rgName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$saName="<storage account name>"
	$vnet=Get-AzurevirtualNetwork -Name TestLab -ResourceGroupName $rgName
	$pip = New-AzurePublicIpAddress -Name DC1-NIC -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
	$nic = New-AzureNetworkInterface -Name DC1-NIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -PrivateIpAddress 10.0.0.4
	$vm=New-AzureVMConfig -VMName DC1 -VMSize Standard_A1
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$vhdURI=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/DC1-TestLab-ADDSDisk.vhd"
	Add-AzureVMDataDisk -VM $vm -Name ADDS-Data -DiskSizeInGB 20 -VhdUri $vhdURI  -CreateOption empty
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for DC1." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName DC1 -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/DC1-TestLab-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name DC1-TestLab-OSDisk -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm

Next, connect to the DC1 virtual machine.

1.	In the Azure Preview portal, click **Browse All** in the left pane, click **Virtual machines** in the **Browse** list, and then click the **DC1** virtual machine.  
2.	In the **DC1** pane,, click **Connect**.
3.	When prompted, open the DC1.rdp downloaded file.
4.	When prompted with a Remote Desktop Connection message box, click **Connect**.
5.	When prompted for credentials, use the following:
- Name: **DC1\\**[Local administrator account name]
- Password: [Local administrator account password]
6.	When prompted with a Remote Desktop Connection message box referring to certificates, click **Yes**.

Next, add an extra data disk as a new volume with the drive letter F:.

1.	In the left pane of Server Manager, click **File and Storage Services**, and then click **Disks**.
2.	In the contents pane, in the **Disks** group, click **disk 2** (with the **Partition** set to **Unknown**).
3.	Click **Tasks**, and then click **New Volume**.
4.	On the Before you begin page of the New Volume Wizard, click **Next**.
5.	On the Select the server and disk page, click **Disk 2**, and then click **Next**. When prompted, click **OK**.
6.	On the Specify the size of the volume page, click **Next**.
7.	On the Assign to a drive letter or folder page, click **Next**.
8.	On the Select file system settings page, click **Next**.
9.	On the Confirm selections page, click **Create**.
10.	When complete, click **Close**.

Next, configure DC1 as a domain controller and DNS server for the corp.contoso.com domain. Run these commands at an administrator-level Windows PowerShell command prompt.

	Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
	Install-ADDSForest -DomainName corp.contoso.com -DatabasePath "F:\NTDS" -SysvolPath "F:\SYSVOL" -LogPath "F:\Logs"

After DC1 restarts, reconnect to the DC1 virtual machine.

1.	In the Azure Preview portal, click Browse All in the left pane, click Virtual machines in the Browse list, and then click the DC1 virtual machine.
2.	In the DC1 pane, click Connect.
3.	When prompted to open DC1.rdp, click **Open**.
4.	When prompted with a Remote Desktop Connection message box, click **Connect**.
5.	When prompted for credentials, use the following:
- Name: **CORP\\**[Local administrator account name]
- Password: [Local administrator account password]
6.	When prompted by a Remote Desktop Connection message box referring to certificates, click **Yes**.

Next, create a user account in Active Directory that will be used when logging in to CORP domain member computers. Run these commands one at a time at an administrator-level Windows PowerShell command prompt.

	New-ADUser -SamAccountName User1 -AccountPassword (read-host "Set user password" -assecurestring) -name "User1" -enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false
	Add-ADPrincipalGroupMembership -Identity "CN=User1,CN=Users,DC=corp,DC=contoso,DC=com" -MemberOf "CN=Enterprise Admins,CN=Users,DC=corp,DC=contoso,DC=com","CN=Domain Admins,CN=Users,DC=corp,DC=contoso,DC=com"

Note that the first command results in a prompt to supply the User1 account password. Because this account will be used for remote desktop connections for all CORP domain member computers, choose a strong password. To check its strength, see [Password Checker: Using Strong Passwords](https://www.microsoft.com/security/pc-security/password-checker.aspx). Record the User1 account password and store it in a secured location.

Close the Remote Desktop session with DC1 and then reconnect using the CORP\User1 account.

Next, to allow traffic for the Ping tool, run this command at an administrator-level Windows PowerShell command prompt.

	Set-NetFirewallRule -DisplayName "File and Printer Sharing (Echo Request - ICMPv4-In)" -enabled True

This is your current configuration.

![](./media/virtual-machines-base-configuration-test-environment-resource-manager/BC_TLG02.png)

## Phase 3: Configure APP1

APP1 provides web and file sharing services.

First, fill in the name of your resource group, Azure location, and storage account name and run these commands at the Azure PowerShell command prompt on your local computer to create an Azure Virtual Machine for APP1.

	$rgName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$saName="<storage account name>"
	$vnet=Get-AzurevirtualNetwork -Name TestLab -ResourceGroupName $rgName
	$pip = New-AzurePublicIpAddress -Name APP1-NIC -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
	$nic = New-AzureNetworkInterface -Name APP1-NIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
	$vm=New-AzureVMConfig -VMName APP1 -VMSize Standard_A1
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for APP1." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName APP1 -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/APP1-TestLab-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name APP1-TestLab-OSDisk -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm

Next, connect to the APP1 virtual machine using the APP1 local administrator account name and password, and then open an administrator-level Windows PowerShell command prompt.

To check name resolution and network communication between APP1 and DC1, run the **ping dc1.corp.contoso.com** command and verify that there are four replies.

Next, join the APP1 virtual machine to the CORP domain with these commands at the Windows PowerShell prompt.

	Add-Computer -DomainName corp.contoso.com
	Restart-Computer

Note that you must supply your CORP\User1 domain account credentials after entering the Add-Computer command.

After APP1 restarts, connect to it using the CORP\User1 account name and password, and then open an administrator-level Windows PowerShell command prompt.

Next, make APP1 a web server with this command at the Windows PowerShell command prompt.

	Install-WindowsFeature Web-WebServer –IncludeManagementTools

Next, create a shared folder and a text file within the folder on APP1 with these commands.

	New-Item -path c:\files -type directory
	Write-Output "This is a shared file." | out-file c:\files\example.txt
	New-SmbShare -name files -path c:\files -changeaccess CORP\User1

This is your current configuration.

![](./media/virtual-machines-base-configuration-test-environment-resource-manager/BC_TLG03.png)

## Phase 4: Configure CLIENT1

CLIENT1 acts as a typical laptop, tablet, or desktop computer on the Contoso intranet.

First, fill in the name of your resource group, Azure location, and storage account name and run these commands at the Azure PowerShell command prompt on your local computer to create an Azure Virtual Machine for CLIENT1.

	$rgName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$saName="<storage account name>"
	$vnet=Get-AzurevirtualNetwork -Name TestLab -ResourceGroupName $rgName
	$pip = New-AzurePublicIpAddress -Name CLIENT1-NIC -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
	$nic = New-AzureNetworkInterface -Name CLIENT1-NIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
	$vm=New-AzureVMConfig -VMName CLIENT1 -VMSize Standard_A1
	$storageAcc=Get-AzureStorageAccount -ResourceGroupName $rgName -Name $saName
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for CLIENT1." 
	$vm=Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName CLIENT1 -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureVMNetworkInterface -VM $vm -Id $nic.Id	
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/CLIENT1-TestLab-OSDisk.vhd"
	$vm=Set-AzureVMOSDisk -VM $vm -Name CLIENT1-TestLab-OSDisk -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureVM -ResourceGroupName $rgName -Location $locName -VM $vm

Next, connect to the CLIENT1 virtual machine using the CLIENT1 local administrator account name and password, and then open an administrator-level Windows PowerShell command prompt.

To check name resolution and network communication between CLIENT1 and DC1, run the **ping dc1.corp.contoso.com** command at a Windows PowerShell command prompt and verify that there are four replies.

Next, join the CLIENT1 virtual machine to the CORP domain with these commands at the Windows PowerShell prompt.

	Add-Computer -DomainName corp.contoso.com
	Restart-Computer

Note that you must supply your CORP\User1 domain account credentials after entering the Add-Computer command.

After CLIENT1 restarts, connect to it using the CORP\User1 account name and password, and then open an administrator-level Windows PowerShell command prompt.

Next, verify that you can access web and file share resources on APP1 from CLIENT1.

1.	In Server Manager, in the tree pane, click **Local Server**.
2.	In **Properties for CLIENT1**, click **On** next to **IE Enhanced Security Configuration**.
3.	In **Internet Explorer Enhanced Security Configuration**, click **Off** for **Administrators** and **Users**, and then click **OK**.
4.	From the Start screen, click **Internet Explorer**, and then click **OK**.
5.	In the Address bar, type **http://app1.corp.contoso.com/**, and then press ENTER.  You should see the default Internet Information Services web page for APP1.
6.	From the desktop taskbar, click the File Explorer icon.
7.	In the address bar, type **\\\app1\Files**, and then press ENTER.
8.	You should see a folder window with the contents of the Files shared folder.
9.	In the **Files** shared folder window, double-click the **Example.txt** file. You should see the contents of the Example.txt file.
10.	Close the **example.txt - Notepad** and the **Files** shared folder windows.

This is your final configuration.

![](./media/virtual-machines-base-configuration-test-environment-resource-manager/BC_TLG04.png)

Your base configuration in Azure is now ready for application development and testing or for additional test environments.

## Additional resources

[Hybrid cloud test environments](../virtual-network/virtual-networks-setup-hybrid-cloud-environment-testing.md)

[Base Configuration test environment](virtual-machines-base-configuration-test-environment.md)


## <a id="costs"></a>Minimizing the costs of test environment virtual machines in Azure

To minimize the cost of running the test environment virtual machines, you can do one of the following:

- Create the test environment and perform your needed testing and demonstration as quickly as possible. When complete, delete the test environment virtual machines.
- Shut down your test environment virtual machines into a deallocated state.

To shut down the virtual machines with Azure PowerShell, fill in the resource group name and run these commands.

	$rgName="<your resource group name>"
	Stop-AzureVM -ResourceGroupName $rgName -Name "CLIENT1"
	Stop-AzureVM -ResourceGroupName $rgName -Name "APP1"
	Stop-AzureVM -ResourceGroupName $rgName -Name "DC1" -Force -StayProvisioned

To ensure that your virtual machines work properly when starting all of them from the Stopped (Deallocated) state, you should start them in the following order:

1.	DC1
2.	APP1
3.	CLIENT1

To start the virtual machines in order with Azure PowerShell, fill in the resource group name and run these commands.

	$rgName="<your resource group name>"
	Start-AzureVM -ResourceGroupName $rgName -Name "DC1"
	Start-AzureVM -ResourceGroupName $rgName -Name "APP1"
	Start-AzureVM -ResourceGroupName $rgName -Name "CLIENT1"
