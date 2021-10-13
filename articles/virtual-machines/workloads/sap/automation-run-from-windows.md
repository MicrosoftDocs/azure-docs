---
title: Run automation framework from Windows
description: How to run the SAP deployment automation framework from a Windows PC.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/13/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Run automation from Windows

You can run the [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md) from multiple places, including Windows.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An installation of the SAP automation framework on Azure. For an overview, see [how to get started using the automation framework](automation-get-started.md).
- Details about the Service Principal you're using. You need the application identifier, the secret, and the tenant identifier.
- A [Terraform](https://www.terraform.io/) installation. For more information, also see the [Terraform on Azure documentation](/azure/developer/terraform/).
- An [installation of the Azure Command Line Interface (Azure CLI)](/cli/azure/install-azure-cli-linux) on the Linux VM you're using.
- An installation of Azure PowerShell. You can [install PowerShell with the PowerShellGet](/powershell/azure/install-az-ps). Also [update the PowerShell modules to the latest versions](/powershell/azure/install-az-ps#update-the-azure-powershell-module).

## Run from Windows

Set up your sample files for execution:

1. Create a root-level directory for your automated deployment named `Azure_SAP_Automated_Deployment`.

1. Go to the new directory `Azure_SAP_Automated_Deployment`.

1. In the new directory, clone the [automation framework repository](https://github.com/Azure/sap-hana) from GitHub. (If you're using the deployer, you already cloned this repository.)

    ```powershell-interactive
    git clone <https://github.com/Azure/sap-hana.git> 
    ```
1. Go to the repository folder.

    ```powershell-interactive
    cd sap-hana
    ```

1. Copy the content from `sap-hana\deploy\samples\WORKSPACES` to your workspaces folder, `Azure_SAP_Automated_Deployment\WORKSPACES`.

1. Provide your Service Principal details as necessary.

## List deployment contents

You can list the contents of your deployment with the cmdlet ``. This list is a high-level overview, which doesn't contain all deployment artifacts.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

For example:

```powershell-interactive
Read-SAPDeploymentTemplate -Parameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.json -Type sap_deployer

Read-SAPDeploymentTemplate -Parameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.json -Type sap_library

Read-SAPDeploymentTemplate -Parameterfile .\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE\DEV-WEEU-SAP01-INFRASTRUCTURE.json -Type sap_landscape

Read-SAPDeploymentTemplate -Parameterfile .\SYSTEM\DEV-WEEU-SAP01-X00\DEV-WEEU-SAP01-X00.json -Type sap_system
```

The output lists your deployment information. For example:

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

To deploy your SAP Library and infrastructure, first prepare the target Azure region.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Import the PowerShell module `SAPDeploymentUtilities`. For example:
    
    ```powershell-interactive
       Import-Module              C:\Azure_SAP_Automated_Deployment\sap-hana\deploy\scripts\pwsh\SAPDeploymentUtilities\Output\SAPDeploymentUtilities\SAPDeploymentUtilities.psd1
    ```

1. Go to your workspace folder. This folder has the parameter files.
    
    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES
    ```

1. Run the cmdlet `New-SAPAutomationRegion` to prepare the region, including the deployer and SAP Library. For example:

    > [!NOTE]
    > Optionally, use the parameter `Force` to clean up your Terraform deployment's support files from the system. These files include the folder `.terraform` and the file `terraform.tfstate`.

    ```powershell-interactive
    New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.json  -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.json
    or
    ```

1. Wait for the script to deploy the infrastructure. The script also creates the Azure key vault for storing the Service Principal details.

1. If prompted for your environment details, enter `MGMT`. Then, enter your Service Principal details.

1. Wait for the script to finish deploying the required resources.

Another option is to provide the Service Principal details as parameters with your command. Make sure to replace the sample values with your own information. For example:

```powershell-interactive
cd C:\Azure_SAP_Automated_Deployment\WORKSPACES
New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.json  
    -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.json 
    -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
    -SPN_password ************************
    -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz  
    -Silent
```

## Deploy workload zone

Before deploying your SAP system, prepare the target workload zone. This example shows the deployment of the `DEV` workload zone for the virtual network and key vaults. Use the cmdlet `New-SAPWorkloadZone` to deploy the workload zone.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to your workload zone's folder, which contains the parameter file.

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Deploy the workload zone. If your environment uses a different name, specify the name with the parameter `-Deployerenvironment`. For example, `-Deployerenvironment MGMT`.

    ```powershell-interactive
    New-SAPWorkloadZone -Parameterfile .\DEV-WEEU-SAP01-INFRASTRUCTURE.json
    ```

1. Enter your Service Principal details as needed.

1. Wait for the deployment to complete.

Another option is to provide the Service Principal details as parameters with your command. Make sure to replace the sample values with your own information. For example:

```powershell-interactive
   cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE
   New-SAPWorkloadZone -Parameterfile .\DEV-WEEU-SAP01-INFRASTRUCTURE.json 
   -Deployerenvironment MGMT
   -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
   -SPN_password ************************
   -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz  
```

## Remove workload zone

You can remove your SAP workload zone with the cmdlet `Remove-SAPSystem`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to your workload zone's folder that contains the parameter file. For example:

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE
    ```

1. Run the cmdlet with your parameter file. For example:

    ```powershell-interactive
    Remove-SAPSystem -Parameterfile .\DEV-WEEU-SAP01-INFRASTRUCTURE.json -Type sap_landscape
    ```

## Deploy SAP system

You can deploy your SAP system with the cmdlet `New-SAPSystem`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your SAP system. This folder contains the parameter file. For example:

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\DEV-WEEU-SAP01-X00
    ```

1. Run the cmdlet with your parameter file. For example:

    ```powershell-interactive
    New-SAPSystem -Parameterfile .\DEV-WEEU-SAP01-X00.json -Type sap_system
    ```

1. Wait for the deployment to complete.

## Remove SAP system

You can remove your SAP system with the cmdlet `Remove-SAPSystem`.

> [!IMPORTANT]
> These steps use the example system values. Replace all example paths and file names with your own information.

1. Go to the folder for your SAP system. This folder contains the parameter file. For example:

    ```powershell-interactive
    cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\DEV-WEEU-SAP01-X00
    ```

1. Run the cmdlet with your parameter file. For example:

    ```powershell-interactive
    Remove-SAPSystem -Parameterfile .\DEV-WEEU-SAP01-X00.json -Type sap_system
    ```

1. Wait for the script to finish removing the SAP system.

## Next steps

- [Run the automation framework from Linux](automation-run-from-linux.md)

- [Run the automation framework from Cloud Shell](automation-run-from-cloud-shell.md)
