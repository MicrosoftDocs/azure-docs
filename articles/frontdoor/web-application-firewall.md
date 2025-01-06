---
title: Web Application Firewall (WAF) on Azure Front Door
description: This article provides a list of the various features available with Web Application Firewall (WAF) on Azure Front Door.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/15/2024
ms.author: duau
---

# Web Application Firewall (WAF) on Azure Front Door

Azure Web Application Firewall (WAF) on Azure Front Door offers centralized protection for your web applications. It safeguards against common exploits and vulnerabilities, ensuring high availability and compliance. This article outlines the features of Azure Web Application Firewall on Azure Front Door. For more information, see [WAF on Azure Front Door](../web-application-firewall/afds/afds-overview.md).

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Web Application Firewall applied to an Azure Front Door environment.":::

## Policy settings

A Web Application Firewall (WAF) policy allows you to control access to your web applications using custom and managed rules. You can adjust the policy state or configure its mode. Depending on the settings, you can inspect incoming requests, monitor them, or take actions against requests that match a rule. You can also set the WAF to detect threats without blocking them, which is useful when first enabling the WAF. After evaluating its impact, you can reconfigure the WAF to prevention mode. For more information, see [WAF policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md).

## Managed rules

Azure Front Door WAF protects web applications from common vulnerabilities and exploits. Azure-managed rule sets offer easy deployment against common security threats. Azure updates these rules to protect against new attack signatures. The default rule set includes Microsoft Threat Intelligence Collection rules, providing increased coverage, specific vulnerability patches, and better false positive reduction. For more information, see [WAF managed rules](../web-application-firewall/afds/waf-front-door-drs.md).

> [!NOTE]
> * Managed rules are supported only by Azure Front Door Premium and Azure Front Door (classic).
> * Azure Front Door (classic) supports only DRS 1.1 or below.

## Custom rules

Azure Web Application Firewall (WAF) with Front Door allows you to control access to your web applications based on defined conditions. A custom WAF rule includes a priority number, rule type, match conditions, and an action. There are two types of custom rules: match rules and rate limit rules. Match rules control access based on specific conditions, while rate limit rules control access based on conditions and the rate of incoming requests. For more information, see [WAF custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md).

## Exclusion lists

Azure Web Application Firewall (WAF) can sometimes block requests that you want to allow. WAF exclusion lists let you omit certain request attributes from WAF evaluation, allowing the rest of the request to be processed normally. For more information, see [WAF exclusion lists](../web-application-firewall/afds/waf-front-door-exclusion.md).

## Geo-filtering

By default, Azure Front Door responds to all user requests regardless of their location. Geo-filtering allows you to restrict access to your web application by countries/regions. For more information, see [WAF geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md).

## Bot Protection

Azure Web Application Firewall (WAF) for Front Door includes bot protection rules to identify and allow good bots while blocking bad bots. For more information, see [configure bot protection](../web-application-firewall/afds/waf-front-door-policy-configure-bot-protection.md).

## IP restriction

IP restriction rules in Azure WAF allow you to control access to your web applications by specifying allowed or blocked IP addresses or IP address ranges. For more information, see [configure IP restriction](../web-application-firewall/afds/waf-front-door-configure-ip-restriction.md).

## Rate limiting

Rate limiting rules in Azure WAF control access based on matching conditions and the rate of incoming requests. For more information, see [What is rate limiting for Azure Front Door Service?](../web-application-firewall/afds/waf-front-door-rate-limit.md).

## Tuning

Azure WAF's Default Rule Set is based on the [OWASP Core Rule Set (CRS)](https://github.com/SpiderLabs/owasp-modsecurity-crs/tree/v3.1/dev) and includes Microsoft Threat Intelligence Collection rules. You can tune WAF rules to meet your application's specific needs by defining rule exclusions, creating custom rules, and disabling rules. For more information, see [WAF Tuning](../web-application-firewall/afds/waf-front-door-tuning.md).

## Monitoring and logging

Azure WAF provides monitoring and logging through integration with Azure Monitor and Azure Monitor logs. For more information, see [Azure Web Application Firewall (WAF) logging and monitoring](../web-application-firewall/afds/waf-front-door-monitor.md).

## Next steps

* Learn how to [create and apply Web Application Firewall policy](../web-application-firewall/afds/waf-front-door-create-portal.md) to your Azure Front Door.
* For more information, see [Web Application Firewall (WAF) FAQ](../web-application-firewall/afds/waf-faq.yml).