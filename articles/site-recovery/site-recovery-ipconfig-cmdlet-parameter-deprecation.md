---
title: Deprecation of IPConfig parameters for the cmdlet New-AzRecoveryServicesAsrVMNicConfig | Microsoft Docs
description: Details about deprecation of IPConfig parameters of the cmdlet New-AzRecoveryServicesAsrVMNicConfig and information about the use of new cmdlet New-AzRecoveryServicesAsrVMNicIPConfig
author: Jeronika-MS
ms.service: azure-site-recovery
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 02/13/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
# Customer intent: "As a cloud administrator managing Azure disaster recovery, I want to update my scripts to use the new cmdlet for IP configuration, so that I can ensure compliance with the latest changes and avoid disruptions in my failover and test failover operations."
---
# Deprecation of IP Config parameters for the cmdlet New-AzRecoveryServicesAsrVMNicConfig

This article describes the deprecation, the corresponding implications, and the alternative options available for the customers for the following scenario.

Configuring primary IP config settings for failover or test failover. 

This cmdlet impacts all customers of Azure to Azure DR scenario using the cmdlet New-AzRecoveryServicesAsrVMNicConfig in Version _Az PowerShell 5.9.0 and above_.

> [!IMPORTANT]
> To avoid disruption to your environment, take the remediation steps as soon as possible. 

## What changes should you expect?

The New-AzRecoveryServicesAsrVMNicConfig cmdlet uses the following parameters to configure the IP config values for FO/TFO:
- RecoveryVMSubnetName
- RecoveryNicStaticIPAddress
- RecoveryPublicIPAddressId
- RecoveryLBBackendAddressPoolId
- TfoVMSubnetName
- TfoNicStaticIPAddress
- TfoPublicIPAddressId
- TfoLBBackendAddressPoolId

The cmdlet no longer accepts these parameters.

- Starting 4 May 2021, you receive Azure portal notifications and email communications about the deprecation of IP config parameters in the cmdlet New-AzRecoveryServicesAsrVMNicConfig.

- If you have an existing script that uses these parameters, it isn't supported.
 
## Alternatives 

As an alternative, use the new cmdlet [New-AzRecoveryServicesAsrVMNicIPConfig](/powershell/module/az.recoveryservices/new-azrecoveryservicesasrvmnicipconfig) for configuring IP Config FO/TFO settings. 


## Remediation steps

Modify your scripts to remove these parameters. Instead, start using the new cmdlet **New-AzRecoveryServicesAsrVMNicIPConfig** to create an IP Config object. Here's an illustration:

Your **existing scripts** use the following code:

```azurepowershell
# Fetching the Protected Item Object (for the Protected VM)
$protectedItemObject = Get-AsrReplicationProtectedItem -ProtectionContainer $primaryContainerObject | where { $_.FriendlyName -eq $VMName };$protectedItemObject

# ID of the NIC whose settings are to be updated.
$nicId = $protectedItemObject.NicDetailsList[0].NicId

$nic1 = New-AzRecoveryServicesAsrVMNicConfig -NicId $nicId -ReplicationProtectedItem $protectedItemObject -RecoveryVMNetworkId <networkArmId> -TfoVMNetworkId <networkArmId> -RecoveryVMSubnetName "default" -TfoVMSubnetName "default" -RecoveryNicStaticIPAddress "10.1.40.223" -TfoNicStaticIPAddress "10.33.0.223"

$nics = @($nic1)
Set-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $protectedItemObject -ASRVMNicConfiguration $nics
```

Modify your scripts **as shown:**:

```azurepowershell
# Fetching the Protected Item Object (for the Protected VM)
$protectedItemObject = Get-AsrReplicationProtectedItem -ProtectionContainer $primaryContainerObject | where { $_.FriendlyName -eq $VMName };$protectedItemObject

# Create the config object for Primary IP Config
$ipConfig = New-AzRecoveryServicesAsrVMNicIPConfig  -IpConfigName <ipConfigName> -RecoverySubnetName "default" -TfoSubnetName "default" -RecoveryStaticIPAddress "10.1.40.223" -TfoStaticIPAddress "10.33.0.223"

$ipConfigs = @($ipConfig)

# ID of the NIC whose settings are to be updated.
$nicId = $protectedItemObject.NicDetailsList[0].NicId

$nic1 = New-AzRecoveryServicesAsrVMNicConfig -NicId $nicId -ReplicationProtectedItem $protectedItemObject -RecoveryVMNetworkId <networkArmId> -TfoVMNetworkId <networkArmId> -IPConfig $ipConfigs

$nics = @($nic1)
Set-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $protectedItemObject -ASRVMNicConfiguration $nics
```

## Next steps

Modify your scripts as illustrated in this article. If you have any questions, contact Microsoft Support.
