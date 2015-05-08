<properties 
   pageTitle="Configure VPN connection between two virtual networks | Microsoft Azure" 
   description="Learn how to configure VPN connections and domain name resolution between two Azure virtual networks, and how to configure HBase geo-replication." 
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

# Configure a VPN connection between two Azure virtual networks  

> [AZURE.SELECTOR]
- [Configure VPN connectivity](hdinsight-hbase-geo-replication-configure-VNETs.md)
- [Configure DNS](hdinsight-hbase-geo-replication-configure-DNS.md)
- [Configure HBase replication](hdinsight-hbase-geo-replication.md) 

Azure virtual network site-to-site connectivity uses a VPN gateway to provide a secure tunnel using Ipsec/IKE. The VNets can be in different subscriptions and different regions. You can even combine VNet to VNet communication with multi-site configurations. There are several reasons for VNet to VNet connectivity:

- Cross region geo-redundancy and geo-presence 
- Regional multi-tier applications with strong isolation boundary 
- Cross subscription, inter-organization communication in Azure

For more information, see [Configure a VNet to VNet connection](https://msdn.microsoft.com/library/azure/dn690122.aspx).

This tutorial is a part of the [series][hdinsight-hbase-replication] on creating HBase geo-replication. 

- Configure a VPN connectivity between two virtual networks (this tutorial)
- [Configure DNS for the virtual networks] [hdinsight-hbase-geo-replication-DNS]
- [Configure HBase geo replication][hdinsight-hbase-geo-replication]

The following diagram illustrates the two virtual networks you will create in this tutorial:

![HDInsight HBase replication virtual network diagram][img-vnet-diagram]
 

##Prerequisites
Before you begin this tutorial, you must have the following:

- **An Azure subscription**. Azure is a subscription-based platform. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

- **A workstation with Azure PowerShell installed and configured**. For instructions, see [Install and configure Azure PowerShell][powershell-install]. 

	Before running PowerShell scripts, make sure you are connected to your Azure subscription using the following cmdlet:

		Add-AzureAccount

	If you have multiple Azure subscriptions, use the following cmdlet to set the current subscription:

		Select-AzureSubscription <AzureSubscriptionName>


>[AZURE.NOTE] Azure service names and virtual machine names must be unique. The name used in this tutorial is Contoso-[Azure Service/VM name]-[EU/US]. For example, Contoso-VNet-EU is the Azure virtual network in the North Europe data center; Contoso-DNS-US is the DNS server VM in the East U.S. datacenter. You must come up with your own names.
 

##Create two Azure VNets



**To create a virtual network called Contoso-VNet-EU in North-Europe**

1.	Sign in to the [Azure portal][azure-portal].
2.	Click **NEW**, **NETWORK SERVICES**, **VIRTUAL NETWORK**, **CUSTOM CREATE**.
3.	Enter:

	- **NAME**: Contoso-VNet-EU
	- **LOCATION**: North Europe

		This tutorial uses North Europe and East US datacenters. You can choose your own datacenters.
4.	Enter:

	- **DNS SERVER**: (Leave it blank) 
	
		You will need your own DNS server for name resolution within virtual networks. For more information on when to use Azure-provided name resolution and when to use your own DNS server, see [Name Resolution (DNS)](https://msdn.microsoft.com/library/azure/jj156088.aspx). For instructions to configure name resolution between VNets, see [Configure DNS between two Azure virtual networks][hdinsight-hbase-dns].
  
	- **Configure a point-to-site VPN**: (unchecked)

		Point-to-site doesn't apply to this scenario.

 	- **Configure a site-to-site VPN**: (unchecked)
 	
		You will configure the site-to-site VPN connection to the Azure virtual network in the East U.S. datacenter.
5.	Enter:

	- 	**ADDRESS SPACE STARTING IP**: 10.1.0.0
	- 	**ADDRESS SPACE CIDR**: /16
	- 	**Subnet-1 STARTING IP**: 10.1.0.0
	- 	**Subnet-1 CIDR**: /24

	The address space can not overlap with the U.S. virtual network.  

**To create a virtual network called Contoso-VNet-EU in West-Europe**

- Repeat the last procedure with the following values:

	- **NAME**: Contoso-VNet-US
	- **LOCATION**: East US
	 
	- **DNS SERVER**: (leave it blank)
	- **Configure a point-to-site VPN**: (unchecked)
	- **Configure a site-to-site VPN**: (unchecked)
	 
	- **ADDRESS SPACE STARTING IP**: 10.2.0.0
	- **ADDRESS SPACE CIDR**: /16
	- **Subnet-1 STARTING IP**: 10.2.0.0
	- **Subnet-1 CIDR**: /24

















##Configure a VPN connection between the two VNets

###Create local networks

When you create a VNet to VNet configuration, you need to configure each VNet to identify each other as a local network site. In this section, you’ll configure each VNet as a local network. The local networks share the same IP address spaces with the corresponding VNet.

![Configure Azure VPN site-to-site configuration - azure local networks][img-vnet-lnet-diagram]


**To create a local network called Contoso-LNet-EU matching the Contoso-VNet-EU network address space**

1. From the Azure portal, click **NEW**, **NETWORK SERVICES**, **VIRTUAL NETWORK**, **ADD LOCAL NETWORK**.
3. Enter:

	- **NAME**: Contoso-LNet-EU
	- **VPN DEVICE IP ADDRESS**: 192.168.0.1 (this address will be updated later)

		Typically, you’d use the actual external IP address for a VPN device. For VNet to VNet configurations, you will use the VPN gateway IP address. Given that you have not created the VPN gateways for the two VNets yet, you enter an arbitary IP address and come back to fix it.
4.	Enter:

	- **ADDRESS SPACE STARTING IP:** 10.1.0.0
	- **ADDRESS SPACE CIDR:** /16
	
	This must correspond exactly to the range that you specified earlier for Contoso-VNet-EU.

**To create a local network called Contoso-LNet-US matching the Contoso-VNet-US network address space**

- Repeat the last procedure with the following parameters:

	- **NAME**: Contoso-LNet-US
	- **VPN DEVICE IP ADDRESS**: 192.168.0.1 (this address will be updated later)
	 
	- **ADDRESS SPACE STARTING IP**: 10.2.0.0
	- **ADDRESS SPACE CIDR**: /16


###Create VPN gateways

There are two parts in this configuration. First you configure a VNet site-to-site connection to a local network, and then you create a dynamic routing VPN. VNet to VNet requires Azure VPN gateways with dynamic routing VPNs. Azure static routing VPNs are not supported.

**To configure the Contoso-VNet-EU site-to-site connection to Contoso-LNet-US**

1.	From the Azure portal, click **NETWORKS** on the left pane,
2.	Click **Contoso-VNet-EU**.
3.	Click the **CONFIGUE** tab.
4.	Check **Connect to local network**.
5.	In **LOCAL NETWORK**, select **Contoso-LNet-US**.
6.	Click **Add gateway subnet** in the virtual network address spaces section.
7.	Click **SAVE**.
8.	Click **OK** to confirm.


**To create a VPN gateway for Contoso-VNet-EU**

1.	From the Azure portal, click the **DASHBOARD** tab.
4.	Click **CREATE GATEWAY** on the bottom of the page, and then click **Dynamic Routing**.
5.	Click **Yes** to confirm. Notice the gateway graphic on the page changes to yellow and says Creating Gateway. It typically takes about 15 minutes for the gateway to create.

	When the gateway status changes to Connecting, the IP address for each Gateway will be visible in the Dashboard. Write down the IP address that corresponds to each VNet, taking care not to mix them up. These are the IP addresses that will be used when you edit your placeholder IP addresses for the VPN Device in Local Networks.

6.	Make a copy of the **GATEWAY IP ADDRESS**. You will use it to configure the VPN gateway IP address for Contoso-VNet-EU in the next section.

**To create a VPN gateway for Contoso-VNet-EU**

- Repeat the last two procedure to configure the Contoso-VNet-US site-to-site connectivity to Contoso-LNet-EU, and the creat a VPN gateway for Contoso-Vnet-US. When you are done, you will have the VPN gateway IP address for Contoso-VNet-US.


### Set the VPN device IP addresses for local networks
In the last section, you create a VPN gateway for each of the VNets. You have got the IP addresses of the VPN gateways. Now you can go back to configure local network VPN device IP addresses.

**To configure the VPN device IP address for Contoso-LNet-EU** 

1.	From the Azure portal, click **NETWORKS** on the left pane.
2.	Click **LOCAL NETWORKS** from the top.
3.	Click **Contoso-LNet-EU**, and then click **EDIT** on the bottom.
4.	Update **VPN DEVICE IP ADDRESS**.  This is the address you get from the DASHBOARD tab of Contoso-VNET-EU.
5.	Click the right button.
6.	Click the check button.

**To configure the VPN device IP address for Contoso-LNet-US** 

- Repeat the last procedure to configure the VPN device IP address for Contoso-LNet-US.

###Set VNet gateway keys

The Vnet gateways use a shared key to authenticate connections between the virtual networks. The key can't be configured from the Azure portal. You must use PowerShell or .NET SDK.

**To set the keys**

1. From your workstation, open **Windows PowerShell ISE** or the Windows PowerShell console.
2. Update the parameters in this follow script and run it:

		Add-AuzreAccount
		Select-AzureSubscription -[AzureSubscriptionName]
		Set-AzureVNetGatewayKey -VNetName ContosoVNet-EU -LocalNetworkSiteName Contoso-LNet-US -SharedKey A1b2C3D4
		Set-AzureVNetGatewayKey -VNetName ContosoVNet-US -LocalNetworkSiteName Contoso-LNet-EU -SharedKey A1b2C3D4 


##Check the VPN connection 

Without any VMs deployed to the VNets, you can use the virtual network visual diagram the VNet Dashboard page on the Azure portal to check the connection status:

![HDInsight HBase replication virtual network VPN connection status][img-vpn-status]
  



##Next Steps

In this tutorial you have learned how to configure a VPN connection between two Azure virtual networks. The other two articles in the series cover:

- [Configure DNS between two Azure virtual networks][hdinsight-hbase-geo-replication-dns]
- [Configure HBase geo replication][hdinsight-hbase-geo-replication]



[hdinsight-hbase-geo-replication-dns]: hdinsight-hbase-geo-replication-configure-DNS.md
[hdinsight-hbase-geo-replication]: hdinsight-hbase-geo-replication.md


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-portal]: http://manage.windowsazure.com


[powershell-install]: ../install-configure-powershell



[hdinsight-hbase-replication]: ../hdinsight-hbase-geo-replication/
[hdinsight-hbase-dns]: ../hdinsight-hbase-geo-replication-configure-DNS/


[img-vnet-diagram]: ./media/hdinsight-hbase-geo-replication-configure-VNets/HDInsight.HBase.VPN.diagram.png
[img-vnet-lnet-diagram]: ./media/hdinsight-hbase-geo-replication-configure-VNets/HDInsight.HBase.VPN.LNet.diagram.png
[img-vpn-status]: ./media/hdinsight-hbase-geo-replication-configure-VNets/HDInsight.HBase.VPN.status.png