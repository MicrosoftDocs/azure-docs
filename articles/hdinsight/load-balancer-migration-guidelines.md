---
title: Basic Load balancer deprecation - Guidelines for Azure HDInsight
description: Guidelines to transition to standard load balancer for Azure HDInsight.
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 01/06/2025
---

# Basic Load balancer deprecation: Guidelines for Azure HDInsight

This article describes the details about the impact on HDInsight clusters and the necessary steps required as HDInsight service is transitioning to use standard load balancers for all its cluster configurations.

This transition is done in line with the announcement of retirement of Azure basic load balancer by 30 September 2025 and no support for new deployment by Mar 31, 2025. For more information, see [Azure Basic Load Balancer retires on 30 September 2025. Upgrade to Standard Load Balancer](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer).

As part of the migration from the basic load balancer to the standard load balancer, the public IP address will be upgraded from basic SKU to standard SKU. For more details, see [Upgrade to Standard SKU public IP addresses in Azure by 30 September 2025 - Basic SKU will be retired](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired). Additionally, default outbound access will be deprecated. For further information, see [Default outbound access for VMs in Azure will be retired - transition to a new method of internet access](https://azure.microsoft.com/updates?id=default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access).

> [!NOTE]
> Please be advised not to alter any components created by HDInsight within your VNet, including load balancers, IP addresses, network interfaces, etc. Any modifications you make to these components may be reverted during cluster maintenance. 

## Impact on HDInsight clusters

### Long running clusters (when you don’t create and delete cluster frequently for your use case)

   * **Scenario 1:**  Existing HDInsight clusters without custom virtual network (No virtual network used during cluster creation).

     * No immediate disruption until Mar 31, 2025. However, we strongly recommend re-creating the cluster before Mar 31, 2025 to avoid potential disruption.

   * **Scenario 2:** Existing HDInsight clusters with custom virtual network (Used your own VNet for cluster creation).

     * No immediate disruption until Mar 31, 2025. However, we strongly recommend re-creating the cluster before Mar 31, 2025 to avoid potential disruption.

### New cluster creation

Due to the deprecation of the default outbound access, a new outbound connectivity method is required by the HDInsight cluster. There are several ways provided in the document [Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections) that could provide outbound connectivity for a cluster. The only compatible way with HDInsight is to associate a NAT gateway to the subnet, which supports auto-scaling features of HDInsight clusters. 
NAT gateway provides outbound network connectivity for the cluster. NSG controls both the inbound and outbound traffic, which is required by the standard load balancer. 

* **Scenario 1:** HDInsight clusters without custom virtual network (Creating cluster without any virtual network).

   * In this case, no impact. You can recreate the cluster directly.

* **Scenario 2:** HDInsight clusters with custom virtual network (Using your own VNet during cluster creation).
   
   * In this case, there are two options to create a cluster

      **Approach 1:** Create the cluster with a new subnet
       
      1. Create a new NAT gateway and a new Network Security Group (NSG) or use the existing ones. NAT gateway provides outbound network connectivity for the cluster. NSG controls both the inbound and outbound traffic, which is required by the standard load balancer.
         
   
         > [!NOTE]
         > You can use an existing NAT gateway and NSG.
         
         Follow the docs [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.
         You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.
    
      1. Create a new subnet and associate the subnet with the NAT gateway and network security group.
    
          :::image type="content" source="./media/load-balancer-migration-guidelines/create-subnet.png" alt-text="Screenshot showing how to create a subnet." border="true" lightbox="./media/load-balancer-migration-guidelines/create-subnet.png":::
      
          > [!NOTE]
          > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway).

      1. Create a new cluster with the subnet.
    
         :::image type="content" source="./media/load-balancer-migration-guidelines/create-hdinsight-cluster.png" alt-text="Screenshot showing how to create a HDInsight cluster." border="true" lightbox="./media/load-balancer-migration-guidelines/create-hdinsight-cluster.png":::  

     **Approach 2:** Create the cluster using the existing subnet

      Your existing virtual network may be incompatible with Azure Standard Load Balancer, to upgrade your existing custom virtual network to integrate with Azure standard load balancer. You need to attach a network security group and a NAT gateway to your existing subnet. Since the existing subnet which has HDInsight clusters with Azure basic load balancers can't be associated with an NAT gateway due to incompatibility with basic load balancer, there are two scenarios:

      * **Case 1:** Existing subnet has no HDInsight clusters with Azure Basic Load Balancers

        Follow these steps:

         1. Create a new NAT gateway and a new Network Security Group (NSG) or use the existing ones. NAT gateway provides outbound network connectivity for the cluster. NSG controls both the inbound and outbound traffic, which is required by the standard load balancer.

            > [!NOTE]
            > You could use an existing NAT gateway and NSG.
            
            Follow this document [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.

            You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.
         
        1. Associate the NAT gateway with your subnet along with a network security group.

           :::image type="content" source="./media/load-balancer-migration-guidelines/associate-gateway.png" alt-text="Screenshot showing how to associate gateway." border="true" lightbox="./media/load-balancer-migration-guidelines/associate-gateway.png":::

        1. Create the cluster with the subnet.

           :::image type="content" source="./media/load-balancer-migration-guidelines/security-networking.png" alt-text="Screenshot showing security networking tab." border="true" lightbox="./media/load-balancer-migration-guidelines/security-networking.png":::

           > [!NOTE]
           > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway (Azure NAT Gateway frequently asked questions)](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway). 

     * **Case 2:** Existing subnet has HDInsight clusters with Azure Basic load balancers
            
        Consider one of these methods:

         * **Method 1:** Associate the subnet with a NAT gateway and network security group.

           According to [Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway), NAT gateway is incompatible with Azure basic load balancer.

           To associate with a NAT Gateway, perform the following steps.

              1. Delete all the existing HDInsight clusters with Azure basic load balancers in this subnet.
        
              1. Create a new NAT gateway and a new Network Security Group (NSG) or use the existing ones.
         
                 > [!NOTE]
                 > You could use an existing NAT gateway and NSG.
                 
                 Follow this document [Quickstart: Create a NAT gateway - Azure portal](/azure/nat-gateway/quickstart-create-nat-gateway-portal), and [Create, change, or delete an Azure network security group](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-network-security-group) to create a new NAT gateway and a new network security group.
                  
                 You can refer to this document [Control network traffic in Azure HDInsight](./control-network-traffic.md#hdinsight-with-network-security-groups) to set up correct NSG rules.
           
             1. Associate the subnet with the NAT gateway and network security group.

                :::image type="content" source="./media/load-balancer-migration-guidelines/add-subnet.png" alt-text="Screenshot showing how to add subnet." border="true" lightbox="./media/load-balancer-migration-guidelines/add-subnet.png":::
         
                > [!NOTE]
                > If you are unable to find the NAT gateway, see, [FAQ of the NAT gateway (Azure NAT Gateway frequently asked questions](/azure/nat-gateway/faq#are-basic-sku-resources--basic-load-balancer-and-basic-public-ip-addresses--compatible-with-a-nat-gateway). 
    
            1. Re-create the clusters with the subnet.
              
               :::image type="content" source="./media/load-balancer-migration-guidelines/virtual-network.png" alt-text="Screenshot showing virtual network." border="true" lightbox="./media/load-balancer-migration-guidelines/virtual-network.png":::

         
       * **Method 2:** Create a new subnet and then create the cluster with the new subnet.
 
> [!NOTE]
> If you are using an ESP cluster with MFA disabled, ensure to check the MFA status once cluster is recreated using a NAT gateway.

## Next steps

[Plan a virtual network for Azure HDInsight](./hdinsight-plan-virtual-network-deployment.md)
