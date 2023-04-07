---
title: Get started with the SAP on Azure deployment automation framework
description: Quickly get started with the SAP on Azure Deployment Automation Framework. Deploy an example configuration using sample parameter files.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 1/2/2023
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Get started with SAP automation framework on Azure

Get started quickly with the [SAP on Azure Deployment Automation Framework](deployment-framework.md).

## Prerequisites


- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Ability to [download of the SAP software](software.md) in your Azure environment.
- An [Azure CLI](/cli/azure/install-azure-cli) installation on your local computer.
- An [Azure PowerShell](/powershell/azure/install-az-ps#update-the-azure-powershell-module) installation on your local computer.
- A Service Principal to use for the control plane deployment

Some of the prerequisites may already be installed in your deployment environment. Both Cloud Shell and the deployer have Terraform and the Azure CLI installed.
## Clone the repository

Clone the repository and prepare the execution environment by using the following steps:

- Create a directory called `Azure_SAP_Automated_Deployment` for your automation framework deployment. 

```bash
mkdir ~/Azure_SAP_Automated_Deployment/config; cd $_
git clone https://github.com/Azure/sap-automation-bootstrap.git 

mkdir ~/Azure_SAP_Automated_Deployment/sap-automation; cd $_
git clone https://github.com/Azure/sap-automation.git 

mkdir ~/Azure_SAP_Automated_Deployment/samples; cd $_
git clone https://github.com/Azure/sap-automation-samples.git 
```


> [!TIP]
> The deployer already clones the required repositories. 

## Samples

The ~/Azure_SAP_Automated_Deployment/samples folder contains a set of sample configuration files to start testing the deployment automation framework. You can copy them using the following steps.


```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp samples/Terraform/WORKSPACES config/WORKSPACES
```


## Next step

> [!div class="nextstepaction"]
> [Plan the deployment](plan-deployment.md)
