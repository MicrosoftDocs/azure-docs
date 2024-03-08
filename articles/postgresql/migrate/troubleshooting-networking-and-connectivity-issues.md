---
title: "Troubleshooting networking and connectivity errors in Single to Flex Migration tool"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Troubleshooting guide to fix network and connectivity issues in Single to Flex migration tool.
author: shriram-muthukrishnan
ms.author: shriramm
ms.reviewer: maghan
ms.date: 06/14/2023
ms.service: postgresql
ms.topic: conceptual
---

# Troubleshooting networking and connectivity errors in Single to Flex Migration tool

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

In this document, we focus on how to troubleshoot migrations that failed due to networking or connectivity issues between Single and Flexible server. Refer [this link](concepts-single-to-flexible.md) to know the list of supported networking configurations by the Single to Flex migration tool.

In a particular single to flexible server migration, if the flexible server isn't able to connect to single server, the migration fails with the following error message:
**ST008: Connectivity attempt to source single server from target flexible server failed. Please revisit the networking related prerequisites required for migration and make sure the source server is reachable from target server.**

The first step in troubleshooting these migration failures would be to inspect the network settings on your single and flexible server.

1. Click on the connection security blade on your single server.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/public-access-in-single-server.png" alt-text="Screenshot of public access networking configuration in single server." lightbox="media/troubleshooting-networking-and-connectivity-issues/public-access-in-single-server.png":::

    If **Deny public network access** is set to **No**, then single server is in public access.
    
    If set to **Yes**, then single server is in private access.

2. Click on the Networking blade on your flexible server.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/public-access-in-flexible-server.png" alt-text="Screenshot of public access networking configuration in flexible server." lightbox="media/troubleshooting-networking-and-connectivity-issues/public-access-in-flexible-server.png":::

    Check the **Connectivity method** parameter to see if flexible server is in public access or private access.

If both Single and Flexible server are in public access, you are unlikely to hit the above error message since the single to flex migration tool automatically establishes connectivity between flexible server and single server. So we have three scenarios which can throw error messages related to connectivity:

 - Private Access in Source and Public Access in Target 
 - Public Access in Source and Private Access in Target
 - Private Access in Source and Private Access in Target

Let us look at these scenarios in detail.

The following table can help to jump start troubleshooting connectivity issues.

| Single Server | Flexible Server | Troubleshooting Tips |
| :--- | :--- | :--- |
| Public Access | Public access  | No action needed. Connectivity should be established automatically. |
| Private Access | Public access | Non supported network configuration. [Visit this section to learn more](#private-access-in-source-and-public-access-in-target) |
| Public Access in source without private end point | Private access  | [Visit this section for troubleshooting](#public-access-in-source-without-private-end-points) |
| Public Access in source with private end point | Private access  | [Visit this section for troubleshooting](#public-access-in-source-with-private-end-points) |
| Private Access | Private access  | [Visit this section for troubleshooting](#private-access-in-source-and-private-access-in-target) |

## Private access in source and public access in target
This network configuration is not supported by Single to Flex migration tooling. In this case, you can opt for other migration tools to perform migration from Single Server to Flexible server such as [pg_dump/pg_restore](../single-server/how-to-upgrade-using-dump-and-restore.md).

## Public access in source and private access in target
There are two possible configurations for your source server in this scenario.
- Public access in source without private end points.
- Public access in source with private end points.

Let us look into the details of setting network connectivity between the target and source in the above scenarios.

### Public access in source without private end points
In this case, single server needs to allowlist connections from the subnet in which flexible server is deployed. You can perform the following steps to set up connectivity between single and flexible server.

1. Go to the VNet rules sections in the Connection Security blade of your single server and click on the option **Adding existing virtual network**.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/add-vnet-rule-single-server.png" alt-text="Screenshot of adding a vnet rule in single server." lightbox="media/troubleshooting-networking-and-connectivity-issues/add-vnet-rule-single-server.png":::

2. In the right fan out blade, provide a valid name for this rule and choose the subscription, vnet and subnet details of your flexible server and click **OK**.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/allow-flexible-server-subnet.png" alt-text="Screenshot of creating vnet rule to allow list subnet of flexible server." lightbox="media/troubleshooting-networking-and-connectivity-issues/allow-flexible-server-subnet.png":::

Once the settings are applied, the connection from flexible server to single server will be established and you'll no longer hit this issue.

### Public Access in source with private end points
In this case, the connection will be routed through private end point. Refer to the steps mentioned in the following section about establishing connectivity in case of private access in source and private access in target. 
## Private access in source and private access in target

1. If a single server is in private access, then it can be accessed only through private end points. Get the VNet and subnet details of the private end point by clicking on the private endpoint name.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/private-endpoint-single-server.png" alt-text="Screenshot of private endpoint connection in single server." lightbox="media/troubleshooting-networking-and-connectivity-issues/allow-flexible-server-subnet.png":::

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/vnet-details-single-server.png" alt-text="Screenshot showing vnet and subnet details of single server's private endpoint." lightbox="media/troubleshooting-networking-and-connectivity-issues/vnet-details-single-server.png":::

2. Get the Vnet and subnet details from the **Networking** blade of your flexible server.

3. If both are in different VNets, you need to [enable VNet peering to establish connection from one Vnet to another](../../virtual-network/tutorial-connect-virtual-networks-portal.md). If they are in the same VNet but in different subnets, peering isn't required. Make sure that there are [no network security groups(NSG) blocking the traffic from flexible server to single server](../../virtual-network/network-security-group-how-it-works.md).

4. Go to the **Networking** blade on the flexible server and check if a private DNS zone is being used. If used, open this private DNS zone in portal. In the left pane, click on the **Virtual network links** and check if the Vnet of single server and flexible server is added to this list.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-vnet-link.png" alt-text="Screenshot vnet linked to a private DNS Zone." lightbox="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-vnet-link.png":::

    If not, click on the **Add** button and create a link for the VNets of single and flexible server to this private DNS zone.

5. Go to the private endpoint on your single server and click on the **DNS configuration** blade. Check if a private DNS zone is attached with this end point. If not, attach a private DNS zone by clicking on the **Add Configuration** button.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-private-end-point.png" alt-text="Screenshot showing a private DNS Zone used in private end point." lightbox="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-private-end-point.png":::

6. Click on the Private DNS zone on your single server private end point and check if the Vnets of single server and flexible server are added to the Virtual network links. If not, follow the steps mentioned in the above step to add the links to the Vnets of single and flexible server to this private DNS zone.

7. The final check would be to go the private DNS zone of the private end point on your single server and check if there exists an **A record** for your single server that points a private IP address.

    :::image type="content" source="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-arecord.png" alt-text="Screenshot showing a private IP address assigned to private end point." lightbox="media/troubleshooting-networking-and-connectivity-issues/private-dns-zone-arecord.png":::

If all the above steps are performed, the connection from flexible server to single server will be established and you'll no longer hit this issue.

## Next steps

- [Migrate to Flexible Server by using the Azure portal](../migrate/how-to-migrate-single-to-flexible-portal.md)
- [Migrate to Flexible Server by using the Azure CLI](../migrate/how-to-migrate-single-to-flexible-cli.md)


