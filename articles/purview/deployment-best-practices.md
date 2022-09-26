---
title: 'Deployment best practices for Microsoft Purview (formerly Azure Purview)'
description: This article provides best practices for deploying Microsoft Purview (formerly Azure Purview) in your data estate. The Microsoft Purview Data Map and governance portal enable any user to register, discover, understand, and consume data sources.
author: shsandeep123
ms.author: sandeepshah
ms.service: purview
ms.topic: conceptual
ms.date: 08/04/2022
---
# Microsoft Purview (formerly Azure Purview) deployment best practices

This article is a guide to successfully deploying Microsoft Purview (formerly Azure Purview) into production in your data estate. It's intended to help you strategize and phase your deployment from research to hardening your production environment, and is best used in tandem with our [deployment checklist](tutorial-azure-purview-checklist.md).

If you're looking for a strictly technical deployment guide, use the [deployment checklist](tutorial-azure-purview-checklist.md).

If you're creating a plan to deploy Microsoft Purview and want to consider best practices as you develop your deployment strategy, then follow the article below. This guide outlines tasks can be completed in phases over the course of a month or more to develop your deployment process for Microsoft Purview. Even organizations who have already deployed Microsoft Purview can use this guide to ensure they're getting the most out of their investment.

A well-planned deployment of your data governance platform, can give the following benefits:

- Better data discovery
- Improved analytic collaboration
- Maximized return on investment

This guide provides insight on a full deployment lifecycle, from initial planning to a mature environment by following these stages:

| Stage | Description |
|-------|-------------|
|[Identify objectives and goals](#identify-objectives-and-goals)|Consider what your entire organization wants and needs from data governance.|
|[Gathering questions](#gathering-questions)|What questions might you and your team have as you get started, and where can you look to begin addressing them?|
|[Deployment models](#deployment-models)|Customize your Microsoft Purview deployment to your data estate.|
|[Create a process to move to production](#create-a-process-to-move-to-production)|Create a phased deployment strategy tailored to your organization.|
|[Platform hardening](#platform-hardening)|Continue to grow your deployment to maturity.|

Many of Microsoft Purview's applications and features have their own individual best practices pages as well. They're referenced often throughout this deployment guide, but you can find all of them in the table of contents under **Concepts** and then **Best practices and guidelines**.

## Identify objectives and goals

Many organizations have started their data governance journey by developing individual solutions that cater to specific requirements of isolated groups and data domains across the organization. Although experiences may vary depending on the industry, product, and culture, most organizations find it difficult to maintain consistent controls and policies for these types of solutions.

Some of the common data governance objectives that you might want to identify in the early phases to create a comprehensive data governance experience include:

* Maximizing the business value of your data
* Enabling a data culture where data consumers can easily find, interpret, and trust data
* Increasing collaboration amongst various business units to provide a consistent data experience
* Fostering innovation by accelerating data analytics to reap the benefits of the cloud
* Decreasing time to discover data through self-service options for various skill groups
* Reducing time-to-market for the delivery of analytics solutions that improve service to their customers
* Reducing the operational risks that are due to the use of domain-specific tools and unsupported technology

The general approach is to break down those overarching objectives into various categories and goals. Some examples are:

|Category|Goal|
|---------|---------|
|Discovery|Admin users should be able to scan Azure and non-Azure data sources (including on-premises sources) to gather information about the data assets automatically.|
|Classification|The platform should automatically classify data based on a sampling of the data and allow manual override using custom classifications.|
|Consumption|The business users should be able to find information about each asset for both business and technical metadata.|
|Lineage|Each asset must show a graphical view of underlying datasets so that the users understand the original sources and what changes have been made.|
|Collaboration|The platform must allow users to collaborate by providing additional information about each data asset.|
|Reporting|The users must be able to view reporting on the data estate including sensitive data and data that needs extra enrichment.|
|Data governance|The platform must allow the admin to define policies for access control and automatically enforce the data access based on each user.|
|Workflow|The platform must have the ability to create and modify workflow so that it's easy to scale out and automate various tasks within the platform.|
|Integration|Other third-party technologies such as ticketing or orchestration must be able to integrate into the platform via script or REST APIs.|

### Identify key scenarios

Microsoft Purview governance services can be used to centrally manage data governance across an organization’s data estate spanning cloud and on-premises environments. To have a successful implementation, you must identify key scenarios that are critical to the business. These scenarios can cross business unit boundaries or affect multiple user personas either upstream or downstream.

These scenarios can be written up in various ways, but you should include at least these five dimensions:

1. Persona – Who are the users?
2. Source system – What are the data sources such as Azure Data Lake Storage Gen2 or Azure SQL Database?
3. Impact Area – What is the category of this scenario?
4. Detail scenarios – How the users use Microsoft Purview to solve problems?
5. Expected outcome – What is the success criteria?

The scenarios must be specific, actionable, and executable with measurable results. Some example scenarios that you can use:

|Scenario|Detail|Persona|
|---------|---------|---------|
|Catalog business-critical assets|I need to have information about each data sets to have a good understanding of what it is. This scenario includes both business and technical metadata data about the data set in the catalog. The data sources include Azure Data Lake Storage Gen2, Azure Synapse DW, and/or Power BI. This scenario also includes on-premises resources such as SQL Server.|Business Analyst, Data Scientist, Data Engineer|
|Discover business-critical assets|I need to have a search engine that can search through all metadata in the catalog. I should be able to search using technical term, business term with either simple or complex search using wildcard.|Business Analyst, Data Scientist, Data Engineer, Data Admin|
|Track data to understand its origin and troubleshoot data issues|I need to have data lineage to track data in reports, predictions, or models back to its original source. I also need to understand the changes made to the data, and where the data has resided throughout the data life cycle. This scenario needs to support prioritized data pipelines Azure Data Factory and Databricks.|Data Engineer, Data Scientist|
|Enrich metadata on critical data assets|I need to enrich the data set in the catalog with technical metadata that is generated automatically. Classification and labeling are some examples.|Data Engineer, Domain/Business Owner|
|Govern data assets with friendly user experience|I need to have a Business glossary for business-specific metadata. The business users can use Microsoft Purview for self-service scenarios to annotate their data and enable the data to be discovered easily via search.|Domain/Business Owner, Business Analyst, Data Scientist, Data Engineer|

### Integration points with Microsoft Purview

It’s likely that a mature organization already has an existing data catalog. The key question is whether to continue to use the existing technology and sync with the Microsoft Purview Data Map and Data Catalog or not. To handle syncing with existing products in an organization, [Microsoft Purview provides Atlas REST APIs](tutorial-using-rest-apis.md). Atlas APIs provide a powerful and flexible mechanism handling both push and pull scenarios. Information can be published to Microsoft Purview using Atlas APIs for bootstrapping or to push latest updates from another system into Microsoft Purview. The information available in Microsoft Purview can also be read using Atlas APIs and then synced back to existing products. 

For other integration scenarios such as ticketing, custom user interface, and orchestration you can use Atlas APIs and Kafka endpoints. In general, there are four integration points with Microsoft Purview:

* **Data Asset** – This enables Microsoft Purview to scan a store’s assets in order to enumerate what those assets are and collect any readily available metadata about them. So for SQL this could be a list of DBs, tables, stored procedures, views and config data about them kept in places like `sys.tables`. For something like Azure Data Factory (ADF) this could be enumerating all the pipelines and getting data on when they were created, last run, current state.
* **Lineage** – This enables Microsoft Purview to collect information from an analysis/data mutation system on how data is moving around. For something like Spark this could be gathering information from the execution of a notebook to see what data the notebook ingested, how it transformed it and where it outputted it. For something like SQL, it could be analyzing query logs to reverse engineer what mutation operations were executed and what they did. We support both push and pull based lineage depending on the needs.
* **Classification** – This enables Microsoft Purview to take physical samples from data sources and run them through our classification system. The classification system figures out the semantics of a piece of data. For example, we may know that a file is a Parquet file and has three columns and the third one is a string. But the classifiers we run on the samples will tell us that the string is a name, address, or phone number. Lighting up this integration point means that we've defined how Microsoft Purview can open up objects like notebooks, pipelines, parquet files, tables, and containers.
* **Embedded Experience** – Products that have a “studio” like experience (such as ADF, Synapse, SQL Studio, PBI, and Dynamics) usually want to enable users to discover data they want to interact with and also find places to output data. Microsoft Purview’s catalog can help to accelerate these experiences by providing an embedding experience. This experience can occur at the API or the UX level at the partner’s option. By embedding a call to Microsoft Purview, the organization can take advantage of Microsoft Purview’s map of the data estate to find data assets, see lineage, check schemas, look at ratings, contacts etc.

## Gathering questions

Once your organization agrees on the high-level objectives and goals, there will be many questions from multiple groups. It’s crucial to gather these questions in order to craft a plan to address all of the concerns. Make sure to [include relevant groups](#include-the-right-stakeholders) as you gather these questions. You can use our documentation to start answering them.

Some example questions that you may run into during the initial phase:

- What are the main data sources and data systems in our organization?
- [What data sources are supported?](microsoft-purview-connector-overview.md) 
- For data sources that aren't supported yet by Microsoft Purview, what are my options?
- [How should we budget for Microsoft Purview?](concept-guidelines-pricing.md)
- [How many Microsoft Purview instances do we need?](concept-best-practices-accounts.md)
- [Who will use Microsoft Purview, and what roles will they have?](catalog-permissions.md)
- [Who can scan new data sources?](catalog-permissions.md)
- [Who can modify content inside of Microsoft Purview?](catalog-permissions.md)
- What processes can I use to improve the data quality in Microsoft Purview?
- How to bootstrap the platform with existing critical assets, [glossary terms](concept-best-practices-glossary.md), and contacts?
- How to integrate with existing systems?
- [How can we secure Microsoft Purview?](concept-best-practices-security.md)
- How can we gather feedback and build a sustainable process?
- [What can we do in a disaster situation?](concept-best-practices-migration.md)
- [We're already using Azure Data Catalog, can we migrate to Microsoft Purview?](../data-catalog/data-catalog-migration-to-azure-purview.md)

Even if you might not have the answer to most of these questions right away, gathering questions can help your organization to frame this project and ensure all “must-have” requirements can be met.

### Include the right stakeholders

To ensure the success of implementing Microsoft Purview for your entire organization, it’s important to involve the right stakeholders. Only a few people are involved in the initial phase. However, as the scope expands, you'll require more personas to contribute to the project and provide feedback.

Some key stakeholders that you may want to include:

|Persona|Roles|
|---------|---------|
|**Chief Data Officer**|The CDO oversees a range of functions that may include data management, data quality, master data management, data science, business intelligence, and creating data strategy. They can be the sponsor of the Microsoft Purview implementation project.|
|**Domain/Business Owner**|A business person who influences usage of tools and has budget control|
|**Data Analyst**|Able to frame a business problem and analyze data to help leaders make business decisions|
|**Data Architect**|Design databases for mission-critical line-of-business apps along with designing and implementing data security|
|**Data Engineer**|Operate and maintain the data stack, pull data from different sources, integrate and prepare data, set up data pipelines|
|**Data Scientist**|Build analytical models and set up data products to be accessed by APIs|
|**DB Admin**|Own, track, and resolve database-related incidents and requests within service-level agreements (SLAs); May set up data pipelines|
|**DevOps**|Line-of-Business application development and implementation; may include writing scripts and orchestration capabilities|
|**Data Security Specialist**|Assess overall network and data security, which involves data coming in and out of Microsoft Purview|

## Deployment models

If you have only one small group using Microsoft Purview with basic consumption use cases, the approach could be as simple as having one Microsoft Purview instance to service the entire group. However, you may also wonder whether your organization needs more than one Microsoft Purview instance. And if using multiple Microsoft Purview instances, how can employees promote the assets from one stage to another.

### Determine the number of Microsoft Purview instances

In most cases, there should only be one Microsoft Purview (formerly Azure Purview) account for the entire organization. This approach takes maximum advantage of the “network effects” where the value of the platform increases exponentially as a function of the data that resides inside the platform.

However, there are exceptions to this pattern:

1. **Testing new configurations** – Organizations may want to create multiple instances for testing out scan configurations or classifications in isolated environments. Although there's a “versioning” feature in some areas of the platform such as glossary, it would be easier to have a “disposable” instance to freely test.
2. **Separating Test, Pre-production and Production** – Organizations want to create different platforms for different kinds of data stored in different environments. It isn't recommended as those kinds of data are different content types. You could use glossary term at the top hierarchy level or category to segregate content types.
3. **Conglomerates and federated model** – Conglomerates often have many business units (BUs) that operate separately, and, in some cases, they won't even share billing with each other. In those cases, the organization will end up creating a Microsoft Purview instance for each BU. This model isn't ideal, but may be necessary, especially because BUs are often not willing to share billing.
4. **Compliance** – There are some strict compliance regimes, which treat even metadata as sensitive and require it to be in a specific geography. If a company has multiple geographies, the only solution is to have multiple Microsoft Purview instances, one for each geography.

For more information, see our [accounts architecture best practices guide](concept-best-practices-accounts.md) and our [default account guide](concept-default-purview-account.md).

## Create a process to move to production

Some organizations may decide to keep things simple by working with a single production version of Microsoft Purview. They probably don’t need to go beyond discovery, search, and browse scenarios. However, most organizations that want to deploy Microsoft Purview across various business units will want to have some form of process and control.

Below we've provided a potential four phase deployment plan that includes tasks, helpful links, and acceptance criteria for each phase:

1. [Phase 1: Pilot](#phase-1-pilot)
1. [Phase 2: Minimum viable product](#phase-2-minimum-viable-product)
1. [Phase 3: Pre-production](#phase-3-pre-production)
1. [Phase 4: Production](#phase-4-production)

### Phase 1: Pilot

In this phase, Microsoft Purview must be created and configured for a small set of users. Usually, it's just a group of 2-3 people working together to run through end-to-end scenarios. They're considered the advocates of Microsoft Purview in their organization. The main goal of this phase is to ensure key functionalities can be met and the right stakeholders are aware of the project.

#### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|Gather & agree on requirements|Discussion with all stakeholders to gather a full set of requirements. Different personas must participate to agree on a subset of requirements to complete for each phase of the project.|One Week|
|[Navigating the Microsoft Purview governance portal](use-azure-purview-studio.md)|Understand how to use Microsoft Purview from the home page.|One Day|
|[Configure ADF for lineage](how-to-link-azure-data-factory.md)|Identify key pipelines and data assets. Gather all information required to connect to an internal ADF account.|One Day|
|Scan a data source such as [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md) or a [SQL server.](tutorial-register-scan-on-premises-sql-server.md)|Add the data source and set up a scan. Ensure the scan successfully detects all assets.|Two Day|
|[Search](how-to-search-catalog.md) and [browse](how-to-browse-catalog.md)|Allow end users to access Microsoft Purview and perform end-to-end search and browse scenarios.|One Day|

#### Other helpful links

- [Create a Microsoft Purview account](create-catalog-portal.md)
- [Create a collection](quickstart-create-collection.md)
- [Concept: Permissions and access](catalog-permissions.md)
- [Microsoft Purview product glossary](reference-azure-purview-glossary.md)

#### Acceptance criteria

* Microsoft Purview account is created successfully in organization subscription under the organization tenant.
* A small group of users with multiple roles can access Microsoft Purview.
* Microsoft Purview is configured to scan at least one data source.
* Users should be able to extract key values of Microsoft Purview such as:
  * Search and browse
  * Lineage
* Users should be able to assign asset ownership in the asset page.
* Presentation and demo to raise awareness to key stakeholders.
* Buy-in from management to approve more resources for MVP phase.

### Phase 2: Minimum viable product

Once you have the agreed requirements and participated business units to onboard Microsoft Purview, the next step is to work on a Minimum Viable Product (MVP) release. In this phase, you'll expand the usage of Microsoft Purview to more users who will have more needs horizontally and vertically. There will be key scenarios that must be met horizontally for all users such as glossary terms, search, and browse. There will also be in-depth requirements vertically for each business unit or group to cover specific end-to-end scenarios such as lineage from Azure Data Lake Storage to Azure Synapse DW to Power BI.

#### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|[Scan Azure Synapse Analytics](register-scan-azure-synapse-analytics.md)|Start to onboard your database sources and scan them to populate key assets|Two Days|
|[Create custom classifications and rules](create-a-custom-classification-and-classification-rule.md)|Once your assets are scanned, your users may realize that there are other use cases for more classification beside the default classifications from Microsoft Purview.|2-4 Weeks|
|[Scan Power BI](register-scan-power-bi-tenant.md)|If your organization uses Power BI, you can scan Power BI in order to gather all data assets being used by Data Scientists or Data Analysts that have requirements to include lineage from the storage layer.|1-2 Weeks|
|[Import glossary terms](how-to-create-import-export-glossary.md)|In most cases, your organization may already develop a collection of glossary terms and term assignment to assets. This will require an import process into Microsoft Purview via .csv file.|One Week|
|Add contacts to assets|For top assets, you may want to establish a process to either allow other personas to assign contacts or import via REST APIs.|One Week|
|[Add sensitive labels and scan](how-to-automatically-label-your-content.md)|This might be optional for some organizations, depending on the usage of Labeling from Microsoft 365.|1-2 Weeks|
|[Get classification and sensitive insights](concept-insights.md)|For reporting and insight in Microsoft Purview, you can access this functionality to get various reports and provide presentation to management.|One Day|
|Onboard more users using Microsoft Purview managed users|This step will require the Microsoft Purview Admin to work with the Azure Active Directory Admin to establish new Security Groups to grant access to Microsoft Purview.|One Week|

#### Other helpful links

- [Collections architecture best practices](concept-best-practices-collections.md)
- [Classification best practices](concept-best-practices-classification.md)
- [Glossary best practices](concept-best-practices-glossary.md)
- [Labeling best practices](concept-best-practices-sensitivity-labels.md)
- [Asset lifecycle best practices](concept-best-practices-asset-lifecycle.md)

#### Acceptance criteria

* Successfully onboard a larger group of users to Microsoft Purview (50+)
* Scan business critical data sources
* Import and assign all critical glossary terms
* Successfully test important labeling on key assets
* Successfully met minimum scenarios for participated business units’ users

### Phase 3: Pre-production

Once the MVP phase has passed, it’s time to plan for pre-production milestone. Your organization may decide to have a separate instance of Microsoft Purview for pre-production and production, or keep the same instance but restrict access. Also in this phase, you may want to include scanning on on-premises data sources such as SQL Server. If there's any gap in data sources not supported by Microsoft Purview, it's time to explore the Atlas API to understand other options.

#### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|[Refine your scan using scan rule set](create-a-scan-rule-set.md)|Your organization will have many data sources for pre-production. It’s important to pre-define key criteria for scanning so that classifications and file extension can be applied consistently across the board.|1-2 Days|
|[Assess region availability for scan for each of your sources by checking source pages](microsoft-purview-connector-overview.md)|Depending on the region of the data sources and organizational requirements on compliance and security, you may want to consider what regions must be available for scanning.|One Day|
|[Understand firewall concept when scanning](concept-best-practices-security.md#network-security)|This step requires some exploration of how the organization configures its firewall and how Microsoft Purview can authenticate itself to access the data sources for scanning.|One Day|
|[Understand Private Link concept when scanning](catalog-private-link.md)|If your organization uses Private Link, you must lay out the foundation of network security to include Private Link as a part of the requirements.|One Day|
|[Scan on-premises SQL Server](register-scan-on-premises-sql-server.md)|This is optional if you have on-premises SQL Server. The scan will require setting up [Self-hosted Integration Runtime](manage-integration-runtimes.md) and adding SQL Server as a data source.|1-2 Weeks|
|[Use Microsoft Purview REST API for integration scenarios](tutorial-using-rest-apis.md)|If you have requirements to integrate Microsoft Purview with other third party technologies such as orchestration or ticketing system, you may want to explore REST API area.|1-4 Weeks|
|[Understand Microsoft Purview pricing](concept-guidelines-pricing.md)|This step will provide the organization important financial information to make decision.|1-5 Days|

#### Other helpful links

- [Labeling best practices](concept-best-practices-sensitivity-labels.md)
- [Network architecture best practices](concept-best-practices-network.md)

#### Acceptance criteria

* Successfully onboard at least one business unit with all of users
* Scan on-premises data source such as SQL Server
* POC at least one integration scenario using REST API
* Complete a plan to go to production, which should include key areas on infrastructure and security

### Phase 4: Production

The above phases should be followed to create an effective data lifecycle management, which is the foundation for better governance programs. Data governance will help your organization prepare for the growing trends such as AI, Hadoop, IoT, and blockchain. It's just the start for many things data and analytics, and there's plenty more that can be discussed. The outcome of this solution would deliver:

* **Business Focused** - A solution that is aligned to business requirements and scenarios over technical requirements.
* **Future Ready** - A solution will maximize default features of the platform and use standardized industry practices for configuration or scripting activities to support the advancements/evolution of the platform.

#### Tasks to complete

|Task|Detail|Duration|
|---------|---------|---------|
|Scan production data sources with Firewall enabled|If this is optional when firewall is in place but it’s important to explore options to hardening your infrastructure.|1-5 Days|
|[Enable Private Link](catalog-private-link.md)|If this is optional when Private Link is used. Otherwise, you can skip this as it’s a must-have criterion when Private is enabled.|1-5 Days|
|[Create automated workflow](concept-workflow.md)|Workflow is important to automate process such as approval, escalation, review and issue management.|2-3 Weeks|
|Create operation documentation|Data governance isn't a one-time project. It's an ongoing program to fuel data-driven decision making and creating opportunities for business. It's critical to document key procedure and business standards.|One Week|

#### Other helpful links

- [Manage workflow runs](how-to-workflow-manage-runs.md)
- [Workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
- [Manage integration runtimes](manage-integration-runtimes.md)
- [Request access to a data asset](how-to-request-access.md)

#### Acceptance criteria

* Successfully onboard all business unit and their users
* Successfully meet infrastructure and security requirements for production
* Successfully meet all use cases required by the users

## Platform hardening

More hardening steps can be taken:

* Increase security posture by enabling scan on firewall resources or use Private Link
* Fine-tune scope scan to improve scan performance
* [Use REST APIs](tutorial-atlas-2-2-apis.md) to export critical metadata and properties for backup and recovery
* [Use workflow](how-to-workflow-business-terms-approval.md) to automate ticketing and eventing to avoid human errors
* [Use policies](concept-policies-data-owner.md) to manage access to data assets through the Microsoft Purview governance portal.

## Lifecycle considerations

Another important aspect to include in your production process is how classifications and labels can be migrated. Microsoft Purview has over 90 system classifiers. You can apply system or custom classifications on file, table, or column assets. Classifications are like subject tags and are used to mark and identify content of a specific type found within your data estate during scanning. Sensitivity labels are used to identify the categories of classification types within your organizational data, and then group the policies you wish to apply to each category. It makes use of the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire content and data estate. It can scan and automatically classify documents. For example, if you have a file named multiple.docx and it has a National ID number in its content, Microsoft Purview will add classification such as EU National Identification Number in the Asset Detail page.

In the Microsoft Purview Data Map, there are several areas where the Catalog Administrators need to ensure consistency and maintenance best practices over its life cycle:

* **Data assets** – Data sources will need to be rescanned across environments. It’s not recommended to scan only in development and then regenerate them using APIs in Production. The main reason is that the Microsoft Purview scanners do a lot more “wiring” behind the scenes on the data assets, which could be complex to move them to a different Microsoft Purview instance. It’s much easier to just add the same data source in production and scan the sources again. The general best practice is to have documentation of all scans, connections, and authentication mechanisms being used.
* **Scan rule sets** – This is your collection of rules assigned to specific scan such as file type and classifications to detect. If you don’t have that many scan rule sets, it’s possible to just re-create them manually again via Production. This will require an internal process and good documentation. However, if your rule sets change on a daily or weekly basis, this could be addressed by exploring the REST API route.
* **Custom classifications** – Your classifications may not also change regularly. During the initial phase of deployment, it may take some time to understand various requirements to come up with custom classifications. However, once settled, this will require little change. So the recommendation here's to manually migrate any custom classifications over or use the REST API.
* **Glossary** – It’s possible to export and import glossary terms via the UX. For automation scenarios, you can also use the REST API.
* **Resource set pattern policies** – This functionality is advanced for any typical organizations to apply. In some cases, your Azure Data Lake Storage has folder naming conventions and specific structure that may cause problems for Microsoft Purview to generate the resource set. Your business unit may also want to change the resource set construction with more customizations to fit the business needs. For this scenario, it’s best to keep track of all changes via REST API, and document the changes through external versioning platform.
* **Role assignment** – This is where you control who has access to Microsoft Purview and which permissions they have. Microsoft Purview also has REST API to support export and import of users and roles but this isn't Atlas API-compatible. The recommendation is to assign an Azure Security Group and manage the group membership instead.

## Moving tenants

If your Azure Subscription moves tenants while you have a Microsoft Purview account, there are some steps you should follow after the move.

Currently your Microsoft Purview account's system assigned and user assigned managed identities will be cleared during the move to the new tenant. This is because your Azure tenant houses all authentication information, so these need to be updated for your Microsoft Purview account in the new tenant.

After the move, follow the below steps to clear the old identities, and create new ones:

1. If you're running locally, sign in to Azure through the Azure CLI.

    ```azurecli-interactive
      az login
      ```
    Alternatively, you can use the [Azure Cloud Shell](../cloud-shell/overview.md) in the Azure portal. 
    Direct browser link: [https://shell.azure.com](https://shell.azure.com).

1. Obtain an access token by using [az account get-access-token](/cli/azure/account#az-account-get-access-token).
    ```azurecli-interactive
    az account get-access-token
    ```

1. Run the following bash command to disable all managed identities (user and system assigned managed identities):

    > [!IMPORTANT]
    > Be sure to replace these values in the below commands:
    > - \<Subscription_Id>: Your Azure Subscription ID
    > - \<Resource_Group_Name>: Name of the resource group where your Microsoft Purview account is housed.
    > - \<Account_Name>: Your Microsoft Purview account name
    > - \<Access_Token>: The token from the first two steps.

    ```bash
    curl 'https://management.azure.com/subscriptions/<Subscription_Id>/resourceGroups/<Resource_Group_Name>/providers/Microsoft.Purview/accounts/<Account_Name>?api-version=2021-07-01' -X PATCH -d'{"identity":{"type":"None"}}' -H "Content-Type: application/json" -H "Authorization:Bearer <Access_Token>"
    ```

1. To enable your new system managed assigned identity (SAMI), run the following bash command:
  
    ```bash
    curl 'https://management.azure.com/subscriptions/<Subscription_Id>/resourceGroups/<Resource_Group_Name>/providers/Microsoft.Purview/accounts/<Account_Name>?api-version=2021-07-01' -X PATCH -d '{"identity":{"type":"SystemAssigned"}}' -H "Content-Type: application/json" -H "Authorization:Bearer <Access_Token>"
    ```

1. If you had a user assigned managed identity (UAMI), to enable one on your new tenant, register your UAMI in Microsoft Purview as you did originally by following [the steps from the manage credentials article](manage-credentials.md#create-a-user-assigned-managed-identity).

## Next steps

- [Collections best practices](concept-best-practices-collections.md)
- [Navigate the home page and search for an asset](tutorial-asset-search.md)
