---
title: Azure Security Benchmark Foundation blueprint sample overview
description: Overview and architecture of the Azure Security Benchmark Foundation blueprint sample.
ms.date: 02/01/2020
ms.topic: sample
---
# Overview of the Azure Security Benchmark Foundation blueprint sample

The Azure Security Benchmark Foundation blueprint sample provides a set of baseline infrastructure
patterns to help you build a secure and compliant Azure environment. The blueprint helps you deploy
a cloud-based architecture that offers solutions to scenarios that have accreditation or compliance
requirements. This foundational blueprint sample is an extension of the [Azure Security Benchmark
sample blueprint](https://aka.ms/asb-blueprint). It deploys and configures network boundaries,
monitoring, and other resources in alignment with the policies and other guardrails defined in the
[Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/).

## Architecture

The foundational environment created by this blueprint sample is based on the architecture
principals of a
[hub and spoke model]()https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke.
The blueprint deploys a bub virtual network that contains common and shared resources, services, and
artifacts such as Azure Bastion, gateway and firewall for connectivity, management and jump box
subnets to host additional/optional management, maintenance, administration, and connectivity
infrastructure. One or more spoke virtual networks are deployed to host application workloads such
as web and database services. Spoke virtual networks are connected to the hub virtual network using
Azure virtual network peering for seamless and secure connectivity. Additional spokes can be added
by reassigning the sample blueprint or manually creating an Azure virtual network and peering it
with the hub virtual network. All external connectivity to the spoke virtual network(s) and
subnet(s) is configured to route through the bub virtual network and, via firewall, gateway, and
management jump boxes.

:::image type="content" source="../../media/asb-foundation/asbf-architecture.png" alt-text="Azure Security Benchmark Foundation blueprint sample achitecture diagram" border="false":::

This blueprint deploys several Azure services to provide a secure, monitored, enterprise-ready
foundation. This environment is composed of:

- [Azure Monitor Logs](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs)
  and an Azure storage account to ensure resource logs, activity logs, metrics, and networks traffic
  flows are stored in a central location for easy querying, analytics, archival, and alerting.
- [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-introduction)
  (standard version) to provide threat protection for Azure resources.
- [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview)
  in the hub supporting subnets for connectivity back to an on-premises network, an ingress and
  egress stack to/for Internet connectivity, and optional subnets for deployment of additional
  administrative or management services. Virtual Network in the spoke contains subnets for hosting
  application workloads. Additional subnets can be created after deployment as needed to support
  applicable scenarios.
- [Azure Firewall](https://docs.microsoft.com/azure/firewall/overview) to route all outbound
  internet traffic and to enable inbound internet traffic via jump box. (Default firewall rules
  block all internet inbound and outbound traffic and rules must be configured after deployment, as
  applicable.)
- [Network security groups](https://docs.microsoft.com/azure/virtual-network/network-security-group-how-it-works)
  (NSGs) assigned to all subnets (except service-owned subnets such as Azure Bastion, Gateway and
  Azure Firewall) configured to block all internet inbound and outbound traffic.
- [Application security groups](https://docs.microsoft.com/azure/virtual-network/application-security-groups)
  to enable grouping of Azure virtual machines to apply common network security policies.
- [Route tables](https://docs.microsoft.com/azure/virtual-network/manage-route-table) to route all
  outbound internet traffic from subnets through the firewall. (Azure Firewall and NSG rules will
  need to be configured after deployment to open connectivity.)
- [Azure Network Watcher](https://review.docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview?branch=pr-en-us-143149)
  to monitor, diagnose, and view metrics of resources in the Azure virtual network.
- [Azure DDoS Protection Standard](https://docs.microsoft.com/azure/ddos-protection/ddos-protection-overview)
  to protect Azure resources against DDoS attacks.
- [Azure Bastion](https://docs.microsoft.com/azure/bastion/bastion-overview) to provide seamless and
  secure connectivity to a virtual machine that does not require a public IP address, agent, or
  special client software.
- [Azure VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) to
  enable encrypted traffic between an Azure virtual network and an on-premises location over the
  public Internet.

> [!NOTE] The Azure Security Benchmark Foundation lays out a foundational architecture for
> workloads. The architecture diagram above includes several notional resources to demonstrate
> potential use of subnets. You still need to deploy workloads on this foundational architecture.

## Next steps

You've reviewed the overview and architecture of the Azure Security Benchmark Foundation blueprint sample.

> [!div class="nextstepaction"]
> [Azure Security Benchmark Foundation blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).