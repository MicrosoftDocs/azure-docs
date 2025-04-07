---
title: Workload zone configuration in the automation framework
description: Overview of the SAP workload zone configuration process within SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 3/9/2024
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-terraform
---

# Workload zone configuration in the SAP automation framework

An [SAP application](deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. [SAP Deployment Automation Framework](deployment-framework.md) calls these tiers [workload zones](deployment-framework.md#deployment-components). See the following diagram for an example of a workload zone with two SAP systems.

:::image type="content" source="./media/deployment-framework/workload-zone-architecture.png" alt-text="Diagram that shows SAP workflow zones and systems.":::

The workload zone provides shared services to all of the SAP Systems in the workload zone. These shared services include:

- Azure Virtual Network
- Azure Key Vault
- Shared Azure Storage Account for installation media
- Azure NetApp Files account and capacity pool (optional)

The workload zone is typically deployed in a spoke subscription and the deployment of all the artifacts in the workload zone is done using unique service principal.

## Workload zone deployment configuration

The configuration of the SAP workload zone is done via a Terraform `tfvars` variable file. You can find examples of the variable file in the `samples/WORKSPACES/LANDSCAPE` folder.

The following sections show the different sections of the variable file.

## Environment parameters

This table contains the parameters that define the environment settings.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       | Notes                                                                                          |
> | ----------------------- | -------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
> | `environment`           | Identifier for the workload zone (max five characters)   | Mandatory  | For example, `PROD` for a production environment and `QA` for a Quality Assurance environment. |
> | `location`              | The Azure region in which to deploy                      | Required   |                                                                                                |
> | `name_override_file`    | Name override file                                       | Optional   | See [Custom naming](naming-module.md).                                                         |
> | `tags`                  | A dictionary of tags to associate with all resources.    | Optional   |                                                                                                |

## Resource group parameters

This table contains the parameters that define the resource group.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resourcegroup_name`    | Name of the resource group to be created                 | Optional   |
> | `resourcegroup_arm_id`  | Azure resource identifier for an existing resource group | Optional   |
> | `resourcegroup_tags`    | Tags to be associated with the resource group            | Optional   |

## Network parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field:

 - **Green-field scenario**: The virtual network address space and the subnet address prefixes must be specified.
 - **Brown-field scenario**: The Azure resource identifier for the virtual network and the subnets must be specified.

Ensure that the virtual network address space is large enough to host all the resources.

This table contains the networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                           | Type      | Notes                        |
> | -------------------------------- | --------------------------------------------------------------------- | --------- | ---------------------------- |
> | `network_logical_name`           | The logical name of the network, for example, `SAP01`                 | Required  | Used for resource naming     |
> | `network_name`                   | The name of the network                                               | Optional  |                              |
> | `network_arm_id`                 | The Azure resource identifier for the virtual network                 | Optional  | For brown-field deployments  |
> | `network_address_space`          | The address range for the virtual network                             | Mandatory | For green-field deployments  |
> |                                  |                                                                       |           |                              |
> | `admin_subnet_address_prefix`    | The address range for the `admin` subnet                              | Mandatory | For green-field deployments  |
> | `admin_subnet_arm_id`            | The Azure resource identifier for the `admin` subnet                  | Mandatory | For brown-field deployments  |
> | `admin_subnet_name`              | The name of the `admin` subnet                                        | Optional  |                              |
> | `admin_subnet_nsg_name`          | The name of the `admin`network security group                         | Optional  |                              |
> | `admin_subnet_nsg_arm_id`        | The Azure resource identifier for the `admin` network security group  | Mandatory | For brown-field deployments  |
> |                                  |                                                                       |           |                              |
> | `db_subnet_address_prefix`       | The address range for the `db` subnet                                 | Mandatory | For green-field deployments  |
> | `db_subnet_arm_id`               | The Azure resource identifier for the `db` subnet                     | Mandatory | For brown-field deployments  |
> | `db_subnet_name`                 | The name of the `db` subnet                                           | Optional  |                              |
> | `db_subnet_nsg_name`             | The name of the `db` network security group                           | Optional  |                              |
> | `db_subnet_nsg_arm_id`           | The Azure resource identifier for the `db` network security group     | Mandatory | For brown-field deployments  |
> |                                  |                                                                       |           |                              |
> | `app_subnet_address_prefix`      | The address range for the `app` subnet                                | Mandatory | For green-field deployments  |
> | `app_subnet_arm_id`              | The Azure resource identifier for the `app` subnet                    | Mandatory | For brown-field deployments  |
> | `app_subnet_name`                | The name of the `app` subnet                                          | Optional  |                              |
> | `app_subnet_nsg_name`            | The name of the `app` network security group                          | Optional  |                              |
> | `app_subnet_nsg_arm_id`          | The Azure resource identifier for the `app` network security group    | Mandatory | For brown-field deployments  |
> |                                  |                                                                       |           |                              |
> | `web_subnet_address_prefix`      | The address range for the `web` subnet                                | Mandatory | For green-field deployments  |
> | `web_subnet_arm_id`              | The Azure resource identifier for the `web` subnet                    | Mandatory | For brown-field deployments  |
> | `web_subnet_name`                | The name of the `web` subnet                                          | Optional  |                              |
> | `web_subnet_nsg_name`            | The name of the `web` network security group                          | Optional  |                              |
> | `web_subnet_nsg_arm_id`          | The Azure resource identifier for the `web` network security group    | Mandatory | For brown-field deployments  |

This table contains the networking parameters if Azure NetApp Files is used.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                              |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------- |
> | `anf_subnet_arm_id`              | The Azure resource identifier for the `ANF` subnet                   | Required  | When using existing subnets        |
> | `anf_subnet_address_prefix`      | The address range for the `ANF` subnet                               | Required  | When using `ANF` for deployments   |
> | `anf_subnet_name`                | The name of the `ANF` subnet                                         | Optional  |                                    |
> | `anf_subnet_nsg_name`            | The name of the `anf` network security group                         | Optional  |                                    |
> | `anf_subnet_nsg_arm_id`          | The Azure resource identifier for the `anf` network security group   | Optional  | For brown-field deployments        |

This table contains the networking parameters if iSCSI devices are hosted from this workload zone.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                              |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------- |
> | `iscsi_subnet_address_prefix`    | The address range for the `iscsi` subnet                             | Mandatory | For green-field deployments        |
> | `iscsi_subnet_arm_id`            | The Azure resource identifier for the `iscsi` subnet                 | Mandatory | For brown-field deployments        |
> | `iscsi_subnet_name`              | The name of the `iscsi` subnet                                       | Optional  |                                    |
> | `iscsi_subnet_nsg_arm_id`        | The Azure resource identifier for the `iscsi` network security group | Mandatory | For brown-field deployments        |
> | `iscsi_subnet_nsg_name`          | The name of the `iscsi` network security group                       | Optional  |                                    |

This table contains the networking parameters if Azure Monitor for SAP is hosted from this workload zone.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                              |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------- |
> | `ams_subnet_address_prefix`      | The address range for the `iscsi` subnet                             | Mandatory | For green-field deployments        |
> | `ams_subnet_arm_id`              | The Azure resource identifier for the `iscsi` subnet                 | Mandatory | For brown-field deployments        |
> | `ams_subnet_name`                | The name of the `iscsi` subnet                                       | Optional  |                                    |
> | `ams_subnet_nsg_arm_id`          | The Azure resource identifier for the `iscsi` network security group | Mandatory | For brown-field deployments        |
> | `ams_subnet_nsg_name`            | The name of the `iscsi` network security group                       | Optional  |                                    |



This table contains additional networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                              |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------------- |
> | `use_private_endpoint`           | Are private endpoints created for storage accounts and key vaults.   | Optional  |                                    |
> | `use_service_endpoint`           | Are service endpoints defined for the subnets.                       | Optional  |                                    |
> | `peer_with_control_plane_vnet`   | Are virtual networks peered with the control plane virtual network.  | Optional  | Required for the SAP Installation  |
> | `public_network_access_enabled`  | Is public access enabled on the storage accounts and key vaults      | Optional  |                                    |

#### Minimum required network definition

```terraform
network_logical_name = "SAP01"
network_address_space = "10.110.0.0/16"

db_subnet_address_prefix = "10.110.96.0/19"
app_subnet_address_prefix = "10.110.32.0/19"
```

### Authentication parameters

This table defines the credentials used for defining the virtual machine authentication.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                              | Type      | Notes               |
> | ---------------------------------- | ---------------------------------------------------------------------------------------- | --------- | ------------------- |
> | `automation_username`              | Administrator account name                                                               | Optional  | Default: `azureadm` |
> | `automation_password`              | Administrator password                                                                   | Optional  |                     |
> | `automation_path_to_public_key`    | Path to existing public key                                                              | Optional  |                     |
> | `automation_path_to_private_key`   | Path to existing private key                                                             | Optional  |                     |
> | `use_spn`                          | If defined the deployment will be performed using a Service Principal, otherwise an MSI  | Optional  |                     |

#### Minimum required authentication definition

```terraform
automation_username = "azureadm"
```

## Key vault parameters

This table defines the parameters used for defining the key vault information.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                         | Description                                                                    | Type         | Notes                               |
> | ------------------------------------------------ | ------------------------------------------------------------------------------ | ------------ | ----------------------------------- |
> | `spn_keyvault_id`                                | Azure resource identifier for existing deployment credentials (SPNs) key vault | Optional     |                                     |
> | `user_keyvault_id`                               | Azure resource identifier for existing system credentials key vault            | Optional     |                                     |
> | `additional_users_to_add_to_keyvault_policies`   | A list of user object IDs to add to the deployment key vault access policies   | Optional     |                                     |
> | `enable_purge_control_for_keyvaults`             | Disables the purge protection for Azure key vaults                             | Optional     | Use only for test environments.     |
> | `enable_rbac_authorization_for_keyvault`         | Enables RBAC on key vaults                                                     | Optional     |                                     |
> | `soft_delete_retention_days`                     | The number of days that items should be retained in the soft delete period     | Optional     |                                     |
> | `keyvault_private_endpoint_id`                   | Azure resource ID of the key vault's private endpoint                          | Optional     |                                     |

## Private DNS

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                 | Type        |
> | ---------------------------------- | --------------------------------------------------------------------------- | ----------- |
> | `dns_label`                        | If specified, is the DNS name of the private DNS zone                       | Optional    |
> | `dns_resource_group_name`          | The name of the resource group that contains the private DNS zone           | Optional    |
> | `register_virtual_network_to_dns`  | Controls if the SAP Virtual Network is registered with the private DNS zone | Optional    |
> | `dns_server_list`                  | If specified, a list of DNS Server IP addresses                             | Optional    |

## NFS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                             | Type        | Notes                                                                                                                                                 |
> | ---------------------------------- | ----------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `create_transport_storage`         | If defined, create storage for the transport directories.               | Optional    |                                                                                                                                                       |
> | `export_install_path`              | If provided, export mount path for the installation media.              | Optional    |                                                                                                                                                       |
> | `export_transport_path`            | If provided, export mount path for the transport share.                 | Optional    |                                                                                                                                                       |
> | `install_always_create_fileshares` | Always create file shares.                                              | Optional    |                                                                                                                                                       |
> | `install_private_endpoint_id`      | Azure resource ID for the `install` private endpoint.                   | Optional    | For existing endpoints                                                                                                                                |
> | `install_volume_size`              | Defines the size (in GB) for the `install` volume.                      | Optional    |                                                                                                                                                       |
> | `NFS_provider`                     | Defines what NFS back end to use.                                       | Optional    | The options are `AFS` for Azure Files NFS or `ANF` for Azure NetApp Files, `NONE` for NFS from the SCS server, or `NFS` for an external NFS solution. |
> | `transport_private_endpoint_id`    | Azure resource ID of the key vault's private endpoint                   | Optional    |                                                                                                                                                       |
> | `transport_volume_size`            | Defines the size (in GB) for the `transport` volume.                    | Optional    |                                                                                                                                                       |
> | `use_AFS_for_installation_media`   | If provided, uses AFS for the installation media.                       | Optional    |                                                                                                                                                       |

### Azure Files NFS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                            | Type         | Notes                       |
> | ---------------------------------- | ---------------------------------------------------------------------- | -----------  | --------------------------- |
> | `install_storage_account_id`       | Azure resource identifier for the `install` storage account            | Optional     | For brown-field deployments |
> | `transport_storage_account_id`     | Azure resource identifier for the `transport` storage account          | Optional     | For brown-field deployments |
> | `Storage account replication type` | Storage account replication type, default ZRS                          | Optional     |                             |

#### Minimum required Azure Files NFS definition

```terraform
NFS_provider              = "AFS"
use_private_endpoint      = true
```

### Azure NetApp Files support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                            | Type         | Notes                       |
> | ------------------------------------ | -----------------------------------------------------------------------| -----------  | --------------------------- |
> | `ANF_account_name`                   | Name for the Azure NetApp Files account                                | Optional     |                             |
> | `ANF_service_level`                  | Service level for the Azure NetApp Files capacity pool                 | Optional     |                             |
> | `ANF_pool_size`                      | The size (in GB) of the Azure NetApp Files capacity pool               | Optional     |                             |
> | `ANF_qos_type`                       | The quality of service type of the pool (auto or manual)               | Optional     |                             |
> | `ANF_use_existing_pool`              | Use existing for the Azure NetApp Files capacity pool                  | Optional     |                             |
> | `ANF_pool_name`                      | The name of the Azure NetApp Files capacity pool                       | Optional     |                             |
> | `ANF_account_arm_id`                 | Azure resource identifier for the Azure NetApp Files account           | Optional     | For brown-field deployments |
> |                                      |                                                                        |              |                             |
> | `ANF_transport_volume_use_existing`  | Defines if an existing transport volume is used                        | Optional     |                             |
> | `ANF_transport_volume_name`          | Defines the transport volume name                                      | Optional     | For brown-field deployments |
> | `ANF_transport_volume_size`          | Defines the size of the transport volume in GB                         | Optional     |                             |
> | `ANF_transport_volume_throughput`    | Defines the throughput of the transport volume                         | Optional     |                             |
> | `ANF_transport_volume_zone`          | Defines the availability zone of the transport volume                  | Optional     |                             |
> |                                      |                                                                        |              |                             |
> | `ANF_install_volume_use_existing`    | Defines if an existing install volume is used                          | Optional     |                             |
> | `ANF_install_volume_name`            | Defines the install volume name                                        | Optional     | For brown-field deployments |
> | `ANF_install_volume_size`            | Defines the size of the install volume in GB                           | Optional     |                             |
> | `ANF_install_volume_throughput`      | Defines the throughput of the install volume                           | Optional     |                             |
> | `ANF_install_volume_zone`            | Defines the availability zone of the install volume                    | Optional     |                             |

#### Minimum required ANF definition

```terraform
NFS_provider              = "ANF"
anf_subnet_address_prefix = "10.110.64.0/27"
ANF_service_level         = "Ultra"
```

### DNS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                              | Type     |
> | ----------------------------------- | ------------------------------------------------------------------------ | -------- |
> | `dns_label`                         | DNS name of the private DNS zone.                                        | Optional |
> | `management_dns_resourcegroup_name` | Resource group that contains the private DNS zone.                       | Optional |
> | `management_dns_subscription_id`    | Subscription ID for the subscription that contains the private DNS zone. | Optional |
> | `use_custom_dns_a_registration`     | Use an existing private DNS zone.                                        | Optional |


### NAT support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                              | Description                                                              | Type     |
> | ------------------------------------- | ------------------------------------------------------------------------ | -------- |
> | `deploy_nat_gateway`                  | If set, deploys a NAT gateway.                                           | Optional |
> | `nat_gateway_name`                    | The name of the NAT Gateway.                                             | Optional |
> | `nat_gateway_arm_id`                  | The Azure resource identifier of the NAT Gateway.                        | Optional |
> | `nat_gateway_public_ip_zones`         | The zones for the NAT Gateway public IP address                          | Optional |
> | `nat_gateway_public_ip_arm_id`        | The Azure resource identifier for the NAT Gateway public IP address      | Optional |
> | `nat_gateway_idle_timeout_in_minutes` | The idle timeout in minutes for the NAT Gateway (default=4)              | Optional |
> | `nat_gateway_public_ip_tags`          | Tags for the public IP resource                                          | Optional |


## Other parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                     | Description                                                                  | Type     | Notes                                 |
> | -------------------------------------------- | ---------------------------------------------------------------------------- | -------- | ------------------------------------- |
> | `diagnostics_storage_account_arm_id`         | The Azure resource identifier for the diagnostics storage account.           | Required | For brown-field deployments.          |
> | `place_delete_lock_on_resources`             | Places delete locks on the key vaults and the virtual network                | Optional |                                       |
> | `witness_storage_account_arm_id`             | The Azure resource identifier for the witness storage account.               | Required | For brown-field deployments.          |
> | `Agent_IP`                                   | IP address of the agent.                                                     | Optional |                                       |
> | `add_Agent_IP`                               | Controls if Agent IP is added to the key vault and storage account firewalls | Optional |                                       |
> | `enable_firewall_for_keyvaults_and_storage`  | Restrict access to selected subnets.                                         | Optional |                                       |


## iSCSI parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                  |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | -------------------------------------- |
> | `iscsi_authentication_type`      | Defines the default authentication for the iSCSI virtual machines         | Optional  |                                        |
> | `iscsi_authentication_username`  | Administrator account name                                                | Optional  |                                        |
> | `iscsi_count`                    | The number of iSCSI virtual machines                                      | Optional  |                                        |
> | `iscsi_size`                     | The size of iSCSI virtual machines                                        | Optional  |                                        |
> | `iscsi_image`                    | Defines the virtual machine image to use (next table)                     | Optional  |                                        |
> | `iscsi_nic_ips`                  | IP addresses for the iSCSI virtual machines                               | Optional  | Ignored if `iscsi_use_DHCP` is defined |
> | `iscsi_use_DHCP`                 | Controls whether to use dynamic IP addresses provided by the Azure subnet | Optional  |                                        |
> | `iscsi_vm_zones`                 | Availability zones for the iSCSI Virtual Machines                         | Optional  |                                        |

## Utility VM parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                          |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
> | `utility_vm_count`               | Defines the number of utility virtual machines to deploy                  | Optional  | Use the utility virtual machine to host SAPGui |
> | `utility_vm_image`               | Defines the virtual machine image to use                                  | Optional  | Default: Windows Server 2019                   |
> | `utility_vm_nic_ips`             | Defines the IP addresses for the virtual machines                         | Optional  |                                                |
> | `utility_vm_os_disk_size`        | Defines the size of the OS disk for the Virtual Machine                   | Optional  | Default: 128                                   |
> | `utility_vm_os_disk_type`        | Defines the type of the OS disk for the Virtual Machine                   | Optional  | Default: Premium_LRS                           |
> | `utility_vm_size`                | Defines the SKU for the utility virtual machines                          | Optional  | Default: Standard_D4ds_v4                      |
> | `utility_vm_useDHCP`             | Defines if Azure subnet provided IPs should be used                       | Optional  |                                                |
> | `user_assigned_identity_id       | User assigned identity to assign to the virtual machines                  | Optional  |                                                |

The virtual machine and the operating system image are defined by using the following structure:

```python
{
  os_type         = "linux"
  type            = "marketplace"
  source_image_id = ""
  publisher       = "SUSE"
  offer           = "sles-sap-15-sp5"
  sku             = "gen2"
  version=        " latest"
}
```

## Azure Monitor for SAP parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                          |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
> | `create_ams_instance`            | Defines if an Azure Monitor for SAP instance should be created            | Optional  |                                                |
> | `ams_instance_name`              | Defines the name of the instance                                          | Optional  |                                                |
> | `ams_laws_arm_id`                | Defines the ARM resource ID for the Log Analytics Workspace               | Optional  |                                                |



## Terraform parameters

This table contains the Terraform parameters. These parameters need to be entered manually if you're not using the deployment scripts.

| Variable                | Description                                                                                                        | Type     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| `tfstate_resource_id`   | The Azure resource identifier for the storage account in the SAP library that contains the Terraform state files.  | Required |
| `deployer_tfstate_key`  | The name of the state file for the deployer.                                                                       | Required |

## Next step

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](deploy-workload-zone.md)
