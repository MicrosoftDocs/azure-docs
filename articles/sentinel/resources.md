---
title: Useful resources when working with Azure Sentinel
description: This document provides you with a list of useful resources when working with Azure Sentinel.
services: sentinel
author: yelevin
manager: rkarlin
ms.assetid: 9b4c8e38-c986-4223-aa24-a71b01cb15ae
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 03/03/2021
ms.author: yelevin
---
# Useful resources for working with Azure Sentinel

This article lists resources that can help you get more information about working with Azure Sentinel.

## Learn more about creating queries

Azure Sentinel uses Azure Monitor Log Analytics's Kusto Query Language (KQL) to build queries. For more information, see:

- [KQL concepts](/azure/data-explorer/kusto/concepts/)
- [KQL queries](/azure/data-explorer/kusto/query/)
- [KQL quick reference guide](/azure/data-explorer/kql-quick-reference).
- [Get started with KQL queries](../azure-monitor/logs/get-started-queries.md)

## Learn more about creating automation

Create automation in Azure Sentinel using Azure Logic Apps, with a growing gallery of built-in playbooks. 

For more information, see [Azure Logic Apps connectors](/connectors/).

## Compare playbooks, workbooks, and notebooks

The following table describes the differences between playbooks, workbooks, and notebooks in Azure Sentinel:

| Category |Playbooks  |Workbooks  |Notebooks  |
|---------|---------|---------|---------|
|**Personas**     |   <ul><li>SOC engineers</li><li>Analysts of all tiers</li></ul>      | <ul><li> SOC engineers</li><li>Analysts of all tiers</li></ul>       | <ul><li>Threat hunters and Tier-2/Tier-3 analysts</li><li>Incident investigators</li><li>Data scientists</li><li>Security researchers</li></ul>       |
|**Uses**     | Automation of simple, repeatable tasks:<ul><li>Ingesting external data </li><li>Data enrichment with TI, GeoIP lookups, and more </li><li> Investigation </li><li>Remediation </li></ul>       | <ul><li>Visualization</li></ul>        |   <ul><li>Querying Azure Sentinel data and external data </li><li>Data enrichment with TI, GeoIP lookups, and WhoIs lookups, and more </li><li> Investigation </li><li> Visualization </li><li> Hunting </li><li>Machine learning and big data analytics </li></ul>      |
|**Advantages**     |<ul><li> Best for single, repeatable tasks </li><li>No coding knowledge required  </li></ul>      |<ul><li>Best for a high-level view of Azure Sentinel data </li><li>No coding knowledge required</li></ul>       | <ul><li>Best for complex chains of repeatable tasks </li><li>Ad-hoc, more procedural control</li><li>Easier to pivot with interactive functionality </li><li>Rich Python libraries for data manipulation and visualization </li><li>Machine learning and custom analysis </li><li>Easy to document and share analysis evidence </li></ul>       |
|**Challenges**     | <ul><li>Not suitable for ad-hoc and complex chains of tasks </li><li>Not ideal for documenting and sharing evidence</li></ul>        |   <ul><li>Cannot integrate with external data </li></ul>     |    <ul><li> High learning curve and requires coding knowledge </li></ul>   |
|  **More information**   | [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md)        | [Visualize collected data](get-visibility.md)        | [Use Jupyter notebooks to hunt for security threats](notebooks.md)        |
|     |         |         |         |

## Comment on our blogs and forums

We love hearing from our users.

In the TechCommunity space for Azure Sentinel:

- [View and comment on recent blog posts](https://techcommunity.microsoft.com/t5/Azure-Sentinel/bg-p/AzureSentinelBlog)
- [Post your own questions about Azure Sentinel](https://techcommunity.microsoft.com/t5/Azure-Sentinel/bd-p/AzureSentinel)

You can also send suggestions for improvements via our [User Voice](https://feedback.azure.com/forums/920458-azure-sentinel) program.

## Join the Azure Sentinel GitHub community

The [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel) is a powerful resource for threat detection and automation. 

Our Microsoft security analysts constantly create and add new workbooks, playbooks, hunting queries, and more, posting them to the community for you to use in your environment. 

Download sample content from the private community GitHub repository to create custom workbooks, hunting queries, notebooks, and playbooks for Azure Sentinel.

## Next steps

> [!div class="nextstepaction"]
> [Get certified!](/learn/paths/security-ops-sentinel/)

> [!div class="nextstepaction"]
> [Read customer use case stories](https://customers.microsoft.com/en-us/search?sq=%22Azure%20Sentinel%20%22&ff=&p=0&so=story_publish_date%20desc)