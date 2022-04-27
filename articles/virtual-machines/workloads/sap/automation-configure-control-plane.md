---
title: Configure control plane for automation framework
description: Configure your deployment control plane for the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure the control plane

The control plane for the [SAP deployment automation framework on Azure](automation-deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/automation-deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

## Deployer

The [deployer](automation-deployment-framework.md#deployment-components) is the execution engine of the [SAP automation framework](automation-deployment-framework.md). It is a pre-configured virtual machine (VM) that is used for executing Terraform and Ansible commands. 

The configuration of the deployer is performed in a Terraform tfvars variable file.

## Terraform Parameters

The table below contains the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | Type       |
> | ----------------------- | ------------------------------------- | ---------- | 
> | `tfstate_resource_id`   | Azure resource identifier for the storage account in the SAP Library that contains the Terraform state files | Required   | 


### Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | Type       | 
> | ----------------------- | ------------------------------------- | ---------- | 
> | `environment`           | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. | Mandatory |
> | `location`              | The Azure region in which to deploy.     | Required   | 
> | `resource_group_name`   | Name of the resource group to be created | Optional   |
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   | 

### Network Parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified 
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

The recommended CIDR of the virtual network address space is /27, which allows space for 32 IP addresses. A CIDR value of /28 only allows 16 IP addresses. If you want to include Azure Firewall, use a CIDR value of /25, because Azure Firewall requires a range of /26. 

The recommended CIDR value for the management subnet is /28 that allows 16 IP addresses.
The recommended CIDR value for the firewall subnet is /26 that allows 64 IP addresses.

The table below contains the networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                    | Description                                                      | Type       | Notes  |
> | ------------------------------------------  | ---------------------------------------------------------------- | ---------- | ------ |
> | `management_network_name`                   | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE) | Required   | |
> | `management_network_arm_id`                 | The Azure resource identifier for the virtual network            | Optional   | For existing environment deployments |
> | `management_network_address_space`          | The address range for the virtual network                        | Mandatory  | For new environment deployments |
> | `management_subnet_name`                    | The name of the subnet                                           | Optional   | |
> | `management_subnet_address_prefix`          | The address range for the subnet                                 | Mandatory  | For new environment deployments |
> | `management_subnet_arm_id`	                | The Azure resource identifier for the subnet                     | Mandatory  | For existing environment deployments |
> | `management_subnet_nsg_name`                | The name of the Network Security Group name                      | Optional   | |
> | `management_subnet_nsg_arm_id`              | The Azure resource identifier for the Network Security Group     | Mandatory  | Mandatory for existing environment deployments |
> | `management_subnet_nsg_allowed_ips`	        | Range of allowed IP addresses to add to Azure Firewall           | Optional   | |  
> | `management_firewall_subnet_arm_id`		    | The Azure resource identifier for the Network Security Group     | Mandatory  | For existing environment deployments |
> | `management_firewall_subnet_address_prefix` | The address range for the subnet                                 | Mandatory  | For new environment deployments | 

### Deployer Virtual Machine Parameters

The table below contains the parameters related to the deployer virtual machine. 

> [!div class="mx-tdCol2BreakAll "]
> | Variable                        | Description                                                                  | Type       |
> | ------------------------------- | ---------------------------------------------------------------------------- | ---------- |
> | `deployer_size`                 | Defines the Virtual machine SKU to use, for example	Standard_D4s_v3        | Optional   |
> | `deployer_image`	            | Defines the Virtual machine image to use, see below                          | Optional	|
> | `deployer_disk_type`            | Defines the disk type, for example Premium_LRS                               | Optional   |
> | `deployer_use_DHCP`             | Controls if Azure subnet provided IP addresses should be used (dynamic) true | Optional   |
> | `deployer_private_ip_address`   | Defines the Private IP address to use                                        | Optional   |
> | `deployer_enable_public_ip`     | Defined if the deployer has a public IP                                      | Optional   |

The Virtual Machine image is defined using the following structure: 
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

The table below defines the parameters used for defining the Virtual Machine authentication


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                         | Description                                         | Type      | 
> | ------------------------------------------------ | --------------------------------------------------- | --------- | 
> | `deployer_vm_authentication_type`                | Defines the default authentication for the Deployer | Optional  |
> | `deployer_authentication_username`               | Administrator account name                          | Optional  |
> | `deployer_authentication_password`               | Administrator password                              | Optional  |
> | `deployer_authentication_path_to_public_key`     | Path to the public key used for authentication      | Optional  |
> | `deployer_authentication_path_to_private_key`    | Path to the private key used for authentication     | Optional  |

### Key Vault Parameters

The table below defines the parameters used for defining the Key Vault information

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                                                                 | Type       | 
> | ------------------------------------ | --------------------------------------------------------------------------- | ---------- | 
> | `user_keyvault_id`	                 | Azure resource identifier for the user key vault                            | Optional	|
> | `spn_keyvault_id`                    | Azure resource identifier for the user key vault containing the SPN details | Optional	|
> | `deployer_private_key_secret_name`   | The Azure Key Vault secret name for the deployer private key                | Optional	|
> | `deployer_public_key_secret_name`    | The Azure Key Vault secret name for the deployer public key                 | Optional	|
> | `deployer_username_secret_name`	     | The Azure Key Vault secret name for the deployer username                   | Optional	|
> | `deployer_password_secret_name`	     | The Azure Key Vault secret name for the deployer password                   | Optional	|

### Other parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                             | Description                           | Type        | 
> | ------------------------------------ | ------------------------------------- | ----------- | 
> | `firewall_deployment`	               | Boolean flag controlling if an Azure firewall is to be deployed | Mandatory   | 
> | `bastion_deployment`	               | Boolean flag controlling if Azure bastion host is to be deployed | Mandatory   | 
> | `enable_purge_control_for_keyvaults` | Boolean flag controlling if purge control is enabled on the Key Vault. Use only for test deployments | Optional    | 
> | `use_private_endpoint`               | Boolean flag controlling if private endpoints are used. | Optional    | 

### Example parameters file for deployer (required parameters only)

```bash
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment="MGMT"
# The location/region value is a mandatory field, it is used to control where the resources are deployed
location="westeurope"

# management_network_address_space is the address space for management virtual network
management_network_address_space="10.10.20.0/25"
# management_subnet_address_prefix is the address prefix for the management subnet
management_subnet_address_prefix="10.10.20.64/28"
# management_firewall_subnet_address_prefix is the address prefix for the firewall subnet
management_firewall_subnet_address_prefix="10.10.20.0/26"

deployer_enable_public_ip=true
firewall_deployment=true
```


## SAP Library

The [SAP Library](automation-deployment-framework.md#deployment-components) provides the persistent storage of the Terraform state files and the downloaded SAP installation media for the control plane. 

The configuration of the SAP Library is performed in a Terraform tfvars variable file.

### Terraform Parameters

The table below contains the Terraform parameters, these parameters need to be entered manually when not using the deployment scripts

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | Type       | 
> | ----------------------- | ------------------------------------- | ---------- | 
> | `deployer_tfstate_key`  | The state file name for the deployer  | Required   | 

### Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.


> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | Type       |
> | ----------------------- | ------------------------------------- | ---------- |
> | `environment`           | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. | Mandatory |
> | `location`              | The Azure region in which to deploy.     | Required   | 
> | `resource_group_name`   | Name of the resource group to be created | Optional   |
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   | 

### Deployer Parameters

The table below contains the parameters that define the resource group and the resource naming.

> [!div class="mx-tdCol2BreakAll "]
> | Variable               | Description                           | Type |
> | ---------------------  | ------------------------------------- | ----- | 
> | `deployer_environment` | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. | Mandatory |
> | `deployer_location`    | The Azure region in which to deploy.   | Mandatory |
> | `deployer_vnet`        | The logical name for the deployer VNet | Mandatory |


### SAP Installation media storage account

> [!div class="mx-tdCol2BreakAll "]
> | Variable                  | Description                 | Type       | 
> | ------------------------- | --------------------------- | ---------- | 
> | `library_sapmedia_arm_id` | Azure resource identifier   | Optional   |

### Terraform remote state storage account

> [!div class="mx-tdCol2BreakAll "]
> | Variable                         | Description                | Type       | 
> | -------------------------------- | -------------------------- | ---------- | 
> | `library_terraform_state_arm_id` | Azure resource identifier  | Optional   |

### Extra parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                           | Description                      | Type     | 
> | ---------------------------------- | -------------------------------- | -------- | 
> | `dns_label`	                       | DNS name of the private DNS zone | Optional | 
> | `use_private_endpoint`             | Use private endpoints            | Optional | 

### Example parameters file for sap library (required parameters only)

```bash
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment="MGMT"
# The location/region value is a mandatory field, it is used to control where the resources are deployed
location="westeurope"
# The deployer_environment value is a mandatory field, it is used for identifying the deployer
deployer_environment="MGMT"
# The deployer_location value is a mandatory field, it is used for identifying the deployer
deployer_location="westeurope"
# The deployer_vnet value is a mandatory field, it is used for identifying the deployer
deployer_vnet="DEP00"

```


## Next step

> [!div class="nextstepaction"]
> [Configure SAP system](automation-configure-system.md)
