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

Configuration for the [SAP deployment automation framework](automation-deployment-framework.md)] happens through parameters files. You provide information about your SAP system properties in a JSON file, which the automation framework uses for deployment. 

## Root node types

You can define the following types of root nodes in your parameters file. The infrastructure, application, and database root nodes are required.

| Type | Node | Description |
| ---- | ---- | ----------- |
| Required | `infrastructure` | Defines the resource group and networking information. |
| Required | `application` | Defines attributes for the application tier. For example, the number of virtual machines (VMs), or what VM images to use. |
| Required | `database` | Defines attributes for the database tier. |
| Optional | `authentication` | Defines authentication details for the system. The default settings use information from the workload zone's key vault in Azure Key Vault. |
| Optional | `options` | Defines special settings for the environment. |

## Parameters

The following tables include required and optional parameters for: 

- The [SAP system's infrastructure](#infrastructure-parameters)
- The [database tier](#database-tier-parameters)
- The [application tier](#application-tier-parameters)
- The [authentication process](#authentication-parameters).

### Infrastructure parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Required | `infrastructure.` | `environment` | Five-character name for the workload tier. For example, `PROD` for a production environment and `NP` for a non-production environment. You can also use a unique Service Principal Name (SPN) or an Azure subscription identifier. |
| Required | `infrastructure.` | `region` | Specifies the Azure region in which you're deploying the system. |
| Optional | `infrastructure.resource_group.` | `arm_id` | The Azure resource identifier of the resource group that you want to use for the deployment. |
| Optional | `infrastructure.resource_group.` | `name` | The name of the resource group that you want to create and use for the deployment. |
| Optional | `infrastructure.anchor_vms.` | `sku` | Populated when it's necessary to have an anchor VM to tie the proximity placement groups to a specific zone. |
| Optional | `infrastructure.anchor_vms.` | `accelerated_networking` | A boolean flag that determines if an anchor VM uses accelerated networking. The default setting is `false`. |
| Optional | `infrastructure.anchor_vms.`| `nic_ips` | The list of IP addresses that anchor VMs can use. The number of list entries must equal the total Azure Availability Zone count for all VMs in the deployment. Not needed if `use_DCHP` is set to `true`. |
| Optional | `infrastructure.anchor_vms.`| `use_DHCP` | A boolean flag that determines if the subnet provides the IP addresses for the VMs. The default setting is `false`. |
| Optional | `infrastructure.anchor_vms.authentication.` | `type` | The authentication type for an anchor VM. The value can be a key or password. |
| Optional | `infrastructure.anchor_vms.os.` | `publisher` | The Azure Marketplace publisher of the VM image. |
| Optional | `infrastructure.anchor_vms.os.` | `offer` | The Azure Marketplace image offer. |
| Optional | `infrastructure.anchor_vms.os.` | `sku` | The Azure Marketplace image SKU. |
| Required, in some cases | `infrastructure.vnets.sap.subnet_admin` | `arm_id` | The Azure resource identifier for the administrator subnet. Required if there's no `name` parameter for this node. |
| Required, in some cases | `infrastructure.vnets.sap.subnet_admin` | `name` | The name of the administrator subnet to create and use. Required if there's no `arm_id` parameter for this node. |
| Required | `infrastructure.vnets.sap.subnet_admin` | `prefix` | The address prefix of the administrator subnet. |
| Required, in some cases | `infrastructure.vnets.sap.subnet_app` | `arm_id` | The Azure resource identifier for the application subnet. Required if there's no `name` parameter for this node. |
| Required, in some cases | `infrastructure.vnets.sap.subnet_app` | `name` | The name of the application subnet to create and use. Required if there's no `arm_id` parameter for this node. |
| Required | `infrastructure.vnets.sap.subnet_app` | `prefix` | The address prefix of the application subnet. |
| Required, in some cases | `infrastructure.vnets.sap.db` | `arm_id` | The Azure resource identifier for the database subnet. Required if there's no `name` parameter for this node. |
| Required, in some cases | `infrastructure.vnets.sap.db` | `name` | The name of the database subnet to create and use. Required if there's no `arm_id` parameter for this node. |
| Required | `infrastructure.vnets.sap.db` | `prefix` | The address prefix of the database subnet. |
| Required, in some cases | `infrastructure.vnets.sap.web` | `arm_id` | The Azure resource identifier for the web dispatcher subnet. Required if there's no `name` parameter for this node. |
| Required, in some cases | `infrastructure.vnets.sap.web` | `name` | The name of the web dispatcher subnet to create and use. Required if there's no `arm_id` parameter for this node. |
| Required | `infrastructure.vnets.sap.web` | `prefix` | The address prefix of the web dispatcher subnet. |
| Optional | `options.` | `resource_offset` | The offset number for resource naming when creating multiple resources. The default value is `0`, which creates a naming pattern of `disk0`, `disk1`, and so on. An offset of `1` creates a naming pattern of `disk1`, `disk2`, and so on.
| Optional | `options.` | `disk_encryption_set_id` | The disk encryption key to use for encrypting managed disks. |
| Required | `tfstate_resource_id` | None | The resource identifier for the storage account in which you want to store the state files. Typically, the SAP Library execution unit deploys these files. |
| Required | `deployer_tfstate_key` | `Remote State` | The file name of the deployer state file. This parameter is case-sensitive. |
| Required | `landscape_tfstate_key` | `Remote State` | The file name of the landscape state file. This parameter is case-sensitive. |

### Database tier parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Required | `databases.[].` | `platform` | The backend database type. Valid values are `HANA`, `DB2`, `ORACLE`, `SQLSERVER`, `ASE`, or `NONE`. If you specify `NONE`, no database tier is deployed. |
| Optional | `databases.[].` | `high_availability` | A boolean flag that determines whether the automation framework deploys extra servers. If true, the framework deploys twice the number of servers as defined in the count for the node. |
| Required | `databases.[].` | `size` | Maps to the disk sizing. For HANA, use the VM SKU; for example, `M32` or `M128ms`. For AnyDB, use the size of the database in GB; values include `200`, `500`, `1024`, `2048`, `5120`, `10240`, `15360`, `20480`, `30720`, `40960`, `51200`. You can also set custom disk sizing if necessary. |
| Optional | `databases.[].` | `zones` | A list of Availability Zones into which you want to deploy the VMs. |
| Optional | `databases.[].` | `avset_arm_ids.[]` | The name of the availability set into which you're deploying the VMs. |
| Optional | `databases.[].` | `use_DHCP` | A boolean flag that determines if the subnet provides the IP addresses for the VMs. The default setting is `false`. |
| Required, in some cases | `databases.[].os.` | `os_type` | The OS type. Required if using the `source_image_id` parameter to specify a custom image. |
| Required, in some cases | `databases.[].os.` | `source_image_id` | The resource identifier for a custom image to use. Required if you're not using a published VM image. |
| Required, in some cases | `databases.[].os.` | `publisher` | The publisher of the VM image you want to use. Required if you're not using a custom image. |
| Required, in some cases | `databases.[].os.` | `offer` | The offer identifier for the VM image. Required if you're not using a custom image. |
| Required, in some cases | `databases.[].os.` | `sku` | The SKU for the VM image. Required if you're not using a custom image. |
| Optional | `databases.[].dbnodes.[].` | `name` | The name of the VM. |
| Optional | `databases.[].dbnodes.[].` | `db_nic_ips.[]` | The IP addresses of the `db nic` VM. |
| Optional | `databases.[].dbnodes.[].` | `admin_nic_ips.[]` | The IP addresses of the `admin nic` VM. |
| Optional | `databases.[].loadbalancer.` |	`frontend_ip` | The IP address of the load balancer. |
| Optional | `db_disk_sizes_filename` | None | The custom disk sizing JSON file for the database tier. |


### Application tier parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Optional | `application.` | `enable_deployment` | A boolean flag that determines whether to deploy the application tier. |
| Required | `application.` | `sid` | The SAP application identifier. |
| Optional | `application.` | `application_server_count` | The number of application servers to deploy. |
| Optional | `application.` | `app_zones` | A list of Availability Zones into which to deploy the VMs. |
| Optional | `application.` | `app_sku` | The VM SKU to use. |
| Optional | `application.` | `dual_nics` | A boolean flag that determines whether to deploy the application tier with dual network cards. |
| Optional | `application.` | `app_nic_ips[]` | A list of IP addresses for the application subnet VM. |
| Optional | `application.` | `app_admin_nic_ips[]` | A list of IP addresses for the administrator subnet VM. |
| Optional | `application.` | `use_DHCP` | A boolean flag that determines if the subnet provides IP addresses for the VMs. The default setting is `false`. |
| Optional | `application.web_os.` | `os_type` | The OS type. Required if you provide a custom image identifier. |
| Optional | `application.web_os.` | `source_image_id` | The resource identifier of a custom image to use. Required if you don't provide a published VM image to use with the parameter `publisher` in this node. |
| Optional | `application.web_os.` | `publisher` | The publisher of an image to use for the VM. Required if you don't provide parameters for a custom image in this node. |
| Optional | `application.web_os.` | `offer` | The offer identifier of  a VM image to use. Required if you don't provide parameters for a custom image in this node. |
| Optional | `application.web_os.` | `sku` | The SKU of a VM image to use. Required if you don't provide parameters for a custom image in this node. |
| Optional | `app_disk_sizes_filename` | None | The custom disk sizing JSON file for the application tier. |

### Authentication parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Optional | `application.authentication.` | `type` | The authentication type for the VM. Valid values are `Password` or `Key`. |
| Optional | `authentication.` | `username` | The default username for the environment. |
| Optional | `authentication.` | `password` | The password for the environment. If not specified, Terraform creates and stores a password in the key vault. |
| Optional | `authentication.` | `path_to_public_key` | The path to the SSH public key file. If not specified, Terraform creates and stores a public key file in the key vault. |
| Optional | `authentication.` | `path_to_private_key` | The path to the SSH private key file. If not specified, Terraform creates and stores a private key file in the key vault. |
| Optional | `key_vault.` | `kv_user_id` | The resource identifier for the key vault to use. |
| Optional | `key_vault.` | `kv_prvt_id` | The resource identifier for the private key vault to use. |
| Optional | `key_vault.` | `kv_spn_id` | The resource identifier of the private key vault to use, that contains SPN details. |

## Example parameters file (required parameters only)

This example JSON file includes only the required parameters. Replace all values as needed for your configuration.

```json
{
	"infrastructure": {
		"environment": "NP",
		"region": "eastus2",
		"vnets": {
			"sap": {
				"name": "SAP-01"
			}
		}
	},
	"databases": [{
		"platform": "HANA",
		"high_availability": false,
		"db_version": "2.00.050",
		"size": "Demo",
		"os": {
			"publisher": "SUSE",
			"offer": "sles-sap-12-sp5",
			"sku": "gen1"
		}
	}],
	"application": {
		"enable_deployment": true,
		"sid": "PRD",
		"scs_instance_number": "00",
		"ers_instance_number": "10",
		"scs_high_availability": false,
		"application_server_count": 3,
		"webdispatcher_count": 1
	},
	"options": {},
	"tfstate_resource_id": "",
	"deployer_tfstate_key": "",
	"landscape_tfstate_key": ""
}
```

## Example parameters file (all parameters)

The following example parameters file shows all possible parameters. Replace all values as needed for your configuration.

```json
{
	"infrastructure": {
		"environment": "NP",
		"region": "eastus2",
		"resource_group": {
			"name": "NP-EUS2-SAP-PRD",
			"arm_id": ""
		},
		"anchor_vms": {
			"sku": "Standard_D4s_v4",
			"authentication": {
				"type": "key"
			},
			"accelerated_networking": true,
			"os": {
				"publisher": "SUSE",
				"offer": "sles-sap-12-sp5",
				"sku": "gen1"
			},
			"nic_ips": ["", "", ""],
			"use_DHCP": false
		},
		"vnets": {
			"sap": {
				"arm_id": "",
				"name": "",
				"address_space": "10.1.0.0/16",
				"subnet_db": {
					"prefix": "10.1.1.0/28"
				},
				"subnet_web": {
					"prefix": "10.1.1.16/28"
				},
				"subnet_app": {
					"prefix": "10.1.1.32/27"
				},
				"subnet_admin": {
					"prefix": "10.1.1.64/27"
				}
			}
		}
	},
	"databases": [{
		"platform": "HANA",
		"high_availability": false,
		"db_version": "2.00.050",
		"size": "Demo",
		"os": {
			"publisher": "SUSE",
			"offer": "sles-sap-12-sp5",
			"sku": "gen1"
		},
		"zones": ["1"],
		"avset_arm_ids": [
			""
		],
		"use_DHCP": false,
		"loadbalancer": {
			"frontend_ip": "10.1.1.5"
		},
		"dbnodes": [{
			"name": "dbserver",
			"db_nic_ips": ["10.1 .1 .1, 10.1 .1 .2"],
			"admin_nic_ips": ["10.1 .1 .65, 10.1 .1 .66"]
		}]
	}],
	"application": {
		"enable_deployment": true,
		"sid": "PRD",
		"application_server_count": 2,
		"app_sku": "Standard_E4ds_v4",
		"dual_nics": true,
		"app_zones": ["1", "2"],
		"app_nic_ips": ["10.1.1.33", "10.1.1.34"],
		"app_admin_nic_ips": ["10.1.1.67", "10.1.1.68"],
		"os": {
			"os_type": "Linux",
			"offer": "sles-sap-12-sp5",
			"publisher": "SUSE",
			"sku": "gen2",
			"version": "latest"
		},
		"scs_high_availability": false,
		"scs_server_count": 1,
		"scs_instance_number": "00",
		"ers_instance_number": "10",
		"scs_sku": "Standard_E4ds_v4",
		"scs_zones": ["1"],
		"scs_nic_ips": ["10.1.1.35", "10.1.1.36"],
		"scs_admin_nic_ips": ["10.1.1.69", "10.1.1.70"],
		"scs_lb_ips": ["10.1.1.37"],
		"scs_os": {
			"os_type": "Linux",
			"offer": "sles-sap-12-sp5",
			"publisher": "SUSE",
			"sku": "gen2",
			"version": "latest"
		},
		"webdispatcher_count": 1,
		"web_sku": "Standard_E4ds_v4",
		"web_zones": ["1"],
		"web_nic_ips": ["10.1.1.17"],
		"web_admin_nic_ips": ["10.1.1.72"],
		"web_lb_ips": ["10.1.1.18"],
		"web_os": {
			"os_type": "Linux",
			"offer": "sles-sap-12-sp5",
			"publisher": "SUSE",
			"sku": "gen2",
			"version": "latest"
		},
		"use_DHCP": false,
		"authentication": {
			"type": "password"
		}
	},
	"authentication": {
		"username": "azureadm",
		"password": "",
		"path_to_public_key": "sshkey.pub",
		"path_to_private_key": "sshkey"
	},
	"options": {
		"resource_offset": 0,
		"disk_encryption_set_id": ""
	},
	"tfstate_resource_id": "",
	"deployer_tfstate_key": "",
	"landscape_tfstate_key": "",
	"app_disk_sizes_filename": "custom_size_app.json",
	"db_disk_sizes_filename": "custom_size_db.json"

}
```

## Next steps

> [!div class="nextstepaction"]
> [Configure SAP Library](automation-configure-controlplane.md)

