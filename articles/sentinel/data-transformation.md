---
title: Data transformation in Microsoft Sentinel
description: Learn about how Azure Monitor's data transformation features can help you stream custom data into Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 02/01/2022
---

# Data transformation in Microsoft Sentinel

The much-anticipated ingestion time transformations capability provided by Log Analytics is an important and generic functionality that opens up for MS Sentinel customers many scenarios like filtering, enrichments etc., that could not have been previously performed.
Ingestion time transformations consists of two features:

## Benefits with ingestion-time transformation for Microsoft Sentinel

Prior to the new features of ingestion time transformations most of the transformations capabilities provided by MS Sentinel were query-time capabilities. There were some connectors-specific transformations that could have been performed in the source like xpath filtering for AMA agent but for most of the connectors the ingestion time behavior was quite fixed. For standard logs the transformations performed during ingestion were defined as pre-configured hardcoded workflows with no room for user changes.  For custom logs the behavior was also determined by the input shape and although the output tables were created on the fly users had no control over the output schema and could not change the automatic behavior. The following diagram illustrates MS Sentinel data flows prior to the new ingestion time transformations features:
 


MS Sentinel data flows with ingestion time transformations
With ingestion time transformations MS Sentinel users have much more control over the ingested data. The following diagram describes the new data flows:
 
For custom logs users can set the columns' names and types and they can decide if to ingest the data into a custom table or into a standard table. For standard logs customers can now define their own transformations on top of the pre-configured workflows.
The benefits provided by the new ingestion transformations features are in three areas:
1)	Cost reduction - using the new feature MS Sentinel can now filter out data which is irrelevant to security analysis and thus, reduce storage costs 
2)	Improved analytics - by explicitly defining the output schema, by removing irrelevant data and by enriching the data with additional information customers can now standardize the data according to the SOC analysts needs
3)	Better performance - performing the transformations in the pipeline eliminates the need for performing query time adjustments that were previously required to standardize the ingested data

## Sample scenarios

Filtering
Filtering can be performed both in the record level or in the column level by removing the content of specific fields (add an example)
Enrichments
users can enrich the data with additional columns. These columns may include parsed data from other columns or data taken from static tables added to the configured KQL transformation (add an example)
Obfuscation
Ingestion time transformations can be used to mask or remove personal information such as credit card numbers etc. (add an example)

## Data connector support in Microsoft Sentinel

The DCR based custom logs feature and the ingestion time transformations for standard tables are both based on Data Collection Rules.
Data Collection Rule  
A data collection rule determines the data flows of the different input streams. Each data flow includes the following:
•	Streams – the input streams to be transformed (standard or custom input stream)
•	The destination workspaces names
•	The KQL transformation
•	The output table (for standard input stream it is the same as the input stream)
There are 2 types of DCRs:
1)	Native or "Normal" DCR – currently this type is supported for AMA and Custom logs workflows
2)	Workspace Transform DCR (see below)
Default (Workspace Transform) Data Collection Rule  
A special kind of DCR for workflows that have no "Native" DCR support. The default DCR has the following limitations:
1)	There may be only one DCR per workspace
2)	There may be one transformation for each input stream (e.g., one transformation for Syslog table etc.)
3)	Default DCR is applicable only to a list of supported tables (add link to the list of supported tables)
To learn more about DCR refer to the following link (Add link to the DCR concept document)
MS Sentinel Data Connectors Support for Ingestion-time transformations
MS Sentinel support for ingestion time transformations depends on the data connector type. AMA-based connectors, for example support native DCRs which means users of these connectors may configure different DCRs per each agent and per each input stream. Other connectors (e.g., SCUBA based connectors) support only default DCR which means that users of a certain workspace can only define one transformation per each table. Other connectors like connectors that are currently working with custom logs v2 have no DCR support at all.

### Supported data connectors

* Support depends on the specific connector’s tables
** These connectors are currently using custom logs v1 and they will be gradually migrated to support DCRs
