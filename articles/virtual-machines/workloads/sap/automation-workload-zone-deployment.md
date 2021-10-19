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

You can use workload zones in multiple Azure regions. Each workload zone then has its own Azure Virtual Network (Azure VNet)

The following services are provided by the SAP workload zone:

- Azure Virtual Network, including subnets and network security groups.
- Azure Key Vault, for system credentials.
- Storage account for boot diagnostics
- Storage account for cloud witnesses

:::image type="content" source="./media/automation-deployment-framework/WorkloadZone.png" alt-text="Diagram SAP Workload Zone.":::

The workload zones are typically deployed in spokes in a hub and spoke architecture. They may be in their own subscriptions.

Supports the Private DNS from the Control Plane.


### Minimal configuration

The following example parameter file shows only required parameters.

```azurecli-interactive
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment="DEV"

# The location value is a mandatory field, it is used to control where the resources are deployed
location="westeurope"

# The network logical name is mandatory - it is used in the naming convention and should map to the workload virtual network logical name 
network_name="SAP01"

# network_address_space is a mandatory parameter when an existing Virtual network is not used
network_address_space="10.110.0.0/16"

# admin_subnet_address_prefix is a mandatory parameter if the subnets are not defined in the workload or if existing subnets are not used
admin_subnet_address_prefix="10.110.0.0/19"

# db_subnet_address_prefix is a mandatory parameter if the subnets are not defined in the workload or if existing subnets are not used
db_subnet_address_prefix="10.110.96.0/19"

# app_subnet_address_prefix is a mandatory parameter if the subnets are not defined in the workload or if existing subnets are not used
app_subnet_address_prefix="10.110.32.0/19"

# The automation_username defines the user account used by the automation
automation_username="azureadm"

```

### Comprehensive example

A comprehensive sample can be found in the ´sap-hana/deploy/samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE´ folder

## Deploy SAP workload zone

## Preparing the Workload zone deployment credentials

The SAP Deployment Frameworks uses Service Principals when doing the deployment. You can create the Service Principal for the Workload Zone deployment using the following steps using an account with permissions to create Service Principals:


```azurecli-interactive
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"
  
```

> [!IMPORTANT]
> The name of the Service Principal must be unique.
>
> Record the output values from the command.
   > - appId
   > - password
   > - tenant

Assign the correct permissions to the Service Principal: 

```azurecli-interactive
az role assignment create --assignee <appId> --role "User Access Administrator"
```

## Deploying the SAP Workload zone
   
The sample Workload Zone configuration file `DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

Running the command below will deploy the SAP Workload Zone.

# [Linux](#tab/linux)

> [!TIP]
> Perform this task from the deployer.

```azurecli-interactive
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

subscriptionID=<subscriptionID>
appId=<appID>
spn_secret=<password>
tenant_id=<tenant>
keyvault=<keyvaultName>
storageaccount=<storageaccountName>
statefile_subscription=<statefile_subscription>

${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh                                                  \
        --parameter_file LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE/DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars           \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                     \
        --keyvault $keyvault                                                                                    \
        --state_subscription $statefile_subscription                                                            \
        --subscription $subscriptionID                                                                          \
        --spn_id $appID                                                                                         \
        --spn_secret "$spn_secret"                                                                              \ 
        --tenant_id $tenant
```

> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<appID>`, `<password>`, `<tenant>` values with the output values of the SPN creation
> Replace `<keyvaultName>` with the deployer key vault name
> Replace `<storageaccountName>` with the name of the storage account containing the Terraform state files
> Replace `<statefile_subscription>` with the subscription ID for the storage account containing the Terraform state files


# [Windows](#tab/windows)

```powershell-interactive
$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"
$keyvault=<keyvaultName>
$storageaccount=<storageaccountName>
$statefile_subscription=<statefile_subscription>

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES

New-SAPWorkloadZone -Parameterfile .\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE\DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars 
-Subscription $subscription -SPN_id $appId -SPN_password $spn_secret -Tenant_id $tenant_id
-State_subscription $statefile_subscription -Vault $keyvault -$StorageAccountName $storageaccount
```
> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<appID>`, `<password>`, `<tenant>` values with the output values of the SPN creation
> Replace `<keyvaultName>` with the deployer key vault name
> Replace `<storageaccountName>` with the name of the storage account containing the Terraform state files
> Replace `<statefile_subscription>` with the subscription ID for the storage account containing the Terraform state files

## Appendix 

The configuration of the SAP workload zone is done via a Terraform tfvars variable file.

### Terraform Parameters

The table below contains the Terraform parameters, these parameters need to be entered manually if not using the deployment scripts

| Variable                | Type       | Description                           | 
| ----------------------- | ---------- | ------------------------------------- | 
| `tfstate_resource_id`   | Required * | Azure resource identifier for the Storage account in the SAP Library that will contain the Terraform state files  |
| `deployer_tfstate_key`  | Required * | The name of the state file for the Deployer  |
### Generic Parameters

The table below contains the parameters that define the resource group and the resource naming.

| Variable                | Type       | Description                           | 
| ----------------------- | ---------- | ------------------------------------- | 
| `environment`           | Required   | A five-character identifier for the workload zone. For example, `PROD` for a production environment and `NP` for a non-production environment. |
| `location`              | Required   | The Azure region in which to deploy.     |
| `resource_group_name`   | Optional   | Name of the resource group to be created |
| `resource_group_arm_id` | Optional   | Azure resource identifier for an existing resource group |

### Network Parameters

The automation framework supports both creating the virtual network and the subnets (green field) or using an existing virtual network and existing subnets (brown field) or a combination of green field and brown field.
 - For the green field scenario, the virtual network address space and the subnet address prefixes must be specified 
 - For the brown field scenario, the Azure resource identifier for the virtual network and the subnets must be specified

Ensure that the virtual network address space is large enough to host all the resources

The table below contains the networking parameters.

| Variable                         | Type        | Description                           | Notes  |
| -------------------------------- | ----------- | ------------------------------------- | ------ |
| `network_name`                   | Required    | The logical name of the network (DEV-WEEU-MGMT01-INFRASTRUCTURE) | |
| `network_arm_id`                 | Optional *  | The Azure resource identifier for the virtual network | Mandatory for brown field deployments |
| `network_address_space`          | Mandatory * | The address range for the virtual network | Mandatory for green field.  |
| `admin_subnet_name`              | Optional    | The name of the 'admin' subnet | |
| `admin_subnet_address_prefix`    | Mandatory * | The address range for the 'admin' subnet | Mandatory for green field deployments |
| `admin_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'admin' subnet | Mandatory for brown field deployments |
| `admin_subnet_nsg_name`          | Optional	 | The name of the 'admin' Network Security Group name | |
| `admin_subnet_nsg_arm_id`        | Mandatory * | The Azure resource identifier for the 'admin' Network Security Group | Mandatory for brown field deployments |
| `db_subnet_name`                 | Optional    | The name of the 'db' subnet | |
| `db_subnet_address_prefix`       | Mandatory * | The address range for the 'db' subnet | Mandatory for green field deployments |
| `db_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'db' subnet | Mandatory for brown field deployments |
| `db_subnet_nsg_name`             | Optional	 | The name of the 'db' Network Security Group name | |
| `db_subnet_nsg_arm_id`           | Mandatory * | The Azure resource identifier for the 'db' Network Security Group | Mandatory for brown field deployments |
| `app_subnet_name`                | Optional    | The name of the 'app' subnet | |
| `app_subnet_address_prefix`      | Mandatory * | The address range for the 'app' subnet | Mandatory for green field deployments |
| `app_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'app' subnet | Mandatory for brown field deployments |
| `app_subnet_nsg_name`            | Optional	 | The name of the 'app' Network Security Group name | |
| `app_subnet_nsg_arm_id`          | Mandatory * | The Azure resource identifier for the 'app' Network Security Group | Mandatory for brown field deployments |
| `web_subnet_name`                | Optional    | The name of the 'web' subnet | |
| `web_subnet_address_prefix`      | Mandatory * | The address range for the 'web' subnet | Mandatory for green field deployments |
| `web_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'web' subnet | Mandatory for brown field deployments |
| `web_subnet_nsg_name`            | Optional	 | The name of the 'web' Network Security Group name | |
| `web_subnet_nsg_arm_id`          | Mandatory * | The Azure resource identifier for the 'web' Network Security Group | Mandatory for brown field deployments |

### ISCI Parameters

| Variable                         | Type        | Description                           | Notes  |
| -------------------------------- | ----------- | ------------------------------------- | ------ |
| `iscsi_subnet_name`              | Optional    | The name of the 'iscsi' subnet | |
| `iscsi_subnet_address_prefix`    | Mandatory * | The address range for the 'iscsi' subnet | Mandatory for green field deployments |
| `iscsi_subnet_arm_id`	           | Mandatory * | The Azure resource identifier for the 'iscsi' subnet | Mandatory for brown field deployments |
| `iscsi_subnet_nsg_name`          | Optional	 | The name of the 'iscsi' Network Security Group name | |
| `iscsi_subnet_nsg_arm_id`        | Mandatory * | The Azure resource identifier for the 'iscsi' Network Security Group | Mandatory for brown field deployments |
| `iscsi_count`                    | Optional    | The number of iSCSI Virtual Machines |
| `iscsi_use_DHCP`                 | Optional    | Controls if Azure subnet provided IP addresses (dynamic) should be used |
| `iscsi_image`	                   | Optional	 | Defines the Virtual machine image to use, see below | 
| `iscsi_authentication_type`      | Optional	 | Defines the default authentication for the iSCSI Virtual Machines |
| `iscsi__authentication_username` | Optional	 | Administrator account name |
| `iscsi_nic_ips`                  | Optional    | IP addresses for the iSCSI Virtual Machines, ignored if `iscsi_use_DHCP` is defined|
 
```json 
{ 
os_type=""
source_image_id=""
publisher="SUSE"
offer="sles-sap-12-sp5"
sku="gen1"
version="latest"
}
```

### Key Vault Parameters

The table below defines the parameters used for defining the Key Vault information

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| `user_keyvault_id`	             | Optional	   | Azure resource identifier for the user key vault |
| `spn_keyvault_id`                  | Optional	   | Azure resource identifier for the user key vault containing the deployment credentials (SPNs) |

### DNS

| Variable                           | Type        | Description                           | 
| ---------------------------------- | ----------- | ------------------------------------- | 
| `dns_label`                        | Optional    | If specified, is the DNS name of the private DNS zone | 
| `dns_resource_group_name`          | Optional    | The name of the resource group containing the Private DNS zone | 

### Azure NetApp support

| Variable                           | Type        | Description                           | Notes  |
| ---------------------------------- | ----------- | ------------------------------------- | ------ |
| `use_ANF`                          | Optional    | If specified, deploys the Azure NetApp Files Account and Capacity Pool  | 
| `ANF_account_arm_id`               | Optional    | Azure resource identifier for the Azure NetApp Files Account  | Mandatory for brown field deployments |
| `ANF_account_name`                 | Optional    | Name for the Azure NetApp Files Account  | 
| `ANF_service_level`                | Optional    | Service level for the Azure NetApp Files Capacity Pool  | 
| `ANF_pool_size`                    | Optional    | The size (in GB) of the Azure NetApp Files Capacity Pool  | 
| `anf_subnet_name`                  | Optional    | The name of the ANF subnet  | 
| `anf_subnet_arm_id`                | Required *  | The Azure resource identifier for the 'ANF' subnet | Mandatory for brown field deployments |
| `anf_subnet_address_prefix`        | Required *  | The address range for the 'ANF' subnet  | Mandatory for green field deployments |


### Other parameters

| Variable                             | Type        | Description                           | Notes  |
| ------------------------------------ | ----------- | ------------------------------------- | ------ |
| `enable_purge_control_for_keyvaults` | Optional    | Boolean flag controlling if purge control is enabled on the Key Vault. Use only for test deployments | 
| `use_private_endpoint`               | Optional    | Boolean flag controlling if private endpoints are used. | 
| `diagnostics_storage_account_arm_id` | Required *  | The Azure resource identifier for the diagnostics storage account | Mandatory for brown field deployments |
| `witness_storage_account_arm_id`     | Required *  | The Azure resource identifier for the witness storage account | Mandatory for brown field deployments |


## Next steps

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](automation-system-deployment.md)
