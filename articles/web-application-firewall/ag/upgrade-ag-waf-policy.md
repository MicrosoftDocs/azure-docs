---
title: Upgrade to Azure Application Gateway WAF Policy
description: Learn how to upgrade Azure Application Gateway WAF policy.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 06/30/2026
# Customer intent: "As a cloud administrator, I want to upgrade my Azure Application Gateway from legacy WAF configuration to WAF policies, so that I can leverage advanced features, improve management efficiency, and ensure continued support before the legacy version is retired."
---

# Upgrade to Azure Application Gateway WAF policy

**Applies to:** :heavy_check_mark: Application Gateway V2

> [!IMPORTANT]
> On **March 15, 2024**, Microsoft announced the deprecation of WAF configuration on Application Gateway WAF V2 SKU. WAF configuration on Application Gateway WAF v2 retires on **March 15, 2027**. Microsoft isn't making any further investments in WAF configuration on Application Gateway WAF v2. Upgrade from WAF Configuration to **WAF Policy** for easier management, better scale, and a richer feature set at no extra cost. For more information, see [Retirement: Support for Application Gateway Web Application Firewall v2 Configuration is ending](https://azure.microsoft.com/updates/retirement-support-for-application-gateway-web-application-firewall-v2-configuration-is-ending).

Azure Web Application Firewall (WAF) provides centralized protection for your web applications from common exploits and vulnerabilities. Web Application Firewall policies contain all the WAF settings and configurations. This configuration includes exclusions, custom rules, managed rules, and more. Associate these policies with an application gateway (global), a listener (per-site), or a path-based rule (per-URI) for them to take effect.

Azure Application Gateway WAF v2 natively supports WAF policy. Upgrade your legacy WAF configuration to WAF policies.

- Policies offer a richer set of advanced features. This set includes newer managed rule sets, custom rules, per rule exclusions, bot protection, and the next generation of WAF engine. You get these advanced features at no extra cost.
- WAF policies provide higher scale and better performance.
- Unlike legacy WAF configuration, you can define WAF policies once and share them across multiple gateways, listeners, and URL paths. This sharing simplifies the management and deployment experience.
- The latest features and future enhancements are only available through WAF policies. 

## Retirement timelines

- Deprecation announcement: March 15, 2024
- No creation of new WAF configuration deployments: March 15, 2025. The ability to create new WAF configuration deployments on the Application Gateway WAF V2 SKU is discontinued.
- Retirement: March 15, 2027 

## Upgrade Application Gateway Standard v2 to Application Gateway WAF v2

1. Locate the Application Gateway in the Azure portal. Select the Application Gateway. From the **Settings** menu, select **Configuration**.
1. Under **Tier**, select **WAF V2**.
1. Select **Save** to complete the upgrade from Application Gateway Standard to Application Gateway WAF.

## Upgrade WAF v2 with legacy WAF configuration to WAF policy

You can upgrade existing Application Gateways with WAF v2 from WAF legacy configuration to WAF policy directly without any downtime. You can upgrade by using the portal, Firewall Manager, or Azure PowerShell.

# [Portal](#tab/portal)

1. Sign in to the Azure portal and select the Application Gateway WAF v2 that has a legacy WAF configuration.
1. Select **Web Application Firewall** from the left menu, and then select **Upgrade from WAF configuration**.
1. Enter a name for the new WAF policy and then select **Upgrade**. This action creates a new WAF policy based on the WAF configuration. You can also choose to associate an existing WAF policy instead of creating a new one.
1. When the upgrade finishes, a new WAF policy incorporating the previous WAF configuration and rules is created. 

# [Firewall Manager](#tab/fwm)

See [Configure WAF policies using Azure Firewall Manager](../shared/manage-policies.md).

# [PowerShell](#tab/powershell)

See [Upgrade Web Application Firewall policies using Azure PowerShell](migrate-policy.md).

---

## Upgrade Application Gateway v1 to WAF v2 with WAF policy

> [!IMPORTANT]
> Microsoft announced the deprecation of the Application Gateway V1 SKU (Standard and WAF) on April 28, 2023. This version retires on April 28, 2026. For more information, see [Migrate your Application Gateways from V1 SKU to V2 SKU by April 28, 2026](../../application-gateway/v1-retirement.md).

Application Gateway v1 doesn't support WAF policy. Upgrading to WAF policy is a two-step process:

- Upgrade Application Gateway v1 to v2 version.
- Upgrade legacy WAF configuration to WAF policy.

1. Upgrade from v1 to v2 Application Gateway.

   For more information, see [Upgrade Azure Application Gateway and Web Application Firewall from v1 to v2](../../application-gateway/migrate-v1-v2.md).

   When you complete the upgrade of v1 to v2, the Application Gateway v2 has a legacy WAF configuration.
1. Upgrade to Application Gateway WAF v2 with WAF Policy.

   - If in Step 1 you upgraded from Application Gateway Standard v1 to v2, see the previous section [Upgrade Application Gateway Standard v2 to Application Gateway WAF v2](#upgrade-application-gateway-standard-v2-to-application-gateway-waf-v2).
   - If in Step 1, you upgraded from Application Gateway WAF v1 to Application Gateway WAF v2 with legacy configuration, see the previous section [Upgrade WAF v2 with legacy WAF configuration to WAF policy](#upgrade-waf-v2-with-legacy-waf-configuration-to-waf-policy) to migrate to Application Gateway WAF v2 SKU with WAF policy.

## Related content

- [Azure Web Application Firewall (WAF) policy overview](policy-overview.md)
- [Application Gateway V1 SKU retirement](../../application-gateway/v1-retirement.md)
