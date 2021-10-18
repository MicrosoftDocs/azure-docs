---
title: Configure control plane for automation 
description: Configure your deployment control plane for the SAP automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure the control plane

## Overview

The control plane consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/automation-deployment-framework/ControlPlane.png" alt-text="Diagram Control Plane.":::

## Deployer

The [deployer](automation-deployment-framework.md#deployment-components) is the execution engine of the [SAP automation framework](automation-deployment-framework.md). It is a pre-configured virtual machine (VM) that is used for executing Terraform and Ansible commands. 

The configuration of the deployer is performed in a Terraform tfvars variable file.

### Terraform Parameters

The table below contains the Terraform parameters, these need to be entered manually if not using the deployment scripts

| Variable              | Type       | Description                           | 
| --------------------- | ---------- | ------------------------------------- | 
| tfstate_resource_id   | required * | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files 


### Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.

| Variable              | Type       | Description                           | 
| --------------------- | ---------- | ------------------------------------- | 
| environment           | required   | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. |
| location              | required   | The Azure region in which to deploy.     |
| resource_group_name   | optional   | Name of the resource group to be created |
| resource_group_arm_id | optional   | Azure resource identifier for an existing resource group |

### Network Parameters

The automation framework supports both creating the virtual network and the subnets (greenfield) or using an existing virtual network and existing subnets (brownfield) or a combination of these
 - For the greenfield scenario the virtual network address space and the subnet address prefixes must be specified 
 - For the brownfield scenario the Azure resource identifier for the virtual network and the subnets must be specified

The recommended CIDR of the virtual network address space is /27, which allows space for 32 IP addresses. A CIDR value of /28 only allows 16 IP addresses. If you want to include Azure Firewall, use a CIDR value of /25, because Azure Firewall requires a range of /26. 

The recommended CIDR value for the management subnet is /28 that allows 16 IP addresses.
The recommended CIDR value for the firewall subnet is /26 that allows 64 IP addresses.

The table below contains the networking parameters.

| Variable                                  | Type        | Description                           | Notes  |
| --------------------------------          | ----------- | ------------------------------------- | ------ |
| management_network_name                   | required    | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE) | |
| management_network_arm_id                 | optional *  | The Azure resource identifier for the virtual network | Mandatory for brownfield |
| management_network_address_space          | mandatory * | The address range for the virtual network | Mandatory for greenfield.  |
| management_subnet_name                    | optional    | The name of the subnet | |
| management_subnet_address_prefix          | mandatory * | The address range for the subnet | Mandatory for greenfield |
| management_subnet_arm_id	                | mandatory * | The Azure resource identifier for the subnet | Mandatory for brownfield |
| management_subnet_nsg_name                | optional	  | The name of the Network Security Group name | |
| management_subnet_nsg_arm_id              | mandatory * | The Azure resource identifier for the Network Security Group | Mandatory for brownfield |
| management_subnet_nsg_allowed_ips	        | optional	  | Range of allowed IP addresses to add to Azure Firewall
| management_firewall_subnet_arm_id		    | mandatory * | The Azure resource identifier for the Network Security Group | Mandatory for brownfield |
| management_firewall_subnet_address_prefix	| mandatory * | The address range for the subnet | Mandatory for greenfield |
 

### Deployer Virtual Machine Parameters

The table below contains the parameters related to the deployer virtual machine. 

| Variable                    | Type        | Description                           | 
| --------------------------- | ----------- | ------------------------------------- | 
| deployer_size               | optional    | Defines the Virtual machine SKU to use, for example	Standard_D4s_v3 | 
| deployer_image	          | optional	| Defines the Virtual machine image to use, see below | 
| deployer_disk_type          | optional    | Defines the disk type, for example Premium_LRS |
| deployer_use_DHCP           | optional    | Controls if Azure subnet provided IP addresses should be used (dynamic) true |
| deployer_private_ip_address | optional    | Defines the Private IP addess to use |
| deployer_enable_public_ip   | optional	| Defined if the deployer has a public IP|

The Virtual Machine image is defined using a json structure: 
```json 
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

| Variable                                    | Type        | Description                           | 
| ------------------------------------------- | ----------- | ------------------------------------- | 
| deployer_vm_authentication_type             | optional	| Defines the default authentication for the Deployer |
| deployer_authentication_username            | optional	| Administrator account name |
| deployer_authentication_password            |	optional	| Administrator password |
| deployer_authentication_path_to_public_key  | optional    | Path to the public key used for authentication |
| deployer_authentication_path_to_private_key |	optional	| Path to the private key used for authentication |

### Key Vault Parameters

The table below defines the parameters used for defining the Key Vault information

| Variable                         | Type        | Description                           | 
| -------------------------------- | ----------- | ------------------------------------- | 
| user_keyvault_id	               | optional	 | Azure resource identifier for the user key vault 
| spn_keyvault_id                  | optional	 | Azure resource identifier for the user key vault containing the SPN details
| deployer_private_key_secret_name | optional	 | If provided contains the secret name for the deployer's private key
| deployer_public_key_secret_name  | optional	 | If provided contains the secret name for the deployer's public key
| deployer_username_secret_name	   | optional	 | If provided contains the secret name for the deployer's username
| deployer_password_secret_name	   | optional	 | If provided contains the secret name for the deployer's password

### Additional parameters

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| firewall_deployment	             | mandatory   | boolean flag controlling if an Azure firewall is to be deployed | 
| enable_purge_control_for_keyvaults | optional    | boolean flag controlling if purge control is enabled on the Key Vault. Use only for test deployments | 
| use_private_endpoint               | optional    | boolean flag controlling if private endpoints are used. | 

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

For more comprehensive samples see 

## SAP Library

The [SAP Library](automation-deployment-framework.md#deployment-components) provides the persistent storage of the Terraform state files and the downloaded SAP installation media for the control plane. 

The configuration of the SAP Library is performed in a Terraform tfvars variable file.

### Terraform Parameters

The table below contains the Terraform parameters, these need to be entered manually if not using the deployment scripts

| Variable              | Type       | Description                           | 
| --------------------- | ---------- | ------------------------------------- | 
| deployer_tfstate_key  | required * | deployer_tfstate_key is the state file name for the deployer | 

### Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.

| Variable              | Type       | Description                           | 
| --------------------- | ---------- | ------------------------------------- | 
| environment           | required   | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. |
| location              | required   | The Azure region in which to deploy.     |
| resource_group_name   | optional   | Name of the resource group to be created |
| resource_group_arm_id | optional   | Azure resource identifier for an existing resource group |

### Deployer Parameters

The table below contains the parameters that define the resource group and the resource naming.

| Variable              | Type       | Description                           | 
| --------------------- | ---------- | ------------------------------------- | 
| deployer_environment  | required   | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. |
| deployer_location     | required   | The Azure region in which to deploy.   |
| deployer_vnet         | required   | The logical name for the deployer_vnet |


### SAP Installation media storage account
| Variable                | Type       | Description                           | 
| ---------------------   | ---------- | ------------------------------------- | 
| library_sapmedia_arm_id | optional   | Azure resource identifier for an existing resource group |

### Terraform remote state storage account
| Variable                       | Type       | Description                           | 
| ------------------------------ | ---------- | ------------------------------------- | 
| library_terraform_state_arm_id | optional   | Azure resource identifier for an existing resource group |

### Additional parameters

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| dns_label	                         | optional    | dns_label if specified is the DNS name of the private DNS zone | 
| use_private_endpoint               | optional    | boolean flag controlling if private endpoints are used. | 

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


## Next steps

> [!div class="nextstepaction"]
> [Configure SAP system](automation-configure-system.md)
