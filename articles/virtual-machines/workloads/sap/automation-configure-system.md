---
title: Configure SAP system parameters for automation
description: Define the SAP system properties for the automation framework using a parameters JSON file.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure SAP system parameters for automation

Configuration for the [SAP deployment automation framework](automation-deployment-framework.md)] happens through parameters files. You provide information about your SAP system properties in a tfvars file, which the automation framework uses for deployment. 

The configuration of the SAP workload zone is done via a Terraform tfvars variable file.

## Terraform Parameters

The table below contains the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts.


>| Variable                  | Type       | Description                           | 
>| ------------------------- | ---------- | ------------------------------------- | 
>| `tfstate_resource_id`     | Required * | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files  |
>| `deployer_tfstate_key`    | Required * | The name of the state file for the Deployer  |
>| `landscaper_tfstate_key`  | Required * | The name of the state file for the workload zone  |

* = required for manual deployments
## Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.


>| Variable                | Type       | Description                           | 
>| ----------------------- | ---------- | ------------------------------------- | 
>| `environment`           | Required   | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production >environment. |
>| `location`              | Required   | The Azure region in which to deploy.     |
>| `resource_group_name`   | Optional   | Name of the resource group to be created |
>| `resource_group_arm_id` | Optional   | Azure resource identifier for an existing resource group |

## Network Parameters

If the subnets are not deployed using the workload zone deployment, they can be added in the system's tfvars file.

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified 
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

Ensure that the virtual network address space is large enough to host all the resources

The table below contains the networking parameters.


>| Variable                         | Type        | Description                           | Notes  |
>| -------------------------------- | ----------- | ------------------------------------- | ------ |
>| `network_logical_name`           | Required    | The logical name of the network (MGMT01 in DEV-WEEU-MGMT01-INFRASTRUCTURE) | |
>| `network_arm_id`                 | Optional *  | The Azure resource identifier for the virtual network | Required for brown field deployments |
>| `admin_subnet_name`              | Optional    | The name of the 'admin' subnet | |
>| `admin_subnet_address_prefix`    | Required *  | The address range for the 'admin' subnet | Required for green field deployments |
>| `admin_subnet_arm_id`	           | Required *  | The Azure resource identifier for the 'admin' subnet | Required for brown field deployments |
>| `admin_subnet_nsg_name`          | Optional	   | The name of the 'admin' Network Security Group name | |
>| `admin_subnet_nsg_arm_id`        | Required *  | The Azure resource identifier for the 'admin' Network Security Group | Required for brown field deployments| 
>| `db_subnet_name`                 | Optional    | The name of the 'db' subnet | |
>| `db_subnet_address_prefix`       | Required *  | The address range for the 'db' subnet | Required for green field deployments |
>| `db_subnet_arm_id`	             | Required *  | The Azure resource identifier for the 'db' subnet | Required for brown field deployments |
>| `db_subnet_nsg_name`             | Optional	   | The name of the 'db' Network Security Group name | |
>| `db_subnet_nsg_arm_id`           | Required *  | The Azure resource identifier for the 'db' Network Security Group | Required for brown field deployments |
>| `app_subnet_name`                | Optional    | The name of the 'app' subnet | |
>| `app_subnet_address_prefix`      | Required *  | The address range for the 'app' subnet | Required for green field deployments |
>| `app_subnet_arm_id`	             | Required *  | The Azure resource identifier for the 'app' subnet | Required for brown field deployments |
>| `app_subnet_nsg_name`            | Optional	   | The name of the 'app' Network Security Group name | |
>| `app_subnet_nsg_arm_id`          | Required *  | The Azure resource identifier for the 'app' Network Security Group | Required for brown field deployments |
>| `web_subnet_name`                | Optional    | The name of the 'web' subnet | |
>| `web_subnet_address_prefix`      | Required *  | The address range for the 'web' subnet | Required for green field deployments |
>| `web_subnet_arm_id`	             | Required *  | The Azure resource identifier for the 'web' subnet | Required for brown field deployments |
>| `web_subnet_nsg_name`            | Optional	   | The name of the 'web' Network Security Group name | |
>| `web_subnet_nsg_arm_id`          | Required *  | The Azure resource identifier for the 'web' Network Security Group | Required for brown field deployments |

* = Required for brown field deployments

### Database Tier Parameters

The database tier defines the infrastructure for the database tier, supported database back ends are:

- `HANA`
- `DB2`
- `ORACLE`
- `ORACLE-ASM`
- `ASE`
- `SQLSERVER`
- `NONE` (in this case no database tier is deployed)


| Variable                          | Type        | Description                             | Notes  |
| --------------------------------  | ----------- | --------------------------------------- | ------ |
| `database_platform`               | Required    | Defines the database backend            | |
| `database_high_availability`      | Optional    | Defines if the database tier is deployed highly available | |
| `database_server_count`           | Optional    | Defines the number of database servers | Default value is 1|
| `database_vm_names`               | Optional    | Defines the database server virtual machine names if the default naming is not acceptable | |
| `database_size`                   | Required    | Defines the database sizing information | See [Custom Sizing](automation-configure-extra-disks.md) |
| `database_sid`                    | Required    | Defines the database SID                |       |
| `db_disk_sizes_filename`          | Optional    | Defines the custom database sizing      | See [Custom Sizing](automation-configure-extra-disks.md) |
| `database_sid`                    | Required    | Defines the database SID | |
| `database_vm_image`	              | Optional	  | Defines the Virtual machine image to use, see below | 
| `database_vm_use_DHCP`            | Optional    | Controls if Azure subnet provided IP addresses should be used (dynamic) true |
| `database_vm_db_nic_ips`          | Optional    | Defines the static IP addresses for the database servers (database subnet) | |
| `database_vm_admin_nic_ips`       | Optional    | Defines the static IP addresses for the database servers (admin subnet) | |
| `database_vm_authentication_type` | Optional	  | Defines the authentication type for the database virtual machines (key/password) | | 
| `database_vm_zones`               | Optional	  | Defines the Availability Zones | |
| `database_vm_avset_arm_ids`       | Optional	  | Defines the existing availability sets Azure resource IDs | Primarily used together with ANF pinning | 
| `database_no_avset`               | Optional	  | Controls if the database virtual machines are deployed without availability sets | default is false |
| `database_no_ppg`                 | Optional	  | Controls if the database servers will not be placed in a proximity placement group | default is false |

The Virtual Machine and the operating system image is defined using the following structure: 

```python 
{
  os_type="linux"
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp2"
  sku="gen2"
  version="8.2.2021040902"
}
```

### Common Application Tier Parameters

The application tier defines the infrastructure for the application tier, which can consist of application servers, central services servers and web dispatch servers


| Variable                          | Type        | Description                             | Notes  |
| --------------------------------  | ----------- | --------------------------------------- | ------ |
| `enable_app_tier_deployment`	    | Optional	  | Defines if the application tier is deployed ||
| `sid`	                            | Required	  |	Defines the SAP application SID ||
| `app_disk_sizes_filename`	        | Optional 	  | Defines the custom disk size file for the application tier servers | See [Custom Sizing](automation-configure-extra-disks.md) |
| `app_tier_authentication_type`    | Optional	  | Defines the authentication type for the application tier virtual machine(s) (key/password) | | 
| `app_tier_use_DHCP`	            | Optional	  | Controls if Azure subnet provided IP addresses should be used (dynamic) | |
| `app_tier_dual_nics`	            | Optional	  | Defines if the application tier server will have two network interfaces  | |
| `app_tier_vm_sizing`	            | Optional	  | Lookup value defining the VM SKU and the disk layout for tha application tier servers  | |

### Application Server Parameters


| Variable                               | Type        | Description                             | Notes  |
| -------------------------------------- | ----------- | --------------------------------------- | ------ |
| `application_server_count`	         | Required	   | Defines the number of application servers | |
| `application_server_sku`	             | Optional    | Defines the Virtual machine SKU to use | | 
| `application_server_image`	         | Required    | Defines the Virtual machine image to use| | 
| `application_server_zones`	         | Optional    | Defines the availability zones to which the application servers are deployed | | 
| `application_server_app_nic_ips[]`     | Optional    | List of IP addresses for the application server (app subnet) | Ignored if `app_tier_use_DHCP` is used |
| `application_server_app_admin_nic_ips` | Optional    | List of IP addresses for the application server (admin subnet) | Ignored if `app_tier_use_DHCP` is used |
| `application_server_no_ppg`            | Optional    | Controls if the application servers will not be placed in a proximity placement group ||
| `application_server_no_avset`	         | Optional    | Defines that the application servers machines will not be placed in an availability set ||
| `application_server_tags`	             | Optional    | Defines a list of tags to be applied to the application servers ||

### SAP Central Services Parameters


| Variable                              | Type        | Description                             | Notes  |
| ------------------------------------- | ----------- | --------------------------------------- | ------ |
| `scs_high_availability`	            | Optional	  | Defines if the Central Services is highly available ||
| `scs_instance_number`	                | Optional    | The instance number of SCS ||
| `ers_instance_number`	                | Optional	  | The instance number of ERS ||
| `scs_server_count`	                | Required	  | Defines the number of scs servers | |
| `scs_server_sku`	                    | Optional    | Defines the Virtual machine SKU to use | | 
| `scs_server_image`	                | Required    | Defines the Virtual machine image to use| | 
| `scs_server_zones`	                | Optional    | Defines the availability zones to which the scs servers are deployed | | 
| `scs_server_app_nic_ips[]`            | Optional    | List of IP addresses for the scs server (app subnet) | Ignored if `app_tier_use_DHCP` is used |
| `scs_server_app_admin_nic_ips`        | Optional    | List of IP addresses for the scs server (admin subnet) | Ignored if `app_tier_use_DHCP` is used |
| `scs_server_no_ppg`                   | Optional    | Controls if the 'scs' servers will not be placed in a proximity placement group ||
| `scs_server_no_avset`	                | Optional    | Defines that the scs servers machines will not be placed in an availability set ||
| `scs_server_tags`	                    | Optional    | Defines a list of tags to be applied to the scs servers ||

### Web Dispatcher Parameters


| Variable                                 | Type        | Description                             | Notes  |
| ---------------------------------------- | ----------- | --------------------------------------- | ------ |
| `webdispatcher_server_count`	           | Required	 | Defines the number of web dispatcher servers | |
| `webdispatcher_server_sku`	           | Optional    | Defines the Virtual machine SKU to use | | 
| `webdispatcher_server_image`	           | Optional    | Defines the Virtual machine image to use| | 
| `webdispatcher_server_zones`	           | Optional    | Defines the availability zones to which the web dispatcher servers are deployed | | 
| `webdispatcher_server_app_nic_ips[]`     | Optional    | List of IP addresses for the web dispatcher server (app subnet) | Ignored if `app_tier_use_DHCP` is used |
| `webdispatcher_server_app_admin_nic_ips` | Optional    | List of IP addresses for the web dispatcher server (admin subnet) | Ignored if `app_tier_use_DHCP` is used |
| `webdispatcher_server_no_ppg`            | Optional    | Controls if the web dispatchers will not be placed in a proximity placement group ||
| `webdispatcher_server_no_avset`	       | Optional    | Defines if the web dispatcher servers machines will not be placed in an availability set ||
| `webdispatcher_server_tags`	           | Optional    | Defines a list of tags to be applied to the web dispatcher servers ||

### Anchor Virtual Machine Parameters

The SAP Deployment Automation Framework supports having an Anchor Virtual Machine. The anchor Virtual machine will be the first virtual machine to be deployed and is used to anchor the proximity placement group.

The table below contains the parameters related to the anchor virtual machine. 


| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| `deploy_anchor_vm`                 | Optional	   | Defines if the anchor Virtual Machine is used|
| `anchor_vm_sku`                    | Optional    | Defines the Virtual machine SKU to use, for example	Standard_D4s_v3 | 
| `anchor_vm_image`	                 | Optional	   | Defines the Virtual machine image to use, see below | 
| `anchor_vm_use_DHCP`               | Optional    | Controls if Azure subnet provided IP addresses should be used (dynamic) true |
| `anchor_vm_accelerated_networking` | Optional    | Defines if the Anchor Virtual machine is configured to use accelerated networking |
| `anchor_vm_authentication_type`    | Optional	   | Defines the authentication type for the anchor virtual machine key/password|

The Virtual Machine and the operating system image is defined using the following structure: 
```python 
{ 
os_type=""
source_image_id=""
publisher="Canonical"
offer="0001-com-ubuntu-server-focal"
sku="20_04-lts"
version="latest"
}
```

### Authentication Parameters

By default the SAP System deployment uses the credentials from the SAP Workload zone. If the SAP system needs unique credentials, you can provide them using these parameters.


| Variable                         | Type         | Description                           | 
| -------------------------------- | ------------ | ------------------------------------- | 
| `automation_username`            | Optional	  | Administrator account name |
| `automation_password`            | Optional     | Administrator password |
| `automation_path_to_public_key`  | Optional     | Path to existing public key used for authentication |
| `automation_path_to_private_key` | Optional     | Path to existing private key used for authentication |


## Other Parameters


| Variable                                       | Type        | Description                           | Notes  |
| ---------------------------------------------- | ----------- | ------------------------------------- | ------ |
| `resource_offset`                              | Optional    | Provides and offset for resource naming | The offset number for resource naming when creating multiple resources. The default value is `0`, which creates a naming pattern of `disk0`, `disk1`, and so on. An offset of `1` creates a naming pattern of `disk1`, `disk2`, and so on. |
| `disk_encryption_set_id`                       | Optional    | The disk encryption key to use for encrypting managed disks using customer provided keys|
| `use_loadbalancers_for_standalone_deployments' | Optional    | Controls if load balancers are deployed for standalone installations |

## Azure NetApp Support


| Variable                           | Type        | Description                           | Notes  |
| ---------------------------------- | ----------- | ------------------------------------- | ------ |
| `use_ANF`                          | Optional    | If specified, deploys the Azure NetApp Files Account and Capacity Pool  | 
| `anf_sapmnt_volume_size`           | Optional    | Defines the size (in GB) for the 'sapmnt' volume | |
| `anf_transport_volume_size`        | Optional    | Defines the size (in GB) for the 'sapmnt' volume | |


## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP System](automation-deploy-system.md)

