---
title: About SAP deployment automation framework on Azure
description: Overview of the framework and tooling for automated deployment for SAP on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/13/2021
ms.service: virtual-machines-sap
ms.topic: conceptual
---
# SAP deployment automation framework on Azure

The [SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-hana) helps automation your SAP deployment on Azure. 

You can create infrastructure for SAP landscapes based on SAP HANA and NetWeaver with AnyDB. The framework is compatible with all SAP-supported operating system versions. You can deploy all SAP tiers to a region.

The framework uses [Terraform](https://www.terraform.io/) for infrastructure deployment, and [Ansible](https://www.ansible.com/) for the operating system and application configuration.

> [!NOTE]
> This automation framework is based on Microsoft best practices and principles for SAP on Azure. Review the [get-started guide for SAP on Azure virtual machines (Azure VMs)](get-started.md) to understand how to use certified virtual machines and storage solutions for stability, reliability, and performance.
> 
> This automation framework also follows the [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/).

## About automation framework

The [SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-hana) has a collection of processes and a flexible workflow. There are two main parts of the workflow, infrastructure and configuration. 

First, you create your [infrastructure as a service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas) using infrastructure as code. You use this setup to manage the deployment of infrastructure components. These components include virtual machines (VMs), networks, and storage. You also set parameters to define the deployment environment for later activities. 

Second, you configure your deployment using Ansible. You run different roles to configure each deployed server with parameter files. Some steps include:

- Configuring your base operating system (OS)
- Configuring your SAP-specific OS
- Configuring your SAP Bill of Material (SAP BoM) process
- Installing your SAP system
- Installing your SAP database (SAP DB, SAP HANA)
- Configuring your SAP Evaluated Receipt Settlement (ERS) process
- Configuring Pacemaker for your SAP system
- Configuring high availability (HA) for your SAP database

## Glossary

The following terms are important concepts for understanding the automation framework.

### SAP concepts

| Term | Description |
| ---- | ----------- |
| System | An instance of an SAP application that contains the resources the application needs to run. Defined by a unique three-letter identifier, the **SID**.
| Landscape | A collection of systems in different environments within an SAP application. For example, SAP ERP Central Component (ECC), SAP customer relationship management (CRM), and SAP Business Warehouse (BW). |
| Workload zone | Partitions the SAP application into environments, such as non-production and production environments. Also called a deployment environment. Optionally, segment the landscape into tiers, such as development, quality assurance, and production. Provides shared resource, such as virtual networks and key vaults, to all systems within. |

The following diagram shows the relationships between SAP systems, workload zones (environments), and landscapes. In this example setup, the customer has three SAP landscapes: ECC, CRM, and BW. Each landscape contains three workload zones: production, quality assurance, and development. Each workload zone contains one or more systems.

:::image type="content" source="./media/automation-deployment-framework/sap-terms.png" alt-text="Diagram of SAP configuration with landscapes, workflow zones, and systems.":::

### Deployment artifacts

| Term | Description | Scope |
| ---- | ----------- | ----- |
| Deployer | A virtual machine that can execute Terraform and Ansible commands. Deployed to a virtual network, either new or existing, that is peered to the SAP virtual network. | Region |
| Library | Provides storage for the Terraform state files and SAP installation media. | Region |
| Workload zone | Contains the virtual network into which you deploy the SAP system or systems. Also contains a key vault that holds the credentials for the systems in the environment. | Workload zone |
| System | The deployment unit for the SAP application (SID). Contains virtual machines and supporting infrastructure artifacts, such as load balancers and availability sets. | Workload zone |

## Abbreviations in code

The following terms are common acronyms and abbreviations used in the automation framework's code.

| Term | Description |
| ---- | ----------- |
| ALB | Azure Load Balancer |
| AVSET | Azure Availability Set |
| B&D | Build and destroy. An alternate term for fall forward. |
| DR | Disaster recovery |
| Fall forward | See description for B&D |
| HA | High availability |
| NIC | Network interface component |
| NSG | Network security group |
| SA | Stand-alone instances, which aren't high availability. |
| SDU | SAP deployment unit. The SAP system deployment. |
| UDR | User-defined route |
| VM | Virtual machine |
| VNET | Virtual network |


## Next steps

> [!div class="nextstepaction"]
> [Get started with the automation framework](automation-get-started.md)
