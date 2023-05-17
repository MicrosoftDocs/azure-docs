---
title: About Control Plane deployment for the SAP on Azure Deployment Automation Framework
description: Overview of the Control Plan deployment process within the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-azurecli
---

# Deploy the control plane

The control plane deployment for the [SAP on Azure Deployment Automation Framework](deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

## Prepare the deployment credentials

The SAP Deployment Frameworks uses Service Principals when doing the deployments. You can create the Service Principal for the Control Plane deployment using the following steps using an account with permissions to create Service Principals:

```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"
  
```

> [!IMPORTANT]
> The name of the Service Principal must be unique.
>
> Record the output values from the command.
   > - appId
   > - password
   > - tenant

Optionally assign the following permissions to the Service Principal: 

```azurecli
az role assignment create --assignee <appId> --role "User Access Administrator" --scope /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>
```


## Prepare the webapp
This step is optional. If you would like a browser-based UX to help the configuration of SAP workload zones and systems, run the following commands before deploying the control plane.

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

It's currently not possible to perform this action from Azure DevOps.

---


## Deploy the control plane
   
The sample Deployer configuration file `MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `MGMT-WEEU-SAP_LIBRARY.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folder.

Running the following command creates the Deployer, the SAP Library and adding the Service Principal details to the deployment key vault. If you followed the web app setup in the step above, this command will also create the infrastructure to host the application. 

# [Linux](#tab/linux)

You can copy the sample configuration files to start testing the deployment automation framework.

Run the following command to deploy the control plane:

```bash

az logout
az login
cd ~/Azure_SAP_Automated_Deployment/samples/WORKSPACES

    export subscriptionId="<subscriptionId>"
    export         spn_id="<appId>"
    export     spn_secret="<password>"
    export      tenant_id="<tenantId>"
    export       env_code="MGMT"
    export    region_code="WEEU"

    export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    export ARM_SUBSCRIPTION_ID="${subscriptionId}"
    export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/samples/Terraform/WORKSPACES"
    export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"


    ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh                                                                             \
        --deployer_parameter_file DEPLOYER/${env_code}-${region_code}-DEP00-INFRASTRUCTURE/${env_code}-${region_code}-DEP00-INFRASTRUCTURE.tfvars \
        --library_parameter_file "LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"                   \
        --subscription "${subscriptionId}"                                                                                                        \
        --spn_id "${spn_id}"                                                                                                                      \
        --spn_secret "${spn_secret}"                                                                                                              \
        --tenant_id "${tenant_id}"                                                                                                                \
        --auto-approve
```

# [Windows](#tab/windows)

You can't perform this action from Windows
# [Azure DevOps](#tab/devops)

Open (https://dev.azure.com) and go to your Azure DevOps project.

> [!NOTE]
> Ensure that the 'Deployment_Configuration_Path' variable in the 'SDAF-General' variable group is set to the folder that contains your configuration files, for this example you can use 'samples/WORKSPACES'.

The deployment uses the configuration defined in the Terraform variable files located in the 'WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE' and 'WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY' folders. 

Run the pipeline by selecting the _Deploy control plane_ pipeline from the Pipelines section. Enter the configuration names for the deployer and the SAP library. Use 'MGMT-WEEU-DEP00-INFRASTRUCTURE' as the Deployer configuration name and 'MGMT-WEEU-SAP_LIBRARY' as the SAP Library configuration name.

:::image type="content" source="media/devops/automation-run-pipeline.png" alt-text="Screenshot of Azure DevOps run pipeline dialog.":::

You can track the progress in the Azure DevOps portal. Once the deployment is complete, you can see the Control Plane details in the _Extensions_ tab.

 :::image type="content" source="media/devops/automation-run-pipeline-control-plane.png" alt-text="Screenshot of the run Azure DevOps pipeline run results.":::

---

### Manually configure the deployer using Azure Bastion

Connect to the deployer by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the resource group containing the deployer virtual machine.

1. Connect to the virtual machine using Azure Bastion.

1. The default username is *azureadm*

1. Choose *SSH Private Key from Azure Key Vault* 

1. Select the subscription containing the control plane.

1. Select the deployer key vault.

1. From the list of secrets choose the secret ending with *-sshkey*.

1. Connect to the virtual machine.

Run the following script to configure the deployer.

```bash

mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation-bootstrap.git config

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script installs Terraform and Ansible and configure the deployer.

### Manually configure the deployer

> [!NOTE] 
>You need to connect to the deployer virtual Machine from a computer that is able to reach the Azure Virtual Network

Connect to the deployer by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `MGMT[REGION]DEP00user`. Filter by the **Resource group** or **Location** if necessary.

1. Select **Secrets** from the **Settings** section in the left pane.

1. Find and select the secret containing **sshkey**. It might look like this: `MGMT-[REGION]-DEP00-sshkey`

1. On the secret's page, select the current version. Then, copy the **Secret value**.

1. Open a plain text editor. Copy in the secret value. 
 
1. Save the file where you keep SSH keys. For example, `C:\\Users\\<your-username>\\.ssh`. 
 
1. Save the file. If you're prompted to **Save as type**, select **All files** if **SSH** isn't an option. For example, use `deployer.ssh`.

1. Connect to the deployer VM through any SSH client such as Visual Studio Code. Use the private IP address of the deployer, and the SSH key you downloaded. For instructions on how to connect to the Deployer using Visual Studio Code see [Connecting to Deployer using Visual Studio Code](tools-configuration.md#configuring-visual-studio-code). If you're using PuTTY, convert the SSH key file first using PuTTYGen.

> [!NOTE] 
>The default username is *azureadm*

Configure the deployer using the following script:


```bash
mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation-bootstrap.git config

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script installs Terraform and Ansible and configure the deployer.



## Next step

> [!div class="nextstepaction"]
> [Configure SAP Workload Zone](configure-workload-zone.md)
