---
title: Get started with SAP Deployment Automation Framework
description: Quickly get started with SAP Deployment Automation Framework. Deploy an example configuration by using sample parameter files.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 1/2/2023
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Get started with SAP Deployment Automation Framework

Get started quickly with [SAP Deployment Automation Framework](deployment-framework.md).

## Prerequisites

To get started with SAP Deployment Automation Framework, you need:

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The ability to [download the SAP software](software.md) in your Azure environment.
- An [Azure CLI](/cli/azure/install-azure-cli) installation on your local computer.
- An [Azure PowerShell](/powershell/azure/install-az-ps#update-the-azure-powershell-module) installation on your local computer.
- A service principal to use for the control plane deployment.
- An ability to create an Azure DevOps project if you want to use Azure DevOps for deployment.

Some of the prerequisites might already be installed in your deployment environment. Both Azure Cloud Shell and the deployer have Terraform and the Azure CLI installed.

## Use SAP Deployment Automation Framework from Azure DevOps Services

Using Azure DevOps streamlines the deployment process. Azure DevOps provides pipelines that you can run to perform the infrastructure deployment and the configuration and SAP installation activities.

You can use Azure Repos to store your configuration files. Use Azure Pipelines to deploy and configure the infrastructure and the SAP application.

### Sign up for Azure DevOps Services

To use Azure DevOps Services, you need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Microsoft Entra ID. To create an account, open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either sign in or create a new account.

To configure Azure DevOps for SAP Deployment Automation Framework, see [Configure Azure DevOps for SAP Deployment Automation Framework](configure-devops.md).

## Create the SAP Deployment Automation Framework environment without Azure DevOps

You can run SAP Deployment Automation Framework from a virtual machine in Azure. The following steps describe how to create the environment.

> [!IMPORTANT]
> Ensure that the virtual machine is using either a system-assigned or user-assigned identity with permissions on the subscription to create resources.

Ensure the virtual machine has the following prerequisites installed:

 - git
 - jq
 - unzip
 - virtualenv (if running on Ubuntu)

You can install the prerequisites on an Ubuntu virtual machine by using the following command:

```bash
sudo apt-get install -y git jq unzip virtualenv

```

You can then install the deployer components by using the following commands:

```bash

wget https://raw.githubusercontent.com/Azure/sap-automation/main/deploy/scripts/configure_deployer.sh -O configure_deployer.sh	
chmod +x ./configure_deployer.sh
./configure_deployer.sh

# Source the new variables

. /etc/profile.d/deploy_server.sh

```

## Samples

The `~/Azure_SAP_Automated_Deployment/samples` folder contains a set of sample configuration files to start testing the deployment automation framework. You can copy them by using the following commands:

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp samples/Terraform/WORKSPACES ~/Azure_SAP_Automated_Deployment
```

## Next step

> [!div class="nextstepaction"]
> [Plan the deployment](plan-deployment.md)
