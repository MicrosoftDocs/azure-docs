---
title: "Create a private network connector: Azure Modeling and Simulation Workbench"
description: Learn how to deploy a private connector for a virtual private network.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 09/21/2024

#CustomerIntent: As a Workench Owner for Azure Modeling and Simulation Workbench, I want to deploy a connector onto a private virtual network.
---

# Set up a private networking connector

In Azure Modeling and Simulation Workbench, you can deploy a [connector](./concept-connector.md) to a virtual network, rather than to public facing IP addresses. Deploying to a private address virtual network allows you to enable access to your workbench through a virtual private network (VPN) gateway or from other Azure resources without exposing it to the internet.

## Prerequisites

[!INCLUDE [prerequisite-account-sub](includes/prerequisite-account-sub.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

## Create or designate a virtual network

Modeling and Simulation Workbench requires a virtual network with a subnet name 'default.' If you don't have a virtual network already created, [create one before continuing](/azure/virtual-network/quick-create-portal).

## Assign roles

Before you create a [connector](./concept-connector.md) for private IP networking via VPN or ExpressRoute, the Workbench needs a role assignment to allow it to deploy resources into your resource group. Modeling and Simulation Workbench requires the **Network Contributor** role  for the resource group in which you're hosting your virtual network.

| Setting              | Value                                       |
|:---------------------|:--------------------------------------------|
| **Role**             | **Network Contributor**                     |
| **Assign access to** | **Resource group**       |
| **Members**          | **Azure Modeling and Simulation Workbench** |

[!INCLUDE [azure-hpc-workbench-alert](includes/azure-hpc-workbench-alert.md)]

## Create the private network connector

Each chamber can have only one connector. If you have a public IP connector or other type already associated with the target chamber, you must first [delete the connector](#delete-a-connector). In the chamber where you want to create a private network connector:

1. Select the **Connector** option in the **Settings** at the left.
    :::image type="content" source="media/howtoguide-private-network/chamber-select-connector.png" alt-text="Screenshot of chamber overview with Connector option outlined in red rectangle.":::
1. In the **Connector** list screen, select **Create** from the action bar along the top.
    :::image type="content" source="media/howtoguide-private-network/connector-create.png" alt-text="Screenshot of Connector overview page with Create button highlighted in red.":::
1. On the **Create chamber connector** page, on **Chamber Connector** tab, enter a **Name** for the connector.
1. Choose whether the copy/paste permission should be enabled for the chamber. You can learn about security boundary implications copy and paste in the [Enable copy/paste in Azure Modeling and Simulation Workbench](how-to-guide-enable-copy-paste.md) article.
1. Under **Network Access**, select **VPN** in **Connect on-premises network**.
1. In **Virtual Network**, select the virtual network you designated or created in [Create or designate a virtual network](#create-or-designate-a-virtual-network) earlier.
1. Select the *default* **Subnet**.
    :::image type="content" source="media/howtoguide-private-network/create-private-network.png" alt-text="Screenshot of chamber connector with VPN and Review+Create button highlighted in red.":::
1. Select **Review + create**.
1. If validation passes, select **Create**. Private networking connectors take approximately 30 minutes to deploy.

## Network interfaces and private endpoints

When the Modeling and Simulation Workbench creates a private connector, it deploys the following resources in the same resource group and location as the workbench.

Six [network interfaces](/azure/virtual-network/virtual-network-network-interface) (NIC) and corresponding [private endpoints](/azure/private-link/private-endpoint-overview) are created. The NICs are all joined to the private virtual network and subnet specified during setup and given an address on the subnet. The private endpoint connects the NIC to Modeling and Simulation resources hosted in the Microsoft managed environment. The resulting connection becomes part of an [Azure Private Link](/azure/private-link/private-link-overview) service.

* Two connections are created for connection nodes. As users and virtual machines (VM) are added to a chamber, more connection nodes are created.
* One connection for data in pipeline.
* One connection for data out pipeline.
* One connection for load balancer.
* One connection for user authentication services.

## DNS zones

Modeling and Simulation Workbench creates three private domain name service (DNS) zones for a private network deployment. Each zone corresponds to one of the workbench services for file uploading, file downloading, and desktop connections. No DNS server is created. Administrators must join the zones to their own services.

| Service                               | Public cloud DNS zone             | Azure Gov cloud DNS Zone                |
|:--------------------------------------|:----------------------------------|-----------------------------------------|
| Connector desktop dashboard and nodes | mswb.azure.com                    | mswb.azure.us                           |
| Data in pipeline endpoint             | privatelink.blob.core.windows.net | privatelink.blob.core.usgovcloudapi.net |
| Data out pipeline endpoint            | privatelink.file.core.windows.net | privatelink.blob.core.usgovcloudapi.net |

## Ports and IP addresses

### Ports and protocols

The Azure Modeling and Simulation Workbench require certain ports to be accessible from users workstation. Firewalls and VPNs might block access on these ports to certain destinations, when accessed from certain applications, or when connected to different networks. Check with your system administrator to ensure your client can access the service from all your work locations. All traffic to the chamber passes through the connector and the virtual network gateway or peer. Administrators can choose to implement a firewall or network security group to restrict traffic.

* **53/TCP** and **53/UDP**: DNS queries.
* **443/TCP**: Standard https port for accessing the VM dashboard and any Azure portal page.
* **5510/TCP**: Used by the ETX client to provide VDI access for both the native and web-based client.
* **8443/TCP**: Used by the ETX client to negotiate and authenticate to ETX management nodes.

### IP addresses

The private network connector doesn't deploy any public IP network interfaces or gateways. You must create your own gateway interface if connecting directly from the internet or peer the virtual network to another. The region you deploy your gateway interface to determines from which pool of Azure public IP addresses your gateway IP is chosen. Azure IP addresses are taken from Azure's IP ranges for the location in which the Workbench was deployed. A list of all Azure IP addresses and Service tags is available at [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519&msockid=1b155eb894cc6c3600a84ac5959a6d3f).

The private IP addresses for the private networking connector are implemented as private network interface connections (NIC) on the virtual network's subnet you specified during initial deployment.

Unlike the public connector, the network interfaces are deployed into your customer subscription and you can associate a network security group (NSG) with the interfaces, the virtual network, or configure a firewall on the virtual network or gateway.

## Immediately terminate access

Access to the chambers can be immediately terminated by [stopping the connector](./how-to-guide-start-stop-restart.md).

## Idle the connector

Idle mode sets the chambers into a preserved, but inactive state. Costs are reduced while still maintaining your configuration and settings. Learn more about idle mode in the [Manage chamber idle mode](how-to-guide-chamber-idle.md) article.

## Start, stop, or restart a connector

Connectors are controllable resources that can be stopped, started, restarted as needed. Instructions on how to are included in [Start, stop, and restart chambers, connectors, and VMs](how-to-guide-start-stop-restart.md). Stopping or restarting the connector interrupts desktop services and data pipelines for all users of the chamber. Stopping the connector is required to [idle a chamber](how-to-guide-chamber-idle.md) to reduce consumption costs.

## Delete a connector

If you wish to delete the workbench or change the connector type, you must first delete the connector. Child resources must be deleted first.

1. Delete all private endpoints and network interfaces.
1. Delete virtual network links within each DNS zone.
1. Delete each DNS zone.

Once those resources are deleted, the connector can be deleted. The virtual network doesn't need to be deleted since it has no dependencies.

## Related content

* [Manage chamber idle mode](how-to-guide-chamber-idle.md)
* [Export data from Azure Modeling and Simulation Workbench](how-to-guide-download-data.md)
* [Import data into Azure Modeling and Simulation Workbench](how-to-guide-upload-data.md)
