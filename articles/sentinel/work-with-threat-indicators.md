---
title: Work with threat indicators in Microsoft Sentinel
description: This article explains how to view, create, manage, and visualize threat intelligence indicators in Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 8/30/2022
ms.author: austinmc
---

# Work with threat indicators in Microsoft Sentinel

Integrate threat intelligence (TI) into Microsoft Sentinel through the following activities:

- **Import threat intelligence** into Microsoft Sentinel by enabling **data connectors** to various TI [platforms](connect-threat-intelligence-tip.md) and [feeds](connect-threat-intelligence-taxii.md).

- **View and manage** the imported threat intelligence in **Logs** and in the Microsoft Sentinel **Threat Intelligence** page.

- **Detect threats** and generate security alerts and incidents using the built-in **Analytics** rule templates based on your imported threat intelligence.

- **Visualize key information** about your imported threat intelligence in Microsoft Sentinel with the **Threat Intelligence workbook**.

## View your threat indicators in Microsoft Sentinel

### Find and view your indicators in the Threat intelligence page

This procedure describes how to view and manage your indicators in the **Threat intelligence** page, accessible from the main Microsoft Sentinel menu. Use the **Threat intelligence** page to sort, filter, and search your imported threat indicators without writing a Log Analytics query.

**To view your threat intelligence indicators in the Threat intelligence page**:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select the workspace where you imported threat indicators.

1. From the **Threat Management** section on the left, select the **Threat Intelligence** page.

1. From the grid, select the indicator for which you want to view more details. The indicator's details appear on the right, showing information such as confidence levels, tags, threat types, and more.

1. Microsoft Sentinel only displays the most current version of indicators in this view. For more information on how indicators are updated, see [Understand threat intelligence](understand-threat-intelligence.md#view-and-manage-your-threat-indicators).

1. IP and domain name indicators are enriched with extra GeoLocation and WhoIs data, providing more context for investigations where the selected indicator is found.

    For example:

    :::image type="content" source="media/work-with-threat-indicators/geolocation-whois-ti.png" alt-text="Screenshot of the Threat intelligence page with an indicator showing GeoLocation and WhoIs data." lightbox="media/work-with-threat-indicators/geolocation-whois-ti.png":::

> [!IMPORTANT]
> GeoLocation and WhoIs enrichment is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


### Find and view your indicators in Logs

This procedure describes how to view your imported threat indicators in the Microsoft Sentinel **Logs** area, together with other Microsoft Sentinel event data, regardless of the source feed or the connector used.

Imported threat indicators are listed in the **Microsoft Sentinel > ThreatIntelligenceIndicator** table, which is the basis for threat intelligence queries run elsewhere in Microsoft Sentinel, such as in **Analytics** or **Workbooks**.

**To view your threat intelligence indicators in Logs**:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select the workspace to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Logs** from the **General** section of the Microsoft Sentinel menu.

1. The **ThreatIntelligenceIndicator** table is located under the **Microsoft Sentinel** group.

1. Select the **Preview data** icon (the eye) next to the table name and select the **See in query editor** button to run a query that will show records from this table.

    Your results should look similar to the sample threat indicator shown below:

    :::image type="content" source="media/work-with-threat-indicators/ti-table-results.png" alt-text="Screenshot shows sample ThreatIntelligenceIndicator table results with the details expanded." lightbox="media/work-with-threat-indicators/ti-table-results.png":::

## Create and tag indicators

The **Threat intelligence** page also allows you to create threat indicators directly within the Microsoft Sentinel interface, and perform two of the most common threat intelligence administrative tasks: indicator tagging and creating new indicators related to security investigations.

### Create a new indicator

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Threat Intelligence** from the Threat Management section of the Microsoft Sentinel menu.

1. Select the **Add new** button from the menu bar at the top of the page.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-add-new-indicator.png" alt-text="Add a new threat indicator" lightbox="media/work-with-threat-indicators/threat-intel-add-new-indicator.png":::

1. Choose the indicator type, then complete the form on the **New indicator** panel. The required fields are marked with a red asterisk (*).

1. Select **Apply**. The indicator is added to the indicators list, and is also sent to the *ThreatIntelligenceIndicator* table in **Logs**.

### Tag and edit threat indicators

Tagging threat indicators is an easy way to group them together to make them easier to find. Typically, you might apply a tag to indicators related to a particular incident, or to those representing threats from a particular known actor or well-known attack campaign. Tag threat indicators individually, or multi-select indicators and tag them all at once. Shown below is an example of tagging multiple indicators with an incident ID. Since tagging is free-form, a recommended practice is to create standard naming conventions for threat indicator tags. Indicators allow applying multiple tags.

:::image type="content" source="media/work-with-threat-indicators/threat-intel-tagging-indicators.png" alt-text="Apply tags to threat indicators" lightbox="media/work-with-threat-indicators/threat-intel-tagging-indicators.png":::

Microsoft Sentinel also allows you to edit indicators, whether they've been created directly in Microsoft Sentinel, or come from partner sources, like TIP and TAXII servers. For indicators created in Microsoft Sentinel, all fields are editable. For indicators coming from partner sources, only specific fields are editable, including tags, *Expiration date*, *Confidence*, and *Revoked*. Either way, keep in mind only the latest version of the indicator is displayed in the **Threat Intelligence** page view. For more information on how indicators are updated, see [Understand threat intelligence](understand-threat-intelligence.md#view-and-manage-your-threat-indicators).

## Workbooks provide insights about your threat intelligence

Use a purpose-built Microsoft Sentinel workbook to visualize key information about your threat intelligence in Microsoft Sentinel, and customize the workbook according to your business needs.

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

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Microsoft Sentinel. There is a whole lot you can do with workbooks, and while the provided templates are a great starting point, you will likely want to dive in and customize these templates, or create new dashboards combining many different data sources so to visualize your data in unique ways. Since Microsoft Sentinel workbooks are based on Azure Monitor workbooks, there is already extensive documentation available, and many more templates. A great place to start is this article on how to [Create interactive reports with Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md). 

There is also a rich community of [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks) to download more templates and contribute your own templates.

## Next steps

In this article, you learned all the ways to work with threat intelligence indicators throughout Microsoft Sentinel. For more about threat intelligence in Microsoft Sentinel, see the following articles:

- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- [Connect threat intelligence platforms](./connect-threat-intelligence-tip.md) to Microsoft Sentinel.
- See which [TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.
