---
title: Use the SIEM migration experience
titleSuffix: Microsoft Sentinel
description: Migrate security monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel. 
author: austinmccollum
ms.topic: how-to
ms.date: 3/11/2024
ms.author: austinmc
appliesto: Microsoft Sentinel

#customer-intent: As an SOC administrator, I want to use the SIEM migration experience so I can migrate to Microsoft Sentinel.
---

# Migrate security monitoring use cases from other SIEM systems to Microsoft Sentinel

Migrate Security Monitoring use cases from other Security Information & Event Management (SIEM) systems to Microsoft Sentinel using the SIEM Migration experience. SIEM Migrations can be an extremely resource intensive. With automated assistance, the migration process can be simplified. 

What features are currently included in the SIEM Migration experience? 

| SIEM | features |
|----|----|
|Splunk | - The experience focuses on migrating Splunk security monitoring to Microsoft Sentinel.<br> - The experience only supports migration of Splunk detections to Microsoft Sentinel Analytics.|

## Prerequisites

You need the following from the source SIEM:

|SIEM | requirements |
|---------|---------|
| Splunk | - The migration experience is compatible with both Splunk Enterprise and Splunk Cloud editions.<br> - A Splunk admin role is required to generate an export with all the Splunk alerts. For more information, see [Splunk role-based user access](https://docs.splunk.com/Documentation/Splunk/9.1.3/Security/Aboutusersandroles).<br> - Export the historical data from Splunk to the relevant tables in the Log Analytics workspace. For more information, see [Export historical data from Splunk](migration-splunk-historical-data.md) |

You need the following on the target, Microsoft Sentinel:

- Deployment of resources (Analytics rules) requires the **Microsoft Sentinel Contributor** role. For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).
- The data type and parser the analytics rule query logic uses must match the tables available in the workspace when enabling the analytics rule. 
- Ingest security data previously used in your source SIEM into Microsoft Sentinel by enabling an out-of-the-box (OOTB) data connector. If the data connector isn't installed yet, find the relevant solution in **Content hub**. If no data connector exists, create a custom ingestion pipeline. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md) or [Custom data ingestion and transformation](data-transformation.md).

## Expectations on translation coverage

The systematic translation of custom rules uses the SPL search query from the Splunk export to generate converted KQL queries for each Splunk rule. This may not be precise and may need further review and adjustments to function and perform as intended in your Microsoft Sentinel workspace. The translation coverage of SPL to KQL is continuously evolving.  

Translation scope is as follows: 

Simple queries with single data source 

100% of systematic translations listed in this document 

Splunk CIM to ASIM translation support (coming soon)  

Specific errors in the translated query will be viewable so that you can edit those specifically and save time in the detection translation journey.  

Coming soon: Clarity on level of translation completeness in the tool with translation states.  

Coming next and not in this scope of translation: 

Multiple data sources and index. 

Rule correlations. 

Support for macros. 

Support for lookups. 

Complex queries with joins.

## Step 1: Start the migration experience

The experience is discoverable in Microsoft Sentinel Content Hub. 

Navigate to the Azure portal. 

Once in the Azure portal, click on **SIEM Migration (Preview)** on the Command bar. 

:::image type="content" source="media/siem-migration/siem-migration-experience.png" alt-text="Screenshot showing content hub with menu item for the SIEM migration experience.":::

## Step 2: Review prerequisites

On landing in the Migration experience, please review the pre-requisites for migrating Spunk rules to Microsoft Sentinel before proceeding. These are the same prerequisites highlighted above. 

## Step 3: Upload Splunk detections

Follow these instructions to export the Splunk detections in the json format: 

Go to Splunk web page and click on "Search and Reporting app" 

Run the following query: 

`| rest splunk_server=local count=0 /services/saved/searches | search disabled=0 | table title,search ,*`

Go to export button on the top right of the result and select the format as JSON. 

Save the file. 

Upload the Splunk export and once imported, click on **Configure Rules**. 

:::image type="content" source="media/siem-migration/upload-file.png" alt-text="Screenshot showing the upload files tab.":::

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

The following Sentinel Analytics’ properties are retained from the Splunk export wherever possible: 

- Severity 
- queryFrequency 
- queryPeriod 
- triggerOperator 
- triggerThreshold 
- suppressionDuration 

### Tips
Unable to enable Analytic rule(s) after deployment 
Check the schema of the datatypes and fields used in the rule logic. Microsoft Sentinel Analytics require that the datatype be present in the Log Analytics Workspace before the rule is enabled. It's also important that the fields used in the query are accurate as per the defined datatype schema. Review the pre-requisites above.

Upload of the Splunk export failed 
The migration wizard expects Splunk export in a valid json format. The upload size of the json is limited to 50mb.

## Next steps

In this article, you learned how to use the SIEM migration experience. 

> [!div class="nextstepaction"]
> Continue to [migrate Splunk detection rules](migration-splunk-detection-rules.md)