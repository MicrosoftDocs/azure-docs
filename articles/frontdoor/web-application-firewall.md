---
title: Web Application Firewall on Azure Front Door
description: This article provides a list of the various features available with Web Application Firewall (WAF) on Azure Front Door. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 03/18/2022
ms.author: duau
---

# Web Application Firewall (WAF) on Azure Front Door

Azure Web Application Firewall (WAF) on Azure Front Door provides centralized protection for your web applications. WAF defends your web services against common exploits and vulnerabilities. It keeps your service highly available for your users and helps you meet compliance requirements. In this article, you'll learn about the different features of Azure Web Application Firewall on Azure Front Door. For more information, see [WAF on Azure Front Door](../web-application-firewall/afds/afds-overview.md).

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Web Application Firewall applied to an Azure Front Door environment.":::

## Tuning

The Azure-managed Default Rule Set is based on the [OWASP Core Rule Set (CRS)](https://github.com/SpiderLabs/owasp-modsecurity-crs/tree/v3.1/dev) and is designed to be strict out of the box. Azure Web Application Firewall (WAF) lets you tune the WAF rules to suit the needs of your application and organization WAF requirements. Tuning features you can expect to see are defining rules exclusions, creating custom rules, and disabling of rules. For more information, see [WAF Tuning](../web-application-firewall/afds/waf-front-door-tuning.md).

## Managed rules

Azure Front Door web application firewall (WAF) protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Since such rule sets are managed by Azure, the rules are updated as needed to protect against new attack signatures. For more information, see [WAF managed rules](/web-application-firewall/afds/waf-front-door-drs.md).

> [!NOTE]
> * Only Azure Front Door Premium and Azure Front Door (classic) support managed rules. 
> * Azure Front Door (classic) supports only DRS 1.1 or below.
>

## Custom rules

Azure Web Application Firewall (WAF) with Front Door allows you to control access to your web applications based on the conditions you define. A custom WAF rule consists of a priority number, rule type, match conditions, and an action. There are two types of custom rules: match rules and rate limit rules. A match rule control access based on a set of matching conditions while a rate limit rule control access based on matching conditions and the rates of incoming requests. For more information, see [WAF custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md).

## Exclusion lists

Azure Web Application Firewall (WAF) can sometime block requests that you want to allow for your application. WAF exclusion list allows you to omit certain request attributes from a WAF evaluation and allow the rest of the request to be process as normal. For more information, see [WAF exclusion lists](../web-application-firewall/afds/waf-front-door-exclusion.md).

## Policy settings

A Web Application Firewall (WAF) policy allows you to control access to your web applications by using a set of custom and managed rules. You can change the state of the policy or configure a specific mode type for the policy. Depending on policy level settings you can choose to either actively inspect incoming requests, monitor only, or to monitor and take actions against requests that match a rule. For more information, see [WAF policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md).

## Geo-filtering

Azure Front Door by default will respond to all user requests regardless of the location where the request is coming from. Geo-filtering allows you to restrict access to your web application by countries/regions. Web Application Firewall (WAF) on Azure Front Door allows you to define a policy using custom access rules. These custom access rules are for a specific path on your endpoints to either block or allow access from specified countries/regions. For more information, see [WAF geo-filtering](../frontdoor/front-door-geo-filtering.md).

## Next steps

* Learn how to [create and apply Web Application Firewall policy](../web-application-firewall/afds/waf-front-door-create-portal.md) to your Azure Front Door profile.
* For more information, see [Web Application Firewall (WAF) FAQ](../web-application-firewall/afds/waf-faq.yml).