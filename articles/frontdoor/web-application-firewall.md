---
title: Web Application Firewall on Azure Front Door
description: This article provides a list of the various features available with Web Application Firewall (WAF) on Azure Front Door. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 06/02/2023
ms.author: duau
---

# Web Application Firewall (WAF) on Azure Front Door

Azure Web Application Firewall (WAF) on Azure Front Door provides centralized protection for your web applications. WAF defends your web services against common exploits and vulnerabilities. It keeps your service highly available for your users and helps you meet compliance requirements. In this article, you learn about the different features of Azure Web Application Firewall on Azure Front Door. For more information, see [WAF on Azure Front Door](../web-application-firewall/afds/afds-overview.md).

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Web Application Firewall applied to an Azure Front Door environment.":::

## Policy settings

A Web Application Firewall (WAF) policy allows you to control access to your web applications by using a set of custom and managed rules. You can change the state of the policy or configure a specific mode type for the policy. Depending on the policy level settings you can choose to either actively inspect incoming requests, monitor only, or monitor and take actions against requests that match a rule. You can also configure the WAF to only detect threats without blocking them, which is useful when you first enable the WAF. After evaluating how the WAF works with your application, you can reconfigure the WAF settings and enable the WAF in prevention mode. For more information, see [WAF policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md).

## Managed rules

Azure Front Door web application firewall (WAF) protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Since rule sets get managed by Azure, the rules are updated as needed to protect against new attack signatures. Default rule set also includes the Microsoft Threat Intelligence Collection rules that are written in partnership with the Microsoft Intelligence team to provide increase coverage, patches for specific vulnerabilities, and better false positive reduction. For more information, see [WAF managed rules](../web-application-firewall/afds/waf-front-door-drs.md).

> [!NOTE]
> * Only Azure Front Door Premium and Azure Front Door (classic) support managed rules. 
> * Azure Front Door (classic) supports only DRS 1.1 or below.
>

## Custom rules

Azure Web Application Firewall (WAF) with Front Door allows you to control access to your web applications based on the conditions you define. A custom WAF rule consists of a priority number, rule type, match conditions, and an action. There are two types of custom rules: match rules and rate limit rules. A match rule control access based on a set of matching conditions while a rate limit rule control access based on matching conditions and the rates of incoming requests. For more information, see [WAF custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md).

## Exclusion lists

Azure Web Application Firewall (WAF) can sometime block requests that you want to allow for your application. WAF exclusion list allows you to omit certain request attributes from a WAF evaluation and allow the rest of the request to be process as normal. For more information, see [WAF exclusion lists](../web-application-firewall/afds/waf-front-door-exclusion.md).

## Geo-filtering

Azure Front Door by default responds to all user requests regardless of the location where the request is coming from. Geo-filtering allows you to restrict access to your web application by countries/regions. For more information, see [WAF geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md).

## Bot Protection

Azure Web Application Firewall (WAF) for Front Door provides bot rules to identify good bots and protect from bad bots. For more information, see [configure bot protection](../web-application-firewall/afds/waf-front-door-policy-configure-bot-protection.md).

## IP restriction

An IP address–based access control rule is a custom WAF rule that lets you control access to your web applications by specifying a list of IP addresses or IP address ranges. For more information, see [configure IP restriction](../web-application-firewall/afds/waf-front-door-configure-ip-restriction.md).

## Rate limiting

A custom rate limit rule control access based on matching conditions and the rates of incoming requests. For more information, see [What is rate limiting for Azure Front Door Service?](../web-application-firewall/afds/waf-front-door-rate-limit.md).

## Tuning

The Microsoft-managed Default Rule Set is based on the [OWASP Core Rule Set (CRS)](https://github.com/SpiderLabs/owasp-modsecurity-crs/tree/v3.1/dev) and includes Microsoft Threat Intelligence Collection rules. Azure Web Application Firewall (WAF) lets you tune the WAF rules to suit the needs of your application and organization WAF requirements. Tuning features you can expect to see are defining rules exclusions, creating custom rules, and disabling of rules. For more information, see [WAF Tuning](../web-application-firewall/afds/waf-front-door-tuning.md).

## Monitor and logging

Azure Web Application Firewall (WAF) monitoring and logging are provided through logging and integration with Azure Monitor and Azure Monitor logs. For more information, see [Azure Web Application Firewall (WAF) logging and monitoring](../web-application-firewall/afds/waf-front-door-monitor.md).

## Next steps

* Learn how to [create and apply Web Application Firewall policy](../web-application-firewall/afds/waf-front-door-create-portal.md) to your Azure Front Door.
* For more information, see [Web Application Firewall (WAF) FAQ](../web-application-firewall/afds/waf-faq.yml).