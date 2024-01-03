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
- An SAP USer account with permissions to [download the SAP software](software.md) in your Azure environment. See [SAP S-User](https://support.sap.com/en/my-support/users/welcome.html) for more information.
- An [Azure CLI](/cli/azure/install-azure-cli) installation.
- A service principal to use for the control plane deployment.
- A service principal to use for the workload zone deployment.
- An ability to create an Azure DevOps project if you want to use Azure DevOps for deployment.

Some of the prerequisites might already be installed in your deployment environment. Both Azure Cloud Shell and the deployer have Terraform and the Azure CLI installed.

## Use SAP Deployment Automation Framework from Azure DevOps Services

Using Azure DevOps streamlines the deployment process. Azure DevOps provides pipelines that you can run to perform the infrastructure deployment and the configuration and SAP installation activities.

You can use Azure Repos to store your configuration files. Azure Pipelines provides pipelines, which can be used to deploy and configure the infrastructure and the SAP application.

### Sign up for Azure DevOps Services

To use Azure DevOps Services, you need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Microsoft Entra ID. To create an account, open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either sign in or create a new account.

## Create the SAP Deployment Automation Framework environment with Azure DevOps

You can use the following script to do a basic installation of Azure DevOps Services for SAP Deployment Automation Framework.

Open PowerShell ISE and copy the following script and update the parameters to match your environment.

```powershell
    $Env:SDAF_ADO_ORGANIZATION = "https://dev.azure.com/ORGANIZATIONNAME"
    $Env:SDAF_ADO_PROJECT = "SAP Deployment Automation Framework"
    $Env:SDAF_CONTROL_PLANE_CODE = "MGMT"
    $Env:SDAF_WORKLOAD_ZONE_CODE = "DEV"
    $Env:SDAF_ControlPlaneSubscriptionID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    $Env:SDAF_WorkloadZoneSubscriptionID = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
    $Env:ARM_TENANT_ID="zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"
    
    $UniqueIdentifier = Read-Host "Please provide an identifier that makes the service principal names unique, for instance a project code"
    
    $confirmation = Read-Host "Do you want to create a new Application registration (needed for the Web Application) y/n?"
    if ($confirmation -eq 'y') {
        $Env:SDAF_APP_NAME = $UniqueIdentifier + " SDAF Control Plane"
    }
    
    else {
      $Env:SDAF_APP_NAME = Read-Host "Please provide the Application registration name"
    }
    
    $confirmation = Read-Host "Do you want to create a new Service Principal for the Control plane y/n?"
    if ($confirmation -eq 'y') {
        $Env:SDAF_MGMT_SPN_NAME = $UniqueIdentifier + " SDAF " + $Env:SDAF_CONTROL_PLANE_CODE + " SPN"
    }
        else {
      $Env:SDAF_MGMT_SPN_NAME = Read-Host "Please provide the Control Plane Service Principal Name"
    }
    
    $confirmation = Read-Host "Do you want to create a new Service Principal for the Workload zone y/n?"
    if ($confirmation -eq 'y') {
        $Env:SDAF_WorkloadZone_SPN_NAME = $UniqueIdentifier + " SDAF " + $Env:SDAF_WORKLOAD_ZONE_CODE + " SPN"
    }
        else {
      $Env:SDAF_WorkloadZone_SPN_NAME = Read-Host "Please provide the Workload Zone Service Principal Name"
    }
    
    if ( $PSVersionTable.Platform -eq "Unix") {
        if ( Test-Path "SDAF") {
        }
        else {
            $sdaf_path = New-Item -Path "SDAF" -Type Directory
        }
    }
    else {
        $sdaf_path = Join-Path -Path $Env:HOMEDRIVE -ChildPath "SDAF"
        if ( Test-Path $sdaf_path) {
        }
        else {
            New-Item -Path $sdaf_path -Type Directory
        }
    }
    
    Set-Location -Path $sdaf_path
    
    if ( Test-Path "New-SDAFDevopsProject.ps1") {
        remove-item .\New-SDAFDevopsProject.ps1
    }
    
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure/sap-automation/main/deploy/scripts/New-SDAFDevopsProject.ps1 -OutFile .\New-SDAFDevopsProject.ps1 ; .\New-SDAFDevopsProject.ps1
    
```

Run the script and follow the instructions. The script opens browser windows for authentication and for performing tasks in the Azure DevOps project.

You can choose to either run the code directly from GitHub or you can import a copy of the code into your Azure DevOps project.

To confirm that the project was created, go to the Azure DevOps portal and select the project. Ensure that the repo was populated and that the pipelines were created.

> [!IMPORTANT]
> Run the following steps on your local workstation. Also ensure that you have the latest Azure CLI installed by running the `az upgrade` command.


For more information on how to configure Azure DevOps for SAP Deployment Automation Framework, see [Configure Azure DevOps for SAP Deployment Automation Framework](configure-devops.md).

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
