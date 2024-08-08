---
title: Control network traffic from HDInsight on AKS Cluster pools and cluster
description: A guide to configure and manage inbound and outbound network connections from HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 05/21/2024
---

# Control network traffic from HDInsight on AKS Cluster pools and clusters

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS is a managed Platform as a Service (PaaS) that runs on Azure Kubernetes Service (AKS). HDInsight on AKS allows you to deploy popular Open-Source Analytics workloads like Apache Spark™, Apache Flink®️, and Trino without the overhead of managing and monitoring containers.  

By default, HDInsight on AKS clusters allow outbound network connections from clusters to any destination, if the destination is reachable from the node's network interface. This means that cluster resources can access any public or private IP address, domain name, or URL on the internet or on your virtual network.  

However, in some scenarios, you may want to control or restrict the egress traffic from your cluster for security, compliance reasons.  

For example, you may want to: 

* Prevent clusters from accessing malicious or unwanted services.

* Enforce network policies or firewall rules on the outbound traffic.

* Monitor or audit the egress traffic from cluster for troubleshooting or compliance purposes.

## Methods and tools to control egress traffic

You have different options and tools for managing how the egress traffic flows from HDInsight on AKS clusters. You can set up some of these at the cluster pool level and others at the cluster level.   

* **Outbound with load balancer.** When you deploy a cluster pool with this Egress path, a public IP address is provisioned and assigned to the load balancer resource. A custom virtual network (VNET) is not required; however, it is highly recommended. You can use Azure Firewall or Network Security Groups (NSGs) on the custom VNET to manage the traffic that leaves the network.

* **Outbound with User defined routing.** When you deploy a cluster pool with this Egress path, the user can manage the egress traffic at the subnet level using Azure Firewall / NAT Gateway, and custom route tables. This option is only available when using a custom VNET.

* **Enable Private AKS.** When you enable private AKS on your cluster pool, the AKS API server will be assigned an internal IP address and will not be accessible publicly. The network traffic between the AKS API server and the HDInsight on AKS node pools (clusters) will stay on the private network. 

* **Private ingress cluster.** When you deploy a cluster with the private ingress option enabled, no public IP will be created, and the cluster will only be accessible from clients within the same VNET. You must provide your own NAT solution, such as a NAT gateway or a NAT provided by your firewall, to connect to outbound, public HDInsight on AKS dependencies. 

In the following sections, we describe each method in detail.

### Outbound with load balancer

The load balancer is used for egress through an HDInsight on AKS assigned public IP. When you configure the outbound type of load balancer on your cluster pool, you can expect egress out of the load balancer created by the HDInsight on AKS.  

You can configure the outbound with load balancer configuration using the Azure portal.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/cluster-pool-network-setting.png" alt-text="Screenshot showing cluster pool network setting." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/cluster-pool-network-setting.png":::

Once you opt for this configuration, HDInsight on AKS automatically completes creating a public IP address provisioned for cluster egress & assigns to the load balancer resource. 

A public IP created by HDInsight on AKS, and it's an AKS-managed resource, which means that AKS manages the lifecycle of that public IP and doesn't require user action directly on the public IP resource.   

When clusters are created, certain ingress public IPs also get created. 

To allow requests to be sent to the cluster, you need to [allowlist the traffic](./secure-traffic-by-nsg.md#inbound-security-rules-ingress-traffic). You can also configure certain [rules in the NSG ](./secure-traffic-by-nsg.md#inbound-security-rules-ingress-traffic) to do a coarse-grained control. 

### Outbound with user defined routing

> [!NOTE]
>  The `userDefinedRouting` outbound type is an advanced networking scenario and requires proper network configuration, before you begin.  
> Changing the outbound type after cluster pool creation is not supported.

If userDefinedRouting is set, HDInsight on AKS won't automatically configure egress paths. The egress setup must be done by the user. 

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/user-defined-routing.png" alt-text="Screenshot showing user defined routing." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/user-defined-routing.png":::

You must deploy the HDInsight on AKS cluster into an existing virtual network with a subnet that has been previously configured, and you must establish explicit egress.

This architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, or proxy, so a public IP assigned to the standard load balancer or appliance can handle the Network Address Translation (NAT). 

HDInsight on AKS doesn't configure outbound public IP address or outbound rules, unlike the Outbound with load balancer type clusters as described in the above section. Your UDR is the only source for egress traffic. 

For inbound traffic, you are required to choose based on the requirements to choose a private cluster (for securing traffic on AKS control plane / API server) and select the private ingress option available on each of the cluster shape to use public or internal load balancer based traffic. 


### Cluster pool creation for outbound with `userDefinedRouting`

When you use HDInsight on AKS cluster pools and choose userDefinedRouting (UDR) as the egress path, there is no standard load balancer provisioned.  You need to set up the firewall rules for the Outbound resources before `userDefinedRouting` can function.

> [!IMPORTANT]
> UDR egress path needs a route for 0.0.0.0/0 and a next hop destination of your Firewall or NVA in the route table. The route table already has a default 0.0.0.0/0 to the Internet. You can't get outbound Internet connectivity by just adding this route, because Azure needs a public IP address for SNAT. AKS checks that you don't create a 0.0.0.0/0 route pointing to the Internet, but to a gateway, NVA, etc. When you use UDR, a load balancer public IP address for inbound requests is only created if you configure a service of type loadbalancer. HDInsight on AKS never creates a public IP address for outbound requests when you use a UDR egress path.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png" alt-text="Screenshot showing enabled private AKS." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png":::

With the following steps you will understand how to lock down the outbound traffic from your HDInsight on AKS service to back-end Azure resources or other network resources with Azure Firewall. This configuration helps prevent data exfiltration or the risk of malicious program implantation. 

Azure Firewall lets you control outbound traffic at a much more granular level and filter traffic based on real-time threat intelligence from Microsoft Cyber Security. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks.

Following is an example of setting up firewall rules, and testing your outbound connections 

Here is an example of how to configure firewall rules, and check your outbound connections.

1. Create the required firewall subnet

   To deploy a firewall into the integrated virtual network, you need a subnet called **AzureFirewallSubnet or Name of your choice**. 

    1. In the Azure portal, navigate to the virtual network integrated with your app. 
    
    1. From the left navigation, select **Subnets > + Subnet**.
    
    1. In **Name**, type **AzureFirewallSubnet**.
    
    1. **Subnet address range**, accept the default or specify a range that's [at least /26 in size](/azure/firewall/firewall-faq#why-does-azure-firewall-need-a--26-subnet-size).
    
    1. Select **Save**. 
    

1. Deploy the firewall and get its IP 

    1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
    
    1. Type firewall in the search box and press **Enter**. 
    
    1. Select **Firewall** and then select **Create**. 
    
    1. On the **Create a Firewall** page, configure the firewall as shown in the following table: 
    

        |Setting |Value |
        |-|-|
        |Resource group |Same resource group as the integrated virtual network.|
        |Name |Name of your choice |
        |Region |Same region as the integrated virtual network. |
        |Firewall policy |Create one by selecting Add new. |
        |Virtual network |Select the integrated virtual network. |
        |Public IP address |Select an existing address or create one by selecting Add new. |
    
        :::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-firewall-page.png" alt-text="Screenshot showing create a firewall basic tab." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-firewall-page.png":::

    1. Click **Review + create**. 
    
    1. Select **Create again**. This process takes a few minutes to deploy. 
    
    1. After deployment completes, go to your resource group, and select the firewall. 
    
    1. In the firewall's **Overview** page, copy private IP address. **The private IP address will be used as next hop address in the routing rule for the virtual network**.
    
       :::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/setup-firewall.png" alt-text="Screenshot showing how to set up firewall." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/setup-firewall.png":::

1. Route all traffic to the firewall

   When you create a virtual network, Azure automatically creates a default route table for each of its subnets and adds system [default routes to the table](/azure/virtual-network/virtual-networks-udr-overview#default). In this step, you create a user-defined route table that routes all traffic to the firewall, and then associate it with the App Service subnet in the integrated virtual network. 
    
    1. On the [Azure portal](https://portal.azure.com/) menu, select **All services** or search for and select **All services** from any page. 
    
    1. Under **Networking**, select **Route tables**. 
    
    1. Select **Add**. 
    
    1. Configure the route table like the following example: 
    
       :::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-route-table.png" alt-text="Screenshot showing how to create route table." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-route-table.png"::: 
    
        Make sure you select the same region as the firewall you created. 

    1. Select **Review + create**. 
    
    1. Select **Create**. 
    
    1. After deployment completes, select **Go to resource**. 
    
    1. From the left navigation, select **Routes > Add**. 
    
    1. Configure the new route as shown in the following table:

       |Setting |Value |
       |-|-|
       |Destination Type| IP Addresses|
       |Destination IP addresses/CIDR ranges |0.0.0.0/0 |
       |Next hop type |Virtual appliance |
       |Next hop address |The private IP address for the firewall that you copied |
  
    1. From the left navigation, select **Subnets > Associate**.
    1. In **Virtual network**, select your integrated virtual network.
    1. In **Subnet**, select the HDInsight on AKS subnet you wish to use.

       :::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/associate-subnet.png" alt-text="Screenshot showing how to associate subnet." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/associate-subnet.png":::

    1. Select **OK**. 

1. Configure firewall policies

   Outbound traffic from your HDInsight on AKS subnet is now routed through the integrated virtual network to the firewall.
   To control the outbound traffic, add an application rule to firewall policy. 
    
    1. Navigate to the firewall's overview page and select its firewall policy. 
    
    1. In the firewall policy page, from the left navigation, add network and application rules. For example, select **Network Rules > Add a rule collection**.  
    
    1. In **Rules**, add a network rule with the subnet as the source address, and specify an FQDN destination. Similarly, add the application rules.
       1. You need to add the [outbound traffic rules given here](./required-outbound-traffic.md). Refer [this doc for adding application and network rules](./secure-traffic-by-firewall-azure-portal.md#add-network-and-application-rules-to-the-firewall) for allowing traffic for the cluster to function. (AKS ApiServer need to be added after the clusterPool is created because you only can get the AKS ApiServer after creating the clusterPool).
       1. You can also add the [private endpoints](/azure/hdinsight-aks/secure-traffic-by-firewall-azure-portal#add-network-and-application-rules-to-the-firewall) for any dependent resources in the same subnet for cluster to access them (example – storage). 
    
    1. Select **Add**.    

1. Verify if public IP is created

With the firewall rules set, you can select the subnet during the cluster pool creation.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/verify-ip-address.png" alt-text="Screenshot showing how to verify IP address." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/verify-ip-address.png":::

Once the cluster pool is created, you can observe in the MC Group that there's no public IP created. 

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/list-view.png" alt-text="Screenshot showing network list." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/list-view.png":::

> [!IMPORTANT]
> Before you create the cluster in the cluster pool setup with `Outbound with userDefinedRouting` egress path, you need to give the AKS cluster - that matches the cluster pool - the `Network Contributor` role on your network resources that are used for defining the routing, such as Virtual Network, Route table, and NSG (if used). Learn more about how to assign the role [here](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition#step-1-identify-the-needed-scope)

> [!NOTE]
> When you deploy a cluster pool with UDR egress path and a private ingress cluster, HDInsight on AKS will automatically create a private DNS zone and map the entries to resolve the FQDN for accessing the cluster.


### Cluster pool creation with private AKS  

With private AKS, the control plane or API server has internal IP addresses that are defined in the [RFC1918 - Address Allocation for Private Internet document](https://datatracker.ietf.org/doc/html/rfc1918). By using this option of private AKS, you can ensure network traffic between your API server and your HDInsight on AKS workload clusters remains on the private network only. 

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png" alt-text="Screenshot showing the enabled private AKS." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png":::

When you provision a private AKS cluster, AKS by default creates a private FQDN with a private DNS zone and an additional public FQDN with a corresponding A record in Azure public DNS. The agent nodes continue to use the record in the private DNS zone to resolve the private IP address of the private endpoint for communication to the API server. 

As HDInsight on AKS will automatically insert the record to the private DNS zone in the HDInsight on AKS created managed group, for private ingress. 

### Clusters with private ingress 

When you create a cluster with HDInsight on AKS, it has a public FQDN and IP address that anyone can access. With the private ingress feature, you can make sure that only your private network can send and receive data between the client and the HDInsight on AKS cluster.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png" alt-text="Screenshot showing create cluster basic tab." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png":::

> [!NOTE]
> With this feature, HDInsight on AKS will automatically create A-records on the private DNS zone for ingress. 

This feature prevents public internet access to the cluster. The cluster gets an internal load balancer and private IP. HDInsight on AKS uses the private DNS zone that the cluster pool created to connect the cluster Virtual Network and do name resolution.

Each private cluster contains two FQDNs: public FQDN and private FQDN.

Public FQDN： `{clusterName}.{clusterPoolName}.{subscriptionId}.{region}.hdinsightaks.net`

The Public FQDN can only be resolved to a CNAME with subdomain, therefore it must be used with the correct `Private DNS zone setting` to make sure FQDN can be finally solved to correct Private IP address. 

The Private DNS zone should be able to resolve private FQDN to an IP `(privatelink.{clusterPoolName}.{subscriptionId})`. 
 
> [!NOTE]
> HDInsight on AKS creates private DNS zone in the cluster pool, virtual network. If your client applications are in same virtual network, you need not configure the private DNS zone again. In case you're using a client application in a different virtual network, you're required to use virutal network peering and bind to private dns zone in the cluster pool virtual network or use private endpoints in the virutal network, and private dns zones, to add the A-record to the private endpoint private IP. 

Private FQDN： `{clusterName}.privatelink.{clusterPoolName}.{subscriptionId}.{region}.hdinsightaks.net`

The private FQDN will be assigned to clusters with the private ingress enabled only. It is an A-RECORD in the private DNS zone that resolves to the cluster's private IP.

### Reference

- [Getting started with Private Clusters on HDInsight on AKS for securing your analytics workloads](https://techcommunity.microsoft.com/t5/analytics-on-azure-blog/getting-started-with-private-clusters-on-hdinsight-on-aks-for/ba-p/4138624).

- [Azure virtual network traffic routing](/azure/virtual-network/virtual-networks-udr-overview).

- [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview).

- [Outbound traffic on HDInsight on AKS - Azure HDInsight on AKS](./required-outbound-traffic.md)

- [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters - Azure Kubernetes Service](/azure/aks/outbound-rules-control-egress#azure-global-required-network-rules).


