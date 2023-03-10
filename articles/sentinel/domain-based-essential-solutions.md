---
title: ASIM-based domain solutions - Essentials for Microsoft Sentinel
description: Learn about the Microsoft essential solutions for Microsoft Sentinel that span across different ASIM schemas like networks, DNS, and web sessions.
author: cwatson-cat
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cwatson
#Customer intent: As a security engineer, I want to minimize the amount of solution content I have to deploy and manage by using Microsoft essential solutions for Microsoft Sentinel.
---

# Microsoft essential solutions - Advanced Security Information Model (ASIM) based domain solutions for Microsoft Sentinel

Microsoft essential solutions helps you reduce the amount of content you manage in Microsoft Sentinel for specific domains like Security - Network. Essential solutions use the normalization technique Advanced Security Information Model (ASIM) to normalize the data at query time or ingestion time.

## Why use ASIM-based Microsoft essential solutions

When multiple solutions in a domain category share similar detection patterns, it makes sense to have the data captured under a normalized schema like ASIM. Essential solutions makes use of this ASIM schema to detect threats at scale. 

- A normalized schema makes it easier for you to query incident details. You don't have to remember different vendor syntax for similar log attributes.
- If you don't have to manage content for multiple solutions, it makes use case deployment and incident handling much easier.
- A consolidated workbook view gives you better environment visibility and possible query time parsing with high performing ASIM parsers.

In the content hub, there are multiple product solutions for different domain categories like Security - Network. For example, Azure Firewall, Palo Alto Firewall, and Corelight have product solutions for the Security  -Network domain category.

- These solutions have differing data ingest components by design. But there’s a certain pattern to the analytics, hunting, workbooks, and other content within the same domain category.
- Most of the major network products have a common basic set of firewall alerts that includes malicious threats coming from unusual IP addresses. The analytic rule template is, in general, duplicated for each of the Security - Network category of product solutions. If you're running multiple network products, you need to check and configure multiple analytic rules individually, which is inefficient. You'd also get alerts for each rule configured and might end up with alert fatigue.

If you have duplicative hunting queries, you might have less performant hunting experiences with the run-all mode of hunting. These duplicative hunting queries also introduce inefficiencies for threat hunters to select-run similar queries.

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

## Ingestion time normalization

The ingestion time normalization results can be ingested into following normalized table:

- [ASimDnsActivityLogs](/azure/azure-monitor/reference/tables/asimdnsactivitylogs) for the DNS schema.
- [ASimNetworkSessionLogs](/azure/azure-monitor/reference/tables/asimnetworksessionlogs) for the Network Session schema

For more information, see [Ingest time normalization](/azure/sentinel/normalization-ingest-time).

## Connectors not included

The essential solutions don't have a connector of their own. They depend on the source specific connectors to pull in the logs. Then the solutions use the ASIM parsers in their built in analytic rules, hunting queries, and workbooks to identify anomalies. The ASIM parsers provide a consolidated report or dashboard view for all the source specific solutions that were part of prerequisite lists.

## Network session essentials solution

One of the first solutions available in the essentials series is the network session essential solution. This solution doesn't have a connector of its own. Instead, it uses the ASIM parsers for query time parsing. For more information about this solution, see (Marketplace listing)

## Next steps

- [Using the Advanced Security Information Model (ASIM)](/azure/sentinel/normalization-about-parsers)