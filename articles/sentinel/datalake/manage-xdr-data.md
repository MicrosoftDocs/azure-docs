---  
title:  Manage XDR Data in Microsoft Sentinel
titleSuffix: Microsoft Security  
description: Manage XDR Data in Microsoft Sentinel
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 07/15/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 


## Manage XDR Data in Microsoft Sentinel

By default, Extended Detection and Response (XDR) data is not ingested to the analytics tier or the data lake tier in Microsoft Sentinel. This means that XDR data is only available for query through Advanced hunting for a maximum of 30 days. To manage XDR data in Microsoft Sentinel and extend the retention period, configure the retention settings in Table Management in the Microsoft Defender portal to enable ingestion into the analytics and the data lake tiers.


## Retention Settings in Table Management

In the Microsoft Defender portal, navigate to **Microsoft Sentinel** > **Configuration** > **Tables**. to configure the retention settings for XDR data tables. The retention settings determine how long data is retained in the analytics tier and whether it's mirrored to the data lake tier.

Select
1.	Increase total retention to more than 30 days using Table Management.
2.	This change:
o	Triggers ingestion into Sentinel Analytics tier.
o	Automatically enables data ingestion into the Sentinel data lake.
⚠️ Currently there is no direct way to configure XDR data export to the Sentinel data lake without first ingesting it into Sentinel Analytics tier. Sentinel Analytics tier ingestion is required.
Data mirroring to the lake is enabled by default for customers who have previously deployed the Sentinel XDR connector, but only for the event tables configured within the connector. To enable mirroring for additional event tables, these customers can configure a retention period greater than 30 days in Table Management for each respective table.

For customers who have not deployed the Sentinel XDR connector, data mirroring to the data lake can be initiated by setting a retention period greater than 30 days in Table Management.

Learn more about XDR events supported by the connector here: https://learn.microsoft.com/en-us/azure/sentinel/connect-microsoft-365-defender?tabs=MDE#connect-events 
________________________________________
Retention and Cost Overview
Free retention windows 
Tier	Retention	Notes
Advanced Hunting (Default)	30 days	Default and included in XDR license
Analytics tier (Log Analytics)	90 days	Free for Sentinel-enabled workspaces (storage only; ingestion charges may apply)
Data lake	Depends on Analytics tier retention	Free for retention overlapping with Analytics tier retention; charged beyond that period.
•	Retaining data in the data lake beyond the Analytics tier period incurs additional storage costs.
To stop sending data to Analytics tier, reset Analytics tier retention and total retention to the default (30 days).
________________________________________
Retention Configuration Examples
Below we provide illustrative examples to help customers understand how different data retention configurations in Table Management affect data storage behavior and associated costs. These examples cover combinations of Analytics and Data lake tier retention settings.
Example 1: Default Retention (30 Days Included in XDR License)
•	Analytics Retention: 30 days
•	Total Retention: 30 days
Notes: Data remains in XDR Advanced Hunting. It is not ingested into Sentinel Analytics or Data lake tier.
•	Cost:
•	Ingestion: No additional cost
•	Retention:
•	Analytics tier: None
•	Data lake tier: None
 
Example 2: 90 days Analytics + 90 days data lake retention
•	Analytics Retention: 90 days
•	Total Retention: 90 days
Note: Data is ingested into the Analytics tier and mirrored to the Data lake tier.
•	Cost:
•	Ingestion: Customer pays for Analytics tier ingestion
•	Retention:
•	Analytics tier: No cost (90 days included)
•	Data lake tier: No cost (mirrored retention matches Analytics tier)
 
Example 3: 90 days Analytics + 180 days data lake retention
•	Analytics Retention: 90 days
•	Total Retention: 180 days
Notes: Data is ingested into the Analytics tier and mirrored to the lake tier.
•	Cost:
•	Ingestion: Customer pays for Analytics tier ingestion
•	Retention:
•	Analytics tier: No cost (90 days included)
•	Data lake tier: Customer pays for 90 days of lake retention (180d - 90d)
 
Example 4: 30 days Analytics + 180 days lake retention
•	Analytics Retention: 30 days
•	Total Retention: 180 days
Note: Changing from the default retention triggers ingestion into the Analytics tier. Data is stored in Analytics for 30 days and mirrored to the lake for 180 days.
Note: Microsoft does not recommend this configuration. Customers get 90 days of Analytics tier retention at no additional storage cost. 
•	Cost:
•	Ingestion: Customer pays for Analytics tier ingestion
•	Retention:
•	Analytics tier: No cost (30 days is within the 90-day included limit)
•	Data lake tier: Customer pays for 150 days of lake retention (180d - 30d)
 
Example 5: 180 days Analytics + 1 year data lake retention
•	Analytics Retention: 180 days
•	Total Retention: 1 year
Notes: Data is stored in Analytics tier for 180 days and mirrored to the data lake for 365 days.
•	Cost:
•	Ingestion: Customer pays for Analytics tier ingestion
•	Retention:
•	Analytics tier: Customer pays for 90 days (180d - 90d included)
•	Data lake tier: Customer pays for 185 days (365d - 180d)
 
