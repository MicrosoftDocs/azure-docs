---
title: Microsoft essential solutions for Microsoft Sentinel
description: Learn about the Microsoft essential solutions for Microsoft Sentinel that span across different ASIM schemas like networks, DNS, and web sessions.
author: cwatson-cat
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cwatson
#Customer intent: As a security engineer, I want to minimize the amount of solution content I have to deploy and manage by using Microsoft essential solutions for Microsoft Sentinel.
---

# Microsoft essential solutions for Microsoft Sentinel

Microsoft essential solutions are a collection of solutions that....provide centralized content for specific domain categories...?  Essential solutions use the normalization technique Advanced Security Information Model (ASIM) to normalize the data at query time or ingestion time. The ingestion time normalization results can be ingested into following normalized table:

- [ASimDnsActivityLogs](/azure/azure-monitor/reference/tables/asimdnsactivitylogs) for the DNS schema.
- [ASimNetworkSessionLogs](/azure/azure-monitor/reference/tables/asimnetworksessionlogs) for the Network Session schema

For more information, see [Ingest time normalization](/azure/sentinel/normalization-ingest-time).

## Why Microsoft essential solutions

Today, we have over 280 product solutions in the content hub. There are multiple product solutions for different domain categories like Security - Network. For example, Azure Firewall, Palo Alto Firewall, and Corelight have product solutions for the Security-Network domain category. 

- These solutions have differing data ingest components by design. But there’s a certain pattern to the analytics, hunting, workbooks, and other content within the same domain category.
- Most of the major network products have a common basic set of firewall alerts that includes malicious threats coming from unusual IP addresses. The analytic rule template is, in general, duplicated for each of the Security - Network category of product solutions. If you're running multiple network products, you need to check and configure multiple analytic rules individually, which is inefficient. You'd also get alerts for each rule configured and might end up with alert fatigue.

If you have duplicative hunting queries, you might have less performant hunting experiences with the run-all mode of hunting. These duplicative hunting queries also introduce inefficiencies for threat hunters to select-run similar queries.

Microsoft essential solution reduces the amount of content you need to manage or provides efficiencies in.... 

## ASIM schemas supported

The essentials solutions are currently spanned across the following different ASIM schemas that Sentinel supports:

- Audit event
- Authentication event
- DNS activity
- File activity
- Network session
- Process event
- Web session

For more information, see [Advanced Security Information Model (ASIM) schemas](/azure/sentinel/normalization-about-schemas).

## Connectors not included

The essential solutions don't have a connector of their own. They depend on the source specific connectors to pull in the logs. Then the solutions use the ASIM parsers in their built in analytic rules, hunting queries, and workbooks to identify anomalies. The ASIM parsers provide a consolidated report or dashboard view for all the source specific solutions that were part of prerequisite lists.

## Network session essentials solution

One of the first solutions available in the essentials series is the network session essential solution. This solution doesn't have a connector of its own. Instead, it uses the ASIM parsers for query time parsing. This solution comes with seven analytic rules, four hunting queries, one playbook, one workbook, and watchlists.

Analytics rules included:

- Network session traffic anomaly
- Anomaly in port usage
- More than defined port usage
- Excessive number of failed connections from a Single source
- Detect possible flooding  
- Possible external to internal port sweep 
- Possible port scan
- Potential Beaconing activity
- TI map IP entity to Network Session Events

Hunting queries included:

- Detect Anomaly in port usage
- Detect More than defined port usage
- Detect multiple users with same MAC address
- Destination App and associated standard port mismatch

Playbook: Summarization playbook

- The playbook summarizes end point security events and stores them in a pre-defined table. 
- This playbook is helpful where you have a high number of end points security events. For example, you might have a high number of events in a large organization where network traffic is being monitoring by multiple source specific network solutions.

- By default, this playbook is available as a template. If you have a high number of end point security events on your network and you notice a performance issue when loading the workbook, then enable the playbook template.

Workbook:
The workbook covers details for the following listed events.

- Traffic visibility
- Security visibility
- Policy rule
- Network security event viewer
