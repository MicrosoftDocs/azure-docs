---
title: Control network traffic from HDInsight on AKS Clusters
description: A guide to configure and manage inbound and outbound network connections from HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 03/21/2024
---

# Control network traffic from HDInsight on AKS Clusters

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS is a managed Platform as a Service (PaaS) that runs on Azure Kubernetes Service (AKS). HDInsight on AKS allows you to deploy popular Open-Source Analytics workloads like Apache Spark™, Apache Flink®️, and Trino without the overhead of managing and monitoring containers.  

By default, HDInsight on AKS clusters allow outbound network connections from clusters to any destination, if the destination is reachable from the node's network interface. This means that cluster resources can access any public or private IP address, domain name, or URL on the internet or on your virtual network.  

However, in some scenarios, you may want to control or restrict the egress traffic from your cluster for security, compliance reasons.  

For example, you may want to: 

* Prevent clusters from accessing malicious or unwanted services.

* Enforce network policies or firewall rules on the outbound traffic.

* Monitor or audit the egress traffic from cluster for troubleshooting or compliance purposes.

## Methods and tools to control egress traffic

 
There are several methods and tools for controlling egress traffic from HDInsight on AKS clusters, by configuring the settings at cluster pool and cluster levels.  

Some of the most common ones are: 
* Use Azure Firewall or Network Security Groups (NSGs) to control egress traffic, when you opt to use outbound cluster pool with load balancer 

* Use Outbound cluster pool with User defined routing to control egress traffic at the subnet level.

* Use Private AKS cluster feature - To ensure AKS control plane, or API server has internal IP addresses. The network traffic between AKS Control plane / API server and HDInsight on AKS node pools (clusters) remains on the private network only.

* Avoid creating public IPs for the cluster, use private ingress feature on your clusters.

In the following sections, we describe each method in detail.

### Outbound with load balancer

The load balancer is used for egress through an HDInsight on AKS assigned public IP. When you configure the outbound type of loadBalancer on your cluster pool, you can expect egress out of the load balancer created by the HDInsight on AKS.  

You can configure the outbound with load balancer configuration using the Azure portal.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/cluster-pool-network-setting.png" alt-text="Screenshot showing cluster pool network setting." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/cluster-pool-network-setting.png":::

Once you opt for this configuration, HDInsight on AKS automatically completes creating a public IP address provisioned for cluster egress & assigns to the load balancer resource. 

A public IP created by HDInsight on AKS, and it's an AKS-managed resource, which means that AKS manages the lifecycle of that public IP and doesn't require user action directly on the public IP resource.   

When clusters are created, then certain ingress public IPs also get created. 

To allow requests to be sent to the cluster, you need to [allowlist the traffic](./secure-traffic-by-nsg.md#inbound-security-rules-ingress-traffic). You can also configure certain [rules in the NSG ](./secure-traffic-by-nsg.md#inbound-security-rules-ingress-traffic) to do a coarse-grained control. 

### Outbound with user defined routing

> [!NOTE]
>  The `userDefinedRouting` outbound type is an advanced networking scenario and requires proper network configuration, before you begin.  
> Changing the outbound type after cluster pool creation is not supported.  

If `userDefinedRouting` is set, HDInsight on AKS cant't automatically configure egress paths. The user needs to do the egress setup.

You must deploy the HDInsight on AKS cluster into an existing virtual network with a subnet previously configured, and you must establish explicit egress.  

This architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, or proxy. So a public IP assigned to the standard load balancer or appliance can handle the Network Address Translation (NAT). 

HDInsight on AKS doesn't configure outbound public IP address or outbound rules, unlike the outbound with load balancer type clusters as described in the above section. Your UDR is the only source for egress traffic. 

For inbound traffic, you're required to choose based on the requirements to choose a private cluster (for securing traffic on AKS control plane / API server) and select the private ingress option available on each of the cluster shape to use public or internal load balancer based traffic. 

### Cluster pool creation for outbound with `userDefinedRouting `

In HDInsight on AKS cluster pools, when you set an outbound type of UDR, no standard load balancer created.  

You're required to first set the firewall rules for the Outbound with `userDefinedRouting` to work.

> [!IMPORTANT]
> Outbound type of UDR requires a route for 0.0.0.0/0 and a next hop destination of NVA in the route table. The route table already has a default 0.0.0.0/0 to the Internet. Without a public IP address for Azure to use for Source Network Address Translation (SNAT), simply adding this route won't provide you outbound Internet connectivity. AKS validates that you don't create a 0.0.0.0/0 route pointing to the Internet but instead to a gateway, NVA, etc. When using an outbound type of UDR, a load balancer public IP address for inbound requests isn't created unless you configure a service of type loadbalancer. HDInsight on AKS never creates a public IP address for outbound requests if you set an outbound type of UDR.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/user-defined-routing.png" alt-text="Screenshot showing user defined routing." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/user-defined-routing.png":::

With the following steps, you understand how to lock down the outbound traffic from your HDInsight on AKS service to back-end Azure resources or other network resources with Azure Firewall. This configuration helps prevent data exfiltration or the risk of malicious program implantation. 

Azure Firewall lets you control outbound traffic at a much more granular level and filter traffic based on real-time threat intelligence from Microsoft Cyber Security. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks [see Azure Firewall features](/azure/firewall/features).

Following is an example of setting up firewall rules, and testing your outbound connections.

1. Create the required firewall subnet:

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
    
       :::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png" alt-text="Screenshot showing create cluster basic tab." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png"::: 
    
        Make sure you select the same region as the firewall you created. 

    1. Select **Review + create**. 
    
    1. Select **Create**. 
    
    1. After deployment completes, select **Go to resource**. 
    
    1. From the left navigation, select **Routes > Add**. 
    
    1. Configure the new route as shown in the following table:

        |Setting |Value |
        |-|-
        |Address prefix |0.0.0.0/0 |
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
    
    1. In the firewall policy page, from the left navigation, select **Application Rules > Add a rule collection**. 
    
    1. In **Rules**, add a network rule with the subnet as the source address, and specify an FQDN destination.  
    
    1. You need to add [AKS](/azure/aks/outbound-rules-control-egress#required-outbound-network-rules-and-fqdns-for-aks-clusters) and  [HDInsight on AKS](./secure-traffic-by-firewall-azure-portal.md#add-network-and-application-rules-to-the-firewall) rules for allowing traffic for the cluster to function. (AKS ApiServer need to be added after the clusterPool is created because you only can get the AKS ApiServer after creating the clusterPool).
    
    1. You can also add the [private endpoints](/azure/hdinsight-aks/secure-traffic-by-firewall-azure-portal#add-network-and-application-rules-to-the-firewall) for any dependent resources in the same subnet for cluster to access them (example – storage). 
    
    1. Select **Add**.
    

1. Verify if public IP is created

With the firewall rules set, you can select the subnet during the cluster pool creation.

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/verify-ip-address.png" alt-text="Screenshot showing how to verify IP address." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/verify-ip-address.png":::

Once the cluster pool is created, you can observe in the MC Group that there's no public IP created. 

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/list-view.png" alt-text="Screenshot showing network list." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/list-view.png":::

> [!NOTE]
> When you deploy a cluster pool with outbound type of UDR and a private ingress cluster, HDInsight on AKS, will create a private DNS zone by default and will map the entries to resolve the FQDN for cluster access.

 

### Cluster pool creation with private AKS  

With private AKS, the control plane or API server has internal IP addresses that are defined in the [RFC1918 - Address Allocation for Private Internet document](https://datatracker.ietf.org/doc/html/rfc1918). By using this option of private AKS, you can ensure network traffic between your API server and your HDInsight on AKS workload clusters remains on the private network only. 

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png" alt-text="Screenshot showing enabled private AKS." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/enable-private-aks.png":::

> [!IMPORTANT]
> When you provision a private AKS cluster, AKS by default creates a private FQDN with a private DNS zone. An extra public FQDN with a corresponding A record in Azure public DNS. The agent nodes continue to use the A record in the private DNS zone to resolve the private IP address of the private endpoint for communication to the API server. As HDInsight on AKS Resource provider automatically inserts the A record to the private DNS zone, for private ingress.

 

### Clusters with private ingress 

HDInsight on AKS clusters create a cluster with public accessible FQDN and public IP. With the private ingress feature you can ensure network traffic between client and HDInsight on AKS cluster remains on your private network only.  

:::image type="content" source="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png" alt-text="Screenshot showing create cluster basic tab." lightbox="./media/control-egress traffic-from-hdinsight-on-aks-clusters/create-cluster-basic-tab.png":::

> [!NOTE]
> With this feature, HDInsight on AKS will automatically create A-records on the private DNS zone for ingress. 

Once you enable this feature, you can't access the cluster from public internet. There's an internal load balancer and private IP created for cluster. HDInsight on AKS uses the private DNS zone created with the cluster pool to link the cluster Virtual Network and perform name resolution.

Each private cluster contains two FQDNs: well-know FQDN and private FQDN.

Well-know FQDN： `{clusterName}.{clusterPoolName}.{subscriptionId}.{region}.hdinsightaks.net`

The well-know FQDN is like a public cluster, but it can only be resolved to a CNAME with subdomain, which means well-know FQDN of private cluster must be used with correct `Private DNS zone setting` to make sure FQDN can be finally solved to correct Private IP address. 

 
> [!NOTE]
> HDInsight on AKS creates private DNS zone in the cluster pool, virtual network. If your client applications are in same virtual network, you need not configure the private DNS zone again. In case you're using a client application in a different virtual network, you're required to use virutal network peering to bind to private dns zone in the cluster pool virtual network or use private endpoints in the virutal network, and private dns zones, to add the A-record to the private endpoint private IP. 


Private FQDN： `{clusterName}.privatelink.{clusterPoolName}.{subscriptionId}.{region}.hdinsightaks.net`

The private FQDN is only for private cluster, recorded as A-RECORD in private DNS zone, is resolved to private IP of cluster.

### Reference

- [Azure virtual network traffic routing](/azure/virtual-network/virtual-networks-udr-overview).

- [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview).

- [Outbound traffic on HDInsight on AKS - Azure HDInsight on AKS](./required-outbound-traffic.md)

- [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters - Azure Kubernetes Service](/azure/aks/outbound-rules-control-egress#azure-global-required-network-rules).


