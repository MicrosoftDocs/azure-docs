---
title: About Azure Operator Service Manager
description: Learn about Azure Operator Service Manager, an Azure Service for the management of Network Services for telecom operators.
author: CoolDoctorJ
ms.author: jefrankl
ms.date: 04/09/2023
ms.topic: overview
ms.service: azure-operator-service-manager
---
# About Azure Operator Service Manager

Azure Operator Service Manager is an Azure service designed to assist telecom operators in managing their network services. It provides streamlined management capabilities for intricate, multi-part, multi-vendor applications across numerous hybrid cloud sites, encompassing Azure regions, edge platforms, and Arc-connected sites. Initially, Azure Operator Service Manager caters to the needs of telecom operators who are in the process of migrating their workloads to Azure and Arc-connected cloud environments.

Azure Operator Service Manager expands and improves the Network Function Manager by incorporating technology and ideas from Azure for Operators' on-premises management tools. Its purpose is to manage the convergence of comprehensive, multi-vendor service solutions on a per-site basis. It uses a declarative software and configuration model for the system. It also combines Azure's hyperscaler experience and tooling for error-free Safe Deployment Practices (SDP) across sites grouped in canary tiers.

## Product features

Azure Operator Service Manager provides an Azure-native abstraction for modeling and realizing a distributed network service using extra resource types in Azure Resource Manager (ARM) through our cloud service. A network service is represented as a network graph comprising multiple network functions, with appropriate policies controlling the data plane to meet each telecom operator's operational needs. Creation of templates of configuration schemas allows for per-site variation that is often required in such deployments.

The service is partitioned into a global control plane, which operates on Azure, and site control planes. Site control planes also function on Azure, but are confined to specific sites, such as on-premises and hybrid sites.

The global control plane hosts the interfaces for publishers, designers, and operators. All of the applicable resources are immutable versioned objects, replicated to all Azure regions. The global control plane also hosts the Safe Deployment Practices (SDP) Global Convergence Agent, which is responsible for driving rollout across sites.

The site control plane consists of the Site Convergence Agent. The Site Convergence Agent is responsible for mapping the desired state of a site. The desired state ranges from the network service level down to the network function and cloud resource level. The Site Convergence Agent converges each site to the desired state, and runs in an Azure region as a resource provider in that region.

## Benefits

Azure Operator Service Manager provides the following benefits:

- Provides a single management experience for all Azure for operators solutions in Azure or connected clouds.
- Offers SDK and PowerShell services to further extend the reach to include third-party network functions and network services.
- Implements consistent best-practice safe deployment practices (SDP) fleet-wide.
- Provides blast-radius limitations and disconnected mode support to enable five-nines operation of these services.
- Offers clear dashboard reporting of convergence state for each site and canary level.
- Enables real telecom DevOps working, eliminating the need for NF-specific maintenance windows.

## Get access to Azure Operator Service Manager

Azure Operator Service Manager is currently in public preview. To get started, contact us at [aosmpartner@microsoft.com](mailto:aosmpartner@microsoft.com?subject=Azure%20Operator%20Service%20Manager%20preview%20request&Body=Hello%2C%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20Azure%20Operator%20Service%20Manager%20preview%20documentation.%0A%0AMy%20GitHub%20username%20is%3A%20%0A%0AThank%20you%21), provide your GitHub username, and request access to our preview documentation.
