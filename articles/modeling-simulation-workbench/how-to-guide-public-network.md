---
title: "Create a public IP network connector: Azure Modeling and Simulation Workbench"
description: Learn how to deploy a public network connector for an Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 10/11/2024

# Customer intent: As Workbench Owner in Azure Modeling and Simulation Workbench, I want to set up public IP networking connector for chamber access.
---

# Set up a public IP network connector

In Azure Modeling and Simulation Workbench, you can deploy a [connector](./concept-connector.md) that is accessible directly from the internet. The public IP connector uses publicly facing IP addresses. By default, access is denied to all incoming IP addresses and must be explicitly granted through a specifying an address or address ranges. Public connectors are useful for training sessions, conferences, or other open work environments with stable or short-term requirements. Both desktop and [data pipeline](./concept-data-pipeline.md) access are managed through the connector's allowlist.

## Suitability

Public connectors aren't recommended for use in scenarios in which the organization:

* Has complex network and security infrastructure
* Uses proxies, especially managed services with large number of exit nodes shared with other customers
* Requires users to access corporate resources through managed VPN before accessing the internet or cloud services
* Has requirements to individually catalog cloud service IP addresses
* Has restrictions on the use of nonstandard destination ports
* Frequently rotates externally facing IP exit addresses, either through intentionally short DHCP leases or random exit IPs
* Requires firewalls or custom network security at the perimeter for cloud services
* Requires all cloud services to be connected to a virtual network

If these situations apply, a [private networking connector](how-to-guide-private-network.md) is recommended instead.

## Prerequisites

[!INCLUDE [prerequisite-account-sub](includes/prerequisite-account-sub.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

## Create the public IP connector

A chamber can have only one connector. If you have another type of connector already associated with the target chamber, you must first [delete the connector](#delete-a-connector) before creating a public connector. In the chamber where you want to create a public network connector:

1. Select the **Connector** option in the **Settings** at the left.
    :::image type="content" source="media/howtoguide-private-network/chamber-select-connector.png" alt-text="Screenshot of chamber overview with Connector option outlined in red rectangle.":::
1. In the **Connector** list screen, select **Create** from the action bar along the top.
    :::image type="content" source="media/howtoguide-private-network/connector-create.png" alt-text="Screenshot of Connector overview page with Create button highlighted in red.":::
1. On the **Create chamber connector** page, on the **Chamber Connector** tab, enter a **Name** for the connector.
1. Choose whether the copy/paste permission should be enabled for this chamber. You can learn about security implications from enabling copy and paste in the [Enable copy/paste in Azure Modeling and Simulation Workbench](how-to-guide-enable-copy-paste.md) article.
1. Under **Network Access**, select **None** in **Connect on-premises network**.
1. Select **Review + create**.
1. If validation passes, select **Create**. Public network connectors take approximately 30 minutes to deploy.

## Manage allowed public IP addresses

IP addresses can be allowlisted in the Azure portal to allow connections to a chamber from public IPs. During workbench creation, only a single IP address or range can be specified. After the connector is created, workbench owners and Chamber Admins can add, delete, or edit the allowlist. Standard [CIDR (Classless Inter-Domain Routing)](/azure/virtual-network/virtual-networks-faq) mask notation is used to define subnet ranges.

Addresses or address ranges must not overlap. The CIDR mask has a maximum size of a /24 address space. If larger address spaces are required, create that address space using a series of /24 subnets.

### Add, edit, or delete IP addresses or ranges

IP addresses and ranges must be explicitly added in order to allow access to the chamber. To add to, delete from, or edit the allowlist:

1. Navigate to the connector.
1. In the left pane, select the **Networking** option under the **Settings** section. The list of current IP addresses appear.
1. Select **Edit allowed IP**.
    :::image type="content" source="media/howtoguide-public-network/edit-allowlist.png" alt-text="Screenshot of public connector overview with Networking settings and Edit buttons highlighted in red.":::
1. Add, edit, or delete operations are done from the flyout menu.
    * To add an IP address or range, select the **Add** button and enter a single address.
    * To delete an IP entry, first select the record, then select **Delete**.
    * To edit an IP entry, select the pencil icon at right, then edit the entry.
        :::image type="content" source="media/howtoguide-public-network/edit-allowed-ip.png" alt-text="Screenshot of edit allowed IP page with Add, Delete, select checkbox, edit icon and Save button highlighted in red.":::
1. Select **Save** to save your changes and stage for processing.
1. Select **Submit** to submit the updated allowlist to the connector.
1. Refresh the view for connector networking to confirm your changes.

> [!TIP]
> Use the smallest address range possible to limit access only to IP addresses you intend. Frequently review the list of IP addresses you have given access to and review logs to determine list management activity.

### Export the allowlist

The allowlist for a public connector is a component of the properties bundle in the Azure object. If you would like to export the allowlist for later reference or to recreate the same list, you need to access the connector's JSON template. Navigate to the connector overview page in the portal before proceeding.

1. Select the **JSON View** text from the **Essentials** pane.
    :::image type="content" source="media/howtoguide-public-network/connector-overview.png" alt-text="Screenshot of connector essentials pane with JSON View link highlighted in red." lightbox="media/howtoguide-public-network/connector-overview-json-zoom.png":::

#### [Azure portal](#tab/portal)

In the portal, scroll down to the *networkAcls* section of the JSON and select the *allowedAddressSpaces* section and copy it to a safe location.

:::image type="content" source="media/howtoguide-public-network/resource-json-network-acls.png" alt-text="Screenshot of resource JSON page of the connector with the networkAcls clause highlighted in red.":::

#### [PowerShell](#tab/powershell)

If you want to export the JSON using PowerShell, you need to have the Resource ID of the connector. In the JSON view, select the copy icon in the right-hand side of the Resource ID textbox. Assign the Resource ID to a variable.

In a PowerShell client, retrieve the connector's property bundle.

```azurepowershell
$ResourceId = <yourResourceId>
$connectorProperties = Get-AzResource -ResourceId $ResourceId | Select-Object -ExpandProperty properties
$connectorProperties.networkAcls
```

---

## Immediately terminate access

Deleting an IP address from the connector allowlist doesn't terminate active sessions. Only new, unestablished sessions are denied. To immediately terminate a session from an IP address or range, [delete](#add-edit-or-delete-ip-addresses-or-ranges) the address entry from the allowlist, submit the changes, then [restart the connector](./how-to-guide-start-stop-restart.md#restart-a-chamber-connector-or-vm).

## Idle the connector

Idle mode places a chamber into an inactive, low-cost state without having to delete resources or move data. Costs are reduced while still maintaining your configuration, data, and settings. Learn more about idle mode in the [Manage chamber idle mode](how-to-guide-chamber-idle.md) article.

## Start, stop, or restart a connector

Connectors are controllable resources that can be stopped, started, restarted as needed. Instructions on how to are included in [Start, stop, and restart chambers, connectors, and VMs](how-to-guide-start-stop-restart.md). Stopping or restarting the connector interrupts desktop services and data pipelines for all users of the chamber. Stopping the connector is required to [idle a chamber](how-to-guide-chamber-idle.md) to reduce consumption costs.

## Manage copy/paste control for chambers

Copy/paste is disabled by default for all VMs in the chamber. The connector has a control to enable or disable copy/paste. Learn how to [Enable copy/paste](how-to-guide-enable-copy-paste.md).

## Ports and protocols

The Azure Modeling and Simulation Workbench require certain ports to be accessible from users' workstation. Firewalls and VPNs might block access on these ports to certain destinations, when accessed from certain applications, or when connected to different networks. Check with your system administrator to ensure your client can access the service from all your work locations.

* **53/TCP** and **53/UDP**: DNS queries.
* **443/TCP**: Standard https port for accessing the VM dashboard and any Azure portal page.
* **5510/TCP**: Used by the ETX client to provide VDI access for both the native and web-based client.
* **8443/TCP**: Used by the ETX client to negotiate and authenticate to ETX management nodes.

## IP addresses and network interfaces

For the Public IP connector, Azure IP addresses are taken from Azure's IP ranges for the location in which the Workbench was deployed. A list of all Azure IP addresses and Service tags is available at [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519&msockid=1b155eb894cc6c3600a84ac5959a6d3f). It's not possible to list all Workbench IP addresses when the public IP connector is implemented.

> [!CAUTION]
> The pool of IP addresses can increase not only by adding VMs, but adding users as well. Connection nodes are scaled up or down when users are added to or removed from the chamber. Any discovery of endpoint IP addresses will be incomplete if the userbase changes.

For more control over destination IP addresses and to minimize changes to corporate firewalls, a [private networking connector](how-to-guide-private-network.md) is recommended. A VPN Gateway and the private networking connector allow greater control of the ingress, egress, and name server operations of the workbench. The access point to the workbench is the single gateway IP address or a peered virtual network.

Network interfaces aren't deployed into the user's subscription and aren't accessible to users. Users can't associate network security groups (NSG) nor can they apply other Azure networking services such as firewalls to these interfaces.

## DNS zones

The public connector option uses Azure public DNS servers and creates a CNAME entry for each of your named endpoints in the corresponding zone. The subdomain zone and its corresponding service are listed in the following table. There are three zones for public cloud and two for Azure Government (US) cloud.

| Service                               | Public cloud DNS zone | Azure Gov cloud DNS Zone    |
|:--------------------------------------|:----------------------|-----------------------------|
| Connector desktop dashboard and nodes | mswb.azure.com        | mswb.azure.us               |
| Data in pipeline endpoint             | blob.core.windows.net | blob.core.usgovcloudapi.net |
| Data out pipeline endpoint            | file.core.windows.net | blob.core.usgovcloudapi.net |

## Delete a connector

If you wish to delete the workbench, chamber, or change the connector type, you must first delete the connector. You don't need to delete the IP addresses before deleting a connector, nor does the connector need to be stopped.

1. Navigate to the connector to be deleted.
1. Select **Delete** from the action bar.

The delete operation takes approximately eight minutes. Connections are immediately terminated and all allowed addresses are deleted. If you need to save the addresses, see the [Export the allowlist](#export-the-allowlist) section.

## Related content

* [Manage chamber idle mode](how-to-guide-chamber-idle.md)
* [Quickstart: Connect to desktop](quickstart-connect-desktop.md)
* [Export data from Azure Modeling and Simulation Workbench](how-to-guide-download-data.md)
* [Import data into Azure Modeling and Simulation Workbench](how-to-guide-upload-data.md)
