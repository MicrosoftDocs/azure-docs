---
title: Configure a dev box by using Azure VM Image Builder
titleSuffix: Microsoft Dev Box
description: Learn how to use Azure VM Image Builder to build a custom image for configuring dev boxes with Microsoft Dev Box.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurepowershell
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/02/2024
ms.topic: how-to
---

# Configure a dev box by using Azure VM Image Builder and Microsoft Dev Box

In this article, you use Azure VM Image Builder to create a customized dev box in Microsoft Dev Box by using a template. The template includes a customization step to install Visual Studio Code (VS Code).

When your organization uses standardized virtual machine (VM) images, it can more easily migrate to the cloud and help ensure consistency in your deployments. Images ordinarily include predefined security, configuration settings, and any necessary software. Setting up your own imaging pipeline requires time, infrastructure, and many other details. With Azure VM Image Builder, you can create a configuration that describes your image. The service then builds the image and submits it to a dev box project.

Although it's possible to create custom VM images by hand or by using other tools, the process can be cumbersome and unreliable. VM Image Builder, which is built on HashiCorp Packer, gives you the benefits of a managed service.

To reduce the complexity of creating VM images, VM Image Builder:

- Removes the need to use complex tooling, processes, and manual steps to create a VM image. VM Image Builder abstracts out all these details and hides Azure-specific requirements, such as the need to generalize the image (Sysprep). And it gives more advanced users the ability to override such requirements.

- Works with existing image build pipelines for a click-and-go experience. You can call VM Image Builder from your pipeline or use an Azure VM Image Builder service DevOps task.

- Fetches customization data from various sources, which removes the need to collect them all from one place.

- Integrates with Azure Compute Gallery, which creates an image management system for distributing, replicating, versioning, and scaling images globally. Additionally, you can distribute the same resulting image as a virtual hard disk or as one or more managed images, without having to rebuild them from scratch.

> [!IMPORTANT]
> Microsoft Dev Box supports only images that use the security type [Trusted Launch](/azure/virtual-machines/trusted-launch-portal?tabs=portal%2Cportal2) enabled.

## Prerequisites

To provision a custom image that you created by using VM Image Builder, you need:

- Azure PowerShell 6.0 or later. If you don't have PowerShell installed, follow the steps in [Install Azure PowerShell on Windows](/powershell/azure/install-azps-windows).
- Owner or Contributor permissions on an Azure subscription or on a specific resource group.
- A resource group.
- A dev center with an attached network connection. If you don't have one, follow the steps in [Connect dev boxes to resources by configuring network connections](how-to-configure-network-connections.md).

## Create a Windows image and distribute it to Azure Compute Gallery

The first step is to use Azure VM Image Builder and Azure PowerShell to create an image version in Azure Compute Gallery and then distribute the image globally. You can also do this task by using the Azure CLI.

1. To use VM Image Builder, you need to register the features.

   Check your provider registrations. Make sure each command returns `Registered` for the specified feature.

   ```powershell
      Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages | Format-table -Property ResourceTypes,RegistrationState 
      Get-AzResourceProvider -ProviderNamespace Microsoft.Storage | Format-table -Property ResourceTypes,RegistrationState  
      Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState 
      Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault | Format-table -Property ResourceTypes,RegistrationState 
      Get-AzResourceProvider -ProviderNamespace Microsoft.Network | Format-table -Property ResourceTypes,RegistrationState 
   ```

   If the provider registrations don't return `Registered`, register the providers by running the following commands:

   ```powershell
      Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages  
      Register-AzResourceProvider -ProviderNamespace Microsoft.Storage  
      Register-AzResourceProvider -ProviderNamespace Microsoft.Compute  
      Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault  
      Register-AzResourceProvider -ProviderNamespace Microsoft.Network 
   ```

1. Install PowerShell modules:

   ```powershell
   'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}
   ```

1. Create variables to store information that you use more than once.

   1. Copy the following sample code.
   1. Replace `<Resource group>` with the resource group that you used to create the dev center.
   1. Run the updated code in PowerShell.

   ```powershell
   # Get existing context 
   $currentAzContext = Get-AzContext

   # Get your current subscription ID  
   $subscriptionID=$currentAzContext.Subscription.Id

   # Destination image resource group  
   $imageResourceGroup="<Resource group>"

   # Location  
   $location="eastus2"

   # Image distribution metadata reference name  
   $runOutputName="aibCustWinManImg01"

   # Image template name  
   $imageTemplateName="vscodeWinTemplate"  
   ```

1. Create a user-assigned identity and set permissions on the resource group by running the following code in PowerShell.

   VM Image Builder uses the provided user identity to inject the image into Azure Compute Gallery. The following example creates an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity.

   ```powershell
   # Set up role definition names, which need to be unique 
   $timeInt=$(get-date -UFormat "%s") 
   $imageRoleDefName="Azure Image Builder Image Def"+$timeInt 
   $identityName="aibIdentity"+$timeInt 
    
   # Add an Azure PowerShell module to support AzUserAssignedIdentity 
   Install-Module -Name Az.ManagedServiceIdentity 
    
   # Create an identity 
   New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Location $location
    
   $identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id 
   $identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
   ```

1. Assign permissions for the identity to distribute the images.

   Use this command to download an Azure role definition template, and then update it with the previously specified parameters:

   ```powershell
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

## Create a gallery

To use VM Image Builder with Azure Compute Gallery, you need to have an existing gallery and image definition. VM Image Builder doesn't create the gallery and image definition for you.

1. Run the following commands to create a new gallery and image definition.

   This code creates a definition with the _trusted launch_ security type and meets the Windows 365 image requirements.

   ```powershell
   # Gallery name 
   $galleryName= "devboxGallery" 

   # Image definition name 
   $imageDefName ="vscodeImageDef" 

   # Additional replication region 
   $replRegion2="eastus" 

   # Create the gallery 
   New-AzGallery -GalleryName $galleryName -ResourceGroupName $imageResourceGroup -Location $location 

   $SecurityType = @{Name='SecurityType';Value='TrustedLaunch'} 
   $features = @($SecurityType) 

   # Create the image definition
   New-AzGalleryImageDefinition -GalleryName $galleryName -ResourceGroupName $imageResourceGroup -Location $location -Name $imageDefName -OsState generalized -OsType Windows -Publisher 'myCompany' -Offer 'vscodebox' -Sku '1-0-0' -Feature $features -HyperVGeneration "V2" 
   ```

1. Create a file to store your template definition, such as c:/temp/mytemplate.txt.

1. Copy the following Azure Resource Manger template for VM Image Builder into your new template file.

   This template indicates the source image and the customizations applied. It installs Choco and VS Code, and also indicates the image distribution location.

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
               "name": "Install Choco and Vscode",
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

   Close your template file before proceeding to the next step.

1. Configure your new template with your variables.

   Replace `<Template Path>` with the location of your template file, such as `c:/temp/mytemplate`.

   ```powershell
   $templateFilePath = <Template Path>
   
   (Get-Content -path $templateFilePath -Raw ) -replace '<subscriptionID>',$subscriptionID | Set-Content -Path $templateFilePath 
   (Get-Content -path $templateFilePath -Raw ) -replace '<rgName>',$imageResourceGroup | Set-Content -Path $templateFilePath 
   (Get-Content -path $templateFilePath -Raw ) -replace '<runOutputName>',$runOutputName | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<imageDefName>',$imageDefName | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<sharedImageGalName>',$galleryName| Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<region1>',$location | Set-Content -Path $templateFilePath  
   (Get-Content -path $templateFilePath -Raw ) -replace '<region2>',$replRegion2 | Set-Content -Path $templateFilePath  
   ((Get-Content -path $templateFilePath -Raw) -replace '<imgBuilderId>',$identityNameResourceId) | Set-Content -Path $templateFilePath 
   ```

1. Submit your template to the service.

   The following command downloads any dependent artifacts, such as scripts, and store them in the staging resource group. The staging resource group is prefixed with `IT_`.

   ```powershell
   New-AzResourceGroupDeployment  -ResourceGroupName $imageResourceGroup  -TemplateFile $templateFilePath  -Api-Version "2020-02-14"  -imageTemplateName $imageTemplateName  -svclocation $location 
   ```

1. Build the image by invoking the `Run` command on the template:

   At the prompt to confirm the run process, enter **Yes**.

   ```powershell
   Invoke-AzResourceAction  -ResourceName $imageTemplateName  -ResourceGroupName $imageResourceGroup  -ResourceType Microsoft.VirtualMachineImages/imageTemplates  -ApiVersion "2020-02-14"  -Action Run
   ```

   > [!IMPORTANT]
   > Creating the image and replicating it to both regions can take some time. You might see a difference in progress reporting between PowerShell and the Azure portal. Before you begin creating a dev box definition, wait until the process completes.

1. Get information about the newly built image, including the run status and provisioning state.

    ```powershell
    Get-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup | Select-Object -Property Name, LastRunStatusRunState, LastRunStatusMessage, ProvisioningState 
    ```

    Sample output:

    ```powershell
    Name                 LastRunStatusRunState    LastRunStatusMessage   ProvisioningState
    ---------------------------------------------------------------------------------------
    vscodeWinTemplate                                                    Creating
    ```

    You can also view the provisioning state of your image in the Azure portal. Go to your gallery and view the image definition.

    :::image type="content" source="media/how-to-customize-devbox-azure-image-builder/image-version-provisioning-state.png" alt-text="Screenshot that shows the provisioning state of the customized image version." lightbox="media/how-to-customize-devbox-azure-image-builder/image-version-provisioning-state.png":::

## Configure the gallery

After your custom image is provisioned in the gallery, you can configure the gallery to use the images in the dev center. For more information, see [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).

## Set up Microsoft Dev Box with a custom image

After the gallery images are available in the dev center, you can use the custom image with Microsoft Dev Box. For more information, see [Quickstart: Configure Microsoft Dev Box](./quickstart-configure-dev-box-service.md).

## Related content

- [Create a dev box definition](quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
