---
title: Migrate to Azure Sentinel from an existing SIEM.
description: Learn how to best migrate from an existing SIEM to Azure Sentinel, for scalable, intelligent security analytics across your organization.
services: sentinel
documentationcenter: na
author: batamig
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 07/04/2021
ms.author: bagol
---

# Migrate to Azure Sentinel from an existing SIEM

Your security operations center (SOC) team will use centralized security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solutions to protect your increasingly decentralized digital estate.

Legacy SIEMs are often on-premises, and can maintain good coverage of your on-premises assets. However, on-premises architectures may have insufficient coverage for your cloud assets, such as in Azure, Microsoft 365, AWS, or Google Cloud Platform (GCP). In contrast, Azure Sentinel can ingest data from both on-premises and cloud assets, ensuring coverage over your entire estate.

This article describes how to migrate from an existing, legacy SIEM to Azure Sentinel, either in a side-by-side configuration or by transitioning to a full Azure Sentinel deployment.

## Plan your migration

You may have decided to start a direct or gradual transition to Azure Sentinel, depending on your business needs and available resources.

You'll want to plan your migration properly to ensure that transition doesn't introduce gaps in coverage, which could put your organization's security in jeopardy.

To start, identify your key core capabilities and first-priority requirements. Evaluate the key use cases your current SIEM covers, and decide which detections and capabilities where Azure Sentinel needs to continue providing coverage.

You'll add more in-process planning at each step of your migration process, as you consider the exact data sources and detection rules you want to migrate. For more information, see [Migrate your data](#migrate-your-data) and [Migrate analytics rules](#migrate-analytics-rules).

> [!TIP]
> Your current SIEM may have an overwhelming number of detections and use cases. Decide which ones are most useful to your business and determine which ones may not need to be migrated. For example, check to see which detections produced results within the past year.
>

### Compare your legacy SIEM to Azure Sentinel

Compare your legacy SIEM to Azure Sentinel to help refine your migration completion criteria, and understand where you can extract more value with Azure Sentinel.

For example, evaluate the following key areas:

|Evaluation area |Description  |
|---------|---------|
|**Attack detection coverage.**     | Compare how well each SIEM can detect the full range of attacks, using [MITRE ATT&CK](https://attack.mitre.org/) or a similar framework.        |
|**Responsiveness.**     |   Measure the mean time to acknowledge (MTTA), which is the time between an alert appearing in the SIEM and an analyst starting work on it. This time will probably be similar between SIEMs.      |
|**Mean time to remediate (MTTR).**     |    Compare the MTTR for incidents investigated by each SIEM, assuming analysts at equivalent skill levels.     |
|**Hunting speed and agility.**     | Measure how fast teams can hunt, starting from a fully formed hypothesis, to querying the data, to getting the results on each SIEM platform.        |
|**Capacity growth friction.**     |  Compare the level of difficulty in adding capacity as usage grows. Keep in mind that cloud services and applications tend to generate more log data than traditional on-premises workloads.       |
|     |         |

If you have limited or no investment in an existing on-premises SIEM, moving to Azure Sentinel can be a straightforward, direct deployment. However, enterprises that are heavily invested in a legacy SIEM typically require a multi-stage process to accommodate transition tasks.

Although Azure Sentinel provides extended data and response for both on-premises the cloud, you may want to start your migration slowly, by running Azure Sentinel and your legacy SIEM [side-by-side](#select-a-side-by-side-approach-and-method). In a side-by-side architecture local resources can use the on-premises SIEM and cloud resources and new workloads use cloud-based analytics.

Unless you choose a long-term side-by-side configuration, complete your migration to a full Azure Sentinel deployment to access lower infrastructure costs, real-time threat analysis, and cloud-scalability.

## Select a side-by-side approach and method

Use a side-by-side architecture either as a short-term, transitional phase that leads to a completely cloud-hosted SIEM, or as a medium- to long-term operational model, depending on the SIEM needs of your organization.

For example, while the recommended architecture is to use a side-by-side architecture just long enough to complete the migration, your organization may want stay with your side-by-side configuration for longer, such as if you aren't ready to move away from your legacy SIEM. Typically, organizations who use a long-term, side-by-side configuration use Azure Sentinel to analyze only their cloud data.

Consider the pros and cons for each approach when deciding which one to use in your migration.

> [!NOTE]
> Many organizations avoid running multiple on-premises analytics solutions because of cost and complexity.
>
> Azure Sentinel provides [pay-as-you-go pricing](azure-sentinel-billing.md) and flexible infrastructure, giving SOC teams time to adapt to the change. Migrate and test your content at a pace that works best for your organization.
>
### Short-term approach

:::row:::
   :::column span="":::
      **Pros**

        - Gives SOC staff time to adapt to new processes as workloads and analytics migrate.

        - Gains deep correlation across all data sources for hunting scenarios.

        - Eliminates having to do analytics between SIEMs, create forwarding rules, and close investigations in two places.

        - Enables your SOC team to quickly downgrade legacy SIEM solutions, eliminating infrastructure and licensing costs.
   :::column-end:::
   :::column span="":::
      **Cons**

        - Can require a steep learning curve for SOC staff.
   :::column-end:::
:::row-end:::

### Medium- to long-term approach

:::row:::
   :::column span="":::
      **Pros**

        - Lets you use key Azure Sentinel benefits, like AI, ML, and investigation capabilities, without moving completely away from your legacy SIEM.

        - Saves money compared to your legacy SIEM, by analyzing cloud or Microsoft data in Azure Sentinel.
   :::column-end:::
   :::column span="":::
      **Cons**

        - Increases complexity by separating analytics across different databases.

        - Splits case management and investigations for multi-environment incidents.

        - Incurs greater staff and infrastructure costs.

        - Requires SOC staff to be knowledgeable about two different SIEM solutions.
   :::column-end:::
:::row-end:::



### Send alerts from a legacy SIEM to Azure Sentinel (Recommended)

Send alerts, or indicators of anomalous activity, from your legacy SIEM to Azure Sentinel.

- Ingest and analyze cloud data in Azure Sentinel
- Use your legacy SIEM to analyze on-premises data and generate alerts.
- Forward the alerts from your on-premises SIEM into Azure Sentinel to establish a single interface.

For example, forward alerts using [Logstash](connect-logstash.md), [APIs](/rest/api/securityinsights/), or [Syslog](connect-syslog.md), and store them in [JSON](https://techcommunity.microsoft.com/t5/azure-sentinel/tip-easily-use-json-fields-in-sentinel/ba-p/768747) format in your Azure Sentinel [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).

By sending alerts from your legacy SIEM to Azure Sentinel, your team can cross-correlate and investigate those alerts in Azure Sentinel. The team can still access the legacy SIEM for deeper investigation if needed. Meanwhile, you can continue migrating data sources over an extended transition period.

This recommended, side-by-side migration method provides you with full value from Azure Sentinel and the ability to migrate data sources at the pace that's right for your organization. This approach avoids duplicating costs for data storage and ingestion while you move your data sources over.

For more information, see:

- [Migrate QRadar offenses to Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/migrating-qradar-offenses-to-azure-sentinel/ba-p/2102043)
- [Export data from Splunk to Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-export-data-from-splunk-to-azure-sentinel/ba-p/1891237).


### Send alerts and enriched incidents from Azure Sentinel to a legacy SIEM

Analyze some data in Azure Sentinel, such as cloud data, and then send the generated alerts to a legacy SIEM. Use the *legacy* SIEM as your single interface to do cross-correlation with the alerts that Azure Sentinel generated. You can still use Azure Sentinel for deeper investigation of the Azure Sentinel-generated alerts.

This configuration is cost effective, as you can move your cloud data analysis to Azure Sentinel without duplicating costs or paying for data twice. You still have the freedom to migrate at your own pace. As you continue to shift data sources and detections over to Azure Sentinel, it becomes easier to migrate to Azure Sentinel as your primary interface. However, simply forwarding enriched incidents to a legacy SIEM limits the value you get from Azure Sentinel's investigation, hunting, and automation capabilities.

For more information, see:

- [Send enriched Azure Sentinel alerts to your legacy SIEM](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-enriched-azure-sentinel-alerts-to-3rd-party-siem-and/ba-p/1456976)
- [Send enriched Azure Sentinel alerts to IBM QRadar](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-side-by-side-with-qradar/ba-p/1488333)
- [Ingest Azure Sentinel alerts into Splunk](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-side-by-side-with-splunk/ba-p/1211266)

### Other methods

The following table describes side-by-side configurations that are *not* recommended, with details as to why:

|Method  |Description  |
|---------|---------|
|**Send Azure Sentinel logs to your legacy SIEM**     |  With this method, you'll continue to experience the cost and scale challenges of your on-premises SIEM. <br><br>You'll pay for data ingestion in Azure Sentinel, along with storage costs in your legacy SIEM, and you can't take advantage of Azure Sentinel's SIEM and SOAR detections, analytics, User Entity Behavior Analytics (UEBA), AI, or investigation and automation tools.       |
|**Send logs from a legacy SIEM to Azure Sentinel**     |   While this method provides you with the full functionality of Azure Sentinel, your organization still pays for two different data ingestion sources. Besides adding architectural complexity, this model can result in higher costs.     |
|**Use Azure Sentinel and your legacy SIEM as two fully separate solutions**     |  You could use Azure Sentinel to analyze some data sources, like your cloud data, and continue to use your on-premises SIEM for other sources. This setup allows for clear boundaries for when to use each solution, and avoids duplication of costs. <br><br>However, cross-correlation becomes difficult, and you can't fully diagnose attacks that cross both sets of data sources. In today's landscape, where threats often move laterally across an organization, such visibility gaps can pose significant security risks.       |
|     |         |



## Migrate your data

Make sure that you migrate only the data that represents your current key use cases.

1. Determine the data that's needed to support each of your use cases.

1. Determine whether your current data sources provide valuable data.

1. Identify any visibility gaps in your current SIEM, and how you can close them.

1. For each data source, consider whether you need to ingest raw logs, which can be costly, or whether enriched alerts provide enough context for your key use cases.

      For example, you can ingest enriched data from security products across the organization, and use Azure Sentinel to correlate across them, without having to ingest raw logs from the data sources themselves.

1. Use any of the following resources to ingest data:

    - Use **Azure Sentinel's [built-in data connectors](connect-data-sources.md)** to start ingesting data. For example, you may want to start a [free trial](azure-sentinel-billing.md#free-trial) with your cloud data, or use [free data connectors](azure-sentinel-billing.md#free-data-sources) to ingest data from other Microsoft products.

    - Use **[Syslog](connect-data-sources.md#syslog), [Common Event Format (CEF)](connect-data-sources.md#common-event-format-cef), or [REST APIs](connect-data-sources.md#rest-api-integration)** to connect other data sources.

        For more information, see [Azure Sentinel partner data connectors](partner-data-connectors.md) and the [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md).

> [!TIP]
> - Limiting yourself to only free data sources may limit your ability to test with data that's important to you. When testing, consider limited data ingestion from both free and paid data connectors to get the most out of your test results.
>
> - As you migrate detections and build use cases in Azure Sentinel, stay mindful of the data you ingest, and verify its value to your key priorities. Revisit data collection conversations to ensure data depth and breadth across your use cases.
>

## Migrate analytics rules

Azure Sentinel uses machine learning analytics to create high-fidelity and actionable incidents, and some of your existing detections may be redundant in Azure Sentinel. Therefore, do not migrate all of your detection and analytics rules blindly:

- Make sure to select use cases that justify rule migration, considering business priority and efficiency.

- Review [built-in analytics rules](tutorial-detect-threats-built-in.md) that may already address your use cases. In Azure Sentinel, go to the **Configuration > Analytics > Rule templates** tab to create rules based on built-in templates.

- Review any rules that haven't triggered any alerts in the past 6-12 months, and determine whether they're still relevant.

- Eliminate low-level threats or alerts that you routinely ignore.

**To migrate your analytics rules to Azure Sentinel**:

1. Verify that your have a testing system in place for each rule you want to migrate.

    1. **Prepare a validation process** for your migrated rules, including full test scenarios and scripts.

    1. **Ensure that your team has useful resources** to test your migrated rules.

    1. **Confirm that you have any required data sources connected,** and review your data connection methods.

1. Verify whether your detections are available as built-in templates in Azure Sentinel:

    - **If the built-in rules are sufficient**, use built-in rule templates to create rules for your own workspace.

        In Azure Sentinel, go to the **Configuration > Analytics > Rule templates** tab, and create and update each relevant analytics rule.

        For more information, see [Detect threats out-of-the-box](tutorial-detect-threats-built-in.md).

    - **If you have detections that aren't covered by Azure Sentinel's built-in rules**, try an online query converter, such as [Uncoder.io](https://uncoder.io/) to convert your queries to KQL.

        Identify the trigger condition and rule action, and then construct and review your KQL query.

    - **If neither the built-in rules nor an online rule converter is sufficient**, you'll need to create the rule manually. In such cases, use the following steps to start creating your rule:

        1. **Identify the data sources you want to use in your rule**. You'll want to create a mapping table between data sources and data tables in Azure Sentinel to identify the tables you want to query.

        1. **Identify any attributes, fields, or entities** in your data that you want to use in your rules.

        1. **Identify your rule criteria and logic**. At this stage, you may want to use rule templates as samples for how to construct your KQL queries.

            Consider filters, correlation rules, active lists, reference sets, watchlists, detection anomalies, aggregations, and so on. You might use references provided by your legacy SIEM to understand how to best map your query syntax.

            For example, see:

            - [Sample rule mapping between ArcSight/QRadar and Azure Sentinel](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/Rule%20Logic%20Mappings.md)
            - [SPL to KQL mapping samples](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/Rule%20Logic%20Mappings.md) 

        1. **Identify the trigger condition and rule action, and then construct and review your KQL query**. When reviewing your query, consider KQL optimization guidance resources.

1. Test the rule with each of your relevant use cases. If it doesn't provided expected results, you may want to review the KQL and test it again.

1. When you're satisfied, you can consider the rule migrated. Create a playbook for your rule action as needed. For more information, see [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md).

**For more information, see**:

- [**Create custom analytics rules to detect threats**](tutorial-detect-threats-custom.md). Use [alert grouping](tutorial-detect-threats-custom.md#alert-grouping) to reduce alert fatigue by grouping alerts that occur within a given timeframe.
- [**Map data fields to entities in Azure Sentinel**](map-data-fields-to-entities.md) to enable SOC engineers to define entities as part of the evidence to track during an investigation. Entity mapping also makes it possible for SOC analysts to take advantage of an intuitive [investigation graph (tutorial-investigate-cases.md#use-the-investigation-graph-to-deep-dive) that can help reduce time and effort.
- [**Investigate incidents with UEBA data**](investigate-with-ueba.md), as an example of how to use evidence to surface events, alerts, and any bookmarks associated with a particular incident in the incident preview pane.
- [**Kusto Query Language (KQL)**](/azure/data-explorer/kusto/query/), which you can use to send read-only requests to your [Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md) database to process data and return results. KQL is also used across other Microsoft services, such as [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) and [Application Insights](../azure-monitor/app/app-insights-overview.md).

## Use automation to streamline processes

Use automated workflows to group and prioritize alerts into a common incident, and modify its priority.

For more information, see:

- [Security Orchestration, Automation, and Response (SOAR) in Azure Sentinel](automation-in-azure-sentinel.md).
- [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md)
- [Automate incident handling in Azure Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)

## Retire your legacy SIEM

Use the following checklist to make sure that you're fully migrated to Azure Sentinel and are ready to retire your legacy SIEM:


|Readiness area  |Details  |
|---------|---------|
|**Technology readiness**     | **Check critical data**: Make sure all sources and alerts are available in Azure Sentinel. <br><br>**Archive all records**: Save critical past incident and case records, raw data optional, to retain institutional history.   |
|**Process readiness**     |  **Playbooks**: Update [investigation and hunting processes](tutorial-investigate-cases.md) to Azure Sentinel.<br><br>**Metrics**: Ensure that you can get all key metrics from Azure Sentinel.<br><br>**Workbooks**: Create [custom workbooks](tutorial-monitor-your-data.md) or use built-in workbook templates to quickly gain insights as soon as you [connect to data sources](connect-data-sources.md).<br><br>**Incidents**: Make sure to transfer all current incidents to the new system, including required source data.        |
|**People readiness**     |  **SOC analysts**: Make sure everyone on your team is trained on Azure Sentinel and is comfortable leaving the legacy SIEM.   |
|     |         |
## Next steps

After migration, explore Microsoft's Azure Sentinel resources to expand your skills and get the most out of Azure Sentinel.

Also consider increasing your threat protection by using Azure Sentinel alongside [Microsoft 365 Defender](./microsoft-365-defender-sentinel-integration.md) and [Azure Defender](../security-center/azure-defender.md) for [integrated threat protection](https://www.microsoft.com/security/business/threat-protection). Benefit from the breadth of visibility that Azure Sentinel delivers, while diving deeper into detailed threat analysis.

For more information, see:

- [Rule migration best practices](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417)
- [Webinar: Best Practices for Converting Detection Rules](https://www.youtube.com/watch?v=njXK1h9lfR4)
- [Security Orchestration, Automation, and Response (SOAR) in Azure Sentinel](automation-in-azure-sentinel.md)
- [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md)
- [Azure Sentinel learning path](/learn/paths/security-ops-sentinel/)
- [SC-200 Microsoft Security Operations Analyst certification](/learn/certifications/exams/sc-200)
- [Azure Sentinel Ninja training](https://techcommunity.microsoft.com/t5/azure-sentinel/become-an-azure-sentinel-ninja-the-complete-level-400-training/ba-p/1246310)
- [Investigate an attack on a hybrid environment with Azure Sentinel](https://mslearn.cloudguides.com/guides/Investigate%20an%20attack%20on%20a%20hybrid%20environment%20with%20Azure%20Sentinel)