---
title: Configure control plane for automation framework
description: Configure your deployment control plane for the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 03/05/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-terraform
---

# Configure the control plane

The control plane for the [SAP on Azure Deployment Automation Framework](deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

## Deployer

The [deployer](deployment-framework.md#deployment-components) is the execution engine of the [SAP automation framework](deployment-framework.md). It's a pre-configured virtual machine (VM) that is used for executing Terraform and Ansible commands. When using Azure DevOps the deployer is a self-hosted agent.

The configuration of the deployer is performed in a Terraform tfvars variable file.

## Terraform Parameters

This table shows the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                                                                                  | Type       |
> | ----------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
> | `tfstate_resource_id`   | Azure resource identifier for the storage account in the SAP Library that contains the Terraform state files | Required   |


### Environment Parameters

This table shows the parameters that define the resource naming.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                       | Type       | Notes                                                                                       |
> | ----------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
> | `environment`           | Identifier for the control plane (max 5 chars)    | Mandatory  | For example, `PROD` for a production environment and `NP` for a non-production environment. |
> | `location`              | The Azure region in which to deploy.              | Required   | Use lower case                                                                              |
> | 'name_override_file'    | Name override file                                | Optional   | see [Custom naming](naming-module.md)                                            |

### Resource Group

This table shows the parameters that define the resource group.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resource_group_name`   | Name of the resource group to be created                 | Optional   |
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   |
> | `resourcegroup_tags`    | Tags to be associated with the resource group            | Optional   |


### Network Parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

The recommended CIDR of the virtual network address space is /27, which allows space for 32 IP addresses. A CIDR value of /28 only allows 16 IP addresses. If you want to include Azure Firewall, use a CIDR value of /25, because Azure Firewall requires a range of /26.

The recommended CIDR value for the management subnet is /28 that allows 16 IP addresses.
The recommended CIDR value for the firewall subnet is /26 that allows 64 IP addresses.

This table shows the networking parameters.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                    | Description                                                      | Type       | Notes  |
> | ------------------------------------------  | ---------------------------------------------------------------- | ---------- | ------ |
> | `management_network_name`                   | The name of the VNet into which the deployer will be deployed    | Optional   | For green field deployments. |
> | `management_network_logical_name`           | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE) | Required   | |
> | `management_network_arm_id`                 | The Azure resource identifier for the virtual network            | Optional   | For brown field deployments.  |
> | `management_network_address_space`          | The address range for the virtual network                        | Mandatory  | For green field deployments.  |
> |                                             |                                                                  |            | |
> | `management_subnet_name`                    | The name of the subnet                                           | Optional   | |
> | `management_subnet_address_prefix`          | The address range for the subnet                                 | Mandatory  | For green field deployments.  |
> | `management_subnet_arm_id`	                | The Azure resource identifier for the subnet                     | Mandatory  | For brown field deployments.  |
> | `management_subnet_nsg_name`                | The name of the Network Security Group name                      | Optional   | |
> | `management_subnet_nsg_arm_id`              | The Azure resource identifier for the Network Security Group     | Mandatory  | Mandatory For brown field deployments.  |
> | `management_subnet_nsg_allowed_ips`	        | Range of allowed IP addresses to add to Azure Firewall           | Optional   | |
> |                                             |                                                                  |            | |
> | `management_firewall_subnet_arm_id`		      | The Azure resource identifier for the Firewall subnet            | Mandatory  | For brown field deployments.  |
> | `management_firewall_subnet_address_prefix` | The address range for the subnet                                 | Mandatory  | For green field deployments.  |
> |                                             |                                                                  |            | |
> | `management_bastion_subnet_arm_id`		      | The Azure resource identifier for the Bastion subnet             | Mandatory  | For brown field deployments.  |
> | `management_bastion_subnet_address_prefix`  | The address range for the subnet                                 | Mandatory  | For green field deployments.  |
> |                                             |                                                                  |            | |
> | `webapp_subnet_arm_id`		                  | The Azure resource identifier for the web app subnet             | Mandatory  | For brown field deployments using the web app |
> | `webapp_subnet_address_prefix`              | The address range for the subnet                                 | Mandatory  | For green field deployments using the web app |

> [!NOTE]
> When using an existing subnet for the web app, the subnet must be empty, in the same region as the resource group being deployed, and delegated to Microsoft.Web/serverFarms


### Deployer Virtual Machine Parameters

This table shows the parameters related to the deployer virtual machine.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                        | Description                                                                            | Type       |
> | ------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
> | `deployer_size`                 | Defines the Virtual machine SKU to use, for example	Standard_D4s_v3                    | Optional   |
> | `deployer_count`                | Defines the number of Deployers                                                        | Optional   |
> | `deployer_image`	              | Defines the Virtual machine image to use, see below                                    | Optional	  |
> | `plan`	                        | Defines the plan associated to the Virtual machine image, see below                    | Optional	  |
> | `deployer_disk_type`            | Defines the disk type, for example Premium_LRS                                         | Optional   |
> | `deployer_use_DHCP`             | Controls if Azure subnet provided IP addresses should be used (dynamic) true           | Optional   |
> | `deployer_private_ip_address`   | Defines the Private IP address to use                                                  | Optional   |
> | `deployer_enable_public_ip`     | Defines if the deployer has a public IP                                                | Optional   |
> | `auto_configure_deployer`       | Defines deployer will be configured with the required software (Terraform and Ansible) | Optional   |
> | `add_system_assigned_identity`  | Defines deployer will be assigned a system identity                                    | Optional   |


The Virtual Machine image is defined using the following structure:
```python
{
  "os_type"         = ""
  "source_image_id" = ""
  "publisher"       = "Canonical"
  "offer"           = "0001-com-ubuntu-server-focal"
  "sku"             = "20_04-lts"
  "version"         = "latest"
  "type"            = "marketplace"
}
```

> [!NOTE]
> type can be marketplace/marketplace_with_plan/custom
> Note that using a image of type 'marketplace_with_plan' will require that the image in question has been used at least once in the subscription. This is because the first usage prompts the user to accept the License terms and the automation has no mean to approve it.



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
> | Variable                                         | Description                                                                       | Type       |
> | ------------------------------------------------ | --------------------------------------------------------------------------------- | ---------- |
> | `user_keyvault_id`	                             | Azure resource identifier for the user key vault                                  | Optional	  |
> | `spn_keyvault_id`                                | Azure resource identifier for the key vault containing the deployment credentials | Optional	  |
> | `deployer_private_key_secret_name`               | The Azure Key Vault secret name for the deployer private key                      | Optional	  |
> | `deployer_public_key_secret_name`                | The Azure Key Vault secret name for the deployer public key                       | Optional	  |
> | `deployer_username_secret_name`	                 | The Azure Key Vault secret name for the deployer username                         | Optional	  |
> | `deployer_password_secret_name`	                 | The Azure Key Vault secret name for the deployer password                         | Optional	  |
> | `additional_users_to_add_to_keyvault_policies`	 | A list of user object IDs to add to the deployment KeyVault access policies       | Optional	  |


### DNS Support


> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                          | Type     |
> | ----------------------------------- | -------------------------------------------------------------------- | -------- |
> | `dns_label`	                        | DNS name of the private DNS zone                                     | Optional |
> | `use_custom_dns_a_registration`	    | Uses an external system for DNS, set to false for Azure native       | Optional |
> | `management_dns_subscription_id`	  | Subscription ID for the subscription containing the Private DNS Zone | Optional |
> | `management_dns_resourcegroup_name`	| Resource group containing the Private DNS Zone                       | Optional |


### Other parameters

> [!div class="mx-tdCol2BreakAll "]
> | Variable                                     | Description                                                            | Type        | Notes                         |
> | -------------------------------------------- | ---------------------------------------------------------------------- | ----------- | ----------------------------- |
> | `firewall_deployment`	                       | Boolean flag controlling if an Azure firewall is to be deployed        | Optional    |                               |
> | `bastion_deployment`	                       | Boolean flag controlling if Azure Bastion host is to be deployed       | Optional    |                               |
> | `bastion_sku`	                               | SKU for Azure Bastion host to be deployed (Basic/Standard)             | Optional    |                               |
> | `enable_purge_control_for_keyvaults`         | Boolean flag controlling if purge control is enabled on the Key Vault. | Optional    | Use only for test deployments |
> | `use_private_endpoint`                       | Use private endpoints                                                  | Optional    |
> | `use_service_endpoint`                       | Use service endpoints for subnets                                      | Optional    |
> | `enable_firewall_for_keyvaults_and_storage`  | Restrict access to selected subnets                                    | Optional    |

### Example parameters file for deployer (required parameters only)

```terraform
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

# management_bastion_subnet_address_prefix is a mandatory parameter if bastion is deployed and if the subnets are not defined in the workload or if existing subnets are not used
management_bastion_subnet_address_prefix = "10.10.20.128/26"

deployer_enable_public_ip=false

firewall_deployment=true

bastion_deployment=true
```


## SAP Library

The [SAP Library](deployment-framework.md#deployment-components) provides the persistent storage of the Terraform state files and the downloaded SAP installation media for the control plane.

The configuration of the SAP Library is performed in a Terraform tfvars variable file.

### Terraform Parameters

This table shows the Terraform parameters, these parameters need to be entered manually when not using the deployment scripts

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                           | Type       | Notes |
> | ----------------------- | ------------------------------------- | ---------- | ----- |
> | `deployer_tfstate_key`  | The state file name for the deployer  | Required   | 

### Environment Parameters

This table shows the parameters that define the resource naming.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                       | Type       | Notes                                                                                       |
> | ----------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
> | `environment`           | Identifier for the control plane (max 5 chars)    | Mandatory  | For example, `PROD` for a production environment and `NP` for a non-production environment. |
> | `location`              | The Azure region in which to deploy.              | Required   | Use lower case                                                                              |
> | 'name_override_file'    | Name override file                                | Optional   | see [Custom naming](naming-module.md)                                            |

### Resource Group

This table shows the parameters that define the resource group.

> [!div class="mx-tdCol2BreakAll "]
> | Variable                | Description                                              | Type       |
> | ----------------------- | -------------------------------------------------------- | ---------- |
> | `resource_group_name`   | Name of the resource group to be created                 | Optional   |
> | `resource_group_arm_id` | Azure resource identifier for an existing resource group | Optional   |
> | `resourcegroup_tags`    | Tags to be associated with the resource group            | Optional   |


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

### DNS Support


> [!div class="mx-tdCol2BreakAll "]
> | Variable                            | Description                                                          | Type     |
> | ----------------------------------- | -------------------------------------------------------------------- | -------- |
> | `use_custom_dns_a_registration`	    | Use an existing Private DNS zone                                     | Optional |
> | `management_dns_subscription_id`	  | Subscription ID for the subscription containing the Private DNS Zone | Optional |
> | `management_dns_resourcegroup_name`	| Resource group containing the Private DNS Zone                       | Optional |
> | `dns_label`	                        | DNS name of the private DNS zone                                     | Optional |


### Extra parameters


> [!div class="mx-tdCol2BreakAll "]
> | Variable                                     | Description                         | Type     |
> | -------------------------------------------- | ----------------------------------- | -------- |
> | `use_private_endpoint`                       | Use private endpoints               | Optional |
> | `use_service_endpoint`                       | Use service endpoints for subnets   | Optional |
> | `enable_firewall_for_keyvaults_and_storage`  | Restrict access to selected subnets | Optional |

### Example parameters file for sap library (required parameters only)

```terraform
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment = "MGMT"

# The location/region value is a mandatory field, it is used to control where the resources are deployed
location = "westeurope"

```


## Next steps

> [!div class="nextstepaction"]
> [Configure SAP system](configure-system.md)
