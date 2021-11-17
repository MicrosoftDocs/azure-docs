---
title: Configure custom naming module for the automation framework
description: Explanation of how to implement custom naming conventions for the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure custom naming module

The [SAP deployment automation framework on Azure](automation-deployment-framework.md) uses a standard naming convention for Azure [resource naming](automation-naming.md). 

The Terraform module `sap_namegenerator` defines the names of all resources that the automation framework deploys. The module is located at `/deploy/terraform/terraform-units/modules/sap_namegenerator/` in the repository. 

The framework also supports providing you own names for some of the resources using the [parameter files](automation-configure-system.md). If these capabilities are not enough you can also use custom naming logic by modifying the naming module used by the automation.

There are multiple files within the module for naming resources:

- Virtual machine (VM) and computer names are defined in (`vm.tf`)
- Resource group naming is defined in (`resourcegroup.tf`)
- Key vaults in (`keyvault.tf`)
- Resource suffixes (`variables_local.tf`)

The different resource names are identified by prefixes in the Terraform code.
- SAP deployer deployments use resource names with the prefix `deployer_`
- SAP library deployments use resource names with the prefix `library`
- SAP landscape deployments use resource names with the prefix `vnet_`
- SAP system deployments use resource names with the prefix `sdu_`

The calculated names are returned in a data dictionary which is used by all the terraform modules. 

## Using custom names

Some of the resource names can be changed by providing parameters in the tfvars parameter file.

| Resource               | Parameter               | Notes                                                              |
| ---------------------- | ----------------------- | ------------------------------------------------------------------ |
| `Prefix`               | `custom_prefix`         | This is used as prefix for all the resources in the resource group |
| `Resource group`       | `resourcegroup_name`    |                                                                    |
| `admin subnet name`    | `admin_subnet_name`     |                                                                    |
| `admin nsg name`       | `admin_subnet_nsg_name` |                                                                    |
| `db subnet name`       | `db_subnet_name`        |                                                                    |
| `db nsg name`          | `db_subnet_nsg_name`    |                                                                    |
| `app subnet name`      | `app_subnet_name`       |                                                                    |
| `app nsg name`         | `app_subnet_nsg_name`   |                                                                    |
| `web subnet name`      | `web_subnet_name`       |                                                                    |
| `web nsg name`         | `web_subnet_nsg_name`   |                                                                    |
| `admin nsg name`       | `admin_subnet_nsg_name` |                                                                    |

## Changing the naming module

To prepare your Terraform environment for custom naming, you first need to create custom naming module. The easiest way is to copy the existing module and make the required changes in the copied module.

1. Create a root-level folder in your Terraform environment. For example, `Azure_SAP_Automated_Deployment`.
1. Navigate to your new root-level folder.
1. Clone the [automation framework repository](https://github.com/Azure/sap-hana). This step creates a new folder `sap-hana`.
1. Create a folder within the root-level folder called `Contoso_naming`.
1. Navigate to the `sap-hana` folder.
1. Check out the appropriate branch in git.
1. Navigate to `\deploy\terraform\terraform-units\modules` within the `sap-hana` folder.
1. Copy the folder `sap_namegenerator` to the `Contoso_naming` folder.

The naming module is called from the root terraform folders:

```terraform
module "sap_namegenerator" {
  source           = "../../terraform-units/modules/sap_namegenerator"
  environment      = local.infrastructure.environment
  location         = local.infrastructure.region
  codename         = lower(try(local.infrastructure.codename, ""))
  random_id        = module.common_infrastructure.random_id
  sap_vnet_name    = local.vnet_logical_name
  sap_sid          = local.sap_sid
  db_sid           = local.db_sid
  app_ostype       = try(local.application.os.os_type, "LINUX")
  anchor_ostype    = upper(try(local.anchor_vms.os.os_type, "LINUX"))
  db_ostype        = try(local.databases[0].os.os_type, "LINUX")
  db_server_count  = var.database_server_count
  app_server_count = try(local.application.application_server_count, 0)
  web_server_count = try(local.application.webdispatcher_count, 0)
  scs_server_count = local.application.scs_high_availability ? 2 * local.application.scs_server_count : local.application.scs_server_count  
  app_zones        = local.app_zones
  scs_zones        = local.scs_zones
  web_zones        = local.web_zones
  db_zones         = local.db_zones
  resource_offset  = try(var.options.resource_offset, 0)
  custom_prefix    = var.custom_prefix
}
```

Next, you need to point your other Terraform module files to your custom naming module. These module files include:

- `deploy\terraform\run\sap_system\module.tf`
- `deploy\terraform\bootstrap\sap_deployer\module.tf`
- `deploy\terraform\bootstrap\sap_library\module.tf`
- `deploy\terraform\run\sap_library\module.tf`
- `deploy\terraform\run\sap_deployer\module.tf`

For each file, change the source for the module `sap_namegenerator` to point to your new naming module's location. For example:

`module "sap_namegenerator" { source = "../../terraform-units/modules/sap_namegenerator"` becomes `module "sap_namegenerator" { source = "../../../../Contoso_naming"`.

## Change resource group naming logic

To change your resource group's naming logic, navigate to your custom naming module folder (for example, `Workspaces\Contoso_naming`). Then, edit the file `resourcegroup.tf`. Modify the following code with your own naming logic.

```terraform
locals {

  // Resource group naming
  sdu_name = length(var.codename) > 0 ? (
    upper(format("%s-%s-%s_%s-%s", local.env_verified, local.location_short, local.sap_vnet_verified, var.codename, var.sap_sid))) : (
    upper(format("%s-%s-%s-%s", local.env_verified, local.location_short, local.sap_vnet_verified, var.sap_sid))
  )

  deployer_name  = upper(format("%s-%s-%s", local.deployer_env_verified, local.deployer_location_short, local.dep_vnet_verified))
  landscape_name = upper(format("%s-%s-%s", local.landscape_env_verified, local.location_short, local.sap_vnet_verified))
  library_name   = upper(format("%s-%s", local.library_env_verified, local.location_short))

  // Storage account names must be between 3 and 24 characters in length and use numbers and lower-case letters only. The name must be unique.
  deployer_storageaccount_name       = substr(replace(lower(format("%s%s%sdiag%s", local.deployer_env_verified, local.deployer_location_short, local.dep_vnet_verified, local.random_id_verified)), "/[^a-z0-9]/", ""), 0, var.azlimits.stgaccnt)
  landscape_storageaccount_name      = substr(replace(lower(format("%s%s%sdiag%s", local.landscape_env_verified, local.location_short, local.sap_vnet_verified, local.random_id_verified)), "/[^a-z0-9]/", ""), 0, var.azlimits.stgaccnt)
  library_storageaccount_name        = substr(replace(lower(format("%s%ssaplib%s", local.library_env_verified, local.location_short, local.random_id_verified)), "/[^a-z0-9]/", ""), 0, var.azlimits.stgaccnt)
  sdu_storageaccount_name            = substr(replace(lower(format("%s%s%sdiag%s", local.env_verified, local.location_short, local.sap_vnet_verified, local.random_id_verified)), "/[^a-z0-9]/", ""), 0, var.azlimits.stgaccnt)
  terraformstate_storageaccount_name = substr(replace(lower(format("%s%stfstate%s", local.library_env_verified, local.location_short, local.random_id_verified)), "/[^a-z0-9]/", ""), 0, var.azlimits.stgaccnt)

}
```

## Change resource suffixes

To change your resource suffixes, navigate to your custom naming module folder (for example, `Workspaces\Contoso_naming`). Then, edit the file `variables_local.tf`. Modify the following map with your own resource suffixes.

> [!NOTE]
> Only change the map **values**. Don't change the map **key**, which the Terraform code uses.
> For example, if you want to rename the administrator network interface component, change `"admin-nic"           = "-admin-nic"` to `"admin-nic"           = "yourNICname"`.

```terraform
variable resource_suffixes {
  type        = map(string)
  description = "Extension of resource name"

  default = {
    "admin_nic"           = "-admin-nic"
    "admin_subnet"        = "admin-subnet"
    "admin_subnet_nsg"    = "adminSubnet-nsg"
    "app_alb"             = "app-alb"
    "app_avset"           = "app-avset"
    "app_subnet"          = "app-subnet"
    "app_subnet_nsg"      = "appSubnet-nsg"
    "db_alb"              = "db-alb"
    "db_alb_bepool"       = "dbAlb-bePool"
    "db_alb_feip"         = "dbAlb-feip"
    "db_alb_hp"           = "dbAlb-hp"
    "db_alb_rule"         = "dbAlb-rule_"
    "db_avset"            = "db-avset"
    "db_nic"              = "-db-nic"
    "db_subnet"           = "db-subnet"
    "db_subnet_nsg"       = "dbSubnet-nsg"
    "deployer_rg"         = "-INFRASTRUCTURE"
    "deployer_state"      = "_DEPLOYER.terraform.tfstate"
    "deployer_subnet"     = "_deployment-subnet"
    "deployer_subnet_nsg" = "_deployment-nsg"
    "iscsi_subnet"        = "iscsi-subnet"
    "iscsi_subnet_nsg"    = "iscsiSubnet-nsg"
    "library_rg"          = "-SAP_LIBRARY"
    "library_state"       = "_SAP-LIBRARY.terraform.tfstate"
    "kv"                  = ""
    "msi"                 = "-msi"
    "nic"                 = "-nic"
    "osdisk"              = "-OsDisk"
    "pip"                 = "-pip"
    "ppg"                 = "-ppg"
    "sapbits"             = "sapbits"
    "storage_nic"         = "-storage-nic"
    "storage_subnet"      = "_storage-subnet"
    "storage_subnet_nsg"  = "_storageSubnet-nsg"
    "scs_alb"             = "scs-alb"
    "scs_alb_bepool"      = "scsAlb-bePool"
    "scs_alb_feip"        = "scsAlb-feip"
    "scs_alb_hp"          = "scsAlb-hp"
    "scs_alb_rule"        = "scsAlb-rule_"
    "scs_avset"           = "scs-avset"
    "scs_ers_feip"        = "scsErs-feip"
    "scs_ers_hp"          = "scsErs-hp"
    "scs_ers_rule"        = "scsErs-rule_"
    "scs_scs_rule"        = "scsScs-rule_"
    "sdu_rg"              = ""
    "tfstate"             = "tfstate"
    "vm"                  = ""
    "vnet"                = "-vnet"
    "vnet_rg"             = "-INFRASTRUCTURE"
    "web_alb"             = "web-alb"
    "web_alb_bepool"      = "webAlb-bePool"
    "web_alb_feip"        = "webAlb-feip"
    "web_alb_hp"          = "webAlb-hp"
    "web_alb_inrule"      = "webAlb-inRule"
    "web_avset"           = "web-avset"
    "web_subnet"          = "web-subnet"
    "web_subnet_nsg"      = "webSubnet-nsg"

  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about naming conventions](automation-naming.md)
