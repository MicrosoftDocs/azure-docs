---
title: Create virtual networks for Azure HDInsight clusters
description: Learn how to create an Azure Virtual Network to connect HDInsight to other cloud resources, or resources in your datacenter.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 04/16/2020
---

# Create virtual networks for Azure HDInsight clusters

This article provides examples and code samples for creating and configuring [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md). To use with Azure HDInsight clusters. Detailed examples of creating network security groups (NSGs) and configuring DNS are presented.

For background information on using virtual networks with Azure HDInsight, see [Plan a virtual network for Azure HDInsight](hdinsight-plan-virtual-network-deployment.md).

## Prerequisites for code samples and examples

Before executing any of the code samples in this article, have an understanding of TCP/IP networking. If you aren't familiar with TCP/IP networking, consult someone before making modifications to production networks.

Other prerequisites for the samples in this article include the following items:

* If you're using PowerShell, you'll need to install the [AZ Module](https://docs.microsoft.com/powershell/azure/overview).
* If you want to use Azure CLI and haven't yet installed it, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

> [!IMPORTANT]  
> If you are looking for step by step guidance on connecting HDInsight to your on-premises network using an Azure Virtual Network, see the [Connect HDInsight to your on-premises network](connect-on-premises-network.md) document.

## <a id="hdinsight-nsg"></a>Example: network security groups with HDInsight

The examples in this section demonstrate how to create network security group rules. The rules allow HDInsight to communicate with the Azure management services. Before using the examples, adjust the IP addresses to match the ones for the Azure region you're using. You can find this information in [HDInsight management IP addresses](hdinsight-management-ip-addresses.md).

### Azure Resource Management template

The following Resource Management template creates a virtual network that restricts inbound traffic, but allows traffic from the IP addresses required by HDInsight. This template also creates an HDInsight cluster in the virtual network.

* [Deploy a secured Azure Virtual Network and an HDInsight Hadoop cluster](https://azure.microsoft.com/resources/templates/101-hdinsight-secure-vnet/)

### Azure PowerShell

Use the following PowerShell script to create a virtual network that restricts inbound traffic and allows traffic from the IP addresses for the North Europe region.

> [!IMPORTANT]  
> Change the IP addresses for `hdirule1` and `hdirule2` in this example to match the Azure region you are using. You can find this information [HDInsight management IP addresses](hdinsight-management-ip-addresses.md).

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

This example demonstrates how to add rules to allow inbound traffic on the required IP addresses. It doesn't contain a rule to restrict inbound access from other sources. The following code demonstrates how to enable SSH access from the Internet:

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
    > Change the IP addresses for `hdirule1` and `hdirule2` in this example to match the Azure region you are using. You can find this information in [HDInsight management IP addresses](hdinsight-management-ip-addresses.md).

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

1. On the custom DNS server for the virtual network, use the following text as the contents of the `/etc/bind/named.conf.local` file:

    ```
    // Forward requests for the virtual network suffix to Azure recursive resolver
    zone "0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net" {
        type forward;
        forwarders {168.63.129.16;}; # Azure recursive resolver
    };
    ```

    Replace the `0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net` value with the DNS suffix of your virtual network.

    This configuration routes all DNS requests for the DNS suffix of the virtual network to the Azure recursive resolver.

1. On the custom DNS server for the virtual network, use the following text as the contents of the `/etc/bind/named.conf.options` file:

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

1. To use the configuration, restart Bind. For example, `sudo service bind9 restart`.

1. Add a conditional forwarder to the on-premises DNS server. Configure the conditional forwarder to send requests for the DNS suffix from step 1 to the custom DNS server.

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

    Any requests that aren't for the DNS suffixes of the virtual networks (for example, microsoft.com) is handled by the Azure recursive resolver.

4. To use the configuration, restart Bind. For example, `sudo service bind9 restart` on both DNS servers.

After completing these steps, you can connect to resources in the virtual network using fully qualified domain names (FQDN). You can now install HDInsight into the virtual network.

## Next steps

* For a complete example of configuring HDInsight to connect to an on-premises network, see [Connect HDInsight to an on-premises network](./connect-on-premises-network.md).
* For configuring Apache HBase clusters in Azure virtual networks, see [Create Apache HBase clusters on HDInsight in Azure Virtual Network](hbase/apache-hbase-provision-vnet.md).
* For configuring Apache HBase geo-replication, see [Set up Apache HBase cluster replication in Azure virtual networks](hbase/apache-hbase-replication.md).
* For more information on Azure virtual networks, see the [Azure Virtual Network overview](../virtual-network/virtual-networks-overview.md).

* For more information on network security groups, see [Network security groups](../virtual-network/security-overview.md).

* For more information on user-defined routes, see [User-defined routes and IP forwarding](../virtual-network/virtual-networks-udr-overview.md).
