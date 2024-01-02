---
title: Enable Private Link on an Azure HDInsight cluster
description: Learn how to connect to an outside HDInsight cluster by using Azure Private Link.
ms.service: hdinsight
ms.topic: conceptual
ms.author: piyushgupta
author: piyush-gupta1999
ms.date: 03/30/2023
---

# Enable Private Link on an HDInsight cluster

In this article, you'll learn about using Azure Private Link to connect to an HDInsight cluster privately across networks over the Microsoft backbone network. This article is an extension of the article [Restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md), which focuses on restricting public connectivity. If you want public connectivity to or within your HDInsight clusters and dependent resources, consider restricting the connectivity of your cluster by following guidelines in [Control network traffic in Azure HDInsight](./control-network-traffic.md).

Private Link can be used in cross-network scenarios where virtual network peering isn't available or enabled.

> [!NOTE]
> Restricting public connectivity is a prerequisite for enabling Private Link and shouldn't be considered the same capability.

The use of Private Link to connect to an HDInsight cluster is an optional feature and is disabled by default. The feature is available only when the `resourceProviderConnection` network property is set to *outbound*, as described in the article [Restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md).

When `privateLink` is set as *enabled*, internal [standard load balancers](../load-balancer/load-balancer-overview.md) (SLBs) are created, and an Azure Private Link service is provisioned for each SLB. The Private Link service is what allows you to access the HDInsight cluster from private endpoints.

## Private link deployment steps
Successfully creating a Private Link cluster takes many steps, so we've outlined them here. Follow each of the steps below to ensure everything is set up correctly.

## <a name="Createpreqs"></a>Step 1: Create prerequisites

To start, deploy the following resources if you haven't created them already. You need to have at least one resource group, two virtual networks, and a network security group to attach to the subnet where the HDInsight cluster will be deployed as shown below.

|Type|Name|Purpose|
|----|----|-------|
|Resource group|hdi-privlink-rg|Used to keep common resources together|
|Virtual network|hdi-privlink-cluster-vnet|The VNET where the cluster will be deployed|
|Virtual network|hdi-privlink-client-vnet|The VNET where clients will connect to the cluster from|
|Network security group|hdi-privlink-cluster-vnet-nsg|Default NSG as required for cluster deployment|

> [!NOTE]
> The network security group (NSG) can simply be deployed, we do not need to modify any NSG rules for cluster deployment.


## <a name="DisableNetworkPolicy"></a>Step 2: Configure HDInsight subnet

- **Disable privateLinkServiceNetworkPolicies on subnet.** In order to choose a source IP address for your Private Link service, an explicit disable setting ```privateLinkServiceNetworkPolicies``` is required on the subnet. Follow the instructions here to [disable network policies for Private Link services](../private-link/disable-private-link-service-network-policy.md).
- **Enable Service Endpoints on subnet.** For successful deployment of a Private Link HDInsight cluster, we recommend that you add the *Microsoft.SQL*, *Microsoft.Storage*, and *Microsoft.KeyVault* service endpoint(s) to your subnet prior to cluster deployment.  [Service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) route traffic directly from your virtual network to the service on the Microsoft Azure backbone network. Keeping traffic on the Azure backbone network allows you to continue auditing and monitoring outbound Internet traffic from your virtual networks, through forced-tunneling, without impacting service traffic. 


## <a name="NATorFirewall"></a>Step 3: Deploy NAT gateway *or* firewall

Standard load balancers don't automatically provide [public outbound NAT](../load-balancer/load-balancer-outbound-connections.md) as basic load balancers do. Since Private Link clusters use standard load balancers, you must provide your own NAT solution, such as a NAT gateway or a NAT provided by your [firewall](./hdinsight-restrict-outbound-traffic.md), to connect to outbound, public HDInsight dependencies.  

### Deploy a NAT gateway (Option 1)
You can opt to use a NAT gateway if you don't want to configure a firewall or a network virtual appliance (NVA) for NAT. To get started, add a NAT gateway (with a new public IP address in your virtual network) to the configured subnet of your virtual network. This gateway is responsible for translating your private internal IP address to public addresses when traffic needs to go outside your virtual network.

For a basic setup to get started:
    
1. Search for 'NAT Gateways' in the Azure portal and click **Create**.
2. Use the following configurations in the NAT Gateway. (We aren't including all configs here, so you can use the default values.)
    
    | Config | Value |
    | ------ | ----- |
    | NAT gateway name | hdi-privlink-nat-gateway |
    | Public IP Prefixes | Create a new public IP prefix |
    | Public IP prefix name | hdi-privlink-nat-gateway-prefix |
    | Public IP prefix size | /28 (16 addresses) |
    | Virtual network | hdi-privlink-cluster-vnet |
    | Subnet name | default |

3. Once the NAT Gateway is finished deploying, you're ready to go to the next step.

### Configure a firewall (Option 2)
For a basic setup to get started:

1. Add a new subnet named *AzureFirewallSubnet* to your virtual network. 
1. Use the new subnet to configure a new firewall and add your firewall policies. 
1. Use the new firewall's private IP address as the `nextHopIpAddress` value in your route table. 
1. Add the route table to the configured subnet of your virtual network.

Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies aren't allowed, cluster creation might fail. 
For more information on setting up a firewall, see [Control network traffic in Azure HDInsight](./control-network-traffic.md).

## <a name="deployCluster"></a>Step 4: Deploy private link cluster

At this point, all prerequisites should be taken care of and you're ready to deploy the Private Link cluster. The following diagram shows an example of the networking configuration that's required before you create the cluster. In this example, all outbound traffic is forced to Azure Firewall through a user-defined route. The required outbound dependencies should be allowed on the firewall before cluster creation. For Enterprise Security Package clusters, virtual network peering can provide the network connectivity to Microsoft Entra Domain Services.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of the Private Link environment before cluster creation.":::

### Create the cluster

The following JSON code snippet includes the two network properties that you must configure in your Azure Resource Manager template to create a private HDInsight cluster:

```json
networkProperties: {
    "resourceProviderConnection": "Outbound",
    "privateLink": "Enabled"
}
```
For a complete template with many of the HDInsight enterprise security features, including Private Link, see [HDInsight enterprise security template](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).

To create a cluster by using PowerShell, see the [example](/powershell/module/az.hdinsight/new-azhdinsightcluster#example-4--create-an-azure-hdinsight-cluster-with-relay-outbound-and-private-link-feature).

To create a cluster by using the Azure CLI, see the [example](/cli/azure/hdinsight#az-hdinsight-create-examples).
    
## <a name="PrivateEndpoints"></a>Step 5: Create private endpoints

Azure automatically creates a Private link service for the Ambari and SSH load balancers during the Private Link cluster deployment. After the cluster is deployed, you have to create two Private endpoints on the client VNET(s), one for Ambari and one for SSH access. Then, link them to the Private link services that were created as part of the cluster deployment.

To create the private endpoints:
1. Open the Azure portal and search for 'Private link'.
2. In the results, click the Private link icon.
3. Click 'Create private endpoint' and use the following configurations to set up the Ambari private endpoint:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-privlink-cluster |
    | Resource type | Microsoft.Network/privateLinkServices |
    | Resource | gateway-* (This value should match the HDI deployment ID of your cluster, for example gateway-4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |
    
    :::image type="content" source="media/hdinsight-private-link/basic-tab-private-endpoint.png" alt-text="Diagram of the Private Link basic tab.":::
    :::image type="content" source="media/hdinsight-private-link/resource-tab-private-endpoint.png" alt-text="Diagram of the Private Link resource tab":::
    :::image type="content" source="media/hdinsight-private-link/virtual-network-tab-private-endpoint.png" alt-text="Diagram of the Private Link virtual network tab.":::
    :::image type="content" source="media/hdinsight-private-link/dns-tab-private-endpoint.png" alt-text="Diagram of the Private Link dns end point tab.":::
    :::image type="content" source="media/hdinsight-private-link/tag-tab-private-endpoint.png" alt-text="Diagram of the Private Link tag tab.":::
    :::image type="content" source="media/hdinsight-private-link/review-tab-private-endpoint.png" alt-text="Diagram of the Private Link review-tab.":::
       
4. Repeat the process to create another private endpoint for SSH access using the following configurations:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-privlink-cluster-ssh |
    | Resource type | Microsoft.Network/privateLinkServices |
    | Resource | headnode-* (This value should match the HDI deployment ID of your cluster, for example headnode-4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |
    
> [!IMPORTANT]
> If you're using KafkaRestProxy HDInsight cluster, then follow this extra steps to [Enable Private Endpoints](./enable-private-link-on-kafka-rest-proxy-hdi-cluster.md#create-private-endpoints).
> 

Once the private endpoints are created, you’re done with this phase of the setup. If you didn’t make a note of the private IP addresses assigned to the endpoints, follow the steps below:

1. Open the client VNET in the Azure portal. 
1. Click on 'Private endpoints' tab.
1. You should see both the Ambari and ssh Network interfaces listed. 
1. Click on each one and navigate to the ‘DNS configuration’ blade to see the private IP address. 
1. Make a note of these IP addresses because they are required to connect to the cluster and properly configure DNS.

## <a name="ConfigureDNS"></a>Step 6: Configure DNS to connect over private endpoints

To access private clusters, you can configure DNS resolution through private DNS zones. The Private Link entries created in the Azure-managed public DNS zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```
The following image shows an example of the private DNS entries configured to enable access to a cluster from a virtual network that isn't peered or doesn't have a direct line of sight to the cluster. You can use an Azure DNS private zone to override `*.privatelink.azurehdinsight.net` fully qualified domain names (FQDNs) and resolve private endpoints' IP addresses in the client's network. The configuration is only for `<clustername>.azurehdinsight.net` in the example, but it also extends to other cluster endpoints.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of the Private Link architecture.":::

To configure DNS resolution through a Private DNS zone:
    
1. Create an Azure Private DNS zone. (We aren't including all configs here, all other configs are left at default values)
    
    | Config | Value |
    | ------ | ----- |
    | Name | privatelink.azurehdinsight.net |
    
     :::image type="content" source="media/hdinsight-private-link/private-dns-zone.png" alt-text="Diagram of the Private dns zone.":::
    
2. Add a Record set to the Private DNS zone for Ambari.
    
    | Config | Value |
    | ------ | ----- |
    | Name | YourPrivateLinkClusterName |
    | Type | A - Alias record to IPv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for Ambari access |
     
    :::image type="content" source="media/hdinsight-private-link/private-dns-zone-add-record.png" alt-text="Diagram of private dns zone add record.":::
        
3. Add a Record set to the Private DNS zone for SSH.
    
    | Config | Value |
    | ------ | ----- |
    | Name | YourPrivateLinkClusterName-ssh |
    | Type | A - Alias record to IPv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for SSH access |
    
    :::image type="content" source="media/hdinsight-private-link/private-dns-zone-add-ssh-record.png" alt-text="Diagram of private link dns zone add ssh record.":::
   
> [!IMPORTANT]
> If you are using KafkaRestProxy HDInsight cluster, then follow this extra steps to [Configure DNS to connect over private endpoint](./enable-private-link-on-kafka-rest-proxy-hdi-cluster.md#configure-dns-to-connect-over-private-endpoints).
> 
    
4. Associate the private DNS zone with the client VNET by adding a Virtual Network Link.
    1. Open the private DNS zone in the Azure portal.
    1. Click the 'Virtual network links' tab.
    1. Click the 'Add' button.
    1. Fill in the details: Link name, Subscription, and Virtual Network (your client VNET) 
    1. Click **Save**.
   
    :::image type="content" source="media/hdinsight-private-link/virtual-network-link.png" alt-text="Diagram of virtual-network-link.":::

## <a name="CheckConnectivity"></a>Step 7: Check cluster connectivity

The last step is to test connectivity to the cluster. Since this cluster is isolated or private, we can't access the cluster using any public IP or FQDN. Instead we have a couple of options:

* Set up VPN access to the client VNET from your on-premises network
* Deploy a VM to the client VNET and access the cluster from this VM

For this example, we'll deploy a VM in the client VNET using the following configuration to test the connectivity.
    
| Config | Value |
| ------ | ----- |
| Virtual machine name | hdi-privlink-client-vm |
| Image | Windows 10 Pro, Version 2004 - Gen1 |
| Public inbound ports | Allow selected ports |
| Select inbound ports | RDP (3389) | 
| I confirm I have an eligible Windows 10 license... | Checked |
| Virtual network | hdi-privlink-client-vnet |
| Subnet | default |

Once the client VM is deployed, you can test both Ambari and SSH access.

To test Ambari access: <br>
1. Open a web browser on the VM.
2. Navigate to your cluster's regular FQDN: `https://<clustername>.azurehdinsight.net`
3. If the Ambari UI loads, the configuration is correct for Ambari access.

To test ssh access: <br>
1. Open a command prompt to get a terminal window. 
2. In the terminal window, try connecting to your cluster with SSH: `ssh sshuser@<clustername>.azurehdinsight.net` (Replace "sshuser" with the ssh user you created for your cluster) 
3. If you're able to connect, the configuration is correct for SSH access.
    
## <a name="ManageEndpoints"></a>Manage private endpoints for HDInsight

You can use [private endpoints](../private-link/private-endpoint-overview.md) for your Azure HDInsight clusters to allow clients on a virtual network to securely access your cluster over [Private Link](../private-link/private-link-overview.md). Network traffic between the clients on the virtual network and the HDInsight cluster traverses over the Microsoft backbone network, eliminating exposure from the public internet.

:::image type="content" source="media/hdinsight-private-link/private-endpoint-experience.png" alt-text="Diagram of the private endpoint management experience.":::

A Private Link service consumer (for example, Azure Data Factory) can choose from two connection approval methods:

* **Automatic**: If the service consumer has Azure role-based access control (RBAC) permissions on the HDInsight resource, the consumer can choose the automatic approval method. In this case, when the request reaches the HDInsight resource, no action is required from the HDInsight resource and the connection is automatically approved.
* **Manual**: If the service consumer doesn't have Azure RBAC permissions on the HDInsight resource, the consumer can choose the manual approval method. In this case, the connection request appears on the HDInsight resources as **Pending**. The HDInsight resource needs to manually approve the request before connections can be established. 

To manage private endpoints, in your cluster view in the Azure portal, go to the **Networking** section under **Security + Networking**. Here, you can see all existing connections, connection states, and private endpoint details.

You can also approve, reject, or remove existing connections. When you create a private connection, you can specify which HDInsight subresource (for example, gateway or head node) you also want to connect to.

The following table shows the various HDInsight resource actions and the resulting connection states for private endpoints. An HDInsight resource can also change the connection state of the private endpoint connection at a later time without consumer intervention. The action will update the state of the endpoint on the consumer side.

| Service provider action | Service consumer private endpoint state | Description |
| --------- | --------- | --------- |
| None | Pending | Connection is created manually and is pending approval by the Private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the Private Link resource owner. |
| Remove | Disconnected | Connection was removed by the Private Link resource owner. The private endpoint becomes informative and should be deleted for cleanup. |

## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
