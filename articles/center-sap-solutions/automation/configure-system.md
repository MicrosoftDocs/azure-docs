---
title: Configure SAP system parameters for automation
description: Define the SAP system properties for the SAP on Azure Deployment Automation Framework using a parameters file.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 05/03/2022
ms.topic: conceptual
ms.service: azure-center-sap-solutions
---

# Configure SAP system parameters

Configuration for the [SAP on Azure Deployment Automation Framework](deployment-framework.md)] happens through parameters files. You provide information about your SAP system properties in a tfvars file, which the automation framework uses for deployment. You can find examples of the variable file in the 'samples/WORKSPACES/SYSTEM' folder.

The automation supports both creating resources (green field deployment) or using existing resources (brownfield deployment).

For the green field scenario, the automation defines default names for resources, however some resource names may be defined in the tfvars file.
For the brownfield scenario, the Azure resource identifiers for the resources must be specified.


## Deployment topologies

The automation framework can be used to deploy the following SAP architectures: 

- Standalone
- Distributed
- Distributed (Highly Available)

### Standalone

In the Standalone architecture, all the SAP roles are installed on a single server. 


To configure this topology, define the database tier values and set `enable_app_tier_deployment` to false.

### Distributed

The distributed architecture has a separate database server and application tier. The application tier can further be separated by having SAP Central Services on a virtual machine and one or more application servers.
To configure this topology, define the database tier values and define `scs_server_count` = 1, `application_server_count` >= 1

### High Availability

The Distributed (Highly Available) deployment is similar to the Distributed architecture. In this deployment, the database and/or SAP Central Services can both be configured using a highly available configuration using two virtual machines each with Pacemaker clusters.

To configure this topology, define the database tier values and set `database_high_availability` to true. Set `scs_server_count = 1` and `scs_high_availability` = true and 
`application_server_count` >= 1

## Environment parameters

The table below contains the parameters that define the environment settings.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                 | Description                                              | Type       | Notes                                                                                       |
> | ------------------------ | -------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
> | `environment`            | Identifier for the workload zone (max 5 chars)           | Mandatory  | For example, `PROD` for a production environment and `NP` for a non-production environment. |
> | `location`               | The Azure region in which to deploy.                     | Required   |                                                                                             |
> | `custom_prefix`          | Specifies the custom prefix used in the resource naming  | Optional   |                                                                                             |
> | `use_prefix`             | Controls if the resource naming includes the prefix      | Optional   | DEV-WEEU-SAP01-X00_xxxx                                                                     |
> | 'name_override_file'     | Name override file                                       | Optional   | see [Custom naming](naming-module.md)                                            |
> | 'save_naming_information | Create a sample naming json file                         | Optional   | see [Custom naming](naming-module.md)                                            |

## Resource group parameters

The table below contains the parameters that define the resource group.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resource_group_name`   | Name of the resource group to be created                 | Optional   |  
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   |
> | `resource_group_tags`   | Tags to be associated to the resource group              | Optional   |


## SAP Virtual Hostname parameters

In the SAP on Azure Deployment Automation Framework, the SAP virtual hostname is defined by specifying the `use_secondary_ips` parameter.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `use_secondary_ips`     | Boolean flag indicating if SAP should be installed using Virtual hostnames                 | Optional   |  

### Database tier parameters

The database tier defines the infrastructure for the database tier, supported database backends are:

- `HANA`
- `DB2`
- `ORACLE`
- `ORACLE-ASM`
- `ASE`
- `SQLSERVER`
- `NONE` (in this case no database tier is deployed)


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                         | Type         | Notes              |
> | ---------------------------------- | ----------------------------------------------------------------------------------- | -----------  | ------------------ |
> | `database_sid`                     | Defines the database SID.                                                           | Required     |                    |
> | `database_platform`                | Defines the database backend.                                                       | Supported values are `HANA`, `DB2`, `ORACLE`, `ASE`, `SQLSERVER`, `NONE` |
> | `database_high_availability`       | Defines if the database tier is deployed highly available.                          | Optional     | See [High availability configuration](configure-system.md#high-availability-configuration) |
> | `database_server_count`            | Defines the number of database servers.                                             | Optional     | Default value is 1 |
> | `database_vm_zones`                | Defines the Availability Zones for the database servers.                            | Optional	    |                    |
> | `db_sizing_dictionary_key`         | Defines the database sizing information.                                            | Required     | See [Custom Sizing](configure-extra-disks.md) |
> | `db_disk_sizes_filename`           | Defines the custom database sizing file name.                                       | Optional     | See [Custom Sizing](configure-extra-disks.md) |
> | `database_vm_use_DHCP`             | Controls if Azure subnet provided IP addresses should be used.                      | Optional     |                    |
> | `database_vm_db_nic_ips`           | Defines the IP addresses for the database servers (database subnet).                | Optional     |                    |
> | `database_vm_db_nic_secondary_ips` | Defines the secondary IP addresses for the database servers (database subnet).      | Optional     |                    |
> | `database_vm_admin_nic_ips`        | Defines the IP addresses for the database servers (admin subnet).                   | Optional     |                    |
> | `database_vm_image`	               | Defines the Virtual machine image to use, see below.                                | Optional	    |                    |
> | `database_vm_authentication_type`  | Defines the authentication type (key/password).                                     | Optional	    |                    |
> | `database_no_avset`                | Controls if the database virtual machines are deployed without availability sets.   | Optional	    | default is false   |
> | `database_no_ppg`                  | Controls if the database servers will not be placed in a proximity placement group. | Optional	    | default is false   |
> | `database_vm_avset_arm_ids`        | Defines the existing availability sets Azure resource IDs.                          | Optional	    | Primarily used together with ANF pinning|
> | `hana_dual_nics`                   | Controls if the HANA database servers will have dual network interfaces.            | Optional	    | default is true   |

The Virtual Machine and the operating system image is defined using the following structure:

```python
{
  os_type="linux"
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp3"
  sku="gen2"
  version="latest"
}
```

### Common application tier parameters

The application tier defines the infrastructure for the application tier, which can consist of application servers, central services servers and web dispatch servers


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                 | Type       | Notes  |
> | ---------------------------------- | --------------------------------------------------------------------------- | -----------| ------ |
> | `enable_app_tier_deployment`	     | Defines if the application tier is deployed                                 | Optional	  |        |
> | `sid`	                             |	Defines the SAP application SID                                            | Required	  |        |
> | `app_tier_sizing_dictionary_key`   | Lookup value defining the VM SKU and the disk layout for tha application tier servers | Optional |
> | `app_disk_sizes_filename`	         | Defines the custom disk size file for the application tier servers          | Optional 	| See [Custom Sizing](configure-extra-disks.md) |
> | `app_tier_authentication_type`     | Defines the authentication type for the application tier virtual machine(s) | Optional	  |       |
> | `app_tier_use_DHCP`	               | Controls if Azure subnet provided IP addresses should be used (dynamic)     | Optional	  |       |
> | `app_tier_dual_nics`	             | Defines if the application tier server will have two network interfaces     | Optional	  |       |

### SAP Central services parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                               | Description                                                          | Type      | Notes  |
> | -------------------------------------- | -------------------------------------------------------------------- | ----------| ------ |
> | `scs_server_count`	                   | Defines the number of SCS servers.                                   | Required	|        |
> | `scs_high_availability`	               | Defines if the Central Services is highly available.                 | Optional	| See [High availability configuration](configure-system.md#high-availability-configuration) |
> | `scs_instance_number`	                 | The instance number of SCS.                                          | Optional  |        |
> | `ers_instance_number`	                 | The instance number of ERS.                                          | Optional	|        |
> | `scs_server_sku`	                     | Defines the Virtual machine SKU to use.                              | Optional  |        |
> | `scs_server_image`	                   | Defines the Virtual machine image to use.                            | Required  |        |
> | `scs_server_zones`	                   | Defines the availability zones of the SCS servers.                   | Optional  |        |
> | `scs_server_app_nic_ips`               | List of IP addresses for the SCS servers (app subnet).               | Optional  |  |
> | `scs_server_app_nic_secondary_ips[]`   | List of secondary IP addresses for the SCS servers (app subnet).     | Optional   |  |
> | `scs_server_app_admin_nic_ips`         | List of IP addresses for the SCS servers (admin subnet).             | Optional  |  |
> | `scs_server_loadbalancer_ips`          | List of IP addresses for the scs load balancer (app subnet).         | Optional  |  |
> | `scs_server_no_ppg`                    | Controls SCS server proximity placement group.                       | Optional  |         |
> | `scs_server_no_avset`	                 | Controls SCS server availability set placement.                      | Optional  |         |
> | `scs_server_tags`	                     | Defines a list of tags to be applied to the SCS servers.             | Optional  |         |

### Application server parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                  | Description                                                                  | Type       | Notes  |
> | ----------------------------------------- | ---------------------------------------------------------------------------- | -----------| ------ |
> | `application_server_count`	              | Defines the number of application servers.                                   | Required	 | |
> | `application_server_sku`	                | Defines the Virtual machine SKU to use.                                      | Optional   | |
> | `application_server_image`	              | Defines the Virtual machine image to use.                                    | Required   | |
> | `application_server_zones`	              | Defines the availability zones to which the application servers are deployed. | Optional   | |
> | `application_server_app_nic_ips[]`        | List of IP addresses for the application servers (app subnet).                 | Optional   | |
> | `application_server_nic_secondary_ips[]`  | List of secondary IP addresses for the application servers (app subnet).                 | Optional   |  |
> | `application_server_app_admin_nic_ips`    | List of IP addresses for the application server (admin subnet).               | Optional   |  |
> | `application_server_no_ppg`               | Controls application server proximity placement group.                        | Optional   | |
> | `application_server_no_avset`             | Controls application server availability set placement.                       | Optional   | |
> | `application_server_tags`	                | Defines a list of tags to be applied to the application servers.              | Optional   | |

### Web dispatcher parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                   | Description                                                                    | Type      | Notes  |
> | ------------------------------------------ | ------------------------------------------------------------------------------ | --------- | ------ |
> | `webdispatcher_server_count`	             | Defines the number of web dispatcher servers.                                  | Required  |        |
> | `webdispatcher_server_sku`	               | Defines the Virtual machine SKU to use.                                        | Optional  |        |
> | `webdispatcher_server_image`	             | Defines the Virtual machine image to use.                                      | Optional  |        |
> | `webdispatcher_server_zones`	             | Defines the availability zones to which the web dispatchers are deployed.      | Optional  |        |
> | `webdispatcher_server_app_nic_ips[]`       | List of IP addresses for the web dispatcher server (app/web subnet).           | Optional  |  |
> | `webdispatcher_server_nic_secondary_ips[]` | List of secondary IP addresses for the web dispatcher server (app/web subnet). | Optional  |  |
> | `webdispatcher_server_app_admin_nic_ips`   | List of IP addresses for the web dispatcher server (admin subnet).             | Optional  |  |
> | `webdispatcher_server_no_ppg`              | Controls web proximity placement group placement.                              | Optional  | |
> | `webdispatcher_server_no_avset`	           | Defines web dispatcher availability set placement.                             | Optional  | |
> | `webdispatcher_server_tags`	               | Defines a list of tags to be applied to the web dispatcher servers.            | Optional  | |

## Network parameters

If the subnets aren't deployed using the workload zone deployment, they can be added in the system's tfvars file.

The automation framework can either deploy the virtual network and the subnets (green field deployment) or using an existing virtual network and existing subnets (brown field deployments).
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified
 - For the brownfield scenario, the Azure resource identifier for the virtual network and the subnets must be specified

Ensure that the virtual network address space is large enough to host all the resources.

The table below contains the networking parameters.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                                                          | Type      | Notes                        |
> | -------------------------------- | -------------------------------------------------------------------- | --------- | ---------------------------- |
> | `network_logical_name`           | The logical name of the network.                                     | Required  |                              |
> |                                  |                                                                      | Optional  |                              |
> | `admin_subnet_name`              | The name of the 'admin' subnet.                                      | Optional  |                              |
> | `admin_subnet_address_prefix`    | The address range for the 'admin' subnet.                            | Mandatory | For green field deployments. |
> | `admin_subnet_arm_id`  	  *      | The Azure resource identifier for the 'admin' subnet.                | Mandatory | For brown field deployments. |
> | `admin_subnet_nsg_name`          | The name of the 'admin' Network Security Group name.                 | Optional	|                              |
> | `admin_subnet_nsg_arm_id` *      | The Azure resource identifier for the 'admin' Network Security Group | Mandatory | For brown field deployments. |
> |                                  |                                                                      | Optional  |                              |
> | `db_subnet_name`                 | The name of the 'db' subnet.                                         | Optional  |                              |
> | `db_subnet_address_prefix`       | The address range for the 'db' subnet.                               | Mandatory | For green field deployments. |
> | `db_subnet_arm_id`	    *        | The Azure resource identifier for the 'db' subnet.                   | Mandatory | For brown field deployments. |
> | `db_subnet_nsg_name`             | The name of the 'db' Network Security Group name.                    | Optional	|                              |
> | `db_subnet_nsg_arm_id`  *        | The Azure resource identifier for the 'db' Network Security Group.   | Mandatory | For brown field deployments. |
> |                                  |                                                                      | Optional  |                              |
> | `app_subnet_name`                | The name of the 'app' subnet.                                        | Optional  |                              |
> | `app_subnet_address_prefix`      | The address range for the 'app' subnet.                              | Mandatory | For green field deployments. |
> | `app_subnet_arm_id`	    *        | The Azure resource identifier for the 'app' subnet.                  | Mandatory | For brown field deployments. |
> | `app_subnet_nsg_name`            | The name of the 'app' Network Security Group name.                   | Optional	|                              |
> | `app_subnet_nsg_arm_id` *        | The Azure resource identifier for the 'app' Network Security Group.  | Mandatory | For brown field deployments. |
> |                                  |                                                                      | Optional  |                              |
> | `web_subnet_name`                | The name of the 'web' subnet.                                        | Optional  |                              |
> | `web_subnet_address_prefix`      | The address range for the 'web' subnet.                              | Mandatory | For green field deployments. |
> | `web_subnet_arm_id`	    *        | The Azure resource identifier for the 'web' subnet.                  | Mandatory | For brown field deployments. |
> | `web_subnet_nsg_name`            | The name of the 'web' Network Security Group name.                   | Optional	|                              |
> | `web_subnet_nsg_arm_id` *        | The Azure resource identifier for the 'web' Network Security Group.  | Mandatory | For brown field deployments. |

\* = Required For brown field deployments.

## Key Vault Parameters

If you don't want to use the workload zone key vault but another one, this can be added in the system's tfvars file.

The table below defines the parameters used for defining the Key Vault information.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                                    | Type         | Notes                               |
> | ----------------------------------- | ------------------------------------------------------------------------------ | ------------ | ----------------------------------- |
> | `user_keyvault_id`	                | Azure resource identifier for existing system credentials key vault            | Optional	   |                                     | 
> | `spn_keyvault_id`                   | Azure resource identifier for existing deployment credentials (SPNs) key vault | Optional	   |                                     | 
> | `enable_purge_control_for_keyvaults | Disables the purge protection for Azure key vaults.                            | Optional     | Only use this for test environments |


### Anchor virtual machine parameters

The SAP on Azure Deployment Automation Framework supports having an Anchor virtual machine. The anchor virtual machine will be the first virtual machine to be deployed and is used to anchor the proximity placement group.

The table below contains the parameters related to the anchor virtual machine.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                                       | Type        |
> | ---------------------------------- | --------------------------------------------------------------------------------- | ----------- |
> | `deploy_anchor_vm`                 | Defines if the anchor Virtual Machine is used                                     | Optional	   |
> | `anchor_vm_sku`                    | Defines the VM SKU to use. For example, Standard_D4s_v3.              | Optional    |
> | `anchor_vm_image`	                 | Defines the VM image to use. See the following code sample.                              | Optional	   |
> | `anchor_vm_use_DHCP`               | Controls whether to use dynamic IP addresses provided by Azure subnet.           | Optional    |
> | `anchor_vm_accelerated_networking` | Defines if the Anchor VM is configured to use accelerated networking | Optional    |
> | `anchor_vm_authentication_type`    | Defines the authentication type for the anchor VM key and password       | Optional	   |

The Virtual Machine and the operating system image is defined using the following structure:
```python
{
  os_type="linux"
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp3"
  sku="gen2"
  version="latest"
}
```

### Authentication parameters

By default the SAP System deployment uses the credentials from the SAP Workload zone. If the SAP system needs unique credentials, you can provide them using these parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                          | Type        |
> | ---------------------------------- | -------------------------------------| ----------- |
> | `automation_username`              | Administrator account name           | Optional  	|
> | `automation_password`              | Administrator password               | Optional    |
> | `automation_path_to_public_key`    | Path to existing public key          | Optional    |
> | `automation_path_to_private_key`   | Path to existing private key         | Optional    |


## Other parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                       | Description                                                                     | Type        |
> | ---------------------------------------------- | ------------------------------------------------------------------------------- | ----------- |
> | `use_msi_for_clusters`                         | If defined, configures the Pacemaker cluster using managed Identities           | Optional    |
> | `resource_offset`                              | Provides and offset for resource naming. The offset number for resource naming when creating multiple resources. The default value is 0, which creates a naming pattern of disk0, disk1, and so on. An offset of 1 creates a naming pattern of disk1, disk2, and so on. | Optional    |
> | `disk_encryption_set_id`                       | The disk encryption key to use for encrypting managed disks using customer provided keys | Optional   |
> | `use_loadbalancers_for_standalone_deployments` | Controls if load balancers are deployed for standalone installations | Optional |
> | `license_type`                                 | Specifies the license type for the virtual machines. | Possible values are `RHEL_BYOS` and `SLES_BYOS`. For Windows the possible values are `None`, `Windows_Client` and `Windows_Server`. |
> | `use_zonal_markers`                            | Specifies if zonal Virtual Machines will include a zonal identifier. 'xooscs_z1_00l###' vs  'xooscs00l###'| Default value is true. |
> | `proximityplacementgroup_names`                | Specifies the names of the proximity placement groups |  |
> | `proximityplacementgroup_arm_ids`              | Specifies the Azure resource identifiers of existing proximity placement groups|  |


## NFS support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                             | Type        |
> | ---------------------------------- | ----------------------------------------------------------------------- | ----------- |
> | `NFS_provider`                     | Defines what NFS backend to use, the options are 'AFS' for Azure Files NFS or 'ANF' for Azure NetApp files.  |
> | `sapmnt_volume_size`               | Defines the size (in GB) for the 'sapmnt' volume                        | Optional    |

### Azure files NFS Support


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                            | Type         |
> | ---------------------------------- | ----------------------------------------------------------------------- | ----------- |
> | `azure_files_storage_account_id`   | If provided the Azure resource ID of the storage account for Azure Files | Optional    |

### Azure NetApp Files Support

> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                            | Type         | Notes                       |
> | ----------------------------------- | -----------------------------------------------------------------------| -----------  | --------------------------- |
> | `ANF_HANA_data`                     | Create Azure NetApp Files volume for HANA data.                        | Optional     |                             |
> | `ANF_HANA_data_use_existing_volume` | Use existing Azure NetApp Files volume for HANA data.                  | Optional     | Use for pre-created volumes |
> | `ANF_HANA_data_volume_name`         | Azure NetApp Files volume name for HANA data.                          | Optional     |                             |
> | `ANF_HANA_data_volume_size`         | Azure NetApp Files volume size in GB for HANA data.                    | Optional     | default size 256            |
> | `ANF_HANA_data_volume_throughput`   | Azure NetApp Files volume throughput for HANA data.                    | Optional     | default is 128 MBs/s        |
> |                                     |                                                                        |              |                             |
> | `ANF_HANA_log`                      | Create Azure NetApp Files volume for HANA log.                         | Optional     |                             |
> | `ANF_HANA_log_use_existing`         | Use existing Azure NetApp Files volume for HANA log.                   | Optional     | Use for pre-created volumes |
> | `ANF_HANA_log_volume_name`          | Azure NetApp Files volume name for HANA log.                           | Optional     |                             |
> | `ANF_HANA_log_volume_size`          | Azure NetApp Files volume size in GB for HANA log.                     | Optional     | default size 128            |
> | `ANF_HANA_log_volume_throughput`    | Azure NetApp Files volume throughput for HANA log.                     | Optional     | default is 128 MBs/s        |
> |                                     |                                                                        |              |                             |
> | `ANF_HANA_shared`                   | Create Azure NetApp Files volume for HANA shared.                      | Optional     |                             |
> | `ANF_HANA_shared_use_existing`      | Use existing Azure NetApp Files volume for HANA shared.                | Optional     | Use for pre-created volumes |
> | `ANF_HANA_shared_volume_name`       | Azure NetApp Files volume name for HANA shared.                        | Optional     |                             |
> | `ANF_HANA_shared_volume_size`       | Azure NetApp Files volume size in GB for HANA shared.                  | Optional     | default size 128            |
> | `ANF_HANA_shared_volume_throughput` | Azure NetApp Files volume throughput for HANA shared.                  | Optional     | default is 128 MBs/s        |
> |                                     |                                                                        |              |                             |
> | `ANF_sapmnt`                        | Create Azure NetApp Files volume for sapmnt.                           | Optional     |                             |
> | `ANF_sapmnt_use_existing_volume`    | Use existing Azure NetApp Files volume for sapmnt.                     | Optional     | Use for pre-created volumes |
> | `ANF_sapmnt_volume_name`            | Azure NetApp Files volume name for sapmnt.                             | Optional     |                             |
> | `ANF_sapmnt_volume_size`            | Azure NetApp Files volume size in GB for sapmnt.                       | Optional     | default size 128            |
> | `ANF_sapmnt_throughput`             | Azure NetApp Files volume throughput for sapmnt.                       | Optional     | default is 128 MBs/s        |
> |                                     |                                                                        |              |                             |
> | `ANF_usr_sap`                       | Create Azure NetApp Files volume for usrsap.                           | Optional     |                             |
> | `ANF_usr_sap_use_existing`          | Use existing Azure NetApp Files volume for usrsap.                     | Optional     | Use for pre-created volumes |
> | `ANF_usr_sap_volume_name`           | Azure NetApp Files volume name for usrsap.                             | Optional     |                             |
> | `ANF_usr_sap_volume_size`           | Azure NetApp Files volume size in GB for usrsap.                       | Optional     | default size 128            |
> | `ANF_usr_sap_throughput`            | Azure NetApp Files volume throughput for usrsap.                       | Optional     | default is 128 MBs/s        |


## Oracle parameters

> [!NOTE]
> These parameters need to be updated in the sap-parameters.yaml file when deploying Oracle based systems.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                                                            | Type         | Notes  |
> | ---------------------------------- | -----------------------------------------------------------------------| -----------  | ------ |
> | `ora_release`                      | Release of Oracle, e.g. 19                                             | Mandatory    |        |
> | `ora_version`                      | Version of Oracle, e.g. 19.0.0                                         | Mandatory    |        |
> | `oracle_sbp_patch`                 | Oracle SBP patch file name, e.g. SAP19P_2202-70004508.ZIP              | Mandatory    | Must be part of the Bill of Materials       |

## Terraform parameters

The table below contains the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                  | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
> | `tfstate_resource_id`     | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files | Required * |
> | `deployer_tfstate_key`    | The name of the state file for the Deployer                                                                      | Required * |
> | `landscaper_tfstate_key`  | The name of the state file for the workload zone                                                                 | Required * |

\* = required for manual deployments

## High availability configuration

The high availability configuration for the database tier and the SCS tier is configured using the `database_high_availability` and `scs_high_availability`	flags.

High availability configurations use Pacemaker with Azure fencing agents. The fencing agents should be configured to use a unique service principal with permissions to stop and start virtual machines. For more information, see [Create Fencing Agent](high-availability-guide-suse-pacemaker.md#create-an-azure-fence-agent-device)

```azurecli-interactive
az ad sp create-for-rbac --role="Linux Fence Agent Role" --scopes="/subscriptions/<subscriptionID>" --name="<prefix>-Fencing-Agent"
```

Replace `<prefix>` with the name prefix of your environment, such as `DEV-WEEU-SAP01` and `<subscriptionID>` with the workload zone subscription ID.

> [!IMPORTANT]
> The name of the Fencing Agent Service Principal must be unique in the tenant. The script assumes that a role 'Linux Fence Agent Role' has already been created
>
> Record the values from the Fencing Agent SPN.
   > - appId
   > - password
   > - tenant

The fencing agent details must be stored in the workload zone key vault using a predefined naming convention. Replace `<prefix>` with the name prefix of your environment, such as `DEV-WEEU-SAP01`, `<workload_kv_name>` with the name of the key vault from the workload zone resource group and for the other values use the values recorded from the previous step and run the script.


```azurecli-interactive
az keyvault secret set --name "<prefix>-fencing-spn-id" --vault-name "<workload_kv_name>" --value "<appId>";
az keyvault secret set --name "<prefix>-fencing-spn-pwd" --vault-name "<workload_kv_name>" --value "<password>";
az keyvault secret set --name "<prefix>-fencing-spn-tenant" --vault-name "<workload_kv_name>" --value "<tenant>";
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP system](deploy-system.md)

