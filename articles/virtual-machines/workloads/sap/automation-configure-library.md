---
title: Configure SAP Library for automation
description: Explanation of SAP library infrastructure in the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure SAP library for automation

 Configuration of your SAP Library, which is required for the [SAP deployment automation framework](automation-deployment-framework.md), happens in parameter files. You create a JSON file to define your SAP Library settings, based on your environment. The parameters file contains multiple sections. The most important part is the infrastructure settings (`infrastructure`), which define the Azure region for your SAP library. The Azure Key Vault settings (`key_vault`) specify which key vaults to use, which is important if you want to use existing key vaults. Otherwise, Terraform creates new key vaults for this purpose.

## Parameters

| Type | Node | Attribute | Description |
| ---- | ---- | --------- | ----------- |
| Required | `infrastructure.` | `environment` | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. You can also identify environments by a unique Service Principal Name (SPN) or subscription. |
| Required | `infrastructure.` | `region` |  The Azure region in which to deploy the SAP Library. |
| Optional | `infrastructure.resource_group.` | `arm_id` | The Azure resource identifier for the resource group to use for deployment. |
| Optional | `infrastructure.resource_group.` | `name` | The name of the resource group that you want to create and use. |
| Required | `deployer.` | `environment` | The identifier for the [deployer's](automation-deployment-framework.md#deployment-artifacts) environment. Typically, this value is the same as `infrastructure.environment.`. For multi-subscription scenarios, set to a different value as needed. |
| Required | `deployer.` | `region` | The Azure region that your deployer is in. |
| Required | `deployer.` | `vnet` | The designator for your deployer's virtual network. |
| Optional | `deployer.` | `use` | A flag to control if the deployment includes a deployer. |
| Optional | `key_vault.` | `kv_user_id` | The Azure Key Vault resource identifier for the key vault to use. |
| Optional | `key_vault.` | `kv_prvt_id` | The resource identifier of the private key vault to use. |
| Optional | `key_vault.` | `kv_spn_id` | The resource identifier of the private key vault to use that contains Service Principal Name (SPN) details. |
| Optional | `storage_account_sapbits.` | `arm_id` | The resource identifier of the storage account in which to store the SAP binaries. |
| Required | `storage_account_sapbits.file_share.` | `is_existing` | Boolean flag for whether the file share for the SAP media already exists (`true`) or not (`false`). |
| Required | `storage_account_sapbits.sapbits_blob_container.` | `is_existing` | Boolean flag to set whether the Azure Blob Storage container already exists (`true`) or not (`false`). |
| Optional | `storage_account_tfstate.` | `arm_id` | The resource identifier for the storage account in which to store the Terraform state files. |
| Optional | `tfstate_resource_id` | `Remote State` | The resource identifier for the storage account in which to store state files. Typically, the SAP Library execution unit deploys this storage account. The value for this setting is case-sensitive. Use this parameter to move from a local deployment to a remote state file deployment during reinitialization. 
| Optional | `deployer_statefile_foldername` | `Local State` | The relative path from the folder that contains the SAP library JSON parameter file to the folder that contains the deployer's Terraform state file. |

## Example parameter file (required parameters only)

```json
  {
    "infrastructure": {
      "environment"                     : "NP",
      "region"                          : "eastus2"
    },
    "deployer": {
      "environment"                     : "NP",
      "region"                          : "eastus2",
      "vnet"                            : "DEP00"
    }
  }

```

## Example parameter file (all parameters)

```json
{
	"infrastructure": {
		"environment": "NP",
		"region": "eastus2"
	},
	"deployer": {
		"environment": "NP",
		"region": "eastus2",
		"vnet": "DEP00",
		"use": true
	},
	"key_vault": {
		"kv_user_id": "",
		"kv_snp_id": "",
		"kv_prvt_id": ""
	},
	"storage_account_sapbits": {
		"arm_id": "",
		"file_share": {
			"is_existing": false
		},
		"sapbits_blob_container": {
			"is_existing": false
		}
	},
	"storage_account_tfstate": {
		"arm_id": "",
		"tfstate_blob_container": {
			"is_existing": false
		},
		"ansible_blob_container": {
			"is_existing": false
		}
	},
	"tfstate_resource_id": "",
	"deployer_statefile_foldername": ""

}
```

## Next steps

> [!div class="nextstepaction"]
> [Configure extra disks](automation-configure-extra-disks.md)
