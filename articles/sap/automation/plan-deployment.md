---
title: Plan your SAP deployment with the automation framework on Azure
description: Prepare for using the SAP on Azure Deployment Automation Framework. Steps include planning for credentials management, DevOps structure, and deployment scenarios.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Plan your deployment of SAP automation framework

There are multiple considerations for planning an SAP deployment and running the [SAP on Azure Deployment Automation Framework](deployment-framework.md), this includes topics like deployment mechanisms, credentials management, virtual network design.

For generic SAP on Azure design considerations, visit [Introduction to an SAP adoption scenario](/azure/cloud-adoption-framework/scenarios/sap)

> [!NOTE]
> The Terraform deployment uses Terraform templates provided by Microsoft from the [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/SAP-automation-samples/tree/main/Terraform/WORKSPACES). The templates use parameter files with your system-specific information to perform the deployment.

## Control Plane planning

You can perform the deployment and configuration activities from either Azure Pipelines or by using the provided shell scripts directly from Azure hosted Linux virtual machines. This environment is referred to as the control plane. For setting up Azure DevOps for the deployment framework, see [Set up Azure DevOps for SDAF](configure-control-plane.md).

Before you design your control plane, consider the following questions:

* In which regions do you need to deploy workloads?
* Is there a dedicated subscription for the control plane?
* Is there a dedicated deployment credential (Service Principal) for the control plane?
* Are you deploying to an existing Virtual Network or creating a new Virtual Network?
* How is outbound internet provided for the Virtual Machines?
* Are you going to deploy Azure Firewall for outbound internet connectivity?
* Are private endpoints required for storage accounts and the key vault?
* Are you going to use an existing Private DNS zone for the Virtual Machines or will you use the Control Plane for it?
* Are you going to use Azure Bastion for secure remote access to the Virtual Machines?
* Are you going to use the SDAF Configuration Web Application for performing configuration and deployment activities?

### Control Plane

If you're supporting multiple workload zones in a region, use a unique identifier for your control plane. Don't use the same identifier as for the workload zone. For example, use `MGMT` for management purposes.

The automation framework also supports having the control plane in separate subscriptions than the workload zones.

The control plane provides the following services:

- Deployment VMs, which do Terraform deployments and Ansible configuration. Acts as Azure DevOps self-hosted agents.
- A key vault, which contains the deployment credentials (service principals) used by Terraform when performing the deployments.
- Azure Firewall for providing outbound internet connectivity.
- Azure Bastion for providing secure remote access to the deployed Virtual Machines.
- An SDAF Configuration Azure Web Application for performing configuration and deployment activities.

The control plane is defined using two configuration files:

The deployment configuration file defines the region, environment name, and virtual network information. For example:

```tfvars
# Deployer Configuration File
environment = "MGMT"
location = "westeurope"

management_network_logical_name = "DEP01"

management_network_address_space = "10.170.20.0/24"
management_subnet_address_prefix = "10.170.20.64/28"

firewall_deployment = true
management_firewall_subnet_address_prefix = "10.170.20.0/26"

bastion_deployment = true
management_bastion_subnet_address_prefix = "10.170.20.128/26"

webapp_subnet_address_prefix = "10.170.20.192/27"
deployer_assign_subscription_permissions = true

deployer_count = 2

use_service_endpoint = true
use_private_endpoint = true
enable_firewall_for_keyvaults_and_storage = true

```

### DNS considerations

When planning the DNS configuration for the automation framework, consider the following questions:
 - Is there an existing Private DNS that the solutions can integrate with or do you need to use a custom Private DNS zone for the deployment environment?
 - Are you going to use predefined IP addresses for the Virtual Machines or let Azure assign them dynamically?

You can integrate with an exiting Private DNS Zone by providing the following values in your tfvars files:

```tfvars
management_dns_subscription_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
#management_dns_resourcegroup_name = "RESOURCEGROUPNAME"
use_custom_dns_a_registration = false
```

Without these values, a Private DNS Zone will be created in the SAP Library resource group. 

For more information, see the [in-depth explanation of how to configure the deployer](configure-control-plane.md).


## SAP Library configuration

The SAP library resource group provides storage for SAP installation media, Bill of Material (BOM) files, Terraform state files and optionally the Private DNS Zones. The configuration file defines the region and environment name for the SAP library. For parameter information and examples, see [how to configure the SAP library for automation](configure-control-plane.md).

## Workload zone planning

Most SAP application landscapes are partitioned in different tiers. In SDAF these are called workload zones, for example, you might have different workload zones for development, quality assurance, and production. See [workload zones](deployment-framework.md#deployment-components). 

The default naming convention for workload zones is `[ENVIRONMENT]-[REGIONCODE]-[NETWORK]-INFRASTRUCTURE`, for example, `DEV-WEEU-SAP01-INFRASTRUCTURE` for a development environment hosted in the West Europe region using the SAP01 virtual network or `PRD-WEEU-SAP02-INFRASTRUCTURE` for a production environment hosted in the West Europe region using the SAP02 virtual network. 

The `SAP01` and `SAP02` define the logical names for the Azure virtual networks, these can be used to further partition the environments. If you need two Azure Virtual Networks for the same workload zone, for example, for a multi subscription scenario where you host development environments in two subscriptions, you can use the different logical names for each virtual network. For example, `DEV-WEEU-SAP01-INFRASTRUCTURE` and `DEV-WEEU-SAP02-INFRASTRUCTURE`.

The workload zone provides the following shared services for the SAP Applications:

* Azure Virtual Network, subnets and network security groups.
* Azure Key Vault, for storing the virtual machine and SAP system credentials.
* Azure Storage accounts, for Boot Diagnostics and Cloud Witness.
* Shared storage for the SAP Systems either Azure Files or Azure NetApp Files.

Before you design your workload zone layout, consider the following questions:

* In which regions do you need to deploy workloads?
* How many workload zones does your scenario require (development, quality assurance, production etc.)?
* Are you deploying into new Virtual networks or are you using existing virtual networks 
* How is DNS configured (integrate with existing DNS or deploy a Private DNS zone in the control plane)?
* What storage type do you need for the shared storage (Azure Files NFS, Azure NetApp Files)?

For more information, see [how to configure a workload zone deployment for automation](deploy-workload-zone.md).

### Windows based deployments

When doing Windows based deployments the Virtual Machines in the workload zone's Virtual Network need to be able to communicate with Active Directory in order to join the SAP Virtual Machines to the Active Directory Domain. The provided DNS name needs to be resolvable by the Active Directory. 

As SDAF won't create accounts in Active Directory the accounts need to be precreated and stored in the workload zone key vault.

| Credential                                             | Name                                      | Example                                   |
| ------------------------------------------------------ | ----------------------------------------- | ----------------------------------------- | 
| Account that can perform domain join activities        | [IDENTIFIER]-ad-svc-account               | DEV-WEEU-SAP01-ad-svc-account             | 
| Password for the account that performs the domain join | [IDENTIFIER]-ad-svc-account-password      | DEV-WEEU-SAP01-ad-svc-account-password    | 
| 'sidadm' account password                              | [IDENTIFIER]-[SID]-win-sidadm_password_id | DEV-WEEU-SAP01-W01-winsidadm_password_id  | 
| SID Service account password                           | [IDENTIFIER]-[SID]-svc-sidadm-password    | DEV-WEEU-SAP01-W01-svc-sidadm-password    | 
| SQL Server Service account                             | [IDENTIFIER]-[SID]-sql-svc-account        | DEV-WEEU-SAP01-W01-sql-svc-account        | 
| SQL Server Service account password                    | [IDENTIFIER]-[SID]-sql-svc-password       | DEV-WEEU-SAP01-W01-sql-svc-password       | 
| SQL Server Agent Service account                       | [IDENTIFIER]-[SID]-sql-agent-account      | DEV-WEEU-SAP01-W01-sql-agent-account      | 
| SQL Server Agent Service account password              | [IDENTIFIER]-[SID]-sql-agent-password     | DEV-WEEU-SAP01-W01-sql-agent-password     | 

#### DNS settings

For High Availability scenarios a DNS record is needed in the Active Directory for the SAP Central Services cluster. The DNS record needs to be created in the Active Directory DNS zone. The DNS record name is defined as '[sid]>scs[scs instance number]cl1'. For example, `w01scs00cl1` for the cluster for the 'W01' SID using the instance number '00'.
## Credentials management

The automation framework uses [Service Principals](#service-principal-creation) for infrastructure deployment. It's recommended to use different deployment credentials (service principals) for each [workload zone](#workload-zone-planning). The framework stores these credentials in the [deployer's](deployment-framework.md#deployment-components) key vault. Then, the framework retrieves these credentials dynamically during the deployment process.

### SAP and Virtual machine Credentials management

The automation framework will use the workload zone key vault for storing both the automation user credentials and the SAP system credentials. The virtual machine credentials are named as follows:

| Credential                   | Name                                     | Example                                  |
| ---------------------------- | ---------------------------------------- | ---------------------------------------- | 
| Private key                  | [IDENTIFIER]-sshkey                      | DEV-WEEU-SAP01-sid-sshkey                | 
| Public key                   | [IDENTIFIER]-sshkey-pub                  | DEV-WEEU-SAP01-sid-sshkey-pub            | 
| Username                     | [IDENTIFIER]-username                    | DEV-WEEU-SAP01-sid-username              | 
| Password                     | [IDENTIFIER]-password                    | DEV-WEEU-SAP01-sid-password              | 
| sidadm Password              | [IDENTIFIER]-[SID]-sap-password          | DEV-WEEU-SAP01-X00-sap-password          | 
| sidadm account password      | [IDENTIFIER]-[SID]-winsidadm_password_id | DEV-WEEU-SAP01-W01-winsidadm_password_id | 
| SID Service account password | [IDENTIFIER]-[SID]-svc-sidadm-password   | DEV-WEEU-SAP01-W01-svc-sidadm-password   | 


### Service principal creation

Create your service principal:

1. Sign in to the [Azure CLI](/cli/azure/) with an account that has permissions to create a Service Principal.
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
### Permissions management

In a locked down environment, you might need to assign another permissions to the service principals. For example, you might need to assign the User Access Administrator role to the service principal. 

#### Required permissions

The following table shows the required permissions for the service principals:

> [!div class="mx-tdCol2BreakAll "]
> | Credential                                   | Area                                | Required permissions         |
> | -------------------------------------------- | ----------------------------------- | ---------------------------- |
> | Control Plane SPN                            | Control Plane subscription          | Contributor                  |
> | Workload Zone SPN                            | Target subscription                 | Contributor                  |
> | Workload Zone SPN                            | Control plane subscription          | Reader                       |
> | Workload Zone SPN                            | Control Plane Virtual Network       | Network Contributor          |
> | Workload Zone SPN                            | SAP Library tfstate storage account | Storage Account Contributor  |
> | Workload Zone SPN                            | SAP Library sapbits storage account | Reader                       |
> | Workload Zone SPN                            | Private DNS Zone                    | Private DNS Zone Contributor |
> | Web Application Identity                     | Target subscription                 | Reader                       |
> | Cluster Virtual Machine Identity             | Resource Group                      | Fencing role                 |

### Firewall configuration

> [!div class="mx-tdCol2BreakAll "]
> | Component                           | Addresses                                                                                                 | Duration                                 | Notes                                                                                                    |
> | ----------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
> | SDAF                                | 'github.com/Azure/sap-automation', 'github.com/Azure/sap-automation-samples', 'githubusercontent.com'     | Setup of Deployer                        |                                                                                                          |
> | Terraform                           | 'releases.hashicorp.com', 'registry.terraform.io', 'checkpoint-api.hashicorp.com'                         | Setup of Deployer                        | See [Installing Terraform](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform) |
> | Azure CLI                           | Installing [Azure CLI](/cli/azure/install-azure-cli-linux)                                                | Setup of Deployer and during deployments | The firewall requirements for Azure CLI installation are defined here: [Installing Azure CLI](/cli/azure/azure-cli-endpoints) |
> | PIP                                 | 'bootstrap.pypa.io'                                                                                       | Setup of Deployer                        | See [Installing Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) |
> | Ansible                             | 'pypi.org', 'pythonhosted.org', 'galaxy.ansible.com'                                                      | Setup of Deployer                        |                                                                                                |
> | PowerShell Gallery                  | 'onegetcdn.azureedge.net', 'psg-prod-centralus.azureedge.net', 'psg-prod-eastus.azureedge.net'            | Setup of Windows based systems           | See [PowerShell Gallery](/powershell/scripting/gallery/getting-started?#network-access-to-the-powershell-gallery) |
> | Windows components                  | 'download.visualstudio.microsoft.com', 'download.visualstudio.microsoft.com', 'download.visualstudio.com' | Setup of Windows based systems           | See [Visual Studio components](/visualstudio/install/install-and-use-visual-studio-behind-a-firewall-or-proxy-server#install-visual-studio) |
> | SAP Downloads                       | 'softwaredownloads.sap.com'                                                                                    | SAP Software download                    | See [SAP Downloads](https://launchpad.support.sap.com/#/softwarecenter) |
> | Azure DevOps Agent                  | 'https://vstsagentpackage.azureedge.net'                                                                       | Setup Azure DevOps                       |  |

## DevOps structure

The deployment framework uses three separate repositories for the deployment artifacts. For your own parameter files, it's a best practice to keep these files in a source control repository that you manage. 

### Main repository

This repository contains the Terraform parameter files and the files needed for the Ansible playbooks for all the workload zone and system deployments. 

You can create this repository by cloning the [SAP on Azure Deployment Automation Framework bootstrap repository](https://github.com/Azure/sap-automation-bootstrap/) into your source control repository.

> [!IMPORTANT]
> This repository must be the default repository for your Azure DevOps project.

#### Folder structure

The following sample folder hierarchy shows how to structure your configuration files along with the automation framework files.

| Folder name | Contents | Description |
| ----------- | -------- | ----------- |
| None (root level) | Configuration files, template files | The root folder for all systems that you're managing from this deployment environment. |
| CONFIGURATION | Shared configuration files | A shared folder for referring to custom configuration files from multiple places. For example, custom disk sizing configuration files. |
| DEPLOYER | Configuration files for the deployer | A folder with [deployer configuration files](configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-DEP00-INFRASTRUCTURE**. |
| LIBRARY | Configuration files for SAP Library | A folder with [SAP Library configuration files](configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP-LIBRARY**. |
| LANDSCAPE | Configuration files for landscape deployments | A folder with [configuration files for all workload zones](deploy-workload-zone.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP00-INFRASTRUCTURE**. |
| SYSTEM | Configuration files for the SAP systems | A folder with [configuration files for all SAP System Identification (SID) deployments](configure-system.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network - SID**. for example, **PROD-WEEU-SAPO00-ABC**. |

:::image type="content" source="./media/plan-deployment/folder-structure.png" alt-text="Screenshot of example folder structure, showing separate folders for SAP HANA and multiple workload environments.":::

> [!IMPORTANT]
> Your parameter file's name becomes the name of the Terraform state file. Make sure to use a unique parameter file name for this reason.

### Code repository

This repository contains the Terraform automation templates and the Ansible playbooks as well as the deployment pipelines and scripts. For most use cases, consider this repository as read-only and don't modify it.

You can create this repository by cloning the [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation/) into your source control repository.

> [!IMPORTANT]
> This repository should be named 'sap-automation'.

### Sample repository

This repository contains the sample Bill of Materials files and the sample Terraform configuration files.

You can create this repository by cloning the [SAP on Azure Deployment Automation Framework samples repository](https://github.com/Azure/sap-automation-samples/) into your source control repository.

> [!IMPORTANT]
> This repository should be named 'samples'.


## Supported deployment scenarios

The automation framework supports [deployment into both new and existing scenarios](new-vs-existing.md).

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

For more information, see the [in-depth explanation of how to configure the deployer](configure-control-plane.md).

## Workload zone structure

Most SAP configurations have multiple [workload zones](deployment-framework.md#deployment-components) for different application tiers. For example, you might have different workload zones for development, quality assurance, and production.

You'll be creating or granting access to the following services in each workload zone:

* Azure Virtual Networks, for virtual networks, subnets and network security groups.
* Azure Key Vault, for system credentials and the deployment Service Principal.
* Azure Storage accounts, for Boot Diagnostics and Cloud Witness.
* Shared storage for the SAP Systems either Azure Files or Azure NetApp Files.

Before you design your workload zone layout, consider the following questions:

* How many workload zones does your scenario require?
* In which regions do you need to deploy workloads?
* What's your [deployment scenario](#supported-deployment-scenarios)?

For more information, see [how to configure a workload zone deployment for automation](deploy-workload-zone.md).

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

For more information, see [how to configure the SAP system for automation](configure-system.md).

## Deployment flow

When planning a deployment, it's important to consider the overall flow. There are three main steps of an SAP deployment on Azure with the automation framework.

1. Deploy the control plane. This step deploys components to support the SAP automation framework in a specified Azure region. Some parts of this step are:
    1. Creating the deployment environment
    1. Creating shared storage for Terraform state files
    1. Creating shared storage for SAP installation media

1. Deploy the workload zone. This step deploys the [workload zone components](#workload-zone-planning), such as the virtual network and key vaults.

1. Deploy the system. This step includes the [infrastructure for the SAP system](#sap-system-setup) deployment and the SAP configuration [configuration and SAP installation](run-ansible.md).


## Naming conventions

The automation framework uses a default naming convention. If you'd like to use a custom naming convention, plan and define your custom names before deployment. For more information, see [how to configure the naming convention](naming-module.md). 

## Disk sizing

If you want to [configure custom disk sizes](configure-extra-disks.md), make sure to plan your custom setup before deployment.

## Next steps

> [!div class="nextstepaction"]
> [About manual deployments of automation framework](manual-deployment.md)
