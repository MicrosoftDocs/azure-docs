---
title: About SAP on Azure Deployment Automation Framework
description: Overview of the framework and tooling for the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 05/29/2022
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.topic: conceptual
---
# SAP on Azure Deployment Automation Framework

The [SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation) is an open-source orchestration tool for deploying, installing and maintaining SAP environments. You can create infrastructure for SAP landscapes based on SAP HANA and NetWeaver with AnyDB using [Terraform](https://www.terraform.io/), and [Ansible](https://www.ansible.com/) for the operating system and application configuration.  The systems can be deployed on any of the SAP-supported operating system versions and deployed into any Azure region.

Hashicorp [Terraform](https://www.terraform.io/) is an open-source tool for provisioning and managing cloud infrastructure.

[Ansible](https://www.ansible.com/) is an open-source platform by Red Hat that automates cloud provisioning, configuration management, and application deployments. Using Ansible, you can automate deployment and configuration of resources in your environment.

The [automation framework](https://github.com/Azure/sap-automation) has two main components:
-	Deployment infrastructure (control plane, hub component)
-	SAP Infrastructure (SAP Workload, spoke component)

You'll use the control plane of the SAP on Azure Deployment Automation Framework to deploy the SAP Infrastructure and the SAP application. The deployment uses Terraform templates to create the [infrastructure as a service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas) defined infrastructure to host the SAP Applications.

> [!NOTE]
> This automation framework is based on Microsoft best practices and principles for SAP on Azure. Review the [get-started guide for SAP on Azure virtual machines (Azure VMs)](get-started.md) to understand how to use certified virtual machines and storage solutions for stability, reliability, and performance.
>
> This automation framework also follows the [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/).

The automation framework can be used to deploy the following SAP architectures:

- Standalone
- Distributed
- Distributed (Highly Available)

In the Standalone architecture, all the SAP roles are installed on a single server. In the distributed architecture, you can separate the database server and the application tier. The application tier can further be separated in two by having SAP Central Services on a virtual machine and one or more application servers.

The Distributed (Highly Available) deployment is similar to the Distributed architecture. In this deployment, the database and/or SAP Central Services can both be configured using a highly available configuration using two virtual machines each with Pacemaker clusters.

The dependency between the control plane and the application plane is illustrated in the diagram below. In a typical deployment, a single control plane is used to manage multiple SAP deployments.

:::image type="content" source="./media/deployment-framework/control-plane-sap-infrastructure.png" alt-text="Diagram showing the SAP on Azure Deployment Automation Framework's dependency between the control plane and application plane.":::

## About the control plane

The control plane houses the deployment infrastructure from which other environments will be deployed. Once the control plane is deployed, it rarely needs to be redeployed, if ever.

The control plane provides the following services
- Deployment agents for running:
    - Terraform Deployment
    - Ansible configuration
- Persistent storage for the Terraform state files
- Persistent storage for the Downloaded SAP Software
- Azure Key Vault for secure storage for deployment credentials
- Private DNS zone (optional)
- Configuration Web Application

The control plane is typically a regional resource deployed in to the hub subscription in a [hub and spoke architecture](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).


The following diagram shows the key components of the control plane and workload zone.

:::image type="content" source="./media/deployment-framework/automation-diagram-full.png" alt-text="Diagram showing the SAP on Azure Deployment Automation Framework environment.":::

The application configuration will be performed from the deployment agents in the Control plane using a set of pre-defined playbooks. These playbooks will:

- Configure base operating system settings
- Configure SAP-specific operating system settings
- Make the installation media available in the system
- Install the SAP system components
- Install the SAP database (SAP HANA, AnyDB)
- Configure high availability (HA) using Pacemaker
- Configure high availability (HA) for your SAP database


For more information of how to configure and deploy the control plane, see [Configuring the control plane](configure-control-plane.md) and [Deploying the control plane](deploy-control-plane.md).

## Software acquisition process

The framework also provides an Ansible playbook that can be used to download the software from SAP and persist it in the storage accounts in the Control Plane's SAP Library resource group.

The software acquisition is using an SAP Application manifest file that contains the list of SAP software to be downloaded. The manifest file is a YAML file that contains the following information:

- List of files to be downloaded
- List of the Product IDs for the SAP application components
- A set of template files used to provide the parameters for the unattended installation

The SAP Software download playbook will process the manifest file and the dependent manifest files and download the SAP software from SAP using the specified SAP user account. The software will be downloaded to the SAP Library storage account and will be available for the installation process. As part of the download the process the application manifest and the supporting templates will also be persisted in the storage account. The application manifest and the dependent manifests will be aggregated into a single manifest file that will be used by the installation process.

### Deployer Virtual Machines

These virtual machines are used to run the orchestration scripts that will deploy the Azure resources using Terraform. They are also Ansible Controllers and are used to execute the Ansible playbooks on all the managed nodes, i.e the virtual machines of an SAP deployment.

## About the SAP Workload

The SAP Workload contains all the Azure infrastructure resources for the SAP Deployments. These resources are deployed from the control plane.
The SAP Workload has two main components:
-	SAP Workload Zone
-	SAP System(s)

## About the SAP Workload Zone

The workload zone allows for partitioning of the deployments into different environments (Development, Test, Production). The Workload zone will provide the shared services (networking, credentials management) to the SAP systems.

The SAP Workload Zone provides the following services to the SAP Systems
-	Virtual Networking infrastructure
-	Azure Key Vault for system credentials (Virtual Machines and SAP)
-	Shared Storage (optional)

For more information of how to configure and deploy the SAP Workload zone, see [Configuring the workload zone](configure-workload-zone.md) and [Deploying the SAP workload zone](deploy-workload-zone.md).

## About the SAP System

The system deployment consists of the virtual machines that will be running the SAP application, including the web, app and database tiers.

The SAP System provides the following services
-	Virtual machine, storage, and supporting infrastructure to host the SAP applications.

For more information of how to configure and deploy the SAP System, see [Configuring the SAP System](configure-system.md) and [Deploying the SAP system](deploy-system.md).

## Glossary

The following terms are important concepts for understanding the automation framework.

### SAP concepts

> [!div class="mx-tdCol2BreakAll "]
> | Term                               | Description                                                                         |
> | ---------------------------------- | ----------------------------------------------------------------------------------- |
> | System                             | An instance of an SAP application that contains the resources the application needs to run. Defined by a unique three-letter identifier, the **SID**.
> | Landscape                          | A collection of systems in different environments within an SAP application. For example, SAP ERP Central Component (ECC), SAP customer relationship management (CRM), and SAP Business Warehouse (BW). |
> | Workload zone                      | Partitions the SAP applications to environments, such as non-production and production environments or development, quality assurance, and production environments. Provides shared resources, such as virtual networks and key vault, to all systems within. |

The following diagram shows the relationships between SAP systems, workload zones (environments), and landscapes. In this example setup, the customer has three SAP landscapes: ECC, CRM, and BW. Each landscape contains three workload zones: production, quality assurance, and development. Each workload zone contains one or more systems.

:::image type="content" source="./media/deployment-framework/sap-terms.png" alt-text="Diagram of SAP configuration with landscapes, workflow zones, and systems.":::

### Deployment components

> [!div class="mx-tdCol2BreakAll "]
> | Term                               | Description                                                                                        | Scope                   |
> | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------- |
> | Deployer                           | A virtual machine that can execute Terraform and Ansible commands.                                 | Region                  |
> | Library                            | Provides storage for the Terraform state files and the SAP installation media.                     | Region                  |
> | Workload zone                      | Contains the virtual network for the SAP systems and a key vault that holds the system credentials | Workload zone           |
> | System                             | The deployment unit for the SAP application (SID). Contains all infrastructure assets              | Workload zone           |


## Next steps

> [!div class="nextstepaction"]
> [Get started with the deployment automation framework](get-started.md)
> [Planning for the automation framwework](plan-deployment.md)
> [Configuring Azure DevOps for the automation framwework](configure-devops.md)
> [Configuring the control plane](configure-control-plane.md)
> [Configuring the workload zone](configure-workload-zone.md)
> [Configuring the SAP System](configure-system.md)

