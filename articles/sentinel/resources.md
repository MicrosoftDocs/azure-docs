---
title: Compare playbooks, workbooks, and notebooks | Microsoft Sentinel
description: Learn about the differences between playbooks, workbooks, and notebooks in Microsoft Sentinel.
author: batamig
ms.topic: conceptual
ms.date: 09/11/2024
ms.author: bagol


#Customer intent: As a SOC engineer or analyst, I want to understand the differences between playbooks, workbooks, and notebooks so that I can choose the appropriate tool for automation, visualization, and data analysis tasks.

---

# Compare workbooks, playbooks, and notebooks

Workbooks, playbooks, and notebooks are key resources in Microsoft Sentinel that help you automate responses, visualize data, and analyze data, respectively. Sometimes it can be challenging to track which type of resource is right for your task.

This article helps to differentiate between workbooks, playbooks, and notebooks in Microsoft Sentinel:

- After you connect your data sources to Microsoft Sentinel, visualize and monitor the data using [workbooks in Microsoft Sentinel](monitor-your-data.md). Microsoft Sentinel workbooks are based on [Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview), and add tables and charts with analytics for your logs and queries to the tools already available in Azure.
- [Jupyter notebooks in Microsoft Sentinel](notebooks.md) are a powerful tool for security investigations and hunting, providing full programmability with a huge collection of libraries for machine learning, visualization, and data analysis. While many common tasks can be carried out in the portal, Jupyter extends the scope of what you can do with this data.
- Use [Microsoft Sentinel playbooks](automate-responses-with-playbooks.md) to run preconfigured sets of remediation actions to help automate and orchestrate your threat response.

## Compare by persona

The following table compares Microsoft Sentinel playbooks, workbooks, and notebooks by the user persona:

|Resource  |Description  |
|---------|---------|
|**[Workbooks](monitor-your-data.md)**     |  <ul><li> SOC engineers</li><li>Analysts of all tiers</li></ul>          |
|**[Notebooks](notebooks.md)**     |  <ul><li>Threat hunters and Tier-2/Tier-3 analysts</li><li>Incident investigators</li><li>Data scientists</li><li>Security researchers</li></ul>        |
|**[Playbooks](automate-responses-with-playbooks.md)**     |  <ul><li>SOC engineers</li><li>Analysts of all tiers</li></ul>          |

## Compare by use

The following table compares Microsoft Sentinel playbooks, workbooks, and notebooks by use case:

|Resource  |Description  |
|---------|---------|
|**[Playbooks](automate-responses-with-playbooks.md)**     |   Automation of simple, repeatable tasks:<ul><li>Ingesting external data </li><li>Data enrichment with TI, GeoIP lookups, and more </li><li> Investigation </li><li>Remediation </li></ul>       |
|**[Notebooks](notebooks.md)**     | <ul><li>Querying Microsoft Sentinel data and external data </li><li>Data enrichment with TI, GeoIP lookups, and WhoIs lookups, and more </li><li> Investigation </li><li> Visualization </li><li> Hunting </li><li>Machine learning and big data analytics </li></ul>         |
|**[Workbooks](monitor-your-data.md)**     | <ul><li>Visualization</li></ul>          |


## Compare by advantages and challenges

The following table compares the advantages and disadvantages of playbooks, workbooks, and notebooks in Microsoft Sentinel:

|Resource  |Advantages  | Challenges |
|---------|---------|---------|
|**[Playbooks](automate-responses-with-playbooks.md)**     |   <ul><li> Best for single, repeatable tasks </li><li>No coding knowledge required  </li></ul>      |    <ul><li>Not suitable for ad-hoc and complex chains of tasks </li><li>Not ideal for documenting and sharing evidence</li></ul>     | 
|**[Notebooks](notebooks.md)**     |    <ul><li>Best for complex chains of repeatable tasks </li><li>Ad-hoc, more procedural control</li><li>Easier to pivot with interactive functionality </li><li>Rich Python libraries for data manipulation and visualization </li><li>Machine learning and custom analysis </li><li>Easy to document and share analysis evidence </li></ul>        |   <ul><li> High learning curve and requires coding knowledge </li></ul>   |
|**[Workbooks](monitor-your-data.md)**     |   <ul><li>Best for a high-level view of Microsoft Sentinel data </li><li>No coding knowledge required</li></ul>       | <ul><li>Can't integrate with external data </li></ul>    |
