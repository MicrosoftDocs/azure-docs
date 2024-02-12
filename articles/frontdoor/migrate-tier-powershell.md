---
title: Migrate Azure Front Door (classic) to Standard/Premium tier with Azure PowerShell
description: This article provides step-by-step instructions on how to migrate from an Azure Front Door (classic) profile to an Azure Front Door Standard or Premium tier profile with Azure PowerShell.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: duau
---

# Migrate Azure Front Door (classic) to Standard/Premium tier with Azure PowerShell

Azure Front Door Standard and Premium tier bring the latest cloud delivery network features to Azure. With enhanced security features and an all-in-one service, your application content is secured and closer to your end users using the Microsoft global network. This article guides you through the migration process to move your Azure Front Door (classic) profile to either a Standard or Premium tier profile with Azure PowerShell.

## Prerequisites

* Review the [About Front Door tier migration](tier-migration.md) article.
* Ensure your Front Door (classic) profile can be migrated:
    * Azure Front Door Standard and Premium require all custom domains to use HTTPS. If you don't have your own certificate, you can use an Azure Front Door managed certificate. The certificate is free of charge and gets managed for you.
    * Session affinity gets enabled in the origin group settings for an Azure Front Door Standard or Premium profile. In Azure Front Door (classic), session affinity is set at the domain level. As part of the migration, session affinity is based on the Front Door (classic) profile settings. If you have two domains in your classic profile that shares the same backend pool (origin group), session affinity has to be consistent across both domains in order for migration validation to pass.
* Latest Azure PowerShell module installed locally or Azure Cloud Shell. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azure-powershell). 


> [!NOTE]
> You don't need to make any DNS changes before or during the migration process. However, once the migration completes and traffic is flowing through your new Azure Front Door profile, you need to update your DNS records. For more information, see [Update DNS records](#update-dns-records).

## Validate compatibility

1. Open Azure PowerShell and connect to your Azure account. For more information, see [Connect to Azure PowerShell](/powershell/azure/authenticate-azureps).

1. Test your Azure Front Door (classic) profile to see if it's compatible for migration. You can use the [Test-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/test-azfrontdoorcdnprofilemigration) command to test your profile. Replace the values for the resource group name and resource ID with your own values. Use [Get-AzFrontDoor](/powershell/module/az.frontdoor/get-azfrontdoor) to get the resource ID for your Front Door (classic) profile.

    Replace the following values in the command:

    * `<subscriptionId>`: Your subscription ID.
    * `<resourceGroupName>`: The resource group name of the Front Door (classic).
    * `<frontdoorClassicName>`: The name of the Front Door (classic) profile.

    ```powershell-interactive
    Test-AzFrontDoorCdnProfileMigration -ResourceGroupName <resourceGroupName> -ClassicResourceReferenceId /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Network/frontdoors/<frontdoorClassicName>
    ```

    If the migration is compatible for migration, you see the following output:

    ```
    CanMigrate DefaultSku
    ---------- ----------
    True       Standard_AzureFrontDoor or Premium_AzureFrontDoor
    ```

    If the migration isn't compatible, you see the following output:

    ```
    CanMigrate DefaultSku
    ---------- ----------
    False      
    ```

## Prepare for migration

#### [Without WAF and BYOC (Bring your own certificate)](#tab/without-waf-byoc)

Run the [Start-AzFrontDoorCdnProfilePrepareMigration](/powershell/module/az.cdn/start-azfrontdoorcdnprofilepreparemigration) command to prepare for migration. Replace the values for the resource group name, resource ID, profile name with your own values. For *SkuName* use either **Standard_AzureFrontDoor** or **Premium_AzureFrontDoor**. The *SkuName* is based on the output from the [Test-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/test-azfrontdoorcdnprofilemigration) command.

Replace the following values in the command:

* `<subscriptionId>`: Your subscription ID.
* `<resourceGroupName>`: The resource group name of the Front Door (classic).
* `<frontdoorClassicName>`: The name of the Front Door (classic) profile.

```powershell-interactive
Start-AzFrontDoorCdnProfilePrepareMigration -ResourceGroupName <resourceGroupName> -ClassicResourceReferenceId /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Network/frontdoors/<frontdoorClassicName> -ProfileName myAzureFrontDoor -SkuName Premium_AzureFrontDoor
```

The output looks similar to the following:

```
Starting the parameter validation process.
The parameters have been successfully validated.
Your new Front Door profile is being created. Please wait until the process has finished completely. This may take several minutes.

Your new Front Door profile with the configuration has been successfully created.
```

#### [With WAF](#tab/with-waf)

1. Run the [Get-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/get-azfrontdoorwafpolicy) command to get the resource ID for your WAF policy. Replace the values for the resource group name and WAF policy name with your own values.

    ```powershell-interactive
    Get-AzFrontDoorWafPolicy -ResourceGroupName myAFDResourceGroup -Name myClassicFrontDoorWAF
    ```
    The output looks similar to the following:

    ```
    PolicyMode                    : Detection
    PolicyEnabledState            : Enabled
    RedirectUrl                   : 
    CustomBlockResponseStatusCode : 403
    CustomBlockResponseBody       : 
    RequestBodyCheck              : Disabled
    CustomRules                   : {}
    ManagedRules                  : {Microsoft.Azure.Commands.FrontDoor.Models.PSAzureManagedRule}
    Etag                          : 
    ProvisioningState             : Succeeded
    Sku                           : Classic_AzureFrontDoor
    Tags                          : 
    Id                            : /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myClassicFrontDoorWAF
    Name                          : myFrontDoorWAF
    Type                          :
    ```

1. Run the [New-AzFrontDoorCdnMigrationWebApplicationFirewallMappingObject](/powershell/module/az.cdn/new-azfrontdoorcdnmigrationwebapplicationfirewallmappingobject) command to create an in-memory object for WAF policy migration. Use the WAF ID in the last step for `MigratedFromId`. To use an existing WAF policy, replace the value for `MigratedToId` with a resource ID of a WAF policy that matches the Front Door tier you're migrating to. If you're creating a new WAF policy copy, you can change the name of the WAF policy in the resource ID.


    ```powershell-interactive
    $wafMapping = New-AzFrontDoorCdnMigrationWebApplicationFirewallMappingObject -MigratedFromId /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myClassicFrontDoorWAF -MigratedToId  /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myFrontDoorWAF

1. Run the [Start-AzFrontDoorCdnProfilePrepareMigration](/powershell/module/az.cdn/start-azfrontdoorcdnprofilepreparemigration) command to prepare for migration. Replace the values for the resource group name, resource ID, profile name with your own values. For *SkuName* use either **Standard_AzureFrontDoor** or **Premium_AzureFrontDoor**. The *SkuName* is based on the output from the [Test-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/test-azfrontdoorcdnprofilemigration) command.

    Replace the following values in the command:

    * `<subscriptionId>`: Your subscription ID.
    * `<resourceGroupName>`: The resource group name of the Front Door (classic).
    * `<frontdoorClassicName>`: The name of the Front Door (classic) profile.

    ```powershell-interactive
    Start-AzFrontDoorCdnProfilePrepareMigration -ResourceGroupName <resourceGroupName> -ClassicResourceReferenceId /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Network/frontdoors/<frontdoorClassicName> -ProfileName myAzureFrontDoor -SkuName Premium_AzureFrontDoor -MigrationWebApplicationFirewallMapping $wafMapping
    ```

    The output looks similar to the following:

    ```
    Starting the parameter validation process.
    The parameters have been successfully validated.
    Your new Front Door profile is being created. Please wait until the process has finished completely. This may take several minutes.

    Your new Front Door profile with the configuration has been successfully created.
    ```

#### [With BYOC](#tab/with-byoc)

If you're migrating a Front Door profile with BYOC, you need to enable managed identity on the Front Door profile. You need to grant the Front Door profile access to the key vault where the certificate is stored.

Run the [Start-AzFrontDoorCdnProfilePrepareMigration](/powershell/module/az.cdn/start-azfrontdoorcdnprofilepreparemigration) command to prepare for migration. Replace the values for the resource group name, resource ID, profile name with your own values. For *SkuName* use either **Standard_AzureFrontDoor** or **Premium_AzureFrontDoor**. The *SkuName* is based on the output from the [Test-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/test-azfrontdoorcdnprofilemigration) command. 

### System assigned

For *IdentityType* use **SystemAssigned**.

```powershell-interactive
Start-AzFrontDoorCdnProfilePrepareMigration -ResourceGroupName myAFDResourceGroup -ClassicResourceReferenceId /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/Frontdoors/myAzureFrontDoorClassic -ProfileName myAzureFrontDoor -SkuName Premium_AzureFrontDoor -IdentityType SystemAssigned
```

### User assigned

1. Run the [Get-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/get-azuserassignedidentity) command to the get the resource ID for a user assigned identity.

    ```powershell-interactive
    $id = Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name afduseridentity
    $id.Id
    ```

    The output looks similar to the following:

    ```
    /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity
    ```

1. For IdentityType use UserAssigned and for IdentityUserAssignedIdentity,* use the resource ID from the previous step.

    Replace the following values in the command:

    * `<subscriptionId>`: Your subscription ID.
    * `<resourceGroupName>`: The resource group name of the Front Door (classic).
    * `<frontdoorClassicName>`: The name of the Front Door (classic) profile.

    ```powershell-interactive
    Start-AzFrontDoorCdnProfilePrepareMigration -ResourceGroupName <resourceGroupName> -ClassicResourceReferenceId /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Network/frontdoors/<frontdoorClassicName> -ProfileName myAzureFrontDoor -SkuName Premium_AzureFrontDoor -IdentityType UserAssigned -IdentityUserAssignedIdentity @{"/subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity" = @{}}
    ```

    The output looks similar to the following:

    ```
    Starting the parameter validation process.
    The parameters have been successfully validated.
    Your new Front Door profile is being created. Please wait until the process has finished completely. This may take several minutes.

    Your new Front Door profile with the configuration has been successfully created.
    ```

#### [Multiple WAF and managed identity](#tab/multiple-waf-managed-identity)

This example shows how to migrate a Front Door profile with multiple WAF policies and enable both system assigned and user assigned identity.

1. Run the [Get-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/get-azfrontdoorwafpolicy) command to get the resource ID for your WAF policy. Replace the values for the resource group name and WAF policy name with your own values.

    ```powershell-interactive
    Get-AzFrontDoorWafPolicy -ResourceGroupName myAFDResourceGroup -Name myClassicFrontDoorWAF
    ```
    The output looks similar to the following:

    ```
    PolicyMode                    : Detection
    PolicyEnabledState            : Enabled
    RedirectUrl                   : 
    CustomBlockResponseStatusCode : 403
    CustomBlockResponseBody       : 
    RequestBodyCheck              : Disabled
    CustomRules                   : {}
    ManagedRules                  : {Microsoft.Azure.Commands.FrontDoor.Models.PSAzureManagedRule}
    Etag                          : 
    ProvisioningState             : Succeeded
    Sku                           : Classic_AzureFrontDoor
    Tags                          : 
    Id                            : /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myClassicFrontDoorWAF
    Name                          : myFrontDoorWAF
    Type                          :
    ```

1. Run the [New-AzFrontDoorCdnMigrationWebApplicationFirewallMappingObject](/powershell/module/az.cdn/new-azfrontdoorcdnmigrationwebapplicationfirewallmappingobject) command to create an in-memory object for WAF policy migration. Use the WAF ID in the last step for `MigratedFromId`. To use an existing WAF policy, replace the value for `MigratedToId` with a resource ID of a WAF policy that matches the Front Door tier you're migrating to. If you're creating a new WAF policy copy, you can change the name of the WAF policy in the resource ID.

    ```powershell-interactive
    $wafMapping1 = New-AzFrontDoorCdnMigrationWebApplicationFirewallMappingObject -MigratedFromId /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myClassicFrontDoorWAF1 -MigratedToId  /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myFrontDoorWAF1

    $wafMapping2 = New-AzFrontDoorCdnMigrationWebApplicationFirewallMappingObject -MigratedFromId /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myClassicFrontDoorWAF2 -MigratedToId  /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/myFrontDoorWAF2
    ```

1. Specify both managed identity types in a variable.

    ```powershell-interactive
    $identityType = "SystemAssigned, UserAssigned"
    ```

1. Run the [Get-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/get-azuserassignedidentity) command to the get the resource ID for a user assigned identity.

    ```powershell-interactive
    $id1 = Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name afduseridentity1
    $id1.Id
    $id2 = Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name afduseridentity2
    $id2.Id
    ```

    The output looks similar to the following:

    ```
    /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity1
    /subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourcegroups/myAFDResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity2
    ```

1.  Specify the user assigned identity resource ID in a variable.

    ```powershell-interactive
    $userInfo = @{
        "subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity1" = @{}}
        "subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/afduseridentity2" = @{}}
    }
    ```

1. Run the [Start-AzFrontDoorCdnProfilePrepareMigration](/powershell/module/az.cdn/start-azfrontdoorcdnprofilepreparemigration) command to prepare for migration. Replace the values for the resource group name, resource ID, profile name with your own values. For *SkuName* use either **Standard_AzureFrontDoor** or **Premium_AzureFrontDoor**. The *SkuName* is based on the output from the [Test-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/test-azfrontdoorcdnprofilemigration) command. The *MigrationWebApplicationFirewallMapping* parameter takes an array of WAF policy migration objects. The *IdentityType* parameter takes a comma separated list of identity types. The *IdentityUserAssignedIdentity* parameter takes a hash table of user assigned identity resource IDs.

    Replace the following values in the command:

    * `<subscriptionId>`: Your subscription ID.
    * `<resourceGroupName>`: The resource group name of the Front Door (classic).
    * `<frontdoorClassicName>`: The name of the Front Door (classic) profile.

    ```powershell-interactive
    Start-AzFrontDoorCdnProfilePrepareMigration -ResourceGroupName <resourceGroupName> -ClassicResourceReferenceId /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Network/frontdoors/<frontdoorClassicName> -ProfileName myAzureFrontDoor -SkuName Premium_AzureFrontDoor -MigrationWebApplicationFirewallMapping @($wafMapping1, $wafMapping2) -IdentityType $identityType -IdentityUserAssignedIdentity $userInfo
    ```

    The output looks similar to the following:

    ```
    Starting the parameter validation process.
    The parameters have been successfully validated.
    Your new Front Door profile is being created. Please wait until the process has finished completely. This may take several minutes.

    Your new Front Door profile with the configuration has been successfully created.
    ```
---

## Migrate

#### [Migrate profile](#tab/migrate-profile)

Run the [Enable-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/enable-azfrontdoorcdnprofilemigration) command to migrate your Front Door (classic).

```powershell-interactive
Enable-AzFrontDoorCdnProfileMigration -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup
```

The output looks similar to the following:

```
Start to migrate.
This process will disable your Front Door (classic) profile and move all your traffic and configurations to the new Front Door profile.
Migrate succeeded.
```

#### [Abort migration](#tab/abort-migration)

Run the [Stop-AzFrontDoorCdnProfileMigration](/powershell/module/az.cdn/stop-azfrontdoorcdnprofilemigration) command to abort the migration process.

```powershell-interactive
Stop-AzFrontDoorCdnProfileMigration -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup
```

The output looks similar to the following:

```
Start to abort the migration.
Your new Front Door Profile will be deleted and your existing profile will remain active. WAF policies will not be deleted.
Please wait until the process has finished completely. This may take several minutes.
Abort succeeded.
```
---

## Update DNS records

Your old Azure Front Door (classic) instance uses a different fully qualified domain name (FQDN) than Azure Front Door Standard and Premium. For example, an Azure Front Door (classic) endpoint might be `contoso.azurefd.net`, while the Azure Front Door Standard or Premium endpoint might be `contoso-mdjf2jfgjf82mnzx.z01.azurefd.net`. For more information about Azure Front Door Standard and Premium endpoints, see [Endpoints in Azure Front Door](endpoint.md).

You don't need to update your DNS records before or during the migration process. Azure Front Door automatically sends traffic that it receives on the Azure Front Door (classic) endpoint to your Azure Front Door Standard or Premium profile without you making any configuration changes.

However, once your migration is finished, we strongly recommend that you update your DNS records to direct traffic to the new Azure Front Door Standard or Premium endpoint. Changing your DNS records helps to ensure that your profile continues to work in the future. The change in DNS record doesn't cause any downtime. You don't need to plan ahead for this update to happen, and can schedule it at your convenience.

## Next steps

* Understand the [mapping between Front Door tiers](tier-mapping.md) settings.
* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
