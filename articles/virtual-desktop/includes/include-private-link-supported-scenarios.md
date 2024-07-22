---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 04/25/2024
---

1. All parts of the connection - initial feed discovery, feed download, and remote session connections for clients and session hosts - use private routes. You need the following private endpoints:
   
   | Purpose | Resource type | Target sub-resource | Endpoint quantity |
   |--|--|--|--|
   | Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool |
   | Feed download | Microsoft.DesktopVirtualization/workspaces | feed | One per workspace |
   | Initial feed discovery | Microsoft.DesktopVirtualization/workspaces | global | **Only one for all your Azure Virtual Desktop deployments** |

1. Feed download and remote session connections for clients and session hosts use private routes, but initial feed discovery uses public routes. You need the following private endpoints. The endpoint for initial feed discovery isn't required.
   
   | Purpose | Resource type | Target sub-resource | Endpoint quantity |
   |--|--|--|--|
   | Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool |
   | Feed download | Microsoft.DesktopVirtualization/workspaces | feed | One per workspace |

1. Only remote session connections for clients and session hosts use private routes, but initial feed discovery and feed download use public routes. You need the following private endpoint(s). Endpoints to workspaces aren't required.

   | Purpose | Resource type | Target sub-resource | Endpoint quantity |
   |--|--|--|--|
   | Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool |

1. Both clients and session host VMs use public routes. Private Link isn't used in this scenario.

> [!IMPORTANT]
> - If you create a private endpoint for initial feed discovery, the workspace used for the global sub-resource governs the shared Fully Qualified Domain Name (FQDN), facilitating the initial discovery of feeds across all workspaces. You should create a separate workspace that is only used for this purpose and doesn't have any application groups registered to it. Deleting this workspace will cause all feed discovery processes to stop working.
>
> - You can't control access to the workspace used for the initial feed discovery (global sub-resource). If you configure this workspace to only allow private access, the setting is ignored. This workspace is always accessible from public routes.
>
> - IP address allocations are subject to change as the demand for IP addresses increases. During capacity expansions, additional addresses are needed for private endpoints. It's important you consider potential address space exhaustion and ensure sufficient headroom for growth. For more information on determining the appropriate network configuration for private endpoints in either a hub or a spoke topology, see [Decision tree for Private Link deployment](/azure/architecture/networking/guide/private-link-hub-spoke-network#decision-tree-for-private-link-deployment).
