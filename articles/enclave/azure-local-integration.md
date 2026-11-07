---
title: Azure Enclave and Azure Local integration
description: Learn how Azure Enclave and Azure Local can be used together for hybrid and disconnected scenarios.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 9/3/2026
---

# Azure Enclave and Azure Local integration

Azure Enclave and Azure Local address different parts of a hybrid architecture. Azure Local provides infrastructure and local management capabilities at a customer's site. Azure Enclave provides isolated virtual networks, policy controls, and managed connectivity for workloads running in Azure.

You can use the two services together when local infrastructure needs to exchange data with, or access workloads in, an enclave. The integration is a network connection between the environments; it doesn't place the enclave on the local infrastructure.

## Supported integration patterns

### Connect local infrastructure to an enclave

Azure Local resources can connect to an enclave through a community [transit hub](./what-transit-hub.md). The transit hub provides the connection from the external network to the community's virtual WAN. Use one of the following connection types:

- **VPN Gateway** for a site-to-site VPN connection. See the [VPN Gateway connection template](./deploy-vpn-connection-service-catalog.md).
- **ExpressRoute Gateway** for a private connection through ExpressRoute. See the [ExpressRoute connection template](./deploy-express-route-connection-service-catalog.md).

After the connection is established, configure the appropriate community endpoint and enclave connection rules. Azure Firewall and the enclave's network security groups continue to govern traffic according to the enclave configuration.

The local environment can host applications, virtual machines, or other services that need controlled access to resources in the enclave. In this pattern, the enclave workloads continue to run in Azure.

### Manage local resources with Azure Arc

You can use Azure Arc to [manage supported Azure Local resources](/azure/azure-local/manage/manage-arc-virtual-machines?view=azloc-2609&tabs=azureportal) from Azure. Azure Enclave policy configuration allows the Azure Local resource providers by default. This enables customers to use Azure Arc when it meets their management and governance requirements.

Azure Arc management doesn't change where a workload runs. Azure Local resources remain on the local infrastructure, and Azure Enclave resources remain in Azure.

### Use connected and disconnected operating models

Azure Local supports operating models in which connectivity to Azure is limited or temporarily unavailable. For example, an environment might:

- Connect periodically to download updates.
- Connect only when data must be transferred.
- Continue local control-plane operations if its connection to Azure is interrupted.

When the local environment is disconnected, it can't use the network path to an enclave. To exchange data or access enclave resources, restore the required VPN, ExpressRoute, or other approved network connectivity. Consider the local operating model and the enclave connectivity design together.

## Important architecture boundary

Azure Enclave doesn't run on Azure Local. Azure Local has a smaller local Azure control plane and uses local logical networking rather than the Azure Virtual Network constructs used by Azure Enclave. As a result, you can't deploy an enclave, its managed community infrastructure, or enclave workloads directly onto Azure Local.

Network connectivity from Azure Local to an enclave must leave the local environment and reach the enclave through a supported transit hub connection. A direct local installation of Azure Enclave isn't a supported deployment model.

## Choosing an approach

Use the following guidance when planning an architecture:

| Requirement | Recommended approach |
|---|---|
| Run a workload at the customer site and exchange data with an enclave | Deploy the workload on Azure Local and connect the local network to the enclave through a transit hub. |
| Manage supported local resources through Azure | Use Azure Arc. Review the supported-resource and connectivity requirements for Azure Local. |
| Keep local operations available during a loss of Azure connectivity | Use an Azure Local disconnected operating model, and treat enclave access as unavailable until connectivity is restored. |
| Run enclave workloads on local servers | Not supported. Deploy the workload in an Azure enclave instead. |

## Next steps

- [What is a transit hub?](./what-transit-hub.md)
- [Create a transit hub from the Azure portal](./create-transit-hub-portal.md)
- [What is an enclave connection?](./what-enclave-connection.md)
- [Azure Arc overview](/azure/azure-arc/overview)
