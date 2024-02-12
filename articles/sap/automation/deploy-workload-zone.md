---
title: About workload zone deployment in automation framework
description: Overview of the SAP workload zone deployment process within SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Workload zone deployment in the SAP automation framework

An [SAP application](deployment-framework.md#sap-concepts) typically has multiple development tiers. For example, you might have development, quality assurance, and production tiers. [SAP Deployment Automation Framework](deployment-framework.md) calls these tiers [workload zones](deployment-framework.md#deployment-components).

You can use workload zones in multiple Azure regions. Each workload zone then has its own instance of Azure Virtual Network.

The following services are provided by the SAP workload zone:

- A virtual network, including subnets and network security groups
- An Azure Key Vault instance, for system credentials
- An Azure Storage account for boot diagnostics
- A Storage account for cloud witnesses
- An Azure NetApp Files account and capacity pools (optional)
- Azure Files NFS shares (optional)

:::image type="content" source="./media/deployment-framework/workload-zone.png" alt-text="Diagram that shows an SAP workload zone.":::

The workload zones are typically deployed in spokes in a hub-and-spoke architecture. They can be in their own subscriptions.

The private DNS is supported from the control plane or from a configurable source.

## Core configuration

The following example parameter file shows only required parameters.

```bash
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment="DEV"

# The location value is a mandatory field, it is used to control where the resources are deployed
location="westeurope"

# The network logical name is mandatory - it is used in the naming convention and should map to the workload virtual network logical name
network_name="SAP01"

# network_address_space is a mandatory parameter when an existing virtual network is not used
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

## Prepare the workload zone deployment credentials

SAP Deployment Automation Framework uses service principals when doing the deployment. To create the service principal for the workload zone deployment, use an account with permissions to create service principals.

```azurecli-interactive
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"

```

> [!IMPORTANT]
> The name of the service principal must be unique.
>
> Record the output values from the command:
   > - appId
   > - password
   > - tenant

Assign the correct permissions to the service principal.

```azurecli
az role assignment create --assignee <appId> \
    --scope /subscriptions/<subscriptionID> \
    --role "User Access Administrator"
```

## Deploy the SAP workload zone

The sample workload zone configuration file `DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/Terraform/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

Run the following command to deploy the SAP workload zone.

# [Linux](#tab/linux)

Perform this task from the deployer.

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -R sap-automation/samples/WORKSPACES config

```


```bash

export  ARM_SUBSCRIPTION_ID="<subscriptionId>"
export        ARM_CLIENT_ID="<appId>"
export    ARM_CLIENT_SECRET="<password>"
export        ARM_TENANT_ID="<tenantId>"
export             env_code="DEV"
export          region_code="<region_code>"
export            vnet_code="SAP02"
export deployer_environment="MGMT"


export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/config/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"


cd "${CONFIG_REPO_PATH}/LANDSCAPE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE"
parameterFile="${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"

$SAP_AUTOMATION_REPO_PATH/deploy/scripts/install_workloadzone.sh   \
    --parameterfile "${parameterFile}"                             \
    --deployer_environment "${deployer_environment}"               \ 
    --subscription "${ARM_SUBSCRIPTION_ID}"                        \
    --spn_id "${ARM_CLIENT_ID}"                                    \
    --spn_secret "${ARM_CLIENT_SECRET}"                            \
    --tenant_id "${ARM_TENANT_ID}"
    
```

# [Windows](#tab/windows)

It isn't possible to perform the deployment from Windows.

To begin, be sure to replace:

- The sample value `<subscriptionID>` with your subscription ID.
- The `<appID>`, `<password>`, and `<tenant>` values with the output values of the SPN creation.
- The `<keyvault>` value with the deployer key vault name.
- The `<storageaccount>` value with the name of the storage account that contains the Terraform state files.
- The `<statefile_subscription>` value with the subscription ID for the storage account that contains the Terraform state files.

# [Azure DevOps](#tab/devops)

Open [Azure DevOps](https://dev.azure.com) and go to your Azure DevOps Services project.

Ensure that the `Deployment_Configuration_Path` variable in the `SDAF-General` variable group is set to the folder that contains your configuration files. For this example, you can use `samples/WORKSPACES`.

The deployment uses the configuration defined in the Terraform variable file located in the `samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

Run the pipeline by selecting the `Deploy workload zone` pipeline from the **Pipelines** section. Enter the workload zone configuration name and the deployer environment name. Use `DEV-WEEU-SAP01-INFRASTRUCTURE` as the workload zone configuration name and `MGMT` as the deployer environment name.

You can track the progress in the Azure DevOps Services portal. After the deployment is finished, you can see the workload zone details on the **Extensions** tab.

---

> [!TIP]
> If the scripts fail to run, it can sometimes help to clear the local cache files by removing the `~/.sap_deployment_automation/` and `~/.terraform.d/` directories before you run the scripts again.

## Next step

> [!div class="nextstepaction"]
> [SAP system deployment with the automation framework](configure-system.md)
