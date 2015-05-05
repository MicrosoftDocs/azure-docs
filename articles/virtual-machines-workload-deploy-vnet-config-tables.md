<properties 
	pageTitle="Create a Cross-Premises Virtual Network Using Configuration Tables" 
	description="This topic describes how to configure a cross-premises virtual network using pre-determined configuration tables." 
	documentationCenter=""
	services="virtual-machines" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="josephd"/>

# Create a Cross-Premises Virtual Network Using Configuration Tables

This topic steps you through the creation of a cross-premises virtual network using settings previously specified in the following set of configuration tables:

- Table V: Cross-premises virtual network configuration
- Table S: Subnets in the virtual network
- Table D: On-premises DNS servers
- Table L: Address prefixes for the local network

These tables are typically filled out in a topic that describes the configuration of an IT workload in Azure and includes a cross-premises virtual network. See [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md) for an example.

The following procedure references the information in these tables to guide you through the virtual network configuration process. If you have not already specified the settings in these tables in another topic, but you still want to configure a cross-premises virtual network, see [Configure a Cross-Premises Site-to-Site connection to an Azure Virtual Network](https://msdn.microsoft.com/library/dn133795.aspx).

> [AZURE.NOTE] This procedure steps you through creating a virtual network that uses a site-to-site VPN connection. For information about using ExpressRoute for your site-to-site connection, see [ExpressRoute Technical Overview](https://msdn.microsoft.com/library/dn606309.aspx).
 
## Create a new cross-premises Azure Virtual Network with your configuration table settings

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com/).
2. From the task bar, click **New > Network Services > Virtual Network > Custom Create**.
3. On the Virtual Network Details page:
- In **Name**, type the name from Item 1 in Table V.
- In **Location**, select the region from Item 2 in Table V. 
4. Click the next arrow to continue.
5. On the DNS Servers and VPN Connectivity page:
- In **DNS Servers**, for each entry in Table D, configure the friendly name and IP address of your on-premises DNS servers.
- In **Site-To-Site Connectivity**, select **Configure a site-to-site VPN**.
- If you have already configured a local network and want to use it, select its name in **Local Network**. If you want to create a new local network, select **Specify a New Local Network** in **Local Network**.
- If you have not already configured a local network for your subscription, you will not see the **Local Network** field. 
6. Click the next arrow to continue.
7. On the Site-to-Site Connectivity page (if you selected **Specify a New Local Network** in step 5):
- In **Name**, type the name from Item 3 in Table V (the local network name).
- In **VPN Device IP Address**, type the address from Item 4 in Table V.
- In **Address Space**, for each entry in Table L, enter the IP address spaces of your organization network in terms of the prefix (in **Starting IP**) and the prefix length (in **CIDR (Address Count)**).
8. Click the next arrow to continue.
9. On the Virtual Network Address Spaces page:
- In **Address Space**, enter the private IP address space of the virtual network from Item 5 in Table V, in terms of the prefix (in **Starting IP**) and the prefix length (in **CIDR (Address Count)**).
- In **Subnets**, for each entry in Table S:
	- Type the name of the subnet in the **Subnets** column, overwriting the default name if needed.
	- Type the private IP address space of the subnet, in terms of the prefix (in **Starting IP**) and the prefix length (in **CIDR (Address Count)**).
- Click **Add Gateway Subnet**.
10. Click the check mark to complete the configuration.

## Additional Resources

[Virtual Network Overview](https://msdn.microsoft.com/library/jj156007.aspx)

[Virtual Network Configuration Tasks](https://msdn.microsoft.com/library/jj156206.aspx)

[Configure a Cross-Premises Site-to-Site connection to an Azure Virtual Network](https://msdn.microsoft.com/library/dn133795.aspx)
