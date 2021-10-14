---
title: Run automation framework from Linux
description: How to run the SAP deployment automation framework from a Linux virtual machine.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/13/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Run automation from Linux

You can run the [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md) from multiple places, including from Linux virtual machines (VMs).
## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An installation of the SAP automation framework on Azure. For an overview, see [how to get started using the automation framework](automation-get-started.md).
- Details about the Service Principal you're using. You need the application identifier, the secret, and the tenant identifier.
- A [Terraform](https://www.terraform.io/) installation. For more information, also see the [Terraform on Azure documentation](/azure/developer/terraform/).
- An [installation of the Azure Command Line Interface (Azure CLI)](/cli/azure/install-azure-cli-linux) on the Linux VM you're using.

## Run from Linux

You run the automation framework from your Linux VM.

1. Sign in to the Azure CLI.

    ```azurecli-interactive
    az login
    ```

1. Sign in to your VM. For example, replace `<VM-name>` with your VM name and `<VM-resource-group>` with the VM's resource group.

    ```azurecli-interactive
    az ssh vm -n <VM-name> - <VM-resource-group>
    ```

1. Create and go to a new directory for your automated deployment.

    ```azurecli-interactive
    mkdir ~/Azure_SAP_Automated_Deployment; cd $_
    ```

1. In the new directory, clone the [automation framework repository](https://github.com/Azure/sap-hana) from GitHub. (If you're using the deployer, you already cloned this repository.)

    ```azurecli-interactive
    git clone <https://github.com/Azure/sap-hana.git> 
    ```

1. Go to the repository folder.

    ```azurecli-interactive
    cd sap-hana
    ```

1. Check out the beta branch (`beta`) of the repository.

    ```azurecli-interactive
    git checkout beta
    ```

1. Export the required environment variables.

    1. Export the deployment repository path:

        ```azurecli-interactive
        export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-hana
        ```

    1. Export the Azure Resource Manager subscription identifier. Replace `<ARM-identifier>` with your identifier.

        ```azurecli-interactive
        export ARM_SUBSCRIPTION_ID=<ARM-identifier>
        ```

    1. Provide your Service Principal details as needed.

1. Go back to your automated deployment folder.

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment
    ```

1. Copy the sample parameters folder into your workspaces (`WORKSPACES`) folder.

    ```azurecli-interactive
    cp -R sap-hana/deploy/samples/WORKSPACES WORKSPACES
    ```

1. Go to your workspaces folder.

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

## List deployment contents

You can list the contents of your deployment using the script `validate.sh`. This list is a high-level overview, and doesn't contain all deployment components.

Run the script with the JSON parameters files for your SAP deployer, library, landscape, and system. 

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

For example:

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \
  --type sap_deployer

${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json                      \
  --type sap_library

${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE/DEV-WEEU-SAP01-INFRASTRUCTURE.json    \
  --type sap_landscape

${DEPLOYMENT_REPO_PATH}/deploy/scripts/validate.sh                                              \
  --parameterfile SYSTEM/DEV-WEEU-SAP01-X00/DEV-WEEU-SAP01-X00.json                             \
  --type sap_system
```

The output from the script has the deployment information. For example:

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

To deploy your supporting infrastructure for the Azure region, use the script `prepare_region.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the workspaces folder for your deployment. This folder contains your parameter files.

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

1. Run the script to prepare the workspace. Replace the example deployer and library paths with your own information.

    > [!NOTE]
    > Optionally, use the parameter `--force` to clean up your Terraform deployment files from the system. These include the folder `.terraform` and the file `terraform.tfstate`.

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                  \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json
    ```

1. Wait for the script to deploy the infrastructure. The script also creates the Azure key vault for storing the Service Principal details.

1. If prompted for your environment details, enter `MGMT`. Then, enter your Service Principal details.

Another option is to provide your Service Principal details as parameters with your command. Make sure to change the values to your own information.

```azurecli-interactive
${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                  \
      --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \ 
      --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json                        \
      --subscription <subscription-id>                                                  \
      --spn_id <spn-id>                                                           \
      --spn_secret <spn-secret>                                                                 \
      --tenant_id <tenant-id>                                                  \
      --auto-approve
```

## Remove workload zone

You can remove your workload zone using the script `remover.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your workload zone. This folder contains your parameter file. For example:

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Run the removal script with your parameter file. For example:

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
          --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
          --type sap_landscape
    ```

## Install SAP system

You can deploy your SAP system using the script `installer.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your SAP system. This folder contains your parameter file. For example:

    ```azurecli-interactive
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Run the installer script with your parameter file.

    ```azurecli-interactive
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh          \
          --parameterfile DEV-WEEU-SAP01-X00.json                    \
          --type sap_system --auto-approve
    ```

## Next steps

- [Run the automation framework from Cloud Shell](automation-run-from-cloud-shell.md)

- [Run the automation framework from Windows](automation-run-from-windows.md)
