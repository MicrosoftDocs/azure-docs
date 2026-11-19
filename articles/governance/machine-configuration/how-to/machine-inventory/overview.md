---
title: Machine Inventory overview
description: Learn how machine inventory provides visibility into software, services, certificates, accounts, and server roles across your machines.
ms.date: 11/07/2026
ms.topic: overview
ms.service: azure-machine-configuration
---

# Machine Inventory overview (preview)

The machine inventory feature provides read-only visibility into guest-level resources on your machines. Use it to review installed software, inspect services, identify expiring certificates, and understand local users and group membership. You can browse inventory in the Azure portal or query it across machines by using Azure Resource Graph.

The machine inventory feature supports inventory collected from Windows and Linux Azure virtual machines (VMs) and Azure Arc-enabled servers. Microsoft Configuration Manager Connected Inventory provides a separate collection path for servers managed through Configuration Manager.

Choose the collection path that matches how you manage your machines.

| Collection path | How data reaches Azure | Get started |
| --- | --- | --- |
| Agent-based inventory | Azure Policy enables inventory collection through Machine Configuration on Azure VMs and Arc-enabled servers. Collected inventory is available in Azure Resource Graph. | [Enable machine inventory](enable-machine-inventory.md) |
| Configuration Manager Connected Inventory | An Azure Arc connector publishes existing Configuration Manager inventory for selected device collections. This path doesn't install the Azure Connected Machine agent on each managed server. | [Enable Connected Inventory](configuration-manager-connected-inventory.md) |


## Prerequisites

Before you begin, ensure you have:

- An Azure subscription and a resource group for the machines or synchronized server resources.
- Permissions to view the machines and their inventory in the Azure scope you want to explore.
- The prerequisites for your collection path:

| Collection path | Required setup |
| --- | --- |
| Agent-based inventory | Windows or Linux Azure VMs, or servers connected through Azure Arc; the applicable [Machine Configuration prerequisites](../../overview/02-setup-prerequisites.md); and permissions to assign Azure policies at the target scope. For Azure VMs, assign the prerequisite initiative described in [Enable machine inventory](enable-machine-inventory.md) before assigning inventory policies. |
| Configuration Manager Connected Inventory | A Configuration Manager site with managed servers and device collections, a configured Azure Arc connector, the required Configuration Manager console extension, and permissions to configure the connection and access its Azure destination. See [Connected Inventory prerequisites](configuration-manager-connected-inventory.md#prerequisites). |


## Getting started

1. **Choose and enable a collection path.** For Azure VMs and Azure Arc-enabled servers, follow [Enable machine inventory](enable-machine-inventory.md) to assign the prerequisites and the inventory policies that match your machines' operating systems. For servers managed through Configuration Manager, follow [Enable Configuration Manager Connected Inventory](configuration-manager-connected-inventory.md) to select the device collections to publish to Azure.
2. **Verify that inventory is available.** For agent-based inventory, check the policy assignments and Machine Configuration health, and then open **machine inventory (preview)** in the Azure portal and select the target subscription and resource group. For Connected Inventory, open a synchronized server from the connector's **Devices** page and select **machine inventory (preview)**. Connected Inventory can take up to 24 hours to appear after enablement.
3. **Explore your inventory.** Review a category available for your machines, such as applications or certificates on Windows, and use filters to narrow the results. To browse records or run Azure Resource Graph queries across machines, see [View and query machine inventory](view-and-query-machine-inventory.md).

## Inventory categories

You can view the following inventory resource types in the `guestconfigurationresources` table in Azure Resource Graph.

| Platform | Inventory category | Resource type |
| --- | --- | --- |
| Windows | Applications | `microsoft.guestconfiguration/applications` |
| Windows | Services | `microsoft.guestconfiguration/services` |
| Windows | Users | `microsoft.guestconfiguration/users` |
| Windows | Groups | `microsoft.guestconfiguration/groups` |
| Windows | Certificates | `microsoft.guestconfiguration/certificates` |
| Windows | Windows Server roles | `microsoft.guestconfiguration/windowsroles` |
| Linux | Daemons | `microsoft.guestconfiguration/daemons` |
| Linux | Software | `microsoft.guestconfiguration/softwares` |

Configuration Manager Connected Inventory also exposes device-collection membership as `microsoft.guestconfiguration/devicecollections`.

## Considerations

- Inventory is a read-only view. Reviewing an application, account, certificate, or service doesn't change its configuration.
- Inventory availability and category coverage depend on the machine's platform and collection path.
- Configuration Manager Connected Inventory refreshes daily, and inventory can take up to 24 hours to appear after enablement.


## Next steps

- [Enable machine inventory on Azure VMs and Arc-enabled servers](enable-machine-inventory.md).
- [View and query machine inventory](view-and-query-machine-inventory.md).
- [Enable Configuration Manager Connected Inventory](configuration-manager-connected-inventory.md).
