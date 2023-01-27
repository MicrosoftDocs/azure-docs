---
title: Azure Data Catalog common scenarios
description: An overview of common scenarios for Azure Data Catalog, including the registration and discovery of high-value data sources, enabling self-service business intelligence, and capturing existing knowledge about data sources and processes.
ms.service: data-catalog
ms.topic: conceptual
ms.date: 12/14/2022
---
# Azure Data Catalog common scenarios

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

This article presents common scenarios where Azure Data Catalog can help your organization get more value from its existing data sources.

## Scenario 1: Registration of central data sources

Organizations often have many high-value data sources. These data sources include line-of-business, online transaction processing (OLTP) systems, data warehouses, and business intelligence/analytics databases. The number of systems, and the overlap between them, typically grows over time as business needs evolve and the business itself evolves through, for example, mergers and acquisitions.

It can be difficult for organization members to know where to locate the data within these data sources. Questions like the following are all too common:

* Of the three HR systems used within the company, which should I use to create this type of report?
* Where should I go to get the certified sales numbers for the fiscal year that just ended?
* Who should I ask, or what is the process I should use to get access to the data warehouse?
* I don’t know if these numbers are right. Who can I ask for insight on how this data is supposed to be used before I share this dashboard with my team?

To these and other questions, Azure Data Catalog can provide answers. The central, high-value, IT-managed data sources that are used across organizations are often the logical starting point for populating the catalog. Although any user can register a data source, having the catalog kick-started with the data sources that are most likely to provide value to the largest number of users helps drive adoption and use of the system.

If you're getting started with Azure Data Catalog, identifying and registering key data sources that are used by many different teams of data consumers can be your first step to success.

This scenario also presents an opportunity to annotate the high-value data sources to make them easier to understand and access. One key aspect of this effort is to include information on how users can request access to the data source. With Azure Data Catalog, you can provide the email address of the user or team that's responsible for controlling data-source access, links to existing tools or documentation, or free text that describes the access-request process. This information helps members who discover registered data sources but who don't yet have permissions to access the data to easily request access by using the processes that are defined and controlled by the data-source owners.

## Scenario 2: Self-service business intelligence

Although traditional corporate business-intelligence solutions continue to be an invaluable part of many organizations’ data landscapes, the changing pace of business has made self-service BI more important. By using self-service BI, information workers and analysts can create their own reports, workbooks, and dashboards without relying on a central IT team or being restricted by that IT team’s schedule and availability.

In self-service BI scenarios, users commonly combine data from multiple sources, many of which might not have previously been used for BI and analysis. Although some of these data sources might already be known, it can be challenging to discover what to do to locate and evaluate potential data sources for a given task.

Traditionally, this discovery process is a manual one: analysts use their peer network connections to identify others who work with the data being sought. After a data source is found and used, the process repeats itself again for each subsequent self-service BI effort, with multiple users performing a redundant manual process of discovery.

With Azure Data Catalog, your organization can break this cycle of effort. After discovering a data source through traditional means, an analyst can register it to make it more easily discoverable by other users in the future. Although the analyst can add more value by annotating the registered data assets, this annotation doesn't need to take place at the same time as registration. Users can contribute over time, as their schedules permit, gradually adding value to the data sources registered in the catalog.

This organic growth of the catalog content is a natural complement to the up-front registration of central data sources. Pre-populating the catalog with data that many users will need can be a motivator for initial use and discovery. Enabling users to register and annotate more sources can be a way to keep them and other organization members engaged.

It’s worth noting that although this scenario focuses specifically on self-service BI, the same patterns and challenges apply to large-scale corporate BI projects as well. By using Data Catalog, your organization can improve any effort that involves a manual process of data-source discovery.

## Scenario 3: Capturing tribal knowledge

How do you know what data you need to do your job, and where to find that data?

If you’ve been in your job for a while, you probably just know. You’ve gone through a gradual learning process, and over time have learned about the data sources that are key to your day-to-day work.

When a new employee joins your team, how does that person know what data is required for the job, and where to find it?

Odds are, the new person comes to you with these questions.

This ongoing transfer of tribal knowledge is part of the data-source discovery process in organizations large and small. More senior and experienced team members have built up knowledge over the years, and newer team members have learned to ask them when they have questions. The most vital information often exists only in the heads of a few key people, and when those people are on vacation or leave the team, the organization suffers.

Data experts ordinarily make an effort to document their knowledge, sharing it via email or in Word documents on a team SharePoint site. Although this approach can be valuable, it introduces a new discovery problem: how do people know what documentation exists, and where to find it?

With Azure Data Catalog, your organization has a single, central location for storing and sharing this tribal knowledge, and for making it easily discoverable. In Data Catalog, your data experts can annotate data assets directly and provide links to existing documentation. When organization members use the catalog to discover a data source, they'll find not only the source itself, but also the knowledge that previously existed only in the minds of your organization's experts.
