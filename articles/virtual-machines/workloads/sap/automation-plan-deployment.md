---
title: Plan your SAP deployment with the automation framework on Azure
description: Prepare for using the SAP on Azure Deployment Automation Framework. Steps include planning for credentials management, DevOps structure, and deployment scenarios.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Plan your deployment of SAP automation framework

There are multiple considerations for planning an SAP deployment and running the [SAP on Azure Deployment Automation Framework](automation-deployment-framework.md), this include topics like deployment credentials management, virtual network design.

For generic SAP on Azure design considerations please visit [Introduction to an SAP adoption scenario](/azure/cloud-adoption-framework/scenarios/sap)

> [!NOTE]
> The Terraform deployment uses Terraform templates provided by Microsoft from the [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation/). The templates use parameter files with your system-specific information to perform the deployment.

## Credentials management

The automation framework uses [Service Principals](#service-principal-creation) for infrastructure deployment. You can use different deployment credentials (service principals) for each [workload zone](#workload-zone-structure). The framework stores these credentials in the [deployer's](automation-deployment-framework.md#deployment-components) key vault in Azure Key Vault. Then, the framework retrieves these credentials dynamically during the deployment process.

The automation framework also defines the credentials for the default virtual machine (VM) accounts, as provided at the time of the VM creation. These credentials include:

| Credential | Scope        | Storage | Identifier   | Description |
| ---------- | -----        | ------- | ----------   | ----------- |
| Local user | Deployer     | -       | Current user | Bootstraps the deployer. |
| [Service principal](#service-principal-creation) | Environment | Deployer's key vault | Environment identifier | Deployment credentials. |
| VM credentials | Environment | Workload's key vault | Environment identifier | Sets the default VM user information. |

### SAP and Virtual machine Credentials management

The automation framework will use the workload zone key vault for storing both the automation user credentials and the SAP system credentials. The virtual machine credentials are named as follows:

| Credential         | Name                            | Example                         |
| ------------------ | ------------------------------- | ------------------------------- | 
| Private key        | [IDENTIFIER]-sshkey             | DEV-WEEU-SAP01-sid-sshkey       | 
| Public key         | [IDENTIFIER]-sshkey-pub         | DEV-WEEU-SAP01-sid-sshkey-pub   | 
| Username           | [IDENTIFIER]-username           | DEV-WEEU-SAP01-sid-username     | 
| Password           | [IDENTIFIER]-password           | DEV-WEEU-SAP01-sid-password     | 
| sidadm Password    | [IDENTIFIER]-[SID]-sap-password | DEV-WEEU-SAP01-X00-sap-password | 


### Service principal creation

Create your service principal:

1. Sign in to the [Azure CLI](/cli/azure/) with an account that has adequate privileges to create a Service Principal.
1. Create a new Service Principal by running the command `az ad sp create-for-rbac`. Make sure to use a description name for `--name`. For example:
    ```azurecli
    az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" --name="DEV-Deployment-Account"
    ```
1. Note the output. You need the application identifier (`appId`), password (`password`), and tenant identifier (`tenant`) for the next step. For example:
    ```json
    {
        "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "displayName": "DEV-Deployment-Account",
        "name": "http://DEV-Deployment-Account",
        "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
    ```
1. Optionally assign the User Access Administrator role to your service principal. For example: 
    ```azurecli
    az role assignment create --assignee <your-application-ID> --role "User Access Administrator" --scope /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>
    ```

For more information, see [the Azure CLI documentation for creating a service principal](/cli/azure/create-an-azure-service-principal-azure-cli)

## DevOps structure

The Terraform automation templates are in the [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation/). For most use cases, consider this repository as read-only and don't modify it.

For your own parameter files, it's a best practice to keep these files in a source control repository that you manage. You can clone the [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation/) into your source control repository and then [create an appropriate folder structure](#folder-structure) in the repository.

> [!IMPORTANT]
> Your parameter file's name becomes the name of the Terraform state file. Make sure to use a unique parameter file name for this reason.

### Folder structure

The following sample folder hierarchy shows how to structure your configuration files along with the automation framework files. The first top-level folder, called **sap-automation**, has the automation framework files that you don't need to change in most use cases. The second top-level folder, called **WORKSPACES**, contains subfolders with configuration files for your deployment settings.

| Folder name | Contents | Description |
| ----------- | -------- | ----------- |
| None (root level) | Configuration files, template files | The root folder for all systems that you're managing from this deployment environment. |
| CONFIGURATION | Shared configuration files | A shared folder for referring to custom configuration files from multiple places. For example, custom disk sizing configuration files. |
| DEPLOYER | Configuration files for the deployer | A folder with [deployer configuration files](automation-configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-DEP00-INFRASTRUCTURE**. |
| LIBRARY | Configuration files for SAP Library | A folder with [SAP Library configuration files](automation-configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP-LIBRARY**. |
| LANDSCAPE | Configuration files for landscape deployments | A folder with [configuration files for all workload zones](automation-deploy-workload-zone.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP00-INFRASTRUCTURE**. |
| SYSTEM | Configuration files for the SAP systems | A folder with [configuration files for all SAP System Identification (SID) deployments](automation-configure-system.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network - SID**. for example, **PROD-WEEU-SAPO00-ABC**. |

:::image type="content" source="./media/automation-plan-deployment/folder-structure.png" alt-text="Screenshot of example folder structure, showing separate folders for SAP HANA and multiple workload environments.":::

## Supported deployment scenarios

The automation framework supports [deployment into both new and existing scenarios](automation-new-vs-existing.md).

## Azure regions

Before you deploy a solution, it's important to consider which Azure regions to use. Different Azure regions might be in scope depending on your specific scenario.

The automation framework supports deployments into multiple Azure regions. Each region hosts:

- Deployment infrastructure
- SAP Library with state files and installation media
- 1-N workload zones
- 1-N SAP systems in the workload zones

## Deployment environments

If you're supporting multiple workload zones in a region, use a unique identifier for your deployment environment and SAP library. Don't use the identifier for the workload zone. For example, use `MGMT` for management purposes.

The automation framework also supports having the deployment environment and SAP library in separate subscriptions than the workload zones.

The deployment environment provides the following services:

- A deployment VM, which does Terraform deployments and Ansible configuration.
- A key vault, which contains service principal identity information for use by Terraform deployments.
- An Azure Firewall component, which provides outbound internet connectivity.

The deployment configuration file defines the region, environment name, and virtual network information. For example:

```json
{
	"infrastructure": {
		"environment": "MGMT",
		"region": "westeurope",
		"vnets": {
			"management": {
				"address_space": "0.0.0.0/25",
				"subnet_mgmt": {
					"prefix": "0.0.0.0/28"
				},
				"subnet_fw": {
					"prefix": "0.0.0.0/26"
				}
			}
		}
	},
	"options": {
		"enable_deployer_public_ip": true
	},
	"firewall_deployment": true
}
```

For more information, see the [in-depth explanation of how to configure the deployer](automation-configure-control-plane.md).

## SAP Library configuration

The SAP library provides storage for SAP installation media, Bill of Material (BOM) files,  and Terraform state files. The configuration file defines the region and environment name for the SAP library. For parameter information and examples, see [how to configure the SAP library for automation](automation-configure-control-plane.md).

## Workload zone structure

Most SAP configurations have multiple [workload zones](automation-deployment-framework.md#deployment-components) for different application tiers. For example, you might have different workload zones for development, quality assurance, and production.

You'll be creating or granting access to the following services in each workload zone:

* Azure Virtual Networks, for virtual networks, subnets and network security groups.
* Azure Key Vault, for system credentials and the deployment Service Principal.
* Azure Storage accounts, for Boot Diagnostics and Cloud Witness.
* Shared storage for the SAP Systems either Azure Files or Azure NetApp Files.

Before you design your workload zone layout, consider the following questions:

* How many workload zones does your scenario require?
* In which regions do you need to deploy workloads?
* What's your [deployment scenario](#supported-deployment-scenarios)?

For more information, see [how to configure a workload zone deployment for automation](automation-deploy-workload-zone.md).

## SAP system setup

The SAP system contains all Azure components required to host the SAP application.

Before you configure the SAP system, consider the following questions:

* What database backend do you want to use?
* How many database servers do you need?
* Does your scenario require high availability?
* How many application servers do you need?
* How many web dispatchers do you need, if any? 
* How many central services instances do you need?
* What size virtual machine (VM) do you need?
* Which VM image do you want to use? Is the image on Azure Marketplace or custom?
* Are you deploying to [a new or existing deployment scenario](#supported-deployment-scenarios)?
* What is your IP allocation strategy? Do you want Azure to set IPs or use custom settings?

For more information, see [how to configure the SAP system for automation](automation-configure-system.md).

## Deployment flow

When planning a deployment, it's important to consider the overall flow. There are three main steps of an SAP deployment on Azure with the automation framework.

1. Deploy the control plane. This step deploys components to support the SAP automation framework in a specified Azure region. Some parts of this step are:
    1. Creating the deployment environment
    1. Creating shared storage for Terraform state files
    1. Creating shared storage for SAP installation media

1. Deploy the workload zone. This step deploys the [workload zone components](#workload-zone-structure), such as the virtual network and key vaults.

1. Deploy the system. This step includes the [infrastructure for the SAP system](#sap-system-setup) deployment and the SAP configuration [configuration and SAP installation](automation-run-ansible.md).

## Orchestration environment

For the automation framework, you must execute templates and scripts from one of the following supported environments:

* Azure DevOps
* An Azure-hosted Linux VM
* Azure Cloud Shell
* PowerShell on your local Windows computer

## Naming conventions

The automation framework uses a default naming convention. If you'd like to use a custom naming convention, plan and define your custom names before deployment. For more information, see [how to configure the naming convention](automation-naming-module.md). 

## Disk sizing

If you want to [configure custom disk sizes](automation-configure-extra-disks.md), make sure to plan your custom setup before deployment.

## Next steps

> [!div class="nextstepaction"]
> [About manual deployments of automation framework](automation-manual-deployment.md)
