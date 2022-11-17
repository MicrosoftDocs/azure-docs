---
title: Configure a Dev Box with Azure Image Builder
titleSuffix: Microsoft Dev Box Preview
description: 'Learn how to create a custom image with Azure Image Builder, then create a Dev box with the image.'
services: dev-box
ms.service: dev-box
author: Kevin Nguyen
ms.author: kevinnguyen
ms.date: 11/17/2022
ms.topic: how-to
---

# Configure a Dev Box with Azure Image Builder

By using standardized virtual machine images, your organization can more easily migrate to the cloud and help ensure consistency in your deployments. Images ordinarily include predefined security, configuration settings, and any necessary software. Setting up your own imaging pipeline requires time, infrastructure, and many other details. With Azure VM Image Builder, you can create a configuration that describes your image and submit it to the service, where the image is built and then distributed to a Devbox project.In this guide, you will create a customized dev box using a template which includes a customization step to install Vscode. 

Although it's possible to create custom VM images by hand or by other tools, the process can be cumbersome and unreliable. VM Image Builder, which is built on HashiCorp Packer, gives you the benefits of a managed service. 

To reduce the complexity of creating VM images, VM Image Builder: 

-Removes the need to use complex tooling, processes, and manual steps to create a VM image. VM Image Builder abstracts out all these details and hides Azure-specific requirements, such as the need to generalize the image (Sysprep). And it gives more advanced users the ability to override such requirements. 

-Can be integrated with existing image build pipelines for a click-and-go experience. To do so, you can either call VM Image Builder from your pipeline or use an Azure VM Image Builder service DevOps task (preview). 

-Can fetch customization data from various sources, which removes the need to collect them all from one place. 

-Can be integrated with Compute Gallery, which creates an image management system with which to distribute, replicate, version, and scale images globally. Additionally, you can distribute the same resulting image as a VHD or as one or more managed images, without having to rebuild them from scratch. 

## Pre-requisites
Resource group and a dev center with an attached network connection. If don't have an available dev center or a network connection, follow these steps: [Configure the Microsoft Dev Box service](./quickstart-configure-dev-box-service.md#create-a-network-connection).

## Create a Windows image and distribute it to an Azure Compute Gallery 
The next step is to use Azure VM Image Builder and Azure PowerShell to create an image version in an Azure Compute Gallery (formerly Shared Image Gallery) and then distribute the image globally. You can also do this by using the Azure CLI. 

To use VM Image Builder, you need to register the features. 

Check your provider registrations. Make sure that each one returns Registered. 

```powershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages | Format-table -Property ResourceTypes,RegistrationState 
    
    Get-AzResourceProvider -ProviderNamespace Microsoft.Storage | Format-table -Property ResourceTypes,RegistrationState  
    
    Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState 
    
    Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault | Format-table -Property ResourceTypes,RegistrationState 
    
    Get-AzResourceProvider -ProviderNamespace Microsoft.Network | Format-table -Property ResourceTypes,RegistrationState 
```
    

If they don't return Registered, register the providers by running the following commands: 
```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages  
    
    Register-AzResourceProvider -ProviderNamespace Microsoft.Storage  
    
    Register-AzResourceProvider -ProviderNamespace Microsoft.Compute  
    
    Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault  
    
    Register-AzResourceProvider -ProviderNamespace Microsoft.Network 
```

Install Powershell modules: 

```powershell
'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}
```

Because you'll be using some pieces of information repeatedly, create some variables to store that information. 

Replace the Resource group with the resource group you have used to create the dev center. 

```powershell
# Get existing context  

$currentAzContext = Get-AzContext  

# Get your current subscription ID.  

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

Create a user-assigned identity and set permissions on the resource group 

VM Image Builder uses the provided user-identity to inject the image into Azure Compute Gallery. In this example, you create an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity. 

```powershell
# setup role def names, these need to be unique 
$timeInt=$(get-date -UFormat "%s") 
$imageRoleDefName="Azure Image Builder Image Def"+$timeInt 
$identityName="aibIdentity"+$timeInt 
 
## Add an Azure PowerShell module to support AzUserAssignedIdentity 
Install-Module -Name Az.ManagedServiceIdentity 
 
# Create an identity 
New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName 
 
$identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id 
$identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
```

Assign permissions for the identity to distribute the images 

Use this command to download an Azure role definition template, and then update it with the previously specified parameters. 

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

## Create an Azure Compute Gallery 

To use VM Image Builder with an Azure Compute Gallery, you need to have an existing gallery and image definition. VM Image Builder doesn't create the gallery and image definition for you. The definition created below will have Trusted Launch as security type and meets the windows 365 image requirements. 

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

New-AzGalleryImageDefinition -GalleryName $galleryName -ResourceGroupName $imageResourceGroup  -Location $location  -Name $imageDefName  -OsState generalized  -OsType Windows  -Publisher 'myCompany'  -Offer 'vscodebox'  -Sku '1-0-0' -Feature $features -HyperVGeneration "V2" 
```