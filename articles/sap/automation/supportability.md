---
title: Supportability matrix for SAP Deployment Automation Framework
description: Learn about the supported operating systems, databases, storage types, and deployment topologies for SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.date: 04/02/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: sap-automation
# Customer intent: As an IT operations manager, I want to understand the supported platforms and configurations of the SAP Deployment Automation Framework, so that I can effectively deploy and manage SAP solutions in our Azure environment.
---

# Supportability matrix for SAP Deployment Automation Framework

SAP Deployment Automation Framework is an open-source orchestration tool for deploying, installing,
and maintaining SAP environments on Azure. Before you plan or modify a deployment, confirm that your
framework supports the target operating systems, databases, storage options, and topologies.

- **Control plane**: The deployer virtual machine (VM) of the control plane must run on Linux
  because Ansible controllers only work on Linux.

- **SAP infrastructure**: The automation framework supports deployment of the SAP on Azure
  infrastructure on both Linux and Windows VMs on x86-64 or x64 hardware.

This article lists the platforms, database back ends, storage types, and SAP topologies that the
automation framework supports. For an overview of the framework, see
[SAP Deployment Automation Framework](deployment-framework.md).

## Supported operating systems

The framework supports the following operating systems and distributions:

- Windows Server 64 bit for the x86-64 platform
- SUSE Linux 64 bit for the x86-64 platform (12.x and 15.x)
- Red Hat Linux 64 bit for the x86-64 platform (7.x, 8.x, 9.x, 10.0)
- Oracle Linux 64 bit for the x86-64 platform

The following distributions were tested with the framework:

| Distribution | Versions |
|--|--|
| **Red Hat** | **7.9** <br> **8.2** <br> **8.4** <br> **8.6** <br> **8.8** <br> **9.0** <br> **9.2** <br> **9.4** <br> **9.6** <br> **10.0** |
| **SUSE** | **12 SP4** <br> **15 SP2** <br> **15 SP3** <br> **15 SP4** <br> **15 SP5** <br> **15 SP6** <br> **15 SP7** |
| **Oracle** | **8.2** <br> **8.4** <br> **8.6** <br> **8.8** <br> **8.9** |
| **Windows Server** | **2016** <br> **2019** <br> **2022** |

## Supported database back ends

The automation framework supports the following database back ends:

| Database | Versions |
|--|--|
| **SAP HANA (S4/NW)** | **1909** <br> **2020** <br> **2021** <br> **2022** <br> **2023** <br> **2025** |
| **ASE** | **1603SP11** <br> **1603SP14** |
| **DB2** | **11.5** |
| **ORACLE** | **19.0** |
| **MS SQL Server** | **2016** <br> **2019** <br> **2022** |

## Supported storage types

The automation framework supports the following storage types:

| Storage Solution | Notes |
|--|--|
| Premium_SSD | |
| Premium_SSD v2 | |
| Ultra_SSD | Limited to certain scenarios. For instance, `/hana/log` on eligible SKU. |
| Azure NetApp Files | For HANA, AVG support also available. |
| Azure Files NFS | For shared files, not for database files. |

The automation framework supports encryption with Azure Disk Encryption and customer-managed keys.

## Supported SAP topologies

By default, the automation framework deploys with database and application tiers. The application
tier is split into three more tiers: application, central services, and web dispatchers.

| Deployment | Notes |
|--|--|
| Standalone | All SAP roles are installed on a single server. |
| Distributed | Separate Database server and application tier. The application tier can further split by having SAP central services on one VM and one or more application servers on another. |
| Distributed (HA) | Database and/or SAP Central Services are deployed highly available using Pacemaker. |

You can also deploy the automation framework to a standalone server by specifying a configuration
without an application tier.

## Supported deployment topologies

The automation framework supports both green-field and brown-field deployments.

### Green-field deployments

In a green-field deployment, the automation framework creates all the required resources.

In this scenario, you provide the relevant data (address spaces for networks and subnets) when you
configure the environment. For more examples, see
[Configure the workload zone](configure-workload-zone.md).

### Brown-field deployments

In a brown-field deployment, you can use existing Azure resources as part of the deployment.

In this scenario, you provide the Azure resource identifiers for the existing resources when you
configure the environment. For more examples, see
[Configure the workload zone](configure-workload-zone.md).

## Supported Azure features

The automation framework can use the following Azure services, features, and capabilities when you
deploy and manage SAP environments:

- Azure Virtual Machines
    - Accelerated networking
    - Anchor VMs (optional)
    - SSH or username and password authentication
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
    - Private endpoints

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

## Related content

- [Get started with SAP Deployment Automation Framework](get-started.md)
- [Deploy the control plane](deploy-control-plane.md)
- [Configure the workload zone](configure-workload-zone.md)
