---
title: Introduction to Azure Web Application Firewall on Azure Application Gateway
description: This article provides an overview of web application firewall (WAF) on Application Gateway
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 08/15/2019
ms.author: victorh
ms.topic: overview
---

# Azure Web Application Firewall on Azure Application Gateway

Azure Web Application Firewall (WAF) on Azure Application Gateway provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks.

WAF on Application Gateway is based on [Core Rule Set (CRS)](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project) 3.1, 3.0 or 2.2.9 from the Open Web Application Security Project (OWASP). The WAF automatically updates to include protection against new vulnerabilities, with no additional configuration needed.

![Application Gateway WAF diagram](../media/ag-overview/WAF1.png)

Application Gateway operates as an application delivery controller (ADC). It offers Secure Sockets Layer (SSL) termination, cookie-based session affinity, round-robin load distribution, content-based routing, ability to host multiple websites, and security enhancements.

Application Gateway security enhancements include SSL policy management and end-to-end SSL support. Application security is strengthened by WAF integration into Application Gateway. The combination protects your web applications against common vulnerabilities. And it provides an easy-to-configure central location to manage.

## Benefits

This section describes the core benefits that WAF on Application Gateway provides.

### Protection

* Protect your web applications from web vulnerabilities and attacks without modification to back-end code.

* Protect multiple web applications at the same time. An instance of Application Gateway can host of up to 100 websites that are protected by a web application firewall.

### Monitoring

* Monitor attacks against your web applications by using a real-time WAF log. The log is integrated with [Azure Monitor](../../azure-monitor/overview.md) to track WAF alerts and easily monitor trends.

* The Application Gateway WAF is integrated with Azure Security Center. Security Center provides a central view of the security state of all your Azure resources.

### Customization

* You can customize WAF rules and rule groups to suit your application requirements and eliminate false positives.

## Features

- SQL-injection protection.
- Cross-site scripting protection.
- Protection against other common web attacks, such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion.
- Protection against HTTP protocol violations.
- Protection against HTTP protocol anomalies, such as missing host user-agent and accept headers.
- Protection against bots, crawlers, and scanners.
- Detection of common application misconfigurations (for example, Apache and IIS).
- Configurable request size limits with lower and upper bounds.
- Exclusion lists let you omit certain request attributes from a WAF evaluation. A common example is Active Directory-inserted tokens that are used for authentication or password fields.

### Core rule sets

Application Gateway supports three rule sets: CRS 3.1, CRS 3.0, and CRS 2.2.9. These rules protect your web applications from malicious activity.

For more information, see [Web application firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).

### WAF modes

The Application Gateway WAF can be configured to run in the following two modes:

* **Detection mode**: Monitors and logs all threat alerts. You turn on logging diagnostics for Application Gateway in the **Diagnostics** section. You must also make sure that the WAF log is selected and turned on. Web application firewall doesn't block incoming requests when it's operating in Detection mode.
* **Prevention mode**: Blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is terminated. Prevention mode records such attacks in the WAF logs.

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
> The message that's logged when a WAF rule matches traffic includes the action value "Blocked." But the traffic is actually only blocked for an Anomaly Score of 5 or higher.  

### WAF monitoring

Monitoring the health of your application gateway is important. Monitoring the health of your WAF and the applications that it protects is supported by integration with Azure Security Center, Azure Monitor, and Azure Monitor logs.

![Diagram of Application Gateway WAF diagnostics](../media/ag-overview/diagnostics.png)

#### Azure Monitor

Application Gateway logs are integrated with [Azure Monitor](../../azure-monitor/overview.md). This allows you to track diagnostic information, including WAF alerts and logs. You can access this capability on the **Diagnostics** tab in the Application Gateway resource in the portal or directly through Azure Monitor. To learn more about enabling logs, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md).

#### Azure Security Center

[Security Center](../../security-center/security-center-intro.md) helps you prevent, detect, and respond to threats. It provides increased visibility into and control over the security of your Azure resources. Application Gateway is [integrated with Security Center](../../application-gateway/application-gateway-integration-security-center.md). Security Center scans your environment to detect unprotected web applications. It can recommend Application Gateway WAF to protect these vulnerable resources. You create the firewalls directly from Security Center. These WAF instances are integrated with Security Center. They send alerts and health information to Security Center for reporting.

![Security Center overview window](../media/ag-overview/figure1.png)

#### Logging

Application Gateway WAF provides detailed reporting on each threat that it detects. Logging is integrated with Azure Diagnostics logs. Alerts are recorded in the .json format. These logs can be integrated with [Azure Monitor logs](../../azure-monitor/insights/azure-networking-analytics.md).

![Application Gateway diagnostics logs windows](../media/ag-overview/waf2.png)

```json
{
  "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupId}/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/{appGatewayName}",
  "operationName": "ApplicationGatewayFirewall",
  "time": "2017-03-20T15:52:09.1494499Z",
  "category": "ApplicationGatewayFirewallLog",
  "properties": {
    "instanceId": "ApplicationGatewayRole_IN_0",
    "clientIp": "104.210.252.3",
    "clientPort": "4835",
    "requestUri": "/?a=%3Cscript%3Ealert(%22Hello%22);%3C/script%3E",
    "ruleSetType": "OWASP",
    "ruleSetVersion": "3.0",
    "ruleId": "941320",
    "message": "Possible XSS Attack Detected - HTML Tag Handler",
    "action": "Blocked",
    "site": "Global",
    "details": {
      "message": "Warning. Pattern match \"<(a|abbr|acronym|address|applet|area|audioscope|b|base|basefront|bdo|bgsound|big|blackface|blink|blockquote|body|bq|br|button|caption|center|cite|code|col|colgroup|comment|dd|del|dfn|dir|div|dl|dt|em|embed|fieldset|fn|font|form|frame|frameset|h1|head|h ...\" at ARGS:a.",
      "data": "Matched Data: <script> found within ARGS:a: <script>alert(\\x22hello\\x22);</script>",
      "file": "rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf",
      "line": "865"
    }
  }
} 

```

## Application Gateway WAF SKU pricing

The Application Gateway WAF is available under a new a SKU. This SKU is available only in the Azure Resource Manager provisioning model, not in the classic deployment model. Additionally, the WAF SKU comes only in medium and large Application Gateway instance sizes. All the limits for Application Gateway also apply to the WAF SKU.

Pricing is based on an hourly gateway instance charge and a data-processing charge. [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/) for the WAF SKU differs from standard SKU charges. Data-processing charges are the same. There are no per-rule or rule-group charges. You can protect multiple web applications behind the same web application firewall. You aren't charged for supporting multiple applications.

## Next steps

- Learn about [Web Application Firewall on Azure Front Door](../afds/afds-overview.md)
