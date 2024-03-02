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

Azure Managed Instance for Apache Cassandra nodes require access to many other Azure services when they're injected into your virtual network. Normally, you enable this access by ensuring that your virtual network has outbound access to the internet. If your security policy prohibits outbound access, you can configure firewall rules or user-defined routes for the appropriate access. For more information, see [Required outbound network rules](network-rules.md).

However, if you have internal security concerns about data exfiltration, your security policy might prohibit direct access to these services from your virtual network. By using a virtual private network (VPN) with Azure Managed Instance for Apache Cassandra, you can ensure that data nodes in the virtual network communicate with only a single VPN endpoint, with no direct access to any other services.

> [!IMPORTANT]
> The ability to use a VPN with Azure Managed Instance for Apache Cassandra is in public preview. This feature is provided without a service-level agreement, and we don't recommend it for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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

    From the output, make a copy of the `privateLinkResourceId` ID.

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
