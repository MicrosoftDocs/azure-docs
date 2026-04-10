---
title: Configure the control plane web application for SAP Deployment Automation Framework
description: Configure a web app as part of the control plane to help create and deploy SAP workload zones and systems on Azure.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: wsheehan
ms.date: 04/09/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-azurecli
# Customer intent: As a cloud architect, I want to configure a web application for the SAP automation framework, so that I can streamline the creation and deployment of SAP workload zones and systems on Azure using both the web interface and automation pipelines.
---

# Configure the control plane web application

As part of the [SAP Deployment Automation Framework](deployment-framework.md) control plane, you can optionally create an interactive web application that assists you in creating the required configuration files. You can also deploy the SAP workload zones and systems by using Azure Pipelines.

The web app provides a visual interface for generating Terraform configuration files and triggering deployments, so you don't need to work with the CLI or edit parameter files manually.

:::image type="content" source="./media/deployment-framework/webapp-front-page.png" alt-text="Screenshot of the front page of the SAP Deployment Automation Framework web application.":::

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to [Azure Cloud Shell](/azure/cloud-shell/overview) or a local installation of [Azure CLI](/cli/azure/install-azure-cli).
- For Azure Pipelines deployment, you need an Azure DevOps organization with the SAP automation pipelines configured properly. For more information, see [Use SAP on Azure Deployment Automation Framework from Azure DevOps Services](configure-devops.md).

## Create an app registration

To use the web app, you must first create an app registration for authentication purposes. Open Azure Cloud Shell and run the following commands.

# [Linux](#tab/linux)

Replace `MGMT` with your environment as necessary.

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
echo "App registration password:  ${TF_VAR_webapp_client_secret}"

rm manifest.json
```

# [Windows](#tab/windows)

Replace `MGMT` with your environment as necessary.

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

rm manifest.json
```

---

Persist the values in the control plane variable group for later use.

| Variable name                    | Value                                       | Note           |
| -------------------------------- | ------------------------------------------- | -------------- |
| `APP_REGISTRATION_APP_ID`        | App registration ID from last step          |                |
| `WEB_APP_CLIENT_SECRET`          | App registration password from last step    | Mark as secret |

## Deploy by using Azure Pipelines

For full instructions on setting up the web app by using Azure DevOps, see [Use SAP on Azure Deployment Automation Framework from Azure DevOps Services](configure-devops.md).

### Summary of steps

After deploying the control plane, complete the following steps to access the web app:

1. Update the app registration reply URLs.
1. Assign the **Reader** role with the subscription scope to the App Service system-assigned managed identity.
1. Run the web app deployment pipeline.
1. (Optional) Add another access policy to the app service.

## Deploy by using Azure CLI (Cloud Shell)

For full instructions on setting up the web app by using the Azure CLI, see [Deploy the control plane](deploy-control-plane.md).

## Access the web app

By default, there's no inbound public internet access to the web app apart from the deployer virtual network. To allow other access to the web app, go to the Azure portal. In the deployer resource group, find the web app. Then under **Settings** on the left side, select **Networking**. From here, select **Access restriction**. Add any allow or deny rules you need. For more information about configuring access restrictions, see [Set up Azure App Service access restrictions](../../app-service/app-service-ip-restrictions.md).

You also need to grant **Reader** permissions to the App Service system-assigned managed identity:

1. Go to the App Service resource.
1. On the left side, select **Identity**.
1. In the **System assigned** tab, select **Azure role assignments** > **Add role assignment**.
1. Select **Subscription** as the scope, and **Reader** as the role.
1. Select **Save**.

Without this step, the web app dropdown functionality doesn't work.

Sign in and visit the web app by following the URL from earlier or selecting **Browse** inside the App Service resource. With the web app, you can configure SAP workload zones and system infrastructure. Select **Download** to get a parameter file of the workload zone or system you specified, for use in later deployment steps.

## Use the web app

The web app allows you to create SAP workload zone objects and system infrastructure objects. These objects are another representation of the Terraform configuration file.

If you're deploying by using Azure Pipelines, you can deploy these workload zones and system infrastructures directly from the web app. If you're deploying by using the Azure CLI, you can download the parameter file for any landscape or system object you create and use it in your command-line deployments.

### Create a landscape or system object from scratch

1. Go to the **Workload zones** or **Systems** tab at the top of the website.
1. Select **Create New** in the bottom-left corner.
1. Fill out the required parameters in the **Basic** and **Advanced** tabs, and any other parameters you need.
1. Certain parameters are dropdowns populated with existing Azure resources.
   - If a dropdown shows no results, you might need to specify another dropdown before you can see any options. Or, see the earlier step about the system-assigned managed identity.
     - Specify the `subscription` parameter to enable the other dropdown options.
     - Specify the `network_arm_id` parameter to enable the subnet dropdown options.
1. Select **Submit** in the bottom-left corner.

### Create a workload zone or system object from a file

1. Go to the **File** tab at the top of the website.
1. Your options are:
   - Create a new file from scratch in the browser.
   - Import an existing `tfvars` file, and optionally edit it before saving.
   - Use an existing template, and optionally edit it before saving.
1. Make sure your file conforms to the correct naming conventions.
1. Next to the file you want to convert to a workload zone or system object, select **Convert**.
1. The workload zone or system object appears in its respective tab.

### Deploy a workload zone or system object (Azure Pipelines deployment)

1. Go to the **Workload zones** or **Systems** tab.
1. Next to the workload zone or system you want to deploy, select **Deploy**.
   - If you want to deploy a file, first convert it to a workload zone or system object.
1. Specify the necessary parameters, and confirm it's the correct object.
1. Select **Deploy**.
1. The web app generates a `tfvars` file from the object, updates your Azure DevOps repository, and starts the workload zone or system infrastructure pipeline. You can monitor the deployment in the Azure DevOps portal.

## Related content

- [SAP Deployment Automation Framework overview](deployment-framework.md)
- [Deploy the control plane](deploy-control-plane.md)
- [Use SAP on Azure Deployment Automation Framework from Azure DevOps Services](configure-devops.md)
