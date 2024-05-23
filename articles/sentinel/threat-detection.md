---
title: Threat detection in Microsoft Sentinel | Microsoft Docs
description: Understand how threat detection works in Microsoft Sentinel. Learn about different types of analytics rules and templates, and the generation of alerts and incidents.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/23/2024
---

# Threat detection in Microsoft Sentinel

After [setting up Microsoft Sentinel to collect data from all over your organization](connect-data-sources.md), you need to constantly dig through all that data to detect security threats to your environment. To accomplish this task, Microsoft Sentinel provides threat detection rules that run regularly, querying the collected data and analyzing it to discover threats. These rules come in a few different flavors and are collectively known as **analytics rules**.

You can create these rules from scratch, using the [built-in analytics rule wizard](analytics-rules-reference.md). However, Microsoft strongly encourages you to make use of the vast array of [**analytics rule templates**](create-analytics-rules.md#create-a-rule-from-a-template) available to you through the many [solutions for Microsoft Sentinel provided in the Content hub](sentinel-solutions.md). These templates are pre-built rule prototypes, designed by teams of security experts and analysts based on their knowledge of known threats, common attack vectors, and suspicious activity escalation chains. You activate rules from these templates to automatically search across your environment for any activity that looks suspicious. Many of the templates can be customized to search for specific types of events, or filter them out, according to your needs.

These rules generate ***alerts*** when they find what they’re looking for. Alerts contain information about the events detected, such as the entities (users, devices, addresses, and other items) involved. Alerts are aggregated and correlated into ***incidents***&mdash;case files&mdash;that you can assign and investigate to learn the full extent of the detected threat and respond accordingly.

This article helps you understand how Microsoft Sentinel detects threats, and what happens next.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Types of analytics rules

You can view the analytics rules and templates available for you to use on the **Analytics** page of the **Configuration** menu in Microsoft Sentinel. The currently **active rules** are visible in one tab, and **templates** to create new rules in another tab. A third tab displays **Anomalies**, a special rule type described later in this article.

To find more rule templates than are currently displayed, go to the **Content hub** in Microsoft Sentinel to install the related product solutions or standalone content. Analytics rule templates are available with nearly every product solution in the content hub.

The following types of analytics rules and rule templates are available in Microsoft Sentinel:
- [Scheduled rules](#scheduled-rules)
- [Near-real-time (NRT) rules](#near-real-time-nrt-rules)
- [Anomaly rules](#anomaly-rules)
- [Microsoft security rules](#microsoft-security-rules)

Besides the preceding rule types, there are some other specialized template types that can each create one instance of a rule, with limited configuration options:
- [Threat intelligence](#threat-intelligence)
- [Advanced multistage attack detection ("Fusion")](#advanced-multistage-attack-detection)
- [Machine learning (ML) behavior analytics](#machine-learning-ml-behavior-analytics)

<a name="scheduled"></a>

### Scheduled rules 

By far the most common type of analytics rule, **Scheduled** rules are based on [Kusto queries](kusto-overview.md) that are configured to run at regular intervals and examine raw data from a defined "lookback" period. If the number of results captured by the query passes the threshold configured in the rule, the rule produces an alert.

#### Scheduled query logic

The queries in scheduled rule templates were written by security and data science experts, either from Microsoft or from the vendor of the solution providing the template. Queries can perform complex statistical operations on their target data, revealing baselines and outliers in groups of events.

The query logic is displayed in the rule configuration. You can use the query logic and the scheduling and lookback settings as defined in the template, or customize them to create new rules.

***(REMOVE THIS ALTOGETHER?)***  
Some scheduled analytics rule templates produce alerts that are correlated by the Fusion engine with alerts from other systems to produce high-fidelity incidents. For more information, see [Advanced multistage attack detection](configure-fusion-rules.md#configure-scheduled-analytics-rules-for-fusion-detections).

> [!TIP]
> Rule scheduling options include configuring the rule to run every specified number of minutes, hours, or days, with the clock starting when you enable the rule. 
>
> We recommend being mindful of when you enable a new or edited analytics rule to ensure that the rules get the new stack of incidents in time. For example, you might want to run a rule in synch with when your SOC analysts begin their workday, and enable the rules then.

#### Alert enhancement

If you want your alerts to surface their findings so that they can be tracked and investigated appropriately, use the alert enhancement configuration to surface all the important information in the alerts.

This alert enhancement has the added benefit of presenting findings in an easily visible and accessible way.



| Rule type | Description |
| --------- | --------- |
| **Microsoft security** | Microsoft security templates automatically create Microsoft Sentinel incidents from the alerts generated in other Microsoft security solutions, in real time. You can use Microsoft security rules as a template to create new rules with similar logic. <br><br>For more information about security rules, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md). |
| <a name="fusion"></a>**Fusion**<br>(some detections in Preview) | Microsoft Sentinel uses the Fusion correlation engine, with its scalable machine learning algorithms, to detect advanced multistage attacks by correlating many low-fidelity alerts and events across multiple products into high-fidelity and actionable incidents. Fusion is enabled by default. Because the logic is hidden and therefore not customizable, you can only create one rule with this template. <br><br>The Fusion engine can also correlate alerts produced by [scheduled analytics rules](#scheduled) with alerts from other systems, producing high-fidelity incidents as a result. |
| **Machine learning (ML) behavioral analytics** | ML behavioral analytics templates are based on proprietary Microsoft machine learning algorithms, so you can't see the internal logic of how they work and when they run. <br><br>Because the logic is hidden and therefore not customizable, you can only create one rule with each template of this type. |
| **Threat Intelligence** | Take advantage of threat intelligence produced by Microsoft to generate high fidelity alerts and incidents with the **Microsoft Threat Intelligence Analytics** rule. This unique rule isn't customizable, but when enabled, automatically matches Common Event Format (CEF) logs, Syslog data or Windows DNS events with domain, IP and URL threat indicators from Microsoft Threat Intelligence. Certain indicators contain more context information through MDTI (**Microsoft Defender Threat Intelligence**).<br><br>For more information on how to enable this rule, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).<br>For more information on MDTI, see [What is Microsoft Defender Threat Intelligence](/../defender/threat-intelligence/what-is-microsoft-defender-threat-intelligence-defender-ti)
| <a name="anomaly"></a>**Anomaly** | Anomaly rule templates use machine learning to detect specific types of anomalous behavior. Each rule has its own unique parameters and thresholds, appropriate to the behavior being analyzed. <br><br>While the configurations of out-of-the-box rules can't be changed or fine-tuned, you can duplicate a rule, and then change and fine-tune the duplicate. In such cases, run the duplicate in **Flighting** mode and the original concurrently in **Production** mode. Then compare results, and switch the duplicate to **Production** if and when its fine-tuning is to your liking. <br><br>For more information, see [Use customizable anomalies to detect threats in Microsoft Sentinel](soc-ml-anomalies.md) and [Work with anomaly detection analytics rules in Microsoft Sentinel](work-with-anomaly-rules.md). |
| <a name="scheduled"></a>**Scheduled** | Scheduled analytics rules are based on queries written by Microsoft security experts. You can see the query logic and make changes to it. You can use the scheduled rules template and customize the query logic and scheduling settings to create new rules. <br><br>Several new scheduled analytics rule templates produce alerts that are correlated by the Fusion engine with alerts from other systems to produce high-fidelity incidents. For more information, see [Advanced multistage attack detection](configure-fusion-rules.md#configure-scheduled-analytics-rules-for-fusion-detections).<br><br>**Tip**: Rule scheduling options include configuring the rule to run every specified number of minutes, hours, or days, with the clock starting when you enable the rule. <br><br>We recommend being mindful of when you enable a new or edited analytics rule to ensure that the rules get the new stack of incidents in time. For example, you might want to run a rule in synch with when your SOC analysts begin their workday, and enable the rules then.|
| <a name="nrt"></a>**Near-real-time (NRT)** | NRT rules are limited set of scheduled rules, designed to run once every minute, in order to supply you with information as up-to-the-minute as possible. <br><br>They function mostly like scheduled rules and are configured similarly, with some limitations. For more information, see [Detect threats quickly with near-real-time (NRT) analytics rules in Microsoft Sentinel](near-real-time-rules.md). |


> [!IMPORTANT]
> Some of the **Fusion** detection templates are currently in **PREVIEW** (see [Advanced multistage attack detection in Microsoft Sentinel](fusion.md) to see which ones). See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Use analytics rule templates

This procedure describes how to use analytics rules templates.

**To use an analytics rule template**:

1. In the Microsoft Sentinel > **Analytics** > **Rule templates** page, select a template name, and then select the **Create rule** button on the details pane to create a new active rule based on that template. 

    Each template has a list of required data sources. When you open the template, the data sources are automatically checked for availability. If there's an availability issue, the **Create rule** button may be disabled, or you may see a warning to that effect.

    :::image type="content" source="media/tutorial-detect-built-in/use-built-in-template.png" alt-text="Detection rule preview panel":::

1. Selecting **Create rule** opens the rule creation wizard based on the selected template. All the details are autofilled, and with the **Scheduled** or **Microsoft security** templates, you can customize the logic and other rule settings to better suit your specific needs. You can repeat this process to create more rules based on the template. After following the steps in the rule creation wizard to the end, you finished creating a rule based on the template. The new rules appear in the **Active rules** tab.

    For more details on how to customize your rules in the rule creation wizard, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

> [!TIP]
> - Make sure that you **enable all rules associated with your connected data sources** in order to ensure full security coverage for your environment. The most efficient way to enable analytics rules is directly from the data connector page, which lists any related rules. For more information, see [Connect data sources](connect-data-sources.md).
> 
> - You can also **push rules to Microsoft Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0)**, although doing so requires additional effort. 
> 
>     When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Microsoft Sentinel with identical settings in each instance.

### Access permissions for analytics rules

When you create an analytics rule, an access permissions token is applied to the rule and saved along with it. This token ensures that the rule can access the workspace that contains the data queried by the rule, and that this access will be maintained even if the rule's creator loses access to that workspace.

There is one exception to this, however: when a rule is created to access workspaces in other subscriptions or tenants, such as what happens in the case of an MSSP, Microsoft Sentinel takes extra security measures to prevent unauthorized access to customer data. For these kinds of rules, the credentials of the user that created the rule are applied to the rule instead of an independent access token, so that when the user no longer has access to the other subscription or tenant, the rule stops working.

If you operate Microsoft Sentinel in a cross-subscription or cross-tenant scenario, when one of your analysts or engineers loses access to a particular workspace, any rules created by that user stops working. You will get a health monitoring message regarding "insufficient access to resource", and the rule will be [auto-disabled](troubleshoot-analytics-rules.md#issue-a-scheduled-rule-failed-to-execute-or-appears-with-auto-disabled-added-to-the-name) after having failed a certain number of times.

## Export rules to an ARM template

You can easily [export your rule to an Azure Resource Manager (ARM) template](import-export-analytics-rules.md) if you want to manage and deploy your rules as code. You can also import rules from template files in order to view and edit them in the user interface.

## Next steps

- To create custom rules, use existing rules as templates or references. Using existing rules as a baseline helps by building out most of the logic before you make any changes needed. For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

- To learn how to automate your responses to threats, [Set up automated threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).

- To learn how to find more rule templates, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).
