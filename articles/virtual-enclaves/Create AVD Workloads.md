---
title: Create AVD Workloads
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

By default, all enclaves are created with [Admin Workstation Virtual Machines](/docs/Concepts/Understanding-Admin-Workstations). This means that all resources and hosts within an enclave are reachable through the Admin Workstation.

For certain Enclave Owners, the default access pattern surrounding the Admin Workstation may not satisfy their requirements for a variety of reasons. For example, Enclave Owners may have requirements that disallow the Azure Bastion service. 

Currently, [Azure Bastion](https://aka.ms/bastion) is the Azure Cloud's first-party service for secure remote connections using private IP addresses. This is expected behavior for Azure Virtual Enclaves. However, should Enclave Owners require an alternative connection method, they can manually deploy a fleet of Virtual Machines (called Session Hosts in [Azure Virtual Desktop](https://aka.ms/avd)) to access their Enclave. This can be done using native Azure cloud networking resources and Azure Virtual Enclaves.

## Overview

Assuming a [Community](/docs/overview/what%20is%20a%20community) and [Enclave](/docs/overview/what%20is%20an%20enclave) have already been created, please follow the steps below to deploy Azure Virtual Desktop and configure it as an access point to resources in your enclave.

### Create AVD through Azure Portal into an AVE Workload
1. [Create a Workload](docs/How%20To%20Guides/Create%20a%20Workload%20in%20the%20Azure%20Portal) with any specified name (e.g. `wl-avd-mgmt-pool`)
2. [Deploy AVD](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop?tabs=portal) to the Workload RG (`wl-avd-mgmt-pool`)
   - Follow the tutorial to deploy Azure Virtual Desktop. For all steps that deploy Azure resources targeting a Resource group, select the Workload RG (`wl-avd-mgmt-pool`)
3. [Create Community Endpoint](docs/How%20To%20Guides/Create%20a%20Community%20Endpoint%20in%20the%20Azure%20Portal) for necessary URL networking information
4. [Create Enclave Endpoint](docs/How%20To%20Guides/Create%20a%20Enclave%20Endpoint%20in%20the%20Azure%20Portal) for necessary IP/CIDR/port/protocol rule networking information
5. [Create the Enclave Connection](docs/How%20To%20Guides/Create%20an%20Enclave%20Connection%20from%20the%20Azure%20Portal) so that the customer can access the AVD service in Azure from specified Enclaves


### Create AVD through Service Catalog into an AVE Workload
1. [Create a Workload](docs/How%20To%20Guides/Create%20a%20Workload%20in%20the%20Azure%20Portal) with any specified name (e.g. `wl-avd-mgmt-pool`)
2. [Deploy AVD as a service catalog](/docs/How%20To%20Guides/Service%20Catalog) package to the Workload RG
   - Service catalog package then creates AVD resources into the Workload RG
3. [Create Community Endpoint](docs/How%20To%20Guides/Create%20a%20Community%20Endpoint%20in%20the%20Azure%20Portal) for necessary URL networking information
4. [Create Enclave Endpoint](docs/How%20To%20Guides/Create%20a%20Enclave%20Endpoint%20in%20the%20Azure%20Portal) for necessary IP/CIDR/port/protocol rule networking information
    - [Starting place for AVD NSG rules (Low-side)](https://msazure.visualstudio.com/Project%20Honeycomb/_git/heather?path=/src/bicep/network/nsgrules/desktop-rules.bicep)
5. [Create the Enclave Connection](docs/How%20To%20Guides/Create%20an%20Enclave%20Connection%20from%20the%20Azure%20Portal) so that the customer can access the AVD service in Azure from specified Enclaves

## References
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
- [What is a Workload?](/docs/overview/what%20is%20a%20workload)
- [Azure Bastion](https://aka.ms/bastion)
- [Azure Virtual Desktop](https://aka.ms/avd)
- [Azure Support](https://azure.microsoft.com/en-us/support/)
