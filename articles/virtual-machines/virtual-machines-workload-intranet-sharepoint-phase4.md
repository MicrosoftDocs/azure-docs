<properties
	pageTitle="SharePoint Server 2013 farm Phase 4 | Microsoft Azure"
	description="Create the SharePoint server virtual machines and a new SharePoint farm in Phase 4 of the SharePoint Server 2013 farm in Azure."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows-sharepoint"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2015"
	ms.author="josephd"/>

# SharePoint Intranet Farm Workload Phase 4: Configure SharePoint servers

In this phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you build out the application and web tiers of the SharePoint farm and create the farm by using the SharePoint Configuration Wizard.

You must complete this phase before moving on to [Phase 5](virtual-machines-workload-intranet-sharepoint-phase5.md). See [Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md) for all of the phases.

## Create the SharePoint server virtual machines in Azure

There are four SharePoint server virtual machines. Two SharePoint server virtual machines are for the front-end web servers, and two are for administration and hosting SharePoint applications. Two SharePoint servers in each tier provide high availability.

Use the following block of Azure PowerShell commands to create the virtual machines for the four SharePoint servers. Specify the values for the variables, removing the < and > characters. Note that this Azure PowerShell command set uses values from the following tables:

- Table M, for your virtual machines
- Table V, for your virtual network settings
- Table S, for your subnet
- Table A, for your availability sets
- Table C, for your cloud services

Recall that you defined Table M in [Phase 2: Configure domain controllers](virtual-machines-workload-intranet-sharepoint-phase2.md) and Tables V, S, A, and C in [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md).

When you have supplied all the proper values, run the resulting block at the Azure PowerShell command prompt.

	# Create the first SharePoint application server
	$vmName="<Table M – Item 6 - Virtual machine name column>"
	$vmSize="<Table M – Item 6 - Minimum size column, specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$availSet="<Table A – Item 3 – Availability set name column>"
	$image= Get-AzureVMImage | where { $_.Label -eq "SharePoint Server 2013 Trial" } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	$vm1=New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -ImageName $image -AvailabilitySetName $availSet

	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first SharePoint application server."
	$cred2=Get-Credential –Message "Now type the name and password of an account that has permissions to add this virtual machine to the domain."
	$ADDomainName="<name of the AD domain that the server is joining (example CORP)>"
	$domainDNS="<FQDN of the AD domain that the server is joining (example corp.contoso.com)>"
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password -WindowsDomain -Domain $ADDomainName -DomainUserName $cred2.GetNetworkCredential().Username -DomainPassword $cred2.GetNetworkCredential().Password -JoinDomain $domainDNS

	$subnetName="<Table 6 – Item 1 – Subnet name column>"
	$vm1 | Set-AzureSubnet -SubnetNames $subnetName

	$serviceName="<Table C – Item 3 – Cloud service name column>"
	$vnetName="<Table V – Item 1 – Value column>"
	New-AzureVM –ServiceName $serviceName -VMs $vm1 -VNetName $vnetName

	# Create the second SharePoint application server
	$vmName="<Table M – Item 7 - Virtual machine name column>"
	$vmSize="<Table M – Item 7 - Minimum size column, specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$vm1=New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -ImageName $image -AvailabilitySetName $availSet

	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second SharePoint application server."
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password -WindowsDomain -Domain $ADDomainName -DomainUserName $cred2.GetNetworkCredential().Username -DomainPassword $cred2.GetNetworkCredential().Password -JoinDomain $domainDNS

	$vm1 | Set-AzureSubnet -SubnetNames $subnetName

	New-AzureVM –ServiceName $serviceName -VMs $vm1 -VNetName $vnetName

	# Create the first SharePoint web server
	$vmName="<Table M – Item 8 - Virtual machine name column>"
	$vmSize="<Table M – Item 8 - Minimum size column, specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$availSet="<Table A – Item 4 – Availability set name column>"
	$vm1=New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -ImageName $image -AvailabilitySetName $availSet

	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first SharePoint web server."
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password -WindowsDomain -Domain $ADDomainName -DomainUserName $cred2.GetNetworkCredential().Username -DomainPassword $cred2.GetNetworkCredential().Password -JoinDomain $domainDNS

	$vm1 | Set-AzureSubnet -SubnetNames $subnetName

	New-AzureVM –ServiceName $serviceName -VMs $vm1 -VNetName $vnetName

	# Create the second SharePoint web server
	$vmName="<Table M – Item 9 - Virtual machine name column>"
	$vmSize="<Table M – Item 9 - Minimum size column, specify one: Small, Medium, Large, ExtraLarge, A5, A6, A7, A8, A9>"
	$vm1=New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -ImageName $image -AvailabilitySetName $availSet

	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second SharePoint web server."
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password -WindowsDomain -Domain $ADDomainName -DomainUserName $cred2.GetNetworkCredential().Username -DomainPassword $cred2.GetNetworkCredential().Password -JoinDomain $domainDNS

	$vm1 | Set-AzureSubnet -SubnetNames $subnetName

	New-AzureVM –ServiceName $serviceName -VMs $vm1 -VNetName $vnetName

Use the [Logging on to a virtual machine with a Remote Desktop connection procedure](virtual-machines-workload-intranet-sharepoint-phase2.md#logon) four times, once for each SharePoint server, to log on by using the [Domain]\sp_farm_db account credentials. You created these credentials in [Phase 2: Configure domain controllers](virtual-machines-workload-intranet-sharepoint-phase2.md).

Use the [To test connectivity procedure](virtual-machines-workload-intranet-sharepoint-phase2.md#testconn) four times, once for each SharePoint server, to test connectivity to locations on your organization network.

## Configure the SharePoint farm

Use these steps to configure the first SharePoint server in the farm:

1.	From the desktop of the first SharePoint application server, double-click **SharePoint 2013 Products Configuration Wizard**. When you're asked to allow the program to make changes to the computer, click **Yes**.
2.	On the **Welcome to SharePoint Products** page, click **Next**.
3.	A **SharePoint Products Configuration Wizard** dialog appears, warning that services (such as IIS) will be restarted or reset. Click **Yes**.
4.	On the **Connect to a server farm** page, select **Create a new server farm**, and then click **Next**.
5.	On the **Specify Configuration Database Settings** page:
 - In **Database server**, type the name of the primary database server.
 - In **Username**, type [Domain]**\sp_farm_db** (created in [Phase 2: Configure domain controllers](virtual-machines-workload-intranet-sharepoint-phase2.md)). Recall that the sp_farm_db account has sysadmin privileges on the database server.
 - In **Password**, type the sp_farm_db account password.
6.	Click **Next**.
7.	On the **Specify Farm Security Settings** page, type a passphrase twice. Record the passphrase and store it in a secure location for future reference. Click **Next**.
8.	On the **Configure SharePoint Central Administration Web Application** page, click **Next**.
9.	The **Completing the SharePoint Products Configuration Wizard** page appears. Click **Next**.
10.	The **Configuring SharePoint Products** page appears. Wait until the configuration process finishes, about 8 minutes.
11.	After the farm is successfully configured, click **Finish**. The new administration website starts.
12.	To start configuring the SharePoint farm, click **Start the Wizard**.

Perform the following procedure on the second SharePoint application server and the two front-end web servers:

1.	From the desktop, double-click **SharePoint 2013 Products Configuration Wizard**. When you're asked to allow the program to make changes to the computer, click **Yes**.
2.	On the **Welcome to SharePoint Products** page, click **Next**.
3.	A **SharePoint Products Configuration Wizard** dialog appears, warning that services (such as IIS) will be restarted or reset. Click **Yes**.
4.	On the **Connect to a server farm** page, click **Connect to an existing server farm**, and then click **Next**.
5.	On the **Specify Configuration Database Settings** page, type the name of the primary database server in **Database server**, and then click **Retrieve Database Names**.
6.	Click **SharePoint_Config** in the database name list, and then click **Next**.
7.	On the **Specify Farm Security Settings** page, type the passphrase from the previous procedure. Click **Next**.
8.	The **Completing the SharePoint Products Configuration Wizard** page appears. Click **Next**.
9.	On the **Configuration Successful** page, click **Finish**.

When SharePoint creates the farm, it configures a set of server logins on the primary SQL Server virtual machine. SQL Server 2012 introduces the concept of users with passwords for contained databases. The database itself stores all the database metadata and user information, and a user who is defined in this database does not need to have a corresponding login. The information in this database is replicated by the availability group and is available after a failover. For more information, see [Contained databases](http://go.microsoft.com/fwlink/p/?LinkId=262794).

However, by default, SharePoint databases are not contained databases. Therefore, you will need to manually configure the secondary database server so that it has the same set of logins for SharePoint farm accounts as the primary database server. You can perform this synchronization from SQL Server Management Studio by connecting to both servers at the same time.

After you finish this initial setup, more configuration options for the capabilities of the SharePoint farm are available. For more information, see [Planning for SharePoint 2013 on Azure infrastructure services](http://msdn.microsoft.com/library/dn275958.aspx).

## Configure internal load balancing

You configure internal load balancing so that client traffic to the SharePoint farm is distributed evenly to the two front-end web servers. This requires you to specify an internal load-balancing instance that consists of a name and its own IP address, assigned from the subnet address space. To determine whether an IP address that you choose for the internal load balancer is available, use the following Azure PowerShell commands:

	$vnet="<Table V – Item 1 – Value column>"
	$testIP="<a chosen IP address from the subnet address space, Table S - Item 1 – Subnet address space column>"
	Test-AzureStaticVNetIP –VNetName $vnet –IPAddress $testIP

If the **IsAvailable** field in the display of the **Test-AzureStaticVNetIP** command is **True**, you can use the IP address.

From an Azure PowerShell command prompt on your local computer, run the following set of commands:

	$serviceName="<Table C – Item 3 – Cloud service name column>"
	$ilb="<name of your internal load balancer instance>"
	$subnet="<Table S – Item 1 – Subnet name column>"
	$IP="<an available IP address for your ILB instance>"
	Add-AzureInternalLoadBalancer –ServiceName $serviceName -InternalLoadBalancerName $ilb –SubnetName $subnet –StaticVNetIPAddress $IP

	$prot="tcp"
	$locport=80
	$pubport=80
	# This example assumes unsecured HTTP traffic to the SharePoint farm.

	$epname="SPWeb1"
	$vmname="<Table M – Item 8 – Virtual machine name column>"
	Get-AzureVM –ServiceName $serviceName –Name $vmname | Add-AzureEndpoint -Name $epname -LBSetName $ilb -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

	$epname="SPWeb2"
	$vmname="<Table M – Item 9 – Virtual machine name column>"
	Get-AzureVM –ServiceName $serviceName –Name $vmname | Add-AzureEndpoint -Name $epname -LBSetName $ilb -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

Next, add a DNS address record to your organization's DNS infrastructure that resolves the fully qualified domain name of the SharePoint farm (such as sp.corp.contoso.com) to the IP address assigned to the internal load balancer instance (the value of **$IP** in the preceding Azure PowerShell command block).

This is the configuration that results from the successful completion of this phase:

![](./media/virtual-machines-workload-intranet-sharepoint-phase4/workload-spsqlao_04.png)

## Next step

To continue with the configuration of this workload, go to [Phase 5: Create the availability group and add the SharePoint databases](virtual-machines-workload-intranet-sharepoint-phase5.md).

## Additional resources

[Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md)

[SharePoint farms hosted in Azure infrastructure services](virtual-machines-sharepoint-infrastructure-services.md)

[SharePoint with SQL Server AlwaysOn infographic](http://go.microsoft.com/fwlink/?LinkId=394788)

[Microsoft Azure architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: High-availability line of business application](virtual-machines-workload-high-availability-lob-application.md)
