---
title: Load balancer migration guidelines for Azure HDInsight on AKS
description: Guidelines to perform load balancer migration for Azure HDInsight on AKS
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 09/25/2024
---

# Load balancer migration guidelines

This article describes the details about the impact on HDInsight clusters and the necessary steps required as HDInsight service is transitioning to use standard load balancers for all its cluster configurations.

This transition is done in line with the announcement of retirement of Azure basic load balancer by 30 September 2025 and no support for new deployment by Mar 31, 2025. For more information, see [Azure Basic Load Balancer retires on 30 September 2025. Upgrade to Standard Load Balancer](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer).

## Impact on HDInsight clusters

### Scenario 1: Long running clusters (when you don’t create and delete cluster daily for your use case)

**Case 1:**  When HDInsight clusters are already created without custom virtual network. (No virtual network provided during cluster creation.)

No immediate disruption until Mar 31, 2025. However, we strongly recommend re-creating the cluster before Mar 31, 2025 to avoid potential disruption.

**Case 2:** When HDInsight clusters are already created with custom virtual network, no immediate disruption until Mar 31, 2025. However, we strongly recommend re-creating the cluster by Mar 31, 2025 to avoid potential disruption.

### Scenario 2: New clusters creation

**Case 1:** When HDInsight clusters already created without custom virtual network. (No virtual network provided during cluster creation.)

In this case, no impact. You can recreate the cluster directly.

**Case 2:**  When HDInsight clusters are created with custom virtual network

In this case, there are two options to create a cluster

**Approach 1:** Create the cluster with a new subnet

1. Choose the outbound connectivity for your cluster, and  follow this document [Use Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections), and choose one method to provide outbound connectivity for the new cluster. The most recommended way is to attach a NAT gateway and a Network Security Group (NSG) to the subnet.

1. (Optional) Create a new NAT gateway and a new network security group (NSG).
   
    > [!NOTE]
    > You can associate an existing NAT gateway and NSG or the newly created ones.
    >
    > Follow the docs [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.
    >
    > You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.
    
1. Create a new subnet and associate the subnet with the NAT gateway and network security group.
    
    :::image type="content" source="./media/load-balancer-migration-guidelines/create-subnet.png" alt-text="Screenshot showing how to create a subnet." border="true" lightbox="./media/load-balancer-migration-guidelines/create-subnet.png":::

    > [!NOTE]
    > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway (Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway).

1. Create a new cluster with the subnet.
    
   :::image type="content" source="./media/load-balancer-migration-guidelines/create-hdinsight-cluster.png" alt-text="Screenshot showing how to create a HDInsight cluster." border="true" lightbox="./media/load-balancer-migration-guidelines/create-hdinsight-cluster.png":::  

**Approach 2: Use the existing subnet**

To upgrade your existing custom virtual network to integrate Azure standard load balancer (which is HDInsight clusters use by default), see, [Use Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections) to provide outbound connectivity for the cluster. The most recommended way is to attach a network security group and a NAT gateway to the subnet. Since the existing subnet which has HDInsight clusters with Azure basic load balancers can't be associated with an NAT gateway due to incompatibility with basic load balancer, there are two scenarios:

### Scenario 1: Existing subnet has no HDInsight clusters with Azure basic load balancer

1. (Optional) Create a new NAT gateway and a new network security group.
 
    > [!NOTE]
    > You could associate an existing NAT gateway and NSG or the newly created ones.
    > Follow this doccument [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.
    > 
    > You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.
    
1. Associate the NAT gateway with your subnet along with a network security group.
    
    :::image type="content" source="./media/load-balancer-migration-guidelines/associate-gateway.png" alt-text="Screenshot showing how to associate gateway." border="true" lightbox="./media/load-balancer-migration-guidelines/associate-gateway.png":::

1. Create the cluster with the subnet.
    
    
    :::image type="content" source="./media/load-balancer-migration-guidelines/security-networking.png" alt-text="Screenshot showing security networking tab." border="true" lightbox="./media/load-balancer-migration-guidelines/security-networking.png":::

    > [!NOTE]
    > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway (Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway). 

### Scenario 2: The existing subnet has HDInsight clusters with basic load balancers.

**Approach 1:** The most recommended way is to associate a NAT gateway to the subnet along with network security group.

According to [Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway), the subnet with NAT gateway and Azure standard load balancer isn't compatible.

To associate with a NAT Gateway, perform the following steps.

1. Delete all the existing HDInsight clusters with Azure basic load balancers in this subnet.

1. (Optional) Create a new NAT gateway and a new network security group.

    > [!NOTE]
    > You could associate an existing NAT gateway and NSG or the newly created ones.
    > Follow thi document [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.
    > 
    > You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.

1. Associate the subnet with the NAT gateway and network security group.

    
    :::image type="content" source="./media/load-balancer-migration-guidelines/add-subnet.png" alt-text="Screenshot showing how to add subnet." border="true" lightbox="./media/load-balancer-migration-guidelines/add-subnet.png":::

    > [!NOTE]
    > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway (Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway). 

1. Re-create the clusters with the subnet.

    
    :::image type="content" source="./media/load-balancer-migration-guidelines/viritual-network.png" alt-text="Screenshot showing virtual network." border="true" lightbox="./media/load-balancer-migration-guidelines/viritual-network.png":::

**Approach 2:** Select option other than **Associate a NAT gateway to the subnet** provided in [Use Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections), and follow the instruction for the selected option.

**Approach 3:** Create a new subnet and then create the cluster with the new subnet.
