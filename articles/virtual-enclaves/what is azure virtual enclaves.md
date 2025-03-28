---
title: What is Azure Virtual Enclaves?
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is Azure Virtual Enclaves?

## Overview
Azure Virtual Enclaves accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive missions and workloads across commercial and air-gapped environments.

AVE takes a multi-layered and hierarchical approach to virtual boundary protection. A **community** serves as a central hub for networking, governance, and monitoring for a collection of isolated networks known as **enclaves**. The community itself hosts a centralized, virtual hub network (Azure VWAN) secured by an intelligent firewall security platform (Azure Firewall), through which all enclave traffic is routed, logged, and monitored. Enclaves are isolated, zero-trust software-defined networks (Azure Virtual Network), hosting customer workloads deployed through Azure Cloud products. Enclaves and customer workloads are securely governed through policy configuration management (Azure Policy).

![Communities and Virtual Enclaves.svg](/assets/Communities%20and%20Virtual%20Enclaves.svg)

# Key Capabilities

## Isolated virtual networking and workloads
With Azure Virtual Enclaves, you can easily create new isolated, zero-trust software-defined networks and deploy workloads in those networks to satisfy your business requirements on Azure.

- [**Communities**](/docs/overview/what%20is%20a%20community) - Isolated, zero-trust, platform-managed virtual WAN boundary protected through a combination of Azure Firewall, policy guardrails, and RBAC deny assignments that serves as a hub for one or more Virtual Enclaves.  Community resources cannot be modified directly and must be managed through Community Endpoints and Transit Hubs resources to allow connectivity to trusted destinations outside of the Community boundary. Logging and diagnostics are enabled for all Enclaves and Workloads within the Community by default. Each Enclave can either send logging data to the Community or keep it isolated to the Enclave. The primary components of a Community include:
  - Azure vWAN
  - Azure Firewall + Firewall Policy
  - Azure Storage 
  - Log Analytics Workspace

- [**Enclaves**](/docs/overview/what%20is%20an%20enclave) - Isolated, zero-trust, platform-managed virtual networks connected to the Community hub protected through a combination of Network Security Groups, policy guardrails, and RBAC Deny Assignments that serves as the Virtual Network for one or more Workloads. Enclave vNets + NSGs cannot be directly modified and must be managed through Enclave Endpoints and Enclave Connection resources to establish network connectivity. The primary components of an Enclave include:
  - Azure Virtual Network
  - Zero-trust Network Security Groups
  - Admin Workstations
  - Private DNS Zones
  - Azure Bastion
  - Private-Links for the following managed resources:
    - Log Analytics Workspace (Optional)
    - Azure Key Vault
    - Azure Storage Account

- [**Workloads**](/docs/overview//what%20is%20a%20workload) - platform-managed Resource Groups protected by Azure policy guardrails and RBAC deny assignments that serves as the resource container for an individual service or application hosted within an Enclave. The primary components of a Workload include:
  - Platform-Managed RG protected by Azure Policy and Deny Assignments
  - Service Catalog - Collection of templates that can be used to deploy well-known services and applications.

![image.png](/assets/images-hierarchy.png)

## Virtual Connection Management
With Azure Virtual Enclaves, you can easily connect your communities, enclaves, and workloads to other networks and resources, both on Azure and on-prem.

- [**Enclave Endpoints**](/docs/overview//what%20is%20an%20enclave%20endpoint) are collections of networking rules that enable simplified and standardized connectivity to an Enclave or an individual Workload.
- [**Community Endpoints**](/docs/overview/what%20is%20a%20community%20endpoint) are collections of networking rules that enable external connectivity to trusted destinations including public websites, well-known services, and external private networks.
- [**Transit Hubs**](/docs/overview/what%20is%20a%20transit%20hub) can be associated with Community Endpoint rules to allow secure site-to-site connectivity to external private networks via VPN Gateway or ExpressRoute.
- [**Enclave Connections**](/docs/overview/what%20is%20an%20enclave%20connection) are associated with a Community or Enclave endpoint and allow network traffic based on the rules defined within the Endpoint.

## Multi-Layered governance/Governance, Security, and Monitoring

Azure Virtual Enclaves provides the following security layers built directly into the service:

- **Azure Policy Guardrails**: Built-in guardrails that secure the Virtual boundary ensuring only authorized resource types can be deployed into a given workload within an Enclave.
These guardrails include:
  - Resource Type protections
  - Network protections
  - Protections toward specific services and applications
- **Managed networking boundary** - Managed networking through endpoints and connections that ensure each connection is authorized and trusted from the Firewall to individual subnets.  
- **Logging and Monitoring**: Each activity is logged an auditable and can be Centralized to a Community Workspace, isolated to an Enclave, or both.
- **Virtual Network Isolation**: Next-level zero-trust networking that leverages and combines the power of Azure vWAN, Firewall, Policy, RBAC, Network Watcher, Monitor, Microsoft Sentinel, Defender, and others to ensure that you know where your data is and who is accessing it at all times.
- **Connection Management**: All connections, internal or external, are governed by strict, user-defined rules to prevent unwarranted access through.
- **Policy Guardrails**: Ensure your environments remain secure through build-in policies at the Community, Enclave, and Workload levels to audit and/or enforce consistency and compliance across your environment.
- **Mandatory Access Control**: Access is granted not merely by identity but by role, ensuring users only access what they need, and nothing more.
- **Observability**: The Azure Virtual Enclaves service consolidates the full power of Azure's built-in logging, alerting, and auditing that seamlessly integrates with Azure Sentinel, Defender, and other network monitoring and security tools to ensure that your data remains secure.
- **Secure Transit Hubs**: Managed VPN Gateway, ExpressRoute, or vNet peering connections.
- **Service Catalog**: Ensure workload deployments simple and repeatable through a collection of pre-built templates.

Learn more about how Azure Virtual Enclaves [governance](/docs/Concepts/Governance).

## Defense-in-Depth 
Azure Virtual Enclaves simplifies integration with existing secure Azure security and monitoring services including:
- **Azure Sentinel**: Combine the power of Azure Sentinel's SIEM and SOAR capabilities with Azure Virtual Enclaves to enhance threat detection, investigation, and response across your cloud environment.
- **Azure Monitor**: Get end-to-end visibility and in-depth monitoring of your Azure Virtual Enclaves operations, benefiting from Azure Monitor's advanced analytics.
- **Microsoft Defender for Cloud**: Bolster the security posture of your Azure Virtual Enclaves by leveraging the comprehensive threat protection features and security baseline insights of Microsoft Defender for Cloud.
- **Azure Virtual Desktop**: Integrate your Virtual Enclaves with Azure Virtual Desktop to provide users with a secure, remote desktop experience from anywhere.

Learn more about how Azure Virtual Enclaves incorporates [defense-in-depth](/docs/Concepts/Defense%20in%20Depth).

# Next steps
Here are some other articles to learn about Azure Virtual Enclaves:

## Create a community and enclaves
1. [Create a community](/docs/How%20To%20Guides/Create%20a%20Community%20in%20the%20Azure%20portal) 
2. [Create an enclave](/docs/How%20To%20Guides/Create%20an%20Enclave%20in%20the%20Azure%20Portal)

## Create workloads within enclaves from a template
3. [Create a workload](/docs/How%20To%20Guides/Create%20a%20Workload%20in%20the%20Azure%20Portal)

## Design Endpoints and Transit Hub connections

4. [Create a community endpoint](/docs/How%20To%20Guides/Create%20a%20Community%20Endpoint%20in%20the%20Azure%20Portal)
5. [Create an enclave endpoint](/docs/How%20To%20Guides/Create%20a%20Enclave%20Endpoint%20in%20the%20Azure%20Portal)
6. [Create a transit hub](/docs/How%20To%20Guides/Create%20a%20Transit%20Hub%20from%20the%20Azure%20Portal)

## Connect Enclaves and Endpoints

6. [Create an enclave connection](/docs/How%20To%20Guides/Create%20an%20Enclave%20Connection%20from%20the%20Azure%20Portal)
