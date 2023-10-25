---
title: Upgrade to Azure Application Gateway WAF policy
description: Learn how to upgrade Azure Application Gateway WAF policy.
services: web-application-firewall
ms.topic: how-to
author: vhorne
ms.service: web-application-firewall
ms.date: 04/25/2023
ms.author: lunowak
ms.custom:
---

# Upgrade to Azure Application Gateway WAF policy

Azure Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities. Web Application Firewall Policies contain all the WAF settings and configurations. This includes exclusions, custom rules, managed rules, and so on. These policies are then associated with an application gateway (global), a listener (per-site), or a path-based rule (per-URI) for them to take effect.

Azure Application Gateway WAF v2 natively supports WAF policy. You should upgrade your legacy WAF configuration to WAF policies.

- Policies offer a richer set of advanced features. This includes newer managed rule sets, custom rules, per rule exclusions, bot protection, and the next generation of WAF engine. These advanced features are available to you at no extra cost.
- WAF policies provide higher scale and better performance.
- Unlike legacy WAF configuration, WAF policies can be defined once and shared across multiple gateways, listeners, and URL paths. This simplifies the management and deployment experience.
- The latest features and future enhancements are only available via WAF policies. 

> [!IMPORTANT]
> No further investments will be made on legacy WAF configuration. You are strongly encouraged to upgrade from legacy WAF configuration to WAF Policy for easier management, better scale, and a richer feature set at no additional cost.

## Upgrade Application Gateway Standard v2 to Application Gateway WAF v2

1. Locate the Application Gateway in the Azure portal. Select the Application Gateway and the select **Configuration** from the **Settings** menu on the left side.
1. Under **Tier**, select **WAF V2**.
1. Select **Save** to complete the upgrade from Application Gateway Standard to Application Gateway WAF.

## Upgrade WAF v2 with legacy WAF configuration to WAF policy

You can upgrade existing Application Gateways with WAF v2 from WAF legacy configuration to WAF policy directly without any downtime. You can upgrade using either using the portal, Firewall Manager, or Azure PowerShell.

# [Portal](#tab/portal)

1. Sign in to the Azure portal and select the Application Gateway WAF v2 that has a legacy WAF configuration.
1. Select **Web Application Firewall** from the left menu, then select **Upgrade from WAF configuration**.
1. Provide a name for the new WAF Policy and then select **Upgrade**. This creates a new WAF Policy based on the WAF configuration. You can also choose to associate a pre-existing WAF Policy instead of creating a new one.
1. When the upgrade finishes, a new WAF Policy incorporating the previous WAF configuration and rules is created. 

# [Firewall Manager](#tab/fwm)

See [Configure WAF policies using Azure Firewall Manager](../shared/manage-policies.md).

# [PowerShell](#tab/powershell)

See [Upgrade Web Application Firewall policies using Azure PowerShell](migrate-policy.md).

---

## Upgrade Application Gateway v1 to WAF v2 with WAF policy

> [!IMPORTANT]
> We announced the deprecation of the Application Gateway V1 SKU (Standard and WAF) on April 28, 2023 and subsequently this SKU retires on April 28, 2026. For more information, see [Migrate your Application Gateways from V1 SKU to V2 SKU by April 28, 2026](../../application-gateway/v1-retirement.md).

Application Gateway v1 doesn't support WAF policy. Upgrading to WAF policy is a two step process:

- Upgrade Application Gateway v1 to v2 version.
- Upgrade legacy WAF configuration to WAF policy.

1. Upgrade from v1 to v2 Application Gateway.

   For more information, see [Upgrade Azure Application Gateway and Web Application Firewall from v1 to v2](../../application-gateway/migrate-v1-v2.md).

   When you complete the upgrade of v1 to v2, the Application Gateway v2 has a legacy WAF configuration.
2. Upgrade to Application Gateway WAF v2 with WAF Policy.

   - If in Step 1 you upgraded from Application Gateway Standard v1 to v2, see the previous section [Upgrade Application Gateway Standard v2 to Application Gateway WAF v2](#upgrade-application-gateway-standard-v2-to-application-gateway-waf-v2).
   - If in Step 1, you upgraded from Application Gateway WAF v1 to Application Gateway WAF v2 with legacy configuration, see the previous section [Upgrade WAF v2 with legacy WAF configuration to WAF policy](#upgrade-waf-v2-with-legacy-waf-configuration-to-waf-policy) to migrate to Application Gateway WAF v2 SKU with WAF policy.

## Next steps

- For more information about WAF on Application Gateway policy, see [Azure Web Application Firewall (WAF) policy overview](policy-overview.md).
- [Migrate your Application Gateways from V1 SKU to V2 SKU by April 28, 2026](../../application-gateway/v1-retirement.md)
