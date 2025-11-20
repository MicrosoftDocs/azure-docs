---
title: SAP Testing Automation Framework Supported Platforms and Features
description: Learn about the supported platforms, operating systems, and features for the SAP Testing Automation Framework
author: devanshjain
ms.author: devanshjain
ms.reviewer: depadia
ms.date: 10/27/2025
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.topic: conceptual
---

# SAP Testing Automation Framework supported platforms and features

This document outlines the supported platforms, operating systems, and features for the SAP Testing Automation Framework.

## Supported distributions for management server

The SAP Testing Automation Framework requires a management server that acts as an orchestrator. These are the list of supported operating systems for the management server.

- Operating system
  - Ubuntu 22.04 LTS
  - SUSE Linux Enterprise Server 15 SP4 or higher.
  - Red Hat Enterprise Linux 9.4 or higher.

- The management server must be deployed on Azure.

## Supported SAP system configurations

Azure offers various deployment options for SAP workloads on different operating system distributions. The SAP Testing Automation Framework executes its test scenarios on the following SAP system configurations.

### Linux distributions

The SAP Testing Automation Framework is currently supported on the following Linux distributions and versions. These operating systems provide the foundational platform for running SAP workloads and the testing framework components.

| Distribution | Supported Versions |
|--------------|-------------------|
| SUSE Linux Enterprise Server (SLES) | 15 SP4, 15 SP5, 15 SP6, 15 SP7 |
| Red Hat Enterprise Linux (RHEL) | 8.8, 8.10, 9.2, 9.4, 9.6 |

### High availability configuration patterns

The framework supports testing of various high availability configurations for SAP components. These configurations represent the most common deployment patterns for SAP systems on Azure, ensuring comprehensive validation across different architectural approaches.

| Component | Type | Fencing Type | Storage Options |
|-----------|------|--------------|-----------------|
| SAP Central Services | ENSA1 or ENSA2 | Azure Fencing Agent | Azure Files or Azure NetApp Files |
| SAP Central Services | ENSA1 or ENSA2 | iSCSI (SBD device) | Azure Files or Azure NetApp Files |
| SAP Central Services | ENSA1 or ENSA2 | Azure Shared Disks (SBD device) | Azure Files or Azure NetApp Files |
| SAP HANA Database | Scale-up | Azure Fencing Agent | Azure Managed Disks or Azure NetApp Files |
| SAP HANA Database | Scale-up | iSCSI (SBD device) | Azure Managed Disks or Azure NetApp Files |
| SAP HANA Database | Scale-up | Azure Shared Disks (SBD device) | Azure Managed Disks or Azure NetApp Files |

The framework validates both Enqueue Server 1 (ENSA1) and Enqueue Server 2 (ENSA2) architectures for SAP Central Services, providing comprehensive testing coverage for different SAP NetWeaver implementations. For SAP HANA databases, the framework focuses on scale-up configurations with System Replication (HSR) for high availability scenarios.

For SAP Central Services on SLES, both the simple mount approach and the classic method are supported.

### SAP configuration checks (Preview)

The framework supports configuration checks across different SAP system topologies and database combinations. These configurations cover both single server and high availability deployment scenarios for comprehensive validation.

| Topology | Database | High Availability | Fencing Agent |
|----------|----------|-------------------|---------------|
| Single Instance | SAP HANA | Non-HA | N/A |
| Single Instance | IBM Db2 | Non-HA | N/A |
| Distributed | SAP HANA | Non-HA | N/A |
| Distributed | IBM Db2 | Non-HA | N/A |
| Central Services HA | SAP HANA | ASCS/ERS | Azure Fencing Agent or SBD |
| Central Services HA | IBM Db2 | ASCS/ERS | Azure Fencing Agent or SBD |
| Database HA | SAP HANA | System Replication (HSR) | Azure Fencing Agent or SBD |
| Database HA | IBM Db2 | HADR | Azure Fencing Agent or SBD |
| Full HA | SAP HANA | ASCS/ERS + HSR | Azure Fencing Agent or SBD |
| Full HA | IBM Db2 | ASCS/ERS + HADR | Azure Fencing Agent or SBD |

The framework validates configuration checks for both HANA and Db2 database backends across different deployment topologies. For high availability scenarios, the framework supports ASCS/ERS clustering for SAP Central Services and database-specific replication technologies for data tier protection.

## Next steps

- To get started on SAP Testing Automation Framework setup, follow the guide [Setup Guide for SAP Testing Automation Framework](https://github.com/Azure/sap-automation-qa/blob/main/docs/SETUP.MD).
- For running the high availability testing, see [Get started with High Availability testing](testing-framework-high-availability.md).
- For running the configuration checks, see [Get started with configuration validation](https://github.com/Azure/sap-automation-qa/tree/main/docs/CONFIGURATION_CHECKS.md).
- To understand the architecture of SAP Testing Automation Framework, see [Review the framework architecture](testing-framework-architecture.md).
