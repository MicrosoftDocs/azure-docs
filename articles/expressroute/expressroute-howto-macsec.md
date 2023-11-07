---
title: 'Azure ExpressRoute: Configure MACsec'
description: This article helps you configure MACsec to secure the connections between your edge routers and Microsoft's edge routers.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 12/27/2022
ms.author: duau 
ms.custom: devx-track-azurepowershell

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

## Create Azure Key Vault, MACsec secrets, and user identity

1. Create a Key Vault instance to store MACsec secrets in a new resource group.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name "your_resource_group" -Location "resource_location"
    $keyVault = New-AzKeyVault -Name "your_key_vault_name" -ResourceGroupName "your_resource_group" -Location "resource_location" -SoftDeleteRetentionInDays 90
    ```

    If you already have a Key Vault or a resource group, you can reuse them. However, it's critical that you enable the [**soft-delete** feature](../key-vault/general/soft-delete-overview.md) on your existing Key Vault. If soft-delete isn't enabled, run the following commands to enable it:

    ```azurepowershell-interactive
    ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "your_existing_keyvault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
    Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
    ```
    
    > [!NOTE]
    > The Key Vault shouldn't be behind a private endpoint because communication to the ExpressRoute management plane is required.
    >
    
1. Create a user identity.

    ```azurepowershell-interactive
    $identity = New-AzUserAssignedIdentity  -Name "identity_name" -Location "resource_location" -ResourceGroupName "your_resource_group"
    ```

    If New-AzUserAssignedIdentity isn't recognized as a valid PowerShell cmdlet, install the following module (in Administrator mode) and rerun the above command.

    ```azurepowershell-interactive
    Install-Module -Name Az.ManagedServiceIdentity
    ```
1. Create a connectivity association key (CAK) and a connectivity association key name (CKN) and store them in the Key Vault.

    ```azurepowershell-interactive
    $CAK = ConvertTo-SecureString "your_key" -AsPlainText -Force
    $CKN = ConvertTo-SecureString "your_key_name" -AsPlainText -Force
    $MACsecCAKSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CAK_name" -SecretValue $CAK
    $MACsecCKNSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CKN_name" -SecretValue $CKN
    ```
   > [!NOTE]
   > CKN must be an even-length string up to 64 hexadecimal digits (0-9, A-F).
   >
   > CAK length depends on cipher suite specified:
   > * For GcmAes128 and GcmAesXpn128, the CAK must be an even-length string with 32 hexadecimal digits (0-9, A-F).
   > * For GcmAes256 and GcmAesXpn256, the CAK must be an even-length string with 64 hexadecimal digits (0-9, A-F).


 > [!NOTE]
   > ExpressRoute is a Trusted Service within Azure that supports Network Security policies within the Azure Key Vault. For more information refer to [Configure Azure Key Vault Firewall and Virtual Networks](../key-vault/general/network-security.md)
   >

1. Assign the GET permission to the user identity.

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName "your_key_vault_name" -PermissionsToSecrets get -ObjectId $identity.PrincipalId
    ```

   Now this identity can get the secrets, for example CAK and CKN, from the Key Vault.

1. Set this user identity to be used by ExpressRoute.

    ```azurepowershell-interactive
    $erIdentity = New-AzExpressRoutePortIdentity -UserAssignedIdentityId $identity.Id
    ```
 
## Configure MACsec on ExpressRoute Direct ports

### To enable MACsec

Each ExpressRoute Direct instance has two physical ports. You can choose to enable MACsec on both ports at the same time or enable MACsec one port at a time. Doing it one port at time by switching traffic to an active port while servicing the other port can help minimize the interruption if your ExpressRoute Direct is already in service.

   > [!NOTE]
   > You can configure both XPN and Non-XPN ciphers:
   > * GcmAes128
   > * GcmAes256
   > * GcmAesXpn128
   > * GcmAesXpn256
   > * The recommendation is to configure encryption with xpn ciphers to avoid intermittent session drops observed with non-xpn ciphers on high speed links.
   >

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
1. (Optional) If the ports are in Administrative Down state you can run the following commands to bring up the ports.

    ```azurepowershell-interactive
    $erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
    $erDirect.Links[0].AdminState = "Enabled"
    $erDirect.Links[1].AdminState = "Enabled"
    Set-AzExpressRoutePort -ExpressRoutePort $erDirect
    ```

    MACsec is now enabled on the ExpressRoute Direct ports on Microsoft side. If you haven't configured it on your edge devices, you can proceed to configure them with the same MACsec secrets and cipher.

1. (Optional) You can enable Secure Channel Identifier (SCI) on the ports.

    ```azurepowershell-interactive
    $erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
    $erDirect.Links[0].MacSecConfig.SciState = "Enabled"
    $erDirect.Links[1].MacSecConfig.SciState = "Enabled"
    Set-AzExpressRoutePort -ExpressRoutePort $erDirect
    ```
    
    SCI is now enabled on the ExpressRoute Direct ports.
    
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

MACsec is now disabled on the ExpressRoute Direct ports on the Microsoft side.

### Test connectivity

After you configure MACsec (including MACsec key update) on your ExpressRoute Direct ports, [check](expressroute-troubleshooting-expressroute-overview.md) if the BGP sessions of the circuits are up and running. If you don't have any circuit on the ports yet, create one first and set up Azure Private Peering or Microsoft Peering of the circuit. If MACsec gets misconfigured, including MACsec key mismatch, between your network devices and Microsoft's network devices, you won't see ARP resolution at layer 2 or BGP establishment at layer 3. If everything is configured properly, you should see the BGP routes advertised correctly in both directions and your application data flow accordingly over ExpressRoute.

## Next steps
- [Create an ExpressRoute circuit on ExpressRoute Direct](expressroute-howto-erdirect.md)
- [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
