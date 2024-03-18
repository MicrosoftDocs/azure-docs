---
title: Use the SIEM migration experience
titleSuffix: Microsoft Sentinel
description: Migrate security monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel. 
author: austinmccollum
ms.topic: how-to
ms.date: 3/11/2024
ms.author: austinmc
#customer intent: As an SOC administrator, I want to use the SIEM migration experience so I can migrate to Microsoft Sentinel.
---

# Migrate to Microsoft Sentinel with the SIEM migration experience (preview)

Migrate your SIEM to Microsoft Sentinel for all your security monitoring use cases. Automated assistance from the SIEM Migration experience simplifies your migration. 

These features are currently included in the SIEM Migration experience: 

**Splunk**
- The experience focuses on migrating Splunk security monitoring to Microsoft Sentinel.
- The experience only supports migration of Splunk detections to Microsoft Sentinel analytics rules.

## Prerequisites

You need the following from the source SIEM:

**Splunk**
- The migration experience is compatible with both Splunk Enterprise and Splunk Cloud editions.
- A Splunk admin role is required to export all Splunk alerts. For more information, see [Splunk role-based user access](https://docs.splunk.com/Documentation/Splunk/9.1.3/Security/Aboutusersandroles).
- Export the historical data from Splunk to the relevant tables in the Log Analytics workspace. For more information, see [Export historical data from Splunk](migration-splunk-historical-data.md)

You need the following on the target, Microsoft Sentinel:

- The SIEM migration experience deploys analytics rules. This capability requires the **Microsoft Sentinel Contributor** role. For more information, see [Permissions in Microsoft Sentinel](roles.md). 
- Ingest security data previously used in your source SIEM into Microsoft Sentinel by enabling an out-of-the-box (OOTB) data connector. 
    - If the data connector isn't installed yet, find the relevant solution in **Content hub**. 
    - If no data connector exists, create a custom ingestion pipeline.<br>For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md) or [Custom data ingestion and transformation](data-transformation.md).

## Translate Splunk detection rules

At the core of Splunk detection rules is the Search Processing Language (SPL). The SIEM migration experience systematically translates SPL to Kusto query language (KQL) for each Splunk rule. Carefully review translations and make adjustments to ensure migrated rules function as intended in your Microsoft Sentinel workspace. For more information on the concepts important in translating detection rules, see [migrate Splunk detection rules](migration-splunk-detection-rules.md).

Capabilities in public preview:

- Translate simple queries with a single data source
- Direct translations listed in the article, [Splunk to Kusto cheat sheet](/azure/data-explorer/kusto/query/splunk-cheat-sheet)
- Review translated query error feedback with edit capability to save time in the detection rule translation process

Here are some of the priorities that are important to us as we continue to develop the translation technology:

- Splunk Common Information Model (CIM) to Microsoft Sentinel's Advanced Security Information Model (ASIM) translation support
- Translated queries feature a completeness status with translation states 
- Multiple data sources and index
- Rule correlations
- Support for macros
- Support for lookups 
- Complex queries with joins

## Start the SIEM migration experience

1. Navigate to Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.

1. Select **SIEM Migration (Preview)**. 

:::image type="content" source="media/siem-migration/siem-migration-experience.png" alt-text="Screenshot showing content hub with menu item for the SIEM migration experience.":::

## Upload Splunk detections

1. From Splunk Web, select **Search and Reporting** in the **Apps** panel. 

1. Run the following query: 

    `| rest splunk_server=local count=0 /services/saved/searches | search disabled=0 | table title,search ,*`

1. Select the export button and choose JSON as the format. 

1. Save the file. 

1. Upload the exported Splunk JSON file.

> [!NOTE]
> The Splunk export must be a valid JSON file and the upload size is limited to 50 MB.

:::image type="content" source="media/siem-migration/upload-file.png" alt-text="Screenshot showing the upload files tab.":::

## Configure rules

1. Select **Configure Rules**.

1. Review the analysis of the Splunk export.

    - **Name** is the original Splunk detection rule name.
    - **Compatibility** indicates if a Sentinel OOTB analytics rule matches the Splunk detection logic. 

    :::image type="content" source="media/siem-migration/configure-rules.png" alt-text="Screenshot showing the results of the automatic rule mapping." lightbox="media/siem-migration/configure-rules.png":::

    > [!NOTE]
    > Check the schema of the data types and fields used in the rule logic. Microsoft Sentinel Analytics require that the data type be present in the Log Analytics Workspace before the rule is enabled. It's also important the fields used in the query are accurate for the defined data type schema.

1. When the review is complete, select **Review and migrate**.

## Deploy the Analytics rules

1. Select **Deploy** to start the deployment of analytics rules to your Microsoft Sentinel workspace. 

   The following resources are deployed:
   - For all OOTB matches, the corresponding solutions with the matched analytics rule are installed, and the matched rules are deployed as active analytics rules.
   - All custom rules translated to Sentinel analytics rules are deployed as active analytics rules.

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

1. Enable rules you've reviewed and verified. 

## Next step

In this article, you learned how to use the SIEM migration experience. 

> [!div class="nextstepaction"]
> [Migrate Splunk detection rules](migration-splunk-detection-rules.md)
