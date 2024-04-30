---
author: cherylmc
ms.author: cherylmc
ms.date: 04/29/2024
ms.service: bastion
ms.topic: include

---
Private-only Bastion deployments lock down workloads end-to-end by creating a non-internet routable deployment of Bastion that allows only private IP address access. Private-only Bastion deployments don't allow connections to the bastion host via public IP address. In contrast, a regular Azure Bastion deployment allows users to connect to the bastion host using a public IP address.

The following diagram shows the Bastion private-only deployment architecture. A user that's connected to Azure via ExpressRoute private-peering can securely connect to Bastion using the private IP address of the bastion host. Bastion can then make the connection via private IP address to a virtual machine that's within the same virtual network as the bastion host. In a private-only Bastion deployment, Bastion doesn't allow outbound access outside of the virtual network.
