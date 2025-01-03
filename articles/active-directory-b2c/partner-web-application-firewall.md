---
title: Tutorial to configure Azure Active Directory B2C with Azure Web Application Firewall
titleSuffix: Azure AD B2C
description: Learn to configure Azure AD B2C with Azure Web Application Firewall to protect applications from malicious attacks 
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: azure-active-directory
ms.topic: how-to
ms.date: 10/29/2024
ms.author: gasinh
ms.subservice: b2c

# Customer intent: I'm a developer configuring Azure Active Directory B2C with Azure Web Application Firewall. I want to enable the WAF service for my B2C tenant with a custom domain, so I can protect my web applications from common exploits and vulnerabilities.

---

# Tutorial: Configure Azure Active Directory B2C with Azure Web Application Firewall

Learn how to enable the Azure Web Application Firewall (WAF) service for an Azure Active Directory B2C (Azure AD B2C) tenant with a custom domain. WAF protects web applications from common exploits and vulnerabilities such as cross-site scripting, DDoS attacks, and malicious bot activity.

See [What is Azure Web Application Firewall?](../web-application-firewall/overview.md)

## Prerequisites

To get started, you need:

* An Azure subscription
* If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* **An Azure AD B2C tenant** – authorization server that verifies user credentials using custom policies defined in the tenant
  * Also known as the identity provider (IdP)
  * See [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) 
* **Azure Front Door premium** – enables custom domains for the Azure AD B2C tenant and is security optimized with access to WAF managed rulesets
  * See [Azure Front Door and CDN documentation](../frontdoor/index.yml)
* **WAF** – manages traffic sent to the authorization server
  * [Azure Web Application Firewall](https://azure.microsoft.com/services/web-application-firewall/#overview) (requires Premium SKU)

## Custom domains in Azure AD B2C

To use custom domains in Azure AD B2C, use the custom domain features in Azure Front Door. See [Enable custom domains for Azure AD B2C](./custom-domain.md?pivots=b2c-user-flow).

> [!IMPORTANT]
> After you configure the custom domain, see [Test your custom domain](./custom-domain.md?pivots=b2c-custom-policy#test-your-custom-domain).

## Enable WAF

To enable WAF, configure a WAF policy and associate it with your Azure Front Door premium for protection. Azure Front Door premium comes optimized for security and gives you access to rulesets managed by Azure that protect against common vulnerabilities and exploits including cross site scripting and Java exploits. The WAF provides rulesets that help protect you against malicious bot activity. The WAF offers you layer 7 DDoS protection for your application.

### Create a WAF policy

Create a WAF policy with Azure-managed default rule set (DRS). See [Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.
1. Search for Azure WAF. 
1. Select the **Azure Service Web Application Firewall (WAF) from Microsoft**.
1. Select **Create**.
1. Go to the **Create a WAF policy** page.
1. Select the **Basics** tab. 
1. For **Policy for**, select **Global WAF (Front Door)**.
1. For **Front Door SKU**, select the **Premium** SKU.
1. For **Subscription**, select your Front Door subscription name.
1. For **Resource group**, select your Front Door resource group name.
1. For **Policy name**, enter a unique name for your WAF policy.
1. For **Policy state**, select **Enabled**.
1. For **Policy mode**, select **Detection**.
1. Go to the **Association** tab of the Create a WAF policy page.
1. Select **+ Associate a Front Door profile**.
1. For **Front Door**, select your Front Door name associated with Azure AD B2C custom domain.
1. For **Domains**, select the Azure AD B2C custom domains to associate the WAF policy to.
1. Select **Add**.
1. Select **Review + create**.
1. Select **Create**.

### Default Ruleset

When you create a new WAF policy for Azure Front Door, it automatically deploys with the latest version of Azure-managed default ruleset (DRS). This ruleset protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Because Azure manages these rule sets, the rules are updated as needed to protect against new attack signatures. The DRS includes the Microsoft Threat Intelligence Collection rules that are written in partnership with the Microsoft Intelligence team to provide increased coverage, patches for specific vulnerabilities, and better false positive reduction.

Learn more: [Azure Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md#default-rule-sets)

### Bot Manager Ruleset

By default, the Azure Front Door WAF deploys with the latest version of Azure-managed Bot Manager ruleset. This ruleset categorizes bot traffic into good, bad, and unknown bots. The bot signatures behind this ruleset are managed by the WAF platform and are updated dynamically.

Learn more: [What is Azure Web Application Firewall on Azure Front Door?](../web-application-firewall/afds/afds-overview.md#bot-protection-rule-set)

### Rate Limiting

Rate limiting enables you to detect and block abnormally high levels of traffic from any socket IP address. By using Azure WAF in Azure Front Door, you can mitigate some types of denial-of-service attacks. Rate limiting protects you against clients that were accidentally misconfigured to send large volumes of requests in a short time period. Rate limiting must be configured manually on the WAF using custom rules.

Learn more:
- [Web application firewall rate limiting for Azure Front Door](../web-application-firewall/afds/waf-front-door-rate-limit.md)
- [Configure a WAF rate-limit rule for Azure Front Door](../web-application-firewall/afds/waf-front-door-rate-limit-configure.md)

### Detection and Prevention modes

When you create a WAF policy, the policy starts in **Detection mode**. We recommend you leave the WAF policy in **Detection mode** while you tune the WAF for your traffic. In this mode, WAF doesn't block requests. Instead, requests that match the WAF rules are logged by the WAF once logging is enabled.

Enable logging: [Azure Web Application Firewall monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md#logs-and-diagnostics)

Once logging is enabled, and your WAF starts receiving request traffic, you can begin tuning your WAF by looking through your logs.

Learn more: [Tune Azure Web Application Firewall for Azure Front Door](../web-application-firewall/afds/waf-front-door-tuning.md)

The following query shows the requests blocked by the WAF policy in the past 24 hours. The details include, rule name, request data, action taken by the policy, and the policy mode.

```json
AzureDiagnostics
| where TimeGenerated >= ago(24h)
| where Category == "FrontdoorWebApplicationFirewallLog"
| where action_s == "Block"
| project RuleID=ruleName_s, DetailMsg=details_msg_s, Action=action_s, Mode=policyMode_s, DetailData=details_data_s
```

|RuleID|DetailMsg|Action|Mode|DetailData|
|---|---|---|---|---|
|DefaultRuleSet-1.0-SQLI-942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|Block|detection|Matched Data: CfDJ8KQ8bY6D|

Review the WAF logs to determine if policy rules cause false positives. Then, exclude the WAF rules based on the WAF logs.

Learn more
- [Configure WAF exclusion lists for Azure Front Door](../web-application-firewall/afds/waf-front-door-exclusion-configure.md)
- [Web application firewall exclusion lists in Azure Front Door](../web-application-firewall/afds/waf-front-door-exclusion.md)
 
Once logging is set up and your WAF is receiving traffic, you can assess the effectiveness of your bot manager rules in handling bot traffic. The following query shows the actions taken by your bot manager ruleset, categorized by bot type. While in **Detection mode**, the WAF logs bot traffic actions only. However, once switched to prevention mode, the WAF begins actively blocking unwanted bot traffic.

```json
AzureDiagnostics
| where Category == "FrontDoorWebApplicationFirewallLog"
| where action_s in ("Log", "Allow", "Block", "JSChallenge", "Redirect") and ruleName_s contains "BotManager"
| extend RuleGroup = extract("Microsoft_BotManagerRuleSet-[\\d\\.]+-(.*?)-Bot\\d+", 1, ruleName_s)
| extend RuleGroupAction = strcat(RuleGroup, " - ", action_s)
| summarize Hits = count() by RuleGroupAction, bin(TimeGenerated, 30m)
| project TimeGenerated, RuleGroupAction, Hits
| render columnchart kind=stacked
```

#### Switching modes

To see WAF take action on request traffic, select **Switch to prevention mode** from the Overview page, which changes the mode from Detection to Prevention. Requests that match the rules in the DRS are blocked and logged in the WAF logs. The WAF takes the prescribed action when a request matches one, or more, rules in the DRS and logs the results. By default, the DRS is set to anomaly scoring mode; this means that the WAF doesn't take any action on a request unless the anomaly score threshold is met.

Learn more: Anomaly scoring [Azure Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md#anomaly-scoring-mode)

To revert to **Detection mode**, select **Switch to detection mode** from the Overview page.

## Next steps

- [Best practices for Azure Web Application Firewall in Azure Front Door](../web-application-firewall/afds/waf-front-door-best-practices.md)
- [Manage Web Application Firewall policies](../firewall-manager/manage-web-application-firewall-policies.md)
- [Tune Azure Web Application Firewall for Azure Front Door](../web-application-firewall/afds/waf-front-door-tuning.md)
