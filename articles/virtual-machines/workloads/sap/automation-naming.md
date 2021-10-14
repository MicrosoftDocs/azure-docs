---
title: Naming standards for the automation framework
description: Explanation of naming conventions for the SAP Deployment Automation Framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: reference
ms.service: virtual-machines-sap
---

# Naming conventions for SAP automation framework

The [SAP deployment automation framework on Azure](automation-deployment-framework.md) uses standard naming conventions. Consistent naming helps the automation framework run correctly with Terraform. Review the standard terms, area paths, variable names before you begin your deployment.

Standard naming helps you deploy the automation framework smoothly. For example, consistent naming you to:

- Deploy the SAP virtual network infrastructure into any supported Azure region.

- Do multiple deployments with partitioned virtual networks. 

- Deploy the SAP system deployment unit into any SAP virtual network. 

- Run regular and high availability (HA) instances

- Do disaster recovery and fall forward behavior.

If necessary, you can also [configure custom names using the related Terraform module](automation-naming-module.md).

## Placeholder values

The naming convention's example formats use the following placeholder values.

| Placeholder | Concept | Character limit | Example | 
| ----------- | ------- | --------------- | ------- |
| `{ENVIRONMENT}` | Environment | 5 | `SND`, `PROTO`, `NP`, `PROD` |
| `{REGION_MAP}` | [Region](#azure-region-names) map | 4 | `weus` for `westus` |
| `{SAP_VNET}` | SAP virtual network (VNet) | 7 |  `SAP0` |
| `{DEPLOY_VNET}` | Deployer VNet | 7 |  |
| `{REMOTE_VNET}` | Remote VNet | 7 |  |
| `{LOCAL_VNET}` |Local VNet | 7 |  |
| `{CODENAME}` | Logical name for version |  | `version1`, `beta` |
| `{VM_NAME}` | VM name |  |  |
| `{SUBNET}` | Subnet |  |  |
| `{SID}` | SAP system identifier |  |  |
| `{DBSID}` | Database system identifier |  |  |
| `{DIAG}` | | 5 |  |
| `{RND}` | | 3 |  |
| `{PRVT}` | | 12 |  |
| `{USER}` | | 12 |  |
| `SIDp` | | 5 |  |
| `SIDu` | | 5 |  |
| `{COMPUTER_NAME}` | | |  |

### Deployer names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource Group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}-INFRASTRUCTURE` |  `PROTO-WUS2-DEPLOY-INFRASTRUCTURE` |
| Virtual network | 38 (64)  | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}-vnet` | |
| Subnet | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_deployment-subnet` | |
| Storage account | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{DIAG}{RND}` | `protowus2deploydiagxxx` |
| Network security group (NSG) | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_deployment-nsg` | |
| Route table | | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_routeTable` | |
| User-defined route (UDR) | | `{REMOTE_VNET}_Hub-udr` | |
| Network interface component | 80 | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_{COMPUTER_NAME}-nic` | `-ipconfig1` (None required for the block `ip_configuration`.) |
| Disk | |`{vm.name}-deploy00` or `${azurerm_virtual_machine.iscsi.*.name}-iscsi00` (code) | `PROTO-WUS2-DEPLOY_deploy00-deploy00` |
| VM | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##` | |
| Operating system (OS) disk | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##-OsDisk` | |
| Computer name | | `{environment[_map]}{SAP_VNET}{region_map}iscsi##` | |
| Key vault | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{PRVT}{RND}` (private key) and `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{USER}{RND}` (user) | |
| Public IP address | | `{ENVIRONMENT}-{REGION_MAP}-{DEPLOY_VNET}_{COMPUTER_NAME}-pip` | |

### SAP Library names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource group | 80 | `{ENVIRONMENT}-{REGION_MAP}-SAP_LIBRARY` | `PROTO-WUS2-SAP_LIBRARY` |
| Storage account | 24 | `{ENVIRONMENT}{REGION_MAP}saplib(12CHAR){RND}` | `protowus2saplibxxx` |
| Key vault (private) | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{PRVT}{RND}` |
| Key vault (user) | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{USER}{RND}` |


### SAP VNet names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-INFRASTRUCTURE` | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-INFRASTRUCTURE` |
| Virtual network | 38 (64) | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-vnet` | |
| Peering | 80 | `{LOCAL_VNET}_to_{REMOTE_VNET}` | |
| Subnet | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_utility-subnet` | |
| Storage account | 80 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}diag(5CHAR){RND}` | `protowus2sap0diagxxx` |
| Network security group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi-nsg` | |
| Route table | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_routeTable` | |
| User-defined route | | `{remote_vnet}_Hub-udr` | |
| Availability set (AV set) | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi-avset` | |
| Network interface component | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##-nic` | |
| Disk | | `{vm.name}-iscsi00` or `${azurerm_virtual_machine.iscsi.*.name}-iscsi00` (code) | `PROTO-WUS2-SAP0_iscsi00-iscsi00` |
| VM | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##` | |
| OS disk | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_iscsi##-OsDisk` | |
| Computer name | | `{ENVIRONMENT}_{REGION_MAP}{SAP_VNET}{region_map}iscsi##` | |
| Key vault (private) | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{PRVT}{RND}` | |
| Key vault (user) | 24 | `{ENVIRONMENT}{REGION_MAP}{SAP_VNET}{USER}{RND}` | |

### SAP deployment unit names

For an explanation of the **Format** column, see the [definitions for placeholder values](#placeholder-values).

| Concept | Character limit | Format | Example |
| ------- | --------------- | ------ | ------- |
| Resource group | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}` | `PROTO-WUS2_S4DEV-Z00` |
| Azure proximity placement group (PPG) | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_ppg` | |
| Network interface component's network security group| 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_app-subnet` | |
| Network security group (network interface component) | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_app-nsg` | |
| Network interface component (subnet) | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_appSubnet-nsg` | |
| AV set | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_app-avset` | |
| Network interface component | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_{VM_NAME}-{SUBNET}-nic` | `-app-nic`, `-web-nic`, `-admin-nic`, `-db-nic` |
| Disk | | `${element(azurerm_virtual_machine.app.*.name, count.index)}-sap00` (code) | `{VM-NAME}-sap00`, `{VM-NAME}-data00`, `{VM-NAME}-log00`, `{VM-NAME}-backup00` |
| VM | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_{COMPUTER-NAME}` | |
| OS disk | | `{ENVIRONMENT}-{REGION_MAP}-{SAP-VNET}_{CODENAME}-{SID}_{COMPUTER-NAME}-osDisk` | |
| Computer name (database) | 14 | `{SID}d{DBSID}##[l` | |
| Computer name (non-database) | 14 | `{SID}{COMPUTER-NAME}##[l` | `{SID}app##[l`, `{SID}scs##[l`, `{SID}db##[l`, `{SID}web##[l` |
| Azure load balancer | 80 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_{CODENAME}-{SID}_db-alb` | |
| Load balancer front-end IP address | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_{CODENAME}-{SID}_dbAlb-feip` | |
| Load balancer backend pool | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_{CODENAME}-{SID}_dbAlb-bePool` | |
| Load balancer rule | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_{CODENAME}-{SID}_dbAlb-rule_port-01` | |
| Key vault (private) | 24 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}{SIDp}{RND}` | |
| Key vault (user) | 24 | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}{SIDu}{RND}` | |
| Load balancer health probe | | `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}_{CODENAME}-{SID}_dbAlb-hp?` | |

> [!NOTE]
> Disk numbering starts at zero. The naming convention uses a two-character format; for example, `00`.

## Azure region names

The automation framework uses short forms of Azure region names. The short Azure region names are mapped to the normal region names.

You can set the mapping under the variable `_region_mapping` in the name generator's configuration file, `../../../deploy/terraform/terraform-units/modules/sap_namegenerator/variables_local.tf`.

Then, you can use the `_region_mapping` variable elsewhere, such as an area path. The format for an area path is `{ENVIRONMENT}-{REGION_MAP}-{SAP_VNET}-{ARTIFACT}` where:

- `{ENVIRONMENT}` is the name of the environment, or workload zone.
- `{REGION_MAP}` is the short form of the Azure region name.
- `{SAP_VNET}` is the SAP virtual network within the environment.
- `{ARTIFACT}` is the deployment artifact within the virtual network, such as `INFRASTRUCTURE`.

You can use the `_region_mapping` variable as follows:

```
"${upper(var.__environment)}-${upper(element(split(",", lookup(var.__region_mapping, var.__region, "-,unknown")),1))}-${upper(var.__SAP_VNET)}-INFRASTRUCTURE"
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about configuring the custom naming module](automation-naming-module.md)