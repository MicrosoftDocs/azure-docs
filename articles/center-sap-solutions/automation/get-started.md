---
title: Get started with the SAP on Azure deployment automation framework
description: Quickly get started with the SAP on Azure Deployment Automation Framework. Deploy an example configuration using sample parameter files.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: azure-center-sap-solutions
---

# Get started with SAP automation framework on Azure

Get started quickly with the [SAP on Azure Deployment Automation Framework](deployment-framework.md).

## Prerequisites


- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [download of the SAP software](software.md) in your Azure environment.
- A [Terraform](https://www.terraform.io/) installation. For more information, also see the [Terraform on Azure documentation](/azure/developer/terraform/).
- An [Azure CLI](/cli/azure/install-azure-cli) installation on your local computer.
- Optionally, if you want to use PowerShell:
    - An [Azure PowerShell](/powershell/azure/install-az-ps#update-the-azure-powershell-module) installation on your local computer.
    - The latest PowerShell modules. [Update the PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module) if needed.

Some of the prerequisites may already be installed in your deployment environment. Both Cloud Shell and the deployer have Terraform and the Azure CLI installed.
## Clone the repository

Clone the repository and prepare the execution environment by using the following steps:

1. Create a directory called `Azure_SAP_Automated_Deployment` for your automation framework deployment. 

# [Linux](#tab/linux)

```bash
mkdir ~/Azure_SAP_Automated_Deployment; cd $_
git clone https://github.com/Azure/sap-automation.git 
```

Prepare the environment using the following steps:

```bash
export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-automation
export ARM_SUBSCRIPTION_ID=<subscriptionID>
```
> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your information.

# [Windows](#tab/windows)

```powershell
mkdir C:\Azure_SAP_Automated_Deployment
    
cd Azure_SAP_Automated_Deployment
    
git clone https://github.com/Azure/sap-automation.git 
```

Import the PowerShell module

```powershell
Import-Module C:\Azure_SAP_Automated_Deployment\sap-automation\deploy\scripts\pwsh\SAPDeploymentUtilities\Output\SAPDeploymentUtilities\SAPDeploymentUtilities.psd1
```

---

> [!TIP]
> The deployer already clones [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation). 

## Copy the samples

The repo contains a set of sample configuration files to start testing the deployment automation framework. You can copy them using the following steps.

# [Linux](#tab/linux)

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp sap-automation/samples/WORKSPACES WORKSPACES
```
# [Windows](#tab/windows)

```powershell
cd C:\Azure_SAP_Automated_Deployment
mkdir WORKSPACES

xcopy /E sap-automation\samples\WORKSPACES WORKSPACES
```

---


## Next step

> [!div class="nextstepaction"]
> [Plan the deployment](plan-deployment.md)
