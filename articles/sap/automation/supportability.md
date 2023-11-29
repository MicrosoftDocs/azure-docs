---
title: Supportability matrix for SAP Deployment Automation Framework
description: Supported platforms, topologies, and capabilities for SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 5/23/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Supportability matrix for the SAP automation framework

[SAP Deployment Automation Framework](deployment-framework.md) supports deployment of all the supported SAP on Azure topologies.

## Supported operating systems

The automation framework supports the following operating systems.

### Control plane

The deployer virtual machine of the control plane must be deployed on Linux because the Ansible controllers only work on Linux.

### SAP infrastructure

The automation framework supports deployment of the SAP on Azure infrastructure both on Linux or Windows virtual machines on x86-64 or x64 hardware.

The framework supports the following operating systems and distributions:

- Windows server 64 bit for the x86-64 platform
- SUSE Linux 64 bit for the x86-64 platform (12.x and 15.x)
- Red Hat Linux 64 bit for the x86-64 platform (7.x and 8.x)
- Oracle Linux 64 bit for the x86-64 platform

The following distributions have been tested with the framework:

- Red Hat 7.9
- Red Hat 8.2
- Red Hat 8.4
- Red Hat 8.6
- SUSE 12 SP5
- SUSE 15 SP2
- SUSE 15 SP3
- SUSE 15 SP4
- Oracle Linux 8.2
- Oracle Linux 8.4
- Oracle Linux 8.6
- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

## Supported database back ends

The automation framework supports the following database back ends:

- SAP HANA
- DB2
- Oracle
- Sybase
- Microsoft SQL Server

## Supported topologies

By default, the automation framework deploys with database and application tiers. The application tier is split into three more tiers: application, central services, and web dispatchers.

You can also deploy the automation framework to a standalone server by specifying a configuration without an application tier.

## Supported deployment topologies

The automation framework supports both green-field and brown-field deployments.

### Green-field deployments
In a green-field deployment, the automation framework creates all the required resources.

In this scenario, you provide the relevant data (address spaces for networks and subnets) when you configure the environment. For more examples, see [Configure the workload zone](configure-workload-zone.md).

### Brown-field deployments
In a brown-field deployment, you can use existing Azure resources as part of the deployment.

In this scenario, you provide the Azure resource identifiers for the existing resources when you configure the environment. For more examples, see [Configure the workload zone](configure-workload-zone.md).

## Supported Azure features

The automation framework can use the following Azure services, features, and capabilities:

- Azure Virtual Machines
    - Accelerated networking
    - Anchor VMs (optional)
    - SSH authentication
    - Username and password authentication
    - SKU configuration
    - Custom images
    - New or existing proximity placement groups
- Azure Virtual Network
    - Deployment in networks peered to your SAP network
    - Customer-specified IP addressing
    - Azure-provided IP addressing
    - New or existing network security groups
    - New or existing virtual networks
    - New or existing subnets
- Azure availability zones
    - High availability (HA)
- Azure Firewall
- Azure Load Balancer
    - Standard load balancers
- Azure Storage
    - Boot diagnostics storage
    - SAP installation media storage
    - Terraform state file storage
    - Cloud Witness storage for HA scenarios
- Azure Key Vault
    - New or existing key vaults
    - Customer-managed keys for disk encryption
- Azure application security groups
- Azure Files for NFS
- Azure NetApp Files
    - For shared files
    - For database files

## Supported SAP architectures

You can use the automation framework to deploy the following SAP architectures:

- Standalone
- Distributed
- Distributed (highly available)

## Next step

> [!div class="nextstepaction"]
> [Get started with the automation framework](get-started.md)
