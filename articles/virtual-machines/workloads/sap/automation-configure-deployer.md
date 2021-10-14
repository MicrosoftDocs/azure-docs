---
title: Configure deployment infrastructure for automation 
description: Configure your deployer for the SAP automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure deployer for automation

The [deployer](automation-deployment-framework.md#deployment-artifacts) is an important part of the [SAP automation framework](automation-deployment-framework.md). The deployer is a virtual machine (VM) that executes Terraform and Ansible commands. Configuration for the deployer happens in a parameters file. You create a JSON file with your deployer settings, which the automation framework uses for deployment.

Your deployer's parameter file contains multiple sections. One important section is the infrastructure (`infrastructure`), which sets the Azure region and Azure Virtual Network (Azure VNet) information for your deployer. You create a new virtual network for your deployer, or use an existing virtual network. Another important section is the Azure Key Vault settings (`key_vault`). If you want to use existing key vaults with your deployer, instead of having Terraform create new key vaults, you can add your authentication information to this section.

## Parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Required | `infrastructure.` | `environment` | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. You can also use a unique Service Principal Name (SPN) or subscription identifier. | 
| Required | `infrastructure.` | `region` | The Azure region in which to deploy. |
| Optional | `infrastructure.resource_group.` | `arm_id` | The Azure resource identifier of the resource group to use for deployment. |
| Optional | `infrastructure.resource_group.` | `name` | The name of the resource group to create and use for deployment. |
| Required, in some cases | `infrastructure.vnets.management` | `arm_id` | The identifier of the virtual network to use. Required if you don't provide the parameter `name` in this node.  |
| Required, in some cases | `infrastructure.vnets.management` | `name` | The logical identifier of the virtual network to use. Required if you don't provide the parameter `arm_id` in this node. |
| Required | `infrastructure.vnets.management` | `address_space` | The CIDR of the virtual network address space. The recommended CIDR value is `/27`, which allows space for 32 IP addresses. A CIDR value of `/28` only allows 16 IP addresses. If you want to include Azure Firewall, use a CIDR value of `/25`, because Azure Firewall requires a range of `/26`. |
| Required, in some cases | `infrastructure.vnets.management.subnet_mgmt` |  `arm_id` | The identifier of the subnet to use. Required if you don't provide the parameter `name` in this node.  |
| Required, in some cases | `infrastructure.vnets.management.subnet_mgmt` | `name` | The name of the subnet to use. Required if you don't provide the parameter `arm_id` in this node. |
| Required | `infrastructure.vnets.management.subnet_mgmt` | `prefix` | The CIDR of the deployer subnet. The recommended CIDR value is `/28` that allows 16 IP addresses. |
| Required, in some cases | `infrastructure.vnets.management.subnet_fw` | `arm_id` | The identifier of the subnet to use with Azure Firewall. This parameter is required if you don't provide the parameter `prefix` in this node. |
| Required, in some cases | `infrastructure.vnets.management.subnet_fw` | `prefix` | The CIDR of the deployer subnet. The recommended CIDR value is `/26`. This parameter is required if you don't provide the parameter `arm_id` in this node. |
| Optional | `key_vault.` | `kv_user_id` | The identifier of the key vault to use. |
| Optional | `key_vault.` | `kv_prvt_id` | The identifier of the private key vault to use. |
| Optional | `key_vault.` | `kv_spn_id` | The identifier of the private key vault to use that contains the SPN details. |
| Optional | `key_vault.` | `kv_sshkey_prvt` | The private SSH key to use. Not required in a standard deployment. |
| Optional | `key_vault.` | `kv_sshkey_pub` | The public SSH key to use. Not required in a standard deployment. |
| Optional | `key_vault.` | `kv_username` | The username for the key vault to use. Not required in a standard deployment. |
| Optional | `key_vault.` | `kv_pwd` | The password for the key vault to use. Not required in a standard deployment. |
| Optional | `authentication` | `path_to_public_key` | The path to the public key to use. Not required in a standard deployment. |
| Optional | `authentication` | `path_to_private_key` | The path to the public key to use. Not required in a standard deployment. |
| Optional | `options` | `enable_deployer_public_ip` | A boolean flag to set whether the deployer VM has a public IP address. The default setting is `false`. Not required in a standard deployment. |
| Optional | `firewall_deployment` | | A boolean flag to set whether the deployment uses an Azure Firewall. The default setting is `false`. To enable Azure Firewall, change the value to `true`. |

## Example parameters file (required parameters only)

```json
{
	"infrastructure": {
		"environment": "NP",
		"region": "eastus2",
		"vnets": {
			"management": {
				"name": "DEP00",
				"address_space": "0.0.0.0/00",
				"subnet_mgmt": {
					"prefix": "0.0.0.00/00"
				}
			}
		}
	}
}
```

## Example parameters file (all parameters)

```json
  {
  	"infrastructure": {
  		"environment": "NP",
  		"region": "eastus2",
  		"vnets": {
  			"management": {
  				"name": "DEP00",
  				"address_space": "0.0.0.0/00",
  				"subnet_mgmt": {
  					"prefix": "0.0.0.16/00"
  				},
  				"subnet_fw": {
  					"prefix": "0.0.0.00/00"
  				}
  			}
  		}
  	},
  	"key_vault": {
  		"kv_user_id": "",
  		"kv_prvt_id": "",
  		"kv_spn_id": "",
  		"kv_sshkey_prvt": "",
  		"kv_sshkey_pub": "",
  		"kv_username": "",
  		"kv_pwd": ""
  	},
  	"authentication": {
  		"username": "azureadm",
  		"password": "",
  		"path_to_public_key": "sshkey.pub",
  		"path_to_private_key": "sshkey"
  	},
  	"options": {
  		"enable_deployer_public_ip": false
  	},
  	"firewall_deployment": true
  }
```

## Next steps

> [!div class="nextstepaction"]
> [Configure SAP system](automation-configure-system.md)
