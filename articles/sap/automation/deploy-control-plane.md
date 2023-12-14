---
title: Deploy the control plane for SAP Deployment Automation Framework
description: Overview of the control plane deployment process in SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 05/19/2023
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-azurecli
---

# Deploy the control plane

The control plane deployment for [SAP Deployment Automation Framework](deployment-framework.md) consists of the:

- Deployer
- SAP library

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram that shows the control plane.":::

## Prepare the deployment credentials

SAP Deployment Automation Framework uses service principals for deployments. To create a service principal for the control plane deployment, use an account that has permissions to create service principals:

```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"
  
```

> [!IMPORTANT]
> The name of the service principal must be unique.
>
> Record the output values from the command:
   > - appId
   > - password
   > - tenant

Optionally, assign the following permissions to the service principal:

```azurecli
az role assignment create --assignee <appId> --role "User Access Administrator" --scope /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>
```


## Deploy the control plane

All the artifacts that are required to deploy the control plane are located in GitHub repositories.

Prepare for the control plane deployment by cloning the repositories using the following commands:


```bash
mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

```

The sample deployer configuration file `MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/Terraform/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP library configuration file `MGMT-WEEU-SAP_LIBRARY.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/Terraform/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folder.

You can copy the sample configuration files to start testing the deployment automation framework.

A minimal Terraform file for the `DEPLOYER` might look like this example:

```terraform
# The environment value is a mandatory field, it is used for partitioning the environments.
environment = "MGMT"
# The location/region value is a mandatory field, it is used to control where the resources are deployed
location = "westeurope"

# management_network_address_space is the address space for management virtual network
management_network_address_space = "10.10.20.0/25"
# management_subnet_address_prefix is the address prefix for the management subnet
management_subnet_address_prefix = "10.10.20.64/28"

# management_firewall_subnet_address_prefix is the address prefix for the firewall subnet
management_firewall_subnet_address_prefix = "10.10.20.0/26"
firewall_deployment = false

# management_bastion_subnet_address_prefix is the address prefix for the bastion subnet
management_bastion_subnet_address_prefix = "10.10.20.128/26"
bastion_deployment = true

# deployer_enable_public_ip controls if the deployer Virtual machines will have Public IPs
deployer_enable_public_ip = false

# deployer_count defines how many deployer VMs will be deployed
deployer_count = 1

# use_service_endpoint defines that the management subnets have service endpoints enabled
use_service_endpoint = true

# use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
use_private_endpoint = false

# enable_firewall_for_keyvaults_and_storage defines that the storage accounts and key vaults have firewall enabled
enable_firewall_for_keyvaults_and_storage = false

# public_network_access_enabled controls if storage account and key vaults have public network access enabled
public_network_access_enabled = true

```

Note the Terraform variable file locations for future edits during deployment.

A minimal Terraform file for the `LIBRARY` might look like this example:

```terraform
# The environment value is a mandatory field, it is used for partitioning the environments, for example, PROD and NP.
environment = "MGMT"
# The location/region value is a mandatory field, it is used to control where the resources are deployed
location = "westeurope"

#Defines the DNS suffix for the resources
dns_label = "azure.contoso.net"

# use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
use_private_endpoint = false
```


Note the Terraform variable file locations for future edits during deployment.

Run the following command to create the deployer and the SAP library. The command adds the service principal details to the deployment key vault.

# [Linux](#tab/linux)

Set the environment variables for the service principal:

```bash

export ARM_SUBSCRIPTION_ID="<subscriptionId>"
export       ARM_CLIENT_ID="<appId>"
export   ARM_CLIENT_SECRET="<password>"
export       ARM_TENANT_ID="<tenantId>"

```

Run the following command to deploy the control plane:

```bash

export            env_code="MGMT"
export         region_code="WEEU"
export           vnet_code="DEP00"

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

az logout
az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES


deployer_parameter_file="${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"
library_parameter_file="${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"

${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh  \
    --deployer_parameter_file "${deployer_parameter_file}"         \
    --library_parameter_file "${library_parameter_file}"            \
    --subscription "${ARM_SUBSCRIPTION_ID}"                        \
    --spn_id "${ARM_CLIENT_ID}"                                    \
    --spn_secret "${ARM_CLIENT_SECRET}"                            \
    --tenant_id "${ARM_TENANT_ID}"
```

# [Windows](#tab/windows)

You can't perform a control plane deployment from Windows.

# [Azure DevOps](#tab/devops)

Open [Azure DevOps](https://dev.azure.com) and go to your Azure DevOps project.

Ensure that the `Deployment_Configuration_Path` variable in the `SDAF-General` variable group is set to the folder that contains your configuration files. For this example, you can use `samples/WORKSPACES`.

The deployment uses the configuration defined in the Terraform variable files located in the `WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` and `WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folders.

Run the pipeline by selecting the `Deploy control plane` pipeline from the **Pipelines** section. Enter the configuration names for the deployer and the SAP library. Use `MGMT-WEEU-DEP00-INFRASTRUCTURE` as the deployer configuration name and `MGMT-WEEU-SAP_LIBRARY` as the SAP library configuration name.

:::image type="content" source="media/devops/automation-run-pipeline.png" alt-text="Screenshot that shows the Azure DevOps Run pipeline dialog.":::

You can track the progress in the Azure DevOps portal. After the deployment is finished, you can see the control plane details on the **Extensions** tab.

 :::image type="content" source="media/devops/automation-run-pipeline-control-plane.png" alt-text="Screenshot that shows the run Azure DevOps pipeline run results.":::

---

### Manually configure a virtual machine as a SDAF deployer by using Azure Bastion

To connect to the deployer:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the resource group that contains the deployer virtual machine (VM).

1. Connect to the VM by using Azure Bastion.

1. The default username is **azureadm**.

1. Select **SSH Private Key from Azure Key Vault**.

1. Select the subscription that contains the control plane.

1. Select the deployer key vault.

1. From the list of secrets, choose the secret that ends with **-sshkey**.

1. Connect to the VM.

Run the following script to configure the deployer:

```bash

mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation-bootstrap.git config

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script installs Terraform and Ansible and configures the deployer.

### Manually configure a virtual machine as a SDAF deployer 

Connect to the deployer VM from a computer that can reach the Azure virtual network.

To connect to the deployer:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `MGMT[REGION]DEP00user`. Filter by the **Resource group** or **Location**, if necessary.

1. On the **Settings** section in the left pane, select **Secrets**.

1. Find and select the secret that contains **sshkey**. It might look like `MGMT-[REGION]-DEP00-sshkey`.

1. On the secret's page, select the current version. Then copy the **Secret value**.

1. Open a plain text editor. Copy the secret value.

1. Save the file where you keep SSH keys. An example is `C:\Users\<your-username>\.ssh`.

1. Save the file. If you're prompted to **Save as type**, select **All files** if **SSH** isn't an option. For example, use `deployer.ssh`.

1. Connect to the deployer VM through any SSH client, such as Visual Studio Code. Use the private IP address of the deployer and the SSH key you downloaded. For instructions on how to connect to the deployer by using Visual Studio Code, see [Connect to the deployer by using Visual Studio Code](tools-configuration.md#configure-visual-studio-code). If you're using PuTTY, convert the SSH key file first by using PuTTYGen.

> [!NOTE]
>The default username is **azureadm**.

Configure the deployer by using the following script:

```bash
mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation-bootstrap.git config

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script installs Terraform and Ansible and configures the deployer.

## Securing the control plane

The control plane is the most critical part of the SAP automation framework. It's important to secure the control plane. The following steps help you secure the control plane.
If you have created your control plane using an external virtual machine or by using the cloud shell, you should secure the control plane by implementing private endpoints for the storage accounts and key vaults.

Log on to the deployer virtual machine and copy the control plane configuration `tfvars` terraform files to the deployer. Ensure that the files are located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES` DEPLOYER and LIBRARY folders.

Ensure that the `use_private_endpoint` variable is set to `true` in the `DEPLOYER` and `LIBRARY` configuration files. Also ensure that `public_network_access_enabled` is set to `false` in the `DEPLOYER`  configuration files.

```terraform

# use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
use_private_endpoint = true

# public_network_access_enabled controls if storage account and key vaults have public network access enabled
public_network_access_enabled = false

```

Rerun the control plane deployment to enable private endpoints for the storage accounts and key vaults.

```bash


export            env_code="MGMT"
export         region_code="WEEU"
export           vnet_code="DEP00"
export  storageaccountname=<storageaccountname>

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

az logout
az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

deployer_parameter_file="${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"
library_parameter_file="${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"

${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh  \
    --deployer_parameter_file "${deployer_parameter_file}"         \
    --library_parameter_file "${library_parameter_file}"            \
    --subscription "${ARM_SUBSCRIPTION_ID}"                        \
    --spn_id "${ARM_CLIENT_ID}"                                    \
    --spn_secret "${ARM_CLIENT_SECRET}"                            \
    --tenant_id "${ARM_TENANT_ID}"                                 \
    --storageaccountname "${storageaccountname}"                   \
    --recover
```


## Prepare the web app
This step is optional. If you want a browser-based UX to help the configuration of SAP workload zones and systems, run the following commands before you deploy the control plane.

# [Linux](#tab/linux)

```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json

region_code=WEEU

export TF_VAR_app_registration_app_id=$(az ad app create \
    --display-name ${region_code}-webapp-registration \
    --enable-id-token-issuance true \
    --sign-in-audience AzureADMyOrg \
    --required-resource-access @manifest.json \
    --query "appId" | tr -d '"')

export TF_VAR_webapp_client_secret=$(az ad app credential reset \
    --id $TF_VAR_app_registration_app_id --append               \
    --query "password" | tr -d '"')

export TF_VAR_use_webapp=true
rm manifest.json

```
# [Windows](#tab/windows)

```powershell

Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'

$region_code="WEEU"

$env:TF_VAR_app_registration_app_id = (az ad app create `
    --display-name $region_code-webapp-registration     `
    --required-resource-accesses ./manifest.json        `
    --query "appId").Replace('"',"")

$env:TF_VAR_webapp_client_secret=(az ad app credential reset `
    --id $env:TF_VAR_app_registration_app_id --append            `
    --query "password").Replace('"',"")

$env:TF_VAR_use_webapp="true"

del manifest.json

```

# [Azure DevOps](#tab/devops)

Currently, it isn't possible to perform this action from Azure DevOps.

---

## Next step

> [!div class="nextstepaction"]
> [Configure SAP workload zone](configure-workload-zone.md)
