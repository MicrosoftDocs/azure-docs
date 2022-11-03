---
title: About workload zone configuration in automation framework
description: Overview of the SAP workload zone configuration process within the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 09/13/2022
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Workload zone configuration in SAP automation framework

An [SAP application](deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. The [SAP on Azure Deployment Automation Framework](deployment-framework.md) refers to these tiers as [workload zones](deployment-framework.md#deployment-components). See the following diagram for an example of a workload zone with two SAP systems.     

:::image type="content" source="./media/deployment-framework/workload-zone-architecture.png" alt-text="Diagram of SAP workflow zones and systems.":::


## Workload zone deployment configuration

The configuration of the SAP workload zone is done via a Terraform tfvars variable file. You can find examples of the variable file in the 'samples/WORKSPACES/LANDSCAPE' folder.

The sections below show the different sections of the variable file.

## Environment parameters

The table below contains the parameters that define the environment settings.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       | Notes                                                                                       |
> | ----------------------- | -------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
> | `environment`           | Identifier for the workload zone (max 5 chars)           | Mandatory  | For example, `PROD` for a production environment and `NP` for a non-production environment. |
> | `location`              | The Azure region in which to deploy.                     | Required   |                                                                                             |
> | 'name_override_file'    | Name override file                                       | Optional   | see [Custom naming](naming-module.md)                                            |


## Resource group parameters

The table below contains the parameters that define the resource group.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resource_group_name`   | Name of the resource group to be created                 | Optional   |  
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   |


## Network Parameters

The automation framework supports both creating the virtual network and the subnets For green field deployments. (Green field) or using an existing virtual network and existing subnets For brown field deployments. (Brown field) or a combination of For green field deployments.  and For brown field deployments.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified 
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

Ensure that the virtual network address space is large enough to host all the resources

The table below contains the networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                           | Type      | Notes                        |
> | -------------------------------- | --------------------------------------------------------------------- | --------- | ---------------------------- |
> | `network_name`                   | The name of the network.                                              | Optional  |                              |       
> | `network_logical_name`           | The logical name of the network, for eaxmple 'SAP01'                  | Required  | Used for resource naming.    |       
> | `network_arm_id`                 | The Azure resource identifier for the virtual network.                | Optional  | For brown field deployments. |
> | `network_address_space`          | The address range for the virtual network.                            | Mandatory | For green field deployments. |
> |                                  |                                                                       |           |                              |
> | `admin_subnet_name`              | The name of the `admin` subnet.                                       | Optional  |                              |
> | `admin_subnet_address_prefix`    | The address range for the `admin` subnet.                             | Mandatory | For green field deployments. |
> | `admin_subnet_arm_id`	         | The Azure resource identifier for the `admin` subnet.                 | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `admin_subnet_nsg_name`          | The name of the `admin`Network Security Group name.                   | Optional	 |                              |
> | `admin_subnet_nsg_arm_id`        | The Azure resource identifier for the `admin` Network Security Group. | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `db_subnet_name`                 | The name of the `db` subnet.                                          | Optional  |                              |
> | `db_subnet_address_prefix`       | The address range for the `db` subnet.                                | Mandatory | For green field deployments. |
> | `db_subnet_arm_id`	             | The Azure resource identifier for the `db` subnet.                    | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `db_subnet_nsg_name`             | The name of the `db` Network Security Group name.                     | Optional	 |                              |
> | `db_subnet_nsg_arm_id`           | The Azure resource identifier for the `db` Network Security Group     | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `app_subnet_name`                | The name of the `app` subnet.                                         | Optional  |                              |
> | `app_subnet_address_prefix`      | The address range for the `app` subnet.                               | Mandatory | For green field deployments. |
> | `app_subnet_arm_id`	             | The Azure resource identifier for the `app` subnet.                   | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `app_subnet_nsg_name`            | The name of the `app` Network Security Group name.                    | Optional  |                              |
> | `app_subnet_nsg_arm_id`          | The Azure resource identifier for the `app` Network Security Group.   | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `web_subnet_name`                | The name of the `web` subnet.                                         | Optional  |                              |
> | `web_subnet_address_prefix`      | The address range for the `web` subnet.                               | Mandatory | For green field deployments. |
> | `web_subnet_arm_id`	             | The Azure resource identifier for the `web` subnet.                   | Mandatory | For brown field deployments. |
> |                                  |                                                                       |           |                              |
> | `web_subnet_nsg_name`            | The name of the `web` Network Security Group name.                    | Optional	 |                              |
> | `web_subnet_nsg_arm_id`          | The Azure resource identifier for the `web` Network Security Group    | Mandatory | For brown field deployments. |


The table below contains the networking parameters if Azure NetApp Files are used.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                              |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------- |
> | `anf_subnet_name`                | The name of the ANF subnet.                                          | Optional  |                                    |
> | `anf_subnet_arm_id`              | The Azure resource identifier for the `ANF` subnet.                  | Required  | When using existing subnets        |
> | `anf_subnet_address_prefix`      | The address range for the `ANF` subnet.                              | Required  | When using ANF for new deployments |


**Minimum required network definition**

```terraform
network_logical_name = "SAP01"
network_address_space = "10.110.0.0/16"

db_subnet_address_prefix = "10.110.96.0/19"
app_subnet_address_prefix = "10.110.32.0/19"

```

### Authentication Parameters

The table below defines the credentials used for defining the Virtual Machine authentication

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                          | Type        | Notes               |
> | ---------------------------------- | -------------------------------------| ----------- | ------------------- |
> | `automation_username`              | Administrator account name           | Optional	| Default: 'azureadm' |   
> | `automation_password`              | Administrator password               | Optional    |                     |
> | `automation_path_to_public_key`    | Path to existing public key          | Optional    |                     |
> | `automation_path_to_private_key`   | Path to existing private key         | Optional    |                     |

**Minimum required authentication definition**

```terraform
automation_username = "azureadm"

```


## Key Vault Parameters

The table below defines the parameters used for defining the Key Vault information

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                         | Description                                                                    | Type         | Notes                               |
> | ------------------------------------------------ | ------------------------------------------------------------------------------ | ------------ | ----------------------------------- |
> | `user_keyvault_id`	                             | Azure resource identifier for existing system credentials key vault            | Optional	 |                                     | 
> | `spn_keyvault_id`                                | Azure resource identifier for existing deployment credentials (SPNs) key vault | Optional	 |                                     | 
> | `enable_purge_control_for_keyvaults`             | Disables the purge protection for Azure key vaults.                            | Optional     | Only use this for test environments |
> | `additional_users_to_add_to_keyvault_policies`	 | A list of user object IDs to add to the deployment KeyVault access policies    | Optional	 |                                     | 

## Private DNS


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                    | Type        | 
> | ---------------------------------- | -------------------------------------------------------------- | ----------- | 
> | `dns_label`                        | If specified, is the DNS name of the private DNS zone          | Optional    | 
> | `dns_resource_group_name`          | The name of the resource group containing the Private DNS zone | Optional    | 

## NFS Support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                             | Type        | Notes  |
> | ---------------------------------- | ----------------------------------------------------------------------- | ----------- | ------ |
> | `NFS_provider`                     | Defines what NFS backend to use, the options are 'AFS' for Azure Files NFS or 'ANF' for Azure NetApp files, 'NONE' for NFS from the SCS server or 'NFS' for an external NFS solution.  | Optional | |
> | `install_volume_size`              | Defines the size (in GB) for the 'install' volume                        | Optional    | |
> | `install_private_endpoint_id`      | Azure resource ID for the 'install' private endpoint                     | Optional    | For existing endpoints|
> | `transport_volume_size`            | Defines the size (in GB) for the 'transport' volume                      | Optional    | |
> | `transport_private_endpoint_id`    | Azure resource ID for the 'transport' private endpoint                   | Optional    | For existing endpoints|

### Azure Files NFS Support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                            | Type         | Notes  |
> | ---------------------------------- | -----------------------------------------------------------------------| -----------  | ------ |
> | `install_storage_account_id`       | Azure resource identifier for the 'install' storage account.           | Optional     | For brown field deployments. |
> | `transport_storage_account_id`     | Azure resource identifier for the 'transport' storage account.         | Optional     | For brown field deployments. |

**Minimum required Azure Files NFS definition**

```terraform
NFS_provider              = "AFS"
use_private_endpoint      = true

```


### Azure NetApp Files Support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                            | Type         | Notes  |
> | ------------------------------------ | -----------------------------------------------------------------------| -----------  | ------ |
> | `ANF_account_name`                   | Name for the Azure NetApp Files Account.                               | Optional     | |
> | `ANF_service_level`                  | Service level for the Azure NetApp Files Capacity Pool.                | Optional     | |
> | `ANF_pool_size`                      | The size (in GB) of the Azure NetApp Files Capacity Pool.              | Optional     | |
> | `ANF_qos_type`                       | The Quality of Service type of the pool (Auto or Manual).              | Optional     | |
> | `ANF_use_existing_pool`              | Use existing the Azure NetApp Files Capacity Pool.                     | Optional     | |
> | `ANF_pool_name`                      | The name of the Azure NetApp Files Capacity Pool.                      | Optional     | |
> | `ANF_account_arm_id`                 | Azure resource identifier for the Azure NetApp Files Account.          | Optional     | For brown field deployments. |
> |                                      |                                                                        |              | |
> | `ANF_transport_volume_use_existing`  | Defines if an existing transport volume is used.                       | Optional     | |
> | `ANF_transport_volume_name`          | Defines the transport volume name.                                     | Optional     | For brown field deployments. |
> | `ANF_transport_volume_size`          | Defines the size of the transport volume in GB.                        | Optional     | |
> | `ANF_transport_volume_throughput`    | Defines the throughput of the transport volume.                        | Optional     | |
> |                                      |                                                                        |              | |
> | `ANF_install_volume_use_existing`    | Defines if an existing install volume is used.                         | Optional     | |
> | `ANF_install_volume_name`            | Defines the install volume name.                                       | Optional     | For brown field deployments. |
> | `ANF_install_volume_size`            | Defines the size of the install volume in GB.                          | Optional     | |
> | `ANF_install_volume_throughput`      | Defines the throughput of the install volume.                          | Optional     | |


**Minimum required ANF definition**

```terraform
NFS_provider              = "ANF"
anf_subnet_address_prefix = "10.110.64.0/27"
ANF_service_level         = "Ultra"

```

### DNS Support   

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                            | Type         | Notes  |
> | ------------------------------------ | -----------------------------------------------------------------------| -----------  | ------ |
> | `use_custom_dns_a_registration`      | Should a custom DNS A record be created when using private endpoints.  | Optional     | |
> | `management_dns_subscription_id`     | Custom DNS subscription ID.                                            | Optional     | |
> | `management_dns_resourcegroup_name`  | Custom DNS resource group name.                                        | Optional     | |
> |                                      |                                                                        |              | |
## Other Parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                            | Type     | Notes                                 |
> | ------------------------------------ | ---------------------------------------------------------------------- | -------- | ------------------------------------- |
> | `enable_purge_control_for_keyvaults` | Is purge control is enabled on the Key Vault.                          | Optional | Use only for test deployments         |
> | `use_private_endpoint`               | Are private endpoints created for storage accounts and key vaults.     | Optional |                                       |
> | `use_service_endpoint`               | Are service endpoints defined for the subnets.                         | Optional |                                       |
> | `diagnostics_storage_account_arm_id` | The Azure resource identifier for the diagnostics storage account      | Required | For brown field deployments.          |
> | `witness_storage_account_arm_id`     | The Azure resource identifier for the witness storage account          | Required | For brown field deployments.          |


## ISCSI Parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                  |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | -------------------------------------- |
> | `iscsi_subnet_name`              | The name of the `iscsi` subnet.                                           | Optional  |                                        |
> | `iscsi_subnet_address_prefix`    | The address range for the `iscsi` subnet.                                 | Mandatory | For green field deployments.        |
> | `iscsi_subnet_arm_id`	         | The Azure resource identifier for the `iscsi` subnet.                     | Mandatory | For brown field deployments.   |
> | `iscsi_subnet_nsg_name`          | The name of the `iscsi` Network Security Group name                       | Optional  |                                        |
> | `iscsi_subnet_nsg_arm_id`        | The Azure resource identifier for the `iscsi` Network Security Group      | Mandatory | For brown field deployments.   |
> | `iscsi_count`                    | The number of iSCSI Virtual Machines                                      | Optional  |                                        |   
> | `iscsi_use_DHCP`                 | Controls whether to use dynamic IP addresses provided by the Azure subnet | Optional  |                                        |
> | `iscsi_image`	                 | Defines the Virtual machine image to use, see below                       | Optional  |                                        |
> | `iscsi_authentication_type`      | Defines the default authentication for the iSCSI Virtual Machines         | Optional  |                                        |
> | `iscsi__authentication_username` | Administrator account name                                                | Optional  |                                        |
> | `iscsi_nic_ips`                  | IP addresses for the iSCSI Virtual Machines                               | Optional  | ignored if `iscsi_use_DHCP` is defined |


## Utility VM Parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                          |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
> | `utility_vm_count`               | Defines the number of Utility virtual machines to deploy.                 | Optional  | Use the utility virtual machine to host SAPGui |
> | `utility_vm_size`                | Defines the SKU for the Utility virtual machines.                         | Optional  | Default: Standard_D4ds_v4                      |
> | `utility_vm_useDHCP`             | Defines if Azure subnet provided IPs should be used.                      | Optional  |                                                |
> | `utility_vm_image`               | Defines the virtual machine image to use.                                 | Optional  | Default: Windows Server 2019                   |
> | `utility_vm_nic_ips`             | Defines the IP addresses for the virtual machines.                        | Optional  |                                                |


## Terraform Parameters

The table below contains the Terraform parameters. These parameters need to be entered manually if not using the deployment scripts.


| Variable                | Description                           | Type             |
| ----------------------- | ---------- | ------------------------------------- | 
| `tfstate_resource_id`   | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files  | Required |
| `deployer_tfstate_key`  | The name of the state file for the Deployer  | Required |


## Next Step

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](deploy-workload-zone.md)