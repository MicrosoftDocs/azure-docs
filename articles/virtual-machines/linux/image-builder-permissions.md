---
title: Azure Image Builder Service Permissions and Requirements
description: Configuration requirements for Azure VM Image Builder Service including permissions and privileges
author: cynthn
ms.author: patricka
ms.date: 04/29/2020
ms.topic: article
ms.service: virtual-machines
ms.subservice: imaging
---

# Configure Azure Image Builder Service requirements

Azure Image Builder Service requires configuration of permissions and privileges prior to building an image.

* Requirements
    * Allowing Azure Image Builder to Distribute Images
    * Allowing Azure Image Builder to Customize existing Custom Images
    * Allowing Azure Image Builder to Customize Images on your existing VNETs
* Creating Azure Image Builder Azure Role Definition and assignment to build image
    * AZ CLI Examples
    * Azure PowerShell Examples
* Using Managed Identity to allowing Image Builder to Access Azure Storage

## Permissions

When you register for the Azure Image Builder Service, you grant the service permission to create, manage and delete a staging resource group (IT_*), and have rights to add resources to it, that are required for the image build. 

Azure Image Builder **does not** have permission to access other resources in other resource groups in the subscription. You need to take explicit actions to allow access to avoid your builds from failing.

To allow Azure Image Builder to create,manage and delete a staging resource group you must register for the service:

### CLI example

```azurecli-interactive
az feature register --namespace Microsoft.VirtualMachineImages --name VirtualMachineTemplatePreview
```

### PowerShell example

```PowerShell
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

## Privileges

Depending on your scenario, privileges are required for Azure Image Builder. The following sections detail the privileges required for possible scenarios. To grant the required privileges, you can create an Azure custom role definition and assign it to the Azure Image Builder service principal name. For examples showing how to create a custom role definition and assigning it to the Azure Image Builder service principal name, see [Create an Azure role definition](#create-an-azure-role-definition).

### Distribute images

For Azure Image Builder to distribute images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to inject the images into these resource groups, to do this, you need to grant the Azure Image Builder Service Principal Name (SPN) rights on the resource group where the image will be placed. 

You can avoid granting the Azure Image Builder SPN contributor on the resource group to distribute images, but it's SPN will need these these Azure Actions in the distribution resource group:

```bash
# These privileges are minimum required for image builder 
# whether you are distributing from Managed Images or Shared Image Gallery

Microsoft.Compute/images/write
Microsoft.Compute/images/read
Microsoft.Compute/images/delete

# In addition, if distributing to a shared image gallery you also need:

Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
Microsoft.Compute/galleries/images/versions/write
```

### Customize existing custom images

For Azure Image Builder to build images from source custom images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to read the images into these resource groups, to do this, you need to grant the Azure Image Builder Service Principal Name (SPN) reader rights on the resource group where the image is located. 

```bash
# to build from an existing custom image
Microsoft.Compute/galleries/read

# to build from an existing SIG version
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
```

### Customize images on your existing VNETs

Azure Image Builder has the capability to deploy and use an existing VNET in your subscription, thus allowing customizations access to connected resources.

You can avoid granting the Azure Image Builder SPN contributor for it to deploy a VM to an existing VNET, but it's SPN will need these Azure Actions on the VNET resource group:

```bash
Microsoft.Network/virtualNetworks/read
Microsoft.Network/virtualNetworks/subnets/join/action
```

## Create an Azure role definition

The following examples create an Azure role definition from the actions described in the previous sections. The examples are applied at the resource group level. Evaluate and test if the examples are granular enough for your requirements. For example, the scope is set to the resource group. For your scenario, you may need to refine it to a specific shared image gallery.

The image actions allow read and write. Decide what is appropriate for your environment. For example, create a role to allow Azure Image Builder to read images from resource group *example-rg-1* and write images to resource group *example-rg-2*.

### Example: Use source custom image and distribute a custom image

The following script sets Azure Image Builder service principal name permissions to use a source custom image and distribute a custom image.

Azure CLI

```bash
# Set your variables
subscriptionID=<subID>
imageResourceGroup=<distributionRG>

# Download pre-configured example
curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

# Update the definition
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" aibRoleImageCreation.json

# Create role definitions
az role definition create --role-definition ./aibRoleImageCreation.json

# Grant role definition to the Azure Image Builder service principal name
az role assignment create \
    --assignee cf32a0cc-373c-47c9-9156-0db11f6a6dfc \
    --role "Azure Image Builder Service Image Creation Role" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```

### Example: Use an existing VNET

Setting Azure Image Builder service principal name permissions to allow it to use an existing VNET

```bash
# set your variables
subscriptionID=<subID>
imageResourceGroup=<distributionRG>

# download preconfigured example
curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleNetworking.json -o aibRoleNetworking.json

# update the definition
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleNetworking.json
sed -i -e "s/<vnetRgName>/$vnetRgName/g" aibRoleNetworking.json

# create role definitions
az role definition update --role-definition ./aibRoleNetworking.json

# grant role definition to the AIB SPN
az role assignment create \
    --assignee cf32a0cc-373c-47c9-9156-0db11f6a6dfc \
    --role "Azure Image Builder Service Networking Role" \
 --scope /subscriptions/$subscriptionID/resourceGroups/$vnetRgName
```

### Azure PowerShell Examples
#### Setting Azure Image Builder SPN Permissions to use source custom image and distribute a custom image
```powerShell
# set your variables

# download preconfigured example
$aibRoleImageCreationUrl="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
$aibRoleImageCreationPath = "aibRoleImageCreation.json"

Invoke-WebRequest -Uri $aibRoleImageCreationUrl -OutFile $aibRoleImageCreationPath -UseBasicParsing

# update the definition
((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $aibRoleImageCreationPath
((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<rgName>', $imageResourceGroup) | Set-Content -Path $aibRoleImageCreationPath

# create role definitions
New-AzRoleDefinition -InputFile  ./aibRoleImageCreation.json

# grant role definition to the AIB SPN

New-AzRoleAssignment -ObjectId ef511139-6170-438e-a6e1-763dc31bdf74 -RoleDefinitionName "Azure Image Builder Service Image Creation Role" -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
```

#### Setting Azure Image Builder SPN Permissions to allow it to use an existing VNET

```powerShell
# set your variables

# download preconfigured example
$aibRoleNetworkingUrl="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleNetworking.json"
$aibRoleNetworkingPath = "aibRoleNetworking.json"

Invoke-WebRequest -Uri $aibRoleNetworkingUrl -OutFile $aibRoleNetworkingPath -UseBasicParsing

# update the definition
((Get-Content -path $aibRoleNetworkingPath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $aibRoleNetworkingPath
((Get-Content -path $aibRoleNetworkingPath -Raw) -replace '<vnetRgName>',$vnetRgName) | Set-Content -Path $aibRoleNetworkingPath

# create role definitions
New-AzRoleDefinition -InputFile  ./aibRoleNetworking.json

# grant role definition to image builder service principal
New-AzRoleAssignment -ObjectId ef511139-6170-438e-a6e1-763dc31bdf74 -RoleDefinitionName "Azure Image Builder Service Networking Role" -Scope "/subscriptions/$subscriptionID/resourceGroups/$vnetRgName"
```
## Using Managed Identity to allowing Image Builder to Access Azure Storage
If you want to seemlessly authenticate with Azure Storage, and use Private Containers, then you need to give Azure Image Builder an Azure User-Assigned Managed Identity, which it can use to authenticate with Azure Storage.

>>> Note! Azure Image Builder only uses the identity at image template submission time, the build VM does not have access to the identity during image build!!!

We have a [quick start](XXXXXXXhttps://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/7_Creating_Custom_Image_using_MSI_to_Access_Storage#create-a-custom-image-that-will-use-an-azure-user-assigned-managed-identity-to-seemlessly-access-files-azure-storage) that walks through how to connect to set this up, but in summary, once you have created User-Assigned Managed Identity, you then give rights for it to read from the storage account:

```bash
az role assignment create \
    --assignee $imgBuilderCliId \
    --role "Storage Blob Data Reader" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$strResourceGroup/providers/Microsoft.Storage/storageAccounts/$scriptStorageAcc/blobServices/default/containers/$scriptStorageAccContainer 
```

Then in the Image Builder Template you need to provide the User-Assigned Managed Identity:

```json
    "type": "Microsoft.VirtualMachineImages/imageTemplates",
    "apiVersion": "2019-05-01-preview",
    "location": "<region>",
    ..
    "identity": {
    "type": "UserAssigned",
          "userAssignedIdentities": {
            "<imgBuilderId>": {}     
        }
```

We are making service improvements to reduce the complexity of the existing security model.