<properties 
   pageTitle="Configure DNS between two Azure virtual networks | Microsoft Azure" 
   description="Learn how to configure VPN connections between two Azure virtual networks, how to configure domain name resolution between two virtual networks, and how to configure HBase geo-replication" 
   services="hdinsight,virtual-network" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="04/02/2015"
   ms.author="jgao"/>

# Configure DNS between two Azure virtual networks

> [AZURE.SELECTOR]
- [Configure VPN connectivity](hdinsight-hbase-geo-replication-configure-VNETs.md)
- [Configure DNS](hdinsight-hbase-geo-replication-configure-DNS.md)
- [Configure HBase replication](hdinsight-hbase-geo-replication.md) 


Learn how to add and configure DNS servers to Azure virtual networks to handle name resolution within and across the virtual networks.

This tutorial is the second part of the [series][hdinsight-hbase-geo-replication] on creating HBase geo-replication:

- [Configure a VPN connectivity between two virtual networks][hdinsight-hbase-geo-replication-vnet]
- Configure DNS for the virtual networks (this tutorial)
- [Configure HBase geo replication][hdinsight-hbase-geo-replication]


The following diagram illustrates the two virtual networks you created in [Configure a VPN connectivity between two virtual networks][hdinsight-hbase-geo-replication-vnet]:

![HDInsight HBase replication virtual network diagram][img-vnet-diagram]

##Prerequisites
Before you begin this tutorial, you must have the following:

- **An Azure subscription**. Azure is a subscription-based platform. For more information about obtaining a subscription, see  [Purchase Options] [azure-purchase-options],  [Member Offers] [azure-member-offers], or  [Free Trial] [azure-free-trial].

- **A workstation with Azure PowerShell installed and configured**. For instructions, see [Install and configure Azure PowerShell] [powershell-install]. 

	Before running PowerShell scripts, make sure you are connected to your Azure subscription using the following cmdlet:

		Add-AzureAccount

	If you have multiple Azure subscriptions, use the following cmdlet to set the current subscription:

		Select-AzureSubscription <AzureSubscriptionName>

- **Two Azure virtual network with VPN connectivity**.  For instructions, see [Configure a VPN connection between two Azure virtual networks][hdinsight-hbase-geo-replication-vnet].

>[AZURE.NOTE] Azure service names and virtual machine names must be unique. The name used in this tutorial is Contoso-[Azure Service/VM name]-[EU/US]. For example, Contoso-VNet-EU is the Azure virtual network in the North Europe data center; Contoso-DNS-US is the DNS server VM in the East U.S. data center. You must come up with your own names.
 
 
##Create Azure virtual machines to be used as DNS servers

**To create a virtual machine within Contoso-VNet-EU, called Contoso-DNS-EU**

1.	Click **NEW**, **COMPUTE**, **VIRTUAL MACHINE**, **FROM GALLERY**.
2.	Choose **Windows Server 2012 R2 Datacenter**.
3.	Enter:
	- **VIRTUAL MACHINE NAME**: Contoso-DNS-EU
	- **NEW USER NAME**: 
	- **NEW PASSWORD**: 
4.	Enter:
	- **CLOUD SERVICE**: Create a new cloud service
	- **REGION/AFFINITY GROUP/VIRTUAL NETWORK**: (Select Contoso-VNet-EU)
	- **VIRTUAL NETWORK SUBNETS**: Subnet-1
	- **STORAGE ACCOUNT**: Use an automatically generated storage account
	
		The cloud service name will be the same as the virtual machine name. In this case, that is Contoso-DNS-EU. For subsequent virtual machines, I can choose to use the same cloud service.  All the virtual machines under the same cloud service share the same virtual network and domain suffix.

		The storage account is used to store the virtual machine image file. 
	- **ENDPOINTS**: (scroll down and select **DNS**) 

After the virtual machine is created, find out the internal IP and external IP.

1.	Click the virtual machine name, **Contoso-DNS-EU**.
2.	Click **DashBoard**.
3.	Write down:
	- PUBLIC VIRTUAL IP ADDRESS
	- INTERNAL IP ADDRESS


**To create a virtual machine within Contoso-VNet-US, called Contoso-DNS-US** 

- Repeat the same procedure to create a virtual machine with the following values:
	- VIRTUAL MACHINE NAME: Contoso-DNS-US
	- REGION/AFFINITY GROUP/VIRTUAL NETWORK: Select Contoso-VNET-US
	- VIRTUAL NETWORK SUBNETS: Subnet-1
	- STORAGE ACCOUNT: Use an automatically generated storage account
	- ENDPOINTS: (select DNS)

##Set static IP addresses for the two virtual machines

DNS servers requires static IP addresses.  This step can't be done from the Azure portal. You will use Azure PowerShell.

**To configure static IP address for the two virtual machines**

1. Open Windows PowerShell ISE.
2. Run the following cmdlets.  

		Add-AzureAccount
		Select-AzureSubscription [YourAzureSubscriptionName]
		
		Get-AzureVM -ServiceName Contoso-DNS-EU -Name Contoso-DNS-EU | Set-AzureStaticVNetIP -IPAddress 10.1.0.4 | Update-AzureVM
		Get-AzureVM -ServiceName Contoso-DNS-US -Name Contoso-DNS-US | Set-AzureStaticVNetIP -IPAddress 10.2.0.4 | Update-AzureVM 

	ServiceName is the cloud service name. Because the DNS server is the first virtual machine of the cloud service, the cloud service name is the same as the virtual machine name.

	You might need to update ServiceName and Name to match the names that you have.


##Add the DNS Server role the two virtual machines

**To add the DNS Server role for Contoso-DNS-EU**

1.	From the Azure portal, click **Virtual Machines** on the left. 
2.	Click **Contoso-DNS-EU**.
3.	Click **DASHBOARD** from the top.
4.	Click **CONNECT** from the bottom and follow the instructions to connect to the virtual machine via RDP.
2.	Within the RDP session, click the Windows button on the bottom left corner to open the Start screen.
3.	Click the **Server Manager** tile.
4.	Click **Add Roles and Features**.
5.	Click **Next**
6.	Select **Role-based or feature-based installation**, and then click **Next**.
7.	Select your DNS virtual machine (it shall be highlighted already), and then click **Next**.
8.	Check **DNS Server**.
9.	Click **Add Features**, and then click **Continue**.
10.	Click **Next** three times, and then click **Install**. 

**To add the DNS Server role for Contoso-DNS-US**

- Repeat the steps to add DNS role to **Contoso-DNS-US**.

##Assign DNS servers to the virtual networks

**To register the two DNS servers**

1.	From the Azure portal, click **NEW**, **NETWORK SERVICES**, **VIRTUAL NETWORK**, **REGISTER DNS SERVER**.
2.	Enter:
	- **NAME**: Contoso-DNS-EU
	- **DNS SERVER IP ADDRESS**: 10.1.0.4 – the IP address must matching the DNS server virtual machine IP address.
	 
3.	Repeat the process to register Contoso-DNS-US with the following settings:
	- **NAME**: Contoso-DNS-US
	- **DNS SERVER IP ADDRESS**: 10.2.0.4

**To assign the two DNS servers to the two virtual networks**

1.	Click **Networks** from the left pane in the Management portal.
2.	Click **Contoso-VNet-EU**.
3.	Click **CONFIGURE**.
4.	Select **Contoso-DNS-EU** in the **dns servers** section.
5.	Click **SAVE** on the bottom of the page, and click **Yes** to confirm.
6.	Repeat the process to assign the **Contoso-DNS-US** DNS server to the **Contoso-VNet-US** virtual network.

All the virtual machines that have been deployed to the virtual networks must be rebooted to update the DNS server configuration.

**To reboot the virtual machines**

1. From the Azure portal, click **Virtual Machines** on the left.
2. Click **Contoso-DNS-EU**.
3. Click **Dashboard** from the top.
4. Click **RESTART** on the bottom.
5. Repeat the same steps to reboot **Contoso-DNS-US**.


##Configure DNS conditional forwarders

The DNS server on each virtual network can only resolve DNS names within that virtual network. You need to configure a conditional forwarder to point to the peer DNS server for name resolutions in the peer virtual network.

To configure conditional forwarder, you need to know the domain suffixes of the two DNS servers. The DNS suffixes can be different depending on the Cloud Services configuration you used when you created the virtual machines. For each DNS suffix used in the virtual network, you must add a conditional forwarder. 

**To find the domain suffixes of the two DNS servers**

1. RDP into **Contoso-DNS-EU**.
2. Open Windows PowerShell console, or command prompt.
3. Run **ipconfig**, and write down **Connection-specific DNS suffix**.
4. Do not close the RDP session, you will still need it. 
5. Repeat the same steps to find out the **Connection-specific DNS suffix** of **Contoso-DNS-US**.


**To configure DNS forwarders**
 
1.	From the RDP session to **Contoso-DNS-EU**, click the Windows key on the lower left.
2.	Click **Administrative Tools**.
3.	Click **DNS**.
4.	In the left pane, expand **DSN**, **Contoso-DNS-EU**.
5.	Enter the following information:
	- **DNS Domain**: enter the DNS suffix of the Contoso-DNS-US. For example: Contoso-DNS-US.b5.internal.cloudapp.net.
	- **IP addresses of the master servers**: enter 10.2.0.4, which is the Contoso-DNS-US’s IP address.
6.	Press **ENTER**, and then click **OK**.  Now you will be able to resolve the Contoso-DNS-US’s IP address from Contoso-DNS-EU.
7.	Repeat the steps to add a DNS forwarder to the DNS service on the Contoso-DNS-US virtual machine with the following values:
	- **DNS Domain**: enter the DNS suffix of the Contoso-DNS-EU. 
	- **IP addresses of the master servers**: enter 10.2.0.4, which is the Contoso-DNS-EU’s IP address.

##Test the name resolution across the virtual networks

Now you can test host name resolution across the virtual networks. Ping is blocked by firewall by default.  You can use nslookup to resolve the DNS server virtual machines (you must use FQDN) in the peer networks.  


##Next Steps

In this tutorial, you have learned how to configure name resolution across virtual networks with VPN connections. The other two articles in the series cover:

- [Configure a VPN connection between two Azure virtual networks][hdinsight-hbase-geo-replication-vnet]
- [Configure HBase geo replication][hdinsight-hbase-geo-replication]



[hdinsight-hbase-geo-replication]: hdinsight-hbase-geo-replication.md
[hdinsight-hbase-geo-replication-vnet]: hdinsight-hbase-geo-replication-configure-VNets.md
[powershell-install]: install-configure-powershell.md

[img-vnet-diagram]: ./media/hdinsight-hbase-geo-replication-configure-DNS/HDInsight.HBase.VPN.diagram.png