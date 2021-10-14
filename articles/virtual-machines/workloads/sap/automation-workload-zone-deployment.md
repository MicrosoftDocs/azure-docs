---
title: About workload zone deployment in automation framework
description: Overview of the SAP workload zone deployment process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Workload zone deployment in SAP automation framework

An [SAP application](automation-deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. The SAP deployment automation framework refers to these tiers as [workload zones](automation-deployment-framework.md#deployment-components).

A workload zone combines a virtual network, credentials for [SAP systems](automation-deployment-framework.md#sap-concepts), and a service principal for deploying systems.

You can use workload zones in multiple Azure regions. Each workload zone then has its own Azure Virtual Network (Azure VNet)

The following services are available in a workload zone:

- Azure VNet, including subnets and network security groups.
- Azure Key Vault, for system credentials.
- Storage accounts for boot diagnostics
- Storage accounts for cloud witnesses

## Configure workload zones

The automation framework uses the parameters you define for each workload zone in a JSON file.

The root nodes include:

| Node | Description |
| ---- | ----------- |
| `infrastructure` | Defines the resource group and networking information. |
| `key_vault` | Defines key vault settings for the system. |
| `authentication` | Defines authentication settings for the system. |
| `options` | Optional. Defines special settings for the environment. |

## Parameters

You can configure the following parameters for your workload zone. For reference, see the [example parameter file with required parameters only](#example-parameter-file-required-parameters-only) and the [example parameter file with all possible parameters](#example-parameter-file-all-parameters)

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Required | `infrastructure.` | `environment` | Designates the workload zone type. The value can be up to five characters. For example, `PROD` for production environments and `NP` for non-production environments. You can also identify environments by a unique Service Principal Name (SPN) or subscription identifier. |
| Required | `infrastructure.` | `region` | Specifies the Azure region in which you're deploying the workload zone. |
| Optional | `infrastructure.resource_group.` | `arm_id` | Specifies the identifier of the Azure resource group for deployment. |
| Optional | `infrastructure.resource_group.` | `name` | Specifies the name of a new resource group to create and use for deployment. |
| Required | `infrastructure.vnets.sap.` | `name` | Specifies the logical name of the virtual network that you're creating. The automation framework's naming convention constructs the full virtual network name based on this value. For example, `SAP01` becomes `NP-WEEU-SAP01-vnet`. |
| Optional | `infrastructure.vnets.sap.` | `arm_id` | Specifies the identifier of the Azure resource group for deployment. If you already set the attribute `arm_id` in the node `infrastructure.resource_group.`, the framework uses that resource group identifier unless you specify another value. |
| Required in certain cases | `infrastructure.vnets.sap.` | `address_space` | Specifies the address space of the virtual network you want to use. Required if the `arm_id` attribute is empty for the nodes `infrastructure.vnets.sap.` and `infrastructure.resource_group.`. |
| Optional | `infrastructure.vnets.sap.subnet_admin.` | `name` | Specifies the name of the administrator subnet. |
| Optional | `infrastructure.vnets.sap.subnet_admin.` | `arm_id` | Specifies the resource identifier of the administrator subnet. |
| Optional | `infrastructure.vnets.sap.subnet_admin.` | `prefix` | Creates a subnet within the virtual network address space. Supports up to 126 servers. The recommended CIDR prefix is `/25`. However, you must size the CIDR appropriately for your expected usage. |
| Optional | `infrastructure.vnets.sap.subnet_db` | `name` | Specifies the name of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_db` | `arm_id` | Specifies the resource identifier of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_db` | `prefix` | Creates a subnet within the virtual network address space. Supports up to 126 servers. The recommended CIDR prefix is `/25`. However, you must size the CIDR appropriately for your expected usage. |
| Optional | `infrastructure.vnets.sap.subnet_app` | `name` | Specifies the name of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_app` | `arm_id` | Specifies the resource identifier of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_app` | `prefix` | Creates a subnet within the virtual network address space. Supports up to 126 servers. The recommended CIDR prefix is `/25`. However, you must size the CIDR appropriately for your expected usage. |
| Optional | `infrastructure.vnets.sap.subnet_web` | `name` | Specifies the name of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_web` | `arm_id` | Specifies the resource identifier of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_web` | `prefix` | Creates a subnet within the virtual network address space. Supports up to 126 servers. The recommended CIDR prefix is `/25`. However, you must size the CIDR appropriately for your expected usage. |
| Optional | `infrastructure.vnets.sap.subnet_iscsi.` | `name` | Specifies the name of the database subnet. |
| Optional | `infrastructure.vnets.sap.subnet_iscsi.` | `prefix` | Creates a subnet within the virtual network address space. Supports up to 12 servers. The recommended CIDR prefix is `/28`. However, you must size the CIDR appropriately for your expected usage. |
| Optional | `infrastructure.iscsi.` | `iscsi_count` | Specifies the number of Internet Small Computer System Interface (iSCSI) devices to create. |
| Optional | `infrastructure.iscsi.` | `use_DHCP` | Determines whether VMs get their IP addresses from the Azure subnet. Default setting is `false`; to enable this setting, change value to `true`. |
| Optional | `key_vault.` | `kv_user_id` | Specifies the resource identifier of a key vault to use. |
| Optional | `key_vault.` | `kv_prvt_id` | Specifies the resource identifier of a private key vault to use. |
| Optional | `key_vault.` | `kv_spn_id` | Specifies the resource identifier of a private key vault that contains SPN details. |
| Optional | `key_vault.` | `kv_sid_sshkey_prvt` | Specifies the path to a private SSH key to be stored in the key vault. |
| Optional | `key_vault.` | `kv_sid_sshkey_pub` | Specifies the path to a public key to be stored in the key vault. |
| Optional | `key_vault.` | `kv_iscsi_username` | Specifies the iSCSI username to be stored in the key vault. |
| Optional | `key_vault.` | `kv_iscsi_sshkey_prvt` | Specifies the path to a private SSH key file for iSCSI to be stored in the key vault.  |
| Optional | `key_vault.` | `kv_iscsi_sshkey_pub` | Specifies the path to a public SSH key file for iSCSI to be stored in the key vault. |
| Optional | `key_vault.` | `kv_iscsi_pwd` | Specifies the password for an iSCSI account to be stored in the key vault. |
| Optional | `authentication.` | `username` | Specifies the default username for the environment. |
| Optional | `authentication.` | `password` | Specifies the default password for the environment. If you don't specify a value, Terraform creates and stores a password in the key vault. |
| Optional | `authentication.` | `path_to_public_key` | Specifies the path to a public SSH key file to be stored in the key vault. If you don't specify a value, Terraform creates and stores a public SSH key in the key vault. |
| Optional | `authentication.` | `path_to_private_key` | Specifies the path to a private SSH key file to be stored in the key vault. If you don't specify a value, Terraform creates and stores a private SSH key in the key vault. |
| Optional | `diagnostics_storage_account` | `arm_id` | Specifies the resource identifier of a storage account that contains the boot diagnostics for the virtual machines. |
| Optional | `witness_storage_account` | `arm_id` | Specifies the resource identifier of a storage account to be used for the cloud witness data. |
| Required | `tfstate_resource_id` | `Remote State` | Specifies the resource identifier for the storage account where state files are located. Typically, the SAP Library execution unit deploys these files. |
| Required | `deployer_tfstate_key` | `Remote State` | Specifies the deployer state file name. This value is case-sensitive. |

## Example parameter file (required parameters only)

The following example parameter file shows only required parameters.

```json
{
  "infrastructure": {
    "environment"                     : "NP",
    "region"                          : "eastus2",
    "vnets": {
      "sap": {
        "name"                        : "SAP01",
        "address_space"               : "10.1.0.0/16"
      }
    }
  },
  "tfstate_resource_id"               : "",
  "deployer_tfstate_key"              : ""

}
```

## Example parameter file (all parameters)

The following example parameter file shows all possible parameters.

```json
{
	"infrastructure": {
		"environment": "NP",
		"region": "eastus2",
		"resource_group": {
			"arm_id": "",
			"name": ""
		},
		"vnets": {
			"sap": {
				"name": "SAP01",
				"arm_id": "",
				"address_space": "0.0.0.0/00",
				"subnet_admin": {
					"name": "",
					"arm_id": "",
					"prefix": "0.0.0.0/00",
					"nsg": {
						"name": "",
						"arm_id": ""
					}
				},
				"subnet_db": {
					"name": "",
					"arm_id": "",
					"prefix": "0.0.0.0/00",
					"nsg": {
						"name": "",
						"arm_id": ""
					}
				},
				"subnet_app": {
					"name": "",
					"arm_id": "",
					"prefix": "0.0.0.0/00",
					"nsg": {
						"name": "",
						"arm_id": ""
					}
				},
				"subnet_web": {
					"name": "",
					"arm_id": "",
					"prefix": "0.0.0.0/00",
					"nsg": {
						"name": "",
						"arm_id": ""
					}
				},
				"subnet_iscsi": {
					"name": "",
					"prefix": "0.0.0.0/00"
				}
			}
		},
		"iscsi": {
			"iscsi_count": 3,
			"use_DHCP": false
		}
	},
	"key_vault": {
		"kv_user_id": "",
		"kv_prvt_id": "",
		"kv_spn_id": "",
		"kv_sid_sshkey_prvt": "",
		"kv_sid_sshkey_pub": "",
		"kv_iscsi_username": "",
		"kv_iscsi_sshkey_prvt": "",
		"kv_iscsi_sshkey_pub": "",
		"kv_iscsi_pwd": ""
	},
	"authentication": {
		"username": "myUsername",
		"password": "myPassword",
		"path_to_public_key": "sshkey.pub",
		"path_to_private_key": "sshkey"
	},

	"options": {},
	"diagnostics_storage_account": {
		"arm_id": ""
	},
	"witness_storage_account": {
		"arm_id": ""
	},
	"tfstate_resource_id": "",
	"deployer_tfstate_key": ""
}
```

## Next steps

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](automation-system-deployment.md)
