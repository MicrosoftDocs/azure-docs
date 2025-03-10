---
title: Configure SAP system parameters for automation
description: Define the SAP system properties for SAP Deployment Automation Framework by using a parameters file.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 02/16/2025
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-terraform
---

# Configure SAP system parameters

Configuration for [SAP Deployment Automation Framework](deployment-framework.md) happens through parameters files. You provide information about your SAP system infrastructure in a `tfvars` file, which the automation framework uses for deployment. You can find examples of the variable file in the `samples` repository.

The automation supports creating resources (green-field deployment) or using existing resources (brown-field deployment):

- **Green-field scenario**: The automation defines default names for resources, but some resource names might be defined in the `tfvars` file.
- **Brown-field scenario**: The Azure resource identifiers for the resources must be specified.

## Deployment topologies

You can use the automation framework to deploy the following SAP architectures:

- Standalone
- Distributed
- Distributed (highly available)

### Standalone

In the standalone architecture, all the SAP roles are installed on a single server.

To configure this topology, define the database tier values and set `enable_app_tier_deployment` to false.

### Distributed

The distributed architecture has a separate database server and application tier. The application tier can further be separated by having SAP central services on a virtual machine and one or more application servers.

To configure this topology, define the database tier values and define `scs_server_count` = 1, `application_server_count` >= 1.

### High availability

The distributed (highly available) deployment is similar to the distributed architecture. In this deployment, the database and/or SAP central services can both be configured by using a highly available configuration that uses two virtual machines, each with Pacemaker clusters or Windows failover clustering.

To configure this topology, define the database tier values and set `database_high_availability` to true. Set `scs_server_count` = 1 and `scs_high_availability` = true and `application_server_count` >= 1.

### HANA Scale-Out

The supported configurations for HANA Scale-Out are:

- Scale out with Standby node. Requires that HANA shared (single volume), HANA Data and HANA log to be deployed on Azure Netapp Files.
- Scale out with two sites replicated using HANA System Replication and managed by Pacemaker.
-  
To configure this topology, define the database tier values and set `database_HANA_use_scaleout_scenario` to true. Set `stand_by_node_count` = to the desired number of standby notes or disable it by setting  `database_HANA_no_standby_role` = false.


## Environment parameters

This section contains the parameters that define the environment settings.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                                    | Description                                              | Type       | Notes                                                                                       |
> | ----------------------------------------------------------- | -------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
> | `environment`                                               | Identifier for the workload zone (max five characters)   | Mandatory  | For example, `PROD` for a production environment and `NP` for a nonproduction environment.  |
> | `location`                                                  | The Azure region in which to deploy                      | Required   |                                                                                             |
> | `custom_prefix`                                             | Specifies the custom prefix used in the resource naming  | Optional   |                                                                                             |
> | `use_prefix`                                                | Controls if the resource naming includes the prefix      | Optional   | DEV-WEEU-SAP01-X00_xxxx                                                                     |
> | `name_override_file`                                        | Name override file                                       | Optional   | See [Custom naming](naming-module.md).                                                      |
> | `save_naming_information`                                   | Creates a sample naming JSON file                        | Optional   | See [Custom naming](naming-module.md).                                                      |
> | `tags`                                                      | A dictionary of tags to associate with all resources.    | Optional   |                                                                                             |
> | `prevent_deletion_if_contains_resources`                    | Controls resource groups deletion.                       | Optional   | Terraform does not by default delete resource groups which contain resources.               |

## Resource group parameters

This section contains the parameters that define the resource group.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resourcegroup_name`    | Name of the resource group to be created                 | Optional   |
> | `resourcegroup_arm_id`  | Azure resource identifier for an existing resource group | Optional   |
> | `resourcegroup_tags`    | Tags to be associated to the resource group              | Optional   |


## Infrastructure parameters

This section contains the parameters related to the Azure infrastructure.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                       | Description                                                                                       | Type       |
> | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
> | `custom_disk_sizes_filename`                   | Defines the disk sizing file name, See [Custom sizing](configure-extra-disks.md).                 | Optional   |
> | `resource_offset`                              | Provides an offset for resource naming.                                                           | Optional   |
> | `use_loadbalancers_for_standalone_deployments` | Controls if load balancers are deployed for standalone installations                              | Optional   |
> | `user_assigned_identity_id`                    | User assigned identity to assign to the virtual machines                                          | Optional   |
> | `vm_disk_encryption_set_id`                    | The disk encryption key to use for encrypting managed disks by using customer-provided keys.      | Optional   |
> | `use_random_id_for_storageaccounts`            | If defined will append a random string to the storage account name                                | Optional   |
> | `use_scalesets_for_deployment`                 | Use Flexible Virtual Machine Scale Sets for the deployment                                        | Optional   |
> | `scaleset_id`                                  | Azure resource identifier for the virtual machine scale set                                       | Optional   |
> |                                                |                                                                                                   | Optional   |
> | `proximityplacementgroup_arm_ids`              | Specifies the Azure resource identifiers of existing proximity placement groups.                  |            |
> | `proximityplacementgroup_names`                | Specifies the names of the proximity placement groups.                                            |            |
> | `use_app_proximityplacementgroups`             | Controls if the app tier virtual machines are placed in a different ppg from the database.        | Optional   |
> | `app_proximityplacementgroup_arm_ids`          | Specifies the Azure resource identifiers of existing proximity placement groups for the app tier. |            |
> | `app_proximityplacementgroup_names`            | Specifies the names of the proximity placement groups for the app tier.                           |            |
> |                                                |                                                                                                   | Optional   |
> | `use_spn`                                      | If defined the deployment will be performed using a Service Principal, otherwise an MSI           | Optional   |
> | `use_private_endpoint`                         | Use private endpoints.                                                                            | Optional   |
> |                                                |                                                                                                   | Optional   |
> | `shared_access_key_enabled`                    | Indicates the storage account authorization type, Shared Access Key or Entra Id                   | Optional   |
> | `shared_access_key_enabled_nfs`                | Indicates the File Share storage account authorization type, Shared Access Key or Entra Id        | Optional   |
> | `data_plane_available`                         | Boolean value indicating if storage account access is via data plane                              | Optional   |


The `resource_offset` parameter controls the naming of resources. For example, if you set the `resource_offset` to 1, the first disk will be named `disk1`. The default value is 0.

## SAP Application parameters

This section contains the parameters related to the SAP Application.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                      | Description                                              | Type       |
> | ----------------------------- | -------------------------------------------------------- | ---------- |
> | `sid`	                        |	Defines the SAP application SID                          | Required	  |
> | `database_sid`                | Defines the database SID                                 | Required   |
> | `web_sid`	                    |	Defines the Web Dispatcher SID                           | Required	  |
> | `scs_instance_number`	        | The instance number of SCS                               | Optional   |
> | `ers_instance_number`	        | The instance number of ERS                               | Optional	  |
> | `pas_instance_number`	        | The instance number of the Primary Application Server    | Optional	  |
> | `app_instance_number`	        | The instance number of the Application Server            | Optional	  |
> | `database_instance_number`	  | The instance number of SCS                               | Optional   |
> | `web_instance_number`	        | The instance number of the Web Dispatcher                | Optional	  |
> | `bom_name`	                  |	Defines the name of the Bill of MAterials file           | Optional	  |
## SAP virtual hostname parameters

In SAP Deployment Automation Framework, the SAP virtual hostname is defined by specifying the `use_secondary_ips` parameter.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `use_secondary_ips`     | Boolean flag that indicates if SAP should be installed by using virtual hostnames                 | Optional   |


### Database tier parameters

The database tier defines the infrastructure for the database tier. Supported database back ends are:

- `HANA`
- `DB2`
- `ORACLE`
- `ORACLE-ASM`
- `ASE`
- `SQLSERVER`
- `NONE` (in this case, no database tier is deployed)

See [High-availability configuration](configure-system.md#high-availability-configuration) for information on how to configure high availability.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                                        | Type         | Notes  |
> | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------ | ------ |
> | `database_platform`                | Defines the database back end                                                                      | Required     |        |
> | `database_vm_image`                | Defines the virtual machine image to use                                                           | Optional     |        |
> | `database_vm_sku`                  | Defines the virtual machine SKU to use                                                             | Optional     |        |
> | `database_server_count`            | Defines the number of database servers                                                             | Optional     |        |
> | `database_high_availability`       | Defines if the database tier is deployed highly available                                          | Optional     |        |
> | `database_vm_zones`                | Defines the availability zones for the database servers                                            | Optional     |        |
> | `db_sizing_dictionary_key`         | Defines the database sizing information                                                            | Required     | See [Custom sizing](configure-extra-disks.md). |
> | `database_vm_use_DHCP`             | Controls if Azure subnet-provided IP addresses should be used                                      | Optional     |        |
> | `database_vm_db_nic_ips`           | Defines the IP addresses for the database servers (database subnet)                                | Optional     |        |
> | `database_vm_db_nic_secondary_ips` | Defines the secondary IP addresses for the database servers (database subnet)                      | Optional     |        |
> | `database_vm_admin_nic_ips`        | Defines the IP addresses for the database servers (admin subnet)                                   | Optional     |        |
> | `database_loadbalancer_ips`        | List of IP addresses for the database load balancer (db subnet)                                    | Optional  |  |
> | `database_vm_authentication_type`  | Defines the authentication type (key/password)                                                     | Optional     |        |
> | `database_use_avset`               | Controls if the database servers are placed in availability sets                                   | Optional     |        |
> | `database_use_ppg`                 | Controls if the database servers are placed in proximity placement groups                          | Optional     |        |
> | `database_vm_avset_arm_ids`        | Defines the existing availability sets Azure resource IDs                                          | Optional     | Primarily used with Azure NetApp Files pinning. |
> | `database_use_premium_v2_storage`  | Controls if the database tier will use premium storage v2 (HANA)                                   | Optional     |        |
> | `database_dual_nics`               | Controls if the HANA database servers will have dual network interfaces                            | Optional     |        |
> | `database_tags`	                   | Defines a list of tags to be applied to the database servers                                       | Optional     |        |
> | `use_sles_saphanasr_angi`          | Defines if SAP HANA SR cluster will be configured with SAP HANA SR - An Next Generation Interface  | Optional     | Only applicable for SUSE       |



The virtual machine and the operating system image are defined by using the following structure:

```python
{
  os_type="linux"
  type="marketplace"
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp3"
  sku="gen2"
  version="latest"
}
```

## Common application tier parameters

The application tier defines the infrastructure for the application tier, which can consist of application servers, central services servers, and web dispatch servers.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                               | Type       | Notes                                          |
> | ---------------------------------- | ----------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------- |
> | `enable_app_tier_deployment`	     | Defines if the application tier is deployed                                               | Optional	  |                                                |
> | `app_tier_sizing_dictionary_key`   | Lookup value that defines the VM SKU and the disk layout for the application tier servers | Optional   |                                                |
> | `app_disk_sizes_filename`	         | Defines the custom disk size file for the application tier servers                        | Optional 	| See [Custom sizing](configure-extra-disks.md). |
> | `app_tier_authentication_type`     | Defines the authentication type for the application tier virtual machines                 | Optional	  |                                                |
> | `app_tier_use_DHCP`	               | Controls if Azure subnet-provided IP addresses should be used (dynamic)                   | Optional	  |                                                |
> | `app_tier_dual_nics`	             | Defines if the application tier server will have two network interfaces                   | Optional	  |                                                |

## SAP central services parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                               | Description                                                              | Type      | Notes                                                                                       |
> | -------------------------------------- | ------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------- |
> | `scs_server_count`	                   | Defines the number of SCS servers                                       | Required	  |                                                                                             |
> | `scs_high_availability`	               | Defines if the central services is highly available                     | Optional	  | See [High availability configuration](configure-system.md#high-availability-configuration). |
> | `scs_server_sku`	                     | Defines the virtual machine SKU to use                                  | Optional   |                                                                                             |
> | `scs_server_image`	                   | Defines the virtual machine image to use                                | Required   |                                                                                             |
> | `scs_server_zones`	                   | Defines the availability zones of the SCS servers                       | Optional   |                                                                                             |
> | `scs_server_app_nic_ips`               | List of IP addresses for the SCS servers (app subnet)                   | Optional   |                                                                                             |
> | `scs_server_app_nic_secondary_ips`     | List of secondary IP addresses for the SCS servers (app subnet)         | Optional   |                                                                                             |
> | `scs_server_app_admin_nic_ips`         | List of IP addresses for the SCS servers (admin subnet)                 | Optional   |                                                                                             |
> | `scs_server_loadbalancer_ips`          | List of IP addresses for the scs load balancer (app subnet)             | Optional   |                                                                                             |
> | `scs_server_use_ppg`                   | Controls if the SCS servers are placed in availability sets             | Optional   |                                                                                             |
> | `scs_server_use_avset`	               | Controls if the SCS servers are placed in proximity placement groups    | Optional   |                                                                                             |
> | `scs_server_tags`	                     | Defines a list of tags to be applied to the SCS servers                 | Optional   |                                                                                             |

## Application server parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                  | Description                                                                  | Type       | Notes  |
> | ----------------------------------------- | ---------------------------------------------------------------------------- | -----------| ------ |
> | `application_server_count`	              | Defines the number of application servers                                    | Required	  |        |
> | `application_server_sku`	                | Defines the virtual machine SKU to use                                       | Optional   |        |
> | `application_server_image`	              | Defines the virtual machine image to use                                     | Required   |        |
> | `application_server_zones`	              | Defines the availability zones to which the application servers are deployed | Optional   |        |
> | `application_server_admin_nic_ips`        | List of IP addresses for the application server (admin subnet)               | Optional   |        |
> | `application_server_app_nic_ips[]`        | List of IP addresses for the application servers (app subnet)                | Optional   |        |
> | `application_server_nic_secondary_ips[]`  | List of secondary IP addresses for the application servers (app subnet)      | Optional   |        |
> | `application_server_use_ppg`              | Controls if application servers are placed in availability sets              | Optional   |        |
> | `application_server_use_avset`            | Controls if application servers are placed in proximity placement groups     | Optional   |        |
> | `application_server_tags`	                | Defines a list of tags to be applied to the application servers              | Optional   |        |
> | `application_server_vm_avset_arm_ids[]`   | List of Availability Set Resource Ids for the application servers            | Optional   |        |

## Web dispatcher parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                   | Description                                                                    | Type      | Notes  |
> | ------------------------------------------ | ------------------------------------------------------------------------------ | --------- | ------ |
> | `webdispatcher_server_count`	             | Defines the number of web dispatcher servers                                   | Required  |        |
> | `webdispatcher_server_sku`	               | Defines the virtual machine SKU to use                                         | Optional  |        |
> | `webdispatcher_server_image`	             | Defines the virtual machine image to use                                       | Optional  |        |
> | `webdispatcher_server_zones`	             | Defines the availability zones to which the web dispatchers are deployed       | Optional  |        |
> | `webdispatcher_server_app_nic_ips[]`       | List of IP addresses for the web dispatcher server (app/web subnet)            | Optional  |        |
> | `webdispatcher_server_nic_secondary_ips[]` | List of secondary IP addresses for the web dispatcher server (app/web subnet)  | Optional  |        |
> | `webdispatcher_server_app_admin_nic_ips`   | List of IP addresses for the web dispatcher server (admin subnet)              | Optional  |        |
> | `webdispatcher_server_use_ppg`             | Controls if web dispatchers are placed in availability sets                    | Optional  |        |
> | `webdispatcher_server_use_avset`           | Controls if web dispatchers are placed in proximity placement groups           | Optional  |        |
> | `webdispatcher_server_tags`	               | Defines a list of tags to be applied to the web dispatcher servers             | Optional  |        |
> | `webdispatcher_server_loadbalancer_ips`    | List of IP addresses for the web load balancer (web/app subnet)                | Optional  |        |

## Network parameters

If the subnets aren't deployed using the workload zone deployment, they can be added in the system's tfvars file.

The automation framework can either deploy the virtual network and the subnets (green-field deployment) or use an existing virtual network and existing subnets (brown-field deployments):

 - **Green-field scenario**: The virtual network address space and the subnet address prefixes must be specified.
 - **Brown-field scenario**: The Azure resource identifier for the virtual network and the subnets must be specified.

Ensure that the virtual network address space is large enough to host all the resources.

This section contains the networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                          | Type      | Notes                        |
> | ------------------------------------ | -------------------------------------------------------------------- | --------- | ---------------------------- |
> | `network_logical_name`               | The logical name of the network                                      | Required  |                              |
> | `admin_subnet_name`                  | The name of the `admin` subnet                                       | Optional  |                              |
> | `admin_subnet_address_prefix`        | The address range for the `admin` subnet                             | Mandatory | For green-field deployments  |
> | `admin_subnet_arm_id`  	  *          | The Azure resource identifier for the `admin` subnet                 | Mandatory | For brown-field deployments  |
> | `admin_subnet_nsg_name`              | The name of the `admin` network security group                       | Optional	|                              |
> | `admin_subnet_nsg_arm_id` *          | The Azure resource identifier for the `admin` network security group | Mandatory | For brown-field deployments  |
> | `db_subnet_name`                     | The name of the `db` subnet                                          | Optional  |                              |
> | `db_subnet_address_prefix`           | The address range for the `db` subnet                                | Mandatory | For green-field deployments  |
> | `db_subnet_arm_id`	    *            | The Azure resource identifier for the `db` subnet                    | Mandatory | For brown-field deployments  |
> | `db_subnet_nsg_name`                 | The name of the `db` network security group name                     | Optional	|                              |
> | `db_subnet_nsg_arm_id`  *            | The Azure resource identifier for the `db` network security group    | Mandatory | For brown-field deployments  |
> | `app_subnet_name`                    | The name of the `app` subnet                                         | Optional  |                              |
> | `app_subnet_address_prefix`          | The address range for the `app` subnet                               | Mandatory | For green-field deployments  |
> | `app_subnet_arm_id`	    *            | The Azure resource identifier for the `app` subnet                   | Mandatory | For brown-field deployments  |
> | `app_subnet_nsg_name`                | The name of the `app` network security group name                    | Optional	|                              |
> | `app_subnet_nsg_arm_id` *            | The Azure resource identifier for the `app` network security group   | Mandatory | For brown-field deployments  |
> | `web_subnet_name`                    | The name of the `web` subnet                                         | Optional  |                              |
> | `web_subnet_address_prefix`          | The address range for the `web` subnet                               | Mandatory | For green-field deployments  |
> | `web_subnet_arm_id`	    *            | The Azure resource identifier for the `web` subnet                   | Mandatory | For brown-field deployments  |
> | `web_subnet_nsg_name`                | The name of the `web` network security group name                    | Optional	|                              |
> | `web_subnet_nsg_arm_id` *            | The Azure resource identifier for the `web` network security group   | Mandatory | For brown-field deployments  |
> | `deploy_application_security_groups` | Controls application security group deployments                      | Optional  |                              |
> | `nsg_asg_with_vnet`                  | If true, the network security group will be placed with the VNet     | Optional  |                              |

\* = Required for brown-field deployments

## Key vault parameters

If you don't want to use the workload zone key vault but another one, you can define the key vault's Azure resource identifier in the system's `tfvar` file.

This section defines the parameters used for defining the key vault information.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                                    | Type         | Notes                               |
> | ------------------------------------ | ------------------------------------------------------------------------------ | ------------ | ----------------------------------- |
> | `user_keyvault_id`	                 | Azure resource identifier for existing system credentials key vault            | Optional	   |                                     |
> | `spn_keyvault_id`                    | Azure resource identifier for existing deployment credentials (SPNs) key vault | Optional	   |                                     |
> | `enable_purge_control_for_keyvaults` | Disables the purge protection for Azure key vaults                             | Optional     | Only use for test environments.     |

### Anchor virtual machine parameters

SAP Deployment Automation Framework supports having an anchor virtual machine. The anchor virtual machine is the first virtual machine to be deployed. It's used to anchor the proximity placement group.

This section contains the parameters related to the anchor virtual machine.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                               | Description                                                                       | Type        |
> | -------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
> | `deploy_anchor_vm`                     | Defines if the anchor virtual machine is used                                     | Optional	   |
> | `anchor_vm_accelerated_networking`     | Defines if the anchor VM is configured to use accelerated networking              | Optional    |
> | `anchor_vm_authentication_type`        | Defines the authentication type for the anchor VM (key or password)               | Optional	   |
> | `anchor_vm_authentication_username`    | Defines the username for the anchor VM                                            | Optional	   |
> | `anchor_vm_image`	                     | Defines the VM image to use (as shown in the following code sample)               | Optional	   |
> | `anchor_vm_nic_ips[]`                  | List of IP addresses for the anchor VMs (app subnet)                              | Optional    |
> | `anchor_vm_sku`                        | Defines the VM SKU to use, for example, Standard_D4s_v3                           | Optional    |
> | `anchor_vm_use_DHCP`                   | Controls whether to use dynamic IP addresses provided by Azure subnet             | Optional    |

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

### Authentication parameters

By default, the SAP system deployment uses the credentials from the SAP workload zone. If the SAP system needs unique credentials, you can provide them by using these parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                          | Type        |
> | ---------------------------------- | -------------------------------------| ----------- |
> | `automation_username`              | Administrator account name           | Optional  	|
> | `automation_password`              | Administrator password               | Optional    |
> | `automation_path_to_public_key`    | Path to existing public key          | Optional    |
> | `automation_path_to_private_key`   | Path to existing private key         | Optional    |

## Miscellaneous parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                       | Description                                                                     | 
> | ---------------------------------------------- | ------------------------------------------------------------------------------- | 
> | `license_type`                                 | Specifies the license type for the virtual machines. Possible values are `RHEL_BYOS` and `SLES_BYOS`. For Windows, the possible values are `None`, `Windows_Client`, and `Windows_Server`. |
> | `use_zonal_markers`                            | Specifies if zonal virtual machines will include a zonal identifier: `xooscs_z1_00l###` versus  `xooscs00l###`.|
> | `deploy_v1_monitoring_extension`               | Defines if the Microsoft.AzureCAT.AzureEnhancedMonitoring extension will be deployed |
                                                  
## NFS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                                                   | Type        |
> | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
> | `NFS_provider`                     | Defines what NFS back end to use. The options are `AFS` for Azure Files NFS or `ANF` for Azure NetApp files.  | Optional    |
> | `sapmnt_volume_size`               | Defines the size (in GB) for the `sapmnt` volume.                                                             | Optional    |

### Azure files NFS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                 | Type         |
> | ---------------------------------- | --------------------------------------------------------------------------- | ----------- |
> | `azure_files_sapmnt_id`            | If provided, the Azure resource ID of the storage account used for `sapmnt` | Optional    |
> | `sapmnt_private_endpoint_id`       | If provided, the Azure resource ID of the `sapmnt` private endpoint         | Optional    |

### HANA Scaleout support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                   | Description                                                            | Type         | Notes                       |
> | ------------------------------------------ | -----------------------------------------------------------------------| -----------  | --------------------------- |
> | `database_HANA_use_ANF_scaleout_scenario`  | Defines if HANA scaleout is used.                                      | Optional     |                             |
> | `stand_by_node_count`                      | The number of standby nodes.                                           | Optional     |                             |


### Azure NetApp Files support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                 | Description                                                            | Type         | Notes                        |
> | -----------------------------------      | -----------------------------------------------------------------------| -----------  | ---------------------------- |
> | `ANF_HANA_use_AVG`                       | Use Application Volume Group for the volumes.                          | Optional     |                              |
> | `ANF_HANA_use_Zones`                     | Deploy the Azure NetApp Files volume zonally.                          | Optional     |                              |
> | `ANF_HANA_data`                          | Create Azure NetApp Files volume for HANA data.                        | Optional     |                              |
> | `ANF_HANA_data_use_existing_volume`      | Use existing Azure NetApp Files volume for HANA data.                  | Optional     | Use for pre-created volumes. |
> | `ANF_HANA_data_volume_count`             | Number of HANA data volumes.                                           | Optional     |                              |
> | `ANF_HANA_data_volume_name`              | Azure NetApp Files volume name for HANA data.                          | Optional     |                              |
> | `ANF_HANA_data_volume_size`              | Azure NetApp Files volume size in GB for HANA data.                    | Optional     | Default size is 256.         |
> | `ANF_HANA_data_volume_throughput`        | Azure NetApp Files volume throughput for HANA data.                    | Optional     | Default is 128 MBs/s.        |
> | `ANF_HANA_log`                           | Create Azure NetApp Files volume for HANA log.                         | Optional     |                              |
> | `ANF_HANA_log_use_existing`              | Use existing Azure NetApp Files volume for HANA log.                   | Optional     | Use for pre-created volumes. |
> | `ANF_HANA_log_volume_count`              | Number of HANA log volumes.                                            | Optional     |                              |
> | `ANF_HANA_log_volume_name`               | Azure NetApp Files volume name for HANA log.                           | Optional     |                              |
> | `ANF_HANA_log_volume_size`               | Azure NetApp Files volume size in GB for HANA log.                     | Optional     | Default size is 128.         |
> | `ANF_HANA_log_volume_throughput`         | Azure NetApp Files volume throughput for HANA log.                     | Optional     | Default is 128 MBs/s.        |
> | `ANF_HANA_shared`                        | Create Azure NetApp Files volume for HANA shared.                      | Optional     |                              |
> | `ANF_HANA_shared_use_existing`           | Use existing Azure NetApp Files volume for HANA shared.                | Optional     | Use for pre-created volumes. |
> | `ANF_HANA_shared_volume_name`            | Azure NetApp Files volume name for HANA shared.                        | Optional     |                              |
> | `ANF_HANA_shared_volume_size`            | Azure NetApp Files volume size in GB for HANA shared.                  | Optional     | Default size is 128.         |
> | `ANF_HANA_shared_volume_throughput`      | Azure NetApp Files volume throughput for HANA shared.                  | Optional     | Default is 128 MBs/s.        |
> | `ANF_sapmnt`                             | Create Azure NetApp Files volume for `sapmnt`.                         | Optional     |                              |
> | `ANF_sapmnt_use_existing_volume`         | Use existing Azure NetApp Files volume for `sapmnt`.                   | Optional     | Use for pre-created volumes. |
> | `ANF_sapmnt_volume_name`                 | Azure NetApp Files volume name for `sapmnt`.                           | Optional     |                              |
> | `ANF_sapmnt_volume_size`                 | Azure NetApp Files volume size in GB for `sapmnt`.                     | Optional     | Default size is 128.         |
> | `ANF_sapmnt_throughput`                  | Azure NetApp Files volume throughput for `sapmnt`.                     | Optional     | Default is 128 MBs/s.        |
> | `ANF_sapmnt_use_clone_in_secondary_zone` | Create the secondary sapmnt volume as a clone                          | Optional     | Default is 128 MBs/s.        |
> | `ANF_usr_sap`                            | Create Azure NetApp Files volume for `usrsap`.                         | Optional     |                              |
> | `ANF_usr_sap_use_existing`               | Use existing Azure NetApp Files volume for `usrsap`.                   | Optional     | Use for pre-created volumes. |
> | `ANF_usr_sap_volume_name`                | Azure NetApp Files volume name for `usrsap`.                           | Optional     |                              |
> | `ANF_usr_sap_volume_size`                | Azure NetApp Files volume size in GB for `usrsap`.                     | Optional     | Default size is 128.         |
> | `ANF_usr_sap_throughput`                 | Azure NetApp Files volume throughput for `usrsap`.                     | Optional     | Default is 128 MBs/s.        |

## Oracle parameters

These parameters need to be updated in the *sap-parameters.yaml* file when you deploy Oracle-based systems.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                            | Type         | Notes                                  |
> | ---------------------------------- | -----------------------------------------------------------------------| -----------  | -------------------------------------- |
> | `ora_release`                      | Release of Oracle, for example, 19                                     | Mandatory    |                                        |
> | `ora_version`                      | Version of Oracle, for example, 19.0.0                                 | Mandatory    |                                        |
> | `oracle_sbp_patch`                 | Oracle SBP patch file name, for example, SAP19P_2202-70004508.ZIP      | Mandatory    | Must be part of the Bill of Materials  |
> | `use_observer`                     | Defines if an observer will be used                                    | Optional     |                                        |


You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
                           ora_release          = "19",
                           ora_version          = "19.0.0",
                           oracle_sbp_patch     = "SAP19P_2202-70004508.ZIP",
                           oraclegrid_sbp_patch = "GIRU19P_2202-70004508.ZIP",
                         }
```

### DNS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                              | Type     |
> | ----------------------------------- | ------------------------------------------------------------------------ | -------- |
> | `management_dns_resourcegroup_name`	| Resource group that contains the private DNS zone.                       | Optional |
> | `management_dns_subscription_id`    | Subscription ID for the subscription that contains the private DNS zone. | Optional |
> | `use_custom_dns_a_registration`	    | Use an existing private DNS zone.                                        | Optional |
> | `dns_a_records_for_secondary_names`	| Registers A records for the secondary IP addresses.                      | Optional |


## Azure Monitor for SAP parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                               | Type      | Notes                                          |
> | -------------------------------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
> | `ams_resource_id`                | Defines the ARM resource ID for Azure Monitor for SAP                     | Optional  |                                                |
> | `enable_ha_monitoring`           | Defines if Prometheus high availability cluster monitoring is enabled     | Optional  |                                                |
> | `enable_os_monitoring`           | Defines if Prometheus high availability OS monitoring is enabled          | Optional  |                                                |


## Other parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                                  | Type     | Notes                                 |
> | ------------------------------------ | ---------------------------------------------------------------------------- | -------- | ------------------------------------- |
> | `Agent_IP`                           | IP address of the agent.                                                     | Optional |                                       |                                                
> | `add_Agent_IP`                       | Controls if Agent IP is added to the key vault and storage account firewalls | Optional |                                       |


## Terraform parameters

This section contains the Terraform parameters. These parameters need to be entered manually if you're not using the deployment scripts.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                  | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
> | `tfstate_resource_id`     | Azure resource identifier for the storage account in the SAP library that will contain the Terraform state files | Required * |
> | `deployer_tfstate_key`    | The name of the state file for the deployer                                                                      | Required * |
> | `landscaper_tfstate_key`  | The name of the state file for the workload zone                                                                 | Required * |

\* = Required for manual deployments

## Scale Out configuration

This section contains The configuration setting for the HANA Scale Out configuration


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                  | Description                                                                                       | Type       |
> | ----------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
> | `database_HANA_use_scaleout_scenario`     | Defines if the HANA database is configured using a Scale Out configuration                        | Optional   |
> | `database_HANA_no_standby_role`           | Defines that the Scale Out tier will not have a standby node                                      | Optional |
> | `stand_by_node_count`                     | The number of standby nodes                                                                       | Optional |
> | `hanashared_id`                           | The Azure Resource Identifier for the pre-created HANA Shared resource                            | Optional |
> | `hanashared_private_endpoint_id`          | The Azure Resource Identifier for the pre-created Private Endpoint                                | Optional |


## High-availability configuration

The high-availability configuration for the database tier and the SCS tier is configured by using the `database_high_availability` and `scs_high_availability`	flags. Red Hat and SUSE should use the appropriate HA version of the virtual machine images (RHEL-SAP-HA, sles-sap-15-sp?).

High-availability configurations use Pacemaker with Azure fencing agents.

### Cluster parameters

This section contains the parameters related to the cluster configuration.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                       | Description                                                                    | Type       |
> | ---------------------------------------------- | ------------------------------------------------------------------------------ | ---------- |
> | `database_cluster_disk_lun`                    | Specifies the The LUN of the shared disk for the Database cluster.             | Optional   |
> | `database_cluster_disk_size`                   | The size of the shared disk for the Database cluster.                          | Optional   |
> | `database_cluster_type`                        | Cluster quorum type; AFA (Azure Fencing Agent), ASD (Azure Shared Disk), ISCSI | Optional   |
> | `fencing_role_name`                            | Specifies the Azure role assignment to assign to enable fencing.               | Optional   |
> | `idle_timeout_scs_ers`                         | Sets the idle timeout setting for the SCS and ERS loadbalancer.                | Optional   |
> | `scs_cluster_disk_lun`                         | Specifies the The LUN of the shared disk for the Central Services cluster.     | Optional   |
> | `scs_cluster_disk_size`                        | The size of the shared disk for the Central Services cluster.                  | Optional   |
> | `scs_cluster_type`                             | Cluster quorum type; AFA (Azure Fencing Agent), ASD (Azure Shared Disk), ISCSI | Optional   |
> | `use_msi_for_clusters`                         | If defined, configures the Pacemaker cluster by using managed identities.      | Optional   |
> | `use_simple_mount`                             | Specifies if simple mounts are used (applicable for SLES 15 SP# or newer).     | Optional   |
> |                                                |                                                                                |            |
> | `use_fence_kdump`                              | Configure fencing device based on the fence agent fence_kdump                  | Optional   |
> | `use_fence_kdump_lun_db`                       | Default lun number of the kdump disk (database)                                | Optional   |
> | `use_fence_kdump_lun_scs`                      | Default lun number of the kdump disk (Central Services)                        | Optional   |
> | `use_fence_kdump_size_gb_db`                   | Default size of the kdump disk (database)                                      | Optional   |
> | `use_fence_kdump_size_gb_scs`                  | Default size of the kdump disk (Central Services)                              | Optional   |

> [!NOTE]
> The highly available central services deployment requires using a shared file system for `sap_mnt`. You can use Azure Files or Azure NetApp Files by using the `NFS_provider` attribute. The default is Azure Files. To use Azure NetApp Files, set the `NFS_provider` attribute to `ANF`.

### Fencing agent configuration

SAP Deployment Automation Framework supports using either managed identities or service principals for fencing agents. The following section describes how to configure each option.

If you set the variable `use_msi_for_clusters` to `true`, the fencing agent uses managed identities.

If you want to use a service principal for the fencing agent, set that variable to false.

The fencing agents should be configured to use a unique service principal with permissions to stop and start virtual machines. For more information, see [Create a fencing agent](/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker#create-an-azure-fence-agent-device).

```azurecli-interactive
az ad sp create-for-rbac --role="Linux Fence Agent Role" --scopes="/subscriptions/<subscriptionID>" --name="<prefix>-Fencing-Agent"
```

Replace `<prefix>` with the name prefix of your environment, such as `DEV-WEEU-SAP01`. Replace `<subscriptionID>` with the workload zone subscription ID.

> [!IMPORTANT]
> The name of the fencing agent service principal must be unique in the tenant. The script assumes that a role `Linux Fence Agent Role` was already created.
>
> Record the values from the fencing agent SPN:
   > - appId
   > - password
   > - tenant

The fencing agent details must be stored in the workload zone key vault by using a predefined naming convention. Replace `<prefix>` with the name prefix of your environment, such as `DEV-WEEU-SAP01`. Replace `<workload_kv_name>` with the name of the key vault from the workload zone resource group. For the other values, use the values recorded from the previous step and run the script.

```azurecli-interactive
az keyvault secret set --name "<prefix>-fencing-spn-id" --vault-name "<workload_kv_name>" --value "<appId>";
az keyvault secret set --name "<prefix>-fencing-spn-pwd" --vault-name "<workload_kv_name>" --value "<password>";
az keyvault secret set --name "<prefix>-fencing-spn-tenant" --vault-name "<workload_kv_name>" --value "<tenant>";
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP system](deploy-system.md)
