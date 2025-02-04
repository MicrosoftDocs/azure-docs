---
title: Work with threat intelligence
titleSuffix: Microsoft Sentinel
description: This article explains how to view, create, manage, and visualize threat intelligence in Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 01/27/2025
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to use threat intelligence managed by Microsoft Sentinel so that I can detect and respond to security threats more effectively.
---

# Work with Microsoft Sentinel threat intelligence

Accelerate threat detection and remediation with streamlined creation and management of threat intelligence. This article demonstrates how to make the most of threat intelligence integration in the management interface, whether you're accessing it from Microsoft Sentinel in the Azure portal or using Microsoft's unified SecOps platform.

- Create threat intelligence objects using structured threat information expression (STIX)
- Manage threat intelligence by viewing, curating, and visualizing 

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Access the management interface

Reference one of the following tabs, depending on where you want to work with threat intelligence. Even though the management interface is accessed differently depending which portal you use, the creation and management tasks have the same steps once you get there. 

### [Defender portal](#tab/defender-portal)

In the Defender portal, navigate to **Threat intelligence** > **Intel management**.

:::image type="content" source="media/work-with-threat-indicators/intel-management-navigation.png" alt-text="Screenshot showing the intel management menu item in the Defender portal.":::

### [Azure portal](#tab/azure-portal)

In the Azure portal, navigate to **Threat management** > **Threat intelligence**.

:::image type="content" source="media/work-with-threat-indicators/threat-intelligence-sentinel.png" alt-text="Screenshot showing threat intelligence menu for Microsoft Sentinel in the Azure portal.":::

---

## Create threat intelligence

Use the management interface to create STIX objects and perform other common threat intelligence tasks such as indicator tagging and establishing connections between objects.

- Define relationships as you create new STIX objects.
- Quickly create multiple objects by using the duplicate feature to copy the metadata from a new or existing TI object.

For more information on supported STIX objects, see [Understand threat intelligence](understand-threat-intelligence.md#create-and-manage-threat-intelligence).

### Create a new STIX object

1. Select **Add new** > **TI object**.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-add-new-indicator.png" alt-text="Screenshot that shows adding a new threat indicator." lightbox="media/work-with-threat-indicators/threat-intel-add-new-indicator.png":::

1. Choose the **Object type**, then fill in the form on the **New TI object** page. Required fields are marked with a red asterisk (*).
1. If you know how this object relates to another threat intelligence object, indicate that connection with the **Relationship type** and the **Target reference**.
1. Select **Add** for an individual object, or **Add and duplicate** if you want to create more items with the same metadata. The following image shows the common section of each STIX object's metadata that is duplicated. 

:::image type="content" source="media/work-with-threat-indicators/common-metadata-stix-object-reduced.png" alt-text="Screenshot showing new STIX object creation and the common metadata available to all objects.":::

## Manage threat intelligence 

Optimize TI from your sources with ingestion rules. Curate existing TI with the relationship builder. Use the management interface to search, filter and sort, then add tags to your threat intelligence.

### Optimize threat intelligence feeds with ingestion rules

Reduce noise from your TI feeds, extend the validity of high value indicators, and add meaningful tags to incoming objects. These are just some of the use cases for ingestion rules. Here are the steps for extending the validity date on high value indicators.

1. Select **Ingestion rules** to open a whole new page to view existing rules and construct new rule logic.

   :::image type="content" source="media/work-with-threat-indicators/select-ingestion-rules.png" alt-text="Screenshot showing threat intelligence management menu hovering on ingestion rules.":::

1. Enter a descriptive name for your rule. The ingestion rules page has ample rule for the name, but it's the only text description available to differentiate your rules without editing them.

1. Select the **Object type**. This use case is based on extending the `Valid from` property which is only available for `Indicator` object types.

1. **Add condition** for `Source` `Equals` and select your high value `Source`.
1. **Add condition** for `Confidence` `Greater than or equal` and enter a `Confidence` score.

1. Select the **Action**. Since we want to modify this indicator, select `Edit`.
1. Select the **Add action** for `Valid until`, `Extend by`, and select a time span in days.
1. Consider adding a tag to indicate the high value placed on these indicators, like `Extended`. The modified date is not updated by ingestion rules.
1. Select the **Order** you want the rule to run. Rules run from lowest order number to highest. Each rule evaluates every object ingested.
1. If the rule is ready to be enabled, toggle **Status** to on.
1. Select **Add** to create the ingestion rule.

:::image type="content" source="media/work-with-threat-indicators/new-ingestion-rule.png" alt-text="Screenshot showing new ingestion rule creation for extending valid until date.":::

For more information, see [Understand threat intelligence ingestion rules](understand-threat-intelligence.md#configure-ingestion-rules).

### Curate threat intelligence with the relationship builder

Connect threat intelligence objects with the relationship builder. There's a maximum of 20 relationships in the builder at once, but more connections can be created through multiple iterations and by adding relationship target references for new objects.

1. Start with an object like a threat actor or attack pattern where the single object connects to one or more objects, like indicators.

1. Add the relationship type according to the best practices outlined in the following table and in the [STIX 2.1 reference relationship summary table](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_6n2czpjuie3v):

| Relationship type | Description |
|---|---|
| **Duplicate of**</br>**Derived from**</br>**Related to** | Common relationships defined for any STIX domain object (SDO)<br>For more information, see [STIX 2.1 reference on common relationships](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_f3dx2rhc3vl)|
| **Targets** | `Attack pattern` or `Threat actor` Targets `Identity` |
| **Uses** | `Threat actor` Uses `Attack pattern` |
| **Attributed to** | `Threat actor` Attributed to `Identity` |
| **Indicates** | `Indicator` Indicates `Attack pattern` or `Threat actor` |
| **Impersonates** | `Threat actor` Impersonates `Identity` |

The following image demonstrates connections made between a threat actor and an attack pattern, indicator, and identity using the relationship type table.

:::image type="content" source="media/work-with-threat-indicators/relationship-example.png" alt-text="Screenshot showing the relationship builder.":::

### View your threat intelligence in the management interface

Use the management interface to sort, filter, and search your threat intelligence from whatever source they were ingested from without writing a Log Analytics query.

1. From the management interface, expand the **What would you like to search?** menu.

1. Select a STIX object type or leave the default **All object types**.

1. Select conditions using logical operators.

1. Select the object you want to see more information about.

In the following image, multiple sources were used to search by placing them in an `OR` group, while multiple conditions were grouped with the `AND` operator.

:::image type="content" source="media/work-with-threat-indicators/advanced-search.png" alt-text="Screenshot shows an OR operator combined with multiple AND conditions to search threat intelligence." lightbox="media/work-with-threat-indicators/advanced-search.png":::


Microsoft Sentinel only displays the most current version of your threat intel in this view. For more information on how objects are updated, see [Understand threat intelligence](understand-threat-intelligence.md#view-your-threat-intelligence).

IP and domain name indicators are enriched with extra `GeoLocation` and `WhoIs` data so you can provide more context for any investigations where indicator is found.

Here's an example.

:::image type="content" source="media/work-with-threat-indicators/geolocation-whois-unified.png" alt-text="Screenshot that shows the Threat intelligence page with an indicator showing GeoLocation and WhoIs data." lightbox="media/work-with-threat-indicators/geolocation-whois-unified.png":::

> [!IMPORTANT]
> `GeoLocation` and `WhoIs` enrichment is currently in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include more legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Tag and edit threat intelligence

Tagging threat intelligence is a quick way to group objects together to make them easier to find. Typically, you might apply tags related to a particular incident. But, if an object represents threats from a particular known actor or well-known attack campaign, consider creating a relationship instead of a tag.

1. Use the management interface to sort, filter, and search for your threat intelligence.
1. After you find the objects you want to work with, multiselect them choosing one or more objects of the same type.
1. Select **Add tags** and tag them all at once with one or more tags. 
1. Because tagging is free-form, we recommend that you create standard naming conventions for tags in your organization.

Edit threat intelligence one object at a time, whether created directly in Microsoft Sentinel or from partner sources, like TIP and TAXII servers. For threat intel created in the management interface, all fields are editable. For threat intel ingested from partner sources, only specific fields are editable, including tags, **Expiration date**, **Confidence**, and **Revoked**. Either way, only the latest version of the object appears in the management interface.

For more information on how threat intel is updated, see [View your threat intelligence](understand-threat-intelligence.md#view-your-threat-intelligence).

### Find and view your indicators with queries

This procedure describes how to view your threat indicators in Log Analytics, together with other Microsoft Sentinel event data, regardless of the source feed or method you used to ingest them.

Threat indicators are listed in the Microsoft Sentinel `ThreatIntelligenceIndicator` table. This table is the basis for threat intelligence queries performed by other Microsoft Sentinel features, such as **Analytics**, **Hunting**, and **Workbooks**.

To view your threat intelligence indicators:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **General**, select **Logs**.

   For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Investigation & response** > **Hunting** > **Advanced hunting**.

1. The `ThreatIntelligenceIndicator` table is located under the **Microsoft Sentinel** group.
1. Select the **Preview data** icon (the eye) next to the table name. Select **See in query editor** to run a query that shows records from this table.

    Your results should look similar to the sample threat indicator shown here.

    :::image type="content" source="media/work-with-threat-indicators/ti-table-results.png" alt-text="Screenshot that shows sample ThreatIntelligenceIndicator table results with the details expanded." lightbox="media/work-with-threat-indicators/ti-table-results.png":::

### Visualize your threat intelligence with workbooks

Use a purpose-built Microsoft Sentinel workbook to visualize key information about your threat intelligence in Microsoft Sentinel, and customize the workbook according to your business needs.

Here's how to find the threat intelligence workbook provided in Microsoft Sentinel, and an example of how to make edits to the workbook to customize it.

 1. From the [Azure portal](https://portal.azure.com/), go to **Microsoft Sentinel**.

 1. Choose the workspace to which you imported threat indicators by using either threat intelligence data connector.

 1. Under the **Threat management** section of the Microsoft Sentinel menu, select **Workbooks**.

 1. Find the workbook titled **Threat Intelligence**. Verify that you have data in the `ThreatIntelligenceIndicator` table.

     :::image type="content" source="media/work-with-threat-indicators/threat-intel-verify-data.png" alt-text="Screenshot that shows verifying that you have data.":::

 1. Select **Save**, and choose an Azure location in which to store the workbook. This step is required if you intend to modify the workbook in any way and save your changes.

 1. Now select **View saved workbook** to open the workbook for viewing and editing.

 1. You should now see the default charts provided by the template. To modify a chart, select **Edit** at the top of the page to start the editing mode for the workbook.

 1. Add a new chart of threat indicators by threat type. Scroll to the bottom of the page and select **Add Query**.

 1. Add the following text to the **Log Analytics workspace Log Query** text box:

    ```kusto
    ThreatIntelligenceIndicator
    | summarize count() by ThreatType
    ```

    See more information on the following items used in the preceding example, in the Kusto documentation:
    - [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
    - [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)

1. On the **Visualization** dropdown menu, select **Bar chart**.

1. Select **Done editing**, and view the new chart for your workbook.

    :::image type="content" source="media/work-with-threat-indicators/threat-intel-bar-chart.png" alt-text="Screenshot that shows a bar chart for the workbook.":::

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Microsoft Sentinel. You can do many tasks with workbooks, and the provided templates are a great starting point. Customize the templates or create new dashboards by combining many data sources so that you can visualize your data in unique ways.

Microsoft Sentinel workbooks are based on Azure Monitor workbooks, so extensive documentation and many more templates are available. For more information, see [Create interactive reports with Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview).

There's also a rich resource for [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks), where you can download more templates and contribute your own templates.

## Related content

For more information, see the following articles:

- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- See which [TIPs, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]
