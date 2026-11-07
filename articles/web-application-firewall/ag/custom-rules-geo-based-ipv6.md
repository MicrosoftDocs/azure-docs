---
title: IPv6 Geo-Based Custom Rules (Preview)
titleSuffix: Azure Web Application Firewall
description: Learn about IPv6 geo-based custom rules in Application Gateway WAF, including preview feature registration, dual-stack requirements, and validation behavior.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 09/17/2026

#customer intent: As a network security engineer, I want to understand how geo-based custom rules apply to IPv6 traffic in Application Gateway WAF, so that I can block or allow traffic based on geographic location for my dual-stack deployments.
---

# IPv6 geo-based custom rules for Azure Web Application Firewall (preview)

**Applies to:** :heavy_check_mark: Application Gateway v2

> [!IMPORTANT]
> The IPv6 geo-based custom rules feature for Azure Application Gateway Web Application Firewall (WAF) is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Geomatch custom rules](geomatch-custom-rules.md) let you restrict access to your web applications by country or region. The IPv6 geo-based custom rules feature for Azure Application Gateway WAF extends this protection to IPv6 traffic.

To use this feature, register `AllowAppGwWafIpv6Geo` in your Azure subscription. For more information, see [Set up preview features in Azure subscription](../../azure-resource-manager/management/preview-features.md).

## When feature registration is required

Register the `AllowAppGwWafIpv6Geo` feature **only** in the following scenario:

- You want to create or use geo-based custom rules that apply to IPv6 traffic in Application Gateway WAF.

You don't need to register the feature for:

- IPv6 inspection using managed rule sets

- Non-geo custom rules for IPv6, such as rules based on IPv6 addresses or ranges

- Logging, diagnostics, and monitoring of IPv6 traffic

## Requirements

To use IPv6 geo-based custom rules:

- The Application Gateway must support IPv6 and be deployed in a dual-stack configuration.

- Both public and private IP configurations must be dual-stack.

- To evaluate IPv6 traffic by using geo-based custom rules, you must associate the WAF policy with at least one IPv6-capable, dual-stack Application Gateway.

## Workflow for enabling IPv6 geo-based custom rules

To evaluate IPv6 traffic by using geo-based custom rules, complete the following steps:

1.  [Register the `AllowAppGwWafIpv6Geo` feature](#register-the-feature) in your Azure subscription.

1.  Deploy or update your Application Gateway to a dual-stack configuration that supports IPv6. You can't update or convert an existing IPv4-only Application Gateway to dual-stack. For more information, see [Configure Application Gateway with a frontend public IPv6 address](../../application-gateway/ipv6-application-gateway-portal.md).

    > [!NOTE]
    > IPv6-only Application Gateways aren't supported.

1.  Create or update a WAF policy with geo-based custom rules for IPv6 traffic. For more information, see [Geomatch custom rules](geomatch-custom-rules.md).

1.  Associate the WAF policy with the IPv6-capable Application Gateway. For more information, see [Associate a WAF policy with an existing Application Gateway](associate-waf-policy-existing-gateway.md).

1.  Validate enforcement by using WAF logs and diagnostics. For more information, see [Resource logs for Azure Web Application Firewall](web-application-firewall-logs.md).

## Enforcement behavior and validation

To prevent unsupported configurations, the platform blocks the following actions:

- **Associating a policy:** You **can't associate** a WAF policy that contains geo-based custom rules for IPv6 traffic with an incompatible dual-stack Application Gateway that doesn't support IPv6 geo evaluation.

- **Creating a rule:** You **can't create** geo-based custom rules in a WAF policy that is already associated with a dual-stack Application Gateway that doesn't support IPv6.

> [!NOTE]
> IPv4-only Application Gateways aren't affected by this validation. Validation applies only when you associate dual-stack Application Gateways that participate in IPv6 traffic evaluation.

These checks remain in effect after you register the feature, which ensures predictable behavior during the preview.

## Register the feature

The following table lists the details you need to register the feature:

| Property | Value |
| --- | --- |
| Feature name | `AllowAppGwWafIpv6Geo` |
| Display name | Enable IPv6 Geo Custom Rules for WAF |
| Provider namespace | `Microsoft.Network` |
| Description | Enables geo-based custom rules with IPv6 traffic in Application Gateway WAF |

# [**Portal**](#tab/portal)

To register the feature, follow these steps:

1.  In the search box at the top of the [Azure portal](https://portal.azure.com), enter *subscriptions* and select **Subscriptions**.

1.  Select your subscription.

1.  Under **Settings**, select **Preview features** to see a list of all available features and the current registration status.

1.  On the **Preview features** page, use the search box to search for *AllowAppGwWafIpv6Geo*.

1.  Select the feature and then select **Register**.

    :::image type="content" source="../media/custom-rules-geo-based-ipv6/preview-features-register.png" alt-text="Screenshot of the Preview features page in the Azure portal, showing the Enable IPv6 Geo Custom Rules for WAF feature selected and the Register button highlighted.":::

1.  In the confirmation message, select **OK** to register the feature in your subscription.

# [**PowerShell**](#tab/powershell)

Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to register the feature.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName "AllowAppGwWafIpv6Geo" -ProviderNamespace "Microsoft.Network"
```

Use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet to view the registration status of the feature.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "AllowAppGwWafIpv6Geo" -ProviderNamespace "Microsoft.Network"
```

```
FeatureName          ProviderName      RegistrationState
-----------          ------------      -----------------
AllowAppGwWafIpv6Geo Microsoft.Network Registered
```

# [**Azure CLI**](#tab/cli)

Use the [az feature register](/cli/azure/feature#az-feature-register) command to register for the feature.

```azurecli-interactive
az feature register --name AllowAppGwWafIpv6Geo --namespace Microsoft.Network
```

Use the [az feature registration show](/cli/azure/feature/registration#az-feature-registration-show) command to view the registration status of the feature.

```azurecli-interactive
az feature registration show --name AllowAppGwWafIpv6Geo --provider-namespace Microsoft.Network --output table
```

```
Name                                    RegistrationState
--------------------------------------  -----------------
Microsoft.Network/AllowAppGwWafIpv6Geo   Registered
```

---

## Unregister the feature

# [**Portal**](#tab/portal)

To unregister the feature, follow these steps:

1.  In the search box at the top of the [Azure portal](https://portal.azure.com), enter *subscriptions* and select **Subscriptions**.

1.  Select your subscription.

1.  Under **Settings**, select **Preview features** to see a list of all available features and the current registration status.

1.  On the **Preview features** page, use the search box to search for *AllowAppGwWafIpv6Geo*.

1.  Select the feature and then select **Unregister**.

    :::image type="content" source="../media/custom-rules-geo-based-ipv6/preview-features-unregister.png" alt-text="Screenshot of the Preview features page in the Azure portal, showing the registered Enable IPv6 Geo Custom Rules for WAF feature and the Unregister button highlighted.":::

1.  In the confirmation message, select **OK** to unregister the feature from your subscription.

# [**PowerShell**](#tab/powershell)

Use the [Unregister-AzProviderFeature](/powershell/module/az.resources/unregister-azproviderfeature) cmdlet to unregister from the feature.

```azurepowershell-interactive
Unregister-AzProviderFeature -FeatureName "AllowAppGwWafIpv6Geo" -ProviderNamespace "Microsoft.Network"
```

Use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet to view the registration status of the feature.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "AllowAppGwWafIpv6Geo" -ProviderNamespace "Microsoft.Network"
```

```
FeatureName          ProviderName      RegistrationState
-----------          ------------      -----------------
AllowAppGwWafIpv6Geo Microsoft.Network Unregistered
```

# [**Azure CLI**](#tab/cli)

Use the [az feature unregister](/cli/azure/feature#az-feature-unregister) command to unregister the feature.

```azurecli-interactive
az feature unregister --name AllowAppGwWafIpv6Geo --namespace Microsoft.Network
```

Use the [az feature registration show](/cli/azure/feature/registration#az-feature-registration-show) command to view the registration status of the feature.

```azurecli-interactive
az feature registration show --name AllowAppGwWafIpv6Geo --provider-namespace Microsoft.Network --output table
```

```
Name                                    RegistrationState
--------------------------------------  -----------------
Microsoft.Network/AllowAppGwWafIpv6Geo   Unregistered
```

---

## Related content

- [Geomatch custom rules](geomatch-custom-rules.md)
- [Custom rules for Azure Application Gateway WAF](custom-waf-rules-overview.md)
- [Configure Application Gateway with a frontend public IPv6 address](../../application-gateway/ipv6-application-gateway-portal.md)
