---
title: Use the SIEM migration experience
titleSuffix: Microsoft Sentinel
description: Migrate security monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel. 
author: austinmccollum
ms.topic: how-to
ms.date: 3/11/2024
ms.author: austinmc
appliesto: Microsoft Sentinel
#customer intent: As an SOC administrator, I want to use the SIEM migration experience so I can migrate to Microsoft Sentinel.
---

# Migrate to Microsoft Sentinel with the SIEM migration experience (preview)

Migrate Security Monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel using the SIEM Migration experience. SIEM Migrations are often extremely resource intensive. With the automated assistance the SIEM Migration experience provides, the migration process is simplified. 

These features are currently included in the SIEM Migration experience: 

**Splunk**
- The experience focuses on migrating Splunk security monitoring to Microsoft Sentinel.
- The experience only supports migration of Splunk detections to Microsoft Sentinel Analytics.|

## Prerequisites

You need the following from the source SIEM:

**Splunk**
- The migration experience is compatible with both Splunk Enterprise and Splunk Cloud editions.
- A Splunk admin role is required to export all Splunk alerts. For more information, see [Splunk role-based user access](https://docs.splunk.com/Documentation/Splunk/9.1.3/Security/Aboutusersandroles).
- Export the historical data from Splunk to the relevant tables in the Log Analytics workspace. For more information, see [Export historical data from Splunk](migration-splunk-historical-data.md)

You need the following on the target, Microsoft Sentinel:

- Deployment of resources (Analytics rules) requires the **Microsoft Sentinel Contributor** role. For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md). 
- Ingest security data previously used in your source SIEM into Microsoft Sentinel by enabling an out-of-the-box (OOTB) data connector. If the data connector isn't installed yet, find the relevant solution in **Content hub**. If no data connector exists, create a custom ingestion pipeline. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md) or [Custom data ingestion and transformation](data-transformation.md).

## Consider translation concepts

At the core of Splunk detection rules is the Search Processing Language (SPL). The SIEM migration experience systematically translates the SPL search queries to generate Kusto query language (KQL) queries for each Splunk rule. Carefully review translations and make adjustments to ensure migrated rules function as intended in your Microsoft Sentinel workspace. 

Consider the following translation capabilities as you plan your migration:

Capabilities today:

- Simple queries with a single data source
- 100% of (?systematic translations?) direct translations listed in this [article](/azure/data-explorer/kusto/query/splunk-cheat-sheet)
- Specific errors in the translated query will be viewable so that you can edit those specifically and save time in the detection translation journey. 

Capabilities coming soon:

- Splunk CIM to ASIM translation support
- Clarity on level of translation completeness in the tool with translation states  

Capabilities on the roadmap: 
- Multiple data sources and index
- Rule correlations
- Support for macros
- Support for lookups 
- Complex queries with joins

## Start the migration experience

The experience is discoverable in Microsoft Sentinel Content Hub. 

1. Navigate to the Azure portal. 

1. Once in the Azure portal, click on **SIEM Migration (Preview)** on the Command bar. 

:::image type="content" source="media/siem-migration/siem-migration-experience.png" alt-text="Screenshot showing content hub with menu item for the SIEM migration experience.":::

## Upload Splunk detections

Follow these instructions to export the Splunk detections in the json format: 

Go to Splunk web page and click on "Search and Reporting app" 

Run the following query: 

`| rest splunk_server=local count=0 /services/saved/searches | search disabled=0 | table title,search ,*`

Go to export button on the top right of the result and select the format as JSON. 

Save the file. 

Upload the Splunk export and once imported, click on **Configure Rules**. 

:::image type="content" source="media/siem-migration/upload-file.png" alt-text="Screenshot showing the upload files tab.":::

Upload of the Splunk export failed 
The migration wizard expects Splunk export in a valid json format. The upload size of the json is limited to 50mb.

## Step 4: Configure rules

On the Configure Rules page, review the Analysis of the Splunk export using the following guidance: 

Name indicates the name of the Splunk detection. 

OOTB Compatibility indicates if the analysis has identified a corresponding Sentinel OOTB that matches the Splunk detection logic. 

:::image type="content" source="media/siem-migration/configure-rules.png" alt-text="Screenshot showing the results of the automatic rule mapping." lightbox="media/siem-migration/configure-rules.png":::

## Step 5: Deploy the Analytics rules

Click on **Deploy** to start the deployment of Analytics in your Microsoft Sentinel workspace. 

The following resources will be deployed: 

For all out of the box compatible matches, the corresponding solutions that the matched Analytic is a part of will be installed, and the matched rules will be deployed as a active Analytic rules. 

All custom rules translated to Sentinel Analytics are deployed as active Analytic rules. 

Properties of deployed Microsoft Sentinel Analytics 

All migrated rules are deployed with the Prefix **[Splunk Migrated]** in the title in the Analytics gallery. 

All migrated rules are deployed in a disabled state. These can be reviewed and enabled after deployment from the Analytics page. 

Unable to enable Analytic rule(s) after deployment 
Check the schema of the data types and fields used in the rule logic. Microsoft Sentinel Analytics require that the datatype be present in the Log Analytics Workspace before the rule is enabled. It's also important that the fields used in the query are accurate as per the defined datatype schema. Review the pre-requisites above.

The following Sentinel Analytics’ properties are retained from the Splunk export wherever possible: 

- Severity 
- queryFrequency 
- queryPeriod 
- triggerOperator 
- triggerThreshold 
- suppressionDuration 

## Next steps

In this article, you learned how to use the SIEM migration experience. 

> [!div class="nextstepaction"]
> Continue to [migrate Splunk detection rules](migration-splunk-detection-rules.md)