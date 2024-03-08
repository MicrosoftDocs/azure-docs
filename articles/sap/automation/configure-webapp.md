---
title: Configure a Deployer Web Application for SAP on Azure Deployment Automation Framework
description: Configure a web app as a part of the control plane to help creating and deploying SAP workload zones and systems on Azure.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: wsheehan
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-azurecli
---

# Configure the Control Plane Web Application credentials

As a part of the SAP automation framework control plane, you can optionally create an interactive web application that assists you in creating the required configuration files and deploying SAP workload zones and systems using Azure Pipelines.

:::image type="content" source="./media/deployment-framework/webapp-front-page.png" alt-text="Web app front page":::


## Create an app registration

If you would like to use the web app, you must first create an app registration for authentication purposes. Open the Azure Cloud Shell and execute the following commands:

# [Linux](#tab/linux)
Replace MGMT with your environment as necessary.
```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json

TF_VAR_app_registration_app_id=$(az ad app create \
    --display-name MGMT-webapp-registration \
    --enable-id-token-issuance true \
    --sign-in-audience AzureADMyOrg \
    --required-resource-access @manifest.json \
    --query "appId" | tr -d '"')

TF_VAR_webapp_client_secret=$(az ad app credential reset \
    --id $TF_VAR_app_registration_app_id --append               \
    --query "password" | tr -d '"')

echo "App registration ID:  ${TF_VAR_app_registration_app_id}"
echo "App registration password:  ${TF_VAR_app_registration_app_id}"

rm manifest.json
```
# [Windows](#tab/windows)
Replace MGMT with your environment as necessary.
```powershell
Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'

$TF_VAR_app_registration_app_id=(az ad app create `
    --display-name $region_code-webapp-registration     `
    --enable-id-token-issuance true `
    --sign-in-audience AzureADMyOrg `
    --required-resource-accesses ./manifest.json        `
    --query "appId").Replace('"',"")

$TF_VAR_webapp_client_secret=(az ad app credential reset `
    --id $TF_VAR_app_registration_app_id --append            `
    --query "password").Replace('"',"")

Write-Host "App registration ID:  $TF_VAR_app_registration_app_id"
Write-Host "App registration password:  $TF_VAR_webapp_client_secret"

rm ./manifest.json
```
---

Persist the values in the control plane variable group for later use.



| Variable name                    | Value                                       | Note           |
| -------------------------------- | ------------------------------------------- | -------------- |
| `APP_REGISTRATION_APP_ID`        | App registration ID from last step          |                |
| `WEB_APP_CLIENT_SECRET`          | App registration password from last step    | Mark as secret |


## Deploy via Azure Pipelines

For full instructions on setting up the web app using Azure DevOps, see [Use SAP on Azure Deployment Automation Framework from Azure DevOps Services](configure-devops.md)

### Summary of steps required to access the web app after deploying the control plane:
1. Update the app registration reply URLs.
2. Assign the reader role with the subscription scope to the app service system assigned managed identity.
3. Run the web app deployment pipeline.
4. (Optionally) add another access policy to the app service.

## Deploy via Azure CLI (Cloud Shell)

For full instructions on setting up the web app using the Azure CLI, see [Deploy the control plane](deploy-control-plane.md)

## Accessing the web app

By default there's no inbound public internet access to the web app apart from the deployer virtual network. To allow other access to the web app, navigate to the Azure portal. In the deployer resource group, find the web app. Then under settings on the left hand side, select networking. From here, select Access restriction. Add any allow or deny rules you would like. For more information on configuring access restrictions, see [Set up Azure App Service access restrictions](../../app-service/app-service-ip-restrictions.md).

You'll also need to grant reader permissions to the app service system-assigned managed identity. Navigate to the app service resource. On the left hand side, select "Identity In the "system assigned" tab, select on "Azure role assignments" > "Add role assignment." Select "subscription" as the scope, and "reader" as the role. Then select save. Without this step, the web app dropdown functionality won't work.
".

You can sign in and visit the web app by following the URL from earlier or selecting browse inside the app service resource. With the web app, you're able to configure SAP workload zones and system infrastructure. Select download to obtain a parameter file of the workload zone or system you specified, for use in the later deployment steps.


## Using the web app

The web app allows you to create SAP workload zone objects and system infrastructure objects. These objects are essentially another representation of the Terraform configuration file.
If deploying using Azure Pipelines, you have ability to deploy these workload zones and system infrastructures right from the web app.
If deploying using the Azure CLI, you can download the parameter file for any landscape or system object you create, and use that in your command line deployments.

### Creating a landscape or system object from scratch
1. Navigate to the "Workload zones" or "Systems" tab at the top of the website.
2. Select "Create New" in the bottom left corner.
3. Fill out the required parameters in the "Basic" and "Advanced" tabs, and any other parameters you desire.
4. Certain parameters are dropdowns populated with existing Azure resources.
   * If no results are shown for a dropdown, you probably need to specify another dropdown before you can see any options. Or, see step 2 above regarding the system assigned managed identity.
       - The subscription parameter must be specified before any other dropdown functionality is enabled
       - The network_arm_id parameter must be specified before any subnet dropdown functionality is enabled
5. Select submit in the bottom left hand corner

### Creating a workload zone or system object from a file
1. Navigate to the "File" tab at the top of the website.
2. Your options are
   * Create a new file from scratch there in browser.
   * Import an existing.tfvars file, and (optionally) edit it before saving.
   * Use an existing template, and (optionally) edit it before saving.
3. Make sure your file conforms to the correct naming conventions.
4. Next to the file you would like to convert to a workload zone or system object, select "Convert."
5. The workload zone or system object appears in its respective tab.

### Deploying a workload zone or system object (Azure Pipelines deployment)
1. Navigate to the Workload zones or Systems tab.
2. Next to the workload zone or system you would like to deploy, select "Deploy."
   * If you would like to deploy a file, first convert it to a workload zone or system object.
3. Specify the necessary parameters, and confirm it's the correct object.
4. Select deploy.
5. The web app generates a 'tfvars' file from the object, updates your Azure DevOps repository, and kicks off the workload zone or system (infrastructure) pipeline. You can monitor the deployment in the Azure DevOps Portal.
