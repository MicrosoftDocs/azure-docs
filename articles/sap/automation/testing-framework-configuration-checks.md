---
title: SAP Testing Automation Framework Configuration Checks
description: Learn about configuration validation checks in the SAP Testing Automation Framework
author: devanshjain
ms.author: devanshjain
ms.reviewer: depadia
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.date: 10/27/2025
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# SAP Testing Automation Framework: Configuration checks (Preview)

The SAP Testing Automation Framework includes comprehensive configuration validation capabilities to ensure SAP systems comply with best practices and guidelines for deployments on Microsoft Azure. These configuration checks help identify potential issues that can affect system performance, reliability, and compliance.

## Overview

Configuration validation is a critical component of the testing framework that performs nonintrusive checks to validate system configurations against SAP on Azure best practices. These checks help identify configuration issues before they affect production systems. The framework validates various aspects of the SAP system, including infrastructure settings, operating system parameters, storage configurations, and cluster resource settings.

These checks are nonintrusive, meaning they don't modify the system or require downtime. Instead, they analyze existing configurations and provide detailed reports highlighting any deviations from recommended practices.

> [!NOTE]
> The configuration checks in SAP Testing Automation Framework is currently in public preview.

### Configuration validation checks

The configuration validation checks within the SAP Testing Automation Framework are systematically organized into distinct logical groupings that provide flexibility in execution. Each group can be executed independently on a standalone basis, or alternatively, all groups can be executed together in a comprehensive validation run. 

The primary categories of configuration validation checks include the following. Examples of checks in each category are provided below to illustrate the nature and scope of validations performed:

> [!TIP]
> For the complete and up-to-date list of all configuration checks, refer to the [Configuration Checks documentation](https://github.com/Azure/sap-automation-qa/blob/main/docs/CONFIGURATION_CHECKS.md) on GitHub.

#### Infrastructure

- While not a separate execution category, infrastructure checks are integrated as an essential component within the other categories.
- **Azure Compute**: Validation of Virtual Machine SKU, Accelerated Networking enablement, Availability Set/Zone configuration, and Proximity Placement Group settings.
- **Storage**: Verification of Premium SSD/Ultra Disk usage, Write Accelerator configuration, disk caching policies, and redundancy settings.

#### Database

- Validates SAP HANA or IBM DB2 specific settings.
- **SAP HANA**: Checks for memory allocation, system replication parameters, and Pacemaker cluster configurations (resource agents, fencing mechanisms, and constraints).
- **IBM DB2**: Verification of hardware requirements, system language settings, and operating system tuning parameters.

#### Central services

- Validates the configuration of ASCS (ABAP SAP Central Services) and ERS (Enqueue Replication Server) instances.
- Checks for virtual hostname configuration, file system mount options, and service startup ordering.

#### Application servers

- Validates the configuration of the application server instances.

> [!NOTE]
> High Availability (HA) configuration checks and functional tests are currently supported only for SAP HANA databases. For IBM DB2 databases, only non-HA configuration checks are available.

## Next steps

- To get started on SAP Testing Automation Framework setup, follow the guide [Setup Guide for SAP Testing Automation Framework](https://github.com/Azure/sap-automation-qa/blob/main/docs/SETUP.MD).
- For running the configuration checks, see [Get started with configuration validation](https://github.com/Azure/sap-automation-qa/tree/main/docs/CONFIGURATION_CHECKS.md).
- To understand the architecture of SAP Testing Automation Framework, see [Review the framework architecture](testing-framework-architecture.md).
- For SAP Testing Automation Framework support matrix, see [Understand supported platforms](testing-framework-supportability.md).
