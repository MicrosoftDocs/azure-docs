---
title: Configure the control plane for SAP Deployment Automation Framework
description: Learn about the control plane configuration parameters for the deployer VM and SAP library in SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.date: 04/07/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: sap-automation
# Customer intent: As a system administrator, I want to configure the control plane for the SAP Deployment Automation Framework, so that I can effectively manage infrastructure deployment and automation processes in Azure.
---

# Configuring the control plane

The control plane is the management infrastructure for [SAP Deployment Automation Framework](deployment-framework.md). It provides the execution environment and shared storage that the framework uses to deploy and maintain SAP workloads on Azure. Configuration of the control plane determines how the deployer virtual machine (VM) and the SAP library behave in your environment.

This article describes the Terraform parameters you use to configure the two control plane components. The deployer and the SAP library, including networking, authentication, key vault, and DNS settings.

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram that shows the SAP Deployment Automation Framework control plane components.":::

## Deployer

The [deployer](deployment-framework.md#deployment-components) is the execution engine of [SAP Deployment Automation Framework](deployment-framework.md). It's a preconfigured VM that's used for running Terraform and Ansible commands. When you use Azure DevOps, the deployer is a self-hosted agent.

You configure the deployer in a Terraform `tfvars` variable file.

If you want to use an existing resource group for the deployer, provide the Azure resource ID for the resource group by using the `resource_group_arm_id` parameter in the deployer's `tfvars` file. If the parameter isn't defined, the resource group is created using the default naming. You can change the default name using the `resource_group_name` parameter.

### Terraform parameters

This table shows the Terraform parameters. Enter these parameters manually if you aren't using the deployment scripts.

| Variable                | Description                                                                                                  | Type       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| `tfstate_resource_id`   | Azure resource identifier for the storage account in the SAP library that contains the Terraform state files | Required   |

### Environment parameters

This table shows the parameters that define the resource naming.

| Variable                         | Description                                          | Type       | Notes                                                                                       |
| -------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `environment`                    | Identifier for the control plane (maximum of five characters). | Mandatory  | For example, `PROD` for a production environment and `NP` for a nonproduction environment.  |
| `location`                       | Azure region in which to deploy.                     | Required   | Use lowercase.                                                                              |
| `codename`                       | Another component for naming the resources.       | Optional   |                                                                                             |
| `name_override_file`             | Name override file.                                  | Optional   | See [Custom naming](naming-module.md).                                                      |
| `place_delete_lock_on_resources` | Place a delete lock on the key resources.            | Optional   |                                                                                             |

### Resource group

This table shows the parameters that define the resource group.

| Variable                | Description                                              | Type       |
| ----------------------- | -------------------------------------------------------- | ---------- |
| `resourcegroup_name`    | Name of the resource group to be created                 | Optional   |
| `resourcegroup_arm_id`  | Azure resource identifier for an existing resource group | Optional   |
| `resourcegroup_tags`    | Tags to be associated with the resource group            | Optional   |

### Network parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field:

- **Green-field scenario**: The virtual network address space and the subnet address prefixes must be specified.
- **Brown-field scenario**: The Azure resource identifier for the virtual network and the subnets must be specified.

The recommended Classless Inter-Domain Routing (CIDR) of the virtual network address space is /27, which allows space for 32 IP addresses. A CIDR value of /28 only allows 16 IP addresses. If you want to include Azure Firewall, use a CIDR value of /25, because Azure Firewall requires a range of /26.

The recommended CIDR value for the management subnet is /28, which allows 16 IP addresses.
The recommended CIDR value for the firewall subnet is /26, which allows 64 IP addresses.

This table shows the networking parameters.

| Variable                                    | Description                                                                 | Type       | Notes                       |
| ------------------------------------------  | --------------------------------------------------------------------------- | ---------- | --------------------------- |
| `management_network_name`                   | The name of the virtual network into which the deployer is deployed    | Optional   | For green-field deployments |
| `management_network_logical_name`           | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE)            | Required   |                             |
| `management_network_arm_id`                 | The Azure resource identifier for the virtual network                       | Optional   | For brown-field deployments |
| `management_network_address_space`          | The address range for the virtual network                                   | Mandatory  | For green-field deployments |
|                                             |                                                                             |            |                             |
| `management_subnet_name`                    | The name of the subnet                                                      | Optional   |                             |
| `management_subnet_address_prefix`          | The address range for the subnet                                            | Mandatory  | For green-field deployments |
| `management_subnet_arm_id`                  | The Azure resource identifier for the subnet                                | Mandatory  | For brown-field deployments |
| `management_subnet_nsg_name`                | The name of the network security group                                      | Optional   |                             |
| `management_subnet_nsg_arm_id`              | The Azure resource identifier for the network security group                | Mandatory  | For brown-field deployments |
| `management_subnet_nsg_allowed_ips`         | Range of allowed IP addresses to add to Azure Firewall                      | Optional   |                             |
|                                             |                                                                             |            |                             |
| `management_firewall_subnet_arm_id`         | The Azure resource identifier for the Azure Firewall subnet                 | Mandatory  | For brown-field deployments |
| `management_firewall_subnet_address_prefix` | The address range for the subnet                                            | Mandatory  | For green-field deployments |
|                                             |                                                                             |            |                             |
| `management_bastion_subnet_arm_id`          | The Azure resource identifier for the Azure Bastion subnet                  | Mandatory  | For brown-field deployments |
| `management_bastion_subnet_address_prefix`  | The address range for the subnet                                            | Mandatory  | For green-field deployments |
|                                             |                                                                             |            |                             |
| `webapp_subnet_arm_id`                      | The Azure resource identifier for the web app subnet                        | Mandatory  | For brown-field deployments |
| `webapp_subnet_address_prefix`              | The address range for the subnet                                            | Mandatory  | For green-field deployments |
|                                             |                                                                             |            |                             |
| `use_private_endpoint`                      | Use private endpoints.                                                      | Optional   |                             |
| `use_service_endpoint`                      | Use service endpoints for subnets.                                          | Optional   |                             |

> [!NOTE]
> When you use an existing subnet for the web app, the subnet must be empty, in the same region as the resource group being deployed, and delegated to Microsoft.Web/serverFarms.

### Deployer virtual machine parameters

This table shows the parameters related to the deployer VM.

| Variable                        | Description                                                                              | Type       |
| ------------------------------- | ---------------------------------------------------------------------------------------- | ---------- |
| `deployer_size`                 | Defines the VM SKU to use, default: Standard_D4ds_v4                                     | Optional   |
| `deployer_count`                | Defines the number of deployers                                                          | Optional   |
| `deployer_image`                | Defines the VM image to use, default: Ubuntu 22.04                                       | Optional   |
| `plan`                          | Defines the plan associated to the VM image                                              | Optional   |
| `deployer_disk_type`            | Defines the disk type, default: Premium_LRS                                              | Optional   |
| `deployer_use_DHCP`             | Controls if the Azure subnet-provided IP addresses should be used (dynamic) true         | Optional   |
| `deployer_private_ip_address`   | Defines the private IP address to use                                                    | Optional   |
| `deployer_enable_public_ip`     | Defines if the deployer has a public IP                                                  | Optional   |
| `auto_configure_deployer`       | Defines if the deployer is configured with the required software (Terraform and Ansible) | Optional   |
| `add_system_assigned_identity`  | Defines if a system identity is assigned to the deployer                                     | Optional   |

The VM image is defined by using the following structure:

```terraform
xxx_vm_image  = {
  os_type         = ""
  source_image_id = ""
  publisher       = "Canonical"
  offer           = "0001-com-ubuntu-server-jammy"
  sku             = "22_04-lts"
  version         = "latest"
  type            = "marketplace"
}
```

> [!NOTE]
> The type can be `marketplace/marketplace_with_plan/custom`.
> Using an image of type `marketplace_with_plan` requires that the image in question was used at least once in the subscription. The first usage prompts the user to accept the license terms and the automation has no means to approve it.

### Authentication parameters

This section defines the parameters used for defining the VM authentication.

| Variable                                         | Description                                                                              | Type      |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------- |
| `deployer_vm_authentication_type`                | Defines the default authentication for the deployer                                      | Optional  |
| `deployer_authentication_username`               | Administrator account name                                                               | Optional  |
| `deployer_authentication_password`               | Administrator password                                                                   | Optional  |
| `deployer_authentication_path_to_public_key`     | Path to the public key used for authentication                                           | Optional  |
| `deployer_authentication_path_to_private_key`    | Path to the private key used for authentication                                          | Optional  |
| `use_spn`                                        | If defined, the deployment uses a service principal. Otherwise, it uses a managed identity.  | Optional  |

### Key vault parameters

This section describes the parameters for Azure Key Vault.

| Variable                                         | Description                                                                           | Type       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------- |
| `user_keyvault_id`                               | Azure resource identifier for the user key vault.                                     | Optional   |
| `spn_keyvault_id`                                | Azure resource identifier for the key vault that contains the deployment credentials. | Optional   |
| `deployer_private_key_secret_name`               | The key vault secret name for the deployer private key.                               | Optional   |
| `deployer_public_key_secret_name`                | The key vault secret name for the deployer public key.                                | Optional   |
| `deployer_username_secret_name`                  | The key vault secret name for the deployer username.                                  | Optional   |
| `deployer_password_secret_name`                  | The key vault secret name for the deployer password.                                  | Optional   |
| `additional_users_to_add_to_keyvault_policies`   | Provides a list of a user object ID to add to the deployment key vault access policies.         | Optional   |
| `set_secret_expiry`                              | Set expiry of 12 months for key vault secrets.                                        | Optional   |
| `soft_delete_retention_days`                     | The number of days that items should be retained in the soft delete period.           | Optional   |
| `deployer_assign_subscription_permissions`       | Controls subscription permission assignment.                                          | Optional   |

### DNS support

| Variable                            | Description                                                              | Type     |
| ----------------------------------- | ------------------------------------------------------------------------ | -------- |
| `dns_label`                         | DNS name of the Private DNS zone.                                        | Optional |
| `use_custom_dns_a_registration`     | Uses an external system for DNS, set to false for Azure native.          | Optional |
| `management_dns_subscription_id`    | Subscription ID for the subscription that contains the Private DNS zone. | Optional |
| `management_dns_resourcegroup_name` | Resource group that contains the Private DNS zone.                       | Optional |

### Other parameters

| Variable                                     | Description                                                                  | Type        | Notes                         |
| -------------------------------------------- | ---------------------------------------------------------------------------- | ----------- | ----------------------------- |
| `firewall_deployment`                        | Boolean flag that controls whether Azure Firewall is deployed.               | Optional    |                               |
| `bastion_deployment`                         | Boolean flag that controls whether Azure Bastion host is deployed.           | Optional    |                               |
| `bastion_sku`                                | SKU for the Azure Bastion host (Basic/Standard).                             | Optional    |                               |
| `enable_purge_control_for_keyvaults`         | Boolean flag that controls whether purge control is enabled on the key vault. | Optional    | Use only for test deployments. |
| `enable_firewall_for_keyvaults_and_storage`  | Restrict access to selected subnets.                                         | Optional    |
| `Agent_IP`                                   | IP address of the agent.                                                     | Optional    |
| `add_Agent_IP`                               | Controls whether the agent IP is added to the key vault and storage account firewalls. | Optional    |

### Web App parameters

| Variable                                     | Description                                                            | Type        | Notes                          |
| -------------------------------------------- | ---------------------------------------------------------------------- | ----------- | ------------------------------ |
| `use_webapp`                                 | Boolean value indicating whether a web app should be deployed.         | Optional    |                                |
| `app_service_SKU_name`                       | The SKU of the App Service Plan.                                       | Optional    |                                |
| `app_registration_app_id`                    | The app registration ID for the web app.                               | Optional    |                                |
| `webapp_client_secret`                       | The client secret for the app registration.                            | Optional    | Persisted in Key Vault.        |

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

## SAP library

The [SAP library](deployment-framework.md#deployment-components) provides the persistent storage of the Terraform state files and the downloaded SAP installation media for the control plane.

You configure the SAP library in a Terraform `tfvars` variable file.

If you want to use an existing resource group for the SAP library, provide the Azure resource ID for the resource group by using the `resource_group_arm_id` parameter in the deployer's tfvars file. If the parameter isn't defined, the resource group is created using the default naming. You can change the default name using the `resource_group_name` parameter.

### Terraform parameters

This table shows the Terraform parameters. Enter these parameters manually if you aren't using the deployment scripts or Azure Pipelines.

| Variable                | Description                           | Type       | Notes |
| ----------------------- | ------------------------------------- | ---------- | ----- |
| `deployer_tfstate_key`  | State file name for the deployer  | Required   |       |

### Environment parameters

This table shows the parameters that define the resource naming.

| Variable                | Description                                       | Type       | Notes                                                                                       |
| ----------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `environment`           | Identifier for the control plane (maximum of five characters)    | Mandatory  | For example, `PROD` for a production environment and `NP` for a nonproduction environment. |
| `location`              | Azure region in which to deploy              | Required   | Use lowercase.                                                                              |
| `name_override_file`    | Name override file                                | Optional   | See [Custom naming](naming-module.md).                                            |

### Resource group

This table shows the parameters that define the resource group.

| Variable                | Description                                              | Type       |
| ----------------------- | -------------------------------------------------------- | ---------- |
| `resourcegroup_name`    | Name of the resource group to be created                 | Optional   |
| `resourcegroup_arm_id`  | Azure resource identifier for an existing resource group | Optional   |
| `resourcegroup_tags`    | Tags to be associated with the resource group            | Optional   |

### SAP installation media storage account

| Variable                  | Description                 | Type       |
| ------------------------- | --------------------------- | ---------- |
| `library_sapmedia_arm_id` | Azure resource identifier   | Optional   |

### Terraform remote state storage account

| Variable                         | Description                | Type       |
| -------------------------------- | -------------------------- | ---------- |
| `library_terraform_state_arm_id` | Azure resource identifier  | Optional   |

### DNS support

| Variable                            | Description                                                          | Type     |
| ----------------------------------- | -------------------------------------------------------------------- | -------- |
| `dns_label`                         | DNS name of the Private DNS zone.                                     | Optional |
| `use_custom_dns_a_registration`     | Use an existing Private DNS zone.                                     | Optional |
| `management_dns_subscription_id`    | Subscription ID for the subscription that contains the Private DNS zone. | Optional |
| `management_dns_resourcegroup_name` | Resource group that contains the Private DNS zone.                       | Optional |

### Extra parameters

| Variable                                               | Description                                                  | Type     |
| ------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| `use_private_endpoint`                                 | Use private endpoints.                                        | Optional |
| `use_service_endpoint`                                 | Use service endpoints for subnets.                            | Optional |
| `enable_firewall_for_keyvaults_and_storage`            | Restrict access to selected subnets.                          | Optional |
| `subnets_to_add_to_firewall_for_keyvaults_and_storage` | Subnets that need access to key vaults and storage accounts. | Optional |

### Example parameters file for the SAP library (required parameters only)

```terraform
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment = "MGMT"

# The location/region value is a mandatory field, it is used to control where the resources are deployed
location = "westeurope"
```

## Next step

> [!div class="nextstepaction"]
> [Configure SAP system](configure-workload-zone.md)
