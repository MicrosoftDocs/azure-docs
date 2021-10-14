---
title: Get started with Deployment Automation Framework
description: Quickly get started with the SAP Deployment Automation Framework on Azure. Deploy an example configuration using sample parameter files.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/13/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Get started with the SAP automation framework on Azure

Get started quickly with the [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md) using sample parameter files to create an example configuration.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [download of the SAP software](automation-software.md) in your Azure environment.
- A [Terraform](https://www.terraform.io/) installation. For more information, also see the [Terraform on Azure documentation](/azure/developer/terraform/).
- An [Azure Command Line Interface (Azure CLI)](/cli/azure/install-azure-cli) installation on your local computer.
- Optionally, if you want to use PowerShell:
    - An [Azure PowerShell](/powershell/azure/install-az-ps#update-the-azure-powershell-module) installation on your local computer.
    - The latest PowerShell modules. [Update the PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module) if needed.

## Deploy example configuration

To deploy the example configuration, including sample parameter files:

# [Azure CLI](#tab/azure-cli)

1. [Sign in to the Azure CLI](/cli/azure/authenticate-azure-cli) with the account you want to use.

    ```azurecli-interactive
    az login
    ```

1. Create a directory called `Azure_SAP_Automated_Deployment` for your automation framework deployment. 

    ```azurecli-interactive
    mkdir ~/Azure_SAP_Automated_Deployment; cd $_
    ```

1. If you're using the deployer for the automation framework, the deployer already clones [SAP Deployment Automation Framework repository](https://github.com/Azure/sap-hana). If you're not using the deployer, clone the repository from GitHub.

    ```azurecli-interactive
    git clone <https://github.com/Azure/sap-hana.git> 
    ```

1. Navigate to the automation framework folder you cloned.

    ```azurecli-interactive
    cd sap-hana
    ```

1. Check out the branch `beta`.

    ```azurecli-interactive
    git checkout beta
    ```

1. Export the deployment repository path.

    ```azurecli-interactive
    export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-hana
    ```

1. Export your Azure subscription identifier. Be sure to replace the sample value `your-subscription-ID` with your information.

    ```azurecli-interactive
    export ARM_SUBSCRIPTION_ID=your-subscription-ID
    ```

1. Navigate to the deployment folder.

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment
    ```

1. Copy the sample parameter files folder to the `WORKSPACES` folder.

    ```azurecli-interactive
    cp -R sap-hana/deploy/samples/WORKSPACES WORKSPACES
    ```

1. Navigate to the `WORKSPACES` folder.

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

1. If you want, [validate your deployment](#validate-example-deployment).

# [PowerShell](#tab/azure-powershell)

1. [Sign in to PowerShell](/powershell/azure/authenticate-azureps).

1. Create a root directory called `Azure_SAP_Automated_Deployment`.

1. Navigate to the directory `Azure_SAP_Automated_Deployment`.

1. Clone the [SAP Deployment Automation Framework repository](https://github.com/Azure/sap-hana) from GitHub.

    ```powershell-interactive
    git clone https://github.com/Azure/sap-hana.git
    ```

1. Navigate to the automation framework folder you  cloned.

1. Copy the content from `sap-hana\deploy\samples\WORKSPACES` to `Azure_SAP_Automated_Deployment\WORKSPACES`.

1. Navigate to `Azure_SAP_Automated_Deployment\WORKSPACES`.

---

### Validate example deployment

To check that the example deployment contains important resources, follow these steps. Then, [review the output from the validation script](#review-validation-output) to make sure your configuration is correct.

# [Azure CLI](#tab/azure-cli)

Run the script `validate.sh` to return output about the deployer, the SAP library, the SAP landscape, and the SAP system. 

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \
  --type sap_deployer
```

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json                      \
  --type sap_library
```

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE/DEV-WEEU-SAP01-INFRASTRUCTURE.json    \
  --type sap_landscape
```

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile SYSTEM/DEV-WEEU-SAP01-X00/DEV-WEEU-SAP01-X00.json                             \
  --type sap_system
```

# [PowerShell](#tab/azure-powershell)

```powershell-interactive
Read-SAPDeploymentTemplate -Parameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.json -Type sap_deployer
```

```powershell-interactive
Read-SAPDeploymentTemplate -Parameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.json -Type sap_library
```

```powershell-interactive
Read-SAPDeploymentTemplate -Parameterfile .\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE\DEV-WEEU-SAP01-INFRASTRUCTURE.json -Type sap_landscape
```

```powershell-interactive
Read-SAPDeploymentTemplate -Parameterfile .\SYSTEM\DEV-WEEU-SAP01-X00\DEV-WEEU-SAP01-X00.json -Type sap_system
```

---

### Review validation output

When you [validate your example deployment](#validate-example-deployment), you receive output with deployment information.

> [!NOTE]
> The output includes important deployment information. However, the output doesn't include all deployment components.

Sample output:

```output
    Deployment information
    ----------------------------------------------------------------------------
    Environment:                  DEV
    Region:                       westeurope
    * Resource group:             (name defined by automation)

    Networking
    ----------------------------------------------------------------------------
    VNet Logical Name:            SAP01
    * Admin subnet:               (name defined by automation)
    * Admin subnet prefix:        10.110.0.0/27
    * Admin subnet nsg:           (name defined by automation)
    * Database subnet:            (name defined by automation)
    * Database subnet prefix:     10.110.0.64/27
    * Database subnet nsg:        (name defined by automation)
    * Application subnet:         (name defined by automation)
    * Application subnet prefix:  10.110.0.32/27
    * Application subnet nsg:     (name defined by automation)
    * Web subnet:                 (name defined by automation)
    * Web subnet prefix:          10.110.0.96/27
    * Web subnet nsg:             (name defined by automation)

    Database tier
    ----------------------------------------------------------------------------
    Platform:                     HANA
    High availability:            false
    Number of servers:            1
    Database sizing:              Default
    Image publisher:              SUSE
    Image offer:                  sles-sap-12-sp5
    Image sku:                    gen1
    Image version:                latest
    Deployment:                   Regional
    Networking:                   Use Azure provided IP addresses
    Authentication:               key

    Application tier
    ----------------------------------------------------------------------------
    Authentication:               key
    Application servers
    Number of servers:          2
    Image publisher:            SUSE
    Image offer:                sles-sap-12-sp5
    Image sku:                  gen1
    Image version:              latest
    Deployment:                 Regional
    Central Services
    Number of servers:          1
    High availability:          true
    Image publisher:            SUSE
    Image offer:                sles-sap-12-sp5
    Image sku:                  gen1
    Image version:              latest
    Deployment:                 Regional
    Web dispatcher
    Number of servers:          1
    Image publisher:            SUSE
    Image offer:                sles-sap-12-sp5
    Image sku:                  gen1
    Image version:              latest
    Deployment:                 Regional

    Key Vault
    ----------------------------------------------------------------------------
    SPN Key Vault:              Deployer keyvault
    User Key Vault:             Workload keyvault
    Automation Key Vault:       Workload keyvault
```

## Prepare region

To prepare for deploying infrastructure into your SAP region, such as the deployer and SAP Library, run the script `prepare_region.sh`.

# [Azure CLI](#tab/azure-cli)

1. Navigate to the root folder of your repository that contains your parameter files.

    ```azurecli-interactive
     cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

1. Run `prepare_region.sh`. If necessary, add the parameter `--force`to your command to clean up Terraform deployment files from your system.

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                  \
          --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \
          --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json
    ```

1. Wait for the script to deploy the infrastructure and create the Azure key vault that stores the Service Principal details. 

1. If prompted for your environment details, enter `MGMT` then enter your Service Principal details.

# [PowerShell](#tab/azure-powershell)

1. Import the PowerShell module:

    ```powershell-interactive
    Import-Module              C:\Azure_SAP_Automated_Deployment\sap-hana\deploy\scripts\pwsh\SAPDeploymentUtilities\Output\SAPDeploymentUtilities\SAPDeploymentUtilities.psd1
    ```

1. Navigate to the root folder that contains your parameter files. If necessary, add the parameter `-Force`to your command to clean up Terraform deployment files from your system.

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES
    New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.json  -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.json
    ```

1. Wait for the script to deploy the infrastructure and create the Azure key vault that stores the Service Principal details. 

1. If prompted for your environment details, enter `MGMT` then enter your Service Principal details.

---

## Deploy workload zone

Before you can deploy the SAP system, you must prepare a workload zone. To deploy the development environment's workload zone (`DEV`), including virtual networks and key vaults:

# [Azure CLI](#tab/azure-cli)

1. Navigate to the folder that contains the parameter file for `DEV`:
    
    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ``` 

1. Install the workload zone. If necessary, specify a different environment name with the parameter `--deployer_environment`.

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh  \
          --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json 
    ```

1. When prompted for workload zone Service Principal details, enter `Y`. Then, provide your Service Principal details. 

1. When prompted for the deployer environment's name, enter `MGMT`. If your configuration uses a different name, enter that value instead.

# [PowerShell](#tab/azure-powershell)

1. Navigate to the folder that contains the parameter file for `DEV`:

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Install the workload zone. If necessary, specify a different environment name with the parameter `-Deployerenvironment`.

    ```powershell-interactive
    New-SAPWorkloadZone -Parameterfile .\DEV-WEEU-SAP01-INFRASTRUCTURE.json
    ```

---

### Remove workload zone

Remove the `DEV` workload zone you created:

# [Azure CLI](#tab/azure-cli)

1. Navigate to the folder that contains the parameter file for `DEV`:
    
    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ``` 
1. Run the script `remover.sh`:

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
          --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
          --type sap_landscape
    ```

# [PowerShell](#tab/azure-powershell)

1. Navigate to the folder that contains the parameter file for `DEV`:

    ```powershell-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Run the script `remover.sh`:

    ```powershell-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
      --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
      --type sap_landscape
    ```

---

## Deploy SAP system

To deploy the SAP system:

# [Azure CLI](#tab/azure-cli)

1. Navigate to the folder that contains the parameter file for the SAP system:

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Install the SAP system. 

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh          \
          --parameterfile DEV-WEEU-SAP01-X00.json                    \
          --type sap_system --auto-approve
    ```

# [PowerShell](#tab/azure-powershell)

1. Navigate to the folder that contains the parameter file for the SAP system:

    ```powershell-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Install the SAP system. 

    ```powershell-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh             \
      --parameterfile DEV-WEEU-SAP01-X00.json                       \
      --type sap_system                                             \
      --auto-approve
    ```

---

### Remove SAP system

Remove the [SAP system you installed](#deploy-sap-system):

# [Azure CLI](#tab/azure-cli)

1. Navigate to the folder that contains the parameter file for the SAP system:

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Uninstall the SAP system:

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh            \
          --parameterfile DEV-WEEU-SAP01-X00.json                    \
          --type sap_system
    ```

# [PowerShell](#tab/azure-powershell)

1. Navigate to the folder that contains the parameter file for the SAP system:

    ```powershell-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Uninstall the SAP system:

    ```powershell-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
      --parameterfile DEV-WEEU-SAP01-X00.json                       \
      --type sap_system
    ```

---

## Next steps

> [!div class="nextstepaction"]
> [Run automation framework from Cloud Shell](automation-run-from-cloud-shell.md)
