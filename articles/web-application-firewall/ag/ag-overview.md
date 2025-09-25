---
title: What Is Azure Web Application Firewall on Azure Application Gateway?
description: Learn about deploying Azure Web Application Firewall on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 03/10/2025
ms.custom: sfi-image-nochange
# Customer intent: "As a security engineer, I want to implement a web application firewall with customizable policies on my application gateway, so that I can protect my web applications from common exploits and monitor attack patterns effectively."
---

# What is Azure Web Application Firewall on Azure Application Gateway?

An Azure Web Application Firewall deployment on Azure Application Gateway actively safeguards your web applications against common exploits and vulnerabilities. As web applications become more frequent targets for malicious attacks, these attacks often exploit well-known vulnerabilities such as SQL injection and cross-site scripting.

Azure Web Application Firewall on Application Gateway is based on the [Core Rule Set (CRS)](application-gateway-crs-rulegroups-rules.md) from the Open Web Application Security Project (OWASP).

All of the following Azure Web Application Firewall features exist inside a web application firewall (WAF) policy. You can create multiple policies and associate them with an application gateway, with individual listeners, or with path-based routing rules on an application gateway. This association enables you to define separate policies for each site behind your application gateway if necessary. For more information on WAF policies, see [Create WAF policies for Application Gateway](create-waf-policy-ag.md).

> [!NOTE]
> Application Gateway has two versions of a web application firewall: WAF_v1 and WAF_v2. WAF policy associations are supported only for WAF_v2.

:::image type="content" source="../media/ag-overview/waf1.png" alt-text="Diagram that illustrates how a web application firewall works with Azure Application Gateway.":::

Application Gateway operates as an application delivery controller. It offers Transport Layer Security (TLS) (previously known as Secure Sockets Layer or SSL) termination, cookie-based session affinity, round-robin load distribution, content-based routing, the ability to host multiple websites, and security enhancements.

Application Gateway enhances security through TLS policy management and end-to-end TLS support. Integrating Azure Web Application Firewall into Application Gateway fortifies application security. This combination actively defends your web applications against common vulnerabilities and offers a centrally manageable location.

## Benefits

This section describes the core benefits that Azure Web Application Firewall on Application Gateway provides.

### Protection

- Help protect your web applications from web vulnerabilities and attacks without modification to back-end code.

- Help protect multiple web applications at the same time. An instance of Application Gateway can host up to 40 websites that use a web application firewall.

- Create custom WAF policies for different sites behind the same WAF.

- Help protect your web applications from malicious bots with the IP Reputation Rule Set.

- Help protect your application against DDoS attacks. For more information, see [Application (Layer 7) DDoS protection](../shared/application-ddos-protection.md).

### Monitoring

- Monitor attacks against your web applications by using a real-time WAF log. The log is integrated with [Azure Monitor](/azure/azure-monitor/overview?toc=/azure/web-application-firewall/toc.json) to track WAF alerts and monitor trends.

- The Application Gateway WAF is integrated with Microsoft Defender for Cloud. Defender for Cloud provides a central view of the security state of all your Azure, hybrid, and multicloud resources.

### Customization

- Customize WAF rules and rule groups to suit your application requirements and eliminate false positives.

- Associate a WAF policy for each site behind your WAF to allow for site-specific configuration.

- Create custom rules to suit the needs of your application.

## Features

- Protection against SQL injection.
- Protection against cross-site scripting.
- Protection against other common web attacks, such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion.
- Protection against HTTP protocol violations.
- Protection against HTTP protocol anomalies such as missing `Host`, `User-Agent`, and `Accept` headers.
- Protection against crawlers and scanners.
- Detection of common application misconfigurations (for example, Apache and IIS).
- Configurable request size limits with lower and upper bounds.
- Exclusion lists that let you omit certain request attributes from a WAF evaluation. A common example is Active Directory-inserted tokens that are used for authentication or password fields.
- Ability to create custom rules to suit the specific needs of your applications.
- Ability to geo-filter traffic, to allow or block certain countries/regions from gaining access to your applications.
- Bot Manager Rule Set that helps protect your applications from bots.
- Ability to inspect JSON and XML in the request body.

## WAF policy and rules

To use a web application firewall on Application Gateway, you must create a WAF policy. This policy is where all of the managed rules, custom rules, exclusions, and other customizations (such as file upload limit) exist.

You can configure a WAF policy and associate that policy with one or more application gateways for protection. A WAF policy consists of two types of security rules:

- Custom rules that you create
- Managed rule sets that are collections of Azure-managed preconfigured rules

When both are present, the WAF processes custom rules before processing the rules in a managed rule set.

A rule consists of a match condition, a priority, and an action. Supported action types are `ALLOW`, `BLOCK`, and `LOG`. You can create a fully customized policy that meets your specific requirements for application protection by combining managed and custom rules.

The WAF processes rules within a policy in a priority order. Priority is a unique integer that defines the order of rules to process. A smaller integer value denotes a higher priority, and the WAF evaluates those rules before rules that have a higher integer value. After the WAF matches a rule with a request, it applies the corresponding action that the rule defines to the request. After the WAF processes such a match, rules that have lower priorities aren't processed further.

A web application that Application Gateway delivers can have a WAF policy associated with it at the global level, at a per-site level, or at a per-URI level.

### Custom rules

Application Gateway supports the creation of your own custom rules. Application Gateway evaluates custom rules for each request that passes through the WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. If a request meets a set of conditions, the WAF takes an action to allow or block. For more information on custom rules, see [Custom rules for Application Gateway](custom-waf-rules-overview.md).

The `Geomatch` operator is now available for custom rules. For more information, see [Geomatch custom rules](geomatch-custom-rules.md).

### Rule sets

Application Gateway supports multiple rule sets, including CRS 3.2, CRS 3.1, and CRS 3.0. These rules help protect your web applications from malicious activity. For more information, see [Web application firewall DRS and CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).

#### Bot Manager Rule Set

You can enable a managed Bot Manager Rule Set to take custom actions on requests from all bot categories.

Application Gateway supports three bot categories:

- **Bad bots**: Bots that have malicious IP addresses or that falsified their identities. Malicious IP addresses might be sourced from the Microsoft Threat Intelligence feed's high-confidence IP Indicators of Compromise and from IP reputation feeds. Bad bots also include bots that identify themselves as good bots but have IP addresses that don't belong to legitimate bot publishers.

- **Good bots**: Trusted user agents. Rules for good bots are sorted into multiple categories to provide granular control over WAF policy configuration. These categories include:

  - Verified search engine bots (such as Googlebot and Bingbot).
  - Validated link checker bots.
  - Verified social media bots (such as FacebookBot and LinkedInBot).
  - Verified advertising bots.
  - Verified content checker bots.
  - Validated miscellaneous bots.

- **Unknown bots**: User agents without additional validation. Unknown bots might also have malicious IP addresses that are sourced from the Microsoft Threat Intelligence feed's medium-confidence IP Indicators of Compromise.

Azure Web Application Firewall actively manages and dynamically updates the bot signatures.

When you turn on bot protection, it blocks, allows, or logs incoming requests that match bot rules based on the configured action. It blocks malicious bots, allows verified search engine crawlers, blocks unknown search engine crawlers, and logs unknown bots by default. You can set custom actions to block, allow, or log various types of bots.

You can access WAF logs from a storage account, an event hub, or Log Analytics. You can also send logs to a partner solution.

For more information about Application Gateway bot protection, see [Web Application Firewall on Application Gateway bot protection overview](bot-protection-overview.md).

### WAF modes

You can configure the Application Gateway WAF to run in the following modes:

- **Detection mode**: Monitors and logs all threat alerts. You turn on logging diagnostics for Application Gateway in the **Diagnostics** section. You must also make sure that the WAF log is selected and turned on. A web application firewall doesn't block incoming requests when it's operating in detection mode.
- **Prevention mode**: Blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

> [!NOTE]
> We recommend that you run a newly deployed WAF in detection mode for a short period in a production environment. Doing so provides the opportunity to obtain [firewall logs](../../application-gateway/application-gateway-diagnostics.md#firewall-log) and update any exceptions or [custom rules](./custom-waf-rules-overview.md) before transitioning to prevention mode. It also helps reduce the occurrence of unexpected blocked traffic.

### WAF engine

The WAF engine is the component that inspects traffic and detects whether a request contains a signature that indicates a potential attack. When you use CRS 3.2 or later, your web application firewall runs the new [WAF engine](waf-engine.md), which gives you higher performance and an improved set of features. When you use earlier versions of the CRS, your WAF runs on an older engine. New features are available only on the new WAF engine.

### WAF actions

You can choose which action the WAF runs when a request matches a rule condition. Application Gateway supports the following actions:

- **Allow**: The request passes through the WAF and is forwarded to the back end. No further lower-priority rules can block this request. These actions apply only to the Bot Manager Rule Set. They don't apply to the CRS.
- **Block**: The request is blocked. The WAF sends a response to the client without forwarding the request to the back end.
- **Log**: The request is logged in the WAF logs. The WAF continues to evaluate lower-priority rules.
- **Anomaly score**: This action is the default for the CRS. The total anomaly score is incremented when a request matches a rule with this action. Anomaly scoring doesn't apply to the Bot Manager Rule Set.

### Anomaly scoring mode

OWASP has two modes for deciding whether to block traffic: traditional and anomaly scoring.

In traditional mode, traffic that matches any rule is considered independently of any other rule matches. This mode is easy to understand, but the lack of information about how many rules match a specific request is a limitation. So, anomaly scoring mode was introduced as the default for OWASP 3.*x*.

In anomaly scoring mode, traffic that matches any rule isn't immediately blocked when the firewall is in prevention mode. Rules have a certain severity: **Critical**, **Error**, **Warning**, or **Notice**. That severity affects a numeric value for the request, which is the anomaly score. For example, one **Warning** rule match contributes 3 to the score. One **Critical** rule match contributes 5.

|Severity  |Value  |
|---------|---------|
|Critical     |5|
|Error        |4|
|Warning      |3|
|Notice       |2|

There's a threshold of 5 for the anomaly score to block traffic. So, a single **Critical** rule match is enough for the Application Gateway WAF to block a request in prevention mode. But one **Warning** rule match only increases the anomaly score by 3, which isn't enough by itself to block the traffic.

> [!NOTE]
> The message that's logged when a WAF rule matches traffic includes the action value **Matched**. If the total anomaly score of all matched rules is 5 or greater, and the WAF policy is running in prevention mode, the request triggers a mandatory anomaly rule with the action value **Blocked**, and the request is stopped. If the WAF policy is running in detection mode, the request triggers the action value **Detected**, and the request is logged and passed to the back end. For more information, see [Understand WAF logs](web-application-firewall-troubleshoot.md#understand-waf-logs).

### Configuration

You can configure and deploy all WAF policies by using the Azure portal, REST APIs, Azure Resource Manager templates, and Azure PowerShell. You can also configure and manage WAF policies at scale by using Azure Firewall Manager integration. For more information, see [Configure WAF policies using Azure Firewall Manager](../shared/manage-policies.md).

### WAF monitoring

Monitoring the health of your application gateway is important. You can achieve it by integrating your WAF (and the applications that it helps protect) with Microsoft Defender for Cloud, Azure Monitor, and Azure Monitor Logs.

:::image type="content" source="../media/ag-overview/diagnostics.png" alt-text="Diagram of Application Gateway WAF diagnostics.":::

#### Azure Monitor

Application Gateway logs are integrated with [Azure Monitor](/azure/azure-monitor/overview?toc=/azure/web-application-firewall/toc.json) so that you can track diagnostic information, including WAF alerts and logs. You can access this capability in the Azure portal, on the **Diagnostics** tab of the Application Gateway resource. Or you can access it directly in Azure Monitor.

To learn more about using logs, see [Diagnostic logs for Application Gateway](../../application-gateway/application-gateway-diagnostics.md).

#### Microsoft Defender for Cloud

[Defender for Cloud](../../security-center/security-center-introduction.md?toc=/azure/web-application-firewall/toc.json) helps you prevent, detect, and respond to threats. It provides increased visibility into, and control over, the security of your Azure resources. Application Gateway is [integrated with Defender for Cloud](../../security-center/security-center-partner-integration.md#integrated-azure-security-solutions).

Defender for Cloud scans your environment to detect unprotected web applications. It can recommend an Application Gateway WAF to help protect these vulnerable resources.

You create the firewalls directly from Defender for Cloud. These WAF instances are integrated with Defender for Cloud. They send alerts and health information to Defender for Cloud for reporting.

#### Microsoft Sentinel

[Microsoft Sentinel](../../sentinel/overview.md?toc=/azure/web-application-firewall/toc.json) is a scalable, cloud-native solution that encompasses security information event management (SIEM) and security orchestration automated response (SOAR). Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise. It provides a single solution for alert detection, threat visibility, proactive hunting, and threat response.

With the firewall events workbook built into Azure Web Application Firewall, you can get an overview of the security events on your WAF. The overview includes matched rules, blocked rules, and all other logged firewall activity.

#### Azure Monitor workbook for WAF

The Azure Monitor workbook for WAF enables custom visualization of security-relevant WAF events across several filterable panels. It works with all WAF types, including Application Gateway, Azure Front Door, and Azure Content Delivery Network.

You can filter this workbook based on WAF type or a specific WAF instance. You import it via Azure Resource Manager template or gallery template.

To deploy this workbook, see the [GitHub repository for Azure Web Application Firewall](https://aka.ms/AzWAFworkbook).

#### Logging

The Application Gateway WAF provides detailed reporting on each threat that it detects. Logging is integrated with Azure Diagnostics logs. Alerts are recorded in JSON format. You can integrate these logs with [Azure Monitor Logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics?toc=/azure/web-application-firewall/toc.json).

```json
{
  "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupId}/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/{appGatewayName}",
  "operationName": "ApplicationGatewayFirewall",
  "time": "2017-03-20T15:52:09.1494499Z",
  "category": "ApplicationGatewayFirewallLog",
  "properties": {
    {
      "instanceId": "ApplicationGatewayRole_IN_0",
      "clientIp": "203.0.113.145",
      "clientPort": "0",
      "requestUri": "/",
      "ruleSetType": "OWASP",
      "ruleSetVersion": "3.0",
      "ruleId": "920350",
      "ruleGroup": "920-PROTOCOL-ENFORCEMENT",
      "message": "Host header is a numeric IP address",
      "action": "Matched",
      "site": "Global",
      "details": {
        "message": "Warning. Pattern match \"^[\\\\d.:]+$\" at REQUEST_HEADERS:Host ....",
        "data": "127.0.0.1",
        "file": "rules/REQUEST-920-PROTOCOL-ENFORCEMENT.conf",
        "line": "791"
      },
      "hostname": "127.0.0.1",
      "transactionId": "16861477007022634343"
      "policyId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/drewRG/providers/Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/globalWafPolicy",
      "policyScope": "Global",
      "policyScopeName": " Global "
    }
  }
} 

```

## Application Gateway WAF pricing

The pricing models are different for the WAF_v1 and WAF_v2 versions. For more information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

## What's new

To learn what's new with Azure Web Application Firewall, see [Azure updates](https://azure.microsoft.com/updates?filters=%5B%22Web+Application+Firewall%22%5D).

## Related content

- [Azure Web Application Firewall DRS and CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md)
- [Custom rules for Azure Web Application Firewall v2 on Azure Application Gateway](custom-waf-rules-overview.md)
- [Azure Web Application Firewall on Azure Front Door](../afds/afds-overview.md)
- [Azure network security documentation](../../networking/security/index.yml)
