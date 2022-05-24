---
title: Work with threat indicators in Microsoft Sentinel | Microsoft Docs
description: This article explains how to view, create, manage, visualize, and detect threats with threat intelligence indicators in Microsoft Sentinel.
author: batamig
ms.topic: how-to
ms.date: 11/09/2021
ms.author: bagol
ms.custom: ignite-fall-2021
---

# Work with threat indicators in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

You can integrate threat intelligence (TI) into Microsoft Sentinel through the following activities:

- **Import threat intelligence** into Microsoft Sentinel by enabling **data connectors** to various TI [platforms](connect-threat-intelligence-tip.md) and [feeds](connect-threat-intelligence-taxii.md).

- **View and manage** the imported threat intelligence in **Logs** and in the Microsoft Sentinel **Threat Intelligence** page.

- **Detect threats** and generate security alerts and incidents using the built-in **Analytics** rule templates based on your imported threat intelligence.

- **Visualize key information** about your imported threat intelligence in Microsoft Sentinel with the **Threat Intelligence workbook**.

## View your threat indicators in Microsoft Sentinel

### Find and view your indicators in Logs

This procedure describes how to view your imported threat indicators in the Microsoft Sentinel **Logs** area, together with other Microsoft Sentinel event data, regardless of the source feed or the connector used.

Imported threat indicators are listed in the **Microsoft Sentinel > ThreatIntelligenceIndicator** table, which is the basis for threat intelligence queries run elsewhere in Microsoft Sentinel, such as in analytics or workbooks.

**To view your threat intelligence indicators in Logs**:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select the workspace to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Logs** from the **General** section of the Microsoft Sentinel menu.

1. The **ThreatIntelligenceIndicator** table is located under the **Microsoft Sentinel** group.

1. Select the **Preview data** icon (the eye) next to the table name and select the **See in query editor** button to run a query that will show records from this table.

Your results should look similar to the sample threat indicator shown below:

:::image type="content" source="media/work-with-threat-indicators/threat-intel-sample-query.png" alt-text="Sample query data":::

### Find and view your indicators in the Threat intelligence page

This procedure describes how to view and manage your indicators in the **Threat intelligence** page, accessible from the main Microsoft Sentinel menu. Use the **Threat intelligence** page to sort, filter, and search your imported threat indicators without writing a Log Analytics query.

**To view your threat intelligence indicators in the Threat intelligence page**:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select the workspace to which you imported threat indicators using the connectors/playbooks or have created threat intelligence data.

1. From the **Threat Management** section on the left, select the **Threat Intelligence** page.

1. From the grid, select the indicator for which you want to view more details. The indicator's details appear on the right, showing information such as confidence levels, tags, threat types, and more.

    Microsoft enriches each indicator with extra GeoLocation and WhoIs data, providing more context for investigations where the selected indicator is found.

    For example:

    :::image type="content" source="media/whats-new/geolocation-whois-ti.png" alt-text="Screenshot of the Threat intelligence page with an indicator showing GeoLocation and WhoIs data." lightbox="media/whats-new/geolocation-whois-ti.png":::

The **Threat intelligence** page also allows you to create threat indicators directly within the Microsoft Sentinel interface, and perform two of the most common threat intelligence administrative tasks: indicator tagging and creating new indicators related to security investigations.

> [!IMPORTANT]
> GeoLocation and WhoIs enrichment is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

#### Create a new indicator

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Threat Intelligence** from the Threat Management section of the Microsoft Sentinel menu.

1. Select the **Add new** button from the menu bar at the top of the page.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-add-new-indicator.png" alt-text="Add a new threat indicator" lightbox="media/work-with-threat-indicators/threat-intel-add-new-indicator.png":::

1. Choose the indicator type, then complete the form on the **New indicator** panel. The required fields are marked with a red asterisk (*).

1. Select **Apply**. The indicator is added to the indicators list, and is also sent to the *ThreatIntelligenceIndicator* table in **Logs**.

#### Tag threat indicators

Tagging threat indicators is an easy way to group them together to make them easier to find. Typically, you might apply a tag to indicators related to a particular incident, or to those representing threats from a particular known actor or well-known attack campaign. You can tag threat indicators individually, or multi-select indicators and tag them all at once. Shown below is an example of tagging multiple indicators with an incident ID. Since tagging is free-form, a recommended practice is to create standard naming conventions for threat indicator tags. You can apply multiple tags to each indicator.

:::image type="content" source="media/work-with-threat-indicators/threat-intel-tagging-indicators.png" alt-text="Apply tags to threat indicators" lightbox="media/work-with-threat-indicators/threat-intel-tagging-indicators.png":::

Microsoft Sentinel also allows you to edit indicators, whether they've been created directly in Microsoft Sentinel, or come from partner sources, like TIP and TAXII servers. For indicators created in Microsoft Sentinel, all fields are editable. For indicators coming from partner sources, only specific fields are editable, including tags, *Expiration date*, *Confidence*, and *Revoked*.

## Detect threats with threat indicator-based analytics

The most important use case for threat indicators in SIEM solutions like Microsoft Sentinel is to power threat detection analytics rules. These indicator-based rules compare raw events from your data sources against your threat indicators to determine the presence of security threats in your organization. In Microsoft Sentinel **Analytics**, you create analytics rules that run on a scheduled basis and generate security alerts. The rules are driven by queries, along with configurations that determine how often the rule should run, what kind of query results should generate security alerts and incidents, and which automations to trigger in response.

While you can always create new analytics rules from scratch, Microsoft Sentinel provides a set of built-in rule templates, created by Microsoft security engineers, that you can use as-is or modify to meet your needs. You can readily identify the rule templates that use threat indicators, as they are all titled beginning with "*TI map*…". All these rule templates operate similarly, with the only difference being which type of threat indicators are used (domain, email, file hash, IP address, or URL) and which event type to match against. Each template lists the required data sources needed for the rule to function, so you can see at a glance if you have the necessary events already imported in Microsoft Sentinel. When you edit and save an existing rule template or create a new rule, it is enabled by default.

### Configure a rule to generate security alerts

Below is an example of how to enable and configure a rule to generate security alerts using the threat indicators you’ve imported into Microsoft Sentinel. For this example, use the rule template called **TI map IP entity to AzureActivity**. This rule will match any IP address-type threat indicator with all your Azure Activity events. When a match is found, an **alert** will be generated, and a corresponding **incident** for investigation by your security operations team. This analytics rule will operate successfully only if you have enabled one or both of the **Threat Intelligence** data connectors (to import threat indicators) and the **Azure Activity** data connector (to import your Azure subscription-level events).

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you imported threat indicators using the **Threat Intelligence** data connectors and Azure activity data using the **Azure Activity** data connector.

1. Select **Analytics** from the **Configuration** section of the Microsoft Sentinel menu.

1. Select the **Rule templates** tab to see the list of available analytics rule templates.

1. Find the rule titled **TI map IP entity to AzureActivity** and ensure you have connected all the required data sources as shown below.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-required-data-sources.png" alt-text="Required data sources":::

1. Select the **TI map IP entity to AzureActivity** rule and then select **Create rule** to open a rule configuration wizard. Configure the settings in the wizard and then select **Next: Set rule logic >**.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-create-analytics-rule.png" alt-text="Create analytics rule":::

1. The rule logic portion of the wizard has been pre-populated with the following items:
    - The query that will be used in the rule.

    - Entity mappings, which tell Microsoft Sentinel how to recognize entities like Accounts, IP addresses, and URLs, so that **incidents** and **investigations** understand how to work with the data in any security alerts generated by this rule.

    - The schedule to run this rule.

    - The number of query results needed before a security alert is generated.

    The default settings in the template are:
    - Run once an hour.

    - Match any IP address threat indicators from the **ThreatIntelligenceIndicator** table with any IP address found in the last one hour of events from the **AzureActivity** table.

    - Generate a security alert if the query results are greater than zero, meaning if any matches are found.

    You can leave the default settings or change them to meet your requirements, and you can define incident-generation settings on the **Incident settings** tab. For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md). When you are finished, select the **Automated response** tab.

1. Configure any automation you’d like to trigger when a security alert is generated from this analytics rule. Automation in Microsoft Sentinel is done using combinations of **automation rules** and **playbooks** powered by Azure Logic Apps. To learn more, see this [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](./tutorial-respond-threats-playbook.md). When finished, select the **Next: Review >** button to continue.

1. When you see the message that the rule validation has passed, select the **Create** button and you are finished.

You can find your enabled rules in the **Active rules** tab of the **Analytics** section of Microsoft Sentinel. You can edit, enable, disable, duplicate, or delete the active rule from there. The new rule runs immediately upon activation, and from then on will run on its defined schedule.

According to the default settings, each time the rule runs on its schedule, any results found will generate a security alert. Security alerts in Microsoft Sentinel can be viewed in the **Logs** section of Microsoft Sentinel, in the **SecurityAlert** table under the **Microsoft Sentinel** group.

In Microsoft Sentinel, the alerts generated from analytics rules also generate security incidents, which can be found in **Incidents** under **Threat Management** on the Microsoft Sentinel menu. Incidents are what your security operations teams will triage and investigate to determine the appropriate response actions. You can find detailed information in this [Tutorial: Investigate incidents with Microsoft Sentinel](./investigate-cases.md).

IMPORTANT: Microsoft Sentinel refreshes indicators every 14 days to make sure they are available for matching purposes through the analytic rules. 

## Detect threats using matching analytics (Public preview)

> [!IMPORTANT]
> Matching analytics is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[Create a rule](detect-threats-built-in.md#use-built-in-analytics-rules) using the built-in **Microsoft Threat Intelligence Matching Analytics** analytics rule template to have Microsoft Sentinel match Microsoft-generated threat intelligence data with the logs you've ingested in to Microsoft Sentinel.

Matching threat intelligence data with your logs helps to generate high-fidelity alerts and incidents, with appropriate severities applied. When a match is found, any alerts generated are grouped into incidents.

Alerts are grouped on a per-observable basis, over a 24-hour timeframe. So, for example, all alerts generated in a 24-hour time period that match the `abc.com` domain are grouped into a single incident.

### Triage through an incident generated by matching analytics

If you have a match found, any alerts generated are grouped into incidents.

Use the following steps to triage through the incidents generated by the **Microsoft Threat Intelligence Matching Analytics** rule:

1. In the Microsoft Sentinel workspace where you've enabled the **Microsoft Threat Intelligence Matching Analytics** rule, select **Incidents** and search for **Microsoft Threat Intelligence Analytics**.

    Any incidents found are shown in the grid.

1. Select **View full details** to view entities and other details about the incident, such as specific alerts.

    For example:

    :::image type="content" source="media/work-with-threat-indicators/matching-analytics.png" alt-text="Sample matched analytics details.":::

When a match is found, the indicator is also published to the Log Analytics **ThreatIntelligenceIndicators**, and displayed in the **Threat Intelligence** page. For any indicators published from this rule, the source is defined as **Microsoft Threat Intelligence Analytics**.

For example, in the **ThreatIntelligenceIndicators** log:

:::image type="content" source="media/work-with-threat-indicators/matching-analytics-logs.png" alt-text="Matching analytics displayed in the ThreatIntelligenceIndicators log.":::

In the **Threat Intelligence** page:

:::image type="content" source="media/work-with-threat-indicators/matching-analytics-threat-intelligence.png" alt-text="Matching analytics displayed in the Threat Intelligence page.":::

### Supported log sources for matching analytics

The **Microsoft Threat Intelligence Matching Analytics** rule is currently supported for the following log sources:

| Log source | Description |
| --------- | --------- |
| [CEF](connect-common-event-format.md) | Matching is done for all CEF logs that are ingested in the Log Analytics **CommonSecurityLog** table, except for any where the `DeviceVendor` is listed as `Cisco`. <br><br>To match Microsoft-generated threat intelligence with CEF logs, make sure to map the domain in the `RequestURL` field of the CEF log. |
| [DNS](./data-connectors-reference.md#windows-dns-server-preview) | Matching is done for all DNS logs that are lookup DNS queries from clients to DNS services (`SubType == "LookupQuery"`). DNS queries are processed only for IPv4 (`QueryType=”A”`) and IPv6 queries (`QueryType=” AAAA”`).<br><br>To match Microsoft-generated threat intelligence with DNS logs, no manual mapping of columns is needed, as all columns are standard from Windows DNS Server, and the domains will be in the `Name` column by default. |
| [Syslog](connect-syslog.md) | Matching is currently done for only for Syslog events where the `Facility` is `cron`. <br><br>To match Microsoft-generated threat intelligence with Syslog, no manual mapping of columns is needed. The details come in the `SyslogMessage` field of the Syslog by default, and the rule will parse the domain directly from the SyslogMessage. |



## Workbooks provide insights about your threat intelligence

You can use a purpose-built Microsoft Sentinel workbook to visualize key information about your threat intelligence in Microsoft Sentinel, and you can easily customize the workbook according to your business needs.

Here's how to find the threat intelligence workbook provided in Microsoft Sentinel, and an example of how to make edits to the workbook to customize it.

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Workbooks** from the **Threat management** section of the Microsoft Sentinel menu.

1. Find the workbook titled **Threat Intelligence** and verify you have data in the **ThreatIntelligenceIndicator** table as shown below.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-verify-data.png" alt-text="Verify data":::

1. Select the **Save** button and choose an Azure location to store the workbook. This step is required if you are going to modify the workbook in any way and save your changes.

1. Now select the **View saved workbook** button to open the workbook for viewing and editing.

1. You should now see the default charts provided by the template. To modify a chart, select the **Edit** button at the top of the page to enter editing mode for the workbook.

1. Add a new chart of threat indicators by threat type. Scroll to the bottom of the page and select **Add Query**.

1. Add the following text to the **Log Analytics workspace Log Query** text box:
    ```kusto
    ThreatIntelligenceIndicator
    | summarize count() by ThreatType
    ```

1. In the **Visualization** drop-down, select **Bar chart**.

1. Select the **Done editing** button. You’ve created a new chart for your workbook.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-bar-chart.png" alt-text="Bar chart":::

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Microsoft Sentinel. There is a whole lot you can do with workbooks, and while the provided templates are a great starting point, you will likely want to dive in and customize these templates, or create new dashboards combining many different data sources so you can visualize your data in unique ways. Since Microsoft Sentinel workbooks are based on Azure Monitor workbooks, there is already extensive documentation available, and many more templates. A great place to start is this article on how to [Create interactive reports with Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md). 

There is also a rich community of [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks) where you can download more templates and contribute your own templates.

## Next steps

In this article, you learned all the ways you can work with threat intelligence indicators throughout Microsoft Sentinel. For more about threat intelligence in Microsoft Sentinel, see the following articles:
- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- [Connect threat intelligence platforms](./connect-threat-intelligence-tip.md) to Microsoft Sentinel.
- See which [TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.
