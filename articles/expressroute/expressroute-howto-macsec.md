---
title: 'Azure ExpressRoute: Configure MACsec'
description: This article helps you configure MACsec to secure the connections between your edge routers and Microsoft's edge routers.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 12/28/2023
ms.author: duau 
ms.custom: devx-track-azurepowershell

---

# Configure MACsec on ExpressRoute Direct ports

This article provides guidance on how to configure MACsec, a security protocol that protects the communication between your edge routers and Microsoft’s edge routers, using PowerShell commands.

## Before you begin

Before you begin configuring MACsec, ensure that you meet the following prerequisites:

* You familiarized yourself with the [ExpressRoute Direct provisioning workflows](expressroute-erdirect-about.md).
* You created an [ExpressRoute Direct port resource](expressroute-howto-erdirect.md) as per the instructions.
* You installed the latest version of Azure PowerShell on your computer if you intend to run PowerShell locally.

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

### Sign in and select the right subscription

Follow these steps to begin the configuration:

* Sign in to your Azure account using your credentials.
* Choose the subscription that you want to use for this configuration.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

## Create Azure Key Vault, MACsec secrets, and user identity

1. To store MACsec secrets securely, you need to create a Key Vault instance in a new resource group. Key Vault is a service that allows you to manage and protect cryptographic keys, certificates, and secrets in Azure. For more information, see [What is Azure Key Vault?](../key-vault/general/overview.md).

    ```azurepowershell-interactive
    New-AzResourceGroup -Name "your_resource_group" -Location "resource_location"
    $keyVault = New-AzKeyVault -Name "your_key_vault_name" -ResourceGroupName "your_resource_group" -Location "resource_location" -SoftDeleteRetentionInDays 90
    ```

    You can reuse an existing Key Vault or resource group for this configuration. However, you must ensure that the [**soft-delete** feature] is enabled on your Key Vault. This feature allows you to recover deleted keys, secrets, and certificates within a retention period. If your Key Vault doesn't have soft-delete enabled, run the following commands to enable it:

    ```azurepowershell-interactive
    ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "your_existing_keyvault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
    Set-AzResource -ResourceId $resource.ResourceId -Properties $resource.Properties
    ```
    
    > [!NOTE]
    > * ExpressRoute is a trusted service within Azure that supports Network Security policies within Azure Key Vault. For more information, see [Configure Azure Key Vault Firewall and Virtual Networks](../key-vault/general/network-security.md).
    > * You shouldn't place the Azure Key Vault behind a private endpoint, as this will prevent the communication with the ExpressRoute management plane. The ExpressRoute management plane is responsible for managing the MACsec keys and parameters for your connection.
    
1. To create a new user identity, you need to use the `New-AzUserAssignedIdentity` cmdlet. This cmdlet creates a user-assigned managed identity in Microsoft Entra ID and registers it with the specified subscription and resource group. A user-assigned managed identity is a stand-alone Azure resource that can be assigned to any Azure service that supports managed identities. You can use this identity to authenticate and authorize access to Azure resources without storing any credentials in your code or configuration files. For more information, see [What is managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

    ```azurepowershell-interactive
    $identity = New-AzUserAssignedIdentity  -Name "identity_name" -Location "resource_location" -ResourceGroupName "your_resource_group"
    ```

    To use an existing user identity, run the following command:

    ```azurepowershell-interactive
    $identity = Get-AzUserAssignedIdentity -ResourceGroupName "your_resource_group" -Name "identity_name"
    ```

    Install the following module in Administrator mode if PowerShell doesn't recognize `New-AzUserAssignedIdentity` or `Get-AzUserAssignedIdentity` as valid cmdlets. Then, execute the above command again.

    ```azurepowershell-interactive
    Install-Module -Name Az.ManagedServiceIdentity
    ```

1. 

1. Create a connectivity association key (CAK) and a connectivity association key name (CKN) and store them in the Key Vault.

    ```azurepowershell-interactive
    $CAK = ConvertTo-SecureString "your_key" -AsPlainText -Force
    $CKN = ConvertTo-SecureString "your_key_name" -AsPlainText -Force
    $MACsecCAKSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CAK_name" -SecretValue $CAK
    $MACsecCKNSecret = Set-AzKeyVaultSecret -VaultName "your_key_vault_name" -Name "CKN_name" -SecretValue $CKN
    ```
    
    > [!NOTE]
    > * CKN must be an even-length string up to 64 hexadecimal digits (0-9, A-F).
    > * CAK length depends on cipher suite specified:
    >    * For GcmAes128 and GcmAesXpn128, the CAK must be an even-length string with 32 hexadecimal digits (0-9, A-F).
    >    * For GcmAes256 and GcmAesXpn256, the CAK must be an even-length string with 64 hexadecimal digits (0-9, A-F).
    > * For CAK, the full length of the key must be used. If the key is shorter than the required length then `0's` will be added to the end of the key to meet the length requirement. For example, CAK of 1234 will be 12340000... for both 128-bit and 256-bit based on the cipher.

1. Grant the user identity the authorization to perform the `GET` operation.

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName "your_key_vault_name" -PermissionsToSecrets get -ObjectId $identity.PrincipalId
    ```

   The user identity acquired the access to retrieve the secrets, such as CAK and CKN, from the Key Vault.

1. Configure the user identity as the designated service principal for ExpressRoute.

    ```azurepowershell-interactive
    $erIdentity = New-AzExpressRoutePortIdentity -UserAssignedIdentityId $identity.Id
    ```
 
## Configure MACsec on ExpressRoute Direct ports

### How to enable MACsec

Every ExpressRoute Direct instance consists of two physical ports. You can activate MACsec on both ports simultaneously or on one port individually. The latter option allows you to divert the traffic to a functioning port while maintaining the other port, which can reduce the disruption if your ExpressRoute Direct is operational.


> [!NOTE]
> You can configure both XPN and Non-XPN ciphers:
> * GcmAes128
> * GcmAes256
> * GcmAesXpn128
> * GcmAesXpn256
>
> The suggested best practice is to set up encryption with xpn ciphers to prevent sporadic session failures that occur with non-xpn ciphers on high speed links.

1. Establish the MACsec secrets and cipher and link the user identity with the port to enable the ExpressRoute management code to retrieve the MACsec secrets when required.

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

    MACsec is now enabled on the ExpressRoute Direct ports on Microsoft side. If you didn't configure it on your edge devices, you can proceed to configure them with the same MACsec secrets and cipher.

1. (Optional) To activate the ports that are in Administrative Down state, run the following commands:

    ```azurepowershell-interactive
    $erDirect = Get-AzExpressRoutePort -ResourceGroupName "your_resource_group" -Name "your_direct_port_name"
    $erDirect.Links[0].MacSecConfig.SciState = "Enabled"
    $erDirect.Links[1].MacSecConfig.SciState = "Enabled"
    Set-AzExpressRoutePort -ExpressRoutePort $erDirect
    ```
    
    SCI is now enabled on the ExpressRoute Direct ports.
    
### How to disable MACsec

To deactivate MACsec on your ExpressRoute Direct instance, run the following commands:

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

Once you set up MACsec (including MACsec key update) on your ExpressRoute Direct ports, [verify the status of the BGP sessions](expressroute-troubleshooting-expressroute-overview.md) of the circuits. If you haven't create a circuit on the ports yet, do so first and establish Azure Private Peering or Microsoft Peering of the circuit. Incorrect MACsec configuration, such as a MACsec key mismatch between your network devices and Microsoft’s network devices, prevents you from observing ARP resolution at layer 2 or BGP establishment at layer 3. If everything is configured correctly, you'll see the BGP routes advertised correctly in both directions and your application data flow accordingly over ExpressRoute.

## Next steps
- [Create an ExpressRoute circuit](expressroute-howto-erdirect.md) on ExpressRoute Direct
- [Link a virtual network](expressroute-howto-linkvnet-arm.md) to an ExpressRoute circuit
- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
