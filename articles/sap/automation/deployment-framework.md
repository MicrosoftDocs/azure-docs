---
title: About SAP Deployment Automation Framework
description: Overview of the framework and tooling for SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 05/29/2022
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.topic: conceptual
---
# SAP Deployment Automation Framework

[SAP Deployment Automation Framework](https://github.com/Azure/sap-automation) is an open-source orchestration tool that's used to deploy, install, and maintain SAP environments. You can create infrastructure for SAP landscapes based on SAP HANA and NetWeaver with AnyDB by using [Terraform](https://www.terraform.io/) and [Ansible](https://www.ansible.com/) for the operating system and application configuration. You can deploy the systems on any of the SAP-supported operating system versions and into any Azure region.

[Terraform](https://www.terraform.io/) from Hashicorp is an open-source tool for provisioning and managing cloud infrastructure.

[Ansible](https://www.ansible.com/) is an open-source platform by Red Hat that automates cloud provisioning, configuration management, and application deployments. When you use Ansible, you can automate deployment and configuration of resources in your environment.

The [automation framework](https://github.com/Azure/sap-automation) has two main components:

- Deployment infrastructure (control plane and hub component)
- SAP infrastructure (SAP workload and spoke component)

You use the control plane of SAP Deployment Automation Framework to deploy the SAP infrastructure and the SAP application. The deployment uses Terraform templates to create the [infrastructure as a service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas)-defined infrastructure to host the SAP applications.

> [!NOTE]
> This automation framework is based on Microsoft best practices and principles for SAP on Azure. To understand how to use certified virtual machines (VMs) and storage solutions for stability, reliability, and performance, see [Get started with SAP automation framework on Azure](get-started.md).
>
> This automation framework also follows the [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/).

You can use the automation framework to deploy the following SAP architectures:

- **Standalone**: For this architecture, all the SAP roles are installed on a single server.
- **Distributed**: With this architecture, you can separate the database server and the application tier. The application tier can further be separated in two by having SAP central services on a VM and one or more application servers.
- **Distributed (highly available)**: This architecture is similar to the distributed architecture. In this deployment, the database and/or SAP central services can both be configured by using a highly available configuration that uses two VMs, each with Pacemaker clusters.

The dependency between the control plane and the application plane is illustrated in the following diagram. In a typical deployment, a single control plane is used to manage multiple SAP deployments.

:::image type="content" source="./media/deployment-framework/control-plane-sap-infrastructure.png" alt-text="Diagram that shows the dependency between the control plane and the application plane for SAP Deployment Automation Framework.":::

## About the control plane

The control plane houses the deployment infrastructure from which other environments are deployed. After the control plane is deployed, it rarely needs to be redeployed, if ever.

The control plane provides the following services:

- Deployment agents for running:
    - Terraform deployment
    - Ansible configuration
- Persistent storage for the Terraform state files
- Persistent storage for the downloaded SAP software
- Azure Key Vault for secure storage for deployment credentials
- Private DNS zone (optional)
- Configuration for web applications

The control plane is typically a regional resource deployed into the hub subscription in a [hub-and-spoke architecture](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).

The following diagram shows the key components of the control plane and the workload zone.

:::image type="content" source="./media/deployment-framework/automation-diagram-full.png" alt-text="Diagram that shows the SAP Deployment Automation Framework environment.":::

The application configuration is performed from the deployment agents in the control plane by using a set of predefined playbooks. These playbooks will:

- Configure base operating system settings.
- Configure SAP-specific operating system settings.
- Make the installation media available in the system.
- Install the SAP system components.
- Install the SAP database (SAP HANA and AnyDB).
- Configure high availability by using Pacemaker.
- Configure high availability for your SAP database.

For more information about how to configure and deploy the control plane, see [Configure the control plane](configure-control-plane.md) and [Deploy the control plane](deploy-control-plane.md).

## Software acquisition process

The framework also provides an Ansible playbook that can be used to download the software from SAP and persist it in the storage accounts in the control plane's SAP library resource group.

The software acquisition is using an SAP application manifest file that contains the list of SAP software to be downloaded. The manifest file is a YAML file that contains the:

- List of files to be downloaded.
- List of the product IDs for the SAP application components.
- Set of template files used to provide the parameters for the unattended installation.

The SAP software download playbook processes the manifest file and the dependent manifest files and downloads the SAP software from SAP by using the specified SAP user account. The software is downloaded to the SAP library storage account and is available for the installation process.

As part of the download process, the application manifest and the supporting templates are also persisted in the storage account. The application manifest and the dependent manifests are aggregated into a single manifest file that's used by the installation process.

### Deployer VMs

These VMs are used to run the orchestration scripts that deploy the Azure resources by using Terraform. They're also Ansible controllers and are used to execute the Ansible playbooks on all the managed nodes, that is, the VMs of an SAP deployment.

## About the SAP workload

The SAP workload contains all the Azure infrastructure resources for the SAP deployments. These resources are deployed from the control plane.

The SAP workload has two main components:

- SAP workload zone
- SAP systems

## About the SAP workload zone

The workload zone allows for partitioning of the deployments into different environments, such as development, test, and production. The workload zone provides the shared services (networking and credentials management) to the SAP systems.

The SAP workload zone provides the following services to the SAP systems:

- Virtual networking infrastructure
- Azure Key Vault for system credentials (VMs and SAP)
- Shared storage (optional)

For more information about how to configure and deploy the SAP workload zone, see [Configure the workload zone](configure-workload-zone.md) and [Deploy the SAP workload zone](deploy-workload-zone.md).

## About the SAP system

The system deployment consists of the VMs that run the SAP application, including the web, app, and database tiers.

The SAP system provides VM, storage, and support infrastructure to host the SAP applications.

For more information about how to configure and deploy the SAP system, see [Configure the SAP system](configure-system.md) and [Deploy the SAP system](deploy-system.md).

## Glossary

The following terms are important concepts for understanding the automation framework.

### SAP concepts

> [!div class="mx-tdCol2BreakAll "]
> | Term                               | Description                                                                         |
> | ---------------------------------- | ----------------------------------------------------------------------------------- |
> | System                             | An instance of an SAP application that contains the resources the application needs to run. Defined by a unique three-letter identifier, the *SID*.
> | Landscape                          | A collection of systems in different environments within an SAP application. For example, SAP ERP Central Component (ECC), SAP customer relationship management (CRM), and SAP Business Warehouse (BW). |
> | Workload zone                      | Partitions the SAP applications to environments, such as nonproduction and production environments or development, quality assurance, and production environments. Provides shared resources, such as virtual networks and key vaults, to all systems within. |

The following diagram shows the relationships between SAP systems, workload zones (environments), and landscapes. In this example setup, the customer has three SAP landscapes: ECC, CRM, and BW. Each landscape contains three workload zones: production, quality assurance, and development. Each workload zone contains one or more systems.

:::image type="content" source="./media/deployment-framework/sap-terms.png" alt-text="Diagram that shows the SAP configuration with landscapes, workflow zones, and systems.":::

### Deployment components

> [!div class="mx-tdCol2BreakAll "]
> | Term                               | Description                                                                                        | Scope                   |
> | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------- |
> | Deployer                           | A VM that can execute Terraform and Ansible commands.                                 | Region                  |
> | Library                            | Provides storage for the Terraform state files and the SAP installation media.                     | Region                  |
> | Workload zone                      | Contains the virtual network for the SAP systems and a key vault that holds the system credentials. | Workload zone           |
> | System                             | The deployment unit for the SAP application (SID). Contains all infrastructure assets.              | Workload zone           |

## Next steps

> [!div class="nextstepaction"]
> - [Get started with the deployment automation framework](get-started.md)
> - [Plan for the automation framework](plan-deployment.md)
> - [Configure Azure DevOps for the automation framework](configure-devops.md)
> - [Configure the control plane](configure-control-plane.md)
> - [Configure the workload zone](configure-workload-zone.md)
> - [Configure the SAP system](configure-system.md)