---
title: "Quickstart: Deploy Managed Instance on Azure App Service (Preview)"
description: Learn how to configure Managed Instance on Azure App Service
author: msangapu-msft
ms.author: msangapu
ms.reviewer: maghan
ms.date: 11/18/2025
ms.service: azure-app-service
ms.topic: quickstart
keywords:
  - app service
  - azure app service
  - scale
  - scalable
  - scalability
  - app service plan
  - app service cost
---

# Deploy Managed Instance on Azure App Service (preview)

Managed Instance on Azure App Service combines the simplicity of platform as a service with the flexibility of infrastructure-level control. Managed Instance is designed for applications that require plan-level isolation, customization, and secure network integration.

[!INCLUDE [managed-instance](./includes/managed-instance/preview-note.md)]

In this quickstart, you complete the following steps:
1. Use Azure Developer CLI to deploy sample resources.
1. Create a Managed Instance on Azure App Service (preview).
1. Deploy a sample app.
1. Verify the deployment.

## Prerequisites

- **Azure account**: You need an Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- **Access to the approved regions**: During preview, regions for Managed Instance include: *East Asia*, *East US*, *North Europe*, and *West Central US*. More regions to follow.

- [Managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal#create-a-user-assigned-managed-identity)

- [Quickstart: Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md)

- Configuration (install) scripts (PowerShell script named `Install.ps1`) in a compressed .zip file

## Deploy sample resources

You can quickly deploy all the necessary resources in this quickstart using Azure Developer CLI (AZD). The AZD template used in this quickstart is from [Azure samples](https://github.com/Azure-Samples/managed-instance-azure-app-service-quickstart). Just run the following commands in the Azure Cloud Shell, and follow the prompts:

```bash
mkdir managed-instance-quickstart
cd managed-instance-quickstart
azd init --template https://github.com/Azure-Samples/managed-instance-azure-app-service-quickstart.git
azd env set AZURE_LOCATION northeurope
azd up
```

The `azd up` command does the following actions:

1. Creates a user-assigned managed identity.
1. Creates an Azure Storage Blob.
1. Assigns the managed identity to the storage container and Managed Instance plan.
1. Grants Storage-Blob-Data-Contributor access on the storage container.
1. Compresses included fonts and Install.ps1 into scripts.zip.
1. Upload scripts.zip to the storage container.

> [!NOTE]  
> The configuration script package (`scripts.zip`) deployed with the sample resources contains `Install.ps1`, which copies Microsoft Aptos font files into C:\Windows\Fonts. The sample app you deploy later renders text into an image using these fonts. This process demonstrates how a Managed Instance configuration (install) script can lay down OS-level or framework dependencies before app code runs.
>

The following PowerShell code is the configuration (install) script used in the template.

```powershell
# Install.ps1 - Copy and register fonts on Managed Instance
Write-Host "Installing custom fonts on Managed Instance..." -ForegroundColor Green

# Copy all TTF and OTF fonts to Windows Fonts folder and register them
Get-ChildItem -Recurse -Include *.ttf, *.otf | ForEach-Object {
    $FontFullName = $_.FullName
    $FontName = $_.BaseName + " (TrueType)"
    $Destination = "$env:windir\Fonts\$($_.Name)"

    Write-Host "Installing font: $($_.Name)"
    Copy-Item $FontFullName -Destination $Destination -Force
    New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts" -Name $FontName -PropertyType String -Value $_.Name -Force | Out-Null
}

Write-Host "Font installation completed." -ForegroundColor Green
```

The final output of `azd up` should look similar to the following example.

```text
=== Deployment Complete ===
Storage Account: stgpjqep6fdlfv6
Container Name: scripts
Managed Identity Client name: id-gpjqep6fdlfv6
Resource Group: rg-managed-instance
```

The values for `Storage Account`, `Container Name`, `Managed Identity Client name`, `Resource Group`, and `Script URI` are used later.

## Deploy a Managed Instance plan

Follow these steps to create a Managed Instance plan and deploy an app to it:

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **+ Create a resource**.
1. Search for **managed instance**
1. Select **Web App (for Managed Instance) (preview)** in the results.
1. Select **Create** to start the create process.
1. On the Basic tab, provide the following details.

#### Project details

| Setting | Value |
| --- | --- |
| Subscription | Your Azure subscription |
| Resource Group | **rg-managed-instance** |

#### App details

| Setting | Value |
| --- | --- |
| Name | **contoso-mi-app** |
| Runtime stack | **ASPNET V4.8** |
| Region | A region near you |

#### Pricing plans

| Setting | Value |
| --- | --- |
| Windows Plan | Use default plan or create new (for example, 'contoso-mi-plan') |
| Pricing plans* | Select a pricing plan. If Pv4 or Pmv4 isn't visible in _pricing plans_, confirm region availability or request more quota. |

On the Advanced tab, provide the following details.

#### Configuration (install) script

| Setting | Value |
| --- | --- |
| Storage Account | Use default plan or create new (for example, 'contoso-mi-plan') |
| Container | **scripts** |
| Zip file | **scripts.zip** |
| Value | Verify the .zip URL is correct |
| Identity | Select the managed identity that was created earlier |

1. Select **Review + create** and then select **Create**.

# [Cloud Shell](#tab/shell)

1. The following command creates the Managed Instance plan with a configuration (install) script.

```bash
az deployment group create \
  --resource-group "<resource-group-name>" \
  --template-file infra/app-service-plan-managed-instance.json \
  --parameters \
    location="<location>" \
    appServicePlanName="<plan-name>" \
    userAssignedIdentityResourceId="<identity-id>" \
    installScriptSourceUri="<script-URI>" \
    skuName=P1V4 \
    skuCapacity=1
```

Deployment takes several minutes while resources provisioned.

1. The following command creates a web app on the Managed Instance plan.

```bash
az webapp create \
  --name "<app-name>" \
  --resource-group "<resource-group-name>" \
  --plan "<plan-name>" \
  --runtime "ASPNET:V4.8"
```

1. The following command assigns a Managed Identity to the web app.

```bash
az webapp identity assign \
  --name "<app-name>" \
  --resource-group "<resource-group-name>" \
  --identities "<identity-id>"
```

---

## Deploy a sample app to Managed Instance

In this step, you use Cloud Shell to deploy a sample app that was included in the AZD template to Managed Instance.

- The following command deploys the web app to your Managed Instance plan. Update `<app-name>` and `<resource-group>` with your values.

```bash
az webapp deploy \
  --resource-group "<resource-group-name>" \
  --name "<app-name>" \
  --src-path app.zip \
  --type zip
```

## Browse to the app

To browse to the created app, select the **default domain** in the **Overview** page.

The .NET app is running on a Managed Instance plan. The app uses fonts from C:\Windows\Fonts directory.

:::image type="content" source="media/quickstart-managed-instance/browse-app-hello-world.png" alt-text="Screenshot that shows the sample app using C:\Windows\Fonts\Aptos.TTF.":::

## Manage the Managed Instance plan

To manage your web app, go to the [Azure portal](https://portal.azure.com), and search for and select **App Services**.

On the **App Services** page, select the name of your web app.

On the **Overview** page, select the name of your App Service plan. Under __Current App Service plan__, select the plan name.

In the left menu under __Settings__, select **Configuration** to view the configuration details.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting the resource group.

# [Azure portal](#tab/portal)

1. From your web app's **Overview** page in the Azure portal, select the **myResourceGroup** link under **Resource group**.
1. On the resource group page, make sure that the listed resources are the ones you want to delete.
1. Select **Delete resource group**, type **myResourceGroup** in the text box, and then select **Delete**.
1. Confirm again by selecting **Delete**.

# [Cloud Shell](#tab/shell)

```bash
az group delete
```

---

## Related content

- [Configure Managed Instance](configure-managed-instance.md)
- [App Service overview](overview.md)
- [Security in App Service](overview-security.md)
- [App Service Environment comparison](./environment/overview.md)
