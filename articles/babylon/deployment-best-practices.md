---
title: 'Deployment best practices'
titleSuffix: Azure Purview
description: This article provides an overview of Project Babylon, including its features and the problems it addresses. Project Babylon enables any user to register, discover, understand, and consume data sources.
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 10/06/2020
---

# Babylon deployment best practices

This article identifies common tasks that customers find helpful to complete in phases, over the course of 30, 60, 90 days, or more, to deploy Babylon into Production. Even organizations who have already deployed Babylon can use this guide to ensure they are getting the most out of their investment.

A well-planned and executed data governance platform paves the way for better data discovery, improved analytic collaboration and maximizing return on investment.

## Prerequisites

* Access to Microsoft Azure with a Development or Production subscription
* Ability to create Azure resources including Babylon
* Access data sources such as Azure Data Lake Storage or Azure SQL in Test, Development, or Production
  * For Data Lake, the required role is Reader Role in order to scan
  * For SQL, the identity must be able to query tables for sampling of classifications
* Access to Security Center or collaborate with Security Center Admin for Labeling

## Identify objectives and goals

Many organizations started their data governance journey by developing individual solutions catering to specific requirements of different groups and data domains across the organization. Although challenges might be different from various organizations depending the industry, product and even cultural, most would find out that it’s extremely difficult to main a consistent knowledge across these groups to ensure consistent controls and policies. 

Some of the common overarching objectives that you might want to identify in the early phases:

* Maximizing business value of data
* Enabling a data culture where data consumers can easily find, interpret, and trust data
* Increasing collaboration amongst various business units to provide consistent data experience
* Fostering innovation by accelerating data analytics to reap the benefits of the Cloud
* Decreasing time to discover data via self-service for various skill groups
* Reducing time to market for the delivery of analytics solutions that improve service to their customers
* Reducing the operational risks that are due to the use of domain-specific tools and unsupported technology
The general approach is to break down those overarching objectives into various categories and goals. Some examples are:

|Category|Goal|
|---------|---------|
|Discovery|The Admin users should be able to scan against Azure and non-Azure data sources including on-premises to gather information about the data assets automatically.|
|Classification|The platform should automatically classify data based on sampling of the data and allow manual override using custom classifications.|
|Consume|The business users should be able to find information about each asset for both business and technical metadata.|
|Lineage|Each asset must show graphical view of underlying datasets so that the users understand the original sources and what changes have been made.|
|Collaboration|Platform must allow users to collaborate to provide and contribute additional information about each data asset|
|Reporting|The users must be able to view reporting of the data estate including sensitive data and data that need additional enrichment.|
|Data Governance|The platform must allow the Admin to define policies for access control and automatically enforce the data access based on each user.|
|Workflow|That platform must have ability to create and modify workflow so that it is easy to scale out and automate various tasks within the platform.|
|Integration|Other third party technologies such as ticketing or orchestration must be able to integrate into the platform via script or REST APIs.|

## Top questions to ask

Once your organization agrees on the high-level objectives and goals, there will be many questions from multiple groups. It’s crucial to gather these questions in order to craft a plan to address people’s concerns. Some example questions that you may run into during the kick start phase:

1. What are the main organization data sources and data systems?
2. For data sources that are not supported yet by Babylon, what are my options?
3. How many Babylon instances do we need?
4. Who are the users?
5. Who can scan new data sources?
6. Who can modify content inside of Babylon?
7. What process do I need to have to improve the data quality in Babylon?
8. How to bootstrap the platform with existing critical assets, glossary terms, and contacts?
9. How to integrate with existing systems?
10. How to gather feedback and build a sustainable process?
While you might not have the answer to most of these questions right away, it can help your organization to frame this project and ensure all “must-have” requirements can be met.

## Include the right stakeholders

To ensure the success of implementing Babylon for the entire enterprise, it’s important to bring in the right stakeholders. Even though it’s true that in the initial phase, only a few people are actually involved in the project. As the scope expands, you will require additional personas to contribute to the project and provide feedback.

Some key stakeholders that you may want to include:

|Persona|Roles|
|---------|---------|
|Chief Data Officer|The CDO oversees a range of functions that may include data management, data quality, master data management, data science, business intelligence, and creating data strategy. He/she can be the sponsor of Babylon project.|
|Domain/Business Owner|A business person who influences usage of tools and has budget control.|
|Data Analyst|Frame a business problem; Analyze data to help leaders make business decisions.|
|Data Architect|Design databases for mission-critical line-of-business apps. Designing and implementing data security.|
|Data Engineer|Operate and maintain the data stack, pull data from different sources, data integration and prep, set up data pipelines.|
|Data Scientist|Build analytical models and set up data products to be accessed by APIs.|
|DB Admin|Own, track, and resolve database-related incidents and requests within service-level agreements (SLAs); Some are known to set up data pipelines.|
|DevOps|Line-of-Business application development and implementation, which may include writing scripts and orchestration capability.|
|Data Security Specialist|Assess overall network and data security, which involve data coming in and out of Babylon.|

## Identify key scenarios

Babylon can be used to centrally manage data governance across organization’s data estate spanning cloud and on-prem environments. To have a successful implementation, you must identify key scenarios that are critical to the business. These scenarios can cross business unit boundaries or impact multiple user personas either upstream or downstream.

These scenarios can be written up in various ways, but you need to include at least these five dimensions:

1. Persona – Who are the users?
2. Source system – What are the data sources such as Azure Data Lake Storage Gen2 or Azure SQL Database?
3. Impact Area – What is the category of this scenario?
4. Detail scenarios – How the users use Babylon to solve problems?
5. Expected outcome – What is the success criteria?

The scenarios must be specific, actionable, and executable with measurable results. Some example scenarios that you can use:

|Scenario|Detail|Persona|
|---------|---------|---------|
|Catalog business-critical assets|I need to have information about each data sets to have a good understanding of what it is. This scenario includes both business and technical metadata data about the data set in the catalog. The data sources include Azure Data Lake Storage Gen2, Azure Synapse DW, and/or Power BI. This scenario also includes on-premise resource such as SQL Server.|Business Analyst, Data Scientist, Data Engineer|
|Discover business-critical assets|I need to have a search engine that can search through all metadata in the catalog. I should be able to search using technical term, business term with either simple or complex search using wildcard.|Business Analyst, Data Scientist, Data Engineer, Data Admin|
|Track data to understand its origin and troubleshoot data issues|I need to have data lineage to track data in reports, predictions, or models back to its original source and understand the changes and where the data has resided through the data life cycle. This scenario needs to support prioritized data pipelines Azure Data Factory and Databricks.|Data Engineer, Data Scientist|
|Enrich metadata on critical data assets|I need to enrich the data set in the catalog with technical metadata that is generated automatically. Classification and labeling are some examples.|Data Engineer, Domain/Business Owner|
|Govern data assets with friendly user experience|I need to have a Business glossary for business-specific metadata. The business users can use Babylon for self-service scenarios to annotate their data and enable the data to be discovered easily via search.|Domain/Business Owner, Business Analyst, Data Scientist, Data Engineer|

## Deployment models

If you have only one small group using Babylon with basic consumption use cases, the approach could be as simple as having one Babylon instance to service the entire group. However, one question that organizations often come up with is whether they need more than one Babylon instance. And if that is the case, how people can promote the assets from one stage to another.

### Determine the number of Babylon instances

The simple answer is that ideally there should only be one Babylon for the entire organization. This approach takes maximum advantage of the “network effects” where the value of the platform increases exponentially as a function of the data reside inside the platform. 

However, there are exceptions to this pattern:

1. **Testing new configurations** – Organizations may want to create multiple instances for testing out scan configurations or classifications in isolated environments. Although there is “versioning” feature in some areas of the platform such as glossary, it would be easier to have a “disposable” instance to freely test.
2. **Separating Test, Pre-production and Production** – Organizations want to create different platforms for different kinds of data stored in different environments. It is not recommended as those kinds of data are different content types. You could use glossary term at the top hierarchy level or category to segregate content types.
3. **Conglomerates and federated model** – Conglomerates often have many business units (BUs) that operate separately, and, in some cases, they won't even share billing with each other. In those cases, the organization will end up creating a Babylon instance per BU. This model is not ideal but there doesn't seem to be a good way around this, especially because BUs are often not willing to share billing. 
4. **Compliance** – There are some very strict compliance regimes which treat even metadata as sensitive and require it to be in a specific geography. If a company has multiple geographies than today, the only solution is to have multiple Babylon instances, one for each geography.

### Create a process to promote to Production

Some organizations may decide to keep things simple by working with a single Production version of Babylon. They probably don’t need to go beyond discovery, search, and browse scenarios. If some assets have incorrect glossary terms, it’s quite forgiving to let people to self-correct. However, most organizations that want to deploy Babylon across various business units will want to have some form of process and control.

Another important aspect to include in your production process is how classification and label can be migrated. Babylon has over 90 system classifiers. You can apply system or custom classifications on File, Table, or Column assets. Classifications are like subject tags and are used to mark and identify content of a specific type found within your data estate during scanning. Sensitivity labels are used to identify the categories of classification types within your organizational data, and the group the policies you wish to apply to each category. It makes use of the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire content and data estate. It can scan and automatically classify documentations. For example, if you have a file named multiple.docx and it has a National ID number in its content, Babylon will add classification such as EU National Identification Number in the Asset Detail page.

In Babylon, there are several areas where the Catalog Administrators need to ensure consistency and maintenance best practices over its life cycle:

* **Data assets** – Data sources will need to be re-scanned across environments. It’s not recommended to scan only in Development and then re-generate them using APIs in Production. The main reason is that the Babylon scanners did a lot more “wiring” behind the scene on the data assets which could be very complex to move them to a different Babylon instance. It’s much easier to just add the same data source in Production and scan the sources again. The general best practice is to have documentation of all scans, connections and authentication mechanisms being used.
* **Scan rule sets** – This is your collection of rules assigned to specific scan such as file type and classifications to detect. If you don’t have that many scan rule sets, it’s possible to just re-create them manually again via Production. This will require an internal process and good documentation. However, if you rule sets change on the daily or weekly basis, this could be addressed by exploring the REST API route.
* **Custom classifications** – Your classifications may not also change on a regular basis. During the initial phase of deployment, it may take some time to understand various requirements to come up with custom classifications. However, once settled, this will require very little change. So the recommendation here is to manually migrate any custom classifications over or use the REST API.
* **Glossary** – It’s possible to export and import glossary terms via the UX. For automation scenarios, you can also use the REST API.
* **Resource set pattern policies** – This functionality is very advance for any typical organizations to apply. In some cases, your Azure Data Lake Storage has folder naming convention and specific structure that may cause problem for Babylon to generate the resource set. Your business unit may also want to change the resource set construction with additional customization to fit the business needs. For this scenario, it’s best to keep track of all changes via REST API and document the changes through external versioning platform.
* **Role assignment** – This is where you control who has access to Babylon and which permissions they have. Babylon also has REST API to support export and import of users and roles but this is not Atlas API-compatible. The recommendation is to assign an Azure Security Group and manage the group membership instead.

### Plan and implement different integration points with Babylon

It’s very likely that a mature organization already has an existing data catalog. The key question is whether to continue to use the existing technology and sync with Babylon. Babylon allows publishing information via the Atlas APIs but they really aren't intended to support this kind of scenario. Some organizations may decide initially to bootstrap the usage of Babylon by migrating over the existing data assets from other data catalog solutions. This can be done via the Atlas APIs as a one-way approach. To synchronize between different catalog technologies should not be considered in the long-term design. What typically happened is that each business unit may continue to use the existing solutions for older data assets while Babylon would be used to scan against newer data sources.

For other integration scenarios such as ticketing, custom user interface, orchestration, etc… you can use Atlas APIs and Kafka Endpoint. In general, there are four integration points with Babylon:

* **Data Asset** – This enables Babylon to scan a store’s assets in order to enumerate what those assets are and collect any readily available metadata about them. So for SQL this could be a list of DBs, tables, stored procedures, views and config data about them kept in places like sys.tables. For something like ADF this could be enumerating all the pipelines and getting data on when they were created, last run, current state, etc. 
* **Lineage** – This enables Babylon to collect information from an analysis/data mutation system on how data is moving around. For something like Spark this could be gathering information from the execution of a notebook to see what data the notebook ingested, how it transformed it and where it outputted it. For something like SQL it could be analyzing query logs to reverse engineer what mutation operations were executed and what they did. We support both push and pull based Lineage depend on the needs. 
* **Classification** – This enables Babylon to take physical samples from data sources and run them through our classification system. The classification system figures out the semantics of a piece of data. For example, we may know that a file is a Parquet file and has 3 columns and the third one is a string. But the classifiers we run on the samples we take from the file will tell us that the string is someone’s name or address or phone number. Lighting up this integration point means that we have defined how Babylon can open up objects like notebooks, pipelines, parquet files, tables, containers, etc. to authenticate and get samples we can use to drive classification. 
* **Embedded Experience** – Products that have a “studio” like experience (ADF, Synapse, SQL Studio, PBI, Dynamics, etc.) usually want to enable users to discover data they want to interact with and also find places to output data. Babylon’s catalog can help to accelerate these experiences by providing an embedding experience. This experience can occur at the API or the UX level at the partner’s option. By embedding a call to Babylon, the organization can take advantage of Babylon’s map of the data estate to find data assets, see lineage, check schemas, look at ratings, contacts etc. 

## Phase 1: Pilot

In this phase, Babylon must be created and configured for a very small set of users. More than often, it is just a group of 2-3 people working together to run through end-to-end scenarios. They are considered the advocates of Babylon in their organization. The main goal of this phase is to ensure key functionalities can be met and the right stakeholders are aware of the project.

### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|Gather & agree on requirements|Discussion with all stakeholders to gather a full set of requirements. Different personas must participate to agree on a subset of requirements to complete for each phase of the project.|1 Week|
|Set up Starter Kit|Go through Quick Start and set up the Starter Kit to demo Babylon to all stakeholders.|1 Day|
|Navigating Babylon|Understand how to use Babylon from the home page.|1 Day|
|Configure ADF for lineage|Identify key pipelines and data assets. Gather all information required to connect to an internal ADF account.|1 Day|
|Scan a data source such as Azure Data Lake Storage|Add the data source and set up a scan. Ensure the scan successfully detects all assets.|2 Day|
|Search and browse|Allow end users to access Babylon and perform end-to-end search and browse scenarios.|1 Day|

### Acceptance criteria

* Babylon account is created successfully in organization subscription under the organization tenant.
* A small group of users with multiple roles can access Babylon.
* Babylon is configured to scan at least one data source.
* Users should be able to extract key values of Babylon such as:
  * Search and browse
  * Lineage
* Users should be able to assign asset ownership in the asset page.
* Presentation and demo to raise awareness to key stakeholders.
* Buy-in from management to approve additional resources for MVP phase.

## Phase 2: Minimum Viable Product
Once you have the agreed requirements and participated business units to onboard Babylon, the next step is to work on a Minimum Viable Product (MVP) release. In this phase, you will expand the usage of Babylon to more users who will have additional needs horizontally and vertically. There will be key scenarios that must be met horizontally for all users such as glossary terms, search and browse. There will be also in-depth requirement vertically for each business unit or group to cover specific end-to-end scenarios such as lineage from Azure Data Lake Storage to Azure Synapse DW to Power BI.

### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|Scan Azure Synapse Analytics|Start to onboard your database sources and scan them to populate key assets|2 Days|
|Create custom classifications and rules|Once your assets are scanned, your users may realize that there are additional use cases for more classification beside the default classifications from Babylon.|2-4 Weeks|
|Scan Power BI|If your organization uses Power BI, you can scan Power BI in order to gather all data assets being used by Data Scientists or Data Analysts which have requirements to include lineage from the storage layer.|1-2 Weeks|
|Import glossary terms|In most cases, your organization may already develop a collection of glossary terms and term assignment to assets. This will require an import process into Babylon via .csv file.|1 Week|
|Add contacts to assets|For top assets, you may want to establish a process to either allow other personas to assign contacts or import via REST APIs.|1 Week|
|Add sensitive labels and scan|This might be optional for some organizations, depending on the usage of Labeling from M365.|1-2 Weeks|
|Get classification and sensitive insights|For reporting and insight in Babylon, you can access this functionality to get various reports and provide presentation to management.|1 Day|
|Onboard addition users using Babylon managed users|This step will require the Babylon Admin to work with the Azure Active Directory Admin to establish new Security Groups to grant access to Babylon.|1 Week|

### Acceptance criteria

* Successfully onboard a larger group of users to Babylon (50+)
* Scan business critical data sources
* Import and assign all critical glossary terms
* Successfully test important labeling on key assets
* Successfully met minimum scenarios for participated business units’ users

## Phase 3: Pre-production

Once the MVP phase has passed, it’s time to plan for pre-production milestone. Depending on the objective, your organization may decide to have a separate instance of Babylon for pre-production vs. production or keep the same instance but restrict access. Also in this phase, you may want to include scanning on on-premise data sources such as SQL Server. If there is any gap in data sources not supported by Babylon, it is time to explore Atlas API to understand additional options.
Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|Refine your scan using scan rule set|Your organization will have a lot of data sources for pre-production. It’s important to pre-define key criteria for scanning so that classifications and file extension can be applied consistently across the board.|1-2 Days|
|Assess region availability for scan|Depending on the region of the data sources and organizational requirements on compliance and security, you may want to consider what regions must be available for scanning.|1 Day|
|Understand firewall concept when scanning|This step requires some exploration in how the organization setup firewall and how Babylon can authenticate itself to access the data sources for scanning.|1 Day|
|Understand Private Link concept when scanning|If your organization uses Private Link, you must lay out the foundation of network security to include Private Link as a part of the requirements.|1 Day|
|Scan on-premise SQL Server|This is optional if you have on-premise SQL Server. The scan will require setting up Self-hosted Integration Runtime and add SQL Server as a data source.|1-2 Weeks|
|Use Babylon REST API for integration scenarios|If you have requirements to integrate Babylon with other 3rd party technologies such as orchestration or ticketing system, you may want to explore REST API area.|1-4 Weeks|
|Understand Babylon pricing|This step will provide the organization important financial information to make decision.|1-5 Days|

### Acceptance criteria

* Successfully onboard at least one business unit with all of users
* Scan on-premise data source such as SQL Server
* POC at least one integration scenario using REST API
* Complete a plan to go to production which should include key areas on infrastructure and security

## Phase 4: Production 

The above phases should be followed to create an effective information governance, which is the foundation for better governance programs. Data governance will help your organization prepare for the growing trends such as AI, Hadoop, IoT, and blockchain. It is just the start for many things data and analytics, and there is plenty more that can be discussed. The outcome of this solution would deliver:

* **Business Focused** - A solution that is aligned to business requirements and scenarios over technical requirements. 
* **Future Ready** - A solution will maximize default features of the platform and use standardized industry practices for configuration or scripting activities to support the advancements/evolution of the platform. 

|Task|Detail|Duration|
|---------|---------|---------|
|Scan production data sources with Firewall enabled|If this is optional when firewall is in place but it’s important to explore options to hardening your infrastructure.|1-5 Days|
|Enable Private Link|If this is optional when Private Link is used. Otherwise, you can skip this as it’s a must-have criterion when Private is enabled.|1-5 Days|
|Create automated workflow|Workflow is important to automate process such as approval, escalation, review and issue management.|2-3 Weeks|
|Operation documentation|Data governance is not a one-time project. It is an ongoing program to fuel data-driven decision making and creating opportunities for business. It is critical to document key procedure and business standards.|1 Week|

### Acceptance criteria

* Successfully onboard all business unit and their users
* Successfully meet infrastructure and security requirements for production
* Successfully meet all use cases required by the users

## Platform Hardening

Additional hardening steps can be taken:

* Increase security posture by enabling scan on firewall resources or use Private Link
* Fine-tune scope scan to improve scan performance
* Use REST APIs to export critical metadata and properties for backup and recovery
* Use workflow to automate ticketing and eventing to avoid human errors