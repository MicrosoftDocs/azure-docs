---
title: Quickstart - Create a network security perimeter - Azure PowerShell
description: Learn how to create a network security perimeter for an Azure resource using Azure PowerShell. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 11/06/2024
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource using Azure PowerShell, so that I can control the network traffic to and from the resource.
---

# Quickstart: Create a network security perimeter - Azure PowerShell

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using Azure PowerShell. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure Platform as a Service (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources) resources to communicate within an explicit trusted boundary. You create and update a PaaS resource's association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [network-security-perimeter-add-preview](../../includes/network-security-perimeter-add-preview.md)]

- The latest version of the Azure PowerShell module with tools for network security perimeter.
  
    ```azurepowershell
    # Install the Az.Tools.Installer module    
    Install-Module -Name Az.Tools.Installer -Repository PSGallery
    ```

- Use `Az.Tools.Installer` to install the preview build of the `Az.Network`:

    ```azurepowershell-interactive
    # Install the preview build of the Az.Network module
    Install-Module -Name Az.Tools.Installer -Repository PSGallery -allowprerelease -force

    # List the current versions of the Az.Network module available in the PowerShell Gallery
    Find-Module -Name Az.Network -Allversions -AllowPrerelease

    # Install the preview build of the Az.Network module using the 

    Install-AzModule -Name Az.Network -AllowPrerelease -Force
    Install-AzModule -Path <previewVersionNumber>
    ```
    > [!NOTE]
    > The preview version of the Az.Network module is required to use network security perimeter capabilities. The latest version of the Az.Network module is available in the PowerShell Gallery. Look for the newest version that ends in `-preview`.

- If you choose to use Azure PowerShell locally:
  - [Install the latest version of the Az PowerShell module](/powershell/azure/install-azure-powershell).
  - Connect to your Azure account using the
    [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.
- If you choose to use Azure Cloud Shell:
  - For more information on Azure Cloud Shell, see [Overview of Azure Cloud Shell](/azure/cloud-shell/overview).
- To get help with the PowerShell cmdlets, use the `Get-Help` command:
    ```azurepowershell-interactive
    
    # Get help for a specific command
    get-help -Name <powershell-command> - full

    # Example
    get-help -Name New-AzNetworkSecurityPerimeter - full
    ```

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurepowershell
# Sign in to your Azure account
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
# List all subscriptions
Set-AzContext -Subscription <subscriptionId>

# Register the Microsoft.Network resource provider
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
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
        
        $nspProfile = @{ 
            Name = 'nsp-profile' 
            ResourceGroupName = $rgParams.name 
            SecurityPerimeterName = $nsp.name 
            }
        
        $demoProfileNSP=New-AzNetworkSecurityPerimeterProfile @nspprofile
    ```

2. Associate the Azure Key Vault (PaaS resource) with the network security perimeter profile with the following command: 

    ```azurepowershell-interactive
        # Associate the PaaS resource with the above created profile
        
        $nspAssociation = @{ 
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
        $updateAssociation = @{ 
            AssociationName = $nspassociation.AssociationName 
            ResourceGroupName = $rgParams.name 
            SecurityPerimeterName = $nsp.name 
            AccessMode = 'Enforced'
            }
        Update-AzNetworkSecurityPerimeterAssociation @updateAssociation | format-list
    ```     

## Manage network security perimeter access rules

In this step, you create, update and delete network security perimeter access rules with public IP address prefixes.

```azurepowershell-interactive
    # Create an inbound access rule for a public IP address prefix
    $inboundRule = @{ 
        Name = 'nsp-inboundRule' 
        ProfileName = $nspprofile.Name  
        ResourceGroupName = $rgParams.Name  
        SecurityPerimeterName = $nsp.Name  
        Direction = 'Inbound'  
        AddressPrefix = '192.0.2.0/24' 
        } 

    New-AzNetworkSecurityPerimeterAccessRule @inboundrule | format-list

    # Update the inbound access rule to add more public IP address prefixes
    $updateInboundRule = @{ 
        Name = $inboundrule.Name 
        ProfileName = $nspprofile.Name  
        ResourceGroupName = $rgParams.Name  
        SecurityPerimeterName = $nsp.Name  
        AddressPrefix = @('192.0.2.0/24','198.51.100.0/24')
        }
    Update-AzNetworkSecurityPerimeterAccessRule @updateInboundRule | format-list
```

[!INCLUDE [network-security-pe~rimeter-note-managed-id](../../includes/network-security-perimeter-note-managed-id.md)]

## Delete all resources 

When you no longer need the network security perimeter, remove all resources associated with the network security perimeter, remove the perimeter, and then remove the resource group.

```azurepowershell-interactive

    # Retrieve the network security perimeter and place it in a variable
    $nsp= Get-AzNetworkSecurityPerimeter -Name demo-nsp -ResourceGroupName $rg.Params.Name

    # Delete the network security perimeter and all associated resources
    $removeNsp = @{ 
        Name = 'nsp-association'
        ResourceGroupName = $rgParams.Name
        SecurityPerimeterName = $nsp.Name
        }
    Remove-AzNetworkSecurityPerimeterAssociation @removeNsp
    
    Remove-AzNetworkSecurityPerimeter -Name $nsp.Name -ResourceGroupName $rgParams.Name
    
    # Remove the resource group
    Remove-AzResourceGroup -Name $rgParams.Name -Force
```

[!INCLUDE [network-security-perimeter-delete-resources](../../includes/network-security-perimeter-delete-resources.md)]
 
## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)
