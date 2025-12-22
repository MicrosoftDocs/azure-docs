---
title: "Tutorial: Replicate 3rd Party (3P) Images into an Azure Extended Zone with Azure Compute Gallery"
description: Learn how to Replicate 3rd Party (3P) Images into an Azure Extended Zone with Azure Compute Gallery.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: tutorial
ms.date: 08/26/2025
---

# Tutorial: Replicate 3rd Party (3P) Images into an Azure Extended Zone with Azure Compute Gallery

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a user-assigned managed identity.
> - Assign a Contributor role to the managed identity.
> - Assign the managed identity to an Azure Compute Gallery.
> - Replicate 3rd Party (3P) Images into an Azure Extended Zone with Azure Compute Gallery.

Azure Compute Gallery (previously Shared Image Gallery) is available in Extended Zones for 3rd parties, following a separate workflow.  

> [!NOTE]
> Platform Image Repositories are currently being replicated in Extended Zones to be on par with the region. Should you not be able to find your required image within a given Extended Zone, contact aezsupport@microsoft.com. The product’s engineering team is happy to help replicating it ahead of the broader replication. 

## Prerequisites
- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/entra/identity/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types).
- Both gallery and gallery image definition need to be created in the same region for these instructions to work; they can't be in different regions.
- A user assigned managed identity is required to be set to the gallery, so that features available on that subscription can be queried. One of the features is set by EdgeZone Resource Provider, when the subscription is given access to use the Extended Zone. Azure Compute Gallery will query Azure Resource Manager with the assigned managed identity to get the list of features.
 
## Create a user-assigned managed identity
To create a user-assigned managed identity, your account needs the [Managed Identity Reader](/azure/role-based-access-control/built-in-roles#general) role assignment.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Managed Identities**. Under **Services**, select **Managed Identities**.
1. Select **Add**, and enter values in the following boxes in the **Create User Assigned Managed Identity** pane:
    - **Subscription**: Choose the subscription to create the user-assigned managed identity under.
    - **Resource group**: Choose a resource group to create the user-assigned managed identity in, or select **Create new** to create a new resource group.
    - **Region**: Choose a region to deploy the user-assigned managed identity, for example, **West US**. **Remember that both gallery and gallery image definition need to be created in the same region.**
    - **Name**: Enter the name for your user-assigned managed identity, for example, UAI1.

    > [!NOTE]
    > When you create user-assigned managed identities, the name must start with a letter or number, and may include a combination of alphanumeric characters, hyphens (-) and underscores (_). For the assignment to a virtual machine or virtual machine scale set to work properly, the name is limited to 24 characters.

1. Select **Review + create** to review the changes.
1. Select **Create**.

# [**PowerShell**](#tab/powershell)

```powershell
#Login to Azure account
Connect-AzAccount -Tenant "your tenant"
#Set variables
$subscriptionId = "yoursubid" 
$resourceGroupName = "ACG" $location = "eastus2euap" # Change to your preferred Azure region 
$identityName = "ACGManagedIdentity" 
$galleryName = "ComputeGallery"
#Set the subscription context
Set-AzContext -SubscriptionId $subscriptionId $token = Get-AzAccessToken
#-------------------- CREATE MSI -----
#Check if the identity already exists
$existingIdentity = Get-AzUserAssignedIdentity -ResourceGroupName $resourceGroupName -Name $identityName -ErrorAction SilentlyContinue
if ($null -eq $existingIdentity) { Write-Output "Managed Identity '$identityName' not found. Creating..." $userAssignedIdentity = New-AzUserAssignedIdentity -ResourceGroupName $resourceGroupName -Name $identityName ` -Location $location Write-Output "Managed Identity created successfully." } else { Write-Output "Managed Identity '$identityName' already exists." }
```
 
---

## Assign a Reader role to the managed identity
Once the identity is created, you should be able to find it in the resources section of the subscription. You'll need to give the Managed Identity **Reader** (or higher) role to the subscription to read the features registered for that subscription.

# [**Portal**](#tab/portal)

1. Select on the recently created identity and select on **JSON View** to get the resource ID. Copy and save it for a later step.
1. Select on **Access Control**, on the left side menu, and select **Add**.
1. Within **Job function roles**, select **Reader** from the list. 
1. Select the user-assigned managed identity recently created.
1. In the **Members** tab, select **Managed identity**.
1. Verify it's added by selecting **Azure role assignments** and confirming in the listed managed identities.

# [**PowerShell**](#tab/powershell)
```powershell
#Set variables
Connect-AzAccount -Tenant "72f988bf-86f1-41af-91ab-2d7cd011db47"
Set-AzContext -SubscriptionId $subscriptionId
$token = Get-AzAccessToken
# Get the managed identity
$identity = Get-AzUserAssignedIdentity -ResourceGroupName $resourceGroupName -Name $identityName

#Assign Reader role to the identity
New-AzRoleAssignment `
    -ObjectId $identity.PrincipalId `
    -RoleDefinitionName $roleDefinitionName `
    -Scope $scope 
```
---
## Assign the managed identity to an Azure Compute Gallery
Assigning the managed identity to the gallery is currently only possible through a REST API PATCH call. You can use tools like Postman, Fiddler, or PowerShell. 

PATCH: The region should be the region where gallery is located. Use the same region in the following steps.

```
Url:
https://galleryregion.management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/yourresourcegroup/providers/Microsoft.Compute/galleries/yourgallery?api-version=2023-07-03

Body:
{  
    "identity":{  
       "type":"UserAssigned",
       "userAssignedIdentities":{  
          “/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACGManagedIdentity":{}
       }
    }
}
```

```powershell
$requestBody = @{ location = $location identity = @{ type = "UserAssigned" userAssignedIdentities = @{ $userAssignedIdentity.Id = @{} } } }
$requestBodyJson = $requestBody | convertto-json -Depth 8 $uri = "https://$location.management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/galleries/${galleryName}?api-version=2023-07-03" $params = @{ Headers = @{'authorization'="Bearer $($token.Token)"}; Method = 'PUT'; URI = $uri; Body = $requestBodyJson; ContentType = 'application/json' } $response = Invoke-RestMethod @params $response | convertto-json -Depth 8
```
---
## Code/script version

## Replicate 3rd Party (3P) Images into an Azure Extended Zone with Azure Compute Gallery
Having fulfilled the previous steps, you can use the following CLI or PowerShell scripts to replicate your images. 

> [!NOTE]
> Allowed Storage Account types are Standard_LRS, Standard_ZRS, and Premium_LRS.


```azurecli
az sig image-version update --resource-group MyResourceGroup --gallery-name MyGallery --
gallery-image-definition PlaceholderImage --gallery-image-version 0.0.1 --target-edge-zones
westus=losangeles=2=standardssd_lrs
```

```powershell
$edgezone_losangeles = @{
    Location = "westus"
    ExtendedLocation = @{ Name = 'losangeles'; Type = 'EdgeZone' }
    ReplicaCount = 1
    StorageAccountType = "StandardSSD_LRS" # or "Premium_LRS" — used for replication in ExtendedZone
}

$targetExtendedLocations = @($edgezone_losangeles)

New-AzGalleryImageVersion `
    -ResourceGroupName $rgName `
    -GalleryName $galleryName `
    -GalleryImageDefinitionName $galleryImageDefinitionName `
    -Name $galleryImageVersionName `
    -Location $location `
    -OSDiskImage $osSnapshot `
    -ReplicaCount 1 `
    -StorageAccountType "Standard_LRS" ` # region replication (allowed: Standard_LRS, Standard_ZRS, Premium_LRS)
    -TargetExtendedLocation $targetExtendedLocations
```
----------------------------------------------------------------

## Related content

- [What is Azure Extended Zones?](overview.md)
- [What is managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [What is Azure Compute Gallery?](/azure/virtual-machines/azure-compute-gallery)
