---
title: Supportability for the SAP Deployment Automation Framework
description: Supported platforms, topologies, and capabilities for the SAP Deployment Automation Framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Supportability for the automation framework

The [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md) supports multiple different platforms, topologies, and Azure capabilities.

## Supported platforms

The automation framework supports deployment on both Linux and Windows.

## Supported topologies

By default, the automation framework deploys with database and application tiers. You can split the application tier into three more tiers: application, central services, and web dispatchers. 

You can also deploy the automation framework to a standalone server. You can then specify a configuration without an application tier.

## Supported Azure features

The automation framework uses or can use the following Azure services, features, and capabilities.

- Azure Virtual Machines (VMs)
    - Accelerated Networking
    - Anchor VMs
    - SSH authentication
    - Username and password authentication
    - SKU configuration
    - Custom images
    - New and existing proximity placement groups
- Azure Virtual Network (VNet)
    - Deployment in networks peered to your SAP network
    - Customer-specified IP addressing
    - Azure-provided IP addressing
    - New and existing network security groups
    - New and existing virtual networks
    - New and existing subnets
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
    - New and existing key vaults
    - Customer-managed keys for disk encryption

## Unsupported Azure features

The automation framework **doesn't support** the following Azure services, features, or capabilities:

- Azure Application Security Groups (ASG)
- Azure Files for the Network File System (NFS) protocol
- Azure NetApp Files (ANF)
- Azure Monitor for SAP Solutions

## Next steps


> [!div class="nextstepaction"]
> [Get started with the automation framework](automation-get-started.md)
