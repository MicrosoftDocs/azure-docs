---
title: Quickstart - Create a network security perimeter with Azure PowerShell
description: Learn how to create a network security perimeter for an Azure resource using Azure PowerShell. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: private-link
ms.topic: quickstart
ms.date: 03/07/2024
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource using Azure PowerShell, so that I can control the network traffic to and from the resource.
---

# Quickstart: Create a network security perimeter - Azure PowerShell

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using the Azure PowerShell. A [network security perimeter](network-security-perimeter-concepts.md) allows Azure PaaS resources to communicate within an explicit trusted boundary.

In this quickstart, you create a network security perimeter for an Azure key vault, one of many [Azure Platform as a Service (PaaS) accounts supported by network security perimeter](./network-security-perimeter-concepts.md#onboarded-private-link-resources), using the Azure PowerShell. Next, You learn to create and update a PaaS resources association in a network security perimeter profile, as well as how to create and update network security perimeter access rules. To finish, you delete all resources created in this quickstart.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The latest version of the Azure PowerShell module with tools for network security perimeter.
```azurepowershell
Install-Module -Name Az.Tools.Installer -Repository PSGallery
```

- Use `Az.Tools.Installer` to install the preview build of the `Az.Network`:

    ```azurepowershell-interactive
    Install-Module -Name Az.Tools.Installer -Repository PSGallery -Force -AllowPrerelease
    Install-AzModule -Name Az.Network -AllowPrerelease -Force
    Install-AzModule -Path https://azposhpreview.blob.core.windows.net/public/Az.Network.5.6.1-preview.nupkg
    ```

[!INCLUDE [network-security-perimeter-add-preview](../../includes/network-security-perimeter-add-preview.md)]

[!INCLUDE [azure-powershell-requirements-no-header](../../includes/azure-powershell-requirements-no-header.md)]

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurepowershell
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
Set-AzContext -Subscription <subscription name or id>
```

## Create a resource group and key vault

Before you can create a network security perimeter, you have to create a resource group and a key vault resource.  
This example creates a resource group named `test-rg` in the WestCentralUS location and a key vault named `demo-keyvault-<RandomValue>` in the resource group with the following commands:


```azurepowershell-interactive
# Create a resource group
$rgParams = @{
    Name = "test-rg"
    Location = "westcentralus"
}
New-AzResourceGroup @rgParams

# Create a key vault
$keyVaultName = "demo-keyvault-$(Get-Random)"
$keyVaultParams = @{
    Name = $keyVaultName
    ResourceGroupName = $rgParams.Name
    Location = $rgParams.Location
}
$keyVault = New-AzKeyVault @keyVaultParams

```

## Create a network security perimeter

In this step, create a network security perimeter with the following `New-AzNetworkSecurityPerimeter` command:

> [!NOTE]
> Please do not put any personal identifiable or sensitive data in the network security perimeter rules or other network security perimeter configuration.

```azurepowershell-interactive

# Create a network security perimeter
$nsp = @{ 
        Name = 'demo-nsp' 
        location = 'westcentralus' 
        ResourceGroupName = $rgParams.name  
        } 

$demoNSP=New-AzNetworkSecurityPerimeter @nsp
$nspId = $demoNSP.Id
  
```


## Create and update PaaS resources’ association with a new profile

In this step, you create a new profile and associate the PaaS resource, the Azure Key Vault with the profile using the `New-AzNetworkSecurityPerimeterProfile` and `New-AzNetworkSecurityPerimeterAssociation` commands.

1. Create a new profile for your network security perimeter with the following command:

```azurepowershell-interactive
    # Create a new profile
    
    $nspprofile = @{ 
        Name = 'nsp-profile' 
        ResourceGroupName = $rgParams.name 
        SecurityPerimeterName = $nsp.name 
        }
    
    $demoProfileNSP=New-AzNetworkSecurityPerimeterProfile @nspprofile
```

2. Associate the Azure Key Vault (PaaS resource) with the network security perimeter profile with the following command: 

```azurepowershell-interactive
    # Associate the PaaS resource with the above created profile
    
    $nspassociation = @{ 
        AssociationName = 'nsp-association' 
        ResourceGroupName = $rgParams.name 
        SecurityPerimeterName = $nsp.name 
        AccessMode = 'Learning'  
        ProfileId = $demoProfileNSP.Id 
        PrivateLinkResourceId = $keyVault.ResourceID
        }

    New-AzNetworkSecurityPerimeterAssociation @nspassociation | format-list
```

3. Update association by changing the access mode to `enforced` with the `Update-AzNetworkSecurityPerimeterAssociation` command as follows:

```azurepowershell-interactive
    # Update the association to enforce the access mode
    Update-AzNetworkSecurityPerimeterAssociation -Name $nspassociation.AssociationName -ResourceGroupName $rgParams.Name -SecurityPerimeterName $nsp.Name -AccessMode 'Enforced' | format-list
``` 

## Create and update network security perimeter access rules

In this step, you create and update network security perimeter access rules.

```azurepowershell-interactive
    # Create an inbound access rule for the profile created
    $inboundrule = @{ 
        Name = 'nsp-inboundRule' 
        ProfileName = $nspprofile.Name  
        ResourceGroupName = $rgParams.Name  
        SecurityPerimeterName = $nsp.Name  
        Direction = 'Inbound'  
        AddressPrefix = "10.1.0.0/24" 
        } 

    New-AzNetworkSecurityPerimeterAccessRule @inboundrule | format-list

    # Update the inbound access rule to add more address prefixes
    Update-AzNetworkSecurityPerimeterAccessRule -Name $inboundrule.Name -ProfileName $nspprofile.Name -ResourceGroupName $rgParams.Name -SecurityPerimeterName $nsp.Name -AddressPrefix @('10.1.0.0/24','10.2.0.0/24') | format-list
```

## Delete a network security perimeter 

To delete a network security perimeter, use the following commands:

    ```azurepowershell-interactive

    # Retrieve the network security perimeter and place it in a variable
    $nsp= Get-AzNetworkSecurityPerimeter -Name demo-nsp -ResourceGroupName $rg.ResourceGroupName

    # Delete the network security perimeter and all associated resources
    Remove-AzNetworkSecurityPerimeterAssociation -Name nsp-association -ResourceGroupName $rgParams.Name -SecurityPerimeterName $nsp.Name
    
    Remove-AzNetworkSecurityPerimeter -Name $nsp.Name -ResourceGroupName $rgParams.Name
    
    # Remove the resource group
    Remove-AzResourceGroup -Name "test-rg" -Force
    ```
 
## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)