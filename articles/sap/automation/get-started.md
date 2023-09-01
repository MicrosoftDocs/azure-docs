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
- Ability to create an Azure Devops project if you want to use Azure DevOps for deployment.

Some of the prerequisites may already be installed in your deployment environment. Both Cloud Shell and the deployer have Terraform and the Azure CLI installed.

## Use SAP on Azure Deployment Automation Framework from Azure DevOps Services

Using Azure DevOps streamlines the deployment process by providing pipelines that can be executed to perform both the infrastructure deployment and the configuration and SAP installation activities.
You can use Azure Repos to store your configuration files and Azure Pipelines to deploy and configure the infrastructure and the SAP application.

### Sign up for Azure DevOps Services

To use Azure DevOps Services, you need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Azure Active Directory (Azure AD). To create an account, open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either _sign-in_ or create a new account.

Follow the guidance here [Configure Azure DevOps for SDAF](configure-devops.md) to configure Azure DevOps for the SAP on Azure Deployment Automation Framework.

## Creating the SAP on Azure Deployment Automation Framework environment without Azure DevOps

You can run the SAP on Azure Deployment Automation Framework from a virtual machine in Azure. The following steps describe how to create the environment.

Clone the repository and prepare the execution environment by using the following steps on a Linux Virtual machine in Azure:

Ensure the Virtual Machine has the following prerequisites installed:
 - git
 - jq
 - unzip
 
Ensure that the virtual machine is using either a system assigned or user assigned identity with permissions on the subscription to create resources.


- Create a directory called `Azure_SAP_Automated_Deployment` for your automation framework deployment. 

```bash
mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_

git clone https://github.com/Azure/sap-automation.git sap-automation

git clone https://github.com/Azure/sap-automation-samples.git samples

git clone https://github.com/Azure/sap-automation-bootstrap.git config

cd sap-automation/deploy/scripts
    
./configure_deployer.sh
```



> [!TIP]
> The deployer already clones the required repositories. 

## Samples

The ~/Azure_SAP_Automated_Deployment/samples folder contains a set of sample configuration files to start testing the deployment automation framework. You can copy them using the following steps.


```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp samples/Terraform/WORKSPACES config
```


## Next step

> [!div class="nextstepaction"]
> [Plan the deployment](plan-deployment.md)
