---
title: About SAP Testing Automation Framework
description: Overview of the framework and tooling for SAP Testing Automation Framework.
author: devanshjain
ms.author: devanshjain
ms.reviewer: depadia
ms.date: 10/27/2025
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.topic: conceptual
---

# SAP Testing Automation Framework overview

The [SAP Testing Automation Framework](https://github.com/Azure/sap-automation-qa) (STAF) is an open-source orchestration tool that validates SAP deployments on Microsoft Azure. It validates SAP system's and infrastructure configurations against SAP on Azure best practices and guidelines. Additionally, the framework automates testing of High Availability (HA) cluster's functional behavior in SAP systems.

The SAP Testing Automation Framework started as an addition to the [SAP Deployment Automation Framework (SDAF)](./deployment-framework.md), offering a robust testing layer for SAP systems deployed on Azure through automated validation processes. The framework is flexible and works as a standalone solution, allowing customers who have not deployed their systems using SDAF to independently use the testing capabilities and validate their existing SAP environments. The framework validates the configurations and behavior of SAP HANA databases and SAP Central Services (ASCS/ERS) in high availability setup and performs comprehensive configuration checks for SAP systems, including database (SAP HANA and IBM DB2), central services, and application server components.

## Test categories

SAP Testing Automation is designed as a scalable framework to orchestrate and validate an array of SAP landscape configurations/deployment patterns through repeatable, policy-driven test modules. The framework currently takes care of following scenarios :

### High Availability Testing

In the SAP Testing Automation Framework, thorough validation of high availability SAP HANA scale-up and SAP Central Services failover mechanism in a two node pacemaker cluster can be performed, ensuring the system operates correctly across different situations.

- **High Availability Configuration Validation (online):** The framework helps to ensure that SAP HANA scale-up and SAP Central Services configurations and load balancer settings are compliant with SAP on Azure high availability configuration guidelines.
- **High Availability Configuration Validation (offline):** Offline validation is a mode of the framework that validates SAP HANA and SAP Central Services high availability cluster configurations without establishing a live SSH connection to the production cluster. Instead, it analyzes captured cluster information base (CIB) XML files exported from each cluster node.
- **Functional Testing:** The framework executes series of real-world failure conditions based on the SAP HANA and SAP Central Services high availability setup to identify potential issues, whether during a new system deployment or before implementing cluster changes in a production environment. The test cases are based on what is documented in how-to guides for SAP HANA and SAP Central Services configuration.

### Configuration checks (Preview)

The framework performs comprehensive configuration checks to ensure that the SAP system and its components are set up according to [SAP on Azure best practice](../../sap/index.yml). This includes validating infrastructure settings, operating system parameter configurations, and network settings, in addition to the cluster configuration, to identify any deviations that affect system performance or reliability.

- **Infrastructure validation:** This includes validating the underlying infrastructure components, such as virtual machines, load balancer, and other resource configurations, to ensure they meet the requirements for running SAP workloads on Azure.

- **Storage configuration checks:** It validates settings of disks, storage accounts, Azure NetApp Files, including throughput, performance, and stripe size.

- **Operating system and SAP parameter validation:** The framework checks critical operating system parameters and SAP kernel settings to ensure they align with recommended configurations.

- **Cluster configuration validation:** This framework ensures that the high availability cluster resource settings adhere to best practices for high availability and failover conditions.

The framework generates comprehensive reports, highlighting configuration mismatch or deviations from recommended best practices. For high availability functional tests, the report includes failover test outcomes, any failures encountered, and logs with insights to aid in troubleshooting identified issues.

> [!NOTE]
>
> The configuration checks scenario in SAP Testing Automation Framework is in public preview, while the high availability testing scenario is generally available (GA).

## Why use the SAP Testing Automation Framework?

Testing is crucial for keeping SAP systems running smoothly, especially for critical business operations. This framework helps by addressing key challenges:

- **Risk Prevention** - High availability testing simulates system failures like node crashes, network issues, and storage failures to verify recovery mechanisms work properly, catching problems before they affect production operations. Configuration validation detects misalignments with SAP on Azure best practices early.

- **Compliance Requirements** - Many businesses need to prove their SAP systems are reliable. This framework provides detailed reports and logs that help with audits and ensure compliance with internal and regulatory standards.

- **Quality Assurance** - The framework runs automated tests to verify that the failover behavior of SAP components functions as expected on Azure. It also ensures that cluster and resource configurations are set up correctly, maintaining system reliability.

- **Test Automation** - Manually validating SAP systems' configurations and high availability (HA) setup is slow and error-prone. This framework automates the process, from setup to reporting, saving time and ensuring accurate and consistent results.

## Considerations

Before running the tests or validations using the SAP Testing Automation Framework, review these guidelines to ensure smooth execution:

- **New deployment validation:** For new SAP deployments, run these tests before go-live to validate the system configuration and cluster behavior. This helps identify configuration issues and verify failover mechanisms in a controlled environment before production use.

- **Test duration:** Full end-to-end high availability tests typically take around 90 minutes for new HANA setups with small databases and SAP Central Services. For larger databases, the run time may be longer. Estimate the duration based on your specific environment. (Internal validation has been performed on HANA databases up to 3.5 TiB.)

- **Large database testing:** For large HANA databases, test first in a non-production environment that matches your production scale. You may need to adjust retry logic parameters, as operations like stop, start, and registration take longer on large databases.

- **Production system testing:** For live production SAP systems, run high availability tests only during scheduled maintenance windows with no active business operations. We recommend estimating the test duration first by running tests in a similarly sized non-production system.

- **Non-invasive testing:** The framework doesn't install packages or modify any cluster node configurations. The generated HTML report only reflects the configuration values and observed behavior of your current setup.

## Architecture and components

To learn how the framework works, refer to the [architecture and components](./testing-framework-architecture.md) documentation.

## Get started

There are two primary ways to get started with the SAP Testing Automation Framework. You can choose the path that best fits your current environment and objectives:

### Option 1: Standalone setup of SAP Testing Automation Framework

For users focused solely on validating SAP functionality and configurations, the standalone approach offers a streamlined process to test critical SAP components without the complexity of full deployment integration. For more information on the setup, see following documents to get started :

- Configure management server following the document [Setup Guide for SAP Testing Automation Framework](https://github.com/Azure/sap-automation-qa/blob/main/docs/SETUP.MD).
  - For high availability testing scenarios, see [High Availability documentation](https://github.com/Azure/sap-automation-qa/blob/main/docs/HIGH_AVAILABILITY.md).
  - For Configuration Checks and Testing details, see the [Configuration Checks documentation](https://github.com/Azure/sap-automation-qa/blob/main/docs/CONFIGURATION_CHECKS.md).

### Option 2: Integration with SAP Deployment Automation Framework (SDAF)

If you already have an [SAP Deployment Automation Framework](./deployment-framework.md) environment set up, integrating the SAP Testing Automation Framework is a natural extension that allows you to apply existing deployment pipelines and configurations. For more information on the setup, see [Setup Guide for SAP Testing Automation Framework with SDAF](https://github.com/Azure/sap-automation-qa/blob/main/docs/SDAF_INTEGRATION.md)

## Next steps

- To understand the architecture of SAP Testing Automation Framework, see [Review the framework architecture](testing-framework-architecture.md).
- For SAP Testing Automation Framework support matrix, see [Understand supported platforms](testing-framework-supportability.md).
