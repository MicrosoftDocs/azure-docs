---
title: Useful resources when working with Microsoft Sentinel
description: This document provides you with a list of useful resources when working with Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Useful resources for working with Microsoft Sentinel

This article lists resources that can help you get more information about working with Microsoft Sentinel.

## Learn more about creating queries

Microsoft Sentinel uses Azure Monitor Log Analytics's Kusto Query Language (KQL) to build queries. For more information, see:

- [Kusto Query Language in Microsoft Sentinel](kusto-overview.md)
- [Useful resources for working with Kusto Query Language in Microsoft Sentinel](kusto-resources.md)

## Microsoft Sentinel templates for data to monitor

The [Microsoft Entra Security Operations Guide](../active-directory/fundamentals/security-operations-introduction.md) includes specific guidance and knowledge about data that's important to monitor for security purposes, for several operational areas. 

In each article, check for sections named [Things to monitor](../active-directory/fundamentals/security-operations-privileged-accounts.md#things-to-monitor) for lists of events that we recommend alerting on and investigating, as well as analytics rule templates to deploy directly to Microsoft Sentinel.

## Learn more about creating automation

Create automation in Microsoft Sentinel using Azure Logic Apps, with a growing gallery of built-in playbooks. 

For more information, see [Azure Logic Apps connectors](/connectors/).

## Compare playbooks, workbooks, and notebooks

The following table describes the differences between playbooks, workbooks, and notebooks in Microsoft Sentinel:

| Category |Playbooks  |Workbooks  |Notebooks  |
|---------|---------|---------|---------|
|**Personas**     |   <ul><li>SOC engineers</li><li>Analysts of all tiers</li></ul>      | <ul><li> SOC engineers</li><li>Analysts of all tiers</li></ul>       | <ul><li>Threat hunters and Tier-2/Tier-3 analysts</li><li>Incident investigators</li><li>Data scientists</li><li>Security researchers</li></ul>       |
|**Uses**     | Automation of simple, repeatable tasks:<ul><li>Ingesting external data </li><li>Data enrichment with TI, GeoIP lookups, and more </li><li> Investigation </li><li>Remediation </li></ul>       | <ul><li>Visualization</li></ul>        |   <ul><li>Querying Microsoft Sentinel data and external data </li><li>Data enrichment with TI, GeoIP lookups, and WhoIs lookups, and more </li><li> Investigation </li><li> Visualization </li><li> Hunting </li><li>Machine learning and big data analytics </li></ul>      |
|**Advantages**     |<ul><li> Best for single, repeatable tasks </li><li>No coding knowledge required  </li></ul>      |<ul><li>Best for a high-level view of Microsoft Sentinel data </li><li>No coding knowledge required</li></ul>       | <ul><li>Best for complex chains of repeatable tasks </li><li>Ad-hoc, more procedural control</li><li>Easier to pivot with interactive functionality </li><li>Rich Python libraries for data manipulation and visualization </li><li>Machine learning and custom analysis </li><li>Easy to document and share analysis evidence </li></ul>       |
|**Challenges**     | <ul><li>Not suitable for ad-hoc and complex chains of tasks </li><li>Not ideal for documenting and sharing evidence</li></ul>        |   <ul><li>Cannot integrate with external data </li></ul>     |    <ul><li> High learning curve and requires coding knowledge </li></ul>   |
|  **More information**   | [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)        | [Visualize collected data](get-visibility.md)        | [Use Jupyter notebooks to hunt for security threats](notebooks.md)        |


## Comment on our blogs and forums

We love hearing from our users.

In the TechCommunity space for Microsoft Sentinel:

- [View and comment on recent blog posts](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/bg-p/MicrosoftSentinelBlog)
- [Post your own questions about Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel/bd-p/MicrosoftSentinel)

You can also send suggestions for improvements via our [User Voice](https://feedback.azure.com/d365community/forum/37638d17-0625-ec11-b6e6-000d3a4f07b8) program.

## Join the Microsoft Sentinel GitHub community

The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel) is a powerful resource for threat detection and automation. 

Our Microsoft security analysts constantly create and add new workbooks, playbooks, hunting queries, and more, posting them to the community for you to use in your environment. 

Download sample content from the private community GitHub repository to create custom workbooks, hunting queries, notebooks, and playbooks for Microsoft Sentinel.

## Next steps

> [!div class="nextstepaction"]
> [Get certified!](/training/paths/security-ops-sentinel/)

> [!div class="nextstepaction"]
> [Read customer use case stories](https://customers.microsoft.com/en-us/search?sq=%22Azure%20Sentinel%20%22&ff=&p=0&so=story_publish_date%20desc)
