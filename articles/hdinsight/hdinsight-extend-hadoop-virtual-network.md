---
title: Extend HDInsight with Virtual Network - Azure
description: Learn how to use Azure Virtual Network to connect HDInsight to other cloud resources, or resources in your datacenter
author: hrasheed-msft
ms.author: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 07/10/2019
---

# Extend Azure HDInsight using an Azure Virtual Network

Learn how to use HDInsight with an [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). Using an Azure Virtual Network enables the following scenarios:

* Connecting to HDInsight directly from an on-premises network.

* Connecting HDInsight to data stores in an Azure Virtual network.

* Directly accessing [Apache Hadoop](https://hadoop.apache.org/) services that are not available publicly over the internet. For example, [Apache Kafka](https://kafka.apache.org/) APIs or the [Apache HBase](https://hbase.apache.org/) Java API.

> [!IMPORTANT]  
> Creating an HDInsight cluster in a VNET will create several networking resources, such as NICs and load balancers. Do **not** delete these networking resources, as they are needed for your cluster to function correctly with the VNET.
>
> After Feb 28, 2019, these networking resources (such as NICs, LBs, etc) for NEW clusters created in a VNET will be provisioned in the same HDInsight cluster resource group. Previously, these resources were provisioned in the VNET resource group. There is no change to the current running clusters and those clusters created without a VNET.

## Prerequisites for code samples and examples

* An understanding of TCP/IP networking. If you are not familiar with TCP/IP networking, you should partner with someone who is before making modifications to production networks.
* If using PowerShell, you will need the [AZ Module](https://docs.microsoft.com/powershell/azure/overview).
* If wanting to use Azure CLI and you have not yet installed it, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

> [!IMPORTANT]  
> If you are looking for step by step guidance on connecting HDInsight to your on-premises network using an Azure Virtual Network, see the [Connect HDInsight to your on-premises network](connect-on-premises-network.md) document.

## Planning

The following are the questions that you must answer when planning to install HDInsight in a virtual network:

* Do you need to install HDInsight into an existing virtual network? Or are you creating a new network?

    If you are using an existing virtual network, you may need to modify the network configuration before you can install HDInsight. For more information, see the [add HDInsight to an existing virtual network](#existingvnet) section.

* Do you want to connect the virtual network containing HDInsight to another virtual network or your on-premises network?

    To easily work with resources across networks, you may need to create a custom DNS and configure DNS forwarding. For more information, see the [connecting multiple networks](#multinet) section.

* Do you want to restrict/redirect inbound or outbound traffic to HDInsight?

    HDInsight must have unrestricted communication with specific IP addresses in the Azure data center. There are also several ports that must be allowed through firewalls for client communication. For more information, see the [controlling network traffic](#networktraffic) section.

## <a id="existingvnet"></a>Add HDInsight to an existing virtual network

Use the steps in this section to discover how to add a new HDInsight to an existing Azure Virtual Network.

> [!NOTE]  
> You cannot add an existing HDInsight cluster into a virtual network.

1. Are you using a classic or Resource Manager deployment model for the virtual network?

    HDInsight 3.4 and greater requires a Resource Manager virtual network. Earlier versions of HDInsight required a classic virtual network.

    If your existing network is a classic virtual network, then you must create a Resource Manager virtual network and then connect the two. [Connecting classic VNets to new VNets](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md).

    Once joined, HDInsight installed in the Resource Manager network can interact with resources in the classic network.

2. Do you use network security groups, user-defined routes, or Virtual Network Appliances to restrict traffic into or out of the virtual network?

    As a managed service, HDInsight requires unrestricted access to several IP addresses in the Azure data center. To allow communication with these IP addresses, update any existing network security groups or user-defined routes.
    
    HDInsight  hosts multiple services, which use a variety of ports. Do not block traffic to these ports. For a list of ports to allow through virtual appliance firewalls, see the Security section.
    
    To find your existing security configuration, use the following Azure PowerShell or Azure CLI commands:

    * Network security groups

        Replace `RESOURCEGROUP` with the name of the resource group that contains the virtual network, and then enter the command:
    
        ```powershell
        Get-AzNetworkSecurityGroup -ResourceGroupName  "RESOURCEGROUP"
        ```
    
        ```azurecli
        az network nsg list --resource-group RESOURCEGROUP
        ```

        For more information, see the [Troubleshoot network security groups](../virtual-network/diagnose-network-traffic-filter-problem.md) document.

        > [!IMPORTANT]  
        > Network security group rules are applied in order based on rule priority. The first rule that matches the traffic pattern is applied, and no others are applied for that traffic. Order rules from most permissive to least permissive. For more information, see the [Filter network traffic with network security groups](../virtual-network/security-overview.md) document.

    * User-defined routes

        Replace `RESOURCEGROUP` with the name of the resource group that contains the virtual network, and then enter the command:

        ```powershell
        Get-AzRouteTable -ResourceGroupName "RESOURCEGROUP"
        ```

        ```azurecli
        az network route-table list --resource-group RESOURCEGROUP
        ```

        For more information, see the [Troubleshoot routes](../virtual-network/diagnose-network-routing-problem.md) document.

3. Create an HDInsight cluster and select the Azure Virtual Network during configuration. Use the steps in the following documents to understand the cluster creation process:

    * [Create HDInsight using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md)
    * [Create HDInsight using Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
    * [Create HDInsight using Azure Classic CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md)
    * [Create HDInsight using an Azure Resource Manager template](hdinsight-hadoop-create-linux-clusters-arm-templates.md)

   > [!IMPORTANT]  
   > Adding HDInsight to a virtual network is an optional configuration step. Be sure to select the virtual network when configuring the cluster.

## <a id="multinet"></a>Connecting multiple networks

The biggest challenge with a multi-network configuration is name resolution between the networks.

Azure provides name resolution for Azure services that are installed in a virtual network. This built-in name resolution allows HDInsight to connect to the following resources by using a fully qualified domain name (FQDN):

* Any resource that is available on the internet. For example, microsoft.com, windowsupdate.com.

* Any resource that is in the same Azure Virtual Network, by using the __internal DNS name__ of the resource. For example, when using the default name resolution, the following are example internal DNS names assigned to HDInsight worker nodes:

  * wn0-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net
  * wn2-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net

    Both these nodes can communicate directly with each other, and other nodes in HDInsight, by using internal DNS names.

The default name resolution does __not__ allow HDInsight to resolve the names of resources in networks that are joined to the virtual network. For example, it is common to join your on-premises network to the virtual network. With only the default name resolution, HDInsight cannot access resources in the on-premises network by name. The opposite is also true, resources in your on-premises network cannot access resources in the virtual network by name.

> [!WARNING]  
> You must create the custom DNS server and configure the virtual network to use it before creating the HDInsight cluster.

To enable name resolution between the virtual network and resources in joined networks, you must perform the following actions:

1. Create a custom DNS server in the Azure Virtual Network where you plan to install HDInsight.

2. Configure the virtual network to use the custom DNS server.

3. Find the Azure assigned DNS suffix for your virtual network. This value is similar to `0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net`. For information on finding the DNS suffix, see the [Example: Custom DNS](#example-dns) section.

4. Configure forwarding between the DNS servers. The configuration depends on the type of remote network.

   * If the remote network is an on-premises network, configure DNS as follows:
        
     * __Custom DNS__ (in the virtual network):

         * Forward requests for the DNS suffix of the virtual network to the Azure recursive resolver (168.63.129.16). Azure handles requests for resources in the virtual network

         * Forward all other requests to the on-premises DNS server. The on-premises DNS handles all other name resolution requests, even requests for internet resources such as Microsoft.com.

     * __On-premises DNS__: Forward requests for the virtual network DNS suffix to the custom DNS server. The custom DNS server then forwards to the Azure recursive resolver.

       This configuration routes requests for fully qualified domain names that contain the DNS suffix of the virtual network to the custom DNS server. All other requests (even for public internet addresses) are handled by the on-premises DNS server.

   * If the remote network is another Azure Virtual Network, configure DNS as follows:

     * __Custom DNS__ (in each virtual network):

         * Requests for the DNS suffix of the virtual networks are forwarded to the custom DNS servers. The DNS in each virtual network is responsible for resolving resources within its network.

         * Forward all other requests to the Azure recursive resolver. The recursive resolver is responsible for resolving local and internet resources.

       The DNS server for each network forwards requests to the other, based on DNS suffix. Other requests are resolved using the Azure recursive resolver.

     For an example of each configuration, see the [Example: Custom DNS](#example-dns) section.

For more information, see the [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document.

## Directly connect to Apache Hadoop services

You can connect to the cluster at `https://CLUSTERNAME.azurehdinsight.net`. This address uses a public IP, which may not be reachable if you have used NSGs to restrict incoming traffic from the internet. Additionally, when you deploy the cluster in a VNet you can access it using the private endpoint `https://CLUSTERNAME-int.azurehdinsight.net`. This endpoint resolves to a private IP inside the VNet for cluster access.

To connect to Apache Ambari and other web pages through the virtual network, use the following steps:

1. To discover the internal fully qualified domain names (FQDN) of the HDInsight cluster nodes, use one of the following methods:

    Replace `RESOURCEGROUP` with the name of the resource group that contains the virtual network, and then enter the command:

	```powershell
	$clusterNICs = Get-AzNetworkInterface -ResourceGroupName "RESOURCEGROUP" | where-object {$_.Name -like "*node*"}

	$nodes = @()
	foreach($nic in $clusterNICs) {
		$node = new-object System.Object
		$node | add-member -MemberType NoteProperty -name "Type" -value $nic.Name.Split('-')[1]
		$node | add-member -MemberType NoteProperty -name "InternalIP" -value $nic.IpConfigurations.PrivateIpAddress
		$node | add-member -MemberType NoteProperty -name "InternalFQDN" -value $nic.DnsSettings.InternalFqdn
		$nodes += $node
	}
	$nodes | sort-object Type
    ```

	```azurecli
	az network nic list --resource-group RESOURCEGROUP --output table --query "[?contains(name,'node')].{NICname:name,InternalIP:ipConfigurations[0].privateIpAddress,InternalFQDN:dnsSettings.internalFqdn}"
    ```

    In the list of nodes returned, find the FQDN for the head nodes and use the FQDNs to connect to Ambari and other web services. For example, use `http://<headnode-fqdn>:8080` to access Ambari.

    > [!IMPORTANT]  
    > Some services hosted on the head nodes are only active on one node at a time. If you try accessing a service on one head node and it returns a 404 error, switch to the other head node.

2. To determine the node and port that a service is available on, see the [Ports used by Hadoop services on HDInsight](./hdinsight-hadoop-port-settings-for-services.md) document.

## <a id="networktraffic"></a> Controlling network traffic

### Techniques for controlling inbound and outbound traffic to HDInsight clusters

Network traffic in an Azure Virtual Networks can be controlled using the following methods:

* **Network security groups** (NSG) allow you to filter inbound and outbound traffic to the network. For more information, see the [Filter network traffic with network security groups](../virtual-network/security-overview.md) document.

* **Network virtual appliances** (NVA) can be used with outbound traffic only. NVAs replicate the functionality of devices such as firewalls and routers.  For more information, see the [Network Appliances](https://azure.microsoft.com/solutions/network-appliances) document.

As a managed service, HDInsight requires unrestricted access to the HDInsight health and management services both for incoming and outgoing traffic from the VNET. When using NSGs, you must ensure that these services can still communicate with HDInsight cluster.

![Diagram of HDInsight entities created in Azure custom VNET](./media/hdinsight-virtual-network-architecture/vnet-diagram.png)

### HDInsight with network security groups

If you plan on using **network security groups** to control network traffic, perform the following actions before installing HDInsight:

1. Identify the Azure region that you plan to use for HDInsight.

2. Identify the IP addresses required by HDInsight. For more information, see the [IP Addresses required by HDInsight](#hdinsight-ip) section.

3. Create or modify the network security groups for the subnet that you plan to install HDInsight into.

    * __Network security groups__: allow __inbound__ traffic on port __443__ from the IP addresses. This will ensure that HDInsight management services can reach the cluster from outside the virtual network.

For more information on network security groups, see the [overview of network security groups](../virtual-network/security-overview.md).

### Controlling outbound traffic from HDInsight clusters

For more information on controlling outbound traffic from HDInsight clusters, see [Configure outbound network traffic restriction for Azure HDInsight clusters](hdinsight-restrict-outbound-traffic.md).

#### Forced tunneling to on-premise

Forced tunneling is a user-defined routing configuration where all traffic from a subnet is forced to a specific network or location, such as your on-premises network. HDInsight does __not__ support forced tunneling of traffic to on-premises networks. 

## <a id="hdinsight-ip"></a> Required IP addresses

If you use network security groups or user defined routes to control traffic, you must allow traffic from the IP addresses for Azure health and management services so that they can communicate with your HDInsight cluster. Some of the IP addresses are region specific, and some of them apply to all Azure regions. You may also need to allow traffic from the Azure DNS service if you aren't using custom DNS. You must also allow traffic between VMs inside the subnet. Use the following steps to find the IP addresses that must be allowed:

> [!Note]  
> If you do not use network security groups or user-defined routes to control traffic, you can ignore this section.

1. If you are using the Azure-provided DNS service, allow access from __168.63.129.16__ on port 53. For more information, see the [Name resolution for VMs and Role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document. If you are using custom DNS, skip this step.

2. Allow traffic from the following IP addresses for Azure health and management services which apply to all Azure regions:

    | Source IP address | Destination  | Direction |
    | ---- | ----- | ----- |
    | 168.61.49.99 | \*:443 | Inbound |
    | 23.99.5.239 | \*:443 | Inbound |
    | 168.61.48.131 | \*:443 | Inbound |
    | 138.91.141.162 | \*:443 | Inbound |

3. Allow traffic from the IP addresses listed for the Azure health and management services in the specific region where your resources are located:

    > [!IMPORTANT]  
    > If the Azure region you are using is not listed, then only use the four IP addresses from step 1.

    | Country | Region | Allowed Source IP addresses | Allowed Destination | Direction |
    | ---- | ---- | ---- | ---- | ----- |
    | Asia | East Asia | 23.102.235.122</br>52.175.38.134 | \*:443 | Inbound |
    | &nbsp; | Southeast Asia | 13.76.245.160</br>13.76.136.249 | \*:443 | Inbound |
    | Australia | Australia East | 104.210.84.115</br>13.75.152.195 | \*:443 | Inbound |
    | &nbsp; | Australia Southeast | 13.77.2.56</br>13.77.2.94 | \*:443 | Inbound |
    | Brazil | Brazil South | 191.235.84.104</br>191.235.87.113 | \*:443 | Inbound |
    | Canada | Canada East | 52.229.127.96</br>52.229.123.172 | \*:443 | Inbound |
    | &nbsp; | Canada Central | 52.228.37.66</br>52.228.45.222 |\*: 443 | Inbound |
    | China | China North | 42.159.96.170</br>139.217.2.219</br></br>42.159.198.178</br>42.159.234.157 | \*:443 | Inbound |
    | &nbsp; | China East | 42.159.198.178</br>42.159.234.157</br></br>42.159.96.170</br>139.217.2.219 | \*:443 | Inbound |
    | &nbsp; | China North 2 | 40.73.37.141</br>40.73.38.172 | \*:443 | Inbound |
    | &nbsp; | China East 2 | 139.217.227.106</br>139.217.228.187 | \*:443 | Inbound |
    | Europe | North Europe | 52.164.210.96</br>13.74.153.132 | \*:443 | Inbound |
    | &nbsp; | West Europe| 52.166.243.90</br>52.174.36.244 | \*:443 | Inbound |
    | France | France Central| 20.188.39.64</br>40.89.157.135 | \*:443 | Inbound |
    | Germany | Germany Central | 51.4.146.68</br>51.4.146.80 | \*:443 | Inbound |
    | &nbsp; | Germany Northeast | 51.5.150.132</br>51.5.144.101 | \*:443 | Inbound |
    | India | Central India | 52.172.153.209</br>52.172.152.49 | \*:443 | Inbound |
    | &nbsp; | South India | 104.211.223.67<br/>104.211.216.210 | \*:443 | Inbound |
    | Japan | Japan East | 13.78.125.90</br>13.78.89.60 | \*:443 | Inbound |
    | &nbsp; | Japan West | 40.74.125.69</br>138.91.29.150 | \*:443 | Inbound |
    | Korea | Korea Central | 52.231.39.142</br>52.231.36.209 | \*:443 | Inbound |
    | &nbsp; | Korea South | 52.231.203.16</br>52.231.205.214 | \*:443 | Inbound
    | United Kingdom | UK West | 51.141.13.110</br>51.141.7.20 | \*:443 | Inbound |
    | &nbsp; | UK South | 51.140.47.39</br>51.140.52.16 | \*:443 | Inbound |
    | United States | Central US | 13.89.171.122</br>13.89.171.124 | \*:443 | Inbound |
    | &nbsp; | East US | 13.82.225.233</br>40.71.175.99 | \*:443 | Inbound |
    | &nbsp; | North Central US | 157.56.8.38</br>157.55.213.99 | \*:443 | Inbound |
    | &nbsp; | West Central US | 52.161.23.15</br>52.161.10.167 | \*:443 | Inbound |
    | &nbsp; | West US | 13.64.254.98</br>23.101.196.19 | \*:443 | Inbound |
    | &nbsp; | West US 2 | 52.175.211.210</br>52.175.222.222 | \*:443 | Inbound |

    For information on the IP addresses to use for Azure Government, see the [Azure Government Intelligence + Analytics](https://docs.microsoft.com/azure/azure-government/documentation-government-services-intelligenceandanalytics) document.

For more information, see the [Controlling network traffic](#networktraffic) section.

If you are using user-defined routes(UDRs), you should specify a route and allow outbound traffic from the VNET to the above IPs with the next hop set to "Internet".
    
## <a id="hdinsight-ports"></a> Required ports

If you plan on using a **firewall** and access the cluster from outside on certain ports, you might need to allow traffic on those ports needed for your scenario. By default, no special whitelisting of ports is needed as long as the azure management traffic explained in the previous section is allowed to reach cluster on port 443.

For a list of ports for specific services, see the [Ports used by Apache Hadoop services on HDInsight](hdinsight-hadoop-port-settings-for-services.md) document.

For more information on firewall rules for virtual appliances, see the [virtual appliance scenario](../virtual-network/virtual-network-scenario-udr-gw-nva.md) document.

## <a id="hdinsight-nsg"></a>Example: network security groups with HDInsight

The examples in this section demonstrate how to create network security group rules that allow HDInsight to communicate with the Azure management services. Before using the examples, adjust the IP addresses to match the ones for the Azure region you are using. You can find this information in the [HDInsight with network security groups and user-defined routes](#hdinsight-ip) section.

### Azure Resource Management template

The following Resource Management template creates a virtual network that restricts inbound traffic, but allows traffic from the IP addresses required by HDInsight. This template also creates an HDInsight cluster in the virtual network.

* [Deploy a secured Azure Virtual Network and an HDInsight Hadoop cluster](https://azure.microsoft.com/resources/templates/101-hdinsight-secure-vnet/)

### Azure PowerShell

Use the following PowerShell script to create a virtual network that restricts inbound traffic and allows traffic from the IP addresses for the North Europe region.

> [!IMPORTANT]  
> Change the IP addresses for `hdirule1` and `hdirule2` in this example to match the Azure region you are using. You can find this information in the [HDInsight with network security groups and user-defined routes](#hdinsight-ip) section.

```powershell
$vnetName = "Replace with your virtual network name"
$resourceGroupName = "Replace with the resource group the virtual network is in"
$subnetName = "Replace with the name of the subnet that you plan to use for HDInsight"

# Get the Virtual Network object
$vnet = Get-AzVirtualNetwork `
    -Name $vnetName `
    -ResourceGroupName $resourceGroupName

# Get the region the Virtual network is in.
$location = $vnet.Location

# Get the subnet object
$subnet = $vnet.Subnets | Where-Object Name -eq $subnetName

# Create a Network Security Group.
# And add exemptions for the HDInsight health and management services.
$nsg = New-AzNetworkSecurityGroup `
    -Name "hdisecure" `
    -ResourceGroupName $resourceGroupName `
    -Location $location `
    | Add-AzNetworkSecurityRuleConfig `
        -name "hdirule1" `
        -Description "HDI health and management address 52.164.210.96" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "52.164.210.96" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 300 `
        -Direction Inbound `
    | Add-AzNetworkSecurityRuleConfig `
        -Name "hdirule2" `
        -Description "HDI health and management 13.74.153.132" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "13.74.153.132" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 301 `
        -Direction Inbound `
    | Add-AzNetworkSecurityRuleConfig `
        -Name "hdirule3" `
        -Description "HDI health and management 168.61.49.99" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "168.61.49.99" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 302 `
        -Direction Inbound `
    | Add-AzNetworkSecurityRuleConfig `
        -Name "hdirule4" `
        -Description "HDI health and management 23.99.5.239" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "23.99.5.239" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 303 `
        -Direction Inbound `
    | Add-AzNetworkSecurityRuleConfig `
        -Name "hdirule5" `
        -Description "HDI health and management 168.61.48.131" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "168.61.48.131" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 304 `
        -Direction Inbound `
    | Add-AzNetworkSecurityRuleConfig `
        -Name "hdirule6" `
        -Description "HDI health and management 138.91.141.162" `
        -Protocol "*" `
        -SourcePortRange "*" `
        -DestinationPortRange "443" `
        -SourceAddressPrefix "138.91.141.162" `
        -DestinationAddressPrefix "VirtualNetwork" `
        -Access Allow `
        -Priority 305 `
        -Direction Inbound `

# Set the changes to the security group
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

# Apply the NSG to the subnet
Set-AzVirtualNetworkSubnetConfig `
    -VirtualNetwork $vnet `
    -Name $subnetName `
    -AddressPrefix $subnet.AddressPrefix `
    -NetworkSecurityGroup $nsg
$vnet | Set-AzVirtualNetwork
```

This example demonstrates how to add rules to allow inbound traffic on the required IP addresses. It does not contain a rule to restrict inbound access from other sources. The following code demonstrates how to enable SSH access from the Internet:

```powershell
Get-AzNetworkSecurityGroup -Name hdisecure -ResourceGroupName RESOURCEGROUP |
Add-AzNetworkSecurityRuleConfig -Name "SSH" -Description "SSH" -Protocol "*" -SourcePortRange "*" -DestinationPortRange "22" -SourceAddressPrefix "*" -DestinationAddressPrefix "VirtualNetwork" -Access Allow -Priority 306 -Direction Inbound
```

### Azure CLI

Use the following steps to create a virtual network that restricts inbound traffic, but allows traffic from the IP addresses required by HDInsight.

1. Use the following command to create a new network security group named `hdisecure`. Replace `RESOURCEGROUP` with the resource group that contains the Azure Virtual Network. Replace `LOCATION` with the location (region) that the group was created in.

    ```azurecli
    az network nsg create -g RESOURCEGROUP -n hdisecure -l LOCATION
    ```

    Once the group has been created, you receive information on the new group.

2. Use the following to add rules to the new network security group that allow inbound communication on port 443 from the Azure HDInsight health and management service. Replace `RESOURCEGROUP` with the name of the resource group that contains the Azure Virtual Network.

    > [!IMPORTANT]  
    > Change the IP addresses for `hdirule1` and `hdirule2` in this example to match the Azure region you are using. You can find this information in the [HDInsight with network security groups and user-defined routes](#hdinsight-ip) section.

    ```azurecli
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule1 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "52.164.210.96" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 300 --direction "Inbound"
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule2 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "13.74.153.132" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 301 --direction "Inbound"
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule3 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "168.61.49.99" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 302 --direction "Inbound"
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule4 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "23.99.5.239" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 303 --direction "Inbound"
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule5 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "168.61.48.131" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 304 --direction "Inbound"
    az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n hdirule6 --protocol "*" --source-port-range "*" --destination-port-range "443" --source-address-prefix "138.91.141.162" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 305 --direction "Inbound"
    ```

3. To retrieve the unique identifier for this network security group, use the following command:

    ```azurecli
    az network nsg show -g RESOURCEGROUP -n hdisecure --query "id"
    ```

    This command returns a value similar to the following text:

        "/subscriptions/SUBSCRIPTIONID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Network/networkSecurityGroups/hdisecure"

4. Use the following command to apply the network security group to a subnet. Replace the `GUID` and `RESOURCEGROUP` values with the ones returned from the previous step. Replace `VNETNAME` and `SUBNETNAME` with the virtual network name and subnet name that you want to create.

    ```azurecli
    az network vnet subnet update -g RESOURCEGROUP --vnet-name VNETNAME --name SUBNETNAME --set networkSecurityGroup.id="/subscriptions/GUID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Network/networkSecurityGroups/hdisecure"
    ```

    Once this command completes, you can install HDInsight into the Virtual Network.


These steps only open access to the HDInsight health and management service on the Azure cloud. Any other access to the HDInsight cluster from outside the Virtual Network is blocked. To enable access from outside the virtual network, you must add additional Network Security Group rules.

The following code demonstrates how to enable SSH access from the Internet:

```azurecli
az network nsg rule create -g RESOURCEGROUP --nsg-name hdisecure -n ssh --protocol "*" --source-port-range "*" --destination-port-range "22" --source-address-prefix "*" --destination-address-prefix "VirtualNetwork" --access "Allow" --priority 306 --direction "Inbound"
```

## <a id="example-dns"></a> Example: DNS configuration

### Name resolution between a virtual network and a connected on-premises network

This example makes the following assumptions:

* You have an Azure Virtual Network that is connected to an on-premises network using a VPN gateway.

* The custom DNS server in the virtual network is running Linux or Unix as the operating system.

* [Bind](https://www.isc.org/downloads/bind/) is installed on the custom DNS server.

On the custom DNS server in the virtual network:

1. Use either Azure PowerShell or Azure CLI to find the DNS suffix of the virtual network:

    Replace `RESOURCEGROUP` with the name of the resource group that contains the virtual network, and then enter the command:

    ```powershell
    $NICs = Get-AzNetworkInterface -ResourceGroupName "RESOURCEGROUP"
    $NICs[0].DnsSettings.InternalDomainNameSuffix
    ```

    ```azurecli
    az network nic list --resource-group RESOURCEGROUP --query "[0].dnsSettings.internalDomainNameSuffix"
    ```

2. On the custom DNS server for the virtual network, use the following text as the contents of the `/etc/bind/named.conf.local` file:

    ```
    // Forward requests for the virtual network suffix to Azure recursive resolver
    zone "0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net" {
        type forward;
        forwarders {168.63.129.16;}; # Azure recursive resolver
    };
    ```

    Replace the `0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net` value with the DNS suffix of your virtual network.

    This configuration routes all DNS requests for the DNS suffix of the virtual network to the Azure recursive resolver.

2. On the custom DNS server for the virtual network, use the following text as the contents of the `/etc/bind/named.conf.options` file:

    ```
    // Clients to accept requests from
    // TODO: Add the IP range of the joined network to this list
    acl goodclients {
        10.0.0.0/16; # IP address range of the virtual network
        localhost;
        localnets;
    };

    options {
            directory "/var/cache/bind";

            recursion yes;

            allow-query { goodclients; };

            # All other requests are sent to the following
            forwarders {
                192.168.0.1; # Replace with the IP address of your on-premises DNS server
            };

            dnssec-validation auto;

            auth-nxdomain no;    # conform to RFC1035
            listen-on { any; };
    };
    ```
    
    * Replace the `10.0.0.0/16` value with the IP address range of your virtual network. This entry allows name resolution requests addresses within this range.

    * Add the IP address range of the on-premises network to the `acl goodclients { ... }` section.  entry allows name resolution requests from resources in the on-premises network.
    
    * Replace the value `192.168.0.1` with the IP address of your on-premises DNS server. This entry routes all other DNS requests to the on-premises DNS server.

3. To use the configuration, restart Bind. For example, `sudo service bind9 restart`.

4. Add a conditional forwarder to the on-premises DNS server. Configure the conditional forwarder to send requests for the DNS suffix from step 1 to the custom DNS server.

    > [!NOTE]  
    > Consult the documentation for your DNS software for specifics on how to add a conditional forwarder.

After completing these steps, you can connect to resources in either network using fully qualified domain names (FQDN). You can now install HDInsight into the virtual network.

### Name resolution between two connected virtual networks

This example makes the following assumptions:

* You have two Azure Virtual Networks that are connected using either a VPN gateway or peering.

* The custom DNS server in both networks is running Linux or Unix as the operating system.

* [Bind](https://www.isc.org/downloads/bind/) is installed on the custom DNS servers.

1. Use either Azure PowerShell or Azure CLI to find the DNS suffix of both virtual networks:

    Replace `RESOURCEGROUP` with the name of the resource group that contains the virtual network, and then enter the command:

    ```powershell
    $NICs = Get-AzNetworkInterface -ResourceGroupName "RESOURCEGROUP"
    $NICs[0].DnsSettings.InternalDomainNameSuffix
    ```

    ```azurecli
    az network nic list --resource-group RESOURCEGROUP --query "[0].dnsSettings.internalDomainNameSuffix"
    ```

2. Use the following text as the contents of the `/etc/bind/named.config.local` file on the custom DNS server. Make this change on the custom DNS server in both virtual networks.

    ```
    // Forward requests for the virtual network suffix to Azure recursive resolver
    zone "0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net" {
        type forward;
	    forwarders {10.0.0.4;}; # The IP address of the DNS server in the other virtual network
    };
    ```

    Replace the `0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net` value with the DNS suffix of the __other__ virtual network. This entry routes requests for the DNS suffix of the remote network to the custom DNS in that network.

3. On the custom DNS servers in both virtual networks, use the following text as the contents of the `/etc/bind/named.conf.options` file:

    ```
    // Clients to accept requests from
    acl goodclients {
        10.1.0.0/16; # The IP address range of one virtual network
        10.0.0.0/16; # The IP address range of the other virtual network
        localhost;
        localnets;
    };

    options {
            directory "/var/cache/bind";

            recursion yes;

            allow-query { goodclients; };

            forwarders {
            168.63.129.16;   # Azure recursive resolver         
            };

            dnssec-validation auto;

            auth-nxdomain no;    # conform to RFC1035
            listen-on { any; };
    };
    ```
    
   Replace the `10.0.0.0/16` and `10.1.0.0/16` values with the IP address ranges of your virtual networks. This entry allows resources in each network to make requests of the DNS servers.

    Any requests that are not for the DNS suffixes of the virtual networks (for example, microsoft.com) is handled by the Azure recursive resolver.

4. To use the configuration, restart Bind. For example, `sudo service bind9 restart` on both DNS servers.

After completing these steps, you can connect to resources in the virtual network using fully qualified domain names (FQDN). You can now install HDInsight into the virtual network.

## Next steps

* For an end-to-end example of configuring HDInsight to connect to an on-premises network, see [Connect HDInsight to an on-premises network](./connect-on-premises-network.md).
* For configuring Apache HBase clusters in Azure virtual networks, see [Create Apache HBase clusters on HDInsight in Azure Virtual Network](hbase/apache-hbase-provision-vnet.md).
* For configuring Apache HBase geo-replication, see [Set up Apache HBase cluster replication in Azure virtual networks](hbase/apache-hbase-replication.md).
* For more information on Azure virtual networks, see the [Azure Virtual Network overview](../virtual-network/virtual-networks-overview.md).

* For more information on network security groups, see [Network security groups](../virtual-network/security-overview.md).

* For more information on user-defined routes, see [User-defined routes and IP forwarding](../virtual-network/virtual-networks-udr-overview.md).
