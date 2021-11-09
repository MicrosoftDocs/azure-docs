---
title: About workload zone configuration in automation framework
description: Overview of the SAP workload zone configuration process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Workload zone configuration in SAP automation framework

An [SAP application](automation-deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. The SAP deployment automation framework refers to these tiers as [workload zones](automation-deployment-framework.md#deployment-components).

## Workload zone deployment configuration

The configuration of the SAP workload zone is done via a Terraform tfvars variable file.

## Terraform Parameters

The table below contains the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts.

| Variable                | Type       | Description                           | 
| ----------------------- | ---------- | ------------------------------------- | 
| `tfstate_resource_id`   | Required * | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files  |
| `deployer_tfstate_key`  | Required * | The name of the state file for the Deployer  |
## Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | 
> | ----------------------- | ------------------------------------- | 
> | `environment`            | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment.| 
> | `location`              | The Azure region in which to deploy.     |
> | `resource_group_name`   | Name of the resource group to be created |
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group |

## Network Parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified 
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

Ensure that the virtual network address space is large enough to host all the resources

The table below contains the networking parameters.

| Variable                         | Type        | Description                           | Notes  |
| -------------------------------- | ----------- | ------------------------------------- | ------ |
| `network_name`                   | Required    | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE) | |
| `network_arm_id`                 | Optional *  | The Azure resource identifier for the virtual network | Mandatory for brown field deployments |
| `network_address_space`          | Mandatory * | The address range for the virtual network | Mandatory for green field.  |
| `admin_subnet_name`              | Optional    | The name of the 'admin' subnet | |
| `admin_subnet_address_prefix`    | Mandatory * | The address range for the 'admin' subnet | Mandatory for green field deployments |
| `admin_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'admin' subnet | Mandatory for brown field deployments |
| `admin_subnet_nsg_name`          | Optional	 | The name of the 'admin' Network Security Group name | |
| `admin_subnet_nsg_arm_id`        | Mandatory * | The Azure resource identifier for the 'admin' Network Security Group | Mandatory for brown field deployments |
| `db_subnet_name`                 | Optional    | The name of the 'db' subnet | |
| `db_subnet_address_prefix`       | Mandatory * | The address range for the 'db' subnet | Mandatory for green field deployments |
| `db_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'db' subnet | Mandatory for brown field deployments |
| `db_subnet_nsg_name`             | Optional	 | The name of the 'db' Network Security Group name | |
| `db_subnet_nsg_arm_id`           | Mandatory * | The Azure resource identifier for the 'db' Network Security Group | Mandatory for brown field deployments |
| `app_subnet_name`                | Optional    | The name of the 'app' subnet | |
| `app_subnet_address_prefix`      | Mandatory * | The address range for the 'app' subnet | Mandatory for green field deployments |
| `app_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'app' subnet | Mandatory for brown field deployments |
| `app_subnet_nsg_name`            | Optional	 | The name of the 'app' Network Security Group name | |
| `app_subnet_nsg_arm_id`          | Mandatory * | The Azure resource identifier for the 'app' Network Security Group | Mandatory for brown field deployments |
| `web_subnet_name`                | Optional    | The name of the 'web' subnet | |
| `web_subnet_address_prefix`      | Mandatory * | The address range for the 'web' subnet | Mandatory for green field deployments |
| `web_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'web' subnet | Mandatory for brown field deployments |
| `web_subnet_nsg_name`            | Optional	 | The name of the 'web' Network Security Group name | |
| `web_subnet_nsg_arm_id`          | Mandatory * | The Azure resource identifier for the 'web' Network Security Group | Mandatory for brown field deployments |

## ISCSI Parameters

| Variable                         | Type        | Description                           | Notes  |
| -------------------------------- | ----------- | ------------------------------------- | ------ |
| `iscsi_subnet_name`              | Optional    | The name of the 'iscsi' subnet | |
| `iscsi_subnet_address_prefix`    | Mandatory * | The address range for the 'iscsi' subnet | Mandatory for green field deployments |
| `iscsi_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'iscsi' subnet | Mandatory for brown field deployments |
| `iscsi_subnet_nsg_name`          | Optional	 | The name of the 'iscsi' Network Security Group name | |
| `iscsi_subnet_nsg_arm_id`        | Mandatory * | The Azure resource identifier for the 'iscsi' Network Security Group | Mandatory for brown field deployments |
| `iscsi_count`                    | Optional    | The number of iSCSI Virtual Machines |
| `iscsi_use_DHCP`                 | Optional    | Controls if Azure subnet provided IP addresses (dynamic) should be used |
| `iscsi_image`	                   | Optional	 | Defines the Virtual machine image to use, see below | 
| `iscsi_authentication_type`      | Optional	 | Defines the default authentication for the iSCSI Virtual Machines |
| `iscsi__authentication_username` | Optional	 | Administrator account name |
| `iscsi_nic_ips`                  | Optional    | IP addresses for the iSCSI Virtual Machines, ignored if `iscsi_use_DHCP` is defined|
 
```json 
{ 
os_type=""
source_image_id=""
publisher="SUSE"
offer="sles-sap-12-sp5"
sku="gen1"
version="latest"
}
```

### Authentication Parameters

The table below defines the credentials used for defining the Virtual Machine authentication

| Variable                         | Type         | Description                           | 
| -------------------------------- | ------------ | ------------------------------------- | 
| `automation_username`            | Optional	  | Administrator account name |
| `automation_password`            | Optional     | Administrator password |
| `automation_path_to_public_key`  | Optional     | Path to existing public key used for authentication |
| `automation_path_to_private_key` | Optional     | Path to existing private key used for authentication |


## Key Vault Parameters

The table below defines the parameters used for defining the Key Vault information

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| `user_keyvault_id`	             | Optional	   | Azure resource identifier for the user key vault |
| `spn_keyvault_id`                  | Optional	   | Azure resource identifier for the user key vault containing the deployment credentials (SPNs) |

## DNS

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| `dns_label`                        | Optional    | If specified, is the DNS name of the private DNS zone | 
| `dns_resource_group_name`          | Optional    | The name of the resource group containing the Private DNS zone | 

## Azure NetApp Support

| Variable                           | Type        | Description                           | Notes  |
| ---------------------------------- | ----------- | ------------------------------------- | ------ |
| `use_ANF`                          | Optional    | If specified, deploys the Azure NetApp Files Account and Capacity Pool  | 
| `ANF_account_arm_id`               | Optional    | Azure resource identifier for the Azure NetApp Files Account  | Mandatory for brown field deployments |
| `ANF_account_name`                 | Optional    | Name for the Azure NetApp Files Account  | 
| `ANF_service_level`                | Optional    | Service level for the Azure NetApp Files Capacity Pool  | 
| `ANF_pool_size`                    | Optional    | The size (in GB) of the Azure NetApp Files Capacity Pool  | 
| `anf_subnet_name`                  | Optional    | The name of the ANF subnet  | 
| `anf_subnet_arm_id`                | Required *  | The Azure resource identifier for the 'ANF' subnet | Mandatory for brown field deployments |
| `anf_subnet_address_prefix`        | Required *  | The address range for the 'ANF' subnet  | Mandatory for green field deployments |


## Other Parameters

| Variable                             | Type        | Description                           | Notes  |
| ------------------------------------ | ----------- | ------------------------------------- | ------ |
| `enable_purge_control_for_keyvaults` | Optional    | Boolean flag controlling if purge control is enabled on the Key Vault. Use only for test deployments | 
| `use_private_endpoint`               | Optional    | Boolean flag controlling if private endpoints are used | 
| `diagnostics_storage_account_arm_id` | Required *  | The Azure resource identifier for the diagnostics storage account | Mandatory for brown field deployments |
| `witness_storage_account_arm_id`     | Required *  | The Azure resource identifier for the witness storage account | Mandatory for brown field deployments |


## Next Step

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](automation-deploy-workload-zone.md)
