---
title: "Create a public IP network connector: Azure Modeling and Simulation Workbench"
description: Learn how to deploy a public network connector for an Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 10/11/2024

# Customer intent: As Workbench Owner in Azure Modeling and Simulation Workbench, I want to set up public IP networking connector for chamber access.
---

# Set up a public IP network connector

In Azure Modeling and Simulation Workbench, you can deploy a [connector](./concept-connector.md) that is accessible directly from the internet. The public IP connector uses publicly facing IP addresses. By default, access is denied to all incoming IP addresses and must be explictly granted through a specifying an address or address ranges. Public connectors are useful for training sessions, workforce development scenarios, or other open work environments with stable or very shortterm access requirements. All acccess to a chamber occurs through a connector, both the desktop session and the file transfers through the [data pipeline](./concept-data-pipeline.md) are controlled.

Public connectors are not recommended for use in organzations that:

* Have complex network infrastructure
* Use proxies
* Require users to access resources through managed VPN user endpoints
* Have requirements to individually catalog cloud service endpoings
* Have restrictions on the use of non-standard destination ports

## Prerequisites

[!INCLUDE [prerequisite-account-sub](includes/prerequisite-account-sub.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

## Create the public IP connector

Each chamber can have only one connector. If you have a private connector or other type connector already associated with the target chamber, you must first [delete the connector](#delete-a-connector). In the chamber where you want to create a public network connector:

1. Select the **Connector** option in the **Settings** at the left.
    :::image type="content" source="media/howtoguide-private-network/chamber-select-connector.png" alt-text="Screenshot of chamber overview with Connector option outlined in red rectangle.":::
1. In the **Connector** list screen, select **Create** from the action bar along the top.
    :::image type="content" source="media/howtoguide-private-network/connector-create.png" alt-text="Screenshot of Connector overview page with Create button highlighted in red.":::
1. On the **Create chamber connector** page, on **Chamber Connector** tab, enter a **Name** for the connector.
1. Choose whether the copy/paste permission should be enabled for the chamber. You can learn about security boundary implications copy and paste in the [Enable copy/paste in Azure Modeling and Simulation Workbench](how-to-guide-enable-copy-paste.md) article.
1. Under **Network Access**, select **None** in **Connect on-premises network**.
1. Select **Review + create**.
1. If validation passes, select **Create**. Private networking connectors take approximately 30 minutes to deploy.

## Manage allowed public IP addresses

IP addresses can be allowlisted in the Azure portal to allow connections to a chamber. Only one IP address can be specified for a Public IP connector when creating a new Workbench. After the connector is created, you can specify other IP addresses. Standard [CIDR (Classless Inter-Domain Routing)](/azure/virtual-network/virtual-networks-faq) mask notation can be used to allow ranges of IP addresses across a subnet.

Addresses and address ranges must not overlap. The CIDR mask is limited at a /24 address space. If larger address spaces are required, you will need to create that address space using /24 subnets.

Workbench Owners and Chamber Admins can add to and edit the allowlisted public addresses for a connector after the connector object is created.

### Add, edit or delete IP addresses or ranges

IP addresses and ranges must be explicitly added in order to allow access to the chamber. To edit the list of allowed IP addresses:

1. Navigate to the connector where the changes will occur.
1. In the left pane, select the **Networking** option under the **Settings** section. The list of current IP addresses will appear.
1. Select **Edit allowed IP**. From here, you can delete existing IP addresses or add new ones.
    :::image type="content" source="media/howtoguide-public-network/edit-allowlist.png" alt-text="Screenshot of public connector overview with Networking settings and Edit buttons highlighted in red.":::
1. Add, edit, or delete operations can be done from the flyout menu.
    * To add an IP address or range, select the **Add** button and enter a single address.
    * To delete an IP entry, first select the record, then select **Delete**.
    * To edit an IP entry, select the pencil icon on the right, then edit the entry.
        :::image type="content" source="media/howtoguide-public-network/edit-allowed-ip.png" alt-text="Screenshot of edit allowed IP page with Add, Delete, select box, edit icon and Save button highlighted in red.":::
1. Select **Save** to save your changes.
1. Select **Submit** to submit the updated allowlist to the connector.
1. Refresh the view for connector networking and confirm that your changes appear.

> [!TIP]
> Use the smallest address range possible to limit access only to IP addresses you intend. Frequently review the list of IP addresses you have given access to and review logs to determine list management activity.

### Export the allowlist

The allowlist for a public connector is saved as part of the properties bundle in JSON format. If you would like to export the allowlist for later reference or to recreate the same list in a new connector, you need to access the connector's JSON template. You need to be on the connector overview page in the portal before proceeding.

1. Select the **JSON View** text on the right of the **Essentials** pane.
    :::image type="content" source="media/howtoguide-public-network/connector-overview-json.png" alt-text="Screenshot of connector essentials pane with JSON View link highlighted in red.":::

#### [Azure portal](#tab/portal)

In the portal, scroll down to the *networkAcls* section of the JSON and select the *allowedAddressSpaces* section and copy it to a safe location.

:::image type="content" source="media/howtoguide-public-network/resource-json-networkAcls.png" alt-text="Screenshot of resource JSON page of the connector with the networkAcls clause highlighted in red.":::

#### [PowerShell](#tab/powershell)

If you want to export the JSON using PowerShell, you need to have the Resource ID of the connector. In the JSON view, select the copy icon in the right-hand side of the Resource ID textbox. Assign the Resource Id to a variable.

In a PowerShell client, retrieve the connector's property bundle.

```powershell
(Get-AzResource -ResourceId $ResourceId | Select-Object -ExpandProperty properties).networkAcls
```

---

## Immediately terminate access

Deleting an IP address from the connector allowlist doesn't terminate active sessions. Only new sessions, unestablished are denied. To immediately terminate a session from an address or range, [delete](#add-edit-or-delete-ip-addresses-or-ranges) the address entry from the allowlist, submit the changes, then [stop or restart the connector](./how-to-guide-start-stop-restart.md).

## Idle the connector

Idle mode sets the chambers into a preserved, but inactive state. Costs are significantly reduced while still maintaining your configuration and settings. Learn more about idle mode in the [Manage chamber idle mode](how-to-guide-chamber-idle.md) article.

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
> The pool of IP addresses can increase not only by adding VMs, but users as well. Connection nodes are scaled up or down when users are added to or removed from the chamber. Any discovery of endpoint IP addresses will be incomplete if the userbase changes.

For more control over destination IP addresses and to minimize changes to corporate firewalls, a [private networking connector](how-to-guide-private-network.md) is recommended. When using a VPN Gateway, the access point of the workbench is limited only to the gateway IP address or directly from a peered virtual network.

Network interfaces aren't deployed to the user's subscription and are therefore not visible. User's can't attach network security groups (NSG) nor can they apply other Azure networking services such as firewalls to these interfaces.

## DNS zones

Modeling and Simulation Workbench creates three private domain name service (DNS) zones for a private network deployment. Each zone corresponds to one of the workbench services for file uploading, file downloading, and desktop connections. No DNS server is created. Administrators must join the zones to their own services.

| Service                               | Public cloud DNS zone | Azure Gov cloud DNS Zone    |
|:--------------------------------------|:----------------------|-----------------------------|
| Connector desktop dashboard and nodes | mswb.azure.com        | mswb.azure.us               |
| Data in pipeline endpoint             | blob.core.windows.net | blob.core.usgovcloudapi.net |
| Data out pipeline endpoint            | file.core.windows.net | blob.core.usgovcloudapi.net |

## Delete a connector

If you wish to delete the workbench, chamber, or change the connector type, you must first delete the connector. You do not need to delete the IP addresses before deleting a connector, nor does the connector need to be stopped.

1. Navigate to the connector to be deleted.
1. Select **Delete** from the action bar.

The delete operation takes approximately eight minutes. Connections are immediately terminated and all allowed addresses are deleted.

## Related content

* [Manage chamber idle mode](how-to-guide-chamber-idle.md)
* [Export data from Azure Modeling and Simulation Workbench](how-to-guide-download-data.md)
* [Import data into Azure Modeling and Simulation Workbench](how-to-guide-upload-data.md)
