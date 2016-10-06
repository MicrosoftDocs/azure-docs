<properties
   pageTitle="Azure Data Catalog common scenarios | Microsoft Azure"
   description="An overview of common scenarios for Azure Data Catalog, including the registration and discovery of high-value data sources, enabling self-service business intelligence, and capturing existing tribal knowledge about data sources and processes."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="07/12/2016"
   ms.author="maroche"/>


# Azure Data Catalog common scenarios

This article presents common scenarios where Azure Data Catalog can help organizations get more value from their existing data sources.

## Scenario #1 - Registration of central data sources

Organizations often have a number of high-value data sources. These data sources include line of business OLTP systems, data warehouses, and business intelligence / analytics databases. Often the number of systems, and the overlap between systems, grows over time as the needs of the business evolve, and as the business itself evolves through mergers and acquisitions.

Often it is difficult for users to know where to locate the data within these data sources. Questions like these are all too common:

- Of the three HR systems used within the company, which should I use to create this type of report?
- Where should I go to get the certified sales numbers for the fiscal year that just ended?
- Who should I ask, or what is the process I should use to get access to the data warehouse?
- I don’t know if these numbers are right – who can I ask for insight on how this data is supposed to be used before I share this dashboard with my team?

In this scenario, Azure Data Catalog can help. The central, high-value, IT-managed data sources that are used across the organization are often the logical starting point for populating the catalog. Although any user can register a data source, having the catalog kick-started with the data sources that are most likely to provide value to the largest number of users will help drive adoption and use of the system. For customers getting started with Azure Data Catalog, identifying and registering the key data sources used by many different teams of data consumers can be the first step to success.

This scenario also presents an opportunity to annotate the high-value data sources to make them easier to understand and access. One key aspect of this effort is to include information on how users can request access to the data source. Azure Data Catalog allows users to provide the email address of the user or team responsible for controlling data source access, links to existing tools or documentation, or free text that describes the access request process. With this information included in the catalog, users who discover registered data sources but who do not yet have permissions to access the data can easily request access using the processes defined and controlled by the data source owners.

## Scenario #2 - Self-service business intelligence

Although traditional corporate business intelligence solutions continue to be an invaluable part of many organizations’ data landscapes, the changing pace of business has made self-service BI more and more important. Self-service BI allows information workers and analysts to create their own reports, workbooks, and dashboards without relying on a central IT team – or being restricted by that IT team’s schedule and availability.

In self-service BI scenarios, it is common for users to combine data from multiple sources, many of which may not have previously been used for BI and analysis. Although some of these data sources may already be known, there is frequently a process to discover what must take place to locate and evaluate potential data sources for a given task.

Traditionally, this discovery process is a manual one: analysts will use their peer network connections to identify other people who work with the data being sought. Once a data source is found it can be used, but the process repeats itself again for each subsequent self-service BI effort, with multiple users performing the same redundant manual process of discovery.

With Azure Data Catalog, users can break this cycle of redundant effort. Once a data source has been discovered through traditional means, an analyst can register the data source to make it more easily discoverable in the future. Although the user can add more value by annotating the registered data assets, this does not need to take place at the same time as registration. Users can contribute over time, as their schedules permit, gradually adding value to the data sources registered in the catalog.

This organic growth of the catalog content is a natural complement to the up-front registration of central data sources. Pre-populating the catalog with data that many users will need can be a motivator for initial use and discovery. Enabling users to register and annotate additional sources can be a way to keep them, and their peers, engaged.

It’s also worth noting that although this scenario focuses specifically on self-service BI, the same patterns and challenges apply to large-scale corporate BI projects as well. Any effort that involves a manual process of data source discovery is an effort that can add value to the organization through the use of Azure Data Catalog.

## Scenario #3 - Capturing tribal knowledge

How do you know what data you need to do your job, and where to find that data?

If you’ve been in your job for a while, you probably just know. You’ve gone through a gradual learning process, and over time have learned about the data sources that are key to your day to day work.

When a new employee joins your team, how does he know what data he needs to do his job, and where to find it?

Odds are, he asks you.

This ongoing transfer of tribal knowledge is part of the data source discovery process in organizations large and small. More senior and experienced team members have built up knowledge over the years, and newer team members have learned to ask them when they have questions. The most vital information often exists only in the heads of a few key people, and when those people are on vacation or leave the team, the organization suffers.

Sometimes these data experts will make the effort to document their knowledge, sharing it via email, or in Word documents on a team SharePoint site. Although this can be valuable, it introduces a new discovery problem – how do people know what documentation exists, and where to find it…

Azure Data Catalog provides a location for sharing this tribal knowledge, and for making it easily discoverable. Data experts can directly annotate data assets, and can also include links to existing documentation. Not only does this capture the knowledge itself, but it also puts the knowledge in the same experience that is used for data source discovery. When someone uses the catalog to discover a data source not only will he find the source itself, he will also find the expert’s knowledge that previously existed only in the mind of the expert himself.
