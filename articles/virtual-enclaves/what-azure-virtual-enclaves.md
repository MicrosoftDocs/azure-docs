---
title: What is Azure Virtual Enclaves?
description: What is Azure Virtual Enclaves?
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# What is Azure Virtual Enclaves?

Azure Virtual Enclaves (AVE) accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive workloads. AVE is designed for commercial and air-gapped environments.

> [!IMPORTANT]
> 
> Azure Virtual Enclaves is currently in Public Preview and is provided without a service-level agreement. At this time, **Azure Virtual Enclaves shouldn't be used for production workloads**. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. See the full [Azure Virtual Enclaves Terms](./public-preview-terms.md) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

AVE takes a multi-layered and hierarchical approach to virtual boundary protection. A **community** serves as a central hub for networking, governance, and monitoring for a collection of isolated networks known as **enclaves**. The community itself hosts a centralized, virtual hub network (Azure Virtual WAN) secured by an intelligent firewall security platform (Azure Firewall), through which all enclave traffic is routed, logged, and monitored. Enclaves are isolated, zero-trust software-defined networks (Azure Virtual Network), hosting customer workloads deployed through Azure Cloud products. Enclaves and customer workloads are securely governed through policy configuration management (Azure Policy).

![Graphic that shows communities and enclaves example architecture.](./media/communities-virtual-enclaves.svg)

## Accelerated deployment and management

Azure Virtual Enclaves dramatically reduces the time and complexity required to create and manage secure, compliant cloud environments. Traditional secure environment deployment can take weeks or months of planning, configuration, and testing and still might be missing important isolation and policy controls. AVE reduces the deployment time to hours or days through platform-managed infrastructure and built-in security controls so you can focus on your customers or users.

## Isolated virtual networking and workloads
With Azure Virtual Enclaves, you can easily create new isolated, zero-trust software-defined networks and deploy workloads in those networks to satisfy your business requirements on Azure.

- [**Communities**](./what-community.md) - Isolated, zero-trust, platform-managed virtual WAN boundary protected through a combination of Azure Firewall, policy guardrails, and Role Based Access Control (RBAC) Deny Assignments that serve as a hub for one or more enclaves.  Connections outside of the Community are managed through community endpoints and transit hub resources to allow connectivity to trusted destinations. Logging and diagnostics are enabled for all Enclaves and workloads within the community by default. Each Enclave can send logging data to the community or keep it isolated to the Enclave, or send logs to both.

- [**Enclaves**](./what-enclave.md) - Isolated, zero-trust, platform-managed virtual networks connected to the community hub protected through a combination of Network Security Groups (NSG), policy guardrails, and RBAC Deny Assignments that serve as the Virtual Network for one or more workloads. Enclave virtual networks and NSGs can't be directly modified and must be managed through enclave endpoints and enclave resources to establish network connectivity.

- [**Workloads**](./what-workload.md) - The resource that links your [workload resource groups](./what-workload.md#workload-resource-group) to the enclave and community boundary. Workload resource groups are protected by the community, enclave, and workload policies and permissions and workload resource groups are where you put your customer deployed resources. platform-managed resource groups protected by Azure policy guardrails and RBAC Deny Assignments that serve as the resource container for an individual service or application hosted within an Enclave.

[ ![Diagram showing the layers Azure Virtual Enclaves within the management layers in Azure.](./media/ave-azure-layers-hierarchy.png) ](./media/ave-azure-layers-hierarchy.png#lightbox)

## What gets deployed
When you deploy Azure Virtual Enclaves resources, these resources are deployed for you:

- [**Communities**](./what-community.md) - The community managed resource group contains these resources depending on your selections during community creation.
  - Azure Virtual WAN
  - Azure Firewall
  - Firewall Policy
  - Managed Identity for Policy enforcement
  - Log Analytics Workspace
  - (Optional) Data collection rule (for enclave Virtual Network flow log analytics if you configure any enclave logging to be sent to the community)
  - (Optional) Data collection endpoint (for enclave Virtual Network flow log analytics if you configure any enclave logging to be sent to the community)

  > [!NOTE]
  > 
  > Virtual WAN regional hub - A secured hub (Virtual Wan hub plus Azure Firewall) is created during enclave creation for each new region an enclave is deployed in.
  > Virtual WAN hub for transit - When you create a transit hub one of the following resources is also created depending on your choice:
    - VPN Gateway
    - ExpressRoute Gateway
    - Virtual Network Connection

- [**Enclaves**](./what-enclave.md)
  - Virtual Network
  - Network security group for each subnet (1 required, 1 for each customer subnet)
  - Managed Identity one for Policy enforcement and one for Virtual Network flow logs
  - Storage Account (for network flow logs)
  - Key Vault (for network flow logs encryption on storage account)
  - (Optional) Log Analytics if you selected logging to the enclave
  - (Optional) Data collection rule (for enclave Virtual Network flow log analytics if you configure enclave logging to be sent to the enclave)
  - (Optional) Data collection endpoint (for enclave Virtual Network flow log analytics if you configure enclave logging to be sent to the enclave)
  - (Optional) Bastion
  - (Optional) Bastion Subnet and 
  - (Optional) Public IP for Bastion

- [**Workloads**](./what-workload.md)
  - Workload Resource Groups - You create each [workload resource group](./what-workload.md#workload-resource-group) you need to organize your resources.


## Virtual connection management
With Azure Virtual Enclaves, you can easily connect your communities, enclaves, and workloads to other networks and resources, both on Azure and on-premises.

- [**Enclave Endpoints**](./what-enclave-endpoint.md) are collections of networking rules that enable simplified and standardized connectivity to an enclave or an individual workload.
- [**Community Endpoints**](./what-community-endpoint.md) are collections of networking rules that enable external connectivity to trusted destinations including public websites, well-known services, and external private networks.
- [**Transit hubs**](./what-transit-hub.md) can be associated with community endpoint rules to allow secure site-to-site connectivity to external private networks via VPN Gateway or ExpressRoute.
- [**Enclave connections**](./what-enclave-connection.md) are associated with a community or enclave endpoint and allow network traffic based on the rules defined within the Endpoint.

## Multi-layered governance, security, and monitoring

Azure Virtual Enclaves provides the following security layers built directly into the service:

**Azure Policy Guardrails**: Built in guardrails that secure the Virtual boundary ensuring only authorized resource types can be deployed into a given workload within an Enclave.
These guardrails include:
  - Resource type protections
  - Network protections
  - Protections toward specific services and applications

**Managed networking boundary** - Managed networking through endpoints and connections that ensure each connection is authorized and trusted from the Firewall to individual subnets.  

**Logging and Monitoring**: Each activity is logged an auditable and can be centralized to a community Workspace, isolated to an Enclave, or both.

**Virtual Network Isolation**: Zero-trust networking that uses Azure vWAN, Firewall, Policy, RBAC, Network Watcher, Monitor, Microsoft Sentinel, Defender, and others to ensure that you know where your data is and who is accessing it.

**Connection Management**: User-defined rules prevent unwarranted access through your enclave connections.

**Policy Guardrails**: Ensure your environments remain secure through build-in policies at the community, Enclave, and workload levels to audit and/or enforce consistency and compliance across your environment.

**Mandatory Access Control**: Azure assigned roles ensure users only access what they need.

**Observability**: Azure Virtual Enclaves uses Azure's built-in logging, alerting, and auditing that seamlessly integrates with Microsoft Sentinel, Defender, and other network monitoring and security tools. These security tools ensure that your data remains secure.

**Secure transit hub**: Managed VPN Gateway, ExpressRoute, or Virtual Network peering connections.

**Service Catalog**: Ensure workload deployments simple and repeatable through a collection of validated templates.

Learn more about how Azure Virtual Enclaves [governance](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring).

## Defense-in-depth 
Azure Virtual Enclaves simplifies integration with existing secure Azure security and monitoring services including:

**Microsoft Sentinel**: Combine the power of Microsoft Sentinel's Security Information and Event Management (SIEM) and Security Orchestration, Automation, and Response (SOAR) capabilities with Azure Virtual Enclaves to enhance threat detection, investigation, and response across your cloud environment.

**Azure Monitor**: Get end-to-end visibility and in-depth monitoring of your Azure Virtual Enclaves operations, benefiting from Azure Monitor's advanced analytics.

**Microsoft Defender for Cloud**: Fortify your Azure Virtual Enclaves by using the comprehensive threat protection features and security baseline insights of Microsoft Defender for Cloud.

**Azure Virtual Desktop**: Integrate your enclaves with Azure Virtual Desktop to provide users with a secure, remote desktop experience from anywhere.

Learn more about how Azure Virtual Enclaves incorporates [defense-in-depth](./defense-in-depth.md).

## Next steps 
Here are some other articles to learn about the new Azure Virtual Enclaves resources:

1. [Create a community](./create-community-portal.md) 
2. [Create an enclave](./create-enclave-portal.md)
3. [Create a workload](./create-workload-portal.md)
4. [Create a community endpoint](./create-community-endpoint-portal.md)
5. [Create an enclave endpoint](./create-enclave-endpoint-portal.md)
6. [Create a transit hub](./create-transit-hub-portal.md)
7. [Create an enclave connection](./create-enclave-connection-portal.md)
