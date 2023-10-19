---
title: Naming standards for the automation framework
description: Explanation of naming conventions for SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Naming conventions for SAP Deployment Automation Framework

[SAP Deployment Automation Framework](deployment-framework.md) uses standard naming conventions. Consistent naming helps the automation framework run correctly with Terraform. Standard naming helps you deploy the automation framework smoothly. For example, consistent naming helps you to:

- Deploy the SAP virtual network infrastructure into any supported Azure region.
- Do multiple deployments with partitioned virtual networks.
- Deploy the SAP system into any SAP workload zone.
- Run regular and high availability instances.
- Do disaster recovery and fall forward behavior.

Review the standard terms, area paths, and variable names before you begin your deployment. If necessary, you can also [configure custom naming](naming-module.md).

## Placeholder values

The naming convention's example formats use the following placeholder values.

| Placeholder | Concept | Character limit | Example |
| ----------- | ------- | --------------- | ------- |
| `{ENVIRONMENT}` | Environment | 5 | `DEV`, `PROTO`, `NP`, `PROD` |
| `{REGION_MAP}` | [Region](#azure-region-names) map | 4 | `weus` for `westus` |
| `{SAP_VNET}` | SAP virtual network | 7 |  `SAP0` |
| `{SID}` | SAP system identifier | 3 | `X01` |
| `{PREFIX}` | SAP resource prefix | | `DEV-WEEU-SAP01-X01` |
| `{DEPLOY_VNET}` | Deployer virtual network | 7 |  |
| `{REMOTE_VNET}` | Remote virtual network | 7 |  |
| `{LOCAL_VNET}` |Local virtual network | 7 |  |
| `{CODENAME}` | Logical name for version |  | `version1`, `beta` |
| `{VM_NAME}` | VM name |  |  |
| `{SUBNET}` | Subnet |  |  |
| `{DBSID}` | Database system identifier |  |  |
| `{DIAG}` | | 5 |  |
| `{RND}` | | 3 |  |
| `{USER}` | | 12 |  |
| `{COMPUTER_NAME}` | | 14 |  |

### Deployer names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}-INFRASTRUCTURE` |  `MGMT-WEEU-DEP00-INFRASTRUCTURE` |
| Virtual network | 38 (64)  | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}-vnet` | `MGMT-WEEU-DEP00-vnet` |
| Subnet | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_deployment-subnet` | `MGMT-WEEU-DEP00_deployment-subnet` |
| Storage account | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{DIAG}{RND}` | `mgmtweeudep00diagxxx` |
| Network security group (NSG) | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_deployment-nsg` | `MGMT-WEEU-DEP00_deployment-nsg` |
| Route table | | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_routeTable` | `MGMT-WEEU-DEP00_route-table` |
| Network interface component | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_{COMPUTER_NAME}-nic` | `-ipconfig1` (None required for the block `ip_configuration`.) |
| Disk | |`{vm.name}-deploy00` | `PROTO-WUS2-DEPLOY_deploy00-disk00` |
| VM | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_deploy##` | `MGMT-WEEU-DEP00_permweeudep00deploy00` |
| Operating system (OS) disk | | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_deploy##-OsDisk` | `PERM-WEEU-DEP00_permweeudep00deploy00-OsDisk` |
| Computer name | | `{environment[_map]}{DEPLOY_VNET}{region_map}deploy##` | `MGMT-WEEU-DEP00_permweeudep00deploy00` |
| Key vault | 24 | `{ENVIRONMENT}{REGION_MAP}{DEPLOY_VNET}{USER}{RND}` (deployment credentials) | `MGMTWEEUDEP00userxxx` |
| Public IP address | | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_{COMPUTER_NAME}-pip` | `MGMT-WEEU-DEP00_permweeudep00deploy00-pip` |

### SAP library names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource group | 80 | `{ENVIRONMENT}-{REGION_MAP}-SAP_LIBRARY` | `MGMT-WEEU-SAP_LIBRARY` |
| Storage account | 24 | `{ENVIRONMENT}{REGION_MAP}saplib(12CHAR){RND}` | `mgmtweeusaplibxxx` |
| Storage account | 24 | `{ENVIRONMENT}{REGION_MAP}tfstate(12CHAR){RND}` | `mgmtweeutfstatexxx` |

### SAP workload zone names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept         | Character limit | Format | Example |
| --------------- | --------------- | ------ | ------- |
| Resource group  | 80              | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-INFRASTRUCTURE` | `DEV-WEEU-SAP01-INFRASTRUCTURE` |
| Virtual network | 38 (64)         | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-vnet` | `DEV-WEEU-SAP01-vnet` |
| Peering         | 80              | `{LOCAL_VNET}_to_{REMOTE_VNET}` | `DEV-WEEU-SAP01-vnet_to_MGMT-WEEU-DEP00-vnet` |
| Subnet          | 80              | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_utility-subnet` | `DEV-WEEU-SAP01_db-subnet` |
| Network security group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_utility-nsg` | `DEV-WEEU-SAP01_dbSubnet-nsg` |
| Route table | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_routeTable` | `DEV-WEEU-SAP01_route-table` |
| Storage account | 80              | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}diag(5CHAR){RND}` | `devweeusap01diagxxx` |
| User-defined route | | `{remote_vnet}_Hub-udr` | |
| User-defined route (firewall)| | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_firewall-route` |`DEV-WEEU-SAP01_firewall-route` |
| Availability set (AV set) | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi-avset` | |
| Network interface component | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##-nic` | |
| Disk | | `{vm.name}-iscsi00` or `${azurerm_virtual_machine.iscsi.*.name}-iscsi00` (code) | `DEV-WEEU-SAP01_iscsi00-iscsi00` |
| VM | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##` | |
| OS disk | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##-OsDisk` | |
| Computer name | | `{ENVIRONMENT}_{REGION_MAP}{SAP_VNET}{region_map}iscsi##` | |
| Key vault | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{USER}{RND}` | `DEVWEEUSAP01userxxx` |
| NetApp account |  | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}_netapp_account` | `DEV-WEEU-SAP01_netapp_account` |
| NetApp capacity pool | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}_netapp_pool` | `DEV-WEEU-SAP01_netapp_pool` |

### SAP system names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept         | Character limit | Format | Example |
| --------------- | --------------- | ------ | ------- |
| Resource prefix | 80              | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}-{SID}` or `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}` | `DEV-WEEU-SAP01-X01` |
| Resource group  | 80              | `{PREFIX}` | `DEV-WEEU-SAP01-X01` |
| Azure proximity placement group (PPG) | | `{PREFIX}_ppg` | |
| Availability set | | `{PREFIX}_app-avset` | `DEV-WEEU-SAP01-X01_app-avset` |
| Subnet          | 80              | `{PREFIX}_utility-subnet` | `DEV-WEEU-SAP01_X01_db-subnet` |
| Network security group | 80 | `{PREFIX}_utility-nsg` | `DEV-WEEU-SAP01_X01_dbSubnet-nsg` |
| Network interface component | | `{PREFIX}_{VM_NAME}-{SUBNET}-nic` | `-app-nic`, `-web-nic`, `-admin-nic`, `-db-nic` |
| Computer name (database) | 14 | `{SID}d{DBSID}##{OS flag l/w}{primary/secondary 0/1}{RND}` | `DEV-WEEU-SAP01-X01_x01dxdb00l0xxx` |
| Computer name (nondatabase) | 14 | `{SID}{ROLE}##{OS flag l/w}{RND}` | `DEV-WEEU-SAP01-X01_x01app01l538`, `DEV-WEEU-SAP01-X01_x01scs01l538` |
| VM | | `{PREFIX}_{COMPUTER-NAME}` | |
| Disk | | `{PREFIX}_{VM_NAME}-{disk_type}{counter}` | `{VM-NAME}-sap00`, `{VM-NAME}-data00`, `{VM-NAME}-log00`, `{VM-NAME}-backup00` |
| OS disk | | `{PREFIX}_{VM_NAME}-osDisk` | `DEV-WEEU-SAP01-X01_x01scs00lxxx-OsDisk` |
| Azure load balancer (utility)| 80 | `{PREFIX}_db-alb` | `DEV-WEEU-SAP01-X01_db-alb` |
| Load balancer front-end IP address (utility)| | `{PREFIX}_dbAlb-feip` | `DEV-WEEU-SAP01-X01_dbAlb-feip` |
| Load balancer back-end pool (utility)| | `{PREFIX}_dbAlb-bePool` | `DEV-WEEU-SAP01-X01_dbAlb-bePool` |
| Load balancer health probe (utility)| | `{PREFIX}_dbAlb-hp` | `DEV-WEEU-SAP01-X01_dbAlb-hp`|
| Key vault (user) | 24 | `{SHORTPREFIX}u{RND}` | `DEVWEEUSAP01uX01xxx` |
| NetApp volume (utility) | 24 | `{PREFIX}-utility` | `DEV-WEEU-SAP01-X01_sapmnt` |

> [!NOTE]
> Disk numbering starts at zero. The naming convention uses a two-character format; for example, `00`.

## Azure region names

The automation framework uses short forms of Azure region names. The short Azure region names are mapped to the normal region names.

You can set the mapping under the variable `_region_mapping` in the name generator's configuration file, `../../../deploy/terraform/terraform-units/modules/sap_namegenerator/variables_local.tf`.

Then, you can use the `_region_mapping` variable elsewhere, such as an area path. The format for an area path is `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-{ARTIFACT}` where:

- `{ENVIRONMENT}` is the name of the environment or workload zone.
- `{REGION_MAP}` is the short form of the Azure region name.
- `{SAP_VNET}` is the SAP virtual network within the environment.
- `{ARTIFACT}` is the deployment artifact within the virtual network, such as `INFRASTRUCTURE`.

You can use the `_region_mapping` variable as follows:

```
"${upper(var.__environment)}-${upper(element(split(",", lookup(var.__region_mapping, var.__region, "-,unknown")),1))}-${upper(var.__SAP_VNET)}-INFRASTRUCTURE"
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about configuring the custom naming module](naming-module.md)
