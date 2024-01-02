---
title: ASIM-based domain solutions - Essentials for Microsoft Sentinel
description: Learn about the Microsoft essential solutions for Microsoft Sentinel that span across different ASIM schemas like networks, DNS, and web sessions.
author: cwatson-cat
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cwatson
#Customer intent: As a security engineer, I want to learn how I can minimize the amount of solution content I have to deploy and manage by using Microsoft essential solutions for Microsoft Sentinel.
---

# Advanced Security Information Model (ASIM) based domain solutions for Microsoft Sentinel (preview)

Microsoft essential solutions are domain solutions published by Microsoft for Microsoft Sentinel. These solutions have out-of-the-box content which can operate across multiple products for specific categories like networking. Some of these essential solutions use the normalization technique Advanced Security Information Model (ASIM) to normalize the data at query time or ingestion time.

> [!IMPORTANT]
> Microsoft essential solutions and the Network Session Essentials solution are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Why use ASIM-based Microsoft essential solutions?

When multiple solutions in a domain category share similar detection patterns, it makes sense to have the data captured under a normalized schema like ASIM. Essential solutions makes use of this ASIM schema to detect threats at scale.

In the content hub, there are multiple product solutions for different domain categories like "Security - Network". For example, Azure Firewall, Palo Alto Firewall, and Corelight have product solutions for the "Security - Network" domain category.

- These solutions have differing data ingest components by design. But there’s a certain pattern to the analytics, hunting, workbooks, and other content within the same domain category.
- Most of the major network products have a common basic set of firewall alerts that includes malicious threats coming from unusual IP addresses. The analytic rule template is, in general, duplicated for each of the "Security - Network" category of product solutions. If you're running multiple network products, you need to check and configure multiple analytic rules individually, which is inefficient. You'd also get alerts for each rule configured and might end up with alert fatigue.
- If you have duplicative hunting queries, you might have less performant hunting experiences with the run-all mode of hunting. These duplicative hunting queries also introduce inefficiencies for threat hunters to select and run similar queries.

You might consider Microsoft essential solutions for the following reasons:

- A normalized schema makes it easier for you to query incident details. You don't have to remember different vendor syntax for similar log attributes.
- If you don't have to manage content for multiple solutions, use case deployment and incident handling is much easier.
- A consolidated workbook view gives you better environment visibility and possible query time parsing with high performing ASIM parsers.

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

## Content available with ASIM-based domain essential solutions

The following table describes the type of content available with each essential solution. For some specific use cases, you might want to also use the content available with the Microsoft Sentinel product solution.

|Content type |description |
|---------|---------|
|Analytical Rule    |  The analytical rules available in the ASIM-based essential solutions are generic and a good fit for any of the dependent Microsoft Sentinel product solutions for that domain. The Microsoft Sentinel product solution might have a source specific use case covered as part of the analytical rule. Enable Microsoft Sentinel product solution rules as needed for your environment.        |
|Hunting query     |   The hunting queries available in the ASIM-based essential solutions are generic and a good fit to hunt for threats from any of the dependent Microsoft Sentinel product solutions for that domain. The Microsoft Sentinel product solution might have a source specific hunting query available out-of-the-box. Use the hunting queries from the Microsoft Sentinel product solution as needed for your environment.      |
|Playbook     |  The ASIM-based essential solutions are expected to handle data with very high events per seconds. When you have content that's using that volume of data, you might experience some performance impact that can cause slow loading of workbooks or query results. To solve this problem, the summarization playbook summarizes the source logs and stores the information into a predefined table. Enable the summarization playbook to allow the essential solutions to query this table.<br><br> Because playbooks in Microsoft Sentinel are based on workflows built in Azure Logic Apps which create separate resources, additional charges might apply. For more information, see the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/). Additional charges might also apply for storage of the summarized data. |
|Watchlist    | The ASIM-based essential solutions use a watchlist that includes multiple sets of conditions for analytic rule detection and hunting queries. The watchlist allows you to do the following tasks:<br><br>- Do focused monitoring with data filtration. <br>- Switch between hunting and detection for each list item. <br>- Keep **Threshold type** set to **Static** to leverage threshold-based alerting while anomaly-based alerts would learn from the last few days of data (maximum 14 days). <br>- Modify **Alert Name**, **Description**, **Tactic** and **Severity** by using this watchlist for individual list items.<br>- Disable detection by setting **Severity** as **Disabled**.        |
|Workbook     | The workbook available with the ASIM-based essential solutions gives a consolidated view of different events and activity happening in the dependent domain. Because this workbook fetches results from a very high volume of data, there might be some performance lag. If you experience performance issues, use the summarization playbook.|

These essential solutions like other Microsoft Sentinel domain solutions don't have a connector of their own. They depend on the source specific connectors in Microsoft Sentinel product solutions to pull in the logs. To understand the products the domain solution supports, refer to the prerequisite list of product solutions each of the ASIM domain essentials solutions lists. Install one or more of the product solutions. Configure the data connectors to meet the underlying product dependency needs and to enable better usage of this domain solution content.  


## Next steps

- [Find ASIM-based domain essential solutions](sentinel-solutions-catalog.md) like the Network Session Essentials and DNS Essentials Solution for Microsoft Sentinel
- [Using the Advanced Security Information Model (ASIM)](/azure/sentinel/normalization-about-parsers)
