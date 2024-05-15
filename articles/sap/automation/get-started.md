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
- An SAP User account with permissions to [download the SAP software](software.md) in your Azure environment. For more information on S-User, see [SAP S-User](https://support.sap.com/en/my-support/users/welcome.html).
- An [Azure CLI](/cli/azure/install-azure-cli) installation.
- A user Assigned Identity (MS) or a service principal to use for the control plane deployment.
- A user Assigned Identity (MS) or a A service principal to use for the workload zone deployment.
- An ability to create an Azure DevOps project if you want to use Azure DevOps for deployment.

Some of the prerequisites might already be installed in your deployment environment. Both Azure Cloud Shell and the deployer come with Terraform and the Azure CLI installed.


### Create a user assigned Identity

The SAP automation deployment framework can also use a user assigned identity (MSI) for the deployment. Make sure to use an account with permissions to create managed identities when running the script that creates the identity.

1. Create the managed identity.

    ```cloudshell-interactive
    export    ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export control_plane_env_code="LAB"

    az identity create --name ${control_plane_env_code}-Deployment-Identity --resource-group <ExistingResourceGroup>
    ```

    Review the output. For example:

    ```json
       {
         "clientId": "<appId>",
         "id": "<armId>",
         "location": "<location>",
         "name": "${control_plane_env_code}-Deployment-Identity",
         "principalId": "<objectId>",
         "resourceGroup": "<ExistingResourceGroup>",
         "systemData": null,
         "tags": {},
         "tenantId": "<TenantId>",
         "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
       }
    ```

1. Copy the output details.

    The output maps to the following parameters. You use these parameters in later steps, with automation commands.

    | Parameter input name     | Output name     |
    |--------------------------|-----------------|
    | `app_id`                 | `appId`         |
    | `msi_id`                 | `armId`         |
    | `msi_objectid`           | `objectId`      |


1. Assign the Contributor role to the identity.

    ```cloudshell-interactive
    export appId="<appId>"

    az role assignment create --assignee $msi_objectid  --role "Contributor"  --scope /subscriptions/$ARM_SUBSCRIPTION_ID
    ```

1. Optionally, assign the User Access Administrator role to the identity.

    ```cloudshell-interactive
    export appId="<appId>"

    az role assignment create --assignee $msi_objectid --role "User Access Administrator"  --scope /subscriptions/$ARM_SUBSCRIPTION_ID
    ```


> [!IMPORTANT]
> If you don't assign the User Access Administrator role to the managed identity, you can't assign permissions using the automation framework.

### Create an application registration for the web application

The SAP automation deployment framework can leverage an Azure App Service for configuring the tfvars parameter files.

1. Create the application registration.

    ```powershell
       $ApplicationName="<App Registration Name>"
       $MSI_objectId="<msi_objectid>"
        
        Write-Host "Creating an App Registration for" $ApplicationName -ForegroundColor Green
        
        if (Test-Path $manifestPath) { Write-Host "Removing manifest.json" ; Remove-Item $manifestPath }
        Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'
        
        $APP_REGISTRATION_ID = $(az ad app create --display-name $ApplicationName --enable-id-token-issuance true --sign-in-audience AzureADMyOrg --required-resource-access $manifestPath --query "appId" --output tsv)
        
        Write-Host "App Registration created with App ID: $APP_REGISTRATION_ID"
        
        Write-Host "Waiting for the App Registration to be created" -ForegroundColor Green
        Start-Sleep -s 20
        
        $ExistingData = $(az ad app list --all --filter "startswith(displayName, '$ApplicationName')" --query  "[?displayName=='$ApplicationName']| [0]" --only-show-errors) | ConvertFrom-Json
        
        $APP_REGISTRATION_OBJECTID = $ExistingData.id
        
        if (Test-Path $manifestPath) { Write-Host "Removing manifest.json" ; Remove-Item $manifestPath }
        
        Write-Host "Configuring authentication for the App Registration" -ForegroundColor Green
        az rest --method POST --uri "https://graph.microsoft.com/beta/applications/$APP_REGISTRATION_OBJECTID/federatedIdentityCredentials\" --body "{'name': 'ManagedIdentityFederation', 'issuer': 'https://login.microsoftonline.com/$ARM_TENANT_ID/v2.0', 'subject': '$MSI_objectId', 'audiences': [ 'api://AzureADTokenExchange' ]}"
        
        $API_URL="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/ProtectAnAPI/appId/$APP_REGISTRATION_ID/isMSAApp~/false"
        
        Write-Host "The browser will now open, Please Add a new scope, by clicking the '+ Add a new scope link', accept the default name and click 'Save and Continue'"
        Write-Host "In the Add a scope page enter the scope name 'user_impersonation'. Choose 'Admins and Users' in the who can consent section, next provide the Admin consent display name 'Access the SDAF web application' and 'Use SDAF' as the Admin consent description, accept the changes by clicking the 'Add scope' button"
        
        Start-Process $API_URL
        Read-Host -Prompt "Once you have created and validated the scope, Press any key to continue"


    ```
    


### Create a service principal

The SAP automation deployment framework can use service principals for deployment.

When you choose a name for your service principal, make sure that the name is unique within your Azure tenant. Make sure to use an account with service principals creation permissions when running the script.

1. Create the service principal with Contributor permissions.

    ```cloudshell-interactive
    export    ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export control_plane_env_code="LAB"

    az ad sp create-for-rbac --role="Contributor"  --scopes="/subscriptions/$ARM_SUBSCRIPTION_ID"   --name="$control_plane_env_code-Deployment-Account"
    ```

    Review the output. For example:

    ```json
    {
        "appId": "<AppId>",
        "displayName": "<environment>-Deployment-Account ",
        "name": "<AppId>",
        "password": "<AppSecret>",
        "tenant": "<TenantId>"
    }
    ```

1. Copy the output details. Make sure to save the values for `appId`, `password`, and `Tenant`.

    The output maps to the following parameters. You use these parameters in later steps, with automation commands.

    | Parameter input name | Output name |
    |--------------------------|-----------------|
    | `spn_id`                 | `appId`         |
    | `spn_secret`             | `password`      |
    | `tenant_id`              | `tenant`        |

1. Optionally, assign the User Access Administrator role to the service principal.

    ```cloudshell-interactive
    export appId="<appId>"

    az role assignment create --assignee $appId --role "User Access Administrator"  --scope /subscriptions/$ARM_SUBSCRIPTION_ID
    ```


> [!IMPORTANT]
> If you don't assign the User Access Administrator role to the service principal, you can't assign permissions using the automation framework.

## Pre-flight checks

You can use the following script to perform pre-flight checks. The script performs the following checks and tests:

- Checks if the service principal has the correct permissions to create resources in the subscription.
- Checks if the service principal has user Access Administrator permissions.
- Create an Azure Virtual Network.   
- Create an Azure Virtual Key Vault with private end point.   
- Create an Azure Files NSF share.   
- Create an Azure Virtual Machine with data disk using Premium Storage v2.   
- Check access to the required URLs using the deployed virtual machine.

```powershell

$sdaf_path = Get-Location
if ( $PSVersionTable.Platform -eq "Unix") {
    if ( -Not (Test-Path "SDAF") ) {
      $sdaf_path = New-Item -Path "SDAF" -Type Directory
    }
}
else {
    $sdaf_path = Join-Path -Path $Env:HOMEDRIVE -ChildPath "SDAF"
    if ( -not (Test-Path $sdaf_path)) {
        New-Item -Path $sdaf_path -Type Directory
    }
}

Set-Location -Path $sdaf_path

git clone https://github.com/Azure/sap-automation.git 

cd sap-automation
cd deploy
cd scripts

if ( $PSVersionTable.Platform -eq "Unix") {
./Test-SDAFReadiness.ps1
}
else {
.\Test-SDAFReadiness.ps1
}

```



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
