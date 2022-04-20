---
title: About Control Plane deployment for the SAP Deployment automation framework
description: Overview of the Control Plan deployment process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Deploy the control plane

The control plane deployment for the [SAP deployment automation framework on Azure](automation-deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/automation-deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

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

## Deploy the control plane
   
The sample Deployer configuration file `MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `MGMT-WEEU-SAP_LIBRARY.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folder.

Running the command below will create the Deployer, the SAP Library and add the Service Principal details to the deployment key vault.

# [Linux](#tab/linux)

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp sap-automation/samples/WORKSPACES WORKSPACES

```

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

az logout
az login
export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-automation
export  ARM_SUBSCRIPTION_ID=<subscriptionID>
export       subscriptionID=<subscriptionID>
export               spn_id=<appID>
export           spn_secret=<password>
export            tenant_id=<tenant>
export          region_code=WEEU

${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                                            \
        --deployer_parameter_file DEPLOYER/MGMT-${region_code}-DEP00-INFRASTRUCTURE/MGMT-${region_code}-DEP00-INFRASTRUCTURE.tfvars \
        --library_parameter_file LIBRARY/MGMT-${region_code}-SAP_LIBRARY/MGMT-${region_code}-SAP_LIBRARY.tfvars                     \
        --subscription $subscriptionID                                                                                              \
        --spn_id "${spn_id}"                                                                                                        \
        --spn_secret "${spn_secret}"                                                                                                \
        --tenant_id "${tenant_id}"
```

# [Windows](#tab/windows)

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell

cd C:\Azure_SAP_Automated_Deployment

xcopy /E sap-automation\samples\WORKSPACES WORKSPACES

```



```powershell


$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars -Subscription $subscription -SPN_id $appId -SPN_password $spn_secret -Tenant_id $tenant_id
```
---


> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<appID>`, `<password>`, `<tenant>` values with the output values of the SPN creation


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
mkdir -p ~/Azure_SAP_Automated_Deployment

cd ~/Azure_SAP_Automated_Deployment

git clone https://github.com/Azure/sap-automation.git

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script will install Terraform and Ansible and configure the deployer.

### Manually configure the deployer (deployments without public IP)

If you deploy the deployer without a public IP Terraform isn't able to configure the deployer Virtual Machine as it will not be able to connect to it. 

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

1. Connect to the deployer VM through any SSH client such as VSCode. Use the private IP address of the deployer, and the SSH key you downloaded. For instructions on how to connect to the Deployer using VSCode see [Connecting to Deployer using VSCode](automation-tools-configuration.md#configuring-visual-studio-code). If you're using PuTTY, convert the SSH key file first using PuTTYGen.

> [!NOTE] 
>The default username is *azureadm*

Configure the deployer using the following script:


```bash
mkdir -p ~/Azure_SAP_Automated_Deployment

cd ~/Azure_SAP_Automated_Deployment

git clone https://github.com/Azure/sap-automation.git

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script will install Terraform and Ansible and configure the deployer.

## Next step

> [!div class="nextstepaction"]
> [Configure SAP Workload Zone](automation-configure-workload-zone.md)


