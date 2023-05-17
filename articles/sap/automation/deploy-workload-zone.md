---
title: About workload zone deployment in automation framework
description: Overview of the SAP workload zone deployment process within the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Workload zone deployment in SAP automation framework

An [SAP application](deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. The [SAP on Azure Deployment Automation Framework](deployment-framework.md) refers to these tiers as [workload zones](deployment-framework.md#deployment-components).

You can use workload zones in multiple Azure regions. Each workload zone then has its own Azure Virtual Network (Azure VNet)

The following services are provided by the SAP workload zone:

- Azure Virtual Network, including subnets and network security groups.
- Azure Key Vault, for system credentials.
- Storage account for boot diagnostics
- Storage account for cloud witnesses

:::image type="content" source="./media/deployment-framework/workload-zone.png" alt-text="Diagram SAP Workload Zone.":::

The workload zones are typically deployed in spokes in a hub and spoke architecture. They may be in their own subscriptions.

Supports the Private DNS from the Control Plane.


## Core configuration

The following example parameter file shows only required parameters.

```bash
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

```azurecli
az role assignment create --assignee <appId> \
    --scope /subscriptions/<subscriptionID> \
    --role "User Access Administrator"
```

## Deploying the SAP Workload zone

The sample Workload Zone configuration file `DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

Running the command below will deploy the SAP Workload Zone.

# [Linux](#tab/linux)

> [!TIP]
> Perform this task from the deployer.

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -R sap-automation/samples/WORKSPACES WORKSPACES

```


```bash

export subscriptionId="<subscriptionId>"
export         spn_id="<appId>"
export     spn_secret="<password>"
export      tenant_id="<tenantId>"
export       env_code="MGMT"
export    region_code="<region_code>"

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export ARM_SUBSCRIPTION_ID="${subscriptionId}"

${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                                                       \
    --deployer_parameter_file DEPLOYER/${env_code}-${region_code}-DEP00-INFRASTRUCTURE/${env_code}-${region_code}-DEP00-INFRASTRUCTURE.tfvars  \
    --library_parameter_file LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars                      \
    --subscription "${subscriptionId}"                                                                                                         \
    --spn_id "${spn_id}"                                                                                                                       \
    --spn_secret "${spn_secret}"                                                                                                               \
    --tenant_id "${tenant_id}"                                                                                                                 \
    --auto-approve
```
# [Windows](#tab/windows)

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell

cd C:\Azure_SAP_Automated_Deployment

xcopy sap-automation\samples\WORKSPACES WORKSPACES

```


```powershell
$subscription="<subscriptionID>"
$spn_id="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"
$keyvault=<keyvaultName>
$storageaccount=<storageaccountName>
$statefile_subscription=<statefile_subscription>
$region_code="WEEU"

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-$region_code-SAP01-INFRASTRUCTURE

New-SAPWorkloadZone -Parameterfile DEV-$region_code-SAP01-INFRASTRUCTURE.tfvars
-Subscription $subscription -SPN_id $spn_id -SPN_password $spn_secret -Tenant_id $tenant_id
-State_subscription $statefile_subscription -Vault $keyvault -$StorageAccountName $storageaccount
```

---

> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<appID>`, `<password>`, `<tenant>` values with the output values of the SPN creation
> Replace `<keyvault>` with the deployer key vault name
> Replace `<storageaccount>` with the name of the storage account containing the Terraform state files
> Replace `<statefile_subscription>` with the subscription ID for the storage account containing the Terraform state files

# [Azure DevOps](#tab/devops)

Open (https://dev.azure.com) and go to your Azure DevOps Services project.

> [!NOTE]
> Ensure that the 'Deployment_Configuration_Path' variable in the 'SDAF-General' variable group is set to the folder that contains your configuration files, for this example you can use 'samples/WORKSPACES'.

The deployment will use the configuration defined in the Terraform variable file located in the 'samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE' folder.

Run the pipeline by selecting the _Deploy workload zone_ pipeline from the Pipelines section. Enter the workload zone configuration name and the deployer environment name. Use 'DEV-WEEU-SAP01-INFRASTRUCTURE' as the Workload zone configuration name and 'MGMT' as the Deployer Environment Name.

You can track the progress in the Azure DevOps Services portal. Once the deployment is complete, you can see the Workload Zone details in the _Extensions_ tab.

---


> [!TIP]
> If the scripts fail to run, it can sometimes help to clear the local cache files by removing `~/.sap_deployment_automation/` and `~/.terraform.d/` directories before running the scripts again.

## Next steps

> [!div class="nextstepaction"]
> [About SAP system deployment in automation framework](configure-system.md)
