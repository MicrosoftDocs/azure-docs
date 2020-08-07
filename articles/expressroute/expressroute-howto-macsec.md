---
title: 'Azure ExpressRoute: Configure MACsec'
description: This article helps you configure MACsec to secure the connections between your edge routers and Microsoft's edge routers.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: how-to
ms.date: 10/22/2019
ms.author: cherylmc

---

# Configure MACsec on ExpressRoute Direct ports

This article helps you configure MACsec to secure the connections between your edge routers and Microsoft's edge routers using PowerShell.

## Before you begin

Before you start configuration, confirm the following:

* You understand [ExpressRoute Direct provisioning workflows](expressroute-erdirect-about.md).
* You've created an [ExpressRoute Direct port resource](expressroute-howto-erdirect.md).
* If you want to run PowerShell locally, verify that the latest version of Azure PowerShell is installed on your computer.

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

### Sign in and select the right subscription

To start the configuration, sign in to your Azure account and select the subscription that you want to use.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

## 1. Create Azure Key Vault, MACsec secrets, and user identity

1. Create a Key Vault instance to store MACsec secrets in a new resource group.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name "your_resource_group" -Location "resource_location"
    $keyVault = New-AzKeyVault -Name "your_key_vault_name" -ResourceGroupName "your_resource_group" -Location "resource_location" -EnableSoftDelete 
    ```

    If you already have a key vault or a resource group, you can reuse them. However, it is critical that you enable the [**soft-delete** feature](../key-vault/general/overview-soft-delete.md) on your existing key vault. If soft-delete is not enabled, you can use the following commands to enable it:

    ```azurepowershell-interactive
    ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "your_existing_keyvault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
    Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
    ```
2. Create a user identity.

    ```azurepowershell-interactive
    $identity = New-AzUserAssignedIdentity  -Name "identity_name" -Location "resource_location" -ResourceGroupName "your_resource_group"
    ```

    If New-AzUserAssignedIdentity is not recognized as a valid PowerShell cmdlet, install the following module (in Administrator mode) and rerun the above command.

    ```azurepowershell-interactive
    Install-Module -Name Az.ManagedServiceIdentity
    ```
3. Create a connectivity association key (CAK) and a connectivity association key name (CKN) and store them in the key vault.

    ```azurepowershell-interactive
    $CAK = ConvertTo-SecureString "your_key" -AsPlainText -Force
    $CKN = ConvertTo-SecureString "your_key_name" -AsPlainText -Force
    $MACsecCAKSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CAK_name" -SecretValue $CAK
    $MACsecCKNSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CKN_name" -SecretValue $CKN
    ```
4. Assign the GET permission to the user identity.

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName "your_key_vault_name" -PermissionsToSecrets get -ObjectId $identity.PrincipalId
    ```

   Now this identity can get the secrets, for example CAK and CKN, from the key vault.
5. Set this user identity to be used by ExpressRoute.

    ```azurepowershell-interactive
    $erIdentity = New-AzExpressRoutePortIdentity -UserAssignedIdentityId $identity.Id
    ```
 
## 2. Configure MACsec on ExpressRoute Direct ports

### To enable MACsec

Each ExpressRoute Direct instance has two physical ports. You can choose to enable MACsec on both ports at the same time or enable MACsec on one port at a time. Doing it one port at time (by switching traffic to an active port while servicing the other port) can help minimize the interruption if your ExpressRoute Direct is already in service.

1. Set MACsec secrets and cipher and associate the user identity with the port so that the ExpressRoute management code can access the MACsec secrets if needed.

    ```azurepowershell-interactive
    $erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
    $erDirect.Links[0]. MacSecConfig.CknSecretIdentifier = $MacSecCKNSecret.Id
    $erDirect.Links[0]. MacSecConfig.CakSecretIdentifier = $MacSecCAKSecret.Id
    $erDirect.Links[0]. MacSecConfig.Cipher = "GcmAes256"
    $erDirect.Links[1]. MacSecConfig.CknSecretIdentifier = $MacSecCKNSecret.Id
    $erDirect.Links[1]. MacSecConfig.CakSecretIdentifier = $MacSecCAKSecret.Id
    $erDirect.Links[1]. MacSecConfig.Cipher = "GcmAes256"
    $erDirect.identity = $erIdentity
    Set-AzExpressRoutePort -ExpressRoutePort $erDirect
    ```
2. (Optional) If the ports are in Administrative Down state you can run the following commands to bring up the ports.

    ```azurepowershell-interactive
    $erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
    $erDirect.Links[0].AdminState = "Enabled"
    $erDirect.Links[1].AdminState = "Enabled"
    Set-AzExpressRoutePort -ExpressRoutePort $erDirect
    ```

    At this point, MACsec is enabled on the ExpressRoute Direct ports on Microsoft side. If you haven't configured it on your edge devices, you can proceed to configure them with the same MACsec secrets and cipher.

### To disable MACsec

If MACsec is no longer desired on your ExpressRoute Direct instance, you can run the following commands to disable it.

```azurepowershell-interactive
$erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
$erDirect.Links[0]. MacSecConfig.CknSecretIdentifier = $null
$erDirect.Links[0]. MacSecConfig.CakSecretIdentifier = $null
$erDirect.Links[1]. MacSecConfig.CknSecretIdentifier = $null
$erDirect.Links[1]. MacSecConfig.CakSecretIdentifier = $null
$erDirect.identity = $null
Set-AzExpressRoutePort -ExpressRoutePort $erDirect
```

At this point, MACsec is disabled on the ExpressRoute Direct ports on the Microsoft side.

### Test connectivity
After you configure MACsec (including MACsec key update) on your ExpressRoute Direct ports, [check](expressroute-troubleshooting-expressroute-overview.md) if the BGP sessions of the circuits are up and running. If you don't have any circuit on the ports yet, please create one first and set up Azure Private Peering or Microsoft Peering of the circuit. If MACsec is misconfigured, including MACsec key mismatch, between your network devices and Microsoft's network devices, you won't see ARP resolution at layer 2 and BGP establishment at layer 3. If everything is configured properly, you should see the BGP routes advertised correctly in both directions and your application data flow accordingly over ExpressRoute.

## Next steps
1. [Create an ExpressRoute circuit on ExpressRoute Direct](expressroute-howto-erdirect.md)
2. [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
3. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
