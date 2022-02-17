---
title: About Control Plane deployment for the SAP Deployment automation framework
description: Overview of the Control Plan deployment process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Deploy the control plane

The control plane deployment for the [SAP deployment automation framework on Azure](automation-deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/automation-deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

## Prepare the deployment credentials

The SAP Deployment Frameworks uses Service Principals when doing the deployments. You can create the Service Principal for the Control Plane deployment using the following steps using an account with permissions to create Service Principals:


```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"
  
```

> [!IMPORTANT]
> The name of the Service Principal must be unique.
>
> Record the output values from the command.
   > - appId
   > - password
   > - tenant

Optionally assign the following permissions to the Service Principal: 

```azurecli
az role assignment create --assignee <appId> --role "User Access Administrator"
```
## Prepare the webapp
This step is optional. If you would like a browser-based UX to assist in the configuration of SAP workload zones and systems, run the following commands before deploying the control plane.
```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json

export TF_VAR_app_registration_app_id=$(az ad app create \
    --display-name ${region_code}-webapp-registration    \
    --available-to-other-tenants false                   \
    --required-resource-access @manifest.json            \
    --query "appId" | tr -d '"')

export TF_VAR_webapp_client_secret=$(az ad app credential reset \
    --id $TF_VAR_app_registration_app_id --append               \
    --query "password" | tr -d '"')

export TF_VAR_use_webapp=true
rm manifest.json
```
## Deploy the control plane
   
The sample Deployer configuration file `MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `MGMT-WEEU-SAP_LIBRARY.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folder.

Running the command below will create the Deployer, the SAP Library and add the Service Principal details to the deployment key vault.

# [Linux](#tab/linux)

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp sap-automation/samples/WORKSPACES WORKSPACES

```

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

az logout
az login

export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-automation
export subscriptionID=<subscriptionID>
export spn_id=<appID>
export spn_secret=<password>
export tenant_id=<tenant>
export region_code=WEEU

${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                                            \
        --deployer_parameter_file DEPLOYER/MGMT-${region_code}-DEP00-INFRASTRUCTURE/MGMT-${region_code}-DEP00-INFRASTRUCTURE.tfvars \
        --library_parameter_file LIBRARY/MGMT-${region_code}-SAP_LIBRARY/MGMT-${region_code}-SAP_LIBRARY.tfvars                     \
        --subscription $subscriptionID                                                                                              \
        --spn_id "${spn_id}"                                                                                                        \
        --spn_secret "${spn_secret}"                                                                                                \
        --tenant_id "${tenant_id}"
```

# [Windows](#tab/windows)

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell

cd C:\Azure_SAP_Automated_Deployment

xcopy /E sap-automation\samples\WORKSPACES WORKSPACES

```



```powershell


$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars -Subscription $subscription -SPN_id $appId -SPN_password $spn_secret -Tenant_id $tenant_id
```
---


> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<appID>`, `<password>`, `<tenant>` values with the output values of the SPN creation

## Deploy the web app
   
If you would like to use the web app, follow the steps below. If not, ignore this section.

The web app can be found in the deployer resource group. In the Azure portal, select sesource groups in your subscription. The deployer resource group will be named something like MGMT-[region]-DEP00-INFRASTRUCTURE. Inside the deployer resource group, locate the app service, named something like mgmt-[region]-dep00-sapdeployment123. Open the app service and copy the URL listed. This will be the value for webapp_url.

The commands below will configure the application urls, generate a zip file of the web app code, deploy the software to the app service, and configure the application settings.

# [Linux](#tab/linux)

```bash

webapp_url=<webapp_url>
az ad app update \
    --id $TF_VAR_app_registration_app_id \
    --homepage ${webapp_url} \
    --reply-urls ${webapp_url}/ ${webapp_url}/.auth/login/aad/callback

```
> [!TIP]
> Perform the following task from the deployer.
```bash

cd ~/Azure_SAP_Automated_Deployment/sap-automation/Webapp/AutomationForm

dotnet build
dotnet publish --configuration Release

cd bin/Release/netcoreapp3.1/publish/

sudo apt install zip
zip -r deploymentfile.zip .

az webapp deploy --resource-group <group-name> --name <app-name> --src-path deploymentfile.zip

```
```bash

az webapp config appsettings set -g <group-name> -n <app-name> --settings \
AZURE_CLIENT_ID=$appId \
AZURE_TENANT_ID=$tenant_id \
AZURE_CLIENT_SECRET=$spn_secret \
IS_PIPELINE_DEPLOYMENT=false

```

# [Windows](#tab/windows)

```powershell

$webapp_url="<webapp_url>"
az ad app update `
    --id $TF_VAR_app_registration_app_id `
    --homepage $webapp_url `
    --reply-urls $webapp_url/ $webapp_url/.auth/login/aad/callback

```
> [!TIP]
> Perform the following task from the deployer.
> 
```powershell

dotnet build
dotnet publish --configuration Release

cd bin/Release/netcoreapp3.1/publish/

Compress-Archive -LiteralPath '.' -DestinationPath 'deploymentfile.zip'

az webapp deploy --resource-group <group-name> --name <app-name> --src-path deploymentfile.zip

```
```powershell

az webapp config appsettings set -g '<group-name>' -n '<app-name>' --settings `
AZURE_CLIENT_ID=$appId `
AZURE_TENANT_ID=$tenant_id `
AZURE_CLIENT_SECRET=$spn_secret `
IS_PIPELINE_DEPLOYMENT=false

```
---
## Accessing the web app

By default there will be no public internet access to the website. To change the access restrictions, navigate to the Azure portal. In the deployer resource group, find the web app. Then under settings on the left hand side, click on networking. From here, click Access restriction. Add any allow or deny rules you would like. For more information on configuring access restrictions, see [Set up Azure App Service access restrictions](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions).

## Next step

> [!div class="nextstepaction"]
> [Configure SAP Workload Zone](automation-configure-workload-zone.md)


