---
title: Compare playbooks, workbooks, and notebooks | Microsoft Sentinel
description: Learn about the differences between playbooks, workbooks, and notebooks in Microsoft Sentinel.
author: batamig
ms.topic: conceptual
ms.date: 02/26/2024
ms.author: bagol
---

# Compare playbooks, workbooks, and notebooks

This article describes the differences between playbooks, workbooks, and notebooks in Microsoft Sentinel.

## Compare by persona

The following table compares Microsoft Sentinel playbooks, workbooks, and notebooks by the user persona:

|Resource  |Description  |
|---------|---------|
|**Playbooks**     |  <ul><li>SOC engineers</li><li>Analysts of all tiers</li></ul>          |
|**Workbooks**     |  <ul><li> SOC engineers</li><li>Analysts of all tiers</li></ul>          |
|**Notebooks**     |  <ul><li>Threat hunters and Tier-2/Tier-3 analysts</li><li>Incident investigators</li><li>Data scientists</li><li>Security researchers</li></ul>        |

## Compare by use

The following table compares Microsoft Sentinel playbooks, workbooks, and notebooks by use case:

|Resource  |Description  |
|---------|---------|
|**Playbooks**     |   Automation of simple, repeatable tasks:<ul><li>Ingesting external data </li><li>Data enrichment with TI, GeoIP lookups, and more </li><li> Investigation </li><li>Remediation </li></ul>       |
|**Workbooks**     | <ul><li>Visualization</li></ul>          |
|**Notebooks**     | <ul><li>Querying Microsoft Sentinel data and external data </li><li>Data enrichment with TI, GeoIP lookups, and WhoIs lookups, and more </li><li> Investigation </li><li> Visualization </li><li> Hunting </li><li>Machine learning and big data analytics </li></ul>         |


## Compare by advantages and challenges

The following table compares the advantages and disadvantages of playbooks, workbooks, and notebooks in Microsoft Sentinel:

|Resource  |Advantages  | Challenges |
|---------|---------|---------|
|**Playbooks**     |   <ul><li> Best for single, repeatable tasks </li><li>No coding knowledge required  </li></ul>      |    <ul><li>Not suitable for ad-hoc and complex chains of tasks </li><li>Not ideal for documenting and sharing evidence</li></ul>     | 
|**Workbooks**     |   <ul><li>Best for a high-level view of Microsoft Sentinel data </li><li>No coding knowledge required</li></ul>       | <ul><li>Can't integrate with external data </li></ul>    |
|**Notebooks**     |    <ul><li>Best for complex chains of repeatable tasks </li><li>Ad-hoc, more procedural control</li><li>Easier to pivot with interactive functionality </li><li>Rich Python libraries for data manipulation and visualization </li><li>Machine learning and custom analysis </li><li>Easy to document and share analysis evidence </li></ul>        |   <ul><li> High learning curve and requires coding knowledge </li></ul>   |

## Related content

For more information, see:

- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Visualize collected data with workbooks](get-visibility.md) 
- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
