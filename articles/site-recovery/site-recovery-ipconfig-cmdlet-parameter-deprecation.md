---
title: Deprecation of IPConfig parameters for the cmdlet New-AzRecoveryServicesAsrVMNicConfig | Microsoft Docs
description: Details about deprecation of IPConfig parameters of the cmdlet New-AzRecoveryServicesAsrVMNicConfig and information about the use of new cmdlet New-AzRecoveryServicesAsrVMNicIPConfig
services: site-recovery
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.custom: devx-track-azurepowershell
ms.topic: article
ms.date: 04/30/2021
ms.author: ankitadutta 
---
# Deprecation of IP Config parameters for the cmdlet New-AzRecoveryServicesAsrVMNicConfig

This article describes the deprecation, the corresponding implications, and the alternative options available for the customers for the following scenario:

Configuring Primary IP Config settings for Failover or Test Failover. 

This cmdlet impacts all the customers of Azure to Azure DR scenario using the cmdlet New-AzRecoveryServicesAsrVMNicConfig in Version _Az PowerShell 5.9.0 and above_.

> [!IMPORTANT]
> Customers are advised to take the remediation steps at the earliest to avoid any disruption to their environment. 

## What changes should you expect?

The New-AzRecoveryServicesAsrVMNicConfig uses the following parameters to configure the IP Config values for FO/TFO:
- RecoveryVMSubnetName
- RecoveryNicStaticIPAddress
- RecoveryPublicIPAddressId
- RecoveryLBBackendAddressPoolId
- TfoVMSubnetName
- TfoNicStaticIPAddress
- TfoPublicIPAddressId
- TfoLBBackendAddressPoolId

These parameters will no longer be accepted by the cmdlet.

- Starting 4 May 2021, you will receive Azure portal notifications & email communications with the deprecation of IP Config params in the cmdlet New-AzRecoveryServicesAsrVMNicConfig.

- If you have an existing script using it, it will no longer be supported.
 
## Alternatives 

As an alternative, a new cmdlet [New-AzRecoveryServicesAsrVMNicIPConfig](/powershell/module/az.recoveryservices/new-azrecoveryservicesasrvmnicipconfig) is introduced for configuring IP Config FO/TFO settings. 


## Remediation steps

You are expected to modify your scripts to remove these params. Instead, start using the new cmdlet **New-AzRecoveryServicesAsrVMNicIPConfig** to create an IP Config object. Here is an illustration:

Your **existing scripts** would have been written like this:
```azurepowershell
# Fetching the Protected Item Object (for the Protected VM)
$protectedItemObject = Get-AsrReplicationProtectedItem -ProtectionContainer $primaryContainerObject | where { $_.FriendlyName -eq $VMName };$protectedItemObject

# ID of the NIC whose settings are to be updated.
$nicId = $protectedItemObject.NicDetailsList[0].NicId

$nic1 = New-AzRecoveryServicesAsrVMNicConfig -NicId $nicId -ReplicationProtectedItem $protectedItemObject -RecoveryVMNetworkId <networkArmId> -TfoVMNetworkId <networkArmId> -RecoveryVMSubnetName "default" -TfoVMSubnetName "default" -RecoveryNicStaticIPAddress "10.1.40.223" -TfoNicStaticIPAddress "10.33.0.223"

$nics = @($nic1)
Set-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $protectedItemObject -ASRVMNicConfiguration $nics
```

Modify your scripts **as below**:
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
Modify your scripts as illustrated above. In case you have any queries about this, contact Microsoft Support
