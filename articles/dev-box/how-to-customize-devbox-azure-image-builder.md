---
title: Use Azure VM Image Builder
description: Learn how to use Azure VM Image Builder to create and distribute a customized dev box image for Microsoft Dev Box.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurepowershell
author: RoseHJM
ms.author: rosemalcolm
ms.date: 12/05/2025
ms.topic: how-to
ai-usage: ai-assisted
---

# Use Azure VM Image Builder to create a dev box image

This article shows you how to use an Azure VM Image Builder template to create a customized VM image in Azure Compute Gallery and distribute it globally. You can then use the image to create dev boxes in Microsoft Dev Box.

Standardized VM images can help you ensure consistent dev box deployments by including predefined security, configuration, and software. But manually setting up an imaging pipeline is time-consuming and complex, and creating custom virtual machine (VM) images can be difficult and unreliable.

Azure VM Image Builder is a managed service based on HashiCorp Packer that simplifies the process of creating and building VM images for dev boxes. The Image Builder template in this article includes customization steps that install Visual Studio Code and Chocolatey.

VM Image Builder can:

- Abstract manual steps or complex tools and processes and hide Azure-specific needs. For example, generalize an image by running `sysprep` but allow advanced users to override it.
- Work with existing image build pipelines. You can call VM Image Builder from your pipeline or use an Azure VM Image Builder service task in Azure Pipelines.
- Gather customization data from various sources, so you don't have to collect it yourself.
- Integrate with Azure Compute Gallery to create an image management system for global distribution, replication, versioning, and scaling. You can distribute an image as both a virtual hard disk and a managed image without rebuilding it.

> [!IMPORTANT]
> Microsoft Dev Box supports only images that use the [Trusted Launch](/azure/virtual-machines/trusted-launch-portal?tabs=portal%2Cportal2) security type.

## Prerequisites

The example in this article uses Azure PowerShell. You can also use the Azure CLI.

| Category | Requirements |
|---------|--------------|
| Tools and permissions | An Azure resource group that you have **Owner** or **Contributor** permissions to. |
| Tools | Azure PowerShell 6.0 or later installed. For instructions, see [Install Azure PowerShell on Windows](/powershell/azure/install-azps-windows). |

## Set up tools and roles

To set up tools and roles, you:

1. Install necessary Azure PowerShell modules.
1. Set variables for information you use more than once.
1. Register necessary Azure resource providers.
1. Create a user identity for your resource group and assign it a role that allows distributing images.

### Install PowerShell modules

Install the necessary PowerShell modules by running the following command:

```azurepowershell
'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}
```

Respond *Y* to the prompts about untrusted repositories.

### Set variables

Create variables to store information you use more than once. Run the following code, replacing `<resource-group>` with your resource group name and `<location>` with the Azure region you want to use.

```azurepowershell
# Get existing context 
$currentAzContext = Get-AzContext

# Get your current subscription ID  
$subscriptionID=$currentAzContext.Subscription.Id

# Destination image resource group  
$imageResourceGroup="<resource-group>"

# Location
$location="<location>"

# Image distribution metadata reference name  
$runOutputName="aibCustWinManImg01"

# Image template name  
$imageTemplateName="vscodeWinTemplate"  
```

### Register Azure resource providers

To use VM Image Builder, the following Azure resource providers must be registered:

- `Microsoft.VirtualMachineImages`
- `Microsoft.Compute`
- `Microsoft.Network`
- `Microsoft.Storage`
- `Microsoft.KeyVault`
- `Microsoft.ContainerInstance`

1. Check the provider registrations by running the following command:

   ```azurepowershell
     Get-AzResourceProvider -ProviderNamespace "Microsoft.VirtualMachineImages", "Microsoft.Compute", "Microsoft.Network", "Microsoft.Storage", "Microsoft.KeyVault", "Microsoft.ContainerInstance" | Format-table -Property ProviderNamespace,RegistrationState
   ```

1. If any of the provider registrations don't return `Registered`, register the provider by running the `Register-AzResourceProvider` command. The following example registers the `Microsoft.VirtualMachineImages` resource provider.

   ```azurepowershell
     Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
   ```

### Create and assign a user identity

Create an Azure role definition that allows distributing the image. Then create a user-assigned identity for your resource group and assign the role to the user identity. VM Image Builder uses the user identity to store the image in Azure Compute Gallery.

1. Run the following code to create an Azure role definition and user identity.

   ```azurepowershell
   # Set up a unique role definition name
   $timeInt=$(get-date -UFormat "%s") 
   $imageRoleDefName="Azure Image Builder Image Def"+$timeInt 
   $identityName="aibIdentity"+$timeInt 
   
   # Create an identity 
   New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Location $location
   
   $identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id 
   $identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
   ```

1. Run the following code to download an Azure role definition template that allows distributing an image, update the template with your parameters, and assign the role to the user identity.

   ```azurepowershell
   $aibRoleImageCreationUrl="https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json" 
   $aibRoleImageCreationPath = "aibRoleImageCreation.json" 
   
   # Download the configuration 
   Invoke-WebRequest -Uri $aibRoleImageCreationUrl -OutFile $aibRoleImageCreationPath -UseBasicParsing 
   ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $aibRoleImageCreationPath 
   ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<rgName>', $imageResourceGroup) | Set-Content -Path $aibRoleImageCreationPath 
   ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName) | Set-Content -Path $aibRoleImageCreationPath 
   
   # Create a role definition 
   New-AzRoleDefinition -InputFile  ./aibRoleImageCreation.json

   # Grant the role definition to the VM Image Builder service principal 
   New-AzRoleAssignment -ObjectId $identityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup" 
   ```

## Create a gallery and VM Image Builder template

To use VM Image Builder with Azure Compute Gallery, you need a gallery and an image definition. The following steps create a new gallery and image definition and customize a VM Image Builder template.

1. Run the following commands to create a new gallery and an image definition that has the required trusted launch security type for a Windows 365 image.

   ```azurepowershell
   # Gallery name 
   $galleryName= "devboxGallery" 

   # Image definition name 
   $imageDefName ="vscodeImageDef" 

   # Second replication region 
   $replRegion2="eastus" 

   # Create the gallery 
   New-AzGallery -GalleryName $galleryName -ResourceGroupName $imageResourceGroup -Location $location 

   $SecurityType = @{Name='SecurityType';Value='TrustedLaunch'} 
   $features = @($SecurityType) 

   # Create the image definition
   New-AzGalleryImageDefinition -GalleryName $galleryName -ResourceGroupName $imageResourceGroup -Location $location -Name $imageDefName -OsState generalized -OsType Windows -Publisher 'myCompany' -Offer 'vscodebox' -Sku '1-0-0' -Feature $features -HyperVGeneration "V2" 
   ```

1. Copy and paste the following Azure Resource Manager template for VM Image Builder into a new file. Save the file to a location such as *c:\\temp\\mytemplate.json*, and then close the file.

   The template defines the source image and customizations applied, installs Chocolatey and Visual Studio Code, and indicates the image distribution location.

   ```json
   {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "imageTemplateName": {
         "type": "string"
        },
        "api-version": {
         "type": "string"
        },
        "svclocation": {
         "type": "string"
        }
      },
      "variables": {},
      "resources": [
        {
         "name": "[parameters('imageTemplateName')]",
         "type": "Microsoft.VirtualMachineImages/imageTemplates",
         "apiVersion": "[parameters('api-version')]",
         "location": "[parameters('svclocation')]",
         "dependsOn": [],
         "tags": {
           "imagebuilderTemplate": "win11multi",
           "userIdentity": "enabled"
         },
         "identity": {
           "type": "UserAssigned",
           "userAssignedIdentities": {
            "<imgBuilderId>": {}
           }
         },
         "properties": {
           "buildTimeoutInMinutes": 100,
           "vmProfile": {
            "vmSize": "Standard_DS2_v2",
            "osDiskSizeGB": 127
           },
         "source": {
            "type": "PlatformImage",
            "publisher": "MicrosoftWindowsDesktop",
            "offer": "Windows-11",
            "sku": "win11-21h2-ent",
            "version": "latest"
         },
           "customize": [
            {
               "type": "PowerShell",
               "name": "Install Choco and VS Code",
               "inline": [
                  "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))",
                  "choco install -y vscode"
               ]
            }
           ],
            "distribute": 
            [
               {   
                  "type": "SharedImage",
                  "galleryImageId": "/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<sharedImageGalName>/images/<imageDefName>",
                  "runOutputName": "<runOutputName>",
                  "artifactTags": {
                     "source": "azureVmImageBuilder",
                     "baseosimg": "win11multi"
                  },
                  "replicationRegions": [
                    "<region1>",
                    "<region2>"
                  ]
               }
            ]
         }
        }
      ]
     }
   ```

1. Configure the new template with your settings by running the following code, replacing `<template-location>` with your template file location and name.

   ```azurepowershell
   $templateFilePath = "<template-location>"
   
   (Get-Content -path $templateFilePath -Raw ) -replace '<subscriptionID>',$subscriptionID | Set-Content -Path $templateFilePath 
   (Get-Content -path $templateFilePath -Raw ) -replace '<rgName>',$imageResourceGroup | Set-Content -Path $templateFilePath 
   (Get-Content -path $templateFilePath -Raw ) -replace '<runOutputName>',$runOutputName | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<imageDefName>',$imageDefName | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<sharedImageGalName>',$galleryName| Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<region1>',$location | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<region2>',$replRegion2 | Set-Content -Path $templateFilePath  
   ((Get-Content -path $templateFilePath -Raw) -replace '<imgBuilderId>',$identityNameResourceId) | Set-Content -Path $templateFilePath 
   ```

## Build and view the image

Submit your customized template to the VM Image Builder service and build the image.

1. Run the following command to submit your template to the service. The command downloads any dependent artifacts, such as scripts, and stores them in a staging resource group prefixed with `IT_`.

   ```azurepowershell
   New-AzResourceGroupDeployment  -ResourceGroupName $imageResourceGroup  -TemplateFile $templateFilePath  -Api-Version "2020-02-14"  -imageTemplateName $imageTemplateName  -svclocation $location 
   ```

1. Build the image by invoking the `Run` action on the template. At the confirmation prompt, enter *Y* for `Yes`.

   ```azurepowershell
   Invoke-AzResourceAction  -ResourceName $imageTemplateName  -ResourceGroupName $imageResourceGroup  -ResourceType Microsoft.VirtualMachineImages/imageTemplates  -ApiVersion "2020-02-14"  -Action Run
   ```

> [!IMPORTANT]
> Creating the image and replicating it to two regions can take some time. You might see different progress reporting between PowerShell and the Azure portal. Wait until the process completes before you start creating a dev box definition from the image. 

### Get information about the image

Run the following command to get information about the newly built image, including the run status and provisioning state.

```azurepowershell
Get-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup | Select-Object -Property Name, LastRunStatusRunState, LastRunStatusMessage, ProvisioningState 
```

Sample output:

```azurepowershell
Name              LastRunStatusRunState LastRunStatusMessage ProvisioningState
----              --------------------- -------------------- -----------------
vscodeWinTemplate Running                                    Succeeded
```

You can also view the provisioning state of your image in the Azure portal. Go to your gallery to view the image definition.

:::image type="content" source="media/how-to-customize-devbox-azure-image-builder/image-version-provisioning-state.png" alt-text="Screenshot that shows the provisioning state of the customized image version." lightbox="media/how-to-customize-devbox-azure-image-builder/image-version-provisioning-state.png":::

## Configure the gallery and create a dev box

Once your custom image is stored in the gallery, you can configure the gallery to use its images in a Microsoft Dev Box dev center. For more information, see [Configure Azure Compute Gallery for Microsoft Dev Box](./how-to-configure-azure-compute-gallery.md).

After you make the gallery images available in the dev center, you can attach the custom image to a dev box project and use it to create dev boxes. For more information, see [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md).

## Related content

- [Manage a dev box definition](how-to-manage-dev-box-definitions.md)
