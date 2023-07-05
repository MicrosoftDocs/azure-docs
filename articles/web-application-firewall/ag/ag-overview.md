---
title: What is Azure Web Application Firewall on Azure Application Gateway?
titleSuffix: Azure Web Application Firewall
description: This article provides an overview of Web Application Firewall (WAF) on Application Gateway
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 11/08/2022
ms.author: victorh
ms.topic: conceptual
---

# What is Azure Web Application Firewall on Azure Application Gateway?

Azure Web Application Firewall (WAF) on Azure Application Gateway provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks.

WAF on Application Gateway is based on the [Core Rule Set (CRS)](application-gateway-crs-rulegroups-rules.md) from the Open Web Application Security Project (OWASP). 

All of the WAF features listed below exist inside of a WAF policy. You can create multiple policies, and they can be associated with an Application Gateway, to individual listeners, or to path-based routing rules on an Application Gateway. This way, you can have separate policies for each site behind your Application Gateway if needed. For more information on WAF policies, see [Create a WAF Policy](create-waf-policy-ag.md).

> [!Note]
> Application Gateway has two versions of the WAF sku: Application Gateway WAF_v1 and Application Gateway WAF_v2. WAF policy associations are only supported for the Application Gateway WAF_v2 sku.

![Application Gateway WAF diagram](../media/ag-overview/waf1.png)

Application Gateway operates as an application delivery controller (ADC). It offers Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), termination, cookie-based session affinity, round-robin load distribution, content-based routing, ability to host multiple websites, and security enhancements.

Application Gateway security enhancements include TLS policy management and end-to-end TLS support. Application security is strengthened by WAF integration into Application Gateway. The combination protects your web applications against common vulnerabilities. And it provides an easy-to-configure central location to manage.

## Benefits

This section describes the core benefits that WAF on Application Gateway provides.

### Protection

* Protect your web applications from web vulnerabilities and attacks without modification to back-end code.

* Protect multiple web applications at the same time. An instance of Application Gateway can host up to 40 websites that are protected by a web application firewall.

* Create custom WAF policies for different sites behind the same WAF.

* Protect your web applications from malicious bots with the IP Reputation ruleset.

* Protect your application against DDoS attacks. For more information, see [Application DDoS Protection](../shared/application-ddos-protection.md).

### Monitoring

* Monitor attacks against your web applications by using a real-time WAF log. The log is integrated with [Azure Monitor](../../azure-monitor/overview.md) to track WAF alerts and easily monitor trends.

* The Application Gateway WAF is integrated with Microsoft Defender for Cloud. Defender for Cloud provides a central view of the security state of all your Azure, hybrid, and multicloud resources.

### Customization

* Customize WAF rules and rule groups to suit your application requirements and eliminate false positives.

* Associate a WAF Policy for each site behind your WAF to allow for site-specific configuration

* Create custom rules to suit the needs of your application

## Features

- SQL injection protection.
- Cross-site scripting protection.
- Protection against other common web attacks, such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion.
- Protection against HTTP protocol violations.
- Protection against HTTP protocol anomalies, such as missing host user-agent and accept headers.
- Protection against crawlers and scanners.
- Detection of common application misconfigurations (for example, Apache and IIS).
- Configurable request size limits with lower and upper bounds.
- Exclusion lists let you omit certain request attributes from a WAF evaluation. A common example is Active Directory-inserted tokens that are used for authentication or password fields.
- Create custom rules to suit the specific needs of your applications.
- Geo-filter traffic to allow or block certain countries/regions from gaining access to your applications.
- Protect your applications from bots with the bot mitigation ruleset.
- Inspect JSON and XML in the request body

## WAF policy and rules

To enable a Web Application Firewall on Application Gateway, you must create a WAF policy. This policy is where all of the managed rules, custom rules, exclusions, and other customizations such as file upload limit exist.

You can configure a WAF policy and associate that policy to one or more application gateways for protection. A WAF policy consists of two types of security rules:

- Custom rules that you create

- Managed rule sets that are a collection of Azure-managed pre-configured set of rules

When both are present, custom rules are processed before processing the rules in a managed rule set. A rule is made of a match condition, a priority, and an action. Action types supported are: ALLOW, BLOCK, and LOG. You can create a fully customized policy that meets your specific application protection requirements by combining managed and custom rules.

Rules within a policy are processed in a priority order. Priority is a unique integer that defines the order of rules to process. Smaller integer value denotes a higher priority and those rules are evaluated before rules with a higher integer value. Once a rule is matched, the corresponding action that was defined in the rule is applied to the request. Once such a match is processed, rules with lower priorities aren't processed further.

A web application delivered by Application Gateway can have a WAF policy associated to it at the global level, at a per-site level, or at a per-URI level.

### Core rule sets

Application Gateway supports multiple rule sets, including CRS 3.2, CRS 3.1, and CRS 3.0. These rules protect your web applications from malicious activity.

For more information, see [Web application firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).

### Custom rules

Application Gateway also supports custom rules. With custom rules, you can create your own rules, which are evaluated for each request that passes through WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. If a set of conditions is met, an action is taken to allow or block. 

The geomatch operator is now available for custom rules. See [geomatch custom rules](custom-waf-rules-overview.md#geomatch-custom-rules) for more information.

For more information on custom rules, see [Custom Rules for Application Gateway.](custom-waf-rules-overview.md)

### Bot protection rule set

You can enable a managed bot protection rule set to take custom actions on requests from all bot   categories.

Three bot categories are supported:

- **Bad**

   Bad bots include bots from malicious IP addresses and bots that have falsified their identities. Bad bots with malicious IPs are sourced from the Microsoft Threat Intelligence feed’s high confidence IP Indicators of Compromise.
- **Good**

   Good bots include validated search engines such as Googlebot, bingbot, and other trusted user agents.

- **Unknown**

   Unknown bots are classified via published user agents without additional validation. For example, market analyzer, feed fetchers, and data collection agents. Unknown bots also include malicious IP addresses that are sourced from Microsoft Threat Intelligence feed’s medium confidence IP Indicators of Compromise.

Bot signatures are managed and dynamically updated by the WAF platform.

:::image type="content" source="../media/ag-overview/bot-rule-set.png" alt-text="Screenshot of bot rule set.":::

You may assign Microsoft_BotManagerRuleSet_1.0 by using the **Assign** option under **Managed Rulesets**:

:::image type="content" source="../media/ag-overview/assign-managed-rule-sets.png" alt-text="Screenshot of Assign managed rule sets.":::

If Bot protection is enabled, incoming requests that match bot rules are blocked, allowed, or logged based on the configured action. Malicious bots are blocked, verified search engine crawlers are allowed, unknown search engine crawlers are blocked, and unknown bots are logged by default. You can set custom actions to block, allow, or log  for different types of bots.

You can access WAF logs from a storage account, event hub, log analytics, or send logs to a partner solution.


### WAF modes

The Application Gateway WAF can be configured to run in the following two modes:

* **Detection mode**: Monitors and logs all threat alerts. You turn on logging diagnostics for Application Gateway in the **Diagnostics** section. You must also make sure that the WAF log is selected and turned on. Web application firewall doesn't block incoming requests when it's operating in Detection mode.
* **Prevention mode**: Blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

> [!NOTE]
> It is recommended that you run a newly deployed WAF in Detection mode for a short period of time in a production environment. This provides the opportunity to obtain [firewall logs](../../application-gateway/application-gateway-diagnostics.md#firewall-log) and update any exceptions or [custom rules](./custom-waf-rules-overview.md) prior to transition to Prevention mode. This can help reduce the occurrence of unexpected blocked traffic.

### WAF engines

The Azure web application firewall (WAF) engine is the component that inspects traffic and determines whether a request includes a signature that represents a potential attack. When you use CRS 3.2 or later, your WAF runs the new [WAF engine](waf-engine.md), which gives you higher performance and an improved set of features. When you use earlier versions of the CRS, your WAF runs on an older engine. New features will only be available on the new Azure WAF engine.

### WAF actions

WAF customers can choose which action is run when a request matches a rules conditions. Below is the listed of supported actions.

* Allow: Request passes through the WAF and is forwarded to back-end. No further lower priority rules can block this request. Allow actions are only applicable to the Bot Manager ruleset, and are not applicable to the Core Rule Set.
* Block: The request is blocked and WAF sends a response to the client without forwarding the request to the back-end.
* Log: Request is logged in the WAF logs and WAF continues evaluating lower priority rules.
* Anomaly score: This is the default action for CRS ruleset where total anomaly score is incremented when a rule with this action is matched. Anomaly scoring is not applicable for the Bot Manager ruleset.

### Anomaly Scoring mode

OWASP has two modes for deciding whether to block traffic: Traditional mode and Anomaly Scoring mode.

In Traditional mode, traffic that matches any rule is considered independently of any other rule matches. This mode is easy to understand. But the lack of information about how many rules match a specific request is a limitation. So, Anomaly Scoring mode was introduced. It's the default for OWASP 3.*x*.

In Anomaly Scoring mode, traffic that matches any rule isn't immediately blocked when the firewall is in Prevention mode. Rules have a certain severity: *Critical*, *Error*, *Warning*, or *Notice*. That severity affects a numeric value for the request, which is called the Anomaly Score. For example, one *Warning* rule match contributes 3 to the score. One *Critical* rule match contributes 5.

|Severity  |Value  |
|---------|---------|
|Critical     |5|
|Error        |4|
|Warning      |3|
|Notice       |2|

There's a threshold of 5 for the Anomaly Score to block traffic. So, a single *Critical* rule match is enough for the Application Gateway WAF to block a request, even in Prevention mode. But one *Warning* rule match only increases the Anomaly Score by 3, which isn't enough by itself to block the traffic.

> [!NOTE]
> The message that's logged when a WAF rule matches traffic includes the action value "Matched." If the total anomaly score of all matched rules is 5 or greater, and the WAF policy is running in Prevention mode, the request will trigger a mandatory anomaly rule with the action value "Blocked" and the request will be stopped. However, if the WAF policy is running in Detection mode, the request will trigger the action value "Detected" and the request will be logged and passed to the backend. For more information, see [Troubleshoot Web Application Firewall (WAF) for Azure Application Gateway](web-application-firewall-troubleshoot.md#understanding-waf-logs). 

### Configuration

You can configure and deploy all WAF policies using the Azure portal, REST APIs, Azure Resource Manager templates, and Azure PowerShell. You can also configure and manage Azure WAF policies at scale using Firewall Manager integration (preview). For more information, see [Use Azure Firewall Manager to manage Web Application Firewall policies (preview)](../shared/manage-policies.md).

### WAF monitoring

Monitoring the health of your application gateway is important. Monitoring the health of your WAF and the applications that it protects are supported by integration with Microsoft Defender for Cloud, Azure Monitor, and Azure Monitor logs.

![Diagram of Application Gateway WAF diagnostics](../media/ag-overview/diagnostics.png)

#### Azure Monitor

Application Gateway logs are integrated with [Azure Monitor](../../azure-monitor/overview.md). This allows you to track diagnostic information, including WAF alerts and logs. You can access this capability on the **Diagnostics** tab in the Application Gateway resource in the portal or directly through Azure Monitor. To learn more about enabling logs, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md).

#### Microsoft Defender for Cloud

[Defender for Cloud](../../security-center/security-center-introduction.md) helps you prevent, detect, and respond to threats. It provides increased visibility into and control over the security of your Azure resources. Application Gateway is [integrated with Defender for Cloud](../../security-center/security-center-partner-integration.md#integrated-azure-security-solutions). Defender for Cloud scans your environment to detect unprotected web applications. It can recommend Application Gateway WAF to protect these vulnerable resources. You create the firewalls directly from Defender for Cloud. These WAF instances are integrated with Defender for Cloud. They send alerts and health information to Defender for Cloud for reporting.

![Defender for Cloud overview window](../media/ag-overview/figure1.png)

#### Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

With the built-in Azure WAF firewall events workbook, you can get an overview of the security events on your WAF. This includes events, matched and blocked rules, and everything else that gets logged in the firewall logs. See more on logging below. 


![Azure WAF firewall events workbook](../media/ag-overview/sentinel.png)


#### Azure Monitor Workbook for WAF

This workbook enables custom visualization of security-relevant WAF events across several filterable panels. It works with all WAF types, including Application Gateway, Front Door, and CDN, and can be filtered based on WAF type or a specific WAF instance. Import via ARM Template or Gallery Template. To deploy this workbook, see [WAF Workbook](https://aka.ms/AzWAFworkbook).

#### Logging

Application Gateway WAF provides detailed reporting on each threat that it detects. Logging is integrated with Azure Diagnostics logs. Alerts are recorded in the .json format. These logs can be integrated with [Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics).

![Application Gateway diagnostics logs windows](../media/ag-overview/waf2.png)

```json
{
  "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupId}/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/{appGatewayName}",
  "operationName": "ApplicationGatewayFirewall",
  "time": "2017-03-20T15:52:09.1494499Z",
  "category": "ApplicationGatewayFirewallLog",
  "properties": {
    {
      "instanceId": "ApplicationGatewayRole_IN_0",
      "clientIp": "52.161.109.145",
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
      "policyId": "/subscriptions/1496a758-b2ff-43ef-b738-8e9eb5161a86/resourceGroups/drewRG/providers/Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/globalWafPolicy",
      "policyScope": "Global",
      "policyScopeName": " Global "
    }
  }
} 

```

## Application Gateway WAF SKU pricing

The pricing models are different for the WAF_v1 and WAF_v2 SKUs. Please see the [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/) page to learn more. 

## What's new

To learn what's new with Azure Web Application Firewall, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Web%20Application%20Firewall).

## Next steps

- Learn more about [WAF managed rules](application-gateway-crs-rulegroups-rules.md)
- Learn more about [Custom Rules](custom-waf-rules-overview.md)
- Learn about [Web Application Firewall on Azure Front Door](../afds/afds-overview.md)
- [Learn more about Azure network security](../../networking/security/index.yml)
