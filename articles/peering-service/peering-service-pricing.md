---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
manager: 
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 
ms.author: ypitsch
---

# Peering Service - Pricing
- Routing optimization with last mile partner (Google parity ask) – free
- MAPS Service in Azure (Telemetry): $15/prefix at /24 granularity

- $/prefix pricing aligns to O365 business model and industry-comparable monitoring-tools. The other pricing models considers where

	 - $/GB – charging on O365 BW drives suboptimal behavior on customer side.
	 - $ per 50 GB blocks – same as above
	 - $/user - $1/user is too high for telemetry

The list of comparable are below. 

Most of the pricing model cloud NPM (Network performance monitoring) is based on connection i.e. from one site (source) to another site (destination). 

| **Product** | **Product Category**|**Pricing**|
|-----------|---------|---------|
| BGPMon (product EOLed) | Route analytics| $13 / prefix /month|
| ThousandEyes (BGP route monitoring) | Route analytics |Route analytics |
| In case, a Partner-Microsoft interconnect node goes down, Partner must route the traffic to Microsoft through alternate sites.| $12.6 / prefix / month|
|Cisco (CrossWorks Networks Insights)| Route analytics|$64 / prefix / month|
| ThousandEyes (SaaS monitoring)| Cloud NPM |Cloud NPM |$ 7.9 / connection / month (connection - office to a public cloud app)|
| AppNeta |Cloud NPM |Cloud NPM |$ / location / month (location – small office, large office, DC)|
| Catchpoint (Cloud NPM)| Platform price + $ / location / month|
| Exoprise| Cloud NPM / $ / connection / month (connection - office to a public cloud app)|

Pricing are based per prefix or per location to a cloud application monitoring. For example, exchange, skype, SharePoint, salesforce are different cloud applications.

Few Examples
- $/prefix is applied at /24 granularity 
- A MAPS connection is a connectivity from a user’s Internet breakout location to Microsoft 
- No two connections cannot have the same IP prefix

| **Scenario** | **Customer signup**|**Bill**|
|-----------|---------|---------|
|1.	A Customer has a single HQ and breakouts internet from that HQ. Its carrier has allocated a /27 IP address | purchases single MAPS connection and registers there /27	| $15/month|
| 2.	A customer breaks out from its HQ and uses a /24 for internet breakout |	purchases single connection and registers /24 | $15/month|
| 3.	A customer breakouts for Internet from 4 different location across the globe. At each location it uses a /25 for breakout	purchases 4 connections and registers the /25 prefix against each connection | $60/month|
|4.	A customer breakouts for Internet at a single DC and uses a /22 for breakout| customer purchases single connection and registers /22 |$60/month |

## Pricing models considered and feedback
|Model	|Example|	Alignment with Azure|	Alignment with O365|	Pros|	Cons|	Business potential|
|-----------|---------|---------|--------|--------|--------|--------|
|$/prefix	|$14 / prefix (granularity of /24)|	No|	Yes|	From O365 perspective each prefix represents a branch office. This aligns to subscription-based model where users are not charged cents for each seat. Aligns with industry comparable for telemetry |	Doesn’t align to IaaS consumption model	$28M|
|$/user |	$1/user	|No	|Not recommended ($1 is too high)|	Aligns with SaaS model |	$1/user needs to bring in lot of value. Hard to justify MAPS value as $1/user (Will have to test the market)|	$198M|
|$/GB on all traffic|	$0.03/GB|	Yes |	No	|In the past this didn’t align to O365 billing principle. |	Limited scope of monetization. Upper bound of avg O365 user is 2 GB |	$12M |
|$ per 50 GB|	$3 per 100 GB traffic	|Yes	|No	|Similar to $/GB but at block level|	Limited scope of monetization. Upper bound of avg O365 user is 2 GB	|$12M |

## Assumption
-	165M office user
-	10% market penetration 
-	An avg O365 users sends 2GB out of MS datacenter (extracted some data from AFD and non-AFB traffic)


