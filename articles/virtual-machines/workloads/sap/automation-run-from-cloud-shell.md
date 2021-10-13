---
title: Run the automation framework from Cloud Shell
description: How to run the SAP deployment automation framework from Azure Cloud Shell.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/13/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Run automation framework from Cloud Shell

You can run the [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md) from multiple places, including directly from [Azure Cloud Shell](../../../cloud-shell/overview.md). Cloud Shell already has the Azure Command Line Interface (Azure CLI) and Terraform available. As such, you don't need to install these prerequisites.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An installation of the SAP automation framework on Azure. For an overview, see [how to get started using the automation framework](automation-get-started.md).
- Details about the Service Principal you're using. You need the application identifier, the secret, and the tenant identifier.

## Deploy automation framework

You can deploy the automation framework directly from Cloud Shell:

1. [Open Cloud Shell](https://shell.azure.com/) in your browser.

1. Select **Bash** as your environment.

1. Go to the root directory.

1. Create and go to a new directory for your automated deployment.

    ```azure-cloud-shell
    mkdir ~/Azure_SAP_Automated_Deployment; cd $_
    ```

1. Clone the automation framework repository from GitHub. (If you're using the deployer, you already cloned this repository.)

    ```azure-cloud-shell
    git clone https://github.com/Azure/sap-hana.git
    ```

1. Go to the directory for the repository.

    ```azure-cloud-shell
    cd sap-hana
    ```

1. Check out the repository's beta branch (`beta`).

    ```azure-cloud-shell
    git checkout beta
    ```

1. Export the required environment variables. 

    1. Export your deployment repository path:

        ```azure-cloud-shell
        export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-hana
        ```
    
    1. Export your Azure Resource Manager subscription identifier. Replace `<your-arm-subscription-id>` with your identifier.

        ```azure-cloud-shell
        export ARM_SUBSCRIPTION_ID=<your-arm-subscription-id>
        ```

1. Go back to your automated deployment folder.
    
    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment
    ```

1. Copy the sample parameters folder into this directory.

    ```azure-cloud-shell
    cp -R sap-hana/deploy/samples/WORKSPACES WORKSPACES
    ```

1. Go to the new folder.

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

## List deployment contents

You can use the script `validate.sh` to list the deployment resources. 

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

For example:

```azure-cloud-shell
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

The validation script returns a high-level overview of resources. As such, the list doesn't have all deployment artifacts. For example:

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
    Number of servers:            2
    Image publisher:              SUSE
    Image offer:                  sles-sap-12-sp5
    Image sku:                    gen1
    Image version:                latest
    Deployment:                   Regional
    Central Services
    Number of servers:            1
    High availability:            true
    Image publisher:              SUSE
    Image offer:                  sles-sap-12-sp5
    Image sku:                    gen1
    Image version:                latest
    Deployment:                   Regional
    Web dispatcher
    Number of servers:            1
    Image publisher:              SUSE
    Image offer:                  sles-sap-12-sp5
    Image sku:                    gen1
    Image version:                latest
    Deployment:                   Regional

    Key Vault
    ----------------------------------------------------------------------------
    SPN Key Vault:                Deployer keyvault
    User Key Vault:               Workload keyvault
    Automation Key Vault:         Workload keyvault
```

## Prepare region

Before you deploy your supporting infrastructure, such the deployer and SAP Library, you need to prepare the Azure region with the script `prepare_region.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.


1. Go to your repository's root folder. This folder contains your parameter files.

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

1. Run the deployment script. 

    > [!NOTE]
    > Optionally, use the parameter `--force` to clean up your Terraform deployment support files, which include the folder `.terraform` and the file `terraform.tfstate`.

    ```azure-cloud-shell
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                  \
      --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \
      --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json
    ```

    Optionally, you can provide your Service Principal details as parameters. Replace the example values with your information:

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                  \
      --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json   \ 
      --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json                       \
      --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                                                     \
      --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy                                                           \
      --spn_secret ************************                                                                   \
      --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz                                                        \
      --auto-approve
    ```

1. Wait for the script to deploy the infrastructure. The script also creates the Azure key vault that stores your Service Principal details.

1. If the script prompts you for the environment details, enter `MGMT`. Then, enter your Service Principal details.

1. Wait for the script to deploy the rest of the required resources.

## Deploy workload zone

Before you can deploy the SAP system, you need to deploy a workload zone with the script `install_workloadzone.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the workload zone folder. This folder contains the JSON parameter file. 

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Run the workload zone deployment script. For example:

    ```azure-cloud-shell
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh  \
      --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
      --deployer_environment MGMT
    ```

Another option is to provide your Service Principal details as parameters with your command. Make sure to change the values to your own information.

```azure-cloud-shell
${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh  \
  --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
  --deployer_environment MGMT                                   \
  --subscription <subscription-id>           \
  --spn_id <spn-id>                 \
  --spn_secret <spn-secret>                         \
  --tenant_id <tenant-id>             \
  --auto-approve
```

## Remove workload zone

You can remove a workload zone with the script `remover.sh`. 

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the directory for your workload zone. For example, `DEV-WEEU-SAP01-INFRASTRUCTURE` is the folder for the `DEV` workload zone.

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Run the remover script with your workload zone's parameter file. For example, `DEV-WEEU-SAP01-INFRASTRUCTURE.json`.

    ```azure-cloud-shell
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
      --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.json            \
      --type sap_landscape
    ```

## Install SAP system

You can deploy your SAP system with the script `installer.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your SAP system. For example, `DEV-WEEU-SAP01-X00`.

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Run the deployment script with your system's parameter file. For example, `DEV-WEEU-SAP01-X00.json`.

    ```azure-cloud-shell
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh             \
      --parameterfile DEV-WEEU-SAP01-X00.json                       \
      --type sap_system                                             \
      --auto-approve
    ```

## Remove SAP system

You can remove your SAP system with the script `remover.sh`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your SAP system. For example, `DEV-WEEU-SAP01-X00`.

    ```azure-cloud-shell
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00
    ```

1. Run the remover script with your system's parameter file. For example, `DEV-WEEU-SAP01-X00.json`.

    ```azure-cloud-shell
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh               \
      --parameterfile DEV-WEEU-SAP01-X00.json                       \
      --type sap_system
    ```

## Next steps

- [Run the automation framework from Linux](automation-run-from-linux.md)

- [Run the automation framework from Windows](automation-run-from-windows.md)
