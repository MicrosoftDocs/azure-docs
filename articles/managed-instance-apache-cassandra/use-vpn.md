---
title: Use a VPN with Azure Managed Instance for Apache Cassandra
description: Discover how to secure your cluster with a VPN when you use Azure Managed Instance for Apache Cassandra.
author: IriaOsara
ms.author: iriaosara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 02/08/2024
ms.devlang: azurecli

---
# Use a VPN with Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra nodes requires access to many other Azure services when they're injected into your virtual network. Normally, access is enabled by ensuring that your virtual network has outbound access to the internet. If your security policy prohibits outbound access, you can configure firewall rules or user-defined routes for the appropriate access. For more information, see [Required outbound network rules](network-rules.md).

However, if you have internal security concerns about data exfiltration, your security policy might prohibit direct access to these services from your virtual network. By using a virtual private network (VPN) with Azure Managed Instance for Apache Cassandra, you can ensure that data nodes in the virtual network communicate with only a single VPN endpoint, with no direct access to any other services.

> [!IMPORTANT]
> The ability to use a VPN with Azure Managed Instance for Apache Cassandra is in public preview. This feature is provided without a service-level agreement, and we don't recommend it for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How it works

A virtual machine called the operator is part of each Azure Managed Instance for Apache Cassandra. It helps manage the cluster, by default, the operator is in the same virtual network as the cluster. Which means that the operator and data VMs have the same Network Security Group (NSG) rules. Which isn't ideal for security reasons, and it also lets customers prevent the operator from reaching necessary Azure services when they set up NSG rules for their subnet. 

Using VPN as your connection method for an Azure Managed Instance for Apache Cassandra lets the operator be in a different virtual network than the cluster by using the private link service. Meaning that the operator can be in a virtual network that has access to the necessary Azure services and the cluster can be in a virtual network that you control.

:::image type="content" source="./media/use-vpn/vpn-design.png" alt-text="Screenshot of a vpn design." lightbox="./media/use-vpn/vpn-design.png" border="true":::

With the VPN, the operator can now connect to a private IP address inside the address range of your virtual network called a private endpoint. The private link routes the data between the operator and the private endpoint through the Azure backbone network, avoiding exposure to the public internet.

## Security Benefits

We want to prevent attackers from accessing the virtual network where the operator is deployed and trying to steal data. So, we have security measures in place to make sure that the Operator can only reach necessary Azure services.

* Service Endpoint Policies: These policies offer granular control over egress traffic within the virtual network, particularly to Azure services. By using service endpoints, they establish restrictions, permitting data access exclusively to specified Azure services like Azure Monitoring, Azure Storage, and Azure KeyVault. Notably, these policies ensure that data egress is limited solely to predetermined Azure Storage accounts, enhancing security and data management within the network infrastructure.

* Network Security Groups: These groups are used to filter network traffic to and from the resources in an Azure virtual network. We block all traffic from the Operator to the internet, and only allow traffic to certain Azure services through a set of NSG rules.

## How to use a VPN with Azure Managed Instance for Apache Cassandra

1. Create an Azure Managed Instance for Apache Cassandra cluster by using `"VPN"` as the value for the `--azure-connection-method` option:

    ```bash
    az managed-cassandra cluster create \
    --cluster-name "vpn-test-cluster" \
    --resource-group "vpn-test-rg" \
    --location "eastus2" \
    --azure-connection-method "VPN" \
    --initial-cassandra-admin-password "password"
    ```

1. Use the following command to see the cluster properties:

    ```bash
    az managed-cassandra cluster show \
    --resource-group "vpn-test-rg" \
    --cluster-name "vpn-test-cluster"
    ```

    From the output, make a copy of the `privateLinkResourceId` value.

1. In the Azure portal, [create a private endpoint](../cosmos-db/how-to-configure-private-endpoints.md) by using these details:
    1. On the **Resource** tab, select **Connect to an Azure resource by resource ID or alias** as the connection method and **Microsoft.Network/privateLinkServices** as the resource type. Enter the `privateLinkResourceId` value from the previous step.
    1. On the **Virtual Network** tab, select your virtual network's subnet, and select the **Statically allocate IP address** option.
    1. Validate and create.

   > [!NOTE]
   > At the moment, the connection between the management service and your private endpoint requires approval from the [Azure Managed Instance for Apache Cassandra team](mailto:cassandra-preview@microsoft.com).

1. Get the IP address of your private endpoint's network interface.

1. Create a new datacenter by using the IP address from the previous step as the `--private-endpoint-ip-address` parameter.

## Next steps

- Learn about [hybrid cluster configuration](configure-hybrid-cluster.md) in Azure Managed Instance for Apache Cassandra.
