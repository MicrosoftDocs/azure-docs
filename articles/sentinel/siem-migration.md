---
title: Use the SIEM migration experience
titleSuffix: Microsoft Sentinel
description: Migrate security monitoring use cases from other Security Information and Event Management (SIEM) systems to Microsoft Sentinel. 
author: austinmccollum
ms.topic: how-to
ms.date: 3/11/2024
ms.author: austinmc
---

# Migrate security monitoring use cases from other SIEM systems to Microsoft Sentinel

The SIEM Migration experience in Microsoft Sentinel helps customers easily migrate Security Monitoring use cases from other Security Information & Event Management (SIEM) systems to Microsoft Sentinel. SIEM Migrations can be an extremely resource intensive, but with automation assistance, the migration process can be simplified. 

What is currently included in SIEM Migration in Microsoft Sentinel? 
- The experience currently helps customers migrate from Splunk to Microsoft Sentinel. 
- The experience currently only supports migration of Splunk detections to Microsoft Sentinel Analytics. 

## Prerequisites

Access Requirements 

On Splunk, Splunk admin role is required to generate the export with all the Splunk alerts. Learn more about Splunk role-based user access configuration here. 

On Azure, deployment of Microsoft Sentinel resources (Analytic Rules) requires Sentinel Contributor access. Learn more about Azure RBAC here. 

Splunk instance to export alerts configuration. 

NOTE: The migration is compatible for both Splunk Enterprise and Splunk Cloud editions. 

Analytic Rule dependencies 

Enabling a Microsoft Sentinel Analytic Rule requires dependencies (datatype and parser) that the Analytic rule query logic uses to exist in the Sentinel/Log Analytics workspace. 

Data Availability 

Export the historical data from Splunk in relevant tables in the Log Analytics Workspace. 

Wherever possible, enable log ingestion into Sentinel by either enabling an OOTB data connector if its already available in Microsoft Sentinel content hub (if not available yet, relevant solutions can be installed and managed from Content Hub. Learn more here OR creating a custom ingestion pipeline to ensure logs start and continue to be ingested. Learn more about Data Connector enablement here. 

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