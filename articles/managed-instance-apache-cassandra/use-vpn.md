---
title: Use VPN with Azure Managed Instance for Apache Cassandra
description: Discover how to secure your cluster with vpn when you use Azure Managed Instance for Apache Cassandra.
author: IriaOsara
ms.author: iriaosara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 02/08/2024
ms.devlang: azurecli

---
# Use VPN with Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra nodes requires access to many other Azure services when injected into your VNet. Normally this is enabled by ensuring your VNet has outbound access to the internet. If your security policy prohibits outbound access, you can also configure firewall rules or UDRs for the appropriate access, for more information, see [here](network-rules.md).

However, if you have internal security concerns around data exfiltration, your security policy might also even prohibit direct access to these services from your VNet. By using a VPN with your Azure Managed Instance for Apache Cassandra, you can ensure that data nodes in the VNet communicate only to a single secure VPN endpoint, with no direct access to any other services.

> [!IMPORTANT]
> Using VPN with Azure Managed Instance for Apache Cassandra is in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How to use VPN with Azure Managed Instance for Apache Cassandra

1. Create a cluster of Cassandra Managed Instance using "VPN" as the value for the `--azure-connection-method` option:

    ```bash
    az managed-cassandra cluster create \
    --cluster-name "vpn-test-cluster" \
    --resource-group "vpn-test-rg" \
    --location "eastus2" \
    --azure-connection-method "VPN" \
    --initial-cassandra-admin-password "password"
    ```

1. Use the following command to see the cluster properties. From the output, make a copy of the `privateLinkResourceId` ID:

    ```bash
    az managed-cassandra cluster show \
    --resource-group "vpn-test-rg" \
    --cluster-name "vpn-test-cluster"
    ```

1. On the portal, [create a private endpoint](../cosmos-db/how-to-configure-private-endpoints.md)
    1. On the Resource tab, select "Connect to an Azure resource by resource ID or alias." as the connection method and `Microsoft.Network/privateLinkServices` as the resource type. Enter the `privateLinkResourceId` from step (2).
    1. On the Virtual Network tab, select your virtual network's subnet and make sure to select the option for "Statically allocate IP address."
    1. Validate and create.

   > [!NOTE]
   > At the moment, the connection between our management service and your private endpoint requires the Azure Managed Instance for Apache Cassandra team cassandra-preview@microsoft.com to approve it.
    
1. Get the IP address of your private endpoint NIC.

1. Create a new data center using the IP address from (5) as the `--private-endpoint-ip-address` parameter.


## Next steps
- Learn about [hybrid cluster configuration](configure-hybrid-cluster.md) in Azure Managed Instance for Apache Cassandra.
