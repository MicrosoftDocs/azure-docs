---
title: Use the SIEM migration experience
titleSuffix: Microsoft Sentinel
description: Migrate security monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel. 
author: austinmccollum
ms.topic: how-to
ms.date: 9/11/2024
ms.author: austinmc
appliesto: 
- Microsoft Sentinel in the Azure portal
- Microsoft Sentinel in the Defender portal
#customer intent: As an SOC administrator, I want to use the SIEM migration experience so I can migrate to Microsoft Sentinel.
---

# Migrate to Microsoft Sentinel with the SIEM migration experience

Migrate your SIEM to Microsoft Sentinel for all your security monitoring use cases. Automated assistance from the SIEM Migration experience simplifies your migration. 

These features are currently included in the SIEM Migration experience: 

**Splunk**
- The experience focuses on migrating Splunk security monitoring to Microsoft Sentinel and mapping out-of-the-box (OOTB) analytics rules wherever possible.
- The experience only supports migration of Splunk detections to Microsoft Sentinel analytics rules.

## Prerequisites

You need the following from the source SIEM:

**Splunk**
- The migration experience is compatible with both Splunk Enterprise and Splunk Cloud editions.
- A Splunk admin role is required to export all Splunk alerts. For more information, see [Splunk role-based user access](https://docs.splunk.com/Documentation/Splunk/9.1.3/Security/Aboutusersandroles).
- Export the historical data from Splunk to the relevant tables in the Log Analytics workspace. For more information, see [Export historical data from Splunk](migration-splunk-historical-data.md)

You need the following on the target, Microsoft Sentinel:

- The SIEM migration experience deploys analytics rules. This capability requires the **Microsoft Sentinel Contributor** role. For more information, see [Permissions in Microsoft Sentinel](roles.md). 
- Ingest security data previously used in your source SIEM into Microsoft Sentinel. Install and enable out-of-the-box (OOTB) data connectors to match your security monitoring estate from your source SIEM.
    - If the data connectors aren't installed yet, find the relevant solutions in **Content hub**. 
    - If no data connector exists, create a custom ingestion pipeline.<br>For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md) or [Custom data ingestion and transformation](data-transformation.md).

## Translate Splunk detection rules

At the core of Splunk detection rules is the Search Processing Language (SPL). The SIEM migration experience systematically translates SPL to Kusto query language (KQL) for each Splunk rule. Carefully review translations and make adjustments to ensure migrated rules function as intended in your Microsoft Sentinel workspace. For more information on the concepts important in translating detection rules, see [migrate Splunk detection rules](migration-splunk-detection-rules.md).

Current capabilities:

- Map Splunk detections to OOTB Microsoft Sentinel analytics rules
- Translate simple queries with a single data source
- Automatic translations of SPL to KQL for the mappings listed in the article, [Splunk to Kusto cheat sheet](/azure/data-explorer/kusto/query/splunk-cheat-sheet)
- **Schema Mapping (Preview)** creates logical links by mapping Splunk data sources to Microsoft Sentinel tables and Splunk lookups to watchlists.
- Translated query review provides error feedback with edit capability to save time in the detection rule translation process
- **Translation State** indicating how completely SPL syntax is translated to KQL at the grammatical level
- Support for Splunk macros translation using inline replacement macro definition within SPL queries
- Splunk Common Information Model (CIM) to Microsoft Sentinel's Advanced Security Information Model (ASIM) translation support
- Downloadable pre-migration and post-migration summary

## Start the SIEM migration experience

1. Navigate to Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.

1. Select **SIEM Migration**. 

:::image type="content" source="media/siem-migration/siem-migration-experience.png" alt-text="Screenshot showing content hub with menu item for the SIEM migration experience.":::

## Upload Splunk detections

1. From Splunk Web, select **Search and Reporting** in the **Apps** panel. 

1. Run the following query: 

```
|rest splunk_server=local count=0 /servicesNS/-/-/saved/searches
|search disabled=0 
|search alert_threshold != ""
|table title,search,description,cron_schedule,dispatch.earliest_time,alert.severity,alert_comparator,alert_threshold,alert.suppress.period,id
|tojson|table _raw
|rename _raw as alertrules|mvcombine delim=", " alertrules
|append [| rest splunk_server=local count=0 /servicesNS/-/-/admin/macros|table title ,definition,args,iseval|tojson|table _raw |rename _raw as macros|mvcombine delim=", " macros]
|filldown alertrules
|tail 1
```

1. Select the export button and choose JSON as the format. 

1. Save the file. 

1. Upload the exported Splunk JSON file.

> [!NOTE]
> The Splunk export must be a valid JSON file and the upload size is limited to 50 MB.

:::image type="content" source="media/siem-migration/upload-file.png" alt-text="Screenshot showing the upload files tab.":::

## Schema mapping

Microsoft Sentinel Analytics require that the data type be present in the Log Analytics Workspace before a rule is enabled. Schema mapping ensures the data types and fields used in the rule logic are mapped accurately. It's also important the fields used in the query are accurate for the data type schema.


## Configure rules

1. Select **Configure Rules**.

1. Review the analysis of the Splunk export.

    - **Name** is the original Splunk detection rule name.
    - **Translation Type** indicates if a Sentinel OOTB analytics rule matches the Splunk detection logic.
    - **Translation State** gives feedback about how completely the syntax of a Splunk detection has been translated to KQL. The translation state doesn't test the rule or verify the data source.
        - **Fully Translated** - Queries in this rule were fully translated to KQL but haven't tested the rule logic or data source.
        - **Partially Translated** - Queries in this rule weren't fully translated to KQL.
        - **Not Translated** - Indicates an error in translation.
        - **Manually Translated** - This status is set when any rule is edited and saved.

    :::image type="content" source="media/siem-migration/configure-rules.png" alt-text="Screenshot showing the results of the automatic rule mapping." lightbox="media/siem-migration/configure-rules.png":::

1. Highlight a rule to resolve translation and select **Edit**. When you are satisfied with the results, select **Save Changes**. 

1. Switch on the **Deploy** toggle for analytics rules you want to deploy.

1. When the review is complete, select **Review and migrate**.

## Deploy the Analytics rules

1. Select **Deploy**.

    | Translation Type | Resource deployed |
    |:----|:---|
    | Out of the box | The corresponding solutions from **Content hub** that contain the matched analytics rule templates are installed. The matched rules are deployed as active analytics rules in the disabled state. <br><br>For more information, see [Manage Analytics rule templates](manage-analytics-rule-templates.md). |
    | Custom | Rules are deployed as active analytics rules in the disabled state. |

1. (Optional) Choose Analytics rules and select **Export Templates** to download them as ARM templates for use in your CI/CD or custom deployment processes.

    :::image type="content" source="media/siem-migration/export-templates.png" alt-text="Screenshot showing the Review and Migrate tab highlighting the Export Templates button.":::

1. Before exiting the SIEM Migration experience, select **Download Migration Summary** to keep a summary of the Analytics deployment.

    :::image type="content" source="media/siem-migration/download-migration-summary.png" alt-text="Screenshot showing the Download Migration Summary button from the Review and Migrate tab.":::

## Validate and enable rules

1. View the properties of deployed rules from Microsoft Sentinel **Analytics**.

   - All migrated rules are deployed with the Prefix **[Splunk Migrated]**.
   - All migrated rules are set to disabled.
   - The following properties are retained from the Splunk export wherever possible:<br>
     `Severity`<br>
     `queryFrequency`<br>
     `queryPeriod`<br>
     `triggerOperator`<br>
     `triggerThreshold`<br>
     `suppressionDuration`

1. Enable rules after you review and verify them.

    :::image type="content" source="media/siem-migration/enable-deployed-translated-rules.png" alt-text="Screenshot showing Analytics rules with deployed Splunk rules highlighted ready to be enabled.":::

## Next step

In this article, you learned how to use the SIEM migration experience. 

> [!div class="nextstepaction"]
> [Migrate Splunk detection rules](migration-splunk-detection-rules.md)
