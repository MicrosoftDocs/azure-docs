---
title: Supportability matrix for the SAP on Azure Deployment Automation Framework
description: Supported platforms, topologies, and capabilities for the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Supportability matrix for the SAP Automation Framework

The [SAP on Azure Deployment Automation Framework](deployment-framework.md) supports deployment of all the supported SAP on Azure topologies.

## Supported operating systems

### Control plane

The deployer virtual machine of the control plane must be deployed on Linux as the Ansible controller only works on Linux.

### SAP Application

The automation framework supports deployment of the SAP on Azure infrastructure both on Linux or Windows virtual machines on x86-64 or x64 hardware.   

The following operating systems and distributions are supported by the framework:

- Windows server 64bit for the x86-64 platform
- SUSE linux 64bit for the x86-64 platform (12.x and 15.x)
- Red Hat Linux 64bit for the x86-64 platform (7.x and 8.x)
- Oracle Linux 64bit for the x86-64 platform

The following distributions have been tested with the framework (Red Hat 7.9, Red Hat 8.2, SUSE 12 SP5, and SUSE 15 SP2)
## Supported topologies

By default, the automation framework deploys with database and application tiers. The application tier is split into three more tiers: application, central services, and web dispatchers. 

You can also deploy the automation framework to a standalone server by specifying a configuration without an application tier.

## Supported deployment topologies

The automation framework supports both green field and brown field deployments. 

### Greenfield deployments
In the green field deployment all the required resources will be created by the automation framework.

In this scenario, you provide the relevant data (address spaces for networks and subnets) when configuring the environment. See [Configuring the workload zone](configure-workload-zone.md) for more examples.

### Brownfield deployments
In the brownfield deployment existing Azure resources can be used as part of the deployment.

In this scenario, you provide the Azure resource identifiers for the existing resources when configuring the environment. See [Configuring the workload zone](configure-workload-zone.md) for more examples.

## Supported Azure features

The automation framework uses or can use the following Azure services, features, and capabilities.

- Azure Virtual Machines (VMs)
    - Accelerated Networking
    - Anchor VMs (optional)
    - SSH authentication
    - Username and password authentication
    - SKU configuration
    - Custom images
    - New or existing proximity placement groups
- Azure Virtual Network (VNet)
    - Deployment in networks peered to your SAP network
    - Customer-specified IP addressing
    - Azure-provided IP addressing
    - New or existing network security groups
    - New or existing virtual networks
    - New or existing subnets
- Azure Availability Zones
    - High availability (HA)
- Azure Firewall
- Azure Load Balancer
    - Standard load balancers
- Azure Storage
    - Boot diagnostics storage
    - SAP Installation Media storage
    - Terraform state file storage
    - Cloud Witness storage for HA scenarios
- Azure Key Vault
    - New or existing key vaults
    - Customer-managed keys for disk encryption
- Azure Application Security Groups (ASG)
- Azure Files for NFS
- Azure NetApp Files (ANF)
    - For shared files
    - For database files

## Unsupported Azure features

At this time the automation framework **doesn't support** the following Azure services, features, or capabilities:


## Next steps


> [!div class="nextstepaction"]
> [Get started with the automation framework](get-started.md)
