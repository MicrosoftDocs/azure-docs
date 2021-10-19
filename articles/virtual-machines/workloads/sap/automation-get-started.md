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

Get started quickly with the [SAP Deployment Automation Framework on Azure](automation-deployment-framework.md).

## Prerequisites


- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [download of the SAP software](automation-software.md) in your Azure environment.
- A [Terraform](https://www.terraform.io/) installation. For more information, also see the [Terraform on Azure documentation](/azure/developer/terraform/).
- An [Azure Command Line Interface (Azure CLI)](/cli/azure/install-azure-cli) installation on your local computer.
- Optionally, if you want to use PowerShell:
    - An [Azure PowerShell](/powershell/azure/install-az-ps#update-the-azure-powershell-module) installation on your local computer.
    - The latest PowerShell modules. [Update the PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module) if needed.

Some of the prerequisites may already be installed in your deployment environment. Both Cloud Shell and the deployer have Terraform and the Azure CLI installed.
## Clone the repository

Clone the repository and prepare the execution environment by using the following steps:

1. Create a directory called `Azure_SAP_Automated_Deployment` for your automation framework deployment. 

# [Linux](#tab/linux)

```azurecli-interactive
mkdir ~/Azure_SAP_Automated_Deployment; cd $_
git clone https://github.com/Azure/sap-hana.git 
```

Prepare the environment using the following steps:

```azurecli-interactive
export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-hana
export ARM_SUBSCRIPTION_ID=<subscriptionID>
```
> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your information.

You can copy the sample configuration files to start testing the deployment automation framework.

```azurecli-interactive
cd ~/Azure_SAP_Automated_Deployment

cp -R sap-hana/deploy/samples/WORKSPACES WORKSPACES

```


# [Windows](#tab/windows)

```powershell-interactive
mkdir C:\Azure_SAP_Automated_Deployment
    
cd Azure_SAP_Automated_Deployment
    
git clone https://github.com/Azure/sap-hana.git 
```

Import the PowerShell module

```powershell-interactive
Import-Module             C:\Azure_SAP_Automated_Deployment\sap-hana\deploy\scripts\pwsh\SAPDeploymentUtilities\Output\SAPDeploymentUtilities\SAPDeploymentUtilitiespsd1
```

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell-interactive
cd C:\Azure_SAP_Automated_Deployment
mkdir WORKSPACES

xcopy sap-hana\deploy\samples\WORKSPACES WORKSPACES
```
---

> [!TIP]
> The deployer already clones [SAP Deployment Automation Framework repository](https://github.com/Azure/sap-hana). 


## Next step

> [!div class="nextstepaction"]
<<<<<<< HEAD
> [Run automation framework from Cloud Shell](automation-configure-control-plane.md)
=======
> [Run automation framework from Cloud Shell](automation-configure-deployer.md)
>>>>>>> 977e9d1ab62864a0b0f340608f4f93e44a637c1a
