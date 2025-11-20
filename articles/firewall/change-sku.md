---
title: 'Change Azure Firewall SKU'
description: Learn how to upgrade Azure Firewall from Standard to Premium or downgrade from Premium to Standard using the easy SKU change method or manual migration.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 09/29/2025
ms.author: duau
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
# Customer intent: As a network administrator, I want to change my Azure Firewall SKU between Standard and Premium, so that I can adjust my network security features and costs according to my current requirements.
---

# Change Azure Firewall SKU

This article shows you how to change your Azure Firewall SKU between Standard and Premium. You can upgrade from Standard to Premium to take advantage of enhanced security capabilities, or downgrade from Premium to Standard when those features are no longer needed. Azure Firewall Premium provides advanced threat protection features including IDPS, TLS inspection, and URL filtering.

You can change your firewall SKU using one of two methods:
- **Easy SKU change method** (recommended): Zero-downtime upgrade or downgrade using the Azure portal, PowerShell, or Terraform
- **Manual migration method**: Step-by-step migration for complex scenarios or when easy SKU change isn't available

For more information about Azure Firewall Premium features, see [Azure Firewall Premium features](premium-features.md).

## Prerequisites

Before you begin, make sure you have:

- An Azure subscription with an existing Azure Firewall deployment
- Appropriate permissions to modify firewall resources (Network Contributor role or higher)
- Azure PowerShell module version 6.5.0 or later (for PowerShell methods)
- A planned maintenance window (for manual migration method)

> [!IMPORTANT]
> This article applies to Azure Firewall Standard and Premium SKUs only. [Azure Firewall Basic SKU](overview.md#azure-firewall-basic) doesn't support SKU changes and must be migrated to Standard SKU first before any upgrade to Premium. Always perform SKU change operations during scheduled maintenance times and test the process thoroughly in a nonproduction environment first.

## Easy SKU change method (recommended)

The easiest way to change your Azure Firewall SKU with zero downtime is to use the **Change SKU** feature. This method supports both upgrading from Standard to Premium and downgrading from Premium to Standard.

### When to use easy SKU change

Use the easy SKU change method when:
- You have an Azure Firewall with firewall policy (not Classic rules)
- Your firewall is deployed in a supported region  
- You want to minimize downtime (zero downtime with this method)
- You have a standard deployment without complex custom configurations
- **For downgrade**: Your Premium policy doesn't use Premium-exclusive features that are incompatible with Standard

### Policy considerations for SKU changes

#### Upgrade to Premium

During the upgrade process, choose how to handle your firewall policy:

- **Existing Premium policy**: Select a preexisting Premium policy to attach to the upgraded firewall
- **Existing Standard policy**: Use your current Standard policy. The system automatically duplicates and upgrades it to a Premium policy
- **Create new Premium policy**: Let the system create a new Premium policy based on your current configuration

#### Downgrade to Standard

When downgrading from Premium to Standard, consider the following policy requirements:

> [!IMPORTANT]
> Premium-exclusive features must be removed or disabled before downgrading to Standard SKU.

**Premium features to address before downgrade:**
- **TLS inspection**: Disable TLS inspection rules and remove associated certificates
- **IDPS (Intrusion Detection and Prevention)**: Change IDPS mode from Alert and Deny to Alert Only or Off
- **URL filtering**: Replace URL filtering rules with FQDN filtering where possible
- **Web categories**: Remove or replace web category rules with specific FQDN rules

**Policy handling options:**
- **Use existing Standard policy**: Select a preexisting Standard policy that doesn't contain Premium features
- **Create new Standard policy**: The system can create a new Standard policy, automatically removing Premium-specific features
- **Modify current policy**: Manually remove Premium features from your current policy before downgrade

### Change SKU using the Azure portal

To change your firewall SKU using the Azure portal:

#### Upgrade to Premium

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Firewall resource.
1. On the **Overview** page, select **Change SKU**.
1. In the SKU change dialog box, select **Premium** as the target SKU.
1. Choose your policy option:
   - Select an existing Premium policy, or
   - Allow the system to upgrade your current Standard policy to Premium
1. Select **Save** to begin the upgrade.

#### Downgrade to Standard

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Firewall Premium resource.
1. **Before downgrading**: Ensure your firewall policy doesn't contain Premium-exclusive features (TLS inspection, IDPS Alert and Deny mode, URL filtering, web categories).
1. On the **Overview** page, select **Change SKU**.
1. In the SKU change dialog box, select **Standard** as the target SKU.
1. Choose your policy option:
   - Select an existing Standard policy, or
   - Allow the system to create a new Standard policy (Premium features are removed automatically)
1. Select **Save** to begin the downgrade.

The SKU change process typically completes within a few minutes with zero downtime.

:::image type="content" source="media/change-sku/upgrade.png" alt-text="Screenshot showing SKU upgrade." lightbox="media/change-sku/upgrade.png":::

### PowerShell and Terraform SKU change

You can also perform SKU changes using:
- **PowerShell**: Change the `sku_tier` property to "Premium" or "Standard"
- **Terraform**: Update the `sku_tier` attribute in your configuration to the desired SKU

### Limitations

The easy SKU change method has the following limitations:

**General limitations:**
- Doesn't support [Azure Firewall Basic SKU](overview.md#azure-firewall-basic) - Basic SKU users must migrate to Standard first
- Not available for firewalls with certain complex configurations
- Limited availability in some regions
- Requires existing firewall policy (not available for Classic rules)

**Downgrade-specific limitations:**
- Premium features (TLS inspection, IDPS Alert and Deny mode, URL filtering, web categories) must be removed before downgrade
- If your Premium policy contains incompatible features, you must modify the policy or create a new Standard policy
- Some rule configurations might need manual adjustment after downgrade

If the easy SKU change method isn't available for your scenario, use the manual migration method described in the next section.

## Manual migration method

If the easy upgrade method isn't available or suitable for your deployment, you can use the manual migration method. This approach provides more control but requires downtime.

### When to use manual migration

Use manual migration when:
- Easy upgrade isn't available for your scenario
- You have Classic firewall rules that need migration
- You have complex custom configurations
- You need full control over the migration process
- Your firewall is deployed in Southeast Asia with Availability Zones

### Performance considerations

Performance is a consideration when migrating from the Standard SKU. IDPS and TLS inspection are compute intensive operations. The Premium SKU uses a more powerful VM SKU, which scales to a higher throughput comparable with the Standard SKU. For more information about Azure Firewall Performance, see [Azure Firewall Performance](firewall-performance.md).

Microsoft recommends customers perform full-scale testing in their Azure deployment to ensure the firewall service performance meets your expectations.

### Downtime considerations
Plan for a maintenance window when using the manual migration method, as there's some downtime (typically 20-30 minutes) during the stop/start process.

### Migration steps overview

The following general steps are required for a successful manual migration:

1. **Create new Premium policy** based on your existing Standard policy or classic rules
2. **Migrate Azure Firewall** from Standard to Premium using stop/start
3. **Attach the Premium policy** to your Premium Firewall

### Step 1: Migrate Classic rules to Standard policy

If you have Classic firewall rules, first migrate them to a Standard policy using the Azure portal:

1. From the Azure portal, select your standard firewall.
1. On the **Overview** page, select **Migrate to firewall policy**.
1. On the **Migrate to firewall policy** page, select **Review + create**.
1. Select **Create**.

The deployment takes a few minutes to complete.

You can also migrate existing Classic rules using Azure PowerShell. For more information, see [Migrate Azure Firewall configurations to Azure Firewall policy using PowerShell](../firewall-manager/migrate-to-policy.md).

### Step 2: Create Premium policy using PowerShell

Use the following PowerShell script to create a new Premium policy from an existing Standard policy:

> [!IMPORTANT]
> The script doesn't migrate Threat Intelligence and SNAT private ranges settings. You need to note those settings before proceeding and migrate them manually.

```azurepowershell-interactive
<#
    .SYNOPSIS
        Given an Azure firewall policy id the script will transform it to a Premium Azure firewall policy.
        The script will first pull the policy, transform/add various parameters and then upload a new premium policy.
        The created policy will be named <previous_policy_name>_premium if no new name provided else new policy will be named as the parameter passed.
    .Example
        Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name -NewPolicyName <optional param for the new policy name>
#>

param (
    #Resource id of the azure firewall policy.
    [Parameter(Mandatory=$true)]
    [string]
    $PolicyId,

    #new filewallpolicy name, if not specified will be the previous name with the '_premium' suffix
    [Parameter(Mandatory=$false)]
    [string]
    $NewPolicyName = ""
)
$ErrorActionPreference = "Stop"
$script:PolicyId = $PolicyId
$script:PolicyName = $NewPolicyName

function ValidatePolicy {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Policy
    )

    Write-Host "Validating resource is as expected"

    if ($null -eq $Policy) {
        Write-Error "Received null policy"
        exit(1)
    }
    if ($Policy.GetType().Name -ne "PSAzureFirewallPolicy") {
        Write-Error "Resource must be of type Microsoft.Network/firewallPolicies"
        exit(1)
    }

    if ($Policy.Sku.Tier -eq "Premium") {
        Write-Host "Policy is already premium" -ForegroundColor Green
        exit(1)
    }
}

function GetPolicyNewName {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Microsoft.Azure.Commands.Network.Models.PSAzureFirewallPolicy]
        $Policy
    )

    if (-not [string]::IsNullOrEmpty($script:PolicyName)) {
        return $script:PolicyName
    }

    return $Policy.Name + "_premium"
}

function TransformPolicyToPremium {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Microsoft.Azure.Commands.Network.Models.PSAzureFirewallPolicy]
        $Policy
    )
    $NewPolicyParameters = @{
                        Name = (GetPolicyNewName -Policy $Policy)
                        ResourceGroupName = $Policy.ResourceGroupName
                        Location = $Policy.Location
                        BasePolicy = $Policy.BasePolicy.Id
                        ThreatIntelMode = $Policy.ThreatIntelMode
                        ThreatIntelWhitelist = $Policy.ThreatIntelWhitelist
                        PrivateRange = $Policy.PrivateRange
                        DnsSetting = $Policy.DnsSettings
                        SqlSetting = $Policy.SqlSetting
                        ExplicitProxy  = $Policy.ExplicitProxy
                        DefaultProfile  = $Policy.DefaultProfile
                        Tag = $Policy.Tag
                        SkuTier = "Premium"
    }

    Write-Host "Creating new policy"
    $premiumPolicy = New-AzFirewallPolicy @NewPolicyParameters

    Write-Host "Populating rules in new policy"
    foreach ($ruleCollectionGroup in $Policy.RuleCollectionGroups) {
        $ruleResource = Get-AzResource -ResourceId $ruleCollectionGroup.Id
        $ruleToTransform = Get-AzFirewallPolicyRuleCollectionGroup -AzureFirewallPolicy $Policy -Name $ruleResource.Name
        $ruleCollectionGroup = @{
            FirewallPolicyObject = $premiumPolicy
            Priority = $ruleToTransform.Properties.Priority
            Name = $ruleToTransform.Name
        }

        if ($ruleToTransform.Properties.RuleCollection.Count) {
            $ruleCollectionGroup["RuleCollection"] = $ruleToTransform.Properties.RuleCollection
        }

        Set-AzFirewallPolicyRuleCollectionGroup @ruleCollectionGroup
    }
}

function ValidateAzNetworkModuleExists {
    Write-Host "Validating needed module exists"
    $networkModule = Get-InstalledModule -Name "Az.Network" -MinimumVersion 4.5 -ErrorAction SilentlyContinue
    if ($null -eq $networkModule) {
        Write-Host "Please install Az.Network module version 4.5.0 or higher, see instructions: https://github.com/Azure/azure-powershell#installation"
        exit(1)
    }
    $resourceModule = Get-InstalledModule -Name "Az.Resources" -MinimumVersion 4.2 -ErrorAction SilentlyContinue
    if ($null -eq $resourceModule) {
        Write-Host "Please install Az.Resources module version 4.2.0 or higher, see instructions: https://github.com/Azure/azure-powershell#installation"
        exit(1)
    }
    Import-Module Az.Network -MinimumVersion 4.5.0
    Import-Module Az.Resources -MinimumVersion 4.2.0
}

ValidateAzNetworkModuleExists
$policy = Get-AzFirewallPolicy -ResourceId $script:PolicyId
ValidatePolicy -Policy $policy
TransformPolicyToPremium -Policy $policy
```

**Usage example:**

```azurepowershell-interactive
Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name
```

### Step 3: Migrate Azure Firewall using stop/start

If you use Azure Firewall Standard SKU with firewall policy, you can use the Allocate/Deallocate method to migrate your Firewall SKU to Premium. This migration approach is supported on both virtual network Hub and Secure Hub Firewalls.

> [!NOTE]
> The minimum Azure PowerShell version requirement is 6.5.0. For more information, see [Az 6.5.0](https://www.powershellgallery.com/packages/Az/6.5.0).

#### Migrate a virtual network Hub Firewall

**Deallocate the Standard Firewall:**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
$azfw.Deallocate()
Set-AzFirewall -AzureFirewall $azfw
```

**Allocate Firewall Premium (single public IP address):**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
$azfw.Sku.Tier="Premium"
$vnet = Get-AzVirtualNetwork -ResourceGroupName "<resource-group-name>" -Name "<Virtual-Network-Name>"
$publicip = Get-AzPublicIpAddress -Name "<Firewall-PublicIP-name>" -ResourceGroupName "<resource-group-name>"
$azfw.Allocate($vnet,$publicip)
Set-AzFirewall -AzureFirewall $azfw
```

**Allocate Firewall Premium (multiple public IP addresses):**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
$azfw.Sku.Tier="Premium"
$vnet = Get-AzVirtualNetwork -ResourceGroupName "RG Name" -Name "VNet Name"
$publicip1 = Get-AzPublicIpAddress -Name "Public IP1 Name" -ResourceGroupName "RG Name"
$publicip2 = Get-AzPublicIpAddress -Name "Public IP2 Name" -ResourceGroupName "RG Name"
$azfw.Allocate($vnet,@($publicip1,$publicip2))
Set-AzFirewall -AzureFirewall $azfw
```

**Allocate Firewall Premium in Forced Tunnel Mode:**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
$azfw.Sku.Tier="Premium"
$vnet = Get-AzVirtualNetwork -ResourceGroupName "<resource-group-name>" -Name "<Virtual-Network-Name>"
$publicip = Get-AzPublicIpAddress -Name "<Firewall-PublicIP-name>" -ResourceGroupName "<resource-group-name>"
$mgmtPip = Get-AzPublicIpAddress -ResourceGroupName "<resource-group-name>"-Name "<Management-PublicIP-name>"
$azfw.Allocate($vnet,$publicip,$mgmtPip)
Set-AzFirewall -AzureFirewall $azfw
```

#### Migrate a Secure Hub Firewall

**Deallocate the Standard Firewall:**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
$azfw.Deallocate()
Set-AzFirewall -AzureFirewall $azfw
```

**Allocate Firewall Premium:**

```azurepowershell-interactive
$azfw = Get-AzFirewall -Name "<firewall-name>" -ResourceGroupName "<resource-group-name>"
$hub = get-azvirtualhub -ResourceGroupName "<resource-group-name>" -name "<vWANhub-name>"
$azfw.Sku.Tier="Premium"
$azfw.Allocate($hub.id)
Set-AzFirewall -AzureFirewall $azfw
```

### Step 4: Attach Premium policy

After upgrading the firewall to Premium, attach the Premium policy using the Azure portal:

1. Navigate to your Premium firewall in the Azure portal.
1. On the **Overview** page, select **Firewall policy**.
1. Select your newly created Premium policy.
1. Select **Save**.

:::image type="content" source="media/change-sku/premium-firewall-policy.png" alt-text="Screenshot showing firewall policy":::

## Terraform migration

If you use Terraform to deploy Azure Firewall, you can use Terraform to migrate to Azure Firewall Premium. For more information, see [Migrate Azure Firewall Standard to Premium using Terraform](/azure/developer/terraform/firewall-upgrade-premium?toc=/azure/firewall/toc.json&bc=/azure/firewall/breadcrumb/toc.json).

## Troubleshoot SKU change issues

### Common issues and solutions

- **Easy SKU change not available**: Use the manual migration method described in this article
- **Policy migration errors**: Ensure you have the correct PowerShell module versions installed
- **Downtime longer than expected**: Check network connectivity and resource availability
- **Performance issues after upgrade**: Review performance considerations and conduct thorough testing
- **Downgrade blocked by Premium features**: Remove or disable Premium-exclusive features before attempting downgrade

### Downgrade troubleshooting

If you're unable to downgrade from Premium to Standard:

1. **Check for Premium features**: Verify that your firewall policy doesn't contain:
   - TLS inspection rules
   - IDPS in Alert and Deny mode
   - URL filtering rules
   - Web category rules

2. **Policy modification options**:
   - Create a new Standard policy without Premium features
   - Modify your existing policy to remove Premium features
   - Use Azure PowerShell to identify and remove incompatible rules

3. **Validation steps**:
   ```azurepowershell-interactive
   # Check current firewall policy for Premium features
   $policy = Get-AzFirewallPolicy -ResourceGroupName "myResourceGroup" -Name "myPolicy"
   
   # Review policy settings for Premium features
   $policy.ThreatIntelMode
   $policy.IntrusionDetection
   $policy.TransportSecurity
   ```

### Known limitations

- Upgrading a Standard firewall deployed in Southeast Asia with Availability Zones isn't currently supported for manual migration
- Easy SKU change doesn't support Basic SKU firewalls - users with Basic SKU must first migrate to Standard SKU before upgrading to Premium
- Some custom configurations might require the manual migration approach
- Downgrading with active Premium features fails until those features are removed

## Next steps

- [Learn more about Azure Firewall Premium features](premium-features.md)
- [Azure Firewall Performance](firewall-performance.md)
- [What is Azure Firewall?](overview.md)
