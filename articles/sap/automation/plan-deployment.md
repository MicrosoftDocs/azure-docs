---
title: Plan your SAP deployment with the automation framework on Azure
description: Prepare for using SAP Deployment Automation Framework. Steps include planning for credentials management, DevOps structure, and deployment scenarios.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/14/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Plan your deployment of the SAP automation framework

There are multiple considerations for planning SAP deployments using the [SAP Deployment Automation Framework](deployment-framework.md). These include subscription planning, credentials management virtual network design.

For generic SAP on Azure design considerations, see [Introduction to an SAP adoption scenario](/azure/cloud-adoption-framework/scenarios/sap).

> [!NOTE]
> The Terraform deployment uses Terraform templates provided by Microsoft from the [SAP Deployment Automation Framework repository](https://github.com/Azure/SAP-automation-samples/tree/main/Terraform/WORKSPACES). The templates use parameter files with your system-specific information to perform the deployment.

## Subscription planning

You should deploy the control plane and the workload zones in different subscriptions. The control plane should reside in a hub subscription that is used to host the management components of the SAP automation framework. 

The SAP systems should be hosted in spoke subscriptions, which are dedicated to the SAP systems. An example of partitioning the systems would be to host the development systems in a separate subscription with a dedicated virtual network and the production systems would be hosted in their own subscription with a dedicated virtual network.

This approach provides a both a security boundary and allows for clear separation of duties and responsibilities. For example, the SAP Basis team can deploy systems into the workload zones, and the infrastructure team can manage the control plane. 


## Control plane planning

You can perform the deployment and configuration activities from either Azure Pipelines or by using the provided shell scripts directly from Azure-hosted Linux virtual machines. This environment is referred to as the control plane. For setting up Azure DevOps for the deployment framework, see [Set up Azure DevOps for SAP Deployment Automation Framework](configure-devops.md). For setting up a Linux virtual machines as the deployer, see [Set up Linux virtual machines for SAP Deployment Automation Framework](deploy-control-plane.md).

Before you design your control plane, consider the following questions:

* In which regions do you need to deploy SAP systems?
* Is there a dedicated subscription for the control plane?
* Is there a dedicated deployment credential (service principal) for the control plane?
* Is there an existing virtual network or is a new virtual network needed?
* How is outbound internet provided for the virtual machines?
* Are you going to deploy Azure Firewall for outbound internet connectivity?
* Are private endpoints required for storage accounts and the key vault?
* Are you going to use an existing private DNS zone for the virtual machines or use the control plane for hosting Private DNS?
* Are you going to use Azure Bastion for secure remote access to the virtual machines?
* Are you going to use the SAP Deployment Automation Framework configuration web application for performing configuration and deployment activities?

### Control plane

The control plane provides the following services:

- Deployment VMs, which do Terraform deployments and Ansible configuration. Acts as Azure DevOps self-hosted agents.
- A key vault, which contains the deployment credentials (service principals) used by Terraform when performing the deployments.
- Azure Firewall for providing outbound internet connectivity.
- Azure Bastion for providing secure remote access to the deployed virtual machines.
- An SAP Deployment Automation Framework configuration Azure web application for performing configuration and deployment activities.

The control plane is defined by using two configuration files, one for the deployer and one for the SAP Library.

The deployer configuration file defines the region, environment name, and virtual network information. For example:

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

use_webapp = true

webapp_subnet_address_prefix = "10.170.20.192/27"
deployer_assign_subscription_permissions = true

deployer_count = 2

use_service_endpoint = false
use_private_endpoint = false
public_network_access_enabled = true

```

### DNS considerations

When you plan the DNS configuration for the automation framework, consider the following questions:

 - Is there an existing private DNS that the solutions can integrate with or do you need to use a custom private DNS zone for the deployment environment?
 - Are you going to use predefined IP addresses for the virtual machines or let Azure assign them dynamically?

You can integrate with an existing private DNS zone by providing the following values in your `tfvars` files:

```tfvars
management_dns_subscription_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
#management_dns_resourcegroup_name = "RESOURCEGROUPNAME"
use_custom_dns_a_registration = false
```

Without these values, a private DNS zone is created in the SAP library resource group.

For more information, see the [in-depth explanation of how to configure the deployer](configure-control-plane.md).

## SAP library configuration

The SAP library resource group provides storage for SAP installation media, Bill of Material files, Terraform state files, and, optionally, the private DNS zones. The configuration file defines the region and environment name for the SAP library. For parameter information and examples, see [Configure the SAP library for automation](configure-control-plane.md).

## Workload zone planning

Most SAP application landscapes are partitioned in different tiers. In SAP Deployment Automation Framework, these tiers are called workload zones. For example, you might have different workload zones for development, quality assurance, and production systems. For more information, see [Workload zones](deployment-framework.md#deployment-components).

The workload zone provides the following shared services for the SAP applications:

* Azure Virtual Network, for virtual networks, subnets, and network security groups.
* Azure Key Vault, for storing the virtual machine and SAP system credentials.
* Azure Storage accounts for boot diagnostics and Cloud Witness.
* Shared storage for the SAP systems, either Azure Files or Azure NetApp Files.

Before you design your workload zone layout, consider the following questions:

* In which regions do you need to deploy workloads?
* How many workload zones does your scenario require (development, quality assurance, and production)?
* Are you deploying into new virtual networks or are you using existing virtual networks?
* What storage type do you need for the shared storage (Azure Files NFS or Azure NetApp Files)?
* Are you going to deploy NAT Gateway for outbound internet connectivity?

The default naming convention for workload zones is `[ENVIRONMENT]-[REGIONCODE]-[NETWORK]-INFRASTRUCTURE`. For example, `DEV-WEEU-SAP01-INFRASTRUCTURE` is for a development environment hosted in the West Europe region by using the SAP01 virtual network. `PRD-WEEU-SAP02-INFRASTRUCTURE` is for a production environment hosted in the West Europe region by using the SAP02 virtual network.

The `SAP01` and `SAP02` designations define the logical names for the Azure virtual networks. They can be used to further partition the environments. Suppose you need two Azure virtual networks for the same workload zone. For example, you might have a multi-subscription scenario where you host development environments in two subscriptions. You can use the different logical names for each virtual network. For example, you can use `DEV-WEEU-SAP01-INFRASTRUCTURE` and `DEV-WEEU-SAP02-INFRASTRUCTURE`.

For more information, see [Configure a workload zone deployment for automation](deploy-workload-zone.md).

### Windows-based deployments

When you perform Windows-based deployments, the virtual machines in the workload zone's virtual network need to be able to communicate with Active Directory to join the SAP virtual machines to the Active Directory domain. The provided DNS name needs to be resolvable by Active Directory.

SAP Deployment Automation Framework doesn't create accounts in Active Directory, so the accounts need to be precreated and stored in the workload zone key vault.

| Credential                                             | Name                                      | Example                                   |
| ------------------------------------------------------ | ----------------------------------------- | ----------------------------------------- |
| Account that can perform domain join activities        | [IDENTIFIER]-ad-svc-account               | DEV-WEEU-SAP01-ad-svc-account             |
| Password for the account that performs the domain join | [IDENTIFIER]-ad-svc-account-password      | DEV-WEEU-SAP01-ad-svc-account-password    |
| `sidadm` account password                              | [IDENTIFIER]-[SID]-win-sidadm_password_id | DEV-WEEU-SAP01-W01-winsidadm_password_id  |
| SID Service account password                           | [IDENTIFIER]-[SID]-svc-sidadm-password    | DEV-WEEU-SAP01-W01-svc-sidadm-password    |
| SQL Server Service account                             | [IDENTIFIER]-[SID]-sql-svc-account        | DEV-WEEU-SAP01-W01-sql-svc-account        |
| SQL Server Service account password                    | [IDENTIFIER]-[SID]-sql-svc-password       | DEV-WEEU-SAP01-W01-sql-svc-password       |
| SQL Server Agent Service account                       | [IDENTIFIER]-[SID]-sql-agent-account      | DEV-WEEU-SAP01-W01-sql-agent-account      |
| SQL Server Agent Service account password              | [IDENTIFIER]-[SID]-sql-agent-password     | DEV-WEEU-SAP01-W01-sql-agent-password     |

#### DNS settings

For high-availability scenarios, a DNS record is needed in the Active Directory for the SAP central services cluster. The DNS record needs to be created in the Active Directory DNS zone. The DNS record name is defined as `[sid]>scs[scs instance number]cl1`. For example, `w01scs00cl1` is used for the cluster, with `W01` for the SID and `00` for the instance number.

## Credentials management

The automation framework uses [service principals](#service-principal-creation) for infrastructure deployment. We recommend using different deployment credentials (service principals) for each [workload zone](#workload-zone-planning). The framework stores these credentials in the [deployer's](deployment-framework.md#deployment-components) key vault. Then, the framework retrieves these credentials dynamically during the deployment process.

### SAP and virtual machine credentials management

The automation framework uses the workload zone key vault for storing both the automation user credentials and the SAP system credentials. The following table lists the names of the virtual machine credentials.

| Credential                   | Name                                     | Example                                  |
| ---------------------------- | ---------------------------------------- | ---------------------------------------- |
| Private key                  | [IDENTIFIER]-sshkey                      | DEV-WEEU-SAP01-sid-sshkey                |
| Public key                   | [IDENTIFIER]-sshkey-pub                  | DEV-WEEU-SAP01-sid-sshkey-pub            |
| Username                     | [IDENTIFIER]-username                    | DEV-WEEU-SAP01-sid-username              |
| Password                     | [IDENTIFIER]-password                    | DEV-WEEU-SAP01-sid-password              |
| `sidadm` password              | [IDENTIFIER]-[SID]-sap-password          | DEV-WEEU-SAP01-X00-sap-password          |
| `sidadm` account password      | [IDENTIFIER]-[SID]-winsidadm_password_id | DEV-WEEU-SAP01-W01-winsidadm_password_id |
| SID Service account password | [IDENTIFIER]-[SID]-svc-sidadm-password   | DEV-WEEU-SAP01-W01-svc-sidadm-password   |

### Service principal creation

To create your service principal:

1. Sign in to the [Azure CLI](/cli/azure/) with an account that has permissions to create a service principal
1. Create a new service principal by running the command `az ad sp create-for-rbac`. Make sure to use a description name for `--name`. For example:

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

1. Assign the User Access Administrator role to your service principal. For example:

    ```azurecli
    az role assignment create --assignee <your-application-ID> --role "User Access Administrator" --scope /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>
    ```

For more information, see the [Azure CLI documentation for creating a service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

> [!IMPORTANT]
> If you don't assign the User Access Administrator role to the service principal, you can't assign permissions by using the automation.

### Permissions management

In a locked-down environment, you might need to assign another permission to the service principals. For example, you might need to assign the User Access Administrator role to the service principal.

#### Required permissions

The following table shows the required permissions for the service principals.

> [!div class="mx-tdCol2BreakAll "]
> | Credential                                   | Area                                  | Required permissions                   | Duration           |
> | -------------------------------------------- | ------------------------------------- | -------------------------------------- | ------------------ |
> | Control Plane SPN                            | Control plane subscription            | Contributor                            |                    |
> | Control Plane SPN                            | Deployer resource group               | Contributor                            |                    |
> | Control Plane SPN                            | Deployer resource group               | User Access Administrator              | During setup       | 
> | Control Plane SPN                            | SAP Library resource group            | Contributor                            |                    |
> | Control Plane SPN                            | SAP Library resource group            | User Access Administrator              |                    |
> | Workload Zone SPN                            | Target subscription                   | Contributor                            |                    |
> | Workload Zone SPN                            | Workload zone resource group          | Contributor, User Access Administrator |                    |
> | Workload Zone SPN                            | Control plane subscription            | Reader                                 |                    |
> | Workload Zone SPN                            | Control plane virtual network         | Network contributor                    |                    |
> | Workload Zone SPN                            | SAP library `tfstate` storage account | Storage account contributor            |                    |
> | Workload Zone SPN                            | SAP library `sapbits` storage account | Reader                                 |                    |
> | Workload Zone SPN                            | Private DNS zone                      | Private DNS zone contributor           |                    |
> | Web Application Identity                     | Target subscription                   | Reader                                 |                    |
> | Cluster Virtual Machine Identity             | Resource group                        | Fencing role                           |                    |

### Firewall configuration

> [!div class="mx-tdCol2BreakAll "]
> | Component                           | Addresses                                                                                                 | Duration                                 | Notes                                                                                                                                        |
> | ----------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
> | SDAF                                | `github.com/Azure/sap-automation`, `github.com/Azure/sap-automation-samples`, `githubusercontent.com`     | Setup of deployer                        |                                                                                                                                              |
> | Terraform                           | `releases.hashicorp.com`, `registry.terraform.io`, `checkpoint-api.hashicorp.com`                         | Setup of deployer                        | See [Installing Terraform](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform).                                    |
> | Azure CLI                           | Installing [Azure CLI](/cli/azure/install-azure-cli-linux)                                                | Setup of deployer and during deployments | The firewall requirements for the Azure CLI installation are defined in [Installing Azure CLI](/cli/azure/azure-cli-endpoints).              |
> | PIP                                 | `bootstrap.pypa.io`                                                                                       | Setup of deployer                        | See [Installing Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).                                |
> | Ansible                             | `pypi.org`, `pythonhosted.org`, `files.pythonhosted.org`, `galaxy.ansible.com`, 'https://ansible-galaxy-ng.s3.dualstack.us-east-1.amazonaws.com'     | Setup of deployer                        |                                                                                                   |
> | PowerShell Gallery                  | `onegetcdn.azureedge.net`, `psg-prod-centralus.azureedge.net`, `psg-prod-eastus.azureedge.net`            | Setup of Windows-based systems           | See [PowerShell Gallery](/powershell/gallery/getting-started#network-access-to-the-powershell-gallery).                                      |
> | Windows components                  | `download.visualstudio.microsoft.com`, `download.visualstudio.microsoft.com`, `download.visualstudio.com` | Setup of Windows-based systems           | See [Visual Studio components](/visualstudio/install/install-and-use-visual-studio-behind-a-firewall-or-proxy-server#install-visual-studio). |
> | SAP downloads                       | `softwaredownloads.sap.com`                                                                                    | SAP software download                    | See [SAP downloads](https://launchpad.support.sap.com/#/softwarecenter).                                                                     |
> | Azure DevOps agent                  | `https://vstsagentpackage.azureedge.net`                                                                       | Setup of Azure DevOps                    |                                                                                                                                              |


You can test the connectivity to the URLs from a Linux Virtual Machine in Azure using a PowerShell script that uses the 'run-command' feature in Azure to test the connectivity to the URLs.

The following example shows how to test the connectivity to the URLs by using an interactive PowerShell script.

```powershell

$sdaf_path = Get-Location
if ( $PSVersionTable.Platform -eq "Unix") {
    if ( -Not (Test-Path "SDAF") ) {
      $sdaf_path = New-Item -Path "SDAF" -Type Directory
    }
}
else {
    $sdaf_path = Join-Path -Path $Env:HOMEDRIVE -ChildPath "SDAF"
    if ( -not (Test-Path $sdaf_path)) {
        New-Item -Path $sdaf_path -Type Directory
    }
}

Set-Location -Path $sdaf_path

git clone https://github.com/Azure/sap-automation.git 

cd sap-automation
cd deploy
cd scripts

if ( $PSVersionTable.Platform -eq "Unix") {
 ./Test-SDAFURLs.ps1
}
else {
 .\Test-SDAFURLs.ps1
}

```



## DevOps structure

The deployment framework uses three separate repositories for the deployment artifacts. For your own parameter files, it's a best practice to keep these files in a source control repository that you manage.

### Main repository

This repository contains the Terraform parameter files and the files needed for the Ansible playbooks for all the workload zone and system deployments.

You can create this repository by cloning the [SAP Deployment Automation Framework bootstrap repository](https://github.com/Azure/sap-automation-bootstrap/) into your source control repository.

> [!IMPORTANT]
> This repository must be the default repository for your Azure DevOps project.

#### Folder structure

The following sample folder hierarchy shows how to structure your configuration files along with the automation framework files.


> [!div class="mx-tdCol2BreakAll "]
> | Folder name       | Contents                                | Description                                                                                                                                                                                                                                                                      |
> | ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | BOMS              | BoM Files                               | Used for manual BoM download                                                                                                                                                                                                                                                     |
> | DEPLOYER          | Configuration files for the deployer    | A folder with [deployer configuration files](configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-DEP00-INFRASTRUCTURE**.          |
> | LIBRARY           | Configuration files for SAP library     | A folder with [SAP library configuration files](configure-control-plane.md) for all deployments that the environment manages. Name each subfolder by the naming convention of **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP-LIBRARY**.                |
> | LANDSCAPE         | Configuration files for workload zone   | A folder with [configuration files for all workload zones](deploy-workload-zone.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network**. For example, **PROD-WEEU-SAP00-INFRASTRUCTURE**.                      |
> | SYSTEM            | Configuration files for the SAP systems | A folder with [configuration files for all SAP System Identification (SID) deployments](configure-system.md) that the environment manages. Name each subfolder by the naming convention **Environment - Region - Virtual Network - SID**. For example, **PROD-WEEU-SAPO00-ABC**. |

:::image type="content" source="./media/plan-deployment/folder-structure.png" alt-text="Screenshot that shows example folder structure, with separate folders for SAP HANA and multiple workload environments.":::

Your parameter file's name becomes the name of the Terraform state file. Make sure to use a unique parameter file name for this reason.

### Code repository

This repository contains the Terraform automation templates, the Ansible playbooks, and the deployment pipelines and scripts. For most use cases, consider this repository as read-only and don't modify it.

To create this repository, clone the [SAP Deployment Automation Framework repository](https://github.com/Azure/sap-automation/) into your source control repository.

Name this repository `sap-automation`.

### Sample repository

This repository contains the sample Bill of Materials files and the sample Terraform configuration files.

To create this repository, clone the [SAP Deployment Automation Framework samples repository](https://github.com/Azure/sap-automation-samples/) into your source control repository.

Name this repository `samples`.

## Supported deployment scenarios

The automation framework supports [deployment into both new and existing scenarios](new-vs-existing.md).

## Azure regions

Before you deploy a solution, it's important to consider which Azure regions to use. Different Azure regions might be in scope depending on your specific scenario.

The automation framework supports deployments into multiple Azure regions. Each region hosts:

- The deployment infrastructure.
- The SAP library with state files and installation media.
- 1-N workload zones.
- 1-N SAP systems in the workload zones.

## Deployment environments

If you're supporting multiple workload zones in a region, use a unique identifier for your deployment environment and SAP library. Don't use the identifier for the workload zone. For example, use `MGMT` for management purposes.

The automation framework also supports having the deployment environment and SAP library in separate subscriptions than the workload zones.

The deployment environment provides the following services:

- One or more deployment virtual machines, which perform the infrastructure deployments by using Terraform and perform the system configuration and SAP installation by using Ansible playbooks.
- A key vault, which contains service principal identity information for use by Terraform deployments.
- An Azure Firewall component, which provides outbound internet connectivity.

The deployment configuration file defines the region, environment name, and virtual network information. For example:

```terraform
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment = "MGMT"

# The location/region value is a mandatory field, it is used to control where the resources are deployed
location = "westeurope"

# management_network_address_space is the address space for management virtual network
management_network_address_space = "10.10.20.0/25"

# management_subnet_address_prefix is the address prefix for the management subnet
management_subnet_address_prefix = "10.10.20.64/28"

# management_firewall_subnet_address_prefix is the address prefix for the firewall subnet
management_firewall_subnet_address_prefix = "10.10.20.0/26"

# management_bastion_subnet_address_prefix is a mandatory parameter if bastion is deployed and if the subnets are not defined in the workload or if existing subnets are not used
management_bastion_subnet_address_prefix = "10.10.20.128/26"

deployer_enable_public_ip = false

firewall_deployment = true

bastion_deployment = true
```

For more information, see the [in-depth explanation of how to configure the deployer](configure-control-plane.md).

## Workload zone structure

Most SAP configurations have multiple [workload zones](deployment-framework.md#deployment-components) for different application tiers. For example, you might have different workload zones for development, quality assurance, and production.

You create or grant access to the following services in each workload zone:

* Azure Virtual Networks, for virtual networks, subnets, and network security groups.
* Azure Key Vault, for system credentials and the deployment service principal.
* Azure Storage accounts, for boot diagnostics and Cloud Witness.
* Shared storage for the SAP systems, either Azure Files or Azure NetApp Files.

Before you design your workload zone layout, consider the following questions:

* How many workload zones does your scenario require?
* In which regions do you need to deploy workloads?
* What's your [deployment scenario](#supported-deployment-scenarios)?

For more information, see [Configure a workload zone deployment for automation](deploy-workload-zone.md).

## SAP system setup

The SAP system contains all Azure components required to host the SAP application.

Before you configure the SAP system, consider the following questions:

* What database back end do you want to use?
* How many database servers do you need?
* Does your scenario require high availability?
* How many application servers do you need?
* How many web dispatchers do you need, if any?
* How many central services instances do you need?
* What size virtual machine do you need?
* Which virtual machine image do you want to use? Is the image on Azure Marketplace or custom?
* Are you deploying to a [new or existing deployment scenario](#supported-deployment-scenarios)?
* What's your IP allocation strategy? Do you want Azure to set IPs or use custom settings?

For more information, see [Configure the SAP system for automation](configure-system.md).

## Deployment flow

When you plan a deployment, it's important to consider the overall flow. There are three main steps of an SAP deployment on Azure with the automation framework.

1. Deploy the control plane. This step deploys components to support the SAP automation framework in a specified Azure region.
    1. Create the deployment environment.
    1. Create shared storage for Terraform state files.
    1. Create shared storage for SAP installation media.

1. Deploy the workload zone. This step deploys the [workload zone components](#workload-zone-planning), such as the virtual network and key vaults.

1. Deploy the system. This step includes the [infrastructure for the SAP system](#sap-system-setup) deployment and the [SAP configuration and SAP installation](run-ansible.md).

## Naming conventions

The automation framework uses a default naming convention. If you want to use a custom naming convention, plan and define your custom names before deployment. For more information, see [Configure the naming convention](naming-module.md).

## Disk sizing

If you want to [configure custom disk sizes](configure-extra-disks.md), make sure to plan your custom setup before deployment.

## Next step

> [!div class="nextstepaction"]
> [Manual deployment of the automation framework](manual-deployment.md)
